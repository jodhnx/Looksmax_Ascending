import { DEFAULT_APP_DATA, type AppData } from "./types";

const STORAGE_KEY = "ascend-ai-data";

export function getAppData(): AppData {
  if (typeof window === "undefined") return DEFAULT_APP_DATA;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_APP_DATA };
    return { ...DEFAULT_APP_DATA, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_APP_DATA };
  }
}

export function setAppData(data: AppData): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function updateAppData(updater: (prev: AppData) => AppData): AppData {
  const next = updater(getAppData());
  setAppData(next);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("ascend-storage-update"));
  }
  return next;
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export { DEFAULT_APP_DATA };
export * from "./types";
