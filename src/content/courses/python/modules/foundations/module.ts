import type { ModuleMeta } from "@/lib/curriculum/types";

export const foundationsModule: ModuleMeta = {
  id: "python.foundations",
  slug: "foundations",
  title: "Python Foundations",
  description:
    "Variables, data types, and the building blocks that every Python program needs.",
  lessonOrder: [
    "variables-and-data-types",
    "strings-and-string-methods",
    "operators-and-expressions",
    "type-conversion",
    "lists-vs-numpy-arrays",
  ],
};
