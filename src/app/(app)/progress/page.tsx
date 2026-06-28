"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { TrendingUp, Camera, Crown } from "lucide-react";
import { BottomNav } from "@/components/app/bottom-nav";
import { GlassCard } from "@/components/app/glass-card";
import { ComparisonSlider } from "@/components/app/comparison-slider";
import { Button } from "@/components/ui/button";
import { LoadingScreen } from "@/components/app/loading-screen";
import {
  PhotoUploader,
  DEFAULT_PHOTO_SLOTS,
  type PhotoSlot,
} from "@/components/app/photo-uploader";
import { toast } from "sonner";

interface ProgressCheck {
  id: string;
  weekNumber: number;
  improvementPercent: number;
  skinImprovement: number;
  jawImprovement: number;
  bodyfatChange: number;
  confidenceTrend: number;
  notes: string;
  faceComparison: { before: string; after: string };
  createdAt: string;
}

export default function ProgressPage() {
  const [checks, setChecks] = useState<ProgressCheck[]>([]);
  const [loading, setLoading] = useState(true);
  const [premiumRequired, setPremiumRequired] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [photos, setPhotos] = useState<PhotoSlot[]>(DEFAULT_PHOTO_SLOTS.slice(0, 3));
  const [comparing, setComparing] = useState(false);

  useEffect(() => {
    fetch("/api/progress")
      .then((r) => {
        if (r.status === 403) {
          setPremiumRequired(true);
          setLoading(false);
          return null;
        }
        return r.json();
      })
      .then((data) => {
        if (data) setChecks(data);
        setLoading(false);
      });
  }, []);

  const runComparison = async () => {
    const uploaded = photos.filter((p) => p.url);
    if (uploaded.length < 3) {
      toast.error("Upload at least 3 new photos");
      return;
    }

    setComparing(true);
    const existingRes = await fetch("/api/photos/upload");
    const existing = await existingRes.json();

    const photoIds = uploaded.map((p) => {
      const match = existing.find((ep: { type: string }) => ep.type === p.type);
      return match?.id;
    }).filter(Boolean);

    const res = await fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ photoIds }),
    });

    setComparing(false);

    if (!res.ok) {
      toast.error("Comparison failed");
      return;
    }

    const check = await res.json();
    setChecks((prev) => [check, ...prev]);
    setShowUpload(false);
    toast.success("Weekly comparison complete!");
  };

  if (loading) return <LoadingScreen />;

  if (premiumRequired) {
    return (
      <>
        <div className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
          <Crown className="mb-4 h-16 w-16 text-amber-400" />
          <h1 className="text-2xl font-bold text-white">Weekly Progress</h1>
          <p className="mt-2 text-white/60">Upgrade to Premium for AI-powered weekly comparisons</p>
          <Button asChild className="mt-6">
            <Link href="/premium">Upgrade to Premium</Link>
          </Button>
        </div>
        <BottomNav />
      </>
    );
  }

  return (
    <>
      <div className="px-6 py-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Progress</h1>
            <p className="text-white/60">Weekly AI comparisons</p>
          </div>
          <Button size="sm" onClick={() => setShowUpload(!showUpload)}>
            <Camera className="h-4 w-4" />
            New Check
          </Button>
        </div>

        {showUpload && (
          <GlassCard className="mt-4">
            <PhotoUploader photos={photos} onPhotosChange={setPhotos} minPhotos={3} />
            <Button className="mt-4 w-full" onClick={runComparison} disabled={comparing}>
              {comparing ? "Comparing..." : "Run Weekly Comparison"}
            </Button>
          </GlassCard>
        )}

        <div className="mt-6 space-y-6">
          {checks.length === 0 ? (
            <GlassCard>
              <p className="text-center text-white/60">
                No progress checks yet. Upload new photos after 7 days to compare.
              </p>
            </GlassCard>
          ) : (
            checks.map((check, i) => (
              <motion.div
                key={check.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <GlassCard>
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-semibold text-white">Week {check.weekNumber}</h3>
                    <span className="flex items-center gap-1 text-emerald-400">
                      <TrendingUp className="h-4 w-4" />
                      +{check.improvementPercent?.toFixed(1)}%
                    </span>
                  </div>

                  {check.faceComparison?.before && check.faceComparison?.after && (
                    <ComparisonSlider
                      beforeUrl={check.faceComparison.before}
                      afterUrl={check.faceComparison.after}
                      className="mb-4"
                    />
                  )}

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <Metric label="Skin" value={check.skinImprovement} />
                    <Metric label="Jaw" value={check.jawImprovement} />
                    <Metric label="Bodyfat" value={check.bodyfatChange} suffix="%" />
                    <Metric label="Confidence" value={check.confidenceTrend} />
                  </div>

                  {check.notes && (
                    <p className="mt-4 text-sm text-white/70">{check.notes}</p>
                  )}
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

function Metric({ label, value, suffix = "" }: { label: string; value: number; suffix?: string }) {
  const positive = value >= 0;
  return (
    <div className="rounded-xl bg-white/5 p-3">
      <p className="text-xs text-white/60">{label}</p>
      <p className={`font-semibold ${positive ? "text-emerald-400" : "text-red-400"}`}>
        {positive ? "+" : ""}{value?.toFixed(1)}{suffix}
      </p>
    </div>
  );
}
