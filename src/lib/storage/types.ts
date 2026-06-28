import type { AnalysisResult, PlanDay } from "@/lib/openai";

export type PhotoSlotType =
  | "FRONT_FACE"
  | "LEFT_SIDE"
  | "RIGHT_SIDE"
  | "SMILE"
  | "NEUTRAL"
  | "FULL_BODY_FRONT"
  | "FULL_BODY_SIDE";

export interface StoredPhoto {
  id: string;
  type: PhotoSlotType;
  url: string;
  qualityScore?: number;
  createdAt: string;
}

export interface StoredAnalysis extends AnalysisResult {
  id: string;
  photoIds: string[];
  createdAt: string;
}

export interface Profile {
  age?: number;
  heightCm?: number;
  weightKg?: number;
  gender?: string;
  goal?: string;
  bodyfatEstimate?: number;
  gymExperience?: string;
  sleepHours?: number;
  waterIntakeL?: number;
  skincare?: string;
  hairType?: string;
  beardGrowth?: string;
  jawVisibility?: string;
  teethCondition?: string;
  eyeArea?: string;
  acne?: string;
  faceSymmetry?: string;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string | null;
}

export interface DailyTaskItem {
  id: string;
  label: string;
  completed: boolean;
  category?: string;
}

export interface DailyTaskRecord {
  date: string;
  tasks: DailyTaskItem[];
  completed: number;
  total: number;
}

export interface ProgressCheck {
  id: string;
  weekNumber: number;
  improvementPercent: number;
  skinImprovement: number;
  jawImprovement: number;
  bodyfatChange: number;
  confidenceTrend: number;
  notes: string;
  faceComparison: { before: string; after: string };
  createdAt: string;
}

export interface UserChallenge {
  id: string;
  challengeType: string;
  title: string;
  startDate: string;
  endDate: string;
  progress: number;
  completed: boolean;
}

export interface Statistic {
  date: string;
  weightKg?: number;
  bodyfat?: number;
  faceScore?: number;
  skinScore?: number;
  jawScore?: number;
  sleepHours?: number;
  waterLiters?: number;
  workoutDone?: boolean;
  calories?: number;
  proteinGrams?: number;
  steps?: number;
}

export interface NotificationPrefs {
  morningReminder: boolean;
  workoutReminder: boolean;
  skincareReminder: boolean;
  waterReminder: boolean;
  sleepReminder: boolean;
  weeklyPhoto: boolean;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

export interface AppData {
  onboardingComplete: boolean;
  profile: Profile | null;
  photos: StoredPhoto[];
  analyses: StoredAnalysis[];
  ascensionPlans: PlanDay[];
  planStartDate: string | null;
  dailyTasks: Record<string, DailyTaskRecord>;
  progressChecks: ProgressCheck[];
  userChallenges: UserChallenge[];
  statistics: Statistic[];
  notificationPrefs: NotificationPrefs;
  messages: ChatMessage[];
  isPremium: boolean;
  analysisCount: number;
}

export const DEFAULT_NOTIFICATION_PREFS: NotificationPrefs = {
  morningReminder: true,
  workoutReminder: true,
  skincareReminder: true,
  waterReminder: true,
  sleepReminder: true,
  weeklyPhoto: true,
};

export const DEFAULT_APP_DATA: AppData = {
  onboardingComplete: false,
  profile: null,
  photos: [],
  analyses: [],
  ascensionPlans: [],
  planStartDate: null,
  dailyTasks: {},
  progressChecks: [],
  userChallenges: [],
  statistics: [],
  notificationPrefs: DEFAULT_NOTIFICATION_PREFS,
  messages: [],
  isPremium: false,
  analysisCount: 0,
};
