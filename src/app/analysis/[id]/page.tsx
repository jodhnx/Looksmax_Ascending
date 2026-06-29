"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, Target, Sparkles, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScoreRing } from "@/components/app/score-ring";
import { GlassCard } from "@/components/app/glass-card";
import type { AnalysisScores } from "@/lib/analysis/types";
import { useStorage } from "@/hooks/use-storage";
import { de, getCategoryLabelDE } from "@/lib/i18n/de";

const METRIC_KEYS: (keyof AnalysisScores)[] = [
  "facialHarmony",
  "symmetry",
  "jawDefinition",
  "chin",
  "skin",
  "posture",
  "eyeArea",
  "hair",
  "presentation",
];

export default function AnalysisPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data } = useStorage();

  const analysis = data.analyses.find((a) => a.id === id);
  const analysisIndex = data.analyses.findIndex((a) => a.id === id);
  const previous = analysisIndex > 0 ? data.analyses[analysisIndex - 1] : null;

  if (!analysis) {
    return (
      <div className="min-h-screen bg-[#050508] p-8 text-center text-white">
        <p>{de.analysis.notFound}</p>
        <Button asChild className="mt-4">
          <Link href="/dashboard">{de.analysis.goDashboard}</Link>
        </Button>
      </div>
    );
  }

  const score = analysis.ascendScore ?? analysis.looksScore;
  const prevScore = previous?.ascendScore ?? previous?.looksScore;
  const improvementPct =
    prevScore != null ? Math.round(((score - prevScore) / Math.max(prevScore, 1)) * 100) : null;

  const scoreHistory = data.analyses
    .slice(Math.max(0, analysisIndex - 4), analysisIndex + 1)
    .map((a) => a.ascendScore ?? a.looksScore);

  return (
    <div className="min-h-screen bg-[#050508] px-6 py-8 pb-12">
      <div className="pointer-events-none fixed inset-0 bg-gradient-to-br from-violet-950/30 via-transparent to-indigo-950/20" />

      <div className="relative mx-auto max-w-md space-y-5">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <p className="text-sm font-medium tracking-widest text-violet-400 uppercase">
            {de.analysis.scoreLabel}
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-white">{de.analysis.title}</h1>
          <p className="mt-2 text-sm leading-relaxed text-white/55">{analysis.summary}</p>
        </motion.div>

        {/* ASCEND Score Section */}
        <GlassCard className="flex flex-col items-center py-8">
          <ScoreRing score={score} maxScore={100} size={140} label={de.analysis.scoreLabel} />
          {scoreHistory.length > 1 && (
            <div className="mt-6 w-full">
              <p className="mb-2 text-center text-xs font-medium text-white/45">{de.analysis.history}</p>
              <div className="flex h-16 items-end justify-center gap-2">
                {scoreHistory.map((s, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${s}%` }}
                    transition={{ delay: i * 0.08, duration: 0.5 }}
                    className={`w-6 rounded-t-md ${
                      i === scoreHistory.length - 1
                        ? "bg-gradient-to-t from-violet-600 to-indigo-400"
                        : "bg-white/15"
                    }`}
                    style={{ minHeight: 8, maxHeight: 56 }}
                  />
                ))}
              </div>
            </div>
          )}
          {improvementPct != null && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`mt-4 text-sm font-semibold ${
                improvementPct >= 0 ? "text-emerald-400" : "text-amber-400"
              }`}
            >
              {de.analysis.improvementPct}: {improvementPct >= 0 ? "+" : ""}
              {improvementPct}%
            </motion.p>
          )}
        </GlassCard>

        {/* Potential */}
        <GlassCard delay={0.06} className="border-emerald-500/20 bg-emerald-500/5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-white/50">{de.analysis.potential}</p>
              <p className="text-3xl font-bold text-emerald-400">{analysis.improvementPotential}</p>
            </div>
            <Sparkles className="h-8 w-8 text-emerald-400/60" />
          </div>
          <p className="mt-3 text-xs leading-relaxed text-white/45">
            {de.analysis.disclaimer
              .replace("{low}", String(analysis.confidenceLow))
              .replace("{high}", String(analysis.confidenceHigh))}
          </p>
        </GlassCard>

        {/* Strengths */}
        <div>
          <h3 className="mb-3 flex items-center gap-2 font-semibold text-emerald-400">
            <TrendingUp className="h-4 w-4" /> {de.analysis.strengths}
          </h3>
          <div className="grid gap-2">
            {analysis.strengths.map((s, i) => (
              <motion.div
                key={s}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="flex items-center gap-3 rounded-2xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 backdrop-blur-xl">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/20">
                    <Check className="h-4 w-4 text-emerald-400" />
                  </div>
                  <span className="text-sm font-medium text-white/90">{s}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Improvement Opportunities */}
        <div>
          <h3 className="mb-3 flex items-center gap-2 font-semibold text-orange-400">
            <Target className="h-4 w-4" /> {de.analysis.improvements}
          </h3>
          <div className="grid gap-2">
            {analysis.weaknesses.map((w, i) => (
              <motion.div
                key={w}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="flex items-center gap-3 rounded-2xl border border-orange-500/25 bg-orange-500/10 px-4 py-3 backdrop-blur-xl">
                  <div className="h-2 w-2 shrink-0 rounded-full bg-orange-400" />
                  <span className="text-sm font-medium text-white/90">{w}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Top Potential */}
        {(analysis.topImprovements ?? []).length > 0 && (
          <GlassCard delay={0.14}>
            <h3 className="mb-3 flex items-center gap-2 font-semibold text-violet-400">
              <Sparkles className="h-4 w-4" /> {de.analysis.topPotential}
            </h3>
            <ul className="space-y-2">
              {(analysis.topImprovements ?? []).map((t) => (
                <li key={t} className="text-sm text-white/80">
                  → {t}
                </li>
              ))}
            </ul>
          </GlassCard>
        )}

        {/* Category Breakdown */}
        <GlassCard delay={0.18}>
          <h3 className="mb-4 font-semibold text-white">{de.analysis.categories}</h3>
          <div className="space-y-3">
            {METRIC_KEYS.map((key) => {
              const val = analysis.scores[key] ?? 0;
              return (
                <div key={key} className="flex items-center justify-between gap-3">
                  <span className="text-sm text-white/65">{getCategoryLabelDE(key)}</span>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-20 overflow-hidden rounded-full bg-white/10">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${val}%` }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-400"
                      />
                    </div>
                    <span className="w-7 text-right text-sm font-medium text-white">
                      {Math.round(val)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </GlassCard>

        <Button className="h-14 w-full rounded-2xl" size="lg" onClick={() => router.push("/dashboard")}>
          {de.analysis.goDashboard} <ArrowRight className="h-4 w-4" />
        </Button>
        <Button asChild variant="secondary" className="w-full rounded-2xl">
          <Link href="/plan">{de.analysis.viewPlan}</Link>
        </Button>
      </div>
    </div>
  );
}
