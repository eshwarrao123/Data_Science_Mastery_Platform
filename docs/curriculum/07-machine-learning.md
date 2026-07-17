# Domain 7 — Machine Learning

| Field | Value |
|---|---|
| Course slug | `machine-learning` |
| Order | 7 |
| Category | Machine Learning |
| Difficulty | Intermediate → Advanced |
| Estimated hours | 30 |
| Prerequisites | Data Analysis + Math & Statistics |

Workflow first, algorithms second. Every algorithm lesson covers intuition,
when to use it, how it learns, assumptions, key parameters, strengths,
weaknesses, evaluation, common mistakes, and interview relevance.

## Learning outcomes

- Frame problems, split data honestly, and avoid leakage
- Fit, tune, and evaluate regression and classification models
- Explain bias-variance and act on the diagnosis
- Cluster and reduce dimensionality when there are no labels
- Compose everything into leakage-safe sklearn pipelines
- Ship three end-to-end modeling projects

## Modules

| Order | Slug | Title |
|---|---|---|
| 1 | `foundations` | ML Foundations |
| 2 | `regression` | Regression |
| 3 | `classification` | Classification |
| 4 | `unsupervised` | Unsupervised Learning |
| 5 | `tuning` | Model Selection & Tuning |
| 6 | `ml-projects` | ML Projects |

## Lessons — module `foundations`

| # | Title | Slug | Difficulty | Time | XP | Prerequisite | Key concepts | Status |
|---|---|---|---|---|---|---|---|---|
| 7.1 | What Is Machine Learning? | `what-is-machine-learning` | Intermediate | 25 min | 70 | `math-statistics.descriptive.central-tendency` | learning from data, features/targets, ML vs rules | planned |
| 7.2 | Supervised, Unsupervised & Reinforcement | `supervised-unsupervised-rl` | Intermediate | 25 min | 70 | `machine-learning.foundations.what-is-machine-learning` | paradigm taxonomy, problem framing | planned |
| 7.3 | The ML Workflow | `the-ml-workflow` | Intermediate | 30 min | 70 | `machine-learning.foundations.supervised-unsupervised-rl` | end-to-end workflow, baselines, iteration | planned |
| 7.4 | Train/Test Split & Cross-Validation | `train-test-split-and-cv` | Intermediate | 35 min | 80 | `machine-learning.foundations.the-ml-workflow` | holdout, k-fold, leakage | planned |
| 7.5 | Feature Engineering Basics | `feature-engineering-basics` | Intermediate | 35 min | 80 | `machine-learning.foundations.train-test-split-and-cv` | encoding, scaling, derived features | planned |
| 7.6 | Evaluation Metrics — Regression | `evaluation-metrics-regression` | Intermediate | 30 min | 80 | `machine-learning.foundations.the-ml-workflow` | MAE, MSE, RMSE, R² | planned |
| 7.7 | Evaluation Metrics — Classification | `evaluation-metrics-classification` | Intermediate | 35 min | 80 | `machine-learning.foundations.evaluation-metrics-regression` | confusion matrix, precision/recall, ROC-AUC | planned |

## Lessons — module `regression`

| # | Title | Slug | Difficulty | Time | XP | Prerequisite | Key concepts | Status |
|---|---|---|---|---|---|---|---|---|
| 7.8 | Linear Regression | `linear-regression` | Intermediate | 40 min | 80 | `machine-learning.foundations.evaluation-metrics-regression` | least squares, coefficients, assumptions | planned |
| 7.9 | Multiple Linear Regression | `multiple-linear-regression` | Intermediate | 35 min | 80 | `machine-learning.regression.linear-regression` | multicollinearity, interpretation | planned |
| 7.10 | Polynomial Regression | `polynomial-regression` | Intermediate | 35 min | 80 | `machine-learning.regression.multiple-linear-regression` | nonlinearity, degree choice, overfitting | planned |
| 7.11 | Ridge & Lasso Regularization | `ridge-and-lasso` | Intermediate | 35 min | 90 | `machine-learning.regression.polynomial-regression` | L1/L2 penalties, shrinkage, sparsity | planned |
| 7.12 | Decision Trees for Regression | `decision-trees-regression` | Intermediate | 35 min | 80 | `machine-learning.regression.linear-regression` | splits, depth, tree overfitting | planned |

## Lessons — module `classification`

| # | Title | Slug | Difficulty | Time | XP | Prerequisite | Key concepts | Status |
|---|---|---|---|---|---|---|---|---|
| 7.13 | Logistic Regression | `logistic-regression` | Intermediate | 40 min | 80 | `machine-learning.foundations.evaluation-metrics-classification` | sigmoid, log-odds, thresholds | planned |
| 7.14 | K-Nearest Neighbors | `k-nearest-neighbors` | Intermediate | 30 min | 70 | `machine-learning.classification.logistic-regression` | distance, k choice, scaling need | planned |
| 7.15 | Decision Trees for Classification | `decision-trees-classification` | Intermediate | 35 min | 80 | `machine-learning.regression.decision-trees-regression` | gini/entropy, pruning | planned |
| 7.16 | Random Forests | `random-forests` | Intermediate | 40 min | 90 | `machine-learning.classification.decision-trees-classification` | bagging, feature importance | planned |
| 7.17 | Gradient Boosting & XGBoost | `gradient-boosting-xgboost` | Advanced | 45 min | 100 | `machine-learning.classification.random-forests` | boosting, learning rate, early stopping | planned |
| 7.18 | Support Vector Machines | `support-vector-machines` | Advanced | 40 min | 100 | `machine-learning.classification.logistic-regression` | margins, kernels, C/gamma | planned |
| 7.19 | Naive Bayes | `naive-bayes` | Intermediate | 30 min | 70 | `math-statistics.probability.conditional-probability-and-bayes` | conditional independence, text classification | planned |

## Lessons — module `unsupervised`

| # | Title | Slug | Difficulty | Time | XP | Prerequisite | Key concepts | Status |
|---|---|---|---|---|---|---|---|---|
| 7.20 | K-Means Clustering | `k-means-clustering` | Intermediate | 40 min | 80 | `machine-learning.foundations.the-ml-workflow` | centroids, inertia, elbow method | planned |
| 7.21 | Hierarchical Clustering | `hierarchical-clustering` | Intermediate | 35 min | 80 | `machine-learning.unsupervised.k-means-clustering` | linkage, dendrograms | planned |
| 7.22 | DBSCAN | `dbscan` | Advanced | 35 min | 90 | `machine-learning.unsupervised.hierarchical-clustering` | density, noise points, eps/min_samples | planned |
| 7.23 | Principal Component Analysis (PCA) | `pca` | Advanced | 40 min | 100 | `math-statistics.linear-algebra.eigenvalues-and-eigenvectors` | variance projection, components, scree | planned |
| 7.24 | t-SNE & UMAP | `tsne-and-umap` | Advanced | 35 min | 100 | `machine-learning.unsupervised.pca` | manifold intuition, visualization-only caveats | planned |

## Lessons — module `tuning`

| # | Title | Slug | Difficulty | Time | XP | Prerequisite | Key concepts | Status |
|---|---|---|---|---|---|---|---|---|
| 7.25 | Bias-Variance Tradeoff | `bias-variance-tradeoff` | Advanced | 35 min | 90 | `machine-learning.foundations.train-test-split-and-cv` | under/overfitting, learning curves | planned |
| 7.26 | Hyperparameter Tuning | `hyperparameter-tuning` | Advanced | 40 min | 90 | `machine-learning.tuning.bias-variance-tradeoff` | grid/random search, nested CV | planned |
| 7.27 | Feature Selection | `feature-selection` | Advanced | 35 min | 90 | `machine-learning.foundations.feature-engineering-basics` | filter/wrapper/embedded methods | planned |
| 7.28 | Handling Class Imbalance (SMOTE) | `handling-class-imbalance` | Advanced | 30 min | 90 | `machine-learning.foundations.evaluation-metrics-classification` | resampling, class weights, metric choice | planned |
| 7.29 | Pipelines with scikit-learn | `sklearn-pipelines` | Advanced | 40 min | 100 | `machine-learning.tuning.hyperparameter-tuning` | Pipeline, ColumnTransformer, leakage safety | planned |

## Lessons — module `ml-projects`

| # | Title | Slug | Difficulty | Time | XP | Prerequisite | Key concepts | Status |
|---|---|---|---|---|---|---|---|---|
| 7.30 | 🏗 Project: Predict House Prices | `project-house-prices` | Intermediate | 90 min | 200 | `machine-learning.regression.ridge-and-lasso` | regression end-to-end | planned |
| 7.31 | 🏗 Project: Customer Churn Prediction | `project-customer-churn` | Advanced | 120 min | 300 | `machine-learning.classification.gradient-boosting-xgboost` | classification end-to-end, imbalance | planned |
| 7.32 | 🏗 Project: Sales Forecasting | `project-sales-forecasting` | Advanced | 120 min | 300 | `machine-learning.tuning.sklearn-pipelines` | temporal features, pipeline, backtesting | planned |

Domain status: 0/32 implemented. Exercise ID prefix: `ml01`–`ml32`.
