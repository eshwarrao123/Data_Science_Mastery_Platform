import type { Lesson } from "@/lib/curriculum/types";

export const pandasDataframes: Lesson = {
  meta: {
    id: "data-analysis.pandas-core.pandas-dataframes",
    slug: "pandas-dataframes",
    title: "Pandas DataFrames: Your Data's Home",
    description:
      "Master the pandas DataFrame — load, inspect, select, filter, and aggregate tabular data with the most important data structure in data science.",
    estimatedTime: "40 mins",
    difficulty: "Beginner",
    xpReward: 75,
    prerequisites: ["python.foundations.lists-vs-numpy-arrays"],
    masteryThreshold: 80,
  },

  blocks: [
    {
      id: "intro",
      type: "lesson-intro",
      tocLabel: "Introduction",
      intro: {
        hook: "If NumPy arrays are the engine, DataFrames are the car. Every data scientist lives in DataFrames. This is the single most important data structure you'll learn — let's make it completely intuitive.",
        what: "A pandas DataFrame is a 2-dimensional, labeled data structure — like a spreadsheet or SQL table, but programmable. It has rows (observations) and columns (features), and every column can have its own data type.",
        why: "Raw data arrives as CSVs, databases, or APIs. DataFrames give you a unified interface to load, inspect, clean, filter, aggregate, and analyze it — all in Python.",
        whereUsed:
          "DataFrames are used at every step of a data science project: loading raw data, EDA, feature engineering, model input preparation, and result presentation.",
        objectives: [
          "Create DataFrames from dictionaries and CSV files",
          "Inspect DataFrames with .head(), .info(), .describe()",
          "Select columns with [] and rows with .loc[] / .iloc[]",
          "Filter rows using boolean conditions",
          "Understand the relationship between DataFrame and Series",
        ],
        realWorldApps: [
          {
            company: "Airbnb",
            headline: "Price optimization analysis",
            detail:
              "Data scientists load millions of listing rows into DataFrames, filter by city and property type, and compute median prices per neighbourhood to train their dynamic pricing model.",
          },
          {
            company: "JPMorgan",
            headline: "Fraud detection pipeline",
            detail:
              "Transaction DataFrames are filtered for anomalies (unusual amount, new merchant, foreign IP) using boolean masks — all in pandas before the ML model sees the data.",
          },
          {
            company: "WHO",
            headline: "Epidemiological reporting",
            detail:
              "COVID-19 country-level data was cleaned and aggregated using pandas DataFrames by researchers worldwide to produce the charts you saw in the news.",
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
          type: "text",
          content:
            "Think of a DataFrame as an extremely powerful Excel spreadsheet. It has rows and columns. Columns have names. Rows have an index (by default 0, 1, 2…). Every column is a pandas Series.",
        },
        {
          type: "analogy",
          title: "DataFrame = a spreadsheet that can code",
          content:
            "Excel is powerful for interactive analysis but breaks for large datasets (row limits, no reproducibility, no version control). A DataFrame is the same idea — rows and columns of data — but it lives in code, handles millions of rows instantly, and every transformation you do is a reusable, auditable script.",
        },
        {
          type: "code-note",
          code: `import pandas as pd

# Create from a dictionary — keys become column names
data = {
    'name':   ['Alice', 'Bob', 'Carol', 'Dave'],
    'age':    [28, 34, 29, 42],
    'salary': [72000, 88000, 65000, 105000],
    'remote': [True, False, True, True]
}
df = pd.DataFrame(data)
print(df)`,
          content:
            "The dictionary keys become column headers. The lists become the column values. pandas automatically creates a default integer index (0, 1, 2, 3) as the row labels.",
        },
        {
          type: "keypoint",
          title: "Three inspection methods you'll use every day",
          content:
            "df.head(n) — show first n rows (default 5). df.info() — column names, non-null counts, dtypes, memory usage. df.describe() — count, mean, std, min, percentiles, max for every numeric column.",
        },
        {
          type: "text",
          content:
            "Selecting data is the core skill. Column selection uses square brackets with the column name as a string. Row selection uses .loc[] (label-based) or .iloc[] (integer position-based).",
        },
        {
          type: "code-note",
          code: `# Column selection
ages = df['age']          # Returns a Series
subset = df[['name', 'salary']]  # Returns a DataFrame (list of cols)

# Row selection by label
row0 = df.loc[0]          # Row with index label 0
alice = df.loc[0, 'name'] # Single cell: row 0, col 'name'

# Row selection by position
first_row = df.iloc[0]    # First row (position 0)
cell = df.iloc[0, 2]      # Row 0, column 2 (salary)`,
          content:
            "Single brackets + one string → Series. Double brackets + list → DataFrame. This distinction trips up beginners — remember: [[ ]] keeps the column structure intact.",
        },
        {
          type: "expandable",
          title: "What is a pandas Series?",
          content:
            "A Series is a 1D labeled array — essentially one column of a DataFrame. It has values (a NumPy array underneath) and an index (the row labels). When you do df['salary'], you get a Series. Most DataFrame operations work identically on Series. You can think of a DataFrame as a dictionary of Series sharing the same index.",
        },
        {
          type: "warning",
          title: "SettingWithCopyWarning — the #1 pandas gotcha",
          content:
            "If you do df2 = df[df['age'] > 30] and then df2['salary'] = 99, you'll get a warning. pandas can't tell if df2 is a copy or a view. Always use .copy() when you want an independent DataFrame: df2 = df[df['age'] > 30].copy()",
        },
      ],
    },

    {
      id: "diagram",
      type: "interactive-diagram",
      tocLabel: "Visual Learning",
      visual: {
        kind: "architecture",
        title: "Anatomy of a pandas DataFrame",
        caption:
          "Click any component to understand its role in the DataFrame structure.",
        nodes: [
          { id: "df", label: "DataFrame", sublabel: "df", detail: "The top-level container. Holds columns as Series, shares a single Index across all of them. Created with pd.DataFrame() or pd.read_csv().", x: 45, y: 8, accent: true },
          { id: "index", label: "Index", sublabel: "Row labels", detail: "By default 0, 1, 2… But can be dates, strings, or any hashable. Used by .loc[] to look up rows by label. Set with df.set_index('column_name').", x: 10, y: 35, accent: false },
          { id: "col_name", label: "Column names", sublabel: "df.columns", detail: "A pandas Index of column labels. Access with df.columns. Rename with df.rename(columns={'old': 'new'}).", x: 45, y: 35, accent: false },
          { id: "series", label: "Series (column)", sublabel: "df['col']", detail: "Each column is a pandas Series — a 1D labeled array backed by a NumPy array. Has its own .dtype, .mean(), .value_counts() etc.", x: 78, y: 35, accent: true },
          { id: "ndarray", label: "NumPy ndarray", sublabel: "series.values", detail: "The actual storage: a typed C array. Access with series.values or series.to_numpy(). This is where the speed comes from.", x: 78, y: 65, accent: false },
          { id: "dtypes", label: "dtypes", sublabel: "int64, float64, object", detail: "int64 — integers. float64 — floats. object — strings or mixed. bool — boolean. datetime64 — dates. category — memory-efficient labels.", x: 30, y: 65, accent: false },
          { id: "read_csv", label: "pd.read_csv()", sublabel: "CSV → DataFrame", detail: "The most common DataFrame entry point. Handles delimiters, encodings, date parsing, chunking, and dtype inference automatically.", x: 10, y: 88, accent: false },
          { id: "ops", label: "Operations", sublabel: "filter, group, merge", detail: "The power layer: boolean masking, .groupby(), .merge(), .pivot_table(), .apply(), .sort_values() — all return new DataFrames.", x: 68, y: 88, accent: true },
        ],
        edges: [
          { from: "df", to: "index" },
          { from: "df", to: "col_name" },
          { from: "df", to: "series" },
          { from: "series", to: "ndarray" },
          { from: "series", to: "dtypes" },
          { from: "read_csv", to: "df" },
          { from: "df", to: "ops" },
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
          title: "Load a CSV and inspect it",
          scenario: "You've just received a sales dataset. Before doing anything, inspect it.",
          steps: [
            { code: "import pandas as pd", explanation: "Import pandas with its universal alias 'pd'. This is the first line of virtually every data script." },
            { code: "df = pd.read_csv('sales.csv')", explanation: "pd.read_csv() reads the file and creates a DataFrame. pandas infers column names from the first row and dtypes from the values." },
            { code: "print(df.shape)", explanation: ".shape returns (rows, columns). If you see (50000, 12) you immediately know the scale of your dataset." },
            { code: "print(df.head())", explanation: ".head() shows the first 5 rows. This is always your first look at the data — is it what you expected?" },
            { code: "print(df.info())", explanation: ".info() is a one-shot audit: column names, non-null counts (missing values if count < total), and dtypes. Look for 'object' dtype on numeric columns — that signals the column loaded as strings and needs fixing." },
          ],
          output: "(1000, 5)\n   order_id   product  quantity  price  date\n0      1001   Widget A         3  29.99  2024-01-05\n1      1002   Widget B         1  49.99  2024-01-06\n...",
        },
        {
          difficulty: "Easy",
          title: "Select and filter rows",
          scenario: "From a customer DataFrame, get the names of all customers over 30.",
          steps: [
            { code: "import pandas as pd\ndata = {'name': ['Alice','Bob','Carol','Dave'], 'age': [28,34,29,42]}\ndf = pd.DataFrame(data)", explanation: "Quick DataFrame from a dictionary. Two columns: name (str) and age (int)." },
            { code: "mask = df['age'] > 30", explanation: "df['age'] returns a Series. Applying > 30 to it produces a boolean Series: [False, True, False, True]. This is the mask." },
            { code: "seniors = df[mask]", explanation: "Passing a boolean Series as an index filters rows. seniors now has 2 rows: Bob (34) and Dave (42)." },
            { code: "print(seniors['name'].tolist())", explanation: ".tolist() converts the Series to a plain Python list. Useful when you want to pass the names to another function." },
          ],
          output: "['Bob', 'Dave']",
        },
        {
          difficulty: "Medium",
          title: "GroupBy aggregation",
          scenario: "Calculate average salary by department.",
          steps: [
            { code: "import pandas as pd\ndf = pd.DataFrame({'dept': ['Eng','Eng','HR','HR','Eng'], 'salary': [90,95,60,65,85]})", explanation: "5 employees across two departments." },
            { code: "result = df.groupby('dept')['salary'].mean()", explanation: "groupby('dept') splits the DataFrame by unique department values. ['salary'] selects just that column. .mean() collapses each group to a single average. This is the split-apply-combine pattern." },
            { code: "print(result.round(1))", explanation: "result is a Series with 'dept' as the index and average salaries as values." },
          ],
          output: "dept\nEng    90.0\nHR     62.5\nName: salary, dtype: float64",
        },
        {
          difficulty: "Hard",
          title: "Multi-column filter with .loc[]",
          scenario: "Find all premium remote employees: salary > $80k AND remote == True.",
          steps: [
            { code: "import pandas as pd\ndata = {'name':['Alice','Bob','Carol','Dave','Eve'], 'salary':[72,88,65,105,92], 'remote':[True,False,True,True,True]}\ndf = pd.DataFrame(data)", explanation: "5 employees, salaries in thousands." },
            { code: "mask = (df['salary'] > 80) & (df['remote'] == True)", explanation: "Two boolean conditions combined with & (bitwise AND — not Python's 'and' keyword). IMPORTANT: each condition must be in parentheses, otherwise operator precedence causes a bug." },
            { code: "result = df.loc[mask, ['name', 'salary']]", explanation: ".loc[row_mask, column_list] is the most precise way to select: rows matching the mask, only the specified columns." },
            { code: "print(result.reset_index(drop=True))", explanation: ".reset_index(drop=True) gives clean 0-based index in the output (instead of the original 3, 4)." },
          ],
          output: "    name  salary\n0   Dave     105\n1    Eve      92",
        },
        {
          difficulty: "Industry Example",
          title: "Data analyst's first-look EDA script",
          scenario: "You've just joined a retail company. The analytics lead drops you a CSV of last year's transactions and says: 'Give me a quick summary by category before standup in 20 minutes.'",
          steps: [
            { code: "import pandas as pd\n\ndf = pd.read_csv('transactions_2024.csv', parse_dates=['date'])", explanation: "parse_dates=['date'] tells pandas to parse the date column as datetime64 instead of strings — enabling date arithmetic and .dt accessor later." },
            { code: "print(f'Shape: {df.shape}')\nprint(f'Date range: {df.date.min()} to {df.date.max()}')\nprint(f'Missing values:\\n{df.isnull().sum()}')", explanation: "Three lines of code give you shape, date coverage, and a per-column missing value count. This is the standard first 20 seconds of any new dataset." },
            { code: "summary = (df\n    .groupby('category')['revenue']\n    .agg(['sum','mean','count'])\n    .round(2)\n    .sort_values('sum', ascending=False)\n)", explanation: "Method chaining: group by category, aggregate revenue with three functions at once, round, sort by total revenue descending. This is production-grade pandas style." },
            { code: "summary.columns = ['Total Revenue', 'Avg Order', 'Transactions']\nprint(summary.head(10))", explanation: "Rename columns for readability before presenting to stakeholders. .head(10) shows top 10 categories." },
          ],
          output: "Shape: (48293, 8)\nDate range: 2024-01-01 to 2024-12-31\nMissing values:\n  category      0\n  revenue      12\n  ...\n\n               Total Revenue  Avg Order  Transactions\ncategory\nElectronics      2450123.45    142.33          17215\nClothing         1832456.78     48.91          37476\n...",
        },
      ],
    },

    {
      id: "inline-practice",
      type: "inline-code",
      tocLabel: "Practice Coding",
      coding: {
        language: "python",
        filename: "pandas_practice.py",
        instructions:
          "You've been given a DataFrame of student exam results. Complete the four analysis tasks below.",
        starterCode: `import pandas as pd

data = {
    'student': ['Alice', 'Bob', 'Carol', 'Dave', 'Eve', 'Frank'],
    'math':    [92, 78, 85, 60, 95, 72],
    'science': [88, 82, 79, 55, 91, 68],
    'english': [75, 90, 88, 70, 82, 65],
}
df = pd.DataFrame(data)

# TODO 1: Add a column 'average' = mean of math, science, english per student
df['average'] = ___

# TODO 2: Filter rows where average >= 80, store in high_achievers
high_achievers = ___

# TODO 3: Print the names of high_achievers as a list
print("High achievers:", ___)

# TODO 4: Print the subject with the highest class average
subject_avgs = df[['math', 'science', 'english']].mean()
best_subject = ___
print(f"Best subject: {best_subject}")`,
        solutionCode: `import pandas as pd

data = {
    'student': ['Alice', 'Bob', 'Carol', 'Dave', 'Eve', 'Frank'],
    'math':    [92, 78, 85, 60, 95, 72],
    'science': [88, 82, 79, 55, 91, 68],
    'english': [75, 90, 88, 70, 82, 65],
}
df = pd.DataFrame(data)

df['average'] = df[['math', 'science', 'english']].mean(axis=1)
high_achievers = df[df['average'] >= 80]
print("High achievers:", high_achievers['student'].tolist())
subject_avgs = df[['math', 'science', 'english']].mean()
best_subject = subject_avgs.idxmax()
print(f"Best subject: {best_subject}")`,
        expectedOutput:
          "High achievers: ['Alice', 'Carol', 'Eve']\nBest subject: math",
        hints: [
          "For the average column, select the three subject columns as a DataFrame and call .mean(axis=1). axis=1 means 'average across columns per row'.",
          "For high_achievers, use boolean filtering: df[df['average'] >= 80].",
          "To get names as a list: high_achievers['student'].tolist()",
          "subject_avgs.idxmax() returns the label (column name) of the maximum value in the Series.",
        ],
      },
    },

    {
      id: "exercises",
      type: "mastery-assessment",
      tocLabel: "Exercises",
      masteryThreshold: 80,
      exercises: [
        {
          type: "mcq",
          id: "da01_mcq_01",
          difficulty: "Easy",
          question: "What does `df[['name']]` (double brackets) return compared to `df['name']` (single bracket)?",
          options: [
            "Both return a Series",
            "Both return a DataFrame",
            "Double brackets return a DataFrame; single bracket returns a Series",
            "Single bracket returns a DataFrame; double brackets return a Series",
          ],
          correctIndex: 2,
          explanation: "Single bracket returns a Series (1D). Double brackets pass a list of column names, which always returns a DataFrame, even with just one column.",
        },
        {
          type: "mcq",
          id: "da01_mcq_02",
          difficulty: "Easy",
          question: "Which method gives you the count of missing values per column?",
          options: ["df.count()", "df.isnull().sum()", "df.info()", "df.describe()"],
          correctIndex: 1,
          explanation: "df.isnull() creates a boolean DataFrame (True where NaN). .sum() sums each column — True counts as 1, so you get missing counts per column.",
        },
        {
          type: "mcq",
          id: "da01_mcq_03",
          difficulty: "Medium",
          question: "What is the difference between `.loc[]` and `.iloc[]`?",
          options: [
            ".loc uses label-based indexing; .iloc uses integer position-based indexing",
            ".loc uses integer positions; .iloc uses column names",
            "They are identical",
            ".loc is faster than .iloc",
          ],
          correctIndex: 0,
          explanation: ".loc['Alice'] looks up by index label. .iloc[0] looks up by integer position. They differ when the index is not the default 0,1,2... range.",
        },
        {
          type: "scenario",
          id: "da01_sc_01",
          difficulty: "Medium",
          scenario: "You have a DataFrame with 500,000 rows. A colleague writes: `result = []` then loops `for i in range(len(df)): result.append(df.iloc[i]['price'] * 1.1)`. It takes 45 seconds.",
          question: "What is the pandas-idiomatic fix?",
          options: [
            "Use df.iterrows() instead of range(len(df))",
            "Use df['price'] * 1.1 — a single vectorized operation",
            "Convert to a NumPy array first, then loop",
            "Use df.apply(lambda row: row['price'] * 1.1, axis=1)",
          ],
          correctIndex: 1,
          explanation: "df['price'] * 1.1 is vectorized and runs in milliseconds. .iterrows() is still Python-level iteration — barely faster. .apply() is also slow. Always prefer vectorized column operations.",
        },
        {
          type: "coding",
          id: "da01_code_01",
          difficulty: "Hard",
          prompt: "Given the DataFrame below, find the department with the highest total bonus payout. Print just the department name.\n\ndf = pd.DataFrame({'dept':['Eng','HR','Eng','Sales','HR','Sales','Eng'], 'salary':[90,60,95,70,65,80,85], 'bonus_pct':[0.10,0.05,0.12,0.08,0.05,0.09,0.11]})\n\nHint: Calculate bonus = salary * bonus_pct, then groupby dept and sum.",
          starterCode: "import pandas as pd\n\ndf = pd.DataFrame({'dept':['Eng','HR','Eng','Sales','HR','Sales','Eng'], 'salary':[90,60,95,70,65,80,85], 'bonus_pct':[0.10,0.05,0.12,0.08,0.05,0.09,0.11]})\n\n# Your code here\n",
          solutionCode: "import pandas as pd\n\ndf = pd.DataFrame({'dept':['Eng','HR','Eng','Sales','HR','Sales','Eng'], 'salary':[90,60,95,70,65,80,85], 'bonus_pct':[0.10,0.05,0.12,0.08,0.05,0.09,0.11]})\n\ndf['bonus'] = df['salary'] * df['bonus_pct']\ntop_dept = df.groupby('dept')['bonus'].sum().idxmax()\nprint(top_dept)",
          expectedOutput: "Eng",
          tests: [
            { name: "Correct department", description: "Eng has total bonus: 9+11.4+9.35=29.75, highest of the three" },
          ],
        },
      ],
    },

    {
      id: "interview-questions",
      type: "interview-questions",
      tocLabel: "Interview Prep",
      questions: [
        {
          question: "What is the difference between merge() and join() in pandas?",
          answer: "Both combine DataFrames, but pd.merge() is more powerful and explicit — you specify the key columns and join type (inner, left, right, outer). df.join() is a convenience method that joins on the index by default and is less flexible. For most production code, prefer pd.merge() for clarity.",
        },
      ],
    },
  ],
};
