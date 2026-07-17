import type { Lesson } from "@/lib/curriculum/types";

export const whatIsADatabase: Lesson = {
  meta: {
    id: "sql.foundations.what-is-a-database",
    slug: "what-is-a-database",
    title: "What Is a Database?",
    description:
      "Understand how relational databases organize data into tables, rows, and columns — and why SQL is the language every data role speaks.",
    estimatedTime: "20 mins",
    difficulty: "Beginner",
    xpReward: 40,
    prerequisites: [],
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
        hook: "Every time you check your bank balance, stream a song, or track a package, a database answers your question in milliseconds — often while millions of other people ask theirs at the same time. Spreadsheets fall over at a few hundred thousand rows; databases shrug at billions. By the end of this lesson you'll know exactly what a database is, how it organizes data, and why SQL is the one language every data job posting mentions.",
        what: "A database is an organized collection of data stored on a computer so it can be searched, updated, and protected reliably. A relational database — the most common kind — stores data in tables made of rows and columns, and you talk to it using SQL (Structured Query Language).",
        why: "Files and spreadsheets can't handle many people reading and writing at once, can't enforce rules about what data is valid, and slow to a crawl as data grows. Databases solve all three problems — which is why nearly every company keeps its most important data in one.",
        whereUsed:
          "Every serious application — e-commerce checkouts, hospital records, banking ledgers, analytics dashboards — sits on top of a database. As a data professional, the database is where your raw material lives.",
        objectives: [
          "Explain what a relational database is and how it differs from a spreadsheet",
          "Identify tables, rows, columns, and primary keys in a real schema",
          "Describe what an RDBMS (Relational Database Management System) does",
          "Name the major SQL dialects (PostgreSQL, MySQL, SQLite, SQL Server) and what they share",
          "Read a simple table schema and predict what data each column holds",
        ],
        realWorldApps: [
          {
            company: "Shopify",
            headline: "Millions of stores on relational databases",
            detail:
              "Shopify runs one of the world's largest MySQL fleets. Every product, order, and customer for over a million merchants lives in relational tables, sharded across many database servers.",
          },
          {
            company: "Instacart",
            headline: "PostgreSQL powers grocery logistics",
            detail:
              "Instacart's catalog, orders, and shopper assignments are stored in PostgreSQL. When a shopper marks an item as picked, that's a row update in a relational table.",
          },
          {
            company: "Stripe",
            headline: "Financial data demands relational rigor",
            detail:
              "Stripe processes payments where a lost or duplicated row means real money. Relational databases enforce the strict consistency rules that make this possible.",
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
            "A database is a structured collection of data managed by software. The software layer that manages it — handling storage, security, and simultaneous access — is called a database management system, or DBMS. When the data is organized into tables that can reference each other, we call it a relational database, and the software an RDBMS (Relational Database Management System).",
        },
        {
          type: "analogy",
          title: "The filing-cabinet analogy",
          content:
            "Imagine a company's records room. Each filing cabinet is a table (one for customers, one for orders). Each folder inside a cabinet is a row — one customer, one order. Each labeled field on the folder's form is a column (name, email, signup date). The strict clerk who fetches folders, refuses malformed forms, and stops two people from editing the same folder at once? That's the RDBMS. The analogy breaks down in one way: a real clerk is slow, while an RDBMS can search millions of folders in milliseconds using indexes.",
        },
        {
          type: "keypoint",
          title: "Tables, rows, columns",
          content:
            "A table stores one kind of thing (customers, orders, products). A row (also called a record) is one instance of that thing — one specific customer. A column (also called a field) is one attribute every row has — email, country, signup_date. Every column has a data type: INTEGER, TEXT, DATE, NUMERIC, and so on.",
        },
        {
          type: "text",
          content:
            "What makes a relational database 'relational' is that tables reference each other. An orders table doesn't repeat the customer's name and email on every order — it stores just a customer_id that points at one row in the customers table. That pointer column is called a foreign key, and the unique identifier column it points to is called a primary key.",
        },
        {
          type: "keypoint",
          title: "Primary keys and foreign keys",
          content:
            "A primary key is a column (or set of columns) whose value uniquely identifies each row — no duplicates, no missing values. A foreign key is a column in one table that holds the primary key value of a row in another table, creating the relationship. orders.customer_id → customers.customer_id is the classic example.",
        },
        {
          type: "text",
          content:
            "SQL (Structured Query Language, often pronounced 'sequel') is the standard language for talking to relational databases. You describe what data you want — 'all customers from Brazil who signed up this year' — and the database figures out how to fetch it. This declarative style (saying what, not how) is why SQL has outlived fifty years of programming fashion.",
        },
        {
          type: "expandable",
          title: "Dialects: PostgreSQL, MySQL, SQLite, SQL Server, BigQuery",
          content:
            "SQL is a standard, but each RDBMS speaks its own dialect — the core (SELECT, WHERE, GROUP BY, JOIN) is nearly identical everywhere, while functions and edge features differ. PostgreSQL is the open-source favorite for startups and analytics. MySQL/MariaDB power a huge share of the web. SQLite is a tiny file-based database embedded in phones and browsers. Microsoft SQL Server and Oracle dominate large enterprises. Cloud warehouses like BigQuery, Snowflake, and Redshift use SQL for analytics on massive datasets. Learn one dialect well (DSM uses PostgreSQL-flavored SQL) and the others are a documentation lookup away.",
        },
        {
          type: "code-note",
          code: "-- The schema we'll use throughout this module:\n-- customers(customer_id, name, email, country, signup_date)\n-- products(product_id, product_name, category, unit_price)\n-- orders(order_id, customer_id, order_date, status, total_amount)\n-- order_items(order_item_id, order_id, product_id, quantity, unit_price)\n\nSELECT name, country\nFROM customers;",
          content:
            "This is your first look at SQL. The comment lines (starting with --) describe our e-commerce schema: four related tables. The query below them asks for two columns from the customers table. You'll write queries like this yourself in the next lesson — for now, notice how readable it is: it's close to plain English.",
        },
        {
          type: "warning",
          title: "A database is not a spreadsheet",
          content:
            "Spreadsheets let any cell hold anything — a number today, a note tomorrow. Databases enforce a schema: every value in a column must match the column's declared type, and constraints (like 'customer_id must be unique') are enforced by the RDBMS itself. This rigidity is a feature — it's what keeps millions of rows trustworthy.",
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
        title: "An E-Commerce Relational Schema",
        caption:
          "Click any table to see its columns and role. Arrows show foreign-key relationships — how rows in one table point to rows in another.",
        nodes: [
          {
            id: "customers",
            label: "customers",
            sublabel: "who buys",
            detail:
              "Columns: customer_id (primary key), name, email, country, signup_date. One row per person. The primary key customer_id uniquely identifies each customer and is referenced by the orders table.",
            x: 15,
            y: 25,
            accent: false,
          },
          {
            id: "orders",
            label: "orders",
            sublabel: "each purchase",
            detail:
              "Columns: order_id (primary key), customer_id (foreign key → customers), order_date, status, total_amount. One row per checkout. Instead of copying customer details, it stores only the customer_id pointer.",
            x: 50,
            y: 25,
            accent: true,
          },
          {
            id: "order_items",
            label: "order_items",
            sublabel: "lines in a cart",
            detail:
              "Columns: order_item_id (primary key), order_id (foreign key → orders), product_id (foreign key → products), quantity, unit_price. One row per product within an order — a 3-item cart creates 3 rows here.",
            x: 50,
            y: 65,
            accent: false,
          },
          {
            id: "products",
            label: "products",
            sublabel: "what's for sale",
            detail:
              "Columns: product_id (primary key), product_name, category, unit_price. One row per catalog item. Referenced by order_items so a product's details are stored once, no matter how many times it sells.",
            x: 85,
            y: 65,
            accent: false,
          },
          {
            id: "rdbms",
            label: "RDBMS",
            sublabel: "PostgreSQL",
            detail:
              "The software managing all four tables: it parses your SQL, enforces primary/foreign key rules, handles thousands of simultaneous users, and guarantees that committed data survives crashes.",
            x: 15,
            y: 65,
            accent: false,
          },
        ],
        edges: [
          { from: "orders", to: "customers", label: "customer_id" },
          { from: "order_items", to: "orders", label: "order_id" },
          { from: "order_items", to: "products", label: "product_id" },
          { from: "rdbms", to: "customers", label: "manages" },
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
          title: "Reading a table",
          scenario:
            "You've just been given access to the customers table at an online bookshop. First task: understand what one row means.",
          steps: [
            {
              code: "-- customers\n-- customer_id | name   | email             | country | signup_date\n-- 1           | Amara  | amara@mail.com    | Nigeria | 2025-03-14\n-- 2           | Wei    | wei@mail.com      | China   | 2025-04-02\n-- 3           | Priya  | priya@mail.com    | India   | 2025-04-19",
              explanation:
                "Each line after the header is one row — one customer. Each vertical slice is a column. Row 1 tells a complete story: customer #1 is Amara, from Nigeria, who signed up on 2025-03-14.",
            },
            {
              code: "-- customer_id is the PRIMARY KEY:\n-- unique, never NULL, never reused.",
              explanation:
                "Even if two customers were both named Amara, their customer_id values would differ. That's the whole job of a primary key: give every row an identity that nothing else shares.",
            },
          ],
          output: "3 rows, 5 columns, primary key = customer_id",
        },
        {
          difficulty: "Easy",
          title: "Spotting the relationship between two tables",
          scenario:
            "The orders table has arrived. Figure out which customer placed order 101.",
          steps: [
            {
              code: "-- orders\n-- order_id | customer_id | order_date | status    | total_amount\n-- 101      | 3           | 2025-05-01 | delivered | 42.50\n-- 102      | 1           | 2025-05-02 | shipped   | 18.00\n-- 103      | 3           | 2025-05-06 | pending   | 77.25",
              explanation:
                "Notice there's no customer name here — only customer_id. That column is a foreign key: its values are primary key values from the customers table.",
            },
            {
              code: "-- order 101 → customer_id 3\n-- customers row 3 → Priya (India)",
              explanation:
                "Follow the pointer: order 101 stores customer_id 3, and row 3 in customers is Priya. Later, in the joins module, you'll make SQL follow this pointer for you automatically.",
            },
            {
              code: "-- Also note: customer 3 appears twice (orders 101 and 103).\n-- One customer, many orders — a one-to-many relationship.",
              explanation:
                "This is the most common relationship shape in databases: one row in customers relates to many rows in orders. The foreign key always lives on the 'many' side.",
            },
          ],
          output: "Order 101 was placed by Priya (customer_id 3)",
        },
        {
          difficulty: "Medium",
          title: "Why not one big table?",
          scenario:
            "A colleague suggests merging customers and orders into a single spreadsheet-style table. Evaluate the idea.",
          steps: [
            {
              code: "-- The 'one big table' version:\n-- order_id | name  | email          | country | order_date | total_amount\n-- 101      | Priya | priya@mail.com | India   | 2025-05-01 | 42.50\n-- 103      | Priya | priya@mail.com | India   | 2025-05-06 | 77.25",
              explanation:
                "Priya's name, email, and country are now copied onto every order she places. With 50 orders, her email exists in 50 places.",
            },
            {
              code: "-- Priya updates her email. You must now update 50 rows.\n-- Miss one, and the table contradicts itself:\n-- which email is correct?",
              explanation:
                "This is called an update anomaly — duplicated data drifting out of sync. Relational design stores each fact exactly once (email lives only in customers) so an update touches one row.",
            },
            {
              code: "-- Relational version: fact stored once, referenced many times.\n-- customers: 1 row for Priya\n-- orders:    50 rows, each holding just customer_id 3",
              explanation:
                "This principle — eliminate duplication by splitting data into related tables — is called normalization. You'll study it formally in the Database Design module; for now, the intuition is enough.",
            },
          ],
          output: "Verdict: keep separate tables — one fact, one place",
        },
        {
          difficulty: "Hard",
          title: "Choosing column data types for a new table",
          scenario:
            "Your team is creating the products table for a PostgreSQL database. Pick a sensible type for each column and justify it.",
          steps: [
            {
              code: "CREATE TABLE products (\n  product_id   SERIAL PRIMARY KEY,",
              explanation:
                "SERIAL is PostgreSQL shorthand for an integer that auto-increments — the database assigns 1, 2, 3… so you never invent IDs by hand. Declaring PRIMARY KEY makes the RDBMS enforce uniqueness and non-null automatically.",
            },
            {
              code: "  product_name TEXT NOT NULL,\n  category     TEXT NOT NULL,",
              explanation:
                "TEXT holds strings of any length. NOT NULL is a constraint — a rule the database enforces — meaning a product can't be saved without a name. Other dialects often use VARCHAR(n) (variable-length text with a max length) for the same purpose.",
            },
            {
              code: "  unit_price   NUMERIC(10, 2) NOT NULL CHECK (unit_price >= 0)\n);",
              explanation:
                "NUMERIC(10,2) stores exact decimals — up to 10 digits, 2 after the decimal point. Money should never be a floating-point type, because floats are binary approximations that accumulate rounding errors. The CHECK constraint rejects negative prices at the database level, protecting the data from every buggy app that might write to it.",
            },
            {
              code: "-- Inserting a row that breaks a rule:\nINSERT INTO products (product_name, category, unit_price)\nVALUES ('USB-C Cable', 'Accessories', -5.00);",
              explanation:
                "PostgreSQL rejects this row: the CHECK constraint fails. This is the deep difference from spreadsheets — the database itself refuses invalid data, no matter which application sent it.",
            },
          ],
          output: "ERROR: new row violates check constraint on unit_price",
        },
        {
          difficulty: "Industry Example",
          title: "How Shopify-scale companies split OLTP and analytics",
          scenario:
            "An e-commerce platform needs to both process checkouts (fast, small writes) and let analysts run heavy reports — without the reports slowing down checkouts.",
          steps: [
            {
              code: "-- Production database (OLTP: Online Transaction Processing)\n-- MySQL / PostgreSQL\n-- Workload: millions of tiny reads/writes per minute\nUPDATE orders SET status = 'shipped' WHERE order_id = 88213;",
              explanation:
                "The production RDBMS handles live transactions: one order updated at a time, in milliseconds, with strict consistency. Companies like Shopify run huge fleets of MySQL servers exactly for this.",
            },
            {
              code: "-- Analytics warehouse (OLAP: Online Analytical Processing)\n-- BigQuery / Snowflake / Redshift\n-- Workload: few queries, each scanning millions of rows\nSELECT country, SUM(total_amount)\nFROM orders\nGROUP BY country;",
              explanation:
                "Analytical queries scan entire tables to compute totals and trends. Running them on the production database would compete with checkouts for resources — so data teams copy data into a warehouse built for scanning.",
            },
            {
              code: "-- A pipeline copies data from OLTP → warehouse\n-- (often nightly or streaming), so analysts query\n-- yesterday's — or last-minute's — data safely.",
              explanation:
                "This copy process is called ETL or ELT (Extract, Transform, Load). The key insight for you: the SQL you're learning is identical in both worlds. As a data analyst, you'll mostly query the warehouse — with exactly the SELECT skills this module teaches.",
            },
          ],
          output: "Checkouts stay fast; analysts get full query power",
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
          "Time to run your very first query. The customers table holds five customers of an online bookshop. Complete the query so it returns every column of every row — the SQL equivalent of opening the filing cabinet and looking inside. The * symbol means 'all columns'.",
        starterCode:
          "-- customers(customer_id, name, email, country, signup_date)\n-- Task: return ALL columns and ALL rows from customers.\n\nSELECT ___\nFROM ___;",
        solutionCode:
          "-- customers(customer_id, name, email, country, signup_date)\n-- Task: return ALL columns and ALL rows from customers.\n\nSELECT *\nFROM customers;",
        expectedOutput:
          " customer_id | name  | email            | country | signup_date\n-------------+-------+------------------+---------+-------------\n 1           | Amara | amara@mail.com   | Nigeria | 2025-03-14\n 2           | Wei   | wei@mail.com     | China   | 2025-04-02\n 3           | Priya | priya@mail.com   | India   | 2025-04-19\n 4           | Jamal | jamal@mail.com   | Egypt   | 2025-05-07\n 5           | Alice | alice@mail.com   | Canada  | 2025-05-21\n(5 rows)",
        hints: [
          "You need two things: what columns to return, and which table to read from.",
          "The symbol that means 'every column' in SQL is the asterisk: *",
          "The pattern is SELECT <columns> FROM <table>; — the table here is customers.",
          "SELECT * FROM ___; — replace the blank with the table name and end with a semicolon.",
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
          id: "sql01_mcq_01",
          difficulty: "Easy",
          question: "In a relational database, what does one row of a table represent?",
          options: [
            "One attribute shared by all records, like 'email'",
            "One complete record — a single instance of the thing the table stores",
            "The rules that govern which values are allowed",
            "A pointer to another table",
          ],
          correctIndex: 1,
          explanation:
            "A row is one record: one customer, one order, one product. An attribute shared by all records describes a column, not a row. The rules governing allowed values are constraints and data types, defined in the schema. A pointer to another table describes a foreign key, which is a single column within a row — not the row itself.",
        },
        {
          type: "mcq",
          id: "sql01_mcq_02",
          difficulty: "Easy",
          question: "What does an RDBMS do that a plain file of data cannot?",
          options: [
            "Store text and numbers together",
            "Hold more than one table's worth of data",
            "Enforce data rules, manage simultaneous users, and answer queries efficiently",
            "Allow data to be copied to another computer",
          ],
          correctIndex: 2,
          explanation:
            "The RDBMS is management software: it validates data against the schema, coordinates thousands of concurrent readers and writers, and uses indexes to answer queries fast. Plain files can store mixed data, hold arbitrary amounts, and be copied anywhere — so the first, second, and fourth options don't distinguish an RDBMS from a file at all.",
        },
        {
          type: "mcq",
          id: "sql01_mcq_03",
          difficulty: "Medium",
          question:
            "The orders table has a customer_id column containing values that also appear in customers.customer_id. In the orders table, customer_id is a…",
          options: [
            "Primary key",
            "Foreign key",
            "Composite key",
            "Data type",
          ],
          correctIndex: 1,
          explanation:
            "A column that references another table's primary key is a foreign key — it creates the relationship. It can't be the orders table's primary key because one customer places many orders, so the value repeats. A composite key is a key made of multiple columns combined, which isn't described here. A data type (like INTEGER) describes what kind of values a column holds, not its relational role.",
        },
        {
          type: "scenario",
          id: "sql01_sc_01",
          difficulty: "Medium",
          scenario:
            "A startup tracks 40,000 customers in a shared spreadsheet. Sales reps overwrite each other's edits, someone typed 'unknown' into the signup_date column, and monthly reports now take 20 minutes to recalculate.",
          question:
            "Which spreadsheet weakness explains the 'unknown' value appearing in a date column?",
          options: [
            "Spreadsheets cannot store dates at all",
            "Spreadsheets do not enforce a schema, so any cell can hold any type of value",
            "Spreadsheets limit the number of rows to 10,000",
            "Spreadsheets cannot be shared between multiple users",
          ],
          correctIndex: 1,
          explanation:
            "Databases enforce column data types — a DATE column rejects the string 'unknown' — while spreadsheet cells accept anything, which is exactly how the bad value got in. Spreadsheets do store dates (they just don't enforce them), modern spreadsheets handle around a million rows rather than 10,000, and spreadsheets can be shared — sharing is actually how the overwrite problem in the scenario happened.",
        },
        {
          type: "coding",
          id: "sql01_code_01",
          difficulty: "Medium",
          prompt:
            "The bookshop also has a products table: products(product_id, product_name, category, unit_price). Write a query that returns all columns and all rows from products.",
          starterCode:
            "-- products(product_id, product_name, category, unit_price)\n-- Return everything in the table.\n\n",
          solutionCode: "SELECT *\nFROM products;",
          expectedOutput:
            " product_id | product_name      | category    | unit_price\n------------+-------------------+-------------+-----------\n 1          | Paper Notebook    | Stationery  | 4.50\n 2          | Fountain Pen      | Stationery  | 24.00\n 3          | Data Science 101  | Books       | 39.99\n(3 rows)",
          tests: [
            {
              name: "Uses SELECT *",
              description: "The query must request all columns with the asterisk",
            },
            {
              name: "Correct table",
              description: "The FROM clause must name the products table",
            },
            {
              name: "Returns all rows",
              description: "No filtering — all 3 rows must appear",
            },
          ],
        },
        {
          type: "mcq",
          id: "sql01_mcq_04",
          difficulty: "Hard",
          question:
            "Your company uses PostgreSQL, but a job posting requires 'SQL Server experience'. How transferable is your SQL knowledge?",
          options: [
            "Not transferable — each RDBMS uses a completely different query language",
            "Highly transferable — core SQL (SELECT, WHERE, GROUP BY, JOIN) is nearly identical; mostly functions and edge features differ",
            "Only table design transfers; all query syntax differs",
            "Transferable only if both databases run on the same operating system",
          ],
          correctIndex: 1,
          explanation:
            "All major relational databases implement the SQL standard, so the core querying skills carry over almost unchanged — differences concentrate in built-in functions, date handling, and administrative features. The claim of 'completely different languages' is the opposite of reality. Query syntax is the most standardized part, not the least. The operating system has no bearing on SQL syntax whatsoever.",
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
          question: "What is a relational database, and what are its core building blocks?",
          answer:
            "A relational database organizes data into tables, where each table stores one kind of entity — customers, orders, products. Each row is one record and each column is one typed attribute of that record. Tables are linked through keys: a primary key uniquely identifies each row, and a foreign key in another table references it, which is what makes the model 'relational'. The software that manages all of this — enforcing types and constraints, coordinating concurrent users, and answering SQL queries — is the RDBMS, such as PostgreSQL or MySQL.",
        },
        {
          question:
            "When would you choose a relational database over a spreadsheet or a flat file, and what trade-offs come with that choice?",
          answer:
            "I'd choose a relational database once data integrity, scale, or concurrency matters. A database enforces a schema — a DATE column can't silently hold the text 'unknown' — and it handles many simultaneous readers and writers without corrupting data, which spreadsheets can't. It also stays fast at millions of rows thanks to indexes, where spreadsheets degrade badly past a few hundred thousand. The trade-offs are upfront design effort — you must define tables, types, and keys before loading data — and operational overhead, since someone has to run and back up the database. For a quick one-off analysis of a few thousand rows, a spreadsheet or CSV is genuinely fine; the database earns its cost as soon as the data becomes shared, long-lived, or business-critical.",
        },
        {
          question:
            "What's the difference between an OLTP database and an analytical data warehouse, and why do companies run both?",
          answer:
            "OLTP (Online Transaction Processing) systems handle the live operations of a business — inserting an order, updating a shipment status — with many tiny, fast transactions per second, typically on row-oriented databases like PostgreSQL or MySQL. OLAP (Online Analytical Processing) workloads are the opposite shape: a few large queries that scan millions of rows to compute aggregates, run on column-oriented warehouses like BigQuery, Snowflake, or Redshift. Running heavy analytics on the production OLTP database would compete with customer-facing transactions for resources and could slow checkouts, so companies copy data into the warehouse via ETL/ELT pipelines. Analysts then query the warehouse freely without touching production. Importantly, both worlds speak SQL — the same SELECT, WHERE, and GROUP BY skills apply, which is why SQL fluency is the most portable skill in data. The main practical difference an analyst notices is data freshness: warehouse data is usually minutes to a day behind production.",
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
        "1) Treating a database like a spreadsheet — designing one giant table with repeated customer details instead of separate related tables, which causes update anomalies. 2) Confusing rows with columns when reading a schema: a row is one record; a column is one attribute across all records. 3) Assuming primary keys and foreign keys are the same thing — a primary key identifies rows in its own table; a foreign key references another table's primary key and can repeat. 4) Believing each database product has its own query language — core SQL is standardized; only dialect details differ. 5) Storing money in floating-point columns instead of NUMERIC/DECIMAL, which introduces rounding errors that exact decimal types avoid.",
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
        "Try these prompts in the AI Tutor panel: • 'ELI5: what is a relational database, using a school as the example?' • 'Quiz me on primary keys vs foreign keys with five quick questions.' • 'Show me how the customers and orders tables would look if we wrongly merged them into one table.' • 'Explain the difference between PostgreSQL, MySQL, and SQLite in two sentences each.' • 'Interview mode: ask me what an RDBMS does and grade my answer.'",
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
        "Database — an organized, managed collection of data. Table — a grid storing one kind of entity, made of rows and columns. Row (record) — one instance of the entity, e.g. one customer. Column (field) — one typed attribute every row has, e.g. email. Schema — the formal definition of tables, columns, types, and constraints. Primary key — the column whose value uniquely identifies each row. Foreign key — a column referencing another table's primary key, creating a relationship. RDBMS — Relational Database Management System, the software (PostgreSQL, MySQL) that manages relational data. SQL — Structured Query Language, the standard language for querying relational databases. Dialect — one RDBMS's specific flavor of SQL. Constraint — a rule the database enforces, like NOT NULL or CHECK. Data warehouse — an analytics-optimized database (BigQuery, Snowflake) fed by copies of production data.",
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
        "• Docs: the PostgreSQL Tutorial chapter 'What Is PostgreSQL?' and 'Concepts' — a gentle official introduction to tables and rows. • Read: 'A Relational Model of Data for Large Shared Data Banks' summaries — Edgar Codd's 1970 idea is why this lesson exists. • Practice: sketch the tables you'd design for an app you use daily (Spotify, a food-delivery app) — name the primary and foreign keys. • Next in DSM: SELECT & FROM, where you stop reading about tables and start querying them yourself.",
    },

    /* ---------------------------------------------------------------- */
    /*  12 — Recap                                                       */
    /* ---------------------------------------------------------------- */
    {
      id: "recap",
      type: "recap",
      tocLabel: "Recap",
      content:
        "✓ A relational database stores data in tables: rows are records, columns are typed attributes.\n✓ The RDBMS (PostgreSQL, MySQL, SQLite, SQL Server) enforces the schema, coordinates users, and answers queries.\n✓ A primary key uniquely identifies each row; a foreign key references another table's primary key to relate tables.\n✓ Storing each fact exactly once — instead of copying it — prevents update anomalies.\n✓ SQL is a declarative standard: you describe what data you want, and it works nearly identically across dialects.\n✓ Production (OLTP) databases handle live transactions; warehouses (OLAP) handle analytics — both speak SQL.\n\nNext up: SELECT & FROM. You now know where the data lives — next you'll write real queries against it: choosing columns, renaming them with aliases, and de-duplicating results with DISTINCT. How do you ask a table with a million rows for exactly the two columns you need? That's lesson two.",
    },
  ],
};
