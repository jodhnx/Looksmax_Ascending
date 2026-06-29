"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, ChevronDown, Clock, Zap } from "lucide-react";
import { BottomNav } from "@/components/app/bottom-nav";
import { MorningBanner } from "@/components/app/morning-banner";
import { PlanTimeSections } from "@/components/app/plan-time-sections";
import { DayProgressRing } from "@/components/app/day-progress-ring";
import type { PlanDay } from "@/lib/analysis/types";
import { ensurePlanTask } from "@/lib/analysis/plan-generator";
import { useStorage } from "@/hooks/use-storage";
import { getCurrentPlanDay } from "@/lib/storage/helpers";
import { de } from "@/lib/i18n/de";
import { DAY_GRADIENTS } from "@/lib/exercises/categories";
import { totalDuration } from "@/lib/exercises/day-schedule";
import { cn } from "@/lib/utils";

function dayStats(day: PlanDay, completedIds: Set<string>) {
  const total = day.tasks.length;
  const done = day.tasks.filter((t) => completedIds.has(t.id)).length;
  const pct = total ? Math.round((done / total) * 100) : 0;
  const xpEarned = day.tasks
    .filter((t) => completedIds.has(t.id))
    .reduce((s, t) => s + t.xp, 0);
  return { total, done, pct, xpEarned, xpTotal: day.xpAvailable, duration: totalDuration(day.tasks) };
}

export default function PlanPage() {
  const { data } = useStorage();
  const currentDay = getCurrentPlanDay(data);
  const plans = data.ascensionPlans as PlanDay[];
  const [selectedWeek, setSelectedWeek] = useState(Math.ceil(currentDay / 7));
  const [expandedDay, setExpandedDay] = useState<number | null>(currentDay);

  const todayKey = new Date().toISOString().split("T")[0];
  const todayRecord = data.dailyTasks[todayKey];
  const completedIds = useMemo(
    () => new Set(todayRecord?.tasks.filter((t) => t.completed).map((t) => t.id) ?? []),
    [todayRecord]
  );

  if (!plans.length) {
    return (
      <>
        <div className="mx-auto max-w-lg px-5 py-8 text-center sm:px-6">
          <h1 className="text-2xl font-bold text-white">{de.plan.title}</h1>
          <p className="mt-4 text-white/55">{de.plan.noPlan}</p>
          <Link href="/upload" className="mt-6 inline-block text-violet-400">
            {de.plan.startAnalysis} →
          </Link>
        </div>
        <BottomNav />
      </>
    );
  }

  const weekPlans = plans.filter((p) => p.weekNumber === selectedWeek);
  const todayPlan = plans[currentDay - 1];

  return (
    <>
      <div className="mx-auto max-w-lg px-5 py-8 pb-32 sm:px-6">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 shrink-0 text-violet-400" />
          <div className="min-w-0">
            <h1 className="text-2xl font-bold tracking-tight text-white">{de.plan.title}</h1>
            <p className="text-sm text-white/50">{de.plan.subtitle}</p>
          </div>
        </div>

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

        <div className="mt-5 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {[1, 2, 3, 4].map((w) => {
            const phaseKey = ["fundament", "konsistenz", "optimierung", "peak"][w - 1] as keyof typeof de.plan.phases;
            const phase = de.plan.phases[phaseKey];
            return (
              <button
                key={w}
                type="button"
                onClick={() => setSelectedWeek(w)}
                className={cn(
                  "shrink-0 rounded-2xl px-4 py-2.5 text-left transition-colors",
                  selectedWeek === w
                    ? "bg-violet-600 text-white shadow-lg shadow-violet-500/25"
                    : "bg-white/10 text-white/60 hover:bg-white/15"
                )}
              >
                <span className="block text-sm font-medium">{de.plan.week} {w}</span>
                <span className="block text-[10px] opacity-70">{phase}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-4 space-y-2.5">
          {weekPlans.map((day) => {
            const isToday = day.dayNumber === currentDay;
            const isExpanded = expandedDay === day.dayNumber;
            const dayIdx = (day.dayNumber - 1) % 7;
            const gradient = DAY_GRADIENTS[dayIdx];
            const stats = isToday
              ? dayStats(day, completedIds)
              : {
                  total: day.tasks.length,
                  done: 0,
                  pct: 0,
                  xpEarned: 0,
                  xpTotal: day.xpAvailable,
                  duration: totalDuration(day.tasks),
                };

            return (
              <motion.div key={day.dayNumber} layout className="w-full">
                <button
                  type="button"
                  onClick={() => setExpandedDay(isExpanded ? null : day.dayNumber)}
                  className={cn(
                    "relative w-full overflow-hidden rounded-2xl border text-left transition-all",
                    isToday ? "border-violet-500/45" : "border-white/10 hover:border-white/18"
                  )}
                >
                  <div
                    className={cn(
                      "pointer-events-none absolute inset-0 bg-gradient-to-br opacity-50",
                      gradient
                    )}
                  />
                  <div className="relative flex items-center gap-3 p-4">
                    <DayProgressRing
                      percent={stats.pct}
                      size={48}
                      label={isToday ? de.plan.today : undefined}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-white/50">
                        {day.weekday}
                      </p>
                      <p className="truncate font-semibold text-white">
                        {de.dashboard.day} {day.dayNumber}
                        <span className="ml-1.5 text-xs font-normal text-white/45">
                          · {day.phase}
                        </span>
                      </p>
                      <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-[10px] text-white/45">
                        <span>
                          {stats.done}/{stats.total} {de.ui.tasksCompleted}
                        </span>
                        <span className="inline-flex items-center gap-0.5">
                          <Zap className="h-3 w-3 text-violet-400/80" />
                          {stats.xpTotal} XP
                        </span>
                        {stats.duration > 0 && (
                          <span className="inline-flex items-center gap-0.5">
                            <Clock className="h-3 w-3" />~{stats.duration} Min.
                          </span>
                        )}
                      </div>
                    </div>
                    <ChevronDown
                      className={cn(
                        "h-5 w-5 shrink-0 text-white/40 transition-transform duration-300",
                        isExpanded && "rotate-180"
                      )}
                    />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-3 pt-3">
                        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-4 backdrop-blur-xl">
                          <p className="text-xs font-medium uppercase tracking-wide text-white/40">
                            {de.ui.whyRecommended}
                          </p>
                          <p className="mt-2 break-words text-sm leading-relaxed text-white/75">
                            {day.focusReason}
                          </p>
                        </div>

                        <PlanTimeSections
                          tasks={day.tasks.map((t) => {
                            const enriched = ensurePlanTask(t);
                            return {
                              ...enriched,
                              completed: completedIds.has(t.id),
                            };
                          })}
                          onToggle={() => {}}
                          interactive={false}
                          streak={data.profile?.currentStreak}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
      <BottomNav />
    </>
  );
}
