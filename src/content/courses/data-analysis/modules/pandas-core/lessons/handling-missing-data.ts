import type { Lesson } from "@/lib/curriculum/types";

export const handlingMissingData: Lesson = {
  meta: {
    id: "data-analysis.pandas-core.handling-missing-data",
    slug: "handling-missing-data",
    title: "Handling Missing Data",
    description:
      "Detect NaNs with isna, understand why data goes missing, and choose deliberately between dropping and filling — the trade-off that shapes every downstream result.",
    estimatedTime: "35 mins",
    difficulty: "Intermediate",
    xpReward: 70,
    prerequisites: ["data-analysis.pandas-core.adding-modifying-columns"],
    masteryThreshold: 80,
  },

  blocks: [
    {
      id: "intro",
      type: "lesson-intro",
      tocLabel: "Introduction",
      intro: {
        hook: "Every real dataset has holes. A sensor drops out, a user skips a form field, a join finds no match — and suddenly a column is peppered with NaN. What you do about those holes silently decides your averages, your model, and your conclusions. This lesson is about making that decision on purpose, not by accident.",
        what: "Missing data is any absent value in a DataFrame, represented in pandas as NaN (Not a Number) for numeric data or NaT for dates. Handling it means detecting where it is, understanding why it's there, and choosing to drop it or fill it.",
        why: "Missing values break arithmetic, skew statistics, and crash many models. But the wrong fix is worse than the problem: dropping too much throws away signal, filling carelessly invents data. The choice is a judgement call with real consequences.",
        whereUsed:
          "Cleaning survey responses, reconciling merged tables, preparing model features, and computing trustworthy KPIs all begin with a missing-data decision.",
        objectives: [
          "Detect missing values with isna(), notna(), and isna().sum()",
          "Distinguish NaN from other 'empty' values like empty strings and zeros",
          "Drop missing data with dropna() and control it with how, thresh, and subset",
          "Fill missing data with fillna() using constants, statistics, and forward/backward fill",
          "Reason about when dropping is safe versus when filling is appropriate",
        ],
        realWorldApps: [
          {
            company: "Tesla",
            headline: "Sensor gap handling",
            detail:
              "Vehicle telemetry occasionally drops a reading. Engineers forward-fill short gaps in time-series signals so downstream models see a continuous stream, but flag long gaps for review rather than inventing data.",
          },
          {
            company: "Airbnb",
            headline: "Optional listing fields",
            detail:
              "Hosts leave fields like 'cleaning_fee' blank. Analysts fill these with 0 where blank genuinely means 'none', but treat a missing 'review_score' very differently — dropping or modelling it rather than assuming zero.",
          },
          {
            company: "NHS",
            headline: "Clinical trial completeness",
            detail:
              "Patient records with missing measurements are audited by missingness pattern before any imputation, because whether data is missing at random changes which statistical methods are valid.",
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
            "pandas marks a missing value as NaN, a special floating-point value. Because NaN is a float, any integer column with a missing value is promoted to float64. Missing dates appear as NaT. Detecting them is the first step.",
        },
        {
          type: "code-note",
          code: `import pandas as pd
import numpy as np
df = pd.DataFrame({'name': ['Amara','Jamal','Priya'],
                   'age':  [28, np.nan, 42]})

print(df.isna())            # boolean DataFrame: True where missing
print(df.isna().sum())      # count of missing per column`,
          content:
            "df.isna() returns a same-shape DataFrame of True/False. Chaining .sum() counts the True values per column — your standard one-line missingness audit. notna() is the inverse.",
        },
        {
          type: "warning",
          title: "NaN is not zero, and not an empty string",
          content:
            "A missing value is unknown, not zero. An empty string '' and a 0 are real values, not NaN — isna() returns False for both. Treating a genuine 0 as missing (or a NaN as 0) changes your results. Always confirm what 'empty' means in your source before deciding.",
        },
        {
          type: "keypoint",
          title: "NaN breaks equality and infects arithmetic",
          content:
            "NaN == NaN is False — that's why you use isna(), never == np.nan. And NaN propagates: 5 + NaN is NaN. But most pandas aggregations (mean, sum) skip NaN by default, so df['age'].mean() averages only the present values.",
        },
        {
          type: "text",
          content:
            "Dropping removes rows or columns containing NaN. dropna() drops any row with at least one NaN by default. how='all' drops only fully-empty rows; thresh=n keeps rows with at least n non-null values; subset limits the check to specific columns.",
        },
        {
          type: "code-note",
          code: `df.dropna()                       # drop rows with ANY NaN
df.dropna(subset=['age'])         # drop only where 'age' is missing
df.dropna(thresh=2)               # keep rows with >= 2 non-null values
df.dropna(axis=1)                 # drop COLUMNS that contain NaN`,
          content:
            "subset is the most surgical option — it drops rows only when the columns you actually care about are missing, sparing rows that are merely missing something irrelevant.",
        },
        {
          type: "text",
          content:
            "Filling replaces NaN with a value. fillna(0) uses a constant; fillna(df['age'].median()) imputes a statistic; method='ffill' carries the last valid value forward (ideal for ordered time series); 'bfill' carries the next value backward.",
        },
        {
          type: "analogy",
          title: "Drop vs fill is triage",
          content:
            "Think of an emergency room. Dropping a row is discharging a patient — fine if there are plenty of others and this one tells you nothing, costly if patients are scarce. Filling is treatment — a median fill is a safe generic remedy, a forward-fill assumes the condition hasn't changed since the last reading. You choose based on how much data you have and how much you trust the assumption.",
        },
        {
          type: "expandable",
          title: "MCAR, MAR, MNAR — why the reason matters",
          content:
            "Statisticians classify missingness three ways. MCAR (Missing Completely At Random): the gap is unrelated to anything — dropping is unbiased but wasteful. MAR (Missing At Random): missingness depends on other observed columns — you can impute from them. MNAR (Missing Not At Random): the missingness depends on the missing value itself, e.g. high earners skipping an income field — here both dropping and naive imputation bias your results, and you may need to model the missingness explicitly. You can't always tell which you have, but asking the question prevents the worst mistakes.",
        },
      ],
    },

    {
      id: "diagram",
      type: "interactive-diagram",
      tocLabel: "Visual Learning",
      visual: {
        kind: "decision-tree",
        title: "Should you drop or fill?",
        caption:
          "Click each node to walk the decision from detecting a gap to choosing a treatment.",
        nodes: [
          { id: "detect", label: "Detect", sublabel: "isna().sum()", detail: "Start by measuring: how many values are missing, in which columns, and what fraction of each column. The scale of the gap drives everything after.", x: 45, y: 8, accent: true },
          { id: "why", label: "Ask why", sublabel: "MCAR / MAR / MNAR", detail: "Understand the mechanism. Random gaps can be dropped or imputed safely; gaps that depend on the missing value itself bias any naive fix.", x: 45, y: 30, accent: true },
          { id: "small", label: "Few missing?", sublabel: "< ~5% of rows", detail: "If only a tiny fraction of rows are affected and they carry no special pattern, dropping them is simple and low-risk.", x: 18, y: 55, accent: false },
          { id: "drop", label: "dropna(subset=...)", sublabel: "remove rows", detail: "Drop rows missing the columns you actually need. Prefer subset over a blanket dropna so you don't discard rows for irrelevant gaps.", x: 18, y: 82, accent: false },
          { id: "many", label: "Many missing?", sublabel: "keep the rows", detail: "If dropping would lose too much data, keep the rows and fill instead — but pick the fill that matches the column's meaning.", x: 72, y: 55, accent: false },
          { id: "fill", label: "fillna(...)", sublabel: "impute", detail: "Constant (0 where blank means none), median/mean (numeric MAR), ffill/bfill (ordered time series), or a model-based estimate for important features.", x: 72, y: 82, accent: true },
        ],
        edges: [
          { from: "detect", to: "why" },
          { from: "why", to: "small", label: "few + random" },
          { from: "why", to: "many", label: "many or important" },
          { from: "small", to: "drop" },
          { from: "many", to: "fill" },
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
          title: "Count missing values per column",
          scenario: "You just loaded a customer table and want to know where the gaps are.",
          steps: [
            { code: "import pandas as pd, numpy as np\ndf = pd.DataFrame({'name':['A','B','C'], 'age':[30, np.nan, 25], 'city':['X', 'Y', np.nan]})", explanation: "Two columns have one missing value each." },
            { code: "print(df.isna().sum())", explanation: "isna() marks missing cells True; .sum() counts them per column." },
          ],
          output: "name    0\nage     1\ncity    1\ndtype: int64",
        },
        {
          difficulty: "Easy",
          title: "Drop rows missing a required field",
          scenario: "For a mailing, any customer without a city is unusable — but a missing age is fine.",
          steps: [
            { code: "df = pd.DataFrame({'name':['A','B','C'], 'age':[30, np.nan, 25], 'city':['X','Y', np.nan]})", explanation: "Row C has no city; row B has no age." },
            { code: "mailable = df.dropna(subset=['city'])", explanation: "subset=['city'] drops only rows missing a city. Row C goes; row B stays despite its missing age." },
            { code: "print(mailable['name'].tolist())", explanation: "A and B remain — both have a city." },
          ],
          output: "['A', 'B']",
        },
        {
          difficulty: "Medium",
          title: "Fill numeric gaps with the median",
          scenario: "Impute missing ages so an average calculation includes every customer.",
          steps: [
            { code: "df = pd.DataFrame({'age':[30, np.nan, 25, np.nan, 40]})", explanation: "Two of five ages are missing." },
            { code: "med = df['age'].median()", explanation: "The median of the present values (25, 30, 40) is 30. Median resists outliers better than the mean, which is why it's a common default." },
            { code: "df['age'] = df['age'].fillna(med)\nprint(df['age'].tolist())", explanation: "Both NaNs become 30. The column is now complete and safe to average." },
          ],
          output: "[30.0, 30.0, 25.0, 30.0, 40.0]",
        },
        {
          difficulty: "Hard",
          title: "Forward-fill a time series",
          scenario: "A daily price feed missed two days; carry the last known price forward so downstream calculations don't break.",
          steps: [
            { code: "df = pd.DataFrame({\n    'day': [1,2,3,4,5],\n    'price':[100.0, np.nan, np.nan, 108.0, 110.0]\n})", explanation: "Prices for days 2 and 3 are missing. The rows are in chronological order — a prerequisite for forward-fill to make sense." },
            { code: "df['price'] = df['price'].ffill()", explanation: "ffill() carries the last valid price (100 from day 1) forward across the gap, so days 2 and 3 both become 100 until the next real value on day 4." },
            { code: "print(df['price'].tolist())", explanation: "The gap is bridged with the last known value — appropriate when a value persists until it changes, like a price or a status." },
          ],
          output: "[100.0, 100.0, 100.0, 108.0, 110.0]",
        },
        {
          difficulty: "Industry Example",
          title: "A cleaning strategy for a churn dataset",
          scenario: "A data scientist at a telecom company prepares a customer table for modelling: 'total_charges' has a few blanks that are truly zero (brand-new accounts), 'tenure' has random gaps, and 'satisfaction_score' is missing for 40% of customers who never responded to a survey.",
          steps: [
            { code: "import pandas as pd, numpy as np\ndf = pd.DataFrame({\n    'total_charges':[np.nan, 350.0, 1200.0, np.nan],\n    'tenure':       [1, np.nan, 24, 5],\n    'satisfaction': [np.nan, 4.0, np.nan, np.nan],\n})", explanation: "Three columns, three different missingness stories — so three different treatments." },
            { code: "df['total_charges'] = df['total_charges'].fillna(0)", explanation: "Here a blank genuinely means a brand-new account with no charges yet, so 0 is the correct, meaningful fill — not an assumption." },
            { code: "df['tenure'] = df['tenure'].fillna(df['tenure'].median())", explanation: "Tenure gaps look random (MAR-ish), so a median impute keeps every row without heavily distorting the distribution." },
            { code: "df['satisfaction_missing'] = df['satisfaction'].isna().astype(int)\nprint(df[['total_charges','tenure','satisfaction_missing']].values.tolist())", explanation: "Satisfaction is missing for a reason — non-responders may differ systematically (MNAR). Rather than invent scores, we add a flag column marking who didn't respond, letting the model learn from the missingness itself." },
          ],
          output: "[[0.0, 5.0, 1], [350.0, 5.0, 0], [1200.0, 24.0, 1], [0.0, 5.0, 1]]",
        },
      ],
    },

    {
      id: "inline-practice",
      type: "inline-code",
      tocLabel: "Practice Coding",
      coding: {
        language: "python",
        filename: "missing_practice.py",
        instructions:
          "A survey dataset arrives with gaps. Audit it, then clean each column according to what its missingness means.",
        starterCode: `import pandas as pd
import numpy as np

df = pd.DataFrame({
    'respondent': ['R1','R2','R3','R4'],
    'age':        [34, np.nan, 28, np.nan],
    'spend':      [np.nan, 120.0, 0.0, 45.0],
})

# TODO 1: Count missing values per column (a Series)
missing_counts = ___

# TODO 2: Fill missing 'age' with the median age
df['age'] = ___

# TODO 3: Fill missing 'spend' with 0 (a blank here means no spend)
df['spend'] = ___

print(missing_counts['age'], missing_counts['spend'])
print(df['age'].tolist())
print(df['spend'].tolist())`,
        solutionCode: `import pandas as pd
import numpy as np

df = pd.DataFrame({
    'respondent': ['R1','R2','R3','R4'],
    'age':        [34, np.nan, 28, np.nan],
    'spend':      [np.nan, 120.0, 0.0, 45.0],
})

missing_counts = df.isna().sum()
df['age'] = df['age'].fillna(df['age'].median())
df['spend'] = df['spend'].fillna(0)

print(missing_counts['age'], missing_counts['spend'])
print(df['age'].tolist())
print(df['spend'].tolist())`,
        expectedOutput:
          "2 1\n[34.0, 31.0, 28.0, 31.0]\n[0.0, 120.0, 0.0, 45.0]",
        hints: [
          "Task 1: df.isna().sum() gives the per-column count of missing values.",
          "Task 2: fill with the column's median — df['age'].fillna(df['age'].median()). The median of 34 and 28 is 31.",
          "Task 3: a blank spend means zero, so df['spend'].fillna(0).",
          "missing_counts = df.isna().sum(); df['age'] = df['age'].fillna(df['age'].median()); df['spend'] = df['spend'].fillna(0)",
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
          id: "pda05_mcq_01",
          difficulty: "Easy",
          question: "Which expression counts missing values in each column?",
          options: ["df.count()", "df.isna().sum()", "df.dropna()", "df.fillna(0)"],
          correctIndex: 1,
          explanation:
            "df.isna() flags missing cells True and .sum() counts them per column. df.count() counts non-null values; dropna removes them; fillna replaces them.",
        },
        {
          type: "mcq",
          id: "pda05_mcq_02",
          difficulty: "Easy",
          question: "Why does `df['x'] == np.nan` fail to find missing values?",
          options: [
            "np.nan isn't imported",
            "NaN is not equal to anything, including itself — use isna()",
            "== only works on strings",
            "It works fine",
          ],
          correctIndex: 1,
          explanation:
            "By IEEE 754, NaN == NaN is False, so equality never matches missing values. isna() is the correct detector. The comparison is valid syntax but always returns False for NaN.",
        },
        {
          type: "mcq",
          id: "pda05_mcq_03",
          difficulty: "Medium",
          question: "What does `df.dropna(subset=['email'])` do?",
          options: [
            "Drops the 'email' column",
            "Drops rows only where 'email' is missing, ignoring gaps in other columns",
            "Drops every row with any missing value",
            "Fills missing emails",
          ],
          correctIndex: 1,
          explanation:
            "subset restricts the missing-value check to the listed column(s), so only rows lacking an email are removed. It doesn't drop the column, doesn't consider other columns, and doesn't fill anything.",
        },
        {
          type: "scenario",
          id: "pda05_sc_01",
          difficulty: "Medium",
          scenario:
            "An income column is missing for 30% of respondents. You notice the gaps are concentrated among the highest spenders, who tend to skip the income question. You're tempted to fill the gaps with the median income.",
          question: "What's the concern with a median fill here?",
          options: [
            "Median is never a valid fill",
            "The missingness likely depends on the missing value itself (MNAR), so median imputation will bias income downward for exactly the group that earns most",
            "You should always drop instead of fill",
            "Median only works for symmetric distributions",
          ],
          correctIndex: 1,
          explanation:
            "High earners skipping the question is a hallmark of MNAR — the missingness relates to the hidden value. A median fill pulls those true-high incomes toward the middle, biasing results. Better to flag the missingness, model it, or gather better data. Median can be a fine fill for genuinely random gaps.",
        },
        {
          type: "coding",
          id: "pda05_code_01",
          difficulty: "Hard",
          prompt:
            "Given the ordered daily readings below, forward-fill the missing values and print the mean of the filled column rounded to 1 decimal.\n\ndf = pd.DataFrame({'reading':[10.0, None, None, 16.0, 20.0]})",
          starterCode:
            "import pandas as pd\n\ndf = pd.DataFrame({'reading':[10.0, None, None, 16.0, 20.0]})\n\n# Your code here\n",
          solutionCode:
            "import pandas as pd\n\ndf = pd.DataFrame({'reading':[10.0, None, None, 16.0, 20.0]})\n\ndf['reading'] = df['reading'].ffill()\nprint(round(df['reading'].mean(), 1))",
          expectedOutput: "13.2",
          tests: [
            { name: "Forward fill", description: "Missing values become 10.0, 10.0 -> [10,10,10,16,20]" },
            { name: "Mean", description: "(10+10+10+16+20)/5 = 66/5 = 13.2" },
          ],
        },
        {
          type: "mcq",
          id: "pda05_mcq_04",
          difficulty: "Hard",
          question: "You have an int column [1, 2, 3]. You set the middle value to NaN. What is the column's dtype afterwards?",
          options: ["int64", "float64", "object", "It stays int64 with a special missing marker"],
          correctIndex: 1,
          explanation:
            "NaN is a float, and the classic int64 dtype can't hold it, so pandas promotes the whole column to float64. (The newer nullable Int64 dtype can hold missing ints, but the default int64 cannot.) It doesn't become object, and int64 has no built-in NaN.",
        },
      ],
    },

    {
      id: "interview-questions",
      type: "interview-questions",
      tocLabel: "Interview Prep",
      questions: [
        {
          question: "How do you detect missing values in a DataFrame, and why can't you just check for equality with NaN?",
          answer:
            "I use isna() — or its inverse notna() — usually as df.isna().sum() to get a per-column count of gaps, which is my first read on any new dataset. I can't check df['x'] == np.nan because NaN is defined to be unequal to everything, including itself, so that comparison always returns False. isna() is built to recognise the missing markers — NaN for numbers, NaT for datetimes, None for objects — regardless of that equality quirk. Once I know where and how much is missing, I can decide how to handle it.",
        },
        {
          question: "How do you decide between dropping and filling missing values?",
          answer:
            "It comes down to how much data the gap represents and why it's missing. If only a small fraction of rows are affected and the missingness looks random, dropping — ideally with subset so I only remove rows lacking a column I actually need — is simple and low-risk. If dropping would cost too much data, or the column is important, I fill: a constant like 0 when blank has a real meaning, a median or mean for roughly random numeric gaps, or forward/backward fill for ordered time series where a value persists until it changes. The reason matters as much as the amount — for data that's missing not at random, like high earners skipping an income field, both dropping and naive imputation bias the result, so I'd flag the missingness or model it instead. There's rarely a universally correct choice; I pick the option whose assumptions I can defend and I document it.",
        },
        {
          question: "Walk me through the MCAR, MAR, and MNAR distinction and how it changes your handling strategy.",
          answer:
            "These describe the mechanism behind missingness. MCAR — missing completely at random — means the gap is unrelated to any variable, observed or not; here dropping is unbiased, just wasteful, and simple imputation is fine. MAR — missing at random — means missingness depends on other observed columns but not the missing value itself; for example a device that fails to log at night, where the gap correlates with time. Because the dependence is on observed data, I can impute conditionally, using models or group-wise fills that borrow strength from the correlated columns. MNAR — missing not at random — means the missingness depends on the unobserved value, like sicker patients dropping out of a trial or high earners hiding income; here every naive method biases results, so I either add an explicit missingness indicator so a model can learn the pattern, use methods that model the missingness jointly, or go back for better data. In practice I can't always prove which regime I'm in, but reasoning about it stops me from applying a clean-looking median fill that quietly corrupts the analysis.",
        },
      ],
    },

    {
      id: "common-mistakes",
      type: "callout",
      variant: "warning",
      title: "Common Mistakes to Avoid",
      content:
        "1) Checking for missing with == np.nan — NaN never equals anything; use isna(). 2) Treating NaN, 0, and '' as the same thing — only NaN is missing; 0 and empty string are real values. 3) Calling a blanket dropna() and silently deleting most of your rows — prefer subset to target the columns that matter. 4) Filling with the mean when the column has outliers — the median is usually the safer numeric default. 5) Forward-filling unordered data — ffill only makes sense when rows are in a meaningful sequence like time. 6) Imputing MNAR gaps with a statistic and biasing exactly the group you care about — flag or model the missingness instead.",
    },

    {
      id: "ai-tutor",
      type: "callout",
      variant: "tip",
      title: "Ask the AI Tutor",
      content:
        "Try these prompts in the AI Tutor panel: • 'ELI5: what does NaN actually mean in a dataset?' • 'Show me when ffill is right and when it's dangerous.' • 'Quiz me on dropna options: how, thresh, subset.' • 'Explain MCAR vs MAR vs MNAR with a fresh example.' • 'Interview mode: ask me how I'd decide to drop or fill a 30%-missing column.'",
    },

    {
      id: "glossary",
      type: "callout",
      variant: "info",
      title: "Glossary",
      content:
        "NaN — Not a Number; pandas' marker for a missing numeric value. NaT — the missing marker for datetimes. isna() / notna() — detect missing / present values. dropna() — remove rows or columns containing NaN; controlled by how, thresh, subset, axis. fillna() — replace NaN with a constant or statistic. ffill / bfill — carry the last / next valid value across a gap. Imputation — filling missing values with estimated ones. MCAR / MAR / MNAR — the three missingness mechanisms that decide which fixes are valid. Missingness indicator — a flag column marking which rows were originally missing.",
    },

    {
      id: "resources",
      type: "callout",
      variant: "info",
      title: "Recommended Resources",
      content:
        "• Docs: 'Working with missing data' in the pandas User Guide — the authoritative reference for isna, dropna, fillna, and interpolation. • Read: a short primer on Rubin's MCAR/MAR/MNAR taxonomy to ground your imputation choices. • Practice: take a dataset, audit it with isna().sum(), then clean three columns three different ways — drop, median-fill, and a missingness flag — and compare how each changes the column mean. • Next in DSM: you can handle gaps within a table — next you'll order and rank data with Sorting & Ranking, surfacing the top and bottom of any column.",
    },

    {
      id: "recap",
      type: "recap",
      tocLabel: "Recap",
      content:
        "✓ pandas marks missing values as NaN (or NaT for dates); detect them with isna(), never == np.nan.\n✓ df.isna().sum() is your one-line missingness audit.\n✓ NaN is not zero and not an empty string — confirm what 'empty' means before acting.\n✓ dropna() removes gaps; use subset to target only the columns that matter.\n✓ fillna() imputes — constant, median/mean, or ffill/bfill for ordered series.\n✓ The reason data is missing (MCAR/MAR/MNAR) decides whether dropping or filling is safe.\n\nNext up: Sorting & Ranking. Your data is complete and trustworthy — next you'll order it, rank it, and pull the top and bottom performers out of any column.",
    },
  ],
};
