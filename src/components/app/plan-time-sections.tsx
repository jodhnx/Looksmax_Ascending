"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Clock, Zap } from "lucide-react";
import { ExerciseCard, type ExerciseCardProps } from "@/components/app/exercise-card";
import { TIME_SECTIONS, groupByTimeOfDay, totalDuration } from "@/lib/exercises/day-schedule";
import type { TimeOfDay } from "@/lib/exercises/habit-details";
import { de } from "@/lib/i18n/de";
import { cn } from "@/lib/utils";

export type TimeSectionTask = Omit<ExerciseCardProps, "index" | "onToggle" | "interactive"> & {
  completed: boolean;
};

interface PlanTimeSectionsProps {
  tasks: TimeSectionTask[];
  onToggle: (id: string, checked: boolean) => void;
  streak?: number;
  defaultOpen?: TimeOfDay;
  interactive?: boolean;
}

export function PlanTimeSections({
  tasks,
  onToggle,
  streak = 0,
  defaultOpen = "morgen",
  interactive = true,
}: PlanTimeSectionsProps) {
  const grouped = groupByTimeOfDay(tasks);
  const [openSections, setOpenSections] = useState<Set<TimeOfDay>>(new Set([defaultOpen]));

  const toggleSection = (id: TimeOfDay) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-3">
      {TIME_SECTIONS.map((section) => {
        const sectionTasks = grouped[section.id];
        if (!sectionTasks.length) return null;

        const done = sectionTasks.filter((t) => t.completed).length;
        const pct = Math.round((done / sectionTasks.length) * 100);
        const dur = totalDuration(sectionTasks);
        const xp = sectionTasks.reduce((s, t) => s + (t.xp ?? 0), 0);
        const isOpen = openSections.has(section.id);

        return (
          <div
            key={section.id}
            className="overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl"
          >
            <button
              type="button"
              onClick={() => toggleSection(section.id)}
              className="flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-white/[0.03]"
            >
              <span className="text-2xl">{section.emoji}</span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-white">{section.label}</p>
                <p className="text-xs text-white/45">{section.subtitle}</p>
                <div className="mt-1.5 flex flex-wrap gap-2 text-[10px] text-white/40">
                  <span>
                    {done}/{sectionTasks.length} {de.ui.tasks}
                  </span>
                  {dur > 0 && (
                    <span className="inline-flex items-center gap-0.5">
                      <Clock className="h-3 w-3" /> ~{dur} Min.
                    </span>
                  )}
                  <span className="inline-flex items-center gap-0.5 text-violet-400/80">
                    <Zap className="h-3 w-3" /> {xp} XP
                  </span>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span className="text-xs font-semibold text-emerald-400/90">{pct}%</span>
                <ChevronDown
                  className={cn(
                    "h-5 w-5 text-white/40 transition-transform duration-300",
                    isOpen && "rotate-180"
                  )}
                />
              </div>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.28 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-3 border-t border-white/[0.06] p-3 pt-2">
                    {sectionTasks.map((task, i) => (
                      <ExerciseCard
                        key={task.id}
                        {...task}
                        index={i}
                        streak={streak}
                        interactive={interactive}
                        onToggle={(c) => onToggle(task.id, c)}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
