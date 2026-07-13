/* ------------------------------------------------------------------ */
/*  DSM Progress Engine                                                 */
/*                                                                     */
/*  Tracks learner progress at block → lesson → module → course level. */
/*  Consumes the Learning Event System — no UI or renderer coupling.   */
/*  Persisted to localStorage via Zustand persist middleware.          */
/* ------------------------------------------------------------------ */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { on } from "@/lib/events/learning-events";

/* ------------------------------------------------------------------ */
/*  State shape                                                         */
/* ------------------------------------------------------------------ */

export interface BlockProgress {
  viewed: boolean;
  completedAt?: string; // ISO timestamp
}

export interface LessonProgress {
  status: "not_started" | "started" | "completed";
  startedAt?: string;
  completedAt?: string;
  lastScore?: number;    // 0–100 from quiz_completed
  blocks: Record<string, BlockProgress>; // key: blockId
}

export interface ModuleProgress {
  lessonsStarted: number;
  lessonsCompleted: number;
}

export interface CourseProgress {
  lessonsStarted: number;
  lessonsCompleted: number;
}

interface LearningProgressState {
  /* Raw records keyed by dotted lesson ID */
  lessons: Record<string, LessonProgress>;

  /* Internal mutators — consumed only by the event subscriber */
  _markLessonStarted: (lessonId: string) => void;
  _markLessonCompleted: (lessonId: string, score?: number) => void;
  _markBlockViewed: (lessonId: string, blockId: string) => void;
  _markBlockCompleted: (lessonId: string, blockId: string) => void;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                             */
/* ------------------------------------------------------------------ */

const now = () => new Date().toISOString();

function ensureLesson(
  lessons: Record<string, LessonProgress>,
  lessonId: string,
): LessonProgress {
  if (!lessons[lessonId]) {
    lessons[lessonId] = { status: "not_started", blocks: {} };
  }
  return lessons[lessonId];
}

/* ------------------------------------------------------------------ */
/*  Store                                                               */
/* ------------------------------------------------------------------ */

export const useLearningProgress = create<LearningProgressState>()(
  persist(
    (set) => ({
      lessons: {},

      _markLessonStarted: (lessonId) =>
        set((s) => {
          const lessons = { ...s.lessons };
          const rec = { ...ensureLesson(lessons, lessonId) };
          if (rec.status === "not_started") {
            rec.status = "started";
            rec.startedAt = now();
          }
          lessons[lessonId] = rec;
          return { lessons };
        }),

      _markLessonCompleted: (lessonId, score) =>
        set((s) => {
          const lessons = { ...s.lessons };
          const rec = { ...ensureLesson(lessons, lessonId) };
          rec.status = "completed";
          rec.completedAt = rec.completedAt ?? now();
          if (score !== undefined) rec.lastScore = score;
          lessons[lessonId] = rec;
          return { lessons };
        }),

      _markBlockViewed: (lessonId, blockId) =>
        set((s) => {
          const lessons = { ...s.lessons };
          const rec = { ...ensureLesson(lessons, lessonId) };
          rec.blocks = {
            ...rec.blocks,
            [blockId]: { ...rec.blocks[blockId], viewed: true },
          };
          lessons[lessonId] = rec;
          return { lessons };
        }),

      _markBlockCompleted: (lessonId, blockId) =>
        set((s) => {
          const lessons = { ...s.lessons };
          const rec = { ...ensureLesson(lessons, lessonId) };
          rec.blocks = {
            ...rec.blocks,
            [blockId]: { ...rec.blocks[blockId], viewed: true, completedAt: now() },
          };
          lessons[lessonId] = rec;
          return { lessons };
        }),
    }),
    { name: "dsm-learning-progress" },
  ),
);

/* ------------------------------------------------------------------ */
/*  Event subscriptions — wired once at module load                     */
/* ------------------------------------------------------------------ */

function wire() {
  const s = () => useLearningProgress.getState();

  on("lesson_started",   (e) => s()._markLessonStarted(e.lessonId));
  on("lesson_completed", (e) => s()._markLessonCompleted(e.lessonId, e.finalScore));
  on("block_viewed",     (e) => s()._markBlockViewed(e.lessonId, e.blockId));
  on("block_completed",  (e) => s()._markBlockCompleted(e.lessonId, e.blockId));
  on("quiz_completed",   (e) => {
    if (e.passed) s()._markLessonCompleted(e.lessonId, e.score);
  });
}

// Guard against double-wiring in hot-reload environments
if (typeof window !== "undefined" && !(window as unknown as Record<string,unknown>).__dsmProgressWired) {
  (window as unknown as Record<string,unknown>).__dsmProgressWired = true;
  wire();
}

/* ------------------------------------------------------------------ */
/*  Selectors (pure — call outside React or inside useLearningProgress) */
/* ------------------------------------------------------------------ */

export function getLessonProgress(
  lessons: Record<string, LessonProgress>,
  lessonId: string,
): LessonProgress {
  return lessons[lessonId] ?? { status: "not_started", blocks: {} };
}

export function isLessonCompleted(
  lessons: Record<string, LessonProgress>,
  lessonId: string,
): boolean {
  return lessons[lessonId]?.status === "completed";
}

export function isBlockCompleted(
  lessons: Record<string, LessonProgress>,
  lessonId: string,
  blockId: string,
): boolean {
  return !!lessons[lessonId]?.blocks[blockId]?.completedAt;
}

/** Aggregates progress across a list of lesson IDs (e.g. a module). */
export function getModuleProgress(
  lessons: Record<string, LessonProgress>,
  lessonIds: string[],
): ModuleProgress {
  let started = 0, completed = 0;
  for (const id of lessonIds) {
    const s = lessons[id]?.status;
    if (s === "started" || s === "completed") started++;
    if (s === "completed") completed++;
  }
  return { lessonsStarted: started, lessonsCompleted: completed };
}

/** Aggregates progress across all lesson IDs in a course. */
export function getCourseProgress(
  lessons: Record<string, LessonProgress>,
  lessonIds: string[],
): CourseProgress {
  return getModuleProgress(lessons, lessonIds); // same shape
}
