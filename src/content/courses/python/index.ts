/* ------------------------------------------------------------------ */
/*  Python course — registers course + all modules + lessons           */
/*  Import this once (e.g. from src/lib/curriculum/index.ts) to        */
/*  publish the Python course into the curriculum registry.            */
/*                                                                     */
/*  Phase P1: full module structure is registered. Modules beyond      */
/*  Foundations carry metadata + lessonOrder only — lesson bodies are  */
/*  authored in later phases and slotted into their `lessons` arrays.  */
/* ------------------------------------------------------------------ */

import { registerCourse } from "@/lib/curriculum/registry";
import { pythonCourse } from "./course";

import { foundationsModule } from "./modules/foundations/module";
import { controlFlowModule } from "./modules/control-flow/module";
import { functionsModule } from "./modules/functions/module";
import { dataStructuresModule } from "./modules/data-structures/module";
import { oopModule } from "./modules/oop/module";
import { errorHandlingModule } from "./modules/error-handling/module";
import { pythonDsToolsModule } from "./modules/python-ds-tools/module";

import { variablesAndDataTypes } from "./modules/foundations/lessons/variables-and-data-types";
import { listsVsNumpyArrays } from "./modules/foundations/lessons/lists-vs-numpy-arrays";
import { stringsAndStringMethods } from "./modules/foundations/lessons/strings-and-string-methods";
import { operatorsAndExpressions } from "./modules/foundations/lessons/operators-and-expressions";
import { typeConversion } from "./modules/foundations/lessons/type-conversion";

registerCourse(pythonCourse, [
  {
    module: foundationsModule,
    lessons: [
      variablesAndDataTypes,
      listsVsNumpyArrays,
      stringsAndStringMethods,
      operatorsAndExpressions,
      typeConversion,
    ],
  },
  { module: controlFlowModule, lessons: [] },
  { module: functionsModule, lessons: [] },
  { module: dataStructuresModule, lessons: [] },
  { module: oopModule, lessons: [] },
  { module: errorHandlingModule, lessons: [] },
  { module: pythonDsToolsModule, lessons: [] },
]);
