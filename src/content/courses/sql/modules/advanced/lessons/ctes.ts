import type { Lesson } from "@/lib/curriculum/types";

export const ctes: Lesson = {
  meta: {
    id: "sql.advanced.ctes",
    slug: "ctes",
    title: "CTEs (Common Table Expressions)",
    description:
      "Name intermediate results with WITH, turn nested subqueries into readable pipelines, and meet the recursive form that walks hierarchies.",
    estimatedTime: "35 mins",
    difficulty: "Intermediate",
    xpReward: 80,
    prerequisites: ["sql.advanced.subqueries"],
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
        hook: "Open any senior analyst's SQL file and you'll see the same shape: WITH step_one AS (…), step_two AS (…) SELECT … — a named pipeline, read top to bottom like a recipe. Subqueries gave you nesting; CTEs give you *narrative*. Same power, radically better readability.",
        what: "A Common Table Expression (CTE) is a named temporary result defined with WITH at the top of a query. The main query — and later CTEs in the same WITH list — can reference it by name, exactly as if it were a table that exists just for this one statement.",
        why: "Real analyses are multi-step: filter, aggregate, compare against the aggregate, rank. Nested subqueries express that inside-out — you read the deepest parenthesis first. CTEs express it top-down in execution order, each step named after what it means. That's the difference between SQL your team reviews in minutes and SQL nobody dares touch.",
        whereUsed:
          "Every serious analytics codebase: funnel queries, cohort tables, metric definitions in dbt models (which are essentially CTE pipelines), deduplication passes, and recursive walks of org charts and category trees.",
        objectives: [
          "Define single and chained CTEs with WITH … AS",
          "Refactor a nested subquery into a top-down CTE pipeline",
          "Reference one CTE from another to build multi-step transformations",
          "Explain CTE scope and when a CTE is evaluated more than once",
          "Read and write a basic recursive CTE for hierarchy traversal",
        ],
        realWorldApps: [
          {
            company: "Airbnb",
            headline: "Metric pipelines in dbt",
            detail:
              "Analytics models are built as layered CTE chains — staging, filtering, aggregation, final select — reviewed like application code.",
          },
          {
            company: "GitLab",
            headline: "Public data-team handbook queries",
            detail:
              "GitLab's open analytics codebase mandates CTE-first style: every transformation step named, no nested subqueries beyond trivial cases.",
          },
          {
            company: "Amazon",
            headline: "Category-tree rollups",
            detail:
              "Product taxonomies nest dozens of levels deep; recursive CTEs expand a category's full subtree to aggregate sales at any node.",
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
            "Syntax: WITH name AS (SELECT …) SELECT … FROM name. The parenthesized query is the CTE body; the name is visible to everything after it within the same statement — and only there. A statement can define several CTEs in one WITH list, separated by commas, and each may reference the ones defined before it. WITH is written once; subsequent CTEs repeat only name AS (…).",
        },
        {
          type: "analogy",
          title: "The mise en place analogy",
          content:
            "A chef doesn't chop onions inside the soup pot. They prepare labeled bowls first — chopped onions, minced garlic, measured stock — then combine them in order. CTEs are labeled bowls: german_customers, their_orders, monthly_totals. The final SELECT is the pot. Anyone can audit a bowl on its own; nobody can audit a soup where every ingredient was prepared mid-boil.",
        },
        {
          type: "keypoint",
          title: "CTEs read in execution order",
          content:
            "A nested subquery reads inside-out: the deepest block runs 'first' conceptually but is written in the middle of the statement. A CTE chain reads top-down in the same order it logically executes: step 1, step 2, final query. Reviewers verify each step against its name and move on — which is why style guides at data-mature companies mandate CTEs over nesting beyond one level.",
        },
        {
          type: "code-note",
          code: "WITH shipped AS (\n  SELECT * FROM orders WHERE status = 'shipped'\n),\ncustomer_totals AS (\n  SELECT customer_id, SUM(amount) AS total\n  FROM shipped\n  GROUP BY customer_id\n)\nSELECT customer_id, total\nFROM customer_totals\nWHERE total > 1000\nORDER BY total DESC;",
          content:
            "A two-step pipeline: filter, then aggregate, then the main query filters the aggregate. Note customer_totals reads FROM shipped — later CTEs build on earlier ones. Also note the HAVING-avoidance: filtering an aggregate in a later step (WHERE total > 1000) is equivalent to HAVING and often clearer in pipelines.",
        },
        {
          type: "keypoint",
          title: "Scope: one statement, no side effects",
          content:
            "A CTE exists only inside its statement — it is not a temp table, not a view, and leaves nothing behind. Two queries needing the same intermediate result must each define it (or promote it to a view/dbt model, the standard evolution when a CTE gets copy-pasted a third time). Within one statement, a CTE may be referenced multiple times — the classic advantage over repeating a subquery verbatim.",
        },
        {
          type: "expandable",
          title: "Are CTEs faster or slower than subqueries?",
          content:
            "Usually identical: modern PostgreSQL (12+), SQL Server, and most warehouses inline CTEs into the plan just like subqueries, so the optimizer sees the same query. Two caveats. First, a CTE referenced several times may be computed once and reused ('materialized') or inlined per reference — engines differ; PostgreSQL lets you force either with AS MATERIALIZED / AS NOT MATERIALIZED. Second, materialization is an optimization FENCE: predicates from the outer query may not push down into a materialized CTE, occasionally making the CTE form slower. The honest answer for interviews: write for readability first, check EXPLAIN when it matters (you'll learn EXPLAIN in the Database Design module).",
        },
        {
          type: "text",
          content:
            "The recursive form: WITH RECURSIVE walks structures of unknown depth. It has two parts glued by UNION ALL — an anchor (the starting rows) and a recursive member that references the CTE's own name to add the next 'level'. The engine repeats the recursive member until it produces no new rows. This is THE tool for org charts, category trees, and dependency graphs — things plain self joins handle only one fixed level at a time.",
        },
        {
          type: "code-note",
          code: "WITH RECURSIVE org AS (\n  SELECT employee_id, name, manager_id, 1 AS depth\n  FROM employees\n  WHERE manager_id IS NULL          -- anchor: the CEO\n  UNION ALL\n  SELECT e.employee_id, e.name, e.manager_id, org.depth + 1\n  FROM employees e\n  INNER JOIN org ON e.manager_id = org.employee_id  -- next level\n)\nSELECT name, depth FROM org ORDER BY depth, name;",
          content:
            "Read it as levels: the anchor emits the root (depth 1); each pass joins employees to the rows produced so far, emitting their direct reports one level deeper; recursion stops when a pass adds nothing. The depth counter is both useful output and your safety rail — add WHERE depth < 20 while developing to guard against cycles in dirty data.",
        },
        {
          type: "warning",
          title: "Recursive CTEs can loop forever on cyclic data",
          content:
            "If a corrupted row makes an employee (transitively) their own manager, the recursive member keeps producing rows and the query runs until it exhausts memory or a timeout. Defenses: a depth cap in the recursive member, or (PostgreSQL 14+) the CYCLE clause; production hierarchies also deserve a constraint-level guarantee. Treat any recursive CTE without a depth guard as a code-review finding.",
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
        title: "From Nested Soup to Named Pipeline",
        caption:
          "The same three-step analysis, restructured. Click each node — the CTE chain runs top-down, and each step is independently testable.",
        nodes: [
          {
            id: "nested",
            label: "Nested form",
            sublabel: "read inside-out",
            detail:
              "SELECT … FROM (SELECT … FROM (SELECT …))— the deepest block is step 1 but sits in the middle of the text. Reviewers must mentally unwrap parentheses; testing a middle step means surgically extracting it.",
            x: 12,
            y: 22,
            accent: false,
          },
          {
            id: "cte1",
            label: "WITH shipped AS (…)",
            sublabel: "step 1: filter",
            detail:
              "Named for what it MEANS, not how it's computed. To test it alone: SELECT * FROM shipped — just run the statement with a different final query. This testability is the underrated superpower of CTE style.",
            x: 45,
            y: 12,
            accent: true,
          },
          {
            id: "cte2",
            label: "customer_totals AS (…)",
            sublabel: "step 2: aggregate",
            detail:
              "Reads FROM shipped — CTEs chain forward; each may reference all earlier ones (never later ones). The dependency order is visible in the text order.",
            x: 45,
            y: 40,
            accent: true,
          },
          {
            id: "final",
            label: "Final SELECT",
            sublabel: "step 3: consume",
            detail:
              "The main query treats customer_totals as a table: filter it, join it, rank it. All the complexity above has names; the final query often shrinks to three honest lines.",
            x: 45,
            y: 68,
            accent: false,
          },
          {
            id: "anchor",
            label: "RECURSIVE: anchor",
            sublabel: "starting rows",
            detail:
              "The non-recursive half: WHERE manager_id IS NULL seeds the walk with the root level. Runs exactly once.",
            x: 80,
            y: 22,
            accent: false,
          },
          {
            id: "step",
            label: "recursive member",
            sublabel: "level N → N+1",
            detail:
              "Joins the base table to the CTE's own previous output, emitting the next level. Repeats until an iteration adds zero rows. UNION ALL accumulates all levels into the final result. Depth caps guard against cycles.",
            x: 80,
            y: 55,
            accent: true,
          },
        ],
        edges: [
          { from: "nested", to: "cte1", label: "refactor" },
          { from: "cte1", to: "cte2", label: "FROM shipped" },
          { from: "cte2", to: "final", label: "FROM customer_totals" },
          { from: "anchor", to: "step", label: "UNION ALL" },
          { from: "step", to: "step", label: "until no new rows" },
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
          title: "First CTE: name a filter",
          scenario:
            "Count shipped orders per country — with the filter step named instead of inlined.",
          steps: [
            {
              code: "WITH shipped AS (\n  SELECT order_id, country, amount\n  FROM orders\n  WHERE status = 'shipped'\n)\nSELECT country, COUNT(*) AS orders\nFROM shipped\nGROUP BY country;",
              explanation:
                "The CTE isolates 'which rows are in scope' from 'what we compute'. Functionally identical to putting WHERE in the main query — the value is structural: as the analysis grows, the scope definition stays in one named place instead of being repeated in five queries' WHERE clauses.",
            },
          ],
          output:
            " country | orders\n---------+--------\n DE      |    260\n US      |    230\n FR      |    130\n(3 rows)",
        },
        {
          difficulty: "Easy",
          title: "Refactoring a nested subquery",
          scenario:
            "Last lesson's 'orders above the average' — first nested, then as a pipeline.",
          steps: [
            {
              code: "-- Nested version (from the Subqueries lesson)\nSELECT order_id, amount\nFROM orders\nWHERE amount > (SELECT AVG(amount) FROM orders);",
              explanation:
                "Perfectly fine at this size — one level of nesting is idiomatic. The refactor below is about establishing the pattern you'll use when there are three steps, not one.",
            },
            {
              code: "WITH stats AS (\n  SELECT AVG(amount) AS avg_amount FROM orders\n)\nSELECT o.order_id, o.amount\nFROM orders o\nCROSS JOIN stats s\nWHERE o.amount > s.avg_amount;",
              explanation:
                "The scalar lives in a one-row CTE; CROSS JOIN attaches that single row to every order (a 1×N cross join is the standard way to make a scalar available row-wise). Now the average is inspectable (SELECT * FROM stats) and reusable if three more conditions need it.",
            },
          ],
          output:
            " order_id | amount\n----------+---------\n     1042 | 1250.00\n     1017 |  980.50\n(2 rows)",
        },
        {
          difficulty: "Medium",
          title: "A three-step funnel pipeline",
          scenario:
            "From events(user_id, event_type, created_at): how many users viewed a product, how many of those added to cart, and how many of those purchased — the classic funnel, one CTE per stage.",
          steps: [
            {
              code: "WITH viewers AS (\n  SELECT DISTINCT user_id FROM events\n  WHERE event_type = 'product_view'\n),\ncarters AS (\n  SELECT DISTINCT e.user_id\n  FROM events e\n  INNER JOIN viewers v ON v.user_id = e.user_id\n  WHERE e.event_type = 'add_to_cart'\n),",
              explanation:
                "Each stage is defined relative to the previous one: carters must already be viewers (the INNER JOIN enforces the funnel's ordering by population, not by timestamp — a deliberate simplification stated in the name). DISTINCT collapses repeat events into unique users, since funnels count people.",
            },
            {
              code: "buyers AS (\n  SELECT DISTINCT e.user_id\n  FROM events e\n  INNER JOIN carters c ON c.user_id = e.user_id\n  WHERE e.event_type = 'purchase'\n)\nSELECT\n  (SELECT COUNT(*) FROM viewers) AS viewed,\n  (SELECT COUNT(*) FROM carters) AS added_to_cart,\n  (SELECT COUNT(*) FROM buyers)  AS purchased;",
              explanation:
                "The final SELECT reads one count per stage via scalar subqueries against the named stages — CTEs and subqueries composing, not competing. Conversion rates are one division away. Adding a stage later = adding one CTE, not rewriting a nest.",
            },
          ],
          output:
            " viewed | added_to_cart | purchased\n--------+---------------+-----------\n  8240  |          2110 |       640\n(1 row)",
        },
        {
          difficulty: "Hard",
          title: "Deduplication with a ranked CTE",
          scenario:
            "customers has duplicate emails from a bad import; keep only the newest row per email. The pattern: rank inside a CTE, filter outside — the single most copy-pasted CTE idiom in industry.",
          steps: [
            {
              code: "WITH ranked AS (\n  SELECT\n    customer_id, email, created_at,\n    ROW_NUMBER() OVER (\n      PARTITION BY email\n      ORDER BY created_at DESC\n    ) AS rn\n  FROM customers\n)",
              explanation:
                "ROW_NUMBER() OVER (…) is a window function — next lesson's topic, previewed here because this pairing is inseparable in practice: it numbers each email's rows 1, 2, 3… newest first. The key limitation it works around: window results can't be filtered in the same SELECT's WHERE, so the ranking must live one step earlier — in a CTE.",
            },
            {
              code: "SELECT customer_id, email, created_at\nFROM ranked\nWHERE rn = 1;",
              explanation:
                "Outside the CTE, rn is an ordinary column and WHERE rn = 1 keeps exactly the newest row per email. Swap the ORDER BY inside OVER to change 'newest wins' to any other survivorship rule — smallest id, most complete record, highest lifetime spend.",
            },
          ],
          output:
            " customer_id | email      | created_at\n-------------+------------+------------\n           3 | ana@x.com  | 2026-06-30\n           5 | ben@y.com  | 2026-07-02\n           4 | cara@z.com | 2026-05-11\n(3 rows)",
        },
        {
          difficulty: "Industry Example",
          title: "Recursive CTE: the full org subtree",
          scenario:
            "HR asks: 'everyone under Priya, at any depth, with their level relative to her' — unknown depth, so chained self joins can't express it. employees: (1,'Sofia',NULL), (2,'Priya',1), (3,'Marco',1), (4,'Lena',2), (5,'Omar',4).",
          steps: [
            {
              code: "WITH RECURSIVE team AS (\n  SELECT employee_id, name, manager_id, 0 AS level\n  FROM employees\n  WHERE name = 'Priya'",
              explanation:
                "The anchor seeds the walk with Priya herself at level 0. Anchors don't have to be hierarchy roots — any starting set works, which is what makes the pattern reusable for 'subtree under X'.",
            },
            {
              code: "  UNION ALL\n  SELECT e.employee_id, e.name, e.manager_id, t.level + 1\n  FROM employees e\n  INNER JOIN team t ON e.manager_id = t.employee_id\n  WHERE t.level < 10\n)",
              explanation:
                "Pass 1 finds rows whose manager is in the anchor set → Lena (level 1). Pass 2 finds rows whose manager is Lena → Omar (level 2). Pass 3 finds nothing → recursion halts. The t.level < 10 guard caps the walk in case dirty data ever forms a cycle; on clean data it changes nothing.",
            },
            {
              code: "SELECT name, level\nFROM team\nORDER BY level, name;",
              explanation:
                "UNION ALL accumulated every pass into one result. Sofia and Marco never appear — they're outside the subtree. GROUP BY level on top gives headcount per layer; joining salaries gives cost-of-org rollups — all downstream of the same recursive core.",
            },
          ],
          output:
            " name  | level\n-------+-------\n Priya |     0\n Lena  |     1\n Omar  |     2\n(3 rows)",
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
          "Build a two-step pipeline over orders(order_id, customer_id, amount, status): step 1 (CTE shipped) keeps shipped orders; step 2 (CTE customer_totals) sums amount per customer from shipped as total. The final query returns customer_id and total for customers with total > 250, highest first. Fill in the blanks.",
        starterCode:
          "-- orders(order_id, customer_id, amount, status)\n-- Rows: (1, 10, 100.00, 'shipped'), (2, 10, 200.00, 'shipped'),\n--       (3, 11, 900.00, 'cancelled'), (4, 12, 260.00, 'shipped'),\n--       (5, 13, 50.00, 'shipped')\n\n___ shipped AS (\n  SELECT customer_id, amount\n  FROM orders\n  WHERE status = 'shipped'\n),\ncustomer_totals ___ (\n  SELECT customer_id, SUM(amount) AS total\n  FROM ___\n  GROUP BY customer_id\n)\nSELECT customer_id, total\nFROM customer_totals\nWHERE total ___ 250\nORDER BY total DESC;",
        solutionCode:
          "-- orders(order_id, customer_id, amount, status)\n-- Rows: (1, 10, 100.00, 'shipped'), (2, 10, 200.00, 'shipped'),\n--       (3, 11, 900.00, 'cancelled'), (4, 12, 260.00, 'shipped'),\n--       (5, 13, 50.00, 'shipped')\n\nWITH shipped AS (\n  SELECT customer_id, amount\n  FROM orders\n  WHERE status = 'shipped'\n),\ncustomer_totals AS (\n  SELECT customer_id, SUM(amount) AS total\n  FROM shipped\n  GROUP BY customer_id\n)\nSELECT customer_id, total\nFROM customer_totals\nWHERE total > 250\nORDER BY total DESC;",
        expectedOutput:
          " customer_id | total\n-------------+--------\n          10 | 300.00\n          12 | 260.00\n(2 rows)",
        hints: [
          "Four blanks: the opening keyword, the second CTE's AS, the table the second CTE reads from, and a comparison operator.",
          "WITH appears once, before the first CTE; every CTE uses name AS (…) — so the second blank is AS.",
          "The second step builds on the first: FROM shipped, not FROM orders (or customer 11's cancelled 900 would leak in).",
          "Customer 10: 100+200 = 300 ✓; customer 12: 260 ✓; customer 13: 50 ✗; customer 11: cancelled, excluded by step 1. The comparison is >.",
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
          id: "sql13_mcq_01",
          difficulty: "Easy",
          question: "How long does a CTE exist?",
          options: [
            "Until the session ends",
            "Until explicitly dropped",
            "Only within the single statement that defines it",
            "Until the transaction commits",
          ],
          correctIndex: 2,
          explanation:
            "A CTE is pure syntax scoped to one statement — the next query has never heard of it. Session lifetime describes temp tables; explicit dropping describes tables and views; transaction scope describes some temp-table variants. When multiple statements need the same logic, promote the CTE to a view (or a dbt model).",
        },
        {
          type: "mcq",
          id: "sql13_mcq_02",
          difficulty: "Easy",
          question:
            "In WITH a AS (…), b AS (…) SELECT … — which references are legal?",
          options: [
            "b may reference a; the final SELECT may reference both",
            "a may reference b, since WITH is hoisted",
            "CTEs may never reference each other",
            "Only the final SELECT may reference CTEs",
          ],
          correctIndex: 0,
          explanation:
            "CTEs chain forward: each may read every CTE defined BEFORE it in the list, and the main query reads any of them. Backward references (a using b) are invalid — there's no hoisting; text order is dependency order. Inter-CTE references are not just legal but the whole point of pipeline style.",
        },
        {
          type: "mcq",
          id: "sql13_mcq_03",
          difficulty: "Medium",
          question:
            "Why does the deduplication idiom put ROW_NUMBER() in a CTE and filter rn = 1 in the outer query?",
          options: [
            "Window functions are only allowed inside CTEs",
            "A window result can't be filtered by WHERE in the same SELECT, so the ranking must be computed one step before it's filtered",
            "It makes ROW_NUMBER deterministic",
            "CTEs cache the ranking for reuse by other statements",
          ],
          correctIndex: 1,
          explanation:
            "WHERE runs logically before window functions are evaluated, so WHERE rn = 1 inside the same SELECT would reference a column that doesn't exist yet. Wrapping the ranked SELECT in a CTE (or subquery) makes rn an ordinary column one level up. Window functions are legal in any SELECT list. Determinism comes from a complete ORDER BY inside OVER, not from the CTE. And CTEs never outlive their statement, so nothing is cached across statements.",
        },
        {
          type: "mcq",
          id: "sql13_mcq_04",
          difficulty: "Medium",
          question: "In a recursive CTE, what stops the recursion?",
          options: [
            "A mandatory LIMIT clause",
            "An iteration of the recursive member that produces zero new rows",
            "The engine's hard cap of 100 iterations",
            "The anchor query running a second time and returning nothing",
          ],
          correctIndex: 1,
          explanation:
            "The engine repeats the recursive member, feeding it the previous iteration's rows; when a pass emits nothing, there is no next level and recursion halts naturally. No LIMIT is required (though depth guards are wise on dirty data). There is no universal 100-iteration cap. The anchor runs exactly once — only the recursive member repeats.",
        },
        {
          type: "scenario",
          id: "sql13_sc_01",
          difficulty: "Hard",
          scenario:
            "A recursive org-chart query that normally returns 1,240 rows suddenly runs for minutes and gets killed on memory after an HR data migration. The migration is suspected of corrupting some manager_id values.",
          question: "What is the most likely cause, and the right defensive fix?",
          options: [
            "The table grew too large for CTEs; switch to nested subqueries",
            "The migration created a cycle (an employee transitively their own manager), so the recursive member never runs dry; add a depth cap (or a CYCLE clause) and fix the offending rows",
            "UNION ALL should be UNION to remove the extra rows",
            "The anchor now matches multiple roots, which recursion cannot handle",
          ],
          correctIndex: 1,
          explanation:
            "A cycle means every iteration keeps re-reaching rows and emitting 'deeper' copies forever — classic post-migration failure when a manager_id got repointed downward. A depth guard (WHERE t.level < 20) bounds the damage immediately; PostgreSQL 14+'s CYCLE clause detects revisits properly; and the durable fix is repairing the data plus constraints. Table size alone doesn't cause unbounded growth. UNION instead of UNION ALL can mask SOME cycles at real cost and semantic risk — it's a band-aid, not the answer. Multiple anchor roots are perfectly legal and common ('all subtrees of every VP').",
        },
        {
          type: "coding",
          id: "sql13_code_01",
          difficulty: "Hard",
          prompt:
            "Using two chained CTEs over orders(order_id, customer_id, amount): (1) customer_totals — total spend per customer; (2) grand — the single overall average of those totals. Final query: each customer_id, total, and their share vs the average as pct_of_avg = ROUND(total / avg_total * 100, 0). Sort by total descending.",
          starterCode:
            "-- orders(order_id, customer_id, amount)\n-- Rows: (1,10,100.00), (2,10,200.00), (3,11,150.00), (4,12,50.00)\n\n",
          solutionCode:
            "WITH customer_totals AS (\n  SELECT customer_id, SUM(amount) AS total\n  FROM orders\n  GROUP BY customer_id\n),\ngrand AS (\n  SELECT AVG(total) AS avg_total\n  FROM customer_totals\n)\nSELECT\n  ct.customer_id,\n  ct.total,\n  ROUND(ct.total / g.avg_total * 100, 0) AS pct_of_avg\nFROM customer_totals ct\nCROSS JOIN grand g\nORDER BY ct.total DESC;",
          expectedOutput:
            " customer_id | total  | pct_of_avg\n-------------+--------+------------\n          10 | 300.00 |        180\n          11 | 150.00 |         90\n          12 |  50.00 |         30\n(3 rows)",
          tests: [
            {
              name: "Chained CTEs",
              description: "grand reads FROM customer_totals — the second step builds on the first",
            },
            {
              name: "Scalar attachment",
              description: "The one-row grand CTE joins to every customer row (CROSS JOIN or equivalent)",
            },
            {
              name: "Correct math",
              description: "avg_total = (300+150+50)/3 = 166.67; shares 180 / 90 / 30",
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
            "When do you reach for a CTE over a subquery, and is there a performance difference?",
          answer:
            "My default is: one level of nesting for a trivial scalar or IN-list is fine as a subquery; anything with two or more steps, anything a teammate will review, and anything where a step deserves a name becomes a CTE pipeline. CTEs read top-down in execution order, make each step independently runnable for debugging, and let one intermediate result be referenced several times without duplication. On performance: in modern engines the two forms usually compile to the same plan — PostgreSQL 12+ inlines CTEs like subqueries. The nuance worth mentioning is materialization: a CTE referenced multiple times may be computed once and reused, which can help or hurt, and a materialized CTE acts as an optimization fence blocking predicate pushdown; PostgreSQL exposes AS MATERIALIZED / NOT MATERIALIZED to choose. So: readability decides the default, EXPLAIN decides the exceptions.",
        },
        {
          question:
            "Explain how a recursive CTE works, using an org chart as the example.",
          answer:
            "A recursive CTE has two members joined by UNION ALL. The anchor runs once and seeds the result — for an org chart, the CEO row (or any subtree root), typically with a level counter of 0. The recursive member references the CTE's own name: it joins the base table to the rows produced by the previous iteration — employees whose manager_id is in the current frontier — emitting the next level with level + 1. The engine iterates until a pass yields zero new rows, and the final result is the union of every pass: the whole tree, each row annotated with its depth. Two production notes: seed the anchor with any node to get 'the subtree under X', which fixed-depth self joins cannot express for unknown depth; and always guard against cycles in dirty data with a depth cap or the CYCLE clause, because a corrupted manager pointer otherwise makes the recursion run forever.",
        },
        {
          question:
            "Your team's 400-line report query is an unreadable nest of subqueries. How would you refactor it, and how do you make sure you didn't change the results?",
          answer:
            "I refactor inside-out: find the deepest subquery, lift it to the top as the first CTE named for its business meaning, and repeat until the main query is a short SELECT over named steps — mechanical transformations only, no 'improvements' mixed in, because simultaneous refactor-and-fix makes regressions undiagnosable. Verification is a reconciliation harness: run old and new on the same data and compare row counts, checksums of key aggregates (SUM of measures, COUNT DISTINCT of keys), and ideally a full EXCEPT in both directions, which returns zero rows when the outputs are identical. Then I add one micro-test per CTE — each step is now independently runnable, so I can assert 'shipped has no cancelled rows' directly. That testability is the real payoff of the refactor: the next change gets reviewed step by step instead of by reputation. If several reports share the early steps, I'd promote those CTEs into views or dbt models so the logic exists once.",
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
        "1) Writing WITH before every CTE — WITH appears once; later CTEs are just name AS (…) after a comma. 2) Referencing a CTE defined later in the list — text order is dependency order; reorder the steps. 3) Expecting a CTE to exist in the next statement — it dies with its statement; promote reused logic to a view. 4) Filtering a window function's result in the same SELECT (WHERE rn = 1 beside the ROW_NUMBER) — compute in a CTE, filter one level up. 5) Shipping a recursive CTE with no depth guard — clean data today doesn't prevent a cyclic manager_id tomorrow, and the failure mode is an unkillable query.",
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
        "Try these prompts in the AI Tutor panel: • 'ELI5: CTEs with a cooking mise-en-place analogy of your own.' • 'Give me a three-level nested query and coach me through refactoring it to CTEs.' • 'Trace a recursive CTE over a 6-employee org chart, iteration by iteration.' • 'When does CTE materialization help and when does it hurt? Small examples.' • 'Interview mode: have me design a funnel query with CTEs and critique my step names.'",
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
        "CTE (Common Table Expression) — a named intermediate result defined with WITH, scoped to one statement. WITH list — the comma-separated sequence of CTE definitions before the main query. Pipeline style — structuring analysis as chained, named CTE steps read top-down. Forward reference — each CTE may read earlier CTEs only. Materialization — computing a CTE once and reusing the stored result; an optimization fence for predicate pushdown. Inlining — the optimizer merging a CTE's body into the outer plan like a subquery. Recursive CTE — WITH RECURSIVE; anchor + recursive member glued by UNION ALL. Anchor — the seed rows, run once. Recursive member — the self-referencing half producing the next level per iteration. Depth guard — a level cap protecting against cycles. Deduplication idiom — ROW_NUMBER in a CTE, WHERE rn = 1 outside. View — a persistent named query; the promotion target for CTEs needed across statements.",
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
        "• Docs: PostgreSQL manual — 'WITH Queries (Common Table Expressions)', including the MATERIALIZED options and CYCLE clause. • Read: GitLab's public SQL style guide for a production CTE-first standard, and the dbt docs' 'refactoring legacy SQL' guide. • Practice: take your gnarliest saved query and refactor it into named steps, verifying with EXCEPT in both directions; then write one recursive walk over a toy org chart. • Next in DSM: the deduplication example smuggled in ROW_NUMBER() OVER — Window Functions in SQL opens that toolbox properly: ranks, lags, and running totals without collapsing rows.",
    },

    /* ---------------------------------------------------------------- */
    /*  12 — Recap                                                       */
    /* ---------------------------------------------------------------- */
    {
      id: "recap",
      type: "recap",
      tocLabel: "Recap",
      content:
        "✓ WITH name AS (…) names an intermediate result for one statement; later CTEs and the main query read it like a table.\n✓ CTEs chain forward — each step may reference earlier steps — turning nested logic into a top-down pipeline in execution order.\n✓ Scope is a single statement: no side effects, nothing persists; promote reused CTEs to views.\n✓ Performance is usually identical to subqueries (inlining); materialization can help multi-reference CTEs or hurt pushdown — EXPLAIN decides.\n✓ The dedup idiom — rank in a CTE, filter rn = 1 outside — exists because WHERE can't see same-SELECT window results.\n✓ WITH RECURSIVE = anchor + self-referencing member + UNION ALL, iterating until no new rows; always guard depth against cycles.\n\nNext up: Window Functions in SQL. You've now used ROW_NUMBER once as a guest star — next it headlines: PARTITION BY, ranking families, LAG/LEAD time travel, and running totals, all without collapsing a single row.",
    },
  ],
};
