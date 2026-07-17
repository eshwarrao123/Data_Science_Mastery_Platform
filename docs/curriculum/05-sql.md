# Domain 5 — SQL & Databases

| Field | Value |
|---|---|
| Course slug | `sql` |
| Order | 5 |
| Category | Databases |
| Difficulty | Beginner → Advanced |
| Estimated hours | 16 |
| Prerequisites | None strictly; data-analysis mental models help |

From SELECT to window functions and schema design — the query skills every
data interview assumes.

## Learning outcomes

- Query, filter, sort, and aggregate relational data fluently
- Combine tables with every join type and reason about row counts
- Structure complex logic with subqueries, CTEs, and window functions
- Explain normalization, indexes, and transactions at interview depth
- Run a full business analysis in pure SQL

## Modules

| Order | Slug | Title |
|---|---|---|
| 1 | `foundations` | SQL Foundations |
| 2 | `joins` | Joins |
| 3 | `advanced` | Advanced SQL |
| 4 | `design` | Database Design |
| 5 | `analysis` | SQL for Analysis |

## Lessons — module `foundations`

| # | Title | Slug | Difficulty | Time | XP | Prerequisite | Key concepts | Status |
|---|---|---|---|---|---|---|---|---|
| 5.1 | What Is a Database? | `what-is-a-database` | Beginner | 20 min | 40 | — | tables, rows, RDBMS, SQL dialects | implemented |
| 5.2 | SELECT & FROM | `select-and-from` | Beginner | 25 min | 50 | `sql.foundations.what-is-a-database` | projection, aliases, DISTINCT | implemented |
| 5.3 | WHERE & Filtering | `where-and-filtering` | Beginner | 25 min | 50 | `sql.foundations.select-and-from` | predicates, IN/BETWEEN/LIKE, NULL logic | implemented |
| 5.4 | ORDER BY & LIMIT | `order-by-and-limit` | Beginner | 20 min | 40 | `sql.foundations.where-and-filtering` | sorting, pagination, top-N | implemented |
| 5.5 | Aggregate Functions | `aggregate-functions` | Beginner | 30 min | 60 | `sql.foundations.select-and-from` | COUNT/SUM/AVG/MIN/MAX, NULL behavior | implemented |
| 5.6 | GROUP BY & HAVING | `group-by-and-having` | Beginner | 30 min | 60 | `sql.foundations.aggregate-functions` | grouping, HAVING vs WHERE | implemented |

## Lessons — module `joins`

| # | Title | Slug | Difficulty | Time | XP | Prerequisite | Key concepts | Status |
|---|---|---|---|---|---|---|---|---|
| 5.7 | INNER JOIN | `inner-join` | Intermediate | 30 min | 70 | `sql.foundations.select-and-from` | join keys, matching semantics | implemented |
| 5.8 | LEFT & RIGHT JOINs | `left-and-right-joins` | Intermediate | 30 min | 70 | `sql.joins.inner-join` | outer joins, unmatched rows, NULL fill | implemented |
| 5.9 | FULL OUTER JOIN | `full-outer-join` | Intermediate | 25 min | 60 | `sql.joins.left-and-right-joins` | full outer, reconciliation patterns | implemented |
| 5.10 | Self Joins | `self-joins` | Intermediate | 25 min | 70 | `sql.joins.inner-join` | aliased self-reference, hierarchies | implemented |
| 5.11 | Multiple Joins | `multiple-joins` | Intermediate | 30 min | 80 | `sql.joins.left-and-right-joins` | multi-table chains, fan-out risk | implemented |

## Lessons — module `advanced`

| # | Title | Slug | Difficulty | Time | XP | Prerequisite | Key concepts | Status |
|---|---|---|---|---|---|---|---|---|
| 5.12 | Subqueries | `subqueries` | Intermediate | 35 min | 80 | `sql.joins.inner-join` | scalar/IN/correlated subqueries | implemented |
| 5.13 | CTEs (Common Table Expressions) | `ctes` | Intermediate | 35 min | 80 | `sql.advanced.subqueries` | WITH, readability, recursion intro | implemented |
| 5.14 | Window Functions in SQL | `window-functions-sql` | Advanced | 40 min | 90 | `sql.advanced.ctes` | OVER, PARTITION BY, rank/lag/lead | implemented |
| 5.15 | CASE Statements | `case-statements` | Intermediate | 30 min | 70 | `sql.foundations.select-and-from` | conditional columns, pivot-style counting | implemented |
| 5.16 | String & Date Functions | `string-and-date-functions` | Intermediate | 30 min | 70 | `sql.foundations.select-and-from` | text functions, date math, truncation | implemented |

## Lessons — module `design`

| # | Title | Slug | Difficulty | Time | XP | Prerequisite | Key concepts | Status |
|---|---|---|---|---|---|---|---|---|
| 5.17 | Database Design Concepts | `database-design-concepts` | Intermediate | 30 min | 70 | `sql.foundations.what-is-a-database` | keys, relationships, ER thinking | implemented |
| 5.18 | Normalization | `normalization` | Intermediate | 35 min | 80 | `sql.design.database-design-concepts` | 1NF–3NF, denormalization trade-offs | implemented |
| 5.19 | Indexes & Query Optimization | `indexes-and-optimization` | Advanced | 35 min | 90 | `sql.design.normalization` | indexes, EXPLAIN, query cost | implemented |
| 5.20 | Transactions & ACID | `transactions-and-acid` | Advanced | 30 min | 90 | `sql.design.normalization` | transactions, ACID, isolation intuition | implemented |

## Lessons — module `analysis`

| # | Title | Slug | Difficulty | Time | XP | Prerequisite | Key concepts | Status |
|---|---|---|---|---|---|---|---|---|
| 5.21 | SQL for EDA | `sql-for-eda` | Intermediate | 40 min | 90 | `sql.advanced.window-functions-sql` | profiling queries, cohorts, funnels | implemented |
| 5.22 | 🏗 Project: Business Analysis in SQL | `project-sql-business-analysis` | Intermediate | 90 min | 300 | `sql.analysis.sql-for-eda` | end-to-end analysis, stakeholder answers | implemented |

Domain status: 22/22 implemented — domain complete and verified (2026-07-17). Exercise ID prefix: `sql01`–`sql22`.
Lesson `language` field: `sql`.
