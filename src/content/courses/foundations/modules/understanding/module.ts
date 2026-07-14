import type { ModuleMeta } from "@/lib/curriculum/types";

export const understandingModule: ModuleMeta = {
  id: "foundations.understanding",
  slug: "understanding",
  title: "Understanding Data",
  description:
    "Learn to read a table with confidence, name the parts of a dataset, judge data quality, and spot the bias that silently corrupts conclusions.",
  lessonOrder: [
    "reading-and-interpreting-data",
    "what-makes-a-dataset",
    "data-quality-basics",
    "bias-in-data",
  ],
};
