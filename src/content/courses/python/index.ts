/* ------------------------------------------------------------------ */
/*  Python course — registers course + all modules + lessons           */
/*  Import this once (e.g. from src/lib/curriculum/index.ts) to        */
/*  publish the Python course into the curriculum registry.            */
/* ------------------------------------------------------------------ */

import { registerCourse } from "@/lib/curriculum/registry";
import { pythonCourse } from "./course";
import { foundationsModule } from "./modules/foundations/module";
import { variablesAndDataTypes } from "./modules/foundations/lessons/variables-and-data-types";
import { listsVsNumpyArrays } from "./modules/foundations/lessons/lists-vs-numpy-arrays";

registerCourse(pythonCourse, [
  {
    module: foundationsModule,
    lessons: [variablesAndDataTypes, listsVsNumpyArrays],
  },
]);
