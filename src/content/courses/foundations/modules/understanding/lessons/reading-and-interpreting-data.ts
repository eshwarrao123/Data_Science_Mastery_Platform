import type { Lesson } from "@/lib/curriculum/types";

/** Skill unlocked: can open an unfamiliar table and correctly read rows,
 *  columns, and cell values without misinterpreting the layout. */
export const readingAndInterpretingData: Lesson = {
  meta: {
    id: "foundations.understanding.reading-and-interpreting-data",
    slug: "reading-and-interpreting-data",
    title: "Reading & Interpreting Data",
    description:
      "Read a data table with confidence — identify observations, variables, and values, and translate a raw table into a plain-English description of what it records.",
    estimatedTime: "25 mins",
    difficulty: "Beginner",
    xpReward: 50,
    prerequisites: ["foundations.intro.types-of-data"],
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
        hook: "Open any real dataset for the first time and it looks like a wall of numbers and words in a grid. The people who thrive in data don't have a special gift — they've just learned to read that grid like a sentence: this row is one customer, this column is their age, this cell is 34. By the end of this lesson you'll look at any table and instantly say, in plain English, what it records.",
        what: "A data table is a grid with a strict meaning: each row is one thing you measured (an observation), each column is one property you recorded about it (a variable), and each cell is a single value where a row and column meet.",
        why: "Before you can clean, chart, or model data, you have to read it correctly. Misreading which way a table runs — treating columns as rows, or a header as data — is the very first mistake beginners make, and it quietly poisons everything downstream.",
        whereUsed:
          "Spreadsheets, CSV files, database tables, survey exports, and every pandas DataFrame you'll ever load. Reading a table fluently is the skill under all of them.",
        objectives: [
          "Identify the observation each row represents in a table",
          "Identify the variable each column records",
          "Read a single cell as the value of one variable for one observation",
          "Describe a whole table in one plain-English sentence",
          "Distinguish a header row from a data row",
        ],
        realWorldApps: [
          {
            company: "Spotify",
            headline: "One row per stream",
            detail:
              "Spotify's raw logs record one row every time a track is played — with columns for user, track, timestamp, and seconds listened. Reading that layout correctly is step one before any listening analysis.",
          },
          {
            company: "WHO",
            headline: "One row per country per year",
            detail:
              "Global health tables often store one row for each country in each year, with columns for life expectancy, population, and income. Knowing what a single row stands for prevents comparing the wrong things.",
          },
          {
            company: "Airbnb",
            headline: "One row per listing",
            detail:
              "An Airbnb export gives one row per listing, with columns for price, location, reviews, and room type. Analysts read this grid daily to answer questions about the market.",
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
            "A data table has three parts, and naming them removes all the confusion. A row is one observation — a single thing you measured, like one customer or one sale. A column is one variable — a single property recorded for every observation, like age or price. A cell is one value — what that variable equals for that specific observation.",
        },
        {
          type: "analogy",
          title: "A table is a class register",
          content:
            "Picture a school register. Each row is one student (the observation). The columns are the things recorded about every student — name, age, grade (the variables). A single cell, where 'Amara's row meets the 'age' column, holds one value: 12. You already read registers, receipts, and timetables this way. A data table is the same idea with a stricter promise: every row is the same kind of thing, and every column means the same thing all the way down.",
        },
        {
          type: "keypoint",
          title: "Rows, columns, cells",
          content:
            "Row = one observation (one thing measured). Column = one variable (one property recorded for all of them). Cell = one value (a single variable for a single observation). Read the whole table as: 'each row is one ___, and the columns tell me its ___.'",
        },
        {
          type: "text",
          content:
            "The single most important question about any table is: what does one row represent? This is called the unit of observation. Answer it first, every time. 'One row is one order' and 'one row is one customer' are completely different tables, even if they share column names.",
        },
        {
          type: "code-note",
          code: "customer_id   age   city      total_spent\n1001          34    Nairobi   249.90\n1002          28    Lagos     87.50\n1003          45    Accra     512.00\n# One row = one customer. Columns = what we know about them.",
          content:
            "Read across a single row to learn everything about one observation: customer 1002 is 28, lives in Lagos, and has spent 87.50. Read down a single column to compare that one property across everyone: the ages are 34, 28, 45.",
        },
        {
          type: "text",
          content:
            "The first row is usually special: it's the header, and it names the variables rather than holding data. Confusing a header for a real observation is a classic slip — it can turn 'age' into a value and shift every number into the wrong column.",
        },
        {
          type: "analogy",
          title: "Reading across vs. reading down",
          content:
            "Reading across a row answers 'tell me everything about this one thing.' Reading down a column answers 'compare this one property across all things.' It's like a spreadsheet of your friends: read across to describe one friend fully; read down the 'birthday' column to see everyone's birthday at once. Most analysis is really just choosing which direction to read.",
        },
        {
          type: "warning",
          title: "A wide table isn't automatically 'more' data",
          content:
            "Beginners assume a table with more columns holds more information than a table with more rows. Not so — they can describe the same facts arranged differently. Always ask what one row means before judging how much a table contains. You'll meet the deeper version of this idea (tidy vs. wide data) in later lessons.",
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
        title: "Anatomy of a Data Table",
        caption:
          "Click each part to see exactly what it means and how to read it. The whole grid is just these three ideas repeated.",
        nodes: [
          {
            id: "header",
            label: "Header row",
            sublabel: "names the columns",
            detail:
              "The top row labels each variable — customer_id, age, city. It is not an observation; it's the legend for the table. Mistaking it for data shifts every value out of place.",
            x: 50,
            y: 12,
            accent: false,
          },
          {
            id: "row",
            label: "Row",
            sublabel: "one observation",
            detail:
              "A single row is one thing you measured — one customer, one sale, one country-year. Read across it to learn everything about that one thing. Answer 'what is one row?' before anything else.",
            x: 18,
            y: 45,
            accent: true,
          },
          {
            id: "column",
            label: "Column",
            sublabel: "one variable",
            detail:
              "A single column is one property recorded for every row — age, price, city. Read down it to compare that property across all observations. Each column has one data type (numerical or categorical).",
            x: 82,
            y: 45,
            accent: true,
          },
          {
            id: "cell",
            label: "Cell",
            sublabel: "one value",
            detail:
              "Where a row meets a column sits one value: the value of that variable for that observation. Example: the cell at customer 1002's row and the 'city' column holds 'Lagos'.",
            x: 50,
            y: 78,
            accent: true,
          },
        ],
        edges: [
          { from: "header", to: "column", label: "labels each" },
          { from: "row", to: "cell", label: "contains" },
          { from: "column", to: "cell", label: "contains" },
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
          title: "What is one row?",
          scenario:
            "You open a table with columns track_name, artist, and plays.",
          steps: [
            {
              code: "track_name        artist     plays\nMidnight City     M83        1204",
              explanation:
                "Ask the one essential question: what does a single row represent? Each row holds one track's name, its artist, and its play count — so one row is one song. The columns tell you three things about that song.",
            },
          ],
          output: "One row = one song. The unit of observation is a track.",
        },
        {
          difficulty: "Easy",
          title: "Reading a single cell",
          scenario:
            "A support team tracks tickets. You need the priority of ticket 4402.",
          steps: [
            {
              code: "ticket_id   customer   priority   status\n4401        Priya      Low        Closed\n4402        Wei        High       Open",
              explanation:
                "Find the row where one observation (ticket 4402) lives, then move across to the column for the variable you want (priority).",
            },
            {
              code: "value = row(4402) x column(priority)",
              explanation:
                "The cell at that intersection is the answer. A cell is always 'one variable, for one observation' — here, the priority of ticket 4402.",
            },
          ],
          output: "Ticket 4402's priority is High.",
        },
        {
          difficulty: "Medium",
          title: "Across vs. down",
          scenario:
            "A store's daily table has columns date, units_sold, and revenue. A manager asks two questions.",
          steps: [
            {
              code: "q1 = 'What happened on 2026-03-02?'",
              explanation:
                "This is about one observation, so read across that row: on 2026-03-02 the store sold some units and made some revenue. One row, all its variables.",
            },
            {
              code: "q2 = 'How did revenue trend this week?'",
              explanation:
                "This is about one variable across many observations, so read down the revenue column: the sequence of daily revenues reveals the trend. One column, all the rows.",
            },
          ],
          output: "Describe one day → read across a row. Track one metric → read down a column.",
        },
        {
          difficulty: "Hard",
          title: "The same facts, two different tables",
          scenario:
            "Two tables both describe monthly sales for two products. You must decide what one row means in each.",
          steps: [
            {
              code: "# Table A\nmonth     product   units\nJan       Shoes     120\nJan       Bags      80",
              explanation:
                "In Table A, one row is one product in one month. The unit of observation is a product-month. There are two rows for January.",
            },
            {
              code: "# Table B\nmonth     shoes_units   bags_units\nJan       120           80",
              explanation:
                "In Table B, one row is one month, and each product has its own column. The unit of observation is a month. Same facts, different shape.",
            },
            {
              code: "insight = 'always ask what one row means — it changes per table'",
              explanation:
                "Both tables record identical numbers, but confuse their layouts and you'll double-count or misalign values. The facts didn't change; the unit of observation did.",
            },
          ],
          output: "Table A: one row = product-month. Table B: one row = month. Read before you trust.",
        },
        {
          difficulty: "Industry Example",
          title: "Reading a raw Uber trips export",
          scenario:
            "A data analyst at Uber opens a fresh trips file and, before any analysis, writes one sentence describing it.",
          steps: [
            {
              code: "trip_id  rider_id  city     distance_km  fare  surge\n88213    R5521     Nairobi  6.4          9.20  1.0",
              explanation:
                "Scan the columns and one sample row. Each row carries a unique trip_id and details of a single ride — so one row is one trip.",
            },
            {
              code: "unit = 'one row = one completed trip'\nvariables = ['who', 'where', 'how far', 'how much', 'surge applied']",
              explanation:
                "Name the unit of observation, then group the columns by what they describe: the rider, the location, and the trip's measurements. This is the analyst's mental map of the file.",
            },
            {
              code: "sentence = 'Each row is one Uber trip, recording the rider, city, distance, fare, and whether surge applied.'",
              explanation:
                "That one plain-English sentence is the deliverable of reading a table. Every later step — cleaning, charting, modelling — depends on getting it right first.",
            },
          ],
          output: "One clear sentence describing the table is the foundation for everything after it.",
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
        filename: "read_the_table.py",
        instructions:
          "Below is a tiny table stored as rows of text. Answer three reading questions by filling in the blanks: what one row represents, one specific cell value, and how many observations (data rows) there are. Then run it. No prior coding needed — you're just reading the grid.",
        starterCode: `# A table of library book loans.
# Columns:  loan_id | member   | book_title        | days_out
rows = [
    ["L01",  "Jamal",  "Deep Work",         14],
    ["L02",  "Carol",  "The Pragmatic Dev", 7],
    ["L03",  "Amara",  "Sapiens",           21],
]

# TODO 1: What does ONE row represent? (fill the string)
one_row_is = ___          # e.g. "one book loan"

# TODO 2: The book_title in row L02 (read across that row)
l02_book = ___            # copy the exact title in quotes

# TODO 3: How many observations (data rows) are there?
num_observations = ___    # a whole number

print(one_row_is)
print(l02_book)
print(num_observations)`,
        solutionCode: `# A table of library book loans.
# Columns:  loan_id | member   | book_title        | days_out
rows = [
    ["L01",  "Jamal",  "Deep Work",         14],
    ["L02",  "Carol",  "The Pragmatic Dev", 7],
    ["L03",  "Amara",  "Sapiens",           21],
]

one_row_is = "one book loan"
l02_book = "The Pragmatic Dev"
num_observations = 3

print(one_row_is)
print(l02_book)
print(num_observations)`,
        expectedOutput: "one book loan\nThe Pragmatic Dev\n3",
        hints: [
          "Look at what each row has in common — every row describes a single loan event.",
          "For TODO 2, find the row starting with 'L02', then read across to the book_title column.",
          "For TODO 3, count only the data rows, not the comment describing the columns.",
          "There are three inner lists, so three observations; L02's title is 'The Pragmatic Dev'.",
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
          id: "fnd05_mcq_01",
          difficulty: "Easy",
          question: "In a data table, what does a single row usually represent?",
          options: [
            "One variable recorded for everyone",
            "One observation — a single thing that was measured",
            "The names of all the columns",
            "One value at a single intersection",
          ],
          correctIndex: 1,
          explanation:
            "A row is one observation: one customer, one sale, one country-year. A variable recorded for everyone is a column, the names of columns are the header, and a single value is a cell.",
        },
        {
          type: "mcq",
          id: "fnd05_mcq_02",
          difficulty: "Easy",
          question:
            "You want to compare the ages of every customer in a table. Which direction do you read?",
          options: [
            "Across a single row",
            "Down the age column",
            "Only the header row",
            "Diagonally across the table",
          ],
          correctIndex: 1,
          explanation:
            "Comparing one property across all observations means reading down that column. Reading across a row describes one customer fully; the header only names columns; diagonal reading has no meaning in a table.",
        },
        {
          type: "scenario",
          id: "fnd05_sc_01",
          difficulty: "Medium",
          scenario:
            "You open a file and the very first row reads: region | q1_sales | q2_sales. The second row reads: North | 4200 | 5100.",
          question: "How should you interpret the first row?",
          options: [
            "It's the first observation, a region literally named 'region'",
            "It's the header — it names the variables, not a data point",
            "It's a cell value",
            "It's a duplicate of the second row",
          ],
          correctIndex: 1,
          explanation:
            "The first row labels the columns — it's the header, not data. Treating it as an observation would invent a fake region and push every real value into the wrong place. It's neither a single cell nor a duplicate.",
        },
        {
          type: "mcq",
          id: "fnd05_mcq_03",
          difficulty: "Medium",
          question:
            "A table has columns order_id, customer, item, and price, with one row per purchased item. What is the unit of observation?",
          options: [
            "One customer",
            "One purchased item (order line)",
            "One price",
            "One column",
          ],
          correctIndex: 1,
          explanation:
            "With one row per purchased item, the unit of observation is a single order line. It isn't one customer (a customer could have many rows), and price and columns are variables, not the unit of observation.",
        },
        {
          type: "scenario",
          id: "fnd05_sc_02",
          difficulty: "Hard",
          scenario:
            "Table A has one row per student with columns math_score and science_score. Table B has one row per student-subject with columns subject and score. A colleague says Table A 'has more data' because it's wider.",
          question: "What's the accurate response?",
          options: [
            "Agree — wider tables always contain more information",
            "Disagree — both can hold the same facts; width isn't the amount of information, and the unit of observation differs",
            "Agree — Table B is missing the subject scores",
            "Disagree — Table B is invalid because subjects can't be a column",
          ],
          correctIndex: 1,
          explanation:
            "The two layouts can encode identical facts; Table A's unit is a student, Table B's is a student-subject. Width doesn't equal information, Table B isn't missing anything, and having 'subject' as a column is perfectly valid.",
        },
        {
          type: "coding",
          id: "fnd05_code_01",
          difficulty: "Medium",
          prompt:
            "Given a table as a list of rows, read DOWN one column. Print the city of every row (the third field, index 2), one per line. Use a loop.",
          starterCode:
            'rows = [\n    ["1001", "34", "Nairobi"],\n    ["1002", "28", "Lagos"],\n    ["1003", "45", "Accra"],\n]\n# Print each row\'s city (index 2), one per line\n',
          solutionCode:
            'rows = [\n    ["1001", "34", "Nairobi"],\n    ["1002", "28", "Lagos"],\n    ["1003", "45", "Accra"],\n]\nfor row in rows:\n    print(row[2])',
          expectedOutput: "Nairobi\nLagos\nAccra",
          tests: [
            {
              name: "Reads down a column",
              description: "Prints the index-2 value from every row.",
            },
            {
              name: "Output",
              description: "Prints the three cities in order, one per line.",
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
            "What are the parts of a data table, and how do you read one?",
          answer:
            "A data table has three parts. A row is one observation — a single thing that was measured, like one customer or one order. A column is one variable — a single property recorded for every observation, like age or price. A cell is one value, sitting where a row and column meet. To read a table, I first ask what one row represents — the unit of observation — then read across a row to describe one thing fully, or down a column to compare one property across everything. The header row at the top names the variables and isn't data itself.",
        },
        {
          question:
            "Why is identifying the 'unit of observation' the first thing you do with a new dataset?",
          answer:
            "Because everything downstream depends on it. The unit of observation is what a single row represents, and getting it wrong causes silent, serious errors. If I think one row is a customer when it's actually one order, I'll badly overcount customers and misread averages, since a single customer might span many rows. It also determines which operations are valid — whether I can sum a column, how I join to another table, and what a groupby means. Two tables with identical column names can have completely different units, so I never assume. Stating the unit in one plain sentence — 'each row is one completed trip' — is a quick check that forces me to actually understand the data before manipulating it.",
        },
        {
          question:
            "The same information can often be stored in a 'wide' table or a 'long' table. How do you reason about which layout you're looking at, and why does it matter?",
          answer:
            "I reason about it by, again, pinning down the unit of observation. In a wide layout, one row is a single entity and repeated measurements are spread across separate columns — for example one row per student with a math_score and a science_score column. In a long layout, one row is an entity-measurement pair, so the same student gets one row per subject with a 'subject' column and a single 'score' column. Neither is more correct in the abstract; they encode the same facts. It matters because tools and operations prefer different shapes — most statistical and plotting tools, and pandas groupby, work more naturally on long, tidy data, while wide tables are easier for humans to scan and for certain matrix operations. Recognising which one I have tells me whether I need to reshape it before analysis, and prevents mistakes like treating a repeated entity as if each row were independent.",
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
        "1) Skipping the first question — always name what one row represents before doing anything else. 2) Reading the header row as if it were a real observation, which shifts every value out of alignment. 3) Assuming a wider table holds more information than a taller one. 4) Confusing 'across a row' (describe one thing) with 'down a column' (compare one property) and reading in the wrong direction for the question asked.",
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
        "Try these prompts in the AI Tutor panel: • 'Show me a small table and quiz me on what one row represents.' • 'ELI5: the difference between a row, a column, and a cell.' • 'Give me a table and ask whether a question needs me to read across or down.' • 'Explain unit of observation with a fresh example.' • 'Interview mode: hand me a raw table and ask me to describe it in one sentence.'",
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
        "Row — one observation; a single thing measured. Column — one variable; a property recorded for every observation. Cell — one value at the intersection of a row and column. Observation — the thing a row stands for. Variable — the property a column records. Unit of observation — what a single row represents (e.g. one order, one customer). Header row — the top row that names the columns rather than holding data. Wide vs. long — two table shapes that can store the same facts differently.",
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
        "• Paper: Hadley Wickham's 'Tidy Data' — the clearest explanation of rows-as-observations and columns-as-variables (skim the first few pages). • Practice: open any spreadsheet on your computer and write one sentence naming its unit of observation. • Dataset: browse a table on Our World in Data and identify its row, column, and cell meaning before reading the chart. • Next in DSM: you can read a table — next you'll name every part of a full dataset and the vocabulary that maps onto pandas.",
    },

    /* ---------------------------------------------------------------- */
    /*  12 — Recap                                                       */
    /* ---------------------------------------------------------------- */
    {
      id: "recap",
      type: "recap",
      tocLabel: "Recap",
      content:
        "✓ A row is one observation, a column is one variable, and a cell is one value where they meet.\n✓ The first question about any table is: what does one row represent (the unit of observation)?\n✓ Read across a row to describe one thing; read down a column to compare one property.\n✓ The header row names the variables — it is not a data point.\n✓ Table width doesn't equal information; the same facts can be stored in different shapes.\n\nNext up: What Makes a Dataset? You can now read a table's grid — next you'll learn the full vocabulary of a dataset, including keys and granularity, the exact words that map onto rows and columns when you reach pandas.",
    },
  ],
};
