# Domain 10 — MLOps

| Field | Value |
|---|---|
| Course slug | `mlops` |
| Order | 10 |
| Category | MLOps |
| Difficulty | Advanced |
| Estimated hours | 14 |
| Prerequisites | Machine Learning (a trained model must exist before deployment) |

From notebook to production: engineering discipline, experiment tracking,
deployment, and the pipelines that keep models alive.

## Learning outcomes

- Structure ML code like software: versioned, tested, reproducible
- Track experiments and version models and data
- Serve a model behind a FastAPI endpoint in a container
- Monitor drift and quality in production
- Orchestrate retraining with pipelines and CI/CD

## Modules

| Order | Slug | Title |
|---|---|---|
| 1 | `engineering` | ML Engineering |
| 2 | `tracking` | Experiment Tracking |
| 3 | `deployment` | Model Deployment |
| 4 | `pipelines` | ML Pipelines |

## Lessons — module `engineering`

| # | Title | Slug | Difficulty | Time | XP | Prerequisite | Key concepts | Status |
|---|---|---|---|---|---|---|---|---|
| 10.1 | Software Engineering for Data Science | `software-engineering-for-ds` | Advanced | 30 min | 80 | `machine-learning.ml-projects.project-customer-churn` | modules vs notebooks, testing, reproducibility | planned |
| 10.2 | Git for ML | `git-for-ml` | Advanced | 25 min | 80 | `mlops.engineering.software-engineering-for-ds` | branching, PR flow, what not to commit | planned |
| 10.3 | Docker Basics | `docker-basics` | Advanced | 35 min | 90 | `mlops.engineering.software-engineering-for-ds` | images, containers, Dockerfiles | planned |
| 10.4 | ML Project Structure | `ml-project-structure` | Advanced | 25 min | 80 | `mlops.engineering.git-for-ml` | project layout, config, environments | planned |

## Lessons — module `tracking`

| # | Title | Slug | Difficulty | Time | XP | Prerequisite | Key concepts | Status |
|---|---|---|---|---|---|---|---|---|
| 10.5 | MLflow Tracking | `mlflow-tracking` | Advanced | 35 min | 90 | `mlops.engineering.software-engineering-for-ds` | runs, params/metrics/artifacts | planned |
| 10.6 | Model Versioning | `model-versioning` | Advanced | 30 min | 90 | `mlops.tracking.mlflow-tracking` | model registry, stages, rollback | planned |
| 10.7 | DVC: Data Versioning | `dvc-data-versioning` | Advanced | 30 min | 100 | `mlops.tracking.model-versioning` | data as dependency, DVC pipelines | planned |

## Lessons — module `deployment`

| # | Title | Slug | Difficulty | Time | XP | Prerequisite | Key concepts | Status |
|---|---|---|---|---|---|---|---|---|
| 10.8 | REST APIs with FastAPI | `rest-apis-with-fastapi` | Advanced | 35 min | 90 | `mlops.tracking.mlflow-tracking` | endpoints, request/response models, serving predictions | planned |
| 10.9 | Containerizing ML Models | `containerizing-ml-models` | Advanced | 35 min | 100 | `mlops.deployment.rest-apis-with-fastapi` | model images, dependencies, size hygiene | planned |
| 10.10 | Model Serving Patterns | `model-serving-patterns` | Advanced | 30 min | 100 | `mlops.deployment.containerizing-ml-models` | batch vs online, latency budgets, A/B rollout | planned |
| 10.11 | Monitoring in Production | `monitoring-in-production` | Advanced | 35 min | 110 | `mlops.deployment.model-serving-patterns` | data/concept drift, alerts, retraining triggers | planned |

## Lessons — module `pipelines`

| # | Title | Slug | Difficulty | Time | XP | Prerequisite | Key concepts | Status |
|---|---|---|---|---|---|---|---|---|
| 10.12 | Pipeline Orchestration with Airflow | `pipeline-orchestration-airflow` | Advanced | 35 min | 90 | `mlops.deployment.monitoring-in-production` | DAGs, scheduling, retries | planned |
| 10.13 | CI/CD for ML | `cicd-for-ml` | Advanced | 30 min | 100 | `mlops.pipelines.pipeline-orchestration-airflow` | automated tests, model gates, deployment automation | planned |
| 10.14 | Feature Stores | `feature-stores` | Advanced | 25 min | 90 | `mlops.pipelines.cicd-for-ml` | offline/online features, training-serving skew | planned |
| 10.15 | 🏗 Project: Deploy the Churn Model | `project-deploy-churn-model` | Advanced | 90 min | 300 | `mlops.pipelines.feature-stores` | tracked, containerized, monitored deployment | planned |

Domain status: 0/15 implemented. Exercise ID prefix: `mlo01`–`mlo15`.
