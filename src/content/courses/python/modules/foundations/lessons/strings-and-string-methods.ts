import type { Lesson } from "@/lib/curriculum/types";

/* Phase P2: metadata only. Lesson body (blocks) authored in a later phase. */
export const stringsAndStringMethods: Lesson = {
  meta: {
    id: "python.foundations.strings-and-string-methods",
    slug: "strings-and-string-methods",
    title: "Strings & String Methods",
    description:
      "Work with text in Python — slicing, formatting, and the string methods you'll reach for every time you clean a messy dataset.",
    estimatedTime: "30 mins",
    difficulty: "Beginner",
    xpReward: 50,
    prerequisites: ["python.foundations.variables-and-data-types"],
    masteryThreshold: 80,
  },

  blocks: [],
};
