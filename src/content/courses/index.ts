/* ------------------------------------------------------------------ */
/*  Content Manifest                                                    */
/*                                                                     */
/*  Each course entry file calls registerCourse() as a side effect.   */
/*  Import this file once (from src/lib/curriculum/index.ts) to boot  */
/*  all courses into the registry.                                     */
/*                                                                     */
/*  To add a new course:                                               */
/*    1. Create src/content/courses/<slug>/index.ts                    */
/*    2. Add one import line below — nothing else changes.             */
/* ------------------------------------------------------------------ */

import "./python/index";
import "./data-analysis/index";
// import "./sql/index";             ← future courses follow the same pattern
