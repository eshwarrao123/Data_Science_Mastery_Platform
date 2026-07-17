import type { Lesson } from "@/lib/curriculum/types";

export const orderByAndLimit: Lesson = {
  meta: {
    id: "sql.foundations.order-by-and-limit",
    slug: "order-by-and-limit",
    title: "ORDER BY & LIMIT",
    description:
      "Sort result sets with ORDER BY, control NULL placement, and answer top-N and pagination questions with LIMIT and OFFSET.",
    estimatedTime: "20 mins",
    difficulty: "Beginner",
    xpReward: 40,
    prerequisites: ["sql.foundations.where-and-filtering"],
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
        hook: "Half the questions a stakeholder asks start with the word 'top'. Top 10 products. Top 5 customers. Worst 3 regions. Those are two clauses in SQL — ORDER BY to rank, LIMIT to cut — and after this lesson they'll take you under ten seconds each.",
        what: "ORDER BY sorts the result set by one or more columns, ascending (ASC, the default) or descending (DESC). LIMIT keeps only the first N rows of that sorted result; OFFSET skips rows before counting, which is how pagination works.",
        why: "Tables have no inherent order — without ORDER BY, the database returns rows in whatever order is convenient for it, and that order can change between runs. Any 'top N' claim, any report sorted for humans, and any paginated API needs explicit sorting to be correct and reproducible.",
        whereUsed:
          "Leaderboards, 'latest orders' views, best/worst-performer reports, paginated tables in every web app, and the ubiquitous 'show me the 10 biggest…' request in analytics.",
        objectives: [
          "Sort rows with ORDER BY, ascending and descending",
          "Sort by multiple columns and by computed expressions or aliases",
          "Control where NULLs sort with NULLS FIRST / NULLS LAST",
          "Answer top-N questions by combining ORDER BY with LIMIT",
          "Paginate results with LIMIT/OFFSET and explain its pitfalls",
        ],
        realWorldApps: [
          {
            company: "Spotify",
            headline: "Daily Top 50 charts",
            detail:
              "Chart queries rank tracks by stream counts — ORDER BY streams DESC LIMIT 50 over a day's aggregated plays, per market.",
          },
          {
            company: "Amazon",
            headline: "Best-seller shelves",
            detail:
              "Category pages surface the highest-selling items: sort by units sold descending, cut to the top few, refreshed on a schedule.",
          },
          {
            company: "DoorDash",
            headline: "Paginated order history",
            detail:
              "The 'your orders' screen pages through past orders newest-first — ORDER BY created_at DESC with LIMIT/OFFSET (or a keyset variant) per page.",
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
            "ORDER BY comes after WHERE and takes a list of sort keys: ORDER BY amount DESC, created_at ASC. The first key does the primary sort; later keys break ties among rows that are equal on the earlier keys. ASC (smallest first) is the default, so you only ever need to write DESC.",
        },
        {
          type: "analogy",
          title: "The librarian analogy",
          content:
            "A sort with multiple keys works like a librarian shelving books: first by author surname (primary key), and when two books share an author, by title (tie-breaker). ORDER BY country, amount DESC does the same — rows are grouped alphabetically by country, and within each country the biggest amounts come first.",
        },
        {
          type: "keypoint",
          title: "No ORDER BY means no order",
          content:
            "A table is a set of rows, not a sequence. Without ORDER BY the database may return rows in insertion order, index order, or parallel-scan order — and it can differ run to run. If row order matters even slightly (reports, LIMIT, exports, tests), ORDER BY is mandatory, not decorative.",
        },
        {
          type: "code-note",
          code: "SELECT product_name,\n       quantity * unit_price AS line_total\nFROM order_items\nORDER BY line_total DESC;",
          content:
            "Unlike WHERE, ORDER BY runs after the SELECT list — so it CAN reference output aliases like line_total. You can also sort by expressions directly (ORDER BY quantity * unit_price DESC). Some dialects allow ORDER BY 2 (sort by the second output column); it works, but named keys survive column reordering and are the professional habit.",
        },
        {
          type: "text",
          content:
            "LIMIT n keeps the first n rows of the sorted result. OFFSET m skips m rows first. Together they implement pagination: page 3 with 20 rows per page is LIMIT 20 OFFSET 40. Dialect note: LIMIT/OFFSET is PostgreSQL, MySQL, and SQLite syntax; SQL Server uses TOP n or OFFSET … FETCH NEXT n ROWS ONLY, and Oracle uses FETCH FIRST n ROWS ONLY.",
        },
        {
          type: "warning",
          title: "LIMIT without ORDER BY is a lottery",
          content:
            "LIMIT 10 on an unsorted query returns ten arbitrary rows — not the newest, not the biggest, just whatever the engine produced first. Every LIMIT should sit on top of an ORDER BY that defines what 'first' means. This is the most common junior-analyst bug in shared dashboards.",
        },
        {
          type: "expandable",
          title: "Where do NULLs sort?",
          content:
            "PostgreSQL treats NULL as larger than every value: NULLs come last in ASC and first in DESC. MySQL does the opposite (NULLs smallest). You can override explicitly with ORDER BY col DESC NULLS LAST (PostgreSQL, Oracle). If you rank customers by last_purchase_date DESC, customers who never purchased (NULL) will float to the top in PostgreSQL — NULLS LAST fixes the leaderboard.",
        },
        {
          type: "expandable",
          title: "Why deep OFFSET pagination gets slow",
          content:
            "OFFSET 100000 doesn't jump to row 100,001 — the database still produces and discards the first 100,000 sorted rows. Deep pages get progressively slower, and rows inserted between page loads shift results (page drift). High-scale systems use keyset pagination instead: remember the last row's sort key and query WHERE (created_at, id) < (:last_seen_at, :last_id) ORDER BY created_at DESC, id DESC LIMIT 20. Same page size, constant cost.",
        },
        {
          type: "keypoint",
          title: "Deterministic ordering needs a unique tie-breaker",
          content:
            "If your sort key has ties (many orders share a date), rows within a tie can come back in any order — and pagination can show a row twice or skip it. Append a unique column as the final key: ORDER BY created_at DESC, order_id DESC. Cheap insurance, always worth it.",
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
        title: "From Filtered Rows to a Top-N Answer",
        caption:
          "The pipeline position matters: sorting happens after filtering, and the cut happens last. Click each stage to see what it contributes.",
        nodes: [
          {
            id: "where",
            label: "WHERE",
            sublabel: "filter rows",
            detail:
              "Filtering runs first and shrinks the working set. Sorting fewer rows is cheaper — another reason to push predicates into SQL rather than sorting everything and filtering later.",
            x: 8,
            y: 40,
            accent: false,
          },
          {
            id: "select",
            label: "SELECT",
            sublabel: "compute columns",
            detail:
              "Output expressions and aliases are computed here. Because this happens before ORDER BY, the sort keys can reference aliases like line_total — something WHERE cannot do.",
            x: 30,
            y: 40,
            accent: false,
          },
          {
            id: "orderby",
            label: "ORDER BY",
            sublabel: "rank all survivors",
            detail:
              "The full surviving row set is sorted by your keys — primary key first, tie-breakers after. DESC per key, NULLS FIRST/LAST per key. The database may use an index to avoid a physical sort when one matches the requested order.",
            x: 54,
            y: 40,
            accent: true,
          },
          {
            id: "limit",
            label: "LIMIT",
            sublabel: "cut to N",
            detail:
              "Applied last: keep the first N rows of the sorted sequence. With ORDER BY it means 'top N by my definition'; without ORDER BY it means 'N arbitrary rows' — a correctness bug, not a style issue.",
            x: 76,
            y: 40,
            accent: true,
          },
          {
            id: "offset",
            label: "OFFSET",
            sublabel: "skip M first",
            detail:
              "Skips M sorted rows before LIMIT counts. Powers page N of a UI, but cost grows with depth because skipped rows are still produced. Keyset pagination is the constant-cost alternative.",
            x: 76,
            y: 75,
            accent: false,
          },
          {
            id: "result",
            label: "Top-N result",
            sublabel: "deterministic",
            detail:
              "With a unique tie-breaker in the sort keys, this result is fully reproducible: same data, same query, same rows in the same order — the property reports and tests depend on.",
            x: 94,
            y: 40,
            accent: false,
          },
        ],
        edges: [
          { from: "where", to: "select", label: "fewer rows" },
          { from: "select", to: "orderby", label: "aliases visible" },
          { from: "orderby", to: "limit", label: "sorted stream" },
          { from: "offset", to: "limit", label: "skip then keep" },
          { from: "limit", to: "result" },
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
          title: "Sort one column",
          scenario: "List products from cheapest to most expensive.",
          steps: [
            {
              code: "SELECT product_name, unit_price\nFROM products\nORDER BY unit_price;",
              explanation:
                "ASC is the default, so this sorts smallest-first. The rows themselves are untouched — ORDER BY only changes presentation order, never content.",
            },
          ],
          output:
            " product_name   | unit_price\n----------------+------------\n Webcam Cover   | 4.50\n Wireless Mouse | 25.00\n Laptop Stand   | 32.00\n USB-C Hub      | 49.50\n(4 rows)",
        },
        {
          difficulty: "Easy",
          title: "Top 3 orders by value",
          scenario: "Finance wants the three largest orders this quarter.",
          steps: [
            {
              code: "SELECT order_id, amount\nFROM orders\nWHERE created_at >= '2026-04-01'",
              explanation:
                "Filter to the quarter first — WHERE always narrows before sorting, so the sort works on the smallest possible set.",
            },
            {
              code: "ORDER BY amount DESC\nLIMIT 3;",
              explanation:
                "DESC puts the biggest amounts first, and LIMIT 3 keeps only those. Read the pair as one idiom: 'top 3 by amount'. Without the ORDER BY, LIMIT 3 would return three arbitrary orders.",
            },
          ],
          output:
            " order_id | amount\n----------+---------\n 1042     | 1250.00\n 1017     | 980.50\n 1033     | 610.00\n(3 rows)",
        },
        {
          difficulty: "Medium",
          title: "Multi-key sort with a tie-breaker",
          scenario:
            "Support wants open tickets sorted by priority (high first), and within each priority, oldest first — with a deterministic order even when timestamps collide.",
          steps: [
            {
              code: "SELECT ticket_id, priority, created_at\nFROM tickets\nWHERE status = 'open'\nORDER BY\n  CASE priority\n    WHEN 'high' THEN 1\n    WHEN 'medium' THEN 2\n    ELSE 3\n  END,",
              explanation:
                "Text priorities don't sort meaningfully alphabetically ('high' < 'low' < 'medium'), so a CASE expression maps them to sortable numbers — sorting by an expression is fully legal. (CASE gets its own lesson in the Advanced module.)",
            },
            {
              code: "  created_at ASC,\n  ticket_id ASC;",
              explanation:
                "Second key: oldest tickets first within each priority band. Third key: ticket_id as a unique tie-breaker so two tickets created in the same second always appear in the same order across runs — essential for stable pagination.",
            },
          ],
          output:
            " ticket_id | priority | created_at\n-----------+----------+---------------------\n 501       | high     | 2026-07-14 08:12:00\n 508       | high     | 2026-07-15 10:03:00\n 496       | medium   | 2026-07-13 17:40:00\n 502       | low      | 2026-07-14 09:00:00\n(4 rows)",
        },
        {
          difficulty: "Hard",
          title: "NULLs ruining a leaderboard",
          scenario:
            "Rank customers by most recent purchase. Customers who never purchased have last_purchase_date = NULL — and in PostgreSQL they land on top of the DESC sort.",
          steps: [
            {
              code: "SELECT name, last_purchase_date\nFROM customers\nORDER BY last_purchase_date DESC\nLIMIT 3;",
              explanation:
                "PostgreSQL sorts NULL as larger than every real value, so DESC puts the never-purchased customers first — the exact opposite of a 'most recent buyers' list. The bug is invisible until someone asks why the top buyer has no purchase date.",
            },
            {
              code: "SELECT name, last_purchase_date\nFROM customers\nORDER BY last_purchase_date DESC NULLS LAST\nLIMIT 3;",
              explanation:
                "NULLS LAST pins missing values to the bottom regardless of sort direction. Portable alternative when NULLS LAST isn't supported: ORDER BY (last_purchase_date IS NULL), last_purchase_date DESC — false sorts before true, pushing NULL rows down.",
            },
          ],
          output:
            " name  | last_purchase_date\n-------+--------------------\n Anna  | 2026-07-15\n Ben   | 2026-07-11\n Cara  | 2026-06-28\n(3 rows)",
        },
        {
          difficulty: "Industry Example",
          title: "Paginating an order-history API",
          scenario:
            "An e-commerce backend serves order history 20 rows per page, newest first. The v1 endpoint uses OFFSET; the team migrates to keyset pagination after page-100 latency complaints.",
          steps: [
            {
              code: "-- v1: page 6 (rows 101–120)\nSELECT order_id, created_at, amount\nFROM orders\nWHERE customer_id = 8421\nORDER BY created_at DESC, order_id DESC\nLIMIT 20 OFFSET 100;",
              explanation:
                "Correct but increasingly slow: the engine sorts and discards 100 rows to serve 20. The unique tie-breaker (order_id) prevents rows from jumping between pages when timestamps collide.",
            },
            {
              code: "-- v2: keyset — client sends the last row it saw\nSELECT order_id, created_at, amount\nFROM orders\nWHERE customer_id = 8421\n  AND (created_at, order_id) < ('2026-06-30 14:22:05', 90112)\nORDER BY created_at DESC, order_id DESC\nLIMIT 20;",
              explanation:
                "The row-value comparison (created_at, order_id) < (…) seeks directly past everything already shown, so every page costs the same. Trade-off: no 'jump to page 47', only next/previous — which is what infinite-scroll UIs need anyway.",
            },
          ],
          output:
            " order_id | created_at          | amount\n----------+---------------------+--------\n 90080    | 2026-06-29 09:15:11 | 64.00\n 90041    | 2026-06-27 18:02:47 | 129.99\n …        | …                   | …\n(20 rows)",
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
          "Build the 'Top spenders' widget: from orders (order_id, customer_id, amount, status), return order_id and amount for the 3 highest-value orders that are not cancelled. Biggest first; break exact-amount ties by lower order_id first. Fill in the blanks.",
        starterCode:
          "-- orders(order_id, customer_id, amount, status)\n-- Rows: (1, 10, 500.00, 'shipped'), (2, 11, 750.00, 'cancelled'),\n--       (3, 12, 300.00, 'shipped'), (4, 13, 500.00, 'pending'),\n--       (5, 14, 120.00, 'shipped')\n\nSELECT order_id, amount\nFROM orders\nWHERE status ___ 'cancelled'\nORDER BY amount ___, order_id ___\n___ 3;",
        solutionCode:
          "-- orders(order_id, customer_id, amount, status)\n-- Rows: (1, 10, 500.00, 'shipped'), (2, 11, 750.00, 'cancelled'),\n--       (3, 12, 300.00, 'shipped'), (4, 13, 500.00, 'pending'),\n--       (5, 14, 120.00, 'shipped')\n\nSELECT order_id, amount\nFROM orders\nWHERE status <> 'cancelled'\nORDER BY amount DESC, order_id ASC\nLIMIT 3;",
        expectedOutput:
          " order_id | amount\n----------+--------\n 1        | 500.00\n 4        | 500.00\n 3        | 300.00\n(3 rows)",
        hints: [
          "Four blanks: a not-equal comparison, two sort directions, and the row-count keyword.",
          "Biggest first means amount DESC; 'lower order_id first' among ties means order_id ASC.",
          "The keyword that keeps only the first N sorted rows is LIMIT.",
          "Order 2 is cancelled and excluded, so the top 3 are: order 1 (500, id 1 before id 4), order 4 (500), order 3 (300).",
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
          id: "sql04_mcq_01",
          difficulty: "Easy",
          question: "What order does ORDER BY use when you write neither ASC nor DESC?",
          options: [
            "Descending",
            "Ascending",
            "Insertion order",
            "Random order",
          ],
          correctIndex: 1,
          explanation:
            "ASC (smallest first) is the default in every major dialect, which is why you only ever see DESC written explicitly. Insertion order is what you might observe WITHOUT any ORDER BY — but it's never guaranteed. Random order describes unordered query results, not ORDER BY's default.",
        },
        {
          type: "mcq",
          id: "sql04_mcq_02",
          difficulty: "Easy",
          question:
            "Which query returns the 5 most recent orders?",
          options: [
            "SELECT * FROM orders LIMIT 5;",
            "SELECT * FROM orders ORDER BY created_at ASC LIMIT 5;",
            "SELECT * FROM orders ORDER BY created_at DESC LIMIT 5;",
            "SELECT TOP 5 * FROM orders;",
          ],
          correctIndex: 2,
          explanation:
            "'Most recent' means newest first — created_at DESC — and LIMIT 5 keeps them. Option A has no defined order, so it returns five arbitrary rows. Option B sorts oldest-first, returning the five OLDEST orders. Option D is SQL Server syntax and, even there, without ORDER BY it wouldn't define which five.",
        },
        {
          type: "mcq",
          id: "sql04_mcq_03",
          difficulty: "Medium",
          question:
            "For a 25-rows-per-page UI, which clause fetches page 4?",
          options: [
            "LIMIT 25 OFFSET 100",
            "LIMIT 25 OFFSET 75",
            "LIMIT 100 OFFSET 25",
            "LIMIT 25 OFFSET 4",
          ],
          correctIndex: 1,
          explanation:
            "Page 4 starts after skipping 3 full pages: OFFSET (4−1)×25 = 75, then LIMIT 25 keeps rows 76–100. OFFSET 100 would start at page 5. LIMIT 100 OFFSET 25 fetches four pages' worth of rows starting mid-page-2. OFFSET 4 skips four rows, not four pages.",
        },
        {
          type: "mcq",
          id: "sql04_mcq_04",
          difficulty: "Medium",
          question:
            "In PostgreSQL, ORDER BY last_login DESC on a column with NULLs puts the NULL rows…",
          options: [
            "Last, after all real dates",
            "First, before all real dates",
            "Wherever they were in the table",
            "PostgreSQL raises an error for NULL sort keys",
          ],
          correctIndex: 1,
          explanation:
            "PostgreSQL treats NULL as greater than any non-NULL value, so a DESC sort surfaces NULLs first — often the opposite of intent for 'most recent' lists; fix with NULLS LAST. 'Last' describes ASC behavior in PostgreSQL (or MySQL's DESC, since MySQL sorts NULLs smallest). Sort position is always deterministic per dialect, and NULL sort keys are legal, never an error.",
        },
        {
          type: "scenario",
          id: "sql04_sc_01",
          difficulty: "Hard",
          scenario:
            "A weekly report uses ORDER BY report_date DESC LIMIT 10 where many rows share the same report_date. Some weeks, a row appears on both page 1 and page 2 of the paginated export; other weeks a row is missing entirely.",
          question: "What is the root cause?",
          options: [
            "OFFSET is broken for DESC sorts; switch to ASC",
            "Ties on report_date leave row order undefined within the tie, so pages overlap or skip; add a unique tie-breaker column to ORDER BY",
            "LIMIT caches results between runs; add NOCACHE",
            "NULLs in report_date shift rows between pages",
          ],
          correctIndex: 1,
          explanation:
            "Within a group of tied sort keys the database may emit rows in different orders on different executions, so page boundaries slice the tie differently each run — producing duplicates on one export and gaps on another. Appending a unique key (ORDER BY report_date DESC, row_id DESC) makes the total order deterministic. OFFSET works identically for both directions. There is no LIMIT cache. NULLs would sort consistently at one end, not shuffle within ties.",
        },
        {
          type: "coding",
          id: "sql04_code_01",
          difficulty: "Hard",
          prompt:
            "The customers table has (customer_id, name, last_purchase_date) where last_purchase_date is NULL for prospects. Return name and last_purchase_date for the 2 most recent purchasers, with prospects excluded from the top by sorting NULLs last (do not filter them out with WHERE).",
          starterCode:
            "-- customers(customer_id, name, last_purchase_date)\n-- Rows: (1,'Anna','2026-07-15'), (2,'Ben', NULL), (3,'Cara','2026-06-28'), (4,'Dev','2026-07-11')\n\n",
          solutionCode:
            "SELECT name, last_purchase_date\nFROM customers\nORDER BY last_purchase_date DESC NULLS LAST\nLIMIT 2;",
          expectedOutput:
            " name | last_purchase_date\n------+--------------------\n Anna | 2026-07-15\n Dev  | 2026-07-11\n(2 rows)",
          tests: [
            {
              name: "NULL placement",
              description: "Ben (NULL) does not appear even though DESC would surface NULLs first by default",
            },
            {
              name: "No WHERE filter",
              description: "The solution uses NULLS LAST (or an IS NULL sort expression), not a WHERE clause",
            },
            {
              name: "Correct top 2",
              description: "Returns Anna then Dev, in that order",
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
            "Why is LIMIT without ORDER BY considered a bug in analytical queries?",
          answer:
            "Because relational tables are unordered sets: without ORDER BY, the engine returns rows in whatever order its access path produced — heap order, index order, or interleaved parallel-worker output — and that order isn't stable across runs, plans, or engine versions. LIMIT then keeps N essentially arbitrary rows while the query reads as if it returns a meaningful 'first N'. The failure mode is nasty: results look plausible, pass review, and then silently change after a vacuum, an index change, or a data reload. The rule I follow is that every LIMIT must sit on an ORDER BY that defines 'first', and if the sort key can tie, I add a unique tie-breaker so the result is fully deterministic.",
        },
        {
          question:
            "Your paginated endpoint gets slow on deep pages. Why, and what would you do about it?",
          answer:
            "OFFSET-based pagination does linear work in page depth: OFFSET 100000 forces the engine to generate and discard 100,000 sorted rows before returning the page, so latency grows with depth, and concurrent inserts shift rows between pages (drift, causing duplicates or gaps). The standard fix is keyset (cursor) pagination: sort by a deterministic key like (created_at DESC, id DESC), have the client pass back the last row's key, and fetch the next page with a row-value predicate — WHERE (created_at, id) < (:last_at, :last_id) — plus the same ORDER BY and LIMIT. Each page becomes an index seek with constant cost and no drift. The trade-off is losing random page access ('jump to page 47'), which most modern infinite-scroll UIs don't need. If random access is truly required, I'd cap the browsable depth or precompute page anchors.",
        },
        {
          question:
            "How do NULLs behave in ORDER BY, and how do you control it?",
          answer:
            "SQL doesn't define comparisons with NULL, so each engine picks a convention for sorting: PostgreSQL and Oracle treat NULL as the largest value (last in ASC, first in DESC), while MySQL and SQL Server treat it as the smallest. That difference bites in ranking queries — 'most recent purchase DESC' in PostgreSQL floats never-purchased customers to the top. The explicit controls are NULLS FIRST / NULLS LAST on each sort key where supported. Where they aren't, the portable idiom is to sort by an is-null flag first: ORDER BY (col IS NULL), col DESC — false sorts before true, pushing NULLs down. In interviews I'd add that this is a symptom of a broader habit: whenever a sorted column is nullable, decide deliberately where the NULLs go rather than accepting the engine default.",
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
        "1) Using LIMIT without ORDER BY and believing the rows are 'the first ones' — they're arbitrary. 2) Forgetting a unique tie-breaker, so paginated pages overlap or skip rows when sort keys tie. 3) Assuming NULLs sort the same everywhere — PostgreSQL puts them last in ASC, MySQL puts them first; pin it with NULLS FIRST/LAST. 4) Computing page offsets as page × size instead of (page − 1) × size, silently skipping the first page. 5) Sorting by a text column that holds numbers ('10' < '9' alphabetically) — cast to a numeric type before ordering.",
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
        "Try these prompts in the AI Tutor panel: • 'ELI5: why do tables have no natural order?' • 'Quiz me: give me five ORDER BY clauses and small tables — I'll predict the output order.' • 'Show me a page-drift bug with OFFSET and how keyset pagination avoids it.' • 'Explain NULLS FIRST vs NULLS LAST with a leaderboard example.' • 'Interview mode: ask me to design pagination for an orders API and critique my answer.'",
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
        "ORDER BY — clause that sorts the result set by one or more keys. ASC / DESC — ascending (default) and descending sort directions. Sort key — a column or expression used for ordering. Tie-breaker — a later sort key that orders rows equal on earlier keys. Deterministic order — a total ordering that is reproducible run to run; requires a unique key. LIMIT — keeps only the first N rows of the (sorted) result. OFFSET — skips M rows before LIMIT counts. Top-N query — the ORDER BY … DESC LIMIT N idiom. Pagination — serving results page by page via LIMIT/OFFSET or keyset. Keyset (cursor) pagination — pagination that seeks past the last seen sort key instead of counting an offset. NULLS FIRST / NULLS LAST — explicit control of where missing values sort. Page drift — rows moving between pages when data changes mid-pagination.",
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
        "• Docs: PostgreSQL manual — 'Sorting Rows (ORDER BY)' and 'LIMIT and OFFSET'. • Read: Use The Index, Luke's chapter on paging ('Fetching a result in chunks') for the definitive OFFSET-vs-keyset explanation. • Practice: take any orders-style table, write the top-5 query three ways (no order, DESC only, DESC + tie-breaker) and run each twice — watch which results are stable. • Next in DSM: you can rank and cut rows — Aggregate Functions teaches you to collapse them into counts, sums, and averages.",
    },

    /* ---------------------------------------------------------------- */
    /*  12 — Recap                                                       */
    /* ---------------------------------------------------------------- */
    {
      id: "recap",
      type: "recap",
      tocLabel: "Recap",
      content:
        "✓ Tables have no inherent order — ORDER BY is the only guarantee, and it runs after WHERE and SELECT.\n✓ Multiple sort keys work primary-then-tie-breaker; add a unique final key for deterministic results.\n✓ ORDER BY can reference SELECT aliases and expressions; WHERE cannot.\n✓ Top-N questions are ORDER BY … DESC LIMIT N — LIMIT without ORDER BY returns arbitrary rows.\n✓ NULL sort position differs by engine; pin it with NULLS FIRST / NULLS LAST.\n✓ LIMIT/OFFSET paginates but slows with depth and can drift; keyset pagination seeks past the last key at constant cost.\n\nNext up: Aggregate Functions. Sorting shows you the extremes — next you'll summarize entire tables into single numbers with COUNT, SUM, AVG, MIN, and MAX, and learn how NULLs sneak into every one of them.",
    },
  ],
};
