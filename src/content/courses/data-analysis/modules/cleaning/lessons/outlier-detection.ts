import type { Lesson } from "@/lib/curriculum/types";

export const outlierDetection: Lesson = {
  meta: {
    id: "data-analysis.cleaning.outlier-detection",
    slug: "outlier-detection",
    title: "Outlier Detection",
    description:
      "Detect extreme values with the IQR rule and z-scores, understand why the median-based methods win on skewed data, and — the real skill — decide whether each outlier is an error to fix or a signal to keep.",
    estimatedTime: "35 mins",
    difficulty: "Intermediate",
    xpReward: 70,
    prerequisites: ["data-analysis.cleaning.string-cleaning"],
    masteryThreshold: 80,
  },

  blocks: [
    {
      id: "intro",
      type: "lesson-intro",
      tocLabel: "Introduction",
      intro: {
        hook: "In 2010 a trader's 'fat finger' briefly wiped almost a trillion dollars off US markets — one extreme data point among billions. Delete it as noise and you erase the most consequential event of the day. Keep it unquestioned in your averages and every summary is distorted. Outliers force the one question statistics can't answer for you: is this a mistake, or is this the story?",
        what: "Outlier detection is finding values that lie unusually far from the rest: the IQR rule (beyond 1.5×IQR outside the quartiles — what box plots draw), z-scores (beyond ~3 standard deviations), and their treatments — investigate, fix, remove, cap (winsorize), or deliberately keep.",
        why: "Means, standard deviations, correlations, and regression are all outlier-sensitive: a single wild value can move them arbitrarily far. But outliers are also fraud, failures, and breakthroughs. Detection without judgement deletes discoveries; no detection at all reports distorted numbers.",
        whereUsed:
          "Fraud detection, sensor-fault screening, quality control, financial risk, and as a standard pre-modelling step — plus every EDA, where the extremes are often the first thing worth explaining.",
        objectives: [
          "Compute IQR fences and flag values outside them",
          "Compute z-scores and explain the 3-sigma convention",
          "Explain why IQR beats z-scores on skewed or contaminated data",
          "Choose a treatment: investigate, fix, remove, cap, or keep",
          "Report analyses with and without influential outliers",
        ],
        realWorldApps: [
          {
            company: "Visa",
            headline: "Transaction fraud screening",
            detail:
              "A card that usually spends $60 suddenly charging $4,000 abroad is an outlier against that customer's own history — flagged in milliseconds. Here outliers aren't cleaned away; they're the product.",
          },
          {
            company: "Tesla",
            headline: "Sensor fault vs real anomaly",
            detail:
              "Battery telemetry showing an impossible temperature spike may be a failing sensor (drop the reading) or a genuine thermal event (never drop it). Engineering pipelines separate physically-impossible from merely-extreme before any filtering.",
          },
          {
            company: "Booking.com",
            headline: "Price sanity in search rankings",
            detail:
              "A hotel accidentally listed at €1 per night would dominate 'best deal' rankings. Listing pipelines cap or quarantine price outliers so one typo doesn't distort an entire market's results.",
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
            "The IQR (interquartile range) method is the workhorse. Compute the 25th percentile (Q1) and 75th percentile (Q3); their gap is the IQR — the span of the middle half of the data. Anything below Q1 − 1.5×IQR or above Q3 + 1.5×IQR is flagged. This is exactly the rule box plots use to draw their whisker-and-dot outliers.",
        },
        {
          type: "code-note",
          code: `q1 = df['amount'].quantile(0.25)
q3 = df['amount'].quantile(0.75)
iqr = q3 - q1
lower, upper = q1 - 1.5 * iqr, q3 + 1.5 * iqr

outliers = df[(df['amount'] < lower) | (df['amount'] > upper)]
print(len(outliers), lower, upper)`,
          content:
            "Five lines you'll write hundreds of times. Because quartiles barely move when extremes change, the fences themselves are robust — wild values can't hide the fence that should catch them.",
        },
        {
          type: "keypoint",
          title: "Z-scores: distance in standard deviations",
          content:
            "z = (x − mean) / std measures how many standard deviations a value sits from the mean; |z| > 3 is the usual flag. It's principled for roughly normal data (99.7% lies within ±3σ) — but both the mean and std are themselves dragged by outliers, so a huge outlier inflates the std and can mask itself and others. This 'masking' is why z-scores mislead on contaminated or skewed data.",
        },
        {
          type: "code-note",
          code: `z = (df['amount'] - df['amount'].mean()) / df['amount'].std()
flagged = df[z.abs() > 3]`,
          content:
            "Two lines, but read the caveat above: on skewed data (income, prices, durations) the mean and std don't describe the bulk of the data, so the flags don't either. Default to IQR unless you know the distribution is roughly symmetric.",
        },
        {
          type: "keypoint",
          title: "The treatment menu — in order of preference",
          content:
            "1) Investigate: is it physically/logically possible? An age of 250 is an error; a $2M order might be real. 2) Fix: a misplaced decimal or unit mix-up (cm vs m) has a recoverable true value. 3) Remove: only for confirmed errors you can't fix — and count what you removed. 4) Cap (winsorize): clip to the fence or a percentile when extremes are real but would dominate — df['x'].clip(lower, upper). 5) Keep: real, important extremes stay — and you switch to robust statistics (median, IQR) or report with-and-without.",
        },
        {
          type: "warning",
          title: "Deleting outliers is a modelling decision, not hygiene",
          content:
            "Every removed point changes your conclusions, and 'it was far from the mean' is not evidence of error. The discipline: separate impossible (violates known constraints — negative quantities, ages over 130) from implausible (extreme but possible). Impossible values are data errors; implausible ones require investigation. When in doubt, run the analysis both ways and report both — if conclusions flip on a handful of points, that fragility IS the finding.",
        },
        {
          type: "analogy",
          title: "The smoke alarm and the fire",
          content:
            "An outlier detector is a smoke alarm: it tells you where smoke is, not whether it's burnt toast or a house fire. Silencing every alarm (deleting outliers) means never finding fires (fraud, failures, discoveries); treating every alarm as a fire (keeping everything unexamined) distorts daily life (your summary statistics). The alarm's job is to trigger investigation — never to make the decision.",
        },
        {
          type: "expandable",
          title: "Beyond one dimension: multivariate outliers",
          content:
            "A 2.1 m person and a 50 kg person are each unremarkable alone; a 2.1 m person weighing 50 kg is a screaming anomaly. Univariate fences can't see this — the anomaly lives in the RELATIONSHIP between columns. Multivariate methods measure it: Mahalanobis distance generalises the z-score using the covariance between features, and algorithms like Isolation Forest or Local Outlier Factor (both in scikit-learn) find points that are isolated in the joint feature space. Univariate IQR per column is the right first pass; remember its blind spot when rows can be individually plausible but jointly impossible.",
        },
      ],
    },

    {
      id: "diagram",
      type: "interactive-diagram",
      tocLabel: "Visual Learning",
      visual: {
        kind: "decision-tree",
        title: "From flagged value to decision",
        caption: "Click each node — detection triggers investigation, and only investigation picks the treatment.",
        nodes: [
          { id: "flag", label: "Flagged", sublabel: "IQR / z-score", detail: "A value fell outside the fences. This is the alarm, not the verdict — the method only measures distance from the bulk.", x: 50, y: 8, accent: true },
          { id: "possible", label: "Possible at all?", sublabel: "domain constraints", detail: "Check against hard constraints: negative quantities, ages over 130, dates in the future. Impossible values are errors by definition.", x: 50, y: 30, accent: true },
          { id: "fixable", label: "Error: fixable?", sublabel: "trace the cause", detail: "Misplaced decimal (4500 for 45.00), unit mix-ups (cm vs m), timezone shifts — if the true value is recoverable, correct it instead of deleting.", x: 20, y: 52, accent: false },
          { id: "remove", label: "Remove + count", sublabel: "last resort", detail: "Unfixable confirmed errors get dropped — with a recorded count and reason, so the cleaning is auditable.", x: 20, y: 78, accent: false },
          { id: "real", label: "Real: distorting?", sublabel: "influence check", detail: "The value is genuine. Ask whether it dominates the statistic you're reporting — compare mean vs median, or run with-and-without.", x: 78, y: 52, accent: false },
          { id: "cap", label: "Cap / robust stats", sublabel: "clip or median", detail: "If real extremes would drown the signal: winsorize with .clip(lower, upper), or switch to median/IQR summaries that resist them.", x: 63, y: 78, accent: true },
          { id: "keep", label: "Keep + report", sublabel: "the finding", detail: "If the extreme IS the story — fraud, a viral day, a system failure — it stays, gets investigated, and often becomes the headline of the analysis.", x: 92, y: 78, accent: true },
        ],
        edges: [
          { from: "flag", to: "possible" },
          { from: "possible", to: "fixable", label: "impossible" },
          { from: "possible", to: "real", label: "possible" },
          { from: "fixable", to: "remove", label: "no" },
          { from: "real", to: "cap", label: "yes" },
          { from: "real", to: "keep", label: "no / it's the story" },
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
          title: "See the distortion an outlier causes",
          scenario: "One wild value versus the mean and the median.",
          steps: [
            { code: "import pandas as pd\ns = pd.Series([40, 45, 50, 55, 60, 5000])", explanation: "Five typical values and one extreme. Watch what each summary does with it." },
            { code: "print(s.mean())", explanation: "The mean, 875, describes NO value in the data — five points sit near 50, one at 5000, none near 875." },
            { code: "print(s.median())", explanation: "The median, 52.5, still describes the typical value. This gap between mean and median is itself an outlier alarm." },
          ],
          output: "875.0\n52.5",
        },
        {
          difficulty: "Easy",
          title: "Compute IQR fences",
          scenario: "Flag delivery times that are unusually long or short.",
          steps: [
            { code: "s = pd.Series([30, 32, 35, 36, 38, 40, 41, 43, 45, 120])", explanation: "Nine plausible delivery minutes and one two-hour case." },
            { code: "q1, q3 = s.quantile(0.25), s.quantile(0.75)\niqr = q3 - q1\nlower, upper = q1 - 1.5*iqr, q3 + 1.5*iqr\nprint(lower, upper)", explanation: "Q1=34.25, Q3=42.5, IQR=8.25 → fences at 21.875 and 54.875. Note the 120 didn't drag the fences up — quartiles resist it." },
            { code: "print(s[(s < lower) | (s > upper)].tolist())", explanation: "Only the 120 falls outside. The fence caught exactly the value that needed explaining." },
          ],
          output: "21.875 54.875\n[120]",
        },
        {
          difficulty: "Medium",
          title: "Watch a z-score mask itself",
          scenario: "The same data, judged by z-scores — and why the result differs.",
          steps: [
            { code: "s = pd.Series([30, 32, 35, 36, 38, 40, 41, 43, 45, 120])\nz = (s - s.mean()) / s.std()", explanation: "The outlier inflates both the mean (46) and the std (~26.6) — the very yardsticks used to judge it." },
            { code: "print(round(z.iloc[-1], 2))", explanation: "The 120 scores z≈2.78 — under the |z|>3 threshold. The outlier stretched the ruler enough to measure itself as normal: masking." },
            { code: "print((z.abs() > 3).sum())", explanation: "Zero flags. The IQR method caught what the z-score missed on identical data — the practical reason IQR is the default for small or skewed samples." },
          ],
          output: "2.78\n0",
        },
        {
          difficulty: "Hard",
          title: "Winsorize with clip",
          scenario: "Real-but-extreme order values distort the average; cap them at the fences instead of deleting.",
          steps: [
            { code: "s = pd.Series([120, 150, 160, 180, 200, 2500])\nq1, q3 = s.quantile(0.25), s.quantile(0.75)\niqr = q3 - q1\nupper = q3 + 1.5*iqr\nprint(round(upper, 2))", explanation: "Fences from the quartiles: the upper fence lands at 252.5. The 2500 order is genuine — a bulk buyer — but one row shouldn't own the average." },
            { code: "capped = s.clip(upper=upper)\nprint(capped.tolist())", explanation: "clip replaces everything above the fence with the fence value: the 2500 becomes 252.5, all other rows pass through untouched, and the row itself survives." },
            { code: "print(round(s.mean(), 1), round(capped.mean(), 1))", explanation: "The mean falls from 551.7 to 177.1 — from describing nobody to describing the typical order, while the bulk buyer still counts (at reduced weight). Capping is a disclosed compromise between deleting and keeping." },
          ],
          output: "252.5\n[120.0, 150.0, 160.0, 180.0, 200.0, 252.5]\n551.7 177.1",
        },
        {
          difficulty: "Industry Example",
          title: "Triaging flagged transactions",
          scenario: "A payments analyst screens a day's transactions: flag with IQR, then separate the impossible from the merely extreme before anyone deletes anything.",
          steps: [
            { code: "import pandas as pd\ndf = pd.DataFrame({\n    'txn':    ['t1','t2','t3','t4','t5','t6','t7'],\n    'amount': [45.0, 60.0, 52.0, -30.0, 55.0, 48.0, 9800.0],\n})", explanation: "Seven card transactions. Two look odd: a negative amount and a 9800 charge on a card that usually spends ~50." },
            { code: "q1, q3 = df['amount'].quantile(0.25), df['amount'].quantile(0.75)\niqr = q3 - q1\nfence = (df['amount'] < q1 - 1.5*iqr) | (df['amount'] > q3 + 1.5*iqr)\nimpossible = df['amount'] < 0", explanation: "Two separate masks: the statistical flag (IQR fences) and the domain constraint (charges can't be negative — that's a refund miscoded as a charge). The distinction drives opposite treatments." },
            { code: "triage = df.loc[fence | impossible, ['txn','amount']].copy()\ntriage['verdict'] = ['fix: miscoded refund', 'investigate: possible fraud']\nprint(triage.to_string(index=False))", explanation: "t4 violates a hard constraint → route to correction. t7 is possible but extreme → route to fraud review, NOT deletion; if it's genuine it may be the most important row of the day. Nothing was silently dropped." },
          ],
          output: "txn  amount                     verdict\n t4   -30.0        fix: miscoded refund\n t7  9800.0  investigate: possible fraud",
        },
      ],
    },

    {
      id: "inline-practice",
      type: "inline-code",
      tocLabel: "Practice Coding",
      coding: {
        language: "python",
        filename: "outliers_practice.py",
        instructions:
          "Session durations (minutes) include some extremes. Compute the IQR fences, count the outliers, and compare the mean before and after capping at the upper fence.",
        starterCode: `import pandas as pd

s = pd.Series([12, 15, 14, 18, 20, 16, 22, 19, 17, 240])

# TODO 1: Q1, Q3, and the IQR
q1 = ___
q3 = ___
iqr = ___

# TODO 2: Fences, and the count of values outside them
lower = q1 - 1.5 * iqr
upper = q3 + 1.5 * iqr
n_outliers = ___

# TODO 3: Mean after clipping to the fences
capped_mean = ___

print(n_outliers)
print(round(s.mean(), 1), round(capped_mean, 1))`,
        solutionCode: `import pandas as pd

s = pd.Series([12, 15, 14, 18, 20, 16, 22, 19, 17, 240])

q1 = s.quantile(0.25)
q3 = s.quantile(0.75)
iqr = q3 - q1

lower = q1 - 1.5 * iqr
upper = q3 + 1.5 * iqr
n_outliers = ((s < lower) | (s > upper)).sum()

capped_mean = s.clip(lower, upper).mean()

print(n_outliers)
print(round(s.mean(), 1), round(capped_mean, 1))`,
        expectedOutput: "1\n39.3 17.9",
        hints: [
          "Task 1: s.quantile(0.25) and s.quantile(0.75); the IQR is their difference.",
          "Task 2: build a combined mask with | and .sum() the booleans. Q1=15.25, Q3=19.75, so the fences are 8.5 and 26.5 — only 240 escapes.",
          "Task 3: s.clip(lower, upper) replaces values beyond either fence with the fence itself; take .mean() of the result.",
          "The raw mean 39.3 describes no real session; after capping the 240 to 26.5 the mean 17.9 matches the typical session.",
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
          id: "pda12_mcq_01",
          difficulty: "Easy",
          question: "Under the IQR rule, a value is an outlier when it lies:",
          options: [
            "More than 3 standard deviations from the mean",
            "Below Q1 − 1.5×IQR or above Q3 + 1.5×IQR",
            "Outside the minimum and maximum",
            "More than 1.5× the median away from the median",
          ],
          correctIndex: 1,
          explanation:
            "The IQR rule fences the middle 50% (Q1 to Q3) extended by 1.5×IQR each way — the exact rule box plots draw. Standard deviations belong to the z-score method; the other options are made up.",
        },
        {
          type: "mcq",
          id: "pda12_mcq_02",
          difficulty: "Easy",
          question: "The mean of a column is 875 while its median is 52. What does this gap most likely signal?",
          options: [
            "The data is perfectly normal",
            "Extreme high values are dragging the mean far above the typical value",
            "The median was computed incorrectly",
            "The column contains strings",
          ],
          correctIndex: 1,
          explanation:
            "The mean chases extremes; the median doesn't. A mean an order of magnitude above the median is a classic sign of large outliers or heavy right skew — and a prompt to look at the extremes before reporting either number.",
        },
        {
          type: "mcq",
          id: "pda12_mcq_03",
          difficulty: "Medium",
          question: "Why can z-scores fail to flag a huge outlier that the IQR method catches?",
          options: [
            "Z-scores only work on integers",
            "The outlier inflates the mean and standard deviation used to compute z, stretching the yardstick until the outlier looks normal (masking)",
            "The IQR method uses more data",
            "Z-scores require the data to be sorted",
          ],
          correctIndex: 1,
          explanation:
            "z = (x−mean)/std, and both mean and std are outlier-sensitive — a wild value inflates the std, shrinking every z including its own. Quartiles barely move, so IQR fences stay honest. This masking effect is the core practical argument for IQR as the default.",
        },
        {
          type: "scenario",
          id: "pda12_sc_01",
          difficulty: "Medium",
          scenario:
            "An e-commerce analyst finds 30 orders above the IQR upper fence. Five have quantity 0 with positive revenue (impossible); the other 25 are large but plausible corporate orders. A colleague suggests dropping all 30 'to clean the data'.",
          question: "What's the right treatment?",
          options: [
            "Drop all 30 — they're flagged, so they're noise",
            "Keep all 30 — outliers must never be touched",
            "Fix or remove the 5 impossible rows; investigate the 25 plausible ones and keep/cap them with disclosure — they may be the most valuable customers",
            "Cap all 30 at the fence without looking at them",
          ],
          correctIndex: 2,
          explanation:
            "The flag is an alarm, not a verdict. Impossible rows (quantity 0 with revenue) are data errors — fix or remove and count them. Plausible large orders are likely real B2B demand; deleting them erases the top of the business. Treatment follows investigation, never the flag alone.",
        },
        {
          type: "coding",
          id: "pda12_code_01",
          difficulty: "Hard",
          prompt:
            "Using the IQR rule, print the outlier values in the Series, then print the median of the data with outliers excluded.\n\ns = pd.Series([200, 220, 210, 215, 225, 205, 1500, 230])",
          starterCode:
            "import pandas as pd\n\ns = pd.Series([200, 220, 210, 215, 225, 205, 1500, 230])\n\n# Your code here\n",
          solutionCode:
            "import pandas as pd\n\ns = pd.Series([200, 220, 210, 215, 225, 205, 1500, 230])\n\nq1, q3 = s.quantile(0.25), s.quantile(0.75)\niqr = q3 - q1\nmask = (s < q1 - 1.5*iqr) | (s > q3 + 1.5*iqr)\nprint(s[mask].tolist())\nprint(s[~mask].median())",
          expectedOutput: "[1500]\n215.0",
          tests: [
            { name: "Fences", description: "Q1=208.75, Q3=226.25, IQR=17.5 → fences at 182.5 and 252.5; only 1500 escapes" },
            { name: "Robust summary", description: "The median of the seven remaining values is 215.0, computed with ~mask" },
          ],
        },
        {
          type: "mcq",
          id: "pda12_mcq_04",
          difficulty: "Hard",
          question: "A row has height 2.10 m and weight 50 kg — each value passes its own column's IQR check. Which statement is correct?",
          options: [
            "The row cannot be an outlier, since both values passed",
            "It may be a multivariate outlier: the combination is anomalous even though each value is individually plausible, and univariate fences can't see that",
            "The IQR rule should have used 3.0×IQR instead",
            "Z-scores would definitely have caught it",
          ],
          correctIndex: 1,
          explanation:
            "Univariate methods check each column in isolation; this anomaly lives in the height-weight relationship. Detecting it needs multivariate tools — Mahalanobis distance or methods like Isolation Forest. Wider fences and univariate z-scores share the same blindness.",
        },
      ],
    },

    {
      id: "interview-questions",
      type: "interview-questions",
      tocLabel: "Interview Prep",
      questions: [
        {
          question: "Compare the IQR rule and z-scores for outlier detection. Which do you default to and why?",
          answer:
            "Both measure distance from the centre, but with different yardsticks. Z-scores use the mean and standard deviation: principled for roughly normal data, where |z|>3 flags the outermost 0.3%. Their weakness is that the yardstick itself is outlier-sensitive — a wild value inflates the std and can shrink every z-score below threshold, masking itself. The IQR rule uses quartiles, which barely move when extremes change, so the fences stay honest on skewed or contaminated data — and business data (revenue, durations, counts) is almost always right-skewed. So I default to IQR: it's the box-plot rule, it needs no distributional assumption, and it resists masking. I reach for z-scores when the data is genuinely near-normal or when the audience expects sigma-based language, and for anything multivariate I move past both to Mahalanobis distance or Isolation Forest, since per-column fences can't see anomalous combinations.",
        },
        {
          question: "You've flagged outliers — walk me through deciding what to do with them.",
          answer:
            "The flag starts an investigation; it never decides. First I split impossible from implausible using domain constraints: negative quantities, ages over 130, dates in the future are errors by definition. For those I try to fix before removing — misplaced decimals and unit mix-ups have recoverable true values — and anything I do remove gets counted and documented. For the merely extreme, I ask two questions: is it real, and does it distort what I'm reporting? A genuine $2M corporate order stays; if it would dominate a mean, I either switch to robust statistics like the median, cap at the fence with clip (winsorizing — disclosed, since it biases the data toward the centre), or report the analysis with and without it. That last one matters most: if the conclusion flips on a handful of points, the fragility is itself the finding. What I never do is silently delete whatever fell outside the fence — in fraud, failures, and demand spikes, the outliers are frequently the entire point of the analysis.",
        },
        {
          question: "How do outliers interact with the rest of the cleaning pipeline, and why treat them last?",
          answer:
            "Outlier detection assumes the values it measures are real, so every earlier cleaning step protects it from false alarms. Wrong types make it impossible — you can't fence a price column stored as strings. Unfixed structural issues create fake extremes: a unit mix-up where half the heights are in centimetres puts a cluster of 'outliers' at 100× scale; a misparsed CSV can shift columns entirely. Duplicates distort the quartiles that define the fences, and unimputed sentinel values like -999 for 'missing' show up as a spike of phantom outliers that are really nulls in disguise — a classic trap. So the order from the audit lesson holds: structure, types, duplicates, missing values, category consistency, and only then outliers, when every extreme value that remains is at least a genuine measurement. Treating them earlier means investigating artefacts of dirt rather than facts about the world — wasted effort at best, deleted real data at worst.",
        },
      ],
    },

    {
      id: "common-mistakes",
      type: "callout",
      variant: "warning",
      title: "Common Mistakes to Avoid",
      content:
        "1) Deleting whatever the fence flags — detection is an alarm, treatment needs investigation. 2) Using z-scores on skewed data and missing outliers through masking. 3) Forgetting sentinel values: -999 'missing' codes masquerade as outliers when they're really nulls. 4) Detecting outliers before fixing types, units, and duplicates — you'll chase artefacts. 5) Capping or removing without disclosure — winsorizing changes distributions and must be reported. 6) Checking columns only individually — plausible values can be jointly impossible (multivariate outliers). 7) Reporting only the cleaned result when conclusions differ with and without the extremes — that difference is the finding.",
    },

    {
      id: "ai-tutor",
      type: "callout",
      variant: "tip",
      title: "Ask the AI Tutor",
      content:
        "Try these prompts in the AI Tutor panel: • 'ELI5: the smoke-alarm view of outlier detection.' • 'Show me masking: build a dataset where z-scores miss what IQR catches.' • 'Quiz me on choosing treatments: fix, remove, cap, or keep.' • 'Explain Mahalanobis distance for the height-weight example.' • 'Interview mode: defend keeping an extreme value in a revenue report.'",
    },

    {
      id: "glossary",
      type: "callout",
      variant: "info",
      title: "Glossary",
      content:
        "Outlier — a value unusually far from the bulk of the data. IQR — interquartile range, Q3 − Q1, the span of the middle half. IQR rule — flag outside Q1 − 1.5×IQR / Q3 + 1.5×IQR (the box-plot rule). Z-score — (x − mean)/std, distance in standard deviations. Masking — an outlier inflating the std enough to hide itself from z-scores. Winsorizing / capping — clipping extremes to a fence or percentile (.clip). Robust statistic — one that resists outliers (median, IQR). Sentinel value — a code like -999 standing in for missing. Multivariate outlier — a row anomalous in the combination of its values.",
    },

    {
      id: "resources",
      type: "callout",
      variant: "info",
      title: "Recommended Resources",
      content:
        "• Docs: pandas quantile/clip references; scikit-learn's outlier detection guide (IsolationForest, LocalOutlierFactor) for the multivariate tier. • Read: any explainer of the box plot's construction — the 1.5×IQR whisker convention comes from Tukey's exploratory data analysis tradition. • Practice: take a real sales dataset, compare mean vs median per column, fence with IQR, and write one sentence per flagged value: fix, remove, cap, or keep — and why. • Next in DSM: cleaning is complete. The Data Transformation module begins with the most-used tool in analytics: GroupBy & Aggregation.",
    },

    {
      id: "recap",
      type: "recap",
      tocLabel: "Recap",
      content:
        "✓ IQR rule: fence at Q1 − 1.5×IQR and Q3 + 1.5×IQR — robust, assumption-free, the box-plot standard.\n✓ Z-scores suit near-normal data but suffer masking: outliers inflate the very std that judges them.\n✓ A mean far from its median is itself an outlier alarm.\n✓ Treatments in order: investigate → fix → remove (counted) → cap with clip → keep with robust stats or with-and-without reporting.\n✓ Separate impossible (constraint violations — always errors) from implausible (extreme but maybe real — often the story).\n✓ Univariate fences miss anomalous combinations — that's the multivariate tier (Mahalanobis, Isolation Forest).\n\nNext up: GroupBy & Aggregation — the Data Cleaning module is done, and Data Transformation begins with split-apply-combine, the pattern behind almost every business metric you've ever read.",
    },
  ],
};
