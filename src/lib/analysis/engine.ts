"use client";

import type { AnalysisResult, PhotoSlotType } from "./types";
import { detectLandmarks, extractPose, getLandmark, LM } from "./landmarks";
import {
  estimateUnderEyeDarkness,
  measureBrightness,
  measureSharpness,
  sampleSkinTexture,
} from "./image-utils";
import { computeMetrics } from "./geometry";
import { buildAnalysisResult } from "./scoring";
import { validatePhoto } from "./validation";

export async function runFullAnalysis(
  frontUrl: string,
  profileUrl: string
): Promise<AnalysisResult> {
  const [front, profile] = await Promise.all([
    analyzeSingle(frontUrl, "FRONT_FACE"),
    analyzeSingle(profileUrl, "SIDE_PROFILE"),
  ]);
  return buildAnalysisResult(front, profile);
}

async function analyzeSingle(url: string, type: PhotoSlotType) {
  const [sharpness, brightness, detection] = await Promise.all([
    measureSharpness(url),
    measureBrightness(url),
    detectLandmarks(url),
  ]);

  const { landmarks, matrix } = detection;
  if (landmarks.length === 0) {
    throw new Error(`No face detected in ${type} photo`);
  }

  const { yaw, pitch, roll } = extractPose(matrix);
  const skinTexture = await sampleSkinTexture(url, [
    getLandmark(landmarks, LM.leftCheek),
    getLandmark(landmarks, LM.rightCheek),
  ]);
  const darkCircles = await estimateUnderEyeDarkness(
    url,
    getLandmark(landmarks, LM.leftEyeOuter),
    getLandmark(landmarks, LM.rightEyeOuter)
  );

  return computeMetrics(
    landmarks,
    sharpness,
    brightness,
    skinTexture,
    darkCircles,
    yaw,
    pitch,
    roll,
    type === "SIDE_PROFILE"
  );
}

export { validatePhoto };
