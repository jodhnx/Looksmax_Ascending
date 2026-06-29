import type { AnalysisResult, CategoryScores, FaceMetrics } from "./types";
import {
  computeAscendScore,
  computeConfidenceInterval,
  metricsToCategoryScores,
} from "./geometry";
import { getFocusAreaDE } from "@/lib/i18n/de";

const STRENGTH_LABELS: Record<keyof CategoryScores, string> = {
  facialHarmony: "Ausgewogene Gesichtsproportionen",
  symmetry: "Gute Gesichtssymmetrie",
  jawDefinition: "Definierte Kieferlinie",
  chin: "Starke Kinnprojektion",
  skin: "Gesunder Hautbild-Eindruck",
  posture: "Aufrechte Nacken- und Kopfhaltung",
  eyeArea: "Harmonische Augenpartie",
  hair: "Gepflegte Haarlinie",
  presentation: "Starke Foto-Präsentation",
};

const WEAKNESS_LABELS: Record<keyof CategoryScores, string> = {
  facialHarmony: "Gesichtsproportionen",
  symmetry: "Gesichtssymmetrie",
  jawDefinition: "Kieferdefinition",
  chin: "Kinnprojektion",
  skin: "Hautbild & Textur",
  posture: "Haltung & Forward Head",
  eyeArea: "Augenpartie",
  hair: "Haarlinie & Styling",
  presentation: "Fotoqualität",
};

const IMPROVEMENT_TIPS: Record<keyof CategoryScores, string> = {
  facialHarmony:
    "Haltung und Körperzusammensetzung verbessern die Gesichtsproportionen sichtbar",
  symmetry:
    "Auf dem Rücken schlafen, gleichmäßig kauen, Gesichtsmuskel-Balance üben",
  jawDefinition:
    "Gesichtsödeme reduzieren, Nacken-/Kiefertraining, Körperfett im Zielbereich halten",
  chin: "Chin Tucks, korrekte Zungenhaltung, Nackenstreckübungen täglich",
  skin: "Konsequente AM/PM-Hautpflege, SPF, Hydration und 7–8h Schlaf",
  posture: "Chin Tucks, Wall Angels, Oberrücken 2× täglich kräftigen",
  eyeArea: "7–8h Schlaf, kalte Kompressen, Augenpflege mit Koffein",
  hair: "Regelmäßiger Haarschnitt, Kopfhautpflege, saubere Haarlinie",
  presentation: "Natürliches Licht und neutraler Hintergrund für Fortschrittsfotos",
};

export function getWeakestCategory(categories: CategoryScores): keyof CategoryScores {
  const sorted = (Object.entries(categories) as [keyof CategoryScores, number][]).sort(
    ([, a], [, b]) => a - b
  );
  return sorted[0][0];
}

function buildInsights(categories: CategoryScores): {
  strengths: string[];
  weaknesses: string[];
  topImprovements: string[];
  focusKey: keyof CategoryScores;
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
  const topImprovements = weak.slice(0, 3).map(([k]) => IMPROVEMENT_TIPS[k]);
  const focusKey = getWeakestCategory(categories);

  if (strengths.length === 0) {
    strengths.push("Solide Basis für messbare Verbesserung");
  }
  if (weaknesses.length === 0) {
    weaknesses.push("Feintuning für inkrementelle Gewinne");
  }
  if (topImprovements.length === 0) {
    topImprovements.push(
      "Tägliche Hautpflege und Haltungsroutine beibehalten",
      "Hydration und Schlaf priorisieren",
      "Wöchentliche Fortschrittsfotos dokumentieren"
    );
  }

  return { strengths, weaknesses, topImprovements, focusKey };
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
  const { strengths, weaknesses, topImprovements, focusKey } = buildInsights(categories);

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
    summary: `Dein ASCEND Score liegt bei ${ascendScore} (Schätzbereich ${low}–${high}). Das ist eine Orientierung zur Selbstverbesserung basierend auf Gesichtsgeometrie — keine objektive Attraktivitätsbewertung. Fokus für die nächsten 30 Tage: ${getFocusAreaDE(focusKey)}.`,
  };
}

function clamp(n: number, min = 0, max = 100): number {
  return Math.min(max, Math.max(min, n));
}
