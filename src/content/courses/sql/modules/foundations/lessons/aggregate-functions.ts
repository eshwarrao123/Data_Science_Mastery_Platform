import type { Lesson } from "@/lib/curriculum/types";

export const aggregateFunctions: Lesson = {
  meta: {
    id: "sql.foundations.aggregate-functions",
    slug: "aggregate-functions",
    title: "Aggregate Functions",
    description:
      "Collapse thousands of rows into single answers with COUNT, SUM, AVG, MIN, and MAX — and master how each one treats NULL.",
    estimatedTime: "30 mins",
    difficulty: "Beginner",
    xpReward: 60,
    prerequisites: ["sql.foundations.select-and-from"],
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
        hook: "So far every query returned rows that exist in the table. But stakeholders rarely want rows — they want numbers. How many orders? What's the average basket? Total revenue this month? Aggregate functions are how a million rows become one honest answer.",
        what: "An aggregate function consumes a set of rows and returns a single value: COUNT (how many), SUM (total), AVG (mean), MIN and MAX (extremes). Used without grouping, they collapse the whole filtered table into exactly one row.",
        why: "Metrics are aggregations. Revenue, conversion rate, average order value, active-user counts — every KPI on every dashboard is an aggregate over some filtered slice of data. Getting them right (especially around NULLs and duplicates) is the difference between a trusted analyst and a corrected one.",
        whereUsed:
          "Every dashboard tile, every A/B-test readout, every data-quality check ('how many rows loaded today?'), and the profiling queries you run the moment you meet a new table.",
        objectives: [
          "Summarize columns with COUNT, SUM, AVG, MIN, and MAX",
          "Explain the difference between COUNT(*), COUNT(column), and COUNT(DISTINCT column)",
          "Predict how each aggregate treats NULL values",
          "Combine aggregates with WHERE to compute metrics over a filtered slice",
          "Profile an unfamiliar table with an aggregate battery (rows, nulls, distincts, extremes)",
        ],
        realWorldApps: [
          {
            company: "Shopify",
            headline: "Merchant dashboard tiles",
            detail:
              "Each store's home screen — total sales, order count, average order value — is a handful of SUM/COUNT/AVG queries over that shop's orders.",
          },
          {
            company: "Duolingo",
            headline: "Daily active learners",
            detail:
              "The DAU metric is COUNT(DISTINCT user_id) over a day's lesson-completion events — DISTINCT because one learner can finish many lessons.",
          },
          {
            company: "Instacart",
            headline: "Basket-size economics",
            detail:
              "Pricing teams track AVG(items_per_order) and MAX delivery distances per region to tune batching and delivery fees.",
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
            "The five core aggregates: COUNT counts rows or values, SUM adds numeric values, AVG computes the arithmetic mean, MIN and MAX return the smallest and largest value (they also work on text and dates — MIN of a date column is the earliest date). Without a GROUP BY, an aggregate query returns exactly one row, no matter how many rows it read.",
        },
        {
          type: "analogy",
          title: "The funnel analogy",
          content:
            "Think of an aggregate query as a funnel: WHERE pours in the rows you care about, the aggregate function is the narrow neck, and out drips a single drop — one number. The rows themselves never leave the database; only the summary does. That's why aggregating in SQL beats downloading a million rows to average them in a spreadsheet.",
        },
        {
          type: "keypoint",
          title: "The three COUNTs",
          content:
            "COUNT(*) counts rows — every row, NULLs and all. COUNT(column) counts rows where that column is NOT NULL. COUNT(DISTINCT column) counts unique non-NULL values. Three different questions, three different numbers: 1,000 orders, 940 with a known coupon code, 12 distinct coupon codes.",
        },
        {
          type: "code-note",
          code: "SELECT\n  COUNT(*)                    AS total_rows,\n  COUNT(discount_pct)         AS with_discount_value,\n  COUNT(DISTINCT customer_id) AS unique_customers\nFROM orders;",
          content:
            "You can compute several aggregates in one pass over the table — one query, one scan, three metrics. The difference total_rows − with_discount_value is the NULL count, the standard profiling trick from the WHERE lesson, now in aggregate form.",
        },
        {
          type: "warning",
          title: "Aggregates silently skip NULLs",
          content:
            "SUM, AVG, MIN, and MAX ignore NULL values entirely. AVG(rating) over ratings 4, 5, and NULL is 4.5 — the mean of two values, not three. If the business question treats missing as zero, you must say so explicitly: AVG(COALESCE(rating, 0)) gives 3.0. Neither is 'the right answer' universally; the point is that YOU choose, consciously.",
        },
        {
          type: "expandable",
          title: "What do aggregates return on an empty set?",
          content:
            "If WHERE filters out every row, COUNT returns 0 — but SUM, AVG, MIN, and MAX return NULL, not zero. A revenue tile fed by SUM(amount) over a day with no orders shows NULL (often rendered as a blank), which can crash downstream arithmetic. Defensive idiom: COALESCE(SUM(amount), 0). Also note integer division: in PostgreSQL, AVG of integers returns a numeric, but SUM(int)/COUNT(*) with integer operands truncates in some dialects — cast to a decimal type when computing manual ratios.",
        },
        {
          type: "text",
          content:
            "Aggregates and plain columns don't mix freely: SELECT customer_id, COUNT(*) FROM orders is an error (which customer_id would the single output row show?). Until you learn GROUP BY in the next lesson, a query either selects plain columns or aggregates — not both. Aggregates are also banned inside WHERE (WHERE runs per row, before any aggregation exists); filtering on aggregate results is HAVING's job, also next lesson.",
        },
        {
          type: "keypoint",
          title: "The profiling battery",
          content:
            "When handed an unknown table, run one aggregate query per interesting column: COUNT(*), COUNT(col), COUNT(DISTINCT col), MIN(col), MAX(col). Five numbers tell you size, missingness, cardinality (how many distinct values a column has), and range — including surprises like MAX(order_date) in the future or MIN(amount) negative. Analysts at every serious shop run this before trusting any table.",
        },
        {
          type: "code-note",
          code: "SELECT\n  ROUND(AVG(amount), 2) AS avg_order_value,\n  MIN(created_at)       AS first_order,\n  MAX(created_at)       AS latest_order\nFROM orders\nWHERE status = 'shipped';",
          content:
            "Aggregates compose with everything you know: WHERE filters the input set first, and scalar functions like ROUND dress the output. MIN/MAX on timestamps give you a table's time coverage in one glance.",
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
        kind: "comparison",
        title: "Five Aggregates, One Column of Values",
        caption:
          "The same input — amounts 100, 200, NULL, 300 — flows into each function. Click each node to see exactly how it handles the NULL.",
        nodes: [
          {
            id: "input",
            label: "Input rows",
            sublabel: "100, 200, NULL, 300",
            detail:
              "Four rows from orders.amount after WHERE. One value is missing. Every aggregate below reads this same set — but they disagree about what it contains.",
            x: 12,
            y: 45,
            accent: true,
          },
          {
            id: "countstar",
            label: "COUNT(*)",
            sublabel: "→ 4",
            detail:
              "Counts rows, not values — the NULL row still counts. Use for 'how many orders', regardless of any column's completeness.",
            x: 45,
            y: 10,
            accent: false,
          },
          {
            id: "countcol",
            label: "COUNT(amount)",
            sublabel: "→ 3",
            detail:
              "Counts non-NULL values only. COUNT(*) − COUNT(amount) = 1 missing value — the standard NULL-profiling identity.",
            x: 45,
            y: 32,
            accent: false,
          },
          {
            id: "sum",
            label: "SUM(amount)",
            sublabel: "→ 600",
            detail:
              "Adds the three real values; the NULL is skipped, not treated as zero. On an empty input set SUM returns NULL — wrap in COALESCE for dashboard safety.",
            x: 45,
            y: 54,
            accent: false,
          },
          {
            id: "avg",
            label: "AVG(amount)",
            sublabel: "→ 200",
            detail:
              "600 ÷ 3 = 200: the denominator is the count of NON-NULL values. If missing should mean zero, AVG(COALESCE(amount, 0)) = 150. Two defensible answers — the analyst must pick one deliberately.",
            x: 45,
            y: 76,
            accent: true,
          },
          {
            id: "minmax",
            label: "MIN / MAX",
            sublabel: "→ 100 / 300",
            detail:
              "Extremes of the non-NULL values. Also work on text (alphabetical) and dates (earliest/latest) — MIN(created_at) is your table's start of history.",
            x: 45,
            y: 98,
            accent: false,
          },
          {
            id: "onerow",
            label: "One output row",
            sublabel: "the whole point",
            detail:
              "Without GROUP BY, any mix of aggregates yields exactly one row. Mixing in a bare column like customer_id is an error — there's no single value to show for it.",
            x: 82,
            y: 45,
            accent: false,
          },
        ],
        edges: [
          { from: "input", to: "countstar", label: "rows" },
          { from: "input", to: "countcol", label: "non-NULL" },
          { from: "input", to: "sum", label: "skips NULL" },
          { from: "input", to: "avg", label: "÷ non-NULL count" },
          { from: "input", to: "minmax", label: "extremes" },
          { from: "avg", to: "onerow" },
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
          title: "Count the table",
          scenario: "How many orders does the shop have in total?",
          steps: [
            {
              code: "SELECT COUNT(*) AS total_orders\nFROM orders;",
              explanation:
                "COUNT(*) counts every row. The result is one row, one column. Aliasing the aggregate (AS total_orders) is near-mandatory in practice — unaliased aggregates surface as unhelpful headers like count or ?column?.",
            },
          ],
          output: " total_orders\n--------------\n         1000\n(1 row)",
        },
        {
          difficulty: "Easy",
          title: "Revenue and average order value",
          scenario:
            "Finance wants total revenue and the average order value for shipped orders only.",
          steps: [
            {
              code: "SELECT\n  SUM(amount) AS total_revenue,\n  ROUND(AVG(amount), 2) AS avg_order_value\nFROM orders\nWHERE status = 'shipped';",
              explanation:
                "WHERE shrinks the input to shipped orders before any aggregation — the aggregates never see cancelled rows. Both metrics come from one scan. ROUND(…, 2) formats the mean to cents; SUM of exact decimal amounts needs no rounding.",
            },
          ],
          output:
            " total_revenue | avg_order_value\n---------------+-----------------\n     128450.75 | 148.11\n(1 row)",
        },
        {
          difficulty: "Medium",
          title: "The three COUNTs on one column",
          scenario:
            "The coupon_code column is NULL when no coupon was used. Product wants: total orders, orders that used a coupon, and how many distinct coupon codes are in circulation.",
          steps: [
            {
              code: "SELECT\n  COUNT(*) AS total_orders,",
              explanation: "Row count — every order, coupon or not.",
            },
            {
              code: "  COUNT(coupon_code) AS orders_with_coupon,",
              explanation:
                "COUNT(column) skips NULLs, so this counts only orders where a coupon code is present. The gap to COUNT(*) is the no-coupon count — no second query needed.",
            },
            {
              code: "  COUNT(DISTINCT coupon_code) AS distinct_codes\nFROM orders;",
              explanation:
                "DISTINCT collapses repeats before counting: 380 coupon orders might share just 9 unique codes. Note DISTINCT also ignores NULL — it counts distinct real values.",
            },
          ],
          output:
            " total_orders | orders_with_coupon | distinct_codes\n--------------+--------------------+----------------\n         1000 |                380 |              9\n(1 row)",
        },
        {
          difficulty: "Hard",
          title: "The NULL-average disagreement",
          scenario:
            "Support tickets have a satisfaction_rating (1–5) that is NULL when the customer skipped the survey. Two analysts report different 'average satisfaction' numbers from the same table. Reconcile them.",
          steps: [
            {
              code: "-- ratings: 5, 4, NULL, NULL, 3\nSELECT ROUND(AVG(satisfaction_rating), 2) AS avg_of_responses\nFROM tickets;",
              explanation:
                "Analyst A: AVG skips NULLs — (5+4+3)/3 = 4.00. This answers 'how satisfied are customers WHO RESPONDED' — the survey-respondent mean.",
            },
            {
              code: "SELECT ROUND(AVG(COALESCE(satisfaction_rating, 0)), 2)\n  AS avg_all_tickets\nFROM tickets;",
              explanation:
                "Analyst B: COALESCE turns each NULL into 0 first — (5+4+0+0+3)/5 = 2.40. This treats silence as zero satisfaction, which is a strong (and usually wrong) assumption. Neither number is a lie; they answer different questions.",
            },
            {
              code: "SELECT\n  ROUND(AVG(satisfaction_rating), 2) AS avg_of_responses,\n  COUNT(satisfaction_rating)::numeric / COUNT(*) AS response_rate\nFROM tickets;",
              explanation:
                "The professional resolution: report the respondent mean TOGETHER with the response rate (3/5 = 0.60). A 4.0 rating at 60% response tells the whole story; either number alone misleads. The ::numeric cast prevents integer division from truncating 3/5 to 0.",
            },
          ],
          output:
            " avg_of_responses | response_rate\n------------------+---------------\n             4.00 | 0.60\n(1 row)",
        },
        {
          difficulty: "Industry Example",
          title: "Profiling a freshly delivered table",
          scenario:
            "A vendor drops a transactions extract into the warehouse. Before anyone builds on it, an analyst runs the standard profiling battery to check size, coverage, missingness, and sanity.",
          steps: [
            {
              code: "SELECT\n  COUNT(*)                       AS row_count,\n  COUNT(DISTINCT transaction_id) AS distinct_ids,",
              explanation:
                "First sanity check: if row_count ≠ distinct_ids, the extract contains duplicate transactions and every downstream SUM would double-count. Here: 52,310 vs 52,310 — clean.",
            },
            {
              code: "  COUNT(*) - COUNT(amount)       AS null_amounts,\n  MIN(amount)                    AS min_amount,\n  MAX(amount)                    AS max_amount,",
              explanation:
                "Missingness and range in one pass. A negative MIN(amount) flags refunds mixed into sales; a MAX far above plausible basket size flags test data or currency confusion (cents vs dollars).",
            },
            {
              code: "  MIN(transaction_date)          AS first_day,\n  MAX(transaction_date)          AS last_day\nFROM vendor_transactions;",
              explanation:
                "Time coverage: does the extract actually span the promised period? A last_day of 2026-07-02 on a 'full H1' delivery means two days leaked in — or the cutoff was misapplied. Five aggregates caught three classes of defect before a single report was built.",
            },
          ],
          output:
            " row_count | distinct_ids | null_amounts | min_amount | max_amount | first_day  | last_day\n-----------+--------------+--------------+------------+------------+------------+------------\n     52310 |        52310 |           14 | -240.00    | 8999.00    | 2026-01-01 | 2026-07-02\n(1 row)",
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
          "Profile the orders table (order_id, customer_id, amount, coupon_code, status). In ONE query over non-cancelled orders, compute: total order count (order_count), total revenue (total_revenue), average order value rounded to 2 decimals (avg_value), and number of distinct customers (unique_customers). Fill in the blanks.",
        starterCode:
          "-- orders(order_id, customer_id, amount, coupon_code, status)\n-- Non-cancelled rows: (1, 10, 100.00), (2, 10, 200.00), (3, 12, 300.00)\n-- Cancelled row:      (4, 13, 999.00)\n\nSELECT\n  ___(*) AS order_count,\n  ___(amount) AS total_revenue,\n  ROUND(___(amount), 2) AS avg_value,\n  COUNT(___ customer_id) AS unique_customers\nFROM orders\nWHERE status <> 'cancelled';",
        solutionCode:
          "-- orders(order_id, customer_id, amount, coupon_code, status)\n-- Non-cancelled rows: (1, 10, 100.00), (2, 10, 200.00), (3, 12, 300.00)\n-- Cancelled row:      (4, 13, 999.00)\n\nSELECT\n  COUNT(*) AS order_count,\n  SUM(amount) AS total_revenue,\n  ROUND(AVG(amount), 2) AS avg_value,\n  COUNT(DISTINCT customer_id) AS unique_customers\nFROM orders\nWHERE status <> 'cancelled';",
        expectedOutput:
          " order_count | total_revenue | avg_value | unique_customers\n-------------+---------------+-----------+------------------\n           3 |        600.00 |    200.00 |                2\n(1 row)",
        hints: [
          "Four aggregate slots: a row counter, a totalizer, a mean, and a distinct counter.",
          "Row count is COUNT(*); total is SUM(amount); mean is AVG(amount).",
          "Unique customers needs the DISTINCT keyword inside COUNT: COUNT(DISTINCT customer_id).",
          "Customer 10 placed two orders, so unique_customers is 2, not 3. The cancelled 999.00 order must not appear in any number.",
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
          id: "sql05_mcq_01",
          difficulty: "Easy",
          question:
            "The email column is NULL in 200 of 1,000 rows. What does COUNT(email) return?",
          options: ["1000", "800", "200", "NULL"],
          correctIndex: 1,
          explanation:
            "COUNT(column) counts only non-NULL values: 1,000 − 200 = 800. COUNT(*) would return 1,000 because it counts rows regardless of NULLs. 200 is the NULL count itself (COUNT(*) − COUNT(email)). COUNT never returns NULL — even on an empty table it returns 0.",
        },
        {
          type: "mcq",
          id: "sql05_mcq_02",
          difficulty: "Easy",
          question: "Which aggregate works on text columns?",
          options: [
            "SUM",
            "AVG",
            "MIN and MAX",
            "None — aggregates are numeric-only",
          ],
          correctIndex: 2,
          explanation:
            "MIN and MAX need only an ordering, and text has one (alphabetical), as do dates (chronological) — MIN(name) is the alphabetically first name. SUM and AVG require arithmetic, which text doesn't support, so they error on text columns.",
        },
        {
          type: "mcq",
          id: "sql05_mcq_03",
          difficulty: "Medium",
          question:
            "The ratings column contains 4, NULL, 2. What does AVG(ratings) return?",
          options: ["2.0", "3.0", "NULL", "2.67"],
          correctIndex: 1,
          explanation:
            "AVG skips NULLs in both numerator and denominator: (4+2)/2 = 3.0. 2.0 would be (4+0+2)/3 — treating NULL as zero, which requires an explicit COALESCE. NULL is only returned when EVERY input value is NULL (or the set is empty). 2.67 is (4+2+2)/3 — a miscalculation.",
        },
        {
          type: "mcq",
          id: "sql05_mcq_04",
          difficulty: "Medium",
          question:
            "Why is SELECT customer_id, COUNT(*) FROM orders; rejected by the database?",
          options: [
            "COUNT(*) cannot appear with any other expression in SELECT",
            "The aggregate collapses to one row, and there is no single customer_id value to display — grouping is required",
            "customer_id must be wrapped in MAX() first",
            "The query is valid; it returns each customer with the total order count",
          ],
          correctIndex: 1,
          explanation:
            "Aggregation without GROUP BY produces one output row summarizing ALL input rows — but customer_id has many different values across those rows, so there's no coherent single value to print; SQL rejects the ambiguity. Aggregates can absolutely appear alongside other AGGREGATES (or grouped columns, once you know GROUP BY). Wrapping in MAX() would make it valid syntactically but silently answers a different question. And no dialect returns per-customer counts without a GROUP BY — MySQL's old permissive mode picked an arbitrary customer_id, which is worse than an error.",
        },
        {
          type: "scenario",
          id: "sql05_sc_01",
          difficulty: "Hard",
          scenario:
            "A revenue dashboard tile runs SELECT SUM(amount) FROM orders WHERE created_at::date = CURRENT_DATE. On days with zero orders the tile shows a blank instead of $0, and a downstream alert that computes 'today minus yesterday' crashes.",
          question: "What is happening, and what is the minimal fix?",
          options: [
            "The date cast fails on empty tables; add a NOT NULL constraint",
            "SUM over zero rows returns NULL, not 0; wrap it as COALESCE(SUM(amount), 0)",
            "WHERE cannot compare dates; use BETWEEN instead",
            "COUNT should be used instead of SUM for money",
          ],
          correctIndex: 1,
          explanation:
            "All aggregates except COUNT return NULL over an empty input set — SUM included — and NULL propagates through the downstream subtraction, blanking the tile and crashing the alert. COALESCE(SUM(amount), 0) substitutes the intended zero. Casts don't fail on empty sets (they never execute without rows). Date comparison in WHERE is fully supported. COUNT would count orders, not revenue — a different metric entirely.",
        },
        {
          type: "coding",
          id: "sql05_code_01",
          difficulty: "Hard",
          prompt:
            "The tickets table has satisfaction_rating (1–5, NULL when the survey was skipped). Write one query returning: the average rating among respondents rounded to 2 decimals (avg_rating), and the response rate as respondents divided by all tickets rounded to 2 decimals (response_rate). Avoid integer division.",
          starterCode:
            "-- tickets(ticket_id, satisfaction_rating)\n-- Rows: (1, 5), (2, 4), (3, NULL), (4, NULL), (5, 3)\n\n",
          solutionCode:
            "SELECT\n  ROUND(AVG(satisfaction_rating), 2) AS avg_rating,\n  ROUND(COUNT(satisfaction_rating)::numeric / COUNT(*), 2) AS response_rate\nFROM tickets;",
          expectedOutput:
            " avg_rating | response_rate\n------------+---------------\n       4.00 | 0.60\n(1 row)",
          tests: [
            {
              name: "Respondent mean",
              description: "avg_rating is 4.00 — NULLs excluded from numerator and denominator",
            },
            {
              name: "No integer division",
              description: "response_rate is 0.60, not 0 — a numeric/decimal cast is applied before dividing",
            },
            {
              name: "Single query",
              description: "Both metrics come from one SELECT over tickets",
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
            "Explain the difference between COUNT(*), COUNT(column), and COUNT(DISTINCT column). When does each give a different number?",
          answer:
            "COUNT(*) counts rows in the input set — NULLs are irrelevant because it never looks at a value. COUNT(column) counts rows where that column is non-NULL, so it diverges from COUNT(*) exactly when the column has missing values; the difference is the NULL count, which makes the pair a one-line missingness profile. COUNT(DISTINCT column) collapses duplicate values first and also ignores NULLs, so it measures cardinality — 380 coupon-using orders might involve only 9 distinct codes. A concrete example: on an orders table with 1,000 rows, 60 missing coupon codes, and heavy code reuse, the three counts might read 1,000 / 940 / 9 — three different business questions answered by what looks like the same function. In interviews I'd add that COUNT(DISTINCT) can be significantly more expensive at scale because it must track the set of values seen.",
        },
        {
          question:
            "How do aggregate functions treat NULLs, and how can that mislead a metric?",
          answer:
            "Every standard aggregate except COUNT(*) skips NULLs: SUM adds only real values, MIN/MAX consider only real values, and AVG divides by the count of non-NULL inputs — not the row count. The classic trap is a satisfaction or rating average: AVG over (5, 4, NULL, NULL, 3) is 4.0, the respondent mean, but reporting it as 'customer satisfaction' hides that 40% never answered. Whether missing should mean 'excluded' or 'zero' is a business decision — AVG(col) versus AVG(COALESCE(col, 0)) — and the honest report usually shows the respondent mean alongside the response rate. A second trap is the empty set: SUM/AVG/MIN/MAX return NULL over zero rows, so dashboard queries should wrap sums in COALESCE(…, 0) to avoid blank tiles and NULL-propagating downstream arithmetic.",
        },
        {
          question:
            "You're given a brand-new table nobody documented. What aggregate queries do you run first, and what is each one checking?",
          answer:
            "I run a profiling battery before trusting anything. COUNT(*) establishes scale. COUNT(DISTINCT primary-key-candidate) against COUNT(*) checks uniqueness — a mismatch means duplicates, and every downstream SUM would double-count. COUNT(*) − COUNT(col) per important column measures missingness. MIN and MAX on numeric columns expose range problems: negative amounts (refunds mixed in), absurd maxima (cents-vs-dollars confusion, test rows). MIN and MAX on the date column verify time coverage against what the data was claimed to contain — a common way to catch truncated extracts. Finally COUNT(DISTINCT category-like columns) reveals cardinality, which tells me whether a column is a clean enum or free text. Ten minutes of aggregates routinely finds defects that would otherwise surface as a wrong executive number weeks later.",
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
        "1) Assuming AVG divides by the row count — it divides by the non-NULL count; decide explicitly whether NULL means 'exclude' or 'zero'. 2) Forgetting SUM/AVG/MIN/MAX return NULL on an empty set — wrap dashboard sums in COALESCE(…, 0). 3) Mixing a bare column with an aggregate (SELECT customer_id, COUNT(*)) without GROUP BY — the database rightly refuses. 4) Using COUNT(*) when the question is about unique entities — 1,000 orders is not 1,000 customers; reach for COUNT(DISTINCT customer_id). 5) Integer division in manual ratios — 3/5 is 0 in integer arithmetic; cast one side to numeric/decimal first.",
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
        "Try these prompts in the AI Tutor panel: • 'ELI5: why does AVG ignore NULLs, and when is that wrong?' • 'Quiz me: small value lists, I predict COUNT(*)/COUNT(col)/COUNT(DISTINCT col).' • 'Show me a real dashboard bug caused by SUM returning NULL on an empty day.' • 'Walk me through profiling an unknown table with five aggregates.' • 'Interview mode: grill me on the three COUNTs and grade my answer.'",
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
        "Aggregate function — a function that consumes a set of rows and returns one value. COUNT(*) — number of rows in the input set. COUNT(column) — number of non-NULL values in a column. COUNT(DISTINCT column) — number of unique non-NULL values. SUM — total of non-NULL numeric values. AVG — arithmetic mean of non-NULL values. MIN / MAX — smallest / largest non-NULL value; also valid for text and dates. Cardinality — the number of distinct values in a column. COALESCE — substitutes a default for NULL; used to make missing mean zero, or to guard empty-set sums. Empty-set behavior — COUNT returns 0; all other aggregates return NULL. Profiling battery — the standard first-contact query set: counts, distincts, null gaps, extremes. Integer division — division of two integers that truncates the fraction; avoided by casting to numeric.",
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
        "• Docs: PostgreSQL manual — 'Aggregate Functions' for the full list beyond the core five (STRING_AGG, ARRAY_AGG, statistical aggregates). • Read: 'Aggregate Functions' chapter of Mode's SQL tutorial for business-flavored practice sets. • Practice: profile any real table you have with the five-aggregate battery, then write down one surprise it revealed — there is always one. • Next in DSM: one number for the whole table is rarely enough — GROUP BY & HAVING turns these same functions into per-category breakdowns.",
    },

    /* ---------------------------------------------------------------- */
    /*  12 — Recap                                                       */
    /* ---------------------------------------------------------------- */
    {
      id: "recap",
      type: "recap",
      tocLabel: "Recap",
      content:
        "✓ Aggregates collapse a set of rows into one value: COUNT, SUM, AVG, MIN, MAX — one output row when there's no grouping.\n✓ COUNT(*) counts rows; COUNT(col) counts non-NULL values; COUNT(DISTINCT col) counts unique values — three different questions.\n✓ SUM, AVG, MIN, MAX skip NULLs; AVG divides by the non-NULL count, so decide consciously whether missing means excluded or zero.\n✓ Over an empty set, COUNT returns 0 but the others return NULL — COALESCE(SUM(…), 0) keeps dashboards honest.\n✓ Bare columns can't mix with aggregates without grouping, and aggregates can't appear in WHERE.\n✓ The profiling battery (counts, distincts, null gaps, extremes) is your first move on any unfamiliar table.\n\nNext up: GROUP BY & HAVING. One number for the whole table answers 'how much' — next you'll split the table into groups and get that number per country, per month, per product, all in a single query.",
    },
  ],
};
