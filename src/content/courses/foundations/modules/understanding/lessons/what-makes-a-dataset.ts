import type { Lesson } from "@/lib/curriculum/types";

/** Skill unlocked: can describe a dataset's anatomy — rows, columns, keys,
 *  data types, and granularity — a prerequisite for pandas DataFrames. */
export const whatMakesADataset: Lesson = {
  meta: {
    id: "foundations.understanding.what-makes-a-dataset",
    slug: "what-makes-a-dataset",
    title: "What Makes a Dataset?",
    description:
      "Break a dataset into its parts — records, features, keys, and granularity — and learn the vocabulary that maps directly onto rows and columns in pandas.",
    estimatedTime: "20 mins",
    difficulty: "Beginner",
    xpReward: 40,
    prerequisites: ["foundations.understanding.reading-and-interpreting-data"],
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
        hook: "You can now read a table — but 'that column' and 'the one that links the two files' won't survive a real team conversation. Data people share a precise vocabulary: features, records, keys, granularity. Learn these five words and you can describe any dataset exactly, join two of them correctly, and read pandas documentation without translating in your head. By the end you'll name every part of a dataset like a professional.",
        what: "A dataset is a structured collection of data with named parts: records (rows), features (columns), a key that uniquely identifies each record, data types on each feature, and a granularity — the level of detail one record captures.",
        why: "Vague words cause real bugs. If you can't say which column is the key, you'll join two tables wrongly and silently duplicate rows. If you can't state the granularity, you'll mix daily and monthly data. Precise vocabulary is precise thinking.",
        whereUsed:
          "Every database schema, every pandas DataFrame, every data dictionary a team writes. Joining tables, grouping data, and designing a database all depend on these terms.",
        objectives: [
          "Name a dataset's records and features using standard vocabulary",
          "Identify the key (unique identifier) of a dataset",
          "State the granularity — what one record represents",
          "Explain why a key must be unique and non-missing",
          "Connect these terms to rows and columns you'll see in pandas",
        ],
        realWorldApps: [
          {
            company: "Amazon",
            headline: "Keys link orders to customers",
            detail:
              "An orders table and a customers table are connected by customer_id — a key. Getting that key right is how Amazon attaches every purchase to the right account without mixing people up.",
          },
          {
            company: "Instagram",
            headline: "Granularity decides the story",
            detail:
              "A table at one-row-per-post answers different questions than one at one-row-per-account. Instagram's analysts pick the granularity that matches the metric they're reporting.",
          },
          {
            company: "Tesla",
            headline: "Features are the sensor readings",
            detail:
              "Each vehicle log record carries dozens of features — speed, battery temperature, GPS. Naming and typing those features correctly is what makes fleet-wide analysis possible.",
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
            "You already know a row is an observation and a column is a variable. Data teams have interchangeable names for these, and you'll meet all of them. A row is also called a record or an instance. A column is also called a feature, a field, or an attribute. Same grid, richer vocabulary.",
        },
        {
          type: "keypoint",
          title: "The five parts of a dataset",
          content:
            "Record — one row (also: instance). Feature — one column (also: field, attribute). Value — one cell. Key — the feature (or features) that uniquely identifies each record. Granularity — the level of detail one record represents. Master these five and you can describe any dataset precisely.",
        },
        {
          type: "text",
          content:
            "The key is the most important new idea. A key is a feature whose value is unique for every record and never missing — like customer_id or order_id. It's the dataset's fingerprint: give me a key value and I can find exactly one record, with no ambiguity.",
        },
        {
          type: "analogy",
          title: "A key is a passport number",
          content:
            "Two people can share the name 'Maria Garcia', the same birth city, even the same birthday. But no two people share a passport number — it's issued to be unique. A key does the same job for records: names and other features can collide, but the key always points to exactly one row. That's why databases join on keys, not on names.",
        },
        {
          type: "code-note",
          code: "order_id   customer_id   item        price\nA-1001     C-77          Headphones  59.99\nA-1002     C-77          Cable       9.99\n# key = order_id (unique per row). customer_id repeats — the same\n# customer placed two orders — so it is NOT the key of this table.",
          content:
            "order_id is unique on every row, so it's the key. customer_id appears twice because one customer made two orders — it's a real feature, but not this table's key. It is, however, the link (a foreign key) to a separate customers table.",
        },
        {
          type: "text",
          content:
            "Granularity is the level of detail a record captures — the answer to 'what is one row?' from the last lesson, now given a name. 'One row per order' is finer granularity than 'one row per customer'. You can always summarise fine data up to a coarser level, but you can never invent detail that a coarse dataset didn't record.",
        },
        {
          type: "expandable",
          title: "What is a composite key?",
          content:
            "Sometimes no single feature is unique, but a combination is. In a table with one row per student per subject, neither student_id nor subject is unique alone — a student appears in several subjects, and a subject has many students. But the pair (student_id, subject) is unique: there's exactly one row for 'student 12 in Maths'. That pair is a composite key. You'll rely on this idea constantly when a dataset's granularity is a combination of things, and pandas lets you set exactly these columns as the index.",
        },
        {
          type: "warning",
          title: "Don't use a name or email as a key without thinking",
          content:
            "Names repeat and change; even emails get reused or shared. Using them as a key leads to two different people being merged or one person being split. Prefer a purpose-made ID (customer_id, order_id). If you must key on something real-world, confirm it's genuinely unique and never missing first.",
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
        title: "Two Tables, One Key",
        caption:
          "Click each part to see its role. Notice how customer_id links the two tables — that shared key is the heart of relational data.",
        nodes: [
          {
            id: "orders",
            label: "Orders table",
            sublabel: "one row per order",
            detail:
              "Granularity: one record per order. Key: order_id (unique). Features: order_id, customer_id, item, price. customer_id here is a foreign key — it points into the customers table.",
            x: 22,
            y: 30,
            accent: true,
          },
          {
            id: "customers",
            label: "Customers table",
            sublabel: "one row per customer",
            detail:
              "Granularity: one record per customer. Key: customer_id (unique here). Features: customer_id, name, city, signup_date. Coarser granularity than the orders table.",
            x: 78,
            y: 30,
            accent: true,
          },
          {
            id: "key",
            label: "customer_id",
            sublabel: "the shared key",
            detail:
              "Unique in the customers table (its primary key), repeated in the orders table (a foreign key). Joining on this feature attaches each order to exactly the right customer.",
            x: 50,
            y: 58,
            accent: true,
          },
          {
            id: "granularity",
            label: "Granularity",
            sublabel: "level of detail",
            detail:
              "Orders are fine-grained (per order); customers are coarse (per person). You can roll orders up to per-customer totals, but you can't split a per-customer table back into individual orders it never stored.",
            x: 50,
            y: 84,
            accent: false,
          },
        ],
        edges: [
          { from: "orders", to: "key", label: "foreign key" },
          { from: "customers", to: "key", label: "primary key" },
          { from: "key", to: "granularity", label: "defines the link" },
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
          title: "Spot the key",
          scenario:
            "A table has features employee_id, name, department, with one row per employee.",
          steps: [
            {
              code: "employee_id  name    department\nE-01         Priya   Sales\nE-02         Dave    Sales",
              explanation:
                "A key must be unique on every row. employee_id is (E-01, E-02...); name and department repeat across people. So employee_id is the key.",
            },
          ],
          output: "Key = employee_id (unique and non-missing).",
        },
        {
          difficulty: "Easy",
          title: "Naming the parts",
          scenario:
            "You describe a movies table to a teammate using the standard vocabulary.",
          steps: [
            {
              code: "movie_id  title       year  rating\nM-1       Inception   2010  8.8",
              explanation:
                "Each row is a record (one movie). Each column is a feature (movie_id, title, year, rating). A single cell is a value.",
            },
            {
              code: "key = 'movie_id'; granularity = 'one record per movie'",
              explanation:
                "movie_id uniquely identifies each record, so it's the key. The granularity is one row per movie. Now the whole dataset is described in shared, unambiguous terms.",
            },
          ],
          output: "Records = movies, features = the columns, key = movie_id, granularity = per movie.",
        },
        {
          difficulty: "Medium",
          title: "When a column is not the key",
          scenario:
            "A payments table has features payment_id, customer_id, amount. A teammate assumes customer_id is the key.",
          steps: [
            {
              code: "payment_id  customer_id  amount\nP-100       C-9          20.00\nP-101       C-9          35.00",
              explanation:
                "customer_id C-9 appears on two rows — the same customer paid twice. A key can't repeat, so customer_id is not the key of this table.",
            },
            {
              code: "key = 'payment_id'  # unique on every row",
              explanation:
                "payment_id is unique per row, so it's the true key. customer_id is a useful feature and a foreign key to the customers table, but not this table's identifier.",
            },
          ],
          output: "Key = payment_id; customer_id repeats, so it's a feature/foreign key, not the key.",
        },
        {
          difficulty: "Hard",
          title: "A composite key and granularity",
          scenario:
            "A class-grades table has features student_id, subject, and score. No single column is unique.",
          steps: [
            {
              code: "student_id  subject   score\nS-1         Maths     78\nS-1         Science   85\nS-2         Maths     64",
              explanation:
                "student_id repeats (S-1 studies two subjects) and subject repeats (two students take Maths). Neither alone can be the key.",
            },
            {
              code: "key = (student_id, subject)  # composite key",
              explanation:
                "The pair is unique: there's exactly one row for 'S-1 in Maths'. Together they form a composite key. This tells you the granularity precisely.",
            },
            {
              code: "granularity = 'one record per student per subject'",
              explanation:
                "The composite key names the granularity. Knowing it prevents errors like averaging a student's scores as if each subject were a separate student.",
            },
          ],
          output: "Composite key (student_id, subject); granularity = one record per student-subject.",
        },
        {
          difficulty: "Industry Example",
          title: "Designing a dataset for a food-delivery app",
          scenario:
            "A data scientist at a delivery company must describe two linked datasets before the engineering team builds them.",
          steps: [
            {
              code: "# deliveries: one row per delivery\n# features: delivery_id (key), courier_id, restaurant_id, minutes, tip",
              explanation:
                "The deliveries dataset has fine granularity — one record per delivery. delivery_id is the key; courier_id and restaurant_id are foreign keys pointing to other datasets.",
            },
            {
              code: "# couriers: one row per courier\n# features: courier_id (key), name, vehicle, city",
              explanation:
                "The couriers dataset is coarser — one record per courier. courier_id is its key, and it's the link back to the deliveries dataset.",
            },
            {
              code: "join = 'attach courier details to each delivery via courier_id'",
              explanation:
                "Because both datasets share the courier_id key, the team can join them to answer questions like 'average tip per vehicle type'. Precise vocabulary — records, features, keys, granularity — is what makes this design communicable and correct.",
            },
          ],
          output: "Two datasets, clear keys and granularities, linked by a shared key — a sound design.",
        },
      ],
    },

    /* ---------------------------------------------------------------- */
    /*  5 — Hands-on Practice / Activity                                 */
    /* ---------------------------------------------------------------- */
    {
      id: "inline-practice",
      type: "inline-code",
      tocLabel: "Practice Activity",
      coding: {
        language: "python",
        filename: "describe_the_dataset.py",
        instructions:
          "Below is a small dataset with its column names. Describe it using the standard vocabulary by filling in the blanks: which feature is the key, and what the granularity is. Then a quick check counts the records for you. Run it when done.",
        starterCode: `# A gym check-ins dataset.
columns = ["visit_id", "member_id", "date", "minutes"]
records = [
    ["V-1", "M-10", "2026-03-01", 45],
    ["V-2", "M-10", "2026-03-02", 30],
    ["V-3", "M-22", "2026-03-01", 60],
]

# TODO 1: Which column is unique on every row and is the key?
key = ___                     # a column name in quotes

# TODO 2: What does one record represent? (the granularity)
granularity = ___             # e.g. "one gym visit"

# A quick check: how many records are there?
num_records = len(records)

print("Key:", key)
print("Granularity:", granularity)
print("Records:", num_records)`,
        solutionCode: `# A gym check-ins dataset.
columns = ["visit_id", "member_id", "date", "minutes"]
records = [
    ["V-1", "M-10", "2026-03-01", 45],
    ["V-2", "M-10", "2026-03-02", 30],
    ["V-3", "M-22", "2026-03-01", 60],
]

key = "visit_id"
granularity = "one gym visit"
num_records = len(records)

print("Key:", key)
print("Granularity:", granularity)
print("Records:", num_records)`,
        expectedOutput: "Key: visit_id\nGranularity: one gym visit\nRecords: 3",
        hints: [
          "The key must be unique on every row — check which column never repeats.",
          "member_id repeats (M-10 appears twice), so it can't be the key.",
          "visit_id is different on every row — that's your key.",
          "Each row is a single check-in, so the granularity is one gym visit.",
        ],
      },
    },

    /* ---------------------------------------------------------------- */
    /*  6 — Exercises + Quiz                                             */
    /* ---------------------------------------------------------------- */
    {
      id: "exercises",
      type: "mastery-assessment",
      tocLabel: "Quiz & Exercises",
      masteryThreshold: 80,
      exercises: [
        {
          type: "mcq",
          id: "fnd06_mcq_01",
          difficulty: "Easy",
          question: "What is a 'feature' in a dataset?",
          options: [
            "A single row",
            "A single column (a property recorded for every record)",
            "The unique identifier of the dataset",
            "A missing value",
          ],
          correctIndex: 1,
          explanation:
            "A feature is a column — also called a field or attribute. A row is a record, the unique identifier is the key, and a missing value is a data-quality issue, not a feature.",
        },
        {
          type: "mcq",
          id: "fnd06_mcq_02",
          difficulty: "Easy",
          question: "What two properties must a key have?",
          options: [
            "It must be a number and be sorted",
            "It must be unique for every record and never missing",
            "It must be the first column and be text",
            "It must repeat across records to link them",
          ],
          correctIndex: 1,
          explanation:
            "A key uniquely identifies each record and is never missing. It doesn't have to be a number, be first, or be sorted — and a value that repeats across records is precisely what a key must not do.",
        },
        {
          type: "mcq",
          id: "fnd06_mcq_03",
          difficulty: "Medium",
          question:
            "A table lists one row per order, with columns order_id and customer_id. customer_id appears on several rows. What is customer_id in this table?",
          options: [
            "The primary key",
            "A feature and a foreign key linking to a customers table — but not this table's key",
            "The granularity",
            "A composite key",
          ],
          correctIndex: 1,
          explanation:
            "Because customer_id repeats, it can't be this table's key. It's a normal feature that also acts as a foreign key to the customers table. order_id is the primary key; granularity is a level of detail, not a column.",
        },
        {
          type: "scenario",
          id: "fnd06_sc_01",
          difficulty: "Medium",
          scenario:
            "A colleague wants to use customer full name as the key to merge two datasets, because 'everyone's name is different'.",
          question: "How should you respond?",
          options: [
            "Agree — names are always unique",
            "Push back — names repeat and change; use a purpose-made ID as the key instead",
            "Agree, but only if the names are sorted first",
            "Push back — names can never be stored in a dataset",
          ],
          correctIndex: 1,
          explanation:
            "Names collide (many people share one) and change over time, so keying on them merges different people or splits one person. A stable, unique ID is the right key. Sorting doesn't make names unique, and names are perfectly valid as ordinary features.",
        },
        {
          type: "scenario",
          id: "fnd06_sc_02",
          difficulty: "Hard",
          scenario:
            "You have a table with one row per (product, warehouse) combination showing stock levels. Neither product_id nor warehouse_id is unique on its own.",
          question: "What identifies each record?",
          options: [
            "product_id alone is the key",
            "The composite key (product_id, warehouse_id)",
            "There is no possible key, so the table is invalid",
            "warehouse_id alone is the key",
          ],
          correctIndex: 1,
          explanation:
            "Each product appears in many warehouses and each warehouse holds many products, so neither column is unique alone. Their combination is unique — a composite key — and it also states the granularity: one record per product per warehouse. The table is perfectly valid.",
        },
        {
          type: "coding",
          id: "fnd06_code_01",
          difficulty: "Medium",
          prompt:
            "Check whether a column can be a key by testing if all its values are unique. Given a list of id values, print 'unique' if there are no duplicates and 'not unique' otherwise. Hint: compare len(ids) with len(set(ids)).",
          starterCode:
            'ids = ["A-1", "A-2", "A-3", "A-2"]\n# Print "unique" if all values differ, else "not unique"\n',
          solutionCode:
            'ids = ["A-1", "A-2", "A-3", "A-2"]\nif len(ids) == len(set(ids)):\n    print("unique")\nelse:\n    print("not unique")',
          expectedOutput: "not unique",
          tests: [
            {
              name: "Detects duplicates",
              description: "Compares list length to the set of distinct values.",
            },
            {
              name: "Output",
              description: "Prints 'not unique' because 'A-2' appears twice.",
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
          question: "What is a key in a dataset, and why does it matter?",
          answer:
            "A key is the feature, or combination of features, that uniquely identifies each record — its value is unique on every row and never missing, like order_id or customer_id. It matters because it's how you reliably find, deduplicate, and join data. When I merge two datasets, I join on a shared key so each record links to exactly the right match; without a proper key, joins duplicate or drop rows silently. A good key is stable and purpose-made rather than something like a name that can repeat or change.",
        },
        {
          question:
            "What is the granularity of a dataset, and why do you check it before combining two datasets?",
          answer:
            "Granularity is the level of detail one record represents — for example one row per order versus one row per customer. I check it before combining datasets because mismatched granularity is a classic source of wrong numbers. If I join a per-order table to a per-customer table without accounting for the difference, I either fan out the customer rows across every order or accidentally sum a customer's total multiple times. The rule I keep in mind is that you can always aggregate finer data up to a coarser level — roll orders up to a per-customer total — but you can never recover detail a coarse dataset never captured. So I confirm the granularity of each side first and decide whether to aggregate one of them before the join.",
        },
        {
          question:
            "Explain the difference between a primary key and a foreign key, and give an example of when a single column is both.",
          answer:
            "A primary key is the column that uniquely identifies each record within its own table — customer_id in a customers table, where every customer appears exactly once. A foreign key is a column in another table that references a primary key elsewhere, creating a link — customer_id in an orders table, where it repeats because one customer places many orders. The same column name plays both roles depending on the table: customer_id is the primary key in customers and a foreign key in orders. A column can even be both in a single table in more advanced designs — for instance a self-referencing employees table where manager_id is a foreign key pointing back to employee_id, the table's own primary key. The practical point is that primary keys enforce uniqueness and foreign keys enforce valid links, and joins are built on matching a foreign key to its primary key.",
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
        "1) Calling a repeating column the key — a key must be unique on every row. 2) Using names or emails as keys; they collide and change, so prefer a purpose-made ID. 3) Forgetting composite keys when no single column is unique (e.g. product + warehouse). 4) Joining two datasets without checking their granularity, which silently duplicates or drops rows.",
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
        "Try these prompts in the AI Tutor panel: • 'Give me a table and quiz me on which column is the key.' • 'ELI5: what is a composite key?' • 'Show me two datasets and ask which key I'd join them on.' • 'Explain granularity with a fresh example and a trap to avoid.' • 'Interview mode: ask me to explain primary vs. foreign keys.'",
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
        "Dataset — a structured collection of records and features. Record — one row (also: instance). Feature — one column (also: field, attribute). Key — the feature(s) uniquely identifying each record. Primary key — the key within a table. Foreign key — a feature that references another table's primary key. Composite key — a key made of two or more features together. Granularity — the level of detail one record represents. Data dictionary — a document describing each feature's meaning and type.",
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
        "• Reference: 'Primary key' and 'Foreign key' overviews on any beginner SQL tutorial (W3Schools or Mode's SQL tutorial). • Practice: take any two spreadsheets you own and identify a key that could link them. • Concept: read a short 'what is a data dictionary?' explainer to see how teams document features formally. • Next in DSM: you can now describe a dataset precisely — next you'll learn to judge whether you can trust it, starting with data quality.",
    },

    /* ---------------------------------------------------------------- */
    /*  12 — Recap                                                       */
    /* ---------------------------------------------------------------- */
    {
      id: "recap",
      type: "recap",
      tocLabel: "Recap",
      content:
        "✓ A dataset is made of records (rows) and features (columns), holding values in each cell.\n✓ A key uniquely identifies each record — it's unique on every row and never missing.\n✓ A primary key identifies records in its own table; a foreign key links to another table's key.\n✓ When no single feature is unique, a combination can form a composite key.\n✓ Granularity is the level of detail one record represents, and it must match before you combine datasets.\n\nNext up: Data Quality Basics. You can now name every part of a dataset — but naming it doesn't mean you can trust it. Next you'll learn to spot the missing values, duplicates, and inconsistencies that make data unreliable.",
    },
  ],
};
