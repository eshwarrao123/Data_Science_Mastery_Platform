# Domain 1 — Foundations & Data Literacy

| Field | Value |
|---|---|
| Course slug | `foundations` |
| Order | 1 |
| Category | Foundations |
| Difficulty | Beginner |
| Estimated hours | 8 |
| Prerequisites | None — this is the entry point |

Data literacy before code. The learner finishes able to read a dataset,
question its quality, and reason about basic statistics — with no programming
required yet.

## Learning outcomes

- Explain what data science is and walk the standard workflow end to end
- Distinguish data types (numerical, categorical, ordinal, time series, text)
- Read a tabular dataset: rows as observations, columns as variables
- Audit a dataset for quality issues, missingness, and bias
- Use mean, median, and mode appropriately; recognize distribution shapes
- Explain why correlation does not imply causation

## Modules

| Order | Slug | Title |
|---|---|---|
| 1 | `intro` | What Is Data Science |
| 2 | `understanding` | Understanding Data |
| 3 | `stats-intro` | Intro to Statistics |
| 4 | `project` | Foundations Project |

## Lessons — module `intro`

| # | Title | Slug | Difficulty | Time | XP | Prerequisite | Key concepts | Status |
|---|---|---|---|---|---|---|---|---|
| 1.1 | What Is Data Science? | `what-is-data-science` | Beginner | 15 min | 40 | — | data science roles, DS vs BI vs ML, real applications | implemented |
| 1.2 | Types of Data | `types-of-data` | Beginner | 20 min | 40 | `foundations.intro.what-is-data-science` | numerical, categorical, ordinal, time series, text | implemented |
| 1.3 | The Data Science Workflow | `the-ds-workflow` | Beginner | 20 min | 40 | `foundations.intro.types-of-data` | question → collect → clean → explore → model → communicate | implemented |
| 1.4 | Tools of the Trade | `tools-of-the-trade` | Beginner | 20 min | 40 | `foundations.intro.the-ds-workflow` | Python, notebooks, SQL, spreadsheets, BI tools | implemented |

## Lessons — module `understanding`

| # | Title | Slug | Difficulty | Time | XP | Prerequisite | Key concepts | Status |
|---|---|---|---|---|---|---|---|---|
| 1.5 | Reading & Interpreting Data | `reading-and-interpreting-data` | Beginner | 25 min | 50 | `foundations.intro.types-of-data` | rows/columns, unit of observation, summary reading | implemented |
| 1.6 | What Makes a Dataset? | `what-makes-a-dataset` | Beginner | 20 min | 40 | `foundations.understanding.reading-and-interpreting-data` | tidy data, schema, keys, granularity | implemented |
| 1.7 | Data Quality Basics | `data-quality-basics` | Beginner | 25 min | 50 | `foundations.understanding.what-makes-a-dataset` | missing values, duplicates, outliers, validity | implemented |
| 1.8 | Bias in Data | `bias-in-data` | Beginner | 25 min | 50 | `foundations.understanding.data-quality-basics` | selection bias, survivorship, measurement bias | implemented |

## Lessons — module `stats-intro`

| # | Title | Slug | Difficulty | Time | XP | Prerequisite | Key concepts | Status |
|---|---|---|---|---|---|---|---|---|
| 1.9 | Mean, Median, and Mode | `mean-median-mode` | Beginner | 25 min | 50 | `foundations.understanding.reading-and-interpreting-data` | central tendency, outlier sensitivity, choosing a measure | implemented |
| 1.10 | Distributions — An Intuition | `distributions-intuition` | Beginner | 25 min | 50 | `foundations.stats-intro.mean-median-mode` | shape, spread, skew, normal curve intuition | implemented |
| 1.11 | Correlation Is Not Causation | `correlation-vs-causation` | Beginner | 20 min | 50 | `foundations.stats-intro.distributions-intuition` | correlation, confounders, spurious relationships | implemented |

## Lessons — module `project`

| # | Title | Slug | Difficulty | Time | XP | Prerequisite | Key concepts | Status |
|---|---|---|---|---|---|---|---|---|
| 1.12 | 🏗 Project: Explore Your First Dataset | `project-first-dataset` | Beginner | 45 min | 150 | `foundations.stats-intro.correlation-vs-causation` | quality audit, summary statistics, stakeholder summary | implemented |

Domain status: **complete** — 12/12 implemented. Exercise ID prefix: `fnd01`–`fnd12`.
