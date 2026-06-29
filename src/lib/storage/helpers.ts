import { startOfDay } from "@/lib/utils";
import type { AppData } from "@/lib/storage/types";

export function todayKey(): string {
  return startOfDay().toISOString().split("T")[0];
}

export function getDashboardFromStorage(data: AppData) {
  const latestAnalysis = data.analyses[data.analyses.length - 1] ?? null;
  const previousAnalysis =
    data.analyses.length > 1 ? data.analyses[data.analyses.length - 2] : null;
  const today = todayKey();
  const dailyTask = data.dailyTasks[today] ?? null;
  const todayStat = data.statistics.find((s) => s.date === today) ?? null;
  const activeChallenge =
    data.userChallenges.find((c) => !c.completed) ?? null;

  const weeklyImprovement =
    latestAnalysis && previousAnalysis
      ? (latestAnalysis.ascendScore ?? latestAnalysis.looksScore) -
        (previousAnalysis.ascendScore ?? previousAnalysis.looksScore)
      : 0;

  return {
    profile: data.profile,
    latestAnalysis,
    dailyTask,
    todayStat,
    activeChallenge,
    weeklyImprovement,
    isPremium: data.isPremium,
    onboardingComplete: data.onboardingComplete,
  };
}

export function getCurrentPlanDay(data: AppData): number {
  if (!data.planStartDate || !data.ascensionPlans.length) return 1;
  const start = new Date(data.planStartDate);
  const days = Math.floor(
    (Date.now() - start.getTime()) / (1000 * 60 * 60 * 24)
  );
  return Math.min(Math.max(days + 1, 1), data.ascensionPlans.length);
}
