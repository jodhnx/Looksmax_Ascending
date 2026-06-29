"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Zap, CheckCircle2 } from "lucide-react";
import { BottomNav } from "@/components/app/bottom-nav";
import { GlassCard } from "@/components/app/glass-card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { useStorage } from "@/hooks/use-storage";
import { todayKey } from "@/lib/storage/helpers";
import { generateDailyTasks } from "@/lib/analysis/plan-generator";
import { startOfDay } from "@/lib/utils";
import { de } from "@/lib/i18n/de";
import { cn } from "@/lib/utils";

const DIFFICULTY_COLORS = {
  leicht: "bg-emerald-500/20 text-emerald-400",
  mittel: "bg-amber-500/20 text-amber-400",
  schwer: "bg-red-500/20 text-red-400",
};

export default function TasksPage() {
  const { data, update } = useStorage();
  const today = todayKey();
  const latest = data.analyses[data.analyses.length - 1];

  const defaultTasks = useMemo(() => {
    if (latest) return generateDailyTasks(latest);
    return [
      {
        id: "water",
        label: "2,5 Liter Wasser trinken",
        category: "Hydration",
        durationMinutes: 0,
        difficulty: "leicht" as const,
        completed: false,
      },
    ];
  }, [latest]);

  const dailyTask = data.dailyTasks[today] ?? {
    date: today,
    tasks: defaultTasks,
    completed: 0,
    total: defaultTasks.length,
  };

  const progressPct = dailyTask.total ? (dailyTask.completed / dailyTask.total) * 100 : 0;

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
        <h1 className="text-2xl font-bold text-white">{de.tasks.title}</h1>
        <p className="mt-1 text-white/60">{de.tasks.subtitle}</p>

        <GlassCard className="mt-6">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm text-white/60">{de.tasks.progress}</span>
            <span className="font-semibold text-white">
              {dailyTask.completed}/{dailyTask.total}
            </span>
          </div>
          <Progress value={progressPct} className="h-2" />
          <p className="mt-2 text-right text-xs text-violet-400">{Math.round(progressPct)}%</p>
        </GlassCard>

        <div className="mt-4 space-y-3">
          <AnimatePresence>
            {dailyTask.tasks.map((task, i) => (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <GlassCard
                  className={cn(
                    "!p-4 transition-all duration-300",
                    task.completed && "border-emerald-500/30 bg-emerald-500/5"
                  )}
                >
                  <label className="flex cursor-pointer items-start gap-4">
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={(c) => toggle(task.id, c === true)}
                      className="mt-0.5"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <span
                          className={cn(
                            "font-medium",
                            task.completed ? "text-white/40 line-through" : "text-white"
                          )}
                        >
                          {task.label}
                        </span>
                        {task.completed && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", bounce: 0.5 }}
                          >
                            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                          </motion.div>
                        )}
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-white/60">
                          {task.category}
                        </span>
                        {task.difficulty && (
                          <span
                            className={cn(
                              "rounded-full px-2 py-0.5 text-[10px] font-medium capitalize",
                              DIFFICULTY_COLORS[task.difficulty]
                            )}
                          >
                            {de.tasks.difficulty[task.difficulty]}
                          </span>
                        )}
                        {task.durationMinutes != null && task.durationMinutes > 0 && (
                          <span className="flex items-center gap-1 text-[10px] text-white/45">
                            <Clock className="h-3 w-3" />
                            {task.durationMinutes} {de.tasks.minutes}
                          </span>
                        )}
                        {task.durationMinutes === 0 && (
                          <span className="flex items-center gap-1 text-[10px] text-white/45">
                            <Zap className="h-3 w-3" /> Ganztägig
                          </span>
                        )}
                      </div>
                    </div>
                  </label>
                </GlassCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
      <BottomNav />
    </>
  );
}
