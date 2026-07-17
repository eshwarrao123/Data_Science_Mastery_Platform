import type { Lesson } from "@/lib/curriculum/types";

export const detectingHandlingNulls: Lesson = {
  meta: {
    id: "data-analysis.cleaning.detecting-handling-nulls",
    slug: "detecting-handling-nulls",
    title: "Detecting & Handling Nulls",
    description:
      "Go beyond isna().sum(): diagnose why values are missing (MCAR, MAR, MNAR), see the patterns missingness forms across columns, and choose the imputation or drop strategy each pattern deserves.",
    estimatedTime: "35 mins",
    difficulty: "Intermediate",
    xpReward: 70,
    prerequisites: ["data-analysis.cleaning.common-data-quality-issues"],
    masteryThreshold: 80,
  },

  blocks: [
    {
      id: "intro",
      type: "lesson-intro",
      tocLabel: "Introduction",
      intro: {
        hook: "Two datasets can have the same 12% missing values and demand opposite treatments. In one, sensors dropped readings at random — fill with the median and move on. In the other, high earners skipped the income question — fill with the median and you've just erased the most important signal in the data. Handling nulls well starts with asking why they're missing, not how many there are.",
        what: "This lesson covers the mechanics of finding nulls (isna, notna, per-column and per-row counts), the three missingness mechanisms — MCAR (missing completely at random), MAR (missing at random, explained by other columns), and MNAR (missing not at random, related to the hidden value itself) — and the treatment menu: dropping rows or columns, constant/statistic imputation, group-based imputation, and flagging.",
        why: "Every treatment embeds an assumption. Dropping rows assumes the remaining rows still represent the population; median-filling assumes the missing values look like the observed ones. If the mechanism contradicts the assumption, the 'cleaned' data is quietly biased — and no downstream model can undo that.",
        whereUsed:
          "Every pipeline that feeds a model or dashboard has a null-handling step. Feature engineering, survey analysis, sensor processing, and financial reporting all live or die by whether missingness was diagnosed before it was patched.",
        objectives: [
          "Quantify missingness per column and per row with isna()",
          "Distinguish MCAR, MAR, and MNAR and explain why the distinction matters",
          "Check whether missingness in one column depends on another column",
          "Choose between dropna, fillna with statistics, group-based fills, and missing-flags",
          "Explain why imputing before a train/test split leaks information",
        ],
        realWorldApps: [
          {
            company: "Airbnb",
            headline: "Listing review scores",
            detail:
              "New listings have no review scores — missingness that is structural, not random. Imputing the city average would make untested listings look average, so models carry an explicit 'no reviews yet' flag instead.",
          },
          {
            company: "Pfizer",
            headline: "Clinical trial dropouts",
            detail:
              "Patients who leave a trial early often do so because of side effects — the missing outcome is related to the outcome itself (MNAR). Regulators require analyses that model the dropout mechanism rather than pretend the data is complete.",
          },
          {
            company: "Netflix",
            headline: "Ratings sparsity",
            detail:
              "Most user-movie ratings are missing, and not at random — people rate what they chose to watch. Recommendation models are built around this MNAR structure instead of filling the gaps with averages.",
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
            "Detection is the easy half. df.isna() returns a boolean DataFrame; chaining .sum() counts missing per column, .mean() gives the missing fraction, and .sum(axis=1) counts per row. A per-row view matters because a handful of rows missing everything is a different problem from every row missing one field.",
        },
        {
          type: "code-note",
          code: `df.isna().sum()             # count per column
df.isna().mean().round(3)   # fraction per column
df.isna().sum(axis=1)       # count per row
df[df.isna().any(axis=1)]   # show the incomplete rows`,
          content:
            "Four views of the same mask. The fraction view is the one to report — '3 nulls' means nothing without knowing if the table has 10 rows or 10 million.",
        },
        {
          type: "keypoint",
          title: "The three missingness mechanisms",
          content:
            "MCAR — missing completely at random: the gap has nothing to do with any data (a sensor glitch). MAR — missing at random: the gap is explained by OTHER observed columns (younger users skip the income field). MNAR — missing not at random: the gap depends on the missing value itself (high earners hide their income). Treatment safety degrades in that order: MCAR is safe to drop or fill, MAR needs group-aware fills, MNAR can't be fixed from the data alone — it must be modelled or flagged.",
        },
        {
          type: "text",
          content:
            "You can probe the mechanism with the data you have: group the missingness indicator by other columns. If rows missing 'income' have the same age distribution as rows with it, MCAR is plausible. If missingness concentrates in one segment, it's at least MAR — and your fill must respect that segment.",
        },
        {
          type: "code-note",
          code: `# Does income-missingness depend on age group?
df['income_missing'] = df['income'].isna()
print(df.groupby('age_band')['income_missing'].mean())
# 18-25    0.42   <- concentrated here: NOT completely at random
# 26-40    0.08
# 41-65    0.05`,
          content:
            "One groupby answers 'is this MCAR?'. A flat profile across groups supports random missingness; a spike in one group refutes it and tells you which grouping a fill should respect.",
        },
        {
          type: "keypoint",
          title: "The treatment menu",
          content:
            "1) dropna(rows) — safe when missingness is MCAR and rare (<~5%). 2) Drop the column — when it's mostly empty and low-value. 3) fillna with median/mode — numeric skew-safe default for MCAR. 4) Group-based fill — transform('median') within a segment, for MAR. 5) Flag + fill — add a was_missing indicator column so the model keeps the signal. 6) Interpolation/forward-fill — for ordered time series only.",
        },
        {
          type: "warning",
          title: "Impute after you split",
          content:
            "If you compute a fill value (mean, median) from the whole dataset and then split into train and test, the test rows influenced the fill used in training — a data leak. In modelling pipelines, always fit imputation on the training set only and apply it to the test set. For pure reporting this doesn't apply, but the habit matters the moment a model is involved.",
        },
        {
          type: "analogy",
          title: "Missing data is a crime scene, not a pothole",
          content:
            "A pothole you just fill and drive on. A crime scene you investigate first: who was here, why is the evidence gone, was it removed deliberately? Treating every null like a pothole — pour median in, smooth it over — destroys the evidence exactly when the absence itself was the most informative thing in the room. Ask why it's missing before you decide what to pour in.",
        },
        {
          type: "expandable",
          title: "Why median beats mean for skewed columns",
          content:
            "Income, prices, and durations are right-skewed: a few huge values drag the mean above what's typical. Filling nulls with the mean therefore inserts values larger than most real observations, inflating the column's centre further. The median is robust to those extremes, so median-filling preserves the typical value. For categorical columns the analogue is the mode. This is also why describe() shows you both — a mean far above the median is itself a skew warning.",
        },
      ],
    },

    {
      id: "diagram",
      type: "interactive-diagram",
      tocLabel: "Visual Learning",
      visual: {
        kind: "decision-tree",
        title: "Choosing a null treatment",
        caption:
          "Click each node to follow the decision path from detection to treatment.",
        nodes: [
          { id: "start", label: "Nulls found", sublabel: "isna().mean()", detail: "Start from the missing fraction per column and the per-row view. The path depends on how much is missing and why.", x: 50, y: 8, accent: true },
          { id: "why", label: "Why missing?", sublabel: "groupby probe", detail: "Group the missingness flag by other columns. Flat profile → plausibly MCAR. Concentrated in a segment → MAR. Tied to the hidden value itself → MNAR.", x: 50, y: 30, accent: true },
          { id: "mcar", label: "MCAR", sublabel: "random glitch", detail: "Rare and random: dropna the rows. More common: fillna with median (numeric) or mode (categorical).", x: 18, y: 55, accent: false },
          { id: "mar", label: "MAR", sublabel: "explained by other cols", detail: "Fill within the explaining group: df.groupby(segment)[col].transform('median'). A global fill would bias the affected segment.", x: 50, y: 55, accent: false },
          { id: "mnar", label: "MNAR", sublabel: "depends on hidden value", detail: "No fill is honest. Add a was_missing flag, model the mechanism, or report the bias. Deleting or averaging hides the signal.", x: 82, y: 55, accent: false },
          { id: "flag", label: "Flag + document", sublabel: "always", detail: "Whatever the treatment, record what was filled and why. An indicator column keeps the information available to models and reviewers.", x: 50, y: 85, accent: true },
        ],
        edges: [
          { from: "start", to: "why" },
          { from: "why", to: "mcar", label: "random" },
          { from: "why", to: "mar", label: "segment-driven" },
          { from: "why", to: "mnar", label: "value-driven" },
          { from: "mcar", to: "flag" },
          { from: "mar", to: "flag" },
          { from: "mnar", to: "flag" },
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
          title: "Measure missingness properly",
          scenario: "Report how much of each column is missing, as a fraction.",
          steps: [
            { code: "import pandas as pd\nimport numpy as np\ndf = pd.DataFrame({'a':[1, np.nan, 3, np.nan], 'b':[1, 2, 3, 4]})", explanation: "Column a has 2 of 4 values missing; b is complete." },
            { code: "print(df.isna().sum().to_dict())", explanation: "Counts per column: a→2, b→0." },
            { code: "print(df.isna().mean().to_dict())", explanation: "Fractions per column — the number you actually report: half of a is missing." },
          ],
          output: "{'a': 2, 'b': 0}\n{'a': 0.5, 'b': 0.0}",
        },
        {
          difficulty: "Easy",
          title: "Median fill for a skewed column",
          scenario: "Fill missing prices without letting one luxury item distort the fill value.",
          steps: [
            { code: "df = pd.DataFrame({'price':[10.0, 12.0, np.nan, 11.0, 500.0]})", explanation: "Four normal prices and one 500.0 outlier. The mean (133.25) is nothing like a typical price." },
            { code: "median = df['price'].median()\nprint(median)", explanation: "The median, 11.5, sits among the typical values — robust to the outlier." },
            { code: "df['price'] = df['price'].fillna(median)\nprint(df['price'].tolist())", explanation: "The gap is filled with a plausible typical price instead of an outlier-inflated mean." },
          ],
          output: "11.5\n[10.0, 12.0, 11.5, 11.0, 500.0]",
        },
        {
          difficulty: "Medium",
          title: "Probe whether missingness is random",
          scenario: "Income is missing for some users. Before filling, check if the gaps concentrate in one plan tier.",
          steps: [
            { code: "df = pd.DataFrame({\n    'plan':  ['free','free','free','pro','pro','pro'],\n    'income':[np.nan, np.nan, 30000, 80000, 75000, np.nan],\n})", explanation: "Six users. At a glance, free-tier users seem to skip the income field more." },
            { code: "rate = df['income'].isna().groupby(df['plan']).mean()", explanation: "Group the missingness indicator by plan: this is the MCAR test. If rates were equal, randomness would be plausible." },
            { code: "print(rate.to_dict())", explanation: "67% missing among free users vs 33% among pro — missingness depends on plan (MAR at best). A single global fill would drag free users toward pro incomes." },
          ],
          output: "{'free': 0.6666666666666666, 'pro': 0.3333333333333333}",
        },
        {
          difficulty: "Hard",
          title: "Group-based fill with transform",
          scenario: "Fill missing incomes using the median of each user's own plan tier, not the global median.",
          steps: [
            { code: "df = pd.DataFrame({\n    'plan':  ['free','free','free','pro','pro','pro'],\n    'income':[25000, np.nan, 35000, 80000, np.nan, 90000],\n})", explanation: "One gap per tier. Global median (57500) fits neither tier; each tier has its own typical income." },
            { code: "group_median = df.groupby('plan')['income'].transform('median')", explanation: "transform returns a Series aligned to every row: 30000 for free rows, 85000 for pro rows — each row sees its own group's median." },
            { code: "df['income'] = df['income'].fillna(group_median)\nprint(df['income'].tolist())", explanation: "Each gap is filled from its own segment: the free user gets 30000, the pro user 85000. The MAR structure is respected." },
          ],
          output: "[25000.0, 30000.0, 35000.0, 80000.0, 85000.0, 90000.0]",
        },
        {
          difficulty: "Industry Example",
          title: "Flag-and-fill for a churn model",
          scenario: "A telecom data scientist prepares features for a churn model. 'months_since_complaint' is missing for customers who never complained — a null that carries meaning.",
          steps: [
            { code: "df = pd.DataFrame({\n    'customer':['A','B','C','D'],\n    'months_since_complaint':[2.0, np.nan, 7.0, np.nan],\n})", explanation: "For B and D the value isn't unknown — it doesn't exist, because they never complained. That fact itself predicts churn." },
            { code: "df['never_complained'] = df['months_since_complaint'].isna().astype(int)", explanation: "First preserve the signal as an explicit 0/1 flag column. Without it, any fill would erase the distinction between 'complained long ago' and 'never complained'." },
            { code: "df['months_since_complaint'] = df['months_since_complaint'].fillna(\n    df['months_since_complaint'].median()\n)\nprint(df.to_string(index=False))", explanation: "Then fill with the median so the column is model-ready. The model receives both a complete numeric feature and the flag that says which values were real." },
          ],
          output: "customer  months_since_complaint  never_complained\n       A                     2.0                 0\n       B                     4.5                 1\n       C                     7.0                 0\n       D                     4.5                 1",
        },
      ],
    },

    {
      id: "inline-practice",
      type: "inline-code",
      tocLabel: "Practice Coding",
      coding: {
        language: "python",
        filename: "nulls_practice.py",
        instructions:
          "A delivery dataset has missing ratings. Quantify the gaps, check whether they concentrate in one city, and fill using each city's own median.",
        starterCode: `import pandas as pd
import numpy as np

df = pd.DataFrame({
    'city':   ['Pune','Pune','Pune','Goa','Goa','Goa'],
    'rating': [4.0, np.nan, 5.0, 3.0, np.nan, np.nan],
})

# TODO 1: Fraction of missing ratings overall (a float)
missing_frac = ___

# TODO 2: Missing-rate per city (a Series indexed by city)
per_city = ___

# TODO 3: Fill each gap with its own city's median rating
df['rating'] = ___

print(round(missing_frac, 2))
print(per_city.round(2).to_dict())
print(df['rating'].tolist())`,
        solutionCode: `import pandas as pd
import numpy as np

df = pd.DataFrame({
    'city':   ['Pune','Pune','Pune','Goa','Goa','Goa'],
    'rating': [4.0, np.nan, 5.0, 3.0, np.nan, np.nan],
})

missing_frac = df['rating'].isna().mean()

per_city = df['rating'].isna().groupby(df['city']).mean()

df['rating'] = df['rating'].fillna(
    df.groupby('city')['rating'].transform('median')
)

print(round(missing_frac, 2))
print(per_city.round(2).to_dict())
print(df['rating'].tolist())`,
        expectedOutput: "0.5\n{'Goa': 0.67, 'Pune': 0.33}\n[4.0, 4.5, 5.0, 3.0, 3.0, 3.0]",
        hints: [
          "Task 1: .isna() gives a boolean Series; .mean() of booleans is the True fraction.",
          "Task 2: group the boolean mask by the city column: df['rating'].isna().groupby(df['city']).mean().",
          "Task 3: df.groupby('city')['rating'].transform('median') returns a row-aligned Series of each row's city median — pass it to fillna.",
          "Pune's median from [4.0, 5.0] is 4.5; Goa's only observed rating is 3.0, so both Goa gaps become 3.0.",
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
          id: "pda08_mcq_01",
          difficulty: "Easy",
          question: "df.isna().mean() returns:",
          options: [
            "The mean of each column ignoring nulls",
            "The fraction of missing values per column",
            "The number of missing values per column",
            "True if any value is missing",
          ],
          correctIndex: 1,
          explanation:
            "isna() yields a boolean frame; the mean of booleans (True=1, False=0) is the fraction of True values — the missing fraction per column. Counts come from .sum(); column means ignoring nulls come from df.mean().",
        },
        {
          type: "mcq",
          id: "pda08_mcq_02",
          difficulty: "Easy",
          question: "Survey respondents with very high incomes tend to leave the income field blank. This missingness is:",
          options: ["MCAR", "MAR", "MNAR", "Structural"],
          correctIndex: 2,
          explanation:
            "The probability of the gap depends on the hidden value itself (high income → more likely blank), which is the definition of MNAR. MCAR would be unrelated to anything; MAR would be explained by other observed columns.",
        },
        {
          type: "mcq",
          id: "pda08_mcq_03",
          difficulty: "Medium",
          question: "Why is the median usually preferred over the mean for filling a skewed numeric column?",
          options: [
            "The median is faster to compute",
            "The mean is undefined when values are missing",
            "Outliers drag the mean away from typical values, so mean-fills insert unrepresentative numbers",
            "fillna only accepts medians",
          ],
          correctIndex: 2,
          explanation:
            "In skewed data a few extreme values inflate the mean above what's typical; the median resists them. fillna accepts any value, means are computable on the observed values, and speed is irrelevant here.",
        },
        {
          type: "scenario",
          id: "pda08_sc_01",
          difficulty: "Medium",
          scenario:
            "In a customer table, 40% of free-tier users are missing 'income' versus 5% of paid users. An analyst proposes filling all gaps with the overall median income.",
          question: "What is the main problem with this plan?",
          options: [
            "fillna cannot fill more than 10% of a column",
            "Missingness depends on tier, so a global fill biases free-tier incomes toward the paid tier's level — a group-based fill respects the structure",
            "The median should never be used for income",
            "The gaps should be dropped instead, always",
          ],
          correctIndex: 1,
          explanation:
            "The groupby probe shows MAR: gaps concentrate in the free tier. The overall median is pulled up by paid users, so filling free-tier gaps with it overstates their income. transform('median') within tier is the honest fill. The other options are false or dogmatic.",
        },
        {
          type: "coding",
          id: "pda08_code_01",
          difficulty: "Hard",
          prompt:
            "Add a 0/1 column 'score_missing' flagging rows where 'score' is null, then fill 'score' with its median. Print the DataFrame's score and score_missing columns as lists.\n\ndf = pd.DataFrame({'score':[80.0, None, 60.0, None]})",
          starterCode:
            "import pandas as pd\n\ndf = pd.DataFrame({'score':[80.0, None, 60.0, None]})\n\n# Your code here\n",
          solutionCode:
            "import pandas as pd\n\ndf = pd.DataFrame({'score':[80.0, None, 60.0, None]})\n\ndf['score_missing'] = df['score'].isna().astype(int)\ndf['score'] = df['score'].fillna(df['score'].median())\nprint(df['score'].tolist())\nprint(df['score_missing'].tolist())",
          expectedOutput: "[80.0, 70.0, 60.0, 70.0]\n[0, 1, 0, 1]",
          tests: [
            { name: "Flag first", description: "score_missing is computed before filling — flagging after fillna would mark nothing" },
            { name: "Median fill", description: "The median of [80.0, 60.0] is 70.0, inserted at both gaps" },
          ],
        },
        {
          type: "mcq",
          id: "pda08_mcq_04",
          difficulty: "Hard",
          question: "In a modelling pipeline, why must imputation values be computed from the training set only?",
          options: [
            "Test sets cannot contain nulls",
            "Computing fills from all data lets test-set information influence training — a leak that inflates evaluation scores",
            "The median of the full dataset is mathematically undefined",
            "scikit-learn forbids fitting on full datasets",
          ],
          correctIndex: 1,
          explanation:
            "A fill statistic computed over the full dataset carries information about test rows into the training data, so the evaluation no longer measures generalisation. Test sets can contain nulls (you apply the training-set fill), and the other options are simply false.",
        },
      ],
    },

    {
      id: "interview-questions",
      type: "interview-questions",
      tocLabel: "Interview Prep",
      questions: [
        {
          question: "Explain MCAR, MAR, and MNAR with an example of each, and how the mechanism changes your treatment.",
          answer:
            "MCAR means the gap is unrelated to anything — a sensor randomly dropping readings. There, dropping rows or filling with a median is safe because the missing values resemble the observed ones. MAR means the gap is explained by other observed columns — younger users skip the income question. A global fill would bias the young segment, so I fill within the explaining group, for example a per-age-band median via groupby-transform. MNAR means the gap depends on the hidden value itself — high earners hiding income. No fill computed from observed data is honest there, because the missing values are systematically different from what I can see; I keep an explicit missing-flag, consider modelling the mechanism, and disclose the bias. The practical point: the same 10% missing can be harmless or fatal depending on mechanism, so I always probe before I patch.",
        },
        {
          question: "How would you check, with pandas, whether missingness in one column is random?",
          answer:
            "I build the missingness indicator — df['col'].isna() — and study it like any other variable. First I group its mean by candidate explanatory columns: df['col'].isna().groupby(df['segment']).mean(). If the missing rate is flat across segments, randomness is plausible; if it spikes in one group, it's at least MAR and that grouping must drive the fill. For numeric relationships I compare the distribution of another column between missing and non-missing rows, for example df.groupby(df['col'].isna())['age'].describe(). What I cannot fully test from the data alone is MNAR, since it depends on values I never observed — that diagnosis comes from domain knowledge about how the data was collected, which is why I always ask how a field gets populated before trusting any statistical check.",
        },
        {
          question: "When would you drop rows with nulls versus impute, and what risks does each carry?",
          answer:
            "Dropping is defensible when the affected rows are a small share, missingness looks MCAR, and I can afford the sample loss — it keeps every remaining value real. Its risks are losing statistical power and, if the missingness is not random, silently biasing the sample: dropping all rows missing income removes exactly the segment that skips that question. Imputation preserves rows and works for MAR when done group-aware, but every imputed value is invented data — it shrinks variance, can distort correlations, and a careless global fill bakes in bias. Column-dropping is the third option when a field is mostly empty and low-value. In modelling contexts I add two safeguards regardless of choice: an indicator column so the fact of missingness stays available as signal, and fitting any fill statistic on the training split only so evaluation stays honest.",
        },
      ],
    },

    {
      id: "common-mistakes",
      type: "callout",
      variant: "warning",
      title: "Common Mistakes to Avoid",
      content:
        "1) Reporting null counts without fractions — 300 nulls is noise in 10M rows and a crisis in 1,000. 2) Filling before asking why values are missing — the mechanism decides the method. 3) Using the mean on skewed columns; the median resists outliers. 4) Global fills on MAR data — fill within the explaining group via transform. 5) Flagging missingness AFTER filling — the mask is all False by then; create the indicator first. 6) Computing fill statistics on the full dataset in a modelling pipeline — fit on train only. 7) Forgetting that np.nan != np.nan — always detect with isna(), never with == comparisons.",
    },

    {
      id: "ai-tutor",
      type: "callout",
      variant: "tip",
      title: "Ask the AI Tutor",
      content:
        "Try these prompts in the AI Tutor panel: • 'ELI5: MCAR vs MAR vs MNAR with a school-attendance example.' • 'Show me how transform(\"median\") fills within groups step by step.' • 'Quiz me: give me missingness scenarios and I'll name the mechanism.' • 'Why does imputing before a train/test split leak information?' • 'Interview mode: challenge my choice to drop rows with nulls.'",
    },

    {
      id: "glossary",
      type: "callout",
      variant: "info",
      title: "Glossary",
      content:
        "isna()/notna() — boolean masks for missing/present values. Missingness mechanism — the process that decides which values go missing. MCAR — missing completely at random, unrelated to any data. MAR — missing at random, explained by other observed columns. MNAR — missing not at random, dependent on the hidden value itself. Imputation — replacing missing values with estimates. Group-based fill — imputing with a statistic computed within each row's group (groupby + transform). Missing-flag / indicator — a 0/1 column recording where values were missing. Data leakage — test-set information influencing training, e.g. via a full-dataset fill statistic.",
    },

    {
      id: "resources",
      type: "callout",
      variant: "info",
      title: "Recommended Resources",
      content:
        "• Docs: pandas 'Working with missing data' user guide — the canonical reference for isna, fillna, and interpolate. • Read: the MCAR/MAR/MNAR taxonomy traces to Rubin (1976); any short summary of 'missing data mechanisms' covers it. • Practice: take the Titanic dataset, probe whether Age-missingness depends on Pclass, then compare a global median fill against a per-class fill. • Next in DSM: with gaps handled, the next quality issue is rows that appear twice — Deduplication.",
    },

    {
      id: "recap",
      type: "recap",
      tocLabel: "Recap",
      content:
        "✓ Measure missingness as fractions per column (isna().mean()) and inspect per-row completeness too.\n✓ MCAR is random, MAR is explained by other columns, MNAR depends on the hidden value itself.\n✓ Probe the mechanism by grouping the isna() indicator by other columns before choosing a fix.\n✓ Median/mode fills suit MCAR; groupby-transform fills respect MAR; MNAR demands flags and honesty, not fills.\n✓ Create was_missing indicators BEFORE filling, and fit fill statistics on training data only.\n✓ Every treatment embeds an assumption — document what you filled and why.\n\nNext up: Deduplication. Nulls are gaps; duplicates are the opposite — the same fact counted twice. You'll learn to find and remove them without deleting real data.",
    },
  ],
};
