import type { ModuleMeta } from "@/lib/curriculum/types";

export const advancedModule: ModuleMeta = {
  id: "sql.advanced",
  slug: "advanced",
  title: "Advanced SQL",
  description:
    "Structure complex logic with subqueries, CTEs, window functions, CASE, and the string/date toolkit.",
  lessonOrder: [
    "subqueries",
    "ctes",
    "window-functions-sql",
    "case-statements",
    "string-and-date-functions",
  ],
};
