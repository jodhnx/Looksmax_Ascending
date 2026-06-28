"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScoreRing } from "@/components/app/score-ring";
import { GlassCard } from "@/components/app/glass-card";
import { LoadingScreen } from "@/components/app/loading-screen";
import { formatScore } from "@/lib/utils";
import type { AnalysisScores } from "@/lib/openai";

interface Analysis {
  id: string;
  looksScore: number;
  confidenceScore: number;
  improvementPotential: number;
  scores: AnalysisScores;
  strengths: string[];
  weaknesses: string[];
  summary: string;
}

const SCORE_LABELS: Record<keyof AnalysisScores, string> = {
  faceSymmetry: "Face Symmetry",
  jawline: "Jawline",
  cheekbones: "Cheekbones",
  chin: "Chin",
  forwardHeadPosture: "Head Posture",
  neck: "Neck",
  eyeArea: "Eye Area",
  canthalTilt: "Canthal Tilt",
  eyebrows: "Eyebrows",
  hairline: "Hairline",
  hairDensity: "Hair Density",
  forehead: "Forehead",
  lips: "Lips",
  nose: "Nose",
  facialThirds: "Facial Thirds",
  goldenRatio: "Golden Ratio",
  skinQuality: "Skin Quality",
  acne: "Acne (inverse)",
  darkCircles: "Dark Circles",
  facialFat: "Facial Fat",
  bodyfatEstimate: "Bodyfat",
  shoulderWidth: "Shoulders",
  waistRatio: "Waist Ratio",
  posture: "Posture",
  muscularity: "Muscularity",
  overallAttractiveness: "Attractiveness",
  confidenceEstimate: "Confidence",
};

export default function AnalysisPage() {
  const { id } = useParams();
  const router = useRouter();
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/analysis/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setAnalysis(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingScreen message="Loading your report..." />;
  if (!analysis) return <div className="p-8 text-white">Analysis not found</div>;

  const sortedScores = Object.entries(analysis.scores).sort(
    ([, a], [, b]) => b - a
  ) as [keyof AnalysisScores, number][];

  return (
    <div className="min-h-screen bg-[#0a0a0f] px-6 py-8 pb-12">
      <div className="pointer-events-none fixed inset-0 bg-gradient-to-br from-violet-950/40 via-transparent to-indigo-950/30" />

      <div className="relative mx-auto max-w-md space-y-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h1 className="text-2xl font-bold text-white">Your Looks Report</h1>
          <p className="mt-2 text-white/60">{analysis.summary}</p>
        </motion.div>

        <GlassCard className="flex flex-col items-center py-8">
          <ScoreRing score={analysis.looksScore} label="Looks Score" />
          <div className="mt-6 flex gap-8">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{formatScore(analysis.confidenceScore)}</p>
              <p className="text-xs text-white/60">Confidence</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-emerald-400">{formatScore(analysis.improvementPotential)}</p>
              <p className="text-xs text-white/60">Potential</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard delay={0.1}>
          <h3 className="mb-3 flex items-center gap-2 font-semibold text-emerald-400">
            <TrendingUp className="h-4 w-4" /> Strengths
          </h3>
          <ul className="space-y-2">
            {analysis.strengths.map((s) => (
              <li key={s} className="text-sm text-white/80">• {s}</li>
            ))}
          </ul>
        </GlassCard>

        <GlassCard delay={0.15}>
          <h3 className="mb-3 flex items-center gap-2 font-semibold text-amber-400">
            <TrendingDown className="h-4 w-4" /> Areas to Improve
          </h3>
          <ul className="space-y-2">
            {analysis.weaknesses.map((w) => (
              <li key={w} className="text-sm text-white/80">• {w}</li>
            ))}
          </ul>
        </GlassCard>

        <GlassCard delay={0.2}>
          <h3 className="mb-4 font-semibold text-white">Detailed Scores</h3>
          <div className="space-y-3">
            {sortedScores.map(([key, score]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-sm text-white/70">{SCORE_LABELS[key]}</span>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-24 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500"
                      style={{ width: `${(score / 10) * 100}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-sm font-medium text-white">
                    {formatScore(score)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <Button className="w-full" size="lg" onClick={() => router.push("/dashboard")}>
          View Ascension Plan <ArrowRight className="h-4 w-4" />
        </Button>
        <Button asChild variant="secondary" className="w-full">
          <Link href="/plan">View Daily Plan</Link>
        </Button>
      </div>
    </div>
  );
}
