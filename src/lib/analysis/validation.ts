"use client";

import type { PhotoSlotType, ValidationResult } from "./types";
import {
  detectLandmarks,
  extractPose,
  getLandmark,
  LM,
} from "./landmarks";
import {
  compressImage,
  estimateUnderEyeDarkness,
  measureBrightness,
  measureSharpness,
  sampleSkinTexture,
} from "./image-utils";
import { computeMetrics } from "./geometry";
import { de } from "@/lib/i18n/de";

const MIN_SHARPNESS = 35;
const MIN_QUALITY = 65;

export async function validatePhoto(
  file: File,
  slotType: PhotoSlotType
): Promise<ValidationResult & { url: string }> {
  const errors: string[] = [];
  const rawUrl = await readFileAsDataUrl(file);
  const url = await compressImage(rawUrl);

  const [sharpness, brightness] = await Promise.all([
    measureSharpness(url),
    measureBrightness(url),
  ]);

  if (sharpness < MIN_SHARPNESS) errors.push(de.errors.blurry);
  if (brightness < 40) errors.push(de.errors.dark);
  if (brightness > 230) errors.push(de.errors.bright);

  let qualityScore = 100;
  if (sharpness < MIN_SHARPNESS * 1.5) qualityScore -= 25;
  if (brightness < 50 || brightness > 220) qualityScore -= 20;
  qualityScore = Math.max(0, Math.min(100, qualityScore));

  if (qualityScore < MIN_QUALITY && errors.length === 0) {
    errors.push(de.errors.qualityLow);
  }

  let landmarks: Awaited<ReturnType<typeof detectLandmarks>>["landmarks"] = [];
  let yaw = 0;
  let pitch = 0;
  let roll = 0;
  let faceCount = 0;

  try {
    const detection = await detectLandmarks(url);
    landmarks = detection.landmarks;
    faceCount = detection.faceCount;
    const pose = extractPose(detection.matrix);
    yaw = pose.yaw;
    pitch = pose.pitch;
    roll = pose.roll;
  } catch {
    errors.push(de.errors.noFace);
  }

  if (faceCount === 0) {
    errors.push(de.errors.noFace);
  } else if (faceCount > 1) {
    errors.push(de.errors.multiFace);
  }

  if (landmarks.length > 0 && faceCount === 1) {
    const leftEye = getLandmark(landmarks, LM.leftEyeOuter);
    const rightEye = getLandmark(landmarks, LM.rightEyeOuter);
    const nose = getLandmark(landmarks, LM.noseTip);
    const chin = getLandmark(landmarks, LM.chin);
    const forehead = getLandmark(landmarks, LM.forehead);

    if (chin.y < nose.y || forehead.y > nose.y) {
      errors.push(de.errors.faceHidden);
    }

    const eyeOpen = Math.abs(leftEye.y - rightEye.y) < 0.08;
    if (!eyeOpen && slotType === "FRONT_FACE") {
      errors.push(de.errors.eyesHidden);
    }

    if (slotType === "FRONT_FACE") {
      if (Math.abs(yaw) > 20) errors.push(de.errors.wrongAngleFront);
      if (Math.abs(roll) > 15) errors.push(de.errors.headTilt);
    } else {
      if (Math.abs(yaw) < 35) errors.push(de.errors.wrongAngleSide);
    }

    const faceHeight = Math.abs(chin.y - forehead.y);
    if (faceHeight < 0.25) errors.push(de.errors.small);
  }

  const skinRegions =
    landmarks.length > 0
      ? [
          getLandmark(landmarks, LM.leftCheek),
          getLandmark(landmarks, LM.rightCheek),
        ]
      : [];

  const skinTexture =
    skinRegions.length > 0
      ? await sampleSkinTexture(url, skinRegions)
      : 50;

  const darkCircles =
    landmarks.length > 0
      ? await estimateUnderEyeDarkness(
          url,
          getLandmark(landmarks, LM.leftEyeOuter),
          getLandmark(landmarks, LM.rightEyeOuter)
        )
      : 30;

  const metrics =
    landmarks.length > 0
      ? computeMetrics(
          landmarks,
          sharpness,
          brightness,
          skinTexture,
          darkCircles,
          yaw,
          pitch,
          roll,
          slotType === "SIDE_PROFILE"
        )
      : undefined;

  return {
    valid: errors.length === 0 && qualityScore >= MIN_QUALITY && faceCount === 1,
    errors,
    qualityScore,
    url,
    landmarks,
    metrics,
  };
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}
