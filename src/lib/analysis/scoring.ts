import type { AnalysisResult, CategoryScores, FaceMetrics } from "./types";
import {
  computeAscendScore,
  computeConfidenceInterval,
  metricsToCategoryScores,
} from "./geometry";

const STRENGTH_LABELS: Record<keyof CategoryScores, string> = {
  facialHarmony: "Balanced facial proportions",
  symmetry: "Good left-right facial symmetry",
  jawDefinition: "Defined jaw contour",
  chin: "Strong chin projection",
  skin: "Healthy skin appearance",
  posture: "Upright neck and head posture",
  eyeArea: "Well-proportioned eye area",
  hair: "Clean hairline presentation",
  presentation: "Strong overall photo presentation",
};

const WEAKNESS_LABELS: Record<keyof CategoryScores, string> = {
  facialHarmony: "Facial proportion balance",
  symmetry: "Facial symmetry",
  jawDefinition: "Jaw definition",
  chin: "Chin projection",
  skin: "Skin clarity and texture",
  posture: "Neck posture and head position",
  eyeArea: "Eye area balance",
  hair: "Hairline and grooming",
  presentation: "Photo quality and presentation",
};

const IMPROVEMENT_TIPS: Record<keyof CategoryScores, string> = {
  facialHarmony: "Focus on posture and body composition to support facial proportions",
  symmetry: "Sleep on your back, chew evenly, and practice facial muscle balance exercises",
  jawDefinition: "Reduce facial bloating, train neck/jaw muscles, maintain low body fat",
  chin: "Practice chin tucks, mewing posture, and neck extension exercises",
  skin: "Consistent AM/PM skincare, SPF daily, hydration, and quality sleep",
  posture: "Chin tucks, wall angels, and upper-back strengthening 2x daily",
  eyeArea: "Prioritize 7-8h sleep, cold compresses, and caffeine eye care",
  hair: "Regular haircuts, scalp care, and clean hairline grooming",
  presentation: "Use natural lighting and neutral backgrounds for progress photos",
};

function buildInsights(categories: CategoryScores): {
  strengths: string[];
  weaknesses: string[];
  topImprovements: string[];
} {
  const sorted = (Object.entries(categories) as [keyof CategoryScores, number][]).sort(
    ([, a], [, b]) => b - a
  );

  const strengths = sorted
    .filter(([, v]) => v >= 62)
    .slice(0, 4)
    .map(([k]) => STRENGTH_LABELS[k]);

  const weak = sorted
    .filter(([, v]) => v < 58)
    .slice(-4)
    .reverse();

  const weaknesses = weak.map(([k]) => WEAKNESS_LABELS[k]);
  const topImprovements = weak
    .slice(0, 3)
    .map(([k]) => IMPROVEMENT_TIPS[k]);

  if (strengths.length === 0) {
    strengths.push("Consistent baseline for measurable improvement");
  }
  if (weaknesses.length === 0) {
    weaknesses.push("Fine-tuning habits for incremental gains");
  }
  if (topImprovements.length === 0) {
    topImprovements.push(
      "Maintain daily skincare and posture routine",
      "Stay consistent with hydration and sleep",
      "Track weekly progress photos"
    );
  }

  return { strengths, weaknesses, topImprovements };
}

export function buildAnalysisResult(
  frontMetrics: FaceMetrics,
  profileMetrics: FaceMetrics
): AnalysisResult {
  const blended: FaceMetrics = {
    ...frontMetrics,
    jawSharpness: (frontMetrics.jawSharpness + profileMetrics.jawSharpness) / 2,
    chinProjection: profileMetrics.chinProjection,
    neckAngle: profileMetrics.neckAngle,
    forwardHeadPosture: profileMetrics.forwardHeadPosture,
    skinTexture: (frontMetrics.skinTexture + profileMetrics.skinTexture) / 2,
    darkCircles: frontMetrics.darkCircles,
    acneVisibility: (frontMetrics.acneVisibility + profileMetrics.acneVisibility) / 2,
    imageQuality: (frontMetrics.imageQuality + profileMetrics.imageQuality) / 2,
  };

  const categories = metricsToCategoryScores(blended);
  const ascendScore = computeAscendScore(categories);
  const { low, high } = computeConfidenceInterval(ascendScore, blended.imageQuality);
  const { strengths, weaknesses, topImprovements } = buildInsights(categories);

  const improvementPotential = clamp(
    Math.round(100 - ascendScore * 0.55 + categories.posture * 0.15 + categories.skin * 0.1)
  );

  const scores = {
    ...categories,
    facialSymmetry: categories.symmetry,
    jawDefinition: categories.jawDefinition,
    chinProjection: categories.chin,
    cheekboneProminence: blended.cheekboneProminence,
    facialProportions: categories.facialHarmony,
    eyebrowShape: blended.eyebrowSymmetry,
    skinAppearance: categories.skin,
    hairPresentation: categories.hair,
  };

  return {
    ascendScore,
    looksScore: ascendScore,
    improvementPotential,
    estimatedImprovementPotential: improvementPotential,
    confidenceLow: low,
    confidenceHigh: high,
    scores,
    metrics: blended,
    strengths,
    weaknesses,
    topImprovements,
    summary: `Your ASCEND SCORE is ${ascendScore} (estimate range ${low}–${high}). This is a self-improvement tracking estimate based on facial geometry and image analysis — not an objective attractiveness rating. Focus on your top improvement areas for the next 30 days.`,
  };
}

function clamp(n: number, min = 0, max = 100): number {
  return Math.min(max, Math.max(min, n));
}
