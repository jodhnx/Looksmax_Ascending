"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";
import { storageService } from "./service";
import { DEFAULT_APP_DATA, type AppData } from "./types";

interface StorageContextValue {
  data: AppData;
  update: (updater: (prev: AppData) => AppData) => Promise<AppData>;
  save: (data: AppData) => Promise<AppData>;
  clear: () => Promise<void>;
}

const StorageContext = createContext<StorageContextValue | null>(null);

export function StorageProvider({ children }: { children: React.ReactNode }) {
  const subscribe = useCallback(
    (onStoreChange: () => void) => storageService.subscribe(onStoreChange),
    []
  );

  const getSnapshot = useCallback(() => storageService.getData(), []);
  const getServerSnapshot = useCallback(() => DEFAULT_APP_DATA, []);

  const data = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    storageService.init();
  }, []);

  const value = useMemo<StorageContextValue>(
    () => ({
      data,
      update: (updater) => storageService.update(updater),
      save: (next) => storageService.save(next),
      clear: () => storageService.clear(),
    }),
    [data]
  );

  return (
    <StorageContext.Provider value={value}>{children}</StorageContext.Provider>
  );
}

export function useStorageContext(): StorageContextValue {
  const ctx = useContext(StorageContext);
  if (!ctx) {
    throw new Error("useStorageContext must be used within StorageProvider");
  }
  return ctx;
}
