"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  PhotoUploader,
  DEFAULT_PHOTO_SLOTS,
  type PhotoSlot,
} from "@/components/app/photo-uploader";
import { LoadingScreen } from "@/components/app/loading-screen";
import { toast } from "sonner";
import { useStorage } from "@/hooks/use-storage";
import { generateId } from "@/lib/storage";
import { todayKey } from "@/lib/storage/helpers";
import { addDays, format } from "date-fns";
import type { PlanDay } from "@/lib/openai";
import type { NutritionPlan, WorkoutPlan } from "@/lib/storage/types";

function planToStoredPlans(plan: PlanDay[], planStartDate: string) {
  const start = new Date(planStartDate);
  const workoutPlans: WorkoutPlan[] = plan.map((day) => ({
    id: `${day.dayNumber}-${format(addDays(start, day.dayNumber - 1), "yyyy-MM-dd")}`,
    date: format(addDays(start, day.dayNumber - 1), "yyyy-MM-dd"),
    title: day.title,
    exercises: [...day.exercises, ...day.gym],
    completed: false,
  }));
  const nutritionPlans: NutritionPlan[] = plan.map((day) => ({
    date: format(addDays(start, day.dayNumber - 1), "yyyy-MM-dd"),
    protein: day.nutrition.protein,
    water: day.nutrition.water,
    calories: day.nutrition.calories,
    meals: day.habits,
  }));
  return { workoutPlans, nutritionPlans };
}

export default function UploadPage() {
  const router = useRouter();
  const { data, update } = useStorage();
  const [photos, setPhotos] = useState<PhotoSlot[]>(DEFAULT_PHOTO_SLOTS);
  const [analyzing, setAnalyzing] = useState(false);

  const uploadedPhotos = photos.filter((p) => p.url);

  const handleAnalyze = async () => {
    if (uploadedPhotos.length < 3) {
      toast.error("Upload at least 3 photos");
      return;
    }

    setAnalyzing(true);

    const imageUrls = uploadedPhotos.map((p) => p.url!);

    const res = await fetch("/api/analysis", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        imageUrls,
        profile: data.profile,
        isPremium: data.isPremium,
        analysisCount: data.analysisCount,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      toast.error(err.error || "Analysis failed");
      setAnalyzing(false);
      if (res.status === 403) router.push("/premium");
      return;
    }

    const { result, plan, tasks } = await res.json();
    const analysisId = generateId();
    const today = todayKey();

    const planStartDate = new Date().toISOString();
    const { workoutPlans, nutritionPlans } = planToStoredPlans(plan, planStartDate);

    update((prev) => {
      const storedPhotos = uploadedPhotos.map((p) => ({
        id: p.id ?? generateId(),
        type: p.type,
        url: p.url!,
        qualityScore: p.qualityScore,
        createdAt: new Date().toISOString(),
      }));

      return {
        ...prev,
        photos: [...prev.photos, ...storedPhotos],
        analyses: [
          ...prev.analyses,
          { ...result, id: analysisId, photoIds: storedPhotos.map((p) => p.id), createdAt: new Date().toISOString() },
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
            faceScore: result.looksScore,
            skinScore: result.scores.skinQuality,
            jawScore: result.scores.jawline,
            bodyfat: result.scores.bodyfatEstimate,
          },
        ],
      };
    });

    setAnalyzing(false);
    toast.success("Analysis complete!");
    router.push(`/analysis/${analysisId}`);
  };

  if (analyzing) {
    return <LoadingScreen message="AI analyzing your photos..." />;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] px-6 py-8">
      <div className="pointer-events-none fixed inset-0 bg-gradient-to-br from-violet-950/40 via-transparent to-indigo-950/30" />

      <div className="relative mx-auto max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-bold text-white">Upload Photos</h1>
          <p className="mt-2 text-white/60">
            Use good lighting, neutral background. We validate quality before analysis.
          </p>
        </motion.div>

        <PhotoUploader photos={photos} onPhotosChange={setPhotos} minPhotos={3} />

        <Button
          className="mt-6 w-full"
          size="lg"
          onClick={handleAnalyze}
          disabled={uploadedPhotos.length < 3}
        >
          <Sparkles className="h-5 w-5" />
          Analyze with AI
        </Button>
      </div>
    </div>
  );
}
