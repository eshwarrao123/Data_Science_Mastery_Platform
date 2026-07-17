import type { Lesson } from "@/lib/curriculum/types";

export const innerJoin: Lesson = {
  meta: {
    id: "sql.joins.inner-join",
    slug: "inner-join",
    title: "INNER JOIN",
    description:
      "Combine rows from two tables where a join key matches on both sides — the workhorse of relational queries.",
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
        hook: "Your customers live in one table. Their orders live in another. Every real question — 'which customers ordered last week?', 'what did Maria buy?' — needs data from both at once. INNER JOIN is how you stitch those tables together, and by the end of this lesson you'll be able to predict exactly how many rows come out the other side.",
        what: "An INNER JOIN combines rows from two tables by pairing each row in the first table with every row in the second table where a join condition — usually an equality between key columns — is true. Rows with no match on the other side are dropped from the result entirely.",
        why: "Relational databases deliberately split data across tables to avoid duplication (a customer's email is stored once, not on every order). Joins are the price of that design: without them, you could never answer a question that spans two tables. INNER JOIN specifically answers 'give me only the rows where both sides agree'.",
        whereUsed:
          "Every analytics query that touches more than one table. Order reports, revenue by customer, product performance dashboards, A/B test result tables — nearly all of them start with an INNER JOIN between a fact table (orders) and a dimension table (customers, products).",
        objectives: [
          "Write an INNER JOIN with ON to combine two tables on a key column",
          "Explain matching semantics: which rows survive and which are dropped",
          "Predict the row count of a join result from key cardinality (one-to-one, one-to-many)",
          "Qualify column names with table aliases to avoid ambiguity errors",
          "Recognise when a join key mismatch (type, trailing spaces, NULLs) silently drops rows",
        ],
        realWorldApps: [
          {
            company: "Shopify",
            headline: "Merchant order dashboards",
            detail:
              "Every storefront analytics page joins the orders table to customers and line items so merchants see who bought what. An INNER JOIN keeps only completed, attributable orders — exactly the rows a revenue report should count.",
          },
          {
            company: "Airbnb",
            headline: "Bookings joined to listings",
            detail:
              "Pricing and occupancy analyses join the reservations fact table to the listings dimension on listing_id. Because a listing can have many reservations, analysts must reason about one-to-many row multiplication — the core skill this lesson teaches.",
          },
          {
            company: "Stripe",
            headline: "Payments matched to customers",
            detail:
              "Stripe's reporting infrastructure joins charge records to customer records on customer_id so finance teams can break revenue down by account, plan, and country — millions of INNER JOINs executed per day inside their data warehouse.",
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
            "An INNER JOIN takes two tables and a join condition, written after the keyword ON. The database pairs up rows: for each row in the left table, it looks for rows in the right table where the condition is true. Every successful pair becomes one row in the result, containing the columns of both tables.",
        },
        {
          type: "analogy",
          title: "The dance-partner analogy",
          content:
            "Picture two lines of dancers: customers on the left, orders on the right. Each order holds a card with a customer_id. The music starts, and every order walks over to the customer whose id matches its card. Customers who attract no orders — and orders holding an id no customer has — leave the floor. Only matched pairs remain. That's an INNER JOIN. The limit of the analogy: a customer with three orders dances three times, appearing in three result rows — one per partner, not one total.",
        },
        {
          type: "keypoint",
          title: "The join key",
          content:
            "The join key is the column (or columns) the ON condition compares — typically a primary key on one side (customers.customer_id, unique per customer) and a foreign key on the other (orders.customer_id, a reference pointing back at that customer). Keys must be comparable: same meaning, compatible types, consistent formatting.",
        },
        {
          type: "text",
          content:
            "Matching semantics decide the row count. If the key is one-to-one, the result has at most as many rows as the smaller table. If it's one-to-many — one customer, many orders — each customer row is repeated once per matching order. The result row count equals the number of matched pairs, not the size of either input table.",
        },
        {
          type: "code-note",
          code: "SELECT c.name, o.order_id, o.total\nFROM customers AS c\nINNER JOIN orders AS o\n  ON c.customer_id = o.customer_id;",
          content:
            "AS c and AS o create table aliases — short nicknames used to qualify columns. Qualification (writing c.name instead of name) matters because both tables may have a column with the same name; an unqualified reference to a duplicated name raises an 'ambiguous column' error. The keyword INNER is optional — plain JOIN means INNER JOIN in every major dialect — but writing it out makes intent explicit.",
        },
        {
          type: "expandable",
          title: "What happens under the hood?",
          content:
            "Conceptually, a join starts from the Cartesian product — every left row paired with every right row (a 1,000 × 10,000 join conceptually considers 10,000,000 pairs) — then keeps only pairs where the ON condition is true. Real engines never materialise that product: they use hash joins (build a hash table on one side's key, probe with the other) or merge joins (walk two sorted inputs in step). The output is identical; the conceptual model is what you use to reason about correctness, and the physical strategy is what the query planner uses for speed.",
        },
        {
          type: "warning",
          title: "NULL never matches — not even another NULL",
          content:
            "In SQL, NULL = NULL evaluates to unknown, not true. A row whose join key is NULL matches nothing and silently vanishes from an INNER JOIN result. If orders.customer_id is NULL for guest checkouts, those orders will not appear in a customers-joined report — and no error tells you so. Always check key columns for NULLs before trusting join-based totals.",
        },
        {
          type: "keypoint",
          title: "ON vs WHERE with INNER JOIN",
          content:
            "For an INNER JOIN, filtering in ON or in WHERE produces the same rows — the condition eliminates non-matching pairs either way. Convention: put the key match in ON, put business filters (o.status = 'shipped') in WHERE. This separation becomes semantically critical when you move to LEFT JOIN in the next lesson, so build the habit now.",
        },
        {
          type: "expandable",
          title: "Older syntax you will meet in the wild",
          content:
            "Legacy code sometimes writes joins as a comma-separated FROM list with the condition in WHERE: FROM customers c, orders o WHERE c.customer_id = o.customer_id. It returns identical results, but if you forget the WHERE clause you silently get the full Cartesian product — every customer paired with every order. The explicit JOIN ... ON syntax makes forgetting the condition a visible mistake, which is why every style guide (including PostgreSQL's own documentation) recommends it.",
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
        title: "How an INNER JOIN Filters and Pairs Rows",
        caption:
          "Follow a row's journey: two source tables feed the matcher, which keeps only key-matched pairs. Click each node for the row-count math.",
        nodes: [
          {
            id: "customers",
            label: "customers",
            sublabel: "5 rows",
            detail:
              "The left table. Primary key customer_id is unique: Alice(1), Ben(2), Chloe(3), Dev(4), Emma(5). Emma has never ordered — watch what happens to her.",
            x: 12,
            y: 25,
            accent: false,
          },
          {
            id: "orders",
            label: "orders",
            sublabel: "6 rows",
            detail:
              "The right table. Foreign key customer_id references customers. Orders: 101→1, 102→1, 103→2, 104→3, 105→4, 106→9. Order 106 points at customer 9, who does not exist (perhaps deleted).",
            x: 12,
            y: 70,
            accent: false,
          },
          {
            id: "matcher",
            label: "ON c.customer_id = o.customer_id",
            sublabel: "the matching engine",
            detail:
              "Each order looks up its customer. Matches found: 101↔Alice, 102↔Alice, 103↔Ben, 104↔Chloe, 105↔Dev. Order 106 finds nobody; Emma is found by nobody. NULL keys would also fail here, because NULL = anything is never true.",
            x: 46,
            y: 47,
            accent: true,
          },
          {
            id: "result",
            label: "Result set",
            sublabel: "5 rows",
            detail:
              "5 customers × 6 orders in, 5 rows out — one per matched pair. Alice appears twice (two orders): one-to-many keys duplicate the 'one' side. Emma (no orders) and order 106 (no customer) are absent: INNER JOIN drops unmatched rows from both sides.",
            x: 80,
            y: 30,
            accent: false,
          },
          {
            id: "dropped",
            label: "Dropped rows",
            sublabel: "Emma + order 106",
            detail:
              "The invisible cost of INNER JOIN: unmatched rows disappear without warning or error. If your question is 'which customers have NOT ordered?', INNER JOIN cannot answer it — that is precisely what LEFT JOIN (next lesson) exists for.",
            x: 80,
            y: 72,
            accent: false,
          },
        ],
        edges: [
          { from: "customers", to: "matcher", label: "left input" },
          { from: "orders", to: "matcher", label: "right input" },
          { from: "matcher", to: "result", label: "key matches → kept" },
          { from: "matcher", to: "dropped", label: "no match → silently removed" },
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
          title: "Your first join: orders with customer names",
          scenario:
            "An online bookshop stores 3 customers and 3 orders. Support wants to see each order next to the customer's name instead of a bare id.",
          steps: [
            {
              code: "SELECT customers.name, orders.order_id\nFROM customers",
              explanation:
                "We start from customers and select one column from each table, qualifying both with the table name so it is unambiguous where each column lives. customers has 3 rows: Alice(1), Ben(2), Chloe(3).",
            },
            {
              code: "INNER JOIN orders\n  ON customers.customer_id = orders.customer_id;",
              explanation:
                "The ON condition pairs rows whose customer_id values are equal. Orders: 101→1, 102→2, 103→3 — every order matches exactly one customer and every customer has exactly one order. Row-count reasoning: 3 rows × 3 rows in, 3 matched pairs out. One-to-one keys never inflate the result.",
            },
          ],
          output:
            " name  | order_id\n-------+----------\n Alice |      101\n Ben   |      102\n Chloe |      103\n(3 rows)",
        },
        {
          difficulty: "Easy",
          title: "One-to-many: a customer with several orders",
          scenario:
            "Same bookshop, one month later. Alice has placed two more orders. Finance asks for every order alongside its customer name and amount.",
          steps: [
            {
              code: "SELECT c.name, o.order_id, o.total\nFROM customers AS c\nINNER JOIN orders AS o\n  ON c.customer_id = o.customer_id",
              explanation:
                "We introduce aliases c and o — the professional habit that keeps multi-table queries readable. customers still has 3 rows; orders now has 5: Alice owns 101, 104, 105; Ben owns 102; Chloe owns 103.",
            },
            {
              code: "ORDER BY o.order_id;",
              explanation:
                "Row-count reasoning before running: Alice matches 3 orders → 3 result rows; Ben 1; Chloe 1. Total 5 rows — the size of the 'many' side, because every order has a valid customer. Alice's name is repeated on each of her rows: the join duplicates the 'one' side per match; it does not merge her orders into one row.",
            },
          ],
          output:
            " name  | order_id | total\n-------+----------+-------\n Alice |      101 | 42.50\n Ben   |      102 | 18.00\n Chloe |      103 | 27.25\n Alice |      104 |  9.99\n Alice |      105 | 63.75\n(5 rows)",
        },
        {
          difficulty: "Medium",
          title: "Join plus filter: shipped orders from Germany",
          scenario:
            "The operations team needs shipped orders for German customers only, to reconcile against a carrier invoice.",
          steps: [
            {
              code: "SELECT c.name, c.country, o.order_id, o.status\nFROM customers AS c\nINNER JOIN orders AS o\n  ON c.customer_id = o.customer_id",
              explanation:
                "The join alone would return 5 rows (as in the previous example — every order matched). The key match lives in ON; business filters come next, in WHERE.",
            },
            {
              code: "WHERE c.country = 'Germany'\n  AND o.status = 'shipped';",
              explanation:
                "WHERE runs on the joined rows. Suppose Ben and Chloe are in Germany; Ben's order 102 is shipped, Chloe's 103 is still 'processing'. Row-count reasoning: 5 joined rows → country filter keeps Ben's and Chloe's (2 rows) → status filter keeps only Ben's (1 row). For INNER JOIN these filters could sit in ON with identical results, but keeping them in WHERE states your intent and survives a later switch to LEFT JOIN.",
            },
          ],
          output:
            " name | country | order_id | status\n------+---------+----------+---------\n Ben  | Germany |      102 | shipped\n(1 row)",
        },
        {
          difficulty: "Hard",
          title: "Row explosion: joining through order_items",
          scenario:
            "Marketing wants to know which products each customer has bought. That data lives three tables apart — and the row count grows at each hop.",
          steps: [
            {
              code: "SELECT c.name, oi.product_id, oi.quantity\nFROM customers AS c\nINNER JOIN orders AS o\n  ON c.customer_id = o.customer_id",
              explanation:
                "First hop, as before: 3 customers join 5 orders → 5 rows. Each result row is one order tagged with its customer's name.",
            },
            {
              code: "INNER JOIN order_items AS oi\n  ON o.order_id = oi.order_id;",
              explanation:
                "Second hop: order_items holds one row per product line. Suppose order 101 has 3 lines, 102 has 1, 103 has 2, 104 has 1, 105 has 2 — 9 lines total. Each of the 5 order rows fans out to its lines: 3+1+2+1+2 = 9 result rows. Row-count reasoning: each one-to-many hop multiplies rows by the average number of children. Never SUM an order-level column (like o.total) after this join — it now appears once per line and would be counted multiple times.",
            },
            {
              code: "-- Sanity check the explosion before trusting any aggregate:\nSELECT COUNT(*) FROM order_items;  -- expect 9",
              explanation:
                "A professional habit: verify the joined row count equals the row count of the most granular table (here order_items, since every line belongs to a valid order and customer). If the join returned more than 9 rows, a key is duplicated somewhere and every downstream number is wrong.",
            },
          ],
          output:
            " name  | product_id | quantity\n-------+------------+----------\n Alice |          7 |        1\n Alice |         12 |        2\n Alice |          3 |        1\n Ben   |          7 |        1\n Chloe |          5 |        1\n Chloe |          9 |        3\n Alice |         12 |        1\n Alice |          2 |        1\n Alice |          8 |        2\n(9 rows)",
        },
        {
          difficulty: "Industry Example",
          title: "Revenue by product category, warehouse-style",
          scenario:
            "A data analyst at an e-commerce company builds the weekly 'revenue by category' report: join line items to products, aggregate, and defend the numbers when finance asks how they were computed.",
          steps: [
            {
              code: "SELECT p.category,\n       SUM(oi.quantity * oi.unit_price) AS revenue\nFROM order_items AS oi\nINNER JOIN products AS p\n  ON oi.product_id = p.product_id",
              explanation:
                "We start from order_items — the most granular fact table — and join up to products, the dimension carrying category. Many line items reference the same product (many-to-one), so this join cannot inflate rows: 9 line items in, 9 joined rows out. Revenue is computed from quantity × unit_price on the line-item side, where the grain is correct.",
            },
            {
              code: "GROUP BY p.category\nORDER BY revenue DESC;",
              explanation:
                "GROUP BY collapses the 9 joined rows into one per category. Row-count reasoning start to finish: 9 line items → join to products (many-to-one, still 9) → group into 3 categories → 3 rows. The INNER JOIN also acts as a quiet filter: a line item with a product_id not present in products (a deleted SKU) would be excluded. In an audit you would prove none exist — or switch to a LEFT JOIN to expose them.",
            },
          ],
          output:
            " category    | revenue\n-------------+---------\n Electronics |  412.97\n Books       |  118.48\n Home        |   54.90\n(3 rows)",
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
          "The customers table has customer_id, name, country. The orders table has order_id, customer_id, order_date, total. Write a query returning each order's id and total next to the customer's name, for orders over $50, sorted by total descending. Fill in the blanks.",
        starterCode:
          "SELECT c.name, o.order_id, o.total\nFROM customers AS c\n___ orders AS o\n  ON ___ = ___\nWHERE o.total > ___\nORDER BY o.total DESC;",
        solutionCode:
          "SELECT c.name, o.order_id, o.total\nFROM customers AS c\nINNER JOIN orders AS o\n  ON c.customer_id = o.customer_id\nWHERE o.total > 50\nORDER BY o.total DESC;",
        expectedOutput:
          " name  | order_id | total\n-------+----------+--------\n Chloe |      108 | 129.99\n Alice |      105 |  63.75\n Ben   |      107 |  52.10\n(3 rows)",
        hints: [
          "The keyword that combines two tables keeping only matched rows is INNER JOIN.",
          "The ON condition compares the key columns: the customer_id column from each aliased table.",
          "Qualify with aliases: c.customer_id on the customers side, o.customer_id on the orders side.",
          "The WHERE threshold is 50 — a plain number, no quotes, because total is numeric.",
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
          id: "sql07_mcq_01",
          difficulty: "Easy",
          question:
            "An INNER JOIN between customers and orders on customer_id returns which rows?",
          options: [
            "All customers, with NULLs where they have no orders",
            "Only customer–order pairs where customer_id matches on both sides",
            "All rows from both tables, matched where possible",
            "Every customer paired with every order",
          ],
          correctIndex: 1,
          explanation:
            "INNER JOIN keeps only matched pairs — that is its defining behaviour. Option A describes LEFT JOIN (unmatched left rows kept with NULL fill). Option C describes FULL OUTER JOIN. Option D is a CROSS JOIN / Cartesian product, which applies no matching condition at all.",
        },
        {
          type: "mcq",
          id: "sql07_mcq_02",
          difficulty: "Easy",
          question:
            "customers has 4 rows. orders has 6 rows, each with a valid customer_id; one customer placed 3 orders, and one customer placed none. How many rows does the INNER JOIN on customer_id return?",
          options: ["4", "6", "10", "24"],
          correctIndex: 1,
          explanation:
            "Each of the 6 orders matches exactly one customer, so there are 6 matched pairs — the answer is 6. The customer with no orders contributes nothing (unmatched left rows are dropped). 4 wrongly assumes one row per customer; 10 wrongly adds the table sizes; 24 is the Cartesian product 4 × 6, which only a missing/always-true join condition would produce.",
        },
        {
          type: "mcq",
          id: "sql07_mcq_03",
          difficulty: "Medium",
          question:
            "Some rows in orders have customer_id = NULL (guest checkouts). What happens to them in an INNER JOIN with customers?",
          options: [
            "They match every customer",
            "They match the customer whose id is also NULL",
            "They are excluded, because NULL = NULL is not true in SQL",
            "The query fails with an error",
          ],
          correctIndex: 2,
          explanation:
            "NULL compared to anything — including another NULL — yields unknown, never true, so a NULL-keyed row can never satisfy the ON condition and is dropped. Option A describes no SQL behaviour. Option B is the trap: many learners assume NULL = NULL matches, but SQL's three-valued logic says otherwise. Option D is wrong because this is silent data loss, not an error — which is exactly why it is dangerous.",
        },
        {
          type: "scenario",
          id: "sql07_sc_01",
          difficulty: "Medium",
          scenario:
            "A revenue dashboard joins orders (order-level totals) to order_items and then reports SUM(orders.total). The numbers come out roughly triple the true revenue.",
          question: "What is the most likely cause?",
          options: [
            "The INNER JOIN dropped unmatched orders",
            "Each order fans out to one row per line item, so orders.total is summed once per item (~3 items per order)",
            "The ON condition compared the wrong columns, producing zero matches",
            "SUM ignores NULLs, deflating the comparison figure",
          ],
          correctIndex: 1,
          explanation:
            "Joining an order-level table to a line-level table duplicates each order's row once per line item; summing an order-level column after that fan-out counts it once per item — with ~3 items per order, revenue triples. Option A would shrink the total, not inflate it. Option C would produce zero revenue, not triple. Option D affects the true figure, not the inflated one, and could not explain a 3× overshoot. Fix: aggregate order_items to one row per order first, or sum totals before joining.",
        },
        {
          type: "scenario",
          id: "sql07_sc_02",
          difficulty: "Hard",
          scenario:
            "An analyst imports a CSV into a staging table where customer_id is stored as text with occasional trailing spaces ('1042 '). Joining it to the production customers table (integer customer_id) on equality returns far fewer rows than expected.",
          question: "Which pair of problems explains the missing rows?",
          options: [
            "INNER JOIN limits results to 1000 rows; the CSV is too large",
            "Type mismatch may error or coerce unpredictably, and ' 1042 ' never equals 1042 even after casting the padded text",
            "Text keys cannot be used in joins at all",
            "The staging table needs a primary key before it can be joined",
          ],
          correctIndex: 1,
          explanation:
            "Two classic dirty-key problems stack here: comparing text to integer either errors (PostgreSQL) or forces a cast, and '1042 ' with a trailing space is not equal to '1042' as text — nor castable to integer without TRIM. The fix is ON TRIM(s.customer_id)::int = c.customer_id after profiling the data. Option A: no such limit exists. Option C: text keys join fine when both sides are text and clean. Option D: joins never require a primary key — keys help performance and integrity, not legality.",
        },
        {
          type: "coding",
          id: "sql07_code_01",
          difficulty: "Medium",
          prompt:
            "Using orders (order_id, customer_id, total) and customers (customer_id, name, country), return each country and its number of orders as order_count, sorted by order_count descending. Only countries with at least one order should appear — which the join guarantees on its own.",
          starterCode:
            "-- customers: customer_id, name, country\n-- orders: order_id, customer_id, total\nSELECT ___\nFROM ___\n",
          solutionCode:
            "SELECT c.country, COUNT(*) AS order_count\nFROM customers AS c\nINNER JOIN orders AS o\n  ON c.customer_id = o.customer_id\nGROUP BY c.country\nORDER BY order_count DESC;",
          expectedOutput:
            " country | order_count\n---------+-------------\n USA     |           4\n Germany |           2\n France  |           1\n(3 rows)",
          tests: [
            {
              name: "Uses INNER JOIN on customer_id",
              description:
                "The query must join customers to orders on the customer_id key",
            },
            {
              name: "Correct aggregation",
              description:
                "COUNT(*) grouped by country, aliased as order_count",
            },
            {
              name: "Sorted descending",
              description: "USA (4) first, then Germany (2), then France (1)",
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
            "Explain what an INNER JOIN does and how it differs from a LEFT JOIN.",
          answer:
            "An INNER JOIN pairs rows from two tables wherever the ON condition is true and returns only those matched pairs — rows with no match on the other side are excluded from the result entirely. A LEFT JOIN also returns matched pairs, but additionally keeps every unmatched row from the left table, filling the right table's columns with NULL. The practical difference is the question each answers: INNER JOIN answers 'which customers placed orders?', while LEFT JOIN answers 'show me all customers, with their orders if any'. Choosing between them is a business decision, not a syntax one — an INNER JOIN in a report silently defines 'customers without orders don't exist here'. In interviews I also mention that plain JOIN means INNER JOIN, and that the choice changes row counts: INNER can only shrink or duplicate, never preserve unmatched rows.",
        },
        {
          question:
            "Table A has 1,000 rows and table B has 2,000 rows. After joining on a key, is the result guaranteed to have at most 2,000 rows? Why or why not?",
          answer:
            "No — there is no such guarantee unless the key is unique on at least one side. A join's row count equals the number of matched pairs, and if the key is duplicated on both sides you get a many-to-many multiplication: 3 rows with key 'X' in A and 4 rows with key 'X' in B produce 12 result rows for that key alone. In the worst degenerate case — every row sharing one key value — the result approaches 1,000 × 2,000 = 2,000,000 rows. The safe upper bound only exists for one-to-many joins: if the key is unique in A, each B row matches at most once, capping the result at 2,000. In practice I verify this before trusting any joined aggregate: I check key uniqueness with a GROUP BY ... HAVING COUNT(*) > 1 query, and I compare the joined row count against the granular table's row count. Unexpected row explosion is the single most common cause of inflated metrics in analytics.",
        },
        {
          question:
            "A stakeholder says a join-based revenue report is 'missing orders'. What would you investigate?",
          answer:
            "First I would check for unmatched join keys, because INNER JOIN drops them silently: orders whose customer_id is NULL (guest checkouts) or references a customer no longer in the customers table (deleted or filtered accounts) simply vanish. A quick diagnostic is a LEFT JOIN from orders to customers with WHERE customers.customer_id IS NULL to surface the orphans and count the missing revenue. Second, I would check key hygiene — type mismatches, trailing whitespace, case differences in text keys — since '1042 ' will never equal 1042. Third, I would look at any filters interacting with the join: a WHERE condition on a column from the joined table can quietly remove rows. Finally I would reconcile totals: SUM(total) on the raw orders table versus on the joined result tells me exactly how much revenue the join is losing. The underlying principle is that INNER JOIN is also a filter, and every filter should be deliberate.",
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
        "1) Forgetting the ON clause (or writing an always-true one) — you get a Cartesian product: every row paired with every row, and row counts in the millions. 2) Summing a parent-level column after joining to a child table — o.total appears once per line item and gets counted multiple times; aggregate at the right grain first. 3) Assuming NULL keys match: NULL = NULL is not true in SQL, so NULL-keyed rows silently disappear from INNER JOIN results. 4) Leaving column references unqualified when both tables share a name — SELECT customer_id after joining raises an ambiguity error; always write c.customer_id. 5) Treating INNER JOIN as lossless — it is also a filter, and unmatched rows on either side are dropped without any warning; reconcile row counts before trusting a joined report.",
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
        "Try these prompts in the AI Tutor panel: • 'ELI5: how does an INNER JOIN decide which rows to keep?' • 'Give me two small tables and quiz me on predicting the joined row count.' • 'Show me a real bug caused by a one-to-many join inflating a SUM.' • 'Explain why NULL join keys never match, with a fresh analogy.' • 'Interview mode: ask me to compare INNER JOIN with a Cartesian product and grade my answer.'",
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
        "INNER JOIN — combines two tables, returning only rows where the join condition matches on both sides. Join key — the column(s) compared in the ON clause. ON clause — the condition that decides which row pairs belong in the result. Primary key — a column that uniquely identifies each row in its table. Foreign key — a column that references a primary key in another table. Table alias — a short nickname (customers AS c) used to qualify columns. One-to-many — a key relationship where one row on one side matches many on the other, duplicating the 'one' side in results. Cartesian product — every row of one table paired with every row of another; what you get with no join condition. Row explosion (fan-out) — unintended row multiplication caused by duplicated keys. Matched / unmatched rows — rows that do or do not find a partner under the ON condition; INNER JOIN keeps only the former.",
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
        "• Docs: PostgreSQL manual, 'Joins Between Tables' in the Tutorial chapter — the canonical walk-through with runnable examples. • Read: 'A Visual Explanation of SQL Joins' (the classic Venn-diagram essay) and its follow-up critiques, which sharpen the row-pairing mental model this lesson uses. • Practice: build two tiny tables in any SQL sandbox, add a duplicate key on one side, and predict the joined row count before running — repeat until you are never surprised. • Next in DSM: LEFT & RIGHT JOINs — what happens when you want to keep the unmatched rows an INNER JOIN throws away.",
    },

    /* ---------------------------------------------------------------- */
    /*  12 — Recap                                                       */
    /* ---------------------------------------------------------------- */
    {
      id: "recap",
      type: "recap",
      tocLabel: "Recap",
      content:
        "✓ INNER JOIN pairs rows from two tables where the ON condition is true and drops everything unmatched — from both sides.\n✓ The join key is usually a primary key matched against a foreign key; keys must be clean, comparable, and non-NULL to match.\n✓ Result row count = number of matched pairs: one-to-one preserves counts, one-to-many duplicates the 'one' side per match.\n✓ NULL = NULL is never true, so NULL-keyed rows silently vanish from INNER JOIN results.\n✓ Qualify columns with table aliases (c.name, o.total) to avoid ambiguity errors and unreadable queries.\n✓ INNER JOIN is also a filter — always reconcile joined row counts and totals against the source tables before trusting a report.\n\nNext up: LEFT & RIGHT JOINs. INNER JOIN answered 'who matched?' — next you'll keep the customers with no orders and the products never sold, using outer joins that fill the gaps with NULL instead of dropping them.",
    },
  ],
};
