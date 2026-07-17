import type { Lesson } from "@/lib/curriculum/types";

export const leftAndRightJoins: Lesson = {
  meta: {
    id: "sql.joins.left-and-right-joins",
    slug: "left-and-right-joins",
    title: "LEFT & RIGHT JOINs",
    description:
      "Keep every row from one side of a join — matched or not — and understand the NULLs that fill the gaps.",
    estimatedTime: "30 mins",
    difficulty: "Intermediate",
    xpReward: 70,
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
        hook: "'Which customers have never ordered?' is one of the most valuable questions in analytics — those are the people your re-engagement campaign targets. An INNER JOIN literally cannot answer it: it drops exactly the rows you want. LEFT JOIN keeps them, and by the end of this lesson you'll know how to find what's missing, not only what matched.",
        what: "A LEFT JOIN (also called LEFT OUTER JOIN) returns every row from the left table. Where a right-table match exists, the columns are filled in as in an INNER JOIN; where no match exists, the right table's columns are filled with NULL. RIGHT JOIN is the mirror image: every row from the right table survives.",
        why: "Real datasets are full of legitimate non-matches: customers without orders, products never sold, employees with no manager, events with no signup. Outer joins let you keep those rows and even search for them — the anti-join pattern (LEFT JOIN ... WHERE right key IS NULL) is the standard tool for finding missing data.",
        whereUsed:
          "Churn and retention analysis, data-quality audits (which orders reference deleted products?), funnel reports where later stages may be empty, and any dashboard that must show 'zero' rather than omit a row entirely.",
        objectives: [
          "Write LEFT JOIN queries that preserve unmatched left-table rows with NULL fill",
          "Explain why filter placement — ON versus WHERE — changes LEFT JOIN results",
          "Apply the anti-join pattern (IS NULL) to find rows with no match",
          "Convert a RIGHT JOIN into an equivalent LEFT JOIN by swapping table order",
          "Distinguish a NULL produced by the join from a NULL stored in the data",
        ],
        realWorldApps: [
          {
            company: "Netflix",
            headline: "Finding subscribers who watched nothing",
            detail:
              "Retention teams LEFT JOIN the subscribers table to viewing events for the week. Subscribers with NULL on the events side watched nothing — the exact cohort that receives 'here's what's new' nudges before they churn.",
          },
          {
            company: "Amazon",
            headline: "Catalog items with zero sales",
            detail:
              "Marketplace analytics LEFT JOINs the product catalog to order lines to surface listings with no sales in 90 days. INNER JOIN would hide these items; the NULL-filled rows are what drives delisting and discount decisions.",
          },
          {
            company: "Salesforce",
            headline: "Leads that never converted",
            detail:
              "Pipeline reports LEFT JOIN leads to opportunities on lead_id. NULL opportunity columns mark leads that stalled — sales ops segments them by source to find which campaigns generate contacts that never turn into deals.",
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
            "A LEFT JOIN starts exactly like an INNER JOIN: it pairs left and right rows where the ON condition is true. Then it does one extra thing — every left row that found no partner is added back to the result, with NULL in every column that would have come from the right table.",
        },
        {
          type: "analogy",
          title: "The guest-list analogy",
          content:
            "A wedding planner prints the invitation list (left table) and matches it against RSVPs received (right table). The final seating report lists every invited guest: those who replied get their meal choice filled in; those who never replied still appear, with the meal column blank. Nobody invited is dropped from the report just because they went quiet. The blank cell is the join's NULL. Limitation of the analogy: an uninvited person who somehow RSVP'd (a right row with no left match) is dropped by a LEFT JOIN — keeping those too is what FULL OUTER JOIN does.",
        },
        {
          type: "keypoint",
          title: "Left keeps left; right keeps right",
          content:
            "LEFT JOIN preserves all rows of the table written before the JOIN keyword. RIGHT JOIN preserves all rows of the table written after it. Both are 'outer' joins — the word OUTER is optional (LEFT JOIN and LEFT OUTER JOIN are identical) — because they include rows outside the matched set.",
        },
        {
          type: "text",
          content:
            "The NULLs an outer join produces are structural: they mean 'no matching row existed', not 'a value was missing in the data'. This distinction matters when a right-table column can itself legitimately contain NULL. To test whether a match occurred, check the right table's join key (or primary key) for NULL — a key column is never NULL in a real matched row.",
        },
        {
          type: "warning",
          title: "The WHERE clause that silently un-outers your join",
          content:
            "Filtering a right-table column in WHERE destroys the LEFT JOIN's purpose. In WHERE o.status = 'shipped', unmatched customers have o.status = NULL, NULL = 'shipped' is not true, and those rows are eliminated — your LEFT JOIN now behaves like an INNER JOIN. To filter the right side while keeping unmatched left rows, move the condition into ON: LEFT JOIN orders o ON c.customer_id = o.customer_id AND o.status = 'shipped'. This ON-versus-WHERE distinction is the single most common outer-join bug in production SQL.",
        },
        {
          type: "code-note",
          code: "-- Anti-join: customers with NO orders\nSELECT c.customer_id, c.name\nFROM customers AS c\nLEFT JOIN orders AS o\n  ON c.customer_id = o.customer_id\nWHERE o.order_id IS NULL;",
          content:
            "The anti-join pattern: LEFT JOIN, then keep only the rows where the right side failed to match. We test o.order_id — orders' primary key — because a primary key is never NULL in a genuine matched row, so IS NULL cleanly means 'no order existed'. This is the idiomatic way to find missing counterparts, and interviewers ask for it constantly.",
        },
        {
          type: "expandable",
          title: "Why RIGHT JOIN is rare in practice",
          content:
            "Any RIGHT JOIN can be rewritten as a LEFT JOIN by swapping the table order: A RIGHT JOIN B equals B LEFT JOIN A. Because English readers scan queries top-to-bottom, most style guides standardise on 'the table whose rows you keep goes first, use LEFT JOIN'. RIGHT JOIN survives mainly in legacy code and in queries where reordering a long join chain would be disruptive. Dialect note: SQLite did not support RIGHT JOIN at all until version 3.39 (2022) — one more reason LEFT JOIN became the universal habit.",
        },
        {
          type: "keypoint",
          title: "Row-count rule for LEFT JOIN",
          content:
            "A LEFT JOIN returns at least one row per left-table row — never fewer. Matched left rows appear once per match (one-to-many still fans out, exactly as with INNER JOIN); unmatched left rows appear exactly once, NULL-filled. So: result rows = matched pairs + unmatched left rows.",
        },
        {
          type: "expandable",
          title: "COUNT(*) vs COUNT(column) after an outer join",
          content:
            "After a LEFT JOIN, COUNT(*) counts every result row — including NULL-filled ones — while COUNT(o.order_id) counts only rows where that column is not NULL, i.e. only real matches. This makes COUNT(o.order_id) the correct way to compute 'orders per customer' including zeros: customers with no orders contribute a row but not a count, yielding 0. Using COUNT(*) instead silently reports 1 for orderless customers — an off-by-one that has corrupted many retention dashboards.",
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
        title: "INNER vs LEFT vs RIGHT: Which Rows Survive?",
        caption:
          "The same two tables, three join types. Click each node to see exactly which rows appear and where the NULLs come from.",
        nodes: [
          {
            id: "tables",
            label: "Inputs",
            sublabel: "customers 5 · orders 6",
            detail:
              "customers: Alice, Ben, Chloe, Dev, Emma (Emma has no orders). orders: six rows, one of which (order 106) references customer_id 9 — no such customer. These two misfits are what distinguish the join types.",
            x: 50,
            y: 10,
            accent: false,
          },
          {
            id: "inner",
            label: "INNER JOIN",
            sublabel: "5 rows",
            detail:
              "Only matched pairs: Alice×2, Ben, Chloe, Dev. Emma is gone (no orders); order 106 is gone (no customer). Use when non-matches are irrelevant or invalid for the question.",
            x: 18,
            y: 45,
            accent: false,
          },
          {
            id: "left",
            label: "LEFT JOIN",
            sublabel: "6 rows",
            detail:
              "All 5 matched pairs PLUS Emma, with NULL in every order column. Row math: 5 matches + 1 unmatched left row = 6. Order 106 is still dropped — it lives on the right side. Use when the left table is your 'universe' (all customers).",
            x: 50,
            y: 50,
            accent: true,
          },
          {
            id: "right",
            label: "RIGHT JOIN",
            sublabel: "6 rows",
            detail:
              "All 5 matched pairs PLUS order 106, with NULL in every customer column. Emma is dropped. Identical to swapping the tables and writing LEFT JOIN — which is how most teams would actually write it.",
            x: 82,
            y: 45,
            accent: false,
          },
          {
            id: "antijoin",
            label: "Anti-join",
            sublabel: "WHERE o.order_id IS NULL",
            detail:
              "Filter the LEFT JOIN result to rows where the right key is NULL: only Emma remains. This answers 'which customers never ordered?' — the question INNER JOIN cannot ask. The mirror version on a RIGHT JOIN finds orphaned orders like 106.",
            x: 50,
            y: 85,
            accent: false,
          },
        ],
        edges: [
          { from: "tables", to: "inner", label: "keep matches only" },
          { from: "tables", to: "left", label: "keep all left rows" },
          { from: "tables", to: "right", label: "keep all right rows" },
          { from: "left", to: "antijoin", label: "IS NULL filter" },
          { from: "right", to: "left", label: "swap tables ≡" },
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
          title: "All customers, orders if any",
          scenario:
            "The bookshop from last lesson: 5 customers, 5 orders. Emma has never ordered. Marketing wants the full customer list with order ids where they exist.",
          steps: [
            {
              code: "SELECT c.name, o.order_id\nFROM customers AS c\nLEFT JOIN orders AS o\n  ON c.customer_id = o.customer_id;",
              explanation:
                "Identical shape to an INNER JOIN — only the keyword changes. Row-count reasoning: Alice matches 3 orders (3 rows), Ben 1, Chloe 1; that's 5 matched pairs. Emma matches nothing, so LEFT JOIN adds her back once with order_id = NULL. Dev? He isn't in this smaller dataset. Total: 5 + 1 = 6 rows — never fewer rows than the left table has.",
            },
          ],
          output:
            " name  | order_id\n-------+----------\n Alice |      101\n Alice |      104\n Alice |      105\n Ben   |      102\n Chloe |      103\n Emma  |     NULL\n(6 rows)",
        },
        {
          difficulty: "Easy",
          title: "The anti-join: who never ordered?",
          scenario:
            "The re-engagement campaign needs exactly the customers with zero orders — nothing else.",
          steps: [
            {
              code: "SELECT c.customer_id, c.name\nFROM customers AS c\nLEFT JOIN orders AS o\n  ON c.customer_id = o.customer_id",
              explanation:
                "Start from the LEFT JOIN we already understand: 6 rows, with Emma's order columns NULL-filled because no order matched her.",
            },
            {
              code: "WHERE o.order_id IS NULL;",
              explanation:
                "IS NULL is the correct NULL test (= NULL never works — comparing to NULL yields unknown). We test o.order_id, the orders primary key, because it cannot be NULL in a genuinely matched row; NULL there can only mean 'the join found nothing'. Row-count reasoning: 6 joined rows → 5 matched rows fail the IS NULL test → 1 row remains. This LEFT JOIN + IS NULL combination is called an anti-join.",
            },
          ],
          output:
            " customer_id | name\n-------------+------\n           5 | Emma\n(1 row)",
        },
        {
          difficulty: "Medium",
          title: "ON vs WHERE: the filter that changes everything",
          scenario:
            "Finance wants ALL customers listed, but only their shipped orders shown next to them. A colleague's first attempt made half the customer list vanish.",
          steps: [
            {
              code: "-- BROKEN: filter in WHERE\nSELECT c.name, o.order_id, o.status\nFROM customers AS c\nLEFT JOIN orders AS o\n  ON c.customer_id = o.customer_id\nWHERE o.status = 'shipped';",
              explanation:
                "Suppose only orders 101 and 102 are shipped. The join produces 6 rows; then WHERE tests o.status = 'shipped'. Emma's row has status NULL, and NULL = 'shipped' is not true — she is eliminated, along with every customer whose orders are all unshipped. Row count: 6 → 2. The LEFT JOIN has silently degraded into an INNER JOIN.",
            },
            {
              code: "-- CORRECT: filter in ON\nSELECT c.name, o.order_id, o.status\nFROM customers AS c\nLEFT JOIN orders AS o\n  ON c.customer_id = o.customer_id\n AND o.status = 'shipped';",
              explanation:
                "Moving the condition into ON changes what counts as a match: only shipped orders can pair with a customer. Customers with no shipped orders become unmatched — and LEFT JOIN keeps unmatched left rows, NULL-filled. Row-count reasoning: 2 matched pairs (Alice-101, Ben-102) + 3 customers with no shipped orders kept as NULL rows = 5 rows. Every customer appears, which is what 'ALL customers' meant.",
            },
          ],
          output:
            " name  | order_id | status\n-------+----------+---------\n Alice |      101 | shipped\n Ben   |      102 | shipped\n Chloe |     NULL | NULL\n Dev   |     NULL | NULL\n Emma  |     NULL | NULL\n(5 rows)",
        },
        {
          difficulty: "Hard",
          title: "Orders per customer — including the zeros",
          scenario:
            "A retention dashboard must show every customer's order count. Customers with zero orders are the whole point, so they must show 0, not disappear.",
          steps: [
            {
              code: "SELECT c.name,\n       COUNT(o.order_id) AS order_count\nFROM customers AS c\nLEFT JOIN orders AS o\n  ON c.customer_id = o.customer_id",
              explanation:
                "The crucial detail is COUNT(o.order_id), not COUNT(*). COUNT(column) skips NULLs: Emma's single NULL-filled row contributes zero to the count. COUNT(*) would count that row and report 1 — a subtle lie that survives casual review because most customers' numbers look right.",
            },
            {
              code: "GROUP BY c.name\nORDER BY order_count DESC;",
              explanation:
                "Row-count reasoning: 6 joined rows (5 matched + Emma's NULL row) collapse into 4 groups — one per customer present. Alice's 3 matched rows count 3; Emma's NULL row groups alone and counts 0. LEFT JOIN guaranteed her a seat at the GROUP BY; COUNT(o.order_id) guaranteed her count is honest.",
            },
          ],
          output:
            " name  | order_count\n-------+-------------\n Alice |           3\n Ben   |           1\n Chloe |           1\n Emma  |           0\n(4 rows)",
        },
        {
          difficulty: "Industry Example",
          title: "Data-quality audit: orphaned order lines",
          scenario:
            "A data engineer at an online retailer suspects the ETL pipeline is loading order_items rows that reference deleted products. Finance needs to know how much revenue sits on these 'orphaned' lines before the fix ships.",
          steps: [
            {
              code: "SELECT oi.order_id,\n       oi.product_id,\n       oi.quantity * oi.unit_price AS line_revenue\nFROM order_items AS oi\nLEFT JOIN products AS p\n  ON oi.product_id = p.product_id\nWHERE p.product_id IS NULL;",
              explanation:
                "This is the anti-join pointed at referential integrity: keep every order line (left side = the table being audited), attach its product if one exists, then keep only lines where no product matched. We test p.product_id — the products primary key — so NULL unambiguously means 'missing product', even if other product columns are nullable. Row-count reasoning: 9 order lines → suppose 7 match a live product → 2 orphans remain.",
            },
            {
              code: "-- Summarise the damage for the incident report\nSELECT COUNT(*) AS orphan_lines,\n       SUM(oi.quantity * oi.unit_price) AS revenue_at_risk\nFROM order_items AS oi\nLEFT JOIN products AS p\n  ON oi.product_id = p.product_id\nWHERE p.product_id IS NULL;",
              explanation:
                "The same anti-join, aggregated to a single row for the stakeholder summary. Note the direction of the LEFT JOIN: the table you are auditing goes on the left, because its rows must all survive the join to be testable. Had we LEFT JOINed products to order_items instead, we would be auditing products with no sales — a different (also useful) question.",
            },
          ],
          output:
            " orphan_lines | revenue_at_risk\n--------------+-----------------\n            2 |          104.97\n(1 row)",
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
          "products has product_id, name, category. order_items has item_id, order_id, product_id, quantity. Write a query listing EVERY product with its total units sold as units_sold — products never sold must show 0. Sort by units_sold ascending so the dead stock rises to the top.",
        starterCode:
          "SELECT p.name,\n       ___(oi.quantity), 0) AS units_sold\nFROM products AS p\n___ JOIN order_items AS oi\n  ON ___ = ___\nGROUP BY p.name\nORDER BY units_sold ___;",
        solutionCode:
          "SELECT p.name,\n       COALESCE(SUM(oi.quantity), 0) AS units_sold\nFROM products AS p\nLEFT JOIN order_items AS oi\n  ON p.product_id = oi.product_id\nGROUP BY p.name\nORDER BY units_sold ASC;",
        expectedOutput:
          " name            | units_sold\n-----------------+------------\n Desk Lamp       |          0\n Yoga Mat        |          0\n USB-C Cable     |          3\n Coffee Grinder  |          5\n Noise-Cancelling Headphones |          8\n(5 rows)",
        hints: [
          "Products with no sales must survive the join, so the join type is LEFT JOIN with products on the left.",
          "The ON condition matches p.product_id with oi.product_id.",
          "SUM over an all-NULL group returns NULL, not 0 — wrap it in COALESCE(..., 0) to display a zero.",
          "Dead stock first means the smallest counts on top: ORDER BY units_sold ASC.",
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
          id: "sql08_mcq_01",
          difficulty: "Easy",
          question:
            "In a LEFT JOIN from customers to orders, what appears in the order columns for a customer with no orders?",
          options: [
            "The customer is excluded from the result",
            "Zeros in numeric columns, empty strings in text columns",
            "NULL in every order column",
            "The previous row's values are carried down",
          ],
          correctIndex: 2,
          explanation:
            "Unmatched left rows are kept with NULL — SQL's marker for 'no value exists' — in every right-table column. Option A describes INNER JOIN behaviour. Option B confuses NULL with default values; SQL never invents zeros or empty strings. Option D describes spreadsheet fill-down, which has no SQL equivalent in a join.",
        },
        {
          type: "mcq",
          id: "sql08_mcq_02",
          difficulty: "Easy",
          question: "Which query is equivalent to `orders RIGHT JOIN customers ON ...`?",
          options: [
            "customers LEFT JOIN orders ON ... (same condition)",
            "customers INNER JOIN orders ON ... (same condition)",
            "orders LEFT JOIN customers ON ... (same condition)",
            "There is no equivalent — RIGHT JOIN is unique",
          ],
          correctIndex: 0,
          explanation:
            "A RIGHT JOIN preserves all rows of the right table (customers here); swapping the table order and using LEFT JOIN preserves the same table and yields identical rows. Option B loses unmatched customers. Option C preserves orders instead of customers — the opposite table. Option D is false, and the equivalence is exactly why RIGHT JOIN is rarely used: teams standardise on LEFT.",
        },
        {
          type: "mcq",
          id: "sql08_mcq_03",
          difficulty: "Medium",
          question:
            "customers has 8 rows; 6 of them have orders (14 orders total among them). How many rows does `customers LEFT JOIN orders ON customer_id` return?",
          options: ["8", "14", "16", "22"],
          correctIndex: 2,
          explanation:
            "LEFT JOIN rows = matched pairs + unmatched left rows = 14 + 2 = 16. The 14 orders each produce one matched row; the 2 orderless customers each produce one NULL-filled row. 8 forgets that one-to-many still fans out matched customers. 14 forgets the unmatched customers. 22 wrongly adds all 8 customers on top of the 14 matches, double-counting the 6 matched customers.",
        },
        {
          type: "scenario",
          id: "sql08_sc_01",
          difficulty: "Medium",
          scenario:
            "An analyst writes: SELECT c.name FROM customers c LEFT JOIN orders o ON c.customer_id = o.customer_id WHERE o.order_date >= '2026-01-01'. She expects all customers, with recent orders where they exist — but customers without recent orders are missing.",
          question: "Why, and what is the fix?",
          options: [
            "LEFT JOIN cannot be combined with WHERE; remove the filter",
            "The date filter in WHERE removes NULL-filled rows; move it into the ON clause",
            "The date literal needs a CAST before comparison will work",
            "She should use RIGHT JOIN so customers are preserved",
          ],
          correctIndex: 1,
          explanation:
            "For customers with no recent orders, o.order_date is NULL after the join; NULL >= '2026-01-01' is unknown, so WHERE drops them — degrading the LEFT JOIN into an INNER JOIN. Moving the condition into ON makes 'a match' mean 'a recent order', keeping match-less customers as NULL rows. Option A: WHERE works fine with LEFT JOIN for left-table filters. Option C: the comparison works; the rows are removed by NULL logic, not a type error. Option D: customers are already the preserved (left) side — the join direction isn't the problem.",
        },
        {
          type: "scenario",
          id: "sql08_sc_02",
          difficulty: "Hard",
          scenario:
            "A churn report computes COUNT(*) per customer after LEFT JOINing customers to orders, and claims every customer has at least 1 order — even ones known to have none.",
          question: "What is wrong?",
          options: [
            "The LEFT JOIN dropped orderless customers, skewing the average",
            "COUNT(*) counts the NULL-filled row itself; COUNT(o.order_id) would correctly report 0",
            "GROUP BY merged distinct customers who share a name",
            "The orders table contains duplicate order ids",
          ],
          correctIndex: 1,
          explanation:
            "An orderless customer still produces one result row (NULL-filled), and COUNT(*) counts rows regardless of content — reporting 1. COUNT(o.order_id) skips NULLs and reports the honest 0. Option A is backwards: LEFT JOIN kept those customers; that's why they show up at all. Option C is possible in sloppy queries but wouldn't create the systematic 'minimum 1' pattern described. Option D would inflate counts for customers who have orders, not manufacture counts for those who don't.",
        },
        {
          type: "coding",
          id: "sql08_code_01",
          difficulty: "Hard",
          prompt:
            "Using customers (customer_id, name) and orders (order_id, customer_id, order_date), write an anti-join returning the name of every customer who has NO orders at all. Return names only, sorted alphabetically.",
          starterCode:
            "-- customers: customer_id, name\n-- orders: order_id, customer_id, order_date\nSELECT ___\nFROM ___\n",
          solutionCode:
            "SELECT c.name\nFROM customers AS c\nLEFT JOIN orders AS o\n  ON c.customer_id = o.customer_id\nWHERE o.order_id IS NULL\nORDER BY c.name;",
          expectedOutput: " name\n------\n Emma\n Omar\n(2 rows)",
          tests: [
            {
              name: "LEFT JOIN direction",
              description:
                "customers must be the left (preserved) table, joined to orders on customer_id",
            },
            {
              name: "Anti-join filter",
              description:
                "WHERE tests a non-nullable orders column (order_id) with IS NULL — not = NULL",
            },
            {
              name: "Output shape",
              description: "Names only, alphabetically: Emma, then Omar",
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
            "When would you choose a LEFT JOIN over an INNER JOIN? Give a concrete example.",
          answer:
            "I choose a LEFT JOIN whenever the left table defines the population I must report on in full, and the right table only enriches it. A concrete example: a retention dashboard listing every customer with their order count. With an INNER JOIN, customers who never ordered vanish — and they are the most important rows for retention work. With a LEFT JOIN they survive as NULL-filled rows, and COUNT(o.order_id) turns those NULLs into honest zeros. The decision rule I use is to ask 'should a non-match appear in the output?': if yes, outer join; if a non-match is meaningless or invalid for the question, inner join. I also flag that the choice is a business decision that changes totals, so it belongs in the analysis write-up, not buried in the SQL.",
        },
        {
          question:
            "Explain why putting a right-table filter in WHERE can break a LEFT JOIN, and where the filter should go instead.",
          answer:
            "The LEFT JOIN runs first and fills right-table columns with NULL for unmatched left rows. WHERE then evaluates its condition on every result row — and any ordinary comparison against NULL, like o.status = 'shipped', evaluates to unknown, which WHERE treats as failure. So exactly the NULL-filled rows the outer join worked to preserve get discarded, and the query silently behaves like an INNER JOIN. The fix is to move right-table filters into the ON clause: LEFT JOIN orders o ON c.id = o.customer_id AND o.status = 'shipped'. That redefines what counts as a match, so customers with no shipped orders remain in the result as NULL rows. Filters on the left table, by contrast, belong in WHERE, since left rows are never NULL-filled by their own join. One legitimate exception exists: when the WHERE condition is IS NULL on a right-side key, discarding matches is the point — that is the anti-join pattern.",
        },
        {
          question:
            "How would you find rows in table A that have no corresponding row in table B, and what NULL subtlety must you watch for?",
          answer:
            "The standard pattern is an anti-join: LEFT JOIN A to B on the key, then WHERE B.key IS NULL keeps only the A rows that found no partner. The subtlety is choosing which B column to test. It must be a column that can never be NULL in a genuine B row — ideally B's primary key or the join key itself. If you test a nullable column like B.shipped_date, a real matched row that happens to have a NULL shipped date would masquerade as a non-match, corrupting the result. A second subtlety is writing IS NULL rather than = NULL, since = NULL is never true under SQL's three-valued logic. Alternatives to the anti-join include NOT EXISTS with a correlated subquery — which many engines optimise identically and which sidesteps the column-choice trap — and NOT IN, which I avoid because a single NULL in the subquery's result makes NOT IN return no rows at all.",
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
        "1) Filtering a right-table column in WHERE after a LEFT JOIN — NULL-filled rows fail the comparison and the join silently degrades to INNER; put right-side filters in ON. 2) Writing = NULL instead of IS NULL in the anti-join — = NULL is never true, so the filter matches nothing. 3) Using COUNT(*) instead of COUNT(right_column) after an outer join — orderless customers get counted as 1 instead of 0. 4) Testing a nullable right-table column for the anti-join — a matched row with a legitimately NULL value looks like a non-match; always test the right table's key. 5) Assuming LEFT JOIN cannot change row counts — matched left rows still fan out one-to-many; only unmatched rows are guaranteed to appear exactly once.",
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
        "Try these prompts in the AI Tutor panel: • 'ELI5: what does the NULL in a LEFT JOIN result actually mean?' • 'Quiz me: give me table sizes and match counts, and I'll predict LEFT JOIN row counts.' • 'Show me the ON vs WHERE bug with a tiny dataset and walk through why the rows vanish.' • 'Explain the anti-join pattern with a fresh analogy, then ask me to write one.' • 'Interview mode: ask me when I'd use LEFT JOIN vs NOT EXISTS and grade my answer.'",
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
        "LEFT JOIN (LEFT OUTER JOIN) — returns all left-table rows; unmatched ones get NULL in right-table columns. RIGHT JOIN — the mirror: all right-table rows survive. Outer join — any join that preserves unmatched rows from at least one side. NULL fill — the structural NULLs an outer join places in columns of the missing side. Unmatched row — a row whose key finds no partner under the ON condition. Anti-join — LEFT JOIN + WHERE right_key IS NULL: rows with no counterpart. Semi-join — returning left rows that DO have a match, without duplicating them (often via EXISTS). Preserved side — the table whose rows are guaranteed to appear (left for LEFT JOIN). Three-valued logic — SQL's true/false/unknown system; comparisons with NULL yield unknown. COALESCE — returns its first non-NULL argument; used to turn join NULLs into displayable defaults like 0.",
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
        "• Docs: PostgreSQL manual, 'Joined Tables' under SELECT — the precise semantics of LEFT/RIGHT/FULL and of conditions in ON. • Read: 'The three-valued logic of SQL' (any solid treatment of NULL comparisons) — it explains every 'my WHERE ate my rows' bug you will ever hit. • Practice: take the customers/orders tables from this lesson, write the ON-filter and WHERE-filter versions of the same query, and diff the outputs until the difference feels obvious. • Next in DSM: FULL OUTER JOIN — keeping the unmatched rows from BOTH sides at once, the tool for reconciling two systems that should agree but don't.",
    },

    /* ---------------------------------------------------------------- */
    /*  12 — Recap                                                       */
    /* ---------------------------------------------------------------- */
    {
      id: "recap",
      type: "recap",
      tocLabel: "Recap",
      content:
        "✓ LEFT JOIN keeps every left-table row: matched rows pair up as usual, unmatched rows appear once with NULL in all right-table columns.\n✓ RIGHT JOIN mirrors LEFT JOIN; swap the table order and you never need it — and some engines (old SQLite) historically lacked it.\n✓ Result rows = matched pairs + unmatched left rows; one-to-many matches still fan out.\n✓ Right-table filters belong in ON, not WHERE — a WHERE filter on the right side silently turns your outer join into an inner one.\n✓ The anti-join (LEFT JOIN + WHERE right_key IS NULL) finds rows with no counterpart; always test a non-nullable key column.\n✓ COUNT(right_column) — not COUNT(*) — gives honest zeros for unmatched rows; COALESCE turns NULL sums into 0.\n\nNext up: FULL OUTER JOIN. LEFT JOIN chose a side to preserve — next you'll keep the unmatched rows from both tables simultaneously, the pattern behind every 'reconcile system A against system B' audit.",
    },
  ],
};
