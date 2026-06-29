import type { AnalysisResult, PlanDay } from "@/lib/analysis/types";

export type PhotoSlotType = "FRONT_FACE" | "SIDE_PROFILE";

export type Theme = "dark" | "light";

export interface StoredPhoto {
  id: string;
  type: PhotoSlotType;
  url: string;
  qualityScore?: number;
  isProgressPhoto?: boolean;
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
  durationMinutes?: number;
  difficulty?: "leicht" | "mittel" | "schwer";
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
  postureImprovement?: number;
  harmonyImprovement?: number;
  bodyfatChange?: number;
  confidenceTrend?: number;
  completedTasksImpact?: string;
  notes: string;
  faceComparison: { before: string; after: string };
  sideComparison?: { before: string; after: string };
  createdAt: string;
}

export type WeeklyReport = ProgressCheck;

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

export interface Measurement {
  id: string;
  date: string;
  weightKg?: number;
  bodyfat?: number;
  chestCm?: number;
  waistCm?: number;
  hipsCm?: number;
  armsCm?: number;
  notes?: string;
}

export interface WorkoutPlan {
  id: string;
  date: string;
  title: string;
  exercises: string[];
  completed: boolean;
}

export interface NutritionPlan {
  date: string;
  protein: number;
  water: number;
  calories: number;
  meals: string[];
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
  weeklyReports: WeeklyReport[];
  userChallenges: UserChallenge[];
  statistics: Statistic[];
  measurements: Measurement[];
  workoutPlans: WorkoutPlan[];
  nutritionPlans: NutritionPlan[];
  notificationPrefs: NotificationPrefs;
  messages: ChatMessage[];
  isPremium: boolean;
  analysisCount: number;
  theme: Theme;
  lastBackupAt: string | null;
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
  weeklyReports: [],
  userChallenges: [],
  statistics: [],
  measurements: [],
  workoutPlans: [],
  nutritionPlans: [],
  notificationPrefs: DEFAULT_NOTIFICATION_PREFS,
  messages: [],
  isPremium: false,
  analysisCount: 0,
  theme: "dark",
  lastBackupAt: null,
};
