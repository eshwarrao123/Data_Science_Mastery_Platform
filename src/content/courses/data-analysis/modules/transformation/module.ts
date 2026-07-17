import type { ModuleMeta } from "@/lib/curriculum/types";

export const transformationModule: ModuleMeta = {
  id: "data-analysis.transformation",
  slug: "transformation",
  title: "Data Transformation",
  description:
    "Aggregate with groupby, reshape with pivot and melt, combine with merge, and window over ordered data — the operations that turn raw tables into answers.",
  lessonOrder: [
    "groupby-and-aggregation",
    "reshaping-pivot-melt",
    "merging-and-joining",
    "window-functions",
    "apply-and-transform",
  ],
};
