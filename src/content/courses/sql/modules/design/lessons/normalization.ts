import type { Lesson } from "@/lib/curriculum/types";

export const normalization: Lesson = {
  meta: {
    id: "sql.design.normalization",
    slug: "normalization",
    title: "Normalization",
    description:
      "Walk one messy spreadsheet-table through 1NF, 2NF, and 3NF, learn the anomalies each form kills, and when analytics warehouses deliberately denormalize.",
    estimatedTime: "35 mins",
    difficulty: "Intermediate",
    xpReward: 80,
    prerequisites: ["sql.design.database-design-concepts"],
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
        hook: "A customer changes their email, and your UPDATE touches 47 rows — one per order they ever placed. Miss one and the database now holds two 'truths'. That bug wasn't in the query; it was in the schema, planted the day someone stored the email 47 times.",
        what: "Normalization is a series of increasingly strict rules — normal forms — for organizing columns into tables so every fact is stored exactly once. You'll walk one messy table through First, Second, and Third Normal Form (1NF, 2NF, 3NF), see the update/insert/delete anomalies each step eliminates, and learn why analytics systems sometimes walk deliberately back down the ladder (denormalization).",
        why: "Redundancy is where data corruption breeds: every duplicated fact is an extra copy that can drift out of sync. Normalized schemas make inconsistency structurally impossible instead of procedurally avoided. And as an analyst you live downstream of these decisions — reading an ERD, predicting which JOINs you'll need, and recognizing when a 'weird' schema is actually 3NF doing its job are daily skills. It's also a top-five SQL interview topic.",
        whereUsed:
          "Every OLTP schema design review, data-modeling interviews, debugging 'two sources of truth' incidents, and — in reverse — the star schemas of analytics warehouses, which denormalize on purpose and expect you to know what they traded away.",
        objectives: [
          "Spot update, insert, and delete anomalies in a denormalized table",
          "Apply 1NF: atomic values, no repeating groups",
          "Apply 2NF: remove partial dependencies on part of a composite key",
          "Apply 3NF: remove transitive dependencies between non-key columns",
          "Explain when and why warehouses denormalize (star schemas, one big table)",
        ],
        realWorldApps: [
          {
            company: "Stripe",
            headline: "Money demands one source of truth",
            detail:
              "Payment ledgers are strictly normalized — an account balance derived from immutable ledger entries, never stored redundantly — because a drifted duplicate in financial data is an incident, not a quirk.",
          },
          {
            company: "Amazon",
            headline: "Price frozen at order time",
            detail:
              "Order lines store the price paid alongside a product reference — controlled, deliberate redundancy — because the product's CURRENT price keeps changing while the historical fact of what you paid must not.",
          },
          {
            company: "Fivetran",
            headline: "Sync normalized, analyze denormalized",
            detail:
              "Ingestion pipelines land source systems in normalized form for fidelity, then dbt models JOIN them into wide denormalized marts — both halves of this lesson, operating as an assembly line.",
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
            "Start with the disease. One flat table: orders(order_id, customer_name, customer_email, product_name, product_category, unit_price). Three anomalies live here. UPDATE anomaly: changing Anna's email means editing every row she appears in — miss one, get two truths. INSERT anomaly: you can't add a new product until someone orders it (no order row to carry it). DELETE anomaly: cancel Ben's only order and Ben vanishes from the database entirely. All three share one root cause: facts about customers and products are stored per-ORDER instead of once.",
        },
        {
          type: "analogy",
          title: "The contact-card analogy",
          content:
            "Storing a friend's phone number in every text thread you share would mean a number change forces edits everywhere — miss a thread, dial a dead number. Your phone stores the number ONCE, in a contact card, and threads just point at the contact. Normalization is exactly this: each fact gets one home (its own table), and everything else references it by key. Update the contact card, and every thread is instantly right.",
        },
        {
          type: "keypoint",
          title: "1NF — atomic values, no repeating groups",
          content:
            "First Normal Form: every cell holds ONE value, and there are no repeating column groups (item1, item2, item3…). A cell containing 'Mouse, Keyboard, Webcam' fails — you can't JOIN on it, index it, or count it without string surgery. Fix: one row per value, or a separate child table. If you've ever fought a comma-separated column with SPLIT_PART, you've paid the 1NF-violation tax personally.",
        },
        {
          type: "keypoint",
          title: "2NF — no partial dependencies",
          content:
            "Second Normal Form (assumes 1NF): every non-key column must depend on the WHOLE primary key, not part of it. This only bites with composite keys. In order_items(order_id, product_id, quantity, product_name), the key is (order_id, product_id) — but product_name depends on product_id ALONE. That's a partial dependency: the product's name is re-stored for every order containing it. Fix: move product facts to a products table; order_items keeps only what depends on the pair (like quantity).",
        },
        {
          type: "keypoint",
          title: "3NF — no transitive dependencies",
          content:
            "Third Normal Form (assumes 2NF): non-key columns may not depend on OTHER non-key columns. In customers(customer_id, city, country), if city determines country, then country depends on customer_id only THROUGH city — transitively. Berlin's country is stored once per Berlin customer, and a typo makes Berlin/Germany coexist with Berlin/Genmany. Fix: cities(city, country) table, customers keep the city reference. The classic summary: every non-key column depends on the key (1NF), the whole key (2NF), and nothing but the key (3NF) — 'so help me Codd'.",
        },
        {
          type: "code-note",
          code: "-- The 3NF destination for our e-commerce data\nCREATE TABLE customers (\n  customer_id SERIAL PRIMARY KEY,\n  name  TEXT NOT NULL,\n  email TEXT NOT NULL UNIQUE\n);\nCREATE TABLE products (\n  product_id SERIAL PRIMARY KEY,\n  name     TEXT NOT NULL,\n  category TEXT NOT NULL,\n  unit_price NUMERIC(10,2) NOT NULL\n);\nCREATE TABLE orders (\n  order_id SERIAL PRIMARY KEY,\n  customer_id INT NOT NULL REFERENCES customers,\n  created_at TIMESTAMP NOT NULL DEFAULT NOW()\n);\nCREATE TABLE order_items (\n  order_id   INT REFERENCES orders,\n  product_id INT REFERENCES products,\n  quantity   INT NOT NULL,\n  price_at_purchase NUMERIC(10,2) NOT NULL,\n  PRIMARY KEY (order_id, product_id)\n);",
          content:
            "The schema you've queried all course IS the normalized answer: each entity in its own table, relationships via foreign keys, the order_items junction resolving the many-to-many. Note price_at_purchase — deliberate, principled redundancy: the price PAID is a fact about the order line (historical), distinct from the product's current price. Normalization forbids storing the SAME fact twice, not two different facts that happen to look alike.",
        },
        {
          type: "text",
          content:
            "Normalization's cost is JOINs: the flat table answered 'orders with customer emails' with zero JOINs; 3NF needs two or three. For OLTP systems — many small concurrent writes — that trade is overwhelmingly right: writes touch one row, consistency is structural. For OLAP — few writers, huge reads — the math flips. Analytics warehouses routinely DENORMALIZE: pre-join dimensions into a star schema (a central fact table of events/transactions ringed by wide dimension tables), or even One Big Table, accepting redundancy because data is loaded by pipeline (one controlled writer, so drift risk is managed) and read by thousands of queries that shouldn't each pay for five JOINs.",
        },
        {
          type: "warning",
          title: "Denormalize by decision, not by drift",
          content:
            "'We denormalized for performance' is legitimate engineering. 'The schema grew a copy of customer_name in six tables and nobody remembers why' is rot. The difference is a single authoritative source plus a rebuild path: warehouse marts can be dropped and regenerated from normalized sources at any time. If redundant copies are hand-maintained by application code, you've re-invited every anomaly this lesson exists to kill. Rule: normalize the system of record; denormalize only derived, regenerable layers.",
        },
        {
          type: "expandable",
          title: "Beyond 3NF: BCNF and friends",
          content:
            "Boyce-Codd Normal Form (BCNF) is a stricter 3NF covering edge cases where a table has multiple overlapping candidate keys — rare in practice, occasionally an interview flex. 4NF and 5NF address multi-valued and join dependencies; almost no production schema consciously targets them. Industry reality: OLTP designs aim for 3NF and stop, then denormalize tactically with measurements in hand. Knowing 1NF→3NF cold plus 'BCNF exists for overlapping candidate keys' covers essentially every interview.",
        },
        {
          type: "expandable",
          title: "Functional dependency, the formal underpinning",
          content:
            "The notation X → Y reads 'X functionally determines Y': knowing X fixes exactly one Y. product_id → product_name; city → country. All normal forms are statements about where dependencies are allowed to point: 2NF bans dependencies on PART of a key (partial), 3NF bans key → A → B chains (transitive). Sketching a table's dependencies as arrows makes normalization mechanical — every arrow not starting at the full key marks the next table to split off. This is also the cleanest vocabulary to use in interviews.",
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
        title: "One Table's Journey to 3NF",
        caption:
          "The same order data at each rung of the ladder. Click each stage to see which anomaly it cures — and what warehouses do at the end.",
        nodes: [
          {
            id: "flat",
            label: "Flat table",
            sublabel: "everything in one",
            detail:
              "orders(order_id, customer_name, customer_email, products_csv, …). Spreadsheet thinking: easy to read, riddled with anomalies — update (email in N rows), insert (no product without an order), delete (last order erases the customer).",
            x: 8,
            y: 45,
            accent: true,
          },
          {
            id: "onf",
            label: "1NF",
            sublabel: "atomic cells",
            detail:
              "'Mouse, Keyboard' split into one row per item — no multi-value cells, no item1/item2/item3 column groups. Now countable, joinable, indexable. Redundancy actually INCREASES here (customer repeated per item row) — 1NF fixes shape, not duplication; that's the next rungs' job.",
            x: 30,
            y: 20,
            accent: false,
          },
          {
            id: "tnf",
            label: "2NF",
            sublabel: "whole-key deps",
            detail:
              "Key is (order_id, product_id); product_name depends on product_id alone → partial dependency → products table split off. Order lines keep quantity — a fact about the PAIR. Product renames now touch one row.",
            x: 52,
            y: 20,
            accent: false,
          },
          {
            id: "thnf",
            label: "3NF",
            sublabel: "nothing but the key",
            detail:
              "customer city → country chain broken into a reference table; every non-key column now depends on the key, the whole key, and nothing but the key. All three anomalies structurally dead. This is the standard OLTP destination.",
            x: 74,
            y: 20,
            accent: true,
          },
          {
            id: "oltp",
            label: "System of record",
            sublabel: "stays 3NF",
            detail:
              "The transactional database keeps the normalized form: concurrent writers, row-level updates, constraints enforcing one truth. This is what the application reads and writes.",
            x: 88,
            y: 50,
            accent: false,
          },
          {
            id: "star",
            label: "Warehouse mart",
            sublabel: "denormalized copy",
            detail:
              "Pipelines JOIN the 3NF sources back into wide fact/dimension tables (star schema) for analytics — redundancy accepted because the mart is derived and regenerable, with the normalized system of record as the single truth beneath it. Down the ladder, on purpose, with a safety rope.",
            x: 88,
            y: 80,
            accent: false,
          },
        ],
        edges: [
          { from: "flat", to: "onf", label: "split cells" },
          { from: "onf", to: "tnf", label: "split partial deps" },
          { from: "tnf", to: "thnf", label: "split transitive deps" },
          { from: "thnf", to: "oltp", label: "serve app" },
          { from: "oltp", to: "star", label: "derive for analytics" },
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
          title: "Diagnosing the anomalies",
          scenario:
            "A startup tracks everything in one table. Before fixing it, name what will go wrong — anomaly-spotting is the skill interviews probe first.",
          steps: [
            {
              code: "-- orders_flat\n-- order_id | customer_name | customer_email    | product_name | unit_price\n-- 1        | Anna Müller   | anna@gmail.com    | Mouse        | 25.00\n-- 2        | Anna Müller   | anna@gmail.com    | Keyboard     | 45.00\n-- 3        | Ben Okafor    | ben@yahoo.com     | Mouse        | 25.00",
              explanation:
                "Read the redundancy: Anna's email twice, the Mouse's price twice. UPDATE anomaly — Anna's new email must change in rows 1 AND 2. INSERT anomaly — a new 'Webcam' product can't exist until ordered. DELETE anomaly — remove order 3 and Ben is gone from the business entirely. Each duplicated fact is a drift waiting for a deadline.",
            },
          ],
          output:
            "-- Anomalies found:\n-- UPDATE: customer email stored once per order (rows 1,2)\n-- INSERT: cannot add a product with zero orders\n-- DELETE: deleting order 3 erases customer Ben",
        },
        {
          difficulty: "Easy",
          title: "Reaching 1NF",
          scenario:
            "Worse: someone 'saved space' by packing items into one cell. Restore atomicity.",
          steps: [
            {
              code: "-- Before (violates 1NF):\n-- order_id | customer  | items\n-- 1        | Anna      | 'Mouse, Keyboard'\n-- 2        | Ben       | 'Mouse'\n\n-- After (1NF): one row per value\n-- order_id | customer | item\n-- 1        | Anna     | Mouse\n-- 1        | Anna     | Keyboard\n-- 2        | Ben      | Mouse",
              explanation:
                "Multi-value cells make SQL's core operations lie: COUNT(*) counts orders not items, JOIN to products is impossible, WHERE items = 'Mouse' misses row 1. Splitting to one row per item restores countability and joinability. Notice customer names now repeat MORE — 1NF often increases redundancy. That's expected: 1NF fixes cell shape; 2NF/3NF handle duplication.",
            },
          ],
          output:
            "-- 1NF achieved: every cell atomic, no repeating groups\n-- SELECT COUNT(*) WHERE item = 'Mouse' → 2  (correct at last)",
        },
        {
          difficulty: "Medium",
          title: "Reaching 2NF: evicting the partial dependency",
          scenario:
            "order_items(order_id, product_id, quantity, product_name, unit_price) with key (order_id, product_id). Find the columns that don't depend on the whole key and rehome them.",
          steps: [
            {
              code: "-- Dependency check against key (order_id, product_id):\n--   quantity     → depends on the PAIR ✓ (how many of THIS product in THIS order)\n--   product_name → depends on product_id alone ✗ partial\n--   unit_price   → depends on product_id alone ✗ partial",
              explanation:
                "The test is one question per column: 'do I need BOTH key parts to know this value?' Quantity, yes — it's a fact about the pairing. Name and price, no — product_id alone determines them, so they're re-stored for every order containing the product: rename a product once, update a thousand rows.",
            },
            {
              code: "CREATE TABLE products (\n  product_id SERIAL PRIMARY KEY,\n  name       TEXT NOT NULL,\n  unit_price NUMERIC(10,2) NOT NULL\n);\n\nCREATE TABLE order_items (\n  order_id   INT NOT NULL REFERENCES orders,\n  product_id INT NOT NULL REFERENCES products,\n  quantity   INT NOT NULL,\n  PRIMARY KEY (order_id, product_id)\n);",
              explanation:
                "Product facts move to a products table keyed by product_id alone — each fact now lives where its key naturally points. order_items shrinks to pure pair-facts. The JOIN you'll write to reunite them isn't overhead; it's the receipt for update-anomaly immunity.",
            },
          ],
          output:
            "-- 2NF achieved: every non-key column depends on the WHOLE key\n-- Product rename now: UPDATE products SET name=... WHERE product_id=4  (1 row)",
        },
        {
          difficulty: "Hard",
          title: "Reaching 3NF: the transitive chain",
          scenario:
            "customers(customer_id, name, city, country, shipping_zone) — and the ops team just found 'Berlin/Germany' AND 'Berlin/Genmany' in production. Diagnose and normalize.",
          steps: [
            {
              code: "-- Dependencies:\n--   customer_id → city                (fact about the customer)\n--   city → country                    (fact about the CITY)\n--   country → shipping_zone           (fact about the COUNTRY)\n-- customer_id → city → country → shipping_zone  = transitive chain",
              explanation:
                "country doesn't describe the customer — it describes the customer's city. That's a dependency between two NON-key columns, which 3NF forbids. The typo'd 'Genmany' is the anomaly made flesh: geography facts stored once per customer means N chances to store them wrong, and no constraint can catch it because each row is individually 'valid'.",
            },
            {
              code: "CREATE TABLE countries (\n  country TEXT PRIMARY KEY,\n  shipping_zone TEXT NOT NULL\n);\nCREATE TABLE cities (\n  city    TEXT PRIMARY KEY,\n  country TEXT NOT NULL REFERENCES countries\n);\nCREATE TABLE customers (\n  customer_id SERIAL PRIMARY KEY,\n  name TEXT NOT NULL,\n  city TEXT NOT NULL REFERENCES cities\n);",
              explanation:
                "Each link of the chain becomes its own table; the REFERENCES constraints now make 'Genmany' structurally impossible — inserting a city with an unknown country is an error at write time, not a surprise in the quarterly report. Queries pay two JOINs to get a customer's shipping zone; correctness stops being anyone's discipline and becomes the schema's guarantee. (Purists note city names collide across countries — a surrogate city_id would be the production touch.)",
            },
          ],
          output:
            "-- 3NF achieved: no transitive dependencies\n-- INSERT INTO cities VALUES ('Berlin','Genmany')\n-- ERROR: violates foreign key constraint — the typo is now impossible",
        },
        {
          difficulty: "Industry Example",
          title: "Down the ladder on purpose: building a mart",
          scenario:
            "An analytics engineer at a retailer serves a dashboard hammered by 500 daily queries, each joining 4 tables. She builds a denormalized mart — the professional way.",
          steps: [
            {
              code: "CREATE TABLE mart.order_lines AS\nSELECT\n  o.order_id, o.created_at,\n  c.customer_id, c.name AS customer_name, c.segment,\n  p.product_id, p.name AS product_name, p.category,\n  oi.quantity, oi.price_at_purchase,\n  oi.quantity * oi.price_at_purchase AS line_revenue\nFROM orders o\nJOIN customers   c ON c.customer_id = o.customer_id\nJOIN order_items oi ON oi.order_id  = o.order_id\nJOIN products    p ON p.product_id  = oi.product_id;",
              explanation:
                "The four-way JOIN runs ONCE, at build time, instead of 500 times a day. The result is flagrantly un-normalized — customer_name repeated per line, category per product per order — and that's fine, because of what comes next.",
            },
            {
              code: "-- Nightly rebuild (dbt/Airflow):\n--   DROP TABLE mart.order_lines;\n--   CREATE TABLE mart.order_lines AS SELECT ... ;\n-- Dashboards read the mart; nothing ever UPDATEs it.\nSELECT category, DATE_TRUNC('month', created_at) AS month,\n       SUM(line_revenue) AS revenue\nFROM mart.order_lines\nGROUP BY 1, 2;",
              explanation:
                "Why no anomalies return: the mart has ONE writer (the pipeline), zero hand-edits, and a rebuild path from the still-normalized system of record — redundancy without drift risk. Dashboard queries collapse to single-table GROUP BYs. This division of labor — 3NF where data is BORN, star/wide marts where data is ANALYZED — is the standard architecture at virtually every data-driven company.",
            },
          ],
          output:
            " category    | month               | revenue\n-------------+---------------------+----------\n Electronics | 2026-06-01 00:00:00 | 48210.00\n Accessories | 2026-06-01 00:00:00 | 12876.50\n(2 rows)",
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
          "A flat table enrollments_flat(student_id, student_name, course_id, course_title, instructor) has the composite key (student_id, course_id). course_title and instructor depend on course_id alone — a 2NF violation. Fill in the blanks to split out a courses table and rebuild a clean enrollments table.",
        starterCode:
          "-- Step 1: one row per course, facts that depend on course_id alone\nCREATE TABLE courses AS\nSELECT ___ course_id, course_title, instructor\nFROM enrollments_flat;\n\n-- Step 2: enrollments keep ONLY whole-key facts (the pairing itself)\nCREATE TABLE enrollments AS\nSELECT DISTINCT student_id, ___\nFROM enrollments_flat;\n\n-- Step 3: prove nothing was lost — rebuild the flat view\nSELECT e.student_id, c.course_id, c.course_title, c.instructor\nFROM enrollments e\n___ courses c ON c.course_id = e.course_id\nORDER BY e.student_id, c.course_id;",
        solutionCode:
          "-- Step 1: one row per course, facts that depend on course_id alone\nCREATE TABLE courses AS\nSELECT DISTINCT course_id, course_title, instructor\nFROM enrollments_flat;\n\n-- Step 2: enrollments keep ONLY whole-key facts (the pairing itself)\nCREATE TABLE enrollments AS\nSELECT DISTINCT student_id, course_id\nFROM enrollments_flat;\n\n-- Step 3: prove nothing was lost — rebuild the flat view\nSELECT e.student_id, c.course_id, c.course_title, c.instructor\nFROM enrollments e\nJOIN courses c ON c.course_id = e.course_id\nORDER BY e.student_id, c.course_id;",
        expectedOutput:
          " student_id | course_id | course_title | instructor\n------------+-----------+--------------+------------\n          1 | C01       | SQL Basics   | Rivera\n          1 | C02       | Statistics   | Chen\n          2 | C01       | SQL Basics   | Rivera\n(3 rows)",
        hints: [
          "Three blanks: a keyword that removes duplicate rows, the column that completes the enrollment pairing, and a join keyword.",
          "Extracting course facts from a table where they repeat per enrollment produces duplicates — DISTINCT collapses them to one row per course.",
          "An enrollment IS the (student_id, course_id) pair — that second column is what belongs beside student_id.",
          "Every enrollment has a matching course by construction, so a plain (INNER) JOIN reconstructs the original flat rows losslessly.",
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
          id: "sql18_mcq_01",
          difficulty: "Easy",
          question:
            "A table stores a customer's email once per order they placed. Changing the email requires updating many rows, and missing one leaves conflicting values. Which anomaly is this?",
          options: [
            "Insert anomaly",
            "Delete anomaly",
            "Update anomaly",
            "Join anomaly",
          ],
          correctIndex: 2,
          explanation:
            "Redundant storage means an UPDATE must find every copy — partial success leaves two truths, the definitive update anomaly. Insert anomalies block adding a fact (a product with no orders); delete anomalies destroy an unrelated fact (removing a last order erases the customer). 'Join anomaly' isn't one of the canonical three.",
        },
        {
          type: "mcq",
          id: "sql18_mcq_02",
          difficulty: "Easy",
          question:
            "A cell contains 'Mouse, Keyboard, Webcam'. Which normal form does this violate, and why does it matter?",
          options: [
            "3NF — it creates a transitive dependency",
            "1NF — values aren't atomic, so counting, joining, and filtering on items requires string surgery",
            "2NF — items depend on part of the key",
            "No violation — text columns may hold any string",
          ],
          correctIndex: 1,
          explanation:
            "First Normal Form demands one value per cell; a packed list defeats COUNT (rows ≠ items), JOIN (no key to match), and WHERE (equality misses list members), forcing SPLIT_PART-style surgery for basics. 2NF and 3NF are about which columns depend on which — they assume atomic cells already. And while the TYPE system allows any string, the modeling rule it breaks is exactly the point of 1NF.",
        },
        {
          type: "mcq",
          id: "sql18_mcq_03",
          difficulty: "Medium",
          question:
            "order_items(order_id, product_id, quantity, product_name) has key (order_id, product_id). What makes product_name a 2NF violation while quantity is fine?",
          options: [
            "product_name is text and text belongs in its own table",
            "product_name depends on product_id alone (partial dependency); quantity depends on the whole key pair",
            "quantity is numeric so it can stay anywhere",
            "product_name transitively depends on quantity",
          ],
          correctIndex: 1,
          explanation:
            "The 2NF test asks each non-key column: 'do you need the WHOLE key to be determined?' Quantity yes — it's how many of this product in this order, a pair-fact. product_name no — product_id alone fixes it, so it repeats per order and renames touch many rows. Data TYPE (text vs numeric) is irrelevant to normal forms, and no dependency runs through quantity.",
        },
        {
          type: "mcq",
          id: "sql18_mcq_04",
          difficulty: "Medium",
          question:
            "In customers(customer_id PK, name, city, country) where city determines country, what does 3NF prescribe?",
          options: [
            "Nothing — the table has a single-column key, so it's automatically 3NF",
            "Merge city and country into one 'location' column",
            "Split out cities(city, country); customers reference the city — non-key columns must not depend on other non-key columns",
            "Add an index on (city, country)",
          ],
          correctIndex: 2,
          explanation:
            "city → country is a dependency between two non-key columns: country reaches the key only transitively (customer_id → city → country), so Germany is re-stored per German customer and typos like 'Genmany' become possible. 3NF splits the chain into a reference table. Single-column keys rule out 2NF issues, not 3NF ones. Merging columns creates a 1NF-style packed value — backwards. Indexes affect speed, never dependency structure.",
        },
        {
          type: "scenario",
          id: "sql18_sc_01",
          difficulty: "Hard",
          scenario:
            "A reviewer flags order_items.price_at_purchase as 'redundant with products.unit_price — normalize it away'. The junior engineer is about to delete the column.",
          question: "What's the correct pushback?",
          options: [
            "The reviewer is right: 2NF requires deleting the column and joining to products for price",
            "Keep it: price_at_purchase is the price PAID (a fact about the order line, frozen at purchase time), while unit_price is the CURRENT price — two different facts, so no normalization rule is violated",
            "Keep it only if an index exists on it",
            "Move price_at_purchase into the customers table instead",
          ],
          correctIndex: 1,
          explanation:
            "Normalization forbids storing the same fact twice — not two facts that share a name. The price paid is historical and immutable, determined by (order_id, product_id) at purchase time; the catalog price is mutable and determined by product_id today. Delete the column and every past order's revenue silently rewrites whenever marketing runs a sale — a correctness bug dressed as cleanliness. This distinction (Amazon's order lines work exactly this way) is a favorite interview probe of whether you apply rules or understand them. Indexes are irrelevant, and customer tables have no business holding line prices.",
        },
        {
          type: "coding",
          id: "sql18_code_01",
          difficulty: "Hard",
          prompt:
            "You've normalized employees_flat(emp_id, emp_name, dept_name, dept_head) into departments(dept_id, dept_name, dept_head) and employees(emp_id, emp_name, dept_id). Write the audit query proving no drift existed: for each dept_name in employees_flat, count DISTINCT dept_head values, returning only departments where that count exceeds 1 (i.e. the flat table already held contradictory copies). Return dept_name and head_versions, ordered by dept_name.",
          starterCode:
            "-- employees_flat(emp_id, emp_name, dept_name, dept_head)\n-- Rows: (1,'Ana','Data','Chen'), (2,'Ben','Data','Chen'),\n--       (3,'Cara','Sales','Diaz'), (4,'Dev','Sales','Diáz'), (5,'Eli','Ops','Fox')\n\n",
          solutionCode:
            "SELECT\n  dept_name,\n  COUNT(DISTINCT dept_head) AS head_versions\nFROM employees_flat\nGROUP BY dept_name\nHAVING COUNT(DISTINCT dept_head) > 1\nORDER BY dept_name;",
          expectedOutput:
            " dept_name | head_versions\n-----------+---------------\n Sales     |             2\n(1 row)",
          tests: [
            {
              name: "Drift detection",
              description:
                "Sales appears with heads 'Diaz' and 'Diáz' → 2 versions; Data and Ops are consistent and excluded",
            },
            {
              name: "HAVING on the aggregate",
              description:
                "Filters groups by COUNT(DISTINCT dept_head) > 1 — a WHERE clause cannot do this",
            },
            {
              name: "Output shape",
              description: "Exactly dept_name and head_versions, ordered by dept_name",
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
          question: "Explain 1NF, 2NF, and 3NF to me with one running example.",
          answer:
            "Take enrollments(student_id, courses_csv, course_titles, advisor) where courses_csv holds 'C01,C02'. 1NF: atomic cells — split to one row per (student, course); now the key is composite (student_id, course_id) and rows are countable and joinable. 2NF: every non-key column must depend on the WHOLE key — course_title depends on course_id alone (partial dependency), so it moves to a courses table; the enrollment row keeps only pair-facts like a grade. 3NF: non-key columns can't depend on each other — if advisor is determined by the student's department (student → dept → advisor), that transitive chain splits into a departments table. The mnemonic ties it together: every non-key column depends on the key (1NF), the whole key (2NF), and nothing but the key (3NF). Each step kills a concrete anomaly: multi-value surgery, mass-update renames, and drifted duplicates respectively.",
        },
        {
          question:
            "When would you deliberately denormalize, and what guardrails do you insist on?",
          answer:
            "I denormalize derived, read-heavy layers — never the system of record. The canonical case is an analytics mart: dashboards running hundreds of queries a day shouldn't each pay a four-table JOIN, so a pipeline pre-joins orders, customers, and products into a wide table (or a star schema) at build time. The guardrails make it safe: (1) a single writer — the pipeline, never humans or application code hand-maintaining copies; (2) a rebuild path — the mart can be dropped and regenerated from the normalized source at any time, so drift is bounded by one refresh cycle; (3) the normalized source remains the arbiter when numbers disagree. Without those three, 'denormalization' is a euphemism for reintroducing update anomalies. I'd also mention measured need: denormalizing is an optimization, so I want evidence — query patterns, latency budgets — before paying the storage and freshness costs.",
        },
        {
          question:
            "A colleague argues 'storage is cheap, JOINs are annoying — why normalize at all in 2026?' Respond.",
          answer:
            "Storage cost was never the point — CONSISTENCY is. Normalization is what makes contradictory data structurally impossible: with the email stored once, 'which copy is right?' cannot arise; with it stored per-order, every update is a distributed transaction across N rows that application code must get right forever. The anomalies are concrete business bugs: renamed products that revert on old orders, customers erased by deleting their last order, geography typos coexisting with correct values. So for OLTP — concurrent writers, row-level updates — 3NF stays the default in 2026, and the JOIN 'annoyance' is the receipt for write-safety. Where the colleague is RIGHT is read-optimized derived layers: warehouses denormalize aggressively because a pipeline is the only writer and rebuilds cure drift. The mature position isn't normalize-everything or nothing: normalize where data is written, denormalize where it's read, and keep an arrow from the second back to the first.",
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
        "1) Packing lists into cells ('Mouse, Keyboard') — a 1NF violation that taxes every later query with string surgery. 2) Confusing 2NF and 3NF — 2NF is about depending on PART of a composite key; 3NF is about non-key→non-key chains; single-column keys can only have 3NF problems. 3) 'Normalizing away' legitimate historical facts like price_at_purchase — the price paid and the current price are different facts; deleting the column rewrites history on every sale. 4) Denormalizing the system of record instead of a derived layer — redundancy without a single writer and rebuild path resurrects every anomaly. 5) Reciting forms without naming anomalies — interviewers want the WHY (update/insert/delete anomalies), not a memorized ladder.",
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
        "Try these prompts in the AI Tutor panel: • 'ELI5 normalization with the contact-card analogy, then quiz me on the three anomalies.' • 'Give me a messy table and make me walk it to 3NF, checking each step.' • 'I'll name a column, you tell me if it's a partial, transitive, or legitimate dependency.' • 'Debate me: I'll argue for One Big Table, you defend 3NF — then switch sides.' • 'Interview mode: ask me when denormalization is appropriate and press on the guardrails.'",
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
        "Normalization — structuring tables so every fact is stored exactly once. Redundancy — the same fact stored in multiple places; the raw material of drift. Update / Insert / Delete anomalies — the three failure modes of redundant schemas: partial updates, facts you can't add alone, facts destroyed as collateral. 1NF — atomic cells, no repeating groups. Composite key — a primary key of multiple columns. Partial dependency — a non-key column determined by part of a composite key; banned by 2NF. Transitive dependency — key → A → B chain between non-key columns; banned by 3NF. Functional dependency (X → Y) — knowing X fixes exactly one Y; the formal language of normal forms. BCNF — stricter 3NF for overlapping candidate keys. Denormalization — deliberately reintroducing redundancy in derived, read-optimized layers. Star schema — warehouse pattern: central fact table ringed by wide dimension tables. System of record — the authoritative (normalized) source other layers are rebuilt from.",
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
        "• Read: 'Database Design for Mere Mortals' (Hernandez) — the gentlest serious treatment of normalization. • Watch: Decomplexify's 'Learn Database Normalization' on YouTube — the clearest 1NF→BCNF walkthrough available. • Reference: Kimball Group's dimensional modeling articles for the denormalized (star schema) side of the story. • Practice: find a spreadsheet you actually use, list its functional dependencies as arrows, and split it to 3NF on paper — then write the JOIN that reconstructs it. • Next in DSM: normalized schemas mean JOINs everywhere — Indexes & Query Optimization shows how databases keep those JOINs fast, and how EXPLAIN reveals what your query really costs.",
    },

    /* ---------------------------------------------------------------- */
    /*  12 — Recap                                                       */
    /* ---------------------------------------------------------------- */
    {
      id: "recap",
      type: "recap",
      tocLabel: "Recap",
      content:
        "✓ Redundancy breeds the three anomalies: update (drifted copies), insert (facts that can't exist alone), delete (collateral erasure).\n✓ 1NF: atomic cells, no repeating groups — packed lists defeat COUNT, JOIN, and WHERE.\n✓ 2NF: non-key columns depend on the WHOLE composite key — partial dependencies (product_name in order_items) split off.\n✓ 3NF: non-key columns depend on nothing but the key — transitive chains (city → country) split into reference tables.\n✓ Redundant-looking ≠ redundant: price_at_purchase vs unit_price are different facts; keep historical truth.\n✓ Normalize the system of record; denormalize only derived, regenerable layers (marts, star schemas) with a single writer and rebuild path.\n\nNext up: Indexes & Query Optimization. Normalization gave you JOIN-heavy schemas that are safe to write — now learn the B-trees, EXPLAIN plans, and sargability rules that make them fast to read.",
    },
  ],
};
