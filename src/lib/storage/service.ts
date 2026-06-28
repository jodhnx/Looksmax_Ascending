import {
  clearLegacyLocalStorage,
  loadFromIndexedDB,
  mergeAppData,
  readLegacyLocalStorage,
  saveToIndexedDB,
} from "./db";
import { DEFAULT_APP_DATA, type AppData } from "./types";

type Listener = () => void;

class StorageService {
  private cache: AppData = { ...DEFAULT_APP_DATA };
  private listeners = new Set<Listener>();
  private initPromise: Promise<void> | null = null;

  getData(): AppData {
    return this.cache;
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach((l) => l());
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("ascend-storage-update"));
    }
  }

  async init(): Promise<AppData> {
    if (!this.initPromise) {
      this.initPromise = this.bootstrap();
    }
    await this.initPromise;
    return this.cache;
  }

  private async bootstrap(): Promise<void> {
    const fromIdb = await loadFromIndexedDB();
    if (fromIdb) {
      this.cache = fromIdb;
      return;
    }

    const legacy = readLegacyLocalStorage();
    if (legacy) {
      this.cache = mergeAppData(legacy);
      await this.persist(this.cache);
      clearLegacyLocalStorage();
      return;
    }

    this.cache = { ...DEFAULT_APP_DATA };
  }

  async save(data: AppData): Promise<AppData> {
    const next = mergeAppData({
      ...data,
      lastBackupAt: new Date().toISOString(),
    });
    this.cache = next;
    this.notify();
    await this.persist(next);
    return next;
  }

  async update(updater: (prev: AppData) => AppData): Promise<AppData> {
    return this.save(updater(this.cache));
  }

  private async persist(data: AppData): Promise<void> {
    try {
      await saveToIndexedDB(data);
    } catch {
      if (typeof localStorage !== "undefined") {
        localStorage.setItem("ascend-ai-data-fallback", JSON.stringify(data));
      }
    }
  }

  async clear(): Promise<void> {
    this.cache = { ...DEFAULT_APP_DATA };
    clearLegacyLocalStorage();
    if (typeof localStorage !== "undefined") {
      localStorage.removeItem("ascend-ai-data-fallback");
    }
    await this.persist(this.cache);
    this.notify();
  }
}

export const storageService = new StorageService();

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
