import type { Lesson } from "@/lib/curriculum/types";

export const applyAndTransform: Lesson = {
  meta: {
    id: "data-analysis.transformation.apply-and-transform",
    slug: "apply-and-transform",
    title: "Apply & Transform",
    description:
      "The escape hatches for logic built-ins can't express: apply for arbitrary functions, transform for group results aligned back to rows — and the vectorize-first mindset that keeps both rare and your code fast.",
    estimatedTime: "30 mins",
    difficulty: "Intermediate",
    xpReward: 70,
    prerequisites: ["data-analysis.transformation.groupby-and-aggregation"],
    masteryThreshold: 80,
  },

  blocks: [
    {
      id: "intro",
      type: "lesson-intro",
      tocLabel: "Introduction",
      intro: {
        hook: "Sooner or later you hit a rule no built-in expresses: 'shipping is 40 if express and weight over 5kg, else 25 if express, else 10'. apply lets you run ANY Python function over rows or groups — total freedom. It's also 10–100× slower than vectorized code, and half the apply calls in real codebases didn't need to exist. This lesson teaches both the tool and the judgement.",
        what: "apply runs a function over a Series' values, a DataFrame's rows, or groupby groups. transform is its shape-preserving sibling for groups: it computes per group but returns a value for EVERY ROW, aligned to the original index — the tool behind group-relative features like 'this order versus the customer's average'.",
        why: "Custom business logic is inevitable; knowing apply means never being stuck. But pandas' speed comes from vectorized C loops, and apply falls back to Python-per-row. The professional skill is double: write the custom function when needed, and recognise the vectorized form that makes it unnecessary.",
        whereUsed:
          "Encoding business rules (tiered pricing, eligibility flags), group-relative feature engineering (deviation from group mean, share of group total), text munging beyond .str, and any one-off logic during exploration.",
        objectives: [
          "Run element-wise functions with Series.apply and row-wise with DataFrame.apply(axis=1)",
          "Explain why apply is slow and when that's acceptable",
          "Replace common apply patterns with vectorized equivalents (masks, np.where, np.select)",
          "Use groupby transform to broadcast group statistics back onto rows",
          "Choose correctly between agg (collapse) and transform (align) for a given question",
        ],
        realWorldApps: [
          {
            company: "Stripe",
            headline: "Fee rules as code",
            detail:
              "Payment fees vary by method, country, and volume tiers — rule tables applied over millions of transactions, where the vectorized-vs-apply choice is the difference between seconds and hours.",
          },
          {
            company: "Zillow",
            headline: "Price relative to the neighbourhood",
            detail:
              "A home's list price means little alone; models use price relative to the zip-code median — a groupby-transform feature computed for every listing in the country.",
          },
          {
            company: "Klarna",
            headline: "Credit eligibility flags",
            detail:
              "Multi-condition eligibility rules (income band × history × basket size) are encoded as vectorized condition tables rather than per-row Python — auditability and speed from the same refactor.",
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
          type: "code-note",
          code: `# Series.apply: function per VALUE
df['grade'] = df['score'].apply(lambda x: 'pass' if x >= 40 else 'fail')

# DataFrame.apply(axis=1): function per ROW (a Series of that row's values)
def shipping(row):
    if row['express'] and row['weight'] > 5: return 40
    if row['express']: return 25
    return 10
df['ship'] = df.apply(shipping, axis=1)`,
          content:
            "The two apply shapes: per-value on a Series, per-row on a DataFrame (axis=1 hands your function each row). Inside the function you write plain Python — any logic at all. That freedom is the point, and the cost.",
        },
        {
          type: "keypoint",
          title: "Why apply is slow",
          content:
            "Vectorized operations (df['a'] * df['b'], comparisons, .str methods) run as compiled loops over whole arrays. apply calls YOUR Python function once per element or row — interpreter overhead, boxing each value, building a Series per row for axis=1. On a million rows that's a million function calls: routinely 10–100× slower. Fine for 10,000 rows in exploration; a problem in pipelines.",
        },
        {
          type: "code-note",
          code: `# The vectorized ladder — try these BEFORE apply:
df['grade'] = np.where(df['score'] >= 40, 'pass', 'fail')      # 2 outcomes

conditions = [df['express'] & (df['weight'] > 5), df['express']]
df['ship'] = np.select(conditions, [40, 25], default=10)        # n outcomes

df['tier'] = df['plan'].map({'free': 0, 'pro': 1})              # dict lookup
df['band'] = pd.cut(df['age'], bins=[0,18,65,120],
                    labels=['minor','adult','senior'])          # binning`,
          content:
            "Most apply calls are one of four patterns in disguise: two-way branch → np.where; multi-way rules → np.select (conditions checked in order, first match wins); value lookup → map; range bucketing → pd.cut. Same logic, array speed, and arguably clearer — the rule table is visible at a glance.",
        },
        {
          type: "text",
          content:
            "Now the groupby side. You already know agg: it COLLAPSES each group to one row. transform computes per group too, but returns a result with one value per ORIGINAL row — the group's statistic repeated for each member, index-aligned so it drops straight into a new column.",
        },
        {
          type: "code-note",
          code: `# agg: one row per group           # transform: one value per ORIGINAL row
df.groupby('store')['sales'].mean()  df.groupby('store')['sales'].transform('mean')
# store A    120                     # 0    120   <- row 0 is store A
# store B     80                     # 1     80   <- row 1 is store B
                                     # 2    120   <- row 2 is store A ...

df['vs_store_avg'] = df['sales'] - df.groupby('store')['sales'].transform('mean')
df['share_of_store'] = df['sales'] / df.groupby('store')['sales'].transform('sum')`,
          content:
            "transform is the broadcast: every row learns its own group's mean/sum/max, enabling group-relative columns in one line. You met it in the cleaning module — fillna with per-group medians was exactly this pattern.",
        },
        {
          type: "keypoint",
          title: "agg or transform? Ask about the output shape",
          content:
            "Want a SUMMARY TABLE (one row per group) → agg. Want a NEW COLUMN on the original rows (each row compared to or filled from its group) → transform. Same split, same groups, different shape contract. Filtering rows by a group property — 'keep customers with 3+ orders' — is transform too: df[df.groupby('cust')['id'].transform('size') >= 3].",
        },
        {
          type: "warning",
          title: "apply on groups: the most flexible and the slowest",
          content:
            "groupby().apply(func) hands your function each group as a whole DataFrame — maximal power (return anything: scalar, row, frame) and minimal speed, plus output shapes that surprise. Reach for it only after agg, transform, and filter can't express the logic. And avoid df.apply(axis=1) for arithmetic that's just column math — df['a']/df['b'] beats a row lambda every time.",
        },
        {
          type: "analogy",
          title: "The stamping press and the hand file",
          content:
            "Vectorized operations are a stamping press: one setup, then thousands of identical parts per minute. apply is a skilled machinist with a hand file: any shape you can describe, one part at a time. A good shop uses the press for everything standard and the file for the genuinely custom piece — and a good analyst reads 'if/else on two columns' and hears 'that's a press job (np.select)', reserving the file for logic that truly needs Python.",
        },
        {
          type: "expandable",
          title: "Making peace with performance: when apply is fine",
          content:
            "Dogma ('never use apply') is as wrong as ignorance. apply is perfectly fine when: the data is small (thousands of rows — milliseconds either way); the code runs once in exploration, not nightly in a pipeline; or the function wraps something inherently per-item, like calling an external parser. It's the wrong tool when the logic is expressible as column arithmetic, conditions, maps, or cuts — which covers most business rules — or when the frame is large and the code is hot. A useful discipline: when you write apply, spend thirty seconds asking which ladder rung (where/select/map/cut/str) it maps to. If none, keep the apply with a clear conscience — you've earned it.",
        },
      ],
    },

    {
      id: "diagram",
      type: "interactive-diagram",
      tocLabel: "Visual Learning",
      visual: {
        kind: "decision-tree",
        title: "Choosing the right tool for custom logic",
        caption: "Click through the decision path — apply is the last resort, not the first.",
        nodes: [
          { id: "need", label: "Custom column", sublabel: "some rule per row", detail: "You need a new column computed from existing ones by some rule. The question is which tool expresses it fastest and clearest.", x: 50, y: 8, accent: true },
          { id: "arith", label: "Column math?", sublabel: "a * b, a / b", detail: "Pure arithmetic between columns is already vectorized: df['a'] / df['b']. No helper needed at all.", x: 20, y: 30, accent: false },
          { id: "branch", label: "Conditions?", sublabel: "np.where / np.select", detail: "Two-way branch → np.where(cond, x, y). Multi-way rule table → np.select(conditions, choices, default) — first matching condition wins.", x: 50, y: 34, accent: true },
          { id: "lookup", label: "Lookup / bins?", sublabel: "map / pd.cut", detail: "Value-to-value dictionary → map. Numeric ranges to labels → pd.cut with explicit bins.", x: 80, y: 30, accent: false },
          { id: "group", label: "Group-relative?", sublabel: "transform", detail: "Row versus its group (deviation from group mean, share of group sum, group-median fill) → groupby(...).transform(stat), index-aligned for direct assignment.", x: 35, y: 62, accent: true },
          { id: "applyN", label: "apply", sublabel: "the escape hatch", detail: "Genuinely irreducible per-row/per-group Python. Accept the speed cost knowingly — fine for small data and one-offs, budget-worthy in hot pipelines.", x: 65, y: 62, accent: false },
          { id: "shape", label: "agg vs transform", sublabel: "shape contract", detail: "Summary table (one row per group) → agg. New column on original rows → transform. Same groups, different output shapes.", x: 50, y: 88, accent: false },
        ],
        edges: [
          { from: "need", to: "arith", label: "yes" },
          { from: "need", to: "branch" },
          { from: "need", to: "lookup", label: "yes" },
          { from: "branch", to: "group", label: "involves groups" },
          { from: "branch", to: "applyN", label: "irreducible" },
          { from: "group", to: "shape" },
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
          title: "apply, then its vectorized twin",
          scenario: "Grade scores pass/fail both ways and see they agree.",
          steps: [
            { code: "import pandas as pd\nimport numpy as np\ndf = pd.DataFrame({'score': [35, 80, 55, 20]})", explanation: "Four scores; the rule is score ≥ 40 passes." },
            { code: "via_apply = df['score'].apply(lambda x: 'pass' if x >= 40 else 'fail')", explanation: "apply calls the lambda once per value — four Python function calls here, a million on a million rows." },
            { code: "via_where = np.where(df['score'] >= 40, 'pass', 'fail')\nprint(via_apply.tolist())\nprint(list(via_where))", explanation: "np.where evaluates the whole comparison as one array op and picks per element. Identical output, compiled speed — the two-outcome pattern should reflexively become where." },
          ],
          output: "['fail', 'pass', 'pass', 'fail']\n['fail', 'pass', 'pass', 'fail']",
        },
        {
          difficulty: "Easy",
          title: "Multi-way rules with np.select",
          scenario: "Tiered shipping: express+heavy 40, express 25, else 10 — no apply required.",
          steps: [
            { code: "df = pd.DataFrame({\n    'express': [True, True, False, False],\n    'weight':  [7.0, 2.0, 9.0, 1.0],\n})", explanation: "The classic 'needs apply' example — until you see the rule-table form." },
            { code: "conditions = [df['express'] & (df['weight'] > 5), df['express']]\nchoices = [40, 25]\ndf['ship'] = np.select(conditions, choices, default=10)", explanation: "np.select reads top-down like the business rule itself: first matching condition wins, default catches the rest. The rule table is auditable at a glance." },
            { code: "print(df['ship'].tolist())", explanation: "Express+7kg→40, express+2kg→25, non-express→10 regardless of weight. Vectorized, ordered, explicit." },
          ],
          output: "[40, 25, 10, 10]",
        },
        {
          difficulty: "Medium",
          title: "agg vs transform, side by side",
          scenario: "Store sales: one tool summarises, the other annotates every row.",
          steps: [
            { code: "df = pd.DataFrame({\n    'store': ['A','A','B','B'],\n    'sales': [100, 140, 80, 80],\n})", explanation: "Two stores, two rows each." },
            { code: "print(df.groupby('store')['sales'].agg('mean').to_dict())", explanation: "agg collapses: one mean per store — a 2-row summary. Right shape for a report table." },
            { code: "df['store_avg'] = df.groupby('store')['sales'].transform('mean')\nprint(df['store_avg'].tolist())", explanation: "transform broadcasts: each of the 4 original rows receives ITS store's mean, index-aligned. Right shape for a new column — row 0 and 1 get 120, rows 2 and 3 get 80." },
          ],
          output: "{'A': 120.0, 'B': 80.0}\n[120.0, 120.0, 80.0, 80.0]",
        },
        {
          difficulty: "Hard",
          title: "Group-relative features in two lines",
          scenario: "Flag orders that are unusually large for their own customer — not versus the global average.",
          steps: [
            { code: "df = pd.DataFrame({\n    'cust':  ['A','A','A','B','B'],\n    'amount':[10, 12, 50, 200, 210],\n})", explanation: "Customer A usually spends ~11; B spends ~205. A's 50 is remarkable; B's 210 is routine. A global threshold can't see this." },
            { code: "grp = df.groupby('cust')['amount']\ndf['ratio'] = df['amount'] / grp.transform('median')", explanation: "Each amount divided by its OWN customer's median — transform aligns the group statistic to every row, so the ratio is customer-relative." },
            { code: "df['unusual'] = df['ratio'] > 2\nprint(df[['amount','ratio','unusual']].round(2).to_string(index=False))", explanation: "A's 50 scores ratio 4.17 → flagged; B's 210 scores 1.02 → routine. Two lines of transform beat any global rule — this is the backbone of personalised anomaly detection." },
          ],
          output: "amount  ratio  unusual\n    10   0.83    False\n    12   1.00    False\n    50   4.17     True\n   200   0.98    False\n   210   1.02    False",
        },
        {
          difficulty: "Industry Example",
          title: "Refactoring a slow pipeline step",
          scenario: "A data engineer inherits a nightly job whose row-wise apply computes discount categories over 5M orders — and refactors it to a rule table.",
          steps: [
            { code: "import pandas as pd\nimport numpy as np\ndf = pd.DataFrame({\n    'segment': ['vip','new','vip','std','new'],\n    'amount':  [900, 50, 200, 400, 700],\n})\n\ndef old_rule(row):\n    if row['segment'] == 'vip' and row['amount'] > 500: return 0.20\n    if row['segment'] == 'vip': return 0.10\n    if row['segment'] == 'new': return 0.15\n    return 0.0", explanation: "The inherited per-row function: readable, correct, and interpreter-bound — every one of 5M rows pays Python call overhead (minutes of runtime at scale)." },
            { code: "conditions = [\n    (df['segment'] == 'vip') & (df['amount'] > 500),\n    df['segment'] == 'vip',\n    df['segment'] == 'new',\n]\ndf['discount'] = np.select(conditions, [0.20, 0.10, 0.15], default=0.0)", explanation: "The same rules as an np.select table — order preserved (vip+big before vip), default explicit. Each condition is one vectorized pass; runtime drops from minutes to well under a second." },
            { code: "check = df.apply(old_rule, axis=1)\nprint(df['discount'].tolist())\nprint((check == df['discount']).all())", explanation: "The refactor discipline: run both on the same data and assert equality before deleting the old path. Same answers, two orders of magnitude faster — and the rule table doubles as documentation." },
          ],
          output: "[0.2, 0.15, 0.1, 0.0, 0.15]\nTrue",
        },
      ],
    },

    {
      id: "inline-practice",
      type: "inline-code",
      tocLabel: "Practice Coding",
      coding: {
        language: "python",
        filename: "apply_transform_practice.py",
        instructions:
          "An orders table needs three engineered columns: a vectorized size label, each order's share of its customer's total, and a flag for customers with 3+ orders.",
        starterCode: `import pandas as pd
import numpy as np

df = pd.DataFrame({
    'cust':   ['A','A','A','B','B'],
    'amount': [100, 300, 100, 400, 100],
})

# TODO 1: 'size' column: 'big' if amount >= 300 else 'small' (use np.where)
df['size'] = ___

# TODO 2: 'share': amount / that customer's total amount (use transform)
df['share'] = ___

# TODO 3: 'frequent': True for rows whose customer has >= 3 orders (transform 'size')
df['frequent'] = ___

print(df['size'].tolist())
print(df['share'].tolist())
print(df['frequent'].tolist())`,
        solutionCode: `import pandas as pd
import numpy as np

df = pd.DataFrame({
    'cust':   ['A','A','A','B','B'],
    'amount': [100, 300, 100, 400, 100],
})

df['size'] = np.where(df['amount'] >= 300, 'big', 'small')

df['share'] = df['amount'] / df.groupby('cust')['amount'].transform('sum')

df['frequent'] = df.groupby('cust')['amount'].transform('size') >= 3

print(df['size'].tolist())
print(df['share'].tolist())
print(df['frequent'].tolist())`,
        expectedOutput: "['small', 'big', 'small', 'big', 'small']\n[0.2, 0.6, 0.2, 0.8, 0.2]\n[True, True, True, False, False]",
        hints: [
          "Task 1: np.where(condition, value_if_true, value_if_false) — the two-outcome pattern never needs apply.",
          "Task 2: df.groupby('cust')['amount'].transform('sum') gives each row its customer's total (A: 500, B: 500); divide by it.",
          "Task 3: transform('size') broadcasts each group's row count to its members; compare >= 3.",
          "A has 3 orders (frequent), B has 2 (not). A's totals: 100/500=0.2, 300/500=0.6.",
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
          id: "pda17_mcq_01",
          difficulty: "Easy",
          question: "What's the key output-shape difference between groupby agg and groupby transform?",
          options: [
            "agg is faster, otherwise identical",
            "agg returns one row per group; transform returns one value per ORIGINAL row, index-aligned",
            "transform only works with sum",
            "agg cannot use custom functions",
          ],
          correctIndex: 1,
          explanation:
            "agg collapses groups into a summary; transform broadcasts each group's result back to that group's rows, so it assigns directly as a new column. Both accept many functions.",
        },
        {
          type: "mcq",
          id: "pda17_mcq_02",
          difficulty: "Easy",
          question: "Why is df.apply(func, axis=1) typically much slower than the equivalent vectorized expression?",
          options: [
            "It sorts the DataFrame first",
            "It calls a Python function once per row (building a Series each time), while vectorized ops run compiled loops over whole arrays",
            "It copies the DataFrame per row",
            "It isn't — they're the same speed",
          ],
          correctIndex: 1,
          explanation:
            "Per-row Python calls pay interpreter overhead a million times on a million rows; vectorized expressions evaluate whole columns in C. The gap is routinely 10–100×.",
        },
        {
          type: "mcq",
          id: "pda17_mcq_03",
          difficulty: "Medium",
          question: "A rule has four ordered outcomes based on combinations of two columns. The best vectorized tool?",
          options: [
            "np.where nested four levels deep",
            "np.select with an ordered list of conditions and choices, plus a default",
            "Series.map",
            "pd.cut",
          ],
          correctIndex: 1,
          explanation:
            "np.select IS the multi-way rule table: conditions checked top-down, first match wins, default for the rest — and it stays readable where nested wheres don't. map handles single-column value lookups; cut handles numeric binning.",
        },
        {
          type: "scenario",
          id: "pda17_sc_01",
          difficulty: "Medium",
          scenario:
            "An analyst needs to keep only customers who placed at least 5 orders, without losing the order-level rows of those customers.",
          question: "Which one-liner is right?",
          options: [
            "df.groupby('cust').agg('size') >= 5",
            "df[df.groupby('cust')['order_id'].transform('size') >= 5]",
            "df.drop_duplicates('cust')",
            "df.apply(lambda r: r if r['orders'] >= 5 else None, axis=1)",
          ],
          correctIndex: 1,
          explanation:
            "transform('size') broadcasts each customer's order count onto every one of their rows, producing a row-aligned boolean mask that keeps all rows of qualifying customers. agg gives a per-customer summary (wrong shape for filtering rows); the others don't express the logic.",
        },
        {
          type: "coding",
          id: "pda17_code_01",
          difficulty: "Hard",
          prompt:
            "Add a column 'dev' holding each employee's salary minus their department's mean salary, then print df['dev'] as a list.\n\ndf = pd.DataFrame({'dept':['eng','eng','sales','sales'], 'salary':[100, 120, 80, 60]})",
          starterCode:
            "import pandas as pd\n\ndf = pd.DataFrame({'dept':['eng','eng','sales','sales'], 'salary':[100, 120, 80, 60]})\n\n# Your code here\n",
          solutionCode:
            "import pandas as pd\n\ndf = pd.DataFrame({'dept':['eng','eng','sales','sales'], 'salary':[100, 120, 80, 60]})\n\ndf['dev'] = df['salary'] - df.groupby('dept')['salary'].transform('mean')\nprint(df['dev'].tolist())",
          expectedOutput: "[-10.0, 10.0, 10.0, -10.0]",
          tests: [
            { name: "Broadcast", description: "transform('mean') gives eng rows 110 and sales rows 70, aligned to the original index" },
            { name: "Deviation", description: "100−110=−10, 120−110=+10, 80−70=+10, 60−70=−10" },
          ],
        },
        {
          type: "mcq",
          id: "pda17_mcq_04",
          difficulty: "Hard",
          question: "When is keeping an apply call the RIGHT engineering decision?",
          options: [
            "Never — apply is always wrong",
            "When the logic is genuinely irreducible to vectorized forms (or wraps a per-item external call), and the data size or run frequency makes the cost acceptable",
            "Whenever the code is easier to write that way, regardless of scale",
            "Only inside groupby",
          ],
          correctIndex: 1,
          explanation:
            "apply is legitimate for truly custom logic on small data, one-off exploration, or inherently per-item work. The discipline is checking the vectorized ladder first (where/select/map/cut/transform) and accepting apply's cost knowingly — dogma in either direction is wrong.",
        },
      ],
    },

    {
      id: "interview-questions",
      type: "interview-questions",
      tocLabel: "Interview Prep",
      questions: [
        {
          question: "Explain the difference between agg, transform, and apply on a groupby.",
          answer:
            "All three run per group; they differ in what the function receives and what shape comes back. agg receives a group's column and must return ONE value — output is one row per group, the summary-table shape. transform also computes per group but the result is broadcast back to every original row, index-aligned — output has the input's length, the new-column shape; that's what powers group-relative features like deviation from the group mean or per-group median fills. apply receives each group as a whole DataFrame and may return anything — scalar, Series, or frame — making it the most flexible and the slowest, with output shapes that depend on what you return. My selection rule is by output shape first: summary → agg, aligned column or row-filter mask → transform, and apply only when the logic needs to see multiple columns of the group at once and neither simpler tool expresses it.",
        },
        {
          question: "You've inherited a slow pipeline full of df.apply(axis=1). Walk me through the refactor.",
          answer:
            "First measure — profile which applies actually dominate runtime, because refactoring a millisecond apply is vanity. For each hot one, I classify its body against the vectorized ladder: pure column arithmetic becomes direct expressions; if/else with two outcomes becomes np.where; ordered multi-condition rules become an np.select table, which also reads like the business spec; dict-style lookups become map; numeric range bucketing becomes pd.cut; and anything comparing rows to their group becomes groupby-transform. Genuinely irreducible logic — say, calling an external parser per row — stays as apply, documented as such. The critical discipline is equivalence testing: run old and new on the same data and assert the outputs match exactly before deleting the old path, because refactors that quietly change edge-case behaviour (NaN handling is the classic) are worse than slow code. Typical outcome: the two or three hot applies become rule tables, runtime drops one to two orders of magnitude, and the rules become reviewable by non-engineers.",
        },
        {
          question: "Give an example of a group-relative feature and why transform is the natural tool for it.",
          answer:
            "Take fraud-ish anomaly flags: an order of ₹50,000 is unremarkable for a wholesale buyer and alarming for a customer whose median order is ₹800. The feature that captures this is amount relative to the customer's own history — amount divided by the customer's median, or amount minus the customer's mean. Computing it needs each ROW to see a statistic of its GROUP: exactly transform's contract. df['ratio'] = df['amount'] / df.groupby('cust')['amount'].transform('median') — the group median is computed once per customer and broadcast to their rows, index-aligned, in one line. The agg-then-merge alternative (aggregate to a customer table, merge back, divide) produces the same numbers in three steps with a join to audit — transform IS that pattern fused, minus the merge risks. The same shape covers share-of-group (divide by transform('sum')), within-group ranking context, and cohort-relative metrics — most 'personalised' features in industry models are transforms in this sense.",
        },
      ],
    },

    {
      id: "common-mistakes",
      type: "callout",
      variant: "warning",
      title: "Common Mistakes to Avoid",
      content:
        "1) Reaching for apply before walking the ladder: arithmetic → where/select → map/cut → transform. 2) df.apply(axis=1) for column math that's just df['a'] / df['b']. 3) Using agg when you needed a row-aligned result (then merging it back by hand) — that's transform's job. 4) Nesting np.where three deep instead of one readable np.select table. 5) Getting np.select condition ORDER wrong — first match wins, so specific rules go before general ones. 6) Refactoring an apply without an equivalence test and silently changing NaN behaviour. 7) Cargo-cult 'never apply' — for small one-off jobs the clearest code wins.",
    },

    {
      id: "ai-tutor",
      type: "callout",
      variant: "tip",
      title: "Ask the AI Tutor",
      content:
        "Try these prompts in the AI Tutor panel: • 'ELI5: the stamping press vs the hand file.' • 'Take this if/else rule and show me its np.select table.' • 'Quiz me: agg, transform, or apply for each task you invent?' • 'Show group-relative anomaly flags with transform, step by step.' • 'Interview mode: hand me a slow apply-heavy pipeline and review my refactor plan.'",
    },

    {
      id: "glossary",
      type: "callout",
      variant: "info",
      title: "Glossary",
      content:
        "apply — run an arbitrary function per value (Series), per row/column (DataFrame, axis=), or per group (groupby). Vectorized operation — whole-array computation in compiled code; pandas' fast path. np.where — two-outcome conditional array. np.select — ordered multi-condition rule table with default. map — element-wise dict/function lookup on a Series. pd.cut — bin numeric values into labelled ranges. transform (groupby) — per-group computation broadcast back to original rows, index-aligned. agg — per-group computation collapsed to one row per group. Equivalence test — asserting old and new implementations agree before switching.",
    },

    {
      id: "resources",
      type: "callout",
      variant: "info",
      title: "Recommended Resources",
      content:
        "• Docs: pandas user guide 'GroupBy' (the transform and filter sections) and NumPy's np.select/np.where references. • Read: any 'pandas anti-patterns' article on apply overuse — recognising the ladder patterns in others' code trains the reflex. • Practice: find (or write) a row-wise apply implementing 3+ business rules; refactor to np.select, equivalence-test it, and time both at 10k and 1M rows. • Next in DSM: the Data Transformation module is complete — the EDA module begins with The EDA Workflow, where cleaning and transformation start answering real questions.",
    },

    {
      id: "recap",
      type: "recap",
      tocLabel: "Recap",
      content:
        "✓ apply runs any Python per value, row, or group — total flexibility at 10–100× vectorized cost.\n✓ The ladder before apply: column arithmetic → np.where (2 outcomes) → np.select (rule tables) → map/pd.cut (lookups/bins) → groupby-transform (group-relative).\n✓ agg collapses to one row per group; transform broadcasts group stats back to every row, index-aligned.\n✓ transform powers group-relative features (deviation, share-of-group) and row filters by group properties.\n✓ Keep apply when logic is truly irreducible and the scale tolerates it — but refactors demand equivalence tests.\n\nNext up: The EDA Workflow. Transformation tools complete — now the Exploratory Data Analysis module turns them toward their purpose: asking a dataset structured questions and reading its answers.",
    },
  ],
};
