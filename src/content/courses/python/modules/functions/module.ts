import type { ModuleMeta } from "@/lib/curriculum/types";

export const functionsModule: ModuleMeta = {
  id: "python.functions",
  slug: "functions",
  title: "Functions",
  description:
    "Package logic into reusable, testable functions — the unit of abstraction every data pipeline and transformation is built from.",
  lessonOrder: [
    "defining-functions",
    "parameters-and-return-values",
    "default-and-keyword-args",
    "args-and-kwargs",
    "lambda-functions",
    "higher-order-functions",
    "scope-and-closures",
  ],
};
