"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PartyPopper, Zap } from "lucide-react";
import { BottomNav } from "@/components/app/bottom-nav";
import { GlassCard } from "@/components/app/glass-card";
import { MorningBanner } from "@/components/app/morning-banner";
import { PlanTaskCard } from "@/components/app/plan-task-card";
import { Progress } from "@/components/ui/progress";
import { useStorage } from "@/hooks/use-storage";
import { todayKey, getCurrentPlanDay } from "@/lib/storage/helpers";
import { planTasksToDailyItems } from "@/lib/analysis/plan-generator";
import type { DailyTaskItem } from "@/lib/storage/types";
import type { PlanDay } from "@/lib/analysis/types";
import { startOfDay } from "@/lib/utils";
import { de } from "@/lib/i18n/de";

function mergePlanTasks(
  planDay: PlanDay | undefined,
  stored: DailyTaskItem[] | undefined
): DailyTaskItem[] {
  if (!planDay?.tasks?.length) return stored ?? [];
  const planItems = planTasksToDailyItems(planDay.tasks);
  if (!stored?.length) return planItems;
  const storedMap = new Map(stored.map((t) => [t.id, t]));
  return planItems.map((t) => {
    const s = storedMap.get(t.id);
    return s ? { ...t, completed: s.completed } : t;
  });
}

export default function TasksPage() {
  const { data, update } = useStorage();
  const today = todayKey();
  const planDay = getCurrentPlanDay(data);
  const todayPlan = data.ascensionPlans[planDay - 1] as PlanDay | undefined;
  const [celebrate, setCelebrate] = useState(false);

  const tasks = useMemo(
    () => mergePlanTasks(todayPlan, data.dailyTasks[today]?.tasks),
    [todayPlan, data.dailyTasks, today]
  );

  const completed = tasks.filter((t) => t.completed).length;
  const total = tasks.length;
  const progressPct = total ? (completed / total) * 100 : 0;
  const xpEarned = tasks.filter((t) => t.completed).reduce((s, t) => s + (t.xp ?? 0), 0);
  const xpTotal = tasks.reduce((s, t) => s + (t.xp ?? 0), 0);
  const allDone = total > 0 && completed === total;

  const toggle = (taskId: string, checked: boolean) => {
    update((prev) => {
      const current = prev.dailyTasks[today];
      const baseTasks = mergePlanTasks(
        prev.ascensionPlans[planDay - 1] as PlanDay,
        current?.tasks
      );
      const nextTasks = baseTasks.map((t) =>
        t.id === taskId ? { ...t, completed: checked } : t
      );
      const completedCount = nextTasks.filter((t) => t.completed).length;
      const allComplete = completedCount === nextTasks.length && nextTasks.length > 0;

      let profile = prev.profile;
      if (allComplete && profile) {
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
        setCelebrate(true);
        setTimeout(() => setCelebrate(false), 3000);
      }

      return {
        ...prev,
        profile,
        dailyTasks: {
          ...prev.dailyTasks,
          [today]: {
            date: today,
            tasks: nextTasks,
            completed: completedCount,
            total: nextTasks.length,
          },
        },
      };
    });
  };

  return (
    <>
      <div className="px-6 py-8 pb-28">
        <h1 className="text-2xl font-bold text-white">{de.tasks.title}</h1>
        <p className="mt-1 text-white/60">{de.tasks.subtitle}</p>

        {todayPlan && (
          <div className="mt-5">
            <MorningBanner
              todayFocus={todayPlan.todayFocus}
              dailyQuote={todayPlan.dailyQuote}
              estimatedImprovement={todayPlan.estimatedImprovement}
              xpAvailable={todayPlan.xpAvailable}
              completionReward={todayPlan.completionReward}
              weeklyGoal={todayPlan.weeklyGoal}
              streak={data.profile?.currentStreak}
            />
          </div>
        )}

        <GlassCard className="mt-5">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm text-white/60">{de.tasks.progress}</span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-xs text-violet-400">
                <Zap className="h-3.5 w-3.5" />
                {xpEarned}/{xpTotal} {de.tasks.xpTotal}
              </span>
              <span className="font-semibold text-white">
                {completed}/{total}
              </span>
            </div>
          </div>
          <Progress value={progressPct} className="h-2.5" />
          <p className="mt-2 text-right text-xs text-violet-400">{Math.round(progressPct)}%</p>
        </GlassCard>

        <AnimatePresence>
          {celebrate && allDone && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="mt-4 flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4"
            >
              <PartyPopper className="h-6 w-6 text-emerald-400" />
              <div>
                <p className="font-semibold text-emerald-300">{de.plan.dayComplete}</p>
                <p className="text-xs text-emerald-400/80">
                  {todayPlan?.completionReward ?? `+${xpEarned} XP`}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-4 space-y-3">
          {tasks.map((task, i) => (
            <PlanTaskCard
              key={task.id}
              id={task.id}
              title={task.label}
              description={task.description}
              category={task.category ?? "lifestyle"}
              durationMinutes={task.durationMinutes}
              difficulty={task.difficulty}
              xp={task.xp}
              icon={task.icon}
              evidenceLevel={task.evidenceLevel}
              reason={task.reason}
              completed={task.completed}
              onToggle={(c) => toggle(task.id, c)}
              index={i}
              showReason
            />
          ))}
        </div>

        {!tasks.length && (
          <GlassCard className="mt-6 text-center">
            <p className="text-sm text-white/55">{de.plan.noPlan}</p>
          </GlassCard>
        )}
      </div>
      <BottomNav />
    </>
  );
}
