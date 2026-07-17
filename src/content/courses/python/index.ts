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
import { stringsAndStringMethods } from "./modules/foundations/lessons/strings-and-string-methods";
import { operatorsAndExpressions } from "./modules/foundations/lessons/operators-and-expressions";
import { typeConversion } from "./modules/foundations/lessons/type-conversion";
import { listsVsNumpyArrays } from "./modules/foundations/lessons/lists-vs-numpy-arrays";

import { conditionals } from "./modules/control-flow/lessons/conditionals";
import { forLoops } from "./modules/control-flow/lessons/for-loops";
import { whileLoops } from "./modules/control-flow/lessons/while-loops";
import { loopControl } from "./modules/control-flow/lessons/loop-control";
import { listComprehensions } from "./modules/control-flow/lessons/list-comprehensions";

import { definingFunctions } from "./modules/functions/lessons/defining-functions";
import { parametersAndReturnValues } from "./modules/functions/lessons/parameters-and-return-values";
import { defaultAndKeywordArgs } from "./modules/functions/lessons/default-and-keyword-args";
import { argsAndKwargs } from "./modules/functions/lessons/args-and-kwargs";
import { lambdaFunctions } from "./modules/functions/lessons/lambda-functions";
import { higherOrderFunctions } from "./modules/functions/lessons/higher-order-functions";
import { scopeAndClosures } from "./modules/functions/lessons/scope-and-closures";

import { tuples } from "./modules/data-structures/lessons/tuples";
import { dictionaries } from "./modules/data-structures/lessons/dictionaries";
import { sets } from "./modules/data-structures/lessons/sets";
import { nestedDataStructures } from "./modules/data-structures/lessons/nested-data-structures";
import { choosingTheRightStructure } from "./modules/data-structures/lessons/choosing-the-right-structure";

import { classesAndObjects } from "./modules/oop/lessons/classes-and-objects";
import { attributesAndMethods } from "./modules/oop/lessons/attributes-and-methods";
import { inheritance } from "./modules/oop/lessons/inheritance";
import { encapsulationAndProperties } from "./modules/oop/lessons/encapsulation-and-properties";
import { specialMethods } from "./modules/oop/lessons/special-methods";

import { exceptionsAndTryExcept } from "./modules/error-handling/lessons/exceptions-and-try-except";
import { raisingExceptions } from "./modules/error-handling/lessons/raising-exceptions";
import { readingAndWritingFiles } from "./modules/error-handling/lessons/reading-and-writing-files";
import { workingWithPaths } from "./modules/error-handling/lessons/working-with-paths";

import { packageManagement } from "./modules/python-ds-tools/lessons/package-management";
import { numpyOperations } from "./modules/python-ds-tools/lessons/numpy-operations";
import { datesAndTimes } from "./modules/python-ds-tools/lessons/dates-and-times";
import { regexForData } from "./modules/python-ds-tools/lessons/regex-for-data";
import { projectPythonPipeline } from "./modules/python-ds-tools/lessons/project-python-pipeline";

registerCourse(pythonCourse, [
  {
    module: foundationsModule,
    lessons: [
      variablesAndDataTypes,
      stringsAndStringMethods,
      operatorsAndExpressions,
      typeConversion,
      listsVsNumpyArrays,
    ],
  },
  {
    module: controlFlowModule,
    lessons: [
      conditionals,
      forLoops,
      whileLoops,
      loopControl,
      listComprehensions,
    ],
  },
  {
    module: functionsModule,
    lessons: [
      definingFunctions,
      parametersAndReturnValues,
      defaultAndKeywordArgs,
      argsAndKwargs,
      lambdaFunctions,
      higherOrderFunctions,
      scopeAndClosures,
    ],
  },
  {
    module: dataStructuresModule,
    lessons: [
      tuples,
      dictionaries,
      sets,
      nestedDataStructures,
      choosingTheRightStructure,
    ],
  },
  {
    module: oopModule,
    lessons: [
      classesAndObjects,
      attributesAndMethods,
      inheritance,
      encapsulationAndProperties,
      specialMethods,
    ],
  },
  {
    module: errorHandlingModule,
    lessons: [
      exceptionsAndTryExcept,
      raisingExceptions,
      readingAndWritingFiles,
      workingWithPaths,
    ],
  },
  {
    module: pythonDsToolsModule,
    lessons: [
      packageManagement,
      numpyOperations,
      datesAndTimes,
      regexForData,
      projectPythonPipeline,
    ],
  },
]);
