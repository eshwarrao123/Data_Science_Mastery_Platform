import type { ModuleMeta } from "@/lib/curriculum/types";

export const cleaningModule: ModuleMeta = {
  id: "data-analysis.cleaning",
  slug: "cleaning",
  title: "Data Cleaning",
  description:
    "Diagnose and treat nulls, duplicates, bad types, messy strings, and outliers — the work that makes every downstream analysis trustworthy.",
  lessonOrder: [
    "common-data-quality-issues",
    "detecting-handling-nulls",
    "deduplication",
    "type-coercion",
    "string-cleaning",
    "outlier-detection",
  ],
};
