"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  PhotoUploader,
  ANALYSIS_PHOTO_SLOTS,
  type PhotoSlot,
} from "@/components/app/photo-uploader";
import { ScanOverlay } from "@/components/app/scan-overlay";
import { toast } from "sonner";
import { useStorage } from "@/hooks/use-storage";
import { generateId } from "@/lib/storage";
import { todayKey } from "@/lib/storage/helpers";
import { planToStoredPlans } from "@/lib/plan-utils";
import { de } from "@/lib/i18n/de";

export default function UploadPage() {
  const router = useRouter();
  const { update } = useStorage();
  const [photos, setPhotos] = useState<PhotoSlot[]>(ANALYSIS_PHOTO_SLOTS);
  const [analyzing, setAnalyzing] = useState(false);

  const validatedPhotos = photos.filter((p) => p.validated && p.url);
  const ready = validatedPhotos.length >= 2;
  const previewUrl = validatedPhotos[0]?.url;

  const handleAnalyze = async () => {
    if (!ready) {
      toast.error(de.upload.bothRequired);
      return;
    }

    setAnalyzing(true);

    try {
      const front = validatedPhotos.find((p) => p.type === "FRONT_FACE")!.url!;
      const profile = validatedPhotos.find((p) => p.type === "SIDE_PROFILE")!.url!;

      const { runFullAnalysis, generateAscensionPlan, planTasksToDailyItems } = await import(
        "@/lib/analysis"
      );

      const result = await runFullAnalysis(front, profile);
      const analysisId = generateId();
      const today = todayKey();
      const planStartDate = new Date().toISOString();

      update((prev) => {
        const plan = generateAscensionPlan(result, 30, {
          analysis: result,
          profile: prev.profile,
        });
        const tasks = planTasksToDailyItems(plan[0].tasks);
        const { workoutPlans, nutritionPlans } = planToStoredPlans(plan, planStartDate);
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

      await new Promise((r) => setTimeout(r, 600));
      router.push(`/analysis/${analysisId}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : de.upload.scanFailed);
      setAnalyzing(false);
    }
  };

  return (
    <>
      <ScanOverlay active={analyzing} photoUrl={previewUrl} />

      <div className="min-h-screen bg-background">
        <div className="page-glow pointer-events-none fixed inset-0" />

        <div className="relative mx-auto max-w-lg px-5 pb-10 pt-[max(env(safe-area-inset-top),24px)] sm:px-6">
          <Link
            href="/"
            className="mb-5 inline-flex items-center gap-1 text-sm text-white/45 transition-colors hover:text-white/70"
          >
            <ChevronLeft className="h-4 w-4" /> {de.upload.back}
          </Link>

          <header className="mb-6">
            <h1 className="text-2xl font-semibold tracking-tight text-white">
              {de.upload.title}
            </h1>
            <p className="mt-1.5 text-sm leading-relaxed text-white/45">
              {de.upload.subtitle}
            </p>
          </header>

          <PhotoUploader photos={photos} onPhotosChange={setPhotos} minPhotos={2} />

          <Button
            className="mt-6 h-[52px] w-full rounded-2xl text-[15px] font-semibold shadow-lg shadow-violet-600/20"
            size="lg"
            onClick={handleAnalyze}
            disabled={!ready || analyzing}
          >
            <Sparkles className="h-5 w-5" />
            {analyzing ? de.upload.scanning : de.upload.startScan}
          </Button>
        </div>
      </div>
    </>
  );
}
