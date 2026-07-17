import type { Lesson } from "@/lib/curriculum/types";

export const windowFunctions: Lesson = {
  meta: {
    id: "data-analysis.transformation.window-functions",
    slug: "window-functions",
    title: "Window Functions (rolling, expanding)",
    description:
      "Compute over ordered rows without collapsing them: rolling windows for moving averages, expanding windows for running totals, and shift/diff/pct_change for comparing each row to its neighbours.",
    estimatedTime: "30 mins",
    difficulty: "Intermediate",
    xpReward: 80,
    prerequisites: ["data-analysis.transformation.groupby-and-aggregation"],
    masteryThreshold: 80,
  },

  blocks: [
    {
      id: "intro",
      type: "lesson-intro",
      tocLabel: "Introduction",
      intro: {
        hook: "Daily sales jump around so much the chart looks like a seismograph — but the 7-day average reveals a clean upward trend. 'Up 12% versus last week' compares each row to a row seven positions earlier. Neither is a groupby: no rows collapse, no groups form. Each row gets an answer computed from a WINDOW of its neighbours — a third kind of computation, and the language of every trend metric you've ever read.",
        what: "Window operations compute a statistic per row over a sliding or growing slice of ordered data: rolling(n) for fixed-width windows (moving averages), expanding() for everything-so-far (running totals, records-to-date), and the offset family — shift, diff, pct_change — for comparing rows to earlier rows.",
        why: "Time-ordered questions dominate analytics: trends, momentum, growth versus yesterday, records to date, smoothing noise. Aggregation answers 'how much overall'; windows answer 'how is it MOVING' — while keeping one row per observation so results plot and merge naturally.",
        whereUsed:
          "Stock charts (50-day moving average), dashboard smoothing, week-over-week growth, cumulative revenue against targets, sensor noise filtering, and feature engineering for any model that predicts the future from the recent past.",
        objectives: [
          "Smooth noisy series with rolling(n).mean() and explain the NaN warm-up rows",
          "Compute running totals and records-to-date with expanding and cumsum/cummax",
          "Compare rows to prior rows with shift, diff, and pct_change",
          "Choose window size as a bias-variance trade-off",
          "Apply windows per group with groupby + the within-group ordering discipline",
        ],
        realWorldApps: [
          {
            company: "Goldman Sachs",
            headline: "Moving averages as trading signals",
            detail:
              "The 50-day vs 200-day moving-average crossover is a classic momentum signal — rolling means over price series, computed exactly as this lesson does, at market scale.",
          },
          {
            company: "Johns Hopkins",
            headline: "The 7-day case average",
            detail:
              "The pandemic dashboards the world watched plotted rolling 7-day averages of new cases, because raw daily counts swing with weekend reporting artifacts — smoothing made the trend readable.",
          },
          {
            company: "Duolingo",
            headline: "Streaks and engagement windows",
            detail:
              "Streak counts are expanding-window logic over daily activity, and churn models use rolling 7- and 30-day activity features per user — window functions grouped by user.",
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
            "rolling(window=n) hands each row a slice of the last n rows (itself plus n−1 predecessors); the chained aggregation computes over that slice. The output has the SAME length as the input — nothing collapses — but the first n−1 rows are NaN because their window isn't full yet.",
        },
        {
          type: "code-note",
          code: `s = pd.Series([10, 12, 9, 14, 13, 16])
s.rolling(3).mean()
# [NaN, NaN, 10.33, 11.67, 12.0, 14.33]

s.rolling(3, min_periods=1).mean()   # partial windows allowed: no NaN warm-up`,
          content:
            "Row 2 averages rows 0–2; row 3 averages rows 1–3 — the window slides. min_periods=1 lets incomplete windows compute (row 0 averages just itself). Deliberate choice: NaN warm-up is honest about insufficient data; min_periods gives you numbers everywhere.",
        },
        {
          type: "keypoint",
          title: "Window size is a smoothing dial",
          content:
            "Small windows follow the data closely but keep the noise; large windows smooth hard but lag behind turns and blur real changes. A 7-day window kills day-of-week seasonality (each window holds one of each weekday); a 30-day window shows the quarter's shape. There is no correct size — there's a size matched to the question, and serious dashboards often show two.",
        },
        {
          type: "code-note",
          code: `s.expanding().sum()    # running total: everything from start to here
s.expanding().max()    # record-to-date
s.cumsum()             # same running total, faster shortcut
s.cummax()             # same record-to-date`,
          content:
            "expanding() is a window anchored at the start that grows one row at a time — 'all history so far'. The cum* shortcuts (cumsum, cumprod, cummax, cummin) cover the common cases directly.",
        },
        {
          type: "code-note",
          code: `s.shift(1)        # each row sees the PREVIOUS value
s.diff()          # s - s.shift(1): change vs previous
s.pct_change()    # fractional change vs previous: 0.25 = +25%
s.shift(7)        # same weekday last week`,
          content:
            "shift moves values down k positions (NaN fills the top). diff and pct_change are the pre-packaged comparisons built on it. shift(7) on daily data aligns each day with the same weekday a week earlier — the honest week-over-week comparison.",
        },
        {
          type: "warning",
          title: "Windows assume the rows are in order",
          content:
            "rolling, expanding, shift, diff — all operate on POSITION. If the rows aren't sorted by time, 'previous row' is meaningless and every result is quietly wrong. Sort by the time column first, every time. And for grouped data (many stores, users, sensors in one table), compute windows per group — groupby('store')['sales'].rolling(7)... or transform-style shifts — or the window will leak across the boundary from one store's last day into the next store's first.",
        },
        {
          type: "analogy",
          title: "Three ways to watch a road trip",
          content:
            "The odometer is an expanding window — total distance since the start, only ever growing. The 'average speed, last 10 minutes' readout is a rolling window — a fixed slice that slides along with you, smoothing out each traffic light. And 'we did 80 km this hour versus 60 the hour before' is diff — this window against the previous one. Same journey, three lenses: total-so-far, recent-typical, and change.",
        },
        {
          type: "expandable",
          title: "Leakage: why shift matters more in ML than anywhere",
          content:
            "When window features feed a model that predicts the future, the window must contain only the PAST. rolling(7).mean() includes the current row — fine for describing today, fatal for predicting today, because at prediction time you don't know today's value yet. The standard fix is shift-then-roll: s.shift(1).rolling(7).mean() — yesterday backwards, seven days. A centred window (center=True) is worse still: it reads the future outright, acceptable only for retrospective smoothing in reports. The symptom of getting this wrong is a model that's brilliant in backtests and useless live. When building time features, ask of every column: 'was this knowable at the moment of prediction?'",
        },
      ],
    },

    {
      id: "diagram",
      type: "interactive-diagram",
      tocLabel: "Visual Learning",
      visual: {
        kind: "comparison",
        title: "Three window shapes over one series",
        caption: "Click each — what slice of the ordered data does row 5 see?",
        nodes: [
          { id: "series", label: "Ordered series", sublabel: "sorted by time", detail: "Ten daily values, sorted by date. Every window operation is defined by which OTHER rows each row gets to see — order is the prerequisite for all of them.", x: 50, y: 8, accent: false },
          { id: "rolling", label: "rolling(3)", sublabel: "sliding slice", detail: "Row 5 sees rows 3–5: a fixed-width window ending at itself. Slides one row at a time; first n−1 rows are NaN (or partial with min_periods). The smoothing tool.", x: 18, y: 42, accent: true },
          { id: "expanding", label: "expanding()", sublabel: "start → here", detail: "Row 5 sees rows 0–5: anchored at the start, growing forever. Running totals, record highs, cumulative anything. cumsum/cummax are its shortcuts.", x: 50, y: 42, accent: true },
          { id: "shift", label: "shift(k) / diff", sublabel: "offset comparison", detail: "Row 5 sees row 5−k: not a slice but a single displaced row. diff and pct_change compare each row to it — change and growth metrics.", x: 82, y: 42, accent: true },
          { id: "grouped", label: "per group", sublabel: "groupby + window", detail: "Many entities in one table? Window within each group — groupby('store').rolling(...) — or store A's history leaks into store B's first rows.", x: 34, y: 78, accent: false },
          { id: "leak", label: "no future data", sublabel: "shift(1) first for ML", detail: "Predictive features must exclude the current row: shift(1).rolling(n) looks strictly backwards. center=True reads the future — reports only.", x: 66, y: 78, accent: false },
        ],
        edges: [
          { from: "series", to: "rolling" },
          { from: "series", to: "expanding" },
          { from: "series", to: "shift" },
          { from: "rolling", to: "grouped" },
          { from: "shift", to: "leak" },
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
          title: "A 3-day moving average",
          scenario: "Smooth a noisy daily series and understand the NaN warm-up.",
          steps: [
            { code: "import pandas as pd\nsales = pd.Series([10, 20, 15, 25, 30])", explanation: "Five days of jumpy sales." },
            { code: "smooth = sales.rolling(3).mean()", explanation: "Each row averages itself and the two before it. Rows 0 and 1 lack a full window." },
            { code: "print(smooth.tolist())", explanation: "Two NaNs (honest: not enough history), then 15.0 = (10+20+15)/3, 20.0, 23.33. The zigzag becomes a trend." },
          ],
          output: "[nan, nan, 15.0, 20.0, 23.333333333333332]",
        },
        {
          difficulty: "Easy",
          title: "Running total vs record-to-date",
          scenario: "Cumulative revenue against a target, and the best day so far.",
          steps: [
            { code: "rev = pd.Series([100, 150, 120, 200, 180])", explanation: "Five days of revenue. Two expanding questions: total so far, and record so far." },
            { code: "print(rev.cumsum().tolist())", explanation: "The running total: 100, 250, 370, 570, 750 — each value is all history summed. This line against a target line is the classic pacing chart." },
            { code: "print(rev.cummax().tolist())", explanation: "The record-to-date: the day-4 value of 200 remains the record on day 5. Expanding windows only ever look back to the start." },
          ],
          output: "[100, 250, 370, 570, 750]\n[100, 150, 150, 200, 200]",
        },
        {
          difficulty: "Medium",
          title: "Growth vs yesterday with diff and pct_change",
          scenario: "Turn a level series into change and growth-rate series.",
          steps: [
            { code: "users = pd.Series([200, 220, 210, 252])", explanation: "Daily active users. Leadership asks for 'change vs yesterday' and 'growth rate'." },
            { code: "print(users.diff().tolist())", explanation: "diff subtracts the shifted series: +20, −10, +42. The first row is NaN — no yesterday exists." },
            { code: "print(users.pct_change().round(2).tolist())", explanation: "pct_change divides by yesterday: +10%, −4.5%→−0.05, +20%. Same information as diff, scaled to be comparable across sizes." },
          ],
          output: "[nan, 20.0, -10.0, 42.0]\n[nan, 0.1, -0.05, 0.2]",
        },
        {
          difficulty: "Hard",
          title: "Per-store rolling average — without leakage across stores",
          scenario: "One table, two stores; each needs its own 2-day rolling mean.",
          steps: [
            { code: "df = pd.DataFrame({\n    'store': ['A','A','A','B','B','B'],\n    'day':   [1, 2, 3, 1, 2, 3],\n    'sales': [10, 20, 30, 100, 200, 300],\n})\ndf = df.sort_values(['store','day'])", explanation: "Sorted by store then day — window order must hold WITHIN each store." },
            { code: "df['roll2'] = (df.groupby('store')['sales']\n                 .rolling(2).mean()\n                 .reset_index(level=0, drop=True))", explanation: "groupby restricts each window to its own store; reset_index re-aligns the grouped result back onto the frame's rows." },
            { code: "print(df['roll2'].tolist())", explanation: "Store A: NaN, 15, 25. Store B: NaN, 150, 250 — B's first row is NaN, NOT an average of A's 30 and B's 100. Without the groupby, that leak is exactly what happens." },
          ],
          output: "[nan, 15.0, 25.0, nan, 150.0, 250.0]",
        },
        {
          difficulty: "Industry Example",
          title: "A dashboard's week-over-week metric, done honestly",
          scenario: "A growth analyst computes WoW change on daily signups — aligning same weekdays, not adjacent days.",
          steps: [
            { code: "import pandas as pd\nsignups = pd.Series(\n    [90, 120, 130, 125, 140, 60, 55,    # week 1: Mon..Sun\n     100, 132, 145, 138, 150, 70, 62],  # week 2\n)", explanation: "Two weeks of daily signups with a strong weekend dip — the seasonality that makes 'vs yesterday' comparisons misleading." },
            { code: "wow = (signups - signups.shift(7)) / signups.shift(7)", explanation: "shift(7) aligns each day with the SAME WEEKDAY last week: Monday vs Monday, Sunday vs Sunday. The weekend dip cancels out instead of polluting the metric." },
            { code: "print((wow.dropna().round(3) * 100).round(1).tolist())", explanation: "Week 2 runs +11.1%, +10%, +11.5%, +10.4%, +7.1%, +16.7%, +12.7% versus the same weekdays — a clean double-digit growth story that a naive Monday-vs-Sunday diff would have reported as a crash." },
          ],
          output: "[11.1, 10.0, 11.5, 10.4, 7.1, 16.7, 12.7]",
        },
      ],
    },

    {
      id: "inline-practice",
      type: "inline-code",
      tocLabel: "Practice Coding",
      coding: {
        language: "python",
        filename: "windows_practice.py",
        instructions:
          "A week of website visits: smooth it with a 3-day rolling mean, track the cumulative total, and find the biggest single-day jump.",
        starterCode: `import pandas as pd

visits = pd.Series([120, 150, 90, 180, 210, 160, 240])

# TODO 1: 3-day rolling mean (leave the NaN warm-up as is)
smooth = ___

# TODO 2: Cumulative visits so far
total = ___

# TODO 3: The largest day-over-day INCREASE (a single number)
biggest_jump = ___

print([round(x, 1) if x == x else None for x in smooth])
print(total.tolist())
print(biggest_jump)`,
        solutionCode: `import pandas as pd

visits = pd.Series([120, 150, 90, 180, 210, 160, 240])

smooth = visits.rolling(3).mean()

total = visits.cumsum()

biggest_jump = visits.diff().max()

print([round(x, 1) if x == x else None for x in smooth])
print(total.tolist())
print(biggest_jump)`,
        expectedOutput: "[None, None, 120.0, 140.0, 160.0, 183.3, 203.3]\n[120, 270, 360, 540, 750, 910, 1150]\n90.0",
        hints: [
          "Task 1: visits.rolling(3).mean() — the first two rows stay NaN (printed as None here).",
          "Task 2: cumsum() is the expanding-sum shortcut.",
          "Task 3: diff() gives day-over-day changes; .max() picks the largest increase.",
          "The jumps are +30, −60, +90, +30, −50, +80 — the day 90→180 is the biggest at 90.0.",
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
          id: "pda16_mcq_01",
          difficulty: "Easy",
          question: "Why are the first n−1 values of s.rolling(n).mean() NaN?",
          options: [
            "A bug in pandas",
            "Those rows don't yet have n values of history to fill their window",
            "The data must be missing",
            "rolling always returns NaN for odd window sizes",
          ],
          correctIndex: 1,
          explanation:
            "A full window of size n needs n rows; earlier rows have fewer. NaN is the honest answer for 'not enough history' — min_periods lets partial windows compute if you prefer numbers everywhere.",
        },
        {
          type: "mcq",
          id: "pda16_mcq_02",
          difficulty: "Easy",
          question: "Which pair computes the same thing?",
          options: [
            "s.rolling(2).sum() and s.cumsum()",
            "s.expanding().sum() and s.cumsum()",
            "s.diff() and s.pct_change()",
            "s.shift(1) and s.rolling(1).mean()",
          ],
          correctIndex: 1,
          explanation:
            "expanding().sum() is the running total from the start — exactly what cumsum() shortcuts. diff is absolute change while pct_change is relative; shift displaces values while rolling(1).mean() returns the value itself.",
        },
        {
          type: "mcq",
          id: "pda16_mcq_03",
          difficulty: "Medium",
          question: "For daily data with strong weekday/weekend patterns, why compare with shift(7) rather than shift(1)?",
          options: [
            "shift(7) is faster",
            "shift(7) aligns each day with the same weekday last week, so weekly seasonality cancels instead of dominating the comparison",
            "shift(1) drops NaN values",
            "shift(7) smooths the data",
          ],
          correctIndex: 1,
          explanation:
            "Sunday vs Saturday measures mostly the weekend pattern, not growth. Sunday vs last Sunday holds the weekday constant, isolating real change. Choosing the shift offset IS choosing what you control for.",
        },
        {
          type: "scenario",
          id: "pda16_sc_01",
          difficulty: "Medium",
          scenario:
            "A table holds daily sales for 50 stores stacked vertically (store, date, sales). An analyst sorts by date only and computes df['sales'].rolling(7).mean() for a per-store trend column.",
          question: "What's wrong?",
          options: [
            "Nothing — rolling handles groups automatically",
            "Windows cross store boundaries: each value mixes ~7 different stores' sales from the same dates; it must be sorted by store+date and computed per group via groupby",
            "The window should be 30",
            "rolling doesn't work on DataFrames",
          ],
          correctIndex: 1,
          explanation:
            "rolling sees only row positions. Sorted by date alone, consecutive rows are different stores, so each 'window' averages across stores rather than along one store's history. groupby('store') confines windows within each store — and rows must be time-ordered within groups.",
        },
        {
          type: "coding",
          id: "pda16_code_01",
          difficulty: "Hard",
          prompt:
            "Compute a leak-free feature: for each day, the mean of the PREVIOUS 3 days' sales (excluding the current day). Print the result as a list (NaN as None is fine via the given print).\n\ns = pd.Series([10, 20, 30, 40, 50])",
          starterCode:
            "import pandas as pd\n\ns = pd.Series([10, 20, 30, 40, 50])\n\n# Your code here\nresult = ...\nprint([round(x, 1) if x == x else None for x in result])",
          solutionCode:
            "import pandas as pd\n\ns = pd.Series([10, 20, 30, 40, 50])\n\nresult = s.shift(1).rolling(3).mean()\nprint([round(x, 1) if x == x else None for x in result])",
          expectedOutput: "[None, None, None, 20.0, 30.0]",
          tests: [
            { name: "Shift first", description: "shift(1) moves the series back one day so the window never includes the current row" },
            { name: "Window", description: "Day 3 averages days 0–2 (10,20,30)=20.0; day 4 averages days 1–3 (20,30,40)=30.0; three warm-up NaNs" },
          ],
        },
        {
          type: "mcq",
          id: "pda16_mcq_04",
          difficulty: "Hard",
          question: "A churn model uses rolling(7).mean() of daily activity (including the current day) as a feature, and backtests brilliantly but fails in production. The likely cause?",
          options: [
            "The window is too small",
            "Data leakage: the feature includes the current day's value, which isn't knowable at prediction time — the backtest saw information production never will",
            "rolling means can't be model features",
            "The model needs more trees",
          ],
          correctIndex: 1,
          explanation:
            "Including the current row means training features contain a piece of the very signal being predicted at the moment of prediction — inflating backtest performance. shift(1).rolling(7).mean() looks strictly backwards and matches what production actually knows.",
        },
      ],
    },

    {
      id: "interview-questions",
      type: "interview-questions",
      tocLabel: "Interview Prep",
      questions: [
        {
          question: "Contrast groupby aggregation with window functions — when is each the right tool?",
          answer:
            "Both compute statistics over row subsets; they differ in output shape and the subset's definition. groupby partitions by key VALUE and collapses each group to one summary row — right when the question is 'how much per category': revenue by region, users by plan. Window functions define each row's subset by POSITION in an ordering — the last 7 rows, everything so far, the row 7 back — and return one value PER ROW, preserving the table's shape. That's right when the question is about movement: trend, growth, cumulative progress, records. The shapes hint at usage too: grouped summaries feed report tables; window columns sit alongside the raw data for plotting and modelling. And they compose — per-store rolling averages are groupby and rolling together: partition by entity, window within each partition.",
        },
        {
          question: "How do you choose a rolling window size?",
          answer:
            "It's a smoothing dial with a trade-off on each end: small windows track the signal closely but keep the noise; large windows suppress noise but lag turning points and can smooth real events out of existence. Three anchors guide me. First, known seasonality: a 7-day window on daily data holds exactly one of each weekday, cancelling the weekly cycle — that's why 7 is the default for daily business metrics, not aesthetics. Second, the decision horizon: an ops team reacting daily needs a window short enough to show this week's problem; a strategy review can afford 28 or 90 days. Third, event visibility: if I must detect a 3-day incident, a 30-day mean will bury it. In practice I plot two or three candidate windows over the raw series and pick per audience — and often ship a short and a long window together, because their crossover itself carries signal, which is exactly how traders read the 50-versus-200-day pair.",
        },
        {
          question: "What is temporal leakage in feature engineering, and how do window functions cause or prevent it?",
          answer:
            "Leakage is training a model on information that won't exist at prediction time — and time-window features are the most common source. rolling(7).mean() includes the current row, so as a feature for predicting the current day it embeds part of the answer; the backtest looks great and production disappoints. center=True is worse: the window spans future rows outright. The discipline is to make every feature answer 'what did I know at the moment of prediction?' — mechanically, shift before rolling: shift(1).rolling(7) is yesterday-backwards-seven-days, purely historical. The same reasoning extends beyond windows: fill statistics, encodings, and scalers must all be fitted on training data only. My habit for any time-indexed feature is to write down the feature's timestamp coverage explicitly — 'uses days t−7 through t−1' — because the act of writing it exposes a t hiding in the window. And I validate with a strictly walk-forward backtest, which is the harness that catches leaks the code review missed.",
        },
      ],
    },

    {
      id: "common-mistakes",
      type: "callout",
      variant: "warning",
      title: "Common Mistakes to Avoid",
      content:
        "1) Running windows on unsorted data — position-based operations demand time order first. 2) Letting windows cross entity boundaries in stacked tables — groupby before rolling/shift. 3) Treating the NaN warm-up as an error and dropping those rows without thought — or hiding it with min_periods=1 without noting early values average fewer points. 4) Comparing shift(1) across strong weekly seasonality — shift(7) compares like with like. 5) Including the current row in predictive features — shift(1).rolling(n), always. 6) Using center=True for anything that feeds a decision made in real time. 7) pct_change on a series containing zeros — division blows up to inf; check the denominator.",
    },

    {
      id: "ai-tutor",
      type: "callout",
      variant: "tip",
      title: "Ask the AI Tutor",
      content:
        "Try these prompts in the AI Tutor panel: • 'ELI5: rolling vs expanding vs shift with the road-trip analogy.' • 'Show me a 7-day rolling average taming weekend dips, step by step.' • 'Quiz me: which window tool answers each business question you invent?' • 'Demonstrate leakage: same feature with and without shift(1), and why backtests lie.' • 'Interview mode: make me justify a window size for an ops dashboard.'",
    },

    {
      id: "glossary",
      type: "callout",
      variant: "info",
      title: "Glossary",
      content:
        "Window function — computes a per-row statistic over an ordered slice of neighbouring rows. rolling(n) — fixed-width sliding window ending at each row. min_periods — how many values a window needs before producing a number. expanding() — window from the start up to each row. cumsum/cummax/cummin/cumprod — shortcuts for common expanding stats. shift(k) — displace values k positions (NaN fills the gap). diff() — change vs the previous row. pct_change() — relative change vs the previous row. center=True — window centred on the row (uses future data). Temporal leakage — features containing information unavailable at prediction time.",
    },

    {
      id: "resources",
      type: "callout",
      variant: "info",
      title: "Recommended Resources",
      content:
        "• Docs: pandas user guide 'Windowing operations' — rolling, expanding, ewm, and their parameters. • Read: any explainer of moving-average crossover signals to see window sizes carrying meaning in the wild. • Practice: download a stock's daily closes, plot the raw series with 7- and 30-day rolling means, and mark where they cross; then build the leak-free shift(1).rolling(7) version and compare. • Next in DSM: rolling and shift cover most needs — Apply & Transform handles the rest: custom functions over groups, and the vectorize-first judgement of when NOT to.",
    },

    {
      id: "recap",
      type: "recap",
      tocLabel: "Recap",
      content:
        "✓ Window functions keep one row per observation and compute over ordered neighbours — the third shape, next to element-wise ops and groupby collapses.\n✓ rolling(n) slides a fixed window (NaN warm-up; min_periods to allow partial); window size is a smoothing dial matched to seasonality and decision horizon.\n✓ expanding()/cumsum/cummax answer everything-so-far questions: running totals, records to date.\n✓ shift(k) enables row-vs-earlier-row comparisons; diff and pct_change package the common ones; shift(7) respects weekly seasonality.\n✓ Sort by time first, window within groups via groupby, and never let predictive features see the current row — shift(1).rolling(n).\n\nNext up: Apply & Transform. Built-in aggregations and windows cover 95% of needs — the last lesson of this module covers the escape hatches for the other 5%, and the vectorize-first mindset that keeps them rare.",
    },
  ],
};
