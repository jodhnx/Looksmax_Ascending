import type { FaceMetrics, Landmark3D } from "./types";
import { LM, angleAt, dist, dist3, getLandmark } from "./landmarks";

const PHI = 1.618;

function clamp(n: number, min = 0, max = 100): number {
  return Math.min(max, Math.max(min, n));
}

function scoreRatio(value: number, ideal: number, tolerance: number): number {
  const diff = Math.abs(value - ideal) / tolerance;
  return clamp(100 - diff * 40);
}

function mirrorX(p: Landmark3D, midX: number): Landmark3D {
  return { x: midX + (midX - p.x), y: p.y, z: p.z };
}

export function computeMetrics(
  landmarks: Landmark3D[],
  sharpness: number,
  brightness: number,
  skinTexture: number,
  darkCircles: number,
  yaw: number,
  pitch: number,
  roll: number,
  isProfile: boolean
): FaceMetrics {
  const forehead = getLandmark(landmarks, LM.forehead);
  const chin = getLandmark(landmarks, LM.chin);
  const noseTip = getLandmark(landmarks, LM.noseTip);
  const leftEye = getLandmark(landmarks, LM.leftEyeOuter);
  const rightEye = getLandmark(landmarks, LM.rightEyeOuter);
  const leftMouth = getLandmark(landmarks, LM.leftMouth);
  const rightMouth = getLandmark(landmarks, LM.rightMouth);
  const leftJaw = getLandmark(landmarks, LM.leftJaw);
  const rightJaw = getLandmark(landmarks, LM.rightJaw);
  const leftCheek = getLandmark(landmarks, LM.leftCheek);
  const rightCheek = getLandmark(landmarks, LM.rightCheek);
  const leftBrow = getLandmark(landmarks, LM.leftBrow);
  const rightBrow = getLandmark(landmarks, LM.rightBrow);
  const noseLeft = getLandmark(landmarks, LM.noseLeft);
  const noseRight = getLandmark(landmarks, LM.noseRight);
  const noseBridge = getLandmark(landmarks, LM.noseBridge);

  const faceWidth = dist(leftJaw, rightJaw);
  const faceHeight = dist(forehead, chin);
  const jawWidth = dist(leftJaw, rightJaw);
  const jawAngle = angleAt(chin, leftJaw, rightJaw);
  const jawSharpness = clamp((130 - jawAngle) * 2.5);

  const midX = (leftJaw.x + rightJaw.x) / 2;
  const upperThird = dist(forehead, noseBridge);
  const middleThird = dist(noseBridge, noseTip);
  const lowerThird = dist(noseTip, chin);
  const totalThirds = upperThird + middleThird + lowerThird;
  const facialThirdsUpper = upperThird / totalThirds;
  const facialThirdsMiddle = middleThird / totalThirds;
  const facialThirdsLower = lowerThird / totalThirds;

  const eyeSpacing = dist(leftEye, rightEye);
  const facialFifths = eyeSpacing / faceWidth;

  const goldenRatio = faceWidth / (faceHeight || 1);

  const pairs: [Landmark3D, Landmark3D][] = [
    [leftEye, mirrorX(rightEye, midX)],
    [leftMouth, mirrorX(rightMouth, midX)],
    [leftJaw, mirrorX(rightJaw, midX)],
    [leftCheek, mirrorX(rightCheek, midX)],
    [leftBrow, mirrorX(rightBrow, midX)],
  ];
  const symDiffs = pairs.map(([l, r]) => Math.abs(dist3(l, { x: midX, y: l.y, z: l.z }) - dist3(r, { x: midX, y: r.y, z: r.z })));
  const symmetryScore = clamp(100 - (symDiffs.reduce((a, b) => a + b, 0) / symDiffs.length) * 800);

  const eyeTilt =
    (Math.atan2(rightEye.y - leftEye.y, rightEye.x - leftEye.x) * 180) / Math.PI;
  const eyebrowSymmetry = clamp(
    100 - Math.abs(leftBrow.y - rightBrow.y) * 500
  );

  const cheekboneProminence = clamp(
    ((dist(leftCheek, leftJaw) + dist(rightCheek, rightJaw)) / 2) * 400
  );

  const foreheadHeight = dist(forehead, noseBridge) / faceHeight;
  const lipHeight = dist(getLandmark(landmarks, LM.upperLip), getLandmark(landmarks, LM.lowerLip));
  const mouthWidth = dist(leftMouth, rightMouth);
  const lipRatio = lipHeight / (mouthWidth || 1);

  const noseWidth = dist(noseLeft, noseRight);
  const noseLength = dist(noseBridge, noseTip);

  const chinProjection = isProfile
    ? clamp((chin.z - noseTip.z) * 400 + 50)
    : clamp(lowerThird / totalThirds * 200);

  const neckAngle = isProfile ? clamp(90 - Math.abs(pitch) * 2) : clamp(70 + jawSharpness * 0.2);
  const forwardHeadPosture = isProfile
    ? clamp(100 - Math.abs(chin.z - noseTip.z) * 300)
    : clamp(75 - Math.abs(yaw) * 0.5);

  const headTilt = clamp(100 - Math.abs(roll) * 3);
  const hairlinePosition = clamp(foreheadHeight * 180);

  const qualityFromImage = clamp(
    (sharpness / 80) * 35 + (brightness > 40 && brightness < 210 ? 35 : 10) + 30
  );
  const imageQuality = clamp(qualityFromImage);

  const acneVisibility = clamp(100 - skinTexture * 0.6);
  const facialFat = clamp(100 - jawSharpness * 0.4 - cheekboneProminence * 0.2);

  return {
    jawWidth,
    jawAngle,
    jawSharpness,
    chinProjection,
    faceWidth,
    faceHeight,
    facialThirdsUpper,
    facialThirdsMiddle,
    facialThirdsLower,
    facialFifths,
    goldenRatio,
    symmetryScore,
    eyeSpacing,
    eyeTilt,
    eyebrowSymmetry,
    cheekboneProminence,
    foreheadHeight,
    lipRatio,
    noseWidth,
    noseLength,
    neckAngle,
    forwardHeadPosture,
    headTilt,
    hairlinePosition,
    skinTexture,
    acneVisibility,
    darkCircles,
    facialFat,
    imageQuality,
    yaw,
    pitch,
    roll,
  };
}

export function metricsToCategoryScores(m: FaceMetrics): {
  facialHarmony: number;
  symmetry: number;
  jawDefinition: number;
  chin: number;
  skin: number;
  posture: number;
  eyeArea: number;
  hair: number;
  presentation: number;
} {
  const facialHarmony = clamp(
    scoreRatio(m.goldenRatio, PHI, 0.25) * 0.4 +
      scoreRatio(m.facialThirdsUpper, 0.33, 0.08) * 0.2 +
      scoreRatio(m.facialThirdsMiddle, 0.33, 0.08) * 0.2 +
      scoreRatio(m.facialThirdsLower, 0.33, 0.08) * 0.2
  );

  return {
    facialHarmony,
    symmetry: m.symmetryScore,
    jawDefinition: clamp(m.jawSharpness * 0.6 + (130 - m.jawAngle) * 0.8),
    chin: m.chinProjection,
    skin: clamp(m.skinTexture * 0.5 + (100 - m.acneVisibility) * 0.3 + (100 - m.darkCircles) * 0.2),
    posture: clamp(m.neckAngle * 0.4 + m.forwardHeadPosture * 0.4 + m.headTilt * 0.2),
    eyeArea: clamp(
      scoreRatio(m.eyeSpacing / (m.faceWidth || 1), 0.3, 0.1) * 0.5 +
        (100 - Math.abs(m.eyeTilt) * 4) * 0.3 +
        m.eyebrowSymmetry * 0.2
    ),
    hair: clamp(m.hairlinePosition * 0.7 + m.imageQuality * 0.3),
    presentation: clamp(m.imageQuality * 0.5 + m.symmetryScore * 0.3 + facialHarmony * 0.2),
  };
}

export const ASCEND_WEIGHTS = {
  facialHarmony: 0.15,
  symmetry: 0.14,
  jawDefinition: 0.14,
  chin: 0.1,
  skin: 0.12,
  posture: 0.1,
  eyeArea: 0.1,
  hair: 0.07,
  presentation: 0.08,
} as const;

export function computeAscendScore(categories: ReturnType<typeof metricsToCategoryScores>): number {
  let score = 0;
  for (const [key, weight] of Object.entries(ASCEND_WEIGHTS)) {
    score += categories[key as keyof typeof categories] * weight;
  }
  return clamp(Math.round(score));
}

export function computeConfidenceInterval(
  score: number,
  imageQuality: number
): { low: number; high: number } {
  const margin = clamp(12 - imageQuality / 12, 4, 12);
  return {
    low: clamp(Math.round(score - margin)),
    high: clamp(Math.round(score + margin)),
  };
}
