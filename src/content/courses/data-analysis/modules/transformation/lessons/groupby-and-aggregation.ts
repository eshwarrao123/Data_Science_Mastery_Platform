import type { Lesson } from "@/lib/curriculum/types";

export const groupbyAndAggregation: Lesson = {
  meta: {
    id: "data-analysis.transformation.groupby-and-aggregation",
    slug: "groupby-and-aggregation",
    title: "GroupBy & Aggregation",
    description:
      "Master split-apply-combine: group rows by keys, aggregate each group with agg and named aggregation, and turn raw transaction tables into the per-segment metrics every business report is made of.",
    estimatedTime: "35 mins",
    difficulty: "Intermediate",
    xpReward: 70,
    prerequisites: ["data-analysis.pandas-core.data-selection"],
    masteryThreshold: 80,
  },

  blocks: [
    {
      id: "intro",
      type: "lesson-intro",
      tocLabel: "Introduction",
      intro: {
        hook: "'Revenue by region.' 'Average order value per customer segment.' 'Signups per week.' Every dashboard you've ever seen is the same operation wearing different clothes: split the rows into groups, compute something per group, glue the answers together. Learn groupby once and you can build all of them.",
        what: "groupby implements split-apply-combine: df.groupby(key) splits rows into groups by key value, an aggregation function (sum, mean, count, or your own) is applied to each group, and pandas combines the per-group results into a new indexed structure. The agg method — especially named aggregation — computes several statistics at once.",
        why: "Raw rows answer no business questions; per-group summaries answer almost all of them. groupby is the single most-used pandas operation in professional analytics — it IS the 'GROUP BY' of SQL, the pivot table of Excel, and the backbone of feature engineering for models.",
        whereUsed:
          "Every KPI report (metrics per region/product/cohort), A/B test readouts (metrics per variant), feature engineering (per-customer aggregates), and data validation (counts per source, per day).",
        objectives: [
          "Explain split-apply-combine and read a grouped result's index",
          "Group by one or several keys and aggregate a chosen column",
          "Compute multiple statistics at once with agg",
          "Produce clean report columns with named aggregation",
          "Know the difference between size() and count(), and reset_index for flat output",
        ],
        realWorldApps: [
          {
            company: "Shopify",
            headline: "Merchant dashboards",
            detail:
              "Every store's dashboard — revenue by day, orders by product, sales by channel — is a groupby over the orders table, computed for over a million merchants.",
          },
          {
            company: "Uber Eats",
            headline: "Restaurant performance metrics",
            detail:
              "Average prep time, order counts, and ratings are grouped per restaurant per hour to drive courier dispatch and restaurant ranking decisions.",
          },
          {
            company: "Spotify Wrapped",
            headline: "Per-user year in review",
            detail:
              "Wrapped is a giant groupby('user'): total minutes, top artist, top genre — per-listener aggregates computed across hundreds of billions of stream events.",
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
            "df.groupby('region') doesn't compute anything yet — it returns a GroupBy object, a recipe for splitting. The computation happens when you follow it with an aggregation: a function that collapses each group's many rows into one value per group.",
        },
        {
          type: "code-note",
          code: `df.groupby('region')['revenue'].sum()
# region            <- group keys become the index
# East     42000
# North    31500
# South    27800

df.groupby('region')['revenue'].mean()
df.groupby('region').size()          # rows per group (counts NaN too)
df.groupby('region')['deal'].count() # non-null values in 'deal' per group`,
          content:
            "The pattern reads like a sentence: group by region, take the revenue column, sum it. Group keys become the result's index. size() counts rows; count() counts non-null values of a specific column — on clean data they agree, on real data they don't.",
        },
        {
          type: "keypoint",
          title: "Split → apply → combine",
          content:
            "Split: rows are partitioned by key value (one group per distinct key). Apply: the aggregation runs once per group, seeing only that group's rows. Combine: the per-group answers are assembled into a Series or DataFrame indexed by the keys. Every groupby, however complex, is these three steps.",
        },
        {
          type: "code-note",
          code: `# Multiple keys -> MultiIndex, one row per key combination
df.groupby(['region', 'product'])['revenue'].sum()

# Multiple statistics at once
df.groupby('region')['revenue'].agg(['sum', 'mean', 'count'])

# Named aggregation: report-ready column names, mixed sources
df.groupby('region').agg(
    total_revenue=('revenue', 'sum'),
    avg_deal=('revenue', 'mean'),
    n_orders=('order_id', 'count'),
)`,
          content:
            "agg is the multiplexer. The list form gives one column per function; named aggregation — new_col=(source_col, func) — is the professional idiom because the output columns are named exactly what the report needs.",
        },
        {
          type: "text",
          content:
            "Grouped results are indexed by the group keys — a MultiIndex when you group by several. That's ideal for further pandas work (loc by key, unstack to a table) but awkward for exports and plotting; reset_index() flattens the keys back into ordinary columns. Alternatively, as_index=False in the groupby call keeps keys as columns from the start.",
        },
        {
          type: "warning",
          title: "Groups you didn't clean are groups you'll miscount",
          content:
            "groupby splits on exact values, so ' Mumbai' and 'mumbai' become separate groups — every string-cleaning lesson lands here. Also, by default groupby SORTS groups by key and DROPS rows whose key is NaN: dropna=False keeps a NaN group if missing keys matter, and observed= matters for categoricals. A groupby silently shrinking your row total is usually NaN keys vanishing.",
        },
        {
          type: "analogy",
          title: "The mail room",
          content:
            "A mail room sorts the day's letters into one pigeonhole per department (split), a clerk counts each pigeonhole's stack (apply), and the totals go on one summary sheet in department order (combine). Nobody counts the unsorted pile — and a letter with no department written on it never reaches any pigeonhole, which is exactly what happens to NaN keys.",
        },
        {
          type: "expandable",
          title: "Custom aggregations and when to avoid them",
          content:
            "agg accepts your own functions: agg(range=('price', lambda s: s.max() - s.min())). Powerful, but built-in aggregations ('sum', 'mean') run in optimised C paths, while a Python lambda runs once per group in the interpreter — on a million groups that's the difference between milliseconds and minutes. Before writing a lambda, check whether the built-in vocabulary covers you: sum, mean, median, min, max, std, var, count, nunique, first, last, any, all. Most 'custom' needs are a composition of these, or a job for transform — next lessons.",
        },
      ],
    },

    {
      id: "diagram",
      type: "interactive-diagram",
      tocLabel: "Visual Learning",
      visual: {
        kind: "flow",
        title: "Split-apply-combine",
        caption: "Click each stage to follow rows from raw table to per-group summary.",
        nodes: [
          { id: "raw", label: "Raw rows", sublabel: "orders table", detail: "Every transaction as its own row: region, product, revenue. Useful for lookups, useless for questions like 'which region is winning?'", x: 10, y: 40, accent: false },
          { id: "split", label: "Split", sublabel: "groupby('region')", detail: "Rows are partitioned by key value — one group per distinct region. Nothing is computed yet; the GroupBy object is just the partition recipe.", x: 32, y: 15, accent: true },
          { id: "apply", label: "Apply", sublabel: "sum / mean / agg", detail: "The aggregation runs once per group, seeing only that group's rows. Each group's many rows collapse to one value (or one row of named stats).", x: 56, y: 15, accent: true },
          { id: "combine", label: "Combine", sublabel: "indexed result", detail: "Per-group answers are stitched into a Series/DataFrame indexed by the group keys (MultiIndex for multiple keys), sorted by key by default.", x: 78, y: 40, accent: true },
          { id: "flat", label: "reset_index()", sublabel: "flat table", detail: "Keys move from index back to columns — the shape you want for exports, plotting libraries, and joins back onto other tables.", x: 56, y: 70, accent: false },
          { id: "nan", label: "NaN keys", sublabel: "dropped by default", detail: "Rows whose group key is missing silently join no group. If your grouped totals don't add up to the table total, look here first (dropna=False keeps them).", x: 32, y: 70, accent: false },
        ],
        edges: [
          { from: "raw", to: "split" },
          { from: "split", to: "apply" },
          { from: "apply", to: "combine" },
          { from: "combine", to: "flat" },
          { from: "split", to: "nan", label: "missing key" },
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
          title: "Revenue per region",
          scenario: "The canonical groupby: total a numeric column per category.",
          steps: [
            { code: "import pandas as pd\ndf = pd.DataFrame({\n    'region':  ['North','South','North','South','North'],\n    'revenue': [100, 80, 120, 90, 110],\n})", explanation: "Five orders across two regions — the question is 'how much per region?'." },
            { code: "totals = df.groupby('region')['revenue'].sum()", explanation: "Split by region, take revenue, sum each group. The result is a Series indexed by region." },
            { code: "print(totals.to_dict())", explanation: "North's three orders total 330, South's two total 170. Two rows now answer what five rows couldn't." },
          ],
          output: "{'North': 330, 'South': 170}",
        },
        {
          difficulty: "Easy",
          title: "size() vs count()",
          scenario: "Rows per group versus non-null values per group — a distinction that matters on real data.",
          steps: [
            { code: "df = pd.DataFrame({\n    'team':  ['A','A','B','B','B'],\n    'score': [10, None, 8, 9, None],\n})", explanation: "Five rows, two teams, two missing scores." },
            { code: "print(df.groupby('team').size().to_dict())", explanation: "size() counts ROWS: A has 2, B has 3, nulls included." },
            { code: "print(df.groupby('team')['score'].count().to_dict())", explanation: "count() counts NON-NULL scores: A has 1, B has 2. Reporting 'games played' with count() when you meant size() undercounts silently." },
          ],
          output: "{'A': 2, 'B': 3}\n{'A': 1, 'B': 2}",
        },
        {
          difficulty: "Medium",
          title: "Two keys and a MultiIndex",
          scenario: "Sales per region AND product — group by a list of keys.",
          steps: [
            { code: "df = pd.DataFrame({\n    'region':  ['North','North','South','South','North'],\n    'product': ['TV','Phone','TV','Phone','TV'],\n    'units':   [5, 3, 2, 7, 4],\n})", explanation: "Two categorical dimensions. Grouping by both gives one row per (region, product) pair." },
            { code: "result = df.groupby(['region','product'])['units'].sum()\nprint(result)", explanation: "The result has a MultiIndex — region as the outer level, product inner. North-TV combines two rows (5+4=9)." },
            { code: "flat = result.reset_index()\nprint(flat.columns.tolist())", explanation: "reset_index() turns both key levels back into ordinary columns — the flat shape plotting and exporting want." },
          ],
          output: "region  product\nNorth   Phone      3\n        TV         9\nSouth   Phone      7\n        TV         2\nName: units, dtype: int64\n['region', 'product', 'units']",
        },
        {
          difficulty: "Hard",
          title: "Named aggregation for a report",
          scenario: "One pass, three report-ready columns: total revenue, average deal, order count per region.",
          steps: [
            { code: "df = pd.DataFrame({\n    'region':  ['N','N','S','S','S'],\n    'revenue': [100, 120, 80, 90, 70],\n    'order_id':['o1','o2','o3','o4','o5'],\n})", explanation: "The raw orders. The report needs three different statistics from two different columns." },
            { code: "report = df.groupby('region').agg(\n    total_revenue=('revenue','sum'),\n    avg_deal=('revenue','mean'),\n    n_orders=('order_id','count'),\n)", explanation: "Named aggregation: each keyword becomes an output column, each value is a (source_column, function) pair. Columns come out named for the report, not 'sum' and 'mean'." },
            { code: "print(report.to_string())", explanation: "One table, ready to publish: N did 220 across 2 orders averaging 110; S did 240 across 3 averaging 80." },
          ],
          output: "        total_revenue  avg_deal  n_orders\nregion                                    \nN                 220     110.0         2\nS                 240      80.0         3",
        },
        {
          difficulty: "Industry Example",
          title: "A/B test readout",
          scenario: "A product analyst reads out an experiment: per variant, how many users, what conversion rate, and average revenue per user.",
          steps: [
            { code: "import pandas as pd\ndf = pd.DataFrame({\n    'variant':   ['control','control','control','treatment','treatment','treatment'],\n    'converted': [0, 1, 0, 1, 1, 0],\n    'revenue':   [0.0, 25.0, 0.0, 30.0, 20.0, 0.0],\n})", explanation: "One row per user in the experiment. The readout is per-variant aggregates — a groupby in its natural habitat." },
            { code: "readout = df.groupby('variant').agg(\n    users=('converted','size'),\n    conversion=('converted','mean'),\n    rev_per_user=('revenue','mean'),\n)", explanation: "size gives the sample size; the mean of a 0/1 column IS the conversion rate — a trick worth memorising; mean revenue gives per-user value including non-converters." },
            { code: "print(readout.round(3).to_string())", explanation: "Treatment converts at 67% vs control's 33% and earns more per user. Whether that difference is statistically significant is the stats domain's job — but the numbers feeding that test come from exactly this groupby." },
          ],
          output: "           users  conversion  rev_per_user\nvariant                                   \ncontrol        3       0.333         8.333\ntreatment      3       0.667        16.667",
        },
      ],
    },

    {
      id: "inline-practice",
      type: "inline-code",
      tocLabel: "Practice Coding",
      coding: {
        language: "python",
        filename: "groupby_practice.py",
        instructions:
          "A food-delivery orders table needs a per-city report: total order value, average order value, and number of orders — then identify the top city by total.",
        starterCode: `import pandas as pd

df = pd.DataFrame({
    'city':  ['Pune','Delhi','Pune','Delhi','Pune','Goa'],
    'value': [250, 400, 300, 350, 200, 500],
})

# TODO 1: Per-city report with named aggregation:
#   total=('value','sum'), avg=('value','mean'), orders=('value','size')
report = ___

# TODO 2: The city with the highest total (a string)
top_city = ___

print(report.to_string())
print(top_city)`,
        solutionCode: `import pandas as pd

df = pd.DataFrame({
    'city':  ['Pune','Delhi','Pune','Delhi','Pune','Goa'],
    'value': [250, 400, 300, 350, 200, 500],
})

report = df.groupby('city').agg(
    total=('value', 'sum'),
    avg=('value', 'mean'),
    orders=('value', 'size'),
)

top_city = report['total'].idxmax()

print(report.to_string())
print(top_city)`,
        expectedOutput: "       total    avg  orders\ncity                       \nDelhi    750  375.0       2\nGoa      500  500.0       1\nPune     750  250.0       3\nDelhi",
        hints: [
          "Task 1: df.groupby('city').agg(total=('value','sum'), avg=('value','mean'), orders=('value','size')).",
          "Groups come out sorted by key: Delhi, Goa, Pune.",
          "Task 2: report['total'].idxmax() returns the INDEX label (the city) of the max value, not the value itself.",
          "Delhi and Pune tie at 750 — idxmax returns the first occurrence in index order, so 'Delhi'. Ties are worth noticing in real reports too.",
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
          id: "pda13_mcq_01",
          difficulty: "Easy",
          question: "What does df.groupby('region') return, before any aggregation is applied?",
          options: [
            "A DataFrame with one row per region",
            "A GroupBy object — a lazy description of the split, with nothing computed yet",
            "A sorted copy of df",
            "A dictionary of DataFrames",
          ],
          correctIndex: 1,
          explanation:
            "groupby alone builds the partition recipe; computation happens when an aggregation (sum, mean, agg, …) is applied. You can iterate it like key→frame pairs, but it isn't a dict or a result table.",
        },
        {
          type: "mcq",
          id: "pda13_mcq_02",
          difficulty: "Easy",
          question: "In split-apply-combine, what does the 'apply' step operate on?",
          options: [
            "The entire DataFrame at once",
            "Each group's rows independently, one group at a time",
            "Only the first row of each group",
            "The group keys only",
          ],
          correctIndex: 1,
          explanation:
            "The aggregation function runs once per group and sees only that group's rows — that's what makes per-group statistics possible. The results are then combined into one keyed structure.",
        },
        {
          type: "mcq",
          id: "pda13_mcq_03",
          difficulty: "Medium",
          question: "For a group containing rows whose 'score' column has some NaN values, which is TRUE?",
          options: [
            "size() and count() both include the NaN rows",
            "size() counts all rows; ['score'].count() counts only non-null scores",
            "size() skips NaN rows; count() includes them",
            "Both exclude NaN rows",
          ],
          correctIndex: 1,
          explanation:
            "size() is row-count per group, nulls and all; count() is per-column non-null count. Mixing them up silently changes what a 'count' metric means on incomplete data.",
        },
        {
          type: "scenario",
          id: "pda13_sc_01",
          difficulty: "Medium",
          scenario:
            "An analyst computes df.groupby('salesperson')['deal'].sum() and notices the grouped totals sum to 4.7M while df['deal'].sum() is 5.1M. No filtering happened in between.",
          question: "What's the most likely explanation?",
          options: [
            "groupby always loses some rows for performance",
            "Rows where 'salesperson' is NaN were dropped from the grouping — 400k of deals had no salesperson recorded",
            "sum() rounds differently inside groups",
            "The DataFrame is corrupted",
          ],
          correctIndex: 1,
          explanation:
            "By default groupby drops rows whose KEY is missing — they join no group. The 0.4M gap is deals with no salesperson. dropna=False in the groupby keeps them as a NaN group so the totals reconcile.",
        },
        {
          type: "coding",
          id: "pda13_code_01",
          difficulty: "Hard",
          prompt:
            "Group by category, and for each category print a report with columns n (row count) and avg_price (mean price, rounded to 1 decimal), sorted by avg_price descending.\n\ndf = pd.DataFrame({'category':['toys','books','toys','books','games'], 'price':[20.0, 10.0, 30.0, 14.0, 50.0]})",
          starterCode:
            "import pandas as pd\n\ndf = pd.DataFrame({'category':['toys','books','toys','books','games'], 'price':[20.0, 10.0, 30.0, 14.0, 50.0]})\n\n# Your code here\n",
          solutionCode:
            "import pandas as pd\n\ndf = pd.DataFrame({'category':['toys','books','toys','books','games'], 'price':[20.0, 10.0, 30.0, 14.0, 50.0]})\n\nreport = df.groupby('category').agg(\n    n=('price', 'size'),\n    avg_price=('price', 'mean'),\n)\nreport['avg_price'] = report['avg_price'].round(1)\nprint(report.sort_values('avg_price', ascending=False).to_string())",
          expectedOutput: "          n  avg_price\ncategory              \ngames     1       50.0\ntoys      2       25.0\nbooks     2       12.0",
          tests: [
            { name: "Named aggregation", description: "agg with n=('price','size') and avg_price=('price','mean') produces exactly the two report columns" },
            { name: "Ordering", description: "sort_values on avg_price descending puts games (50.0) first and books (12.0) last" },
          ],
        },
        {
          type: "mcq",
          id: "pda13_mcq_04",
          difficulty: "Hard",
          question: "Why is agg(total=('rev','sum')) generally preferred over a lambda like agg(total=('rev', lambda s: s.sum())) at scale?",
          options: [
            "Lambdas can't access the group's rows",
            "String-named builtins dispatch to optimised C implementations; a Python lambda runs interpreted once per group — dramatically slower with many groups",
            "The lambda version produces wrong answers",
            "agg only accepts strings",
          ],
          correctIndex: 1,
          explanation:
            "Both are correct, but 'sum' hits pandas' fast paths while the lambda pays Python-interpreter cost per group — a real difference across a million groups. agg happily accepts callables; the built-in vocabulary is just the fast one.",
        },
      ],
    },

    {
      id: "interview-questions",
      type: "interview-questions",
      tocLabel: "Interview Prep",
      questions: [
        {
          question: "Explain split-apply-combine to someone who only knows Excel.",
          answer:
            "It's a pivot table, formalised. Split: pandas sorts every row into buckets by the values of the key columns — like dragging 'Region' into the Rows area. Apply: for each bucket, a summary function runs on just that bucket's rows — like choosing Sum of Revenue in the Values area. Combine: the per-bucket answers become one small table indexed by the keys. The code reads like the sentence you'd say aloud: df.groupby('region')['revenue'].sum() — group by region, take revenue, sum it. Where it outgrows Excel is composability: group by several keys at once, compute many named statistics in one pass with agg, feed the result straight into a merge or a chart, and rerun it identically tomorrow on new data — the pivot table becomes a reproducible pipeline step rather than a manual artifact.",
        },
        {
          question: "Your grouped totals don't match the raw column total. What are the usual suspects?",
          answer:
            "First suspect: NaN group keys. groupby drops rows whose key is missing, so those rows vanish from every group — dropna=False restores them as an explicit NaN group and the totals reconcile. Second: dirty keys splitting groups — ' Mumbai' versus 'mumbai' doesn't change the grand total but silently splits one group's number across two lines, so a specific group looks too small. Third: confusing count() with size() when someone downstream summed a 'count' column — count() skips nulls, size() doesn't. Fourth, for categorical dtype keys, the observed parameter can include empty categories as zero rows or exclude present combinations depending on the setting. My debugging order is: compare df[key].isna().sum() against the gap, then value_counts on the key looking for near-duplicate labels, then check which count semantics the metric actually intended.",
        },
        {
          question: "How does groupby feed feature engineering for machine learning?",
          answer:
            "Most predictive signal about an entity lives in its history, and history arrives as many rows per entity — transactions per customer, sessions per user. Models want one row per entity, so groupby is the bridge: group by the entity key and aggregate behaviour into features — count of orders, mean and max basket value, nunique products, days since first purchase via min of the date. Named aggregation builds the whole feature block in one pass with clean column names, and the result merges back onto the entity table by key. Two production cautions: first, time-awareness — features for predicting churn as of March must aggregate only data before March, so you filter by date before grouping or you leak the future into training. Second, entities with no history disappear from a plain groupby, so the merge back must be a left join from the entity table with explicit fill values for the newcomers — otherwise your model never learns what 'brand new customer' looks like.",
        },
      ],
    },

    {
      id: "common-mistakes",
      type: "callout",
      variant: "warning",
      title: "Common Mistakes to Avoid",
      content:
        "1) Forgetting that NaN keys are dropped by default — grouped totals stop matching the table total (dropna=False). 2) Grouping on uncleaned strings — casing/whitespace variants become separate groups. 3) Using count() when you mean size() on data with nulls. 4) Selecting the column AFTER aggregating instead of before — aggregate only what you need: groupby(key)['col'].sum(). 5) Fighting the MultiIndex instead of using reset_index() or as_index=False when a flat table is wanted. 6) Writing lambdas for aggregations that already exist as fast built-ins ('nunique', 'first', 'std'). 7) Reporting a mean per group without the group's size next to it — a 5.0 average over 2 rows isn't a 5.0 average over 20,000.",
    },

    {
      id: "ai-tutor",
      type: "callout",
      variant: "tip",
      title: "Ask the AI Tutor",
      content:
        "Try these prompts in the AI Tutor panel: • 'ELI5: split-apply-combine with the mail-room story.' • 'Show me named aggregation building a 5-column report in one pass.' • 'Quiz me: size vs count vs nunique on data with nulls.' • 'Why did my grouped totals lose 400k — walk me through the NaN-key trap.' • 'Interview mode: have me design per-customer features for a churn model with groupby.'",
    },

    {
      id: "glossary",
      type: "callout",
      variant: "info",
      title: "Glossary",
      content:
        "groupby — partition rows by key value(s); returns a lazy GroupBy object. Split-apply-combine — partition, per-group compute, reassemble. Aggregation — a function collapsing many rows to one value (sum, mean, count…). agg — apply one or many aggregations; named aggregation is new_col=(source, func). size() — rows per group, nulls included. count() — non-null values per column per group. MultiIndex — hierarchical index from grouping by multiple keys. reset_index() — move index level(s) back to ordinary columns. as_index=False — keep group keys as columns in the result. dropna=False — keep rows with NaN group keys as their own group.",
    },

    {
      id: "resources",
      type: "callout",
      variant: "info",
      title: "Recommended Resources",
      content:
        "• Docs: pandas user guide 'Group by: split-apply-combine' — the canonical treatment, including named aggregation. • Read: Hadley Wickham's paper 'The Split-Apply-Combine Strategy for Data Analysis' — the idea's origin, language-independent. • Practice: take any transactions CSV and rebuild a dashboard's numbers: totals by category, by month, by category-and-month, each with named aggregation. • Next in DSM: grouped results are long and skinny — Reshaping (pivot, melt) turns them into the wide tables humans read.",
    },

    {
      id: "recap",
      type: "recap",
      tocLabel: "Recap",
      content:
        "✓ groupby is lazy: the split is a recipe, and aggregation triggers the compute.\n✓ Split-apply-combine: partition by key, collapse each group, reassemble indexed by keys.\n✓ agg computes many statistics in one pass; named aggregation names output columns for the report.\n✓ size() counts rows, count() counts non-nulls — different answers on real data.\n✓ NaN keys silently drop out (dropna=False keeps them); dirty string keys split groups.\n✓ reset_index()/as_index=False flatten grouped output for plotting, exporting, and joining.\n\nNext up: Reshaping (pivot, melt, stack, unstack). Your groupby output has one row per (region, product) pair — next you'll pivot it into the region-by-product grid a human wants to read.",
    },
  ],
};
