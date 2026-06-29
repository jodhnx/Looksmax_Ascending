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

  if (sharpness < MIN_SHARPNESS) {
    errors.push("Image is too blurry — hold steady and refocus");
  }
  if (brightness < 40) {
    errors.push("Image too dark — use better lighting");
  }
  if (brightness > 230) {
    errors.push("Image overexposed — reduce brightness");
  }

  let qualityScore = 100;
  if (sharpness < MIN_SHARPNESS * 1.5) qualityScore -= 25;
  if (brightness < 50 || brightness > 220) qualityScore -= 20;
  qualityScore = Math.max(0, Math.min(100, qualityScore));

  if (qualityScore < MIN_QUALITY && errors.length === 0) {
    errors.push("Image quality too low — retake with better lighting");
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
    errors.push("Face detection failed — ensure your face is clearly visible");
  }

  if (faceCount === 0) {
    errors.push("No face detected — center your face in the frame");
  } else if (faceCount > 1) {
    errors.push("Multiple faces detected — only one person allowed");
  }

  if (landmarks.length > 0 && faceCount === 1) {
    const leftEye = getLandmark(landmarks, LM.leftEyeOuter);
    const rightEye = getLandmark(landmarks, LM.rightEyeOuter);
    const nose = getLandmark(landmarks, LM.noseTip);
    const chin = getLandmark(landmarks, LM.chin);
    const forehead = getLandmark(landmarks, LM.forehead);

    if (chin.y < nose.y || forehead.y > nose.y) {
      errors.push("Entire face must be visible in frame");
    }

    const eyeOpen = Math.abs(leftEye.y - rightEye.y) < 0.08;
    if (!eyeOpen && slotType === "FRONT_FACE") {
      errors.push("Eyes must be visible and open");
    }

    if (slotType === "FRONT_FACE") {
      if (Math.abs(yaw) > 20) {
        errors.push("Face must be front-facing — look straight at the camera");
      }
      if (Math.abs(roll) > 15) {
        errors.push("Keep your head level — avoid tilting");
      }
    } else {
      if (Math.abs(yaw) < 35) {
        errors.push("Turn further to show your side profile (90° angle)");
      }
    }

    const faceHeight = Math.abs(chin.y - forehead.y);
    if (faceHeight < 0.25) {
      errors.push("Move closer — face too small in frame");
    }
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
