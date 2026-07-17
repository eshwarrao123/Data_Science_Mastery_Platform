import type { Lesson } from "@/lib/curriculum/types";

export const subqueries: Lesson = {
  meta: {
    id: "sql.advanced.subqueries",
    slug: "subqueries",
    title: "Subqueries",
    description:
      "Nest one query inside another to answer questions that a single SELECT cannot — scalar, IN-list, and correlated subqueries.",
    estimatedTime: "35 mins",
    difficulty: "Intermediate",
    xpReward: 80,
    prerequisites: ["sql.joins.inner-join"],
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
        hook: "Try answering this with a single SELECT: 'Which orders are larger than the average order?' You need the average first, and then you need to compare every row against it — two questions, one answer. A subquery lets you nest the first question inside the second, so the database answers both in one statement. By the end of this lesson you'll read and write nested queries the way analysts do every day.",
        what: "A subquery (also called an inner query or nested query) is a complete SELECT statement placed inside another SQL statement. The inner query runs first and its result feeds the outer query — as a single value, a list of values, or a whole table.",
        why: "Many real questions are two-step questions: 'above average', 'in the top segment', 'customers who have ever done X'. Without subqueries you would run one query, copy its result by hand, and paste it into a second query — fragile, slow, and impossible to automate.",
        whereUsed:
          "Subqueries appear in every analytics codebase, every BI tool's generated SQL, and virtually every SQL interview. They are also the conceptual foundation for CTEs, which you'll meet in the next lesson.",
        objectives: [
          "Write a scalar subquery that returns a single value for comparison",
          "Filter rows with IN and NOT IN subqueries returning a list of values",
          "Explain the difference between a correlated and a non-correlated subquery",
          "Use EXISTS to test for the presence of related rows",
          "Decide when a subquery is clearer than a join — and when it isn't",
        ],
        realWorldApps: [
          {
            company: "Amazon",
            headline: "Above-average order detection",
            detail:
              "Marketplace analysts flag orders whose value exceeds the category average — a scalar subquery computes the average while the outer query compares every order against it.",
          },
          {
            company: "Netflix",
            headline: "Churn-risk audience building",
            detail:
              "Retention teams select subscribers who have NOT appeared in the viewing-events table in the last 30 days — a classic NOT IN / NOT EXISTS subquery over billions of rows.",
          },
          {
            company: "Shopify",
            headline: "Merchant benchmarking",
            detail:
              "Merchant dashboards show 'your store vs stores like yours'. Correlated subqueries compute each merchant's peer-group average revenue on the fly.",
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
            "A subquery is a SELECT wrapped in parentheses and embedded inside another statement. The database evaluates the inner query and substitutes its result into the outer query. Where you place it — and what shape of result it returns — determines what kind of subquery it is.",
        },
        {
          type: "analogy",
          title: "The two-step errand",
          content:
            "Imagine asking a colleague: 'Find every order bigger than our average order.' They can't start until they know the average — so first they compute it (inner errand), write the number on a sticky note, and then walk through the orders comparing each one against the note (outer errand). A subquery is exactly that sticky note: the inner query's answer, held in place for the outer query to use.",
        },
        {
          type: "keypoint",
          title: "The three shapes of subquery results",
          content:
            "Scalar — returns exactly one value (one row, one column), usable anywhere a literal could go: WHERE amount > (SELECT AVG(amount) …). List — returns one column with many rows, used with IN / NOT IN. Table — returns rows and columns, used in the FROM clause as a derived table with an alias.",
        },
        {
          type: "text",
          content:
            "A non-correlated subquery runs once, independently of the outer query — you could copy it into its own editor tab and it would run fine. A correlated subquery references a column from the outer query, so it conceptually re-runs for every outer row. Correlation is what lets a subquery answer per-row questions like 'the average for THIS customer's country'.",
        },
        {
          type: "code-note",
          code: "-- Non-correlated: inner query runs once\nSELECT order_id, amount\nFROM orders\nWHERE amount > (SELECT AVG(amount) FROM orders);\n\n-- Correlated: inner query references the outer row (o.customer_id)\nSELECT o.order_id, o.amount\nFROM orders o\nWHERE o.amount > (\n  SELECT AVG(amount)\n  FROM orders\n  WHERE customer_id = o.customer_id\n);",
          content:
            "The first query compares every order to one global average. The second compares each order to that customer's own average — the inner WHERE clause reaches out to the outer alias o. That reach is the correlation.",
        },
        {
          type: "expandable",
          title: "EXISTS vs IN — which one should you reach for?",
          content:
            "EXISTS checks whether the subquery returns at least one row and stops as soon as it finds one, which can be faster on large tables. IN materializes the full list first. More importantly, NOT IN behaves badly with NULLs: if the subquery returns even one NULL, NOT IN returns no rows at all, because 'x <> NULL' is unknown for every x. NOT EXISTS does not have this trap. A safe habit: prefer EXISTS / NOT EXISTS whenever the subquery column can contain NULLs.",
        },
        {
          type: "warning",
          title: "A scalar subquery must return exactly one row",
          content:
            "If a subquery used in a scalar position (after =, >, <) returns more than one row, PostgreSQL raises 'more than one row returned by a subquery used as an expression'. Guard with an aggregate (AVG, MAX), a LIMIT 1, or switch to IN if you genuinely expect a list.",
        },
        {
          type: "expandable",
          title: "Subquery or join — how do professionals decide?",
          content:
            "Any IN subquery can be rewritten as a join, and modern optimizers often produce identical plans for both. Choose based on readability and shape of the answer. Use a join when you need columns from both tables in the output. Use a subquery when the second table is only a filter — 'customers who bought something' needs no order columns in the result, so an EXISTS reads closer to the business question and avoids accidental row duplication from one-to-many matches.",
        },
        {
          type: "text",
          content:
            "Subqueries can also live in the FROM clause as a derived table: SELECT … FROM (SELECT …) AS sub. This lets you aggregate an aggregation — for example, average the per-customer totals. Derived tables must have an alias in PostgreSQL. When these nest more than one level deep they become hard to read, which is exactly the problem CTEs solve in the next lesson.",
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
        title: "How a Subquery Executes",
        caption:
          "Follow the data: the inner query produces a result, and that result plugs into the outer query. Click each node for detail.",
        nodes: [
          {
            id: "inner",
            label: "Inner query",
            sublabel: "(SELECT AVG(amount) FROM orders)",
            detail:
              "A complete, self-contained SELECT in parentheses. For non-correlated subqueries this runs once; for correlated subqueries it conceptually re-runs per outer row.",
            x: 15,
            y: 25,
            accent: true,
          },
          {
            id: "result",
            label: "Intermediate result",
            sublabel: "scalar / list / table",
            detail:
              "The shape matters: one value (scalar) works after comparison operators; one column of values works with IN; a full table works in FROM with an alias.",
            x: 50,
            y: 25,
            accent: false,
          },
          {
            id: "outer",
            label: "Outer query",
            sublabel: "SELECT … WHERE amount > (…)",
            detail:
              "The outer query treats the subquery result like a literal value, a list, or a table. It cannot see the inner query's intermediate rows — only its final result.",
            x: 82,
            y: 25,
            accent: false,
          },
          {
            id: "corr",
            label: "Correlated variant",
            sublabel: "references outer alias",
            detail:
              "When the inner query mentions an outer column (WHERE customer_id = o.customer_id), it becomes correlated: per-row logic. Powerful, but can be slow on large tables without indexes.",
            x: 32,
            y: 68,
            accent: false,
          },
          {
            id: "exists",
            label: "EXISTS check",
            sublabel: "row present? true/false",
            detail:
              "EXISTS asks only 'is there at least one matching row?' and short-circuits on the first hit. NOT EXISTS is the NULL-safe way to express 'has never done X'.",
            x: 68,
            y: 68,
            accent: false,
          },
        ],
        edges: [
          { from: "inner", to: "result", label: "evaluates to" },
          { from: "result", to: "outer", label: "plugs into" },
          { from: "corr", to: "inner", label: "re-runs per outer row" },
          { from: "corr", to: "exists", label: "commonly paired" },
          { from: "exists", to: "outer", label: "filters rows" },
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
          title: "Scalar subquery: orders above the average",
          scenario:
            "An e-commerce analyst wants every order whose amount beats the store-wide average.",
          steps: [
            {
              code: "SELECT AVG(amount) FROM orders;\n-- returns 84.50",
              explanation:
                "Run the inner question on its own first — always a good habit. AVG(amount) collapses the whole table to a single number: 84.50. One row, one column: a scalar.",
            },
            {
              code: "SELECT order_id, amount\nFROM orders\nWHERE amount > (SELECT AVG(amount) FROM orders);",
              explanation:
                "Now nest it. The database computes the inner AVG once, then filters the outer rows with WHERE amount > 84.50. You never had to hard-code the number, so the query stays correct as new orders arrive.",
            },
          ],
          output:
            " order_id | amount\n----------+--------\n     1004 | 129.99\n     1007 | 250.00\n     1011 |  92.75",
        },
        {
          difficulty: "Easy",
          title: "IN subquery: customers who ordered this month",
          scenario:
            "Marketing wants the names and emails of every customer who placed at least one order in June 2026.",
          steps: [
            {
              code: "SELECT DISTINCT customer_id\nFROM orders\nWHERE order_date >= DATE '2026-06-01'\n  AND order_date <  DATE '2026-07-01';",
              explanation:
                "The inner query builds the list of qualifying customer IDs. DISTINCT is optional inside IN — duplicates don't change membership — but it makes the standalone test easier to read.",
            },
            {
              code: "SELECT name, email\nFROM customers\nWHERE customer_id IN (\n  SELECT customer_id\n  FROM orders\n  WHERE order_date >= DATE '2026-06-01'\n    AND order_date <  DATE '2026-07-01'\n);",
              explanation:
                "IN keeps a customers row when its customer_id appears anywhere in the inner list. Unlike a join, the result can never duplicate a customer who ordered five times — membership is yes/no.",
            },
          ],
          output:
            "  name   |        email\n---------+----------------------\n Priya   | priya@example.com\n Marcus  | marcus@example.com\n Sofia   | sofia@example.com",
        },
        {
          difficulty: "Medium",
          title: "NOT EXISTS: subscribers who never opened a session",
          scenario:
            "A subscription product wants dormant users — subscribers with zero rows in user_sessions — for a win-back email.",
          steps: [
            {
              code: "SELECT s.user_id, s.plan\nFROM subscriptions s\nWHERE NOT EXISTS (\n  SELECT 1\n  FROM user_sessions us\n  WHERE us.user_id = s.user_id\n);",
              explanation:
                "NOT EXISTS keeps a subscription row only when the inner query finds no matching session. The inner SELECT 1 is idiomatic — EXISTS only cares whether a row comes back, not what's in it. Note the correlation: us.user_id = s.user_id ties inner to outer.",
            },
            {
              code: "-- Why not NOT IN?\n-- SELECT user_id FROM subscriptions\n-- WHERE user_id NOT IN (SELECT user_id FROM user_sessions);",
              explanation:
                "This looks equivalent, but if user_sessions.user_id contains a single NULL, NOT IN returns zero rows: every comparison against NULL is unknown, so no row can prove it is 'not in' the list. NOT EXISTS has no such trap, which is why production code prefers it.",
            },
          ],
          output:
            " user_id |  plan\n---------+--------\n     205 | pro\n     319 | basic",
        },
        {
          difficulty: "Hard",
          title: "Correlated subquery: each customer's biggest order",
          scenario:
            "Support wants a list of orders that are each customer's personal maximum — their single largest purchase.",
          steps: [
            {
              code: "SELECT o.customer_id, o.order_id, o.amount\nFROM orders o\nWHERE o.amount = (\n  SELECT MAX(amount)\n  FROM orders\n  WHERE customer_id = o.customer_id\n);",
              explanation:
                "The inner query computes MAX(amount) for one specific customer — the customer of the current outer row, via the correlation customer_id = o.customer_id. The outer query keeps rows that equal their own per-customer maximum.",
            },
            {
              code: "-- Conceptual execution for outer row (customer 12, order 88, 45.00):\n--   inner runs: SELECT MAX(amount) FROM orders WHERE customer_id = 12  → 129.99\n--   45.00 = 129.99? No → row dropped",
              explanation:
                "Mentally trace one row and the pattern clicks: correlated subqueries are per-row lookups. Optimizers often rewrite them efficiently, but on unindexed columns they can degrade to slow nested loops — window functions (two lessons ahead) handle this pattern with a single pass.",
            },
          ],
          output:
            " customer_id | order_id | amount\n-------------+----------+--------\n          12 |     1004 | 129.99\n          15 |     1007 | 250.00\n          21 |     1011 |  92.75",
        },
        {
          difficulty: "Industry Example",
          title: "Derived table: average of per-customer totals",
          scenario:
            "A finance analyst at an e-commerce company needs 'average lifetime spend per customer' — which is NOT the same as AVG(amount) over orders. You must total per customer first, then average the totals.",
          steps: [
            {
              code: "SELECT customer_id, SUM(amount) AS lifetime_spend\nFROM orders\nGROUP BY customer_id;",
              explanation:
                "Step one aggregates orders up to one row per customer. Averaging amount directly would weight heavy purchasers by their order count — a subtle and very common analytical bug.",
            },
            {
              code: "SELECT ROUND(AVG(lifetime_spend), 2) AS avg_customer_value\nFROM (\n  SELECT customer_id, SUM(amount) AS lifetime_spend\n  FROM orders\n  GROUP BY customer_id\n) AS per_customer;",
              explanation:
                "The inner query becomes a derived table in FROM — a temporary, unnamed table that exists only for this statement. PostgreSQL requires the alias (AS per_customer). The outer AVG now averages one number per customer, which is the metric finance actually asked for.",
            },
            {
              code: "-- Same idea, next lesson's syntax:\n-- WITH per_customer AS (…)\n-- SELECT AVG(lifetime_spend) FROM per_customer;",
              explanation:
                "When derived tables nest two or three deep, readability collapses. CTEs give each step a name and flatten the nesting — that's the whole next lesson.",
            },
          ],
          output:
            " avg_customer_value\n--------------------\n             212.40",
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
          "The products table has product_id, name, category, and price. Find every product priced above the average price of its own category. Fill in the blanks: the outer query needs a correlated comparison, and the inner query must scope its average to the outer row's category.",
        starterCode:
          "SELECT p.name, p.category, p.price\nFROM products p\nWHERE p.price > (\n  SELECT ___(price)\n  FROM products\n  WHERE category = ___.category\n)\nORDER BY p.category, p.price DESC;",
        solutionCode:
          "SELECT p.name, p.category, p.price\nFROM products p\nWHERE p.price > (\n  SELECT AVG(price)\n  FROM products\n  WHERE category = p.category\n)\nORDER BY p.category, p.price DESC;",
        expectedOutput:
          "      name       | category  | price\n-----------------+-----------+--------\n Espresso Machine| kitchen   | 249.00\n Chef Knife      | kitchen   |  89.00\n 4K Monitor      | tech      | 399.00\n Mechanical KB   | tech      | 149.00",
        hints: [
          "You need the average price, so the inner aggregate function is AVG.",
          "The inner query must compute the average for one category only — the category of the row the outer query is currently looking at.",
          "The outer table has the alias p, so the correlation is WHERE category = p.category.",
          "Full inner query: SELECT AVG(price) FROM products WHERE category = p.category — the reference to p makes it correlated.",
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
          id: "sql12_mcq_01",
          difficulty: "Easy",
          question:
            "A subquery used after a comparison operator like `>` must return what shape of result?",
          options: [
            "Exactly one row and one column (a scalar)",
            "One column with any number of rows",
            "A full table with an alias",
            "At least two columns",
          ],
          correctIndex: 0,
          explanation:
            "Comparison operators compare single values, so the subquery must be scalar — one row, one column. If it returns multiple rows, PostgreSQL raises an error. Multi-row single-column results belong with IN; multi-column results belong in FROM as derived tables.",
        },
        {
          type: "mcq",
          id: "sql12_mcq_02",
          difficulty: "Easy",
          question: "What makes a subquery 'correlated'?",
          options: [
            "It appears in the FROM clause",
            "It references a column from the outer query",
            "It returns more than one row",
            "It uses an aggregate function",
          ],
          correctIndex: 1,
          explanation:
            "Correlation means the inner query mentions an outer-query column (e.g. WHERE customer_id = o.customer_id), so it conceptually re-executes for each outer row. Location, row count, and aggregates are all independent of correlation.",
        },
        {
          type: "mcq",
          id: "sql12_mcq_03",
          difficulty: "Medium",
          question:
            "The subquery in `WHERE id NOT IN (SELECT user_id FROM events)` returns the values (1, 2, NULL). How many outer rows survive the filter?",
          options: [
            "All rows except those with id 1 or 2",
            "Zero rows",
            "All rows — NULL is ignored",
            "It raises an error",
          ],
          correctIndex: 1,
          explanation:
            "NOT IN expands to id <> 1 AND id <> 2 AND id <> NULL. Any comparison with NULL is unknown, and a WHERE clause only keeps rows that evaluate to true — so every row fails. This is the classic NOT IN + NULL trap; NOT EXISTS avoids it entirely.",
        },
        {
          type: "scenario",
          id: "sql12_sc_01",
          difficulty: "Medium",
          scenario:
            "A retention analyst at a streaming service needs subscribers who have NEVER appeared in the viewing_events table. The viewing_events.user_id column is known to contain some NULLs from an old tracking bug.",
          question: "Which pattern is the safe, idiomatic choice?",
          options: [
            "WHERE user_id NOT IN (SELECT user_id FROM viewing_events)",
            "WHERE NOT EXISTS (SELECT 1 FROM viewing_events v WHERE v.user_id = s.user_id)",
            "An INNER JOIN between subscribers and viewing_events",
            "WHERE user_id <> ALL (SELECT user_id FROM viewing_events)",
          ],
          correctIndex: 1,
          explanation:
            "NOT EXISTS tests row presence per subscriber and is immune to NULLs in the inner column. NOT IN (and its equivalent <> ALL) returns zero rows the moment the list contains a NULL. An INNER JOIN does the opposite job — it finds subscribers who HAVE events.",
        },
        {
          type: "coding",
          id: "sql12_code_01",
          difficulty: "Medium",
          prompt:
            "The orders table has order_id, customer_id, and amount. Write a query returning order_id and amount for every order whose amount is greater than the overall average order amount. Sort by amount descending.",
          starterCode:
            "SELECT order_id, amount\nFROM orders\n-- your WHERE clause here\nORDER BY amount DESC;",
          solutionCode:
            "SELECT order_id, amount\nFROM orders\nWHERE amount > (SELECT AVG(amount) FROM orders)\nORDER BY amount DESC;",
          expectedOutput:
            " order_id | amount\n----------+--------\n     1007 | 250.00\n     1004 | 129.99\n     1011 |  92.75",
          tests: [
            {
              name: "Uses a scalar subquery",
              description:
                "The WHERE clause compares amount against (SELECT AVG(amount) FROM orders) rather than a hard-coded number",
            },
            {
              name: "Correct filtering and order",
              description:
                "Only above-average orders appear, sorted by amount descending",
            },
          ],
        },
        {
          type: "scenario",
          id: "sql12_sc_02",
          difficulty: "Hard",
          scenario:
            "Two analysts write queries for 'names of customers who placed at least one order'. Analyst A uses customers INNER JOIN orders. Analyst B uses WHERE EXISTS (…). Customer Priya placed 5 orders.",
          question: "How do the raw result sets differ before any deduplication?",
          options: [
            "They are identical — joins and EXISTS always return the same rows",
            "A returns Priya 5 times; B returns her once",
            "B returns Priya 5 times; A returns her once",
            "A errors because you cannot join without selecting order columns",
          ],
          correctIndex: 1,
          explanation:
            "An inner join produces one output row per match, so a customer with 5 orders appears 5 times unless you add DISTINCT. EXISTS is a boolean membership test — the customer row is kept once or not at all. When the second table is only a filter, EXISTS expresses the intent directly and avoids the duplication.",
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
            "When would you choose a subquery over a join, and vice versa?",
          answer:
            "I choose based on what the output needs and what reads closest to the business question. If I need columns from both tables in the result — say, order details alongside customer names — a join is the natural tool. If the second table is only a filter — 'customers who have ever ordered' — an EXISTS subquery states that intent directly and can never duplicate rows the way a one-to-many join can. Performance-wise, modern optimizers frequently rewrite IN subqueries and joins into the same execution plan, so I don't assume one is faster; I check EXPLAIN when it matters. I also reach for subqueries when I need a computed scalar, like comparing rows against an average, because there's no clean join equivalent. The one pattern I actively avoid is NOT IN against a nullable column, where NOT EXISTS is both safer and usually faster.",
        },
        {
          question:
            "Explain the difference between a correlated and a non-correlated subquery, including the performance implications.",
          answer:
            "A non-correlated subquery is fully self-contained: it references only its own tables, runs once, and its result is reused for every outer row — like computing a global average up front. A correlated subquery references a column from the outer query, such as WHERE customer_id = o.customer_id, so logically it must be re-evaluated for each outer row. That per-row semantics is what enables questions like 'each order versus its own customer's average'. The performance implication is that a naive execution is a nested loop: N outer rows times a scan of the inner table each. Optimizers often decorrelate these into joins or use indexes on the correlated column to make each probe cheap, but on large unindexed tables correlated subqueries are a common cause of slow queries. In interviews I'd add that window functions frequently replace correlated subqueries with a single pass over the data, which is usually the better production answer.",
        },
        {
          question:
            "Why does NOT IN behave unexpectedly with NULLs, and what do you use instead?",
          answer:
            "NOT IN (a, b, NULL) expands to x <> a AND x <> b AND x <> NULL. Any comparison with NULL evaluates to unknown under SQL's three-valued logic, and an AND chain containing unknown can never be true — at best it's unknown, and WHERE only keeps rows that are strictly true. So a single NULL in the subquery's result silently empties the entire outer result set, with no error and no warning. That combination — silent and total — makes it one of the most dangerous traps in analytical SQL. The fix is NOT EXISTS with a correlated equality: it asks 'is there a matching row?' per outer row, and NULLs in the inner column don't match anything, so they don't poison the result. Alternatively you can filter NULLs inside the subquery with WHERE user_id IS NOT NULL, but NOT EXISTS is the habit that never bites.",
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
        "1) Using NOT IN against a column that can contain NULL — one NULL silently returns zero rows; use NOT EXISTS. 2) Writing a scalar subquery that can return multiple rows — PostgreSQL errors at runtime, and only when the data triggers it; guard with an aggregate or rethink the shape. 3) Forgetting the alias on a derived table — FROM (SELECT …) needs AS something in PostgreSQL. 4) Reaching for a correlated subquery when a join or window function does the same work in one pass — trace whether the inner query really needs the outer row. 5) Selecting columns in the inner query that the outer position can't use — IN compares against exactly one inner column; SELECT * inside IN is an error waiting to happen.",
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
        "Try these prompts in the AI Tutor panel: • 'ELI5: what's the difference between a correlated and non-correlated subquery?' • 'Show me the NOT IN NULL trap with a tiny 3-row example I can trace by hand.' • 'Give me a business question that needs a derived table in FROM, and let me try writing it first.' • 'Rewrite this IN subquery as a join and explain when the results would differ.' • 'Interview mode: quiz me on EXISTS vs IN and grade my answers.'",
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
        "Subquery — a complete SELECT nested inside another SQL statement. Inner query — the nested SELECT; runs (conceptually) before the outer query uses its result. Outer query — the enclosing statement that consumes the subquery's result. Scalar subquery — a subquery returning exactly one row and one column. IN — operator testing whether a value appears in a list or subquery result. Correlated subquery — an inner query that references a column from the outer query, re-evaluated per outer row. EXISTS — operator that is true when the subquery returns at least one row. NOT EXISTS — NULL-safe way to express 'no matching row'. Derived table — a subquery in the FROM clause, aliased and treated as a table. Three-valued logic — SQL's true/false/unknown system; comparisons with NULL yield unknown. Decorrelation — an optimizer rewrite turning a correlated subquery into a join.",
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
        "• Docs: PostgreSQL manual, 'Subquery Expressions' (EXISTS, IN, ANY/ALL) — the authoritative reference for edge cases. • Read: 'What's the difference between EXISTS and IN?' threads on the PostgreSQL wiki for real optimizer behavior. • Practice: take any IN subquery you write this week and rewrite it as both a join and an EXISTS — compare row counts. • Next in DSM: CTEs (Common Table Expressions) take the derived-table pattern you saw here and make it readable with named steps.",
    },

    /* ---------------------------------------------------------------- */
    /*  12 — Recap                                                       */
    /* ---------------------------------------------------------------- */
    {
      id: "recap",
      type: "recap",
      tocLabel: "Recap",
      content:
        "✓ A subquery is a full SELECT nested inside another statement — the inner result feeds the outer query.\n✓ Result shape decides usage: scalar after comparisons, single column with IN, full table in FROM (with an alias).\n✓ Non-correlated subqueries run once; correlated subqueries reference an outer column and run per outer row.\n✓ EXISTS tests for row presence and short-circuits; NOT EXISTS is the NULL-safe form of 'never did X'.\n✓ NOT IN silently returns zero rows if the inner list contains a NULL — a trap worth memorizing.\n✓ Derived tables let you aggregate an aggregation, like averaging per-customer totals.\n\nNext up: CTEs (Common Table Expressions). Deeply nested subqueries are hard to read — WITH lets you name each step and build multi-stage analyses that read top-to-bottom.",
    },
  ],
};
