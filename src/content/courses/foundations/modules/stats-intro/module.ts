import type { ModuleMeta } from "@/lib/curriculum/types";

export const statsIntroModule: ModuleMeta = {
  id: "foundations.stats-intro",
  slug: "stats-intro",
  title: "Intro to Statistics",
  description:
    "Build the statistical intuition every data scientist needs — summarising data with averages, reading the shape of a distribution, and telling correlation apart from causation.",
  lessonOrder: [
    "mean-median-mode",
    "distributions-intuition",
    "correlation-vs-causation",
  ],
};
