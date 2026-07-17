import type { Lesson } from "@/lib/curriculum/types";

export const caseStatements: Lesson = {
  meta: {
    id: "sql.advanced.case-statements",
    slug: "case-statements",
    title: "CASE Statements",
    description:
      "Embed if/else logic in queries: derive categories, build custom sort keys, and pivot categories into columns with conditional aggregation.",
    estimatedTime: "30 mins",
    difficulty: "Intermediate",
    xpReward: 70,
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
        hook: "Every dataset speaks in raw values — 23, 'DE', 4.99 — but stakeholders think in labels: 'young adult', 'EU region', 'budget tier'. The translator between those worlds is CASE, SQL's if/else. Master it and you'll also unlock a magic trick: turning rows into columns with a single SUM.",
        what: "CASE evaluates conditions in order and returns the value of the first one that matches: CASE WHEN amount > 100 THEN 'large' WHEN amount > 50 THEN 'medium' ELSE 'small' END. It's an expression, not a statement — legal anywhere a value is: SELECT, WHERE, GROUP BY, ORDER BY, and inside aggregate functions.",
        why: "Real analysis constantly needs derived categories (age bands, revenue tiers, pass/fail flags) and business-defined orderings that alphabetical sorting can't produce. And conditional aggregation — SUM(CASE WHEN … THEN … ELSE 0 END) — is the standard SQL way to build pivot-style reports: one row per group, one column per category.",
        whereUsed:
          "KPI dashboards (bucketed metrics), cohort labeling, data-quality flags, custom sort orders for statuses and priorities, and the wide-format tables every BI tool and spreadsheet export expects.",
        objectives: [
          "Write searched CASE expressions with ordered WHEN branches and an ELSE default",
          "Derive category columns (tiers, bands, flags) from raw values",
          "Use CASE inside ORDER BY for business-defined sort orders",
          "Pivot categories into columns with SUM/COUNT(CASE WHEN …) conditional aggregation",
          "Predict CASE behavior with NULLs and missing ELSE branches",
        ],
        realWorldApps: [
          {
            company: "Netflix",
            headline: "Engagement tiers",
            detail:
              "Viewing hours become labels — binge, regular, casual, dormant — via CASE bands feeding retention models and win-back campaigns.",
          },
          {
            company: "Stripe",
            headline: "Risk bucketing",
            detail:
              "Transaction risk scores map to review lanes (auto-approve, manual review, block) with CASE ladders in the analytics layer.",
          },
          {
            company: "Airbnb",
            headline: "Occupancy pivot reports",
            detail:
              "Market dashboards show bookings by listing type as columns — entire home, private room, shared — built with COUNT(CASE WHEN …) per type.",
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
            "The searched form is the workhorse: CASE WHEN condition THEN result WHEN condition THEN result ELSE default END. Conditions are checked top to bottom; the FIRST true branch wins and evaluation stops — later branches never run. Each WHEN takes any boolean predicate you could write in WHERE: comparisons, AND/OR, IN, LIKE, IS NULL.",
        },
        {
          type: "analogy",
          title: "The airport security lanes",
          content:
            "A security officer routes each traveler through the first lane whose rule matches: crew badge? → crew lane. PreCheck? → fast lane. Otherwise → standard lane. One traveler, one lane, rules checked in posted order — a traveler with BOTH a crew badge and PreCheck goes to the crew lane because it's checked first. CASE routes each row exactly like that: first matching WHEN wins, order matters.",
        },
        {
          type: "keypoint",
          title: "Branch order IS the logic",
          content:
            "Because evaluation stops at the first match, overlapping conditions resolve by position. CASE WHEN amount > 100 THEN 'large' WHEN amount > 50 THEN 'medium' works because a 150 row hits 'large' first. Reverse the branches and every row over 50 — including 150 — lands in 'medium'; 'large' becomes unreachable dead code. Write bands from most specific (or highest) to least, and review any reordering as a logic change.",
        },
        {
          type: "code-note",
          code: "SELECT\n  order_id, amount,\n  CASE\n    WHEN amount >= 100 THEN 'large'\n    WHEN amount >= 50  THEN 'medium'\n    ELSE 'small'\n  END AS size_tier\nFROM orders;",
          content:
            "The canonical derived category. Note the tiers are collectively exhaustive (ELSE catches the rest) and the boundaries use >= consistently — off-by-one band edges (is exactly 100 large or medium?) are the most common review comment on CASE ladders. Alias the whole expression; the END is part of it.",
        },
        {
          type: "warning",
          title: "No ELSE means NULL, and NULL conditions don't match",
          content:
            "Omit ELSE and every unmatched row gets NULL — sometimes intended, often a silent hole in the report. Separately: a WHEN whose condition evaluates to unknown (any comparison against NULL) simply doesn't match, falling through to later branches or the ELSE. So CASE WHEN amount > 100 … classifies a NULL amount into the ELSE bucket, not an error. If NULL deserves its own label, test it explicitly — WHEN amount IS NULL THEN 'unknown' — and put that branch FIRST.",
        },
        {
          type: "text",
          content:
            "There's also a compact 'simple' form for pure equality ladders: CASE status WHEN 'shipped' THEN 1 WHEN 'pending' THEN 2 ELSE 3 END. It compares status to each value with =. Caveat: because it uses =, it can never match NULL (NULL = NULL is unknown) — a NULL status always falls to ELSE. The searched form handles everything the simple form can, so many teams standardize on searched-only.",
        },
        {
          type: "keypoint",
          title: "CASE inside ORDER BY: business sort orders",
          content:
            "Alphabetical order rarely matches business order — 'cancelled' < 'pending' < 'shipped' alphabetically, but ops wants urgent statuses first. ORDER BY CASE status WHEN 'pending' THEN 1 WHEN 'shipped' THEN 2 ELSE 3 END builds the custom key inline. You met this trick in ORDER BY & LIMIT's priority example; now you own the machinery.",
        },
        {
          type: "code-note",
          code: "SELECT\n  country,\n  COUNT(*) AS orders,\n  SUM(CASE WHEN status = 'shipped'   THEN 1 ELSE 0 END) AS shipped,\n  SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) AS cancelled,\n  SUM(CASE WHEN status = 'shipped' THEN amount ELSE 0 END)\n    AS shipped_revenue\nFROM orders\nGROUP BY country;",
          content:
            "Conditional aggregation — the pivot trick. Each CASE emits 1 (or an amount) for rows matching its category and 0 otherwise; SUM adds them up per group. Result: one row per country, one COLUMN per status — the wide format dashboards want. COUNT(CASE WHEN … THEN 1 END) is the equivalent idiom (COUNT ignores the NULL from the missing ELSE). PostgreSQL offers FILTER (WHERE …) as cleaner sugar; the CASE form runs everywhere.",
        },
        {
          type: "expandable",
          title: "Rates and ratios from conditional aggregates",
          content:
            "Divide two conditional aggregates and you get a per-group rate in one pass: AVG(CASE WHEN converted THEN 1.0 ELSE 0 END) is the conversion rate (mind the 1.0 — integer division strikes again), and SUM(CASE WHEN plan = 'pro' THEN revenue ELSE 0 END) / NULLIF(SUM(revenue), 0) is pro's revenue share with a divide-by-zero guard. This one-pass pattern replaces joining multiple filtered subqueries — one scan instead of three, and no join keys to get wrong.",
        },
        {
          type: "expandable",
          title: "CASE in WHERE and GROUP BY",
          content:
            "Being an expression, CASE works in WHERE (rarely needed — plain boolean logic is usually clearer) and in GROUP BY: GROUP BY CASE WHEN amount >= 100 THEN 'large' … END groups directly by the derived tier. In engines that don't allow grouping by a SELECT alias, you either repeat the CASE in GROUP BY or — cleaner — derive the column in a CTE and group by it there, the pipeline style from the CTE lesson.",
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
        kind: "decision-tree",
        title: "How One Row Falls Through a CASE Ladder",
        caption:
          "A row with amount = 72 enters the tier ladder. Click each node — first true condition wins, evaluation stops, order is everything.",
        nodes: [
          {
            id: "row",
            label: "Row: amount = 72",
            sublabel: "enters the ladder",
            detail:
              "Each row is evaluated independently against the ladder — CASE is per-row logic, unlike window functions (neighbors) or aggregates (groups). NULL amounts would fail every comparison and fall straight to ELSE.",
            x: 50,
            y: 8,
            accent: true,
          },
          {
            id: "when1",
            label: "WHEN amount >= 100",
            sublabel: "72 >= 100? false",
            detail:
              "First branch checked, no match — fall through. If this row were 150, evaluation would END here with 'large'; the later >= 50 branch would never see it. That short-circuit is why overlapping bands are safe when ordered high-to-low.",
            x: 50,
            y: 32,
            accent: false,
          },
          {
            id: "when2",
            label: "WHEN amount >= 50",
            sublabel: "72 >= 50? TRUE",
            detail:
              "Match — the expression returns 'medium' and stops. Branch position resolved the overlap: 72 also fails nothing below, but it will never be tested. Reversing branch order would funnel 150-value rows here too — the classic dead-branch bug.",
            x: 50,
            y: 56,
            accent: true,
          },
          {
            id: "else",
            label: "ELSE 'small'",
            sublabel: "the safety net",
            detail:
              "Catches everything no WHEN matched — including NULL amounts, whose comparisons are unknown, not false... functionally the same fall-through. Omit ELSE and these rows get NULL: sometimes intended, often a silent report hole.",
            x: 26,
            y: 80,
            accent: false,
          },
          {
            id: "result",
            label: "→ 'medium'",
            sublabel: "one value per row",
            detail:
              "The row exits with exactly one label. Downstream, this derived column behaves like any other: group by it, filter it (one level up if derived in the same SELECT), sort by it, or wrap it in SUM for pivot counting.",
            x: 74,
            y: 80,
            accent: false,
          },
        ],
        edges: [
          { from: "row", to: "when1", label: "test in order" },
          { from: "when1", to: "when2", label: "false → next" },
          { from: "when2", to: "result", label: "TRUE → stop" },
          { from: "when1", to: "else", label: "if all false" },
          { from: "else", to: "result", label: "default" },
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
          title: "A pass/fail flag",
          scenario:
            "Mark each order as express-eligible (amount under 500 and status shipped) or not.",
          steps: [
            {
              code: "SELECT\n  order_id, amount, status,\n  CASE\n    WHEN amount < 500 AND status = 'shipped' THEN 'eligible'\n    ELSE 'not eligible'\n  END AS express_flag\nFROM orders;",
              explanation:
                "One WHEN with a compound condition, one ELSE — the simplest useful ladder. The condition language is identical to WHERE's; anything filterable is CASE-able. Every row gets exactly one of the two labels.",
            },
          ],
          output:
            " order_id | amount | status    | express_flag\n----------+--------+-----------+---------------\n     1001 | 250.00 | shipped   | eligible\n     1002 | 750.00 | shipped   | not eligible\n     1003 |  99.00 | cancelled | not eligible\n(3 rows)",
        },
        {
          difficulty: "Easy",
          title: "Age bands for a cohort report",
          scenario:
            "Marketing wants users bucketed: under 25, 25–34, 35–49, 50+. Watch the boundary logic.",
          steps: [
            {
              code: "SELECT\n  user_id, age,\n  CASE\n    WHEN age IS NULL THEN 'unknown'\n    WHEN age < 25 THEN 'under 25'\n    WHEN age < 35 THEN '25-34'\n    WHEN age < 50 THEN '35-49'\n    ELSE '50+'\n  END AS age_band\nFROM users;",
              explanation:
                "Two deliberate choices. The IS NULL branch comes FIRST — otherwise NULL ages silently land in the ELSE as '50+', a real bug from real dashboards. And each band only states its UPPER bound: a 30-year-old fails < 25, passes < 35 — the earlier branch already excluded under-25s, so ranges need no AND age >= 25. Ladders ordered low-to-high with < are self-sealing.",
            },
          ],
          output:
            " user_id | age | age_band\n---------+-----+----------\n     501 |  22 | under 25\n     502 |  30 | 25-34\n     503 |     | unknown\n     504 |  67 | 50+\n(4 rows)",
        },
        {
          difficulty: "Medium",
          title: "Business sort order for a support queue",
          scenario:
            "Tickets must list urgent → high → normal → low, then oldest first. Alphabetical order would put 'high' before 'urgent'.",
          steps: [
            {
              code: "SELECT ticket_id, priority, created_at\nFROM tickets\nWHERE status = 'open'\nORDER BY\n  CASE priority\n    WHEN 'urgent' THEN 1\n    WHEN 'high'   THEN 2\n    WHEN 'normal' THEN 3\n    WHEN 'low'    THEN 4\n    ELSE 5\n  END,\n  created_at;",
              explanation:
                "The simple-form CASE maps each priority to a sortable integer; ORDER BY sorts by that invisible key, then by age. The ELSE 5 catches unexpected values (typos, new priorities) by sinking them to the bottom instead of erroring — visible, not lost. This inline mapping beats maintaining a lookup table for small, stable orderings; graduate to a reference table when the list grows or needs governance.",
            },
          ],
          output:
            " ticket_id | priority | created_at\n-----------+----------+---------------------\n       508 | urgent   | 2026-07-15 10:03:00\n       501 | high     | 2026-07-14 08:12:00\n       496 | normal   | 2026-07-13 17:40:00\n       502 | low      | 2026-07-14 09:00:00\n(4 rows)",
        },
        {
          difficulty: "Hard",
          title: "The pivot: statuses become columns",
          scenario:
            "Ops wants one row per country with shipped / pending / cancelled counts side by side — the wide format their spreadsheet expects.",
          steps: [
            {
              code: "SELECT\n  country,\n  SUM(CASE WHEN status = 'shipped'   THEN 1 ELSE 0 END) AS shipped,\n  SUM(CASE WHEN status = 'pending'   THEN 1 ELSE 0 END) AS pending,\n  SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) AS cancelled",
              explanation:
                "Each CASE is a per-row indicator: 1 if the row belongs to that column's category, else 0. SUM then counts matches per group. Three CASEs = three columns, computed in ONE scan — versus the naive alternative of three filtered subqueries joined on country.",
            },
            {
              code: "  , ROUND(\n      100.0 * SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END)\n      / COUNT(*), 1\n    ) AS cancel_rate_pct\nFROM orders\nGROUP BY country\nORDER BY cancel_rate_pct DESC;",
              explanation:
                "Conditional aggregates divide like any numbers: cancellation rate per country falls out of the same single pass (100.0 forces decimal division). Compare with the long format GROUP BY country, status from the Foundations module: same information, different shape — long for further SQL processing, wide for human eyes. CASE pivoting is the bridge between them.",
            },
          ],
          output:
            " country | shipped | pending | cancelled | cancel_rate_pct\n---------+---------+---------+-----------+-----------------\n FR      |     130 |      60 |        25 |            11.6\n DE      |     260 |      90 |        40 |            10.3\n US      |     230 |      45 |        22 |             7.4\n(3 rows)",
        },
        {
          difficulty: "Industry Example",
          title: "One-pass funnel metrics from an events table",
          scenario:
            "A growth analyst needs per-channel funnel numbers — visitors, signups, purchasers, and conversion — from events(user_id, channel, event_type). One query, one scan, no joins.",
          steps: [
            {
              code: "SELECT\n  channel,\n  COUNT(DISTINCT user_id) AS visitors,\n  COUNT(DISTINCT CASE WHEN event_type = 'signup'\n                      THEN user_id END) AS signups,\n  COUNT(DISTINCT CASE WHEN event_type = 'purchase'\n                      THEN user_id END) AS purchasers,",
              explanation:
                "The advanced variant: CASE inside COUNT(DISTINCT …). For non-matching rows the CASE returns NULL (no ELSE — deliberately), and COUNT DISTINCT ignores NULLs, so each column counts unique users who did that action. This is where the 'missing ELSE means NULL' behavior becomes a feature.",
            },
            {
              code: "  ROUND(\n    100.0 * COUNT(DISTINCT CASE WHEN event_type = 'purchase'\n                                THEN user_id END)\n    / NULLIF(COUNT(DISTINCT user_id), 0), 1\n  ) AS visitor_to_buyer_pct\nFROM events\nGROUP BY channel\nORDER BY visitor_to_buyer_pct DESC;",
              explanation:
                "Conversion is the ratio of two conditional distinct counts; NULLIF guards a zero-visitor channel from dividing by zero (yielding NULL instead — honest). Compare with the CTE-per-stage funnel from the CTEs lesson: that one enforced stage ORDER (viewed before carted); this one trades that rigor for a single cheap scan. Knowing which trade you're making is the analyst's job.",
            },
          ],
          output:
            " channel  | visitors | signups | purchasers | visitor_to_buyer_pct\n----------+----------+---------+------------+----------------------\n referral |     1840 |     420 |        166 |                  9.0\n organic  |     5220 |     830 |        310 |                  5.9\n paid     |     3100 |     390 |        120 |                  3.9\n(3 rows)",
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
          "Build a one-row-per-plan revenue pivot from subscriptions(sub_id, plan, status, mrr): for each plan, count active subs (active_subs), count churned subs (churned_subs), and sum mrr for ACTIVE subs only (active_mrr). Order by active_mrr descending. Fill in the blanks.",
        starterCode:
          "-- subscriptions(sub_id, plan, status, mrr)\n-- Rows: (1,'pro','active',49), (2,'pro','churned',49), (3,'base','active',9),\n--       (4,'base','active',9), (5,'pro','active',49), (6,'base','churned',9)\n\nSELECT\n  plan,\n  SUM(CASE WHEN status = 'active'  THEN ___ ELSE 0 END) AS active_subs,\n  SUM(CASE WHEN status = ___ THEN 1 ELSE 0 END) AS churned_subs,\n  SUM(CASE WHEN status = 'active'  THEN ___ ELSE 0 END) AS active_mrr\nFROM subscriptions\nGROUP BY ___\nORDER BY active_mrr DESC;",
        solutionCode:
          "-- subscriptions(sub_id, plan, status, mrr)\n-- Rows: (1,'pro','active',49), (2,'pro','churned',49), (3,'base','active',9),\n--       (4,'base','active',9), (5,'pro','active',49), (6,'base','churned',9)\n\nSELECT\n  plan,\n  SUM(CASE WHEN status = 'active'  THEN 1 ELSE 0 END) AS active_subs,\n  SUM(CASE WHEN status = 'churned' THEN 1 ELSE 0 END) AS churned_subs,\n  SUM(CASE WHEN status = 'active'  THEN mrr ELSE 0 END) AS active_mrr\nFROM subscriptions\nGROUP BY plan\nORDER BY active_mrr DESC;",
        expectedOutput:
          " plan | active_subs | churned_subs | active_mrr\n------+-------------+--------------+------------\n pro  |           2 |            1 |         98\n base |           2 |            1 |         18\n(2 rows)",
        hints: [
          "Four blanks: what to add per matching row for a COUNT-style pivot, a status literal, what to add for a SUM-style pivot, and the grouping column.",
          "Counting matches means THEN 1; summing a measure means THEN mrr.",
          "The churn column tests status = 'churned' — string literal in single quotes.",
          "Group by plan. Check: pro active = subs 1 and 5 → 2 subs, 98 mrr; churned sub 2 contributes to churned_subs only.",
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
          id: "sql15_mcq_01",
          difficulty: "Easy",
          question:
            "In a CASE with several WHEN branches, which branch determines the result?",
          options: [
            "The last true condition",
            "The first true condition — evaluation then stops",
            "All true conditions, concatenated",
            "The branch with the most specific condition, regardless of order",
          ],
          correctIndex: 1,
          explanation:
            "CASE short-circuits: conditions are tested top to bottom and the first match returns immediately — later branches never execute. There's no 'most specific wins' intelligence; specificity is achieved by YOU ordering branches correctly. Nothing is concatenated, and the last-true rule describes no SQL construct.",
        },
        {
          type: "mcq",
          id: "sql15_mcq_02",
          difficulty: "Easy",
          question:
            "A CASE expression has no ELSE and a row matches no WHEN. What does the expression return for that row?",
          options: ["0", "An empty string", "NULL", "The query fails"],
          correctIndex: 2,
          explanation:
            "Missing ELSE is an implicit ELSE NULL. That's sometimes exploited deliberately (COUNT(CASE WHEN … THEN 1 END) relies on unmatched rows becoming NULL, which COUNT skips) and sometimes a silent bug (a label column full of NULLs). Never 0 or '' — SQL doesn't invent typed defaults — and it's perfectly legal, not an error.",
        },
        {
          type: "mcq",
          id: "sql15_mcq_03",
          difficulty: "Medium",
          question:
            "What does SUM(CASE WHEN status = 'shipped' THEN 1 ELSE 0 END) compute?",
          options: [
            "Total revenue of shipped orders",
            "The count of rows whose status is 'shipped'",
            "1 if any row is shipped, else 0",
            "The share of shipped rows",
          ],
          correctIndex: 1,
          explanation:
            "Each row contributes 1 when shipped and 0 otherwise; summing the indicator counts the matches — a conditional COUNT. Revenue would need THEN amount. A group-level any-flag would be MAX of the indicator. The SHARE would divide this sum by COUNT(*) — the numerator alone is just the count.",
        },
        {
          type: "mcq",
          id: "sql15_mcq_04",
          difficulty: "Medium",
          question:
            "The simple form CASE status WHEN NULL THEN 'missing' ELSE 'present' END is evaluated on a row where status IS NULL. What is returned?",
          options: [
            "'missing'",
            "'present'",
            "NULL",
            "A syntax error",
          ],
          correctIndex: 1,
          explanation:
            "The simple form compares with equality: status = NULL is unknown even when status IS NULL — so the WHEN never matches and the ELSE fires: 'present', the exact opposite of intent. This is the simple form's foot-gun; NULL tests need the searched form: CASE WHEN status IS NULL THEN 'missing' …. The syntax parses fine, which is what makes the bug quiet.",
        },
        {
          type: "scenario",
          id: "sql15_sc_01",
          difficulty: "Hard",
          scenario:
            "A revenue-tier report defines: CASE WHEN amount > 50 THEN 'medium' WHEN amount > 100 THEN 'large' ELSE 'small' END. QA notices the 'large' tier is empty even though many orders exceed 100.",
          question: "What is wrong?",
          options: [
            "The > operators should be >=",
            "Branches are misordered: every amount over 100 also exceeds 50, so the first branch captures it and 'large' is unreachable dead code — test the higher bound first",
            "ELSE must come before the WHENs",
            "CASE cannot compare numbers in multiple branches",
          ],
          correctIndex: 1,
          explanation:
            "Short-circuit evaluation makes branch order the logic: a 250 order satisfies > 50, returns 'medium', and never reaches the > 100 test. Correct ladders test the most restrictive (highest) band first: WHEN amount > 100 THEN 'large' WHEN amount > 50 THEN 'medium'. The >= vs > choice shifts only the exact boundary values, not an entire empty tier. ELSE is syntactically last, and multi-branch numeric comparison is precisely what CASE is for.",
        },
        {
          type: "coding",
          id: "sql15_code_01",
          difficulty: "Hard",
          prompt:
            "From orders(order_id, country, amount), produce a one-row summary with: total order count (total_orders), count of orders >= 200 (large_orders), revenue from DE (de_revenue), revenue from everywhere else (other_revenue). Use conditional aggregation — no WHERE, no GROUP BY, one scan.",
          starterCode:
            "-- orders(order_id, country, amount)\n-- Rows: (1,'DE',250.00), (2,'US',80.00), (3,'DE',150.00), (4,'FR',300.00)\n\n",
          solutionCode:
            "SELECT\n  COUNT(*) AS total_orders,\n  SUM(CASE WHEN amount >= 200 THEN 1 ELSE 0 END) AS large_orders,\n  SUM(CASE WHEN country = 'DE' THEN amount ELSE 0 END) AS de_revenue,\n  SUM(CASE WHEN country <> 'DE' THEN amount ELSE 0 END) AS other_revenue\nFROM orders;",
          expectedOutput:
            " total_orders | large_orders | de_revenue | other_revenue\n--------------+--------------+------------+---------------\n            4 |            2 |     400.00 |        380.00\n(1 row)",
          tests: [
            {
              name: "Single pass",
              description: "No WHERE or GROUP BY — all four metrics from one scan over 4 rows",
            },
            {
              name: "Indicator vs measure",
              description: "large_orders sums THEN 1 (a count: orders 1 and 4); revenue columns sum THEN amount",
            },
            {
              name: "Complementary split",
              description: "de_revenue (250+150=400) + other_revenue (80+300=380) covers all rows exactly once",
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
            "How would you pivot a long-format table (one row per country-status) into a wide report (one row per country, one column per status) in standard SQL?",
          answer:
            "Conditional aggregation: GROUP BY country, and for each desired column write SUM(CASE WHEN status = '<value>' THEN 1 ELSE 0 END) — or THEN amount for a revenue pivot. Each CASE acts as a per-row indicator; the aggregate collapses it per group, producing one column per category in a single scan. Compared with the alternative — one filtered subquery per status joined back on country — it's shorter, cheaper (one pass instead of N), and immune to join-key mismatches. Limitations worth stating: the category list is hard-coded, so a new status means editing the query — truly dynamic pivots need engine-specific features (crosstab in PostgreSQL, PIVOT in SQL Server/Snowflake) or the reporting layer. And COUNT(DISTINCT CASE WHEN … THEN user_id END) extends the pattern to unique-entity pivots, exploiting the fact that the missing ELSE yields NULLs, which COUNT DISTINCT ignores.",
        },
        {
          question:
            "What are the pitfalls of CASE expressions with NULL data?",
          answer:
            "Three distinct traps. First, a WHEN condition that compares against a NULL value evaluates to unknown and simply doesn't match, so NULL rows fall through to later branches or the ELSE — a NULL amount lands in whatever the ELSE says, silently miscategorized; the fix is an explicit WHEN x IS NULL branch placed FIRST. Second, the simple form CASE x WHEN NULL uses equality under the hood, and x = NULL is never true — so that branch is dead on arrival; NULL tests require the searched form. Third, a missing ELSE returns NULL for unmatched rows, which is either a deliberate tool (feeding COUNT DISTINCT, which skips NULLs) or a silent hole in a label column, depending on whether you meant it. My review habit: every CASE over a nullable column either handles NULL in its first branch or documents why fall-through is intended.",
        },
        {
          question:
            "You need per-segment metrics — counts, conditional revenue, and a rate — for a dashboard. Compare computing them with multiple filtered queries versus one conditional-aggregation query.",
          answer:
            "Multiple queries — one per metric with different WHERE clauses — are simple to write but scan the table repeatedly, multiply latency and warehouse cost, and worst of all can drift: if someone updates the date filter in three of the four queries, the dashboard quietly reports metrics over inconsistent populations. One conditional-aggregation query computes everything in a single scan with a single set of filters: COUNT(*) for volume, SUM(CASE …) for each conditional count or revenue slice, and ratios as divisions of those aggregates with NULLIF guarding zero denominators. Consistency is structural — every metric sees exactly the same rows. The trade-offs: the single query is denser to review, and if the metrics genuinely need different grains (order-level vs customer-level), forcing them into one scan causes the fan-out bugs from the joins module — in that case I'd use one CTE per grain within one statement, which keeps single-definition filters while respecting grains.",
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
        "1) Misordered overlapping branches — testing > 50 before > 100 makes the 'large' tier unreachable; order bands most-restrictive first. 2) Forgetting that a missing ELSE yields NULL — intended for COUNT(CASE …) tricks, a silent hole in label columns otherwise. 3) CASE x WHEN NULL — equality never matches NULL; use the searched form with IS NULL, placed first. 4) Integer division in rates — SUM(CASE WHEN … THEN 1 ELSE 0 END) / COUNT(*) truncates to 0; multiply by 100.0 or cast. 5) Repeating band boundaries inconsistently across queries — extract shared tier definitions into a CTE (or reference table) so 'large' means the same thing on every dashboard.",
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
        "Try these prompts in the AI Tutor panel: • 'ELI5: CASE with an airport-security-lanes analogy of your own.' • 'Quiz me: CASE ladders over tricky values (NULLs, boundaries) — I predict each row's label.' • 'Show me the dead-branch bug from misordered bands and how to spot it in review.' • 'Walk me from a long GROUP BY result to a wide pivot with SUM(CASE …), column by column.' • 'Interview mode: one-pass funnel metrics with conditional aggregation, then critique my NULL handling.'",
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
        "CASE expression — SQL's inline if/else; returns the first matching branch's value. Searched CASE — WHEN <condition> form; full predicate power. Simple CASE — CASE x WHEN value form; equality only, never matches NULL. Branch (WHEN/THEN) — one condition-result pair; tested in order. ELSE — the default branch; omitted = NULL. Short-circuit — evaluation stops at the first true condition. Dead branch — a WHEN no row can reach due to an earlier broader branch. Derived category — a label column computed from raw values (tiers, bands, flags). Conditional aggregation — aggregates over CASE indicators: SUM(CASE WHEN … THEN 1 ELSE 0 END). Pivot (wide format) — categories as columns; built in standard SQL via conditional aggregation. Indicator — a CASE returning 1/0 (or value/NULL) marking category membership. FILTER (WHERE …) — PostgreSQL sugar for conditional aggregates. NULLIF — divide-by-zero guard returning NULL when arguments match.",
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
        "• Docs: PostgreSQL manual — 'Conditional Expressions' (CASE, COALESCE, NULLIF) and 'Aggregate Expressions' for FILTER. • Read: Mode's SQL tutorial chapter on CASE for stakeholder-styled pivot practice. • Practice: take any GROUP BY two-column result you've written and pivot it wide with conditional aggregation; then add a rate column with a NULLIF guard. • Next in DSM: your logic toolkit is complete — String & Date Functions arms the other half: cleaning text keys and truncating timestamps, the raw material every CASE and GROUP BY depends on.",
    },

    /* ---------------------------------------------------------------- */
    /*  12 — Recap                                                       */
    /* ---------------------------------------------------------------- */
    {
      id: "recap",
      type: "recap",
      tocLabel: "Recap",
      content:
        "✓ CASE returns the first matching WHEN's value and stops — branch order IS the logic, and misordered overlapping bands create dead branches.\n✓ Missing ELSE yields NULL; NULL-valued conditions fall through — give NULL its own first branch when it deserves a label.\n✓ The simple form (CASE x WHEN v) is equality-only and can never match NULL; the searched form does everything.\n✓ CASE is an expression: use it in SELECT, ORDER BY (business sort orders), GROUP BY, and inside aggregates.\n✓ Conditional aggregation — SUM/COUNT over CASE indicators — pivots categories into columns and computes multi-metric reports in one scan.\n✓ Guard rates with 100.0 (decimal division) and NULLIF (zero denominators).\n\nNext up: String & Date Functions. Your ladders and pivots are only as good as the values feeding them — next you'll standardize messy text, split and extract fields, do date arithmetic, and truncate timestamps into the monthly buckets every trend report groups by.",
    },
  ],
};
