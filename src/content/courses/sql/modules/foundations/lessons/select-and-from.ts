import type { Lesson } from "@/lib/curriculum/types";

export const selectAndFrom: Lesson = {
  meta: {
    id: "sql.foundations.select-and-from",
    slug: "select-and-from",
    title: "SELECT & FROM",
    description:
      "Write your first real queries: choose columns with SELECT, name the table with FROM, rename outputs with aliases, and de-duplicate with DISTINCT.",
    estimatedTime: "25 mins",
    difficulty: "Beginner",
    xpReward: 50,
    prerequisites: ["sql.foundations.what-is-a-database"],
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
        hook: "A production orders table can hold 40 columns and half a billion rows — but the report your manager wants needs exactly three columns. SELECT is how you carve precisely what you need out of a mountain of data, and it's the single most-typed word in any data career. By the end of this lesson you'll be writing queries that pick columns, compute new ones, rename them cleanly, and strip out duplicates.",
        what: "SELECT names the columns you want back; FROM names the table to read them from. Together they form the smallest complete SQL query. Aliases (AS) rename columns in your output, and DISTINCT removes duplicate rows from the result.",
        why: "Pulling every column of every row wastes time, memory, and money — cloud warehouses literally bill by data scanned. Choosing exactly the columns you need (called projection) makes queries faster, cheaper, and easier to read.",
        whereUsed:
          "Every dashboard tile, every report, every machine-learning training set starts with a SELECT. It is the verb of data analysis.",
        objectives: [
          "Write SELECT ... FROM queries that return specific columns from a table",
          "Explain what projection means and why SELECT * is discouraged in production",
          "Compute derived columns with arithmetic expressions inside SELECT",
          "Rename columns and expressions using AS aliases",
          "Apply DISTINCT to remove duplicate rows from a result",
        ],
        realWorldApps: [
          {
            company: "Netflix",
            headline: "Selecting features for recommendations",
            detail:
              "Netflix analysts query viewing-history tables with billions of rows, selecting just the columns a model needs — profile_id, title_id, watch_seconds — rather than dragging entire rows across the network.",
          },
          {
            company: "Airbnb",
            headline: "Listing quality dashboards",
            detail:
              "Airbnb's internal dashboards run SELECT queries against listings data, projecting price, rating, and location columns and aliasing computed fields like nightly_revenue for clean chart labels.",
          },
          {
            company: "DoorDash",
            headline: "Distinct active merchants",
            detail:
              "DoorDash measures marketplace health with queries like SELECT DISTINCT store_id FROM deliveries — collapsing millions of delivery rows into the unique set of stores that fulfilled at least one order.",
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
            "A SQL query is a request for data, and its two mandatory parts are SELECT and FROM. FROM names the table to read; SELECT lists the columns to return, separated by commas. Choosing a subset of columns has a formal name: projection — you project the table onto just the columns you care about.",
        },
        {
          type: "analogy",
          title: "The restaurant-order analogy",
          content:
            "Querying a table is like ordering at a restaurant. FROM is choosing the restaurant (which table), and SELECT is your order (which dishes/columns). Saying SELECT * is telling the kitchen 'bring me everything on the menu' — occasionally useful for exploring, wasteful and slow as a habit. The analogy breaks down in one way: the database never runs out of stock — it returns every matching row, every time.",
        },
        {
          type: "code-note",
          code: "-- customers(customer_id, name, email, country, signup_date)\nSELECT name, country\nFROM customers;",
          content:
            "This asks for exactly two columns from the customers table. The result is itself a table — same number of rows as customers, but only two columns wide. Column order in your output follows the order you list them in SELECT, not their order in the table.",
        },
        {
          type: "keypoint",
          title: "The result of a query is a table",
          content:
            "Every SELECT returns rows and columns — a temporary result table. This is why SQL composes so well: anything that produces a table can feed something that consumes one. That idea powers subqueries and CTEs later in the course.",
        },
        {
          type: "text",
          content:
            "SELECT can do more than copy columns — it can compute. Write an arithmetic expression using column names and SQL evaluates it for every row. This is how derived values like revenue (quantity * unit_price) are born, without changing anything in the stored table.",
        },
        {
          type: "code-note",
          code: "-- order_items(order_item_id, order_id, product_id, quantity, unit_price)\nSELECT\n  order_id,\n  quantity * unit_price AS line_revenue\nFROM order_items;",
          content:
            "quantity * unit_price is computed per row. AS line_revenue gives the computed column a readable name — an alias. Without the alias, PostgreSQL would label the column '?column?', which helps nobody reading your report. The AS keyword itself is optional (quantity * unit_price line_revenue also works), but writing it makes the intent unmissable.",
        },
        {
          type: "keypoint",
          title: "DISTINCT removes duplicate rows",
          content:
            "SELECT DISTINCT country FROM customers returns each country once, no matter how many customers live there. DISTINCT applies to the whole selected row: SELECT DISTINCT country, city de-duplicates on the combination — two rows survive if they differ in either column.",
        },
        {
          type: "expandable",
          title: "Why SELECT is written first but runs last",
          content:
            "SQL reads like English but executes in a different order. Conceptually the database first evaluates FROM (find the table), then WHERE (filter rows — next lesson), then GROUP BY and HAVING (later lessons), and only then SELECT (project the columns), followed by ORDER BY and LIMIT. Keeping this logical order in mind explains many rules you'll meet later — for example, why a column alias defined in SELECT can't be used in WHERE: the alias doesn't exist yet when WHERE runs.",
        },
        {
          type: "warning",
          title: "SELECT * in production code",
          content:
            "SELECT * is fine for exploring a new table interactively. In saved queries, dashboards, and pipelines it's a liability: it scans and transfers columns you don't need (cloud warehouses like BigQuery bill by bytes scanned), and if someone adds a column to the table, your downstream code silently receives a different shape of data. List your columns explicitly.",
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
        title: "Anatomy of a SELECT Query",
        caption:
          "Click each stage to see what it contributes. The query flows from the full stored table to your trimmed, renamed, de-duplicated result.",
        nodes: [
          {
            id: "table",
            label: "FROM customers",
            sublabel: "full table",
            detail:
              "The starting point: the stored table with all rows and all columns. FROM tells the database which table (or later, which combination of tables) to read.",
            x: 10,
            y: 50,
            accent: false,
          },
          {
            id: "project",
            label: "SELECT name, country",
            sublabel: "projection",
            detail:
              "Projection keeps only the listed columns, in the order you list them. Every row survives — only the width of the result changes.",
            x: 38,
            y: 50,
            accent: true,
          },
          {
            id: "compute",
            label: "expressions",
            sublabel: "quantity * unit_price",
            detail:
              "SELECT can compute new columns per row using arithmetic (+ - * /) and functions. The stored table is never modified — computed columns exist only in the result.",
            x: 38,
            y: 15,
            accent: false,
          },
          {
            id: "alias",
            label: "AS alias",
            sublabel: "rename",
            detail:
              "AS renames a column or expression in the output: quantity * unit_price AS line_revenue. Essential for computed columns, and for making dashboard labels human-readable.",
            x: 66,
            y: 50,
            accent: false,
          },
          {
            id: "distinct",
            label: "DISTINCT",
            sublabel: "de-duplicate",
            detail:
              "DISTINCT collapses identical result rows into one. It compares the entire selected row — all listed columns together — not just the first column.",
            x: 66,
            y: 85,
            accent: false,
          },
          {
            id: "result",
            label: "Result",
            sublabel: "a new table",
            detail:
              "The output is itself a table of rows and columns — ready to feed a chart, a report, an export, or another query.",
            x: 90,
            y: 50,
            accent: false,
          },
        ],
        edges: [
          { from: "table", to: "project", label: "all rows in" },
          { from: "compute", to: "project", label: "adds columns" },
          { from: "project", to: "alias", label: "rename" },
          { from: "alias", to: "distinct", label: "optional" },
          { from: "alias", to: "result", label: "" },
          { from: "distinct", to: "result", label: "unique rows" },
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
          title: "Select two columns",
          scenario:
            "The marketing team wants a simple list of customer names and countries for a newsletter segment.",
          steps: [
            {
              code: "SELECT name, country\nFROM customers;",
              explanation:
                "SELECT lists the two columns marketing asked for, separated by a comma. FROM names the table. The semicolon ends the statement.",
            },
            {
              code: "-- Result has every customer (all rows)\n-- but only 2 of the 5 columns.",
              explanation:
                "Projection changes the width of the result, never the number of rows. Email, IDs, and signup dates stay out of the export — good practice when sharing data.",
            },
          ],
          output:
            " name  | country\n-------+---------\n Amara | Nigeria\n Wei   | China\n Priya | India\n Jamal | Egypt\n Alice | Canada\n(5 rows)",
        },
        {
          difficulty: "Easy",
          title: "Reorder and alias columns",
          scenario:
            "A report template needs the country first and the customer's name under the header 'customer'.",
          steps: [
            {
              code: "SELECT country, name AS customer\nFROM customers;",
              explanation:
                "Output columns follow SELECT order — country now comes first. AS customer renames the name column in the result only; the stored table is untouched.",
            },
            {
              code: "-- Alias with a space needs double quotes:\nSELECT name AS \"Customer Name\"\nFROM customers;",
              explanation:
                "If an alias contains spaces or capital letters you want preserved, wrap it in double quotes. Note the distinction: in standard SQL, single quotes make text values, double quotes make identifiers (column and table names).",
            },
          ],
          output:
            " country | customer\n---------+----------\n Nigeria | Amara\n China   | Wei\n India   | Priya\n Egypt   | Jamal\n Canada  | Alice\n(5 rows)",
        },
        {
          difficulty: "Medium",
          title: "Compute a derived column",
          scenario:
            "Finance wants line-level revenue for each order item: quantity times unit price, labeled clearly.",
          steps: [
            {
              code: "-- order_items sample:\n-- order_item_id | order_id | product_id | quantity | unit_price\n-- 1             | 101      | 3          | 2        | 39.99\n-- 2             | 101      | 1          | 1        | 4.50\n-- 3             | 102      | 2          | 3        | 24.00",
              explanation:
                "Three item rows across two orders. Revenue per line isn't stored anywhere — we'll compute it on the fly.",
            },
            {
              code: "SELECT\n  order_id,\n  quantity,\n  unit_price,\n  quantity * unit_price AS line_revenue\nFROM order_items;",
              explanation:
                "The expression quantity * unit_price runs once per row. The alias line_revenue names the result column. Listing quantity and unit_price alongside it lets a reviewer verify the math at a glance.",
            },
            {
              code: "-- 2 * 39.99 = 79.98\n-- 1 * 4.50  = 4.50\n-- 3 * 24.00 = 72.00",
              explanation:
                "Row-by-row evaluation: each row's own quantity and unit_price feed the formula. Nothing was written to the database — computed columns live only in the query result.",
            },
          ],
          output:
            " order_id | quantity | unit_price | line_revenue\n----------+----------+------------+--------------\n 101      | 2        | 39.99      | 79.98\n 101      | 1        | 4.50       | 4.50\n 102      | 3        | 24.00      | 72.00\n(3 rows)",
        },
        {
          difficulty: "Hard",
          title: "DISTINCT on one column vs. two",
          scenario:
            "The expansion team asks: which countries do we have customers in? Then: which country-city pairs?",
          steps: [
            {
              code: "-- customers now includes a city column:\n-- name  | country | city\n-- Amara | Nigeria | Lagos\n-- Wei   | China   | Shanghai\n-- Priya | India   | Mumbai\n-- Jamal | Egypt   | Cairo\n-- Alice | Canada  | Toronto\n-- Omar  | Egypt   | Cairo\n-- Dana  | Egypt   | Alexandria",
              explanation:
                "Seven customers, but Egypt appears three times — twice in Cairo, once in Alexandria. Plain SELECT country would return Egypt three times.",
            },
            {
              code: "SELECT DISTINCT country\nFROM customers;",
              explanation:
                "DISTINCT collapses duplicate result rows. The three Egypt rows become one; five unique countries remain.",
            },
            {
              code: "SELECT DISTINCT country, city\nFROM customers;",
              explanation:
                "Now DISTINCT compares the pair (country, city). The two Cairo rows collapse into one, but (Egypt, Alexandria) survives as its own row because the city differs. Six rows result — DISTINCT always applies to the whole selected row, not just the column it visually sits next to.",
            },
          ],
          output:
            "-- Query 1: 5 rows (Nigeria, China, India, Egypt, Canada)\n-- Query 2: 6 rows — Egypt appears twice:\n-- (Egypt, Cairo) and (Egypt, Alexandria)",
        },
        {
          difficulty: "Industry Example",
          title: "Cost-aware querying at a streaming company",
          scenario:
            "A Netflix-style analytics team queries a viewing_events table with 90 columns and billions of rows in a cloud warehouse that bills per byte scanned. An analyst needs unique profiles that streamed anything yesterday, plus watch hours per event.",
          steps: [
            {
              code: "-- Anti-pattern (scans all 90 columns):\nSELECT *\nFROM viewing_events;",
              explanation:
                "On a columnar warehouse, cost scales with the columns you touch. SELECT * on a wide, billions-of-rows table can cost hundreds of dollars per run and may get flagged by the data-platform team.",
            },
            {
              code: "SELECT\n  profile_id,\n  title_id,\n  watch_seconds / 3600.0 AS watch_hours\nFROM viewing_events;",
              explanation:
                "Projecting 3 of 90 columns cuts scanned bytes by roughly 30×. Dividing by 3600.0 (not 3600) matters: dividing two integers in PostgreSQL truncates to an integer, while a decimal literal forces decimal division — 5400 / 3600 gives 1, but 5400 / 3600.0 gives 1.5.",
            },
            {
              code: "SELECT DISTINCT profile_id\nFROM viewing_events;",
              explanation:
                "For 'unique profiles that watched anything', DISTINCT collapses billions of event rows to the set of unique profile IDs. This SELECT-only version answers the question; adding a date filter needs WHERE — exactly what the next lesson teaches.",
            },
          ],
          output:
            "-- Projected query: 3 columns, ~1/30th the scan cost\n-- DISTINCT query: one row per unique profile_id",
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
          "You're an analyst at an online electronics shop. The products table holds the catalog. Build a price sheet: product name (labeled 'product'), the unit price, and a new column 'price_with_vat' that adds 20% VAT (unit_price * 1.20). Fill in the blanks.",
        starterCode:
          "-- products(product_id, product_name, category, unit_price)\n-- Rows: Wireless Mouse (25.00), USB-C Hub (49.50), Laptop Stand (32.00)\n\nSELECT\n  product_name AS ___,\n  unit_price,\n  unit_price * ___ AS ___\nFROM ___;",
        solutionCode:
          "-- products(product_id, product_name, category, unit_price)\n-- Rows: Wireless Mouse (25.00), USB-C Hub (49.50), Laptop Stand (32.00)\n\nSELECT\n  product_name AS product,\n  unit_price,\n  unit_price * 1.20 AS price_with_vat\nFROM products;",
        expectedOutput:
          " product        | unit_price | price_with_vat\n----------------+------------+----------------\n Wireless Mouse | 25.00      | 30.0000\n USB-C Hub      | 49.50      | 59.4000\n Laptop Stand   | 32.00      | 38.4000\n(3 rows)",
        hints: [
          "Three blanks to fill: an alias for product_name, the VAT multiplier, an alias for the computed column — plus the table name.",
          "Adding 20% means multiplying by 1.20 — the whole price plus a fifth.",
          "The alias pattern is: expression AS alias_name. The requested names are product and price_with_vat.",
          "SELECT product_name AS product, unit_price, unit_price * 1.20 AS price_with_vat FROM ___; — the table is products.",
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
          id: "sql02_mcq_01",
          difficulty: "Easy",
          question: "What does 'projection' mean in SQL?",
          options: [
            "Estimating future values from historical data",
            "Choosing which columns appear in the result",
            "Choosing which rows appear in the result",
            "Copying a table to a new location",
          ],
          correctIndex: 1,
          explanation:
            "Projection is the relational term for selecting a subset of columns — what the SELECT list does. Forecasting future values is a statistics concept, not a relational operation. Choosing rows is filtering (selection), done by WHERE. Copying tables is done with statements like CREATE TABLE AS, not by projection.",
        },
        {
          type: "mcq",
          id: "sql02_mcq_02",
          difficulty: "Easy",
          question:
            "Which query returns each customer's name under the output column header 'client'?",
          options: [
            "SELECT name = client FROM customers;",
            "SELECT client FROM customers.name;",
            "SELECT name AS client FROM customers;",
            "RENAME name TO client IN customers;",
          ],
          correctIndex: 2,
          explanation:
            "AS creates an output alias: the column is still stored as name, but the result labels it client. The = form is not aliasing syntax — in SQL, = is a comparison operator. FROM customers.name treats a column as if it were a schema-qualified table, which fails. RENAME ... TO is DDL-style syntax that would attempt to permanently change the table (and isn't valid as written) — an alias only affects one query's output.",
        },
        {
          type: "mcq",
          id: "sql02_mcq_03",
          difficulty: "Medium",
          question:
            "The orders table has 1,000 rows from 340 different customers. How many rows does SELECT DISTINCT customer_id FROM orders; return?",
          options: ["1,000", "340", "660", "1"],
          correctIndex: 1,
          explanation:
            "DISTINCT collapses duplicate values, leaving one row per unique customer_id — and there are 340 unique customers. 1,000 is what you'd get without DISTINCT. 660 is the count of duplicate rows removed, not the rows remaining. 1 would require every order to belong to the same customer.",
        },
        {
          type: "scenario",
          id: "sql02_sc_01",
          difficulty: "Medium",
          scenario:
            "A teammate's scheduled dashboard query uses SELECT * FROM orders. The data engineering team then adds four large JSON columns to orders for a new feature. The next morning, the dashboard job runs 6× slower and the warehouse bill spikes.",
          question: "What is the root cause, and the correct fix?",
          options: [
            "The database needs reindexing; ask a DBA to rebuild indexes",
            "SELECT * now scans the new heavy columns too; list only the needed columns explicitly",
            "DISTINCT is missing, so duplicate rows inflated the result",
            "The query lacks a semicolon, causing it to run repeatedly",
          ],
          correctIndex: 1,
          explanation:
            "SELECT * automatically picks up every new column, so the query began scanning four large JSON columns it never needed — explicit column lists immunize saved queries against schema growth. Reindexing doesn't address scan width, and no index change occurred here. DISTINCT relates to duplicate rows, not column bloat, and the row count didn't change. A missing semicolon would cause a syntax issue in some clients, not silent repeated execution.",
        },
        {
          type: "coding",
          id: "sql02_code_01",
          difficulty: "Medium",
          prompt:
            "Using order_items(order_item_id, order_id, product_id, quantity, unit_price), write a query returning order_id and a computed column named line_total (quantity multiplied by unit_price), for all rows.",
          starterCode:
            "-- order_items(order_item_id, order_id, product_id, quantity, unit_price)\n-- Sample rows: (1, 101, 3, 2, 39.99), (2, 101, 1, 1, 4.50), (3, 102, 2, 3, 24.00)\n\n",
          solutionCode:
            "SELECT\n  order_id,\n  quantity * unit_price AS line_total\nFROM order_items;",
          expectedOutput:
            " order_id | line_total\n----------+------------\n 101      | 79.98\n 101      | 4.50\n 102      | 72.00\n(3 rows)",
          tests: [
            {
              name: "Correct columns",
              description: "Returns exactly order_id and the computed column",
            },
            {
              name: "Alias applied",
              description: "The computed column is named line_total via AS",
            },
            {
              name: "Correct arithmetic",
              description: "line_total equals quantity * unit_price for every row",
            },
          ],
        },
        {
          type: "mcq",
          id: "sql02_mcq_04",
          difficulty: "Hard",
          question:
            "customers has rows: (Egypt, Cairo), (Egypt, Cairo), (Egypt, Alexandria) in its (country, city) columns. What does SELECT DISTINCT country, city FROM customers; return?",
          options: [
            "One row: (Egypt, Cairo)",
            "Two rows: (Egypt, Cairo) and (Egypt, Alexandria)",
            "Three rows — DISTINCT only works on a single column",
            "One row: (Egypt) — DISTINCT applies to the first column only",
          ],
          correctIndex: 1,
          explanation:
            "DISTINCT de-duplicates entire selected rows: the two identical (Egypt, Cairo) rows collapse into one, while (Egypt, Alexandria) differs in city and survives separately. DISTINCT is not limited to one column, so three rows is wrong. And it never applies to just the first listed column — a common misreading of the syntax, since DISTINCT sits next to the first column name but governs the whole row.",
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
          question: "Walk me through what SELECT and FROM do in a SQL query.",
          answer:
            "FROM names the table the database reads, and SELECT lists which columns come back in the result — an operation called projection. The result of any query is itself a table of rows and columns, which is what makes SQL composable. SELECT can also compute new columns with expressions, like quantity * unit_price, and rename any output column with an AS alias. A query as small as SELECT name FROM customers; is complete and useful — those two clauses are the foundation everything else builds on.",
        },
        {
          question:
            "Why is SELECT * discouraged in production queries, and when is it acceptable?",
          answer:
            "SELECT * fetches every column, which creates three problems in production. First, cost and speed: columnar warehouses bill and perform based on the columns you scan, so pulling 90 columns when you need 3 can multiply cost dramatically. Second, fragility: when someone adds columns to the table, every SELECT * query silently changes shape, which can break downstream code, inflate dashboards, or leak newly added sensitive columns. Third, readability: an explicit column list documents exactly what the query depends on. SELECT * is perfectly acceptable for interactive exploration — peeking at an unfamiliar table's contents — and in a few idioms like EXISTS subqueries where the column list is ignored. My rule: star while exploring, explicit columns in anything saved or scheduled.",
        },
        {
          question:
            "How does DISTINCT behave with multiple columns, and what performance consideration comes with it on large tables?",
          answer:
            "DISTINCT operates on the entire selected row, not any individual column: SELECT DISTINCT country, city keeps every unique combination of the pair, so two rows survive if they differ in either value. A frequent misconception is that DISTINCT binds to the first column it appears next to — it doesn't; it's a modifier on the whole SELECT. Performance-wise, the database must determine uniqueness across all returned rows, typically by hashing or sorting the full result set, which can be expensive on tables with hundreds of millions of rows. If I only need distinct values of grouped data I'm aggregating anyway, GROUP BY expresses that intent directly. I also treat an unexpected need for DISTINCT as a smell: in join-heavy queries it often papers over accidental row duplication from a fan-out, and the right fix is usually the join logic, not de-duplication at the end.",
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
        "1) Forgetting commas between column names in SELECT — SELECT name country silently treats country as an alias for name, giving you one mislabeled column instead of two. 2) Using single quotes for aliases or column names — in standard SQL, 'text' in single quotes is a string value; identifiers with spaces need double quotes: AS \"Customer Name\". 3) Assuming DISTINCT applies only to the column written right after it — it de-duplicates the entire selected row. 4) Expecting integer division to keep decimals — 5400 / 3600 is 1 in PostgreSQL; write 3600.0 to force decimal division. 5) Shipping SELECT * in saved queries and dashboards, which bloats cost and breaks silently when the table gains columns.",
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
        "Try these prompts in the AI Tutor panel: • 'ELI5: what does SELECT actually do, using a menu analogy different from the lesson's?' • 'Quiz me: five questions about aliases and DISTINCT.' • 'Show me a case where forgetting a comma in the SELECT list produces a wrong-but-running query.' • 'Explain why SELECT is written first but evaluated near the end.' • 'Interview mode: ask me why SELECT * is risky in production and grade my answer.'",
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
        "SELECT — the clause listing which columns (or expressions) a query returns. FROM — the clause naming the table to read. Projection — returning a chosen subset of columns. Result set — the table of rows and columns a query produces. Expression — a computation in the SELECT list, like quantity * unit_price. Alias — an output name assigned with AS to a column or expression. Identifier — the name of a table or column; quoted with double quotes when it contains spaces. String literal — a text value in single quotes, like 'Egypt'. DISTINCT — a modifier that removes duplicate rows from the result. SELECT * — shorthand for 'all columns'; fine for exploration, risky in production. Integer division — dividing two integers yields an integer in PostgreSQL; use a decimal like 3600.0 to keep fractions.",
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
        "• Docs: PostgreSQL manual — 'Queries: Select Lists' covers projection, expressions, and aliasing from the source. • Read: your warehouse vendor's pricing page (e.g. BigQuery on-demand pricing) to see why bytes scanned — and therefore SELECT * — is a real money question. • Practice: on any sample database, write five queries that each return exactly the columns needed for an imaginary stakeholder request — no more. • Next in DSM: WHERE & Filtering, where you stop returning every row and start choosing which rows qualify.",
    },

    /* ---------------------------------------------------------------- */
    /*  12 — Recap                                                       */
    /* ---------------------------------------------------------------- */
    {
      id: "recap",
      type: "recap",
      tocLabel: "Recap",
      content:
        "✓ SELECT lists the columns to return; FROM names the table — together they form a complete query.\n✓ Projection (choosing columns) changes the width of the result, never the row count.\n✓ SELECT can compute derived columns per row with expressions like quantity * unit_price.\n✓ AS gives columns and expressions readable output names; double quotes protect aliases with spaces.\n✓ DISTINCT removes duplicate rows, comparing the entire selected row — not just one column.\n✓ Prefer explicit column lists over SELECT * in anything saved or scheduled: cheaper, faster, and stable as schemas grow.\n\nNext up: WHERE & Filtering. You can now choose your columns — but every query so far returned all rows. Next you'll write predicates that keep only the rows you want: orders over $100, customers in Egypt, emails matching a pattern — and you'll meet SQL's famously tricky NULL logic.",
    },
  ],
};
