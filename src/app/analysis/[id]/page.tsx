"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, Target, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScoreRing } from "@/components/app/score-ring";
import { GlassCard } from "@/components/app/glass-card";
import type { AnalysisScores } from "@/lib/analysis/types";
import { useStorage } from "@/hooks/use-storage";

const SCORE_LABELS: Partial<Record<keyof AnalysisScores, string>> = {
  facialHarmony: "Facial Harmony",
  symmetry: "Symmetry",
  jawDefinition: "Jaw Definition",
  chin: "Chin",
  skin: "Skin",
  posture: "Posture",
  eyeArea: "Eye Area",
  hair: "Hair",
  presentation: "Presentation",
};

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

  if (!analysis) {
    return (
      <div className="min-h-screen bg-[#050508] p-8 text-center text-white">
        <p>Analysis not found</p>
        <Button asChild className="mt-4">
          <Link href="/dashboard">Back to Dashboard</Link>
        </Button>
      </div>
    );
  }

  const score = analysis.ascendScore ?? analysis.looksScore;

  return (
    <div className="min-h-screen bg-[#050508] px-6 py-8 pb-12">
      <div className="pointer-events-none fixed inset-0 bg-gradient-to-br from-violet-950/30 via-transparent to-indigo-950/20" />

      <div className="relative mx-auto max-w-md space-y-5">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <p className="text-sm font-medium tracking-widest text-violet-400 uppercase">ASCEND Score</p>
          <h1 className="text-2xl font-bold tracking-tight text-white">Your Assessment</h1>
          <p className="mt-2 text-sm leading-relaxed text-white/55">{analysis.summary}</p>
          <p className="mt-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/45">
            Estimate range {analysis.confidenceLow}–{analysis.confidenceHigh}. For self-improvement tracking only — not an objective attractiveness measurement.
          </p>
        </motion.div>

        <GlassCard className="flex flex-col items-center py-8">
          <ScoreRing score={score} maxScore={100} label="ASCEND Score" />
          <div className="mt-6 text-center">
            <p className="text-2xl font-bold text-emerald-400">{analysis.improvementPotential}</p>
            <p className="text-xs text-white/50">Improvement Potential</p>
          </div>
        </GlassCard>

        <GlassCard delay={0.08}>
          <h3 className="mb-3 flex items-center gap-2 font-semibold text-emerald-400">
            <TrendingUp className="h-4 w-4" /> Strengths
          </h3>
          <ul className="space-y-2">
            {analysis.strengths.map((s) => (
              <li key={s} className="text-sm text-white/80">• {s}</li>
            ))}
          </ul>
        </GlassCard>

        <GlassCard delay={0.12}>
          <h3 className="mb-3 flex items-center gap-2 font-semibold text-amber-400">
            <Target className="h-4 w-4" /> Areas to Improve
          </h3>
          <ul className="space-y-2">
            {analysis.weaknesses.map((w) => (
              <li key={w} className="text-sm text-white/80">• {w}</li>
            ))}
          </ul>
        </GlassCard>

        <GlassCard delay={0.14}>
          <h3 className="mb-3 flex items-center gap-2 font-semibold text-violet-400">
            <Sparkles className="h-4 w-4" /> Highest Potential Improvements
          </h3>
          <ul className="space-y-2">
            {(analysis.topImprovements ?? []).map((t) => (
              <li key={t} className="text-sm text-white/80">• {t}</li>
            ))}
          </ul>
        </GlassCard>

        <GlassCard delay={0.18}>
          <h3 className="mb-4 font-semibold text-white">Category Breakdown</h3>
          <div className="space-y-3">
            {METRIC_KEYS.map((key) => {
              const val = analysis.scores[key] ?? 0;
              return (
                <div key={key} className="flex items-center justify-between gap-3">
                  <span className="text-sm text-white/65">{SCORE_LABELS[key]}</span>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-20 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-400"
                        style={{ width: `${val}%` }}
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
          Go to Dashboard <ArrowRight className="h-4 w-4" />
        </Button>
        <Button asChild variant="secondary" className="w-full rounded-2xl">
          <Link href="/plan">View 30-Day Plan</Link>
        </Button>
      </div>
    </div>
  );
}
