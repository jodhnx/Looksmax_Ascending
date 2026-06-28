"use client";

import { useCallback } from "react";
import { useStorageContext } from "@/lib/storage/context";
import type { AppData } from "@/lib/storage/types";

export function useStorage() {
  const { data, update, save, clear } = useStorageContext();

  const patch = useCallback(
    (partial: Partial<AppData>) => update((prev) => ({ ...prev, ...partial })),
    [update]
  );

  return { data, update, save, clear, patch };
}

/** @deprecated Use useStorage() */
export const useAppStorage = useStorage;
