import type { Lesson } from "@/lib/curriculum/types";

export const indexesAndOptimization: Lesson = {
  meta: {
    id: "sql.design.indexes-and-optimization",
    slug: "indexes-and-optimization",
    title: "Indexes & Query Optimization",
    description:
      "Understand B-tree indexes, read EXPLAIN ANALYZE plans, and learn the sargability and composite-index rules that turn minute-long queries into millisecond ones.",
    estimatedTime: "35 mins",
    difficulty: "Advanced",
    xpReward: 90,
    prerequisites: ["sql.design.normalization"],
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
        hook: "The same query. The same data. 43 seconds on Monday, 12 milliseconds on Tuesday. Nothing changed except one CREATE INDEX statement someone ran overnight — a 3,500× speedup from a single line. Indexes are the closest thing databases have to magic, and EXPLAIN is how you see the trick.",
        what: "An index is a separate, sorted data structure (almost always a B-tree) that lets the database jump to matching rows instead of scanning the whole table. You'll learn how B-trees work, how to read execution plans with EXPLAIN and EXPLAIN ANALYZE, why indexes have costs (writes, storage), and the query-writing rules — sargability, composite-column order, selectivity — that decide whether your index actually gets used.",
        why: "Query performance is the difference between an interactive dashboard and a spinner, between a nightly job finishing at 2am or 2pm. Analysts who can read a plan debug their own slow queries instead of filing tickets; engineers who understand index costs don't index every column 'to be safe' and wonder why writes crawl. And 'why is this query slow?' is among the most common senior SQL interview questions.",
        whereUsed:
          "Every slow-query investigation, dashboard latency budget, index review on a growing table, ORM-generated query audit, and the EXPLAIN screenshot in half of all database incident postmortems.",
        objectives: [
          "Explain how a B-tree index turns O(n) scans into O(log n) seeks",
          "Read EXPLAIN / EXPLAIN ANALYZE output: scan types, cost, rows, actual time",
          "Write sargable predicates that let indexes work",
          "Design composite indexes with the leftmost-prefix rule",
          "Weigh index benefits against write amplification and storage cost",
        ],
        realWorldApps: [
          {
            company: "GitHub",
            headline: "MySQL at hundreds of millions of repos",
            detail:
              "Database engineers review EXPLAIN plans in pull requests for hot-path queries — a missing index on a table this size is a production incident, not a slow page.",
          },
          {
            company: "Instagram",
            headline: "PostgreSQL feeds at scale",
            detail:
              "Early engineering posts documented how careful composite indexes on (user_id, created_at) style patterns kept feed and media lookups fast across billions of rows.",
          },
          {
            company: "Datadog",
            headline: "Query-performance monitoring as a product",
            detail:
              "Its Database Monitoring product surfaces execution plans and index suggestions automatically — an entire commercial product built on the skill this lesson teaches.",
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
            "Without an index, WHERE email = 'anna@gmail.com' forces a sequential scan: read every row, test the predicate, keep matches. Cost grows linearly — 10× the rows, 10× the time. An index changes the algorithm: a B-tree stores the column's values SORTED, in a shallow tree whose top levels stay in memory. Finding one email means walking root → branch → leaf — three or four page reads instead of millions. That's O(log n) vs O(n): on a billion rows, roughly 4 hops instead of a billion.",
        },
        {
          type: "analogy",
          title: "The book-index analogy (it's literally the name)",
          content:
            "Finding 'sargable' in a 900-page book by reading every page is a sequential scan. Flipping to the alphabetized index, finding 'sargable → p. 412', and jumping there is an index seek. Note what the book index also teaches: it's SEPARATE from the text (extra pages = storage cost), it must be updated when the book is revised (write cost), and it only helps for lookups it was built for — an index of TERMS won't help you find all pages with diagrams.",
        },
        {
          type: "code-note",
          code: "CREATE INDEX idx_orders_customer ON orders (customer_id);\n\nEXPLAIN SELECT * FROM orders WHERE customer_id = 4211;\n--                          QUERY PLAN\n-- ------------------------------------------------------------\n-- Index Scan using idx_orders_customer on orders\n--   (cost=0.43..8.45 rows=12 width=64)\n--   Index Cond: (customer_id = 4211)",
          content:
            "EXPLAIN shows the planner's chosen strategy WITHOUT running the query. Read: scan type (Index Scan — the win; Seq Scan on a big table with a selective filter — the smell), cost=startup..total in arbitrary planner units, rows = ESTIMATED matches, and the condition pushed into the index. The planner chooses by comparing estimated costs — it's free to ignore your index if it predicts a scan is cheaper.",
        },
        {
          type: "keypoint",
          title: "EXPLAIN ANALYZE: estimates vs reality",
          content:
            "Plain EXPLAIN is a forecast. EXPLAIN ANALYZE runs the query and reports actual time and actual rows next to the estimates. The single most diagnostic pattern: estimated rows=40, actual rows=800000 — stale or insufficient statistics led the planner to a terrible strategy (e.g. a nested loop that runs 800k times). Fix with ANALYZE tablename to refresh stats. Caution: EXPLAIN ANALYZE executes the statement — wrap DML in a transaction you roll back.",
        },
        {
          type: "keypoint",
          title: "Sargability: write WHERE so the index can see the column",
          content:
            "An index stores RAW column values, so the column must stand bare on one side of the comparison. WHERE created_at >= '2026-07-01' AND created_at < '2026-08-01' → seek. WHERE DATE_TRUNC('month', created_at) = '2026-07-01' → the engine must compute the function per row: full scan. Same disease: LOWER(email) = …, price * 1.2 > 100, LIKE '%gmail' (leading wildcard defeats sorted order; 'anna%' is fine). Cures: move math to the constant side, rewrite dates as half-open ranges, or build an expression index ON t (LOWER(email)) that stores the computed value.",
        },
        {
          type: "keypoint",
          title: "Composite indexes and the leftmost-prefix rule",
          content:
            "CREATE INDEX ON orders (customer_id, created_at) sorts by customer_id first, then created_at within each customer — like a phone book sorted by (last name, first name). It serves: filters on customer_id alone; on customer_id AND created_at (the sweet spot: one customer's date range is a contiguous run of leaf pages); but NOT created_at alone — dates are scattered across all customers, like finding everyone named 'Anna' regardless of surname. Column ORDER is therefore a design decision: equality-filtered columns first, range-filtered columns last. One composite (a, b) generally beats separate indexes on a and b for combined queries.",
        },
        {
          type: "text",
          content:
            "Indexes are not free. Every INSERT/UPDATE/DELETE must also update every index on the table — write amplification: a table with 8 indexes does 9 writes per insert. They occupy real disk (often rivaling the table itself) and compete for cache memory. And the planner rightly skips them when a filter matches a large fraction of the table — low-selectivity columns like status with 3 values rarely deserve a plain index. The craft: index the columns your critical queries filter and join on — foreign keys are the classic first candidates — and audit for unused indexes as schemas evolve.",
        },
        {
          type: "warning",
          title: "The planner ignoring your index is often correct",
          content:
            "New analysts see 'Seq Scan' next to an existing index and assume the database is broken. Usually the planner did the math: fetching 40% of a table via index means bouncing between index and table pages randomly — slower than reading the table straight through. Small tables, low-selectivity filters, and queries returning most rows all legitimately favor scans. Trust EXPLAIN ANALYZE's actual times over intuition; investigate only when estimates and reality diverge, or when a selective filter still scans.",
        },
        {
          type: "expandable",
          title: "Covering indexes and index-only scans",
          content:
            "If every column a query needs lives IN the index, the table itself is never touched — an index-only scan. SELECT customer_id, created_at FROM orders WHERE customer_id = 4211 against the (customer_id, created_at) composite reads only index pages. PostgreSQL's INCLUDE clause adds payload columns without affecting sort order: CREATE INDEX ON orders (customer_id) INCLUDE (amount). This is the standard endgame optimization for the handful of queries dominating a workload — and why SELECT * quietly disqualifies queries from it.",
        },
        {
          type: "expandable",
          title: "Beyond B-trees, in one paragraph each",
          content:
            "Hash indexes: equality only, no ranges — niche. GIN (generalized inverted): for values containing multiple items — arrays, JSONB, full-text search; the index maps each element to its rows. GiST/SP-GiST: geometric and nearest-neighbor queries (PostGIS). BRIN: tiny summaries of physical block ranges — brilliant for append-only time-series where created_at correlates with row order, at a fraction of B-tree size. Columnar warehouses (BigQuery, Redshift, Snowflake) mostly replace indexes with partitioning + clustering — the sargability instinct transfers there as 'filter on the partition column, raw'.",
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
        title: "How One Query Gets Fast",
        caption:
          "The life of WHERE customer_id = 4211 AND created_at >= '2026-07-01' — from SQL text to leaf pages. Click each stage.",
        nodes: [
          {
            id: "query",
            label: "SQL text",
            sublabel: "your WHERE clause",
            detail:
              "The query declares WHAT to find, never HOW. Whether execution is a millisecond seek or a minute-long scan is decided downstream — but your predicate's FORM (sargable or not) constrains what the planner can even consider.",
            x: 8,
            y: 45,
            accent: true,
          },
          {
            id: "planner",
            label: "Planner",
            sublabel: "costs the options",
            detail:
              "Enumerates strategies — seq scan, index scan per available index, join orders — and costs each using table statistics (row counts, value distributions). Picks the cheapest ESTIMATE. Stale statistics = wrong estimates = bad plans; ANALYZE refreshes them.",
            x: 30,
            y: 45,
            accent: false,
          },
          {
            id: "seqscan",
            label: "Seq Scan",
            sublabel: "read everything",
            detail:
              "Reads every table page, tests every row. O(n) — but sequential I/O is fast per page, so for small tables or low-selectivity filters this legitimately WINS. Suspicious only when a selective filter on an indexed column still lands here.",
            x: 55,
            y: 15,
            accent: false,
          },
          {
            id: "btree",
            label: "B-tree walk",
            sublabel: "root → branch → leaf",
            detail:
              "The composite index (customer_id, created_at) is sorted by customer, then date. The walk descends to customer 4211's July range in 3–4 page reads; matching entries sit CONTIGUOUSLY in the leaves — this is why equality-then-range column order matters.",
            x: 55,
            y: 60,
            accent: true,
          },
          {
            id: "heap",
            label: "Table fetch",
            sublabel: "get full rows",
            detail:
              "Leaf entries point at table (heap) rows; the engine fetches those pages for the SELECTed columns. If the index already contains every needed column, this step vanishes — an index-only scan, the endgame optimization.",
            x: 78,
            y: 60,
            accent: false,
          },
          {
            id: "result",
            label: "Result",
            sublabel: "+ EXPLAIN ANALYZE",
            detail:
              "12 rows in 0.4ms. EXPLAIN ANALYZE shows this whole journey annotated with estimated vs ACTUAL rows and times per node — the ground truth for every optimization decision. Large estimate/actual gaps point at statistics; time concentrated in one node points at the fix.",
            x: 92,
            y: 40,
            accent: false,
          },
        ],
        edges: [
          { from: "query", to: "planner", label: "parse" },
          { from: "planner", to: "seqscan", label: "if scan cheaper" },
          { from: "planner", to: "btree", label: "if seek cheaper" },
          { from: "btree", to: "heap", label: "row pointers" },
          { from: "heap", to: "result" },
          { from: "seqscan", to: "result" },
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
          title: "Before and after one index",
          scenario:
            "orders has 5M rows; support constantly looks up a customer's orders. Measure, index, measure again.",
          steps: [
            {
              code: "EXPLAIN ANALYZE\nSELECT * FROM orders WHERE customer_id = 4211;\n--  Seq Scan on orders (cost=0.00..93750.00 rows=12 width=64)\n--    Filter: (customer_id = 4211)\n--    Rows Removed by Filter: 4999988\n--  Execution Time: 812.402 ms",
              explanation:
                "The tell-tale line is 'Rows Removed by Filter: 4,999,988' — the engine read five million rows to keep twelve. A highly selective filter (12 of 5M) doing a Seq Scan is exactly the case an index exists for.",
            },
            {
              code: "CREATE INDEX idx_orders_customer ON orders (customer_id);\n\nEXPLAIN ANALYZE\nSELECT * FROM orders WHERE customer_id = 4211;\n--  Index Scan using idx_orders_customer on orders\n--    (cost=0.43..8.45 rows=12 width=64)\n--    Index Cond: (customer_id = 4211)\n--  Execution Time: 0.061 ms",
              explanation:
                "812ms → 0.06ms: a ~13,000× speedup from one statement. The filter moved from 'Filter' (applied after reading rows) to 'Index Cond' (applied inside the B-tree walk — non-matching rows are never read at all). This before/after EXPLAIN pair is the standard evidence format for any index proposal.",
            },
          ],
          output:
            "-- Seq Scan:   812.402 ms  (read 5,000,000 rows)\n-- Index Scan:    0.061 ms  (read ~4 index pages + 12 rows)",
        },
        {
          difficulty: "Easy",
          title: "The index that wasn't used",
          scenario:
            "An index on email exists, but the case-insensitive login lookup still crawls. Diagnose with EXPLAIN, fix with an expression index.",
          steps: [
            {
              code: "EXPLAIN SELECT * FROM customers\nWHERE LOWER(email) = 'anna@gmail.com';\n--  Seq Scan on customers (cost=0.00..4890.00 rows=1 width=88)\n--    Filter: (lower(email) = 'anna@gmail.com')",
              explanation:
                "The index stores raw emails ('Anna@Gmail.com'), sorted raw. LOWER(email) is a DIFFERENT value the index has never seen, so the B-tree's sort order is useless and the planner has no choice but to compute LOWER per row. Non-sargable predicate, textbook case.",
            },
            {
              code: "CREATE INDEX idx_customers_email_lower\n  ON customers (LOWER(email));\n\nEXPLAIN SELECT * FROM customers\nWHERE LOWER(email) = 'anna@gmail.com';\n--  Index Scan using idx_customers_email_lower on customers\n--    Index Cond: (lower(email) = 'anna@gmail.com')",
              explanation:
                "An expression index stores the COMPUTED value, pre-sorted. The predicate must match the indexed expression exactly — LOWER(email), not TRIM(LOWER(email)). The alternative cure, normalizing email at write time into its own column, is often better still: one truth, no per-query discipline needed.",
            },
          ],
          output:
            "-- Before: Seq Scan, Filter: lower(email) = ...\n-- After:  Index Scan, Index Cond: lower(email) = ...",
        },
        {
          difficulty: "Medium",
          title: "Designing a composite index",
          scenario:
            "The dashboard's hottest query: one customer's orders in a date range, newest first. Design ONE index that serves it end to end.",
          steps: [
            {
              code: "-- The query to serve:\nSELECT order_id, created_at, amount\nFROM orders\nWHERE customer_id = 4211\n  AND created_at >= '2026-01-01'\nORDER BY created_at DESC\nLIMIT 20;",
              explanation:
                "Decompose the query's needs: equality on customer_id, range on created_at, sort by created_at, top 20. The leftmost-prefix rule says equality columns go FIRST: inside customer 4211's section of the index, entries are already sorted by created_at — the range is one contiguous run.",
            },
            {
              code: "CREATE INDEX idx_orders_cust_date\n  ON orders (customer_id, created_at DESC);\n\n--  Index Scan using idx_orders_cust_date on orders\n--    Index Cond: ((customer_id = 4211) AND (created_at >= '2026-01-01'))\n--  Execution Time: 0.084 ms",
              explanation:
                "Both predicates land in Index Cond, and — the subtle win — there is NO Sort node in the plan: the index's DESC order IS the ORDER BY, so LIMIT 20 stops after reading 20 entries. Reversed column order (created_at, customer_id) would scatter customer 4211 across every date and serve this query badly. Rule of thumb: equality columns leftmost, then the range/sort column.",
            },
          ],
          output:
            "-- One index serves: filter (both columns), sort (no Sort node), LIMIT (early stop)\n-- 20 rows in 0.084 ms",
        },
        {
          difficulty: "Hard",
          title: "Reading a join plan gone wrong",
          scenario:
            "A revenue query joining orders to order_items suddenly takes 40 seconds. EXPLAIN ANALYZE reveals a statistics problem — the fix is one command, but only plan-reading finds it.",
          steps: [
            {
              code: "EXPLAIN ANALYZE\nSELECT o.order_id, SUM(oi.quantity * oi.price_at_purchase)\nFROM orders o\nJOIN order_items oi ON oi.order_id = o.order_id\nWHERE o.created_at >= '2026-07-01'\nGROUP BY o.order_id;\n--  Nested Loop (actual time=39887.20 rows=812000)\n--    -> Index Scan on orders o\n--         (rows=200 ...) (actual rows=812000)\n--    -> Index Scan on order_items oi (loops=812000)",
              explanation:
                "Read plans inner-node-first, and hunt estimate/actual gaps: the planner expected 200 July orders but found 812,000 — statistics predate a traffic surge. Believing '200', it chose a Nested Loop (fine for tiny outer sides), which then executed its inner index scan 812,000 times — 'loops=812000' is the smoking gun.",
            },
            {
              code: "ANALYZE orders;\n\nEXPLAIN ANALYZE  -- same query\n--  HashAggregate (actual time=2110.44 rows=812000)\n--    -> Hash Join (actual time=1480.12)\n--         Hash Cond: (oi.order_id = o.order_id)\n--         -> Seq Scan on order_items oi\n--         -> Hash: -> Index Scan on orders o (rows=798000)",
              explanation:
                "ANALYZE refreshed the row-count statistics; with an honest estimate (~798k), the planner switched to a Hash Join — build a hash of July orders once, stream order_items through it. 40s → 2.1s with zero query changes. The meta-lesson: slow queries aren't always missing indexes; sometimes the planner was simply lied to. Check estimate-vs-actual FIRST, before reaching for CREATE INDEX.",
            },
          ],
          output:
            "-- Before: Nested Loop, est 200 vs actual 812,000 rows → 39.9 s\n-- After ANALYZE: Hash Join → 2.1 s (same SQL)",
        },
        {
          difficulty: "Industry Example",
          title: "An index review on a hot table",
          scenario:
            "A staff engineer audits a 300M-row events table before peak season: find unused indexes, missing ones, and the write-amplification bill — the full lifecycle in one pass.",
          steps: [
            {
              code: "-- 1) What exists, how big, and is it ever used?\nSELECT indexrelname, idx_scan,\n       pg_size_pretty(pg_relation_size(indexrelid)) AS size\nFROM pg_stat_user_indexes\nWHERE relname = 'events'\nORDER BY idx_scan;\n--  indexrelname            | idx_scan | size\n--  idx_events_session      |        0 | 18 GB\n--  idx_events_type         |     1204 | 11 GB\n--  idx_events_user_time    |  9877210 | 21 GB",
              explanation:
                "The catalog keeps the receipts: idx_events_session has never been scanned — 18GB of disk plus a write-amplification tax on every one of millions of daily inserts, purchasing nothing. Dropping a truly unused index is a pure win, verified over a full business cycle first (month-end jobs count too).",
            },
            {
              code: "-- 2) The hot query, checked against the survivors:\nEXPLAIN ANALYZE\nSELECT user_id, COUNT(*)\nFROM events\nWHERE event_type = 'purchase'\n  AND created_at >= '2026-07-01'\nGROUP BY user_id;\n-- Uses idx_events_type poorly (low selectivity: 3 event types)\n\n-- 3) Replace with a partial index shaped to the workload:\nCREATE INDEX idx_events_purchase_time\n  ON events (created_at)\n  WHERE event_type = 'purchase';\nDROP INDEX idx_events_session;",
              explanation:
                "event_type has 3 values — a plain index on it is low-selectivity dead weight. A PARTIAL index (WHERE event_type = 'purchase') indexes only the 2% of rows anyone filters for: smaller than the 11GB it replaces, faster to walk, cheaper to maintain — and non-purchase inserts skip it entirely. Net audit result: less disk, less write amplification, faster hot path. Indexing is workload design, not column decoration.",
            },
          ],
          output:
            "-- Dropped: idx_events_session (0 scans, 18 GB reclaimed)\n-- Added: partial index on purchases (2% of rows)\n-- Hot query: 6.2 s → 0.19 s; per-insert index writes: 3 → 2 for non-purchases",
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
          "The query below runs constantly and crawls: it finds one customer's 2026 order revenue, but its predicate defeats the index on (customer_id, created_at). Fill in the blanks to (1) make the date filter sargable with a half-open range and (2) verify with EXPLAIN that both conditions reach Index Cond.",
        starterCode:
          "-- Index: CREATE INDEX idx_orders_cust_date ON orders (customer_id, created_at);\n-- SLOW original:\n--   WHERE customer_id = 4211 AND EXTRACT(YEAR FROM created_at) = 2026\n\n___ ANALYZE\nSELECT SUM(amount) AS revenue_2026\nFROM orders\nWHERE customer_id = ___\n  AND created_at >= '2026-01-01'\n  AND created_at ___ '2027-01-01';",
        solutionCode:
          "-- Index: CREATE INDEX idx_orders_cust_date ON orders (customer_id, created_at);\n-- SLOW original:\n--   WHERE customer_id = 4211 AND EXTRACT(YEAR FROM created_at) = 2026\n\nEXPLAIN ANALYZE\nSELECT SUM(amount) AS revenue_2026\nFROM orders\nWHERE customer_id = 4211\n  AND created_at >= '2026-01-01'\n  AND created_at < '2027-01-01';",
        expectedOutput:
          "                         QUERY PLAN\n------------------------------------------------------------\n Aggregate  (cost=8.47..8.48 rows=1 width=32)\n   ->  Index Scan using idx_orders_cust_date on orders\n         Index Cond: ((customer_id = 4211) AND\n           (created_at >= '2026-01-01') AND\n           (created_at < '2027-01-01'))\n Execution Time: 0.093 ms\n(5 rows)",
        hints: [
          "Three blanks: the command that shows a plan WITH actual execution times, the customer being looked up, and the half-open upper comparison.",
          "EXPLAIN alone forecasts; adding ANALYZE runs the query and reports real times — that's the verification the task asks for.",
          "EXTRACT(YEAR …) wraps the indexed column in a function — non-sargable. The equivalent sargable form is a range: >= Jan 1 2026 AND strictly before Jan 1 2027.",
          "Half-open means the upper bound uses < (excluding 2027-01-01 itself). Success looks like BOTH predicates inside Index Cond, not in a Filter line.",
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
          id: "sql19_mcq_01",
          difficulty: "Easy",
          question:
            "Why does a B-tree index make WHERE email = '...' fast on a huge table?",
          options: [
            "It caches the whole table in memory",
            "It stores values sorted in a shallow tree, so lookup is a few page reads (O(log n)) instead of reading every row (O(n))",
            "It compresses the table so scans read less data",
            "It rewrites the query to use fewer columns",
          ],
          correctIndex: 1,
          explanation:
            "Sorted order plus a shallow tree is the whole trick: root → branch → leaf reaches any value in 3–4 hops even on a billion rows, versus touching all n rows in a scan. Indexes don't cache tables (though their top levels tend to stay in memory), don't compress the table, and never rewrite queries — the planner picks strategies, but the index's contribution is the sorted structure.",
        },
        {
          type: "mcq",
          id: "sql19_mcq_02",
          difficulty: "Easy",
          question: "What does EXPLAIN ANALYZE add over plain EXPLAIN?",
          options: [
            "Nothing — they're synonyms",
            "It actually executes the query and reports real times and actual row counts alongside the estimates",
            "It automatically creates any missing indexes",
            "It shows the query's results together with the plan",
          ],
          correctIndex: 1,
          explanation:
            "EXPLAIN is a forecast from statistics; ANALYZE executes and annotates each plan node with actual time and actual rows — making estimate-vs-reality gaps (the root of most bad plans) visible. It creates nothing, and it swallows the result rows (you get the plan, not the data). Because it really executes, wrap DML in a rollback-able transaction.",
        },
        {
          type: "mcq",
          id: "sql19_mcq_03",
          difficulty: "Medium",
          question:
            "An index exists on orders(created_at), yet WHERE EXTRACT(YEAR FROM created_at) = 2026 does a Seq Scan. Why?",
          options: [
            "The index is corrupted and needs a REINDEX",
            "EXTRACT is not allowed in WHERE clauses",
            "The predicate wraps the column in a function, so the index's sorted raw values can't be used — it's non-sargable; a half-open range on created_at would seek",
            "Year filters always require a composite index",
          ],
          correctIndex: 2,
          explanation:
            "The B-tree sorts raw timestamps; EXTRACT(YEAR …) is a derived value the index has never seen, so the engine must compute it per row — a full scan. The rewrite created_at >= '2026-01-01' AND < '2027-01-01' compares raw values and seeks. Corruption would surface as errors, not plan choices; EXTRACT is perfectly legal (merely costly here); and no composite index is needed for a single-column range.",
        },
        {
          type: "mcq",
          id: "sql19_mcq_04",
          difficulty: "Medium",
          question:
            "Given CREATE INDEX ON orders (customer_id, created_at), which query gets the LEAST help from it?",
          options: [
            "WHERE customer_id = 42",
            "WHERE customer_id = 42 AND created_at >= '2026-07-01'",
            "WHERE created_at >= '2026-07-01'",
            "WHERE customer_id = 42 ORDER BY created_at",
          ],
          correctIndex: 2,
          explanation:
            "The composite sorts by customer_id FIRST; within a customer, by date. A filter on created_at alone matches entries scattered across every customer's section — the leftmost-prefix rule broken, generally a scan. The others use the prefix: equality on customer_id alone (a), plus a contiguous date range within it (b), plus free ORDER BY from the index's internal sort (d). Dates-only queries would want their own index led by created_at.",
        },
        {
          type: "scenario",
          id: "sql19_sc_01",
          difficulty: "Hard",
          scenario:
            "After a growth spurt, a join query slowed from 2s to 40s. EXPLAIN ANALYZE shows: Nested Loop; outer Index Scan estimated rows=180, actual rows=910000; inner Index Scan with loops=910000. A teammate proposes adding another index.",
          question: "What's the actual diagnosis and first fix?",
          options: [
            "Missing index — add one on the join column",
            "The estimate/actual gap (180 vs 910k) shows stale statistics led the planner to a Nested Loop that ran its inner scan 910,000 times; run ANALYZE on the table so the planner can choose a hash join",
            "Nested loops are always wrong — disable them globally",
            "The table needs partitioning before anything else",
          ],
          correctIndex: 1,
          explanation:
            "Both scans already USE indexes — another index buys nothing. The tell is estimated 180 vs actual 910,000: statistics predate the growth, so the planner chose the tiny-outer-side strategy and then executed the inner lookup nearly a million times (loops=910000). ANALYZE refreshes statistics; with honest estimates the planner switches to a hash join at no query change. Nested loops are the RIGHT plan for genuinely small outer sides — disabling them globally trades one bad plan for many. Partitioning is heavy machinery for later, not the first fix. Estimate-vs-actual is always the first thing to read in a bad plan.",
        },
        {
          type: "coding",
          id: "sql19_code_01",
          difficulty: "Hard",
          prompt:
            "The hot query is: SELECT order_id, amount FROM orders WHERE status = 'pending' AND created_at >= (some date) ORDER BY created_at — and only ~1% of orders are pending. Write (1) a single PARTIAL index shaped exactly to this workload (index created_at, restrict to pending) and (2) the EXPLAIN command for the hot query with '2026-07-01' as the date, to verify it's used.",
          starterCode:
            "-- orders(order_id, customer_id, status, created_at, amount)\n-- status values: 'pending' (~1%), 'shipped', 'delivered', 'cancelled'\n\n",
          solutionCode:
            "CREATE INDEX idx_orders_pending_time\n  ON orders (created_at)\n  WHERE status = 'pending';\n\nEXPLAIN\nSELECT order_id, amount\nFROM orders\nWHERE status = 'pending'\n  AND created_at >= '2026-07-01'\nORDER BY created_at;",
          expectedOutput:
            "                         QUERY PLAN\n------------------------------------------------------------\n Index Scan using idx_orders_pending_time on orders\n   (cost=0.29..142.11 rows=3100 width=18)\n   Index Cond: (created_at >= '2026-07-01')\n(3 rows)",
          tests: [
            {
              name: "Partial index",
              description:
                "Index has WHERE status = 'pending' so it contains only ~1% of rows — small, fast, and cheap to maintain",
            },
            {
              name: "Correct indexed column",
              description:
                "created_at is the indexed column (serving both the range filter and the ORDER BY); status lives in the partial predicate, not the column list",
            },
            {
              name: "Verification step",
              description:
                "EXPLAIN on the exact hot query shows the partial index chosen, with the date range in Index Cond and no separate Sort node",
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
          question: "A production query is slow. Walk me through your process.",
          answer:
            "First, reproduce and measure: run EXPLAIN ANALYZE (in a transaction if it's DML) to get the real plan with actual times, and find where the time concentrates — one node usually dominates. Second, check estimates against actuals at that node: a large gap (est 200, actual 800k) means stale statistics, fixed with ANALYZE before touching anything else — many 'index problems' are really planner-misinformation problems. Third, if estimates are honest, examine the expensive node: a Seq Scan under a selective filter suggests a missing index or a non-sargable predicate — functions wrapped around the column, leading-wildcard LIKEs, or type mismatches — which I fix by rewriting to ranges or adding an expression index. Fourth, consider the workload, not just this query: would a composite index (equality columns first, range/sort last) serve it and its siblings? Is a partial index better for a skewed filter? Finally, verify with the same EXPLAIN ANALYZE and record the before/after — and I'd note what I deliberately DIDN'T do: sprinkle indexes speculatively, because each one taxes every write to the table forever.",
        },
        {
          question:
            "Why not index every column, to be safe? What does an index actually cost?",
          answer:
            "Three costs. Write amplification: every INSERT, DELETE, and most UPDATEs must modify every index on the table — eight indexes turn one logical write into nine physical ones, and hot OLTP tables feel it directly (bulk loads often drop and rebuild indexes for exactly this reason). Storage and cache: indexes are real disk — routinely rivaling the table — and they compete for the buffer cache, evicting pages that useful queries needed. Planner and maintenance overhead: more options to cost, more structures to vacuum and keep statistics for, and unused indexes that linger for years because nobody is sure they're safe to drop (pg_stat_user_indexes' idx_scan counter answers that). And the payoff side is bounded anyway: low-selectivity columns — status with three values — rarely reward a plain index, since fetching 30% of a table through an index is slower than scanning it. So the craft is workload-driven: index foreign keys and the filters/sorts of your hottest queries, prefer one well-ordered composite over several singles, use partial indexes for skewed predicates, and audit usage stats periodically. 'Safe' is a measured index budget, not maximum coverage.",
        },
        {
          question:
            "Design the indexing for a messages table: 100M rows, queries are (a) unread messages for a user, newest first; (b) a conversation's messages by time; (c) rare admin full-text search. Writes are heavy.",
          answer:
            "Start from the queries, spend the write budget deliberately. Query (a): a partial composite — CREATE INDEX ON messages (recipient_id, created_at DESC) WHERE read = false. Unread is a tiny, shrinking fraction of 100M rows, so the partial keeps it small and every marked-read message eventually LEAVES the index; equality column first, then the sort column, so 'newest 50 unread' is a contiguous walk with no Sort node. Query (b): CREATE INDEX ON messages (conversation_id, created_at) — same equality-then-range logic; this also covers the foreign-key side of joins to conversations. Query (c): rare admin search doesn't justify a per-write tax on a hot table — either a GIN full-text index only if measurements show admins truly need it interactive, or better, push search to a replica or external system (which is what heavy-write shops actually do). Under write-heavy load I'd stop at those two B-trees plus the primary key, resist 'while we're at it' additions, and after a month check idx_scan stats to confirm both earn their keep. If asked to go further: BRIN on created_at for archival range scans is nearly free, and time-partitioning becomes the conversation at the next order of magnitude.",
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
        "1) Wrapping indexed columns in functions — EXTRACT(YEAR …)=2026, LOWER(email)=… force scans; rewrite as ranges or add expression indexes. 2) Assuming Seq Scan means something's broken — for small tables or unselective filters the planner is right; check estimate-vs-actual before 'fixing'. 3) Composite column order by intuition — equality columns first, range/sort columns last; (created_at, customer_id) serves customer lookups terribly. 4) Indexing everything — each index taxes every write and competes for cache; unused indexes are pure cost (check idx_scan). 5) Diagnosing with EXPLAIN alone — only ANALYZE exposes actual rows/times, and stale statistics (fixed by running ANALYZE on the table) cause more bad plans than missing indexes.",
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
        "Try these prompts in the AI Tutor panel: • 'ELI5 how a B-tree finds one row among a billion in 4 hops.' • 'Paste me a gnarly EXPLAIN ANALYZE output and walk me through reading it node by node.' • 'Quiz me: show a WHERE clause, I say sargable or not, and fix the broken ones.' • 'Give me 5 query patterns and make me design the composite index, defending column order.' • 'Interview mode: a query got slow after data growth — make me diagnose it step by step without hints.'",
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
        "Index — a separate sorted structure enabling seeks instead of scans. B-tree — the default index: shallow, sorted, O(log n) lookups, supports equality and ranges. Sequential (Seq) Scan — reading the whole table; correct for unselective queries. Index Scan / Index Cond — walking the B-tree; conditions satisfied inside the walk. Index-only scan — query answered entirely from index pages (covering index; INCLUDE adds payload columns). EXPLAIN / EXPLAIN ANALYZE — plan forecast / plan with actual execution times and row counts. Planner statistics — table metadata (row counts, distributions) behind cost estimates; refreshed by ANALYZE. Selectivity — fraction of rows a predicate matches; low selectivity undermines plain indexes. Sargable — predicate form (bare column vs constant) that permits index use. Composite index — multi-column index; usable via its leftmost prefix, equality columns first. Expression index — index over a computed expression like LOWER(email). Partial index — index restricted by a WHERE clause to the interesting slice of rows. Write amplification — every table write updating every index. Nested Loop / Hash Join — join strategies for small vs large row sets; chosen by estimated cost.",
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
        "• Essential: 'Use The Index, Luke!' (use-the-index-luke.com) — Markus Winand's free book on indexing across databases; the sargability chapters alone are worth the visit. • Docs: PostgreSQL manual 'Using EXPLAIN' — read alongside a real plan. • Tool: explain.depesz.com and explain.dalibo.com render pasted plans visually with hot nodes highlighted. • Practice: pick your slowest personal-project query, run EXPLAIN ANALYZE, find where the time goes, and get to a before/after pair. • Next in DSM: reads are now fast — Transactions & ACID covers the write side: how databases keep concurrent changes correct when everyone writes at once.",
    },

    /* ---------------------------------------------------------------- */
    /*  12 — Recap                                                       */
    /* ---------------------------------------------------------------- */
    {
      id: "recap",
      type: "recap",
      tocLabel: "Recap",
      content:
        "✓ B-tree indexes turn O(n) scans into O(log n) seeks by keeping values sorted in a shallow tree.\n✓ EXPLAIN forecasts; EXPLAIN ANALYZE executes and shows actual times — estimate-vs-actual gaps mean stale statistics (run ANALYZE) and cause more bad plans than missing indexes.\n✓ Sargability: keep the column bare in predicates — functions around it (EXTRACT, LOWER, math) force scans; use half-open ranges or expression indexes.\n✓ Composite indexes follow the leftmost-prefix rule: equality columns first, range/sort columns last; one good composite beats several singles.\n✓ Indexes cost writes (amplification), storage, and cache — index the workload's hot filters and foreign keys, use partial indexes for skewed predicates, audit usage.\n✓ Seq Scan is often the RIGHT answer — trust measured plans over intuition.\n\nNext up: Transactions & ACID. Fast queries are half the story — next you'll see how databases keep data CORRECT under concurrent writes: atomic transactions, isolation levels, and why your bank balance never half-updates.",
    },
  ],
};
