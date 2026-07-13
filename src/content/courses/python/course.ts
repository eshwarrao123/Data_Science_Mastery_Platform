import type { CourseMeta } from "@/lib/curriculum/types";

export const pythonCourse: CourseMeta = {
  id: "python",
  slug: "python",
  title: "Python for Data Science",
  description:
    "Start from absolute zero. By the end you'll write clean, idiomatic Python that any data team would be proud of.",
  difficulty: "Beginner",
  estimatedHours: 18,
  category: "Programming",
  orderIndex: 1,
  moduleOrder: ["foundations"],
};
