"use client";

import { useCallback } from "react";
import { useStorage } from "./use-storage";
import type { StoredPhoto } from "@/lib/storage/types";

export function usePhotos() {
  const { data, update } = useStorage();

  const addPhotos = useCallback(
    (photos: StoredPhoto[]) =>
      update((prev) => ({ ...prev, photos: [...prev.photos, ...photos] })),
    [update]
  );

  const addProgressPhotos = useCallback(
    (photos: StoredPhoto[]) =>
      update((prev) => ({
        ...prev,
        photos: [
          ...prev.photos,
          ...photos.map((p) => ({ ...p, isProgressPhoto: true })),
        ],
      })),
    [update]
  );

  return {
    photos: data.photos,
    progressPhotos: data.photos.filter((p) => p.isProgressPhoto),
    analysisPhotos: data.photos.filter((p) => !p.isProgressPhoto),
    addPhotos,
    addProgressPhotos,
  };
}
