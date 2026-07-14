import type { Lesson } from "@/lib/curriculum/types";

/** Skill unlocked: can name the core toolkit — Python, Jupyter, spreadsheets,
 *  SQL, Git — and knows which tool fits which stage of the workflow. */
export const toolsOfTheTrade: Lesson = {
  meta: {
    id: "foundations.intro.tools-of-the-trade",
    slug: "tools-of-the-trade",
    title: "Tools of the Trade",
    description:
      "Meet the everyday tools of a data scientist — notebooks, spreadsheets, Python, SQL, and version control — and understand the job each one does.",
    estimatedTime: "20 mins",
    difficulty: "Beginner",
    xpReward: 40,
    prerequisites: ["foundations.intro.the-ds-workflow"],
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
        hook: "A carpenter doesn't use a hammer for everything — they reach for the right tool for each job. Data scientists are the same: a spreadsheet for a quick look, SQL to pull data from a database, Python to do the heavy lifting, and Git to keep it all safe. Knowing which tool does which job means you'll never feel lost opening a real project. By the end of this lesson you'll know the whole toolkit and where each piece fits.",
        what: "The core data science toolkit is a small set of tools: spreadsheets for quick exploration, SQL to get data out of databases, Python (in a Jupyter notebook) as the main workhorse, and Git for version control. Each maps to stages of the workflow you just learned.",
        why: "There are hundreds of data tools, and it's easy to feel overwhelmed. In reality a handful cover the vast majority of daily work. Knowing what each is for — and when to reach for it — saves you from learning everything at once.",
        whereUsed:
          "Every data team on earth uses some mix of these. Job postings for data roles list Python, SQL, and Git so consistently that they're effectively the entry ticket to the field.",
        objectives: [
          "Name the five core tools in a data scientist's toolkit",
          "State the primary job each tool does",
          "Match a tool to the workflow stage where it's most used",
          "Explain what a Jupyter notebook adds over a plain script",
          "Describe why version control (Git) matters for data work",
        ],
        realWorldApps: [
          {
            company: "Netflix",
            headline: "SQL to pull, Python to model",
            detail:
              "Analysts write SQL to extract billions of viewing records from data warehouses, then switch to Python notebooks to explore and model them. The two tools hand off exactly where the workflow expects.",
          },
          {
            company: "Google",
            headline: "Notebooks everywhere (Colab)",
            detail:
              "Google built Colab, a free hosted Jupyter notebook, because notebooks are how data scientists actually work — write a little code, see the result, adjust, repeat.",
          },
          {
            company: "GitHub",
            headline: "Git keeps analysis reproducible",
            detail:
              "Data teams store notebooks and scripts in Git so every analysis has a history: who changed what, when, and the ability to roll back a mistake. It's the safety net under the whole workflow.",
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
            "Start with the tool you already know: the spreadsheet (Excel or Google Sheets). It's perfect for a quick look at small data — a few thousand rows, some sums, a fast chart. Its limit is scale and repeatability: it groans past tens of thousands of rows, and it's hard to reproduce exactly what you clicked.",
        },
        {
          type: "keypoint",
          title: "The five core tools",
          content:
            "Spreadsheet — quick look at small data. SQL — the language for getting data out of databases. Python — the main programming language for cleaning, analysis, and modelling. Jupyter notebook — the interactive workspace where you write and run Python step by step. Git — version control that tracks every change and lets you undo mistakes.",
        },
        {
          type: "text",
          content:
            "Most real data doesn't live in a spreadsheet — it lives in a database. SQL (Structured Query Language) is how you ask a database for exactly the rows and columns you want. It maps directly onto the Collect stage of the workflow: SQL is usually how you get the data in the first place.",
        },
        {
          type: "analogy",
          title: "SQL is ordering from a kitchen",
          content:
            "A database is a huge kitchen full of ingredients. You don't wander in and grab things — you hand the kitchen an order: 'all orders from customers in Kenya, last month, just the date and total.' SQL is the language of that order slip. The kitchen (the database) does the fetching and hands back exactly what you asked for. The analogy breaks down in that, unlike a kitchen, the database returns results in milliseconds even from billions of rows.",
        },
        {
          type: "text",
          content:
            "Python is the workhorse. It's a general-purpose programming language that, thanks to libraries like pandas and scikit-learn, handles cleaning, exploring, and modelling — the middle and end of the workflow. It's the tool this whole platform will teach you to use, so it's worth knowing why it dominates: it's readable, free, and has a library for nearly everything.",
        },
        {
          type: "code-note",
          code: "# A Jupyter notebook cell — write a little, run it, see the result\nrevenue = 4200\nunits = 120\nprint(revenue / units)   # 35.0  <- output appears right below the cell",
          content:
            "A Jupyter notebook lets you run code in small chunks called cells and see each result immediately underneath. That tight write-run-see loop is why notebooks are the default home for exploration — you think and experiment in the same place, unlike a plain script you run all at once.",
        },
        {
          type: "warning",
          title: "Don't confuse the language with the workspace",
          content:
            "Python is the language; Jupyter is one place you can write it. They're often used together but aren't the same thing — you can run Python without Jupyter, and Jupyter can run other languages too. Beginners often say 'Jupyter' when they mean 'Python.' Keep the two ideas separate.",
        },
        {
          type: "expandable",
          title: "What does Git actually protect you from?",
          content:
            "Git is a version control system — it records snapshots of your files over time. For data work it protects you from three disasters: losing work (every snapshot is recoverable), breaking something that worked (you can roll back to a known-good version), and confusion on a team (you can see who changed what and why). GitHub is a popular website for storing Git projects online. You don't need Git for a one-off spreadsheet, but any analysis you'll revisit or share belongs in version control. You'll learn it properly in a later domain — for now, just know it's the safety net.",
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
        title: "Which Tool for Which Job?",
        caption:
          "Click each tool to see its main job, its limits, and the workflow stage it powers.",
        nodes: [
          {
            id: "spreadsheet",
            label: "Spreadsheet",
            sublabel: "Excel / Sheets",
            detail:
              "Job: a fast look at small data — sums, sorts, quick charts. Best stage: early Explore. Limit: struggles past tens of thousands of rows and is hard to reproduce exactly.",
            x: 18,
            y: 28,
            accent: false,
          },
          {
            id: "sql",
            label: "SQL",
            sublabel: "Get data out",
            detail:
              "Job: ask a database for exactly the rows and columns you need. Best stage: Collect. Limit: it fetches and filters data but isn't built for modelling or plotting.",
            x: 50,
            y: 20,
            accent: true,
          },
          {
            id: "python",
            label: "Python",
            sublabel: "The workhorse",
            detail:
              "Job: clean, explore, and model data using libraries like pandas and scikit-learn. Best stages: Clean, Explore, Model. Limit: a steeper learning curve than a spreadsheet — which is what this platform is here to fix.",
            x: 82,
            y: 28,
            accent: true,
          },
          {
            id: "jupyter",
            label: "Jupyter",
            sublabel: "The workspace",
            detail:
              "Job: an interactive notebook to write and run Python in small cells, seeing each result instantly. Best stages: Explore and Model. It's where Python lives during analysis, not a separate language.",
            x: 34,
            y: 68,
            accent: false,
          },
          {
            id: "git",
            label: "Git",
            sublabel: "The safety net",
            detail:
              "Job: version control — snapshot your work, roll back mistakes, and collaborate without overwriting each other. Spans every stage. GitHub is a popular place to store Git projects online.",
            x: 66,
            y: 68,
            accent: false,
          },
        ],
        edges: [
          { from: "sql", to: "python", label: "hand off the data" },
          { from: "python", to: "jupyter", label: "runs inside" },
          { from: "spreadsheet", to: "python", label: "graduate to" },
          { from: "git", to: "python", label: "versions" },
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
          title: "Picking a tool for a quick peek",
          scenario:
            "A colleague emails you a 300-row CSV and asks for the total and a quick bar chart in five minutes.",
          steps: [
            {
              code: "size = '300 rows, one-off, needs a fast chart'",
              explanation:
                "Small, one-time, no repeatability needed. This is exactly what a spreadsheet is best at — open it, sum a column, insert a chart. Reaching for Python here would be slower.",
            },
          ],
          output: "Tool: spreadsheet (fast, small, one-off).",
        },
        {
          difficulty: "Easy",
          title: "Getting data out of a database",
          scenario:
            "The data you need is 5 million order records sitting in the company's database. You want just last month's orders from Kenya.",
          steps: [
            {
              code: "location = 'company database'",
              explanation:
                "The data lives in a database, not a file — so a spreadsheet can't reach it directly, and 5 million rows would overwhelm it anyway.",
            },
            {
              code: "task = 'select only last month, only Kenya, only a few columns'",
              explanation:
                "Asking a database for a specific slice of rows and columns is precisely SQL's job. This is the Collect stage of the workflow.",
            },
          ],
          output: "Tool: SQL (Collect stage — pull a targeted slice from the database).",
        },
        {
          difficulty: "Medium",
          title: "Two tools, one hand-off",
          scenario:
            "You've pulled last month's orders with SQL. Now you need to clean missing values and build a chart of daily revenue.",
          steps: [
            {
              code: "step = 'SQL returned a clean slice of rows'",
              explanation:
                "SQL did the Collect stage — it got the right data out of the database. But SQL isn't the tool for reshaping, filling gaps, or plotting.",
            },
            {
              code: "step = 'load it into Python (pandas) inside a Jupyter notebook'",
              explanation:
                "You hand the data to Python for the Clean and Explore stages. pandas fills missing values; a plotting library draws the chart. Jupyter is where you do this interactively.",
            },
          ],
          output: "SQL to Collect, then Python-in-Jupyter to Clean and Explore — a standard hand-off.",
        },
        {
          difficulty: "Hard",
          title: "Why the spreadsheet finally breaks",
          scenario:
            "An analyst has been doing a monthly report by hand in a spreadsheet. It now covers 800,000 rows and takes a full day of clicking, and last month they made a copy-paste error nobody caught.",
          steps: [
            {
              code: "problem_1 = '800,000 rows — spreadsheet is slow and unstable'",
              explanation:
                "Spreadsheets struggle at this scale. The tool has outgrown the job.",
            },
            {
              code: "problem_2 = 'manual clicking = not reproducible, easy to err'",
              explanation:
                "Because the steps are done by hand each month, they can't be replayed reliably, and a single mis-click corrupts the result silently.",
            },
            {
              code: "solution = 'a Python script/notebook, versioned in Git'",
              explanation:
                "Rewriting the report as Python code makes it fast, exactly repeatable each month, and — stored in Git — recoverable and auditable. This is the natural graduation from spreadsheet to code.",
            },
          ],
          output: "Move from spreadsheet to Python + Git when scale and repeatability matter.",
        },
        {
          difficulty: "Industry Example",
          title: "A day in a data scientist's toolkit at a streaming company",
          scenario:
            "Follow one churn-analysis task through the tools a working data scientist actually touches.",
          steps: [
            {
              code: "# Collect\nsql = 'SELECT user_id, watch_minutes, cancelled FROM subs WHERE month = ...'",
              explanation:
                "The day starts in SQL, pulling the relevant subscriber records out of the warehouse — far too much data for a spreadsheet.",
            },
            {
              code: "# Clean + Explore + Model (Python in Jupyter)\nimport pandas as pd\n# fill missing watch_minutes, chart churn by tenure, fit a risk model",
              explanation:
                "The data moves into a Jupyter notebook where Python does the heavy lifting: pandas cleans it, a plot explores it, scikit-learn models churn risk — the middle of the workflow, all in one interactive place.",
            },
            {
              code: "# Safety + Communicate\ngit_commit = 'save notebook to Git'; share = 'export a chart for the product team'",
              explanation:
                "The notebook is committed to Git so the analysis is reproducible and recoverable, and a clean chart is exported to communicate the finding. Five tools, each doing the one job it's best at.",
            },
          ],
          output: "SQL → Python/Jupyter → Git, mapping neatly onto Collect → Clean/Explore/Model → safety & Communicate.",
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
        filename: "match_tools.py",
        instructions:
          "Match each job to the right tool by filling in the blanks. Use exactly one of these strings for each: \"spreadsheet\", \"SQL\", \"Python\", \"Git\". Think about what each tool is best at, then run the code.",
        starterCode: `# Match each job to its best tool.
quick_chart_of_300_rows   = ___   # a fast, one-off look at tiny data
pull_rows_from_a_database = ___   # ask a database for specific rows
clean_and_model_the_data  = ___   # the main workhorse language
track_changes_and_undo    = ___   # version control / safety net

print(quick_chart_of_300_rows)
print(pull_rows_from_a_database)
print(clean_and_model_the_data)
print(track_changes_and_undo)`,
        solutionCode: `# Match each job to its best tool.
quick_chart_of_300_rows   = "spreadsheet"
pull_rows_from_a_database = "SQL"
clean_and_model_the_data  = "Python"
track_changes_and_undo    = "Git"

print(quick_chart_of_300_rows)
print(pull_rows_from_a_database)
print(clean_and_model_the_data)
print(track_changes_and_undo)`,
        expectedOutput: "spreadsheet\nSQL\nPython\nGit",
        hints: [
          "For a tiny, one-off chart, reach for the simplest tool you already know.",
          "Only one of these tools is a language for talking to databases.",
          "The 'main workhorse' for cleaning and modelling is the language this platform teaches.",
          "Tracking changes and undoing mistakes is the job of version control.",
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
          id: "fnd04_mcq_01",
          difficulty: "Easy",
          question: "What is SQL primarily used for?",
          options: [
            "Building machine learning models",
            "Getting specific data out of databases",
            "Tracking changes to your files",
            "Drawing polished charts for reports",
          ],
          correctIndex: 1,
          explanation:
            "SQL is the language for querying databases — asking for exactly the rows and columns you want. Modelling is Python's job, tracking changes is Git's, and polished charts usually come from Python or a BI tool.",
        },
        {
          type: "mcq",
          id: "fnd04_mcq_02",
          difficulty: "Easy",
          question:
            "Which tool is the main workhorse for cleaning, exploring, and modelling data?",
          options: ["Excel", "SQL", "Python", "Git"],
          correctIndex: 2,
          explanation:
            "Python, with libraries like pandas and scikit-learn, handles the middle and end of the workflow. Excel is for quick small looks, SQL fetches data, and Git provides version control — none is the general analysis workhorse.",
        },
        {
          type: "mcq",
          id: "fnd04_mcq_03",
          difficulty: "Medium",
          question:
            "What does a Jupyter notebook let you do that a plain script does not emphasise?",
          options: [
            "Run code in small cells and see each result immediately",
            "Store data inside a database",
            "Replace the need to learn Python",
            "Automatically fix errors in your code",
          ],
          correctIndex: 0,
          explanation:
            "A notebook's strength is the interactive, cell-by-cell write-run-see loop that suits exploration. It doesn't store data in a database, it runs Python rather than replacing it, and it certainly doesn't auto-fix code.",
        },
        {
          type: "scenario",
          id: "fnd04_sc_01",
          difficulty: "Medium",
          scenario:
            "You need to analyse 6 million transaction records that live in the company database, then build a model. A teammate suggests downloading everything into Excel first.",
          question: "What's the better approach?",
          options: [
            "Agree — Excel can handle any amount of data",
            "Use SQL to pull the relevant slice, then analyse and model it in Python",
            "Skip the database and guess the patterns",
            "Use Git to query the database directly",
          ],
          correctIndex: 1,
          explanation:
            "SQL extracts a targeted slice from the database efficiently, and Python handles the analysis and modelling. Excel can't cope with 6 million rows, guessing isn't analysis, and Git is version control, not a database query tool.",
        },
        {
          type: "scenario",
          id: "fnd04_sc_02",
          difficulty: "Hard",
          scenario:
            "A data scientist's laptop dies overnight, taking a week of analysis with it. A colleague across the world also needs to see exactly which version of the analysis produced last week's numbers.",
          question: "Which tool would have prevented both problems?",
          options: [
            "A bigger spreadsheet",
            "Git — snapshots are recoverable and every version's history is visible to the team",
            "SQL — it stores your analysis code",
            "Jupyter — notebooks can't be lost",
          ],
          correctIndex: 1,
          explanation:
            "Git (especially pushed to a service like GitHub) keeps recoverable snapshots and a full, shareable history, solving both the lost-work and which-version problems. A spreadsheet solves neither, SQL queries databases rather than versioning code, and notebooks are just files that can absolutely be lost without version control.",
        },
        {
          type: "mcq",
          id: "fnd04_mcq_04",
          difficulty: "Medium",
          question:
            "Which statement about Python and Jupyter is correct?",
          options: [
            "They are the same thing with two names",
            "Python is a programming language; Jupyter is an interactive workspace where you can write and run Python",
            "Jupyter is a language and Python is a website",
            "You must use Jupyter to run any Python code",
          ],
          correctIndex: 1,
          explanation:
            "Python is the language; Jupyter is one interactive place to run it. They're distinct — you can run Python without Jupyter, and Jupyter can host other languages too. The other options confuse the language with the workspace.",
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
            "What tools would you expect to use day-to-day as a data scientist, and what is each one for?",
          answer:
            "The core set is small. SQL for getting data out of databases — that's usually how a task starts. Python as the main workhorse for cleaning, exploring, and modelling, using libraries like pandas and scikit-learn. Jupyter notebooks as the interactive workspace where I write and run that Python step by step and see results immediately. Spreadsheets like Excel or Google Sheets for a quick look at small data or sharing a simple result with non-technical colleagues. And Git for version control, so my work is saved, reproducible, and shareable. Each maps onto the workflow: SQL for Collect, Python-in-Jupyter for Clean, Explore, and Model, and Git spanning everything as a safety net.",
        },
        {
          question:
            "When would you choose a spreadsheet over Python, and when would you make the switch?",
          answer:
            "I'd use a spreadsheet when the data is small — a few thousand rows — the task is one-off, and I need a fast answer or a simple chart to share with non-technical people. Its strengths are speed and familiarity. I'd switch to Python when any of three things appear: scale, because spreadsheets get slow and unstable past tens of thousands of rows; repeatability, because a task I'll rerun monthly should be code I can replay exactly rather than clicks I redo by hand; or complexity, like joining multiple sources, serious cleaning, or modelling. The tipping point is usually repeatability and error-risk — the moment a manual spreadsheet process becomes something people rely on, the lack of reproducibility and the ease of a silent copy-paste error make code the safer choice.",
        },
        {
          question:
            "Why does version control matter for data science specifically, when the analysis 'works' on your machine?",
          answer:
            "'Works on my machine' is exactly the problem version control solves. Analyses evolve through many iterations, and without Git you can't reliably answer which version of the code produced a given result — which is a serious issue when a number ends up in a business decision or a published figure. Git gives you recoverable snapshots, so a dead laptop or a bad edit doesn't erase a week of work, and a full history so a teammate can see who changed what and why, and reproduce last month's output precisely. On a team it also lets several people work on the same project without overwriting each other. The deeper point is reproducibility: good data science should be re-runnable by someone else and give the same answer, and version control is the foundation that makes that possible. It's less critical for a genuine one-off, but anything you'll revisit or share belongs in Git.",
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
        "1) Forcing a spreadsheet to do work it's outgrown — huge datasets or repeatable pipelines belong in code. 2) Confusing Python (the language) with Jupyter (one workspace for it). 3) Thinking SQL can model or plot data — its job is fetching from databases. 4) Skipping version control on anything you'll revisit or share, then losing work or forgetting which version produced a result.",
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
        "Try these prompts in the AI Tutor panel: • 'Give me a task and quiz me on which tool I'd use.' • 'ELI5: what is version control?' • 'Explain the difference between Python and Jupyter with an example.' • 'Show me a tiny SQL query and explain each part.' • 'Interview mode: ask me which tools I'd use for a real project and why.'",
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
        "Spreadsheet — a grid tool (Excel, Google Sheets) for quick looks at small data. SQL (Structured Query Language) — the language for getting data out of databases. Python — the main general-purpose language for data cleaning, analysis, and modelling. Library — a reusable bundle of code (e.g. pandas, scikit-learn) that adds capabilities to Python. Jupyter notebook — an interactive workspace that runs code in cells and shows results inline. Git — a version control system that snapshots your work. GitHub — a website for hosting and sharing Git projects.",
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
        "• Try it free: Google Colab (colab.research.google.com) — a hosted Jupyter notebook you can open in a browser with no setup. • Reference: the official pandas '10 minutes to pandas' guide, for when you reach the Python domain. • Overview: 'Git and GitHub for Beginners' introductory videos on YouTube. • Next in DSM: this completes the 'What Is Data Science?' module. Up next you'll move from knowing about data to working with it — reading and interpreting real datasets.",
    },

    /* ---------------------------------------------------------------- */
    /*  12 — Recap                                                       */
    /* ---------------------------------------------------------------- */
    {
      id: "recap",
      type: "recap",
      tocLabel: "Recap",
      content:
        "✓ The core toolkit is five tools: spreadsheet, SQL, Python, Jupyter, and Git.\n✓ Spreadsheets suit quick looks at small data; SQL gets data out of databases (Collect).\n✓ Python is the workhorse for cleaning, exploring, and modelling; Jupyter is where you run it interactively.\n✓ Python is a language and Jupyter is a workspace — related, but not the same thing.\n✓ Git is version control: it saves your work, lets you undo mistakes, and makes analysis reproducible.\n\nThat completes the 'What Is Data Science?' module. You now know what the field is, the kinds of data it uses, the workflow every project follows, and the tools that power it. Next module — Understanding Data — you'll stop reading about data and start reading data itself.",
    },
  ],
};
