/* ------------------------------------------------------------------ */
/*  DSM Curriculum Domain Model                                        */
/*                                                                     */
/*  Identity strategy:                                                 */
/*    Course.id  = courseSlug                  e.g. "python"           */
/*    Module.id  = course.module               e.g. "python.foundations"*/
/*    Lesson.id  = course.module.lesson        e.g.                    */
/*      "python.foundations.variables-and-data-types"                  */
/*                                                                     */
/*  Routing slugs remain separate fields — IDs are stable identity,    */
/*  slugs are URLs. Learner progress continues to be keyed by lesson   */
/*  slug for backwards compatibility with existing localStorage data;  */
/*  Phase A4 may migrate storage keys to lesson IDs.                   */
/* ------------------------------------------------------------------ */

import type { LearningBlock } from "./blocks";

export type Difficulty = "Beginner" | "Intermediate" | "Advanced";
export type LessonLanguage = "python" | "sql" | "r" | "javascript";

/* ---------- Lesson ---------- */

export interface LessonMeta {
  /** Globally unique dotted ID: `<course>.<module>.<lesson-slug>` */
  id: string;
  /** URL segment — unique within its module */
  slug: string;
  title: string;
  description: string;
  estimatedTime: string;
  difficulty: Difficulty;
  xpReward: number;
  /**
   * Prerequisite lesson IDs (dotted form). May reference lessons in any
   * module or course. The unlock engine (Phase A4) will consume these;
   * today they are surfaced as informational links.
   */
  prerequisites: string[];
  /** Mastery percentage required to complete the lesson (default 80). */
  masteryThreshold?: number;
}

export interface Lesson {
  meta: LessonMeta;
  blocks: LearningBlock[];
}

/* ---------- Module / Course (metadata only — no embedded lessons) ---------- */

export interface ModuleMeta {
  /** `<course>.<module-slug>` */
  id: string;
  slug: string;
  title: string;
  description: string;
  /** Ordered lesson slugs within this module. */
  lessonOrder: string[];
}

export interface CourseMeta {
  /** Same as slug today; kept separate so identity can diverge from URL later. */
  id: string;
  slug: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  estimatedHours: number;
  /** Roadmap section, e.g. "Programming", "Data Analysis". */
  category: string;
  orderIndex: number;
  /** Ordered module slugs. */
  moduleOrder: string[];
}

/* ---------- Resolved (hydrated) shapes used by UI ---------- */

/** Lesson metadata + its position in the curriculum tree. Used by lists,
 *  search, and navigation — everything except the lesson body. */
export interface LessonRef {
  id: string;
  slug: string;
  title: string;
  description: string;
  estimatedTime: string;
  difficulty: Difficulty;
  xpReward: number;
  prerequisites: string[];
  courseSlug: string;
  moduleSlug: string;
  courseTitle: string;
  moduleTitle: string;
}

export interface ResolvedModule extends ModuleMeta {
  lessons: LessonRef[];
}

export interface ResolvedCourse extends CourseMeta {
  modules: ResolvedModule[];
}

/* ---------- ID helpers ---------- */

export function lessonId(courseSlug: string, moduleSlug: string, lessonSlug: string) {
  return `${courseSlug}.${moduleSlug}.${lessonSlug}`;
}

export function parseLessonId(id: string): { courseSlug: string; moduleSlug: string; lessonSlug: string } | null {
  const parts = id.split(".");
  if (parts.length !== 3) return null;
  return { courseSlug: parts[0], moduleSlug: parts[1], lessonSlug: parts[2] };
}
