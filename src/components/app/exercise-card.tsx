"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlignCenter,
  Apple,
  Award,
  Bed,
  Brain,
  Cable,
  Camera,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  Droplets,
  Dumbbell,
  Flame,
  Footprints,
  Hand,
  HandHeart,
  Heart,
  Leaf,
  Moon,
  PanelTop,
  Sparkles,
  StretchHorizontal,
  Sun,
  Target,
  User,
  Utensils,
  Waves,
  Wind,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { TASK_CATEGORIES } from "@/lib/exercises/categories";
import { formatDuration } from "@/lib/exercises/habit-details";
import type { TaskCategory } from "@/lib/exercises/types";
import { de } from "@/lib/i18n/de";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, LucideIcon> = {
  "align-center": AlignCenter,
  "panel-top": PanelTop,
  cable: Cable,
  waves: Waves,
  dumbbell: Dumbbell,
  sun: Sun,
  sparkles: Sparkles,
  moon: Moon,
  droplets: Droplets,
  footprints: Footprints,
  apple: Apple,
  utensils: Utensils,
  bed: Bed,
  brain: Brain,
  hand: Hand,
  "hand-heart": HandHeart,
  heart: Heart,
  leaf: Leaf,
  flame: Flame,
  target: Target,
  user: User,
  camera: Camera,
  award: Award,
  wind: Wind,
  zap: Zap,
  "stretch-horizontal": StretchHorizontal,
};

const DIFFICULTY_STYLES = {
  leicht: "bg-emerald-500/15 text-emerald-300 border-emerald-500/25",
  mittel: "bg-amber-500/15 text-amber-300 border-amber-500/25",
  schwer: "bg-rose-500/15 text-rose-300 border-rose-500/25",
};

export interface ExerciseCardProps {
  id: string;
  title: string;
  description?: string;
  category: TaskCategory | string;
  durationMinutes?: number;
  difficulty?: "leicht" | "mittel" | "schwer";
  xp?: number;
  icon?: string;
  evidenceLevel?: "evidenzbasiert" | "optional";
  reason?: string;
  steps?: string[];
  benefits?: string[];
  hints?: string[];
  frequency?: string;
  targetGoals?: string[];
  estimatedImpact?: string;
  completed: boolean;
  onToggle: (checked: boolean) => void;
  index?: number;
  streak?: number;
  interactive?: boolean;
}

export function ExerciseCard({
  title,
  description,
  category,
  durationMinutes = 0,
  difficulty = "leicht",
  xp = 0,
  icon,
  evidenceLevel,
  reason,
  steps = [],
  benefits = [],
  hints = [],
  frequency,
  targetGoals = [],
  estimatedImpact,
  completed,
  onToggle,
  index = 0,
  streak = 0,
  interactive = true,
}: ExerciseCardProps) {
  const [expanded, setExpanded] = useState(false);
  const catKey = category as TaskCategory;
  const meta = TASK_CATEGORIES[catKey];
  const IconComp = ICON_MAP[icon ?? ""] ?? Sparkles;
  const catLabel = meta?.label ?? String(category);
  const catEmoji = meta?.emoji ?? "✓";
  const durationLabel = formatDuration(durationMinutes ?? 0);

  const toggleExpand = () => setExpanded((v) => !v);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, type: "spring", stiffness: 420, damping: 32 }}
      className="w-full"
    >
      <div
        className={cn(
          "relative w-full overflow-hidden rounded-3xl border backdrop-blur-2xl transition-colors duration-300",
          "shadow-[0_8px_32px_rgba(0,0,0,0.35)]",
          completed
            ? "border-emerald-500/30 bg-emerald-500/[0.07]"
            : "border-white/[0.08] bg-white/[0.045]"
        )}
      >
        {completed && (
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-500/[0.08] to-transparent" />
        )}

        {/* Collapsed header */}
        <div className="relative flex items-start gap-3 p-4 sm:p-5">
          {interactive && (
            <div className="relative shrink-0 pt-1">
              <Checkbox
                checked={completed}
                onCheckedChange={(c) => onToggle(c === true)}
                className="h-6 w-6 rounded-lg border-white/20 data-[state=checked]:border-emerald-500 data-[state=checked]:bg-emerald-500"
              />
              <AnimatePresence>
                {completed && (
                  <motion.div
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0 }}
                    transition={{ type: "spring", bounce: 0.55 }}
                    className="pointer-events-none absolute -right-1 -top-1"
                  >
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 drop-shadow" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          <div
            className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl",
              "bg-gradient-to-br from-white/10 to-white/[0.03] shadow-inner",
              completed && "opacity-60"
            )}
          >
            <span className="text-xl leading-none">{catEmoji}</span>
          </div>

          <div className="min-w-0 flex-1">
            <p
              className={cn(
                "break-words text-[17px] font-semibold leading-snug tracking-tight text-white",
                completed && "text-white/45 line-through decoration-white/30"
              )}
            >
              {title}
            </p>

            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.06] px-2.5 py-1 text-xs text-white/70">
                <Clock className="h-3 w-3 shrink-0 opacity-70" />
                {durationLabel}
              </span>
              <span
                className={cn(
                  "rounded-full border px-2.5 py-1 text-xs font-medium",
                  DIFFICULTY_STYLES[difficulty]
                )}
              >
                {de.ui.difficulty[difficulty]}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.06] px-2.5 py-1 text-xs text-white/60">
                <IconComp className="h-3 w-3 shrink-0" />
                {catLabel}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={toggleExpand}
            aria-expanded={expanded}
            className="flex shrink-0 items-center gap-1 rounded-xl px-2 py-2 text-xs font-medium text-violet-300/90 transition-colors hover:bg-white/[0.06] active:scale-95"
          >
            <span className="hidden min-[380px]:inline">
              {expanded ? de.ui.showLess : de.ui.showMore}
            </span>
            <ChevronDown
              className={cn("h-4 w-4 transition-transform duration-300", expanded && "rotate-180")}
            />
          </button>
        </div>

        {/* Expanded accordion */}
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              key="content"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
              className="overflow-hidden"
            >
              <div className="space-y-4 border-t border-white/[0.06] px-4 pb-5 pt-4 sm:px-5">
                {reason && (
                  <Section title={de.ui.whyRecommended}>
                    <p className="break-words text-sm leading-relaxed text-violet-200/85">
                      {reason}
                    </p>
                  </Section>
                )}

                <Section title={de.ui.description}>
                  <p className="break-words text-sm leading-relaxed text-white/75">
                    {description}
                  </p>
                </Section>

                {steps.length > 0 && (
                  <Section title={de.ui.steps}>
                    <ol className="space-y-2.5">
                      {steps.map((step, si) => (
                        <li key={si} className="flex gap-3 text-sm leading-relaxed text-white/80">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-500/20 text-xs font-bold text-violet-300">
                            {si + 1}
                          </span>
                          <span className="min-w-0 flex-1 break-words pt-0.5">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </Section>
                )}

                {benefits.length > 0 && (
                  <Section title={de.ui.goals}>
                    <ul className="space-y-2">
                      {benefits.map((b) => (
                        <li key={b} className="flex gap-2 text-sm leading-relaxed text-white/75">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                          <span className="break-words">{b}</span>
                        </li>
                      ))}
                    </ul>
                  </Section>
                )}

                {targetGoals.length > 0 && (
                  <Section title={de.ui.target}>
                    <div className="flex flex-wrap gap-2">
                      {targetGoals.map((g) => (
                        <span
                          key={g}
                          className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs text-white/70"
                        >
                          {g}
                        </span>
                      ))}
                    </div>
                  </Section>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <InfoTile label={de.ui.duration} value={durationLabel} />
                  {frequency && <InfoTile label={de.ui.frequency} value={frequency} />}
                </div>

                {estimatedImpact && (
                  <Section title={de.ui.benefits}>
                    <p className="break-words text-sm leading-relaxed text-white/65">
                      {estimatedImpact}
                    </p>
                  </Section>
                )}

                {hints.length > 0 && (
                  <Section title={de.ui.hints}>
                    <ul className="space-y-2">
                      {hints.map((h) => (
                        <li key={h} className="break-words text-sm leading-relaxed text-white/65">
                          · {h}
                        </li>
                      ))}
                    </ul>
                  </Section>
                )}

                {evidenceLevel === "optional" && (
                  <p className="break-words rounded-2xl border border-fuchsia-500/20 bg-fuchsia-500/10 px-4 py-3 text-xs leading-relaxed text-fuchsia-200/80">
                    {de.ui.optionalDisclaimer}
                  </p>
                )}

                {/* Fortschritt */}
                <Section title={de.ui.progress}>
                  <div className="flex flex-wrap items-center gap-3">
                    {interactive && (
                      <Button
                        size="sm"
                        onClick={() => onToggle(!completed)}
                        className={cn(
                          "h-10 rounded-xl px-5",
                          completed
                            ? "bg-emerald-600/80 hover:bg-emerald-600"
                            : "bg-violet-600 hover:bg-violet-500"
                        )}
                      >
                        {completed ? (
                          <>
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            {de.ui.doneToday}
                          </>
                        ) : (
                          de.ui.markComplete
                        )}
                      </Button>
                    )}
                    {xp > 0 && (
                      <motion.span
                        key={completed ? "done" : "open"}
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        className={cn(
                          "inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-bold",
                          completed
                            ? "bg-emerald-500/20 text-emerald-300"
                            : "bg-violet-500/20 text-violet-300"
                        )}
                      >
                        <Zap className="h-3.5 w-3.5" />
                        +{xp} XP
                      </motion.span>
                    )}
                    {streak > 0 && (
                      <span className="inline-flex items-center gap-1 text-xs text-orange-300/90">
                        <Flame className="h-3.5 w-3.5" />
                        {streak} {de.ui.streakDays}
                      </span>
                    )}
                  </div>
                </Section>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-white/40">
        {title}
      </h4>
      {children}
    </div>
  );
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.04] px-3 py-3">
      <p className="text-[10px] font-medium uppercase tracking-wide text-white/40">{label}</p>
      <p className="mt-1 break-words text-sm font-semibold text-white">{value}</p>
    </div>
  );
}
