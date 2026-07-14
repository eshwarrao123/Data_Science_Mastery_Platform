import type { Lesson } from "@/lib/curriculum/types";

/** Skill unlocked: can compute and choose between mean, median, and mode, and
 *  explain which summary a given distribution calls for. */
export const meanMedianMode: Lesson = {
  meta: {
    id: "foundations.stats-intro.mean-median-mode",
    slug: "mean-median-mode",
    title: "Mean, Median, and Mode",
    description:
      "Summarise a column with the three measures of central tendency, and learn why a skewed distribution makes the median more honest than the mean.",
    estimatedTime: "25 mins",
    difficulty: "Beginner",
    xpReward: 50,
    prerequisites: ["foundations.understanding.reading-and-interpreting-data"],
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
        hook: "A recruiter tells you the 'average salary' on a team is $180,000. Sounds incredible — until you learn the team is four junior analysts on $60,000 and one founder on $660,000. Nobody actually earns the 'average'. That single number, honestly calculated, paints a completely false picture. The fix isn't more math; it's knowing which average to use. By the end of this lesson you'll pick the right one every time — and spot when someone's picked the wrong one to mislead you.",
        what: "A measure of central tendency is a single number that summarises 'the typical value' of a column. There are three: the mean (add up and divide), the median (the middle value when sorted), and the mode (the most frequent value).",
        why: "You can't eyeball a thousand numbers. Central tendency compresses a whole column into one representative value — the first thing you compute about any numeric variable. But the three measures disagree when data is skewed, and choosing wrong produces confident, misleading conclusions.",
        whereUsed:
          "Every summary statistic, dashboard, and report. Average order value, median house price, the most common product size — all are central-tendency choices made (well or badly) every day.",
        objectives: [
          "Compute the mean, median, and mode of a small dataset",
          "Explain what each measure actually represents",
          "Predict how an outlier moves the mean but not the median",
          "Choose the right measure for skewed vs. symmetric data",
          "Recognise when a reported 'average' is misleading",
        ],
        realWorldApps: [
          {
            company: "Zillow",
            headline: "House prices are reported as medians",
            detail:
              "Property sites quote the median home price, not the mean, because a handful of mansions would drag the mean far above what a typical home costs. The median resists those extremes.",
          },
          {
            company: "Glassdoor",
            headline: "Salary bands lean on the median",
            detail:
              "A few executive salaries inflate the mean pay for a role. Reporting the median gives job-seekers a truer sense of what most people in that role actually earn.",
          },
          {
            company: "Zara",
            headline: "The mode drives stock decisions",
            detail:
              "For clothing sizes, the most common size sold — the mode — matters more than any average. You can't stock a 'mean' shirt size; you stock more of the size people buy most.",
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
            "Central tendency answers one question: if I had to describe this whole column with a single number, what would it be? Three answers exist, and they mean different things. Knowing all three — and when they disagree — is what separates a careful analyst from someone who just types 'average'.",
        },
        {
          type: "keypoint",
          title: "The three measures",
          content:
            "Mean — add all values and divide by how many there are; the 'balance point' of the data. Median — sort the values and take the middle one (or the average of the two middle ones); the 50th-percentile value. Mode — the value that appears most often; the only measure that works for categories, not just numbers.",
        },
        {
          type: "text",
          content:
            "The mean uses every value, which is its strength and its weakness. Because it adds everything up, one extreme value pulls it hard — the $660k founder dragged a team of $60k earners up to a $180k 'average'. The mean is the balance point: put the numbers on a see-saw and the mean is where it tips level.",
        },
        {
          type: "analogy",
          title: "The median is the person standing in the middle",
          content:
            "Line up everyone on the team from lowest salary to highest and walk to the person in the exact middle of the line. Their salary is the median. It doesn't matter whether the person at the far end earns $660k or $6 million — the middle of the line doesn't move. That's why the median shrugs off outliers: it cares about position, not size. For our team, the median salary is $60k — a far more honest 'typical'.",
        },
        {
          type: "code-note",
          code: "salaries = [60, 60, 60, 60, 660]   # thousands\nmean   = sum(salaries) / 5   # 900 / 5 = 180\nsorted = [60, 60, 60, 60, 660]\nmedian = sorted[2]           # middle value = 60\n# The mean says 180. The median says 60. The median is honest here.",
          content:
            "Same five numbers, two very different summaries. The mean (180) is inflated by one large value; the median (60) reflects what four of the five people actually earn. When they disagree this much, the data is skewed.",
        },
        {
          type: "text",
          content:
            "The mode is the most frequent value. It's the only measure that works on categories — you can't take the 'mean' of favourite colours, but you can find the most common one. For numbers, the mode is useful when repetition matters: the most common shoe size, the most frequent star rating. A dataset can have one mode, several, or none.",
        },
        {
          type: "warning",
          title: "The mean lies on skewed data",
          content:
            "When data is skewed — meaning most values cluster on one side while a few large values stretch a long tail out the other way (income, house prices, city populations, wait times) — those extreme values drag the mean toward the tail. You'll study this shape in depth next lesson; for now, just know that in those cases the mean overstates the 'typical' value, and the median is the honest choice. Whenever someone quotes an average for money or size, ask: mean or median? The gap between them reveals the skew.",
        },
        {
          type: "expandable",
          title: "When does the mean beat the median?",
          content:
            "The median isn't always better — the mean has real advantages when data is roughly symmetric with no wild outliers, like heights or test scores. First, the mean uses every value, so it reflects small changes anywhere in the data that the median would ignore. Second, it has clean mathematical properties: totals and rates depend on it (average revenue per user times number of users gives total revenue — the median can't do that). The rule of thumb: symmetric, no big outliers → mean is fine and often preferred; skewed or outlier-prone → reach for the median.",
        },
        {
          type: "text",
          content:
            "One habit ties this together: never report a single 'average' without knowing the shape of the data behind it. If the mean and median are close, the data is fairly symmetric and either is fine. If they're far apart, the data is skewed and you must choose deliberately — and say which one you used.",
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
        title: "Three Ways to Say 'Typical'",
        caption:
          "Click each measure to see how it's computed, what it resists, and when to reach for it. The right choice depends on the shape of your data.",
        nodes: [
          {
            id: "mean",
            label: "Mean",
            sublabel: "add up ÷ count",
            detail:
              "The balance point — uses every value. Strength: reflects all the data and drives totals/rates. Weakness: one outlier drags it hard. Best for symmetric data with no extreme values.",
            x: 22,
            y: 30,
            accent: true,
          },
          {
            id: "median",
            label: "Median",
            sublabel: "the middle value",
            detail:
              "Sort the data and take the middle. Strength: ignores how extreme the outliers are — robust. Best for skewed data like income, prices, and wait times. This is why house prices are quoted as medians.",
            x: 50,
            y: 30,
            accent: true,
          },
          {
            id: "mode",
            label: "Mode",
            sublabel: "most frequent",
            detail:
              "The value that appears most often. The only measure that works on categories (favourite colour, most common size). A dataset can have one mode, many, or none.",
            x: 78,
            y: 30,
            accent: true,
          },
          {
            id: "skew",
            label: "Skewed data?",
            sublabel: "mean ≠ median",
            detail:
              "When a few large values stretch one tail, the mean is pulled toward it while the median stays put. A big gap between mean and median is the fingerprint of skew — and a signal to report the median.",
            x: 36,
            y: 68,
            accent: true,
          },
          {
            id: "choose",
            label: "Which to report?",
            sublabel: "shape decides",
            detail:
              "Symmetric, no big outliers → mean. Skewed or outlier-prone (money, sizes, counts) → median. Categorical → mode. Always name which one you used, because the choice changes the story.",
            x: 64,
            y: 68,
            accent: false,
          },
        ],
        edges: [
          { from: "mean", to: "skew", label: "pulled by outliers" },
          { from: "median", to: "skew", label: "resists outliers" },
          { from: "skew", to: "choose", label: "pick deliberately" },
          { from: "mode", to: "choose", label: "for categories" },
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
          title: "Compute the mean",
          scenario:
            "Five customers rated a coffee shop: 4, 5, 3, 4, 4 stars. What's the mean rating?",
          steps: [
            {
              code: "ratings = [4, 5, 3, 4, 4]\ntotal = 4 + 5 + 3 + 4 + 4   # 20",
              explanation:
                "The mean is the total of all values divided by how many there are. First add them: 20.",
            },
            {
              code: "mean = 20 / 5   # 4.0",
              explanation:
                "Divide by the count (5) to get 4.0. Because these values are close together with no outlier, the mean is a fair 'typical' rating.",
            },
          ],
          output: "Mean rating = 4.0 stars.",
        },
        {
          difficulty: "Easy",
          title: "Find the median",
          scenario:
            "Seven houses on a street sold for (in $1000s): 210, 240, 250, 260, 270, 300, 1900.",
          steps: [
            {
              code: "prices = [210, 240, 250, 260, 270, 300, 1900]  # already sorted",
              explanation:
                "The median is the middle value of the sorted list. With 7 values, the middle is the 4th one.",
            },
            {
              code: "median = prices[3]   # 260",
              explanation:
                "The 4th value is 260. Notice the one $1.9M mansion sits at the end but doesn't affect the middle — the median is $260k.",
            },
            {
              code: "mean = sum(prices) / 7   # 3430 / 7 = 490",
              explanation:
                "The mean is 490 — nearly double the median — because the mansion drags it up. Here the median ($260k) is the honest 'typical' price.",
            },
          ],
          output: "Median = $260k (honest); mean = $490k (inflated by one mansion).",
        },
        {
          difficulty: "Medium",
          title: "Median with an even count",
          scenario:
            "Six delivery times (minutes): 18, 22, 25, 27, 30, 35. There's no single middle value.",
          steps: [
            {
              code: "times = [18, 22, 25, 27, 30, 35]  # 6 values, sorted",
              explanation:
                "With an even count there are two middle values — the 3rd (25) and the 4th (27). The median is their average.",
            },
            {
              code: "median = (25 + 27) / 2   # 26.0",
              explanation:
                "Average the two middle values: (25 + 27) / 2 = 26. That's the median delivery time. Always sort first, then find the middle position(s).",
            },
          ],
          output: "Median delivery time = 26 minutes (average of the two middle values).",
        },
        {
          difficulty: "Hard",
          title: "Choosing the right measure",
          scenario:
            "A blog reports its 'average time on page' as 8 minutes to sound engaging. The actual times (seconds) are: 20, 25, 30, 22, 28, 1200.",
          steps: [
            {
              code: "times = [20, 25, 30, 22, 28, 1200]  # seconds\nmean = sum(times) / 6   # 1325 / 6 ≈ 221s ≈ 3.7 min",
              explanation:
                "One reader left the tab open for 1200 seconds (20 minutes), inflating the mean to about 3.7 minutes — not 8, but still misleading. That single value dominates the sum.",
            },
            {
              code: "sorted = [20, 22, 25, 28, 30, 1200]\nmedian = (25 + 28) / 2   # 26.5 seconds",
              explanation:
                "The median is 26.5 seconds — what a typical reader actually did. The lone 1200-second outlier (probably an abandoned tab) barely nudges it.",
            },
            {
              code: "honest_report = 'median ≈ 27 seconds, not minutes'",
              explanation:
                "The skew between mean and median exposes the outlier. The honest summary is the median: most readers spend under half a minute. Reporting the mean here would badly overstate engagement.",
            },
          ],
          output: "Median (26.5s) is honest; the mean is distorted by one abandoned tab.",
        },
        {
          difficulty: "Industry Example",
          title: "Summarising order values at an online store",
          scenario:
            "A data analyst at an e-commerce startup must report the 'typical order value' to the finance team from one day of orders.",
          steps: [
            {
              code: "# Most orders cluster around $30-50; a few bulk orders hit $5,000+\norders = [32, 45, 38, 41, 52, 5200, 47, 36]",
              explanation:
                "The analyst first looks at the shape: most orders are small, but a couple of bulk purchases are huge. That's classic right-skew — a warning that the mean will mislead.",
            },
            {
              code: "mean = sum(orders) / 8   # ≈ 686\nmedian = (41 + 45) / 2   # 43",
              explanation:
                "The mean order value is about $686, but the median is $43. A finance report claiming a $686 'typical' order would set wildly wrong expectations for a normal day.",
            },
            {
              code: "report = 'median order ≈ $43; note two bulk orders drove total revenue'",
              explanation:
                "The analyst reports the median as the typical order, and separately flags the bulk orders' effect on total revenue — using the mean only where it belongs (totals). Choosing the right measure, and explaining the outliers, is the real deliverable.",
            },
          ],
          output: "Typical order = $43 (median), with bulk orders reported separately — an honest, useful summary.",
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
        filename: "central_tendency.py",
        instructions:
          "Compute the mean and median of a small salary list by hand-coding the logic (no libraries). The list is deliberately skewed by one large value, so compare your two answers and see which is the honest 'typical'. Fill the blanks and run it.",
        starterCode: `salaries = [48, 52, 50, 49, 51, 300]  # thousands; one outlier

# TODO 1: Mean = total divided by count.
mean = ___ / len(salaries)

# TODO 2: Median = middle of the SORTED list.
s = sorted(salaries)          # [48, 49, 50, 51, 52, 300]
# 6 values -> average the two middle ones (index 2 and 3)
median = (s[2] + s[3]) / 2

print("Mean:", round(mean, 1))
print("Median:", median)
print("Honest typical value:", median)`,
        solutionCode: `salaries = [48, 52, 50, 49, 51, 300]  # thousands; one outlier

mean = sum(salaries) / len(salaries)

s = sorted(salaries)          # [48, 49, 50, 51, 52, 300]
median = (s[2] + s[3]) / 2

print("Mean:", round(mean, 1))
print("Median:", median)
print("Honest typical value:", median)`,
        expectedOutput: "Mean: 91.7\nMedian: 50.5\nHonest typical value: 50.5",
        hints: [
          "The mean's numerator is the total of every value — Python's sum() gives it directly.",
          "sum(salaries) is 550; dividing by 6 gives about 91.7.",
          "The list is already sorted into s; the two middle values are s[2]=50 and s[3]=51.",
          "Median = (50 + 51) / 2 = 50.5 — close to what five of six people earn, unlike the outlier-inflated mean of 91.7.",
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
          id: "fnd09_mcq_01",
          difficulty: "Easy",
          question: "How do you calculate the median of a sorted list of numbers?",
          options: [
            "Add them all and divide by the count",
            "Take the middle value (or the average of the two middle values)",
            "Take the value that appears most often",
            "Subtract the smallest from the largest",
          ],
          correctIndex: 1,
          explanation:
            "The median is the middle value of the sorted data, or the average of the two middle values when the count is even. Adding and dividing gives the mean, most-frequent gives the mode, and largest minus smallest gives the range.",
        },
        {
          type: "mcq",
          id: "fnd09_mcq_02",
          difficulty: "Easy",
          question:
            "Which measure of central tendency can be used for a categorical variable like 'favourite colour'?",
          options: ["Mean", "Median", "Mode", "None of them"],
          correctIndex: 2,
          explanation:
            "Only the mode works on categories — it's the most frequent value. Mean and median require numbers you can add or order, which favourite colours don't support.",
        },
        {
          type: "mcq",
          id: "fnd09_mcq_03",
          difficulty: "Medium",
          question:
            "A dataset of incomes has a mean of $85,000 and a median of $52,000. What does this gap tell you?",
          options: [
            "The data was entered incorrectly",
            "The data is right-skewed — a few high incomes pull the mean above the median",
            "The mode must be $85,000",
            "The data is perfectly symmetric",
          ],
          correctIndex: 1,
          explanation:
            "When the mean sits well above the median, a few large values are stretching the upper tail — right skew. For a 'typical' income you'd report the median. A large gap is the signature of skew, not an error, and says nothing about the mode.",
        },
        {
          type: "scenario",
          id: "fnd09_sc_01",
          difficulty: "Medium",
          scenario:
            "A landlord advertises that the 'average rent' on his properties is low, quoting the mean. Most of his flats are expensive, but he owns one tiny, nearly-free storage unit he counts as a 'property'.",
          question: "Why is his mean misleading, and what would you ask for?",
          options: [
            "It isn't misleading; the mean is always correct",
            "One very low value drags the mean down; ask for the median rent, which reflects a typical flat",
            "Ask for the mode, which is always the true rent",
            "Ask him to remove all cheap properties before averaging",
          ],
          correctIndex: 1,
          explanation:
            "The near-free unit is a low outlier pulling the mean down, making rents look cheaper than they are. The median rent would show what a typical flat actually costs. The mode isn't guaranteed meaningful here, and deleting data he legitimately owns isn't the fix — choosing the right measure is.",
        },
        {
          type: "scenario",
          id: "fnd09_sc_02",
          difficulty: "Hard",
          scenario:
            "You're reporting a team's productivity: tasks completed per person this week were 8, 9, 7, 8, 9, 8. Your manager asks whether to report the mean, median, or mode.",
          question: "What's the best recommendation and why?",
          options: [
            "It barely matters here — the data is tight and symmetric, so mean, median, and mode are all close; report the mean and note the range",
            "Only the mode is valid because the numbers repeat",
            "Report the median because the mean is always wrong",
            "Report whichever number is highest to motivate the team",
          ],
          correctIndex: 0,
          explanation:
            "With tightly clustered, symmetric data and no outliers, all three measures nearly coincide (mean ≈ 8.2, median = 8, mode = 8), so the choice is low-stakes — the mean is fine and using every value is an advantage. The median-is-always-right and pick-the-highest options are both wrong; the mode being valid doesn't make it the best summary here.",
        },
        {
          type: "coding",
          id: "fnd09_code_01",
          difficulty: "Medium",
          prompt:
            "Find the mode: given a list of shoe sizes, print the size that appears most often. Hint: use max(set(sizes), key=sizes.count).",
          starterCode:
            "sizes = [8, 9, 8, 10, 8, 9, 7]\n# Print the most frequently occurring size\n",
          solutionCode:
            "sizes = [8, 9, 8, 10, 8, 9, 7]\nprint(max(set(sizes), key=sizes.count))",
          expectedOutput: "8",
          tests: [
            {
              name: "Counts frequency",
              description: "Uses list.count to find how often each size appears.",
            },
            {
              name: "Returns the mode",
              description: "Prints 8, the size that appears three times.",
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
            "When would you use the median instead of the mean?",
          answer:
            "I use the median when the data is skewed or has outliers, because the median is robust — it's just the middle value, so extreme values don't drag it around. Money is the classic case: incomes, house prices, and order values usually have a long right tail where a few huge values inflate the mean above what a typical case looks like. Reporting the median there gives an honest 'typical' number. The mean is better when the data is roughly symmetric with no wild outliers, or when I specifically need totals and rates, since the mean times the count gives the sum and the median can't. A quick diagnostic I rely on: if the mean and median are far apart, the data is skewed and I lean on the median; if they're close, the data is fairly symmetric and either works.",
        },
        {
          question:
            "What is the mode, and when is it more useful than the mean or median?",
          answer:
            "The mode is the value that appears most frequently in the data. It's uniquely useful in two situations. First, for categorical data — you can't average favourite colours or product categories, but you can find the most common one, so the mode is the only central-tendency measure that applies. Second, for discrete numeric data where frequency is the actual business question: a clothing retailer cares about the most common size sold because they stock by size, not by an 'average' size that might not even exist. The mode's limitations are that a dataset can have several modes or none, and it ignores the magnitude of values, so for continuous quantities like salary I'd usually prefer the median. I think of it as: mode for 'what's most common', median for 'what's typical' on skewed numbers, mean for 'what's the balance point' on symmetric numbers.",
        },
        {
          question:
            "A stakeholder shows you a chart where the 'average' looks suspiciously high. How do you investigate whether it's misleading?",
          answer:
            "My first move is to ask which average it is — mean or median — because that word hides the most common trick. If it's the mean, I compare it to the median: a large gap tells me the distribution is skewed and a few extreme values are inflating the mean, so the 'average' overstates the typical case. I'd then look at the actual distribution, ideally a histogram, to see the shape and spot outliers directly. I also check the unit of observation and whether outliers are real or errors, drawing on data-quality thinking — a single mis-entered value or a legitimate but rare whale can both blow up a mean. Finally I consider whether the mean is even the right summary for the decision at hand; for something like typical customer spend I'd report the median and call out the outliers separately, rather than let one number quietly mislead. The goal is to make the summary match the reality of the data, not just recompute it.",
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
        "1) Reporting the mean on skewed data (money, sizes, wait times) where the median is honest. 2) Forgetting to sort before taking the median — the middle of an unsorted list is meaningless. 3) On an even-sized list, taking one middle value instead of averaging the two. 4) Trying to compute a mean or median of categories — only the mode applies there. 5) Quoting 'the average' without saying whether it's the mean or median, which hides skew.",
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
        "Try these prompts in the AI Tutor panel: • 'Give me a list of numbers and quiz me on its mean, median, and mode.' • 'ELI5: why does an outlier move the mean but not the median?' • 'Show me a skewed dataset and ask which average to report.' • 'Give me a real headline that misuses the word average and let me spot the trick.' • 'Interview mode: ask me when to use median over mean.'",
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
        "Central tendency — a single value summarising the 'typical' value of a variable. Mean — the sum of values divided by the count; the balance point. Median — the middle value of the sorted data; robust to outliers. Mode — the most frequent value; the only measure for categories. Outlier — a value far from the rest that pulls the mean. Skew — an asymmetric distribution where one tail is longer, separating mean from median. Robust — a statistic that resists the influence of outliers (like the median).",
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
        "• Book: 'How to Lie with Statistics' by Darrell Huff — its chapter on averages is the classic on mean-vs-median trickery. • Practice: find any news article quoting an 'average' salary or price and ask whether the median would tell a different story. • Reference: skim the pandas methods .mean(), .median(), and .mode() to preview how you'll compute these on real columns. • Next in DSM: you can summarise a column's centre — next you'll learn to read its whole shape with distributions.",
    },

    /* ---------------------------------------------------------------- */
    /*  12 — Recap                                                       */
    /* ---------------------------------------------------------------- */
    {
      id: "recap",
      type: "recap",
      tocLabel: "Recap",
      content:
        "✓ Central tendency summarises a column as one 'typical' value — mean, median, or mode.\n✓ The mean adds everything and divides; it's the balance point but is dragged by outliers.\n✓ The median is the middle of the sorted data; it resists outliers, so it's honest on skewed data like money.\n✓ The mode is the most frequent value and the only measure that works on categories.\n✓ A large gap between mean and median signals skew — choose the median and say which measure you used.\n\nNext up: Distributions — An Intuition. A single 'typical' value hides how the data spreads out around it. Next you'll learn to read the whole shape of a column — its spread, peaks, and skew — the visual grammar that all data exploration is built on.",
    },
  ],
};
