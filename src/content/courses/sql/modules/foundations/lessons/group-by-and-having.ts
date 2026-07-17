import type { Lesson } from "@/lib/curriculum/types";

export const groupByAndHaving: Lesson = {
  meta: {
    id: "sql.foundations.group-by-and-having",
    slug: "group-by-and-having",
    title: "GROUP BY & HAVING",
    description:
      "Split rows into groups, aggregate each group separately, and filter the groups themselves — the pattern behind every per-category metric.",
    estimatedTime: "30 mins",
    difficulty: "Beginner",
    xpReward: 60,
    prerequisites: ["sql.foundations.aggregate-functions"],
    masteryThreshold: 80,
  },

  blocks: [
    /* ---------------------------------------------------------------- */
    /*  1 — Introduction                                                 */
    /* ---------------------------------------------------------------- */
    {
      id: "intro",
      type: "lesson-intro",
      tocLabel: "Introduction",
      intro: {
        hook: "Last lesson gave you one number for the whole table. But nobody asks 'what's revenue?' — they ask 'what's revenue *per country*, *per month*, *per channel*?' That two-word clause, GROUP BY, is the moment SQL becomes an analytics language.",
        what: "GROUP BY partitions rows into groups that share the same value in one or more columns, then applies aggregate functions to each group separately — one output row per group. HAVING filters those groups after aggregation, the way WHERE filters rows before it.",
        why: "Per-segment metrics are the daily bread of analytics: revenue by region, signups by week, defect rate by factory. Without GROUP BY you'd run one filtered query per category and paste results together by hand. With it, one query returns the whole breakdown — and HAVING lets you keep only the segments that matter.",
        whereUsed:
          "Every 'by' in a business question is a GROUP BY: sales by product, churn by cohort, errors by service. It is also the direct SQL ancestor of pandas' df.groupby() you met in the Data Analysis domain.",
        objectives: [
          "Group rows with GROUP BY and aggregate each group independently",
          "Group by multiple columns and predict the output row count",
          "Explain the rule that SELECT may contain only grouped columns and aggregates",
          "Filter groups with HAVING and rows with WHERE — and articulate the difference",
          "Order the full query pipeline: FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT",
        ],
        realWorldApps: [
          {
            company: "Uber",
            headline: "City-level marketplace health",
            detail:
              "Ops dashboards slice trips by city and hour — GROUP BY city, hour with COUNT(*) and AVG(wait_time) — to spot supply shortages before riders churn.",
          },
          {
            company: "Netflix",
            headline: "Viewing hours by title and country",
            detail:
              "Content teams rank originals with GROUP BY title_id, country over viewing events, feeding both Top-10 rows and renewal decisions.",
          },
          {
            company: "Shopify",
            headline: "GMV by merchant segment",
            detail:
              "Finance reports gross merchandise volume grouped by plan tier and region, with HAVING filters to spotlight segments above materiality thresholds.",
          },
        ],
      },
    },

    /* ---------------------------------------------------------------- */
    /*  2 — Theory                                                       */
    /* ---------------------------------------------------------------- */
    {
      id: "theory",
      type: "theory-blocks",
      tocLabel: "Theory",
      blocks: [
        {
          type: "text",
          content:
            "GROUP BY country collects all rows sharing a country value into one bucket per country, then runs your aggregates once per bucket. The output has exactly one row per group. Grouping by two columns — GROUP BY country, status — creates one group per unique combination, so the output row count is the number of distinct (country, status) pairs actually present in the data.",
        },
        {
          type: "analogy",
          title: "The coin-sorting analogy",
          content:
            "Imagine dumping a jar of coins on a table and sorting them into piles by denomination — all quarters here, all dimes there. GROUP BY builds the piles; the aggregate then does something to each pile independently: COUNT counts the coins in it, SUM adds their value. You never get one number for the jar anymore — you get one number per pile.",
        },
        {
          type: "keypoint",
          title: "The single-value rule",
          content:
            "Once rows are grouped, each output row represents many input rows. So SELECT may only contain: (a) columns you grouped by — they're constant within a group — and (b) aggregates, which summarize the group. Any other bare column is ambiguous (which row's value?) and raises an error like 'column must appear in the GROUP BY clause or be used in an aggregate function'.",
        },
        {
          type: "code-note",
          code: "SELECT country,\n       COUNT(*)     AS orders,\n       SUM(amount)  AS revenue,\n       ROUND(AVG(amount), 2) AS avg_order\nFROM orders\nGROUP BY country;",
          content:
            "One scan, one row per country, three metrics per row. Grouped column (country) and aggregates only — the single-value rule satisfied. This exact shape — dimension plus metrics — is what BI tools generate under the hood for every bar chart.",
        },
        {
          type: "text",
          content:
            "HAVING filters groups after aggregation, and unlike WHERE it may reference aggregates: HAVING SUM(amount) > 10000 keeps only groups whose total clears the bar. WHERE still exists in the same query and still filters rows before grouping. The division of labor is strict: WHERE decides which rows enter the piles; HAVING decides which piles survive.",
        },
        {
          type: "warning",
          title: "WHERE cannot see aggregates",
          content:
            "WHERE SUM(amount) > 10000 is an error — when WHERE runs, no groups exist yet, so there is nothing to sum. The reverse misuse also hurts: putting a row-level condition in HAVING (HAVING country <> 'US') works mechanically but forces the database to build and aggregate groups it will immediately discard. Row conditions belong in WHERE; aggregate conditions belong in HAVING.",
        },
        {
          type: "expandable",
          title: "The full logical evaluation order",
          content:
            "FROM (and JOINs) → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT. This explains every visibility rule you've met: WHERE can't use SELECT aliases (SELECT hasn't run) and can't use aggregates (GROUP BY hasn't run); HAVING can use aggregates but, in standard SQL, not SELECT aliases; ORDER BY runs last of the clauses, so it can use anything, aliases included. When a query confuses you, replay it in this order.",
        },
        {
          type: "expandable",
          title: "NULL forms its own group",
          content:
            "Rows with NULL in the grouping column are collected into one NULL group — unlike WHERE, where NULL comparisons drop rows, GROUP BY keeps them visible. GROUP BY coupon_code on 1,000 orders returns a row per real code plus one row with a NULL label covering the 620 no-coupon orders. That NULL row is often the most important one in the result; don't filter it away by accident.",
        },
        {
          type: "keypoint",
          title: "Sanity-check the group count",
          content:
            "Before trusting a grouped result, predict its row count: GROUP BY country should return about as many rows as COUNT(DISTINCT country). Far more rows than expected usually means you grouped by a near-unique column (like order_id) — each 'group' is one row and the aggregates are meaningless. Groups-of-one is the classic symptom of grouping by the wrong column.",
        },
      ],
    },

    /* ---------------------------------------------------------------- */
    /*  3 — Visual Learning                                              */
    /* ---------------------------------------------------------------- */
    {
      id: "diagram",
      type: "interactive-diagram",
      tocLabel: "Visual Learning",
      visual: {
        kind: "flow",
        title: "The Grouped-Query Pipeline",
        caption:
          "Follow rows left to right: filtered, piled into groups, aggregated, then the piles themselves are filtered. Click each stage for its rules.",
        nodes: [
          {
            id: "from",
            label: "FROM",
            sublabel: "orders",
            detail:
              "The source rows — in real queries, often the output of one or more JOINs. Everything downstream operates on this row stream.",
            x: 6,
            y: 40,
            accent: false,
          },
          {
            id: "where",
            label: "WHERE",
            sublabel: "row filter",
            detail:
              "Filters individual rows BEFORE any grouping — cancelled orders removed here never reach a pile. Cannot reference aggregates: no groups exist yet. Cheaper than HAVING because discarded rows are never aggregated.",
            x: 24,
            y: 40,
            accent: false,
          },
          {
            id: "groupby",
            label: "GROUP BY",
            sublabel: "build piles",
            detail:
              "Partitions surviving rows into groups by the listed columns — one group per distinct value combination, including a single group for NULL. Output rows = number of groups.",
            x: 44,
            y: 40,
            accent: true,
          },
          {
            id: "agg",
            label: "Aggregates",
            sublabel: "per group",
            detail:
              "COUNT/SUM/AVG/MIN/MAX now run once per pile instead of once per table. SELECT may show only grouped columns and these aggregate results — the single-value rule.",
            x: 62,
            y: 40,
            accent: false,
          },
          {
            id: "having",
            label: "HAVING",
            sublabel: "group filter",
            detail:
              "Filters whole groups using aggregate conditions — HAVING SUM(amount) > 10000 discards small piles after they're computed. Row-level conditions technically work here but belong upstream in WHERE.",
            x: 80,
            y: 40,
            accent: true,
          },
          {
            id: "orderby",
            label: "ORDER BY + LIMIT",
            sublabel: "rank groups",
            detail:
              "Runs last: sort the surviving group rows (aliases allowed here) and optionally cut to a top-N. 'Top 5 countries by revenue' is GROUP BY + ORDER BY revenue DESC + LIMIT 5.",
            x: 94,
            y: 40,
            accent: false,
          },
        ],
        edges: [
          { from: "from", to: "where", label: "all rows" },
          { from: "where", to: "groupby", label: "kept rows" },
          { from: "groupby", to: "agg", label: "one pile per value" },
          { from: "agg", to: "having", label: "one row per group" },
          { from: "having", to: "orderby", label: "kept groups" },
        ],
      },
    },

    /* ---------------------------------------------------------------- */
    /*  4 — Worked Examples                                              */
    /* ---------------------------------------------------------------- */
    {
      id: "worked-examples",
      type: "worked-examples",
      tocLabel: "Worked Examples",
      examples: [
        {
          difficulty: "Very Easy",
          title: "Orders per status",
          scenario: "How many orders sit in each status?",
          steps: [
            {
              code: "SELECT status, COUNT(*) AS orders\nFROM orders\nGROUP BY status;",
              explanation:
                "Rows are piled by status value; COUNT(*) counts each pile. Three distinct statuses in the data → exactly three output rows. status may appear bare in SELECT because it's the grouping column — constant within each pile.",
            },
          ],
          output:
            " status    | orders\n-----------+--------\n shipped   |    620\n pending   |    250\n cancelled |    130\n(3 rows)",
        },
        {
          difficulty: "Easy",
          title: "Revenue by country, ranked",
          scenario:
            "Finance wants each country's shipped revenue, biggest market first.",
          steps: [
            {
              code: "SELECT country, SUM(amount) AS revenue\nFROM orders\nWHERE status = 'shipped'",
              explanation:
                "WHERE first: cancelled and pending orders are removed before any pile is built, so they contaminate no country's total.",
            },
            {
              code: "GROUP BY country\nORDER BY revenue DESC;",
              explanation:
                "One row per country, then ORDER BY ranks the groups. Note ORDER BY happily uses the alias revenue — it runs after SELECT in the logical order. Add LIMIT 5 and you have a top-markets query.",
            },
          ],
          output:
            " country | revenue\n---------+----------\n DE      | 48210.50\n US      | 39975.00\n FR      | 21402.25\n(3 rows)",
        },
        {
          difficulty: "Medium",
          title: "Two grouping columns",
          scenario:
            "Product wants order counts broken down by country AND status — the two-dimensional version of the first example.",
          steps: [
            {
              code: "SELECT country, status, COUNT(*) AS orders\nFROM orders\nGROUP BY country, status",
              explanation:
                "Groups form per distinct (country, status) pair: (DE, shipped), (DE, cancelled), (US, shipped)… With 3 countries and 3 statuses the maximum is 9 rows, but only combinations that actually occur appear — empty combinations produce no row at all (a gotcha when charting; missing cells need explicit zero-filling downstream).",
            },
            {
              code: "ORDER BY country, orders DESC;",
              explanation:
                "Sorting by country first keeps each country's rows together; within a country, biggest status bucket first. Both SELECT columns are legal: each is a grouping column.",
            },
          ],
          output:
            " country | status    | orders\n---------+-----------+--------\n DE      | shipped   |    260\n DE      | pending   |     90\n DE      | cancelled |     40\n FR      | shipped   |    130\n FR      | pending   |     60\n US      | shipped   |    230\n US      | cancelled |     55\n(7 rows)",
        },
        {
          difficulty: "Hard",
          title: "WHERE and HAVING in one query",
          scenario:
            "Marketing wants countries whose shipped revenue exceeds €25,000 — cancelled orders excluded from the totals, small markets excluded from the report.",
          steps: [
            {
              code: "SELECT country, SUM(amount) AS revenue\nFROM orders\nWHERE status = 'shipped'",
              explanation:
                "Row filter: only shipped orders enter the piles. Putting this condition in HAVING instead would still exclude the rows' groups incorrectly — worse, it can't even be expressed there without changing meaning; status varies within a country group.",
            },
            {
              code: "GROUP BY country\nHAVING SUM(amount) > 25000",
              explanation:
                "Group filter: totals are computed per country, THEN countries under the bar are discarded. The aggregate in the condition is exactly what HAVING exists for — WHERE would reject it. Note we repeat SUM(amount); standard SQL doesn't let HAVING use the SELECT alias revenue.",
            },
            {
              code: "ORDER BY revenue DESC;",
              explanation:
                "Rank the survivors. Full pipeline in one query: filter rows → group → aggregate → filter groups → sort. FR at 21,402 was computed and then dropped by HAVING — it did enter the piles, unlike cancelled orders which never did.",
            },
          ],
          output:
            " country | revenue\n---------+----------\n DE      | 48210.50\n US      | 39975.00\n(2 rows)",
        },
        {
          difficulty: "Industry Example",
          title: "Finding repeat customers",
          scenario:
            "A retention analyst needs customers with at least 3 shipped orders and €200+ lifetime spend — the seed list for a loyalty-program pilot. This is the GROUP BY + HAVING pattern on a customer key.",
          steps: [
            {
              code: "SELECT\n  customer_id,\n  COUNT(*)    AS order_count,\n  SUM(amount) AS lifetime_spend,\n  MAX(created_at) AS last_order\nFROM orders\nWHERE status = 'shipped'",
              explanation:
                "Grouping key is customer_id — each pile is one customer's shipped order history. MAX(created_at) rides along to show recency, useful for the campaign team, and legal because it's an aggregate.",
            },
            {
              code: "GROUP BY customer_id\nHAVING COUNT(*) >= 3\n   AND SUM(amount) >= 200",
              explanation:
                "Two aggregate conditions combined with AND — HAVING accepts full boolean logic just like WHERE. A customer with 5 orders totaling €150 fails the second test; 2 orders totaling €900 fails the first. Both bars must clear.",
            },
            {
              code: "ORDER BY lifetime_spend DESC;",
              explanation:
                "The output is one row per qualifying customer — effectively a derived 'loyal customers' table. In production this exact query often becomes a CTE or view feeding the campaign tool; you'll learn to name it with WITH in the Advanced module.",
            },
          ],
          output:
            " customer_id | order_count | lifetime_spend | last_order\n-------------+-------------+----------------+------------\n        8421 |           7 |        1240.00 | 2026-07-11\n        9107 |           4 |         618.50 | 2026-07-02\n        7738 |           3 |         402.75 | 2026-06-28\n(3 rows)",
        },
      ],
    },

    /* ---------------------------------------------------------------- */
    /*  5 — Hands-on Practice                                            */
    /* ---------------------------------------------------------------- */
    {
      id: "inline-practice",
      type: "inline-code",
      tocLabel: "Practice Coding",
      coding: {
        language: "sql",
        filename: "query.sql",
        instructions:
          "Build the category report: from order_items (order_item_id, order_id, category, quantity, unit_price), compute per-category revenue (SUM of quantity * unit_price, aliased revenue) and item count (item_count) — but only for non-'misc' categories, and only show categories with revenue over 100. Sort by revenue, highest first. Fill in the blanks.",
        starterCode:
          "-- order_items(order_item_id, order_id, category, quantity, unit_price)\n-- Rows: (1, 101, 'audio', 2, 60.00), (2, 101, 'cables', 10, 4.00),\n--       (3, 102, 'audio', 1, 199.00), (4, 103, 'misc', 50, 9.99),\n--       (5, 103, 'cables', 5, 4.00)\n\nSELECT\n  category,\n  SUM(quantity * unit_price) AS revenue,\n  COUNT(*) AS item_count\nFROM order_items\n___ category <> 'misc'\nGROUP BY ___\n___ SUM(quantity * unit_price) > 100\nORDER BY revenue ___;",
        solutionCode:
          "-- order_items(order_item_id, order_id, category, quantity, unit_price)\n-- Rows: (1, 101, 'audio', 2, 60.00), (2, 101, 'cables', 10, 4.00),\n--       (3, 102, 'audio', 1, 199.00), (4, 103, 'misc', 50, 9.99),\n--       (5, 103, 'cables', 5, 4.00)\n\nSELECT\n  category,\n  SUM(quantity * unit_price) AS revenue,\n  COUNT(*) AS item_count\nFROM order_items\nWHERE category <> 'misc'\nGROUP BY category\nHAVING SUM(quantity * unit_price) > 100\nORDER BY revenue DESC;",
        expectedOutput:
          " category | revenue | item_count\n----------+---------+------------\n audio    | 319.00  |          2\n(1 row)",
        hints: [
          "Four blanks: the row filter keyword, the grouping column, the group filter keyword, and a sort direction.",
          "The 'misc' exclusion is a row-level condition — it belongs in WHERE, before grouping.",
          "The revenue threshold references SUM(…) — an aggregate — so it must live in HAVING, after GROUP BY category.",
          "Check the math: audio = 120 + 199 = 319 (passes); cables = 40 + 20 = 60 (fails HAVING); misc is excluded by WHERE. Highest-first is DESC.",
        ],
      },
    },

    /* ---------------------------------------------------------------- */
    /*  6 — Exercises                                                    */
    /* ---------------------------------------------------------------- */
    {
      id: "exercises",
      type: "mastery-assessment",
      tocLabel: "Quiz & Exercises",
      masteryThreshold: 80,
      exercises: [
        {
          type: "mcq",
          id: "sql06_mcq_01",
          difficulty: "Easy",
          question:
            "orders has rows from 6 distinct countries. How many rows does SELECT country, COUNT(*) FROM orders GROUP BY country; return?",
          options: ["1", "6", "One per order", "Depends on COUNT(*)"],
          correctIndex: 1,
          explanation:
            "GROUP BY produces exactly one output row per group, and there are 6 distinct country values → 6 rows. One row describes ungrouped aggregation. One per order would mean no aggregation happened. The aggregate's value never changes the number of groups — it just fills a column in each group's row.",
        },
        {
          type: "mcq",
          id: "sql06_mcq_02",
          difficulty: "Easy",
          question: "What is the key difference between WHERE and HAVING?",
          options: [
            "HAVING is faster than WHERE",
            "WHERE filters rows before grouping; HAVING filters groups after aggregation",
            "WHERE is optional; HAVING is required with GROUP BY",
            "They are interchangeable when a query has GROUP BY",
          ],
          correctIndex: 1,
          explanation:
            "WHERE runs pre-grouping on individual rows and cannot reference aggregates; HAVING runs post-aggregation on whole groups and exists precisely to test aggregate conditions. WHERE is generally CHEAPER (discarded rows are never aggregated), not slower — and neither clause is required. They're not interchangeable: WHERE SUM(x) > 10 is an error, and moving a row condition into HAVING changes when (and on what) it's evaluated.",
        },
        {
          type: "mcq",
          id: "sql06_mcq_03",
          difficulty: "Medium",
          question:
            "Why does SELECT country, status, COUNT(*) FROM orders GROUP BY country; fail?",
          options: [
            "COUNT(*) can't be combined with two columns",
            "status is neither in GROUP BY nor inside an aggregate, so its value is ambiguous within a group",
            "GROUP BY only accepts one column",
            "The query is valid and returns one row per country",
          ],
          correctIndex: 1,
          explanation:
            "Each output row represents one country's many orders, which span multiple status values — SQL can't pick one, so the single-value rule rejects the bare column. Fixes: add status to GROUP BY (changing the grain to country+status) or aggregate it (e.g. COUNT(DISTINCT status)). Aggregates combine fine with any number of grouped columns, and GROUP BY accepts many columns. The query as written errors in standard-conforming engines rather than returning anything.",
        },
        {
          type: "mcq",
          id: "sql06_mcq_04",
          difficulty: "Medium",
          question:
            "coupon_code is NULL on 620 of 1,000 orders. What does GROUP BY coupon_code do with those rows?",
          options: [
            "Drops them, like WHERE coupon_code = NULL would",
            "Raises an error — grouping columns can't contain NULL",
            "Collects all 620 into a single NULL group with its own output row",
            "Creates 620 separate one-row groups",
          ],
          correctIndex: 2,
          explanation:
            "GROUP BY treats NULLs as equal to each other for grouping purposes, forming one NULL group — here the biggest row in the result, representing no-coupon orders. Nothing is dropped: this is a deliberate contrast with WHERE's three-valued logic. NULL grouping keys are perfectly legal, and NULLs don't each form their own group.",
        },
        {
          type: "scenario",
          id: "sql06_sc_01",
          difficulty: "Hard",
          scenario:
            "A dashboard query reads: SELECT country, SUM(amount) FROM orders GROUP BY country HAVING status = 'shipped'. The database rejects it. A teammate 'fixes' it by moving the condition: …GROUP BY country, status HAVING status = 'shipped' — it now runs, but review flags it.",
          question: "What is the correct assessment?",
          options: [
            "The fix is ideal; HAVING is designed for status filters",
            "The fix works but is wasteful and changes the grain — the row-level condition belongs in WHERE before grouping: WHERE status = 'shipped' GROUP BY country",
            "Both versions are wrong; status filters require a subquery",
            "The original failed only because of a missing alias",
          ],
          correctIndex: 1,
          explanation:
            "The original failed the single-value rule: status isn't constant within a country group, so HAVING can't test it. The 'fix' makes status a grouping column so the test becomes legal — but now the engine builds country×status groups, aggregates all of them, and discards the non-shipped ones after paying for them; the result also computes per-(country,status) sums rather than the intended per-country sums of shipped orders (numerically equal here, but structurally fragile). WHERE status = 'shipped' … GROUP BY country expresses the intent directly and cheaply. No subquery is needed, and aliases were never the issue.",
        },
        {
          type: "coding",
          id: "sql06_code_01",
          difficulty: "Hard",
          prompt:
            "From orders (order_id, customer_id, amount, status), find repeat customers: for shipped orders only, return customer_id, order_count, and total_spend for customers with 2 or more shipped orders, sorted by total_spend descending.",
          starterCode:
            "-- orders(order_id, customer_id, amount, status)\n-- Rows: (1, 10, 100.00, 'shipped'), (2, 10, 150.00, 'shipped'),\n--       (3, 11, 900.00, 'cancelled'), (4, 12, 80.00, 'shipped'),\n--       (5, 13, 60.00, 'shipped'), (6, 13, 70.00, 'shipped'), (7, 13, 90.00, 'shipped')\n\n",
          solutionCode:
            "SELECT\n  customer_id,\n  COUNT(*) AS order_count,\n  SUM(amount) AS total_spend\nFROM orders\nWHERE status = 'shipped'\nGROUP BY customer_id\nHAVING COUNT(*) >= 2\nORDER BY total_spend DESC;",
          expectedOutput:
            " customer_id | order_count | total_spend\n-------------+-------------+-------------\n          10 |           2 |      250.00\n          13 |           3 |      220.00\n(2 rows)",
          tests: [
            {
              name: "Row filter placement",
              description: "The status condition is in WHERE, so customer 11's cancelled 900.00 never enters any group",
            },
            {
              name: "Group filter",
              description: "HAVING COUNT(*) >= 2 removes customer 12 (single order)",
            },
            {
              name: "Correct totals and order",
              description: "Customer 10 (250.00) ranks above customer 13 (220.00)",
            },
          ],
        },
      ],
    },

    /* ---------------------------------------------------------------- */
    /*  7 — Interview Questions                                          */
    /* ---------------------------------------------------------------- */
    {
      id: "interview-questions",
      type: "interview-questions",
      tocLabel: "Interview Prep",
      questions: [
        {
          question:
            "Explain the difference between WHERE and HAVING. When would a query use both?",
          answer:
            "WHERE filters individual rows before any grouping happens — it decides which rows are even eligible to enter a group, and it cannot reference aggregates because none exist yet. HAVING filters whole groups after aggregation — it's the only place an aggregate condition like SUM(amount) > 10000 can live. A query uses both whenever the business question has two filters at different grains: 'countries with over €25k of *shipped* revenue' filters rows by status (WHERE) and groups by total (HAVING). Beyond correctness there's a performance angle: conditions pushed into WHERE shrink the data before the expensive grouping step, while row conditions smuggled into HAVING force the engine to build and aggregate groups it will throw away. My rule of thumb: if the condition mentions an aggregate it must be HAVING; otherwise it belongs in WHERE.",
        },
        {
          question:
            "What does the 'column must appear in the GROUP BY clause or be used in an aggregate function' error mean, and how do you decide which fix is right?",
          answer:
            "It means the SELECT list contains a bare column that isn't a grouping key, so within a group it can hold many different values and the engine has no defensible way to pick one. There are three fixes, and they answer different questions. Adding the column to GROUP BY changes the grain — you now get one row per finer combination, which is right when the column is a real dimension of the question. Wrapping it in an aggregate (MAX(email), MIN(created_at)) keeps the grain and summarizes the column — right when any representative value will do or when it's functionally dependent on the key. Removing it is right when it was never needed. The decision comes from the question's grain: 'revenue per customer' means customer_id is the only grouping key, and anything else in SELECT must be aggregated. I'd also mention the historical MySQL behavior that silently picked an arbitrary value — a reason to be suspicious of old queries migrated from permissive modes.",
        },
        {
          question:
            "A grouped revenue report disagrees with the ungrouped total. What are the likely causes you'd check?",
          answer:
            "First, filter asymmetry: the two queries must share identical WHERE clauses — a status or date filter present in one and not the other is the most common culprit. Second, NULL grouping keys: GROUP BY region includes a NULL group, but if the report drops or hides that row, its revenue silently vanishes from the sum of visible rows; COALESCE(region, 'Unknown') makes it explicit. Third, HAVING: any HAVING threshold removes whole groups after aggregation, so the visible rows genuinely shouldn't sum to the total — the report needs an 'Other' bucket if reconciliation matters. Fourth, join fan-out if the grouped query joins another table: one-to-many joins duplicate order rows and inflate SUMs — I'd verify by comparing COUNT(*) before and after the join. The systematic method is to reconcile stepwise: total → filtered total → grouped totals summed, and find which step introduces the gap.",
        },
      ],
    },

    /* ---------------------------------------------------------------- */
    /*  8 — Common Mistakes                                              */
    /* ---------------------------------------------------------------- */
    {
      id: "common-mistakes",
      type: "callout",
      variant: "warning",
      title: "Common Mistakes to Avoid",
      content:
        "1) Selecting a bare column that isn't grouped or aggregated — the single-value rule error. 2) Writing aggregate conditions in WHERE (WHERE COUNT(*) > 5) — aggregates don't exist until after grouping; use HAVING. 3) Sneaking row-level filters into HAVING — works, but pays to aggregate groups you then discard, and muddies intent; put them in WHERE. 4) Forgetting the NULL group — GROUP BY keeps NULL keys as a real group, and hiding that row breaks reconciliation with totals. 5) Grouping by a near-unique column like order_id — every 'group' has one row, aggregates degenerate, and the query silently answers nothing; sanity-check expected group counts with COUNT(DISTINCT key) first.",
    },

    /* ---------------------------------------------------------------- */
    /*  9 — AI Tutor Prompts                                             */
    /* ---------------------------------------------------------------- */
    {
      id: "ai-tutor",
      type: "callout",
      variant: "tip",
      title: "Ask the AI Tutor",
      content:
        "Try these prompts in the AI Tutor panel: • 'ELI5: GROUP BY with a coin-sorting or laundry-sorting analogy of your own.' • 'Quiz me: show small tables and grouped queries — I predict the exact output rows.' • 'Show me a real bug where a filter in HAVING should have been in WHERE.' • 'Walk me through the logical clause order FROM→WHERE→GROUP BY→HAVING→SELECT→ORDER BY with one query.' • 'Interview mode: ask me to write a repeat-customers query and critique my clause placement.'",
    },

    /* ---------------------------------------------------------------- */
    /*  10 — Glossary                                                    */
    /* ---------------------------------------------------------------- */
    {
      id: "glossary",
      type: "callout",
      variant: "info",
      title: "Glossary",
      content:
        "GROUP BY — clause that partitions rows into groups by column values, one output row per group. Group (bucket/pile) — the set of rows sharing the same grouping-key values. Grouping key — the column(s) listed in GROUP BY. Grain — the level of detail of a result: what one row represents (per country, per customer-month…). Single-value rule — SELECT may contain only grouping columns and aggregates. HAVING — post-aggregation filter on groups; may reference aggregates. Logical evaluation order — FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT. NULL group — the single group formed by rows whose grouping key is NULL. Fan-out — row duplication from one-to-many joins that inflates grouped sums. Dimension — a categorical column you group by; Metric — an aggregated value you compute per dimension.",
    },

    /* ---------------------------------------------------------------- */
    /*  11 — Recommended Resources                                       */
    /* ---------------------------------------------------------------- */
    {
      id: "resources",
      type: "callout",
      variant: "info",
      title: "Recommended Resources",
      content:
        "• Docs: PostgreSQL manual — 'GROUP BY and HAVING clauses' (and peek at GROUPING SETS/ROLLUP for where this road leads). • Read: Mode's SQL tutorial chapters on GROUP BY and HAVING for stakeholder-flavored practice. • Practice: take last lesson's profiling battery and re-run it grouped — one row per category instead of one row per table; then add a HAVING to keep only categories above a threshold. • Next in DSM: grouping summarizes one table — INNER JOIN, first lesson of the Joins module, teaches you to combine two.",
    },

    /* ---------------------------------------------------------------- */
    /*  12 — Recap                                                       */
    /* ---------------------------------------------------------------- */
    {
      id: "recap",
      type: "recap",
      tocLabel: "Recap",
      content:
        "✓ GROUP BY partitions rows by column values and runs aggregates once per group — one output row per group, NULL keys included as their own group.\n✓ Multiple grouping columns create one group per distinct value combination; predict row counts with COUNT(DISTINCT …).\n✓ The single-value rule: SELECT may contain only grouping columns and aggregates.\n✓ WHERE filters rows before grouping and can't see aggregates; HAVING filters groups after aggregation and exists for aggregate conditions.\n✓ The logical order — FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT — explains every visibility rule.\n✓ Top-segment questions combine the whole toolkit: filter, group, aggregate, filter groups, rank, cut.\n\nNext up: INNER JOIN. Every query so far lived in one table — but customers live in one table and their orders in another. The Joins module starts with the join type that powers 90% of real queries.",
    },
  ],
};
