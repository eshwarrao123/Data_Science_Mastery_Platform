import type { CourseMeta } from "@/lib/curriculum/types";

export const foundationsCourse: CourseMeta = {
  id: "foundations",
  slug: "foundations",
  title: "Foundations & Data Literacy",
  description:
    "What data science actually is, how data works, and the statistical intuition every practitioner needs before writing a single line of code.",
  difficulty: "Beginner",
  estimatedHours: 8,
  category: "Foundations",
  orderIndex: 1,
  moduleOrder: ["intro", "understanding", "stats-intro", "project"],
};
