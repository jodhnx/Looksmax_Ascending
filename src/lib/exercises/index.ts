import type { Exercise, ExerciseCategory, ExerciseDifficulty } from "./library";
import { HABIT_DATABASE } from "./database";
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

export const EXERCISE_LIBRARY: Exercise[] = HABIT_DATABASE.map((h) => ({
  id: h.id,
  name: h.title,
  description: h.description,
  category: CATEGORY_MAP[h.category] ?? "lifestyle",
  difficulty: h.difficulty as ExerciseDifficulty,
  durationMinutes: h.durationMinutes,
  targetArea: h.tags.join(", "),
  instructions: [h.description],
  icon: h.icon,
  reminder: `Woche ${h.weekMin}+`,
}));

export { CATEGORY_LABELS } from "./library";
export type { Exercise, ExerciseCategory, ExerciseDifficulty } from "./library";
