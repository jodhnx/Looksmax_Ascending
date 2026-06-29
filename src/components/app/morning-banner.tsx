"use client";

import { Flame, Sparkles, Target, Zap } from "lucide-react";
import { GlassCard } from "@/components/app/glass-card";
import { de } from "@/lib/i18n/de";

interface MorningBannerProps {
  todayFocus: string;
  dailyQuote: string;
  estimatedImprovement: string;
  xpAvailable: number;
  completionReward: string;
  weeklyGoal: string;
  streak?: number;
  delay?: number;
}

export function MorningBanner({
  todayFocus,
  dailyQuote,
  estimatedImprovement,
  xpAvailable,
  completionReward,
  weeklyGoal,
  streak = 0,
  delay = 0,
}: MorningBannerProps) {
  return (
    <GlassCard className="overflow-hidden border-violet-500/20 !p-0" delay={delay}>
      <div className="bg-gradient-to-br from-violet-600/20 via-indigo-600/10 to-transparent p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-violet-300/70">
              {de.plan.todayFocus}
            </p>
            <p className="mt-1 text-lg font-bold leading-tight text-white">{todayFocus}</p>
          </div>
          {streak > 0 && (
            <div className="flex items-center gap-1 rounded-full bg-orange-500/20 px-2.5 py-1">
              <Flame className="h-3.5 w-3.5 text-orange-400" />
              <span className="text-xs font-bold text-orange-300">{streak}</span>
            </div>
          )}
        </div>

        <p className="mt-3 text-sm italic leading-relaxed text-white/60">
          &ldquo;{dailyQuote}&rdquo;
        </p>
      </div>

      <div className="grid grid-cols-2 gap-px bg-white/5">
        <div className="bg-[#0a0a12]/80 p-3.5">
          <div className="flex items-center gap-1.5 text-[10px] text-white/45">
            <Target className="h-3 w-3" />
            {de.dashboard.improvementTrend}
          </div>
          <p className="mt-1 text-sm font-semibold text-emerald-400">{estimatedImprovement}</p>
        </div>
        <div className="bg-[#0a0a12]/80 p-3.5">
          <div className="flex items-center gap-1.5 text-[10px] text-white/45">
            <Zap className="h-3 w-3" />
            {de.dashboard.xpToday}
          </div>
          <p className="mt-1 text-sm font-semibold text-violet-300">{xpAvailable} XP</p>
        </div>
        <div className="col-span-2 bg-[#0a0a12]/80 p-3.5">
          <div className="flex items-center gap-1.5 text-[10px] text-white/45">
            <Sparkles className="h-3 w-3" />
            {de.dashboard.completionReward}
          </div>
          <p className="mt-1 text-xs text-white/70">{completionReward}</p>
          <p className="mt-2 text-[11px] text-white/45">
            <span className="text-white/60">{de.plan.weeklyGoal}:</span> {weeklyGoal}
          </p>
        </div>
      </div>
    </GlassCard>
  );
}
