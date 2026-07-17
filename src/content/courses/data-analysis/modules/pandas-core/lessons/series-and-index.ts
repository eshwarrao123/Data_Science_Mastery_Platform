import type { Lesson } from "@/lib/curriculum/types";

export const seriesAndIndex: Lesson = {
  meta: {
    id: "data-analysis.pandas-core.series-and-index",
    slug: "series-and-index",
    title: "Series & Index",
    description:
      "Meet the pandas Series — the 1D building block of every DataFrame — and learn how its Index quietly drives alignment, lookups, and half of pandas' surprising behaviour.",
    estimatedTime: "30 mins",
    difficulty: "Beginner",
    xpReward: 60,
    prerequisites: ["data-analysis.pandas-core.pandas-dataframes"],
    masteryThreshold: 80,
  },

  blocks: [
    {
      id: "intro",
      type: "lesson-intro",
      tocLabel: "Introduction",
      intro: {
        hook: "You already used Series without knowing it — every time you wrote df['price'], pandas handed you one. Today you meet the Series head-on, and you learn the one idea that explains why two columns sometimes add up wrong: the Index. Get this, and pandas stops surprising you.",
        what: "A pandas Series is a 1-dimensional labeled array: a sequence of values paired with an Index of labels. A DataFrame is really just a set of Series that share one common Index.",
        why: "The Index is what makes pandas different from a plain list or NumPy array. It powers label-based lookup, automatic alignment when you combine data, and the join keys you'll rely on later. Misunderstand it, and you get silent NaNs and mismatched rows.",
        whereUsed:
          "Every column you select, every value_counts() result, every groupby aggregation, and every merge key is a Series with an Index. Alignment by Index runs underneath almost every pandas operation.",
        objectives: [
          "Create a Series from a list and from a dictionary",
          "Explain the difference between a Series' values and its Index",
          "Look up elements by label and by position",
          "Predict how pandas aligns two Series by their Index during arithmetic",
          "Inspect and change a Series' dtype",
        ],
        realWorldApps: [
          {
            company: "Spotify",
            headline: "Per-user play counts",
            detail:
              "A Series indexed by track_id maps each song to its play count. Because the Index is the track_id, Spotify can add this month's counts to last month's and pandas aligns each track automatically — even if the two months contain different songs.",
          },
          {
            company: "Robinhood",
            headline: "Time-indexed prices",
            detail:
              "A stock's closing prices live in a Series indexed by date. The date Index lets analysts select a range, compute daily returns, and align two tickers that traded on different days without manual row matching.",
          },
          {
            company: "Zomato",
            headline: "Restaurant rating lookup",
            detail:
              "Ratings stored in a Series indexed by restaurant name allow instant label-based lookup — series['Bombay Canteen'] — instead of scanning a list to find the right row.",
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
            "A Series has two parts you can inspect separately: the values (the data itself, a NumPy array underneath) and the index (the labels attached to each value). When you print a Series, the left column is the Index and the right column is the values.",
        },
        {
          type: "analogy",
          title: "A Series is a coat-check rack",
          content:
            "Each hook has a numbered tag (the Index label) and holds one coat (the value). You don't count along the rack to find your coat — you hand over your tag and get the exact hook. A Series works the same way: the Index label retrieves the value directly, no counting required.",
        },
        {
          type: "code-note",
          code: `import pandas as pd

# From a list — pandas builds a default 0,1,2 index
sales = pd.Series([250, 180, 320], name='daily_sales')
print(sales)

# From a dict — keys become the index labels
prices = pd.Series({'apple': 0.5, 'banana': 0.3, 'cherry': 2.0})
print(prices)`,
          content:
            "With a list, pandas assigns a default integer Index (0, 1, 2). With a dictionary, the keys become the Index labels and the values become the data. The optional name becomes the Series' name — which becomes the column header when the Series joins a DataFrame.",
        },
        {
          type: "keypoint",
          title: "values vs index",
          content:
            "series.values → the raw NumPy array of data. series.index → the labels. series.dtype → the type of the values. Keeping these three separate in your head is the whole lesson.",
        },
        {
          type: "text",
          content:
            "Label-based lookup uses the Index. If prices has 'banana' in its Index, prices['banana'] returns 0.3. Position-based lookup ignores labels and counts from zero: prices.iloc[1] returns the second value whatever its label.",
        },
        {
          type: "code-note",
          code: `prices = pd.Series({'apple': 0.5, 'banana': 0.3, 'cherry': 2.0})

print(prices['banana'])   # label lookup -> 0.3
print(prices.iloc[1])     # position lookup -> 0.3
print(prices.index)       # Index(['apple','banana','cherry'], dtype='object')`,
          content:
            "Here label and position happen to agree, but they are different operations. The moment you sort, filter, or reindex, positions shift while labels stick to their values.",
        },
        {
          type: "text",
          content:
            "The most important behaviour to internalise is alignment. When you combine two Series with +, -, *, or /, pandas matches them by Index label, not by position. Labels present in only one Series produce NaN in the result.",
        },
        {
          type: "warning",
          title: "Index alignment produces NaN, not an error",
          content:
            "If you add a Series indexed ['a','b','c'] to one indexed ['b','c','d'], you get labels a, b, c, d — and a and d become NaN because each appears in only one Series. pandas will not warn you. Always check that two Series share the same Index before arithmetic, or reset the index if you truly want positional math.",
        },
        {
          type: "expandable",
          title: "Why does a DataFrame column keep its row labels?",
          content:
            "Because a DataFrame is a dictionary of Series that all share the DataFrame's Index. When you pull out df['price'], you get a Series carrying the DataFrame's row Index with it. That's why filtering a DataFrame and then selecting a column preserves the original row labels — and why .reset_index(drop=True) is sometimes needed to get clean 0-based positions back.",
        },
      ],
    },

    {
      id: "diagram",
      type: "interactive-diagram",
      tocLabel: "Visual Learning",
      visual: {
        kind: "architecture",
        title: "Anatomy of a Series",
        caption:
          "Click each part to see how the Index, values, and dtype combine into a Series — and scale up into a DataFrame.",
        nodes: [
          { id: "series", label: "Series", sublabel: "1D labeled array", detail: "The pairing of an Index with a values array. Created with pd.Series(). Every DataFrame column is one of these.", x: 45, y: 8, accent: true },
          { id: "index", label: "Index", sublabel: "series.index", detail: "The labels — integers by default, but can be strings, dates, or any hashable. Drives label lookup and alignment. Shared across all columns of a DataFrame.", x: 15, y: 40, accent: true },
          { id: "values", label: "values", sublabel: "series.values", detail: "The data itself, stored as a NumPy ndarray. This is where the speed comes from — operations run in compiled C.", x: 45, y: 40, accent: false },
          { id: "dtype", label: "dtype", sublabel: "int64 / float64 / object", detail: "The type of the values. A Series is homogeneous: one dtype for the whole thing. Mixed content falls back to object.", x: 75, y: 40, accent: false },
          { id: "name", label: "name", sublabel: "series.name", detail: "An optional label for the whole Series. Becomes the column header when the Series is placed into a DataFrame.", x: 30, y: 70, accent: false },
          { id: "align", label: "Alignment", sublabel: "match by label", detail: "When two Series combine, pandas lines them up by Index label. Labels in only one Series yield NaN. This is the root of most 'why is this NaN?' bugs.", x: 62, y: 70, accent: true },
          { id: "dataframe", label: "DataFrame", sublabel: "dict of Series", detail: "Many Series sharing one Index, side by side. Selecting a column returns you to a single Series.", x: 45, y: 92, accent: false },
        ],
        edges: [
          { from: "series", to: "index" },
          { from: "series", to: "values" },
          { from: "series", to: "dtype" },
          { from: "series", to: "name" },
          { from: "index", to: "align", label: "drives" },
          { from: "series", to: "dataframe", label: "stack many" },
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
          title: "Create a Series and read its parts",
          scenario: "You're tracking three days of website signups and want the values and labels separately.",
          steps: [
            { code: "import pandas as pd\nsignups = pd.Series([42, 58, 37])", explanation: "A Series from a list. pandas attaches a default integer Index: 0, 1, 2. The values are 42, 58, 37." },
            { code: "print(signups.values)", explanation: ".values returns the underlying NumPy array — just the numbers, no labels." },
            { code: "print(list(signups.index))", explanation: ".index holds the labels. Wrapping in list() shows them plainly: [0, 1, 2]." },
          ],
          output: "[42 58 37]\n[0, 1, 2]",
        },
        {
          difficulty: "Easy",
          title: "Label lookup with a custom index",
          scenario: "A grocery app stores unit prices keyed by product name for instant lookup.",
          steps: [
            { code: "prices = pd.Series({'milk': 1.20, 'bread': 0.90, 'eggs': 2.50})", explanation: "Building from a dict makes the keys the Index labels. Now each price is addressable by product name." },
            { code: "print(prices['bread'])", explanation: "Label lookup goes straight to the value tagged 'bread': 0.9. No scanning, no position math." },
            { code: "print(prices[['milk', 'eggs']])", explanation: "Passing a list of labels returns a smaller Series with just those two entries, labels preserved." },
          ],
          output: "0.9\nmilk    1.2\neggs    2.5\ndtype: float64",
        },
        {
          difficulty: "Medium",
          title: "Index alignment during arithmetic",
          scenario: "You're combining Q1 and Q2 revenue per region, but the two quarters don't cover the exact same regions.",
          steps: [
            { code: "q1 = pd.Series({'North': 100, 'South': 80, 'East': 60})\nq2 = pd.Series({'South': 90, 'East': 70, 'West': 50})", explanation: "Q1 has North/South/East; Q2 has South/East/West. The Index labels only partially overlap." },
            { code: "total = q1 + q2", explanation: "pandas aligns by label. South and East appear in both, so they add. North is only in Q1, West only in Q2 — each becomes NaN because the other side is missing." },
            { code: "print(total)", explanation: "The result carries the union of both indexes. NaN flags the regions that weren't in both quarters." },
          ],
          output: "East     130.0\nNorth      NaN\nSouth    170.0\nWest       NaN\ndtype: float64",
        },
        {
          difficulty: "Hard",
          title: "Fixing alignment gaps with fill_value",
          scenario: "For the same Q1/Q2 revenue, you want a true total that treats a missing quarter as zero, not NaN.",
          steps: [
            { code: "q1 = pd.Series({'North': 100, 'South': 80, 'East': 60})\nq2 = pd.Series({'South': 90, 'East': 70, 'West': 50})", explanation: "Same partially-overlapping Series as before." },
            { code: "total = q1.add(q2, fill_value=0)", explanation: "The .add() method takes fill_value. When a label is missing on one side, pandas substitutes 0 before adding instead of producing NaN. North stays 100, West stays 50." },
            { code: "print(total.astype(int))", explanation: "With no NaN left, the Series can be a clean integer dtype. .astype(int) converts the floats back to ints for a tidy report." },
          ],
          output: "East     130\nNorth    100\nSouth    170\nWest      50\ndtype: int64",
        },
        {
          difficulty: "Industry Example",
          title: "Time-indexed returns at a trading desk",
          scenario: "A junior analyst at a hedge fund is handed a Series of daily closing prices indexed by date and asked to compute daily percentage returns before the morning meeting.",
          steps: [
            { code: "import pandas as pd\nprices = pd.Series(\n    [101.0, 103.0, 102.0, 106.0],\n    index=pd.to_datetime(['2024-03-01','2024-03-02','2024-03-03','2024-03-04']),\n    name='close'\n)", explanation: "A date Index turns this into a time series. pd.to_datetime parses the strings into real datetime labels, enabling date-aware operations." },
            { code: "returns = prices.pct_change()", explanation: ".pct_change() compares each value to the one before it in Index order: (today − yesterday) / yesterday. The first date has no prior day, so it's NaN." },
            { code: "print(returns.round(4))", explanation: "Rounding to 4 decimals gives readable returns. The date Index stays attached, so every return is labelled with its day." },
          ],
          output: "2024-03-01       NaN\n2024-03-02    0.0198\n2024-03-03   -0.0097\n2024-03-04    0.0392\nName: close, dtype: float64",
        },
      ],
    },

    {
      id: "inline-practice",
      type: "inline-code",
      tocLabel: "Practice Coding",
      coding: {
        language: "python",
        filename: "series_practice.py",
        instructions:
          "A subscription business tracks active subscribers per plan. Two months of counts are given as Series indexed by plan name. Complete the tasks so the summary prints correctly.",
        starterCode: `import pandas as pd

jan = pd.Series({'basic': 1200, 'pro': 800, 'team': 300})
feb = pd.Series({'basic': 1250, 'pro': 850, 'enterprise': 120})

# TODO 1: Look up the number of 'pro' subscribers in February
pro_feb = ___

# TODO 2: Total subscribers per plan across both months,
#         treating a plan missing in one month as 0
total = ___

# TODO 3: The plan with the most subscribers in February
top_plan = ___

print(f"Pro in Feb: {pro_feb}")
print(f"Team total: {int(total['team'])}")
print(f"Top Feb plan: {top_plan}")`,
        solutionCode: `import pandas as pd

jan = pd.Series({'basic': 1200, 'pro': 800, 'team': 300})
feb = pd.Series({'basic': 1250, 'pro': 850, 'enterprise': 120})

pro_feb = feb['pro']
total = jan.add(feb, fill_value=0)
top_plan = feb.idxmax()

print(f"Pro in Feb: {pro_feb}")
print(f"Team total: {int(total['team'])}")
print(f"Top Feb plan: {top_plan}")`,
        expectedOutput: "Pro in Feb: 850\nTeam total: 300\nTop Feb plan: basic",
        hints: [
          "Task 1 is a plain label lookup — index the February Series with the plan name in square brackets.",
          "Task 2 must not produce NaN for plans missing in one month. Use the .add() method with fill_value=0 instead of the + operator.",
          "Task 3 asks for the label of the maximum value. A Series has a method that returns the index label of its max — think idxmax().",
          "pro_feb = feb['pro']; total = jan.add(feb, fill_value=0); top_plan = feb.idxmax()",
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
          id: "pda02_mcq_01",
          difficulty: "Easy",
          question: "What are the two components of a pandas Series?",
          options: [
            "Rows and columns",
            "An Index (labels) and values (the data)",
            "Keys and a dtype",
            "A name and a shape",
          ],
          correctIndex: 1,
          explanation:
            "A Series pairs an Index of labels with an array of values. Rows/columns describe a 2D DataFrame; keys/dtype and name/shape are attributes, not the two structural parts.",
        },
        {
          type: "mcq",
          id: "pda02_mcq_02",
          difficulty: "Easy",
          question: "You build `s = pd.Series({'a': 1, 'b': 2})`. What does `s['b']` return?",
          options: ["1", "2", "The second row as a DataFrame", "A KeyError"],
          correctIndex: 1,
          explanation:
            "The dict keys became the Index, so 'b' is a valid label pointing at 2. It is label lookup, not position; there is no KeyError because 'b' exists.",
        },
        {
          type: "mcq",
          id: "pda02_mcq_03",
          difficulty: "Medium",
          question: "Adding `pd.Series({'x':1,'y':2})` to `pd.Series({'y':3,'z':4})` produces which result for label `x`?",
          options: ["1", "4", "NaN", "0"],
          correctIndex: 2,
          explanation:
            "pandas aligns by label. 'x' exists only in the first Series, so there is nothing to add on the other side and the result is NaN. It would be 0 only if you used .add(..., fill_value=0).",
        },
        {
          type: "scenario",
          id: "pda02_sc_01",
          difficulty: "Medium",
          scenario:
            "You have two Series of monthly costs from different systems. They cover mostly the same cost centres but each has a few the other lacks. You add them with + and get several NaN values in the total, which then breaks a downstream sum.",
          question: "What is the correct fix?",
          options: [
            "Sort both Series before adding",
            "Use s1.add(s2, fill_value=0) so a missing label counts as zero",
            "Convert both Series to lists and add element by element",
            "Reset both indexes to 0,1,2 and add positionally",
          ],
          correctIndex: 1,
          explanation:
            "fill_value=0 substitutes zero where a label is missing on one side, eliminating the NaNs while keeping correct label alignment. Sorting doesn't add missing labels. Converting to lists or resetting to positional indexes would misalign cost centres that aren't in the same order.",
        },
        {
          type: "coding",
          id: "pda02_code_01",
          difficulty: "Hard",
          prompt:
            "You are given a Series of product ratings indexed by product name. Print the name of the highest-rated product and its rating, formatted as 'name: rating'.\n\nratings = pd.Series({'Echo': 4.2, 'Kindle': 4.6, 'FireTV': 4.1, 'Ring': 4.4})",
          starterCode:
            "import pandas as pd\n\nratings = pd.Series({'Echo': 4.2, 'Kindle': 4.6, 'FireTV': 4.1, 'Ring': 4.4})\n\n# Your code here\n",
          solutionCode:
            "import pandas as pd\n\nratings = pd.Series({'Echo': 4.2, 'Kindle': 4.6, 'FireTV': 4.1, 'Ring': 4.4})\n\nbest = ratings.idxmax()\nprint(f\"{best}: {ratings[best]}\")",
          expectedOutput: "Kindle: 4.6",
          tests: [
            { name: "Correct product", description: "idxmax() returns 'Kindle', the label of the max rating 4.6" },
            { name: "Format", description: "Output is exactly 'Kindle: 4.6'" },
          ],
        },
        {
          type: "mcq",
          id: "pda02_mcq_04",
          difficulty: "Hard",
          question: "After `s = pd.Series([10,20,30], index=['a','b','c'])`, which pair of expressions both return 20?",
          options: [
            "s['b'] and s.iloc[1]",
            "s['b'] and s.iloc[2]",
            "s[1] and s.loc[1]",
            "s.loc['b'] and s.iloc['b']",
          ],
          correctIndex: 0,
          explanation:
            "s['b'] is label lookup and s.iloc[1] is position lookup — both land on 20. s.iloc[2] is 30. s.loc[1] fails because 1 isn't a label. s.iloc['b'] is invalid because iloc takes integers, not labels.",
        },
      ],
    },

    {
      id: "interview-questions",
      type: "interview-questions",
      tocLabel: "Interview Prep",
      questions: [
        {
          question: "What is a pandas Series, and how does it differ from a Python list?",
          answer:
            "A Series is a 1-dimensional labeled array: values paired with an Index. Compared to a Python list, it adds three things. First, an Index, so I can look values up by meaningful labels instead of only by position. Second, a single dtype and a NumPy-backed store, so vectorized math runs in fast compiled code. Third, automatic alignment, so when I combine two Series pandas matches them by label. A list has none of that — it's just an ordered sequence I have to index by integer and loop over in Python.",
        },
        {
          question: "Explain index alignment and give an example of a bug it can cause.",
          answer:
            "When you do arithmetic on two Series, pandas lines them up by Index label rather than by position, and any label present in only one Series becomes NaN in the result. This is usually helpful — it means I can add this month's and last month's metrics per customer without manually matching rows. But it bites when I assume positional behaviour. For example, if I compute df['a'] - other_series expecting element-by-element subtraction, but other_series has a different or reordered index, I get NaNs and shifted values instead of an error. The fix is to make the indexes match deliberately — reset_index, reindex, or use .values to force positional math when that's what I actually want.",
        },
        {
          question: "How does a Series relate to a DataFrame internally, and why does that matter for performance and memory?",
          answer:
            "A DataFrame is essentially an ordered collection of Series that share a single row Index, with the columns typically stored in a block manager that groups same-dtype columns into contiguous 2D arrays. That shared Index is why selecting a column is cheap — it's a view onto existing data, not a copy — and why alignment is consistent across every column. For performance it means operations stay vectorized as long as I work column-wise on homogeneous dtypes; the moment a column is object dtype or I iterate rows, I drop out of the fast C path. For memory it means dtype choice matters a lot: downcasting a float64 column to float32, or converting a low-cardinality string column to category, can cut a Series' footprint dramatically, and because each column is its own Series I can optimise them independently.",
        },
      ],
    },

    {
      id: "common-mistakes",
      type: "callout",
      variant: "warning",
      title: "Common Mistakes to Avoid",
      content:
        "1) Assuming Series arithmetic is positional — it aligns by Index label, so mismatched indexes give NaN, not element-by-element results. 2) Confusing s['b'] (label) with s.iloc[1] (position); they agree only while the index is the default range. 3) Forgetting that a filtered DataFrame's column keeps the original row labels — use .reset_index(drop=True) when you need clean 0-based positions. 4) Using the + operator when you need missing labels treated as zero; reach for s1.add(s2, fill_value=0) instead. 5) Expecting a mixed-type Series to be numeric — one string value forces the whole Series to object dtype and breaks arithmetic.",
    },

    {
      id: "ai-tutor",
      type: "callout",
      variant: "tip",
      title: "Ask the AI Tutor",
      content:
        "Try these prompts in the AI Tutor panel: • 'ELI5: what is a Series Index and why does it matter?' • 'Show me a bug caused by index alignment and how to fix it.' • 'Quiz me on label lookup versus positional lookup.' • 'Explain fill_value in Series.add with a fresh example.' • 'Interview mode: ask me to explain how a Series relates to a DataFrame.'",
    },

    {
      id: "glossary",
      type: "callout",
      variant: "info",
      title: "Glossary",
      content:
        "Series — a 1D labeled array of values plus an Index. Index — the labels attached to a Series' values; drives lookup and alignment. values — the underlying NumPy array of data. dtype — the single data type of a Series' values. name — an optional label for the whole Series; becomes a column header in a DataFrame. Alignment — pandas matching two Series by Index label during operations. fill_value — an argument to methods like .add() that substitutes a value where a label is missing. pct_change() — element-over-previous percentage change in Index order. idxmax() — returns the Index label of the maximum value.",
    },

    {
      id: "resources",
      type: "callout",
      variant: "info",
      title: "Recommended Resources",
      content:
        "• Docs: the pandas 'Intro to data structures' guide — the official Series section, straight from the source. • Read: 'Index objects' in the pandas API reference to see everything an Index can do. • Practice: build two Series with partly overlapping string indexes, add them with + and with .add(fill_value=0), and compare the results until alignment feels predictable. • Next in DSM: you can address values by label — next, in Data Selection, you'll wield .loc, .iloc, and boolean masks to pull exactly the rows and columns you want from a full DataFrame.",
    },

    {
      id: "recap",
      type: "recap",
      tocLabel: "Recap",
      content:
        "✓ A Series is a 1D labeled array: values paired with an Index.\n✓ series.values, series.index, and series.dtype are three separate things worth inspecting.\n✓ Label lookup (s['b']) uses the Index; positional lookup (s.iloc[1]) counts from zero.\n✓ Series arithmetic aligns by Index label — labels in only one Series become NaN.\n✓ Use s1.add(s2, fill_value=0) to treat a missing label as zero instead of NaN.\n✓ A DataFrame is a set of Series sharing one Index, which is why columns keep their row labels.\n\nNext up: Data Selection: loc, iloc & Boolean Masking. You can address a single Series by label — next you'll select any rows and columns from a full DataFrame with precision, and sidestep the chained-indexing trap that quietly corrupts data.",
    },
  ],
};
