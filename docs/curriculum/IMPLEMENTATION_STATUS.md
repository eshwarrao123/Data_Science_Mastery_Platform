# DSM Curriculum — Implementation Status

Last updated: 2026-07-16 (Python domain complete)

| # | Domain (course slug) | Planned | Implemented | Registry | Validation | Notes |
|---|---|---|---|---|---|---|
| 1 | foundations | 12 | 12 | ✅ registered | pending script | Complete. FOUNDATIONS_AUDIT.md: PASS WITH FIXES (wording fixes still open, non-blocking) |
| 2 | python | 36 | 36 | ✅ registered (7 modules) | ✅ passing | COMPLETE — all modules implemented, validated, built, navigation verified |
| 3 | math-statistics | 25 | 0 | metadata only, moduleOrder empty | — | |
| 4 | data-analysis | 22 | 22 | ✅ all 4 modules registered | ✅ passing | DOMAIN COMPLETE — verified (nav + build) 2026-07-17 |
| 5 | sql | 22 | 22 | ✅ all 5 modules registered | ✅ passing (0 errors, 0 warnings) | ✅ COMPLETE — foundations 6/6, joins 5/5, advanced 5/5, design 4/4, analysis 2/2; nav verified, build clean |
| 6 | visualization | 16 | 0 | metadata only | — | |
| 7 | machine-learning | 32 | 0 | metadata only | — | |
| 8 | deep-learning | 21 | 0 | metadata only | — | |
| 9 | big-data | 13 | 0 | metadata only | — | |
| 10 | mlops | 15 | 0 | metadata only | — | |
| 11 | generative-ai | 13 | 0 | metadata only | — | |
| 12 | rag | 11 | 0 | metadata only | — | |
| 13 | agentic-ai | 11 | 0 | metadata only | — | |
| 14 | projects | 9 | 0 | metadata only | — | |
| 15 | career | 15 | 0 | metadata only | — | |
| | **Total** | **273** | **49** | | | |

## Work log

- 2026-07-15 — PYTHON_FOUNDATIONS_AUDIT.md fixes applied (lessonOrder
  reorder, Strings "Next up" repoint, Min-Max output 0.855, py03_code_02
  simplified, control-flow preview framed, unused margin removed,
  USD→EUR reskin, SIMD/BLAS softened). `tsc --noEmit` clean.
- 2026-07-15 — docs/curriculum/ created: README + 15 domain manifests +
  trackers.

- 2026-07-15 — Phase C complete: registry hardened (duplicate tracking,
  prevLesson, getLessonById), validator + `npm run validate:curriculum`
  (tsx), ALL pages migrated off the legacy monolith (lesson page, course
  page, curriculum page, dashboard, profile, command palette). Legacy
  `src/lib/data/curriculum.ts` no longer imported by app code. Verified:
  validation ✓, tsc ✓, production build ✓, global lesson order ✓,
  prev/next navigation ✓, previously-404 registry lessons now resolve ✓.

- 2026-07-15 — python/control-flow complete: conditionals (py06),
  for-loops (py07), while-loops (py08), loop-control (py09),
  list-comprehensions (py10). Registered, validated, tsc clean,
  navigation verified end-to-end.

- 2026-07-15 — python/functions complete: defining-functions (py11),
  parameters-and-return-values (py12), default-and-keyword-args (py13),
  args-and-kwargs (py14), lambda-functions (py15), higher-order-functions
  (py16), scope-and-closures (py17). Registered, validated, tsc clean.

- 2026-07-15 — python/data-structures complete: tuples (py18),
  dictionaries (py19), sets (py20), nested-data-structures (py21),
  choosing-the-right-structure (py22). Registered, validated, tsc clean.

- 2026-07-16 — python/oop complete: classes-and-objects (py23),
  attributes-and-methods (py24), inheritance (py25),
  encapsulation-and-properties (py26), special-methods (py27).
  Registered, validated, tsc clean.

- 2026-07-16 — python/error-handling complete: exceptions-and-try-except
  (py28), raising-exceptions (py29), reading-and-writing-files (py30),
  working-with-paths (py31). Registered, validated, tsc clean.

- 2026-07-16 — python/python-ds-tools complete: package-management (py32),
  numpy-operations (py33), dates-and-times (py34), regex-for-data (py35),
  project-python-pipeline (py36). Registered.

- 2026-07-16 — PYTHON DOMAIN COMPLETE (36/36). Verified end-to-end:
  validate:curriculum ✓ (49 lessons, 323 exercises; 1 known pandas
  warning), tsc --noEmit ✓, production build ✓, all 36 lessons resolve
  with core blocks ✓, prev/next chain incl. course boundaries ✓, sidebar
  module/lesson ordering matches manifest ✓
  (scripts/verify-python-nav.ts).

- 2026-07-17 — data-analysis/pandas-core registered in index.ts (all 6
  lessons: pandas-dataframes, series-and-index, data-selection,
  adding-modifying-columns, handling-missing-data, sorting-and-ranking).
  pandas-dataframes recap warning resolved. Validation ✓, tsc ✓.

- 2026-07-17 — data-analysis/cleaning complete:
  common-data-quality-issues (pda07), detecting-handling-nulls (pda08),
  deduplication (pda09), type-coercion (pda10), string-cleaning (pda11),
  outlier-detection (pda12). Registered, validated, tsc clean.

- 2026-07-17 — data-analysis/transformation complete:
  groupby-and-aggregation (pda13), reshaping-pivot-melt (pda14),
  merging-and-joining (pda15), window-functions (pda16),
  apply-and-transform (pda17). Registered, validated, tsc clean.

- 2026-07-17 — data-analysis/eda complete: eda-workflow (pda18),
  univariate-analysis (pda19), bivariate-analysis (pda20),
  multivariate-analysis (pda21), project-eda-real-dataset (pda22).
  Registered, validated ("✓ curriculum valid": 70 lessons, 449
  exercises), tsc clean.

- 2026-07-17 — data-analysis DOMAIN VERIFIED: all 22 lessons resolve
  with core blocks, prev/next chain correct across all 22 (boundary:
  prev of first = python project lesson, next of last = null), sidebar
  moduleOrder/lessonOrder match manifest
  (scripts/verify-data-analysis-nav.ts), production build passes.

- 2026-07-17 — sql/foundations complete: what-is-a-database (sql01),
  select-and-from (sql02), where-and-filtering (sql03), order-by-and-limit
  (sql04), aggregate-functions (sql05), group-by-and-having (sql06).
  All 5 SQL modules + course moduleOrder scaffolded; foundations fully
  registered; other modules registered with partial lessons (joins 2/5,
  advanced 1/5, design 1/4, analysis 1/2). Validation ✓ (0 errors,
  partial-module warnings expected), tsc ✓.

- 2026-07-17 — sql/joins complete: inner-join (sql07), left-and-right-joins
  (sql08), full-outer-join (sql09), self-joins (sql10), multiple-joins
  (sql11). Registered, validated ✓ (0 errors), tsc ✓.

- 2026-07-17 — sql/advanced complete: subqueries (sql12), ctes (sql13),
  window-functions-sql (sql14), case-statements (sql15),
  string-and-date-functions (sql16). Registered, validated ✓ (0 errors,
  partial-module warnings only for design/analysis), tsc ✓.

- 2026-07-17 — sql/design complete: database-design-concepts (sql17),
  normalization (sql18), indexes-and-optimization (sql19),
  transactions-and-acid (sql20). Registered, validated ✓ (0 errors, one
  partial-module warning for analysis), tsc ✓.

- 2026-07-17 — sql/analysis complete: sql-for-eda (sql21),
  project-sql-business-analysis (sql22). SQL DOMAIN COMPLETE (22/22).
  Validation ✓ (0 errors, 0 warnings), tsc ✓, navigation verified
  (scripts/verify-sql-nav.ts: moduleOrder, lesson resolution, prev/next
  chain incl. course boundaries all pass), production build ✓.

## Current phase

Python (Domain 2), Data Analysis (Domain 4), and SQL (Domain 5) are
COMPLETE. SQL: 22/22 lessons, all 5 modules registered, validation
clean (0 errors, 0 warnings), tsc clean, navigation verified, production
build passing (2026-07-17). Next domain: Machine Learning (06-ml.md) —
awaiting explicit go-ahead; do not start it automatically.
