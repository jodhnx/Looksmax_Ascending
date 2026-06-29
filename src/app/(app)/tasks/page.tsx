"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PartyPopper, Zap } from "lucide-react";
import { BottomNav } from "@/components/app/bottom-nav";
import { GlassCard } from "@/components/app/glass-card";
import { MorningBanner } from "@/components/app/morning-banner";
import { PlanTimeSections } from "@/components/app/plan-time-sections";
import { DayProgressRing } from "@/components/app/day-progress-ring";
import { Progress } from "@/components/ui/progress";
import { useStorage } from "@/hooks/use-storage";
import { todayKey, getCurrentPlanDay } from "@/lib/storage/helpers";
import type { PlanDay, PlanTask } from "@/lib/analysis/types";
import { ensurePlanTask } from "@/lib/analysis/plan-generator";
import { totalDuration } from "@/lib/exercises/day-schedule";
import { startOfDay } from "@/lib/utils";
import { de } from "@/lib/i18n/de";

function mergeTasks(planDay: PlanDay | undefined, storedCompleted: Map<string, boolean>): PlanTask[] {
  if (!planDay?.tasks?.length) return [];
  return planDay.tasks.map((t) => {
    const enriched = ensurePlanTask(t);
    return {
      ...enriched,
      completed: storedCompleted.get(t.id) ?? false,
    };
  });
}

export default function TasksPage() {
  const { data, update } = useStorage();
  const today = todayKey();
  const planDayNum = getCurrentPlanDay(data);
  const todayPlan = data.ascensionPlans[planDayNum - 1] as PlanDay | undefined;
  const [celebrate, setCelebrate] = useState(false);

  const storedCompleted = useMemo(() => {
    const map = new Map<string, boolean>();
    data.dailyTasks[today]?.tasks.forEach((t) => map.set(t.id, t.completed));
    return map;
  }, [data.dailyTasks, today]);

  const tasks = useMemo(
    () => mergeTasks(todayPlan, storedCompleted),
    [todayPlan, storedCompleted]
  );

  const completed = tasks.filter((t) => t.completed).length;
  const total = tasks.length;
  const progressPct = total ? (completed / total) * 100 : 0;
  const xpEarned = tasks.filter((t) => t.completed).reduce((s, t) => s + t.xp, 0);
  const xpTotal = tasks.reduce((s, t) => s + t.xp, 0);
  const allDone = total > 0 && completed === total;
  const estDuration = totalDuration(tasks);

  const toggle = (taskId: string, checked: boolean) => {
    update((prev) => {
      const plan = prev.ascensionPlans[planDayNum - 1] as PlanDay;
      const base = mergeTasks(plan, storedCompleted);
      const nextTasks = base.map((t) => (t.id === taskId ? { ...t, completed: checked } : t));
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
            tasks: nextTasks.map((t) => ({
              id: t.id,
              label: t.title,
              completed: t.completed ?? false,
              category: t.category,
              description: t.description,
              durationMinutes: t.durationMinutes,
              difficulty: t.difficulty,
              xp: t.xp,
              icon: t.icon,
              evidenceLevel: t.evidenceLevel,
              reason: t.reason,
              steps: t.steps,
              benefits: t.benefits,
              hints: t.hints,
              frequency: t.frequency,
              targetGoals: t.targetGoals,
              estimatedImpact: t.estimatedImpact,
              timeOfDay: t.timeOfDay,
            })),
            completed: completedCount,
            total: nextTasks.length,
          },
        },
      };
    });
  };

  const sectionTasks = tasks.map((t) => ({
    id: t.id,
    title: t.title,
    description: t.description,
    category: t.category,
    durationMinutes: t.durationMinutes,
    difficulty: t.difficulty,
    xp: t.xp,
    icon: t.icon,
    evidenceLevel: t.evidenceLevel,
    reason: t.reason,
    steps: t.steps,
    benefits: t.benefits,
    hints: t.hints,
    frequency: t.frequency,
    targetGoals: t.targetGoals,
    estimatedImpact: t.estimatedImpact,
    completed: t.completed ?? false,
  }));

  return (
    <>
      <div className="mx-auto max-w-lg px-5 py-8 pb-32 sm:px-6">
        <h1 className="text-2xl font-bold tracking-tight text-white">{de.tasks.title}</h1>
        <p className="mt-1 text-sm text-white/55">{de.tasks.subtitle}</p>

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

        <GlassCard className="mt-5 !p-4">
          <div className="flex items-center gap-4">
            <DayProgressRing percent={progressPct} size={56} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm text-white/55">{de.tasks.progress}</span>
                <span className="font-semibold text-white">
                  {completed}/{total}
                </span>
              </div>
              <Progress value={progressPct} className="mt-2 h-2" />
              <div className="mt-2 flex flex-wrap gap-3 text-xs text-white/45">
                <span className="inline-flex items-center gap-1 text-violet-400">
                  <Zap className="h-3.5 w-3.5" />
                  {xpEarned}/{xpTotal} XP
                </span>
                {estDuration > 0 && (
                  <span>~{estDuration} {de.ui.estimatedDuration}</span>
                )}
              </div>
            </div>
          </div>
        </GlassCard>

        <AnimatePresence>
          {celebrate && allDone && (
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92 }}
              className="mt-4 flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4"
            >
              <PartyPopper className="h-6 w-6 shrink-0 text-emerald-400" />
              <div className="min-w-0">
                <p className="font-semibold text-emerald-300">{de.plan.dayComplete}</p>
                <p className="break-words text-xs text-emerald-400/80">
                  {todayPlan?.completionReward ?? `+${xpEarned} XP`}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-5">
          {sectionTasks.length > 0 ? (
            <PlanTimeSections
              tasks={sectionTasks}
              onToggle={toggle}
              streak={data.profile?.currentStreak}
            />
          ) : (
            <GlassCard className="text-center">
              <p className="text-sm text-white/55">{de.plan.noPlan}</p>
            </GlassCard>
          )}
        </div>
      </div>
      <BottomNav />
    </>
  );
}
