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

export default function UploadPage() {
  const router = useRouter();
  const [photos, setPhotos] = useState<PhotoSlot[]>(DEFAULT_PHOTO_SLOTS);
  const [analyzing, setAnalyzing] = useState(false);

  const uploadedPhotos = photos.filter((p) => p.url);

  const handleAnalyze = async () => {
    if (uploadedPhotos.length < 3) {
      toast.error("Upload at least 3 photos");
      return;
    }

    setAnalyzing(true);

    const photoIds = uploadedPhotos.map((p) => p.id).filter(Boolean);

    if (photoIds.length < 3) {
      toast.error("Photo upload incomplete");
      setAnalyzing(false);
      return;
    }

    const res = await fetch("/api/analysis", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ photoIds }),
    });

    setAnalyzing(false);

    if (!res.ok) {
      const data = await res.json();
      toast.error(data.error || "Analysis failed");
      if (res.status === 403) router.push("/premium");
      return;
    }

    const data = await res.json();
    toast.success("Analysis complete!");
    router.push(`/analysis/${data.analysisId}`);
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
