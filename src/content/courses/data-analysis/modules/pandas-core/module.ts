import type { ModuleMeta } from "@/lib/curriculum/types";

export const pandasCoreModule: ModuleMeta = {
  id: "data-analysis.pandas-core",
  slug: "pandas-core",
  title: "Pandas Core",
  description:
    "DataFrames, Series, indexing, filtering, and the core pandas workflow.",
  lessonOrder: [
    "pandas-dataframes",
    "series-and-index",
    "data-selection",
    "adding-modifying-columns",
    "handling-missing-data",
    "sorting-and-ranking",
  ],
};
