/* Curriculum validation runner — `npm run validate:curriculum`.
   Boots the content registry, runs every invariant, prints a report,
   and exits non-zero on errors so CI can gate on it. */

import "@/lib/curriculum"; // side-effect: registers all courses
import { validateCurriculum } from "@/lib/curriculum/validate";

const { errors, warnings, stats } = validateCurriculum();

console.log(
  `Curriculum: ${stats.courses} courses, ${stats.modules} modules, ${stats.lessons} lessons, ${stats.exercises} exercises`,
);

if (warnings.length) {
  console.log(`\n${warnings.length} warning(s):`);
  for (const w of warnings) console.log(`  ⚠ ${w}`);
}

if (errors.length) {
  console.error(`\n${errors.length} error(s):`);
  for (const e of errors) console.error(`  ✖ ${e}`);
  process.exit(1);
}

console.log("\n✓ curriculum valid");
