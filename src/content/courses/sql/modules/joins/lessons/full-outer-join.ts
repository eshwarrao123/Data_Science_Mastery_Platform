import type { Lesson } from "@/lib/curriculum/types";

export const fullOuterJoin: Lesson = {
  meta: {
    id: "sql.joins.full-outer-join",
    slug: "full-outer-join",
    title: "FULL OUTER JOIN",
    description:
      "Keep unmatched rows from both sides at once — the join type built for reconciliation, migration checks, and finding what exists only on one side.",
    estimatedTime: "25 mins",
    difficulty: "Intermediate",
    xpReward: 60,
    prerequisites: ["sql.joins.left-and-right-joins"],
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
        hook: "Your billing system says 1,204 active subscriptions. Your CRM says 1,187. Which rows disagree? A LEFT JOIN shows what billing has that CRM lacks; a RIGHT JOIN shows the reverse. FULL OUTER JOIN shows both discrepancy lists in one query — which is why it's the reconciliation tool of every data team.",
        what: "FULL OUTER JOIN returns matched pairs like INNER JOIN, plus unmatched rows from the LEFT table (right columns NULL-filled), plus unmatched rows from the RIGHT table (left columns NULL-filled). Nothing from either side is discarded.",
        why: "Comparing two datasets is a daily task: old system vs new system, source vs warehouse copy, forecast vs actuals. Any one-sided join silently hides one direction of mismatch. FULL OUTER JOIN is the only join that makes both directions visible simultaneously — and its NULL patterns tell you exactly which side each discrepancy lives on.",
        whereUsed:
          "Data migrations, pipeline parity checks, finance reconciliations (payments vs invoices), and merging two partial reference lists into one complete one.",
        objectives: [
          "Predict FULL OUTER JOIN output: matches plus both sides' orphans",
          "Read NULL patterns to classify rows as left-only, right-only, or matched",
          "Build a reconciliation query that surfaces discrepancies in both directions",
          "Use COALESCE on join keys to produce a single unified key column",
          "Work around missing FULL OUTER JOIN support with LEFT JOIN ∪ anti-RIGHT JOIN",
        ],
        realWorldApps: [
          {
            company: "Stripe",
            headline: "Payout reconciliation",
            detail:
              "Internal ledgers are reconciled against bank statement lines — a full-outer comparison surfaces payments without bank entries and bank entries without payments, each routed to a different ops queue.",
          },
          {
            company: "Airbnb",
            headline: "Warehouse migration parity",
            detail:
              "During pipeline migrations, teams full-outer-join the legacy table to the new one on the business key and alert on any row that appears on only one side.",
          },
          {
            company: "Spotify",
            headline: "Label catalog matching",
            detail:
              "Rights teams match label-delivered track lists against the internal catalog; unmatched rows on either side become ingestion bugs or takedown candidates.",
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
            "FULL OUTER JOIN (FULL JOIN for short — OUTER is optional) combines the behavior of LEFT and RIGHT JOIN in a single operation. Matched rows appear once, joined as usual. A left row with no right match still appears, with every right-table column NULL. A right row with no left match still appears, with every left-table column NULL. The result never loses a row from either input.",
        },
        {
          type: "analogy",
          title: "The two guest lists",
          content:
            "Two colleagues each kept a guest list for the same event. To build the definitive list you lay them side by side: names on both lists line up (matches), names only on list A get an empty cell in the B column, and names only on list B get an empty cell in the A column. Nobody is dropped just because one colleague missed them — that side-by-side master sheet is exactly a FULL OUTER JOIN.",
        },
        {
          type: "keypoint",
          title: "Row-count arithmetic",
          content:
            "With no key duplication: rows(FULL) = matches + left-only + right-only. A 1,204-row table and a 1,187-row table sharing 1,150 keys yield 1,150 + 54 + 37 = 1,241 rows. If either side has duplicate keys, matches multiply exactly as with INNER JOIN — outer joins add orphans on top of, not instead of, normal matching semantics.",
        },
        {
          type: "code-note",
          code: "SELECT b.subscription_id, b.amount, c.crm_id, c.plan\nFROM billing_subs b\nFULL OUTER JOIN crm_subs c\n  ON c.subscription_id = b.subscription_id;",
          content:
            "Same ON syntax as every other join — only the keyword changes. Column choice matters downstream: b.subscription_id is NULL for right-only rows and c.crm_id is NULL for left-only rows, which is precisely the signal you'll filter on.",
        },
        {
          type: "keypoint",
          title: "The NULL pattern is the classification",
          content:
            "After a full outer join on keys, three WHERE filters split the result: both keys non-NULL → matched; right key IS NULL → left-only (exists only in the left table); left key IS NULL → right-only. Reconciliation reports are exactly these filters plus counts. Important: test the JOIN KEY columns for NULL, not arbitrary data columns that might be legitimately NULL in matched rows.",
        },
        {
          type: "code-note",
          code: "SELECT\n  COALESCE(b.subscription_id, c.subscription_id) AS sub_id,\n  CASE\n    WHEN c.subscription_id IS NULL THEN 'billing_only'\n    WHEN b.subscription_id IS NULL THEN 'crm_only'\n    ELSE 'matched'\n  END AS side\nFROM billing_subs b\nFULL OUTER JOIN crm_subs c\n  ON c.subscription_id = b.subscription_id;",
          content:
            "Two staple idioms in one query. COALESCE merges the two half-NULL key columns into one complete key — without it, the unified list has holes on whichever side didn't match. The CASE label turns the NULL pattern into a readable category you can GROUP BY.",
        },
        {
          type: "warning",
          title: "WHERE can quietly demote your outer join",
          content:
            "Exactly as with LEFT JOIN: a plain WHERE condition on one side's column (WHERE c.plan = 'pro') evaluates to unknown for rows where that side is all-NULL and drops them — silently converting your FULL join into a one-sided or inner join. Side-specific conditions belong in the ON clause, or must explicitly allow NULL (WHERE c.plan = 'pro' OR c.subscription_id IS NULL).",
        },
        {
          type: "expandable",
          title: "Dialect support and the classic workaround",
          content:
            "PostgreSQL, SQL Server, Oracle, DuckDB, and SQLite (3.39+) support FULL OUTER JOIN natively. MySQL still does not. The standard emulation is: LEFT JOIN ∪ right-only rows — SELECT … FROM a LEFT JOIN b ON … UNION ALL SELECT … FROM a RIGHT JOIN b ON … WHERE a.key IS NULL. The second branch contributes only right-orphans, so nothing is double-counted. Use UNION ALL (not UNION) — the branches are disjoint by construction, and UNION's deduplication pass costs extra and can even merge legitimate duplicate rows.",
        },
        {
          type: "text",
          content:
            "When should you reach for FULL OUTER JOIN? Almost exclusively when comparing or merging two independently maintained datasets. In everyday analytics — orders to customers, events to users — one side is authoritative and LEFT JOIN expresses that. If you find a FULL join in a routine metric query, it's usually a modeling smell; if you find one in a reconciliation script, it's exactly right.",
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
        title: "Where Every Row Ends Up",
        caption:
          "Two tables enter, three row populations exit. Click each region to see its NULL signature — the pattern you filter on in reconciliation queries.",
        nodes: [
          {
            id: "left",
            label: "billing_subs",
            sublabel: "left table",
            detail:
              "1,204 rows. Every one of them appears in the FULL OUTER JOIN result exactly as many times as it has matches — or once with NULL-filled CRM columns if it has none.",
            x: 12,
            y: 30,
            accent: false,
          },
          {
            id: "right",
            label: "crm_subs",
            sublabel: "right table",
            detail:
              "1,187 rows. Symmetric guarantee: all of them survive, matched or NULL-filled. FULL OUTER JOIN is the only join type that protects both sides.",
            x: 12,
            y: 70,
            accent: false,
          },
          {
            id: "matched",
            label: "Matched",
            sublabel: "keys on both sides",
            detail:
              "1,150 rows where the ON predicate found a partner. NULL signature: both key columns present. These are your 'systems agree' population — though matched keys can still carry disagreeing VALUES (amount differs), which a second comparison pass catches.",
            x: 55,
            y: 22,
            accent: true,
          },
          {
            id: "leftonly",
            label: "Left-only",
            sublabel: "right side NULL",
            detail:
              "54 billing rows with no CRM partner. NULL signature: crm key IS NULL. In a reconciliation these might be subscriptions the CRM sync dropped — each one is a ticket.",
            x: 55,
            y: 50,
            accent: false,
          },
          {
            id: "rightonly",
            label: "Right-only",
            sublabel: "left side NULL",
            detail:
              "37 CRM rows with no billing partner. NULL signature: billing key IS NULL. Perhaps deals marked closed-won that never got a billing record — revenue leakage, the expensive kind of bug.",
            x: 55,
            y: 78,
            accent: false,
          },
          {
            id: "result",
            label: "Result: 1,241 rows",
            sublabel: "1150 + 54 + 37",
            detail:
              "The complete union of perspectives. COALESCE the two key columns for a unified key; CASE-label the NULL patterns; GROUP BY the label for the one-line reconciliation summary.",
            x: 88,
            y: 50,
            accent: true,
          },
        ],
        edges: [
          { from: "left", to: "matched", label: "has partner" },
          { from: "right", to: "matched", label: "has partner" },
          { from: "left", to: "leftonly", label: "no partner" },
          { from: "right", to: "rightonly", label: "no partner" },
          { from: "matched", to: "result" },
          { from: "leftonly", to: "result" },
          { from: "rightonly", to: "result" },
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
          title: "Tiny tables, complete picture",
          scenario:
            "online_customers has keys 1, 2, 3. store_customers has keys 2, 3, 4. Join them fully.",
          steps: [
            {
              code: "SELECT o.customer_id AS online_id,\n       s.customer_id AS store_id\nFROM online_customers o\nFULL OUTER JOIN store_customers s\n  ON s.customer_id = o.customer_id;",
              explanation:
                "Keys 2 and 3 match and pair up. Key 1 exists only online — store_id comes back NULL. Key 4 exists only in-store — online_id comes back NULL. Four rows total: 2 matches + 1 left-only + 1 right-only. Count check: 2+1+1 = 4.",
            },
          ],
          output:
            " online_id | store_id\n-----------+----------\n         1 |\n         2 |        2\n         3 |        3\n           |        4\n(4 rows)",
        },
        {
          difficulty: "Easy",
          title: "Labeling the three populations",
          scenario:
            "Same two tables — but ops wants each row tagged matched / online_only / store_only for a summary chart.",
          steps: [
            {
              code: "SELECT\n  COALESCE(o.customer_id, s.customer_id) AS customer_id,",
              explanation:
                "COALESCE returns its first non-NULL argument, welding the two half-empty key columns into one complete customer_id column — 1, 2, 3, 4 with no gaps.",
            },
            {
              code: "  CASE\n    WHEN s.customer_id IS NULL THEN 'online_only'\n    WHEN o.customer_id IS NULL THEN 'store_only'\n    ELSE 'matched'\n  END AS presence\nFROM online_customers o\nFULL OUTER JOIN store_customers s\n  ON s.customer_id = o.customer_id\nORDER BY customer_id;",
              explanation:
                "The CASE reads the NULL signature: missing store key means the row came only from the online side, and vice versa. GROUP BY presence on top of this gives the 3-line executive summary of any reconciliation.",
            },
          ],
          output:
            " customer_id | presence\n-------------+-------------\n           1 | online_only\n           2 | matched\n           3 | matched\n           4 | store_only\n(4 rows)",
        },
        {
          difficulty: "Medium",
          title: "Discrepancies only",
          scenario:
            "The billing-vs-CRM reconciliation: 1,150 keys match; ops only wants the 91 rows that DON'T — both directions in one list.",
          steps: [
            {
              code: "SELECT\n  COALESCE(b.subscription_id, c.subscription_id) AS sub_id,\n  b.amount      AS billing_amount,\n  c.plan        AS crm_plan\nFROM billing_subs b\nFULL OUTER JOIN crm_subs c\n  ON c.subscription_id = b.subscription_id",
              explanation:
                "Standard full-outer scaffold with the unified key. So far this returns all 1,241 rows — matches included.",
            },
            {
              code: "WHERE b.subscription_id IS NULL\n   OR c.subscription_id IS NULL;",
              explanation:
                "Filtering to rows where either key is missing keeps exactly the orphans and drops the 1,150 matches — this WHERE-on-NULL is the one outer-join filter that WIDENS your insight instead of silently narrowing it. The filter tests join keys, not data columns: crm_plan could legitimately be NULL on a matched row.",
            },
          ],
          output:
            " sub_id  | billing_amount | crm_plan\n---------+----------------+----------\n S-10412 |          29.00 |\n S-10981 |           9.00 |\n S-20077 |                | pro\n S-20101 |                | base\n(4 rows)",
        },
        {
          difficulty: "Hard",
          title: "Emulating FULL OUTER JOIN in MySQL",
          scenario:
            "The same reconciliation must run on a MySQL 8 replica, which has no FULL OUTER JOIN. Build it from one LEFT JOIN plus the right side's orphans.",
          steps: [
            {
              code: "SELECT b.subscription_id AS b_id, c.subscription_id AS c_id\nFROM billing_subs b\nLEFT JOIN crm_subs c\n  ON c.subscription_id = b.subscription_id",
              explanation:
                "Branch 1 delivers all matches plus every billing-only row — everything except the CRM orphans. That's 1,150 + 54 = 1,204 rows.",
            },
            {
              code: "UNION ALL\nSELECT b.subscription_id, c.subscription_id\nFROM billing_subs b\nRIGHT JOIN crm_subs c\n  ON c.subscription_id = b.subscription_id\nWHERE b.subscription_id IS NULL;",
              explanation:
                "Branch 2 is a RIGHT JOIN filtered to rows where the left key IS NULL — precisely the 37 CRM orphans and nothing else, so no row is counted twice. UNION ALL glues the branches without a dedup pass; total 1,241, identical to native FULL OUTER JOIN. (In MySQL before 8.0 you'd also rewrite the RIGHT JOIN as a swapped LEFT JOIN.)",
            },
          ],
          output: " b_id    | c_id\n---------+---------\n …1,241 rows —\n identical to the\n native FULL JOIN\n(1241 rows)",
        },
        {
          difficulty: "Industry Example",
          title: "Migration parity check with value comparison",
          scenario:
            "A data team is migrating daily_revenue from a legacy pipeline to a new one. Sign-off requires: every date present in both tables AND totals within $0.01. The parity report must show missing dates on either side and value mismatches.",
          steps: [
            {
              code: "SELECT\n  COALESCE(l.revenue_date, n.revenue_date) AS revenue_date,\n  l.total AS legacy_total,\n  n.total AS new_total,",
              explanation:
                "Full-outer scaffold on the business key (the date). Both totals ride along for the value comparison — matched keys can still disagree on values, and only showing key mismatches would miss half the bugs.",
            },
            {
              code: "  CASE\n    WHEN n.revenue_date IS NULL THEN 'missing_in_new'\n    WHEN l.revenue_date IS NULL THEN 'missing_in_legacy'\n    WHEN ABS(l.total - n.total) > 0.01 THEN 'value_mismatch'\n    ELSE 'ok'\n  END AS status\nFROM legacy_daily_revenue l\nFULL OUTER JOIN new_daily_revenue n\n  ON n.revenue_date = l.revenue_date",
              explanation:
                "Four-way classification: two key-level failures from the NULL signature, one value-level failure from the tolerance comparison (ABS handles either direction of drift), and 'ok'. The order of WHEN branches matters — NULL checks must come first, or the ABS comparison on a NULL total would make the status unknown.",
            },
            {
              code: "WHERE (n.revenue_date IS NULL\n   OR l.revenue_date IS NULL\n   OR ABS(l.total - n.total) > 0.01)\nORDER BY revenue_date;",
              explanation:
                "The report ships only exceptions; a clean migration returns zero rows — the most satisfying query result in data engineering. This exact pattern, scheduled daily during the cutover window, is how teams earn the confidence to switch off a legacy pipeline.",
            },
          ],
          output:
            " revenue_date | legacy_total | new_total | status\n--------------+--------------+-----------+-------------------\n 2026-06-03   |     18240.50 |           | missing_in_new\n 2026-06-11   |     22101.00 |  22099.75 | value_mismatch\n 2026-06-14   |              |  19875.25 | missing_in_legacy\n(3 rows)",
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
          "Reconcile two product lists. warehouse_products(sku, stock) and catalog_products(sku, price) each miss some SKUs. Produce one row per SKU from EITHER list with: a unified sku column, stock, price, and a status column reading 'ok' when both sides have the SKU, 'not_in_catalog' when only the warehouse has it, and 'not_in_warehouse' when only the catalog has it. Sort by sku. Fill in the blanks.",
        starterCode:
          "-- warehouse_products(sku, stock): ('A1', 10), ('B2', 0), ('C3', 5)\n-- catalog_products(sku, price):  ('A1', 19.99), ('C3', 4.50), ('D4', 99.00)\n\nSELECT\n  ___(w.sku, c.sku) AS sku,\n  w.stock,\n  c.price,\n  CASE\n    WHEN c.sku ___ THEN 'not_in_catalog'\n    WHEN w.sku ___ THEN 'not_in_warehouse'\n    ELSE 'ok'\n  END AS status\nFROM warehouse_products w\n___ catalog_products c\n  ON c.sku = w.sku\nORDER BY sku;",
        solutionCode:
          "-- warehouse_products(sku, stock): ('A1', 10), ('B2', 0), ('C3', 5)\n-- catalog_products(sku, price):  ('A1', 19.99), ('C3', 4.50), ('D4', 99.00)\n\nSELECT\n  COALESCE(w.sku, c.sku) AS sku,\n  w.stock,\n  c.price,\n  CASE\n    WHEN c.sku IS NULL THEN 'not_in_catalog'\n    WHEN w.sku IS NULL THEN 'not_in_warehouse'\n    ELSE 'ok'\n  END AS status\nFROM warehouse_products w\nFULL OUTER JOIN catalog_products c\n  ON c.sku = w.sku\nORDER BY sku;",
        expectedOutput:
          " sku | stock | price | status\n-----+-------+-------+------------------\n A1  |    10 | 19.99 | ok\n B2  |     0 |       | not_in_catalog\n C3  |     5 |  4.50 | ok\n D4  |       | 99.00 | not_in_warehouse\n(4 rows)",
        hints: [
          "Four blanks: a function that merges the two key columns, two NULL tests, and the join keyword that keeps both sides' orphans.",
          "The key-merging function is COALESCE — it returns the first non-NULL of its arguments.",
          "A missing side is detected with IS NULL on that side's JOIN KEY (c.sku / w.sku), never on a data column.",
          "The join is FULL OUTER JOIN. Expected populations: A1 and C3 matched, B2 warehouse-only, D4 catalog-only.",
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
          id: "sql09_mcq_01",
          difficulty: "Easy",
          question:
            "Table A has keys {1,2,3}; table B has keys {3,4}. With unique keys, how many rows does A FULL OUTER JOIN B return?",
          options: ["2", "3", "4", "5"],
          correctIndex: 2,
          explanation:
            "Apply the row-count arithmetic: matches (key 3) = 1, left-only (keys 1 and 2) = 2, right-only (key 4) = 1 — so 1 + 2 + 1 = 4 rows. Choosing 5 double-counts the matched key (it appears once as a joined pair, not once per table). Choosing 3 keeps only the left table's rows (LEFT JOIN thinking), and 2 counts unmatched keys only, forgetting the match and one orphan.",
        },
        {
          type: "mcq",
          id: "sql09_mcq_02",
          difficulty: "Easy",
          question:
            "After t1 FULL OUTER JOIN t2 ON t2.id = t1.id, a result row has t1.id = NULL and t2.id = 42. What does it represent?",
          options: [
            "A matched row whose value happens to be NULL",
            "A t2 row with no matching t1 row",
            "A t1 row with no matching t2 row",
            "A row dropped by the join",
          ],
          correctIndex: 1,
          explanation:
            "The left key is NULL-filled, so nothing on the left matched — this row exists only in t2 (right-only). A t1-only row would show the opposite signature (t1.id = 42, t2.id = NULL). Matched rows have both keys present. And FULL OUTER JOIN drops nothing — every input row appears somewhere in the result.",
        },
        {
          type: "mcq",
          id: "sql09_mcq_03",
          difficulty: "Medium",
          question:
            "Which WHERE clause keeps ONLY the discrepancies (both directions) from a full outer join of a and b on key?",
          options: [
            "WHERE a.key IS NULL AND b.key IS NULL",
            "WHERE a.key IS NULL OR b.key IS NULL",
            "WHERE a.key = b.key",
            "WHERE a.key <> b.key",
          ],
          correctIndex: 1,
          explanation:
            "An orphan has exactly one side NULL, so OR catches both directions. AND requires both keys NULL, which no row has (a row with neither side would not exist). a.key = b.key keeps the MATCHES — the opposite of what's asked. a.key <> b.key evaluates to unknown whenever either side is NULL, so it keeps nothing at all — the three-valued-logic trap again.",
        },
        {
          type: "mcq",
          id: "sql09_mcq_04",
          difficulty: "Medium",
          question:
            "Why does the MySQL emulation use UNION ALL rather than UNION between the LEFT JOIN branch and the filtered RIGHT JOIN branch?",
          options: [
            "UNION is not supported alongside JOIN clauses",
            "The branches are disjoint by construction, so UNION's dedup pass adds cost and can even merge legitimately duplicate rows",
            "UNION ALL sorts the result automatically",
            "UNION would return only matched rows",
          ],
          correctIndex: 1,
          explanation:
            "Branch 1 contributes matches + left-orphans; branch 2 is filtered to left-key-IS-NULL, i.e. right-orphans only — no row can appear in both, so deduplication is pure waste, and worse, UNION would also collapse genuine duplicates WITHIN a branch (two identical billing rows), corrupting counts. UNION composes fine with joins. Neither variant sorts. And UNION doesn't filter to matches — it just dedups.",
        },
        {
          type: "scenario",
          id: "sql09_sc_01",
          difficulty: "Hard",
          scenario:
            "An analyst reconciles payments (2,000 rows) against invoices (1,900 rows) with a FULL OUTER JOIN on invoice_id and gets 2,450 rows — far more than the expected ~2,100. Matched-key spot checks look correct.",
          question: "What is the most likely explanation?",
          options: [
            "FULL OUTER JOIN duplicates every unmatched row on both sides",
            "One table has duplicate invoice_id values, so matched keys multiply (one-to-many fan-out) on top of the orphan counts",
            "NULL invoice_ids matched each other, inflating the result",
            "The database silently fell back to a CROSS JOIN",
          ],
          correctIndex: 1,
          explanation:
            "Outer joins keep INNER JOIN's matching semantics and add orphans — so duplicate keys fan out exactly as in an inner join: an invoice_id appearing 3× in payments and 1× in invoices yields 3 matched rows. 2,450 vs ~2,100 means ~350 extra matched pairs from duplicates; COUNT(*) vs COUNT(DISTINCT invoice_id) per table confirms it. Orphans are never duplicated by the join itself. NULL keys do NOT match each other (NULL = NULL is unknown) — they become orphans on their own side. A CROSS JOIN of these tables would return ~3.8 million rows, not 2,450.",
        },
        {
          type: "coding",
          id: "sql09_code_01",
          difficulty: "Hard",
          prompt:
            "forecast(month, predicted) and actuals(month, revenue) each cover a partly different set of months. Write ONE query returning a summary: for each of the statuses 'matched', 'forecast_only', 'actuals_only', the count of months (columns: status, months). Use a FULL OUTER JOIN and GROUP BY. Order by status.",
          starterCode:
            "-- forecast(month, predicted): ('2026-01', 100), ('2026-02', 120), ('2026-03', 130)\n-- actuals(month, revenue):    ('2026-02', 118), ('2026-03', 141), ('2026-04', 95)\n\n",
          solutionCode:
            "SELECT\n  CASE\n    WHEN a.month IS NULL THEN 'forecast_only'\n    WHEN f.month IS NULL THEN 'actuals_only'\n    ELSE 'matched'\n  END AS status,\n  COUNT(*) AS months\nFROM forecast f\nFULL OUTER JOIN actuals a\n  ON a.month = f.month\nGROUP BY 1\nORDER BY status;",
          expectedOutput:
            " status        | months\n---------------+--------\n actuals_only  |      1\n forecast_only |      1\n matched       |      2\n(3 rows)",
          tests: [
            {
              name: "Full outer join used",
              description: "Both 2026-01 (forecast-only) and 2026-04 (actuals-only) are represented",
            },
            {
              name: "NULL signature classification",
              description: "Status derives from IS NULL tests on the join keys, matched = 2 (Feb, Mar)",
            },
            {
              name: "Aggregated output",
              description: "Exactly three rows: one count per status, ordered by status",
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
            "When would you choose FULL OUTER JOIN over LEFT JOIN, and why is it comparatively rare in production analytics code?",
          answer:
            "FULL OUTER JOIN is the right tool when neither dataset is authoritative and you need both directions of mismatch visible at once — reconciling billing against CRM, legacy pipeline against replacement, forecast against actuals. LEFT JOIN answers 'enrich this primary table'; FULL answers 'compare these two peers'. It's rare in routine analytics because most business questions do have an authoritative side: orders enriched with customer data doesn't care about customers with no orders in a revenue query, and if it does, LEFT from the customer side expresses it. So in practice FULL joins cluster in data-quality checks, migrations, and finance reconciliation scripts. I'd add that seeing a FULL OUTER JOIN in a KPI query is a review flag — it often means the author wasn't sure which side was the spine of the analysis.",
        },
        {
          question:
            "Walk me through building a reconciliation report between two systems' subscription tables. What does each part of the query do?",
          answer:
            "I full-outer-join the two tables on the business key — say subscription_id — so no row from either side can hide. From the NULL signature of the key columns I derive a status with CASE: right key NULL means left-only, left key NULL means right-only, both present means matched; the NULL checks must precede any value comparison in the CASE, since comparing against a NULL side yields unknown. I COALESCE the two key columns into one unified key for readable output. For matched rows I add a value-level comparison — e.g. ABS(a.amount − b.amount) > 0.01 — because keys agreeing doesn't mean values do. The detailed report filters to non-'ok' rows; the executive summary is GROUP BY status with counts. Run daily during a migration, the target state is a zero-row exception report, which is what gives the team license to decommission the old system.",
        },
        {
          question:
            "Do NULL join keys match each other in a FULL OUTER JOIN? What are the practical consequences?",
          answer:
            "No. The ON predicate uses ordinary comparison semantics, and NULL = NULL evaluates to unknown, so two rows with NULL keys never pair — each becomes an orphan on its own side of the result. The practical consequence in reconciliations is that rows with missing business keys inflate BOTH orphan lists and can never be matched by the join at all; they need a separate handling lane, typically a pre-filter (WHERE key IS NOT NULL) plus their own 'unkeyed' count in the report so they aren't silently ignored. If the business genuinely wants NULLs to match — rare, but it happens with optional dimensions — you have to say so explicitly: ON a.key = b.key OR (a.key IS NULL AND b.key IS NULL), or in PostgreSQL the cleaner a.key IS NOT DISTINCT FROM b.key, accepting that these forms usually defeat index usage.",
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
        "1) Classifying rows by testing a data column for NULL instead of the join key — matched rows can carry legitimately NULL data, mislabeling them as orphans. 2) Putting a one-sided condition in WHERE (WHERE c.plan = 'pro'), which drops that side's NULL-filled orphans and demotes the join; side conditions go in ON. 3) Forgetting COALESCE on the key, shipping a report whose key column has holes on every unmatched row. 4) Expecting NULL keys to match each other — they orphan on both sides instead; handle unkeyed rows in a separate lane. 5) Using UNION instead of UNION ALL in the MySQL emulation, paying a dedup pass that can also merge genuine duplicate rows and corrupt counts.",
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
        "Try these prompts in the AI Tutor panel: • 'ELI5: FULL OUTER JOIN with a two-guest-lists analogy of your own.' • 'Quiz me: two small key sets, I predict matched / left-only / right-only counts.' • 'Show me a reconciliation query on payments vs invoices and explain each NULL test.' • 'Why doesn't NULL = NULL match in a join, and what is IS NOT DISTINCT FROM?' • 'Interview mode: have me design a migration parity check and critique my CASE ordering.'",
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
        "FULL OUTER JOIN (FULL JOIN) — join keeping matched rows plus unmatched rows from BOTH tables, NULL-filling the missing side. Orphan — a row with no partner in the other table. Left-only / right-only — orphan populations, identified by which side's key is NULL. NULL signature — the pattern of NULL-filled key columns that classifies each result row. Reconciliation — systematically comparing two datasets and accounting for every difference. Parity check — a reconciliation asserting two pipelines produce identical output. COALESCE — first non-NULL argument; merges half-filled key columns into one. Anti-join filter — WHERE side.key IS NULL, isolating orphans. UNION ALL — concatenates result sets without deduplication. IS NOT DISTINCT FROM — PostgreSQL's NULL-safe equality, under which NULL equals NULL. Fan-out — match multiplication caused by duplicate join keys, present in outer joins too.",
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
        "• Docs: PostgreSQL manual — 'Joined Tables' for the formal definition of all outer join types. • Read: the 'JOIN' visual reference at Mode's SQL tutorial to cement the three-population picture. • Practice: take any two overlapping lists you have (even two CSV exports), load them, and write the full reconciliation — unified key, status CASE, summary GROUP BY. • Next in DSM: all joins so far connected two different tables — Self Joins shows what happens when a table needs to meet itself: hierarchies, sequences, and pair analysis.",
    },

    /* ---------------------------------------------------------------- */
    /*  12 — Recap                                                       */
    /* ---------------------------------------------------------------- */
    {
      id: "recap",
      type: "recap",
      tocLabel: "Recap",
      content:
        "✓ FULL OUTER JOIN keeps matches plus orphans from both sides — no input row is ever discarded.\n✓ Row count = matches + left-only + right-only; duplicate keys still fan out matches exactly as in INNER JOIN.\n✓ The NULL signature of the join keys classifies every row; COALESCE the keys for a unified column and CASE-label the populations.\n✓ Filter WHERE either key IS NULL for a both-directions discrepancy report; test join keys, never data columns.\n✓ NULL keys never match each other — they orphan on both sides and need their own handling lane.\n✓ Where FULL OUTER JOIN is unsupported (MySQL), emulate with LEFT JOIN ∪ (RIGHT JOIN … WHERE left key IS NULL) via UNION ALL.\n\nNext up: Self Joins. Every join so far paired two different tables — next you'll alias one table twice and join it to itself, the trick behind org charts, event sequences, and same-customer comparisons.",
    },
  ],
};
