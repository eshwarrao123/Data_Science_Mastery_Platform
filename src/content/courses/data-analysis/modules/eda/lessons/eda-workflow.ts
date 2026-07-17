import type { Lesson } from "@/lib/curriculum/types";

export const edaWorkflow: Lesson = {
  meta: {
    id: "data-analysis.eda.eda-workflow",
    slug: "eda-workflow",
    title: "The EDA Workflow",
    description:
      "Turn 'look at the data' into a discipline: question-driven exploration, the four-phase EDA structure (frame, profile, explore, communicate), and the habits that separate insight from aimless chart-making.",
    estimatedTime: "30 mins",
    difficulty: "Intermediate",
    xpReward: 70,
    prerequisites: ["data-analysis.transformation.apply-and-transform"],
    masteryThreshold: 80,
  },

  blocks: [
    {
      id: "intro",
      type: "lesson-intro",
      tocLabel: "Introduction",
      intro: {
        hook: "Two analysts get the same dataset and the same afternoon. One produces forty charts and no conclusions. The other produces five findings, each with a number, a caveat, and a recommendation — and becomes the person leadership calls. The difference isn't talent or tooling: it's that the second one worked through a structured loop of questions, while the first just... looked around.",
        what: "Exploratory Data Analysis is the disciplined first investigation of a dataset: framing questions before touching data, profiling structure and quality, exploring from single columns outward to relationships, and communicating findings with their limitations. This lesson is the map; the next three lessons are the territory.",
        why: "EDA is where analyses succeed or fail. Skip it and you model artifacts, report distorted averages, and miss the segment that explains everything. Do it aimlessly and you drown in charts without answers. The workflow — not any individual technique — is what makes exploration produce decisions.",
        whereUsed:
          "The first days of every data science project, due diligence on any new data source, pre-modelling feature understanding, incident investigations ('why did the metric drop?'), and the analysis sections of every serious report.",
        objectives: [
          "Frame an EDA around explicit questions and hypotheses",
          "Run the profile phase: structure, quality, and summary statistics",
          "Order exploration: univariate → bivariate → multivariate",
          "Keep an insight log that distinguishes findings from artifacts",
          "Communicate results with numbers, caveats, and next questions",
        ],
        realWorldApps: [
          {
            company: "Airbnb",
            headline: "Exploration before every model",
            detail:
              "Pricing-model work starts with structured EDA on listing data — distribution checks, segment splits, outlier review — because a model trained on unexplored data ships whatever pathologies the data carried.",
          },
          {
            company: "The Financial Times",
            headline: "Data journalism pipelines",
            detail:
              "Data journalists run question-driven EDA on public datasets — framing hypotheses, profiling quality, testing relationships — and the published story is the communicate phase, caveats included.",
          },
          {
            company: "McKinsey",
            headline: "Due diligence under deadline",
            detail:
              "Consulting teams profile a client's data in days: quality audit first, then targeted questions tied to the engagement's hypotheses — a workflow, because there's no time for wandering.",
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
          title: "Phase 1 — Frame: questions before data",
          content:
            "Write down 3–7 questions the analysis should answer, plus your current guesses (hypotheses). 'What drives churn?' becomes 'Do short-tenure customers churn more? Does plan type matter? Is there a usage cliff before cancellation?'. Questions decide which columns matter, what 'done' looks like, and protect you from the infinite chart-space. They can evolve — but wandering starts the moment none are written.",
        },
        {
          type: "keypoint",
          title: "Phase 2 — Profile: structure, quality, summaries",
          content:
            "Before any question: what IS this data? Structure — shape, dtypes, one row means what, keys and grain. Quality — the full cleaning-module audit: nulls, duplicates, bad types, inconsistent categories, outliers. Summaries — describe() for numerics, value_counts for categoricals, date ranges for time. The profile phase decides whether answers can be trusted at all, and its output is the quality caveats your final report must carry.",
        },
        {
          type: "code-note",
          code: `# The profile pass, in one screen
df.shape; df.dtypes                    # structure
df.isna().mean().sort_values()         # quality: missingness
df.duplicated().sum()                  # quality: repeats
df.describe()                          # numeric summaries
df['category'].value_counts(normalize=True)  # categorical balance
df['date'].agg(['min', 'max'])         # time coverage`,
          content:
            "Every command here is from earlier modules — EDA's profile phase is the cleaning audit wearing its analysis hat. The point isn't running them; it's writing down what they say before moving on.",
        },
        {
          type: "keypoint",
          title: "Phase 3 — Explore: one column, two columns, many",
          content:
            "Univariate first: understand each important column's distribution alone — centre, spread, shape, outliers. Bivariate second: relationships between pairs — the correlations, group differences, and cross-tabs where most findings live. Multivariate last: interactions and segments — where a third variable changes a pairwise story. The order matters because each level's surprises are only interpretable if you understood the level below.",
        },
        {
          type: "text",
          content:
            "Through the explore phase, keep an insight log: every observation written as a sentence with a number — 'Weekend orders are 34% larger on average (₹820 vs ₹612)' — tagged as finding (interesting, checked), artifact (data quirk, e.g. the spike is a default value), or question (needs follow-up). This log, not your memory, becomes the report.",
        },
        {
          type: "keypoint",
          title: "Phase 4 — Communicate: findings, caveats, next questions",
          content:
            "The deliverable is not the notebook. It's a short structured summary: the 3–7 original questions with their answers, each finding stated with its number and its caveat ('churn concentrates in month 1 — but month-1 data predates the pricing change'), plus the new questions exploration raised. An EDA that ends with sharper questions than it started with has succeeded.",
        },
        {
          type: "warning",
          title: "The two failure modes",
          content:
            "Aimless tourism: charts without questions, hours in, nothing to report — prevented by Phase 1. Premature conclusions: shipping the first interesting pattern without checking whether it's an artifact (a default value, a merge fan-out, a segment mix change) — prevented by the insight log's finding-vs-artifact discipline and by asking 'what else would explain this?' before believing anything.",
        },
        {
          type: "analogy",
          title: "EDA is detective work, not sightseeing",
          content:
            "A detective arrives at a scene with questions — who benefits? when did it happen? — and lets evidence revise them. A tourist arrives with a camera and takes pictures of whatever looks striking. Both walk the same rooms; only one closes cases. The dataset is the scene, charts are the photographs, and the difference between analysis and decoration is whether a question preceded each shot.",
        },
        {
          type: "expandable",
          title: "EDA's origin, and its modern shape",
          content:
            "John Tukey's 1977 'Exploratory Data Analysis' argued statisticians should let data suggest hypotheses, not only test pre-registered ones — inventing box plots and stem-and-leaf displays along the way. The modern loop keeps his spirit with a caution he'd endorse: patterns found by exploration are hypothesis CANDIDATES, not conclusions. Explore freely, then confirm on held-out data or with proper tests (the math-statistics domain) before making claims — because torturing a dataset long enough always produces a 'pattern'. Automated profilers (ydata-profiling and friends) compress Phase 2 to one command and are worth using — but they can't frame your questions or judge finding-vs-artifact, which is why the workflow survives the tooling.",
        },
      ],
    },

    {
      id: "diagram",
      type: "interactive-diagram",
      tocLabel: "Visual Learning",
      visual: {
        kind: "flow",
        title: "The EDA loop",
        caption: "Click each phase — the arrows loop because answers breed better questions.",
        nodes: [
          { id: "frame", label: "Frame", sublabel: "questions + hypotheses", detail: "3–7 written questions with guesses attached. They select the columns that matter and define 'done'. No question, no chart.", x: 12, y: 20, accent: true },
          { id: "profile", label: "Profile", sublabel: "structure • quality • summaries", detail: "Shape, dtypes, grain; the quality audit from the cleaning module; describe/value_counts baselines. Output: trust level + caveat list.", x: 38, y: 10, accent: true },
          { id: "uni", label: "Univariate", sublabel: "each column alone", detail: "Distribution per important column: centre, spread, shape, outliers. The foundation every higher-level surprise is judged against.", x: 64, y: 18, accent: false },
          { id: "bi", label: "Bivariate", sublabel: "pairs", detail: "Correlations, group comparisons, cross-tabs. Where most findings live — 'X differs by Y' is the shape of most insights.", x: 84, y: 40, accent: false },
          { id: "multi", label: "Multivariate", sublabel: "segments & interactions", detail: "Does the X–Y story hold within each segment Z? Simpson's-paradox checks, interaction hunting, cohort views.", x: 68, y: 65, accent: false },
          { id: "log", label: "Insight log", sublabel: "finding / artifact / question", detail: "Every observation: one sentence, one number, one tag. The log is the raw material of the report — and the defence against memory rewriting the afternoon.", x: 40, y: 78, accent: true },
          { id: "comm", label: "Communicate", sublabel: "answers + caveats + next", detail: "Questions answered with numbers and limitations, artifacts disclosed, new questions listed. Loops back: the next EDA starts sharper.", x: 14, y: 60, accent: true },
        ],
        edges: [
          { from: "frame", to: "profile" },
          { from: "profile", to: "uni" },
          { from: "uni", to: "bi" },
          { from: "bi", to: "multi" },
          { from: "multi", to: "log" },
          { from: "log", to: "comm" },
          { from: "comm", to: "frame", label: "better questions" },
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
          title: "Frame before touching",
          scenario: "A churn dataset lands. Write the questions first.",
          steps: [
            { code: "questions = [\n    'What share of customers churned overall?',\n    'Does churn differ by plan type?',\n    'Do churned customers have shorter tenure?',\n]", explanation: "Three concrete questions, each answerable with a number. 'Understand churn' is a wish; these are tasks." },
            { code: "hypotheses = {\n    'plan': 'monthly plans churn more than annual',\n    'tenure': 'churn concentrates in the first 3 months',\n}", explanation: "Guesses written before looking. When data confirms or kills them you learn something either way — and you notice when a result surprises you." },
            { code: "print(len(questions), 'questions,', len(hypotheses), 'hypotheses')", explanation: "Thirty seconds of framing. Every chart in the session now has a reason to exist or gets skipped." },
          ],
          output: "3 questions, 2 hypotheses",
        },
        {
          difficulty: "Easy",
          title: "The profile pass",
          scenario: "Run the structure-and-quality screen and write down what it says.",
          steps: [
            { code: "import pandas as pd\nimport numpy as np\ndf = pd.DataFrame({\n    'cust':   ['c1','c2','c3','c4','c5'],\n    'plan':   ['monthly','annual','monthly','monthly', None],\n    'tenure': [2, 24, 1, 3, 14],\n    'churned':[1, 0, 1, 1, 0],\n})", explanation: "Five customers, one missing plan. Small, but the ritual is identical at 5M rows." },
            { code: "profile = {\n    'rows': len(df),\n    'missing_plan': int(df['plan'].isna().sum()),\n    'dupes': int(df.duplicated().sum()),\n    'churn_rate': df['churned'].mean(),\n}", explanation: "Structure, quality, and the headline baseline (60% churn) captured as data, not vibes. The missing plan becomes a caveat: plan-based findings rest on 4 of 5 rows." },
            { code: "print(profile)", explanation: "The profile is written BEFORE exploring relationships — it's the trust certificate every later finding cites." },
          ],
          output: "{'rows': 5, 'missing_plan': 1, 'dupes': 0, 'churn_rate': 0.6}",
        },
        {
          difficulty: "Medium",
          title: "Univariate → bivariate, in order",
          scenario: "Understand tenure alone, then test the churn-tenure hypothesis.",
          steps: [
            { code: "print(df['tenure'].describe().loc[['mean','50%','min','max']].to_dict())", explanation: "Univariate first: tenure runs 1–24 months, mean 8.8 but median 3 — right-skewed, so medians will be the honest comparison statistic." },
            { code: "by_churn = df.groupby('churned')['tenure'].median()", explanation: "Bivariate second: split tenure by the outcome. The univariate step already told us to compare medians, not means." },
            { code: "print(by_churn.to_dict())", explanation: "Churned customers' median tenure is 2 months vs 19 for retained — the hypothesis survives first contact. Into the insight log it goes, tagged 'finding', pending the caveats." },
          ],
          output: "{'mean': 8.8, '50%': 3.0, 'min': 1.0, 'max': 24.0}\n{0: 19.0, 1: 2.0}",
        },
        {
          difficulty: "Hard",
          title: "Catching an artifact before it ships",
          scenario: "A striking pattern appears — the workflow's job is to interrogate it before believing it.",
          steps: [
            { code: "df = pd.DataFrame({\n    'signup_source': ['ads','ads','organic','organic','ads','unknown','unknown','unknown'],\n    'ltv':           [120, 90, 300, 280, 110, 0, 0, 0],\n})", explanation: "Lifetime value by acquisition source. A naive groupby is about to 'discover' something dramatic." },
            { code: "print(df.groupby('signup_source')['ltv'].mean().to_dict())", explanation: "'unknown' customers have zero LTV! Fire the unknown channel? The finding-vs-artifact question: what ELSE explains this?" },
            { code: "zero_share = (df.loc[df['signup_source'] == 'unknown', 'ltv'] == 0).mean()\nprint(f'unknown rows with ltv==0: {zero_share:.0%}')", explanation: "100% exactly-zero is a data signature, not a behaviour: 'unknown' source turns out to mean accounts created before LTV tracking existed. Tagged artifact, logged, excluded with disclosure — instead of becoming next week's wrong strategy deck." },
          ],
          output: "{'ads': 106.66666666666667, 'organic': 290.0, 'unknown': 0.0}\nunknown rows with ltv==0: 100%",
        },
        {
          difficulty: "Industry Example",
          title: "A one-day EDA, end to end",
          scenario: "A marketplace analyst gets order data and one day to report 'what should we worry about?'. Watch the four phases compress into a disciplined sprint.",
          steps: [
            { code: "import pandas as pd\ndf = pd.DataFrame({\n    'order_id': range(1, 9),\n    'city':     ['Pune','Pune','Delhi','Delhi','Delhi','Goa','Goa','Goa'],\n    'amount':   [500, 520, 800, 780, 820, 200, 90000, 210],\n    'rating':   [4, 5, 4, 4, 5, 2, 3, 2],\n})\n# FRAME: Q1 where is revenue concentrated? Q2 is service quality uniform? Q3 any data risks?", explanation: "Phase 1 in a comment block: three questions scoped to 'what should we worry about?'. Phase 2's profile (not shown: shape, nulls, dupes — clean) flags one thing: an amount of 90,000." },
            { code: "med = df.groupby('city')['amount'].median()\nrating = df.groupby('city')['rating'].mean()\nprint(med.to_dict())\nprint(rating.round(2).to_dict())", explanation: "Phase 3: univariate said amounts are skewed (that 90,000 — logged as a question: bulk order or typo?), so medians per city. Bivariate: Delhi's typical order (800) is 4× Goa's (210), and Goa's ratings average 2.33 vs 4+ elsewhere." },
            { code: "report = [\n    'Revenue/order concentrates in Delhi (median 800 vs Goa 210)',\n    'Goa service quality is an outlier: mean rating 2.33 vs 4.3 elsewhere',\n    'CAVEAT: one 90k Goa order pending verification (typo or bulk?) — excluded from medians either way',\n]\nprint(len(report), 'findings for the deck')", explanation: "Phase 4: three sentences, each with a number, one explicit caveat, and a follow-up question. The notebook had a dozen more charts; the report has exactly what the question asked." },
          ],
          output: "{'Delhi': 800.0, 'Goa': 210.0, 'Pune': 510.0}\n{'Delhi': 4.33, 'Goa': 2.33, 'Pune': 4.5}\n3 findings for the deck",
        },
      ],
    },

    {
      id: "inline-practice",
      type: "inline-code",
      tocLabel: "Practice Coding",
      coding: {
        language: "python",
        filename: "eda_workflow_practice.py",
        instructions:
          "Run a mini profile-then-explore pass on a subscriptions table: capture the profile dict, answer one framed question with a groupby, and flag a suspicious pattern for the artifact check.",
        starterCode: `import pandas as pd

df = pd.DataFrame({
    'plan':    ['basic','pro','basic','pro','basic','basic'],
    'months':  [1, 18, 2, 24, 1, 0],
    'churned': [1, 0, 1, 0, 1, 1],
})

# TODO 1: Profile dict: rows, churn_rate (mean of churned), min_months
profile = {
    'rows': ___,
    'churn_rate': ___,
    'min_months': ___,
}

# TODO 2: Framed question: churn rate per plan (a Series)
churn_by_plan = ___

# TODO 3: Artifact check: how many rows have months == 0
#         (0 months might mean 'never activated', not 'instant churn')
zero_months = ___

print(profile)
print(churn_by_plan.to_dict())
print(zero_months)`,
        solutionCode: `import pandas as pd

df = pd.DataFrame({
    'plan':    ['basic','pro','basic','pro','basic','basic'],
    'months':  [1, 18, 2, 24, 1, 0],
    'churned': [1, 0, 1, 0, 1, 1],
})

profile = {
    'rows': len(df),
    'churn_rate': df['churned'].mean(),
    'min_months': int(df['months'].min()),
}

churn_by_plan = df.groupby('plan')['churned'].mean()

zero_months = (df['months'] == 0).sum()

print(profile)
print(churn_by_plan.to_dict())
print(zero_months)`,
        expectedOutput: "{'rows': 6, 'churn_rate': 0.6666666666666666, 'min_months': 0}\n{'basic': 1.0, 'pro': 0.0}\n1",
        hints: [
          "Task 1: len(df) for rows; the mean of a 0/1 column is a rate; df['months'].min() (wrap in int).",
          "Task 2: df.groupby('plan')['churned'].mean() — churn rate per plan in one line.",
          "Task 3: (df['months'] == 0).sum() counts the suspicious rows — booleans sum as 1s.",
          "Basic churns at 100%, pro at 0% — striking! But note the profile's min_months=0: one 'basic churner' may never have activated at all. That's the artifact question to chase before reporting.",
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
          id: "pda18_mcq_01",
          difficulty: "Easy",
          question: "What belongs FIRST in an EDA, before any pandas is run?",
          options: [
            "A correlation matrix",
            "Written questions and hypotheses the analysis should address",
            "Removing all outliers",
            "Training a baseline model",
          ],
          correctIndex: 1,
          explanation:
            "Questions select the columns that matter, define 'done', and prevent aimless chart tourism. Profiling and exploring follow; outlier decisions and models come much later.",
        },
        {
          type: "mcq",
          id: "pda18_mcq_02",
          difficulty: "Easy",
          question: "Why explore univariate distributions before bivariate relationships?",
          options: [
            "Univariate plots are prettier",
            "Each column's own distribution (skew, outliers, spread) determines how to read and measure relationships built on it — e.g. skew says compare medians, not means",
            "Bivariate analysis requires sorted data",
            "It's alphabetical convention",
          ],
          correctIndex: 1,
          explanation:
            "A group comparison of means is misleading on skewed data; a correlation is fragile under extreme outliers. You only know these dangers if you looked at each column alone first — the levels build on each other.",
        },
        {
          type: "mcq",
          id: "pda18_mcq_03",
          difficulty: "Medium",
          question: "In the insight log, what distinguishes a 'finding' from an 'artifact'?",
          options: [
            "Findings involve bigger numbers",
            "A finding reflects real-world behaviour and survives checks; an artifact is produced by the data's mechanics — default values, tracking gaps, merge fan-out",
            "Artifacts only occur in small datasets",
            "Findings come from charts, artifacts from tables",
          ],
          correctIndex: 1,
          explanation:
            "The zero-LTV 'unknown' segment looked like a finding but was a tracking-era artifact. The tag forces the question 'what else would explain this?' before a pattern ships as a conclusion.",
        },
        {
          type: "scenario",
          id: "pda18_sc_01",
          difficulty: "Medium",
          scenario:
            "Twenty minutes into exploring, an analyst finds that customers who contacted support churn at half the rate of those who didn't, and drafts a slide: 'Support contact halves churn — invest in proactive outreach.'",
          question: "What does the workflow demand before that slide ships?",
          options: [
            "A prettier chart",
            "Nothing — the number is computed correctly",
            "Interrogate the pattern: check confounders (tenure, plan), consider reverse causation and survivorship (short-lived customers may churn before ever contacting support), and tag it a hypothesis pending such checks",
            "Re-run the groupby with mean instead of median",
          ],
          correctIndex: 2,
          explanation:
            "An observational pattern is a hypothesis candidate, not a causal conclusion. Customers must survive long enough to contact support (survivorship), and engaged customers differ in many ways (confounding). The multivariate step and finding-vs-artifact discipline exist exactly for this slide.",
        },
        {
          type: "coding",
          id: "pda18_code_01",
          difficulty: "Hard",
          prompt:
            "Produce a mini profile report: print a dict with n_rows, n_missing_total (count of NaN cells in the whole frame), and top_city (the most frequent city).\n\ndf = pd.DataFrame({'city':['Pune','Delhi','Pune', None,'Pune'], 'amount':[100, None, 250, 300, 90]})",
          starterCode:
            "import pandas as pd\n\ndf = pd.DataFrame({'city':['Pune','Delhi','Pune', None,'Pune'], 'amount':[100, None, 250, 300, 90]})\n\n# Your code here\n",
          solutionCode:
            "import pandas as pd\n\ndf = pd.DataFrame({'city':['Pune','Delhi','Pune', None,'Pune'], 'amount':[100, None, 250, 300, 90]})\n\nreport = {\n    'n_rows': len(df),\n    'n_missing_total': int(df.isna().sum().sum()),\n    'top_city': df['city'].value_counts().idxmax(),\n}\nprint(report)",
          expectedOutput: "{'n_rows': 5, 'n_missing_total': 2, 'top_city': 'Pune'}",
          tests: [
            { name: "Frame-wide nulls", description: "isna().sum().sum() counts NaN cells across all columns: one city + one amount = 2" },
            { name: "Mode via value_counts", description: "value_counts().idxmax() returns the most frequent label, ignoring the NaN city" },
          ],
        },
        {
          type: "mcq",
          id: "pda18_mcq_04",
          difficulty: "Hard",
          question: "Why should patterns discovered during open-ended exploration be confirmed on new data or with formal tests before becoming claims?",
          options: [
            "pandas results are only approximate",
            "Searching many patterns in one dataset guarantees some will look striking by chance; exploration generates hypotheses, and treating them as conclusions is how spurious 'insights' ship",
            "Exploration corrupts the data it touches",
            "Formal tests are required by law",
          ],
          correctIndex: 1,
          explanation:
            "Examine enough cuts and something will always 'stand out' — multiple-comparisons chance dressed as insight. Tukey's own framing: exploration suggests hypotheses; confirmation (held-out data, proper tests) earns belief. That handoff is the boundary between EDA and statistics.",
        },
      ],
    },

    {
      id: "interview-questions",
      type: "interview-questions",
      tocLabel: "Interview Prep",
      questions: [
        {
          question: "Walk me through how you approach a dataset you've never seen.",
          answer:
            "Four phases. First I frame: before opening the file I write the questions the analysis exists to answer and my prior guesses — for a churn dataset, maybe 'does churn concentrate early?' and 'which plans leak?'. Second I profile: structure (shape, dtypes, what one row means, the key and grain), quality (the standard audit — missingness, duplicates, type problems, category inconsistencies, outliers), and baselines (describe, value_counts, date coverage). The profile sets the trust level and produces the caveats my findings will carry. Third I explore in strict order: univariate to understand each key column's distribution, bivariate for the relationships where findings usually live, multivariate to check whether stories survive segmentation. Throughout I keep an insight log — one sentence, one number, one tag: finding, artifact, or question. Fourth I communicate: the original questions with answers and caveats, artifacts disclosed, and the sharper questions exploration raised. The phases loop — good answers breed better questions — but skipping a phase is how analyses go wrong quietly.",
        },
        {
          question: "How do you avoid fooling yourself during EDA?",
          answer:
            "Three disciplines. First, hypotheses written before looking: when I predict 'monthly plans churn more' and the data agrees, that's modest evidence; when a pattern I never predicted appears, I treat it with extra suspicion, because surprise is where both discoveries and artifacts live. Second, the artifact interrogation: before believing any striking pattern I ask what data mechanics could produce it — default values (a spike at exactly 0 or -999), tracking-era gaps (segments that predate instrumentation), merge fan-out inflating one group, or mix shifts masquerading as trend changes. The exactly-zero LTV segment that turns out to predate LTV tracking is the canonical case. Third, respecting the exploration/confirmation boundary: cutting data enough ways always yields something striking by chance, so exploratory findings are labelled hypotheses and confirmed on new data or with proper tests before becoming claims. And mechanically: the insight log with finding/artifact/question tags — memory is an unreliable narrator of an afternoon's charts, and the log is what keeps the final report honest.",
        },
        {
          question: "What makes an EDA deliverable good, and what are the signs of a bad one?",
          answer:
            "A good deliverable answers the framed questions with numbers and carries its uncertainty visibly: each finding is one sentence with a magnitude ('churned customers' median tenure is 2 months vs 19'), a caveat where one exists ('plan analysis excludes the 8% with missing plan'), and artifacts are disclosed rather than silently dropped. It ends with the new questions raised — an EDA that sharpens the question set has done its job even when answers are 'the data can't tell us'. It's short: the notebook may hold forty charts, the summary holds five findings, because selection is the analyst's value-add. Bad deliverables have signatures: chart dumps with no prose (the reader is left to do the analysis); conclusions without denominators or caveats; means reported on distributions the analyst never looked at; causal language on observational cuts; and no mention of data quality at all — which tells me the profile phase never happened, and none of the numbers can be trusted to the digit they're quoted to.",
        },
      ],
    },

    {
      id: "common-mistakes",
      type: "callout",
      variant: "warning",
      title: "Common Mistakes to Avoid",
      content:
        "1) Opening the data before writing any questions — tourism mode engaged. 2) Skipping the profile phase and discovering the duplicate rows AFTER presenting the revenue numbers. 3) Jumping straight to correlations without univariate context — skew and outliers change which statistics are honest. 4) Believing the first striking pattern without the artifact interrogation. 5) Keeping insights in your head instead of a tagged log. 6) Delivering the notebook as the report — selection is the job. 7) Causal claims from observational cuts ('support contact halves churn'). 8) Quality caveats discovered but not attached to the findings they limit.",
    },

    {
      id: "ai-tutor",
      type: "callout",
      variant: "tip",
      title: "Ask the AI Tutor",
      content:
        "Try these prompts in the AI Tutor panel: • 'ELI5: detective vs tourist EDA.' • 'Help me frame questions for a food-delivery orders dataset.' • 'Quiz me: finding, artifact, or needs-more-info for scenarios you invent.' • 'Show me three ways an artifact can masquerade as an insight.' • 'Interview mode: I present an EDA summary, you challenge its caveats.'",
    },

    {
      id: "glossary",
      type: "callout",
      variant: "info",
      title: "Glossary",
      content:
        "EDA — exploratory data analysis: the disciplined first investigation of a dataset. Framing — writing questions and hypotheses before touching data. Profiling — structure + quality + summary pass; produces the trust level and caveats. Grain — what one row represents. Univariate/bivariate/multivariate — one column alone / pairs / three-plus interactions. Insight log — running list of observations, each with a number and a tag. Artifact — a pattern produced by data mechanics rather than real behaviour. Hypothesis candidate — an exploratory pattern awaiting confirmation. Confirmation — testing on new data or with formal statistics before claiming.",
    },

    {
      id: "resources",
      type: "callout",
      variant: "info",
      title: "Recommended Resources",
      content:
        "• Read: the opening chapters of Tukey's 'Exploratory Data Analysis' for the philosophy, and any modern write-up of 'question-driven EDA' for the practice. • Tools: ydata-profiling (automated profile reports) — use it to accelerate Phase 2, never to replace Phases 1 and 4. • Practice: pick any Kaggle dataset, write 5 questions BEFORE downloading, and hold yourself to the four-phase loop with a tagged insight log. • Next in DSM: the workflow's explore phase begins in earnest — Univariate Analysis, one column at a time.",
    },

    {
      id: "recap",
      type: "recap",
      tocLabel: "Recap",
      content:
        "✓ EDA is a loop: Frame (questions + hypotheses) → Profile (structure, quality, summaries) → Explore (uni → bi → multivariate) → Communicate (answers + caveats + next questions).\n✓ Questions before data: they select columns, define done, and prevent chart tourism.\n✓ The profile phase is the cleaning audit powering trust — its caveats attach to every finding.\n✓ Keep an insight log: one sentence, one number, one tag — finding, artifact, or question.\n✓ Interrogate striking patterns for artifacts (defaults, tracking gaps, fan-out) before believing them.\n✓ Exploration generates hypotheses; confirmation on new data or formal tests earns claims.\n\nNext up: Univariate Analysis. The workflow says start with single columns — next you'll master distributions: centre, spread, shape, and what value_counts and describe are really telling you.",
    },
  ],
};
