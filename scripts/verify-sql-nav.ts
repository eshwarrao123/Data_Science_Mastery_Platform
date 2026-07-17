/* Temp verification: sql domain lesson resolution + prev/next + ordering */
import "../src/content/courses";
import {
  getCourse,
  getModule,
  getLesson,
  allLessons,
  nextLesson,
  prevLesson,
} from "../src/lib/curriculum";

const course = getCourse("sql");
if (!course) throw new Error("sql course missing");

const expected: Record<string, string[]> = {
  foundations: [
    "what-is-a-database",
    "select-and-from",
    "where-and-filtering",
    "order-by-and-limit",
    "aggregate-functions",
    "group-by-and-having",
  ],
  joins: [
    "inner-join",
    "left-and-right-joins",
    "full-outer-join",
    "self-joins",
    "multiple-joins",
  ],
  advanced: [
    "subqueries",
    "ctes",
    "window-functions-sql",
    "case-statements",
    "string-and-date-functions",
  ],
  design: [
    "database-design-concepts",
    "normalization",
    "indexes-and-optimization",
    "transactions-and-acid",
  ],
  analysis: ["sql-for-eda", "project-sql-business-analysis"],
};

let errors = 0;

// 1. sidebar ordering: moduleOrder and per-module lessonOrder match the manifest
const moduleOrder = Object.keys(expected);
if (JSON.stringify(course.moduleOrder) !== JSON.stringify(moduleOrder)) {
  console.error("✗ moduleOrder mismatch:", course.moduleOrder);
  errors++;
} else {
  console.log("✓ moduleOrder matches manifest (5 modules)");
}

let resolved = 0;
for (const [modSlug, lessons] of Object.entries(expected)) {
  const mod = getModule("sql", modSlug);
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
    const lesson = getLesson("sql", modSlug, slug);
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
console.log(`✓ ${resolved}/22 sql lessons resolve with core blocks`);

// 2. prev/next chain across the sql slice of the global order
const flat = allLessons();
const sqlLessons = flat.filter((l) => l.courseSlug === "sql");
if (sqlLessons.length !== 22) {
  console.error(`✗ expected 22 sql lessons in global order, got ${sqlLessons.length}`);
  errors++;
}
const expectedFlat = Object.entries(expected).flatMap(([m, ls]) =>
  ls.map((s) => `sql.${m}.${s}`)
);
if (JSON.stringify(sqlLessons.map((l) => l.id)) !== JSON.stringify(expectedFlat)) {
  console.error("✗ global sql lesson order mismatch");
  errors++;
} else {
  console.log("✓ global order: 22 lessons in manifest sequence");
}

for (const l of sqlLessons) {
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
console.log("✓ prev/next verified for all 22 sql lessons (incl. course boundaries)");

const first = sqlLessons[0];
const last = sqlLessons[sqlLessons.length - 1];
console.log(
  `boundaries: into-sql prev=${prevLesson(first.slug)?.id ?? "null"} | out-of-sql next=${nextLesson(last.slug)?.id ?? "null"}`
);

if (errors > 0) {
  console.error(`FAILED with ${errors} error(s)`);
  process.exit(1);
}
console.log("ALL NAVIGATION CHECKS PASSED");
