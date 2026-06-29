"use client";

import { motion } from "framer-motion";
import { BottomNav } from "@/components/app/bottom-nav";
import { GlassCard } from "@/components/app/glass-card";
import { formatScore } from "@/lib/utils";
import { useStorage } from "@/hooks/use-storage";
import { de } from "@/lib/i18n/de";

export default function StatsPage() {
  const { data } = useStorage();
  const stats = data.statistics;
  const latest = stats[stats.length - 1];
  const workouts = stats.filter((s) => s.workoutDone).length;

  const metrics = [
    { label: de.stats.faceScore, value: latest?.faceScore, format: formatScore },
    { label: de.stats.skinScore, value: latest?.skinScore, format: formatScore },
    { label: de.stats.jawScore, value: latest?.jawScore, format: formatScore },
    { label: de.stats.weight, value: latest?.weightKg, format: (v: number) => `${v} kg` },
    { label: de.stats.bodyfat, value: latest?.bodyfat, format: (v: number) => `${v}%` },
    {
      label: de.stats.avgSleep,
      value: avg(stats.map((s) => s.sleepHours)),
      format: (v: number) => `${v.toFixed(1)}h`,
    },
    {
      label: de.stats.avgWater,
      value: avg(stats.map((s) => s.waterLiters)),
      format: (v: number) => `${v.toFixed(1)}L`,
    },
    {
      label: de.stats.workouts,
      value: workouts,
      format: (v: number) => `${v} Tage`,
    },
  ];

  return (
    <>
      <div className="px-6 py-8">
        <h1 className="text-2xl font-bold tracking-tight text-white">{de.stats.title}</h1>
        <p className="text-sm text-white/50">{de.stats.subtitle}</p>

        <div className="mt-6 grid grid-cols-2 gap-3">
          {metrics.map((m, i) => (
            <GlassCard key={m.label} delay={i * 0.03} className="!p-4">
              <p className="text-xs text-white/50">{m.label}</p>
              <p className="mt-1 text-xl font-bold text-white">
                {m.value != null ? m.format(m.value) : "—"}
              </p>
            </GlassCard>
          ))}
        </div>

        {stats.length > 1 && (
          <GlassCard className="mt-6" delay={0.25}>
            <h3 className="mb-4 font-semibold text-white">{de.stats.trend}</h3>
            <div className="flex h-32 items-end gap-1">
              {stats.slice(-14).map((s, i) => (
                <motion.div
                  key={s.date}
                  initial={{ height: 0 }}
                  animate={{ height: `${s.faceScore ?? 0}%` }}
                  transition={{ delay: i * 0.04, duration: 0.5 }}
                  className="flex-1 rounded-t bg-gradient-to-t from-violet-600 to-indigo-400"
                  style={{ minHeight: 4, maxHeight: "100%" }}
                />
              ))}
            </div>
            <p className="mt-2 text-xs text-white/40">
              {de.stats.lastEntries.replace("{n}", String(Math.min(stats.length, 14)))}
            </p>
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
