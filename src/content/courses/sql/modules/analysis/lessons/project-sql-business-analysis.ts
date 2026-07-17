import type { Lesson } from "@/lib/curriculum/types";

export const projectSqlBusinessAnalysis: Lesson = {
  meta: {
    id: "sql.analysis.project-sql-business-analysis",
    slug: "project-sql-business-analysis",
    title: "🏗 Project: Business Analysis in SQL",
    description:
      "Capstone: answer a CEO's four real questions about an e-commerce business — revenue trends, customer value, product performance, and retention — in pure SQL, end to end.",
    estimatedTime: "90 mins",
    difficulty: "Intermediate",
    xpReward: 300,
    prerequisites: ["sql.analysis.sql-for-eda"],
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
        hook: "Monday, 9:04 AM. The CEO's message: 'Board meeting Thursday. I need to know: is revenue actually growing, who are our best customers, which products carry us, and are people coming BACK? Numbers, not vibes.' No notebook, no BI tool set up — you have a database, SQL, and three days. This lesson is those three days.",
        what: "A complete business analysis conducted entirely in SQL against the e-commerce schema you know (customers, orders, order_items, products). You'll follow the professional arc: translate vague stakeholder questions into precise queries, profile the data before trusting it, build the four deliverables (revenue trend, customer segmentation, product Pareto, cohort retention), and package findings with the caveats that make them credible. Every technique comes from earlier lessons — this is where they compose.",
        why: "Interviews and jobs don't ask 'write a LEFT JOIN' — they hand you a fuzzy business question and watch whether you can decompose it, defend your definitions, and ship numbers someone can act on. The gap between knowing SQL and doing analysis is exactly this composition skill. Completing this project gives you a portfolio-grade artifact and the confidence that no stakeholder question needs to wait for 'the data team'.",
        whereUsed:
          "Every analytics take-home exercise, the first month of every data job, board-deck preparation, and any moment someone senior says 'can you pull the numbers on that?'",
        objectives: [
          "Translate open-ended stakeholder questions into precise, defensible SQL definitions",
          "Profile and sanity-check unfamiliar data before reporting from it",
          "Build a monthly revenue trend with growth rates (DATE_TRUNC + window functions)",
          "Segment customers by recency, frequency, and monetary value (RFM)",
          "Quantify product concentration (Pareto) and monthly cohort retention",
          "Present findings with explicit definitions and caveats",
        ],
        realWorldApps: [
          {
            company: "Wayfair",
            headline: "Analytics take-homes mirror this exactly",
            detail:
              "E-commerce analyst interviews hand candidates an orders schema and questions like 'which categories drive repeat purchasing?' — this project is that exercise, rehearsed.",
          },
          {
            company: "Glossier",
            headline: "Retention is the business model",
            detail:
              "DTC brands live on repeat purchase rate; monthly cohort retention tables — the exact query you'll write — are standing agenda items in their growth reviews.",
          },
          {
            company: "Costco",
            headline: "Concentration analysis drives strategy",
            detail:
              "Retailers track how much revenue their top SKUs and top members represent; your Pareto query is the same math that justifies their famously curated product count.",
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
      tocLabel: "Project Method",
      blocks: [
        {
          type: "text",
          content:
            "Step zero of any analysis is translation. 'Is revenue growing?' hides three decisions you must make explicit: WHAT counts as revenue (shipped orders only? net of refunds? item price × quantity or order amount?), over WHAT grain (monthly — daily is noise, quarterly hides turns), and growing RELATIVE TO WHAT (prior month? same month last year?). Professionals write these definitions down BEFORE querying, because every downstream number inherits them — and because 'how did you define revenue?' is the first question any competent audience asks.",
        },
        {
          type: "keypoint",
          title: "Profile before you report",
          content:
            "Never report from data you haven't profiled. The 15-minute checklist from SQL for EDA, applied always: row counts per table; date range actually covered (MIN/MAX of created_at — is the last month partial?); NULL rates on the columns your analysis leans on; status value distribution (what fraction of orders are cancelled?); duplicate checks on keys; and referential spot-checks (order_items rows without a matching product?). Ten minutes here prevents the worst professional outcome: presenting numbers, then retracting them.",
        },
        {
          type: "analogy",
          title: "The general-contractor analogy",
          content:
            "Individual SQL skills are trades — plumbing (joins), electrical (window functions), framing (aggregation). A project makes you the general contractor: sequencing the trades, inspecting each stage before building on it, and delivering something a client can walk into. Nobody hires a contractor because they own a saw; they hire the ability to turn 'we want a kitchen' into a finished room. This lesson is your first kitchen.",
        },
        {
          type: "code-note",
          code: "-- The project's backbone: one clean base, four analyses on top\nWITH base_orders AS (\n  SELECT o.order_id, o.customer_id, o.created_at,\n         SUM(oi.quantity * oi.price_at_purchase) AS order_revenue\n  FROM orders o\n  JOIN order_items oi ON oi.order_id = o.order_id\n  WHERE o.status = 'shipped'          -- definition: revenue = shipped\n    AND o.created_at >= '2025-07-01'  -- definition: last 12 full months\n    AND o.created_at <  '2026-07-01'  -- half-open, boundary-exact\n  GROUP BY o.order_id, o.customer_id, o.created_at\n)\nSELECT ...  -- every deliverable selects FROM base_orders",
          content:
            "Architecture, not just a query: encode the definitions ONCE in a base CTE, then build all four deliverables on top of it. When the CFO asks 'what if we include pending orders?', you change one WHERE line and every number updates consistently — versus hunting through four scripts hoping you edited them all the same way. This is the CTE-pipeline pattern doing governance work.",
        },
        {
          type: "keypoint",
          title: "The four deliverables, mapped to their tools",
          content:
            "1) Revenue trend: DATE_TRUNC('month') + SUM, then LAG for month-over-month growth — the string-and-date and window lessons. 2) Customer value: per-customer aggregates (recency, frequency, monetary), then NTILE or CASE to segment — GROUP BY plus CASE lessons. 3) Product concentration: revenue share per product with SUM() OVER () and a running cumulative share — window functions answering 'do 20% of products drive 80% of revenue?'. 4) Retention: first-order month per customer (MIN + DATE_TRUNC) joined back to all their orders — the cohort pattern from SQL for EDA, now producing the month-over-month comeback rates.",
        },
        {
          type: "keypoint",
          title: "Findings need shapes, not just numbers",
          content:
            "A deliverable is a number PLUS its meaning: not '412,000', but 'monthly revenue grew from ~$95k to ~$118k over the year (+24%), though growth stalled in the last quarter (-2% MoM average)'. For each deliverable, force yourself to write the one-sentence headline a busy executive retains. If you can't write the sentence, the query isn't done — you have data, not a finding yet.",
        },
        {
          type: "warning",
          title: "The partial-period trap (it ruins more decks than any bug)",
          content:
            "If today is July 17, July's revenue covers 17 days — chart it next to full months and revenue appears to crash 45%, guaranteeing an alarmed executive. Every time-series deliverable must either exclude the current partial period (created_at < DATE_TRUNC('month', CURRENT_DATE)) or label it explicitly. The symmetric trap at the start: your earliest month may be partial too (when did data collection begin?). Check MIN(created_at) — it's one query and it's saved a thousand careers.",
        },
        {
          type: "warning",
          title: "Present caveats or they present themselves",
          content:
            "Credible analysis states its edges: 'revenue = shipped orders only (cancelled/pending excluded, ~6% of order volume)'; 'June 2026 cohort has one month of history — its retention is not yet comparable'; 'product returns are not modeled in this data'. Stating limits doesn't weaken the work — it's what separates analysis from a number someone will disprove in the meeting. The rule: every caveat you find in profiling either gets fixed in the query or written in the deliverable. Silent is the only wrong option.",
        },
        {
          type: "expandable",
          title: "Reusing this project as a portfolio piece",
          content:
            "This structure transfers to any transactional dataset — swap in the Olist Brazilian e-commerce dataset (Kaggle, ~100k real orders) or the Chinook music-store database and re-run the arc: profile → define → four deliverables → caveats. Written up briefly (problem, definitions, four findings with one chart each, limitations), it's a legitimate portfolio artifact that demonstrates composition, not just syntax. Interviewers weight one coherent end-to-end analysis far above twenty isolated query exercises.",
        },
        {
          type: "expandable",
          title: "When SQL hands off to Python",
          content:
            "Pure SQL carried this entire project — that's the point of the domain. The natural handoff line: SQL owns everything up to tidy aggregated tables (it's closest to the data, set-based, and auditable); Python/pandas takes over for visualization, statistical testing (is that retention difference significant?), and modeling (churn prediction from your RFM features). The professional pattern is SELECT-down-to-small, then analyze — never dragging a million raw rows into a notebook to re-implement GROUP BY. Your DSM path continues exactly there: the next domain turns these result tables into charts that persuade.",
        },
      ],
    },

    /* ---------------------------------------------------------------- */
    /*  3 — Visual Learning                                              */
    /* ---------------------------------------------------------------- */
    {
      id: "diagram",
      type: "interactive-diagram",
      tocLabel: "Project Map",
      visual: {
        kind: "flow",
        title: "The Analysis Pipeline: Question → Deck",
        caption:
          "The project's five stages. Click each to see what it produces and which earlier lessons power it.",
        nodes: [
          {
            id: "brief",
            label: "Stakeholder brief",
            sublabel: "4 fuzzy questions",
            detail:
              "'Is revenue growing? Best customers? Which products? Do they return?' Raw executive language. Stage output: a written definitions block — revenue = shipped orders, grain = month, window = last 12 full months. Every later number inherits these choices.",
            x: 8,
            y: 45,
            accent: true,
          },
          {
            id: "profile",
            label: "Profile the data",
            sublabel: "trust before use",
            detail:
              "Row counts, date coverage (MIN/MAX — partial months?), NULL rates, status distribution, duplicate keys, orphaned order_items. Output: a caveat list — each item either handled in the base CTE or disclosed in the deck. Powered by: SQL for EDA.",
            x: 28,
            y: 45,
            accent: false,
          },
          {
            id: "base",
            label: "Base CTE",
            sublabel: "definitions, encoded once",
            detail:
              "base_orders: shipped orders in the 12-month window with per-order revenue, built once, selected from everywhere. Change a definition → one line → all deliverables update consistently. Powered by: CTEs, joins, GROUP BY.",
            x: 48,
            y: 45,
            accent: true,
          },
          {
            id: "d1",
            label: "① Trend + ② RFM",
            sublabel: "growth & customers",
            detail:
              "① DATE_TRUNC monthly revenue + LAG growth rates → 'growing, but decelerating'. ② Per-customer recency/frequency/monetary + NTILE segments → 'top decile = 41% of revenue'. Powered by: date functions, window functions, CASE.",
            x: 68,
            y: 20,
            accent: false,
          },
          {
            id: "d2",
            label: "③ Pareto + ④ Retention",
            sublabel: "products & loyalty",
            detail:
              "③ Cumulative revenue share ranked by product → 'top 18% of SKUs = 80% of revenue'. ④ First-order cohorts × months-since → 'month-1 retention 31% and improving'. Powered by: window functions, cohort pattern, self-referential joins.",
            x: 68,
            y: 70,
            accent: false,
          },
          {
            id: "deck",
            label: "Findings + caveats",
            sublabel: "the deliverable",
            detail:
              "Four headline sentences, each with its supporting table, plus the caveat block (exclusions, partial periods, unmodeled returns). The test: an executive can retell each finding correctly after one read. Numbers without sentences aren't findings yet.",
            x: 90,
            y: 45,
            accent: true,
          },
        ],
        edges: [
          { from: "brief", to: "profile", label: "define" },
          { from: "profile", to: "base", label: "encode" },
          { from: "base", to: "d1", label: "SELECT FROM" },
          { from: "base", to: "d2", label: "SELECT FROM" },
          { from: "d1", to: "deck", label: "headline" },
          { from: "d2", to: "deck", label: "headline" },
        ],
      },
    },

    /* ---------------------------------------------------------------- */
    /*  4 — Worked Examples                                              */
    /* ---------------------------------------------------------------- */
    {
      id: "worked-examples",
      type: "worked-examples",
      tocLabel: "The Four Deliverables",
      examples: [
        {
          difficulty: "Very Easy",
          title: "Stage 0–1: Definitions and the profile pass",
          scenario:
            "Before any deliverable: pin the definitions, then verify the data can support them.",
          steps: [
            {
              code: "-- DEFINITIONS (written before any analysis query):\n--   revenue      = SUM(quantity × price_at_purchase), shipped orders only\n--   window       = 2025-07-01 to 2026-07-01 (12 full months, half-open)\n--   customer     = distinct customer_id\n--   retention    = a later calendar month containing ≥1 shipped order\n\nSELECT MIN(created_at), MAX(created_at), COUNT(*) FROM orders;\nSELECT status, COUNT(*),\n       ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 1) AS pct\nFROM orders GROUP BY status ORDER BY 2 DESC;",
              explanation:
                "Definitions first — they're the contract the whole analysis honors. Then the profile: the date probe confirms the window is fully covered (and exposes partial edge months); the status distribution quantifies what 'shipped only' excludes. That 6.2% cancelled isn't discarded silently — it becomes a written caveat.",
            },
            {
              code: "SELECT COUNT(*) AS orphaned_items\nFROM order_items oi\nLEFT JOIN orders o ON o.order_id = oi.order_id\nWHERE o.order_id IS NULL;\n--  orphaned_items\n--  --------------\n--               0",
              explanation:
                "The referential spot-check (LEFT JOIN + IS NULL — the anti-join from the joins module) confirms every order line has a parent order. Zero is what healthy looks like; a nonzero here would mean revenue attributed to ghost orders, and fixing it BEFORE reporting is the entire reason this stage exists.",
            },
          ],
          output:
            "-- Coverage: 2024-11-03 → 2026-07-16 (window fully covered; Jul 2026 partial → excluded)\n-- Status: shipped 82.1% | delivered … | cancelled 6.2% (→ caveat list)\n-- Orphaned items: 0 ✓",
        },
        {
          difficulty: "Easy",
          title: "Deliverable ①: Is revenue growing?",
          scenario:
            "The trend line with growth rates — the deck's first slide.",
          steps: [
            {
              code: "WITH base_orders AS (\n  SELECT o.order_id, o.customer_id, o.created_at,\n         SUM(oi.quantity * oi.price_at_purchase) AS order_revenue\n  FROM orders o\n  JOIN order_items oi ON oi.order_id = o.order_id\n  WHERE o.status = 'shipped'\n    AND o.created_at >= '2025-07-01' AND o.created_at < '2026-07-01'\n  GROUP BY o.order_id, o.customer_id, o.created_at\n),\nmonthly AS (\n  SELECT DATE_TRUNC('month', created_at) AS month,\n         SUM(order_revenue) AS revenue\n  FROM base_orders\n  GROUP BY 1\n)",
              explanation:
                "The base CTE encodes every definition from stage 0; monthly reduces it to twelve rows. Note what ISN'T here: no partial July 2026 (the half-open window ends June 30), so the trend can't fake a crash.",
            },
            {
              code: "SELECT TO_CHAR(month, 'YYYY-MM') AS month,\n       revenue,\n       ROUND(100.0 * (revenue - LAG(revenue) OVER (ORDER BY month))\n             / LAG(revenue) OVER (ORDER BY month), 1) AS mom_pct\nFROM monthly\nORDER BY month;",
              explanation:
                "LAG turns levels into growth — the number executives actually ask about. The first month's NULL growth is correct (nothing to compare against), not a bug to hide. Headline sentence from this table: 'Revenue grew 24% over the year, but the last quarter averaged −1.9% MoM — growth has stalled.'",
            },
          ],
          output:
            " month   | revenue  | mom_pct\n---------+----------+---------\n 2025-07 | 95240.00 |\n 2025-08 | 99105.50 |     4.1\n ...     | ...      |     ...\n 2026-06 | 118320.0 |    -2.3\n(12 rows)",
        },
        {
          difficulty: "Medium",
          title: "Deliverable ②: Who are our best customers?",
          scenario:
            "RFM segmentation — recency, frequency, monetary — computed per customer, then rolled into named tiers.",
          steps: [
            {
              code: "customer_rfm AS (\n  SELECT customer_id,\n         MAX(created_at)     AS last_order_at,\n         COUNT(*)            AS order_count,\n         SUM(order_revenue)  AS total_spent\n  FROM base_orders\n  GROUP BY customer_id\n),\nscored AS (\n  SELECT *,\n         NTILE(10) OVER (ORDER BY total_spent DESC) AS value_decile\n  FROM customer_rfm\n)",
              explanation:
                "Three aggregates capture the three dimensions; NTILE(10) (window-functions lesson) deals customers into spend deciles — decile 1 is the top 10%. Building on base_orders means 'best customers' automatically honors the same revenue definition as the trend slide: consistency by construction, not by discipline.",
            },
            {
              code: "SELECT\n  CASE WHEN value_decile = 1 THEN 'VIP (top 10%)'\n       WHEN value_decile <= 3 THEN 'High value'\n       WHEN value_decile <= 7 THEN 'Mid market'\n       ELSE 'Low engagement' END AS segment,\n  COUNT(*)                     AS customers,\n  SUM(total_spent)             AS revenue,\n  ROUND(100.0 * SUM(total_spent) / SUM(SUM(total_spent)) OVER (), 1)\n                               AS revenue_share_pct,\n  ROUND(AVG(order_count), 1)   AS avg_orders\nFROM scored\nGROUP BY 1\nORDER BY MIN(value_decile);",
              explanation:
                "CASE names the tiers in business language; the window-over-aggregate SUM(SUM(...)) OVER () computes each segment's revenue share in one pass. ORDER BY MIN(value_decile) sorts tiers by seniority rather than alphabetically. Headline: 'The top 10% of customers (312 people) generate 41% of revenue and order 7× more often — retention spend should chase exactly them.'",
            },
          ],
          output:
            " segment        | customers | revenue   | revenue_share_pct | avg_orders\n----------------+-----------+-----------+-------------------+-----------\n VIP (top 10%)  |       312 | 498120.00 |              41.2 |        8.4\n High value     |       624 | 342810.00 |              28.4 |        4.1\n Mid market     |      1248 | 289455.00 |              24.0 |        2.2\n Low engagement |       936 |  77890.00 |               6.4 |        1.1\n(4 rows)",
        },
        {
          difficulty: "Hard",
          title: "Deliverable ③: Which products carry the business?",
          scenario:
            "The Pareto question: how concentrated is revenue across the catalog? Cumulative share, computed with stacked windows.",
          steps: [
            {
              code: "product_revenue AS (\n  SELECT p.product_id, p.name, p.category,\n         SUM(oi.quantity * oi.price_at_purchase) AS revenue\n  FROM base_orders b\n  JOIN order_items oi ON oi.order_id = b.order_id\n  JOIN products p     ON p.product_id = oi.product_id\n  GROUP BY p.product_id, p.name, p.category\n)",
              explanation:
                "Joining order_items back through base_orders keeps the shipped-only, 12-month definitions in force for product numbers too — the base-CTE architecture paying off a third time. Grain: one row per product with its total revenue.",
            },
            {
              code: "SELECT name, category, revenue,\n  ROUND(100.0 * revenue / SUM(revenue) OVER (), 1) AS share_pct,\n  ROUND(100.0 * SUM(revenue) OVER (ORDER BY revenue DESC)\n        / SUM(revenue) OVER (), 1)                 AS cumulative_pct,\n  ROW_NUMBER() OVER (ORDER BY revenue DESC)        AS rank\nFROM product_revenue\nORDER BY revenue DESC;",
              explanation:
                "Two windows on one row: the bare SUM() OVER () is the grand total (each product's share), while the ORDER BY variant is the running total down the ranked list (cumulative share). Scanning cumulative_pct for where it crosses 80 answers Pareto directly: here, rank 43 of 240 products — 18% of the catalog drives 80% of revenue. Headline: 'Revenue is heavily concentrated; the top 43 SKUs deserve inventory priority, and the bottom 100 SKUs (2.1% of revenue) are candidates for pruning.'",
            },
          ],
          output:
            " name            | category    | revenue  | share_pct | cumulative_pct | rank\n-----------------+-------------+----------+-----------+----------------+-----\n 4K Monitor      | Electronics | 88210.00 |       7.3 |            7.3 |    1\n Wireless Mouse  | Accessories | 61150.00 |       5.1 |           12.4 |    2\n ...             | ...         | ...      |       ... |            ... |  ...\n USB-C Hub       | Accessories |  9880.00 |       0.8 |           80.2 |   43\n(240 rows)",
        },
        {
          difficulty: "Industry Example",
          title: "Deliverable ④: Do customers come back?",
          scenario:
            "The board's sharpest question. Monthly acquisition cohorts, retention by months-since-first-order — the full cohort pattern, then the executive summary sentence.",
          steps: [
            {
              code: "first_orders AS (\n  SELECT customer_id,\n         DATE_TRUNC('month', MIN(created_at)) AS cohort_month\n  FROM base_orders\n  GROUP BY customer_id\n),\nactivity AS (\n  SELECT f.cohort_month,\n         (EXTRACT(YEAR FROM b.created_at) - EXTRACT(YEAR FROM f.cohort_month)) * 12\n         + (EXTRACT(MONTH FROM b.created_at) - EXTRACT(MONTH FROM f.cohort_month))\n           AS months_since,\n         b.customer_id\n  FROM base_orders b\n  JOIN first_orders f USING (customer_id)\n)",
              explanation:
                "first_orders stamps each customer with an acquisition cohort (MIN + DATE_TRUNC); activity re-joins every order and computes the month offset from cohort. This customer-joined-back-to-own-history shape is the load-bearing move of all retention analysis — the same skeleton behind every 'triangle chart' in every growth deck.",
            },
            {
              code: "SELECT TO_CHAR(cohort_month, 'YYYY-MM') AS cohort,\n       COUNT(DISTINCT CASE WHEN months_since = 0 THEN customer_id END) AS size,\n       ROUND(100.0 * COUNT(DISTINCT CASE WHEN months_since = 1 THEN customer_id END)\n             / COUNT(DISTINCT CASE WHEN months_since = 0 THEN customer_id END), 1) AS m1_pct,\n       ROUND(100.0 * COUNT(DISTINCT CASE WHEN months_since = 3 THEN customer_id END)\n             / COUNT(DISTINCT CASE WHEN months_since = 0 THEN customer_id END), 1) AS m3_pct\nFROM activity\nGROUP BY cohort_month\nORDER BY cohort_month;",
              explanation:
                "Conditional aggregation (CASE inside COUNT DISTINCT — the case-statements lesson's pivot trick) turns the long activity table into a readable retention grid: each cohort's size, and what share returned in month 1 and month 3. The caveat discipline matters here most: recent cohorts haven't LIVED three months — their m3 cells are structurally empty, not zero, and the deck must say so. Headline: 'Month-1 retention improved from 26% to 34% across the year — the loyalty program cohorts return measurably more often.'",
            },
          ],
          output:
            " cohort  | size | m1_pct | m3_pct\n---------+------+--------+--------\n 2025-07 |  248 |   26.2 |   14.5\n 2025-08 |  261 |   27.6 |   15.3\n ...     |  ... |    ... |    ...\n 2026-05 |  289 |   34.3 |        \n 2026-06 |  301 |        |        \n(12 rows)\n-- blank cells: cohort too young to measure (caveat, not zero)",
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
          "Mini end-to-end: from the base tables, produce the executive one-liner table — one row per month with revenue AND distinct active customers, shipped orders only, June 2026 window excluded from nothing (both months shown are complete). Fill the blanks: the join key, the status definition, the truncation grain, and the distinct-count target.",
        starterCode:
          "-- orders(order_id, customer_id, status, created_at)\n-- order_items(order_id, product_id, quantity, price_at_purchase)\n-- May 2026: orders 1,2 shipped; June 2026: order 3 shipped, order 4 cancelled\n\nSELECT\n  TO_CHAR(DATE_TRUNC('___', o.created_at), 'YYYY-MM') AS month,\n  SUM(oi.quantity * oi.price_at_purchase) AS revenue,\n  COUNT(DISTINCT o.___) AS active_customers\nFROM orders o\nJOIN order_items oi ON oi.___ = o.order_id\nWHERE o.status = '___'\nGROUP BY DATE_TRUNC('month', o.created_at)\nORDER BY month;",
        solutionCode:
          "-- orders(order_id, customer_id, status, created_at)\n-- order_items(order_id, product_id, quantity, price_at_purchase)\n-- May 2026: orders 1,2 shipped; June 2026: order 3 shipped, order 4 cancelled\n\nSELECT\n  TO_CHAR(DATE_TRUNC('month', o.created_at), 'YYYY-MM') AS month,\n  SUM(oi.quantity * oi.price_at_purchase) AS revenue,\n  COUNT(DISTINCT o.customer_id) AS active_customers\nFROM orders o\nJOIN order_items oi ON oi.order_id = o.order_id\nWHERE o.status = 'shipped'\nGROUP BY DATE_TRUNC('month', o.created_at)\nORDER BY month;",
        expectedOutput:
          " month   | revenue | active_customers\n---------+---------+------------------\n 2026-05 |  310.00 |                2\n 2026-06 |  145.00 |                1\n(2 rows)",
        hints: [
          "Four blanks: a truncation grain, the column that identifies a customer, the join column shared by both tables, and the status that counts as revenue.",
          "Monthly grain means DATE_TRUNC('month', …) — and the same expression appears in GROUP BY.",
          "order_items connects to orders via order_id; distinct CUSTOMERS means COUNT(DISTINCT o.customer_id) — distinct order_id would count orders instead.",
          "The definitions block says revenue = shipped: WHERE o.status = 'shipped' excludes June's cancelled order 4, so June shows 1 active customer.",
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
          id: "sql22_mcq_01",
          difficulty: "Easy",
          question:
            "Why does the project encode filters like status='shipped' in one base CTE instead of repeating them in each deliverable's query?",
          options: [
            "CTEs always execute faster than repeated WHERE clauses",
            "So the revenue definition lives in exactly one place — a change updates every deliverable consistently, and numbers can't silently disagree between slides",
            "Because window functions only work inside CTEs",
            "To avoid needing JOINs in the deliverable queries",
          ],
          correctIndex: 1,
          explanation:
            "It's a governance move: four analyses inheriting one definition can never contradict each other, and 'what if we include pending?' becomes a one-line change. Performance is not the motive (the planner may inline CTEs anyway), window functions work in any SELECT, and the deliverables still JOIN freely — deliverable ③ joins products through the base.",
        },
        {
          type: "mcq",
          id: "sql22_mcq_02",
          difficulty: "Easy",
          question:
            "Your monthly revenue chart shows a 45% 'crash' in the current month. The most likely explanation?",
          options: [
            "Revenue genuinely collapsed and the board must be alerted",
            "The current month is partial — only some of its days have happened — so it can't be compared to full months; exclude or label it",
            "DATE_TRUNC rounded the dates incorrectly",
            "The LAG window function skipped a row",
          ],
          correctIndex: 1,
          explanation:
            "A month 17 days old has ~55% of its revenue missing by definition — the classic partial-period trap, cured by ending the window at the last complete month (created_at < DATE_TRUNC('month', CURRENT_DATE)) or labeling the bar. Rule out the artifact BEFORE alerting anyone. DATE_TRUNC doesn't misround, and LAG doesn't skip rows — suspecting the data's coverage before the functions is the professional instinct this project drills.",
        },
        {
          type: "mcq",
          id: "sql22_mcq_03",
          difficulty: "Medium",
          question:
            "In the Pareto deliverable, one row computes both ROUND(100.0*revenue/SUM(revenue) OVER (),1) and the same with SUM(revenue) OVER (ORDER BY revenue DESC). What's the difference?",
          options: [
            "They're identical; ORDER BY only affects display",
            "The first is an error — window functions require ORDER BY",
            "The bare OVER () is the grand total (→ each product's share); adding ORDER BY makes a running total down the ranked list (→ cumulative share, where crossing 80% answers the Pareto question)",
            "The ORDER BY version sorts the output rows",
          ],
          correctIndex: 2,
          explanation:
            "ORDER BY inside OVER changes the FRAME: without it, the window is all rows (a denominator); with it, the default frame is 'start through current row' (a running sum). Same function, two different questions on one row — the stacked-windows idiom. It's not display sorting (that's the query's outer ORDER BY), and OVER () without ORDER BY is perfectly legal — it's how grand totals are done.",
        },
        {
          type: "mcq",
          id: "sql22_mcq_04",
          difficulty: "Medium",
          question:
            "In the retention grid, the June 2026 cohort's month-3 cell is blank. What does professional practice demand?",
          options: [
            "Report it as 0% — no returns were observed",
            "Exclude June customers from the analysis entirely",
            "Backfill it with the average of older cohorts' month-3 values",
            "Show it as structurally empty and caveat it: the cohort hasn't existed for 3 months, so the measurement is undefined, not zero",
          ],
          correctIndex: 3,
          explanation:
            "A cohort acquired in June cannot have month-3 behavior by September's data cutoff — the cell is undefined. Reporting 0% fabricates a retention collapse; imputing the historical average fabricates the opposite; dropping the cohort hides real month-0/month-1 signal it DOES have. Empty-plus-caveat tells the truth. Distinguishing 'no data yet' from 'zero' is one of the sharpest lines between rigorous and sloppy analysis.",
        },
        {
          type: "scenario",
          id: "sql22_sc_01",
          difficulty: "Hard",
          scenario:
            "Rehearsing the deck, the CFO stops you: 'Marketing's dashboard says June revenue was $131k. Your slide says $118k. Which of you is wrong?' You built your numbers from the base CTE: shipped orders only, order_items prices, half-open June window.",
          question: "What's the strongest response?",
          options: [
            "Concede and adjust your slide to $131k so the meeting isn't derailed",
            "Explain that dashboards are usually cached and stale, so yours is right",
            "Compare DEFINITIONS, not numbers: likely differences are status scope (theirs may include pending/cancelled), price source (list price vs price_at_purchase), and window boundaries — then reconcile: run your pipeline with their definition to show it reproduces $131k",
            "Present both numbers and let the board choose",
          ],
          correctIndex: 2,
          explanation:
            "Two revenue numbers differing by 11% almost always means two DEFINITIONS, not an arithmetic error — the usual suspects being status scope, price source, refund handling, and timezone/window edges. The winning move is reconciliation: flip your base CTE to their definition and reproduce their number, proving both pipelines are internally correct and turning the fight into a policy question ('should cancelled orders count?') the CFO can actually decide. Conceding without diagnosis corrupts your deck; 'dashboards are stale' is a guess wearing confidence; and presenting both numbers unreconciled makes uncertainty the board's problem — the analyst's one unforgivable deliverable.",
        },
        {
          type: "coding",
          id: "sql22_code_01",
          difficulty: "Hard",
          prompt:
            "The CEO asks a fifth question live: 'What share of each month's revenue comes from REPEAT customers (not on their first-ever order month)?' Using base_orders(order_id, customer_id, created_at, order_revenue), write the full query: per month, total revenue and repeat_share_pct — revenue from customers whose first-order month (MIN over their history) is EARLIER than that month, as a rounded percentage. Order by month.",
          starterCode:
            "-- base_orders(order_id, customer_id, created_at, order_revenue)\n-- Ana: first order May (80.00), returns June (100.00)\n-- Ben: first order June (45.00)\n\n",
          solutionCode:
            "WITH firsts AS (\n  SELECT customer_id,\n         DATE_TRUNC('month', MIN(created_at)) AS first_month\n  FROM base_orders\n  GROUP BY customer_id\n)\nSELECT\n  TO_CHAR(DATE_TRUNC('month', b.created_at), 'YYYY-MM') AS month,\n  SUM(b.order_revenue) AS revenue,\n  ROUND(100.0 * SUM(CASE WHEN DATE_TRUNC('month', b.created_at) > f.first_month\n                         THEN b.order_revenue ELSE 0 END)\n        / SUM(b.order_revenue), 1) AS repeat_share_pct\nFROM base_orders b\nJOIN firsts f USING (customer_id)\nGROUP BY DATE_TRUNC('month', b.created_at)\nORDER BY month;",
          expectedOutput:
            " month   | revenue | repeat_share_pct\n---------+---------+------------------\n 2026-05 |   80.00 |              0.0\n 2026-06 |  145.00 |             69.0\n(2 rows)",
          tests: [
            {
              name: "First-month computation",
              description:
                "A CTE derives each customer's first-order month via MIN(created_at) truncated to month, joined back to all their orders",
            },
            {
              name: "Repeat classification",
              description:
                "An order counts as repeat when its month is strictly LATER than the customer's first month — Ana's June order (100.00) qualifies; Ben's June first order doesn't",
            },
            {
              name: "Share arithmetic",
              description:
                "June: 100.00 repeat / 145.00 total = 69.0%; May is Ana's first month → 0.0%, via conditional aggregation over the month group",
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
            "Walk me through how you'd approach an open-ended take-home: 'here's our orders database — tell us how the business is doing.'",
          answer:
            "I'd work the arc this project drills. First, definitions: decide and WRITE DOWN what revenue means (which statuses, which price field), the time window, and the grain — because every downstream number inherits these and the review discussion will start there. Second, profile before trusting: date coverage (MIN/MAX — are edge months partial?), status distribution, NULL rates on load-bearing columns, duplicate keys, and orphaned foreign keys; each finding either gets handled in the query or written as a caveat. Third, architecture: one base CTE encoding the definitions, with every analysis selecting from it — so all numbers agree by construction. Fourth, the four canonical lenses: growth (monthly trend + MoM via LAG), customers (RFM segmentation — who drives revenue), products (Pareto concentration via cumulative window shares), and retention (first-order cohorts × months-since). Fifth, findings as sentences: each table compressed to one headline an executive can retell, plus the caveat block. What I'd deliberately NOT do: chart the current partial month, report undefined cohort cells as zero, or present a single number without its definition — those are the three classic take-home disqualifiers.",
        },
        {
          question:
            "Your analysis says one thing; another team's dashboard says another. How do you handle the discrepancy — technically and politically?",
          answer:
            "Technically: reconcile definitions before touching either number. I diff the pipelines along the usual axes — status scope (pending? cancelled? refunded?), price source (list vs transacted), join fan-out (order-level vs item-level aggregation), time boundaries (timezone, half-open vs BETWEEN, partial periods), and dedup rules. Then the decisive move: re-run MY pipeline under THEIR definition. If I can reproduce their number, both systems are internally consistent and the difference is pure policy; if I can't, one of us has a genuine bug and the diff usually points at it (fan-out doubling and boundary days are the common culprits). Politically: frame it as convergence, not victory — 'both numbers are right under their own definitions; here's the one-line difference; which definition should the company standardize on?' hands leadership a decision instead of a dispute. Then the durable fix: the agreed definition gets encoded in one shared layer (a dbt model or governed view) so the same fight doesn't recur quarterly. Metric discrepancies are one of the highest-frequency real-world analyst situations — handling one calmly is worth more than any syntax knowledge.",
        },
        {
          question:
            "This project used only SQL. Where would you draw the line between SQL and Python in a real version, and why?",
          answer:
            "SQL owns everything through the aggregated result tables: filtering, joining, cohort construction, window math. It runs where the data lives (no million-row transfers), it's set-based and declarative (the engine optimizes), and it's auditable — a reviewer reads one query and sees the whole definition of 'retention'. Python takes over at three natural seams: visualization (the retention triangle wants a heatmap; matplotlib/seaborn beat ASCII tables), statistics (is the 26%→34% retention improvement significant, or cohort-size noise? — that's a proportions test SQL can't express cleanly), and modeling (my RFM table is literally a feature matrix; churn prediction from it is sklearn's job). The anti-pattern I avoid in both directions: dragging raw rows into pandas to re-implement GROUP BY — slower, memory-bound, and unreviewable; and torturing SQL into statistical tests or plotting duty it wasn't built for. Rule of thumb: reduce with SQL until the data fits comfortably in memory AND the remaining work is statistical or visual — hand off exactly there. That handoff line is also precisely where this curriculum goes next.",
        },
      ],
    },

    /* ---------------------------------------------------------------- */
    /*  8 — Common Mistakes                                               */
    /* ---------------------------------------------------------------- */
    {
      id: "common-mistakes",
      type: "callout",
      variant: "warning",
      title: "Common Mistakes to Avoid",
      content:
        "1) Querying before defining — 'revenue' without a written definition (statuses, price source, window) guarantees a reconciliation fight later. 2) Skipping the profile pass — partial edge months, cancelled orders, and orphaned rows contaminate every deliverable silently. 3) Charting the current partial month — the fake 45% crash that derails the meeting. 4) Duplicating filter logic across deliverables instead of one base CTE — slides drift apart and can't be trusted together. 5) Reporting undefined cohort cells as 0% — 'no data yet' and 'zero retention' are opposite findings. 6) Delivering tables without headline sentences — if you can't state the finding in one sentence, the analysis isn't finished.",
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
        "Try these prompts in the AI Tutor panel: • 'Play a CEO with a vague question and make me extract precise definitions before you let me query.' • 'Review my base CTE — what definition decisions am I making implicitly?' • 'Give me a metric discrepancy scenario and coach me through reconciling it.' • 'Quiz me on which deliverable (trend/RFM/Pareto/retention) answers each of 10 stakeholder questions.' • 'Interview mode: run me through this exact take-home, pushing back on my findings like a skeptical CFO.'",
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
        "Stakeholder brief — the fuzzy business questions an analysis must translate into precise definitions. Definitions block — the written contract (metric scope, grain, window) every query honors. Profiling — verifying coverage, NULLs, duplicates, and referential health before reporting. Base CTE — the single query layer encoding all definitions; deliverables select from it. Grain — the unit one row represents (order, customer-month, cohort). MoM growth — month-over-month change, computed with LAG. RFM — Recency/Frequency/Monetary customer segmentation. NTILE — window function dealing rows into equal buckets (deciles). Pareto analysis — cumulative-share ranking revealing concentration ('20% drives 80%'). Cohort — customers grouped by first-order period, tracked over months-since. Retention grid — cohorts × month-offset table of return rates. Partial period — an incomplete current/edge month; exclude or label, never compare. Reconciliation — reproducing another team's number under their definitions to isolate policy vs bug. Headline sentence — the one-line finding an executive retells; the test of a finished deliverable.",
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
        "• Do it for real: load the Olist Brazilian e-commerce dataset (Kaggle) or the Chinook database and re-run this project's full arc against unfamiliar data — profile, define, four deliverables, caveats. That write-up IS a portfolio piece. • Read: 'Good Charts' (Berinato) for turning your result tables into the visuals the next domain teaches. • Reference: dbt's docs on metrics/semantic layers — the industrial version of your base-CTE definitions block. • Community: browse take-home write-ups on GitHub tagged 'SQL analysis' to calibrate what strong finished work looks like. • Next in DSM: the Data Visualization domain — your retention grids and trend tables become charts that persuade a room.",
    },

    /* ---------------------------------------------------------------- */
    /*  12 — Recap                                                       */
    /* ---------------------------------------------------------------- */
    {
      id: "recap",
      type: "recap",
      tocLabel: "Recap",
      content:
        "✓ Analysis starts with translation: written definitions (metric scope, grain, window) before any query — and profiling before any trust.\n✓ One base CTE encodes the definitions; four deliverables select from it, so every slide agrees by construction.\n✓ The canonical lenses: trend (DATE_TRUNC + LAG), customer value (RFM + NTILE), concentration (cumulative window shares), retention (first-order cohorts × months-since).\n✓ Truth-telling mechanics: exclude partial periods, distinguish 'no data yet' from zero, attach every caveat you found.\n✓ Discrepancies are definition diffs until proven otherwise — reconcile by reproducing the other number, then make the definition a policy decision.\n✓ A deliverable = table + headline sentence + caveats; SQL reduces, Python visualizes and models from there.\n\n🎉 CONGRATULATIONS — you've completed the entire SQL & Databases course! From SELECT to serializable transactions to a board-ready analysis: 22 lessons, every core skill of professional analytics SQL. You can profile an unknown database, join anything to anything, window your way through rankings and running totals, design and reason about schemas, and turn executive questions into defensible numbers. Next on your DSM path: the Data Visualization domain, where these result tables learn to persuade.",
    },
  ],
};
