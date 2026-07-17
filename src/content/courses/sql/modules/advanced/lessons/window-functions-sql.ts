import type { Lesson } from "@/lib/curriculum/types";

export const windowFunctionsSql: Lesson = {
  meta: {
    id: "sql.advanced.window-functions-sql",
    slug: "window-functions-sql",
    title: "Window Functions in SQL",
    description:
      "Compute ranks, running totals, and row-to-row deltas with OVER and PARTITION BY — aggregate context without collapsing rows.",
    estimatedTime: "40 mins",
    difficulty: "Advanced",
    xpReward: 90,
    prerequisites: ["sql.advanced.ctes"],
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
        hook: "GROUP BY forces a brutal trade: to get a group's total you must give up its rows. But the best analytics questions need both at once — each order AND its customer's running total; each product AND its rank within its category. Window functions end the trade. Rows stay; context arrives.",
        what: "A window function computes a value across a set of rows related to the current row — its 'window' — without collapsing them. The OVER clause defines the window: PARTITION BY splits rows into groups, ORDER BY sequences them, and an optional frame narrows which neighbors count.",
        why: "Rankings, month-over-month deltas, running totals, share-of-group percentages, deduplication — the workhorse queries of analytics — are either impossible or grotesque with GROUP BY and self joins, and one clean line with a window function. They are the single highest-leverage 'advanced' SQL feature and a fixture of every data-science interview loop.",
        whereUsed:
          "Top-N-per-group reports, cohort retention matrices, growth dashboards (MoM/WoW deltas), sessionization, and the ROW_NUMBER dedup idiom you met in the CTE lesson.",
        objectives: [
          "Explain how OVER differs from GROUP BY: context added, rows preserved",
          "Partition and order windows with PARTITION BY and ORDER BY",
          "Choose correctly among ROW_NUMBER, RANK, and DENSE_RANK",
          "Reach back and forward with LAG and LEAD for deltas and gaps",
          "Build running totals and moving averages with ordered aggregate windows",
        ],
        realWorldApps: [
          {
            company: "Spotify",
            headline: "Charts and streaks",
            detail:
              "Daily Top 50 per market is RANK() OVER (PARTITION BY market ORDER BY streams DESC); listener streak features compare days with LAG.",
          },
          {
            company: "Amazon",
            headline: "Best-seller rank per category",
            detail:
              "Every product page's category rank is a partitioned ranking over rolling sales — recomputed at warehouse scale with window functions.",
          },
          {
            company: "Stripe",
            headline: "Growth deltas on dashboards",
            detail:
              "Month-over-month revenue change per merchant is LAG(revenue) OVER (PARTITION BY merchant ORDER BY month) subtracted from the current month.",
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
            "The anatomy: function() OVER (PARTITION BY … ORDER BY … [frame]). PARTITION BY splits rows into independent groups — like GROUP BY, but without collapsing. ORDER BY sequences rows WITHIN each partition — required for rankings, LAG/LEAD, and running totals. Both are optional: an empty OVER () makes the whole result set one window, which is how you attach a grand total to every row.",
        },
        {
          type: "analogy",
          title: "The exam-hall analogy",
          content:
            "Picture students seated by classroom (partitions), each holding their score. GROUP BY is the principal announcing one average per classroom — students go home, only averages remain. A window function is each student glancing around their OWN classroom and writing extra facts on their own sheet: 'my rank in this room', 'average of my room', 'score of the student ahead of me'. Every student keeps their sheet; every sheet gains context.",
        },
        {
          type: "keypoint",
          title: "Rows preserved, context attached",
          content:
            "GROUP BY: n rows in, one row per group out. Window function: n rows in, n rows out — each row gains a computed column. That's the entire mental model. When a stakeholder asks for detail AND summary in the same table ('each order with its customer's total'), the answer is a window, not a join back to a grouped subquery.",
        },
        {
          type: "code-note",
          code: "SELECT\n  order_id, customer_id, amount,\n  SUM(amount) OVER (PARTITION BY customer_id) AS customer_total,\n  ROUND(100.0 * amount / SUM(amount) OVER (PARTITION BY customer_id), 1)\n    AS pct_of_customer\nFROM orders;",
          content:
            "SUM as a window function: every order row survives, annotated with its customer's total and its share of it. The same aggregate you know from GROUP BY, redirected by OVER. Note 100.0 — the decimal literal prevents integer division.",
        },
        {
          type: "keypoint",
          title: "The ranking trio",
          content:
            "All three number rows within a partition by the window ORDER BY, differing only on ties. ROW_NUMBER: arbitrary unique numbers, ties broken unpredictably (1,2,3,4) — use for dedup and strict top-N. RANK: ties share a number, next rank skips (1,2,2,4) — 'Olympic ranking'. DENSE_RANK: ties share, no gaps (1,2,2,3) — use when ranks must stay contiguous. Interviews love this distinction; remember one tied example and you can always re-derive it.",
        },
        {
          type: "code-note",
          code: "SELECT\n  category, product_name, revenue,\n  ROW_NUMBER() OVER w AS row_num,\n  RANK()       OVER w AS rnk,\n  DENSE_RANK() OVER w AS dense\nFROM product_sales\nWINDOW w AS (PARTITION BY category ORDER BY revenue DESC);",
          content:
            "With revenues 500, 300, 300, 200 in one category: row_num = 1,2,3,4; rnk = 1,2,2,4; dense = 1,2,2,3. The WINDOW clause names a window once and reuses it — the DRY option when several functions share one definition (PostgreSQL, MySQL 8, SQLite).",
        },
        {
          type: "text",
          content:
            "LAG(col, n) reaches back n rows within the partition (default 1); LEAD looks forward. Both take a third argument as a default for the edge rows that have no neighbor: LAG(revenue, 1, 0). They are the tool for deltas (this month minus last month), gaps (days since previous order), and change detection (status differs from previous status) — replacing the fragile self-join-on-sequence patterns from the Joins module.",
        },
        {
          type: "expandable",
          title: "Frames: RANGE vs ROWS, and the running-total default",
          content:
            "When a window has an ORDER BY, aggregates default to a cumulative frame: RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW — which is why SUM(...) OVER (ORDER BY date) is a running total with no extra syntax. RANGE treats ORDER-BY ties as one block (equal dates share a cumulative value); ROWS counts physical rows one by one. For moving averages, spell the frame out: AVG(x) OVER (ORDER BY date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) is a 7-row trailing average. If tie behavior in running totals ever surprises you, switch RANGE to ROWS and add a unique tie-breaker to ORDER BY.",
        },
        {
          type: "warning",
          title: "You can't filter a window in the same SELECT",
          content:
            "Window functions evaluate after WHERE, GROUP BY, and HAVING — so WHERE rn = 1 next to the ROW_NUMBER that defines rn is an error. The idiom from the CTE lesson is the law: compute the window in a CTE (or subquery), filter one level up. Corollary: window functions may not appear inside WHERE or HAVING at all; only in SELECT and ORDER BY.",
        },
        {
          type: "expandable",
          title: "Window functions vs GROUP BY vs self joins — choosing",
          content:
            "Need one row per group with summaries only? GROUP BY. Need every row annotated with group context (rank, share, running value, neighbor)? Window function. Need to pair arbitrary rows (hierarchies, co-occurrence)? Self join. The overlap case — 'each row plus its group total' — can technically be done by joining a grouped subquery back, and legacy code is full of that pattern; the window version is shorter, clearer, and usually faster because it scans once. When you meet join-back-to-aggregate code, refactoring it to a window is almost always a strict win.",
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
        kind: "architecture",
        title: "Anatomy of an OVER Clause",
        caption:
          "One clause, three dials. Click each part to see what it controls and which functions need it.",
        nodes: [
          {
            id: "func",
            label: "function()",
            sublabel: "what to compute",
            detail:
              "Three families: aggregates redirected through a window (SUM, AVG, COUNT, MIN, MAX), rankers (ROW_NUMBER, RANK, DENSE_RANK, NTILE), and navigators (LAG, LEAD, FIRST_VALUE, LAST_VALUE). Same OVER grammar for all.",
            x: 12,
            y: 30,
            accent: false,
          },
          {
            id: "over",
            label: "OVER (…)",
            sublabel: "the window definition",
            detail:
              "The keyword that turns an aggregate into a per-row annotation. Empty OVER () = the entire result set is one window — the grand-total trick. Everything inside is optional but ordered: PARTITION BY, then ORDER BY, then frame.",
            x: 38,
            y: 30,
            accent: true,
          },
          {
            id: "partition",
            label: "PARTITION BY",
            sublabel: "split into groups",
            detail:
              "Divides rows into independent windows — computations never cross a partition boundary. Like GROUP BY's grouping, minus the collapse. Omit it and the whole result is one partition. Rankings restart at 1 in every partition.",
            x: 64,
            y: 10,
            accent: false,
          },
          {
            id: "orderby",
            label: "ORDER BY",
            sublabel: "sequence within",
            detail:
              "Gives each partition an internal order. Required by rankers and LAG/LEAD (what would 'previous row' mean unordered?). For aggregates it flips meaning: unordered = whole-partition total; ordered = cumulative running value. Add a unique tie-breaker for deterministic results.",
            x: 64,
            y: 45,
            accent: true,
          },
          {
            id: "frame",
            label: "frame clause",
            sublabel: "which neighbors",
            detail:
              "ROWS/RANGE BETWEEN … narrows the window to a sliding region — e.g. ROWS BETWEEN 6 PRECEDING AND CURRENT ROW for a 7-day trailing average. Defaults to cumulative when ORDER BY is present. ROWS counts physical rows; RANGE groups ties.",
            x: 64,
            y: 80,
            accent: false,
          },
          {
            id: "result",
            label: "n rows in, n rows out",
            sublabel: "the invariant",
            detail:
              "Whatever the window computes, the row count never changes — each row simply gains columns. If your row count changed, you used GROUP BY, not a window. To FILTER on a window result, compute it in a CTE and filter one level up.",
            x: 90,
            y: 45,
            accent: false,
          },
        ],
        edges: [
          { from: "func", to: "over", label: "redirected by" },
          { from: "over", to: "partition", label: "1st dial" },
          { from: "over", to: "orderby", label: "2nd dial" },
          { from: "over", to: "frame", label: "3rd dial" },
          { from: "partition", to: "result" },
          { from: "orderby", to: "result" },
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
          title: "Group total without collapsing",
          scenario:
            "Show each order with its customer's total spend beside it.",
          steps: [
            {
              code: "SELECT\n  customer_id, order_id, amount,\n  SUM(amount) OVER (PARTITION BY customer_id) AS customer_total\nFROM orders\nORDER BY customer_id, order_id;",
              explanation:
                "Three orders in, three rows out — GROUP BY would have returned two. Customer 10's both rows carry 300.00; the partition boundary keeps customer 12's 260.00 uncontaminated. No ORDER BY inside OVER, so the SUM covers the whole partition, not a running slice.",
            },
          ],
          output:
            " customer_id | order_id | amount | customer_total\n-------------+----------+--------+----------------\n          10 |        1 | 100.00 |         300.00\n          10 |        2 | 200.00 |         300.00\n          12 |        4 | 260.00 |         260.00\n(3 rows)",
        },
        {
          difficulty: "Easy",
          title: "The ranking trio on tied data",
          scenario:
            "Rank products by revenue within one category containing a tie — and see all three functions disagree.",
          steps: [
            {
              code: "SELECT\n  product_name, revenue,\n  ROW_NUMBER() OVER (ORDER BY revenue DESC) AS row_num,\n  RANK()       OVER (ORDER BY revenue DESC) AS rnk,\n  DENSE_RANK() OVER (ORDER BY revenue DESC) AS dense\nFROM product_sales;",
              explanation:
                "Revenues 500, 300, 300, 200. ROW_NUMBER forces uniqueness — one of the tied 300s arbitrarily gets 2, the other 3 (add a tie-breaker to ORDER BY to pin which). RANK gives both 2 and skips to 4 — 'two products beat 200'. DENSE_RANK gives both 2 and continues at 3 — 'the third-highest revenue VALUE'. Pick by which sentence your stakeholder means.",
            },
          ],
          output:
            " product_name | revenue | row_num | rnk | dense\n--------------+---------+---------+-----+-------\n Headphones   |  500.00 |       1 |   1 |     1\n Speaker      |  300.00 |       2 |   2 |     2\n Webcam       |  300.00 |       3 |   2 |     2\n Mouse        |  200.00 |       4 |   4 |     3\n(4 rows)",
        },
        {
          difficulty: "Medium",
          title: "Top 2 products per category",
          scenario:
            "The archetypal window task: for EACH category, the two best-selling products. GROUP BY can't; a partitioned rank in a CTE can.",
          steps: [
            {
              code: "WITH ranked AS (\n  SELECT\n    category, product_name, revenue,\n    ROW_NUMBER() OVER (\n      PARTITION BY category\n      ORDER BY revenue DESC, product_name\n    ) AS rn\n  FROM product_sales\n)",
              explanation:
                "PARTITION BY category restarts numbering in every category; the product_name tie-breaker makes rn deterministic when revenues tie. ROW_NUMBER (not RANK) guarantees exactly two survivors per category even through ties — the 'strict top-N' choice.",
            },
            {
              code: "SELECT category, product_name, revenue\nFROM ranked\nWHERE rn <= 2\nORDER BY category, rn;",
              explanation:
                "The CTE-then-filter idiom, now second nature: rn is an ordinary column out here. Swap the <= 2 threshold or the partition column and this template answers every 'top N per group' request you'll ever get.",
            },
          ],
          output:
            " category | product_name | revenue\n----------+--------------+---------\n audio    | Headphones   |  500.00\n audio    | Speaker      |  300.00\n cables   | HDMI 2m      |  120.00\n cables   | USB-C 1m     |   95.00\n(4 rows)",
        },
        {
          difficulty: "Hard",
          title: "Month-over-month growth with LAG",
          scenario:
            "From monthly_revenue(month, revenue), compute each month's absolute and percentage change versus the previous month.",
          steps: [
            {
              code: "SELECT\n  month, revenue,\n  LAG(revenue) OVER (ORDER BY month) AS prev_revenue,",
              explanation:
                "LAG reaches one row back in month order. January has no predecessor, so its prev_revenue is NULL — an honest 'no comparison possible', which the arithmetic below will propagate rather than fake.",
            },
            {
              code: "  revenue - LAG(revenue) OVER (ORDER BY month) AS delta,\n  ROUND(\n    100.0 * (revenue - LAG(revenue) OVER (ORDER BY month))\n    / LAG(revenue) OVER (ORDER BY month), 1\n  ) AS pct_change\nFROM monthly_revenue\nORDER BY month;",
              explanation:
                "Delta and percent build on the same LAG; repeating the expression is normal (or name the window with WINDOW w AS (ORDER BY month) and write LAG(revenue) OVER w thrice). January's NULL flows through both — dashboards render it as '—'. Add PARTITION BY merchant_id and this becomes Stripe's per-merchant growth table verbatim.",
            },
          ],
          output:
            " month   | revenue  | prev_revenue | delta    | pct_change\n---------+----------+--------------+----------+------------\n 2026-01 | 42100.00 |              |          |\n 2026-02 | 45320.00 |     42100.00 |  3220.00 |        7.6\n 2026-03 | 44150.00 |     45320.00 | -1170.00 |       -2.6\n(3 rows)",
        },
        {
          difficulty: "Industry Example",
          title: "Running total and 3-month moving average",
          scenario:
            "A finance dashboard needs cumulative year-to-date revenue and a smoothed 3-month trailing average — the two standard trend lines, one query.",
          steps: [
            {
              code: "SELECT\n  month, revenue,\n  SUM(revenue) OVER (\n    ORDER BY month\n  ) AS ytd_revenue,",
              explanation:
                "An aggregate window WITH an ORDER BY defaults to the cumulative frame (start of partition through current row) — that's the whole running-total implementation. Partition by year to make it reset each January.",
            },
            {
              code: "  ROUND(AVG(revenue) OVER (\n    ORDER BY month\n    ROWS BETWEEN 2 PRECEDING AND CURRENT ROW\n  ), 2) AS moving_avg_3m\nFROM monthly_revenue\nORDER BY month;",
              explanation:
                "The explicit ROWS frame slides a 3-row region (two months back through now). Early months average over fewer rows — 42100 alone, then two, then a true 3-month window; some teams prefer NULL until the window fills, which a CASE on ROW_NUMBER provides. ROWS, not RANGE: physical rows, no tie surprises.",
            },
          ],
          output:
            " month   | revenue  | ytd_revenue | moving_avg_3m\n---------+----------+-------------+---------------\n 2026-01 | 42100.00 |    42100.00 |      42100.00\n 2026-02 | 45320.00 |    87420.00 |      43710.00\n 2026-03 | 44150.00 |   131570.00 |      43856.67\n(3 rows)",
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
          "The sales team wants each region's reps ranked by deals closed, keeping only each region's #1. From rep_sales(rep_name, region, deals): rank reps within their region by deals descending (ties broken by rep_name ascending), then return region, rep_name, deals for the top rep per region, sorted by region. Fill in the blanks.",
        starterCode:
          "-- rep_sales(rep_name, region, deals)\n-- Rows: ('Anna','EU',14), ('Ben','EU',11), ('Cara','US',9),\n--       ('Dev','US',9), ('Elif','EU',8)\n\nWITH ranked AS (\n  SELECT\n    rep_name, region, deals,\n    ___() OVER (\n      ___ BY region\n      ORDER BY deals ___, rep_name ASC\n    ) AS rn\n  FROM rep_sales\n)\nSELECT region, rep_name, deals\nFROM ranked\nWHERE rn = ___\nORDER BY region;",
        solutionCode:
          "-- rep_sales(rep_name, region, deals)\n-- Rows: ('Anna','EU',14), ('Ben','EU',11), ('Cara','US',9),\n--       ('Dev','US',9), ('Elif','EU',8)\n\nWITH ranked AS (\n  SELECT\n    rep_name, region, deals,\n    ROW_NUMBER() OVER (\n      PARTITION BY region\n      ORDER BY deals DESC, rep_name ASC\n    ) AS rn\n  FROM rep_sales\n)\nSELECT region, rep_name, deals\nFROM ranked\nWHERE rn = 1\nORDER BY region;",
        expectedOutput:
          " region | rep_name | deals\n--------+----------+-------\n EU     | Anna     |    14\n US     | Cara     |     9\n(2 rows)",
        hints: [
          "Four blanks: the ranking function, the partition keyword, a sort direction, and the kept rank.",
          "Strict one-per-group selection wants ROW_NUMBER() — RANK could keep two tied reps.",
          "Numbering restarts per region via PARTITION BY region; most deals first means DESC.",
          "Keep rn = 1. In US, Cara and Dev tie at 9 — the rep_name ASC tie-breaker deterministically picks Cara.",
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
          id: "sql14_mcq_01",
          difficulty: "Easy",
          question:
            "A table has 1,000 rows. SELECT …, SUM(x) OVER (PARTITION BY region) FROM t returns how many rows?",
          options: ["One per region", "1,000", "One", "Depends on the data"],
          correctIndex: 1,
          explanation:
            "Window functions never change the row count — every input row survives, annotated. One-per-region describes GROUP BY region; one row describes an ungrouped aggregate. 'n rows in, n rows out' is the defining invariant and never depends on the data.",
        },
        {
          type: "mcq",
          id: "sql14_mcq_02",
          difficulty: "Easy",
          question:
            "Values 100, 80, 80, 60 ranked descending: which function produces 1, 2, 2, 3?",
          options: ["ROW_NUMBER", "RANK", "DENSE_RANK", "NTILE"],
          correctIndex: 2,
          explanation:
            "DENSE_RANK shares numbers on ties and leaves no gaps — 60 is the third-highest VALUE. RANK would give 1, 2, 2, 4 (skipping after the tie). ROW_NUMBER gives 1, 2, 3, 4 with the tie broken arbitrarily. NTILE distributes rows into a fixed number of buckets, not ordinal ranks.",
        },
        {
          type: "mcq",
          id: "sql14_mcq_03",
          difficulty: "Medium",
          question:
            "What does LAG(revenue) OVER (ORDER BY month) return for the FIRST month?",
          options: [
            "0",
            "The first month's own revenue",
            "NULL (unless a default argument is supplied)",
            "An error",
          ],
          correctIndex: 2,
          explanation:
            "The first row has no predecessor, so LAG yields NULL — which honestly propagates through delta arithmetic as 'no comparison'. A third argument supplies a substitute: LAG(revenue, 1, 0). Returning 0 silently would fake an infinite growth rate; returning the row's own value describes nothing LAG does; and missing neighbors are an expected condition, never an error.",
        },
        {
          type: "mcq",
          id: "sql14_mcq_04",
          difficulty: "Medium",
          question:
            "What is the difference between SUM(x) OVER (PARTITION BY g) and SUM(x) OVER (PARTITION BY g ORDER BY d)?",
          options: [
            "No difference; ORDER BY only sorts the output",
            "The first is the whole-partition total on every row; the second is a cumulative running total up to each row",
            "The second raises an error — aggregates can't take ORDER BY in OVER",
            "The first is faster but returns the same values",
          ],
          correctIndex: 1,
          explanation:
            "Adding ORDER BY to an aggregate window activates the default cumulative frame (UNBOUNDED PRECEDING through CURRENT ROW), turning a constant-per-partition total into a running total that grows row by row. It does NOT sort the final output — that's the query-level ORDER BY. The syntax is fully legal, and the two forms return different values, so speed comparisons are beside the point.",
        },
        {
          type: "scenario",
          id: "sql14_sc_01",
          difficulty: "Hard",
          scenario:
            "An analyst writes: SELECT user_id, plan, ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY updated_at DESC) AS rn FROM subscriptions WHERE rn = 1 — intending 'each user's latest subscription'. The database rejects the query.",
          question: "Why, and what is the fix?",
          options: [
            "ROW_NUMBER needs a frame clause; add ROWS UNBOUNDED PRECEDING",
            "WHERE runs before window functions are computed, so rn doesn't exist there; compute the window in a CTE/subquery and filter WHERE rn = 1 one level up",
            "PARTITION BY and ORDER BY can't be combined in one OVER clause",
            "updated_at DESC is invalid inside OVER; sort in the outer query instead",
          ],
          correctIndex: 1,
          explanation:
            "Logical order: FROM → WHERE → GROUP BY → HAVING → window functions → SELECT — WHERE can't see a column the window layer hasn't produced. The universal idiom: wrap the ranked SELECT in a CTE, then WHERE rn = 1 outside, where rn is an ordinary column. Rankers need no frame clause. PARTITION BY + ORDER BY together is the standard grammar, and DESC inside OVER is exactly how 'latest first' is expressed.",
        },
        {
          type: "coding",
          id: "sql14_code_01",
          difficulty: "Hard",
          prompt:
            "From daily_sales(sale_date, revenue), produce sale_date, revenue, a running total (running_revenue), and the day-over-day change (delta, NULL on the first day). Order by sale_date.",
          starterCode:
            "-- daily_sales(sale_date, revenue)\n-- Rows: ('2026-07-01', 100.00), ('2026-07-02', 150.00), ('2026-07-03', 120.00)\n\n",
          solutionCode:
            "SELECT\n  sale_date,\n  revenue,\n  SUM(revenue) OVER (ORDER BY sale_date) AS running_revenue,\n  revenue - LAG(revenue) OVER (ORDER BY sale_date) AS delta\nFROM daily_sales\nORDER BY sale_date;",
          expectedOutput:
            " sale_date  | revenue | running_revenue | delta\n------------+---------+-----------------+--------\n 2026-07-01 |  100.00 |          100.00 |\n 2026-07-02 |  150.00 |          250.00 |  50.00\n 2026-07-03 |  120.00 |          370.00 | -30.00\n(3 rows)",
          tests: [
            {
              name: "Running total",
              description: "SUM with an ordered window accumulates 100 → 250 → 370",
            },
            {
              name: "LAG delta",
              description: "delta is revenue minus the previous day's revenue: NULL, 50, -30",
            },
            {
              name: "Row preservation",
              description: "Three rows in, three rows out — no grouping",
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
            "Explain the difference between ROW_NUMBER, RANK, and DENSE_RANK. When does the choice actually matter?",
          answer:
            "All three number rows within a partition according to the window's ORDER BY and agree completely when there are no ties; they differ only on tie handling. ROW_NUMBER assigns unique consecutive integers, breaking ties arbitrarily unless the ORDER BY includes a unique tie-breaker. RANK gives tied rows the same number and then skips — 1, 2, 2, 4 — so a rank tells you how many rows beat you. DENSE_RANK gives ties the same number without gaps — 1, 2, 2, 3 — so it counts distinct value levels. The choice matters in three situations: strict top-N-per-group and deduplication need ROW_NUMBER, because exactly one row must survive per rank; leaderboards where 'two silver medals mean no bronze' need RANK; and 'give me the top 3 price points' needs DENSE_RANK, since it ranks values rather than rows. In any production ROW_NUMBER I also add a unique tie-breaker to the ORDER BY so reruns are deterministic.",
        },
        {
          question:
            "A query needs each order alongside its customer's total and percentage share. Compare the window-function approach with the join-back-to-aggregate approach.",
          answer:
            "The legacy pattern computes a grouped subquery — customer totals via GROUP BY — and joins it back to orders on customer_id, then divides. It works, but it states the intent twice (once grouped, once joined), scans conceptually twice, and every new group-level metric means widening the subquery and the join. The window version annotates in place: SUM(amount) OVER (PARTITION BY customer_id) on the orders scan itself, with the share as amount divided by that expression — one scan, no join keys to mismatch, and adding AVG or COUNT context is one more OVER column. Semantically they're identical when the join key is clean; the join version has an extra failure mode if customer_id has NULLs (NULL never joins back, silently dropping those orders, whereas PARTITION BY groups NULLs together). Modern optimizers execute the window efficiently with a sort per partition spec. My default is the window; the join-back survives mainly in engines or tools that predate window support.",
        },
        {
          question:
            "How would you compute month-over-month revenue growth per merchant, and what edge cases do you handle?",
          answer:
            "Core query: LAG(revenue) OVER (PARTITION BY merchant_id ORDER BY month) gives each merchant-month its predecessor; delta is the difference and percent growth divides that by the LAG value. Edge cases are most of the real work. First month per merchant: LAG is NULL, so growth is NULL — I keep it NULL rather than defaulting to 0, because 'no prior month' isn't 'no growth'. Gap months: if a merchant has no March row, April's LAG returns February — misleading; the fix is densifying the calendar first (cross join months × merchants, left join actuals, COALESCE revenue to 0) so LAG always means 'previous calendar month'. Zero-revenue previous month: percent growth divides by zero — I NULLIF the denominator and let the dashboard render '∞/new'. Duplicate merchant-month rows would corrupt LAG ordering, so the pipeline enforces uniqueness upstream. This 'densify, then window' pattern is the professional standard for any time-series delta in SQL.",
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
        "1) Filtering a window column in the same SELECT's WHERE — it doesn't exist yet; rank in a CTE, filter outside. 2) Forgetting ORDER BY inside OVER for a running total, getting the flat partition total on every row instead. 3) Using RANK for strict top-N-per-group — ties smuggle in extra rows; ROW_NUMBER with a tie-breaker guarantees exactly N. 4) LAG over a time series with gap months — 'previous row' isn't 'previous month'; densify the calendar first. 5) Non-deterministic ROW_NUMBER from an ORDER BY with ties and no unique tie-breaker — the dedup keeps a different row on every run.",
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
        "Try these prompts in the AI Tutor panel: • 'ELI5: OVER and PARTITION BY with a classroom analogy of your own.' • 'Quiz me: tied values, I give ROW_NUMBER/RANK/DENSE_RANK outputs.' • 'Trace a running total row by row and show what removing ORDER BY changes.' • 'Show me the gap-month LAG bug and the calendar-densify fix.' • 'Interview mode: top-2-per-category live, then critique my tie handling.'",
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
        "Window function — computes over rows related to the current row without collapsing them. OVER — the clause defining the window; empty OVER () spans the whole result. PARTITION BY — splits rows into independent windows. Window ORDER BY — sequences rows within a partition; activates cumulative frames for aggregates. Frame — the sub-range of the partition an aggregate sees (ROWS/RANGE BETWEEN …). Running total — ordered SUM with the default cumulative frame. Moving average — AVG over an explicit sliding ROWS frame. ROW_NUMBER / RANK / DENSE_RANK — the ranking trio: unique / gapped ties / dense ties. NTILE(n) — deals rows into n near-equal buckets. LAG / LEAD — value from a preceding / following row, with optional default. WINDOW clause — names a window definition for reuse across functions. Densify — filling calendar gaps so LAG means 'previous period', not 'previous existing row'.",
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
        "• Docs: PostgreSQL manual — 'Window Functions' tutorial chapter, then the frame-clause reference in SELECT. • Read: 'SQL Window Functions Explained' on Mode's blog for chart-driven intuition; LeetCode's database section for top-N-per-group drills. • Practice: on any sales-like table, write the four archetypes — group total per row, top-2-per-group, MoM delta, 7-row moving average — until the OVER grammar types itself. • Next in DSM: windows compute across rows — CASE Statements compute within one, turning conditions into columns and powering the pivot-style counting you'll combine with everything learned here.",
    },

    /* ---------------------------------------------------------------- */
    /*  12 — Recap                                                       */
    /* ---------------------------------------------------------------- */
    {
      id: "recap",
      type: "recap",
      tocLabel: "Recap",
      content:
        "✓ Window functions attach group context to every row — n rows in, n rows out — where GROUP BY would collapse.\n✓ OVER has three dials: PARTITION BY (split), ORDER BY (sequence; turns aggregates cumulative), frame (which neighbors).\n✓ The ranking trio differs only on ties: ROW_NUMBER unique, RANK gapped, DENSE_RANK dense — strict top-N wants ROW_NUMBER plus a tie-breaker.\n✓ LAG/LEAD read neighboring rows for deltas and gaps; densify calendars so 'previous row' means 'previous period'.\n✓ Running totals are ordered SUMs; moving averages spell out a ROWS frame.\n✓ Window results can't be filtered in the same SELECT — compute in a CTE, filter one level up.\n\nNext up: CASE Statements. Window functions gave rows context from their neighbors — CASE gives them logic of their own: conditional columns, custom sort keys, and the SUM(CASE WHEN …) trick that pivots categories into columns.",
    },
  ],
};
