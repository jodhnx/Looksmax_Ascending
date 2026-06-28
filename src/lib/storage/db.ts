import { DEFAULT_APP_DATA, type AppData } from "./types";

const DB_NAME = "ascend-ai-db";
const DB_VERSION = 1;
const STORE_MAIN = "app-data";
const STORE_BACKUP = "backups";
const MAIN_KEY = "current";
export const LEGACY_LS_KEY = "ascend-ai-data";
const MAX_BACKUPS = 5;

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("IndexedDB unavailable"));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_MAIN)) {
        db.createObjectStore(STORE_MAIN);
      }
      if (!db.objectStoreNames.contains(STORE_BACKUP)) {
        db.createObjectStore(STORE_BACKUP, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function idbGet<T>(storeName: string, key: string): Promise<T | null> {
  return openDatabase().then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, "readonly");
        const store = tx.objectStore(storeName);
        const req = store.get(key);
        req.onsuccess = () => resolve((req.result as T) ?? null);
        req.onerror = () => reject(req.error);
      })
  );
}

function idbPut(storeName: string, key: string, value: unknown): Promise<void> {
  return openDatabase().then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, "readwrite");
        const store = tx.objectStore(storeName);
        const req = storeName === STORE_BACKUP ? store.put(value) : store.put(value, key);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      })
  );
}

function idbGetAllBackups(): Promise<{ id: string; savedAt: string }[]> {
  return openDatabase().then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_BACKUP, "readonly");
        const store = tx.objectStore(STORE_BACKUP);
        const req = store.getAll();
        req.onsuccess = () => {
          const items = (req.result as { id: string; savedAt: string }[]) ?? [];
          resolve(items.sort((a, b) => b.savedAt.localeCompare(a.savedAt)));
        };
        req.onerror = () => reject(req.error);
      })
  );
}

function idbDeleteBackup(id: string): Promise<void> {
  return openDatabase().then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_BACKUP, "readwrite");
        const req = tx.objectStore(STORE_BACKUP).delete(id);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      })
  );
}

export function readLegacyLocalStorage(): AppData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(LEGACY_LS_KEY);
    if (!raw) return null;
    return { ...DEFAULT_APP_DATA, ...JSON.parse(raw) };
  } catch {
    return null;
  }
}

export function clearLegacyLocalStorage(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(LEGACY_LS_KEY);
}

export async function loadFromIndexedDB(): Promise<AppData | null> {
  try {
    const data = await idbGet<AppData>(STORE_MAIN, MAIN_KEY);
    return data ? mergeAppData(data) : null;
  } catch {
    return null;
  }
}

export async function saveToIndexedDB(data: AppData): Promise<void> {
  await idbPut(STORE_MAIN, MAIN_KEY, data);
  const backupId = `backup-${Date.now()}`;
  await idbPut(STORE_BACKUP, backupId, {
    id: backupId,
    savedAt: new Date().toISOString(),
    data,
  });
  const backups = await idbGetAllBackups();
  if (backups.length > MAX_BACKUPS) {
    for (const old of backups.slice(MAX_BACKUPS)) {
      await idbDeleteBackup(old.id);
    }
  }
}

export function mergeAppData(partial: Partial<AppData>): AppData {
  const merged = { ...DEFAULT_APP_DATA, ...partial };
  if (!merged.weeklyReports?.length && merged.progressChecks?.length) {
    merged.weeklyReports = merged.progressChecks;
  }
  if (!merged.progressChecks?.length && merged.weeklyReports?.length) {
    merged.progressChecks = merged.weeklyReports;
  }
  return merged;
}
