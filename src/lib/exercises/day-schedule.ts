import type { TimeOfDay } from "./habit-details";
import type { TaskCategory } from "./types";

export interface SchedulableTask {
  id: string;
  category: TaskCategory | string;
  timeOfDay?: TimeOfDay;
  durationMinutes?: number;
}

export const TIME_SECTIONS: {
  id: TimeOfDay;
  label: string;
  emoji: string;
  subtitle: string;
}[] = [
  { id: "morgen", label: "Morgen", emoji: "🌅", subtitle: "Start & Routine" },
  { id: "nachmittag", label: "Nachmittag", emoji: "☀️", subtitle: "Training & Aktivität" },
  { id: "abend", label: "Abend", emoji: "🌆", subtitle: "Pflege & Reflexion" },
  { id: "nacht", label: "Nacht", emoji: "🌙", subtitle: "Erholung & Schlaf" },
];

const CATEGORY_TIME: Partial<Record<TaskCategory, TimeOfDay>> = {
  wasser: "morgen",
  hautpflege: "morgen",
  lifestyle: "morgen",
  haltung: "nachmittag",
  mobilitaet: "nachmittag",
  gym: "nachmittag",
  cardio: "nachmittag",
  ernaehrung: "nachmittag",
  gesichtsmassage: "abend",
  gesicht: "abend",
  haarpflege: "abend",
  fortschritt: "abend",
  schlaf: "nacht",
};

export function resolveTimeOfDay(task: SchedulableTask, index: number): TimeOfDay {
  if (task.timeOfDay) return task.timeOfDay;
  const cat = task.category as TaskCategory;
  if (cat === "hautpflege") return index % 2 === 0 ? "morgen" : "abend";
  return CATEGORY_TIME[cat] ?? "nachmittag";
}

export function groupByTimeOfDay<T extends SchedulableTask>(tasks: T[]): Record<TimeOfDay, T[]> {
  const groups: Record<TimeOfDay, T[]> = {
    morgen: [],
    nachmittag: [],
    abend: [],
    nacht: [],
  };
  tasks.forEach((t, i) => {
    groups[resolveTimeOfDay(t, i)].push(t);
  });
  return groups;
}

export function totalDuration(tasks: { durationMinutes?: number }[]): number {
  return tasks.reduce((s, t) => s + (t.durationMinutes ?? 0), 0);
}
