import type { Lesson } from "@/lib/curriculum/types";

/** Skill unlocked: can read the shape of a distribution — spread, skew, and
 *  peaks — from a histogram, the visual grammar EDA is built on. */
export const distributionsIntuition: Lesson = {
  meta: {
    id: "foundations.stats-intro.distributions-intuition",
    slug: "distributions-intuition",
    title: "Distributions — An Intuition",
    description:
      "Develop a feel for what a distribution is — how values spread, cluster, and skew — and learn to read a histogram before ever plotting one in code.",
    estimatedTime: "25 mins",
    difficulty: "Beginner",
    xpReward: 50,
    prerequisites: ["foundations.stats-intro.mean-median-mode"],
    masteryThreshold: 80,
  },

  blocks: [
    /* ---------------------------------------------------------------- */
    /*  1 — Introduction                                                 */
    /* ---------------------------------------------------------------- */
    {
      id: "intro",
      type: "lesson-intro",
      tocLabel: "Introduction",
      intro: {
        hook: "Two coffee shops both average a 4.0-star rating. One earns straight 4s from everyone — reliable, unremarkable. The other is a war zone of 1s and 5s: people either adore it or storm out. Same average, opposite realities. The number that told you they were 'the same' threw away the most important thing about each shop: the shape of its reviews. Learn to see that shape — the distribution — and a column stops being a wall of numbers and starts telling you a story.",
        what: "A distribution describes how the values of a variable are spread out — where they cluster, how far they range, and whether they lean to one side. A histogram is the picture of a distribution: bars showing how many values fall into each range.",
        why: "A single average hides everything about spread and shape. Two datasets with identical means can behave completely differently. Reading a distribution is the first real move of exploratory data analysis (EDA) — it tells you where the data lives, whether outliers lurk, and which summary statistic to even trust.",
        whereUsed:
          "Every EDA notebook opens with histograms. Response-time monitoring, income studies, A/B test results, quality control — all start by looking at the shape of the data, not just its centre.",
        objectives: [
          "Explain what a distribution describes about a variable",
          "Read a histogram — bars, buckets, and what the height means",
          "Describe a distribution's centre, spread, and shape in words",
          "Recognise symmetric, right-skewed, and left-skewed shapes",
          "Connect a distribution's shape back to choosing mean vs. median",
        ],
        realWorldApps: [
          {
            company: "Cloudflare",
            headline: "Response times are read as distributions",
            detail:
              "Engineers never judge a service by its average latency alone — they look at the whole distribution, because a long tail of slow requests hides behind a healthy-looking mean.",
          },
          {
            company: "Duolingo",
            headline: "Session lengths cluster and skew",
            detail:
              "Most learners do short sessions, a few do marathon ones. The distribution of session length — not the average — is what tells the product team how people really use the app.",
          },
          {
            company: "Strava",
            headline: "Finish times form a telltale shape",
            detail:
              "Plot every runner's marathon time and you get a distinctive right-skewed shape with clusters near round-number goals. The distribution reveals behaviour an average would erase.",
          },
        ],
      },
    },

    /* ---------------------------------------------------------------- */
    /*  2 — Theory                                                       */
    /* ---------------------------------------------------------------- */
    {
      id: "theory",
      type: "theory-blocks",
      tocLabel: "Theory",
      blocks: [
        {
          type: "text",
          content:
            "A distribution is the answer to 'where do the values of this variable actually fall?' Instead of collapsing a column to one number, it keeps the whole picture: which values are common, which are rare, how wide the range is, and whether the data leans one way. You describe any distribution with three questions — where's the centre, how spread out is it, and what's its shape?",
        },
        {
          type: "keypoint",
          title: "Describe a distribution in three words",
          content:
            "Centre — roughly where the values pile up (mean or median from the last lesson). Spread — how far the values range, from tightly clustered to widely scattered. Shape — the silhouette: symmetric, skewed to one side, one peak or several. Every distribution description is these three things.",
        },
        {
          type: "text",
          content:
            "A histogram is how you see a distribution. You chop the range of values into equal buckets (called bins) and draw a bar for each, as tall as the number of values that fall in it. Tall bars are common ranges; short bars are rare ones. The overall silhouette of the bars is the shape of the data.",
        },
        {
          type: "analogy",
          title: "A histogram is a crowd sorted into height lanes",
          content:
            "Imagine asking a stadium crowd to stand in lanes marked by height — under 150cm, 150–160, 160–170, and so on — then looking down from above. The lanes in the middle are packed; the very short and very tall lanes have only a few people. That top-down view of how many people stand in each lane is exactly a histogram. The bumps and gaps you'd see are the distribution's shape.",
        },
        {
          type: "code-note",
          code: "reviews_A = [4, 4, 4, 4, 4]        # everyone gives 4 stars\nreviews_B = [1, 1, 5, 5, 4]        # love-it-or-hate-it\n# mean(A) = 4.0,  mean(B) = 3.2 ... close-ish average,\n# but the SHAPES are opposite: A is one tight spike,\n# B is split into two clumps at the extremes.",
          content:
            "The mean barely separates these, but their distributions are worlds apart. A is a single narrow spike (tiny spread); B is bimodal — two clusters at opposite ends. Only by looking at the shape do you see that B is polarising.",
        },
        {
          type: "text",
          content:
            "Shape has names worth knowing. A symmetric distribution looks roughly the same on both sides of its centre — heights and test scores often do. A skewed distribution has one long tail: right-skewed (or positive skew) has a tail stretching to high values, like income or house prices; left-skewed has a tail toward low values, like exam scores on an easy test where most people cluster near the top.",
        },
        {
          type: "analogy",
          title: "Skew points where the tail goes",
          content:
            "A skewed distribution is like a comet: a bright dense head where most values pile up, and a faint tail streaming off to one side. The direction the tail points is the direction of the skew. Right-skew has the tail pointing to the right (high values) — think incomes, where most people cluster low and a few billionaires stretch the tail far right. Remember: the skew is named for the tail, not the hump.",
        },
        {
          type: "warning",
          title: "Shape decides which average is honest",
          content:
            "This connects straight back to the last lesson. In a symmetric distribution, the mean and median sit together in the middle. In a right-skewed distribution, the long tail drags the mean toward the high values while the median stays near the hump — so the mean overstates the typical value. Reading the shape first is how you know which average to trust.",
        },
        {
          type: "expandable",
          title: "Why bin width matters",
          content:
            "The story a histogram tells depends on how wide you make the bins. Too few, very wide bins and you flatten everything into a couple of bars — real structure like a second peak vanishes. Too many, very narrow bins and every tiny wobble looks like a feature, so the shape turns into noise. The goal is enough bins to reveal the true silhouette without inventing detail. When you plot histograms in code later, you'll adjust the bin count and watch the shape change — a reminder that a histogram is a summary you designed, not an absolute truth.",
        },
      ],
    },

    /* ---------------------------------------------------------------- */
    /*  3 — Visual Learning                                              */
    /* ---------------------------------------------------------------- */
    {
      id: "diagram",
      type: "interactive-diagram",
      tocLabel: "Visual Learning",
      visual: {
        kind: "comparison",
        title: "Four Shapes You'll Meet Constantly",
        caption:
          "Click each shape to learn how to recognise it and what it means for your analysis. Naming the shape is the first move of exploring any variable.",
        nodes: [
          {
            id: "symmetric",
            label: "Symmetric",
            sublabel: "even both sides",
            detail:
              "One central hump, roughly mirror-image on the left and right — like adult heights or test scores. Mean and median sit together in the middle. Either average is a fair summary.",
            x: 22,
            y: 28,
            accent: true,
          },
          {
            id: "right-skew",
            label: "Right-skewed",
            sublabel: "tail to the high end",
            detail:
              "Most values pile up low, a long tail stretches toward high values — income, house prices, order sizes. The tail drags the mean above the median, so report the median.",
            x: 50,
            y: 28,
            accent: true,
          },
          {
            id: "left-skew",
            label: "Left-skewed",
            sublabel: "tail to the low end",
            detail:
              "Most values bunch high with a tail toward the low end — scores on an easy exam, age at retirement. The tail pulls the mean below the median.",
            x: 78,
            y: 28,
            accent: true,
          },
          {
            id: "bimodal",
            label: "Bimodal",
            sublabel: "two peaks",
            detail:
              "Two separate humps — often a sign two different groups are mixed together (e.g. commute times of drivers vs. cyclists). A single average would fall in the empty valley between them and describe nobody.",
            x: 36,
            y: 66,
            accent: true,
          },
          {
            id: "spread",
            label: "Spread",
            sublabel: "narrow vs. wide",
            detail:
              "How tightly values cluster around the centre. A narrow distribution is consistent and predictable; a wide one is variable and riskier. Two datasets with the same centre can have very different spreads.",
            x: 64,
            y: 66,
            accent: false,
          },
        ],
        edges: [
          { from: "symmetric", to: "spread", label: "also varies in" },
          { from: "right-skew", to: "spread", label: "watch the tail" },
          { from: "left-skew", to: "spread", label: "watch the tail" },
          { from: "bimodal", to: "spread", label: "two groups?" },
        ],
      },
    },

    /* ---------------------------------------------------------------- */
    /*  4 — Worked Examples                                              */
    /* ---------------------------------------------------------------- */
    {
      id: "worked-examples",
      type: "worked-examples",
      tocLabel: "Worked Examples",
      examples: [
        {
          difficulty: "Very Easy",
          title: "Build a tiny histogram by counting",
          scenario:
            "Ten app reviews came in: 5, 4, 5, 3, 4, 5, 5, 2, 4, 5. How are the ratings distributed?",
          steps: [
            {
              code: "ratings = [5,4,5,3,4,5,5,2,4,5]\n# count how many of each:\n# 2 -> 1,  3 -> 1,  4 -> 3,  5 -> 5",
              explanation:
                "A histogram is just counts per bucket. Tally how many times each rating appears — that count is the bar height for that value.",
            },
            {
              code: "# 2: #\n# 3: #\n# 4: ###\n# 5: #####",
              explanation:
                "Drawing the counts as bars shows the shape at a glance: the bars grow toward 5. Most reviews are positive, tailing off toward the low scores — a left-skewed shape.",
            },
          ],
          output: "The distribution leans high (left-skewed): most ratings are 4s and 5s.",
        },
        {
          difficulty: "Easy",
          title: "Same centre, different spread",
          scenario:
            "Two bus routes both average a 20-minute trip. Route A: 19, 20, 21, 20, 20. Route B: 8, 32, 20, 5, 35.",
          steps: [
            {
              code: "mean_A = 100/5 = 20\nmean_B = 100/5 = 20",
              explanation:
                "Both routes have the same centre — a 20-minute mean. If you stopped at the average, you'd call them identical.",
            },
            {
              code: "A ranges 19-21 (spread = 2)\nB ranges  5-35 (spread = 30)",
              explanation:
                "But the spreads are wildly different. Route A is tightly clustered and reliable; Route B swings from 5 to 35 minutes. Spread, not centre, is what a commuter actually cares about.",
            },
          ],
          output: "Identical means, opposite reliability — spread is the deciding feature.",
        },
        {
          difficulty: "Medium",
          title: "Naming the skew",
          scenario:
            "A freelancer's monthly incomes ($1000s) over a year: 3, 3, 4, 3, 4, 3, 5, 4, 3, 4, 3, 22.",
          steps: [
            {
              code: "# most months cluster at 3-5, one huge month at 22",
              explanation:
                "Picture the histogram: a tall clump of bars around 3–5 and a lone bar far out at 22. The dense hump is on the low side; a long tail reaches toward the high side.",
            },
            {
              code: "tail_points = 'right (toward high values)'\nshape = 'right-skewed'",
              explanation:
                "The tail points right, so this is right-skewed. The one big month (a large client project) stretches the tail. This is the classic shape of income data.",
            },
            {
              code: "mean ≈ 5.1  vs  median = 3.5",
              explanation:
                "As expected for right skew, the mean (5.1) is pulled above the median (3.5) by that tail. The median better describes a typical month — shape told you which to trust.",
            },
          ],
          output: "Right-skewed: the median (~3.5) is the honest 'typical month', not the mean.",
        },
        {
          difficulty: "Hard",
          title: "Spotting two hidden groups",
          scenario:
            "A gym logs member ages: 19, 21, 20, 22, 20, 64, 66, 63, 65, 67. The mean age is about 42.7.",
          steps: [
            {
              code: "mean = 427 / 10 = 42.7",
              explanation:
                "The mean age is 42.7 — but pause. Does anyone in the data look 42.7? Scan the values: they cluster near 20 and near 65, with nobody in the middle.",
            },
            {
              code: "cluster_1 = [19,20,20,21,22]   # students\ncluster_2 = [63,64,65,66,67]   # retirees",
              explanation:
                "The histogram would show two separate humps — a bimodal distribution. The single mean of 42.7 lands in the empty valley between them and describes no actual member.",
            },
            {
              code: "insight = 'two populations mixed: a morning-retiree crowd and an evening-student crowd'",
              explanation:
                "Bimodality is a flag that two different groups are blended together. The right move isn't a single average — it's to split the groups and describe each. The shape revealed a story the mean actively hid.",
            },
          ],
          output: "Bimodal → two distinct member groups; a single mean of 42.7 describes nobody.",
        },
        {
          difficulty: "Industry Example",
          title: "Reading an API latency distribution",
          scenario:
            "A site-reliability engineer checks whether a service is healthy. The average response time is a reassuring 120 ms, but she looks at the full distribution before signing off.",
          steps: [
            {
              code: "# histogram: a tall spike near 90-110ms,\n# then a long thin tail out past 2000ms",
              explanation:
                "Most requests are fast (the spike near 100 ms), but a thin tail stretches far to the right — a right-skewed distribution. The healthy-looking 120 ms mean is sitting on top of that hidden tail.",
            },
            {
              code: "mean = 120ms  but  p95 = 950ms,  p99 = 2100ms",
              explanation:
                "She reads the tail with percentiles: 95% of requests finish under 950 ms, but the slowest 1% take over 2 seconds. Those slow requests — invisible in the mean — are real users having a bad time.",
            },
            {
              code: "action = 'investigate the tail, not the average'",
              explanation:
                "Because she read the shape instead of trusting the mean, she catches a tail problem the average concealed. In performance work, the distribution's tail is often the whole story — and reading it is the skill this lesson builds.",
            },
          ],
          output: "The mean looked healthy; the right-skewed tail revealed the real problem. Shape > average.",
        },
      ],
    },

    /* ---------------------------------------------------------------- */
    /*  5 — Hands-on Practice / Activity                                 */
    /* ---------------------------------------------------------------- */
    {
      id: "inline-practice",
      type: "inline-code",
      tocLabel: "Practice Activity",
      coding: {
        language: "python",
        filename: "text_histogram.py",
        instructions:
          "Turn a list of numbers into a text histogram by counting how many fall into each bucket, then printing a bar of '#' for each count. This is exactly what a plotting library does under the hood. Fill the blanks and run it to see the shape.",
        starterCode: `scores = [2, 3, 3, 4, 4, 4, 4, 5, 5, 9]

# Count how many scores fall in each bucket (the value itself here).
counts = {}
for s in scores:
    counts[s] = counts.get(s, 0) + 1

# TODO: print each bucket followed by a bar of '#' repeated 'count' times.
for value in sorted(counts):
    count = counts[value]
    bar = "#" * ___          # repeat '#' count times
    print(value, bar)`,
        solutionCode: `scores = [2, 3, 3, 4, 4, 4, 4, 5, 5, 9]

counts = {}
for s in scores:
    counts[s] = counts.get(s, 0) + 1

for value in sorted(counts):
    count = counts[value]
    bar = "#" * count
    print(value, bar)`,
        expectedOutput: "2 #\n3 ##\n4 ####\n5 ##\n9 #",
        hints: [
          "A histogram bar's length equals the count for that bucket.",
          "In Python, '#' * 3 gives '###' — multiply the string by the count.",
          "The variable holding the count is 'count'.",
          "Notice the shape: a peak at 4 and a lone bar at 9 — a right-skewed distribution with one outlier.",
        ],
      },
    },

    /* ---------------------------------------------------------------- */
    /*  6 — Exercises + Quiz                                             */
    /* ---------------------------------------------------------------- */
    {
      id: "exercises",
      type: "mastery-assessment",
      tocLabel: "Quiz & Exercises",
      masteryThreshold: 80,
      exercises: [
        {
          type: "mcq",
          id: "fnd10_mcq_01",
          difficulty: "Easy",
          question: "What does the height of a bar in a histogram represent?",
          options: [
            "The average of the values in that range",
            "How many values fall into that range (bin)",
            "The largest value in the dataset",
            "The width of the range",
          ],
          correctIndex: 1,
          explanation:
            "A histogram bar's height is the count of values falling into that bin — its frequency. It isn't an average, a maximum, or the bin's width (that's the bar's horizontal size).",
        },
        {
          type: "mcq",
          id: "fnd10_mcq_02",
          difficulty: "Easy",
          question:
            "A distribution has most values bunched at the low end and a long tail stretching toward high values. What is it called?",
          options: [
            "Left-skewed",
            "Right-skewed",
            "Symmetric",
            "Bimodal",
          ],
          correctIndex: 1,
          explanation:
            "Skew is named for the direction of the tail. A tail toward high values is right-skew (positive skew) — the shape of income and house prices. A left tail would be left-skew; symmetric has no tail; bimodal has two peaks.",
        },
        {
          type: "mcq",
          id: "fnd10_mcq_03",
          difficulty: "Medium",
          question:
            "In a right-skewed distribution, how do the mean and median compare?",
          options: [
            "The mean is pulled above the median by the tail",
            "The mean and median are always equal",
            "The median is pulled above the mean by the tail",
            "The mode is always the largest value",
          ],
          correctIndex: 0,
          explanation:
            "The long right tail drags the mean toward the high values, so the mean sits above the median. That's why the median is the more honest 'typical' value for right-skewed data. Mean and median only coincide in symmetric data.",
        },
        {
          type: "scenario",
          id: "fnd10_sc_01",
          difficulty: "Medium",
          scenario:
            "You plot the number of daily active users' session lengths and see two clear humps: one around 2 minutes and another around 45 minutes, with almost nothing in between.",
          question: "What is the most likely explanation?",
          options: [
            "The data is corrupted and should be discarded",
            "Two different groups are mixed together — e.g. quick-glance users and deep-session users",
            "The mean session length perfectly describes a typical user",
            "The distribution is right-skewed",
          ],
          correctIndex: 1,
          explanation:
            "Two separated humps (bimodal) usually means two populations are blended — here, brief-check users and long-engagement users. A single mean would land in the empty valley and describe nobody. The shape isn't corruption or simple skew.",
        },
        {
          type: "scenario",
          id: "fnd10_sc_02",
          difficulty: "Hard",
          scenario:
            "Two factories produce bolts with a target length of 50mm. Both have a mean of exactly 50mm. Factory X's lengths range 49.8–50.2mm; Factory Y's range 46–54mm.",
          question: "Which factory is better, and why can't the mean tell you?",
          options: [
            "They're equally good because their means match",
            "Factory X is better — its distribution is far narrower (less spread), so its bolts are more consistent; the equal means hide this",
            "Factory Y is better because it has a wider range",
            "The mean proves Factory Y has more defects",
          ],
          correctIndex: 1,
          explanation:
            "Identical means say nothing about consistency. Factory X's tight spread means almost every bolt is near-perfect; Factory Y's wide spread means many bolts are off-target. In quality control, spread is the whole point — and only the distribution, not the mean, reveals it.",
        },
        {
          type: "coding",
          id: "fnd10_code_01",
          difficulty: "Medium",
          prompt:
            "Measure spread with the range: given a list of values, print the difference between the largest and smallest (max - min). A bigger range means a wider distribution.",
          starterCode:
            "values = [19, 20, 21, 20, 35, 5]\n# Print the range: largest value minus smallest value\n",
          solutionCode:
            "values = [19, 20, 21, 20, 35, 5]\nprint(max(values) - min(values))",
          expectedOutput: "30",
          tests: [
            {
              name: "Computes spread",
              description: "Subtracts the minimum from the maximum.",
            },
            {
              name: "Output",
              description: "Prints 30 (35 - 5), the range of the data.",
            },
          ],
        },
      ],
    },

    /* ---------------------------------------------------------------- */
    /*  7 — Interview Questions                                          */
    /* ---------------------------------------------------------------- */
    {
      id: "interview-questions",
      type: "interview-questions",
      tocLabel: "Interview Prep",
      questions: [
        {
          question:
            "What is a distribution, and why do you look at one instead of just the mean?",
          answer:
            "A distribution describes how the values of a variable are spread out — where they cluster, how far they range, and whether they lean to one side. I look at it instead of just the mean because a single number throws away almost everything about the data. Two variables can share an identical mean while behaving completely differently: one tightly clustered and predictable, the other wildly variable or split into two groups. Looking at the distribution — usually via a histogram — tells me the centre, the spread, and the shape all at once. That's what reveals outliers, skew, and hidden subgroups, and it's why plotting histograms is the first thing I do in exploratory analysis before trusting any summary statistic.",
        },
        {
          question:
            "How do you describe the shape of a distribution, and what does skew tell you?",
          answer:
            "I describe a distribution with three things: its centre (roughly where values pile up), its spread (how far they range), and its shape (the silhouette). For shape, the key categories are symmetric — roughly mirror-image around the centre, like heights — and skewed, where one tail is longer than the other. Skew is named for the direction of the tail: right-skew has a long tail toward high values, which is typical of income, prices, and wait times; left-skew has a tail toward low values, like scores on an easy test. Skew matters because it tells me which summary to trust. In a right-skewed distribution the long tail drags the mean above the median, so the median is the honest 'typical' value. I also watch for multiple peaks — a bimodal shape usually signals two different groups mixed together, which is a cue to split them rather than summarise them as one.",
        },
        {
          question:
            "A histogram can look different depending on how you build it. What choices affect the picture, and how do you avoid fooling yourself?",
          answer:
            "The biggest lever is bin width, or equivalently the number of bins. Too few wide bins over-smooth the data and can erase real structure like a second peak; too many narrow bins turn random noise into fake features and make the shape look jagged and meaningless. So a histogram isn't an objective truth — it's a summary I designed, and I can accidentally design it to tell the wrong story. To avoid fooling myself I try a few bin widths and check that the shape is stable — genuine features like skew or bimodality persist across reasonable bin choices, while artifacts appear and vanish. I also mind the axis range and whether outliers are squashing everything into one bar. And I don't rely on the histogram alone; I cross-check with summary numbers like the median, percentiles, and the spread, and sometimes a boxplot, so the visual and the statistics agree before I draw a conclusion. The habit is to treat the first histogram as a question, not an answer.",
        },
      ],
    },

    /* ---------------------------------------------------------------- */
    /*  8 — Common Mistakes                                              */
    /* ---------------------------------------------------------------- */
    {
      id: "common-mistakes",
      type: "callout",
      variant: "warning",
      title: "Common Mistakes to Avoid",
      content:
        "1) Judging a variable by its mean alone and ignoring spread and shape. 2) Getting skew backwards — the skew is named for the tail's direction, not the hump's. 3) Reporting a single average for bimodal data, landing in the empty valley that describes nobody. 4) Trusting one histogram without trying another bin width, so noise looks like structure (or real structure gets smoothed away). 5) Forgetting that a long tail can hide serious outliers behind a healthy-looking average.",
    },

    /* ---------------------------------------------------------------- */
    /*  9 — AI Tutor Prompts                                             */
    /* ---------------------------------------------------------------- */
    {
      id: "ai-tutor",
      type: "callout",
      variant: "tip",
      title: "Ask the AI Tutor",
      content:
        "Try these prompts in the AI Tutor panel: • 'Describe a distribution in words and quiz me on its shape.' • 'ELI5: the difference between spread and centre.' • 'Give me two datasets with the same mean but different shapes and ask what differs.' • 'Show me a right-skewed vs. left-skewed example and let me name each.' • 'Interview mode: ask me why I plot a histogram before trusting the mean.'",
    },

    /* ---------------------------------------------------------------- */
    /*  10 — Glossary                                                    */
    /* ---------------------------------------------------------------- */
    {
      id: "glossary",
      type: "callout",
      variant: "info",
      title: "Glossary",
      content:
        "Distribution — how a variable's values are spread across their range. Histogram — a bar chart of counts per value-range, showing a distribution. Bin — one bucket (value range) in a histogram. Spread — how widely values range around the centre. Skew — asymmetry; a longer tail on one side (right/positive or left/negative). Symmetric — roughly mirror-image around the centre. Bimodal — two distinct peaks, often two mixed groups. Tail — the thin, stretched end of a distribution. Percentile — the value below which a given percent of the data falls (e.g. p95).",
    },

    /* ---------------------------------------------------------------- */
    /*  11 — Recommended Resources                                       */
    /* ---------------------------------------------------------------- */
    {
      id: "resources",
      type: "callout",
      variant: "info",
      title: "Recommended Resources",
      content:
        "• Interactive: Seeing Theory (seeing-theory.brown.edu) — its animated chapter on distributions builds intuition beautifully. • Practice: sketch the histogram shape you'd expect for house prices, adult heights, and dice rolls, then check your reasoning. • Reference: preview pandas' .hist() and .describe() to see how you'll generate these shapes and read spread in code. • Next in DSM: you can read the shape of one variable — next you'll reason about how two variables relate, and the trap of confusing correlation with causation.",
    },

    /* ---------------------------------------------------------------- */
    /*  12 — Recap                                                       */
    /* ---------------------------------------------------------------- */
    {
      id: "recap",
      type: "recap",
      tocLabel: "Recap",
      content:
        "✓ A distribution shows how a variable's values spread out — described by centre, spread, and shape.\n✓ A histogram pictures a distribution: bar height is the count of values in each bin.\n✓ Skew is named for the tail's direction — right-skew (income, prices) drags the mean above the median.\n✓ Two datasets with the same mean can have completely different spreads and shapes.\n✓ A bimodal shape (two peaks) usually means two groups are mixed and shouldn't share one average.\n\nNext up: Correlation Is Not Causation. You can now read one variable's shape — next you'll reason about two variables together, and learn to resist the field's most common error: assuming that because two things move together, one must cause the other.",
    },
  ],
};
