import type { ModuleMeta } from "@/lib/curriculum/types";

export const edaModule: ModuleMeta = {
  id: "data-analysis.eda",
  slug: "eda",
  title: "Exploratory Data Analysis",
  description:
    "Run a disciplined, question-driven EDA — univariate, bivariate, and multivariate — and finish with a full report on a real dataset.",
  lessonOrder: [
    "eda-workflow",
    "univariate-analysis",
    "bivariate-analysis",
    "multivariate-analysis",
    "project-eda-real-dataset",
  ],
};
