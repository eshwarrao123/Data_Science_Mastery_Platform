/* ------------------------------------------------------------------ */
/*  DSM Curriculum Registry                                             */
/*                                                                     */
/*  Content files call `registerCourse()` to publish their data.       */
/*  The registry assembles ResolvedCourse trees and exposes a          */
/*  type-safe query API consumed by routes, search, and navigation.    */
/* ------------------------------------------------------------------ */

import type {
  CourseMeta,
  ModuleMeta,
  Lesson,
  LessonMeta,
  LessonRef,
  ResolvedModule,
  ResolvedCourse,
} from "./types";

/* ------------------------------------------------------------------ */
/*  Internal store                                                      */
/* ------------------------------------------------------------------ */

interface CourseEntry {
  course: CourseMeta;
  modules: Map<string, ModuleEntry>;
}

interface ModuleEntry {
  module: ModuleMeta;
  /** Keyed by lesson slug. */
  lessons: Map<string, Lesson>;
}

const _courses = new Map<string, CourseEntry>();

/* ------------------------------------------------------------------ */
/*  Registration API (called by content files)                          */
/* ------------------------------------------------------------------ */

/**
 * Register a course, its modules, and all lessons in one call.
 * Safe to call multiple times with the same slug — later calls merge/overwrite.
 */
export function registerCourse(
  course: CourseMeta,
  modules: Array<{
    module: ModuleMeta;
    lessons: Lesson[];
  }>,
): void {
  let entry = _courses.get(course.slug);
  if (!entry) {
    entry = { course, modules: new Map() };
    _courses.set(course.slug, entry);
  } else {
    entry.course = course;
  }

  for (const { module, lessons } of modules) {
    let modEntry = entry.modules.get(module.slug);
    if (!modEntry) {
      modEntry = { module, lessons: new Map() };
      entry.modules.set(module.slug, modEntry);
    } else {
      modEntry.module = module;
    }
    for (const lesson of lessons) {
      modEntry.lessons.set(lesson.meta.slug, lesson);
    }
  }
}

/* ------------------------------------------------------------------ */
/*  Internal helpers                                                    */
/* ------------------------------------------------------------------ */

function toRef(
  meta: LessonMeta,
  courseSlug: string,
  courseTitle: string,
  moduleSlug: string,
  moduleTitle: string,
): LessonRef {
  return {
    id: meta.id,
    slug: meta.slug,
    title: meta.title,
    description: meta.description,
    estimatedTime: meta.estimatedTime,
    difficulty: meta.difficulty,
    xpReward: meta.xpReward,
    prerequisites: meta.prerequisites,
    courseSlug,
    moduleSlug,
    courseTitle,
    moduleTitle,
  };
}

function resolveModule(
  entry: CourseEntry,
  modEntry: ModuleEntry,
): ResolvedModule {
  const { course } = entry;
  const { module, lessons } = modEntry;

  const ordered: LessonRef[] = module.lessonOrder
    .map((slug) => {
      const l = lessons.get(slug);
      if (!l) return null;
      return toRef(l.meta, course.slug, course.title, module.slug, module.title);
    })
    .filter((r): r is LessonRef => r !== null);

  return { ...module, lessons: ordered };
}

function resolveCourse(entry: CourseEntry): ResolvedCourse {
  const { course, modules } = entry;

  const orderedModules: ResolvedModule[] = course.moduleOrder
    .map((slug) => {
      const mod = modules.get(slug);
      if (!mod) return null;
      return resolveModule(entry, mod);
    })
    .filter((m): m is ResolvedModule => m !== null);

  return { ...course, modules: orderedModules };
}

/* ------------------------------------------------------------------ */
/*  Query API                                                           */
/* ------------------------------------------------------------------ */

/** All registered courses, fully resolved and ordered by `orderIndex`. */
export function getAllCourses(): ResolvedCourse[] {
  return Array.from(_courses.values())
    .map(resolveCourse)
    .sort((a, b) => a.orderIndex - b.orderIndex);
}

/** Resolve a course by slug or dotted ID (same value today). */
export function getCourse(slugOrId: string): ResolvedCourse | null {
  const entry = _courses.get(slugOrId);
  return entry ? resolveCourse(entry) : null;
}

/** Resolve a module within a course. */
export function getModule(
  courseSlug: string,
  moduleSlug: string,
): ResolvedModule | null {
  const entry = _courses.get(courseSlug);
  if (!entry) return null;
  const mod = entry.modules.get(moduleSlug);
  if (!mod) return null;
  return resolveModule(entry, mod);
}

/** Resolve a full Lesson (with blocks) from route slugs. */
export function getLesson(
  courseSlug: string,
  moduleSlug: string,
  lessonSlug: string,
): Lesson | null {
  return (
    _courses.get(courseSlug)?.modules.get(moduleSlug)?.lessons.get(lessonSlug) ??
    null
  );
}

/** Flat list of LessonRefs across all registered courses, in curriculum order. */
export function allLessons(): LessonRef[] {
  return getAllCourses().flatMap((c) => c.modules.flatMap((m) => m.lessons));
}

/**
 * Returns the LessonRef immediately following the given lesson slug,
 * respecting module and course boundaries.
 */
export function nextLesson(lessonSlug: string): LessonRef | null {
  const flat = allLessons();
  const idx = flat.findIndex((l) => l.slug === lessonSlug);
  if (idx === -1 || idx === flat.length - 1) return null;
  return flat[idx + 1];
}
