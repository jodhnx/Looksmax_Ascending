"use client";

import { useCallback } from "react";
import { useStorage } from "./use-storage";
import type { NutritionPlan, Statistic } from "@/lib/storage/types";
import { todayKey } from "@/lib/storage/helpers";
import { getCurrentPlanDay } from "@/lib/storage/helpers";

export function useNutrition() {
  const { data, update } = useStorage();
  const today = todayKey();
  const todayStat = data.statistics.find((s) => s.date === today);
  const currentDay = getCurrentPlanDay(data);
  const planDay = data.ascensionPlans[currentDay - 1];
  const todayNutrition = planDay?.nutrition;

  const updateTodayStats = useCallback(
    (stats: Partial<Statistic>) =>
      update((prev) => {
        const existing = prev.statistics.find((s) => s.date === today);
        const nextStat = { date: today, ...existing, ...stats };
        return {
          ...prev,
          statistics: existing
            ? prev.statistics.map((s) => (s.date === today ? nextStat : s))
            : [...prev.statistics, nextStat],
        };
      }),
    [update, today]
  );

  const setNutritionPlan = useCallback(
    (plan: NutritionPlan) =>
      update((prev) => {
        const filtered = prev.nutritionPlans.filter((p) => p.date !== plan.date);
        return { ...prev, nutritionPlans: [...filtered, plan] };
      }),
    [update]
  );

  return {
    statistics: data.statistics,
    measurements: data.measurements,
    nutritionPlans: data.nutritionPlans,
    todayStat,
    todayNutrition,
    weightHistory: data.statistics
      .filter((s) => s.weightKg != null)
      .map((s) => ({ date: s.date, weightKg: s.weightKg! })),
    updateTodayStats,
    setNutritionPlan,
  };
}
