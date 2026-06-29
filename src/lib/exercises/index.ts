import type { Exercise, ExerciseCategory, ExerciseDifficulty } from "./library";
import { HABIT_DATABASE } from "./database";
import { enrichHabit } from "./habit-details";
import type { TaskCategory } from "./types";

const CATEGORY_MAP: Record<TaskCategory, ExerciseCategory> = {
  haltung: "haltung",
  mobilitaet: "beweglichkeit",
  gym: "gym",
  cardio: "cardio",
  hautpflege: "skincare",
  haarpflege: "haircare",
  lifestyle: "lifestyle",
  gesichtsmassage: "skincare",
  gesicht: "skincare",
  ernaehrung: "lifestyle",
  schlaf: "lifestyle",
  wasser: "lifestyle",
  fortschritt: "lifestyle",
};

export interface RichExercise extends Exercise {
  xp: number;
  benefits: string[];
  hints: string[];
  frequency: string;
  estimatedImpact: string;
  targetGoals: string[];
  evidenceLevel: "evidenzbasiert" | "optional";
}

export const EXERCISE_LIBRARY: RichExercise[] = HABIT_DATABASE.map((h, i) => {
  const rich = enrichHabit(h, i);
  return {
    id: h.id,
    name: h.title.replace(/ - (Basis|Aufbau|Progression|Intensiv)$/, ""),
    description: h.description,
    category: CATEGORY_MAP[h.category] ?? "lifestyle",
    difficulty: h.difficulty as ExerciseDifficulty,
    durationMinutes: h.durationMinutes,
    targetArea: rich.targetGoals.join(" · "),
    instructions: rich.steps,
    icon: h.icon,
    reminder: rich.frequency,
    xp: h.xp,
    benefits: rich.benefits,
    hints: rich.hints,
    frequency: rich.frequency,
    estimatedImpact: rich.estimatedImpact,
    targetGoals: rich.targetGoals,
    evidenceLevel: h.evidenceLevel,
  };
});

export { CATEGORY_LABELS } from "./library";
export type { Exercise, ExerciseCategory, ExerciseDifficulty } from "./library";
