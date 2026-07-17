import type { ModuleMeta } from "@/lib/curriculum/types";

export const analysisModule: ModuleMeta = {
  id: "sql.analysis",
  slug: "analysis",
  title: "SQL for Analysis",
  description:
    "Profiling queries, cohorts, and funnels — then a full end-to-end business analysis in pure SQL.",
  lessonOrder: ["sql-for-eda", "project-sql-business-analysis"],
};
