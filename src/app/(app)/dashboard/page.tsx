"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Flame,
  Droplets,
  Moon,
  Dumbbell,
  Beef,
  Camera,
  Crown,
} from "lucide-react";
import { BottomNav } from "@/components/app/bottom-nav";
import { GlassCard } from "@/components/app/glass-card";
import { ScoreRing } from "@/components/app/score-ring";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { LoadingScreen } from "@/components/app/loading-screen";
import { getGreeting, getDailyQuote } from "@/lib/utils";

interface DashboardData {
  profile: { currentStreak: number; name?: string };
  latestAnalysis: { looksScore: number } | null;
  dailyTask: { tasks: Array<{ id: string; label: string; completed: boolean }>; completed: number; total: number } | null;
  todayStat: { waterLiters?: number; proteinGrams?: number; calories?: number; sleepHours?: number; workoutDone?: boolean } | null;
  activeChallenge: { challenge: { title: string }; progress: number } | null;
  weeklyImprovement: number;
  isPremium: boolean;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <LoadingScreen />;
  if (!data) return null;

  const taskProgress = data.dailyTask
    ? (data.dailyTask.completed / data.dailyTask.total) * 100
    : 0;

  return (
    <>
      <div className="px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-white/60">{getGreeting()}</p>
          <h1 className="text-3xl font-bold text-white">
            {data.profile?.currentStreak ? "Keep ascending" : "Start ascending"}
          </h1>
        </motion.div>

        {!data.isPremium && (
          <Link href="/premium">
            <GlassCard className="mt-6 flex items-center gap-3 border-amber-500/20 bg-amber-500/5" delay={0.05}>
              <Crown className="h-8 w-8 text-amber-400" />
              <div className="flex-1">
                <p className="font-semibold text-white">Upgrade to Premium</p>
                <p className="text-xs text-white/60">Unlimited analyses, AI coach & more</p>
              </div>
            </GlassCard>
          </Link>
        )}

        <GlassCard className="mt-6 flex items-center justify-between" delay={0.1}>
          {data.latestAnalysis ? (
            <ScoreRing score={data.latestAnalysis.looksScore} size={100} />
          ) : (
            <div className="text-center">
              <p className="text-4xl font-bold text-white/30">—</p>
              <p className="text-sm text-white/60">No analysis yet</p>
            </div>
          )}
          <div className="space-y-4 text-right">
            <div>
              <p className="flex items-center justify-end gap-1 text-2xl font-bold text-orange-400">
                <Flame className="h-5 w-5" />
                {data.profile?.currentStreak ?? 0}
              </p>
              <p className="text-xs text-white/60">Day streak</p>
            </div>
            <div>
              <p className={`text-lg font-bold ${data.weeklyImprovement >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                {data.weeklyImprovement >= 0 ? "+" : ""}{data.weeklyImprovement.toFixed(1)}
              </p>
              <p className="text-xs text-white/60">Weekly score change</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="mt-4" delay={0.15}>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-semibold text-white">Today&apos;s Tasks</h3>
            <Link href="/tasks" className="text-xs text-violet-400">View all</Link>
          </div>
          <Progress value={taskProgress} className="mb-3" />
          <p className="mb-3 text-sm text-white/60">
            {data.dailyTask?.completed ?? 0} of {data.dailyTask?.total ?? 0} completed
          </p>
          <div className="space-y-2">
            {data.dailyTask?.tasks.slice(0, 4).map((t) => (
              <div key={t.id} className="flex items-center gap-2 text-sm">
                <div className={`h-2 w-2 rounded-full ${t.completed ? "bg-emerald-400" : "bg-white/20"}`} />
                <span className={t.completed ? "text-white/40 line-through" : "text-white/80"}>
                  {t.label}
                </span>
              </div>
            ))}
          </div>
        </GlassCard>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <StatMini icon={Droplets} label="Water" value={`${data.todayStat?.waterLiters ?? 0}L`} target="3L" delay={0.2} />
          <StatMini icon={Beef} label="Protein" value={`${data.todayStat?.proteinGrams ?? 0}g`} target="150g" delay={0.22} />
          <StatMini icon={Moon} label="Sleep" value={`${data.todayStat?.sleepHours ?? 0}h`} target="8h" delay={0.24} />
          <StatMini icon={Dumbbell} label="Workout" value={data.todayStat?.workoutDone ? "Done" : "Pending"} delay={0.26} />
        </div>

        {data.activeChallenge && (
          <Link href="/challenges">
            <GlassCard className="mt-4" delay={0.3}>
            <h3 className="font-semibold text-white">Active Challenge</h3>
            <p className="mt-1 text-sm text-violet-400">{data.activeChallenge.challenge.title}</p>
            <Progress value={data.activeChallenge.progress} className="mt-3" />
            </GlassCard>
          </Link>
        )}

        <Link href="/settings" className="mt-4 block text-center text-sm text-white/40 hover:text-white/60">
          Settings & notifications
        </Link>

        <GlassCard className="mt-4 italic" delay={0.35}>
          <p className="text-sm text-white/70">&ldquo;{getDailyQuote()}&rdquo;</p>
        </GlassCard>

        {!data.latestAnalysis && (
          <Button asChild className="mt-6 w-full" size="lg">
            <Link href="/upload">
              <Camera className="h-5 w-5" /> Start First Analysis
            </Link>
          </Button>
        )}
      </div>
      <BottomNav />
    </>
  );
}

function StatMini({
  icon: Icon,
  label,
  value,
  target,
  delay,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  target?: string;
  delay?: number;
}) {
  return (
    <GlassCard delay={delay} className="!p-4">
      <Icon className="mb-2 h-5 w-5 text-violet-400" />
      <p className="text-lg font-bold text-white">{value}</p>
      <p className="text-xs text-white/60">{label}{target ? ` / ${target}` : ""}</p>
    </GlassCard>
  );
}
