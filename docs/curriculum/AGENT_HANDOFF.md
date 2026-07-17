# DSM Agent Handoff

Read this + `README.md` + `IMPLEMENTATION_STATUS.md` + the relevant domain
manifest before touching anything.

## Architecture summary

- **Registry**: `src/lib/curriculum/registry.ts`. Content files call
  `registerCourse(courseMeta, [{module, lessons}])` as a side effect;
  `src/content/courses/index.ts` imports every course's `index.ts`;
  `src/lib/curriculum/index.ts` boots it and re-exports the query API
  (`getAllCourses`, `getCourse`, `getModule`, `getLesson`, `allLessons`,
  `nextLesson`).
- **Lesson shape**: `Lesson = { meta: LessonMeta, blocks: LearningBlock[] }`
  (`src/lib/curriculum/types.ts`, `blocks.ts`). Block union: lesson-intro,
  theory-blocks, interactive-diagram, worked-examples, inline-code,
  mastery-assessment, callout, recap, interview-questions (+ reserved stubs).
  Payload types live in `src/lib/types.ts`.
- **Route**: `src/app/course/[courseSlug]/[moduleSlug]/[lessonSlug]/page.tsx`
  (client page) resolves lessons from the registry. Phase C migrated ALL
  pages (lesson, course, curriculum, dashboard, profile, command palette)
  off the legacy monolith `src/lib/data/curriculum.ts` — registry-only
  lessons route correctly.
- **Ordering**: `course.ts` `moduleOrder` → `module.ts` `lessonOrder` →
  registry derives everything. Never hand-code sequences.

## Canonical lesson reference

`src/content/courses/python/modules/foundations/lessons/variables-and-data-types.ts`
— copy its 12-block structure, id naming (`intro`, `theory`, `diagram`,
`worked-examples`, `inline-practice`, `exercises`, `interview-questions`,
`common-mistakes`, `ai-tutor`, `glossary`, `resources`, `recap`), tone, and
depth. Style law: `CONTENT_GUIDELINES.md` (no "simply"/"obviously", named
companies in realWorldApps, 4 inline-code hints, 6 exercises with unique IDs,
recap "Next up" must point to the actual next lesson in `lessonOrder`).

## Adding a lesson (exact loop)

1. Author `src/content/courses/<course>/modules/<module>/lessons/<slug>.ts`
   exporting a camelCase `Lesson` const.
2. Import it in the course `index.ts` and add to that module's `lessons` array.
3. Confirm the slug is in `module.ts` `lessonOrder` at the right position.
4. `npm run validate:curriculum && npx tsc --noEmit` (validation script may not
   exist yet — see status doc; use `npx tsc --noEmit` at minimum).
5. Update the domain manifest Status column + IMPLEMENTATION_STATUS.md.

## Validation commands

- `npx tsc --noEmit` — must stay clean.
- `npm run validate:curriculum` — curriculum invariants (in progress; see
  IMPLEMENTATION_STATUS.md "Current phase").
- `npm run build` — production build before claiming completion.

## Completed

- Domain 1 (foundations): all 12 lessons.
- Domain 2 (python): COMPLETE — all 36 lessons across 7 modules
  (foundations, control-flow, functions, data-structures, oop,
  error-handling, python-ds-tools). Validated, tsc clean, production
  build clean, navigation verified (scripts/verify-python-nav.ts).
- data-analysis: COMPLETE (22/22) — pandas-core (6/6), cleaning (6/6),
  transformation (5/5), eda (5/5). All registered, validated, tsc
  clean, nav verified (scripts/verify-data-analysis-nav.ts), production
  build passing (2026-07-17).
- sql: COMPLETE (22/22) — foundations (6/6), joins (5/5), advanced
  (5/5), design (4/4), analysis (2/2). All registered, validated, tsc
  clean, nav verified (scripts/verify-sql-nav.ts), production build
  passing (2026-07-17).
- docs/curriculum: README, 15 manifests, trackers.

## Exact next work item

1. SQL domain (05-sql.md) COMPLETE (22/22): foundations 6/6, joins 5/5,
   advanced 5/5, design 4/4, analysis 2/2. All lessons registered in
   src/content/courses/sql/index.ts. Validation ✓ (0 errors/warnings),
   tsc ✓, nav verified (scripts/verify-sql-nav.ts), production build ✓
   (2026-07-17). Exercise IDs sql01–sql22 all used per manifest.
   Next domain: Machine Learning (06-ml.md) — do NOT start without an
   explicit user instruction.

## Known issues

- Legacy monolith `src/lib/data/curriculum.ts` still powers routing; its
  Python course has stale copies of 2 lessons (5-lesson bodies live in
  content files). Do not add content there — retire it per Phase M2 of
  CURRICULUM_ARCHITECTURE.md §7.
- `registerCourse` silently merges; validation must catch duplicate slugs.
- FOUNDATIONS_AUDIT.md has open wording fixes (non-blocking).

## Rules

- No visual redesign; reuse existing blocks and design tokens.
- One lesson = one file. No orphans: file ⇄ index.ts ⇄ lessonOrder ⇄ manifest.
- Never leave a module partially implemented without recording it here.
- Quality over count: a shallow lesson does not count as implemented.
