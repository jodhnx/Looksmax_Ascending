"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, ChevronDown, Sparkles, AlertCircle } from "lucide-react";
import { BottomNav } from "@/components/app/bottom-nav";
import { GlassCard } from "@/components/app/glass-card";
import { MorningBanner } from "@/components/app/morning-banner";
import { PlanTaskCard } from "@/components/app/plan-task-card";
import { Progress } from "@/components/ui/progress";
import type { PlanDay } from "@/lib/analysis/types";
import { useStorage } from "@/hooks/use-storage";
import { getCurrentPlanDay } from "@/lib/storage/helpers";
import { de } from "@/lib/i18n/de";
import { DAY_GRADIENTS } from "@/lib/exercises/categories";
import { cn } from "@/lib/utils";

function dayXpEarned(day: PlanDay, completedIds: Set<string>) {
  return day.tasks
    .filter((t) => completedIds.has(t.id))
    .reduce((s, t) => s + t.xp, 0);
}

function dayCompletion(day: PlanDay, completedIds: Set<string>) {
  if (!day.tasks.length) return 0;
  const done = day.tasks.filter((t) => completedIds.has(t.id)).length;
  return Math.round((done / day.tasks.length) * 100);
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
        <div className="px-6 py-8 text-center">
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
      <div className="px-6 py-8 pb-28">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-violet-400" />
          <div>
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

        <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
          {[1, 2, 3, 4].map((w) => {
            const phase = de.plan.phases[
              ["fundament", "konsistenz", "optimierung", "peak"][w - 1] as keyof typeof de.plan.phases
            ];
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
                <span className="block text-sm font-medium">
                  {de.plan.week} {w}
                </span>
                <span className="block text-[10px] opacity-70">{phase}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3">
          {weekPlans.map((day) => {
            const isToday = day.dayNumber === currentDay;
            const isExpanded = expandedDay === day.dayNumber;
            const dayIdx = (day.dayNumber - 1) % 7;
            const gradient = DAY_GRADIENTS[dayIdx];
            const pct = isToday ? dayCompletion(day, completedIds) : 0;
            const xp = isToday ? dayXpEarned(day, completedIds) : 0;

            return (
              <motion.div key={day.dayNumber} layout>
                <button
                  type="button"
                  onClick={() => setExpandedDay(isExpanded ? null : day.dayNumber)}
                  className={cn(
                    "relative w-full overflow-hidden rounded-2xl border p-4 text-left transition-all",
                    isToday
                      ? "border-violet-500/50"
                      : "border-white/10 hover:border-white/20"
                  )}
                >
                  <div
                    className={cn(
                      "pointer-events-none absolute inset-0 bg-gradient-to-br opacity-60",
                      gradient
                    )}
                  />
                  <div className="relative flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-white/50">
                        {de.plan.week} {day.weekNumber} · {day.weekday}
                      </p>
                      <p className="font-semibold text-white">
                        {de.dashboard.day} {day.dayNumber}
                        <span className="ml-2 text-xs font-normal text-white/50">
                          {day.phase}
                        </span>
                        {isToday && (
                          <span className="ml-2 rounded-full bg-violet-500/40 px-2 py-0.5 text-[10px] text-violet-100">
                            {de.plan.today}
                          </span>
                        )}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-violet-300/90">{day.focus}</p>
                      <div className="mt-2 flex items-center gap-3 text-[10px] text-white/45">
                        <span>{day.tasks.length} Aufgaben</span>
                        <span>{day.xpAvailable} XP</span>
                        {isToday && pct > 0 && (
                          <span className="text-emerald-400">
                            {pct}% · {xp} XP
                          </span>
                        )}
                      </div>
                      {isToday && (
                        <Progress value={pct} className="mt-2 h-1" />
                      )}
                    </div>
                    <ChevronDown
                      className={cn(
                        "ml-2 h-5 w-5 shrink-0 text-white/40 transition-transform",
                        isExpanded && "rotate-180"
                      )}
                    />
                  </div>
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-3 pt-3">
                        <GlassCard className="!p-4">
                          <p className="text-xs text-white/45">{de.plan.whyRecommended}</p>
                          <p className="mt-1 text-sm leading-relaxed text-white/75">
                            {day.focusReason}
                          </p>
                        </GlassCard>

                        {day.tasks.map((task, i) => (
                          <PlanTaskCard
                            key={task.id}
                            id={task.id}
                            title={task.title}
                            description={task.description}
                            category={task.category}
                            durationMinutes={task.durationMinutes}
                            difficulty={task.difficulty}
                            xp={task.xp}
                            icon={task.icon}
                            evidenceLevel={task.evidenceLevel}
                            reason={task.reason}
                            completed={completedIds.has(task.id)}
                            onToggle={() => {}}
                            index={i}
                            showReason
                          />
                        ))}

                        {day.faceSection &&
                          (day.faceSection.evidenceBased.length > 0 ||
                            day.faceSection.optional.length > 0) && (
                            <GlassCard className="border-fuchsia-500/20 !p-4">
                              <div className="mb-3 flex items-center gap-2">
                                <Sparkles className="h-4 w-4 text-fuchsia-400" />
                                <h4 className="text-sm font-semibold text-white">
                                  {de.plan.faceSection}
                                </h4>
                              </div>
                              <div className="mb-3 flex items-start gap-2 rounded-xl bg-amber-500/10 p-3">
                                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                                <p className="text-[11px] leading-relaxed text-amber-200/80">
                                  {day.faceSection.disclaimer}
                                </p>
                              </div>
                              {day.faceSection.evidenceBased.length > 0 && (
                                <p className="mb-2 text-[10px] font-medium uppercase tracking-wide text-emerald-400/80">
                                  {de.plan.evidenceBased}
                                </p>
                              )}
                              {day.faceSection.evidenceBased.map((task, i) => (
                                <div key={task.id} className="mb-2">
                                  <PlanTaskCard
                                    {...task}
                                    completed={completedIds.has(task.id)}
                                    onToggle={() => {}}
                                    index={i}
                                    showReason
                                  />
                                </div>
                              ))}
                              {day.faceSection.optional.length > 0 && (
                                <p className="mb-2 mt-3 text-[10px] font-medium uppercase tracking-wide text-fuchsia-400/80">
                                  {de.plan.optional}
                                </p>
                              )}
                              {day.faceSection.optional.map((task, i) => (
                                <div key={task.id} className="mb-2">
                                  <PlanTaskCard
                                    {...task}
                                    completed={completedIds.has(task.id)}
                                    onToggle={() => {}}
                                    index={i}
                                    showReason
                                  />
                                </div>
                              ))}
                            </GlassCard>
                          )}

                        {day.nutrition && (
                          <GlassCard className="!p-4">
                            <h4 className="mb-2 text-sm font-semibold text-white">
                              {de.plan.sections.nutrition}
                            </h4>
                            <div className="grid grid-cols-3 gap-2 text-center text-xs">
                              <div className="rounded-xl bg-white/5 p-2">
                                <p className="text-white/45">Protein</p>
                                <p className="font-semibold text-white">{day.nutrition.protein}g</p>
                              </div>
                              <div className="rounded-xl bg-white/5 p-2">
                                <p className="text-white/45">Wasser</p>
                                <p className="font-semibold text-white">{day.nutrition.water}L</p>
                              </div>
                              <div className="rounded-xl bg-white/5 p-2">
                                <p className="text-white/45">Kalorien</p>
                                <p className="font-semibold text-white">{day.nutrition.calories}</p>
                              </div>
                            </div>
                          </GlassCard>
                        )}
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
