/* ------------------------------------------------------------------ */
/*  Foundations & Data Literacy — Domain 1                              */
/*  Registers the course + all modules + lesson metadata.              */
/*  Lesson bodies (blocks) are authored in a later content pass.       */
/* ------------------------------------------------------------------ */

import { registerCourse } from "@/lib/curriculum/registry";
import { foundationsCourse } from "./course";

import { introModule } from "./modules/intro/module";
import { whatIsDataScience } from "./modules/intro/lessons/what-is-data-science";
import { typesOfData } from "./modules/intro/lessons/types-of-data";
import { theDsWorkflow } from "./modules/intro/lessons/the-ds-workflow";
import { toolsOfTheTrade } from "./modules/intro/lessons/tools-of-the-trade";

import { understandingModule } from "./modules/understanding/module";
import { readingAndInterpretingData } from "./modules/understanding/lessons/reading-and-interpreting-data";
import { whatMakesADataset } from "./modules/understanding/lessons/what-makes-a-dataset";
import { dataQualityBasics } from "./modules/understanding/lessons/data-quality-basics";
import { biasInData } from "./modules/understanding/lessons/bias-in-data";

import { statsIntroModule } from "./modules/stats-intro/module";
import { meanMedianMode } from "./modules/stats-intro/lessons/mean-median-mode";
import { distributionsIntuition } from "./modules/stats-intro/lessons/distributions-intuition";
import { correlationVsCausation } from "./modules/stats-intro/lessons/correlation-vs-causation";

import { foundationsProjectModule } from "./modules/project/module";
import { projectFirstDataset } from "./modules/project/lessons/project-first-dataset";

registerCourse(foundationsCourse, [
  {
    module: introModule,
    lessons: [whatIsDataScience, typesOfData, theDsWorkflow, toolsOfTheTrade],
  },
  {
    module: understandingModule,
    lessons: [
      readingAndInterpretingData,
      whatMakesADataset,
      dataQualityBasics,
      biasInData,
    ],
  },
  {
    module: statsIntroModule,
    lessons: [meanMedianMode, distributionsIntuition, correlationVsCausation],
  },
  {
    module: foundationsProjectModule,
    lessons: [projectFirstDataset],
  },
]);
