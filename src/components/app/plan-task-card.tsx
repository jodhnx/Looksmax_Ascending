"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  AlignCenter,
  Apple,
  Award,
  Bed,
  Brain,
  Cable,
  Camera,
  CheckCircle2,
  Circle,
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
import { TASK_CATEGORIES } from "@/lib/exercises/categories";
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
  circle: Circle,
  "stretch-horizontal": StretchHorizontal,
};

const DIFFICULTY_COLORS = {
  leicht: "bg-emerald-500/20 text-emerald-400 border-emerald-500/20",
  mittel: "bg-amber-500/20 text-amber-400 border-amber-500/20",
  schwer: "bg-rose-500/20 text-rose-400 border-rose-500/20",
};

const CATEGORY_RING: Record<TaskCategory, string> = {
  hautpflege: "ring-violet-500/30",
  gym: "ring-rose-500/30",
  ernaehrung: "ring-emerald-500/30",
  schlaf: "ring-indigo-500/30",
  cardio: "ring-sky-500/30",
  haltung: "ring-amber-500/30",
  gesichtsmassage: "ring-pink-500/30",
  mobilitaet: "ring-teal-500/30",
  wasser: "ring-cyan-500/30",
  fortschritt: "ring-lime-500/30",
  gesicht: "ring-fuchsia-500/30",
  lifestyle: "ring-orange-500/30",
  haarpflege: "ring-purple-500/30",
};

export interface TaskCardProps {
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
  completed: boolean;
  onToggle: (checked: boolean) => void;
  index?: number;
  showReason?: boolean;
}

export function PlanTaskCard({
  title,
  description,
  category,
  durationMinutes,
  difficulty,
  xp,
  icon,
  evidenceLevel,
  reason,
  completed,
  onToggle,
  index = 0,
  showReason = false,
}: TaskCardProps) {
  const catKey = category as TaskCategory;
  const meta = TASK_CATEGORIES[catKey];
  const Icon = ICON_MAP[icon ?? ""] ?? Sparkles;
  const catLabel = meta?.label ?? category;
  const catEmoji = meta?.emoji ?? "✓";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, type: "spring", stiffness: 400, damping: 30 }}
    >
      <motion.div
        layout
        className={cn(
          "group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl transition-all duration-300",
          completed && "border-emerald-500/35 bg-emerald-500/[0.06]",
          !completed && meta && CATEGORY_RING[catKey]
        )}
        whileTap={{ scale: 0.98 }}
      >
        {completed && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent"
          />
        )}

        <label className="relative flex cursor-pointer items-start gap-3.5">
          <div className="relative mt-0.5">
            <Checkbox
              checked={completed}
              onCheckedChange={(c) => onToggle(c === true)}
              className="h-5 w-5 rounded-lg border-white/20 data-[state=checked]:border-emerald-500 data-[state=checked]:bg-emerald-500"
            />
            <AnimatePresence>
              {completed && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="pointer-events-none absolute -right-1 -top-1"
                >
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex min-w-0 flex-1 gap-3">
            <div
              className={cn(
                "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/8 text-lg",
                completed && "opacity-50"
              )}
            >
              <span className="text-base">{catEmoji}</span>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <p
                  className={cn(
                    "font-semibold leading-snug text-white",
                    completed && "text-white/40 line-through"
                  )}
                >
                  {title}
                </p>
                {xp != null && xp > 0 && (
                  <span
                    className={cn(
                      "shrink-0 rounded-full bg-violet-500/20 px-2 py-0.5 text-[10px] font-bold text-violet-300",
                      completed && "opacity-50"
                    )}
                  >
                    +{xp} XP
                  </span>
                )}
              </div>

              {description && !completed && (
                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-white/50">
                  {description}
                </p>
              )}

              <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-white/60">
                  <Icon className="h-3 w-3 opacity-70" />
                  {catLabel}
                </span>
                {difficulty && (
                  <span
                    className={cn(
                      "rounded-full border px-2 py-0.5 text-[10px] font-medium",
                      DIFFICULTY_COLORS[difficulty]
                    )}
                  >
                    {de.tasks.difficulty[difficulty]}
                  </span>
                )}
                {durationMinutes != null && durationMinutes > 0 ? (
                  <span className="flex items-center gap-1 text-[10px] text-white/45">
                    <Clock className="h-3 w-3" />
                    {durationMinutes} {de.tasks.minutes}
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[10px] text-white/45">
                    <Zap className="h-3 w-3" />
                    Ganztägig
                  </span>
                )}
                {evidenceLevel === "optional" && (
                  <span className="rounded-full bg-fuchsia-500/15 px-2 py-0.5 text-[10px] text-fuchsia-300">
                    {de.tasks.optional}
                  </span>
                )}
              </div>

              {showReason && reason && !completed && (
                <p className="mt-2 rounded-xl bg-violet-500/10 px-3 py-2 text-[11px] leading-relaxed text-violet-200/80">
                  <span className="font-medium text-violet-300">{de.plan.whyRecommended} </span>
                  {reason}
                </p>
              )}
            </div>
          </div>
        </label>
      </motion.div>
    </motion.div>
  );
}
