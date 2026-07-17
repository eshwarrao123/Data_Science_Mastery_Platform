# Domain 4 — Data Analysis

| Field | Value |
|---|---|
| Course slug | `data-analysis` |
| Order | 4 |
| Category | Data Analysis |
| Difficulty | Beginner → Intermediate |
| Estimated hours | 18 |
| Prerequisites | Python foundations + control flow + NumPy |

The pandas core of the curriculum: load, select, clean, transform, and explore
tabular data until EDA is second nature.

## Learning outcomes

- Build and inspect DataFrames; select with loc/iloc/boolean masks
- Diagnose and treat nulls, duplicates, bad types, and outliers
- Aggregate with groupby; reshape with pivot/melt; combine with merge
- Run a disciplined EDA from univariate to multivariate
- Deliver a full EDA report on a real dataset

## Modules

| Order | Slug | Title |
|---|---|---|
| 1 | `pandas-core` | Pandas Core |
| 2 | `cleaning` | Data Cleaning |
| 3 | `transformation` | Data Transformation |
| 4 | `eda` | Exploratory Data Analysis |

## Lessons — module `pandas-core`

| # | Title | Slug | Difficulty | Time | XP | Prerequisite | Key concepts | Status |
|---|---|---|---|---|---|---|---|---|
| 4.1 | Pandas DataFrames | `pandas-dataframes` | Beginner | 40 min | 75 | `python.foundations.lists-vs-numpy-arrays` | DataFrame anatomy, read_csv, head/info/describe | implemented |
| 4.2 | Series & Index | `series-and-index` | Beginner | 30 min | 60 | `data-analysis.pandas-core.pandas-dataframes` | Series, index alignment, dtypes | implemented |
| 4.3 | Data Selection (loc, iloc, boolean masking) | `data-selection` | Beginner | 35 min | 70 | `data-analysis.pandas-core.series-and-index` | loc vs iloc, masks, chained-indexing trap | implemented |
| 4.4 | Adding & Modifying Columns | `adding-modifying-columns` | Beginner | 30 min | 60 | `data-analysis.pandas-core.data-selection` | derived columns, assign, vectorized ops | implemented |
| 4.5 | Handling Missing Data | `handling-missing-data` | Intermediate | 35 min | 70 | `data-analysis.pandas-core.adding-modifying-columns` | NaN, isna, dropna vs fillna trade-offs | implemented |
| 4.6 | Sorting & Ranking | `sorting-and-ranking` | Beginner | 25 min | 50 | `data-analysis.pandas-core.data-selection` | sort_values, rank, nlargest | implemented |

## Lessons — module `cleaning`

| # | Title | Slug | Difficulty | Time | XP | Prerequisite | Key concepts | Status |
|---|---|---|---|---|---|---|---|---|
| 4.7 | Common Data Quality Issues | `common-data-quality-issues` | Intermediate | 30 min | 70 | `data-analysis.pandas-core.handling-missing-data` | issue taxonomy, audit workflow | implemented |
| 4.8 | Detecting & Handling Nulls | `detecting-handling-nulls` | Intermediate | 35 min | 70 | `data-analysis.cleaning.common-data-quality-issues` | missingness patterns, imputation choices | implemented |
| 4.9 | Deduplication | `deduplication` | Intermediate | 25 min | 60 | `data-analysis.cleaning.detecting-handling-nulls` | duplicated, drop_duplicates, key choice | implemented |
| 4.10 | Data Type Coercion | `type-coercion` | Intermediate | 25 min | 60 | `data-analysis.cleaning.deduplication` | astype, to_numeric, to_datetime, category | implemented |
| 4.11 | String Cleaning | `string-cleaning` | Intermediate | 30 min | 70 | `data-analysis.cleaning.type-coercion` | .str accessor, normalization, extraction | implemented |
| 4.12 | Outlier Detection | `outlier-detection` | Intermediate | 35 min | 70 | `data-analysis.cleaning.string-cleaning` | IQR rule, z-scores, treat vs keep | implemented |

## Lessons — module `transformation`

| # | Title | Slug | Difficulty | Time | XP | Prerequisite | Key concepts | Status |
|---|---|---|---|---|---|---|---|---|
| 4.13 | GroupBy & Aggregation | `groupby-and-aggregation` | Intermediate | 35 min | 70 | `data-analysis.pandas-core.data-selection` | split-apply-combine, agg, named aggregation | implemented |
| 4.14 | Reshaping (pivot, melt, stack, unstack) | `reshaping-pivot-melt` | Intermediate | 35 min | 80 | `data-analysis.transformation.groupby-and-aggregation` | wide vs long, pivot_table, melt | implemented |
| 4.15 | Merging & Joining DataFrames | `merging-and-joining` | Intermediate | 35 min | 80 | `data-analysis.pandas-core.data-selection` | merge, join types, key hygiene | implemented |
| 4.16 | Window Functions (rolling, expanding) | `window-functions` | Intermediate | 30 min | 80 | `data-analysis.transformation.groupby-and-aggregation` | rolling, expanding, shift | implemented |
| 4.17 | Apply & Transform | `apply-and-transform` | Intermediate | 30 min | 70 | `data-analysis.transformation.groupby-and-aggregation` | apply, transform, vectorize-first mindset | implemented |

## Lessons — module `eda`

| # | Title | Slug | Difficulty | Time | XP | Prerequisite | Key concepts | Status |
|---|---|---|---|---|---|---|---|---|
| 4.18 | The EDA Workflow | `eda-workflow` | Intermediate | 30 min | 70 | `data-analysis.transformation.apply-and-transform` | question-driven EDA, structure, checklists | implemented |
| 4.19 | Univariate Analysis | `univariate-analysis` | Intermediate | 35 min | 70 | `data-analysis.eda.eda-workflow` | distributions per column, value_counts | implemented |
| 4.20 | Bivariate Analysis | `bivariate-analysis` | Intermediate | 35 min | 80 | `data-analysis.eda.univariate-analysis` | pairwise relationships, correlation, crosstabs | implemented |
| 4.21 | Multivariate Analysis | `multivariate-analysis` | Intermediate | 35 min | 80 | `data-analysis.eda.bivariate-analysis` | segmentation, interaction effects | implemented |
| 4.22 | 🏗 Project: EDA on a Real Dataset | `project-eda-real-dataset` | Intermediate | 90 min | 300 | `data-analysis.eda.multivariate-analysis` | full EDA report, insight communication | implemented |

Domain status: 22/22 implemented — domain complete and verified (2026-07-17). Exercise ID prefix: `pda01`–`pda22`
(existing `pandas-dataframes` lesson keeps its current IDs).
