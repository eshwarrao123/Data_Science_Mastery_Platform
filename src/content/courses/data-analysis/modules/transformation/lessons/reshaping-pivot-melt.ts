import type { Lesson } from "@/lib/curriculum/types";

export const reshapingPivotMelt: Lesson = {
  meta: {
    id: "data-analysis.transformation.reshaping-pivot-melt",
    slug: "reshaping-pivot-melt",
    title: "Reshaping (pivot, melt, stack, unstack)",
    description:
      "Move between long data (one observation per row — what pandas loves) and wide data (a grid — what humans read): pivot_table to widen, melt to lengthen, stack/unstack for MultiIndex moves.",
    estimatedTime: "35 mins",
    difficulty: "Intermediate",
    xpReward: 80,
    prerequisites: ["data-analysis.transformation.groupby-and-aggregation"],
    masteryThreshold: 80,
  },

  blocks: [
    {
      id: "intro",
      type: "lesson-intro",
      tocLabel: "Introduction",
      intro: {
        hook: "Your groupby produced a perfect result — 40 rows of (region, month, revenue). Your manager wants 'regions down the side, months across the top'. Same numbers, different shape. Half of practical data work is exactly this: the data is right, the SHAPE is wrong. pivot and melt are the two verbs that fix it.",
        what: "Reshaping converts between long format (each row = one observation: entity, variable, value) and wide format (each row = one entity, each column = one variable). pivot and pivot_table go long→wide; melt goes wide→long; stack and unstack do the same moves between index levels and columns.",
        why: "Tools disagree about shape. groupby output, plotting libraries, and databases prefer long; humans, spreadsheets, and correlation matrices prefer wide. If you can't reshape fluently you either fight your tools or hand-build tables cell by cell — both slow, both error-prone.",
        whereUsed:
          "Building report cross-tabs from grouped data, preparing survey exports (one column per question) for analysis, turning sensor logs into per-sensor columns, and un-pivoting spreadsheet-shaped data that arrives wide.",
        objectives: [
          "Distinguish long and wide formats and say which a given tool wants",
          "Widen long data with pivot and pivot_table (and know when each applies)",
          "Lengthen wide data with melt, keeping id columns fixed",
          "Handle duplicate index/column pairs with pivot_table's aggfunc",
          "Use unstack to turn a grouped MultiIndex into a cross-tab",
        ],
        realWorldApps: [
          {
            company: "Gallup",
            headline: "Survey data wrangling",
            detail:
              "Survey platforms export one column per question (wide); statistical analysis wants one row per response (long). melt is the first line of nearly every survey-analysis script.",
          },
          {
            company: "Deloitte",
            headline: "Client-ready cross-tabs",
            detail:
              "Consultants turn transaction extracts into region-by-quarter revenue grids with pivot_table — the exact table shape that lands in the client deck.",
          },
          {
            company: "Fitbit",
            headline: "Sensor streams to daily summaries",
            detail:
              "Device telemetry arrives long (timestamp, metric, value); building a per-user day view — steps, heart rate, sleep as columns — is a pivot over the metric column.",
          },
        ],
      },
    },

    {
      id: "theory",
      type: "theory-blocks",
      tocLabel: "Theory",
      blocks: [
        {
          type: "keypoint",
          title: "Long vs wide",
          content:
            "Long format: one row per observation — (store, month, sales), 12 rows per store. Wide format: one row per entity, one column per variable — each store's 12 months spread across 12 columns. Long is easier to filter, group, and plot programmatically; wide is easier to read and compare side by side. Neither is 'correct' — they're the same information organised for different consumers.",
        },
        {
          type: "code-note",
          code: `# LONG -> WIDE
wide = df.pivot(index='store', columns='month', values='sales')
#         month: Jan  Feb  Mar
# store A         10   12   15
# store B          8    9   11`,
          content:
            "pivot takes three roles: which column becomes the row index, which column's values become the new column names, and which column fills the cells. It's a pure rearrangement — every cell in the output is one cell from the input.",
        },
        {
          type: "warning",
          title: "pivot breaks on duplicates — pivot_table aggregates them",
          content:
            "pivot demands exactly one row per (index, columns) pair; a duplicate raises ValueError. Real data has duplicates — three sales for the same store in the same month. pivot_table handles them by aggregating: aggfunc='sum' (or 'mean', default) collapses the duplicates. Rule of thumb: pivot for pure reshaping of already-unique data, pivot_table when any aggregation may be involved — it's groupby and reshape in one step.",
        },
        {
          type: "code-note",
          code: `wide = df.pivot_table(
    index='region', columns='product', values='revenue',
    aggfunc='sum', fill_value=0, margins=True,
)`,
          content:
            "pivot_table's extras: fill_value replaces the NaN that appears when a combination never occurred (South sold no TVs), and margins=True adds an 'All' row/column of totals — the spreadsheet pivot-table experience.",
        },
        {
          type: "code-note",
          code: `# WIDE -> LONG
long = df.melt(
    id_vars=['store'],                # columns that stay as identifiers
    value_vars=['Jan','Feb','Mar'],   # columns to unpivot
    var_name='month', value_name='sales',
)
# store  month  sales     <- one row per (store, month)`,
          content:
            "melt is pivot's inverse: the listed value columns collapse into two — one holding the old column NAMES, one holding the VALUES. id_vars repeat on every melted row so each observation stays self-describing.",
        },
        {
          type: "text",
          content:
            "stack and unstack are the same two moves expressed on the index: unstack rotates an index level up into columns; stack rotates columns down into an index level. Their killer app: a two-key groupby produces a MultiIndex Series, and .unstack() turns it straight into a cross-tab — the groupby-then-unstack idiom is often the fastest route to a report table.",
        },
        {
          type: "code-note",
          code: `df.groupby(['region','product'])['revenue'].sum().unstack(fill_value=0)
# product   Phone   TV      <- inner key level became columns
# region
# North        30   90
# South        70   20`,
          content:
            "groupby → unstack ≈ pivot_table. Both paths produce the same grid; use whichever reads more clearly in context. unstack moves the INNERMOST level by default; pass a level name to move a different one.",
        },
        {
          type: "analogy",
          title: "The same ledger, two bindings",
          content:
            "An accountant's ledger can be bound chronologically — every transaction on its own line, easy to append and audit (long) — or rebound as a summary book with one page per client and columns per month, easy to read in a meeting (wide). Rebinding changes no numbers; it changes what's easy. pivot and melt are the rebinding machines, and knowing which binding each task wants is the actual skill.",
        },
        {
          type: "expandable",
          title: "Why analysis pipelines prefer long ('tidy') data",
          content:
            "The tidy-data convention — each variable a column, each observation a row — is long format with discipline, and most of the pandas API is shaped for it. Filtering (df[df.month=='Jan']), grouping, and merging all get simpler because 'month' is DATA in a column, not METADATA in column names. Wide data hard-codes values into the schema: a new month means a new COLUMN (schema change), while long data just gains rows. The practical workflow: keep data long through the pipeline, widen at the very last step for human eyes. When wide data arrives from the world (spreadsheets, survey tools), melt it first and thank yourself later.",
        },
      ],
    },

    {
      id: "diagram",
      type: "interactive-diagram",
      tocLabel: "Visual Learning",
      visual: {
        kind: "comparison",
        title: "The reshaping verbs",
        caption: "Click each operation — two directions, two levels (columns vs index).",
        nodes: [
          { id: "long", label: "LONG data", sublabel: "one row = one observation", detail: "(store, month, sales) rows. What groupby emits, what plotting libraries and databases want, what filters and merges handle cleanly.", x: 15, y: 30, accent: true },
          { id: "wide", label: "WIDE data", sublabel: "one row = one entity", detail: "Stores down the side, months across the top. What humans compare at a glance, what correlation matrices and spreadsheet users expect.", x: 85, y: 30, accent: true },
          { id: "pivot", label: "pivot / pivot_table", sublabel: "long → wide", detail: "index=, columns=, values= assign the three roles. pivot is pure reshape (errors on duplicates); pivot_table aggregates duplicates with aggfunc and offers fill_value and margins.", x: 50, y: 12, accent: false },
          { id: "melt", label: "melt", sublabel: "wide → long", detail: "id_vars stay as identifier columns; value_vars collapse into var_name/value_name pairs. The un-pivot for spreadsheet-shaped arrivals.", x: 50, y: 48, accent: false },
          { id: "unstack", label: "unstack", sublabel: "index level → columns", detail: "Rotates a MultiIndex level up into columns. groupby(two keys).sum().unstack() is the fastest cross-tab idiom in pandas.", x: 30, y: 75, accent: false },
          { id: "stack", label: "stack", sublabel: "columns → index level", detail: "The inverse rotation: column labels fold down into an index level, taking the table back toward long form.", x: 70, y: 75, accent: false },
        ],
        edges: [
          { from: "long", to: "pivot", label: "widen" },
          { from: "pivot", to: "wide" },
          { from: "wide", to: "melt", label: "lengthen" },
          { from: "melt", to: "long" },
          { from: "unstack", to: "stack", label: "inverse pair" },
        ],
      },
    },

    {
      id: "worked-examples",
      type: "worked-examples",
      tocLabel: "Worked Examples",
      examples: [
        {
          difficulty: "Very Easy",
          title: "pivot: long to wide",
          scenario: "Turn (store, month, sales) rows into a store-by-month grid.",
          steps: [
            { code: "import pandas as pd\nlong = pd.DataFrame({\n    'store': ['A','A','B','B'],\n    'month': ['Jan','Feb','Jan','Feb'],\n    'sales': [10, 12, 8, 9],\n})", explanation: "Long format: four observations, one per row. Every (store, month) pair appears exactly once — pivot's requirement." },
            { code: "wide = long.pivot(index='store', columns='month', values='sales')", explanation: "Three roles assigned: stores become the index, month values become column names, sales fill the cells." },
            { code: "print(wide[['Jan','Feb']].to_string())", explanation: "The grid a human wants: each store one row, each month one column. Same four numbers, new shape." },
          ],
          output: "month  Jan  Feb\nstore          \nA       10   12\nB        8    9",
        },
        {
          difficulty: "Easy",
          title: "melt: wide to long",
          scenario: "A spreadsheet arrives with one column per quarter — un-pivot it for analysis.",
          steps: [
            { code: "wide = pd.DataFrame({\n    'product': ['TV','Phone'],\n    'Q1': [100, 200],\n    'Q2': [110, 190],\n})", explanation: "Wide arrival: quarter names are stuck in the schema as column headers instead of living in the data." },
            { code: "long = wide.melt(id_vars=['product'], var_name='quarter', value_name='units')", explanation: "product repeats as the identifier; Q1/Q2 headers become values in a 'quarter' column; the cells become 'units'." },
            { code: "print(long.to_string(index=False))", explanation: "Four tidy observations. Now 'quarter' is filterable, groupable data — df[long.quarter=='Q1'] works, which no column-header ever could." },
          ],
          output: "product quarter  units\n     TV      Q1    100\n  Phone      Q1    200\n     TV      Q2    110\n  Phone      Q2    190",
        },
        {
          difficulty: "Medium",
          title: "pivot_table when duplicates exist",
          scenario: "Multiple sales per (region, product) — pivot would raise; pivot_table aggregates.",
          steps: [
            { code: "df = pd.DataFrame({\n    'region':  ['N','N','N','S','S'],\n    'product': ['TV','TV','Phone','TV','Phone'],\n    'revenue': [50, 40, 30, 20, 70],\n})", explanation: "N-TV appears twice (50 and 40). df.pivot(...) on these keys raises ValueError: duplicate entries." },
            { code: "grid = df.pivot_table(index='region', columns='product',\n                      values='revenue', aggfunc='sum', fill_value=0)", explanation: "pivot_table groups the duplicates and sums them: N-TV becomes 90. fill_value=0 covers combinations that never occurred." },
            { code: "print(grid.to_string())", explanation: "A complete cross-tab: the two N-TV sales merged into 90, and every cell filled. This is groupby + reshape in a single call." },
          ],
          output: "product  Phone  TV\nregion            \nN           30  90\nS           70  20",
        },
        {
          difficulty: "Hard",
          title: "groupby → unstack: the cross-tab idiom",
          scenario: "Build the same grid from an existing two-key groupby, and see the equivalence.",
          steps: [
            { code: "df = pd.DataFrame({\n    'region':  ['N','N','N','S','S'],\n    'product': ['TV','TV','Phone','TV','Phone'],\n    'revenue': [50, 40, 30, 20, 70],\n})\ngrouped = df.groupby(['region','product'])['revenue'].sum()", explanation: "The familiar groupby result: a Series with a (region, product) MultiIndex — correct numbers, long skinny shape." },
            { code: "grid = grouped.unstack(fill_value=0)", explanation: "unstack rotates the INNER level (product) up into columns. The MultiIndex Series becomes a region-by-product DataFrame — no re-aggregation, pure rotation." },
            { code: "print(grid.to_string())\nprint(grid.stack().equals(grouped.sort_index()))", explanation: "Identical to the pivot_table result — and stack() rotates it straight back, confirming the two are inverse moves around the same data." },
          ],
          output: "product  Phone  TV\nregion            \nN           30  90\nS           70  20\nTrue",
        },
        {
          difficulty: "Industry Example",
          title: "From transaction log to management report",
          scenario: "A retail analyst turns the raw sales log into the month-by-region revenue grid (with totals) that goes in the monthly deck.",
          steps: [
            { code: "import pandas as pd\ndf = pd.DataFrame({\n    'month':  ['Jan','Jan','Jan','Feb','Feb','Feb'],\n    'region': ['East','West','East','East','West','West'],\n    'revenue':[120, 90, 60, 150, 90, 30],\n})", explanation: "Six raw transactions. The deck wants months as rows, regions as columns, plus an All row/column of totals." },
            { code: "report = df.pivot_table(index='month', columns='region',\n                        values='revenue', aggfunc='sum', margins=True,\n                        margins_name='Total')", explanation: "aggfunc='sum' collapses the duplicate (month, region) pairs; margins adds the totals under the name 'Total' — the full spreadsheet-pivot experience in one call." },
            { code: "print(report.loc[['Jan','Feb','Total']].to_string())", explanation: "East grew 180→150? No — read it: Jan East is 180 (120+60), Feb East 150. The Total column confirms 270+120 = 390 overall. One reproducible line replaces manual spreadsheet work every month." },
          ],
          output: "region  East  West  Total\nmonth                    \nJan      180    90    270\nFeb      150   120    270\nTotal    330   210    540",
        },
      ],
    },

    {
      id: "inline-practice",
      type: "inline-code",
      tocLabel: "Practice Coding",
      coding: {
        language: "python",
        filename: "reshape_practice.py",
        instructions:
          "A support team logs tickets long-form. Build a weekday-by-priority count grid with pivot_table, then melt a wide budget table back to long form.",
        starterCode: `import pandas as pd

tickets = pd.DataFrame({
    'day':      ['Mon','Mon','Tue','Tue','Mon'],
    'priority': ['high','low','high','high','low'],
})

budget = pd.DataFrame({
    'team': ['Sales','Eng'],
    '2025': [100, 300],
    '2026': [120, 340],
})

# TODO 1: Grid of ticket counts: index=day, columns=priority,
#         use aggfunc='size' and fill_value=0
grid = ___

# TODO 2: Melt budget: keep team, year columns -> 'year'/'amount'
long_budget = ___

print(grid.to_string())
print(long_budget.sort_values(['team','year']).to_string(index=False))`,
        solutionCode: `import pandas as pd

tickets = pd.DataFrame({
    'day':      ['Mon','Mon','Tue','Tue','Mon'],
    'priority': ['high','low','high','high','low'],
})

budget = pd.DataFrame({
    'team': ['Sales','Eng'],
    '2025': [100, 300],
    '2026': [120, 340],
})

grid = tickets.pivot_table(index='day', columns='priority',
                           aggfunc='size', fill_value=0)

long_budget = budget.melt(id_vars=['team'], var_name='year',
                          value_name='amount')

print(grid.to_string())
print(long_budget.sort_values(['team','year']).to_string(index=False))`,
        expectedOutput: "priority  high  low\nday                \nMon          1    2\nTue          2    0\n team year  amount\n  Eng 2025     300\n  Eng 2026     340\nSales 2025     100\nSales 2026     120",
        hints: [
          "Task 1: with aggfunc='size' you don't need a values= argument — it counts rows per (day, priority) cell.",
          "fill_value=0 turns the Tue-low NaN (no such tickets) into 0.",
          "Task 2: budget.melt(id_vars=['team'], var_name='year', value_name='amount') — the year column HEADERS become values.",
          "grid = tickets.pivot_table(index='day', columns='priority', aggfunc='size', fill_value=0)",
        ],
      },
    },

    {
      id: "exercises",
      type: "mastery-assessment",
      tocLabel: "Quiz & Exercises",
      masteryThreshold: 80,
      exercises: [
        {
          type: "mcq",
          id: "pda14_mcq_01",
          difficulty: "Easy",
          question: "In df.pivot(index='store', columns='month', values='sales'), what does the 'month' column's data become?",
          options: [
            "The row index of the result",
            "The column NAMES of the result",
            "The cell values of the result",
            "It is dropped",
          ],
          correctIndex: 1,
          explanation:
            "columns= promotes that column's VALUES into the output's column headers — data becomes schema. index= sets the rows and values= fills the cells.",
        },
        {
          type: "mcq",
          id: "pda14_mcq_02",
          difficulty: "Easy",
          question: "What does melt's id_vars parameter specify?",
          options: [
            "The columns to collapse into name/value pairs",
            "The columns that stay fixed and repeat on every output row as identifiers",
            "The name of the new value column",
            "The rows to keep",
          ],
          correctIndex: 1,
          explanation:
            "id_vars are the identifier columns preserved as-is (repeating per melted row); value_vars are the ones collapsed into var_name/value_name pairs.",
        },
        {
          type: "mcq",
          id: "pda14_mcq_03",
          difficulty: "Medium",
          question: "df.pivot(...) raises 'Index contains duplicate entries, cannot reshape'. The standard fix?",
          options: [
            "Sort the DataFrame first",
            "Use pivot_table with an aggfunc to aggregate the duplicate (index, columns) pairs",
            "Drop the index column",
            "Convert values to strings",
          ],
          correctIndex: 1,
          explanation:
            "pivot requires one row per (index, columns) pair; real data often has several. pivot_table resolves them by aggregating (sum, mean, size…) — it's groupby + reshape in one call. Sorting changes nothing about uniqueness.",
        },
        {
          type: "scenario",
          id: "pda14_sc_01",
          difficulty: "Medium",
          scenario:
            "A survey platform exports one row per respondent with 40 columns Q1…Q40. An analyst needs to compute, per question, the mean answer and the response count — and there may be new questions next quarter.",
          question: "What's the right first move?",
          options: [
            "Loop over the 40 columns computing stats one by one",
            "melt the Q-columns into (respondent, question, answer) long form, then groupby('question')",
            "pivot the data wider",
            "Rename the columns to numbers",
          ],
          correctIndex: 1,
          explanation:
            "Melting turns question IDs from schema into data; one groupby('question').agg() then covers all 40 — and 45 next quarter with zero code changes. The loop hard-codes the schema; pivoting wider goes the wrong direction.",
        },
        {
          type: "coding",
          id: "pda14_code_01",
          difficulty: "Hard",
          prompt:
            "Using groupby and unstack, build a city-by-category count grid (fill missing cells with 0) and print it.\n\ndf = pd.DataFrame({'city':['Pune','Pune','Delhi','Delhi','Pune'], 'category':['food','cab','food','food','cab']})",
          starterCode:
            "import pandas as pd\n\ndf = pd.DataFrame({'city':['Pune','Pune','Delhi','Delhi','Pune'], 'category':['food','cab','food','food','cab']})\n\n# Your code here\n",
          solutionCode:
            "import pandas as pd\n\ndf = pd.DataFrame({'city':['Pune','Pune','Delhi','Delhi','Pune'], 'category':['food','cab','food','food','cab']})\n\ngrid = df.groupby(['city','category']).size().unstack(fill_value=0)\nprint(grid.to_string())",
          expectedOutput: "category  cab  food\ncity               \nDelhi       0     2\nPune        2     1",
          tests: [
            { name: "Grouped counts", description: "groupby two keys + size() counts each (city, category) pair" },
            { name: "Rotation", description: "unstack(fill_value=0) lifts category into columns and fills Delhi-cab (never occurred) with 0" },
          ],
        },
        {
          type: "mcq",
          id: "pda14_mcq_04",
          difficulty: "Hard",
          question: "Why do analysis pipelines generally keep data LONG until the final presentation step?",
          options: [
            "Long data uses less memory in all cases",
            "Filtering, grouping, and merging treat values-in-columns (long) uniformly, while wide data hard-codes values into the schema — a new category means a schema change",
            "Wide data cannot be plotted",
            "pandas cannot compute on wide data",
          ],
          correctIndex: 1,
          explanation:
            "In long form 'month' is data you can filter and group on; in wide form each month is a separate column, so new months change the schema and every operation needs per-column handling. Widening is cheap to do once at the end for human eyes.",
        },
      ],
    },

    {
      id: "interview-questions",
      type: "interview-questions",
      tocLabel: "Interview Prep",
      questions: [
        {
          question: "Explain long vs wide data and when you'd use each.",
          answer:
            "Long format has one row per observation — (store, month, sales) — with variables as data in columns. Wide format has one row per entity with one column per variable — each store's months spread across columns. They hold identical information; they differ in what's easy. Long wins for machine consumption: filters (month == 'Jan'), groupbys, merges, and most plotting libraries treat it uniformly, and a new month is just new rows, not a schema change. Wide wins for human consumption: side-by-side comparison, correlation matrices, and anything headed for a slide or spreadsheet. My working rule is 'long through the pipeline, wide at the border': keep data tidy while transforming, pivot to wide as the final presentation step, and melt anything that arrives wide from spreadsheets or survey tools before analysing it.",
        },
        {
          question: "pivot vs pivot_table — when does each apply and why?",
          answer:
            "pivot is a pure rearrangement: every output cell is exactly one input cell, so it requires each (index, columns) pair to appear at most once and raises on duplicates. That strictness is valuable when I believe the data is already one-row-per-pair — a failure tells me my assumption was wrong, which is a data-quality signal, not a nuisance. pivot_table tolerates duplicates by aggregating them with aggfunc — sum, mean, size — making it groupby plus reshape in one call, with conveniences like fill_value for never-occurred combinations and margins for total rows. So: pivot when reshaping unique data and wanting duplicates to error loudly; pivot_table when aggregation is part of the intent. The equivalent idiom groupby(keys).agg().unstack() produces the same grids — I use whichever reads better, but in review I check the same two things: what happened to duplicates, and what filled the missing combinations.",
        },
        {
          question: "A stakeholder's spreadsheet has years as columns and wants analysis by year. Walk me through your handling.",
          answer:
            "That's wide data where the year — a variable — is trapped in the column headers, so my first move is melt: id_vars for the entity columns, the year columns as value_vars, producing (entity, year, amount) long form. I'd immediately fix the type wrinkle melt creates: the year column holds strings like '2025' because they were headers, so to_numeric before any sorting or filtering — otherwise '2026' > '2025' works but '9' > '10' style bugs lurk if formats vary. From long form, every request becomes routine: growth by year is a groupby, filtering to a range is a mask, and joining to other tables works on the year key. When results go back to the stakeholder, I pivot_table back to years-as-columns, because that's the shape they read. The round trip — melt, analyse long, pivot for presentation — is the standard pattern for spreadsheet-origin data, and it means the analysis code survives next year's new column without edits.",
        },
      ],
    },

    {
      id: "common-mistakes",
      type: "callout",
      variant: "warning",
      title: "Common Mistakes to Avoid",
      content:
        "1) Using pivot on data with duplicate (index, columns) pairs — it raises; decide the aggregation and use pivot_table. 2) Forgetting pivot_table's DEFAULT aggfunc is 'mean' — summing was your intent? Say aggfunc='sum'. 3) Ignoring the NaNs that appear for never-occurred combinations — fill_value=0 when zero is the true meaning, but only then. 4) Melting without id_vars and losing track of which row is which entity. 5) Not converting melted headers to proper types — years arrive as strings. 6) Hand-building cross-tabs with loops when groupby+unstack or pivot_table is one line. 7) Keeping data wide through a whole pipeline and paying for it in every subsequent filter and merge.",
    },

    {
      id: "ai-tutor",
      type: "callout",
      variant: "tip",
      title: "Ask the AI Tutor",
      content:
        "Try these prompts in the AI Tutor panel: • 'ELI5: long vs wide with the ledger-binding analogy.' • 'Show me the same cross-tab three ways: pivot_table, groupby+unstack, and crosstab.' • 'Quiz me: pivot or pivot_table for each scenario you invent.' • 'Melt this 30-question survey export and compute per-question stats.' • 'Interview mode: challenge me on why pipelines stay long until presentation.'",
    },

    {
      id: "glossary",
      type: "callout",
      variant: "info",
      title: "Glossary",
      content:
        "Long format — one row per observation; variables live in columns as data. Wide format — one row per entity; one column per variable. pivot — pure long→wide rearrangement; errors on duplicates. pivot_table — long→wide with aggregation (aggfunc), fill_value, margins. melt — wide→long; id_vars stay, value_vars collapse to var_name/value_name. stack — rotate columns down into an index level. unstack — rotate an index level up into columns (innermost by default). Cross-tab — a two-dimensional count/aggregate grid. Tidy data — the long-format discipline: each variable a column, each observation a row.",
    },

    {
      id: "resources",
      type: "callout",
      variant: "info",
      title: "Recommended Resources",
      content:
        "• Docs: pandas user guide 'Reshaping and pivot tables' — pivot, melt, stack/unstack, and crosstab in one page. • Read: Hadley Wickham's 'Tidy Data' paper — the why behind keeping pipelines long. • Practice: find any wide spreadsheet (years or months as columns), melt it, compute a per-period metric, and pivot back for presentation — the full round trip. • Next in DSM: reshaping rearranges one table; Merging & Joining combines several — the relational step.",
    },

    {
      id: "recap",
      type: "recap",
      tocLabel: "Recap",
      content:
        "✓ Long = one row per observation (machine-friendly); wide = one row per entity (human-friendly); same data, different shape.\n✓ pivot assigns index/columns/values roles and errors on duplicates; pivot_table aggregates them (default aggfunc is MEAN).\n✓ fill_value handles never-occurred combinations; margins adds total rows/columns.\n✓ melt is the inverse: id_vars stay put, value_vars collapse into var_name/value_name pairs.\n✓ groupby + unstack turns a two-key aggregation into a cross-tab — the everyday report idiom.\n✓ Keep pipelines long; widen at the last step for human eyes.\n\nNext up: Merging & Joining DataFrames. You can reshape one table — next you'll combine several, matching rows across tables by key like SQL joins.",
    },
  ],
};
