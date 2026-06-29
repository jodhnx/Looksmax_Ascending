"use client";

import { useCallback } from "react";
import { useStorage } from "./use-storage";
import type { PlanDay } from "@/lib/analysis/types";
import type { WorkoutPlan } from "@/lib/storage/types";
import { getCurrentPlanDay } from "@/lib/storage/helpers";

export function useWorkout() {
  const { data, update } = useStorage();

  const currentDay = getCurrentPlanDay(data);
  const todayPlan = data.ascensionPlans[currentDay - 1] as PlanDay | undefined;

  const setAscensionPlans = useCallback(
    (plans: PlanDay[]) =>
      update((prev) => ({
        ...prev,
        ascensionPlans: plans,
        planStartDate: new Date().toISOString(),
      })),
    [update]
  );

  const addWorkoutPlan = useCallback(
    (plan: WorkoutPlan) =>
      update((prev) => ({
        ...prev,
        workoutPlans: [...prev.workoutPlans, plan],
      })),
    [update]
  );

  const toggleWorkoutDone = useCallback(
    (date: string, done: boolean) =>
      update((prev) => ({
        ...prev,
        statistics: prev.statistics.some((s) => s.date === date)
          ? prev.statistics.map((s) =>
              s.date === date ? { ...s, workoutDone: done } : s
            )
          : [...prev.statistics, { date, workoutDone: done }],
      })),
    [update]
  );

  return {
    ascensionPlans: data.ascensionPlans,
    workoutPlans: data.workoutPlans,
    currentDay,
    todayPlan,
    todayGym:
      todayPlan?.tasks.filter((t) => t.category === "gym").map((t) => t.title) ??
      todayPlan?.gym ??
      [],
    todayExercises:
      todayPlan?.tasks
        .filter((t) => ["haltung", "mobilitaet", "gym"].includes(t.category))
        .map((t) => t.title) ??
      todayPlan?.exercises ??
      [],
    setAscensionPlans,
    addWorkoutPlan,
    toggleWorkoutDone,
  };
}
