/* Temp verification: data-analysis domain lesson resolution + prev/next + ordering */
import "../src/content/courses";
import {
  getCourse,
  getModule,
  getLesson,
  allLessons,
  nextLesson,
  prevLesson,
} from "../src/lib/curriculum";

const course = getCourse("data-analysis");
if (!course) throw new Error("data-analysis course missing");

const expected: Record<string, string[]> = {
  "pandas-core": [
    "pandas-dataframes",
    "series-and-index",
    "data-selection",
    "adding-modifying-columns",
    "handling-missing-data",
    "sorting-and-ranking",
  ],
  cleaning: [
    "common-data-quality-issues",
    "detecting-handling-nulls",
    "deduplication",
    "type-coercion",
    "string-cleaning",
    "outlier-detection",
  ],
  transformation: [
    "groupby-and-aggregation",
    "reshaping-pivot-melt",
    "merging-and-joining",
    "window-functions",
    "apply-and-transform",
  ],
  eda: [
    "eda-workflow",
    "univariate-analysis",
    "bivariate-analysis",
    "multivariate-analysis",
    "project-eda-real-dataset",
  ],
};

let errors = 0;

// 1. sidebar ordering: moduleOrder and per-module lessonOrder match the manifest
const moduleOrder = Object.keys(expected);
if (JSON.stringify(course.moduleOrder) !== JSON.stringify(moduleOrder)) {
  console.error("✗ moduleOrder mismatch:", course.moduleOrder);
  errors++;
} else {
  console.log("✓ moduleOrder matches manifest (4 modules)");
}

let resolved = 0;
for (const [modSlug, lessons] of Object.entries(expected)) {
  const mod = getModule("data-analysis", modSlug);
  if (!mod) {
    console.error(`✗ module missing: ${modSlug}`);
    errors++;
    continue;
  }
  if (JSON.stringify(mod.lessonOrder) !== JSON.stringify(lessons)) {
    console.error(`✗ lessonOrder mismatch in ${modSlug}:`, mod.lessonOrder);
    errors++;
  }
  const sidebar = mod.lessons.map((l) => l.slug);
  if (JSON.stringify(sidebar) !== JSON.stringify(lessons)) {
    console.error(`✗ resolved sidebar order mismatch in ${modSlug}:`, sidebar);
    errors++;
  }
  for (const slug of lessons) {
    const lesson = getLesson("data-analysis", modSlug, slug);
    if (!lesson) {
      console.error(`✗ lesson does not resolve: ${modSlug}/${slug}`);
      errors++;
      continue;
    }
    const blocks = lesson.blocks.map((b) => b.id);
    for (const core of ["intro", "theory", "worked-examples", "exercises", "recap"]) {
      if (!blocks.includes(core)) {
        console.error(`✗ ${modSlug}/${slug} missing block ${core}`);
        errors++;
      }
    }
    resolved++;
  }
}
console.log(`✓ ${resolved}/22 data-analysis lessons resolve with core blocks`);

// 2. prev/next chain across the data-analysis slice of the global order
const flat = allLessons();
const da = flat.filter((l) => l.courseSlug === "data-analysis");
if (da.length !== 22) {
  console.error(`✗ expected 22 data-analysis lessons in global order, got ${da.length}`);
  errors++;
}
const expectedFlat = Object.entries(expected).flatMap(([m, ls]) =>
  ls.map((s) => `data-analysis.${m}.${s}`)
);
if (JSON.stringify(da.map((l) => l.id)) !== JSON.stringify(expectedFlat)) {
  console.error("✗ global data-analysis lesson order mismatch");
  errors++;
} else {
  console.log("✓ global order: 22 lessons in manifest sequence");
}

for (const l of da) {
  const gi = flat.findIndex((f) => f.slug === l.slug);
  const next = nextLesson(l.slug);
  const prev = prevLesson(l.slug);
  const expNext = gi < flat.length - 1 ? flat[gi + 1].id : null;
  const expPrev = gi > 0 ? flat[gi - 1].id : null;
  if ((next?.id ?? null) !== expNext) {
    console.error(`✗ nextLesson wrong at ${l.id}: got ${next?.id}, want ${expNext}`);
    errors++;
  }
  if ((prev?.id ?? null) !== expPrev) {
    console.error(`✗ prevLesson wrong at ${l.id}: got ${prev?.id}, want ${expPrev}`);
    errors++;
  }
}
console.log("✓ prev/next verified for all 22 data-analysis lessons (incl. course boundaries)");

const first = da[0];
const last = da[da.length - 1];
console.log(
  `boundaries: into-data-analysis prev=${prevLesson(first.slug)?.id ?? "null"} | out-of-data-analysis next=${nextLesson(last.slug)?.id ?? "null"}`
);

if (errors > 0) {
  console.error(`FAILED with ${errors} error(s)`);
  process.exit(1);
}
console.log("ALL NAVIGATION CHECKS PASSED");
