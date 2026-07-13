/* ------------------------------------------------------------------ */
/*  DSM Unlock Engine                                                   */
/*                                                                     */
/*  Determines learner access from prerequisite graphs + progress.     */
/*  Pure selectors — no UI, no events, no side effects.                */
/*                                                                     */
/*  Prerequisite model is intentionally open: PrereqNode is a         */
/*  discriminated union so future graph shapes (optional branches,     */
/*  capstones, OR-groups) extend without touching existing callers.    */
/* ------------------------------------------------------------------ */

import type { LessonProgress } from "@/lib/store/learning-progress";
import { hasMasteredLesson, type LessonMasteryConfig } from "@/lib/mastery/mastery-engine";
import { useLearningProgress } from "@/lib/store/learning-progress";

/* ------------------------------------------------------------------ */
/*  Prerequisite graph nodes (discriminated union — extensible)        */
/* ------------------------------------------------------------------ */

/** All prereqs in the list must be satisfied (AND-group). */
export interface AllPrereqs {
  kind: "all";
  prereqs: PrereqNode[];
}

/** At least one prereq must be satisfied (OR-group — future). */
export interface AnyPrereqs {
  kind: "any";
  prereqs: PrereqNode[];
}

/** Lesson must be completed (status === "completed"). */
export interface LessonCompletedPrereq {
  kind: "lesson_completed";
  lessonId: string;
}

/** Lesson must be mastered (mastery engine score ≥ threshold). */
export interface LessonMasteredPrereq {
  kind: "lesson_mastered";
  lessonId: string;
  masteryConfig?: LessonMasteryConfig;
}

/** All lessons in a module must be completed. */
export interface ModuleCompletedPrereq {
  kind: "module_completed";
  /** Dotted module ID, e.g. "python.foundations". */
  moduleId: string;
  lessonIds: string[]; // ordered lesson IDs within the module
}

/** All lessons in a course must be completed. */
export interface CourseCompletedPrereq {
  kind: "course_completed";
  courseId: string;
  lessonIds: string[];
}

export type PrereqNode =
  | AllPrereqs
  | AnyPrereqs
  | LessonCompletedPrereq
  | LessonMasteredPrereq
  | ModuleCompletedPrereq
  | CourseCompletedPrereq;

/* ------------------------------------------------------------------ */
/*  Unlock descriptor — attach to curriculum metadata                  */
/* ------------------------------------------------------------------ */

export interface UnlockDescriptor {
  /** When absent the item is always unlocked. */
  prereq?: PrereqNode;
}

/* ------------------------------------------------------------------ */
/*  Result                                                              */
/* ------------------------------------------------------------------ */

export interface UnlockResult {
  unlocked: boolean;
  /** Human-readable reason when locked. Undefined when unlocked. */
  lockedReason?: string;
}

/* ------------------------------------------------------------------ */
/*  Core evaluation (pure — no store access)                           */
/* ------------------------------------------------------------------ */

function evalNode(
  node: PrereqNode,
  lessons: Record<string, LessonProgress>,
): UnlockResult {
  switch (node.kind) {
    case "all": {
      for (const child of node.prereqs) {
        const r = evalNode(child, lessons);
        if (!r.unlocked) return r;
      }
      return { unlocked: true };
    }

    case "any": {
      const reasons: string[] = [];
      for (const child of node.prereqs) {
        const r = evalNode(child, lessons);
        if (r.unlocked) return { unlocked: true };
        if (r.lockedReason) reasons.push(r.lockedReason);
      }
      return { unlocked: false, lockedReason: reasons[0] ?? "Prerequisites not met." };
    }

    case "lesson_completed": {
      const done = lessons[node.lessonId]?.status === "completed";
      return done
        ? { unlocked: true }
        : { unlocked: false, lockedReason: `Complete lesson "${node.lessonId}" first.` };
    }

    case "lesson_mastered": {
      const mastered = hasMasteredLesson(lessons, node.lessonId, node.masteryConfig);
      return mastered
        ? { unlocked: true }
        : { unlocked: false, lockedReason: `Master lesson "${node.lessonId}" first.` };
    }

    case "module_completed": {
      const incomplete = node.lessonIds.find((id) => lessons[id]?.status !== "completed");
      return incomplete
        ? { unlocked: false, lockedReason: `Complete all lessons in module "${node.moduleId}" first.` }
        : { unlocked: true };
    }

    case "course_completed": {
      const incomplete = node.lessonIds.find((id) => lessons[id]?.status !== "completed");
      return incomplete
        ? { unlocked: false, lockedReason: `Complete all lessons in course "${node.courseId}" first.` }
        : { unlocked: true };
    }
  }
}

/* ------------------------------------------------------------------ */
/*  Public selectors                                                    */
/* ------------------------------------------------------------------ */

export function isLessonUnlocked(
  lessons: Record<string, LessonProgress>,
  descriptor: UnlockDescriptor,
): UnlockResult {
  if (!descriptor.prereq) return { unlocked: true };
  return evalNode(descriptor.prereq, lessons);
}

export function isModuleUnlocked(
  lessons: Record<string, LessonProgress>,
  descriptor: UnlockDescriptor,
): UnlockResult {
  return isLessonUnlocked(lessons, descriptor);
}

export function isCourseUnlocked(
  lessons: Record<string, LessonProgress>,
  descriptor: UnlockDescriptor,
): UnlockResult {
  return isLessonUnlocked(lessons, descriptor);
}

export function getLockedReason(
  lessons: Record<string, LessonProgress>,
  descriptor: UnlockDescriptor,
): string | undefined {
  return isLessonUnlocked(lessons, descriptor).lockedReason;
}

/* ------------------------------------------------------------------ */
/*  React hook                                                          */
/* ------------------------------------------------------------------ */

export function useUnlock() {
  const lessons = useLearningProgress((s) => s.lessons);
  return {
    isLessonUnlocked: (d: UnlockDescriptor) => isLessonUnlocked(lessons, d),
    isModuleUnlocked: (d: UnlockDescriptor) => isModuleUnlocked(lessons, d),
    isCourseUnlocked: (d: UnlockDescriptor) => isCourseUnlocked(lessons, d),
    getLockedReason: (d: UnlockDescriptor) => getLockedReason(lessons, d),
  };
}
