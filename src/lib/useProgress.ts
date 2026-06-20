import { useSyncExternalStore } from "react";
import type { Progress } from "./progress";

// Ключ должен совпадать с тем, что в progress.ts
const STORAGE_KEY = "sozo:progress:v1";

// Кэшируем снимок: возвращаем тот же объект, пока данные в localStorage
// не изменились. Иначе React уходит в бесконечный цикл перерисовки.
let cachedRaw: string | null | undefined = undefined;
let cachedValue: Progress = {};

function getSnapshot(): Progress {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(STORAGE_KEY);
  } catch {
    raw = null;
  }
  if (raw === cachedRaw) return cachedValue;
  cachedRaw = raw;
  try {
    cachedValue = raw ? (JSON.parse(raw) as Progress) : {};
  } catch {
    cachedValue = {};
  }
  return cachedValue;
}

function subscribe(cb: () => void): () => void {
  window.addEventListener("progress-changed", cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener("progress-changed", cb);
    window.removeEventListener("storage", cb);
  };
}

/** Реактивно отдаёт текущий прогресс и перерисовывает при изменениях. */
export function useProgress(): Progress {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
