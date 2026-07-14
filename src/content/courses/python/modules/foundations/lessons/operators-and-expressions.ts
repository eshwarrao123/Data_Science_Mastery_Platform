import type { Lesson } from "@/lib/curriculum/types";

/* Phase P2: metadata only. Lesson body (blocks) authored in a later phase. */
export const operatorsAndExpressions: Lesson = {
  meta: {
    id: "python.foundations.operators-and-expressions",
    slug: "operators-and-expressions",
    title: "Operators & Expressions",
    description:
      "Combine values with arithmetic, comparison, and logical operators — the expressions that drive every calculation and filter in data work.",
    estimatedTime: "25 mins",
    difficulty: "Beginner",
    xpReward: 50,
    prerequisites: ["python.foundations.variables-and-data-types"],
    masteryThreshold: 80,
  },

  blocks: [],
};
