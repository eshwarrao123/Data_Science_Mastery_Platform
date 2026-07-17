# Domain 9 — Big Data

| Field | Value |
|---|---|
| Course slug | `big-data` |
| Order | 9 |
| Category | Big Data |
| Difficulty | Intermediate → Advanced |
| Estimated hours | 12 |
| Prerequisites | Python + Data Analysis + SQL |

When pandas stops fitting in memory: distributed thinking, Spark, and the
cloud warehouses where production data actually lives.

## Learning outcomes

- Recognize when a problem is genuinely "big data" and when it isn't
- Explain distributed computing trade-offs (partitioning, shuffles, laziness)
- Process data at scale with PySpark DataFrames and Spark SQL
- Navigate cloud analytics stacks: S3/Athena, BigQuery, Snowflake

## Modules

| Order | Slug | Title |
|---|---|---|
| 1 | `concepts` | Big Data Concepts |
| 2 | `pyspark` | PySpark |
| 3 | `cloud` | Cloud Platforms |

## Lessons — module `concepts`

| # | Title | Slug | Difficulty | Time | XP | Prerequisite | Key concepts | Status |
|---|---|---|---|---|---|---|---|---|
| 9.1 | What Is Big Data? | `what-is-big-data` | Intermediate | 25 min | 70 | `data-analysis.pandas-core.pandas-dataframes` | volume/velocity/variety, scale thresholds | planned |
| 9.2 | Distributed Computing | `distributed-computing` | Intermediate | 30 min | 80 | `big-data.concepts.what-is-big-data` | partitioning, parallelism, failure handling | planned |
| 9.3 | The Hadoop Ecosystem | `hadoop-ecosystem` | Intermediate | 25 min | 70 | `big-data.concepts.distributed-computing` | HDFS, MapReduce legacy, ecosystem map | planned |
| 9.4 | Data Lakes vs Warehouses | `data-lakes-vs-warehouses` | Intermediate | 25 min | 80 | `big-data.concepts.distributed-computing` | lake/warehouse/lakehouse, file formats | planned |

## Lessons — module `pyspark`

| # | Title | Slug | Difficulty | Time | XP | Prerequisite | Key concepts | Status |
|---|---|---|---|---|---|---|---|---|
| 9.5 | Spark Architecture & RDDs | `spark-architecture-and-rdds` | Advanced | 35 min | 90 | `big-data.concepts.what-is-big-data` | driver/executors, lazy evaluation, RDD lineage | planned |
| 9.6 | PySpark DataFrames | `pyspark-dataframes` | Advanced | 40 min | 100 | `big-data.pyspark.spark-architecture-and-rdds` | DataFrame API, pandas parallels, actions | planned |
| 9.7 | Spark SQL | `spark-sql` | Advanced | 30 min | 90 | `big-data.pyspark.pyspark-dataframes` | temp views, SQL on Spark, Catalyst | planned |
| 9.8 | Spark ML | `spark-ml` | Advanced | 35 min | 100 | `big-data.pyspark.pyspark-dataframes` | MLlib pipelines, distributed training limits | planned |
| 9.9 | Streaming Data Concepts | `streaming-data-concepts` | Advanced | 30 min | 90 | `big-data.pyspark.pyspark-dataframes` | batch vs stream, windows, watermarks | planned |

## Lessons — module `cloud`

| # | Title | Slug | Difficulty | Time | XP | Prerequisite | Key concepts | Status |
|---|---|---|---|---|---|---|---|---|
| 9.10 | AWS S3 & Athena | `aws-s3-and-athena` | Advanced | 30 min | 90 | `big-data.pyspark.pyspark-dataframes` | object storage, serverless SQL, partitions | planned |
| 9.11 | BigQuery for Analysis | `bigquery-for-analysis` | Advanced | 30 min | 90 | `big-data.cloud.aws-s3-and-athena` | columnar warehouses, cost model | planned |
| 9.12 | Snowflake Concepts | `snowflake-concepts` | Advanced | 25 min | 90 | `big-data.cloud.bigquery-for-analysis` | compute/storage separation, warehouses | planned |
| 9.13 | 🏗 Project: PySpark on a Large Dataset | `project-pyspark-large-dataset` | Advanced | 90 min | 300 | `big-data.cloud.snowflake-concepts` | end-to-end Spark analysis | planned |

Domain status: 0/13 implemented. Exercise ID prefix: `bgd01`–`bgd13`.
