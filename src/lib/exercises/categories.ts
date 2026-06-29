import type { CategoryMeta, TaskCategory } from "./types";

export const TASK_CATEGORIES: Record<TaskCategory, CategoryMeta> = {
  hautpflege: { id: "hautpflege", label: "Hautpflege", emoji: "🧴", color: "violet" },
  gym: { id: "gym", label: "Gym", emoji: "🏋", color: "rose" },
  ernaehrung: { id: "ernaehrung", label: "Ernährung", emoji: "🥗", color: "emerald" },
  schlaf: { id: "schlaf", label: "Schlaf", emoji: "😴", color: "indigo" },
  cardio: { id: "cardio", label: "Cardio", emoji: "🚶", color: "sky" },
  haltung: { id: "haltung", label: "Haltung", emoji: "🧍", color: "amber" },
  gesichtsmassage: { id: "gesichtsmassage", label: "Gesichtsmassage", emoji: "💆", color: "pink" },
  mobilitaet: { id: "mobilitaet", label: "Mobilität", emoji: "🧘", color: "teal" },
  wasser: { id: "wasser", label: "Wasser", emoji: "💧", color: "cyan" },
  fortschritt: { id: "fortschritt", label: "Fortschritt", emoji: "📈", color: "lime" },
  gesicht: { id: "gesicht", label: "Gesicht & Aussehen", emoji: "✨", color: "fuchsia" },
  lifestyle: { id: "lifestyle", label: "Lifestyle", emoji: "☀️", color: "orange" },
  haarpflege: { id: "haarpflege", label: "Haarpflege", emoji: "💇", color: "purple" },
};

export const WEEK_PHASES = [
  "Fundament",
  "Konsistenz",
  "Optimierung",
  "Peak-Routine",
] as const;

export const DAY_GRADIENTS = [
  "from-violet-500/25 via-indigo-500/10 to-transparent",
  "from-blue-500/25 via-cyan-500/10 to-transparent",
  "from-emerald-500/25 via-teal-500/10 to-transparent",
  "from-amber-500/25 via-orange-500/10 to-transparent",
  "from-rose-500/25 via-pink-500/10 to-transparent",
  "from-fuchsia-500/25 via-purple-500/10 to-transparent",
  "from-sky-500/25 via-blue-500/10 to-transparent",
] as const;
