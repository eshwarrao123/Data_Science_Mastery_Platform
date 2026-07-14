import type { CourseMeta } from "@/lib/curriculum/types";

export const dataAnalysisCourse: CourseMeta = {
  id: "data-analysis",
  slug: "data-analysis",
  title: "Data Analysis with Pandas",
  description:
    "Master DataFrames, data cleaning, exploratory data analysis, and transformation — the daily toolkit of every practising data scientist.",
  difficulty: "Beginner",
  estimatedHours: 18,
  category: "Data Analysis",
  orderIndex: 4,
  moduleOrder: ["pandas-core"],
};
