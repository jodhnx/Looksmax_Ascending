"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Dumbbell,
  Sun,
  Sparkles,
  Waves,
  ArrowUp,
  MoveVertical,
  StretchHorizontal,
  Circle,
  Hand,
  Flame,
  User,
} from "lucide-react";
import { BottomNav } from "@/components/app/bottom-nav";
import { GlassCard } from "@/components/app/glass-card";
import {
  EXERCISE_LIBRARY,
  CATEGORY_LABELS,
  type ExerciseCategory,
} from "@/lib/exercises/library";
import { cn } from "@/lib/utils";
import { de } from "@/lib/i18n/de";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  dumbbell: Dumbbell,
  sun: Sun,
  sparkles: Sparkles,
  waves: Waves,
  "arrow-up": ArrowUp,
  "move-vertical": MoveVertical,
  "stretch-horizontal": StretchHorizontal,
  circle: Circle,
  hand: Hand,
  flame: Flame,
  user: User,
};

const CATEGORIES = Object.keys(CATEGORY_LABELS) as ExerciseCategory[];

export default function ExercisesPage() {
  const [category, setCategory] = useState<ExerciseCategory | "all">("all");

  const filtered =
    category === "all"
      ? EXERCISE_LIBRARY
      : EXERCISE_LIBRARY.filter((e) => e.category === category);

  return (
    <>
      <div className="px-6 py-8">
        <h1 className="text-2xl font-bold tracking-tight text-white">{de.exercises.title}</h1>
        <p className="text-sm text-white/50">{de.exercises.subtitle}</p>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
          <FilterChip
            active={category === "all"}
            onClick={() => setCategory("all")}
            label={de.exercises.all}
          />
          {CATEGORIES.map((c) => (
            <FilterChip
              key={c}
              active={category === c}
              onClick={() => setCategory(c)}
              label={CATEGORY_LABELS[c]}
            />
          ))}
        </div>

        <div className="mt-6 space-y-4">
          {filtered.map((ex, i) => {
            const Icon = ICONS[ex.icon] ?? Dumbbell;
            return (
              <motion.div
                key={ex.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <GlassCard className="!p-0 overflow-hidden">
                  <div className="flex gap-4 p-5">
                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600/30 to-indigo-600/30"
                    >
                      <Icon className="h-7 w-7 text-violet-300" />
                    </motion.div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-white">{ex.name}</h3>
                        <span className="shrink-0 rounded-full bg-white/10 px-2 py-0.5 text-[10px] capitalize text-white/60">
                          {de.tasks.difficulty[ex.difficulty]}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-violet-300/80">
                        {ex.durationMinutes} {de.tasks.minutes} · {CATEGORY_LABELS[ex.category]}
                      </p>
                      <p className="mt-1 text-xs text-white/45">
                        {de.exercises.reminder}: {ex.reminder}
                      </p>
                      <p className="mt-2 text-sm text-white/60">{ex.description}</p>
                      <p className="mt-1 text-xs text-white/40">
                        {de.exercises.target}: {ex.targetArea}
                      </p>
                    </div>
                  </div>
                  <ol className="border-t border-white/10 bg-white/[0.02] px-5 py-4">
                    <p className="mb-2 text-xs font-medium text-white/50">{de.exercises.steps}</p>
                    {ex.instructions.map((step, si) => (
                      <li key={step} className="flex gap-2 text-sm text-white/75">
                        <span className="font-medium text-violet-400">{si + 1}.</span>
                        {step}
                      </li>
                    ))}
                  </ol>
                  <div className="border-t border-white/10 bg-violet-500/5 px-5 py-3">
                    <p className="text-center text-xs text-white/35">
                      {de.exercises.animation} — {ex.name}
                    </p>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </div>
      <BottomNav />
    </>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "shrink-0 rounded-full px-4 py-1.5 text-xs font-medium transition-colors",
        active ? "bg-violet-600 text-white" : "bg-white/10 text-white/60 hover:bg-white/15"
      )}
    >
      {label}
    </button>
  );
}
