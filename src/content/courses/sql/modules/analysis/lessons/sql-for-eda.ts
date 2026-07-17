import type { Lesson } from "@/lib/curriculum/types";

export const sqlForEda: Lesson = {
  meta: {
    id: "sql.analysis.sql-for-eda",
    slug: "sql-for-eda",
    title: "SQL for EDA",
    description:
      "Turn SQL into an exploration tool: profile unknown tables, bucket distributions, build monthly cohort retention matrices, and measure conversion funnels with CTEs.",
    estimatedTime: "40 mins",
    difficulty: "Intermediate",
    xpReward: 90,
    prerequisites: ["sql.advanced.window-functions-sql"],
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
        hook: "You've been handed read access to a production database and a question: 'How is retention trending?' No data dictionary, no notebook — the warehouse IS your exploration environment. Analysts at most companies spend more time exploring data in SQL than in pandas, because that's where the data lives. By the end of this lesson you'll profile any unknown table in five queries, and build the two workhorse analyses of product analytics: cohort retention and conversion funnels.",
        what: "SQL for EDA (Exploratory Data Analysis) is the practice of using queries to understand a dataset before analysing it: profiling row counts, NULL rates, and distinct values; bucketing distributions; and composing CTEs (Common Table Expressions) into cohort and funnel analyses that answer product questions directly in the warehouse.",
        why: "Data at real companies lives in warehouses measured in terabytes — you can't download it into a DataFrame. Exploring where the data lives means no sampling bias, no stale exports, and results every teammate can re-run. Without profiling first, your aggregates silently inherit every NULL, duplicate, and orphan key in the table.",
        whereUsed:
          "Every analytics team profiles new tables in SQL before trusting them. Cohort retention and funnel queries are the daily bread of product analysts at every subscription and marketplace business, and both are among the most common SQL interview questions.",
        objectives: [
          "Profile an unknown table: row counts, NULL rates, distinct counts, and min/max ranges in a handful of queries",
          "Bucket a continuous column into a distribution with width_bucket or CASE",
          "Build a monthly cohort retention matrix using DATE_TRUNC and a self-join on user activity",
          "Measure a multi-step conversion funnel with chained CTEs",
          "Sanity-check every result against known totals before trusting it",
        ],
        realWorldApps: [
          {
            company: "Spotify",
            headline: "Cohort retention on listener activity",
            detail:
              "Growth analysts group new listeners by signup month and track what share stream music in month 1, 2, 3 — the retention matrix that tells them whether onboarding changes actually keep people listening.",
          },
          {
            company: "Airbnb",
            headline: "Booking funnel measurement",
            detail:
              "Search → listing view → booking request → confirmed stay. Funnel queries over event tables show where guests drop off, and every experiment is judged by how it moves those step-to-step conversion rates.",
          },
          {
            company: "Stripe",
            headline: "Profiling merchant data before analysis",
            detail:
              "Before any revenue analysis, analysts profile the charges table: NULL rates on payment method, distinct currencies, amount ranges — because a single unprofiled NULL-heavy column can silently understate totals in downstream reports.",
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
            "EDA (Exploratory Data Analysis) in SQL follows a fixed opening sequence: how many rows, which columns hold NULLs, how many distinct values per key column, and what range the numbers span. These four questions cost seconds and catch the problems that would otherwise surface as wrong totals three queries later.",
        },
        {
          type: "code-note",
          code: "SELECT\n  COUNT(*)                              AS total_rows,\n  COUNT(email)                          AS email_present,\n  COUNT(*) - COUNT(email)               AS email_nulls,\n  COUNT(DISTINCT customer_id)           AS distinct_customers,\n  MIN(created_at)                       AS first_row,\n  MAX(created_at)                       AS last_row\nFROM customers;",
          content:
            "The single most useful profiling query. COUNT(*) counts rows; COUNT(email) counts only non-NULL values — so the difference is the NULL count. COUNT(DISTINCT customer_id) versus COUNT(*) tells you whether the column is a true key: if the numbers differ, the table has duplicate customer rows and every join against it can fan out.",
        },
        {
          type: "analogy",
          title: "Profiling is the walk-around inspection",
          content:
            "A pilot walks around the aircraft before every flight — checking flaps, tyres, fuel — not because failures are likely, but because the cost of finding one mid-flight is enormous. Profiling queries are your walk-around: cheap checks on row counts, NULLs, and key uniqueness before you 'take off' into aggregations. The limitation of the analogy: aircraft rarely change between flights, but tables change daily, so you re-profile every time the stakes are high.",
        },
        {
          type: "keypoint",
          title: "The profiling checklist",
          content:
            "1) Row count: COUNT(*). 2) NULL rate per important column: COUNT(*) - COUNT(col). 3) Key uniqueness: COUNT(DISTINCT id) = COUNT(*)? 4) Value ranges: MIN/MAX on dates and amounts — negative amounts and future dates are the classic surprises. 5) Category inventory: GROUP BY on low-cardinality columns to spot casing variants like 'Web' vs 'web'.",
        },
        {
          type: "text",
          content:
            "A distribution tells you the shape of a numeric column — where values cluster and how far the tail stretches. In pandas you'd call .describe() or plot a histogram; in SQL you build the histogram yourself by assigning each row to a bucket and counting rows per bucket. PostgreSQL's width_bucket(value, low, high, n_buckets) does the assignment in one function call.",
        },
        {
          type: "keypoint",
          title: "Cohorts: group users by when they started",
          content:
            "A cohort is a group of users who share a starting event in the same period — usually 'signed up in the same month'. Cohort analysis compares behaviour across cohorts at the same relative age: what share of the January cohort was still active in its second month, versus the February cohort in its second month? DATE_TRUNC('month', signup_date) assigns the cohort; the month difference between an activity date and the cohort month is the cohort age.",
        },
        {
          type: "keypoint",
          title: "Funnels: count users who reach each step",
          content:
            "A funnel is an ordered sequence of steps users move through — visit → signup → first purchase. The funnel query counts DISTINCT users at each step, and the conversion rate between steps is the ratio of adjacent counts. Two rules keep funnels honest: count distinct users, not events (one user can view a page ten times), and require the steps to happen in order (a purchase before a signup is a data problem, not a conversion).",
        },
        {
          type: "expandable",
          title: "Why CTEs are the backbone of analytical SQL",
          content:
            "A CTE (Common Table Expression, the WITH clause) names an intermediate result so the next step can build on it — exactly how you'd chain DataFrame variables in pandas. Funnels and cohorts are naturally multi-step: 'first, find each user's signup month; then, find their active months; then, join and count.' Written as nested subqueries this becomes unreadable; written as three named CTEs it reads top-to-bottom like a recipe. Each CTE is also independently testable: SELECT * FROM the CTE alone and check its row count before adding the next step — the SQL version of inspecting an intermediate DataFrame.",
        },
        {
          type: "warning",
          title: "Sanity-check before you trust",
          content:
            "Every exploratory result needs a reconciliation check against a number you already trust. Funnel step 1 should equal total distinct visitors from the raw table. Every cohort's month-0 retention must be 100% by construction — if it isn't, your join is wrong. The sum of bucket counts must equal the table's row count. A query that runs without errors is not a query that is right.",
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
        title: "The SQL EDA workflow",
        caption:
          "Click each stage — every exploration session moves left to right, and every answer gets reconciled before it ships.",
        nodes: [
          {
            id: "profile",
            label: "Profile",
            sublabel: "counts, NULLs, keys",
            detail:
              "COUNT(*), NULL rates per column, COUNT(DISTINCT id) vs COUNT(*), MIN/MAX ranges. The five-check walk-around that catches duplicates, orphans, and impossible values before any analysis.",
            x: 8,
            y: 30,
            accent: true,
          },
          {
            id: "distribute",
            label: "Distribute",
            sublabel: "buckets & shapes",
            detail:
              "width_bucket or CASE buckets turn a numeric column into a histogram. You learn where values cluster and how long the tail is — which decides whether averages are even safe to quote.",
            x: 32,
            y: 12,
            accent: false,
          },
          {
            id: "segment",
            label: "Segment",
            sublabel: "GROUP BY cuts",
            detail:
              "Slice metrics by category, channel, or plan. Low-cardinality GROUP BYs also double as data-quality checks: six variants of 'web' means string cleaning is needed upstream.",
            x: 32,
            y: 52,
            accent: false,
          },
          {
            id: "cohort",
            label: "Cohort",
            sublabel: "retention matrix",
            detail:
              "DATE_TRUNC assigns each user a start month; joining to activity months and counting distinct users per (cohort, age) cell builds the retention matrix — behaviour compared at the same relative age.",
            x: 58,
            y: 12,
            accent: true,
          },
          {
            id: "funnel",
            label: "Funnel",
            sublabel: "step conversion",
            detail:
              "Chained CTEs count distinct users reaching each ordered step. Step-to-step ratios reveal where users drop off — the number every product experiment is judged against.",
            x: 58,
            y: 52,
            accent: true,
          },
          {
            id: "reconcile",
            label: "Reconcile",
            sublabel: "check vs known totals",
            detail:
              "Bucket counts sum to the row count; funnel step 1 equals total users; month-0 retention is 100%. Only reconciled numbers leave the warehouse.",
            x: 84,
            y: 30,
            accent: false,
          },
        ],
        edges: [
          { from: "profile", to: "distribute" },
          { from: "profile", to: "segment" },
          { from: "distribute", to: "cohort" },
          { from: "segment", to: "funnel" },
          { from: "cohort", to: "reconcile" },
          { from: "funnel", to: "reconcile" },
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
          difficulty: "Easy",
          title: "Profile an unknown orders table",
          scenario:
            "You've just been granted access to an orders table at a subscription-box company. Before anything else: the walk-around.",
          steps: [
            {
              code: "SELECT COUNT(*) AS total_rows,\n       COUNT(DISTINCT order_id) AS distinct_orders\nFROM orders;",
              explanation:
                "First check: is order_id a true key? If total_rows is 5,000 and distinct_orders is 4,988, twelve rows are duplicates and every SUM you run will double-count them. Here both return 5000 — the key is clean.",
            },
            {
              code: "SELECT COUNT(*) - COUNT(customer_id) AS null_customers,\n       COUNT(*) - COUNT(amount)      AS null_amounts,\n       COUNT(*) - COUNT(channel)     AS null_channels\nFROM orders;",
              explanation:
                "NULL rates per column, using the COUNT(*) minus COUNT(col) idiom: COUNT on a column skips NULLs, so the difference is exactly the NULL count. 40 orders have no channel — any 'revenue by channel' cut will silently drop them unless you COALESCE the NULLs into an explicit 'unknown' group.",
            },
            {
              code: "SELECT MIN(amount) AS min_amount,\n       MAX(amount) AS max_amount,\n       MIN(order_date) AS first_order,\n       MAX(order_date) AS last_order\nFROM orders;",
              explanation:
                "Range check. A minimum of -25.00 means refunds or errors live in this column — a decision to make before summing revenue. The date range confirms coverage: 18 months of data, nothing from the future.",
            },
          ],
          output:
            "total_rows | distinct_orders\n      5000 |            5000\n\nnull_customers | null_amounts | null_channels\n             0 |            0 |            40\n\nmin_amount | max_amount | first_order | last_order\n    -25.00 |    1890.00 | 2025-01-03  | 2026-06-30",
        },
        {
          difficulty: "Medium",
          title: "Bucket order values into a distribution",
          scenario:
            "The team quotes 'average order value: $87' in every deck. You want to see the actual shape before trusting that number.",
          steps: [
            {
              code: "SELECT width_bucket(amount, 0, 500, 5) AS bucket,\n       COUNT(*) AS orders\nFROM orders\nWHERE amount > 0\nGROUP BY bucket\nORDER BY bucket;",
              explanation:
                "width_bucket(amount, 0, 500, 5) splits the 0–500 range into five equal $100 buckets and returns which bucket each row lands in. Values above 500 land in bucket 6 (the overflow bucket) — Postgres reserves n_buckets + 1 for values past the upper bound. We exclude the negative refunds found during profiling.",
            },
            {
              code: "SELECT width_bucket(amount, 0, 500, 5) AS bucket,\n       COUNT(*) AS orders,\n       ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 1) AS pct\nFROM orders\nWHERE amount > 0\nGROUP BY bucket\nORDER BY bucket;",
              explanation:
                "Adding a window function over the aggregate: SUM(COUNT(*)) OVER () totals all bucket counts without collapsing the rows, so each bucket also shows its share. The 100.0 (not 100) forces decimal division — integer division would round every share to 0.",
            },
            {
              code: "-- Reconcile: do the buckets account for every positive order?\nSELECT SUM(orders_check.n) AS bucketed_total\nFROM (\n  SELECT COUNT(*) AS n\n  FROM orders WHERE amount > 0\n  GROUP BY width_bucket(amount, 0, 500, 5)\n) AS orders_check;",
              explanation:
                "The reconciliation habit: bucket counts must sum to the positive-order row count (4,962). They do. The distribution itself tells the real story — 71% of orders are under $100, and a small overflow bucket of large orders drags the mean far above the typical order. The $87 'average' describes almost nobody.",
            },
          ],
          output:
            "bucket | orders | pct\n     1 |   3520 | 70.9\n     2 |    880 | 17.7\n     3 |    310 |  6.2\n     4 |    140 |  2.8\n     5 |     60 |  1.2\n     6 |     52 |  1.0\n\nbucketed_total\n          4962",
        },
        {
          difficulty: "Hard",
          title: "Monthly cohort retention matrix",
          scenario:
            "Leadership asks: 'Are the customers we acquired this spring sticking around better than the winter ones?' That question IS a cohort retention matrix.",
          steps: [
            {
              code: "WITH cohorts AS (\n  SELECT customer_id,\n         DATE_TRUNC('month', MIN(order_date)) AS cohort_month\n  FROM orders\n  GROUP BY customer_id\n)",
              explanation:
                "CTE 1: each customer's cohort is the month of their first order. MIN(order_date) finds the first order; DATE_TRUNC('month', ...) snaps it to the first of that month so every March customer shares the value 2026-03-01.",
            },
            {
              code: ", activity AS (\n  SELECT DISTINCT customer_id,\n         DATE_TRUNC('month', order_date) AS active_month\n  FROM orders\n)",
              explanation:
                "CTE 2: one row per (customer, month) in which they placed at least one order. DISTINCT matters — a customer with five April orders should count once in April, not five times.",
            },
            {
              code: ", cohort_ages AS (\n  SELECT c.cohort_month,\n         (EXTRACT(YEAR  FROM a.active_month) - EXTRACT(YEAR  FROM c.cohort_month)) * 12\n       + (EXTRACT(MONTH FROM a.active_month) - EXTRACT(MONTH FROM c.cohort_month)) AS month_age,\n         a.customer_id\n  FROM cohorts c\n  JOIN activity a USING (customer_id)\n)",
              explanation:
                "CTE 3: join each customer's cohort to every month they were active, and compute the cohort age — how many months after joining the activity happened. The year/month arithmetic handles cohorts that span a year boundary (December cohort active in January is age 1, not age -11).",
            },
            {
              code: "SELECT cohort_month,\n       COUNT(DISTINCT customer_id) FILTER (WHERE month_age = 0) AS m0,\n       COUNT(DISTINCT customer_id) FILTER (WHERE month_age = 1) AS m1,\n       COUNT(DISTINCT customer_id) FILTER (WHERE month_age = 2) AS m2\nFROM cohort_ages\nGROUP BY cohort_month\nORDER BY cohort_month;",
              explanation:
                "The pivot: FILTER (WHERE month_age = n) counts only the users active at that age, turning ages into columns. m0 is the cohort's size (everyone is active in their first month by definition — the built-in sanity check). Divide m1 by m0 for the month-1 retention rate: March retains 47% into month 1 versus February's 40% — spring cohorts are indeed stickier.",
            },
          ],
          output:
            "cohort_month | m0  | m1  | m2\n2026-02-01   | 410 | 164 |  98\n2026-03-01   | 380 | 179 | 110\n2026-04-01   | 425 | 191 | 119",
        },
        {
          difficulty: "Hard",
          title: "Conversion funnel with chained CTEs",
          scenario:
            "The product team's signup flow is visit → signup → first purchase. They want conversion rates between each step from the events table (columns: user_id, event_type, event_time).",
          steps: [
            {
              code: "WITH visitors AS (\n  SELECT user_id, MIN(event_time) AS visit_time\n  FROM events\n  WHERE event_type = 'visit'\n  GROUP BY user_id\n)",
              explanation:
                "Step 1 of the funnel: every user who visited, with their FIRST visit time. Taking MIN collapses repeat visits into one row per user — funnels count users, not events.",
            },
            {
              code: ", signups AS (\n  SELECT e.user_id, MIN(e.event_time) AS signup_time\n  FROM events e\n  JOIN visitors v ON v.user_id = e.user_id\n  WHERE e.event_type = 'signup'\n    AND e.event_time >= v.visit_time\n  GROUP BY e.user_id\n)",
              explanation:
                "Step 2: signups, but only for users already in the visitors CTE AND only signups that happened at or after the visit. The time condition enforces step order — a signup logged before any visit is a tracking bug, and letting it through would inflate the funnel.",
            },
            {
              code: ", purchasers AS (\n  SELECT e.user_id\n  FROM events e\n  JOIN signups s ON s.user_id = e.user_id\n  WHERE e.event_type = 'purchase'\n    AND e.event_time >= s.signup_time\n  GROUP BY e.user_id\n)",
              explanation:
                "Step 3 chains off step 2 the same way: purchasers must be signed-up users, purchasing after their signup. Each CTE narrows the previous one — the funnel shape is built into the query structure.",
            },
            {
              code: "SELECT\n  (SELECT COUNT(*) FROM visitors)   AS visited,\n  (SELECT COUNT(*) FROM signups)    AS signed_up,\n  (SELECT COUNT(*) FROM purchasers) AS purchased,\n  ROUND(100.0 * (SELECT COUNT(*) FROM signups)    / (SELECT COUNT(*) FROM visitors), 1) AS visit_to_signup_pct,\n  ROUND(100.0 * (SELECT COUNT(*) FROM purchasers) / (SELECT COUNT(*) FROM signups), 1)  AS signup_to_purchase_pct;",
              explanation:
                "The summary row: counts at each step plus step-to-step conversion. Reconcile: visited (8,000) must equal COUNT(DISTINCT user_id) of visit events in the raw table — it does. The finding: signup converts fine (21.5%), but only 30% of signups ever purchase. The product team now knows exactly which step to attack.",
            },
          ],
          output:
            "visited | signed_up | purchased | visit_to_signup_pct | signup_to_purchase_pct\n   8000 |      1720 |       516 |                21.5 |                   30.0",
        },
        {
          difficulty: "Industry Example",
          title: "Netflix-style engagement cohorts, reconciled",
          scenario:
            "A streaming service analyst is asked whether a January onboarding redesign improved early retention. The answer needs cohorts on both sides of the launch — and a defence against the classic trap.",
          steps: [
            {
              code: "WITH cohorts AS (\n  SELECT profile_id,\n         DATE_TRUNC('month', MIN(watch_date)) AS cohort_month\n  FROM watch_sessions\n  GROUP BY profile_id\n),\nmonthly_active AS (\n  SELECT DISTINCT profile_id,\n         DATE_TRUNC('month', watch_date) AS active_month\n  FROM watch_sessions\n)",
              explanation:
                "Same skeleton as before — the cohort/activity pattern transfers to any 'first event + repeat event' dataset: watch sessions here, orders earlier, logins elsewhere. Learning the pattern once buys every variant.",
            },
            {
              code: "SELECT c.cohort_month,\n       COUNT(DISTINCT c.profile_id) AS cohort_size,\n       COUNT(DISTINCT m.profile_id) FILTER (\n         WHERE m.active_month = c.cohort_month + INTERVAL '1 month'\n       ) AS retained_m1\nFROM cohorts c\nLEFT JOIN monthly_active m USING (profile_id)\nGROUP BY c.cohort_month\nORDER BY c.cohort_month;",
              explanation:
                "cohort_month + INTERVAL '1 month' targets exactly the second calendar month of each cohort's life. The LEFT JOIN keeps cohorts with zero retained users visible as 0 rather than dropping the row — a disappearing cohort looks like missing data, a 0% cohort looks like the emergency it is.",
            },
            {
              code: "-- The trap check: is the newest cohort's m1 even measurable yet?\nSELECT MAX(watch_date) AS data_through FROM watch_sessions;\n-- data_through = 2026-06-30 → the June cohort has had NO month-1 window",
              explanation:
                "The classic cohort trap: the most recent cohort always shows terrible retention because its follow-up window hasn't finished. If data runs through June 30, the June cohort's month-1 (July) hasn't happened — reporting its 0% as a collapse would trigger a false alarm. Professionals grey out incomplete cells.",
            },
            {
              code: "-- Final read: pre-launch vs post-launch month-1 retention\n-- Dec cohort: 118/402 = 29.4%   (old onboarding)\n-- Feb cohort: 151/419 = 36.0%   (new onboarding)\n-- Verdict: +6.6pp month-1 retention after the redesign,\n-- consistent across Feb-Apr cohorts. Ship the finding with\n-- the caveat that seasonality is uncontrolled.",
              explanation:
                "The deliverable is a comparison at the same cohort age, a consistency check across multiple post-launch cohorts, and a stated caveat (winter versus spring viewing habits could contribute). That three-part structure — number, consistency, caveat — is what separates an analysis from a screenshot of a query result.",
            },
          ],
          output:
            "cohort_month | cohort_size | retained_m1\n2025-12-01   |         402 |         118\n2026-01-01   |         431 |         127\n2026-02-01   |         419 |         151\n2026-03-01   |         447 |         160\n2026-04-01   |         438 |         158\n2026-05-01   |         460 |         163\n2026-06-01   |         452 |           0   <- window incomplete, not a collapse",
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
        filename: "eda.sql",
        instructions:
          "A meal-kit subscription service gives you its orders table (order_id, customer_id, amount, order_date). Profile it, then build a two-month cohort check: how many customers placed their first order each month, and how many of those came back the following month.",
        starterCode: "-- Part 1: Profile — total rows, distinct customers, NULL amounts\nSELECT COUNT(*)                    AS total_rows,\n       COUNT(DISTINCT ___)         AS distinct_customers,\n       COUNT(*) - COUNT(___)       AS null_amounts\nFROM orders;\n\n-- Part 2: Cohort sizes and month-1 retention\nWITH cohorts AS (\n  SELECT customer_id,\n         DATE_TRUNC('month', ___(order_date)) AS cohort_month\n  FROM orders\n  GROUP BY customer_id\n),\nactivity AS (\n  SELECT DISTINCT customer_id,\n         DATE_TRUNC('month', order_date) AS active_month\n  FROM orders\n)\nSELECT c.cohort_month,\n       COUNT(DISTINCT c.customer_id) AS cohort_size,\n       COUNT(DISTINCT a.customer_id) FILTER (\n         WHERE a.active_month = c.cohort_month + INTERVAL '___'\n       ) AS retained_m1\nFROM cohorts c\nLEFT JOIN activity a USING (customer_id)\nGROUP BY c.cohort_month\nORDER BY c.cohort_month;",
        solutionCode: "-- Part 1: Profile — total rows, distinct customers, NULL amounts\nSELECT COUNT(*)                    AS total_rows,\n       COUNT(DISTINCT customer_id) AS distinct_customers,\n       COUNT(*) - COUNT(amount)    AS null_amounts\nFROM orders;\n\n-- Part 2: Cohort sizes and month-1 retention\nWITH cohorts AS (\n  SELECT customer_id,\n         DATE_TRUNC('month', MIN(order_date)) AS cohort_month\n  FROM orders\n  GROUP BY customer_id\n),\nactivity AS (\n  SELECT DISTINCT customer_id,\n         DATE_TRUNC('month', order_date) AS active_month\n  FROM orders\n)\nSELECT c.cohort_month,\n       COUNT(DISTINCT c.customer_id) AS cohort_size,\n       COUNT(DISTINCT a.customer_id) FILTER (\n         WHERE a.active_month = c.cohort_month + INTERVAL '1 month'\n       ) AS retained_m1\nFROM cohorts c\nLEFT JOIN activity a USING (customer_id)\nGROUP BY c.cohort_month\nORDER BY c.cohort_month;",
        expectedOutput:
          "total_rows | distinct_customers | null_amounts\n       620 |                240 |            3\n\ncohort_month | cohort_size | retained_m1\n2026-04-01   |         130 |          52\n2026-05-01   |         110 |          41",
        hints: [
          "Part 1: distinct customers means COUNT(DISTINCT customer_id); the NULL count is COUNT(*) minus COUNT(amount), because COUNT on a column skips NULLs.",
          "The cohort month is each customer's FIRST order month — you need an aggregate that picks the earliest date before DATE_TRUNC snaps it to the month.",
          "MIN(order_date) inside DATE_TRUNC('month', ...) gives the first order's month. The GROUP BY customer_id is already in place for it.",
          "Month-1 retention looks exactly one month after the cohort month: INTERVAL '1 month'. The FILTER clause then counts only customers active in that specific month.",
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
          id: "sql21_mcq_01",
          difficulty: "Easy",
          question:
            "A table has 10,000 rows. SELECT COUNT(email) FROM users returns 9,200. What does this tell you?",
          options: [
            "9,200 emails are unique",
            "800 rows have a NULL email — COUNT(column) skips NULLs",
            "The query is missing a GROUP BY",
            "800 emails are duplicated",
          ],
          correctIndex: 1,
          explanation:
            "COUNT(*) counts rows; COUNT(email) counts only non-NULL values in that column. The gap of 800 is exactly the NULL count — the core profiling idiom. Uniqueness would require COUNT(DISTINCT email), which this query doesn't measure.",
        },
        {
          type: "mcq",
          id: "sql21_mcq_02",
          difficulty: "Easy",
          question:
            "In a cohort retention matrix, why is every cohort's month-0 retention 100% by construction?",
          options: [
            "Because retention always starts high and decays",
            "Because the cohort is DEFINED by activity in month 0 — a customer's first order both assigns their cohort and makes them active that month",
            "Because month-0 is excluded from the join",
            "It isn't — month-0 can be below 100%",
          ],
          correctIndex: 1,
          explanation:
            "The cohort month comes from MIN(order_date) — the first activity. That same activity makes the customer 'active' at age 0, so month-0 is always 100%. This is why it works as a built-in sanity check: a month-0 value below 100% proves the join or age arithmetic is broken.",
        },
        {
          type: "mcq",
          id: "sql21_mcq_03",
          difficulty: "Medium",
          question:
            "A funnel query counts 5,000 'add to cart' EVENTS but the analyst reports 5,000 users reached the cart step. What's the flaw?",
          options: [
            "Nothing — events and users are interchangeable in funnels",
            "Events overcount users: one user adding ten items produces ten events. Funnels must COUNT(DISTINCT user_id) per step",
            "The funnel is missing a WHERE clause",
            "Cart events can't be trusted at all",
          ],
          correctIndex: 1,
          explanation:
            "Funnels measure how many PEOPLE reach each step. Counting events inflates any step where users repeat the action — carts especially. COUNT(DISTINCT user_id) per step is the rule; the event count is a different (sometimes also useful) metric that must never be labelled as users.",
        },
        {
          type: "scenario",
          id: "sql21_sc_01",
          difficulty: "Medium",
          scenario:
            "Your retention matrix shows month-1 retention of 40%, 42%, 39%, 41% for February through May cohorts — then 4% for the June cohort. Data runs through June 30. The growth lead wants to escalate a 'retention collapse'.",
          question: "What should you tell them?",
          options: [
            "Escalate — a 10x drop is a genuine emergency",
            "The June cohort's month-1 window (July) hasn't happened yet; the 4% is an incomplete-window artifact, not a collapse. Grey out cells whose follow-up period is unfinished",
            "Average the 4% with the other cohorts to smooth it",
            "Re-run the query — 4% must be a syntax error",
          ],
          correctIndex: 1,
          explanation:
            "The most recent cohort's follow-up window is always incomplete: June signups can only show July activity after July exists in the data. The tiny non-zero value comes from edge-of-month activity. Professional cohort reports mask or annotate incomplete cells — escalating them as findings destroys trust in the analysis.",
        },
        {
          type: "coding",
          id: "sql21_code_01",
          difficulty: "Medium",
          prompt:
            "The events table has (user_id, event_type, event_time) with event types 'view' and 'signup'. Write a query returning three columns: viewers (distinct users with a view), signers (distinct users with a signup AFTER their first view), and the conversion rate as a percentage rounded to 1 decimal. Use CTEs.",
          starterCode:
            "WITH viewers AS (\n  -- distinct users with their first view time\n),\nsigners AS (\n  -- users who signed up at or after their first view\n)\n-- final SELECT with counts and conversion pct\n",
          solutionCode:
            "WITH viewers AS (\n  SELECT user_id, MIN(event_time) AS first_view\n  FROM events\n  WHERE event_type = 'view'\n  GROUP BY user_id\n),\nsigners AS (\n  SELECT DISTINCT e.user_id\n  FROM events e\n  JOIN viewers v ON v.user_id = e.user_id\n  WHERE e.event_type = 'signup'\n    AND e.event_time >= v.first_view\n)\nSELECT\n  (SELECT COUNT(*) FROM viewers) AS viewers,\n  (SELECT COUNT(*) FROM signers) AS signers,\n  ROUND(100.0 * (SELECT COUNT(*) FROM signers)\n              / (SELECT COUNT(*) FROM viewers), 1) AS conversion_pct;",
          expectedOutput: "viewers | signers | conversion_pct\n   2400 |     528 |           22.0",
          tests: [
            {
              name: "Distinct users per step",
              description:
                "Both steps count users, not events — MIN(event_time) + GROUP BY in step 1, DISTINCT in step 2",
            },
            {
              name: "Step ordering enforced",
              description:
                "Signups are only counted when event_time >= the user's first view — out-of-order events are excluded",
            },
            {
              name: "Decimal division",
              description:
                "100.0 (not 100) forces decimal arithmetic so the rate isn't truncated to an integer",
            },
          ],
        },
        {
          type: "scenario",
          id: "sql21_sc_02",
          difficulty: "Hard",
          scenario:
            "You bucket order amounts with width_bucket(amount, 0, 200, 4) and get buckets 1–4 plus a bucket 5 holding 90 rows. Your bucket counts sum to 4,910, but the orders table has 5,000 rows with non-NULL amounts.",
          question: "Where did the 90 missing rows most likely go, and what is bucket 5?",
          options: [
            "Bucket 5 is a Postgres bug; the 90 rows were dropped randomly",
            "Bucket 5 is the overflow bucket for amounts above 200; the missing 90 rows are amounts at or below 0, which land in underflow bucket 0 and were filtered out by a WHERE amount > 0 somewhere — reconciliation caught it",
            "The 90 rows have NULL amounts",
            "GROUP BY silently drops small buckets",
          ],
          correctIndex: 1,
          explanation:
            "width_bucket reserves bucket n_buckets + 1 (here 5) for values above the upper bound and bucket 0 for values below the lower bound. The 90-row shortfall means 90 rows landed outside the counted buckets or were filtered — exactly the kind of silent loss that summing bucket counts against the known row count exists to catch. NULLs were already excluded by the premise.",
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
            "You get read access to a production table you've never seen. Walk me through how you'd profile it before running any analysis.",
          answer:
            "I run a fixed checklist before trusting anything. First, size and key integrity: COUNT(*) versus COUNT(DISTINCT id) — if they differ, the table has duplicates and every join and SUM downstream is at risk. Second, NULL rates on the columns I'll use, with the COUNT(*) minus COUNT(col) idiom, because a NULL-heavy column silently shrinks aggregates and drops rows from GROUP BYs. Third, ranges: MIN and MAX on dates and amounts, hunting for negative amounts, zero-value placeholders, and future dates. Fourth, category inventories: GROUP BY on low-cardinality columns to catch casing and whitespace variants that would split groups. Finally I reconcile one number against something already trusted — a dashboard total or a known row count — because matching an external reference is the fastest way to validate my understanding of the table's grain. The whole ritual takes five queries and a few minutes, and it converts silent errors into visible ones.",
        },
        {
          question:
            "Design a query that produces monthly cohort retention for a subscriptions product. What are the pieces, and what's the classic mistake?",
          answer:
            "Three CTEs. The first assigns each user a cohort: DATE_TRUNC('month', MIN(activity_date)) grouped by user — the month of their first activity. The second builds a distinct (user, active_month) table, using DISTINCT so multiple events in a month count once. The third joins them and computes cohort age as the month difference between active month and cohort month, handling year boundaries with year*12 + month arithmetic. The final SELECT groups by cohort month and pivots ages into columns with COUNT(DISTINCT user_id) FILTER (WHERE age = n). I validate with the built-in check: month-0 must be 100% of cohort size by construction, because the first activity both defines the cohort and counts as activity. The classic mistake is reading the newest cohort's near-zero retention as a collapse when its follow-up window hasn't finished — if data ends June 30, the June cohort's month 1 hasn't happened. I mask incomplete cells rather than report them.",
        },
        {
          question:
            "Before you send an exploratory result to a stakeholder, how do you validate it?",
          answer:
            "Three layers. First, internal reconciliation: parts must sum to wholes — bucket counts to the row count, funnel step 1 to total distinct users, segment revenues to total revenue. Any gap means a filter or join is losing rows somewhere. Second, external reconciliation: I compare one headline number against an independent source — the finance dashboard, a previous report, a back-of-envelope estimate — because two independent paths agreeing is far stronger evidence than one clean-looking query. Third, a plausibility pass: does a 4% retention month follow four 40% months? Did revenue triple in a week? Numbers that would be surprising if true deserve suspicion proportional to their surprise, and most 'amazing findings' at this stage are joins that fanned out or windows that were incomplete. Only after all three do I write the finding — and I ship it with its caveats attached, because a stakeholder who later discovers an undisclosed limitation stops trusting every number after that.",
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
        "1) Aggregating before profiling — a table with duplicate keys or NULL-heavy columns corrupts every downstream number, and profiling costs one query. 2) Counting events instead of distinct users in funnels: one user's ten page views are not ten users. 3) Reading the newest cohort's low retention as a collapse when its follow-up window simply hasn't finished yet. 4) Writing 100 * count_a / count_b with integers — integer division truncates to 0; use 100.0. 5) Forgetting width_bucket's overflow buckets: values outside [low, high) land in bucket 0 or n+1, and ignoring them means your histogram silently drops rows — always reconcile bucket sums against the row count.",
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
        "Try these prompts in the AI Tutor panel: • 'Give me a mystery table schema and quiz me on which profiling queries to run first.' • 'Walk through the cohort retention query one CTE at a time and check my explanation of each.' • 'My funnel shows more signups than visitors — help me debug the possible causes.' • 'Generate a funnel exercise with a planted step-ordering bug and let me find it.' • 'Interview mode: ask me to design a retention query out loud and grade my answer.'",
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
        "EDA (Exploratory Data Analysis) — understanding a dataset's shape and quality before analysing it. Profiling — the opening queries that measure row counts, NULL rates, key uniqueness, and value ranges. NULL rate — the share of rows where a column has no value; COUNT(*) - COUNT(col). Cohort — a group of users who share a starting event in the same period, usually signup month. Cohort age — how many periods after joining an activity occurred. Retention matrix — cohorts as rows, ages as columns, active-user counts (or rates) as cells. Funnel — an ordered sequence of steps with distinct-user counts at each, revealing where users drop off. Conversion rate — the ratio of users at one funnel step to the previous step. CTE (Common Table Expression) — a named intermediate result introduced with WITH, chaining analysis steps readably. width_bucket — PostgreSQL's function assigning a value to one of n equal-width buckets, with 0 and n+1 reserved for out-of-range values. DATE_TRUNC — snaps a timestamp down to a period boundary ('month', 'week'), the standard cohort and trend grouping tool. Reconciliation — checking a result against a known total before trusting it.",
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
        "• Docs: PostgreSQL's aggregate functions page (FILTER clause) and the width_bucket entry under mathematical functions — the two tools this lesson leans on hardest. • Read: any public write-up of cohort analysis from a growth team (Reforge and Amplitude publish good ones) and map their charts back to the three-CTE skeleton you built here. • Practice: load a public dataset into a local Postgres or an online SQL playground and run the full profiling checklist before anything else — make the walk-around automatic. • Next in DSM: the capstone — a complete business analysis in pure SQL where these profiling, cohort, and funnel patterns answer real stakeholder questions end to end.",
    },

    /* ---------------------------------------------------------------- */
    /*  12 — Recap                                                       */
    /* ---------------------------------------------------------------- */
    {
      id: "recap",
      type: "recap",
      tocLabel: "Recap",
      content:
        "✓ Profile before you analyse: COUNT(*) vs COUNT(DISTINCT id) for key integrity, COUNT(*) - COUNT(col) for NULL rates, MIN/MAX for range surprises.\n✓ Distributions in SQL are histograms you build yourself — width_bucket assigns buckets, and bucket counts must reconcile to the row count.\n✓ Cohorts group users by first-activity month (DATE_TRUNC + MIN); the retention matrix counts distinct users per (cohort, age) cell.\n✓ Month-0 retention is 100% by construction — a free correctness check on your join.\n✓ Funnels chain CTEs, count DISTINCT users per step, and enforce step order with time conditions.\n✓ The newest cohort's follow-up window is always incomplete — mask it, don't report it as a collapse.\n✓ Nothing leaves the warehouse unreconciled: parts sum to wholes, and one number matches an external reference.\n\nNext up: 🏗 Project: Business Analysis in SQL. Everything in this course converges — you'll take a five-table e-commerce database and a set of stakeholder questions, and answer them end to end in pure SQL.",
    },
  ],
};
