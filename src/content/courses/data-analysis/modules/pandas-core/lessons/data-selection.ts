import type { Lesson } from "@/lib/curriculum/types";

export const dataSelection: Lesson = {
  meta: {
    id: "data-analysis.pandas-core.data-selection",
    slug: "data-selection",
    title: "Data Selection: loc, iloc & Boolean Masking",
    description:
      "Select exactly the rows and columns you want from a DataFrame with .loc, .iloc, and boolean masks — and learn to spot the chained-indexing trap that silently corrupts data.",
    estimatedTime: "35 mins",
    difficulty: "Beginner",
    xpReward: 70,
    prerequisites: ["data-analysis.pandas-core.series-and-index"],
    masteryThreshold: 80,
  },

  blocks: [
    {
      id: "intro",
      type: "lesson-intro",
      tocLabel: "Introduction",
      intro: {
        hook: "Ninety percent of data analysis is asking 'show me just these rows and these columns.' Do it clumsily and you get warnings, wrong answers, and a corrupted DataFrame you don't notice until it's in production. Master three tools — .loc, .iloc, and boolean masks — and selection becomes surgical.",
        what: "Data selection is the act of pulling a subset of a DataFrame: specific rows, specific columns, or the cells where a condition holds. pandas gives you label-based selection (.loc), position-based selection (.iloc), and condition-based selection (boolean masks).",
        why: "Every filter, every feature you engineer, every subset you feed a model starts with selection. Choosing the right tool keeps your code correct and readable; choosing the wrong one — especially chained indexing — introduces silent bugs.",
        whereUsed:
          "Filtering customers by segment, isolating a date range, grabbing feature columns for a model, or extracting the rows that failed a quality check — all of it is selection.",
        objectives: [
          "Select columns with [] and lists of column names",
          "Select rows and cells by label with .loc[]",
          "Select rows and cells by position with .iloc[]",
          "Filter rows with boolean masks and combine conditions with & and |",
          "Recognise and avoid the chained-indexing trap using single-call .loc",
        ],
        realWorldApps: [
          {
            company: "Netflix",
            headline: "Cohort filtering for A/B tests",
            detail:
              "Analysts select the rows where experiment_group == 'treatment' and region == 'US' with a single boolean mask, then compare watch-time against control — the selection step defines the whole experiment.",
          },
          {
            company: "Stripe",
            headline: "Isolating failed payments",
            detail:
              "A fraud team masks the transactions DataFrame for status == 'failed' and amount > 500, using .loc to pull just the columns they need for review, leaving the multi-million-row table untouched.",
          },
          {
            company: "Ola",
            headline: "Peak-hour trip slices",
            detail:
              "To study surge pricing, data scientists select trips between 18:00 and 21:00 with a mask on the hour column, then read out fare and distance columns with .loc for modelling.",
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
            "Column selection is the simplest form. df['col'] returns one column as a Series; df[['col1','col2']] returns those columns as a DataFrame. Passing a list is what keeps the result 2-dimensional.",
        },
        {
          type: "keypoint",
          title: "The two selectors, one sentence each",
          content:
            ".loc[rows, cols] selects by label — the index labels and column names. .iloc[rows, cols] selects by integer position — counting from zero, ignoring labels.",
        },
        {
          type: "code-note",
          code: `import pandas as pd
df = pd.DataFrame(
    {'name': ['Amara','Jamal','Priya','Wei'],
     'age':  [28, 34, 29, 42],
     'city': ['Lagos','Cairo','Delhi','Xian']},
    index=['a','b','c','d']
)

print(df.loc['b', 'name'])   # label row 'b', col 'name' -> Jamal
print(df.iloc[1, 0])         # position row 1, col 0     -> Jamal`,
          content:
            "Both land on Jamal, but by different routes: .loc uses the label 'b' and the name 'name'; .iloc uses positions 1 and 0. When the index isn't the default 0,1,2, only one of them will do what you mean.",
        },
        {
          type: "text",
          content:
            "Boolean masking is condition-based selection. A comparison on a column produces a boolean Series; passing that Series back into the DataFrame keeps only the True rows.",
        },
        {
          type: "code-note",
          code: `mask = df['age'] > 30            # boolean Series: b and d are True
older = df[mask]                # keep rows where mask is True
older_names = df.loc[df['age'] > 30, 'name']  # rows + one column`,
          content:
            "df[mask] filters rows. df.loc[mask, 'name'] filters rows and selects a column in one call — the preferred, unambiguous pattern.",
        },
        {
          type: "analogy",
          title: "Masks are a stencil",
          content:
            "A boolean mask is a stencil laid over your DataFrame: everywhere the stencil says True, the data shows through; everywhere it says False, it's blocked. The stencil has the same length as the column, one hole per row.",
        },
        {
          type: "warning",
          title: "Combine conditions with & and |, not and / or",
          content:
            "Python's and/or expect single True/False values, but a mask is a whole Series — so pandas raises 'The truth value of a Series is ambiguous.' Use the bitwise operators & (and), | (or), ~ (not), and wrap every condition in parentheses: (df['age'] > 30) & (df['city'] == 'Cairo'). The parentheses are mandatory because & binds tighter than >.",
        },
        {
          type: "warning",
          title: "The chained-indexing trap",
          content:
            "Writing df[df['age'] > 30]['name'] = 'X' chains two selections: pandas may operate on a temporary copy, so your assignment silently vanishes and you get SettingWithCopyWarning. Always assign through a single .loc call: df.loc[df['age'] > 30, 'name'] = 'X'. One set of brackets, one operation, guaranteed to write to the original.",
        },
        {
          type: "expandable",
          title: "Why is chained indexing unpredictable?",
          content:
            "df[mask] can return either a view (a window onto the original data) or a copy (independent data), and pandas can't always tell which in advance. If it's a copy, assigning to it changes nothing in the original — but no error is raised, only a warning. .loc[rows, cols] = value performs the selection and assignment as a single indexed operation, so pandas always targets the original DataFrame. This is why the rule 'select-then-assign in one .loc call' exists.",
        },
      ],
    },

    {
      id: "diagram",
      type: "interactive-diagram",
      tocLabel: "Visual Learning",
      visual: {
        kind: "comparison",
        title: "Three ways to select from a DataFrame",
        caption:
          "Click each selector to see what it takes, what it returns, and when to reach for it.",
        nodes: [
          { id: "bracket", label: "df['col']", sublabel: "column select", detail: "Square brackets with a name return a Series; with a list of names return a DataFrame. The everyday way to grab columns.", x: 20, y: 25, accent: false },
          { id: "loc", label: ".loc[rows, cols]", sublabel: "by label", detail: "Selects using index labels and column names. Accepts single labels, lists, slices (label-inclusive), and boolean masks. The safe choice for select-and-assign.", x: 50, y: 12, accent: true },
          { id: "iloc", label: ".iloc[rows, cols]", sublabel: "by position", detail: "Selects using integer positions from zero. Slices are end-exclusive like Python lists. Use when you mean 'the first N rows' regardless of labels.", x: 80, y: 25, accent: true },
          { id: "mask", label: "boolean mask", sublabel: "by condition", detail: "A True/False Series from a comparison. df[mask] keeps True rows. Combine with & | ~ and parentheses. Pair with .loc to also pick columns.", x: 35, y: 60, accent: true },
          { id: "chained", label: "chained indexing", sublabel: "df[m]['c'] = v", detail: "Two selections back to back. May hit a copy, so assignments silently fail with SettingWithCopyWarning. Avoid — use one .loc call.", x: 68, y: 62, accent: false },
          { id: "safe", label: "df.loc[m, 'c'] = v", sublabel: "the fix", detail: "Single-call selection and assignment. Always targets the original DataFrame. The canonical safe pattern.", x: 50, y: 88, accent: true },
        ],
        edges: [
          { from: "loc", to: "mask", label: "accepts" },
          { from: "iloc", to: "bracket", label: "vs" },
          { from: "chained", to: "safe", label: "replace with" },
          { from: "mask", to: "safe", label: "combine into" },
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
          title: "Select a single column",
          scenario: "From an employee table, you just need the list of names.",
          steps: [
            { code: "import pandas as pd\ndf = pd.DataFrame({'name': ['Amara','Jamal','Priya'], 'age': [28,34,29]})", explanation: "A two-column DataFrame with a default 0,1,2 index." },
            { code: "names = df['name']", explanation: "Single brackets with one column name return that column as a Series." },
            { code: "print(names.tolist())", explanation: ".tolist() turns the Series into a plain Python list for display." },
          ],
          output: "['Amara', 'Jamal', 'Priya']",
        },
        {
          difficulty: "Easy",
          title: "Label vs position on a custom index",
          scenario: "A DataFrame indexed by employee ID — you want row 'E2' and also the second row.",
          steps: [
            { code: "df = pd.DataFrame({'age': [28,34,29]}, index=['E1','E2','E3'])", explanation: "The index is now employee IDs, not 0,1,2. This is where .loc and .iloc diverge." },
            { code: "print(df.loc['E2', 'age'])", explanation: ".loc uses the label 'E2' — it returns 34 no matter where that row sits." },
            { code: "print(df.iloc[1]['age'])", explanation: ".iloc[1] is the second row by position, which happens to be E2 here — also 34. But .iloc doesn't know about labels." },
          ],
          output: "34\n34",
        },
        {
          difficulty: "Medium",
          title: "Filter rows with a boolean mask",
          scenario: "A store's product table — find products under $20 that are in stock.",
          steps: [
            { code: "df = pd.DataFrame({\n    'product': ['Pen','Mug','Lamp','Cable'],\n    'price':   [3, 12, 25, 8],\n    'in_stock':[True, True, False, True]\n})", explanation: "Four products with price and stock flag." },
            { code: "mask = (df['price'] < 20) & (df['in_stock'])", explanation: "Two conditions joined with &. Each is wrapped in parentheses. Pen, Mug, Cable are under 20; Lamp is out of stock, so only Pen, Mug, Cable qualify." },
            { code: "print(df.loc[mask, 'product'].tolist())", explanation: ".loc[mask, 'product'] returns the product column for matching rows, in one clean call." },
          ],
          output: "['Pen', 'Mug', 'Cable']",
        },
        {
          difficulty: "Hard",
          title: "Safe conditional assignment",
          scenario: "Apply a 10% loyalty discount to orders over $100 — and actually write it back to the DataFrame.",
          steps: [
            { code: "df = pd.DataFrame({'order': [1,2,3], 'total': [80.0, 150.0, 220.0]})", explanation: "Three orders. Orders 2 and 3 exceed $100." },
            { code: "df.loc[df['total'] > 100, 'total'] = df['total'] * 0.9", explanation: "A single .loc call selects the qualifying rows and the 'total' column, then assigns the discounted value. Because it's one indexed operation, it writes to the original — no chained-indexing trap." },
            { code: "print(df['total'].tolist())", explanation: "Order 1 stays 80; orders 2 and 3 drop to 135 and 198." },
          ],
          output: "[80.0, 135.0, 198.0]",
        },
        {
          difficulty: "Industry Example",
          title: "Segment extraction for a marketing model",
          scenario: "A data scientist at a fintech app must extract high-value active users — balance over $5,000 and last active within 30 days — pulling just the columns the churn model needs.",
          steps: [
            { code: "import pandas as pd\ndf = pd.DataFrame({\n    'user_id':      [101, 102, 103, 104],\n    'balance':      [8200, 300, 6100, 12000],\n    'days_since':   [5, 40, 12, 60],\n    'plan':         ['pro','basic','pro','pro']\n})", explanation: "A user table with balance, recency, and plan. The model needs a filtered, trimmed view." },
            { code: "active_hv = (df['balance'] > 5000) & (df['days_since'] <= 30)", explanation: "The segment definition as one mask: high balance AND recent activity. Users 101 and 103 qualify; 102 fails balance, 104 fails recency." },
            { code: "features = df.loc[active_hv, ['user_id', 'balance', 'plan']]", explanation: ".loc[mask, column_list] does both jobs at once: filters rows to the segment and keeps only the three feature columns." },
            { code: "print(features.reset_index(drop=True))", explanation: "reset_index(drop=True) gives the extracted frame a clean 0-based index for the model input." },
          ],
          output: "   user_id  balance plan\n0      101     8200  pro\n1      103     6100  pro",
        },
      ],
    },

    {
      id: "inline-practice",
      type: "inline-code",
      tocLabel: "Practice Coding",
      coding: {
        language: "python",
        filename: "selection_practice.py",
        instructions:
          "A logistics company tracks deliveries. Complete the selection tasks to surface the shipments that need attention, using safe, single-call patterns.",
        starterCode: `import pandas as pd

df = pd.DataFrame({
    'shipment': ['S1','S2','S3','S4','S5'],
    'weight_kg':[5, 22, 8, 30, 15],
    'express':  [True, False, True, True, False],
    'delayed':  [False, True, False, True, True],
})

# TODO 1: A boolean mask for shipments that are BOTH express AND delayed
urgent = ___

# TODO 2: The 'shipment' column for those urgent rows, as a list
urgent_ids = ___

# TODO 3: Set weight_kg to 0 for every delayed shipment (safe, single .loc call)
___

print("Urgent:", urgent_ids)
print("Weights:", df['weight_kg'].tolist())`,
        solutionCode: `import pandas as pd

df = pd.DataFrame({
    'shipment': ['S1','S2','S3','S4','S5'],
    'weight_kg':[5, 22, 8, 30, 15],
    'express':  [True, False, True, True, False],
    'delayed':  [False, True, False, True, True],
})

urgent = (df['express']) & (df['delayed'])
urgent_ids = df.loc[urgent, 'shipment'].tolist()
df.loc[df['delayed'], 'weight_kg'] = 0

print("Urgent:", urgent_ids)
print("Weights:", df['weight_kg'].tolist())`,
        expectedOutput: "Urgent: ['S4']\nWeights: [5, 0, 8, 0, 0]",
        hints: [
          "Task 1: combine the two boolean columns with & — and wrap each in parentheses.",
          "Task 2: use df.loc[urgent, 'shipment'] to select the column for matching rows, then .tolist().",
          "Task 3: assign through a single .loc call — df.loc[<mask>, 'weight_kg'] = 0 — never df[mask]['weight_kg'] = 0.",
          "urgent = (df['express']) & (df['delayed']); urgent_ids = df.loc[urgent, 'shipment'].tolist(); df.loc[df['delayed'], 'weight_kg'] = 0",
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
          id: "pda03_mcq_01",
          difficulty: "Easy",
          question: "Which expression returns a one-column DataFrame (not a Series)?",
          options: ["df['price']", "df[['price']]", "df.loc[:, 'price']", "df.price"],
          correctIndex: 1,
          explanation:
            "Passing a list of column names — even a list of one — keeps the result 2D, so df[['price']] is a DataFrame. The other three all return the column as a Series.",
        },
        {
          type: "mcq",
          id: "pda03_mcq_02",
          difficulty: "Easy",
          question: "What is the key difference between .loc and .iloc?",
          options: [
            ".loc selects by label; .iloc selects by integer position",
            ".loc is for rows; .iloc is for columns",
            ".loc returns copies; .iloc returns views",
            "They are interchangeable in all cases",
          ],
          correctIndex: 0,
          explanation:
            ".loc uses index labels and column names; .iloc uses integer positions. They only look interchangeable while the index is the default 0,1,2 range.",
        },
        {
          type: "mcq",
          id: "pda03_mcq_03",
          difficulty: "Medium",
          question: "Why does `df[(df['a'] > 1) and (df['b'] < 5)]` raise an error?",
          options: [
            "You must use .loc for masks",
            "Python's `and` can't evaluate a whole boolean Series — use `&`",
            "The parentheses are wrong",
            "Comparisons don't return Series",
          ],
          correctIndex: 1,
          explanation:
            "`and` needs a single True/False, but each condition is a Series, giving 'truth value is ambiguous'. The bitwise `&` operates element-wise across the Series. The parentheses here are actually correct.",
        },
        {
          type: "scenario",
          id: "pda03_sc_01",
          difficulty: "Medium",
          scenario:
            "A teammate writes `df[df['status'] == 'active']['score'] = 0` to zero out scores for active users. It runs, prints a SettingWithCopyWarning, and later they discover the scores never changed.",
          question: "What went wrong and how should it be written?",
          options: [
            "Nothing is wrong; rerun it and it will work",
            "Chained indexing assigned to a temporary copy — use df.loc[df['status'] == 'active', 'score'] = 0",
            "They should use .iloc instead of a mask",
            "They need to call df.copy() first, then chain",
          ],
          correctIndex: 1,
          explanation:
            "The chained df[mask]['score'] = 0 may target a copy, so the write is lost — exactly what the warning signals. A single .loc[mask, 'score'] = 0 call performs selection and assignment together on the original. .iloc doesn't help, and copying first would still write to the wrong object.",
        },
        {
          type: "coding",
          id: "pda03_code_01",
          difficulty: "Hard",
          prompt:
            "Given the DataFrame below, print the total revenue (price * qty summed) for orders from the 'EU' region only. Print a single number.\n\ndf = pd.DataFrame({'region':['EU','US','EU','APAC','EU'], 'price':[10,20,15,30,25], 'qty':[2,1,4,1,2]})",
          starterCode:
            "import pandas as pd\n\ndf = pd.DataFrame({'region':['EU','US','EU','APAC','EU'], 'price':[10,20,15,30,25], 'qty':[2,1,4,1,2]})\n\n# Your code here\n",
          solutionCode:
            "import pandas as pd\n\ndf = pd.DataFrame({'region':['EU','US','EU','APAC','EU'], 'price':[10,20,15,30,25], 'qty':[2,1,4,1,2]})\n\neu = df.loc[df['region'] == 'EU']\nrevenue = (eu['price'] * eu['qty']).sum()\nprint(revenue)",
          expectedOutput: "130",
          tests: [
            { name: "EU filter", description: "Only the three EU rows are included" },
            { name: "Revenue math", description: "10*2 + 15*4 + 25*2 = 20 + 60 + 50 = 130" },
          ],
        },
        {
          type: "mcq",
          id: "pda03_mcq_04",
          difficulty: "Hard",
          question: "For `df` with a default index, which selects the first 3 rows and the columns 'a' and 'b'?",
          options: [
            "df.iloc[:3][['a','b']]",
            "df.loc[:3, ['a','b']]",
            "df.loc[0:2, ['a','b']]",
            "Both B and C select the same rows",
          ],
          correctIndex: 3,
          explanation:
            "With a default 0,1,2 index, .loc label slicing is inclusive, so .loc[:3] and .loc[0:2] both include labels 0,1,2 — the first three rows — and select columns a,b. .iloc[:3][['a','b']] also works but chains two calls; B and C are the single-call equivalents and select identically.",
        },
      ],
    },

    {
      id: "interview-questions",
      type: "interview-questions",
      tocLabel: "Interview Prep",
      questions: [
        {
          question: "When would you use .loc versus .iloc?",
          answer:
            "I use .loc when I'm selecting by meaning — a specific index label, a column name, a date range, or a boolean mask. I use .iloc when I'm selecting by position — the first N rows, the last row, or a column by its integer order regardless of its name. The distinction matters most when the index isn't the default range: after filtering or sorting, .loc[0] looks for the label 0, which may no longer exist, while .iloc[0] always gives me the first row. As a rule I default to .loc for readability and only drop to .iloc when position is genuinely what I mean.",
        },
        {
          question: "What is the chained-indexing problem and how do you avoid it?",
          answer:
            "Chained indexing is when you select twice in a row, like df[df['x'] > 0]['y'] = 1. The first selection can return either a view or a copy of the data, and pandas can't reliably tell which, so the assignment might land on a throwaway copy and silently do nothing — you get a SettingWithCopyWarning but no error. I avoid it by collapsing selection and assignment into one .loc call: df.loc[df['x'] > 0, 'y'] = 1. That's a single indexed operation, so pandas always targets the original frame. The same rule applies to reads when I care about getting a stable, independent object — I take an explicit .copy() rather than relying on a chained slice.",
        },
        {
          question: "How do boolean masks work under the hood, and what are the performance implications on large DataFrames?",
          answer:
            "A boolean mask is a Series of True/False the same length as the DataFrame, produced by a vectorized comparison that runs in NumPy's C layer. When I pass it back with df[mask] or df.loc[mask], pandas uses it to build a new frame from the True positions. Because the comparison and the selection are both vectorized, masking millions of rows is fast — far faster than any Python-level loop. The costs to watch are memory and combination overhead: each mask allocates a full-length boolean array, so building many intermediate masks on a huge frame adds up, and combining them with & and | creates more temporaries. For very large data I lean on query() for readability, categorical dtypes to shrink comparisons, or chunked processing, but for the vast majority of work a straightforward boolean mask is both the clearest and the fastest option.",
        },
      ],
    },

    {
      id: "common-mistakes",
      type: "callout",
      variant: "warning",
      title: "Common Mistakes to Avoid",
      content:
        "1) Using `and`/`or` to combine masks instead of `&`/`|` — pandas raises 'truth value is ambiguous'. 2) Forgetting parentheses around each condition: `df['a'] > 1 & df['b'] < 5` misbinds because & has higher precedence than the comparisons. 3) Chained indexing for assignment — df[mask]['col'] = v may write to a copy; use df.loc[mask, 'col'] = v. 4) Reaching for .loc[0] after filtering and expecting the first row — the label 0 may be gone; use .iloc[0] for positional access. 5) Assuming .loc label slices are end-exclusive — unlike .iloc and Python lists, df.loc[0:2] includes label 2.",
    },

    {
      id: "ai-tutor",
      type: "callout",
      variant: "tip",
      title: "Ask the AI Tutor",
      content:
        "Try these prompts in the AI Tutor panel: • 'ELI5: what's the difference between .loc and .iloc?' • 'Show me the chained-indexing bug and walk me through the fix.' • 'Quiz me on combining boolean conditions with & and |.' • 'Explain why df.loc[0:2] includes label 2 but df.iloc[0:2] stops at 1.' • 'Interview mode: ask me when I'd choose a boolean mask over .loc.'",
    },

    {
      id: "glossary",
      type: "callout",
      variant: "info",
      title: "Glossary",
      content:
        ".loc[] — label-based selection of rows and columns; slices are inclusive. .iloc[] — integer-position selection; slices are end-exclusive. Boolean mask — a True/False Series from a comparison, used to filter rows. & | ~ — bitwise and/or/not for combining masks element-wise. Chained indexing — two back-to-back selections that may hit a copy, breaking assignment. SettingWithCopyWarning — pandas' warning that an assignment may not reach the original DataFrame. View — a window onto the original data. Copy — an independent duplicate. reset_index(drop=True) — replace the current index with a fresh 0-based one.",
    },

    {
      id: "resources",
      type: "callout",
      variant: "info",
      title: "Recommended Resources",
      content:
        "• Docs: 'Indexing and selecting data' in the pandas User Guide — the definitive reference for .loc, .iloc, and masks, including the returning-a-view-versus-copy rules. • Read: the pandas 'Returning a view versus a copy' section for the full chained-indexing story. • Practice: take any DataFrame, write the same selection three ways (bracket, .loc, mask) and confirm they match; then deliberately trigger and fix a SettingWithCopyWarning. • Next in DSM: you can pull out any subset — next, in Adding & Modifying Columns, you'll write new data back, building derived columns with fast vectorized operations.",
    },

    {
      id: "recap",
      type: "recap",
      tocLabel: "Recap",
      content:
        "✓ df['col'] returns a Series; df[['col']] (a list) returns a DataFrame.\n✓ .loc selects by label; .iloc selects by integer position — they diverge once the index isn't 0,1,2.\n✓ Boolean masks filter rows; pair them with .loc to also choose columns.\n✓ Combine conditions with & and |, wrapping each in parentheses.\n✓ Avoid chained indexing for assignment — use one df.loc[mask, 'col'] = value call.\n✓ .loc label slices are inclusive; .iloc position slices are end-exclusive.\n\nNext up: Adding & Modifying Columns. You can select any slice of a DataFrame — next you'll create and update columns, turning raw fields into the derived features every analysis and model depends on.",
    },
  ],
};
