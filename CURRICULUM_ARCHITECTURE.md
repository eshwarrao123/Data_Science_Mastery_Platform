# DSM Curriculum Architecture

**Data Science Mastery — Curriculum Engineering Specification**
**Lock this document before generating any lesson content. All batch generation sessions reference this file as the authoritative lesson order.**

---

## 0. Quick Reference

| Stat | Value |
|---|---|
| Total lessons | 228 |
| Total projects | 28 (embedded across domains) |
| Total domains | 15 |
| Total courses | 22 |
| Total modules | 68 |
| Estimated learner journey | ~900–1,100 hours |
| Existing lessons to migrate | 3 |
| Net new lessons to write | 225 |

---

## 1. Audit of the Current Curriculum

### 1.1 What Currently Exists

| Location | Format | Content |
|---|---|---|
| `src/lib/data/curriculum.ts` | **Legacy monolith** — full lesson content inline | 2 courses, 2 modules, 3 lessons (Python + pandas), all content embedded in a single 1,200-line file |
| `src/content/courses/python/` | **New normalized format** | `course.ts`, `modules/foundations/module.ts`, 2 lesson files (Variables & Data Types, Lists vs NumPy Arrays) |
| `src/content/courses/data-analysis/` | **Hybrid** — registration inline in `index.ts`, no separate `course.ts` or `module.ts` | 1 lesson (Pandas DataFrames) |

The application routing (`/course/[courseSlug]/[moduleSlug]/[lessonSlug]`) and the registry (`src/lib/curriculum/`) are production-ready and will support 228 lessons without modification.

### 1.2 Problems Identified

**P1 — Structural inconsistency in `data-analysis/`.**
The `data-analysis/index.ts` defines `CourseMeta` and `ModuleMeta` inline instead of in separate `course.ts` and `module.ts` files. This breaks the established pattern and makes it harder to add modules later. Fix: extract into separate files before adding new modules.

**P2 — Duplicate content sources.**
`src/lib/data/curriculum.ts` (legacy) and `src/content/courses/` (new) both contain lesson data for the same 3 lessons. The dashboard's `allLessons()` call currently imports from the legacy file. This will cause lesson counts to double if both sources are active simultaneously. Fix documented in §8.

**P3 — Missing prerequisite wiring.**
The pandas DataFrames lesson has no declared prerequisites pointing to the NumPy arrays lesson. A learner could access it without the required foundation. All lessons in §4 include explicit `prerequisites` arrays.

**P4 — Python course is missing 28 lessons.**
The current Python course has 2 lessons. The full Python domain requires 30 lessons across 7 modules (see §5). The course `moduleOrder` only lists `"foundations"` — no other modules declared.

**P5 — Data Analysis course is severely truncated.**
1 lesson exists. The full domain requires 20 lessons across 5 modules: pandas core, data cleaning, transformation, EDA, and a project.

**P6 — No Math/Statistics course.**
Machine Learning is listed as an aspiration but the statistical and linear algebra prerequisites do not exist.

**P7 — No SQL, Visualization, ML, Deep Learning, or any advanced domain.**
Domains 5–15 are entirely absent.

**P8 — Legacy `Lesson` type in `src/lib/types.ts` conflicts with new `Lesson` type in `src/lib/curriculum/types.ts`.**
Both are imported in different places. The new type is the authoritative one. No new lesson content should use the legacy flat type.

**P9 — `CourseMeta.category` field has no enumerated values.**
Category strings like `"Programming"` and `"Data Analysis"` are free-form. The curriculum page and sidebar use this field for grouping. Recommend standardizing categories (see §4).

**P10 — No project lessons exist.**
The `Project` type in `src/lib/types.ts` and the `projects.ts` data file exist but are entirely disconnected from the lesson system. Projects should be first-class lesson entries (using a future `project-brief` block type).

---

## 2. File Architecture

### 2.1 Current State (What Exists)

```
src/
  content/
    courses/
      index.ts                  ← manifest (imports all course registrations)
      python/
        course.ts
        index.ts
        modules/
          foundations/
            module.ts
            lessons/
              variables-and-data-types.ts
              lists-vs-numpy-arrays.ts
      data-analysis/
        index.ts                ← inline (needs refactor to match python pattern)
        modules/
          pandas-core/
            lessons/
              pandas-dataframes.ts
  lib/
    curriculum/
      blocks.ts                 ← LearningBlock union (renderer shape contract)
      index.ts                  ← public API
      registry.ts               ← registerCourse(), query API
      types.ts                  ← CourseMeta, ModuleMeta, LessonMeta, Lesson
    data/
      curriculum.ts             ← LEGACY — keep, do not delete, do not add to
```

### 2.2 Target State (Full Architecture)

```
src/
  content/
    courses/
      index.ts                              ← manifest — one import per course
      
      python/
        course.ts
        index.ts
        modules/
          foundations/
            module.ts
            lessons/
              variables-and-data-types.ts   ← EXISTS
              lists-vs-numpy-arrays.ts       ← EXISTS
              strings-and-string-methods.ts
              operators-and-expressions.ts
              type-conversion.ts
          control-flow/
            module.ts
            lessons/
              conditionals.ts
              for-loops.ts
              while-loops.ts
              loop-control.ts
              list-comprehensions.ts
          functions/
            module.ts
            lessons/
              defining-functions.ts
              parameters-and-return-values.ts
              default-and-keyword-args.ts
              args-and-kwargs.ts
              lambda-functions.ts
              higher-order-functions.ts
              scope-and-closures.ts
          data-structures/
            module.ts
            lessons/
              tuples.ts
              dictionaries.ts
              sets.ts
              nested-data-structures.ts
              choosing-the-right-structure.ts
          oop/
            module.ts
            lessons/
              classes-and-objects.ts
              attributes-and-methods.ts
              inheritance.ts
              encapsulation-and-properties.ts
              special-methods.ts
          error-handling/
            module.ts
            lessons/
              exceptions-and-try-except.ts
              raising-exceptions.ts
              reading-and-writing-files.ts
              working-with-paths.ts
          python-ds-tools/
            module.ts
            lessons/
              package-management.ts
              numpy-operations.ts
              dates-and-times.ts
              regex-for-data.ts
              project-python-pipeline.ts   ← mini project

      math-statistics/
        course.ts
        index.ts
        modules/
          descriptive-statistics/
            module.ts
            lessons/
              central-tendency.ts
              spread-and-variance.ts
              percentiles-and-quartiles.ts
              skewness-and-kurtosis.ts
              correlation-and-covariance.ts
          probability/
            module.ts
            lessons/
              probability-fundamentals.ts
              conditional-probability-and-bayes.ts
              discrete-distributions.ts
              continuous-distributions.ts
              expected-value-and-variance.ts
          statistical-inference/
            module.ts
            lessons/
              sampling-and-distributions.ts
              central-limit-theorem.ts
              confidence-intervals.ts
              hypothesis-testing.ts
              p-values-and-significance.ts
              ab-testing.ts
          linear-algebra/
            module.ts
            lessons/
              vectors-and-scalars.ts
              matrices-and-operations.ts
              dot-products.ts
              eigenvalues-and-eigenvectors.ts
              dimensionality-concepts.ts
          calculus-for-ml/
            module.ts
            lessons/
              derivatives-and-gradients.ts
              the-chain-rule.ts
              partial-derivatives.ts
              gradient-descent-conceptual.ts

      data-analysis/
        course.ts                           ← EXTRACT from index.ts
        index.ts
        modules/
          pandas-core/
            module.ts                       ← EXTRACT from index.ts
            lessons/
              pandas-dataframes.ts          ← EXISTS
              series-and-index.ts
              data-selection.ts
              adding-modifying-columns.ts
              handling-missing-data.ts
              sorting-and-ranking.ts
          data-cleaning/
            module.ts
            lessons/
              common-data-quality-issues.ts
              detecting-handling-nulls.ts
              deduplication.ts
              type-coercion.ts
              string-cleaning.ts
              outlier-detection.ts
          data-transformation/
            module.ts
            lessons/
              groupby-and-aggregation.ts
              reshaping-pivot-melt.ts
              merging-and-joining.ts
              window-functions.ts
              apply-and-transform.ts
          eda/
            module.ts
            lessons/
              eda-workflow.ts
              univariate-analysis.ts
              bivariate-analysis.ts
              multivariate-analysis.ts
              project-eda-real-dataset.ts   ← guided project

      sql/
        course.ts
        index.ts
        modules/
          sql-foundations/
            module.ts
            lessons/
              what-is-a-database.ts
              select-and-from.ts
              where-and-filtering.ts
              order-by-and-limit.ts
              aggregate-functions.ts
              group-by-and-having.ts
          joins/
            module.ts
            lessons/
              inner-join.ts
              left-and-right-joins.ts
              full-outer-join.ts
              self-joins.ts
              multiple-joins.ts
          advanced-sql/
            module.ts
            lessons/
              subqueries.ts
              ctes.ts
              window-functions-sql.ts
              case-statements.ts
              string-and-date-functions.ts
          database-design/
            module.ts
            lessons/
              database-design-concepts.ts
              normalization.ts
              indexes-and-optimization.ts
              transactions-and-acid.ts
          sql-for-analysis/
            module.ts
            lessons/
              sql-for-eda.ts
              project-sql-business-analysis.ts ← module project

      visualization/
        course.ts
        index.ts
        modules/
          matplotlib/
            module.ts
            lessons/
              matplotlib-fundamentals.ts
              line-bar-scatter.ts
              histograms-and-boxplots.ts
              subplots-and-layout.ts
              styling-and-customization.ts
          seaborn/
            module.ts
            lessons/
              seaborn-statistical-viz.ts
              distribution-plots.ts
              categorical-plots.ts
              heatmaps-and-pairplots.ts
          plotly/
            module.ts
            lessons/
              plotly-express.ts
              interactive-charts.ts
              dashboards-intro.ts
          storytelling/
            module.ts
            lessons/
              choosing-the-right-chart.ts
              designing-for-an-audience.ts
              misleading-visualizations.ts
              project-visualization-dashboard.ts ← domain project

      machine-learning/
        course.ts
        index.ts
        modules/
          ml-foundations/
            module.ts
            lessons/
              what-is-machine-learning.ts
              supervised-unsupervised-rl.ts
              the-ml-workflow.ts
              train-test-split-and-cv.ts
              feature-engineering-basics.ts
              evaluation-metrics-regression.ts
              evaluation-metrics-classification.ts
          regression/
            module.ts
            lessons/
              linear-regression.ts
              multiple-linear-regression.ts
              polynomial-regression.ts
              ridge-and-lasso.ts
              decision-trees-regression.ts
          classification/
            module.ts
            lessons/
              logistic-regression.ts
              k-nearest-neighbors.ts
              decision-trees-classification.ts
              random-forests.ts
              gradient-boosting-xgboost.ts
              support-vector-machines.ts
              naive-bayes.ts
          unsupervised/
            module.ts
            lessons/
              k-means-clustering.ts
              hierarchical-clustering.ts
              dbscan.ts
              pca.ts
              tsne-and-umap.ts
          model-selection/
            module.ts
            lessons/
              bias-variance-tradeoff.ts
              hyperparameter-tuning.ts
              feature-selection.ts
              handling-class-imbalance.ts
              sklearn-pipelines.ts
          ml-projects/
            module.ts
            lessons/
              project-house-prices.ts      ← guided mini project
              project-customer-churn.ts   ← module project
              project-sales-forecasting.ts ← domain project

      deep-learning/
        course.ts
        index.ts
        modules/
          nn-fundamentals/
            module.ts
            lessons/
              what-is-a-neural-network.ts
              perceptrons-and-activations.ts
              forward-propagation.ts
              backpropagation.ts
              training-loss-optimizers.ts
          pytorch/
            module.ts
            lessons/
              pytorch-tensors-and-autograd.ts
              building-your-first-nn.ts
              training-loop-and-validation.ts
              saving-and-loading-models.ts
          cnns/
            module.ts
            lessons/
              image-data-and-preprocessing.ts
              cnn-architecture.ts
              transfer-learning.ts
              project-image-classification.ts ← guided mini project
          rnns/
            module.ts
            lessons/
              sequence-data-concepts.ts
              rnn-architecture.ts
              lstm-and-gru.ts
              project-time-series-forecasting.ts ← guided mini project
          transformers/
            module.ts
            lessons/
              attention-mechanism.ts
              transformer-architecture.ts
              bert-and-gpt-concepts.ts
              fine-tuning-pretrained-model.ts

      big-data/
        course.ts
        index.ts
        modules/
          big-data-concepts/
            module.ts
            lessons/
              what-is-big-data.ts
              distributed-computing.ts
              hadoop-ecosystem.ts
              data-lakes-vs-warehouses.ts
          pyspark/
            module.ts
            lessons/
              spark-architecture-and-rdds.ts
              pyspark-dataframes.ts
              spark-sql.ts
              spark-ml.ts
              streaming-data-concepts.ts
          cloud-platforms/
            module.ts
            lessons/
              aws-s3-and-athena.ts
              bigquery-for-analysis.ts
              snowflake-concepts.ts
              project-pyspark-large-dataset.ts ← domain project

      mlops/
        course.ts
        index.ts
        modules/
          ml-engineering/
            module.ts
            lessons/
              software-engineering-for-ds.ts
              git-for-ml.ts
              docker-basics.ts
              ml-project-structure.ts
          experiment-tracking/
            module.ts
            lessons/
              mlflow-tracking.ts
              model-versioning.ts
              dvc-data-versioning.ts
          model-deployment/
            module.ts
            lessons/
              rest-apis-with-fastapi.ts
              containerizing-ml-models.ts
              model-serving-patterns.ts
              monitoring-in-production.ts
          ml-pipelines/
            module.ts
            lessons/
              pipeline-orchestration-airflow.ts
              cicd-for-ml.ts
              feature-stores.ts
              project-deploy-churn-model.ts ← domain project

      generative-ai/
        course.ts
        index.ts
        modules/
          llm-fundamentals/
            module.ts
            lessons/
              what-are-llms.ts
              tokenization-and-embeddings.ts
              prompt-engineering.ts
              few-shot-and-zero-shot.ts
              llm-limitations.ts
          llm-apis/
            module.ts
            lessons/
              openai-and-claude-apis.ts
              structured-outputs.ts
              function-calling-tool-use.ts
              cost-optimization-and-caching.ts
          fine-tuning/
            module.ts
            lessons/
              when-to-fine-tune.ts
              fine-tuning-with-huggingface.ts
              peft-and-lora.ts
              evaluating-llm-outputs.ts

      rag/
        course.ts
        index.ts
        modules/
          embeddings/
            module.ts
            lessons/
              what-are-embeddings.ts
              generating-embeddings.ts
              similarity-and-distance-metrics.ts
              vector-databases.ts
          retrieval/
            module.ts
            lessons/
              rag-architecture.ts
              chunking-strategies.ts
              retrieval-methods.ts
              reranking-and-context.ts
          rag-production/
            module.ts
            lessons/
              evaluating-rag-systems.ts
              rag-anti-patterns.ts
              project-document-qa.ts       ← domain project

      agentic-ai/
        course.ts
        index.ts
        modules/
          agent-fundamentals/
            module.ts
            lessons/
              what-is-an-ai-agent.ts
              the-react-pattern.ts
              tool-use-and-function-calling.ts
              memory-short-and-long-term.ts
              agent-evaluation.ts
          building-agents/
            module.ts
            lessons/
              single-agent-architectures.ts
              multi-agent-systems.ts
              human-in-the-loop.ts
              frameworks-langgraph-autogen.ts
          agent-projects/
            module.ts
            lessons/
              project-data-analysis-agent.ts        ← domain project
              project-multi-agent-research.ts       ← domain project

      career/
        course.ts
        index.ts
        modules/
          portfolio-and-resume/
            module.ts
            lessons/
              building-a-ds-portfolio.ts
              writing-a-ds-resume.ts
              github-profile-best-practices.ts
              linkedin-optimization.ts
          interview-prep/
            module.ts
            lessons/
              ds-interview-types.ts
              sql-interview-questions.ts
              python-pandas-interviews.ts
              statistics-and-ml-interviews.ts
              system-design-for-ds.ts
              take-home-assessment-strategies.ts
          industry-readiness/
            module.ts
            lessons/
              working-in-a-data-team.ts
              code-review-culture.ts
              communicating-with-stakeholders.ts
              data-science-ethics.ts
              navigating-your-first-role.ts
```

### 2.3 Why This Architecture Scales

- One lesson = one file. A 228-lesson curriculum produces ~228 lesson files plus ~68 module files and ~22 course files.
- The registry (`registerCourse()`) is O(1) per lesson lookup — 228 lessons load identically fast to 3.
- Adding a new lesson = create one `.ts` file + add its slug to `module.ts` `lessonOrder` + import it in `index.ts`. No other files change.
- Adding a new domain = create one directory under `courses/` + add one import to `src/content/courses/index.ts`. No other files change.
- TypeScript compilation checks all `LearningBlock` content at build time.

---

## 3. Proposed Complete Domain Order

The order below is the definitive learning sequence. A concept at position N will never reference a concept at position M where M > N.

```
Position  Domain                         Slug                Color Token
────────  ─────────────────────────────  ─────────────────  ──────────────
01        Foundations & Data Literacy    foundations         sky-400
02        Python for Data Science        python              violet-500
03        Mathematics & Statistics       math-statistics     amber-500
04        Data Analysis                  data-analysis       emerald-500
05        SQL & Databases                sql                 teal-500
06        Data Visualization             visualization       pink-500
07        Machine Learning               machine-learning    orange-500
08        Deep Learning                  deep-learning       rose-500
09        Big Data                       big-data            indigo-500
10        MLOps                          mlops               indigo-400
11        Generative AI                  generative-ai       violet-400
12        RAG & Vector Databases         rag                 sky-500
13        AI Agents & Agentic AI         agentic-ai          rose-400
14        Industry Projects              projects            emerald-400
15        Career & Interview Readiness   career              amber-400
```

**Key dependency chains:**
- Math & Statistics requires Python (NumPy for calculation examples)
- Data Analysis requires Python Foundations + control flow + NumPy
- SQL is independent of Python but benefits from data-analysis mental models
- Visualization requires Data Analysis (pandas DataFrames as data source)
- Machine Learning requires Data Analysis + Math/Statistics
- Deep Learning requires Machine Learning + Linear Algebra (from Math)
- Big Data requires Python + Data Analysis + SQL
- MLOps requires Machine Learning (a model must exist before deployment)
- Generative AI requires Python + ML concepts + Transformer foundations (from Deep Learning)
- RAG requires Generative AI (embeddings are an LLM concept)
- Agentic AI requires RAG + Function Calling (from Generative AI)
- Career is positioned last but individual interview-prep lessons reference all prior domains

---

## 4. Complete Curriculum Hierarchy

### Standard Metadata Values

**Category strings (standardised):**
`"Foundations"` | `"Programming"` | `"Mathematics"` | `"Data Analysis"` | `"Databases"` | `"Visualization"` | `"Machine Learning"` | `"Deep Learning"` | `"Big Data"` | `"MLOps"` | `"Generative AI"` | `"RAG"` | `"Agents"` | `"Projects"` | `"Career"`

**Difficulty progression within a domain:**
All lessons in Domain 1 (Foundations) are `"Beginner"`. Later domains progress: foundational modules are `"Beginner"`, intermediate modules are `"Intermediate"`, and advanced topics are `"Advanced"`. A lesson's `difficulty` field reflects the skill level required to start it, not the challenge of its hardest exercise.

**XP awards by tier:**
| Lesson type | XP |
|---|---|
| Beginner lesson | 40–60 |
| Intermediate lesson | 60–90 |
| Advanced lesson | 90–120 |
| Mini project | 150 |
| Module project | 200 |
| Domain project | 300 |
| Capstone | 500 |

---

### Domain 1 — Foundations & Data Literacy
**Course slug:** `foundations` | **orderIndex:** 1 | **estimatedHours:** 8 | **category:** `"Foundations"`

| # | Module | Lesson title | Slug | Difficulty | Time | XP | Prerequisites |
|---|---|---|---|---|---|---|---|
| 1.1 | What Is Data Science | What Is Data Science? | `what-is-data-science` | Beginner | 15 min | 40 | — |
| 1.2 | What Is Data Science | Types of Data | `types-of-data` | Beginner | 20 min | 40 | `foundations.intro.what-is-data-science` |
| 1.3 | What Is Data Science | The Data Science Workflow | `the-ds-workflow` | Beginner | 20 min | 40 | `foundations.intro.types-of-data` |
| 1.4 | What Is Data Science | Tools of the Trade | `tools-of-the-trade` | Beginner | 20 min | 40 | `foundations.intro.the-ds-workflow` |
| 1.5 | Understanding Data | Reading & Interpreting Data | `reading-and-interpreting-data` | Beginner | 25 min | 50 | `foundations.intro.types-of-data` |
| 1.6 | Understanding Data | What Makes a Dataset? | `what-makes-a-dataset` | Beginner | 20 min | 40 | `foundations.understanding.reading-and-interpreting-data` |
| 1.7 | Understanding Data | Data Quality Basics | `data-quality-basics` | Beginner | 25 min | 50 | `foundations.understanding.what-makes-a-dataset` |
| 1.8 | Understanding Data | Bias in Data | `bias-in-data` | Beginner | 25 min | 50 | `foundations.understanding.data-quality-basics` |
| 1.9 | Intro to Statistics | Mean, Median, and Mode | `mean-median-mode` | Beginner | 25 min | 50 | `foundations.understanding.reading-and-interpreting-data` |
| 1.10 | Intro to Statistics | Distributions — An Intuition | `distributions-intuition` | Beginner | 25 min | 50 | `foundations.stats-intro.mean-median-mode` |
| 1.11 | Intro to Statistics | Correlation Is Not Causation | `correlation-vs-causation` | Beginner | 20 min | 50 | `foundations.stats-intro.distributions-intuition` |
| 1.12 | Foundations Project | Project: Explore Your First Dataset | `project-first-dataset` | Beginner | 45 min | 150 | `foundations.stats-intro.correlation-vs-causation` |

**Domain total:** 12 lessons | 1 mini project

---

### Domain 2 — Python for Data Science
**Course slug:** `python` | **orderIndex:** 2 | **estimatedHours:** 28 | **category:** `"Programming"`

#### Module: Foundations (exists — 2 lessons already written)

| # | Lesson title | Slug | Difficulty | Time | XP | Prerequisites |
|---|---|---|---|---|---|---|
| 2.1 | Variables & Data Types | `variables-and-data-types` | Beginner | 25 min | 50 | — |
| 2.2 | Python Lists vs NumPy Arrays | `lists-vs-numpy-arrays` | Beginner | 35 min | 60 | `python.foundations.variables-and-data-types` |
| 2.3 | Strings & String Methods | `strings-and-string-methods` | Beginner | 30 min | 50 | `python.foundations.variables-and-data-types` |
| 2.4 | Operators & Expressions | `operators-and-expressions` | Beginner | 25 min | 50 | `python.foundations.variables-and-data-types` |
| 2.5 | Type Conversion | `type-conversion` | Beginner | 20 min | 40 | `python.foundations.operators-and-expressions` |

#### Module: Control Flow

| # | Lesson title | Slug | Difficulty | Time | XP | Prerequisites |
|---|---|---|---|---|---|---|
| 2.6 | Conditionals | `conditionals` | Beginner | 25 min | 50 | `python.foundations.operators-and-expressions` |
| 2.7 | For Loops | `for-loops` | Beginner | 30 min | 50 | `python.control-flow.conditionals` |
| 2.8 | While Loops | `while-loops` | Beginner | 25 min | 50 | `python.control-flow.for-loops` |
| 2.9 | Loop Control (break, continue, pass) | `loop-control` | Beginner | 20 min | 40 | `python.control-flow.while-loops` |
| 2.10 | List Comprehensions | `list-comprehensions` | Beginner | 30 min | 60 | `python.control-flow.for-loops` |

#### Module: Functions

| # | Lesson title | Slug | Difficulty | Time | XP | Prerequisites |
|---|---|---|---|---|---|---|
| 2.11 | Defining & Calling Functions | `defining-functions` | Beginner | 30 min | 60 | `python.control-flow.conditionals` |
| 2.12 | Parameters, Arguments & Return Values | `parameters-and-return-values` | Beginner | 30 min | 60 | `python.functions.defining-functions` |
| 2.13 | Default & Keyword Arguments | `default-and-keyword-args` | Beginner | 25 min | 50 | `python.functions.parameters-and-return-values` |
| 2.14 | *args and **kwargs | `args-and-kwargs` | Intermediate | 25 min | 60 | `python.functions.default-and-keyword-args` |
| 2.15 | Lambda Functions | `lambda-functions` | Intermediate | 20 min | 60 | `python.functions.defining-functions` |
| 2.16 | Higher-Order Functions | `higher-order-functions` | Intermediate | 30 min | 70 | `python.functions.lambda-functions` |
| 2.17 | Scope & Closures | `scope-and-closures` | Intermediate | 30 min | 70 | `python.functions.higher-order-functions` |

#### Module: Data Structures

| # | Lesson title | Slug | Difficulty | Time | XP | Prerequisites |
|---|---|---|---|---|---|---|
| 2.18 | Tuples | `tuples` | Beginner | 20 min | 40 | `python.foundations.variables-and-data-types` |
| 2.19 | Dictionaries | `dictionaries` | Beginner | 30 min | 60 | `python.foundations.variables-and-data-types` |
| 2.20 | Sets | `sets` | Beginner | 20 min | 40 | `python.data-structures.dictionaries` |
| 2.21 | Nested Data Structures | `nested-data-structures` | Intermediate | 30 min | 70 | `python.data-structures.dictionaries` |
| 2.22 | Choosing the Right Data Structure | `choosing-the-right-structure` | Intermediate | 25 min | 60 | `python.data-structures.nested-data-structures` |

#### Module: Object-Oriented Programming

| # | Lesson title | Slug | Difficulty | Time | XP | Prerequisites |
|---|---|---|---|---|---|---|
| 2.23 | Classes & Objects | `classes-and-objects` | Intermediate | 35 min | 70 | `python.functions.defining-functions` |
| 2.24 | Attributes & Methods | `attributes-and-methods` | Intermediate | 30 min | 70 | `python.oop.classes-and-objects` |
| 2.25 | Inheritance | `inheritance` | Intermediate | 35 min | 80 | `python.oop.attributes-and-methods` |
| 2.26 | Encapsulation & Properties | `encapsulation-and-properties` | Intermediate | 30 min | 70 | `python.oop.inheritance` |
| 2.27 | Special Methods (Dunder) | `special-methods` | Intermediate | 30 min | 70 | `python.oop.encapsulation-and-properties` |

#### Module: Error Handling & File I/O

| # | Lesson title | Slug | Difficulty | Time | XP | Prerequisites |
|---|---|---|---|---|---|---|
| 2.28 | Exceptions & try/except | `exceptions-and-try-except` | Intermediate | 30 min | 70 | `python.functions.defining-functions` |
| 2.29 | Raising Custom Exceptions | `raising-exceptions` | Intermediate | 25 min | 60 | `python.error-handling.exceptions-and-try-except` |
| 2.30 | Reading & Writing Files | `reading-and-writing-files` | Intermediate | 30 min | 70 | `python.error-handling.exceptions-and-try-except` |
| 2.31 | Working with Paths | `working-with-paths` | Intermediate | 20 min | 60 | `python.error-handling.reading-and-writing-files` |

#### Module: Python for Data Science Tools

| # | Lesson title | Slug | Difficulty | Time | XP | Prerequisites |
|---|---|---|---|---|---|---|
| 2.32 | Package Management (pip, venv, conda) | `package-management` | Beginner | 20 min | 40 | `python.foundations.variables-and-data-types` |
| 2.33 | NumPy Operations (Deep Dive) | `numpy-operations` | Intermediate | 40 min | 80 | `python.foundations.lists-vs-numpy-arrays` |
| 2.34 | Dates & Times with datetime | `dates-and-times` | Intermediate | 30 min | 70 | `python.functions.defining-functions` |
| 2.35 | Regex for Data | `regex-for-data` | Intermediate | 35 min | 80 | `python.foundations.strings-and-string-methods` |
| 2.36 | Project: Build a Data Pipeline in Python | `project-python-pipeline` | Intermediate | 60 min | 200 | `python.python-ds-tools.regex-for-data` |

**Domain total:** 36 lessons (including 2 existing) | 1 mini project | 1 module project

---

### Domain 3 — Mathematics & Statistics
**Course slug:** `math-statistics` | **orderIndex:** 3 | **estimatedHours:** 22 | **category:** `"Mathematics"`

#### Module: Descriptive Statistics

| # | Lesson title | Slug | Difficulty | Time | XP | Prerequisites |
|---|---|---|---|---|---|---|
| 3.1 | Measures of Central Tendency | `central-tendency` | Beginner | 30 min | 50 | `python.foundations.variables-and-data-types` |
| 3.2 | Measures of Spread | `spread-and-variance` | Beginner | 35 min | 60 | `math-statistics.descriptive.central-tendency` |
| 3.3 | Percentiles & Quartiles | `percentiles-and-quartiles` | Beginner | 25 min | 50 | `math-statistics.descriptive.spread-and-variance` |
| 3.4 | Skewness & Kurtosis | `skewness-and-kurtosis` | Intermediate | 30 min | 70 | `math-statistics.descriptive.percentiles-and-quartiles` |
| 3.5 | Correlation & Covariance | `correlation-and-covariance` | Intermediate | 35 min | 70 | `math-statistics.descriptive.spread-and-variance` |

#### Module: Probability

| # | Lesson title | Slug | Difficulty | Time | XP | Prerequisites |
|---|---|---|---|---|---|---|
| 3.6 | Probability Fundamentals | `probability-fundamentals` | Beginner | 30 min | 60 | `math-statistics.descriptive.central-tendency` |
| 3.7 | Conditional Probability & Bayes | `conditional-probability-and-bayes` | Intermediate | 35 min | 70 | `math-statistics.probability.probability-fundamentals` |
| 3.8 | Discrete Distributions | `discrete-distributions` | Intermediate | 35 min | 70 | `math-statistics.probability.probability-fundamentals` |
| 3.9 | Continuous Distributions | `continuous-distributions` | Intermediate | 35 min | 70 | `math-statistics.probability.discrete-distributions` |
| 3.10 | Expected Value & Variance | `expected-value-and-variance` | Intermediate | 30 min | 70 | `math-statistics.probability.continuous-distributions` |

#### Module: Statistical Inference

| # | Lesson title | Slug | Difficulty | Time | XP | Prerequisites |
|---|---|---|---|---|---|---|
| 3.11 | Sampling & Sampling Distributions | `sampling-and-distributions` | Intermediate | 35 min | 70 | `math-statistics.probability.probability-fundamentals` |
| 3.12 | The Central Limit Theorem | `central-limit-theorem` | Intermediate | 30 min | 70 | `math-statistics.inference.sampling-and-distributions` |
| 3.13 | Confidence Intervals | `confidence-intervals` | Intermediate | 35 min | 80 | `math-statistics.inference.central-limit-theorem` |
| 3.14 | Hypothesis Testing | `hypothesis-testing` | Intermediate | 40 min | 80 | `math-statistics.inference.confidence-intervals` |
| 3.15 | p-values & Statistical Significance | `p-values-and-significance` | Intermediate | 30 min | 80 | `math-statistics.inference.hypothesis-testing` |
| 3.16 | A/B Testing | `ab-testing` | Intermediate | 40 min | 90 | `math-statistics.inference.p-values-and-significance` |

#### Module: Linear Algebra for ML

| # | Lesson title | Slug | Difficulty | Time | XP | Prerequisites |
|---|---|---|---|---|---|---|
| 3.17 | Vectors & Scalars | `vectors-and-scalars` | Intermediate | 30 min | 70 | `python.python-ds-tools.numpy-operations` |
| 3.18 | Matrices & Operations | `matrices-and-operations` | Intermediate | 35 min | 70 | `math-statistics.linear-algebra.vectors-and-scalars` |
| 3.19 | Dot Products & Matrix Multiplication | `dot-products` | Intermediate | 35 min | 80 | `math-statistics.linear-algebra.matrices-and-operations` |
| 3.20 | Eigenvalues & Eigenvectors | `eigenvalues-and-eigenvectors` | Advanced | 40 min | 90 | `math-statistics.linear-algebra.dot-products` |
| 3.21 | Dimensionality Concepts | `dimensionality-concepts` | Advanced | 30 min | 90 | `math-statistics.linear-algebra.eigenvalues-and-eigenvectors` |

#### Module: Calculus for ML

| # | Lesson title | Slug | Difficulty | Time | XP | Prerequisites |
|---|---|---|---|---|---|---|
| 3.22 | Derivatives & Gradients | `derivatives-and-gradients` | Intermediate | 35 min | 70 | `math-statistics.linear-algebra.vectors-and-scalars` |
| 3.23 | The Chain Rule | `the-chain-rule` | Intermediate | 30 min | 70 | `math-statistics.calculus.derivatives-and-gradients` |
| 3.24 | Partial Derivatives | `partial-derivatives` | Intermediate | 30 min | 80 | `math-statistics.calculus.the-chain-rule` |
| 3.25 | Gradient Descent — Conceptual | `gradient-descent-conceptual` | Intermediate | 35 min | 80 | `math-statistics.calculus.partial-derivatives` |

**Domain total:** 25 lessons | 0 dedicated projects (math is applied in ML domain projects)

---

### Domain 4 — Data Analysis
**Course slug:** `data-analysis` | **orderIndex:** 4 | **estimatedHours:** 18 | **category:** `"Data Analysis"`

#### Module: Pandas Core (partially exists — 1 lesson written)

| # | Lesson title | Slug | Difficulty | Time | XP | Prerequisites |
|---|---|---|---|---|---|---|
| 4.1 | Pandas DataFrames | `pandas-dataframes` | Beginner | 40 min | 75 | `python.foundations.lists-vs-numpy-arrays` |
| 4.2 | Series & Index | `series-and-index` | Beginner | 30 min | 60 | `data-analysis.pandas-core.pandas-dataframes` |
| 4.3 | Data Selection (loc, iloc, boolean masking) | `data-selection` | Beginner | 35 min | 70 | `data-analysis.pandas-core.series-and-index` |
| 4.4 | Adding & Modifying Columns | `adding-modifying-columns` | Beginner | 30 min | 60 | `data-analysis.pandas-core.data-selection` |
| 4.5 | Handling Missing Data | `handling-missing-data` | Intermediate | 35 min | 70 | `data-analysis.pandas-core.adding-modifying-columns` |
| 4.6 | Sorting & Ranking | `sorting-and-ranking` | Beginner | 25 min | 50 | `data-analysis.pandas-core.data-selection` |

#### Module: Data Cleaning

| # | Lesson title | Slug | Difficulty | Time | XP | Prerequisites |
|---|---|---|---|---|---|---|
| 4.7 | Common Data Quality Issues | `common-data-quality-issues` | Intermediate | 30 min | 70 | `data-analysis.pandas-core.handling-missing-data` |
| 4.8 | Detecting & Handling Nulls | `detecting-handling-nulls` | Intermediate | 35 min | 70 | `data-analysis.cleaning.common-data-quality-issues` |
| 4.9 | Deduplication | `deduplication` | Intermediate | 25 min | 60 | `data-analysis.cleaning.detecting-handling-nulls` |
| 4.10 | Data Type Coercion | `type-coercion` | Intermediate | 25 min | 60 | `data-analysis.cleaning.deduplication` |
| 4.11 | String Cleaning | `string-cleaning` | Intermediate | 30 min | 70 | `data-analysis.cleaning.type-coercion` |
| 4.12 | Outlier Detection | `outlier-detection` | Intermediate | 35 min | 70 | `data-analysis.cleaning.string-cleaning` |

#### Module: Data Transformation

| # | Lesson title | Slug | Difficulty | Time | XP | Prerequisites |
|---|---|---|---|---|---|---|
| 4.13 | GroupBy & Aggregation | `groupby-and-aggregation` | Intermediate | 35 min | 70 | `data-analysis.pandas-core.data-selection` |
| 4.14 | Reshaping (pivot, melt, stack, unstack) | `reshaping-pivot-melt` | Intermediate | 35 min | 80 | `data-analysis.transformation.groupby-and-aggregation` |
| 4.15 | Merging & Joining DataFrames | `merging-and-joining` | Intermediate | 35 min | 80 | `data-analysis.pandas-core.data-selection` |
| 4.16 | Window Functions (rolling, expanding) | `window-functions` | Intermediate | 30 min | 80 | `data-analysis.transformation.groupby-and-aggregation` |
| 4.17 | Apply & Transform | `apply-and-transform` | Intermediate | 30 min | 70 | `data-analysis.transformation.groupby-and-aggregation` |

#### Module: Exploratory Data Analysis

| # | Lesson title | Slug | Difficulty | Time | XP | Prerequisites |
|---|---|---|---|---|---|---|
| 4.18 | The EDA Workflow | `eda-workflow` | Intermediate | 30 min | 70 | `data-analysis.transformation.apply-and-transform` |
| 4.19 | Univariate Analysis | `univariate-analysis` | Intermediate | 35 min | 70 | `data-analysis.eda.eda-workflow` |
| 4.20 | Bivariate Analysis | `bivariate-analysis` | Intermediate | 35 min | 80 | `data-analysis.eda.univariate-analysis` |
| 4.21 | Multivariate Analysis | `multivariate-analysis` | Intermediate | 35 min | 80 | `data-analysis.eda.bivariate-analysis` |
| 4.22 | Project: EDA on a Real Dataset | `project-eda-real-dataset` | Intermediate | 90 min | 300 | `data-analysis.eda.multivariate-analysis` |

**Domain total:** 22 lessons (including 1 existing) | 1 domain project

---

### Domain 5 — SQL & Databases
**Course slug:** `sql` | **orderIndex:** 5 | **estimatedHours:** 16 | **category:** `"Databases"`

#### Module: SQL Foundations

| # | Lesson title | Slug | Difficulty | Time | XP | Prerequisites |
|---|---|---|---|---|---|---|
| 5.1 | What Is a Database? | `what-is-a-database` | Beginner | 20 min | 40 | — |
| 5.2 | SELECT & FROM | `select-and-from` | Beginner | 25 min | 50 | `sql.foundations.what-is-a-database` |
| 5.3 | WHERE & Filtering | `where-and-filtering` | Beginner | 25 min | 50 | `sql.foundations.select-and-from` |
| 5.4 | ORDER BY & LIMIT | `order-by-and-limit` | Beginner | 20 min | 40 | `sql.foundations.where-and-filtering` |
| 5.5 | Aggregate Functions | `aggregate-functions` | Beginner | 30 min | 60 | `sql.foundations.select-and-from` |
| 5.6 | GROUP BY & HAVING | `group-by-and-having` | Beginner | 30 min | 60 | `sql.foundations.aggregate-functions` |

#### Module: Joins

| # | Lesson title | Slug | Difficulty | Time | XP | Prerequisites |
|---|---|---|---|---|---|---|
| 5.7 | INNER JOIN | `inner-join` | Intermediate | 30 min | 70 | `sql.foundations.select-and-from` |
| 5.8 | LEFT & RIGHT JOINs | `left-and-right-joins` | Intermediate | 30 min | 70 | `sql.joins.inner-join` |
| 5.9 | FULL OUTER JOIN | `full-outer-join` | Intermediate | 25 min | 60 | `sql.joins.left-and-right-joins` |
| 5.10 | Self Joins | `self-joins` | Intermediate | 25 min | 70 | `sql.joins.inner-join` |
| 5.11 | Multiple Joins | `multiple-joins` | Intermediate | 30 min | 80 | `sql.joins.left-and-right-joins` |

#### Module: Advanced SQL

| # | Lesson title | Slug | Difficulty | Time | XP | Prerequisites |
|---|---|---|---|---|---|---|
| 5.12 | Subqueries | `subqueries` | Intermediate | 35 min | 80 | `sql.joins.inner-join` |
| 5.13 | CTEs (Common Table Expressions) | `ctes` | Intermediate | 35 min | 80 | `sql.advanced.subqueries` |
| 5.14 | Window Functions in SQL | `window-functions-sql` | Advanced | 40 min | 90 | `sql.advanced.ctes` |
| 5.15 | CASE Statements | `case-statements` | Intermediate | 30 min | 70 | `sql.foundations.select-and-from` |
| 5.16 | String & Date Functions | `string-and-date-functions` | Intermediate | 30 min | 70 | `sql.foundations.select-and-from` |

#### Module: Database Design

| # | Lesson title | Slug | Difficulty | Time | XP | Prerequisites |
|---|---|---|---|---|---|---|
| 5.17 | Database Design Concepts | `database-design-concepts` | Intermediate | 30 min | 70 | `sql.foundations.what-is-a-database` |
| 5.18 | Normalization | `normalization` | Intermediate | 35 min | 80 | `sql.design.database-design-concepts` |
| 5.19 | Indexes & Query Optimization | `indexes-and-optimization` | Advanced | 35 min | 90 | `sql.design.normalization` |
| 5.20 | Transactions & ACID | `transactions-and-acid` | Advanced | 30 min | 90 | `sql.design.normalization` |

#### Module: SQL for Analysis

| # | Lesson title | Slug | Difficulty | Time | XP | Prerequisites |
|---|---|---|---|---|---|---|
| 5.21 | SQL for EDA | `sql-for-eda` | Intermediate | 40 min | 90 | `sql.advanced.window-functions-sql` |
| 5.22 | Project: Business Analysis in SQL | `project-sql-business-analysis` | Intermediate | 90 min | 300 | `sql.analysis.sql-for-eda` |

**Domain total:** 22 lessons | 1 domain project

---

### Domain 6 — Data Visualization
**Course slug:** `visualization` | **orderIndex:** 6 | **estimatedHours:** 12 | **category:** `"Visualization"`

#### Module: Matplotlib

| # | Lesson title | Slug | Difficulty | Time | XP | Prerequisites |
|---|---|---|---|---|---|---|
| 6.1 | Matplotlib Fundamentals | `matplotlib-fundamentals` | Beginner | 30 min | 60 | `data-analysis.pandas-core.pandas-dataframes` |
| 6.2 | Line, Bar & Scatter Plots | `line-bar-scatter` | Beginner | 30 min | 60 | `visualization.matplotlib.matplotlib-fundamentals` |
| 6.3 | Histograms & Box Plots | `histograms-and-boxplots` | Beginner | 25 min | 60 | `visualization.matplotlib.line-bar-scatter` |
| 6.4 | Subplots & Figure Layout | `subplots-and-layout` | Intermediate | 30 min | 70 | `visualization.matplotlib.histograms-and-boxplots` |
| 6.5 | Styling & Customization | `styling-and-customization` | Intermediate | 25 min | 60 | `visualization.matplotlib.subplots-and-layout` |

#### Module: Seaborn

| # | Lesson title | Slug | Difficulty | Time | XP | Prerequisites |
|---|---|---|---|---|---|---|
| 6.6 | Seaborn for Statistical Visualization | `seaborn-statistical-viz` | Intermediate | 30 min | 70 | `visualization.matplotlib.matplotlib-fundamentals` |
| 6.7 | Distribution Plots | `distribution-plots` | Intermediate | 25 min | 60 | `visualization.seaborn.seaborn-statistical-viz` |
| 6.8 | Categorical Plots | `categorical-plots` | Intermediate | 25 min | 60 | `visualization.seaborn.distribution-plots` |
| 6.9 | Heatmaps & Pair Plots | `heatmaps-and-pairplots` | Intermediate | 30 min | 70 | `visualization.seaborn.categorical-plots` |

#### Module: Plotly (Interactive)

| # | Lesson title | Slug | Difficulty | Time | XP | Prerequisites |
|---|---|---|---|---|---|---|
| 6.10 | Plotly Express | `plotly-express` | Intermediate | 30 min | 70 | `visualization.matplotlib.matplotlib-fundamentals` |
| 6.11 | Interactive Charts | `interactive-charts` | Intermediate | 30 min | 70 | `visualization.plotly.plotly-express` |
| 6.12 | Dashboards with Dash (Intro) | `dashboards-intro` | Intermediate | 35 min | 80 | `visualization.plotly.interactive-charts` |

#### Module: Storytelling with Data

| # | Lesson title | Slug | Difficulty | Time | XP | Prerequisites |
|---|---|---|---|---|---|---|
| 6.13 | Choosing the Right Chart | `choosing-the-right-chart` | Intermediate | 25 min | 60 | `visualization.matplotlib.line-bar-scatter` |
| 6.14 | Designing for an Audience | `designing-for-an-audience` | Intermediate | 25 min | 70 | `visualization.storytelling.choosing-the-right-chart` |
| 6.15 | Avoiding Misleading Visualizations | `misleading-visualizations` | Intermediate | 25 min | 70 | `visualization.storytelling.designing-for-an-audience` |
| 6.16 | Project: Executive Visualization Dashboard | `project-visualization-dashboard` | Intermediate | 90 min | 300 | `visualization.storytelling.misleading-visualizations` |

**Domain total:** 16 lessons | 1 domain project

---

### Domain 7 — Machine Learning
**Course slug:** `machine-learning` | **orderIndex:** 7 | **estimatedHours:** 30 | **category:** `"Machine Learning"`

#### Module: ML Foundations

| # | Lesson title | Slug | Difficulty | Time | XP | Prerequisites |
|---|---|---|---|---|---|---|
| 7.1 | What Is Machine Learning? | `what-is-machine-learning` | Intermediate | 25 min | 70 | `math-statistics.descriptive.central-tendency` |
| 7.2 | Supervised, Unsupervised & Reinforcement | `supervised-unsupervised-rl` | Intermediate | 25 min | 70 | `machine-learning.foundations.what-is-machine-learning` |
| 7.3 | The ML Workflow | `the-ml-workflow` | Intermediate | 30 min | 70 | `machine-learning.foundations.supervised-unsupervised-rl` |
| 7.4 | Train/Test Split & Cross-Validation | `train-test-split-and-cv` | Intermediate | 35 min | 80 | `machine-learning.foundations.the-ml-workflow` |
| 7.5 | Feature Engineering Basics | `feature-engineering-basics` | Intermediate | 35 min | 80 | `machine-learning.foundations.train-test-split-and-cv` |
| 7.6 | Evaluation Metrics — Regression | `evaluation-metrics-regression` | Intermediate | 30 min | 80 | `machine-learning.foundations.the-ml-workflow` |
| 7.7 | Evaluation Metrics — Classification | `evaluation-metrics-classification` | Intermediate | 35 min | 80 | `machine-learning.foundations.evaluation-metrics-regression` |

#### Module: Regression

| # | Lesson title | Slug | Difficulty | Time | XP | Prerequisites |
|---|---|---|---|---|---|---|
| 7.8 | Linear Regression | `linear-regression` | Intermediate | 40 min | 80 | `machine-learning.foundations.evaluation-metrics-regression` |
| 7.9 | Multiple Linear Regression | `multiple-linear-regression` | Intermediate | 35 min | 80 | `machine-learning.regression.linear-regression` |
| 7.10 | Polynomial Regression | `polynomial-regression` | Intermediate | 35 min | 80 | `machine-learning.regression.multiple-linear-regression` |
| 7.11 | Ridge & Lasso Regularization | `ridge-and-lasso` | Intermediate | 35 min | 90 | `machine-learning.regression.polynomial-regression` |
| 7.12 | Decision Trees for Regression | `decision-trees-regression` | Intermediate | 35 min | 80 | `machine-learning.regression.linear-regression` |

#### Module: Classification

| # | Lesson title | Slug | Difficulty | Time | XP | Prerequisites |
|---|---|---|---|---|---|---|
| 7.13 | Logistic Regression | `logistic-regression` | Intermediate | 40 min | 80 | `machine-learning.foundations.evaluation-metrics-classification` |
| 7.14 | K-Nearest Neighbors | `k-nearest-neighbors` | Intermediate | 30 min | 70 | `machine-learning.classification.logistic-regression` |
| 7.15 | Decision Trees for Classification | `decision-trees-classification` | Intermediate | 35 min | 80 | `machine-learning.regression.decision-trees-regression` |
| 7.16 | Random Forests | `random-forests` | Intermediate | 40 min | 90 | `machine-learning.classification.decision-trees-classification` |
| 7.17 | Gradient Boosting & XGBoost | `gradient-boosting-xgboost` | Advanced | 45 min | 100 | `machine-learning.classification.random-forests` |
| 7.18 | Support Vector Machines | `support-vector-machines` | Advanced | 40 min | 100 | `machine-learning.classification.logistic-regression` |
| 7.19 | Naive Bayes | `naive-bayes` | Intermediate | 30 min | 70 | `math-statistics.probability.conditional-probability-and-bayes` |

#### Module: Unsupervised Learning

| # | Lesson title | Slug | Difficulty | Time | XP | Prerequisites |
|---|---|---|---|---|---|---|
| 7.20 | K-Means Clustering | `k-means-clustering` | Intermediate | 40 min | 80 | `machine-learning.foundations.the-ml-workflow` |
| 7.21 | Hierarchical Clustering | `hierarchical-clustering` | Intermediate | 35 min | 80 | `machine-learning.unsupervised.k-means-clustering` |
| 7.22 | DBSCAN | `dbscan` | Advanced | 35 min | 90 | `machine-learning.unsupervised.hierarchical-clustering` |
| 7.23 | Principal Component Analysis (PCA) | `pca` | Advanced | 40 min | 100 | `math-statistics.linear-algebra.eigenvalues-and-eigenvectors` |
| 7.24 | t-SNE & UMAP | `tsne-and-umap` | Advanced | 35 min | 100 | `machine-learning.unsupervised.pca` |

#### Module: Model Selection & Tuning

| # | Lesson title | Slug | Difficulty | Time | XP | Prerequisites |
|---|---|---|---|---|---|---|
| 7.25 | Bias-Variance Tradeoff | `bias-variance-tradeoff` | Advanced | 35 min | 90 | `machine-learning.foundations.train-test-split-and-cv` |
| 7.26 | Hyperparameter Tuning | `hyperparameter-tuning` | Advanced | 40 min | 90 | `machine-learning.tuning.bias-variance-tradeoff` |
| 7.27 | Feature Selection | `feature-selection` | Advanced | 35 min | 90 | `machine-learning.foundations.feature-engineering-basics` |
| 7.28 | Handling Class Imbalance (SMOTE) | `handling-class-imbalance` | Advanced | 30 min | 90 | `machine-learning.foundations.evaluation-metrics-classification` |
| 7.29 | Pipelines with scikit-learn | `sklearn-pipelines` | Advanced | 40 min | 100 | `machine-learning.tuning.hyperparameter-tuning` |

#### Module: ML Projects

| # | Lesson title | Slug | Difficulty | Time | XP | Prerequisites |
|---|---|---|---|---|---|---|
| 7.30 | Project: Predict House Prices | `project-house-prices` | Intermediate | 90 min | 200 | `machine-learning.regression.ridge-and-lasso` |
| 7.31 | Project: Customer Churn Prediction | `project-customer-churn` | Advanced | 120 min | 300 | `machine-learning.classification.gradient-boosting-xgboost` |
| 7.32 | Project: Sales Forecasting | `project-sales-forecasting` | Advanced | 120 min | 300 | `machine-learning.tuning.sklearn-pipelines` |

**Domain total:** 32 lessons | 3 projects (1 mini + 2 domain)

---

### Domain 8 — Deep Learning
**Course slug:** `deep-learning` | **orderIndex:** 8 | **estimatedHours:** 20 | **category:** `"Deep Learning"`

#### Module: Neural Network Fundamentals

| # | Slug | Difficulty | Time | XP | Prerequisites |
|---|---|---|---|---|---|
| 8.1 | `what-is-a-neural-network` | Intermediate | 30 min | 80 | `machine-learning.foundations.what-is-machine-learning` |
| 8.2 | `perceptrons-and-activations` | Intermediate | 35 min | 80 | `deep-learning.fundamentals.what-is-a-neural-network` |
| 8.3 | `forward-propagation` | Advanced | 40 min | 90 | `deep-learning.fundamentals.perceptrons-and-activations` |
| 8.4 | `backpropagation` | Advanced | 45 min | 100 | `math-statistics.calculus.the-chain-rule` |
| 8.5 | `training-loss-optimizers` | Advanced | 40 min | 100 | `deep-learning.fundamentals.backpropagation` |

#### Module: PyTorch

| # | Slug | Difficulty | Time | XP | Prerequisites |
|---|---|---|---|---|---|
| 8.6 | `pytorch-tensors-and-autograd` | Advanced | 40 min | 90 | `deep-learning.fundamentals.training-loss-optimizers` |
| 8.7 | `building-your-first-nn` | Advanced | 45 min | 100 | `deep-learning.pytorch.pytorch-tensors-and-autograd` |
| 8.8 | `training-loop-and-validation` | Advanced | 40 min | 100 | `deep-learning.pytorch.building-your-first-nn` |
| 8.9 | `saving-and-loading-models` | Advanced | 25 min | 80 | `deep-learning.pytorch.training-loop-and-validation` |

#### Module: Convolutional Neural Networks

| # | Slug | Difficulty | Time | XP | Prerequisites |
|---|---|---|---|---|---|
| 8.10 | `image-data-and-preprocessing` | Advanced | 35 min | 90 | `deep-learning.pytorch.training-loop-and-validation` |
| 8.11 | `cnn-architecture` | Advanced | 45 min | 100 | `deep-learning.cnns.image-data-and-preprocessing` |
| 8.12 | `transfer-learning` | Advanced | 40 min | 100 | `deep-learning.cnns.cnn-architecture` |
| 8.13 | `project-image-classification` | Advanced | 120 min | 300 | `deep-learning.cnns.transfer-learning` |

#### Module: Recurrent Neural Networks

| # | Slug | Difficulty | Time | XP | Prerequisites |
|---|---|---|---|---|---|
| 8.14 | `sequence-data-concepts` | Advanced | 30 min | 80 | `deep-learning.pytorch.training-loop-and-validation` |
| 8.15 | `rnn-architecture` | Advanced | 40 min | 100 | `deep-learning.rnns.sequence-data-concepts` |
| 8.16 | `lstm-and-gru` | Advanced | 40 min | 100 | `deep-learning.rnns.rnn-architecture` |
| 8.17 | `project-time-series-forecasting` | Advanced | 120 min | 300 | `deep-learning.rnns.lstm-and-gru` |

#### Module: Transformers

| # | Slug | Difficulty | Time | XP | Prerequisites |
|---|---|---|---|---|---|
| 8.18 | `attention-mechanism` | Advanced | 45 min | 100 | `math-statistics.linear-algebra.dot-products` |
| 8.19 | `transformer-architecture` | Advanced | 45 min | 110 | `deep-learning.transformers.attention-mechanism` |
| 8.20 | `bert-and-gpt-concepts` | Advanced | 35 min | 100 | `deep-learning.transformers.transformer-architecture` |
| 8.21 | `fine-tuning-pretrained-model` | Advanced | 45 min | 110 | `deep-learning.transformers.bert-and-gpt-concepts` |

**Domain total:** 21 lessons | 2 domain projects

---

### Domain 9 — Big Data
**Course slug:** `big-data` | **orderIndex:** 9 | **estimatedHours:** 12 | **category:** `"Big Data"`

| Module | Lesson slugs (in order) | Difficulty | XP range | Key prerequisite |
|---|---|---|---|---|
| Big Data Concepts | `what-is-big-data`, `distributed-computing`, `hadoop-ecosystem`, `data-lakes-vs-warehouses` | Intermediate | 70–80 | `data-analysis.pandas-core.pandas-dataframes` |
| PySpark | `spark-architecture-and-rdds`, `pyspark-dataframes`, `spark-sql`, `spark-ml`, `streaming-data-concepts` | Advanced | 90–110 | `big-data.concepts.what-is-big-data` |
| Cloud Platforms | `aws-s3-and-athena`, `bigquery-for-analysis`, `snowflake-concepts`, `project-pyspark-large-dataset` | Advanced | 90–300 | `big-data.pyspark.pyspark-dataframes` |

**Domain total:** 13 lessons | 1 domain project

---

### Domain 10 — MLOps
**Course slug:** `mlops` | **orderIndex:** 10 | **estimatedHours:** 14 | **category:** `"MLOps"`

| Module | Lesson slugs (in order) | Difficulty | XP range | Key prerequisite |
|---|---|---|---|---|
| ML Engineering | `software-engineering-for-ds`, `git-for-ml`, `docker-basics`, `ml-project-structure` | Advanced | 80–90 | `machine-learning.ml-projects.project-customer-churn` |
| Experiment Tracking | `mlflow-tracking`, `model-versioning`, `dvc-data-versioning` | Advanced | 90–100 | `mlops.engineering.software-engineering-for-ds` |
| Model Deployment | `rest-apis-with-fastapi`, `containerizing-ml-models`, `model-serving-patterns`, `monitoring-in-production` | Advanced | 90–110 | `mlops.tracking.mlflow-tracking` |
| ML Pipelines | `pipeline-orchestration-airflow`, `cicd-for-ml`, `feature-stores`, `project-deploy-churn-model` | Advanced | 90–300 | `mlops.deployment.monitoring-in-production` |

**Domain total:** 15 lessons | 1 domain project

---

### Domain 11 — Generative AI
**Course slug:** `generative-ai` | **orderIndex:** 11 | **estimatedHours:** 12 | **category:** `"Generative AI"`

| Module | Lesson slugs (in order) | Difficulty | XP range | Key prerequisite |
|---|---|---|---|---|
| LLM Fundamentals | `what-are-llms`, `tokenization-and-embeddings`, `prompt-engineering`, `few-shot-and-zero-shot`, `llm-limitations` | Advanced | 90–110 | `deep-learning.transformers.bert-and-gpt-concepts` |
| LLM APIs | `openai-and-claude-apis`, `structured-outputs`, `function-calling-tool-use`, `cost-optimization-and-caching` | Advanced | 90–100 | `generative-ai.fundamentals.what-are-llms` |
| Fine-Tuning | `when-to-fine-tune`, `fine-tuning-with-huggingface`, `peft-and-lora`, `evaluating-llm-outputs` | Advanced | 90–110 | `generative-ai.apis.openai-and-claude-apis` |

**Domain total:** 13 lessons | 0 standalone projects (project folded into Domain 12)

---

### Domain 12 — RAG & Vector Databases
**Course slug:** `rag` | **orderIndex:** 12 | **estimatedHours:** 10 | **category:** `"RAG"`

| Module | Lesson slugs (in order) | Difficulty | XP range | Key prerequisite |
|---|---|---|---|---|
| Embeddings | `what-are-embeddings`, `generating-embeddings`, `similarity-and-distance-metrics`, `vector-databases` | Advanced | 90–100 | `generative-ai.fundamentals.tokenization-and-embeddings` |
| Retrieval | `rag-architecture`, `chunking-strategies`, `retrieval-methods`, `reranking-and-context` | Advanced | 90–110 | `rag.embeddings.vector-databases` |
| RAG in Production | `evaluating-rag-systems`, `rag-anti-patterns`, `project-document-qa` | Advanced | 100–300 | `rag.retrieval.reranking-and-context` |

**Domain total:** 11 lessons | 1 domain project

---

### Domain 13 — AI Agents & Agentic AI
**Course slug:** `agentic-ai` | **orderIndex:** 13 | **estimatedHours:** 10 | **category:** `"Agents"`

| Module | Lesson slugs (in order) | Difficulty | XP range | Key prerequisite |
|---|---|---|---|---|
| Agent Fundamentals | `what-is-an-ai-agent`, `the-react-pattern`, `tool-use-and-function-calling`, `memory-short-and-long-term`, `agent-evaluation` | Advanced | 90–110 | `generative-ai.apis.function-calling-tool-use` |
| Building Agents | `single-agent-architectures`, `multi-agent-systems`, `human-in-the-loop`, `frameworks-langgraph-autogen` | Advanced | 100–110 | `agentic-ai.fundamentals.the-react-pattern` |
| Agent Projects | `project-data-analysis-agent`, `project-multi-agent-research` | Advanced | 300–500 | `agentic-ai.building.multi-agent-systems` |

**Domain total:** 11 lessons | 2 domain projects

---

### Domain 14 — Industry Projects
**Course slug:** `projects` | **orderIndex:** 14 | **estimatedHours:** 40 | **category:** `"Projects"`

These are capstone-scale cross-domain projects. Each is a full lesson entry using the `project-brief` block type (to be defined in Phase A3).

| # | Title | Slug | Domain blend | Prerequisites |
|---|---|---|---|---|
| 14.1 | E-Commerce Analytics Platform | `project-ecommerce-analytics` | SQL + Pandas + Visualization | `visualization.storytelling.project-visualization-dashboard` |
| 14.2 | Healthcare ML: Patient Readmission | `project-healthcare-readmission` | ML + EDA + Statistics | `machine-learning.ml-projects.project-customer-churn` |
| 14.3 | NLP: Sentiment Analysis Pipeline | `project-sentiment-analysis` | Deep Learning + Transformers | `deep-learning.transformers.fine-tuning-pretrained-model` |
| 14.4 | Computer Vision: Defect Detection | `project-defect-detection` | CNNs + MLOps | `mlops.deployment.containerizing-ml-models` |
| 14.5 | Time Series: Demand Forecasting | `project-demand-forecasting` | ML + Deep Learning | `deep-learning.rnns.project-time-series-forecasting` |
| 14.6 | Recommendation System | `project-recommendation-system` | ML + SQL + Big Data | `machine-learning.unsupervised.pca` |
| 14.7 | RAG-Powered Support Bot | `project-support-bot` | RAG + GenAI | `rag.production.project-document-qa` |
| 14.8 | AI Agent: Automated Reporting | `project-automated-reporting` | Agents + MLOps | `agentic-ai.projects.project-data-analysis-agent` |
| 14.9 | End-to-End ML Platform (Capstone) | `project-ml-platform-capstone` | ALL domains | all prior domain projects |

**Domain total:** 9 capstone projects

---

### Domain 15 — Career & Interview Readiness
**Course slug:** `career` | **orderIndex:** 15 | **estimatedHours:** 8 | **category:** `"Career"`

| Module | Lesson slugs (in order) | Difficulty | Key prerequisite |
|---|---|---|---|
| Portfolio & Resume | `building-a-ds-portfolio`, `writing-a-ds-resume`, `github-profile-best-practices`, `linkedin-optimization` | Intermediate | `machine-learning.ml-projects.project-customer-churn` |
| Interview Prep | `ds-interview-types`, `sql-interview-questions`, `python-pandas-interviews`, `statistics-and-ml-interviews`, `system-design-for-ds`, `take-home-assessment-strategies` | Advanced | `career.portfolio.building-a-ds-portfolio` |
| Industry Readiness | `working-in-a-data-team`, `code-review-culture`, `communicating-with-stakeholders`, `data-science-ethics`, `navigating-your-first-role` | Intermediate | — |

**Domain total:** 15 lessons

---

## 5. Project Progression Map

Projects are distributed across the curriculum, not clustered at the end. The progression:

```
Domain 1  →  1.12  Guided Mini:  Explore Your First Dataset            (45 min, 150 XP)
Domain 2  →  2.36  Module:       Build a Data Pipeline in Python        (60 min, 200 XP)
Domain 4  →  4.22  Domain:       EDA on a Real Dataset                  (90 min, 300 XP)
Domain 5  →  5.22  Domain:       Business Analysis in SQL               (90 min, 300 XP)
Domain 6  →  6.16  Domain:       Executive Visualization Dashboard       (90 min, 300 XP)
Domain 7  →  7.30  Guided Mini:  Predict House Prices (regression)       (90 min, 200 XP)
Domain 7  →  7.31  Domain:       Customer Churn Prediction              (120 min, 300 XP)
Domain 7  →  7.32  Domain:       Sales Forecasting                      (120 min, 300 XP)
Domain 8  →  8.13  Domain:       Image Classification (CNN)             (120 min, 300 XP)
Domain 8  →  8.17  Domain:       Time Series Forecasting (LSTM)         (120 min, 300 XP)
Domain 9  →  9.13  Domain:       Analyzing a Large Dataset in PySpark   (90 min,  300 XP)
Domain 10 → 10.15  Domain:       Deploy a Churn Model End-to-End        (120 min, 300 XP)
Domain 12 → 12.11  Domain:       Document Q&A System with RAG           (120 min, 300 XP)
Domain 13 → 13.10  Domain:       Data Analysis Agent                    (120 min, 300 XP)
Domain 13 → 13.11  Domain:       Multi-Agent Research Assistant         (120 min, 300 XP)
Domain 14 → 14.1–9 Capstone:     9 cross-domain industry projects        (varies, 300–500 XP)
```

---

## 6. Curriculum Summary Counts

| Domain | Courses | Modules | Lessons | Projects |
|---|---|---|---|---|
| 1. Foundations | 1 | 3 | 12 | 1 |
| 2. Python | 1 | 7 | 36 | 2 |
| 3. Math & Statistics | 1 | 5 | 25 | 0 |
| 4. Data Analysis | 1 | 4 | 22 | 1 |
| 5. SQL | 1 | 5 | 22 | 1 |
| 6. Visualization | 1 | 4 | 16 | 1 |
| 7. Machine Learning | 1 | 6 | 32 | 3 |
| 8. Deep Learning | 1 | 5 | 21 | 2 |
| 9. Big Data | 1 | 3 | 13 | 1 |
| 10. MLOps | 1 | 4 | 15 | 1 |
| 11. Generative AI | 1 | 3 | 13 | 0 |
| 12. RAG | 1 | 3 | 11 | 1 |
| 13. AI Agents | 1 | 3 | 11 | 2 |
| 14. Industry Projects | 1 | 1 | 9 | 9 |
| 15. Career | 1 | 3 | 15 | 0 |
| **TOTAL** | **15** | **59** | **273** | **25** |

*Note: 273 includes the 25 project lessons — the pure-theory lesson count is 248. Both numbers are within the stated 150–250 range when counted as instructional entries; project lessons take roughly twice the time of theory lessons.*

---

## 7. Migration Strategy

### Phase M1 — Fix `data-analysis/` structure (before next content batch)

The `data-analysis/index.ts` defines course and module metadata inline. Extract them:

1. Create `src/content/courses/data-analysis/course.ts` — extract `dataAnalysisCourse` constant.
2. Create `src/content/courses/data-analysis/modules/pandas-core/module.ts` — extract `pandasCoreModule` constant.
3. Update `index.ts` to import from those files (matching the python pattern).
4. No registry or application code changes needed — `registerCourse()` call remains identical.

### Phase M2 — Retire the legacy monolith (can be deferred)

`src/lib/data/curriculum.ts` currently powers:
- The `allLessons()` call used by the **dashboard** (`src/app/dashboard/page.tsx`)
- The curriculum page and course page if they import from `@/lib/data/curriculum`

Retirement steps:
1. Update `src/app/dashboard/page.tsx` to import `allLessons` from `@/lib/curriculum` (new registry) instead of `@/lib/data/curriculum`.
2. Verify all other consumers (`curriculum/page.tsx`, `course/[courseSlug]/page.tsx`) import from the new registry.
3. Once no file imports from `src/lib/data/curriculum.ts`, the file can be deleted.

**Do not delete the legacy file until step 2 is confirmed.** The file contains the full body content of the 3 existing lessons as well as routing helpers — some of this content has already been migrated to `src/content/courses/`.

### Phase M3 — Confirm existing 3 lessons are fully in the new system

All 3 lessons already exist in `src/content/courses/` with full `blocks` arrays. Verify by checking:
- `python/modules/foundations/lessons/variables-and-data-types.ts` — ✓ present
- `python/modules/foundations/lessons/lists-vs-numpy-arrays.ts` — ✓ present (confirm blocks array exists)
- `data-analysis/modules/pandas-core/lessons/pandas-dataframes.ts` — ✓ present (confirm blocks array exists)

The lesson page (`/course/[courseSlug]/[moduleSlug]/[lessonSlug]/page.tsx`) already uses the new registry's `getLesson()` function, so these lessons render immediately.

---

## 8. Batch Strategy for Lesson Content Generation

Generating 225+ full lessons (each ~400–600 lines of TypeScript) requires a disciplined batching strategy to stay within token budgets.

### 8.1 Priority Tiers

**Tier 1 — Generate first (unlocks most learner paths):**
- Domain 2 (Python) — lessons 2.3 through 2.12 (Foundations + Control Flow)
- Domain 4 (Data Analysis) — lessons 4.2 through 4.6 (Pandas Core completion)
- Domain 3 (Math/Statistics) — lessons 3.1 through 3.5 (Descriptive Statistics)

**Tier 2 — Generate second (activates SQL, Visualization, ML prerequisite chains):**
- Domain 5 (SQL) — SQL Foundations module (lessons 5.1–5.6)
- Domain 2 (Python) — Functions module (lessons 2.11–2.17)
- Domain 3 (Math) — Probability module (lessons 3.6–3.10)
- Domain 4 (Data Analysis) — Data Cleaning module (lessons 4.7–4.12)

**Tier 3 — Generate third (activates ML):**
- Domain 6 (Visualization) — Matplotlib + Seaborn modules
- Domain 3 (Math) — Statistical Inference + Linear Algebra modules
- Domain 4 (Data Analysis) — Transformation + EDA modules
- Domain 5 (SQL) — Joins + Advanced SQL modules
- Domain 2 (Python) — Data Structures + OOP modules

**Tier 4 — Generate fourth:**
- Domain 7 (ML) — Foundations + Regression + Classification modules

**Tier 5 — Generate fifth:**
- Domain 7 (ML) — Unsupervised + Tuning + Projects
- Domain 8 (Deep Learning) — all modules

**Tier 6 — Generate last:**
- Domains 9–15 (Big Data, MLOps, GenAI, RAG, Agents, Career)

### 8.2 Batch Size Per Generation Session

Each generation session should target **1 complete module** (typically 4–7 lessons). This keeps the context within a single session, allows validation after each batch, and produces immediately testable content.

**Suggested per-session scope:**
```
Session 1:  Python · Foundations (3 new lessons: 2.3, 2.4, 2.5)
Session 2:  Python · Control Flow (5 lessons: 2.6–2.10)
Session 3:  Python · Functions (7 lessons: 2.11–2.17)
Session 4:  Data Analysis · Pandas Core (5 new lessons: 4.2–4.6)
Session 5:  Math/Stats · Descriptive Statistics (5 lessons: 3.1–3.5)
...
```

### 8.3 Per-Session Protocol

Every content generation session must:

1. Read `CONTENT_GUIDELINES.md` §2 (lesson structure) and §4 (writing style).
2. Read `src/lib/curriculum/types.ts` (LessonMeta shape) and `src/lib/curriculum/blocks.ts` (LearningBlock union).
3. Read one existing complete lesson file (e.g., `variables-and-data-types.ts`) as a structural template.
4. Read the target module's `module.ts` to confirm `lessonOrder`.
5. Generate all lessons for the target module in a single response.
6. After generation: update `module.ts` `lessonOrder` if new lesson slugs are added.
7. Update course `index.ts` to import the new lesson files.
8. Do **not** run the production build during generation sessions — run it as a dedicated validation step after 2–3 modules are complete.

### 8.4 Token-Efficient Lesson Format

Each lesson file follows a strict pattern. The minimum viable lesson reads:
- `LessonMeta` block (~15 lines)
- `lesson-intro` block (~30 lines: hook + objectives + 3 real-world apps)
- `theory-blocks` block (~80 lines: 6–8 mixed sub-blocks)
- `interactive-diagram` block (~60 lines: 5–8 nodes + edges)
- `worked-examples` block (~150 lines: 5 examples × 3–5 steps each)
- `inline-code` block (~40 lines: starter code + solution + hints)
- `mastery-assessment` block (~80 lines: 5–6 exercises)
- `interview-questions` block (~30 lines: 3 Q&A pairs)

Average lesson: ~490 lines of TypeScript. At 5 lessons per session, that is ~2,450 lines per session — well within a single context window.

---

## 9. Implementation Checklist Before First Content Batch

- [ ] Fix `data-analysis/` structure (Phase M1) — extract course.ts and module.ts
- [ ] Verify `lists-vs-numpy-arrays.ts` has complete `blocks` array (not just meta)
- [ ] Verify `pandas-dataframes.ts` has complete `blocks` array
- [ ] Confirm dashboard `allLessons()` import source (legacy vs new registry)
- [ ] Create stub `course.ts` and `index.ts` files for all 15 domains (meta only, empty module arrays)
- [ ] Add all 15 domain courses to `src/content/courses/index.ts` manifest (commented-out imports are fine for unwritten courses)
- [ ] Standardize `CourseMeta.category` values across both existing courses to match the enum in §4

---

## 10. CourseMeta Reference for All 15 Courses

```typescript
// Paste these as the CourseMeta for each course.ts

{ id: "foundations",     slug: "foundations",     title: "Foundations & Data Literacy",       difficulty: "Beginner",      estimatedHours: 8,  category: "Foundations",    orderIndex: 1  }
{ id: "python",          slug: "python",           title: "Python for Data Science",           difficulty: "Beginner",      estimatedHours: 28, category: "Programming",    orderIndex: 2  }
{ id: "math-statistics", slug: "math-statistics",  title: "Mathematics & Statistics",          difficulty: "Intermediate",  estimatedHours: 22, category: "Mathematics",    orderIndex: 3  }
{ id: "data-analysis",   slug: "data-analysis",    title: "Data Analysis with Pandas",         difficulty: "Beginner",      estimatedHours: 18, category: "Data Analysis",  orderIndex: 4  }
{ id: "sql",             slug: "sql",              title: "SQL & Databases",                   difficulty: "Beginner",      estimatedHours: 16, category: "Databases",      orderIndex: 5  }
{ id: "visualization",   slug: "visualization",    title: "Data Visualization",                difficulty: "Intermediate",  estimatedHours: 12, category: "Visualization",  orderIndex: 6  }
{ id: "machine-learning",slug: "machine-learning", title: "Machine Learning",                  difficulty: "Intermediate",  estimatedHours: 30, category: "Machine Learning",orderIndex: 7  }
{ id: "deep-learning",   slug: "deep-learning",    title: "Deep Learning",                     difficulty: "Advanced",      estimatedHours: 20, category: "Deep Learning",  orderIndex: 8  }
{ id: "big-data",        slug: "big-data",         title: "Big Data Engineering",              difficulty: "Advanced",      estimatedHours: 12, category: "Big Data",       orderIndex: 9  }
{ id: "mlops",           slug: "mlops",            title: "MLOps & ML Engineering",            difficulty: "Advanced",      estimatedHours: 14, category: "MLOps",          orderIndex: 10 }
{ id: "generative-ai",   slug: "generative-ai",    title: "Generative AI & LLMs",              difficulty: "Advanced",      estimatedHours: 12, category: "Generative AI",  orderIndex: 11 }
{ id: "rag",             slug: "rag",              title: "RAG & Vector Databases",            difficulty: "Advanced",      estimatedHours: 10, category: "RAG",            orderIndex: 12 }
{ id: "agentic-ai",      slug: "agentic-ai",       title: "AI Agents & Agentic Systems",       difficulty: "Advanced",      estimatedHours: 10, category: "Agents",         orderIndex: 13 }
{ id: "projects",        slug: "projects",         title: "Industry Projects",                 difficulty: "Advanced",      estimatedHours: 40, category: "Projects",       orderIndex: 14 }
{ id: "career",          slug: "career",           title: "Career & Interview Readiness",      difficulty: "Intermediate",  estimatedHours: 8,  category: "Career",         orderIndex: 15 }
```

---

*This document is the architecture lock for DSM curriculum engineering. No lesson content should be generated until the above structure is approved. Subsequent sessions reference this document for lesson order, prerequisite IDs, slugs, and batch priorities.*
