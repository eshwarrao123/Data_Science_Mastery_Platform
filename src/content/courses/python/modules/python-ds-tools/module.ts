import type { ModuleMeta } from "@/lib/curriculum/types";

export const pythonDsToolsModule: ModuleMeta = {
  id: "python.python-ds-tools",
  slug: "python-ds-tools",
  title: "Python for Data Science",
  description:
    "Bridge core Python to the data stack — packages, NumPy arrays, dates, and regex — then tie it all together in a first end-to-end pipeline project.",
  lessonOrder: [
    "package-management",
    "numpy-operations",
    "dates-and-times",
    "regex-for-data",
    "project-python-pipeline",
  ],
};
