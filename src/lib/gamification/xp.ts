import type { AppData } from "@/lib/storage/types";

const XP_PER_LEVEL = 500;

export function getTotalXp(data: AppData): number {
  return Object.values(data.dailyTasks).reduce((sum, day) => {
    return (
      sum +
      day.tasks.filter((t) => t.completed).reduce((s, t) => s + (t.xp ?? 0), 0)
    );
  }, 0);
}

export function getLevel(totalXp: number): number {
  return Math.max(1, Math.floor(totalXp / XP_PER_LEVEL) + 1);
}

export function getLevelProgress(totalXp: number): {
  level: number;
  current: number;
  next: number;
  percent: number;
} {
  const level = getLevel(totalXp);
  const current = totalXp % XP_PER_LEVEL;
  const next = XP_PER_LEVEL;
  const percent = Math.round((current / next) * 100);
  return { level, current, next, percent };
}

export function getTodayXp(data: AppData, today: string): { earned: number; total: number } {
  const record = data.dailyTasks[today];
  if (!record) return { earned: 0, total: 0 };
  const earned = record.tasks
    .filter((t) => t.completed)
    .reduce((s, t) => s + (t.xp ?? 0), 0);
  const total = record.tasks.reduce((s, t) => s + (t.xp ?? 0), 0);
  return { earned, total };
}
