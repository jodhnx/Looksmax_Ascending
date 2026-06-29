"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  ImageIcon,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CameraModal } from "@/components/app/camera-modal";
import { cn } from "@/lib/utils";
import { validatePhoto } from "@/lib/analysis/validation";
import type { PhotoSlotType } from "@/lib/analysis/types";
import { de } from "@/lib/i18n/de";

const PHOTO_LABELS: Record<PhotoSlotType, string> = {
  FRONT_FACE: de.photo.frontFace,
  SIDE_PROFILE: de.photo.sideProfile,
};

const PHOTO_HINTS: Record<PhotoSlotType, string> = {
  FRONT_FACE: de.photo.frontHint,
  SIDE_PROFILE: de.photo.sideHint,
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
  const [activeSlot, setActiveSlot] = useState<PhotoSlotType | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const galleryRef = useRef<HTMLInputElement>(null);
  const [gallerySlot, setGallerySlot] = useState<PhotoSlotType | null>(null);

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
                    errors: result.errors.length ? result.errors : [de.errors.validationFailed],
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
        setActiveSlot(null);
      } catch {
        onPhotosChange((prev) =>
          prev.map((p) =>
            p.type === type
              ? { ...p, uploading: false, validated: false, errors: [de.errors.validationFailed] }
              : p
          )
        );
      }
    },
    [onPhotosChange]
  );

  const openCamera = (type: PhotoSlotType) => {
    setActiveSlot(type);
    setCameraOpen(true);
  };

  const openGallery = (type: PhotoSlotType) => {
    setGallerySlot(type);
    galleryRef.current?.click();
  };

  const handleGallery = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const type = gallerySlot;
    if (file && type) uploadPhoto(type, file);
    e.target.value = "";
    setGallerySlot(null);
  };

  const removePhoto = (type: PhotoSlotType) => {
    onPhotosChange((prev) =>
      prev.map((p) =>
        p.type === type
          ? { type, url: undefined, qualityScore: undefined, errors: undefined, validated: false }
          : p
      )
    );
    setActiveSlot(type);
  };

  const validatedCount = photos.filter((p) => p.validated && p.url).length;
  const allValid = validatedCount >= minPhotos;

  return (
    <>
      <input
        ref={galleryRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleGallery}
      />

      <CameraModal
        open={cameraOpen}
        slotType={activeSlot ?? "FRONT_FACE"}
        onClose={() => setCameraOpen(false)}
        onCapture={(file) => {
          setCameraOpen(false);
          if (activeSlot) uploadPhoto(activeSlot, file);
        }}
      />

      <div className="space-y-5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-white/45">
            {validatedCount}/{photos.length} {de.photo.validatedCount}
          </p>
          <span
            className={cn(
              "rounded-full px-2.5 py-1 text-[11px] font-medium",
              allValid ? "bg-emerald-500/15 text-emerald-400" : "bg-white/[0.06] text-white/50"
            )}
          >
            {allValid ? de.upload.ready : de.upload.awaiting}
          </span>
        </div>

        <div className="space-y-4">
          {photos.map((photo, index) => (
            <PhotoSlotCard
              key={photo.type}
              photo={photo}
              step={index + 1}
              isActive={activeSlot === photo.type || (!photo.url && index === validatedCount)}
              onCamera={() => openCamera(photo.type)}
              onGallery={() => openGallery(photo.type)}
              onRetake={() => removePhoto(photo.type)}
            />
          ))}
        </div>
      </div>
    </>
  );
}

function PhotoSlotCard({
  photo,
  step,
  isActive,
  onCamera,
  onGallery,
  onRetake,
}: {
  photo: PhotoSlot;
  step: number;
  isActive: boolean;
  onCamera: () => void;
  onGallery: () => void;
  onRetake: () => void;
}) {
  const hasPreview = !!photo.url && !photo.uploading;

  return (
    <motion.div
      layout
      className={cn(
        "overflow-hidden rounded-2xl border transition-colors",
        photo.validated
          ? "border-emerald-500/25 bg-emerald-500/[0.04]"
          : isActive
            ? "border-violet-500/35 bg-white/[0.04]"
            : "border-white/[0.07] bg-white/[0.02]"
      )}
    >
      <div className="flex items-center gap-3 border-b border-white/[0.05] px-4 py-3">
        <span
          className={cn(
            "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold",
            photo.validated
              ? "bg-emerald-500/20 text-emerald-400"
              : "bg-violet-500/20 text-violet-300"
          )}
        >
          {photo.validated ? <CheckCircle2 className="h-4 w-4" /> : step}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-white">
            {PHOTO_LABELS[photo.type]}
          </p>
          <p className="truncate text-[11px] text-white/40">{PHOTO_HINTS[photo.type]}</p>
        </div>
        {photo.validated && photo.qualityScore != null && (
          <QualityBadge score={photo.qualityScore} />
        )}
      </div>

      <AnimatePresence mode="wait">
        {photo.uploading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center gap-3 py-12"
          >
            <Loader2 className="h-7 w-7 animate-spin text-violet-400" />
            <p className="text-xs text-white/50">{de.photo.validating}</p>
          </motion.div>
        ) : hasPreview ? (
          <motion.div key="preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4">
            <div className="relative aspect-[4/5] max-h-56 w-full overflow-hidden rounded-xl">
              <Image
                src={photo.url!}
                alt={PHOTO_LABELS[photo.type]}
                fill
                className="object-cover"
                unoptimized
                sizes="(max-width: 480px) 100vw, 320px"
              />
              {!photo.validated && (
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-amber-950/80 to-transparent p-3">
                  <p className="flex items-center gap-1.5 text-xs text-amber-200">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    {photo.errors?.[0] ?? de.errors.validationFailed}
                  </p>
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="mt-3 h-10 w-full rounded-xl text-white/60 hover:text-white"
              onClick={onRetake}
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              {de.photo.retake}
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-2.5 p-4"
          >
            {photo.errors?.map((err) => (
              <p
                key={err}
                className="rounded-xl bg-red-500/10 px-3 py-2 text-xs leading-relaxed text-red-300"
              >
                {err}
              </p>
            ))}
            <Button
              className="h-12 w-full rounded-xl text-sm font-medium"
              onClick={onCamera}
            >
              <Camera className="mr-2 h-4 w-4" />
              {de.photo.takePhoto}
            </Button>
            <Button
              variant="outline"
              className="h-12 w-full rounded-xl border-white/10 bg-white/[0.03] text-sm font-medium text-white hover:bg-white/[0.06]"
              onClick={onGallery}
            >
              <ImageIcon className="mr-2 h-4 w-4" />
              {de.photo.useGallery}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function QualityBadge({ score }: { score: number }) {
  const color =
    score >= 80 ? "text-emerald-400" : score >= 60 ? "text-amber-400" : "text-orange-400";
  return (
    <span className={cn("shrink-0 text-xs font-semibold", color)}>
      {de.photo.quality} {score}%
    </span>
  );
}

export const ANALYSIS_PHOTO_SLOTS: PhotoSlot[] = [
  { type: "FRONT_FACE" },
  { type: "SIDE_PROFILE" },
];

export const DEFAULT_PHOTO_SLOTS = ANALYSIS_PHOTO_SLOTS;
