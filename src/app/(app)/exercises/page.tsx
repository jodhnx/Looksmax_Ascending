"use client";

import { useState } from "react";
import { BottomNav } from "@/components/app/bottom-nav";
import { ExerciseCard } from "@/components/app/exercise-card";
import {
  EXERCISE_LIBRARY,
  CATEGORY_LABELS,
  type ExerciseCategory,
} from "@/lib/exercises";
import { cn } from "@/lib/utils";
import { de } from "@/lib/i18n/de";

const CATEGORIES = Object.keys(CATEGORY_LABELS) as ExerciseCategory[];

export default function ExercisesPage() {
  const [category, setCategory] = useState<ExerciseCategory | "all">("all");
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  const filtered =
    category === "all"
      ? EXERCISE_LIBRARY
      : EXERCISE_LIBRARY.filter((e) => e.category === category);

  const toggle = (id: string, checked: boolean) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  return (
    <>
      <div className="mx-auto max-w-lg px-5 py-8 pb-32 sm:px-6">
        <h1 className="text-2xl font-bold tracking-tight text-white">{de.exercises.title}</h1>
        <p className="text-sm text-white/50">{de.exercises.subtitle}</p>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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

        <p className="mt-3 text-xs text-white/40">{filtered.length} Übungen</p>

        <div className="mt-4 space-y-3">
          {filtered.map((ex, i) => (
            <ExerciseCard
              key={ex.id}
              id={ex.id}
              title={ex.name}
              description={ex.description}
              category={ex.category}
              durationMinutes={ex.durationMinutes}
              difficulty={ex.difficulty}
              xp={ex.xp}
              icon={ex.icon}
              evidenceLevel={ex.evidenceLevel}
              reason={`Diese Übung unterstützt: ${ex.targetArea}.`}
              steps={ex.instructions}
              benefits={ex.benefits}
              hints={ex.hints}
              frequency={ex.frequency}
              targetGoals={ex.targetGoals}
              estimatedImpact={ex.estimatedImpact}
              completed={completed.has(ex.id)}
              onToggle={(c) => toggle(ex.id, c)}
              index={i}
            />
          ))}
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
        "shrink-0 rounded-full px-4 py-2 text-xs font-medium transition-colors",
        active ? "bg-violet-600 text-white" : "bg-white/10 text-white/60 hover:bg-white/15"
      )}
    >
      {label}
    </button>
  );
}
