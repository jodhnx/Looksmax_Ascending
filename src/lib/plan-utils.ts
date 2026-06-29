import { addDays, format } from "date-fns";
import type { PlanDay } from "@/lib/analysis/types";
import type { NutritionPlan, WorkoutPlan } from "@/lib/storage/types";

export function planToStoredPlans(plan: PlanDay[], planStartDate: string) {
  const start = new Date(planStartDate);
  const workoutPlans: WorkoutPlan[] = plan.map((day) => ({
    id: `${day.dayNumber}-${format(addDays(start, day.dayNumber - 1), "yyyy-MM-dd")}`,
    date: format(addDays(start, day.dayNumber - 1), "yyyy-MM-dd"),
    title: day.title,
    exercises: [
      ...day.exercises,
      ...day.gym,
      ...(day.neckPosture ?? []),
      ...(day.stretching ?? []),
    ],
    completed: false,
  }));
  const nutritionPlans: NutritionPlan[] = plan.map((day) => ({
    date: format(addDays(start, day.dayNumber - 1), "yyyy-MM-dd"),
    protein: day.nutrition.protein,
    water: day.nutrition.water,
    calories: day.nutrition.calories,
    meals: [
      ...(day.habits ?? []),
      ...(day.facialMassage ?? []).slice(0, 2),
    ],
  }));
  return { workoutPlans, nutritionPlans };
}

export function daysSince(dateIso: string | null | undefined): number {
  if (!dateIso) return Infinity;
  const then = new Date(dateIso).getTime();
  const now = Date.now();
  return Math.floor((now - then) / (1000 * 60 * 60 * 24));
}
