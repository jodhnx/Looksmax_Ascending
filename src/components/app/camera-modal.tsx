"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, X, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { de } from "@/lib/i18n/de";
import type { PhotoSlotType } from "@/lib/analysis/types";

interface CameraModalProps {
  open: boolean;
  slotType: PhotoSlotType;
  onClose: () => void;
  onCapture: (file: File) => void;
}

export function CameraModal({ open, slotType, onClose, onCapture }: CameraModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setReady(false);
  }, []);

  useEffect(() => {
    if (!open) {
      stopStream();
      return;
    }

    let cancelled = false;

    async function start() {
      setError(null);
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
            width: { ideal: 1280 },
            height: { ideal: 1600 },
          },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          setReady(true);
        }
      } catch {
        setError(de.photo.cameraError);
      }
    }

    start();
    return () => {
      cancelled = true;
      stopStream();
    };
  }, [open, stopStream]);

  const capture = () => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0);
    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const file = new File([blob], `ascend-${slotType.toLowerCase()}.jpg`, {
          type: "image/jpeg",
        });
        stopStream();
        onCapture(file);
      },
      "image/jpeg",
      0.92
    );
  };

  const label =
    slotType === "FRONT_FACE" ? de.photo.frontFace : de.photo.sideProfile;
  const hint =
    slotType === "FRONT_FACE" ? de.photo.frontHint : de.photo.sideHint;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex flex-col bg-black"
        >
          <div className="flex items-center justify-between px-5 pb-3 pt-[max(env(safe-area-inset-top),16px)]">
            <div className="min-w-0">
              <p className="font-semibold text-white">{label}</p>
              <p className="truncate text-xs text-white/50">{hint}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 shrink-0 rounded-full bg-white/10"
              onClick={() => {
                stopStream();
                onClose();
              }}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="relative mx-4 flex-1 overflow-hidden rounded-3xl bg-black">
            {error ? (
              <div className="flex h-full flex-col items-center justify-center gap-4 p-6 text-center">
                <p className="text-sm text-white/70">{error}</p>
                <Button variant="outline" onClick={onClose}>
                  {de.photo.useGallery}
                </Button>
              </div>
            ) : (
              <>
                <video
                  ref={videoRef}
                  playsInline
                  muted
                  className="h-full w-full object-cover"
                />
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div className="h-[70%] w-[75%] rounded-[2rem] border-2 border-white/25 shadow-[inset_0_0_60px_rgba(139,92,246,0.15)]" />
                </div>
                {!ready && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-400 border-t-transparent" />
                  </div>
                )}
              </>
            )}
          </div>

          <div className="flex items-center justify-center gap-8 px-6 py-8 pb-[max(env(safe-area-inset-bottom),24px)]">
            <button
              type="button"
              onClick={() => {
                stopStream();
                onClose();
              }}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white/70"
              aria-label={de.upload.back}
            >
              <RotateCcw className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={capture}
              disabled={!ready || !!error}
              className="flex h-[72px] w-[72px] items-center justify-center rounded-full border-4 border-white bg-white/10 transition-transform active:scale-95 disabled:opacity-40"
              aria-label={de.photo.takePhoto}
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white">
                <Camera className="h-6 w-6 text-black" />
              </div>
            </button>
            <div className="h-12 w-12" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
