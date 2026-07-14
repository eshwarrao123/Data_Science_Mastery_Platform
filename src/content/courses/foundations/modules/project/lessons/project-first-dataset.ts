import type { Lesson } from "@/lib/curriculum/types";

/** Skill unlocked: can carry a real dataset through the full Foundations
 *  workflow — read, assess quality, summarise, and report one honest insight. */
export const projectFirstDataset: Lesson = {
  meta: {
    id: "foundations.project.project-first-dataset",
    slug: "project-first-dataset",
    title: "Project: Explore Your First Dataset",
    description:
      "Bring every Foundations skill together: read an unfamiliar dataset, judge its quality, summarise its key columns, and report one defensible insight — no coding required.",
    estimatedTime: "45 mins",
    difficulty: "Beginner",
    xpReward: 150,
    prerequisites: ["foundations.stats-intro.correlation-vs-causation"],
    masteryThreshold: 80,
  },

  blocks: [
    /* ---------------------------------------------------------------- */
    /*  1 — Introduction                                                 */
    /* ---------------------------------------------------------------- */
    {
      id: "intro",
      type: "lesson-intro",
      tocLabel: "The Brief",
      intro: {
        hook: "It's your first week on the data team at GreenWheels, a small e-bike share startup. Your manager drops a message: 'We ran a two-week pilot in one neighbourhood. Here's the trip log — can you take a look and tell me one thing we can trust before the Monday standup?' No fancy model, no dashboard. Just you, a messy little table, and the exact skills you've spent this whole track building. This project is that task. You'll walk a real dataset from first glance to one honest, defensible sentence — the way actual junior data work begins.",
        what: "This is a guided end-to-end mini-project. You'll take a single small dataset — the GreenWheels pilot trip log — and carry it through the full Foundations workflow: read it, identify each column's data type, assess its quality, check for bias, compute a few basic statistics, and write up one insight you can defend.",
        why: "Every skill so far has been practised in isolation. Real data work is the whole chain at once, on a table nobody has cleaned for you. This is where the pieces click together — and where you learn the most important professional habit: reporting what the data can honestly support, and flagging what it can't.",
        whereUsed:
          "This is the shape of a junior data analyst's daily work: a stakeholder hands you a raw export and a vague question, and you turn it into a trustworthy answer with clearly stated caveats. Do this well and you're doing the job.",
        objectives: [
          "Read an unfamiliar dataset and state its unit of observation",
          "Classify each column as numerical or categorical",
          "Audit the data for missing values, duplicates, and outliers",
          "Identify a likely source of bias in how the data was collected",
          "Compute basic statistics and write one honest, caveated insight",
        ],
        realWorldApps: [
          {
            company: "Lime",
            headline: "Pilots before city-wide launches",
            detail:
              "Micro-mobility companies test in one neighbourhood before scaling. The first analysis of a pilot log — exactly this task — decides whether the idea is worth expanding.",
          },
          {
            company: "Citi Bike",
            headline: "The 'take a look' request",
            detail:
              "Junior analysts are constantly handed a raw export and asked for a quick read. Doing it rigorously — with caveats — is what earns trust for the bigger projects.",
          },
          {
            company: "Voi",
            headline: "Honest caveats beat confident guesses",
            detail:
              "Senior data people are known less for flashy conclusions than for knowing exactly how far a dataset can be trusted. This project trains that instinct from day one.",
          },
        ],
      },
    },

    /* ---------------------------------------------------------------- */
    /*  2 — Theory (the workflow + the dataset)                          */
    /* ---------------------------------------------------------------- */
    {
      id: "theory",
      type: "theory-blocks",
      tocLabel: "The Dataset & Workflow",
      blocks: [
        {
          type: "text",
          content:
            "Here is your entire dataset: the GreenWheels pilot trip log. Twelve trips recorded over the two-week test in the Riverside neighbourhood. Read it the way you learned in Module 2 — top row is the header, each following row is one trip. Take a moment to actually look before reading on.",
        },
        {
          type: "code-note",
          code: "trip_id  rider_type  age  minutes  distance_km  rating\nT-01     member      31   12       3.1          5\nT-02     member      27   8        2.0          4\nT-03     casual      NULL 15       3.6          5\nT-04     member      45   9        2.2          4\nT-05     casual      52   6        1.4          3\nT-06     member      31   12       3.1          5     <-- identical to T-01\nT-07     member      38   210      4.0          5     <-- 210 minutes?\nT-08     casual      24   11       2.7          NULL\nT-09     member      29   7        1.8          4\nT-10     casual      63   14       3.3          2\nT-11     member      Member 10    2.5          4     <-- 'Member' in age?\nT-12     casual      41   9        2.1          3",
          content:
            "Twelve rows, six columns. It looks tidy at a glance — but notice the flags on the right. A first glance is never the last word; the job now is to read it properly and stress-test it.",
        },
        {
          type: "keypoint",
          title: "Your six-step workflow",
          content:
            "1) Read — what is one row, and what does each column mean? 2) Types — numerical or categorical for each column? 3) Quality — missing values, duplicates, outliers, inconsistencies? 4) Bias — how was this data collected, and who's missing? 5) Statistics — a few honest summaries of the key columns. 6) Report — one insight you can defend, with caveats. You'll do each step in the sections that follow.",
        },
        {
          type: "text",
          content:
            "Step 1 — Read. Each row is one completed e-bike trip (trip_id is the key, unique per row). The columns record who took it (rider_type, age), how long and far it went (minutes, distance_km), and how the rider scored it afterwards (rating, 1–5). In one sentence: each row is one GreenWheels pilot trip, describing the rider, the trip's length, and its rating.",
        },
        {
          type: "analogy",
          title: "You're a mechanic, not a cheerleader",
          content:
            "A good mechanic doesn't tell you the car is great because it started once. They pop the hood, check the fluids, and tell you what's solid and what's worn. Your job with this dataset is the same: not to celebrate that it 'has data', but to inspect it honestly and report what's trustworthy and what needs a caveat. Enthusiasm is cheap; a careful read is what your manager is actually paying for.",
        },
        {
          type: "text",
          content:
            "Step 2 — Types. Recall Module 1: numerical variables are measured quantities you can do arithmetic on; categorical variables are labels that put a row in a group. age, minutes, and distance_km are numerical. rider_type is categorical (member vs. casual). rating is the interesting one — the numbers 1–5 are really ordered labels (ordinal), so averaging them is common but should be done with a little caution.",
        },
        {
          type: "warning",
          title: "Don't fix anything silently",
          content:
            "As you spot problems — the 210-minute trip, the duplicate, the 'Member' typed into an age — resist the urge to quietly delete or 'correct' them and move on. Recall the data-quality lesson: every fix is a decision that changes the result, and it must be visible. In this project you'll note each issue and how you'd handle it, not erase it. A silent fix is how a wrong number sneaks into a Monday standup.",
        },
      ],
    },

    /* ---------------------------------------------------------------- */
    /*  3 — Visual Learning                                              */
    /* ---------------------------------------------------------------- */
    {
      id: "diagram",
      type: "interactive-diagram",
      tocLabel: "The Workflow Map",
      visual: {
        kind: "flow",
        title: "From Raw Log to Trusted Insight",
        caption:
          "Click each stage to see what you're doing and which earlier lesson it draws on. This is the path every row of the GreenWheels log takes to become a defensible sentence.",
        nodes: [
          {
            id: "read",
            label: "1. Read",
            sublabel: "what is one row?",
            detail:
              "State the unit of observation and what each column means. One row = one pilot trip. Draws on Module 2's reading-and-interpreting-data. Without this, every later step is built on sand.",
            x: 12,
            y: 30,
            accent: true,
          },
          {
            id: "types",
            label: "2. Types",
            sublabel: "numeric vs. categorical",
            detail:
              "Classify each column. age/minutes/distance are numerical; rider_type is categorical; rating is ordinal. Draws on Module 1's types-of-data. Types decide which statistics are even valid.",
            x: 31,
            y: 30,
            accent: true,
          },
          {
            id: "quality",
            label: "3. Quality",
            sublabel: "audit the mess",
            detail:
              "Find missing values (two NULLs), a duplicate (T-06 = T-01), an outlier (210 minutes), and an inconsistency ('Member' in age). Draws on data-quality-basics. This is where trust is won or lost.",
            x: 50,
            y: 30,
            accent: true,
          },
          {
            id: "bias",
            label: "4. Bias",
            sublabel: "who's missing?",
            detail:
              "One neighbourhood, self-selected early adopters, two summer weeks. Draws on bias-in-data. The sample isn't the whole city — the insight must say so.",
            x: 69,
            y: 30,
            accent: true,
          },
          {
            id: "stats",
            label: "5. Statistics",
            sublabel: "summarise honestly",
            detail:
              "Compute median trip minutes and distance, and the member/casual split — choosing median over mean because of the 210-minute outlier. Draws on the whole stats module.",
            x: 88,
            y: 30,
            accent: true,
          },
          {
            id: "report",
            label: "6. Report",
            sublabel: "one defensible sentence",
            detail:
              "Write one insight the cleaned data supports, with explicit caveats about sample size and bias. This is the deliverable — the thing that goes to the standup.",
            x: 50,
            y: 72,
            accent: true,
          },
        ],
        edges: [
          { from: "read", to: "types", label: "then" },
          { from: "types", to: "quality", label: "then" },
          { from: "quality", to: "bias", label: "then" },
          { from: "bias", to: "stats", label: "then" },
          { from: "stats", to: "report", label: "produces" },
        ],
      },
    },

    /* ---------------------------------------------------------------- */
    /*  4 — Worked Examples (the guided investigation)                   */
    /* ---------------------------------------------------------------- */
    {
      id: "worked-examples",
      type: "worked-examples",
      tocLabel: "Guided Investigation",
      examples: [
        {
          difficulty: "Very Easy",
          title: "Step 2 — Classify the column types",
          scenario:
            "Go column by column and label each as numerical, categorical, or ordinal.",
          steps: [
            {
              code: "rider_type -> categorical (member / casual)\nage, minutes, distance_km -> numerical\nrating (1-5) -> ordinal (ordered labels)",
              explanation:
                "rider_type sorts each trip into a group, so it's categorical. age, minutes, and distance_km are measured quantities you can do arithmetic on. rating's 1–5 are ordered categories — you can rank them but the gaps aren't guaranteed equal.",
            },
            {
              code: "trip_id -> identifier (a key, not for math)",
              explanation:
                "trip_id looks like data but it's really the key — a label that identifies each row. You'd never average trip IDs. Naming it correctly keeps you from treating it as a number.",
            },
          ],
          output: "1 categorical, 3 numerical, 1 ordinal, 1 identifier — the types are now clear.",
        },
        {
          difficulty: "Easy",
          title: "Step 3a — Find the missing values and the duplicate",
          scenario:
            "Scan for the two quality issues you can spot by eye first: blanks and repeats.",
          steps: [
            {
              code: "missing: T-03 age = NULL,  T-08 rating = NULL",
              explanation:
                "Two cells are missing: one age and one rating. That's 2 missing out of 72 cells — worth noting, and it means any age or rating summary is based on 11 values, not 12.",
            },
            {
              code: "duplicate: T-06 is identical to T-01 (same rider, minutes, distance, rating)",
              explanation:
                "T-06 matches T-01 on every value. Either the same trip was logged twice, or it's a genuine coincidence — but an exact match across six columns is almost always a duplicate. You'd flag it and likely drop one before counting trips.",
            },
          ],
          output: "2 missing cells (T-03 age, T-08 rating) and 1 likely duplicate (T-06 = T-01).",
        },
        {
          difficulty: "Medium",
          title: "Step 3b — Catch the outlier and the inconsistency",
          scenario:
            "Now find the two subtler problems: a value that's out of range, and a value in the wrong format.",
          steps: [
            {
              code: "outlier: T-07 minutes = 210",
              explanation:
                "Every other trip is 6–15 minutes; T-07 says 210 minutes — three and a half hours on a share bike. Almost certainly a forgotten-to-end-trip error, not a real ride. It's a wild outlier that would wreck a mean.",
            },
            {
              code: "inconsistency: T-11 age = 'Member'  (text in a numeric column)",
              explanation:
                "age should be a number, but T-11 has the word 'Member' — likely a data-entry slip where a value landed in the wrong column. It makes age non-numeric until fixed, so that row's age is effectively unusable.",
            },
            {
              code: "handling = 'flag all four; for stats, drop the duplicate and exclude the 210-min outlier, and note it'",
              explanation:
                "You don't silently erase anything. You record all four issues, and for the summary you drop the duplicate and set the 210-minute trip aside — stating that you did. That's the honest, visible way to handle a mess.",
            },
          ],
          output: "Outlier (T-07 = 210 min) and inconsistency (T-11 age = 'Member') found — four issues total.",
        },
        {
          difficulty: "Hard",
          title: "Step 4 — Name the bias",
          scenario:
            "Before you summarise, ask how this data was collected and who it leaves out.",
          steps: [
            {
              code: "collection = 'one neighbourhood (Riverside), two summer weeks, whoever chose to try a new e-bike'",
              explanation:
                "The pilot ran in a single area, over a short warm-weather window, and only captured people who opted in to a brand-new service. Recall the bias lesson: that's selection bias (self-selected early adopters) plus a sampling window that misses winter and every other neighbourhood.",
            },
            {
              code: "who's_missing = 'non-adopters, other neighbourhoods, bad-weather trips, people without smartphones'",
              explanation:
                "The riders here are enthusiasts in one place at the easiest time of year. People who'd find e-bikes hard, or who live elsewhere, or who'd ride in the rain, just aren't in the data. Any conclusion applies to 'Riverside summer early adopters', not 'the city'.",
            },
            {
              code: "implication = 'ratings and durations here are probably optimistic vs. a full launch'",
              explanation:
                "Because the sample skews toward keen users in ideal conditions, the numbers likely flatter the service. Naming this isn't pessimism — it's the caveat that makes your report trustworthy instead of misleading.",
            },
          ],
          output: "Selection bias (self-selected adopters) + a narrow sampling window — the sample ≠ the city.",
        },
        {
          difficulty: "Industry Example",
          title: "Steps 5 & 6 — Compute statistics and write the insight",
          scenario:
            "With the four issues handled, summarise the cleaned data and deliver one defensible sentence for the standup.",
          steps: [
            {
              code: "# After dropping T-06 (dup) and excluding T-07 (210-min outlier): 10 trips\nminutes = [12,8,15,9,6,11,7,14,9]   # 9 valid (T-08 rating missing, minutes fine)\nmedian_minutes = 9",
              explanation:
                "You choose the median over the mean because even one outlier (had you kept it) would distort the average — the lesson from central tendency. The typical cleaned trip is about 9 minutes. Short, errand-length hops.",
            },
            {
              code: "rider_split = '6 member, 4 casual (of the 10 kept)'\nmedian_rating ≈ 4   # from the ratings present, excluding the NULL",
              explanation:
                "Members outnumber casual riders, and the typical rating sits around 4 out of 5. You report these as medians and counts, noting they rest on ~10 trips after cleaning — a tiny sample.",
            },
            {
              code: "insight = 'In the Riverside summer pilot, a typical e-bike trip was a short ~9-minute ride rated about 4/5, taken mostly by members. Caveat: only ~10 clean trips from one self-selected neighbourhood, so this can guide a bigger test but should NOT be read as city-wide behaviour.'",
              explanation:
                "That single sentence is the whole job: a concrete finding the cleaned data supports, stated with its sample-size and bias caveats front and centre. It's honest, useful, and defensible — exactly what earns a junior analyst the next, bigger project.",
            },
          ],
          output: "One caveated, defensible insight — the real deliverable of a first data task.",
        },
      ],
    },

    /* ---------------------------------------------------------------- */
    /*  5 — Hands-on Practice / Activity                                 */
    /* ---------------------------------------------------------------- */
    {
      id: "inline-practice",
      type: "inline-code",
      tocLabel: "Do It Yourself",
      coding: {
        language: "python",
        filename: "greenwheels_summary.py",
        instructions:
          "Now run the final summary yourself. The messy trips have already been reduced to the clean, valid minutes below (duplicate dropped, 210-minute outlier excluded). Compute the median trip length and count the rider types, then print a one-line finding. Fill the blanks and run it.",
        starterCode: `# Cleaned GreenWheels minutes (duplicate + outlier already removed):
clean_minutes = [12, 8, 15, 9, 6, 11, 7, 14, 9]
rider_types   = ["member","member","casual","member","casual",
                 "casual","member","casual","member"]

# TODO 1: median = middle of the SORTED list (9 values -> index 4).
s = sorted(clean_minutes)
median_minutes = s[___]        # which index is the middle of 9 items?

# TODO 2: count how many trips were by members.
member_trips = rider_types.count(___)   # the label in quotes

casual_trips = rider_types.count("casual")

print("Median trip minutes:", median_minutes)
print("Members:", member_trips, " Casual:", casual_trips)
print("Finding: typical trip ~", median_minutes, "min; caveat: tiny, biased sample")`,
        solutionCode: `# Cleaned GreenWheels minutes (duplicate + outlier already removed):
clean_minutes = [12, 8, 15, 9, 6, 11, 7, 14, 9]
rider_types   = ["member","member","casual","member","casual",
                 "casual","member","casual","member"]

s = sorted(clean_minutes)
median_minutes = s[4]          # index 4 is the middle of 9 sorted values

member_trips = rider_types.count("member")
casual_trips = rider_types.count("casual")

print("Median trip minutes:", median_minutes)
print("Members:", member_trips, " Casual:", casual_trips)
print("Finding: typical trip ~", median_minutes, "min; caveat: tiny, biased sample")`,
        expectedOutput:
          "Median trip minutes: 9\nMembers: 5  Casual: 4\nFinding: typical trip ~ 9 min; caveat: tiny, biased sample",
        hints: [
          "For 9 sorted values, the middle one has 4 values on each side — that's index 4 (0-based).",
          "sorted(clean_minutes) is [6,7,8,9,9,11,12,14,15]; the value at index 4 is 9.",
          "For TODO 2, .count() takes the exact label you're counting — the members are 'member'.",
          "Median = 9, members = 5, casual = 4. Notice you report a median and always attach the caveat.",
        ],
      },
    },

    /* ---------------------------------------------------------------- */
    /*  6 — Exercises + Quiz                                             */
    /* ---------------------------------------------------------------- */
    {
      id: "exercises",
      type: "mastery-assessment",
      tocLabel: "Project Checks",
      masteryThreshold: 80,
      exercises: [
        {
          type: "mcq",
          id: "fnd12_mcq_01",
          difficulty: "Easy",
          question:
            "In the GreenWheels log, what is the unit of observation (what does one row represent)?",
          options: [
            "One rider",
            "One completed e-bike trip",
            "One neighbourhood",
            "One day of the pilot",
          ],
          correctIndex: 1,
          explanation:
            "Each row has a unique trip_id and describes a single ride, so one row is one completed trip. A rider could take several trips (several rows), and the pilot covers one neighbourhood across many days — neither is the unit of observation.",
        },
        {
          type: "mcq",
          id: "fnd12_mcq_02",
          difficulty: "Easy",
          question:
            "The rating column holds values 1–5. How is it best classified?",
          options: [
            "Purely numerical, so averaging it is always exact",
            "Categorical with no order",
            "Ordinal — ordered labels you can rank, but whose gaps aren't guaranteed equal",
            "An identifier like a key",
          ],
          correctIndex: 2,
          explanation:
            "A 1–5 rating is ordinal: the values have a clear order (5 is better than 4) but the 'distance' between them isn't guaranteed uniform, so averaging is common but should be done thoughtfully. It's ordered (not plain categorical), not a bare number, and certainly not a key.",
        },
        {
          type: "scenario",
          id: "fnd12_sc_01",
          difficulty: "Medium",
          scenario:
            "You spot that T-07 logs a 210-minute trip while every other trip is 6–15 minutes.",
          question: "What's the right way to handle it?",
          options: [
            "Silently delete the row and move on",
            "Keep it in the mean without comment — all data is valid",
            "Flag it as a likely error (e.g. a trip not ended), exclude it from the summary, and state that you did",
            "Change it to the average so the row still counts",
          ],
          correctIndex: 2,
          explanation:
            "The value is almost certainly an error, but every fix must be visible: flag it, set it aside for the summary, and say so. Silently deleting hides a decision, keeping it distorts the mean, and overwriting it with an average invents data. Transparency is the rule from the data-quality lesson.",
        },
        {
          type: "scenario",
          id: "fnd12_sc_02",
          difficulty: "Medium",
          scenario:
            "Your manager reads your summary and says, 'Great — so city-wide, the typical e-bike trip is 9 minutes.'",
          question: "How should you respond?",
          options: [
            "Agree — the median is 9, so it holds for the whole city",
            "Gently correct: the pilot was one self-selected neighbourhood over two summer weeks, so 9 minutes describes that sample, not the city; a broader test is needed to generalise",
            "Agree, but only if you increase the sample by duplicating rows",
            "Say the data can't support any statement at all",
          ],
          correctIndex: 1,
          explanation:
            "The finding is real for the pilot sample but can't be generalised city-wide because of selection bias and a narrow window — the core lesson from bias-in-data. You correct the overreach without dismissing the data entirely; duplicating rows would be fabrication, and saying nothing can be concluded understates what the pilot does show.",
        },
        {
          type: "mcq",
          id: "fnd12_mcq_03",
          difficulty: "Hard",
          question:
            "Why do you report the median trip length rather than the mean for this dataset?",
          options: [
            "The mean is always wrong",
            "Because the raw data contained a 210-minute outlier that would inflate the mean; the median is robust to it, giving a more honest 'typical' trip",
            "Because minutes is a categorical variable",
            "Because the median is easier to compute",
          ],
          correctIndex: 1,
          explanation:
            "The 210-minute outlier would drag the mean well above a typical ride, so the robust median better represents the data — exactly the mean-vs-median reasoning from the stats module. The mean isn't universally wrong, minutes is numerical, and ease of computation isn't the reason.",
        },
        {
          type: "coding",
          id: "fnd12_code_01",
          difficulty: "Medium",
          prompt:
            "Data-quality check: given a list of ages where one entry is the string 'Member', print how many entries are NOT valid numbers. Hint: loop over the values and use str(a).isdigit() to test whether each one is all digits, counting the ones that fail.",
          starterCode:
            'ages = [31, 27, 45, 52, "Member", 29, 63, 41]\n# Print how many entries are not valid integer ages\n',
          solutionCode:
            'ages = [31, 27, 45, 52, "Member", 29, 63, 41]\nbad = 0\nfor a in ages:\n    if not str(a).isdigit():\n        bad += 1\nprint(bad)',
          expectedOutput: "1",
          tests: [
            {
              name: "Detects non-numeric entries",
              description: "Uses str(a).isdigit() to test whether each value is all digits.",
            },
            {
              name: "Output",
              description: "Prints 1, since only 'Member' is not a valid integer age.",
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
            "Walk me through how you'd approach a small, unfamiliar dataset you've just been handed.",
          answer:
            "I work through a consistent sequence. First I read it: I figure out what one row represents — the unit of observation — and what each column means, so I'm not analysing something I've misunderstood. Second, I classify each column's type — numerical, categorical, or ordinal — because that determines which summaries and operations are even valid. Third, I audit quality: I look for missing values, duplicate rows, outliers, and inconsistencies like a value in the wrong format, and I flag each one rather than silently fixing it. Fourth, I ask how the data was collected and who might be missing from it, because that tells me how far the conclusions can generalise. Fifth, I compute a few honest summary statistics on the key columns, choosing the median over the mean when there are outliers. Finally, I write up one or two findings the cleaned data actually supports, with the caveats stated plainly. The throughline is that I'm not trying to make the data look impressive — I'm trying to understand exactly what it can and can't tell me.",
        },
        {
          question:
            "You found a duplicate row and a 210-minute trip in a bike-share log. How do you decide what to do with them, and why not just delete them?",
          answer:
            "I treat each as a flagged decision, not a silent cleanup. For the exact-duplicate row, an identical match across every column almost always means the same event was logged twice, so I'd remove one copy before counting trips — but I'd note that I did it and how many I removed, because if it were somehow a genuine repeat I'd want that visible. For the 210-minute trip, when every other ride is 6 to 15 minutes, that value is almost certainly an error — probably a trip someone forgot to end — so I'd exclude it from the summary statistics and state that I excluded it and why. I don't just delete things quietly because every edit changes the result, and a hidden edit is how a wrong or misleading number reaches a stakeholder with no paper trail. The professional standard is that anyone reading my summary can see exactly what I dropped, what I kept, and the reasoning — so the analysis is reproducible and honest, even when the individual calls are judgment calls.",
        },
        {
          question:
            "Your pilot analysis shows a typical 9-minute trip rated 4 out of 5. Your manager wants to announce this as how the whole city will use e-bikes. What do you say?",
          answer:
            "I'd affirm what the data genuinely shows and then carefully correct the overreach. The 9-minute median and roughly 4-out-of-5 rating are real findings for this pilot, and they're encouraging. But the pilot ran in a single neighbourhood, over two summer weeks, and captured only people who chose to try a brand-new service — that's selection bias plus a narrow sampling window. So those numbers describe self-selected early adopters in one area under easy conditions, not the city as a whole. People in other neighbourhoods, riders in bad weather, and everyone who didn't opt in are absent from the data, and they'd likely behave differently, probably less favourably. My recommendation would be to treat the pilot as a promising signal that justifies a larger, more representative test — multiple neighbourhoods, a longer window across seasons — before making any city-wide claim. Framing it that way protects the company from over-investing on a flattering but unrepresentative sample, and it's exactly the kind of caveat that makes a data team trustworthy.",
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
        "1) Jumping straight to statistics before reading the table and auditing its quality. 2) Silently deleting or 'correcting' bad rows instead of flagging each decision visibly. 3) Reporting the mean when an outlier (the 210-minute trip) makes the median the honest choice. 4) Generalising a one-neighbourhood, self-selected summer pilot to the whole city. 5) Delivering a confident headline with no caveats — the caveats are what make a junior analyst trustworthy, not timid.",
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
        "Try these prompts in the AI Tutor panel: • 'Give me a fresh 10-row messy dataset and let me run the six-step workflow on it.' • 'Check my one-sentence insight for overreach and missing caveats.' • 'Quiz me: for this dataset, mean or median, and why?' • 'Role-play my manager over-generalising my result so I can practise pushing back.' • 'Ask me to name the bias in how a given dataset was collected.'",
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
        "Exploratory analysis — the first, open-ended look at a dataset to understand it before modelling. Unit of observation — what one row represents (here, one trip). Data audit — the systematic check for missing values, duplicates, outliers, and inconsistencies. Outlier — a value far outside the normal range (the 210-minute trip). Selection bias — distortion from who chose to be in the data (self-selected pilot riders). Caveat — an explicit statement of a finding's limits. Defensible insight — a conclusion the cleaned data genuinely supports, stated with its caveats.",
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
        "• Practice: download any small CSV from Kaggle's 'beginner' datasets and run the exact six-step workflow on it, writing one caveated insight. • Habit: for every dataset you meet, write its one-sentence unit-of-observation description before anything else. • Reference: skim pandas' .head(), .info(), and .describe() — the three commands that will soon automate steps 1–3 and 5 for you. • Next in DSM: you've completed Foundations. Next comes Python Programming, where you'll turn this by-hand workflow into real, reusable code.",
    },

    /* ---------------------------------------------------------------- */
    /*  12 — Recap                                                       */
    /* ---------------------------------------------------------------- */
    {
      id: "recap",
      type: "recap",
      tocLabel: "Recap",
      content:
        "✓ Real data work is the whole Foundations chain at once: read → types → quality → bias → statistics → report.\n✓ You read the GreenWheels log (one row = one trip) and typed every column before touching a statistic.\n✓ You audited it honestly — two missing values, a duplicate, a 210-minute outlier, and a 'Member' typed into age — flagging, not hiding, each.\n✓ You named the selection bias and narrow window, so the insight applies to the pilot, not the city.\n✓ You reported one defensible, caveated sentence — the real deliverable of a junior data task.\n\n🎉 That completes the Foundations domain. You can now take a raw dataset from first glance to a trustworthy, honestly-caveated insight — entirely by reasoning. Next up: Python Programming, where you'll turn every by-hand step of this project into real, reusable code with pandas.",
    },
  ],
};
