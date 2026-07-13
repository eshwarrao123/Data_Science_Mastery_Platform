/* ------------------------------------------------------------------ */
/*  DSM Curriculum — Public API                                        */
/*                                                                     */
/*  Single entry point for all curriculum access in the application.   */
/*  Source of truth: the normalized registry (src/lib/curriculum/      */
/*  registry.ts). Legacy consumers should migrate to this module       */
/*  instead of importing from src/lib/data/curriculum.ts directly.     */
/*                                                                     */
/*  Shape incompatibilities with legacy API (for route-wiring phase):  */
/*                                                                     */
/*  1. getLesson() — returns `Lesson` (meta + blocks), not the legacy  */
/*     flat Lesson with step1Intro..step6Exercises fields.             */
/*     Route must use `lesson.meta.*` instead of `lesson.*` for meta. */
/*                                                                     */
/*  2. allLessons() — returns `LessonRef[]` (no blocks); legacy        */
/*     returned full Lesson[] with all content inline.                 */
/*                                                                     */
/*  3. nextLesson(slug) — takes only lessonSlug (registry is flat);    */
/*     legacy took (courseSlug, moduleSlug, lessonSlug) and returned   */
/*     a raw `{courseSlug,moduleSlug,lessonSlug,title}` object.        */
/*     New return type is `LessonRef | null` — richer but different.   */
/*                                                                     */
/*  4. getCourse() / getModule() — return `ResolvedCourse` /           */
/*     `ResolvedModule` whose `.lessons` arrays are `LessonRef[]`,     */
/*     not the legacy full Lesson[] with blocks embedded.              */
/* ------------------------------------------------------------------ */

/* ---- Load registered content (side-effect imports) --------------- */
import "@/content/courses/python/index";
// data-analysis course will be imported here after A2.5

/* ---- Re-export normalized types ----------------------------------- */
export type {
  Difficulty,
  LessonLanguage,
  LessonMeta,
  Lesson,
  ModuleMeta,
  CourseMeta,
  LessonRef,
  ResolvedModule,
  ResolvedCourse,
} from "./types";

export type { LearningBlock, BlockType } from "./blocks";

/* ---- Re-export registry query API --------------------------------- */
export {
  registerCourse,
  getAllCourses,
  getCourse,
  getModule,
  getLesson,
  allLessons,
  nextLesson,
} from "./registry";
