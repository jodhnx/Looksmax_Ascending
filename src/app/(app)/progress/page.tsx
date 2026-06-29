"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Camera, Clock, History, Loader2 } from "lucide-react";
import { BottomNav } from "@/components/app/bottom-nav";
import { GlassCard } from "@/components/app/glass-card";
import { ComparisonSlider } from "@/components/app/comparison-slider";
import { Button } from "@/components/ui/button";
import {
  PhotoUploader,
  ANALYSIS_PHOTO_SLOTS,
  type PhotoSlot,
} from "@/components/app/photo-uploader";
import { toast } from "sonner";
import { useStorage } from "@/hooks/use-storage";
import { generateId } from "@/lib/storage";
import { daysSince } from "@/lib/plan-utils";
import { todayKey } from "@/lib/storage/helpers";
import { compareProgress } from "@/lib/analysis/progress";
import { runFullAnalysis } from "@/lib/analysis/engine";

export default function ProgressPage() {
  const { data, update } = useStorage();
  const [showUpload, setShowUpload] = useState(false);
  const [photos, setPhotos] = useState<PhotoSlot[]>(ANALYSIS_PHOTO_SLOTS);
  const [comparing, setComparing] = useState(false);
  const checks = data.progressChecks;

  const lastDate =
    checks[0]?.createdAt ?? data.analyses[data.analyses.length - 1]?.createdAt;
  const daysSinceLast = daysSince(lastDate);
  const canCheck = daysSinceLast >= 7 && data.analyses.length > 0;
  const validated = photos.filter((p) => p.validated && p.url);

  const runComparison = async () => {
    if (validated.length < 2) {
      toast.error("Both front and side photos must pass validation");
      return;
    }

    const baseline = data.analyses[0];
    if (!baseline) {
      toast.error("Complete your first scan first");
      return;
    }

    const baselinePhotos = data.photos.filter((p) => baseline.photoIds.includes(p.id));
    const oldFront = baselinePhotos.find((p) => p.type === "FRONT_FACE");
    const oldSide = baselinePhotos.find((p) => p.type === "SIDE_PROFILE");
    const newFront = validated.find((p) => p.type === "FRONT_FACE");
    const newSide = validated.find((p) => p.type === "SIDE_PROFILE");

    if (!oldFront?.url || !oldSide?.url || !newFront?.url || !newSide?.url) {
      toast.error("Missing comparison photos");
      return;
    }

    setComparing(true);

    try {
      const today = todayKey();
      const completedTasks = Object.values(data.dailyTasks)
        .filter((d) => d.date <= today)
        .reduce((sum, d) => sum + d.completed, 0);

      const comparison = await compareProgress(
        oldFront.url,
        oldSide.url,
        newFront.url,
        newSide.url,
        completedTasks
      );

      const afterAnalysis = await runFullAnalysis(newFront.url, newSide.url);
      const analysisId = generateId();
      const weekNumber = checks.length + 1;
      const storedNewPhotos = validated.map((p) => ({
        id: p.id ?? generateId(),
        type: p.type,
        url: p.url!,
        qualityScore: p.qualityScore,
        isProgressPhoto: true,
        createdAt: new Date().toISOString(),
      }));

      const newCheck = {
        id: generateId(),
        weekNumber,
        improvementPercent: comparison.improvementPercent,
        skinImprovement: comparison.skinImprovement,
        jawImprovement: comparison.jawImprovement,
        postureImprovement: comparison.postureImprovement,
        harmonyImprovement: comparison.harmonyImprovement,
        completedTasksImpact: comparison.completedTasksImpact,
        notes: comparison.notes,
        faceComparison: { before: oldFront.url, after: newFront.url },
        sideComparison: { before: oldSide.url, after: newSide.url },
        createdAt: new Date().toISOString(),
      };

      update((prev) => ({
        ...prev,
        photos: [...prev.photos, ...storedNewPhotos],
        progressChecks: [newCheck, ...prev.progressChecks],
        weeklyReports: [newCheck, ...prev.weeklyReports],
        analyses: [
          ...prev.analyses,
          {
            ...afterAnalysis,
            id: analysisId,
            photoIds: storedNewPhotos.map((p) => p.id),
            createdAt: new Date().toISOString(),
          },
        ],
        statistics: [
          ...prev.statistics,
          {
            date: today,
            faceScore: afterAnalysis.ascendScore,
            skinScore: afterAnalysis.scores.skin,
            jawScore: afterAnalysis.scores.jawDefinition,
          },
        ],
      }));

      setShowUpload(false);
      setPhotos(ANALYSIS_PHOTO_SLOTS);
      toast.success("7-day progress check complete!");
    } catch {
      toast.error("Comparison failed");
    } finally {
      setComparing(false);
    }
  };

  return (
    <>
      <div className="px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold tracking-tight text-white">Progress</h1>
          <p className="text-sm text-white/50">Weekly scan comparisons & timeline</p>
        </motion.div>

        {canCheck ? (
          <GlassCard className="mt-5 border-emerald-500/20 bg-emerald-500/5">
            <div className="flex items-center gap-3">
              <Camera className="h-6 w-6 text-emerald-400" />
              <div>
                <p className="font-medium text-white">7-day scan ready</p>
                <p className="text-xs text-white/55">Upload new front & side photos</p>
              </div>
            </div>
            <Button
              className="mt-4 w-full rounded-2xl"
              size="sm"
              onClick={() => setShowUpload(!showUpload)}
            >
              {showUpload ? "Hide upload" : "Start weekly scan"}
            </Button>
          </GlassCard>
        ) : (
          <GlassCard className="mt-5">
            <div className="flex items-center gap-3 text-white/60">
              <Clock className="h-5 w-5" />
              <p className="text-sm">
                Next scan in {Math.max(0, 7 - daysSinceLast)} day
                {7 - daysSinceLast !== 1 ? "s" : ""}
              </p>
            </div>
          </GlassCard>
        )}

        {showUpload && (
          <GlassCard className="mt-4">
            <PhotoUploader photos={photos} onPhotosChange={setPhotos} minPhotos={2} />
            <Button
              className="mt-4 w-full rounded-2xl"
              onClick={runComparison}
              disabled={comparing || validated.length < 2}
            >
              {comparing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Comparing scans...
                </>
              ) : (
                "Compare Progress"
              )}
            </Button>
          </GlassCard>
        )}

        <div className="mt-6 space-y-5">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-white/70">
            <History className="h-4 w-4" /> Timeline
          </h2>

          {checks.length === 0 ? (
            <GlassCard>
              <p className="text-center text-sm text-white/50">
                No progress checks yet. Complete your first scan, then return after 7 days.
              </p>
            </GlassCard>
          ) : (
            checks.map((check, i) => (
              <motion.div
                key={check.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <GlassCard>
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-white">Week {check.weekNumber}</h3>
                      <p className="text-xs text-white/45">
                        {new Date(check.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="flex items-center gap-1 text-emerald-400">
                      <TrendingUp className="h-4 w-4" />+{check.improvementPercent?.toFixed(0)}%
                    </span>
                  </div>

                  {check.faceComparison?.before && check.faceComparison?.after && (
                    <div className="mb-3">
                      <p className="mb-2 text-xs text-white/50">Front face</p>
                      <ComparisonSlider
                        beforeUrl={check.faceComparison.before}
                        afterUrl={check.faceComparison.after}
                      />
                    </div>
                  )}

                  {check.sideComparison?.before && check.sideComparison?.after && (
                    <div className="mb-4">
                      <p className="mb-2 text-xs text-white/50">Side profile</p>
                      <ComparisonSlider
                        beforeUrl={check.sideComparison.before}
                        afterUrl={check.sideComparison.after}
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <Metric label="Skin" value={check.skinImprovement} />
                    <Metric label="Jaw" value={check.jawImprovement} />
                    <Metric label="Posture" value={check.postureImprovement ?? 0} />
                    <Metric label="Harmony" value={check.harmonyImprovement ?? 0} />
                  </div>

                  {check.completedTasksImpact && (
                    <p className="mt-3 text-xs text-violet-300/80">Habits: {check.completedTasksImpact}</p>
                  )}
                  {check.notes && <p className="mt-2 text-sm text-white/65">{check.notes}</p>}
                </GlassCard>
              </motion.div>
            ))
          )}
        </div>
      </div>
      <BottomNav />
    </>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  const positive = value >= 0;
  return (
    <div className="rounded-2xl bg-white/5 p-3">
      <p className="text-xs text-white/50">{label}</p>
      <p className={`font-semibold ${positive ? "text-emerald-400" : "text-red-400"}`}>
        {positive ? "+" : ""}
        {value?.toFixed(0)}
      </p>
    </div>
  );
}
