"use client";

import { motion } from "framer-motion";
import { BottomNav } from "@/components/app/bottom-nav";
import { GlassCard } from "@/components/app/glass-card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { useAppStorage } from "@/hooks/use-app-storage";
import { todayKey } from "@/lib/storage/helpers";
import { DEFAULT_DAILY_TASKS } from "@/lib/challenges";
import { startOfDay } from "@/lib/utils";

export default function TasksPage() {
  const { data, update } = useAppStorage();
  const today = todayKey();
  const dailyTask = data.dailyTasks[today] ?? {
    date: today,
    tasks: DEFAULT_DAILY_TASKS.map((t) => ({ ...t, completed: false })),
    completed: 0,
    total: DEFAULT_DAILY_TASKS.length,
  };

  const toggle = (taskId: string, checked: boolean) => {
    update((prev) => {
      const current = prev.dailyTasks[today] ?? dailyTask;
      const tasks = current.tasks.map((t) =>
        t.id === taskId ? { ...t, completed: checked } : t
      );
      const completedCount = tasks.filter((t) => t.completed).length;
      const allDone = completedCount === tasks.length;

      let profile = prev.profile;
      if (allDone && profile) {
        const todayDate = startOfDay();
        const yesterday = new Date(todayDate);
        yesterday.setDate(yesterday.getDate() - 1);
        const lastActive = profile.lastActiveDate
          ? startOfDay(new Date(profile.lastActiveDate))
          : null;
        const isConsecutive =
          lastActive && lastActive.getTime() === yesterday.getTime();
        profile = {
          ...profile,
          currentStreak: isConsecutive ? profile.currentStreak + 1 : 1,
          longestStreak: Math.max(
            profile.longestStreak,
            isConsecutive ? profile.currentStreak + 1 : 1
          ),
          lastActiveDate: todayDate.toISOString(),
        };
      }

      return {
        ...prev,
        profile,
        dailyTasks: {
          ...prev.dailyTasks,
          [today]: { ...current, tasks, completed: completedCount, total: tasks.length },
        },
      };
    });
  };

  return (
    <>
      <div className="px-6 py-8">
        <h1 className="text-2xl font-bold text-white">Daily Checklist</h1>
        <p className="mt-1 text-white/60">Complete tasks to maintain your streak</p>

        <GlassCard className="mt-6">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm text-white/60">Progress</span>
            <span className="font-semibold text-white">{dailyTask.completed}/{dailyTask.total}</span>
          </div>
          <Progress value={dailyTask.total ? (dailyTask.completed / dailyTask.total) * 100 : 0} />
        </GlassCard>

        <div className="mt-4 space-y-2">
          {dailyTask.tasks.map((task, i) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <GlassCard className="!p-4">
                <label className="flex cursor-pointer items-center gap-4">
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={(c) => toggle(task.id, c === true)}
                  />
                  <span className={task.completed ? "text-white/40 line-through" : "text-white"}>
                    {task.label}
                  </span>
                </label>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
      <BottomNav />
    </>
  );
}
