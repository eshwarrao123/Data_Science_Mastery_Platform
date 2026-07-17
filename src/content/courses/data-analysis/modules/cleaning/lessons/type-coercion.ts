import type { Lesson } from "@/lib/curriculum/types";

export const typeCoercion: Lesson = {
  meta: {
    id: "data-analysis.cleaning.type-coercion",
    slug: "type-coercion",
    title: "Data Type Coercion",
    description:
      "Force columns into the types they should have been: astype for clean casts, to_numeric and to_datetime with errors='coerce' for dirty data, and the category dtype for memory-efficient labels.",
    estimatedTime: "25 mins",
    difficulty: "Intermediate",
    xpReward: 60,
    prerequisites: ["data-analysis.cleaning.deduplication"],
    masteryThreshold: 80,
  },

  blocks: [
    {
      id: "intro",
      type: "lesson-intro",
      tocLabel: "Introduction",
      intro: {
        hook: "df['price'].sum() returns '19.995.0012.50' — pandas happily concatenated your prices, because a CSV of numbers with one stray '£' in it loads as strings. Nothing crashed. Nothing warned you. The column just isn't what you think it is, and every operation on it is quietly wrong.",
        what: "Type coercion is converting columns to their intended dtypes: astype() when the data is clean, pd.to_numeric() and pd.to_datetime() with errors='coerce' when it isn't, and astype('category') for low-cardinality labels. It's the step that makes arithmetic, comparison, sorting, and date math mean what they should.",
        why: "dtypes decide behaviour. Strings sort alphabetically ('10' < '9'), sum by concatenation, and refuse date arithmetic. A wrong dtype doesn't error — it produces plausible nonsense, which is far more dangerous. Coercion converts silent wrongness into either correct values or visible NaNs you can count.",
        whereUsed:
          "Immediately after every read_csv in every pipeline. Loading, cleaning, feature engineering, and database writes all begin with getting dtypes right — and memory-heavy workflows lean on category dtype to fit data in RAM.",
        objectives: [
          "Read dtypes and spot object columns that should be numeric or datetime",
          "Cast clean columns with astype and know when it raises",
          "Coerce dirty columns with to_numeric/to_datetime and errors='coerce'",
          "Strip currency symbols and separators before converting",
          "Use the category dtype and explain when it saves memory",
        ],
        realWorldApps: [
          {
            company: "Bloomberg",
            headline: "Price feed normalisation",
            detail:
              "Market data arrives from dozens of exchanges as text with mixed formats — '1,234.50', '1.234,50' — and is coerced to numeric with strict validation, because a misparsed price becomes a wrong trade.",
          },
          {
            company: "NHS",
            headline: "Patient date handling",
            detail:
              "Hospital records mix date formats across systems; ingestion pipelines run to_datetime with explicit formats and audit the coercion failures, since a swapped day/month changes a patient's timeline.",
          },
          {
            company: "Instacart",
            headline: "Category dtype at scale",
            detail:
              "Basket analysis over hundreds of millions of rows stores product department and aisle labels as category dtype, cutting memory severalfold so the analysis fits on ordinary machines.",
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
            "Diagnosis first: df.dtypes lists every column's type. The one to distrust is object — it usually means strings, and any 'numeric-looking' object column is a casualty waiting to happen. A single stray character in a million rows is enough to make read_csv give up and load the whole column as text.",
        },
        {
          type: "code-note",
          code: `print(df.dtypes)
# price       object   <- suspicious: should be float
# quantity     int64
# order_date  object   <- suspicious: should be datetime`,
          content:
            "info() and dtypes are the detection tools. Any object column with a numeric or date-like name deserves a look at its unique values to find the contaminating entries.",
        },
        {
          type: "keypoint",
          title: "astype: the strict cast",
          content:
            "df['col'].astype(int), astype(float), astype(str), astype('category') — astype converts every value or raises a ValueError on the first one it can't handle. That strictness is a feature for clean data: it guarantees the whole column converted. For dirty data it's the wrong tool, because one '£4.99' aborts the entire cast.",
        },
        {
          type: "code-note",
          code: `pd.to_numeric(df['price'], errors='coerce')     # bad values -> NaN
pd.to_datetime(df['date'], errors='coerce')     # bad dates  -> NaT

converted = pd.to_numeric(df['price'], errors='coerce')
print(converted.isna().sum() - df['price'].isna().sum())  # NEW NaNs = failures`,
          content:
            "The forgiving converters: errors='coerce' turns unconvertible values into NaN (NaT for dates) instead of raising. The crucial habit is the last line — count how many NEW nulls coercion created. That number is your failure count; investigate it before moving on.",
        },
        {
          type: "text",
          content:
            "Often the honest fix is clean-then-convert: strip the junk that blocks conversion, then coerce. Currency symbols, thousands separators, and stray whitespace are the usual suspects, removed with the .str accessor before to_numeric.",
        },
        {
          type: "code-note",
          code: `df['price'] = pd.to_numeric(
    df['price'].str.replace(',', '', regex=False)
               .str.replace('₹', '', regex=False)
               .str.strip(),
    errors='coerce',
)`,
          content:
            "Strip separators and symbols first so values like '₹1,299.00' convert to 1299.0 instead of becoming NaN. Coercing without cleaning throws away recoverable data.",
        },
        {
          type: "keypoint",
          title: "category: the label dtype",
          content:
            "astype('category') stores each distinct value once and replaces the column with small integer codes. A million-row 'city' column with 40 cities shrinks dramatically and groups faster. Use it for low-cardinality labels (status, department, city); skip it for high-cardinality or free-text columns, where the codes table saves nothing.",
        },
        {
          type: "warning",
          title: "Integers can't hold NaN (mostly)",
          content:
            "NumPy's int64 has no missing-value representation, so a column with nulls silently becomes float64 (1 → 1.0) and astype(int) on it raises. Options: fill the nulls first, keep floats, or use pandas' nullable 'Int64' (capital I) dtype, which stores integers alongside pd.NA. That's why ID columns often arrive as floats — a single null demoted them.",
        },
        {
          type: "analogy",
          title: "Types are the units on the label",
          content:
            "A warehouse where one shelf's weights are recorded in kilograms and another's in the word 'heavy' can't answer 'total weight?'. Coercion is relabelling everything into proper units: afterwards the questions become answerable, and anything that couldn't be relabelled is flagged (NaN) rather than quietly mixed in.",
        },
        {
          type: "expandable",
          title: "Why one bad value poisons a whole CSV column",
          content:
            "read_csv infers each column's dtype from its values. It has to pick ONE dtype per column, so a single unparseable entry — 'N/A', '£4.99', a stray letter — forces the entire column to object, demoting a million good numbers to strings. This is also why the same script works on Monday's file and breaks on Tuesday's: the dtype depends on the data, not the code. Production pipelines pin dtypes explicitly with read_csv's dtype= and parse_dates= arguments (or converters), so a format drift surfaces as a loud parse error instead of a silent object column.",
        },
      ],
    },

    {
      id: "diagram",
      type: "interactive-diagram",
      tocLabel: "Visual Learning",
      visual: {
        kind: "decision-tree",
        title: "Choosing a conversion path",
        caption: "Click each node to follow a column from object dtype to its true type.",
        nodes: [
          { id: "spot", label: "object column", sublabel: "dtypes / info()", detail: "A numeric- or date-named column showing dtype object is the trigger. Inspect unique values to see what contaminated it.", x: 50, y: 8, accent: true },
          { id: "clean", label: "Is it clean?", sublabel: "inspect values", detail: "If every value parses (only digits, or one date format), a strict cast is fine. Any symbols, separators, or junk entries mean the forgiving path.", x: 50, y: 30, accent: true },
          { id: "astype", label: "astype()", sublabel: "strict cast", detail: "astype(int/float/str) converts everything or raises on the first failure — a guarantee of total conversion for clean columns.", x: 18, y: 55, accent: false },
          { id: "strip", label: "Strip junk", sublabel: ".str.replace/.strip", detail: "Remove currency symbols, thousands separators, and whitespace so recoverable values like '₹1,299' aren't lost to NaN.", x: 60, y: 52, accent: false },
          { id: "coerce", label: "to_numeric / to_datetime", sublabel: "errors='coerce'", detail: "Unconvertible leftovers become NaN/NaT instead of raising. The column gets its true dtype; failures become countable.", x: 82, y: 70, accent: true },
          { id: "audit", label: "Audit new NaNs", sublabel: "count failures", detail: "Compare null counts before vs after: every NEW null is a value coercion destroyed. A handful is normal; hundreds mean a format you should handle.", x: 50, y: 88, accent: true },
        ],
        edges: [
          { from: "spot", to: "clean" },
          { from: "clean", to: "astype", label: "clean" },
          { from: "clean", to: "strip", label: "dirty" },
          { from: "strip", to: "coerce" },
          { from: "coerce", to: "audit" },
          { from: "astype", to: "audit" },
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
          title: "The string-sum trap",
          scenario: "See what a wrong dtype actually does before fixing it.",
          steps: [
            { code: "import pandas as pd\ndf = pd.DataFrame({'price': ['10', '20', '30']})", explanation: "Quoted digits: the column loads as object (strings), not numbers." },
            { code: "print(df['price'].sum())", explanation: "sum() on strings concatenates — '102030'. No error, just nonsense." },
            { code: "df['price'] = df['price'].astype(int)\nprint(df['price'].sum())", explanation: "The column is clean, so a strict astype(int) is safe. Now sum() adds: 60." },
          ],
          output: "102030\n60",
        },
        {
          difficulty: "Easy",
          title: "Coerce a dirty numeric column",
          scenario: "A quantity column contains a junk entry that blocks astype.",
          steps: [
            { code: "df = pd.DataFrame({'qty': ['5', '3', 'unknown', '8']})", explanation: "astype(int) would raise on 'unknown' and abort the whole conversion." },
            { code: "df['qty'] = pd.to_numeric(df['qty'], errors='coerce')", explanation: "errors='coerce' converts what it can and turns 'unknown' into NaN. The dtype becomes float64 (NaN needs floats)." },
            { code: "print(df['qty'].tolist())\nprint(df['qty'].isna().sum())", explanation: "Three real values survived; exactly one NaN marks the failure — a countable, inspectable record of what didn't parse." },
          ],
          output: "[5.0, 3.0, nan, 8.0]\n1",
        },
        {
          difficulty: "Medium",
          title: "Clean currency strings, then convert",
          scenario: "Prices arrive as '₹1,299.00' — strip the formatting so the values survive coercion.",
          steps: [
            { code: "df = pd.DataFrame({'price': ['₹1,299.00', '₹450.50', '₹2,100.00']})", explanation: "Coercing these directly would make every value NaN — the symbols and commas block parsing." },
            { code: "cleaned = (df['price'].str.replace('₹', '', regex=False)\n                     .str.replace(',', '', regex=False))", explanation: "Two .str.replace passes remove the currency symbol and the thousands separators, leaving plain '1299.00' strings." },
            { code: "df['price'] = pd.to_numeric(cleaned, errors='coerce')\nprint(df['price'].tolist())", explanation: "Now everything parses: three floats, zero NaNs. Clean-then-convert recovered 100% of the data." },
          ],
          output: "[1299.0, 450.5, 2100.0]",
        },
        {
          difficulty: "Hard",
          title: "Dates unlock date math",
          scenario: "Order and ship dates are strings; compute delivery time in days.",
          steps: [
            { code: "df = pd.DataFrame({\n    'ordered': ['2026-03-01', '2026-03-05', 'not_recorded'],\n    'shipped': ['2026-03-04', '2026-03-06', '2026-03-10'],\n})", explanation: "As strings these support no arithmetic, and one entry isn't a date at all." },
            { code: "df['ordered'] = pd.to_datetime(df['ordered'], errors='coerce')\ndf['shipped'] = pd.to_datetime(df['shipped'], errors='coerce')", explanation: "Both columns become datetime64; 'not_recorded' becomes NaT — the datetime version of NaN." },
            { code: "df['days'] = (df['shipped'] - df['ordered']).dt.days\nprint(df['days'].tolist())", explanation: "Subtracting datetimes yields timedeltas; .dt.days extracts whole days. The NaT row propagates to NaN instead of poisoning the others." },
          ],
          output: "[3.0, 1.0, nan]",
        },
        {
          difficulty: "Industry Example",
          title: "A dtype pass on an e-commerce export",
          scenario: "A data analyst at an online retailer receives the weekly orders export where every column loaded as object, and must produce typed, audited columns before the revenue report.",
          steps: [
            { code: "import pandas as pd\ndf = pd.DataFrame({\n    'amount':  ['1,250.00', '899.99', 'refund', '2,400.00'],\n    'status':  ['paid','paid','refunded','paid'],\n    'placed':  ['2026-07-01','2026-07-02','2026-07-02','bad_date'],\n})", explanation: "Three object columns: amount has separators and a text entry, placed has a corrupt date, status is a low-cardinality label." },
            { code: "amt = pd.to_numeric(df['amount'].str.replace(',', '', regex=False), errors='coerce')\nplaced = pd.to_datetime(df['placed'], errors='coerce')\nnew_nans = int(amt.isna().sum() + placed.isna().sum())", explanation: "Clean-then-coerce both columns and — the audit habit — count the coercion failures: 'refund' and 'bad_date' each became a null, so new_nans is 2." },
            { code: "df['amount'], df['placed'] = amt, placed\ndf['status'] = df['status'].astype('category')\nprint(df.dtypes.astype(str).to_dict())\nprint('failures:', new_nans)", explanation: "The frame now has float64 amounts, datetime64 dates, and a memory-efficient category status. The report can state: 2 rows failed coercion and are excluded pending investigation — typed data plus an audit trail." },
          ],
          output: "{'amount': 'float64', 'status': 'category', 'placed': 'datetime64[ns]'}\nfailures: 2",
        },
      ],
    },

    {
      id: "inline-practice",
      type: "inline-code",
      tocLabel: "Practice Coding",
      coding: {
        language: "python",
        filename: "coercion_practice.py",
        instructions:
          "A sales export loaded every column as text. Convert amount (strip the $ and commas first), parse the date column, and count how many values coercion failed to convert.",
        starterCode: `import pandas as pd

df = pd.DataFrame({
    'amount': ['$1,200', '$350', 'n/a', '$780'],
    'sold':   ['2026-05-01', '2026-05-03', '2026-05-03', 'unknown'],
})

# TODO 1: Strip '$' and ',' from amount, then convert with to_numeric (coerce)
df['amount'] = ___

# TODO 2: Parse sold with to_datetime (coerce)
df['sold'] = ___

# TODO 3: Total number of NaN/NaT produced across both columns
failures = ___

print(df['amount'].tolist())
print(str(df['sold'].dtype))
print(failures)`,
        solutionCode: `import pandas as pd

df = pd.DataFrame({
    'amount': ['$1,200', '$350', 'n/a', '$780'],
    'sold':   ['2026-05-01', '2026-05-03', '2026-05-03', 'unknown'],
})

df['amount'] = pd.to_numeric(
    df['amount'].str.replace('$', '', regex=False)
                .str.replace(',', '', regex=False),
    errors='coerce',
)

df['sold'] = pd.to_datetime(df['sold'], errors='coerce')

failures = int(df['amount'].isna().sum() + df['sold'].isna().sum())

print(df['amount'].tolist())
print(str(df['sold'].dtype))
print(failures)`,
        expectedOutput: "[1200.0, 350.0, nan, 780.0]\ndatetime64[ns]\n2",
        hints: [
          "Task 1: chain two .str.replace calls (use regex=False for literal '$' and ','), then wrap in pd.to_numeric(..., errors='coerce').",
          "Task 2: pd.to_datetime(df['sold'], errors='coerce') — 'unknown' becomes NaT.",
          "Task 3: isna() counts both NaN and NaT; sum the two columns' counts. 'n/a' and 'unknown' each failed → 2.",
          "df['amount'] = pd.to_numeric(df['amount'].str.replace('$','',regex=False).str.replace(',','',regex=False), errors='coerce')",
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
          id: "pda10_mcq_01",
          difficulty: "Easy",
          question: "A CSV column of a million numbers contains one entry 'N/A'. What dtype does read_csv give the column?",
          options: ["int64", "float64", "object", "category"],
          correctIndex: 2,
          explanation:
            "read_csv must choose one dtype for the whole column, and 'N/A' can't be numeric — so all million values load as object (strings). One bad value demotes the entire column.",
        },
        {
          type: "mcq",
          id: "pda10_mcq_02",
          difficulty: "Easy",
          question: "What's the key behavioural difference between astype(float) and pd.to_numeric(..., errors='coerce')?",
          options: [
            "astype is slower",
            "astype raises on the first unconvertible value; to_numeric with coerce turns failures into NaN and continues",
            "to_numeric only works on integers",
            "There is no difference",
          ],
          correctIndex: 1,
          explanation:
            "astype is all-or-nothing — one bad value aborts the cast with a ValueError. to_numeric with errors='coerce' converts what it can and marks failures as NaN, making it the tool for dirty columns.",
        },
        {
          type: "mcq",
          id: "pda10_mcq_03",
          difficulty: "Medium",
          question: "Why does an integer ID column often show up as float64 after loading?",
          options: [
            "read_csv always prefers floats",
            "The column contains at least one missing value, and NumPy int64 can't represent NaN",
            "IDs are too large for int64",
            "float64 is more memory efficient",
          ],
          correctIndex: 1,
          explanation:
            "NumPy's int64 has no missing-value slot, so a single null forces the column to float64 (where NaN lives). Fixes: fill the nulls, keep floats, or use pandas' nullable 'Int64' dtype.",
        },
        {
          type: "scenario",
          id: "pda10_sc_01",
          difficulty: "Medium",
          scenario:
            "After running pd.to_numeric(df['revenue'], errors='coerce'), a analyst's revenue column has 4,000 more nulls than before the conversion. The analyst shrugs: 'coerce handled it'.",
          question: "What should actually happen next?",
          options: [
            "Nothing — coerce means the problem is solved",
            "Investigate what the 4,000 unconvertible values looked like; a shared format (like '₹1,299') means they're recoverable by cleaning first",
            "Convert the column back to strings",
            "Delete the revenue column",
          ],
          correctIndex: 1,
          explanation:
            "Each new NaN is a destroyed value. 4,000 failures almost certainly share a fixable format — currency symbols or separators — recoverable with .str.replace before coercion. Coerce without auditing is silent data loss at scale.",
        },
        {
          type: "coding",
          id: "pda10_code_01",
          difficulty: "Hard",
          prompt:
            "Convert the 'ordered' column to datetime (coercing failures) and print how many rows were ordered in March 2026.\n\ndf = pd.DataFrame({'ordered': ['2026-03-02', '2026-02-27', '2026-03-15', 'corrupted', '2026-04-01']})",
          starterCode:
            "import pandas as pd\n\ndf = pd.DataFrame({'ordered': ['2026-03-02', '2026-02-27', '2026-03-15', 'corrupted', '2026-04-01']})\n\n# Your code here\n",
          solutionCode:
            "import pandas as pd\n\ndf = pd.DataFrame({'ordered': ['2026-03-02', '2026-02-27', '2026-03-15', 'corrupted', '2026-04-01']})\n\ndf['ordered'] = pd.to_datetime(df['ordered'], errors='coerce')\nin_march = (df['ordered'].dt.month == 3) & (df['ordered'].dt.year == 2026)\nprint(in_march.sum())",
          expectedOutput: "2",
          tests: [
            { name: "Coercion", description: "'corrupted' becomes NaT rather than raising, and NaT rows evaluate False in the mask" },
            { name: "Date filter", description: "Only 2026-03-02 and 2026-03-15 match month 3 of year 2026, so the count is 2" },
          ],
        },
        {
          type: "mcq",
          id: "pda10_mcq_04",
          difficulty: "Hard",
          question: "For which column does astype('category') save the MOST memory?",
          options: [
            "A 1M-row column of unique transaction IDs",
            "A 1M-row column of free-text customer comments",
            "A 1M-row column containing one of 12 subscription plan names",
            "A 10-row column of city names",
          ],
          correctIndex: 2,
          explanation:
            "category pays off when many rows share few distinct values: 1M strings collapse to 12 stored labels plus tiny integer codes. Unique IDs and free text have no repetition to exploit, and a 10-row column has nothing to save.",
        },
      ],
    },

    {
      id: "interview-questions",
      type: "interview-questions",
      tocLabel: "Interview Prep",
      questions: [
        {
          question: "A numeric column loaded as object dtype. Walk me through your fix.",
          answer:
            "First I find out why: df['col'].unique() or a value_counts on a sample usually reveals the contaminant — currency symbols, thousands separators, 'N/A' strings, stray whitespace. If the junk is systematic and recoverable, I clean first: .str.replace for symbols and separators, .str.strip for whitespace. Then I coerce with pd.to_numeric(col, errors='coerce') rather than astype, because dirty data would abort a strict cast. The step people skip is the audit: I compare null counts before and after coercion — every new NaN is a value the conversion destroyed. A handful of genuine junk entries is fine; thousands of failures mean there's another format I should be cleaning rather than discarding. Only when a column is verifiably clean do I use astype directly, precisely because its all-or-nothing failure is then a guarantee, not a nuisance.",
        },
        {
          question: "When would you choose the category dtype, and how does it work under the hood?",
          answer:
            "category stores the distinct values once, in a categories array, and replaces the column data with small integer codes pointing into it. So a million-row column with 40 city names holds 40 strings plus a million small ints, instead of a million string objects — often an order-of-magnitude memory saving, and groupbys get faster because they operate on the codes. I reach for it when cardinality is low relative to length: status flags, departments, cities, plan names. It's counterproductive for near-unique columns like IDs or free text, where the categories table is as big as the original data. Two caveats from practice: string methods require going through .str which may cast back, and comparisons or merges between different category sets can behave surprisingly — so I apply it as a final storage optimisation, not in the middle of heavy string cleaning.",
        },
        {
          question: "How do you make dtype handling robust in a production pipeline rather than a one-off notebook?",
          answer:
            "The notebook habit is letting read_csv infer dtypes and patching afterwards; the production habit is pinning them. I pass explicit dtype= mappings and parse_dates= to read_csv so every load either produces the expected schema or fails loudly — a format drift in Tuesday's file becomes a visible parse error instead of a silent object column. Where source data is known-dirty, the pipeline cleans then coerces with errors='coerce', but always records the failure count as a metric; a sudden spike in coercion failures is an upstream schema change announcing itself. For dates I specify the format explicitly rather than letting inference guess, since day/month ambiguity ('03/04/2026') is a correctness bug, not a style choice. Finally I validate post-load — assert dtypes match the expected schema — so the type contract is enforced at the boundary, and everything downstream can trust it.",
        },
      ],
    },

    {
      id: "common-mistakes",
      type: "callout",
      variant: "warning",
      title: "Common Mistakes to Avoid",
      content:
        "1) Trusting that a numeric-looking column is numeric — check dtypes after every load. 2) Using astype on dirty data — one bad value aborts the cast; coerce instead. 3) Coercing without counting the new NaNs — that count is destroyed data. 4) Discarding recoverable values ('₹1,299') that a .str.replace would have saved. 5) Letting to_datetime guess ambiguous formats — '03/04/2026' needs an explicit format. 6) astype(int) on a column with nulls — it raises; use fillna first or nullable 'Int64'. 7) Applying category to high-cardinality columns and wondering where the memory saving went.",
    },

    {
      id: "ai-tutor",
      type: "callout",
      variant: "tip",
      title: "Ask the AI Tutor",
      content:
        "Try these prompts in the AI Tutor panel: • 'ELI5: why did my price column sum to a giant string?' • 'Show me clean-then-coerce on messy currency data step by step.' • 'Quiz me: astype vs to_numeric — which tool for which column?' • 'Explain why one null turns an int column into floats.' • 'Interview mode: grill me on making dtypes robust in a production pipeline.'",
    },

    {
      id: "glossary",
      type: "callout",
      variant: "info",
      title: "Glossary",
      content:
        "dtype — a column's data type (int64, float64, object, datetime64, category). object — the catch-all dtype, usually strings; the red flag. astype() — strict conversion; raises on any unconvertible value. pd.to_numeric / pd.to_datetime — converters with an errors parameter. errors='coerce' — turn unconvertible values into NaN/NaT instead of raising. NaT — Not a Time, the datetime missing value. Nullable Int64 — pandas integer dtype that can hold pd.NA. category — dtype storing distinct values once plus integer codes per row. Coercion audit — counting NEW nulls created by a conversion.",
    },

    {
      id: "resources",
      type: "callout",
      variant: "info",
      title: "Recommended Resources",
      content:
        "• Docs: pandas user guide sections 'Basics — dtypes' and 'Time series' (for to_datetime formats), plus 'Categorical data'. • Read: the read_csv API docs on dtype=, parse_dates=, and converters= — schema pinning is a production superpower. • Practice: export a spreadsheet with currency formatting to CSV, load it, and recover every value with clean-then-coerce and a zero-failure audit. • Next in DSM: types are right, but the text INSIDE string columns is still messy — String Cleaning tackles casing, whitespace, and extraction.",
    },

    {
      id: "recap",
      type: "recap",
      tocLabel: "Recap",
      content:
        "✓ object dtype on a numeric- or date-shaped column is the red flag; one bad value demotes a whole CSV column.\n✓ astype is strict (raises on failure) — right for clean columns; to_numeric/to_datetime with errors='coerce' handle dirty ones.\n✓ Clean before coercing: strip symbols and separators so recoverable values don't become NaN.\n✓ Audit every coercion by counting new NaNs — that's destroyed data, not a solved problem.\n✓ Nulls force ints to float64; use nullable 'Int64' when you need integers with gaps.\n✓ astype('category') slashes memory for low-cardinality labels and speeds up groupbys.\n\nNext up: String Cleaning. The dtypes are correct, but 'Delhi', ' delhi ', and 'DELHI' are still three different strings — the .str accessor fixes that.",
    },
  ],
};
