"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Flame,
  Calendar,
  CheckSquare,
  Camera,
  Sparkles,
  Dumbbell,
  Target,
} from "lucide-react";
import { BottomNav } from "@/components/app/bottom-nav";
import { GlassCard } from "@/components/app/glass-card";
import { ScoreRing } from "@/components/app/score-ring";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { getGreetingDE, getDailyQuoteDE, de } from "@/lib/i18n/de";
import { useStorage } from "@/hooks/use-storage";
import { getDashboardFromStorage, getCurrentPlanDay } from "@/lib/storage/helpers";
import { daysSince } from "@/lib/plan-utils";
import { getWeakestCategory } from "@/lib/analysis/scoring";
import { getFocusAreaDE } from "@/lib/i18n/de";

export default function DashboardPage() {
  const { data } = useStorage();
  const dash = getDashboardFromStorage(data);
  const planDay = getCurrentPlanDay(data);
  const latest = dash.latestAnalysis;
  const ascendScore = latest?.ascendScore ?? latest?.looksScore;

  const taskProgress = dash.dailyTask
    ? (dash.dailyTask.completed / dash.dailyTask.total) * 100
    : 0;

  const lastProgressDate =
    data.progressChecks[0]?.createdAt ?? latest?.createdAt;
  const daysUntilScan = Math.max(0, 7 - daysSince(lastProgressDate));
  const needsScan = daysSince(lastProgressDate) >= 7 && latest;

  const weekProgress = Math.min(100, taskProgress);
  const currentFocus = latest
    ? getFocusAreaDE(getWeakestCategory(latest.scores))
    : null;

  return (
    <>
      <div className="px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-sm text-white/50">{getGreetingDE()}</p>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            {latest ? de.dashboard.title : de.dashboard.welcome}
          </h1>
        </motion.div>

        {needsScan && (
          <Link href="/progress">
            <GlassCard className="mt-5 flex items-center gap-3 border-violet-500/30 bg-violet-500/10" delay={0.05}>
              <Camera className="h-8 w-8 shrink-0 text-violet-400" />
              <div className="flex-1">
                <p className="font-semibold text-white">{de.dashboard.weeklyScanDue}</p>
                <p className="text-xs text-white/60">{de.dashboard.weeklyScanHint}</p>
              </div>
            </GlassCard>
          </Link>
        )}

        <GlassCard className="mt-5" delay={0.08}>
          <div className="flex items-center justify-between">
            {ascendScore != null ? (
              <ScoreRing score={ascendScore} maxScore={100} size={110} label={de.dashboard.ascendScore} />
            ) : (
              <div className="py-4 text-center">
                <p className="text-4xl font-bold text-white/20">—</p>
                <p className="text-sm text-white/50">{de.dashboard.noScan}</p>
              </div>
            )}
            <div className="space-y-5 text-right">
              <div>
                <p className="flex items-center justify-end gap-1.5 text-2xl font-bold text-orange-400">
                  <Flame className="h-5 w-5" />
                  {dash.profile?.currentStreak ?? 0}
                </p>
                <p className="text-xs text-white/50">{de.dashboard.streak}</p>
              </div>
              <div>
                <p className="flex items-center justify-end gap-1.5 text-lg font-bold text-violet-400">
                  <Calendar className="h-4 w-4" />
                  {latest ? `${de.dashboard.day} ${planDay}` : "—"}
                </p>
                <p className="text-xs text-white/50">{de.dashboard.planDay}</p>
              </div>
            </div>
          </div>

          {latest && (
            <div className="mt-5 space-y-3 border-t border-white/10 pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-white/50">{de.dashboard.improvementTrend}</span>
                <span
                  className={`font-semibold ${
                    dash.weeklyImprovement >= 0 ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {dash.weeklyImprovement >= 0 ? "+" : ""}
                  {dash.weeklyImprovement.toFixed(0)} Pkt.
                </span>
              </div>
              <div>
                <div className="mb-1 flex justify-between text-xs text-white/45">
                  <span>{de.dashboard.weeklyGoal}</span>
                  <span>{Math.round(weekProgress)}%</span>
                </div>
                <Progress value={weekProgress} className="h-1.5" />
              </div>
              {!needsScan && (
                <p className="text-xs text-white/40">
                  {de.dashboard.nextScan} {daysUntilScan}{" "}
                  {daysUntilScan === 1 ? de.dashboard.day : de.dashboard.days}
                </p>
              )}
            </div>
          )}
        </GlassCard>

        {currentFocus && (
          <GlassCard className="mt-4 border-violet-500/20" delay={0.1}>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-500/20">
                <Target className="h-5 w-5 text-violet-400" />
              </div>
              <div>
                <p className="text-xs text-white/50">{de.dashboard.currentFocus}</p>
                <p className="font-semibold text-white">{currentFocus}</p>
              </div>
            </div>
          </GlassCard>
        )}

        <GlassCard className="mt-4" delay={0.12}>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="flex items-center gap-2 font-semibold text-white">
              <CheckSquare className="h-4 w-4 text-violet-400" />
              {de.dashboard.todayTasks}
            </h3>
            <Link href="/tasks" className="text-xs text-violet-400">
              {de.dashboard.viewAll}
            </Link>
          </div>
          <Progress value={taskProgress} className="mb-2 h-2" />
          <p className="mb-3 text-sm text-white/50">
            {Math.round(taskProgress)}% · {dash.dailyTask?.completed ?? 0}/
            {dash.dailyTask?.total ?? 0} {de.dashboard.complete}
          </p>
          <div className="space-y-2">
            {(dash.dailyTask?.tasks ?? []).slice(0, 4).map((t) => (
              <div key={t.id} className="flex items-center gap-2.5 text-sm">
                <div
                  className={`h-2 w-2 rounded-full ${
                    t.completed ? "bg-emerald-400" : "bg-white/20"
                  }`}
                />
                <span className={t.completed ? "text-white/35 line-through" : "text-white/80"}>
                  {t.label}
                </span>
              </div>
            ))}
          </div>
        </GlassCard>

        {latest && (
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Link href="/plan">
              <GlassCard delay={0.16} className="!p-4 transition-colors hover:bg-white/[0.07]">
                <Calendar className="mb-2 h-5 w-5 text-violet-400" />
                <p className="font-semibold text-white">
                  {de.dashboard.day} {planDay}
                </p>
                <p className="text-xs text-white/50">{de.dashboard.planLink}</p>
              </GlassCard>
            </Link>
            <Link href="/exercises">
              <GlassCard delay={0.18} className="!p-4 transition-colors hover:bg-white/[0.07]">
                <Dumbbell className="mb-2 h-5 w-5 text-emerald-400" />
                <p className="font-semibold text-white">{de.nav.exercises}</p>
                <p className="text-xs text-white/50">{de.dashboard.exercisesLink}</p>
              </GlassCard>
            </Link>
          </div>
        )}

        <GlassCard className="mt-4 border-violet-500/10" delay={0.22}>
          <div className="flex items-start gap-3">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-violet-400" />
            <p className="text-sm italic leading-relaxed text-white/65">
              &ldquo;{getDailyQuoteDE()}&rdquo;
            </p>
          </div>
        </GlassCard>

        {!latest && (
          <Button asChild className="mt-6 h-14 w-full rounded-2xl" size="lg">
            <Link href="/upload">
              <Camera className="h-5 w-5" /> {de.dashboard.startAnalysis}
            </Link>
          </Button>
        )}
      </div>
      <BottomNav />
    </>
  );
}
