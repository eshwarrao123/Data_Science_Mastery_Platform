/* ------------------------------------------------------------------ */
/*  DSM Curriculum Validator                                            */
/*                                                                     */
/*  Runs against the live registry (runtime source of truth). The      */
/*  markdown manifests under docs/curriculum/ are planning docs; the   */
/*  invariants below keep the registry internally consistent so the    */
/*  manifests and the app can both trust it.                           */
/*                                                                     */
/*  Invoked by scripts/validate-curriculum.ts (npm run                  */
/*  validate:curriculum). Also importable from dev tooling.            */
/* ------------------------------------------------------------------ */

import type { Exercise } from "@/lib/types";
import { getAllCourses, getLesson, getRegistrationIssues } from "./registry";

export interface ValidationReport {
  errors: string[];
  warnings: string[];
  stats: {
    courses: number;
    modules: number;
    lessons: number;
    exercises: number;
  };
}

/** Block types a full instructional lesson is expected to carry. */
const CORE_BLOCK_TYPES = [
  "lesson-intro",
  "theory-blocks",
  "worked-examples",
  "inline-code",
  "mastery-assessment",
  "recap",
] as const;

export function validateCurriculum(): ValidationReport {
  const errors: string[] = [];
  const warnings: string[] = [];

  const courses = getAllCourses();

  /* Registration-time anomalies (duplicate slug overwrites). */
  for (const issue of getRegistrationIssues()) errors.push(issue);

  /* Course-level checks. */
  const courseSlugs = new Set<string>();
  const orderIndexes = new Map<number, string>();
  for (const c of courses) {
    if (courseSlugs.has(c.slug)) errors.push(`Duplicate course slug "${c.slug}"`);
    courseSlugs.add(c.slug);
    const clash = orderIndexes.get(c.orderIndex);
    if (clash) warnings.push(`Courses "${clash}" and "${c.slug}" share orderIndex ${c.orderIndex}`);
    orderIndexes.set(c.orderIndex, c.slug);
  }

  const globalLessonIds = new Map<string, string>();
  const globalLessonSlugs = new Map<string, string>();
  const globalExerciseIds = new Map<string, string>();
  let moduleCount = 0;
  let lessonCount = 0;
  let exerciseCount = 0;

  for (const course of courses) {
    /* moduleOrder ⇄ registered modules, both directions. */
    const registeredModuleSlugs = new Set(course.modules.map((m) => m.slug));
    for (const slug of course.moduleOrder) {
      if (!registeredModuleSlugs.has(slug)) {
        errors.push(`Course "${course.slug}": moduleOrder lists "${slug}" but no such module is registered`);
      }
    }
    const orderSet = new Set(course.moduleOrder);
    for (const m of course.modules) {
      if (!orderSet.has(m.slug)) {
        errors.push(`Course "${course.slug}": module "${m.slug}" is registered but missing from moduleOrder (unreachable)`);
      }
    }
    if (new Set(course.moduleOrder).size !== course.moduleOrder.length) {
      errors.push(`Course "${course.slug}": moduleOrder contains duplicates`);
    }

    for (const mod of course.modules) {
      moduleCount++;
      if (mod.id !== `${course.slug}.${mod.slug}`) {
        errors.push(`Module "${mod.slug}": id "${mod.id}" ≠ "${course.slug}.${mod.slug}"`);
      }
      if (new Set(mod.lessonOrder).size !== mod.lessonOrder.length) {
        errors.push(`Module "${mod.id}": lessonOrder contains duplicates`);
      }

      /* lessonOrder ⇄ registered lessons. A lessonOrder entry with no
         registered lesson is a *planned* slot — allowed, but flagged so a
         module is never silently half-implemented. */
      const registered = new Set(mod.lessons.map((l) => l.slug));
      const planned = mod.lessonOrder.filter((s) => !registered.has(s));
      if (planned.length > 0 && registered.size > 0) {
        warnings.push(
          `Module "${mod.id}": partially implemented — ${registered.size}/${mod.lessonOrder.length} lessons registered (missing: ${planned.join(", ")})`,
        );
      }
      const orderedSet = new Set(mod.lessonOrder);
      for (const l of mod.lessons) {
        if (!orderedSet.has(l.slug)) {
          errors.push(`Module "${mod.id}": lesson "${l.slug}" registered but missing from lessonOrder (unreachable in navigation)`);
        }
      }

      for (const ref of mod.lessons) {
        lessonCount++;
        const expectedId = `${course.slug}.${mod.slug}.${ref.slug}`;
        if (ref.id !== expectedId) {
          errors.push(`Lesson "${ref.slug}": meta.id "${ref.id}" ≠ "${expectedId}"`);
        }
        const idClash = globalLessonIds.get(ref.id);
        if (idClash) errors.push(`Duplicate lesson id "${ref.id}" (also in ${idClash})`);
        globalLessonIds.set(ref.id, mod.id);

        /* Lesson slugs must be globally unique: progress storage and
           next/prev navigation are keyed by bare slug. */
        const slugClash = globalLessonSlugs.get(ref.slug);
        if (slugClash) {
          errors.push(`Lesson slug "${ref.slug}" is not globally unique (in ${slugClash} and ${mod.id}) — navigation and progress keys collide`);
        }
        globalLessonSlugs.set(ref.slug, mod.id);

        /* Body checks need the full lesson. */
        const lesson = getLesson(course.slug, mod.slug, ref.slug);
        if (!lesson) continue;
        if (lesson.blocks.length === 0) {
          errors.push(`Lesson "${ref.id}": empty blocks array`);
          continue;
        }

        const present = new Set(lesson.blocks.map((b) => b.type));
        for (const t of CORE_BLOCK_TYPES) {
          if (!present.has(t)) warnings.push(`Lesson "${ref.id}": missing core block "${t}"`);
        }
        const blockIds = lesson.blocks.map((b) => b.id);
        if (new Set(blockIds).size !== blockIds.length) {
          errors.push(`Lesson "${ref.id}": duplicate block ids`);
        }

        for (const block of lesson.blocks) {
          if (block.type === "mastery-assessment") {
            for (const ex of block.exercises as Exercise[]) {
              exerciseCount++;
              const exClash = globalExerciseIds.get(ex.id);
              if (exClash) errors.push(`Duplicate exercise id "${ex.id}" (in ${exClash} and ${ref.id})`);
              globalExerciseIds.set(ex.id, ref.id);
              if (ex.type === "mcq" || ex.type === "scenario") {
                if (ex.correctIndex < 0 || ex.correctIndex >= ex.options.length) {
                  errors.push(`Exercise "${ex.id}": correctIndex ${ex.correctIndex} out of range`);
                }
              }
            }
          }
        }

        /* Prerequisites must resolve (to a registered lesson) or at least
           parse as dotted IDs. Unresolved = warning: it may point at a
           planned-but-unimplemented lesson. */
        for (const p of lesson.meta.prerequisites) {
          const parts = p.split(".");
          if (parts.length !== 3) {
            errors.push(`Lesson "${ref.id}": prerequisite "${p}" is not a dotted lesson id`);
          } else if (!getLesson(parts[0], parts[1], parts[2])) {
            warnings.push(`Lesson "${ref.id}": prerequisite "${p}" is not implemented yet`);
          }
        }
      }
    }
  }

  return {
    errors,
    warnings,
    stats: {
      courses: courses.length,
      modules: moduleCount,
      lessons: lessonCount,
      exercises: exerciseCount,
    },
  };
}
