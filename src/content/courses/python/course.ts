import type { CourseMeta } from "@/lib/curriculum/types";

export const pythonCourse: CourseMeta = {
  id: "python",
  slug: "python",
  title: "Python for Data Science",
  description:
    "Start from absolute zero. By the end you'll write clean, idiomatic Python that any data team would be proud of.",
  difficulty: "Beginner",
  estimatedHours: 32,
  category: "Programming",
  orderIndex: 2,
  moduleOrder: [
    "foundations",
    "control-flow",
    "functions",
    "data-structures",
    "oop",
    "error-handling",
    "python-ds-tools",
  ],
};
