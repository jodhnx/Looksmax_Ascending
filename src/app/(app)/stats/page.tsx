"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Crown } from "lucide-react";
import { BottomNav } from "@/components/app/bottom-nav";
import { GlassCard } from "@/components/app/glass-card";
import { LoadingScreen } from "@/components/app/loading-screen";
import { Button } from "@/components/ui/button";
import { formatScore } from "@/lib/utils";

interface Stat {
  date: string;
  weightKg?: number;
  bodyfat?: number;
  faceScore?: number;
  skinScore?: number;
  jawScore?: number;
  sleepHours?: number;
  waterLiters?: number;
  workoutDone?: boolean;
  calories?: number;
  proteinGrams?: number;
}

export default function StatsPage() {
  const [stats, setStats] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(true);

  useEffect(() => {
    fetch("/api/stats?days=30")
      .then((r) => r.json())
      .then((data) => {
        setStats(data.stats ?? []);
        setLoading(false);
      });
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then((d) => setIsPremium(d.isPremium));
  }, []);

  if (loading) return <LoadingScreen />;

  const latest = stats[stats.length - 1];
  const workouts = stats.filter((s) => s.workoutDone).length;

  const metrics = [
    { label: "Face Score", value: latest?.faceScore, format: formatScore },
    { label: "Skin Score", value: latest?.skinScore, format: formatScore },
    { label: "Jaw Score", value: latest?.jawScore, format: formatScore },
    { label: "Weight", value: latest?.weightKg, format: (v: number) => `${v} kg` },
    { label: "Bodyfat", value: latest?.bodyfat, format: (v: number) => `${v}%` },
    { label: "Avg Sleep", value: avg(stats.map((s) => s.sleepHours)), format: (v: number) => `${v.toFixed(1)}h` },
    { label: "Avg Water", value: avg(stats.map((s) => s.waterLiters)), format: (v: number) => `${v.toFixed(1)}L` },
    { label: "Workouts", value: workouts, format: (v: number) => `${v} days` },
  ];

  return (
    <>
      <div className="px-6 py-8">
        <h1 className="text-2xl font-bold text-white">Statistics</h1>
        <p className="text-white/60">Track your ascension metrics</p>

        {!isPremium && (
          <GlassCard className="mt-4 flex items-center gap-3 border-amber-500/20">
            <Crown className="h-6 w-6 text-amber-400" />
            <div className="flex-1">
              <p className="text-sm text-white/80">Advanced charts available with Premium</p>
            </div>
            <Button asChild size="sm" variant="secondary">
              <Link href="/premium">Upgrade</Link>
            </Button>
          </GlassCard>
        )}

        <div className="mt-6 grid grid-cols-2 gap-3">
          {metrics.map((m, i) => (
            <GlassCard key={m.label} delay={i * 0.03} className="!p-4">
              <p className="text-xs text-white/60">{m.label}</p>
              <p className="mt-1 text-xl font-bold text-white">
                {m.value != null ? m.format(m.value) : "—"}
              </p>
            </GlassCard>
          ))}
        </div>

        {isPremium && stats.length > 1 && (
          <GlassCard className="mt-6" delay={0.3}>
            <h3 className="mb-4 font-semibold text-white">Face Score Trend</h3>
            <div className="flex h-32 items-end gap-1">
              {stats.slice(-14).map((s, i) => (
                <motion.div
                  key={s.date}
                  initial={{ height: 0 }}
                  animate={{ height: `${((s.faceScore ?? 0) / 10) * 100}%` }}
                  transition={{ delay: i * 0.05 }}
                  className="flex-1 rounded-t bg-gradient-to-t from-violet-600 to-indigo-500"
                  style={{ minHeight: 4 }}
                />
              ))}
            </div>
          </GlassCard>
        )}
      </div>
      <BottomNav />
    </>
  );
}

function avg(nums: (number | undefined)[]): number {
  const valid = nums.filter((n): n is number => n != null);
  return valid.length ? valid.reduce((a, b) => a + b, 0) / valid.length : 0;
}
