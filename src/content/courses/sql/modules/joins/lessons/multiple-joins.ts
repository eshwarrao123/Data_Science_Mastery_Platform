import type { Lesson } from "@/lib/curriculum/types";

export const multipleJoins: Lesson = {
  meta: {
    id: "sql.joins.multiple-joins",
    slug: "multiple-joins",
    title: "Multiple Joins",
    description:
      "Chain three or more tables in one query, mix join types deliberately, and control fan-out so your sums stay honest across the chain.",
    estimatedTime: "30 mins",
    difficulty: "Intermediate",
    xpReward: 80,
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
        hook: "'Revenue by product category for German customers' — one sentence, four tables: customers, orders, order_items, products. Real analytical questions almost never fit in two tables. This lesson teaches you to build the four-table chain — and to keep the row counts honest at every link.",
        what: "A multi-join query chains several JOIN clauses: each new join connects the result-so-far to one more table via its ON condition. Join types can mix (INNER here, LEFT there), and the order of ONs — not the order of tables in your head — determines what survives.",
        why: "Normalized schemas split facts across many tables on purpose; you'll formally see why in the Database Design module. The price is that answering questions means reassembling the pieces. Analysts who can't chain joins confidently either write wrong numbers (fan-out doubles their sums) or fall back to exporting tables and merging in pandas — slow and unscalable.",
        whereUsed:
          "Virtually every production analytics query: star-schema rollups, funnel queries stitching users→sessions→events, and any report whose sentence contains two 'by's and a filter.",
        objectives: [
          "Chain three and four tables with successive JOIN … ON clauses",
          "Track the logical grain (what one row means) after every join in the chain",
          "Predict and control fan-out when a one-to-many join meets an aggregate",
          "Mix INNER and LEFT joins deliberately, and avoid the LEFT-then-INNER trap",
          "Debug a multi-join by checking row counts link by link",
        ],
        realWorldApps: [
          {
            company: "Shopify",
            headline: "Order analytics across the schema",
            detail:
              "A merchant's 'sales by product' report joins orders → line items → products → collections, aggregating carefully so multi-item orders don't double-count.",
          },
          {
            company: "Netflix",
            headline: "Viewing funnel stitching",
            detail:
              "Engagement analyses join profiles → sessions → playback events → titles to connect who watched what, when, on which device.",
          },
          {
            company: "Instacart",
            headline: "Basket economics",
            detail:
              "Margin dashboards join orders → order_items → products → suppliers to price every delivered basket against supplier cost.",
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
            "Joins chain left to right: FROM a JOIN b ON … JOIN c ON … first combines a and b, then joins that intermediate result to c. Each ON clause may reference any table already introduced — c's ON can use columns from a AND b. The engine may physically execute in a different order for speed, but the logical result is defined by this left-to-right composition.",
        },
        {
          type: "analogy",
          title: "The relay-race analogy",
          content:
            "Think of a relay race: the baton is your intermediate result. customers hands the baton to orders (now each row is a customer-order), orders hands it to order_items (now a customer-order-item), and order_items hands it to products (now enriched with product data). Each handoff can grow, shrink, or preserve the number of runners — and a fumbled handoff (bad ON clause) ruins every leg after it.",
        },
        {
          type: "keypoint",
          title: "Track the grain after every join",
          content:
            "The grain is what one row represents. customers: one row = one customer. After joining orders: one row = one order (fan-out from one-to-many). After order_items: one row = one line item. Joining products (many-to-one) preserves that grain. Say the grain out loud after each link — every fan-out bug is a grain you lost track of.",
        },
        {
          type: "code-note",
          code: "SELECT c.country, p.category,\n       SUM(oi.quantity * oi.unit_price) AS revenue\nFROM customers c\nINNER JOIN orders o       ON o.customer_id = c.customer_id\nINNER JOIN order_items oi ON oi.order_id   = o.order_id\nINNER JOIN products p     ON p.product_id  = oi.product_id\nGROUP BY c.country, p.category;",
          content:
            "The canonical four-table rollup. Indent ONs vertically and align them — multi-join readability is a team sport. The final grain before GROUP BY is one row per line item, which is exactly the grain at which quantity × unit_price may be summed safely.",
        },
        {
          type: "warning",
          title: "Fan-out corrupts aggregates from coarser tables",
          content:
            "After fanning out to line items, each ORDER-level value (like o.shipping_fee) repeats once per item of that order — SUM(o.shipping_fee) now over-counts multi-item orders. Rule: aggregate each measure at its own grain. Either sum shipping fees in a separate query/CTE at order grain, or use SUM(DISTINCT …) tricks with extreme care (they break when two orders share a fee value... they don't — DISTINCT is per-value-set, use COUNT(DISTINCT o.order_id)-style patterns instead). The safe habit: one aggregate query per grain, joined afterwards.",
        },
        {
          type: "keypoint",
          title: "Mixing join types: the chain remembers",
          content:
            "You can LEFT-join one link and INNER-join the next — but an INNER join AFTER a LEFT join re-drops the NULL-filled rows the LEFT worked to keep (their key is NULL, matching nothing). If customers LEFT JOIN orders must keep order-less customers, every later join off the orders side must also be LEFT. The chain's weakest… strictest link wins.",
        },
        {
          type: "expandable",
          title: "ON placement vs WHERE in multi-joins",
          content:
            "The single-join rule scales: conditions that decide MATCHING belong in ON; conditions that filter the FINAL result belong in WHERE — and for preserved-side columns of a LEFT join, a WHERE condition silently converts it to INNER. In chains this becomes sneaky: WHERE p.category = 'audio' after a LEFT chain drops customers whose NULL-filled rows can't satisfy it. If the intent is 'keep everyone, match only audio items', the condition moves into the oi/p ON clauses: LEFT JOIN order_items oi ON oi.order_id = o.order_id LEFT JOIN products p ON p.product_id = oi.product_id AND p.category = 'audio'.",
        },
        {
          type: "expandable",
          title: "Debugging: count rows link by link",
          content:
            "When a multi-join result looks wrong, bisect it. Run SELECT COUNT(*) after each link: customers (1,000) → +orders (4,200 — fan-out, expected) → +order_items (11,350 — expected) → +products (9,780 — WRONG: a many-to-one join must not shrink the count; some product_ids are missing from products). A shrinking count on a many-to-one INNER join means referential holes — switch that link to LEFT and count the NULLs to quantify the damage. This five-minute ritual localizes virtually every join bug.",
        },
        {
          type: "text",
          content:
            "Bridge (junction) tables deserve a mention: many-to-many relationships — students↔courses, actors↔films — are stored as a third table of key pairs (enrollments). Traversing them is two joins by construction: students JOIN enrollments JOIN courses. If you meet a schema where 'one join' between two entities seems impossible, look for the bridge table; it's the designed path.",
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
        title: "A Four-Table Chain and Its Grain",
        caption:
          "Follow the baton: each join changes (or preserves) what one row means. Click each node — the grain annotation is the bug-prevention tool.",
        nodes: [
          {
            id: "customers",
            label: "customers",
            sublabel: "grain: 1 customer",
            detail:
              "1,000 rows, one per customer. The chain's anchor. If the report must include customers with no orders at all, every join in this chain must be LEFT from here on.",
            x: 8,
            y: 40,
            accent: false,
          },
          {
            id: "orders",
            label: "+ orders",
            sublabel: "grain: 1 order",
            detail:
              "ON o.customer_id = c.customer_id. One-to-many: the count grows from 1,000 to 4,200. Customer columns now REPEAT once per order — any SUM over a customer-level column is already unsafe.",
            x: 30,
            y: 40,
            accent: true,
          },
          {
            id: "items",
            label: "+ order_items",
            sublabel: "grain: 1 line item",
            detail:
              "ON oi.order_id = o.order_id. Fan-out again: 4,200 → 11,350. This is the finest grain in the chain — and the ONLY grain where quantity × unit_price can be summed directly.",
            x: 52,
            y: 40,
            accent: true,
          },
          {
            id: "products",
            label: "+ products",
            sublabel: "grain: unchanged",
            detail:
              "ON p.product_id = oi.product_id. Many-to-one enrichment: each item has exactly one product, so 11,350 rows stay 11,350. If the count DROPS here, order_items references product_ids missing from products — a referential-integrity finding, not a query bug.",
            x: 74,
            y: 40,
            accent: false,
          },
          {
            id: "groupby",
            label: "GROUP BY",
            sublabel: "country × category",
            detail:
              "The line-item grain collapses into the report grain. Because every measure summed (quantity × unit_price) lives at line-item grain, the totals are honest. Order-level measures (shipping fees) would need their own order-grain aggregation first.",
            x: 92,
            y: 40,
            accent: false,
          },
          {
            id: "trap",
            label: "Fan-out trap",
            sublabel: "coarse measure × fine grain",
            detail:
              "SUM(o.shipping_fee) at line-item grain counts each order's fee once PER ITEM — a 3-item order triples its fee. Symptom: totals exceed the source-of-truth report. Fix: aggregate each measure at its own grain (separate query or CTE), then join the aggregates.",
            x: 52,
            y: 78,
            accent: true,
          },
        ],
        edges: [
          { from: "customers", to: "orders", label: "1→N (×4.2)" },
          { from: "orders", to: "items", label: "1→N (×2.7)" },
          { from: "items", to: "products", label: "N→1 (×1.0)" },
          { from: "products", to: "groupby", label: "aggregate" },
          { from: "items", to: "trap", label: "if summing order-level cols" },
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
          title: "Three tables, one row of context",
          scenario:
            "Show each order item with its customer name and product name — the minimal three-way stitch.",
          steps: [
            {
              code: "SELECT c.name, o.order_id, p.product_name\nFROM orders o\nINNER JOIN customers c ON c.customer_id = o.customer_id\nINNER JOIN order_items oi ON oi.order_id = o.order_id\nINNER JOIN products p ON p.product_id = oi.product_id;",
              explanation:
                "Read it as the relay: orders gains customer names (many-to-one), fans out to items (one-to-many), gains product names (many-to-one). Note oi appears in no SELECT column — bridge tables often exist purely to connect, contributing keys, not output.",
            },
          ],
          output:
            " name  | order_id | product_name\n-------+----------+----------------\n Anna  |      101 | Wireless Mouse\n Anna  |      101 | USB-C Hub\n Ben   |      102 | Laptop Stand\n(3 rows)",
        },
        {
          difficulty: "Easy",
          title: "The four-table revenue rollup",
          scenario:
            "The headline question: revenue by product category for German customers.",
          steps: [
            {
              code: "SELECT p.category,\n       SUM(oi.quantity * oi.unit_price) AS revenue\nFROM customers c\nINNER JOIN orders o       ON o.customer_id = c.customer_id\nINNER JOIN order_items oi ON oi.order_id   = o.order_id\nINNER JOIN products p     ON p.product_id  = oi.product_id",
              explanation:
                "The full chain from the theory section. INNER everywhere is correct here: a customer with no orders, or an order with no items, contributes zero revenue and needn't appear.",
            },
            {
              code: "WHERE c.country = 'DE'\nGROUP BY p.category\nORDER BY revenue DESC;",
              explanation:
                "The country filter is a final-result condition on an INNER-joined table — WHERE is the right home. The summed measure lives at line-item grain, matching the pre-GROUP BY grain: honest totals.",
            },
          ],
          output:
            " category | revenue\n----------+----------\n audio    | 18450.00\n cables   |  6220.50\n storage  |  4180.25\n(3 rows)",
        },
        {
          difficulty: "Medium",
          title: "The LEFT-then-INNER trap",
          scenario:
            "Marketing wants ALL customers with their total spend — including never-purchasers at €0. The first attempt loses them.",
          steps: [
            {
              code: "-- BROKEN: never-purchasers vanish\nSELECT c.name, SUM(oi.quantity * oi.unit_price) AS spend\nFROM customers c\nLEFT  JOIN orders o       ON o.customer_id = c.customer_id\nINNER JOIN order_items oi ON oi.order_id   = o.order_id\nGROUP BY c.name;",
              explanation:
                "The LEFT join dutifully keeps order-less customers with o.* NULL — then the INNER join demands oi.order_id = o.order_id, which is unknown for NULL o.order_id, and drops exactly those rows. The chain's strictest link wins.",
            },
            {
              code: "-- FIXED: LEFT all the way down\nSELECT c.name,\n       COALESCE(SUM(oi.quantity * oi.unit_price), 0) AS spend\nFROM customers c\nLEFT JOIN orders o       ON o.customer_id = c.customer_id\nLEFT JOIN order_items oi ON oi.order_id   = o.order_id\nGROUP BY c.name\nORDER BY spend DESC;",
              explanation:
                "Once preservation is the requirement, every downstream link must be LEFT. SUM over an all-NULL group returns NULL, so COALESCE renders the intended €0. Cara — zero orders — now appears, which was the whole point.",
            },
          ],
          output:
            " name | spend\n------+---------\n Anna | 1240.00\n Ben  |  618.50\n Cara |    0\n(3 rows)",
        },
        {
          difficulty: "Hard",
          title: "Two grains, one report — without double counting",
          scenario:
            "Finance wants per-country: item revenue AND total shipping fees. Shipping lives on orders (coarse grain); revenue lives on items (fine grain). One naive chain over-counts shipping.",
          steps: [
            {
              code: "-- BROKEN: shipping fee repeats per item\nSELECT c.country,\n       SUM(oi.quantity * oi.unit_price) AS revenue,\n       SUM(o.shipping_fee)              AS shipping  -- inflated!\nFROM customers c\nJOIN orders o       ON o.customer_id = c.customer_id\nJOIN order_items oi ON oi.order_id   = o.order_id\nGROUP BY c.country;",
              explanation:
                "At line-item grain, a 3-item order's shipping_fee appears three times, so shipping is over-counted by exactly the average items-per-order factor. Revenue is fine — it lives at this grain. The bug ships silently: numbers are plausible, direction is right, magnitude is wrong.",
            },
            {
              code: "-- FIXED: aggregate each measure at its own grain\nSELECT co.country, co.revenue, so.shipping\nFROM (\n  SELECT c.country,\n         SUM(oi.quantity * oi.unit_price) AS revenue\n  FROM customers c\n  JOIN orders o       ON o.customer_id = c.customer_id\n  JOIN order_items oi ON oi.order_id   = o.order_id\n  GROUP BY c.country\n) co\nJOIN (\n  SELECT c.country, SUM(o.shipping_fee) AS shipping\n  FROM customers c\n  JOIN orders o ON o.customer_id = c.customer_id\n  GROUP BY c.country\n) so ON so.country = co.country;",
              explanation:
                "Each subquery aggregates at the measure's native grain — items for revenue, orders for shipping — and the final join combines two already-safe country-level results. Next module's CTEs will make this pattern far more readable; the structure is what matters: one grain per aggregation.",
            },
          ],
          output:
            " country | revenue  | shipping\n---------+----------+----------\n DE      | 48210.50 |  3120.00\n US      | 39975.00 |  2875.50\n(2 rows)",
        },
        {
          difficulty: "Industry Example",
          title: "Debugging a chain by counting links",
          scenario:
            "A marketplace analyst's four-table revenue query returns 8% less than the finance system. The link-by-link count ritual finds the leak in minutes.",
          steps: [
            {
              code: "SELECT COUNT(*) FROM orders o\nJOIN customers c ON c.customer_id = o.customer_id;\n-- 4,200 → matches orders count: every order has a customer ✓",
              explanation:
                "Link 1 checks out: many-to-one join preserved the order count, so customer references are intact.",
            },
            {
              code: "SELECT COUNT(*) FROM orders o\nJOIN customers c  ON c.customer_id = o.customer_id\nJOIN order_items oi ON oi.order_id = o.order_id;\n-- 11,350 → matches order_items count ✓",
              explanation:
                "Link 2 fans out exactly to the order_items row count — no items are orphaned from orders. Still healthy.",
            },
            {
              code: "SELECT COUNT(*) FROM orders o\nJOIN customers c  ON c.customer_id = o.customer_id\nJOIN order_items oi ON oi.order_id = o.order_id\nJOIN products p   ON p.product_id  = oi.product_id;\n-- 10,466 ← DROPPED 884 rows: the leak\n\nSELECT COUNT(*) FROM order_items oi\nLEFT JOIN products p ON p.product_id = oi.product_id\nWHERE p.product_id IS NULL;\n-- 884 line items reference product_ids absent from products",
              explanation:
                "A many-to-one join must never shrink the count — the 884-row drop means order_items references deleted/unloaded products, and INNER silently discarded their revenue. The anti-join (LEFT … WHERE IS NULL) quantifies it exactly. Short-term fix: LEFT JOIN products and report the orphans under an 'Unknown product' label; long-term fix: a foreign-key constraint, coming in the Database Design module.",
            },
          ],
          output:
            " count\n-------\n   884\n(1 row)",
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
          "Build the category report for one country. Tables: customers(customer_id, name, country), orders(order_id, customer_id), order_items(order_item_id, order_id, product_id, quantity, unit_price), products(product_id, product_name, category). Return category and revenue (SUM of quantity * unit_price) for customers in 'DE', sorted by revenue descending. Fill in the blanks.",
        starterCode:
          "-- customers: (1,'Anna','DE'), (2,'Ben','US')\n-- orders: (101,1), (102,2)\n-- order_items: (1,101,3,2,60.00), (2,101,1,1,4.50), (3,102,2,1,199.00)\n-- products: (1,'Cable','cables'), (2,'Speaker','audio'), (3,'Headphones','audio')\n\nSELECT p.category,\n       SUM(oi.quantity * oi.unit_price) AS revenue\nFROM customers c\nINNER JOIN orders o       ON o.customer_id = ___.customer_id\nINNER JOIN order_items oi ON oi.___   = o.order_id\nINNER JOIN products p     ON p.product_id  = ___.product_id\nWHERE c.country = ___\nGROUP BY p.category\nORDER BY revenue DESC;",
        solutionCode:
          "-- customers: (1,'Anna','DE'), (2,'Ben','US')\n-- orders: (101,1), (102,2)\n-- order_items: (1,101,3,2,60.00), (2,101,1,1,4.50), (3,102,2,1,199.00)\n-- products: (1,'Cable','cables'), (2,'Speaker','audio'), (3,'Headphones','audio')\n\nSELECT p.category,\n       SUM(oi.quantity * oi.unit_price) AS revenue\nFROM customers c\nINNER JOIN orders o       ON o.customer_id = c.customer_id\nINNER JOIN order_items oi ON oi.order_id   = o.order_id\nINNER JOIN products p     ON p.product_id  = oi.product_id\nWHERE c.country = 'DE'\nGROUP BY p.category\nORDER BY revenue DESC;",
        expectedOutput:
          " category | revenue\n----------+---------\n audio    | 120.00\n cables   |   4.50\n(2 rows)",
        hints: [
          "Four blanks: three join-key references and one string literal.",
          "Each ON connects the NEW table's key to a table already in the chain: orders→customers, order_items→orders, products→order_items.",
          "The country filter is a string in single quotes: 'DE'.",
          "Anna (DE) bought item 3 (Headphones, audio: 2×60 = 120) and item 1 (Cable, cables: 4.50). Ben's US speaker must not appear.",
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
          id: "sql11_mcq_01",
          difficulty: "Easy",
          question:
            "In FROM a JOIN b ON … JOIN c ON …, what may c's ON condition reference?",
          options: [
            "Columns of c only",
            "Columns of b and c only",
            "Columns of a, b, and c",
            "Any table in the database",
          ],
          correctIndex: 2,
          explanation:
            "Joins compose left to right: by the time c joins, the intermediate result already contains a and b, so c's ON may reference all three. This is what lets a chain 'skip' tables (joining c to a directly). It cannot reference tables not yet introduced in the FROM clause — including later joins or unrelated tables.",
        },
        {
          type: "mcq",
          id: "sql11_mcq_02",
          difficulty: "Easy",
          question:
            "customers (1,000 rows) INNER JOIN orders (4,200 rows, every order has a valid customer) produces how many rows?",
          options: ["1,000", "4,200", "5,200", "4,200,000"],
          correctIndex: 1,
          explanation:
            "A one-to-many join lands at the many side's grain: one row per order, customer columns repeating. 1,000 forgets the fan-out; 5,200 wrongly adds the tables (joins don't concatenate — that's UNION's job); 4.2M would be the CROSS JOIN (every pair), which only happens when the ON clause is missing or always true.",
        },
        {
          type: "mcq",
          id: "sql11_mcq_03",
          difficulty: "Medium",
          question:
            "After the chain orders → order_items (line-item grain), which aggregate is INFLATED?",
          options: [
            "SUM(oi.quantity * oi.unit_price)",
            "SUM(o.shipping_fee)",
            "COUNT(DISTINCT o.order_id)",
            "MIN(oi.unit_price)",
          ],
          correctIndex: 1,
          explanation:
            "shipping_fee is an order-grain measure; at line-item grain it repeats once per item, so its SUM over-counts multi-item orders. The item-revenue SUM lives at exactly this grain — safe. COUNT(DISTINCT o.order_id) collapses repeats by design — safe, and the standard way to count coarse entities at a fine grain. MIN is idempotent over repeats — duplicated values can't change a minimum.",
        },
        {
          type: "mcq",
          id: "sql11_mcq_04",
          difficulty: "Medium",
          question:
            "customers LEFT JOIN orders … INNER JOIN order_items … — what happens to customers with zero orders?",
          options: [
            "They appear with NULL item columns",
            "They are dropped: the INNER join can't match their NULL order_id",
            "They appear once per product",
            "The query fails to parse",
          ],
          correctIndex: 1,
          explanation:
            "The LEFT join preserves them with o.* NULL-filled — but the next link's condition oi.order_id = o.order_id evaluates to unknown for NULL o.order_id, and INNER drops non-matches. The preservation was undone one link later. To keep them, the order_items join must also be LEFT. Nothing about the mix is a syntax error — that's what makes the trap silent.",
        },
        {
          type: "scenario",
          id: "sql11_sc_01",
          difficulty: "Hard",
          scenario:
            "An analyst joins orders → order_items → products with INNER joins to compute total revenue. The result is 8% below the finance system's number. Link-by-link counts show the row count DROPPING when the products table joins on.",
          question: "What does the dropping count reveal, and what is the right immediate fix?",
          options: [
            "Fan-out is duplicating rows; switch all joins to LEFT",
            "order_items rows reference product_ids missing from products, and INNER silently discards their revenue; LEFT JOIN products and bucket the orphans as 'Unknown product'",
            "The GROUP BY is wrong; revenue queries need DISTINCT",
            "Finance's number includes tax; add a tax column",
          ],
          correctIndex: 1,
          explanation:
            "A many-to-one enrichment join must preserve the row count; shrinkage means referential holes — items pointing at deleted or never-loaded products — and INNER throws their revenue away, exactly matching an unexplained shortfall. LEFT JOIN keeps the revenue and NULL product columns label the orphans for follow-up; a foreign-key constraint prevents recurrence. Fan-out INCREASES counts, the opposite symptom. DISTINCT and tax hypotheses don't explain a count drop at one specific link — which is the whole diagnostic value of counting per link.",
        },
        {
          type: "coding",
          id: "sql11_code_01",
          difficulty: "Hard",
          prompt:
            "List ALL customers with the number of distinct products they've ever bought (product_count) — customers with no purchases must appear with 0. Tables: customers(customer_id, name), orders(order_id, customer_id), order_items(order_item_id, order_id, product_id). Sort by product_count descending, then name ascending.",
          starterCode:
            "-- customers: (1,'Anna'), (2,'Ben'), (3,'Cara')\n-- orders: (101,1), (102,1), (103,2)\n-- order_items: (1,101,3), (2,101,7), (3,102,3), (4,103,5)\n\n",
          solutionCode:
            "SELECT c.name,\n       COUNT(DISTINCT oi.product_id) AS product_count\nFROM customers c\nLEFT JOIN orders o       ON o.customer_id = c.customer_id\nLEFT JOIN order_items oi ON oi.order_id   = o.order_id\nGROUP BY c.name\nORDER BY product_count DESC, name ASC;",
          expectedOutput:
            " name | product_count\n------+---------------\n Anna |             2\n Ben  |             1\n Cara |             0\n(3 rows)",
          tests: [
            {
              name: "LEFT all the way down",
              description: "Both joins are LEFT, so Cara (no orders) survives to the result",
            },
            {
              name: "DISTINCT products",
              description: "Anna bought product 3 twice but counts 2 distinct products (3 and 7), not 3 items",
            },
            {
              name: "Zero rendering",
              description: "COUNT over Cara's all-NULL group returns 0 (COUNT ignores NULLs — no COALESCE needed)",
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
            "Walk me through writing a 'revenue by category per country' query over a customers/orders/order_items/products schema. What do you watch for?",
          answer:
            "I anchor on customers, join orders on customer_id, fan out to order_items on order_id, and enrich with products on product_id — INNER throughout, since entities without matches contribute no revenue. The thing I actively track is the grain after each link: customer → order → line item → line item. The measure I sum, quantity × unit_price, lives at line-item grain, which matches the pre-aggregation grain, so the totals are honest; if the report also needed an order-grain measure like shipping fees, I'd aggregate that separately at order grain and join the two aggregates rather than summing a repeated value. Before shipping the number I run one reconciliation: the query's grand total against a single-table SUM over order_items — if they differ, some link is dropping or duplicating rows and I count link by link to find it.",
        },
        {
          question:
            "What is the LEFT-then-INNER trap in join chains, and how do you avoid it?",
          answer:
            "It's the pattern where a LEFT join preserves unmatched rows — say customers without orders — and a subsequent INNER join destroys that preservation: the preserved rows carry NULL join keys, the next ON condition evaluates to unknown for them, and INNER drops them. The query compiles, runs, and quietly excludes exactly the rows the LEFT was written to keep. The rule I apply: once any link is LEFT because preservation is a requirement, every later link that hangs off the nullable side must also be LEFT, and NULL-sensitive conditions on those tables must live in ON rather than WHERE for the same reason. In review, a LEFT followed by an INNER on the same chain branch is an automatic question: either the LEFT is unnecessary (make it INNER for clarity) or the INNER is a bug (make it LEFT). The mixed form is almost never intentional.",
        },
        {
          question:
            "A multi-join query returns totals that don't match the source system. Describe your debugging process.",
          answer:
            "First I classify the direction: too high suggests fan-out (duplicated rows inflating SUMs), too low suggests dropped rows (INNER joins over referential holes, or an over-eager WHERE demoting a LEFT join). Then I bisect with link-by-link COUNT(*)s, adding one join at a time. Expectations per link type: one-to-many should grow the count to the child table's size; many-to-one should preserve it exactly. A many-to-one link that shrinks the count means missing reference rows — quantified precisely with an anti-join (LEFT JOIN … WHERE key IS NULL). A link that grows more than expected means duplicate keys on the 'one' side — checked with COUNT(*) vs COUNT(DISTINCT key). For inflation bugs I also re-derive the grain of every summed measure; an order-level column summed at item grain is the classic silent multiplier. This ritual localizes the defect to a single link in minutes, and the fix — LEFT instead of INNER, deduplication, or per-grain aggregation — follows directly from which check failed.",
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
        "1) Summing a coarse-grain measure at a fine grain — order-level shipping fees repeated per line item silently inflate totals; aggregate each measure at its own grain. 2) LEFT then INNER on the same branch — the INNER re-drops the rows the LEFT preserved; once LEFT, stay LEFT downstream. 3) WHERE conditions on nullable-side columns of a LEFT chain — they demote it to INNER; move them into ON. 4) Trusting a many-to-one join that shrinks the row count — that's referential holes discarding data, not normal behavior; anti-join to quantify. 5) t1/t2/t3 aliases in four-table queries — unreadable ON clauses hide reversed keys; alias by role (c, o, oi, p) and align the ONs.",
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
        "Try these prompts in the AI Tutor panel: • 'ELI5: join chains with a relay-race analogy of your own.' • 'Quiz me: a four-table chain with row counts — I predict the count after each link.' • 'Show me the LEFT-then-INNER trap on a tiny dataset and both fixes.' • 'Explain why SUM(shipping_fee) inflates at line-item grain and the two-grain fix.' • 'Interview mode: give me a wrong multi-join total and have me debug it link by link.'",
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
        "Join chain — successive JOIN … ON clauses composing left to right. Intermediate result — the logical table existing after each link; the next ON may reference any of its columns. Grain — what one row represents; changes at one-to-many links, preserved at many-to-one links. Fan-out — row multiplication at a one-to-many link. Enrichment join — a many-to-one join adding columns without changing grain. Referential hole — a foreign-key value with no matching parent row; shrinks INNER many-to-one joins. Anti-join — LEFT JOIN … WHERE key IS NULL; isolates unmatched rows. Bridge (junction) table — a key-pair table implementing many-to-many; always traversed with two joins. LEFT-then-INNER trap — an INNER link re-dropping rows a prior LEFT preserved. Per-grain aggregation — summing each measure at its native grain before combining. Link-by-link counting — the debugging ritual of COUNT(*) after each join.",
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
        "• Docs: PostgreSQL manual — 'Joined Tables' covers chain composition and mixed join types formally. • Read: Kimball's star-schema material (The Data Warehouse Toolkit, ch. 1–2) to see multi-join rollups as the intended usage pattern of dimensional models. • Practice: on any 3+ table schema, write a rollup, then deliberately break it (swap one LEFT for INNER, sum a coarse measure) and confirm you can detect both by counting and reconciling. • Next in DSM: chains answer 'combine and roll up' — Subqueries, opening the Advanced module, let one query ask questions ABOUT another's results.",
    },

    /* ---------------------------------------------------------------- */
    /*  12 — Recap                                                       */
    /* ---------------------------------------------------------------- */
    {
      id: "recap",
      type: "recap",
      tocLabel: "Recap",
      content:
        "✓ Joins chain left to right; each ON may reference every table already introduced.\n✓ Track the grain after every link: one-to-many changes it (fan-out), many-to-one preserves it.\n✓ Sum each measure at its native grain — coarse measures repeated at fine grain silently inflate totals; COUNT(DISTINCT key) counts coarse entities safely.\n✓ Once a link is LEFT for preservation, every downstream link on that branch must be LEFT — an INNER re-drops the preserved rows.\n✓ A many-to-one INNER join that shrinks the count reveals referential holes; quantify with an anti-join, patch with LEFT, prevent with constraints.\n✓ Debug multi-joins by counting rows link by link — the failing link identifies itself.\n\nNext up: Subqueries. You can now assemble any flat question from many tables — the Advanced module begins with queries nested inside queries: filtering by another query's answer, comparing rows to aggregates, and the correlated form interviewers love.",
    },
  ],
};
