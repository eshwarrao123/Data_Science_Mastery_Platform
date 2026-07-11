"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

/* ------------------------------------------------------------------ */
/*  Learner progress — mirrors `user_progress`, `user_notes`, `users`  */
/*  Persisted locally; swap the persistence layer for Supabase writes  */
/*  without touching consumers.                                        */
/* ------------------------------------------------------------------ */

export interface ExerciseResult {
  correct: boolean;
  attempts: number;
}

interface LessonRecord {
  status: "in_progress" | "completed";
  exerciseResults: Record<string, ExerciseResult>;
  quizScore?: number;
  completedAt?: string;
}

interface ProgressState {
  xp: number;
  streakDays: number;
  lastActiveDay: string | null;
  lessons: Record<string, LessonRecord>; // key: lesson slug
  notes: Record<string, string>; // key: lesson slug
  bookmarks: string[]; // lesson slugs
  activity: Record<string, number>; // ISO day -> minutes learned
  lastViewedLesson: string | null;
  unlockedAchievements: string[];

  touchActivity: (minutes?: number) => void;
  startLesson: (slug: string) => void;
  recordExercise: (lessonSlug: string, exerciseId: string, correct: boolean) => void;
  completeLesson: (slug: string, quizScore: number, xpReward: number) => void;
  addXp: (amount: number) => void;
  setNote: (lessonSlug: string, content: string) => void;
  toggleBookmark: (lessonSlug: string) => void;
  unlockAchievement: (slug: string, xpReward: number) => void;
}

const today = () => new Date().toISOString().slice(0, 10);

export const useProgress = create<ProgressState>()(
  persist(
    (set, get) => ({
      xp: 0,
      streakDays: 0,
      lastActiveDay: null,
      lessons: {},
      notes: {},
      bookmarks: [],
      activity: {},
      lastViewedLesson: null,
      unlockedAchievements: [],

      touchActivity: (minutes = 1) => {
        const day = today();
        const { lastActiveDay, streakDays, activity } = get();
        let nextStreak = streakDays;
        if (lastActiveDay !== day) {
          const yesterday = new Date(Date.now() - 86400000)
            .toISOString()
            .slice(0, 10);
          nextStreak = lastActiveDay === yesterday ? streakDays + 1 : 1;
        }
        set({
          lastActiveDay: day,
          streakDays: nextStreak,
          activity: { ...activity, [day]: (activity[day] ?? 0) + minutes },
        });
      },

      startLesson: (slug) => {
        const { lessons } = get();
        set({
          lastViewedLesson: slug,
          lessons: lessons[slug]
            ? lessons
            : {
                ...lessons,
                [slug]: { status: "in_progress", exerciseResults: {} },
              },
        });
        get().touchActivity(2);
      },

      recordExercise: (lessonSlug, exerciseId, correct) => {
        const { lessons } = get();
        const record = lessons[lessonSlug] ?? {
          status: "in_progress" as const,
          exerciseResults: {},
        };
        const prev = record.exerciseResults[exerciseId];
        set({
          lessons: {
            ...lessons,
            [lessonSlug]: {
              ...record,
              exerciseResults: {
                ...record.exerciseResults,
                [exerciseId]: {
                  correct: prev?.correct || correct,
                  attempts: (prev?.attempts ?? 0) + 1,
                },
              },
            },
          },
        });
      },

      completeLesson: (slug, quizScore, xpReward) => {
        const { lessons, xp } = get();
        const record = lessons[slug];
        if (record?.status === "completed") return;
        set({
          xp: xp + xpReward,
          lessons: {
            ...lessons,
            [slug]: {
              ...(record ?? { exerciseResults: {} }),
              status: "completed",
              quizScore,
              completedAt: new Date().toISOString(),
            },
          },
        });
        get().touchActivity(5);
      },

      addXp: (amount) => set((s) => ({ xp: s.xp + amount })),

      setNote: (lessonSlug, content) =>
        set((s) => ({ notes: { ...s.notes, [lessonSlug]: content } })),

      toggleBookmark: (lessonSlug) =>
        set((s) => ({
          bookmarks: s.bookmarks.includes(lessonSlug)
            ? s.bookmarks.filter((b) => b !== lessonSlug)
            : [...s.bookmarks, lessonSlug],
        })),

      unlockAchievement: (slug, xpReward) => {
        const { unlockedAchievements, xp } = get();
        if (unlockedAchievements.includes(slug)) return;
        set({
          unlockedAchievements: [...unlockedAchievements, slug],
          xp: xp + xpReward,
        });
      },
    }),
    { name: "dsm-progress" },
  ),
);

/* Derived helpers */

export function lessonCompleted(
  lessons: ProgressState["lessons"],
  slug: string,
) {
  return lessons[slug]?.status === "completed";
}

export function completedCount(lessons: ProgressState["lessons"]) {
  return Object.values(lessons).filter((l) => l.status === "completed").length;
}
