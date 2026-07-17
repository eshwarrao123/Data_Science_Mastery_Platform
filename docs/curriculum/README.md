# DSM Curriculum Manifests

This directory is the planning source of truth for the Data Science Mastery
curriculum: one manifest per domain, mirroring CURRICULUM_ARCHITECTURE.md §4.
The **runtime** source of truth is TypeScript — `course.ts` `moduleOrder`,
`module.ts` `lessonOrder`, and the registry under `src/lib/curriculum/`. The
manifests document what should exist and track what does; they never override
the registry, and the registry must never drift from them.

## Curriculum philosophy

DSM takes a learner from zero to industry-ready mastery through 15 domains in
a fixed order:

1. Foundations & Data Literacy
2. Python for Data Science
3. Mathematics & Statistics
4. Data Analysis
5. SQL & Databases
6. Data Visualization
7. Machine Learning
8. Deep Learning
9. Big Data
10. MLOps
11. Generative AI
12. RAG & Vector Databases
13. AI Agents & Agentic AI
14. Industry Projects
15. Career & Interview Readiness

The ordering rule is absolute: **no forward references**. A lesson may only
rely on concepts taught earlier — earlier in its module, an earlier module of
its course, or an earlier domain. If a lesson needs a concept from a later
position, either the lesson is in the wrong place or the concept must be
explicitly framed as a read-only preview.

Projects are embedded throughout the journey (see CURRICULUM_ARCHITECTURE.md
§5), not clustered at the end. Domain 14 holds the nine cross-domain capstones.

## Lesson quality standard

Every lesson implements the same 12-block contract. CONTENT_GUIDELINES.md is
the authoritative style document; this is the summary:

1. **lesson-intro** — a hook, what/why/where framing, learning objectives, and
   3 real-world company applications.
2. **theory-blocks** — 6–8 mixed sub-blocks of core theory, why-before-syntax.
3. **interactive-diagram** — one visual explanation of the central concept.
4. **worked-examples** — exactly 5, graded Very Easy → Easy → Medium → Hard →
   Industry.
5. **inline-code** — a practice editor with starter code, a correct solution,
   and exactly 4 progressive hints.
6. **mastery-assessment** — 6 exercises with module-wide unique IDs.
7. **interview-questions** — 3, tiered Beginner / Intermediate / Advanced.
8. **common-mistakes** callout.
9. **ai-tutor** callout.
10. **glossary** callout.
11. **resources** callout.
12. **recap** — ends with a "Next up" bridge to the next lesson in
    `lessonOrder` (never to a lesson elsewhere in the sequence).

## Naming conventions

- Lesson ID: `<course>.<module>.<lesson-slug>` (dotted), e.g.
  `python.foundations.variables-and-data-types`. See
  `src/lib/curriculum/types.ts` for the identity model.
- All slugs are kebab-case.
- One lesson = one file at
  `src/content/courses/<course>/modules/<module>/lessons/<slug>.ts`.
- Exercise IDs use a per-domain prefix plus a 2-digit lesson number, then a
  type suffix (e.g. `py03_mcq_02`). Python uses `py01`–`py36`, numbered by
  course-wide lesson position; the foundations course used `fnd01`–`fnd12`.
  Each remaining domain uses a 3–4 letter prefix: `mst` (math-statistics),
  `pda` (data-analysis), `sql`, `viz` (visualization), `ml`
  (machine-learning), `dl` (deep-learning), `bgd` (big-data), `mlo` (mlops),
  `gai` (generative-ai), `rag`, `agt` (agentic-ai), `prj` (projects), `car`
  (career). The numeric prefix reflects authoring order and does not have to
  track display order — uniqueness within the course is what matters.

## Ordering rules

- `course.ts` `moduleOrder` is authoritative for module order within a course.
- `module.ts` `lessonOrder` is authoritative for lesson order within a module.
- Navigation, "Next up" bridges, and progress logic derive from the registry.
  Never hand-code lesson sequences anywhere else.
- When a manifest and the architecture document disagree on order, the
  manifest records the correction with a note (see 02-python.md, whose
  foundations order was fixed per PYTHON_FOUNDATIONS_AUDIT.md).

A wiring note: CURRICULUM_ARCHITECTURE.md §4 sometimes shortens the module
segment inside prerequisite IDs (e.g. `data-analysis.cleaning.*` for the
`data-cleaning` module, `machine-learning.tuning.*` for `model-selection`).
Manifests preserve §4's IDs verbatim. When implementing, the real lesson ID
must use the actual module slug from `module.ts` — treat the short form as a
reference to the same module and normalize it at authoring time.

## Difficulty and XP

A lesson's `difficulty` reflects the skill level required to **start** it, not
the challenge of its hardest exercise. Domain 1 is entirely Beginner; later
domains progress Beginner → Intermediate → Advanced module by module.

| Lesson type | XP |
|---|---|
| Beginner lesson | 40–60 |
| Intermediate lesson | 60–90 |
| Advanced lesson | 90–120 |
| Mini project | 150 |
| Module project | 200 |
| Domain project | 300 |
| Capstone | 500 |

## Manifest rules

- Every implemented lesson MUST correspond to a manifest row.
- Every registry entry must be implemented — no meta-only stubs registered as
  lessons.
- No orphan lesson files: a lesson file that is not imported in the course
  `index.ts` and listed in `lessonOrder` does not exist as far as learners are
  concerned, and must not be left in the tree.
- The Status column tracks implementation: `implemented` means the lesson file
  exists with a full 12-block body and is registered; `planned` means it is
  designed here but not yet written.
- Update the Status column in the same change that adds the lesson.

## How future AI agents add lessons safely

1. Read this README.
2. Read the domain manifest for the lesson you are adding.
3. Read the canonical lesson as a structural template:
   `src/content/courses/python/modules/foundations/lessons/variables-and-data-types.ts`.
4. Author the lesson file at
   `src/content/courses/<course>/modules/<module>/lessons/<slug>.ts`,
   following CONTENT_GUIDELINES.md.
5. Add the import and the lesson entry to the course `index.ts` lessons array.
6. Ensure the slug appears at the correct position in the module's
   `module.ts` `lessonOrder` (create the `module.ts` from the manifest's
   module table if it does not exist yet, and add the module slug to
   `course.ts` `moduleOrder`).
7. Run `npm run validate:curriculum && npx tsc --noEmit` and fix anything it
   reports.
8. Update the manifest's Status column and
   `docs/curriculum/IMPLEMENTATION_STATUS.md`.

Do not modify lesson order, prerequisites, slugs, or XP without updating the
manifest in the same change — and never change them casually; downstream
lessons assume them.

## Domain manifests

| File | Domain | Lessons |
|---|---|---|
| 01-foundations.md | Foundations & Data Literacy | 12 |
| 02-python.md | Python for Data Science | 36 |
| 03-math-statistics.md | Mathematics & Statistics | 25 |
| 04-data-analysis.md | Data Analysis | 22 |
| 05-sql.md | SQL & Databases | 22 |
| 06-visualization.md | Data Visualization | 16 |
| 07-machine-learning.md | Machine Learning | 32 |
| 08-deep-learning.md | Deep Learning | 21 |
| 09-big-data.md | Big Data | 13 |
| 10-mlops.md | MLOps | 15 |
| 11-generative-ai.md | Generative AI | 13 |
| 12-rag.md | RAG & Vector Databases | 11 |
| 13-agentic-ai.md | AI Agents & Agentic AI | 11 |
| 14-projects.md | Industry Projects | 9 |
| 15-career.md | Career & Interview Readiness | 15 |

Total: 273 lessons across 59 modules.
