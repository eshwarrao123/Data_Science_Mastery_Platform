import type { Lesson } from "@/lib/curriculum/types";

export const univariateAnalysis: Lesson = {
  meta: {
    id: "data-analysis.eda.univariate-analysis",
    slug: "univariate-analysis",
    title: "Univariate Analysis",
    description:
      "Read one column at a time like a professional: centre vs spread vs shape for numerics, value_counts and cardinality for categoricals, and the skew/outlier diagnostics that decide which statistics you're allowed to trust.",
    estimatedTime: "35 mins",
    difficulty: "Intermediate",
    xpReward: 70,
    prerequisites: ["data-analysis.eda.eda-workflow"],
    masteryThreshold: 80,
  },

  blocks: [
    {
      id: "intro",
      type: "lesson-intro",
      tocLabel: "Introduction",
      intro: {
        hook: "'Average salary: ₹18 lakh' — technically true at a company where the median engineer earns ₹9 lakh and three founders earn crores. One column, one number, and the story is already wrong. Univariate analysis is learning to see a whole distribution where amateurs see an average — and it's the level of EDA where most numeric lies are either caught or committed.",
        what: "Univariate analysis examines one column at a time: for numeric columns, the centre (mean, median), spread (std, IQR, range), and shape (skew, modality, outliers); for categorical columns, the frequency table, cardinality, and balance. The tools are describe, quantile, value_counts, nunique — plus the judgement of which summary honestly represents which shape.",
        why: "Every downstream statistic inherits the distribution's quirks. Means mislead on skew; standard deviations mislead with outliers; a 'top category' means little in a column that's 90% one value. Bivariate and multivariate work built on misread columns is confidently wrong — this level is the foundation.",
        whereUsed:
          "The first pass of every EDA, sanity checks before dashboards quote any average, feature understanding before modelling (skew and rare categories drive preprocessing), and data drift monitoring in production.",
        objectives: [
          "Summarise numeric columns with centre, spread, AND shape — not just a mean",
          "Diagnose skew from mean-vs-median and quantiles",
          "Choose honest summaries: median/IQR for skewed data, mean/std for symmetric",
          "Read categorical columns via value_counts (with normalize=True), nunique, and the long tail",
          "Spot distribution red flags: spikes at defaults, impossible values, unexpected modality",
        ],
        realWorldApps: [
          {
            company: "Numbeo",
            headline: "Median, not mean, for cost of living",
            detail:
              "Salary and rent statistics are reported as medians because both are heavily right-skewed — a handful of penthouse rents would make the 'average' describe nobody's reality.",
          },
          {
            company: "Amazon",
            headline: "Delivery-time distributions",
            detail:
              "Operations tracks the P90 and P99 of delivery time, not the mean — the promise 'delivered by tomorrow' lives in the tail of the distribution, and means hide tails.",
          },
          {
            company: "LinkedIn",
            headline: "Feature drift monitoring",
            detail:
              "Production ML systems monitor each feature's univariate distribution over time; a shift in a column's shape (new spike, vanished category) flags upstream breakage before model quality craters.",
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
          title: "Three questions per numeric column",
          content:
            "Centre: what's typical? (mean, median). Spread: how much do values vary? (std, IQR, min–max). Shape: how are values arranged? (symmetric or skewed, one hump or several, outliers present?). A column isn't understood until all three are answered — and shape is the one that decides whether the other two were measured honestly.",
        },
        {
          type: "code-note",
          code: `s.describe()
# count, mean, std, min, 25%, 50% (median), 75%, max

s.quantile([0.01, 0.05, 0.5, 0.95, 0.99])   # tail detail
s.skew()                                     # >0 right skew, <0 left`,
          content:
            "describe() answers centre and spread in one call and hints at shape: compare mean to 50%, and min/max to the quartiles. The quantile call zooms into the tails — where delivery promises, risk, and outliers live. skew() quantifies asymmetry.",
        },
        {
          type: "keypoint",
          title: "The mean–median gap is a skew detector",
          content:
            "In a symmetric distribution mean ≈ median. Extreme values drag the MEAN toward themselves but barely move the MEDIAN — so mean ≫ median means right skew (income, prices, durations: most values modest, few huge), mean ≪ median means left skew. Rule of practice: report medians and IQRs for skewed columns, means and stds for symmetric ones — and when in doubt, both.",
        },
        {
          type: "code-note",
          code: `# Categorical columns: frequency, share, cardinality
s.value_counts()                  # counts, descending
s.value_counts(normalize=True)    # shares — always look at both
s.nunique()                       # cardinality
s.value_counts().head(10)         # the head; the tail is the rest`,
          content:
            "For categoricals the 'distribution' is the frequency table. normalize=True turns counts into shares — '4,812 orders from Delhi' means little until it's '61% of all orders'. Cardinality tells you whether this is a 5-value plan column or a 40,000-value free-text field wearing a category's clothes.",
        },
        {
          type: "text",
          content:
            "Balance matters as much as the top value: a category column that's 95% one value carries little information and will dominate any naive percentage; a long tail of hundreds of rare values usually needs grouping into 'other' before analysis. And a distribution's MODALITY — one hump or two — is a segmentation clue: bimodal session durations often mean two behaviours (browsers vs buyers) sharing one column.",
        },
        {
          type: "warning",
          title: "Spikes are messages",
          content:
            "A suspicious concentration at one exact value is rarely behaviour: a spike at 0 may be 'never activated' coded as zero; at -999 or 1900-01-01, a sentinel for missing; at exactly 100, a cap or data-entry default; at round numbers, human estimation. value_counts().head() on a NUMERIC column is the quick spike detector. Every spike gets the artifact interrogation from the workflow lesson before it's allowed to mean anything.",
        },
        {
          type: "analogy",
          title: "A distribution is a crowd, not a person",
          content:
            "Asking 'what's the average?' of a column is like describing a crowd by one representative. Fine if the crowd is uniform office workers (symmetric: the mean person exists). Absurd at a stadium mixing toddlers and athletes (bimodal: the 'average' person is neither). Misleading if three billionaires walk in (skew: the mean wealth describes no one present). Univariate analysis is looking at the actual crowd before choosing who speaks for it.",
        },
        {
          type: "expandable",
          title: "Percentiles as promises: P50, P90, P99",
          content:
            "Operations and engineering summarise distributions as percentiles because promises live in tails. 'Median delivery: 2 days' (P50) tells half the customers what to expect; 'P90: 4 days' bounds the experience of 90%; 'P99: 9 days' is what the unluckiest 1% endure — and what support tickets are made of. The mean answers a different question entirely (total workload ÷ items). When you hear a latency, delivery, or wait-time 'average', ask which percentile would change the decision — usually it's P90+, and usually nobody computed it. s.quantile(0.9) is one line; make it a habit for any duration-like column.",
        },
      ],
    },

    {
      id: "diagram",
      type: "interactive-diagram",
      tocLabel: "Visual Learning",
      visual: {
        kind: "decision-tree",
        title: "Reading one column honestly",
        caption: "Click through — the column's type and shape decide which summaries you may trust.",
        nodes: [
          { id: "col", label: "One column", sublabel: "numeric or categorical?", detail: "The first branch: numbers get distribution analysis; labels get frequency analysis. (Watch for impostors: zip codes are labels wearing digits.)", x: 50, y: 8, accent: true },
          { id: "num", label: "Numeric", sublabel: "describe + quantiles", detail: "Run describe(), then answer three questions: centre, spread, shape. Check the tails with quantile([.01,.99]).", x: 25, y: 30, accent: false },
          { id: "shape", label: "Shape check", sublabel: "mean vs median, skew()", detail: "Mean ≈ median → symmetric: mean/std are honest. Mean ≫ median → right skew: switch to median/IQR. Also: spikes (sentinels?) and modality (two humps = two populations?).", x: 25, y: 55, accent: true },
          { id: "report-num", label: "Honest summary", sublabel: "median/IQR or mean/std", detail: "Skewed → median + IQR + a note on the tail (P90/P99 for durations). Symmetric → mean + std. Always with the count.", x: 25, y: 82, accent: false },
          { id: "cat", label: "Categorical", sublabel: "value_counts + nunique", detail: "Frequency table with counts AND shares (normalize=True). Cardinality: 6 plans or 40,000 free-text values?", x: 75, y: 30, accent: false },
          { id: "balance", label: "Balance & tail", sublabel: "dominance, rare values", detail: "One value at 95%? Low information, dominates rates. Hundreds of singletons? Group the tail into 'other'. Variants of one label? Back to string cleaning.", x: 75, y: 55, accent: true },
          { id: "report-cat", label: "Honest summary", sublabel: "top-k + share + n_unique", detail: "Top categories with shares, cardinality, and the tail's total share. 'Delhi 61%, Pune 22%, 14 others 17%' beats a bare mode.", x: 75, y: 82, accent: false },
        ],
        edges: [
          { from: "col", to: "num", label: "numbers" },
          { from: "col", to: "cat", label: "labels" },
          { from: "num", to: "shape" },
          { from: "shape", to: "report-num" },
          { from: "cat", to: "balance" },
          { from: "balance", to: "report-cat" },
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
          title: "describe, then actually read it",
          scenario: "Order values through the three-question lens.",
          steps: [
            { code: "import pandas as pd\ns = pd.Series([220, 250, 240, 260, 230, 245, 3800])", explanation: "Seven orders. Six cluster near 240; one is 3800." },
            { code: "d = s.describe()\nprint(round(d['mean']), d['50%'])", explanation: "Centre, two ways: mean 749 vs median 245. The gap screams right skew — one value dragged the mean far above anything typical." },
            { code: "print(d['75%'] - d['25%'], d['max'] - d['min'])", explanation: "Spread, two ways: IQR is a modest 22.5 (the middle half is tight) while the range is 3580 (the tail is wild). Together: a tight cluster plus an extreme outlier — now you understand the column." },
          ],
          output: "749 245.0\n22.5 3580",
        },
        {
          difficulty: "Easy",
          title: "Categorical column, counts AND shares",
          scenario: "Where do orders come from — and how concentrated is it?",
          steps: [
            { code: "s = pd.Series(['Delhi']*61 + ['Pune']*22 + ['Goa']*9 + ['Jaipur']*5 + ['Kochi']*3)", explanation: "100 orders across 5 cities." },
            { code: "print(s.value_counts().head(3).to_dict())", explanation: "Counts rank the cities: Delhi 61, Pune 22, Goa 9. But counts alone don't convey concentration." },
            { code: "print(s.value_counts(normalize=True).head(2).round(2).to_dict())\nprint(s.nunique())", explanation: "Shares tell the story: Delhi is 61% — the business is one city plus a tail. Cardinality (5) confirms this is a true categorical, not free text." },
          ],
          output: "{'Delhi': 61, 'Pune': 22, 'Goa': 9}\n{'Delhi': 0.61, 'Pune': 0.22}\n5",
        },
        {
          difficulty: "Medium",
          title: "The spike that wasn't behaviour",
          scenario: "Session durations have a suspicious concentration — run the spike check.",
          steps: [
            { code: "import numpy as np\ns = pd.Series([0, 0, 0, 0, 0, 0, 12.5, 8.2, 45.1, 22.3, 15.8, 31.2])", explanation: "Twelve sessions. Something's off at zero." },
            { code: "print(s.value_counts().head(1).to_dict())\nprint((s == 0).mean().round(2))", explanation: "The spike detector: exactly 0 appears 6 times — 50% of all sessions. Real durations vary continuously; EXACT repetition at one value is a code, not a behaviour." },
            { code: "real = s[s > 0]\nprint(round(s.median(), 1), round(real.median(), 1))", explanation: "The zeros are 'app opened, never used' events logged as sessions. Including them, median duration is 4.1 minutes; excluding, 19.1. Which is 'true' depends on the question — but only an analyst who SAW the spike gets to choose." },
          ],
          output: "{0.0: 6}\n0.5\n4.1 19.1",
        },
        {
          difficulty: "Hard",
          title: "Two humps, two populations",
          scenario: "A rating column averages 3.0 — and the average is the least true thing about it.",
          steps: [
            { code: "s = pd.Series([1, 1, 2, 1, 1, 2, 5, 5, 4, 5, 5, 4])", explanation: "Twelve ratings. Mean incoming…" },
            { code: "print(round(s.mean(), 1))\nprint(s.value_counts().sort_index().to_dict())", explanation: "Mean 3.0 — 'average product'. But the frequency table shows almost NOBODY rated it 3: the distribution has humps at 1–2 and 4–5. It's bimodal." },
            { code: "low = (s <= 2).mean()\nprint(f'{low:.0%} hate it, {1-low:.0%} love it')", explanation: "The honest summary isn't a centre at all — it's 'polarised: 50% hate, 50% love'. Bimodality means two populations share the column, and the next analytical move is finding WHAT splits them (a bivariate question for the next lesson)." },
          ],
          output: "3.0\n{1: 4, 2: 2, 4: 2, 5: 4}\n50% hate it, 50% love it",
        },
        {
          difficulty: "Industry Example",
          title: "A delivery-time column, summarised for two audiences",
          scenario: "A logistics analyst must describe delivery times to (a) the exec dashboard and (b) the promise-setting team — same column, different honest summaries.",
          steps: [
            { code: "import pandas as pd\nd = pd.Series([1.2, 1.5, 1.8, 2.0, 2.1, 2.3, 2.4, 2.6, 3.0, 3.2, 4.1, 9.5, 11.0])", explanation: "Thirteen delivery times in days. describe() first: mean 3.6, median 2.4 — right-skewed (the two slow deliveries drag the mean), so medians for typical-case claims." },
            { code: "print('typical:', d.median(), 'days | IQR', round(d.quantile(0.75) - d.quantile(0.25), 2))", explanation: "For the exec dashboard: 'typical delivery 2.4 days, middle half within ~1.1 days of each other' — centre and spread in skew-honest units." },
            { code: "print('P90:', round(d.quantile(0.9), 1), '| P99:', round(d.quantile(0.99), 1))", explanation: "For the promise team: 90% of orders arrive within 8.4 days, the worst 1% take ~10.8. A 'delivered in 3 days' promise would break for a third of customers — visible only in the tail, never in the mean. One column, three numbers, two decisions correctly informed." },
          ],
          output: "typical: 2.4 days | IQR 1.1\nP90: 8.4 | P99: 10.8",
        },
      ],
    },

    {
      id: "inline-practice",
      type: "inline-code",
      tocLabel: "Practice Coding",
      coding: {
        language: "python",
        filename: "univariate_practice.py",
        instructions:
          "Profile a salary column and a department column: detect the skew, choose the honest centre, and summarise the categorical with shares.",
        starterCode: `import pandas as pd

salaries = pd.Series([32, 38, 35, 40, 36, 34, 39, 37, 400])   # in lakh
depts = pd.Series(['eng','eng','eng','eng','sales','sales','hr','eng','eng'])

# TODO 1: mean and median of salaries (round mean to 1 decimal)
mean_sal = ___
median_sal = ___

# TODO 2: Is it right-skewed? (True if mean > median)
right_skewed = ___

# TODO 3: Department shares (value_counts with normalize=True, rounded to 2)
dept_shares = ___

print(mean_sal, median_sal)
print(right_skewed)
print(dept_shares.to_dict())`,
        solutionCode: `import pandas as pd

salaries = pd.Series([32, 38, 35, 40, 36, 34, 39, 37, 400])   # in lakh
depts = pd.Series(['eng','eng','eng','eng','sales','sales','hr','eng','eng'])

mean_sal = round(salaries.mean(), 1)
median_sal = salaries.median()

right_skewed = mean_sal > median_sal

dept_shares = depts.value_counts(normalize=True).round(2)

print(mean_sal, median_sal)
print(right_skewed)
print(dept_shares.to_dict())`,
        expectedOutput: "76.8 37.0\nTrue\n{'eng': 0.67, 'sales': 0.22, 'hr': 0.11}",
        hints: [
          "Task 1: .mean() and .median() — the founder's 400 will pull one of them hard.",
          "Task 2: compare them: 76.8 > 37.0. The gap is the skew detector.",
          "Task 3: value_counts(normalize=True) gives shares summing to 1; .round(2) for readability.",
          "The honest salary summary is the median (37 lakh) — the mean (76.8) describes no actual employee.",
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
          id: "pda19_mcq_01",
          difficulty: "Easy",
          question: "A column's mean is 76.8 and its median is 37. What does this indicate?",
          options: [
            "The data is symmetric",
            "Strong right skew — a few large values drag the mean up while the median stays with the bulk",
            "A computational error",
            "Left skew",
          ],
          correctIndex: 1,
          explanation:
            "Extreme high values pull the mean toward themselves; the median resists. Mean far above median = right skew (typical for income, prices, durations). Left skew would show mean below median.",
        },
        {
          type: "mcq",
          id: "pda19_mcq_02",
          difficulty: "Easy",
          question: "Why look at value_counts(normalize=True) and not just value_counts()?",
          options: [
            "normalize sorts the values",
            "Shares reveal concentration and comparability — '61% of orders' informs where '4,812 orders' needs context",
            "Raw counts are usually wrong",
            "normalize removes missing values",
          ],
          correctIndex: 1,
          explanation:
            "Counts and shares answer different questions; shares expose dominance (one category at 95%?) and stay comparable across datasets of different sizes. Look at both.",
        },
        {
          type: "mcq",
          id: "pda19_mcq_03",
          difficulty: "Medium",
          question: "Session durations show the value 0.0 occurring in exactly 50% of rows, with the rest spread continuously between 2 and 60 minutes. Best interpretation?",
          options: [
            "Half of all sessions genuinely lasted zero minutes",
            "A spike at an exact value in continuous data is a code or artifact — likely 'never engaged' logged as 0 — and needs interrogation before any duration statistics are quoted",
            "The median must be reported as 0",
            "The data should be deleted",
          ],
          correctIndex: 1,
          explanation:
            "Real continuous behaviour doesn't repeat one exact value; spikes mean sentinel codes, defaults, or a distinct population (non-users). The analyst must decide — with disclosure — whether the question includes or excludes them.",
        },
        {
          type: "scenario",
          id: "pda19_sc_01",
          difficulty: "Medium",
          scenario:
            "A product's ratings average exactly 3.0. The PM concludes 'users feel neutral about the product' and deprioritises it. The value_counts: {1: 40%, 2: 8%, 4: 10%, 5: 42%}.",
          question: "What did the PM miss?",
          options: [
            "Nothing — 3.0 is neutral",
            "The distribution is bimodal: almost nobody is neutral; users are polarised between love and hate, which demands segmentation, not deprioritisation",
            "The mean was computed on the wrong column",
            "Ratings should use the mode",
          ],
          correctIndex: 1,
          explanation:
            "The mean landed where almost no user sits. Bimodality means two populations share the column — finding what separates the 1s from the 5s (a bivariate question) is the real insight the average erased.",
        },
        {
          type: "coding",
          id: "pda19_code_01",
          difficulty: "Hard",
          prompt:
            "For the wait-times Series, print three numbers on one line each: the median, the P90 (90th percentile), and the share of values strictly above 10 (rounded to 2 decimals).\n\ns = pd.Series([2, 3, 4, 3, 5, 4, 6, 3, 12, 18, 4, 5])",
          starterCode:
            "import pandas as pd\n\ns = pd.Series([2, 3, 4, 3, 5, 4, 6, 3, 12, 18, 4, 5])\n\n# Your code here\n",
          solutionCode:
            "import pandas as pd\n\ns = pd.Series([2, 3, 4, 3, 5, 4, 6, 3, 12, 18, 4, 5])\n\nprint(s.median())\nprint(s.quantile(0.9))\nprint(round((s > 10).mean(), 2))",
          expectedOutput: "4.0\n11.4\n0.17",
          tests: [
            { name: "Tail metrics", description: "quantile(0.9) gives the P90 (11.4); the boolean mean gives the share above threshold (2 of 12 → 0.17)" },
            { name: "Centre", description: "The median 4.0 describes the typical wait — the two long waits (12, 18) barely move it" },
          ],
        },
        {
          type: "mcq",
          id: "pda19_mcq_04",
          difficulty: "Hard",
          question: "For a right-skewed latency column, why does the ops team track P90/P99 rather than the mean?",
          options: [
            "Percentiles are cheaper to compute",
            "Promises and user pain live in the tail: P90/P99 bound what most/almost-all users experience, while the mean mixes the tail into one number that describes neither typical nor worst-case",
            "The mean is undefined for latencies",
            "P99 equals the mean in skewed data",
          ],
          correctIndex: 1,
          explanation:
            "'90% of requests complete within X' is an actionable bound; a mean latency is neither typical (median's job) nor a guarantee (percentile's job). Tails are where SLAs break and support tickets originate.",
        },
      ],
    },

    {
      id: "interview-questions",
      type: "interview-questions",
      tocLabel: "Interview Prep",
      questions: [
        {
          question: "How do you summarise a numeric column you've never seen, and how do you decide mean vs median?",
          answer:
            "I answer three questions in order: centre, spread, shape — because shape determines whether the first two were measured honestly. Mechanically: describe() for the overview, then the mean–median comparison as my skew detector, quantiles at 1/5/95/99% for tail behaviour, and value_counts().head() even on numeric columns to catch spikes at exact values. The mean-vs-median decision follows the shape: symmetric distributions → mean and std are efficient and honest; skewed distributions → median and IQR, because a few extremes make the mean describe nobody (the classic salary column). I also check modality — a bimodal column has no meaningful centre at all, and the summary becomes 'two populations: X% here, Y% there', which is a segmentation lead. And for duration-like columns I add P90/P99, because operational promises live in tails. The one-sentence version: never quote a centre until you've seen the shape.",
        },
        {
          question: "What do you look for in a categorical column beyond the most common value?",
          answer:
            "Four things. Cardinality first — nunique tells me whether it's a genuine categorical (6 plans) or free text in disguise (40,000 'categories'), which changes everything downstream. Balance second — value_counts with normalize: a column that's 95% one value carries little signal and will dominate any naive rate; conversely near-uniform categories mean no segment stands out. The tail third — hundreds of rare values usually need grouping into 'other' before analysis, and the tail is also where string-cleaning failures hide ('Delhi'/'delhi' variants inflating cardinality — a sign to loop back to cleaning). Unexpected values fourth — categories that shouldn't exist ('test', 'TBD', empty strings) are quality findings. I report top-k with shares plus the tail's aggregate share: 'Delhi 61%, Pune 22%, 14 others 17%' — that sentence carries concentration, diversity, and completeness, where a bare mode ('most orders: Delhi') carries almost nothing.",
        },
        {
          question: "Give examples of univariate red flags and what each usually means.",
          answer:
            "Spikes at exact values in continuous data: 0 is often 'never happened' coded as zero; -999, 9999, or 1900-01-01 are missing-value sentinels; exact caps (100, 255) suggest truncation at a system limit; round-number clustering suggests human estimation rather than measurement. Impossible values: negative durations, ages over 130, percentages over 100 — data errors by definition. Mean–median divergence: skew, so mean-based reporting is at risk. Bimodality: two populations sharing one column — mixed device types, mixed user tiers — and every whole-column statistic quietly averages the two. Suspicious completeness: a std of zero (constant column, no information) or perfectly uniform categories (synthetic or test data). Cardinality anomalies: 47 spellings of 30 cities is a cleaning failure; nunique equal to row count in a supposed category means it's an ID. Each red flag has the same follow-up: interrogate the mechanism before letting the column into bivariate work — because the next lesson's correlations and group comparisons inherit every one of these pathologies silently.",
        },
      ],
    },

    {
      id: "common-mistakes",
      type: "callout",
      variant: "warning",
      title: "Common Mistakes to Avoid",
      content:
        "1) Quoting a mean without ever comparing it to the median — skew goes undetected. 2) Reporting centre without spread: 'average 240' hides whether values run 230–250 or 10–3800. 3) Skipping value_counts on numeric columns and missing sentinel spikes (0, -999). 4) Treating a bimodal column's mean as 'typical' when nobody sits there. 5) Reading categorical counts without shares (or shares without counts). 6) Ignoring cardinality — analysing free text as if it were 6 tidy categories. 7) Using means for duration/latency promises when the tail (P90/P99) is what breaks. 8) Deleting spike values before asking what they encode.",
    },

    {
      id: "ai-tutor",
      type: "callout",
      variant: "tip",
      title: "Ask the AI Tutor",
      content:
        "Try these prompts in the AI Tutor panel: • 'ELI5: the crowd-not-a-person view of distributions.' • 'Give me five describe() outputs and I'll diagnose the shape of each.' • 'Quiz me: mean/std or median/IQR for columns you invent?' • 'Show me how a sentinel spike distorts every summary statistic.' • 'Interview mode: I summarise a column, you find what I failed to check.'",
    },

    {
      id: "glossary",
      type: "callout",
      variant: "info",
      title: "Glossary",
      content:
        "Univariate — one column at a time. Centre — typical value: mean (moment-based) or median (rank-based). Spread — variability: std, IQR (75th−25th percentile), range. Shape — the distribution's form: skew, modality, outliers. Right/left skew — long tail toward high/low values; drags the mean that direction. Bimodal — two humps; usually two populations in one column. Percentile / quantile — the value below which X% of data falls (P90 = quantile(0.9)). Sentinel — a code standing for 'missing/none' (0, -999). Cardinality — number of distinct values (nunique). Mode — most frequent value.",
    },

    {
      id: "resources",
      type: "callout",
      variant: "info",
      title: "Recommended Resources",
      content:
        "• Docs: pandas describe/quantile/value_counts references — small APIs, large mileage. • Read: any primer on 'why medians for income statistics', then a percentile-based SLO/SLA explainer (Google's SRE book chapter on monitoring is excellent) for the tail-thinking habit. • Practice: profile 5 numeric and 5 categorical columns of any public dataset; for each write ONE honest summary sentence and note which statistic you refused to use and why. • Next in DSM: columns understood alone — Bivariate Analysis asks how they move together: correlation, group comparisons, and cross-tabs.",
    },

    {
      id: "recap",
      type: "recap",
      tocLabel: "Recap",
      content:
        "✓ Three questions per numeric column: centre, spread, shape — and shape rules on the honesty of the other two.\n✓ Mean ≫ median = right skew → report median/IQR; symmetric → mean/std; durations → add P90/P99 for the tail.\n✓ Spikes at exact values are codes (sentinels, defaults, caps), not behaviour — interrogate before including or excluding.\n✓ Bimodality means two populations share the column; the 'centre' describes neither, and segmentation is the next move.\n✓ Categoricals: value_counts with counts AND shares, nunique for cardinality, and mind the long tail.\n\nNext up: Bivariate Analysis. Each column understood alone — now the questions that drive most findings: does X differ by Y, and how strongly do two columns move together?",
    },
  ],
};
