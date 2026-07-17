import type { CourseMeta } from "@/lib/curriculum/types";

export const sqlCourse: CourseMeta = {
  id: "sql",
  slug: "sql",
  title: "SQL & Databases",
  description:
    "Query, aggregate, join, and design relational databases. The language every data professional uses every day.",
  difficulty: "Beginner",
  estimatedHours: 16,
  category: "Databases",
  orderIndex: 5,
  moduleOrder: ["foundations", "joins", "advanced", "design", "analysis"],
};
