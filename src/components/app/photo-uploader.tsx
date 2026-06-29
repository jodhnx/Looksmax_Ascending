"use client";

import { useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, CheckCircle, AlertCircle, Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { validatePhoto } from "@/lib/analysis/validation";
import type { PhotoSlotType } from "@/lib/analysis/types";

const PHOTO_LABELS: Record<PhotoSlotType, string> = {
  FRONT_FACE: "Front Face",
  SIDE_PROFILE: "Side Profile",
};

const PHOTO_HINTS: Record<PhotoSlotType, string> = {
  FRONT_FACE: "Look straight at camera, neutral expression",
  SIDE_PROFILE: "Turn 90° — show jawline and neck clearly",
};

export type { PhotoSlotType };

export interface PhotoSlot {
  type: PhotoSlotType;
  id?: string;
  url?: string;
  qualityScore?: number;
  errors?: string[];
  uploading?: boolean;
  validated?: boolean;
}

interface PhotoUploaderProps {
  photos: PhotoSlot[];
  onPhotosChange: React.Dispatch<React.SetStateAction<PhotoSlot[]>>;
  minPhotos?: number;
}

export function PhotoUploader({
  photos,
  onPhotosChange,
  minPhotos = 2,
}: PhotoUploaderProps) {
  const uploadPhoto = useCallback(
    async (type: PhotoSlotType, file: File) => {
      onPhotosChange((prev) =>
        prev.map((p) =>
          p.type === type ? { ...p, uploading: true, errors: undefined, validated: false } : p
        )
      );

      try {
        const result = await validatePhoto(file, type);

        if (!result.valid) {
          onPhotosChange((prev) =>
            prev.map((p) =>
              p.type === type
                ? {
                    ...p,
                    uploading: false,
                    validated: false,
                    errors: result.errors.length ? result.errors : ["Validation failed"],
                  }
                : p
            )
          );
          return;
        }

        onPhotosChange((prev) =>
          prev.map((p) =>
            p.type === type
              ? {
                  ...p,
                  id: crypto.randomUUID(),
                  url: result.url,
                  qualityScore: result.qualityScore,
                  uploading: false,
                  validated: true,
                  errors: undefined,
                }
              : p
          )
        );
      } catch {
        onPhotosChange((prev) =>
          prev.map((p) =>
            p.type === type
              ? { ...p, uploading: false, validated: false, errors: ["Validation failed"] }
              : p
          )
        );
      }
    },
    [onPhotosChange]
  );

  const handleFile = (type: PhotoSlotType, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadPhoto(type, file);
    e.target.value = "";
  };

  const removePhoto = (type: PhotoSlotType) => {
    onPhotosChange((prev) =>
      prev.map((p) =>
        p.type === type
          ? { type, url: undefined, qualityScore: undefined, errors: undefined, validated: false }
          : p
      )
    );
  };

  const validatedCount = photos.filter((p) => p.validated && p.url).length;
  const allValid = validatedCount >= minPhotos;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-white/60">
          {validatedCount} of {photos.length} photos validated
        </p>
        <div
          className={cn(
            "flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
            allValid ? "bg-emerald-500/20 text-emerald-400" : "bg-white/10 text-white/60"
          )}
        >
          {allValid ? (
            <>
              <ShieldCheck className="h-3.5 w-3.5" /> Ready to scan
            </>
          ) : (
            "Awaiting quality photos"
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {photos.map((photo) => (
          <motion.div
            key={photo.type}
            layout
            className={cn(
              "relative aspect-[3/4] overflow-hidden rounded-3xl border-2 transition-all duration-300",
              photo.validated
                ? "border-emerald-500/40 shadow-lg shadow-emerald-500/10"
                : photo.errors?.length
                  ? "border-red-500/40"
                  : "border-white/15 hover:border-white/30"
            )}
          >
            <input
              type="file"
              accept="image/*"
              capture="user"
              className="absolute inset-0 z-10 cursor-pointer opacity-0"
              onChange={(e) => handleFile(photo.type, e)}
              disabled={photo.uploading}
            />

            <AnimatePresence mode="wait">
              {photo.uploading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex h-full flex-col items-center justify-center gap-2 bg-white/5"
                >
                  <Loader2 className="h-8 w-8 animate-spin text-violet-400" />
                  <span className="text-xs text-white/60">Detecting face mesh...</span>
                </motion.div>
              ) : photo.url ? (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative h-full w-full"
                >
                  <Image
                    src={photo.url}
                    alt={PHOTO_LABELS[photo.type]}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="text-xs font-semibold text-white">{PHOTO_LABELS[photo.type]}</p>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-[10px] text-white/70">Quality {photo.qualityScore}%</span>
                      {photo.validated ? (
                        <CheckCircle className="h-4 w-4 text-emerald-400" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-amber-400" />
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-2 z-20 h-8 w-8 rounded-full bg-black/50 backdrop-blur"
                    onClick={(e) => {
                      e.stopPropagation();
                      removePhoto(photo.type);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex h-full flex-col items-center justify-center gap-3 p-4"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5">
                    <Upload className="h-6 w-6 text-white/40" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-white/80">{PHOTO_LABELS[photo.type]}</p>
                    <p className="mt-1 text-[10px] leading-tight text-white/45">
                      {PHOTO_HINTS[photo.type]}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {photo.errors?.map((err) => (
              <p
                key={err}
                className="absolute bottom-0 left-0 right-0 bg-red-500/95 px-2 py-1.5 text-center text-[10px] leading-tight text-white"
              >
                {err}
              </p>
            ))}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export const ANALYSIS_PHOTO_SLOTS: PhotoSlot[] = [
  { type: "FRONT_FACE" },
  { type: "SIDE_PROFILE" },
];

export const DEFAULT_PHOTO_SLOTS = ANALYSIS_PHOTO_SLOTS;
