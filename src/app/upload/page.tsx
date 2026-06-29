"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ChevronLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  PhotoUploader,
  ANALYSIS_PHOTO_SLOTS,
  type PhotoSlot,
} from "@/components/app/photo-uploader";
import { toast } from "sonner";
import { useStorage } from "@/hooks/use-storage";
import { generateId } from "@/lib/storage";
import { todayKey } from "@/lib/storage/helpers";
import { planToStoredPlans } from "@/lib/plan-utils";
import {
  runFullAnalysis,
  generateAscensionPlan,
  generateDailyTasks,
} from "@/lib/analysis";

export default function UploadPage() {
  const router = useRouter();
  const { update } = useStorage();
  const [photos, setPhotos] = useState<PhotoSlot[]>(ANALYSIS_PHOTO_SLOTS);
  const [analyzing, setAnalyzing] = useState(false);

  const validatedPhotos = photos.filter((p) => p.validated && p.url);
  const ready = validatedPhotos.length >= 2;

  const handleAnalyze = async () => {
    if (!ready) {
      toast.error("Both photos must pass validation");
      return;
    }

    setAnalyzing(true);

    try {
      const front = validatedPhotos.find((p) => p.type === "FRONT_FACE")!.url!;
      const profile = validatedPhotos.find((p) => p.type === "SIDE_PROFILE")!.url!;

      const result = await runFullAnalysis(front, profile);
      const plan = generateAscensionPlan(result, 30);
      const tasks = generateDailyTasks(result);

      const analysisId = generateId();
      const today = todayKey();
      const planStartDate = new Date().toISOString();
      const { workoutPlans, nutritionPlans } = planToStoredPlans(plan, planStartDate);

      update((prev) => {
        const storedPhotos = validatedPhotos.map((p) => ({
          id: p.id ?? generateId(),
          type: p.type,
          url: p.url!,
          qualityScore: p.qualityScore,
          createdAt: new Date().toISOString(),
        }));

        return {
          ...prev,
          profile: prev.profile ?? {
            currentStreak: 0,
            longestStreak: 0,
            lastActiveDate: null,
          },
          photos: [...prev.photos, ...storedPhotos],
          analyses: [
            ...prev.analyses,
            {
              ...result,
              id: analysisId,
              photoIds: storedPhotos.map((p) => p.id),
              createdAt: new Date().toISOString(),
            },
          ],
          ascensionPlans: plan,
          planStartDate,
          workoutPlans,
          nutritionPlans,
          analysisCount: prev.analysisCount + 1,
          dailyTasks: {
            ...prev.dailyTasks,
            [today]: { date: today, tasks, completed: 0, total: tasks.length },
          },
          statistics: [
            ...prev.statistics.filter((s) => s.date !== today),
            {
              date: today,
              faceScore: result.ascendScore,
              skinScore: result.scores.skin,
              jawScore: result.scores.jawDefinition,
            },
          ],
        };
      });

      toast.success("ASCEND scan complete!");
      router.push(`/analysis/${analysisId}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050508] px-6 py-8">
      <div className="pointer-events-none fixed inset-0 bg-gradient-to-br from-violet-950/30 via-transparent to-indigo-950/20" />

      <div className="relative mx-auto max-w-md">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1 text-sm text-white/50 hover:text-white/80"
        >
          <ChevronLeft className="h-4 w-4" /> Back
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-white">Upload Photos</h1>
          <p className="mt-2 text-sm leading-relaxed text-white/55">
            Front face and side profile. MediaPipe validates one face, lighting, sharpness, and angle locally on your device.
          </p>
        </motion.div>

        <PhotoUploader photos={photos} onPhotosChange={setPhotos} minPhotos={2} />

        <Button
          className="mt-8 h-14 w-full rounded-2xl text-base shadow-lg shadow-violet-500/20"
          size="lg"
          onClick={handleAnalyze}
          disabled={!ready || analyzing}
        >
          {analyzing ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" /> Running ASCEND scan...
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5" /> Start ASCEND Analysis
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
