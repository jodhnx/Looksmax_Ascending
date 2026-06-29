"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sun,
  Moon,
  Dumbbell,
  Apple,
  Sparkles,
  User,
  StretchHorizontal,
  Heart,
  Scissors,
  Brain,
  ChevronDown,
  Calendar,
} from "lucide-react";
import { BottomNav } from "@/components/app/bottom-nav";
import { GlassCard } from "@/components/app/glass-card";
import type { PlanDay } from "@/lib/analysis/types";
import { useStorage } from "@/hooks/use-storage";
import { getCurrentPlanDay } from "@/lib/storage/helpers";
import { de } from "@/lib/i18n/de";
import { cn } from "@/lib/utils";

const SECTION_KEYS = {
  morningRoutine: { icon: Sun, title: de.plan.sections.morning },
  skincare: { icon: Sparkles, title: de.plan.sections.skincare },
  exercises: { icon: Dumbbell, title: de.plan.sections.exercises },
  gym: { icon: Dumbbell, title: de.plan.sections.gym },
  neckPosture: { icon: User, title: de.plan.sections.neckPosture },
  stretching: { icon: StretchHorizontal, title: de.plan.sections.stretching },
  facialMassage: { icon: Sparkles, title: de.plan.sections.facialMassage },
  habits: { icon: Sparkles, title: de.plan.sections.habits },
  stressManagement: { icon: Brain, title: de.plan.sections.stress },
  haircare: { icon: Scissors, title: de.plan.sections.haircare },
  confidence: { icon: Heart, title: de.plan.sections.confidence },
  eveningRoutine: { icon: Moon, title: de.plan.sections.evening },
  lifestyle: { icon: Sun, title: de.plan.sections.lifestyle },
  recovery: { icon: Moon, title: de.plan.sections.recovery },
} as const;

export default function PlanPage() {
  const { data } = useStorage();
  const currentDay = getCurrentPlanDay(data);
  const plans = data.ascensionPlans as PlanDay[];
  const [selectedWeek, setSelectedWeek] = useState(Math.ceil(currentDay / 7));
  const [expandedDay, setExpandedDay] = useState<number | null>(currentDay);

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

        {/* Week selector */}
        <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
          {[1, 2, 3, 4].map((w) => (
            <button
              key={w}
              type="button"
              onClick={() => setSelectedWeek(w)}
              className={cn(
                "shrink-0 rounded-2xl px-5 py-2.5 text-sm font-medium transition-colors",
                selectedWeek === w
                  ? "bg-violet-600 text-white shadow-lg shadow-violet-500/25"
                  : "bg-white/10 text-white/60 hover:bg-white/15"
              )}
            >
              {de.plan.week} {w}
            </button>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="mt-4 grid grid-cols-1 gap-2">
          {weekPlans.map((day) => {
            const isToday = day.dayNumber === currentDay;
            const isExpanded = expandedDay === day.dayNumber;
            return (
              <motion.div key={day.dayNumber} layout>
                <button
                  type="button"
                  onClick={() => setExpandedDay(isExpanded ? null : day.dayNumber)}
                  className={cn(
                    "w-full rounded-2xl border p-4 text-left transition-all",
                    isToday
                      ? "border-violet-500/50 bg-violet-500/15"
                      : "border-white/10 bg-white/5 hover:bg-white/[0.07]"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-white/45">
                        {de.plan.week} {day.weekNumber} · {day.weekday}
                      </p>
                      <p className="font-semibold text-white">
                        {de.dashboard.day} {day.dayNumber}
                        {isToday && (
                          <span className="ml-2 rounded-full bg-violet-500/30 px-2 py-0.5 text-[10px] text-violet-300">
                            {de.plan.today}
                          </span>
                        )}
                      </p>
                      <p className="mt-0.5 text-xs text-violet-300/80">{day.focus}</p>
                    </div>
                    <ChevronDown
                      className={cn(
                        "h-5 w-5 text-white/40 transition-transform",
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
                        {(
                          [
                            ["morningRoutine", SECTION_KEYS.morningRoutine],
                            ["skincare", SECTION_KEYS.skincare],
                            ["exercises", SECTION_KEYS.exercises],
                            ["gym", SECTION_KEYS.gym],
                            ["neckPosture", SECTION_KEYS.neckPosture],
                            ["stretching", SECTION_KEYS.stretching],
                            ["facialMassage", SECTION_KEYS.facialMassage],
                            ["habits", SECTION_KEYS.habits],
                            ["stressManagement", SECTION_KEYS.stressManagement],
                            ["haircare", SECTION_KEYS.haircare],
                            ["confidence", SECTION_KEYS.confidence],
                            ["eveningRoutine", SECTION_KEYS.eveningRoutine],
                            ["lifestyle", SECTION_KEYS.lifestyle],
                            ["recovery", SECTION_KEYS.recovery],
                          ] as const
                        ).map(([key, meta]) => {
                          const items = day[key];
                          if (!items?.length) return null;
                          const Icon = meta.icon;
                          return (
                            <GlassCard key={key} className="!p-4">
                              <div className="mb-2 flex items-center gap-2">
                                <Icon className="h-4 w-4 text-violet-400" />
                                <h4 className="text-sm font-semibold text-white">{meta.title}</h4>
                              </div>
                              <ul className="space-y-1.5">
                                {items.map((item: string) => (
                                  <li key={item} className="flex gap-2 text-xs text-white/75">
                                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-violet-400" />
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </GlassCard>
                          );
                        })}
                        {day.nutrition && (
                          <GlassCard className="!p-4">
                            <div className="mb-2 flex items-center gap-2">
                              <Apple className="h-4 w-4 text-emerald-400" />
                              <h4 className="text-sm font-semibold text-white">
                                {de.plan.sections.nutrition}
                              </h4>
                            </div>
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

        {/* Today's quick overview */}
        {todayPlan && (
          <GlassCard className="mt-6 border-violet-500/20" delay={0.1}>
            <h3 className="mb-3 font-semibold text-white">
              {de.plan.today} — {de.dashboard.day} {currentDay}
            </h3>
            <p className="text-sm text-violet-300">{todayPlan.focus}</p>
            <p className="mt-2 text-xs text-white/50">{todayPlan.title}</p>
          </GlassCard>
        )}
      </div>
      <BottomNav />
    </>
  );
}
