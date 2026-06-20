import { lessonSequence, lessonIndex } from "./content";

const STORAGE_KEY = "sozo:progress:v1";
const REFLECTION_KEY = "sozo:reflection:v1";

export interface LessonResult {
  /** Лучший результат в процентах. */
  score: number;
  /** Сдан ли тест / пройден ли урок. */
  passed: boolean;
  /** ISO-дата прохождения. */
  at: string;
}

export type Progress = Record<string, LessonResult>;

function read(): Progress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Progress) : {};
  } catch {
    return {};
  }
}

function write(p: Progress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
    window.dispatchEvent(new Event("progress-changed"));
  } catch {
    /* localStorage может быть недоступен — игнорируем */
  }
}

export function getProgress(): Progress {
  return read();
}

export function getResult(lessonId: string): LessonResult | undefined {
  return read()[lessonId];
}

export function isPassed(lessonId: string): boolean {
  return read()[lessonId]?.passed ?? false;
}

/** Записывает результат теста. Сохраняет лучший балл. */
export function saveResult(lessonId: string, score: number, passingScore: number): void {
  const p = read();
  const passed = score >= passingScore;
  const prev = p[lessonId];
  if (!prev || score >= prev.score) {
    p[lessonId] = { score, passed: passed || prev?.passed === true, at: new Date().toISOString() };
  } else if (passed && !prev.passed) {
    p[lessonId] = { ...prev, passed: true };
  }
  write(p);
}

/** Отмечает урок как пройденный (для уроков без теста или после размышления). */
export function markCompleted(lessonId: string): void {
  const p = read();
  if (!p[lessonId]?.passed) {
    p[lessonId] = { score: 100, passed: true, at: new Date().toISOString() };
    write(p);
  }
}

/**
 * Строгая последовательность: урок открыт, если это первый урок
 * или предыдущий урок в общей последовательности пройден.
 */
export function isUnlocked(lessonId: string): boolean {
  const idx = lessonIndex(lessonId);
  if (idx <= 0) return true;
  const prev = lessonSequence[idx - 1];
  return isPassed(prev.id);
}

export function resetProgress(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(REFLECTION_KEY);
    window.dispatchEvent(new Event("progress-changed"));
  } catch {
    /* ignore */
  }
}

/** Доля пройденных уроков (0..1) — для индикатора. */
export function overallProgress(): number {
  if (lessonSequence.length === 0) return 0;
  const p = read();
  const done = lessonSequence.filter((l) => p[l.id]?.passed).length;
  return done / lessonSequence.length;
}

/* ── Ответы размышления (хранятся отдельно от оценок) ─────────────── */

type ReflectionStore = Record<string, string[]>; // lessonId -> ответы по индексу задания

function readReflections(): ReflectionStore {
  try {
    const raw = localStorage.getItem(REFLECTION_KEY);
    return raw ? (JSON.parse(raw) as ReflectionStore) : {};
  } catch {
    return {};
  }
}

export function getReflectionAnswers(lessonId: string): string[] {
  return readReflections()[lessonId] ?? [];
}

export function saveReflectionAnswer(lessonId: string, index: number, text: string): void {
  try {
    const store = readReflections();
    const arr = store[lessonId] ?? [];
    arr[index] = text;
    store[lessonId] = arr;
    localStorage.setItem(REFLECTION_KEY, JSON.stringify(store));
  } catch {
    /* ignore */
  }
}
