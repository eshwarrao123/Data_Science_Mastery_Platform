import type { ModuleMeta } from "@/lib/curriculum/types";

export const joinsModule: ModuleMeta = {
  id: "sql.joins",
  slug: "joins",
  title: "Joins",
  description:
    "Combine tables with every join type and reason precisely about matched, unmatched, and duplicated rows.",
  lessonOrder: [
    "inner-join",
    "left-and-right-joins",
    "full-outer-join",
    "self-joins",
    "multiple-joins",
  ],
};
