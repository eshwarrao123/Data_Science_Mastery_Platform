import type { Lesson } from "@/lib/curriculum/types";

/* Phase P2: metadata only. Lesson body (blocks) authored in a later phase. */
export const typeConversion: Lesson = {
  meta: {
    id: "python.foundations.type-conversion",
    slug: "type-conversion",
    title: "Type Conversion",
    description:
      "Convert between ints, floats, strings, and bools with int(), float(), and str() — the casts that turn raw file input into usable data.",
    estimatedTime: "20 mins",
    difficulty: "Beginner",
    xpReward: 40,
    prerequisites: ["python.foundations.operators-and-expressions"],
    masteryThreshold: 80,
  },

  blocks: [],
};
