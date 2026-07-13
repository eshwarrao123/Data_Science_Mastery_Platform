/* ------------------------------------------------------------------ */
/*  DSM XP Engine                                                       */
/*                                                                     */
/*  Awards XP for learning events. Deduplicates by award key so        */
/*  replaying events never double-counts. Configurable XP values.      */
/*  Persisted to localStorage via Zustand persist.                     */
/* ------------------------------------------------------------------ */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { on } from "@/lib/events/learning-events";

/* ------------------------------------------------------------------ */
/*  Config                                                              */
/* ------------------------------------------------------------------ */

export interface XPConfig {
  lesson_started: number;
  lesson_completed: number;
  block_completed: number;
  quiz_completed_pass: number;
  quiz_completed_fail: number;
  code_passed: number;
}

export const DEFAULT_XP_CONFIG: XPConfig = {
  lesson_started: 5,
  lesson_completed: 50,
  block_completed: 10,
  quiz_completed_pass: 30,
  quiz_completed_fail: 5,
  code_passed: 20,
};

/* ------------------------------------------------------------------ */
/*  State shape                                                         */
/* ------------------------------------------------------------------ */

export interface XPEntry {
  awardKey: string;   // dedup key, e.g. "block_completed:lessonId:blockId"
  xp: number;
  awardedAt: string;  // ISO timestamp
}

interface XPState {
  entries: XPEntry[];
  config: XPConfig;

  _award: (key: string, xp: number) => void;
  setConfig: (cfg: Partial<XPConfig>) => void;
}

/* ------------------------------------------------------------------ */
/*  Store                                                               */
/* ------------------------------------------------------------------ */

export const useXPStore = create<XPState>()(
  persist(
    (set, get) => ({
      entries: [],
      config: DEFAULT_XP_CONFIG,

      _award: (key, xp) => {
        if (get().entries.some((e) => e.awardKey === key)) return;
        set((s) => ({
          entries: [
            ...s.entries,
            { awardKey: key, xp, awardedAt: new Date().toISOString() },
          ],
        }));
      },

      setConfig: (cfg) =>
        set((s) => ({ config: { ...s.config, ...cfg } })),
    }),
    { name: "dsm-xp" },
  ),
);

/* ------------------------------------------------------------------ */
/*  Selectors (pure)                                                    */
/* ------------------------------------------------------------------ */

export function getTotalXP(entries: XPEntry[]): number {
  return entries.reduce((sum, e) => sum + e.xp, 0);
}

export function getLessonXP(entries: XPEntry[], lessonId: string): number {
  return entries
    .filter((e) => e.awardKey.includes(`:${lessonId}`))
    .reduce((sum, e) => sum + e.xp, 0);
}

export function hasAwardedXP(entries: XPEntry[], key: string): boolean {
  return entries.some((e) => e.awardKey === key);
}

/** Award XP manually (outside event flow). No-op if key already awarded. */
export function awardXP(key: string, xp: number): void {
  useXPStore.getState()._award(key, xp);
}

/* ------------------------------------------------------------------ */
/*  Event subscriptions — wired once at module load                     */
/* ------------------------------------------------------------------ */

function wire() {
  const s = () => useXPStore.getState();

  on("lesson_started", (e) => {
    const cfg = s().config;
    s()._award(`lesson_started:${e.lessonId}`, cfg.lesson_started);
  });

  on("lesson_completed", (e) => {
    const cfg = s().config;
    s()._award(`lesson_completed:${e.lessonId}`, cfg.lesson_completed);
  });

  on("block_completed", (e) => {
    const cfg = s().config;
    s()._award(`block_completed:${e.lessonId}:${e.blockId}`, cfg.block_completed);
  });

  on("quiz_completed", (e) => {
    const cfg = s().config;
    const xp = e.passed ? cfg.quiz_completed_pass : cfg.quiz_completed_fail;
    s()._award(`quiz_completed:${e.lessonId}:${e.blockId}`, xp);
  });

  on("code_passed", (e) => {
    const cfg = s().config;
    s()._award(`code_passed:${e.lessonId}:${e.blockId}`, cfg.code_passed);
  });
}

if (typeof window !== "undefined" && !(window as unknown as Record<string, unknown>).__dsmXPWired) {
  (window as unknown as Record<string, unknown>).__dsmXPWired = true;
  wire();
}

/* ------------------------------------------------------------------ */
/*  React hook                                                          */
/* ------------------------------------------------------------------ */

export function useXP() {
  const entries = useXPStore((s) => s.entries);
  const config = useXPStore((s) => s.config);
  const setConfig = useXPStore((s) => s.setConfig);
  return {
    totalXP: getTotalXP(entries),
    getLessonXP: (lessonId: string) => getLessonXP(entries, lessonId),
    hasAwardedXP: (key: string) => hasAwardedXP(entries, key),
    awardXP,
    config,
    setConfig,
  };
}
