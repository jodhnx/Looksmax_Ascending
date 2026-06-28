"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import {
  getAppData,
  updateAppData,
  type AppData,
} from "@/lib/storage";

function subscribe(callback: () => void) {
  const handler = () => callback();
  window.addEventListener("ascend-storage-update", handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener("ascend-storage-update", handler);
    window.removeEventListener("storage", handler);
  };
}

function getSnapshot(): AppData {
  return getAppData();
}

function getServerSnapshot(): AppData {
  return getAppData();
}

export function useAppStorage() {
  const data = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [, setTick] = useState(0);

  const refresh = useCallback(() => setTick((t) => t + 1), []);

  const update = useCallback(
    (updater: (prev: AppData) => AppData) => {
      const next = updateAppData(updater);
      refresh();
      return next;
    },
    [refresh]
  );

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { data, update, refresh };
}
