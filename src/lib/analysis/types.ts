export interface Landmark3D {
  x: number;
  y: number;
  z: number;
}

export interface FaceMetrics {
  jawWidth: number;
  jawAngle: number;
  jawSharpness: number;
  chinProjection: number;
  faceWidth: number;
  faceHeight: number;
  facialThirdsUpper: number;
  facialThirdsMiddle: number;
  facialThirdsLower: number;
  facialFifths: number;
  goldenRatio: number;
  symmetryScore: number;
  eyeSpacing: number;
  eyeTilt: number;
  eyebrowSymmetry: number;
  cheekboneProminence: number;
  foreheadHeight: number;
  lipRatio: number;
  noseWidth: number;
  noseLength: number;
  neckAngle: number;
  forwardHeadPosture: number;
  headTilt: number;
  hairlinePosition: number;
  skinTexture: number;
  acneVisibility: number;
  darkCircles: number;
  facialFat: number;
  imageQuality: number;
  yaw: number;
  pitch: number;
  roll: number;
}

export interface CategoryScores {
  facialHarmony: number;
  symmetry: number;
  jawDefinition: number;
  chin: number;
  skin: number;
  posture: number;
  eyeArea: number;
  hair: number;
  presentation: number;
}

export interface AnalysisScores extends CategoryScores {
  facialSymmetry: number;
  jawDefinition: number;
  chinProjection: number;
  cheekboneProminence: number;
  facialProportions: number;
  eyeArea: number;
  eyebrowShape: number;
  skinAppearance: number;
  posture: number;
  hairPresentation: number;
  facialHarmony: number;
}

export interface AnalysisResult {
  ascendScore: number;
  looksScore: number;
  improvementPotential: number;
  estimatedImprovementPotential: number;
  confidenceLow: number;
  confidenceHigh: number;
  scores: AnalysisScores;
  metrics: FaceMetrics;
  strengths: string[];
  weaknesses: string[];
  topImprovements: string[];
  summary: string;
}

import type { EvidenceLevel, TaskCategory } from "@/lib/exercises/types";
import type { TimeOfDay } from "@/lib/exercises/habit-details";

export interface PlanTask {
  id: string;
  habitId: string;
  title: string;
  description: string;
  category: TaskCategory;
  durationMinutes: number;
  difficulty: "leicht" | "mittel" | "schwer";
  xp: number;
  icon: string;
  evidenceLevel: EvidenceLevel;
  reason: string;
  steps: string[];
  benefits: string[];
  hints: string[];
  frequency: string;
  targetGoals: string[];
  estimatedImpact: string;
  timeOfDay: TimeOfDay;
  completed?: boolean;
}

export interface PlanFaceSection {
  evidenceBased: PlanTask[];
  optional: PlanTask[];
  disclaimer: string;
}

export interface PlanDay {
  dayNumber: number;
  weekNumber: number;
  weekday: string;
  title: string;
  phase: string;
  focus: string;
  focusReason: string;
  dailyQuote: string;
  todayFocus: string;
  estimatedImprovement: string;
  xpAvailable: number;
  completionReward: string;
  weeklyGoal: string;
  tasks: PlanTask[];
  faceSection?: PlanFaceSection;
  nutrition: { protein: number; water: number; calories: number };
  /** @deprecated Legacy sections — derived from tasks for backward compatibility */
  morningRoutine: string[];
  skincare: string[];
  exercises: string[];
  gym: string[];
  habits: string[];
  eveningRoutine: string[];
  neckPosture?: string[];
  stretching?: string[];
  facialMassage?: string[];
  stressManagement?: string[];
  haircare?: string[];
  grooming?: string[];
  confidence?: string[];
  lifestyle?: string[];
  recovery?: string[];
}

export type PhotoSlotType = "FRONT_FACE" | "SIDE_PROFILE";

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  qualityScore: number;
  landmarks?: Landmark3D[];
  metrics?: Partial<FaceMetrics>;
}
