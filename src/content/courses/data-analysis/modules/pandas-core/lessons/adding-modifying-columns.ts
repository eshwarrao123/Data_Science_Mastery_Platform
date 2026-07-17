import type { Lesson } from "@/lib/curriculum/types";

export const addingModifyingColumns: Lesson = {
  meta: {
    id: "data-analysis.pandas-core.adding-modifying-columns",
    slug: "adding-modifying-columns",
    title: "Adding & Modifying Columns",
    description:
      "Create derived columns and update existing ones with fast vectorized operations, conditional logic, and assign() — the core of feature engineering.",
    estimatedTime: "30 mins",
    difficulty: "Beginner",
    xpReward: 60,
    prerequisites: ["data-analysis.pandas-core.data-selection"],
    masteryThreshold: 80,
  },

  blocks: [
    {
      id: "intro",
      type: "lesson-intro",
      tocLabel: "Introduction",
      intro: {
        hook: "Raw data rarely holds the number you actually want. Revenue isn't in the table — but price and quantity are. Profit margin isn't there — but cost and revenue are. Building the columns you need from the ones you have is feature engineering, and it's where analysis turns into insight. Let's build.",
        what: "Adding a column means assigning a new named field to a DataFrame; modifying means overwriting an existing one. Both usually come from vectorized operations on existing columns — arithmetic, conditional logic, or transformations applied to a whole column at once.",
        why: "Models and reports are only as good as their columns. A well-chosen derived column — margin, days-since-signup, price-per-unit — can carry more signal than a dozen raw fields. Doing it vectorized keeps it fast on millions of rows.",
        whereUsed:
          "Every feature-engineering step in an ML pipeline, every KPI in a dashboard, every ratio in a financial report starts as a new DataFrame column.",
        objectives: [
          "Add a new column by assigning to df['new_col']",
          "Build derived columns from vectorized arithmetic on existing columns",
          "Create conditional columns with np.where and pd.cut",
          "Chain column creation immutably with df.assign()",
          "Rename, reorder, and drop columns cleanly",
        ],
        realWorldApps: [
          {
            company: "Amazon",
            headline: "Margin per order",
            detail:
              "An analytics team adds a margin column as (price − cost) / price across the entire orders table in one vectorized line, then ranks categories by median margin to guide pricing.",
          },
          {
            company: "Duolingo",
            headline: "Engagement buckets",
            detail:
              "User rows get a derived 'engagement_tier' column via pd.cut on daily active minutes, splitting learners into casual, regular, and power segments for targeted notifications.",
          },
          {
            company: "Flipkart",
            headline: "Free-shipping flag",
            detail:
              "A boolean 'free_shipping' column is created with np.where(order_total >= 500, True, False), driving checkout logic and A/B tests on the threshold.",
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
            "The simplest way to add a column is to assign to a new name: df['new'] = <something>. If the name exists, you overwrite it; if not, pandas appends it. The right-hand side can be a scalar (broadcast to every row) or a Series aligned by index.",
        },
        {
          type: "code-note",
          code: `import pandas as pd
df = pd.DataFrame({'price': [10.0, 20.0, 30.0], 'qty': [2, 1, 5]})

df['revenue'] = df['price'] * df['qty']   # vectorized, row by row
df['currency'] = 'USD'                     # scalar broadcast to all rows
print(df)`,
          content:
            "df['price'] * df['qty'] multiplies the two columns element-wise in compiled code — no loop. Assigning the string 'USD' fills every row with the same value. Both create new columns in place.",
        },
        {
          type: "keypoint",
          title: "Vectorize first, loop never",
          content:
            "Any column you can express as arithmetic or a built-in operation on whole columns should be. df['a'] * df['b'] runs hundreds of times faster than looping rows with iterrows(). Reach for a Python loop only when nothing vectorized exists — and that's rare.",
        },
        {
          type: "text",
          content:
            "For conditional columns — a value that depends on a test — np.where(condition, value_if_true, value_if_false) is the vectorized workhorse. For splitting a numeric column into labelled ranges, pd.cut assigns each value to a bin.",
        },
        {
          type: "code-note",
          code: `import numpy as np
df['tier'] = np.where(df['revenue'] >= 50, 'high', 'low')

df['band'] = pd.cut(df['revenue'],
                    bins=[0, 30, 60, 200],
                    labels=['S', 'M', 'L'])`,
          content:
            "np.where picks 'high' where revenue ≥ 50, else 'low', for every row at once. pd.cut slices revenue into three bands by the bin edges and labels each row S, M, or L. Both are vectorized.",
        },
        {
          type: "analogy",
          title: "assign() is a recipe card",
          content:
            "df.assign(margin=...) is like writing a new step on a recipe card and handing back a fresh card, rather than scribbling on the original. It returns a new DataFrame with the column added, leaving the input untouched — ideal for method chains where you don't want to mutate as you go.",
        },
        {
          type: "code-note",
          code: `result = (df
    .assign(revenue=df['price'] * df['qty'])
    .assign(margin=lambda d: d['revenue'] * 0.2)
)`,
          content:
            "assign() returns a new DataFrame, so you can chain steps. Using a lambda (lambda d: ...) lets a later assign reference a column an earlier assign just created — d is the DataFrame as it exists at that point in the chain.",
        },
        {
          type: "warning",
          title: "Assignment mutates in place; assign() does not",
          content:
            "df['x'] = ... changes df immediately and permanently. df.assign(x=...) returns a new DataFrame and leaves df unchanged — if you forget to capture the result, your column vanishes. Pick deliberately: in-place bracket assignment for quick mutation, assign() for immutable chains.",
        },
        {
          type: "expandable",
          title: "How do I rename, reorder, and drop columns?",
          content:
            "Rename with df.rename(columns={'old': 'new'}). Reorder by selecting in the order you want: df = df[['b', 'a', 'c']]. Drop with df.drop(columns=['x']). All three return a new DataFrame by default (add inplace=True to mutate, though returning and reassigning is the clearer style). Renaming before a merge or export is common — clean, consistent column names prevent bugs downstream.",
        },
      ],
    },

    {
      id: "diagram",
      type: "interactive-diagram",
      tocLabel: "Visual Learning",
      visual: {
        kind: "flow",
        title: "Ways to create and change columns",
        caption:
          "Click each method to see what it does and when to reach for it.",
        nodes: [
          { id: "bracket", label: "df['new'] = ...", sublabel: "in-place add/overwrite", detail: "Assigns a Series or scalar to a column name. Mutates df immediately. The default for quick, direct column creation.", x: 20, y: 20, accent: true },
          { id: "arith", label: "column arithmetic", sublabel: "df['a'] * df['b']", detail: "Vectorized math across columns, computed in compiled C. The fast, idiomatic way to derive numeric columns.", x: 50, y: 12, accent: true },
          { id: "where", label: "np.where(cond, a, b)", sublabel: "conditional column", detail: "Element-wise if/else across the whole column. Returns a for True rows, b for False. Vectorized alternative to row loops.", x: 80, y: 20, accent: false },
          { id: "cut", label: "pd.cut(col, bins)", sublabel: "binning", detail: "Splits a numeric column into labelled ranges. Turns continuous values into categorical bands for segmentation.", x: 30, y: 55, accent: false },
          { id: "assign", label: "df.assign(x=...)", sublabel: "immutable add", detail: "Returns a NEW DataFrame with the column added. Great for method chains; a lambda can reference columns added earlier in the same chain.", x: 65, y: 55, accent: true },
          { id: "manage", label: "rename / drop / reorder", sublabel: "column hygiene", detail: "rename(columns=...), drop(columns=...), and reselecting in order keep the schema clean before merges and exports.", x: 50, y: 88, accent: false },
        ],
        edges: [
          { from: "bracket", to: "arith", label: "RHS is" },
          { from: "bracket", to: "where", label: "or" },
          { from: "where", to: "cut", label: "or bin with" },
          { from: "assign", to: "bracket", label: "immutable form of" },
          { from: "assign", to: "manage", label: "then tidy" },
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
          title: "Add a constant column",
          scenario: "You're tagging every row of an export with its source system.",
          steps: [
            { code: "import pandas as pd\ndf = pd.DataFrame({'id': [1, 2, 3]})", explanation: "A one-column DataFrame with three rows." },
            { code: "df['source'] = 'crm'", explanation: "Assigning a scalar broadcasts it: every row gets 'crm' in a new 'source' column." },
            { code: "print(df)", explanation: "The DataFrame now has two columns, source filled identically." },
          ],
          output: "   id source\n0   1    crm\n1   2    crm\n2   3    crm",
        },
        {
          difficulty: "Easy",
          title: "Derive revenue from price and quantity",
          scenario: "An orders table has price and quantity; you need revenue per order.",
          steps: [
            { code: "df = pd.DataFrame({'price': [9.99, 4.50, 20.0], 'qty': [3, 10, 1]})", explanation: "Three orders with price and quantity." },
            { code: "df['revenue'] = df['price'] * df['qty']", explanation: "Element-wise multiplication builds revenue for all rows at once — no loop." },
            { code: "print(df['revenue'].tolist())", explanation: "9.99*3=29.97, 4.50*10=45.0, 20.0*1=20.0." },
          ],
          output: "[29.97, 45.0, 20.0]",
        },
        {
          difficulty: "Medium",
          title: "Conditional column with np.where",
          scenario: "Flag orders as 'bulk' when quantity is 10 or more, else 'standard'.",
          steps: [
            { code: "import numpy as np\ndf = pd.DataFrame({'qty': [3, 10, 25, 7]})", explanation: "Four orders with varying quantities." },
            { code: "df['order_type'] = np.where(df['qty'] >= 10, 'bulk', 'standard')", explanation: "np.where tests each row: qty ≥ 10 → 'bulk', otherwise 'standard'. Rows two and three are bulk." },
            { code: "print(df['order_type'].tolist())", explanation: "The condition is evaluated vectorized across the whole column." },
          ],
          output: "['standard', 'bulk', 'bulk', 'standard']",
        },
        {
          difficulty: "Hard",
          title: "Immutable chain with assign() and a lambda",
          scenario: "Build revenue, then a 20% margin from that revenue, without mutating the original DataFrame.",
          steps: [
            { code: "df = pd.DataFrame({'price': [10.0, 50.0], 'qty': [4, 2]})", explanation: "Two orders. We want two derived columns, computed in sequence." },
            { code: "out = df.assign(\n    revenue=lambda d: d['price'] * d['qty'],\n    margin=lambda d: d['revenue'] * 0.2\n)", explanation: "assign takes multiple keywords evaluated in order. The margin lambda references revenue — which the same assign call just created — because each lambda sees the DataFrame as built so far." },
            { code: "print(out[['revenue', 'margin']].values.tolist())", explanation: "Order 1: revenue 40, margin 8. Order 2: revenue 100, margin 20. df itself is unchanged." },
          ],
          output: "[[40.0, 8.0], [100.0, 20.0]]",
        },
        {
          difficulty: "Industry Example",
          title: "Feature engineering for a churn model",
          scenario: "A data scientist at a SaaS company enriches a subscriptions table with the features the churn model needs: revenue per seat, a tenure band, and a high-value flag.",
          steps: [
            { code: "import pandas as pd, numpy as np\ndf = pd.DataFrame({\n    'account':   ['A','B','C','D'],\n    'mrr':       [500, 1200, 90, 3000],\n    'seats':     [10, 40, 3, 50],\n    'tenure_mo': [4, 26, 9, 40],\n})", explanation: "Monthly recurring revenue, seat count, and tenure per account — the raw fields." },
            { code: "df['rev_per_seat'] = (df['mrr'] / df['seats']).round(2)", explanation: "A ratio feature: revenue efficiency per seat. Vectorized division, rounded for readability." },
            { code: "df['tenure_band'] = pd.cut(df['tenure_mo'], bins=[0,6,24,120], labels=['new','established','veteran'])", explanation: "pd.cut turns raw months into three business-meaningful bands the model can use as a category." },
            { code: "df['high_value'] = np.where(df['mrr'] >= 1000, 1, 0)\nprint(df[['account','rev_per_seat','tenure_band','high_value']])", explanation: "A binary flag for high-MRR accounts. Together these three engineered columns often predict churn better than the raw fields alone." },
          ],
          output: "  account  rev_per_seat tenure_band  high_value\n0       A         50.00         new           0\n1       B         30.00     veteran           1\n2       C         30.00 established           0\n3       D         60.00     veteran           1",
        },
      ],
    },

    {
      id: "inline-practice",
      type: "inline-code",
      tocLabel: "Practice Coding",
      coding: {
        language: "python",
        filename: "columns_practice.py",
        instructions:
          "An e-commerce team hands you an orders DataFrame. Add the derived columns their dashboard needs, using vectorized operations.",
        starterCode: `import pandas as pd
import numpy as np

df = pd.DataFrame({
    'order':  ['O1','O2','O3','O4'],
    'price':  [25.0, 8.0, 60.0, 15.0],
    'qty':    [2, 5, 1, 4],
    'coupon': [True, False, False, True],
})

# TODO 1: 'subtotal' column = price * qty
df['subtotal'] = ___

# TODO 2: 'total' = subtotal with 10% off where coupon is True, else subtotal
df['total'] = ___

# TODO 3: 'size' band via pd.cut on subtotal:
#   (0,20]->'small', (20,50]->'medium', (50,500]->'large'
df['size'] = ___

print(df['total'].tolist())
print(df['size'].tolist())`,
        solutionCode: `import pandas as pd
import numpy as np

df = pd.DataFrame({
    'order':  ['O1','O2','O3','O4'],
    'price':  [25.0, 8.0, 60.0, 15.0],
    'qty':    [2, 5, 1, 4],
    'coupon': [True, False, False, True],
})

df['subtotal'] = df['price'] * df['qty']
df['total'] = np.where(df['coupon'], df['subtotal'] * 0.9, df['subtotal'])
df['size'] = pd.cut(df['subtotal'], bins=[0, 20, 50, 500], labels=['small','medium','large'])

print(df['total'].tolist())
print(df['size'].tolist())`,
        expectedOutput:
          "[45.0, 40.0, 60.0, 54.0]\n['medium', 'medium', 'large', 'medium']",
        hints: [
          "Task 1 is plain column arithmetic: multiply the price and qty columns.",
          "Task 2 is conditional: np.where(df['coupon'], df['subtotal'] * 0.9, df['subtotal']).",
          "Task 3: pd.cut(df['subtotal'], bins=[0,20,50,500], labels=['small','medium','large']). Note subtotals are 50, 40, 60, 60.",
          "df['subtotal']=df['price']*df['qty']; df['total']=np.where(df['coupon'], df['subtotal']*0.9, df['subtotal']); df['size']=pd.cut(df['subtotal'], bins=[0,20,50,500], labels=['small','medium','large'])",
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
          id: "pda04_mcq_01",
          difficulty: "Easy",
          question: "What does `df['tax'] = 0.2` do?",
          options: [
            "Raises an error — you can't assign a scalar",
            "Creates a 'tax' column with 0.2 in every row",
            "Creates a 'tax' column with 0.2 only in the first row",
            "Multiplies every existing column by 0.2",
          ],
          correctIndex: 1,
          explanation:
            "A scalar on the right-hand side is broadcast to every row, so all rows get 0.2. It doesn't error, doesn't touch other columns, and fills all rows, not just the first.",
        },
        {
          type: "mcq",
          id: "pda04_mcq_02",
          difficulty: "Easy",
          question: "Which builds a vectorized conditional column?",
          options: [
            "A for loop with df.iterrows()",
            "np.where(df['x'] > 0, 'pos', 'neg')",
            "df['x'].apply(lambda v: 'pos' if v > 0 else 'neg') only",
            "df.loc[0, 'x']",
          ],
          correctIndex: 1,
          explanation:
            "np.where evaluates the condition across the whole column at once in compiled code. The iterrows loop and even .apply run Python per row and are far slower; .loc[0,'x'] reads a single cell.",
        },
        {
          type: "mcq",
          id: "pda04_mcq_03",
          difficulty: "Medium",
          question: "How does df.assign(y=...) differ from df['y'] = ...?",
          options: [
            "They are identical",
            "assign returns a new DataFrame and leaves df unchanged; bracket assignment mutates df in place",
            "assign is slower and cannot be chained",
            "Bracket assignment returns a new DataFrame",
          ],
          correctIndex: 1,
          explanation:
            "assign is immutable — it returns a copy with the column added, so df stays the same unless you reassign it. Bracket assignment mutates df directly. assign is designed for chaining, not slower in a way that matters.",
        },
        {
          type: "scenario",
          id: "pda04_sc_01",
          difficulty: "Medium",
          scenario:
            "A colleague computes a per-row discount by looping with df.iterrows() and appending to a list, then assigns that list as a column. On 2 million rows it takes over a minute.",
          question: "What's the idiomatic speed-up?",
          options: [
            "Switch the loop to df.apply(axis=1)",
            "Replace the loop with a vectorized expression like np.where or column arithmetic",
            "Sort the DataFrame first",
            "Use df.itertuples() instead of iterrows()",
          ],
          correctIndex: 1,
          explanation:
            "The whole computation can run vectorized — np.where or plain column math — in compiled C, turning a minute into milliseconds. apply(axis=1) and itertuples are still Python-level per-row iteration; sorting is irrelevant.",
        },
        {
          type: "coding",
          id: "pda04_code_01",
          difficulty: "Hard",
          prompt:
            "Given the DataFrame below, add a 'profit' column (revenue − cost) and print the name of the product with the highest profit.\n\ndf = pd.DataFrame({'product':['A','B','C'], 'revenue':[100,250,180], 'cost':[60,200,90]})",
          starterCode:
            "import pandas as pd\n\ndf = pd.DataFrame({'product':['A','B','C'], 'revenue':[100,250,180], 'cost':[60,200,90]})\n\n# Your code here\n",
          solutionCode:
            "import pandas as pd\n\ndf = pd.DataFrame({'product':['A','B','C'], 'revenue':[100,250,180], 'cost':[60,200,90]})\n\ndf['profit'] = df['revenue'] - df['cost']\ntop = df.loc[df['profit'].idxmax(), 'product']\nprint(top)",
          expectedOutput: "C",
          tests: [
            { name: "Profit column", description: "profit = [40, 50, 90]" },
            { name: "Top product", description: "C has the highest profit of 90" },
          ],
        },
        {
          type: "mcq",
          id: "pda04_mcq_04",
          difficulty: "Hard",
          question: "In `df.assign(a=lambda d: d['x']*2, b=lambda d: d['a']+1)`, why can b reference a?",
          options: [
            "It can't — this raises a KeyError",
            "assign evaluates keyword arguments in order, so b's lambda sees the DataFrame with a already added",
            "Because a and b are computed simultaneously",
            "Only if a already existed before the call",
          ],
          correctIndex: 1,
          explanation:
            "assign processes its keywords left to right, and each lambda receives the DataFrame as built so far — so by the time b runs, a exists. It's not simultaneous, and a need not pre-exist because the same call created it.",
        },
      ],
    },

    {
      id: "interview-questions",
      type: "interview-questions",
      tocLabel: "Interview Prep",
      questions: [
        {
          question: "How do you add a new column to a DataFrame, and what determines the values each row gets?",
          answer:
            "The direct way is bracket assignment: df['new'] = <right-hand side>. If the right side is a scalar, pandas broadcasts it to every row. If it's a Series or a column expression like df['a'] * df['b'], pandas aligns it by index and fills each row with the matching value. That index alignment is important — if I assign a Series with a different index, rows that don't line up become NaN. For a value that depends on a condition I use np.where, and for chaining without mutating I use assign, which returns a new frame.",
        },
        {
          question: "When would you use df.assign() instead of direct bracket assignment?",
          answer:
            "I reach for assign when I want to build columns as part of a method chain without mutating the input. Because assign returns a new DataFrame, I can write a clean pipeline — filter, then assign a couple of derived columns, then group — all as one expression, which reads top to bottom and doesn't leave a half-modified frame lying around. It also lets a later column reference an earlier one in the same call via a lambda, since the keywords evaluate in order. Bracket assignment is fine and more concise for quick, one-off mutations, but for reproducible pipelines and functional-style code I prefer assign because it avoids side effects and makes the data flow explicit.",
        },
        {
          question: "Why is vectorized column creation preferred over row-wise apply or loops, and when is apply still justified?",
          answer:
            "Vectorized operations push the computation into NumPy's compiled C loops over contiguous typed arrays, so they run one to two orders of magnitude faster than iterating rows in Python and they read more clearly as intent. A loop or apply(axis=1) pays Python interpreter overhead per row and often boxes each row into a Series, which is expensive at scale. So my hierarchy is: plain column arithmetic first, then vectorized helpers like np.where, np.select, and the .str/.dt accessors, then apply only when the logic genuinely can't be expressed vectorized — for instance calling an external API per row, complex parsing that has no vectorized equivalent, or a row-dependent algorithm. Even then I treat apply as a signal to double-check there isn't a vectorized path, and on truly large data I'd consider numba or a groupby-based reformulation before accepting per-row Python.",
        },
      ],
    },

    {
      id: "common-mistakes",
      type: "callout",
      variant: "warning",
      title: "Common Mistakes to Avoid",
      content:
        "1) Looping with iterrows() to build a column that could be vectorized — it's dramatically slower and less readable. 2) Forgetting that df.assign() returns a new DataFrame — if you don't capture the result, the column is lost. 3) Assigning a Series with a mismatched index and getting surprise NaNs — the right-hand side aligns by index, not position. 4) Using pd.cut bins that don't cover all values — anything outside the outer edges becomes NaN. 5) Overwriting a column you still need — df['x'] = ... is destructive; keep the original if a later step depends on it.",
    },

    {
      id: "ai-tutor",
      type: "callout",
      variant: "tip",
      title: "Ask the AI Tutor",
      content:
        "Try these prompts in the AI Tutor panel: • 'ELI5: what does vectorized mean when I create a column?' • 'Show me np.where versus pd.cut with the same data.' • 'Quiz me on assign() versus bracket assignment.' • 'Explain why a Series with the wrong index gives NaN when I assign it.' • 'Interview mode: ask me when apply is justified over vectorized ops.'",
    },

    {
      id: "glossary",
      type: "callout",
      variant: "info",
      title: "Glossary",
      content:
        "Derived column — a new column computed from existing ones. Vectorized operation — an operation applied to a whole column at once in compiled code. Broadcast — filling every row with a single scalar value. np.where(cond, a, b) — element-wise if/else producing a column. pd.cut — binning a numeric column into labelled ranges. assign() — returns a new DataFrame with added columns; immutable. Index alignment — matching a right-hand-side Series to rows by label. rename / drop — column-hygiene methods that return a new DataFrame by default. Feature engineering — creating informative columns for analysis or modelling.",
    },

    {
      id: "resources",
      type: "callout",
      variant: "info",
      title: "Recommended Resources",
      content:
        "• Docs: the pandas 'Essential basic functionality' guide, especially the sections on assign and on vectorized operations. • Read: the NumPy np.where reference to see how the condition/true/false arrays broadcast together. • Practice: take a raw orders table and engineer three columns — a ratio, a conditional flag, and a binned band — using arithmetic, np.where, and pd.cut respectively. • Next in DSM: your columns are only trustworthy if the data behind them is complete — next, in Handling Missing Data, you'll detect NaNs and decide between dropping and filling them.",
    },

    {
      id: "recap",
      type: "recap",
      tocLabel: "Recap",
      content:
        "✓ Add or overwrite a column by assigning to df['name']; a scalar broadcasts to every row.\n✓ Derive numeric columns with vectorized arithmetic across existing columns.\n✓ np.where builds conditional columns; pd.cut bins a numeric column into labelled ranges.\n✓ df.assign() returns a new DataFrame — ideal for immutable chains, and a lambda can reference columns added earlier in the same call.\n✓ Vectorize instead of looping rows — it's far faster and clearer.\n✓ rename, drop, and reordering keep the column schema clean.\n\nNext up: Handling Missing Data. You can build any column you need — but real columns arrive with gaps. Next you'll detect missing values and choose deliberately between dropping and filling them.",
    },
  ],
};
