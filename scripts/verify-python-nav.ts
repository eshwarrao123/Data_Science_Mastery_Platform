/* Temp verification: python domain lesson resolution + prev/next + ordering */
import "../src/content/courses";
import {
  getCourse,
  getModule,
  getLesson,
  allLessons,
  nextLesson,
  prevLesson,
} from "../src/lib/curriculum";

const course = getCourse("python");
if (!course) throw new Error("python course missing");

const expected: Record<string, string[]> = {
  foundations: [
    "variables-and-data-types",
    "strings-and-string-methods",
    "operators-and-expressions",
    "type-conversion",
    "lists-vs-numpy-arrays",
  ],
  "control-flow": [
    "conditionals",
    "for-loops",
    "while-loops",
    "loop-control",
    "list-comprehensions",
  ],
  functions: [
    "defining-functions",
    "parameters-and-return-values",
    "default-and-keyword-args",
    "args-and-kwargs",
    "lambda-functions",
    "higher-order-functions",
    "scope-and-closures",
  ],
  "data-structures": [
    "tuples",
    "dictionaries",
    "sets",
    "nested-data-structures",
    "choosing-the-right-structure",
  ],
  oop: [
    "classes-and-objects",
    "attributes-and-methods",
    "inheritance",
    "encapsulation-and-properties",
    "special-methods",
  ],
  "error-handling": [
    "exceptions-and-try-except",
    "raising-exceptions",
    "reading-and-writing-files",
    "working-with-paths",
  ],
  "python-ds-tools": [
    "package-management",
    "numpy-operations",
    "dates-and-times",
    "regex-for-data",
    "project-python-pipeline",
  ],
};

let errors = 0;

// 1. sidebar ordering: moduleOrder and per-module lessonOrder match the manifest
const moduleOrder = Object.keys(expected);
if (JSON.stringify(course.moduleOrder) !== JSON.stringify(moduleOrder)) {
  console.error("✗ moduleOrder mismatch:", course.moduleOrder);
  errors++;
} else {
  console.log("✓ moduleOrder matches manifest (7 modules)");
}

let resolved = 0;
for (const [modSlug, lessons] of Object.entries(expected)) {
  const mod = getModule("python", modSlug);
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
    const lesson = getLesson("python", modSlug, slug);
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
console.log(`✓ ${resolved}/36 python lessons resolve with core blocks`);

// 2. prev/next chain across the python slice of the global order
const flat = allLessons();
const py = flat.filter((l) => l.courseSlug === "python");
if (py.length !== 36) {
  console.error(`✗ expected 36 python lessons in global order, got ${py.length}`);
  errors++;
}
const expectedFlat = Object.entries(expected).flatMap(([m, ls]) =>
  ls.map((s) => `python.${m}.${s}`)
);
if (JSON.stringify(py.map((l) => l.id)) !== JSON.stringify(expectedFlat)) {
  console.error("✗ global python lesson order mismatch");
  errors++;
} else {
  console.log("✓ global order: 36 lessons in manifest sequence");
}

for (const l of py) {
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
console.log("✓ prev/next verified for all 36 python lessons (incl. course boundaries)");

const first = py[0];
const last = py[py.length - 1];
console.log(
  `boundaries: into-python prev=${prevLesson(first.slug)?.id ?? "null"} | out-of-python next=${nextLesson(last.slug)?.id ?? "null"}`
);

if (errors > 0) {
  console.error(`FAILED with ${errors} error(s)`);
  process.exit(1);
}
console.log("ALL NAVIGATION CHECKS PASSED");
