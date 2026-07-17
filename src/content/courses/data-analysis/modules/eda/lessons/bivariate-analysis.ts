import type { Lesson } from "@/lib/curriculum/types";

export const bivariateAnalysis: Lesson = {
  meta: {
    id: "data-analysis.eda.bivariate-analysis",
    slug: "bivariate-analysis",
    title: "Bivariate Analysis",
    description:
      "Analyse pairs of variables by type: correlation for numeric-numeric (and its famous traps), grouped comparisons for numeric-categorical, and cross-tabs for categorical-categorical — where most EDA findings actually live.",
    estimatedTime: "35 mins",
    difficulty: "Intermediate",
    xpReward: 80,
    prerequisites: ["data-analysis.eda.univariate-analysis"],
    masteryThreshold: 80,
  },

  blocks: [
    {
      id: "intro",
      type: "lesson-intro",
      tocLabel: "Introduction",
      intro: {
        hook: "Ice cream sales correlate beautifully with drowning deaths. Nobody drowns from sundaes — summer causes both. Bivariate analysis is where EDA gets powerful ('orders differ by city!') and dangerous ('X causes Y!') at the same time. The techniques take an afternoon to learn; knowing what they can't tell you is the actual skill.",
        what: "Bivariate analysis examines two variables together, and the type pair picks the tool: numeric×numeric → correlation and scatter thinking; numeric×categorical → group comparisons (the groupby you know, now with EDA judgement); categorical×categorical → cross-tabs with pd.crosstab. Plus the two great caveats: correlation ≠ causation, and Pearson only sees straight lines.",
        why: "Almost every actionable finding is bivariate in shape: 'churn differs by plan', 'spend rises with tenure', 'conversion depends on channel'. It's also where analyses most often go wrong — spurious correlations, means compared across skew, percentages computed against the wrong denominator. Master the tools AND the traps.",
        whereUsed:
          "Feature-target exploration before modelling, A/B readouts, segment comparisons in every business review, correlation screens across metrics, and the 'what moves with what' phase of any investigation.",
        objectives: [
          "Compute and interpret Pearson correlation, including its blindness to nonlinearity and fragility to outliers",
          "Compare a numeric variable across groups honestly (medians for skew, sizes alongside)",
          "Build cross-tabs with pd.crosstab and choose the right normalize direction",
          "Read a correlation matrix as a screening tool, not a conclusion generator",
          "State bivariate findings without causal language they haven't earned",
        ],
        realWorldApps: [
          {
            company: "Netflix",
            headline: "Engagement vs retention screens",
            detail:
              "Analysts correlate dozens of engagement metrics with retention to shortlist candidates for causal testing — the correlation screen finds candidates; A/B tests earn the causal claims.",
          },
          {
            company: "Kaiser Permanente",
            headline: "Risk-factor cross-tabs",
            detail:
              "Epidemiology starts with cross-tabs — condition by exposure group, normalized by row — before any causal modelling; the humble crosstab is medicine's first analytical tool.",
          },
          {
            company: "Meta",
            headline: "Ads: correlation vs incrementality",
            detail:
              "People who see more ads buy more — but heavy users see more ads AND buy more anyway. Meta runs holdout experiments precisely because the raw ad-exposure/purchase correlation overstates causation.",
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
          type: "keypoint",
          title: "The tool follows the type pair",
          content:
            "Numeric × numeric → correlation (df['a'].corr(df['b'])), scatter-plot thinking. Numeric × categorical → group comparison (groupby(cat)[num].describe()) — 'does the distribution of X differ by group?'. Categorical × categorical → contingency table (pd.crosstab) with normalized shares. Three pairings, three tools; misapplying one to another's job is the first class of bivariate error.",
        },
        {
          type: "code-note",
          code: `df['tenure'].corr(df['spend'])       # Pearson r: -1 .. +1
df[['a','b','c']].corr().round(2)     # correlation matrix (screening)
df['a'].corr(df['b'], method='spearman')  # rank-based: monotonic, robust`,
          content:
            "Pearson r measures LINEAR co-movement: +1 perfect line up, -1 down, 0 no linear trend. Spearman correlates the RANKS instead — it catches any monotonic relationship (curved but always-increasing) and shrugs off outliers. When Pearson and Spearman disagree sharply, the data is telling you 'nonlinear or outlier-driven — look closer'.",
        },
        {
          type: "warning",
          title: "Pearson's three blind spots",
          content:
            "1) Nonlinearity: a perfect U-shaped relationship (spend vs age) can score r ≈ 0 — 'no correlation' while the relationship is total. 2) Outliers: one extreme point can manufacture r = 0.9 from noise, or bury a real relationship. 3) Anscombe's lesson: four datasets with identical r can look wildly different. Consequence: never interpret a correlation you haven't visualised (or at least Spearman-checked and outlier-checked).",
        },
        {
          type: "code-note",
          code: `# Numeric across groups: distributions, not just means
df.groupby('plan')['spend'].agg(['median', 'mean', 'count'])
# medians for skew-honesty, counts because a median of 3 rows is a rumour`,
          content:
            "Group comparison is univariate analysis per group: the same centre/spread/shape discipline, now side by side. Report medians when the variable is skewed, and ALWAYS carry group sizes — differences between tiny groups are noise wearing a costume.",
        },
        {
          type: "code-note",
          code: `pd.crosstab(df['plan'], df['churned'])                      # counts
pd.crosstab(df['plan'], df['churned'], normalize='index')    # row %: churn rate per plan
pd.crosstab(df['plan'], df['churned'], normalize='columns')  # col %: plan mix among churners`,
          content:
            "The normalize direction IS the question. normalize='index' answers 'what share of EACH PLAN churned?' (compare rates across plans); normalize='columns' answers 'what do churners consist of?'. Choosing the wrong denominator produces a true number that answers a different question — the sneakiest bivariate error.",
        },
        {
          type: "keypoint",
          title: "Correlation is not causation — and here's the checklist",
          content:
            "A correlation between X and Y admits five explanations: X→Y, Y→X (reverse), Z→both (confounding: summer → ice cream AND drownings), selection effects (who ends up in the data), and chance (especially after screening many pairs). EDA's job is to FIND the relationship and list plausible explanations; experiments and causal methods (later domains) get to pick one. In writing: 'is associated with', never 'drives', until earned.",
        },
        {
          type: "analogy",
          title: "Dance partners, not puppet strings",
          content:
            "Correlation says two dancers move together; it doesn't say who leads, whether both follow the music (a third factor), or whether you happened to watch the one song where they synced by chance. Watching more carefully (visualisation), checking different songs (segments, later data), and finally asking them to dance without music (an experiment) — that's the escalation from association to causation.",
        },
        {
          type: "expandable",
          title: "Correlation matrices: screening tool, multiple-comparisons trap",
          content:
            "df.corr() across 20 columns yields 190 pairs. At that count, several will exceed |r| = 0.3 by pure chance — screening guarantees 'discoveries'. Professional use: treat the matrix as a shortlist generator (which pairs deserve a closer look), sort by absolute value, then subject survivors to the full treatment — visualise, Spearman-check, outlier-check, segment-check, and ask the five-explanations question. Also practical: corr() silently drops non-numeric columns and pairwise-drops NaNs (each pair computed on its own complete rows — so different cells can describe different subsets; check counts when missingness is heavy).",
        },
      ],
    },

    {
      id: "diagram",
      type: "interactive-diagram",
      tocLabel: "Visual Learning",
      visual: {
        kind: "decision-tree",
        title: "Two variables walk into an analysis…",
        caption: "Click through: the type pair picks the tool; the caveats apply to all three.",
        nodes: [
          { id: "pair", label: "Two variables", sublabel: "what types?", detail: "The pairing of types — numeric or categorical — routes to one of three toolkits. (Univariate understanding of each side is the prerequisite.)", x: 50, y: 8, accent: true },
          { id: "nn", label: "num × num", sublabel: "correlation", detail: "Pearson r for linear, Spearman for monotonic/robust. Disagreement between them = nonlinearity or outliers. Never interpret unvisualised.", x: 18, y: 35, accent: false },
          { id: "nc", label: "num × cat", sublabel: "group comparison", detail: "groupby(cat)[num] with median, mean, count. Univariate discipline per group: skew → medians; tiny groups → rumours, not findings.", x: 50, y: 35, accent: false },
          { id: "cc", label: "cat × cat", sublabel: "crosstab", detail: "pd.crosstab with normalize= chosen BY THE QUESTION: 'index' compares rates across rows; 'columns' describes composition. Wrong denominator = right number, wrong answer.", x: 82, y: 35, accent: false },
          { id: "check", label: "Interrogate", sublabel: "outliers • nonlinearity • sizes", detail: "One extreme point can fake r=0.9; a U-shape can hide as r=0; a 12-row group can 'outperform' by luck. Every striking pair gets the checks.", x: 50, y: 62, accent: true },
          { id: "causal", label: "Five explanations", sublabel: "before any claim", detail: "X→Y, Y→X, confounder Z→both, selection, chance. EDA lists them; experiments decide. Write 'associated with', not 'drives'.", x: 50, y: 86, accent: true },
        ],
        edges: [
          { from: "pair", to: "nn", label: "both numeric" },
          { from: "pair", to: "nc", label: "mixed" },
          { from: "pair", to: "cc", label: "both categorical" },
          { from: "nn", to: "check" },
          { from: "nc", to: "check" },
          { from: "cc", to: "check" },
          { from: "check", to: "causal" },
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
          title: "A first correlation",
          scenario: "Do longer-tenured customers spend more?",
          steps: [
            { code: "import pandas as pd\ndf = pd.DataFrame({\n    'tenure': [1, 3, 6, 12, 24, 36],\n    'spend':  [100, 150, 210, 320, 500, 720],\n})", explanation: "Six customers, tenure in months against monthly spend." },
            { code: "r = df['tenure'].corr(df['spend'])", explanation: "Pearson r: how tightly the pair tracks a straight line, from -1 to +1." },
            { code: "print(round(r, 3))", explanation: "0.997 — an almost perfectly linear positive association. The honest sentence: 'spend rises with tenure' — NOT 'tenure drives spend' (loyal customers may differ in many ways)." },
          ],
          output: "0.997",
        },
        {
          difficulty: "Easy",
          title: "Group comparison with the univariate discipline",
          scenario: "Do order values differ by city — reported honestly?",
          steps: [
            { code: "df = pd.DataFrame({\n    'city':  ['Pune']*5 + ['Delhi']*5,\n    'value': [200, 220, 210, 230, 2200, 400, 420, 380, 410, 390],\n})", explanation: "Five orders each. Pune contains one 2200 outlier — univariate thinking says means are now suspect." },
            { code: "print(df.groupby('city')['value'].mean().round(0).to_dict())", explanation: "By means: Pune 612 vs Delhi 400 — 'Pune orders are 50% larger!' One bulk order manufactured that headline." },
            { code: "print(df.groupby('city')['value'].median().to_dict())", explanation: "By medians: Pune 220 vs Delhi 400 — the TYPICAL Pune order is actually much smaller. Same data, opposite story; the univariate shape check decided which statistic told the truth." },
          ],
          output: "{'Delhi': 400.0, 'Pune': 612.0}\n{'Delhi': 400.0, 'Pune': 220.0}",
        },
        {
          difficulty: "Medium",
          title: "Crosstab: the denominator IS the question",
          scenario: "Plan type vs churn — watch two normalize directions answer two different questions.",
          steps: [
            { code: "df = pd.DataFrame({\n    'plan':    ['monthly']*6 + ['annual']*4,\n    'churned': [1,1,1,0,0,0, 0,0,0,1],\n})", explanation: "Ten customers: 6 monthly (3 churned), 4 annual (1 churned)." },
            { code: "print(pd.crosstab(df['plan'], df['churned'], normalize='index').round(2).to_dict())", explanation: "normalize='index' → churn rate PER PLAN: monthly churns at 50%, annual at 25%. This answers 'which plan leaks?'." },
            { code: "print(pd.crosstab(df['plan'], df['churned'], normalize='columns').round(2)[1].to_dict())", explanation: "normalize='columns' → plan mix AMONG churners: 75% of churners were monthly. Different question ('who are the churners?'), different denominator, both true — quoting one as the other is the classic percentage swindle." },
          ],
          output: "{0: {'annual': 0.75, 'monthly': 0.5}, 1: {'annual': 0.25, 'monthly': 0.5}}\n{'annual': 0.25, 'monthly': 0.75}",
        },
        {
          difficulty: "Hard",
          title: "One outlier manufactures a correlation",
          scenario: "See r = 0.93 appear from nothing — and Spearman call the bluff.",
          steps: [
            { code: "import numpy as np\ndf = pd.DataFrame({\n    'x': [1, 2, 3, 4, 5, 100],\n    'y': [7, 3, 9, 2, 6, 95],\n})", explanation: "Five points of pure noise (x 1–5 vs scrambled y) plus one extreme point at (100, 95)." },
            { code: "print(round(df['x'].corr(df['y']), 2))", explanation: "Pearson: 0.99! The single far-away point dominates the line-fitting — the 'relationship' is one observation." },
            { code: "print(round(df['x'].corr(df['y'], method='spearman'), 2))\nprint(round(df['x'][:5].corr(df['y'][:5]), 2))", explanation: "Spearman (rank-based) says 0.31 — weak. And Pearson WITHOUT the outlier: -0.21 — nothing. The Pearson-Spearman gap was the alarm; the leave-out check was the verdict. Never trust an unvisualised r." },
          ],
          output: "0.99\n0.31\n-0.21",
        },
        {
          difficulty: "Industry Example",
          title: "A feature screen before modelling",
          scenario: "A data scientist screens features against churn, shortlists honestly, and writes findings without causal overreach.",
          steps: [
            { code: "import pandas as pd\ndf = pd.DataFrame({\n    'churned':        [1,1,1,1,0,0,0,0,0,0],\n    'support_tickets':[5,4,6,3,1,0,1,2,0,1],\n    'tenure_months':  [2,3,1,4,18,24,12,30,22,15],\n    'logins_per_week':[1,2,1,3,2,1,3,2,1,2],\n})", explanation: "Ten customers, three candidate features. The screen: correlate each with churn." },
            { code: "screen = df.corr()['churned'].drop('churned').round(2)\nprint(screen.to_dict())", explanation: "tickets +0.87, tenure -0.85, logins -0.09. Two strong candidates, one dud. But screening across many features guarantees some large-by-chance values — these are shortlist entries, not conclusions." },
            { code: "print(df.groupby('churned')['tenure_months'].median().to_dict())", explanation: "Deep-dive the survivors: churners' median tenure 2.5 vs 20 for retained — a large, honest difference. The writeup: 'churn is strongly ASSOCIATED with short tenure and high ticket volume; whether tickets cause churn or failing customers file tickets needs investigation' — findings shortlisted, causality left unclaimed." },
          ],
          output: "{'support_tickets': 0.87, 'tenure_months': -0.85, 'logins_per_week': -0.09}\n{0: 20.0, 1: 2.5}",
        },
      ],
    },

    {
      id: "inline-practice",
      type: "inline-code",
      tocLabel: "Practice Coding",
      coding: {
        language: "python",
        filename: "bivariate_practice.py",
        instructions:
          "An app dataset: correlate sessions with purchases, compare purchases across device types with the honest statistic, and build the conversion crosstab with the right denominator.",
        starterCode: `import pandas as pd

df = pd.DataFrame({
    'sessions':  [2, 8, 5, 12, 3, 15, 7, 20],
    'purchases': [0, 3, 1, 5, 1, 6, 2, 9],
    'device':    ['ios','ios','android','ios','android','ios','android','ios'],
    'converted': [0, 1, 0, 1, 1, 1, 0, 1],
})

# TODO 1: Pearson correlation sessions vs purchases (round 2)
r = ___

# TODO 2: Median purchases per device (a Series)
med_by_device = ___

# TODO 3: Conversion RATE per device via crosstab
#         (normalize='index'; keep just the converted==1 column)
conv_rate = ___

print(r)
print(med_by_device.to_dict())
print(conv_rate.round(2).to_dict())`,
        solutionCode: `import pandas as pd

df = pd.DataFrame({
    'sessions':  [2, 8, 5, 12, 3, 15, 7, 20],
    'purchases': [0, 3, 1, 5, 1, 6, 2, 9],
    'device':    ['ios','ios','android','ios','android','ios','android','ios'],
    'converted': [0, 1, 0, 1, 1, 1, 0, 1],
})

r = round(df['sessions'].corr(df['purchases']), 2)

med_by_device = df.groupby('device')['purchases'].median()

conv_rate = pd.crosstab(df['device'], df['converted'], normalize='index')[1]

print(r)
print(med_by_device.to_dict())
print(conv_rate.round(2).to_dict())`,
        expectedOutput: "0.99\n{'android': 1.0, 'ios': 5.0}\n{'android': 0.33, 'ios': 0.8}",
        hints: [
          "Task 1: df['sessions'].corr(df['purchases']) — wrap in round(..., 2).",
          "Task 2: groupby('device')['purchases'].median() — medians because purchase counts are typically skewed.",
          "Task 3: pd.crosstab(df['device'], df['converted'], normalize='index') gives each device's rate row; select column 1 (converted).",
          "normalize='index' divides each row by its own total — the per-device denominator that 'conversion rate by device' requires.",
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
          id: "pda20_mcq_01",
          difficulty: "Easy",
          question: "Which tool fits a numeric × categorical pair, like spend across plan types?",
          options: [
            "Pearson correlation between spend and plan",
            "Grouped comparison: groupby(plan)[spend] with median/mean and counts",
            "pd.crosstab(spend, plan)",
            "value_counts on spend",
          ],
          correctIndex: 1,
          explanation:
            "Mixed pairs call for comparing the numeric variable's distribution across groups. Correlation needs two numerics; crosstab needs two categoricals; value_counts is univariate.",
        },
        {
          type: "mcq",
          id: "pda20_mcq_02",
          difficulty: "Easy",
          question: "A Pearson r of 0.02 between age and spend means:",
          options: [
            "Age and spend are unrelated",
            "There is no strong LINEAR relationship — but a nonlinear one (e.g. U-shaped) could still exist and score near zero",
            "The data has errors",
            "Spearman would also be 0.02",
          ],
          correctIndex: 1,
          explanation:
            "Pearson measures only linear association. A perfect U-shape (high spend among young and old) can produce r ≈ 0. Visualisation or comparing across age bins would reveal it; Spearman catches monotonic but not U-shaped patterns.",
        },
        {
          type: "mcq",
          id: "pda20_mcq_03",
          difficulty: "Medium",
          question: "Pearson gives 0.95 but Spearman gives 0.20 for the same pair. Most likely explanation?",
          options: [
            "Spearman is broken on small data",
            "One or few extreme points dominate the Pearson calculation; the rank-based Spearman shows the bulk of the data barely co-moves",
            "The relationship is perfectly linear",
            "The columns are categorical",
          ],
          correctIndex: 1,
          explanation:
            "Outliers inflate Pearson (which uses raw distances) but not Spearman (which uses ranks — the outlier is just 'largest'). A big Pearson-Spearman gap is the standard outlier/nonlinearity alarm: visualise before believing either.",
        },
        {
          type: "scenario",
          id: "pda20_sc_01",
          difficulty: "Medium",
          scenario:
            "A slide claims: '80% of churned users were on the monthly plan — monthly users are at extreme risk!' The underlying data: 80% of ALL users are on the monthly plan, and churn rates are 10% for monthly vs 9% for annual.",
          question: "What's the error?",
          options: [
            "The numbers are fabricated",
            "Wrong denominator: the slide quotes plan mix AMONG churners (composition) as if it were churn risk PER plan; the rates (10% vs 9%) show plans barely differ",
            "Churn should use means",
            "The crosstab needed more rows",
          ],
          correctIndex: 1,
          explanation:
            "Monthly users dominate churners because they dominate EVERYONE. Risk comparisons need normalize='index' (rate within each plan); the slide used column-composition logic. Both numbers are true; only one answers the risk question.",
        },
        {
          type: "coding",
          id: "pda20_code_01",
          difficulty: "Hard",
          prompt:
            "Print two correlations between x and y, rounded to 2 decimals: Pearson and Spearman.\n\ndf = pd.DataFrame({'x':[1, 2, 3, 4, 5, 50], 'y':[2, 1, 4, 3, 5, 60]})",
          starterCode:
            "import pandas as pd\n\ndf = pd.DataFrame({'x':[1, 2, 3, 4, 5, 50], 'y':[2, 1, 4, 3, 5, 60]})\n\n# Your code here\n",
          solutionCode:
            "import pandas as pd\n\ndf = pd.DataFrame({'x':[1, 2, 3, 4, 5, 50], 'y':[2, 1, 4, 3, 5, 60]})\n\nprint(round(df['x'].corr(df['y']), 2))\nprint(round(df['x'].corr(df['y'], method='spearman'), 2))",
          expectedOutput: "1.0\n0.83",
          tests: [
            { name: "Two methods", description: "corr() defaults to Pearson; method='spearman' switches to rank correlation" },
            { name: "Reading the gap", description: "Pearson 1.0 is dominated by the (50,60) point; Spearman 0.83 reflects the moderately ordered bulk — the gap is the outlier alarm" },
          ],
        },
        {
          type: "mcq",
          id: "pda20_mcq_04",
          difficulty: "Hard",
          question: "Users who enable feature X retain 2× better. Why can't EDA alone conclude 'X improves retention'?",
          options: [
            "Because the effect is too large to be real",
            "Self-selection: users who choose to enable X likely differ (more engaged) from those who don't — the comparison confounds the feature's effect with who adopts it; an experiment isolates the feature",
            "Retention can't be measured observationally",
            "2× differences require larger samples only",
          ],
          correctIndex: 1,
          explanation:
            "Adoption is not random: engaged users both enable features and retain. The five-explanations checklist (reverse causation, confounding, selection, chance) applies; a randomized rollout (A/B) is what earns 'improves'. EDA's honest output: 'X-enablers retain 2× — candidate for causal testing'.",
        },
      ],
    },

    {
      id: "interview-questions",
      type: "interview-questions",
      tocLabel: "Interview Prep",
      questions: [
        {
          question: "How do you analyse the relationship between two variables? Walk through the cases.",
          answer:
            "The type pair routes the analysis. Two numerics: correlation — Pearson for linear strength, Spearman as the robustness check — but never interpreted blind, because Pearson misses curves and gets manufactured by outliers; a big Pearson-Spearman gap sends me to a scatter plot. Numeric across categories: a group comparison — groupby with median, mean, AND count, applying the univariate discipline per group: skewed variable means medians, and small groups mean the difference is a rumour until sized. Two categoricals: pd.crosstab, where the entire skill is choosing normalize to match the question — normalize='index' compares rates across groups, normalize='columns' describes composition, and quoting one as the other is the classic percentage error. In all three cases the finding is stated as association ('churn differs by plan: 50% vs 25%'), with the causal question explicitly left open — EDA nominates relationships; experiments elect them.",
        },
        {
          question: "Give me concrete reasons a strong correlation might NOT mean causation, with examples.",
          answer:
            "Five distinct mechanisms. Reverse causation: sales and ad spend correlate — but many companies set ad budgets as a percentage of sales, so sales drive spend. Confounding: ice cream sales and drownings — summer drives both; in product data, user engagement confounds almost everything (engaged users adopt features AND retain AND spend). Selection effects: hospitals with the best surgeons show worse mortality because they take the hardest cases — who lands in the data isn't random. Chance under multiple comparisons: screen 190 metric pairs and several will correlate impressively by luck; spurious-correlations galleries (Nicolas Cage films vs pool drownings) exist because time series with trends correlate by default. And measurement artifacts: two metrics computed from the same underlying field correlate mechanically. The discipline: for any striking correlation, write down which of the five could apply before presenting — and phrase as 'associated with' until a design (randomization, natural experiment) rules the alternatives out.",
        },
        {
          question: "You're comparing a metric across customer segments. What could make the comparison misleading, and how do you guard it?",
          answer:
            "Four standard hazards. Skew and outliers: one whale in a segment inflates its mean — I compare medians (or trimmed means) and look at spread per segment, not just centres. Sample size asymmetry: a 15-customer segment 'outperforming' by 20% is likely noise — I always show n per group and treat small-group differences as hypotheses; formally, that's a significance question for the stats domain. Denominator confusion: 'segment A is 60% of complainers' versus 'segment A complains at 12%' answer different questions — I fix the question first, then pick the normalization. And composition/mix effects, the gateway to next lesson: segment A can beat B overall while losing within every subgroup, if the segments' internal mixes differ (Simpson's paradox) — so for any decision-bearing comparison I check whether the result survives splitting by the obvious third variables (region, tier, tenure). Guarding all four turns 'A is better than B' from a groupby output into a defensible sentence.",
        },
      ],
    },

    {
      id: "common-mistakes",
      type: "callout",
      variant: "warning",
      title: "Common Mistakes to Avoid",
      content:
        "1) Interpreting a correlation you never visualised — outliers and curves hide in bare r values. 2) Reading r ≈ 0 as 'no relationship' when it only means 'no LINEAR relationship'. 3) Comparing group means on skewed data — one whale rewrites the ranking; use medians. 4) Presenting differences between tiny groups without their sizes. 5) The denominator swindle: quoting composition ('80% of churners are monthly') as risk ('monthly users churn more'). 6) Mining a 20-column correlation matrix and reporting the winners as findings — screening inflates false positives. 7) Causal verbs ('drives', 'boosts') on observational associations. 8) Forgetting corr() pairwise-drops NaNs — cells may describe different subsets.",
    },

    {
      id: "ai-tutor",
      type: "callout",
      variant: "tip",
      title: "Ask the AI Tutor",
      content:
        "Try these prompts in the AI Tutor panel: • 'ELI5: dance partners vs puppet strings.' • 'Build me a dataset where Pearson and Spearman disagree, and explain why.' • 'Quiz me: which tool for each variable pair you invent?' • 'Give me five correlations; I'll name the likeliest non-causal explanation for each.' • 'Interview mode: I present a segment comparison, you attack its denominators and sample sizes.'",
    },

    {
      id: "glossary",
      type: "callout",
      variant: "info",
      title: "Glossary",
      content:
        "Bivariate — two variables analysed together. Pearson r — linear correlation, -1 to +1, via .corr(). Spearman — rank-based correlation; robust, catches monotonic patterns. Correlation matrix — all pairwise correlations (df.corr()); a screening tool. Group comparison — a numeric variable's distribution across category groups. Contingency table / crosstab — counts for category combinations (pd.crosstab). normalize='index'/'columns' — row-wise rates vs column-wise composition. Confounder — a third variable driving both members of a pair. Selection effect — non-random inclusion distorting a comparison. Association — co-occurrence; the honest word until causation is earned.",
    },

    {
      id: "resources",
      type: "callout",
      variant: "info",
      title: "Recommended Resources",
      content:
        "• Docs: pandas corr and crosstab references. • Look up: Anscombe's quartet (identical r, wildly different data) and the 'Spurious Correlations' gallery — ten minutes that permanently immunise. • Read: a primer on confounding and Simpson's paradox before the next lesson. • Practice: on any dataset, find your three strongest correlations, then try to BREAK each one: outlier check, Spearman check, segment split, and the five-explanations list. • Next in DSM: Multivariate Analysis — what happens to your bivariate findings when a third variable enters the room.",
    },

    {
      id: "recap",
      type: "recap",
      tocLabel: "Recap",
      content:
        "✓ The type pair picks the tool: correlation (num×num), group comparison (num×cat), crosstab (cat×cat).\n✓ Pearson sees only straight lines and bends to outliers; Spearman is the rank-based cross-check, and a gap between them is an alarm.\n✓ Group comparisons inherit univariate discipline: medians under skew, group sizes always attached.\n✓ In crosstabs the normalize direction IS the question — rates (index) versus composition (columns).\n✓ Correlation matrices generate shortlists, not findings — screening breeds chance 'discoveries'.\n✓ Every association has five candidate explanations; EDA lists them, experiments choose. Write 'associated with'.\n\nNext up: Multivariate Analysis. Your bivariate finding looks solid — until a third variable flips it. Segmentation, interaction effects, and Simpson's paradox await.",
    },
  ],
};
