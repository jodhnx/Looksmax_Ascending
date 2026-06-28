"use client";

import { useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type PhotoSlotType =
  | "FRONT_FACE"
  | "LEFT_SIDE"
  | "RIGHT_SIDE"
  | "SMILE"
  | "NEUTRAL"
  | "FULL_BODY_FRONT"
  | "FULL_BODY_SIDE";

const PHOTO_LABELS: Record<PhotoSlotType, string> = {
  FRONT_FACE: "Front Face",
  LEFT_SIDE: "Left Side",
  RIGHT_SIDE: "Right Side",
  SMILE: "Smile",
  NEUTRAL: "Neutral Expression",
  FULL_BODY_FRONT: "Full Body Front",
  FULL_BODY_SIDE: "Full Body Side",
};

export interface PhotoSlot {
  type: PhotoSlotType;
  id?: string;
  url?: string;
  qualityScore?: number;
  errors?: string[];
  uploading?: boolean;
}

interface PhotoUploaderProps {
  photos: PhotoSlot[];
  onPhotosChange: React.Dispatch<React.SetStateAction<PhotoSlot[]>>;
  minPhotos?: number;
}

export function PhotoUploader({
  photos,
  onPhotosChange,
  minPhotos = 3,
}: PhotoUploaderProps) {
  const uploadPhoto = useCallback(
    async (type: PhotoSlotType, file: File) => {
      onPhotosChange((prev) =>
        prev.map((p) =>
          p.type === type ? { ...p, uploading: true, errors: undefined } : p
        )
      );

      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", type);

      try {
        const res = await fetch("/api/photos/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();

        if (!res.ok) {
          onPhotosChange((prev) =>
            prev.map((p) =>
              p.type === type
                ? { ...p, uploading: false, errors: [data.error || "Upload failed"] }
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
                  id: data.id,
                  url: data.url,
                  qualityScore: data.qualityScore,
                  uploading: false,
                  errors: data.validationErrors?.length ? data.validationErrors : undefined,
                }
              : p
          )
        );
      } catch {
        onPhotosChange((prev) =>
          prev.map((p) =>
            p.type === type
              ? { ...p, uploading: false, errors: ["Network error"] }
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
          ? { type, url: undefined, qualityScore: undefined, errors: undefined }
          : p
      )
    );
  };

  const uploadedCount = photos.filter((p) => p.url).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-white/60">
          {uploadedCount} of {photos.length} photos uploaded (min {minPhotos})
        </p>
        <div
          className={cn(
            "rounded-full px-3 py-1 text-xs font-medium",
            uploadedCount >= minPhotos
              ? "bg-emerald-500/20 text-emerald-400"
              : "bg-amber-500/20 text-amber-400"
          )}
        >
          {uploadedCount >= minPhotos ? "Ready" : "Need more photos"}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {photos.map((photo) => (
          <motion.div
            key={photo.type}
            layout
            className={cn(
              "relative aspect-[3/4] overflow-hidden rounded-2xl border-2 border-dashed transition-colors",
              photo.url
                ? "border-violet-500/50"
                : photo.errors?.length
                  ? "border-red-500/50"
                  : "border-white/20 hover:border-white/40"
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
                  <span className="text-xs text-white/60">Validating...</span>
                </motion.div>
              ) : photo.url ? (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="relative h-full w-full"
                >
                  <Image
                    src={photo.url}
                    alt={PHOTO_LABELS[photo.type]}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                    <span className="text-xs font-medium text-white">
                      {PHOTO_LABELS[photo.type]}
                    </span>
                    {photo.qualityScore && photo.qualityScore >= 70 ? (
                      <CheckCircle className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-amber-400" />
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-2 z-20 h-8 w-8 bg-black/50"
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
                  className="flex h-full flex-col items-center justify-center gap-2 p-4"
                >
                  <Upload className="h-8 w-8 text-white/40" />
                  <span className="text-center text-xs font-medium text-white/60">
                    {PHOTO_LABELS[photo.type]}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {photo.errors?.map((err) => (
              <p key={err} className="absolute bottom-0 left-0 right-0 bg-red-500/90 p-1 text-center text-[10px] text-white">
                {err}
              </p>
            ))}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export const DEFAULT_PHOTO_SLOTS: PhotoSlot[] = [
  { type: "FRONT_FACE" },
  { type: "LEFT_SIDE" },
  { type: "RIGHT_SIDE" },
  { type: "SMILE" },
  { type: "NEUTRAL" },
  { type: "FULL_BODY_FRONT" },
  { type: "FULL_BODY_SIDE" },
];
