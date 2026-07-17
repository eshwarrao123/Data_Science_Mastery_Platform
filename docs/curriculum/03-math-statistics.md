# Domain 3 — Mathematics & Statistics

| Field | Value |
|---|---|
| Course slug | `math-statistics` |
| Order | 3 |
| Category | Mathematics |
| Difficulty | Intermediate |
| Estimated hours | 22 |
| Prerequisites | Domain 2 (Python) — NumPy is used for calculation examples |

Math taught through data science intuition, never as a disconnected textbook:
variance motivates feature scaling, vectors are feature representations,
gradients explain how models learn.

## Learning outcomes

- Summarize any numeric column with the right center/spread/shape measures
- Reason about uncertainty with probability and Bayes' rule
- Run and interpret hypothesis tests, confidence intervals, and A/B tests
- Read data as vectors and matrices; multiply them meaningfully
- Explain gradient descent from derivatives up

## Modules

| Order | Slug | Title |
|---|---|---|
| 1 | `descriptive` | Descriptive Statistics |
| 2 | `probability` | Probability |
| 3 | `inference` | Statistical Inference |
| 4 | `linear-algebra` | Linear Algebra for ML |
| 5 | `calculus` | Calculus for ML |

## Lessons — module `descriptive`

| # | Title | Slug | Difficulty | Time | XP | Prerequisite | Key concepts | Status |
|---|---|---|---|---|---|---|---|---|
| 3.1 | Measures of Central Tendency | `central-tendency` | Beginner | 30 min | 50 | `python.foundations.variables-and-data-types` | mean, median, mode, outlier sensitivity | planned |
| 3.2 | Measures of Spread | `spread-and-variance` | Beginner | 35 min | 60 | `math-statistics.descriptive.central-tendency` | range, variance, std, why models care about scale | planned |
| 3.3 | Percentiles & Quartiles | `percentiles-and-quartiles` | Beginner | 25 min | 50 | `math-statistics.descriptive.spread-and-variance` | percentiles, IQR, box-plot logic | planned |
| 3.4 | Skewness & Kurtosis | `skewness-and-kurtosis` | Intermediate | 30 min | 70 | `math-statistics.descriptive.percentiles-and-quartiles` | distribution shape, tails, transforms | planned |
| 3.5 | Correlation & Covariance | `correlation-and-covariance` | Intermediate | 35 min | 70 | `math-statistics.descriptive.spread-and-variance` | covariance, Pearson r, correlation matrices | planned |

## Lessons — module `probability`

| # | Title | Slug | Difficulty | Time | XP | Prerequisite | Key concepts | Status |
|---|---|---|---|---|---|---|---|---|
| 3.6 | Probability Fundamentals | `probability-fundamentals` | Beginner | 30 min | 60 | `math-statistics.descriptive.central-tendency` | sample space, events, rules, independence | planned |
| 3.7 | Conditional Probability & Bayes | `conditional-probability-and-bayes` | Intermediate | 35 min | 70 | `math-statistics.probability.probability-fundamentals` | conditioning, Bayes' rule, base rates | planned |
| 3.8 | Discrete Distributions | `discrete-distributions` | Intermediate | 35 min | 70 | `math-statistics.probability.probability-fundamentals` | Bernoulli, binomial, Poisson, PMF | planned |
| 3.9 | Continuous Distributions | `continuous-distributions` | Intermediate | 35 min | 70 | `math-statistics.probability.discrete-distributions` | PDF, normal, uniform, exponential | planned |
| 3.10 | Expected Value & Variance | `expected-value-and-variance` | Intermediate | 30 min | 70 | `math-statistics.probability.continuous-distributions` | expectation, variance of a distribution, LLN intuition | planned |

## Lessons — module `inference`

| # | Title | Slug | Difficulty | Time | XP | Prerequisite | Key concepts | Status |
|---|---|---|---|---|---|---|---|---|
| 3.11 | Sampling & Sampling Distributions | `sampling-and-distributions` | Intermediate | 35 min | 70 | `math-statistics.probability.probability-fundamentals` | samples vs population, sampling error | planned |
| 3.12 | The Central Limit Theorem | `central-limit-theorem` | Intermediate | 30 min | 70 | `math-statistics.inference.sampling-and-distributions` | CLT, standard error, why normal shows up | planned |
| 3.13 | Confidence Intervals | `confidence-intervals` | Intermediate | 35 min | 80 | `math-statistics.inference.central-limit-theorem` | CI construction, interpretation traps | planned |
| 3.14 | Hypothesis Testing | `hypothesis-testing` | Intermediate | 40 min | 80 | `math-statistics.inference.confidence-intervals` | null/alternative, test statistics, errors | planned |
| 3.15 | p-values & Statistical Significance | `p-values-and-significance` | Intermediate | 30 min | 80 | `math-statistics.inference.hypothesis-testing` | p-value meaning, alpha, misuse | planned |
| 3.16 | A/B Testing | `ab-testing` | Intermediate | 40 min | 90 | `math-statistics.inference.p-values-and-significance` | experiment design, power, practical significance | planned |

## Lessons — module `linear-algebra`

| # | Title | Slug | Difficulty | Time | XP | Prerequisite | Key concepts | Status |
|---|---|---|---|---|---|---|---|---|
| 3.17 | Vectors & Scalars | `vectors-and-scalars` | Intermediate | 30 min | 70 | `python.python-ds-tools.numpy-operations` | vectors as data points, norms, feature space | planned |
| 3.18 | Matrices & Operations | `matrices-and-operations` | Intermediate | 35 min | 70 | `math-statistics.linear-algebra.vectors-and-scalars` | matrices as datasets, add/scale, transpose | planned |
| 3.19 | Dot Products & Matrix Multiplication | `dot-products` | Intermediate | 35 min | 80 | `math-statistics.linear-algebra.matrices-and-operations` | dot product as similarity, matmul, shapes | planned |
| 3.20 | Eigenvalues & Eigenvectors | `eigenvalues-and-eigenvectors` | Advanced | 40 min | 90 | `math-statistics.linear-algebra.dot-products` | eigen-intuition, directions of variance | planned |
| 3.21 | Dimensionality Concepts | `dimensionality-concepts` | Advanced | 30 min | 90 | `math-statistics.linear-algebra.eigenvalues-and-eigenvectors` | curse of dimensionality, projections | planned |

## Lessons — module `calculus`

| # | Title | Slug | Difficulty | Time | XP | Prerequisite | Key concepts | Status |
|---|---|---|---|---|---|---|---|---|
| 3.22 | Derivatives & Gradients | `derivatives-and-gradients` | Intermediate | 35 min | 70 | `math-statistics.linear-algebra.vectors-and-scalars` | slope, rate of change, gradient direction | planned |
| 3.23 | The Chain Rule | `the-chain-rule` | Intermediate | 30 min | 70 | `math-statistics.calculus.derivatives-and-gradients` | composition, chain rule, backprop seed | planned |
| 3.24 | Partial Derivatives | `partial-derivatives` | Intermediate | 30 min | 80 | `math-statistics.calculus.the-chain-rule` | multivariable slopes, gradient vectors | planned |
| 3.25 | Gradient Descent — Conceptual | `gradient-descent-conceptual` | Intermediate | 35 min | 80 | `math-statistics.calculus.partial-derivatives` | loss surfaces, learning rate, convergence | planned |

Domain status: 0/25 implemented. Exercise ID prefix: `mst01`–`mst25`.
