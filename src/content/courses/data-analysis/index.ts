import { registerCourse } from "@/lib/curriculum/registry";
import { dataAnalysisCourse } from "./course";
import { pandasCoreModule } from "./modules/pandas-core/module";
import { pandasDataframes } from "./modules/pandas-core/lessons/pandas-dataframes";

registerCourse(dataAnalysisCourse, [
  { module: pandasCoreModule, lessons: [pandasDataframes] },
]);
