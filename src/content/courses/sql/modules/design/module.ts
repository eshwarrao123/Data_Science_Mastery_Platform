import type { ModuleMeta } from "@/lib/curriculum/types";

export const designModule: ModuleMeta = {
  id: "sql.design",
  slug: "design",
  title: "Database Design",
  description:
    "Keys, relationships, normalization, indexes, and transactions — the schema-level thinking interviews probe.",
  lessonOrder: [
    "database-design-concepts",
    "normalization",
    "indexes-and-optimization",
    "transactions-and-acid",
  ],
};
