import { registerCourse } from "@/lib/curriculum/registry";
import type { CourseMeta, ModuleMeta } from "@/lib/curriculum/types";
import { pandasDataframes } from "./modules/pandas-core/lessons/pandas-dataframes";

const dataAnalysisCourse: CourseMeta = {
  id: "data-analysis",
  slug: "data-analysis",
  title: "Data Analysis with Pandas",
  description:
    "The most important skill for a data scientist. Master DataFrames, data cleaning, EDA, and visualization.",
  difficulty: "Beginner",
  estimatedHours: 22,
  category: "Data Analysis",
  orderIndex: 2,
  moduleOrder: ["pandas-core"],
};

const pandasCoreModule: ModuleMeta = {
  id: "data-analysis.pandas-core",
  slug: "pandas-core",
  title: "Pandas Core",
  description:
    "DataFrames, Series, indexing, filtering, and the core pandas workflow.",
  lessonOrder: ["pandas-dataframes"],
};

registerCourse(dataAnalysisCourse, [
  { module: pandasCoreModule, lessons: [pandasDataframes] },
]);
