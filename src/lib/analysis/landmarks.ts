"use client";

import type { FaceLandmarker } from "@mediapipe/tasks-vision";
import type { Landmark3D } from "./types";

const WASM_CDN =
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm";
const MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task";

let landmarkerPromise: Promise<FaceLandmarker> | null = null;

export async function getFaceLandmarker(): Promise<FaceLandmarker> {
  if (!landmarkerPromise) {
    landmarkerPromise = initLandmarker();
  }
  return landmarkerPromise;
}

async function initLandmarker(): Promise<FaceLandmarker> {
  const { FaceLandmarker, FilesetResolver } = await import(
    "@mediapipe/tasks-vision"
  );
  const vision = await FilesetResolver.forVisionTasks(WASM_CDN);
  return FaceLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: MODEL_URL,
      delegate: "GPU",
    },
    runningMode: "IMAGE",
    numFaces: 1,
    outputFaceBlendshapes: false,
    outputFacialTransformationMatrixes: true,
  });
}

export function loadImageFromDataUrl(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = dataUrl;
  });
}

export async function detectLandmarks(
  dataUrl: string
): Promise<{
  landmarks: Landmark3D[];
  matrix: Float32Array | number[] | null;
  faceCount: number;
}> {
  const [landmarker, img] = await Promise.all([
    getFaceLandmarker(),
    loadImageFromDataUrl(dataUrl),
  ]);

  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable");
  ctx.drawImage(img, 0, 0);

  const result = landmarker.detect(canvas);
  const faceCount = result.faceLandmarks?.length ?? 0;

  if (faceCount === 0) {
    return { landmarks: [], matrix: null, faceCount: 0 };
  }

  const landmarks = result.faceLandmarks[0].map((p) => ({
    x: p.x,
    y: p.y,
    z: p.z,
  }));

  const matrix = result.facialTransformationMatrixes?.[0]?.data ?? null;
  return { landmarks, matrix, faceCount };
}

/** MediaPipe Face Mesh landmark indices */
export const LM = {
  forehead: 10,
  noseTip: 1,
  chin: 152,
  leftEyeOuter: 33,
  leftEyeInner: 133,
  rightEyeOuter: 263,
  rightEyeInner: 362,
  leftMouth: 61,
  rightMouth: 291,
  upperLip: 13,
  lowerLip: 14,
  leftJaw: 234,
  rightJaw: 454,
  leftCheek: 50,
  rightCheek: 280,
  leftBrow: 70,
  rightBrow: 300,
  noseLeft: 98,
  noseRight: 327,
  noseBridge: 6,
  leftTemple: 127,
  rightTemple: 356,
} as const;

export function getLandmark(landmarks: Landmark3D[], index: number): Landmark3D {
  return landmarks[index] ?? { x: 0, y: 0, z: 0 };
}

export function dist(a: Landmark3D, b: Landmark3D): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function dist3(a: Landmark3D, b: Landmark3D): number {
  return Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
}

export function angleAt(b: Landmark3D, a: Landmark3D, c: Landmark3D): number {
  const ab = { x: a.x - b.x, y: a.y - b.y };
  const cb = { x: c.x - b.x, y: c.y - b.y };
  const dot = ab.x * cb.x + ab.y * cb.y;
  const mag = Math.hypot(ab.x, ab.y) * Math.hypot(cb.x, cb.y);
  if (mag === 0) return 0;
  return (Math.acos(Math.min(1, Math.max(-1, dot / mag))) * 180) / Math.PI;
}

export function extractPose(matrix: Float32Array | number[] | null): {
  yaw: number;
  pitch: number;
  roll: number;
} {
  if (!matrix || matrix.length < 16) return { yaw: 0, pitch: 0, roll: 0 };
  const m = matrix;
  const yaw = (Math.atan2(m[8], m[0]) * 180) / Math.PI;
  const pitch = (Math.asin(-m[9]) * 180) / Math.PI;
  const roll = (Math.atan2(m[1], m[5]) * 180) / Math.PI;
  return { yaw, pitch, roll };
}
