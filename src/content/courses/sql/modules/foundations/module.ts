import type { ModuleMeta } from "@/lib/curriculum/types";

export const foundationsModule: ModuleMeta = {
  id: "sql.foundations",
  slug: "foundations",
  title: "SQL Foundations",
  description:
    "From your first SELECT to grouped aggregations — the core query patterns every data role uses daily.",
  lessonOrder: [
    "what-is-a-database",
    "select-and-from",
    "where-and-filtering",
    "order-by-and-limit",
    "aggregate-functions",
    "group-by-and-having",
  ],
};
