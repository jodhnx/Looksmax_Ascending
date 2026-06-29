"use client";

import Link from "next/link";
import {
  Flame,
  Camera,
  ChevronRight,
  Zap,
  Target,
} from "lucide-react";
import { BottomNav } from "@/components/app/bottom-nav";
import { ScoreRing } from "@/components/app/score-ring";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { getGreetingDE, de } from "@/lib/i18n/de";
import { useStorage } from "@/hooks/use-storage";
import { getDashboardFromStorage, getCurrentPlanDay, todayKey } from "@/lib/storage/helpers";
import { getTotalXp, getLevelProgress, getTodayXp } from "@/lib/gamification/xp";
import { getWeakestCategory } from "@/lib/analysis/scoring";
import { getFocusAreaDE } from "@/lib/i18n/de";

export default function DashboardPage() {
  const { data } = useStorage();
  const dash = getDashboardFromStorage(data);
  const planDay = getCurrentPlanDay(data);
  const today = todayKey();
  const latest = dash.latestAnalysis;
  const ascendScore = latest?.ascendScore ?? latest?.looksScore;

  const taskProgress = dash.dailyTask
    ? (dash.dailyTask.completed / Math.max(dash.dailyTask.total, 1)) * 100
    : 0;

  const totalXp = getTotalXp(data);
  const levelInfo = getLevelProgress(totalXp);
  const todayXp = getTodayXp(data, today);
  const todayPlan = data.ascensionPlans[planDay - 1];

  const nextTasks = (dash.dailyTask?.tasks ?? [])
    .filter((t) => !t.completed)
    .slice(0, 3);

  const currentFocus = latest
    ? getFocusAreaDE(getWeakestCategory(latest.scores))
    : null;

  return (
    <>
      <div className="min-h-screen bg-background pb-28">
        <div className="page-glow pointer-events-none fixed inset-0" />

        <div className="relative mx-auto max-w-lg px-5 pt-[max(env(safe-area-inset-top),20px)] sm:px-6">
          <header className="pb-5">
            <p className="text-xs font-medium text-white/40">{getGreetingDE()}</p>
            <h1 className="mt-0.5 text-2xl font-semibold tracking-tight text-white">
              {de.dashboard.title}
            </h1>
          </header>

          {!latest ? (
            <div className="glass-card p-6 text-center">
              <p className="text-sm text-white/50">{de.dashboard.welcome}</p>
              <Button asChild className="mt-5 h-12 w-full rounded-2xl" size="lg">
                <Link href="/upload">
                  <Camera className="h-4 w-4" />
                  {de.dashboard.startAnalysis}
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Score + Level row */}
              <div className="glass-card flex items-center gap-4 p-4">
                <ScoreRing
                  score={ascendScore ?? 0}
                  maxScore={100}
                  size={88}
                  label={de.dashboard.ascendScore}
                />
                <div className="min-w-0 flex-1 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-medium uppercase tracking-wider text-white/35">
                        {de.dashboard.level}
                      </p>
                      <p className="text-xl font-bold text-white">{levelInfo.level}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-medium uppercase tracking-wider text-white/35">
                        {de.dashboard.streak}
                      </p>
                      <p className="flex items-center justify-end gap-1 text-xl font-bold text-orange-400">
                        <Flame className="h-4 w-4" />
                        {dash.profile?.currentStreak ?? 0}
                      </p>
                    </div>
                  </div>
                  <div>
                    <div className="mb-1 flex justify-between text-[10px] text-white/40">
                      <span>{de.dashboard.totalXp}</span>
                      <span className="text-violet-400">
                        {levelInfo.current}/{levelInfo.next}
                      </span>
                    </div>
                    <Progress value={levelInfo.percent} className="h-1" />
                  </div>
                </div>
              </div>

              {/* Today + Week progress */}
              <div className="grid grid-cols-2 gap-3">
                <div className="glass-card p-4">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-white/35">
                    {de.dashboard.todayProgress}
                  </p>
                  <p className="mt-1 text-2xl font-bold text-white">
                    {Math.round(taskProgress)}%
                  </p>
                  <Progress value={taskProgress} className="mt-2 h-1" />
                  <p className="mt-1.5 text-[10px] text-white/40">
                    {dash.dailyTask?.completed ?? 0}/{dash.dailyTask?.total ?? 0}
                  </p>
                </div>
                <div className="glass-card p-4">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-white/35">
                    {de.dashboard.weeklyProgress}
                  </p>
                  <p className="mt-1 text-2xl font-bold text-white">
                    {de.dashboard.day} {planDay}
                  </p>
                  <p className="mt-1 text-[10px] text-white/40">{todayPlan?.phase}</p>
                  <p className="mt-2 flex items-center gap-1 text-xs text-violet-400">
                    <Zap className="h-3 w-3" />
                    {todayXp.earned}/{todayXp.total} XP
                  </p>
                </div>
              </div>

              {/* Focus */}
              {currentFocus && (
                <div className="glass-card flex items-center gap-3 p-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-500/15">
                    <Target className="h-4 w-4 text-violet-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-white/40">{de.dashboard.currentFocus}</p>
                    <p className="truncate text-sm font-medium text-white">{currentFocus}</p>
                  </div>
                </div>
              )}

              {/* Next tasks */}
              {nextTasks.length > 0 && (
                <div className="glass-card p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-sm font-medium text-white">{de.dashboard.nextTasks}</p>
                    <Link href="/tasks" className="text-xs text-violet-400">
                      {de.dashboard.viewAll}
                    </Link>
                  </div>
                  <div className="space-y-2">
                    {nextTasks.map((t) => (
                      <Link
                        key={t.id}
                        href="/tasks"
                        className="flex items-center gap-3 rounded-xl bg-white/[0.03] px-3 py-2.5 transition-colors active:bg-white/[0.06]"
                      >
                        <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400" />
                        <span className="min-w-0 flex-1 truncate text-sm text-white/80">
                          {t.label}
                        </span>
                        <ChevronRight className="h-4 w-4 shrink-0 text-white/25" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick links */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <Link href="/plan" className="glass-card block p-4 transition-colors active:bg-white/[0.06]">
                  <p className="text-sm font-medium text-white">{de.nav.plan}</p>
                  <p className="mt-0.5 text-[10px] text-white/40">
                    {de.dashboard.day} {planDay}/30
                  </p>
                </Link>
                <Link href="/tasks" className="glass-card block p-4 transition-colors active:bg-white/[0.06]">
                  <p className="text-sm font-medium text-white">{de.nav.tasks}</p>
                  <p className="mt-0.5 text-[10px] text-white/40">{de.dashboard.todayTasks}</p>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
      <BottomNav />
    </>
  );
}
