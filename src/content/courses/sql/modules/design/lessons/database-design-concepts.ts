import type { Lesson } from "@/lib/curriculum/types";

export const databaseDesignConcepts: Lesson = {
  meta: {
    id: "sql.design.database-design-concepts",
    slug: "database-design-concepts",
    title: "Database Design Concepts",
    description:
      "Learn how primary keys, foreign keys, and relationships turn a pile of tables into a coherent schema you can trust.",
    estimatedTime: "30 mins",
    difficulty: "Intermediate",
    xpReward: 70,
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
        hook: "Every duplicate customer record, every orphaned order, every report where the numbers don't add up traces back to one moment: the day someone designed the schema. In this lesson you step behind the SELECT statement and learn how tables are supposed to relate to each other — so you can design schemas that stay consistent, and read someone else's schema like a map instead of a maze.",
        what: "Database design is the practice of deciding which tables exist, which columns they hold, and how rows in one table connect to rows in another. The core tools are keys — a primary key uniquely identifies each row, a foreign key points from one table to a row in another — and relationships: one-to-one, one-to-many, and many-to-many.",
        why: "A schema is a contract. If orders.customer_id must match a real row in customers, the database can enforce that for you — no orphaned orders, ever. Without keys and relationships, every analyst query becomes an act of faith, and every join is a guess about which columns line up.",
        whereUsed:
          "Every relational system you will ever query — the OLTP (Online Transaction Processing) database behind an app, and the analytics warehouse you run reports against — is built from these concepts. Data scientists read ER diagrams weekly and design tables whenever they build a feature store or a reporting mart.",
        objectives: [
          "Explain what a primary key is and choose a good one for a table",
          "Use foreign keys to connect tables and describe what referential integrity guarantees",
          "Identify one-to-one, one-to-many, and many-to-many relationships in a real schema",
          "Resolve a many-to-many relationship with a junction table",
          "Sketch an entity-relationship (ER) model for a small business domain",
        ],
        realWorldApps: [
          {
            company: "Shopify",
            headline: "Millions of merchant schemas, one design",
            detail:
              "Shopify's core commerce schema — shops, products, variants, orders, line_items — is a textbook set of one-to-many relationships held together by foreign keys. Every order line points at exactly one order and one product variant.",
          },
          {
            company: "Airbnb",
            headline: "Guests, hosts, and bookings",
            detail:
              "A booking connects one guest to one listing for a date range. Reviews, payments, and messages all hang off the booking's primary key, so analysts can join the entire trip story from a single id.",
          },
          {
            company: "Stripe",
            headline: "Referential integrity for money",
            detail:
              "Every Stripe charge references a customer and a payment method by key. Foreign key discipline is why a charge can never point at a customer that does not exist — a property you badly want when the rows represent dollars.",
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
            "A table on its own is a spreadsheet. A schema — a set of tables plus the rules that connect them — is a database. The rules come in two flavors: keys, which identify rows, and constraints, which the database enforces so bad data physically cannot get in.",
        },
        {
          type: "keypoint",
          title: "Primary key (PK)",
          content:
            "A primary key is a column (or combination of columns) whose value uniquely identifies each row in a table. It must be unique and it must never be NULL. In PostgreSQL you usually declare it as id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY — a surrogate key the database generates for you, with no business meaning at all.",
        },
        {
          type: "analogy",
          title: "Keys are passport numbers, not names",
          content:
            "Two customers can both be named 'Maria Garcia', so a name is a terrible identifier. A passport number identifies exactly one person, forever, even if she changes her name. That's the difference between a natural attribute and a key. The analogy's limit: passports expire and get reissued — a good primary key never changes for the life of the row.",
        },
        {
          type: "keypoint",
          title: "Foreign key (FK)",
          content:
            "A foreign key is a column in one table that stores the primary key of a row in another table. orders.customer_id is a foreign key into customers.id. Declaring it with REFERENCES customers(id) makes the database enforce referential integrity: you cannot insert an order for a customer that does not exist, and you cannot delete a customer who still has orders (unless you say what should happen with ON DELETE).",
        },
        {
          type: "text",
          content:
            "Relationships come in three shapes. One-to-one: each row in A matches at most one row in B (a user and their user_profile). One-to-many: one row in A matches many rows in B (one customer, many orders) — this is the workhorse, and the foreign key always lives on the 'many' side. Many-to-many: rows in A match many rows in B and vice versa (students and courses).",
        },
        {
          type: "keypoint",
          title: "Many-to-many needs a junction table",
          content:
            "SQL has no direct way to store a many-to-many relationship. You resolve it with a third table — called a junction, bridge, or associative table — holding one row per pairing: enrollments(student_id, course_id). Each column is a foreign key, and together they usually form a composite primary key (a primary key made of more than one column).",
        },
        {
          type: "analogy",
          title: "ER diagrams are subway maps",
          content:
            "An entity-relationship (ER) diagram draws each table as a box and each relationship as a line, often annotated with 'crow's feet' showing the many side. Like a subway map, it deliberately hides detail — data types, indexes — so the shape of the system is visible at a glance. When you join a new team, ask for the ER diagram before you write a single query.",
        },
        {
          type: "expandable",
          title: "Natural vs surrogate keys — which should you pick?",
          content:
            "A natural key is a real-world attribute that happens to be unique, like an email address or a country's ISO code. A surrogate key is a meaningless generated number. Natural keys look attractive but leak business assumptions: emails change, usernames get recycled, and 'unique' government IDs turn out to have duplicates. The pragmatic industry default is a surrogate primary key plus a UNIQUE constraint on the natural candidate (e.g. UNIQUE (email)). You get stable joins and still block duplicates.",
        },
        {
          type: "code-note",
          code: "CREATE TABLE customers (\n  id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  email      TEXT NOT NULL UNIQUE,\n  full_name  TEXT NOT NULL,\n  created_at TIMESTAMPTZ NOT NULL DEFAULT now()\n);\n\nCREATE TABLE orders (\n  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  customer_id BIGINT NOT NULL REFERENCES customers(id),\n  status      TEXT NOT NULL DEFAULT 'pending',\n  ordered_at  TIMESTAMPTZ NOT NULL DEFAULT now()\n);",
          content:
            "This is the canonical one-to-many pattern in PostgreSQL. The FK lives on orders (the many side). NOT NULL on customer_id means every order must belong to someone; drop the NOT NULL and you allow 'anonymous' orders — a deliberate design decision, not an accident.",
        },
        {
          type: "warning",
          title: "Analytics warehouses often skip FK enforcement",
          content:
            "Columnar warehouses like BigQuery, Redshift, and Snowflake either do not enforce foreign keys or treat them as documentation only. The relationships still exist logically — a star schema's fact table still points at dimension tables — but nothing stops a bad load from inserting orphans. In a warehouse, referential integrity becomes a data-quality test you run (with dbt or similar), not a constraint the engine enforces. Design as if the keys were enforced; verify because they aren't.",
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
        kind: "architecture",
        title: "ER Diagram: An E-commerce Schema",
        caption:
          "Click each table to see its keys. Follow the edges: every arrow is a foreign key pointing from the 'many' side to the 'one' side.",
        nodes: [
          {
            id: "customers",
            label: "customers",
            sublabel: "PK: id",
            detail:
              "One row per person. Primary key: id (surrogate). Natural candidate email is protected by a UNIQUE constraint instead of being the PK, because emails change.",
            x: 15,
            y: 25,
            accent: false,
          },
          {
            id: "orders",
            label: "orders",
            sublabel: "PK: id · FK: customer_id",
            detail:
              "One row per checkout. customer_id REFERENCES customers(id) — the classic one-to-many: one customer places many orders. Also holds status and ordered_at.",
            x: 50,
            y: 25,
            accent: true,
          },
          {
            id: "order_items",
            label: "order_items",
            sublabel: "FKs: order_id, product_id",
            detail:
              "The junction table resolving the many-to-many between orders and products. Composite primary key (order_id, product_id), plus quantity and unit_price captured at purchase time.",
            x: 50,
            y: 65,
            accent: false,
          },
          {
            id: "products",
            label: "products",
            sublabel: "PK: id",
            detail:
              "One row per sellable item: name, current price, category_id. Appears in many orders via order_items; never stores order-specific data itself.",
            x: 85,
            y: 65,
            accent: false,
          },
          {
            id: "categories",
            label: "categories",
            sublabel: "PK: id",
            detail:
              "A small lookup (dimension) table: one row per product category. products.category_id points here — another one-to-many.",
            x: 85,
            y: 25,
            accent: false,
          },
        ],
        edges: [
          { from: "orders", to: "customers", label: "customer_id → id (many-to-one)" },
          { from: "order_items", to: "orders", label: "order_id → id" },
          { from: "order_items", to: "products", label: "product_id → id" },
          { from: "products", to: "categories", label: "category_id → id" },
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
          title: "Declare a primary key",
          scenario:
            "A clinic needs a patients table where every patient can be identified unambiguously.",
          steps: [
            {
              code: "CREATE TABLE patients (\n  id        BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  full_name TEXT NOT NULL,\n  born_on   DATE NOT NULL\n);",
              explanation:
                "GENERATED ALWAYS AS IDENTITY tells PostgreSQL to hand out the next integer automatically — you never insert it yourself. PRIMARY KEY bundles two constraints: UNIQUE and NOT NULL. Two patients can share a name and a birthday; they can never share an id.",
            },
            {
              code: "INSERT INTO patients (full_name, born_on)\nVALUES ('Maria Garcia', '1991-04-02');\n\nSELECT * FROM patients;",
              explanation:
                "Notice the INSERT never mentions id. The database assigns 1 to the first row. Every future table — appointments, prescriptions, lab results — will reference this patient as patient_id = 1.",
            },
          ],
          output: " id |  full_name   |  born_on\n----+--------------+------------\n  1 | Maria Garcia | 1991-04-02\n(1 row)",
        },
        {
          difficulty: "Easy",
          title: "A foreign key rejects an orphan",
          scenario:
            "Connect appointments to patients and watch referential integrity do its job.",
          steps: [
            {
              code: "CREATE TABLE appointments (\n  id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  patient_id BIGINT NOT NULL REFERENCES patients(id),\n  visit_at   TIMESTAMPTZ NOT NULL\n);",
              explanation:
                "REFERENCES patients(id) is the foreign key declaration. From now on, every value in patient_id must exist in patients.id — the database checks on every insert and update.",
            },
            {
              code: "INSERT INTO appointments (patient_id, visit_at)\nVALUES (1, '2026-08-01 09:30+00');",
              explanation:
                "Patient 1 (Maria) exists, so this insert succeeds. This is the 'many' side of a one-to-many: one patient, many appointments.",
            },
            {
              code: "INSERT INTO appointments (patient_id, visit_at)\nVALUES (999, '2026-08-01 10:00+00');",
              explanation:
                "There is no patient 999. Instead of quietly storing a broken pointer — the way a spreadsheet would — PostgreSQL rejects the row with a foreign key violation. Bad data is stopped at the door.",
            },
          ],
          output: "ERROR:  insert or update on table \"appointments\" violates foreign key constraint \"appointments_patient_id_fkey\"\nDETAIL:  Key (patient_id)=(999) is not present in table \"patients\".",
        },
        {
          difficulty: "Medium",
          title: "Resolving a many-to-many with a junction table",
          scenario:
            "An online course platform: a student enrolls in many courses, and a course has many students.",
          steps: [
            {
              code: "CREATE TABLE students (\n  id   BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  name TEXT NOT NULL\n);\n\nCREATE TABLE courses (\n  id    BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  title TEXT NOT NULL\n);",
              explanation:
                "Two independent entities. Neither table can hold the other's key directly — putting course_id on students would limit each student to one course, and vice versa.",
            },
            {
              code: "CREATE TABLE enrollments (\n  student_id  BIGINT NOT NULL REFERENCES students(id),\n  course_id   BIGINT NOT NULL REFERENCES courses(id),\n  enrolled_on DATE NOT NULL DEFAULT CURRENT_DATE,\n  PRIMARY KEY (student_id, course_id)\n);",
              explanation:
                "The junction table: one row per (student, course) pairing. The composite primary key does double duty — it identifies the row and blocks duplicate enrollments in the same course. Relationship attributes like enrolled_on belong here, on the relationship itself, not on either entity.",
            },
            {
              code: "SELECT s.name, c.title, e.enrolled_on\nFROM enrollments e\nJOIN students s ON s.id = e.student_id\nJOIN courses  c ON c.id = e.course_id\nORDER BY s.name;",
              explanation:
                "Querying a many-to-many is always a two-hop join through the junction table. This shape — entity, bridge, entity — appears everywhere: users↔roles, actors↔films, tags↔posts.",
            },
          ],
          output: "  name  |     title      | enrolled_on\n--------+----------------+-------------\n Amara  | SQL Mastery    | 2026-07-01\n Amara  | Statistics 101 | 2026-07-03\n Ben    | SQL Mastery    | 2026-07-02\n(3 rows)",
        },
        {
          difficulty: "Hard",
          title: "Choosing ON DELETE behavior",
          scenario:
            "A social app must decide what happens to comments when a user deletes their account — a real GDPR-era design question.",
          steps: [
            {
              code: "CREATE TABLE users (\n  id     BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  handle TEXT NOT NULL UNIQUE\n);",
              explanation:
                "The parent table. The interesting decisions live on the tables that reference it.",
            },
            {
              code: "CREATE TABLE comments (\n  id        BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  author_id BIGINT REFERENCES users(id) ON DELETE SET NULL,\n  body      TEXT NOT NULL\n);",
              explanation:
                "ON DELETE SET NULL: when a user is deleted, their comments survive but author_id becomes NULL — the 'deleted user' pattern you see on Reddit. Note author_id cannot be NOT NULL for this to work.",
            },
            {
              code: "CREATE TABLE sessions (\n  id      BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,\n  token   TEXT NOT NULL\n);",
              explanation:
                "ON DELETE CASCADE: delete the user and their login sessions vanish automatically — correct here, because a session is meaningless without its user. The default (ON DELETE NO ACTION) would instead block the user deletion until sessions were removed manually. Three behaviors, three intents: block, orphan-with-NULL, or cascade.",
            },
            {
              code: "DELETE FROM users WHERE handle = 'ghost_user';\n\nSELECT count(*) AS surviving_comments,\n       count(author_id) AS with_author\nFROM comments;",
              explanation:
                "After the delete: the comment rows remain (count(*) counts them all) but count(author_id) skips the NULLs, revealing how many comments lost their author. CASCADE is powerful — reserve it for truly dependent child rows, never for anything you might need to audit.",
            },
          ],
          output: " surviving_comments | with_author\n--------------------+-------------\n                  4 |           3\n(1 row)",
        },
        {
          difficulty: "Industry Example",
          title: "Reading a star schema in the analytics warehouse",
          scenario:
            "A data scientist at a food-delivery company opens the warehouse and finds fact_deliveries surrounded by dim_customer, dim_courier, dim_restaurant, and dim_date. This layout — a star schema — is the analytics dialect of the keys you just learned.",
          steps: [
            {
              code: "-- The fact table: one row per delivery event\n-- fact_deliveries(delivery_id, customer_key, courier_key,\n--                 restaurant_key, date_key,\n--                 delivery_minutes, order_total)",
              explanation:
                "A fact table stores measurements (delivery_minutes, order_total) plus a foreign key into each dimension. Every *_key column is a many-to-one relationship — the same pattern as orders → customers, drawn as a star instead of a chain.",
            },
            {
              code: "SELECT d.city,\n       round(avg(f.delivery_minutes), 1) AS avg_minutes\nFROM fact_deliveries f\nJOIN dim_restaurant d ON d.restaurant_key = f.restaurant_key\nGROUP BY d.city\nORDER BY avg_minutes DESC\nLIMIT 3;",
              explanation:
                "Analysis is a join from fact to dimension, then an aggregate. Because you know the FK points from fact to dimension, you know this join cannot multiply rows — each fact row matches at most one restaurant. That row-count reasoning is the payoff of understanding relationships.",
            },
            {
              code: "-- Data-quality check: warehouses rarely ENFORCE the FKs\nSELECT count(*) AS orphan_facts\nFROM fact_deliveries f\nLEFT JOIN dim_courier c ON c.courier_key = f.courier_key\nWHERE c.courier_key IS NULL;",
              explanation:
                "Since the warehouse treats FKs as documentation, you verify integrity yourself: a LEFT JOIN with an IS NULL filter finds fact rows pointing at missing dimensions. Zero is the answer you want; anything else means the last load broke the contract.",
            },
          ],
          output: "   city    | avg_minutes\n-----------+-------------\n São Paulo |        38.4\n Austin    |        33.1\n Toronto   |        29.7\n(3 rows)\n\n orphan_facts\n--------------\n            0\n(1 row)",
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
        filename: "schema.sql",
        instructions:
          "A streaming service needs three tables: users, playlists, and a junction table connecting playlists to tracks (a playlist holds many tracks; a track appears on many playlists). Fill in the blanks so all keys and relationships are declared correctly, then run the verification query at the bottom.",
        starterCode: "CREATE TABLE users (\n  id    BIGINT GENERATED ALWAYS AS IDENTITY ___,\n  email TEXT NOT NULL UNIQUE\n);\n\nCREATE TABLE playlists (\n  id      BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  -- one user owns many playlists\n  user_id BIGINT NOT NULL ___ users(id),\n  name    TEXT NOT NULL\n);\n\nCREATE TABLE tracks (\n  id    BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  title TEXT NOT NULL\n);\n\nCREATE TABLE playlist_tracks (\n  playlist_id BIGINT NOT NULL REFERENCES playlists(id),\n  track_id    BIGINT NOT NULL REFERENCES ___,\n  position    INT NOT NULL,\n  PRIMARY KEY (___, track_id)\n);\n\nINSERT INTO users (email) VALUES ('ana@example.com');\nINSERT INTO playlists (user_id, name) VALUES (1, 'Focus');\nINSERT INTO tracks (title) VALUES ('Weightless'), ('Intro');\nINSERT INTO playlist_tracks VALUES (1, 1, 1), (1, 2, 2);\n\nSELECT p.name, count(*) AS track_count\nFROM playlist_tracks pt\nJOIN playlists p ON p.id = pt.playlist_id\nGROUP BY p.name;",
        solutionCode: "CREATE TABLE users (\n  id    BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  email TEXT NOT NULL UNIQUE\n);\n\nCREATE TABLE playlists (\n  id      BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  -- one user owns many playlists\n  user_id BIGINT NOT NULL REFERENCES users(id),\n  name    TEXT NOT NULL\n);\n\nCREATE TABLE tracks (\n  id    BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  title TEXT NOT NULL\n);\n\nCREATE TABLE playlist_tracks (\n  playlist_id BIGINT NOT NULL REFERENCES playlists(id),\n  track_id    BIGINT NOT NULL REFERENCES tracks(id),\n  position    INT NOT NULL,\n  PRIMARY KEY (playlist_id, track_id)\n);\n\nINSERT INTO users (email) VALUES ('ana@example.com');\nINSERT INTO playlists (user_id, name) VALUES (1, 'Focus');\nINSERT INTO tracks (title) VALUES ('Weightless'), ('Intro');\nINSERT INTO playlist_tracks VALUES (1, 1, 1), (1, 2, 2);\n\nSELECT p.name, count(*) AS track_count\nFROM playlist_tracks pt\nJOIN playlists p ON p.id = pt.playlist_id\nGROUP BY p.name;",
        expectedOutput: " name  | track_count\n-------+-------------\n Focus |           2\n(1 row)",
        hints: [
          "The first blank completes the id column's constraint — the same two words every table's identifier column gets.",
          "playlists.user_id must point at users(id). The keyword that declares a foreign key is REFERENCES.",
          "playlist_tracks.track_id references the tracks table's primary key: tracks(id).",
          "The composite primary key pairs the two foreign keys — the missing half is playlist_id.",
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
          id: "sql17_mcq_01",
          difficulty: "Easy",
          question: "Which two constraints does PRIMARY KEY combine?",
          options: [
            "UNIQUE and NOT NULL",
            "UNIQUE and DEFAULT",
            "NOT NULL and CHECK",
            "REFERENCES and UNIQUE",
          ],
          correctIndex: 0,
          explanation:
            "A primary key value must be unique (no two rows share it) and present (never NULL). PostgreSQL enforces both the moment you declare PRIMARY KEY.",
        },
        {
          type: "mcq",
          id: "sql17_mcq_02",
          difficulty: "Easy",
          question:
            "In a one-to-many relationship between customers and orders, where does the foreign key live?",
          options: [
            "On customers, as an order_id column",
            "On orders, as a customer_id column",
            "On both tables, pointing at each other",
            "In a separate junction table",
          ],
          correctIndex: 1,
          explanation:
            "The foreign key always lives on the 'many' side. Each order points at exactly one customer, so orders carries customer_id. Putting order_id on customers would cap each customer at one order. A junction table is only needed for many-to-many.",
        },
        {
          type: "mcq",
          id: "sql17_mcq_03",
          difficulty: "Medium",
          question:
            "Why do most production schemas use a surrogate key (generated id) instead of a natural key like email?",
          options: [
            "Surrogate keys make SELECT queries run faster in all cases",
            "Natural keys cannot be indexed",
            "Natural values like email can change or turn out not to be unique, while a surrogate id never changes",
            "SQL does not allow TEXT columns to be primary keys",
          ],
          correctIndex: 2,
          explanation:
            "A primary key should be stable for the life of the row, because every foreign key in the system depends on it. Emails change and edge cases break 'unique' natural values. TEXT columns can be primary keys and natural keys index fine — the issue is stability, not capability. The standard pattern is surrogate PK plus UNIQUE on the natural candidate.",
        },
        {
          type: "scenario",
          id: "sql17_sc_01",
          difficulty: "Medium",
          scenario:
            "A hospital system has doctors and patients. A doctor treats many patients, and a patient may be treated by several doctors over time. The team also wants to record the date each treating relationship began.",
          question: "What is the correct way to model this?",
          options: [
            "Add a doctor_id column to patients",
            "Add a patient_id column to doctors",
            "Create a junction table doctor_patients(doctor_id, patient_id, started_on) with FKs to both tables",
            "Store a comma-separated list of patient ids in a TEXT column on doctors",
          ],
          correctIndex: 2,
          explanation:
            "Many doctors per patient AND many patients per doctor is a many-to-many, which requires a junction table. The started_on date is an attribute of the relationship itself, so it belongs on the junction row. A single FK column caps one side at one match, and comma-separated ids destroy every guarantee the database offers — no FK checks, no sane joins.",
        },
        {
          type: "coding",
          id: "sql17_code_01",
          difficulty: "Medium",
          prompt:
            "A fintech app needs an accounts table (id, owner_email) and a transfers table where each transfer references two accounts: the sender and the receiver. Write both CREATE TABLE statements. transfers needs: id (PK), from_account and to_account (both NOT NULL FKs to accounts), and amount_cents BIGINT NOT NULL.",
          starterCode: "CREATE TABLE accounts (\n  -- your columns here\n);\n\nCREATE TABLE transfers (\n  -- your columns here\n);",
          solutionCode: "CREATE TABLE accounts (\n  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  owner_email TEXT NOT NULL UNIQUE\n);\n\nCREATE TABLE transfers (\n  id           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  from_account BIGINT NOT NULL REFERENCES accounts(id),\n  to_account   BIGINT NOT NULL REFERENCES accounts(id),\n  amount_cents BIGINT NOT NULL\n);",
          expectedOutput: "CREATE TABLE\nCREATE TABLE",
          tests: [
            {
              name: "Primary keys declared",
              description: "Both tables declare a PRIMARY KEY on id",
            },
            {
              name: "Two foreign keys to the same table",
              description:
                "transfers.from_account and transfers.to_account each REFERENCES accounts(id) — one table can hold multiple FKs into the same parent",
            },
            {
              name: "NOT NULL discipline",
              description: "Both account references are NOT NULL so no transfer can be missing a side",
            },
          ],
        },
        {
          type: "scenario",
          id: "sql17_sc_02",
          difficulty: "Hard",
          scenario:
            "During a nightly load into the analytics warehouse, an analyst notices that 214 rows in fact_orders have a customer_key that matches nothing in dim_customer. The warehouse (Redshift) declares foreign keys but does not enforce them.",
          question: "What does this situation demonstrate?",
          options: [
            "Redshift has a bug — declared foreign keys must always be enforced",
            "The fact table's primary key is missing, which causes orphaned keys",
            "Referential integrity became a data-quality check: the logical FK relationship exists, but the engine did not block orphan rows, so tests must catch them",
            "Star schemas do not use foreign keys, so the 214 rows are expected and safe to ignore",
          ],
          correctIndex: 2,
          explanation:
            "Most analytics warehouses accept FK declarations as metadata for the query planner and BI tools but skip enforcement for load speed. The relationship is still part of the design contract — the 214 orphans are genuine data-quality failures, likely from a partial dimension load, and should fail a pipeline test. This is neither a bug nor acceptable noise, and it has nothing to do with the fact table's own primary key.",
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
            "What is the difference between a primary key and a foreign key?",
          answer:
            "A primary key uniquely identifies each row within its own table — it must be unique and non-NULL, and there is exactly one per table. A foreign key is a column in one table that stores the primary key of a row in another table, creating a relationship between them. The primary key answers 'which row is this?'; the foreign key answers 'which row over there does this row belong to?'. Declaring the foreign key with REFERENCES makes the database enforce referential integrity, so you can never point at a row that does not exist. A table has one primary key but can hold many foreign keys — an orders table might reference customers, warehouses, and promotions at once. In practice I default to surrogate primary keys plus UNIQUE constraints on natural candidates, so the identifiers that foreign keys depend on never change.",
        },
        {
          question:
            "How would you model a many-to-many relationship, and where do attributes of the relationship go?",
          answer:
            "SQL cannot store a many-to-many directly, so you introduce a junction table with one row per pairing — for students and courses, that's enrollments(student_id, course_id). Each column is a foreign key into its parent table, and together they usually form a composite primary key, which also prevents duplicate pairings for free. Attributes that describe the relationship itself — enrollment date, grade, role — belong on the junction table, because they don't describe the student alone or the course alone but the combination. Querying is always a two-hop join through the bridge. When I see a comma-separated list of ids stuffed into a text column, that's the anti-pattern this design exists to prevent: it breaks foreign key checks, indexing, and joins simultaneously.",
        },
        {
          question:
            "Why do analytics warehouses often not enforce foreign keys, and how does that change how you work?",
          answer:
            "OLTP databases enforce foreign keys because they take writes row by row and correctness per transaction is the whole point. Warehouses like Redshift, Snowflake, and BigQuery ingest millions of rows in bulk, and checking every row against parent tables during a load would be prohibitively slow — so they either ignore FK declarations or keep them as metadata hints for the optimizer and BI tools. The relationships still exist logically: a star schema's fact table conceptually references every dimension. What changes is where integrity lives — it moves from a constraint the engine enforces to a test the team runs, typically a LEFT JOIN checking for orphaned keys after each load, automated in something like dbt. So I design the warehouse as if keys were enforced, and then I verify with tests, because nothing else will.",
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
        "1) Choosing a mutable natural key (email, username, phone) as the primary key — when it changes, every referencing row breaks; use a surrogate id and a UNIQUE constraint instead. 2) Putting the foreign key on the 'one' side of a one-to-many (order_id on customers), which silently caps the relationship at one row. 3) Modeling many-to-many with a comma-separated id list in a TEXT column — no FK enforcement, no indexes, unjoinable. 4) Slapping ON DELETE CASCADE everywhere: deleting one parent can silently wipe thousands of child rows you needed for auditing. 5) Assuming declared foreign keys are enforced in the warehouse — Redshift/Snowflake/BigQuery treat them as documentation, so orphan checks belong in your pipeline tests.",
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
        "Try these prompts in the AI Tutor panel: • 'ELI5: what's the difference between a primary key and a foreign key?' • 'Give me a business domain and make me identify every relationship as 1:1, 1:N, or M:N.' • 'Show me a schema with a design flaw and let me find it.' • 'Explain when I'd pick ON DELETE CASCADE vs SET NULL vs the default, with examples.' • 'Interview mode: quiz me on junction tables and composite keys, then grade my answers.'",
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
        "Schema — the set of tables, columns, keys, and constraints that define a database's structure. Primary key (PK) — the column(s) that uniquely identify each row; UNIQUE + NOT NULL. Surrogate key — a generated, meaningless identifier (an identity/serial id). Natural key — a real-world attribute that happens to be unique, like an ISO country code. Foreign key (FK) — a column holding another table's primary key, declared with REFERENCES. Referential integrity — the guarantee that every foreign key value points at an existing parent row. One-to-many — one parent row relates to many child rows; the FK lives on the child. Many-to-many — both sides relate to many; requires a junction table. Junction table — the bridge table (also: associative or bridge table) resolving a many-to-many. Composite key — a primary key made of two or more columns. ER diagram — entity-relationship diagram; boxes for tables, lines for relationships. Star schema — a warehouse layout with a central fact table referencing surrounding dimension tables.",
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
        "• Docs: PostgreSQL manual, 'Constraints' chapter — primary keys, foreign keys, and every ON DELETE option from the source. • Read: 'The Data Warehouse Toolkit' by Ralph Kimball, chapter 1, for where star schemas come from. • Tool: dbdiagram.io lets you sketch ER diagrams from a few lines of text — draw the e-commerce schema from this lesson in five minutes. • Practice: open any app you use daily and sketch its probable schema — entities, keys, relationships. • Next in DSM: you can now connect tables correctly — Normalization teaches you how to split them correctly.",
    },

    /* ---------------------------------------------------------------- */
    /*  12 — Recap                                                       */
    /* ---------------------------------------------------------------- */
    {
      id: "recap",
      type: "recap",
      tocLabel: "Recap",
      content:
        "✓ A schema is tables plus enforced rules — keys and constraints — not just tables.\n✓ A primary key uniquely identifies a row: UNIQUE + NOT NULL, one per table, ideally a stable surrogate id.\n✓ A foreign key stores a parent row's primary key; REFERENCES makes the database enforce referential integrity.\n✓ In one-to-many, the FK lives on the many side; many-to-many needs a junction table with a composite key.\n✓ ON DELETE behavior (NO ACTION, SET NULL, CASCADE) is a design decision about what happens to children when a parent dies.\n✓ Analytics warehouses declare but rarely enforce FKs — integrity there is a test you run, not a constraint the engine applies.\n✓ ER diagrams and star schemas are the maps you read before querying any unfamiliar database.\n\nNext up: Normalization. You know how tables connect — next you'll learn the rules (1NF through 3NF) for deciding what belongs in each table, and when analytics work justifies breaking those rules on purpose.",
    },
  ],
};
