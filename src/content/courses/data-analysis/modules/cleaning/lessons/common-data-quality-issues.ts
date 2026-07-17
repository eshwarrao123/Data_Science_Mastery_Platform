import type { Lesson } from "@/lib/curriculum/types";

export const commonDataQualityIssues: Lesson = {
  meta: {
    id: "data-analysis.cleaning.common-data-quality-issues",
    slug: "common-data-quality-issues",
    title: "Common Data Quality Issues",
    description:
      "Learn the taxonomy of data quality problems — missingness, duplicates, bad types, inconsistent categories, outliers, structural errors — and a repeatable audit workflow to catch them before they wreck an analysis.",
    estimatedTime: "30 mins",
    difficulty: "Intermediate",
    xpReward: 70,
    prerequisites: ["data-analysis.pandas-core.handling-missing-data"],
    masteryThreshold: 80,
  },

  blocks: [
    {
      id: "intro",
      type: "lesson-intro",
      tocLabel: "Introduction",
      intro: {
        hook: "The most expensive bugs in data science aren't in the model — they're in the data that fed it. A duplicated order, a price stored as text, a category spelled three ways: none of these throw an error, they just quietly poison your results. This lesson gives you a checklist so the mess never makes it downstream.",
        what: "Data quality issues are the ways real-world data deviates from what your analysis assumes: missing values, duplicates, wrong types, inconsistent categories, invalid values, structural problems, and outliers. An audit is the systematic first pass that finds them.",
        why: "Every conclusion rests on the data being what you think it is. Garbage in, garbage out isn't a cliché — it's the single biggest source of wrong analyses. Catching issues early is cheaper than debugging a broken dashboard three weeks later.",
        whereUsed:
          "The first thing any analyst does with a new dataset is audit it. It's the gate between 'received data' and 'trusted data' in every pipeline, report, and model.",
        objectives: [
          "Name the major categories of data quality issues",
          "Run a first-pass audit with shape, info, describe, isna, nunique, and duplicated",
          "Distinguish structural issues from value issues",
          "Spot inconsistent categories and invalid values with value_counts",
          "Produce a prioritised data quality report before cleaning",
        ],
        realWorldApps: [
          {
            company: "Uber",
            headline: "Trip data validation",
            detail:
              "Before any pricing analysis, engineers audit trip logs for impossible values — negative fares, zero-distance paid trips, timestamps out of order — because a single class of bad rows can skew a city's entire average.",
          },
          {
            company: "Zomato",
            headline: "Restaurant category hygiene",
            detail:
              "Cuisine labels arrive as 'N. Indian', 'North Indian', and 'north indian'; an audit with value_counts surfaces the variants so they can be standardised before menus are grouped.",
          },
          {
            company: "Experian",
            headline: "Credit record deduplication",
            detail:
              "Credit bureaus audit incoming records for duplicate identities and conflicting entries, since a duplicated account can double-count debt and misprice risk.",
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
            "Data quality issues fall into a handful of recurring categories. Knowing the categories turns auditing from a vague hunt into a checklist you run every time.",
        },
        {
          type: "keypoint",
          title: "The six issue categories",
          content:
            "1) Missing values (NaN, blanks). 2) Duplicates (whole rows or key collisions). 3) Wrong types (numbers stored as text, dates as strings). 4) Inconsistent categories (same thing spelled many ways). 5) Invalid values (negative ages, future birthdates, out-of-range codes). 6) Structural issues (wrong headers, merged columns, mixed units).",
        },
        {
          type: "text",
          content:
            "An audit is a fixed sequence of cheap checks that surface these categories quickly. You run the same handful of commands on every new dataset before writing a line of analysis.",
        },
        {
          type: "code-note",
          code: `import pandas as pd
df = pd.read_csv('orders.csv')

print(df.shape)             # scale: rows, cols
print(df.info())            # dtypes + non-null counts (types + missing)
print(df.describe())        # numeric ranges (invalid values, outliers)
print(df.isna().sum())      # missing per column
print(df.duplicated().sum())# duplicate row count`,
          content:
            "Five commands cover four of the six categories in seconds. info() catches wrong types and missingness; describe() exposes impossible ranges; duplicated() counts repeats. This is the standard opening ritual.",
        },
        {
          type: "text",
          content:
            "For categorical columns, value_counts() and nunique() are the workhorses. They reveal inconsistent spellings, unexpected categories, and typos that describe() can't see because it ignores text columns.",
        },
        {
          type: "code-note",
          code: `print(df['city'].nunique())            # how many distinct values?
print(df['city'].value_counts())       # each value and its frequency
# 'Mumbai' 400, 'mumbai' 12, 'Bombay' 3  -> same city, three labels`,
          content:
            "A column that should have, say, 30 cities but shows nunique() of 47 is a red flag: the extra 17 are almost always spelling variants. value_counts() lists them so you can see the long tail of typos.",
        },
        {
          type: "analogy",
          title: "Auditing is a pre-flight checklist",
          content:
            "Pilots don't eyeball the plane and take off — they run the same written checklist every flight, because the cost of a missed item is catastrophic and memory is unreliable. A data audit is the same discipline: the same checks, every dataset, every time, so a problem is never missed just because you were confident the data looked fine.",
        },
        {
          type: "warning",
          title: "Clean issues in the right order",
          content:
            "Order matters. Fix structural problems first (correct headers, split merged fields), then types (so comparisons and ranges work), then duplicates, then missing values, then inconsistent categories, and treat outliers last once everything else is trustworthy. Imputing before fixing types, or deduplicating before fixing the key column, just creates new messes.",
        },
        {
          type: "expandable",
          title: "Validity vs accuracy vs consistency",
          content:
            "Data quality has dimensions worth separating. Validity: does a value conform to its rules (an age between 0 and 120)? Accuracy: is it actually correct (the age matches the real person)? Consistency: do related values agree (order_date is before ship_date; the same customer has one spelling)? Completeness: are required values present? An audit can catch validity, consistency, and completeness from the data alone — accuracy usually needs an external source of truth, which is why some errors survive even a careful audit.",
        },
      ],
    },

    {
      id: "diagram",
      type: "interactive-diagram",
      tocLabel: "Visual Learning",
      visual: {
        kind: "flow",
        title: "The data audit workflow",
        caption:
          "Click each stage to see the checks it runs and the issues it surfaces.",
        nodes: [
          { id: "shape", label: "Scale", sublabel: "shape", detail: "How many rows and columns? Sets expectations and reveals gross problems — a file with 3 columns when you expected 12 means a parse error.", x: 15, y: 20, accent: false },
          { id: "types", label: "Types & nulls", sublabel: "info()", detail: "info() shows every column's dtype and non-null count in one view — catches numbers-as-text, dates-as-strings, and missing values together.", x: 40, y: 12, accent: true },
          { id: "ranges", label: "Ranges", sublabel: "describe()", detail: "describe() gives min/max/quartiles for numeric columns, exposing impossible values (negative ages, zero prices) and hints of outliers.", x: 65, y: 20, accent: true },
          { id: "cats", label: "Categories", sublabel: "value_counts / nunique", detail: "For text columns, list distinct values and frequencies to find inconsistent spellings, stray categories, and typos.", x: 85, y: 40, accent: true },
          { id: "dupes", label: "Duplicates", sublabel: "duplicated()", detail: "Count fully duplicated rows and, separately, duplicate keys — a repeated order_id can double-count revenue.", x: 55, y: 55, accent: false },
          { id: "report", label: "Quality report", sublabel: "prioritise", detail: "Summarise every issue found, ranked by impact, before touching the data. The report drives the cleaning plan and its order.", x: 40, y: 85, accent: true },
        ],
        edges: [
          { from: "shape", to: "types" },
          { from: "types", to: "ranges" },
          { from: "ranges", to: "cats" },
          { from: "types", to: "dupes" },
          { from: "cats", to: "report" },
          { from: "dupes", to: "report" },
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
          title: "Check the shape and types",
          scenario: "You just loaded a CSV and want a first read on its structure.",
          steps: [
            { code: "import pandas as pd\ndf = pd.DataFrame({'id':[1,2,3], 'price':['10','20','30']})", explanation: "Three rows. Note price is quoted — it loaded as text, not numbers." },
            { code: "print(df.shape)", explanation: ".shape confirms 3 rows, 2 columns." },
            { code: "print(df['price'].dtype)", explanation: "The dtype is 'object' — a red flag that a numeric column is actually storing strings, which will break any arithmetic." },
          ],
          output: "(3, 2)\nobject",
        },
        {
          difficulty: "Easy",
          title: "Spot inconsistent categories",
          scenario: "A city column looks fine at a glance but may hide spelling variants.",
          steps: [
            { code: "df = pd.DataFrame({'city':['Delhi','delhi','Delhi','Mumbai','DELHI']})", explanation: "To a human these are two cities; to pandas they're four distinct strings." },
            { code: "print(df['city'].nunique())", explanation: "nunique() reports 4 distinct values — more than the two real cities, signalling inconsistency." },
            { code: "print(df['city'].value_counts().to_dict())", explanation: "value_counts lists each variant so you can see 'Delhi', 'delhi', and 'DELHI' are the same city split three ways." },
          ],
          output: "4\n{'Delhi': 2, 'delhi': 1, 'Mumbai': 1, 'DELHI': 1}",
        },
        {
          difficulty: "Medium",
          title: "Find invalid values with describe",
          scenario: "An age column should be plausible human ages; check for impossible entries.",
          steps: [
            { code: "df = pd.DataFrame({'age':[34, 28, -5, 41, 250]})", explanation: "Two entries are impossible: -5 and 250 aren't valid human ages." },
            { code: "stats = df['age'].describe()", explanation: "describe() computes min, max, and quartiles. The min of -5 and max of 250 immediately flag invalid values a glance at the data might miss." },
            { code: "print(stats['min'], stats['max'])", explanation: "Reading just the extremes confirms the column contains out-of-range values needing treatment." },
          ],
          output: "-5.0 250.0",
        },
        {
          difficulty: "Hard",
          title: "Count duplicate keys",
          scenario: "Each order_id should be unique; duplicates would double-count revenue.",
          steps: [
            { code: "df = pd.DataFrame({\n    'order_id':[101, 102, 102, 103, 103],\n    'amount':[50, 30, 30, 20, 20]\n})", explanation: "order_id 102 and 103 each appear twice — likely accidental duplicate rows from a bad export." },
            { code: "dupe_rows = df.duplicated().sum()", explanation: "duplicated() marks the second and later occurrence of each fully repeated row True; .sum() counts them. Two rows are exact duplicates." },
            { code: "dupe_keys = df['order_id'].duplicated().sum()\nprint(dupe_rows, dupe_keys)", explanation: "Checking the key column alone also finds 2 repeated order_ids. Auditing the key separately matters — sometimes the key repeats while other columns differ, which is a conflict, not a clean duplicate." },
          ],
          output: "2 2",
        },
        {
          difficulty: "Industry Example",
          title: "A one-pass audit for a marketing dataset",
          scenario: "A data analyst at a retail chain receives a customer export and must produce a data quality summary before the marketing team builds a campaign on it.",
          steps: [
            { code: "import pandas as pd\ndf = pd.DataFrame({\n    'customer_id':[1,2,2,3,4],\n    'email':['a@x.com','b@x.com','b@x.com', None, 'd@x.com'],\n    'age':[25, 34, 34, 41, 200],\n    'segment':['Gold','gold','gold','Silver','Bronze'],\n})", explanation: "A small but representative export: a duplicate customer, a missing email, an impossible age, and inconsistent segment casing." },
            { code: "report = {\n    'rows': len(df),\n    'dupe_rows': int(df.duplicated().sum()),\n    'missing_email': int(df['email'].isna().sum()),\n    'age_max': int(df['age'].max()),\n    'segment_variants': int(df['segment'].nunique()),\n}", explanation: "One dictionary captures the audit: row count, duplicate rows, missing emails, the suspicious max age, and the number of segment spellings. Each field maps to an issue category." },
            { code: "print(report)", explanation: "The summary reads: 5 rows, 1 duplicate, 1 missing email, a max age of 200 (invalid), and 4 segment variants where there should be 3. This report — not the raw data — is what you hand the team, and it dictates the cleaning order." },
          ],
          output: "{'rows': 5, 'dupe_rows': 1, 'missing_email': 1, 'age_max': 200, 'segment_variants': 4}",
        },
      ],
    },

    {
      id: "inline-practice",
      type: "inline-code",
      tocLabel: "Practice Coding",
      coding: {
        language: "python",
        filename: "audit_practice.py",
        instructions:
          "A product dataset just landed. Run a quick audit that quantifies each quality issue, then read off the summary.",
        starterCode: `import pandas as pd

df = pd.DataFrame({
    'sku':     ['P1','P2','P2','P3','P4'],
    'price':   [19.99, 5.00, 5.00, -1.00, 12.50],
    'category':['Toys','toys','toys','Books','Books'],
})

# TODO 1: Number of fully duplicated rows
dupes = ___

# TODO 2: Number of distinct category spellings
cat_variants = ___

# TODO 3: Count of invalid prices (price < 0)
bad_prices = ___

print("Duplicates:", dupes)
print("Category variants:", cat_variants)
print("Invalid prices:", bad_prices)`,
        solutionCode: `import pandas as pd

df = pd.DataFrame({
    'sku':     ['P1','P2','P2','P3','P4'],
    'price':   [19.99, 5.00, 5.00, -1.00, 12.50],
    'category':['Toys','toys','toys','Books','Books'],
})

dupes = df.duplicated().sum()
cat_variants = df['category'].nunique()
bad_prices = (df['price'] < 0).sum()

print("Duplicates:", dupes)
print("Category variants:", cat_variants)
print("Invalid prices:", bad_prices)`,
        expectedOutput: "Duplicates: 1\nCategory variants: 3\nInvalid prices: 1",
        hints: [
          "Task 1: df.duplicated().sum() counts rows that repeat an earlier row exactly. Row P2 (5.00, toys) repeats once.",
          "Task 2: df['category'].nunique() counts distinct strings — 'Toys', 'toys', 'Books' are three.",
          "Task 3: build a boolean mask df['price'] < 0 and sum it to count the True values.",
          "dupes = df.duplicated().sum(); cat_variants = df['category'].nunique(); bad_prices = (df['price'] < 0).sum()",
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
          id: "pda07_mcq_01",
          difficulty: "Easy",
          question: "Which single command best reveals both column dtypes and missing-value counts at once?",
          options: ["df.shape", "df.info()", "df.head()", "df.columns"],
          correctIndex: 1,
          explanation:
            "df.info() lists each column's dtype and non-null count together, catching wrong types and missingness in one view. shape gives only dimensions, head shows sample rows, columns lists names.",
        },
        {
          type: "mcq",
          id: "pda07_mcq_02",
          difficulty: "Easy",
          question: "A city column shows nunique() of 47 but you expected about 30 cities. What does this most likely indicate?",
          options: [
            "The data is fine — cities vary",
            "Inconsistent spellings/casing splitting single cities into multiple labels",
            "Missing values",
            "A wrong dtype",
          ],
          correctIndex: 1,
          explanation:
            "More distinct values than real categories almost always means spelling or casing variants ('Delhi'/'delhi'/'DELHI'). Missing values and wrong dtype are different issues that other checks surface.",
        },
        {
          type: "mcq",
          id: "pda07_mcq_03",
          difficulty: "Medium",
          question: "Why should you fix data types before deduplicating or imputing?",
          options: [
            "It's just a style preference",
            "Comparisons, ranges, and key matching behave correctly only once columns hold their intended types",
            "Deduplication deletes type information",
            "Imputation requires object dtype",
          ],
          correctIndex: 1,
          explanation:
            "Duplicate detection and range/validity checks depend on values being the right type — '10' and 10 aren't equal as strings, and you can't range-check text. Fixing types first makes every later step correct. The other options are false.",
        },
        {
          type: "scenario",
          id: "pda07_sc_01",
          difficulty: "Medium",
          scenario:
            "You audit a transactions file and describe() shows a 'quantity' column with a minimum of -8 and a maximum of 99999, while most values sit between 1 and 20. The team wants to compute average basket size today.",
          question: "What should you do before reporting the average?",
          options: [
            "Report the raw average — the data is what it is",
            "Flag the negative and extreme values as invalid/outliers, decide how to treat them, and note it, because they'll distort the mean",
            "Delete the whole quantity column",
            "Convert quantity to a string",
          ],
          correctIndex: 1,
          explanation:
            "A negative quantity is invalid and 99999 is an implausible outlier; both drag the mean away from the true typical basket. The right move is to identify, decide treatment (remove/cap/investigate), and document — not to report a corrupted average, delete a useful column, or change its type.",
        },
        {
          type: "coding",
          id: "pda07_code_01",
          difficulty: "Hard",
          prompt:
            "Given the DataFrame below, print the number of rows that have at least one problem, where a problem is: a missing value in any column, OR a negative amount.\n\ndf = pd.DataFrame({'id':[1,2,3,4], 'amount':[10.0, -5.0, None, 20.0], 'name':['A', None, 'C', 'D']})",
          starterCode:
            "import pandas as pd\n\ndf = pd.DataFrame({'id':[1,2,3,4], 'amount':[10.0, -5.0, None, 20.0], 'name':['A', None, 'C', 'D']})\n\n# Your code here\n",
          solutionCode:
            "import pandas as pd\n\ndf = pd.DataFrame({'id':[1,2,3,4], 'amount':[10.0, -5.0, None, 20.0], 'name':['A', None, 'C', 'D']})\n\nhas_missing = df.isna().any(axis=1)\nhas_negative = df['amount'] < 0\nbad_rows = (has_missing | has_negative).sum()\nprint(bad_rows)",
          expectedOutput: "2",
          tests: [
            { name: "Row logic", description: "Row id=2 is negative and also missing name; row id=3 is missing amount — each flagged once via the OR mask" },
            { name: "Count", description: "Rows id=2 and id=3 are the only problem rows, so the count is 2" },
          ],
        },
        {
          type: "mcq",
          id: "pda07_mcq_04",
          difficulty: "Hard",
          question: "Which data quality dimension can an audit of the data alone usually NOT verify?",
          options: [
            "Validity (values conform to rules)",
            "Completeness (required values present)",
            "Accuracy (values match reality)",
            "Consistency (related values agree)",
          ],
          correctIndex: 2,
          explanation:
            "Validity, completeness, and consistency can all be checked from the data's own rules and internal relationships. Accuracy — whether a value matches the real world — generally needs an external source of truth, so it can survive a careful audit.",
        },
      ],
    },

    {
      id: "interview-questions",
      type: "interview-questions",
      tocLabel: "Interview Prep",
      questions: [
        {
          question: "Walk me through how you audit a new dataset for quality issues.",
          answer:
            "I run the same checklist every time so nothing gets missed. First shape, to confirm the scale and catch gross parse errors. Then info(), which shows dtypes and non-null counts together, flagging wrong types and missingness at once. Then describe() for the numeric columns to expose impossible ranges and hints of outliers. For text columns I use value_counts() and nunique() to surface inconsistent spellings and stray categories. I count duplicated() rows and separately check duplicate keys. The output isn't a cleaned dataset — it's a prioritised quality report listing every issue by category and impact, which then drives the cleaning plan. Auditing before cleaning keeps me from fixing symptoms in the wrong order.",
        },
        {
          question: "What are the main categories of data quality issues, and why does the order you fix them in matter?",
          answer:
            "I group them into missing values, duplicates, wrong types, inconsistent categories, invalid or out-of-range values, and structural problems like bad headers or merged columns. Order matters because the fixes depend on each other. I fix structural issues first so the columns even mean what I think they do. Then types, because duplicate detection, range checks, and comparisons only behave correctly once a number is a number and a date is a date. Then duplicates, so I'm not imputing or aggregating over repeated rows. Then missing values, then category standardisation, and I leave outliers for last because I want everything else trustworthy before I decide whether an extreme value is an error or a real signal. Cleaning out of order — say imputing before fixing types, or deduplicating on a still-messy key — tends to create fresh problems.",
        },
        {
          question: "How do you distinguish between validity, accuracy, and consistency, and what are the limits of an automated audit?",
          answer:
            "Validity is whether a value obeys its own rules — an age in 0 to 120, a status from an allowed set. Accuracy is whether the value is actually correct — the age really is that person's age. Consistency is whether related values agree — an order date before its ship date, or one customer having a single spelling of their name. From the data alone I can check validity against rules, consistency against internal relationships, and completeness against required-field lists, and I can automate all of that with assertions or a validation library. What I generally can't verify without an external source of truth is accuracy: a perfectly valid, internally consistent age of 37 can still be wrong. That's the fundamental limit of an audit — it catches data that violates rules or contradicts itself, but a plausible, self-consistent error can pass straight through, which is why critical pipelines add reconciliation against a trusted system on top of the audit.",
        },
      ],
    },

    {
      id: "common-mistakes",
      type: "callout",
      variant: "warning",
      title: "Common Mistakes to Avoid",
      content:
        "1) Skipping the audit because the data 'looks fine' in head() — the first five rows hide most problems. 2) Trusting describe() to catch category issues — it ignores text columns; use value_counts/nunique for those. 3) Cleaning in the wrong order — fix structure and types before duplicates and imputation. 4) Checking only whole-row duplicates and missing duplicate keys, where the key repeats but other columns differ. 5) Treating an implausible value as automatically wrong — investigate before deleting; some 'outliers' are real. 6) Assuming a passing audit means accurate data — internal checks can't verify real-world accuracy.",
    },

    {
      id: "ai-tutor",
      type: "callout",
      variant: "tip",
      title: "Ask the AI Tutor",
      content:
        "Try these prompts in the AI Tutor panel: • 'ELI5: why is a data audit like a pre-flight checklist?' • 'Show me an audit that finds all six issue categories in one dataset.' • 'Quiz me on which command catches which issue.' • 'Explain validity vs accuracy vs consistency with fresh examples.' • 'Interview mode: ask me to justify the order I clean issues in.'",
    },

    {
      id: "glossary",
      type: "callout",
      variant: "info",
      title: "Glossary",
      content:
        "Data audit — the systematic first-pass inspection of a dataset for quality issues. info() — shows dtypes and non-null counts per column. describe() — summary statistics for numeric columns. value_counts() — frequency of each distinct value in a column. nunique() — number of distinct values. duplicated() — flags repeated rows. Inconsistent categories — the same real value stored under multiple labels. Invalid value — a value that violates a rule (negative age). Structural issue — a problem with the table's shape (wrong headers, merged fields). Validity / Accuracy / Consistency / Completeness — the dimensions of data quality.",
    },

    {
      id: "resources",
      type: "callout",
      variant: "info",
      title: "Recommended Resources",
      content:
        "• Docs: pandas 'Essential basic functionality' for info/describe, and the 'Working with text data' guide for category checks. • Read: a short overview of data quality dimensions (validity, accuracy, completeness, consistency) to frame your audits. • Practice: take any public CSV, run the five-command audit ritual, and write a one-paragraph quality report naming each issue category you find. • Next in DSM: you can spot missingness at a glance — next, in Detecting & Handling Nulls, you'll go deeper into missingness patterns and the imputation choices that follow from them.",
    },

    {
      id: "recap",
      type: "recap",
      tocLabel: "Recap",
      content:
        "✓ Data quality issues fall into six categories: missing values, duplicates, wrong types, inconsistent categories, invalid values, and structural problems.\n✓ Audit every new dataset with a fixed ritual: shape, info, describe, isna, duplicated, and value_counts/nunique for text.\n✓ describe() finds invalid numeric ranges; value_counts/nunique find inconsistent categories.\n✓ Clean in order: structure → types → duplicates → missing → categories → outliers.\n✓ An audit produces a prioritised quality report, not a cleaned dataset.\n✓ Internal checks verify validity, consistency, and completeness — but not real-world accuracy.\n\nNext up: Detecting & Handling Nulls. You know missingness is one of the six issues — next you'll study its patterns in depth and match each to the right imputation strategy.",
    },
  ],
};
