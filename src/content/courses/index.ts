/* ------------------------------------------------------------------ */
/*  Content Manifest                                                    */
/*                                                                     */
/*  Each course entry file calls registerCourse() as a side effect.   */
/*  Import this file once (from src/lib/curriculum/index.ts) to boot  */
/*  all courses into the registry.                                     */
/*                                                                     */
/*  To add a new course:                                               */
/*    1. Create src/content/courses/<slug>/index.ts                    */
/*    2. Uncomment (or add) one import line below — nothing else.      */
/* ------------------------------------------------------------------ */

/* ── Tier 1: Active (course has lesson content) ───────────────────── */
import "./python/index";
import "./data-analysis/index";

/* ── Tier 2: Registered (course metadata only, lessons coming) ─────── */
import "./foundations/index";
import "./math-statistics/index";
import "./sql/index";
import "./visualization/index";
import "./machine-learning/index";
import "./deep-learning/index";
import "./big-data/index";
import "./mlops/index";
import "./generative-ai/index";
import "./rag/index";
import "./agentic-ai/index";
import "./projects/index";
import "./career/index";
