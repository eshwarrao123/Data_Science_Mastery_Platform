import type { Lesson } from "@/lib/curriculum/types";

/** Skill unlocked: can audit a dataset for missing values, duplicates,
 *  inconsistencies, and outliers before trusting any analysis built on it. */
export const dataQualityBasics: Lesson = {
  meta: {
    id: "foundations.understanding.data-quality-basics",
    slug: "data-quality-basics",
    title: "Data Quality Basics",
    description:
      "Recognise the common defects — missing values, duplicates, inconsistent formats, and outliers — that make data untrustworthy, and know what each one does to your results.",
    estimatedTime: "25 mins",
    difficulty: "Beginner",
    xpReward: 50,
    prerequisites: ["foundations.understanding.what-makes-a-dataset"],
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
        hook: "A dataset can be perfectly readable, perfectly structured — and still be wrong. A blank cell, a customer entered twice, a date written five different ways, a price of 9,999,999: none of these break the table, but every one of them quietly poisons an average, a count, or a chart. Professionals never trust data on sight. Before any analysis, they run a quality audit — a quick, systematic hunt for the four flaws that fool everyone else. This lesson teaches you that audit.",
        what: "Data quality is how much you can trust a dataset. A quality audit checks four things: missing values (blank cells), duplicates (the same thing recorded twice), inconsistencies (the same fact written different ways), and outliers (values far outside the normal range).",
        why: "Analysis inherits the flaws of its data. 'Garbage in, garbage out' is the oldest rule in the field: a flawless model trained on dirty data produces confident, wrong answers. Most of a data scientist's time goes into finding and fixing these flaws — because it's the difference between an insight and a mistake.",
        whereUsed:
          "The first thing anyone does with a new dataset, in every job. Loading a CSV, cleaning a survey, preparing data for a dashboard or a model — all begin with a quality check.",
        objectives: [
          "Detect missing values and reason about why they're missing",
          "Find duplicate records and explain the damage they cause",
          "Spot inconsistencies in formatting, units, and spelling",
          "Identify outliers and decide whether they're errors or real",
          "Run a simple four-point quality audit on any new dataset",
        ],
        realWorldApps: [
          {
            company: "Airbnb",
            headline: "One duplicate listing skews a whole neighborhood",
            detail:
              "If the same apartment is uploaded twice, average-price stats for that area count it twice. Airbnb's data teams deduplicate listings before publishing any market figures.",
          },
          {
            company: "Government census",
            headline: "Missing answers change policy",
            detail:
              "Survey questions people skip create missing values. Whether those blanks are ignored or estimated can shift funding decisions worth millions, so statisticians handle them explicitly.",
          },
          {
            company: "Banks",
            headline: "An outlier can be fraud — or a typo",
            detail:
              "A $2,000,000 coffee purchase is an outlier. Fraud systems must decide, in milliseconds, whether it's a real anomaly worth blocking or a data-entry error worth ignoring.",
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
            "There are four common flaws in real data. Once you can name them, you can hunt each one deliberately instead of hoping you'll notice a problem by luck. We'll take them one at a time.",
        },
        {
          type: "keypoint",
          title: "The four data-quality flaws",
          content:
            "Missing values — a cell has no data (blank, NaN, 'N/A', or a fake stand-in like 0 or -1). Duplicates — the same real-world thing recorded in more than one record. Inconsistencies — the same fact written different ways ('NY' vs 'New York', kg vs lb, '5' vs 'five'). Outliers — values far outside the normal range, which may be errors or genuine rare cases.",
        },
        {
          type: "text",
          content:
            "Missing values are the most common. They appear as an empty cell, the special value NaN ('not a number'), or text like 'N/A' or 'unknown'. The dangerous kind is the disguised missing value — a real-looking number standing in for 'we don't know', such as an age of 0 or a temperature of -999. These hide from a blank-cell check and silently distort averages.",
        },
        {
          type: "analogy",
          title: "Missing data is a blank on a form",
          content:
            "Imagine a stack of paper forms where some people left 'age' blank. You have three honest choices: leave it blank and count around it, guess a sensible value (say the average age), or throw that form out. What you must never do is treat a blank as if it were a zero — that would tell you people are newborns. The same three choices, and the same trap, apply to missing cells in a dataset.",
        },
        {
          type: "text",
          content:
            "Duplicates happen when one real thing is recorded more than once — a form submitted twice, a record copied during a merge. They're deceptive because the data looks fine row by row; the flaw is only visible across rows. Duplicates inflate counts and skew averages toward whatever got repeated.",
        },
        {
          type: "warning",
          title: "Not every repeated value is a duplicate",
          content:
            "Two rows sharing a city or a price are fine — different customers can live in the same city. A duplicate is when the whole record (or the key) repeats, meaning the same real-world thing is counted twice. Always check against the key and granularity from the last lesson: two rows with the same key are a genuine duplicate; two rows that merely share some feature values are not.",
        },
        {
          type: "text",
          content:
            "Inconsistencies are the same fact expressed in different ways. 'USA', 'U.S.A.', and 'United States' are one country to a human but three separate categories to a computer, so a count of countries comes out wrong. Watch especially for mixed spellings, mixed capitalization, mixed date formats, and mixed units (kilograms in one row, pounds in another, with no label to warn you).",
        },
        {
          type: "code-note",
          code: "country\nUSA\nUnited States\nusa\nU.S.\n# To a computer these are FOUR different values.\n# A groupby('country') would report four countries, not one.",
          content:
            "Every row here means the United States, but because the text differs, software treats them as four distinct categories. Standardising the values (all to one spelling) before counting is the fix — and a classic cleaning step.",
        },
        {
          type: "text",
          content:
            "Outliers are values far from the rest. Some are errors (a weight of 5000 kg for a person, a typo'd extra zero). Some are real and important (a genuinely huge purchase, a record-breaking day). The skill isn't deleting every outlier — it's noticing them and investigating before deciding. Blindly removing outliers can erase your most interesting finding; blindly keeping errors can wreck an average.",
        },
        {
          type: "expandable",
          title: "Why one outlier wrecks an average but not a median",
          content:
            "The mean (average) adds everything up and divides, so a single wild value drags it a long way — five salaries of 40k and one typo of 40,000k pull the 'average' into the millions. The median (the middle value when sorted) barely moves, because it only cares about position, not size. That's why analysts report the median for things like income and house prices: it resists outliers. Knowing which summary an outlier corrupts tells you how much to worry about it.",
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
        kind: "decision-tree",
        title: "The Four-Point Quality Audit",
        caption:
          "Click each check to see what to look for and how to fix it. Run all four on any new dataset before you trust a single number.",
        nodes: [
          {
            id: "start",
            label: "New dataset",
            sublabel: "before any analysis",
            detail:
              "You've just loaded a table. Don't chart it yet. Run these four checks first — each targets a different flaw that would otherwise corrupt your results.",
            x: 50,
            y: 10,
            accent: true,
          },
          {
            id: "missing",
            label: "1 · Missing?",
            sublabel: "blanks, NaN, fake stand-ins",
            detail:
              "Look for empty cells, NaN, 'N/A', and disguised missing values like 0 or -999. Decide per column: count around it, fill with a sensible estimate, or drop the record.",
            x: 20,
            y: 42,
            accent: true,
          },
          {
            id: "duplicates",
            label: "2 · Duplicates?",
            sublabel: "same thing, twice",
            detail:
              "Check the key for repeats. A repeated key means one real thing was recorded twice — inflating counts. Remove exact duplicates; investigate near-duplicates.",
            x: 40,
            y: 66,
            accent: true,
          },
          {
            id: "inconsistent",
            label: "3 · Inconsistent?",
            sublabel: "same fact, different form",
            detail:
              "Scan categories and formats for 'NY' vs 'New York', mixed capitalization, mixed date formats, mixed units. Standardise to one form before grouping or counting.",
            x: 62,
            y: 66,
            accent: true,
          },
          {
            id: "outliers",
            label: "4 · Outliers?",
            sublabel: "far from the rest",
            detail:
              "Find values far outside the normal range. Investigate each: error or real? Fix or explain typos; keep and note genuine rare cases. Report the median when outliers are present.",
            x: 80,
            y: 42,
            accent: true,
          },
          {
            id: "trust",
            label: "Now you can analyze",
            sublabel: "audited and documented",
            detail:
              "After the four checks — and writing down what you found and did — the dataset is trustworthy enough to analyze. The audit isn't optional busywork; it's what separates an insight from a mistake.",
            x: 50,
            y: 92,
            accent: false,
          },
        ],
        edges: [
          { from: "start", to: "missing", label: "check" },
          { from: "start", to: "outliers", label: "check" },
          { from: "missing", to: "duplicates" },
          { from: "duplicates", to: "inconsistent" },
          { from: "inconsistent", to: "trust" },
          { from: "outliers", to: "trust" },
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
          title: "Spot the missing value",
          scenario:
            "A small table of survey responses has an empty age cell.",
          steps: [
            {
              code: "name    age\nAmara   31\nLuc     \nPriya   27",
              explanation:
                "Luc's age cell is blank — a missing value. It's not zero and not any number; it's the absence of data, and it must be handled deliberately rather than ignored.",
            },
          ],
          output: "One missing value (Luc's age). Decide: count around it, estimate it, or drop the row.",
        },
        {
          difficulty: "Easy",
          title: "Why a disguised missing value lies",
          scenario:
            "Ages were recorded, but 'unknown' was stored as 0 instead of left blank.",
          steps: [
            {
              code: "ages = [34, 0, 41, 0, 29]   # the two 0s mean 'unknown'",
              explanation:
                "The zeros aren't real ages — they stand in for missing data. A blank-cell check won't catch them because a 0 looks like a valid number.",
            },
            {
              code: "average = sum(ages) / len(ages)  # 104 / 5 = 20.8",
              explanation:
                "Treating the fake zeros as real drags the average age down to 20.8, far below the truth. Disguised missing values corrupt summaries silently — always ask what the 'impossible' values mean.",
            },
          ],
          output: "The average is wrong (20.8) because two 0s are really missing data, not real ages.",
        },
        {
          difficulty: "Medium",
          title: "Duplicate vs. legitimate repeat",
          scenario:
            "A signups table keyed on email has two rows for the same address, and two different people from the same city.",
          steps: [
            {
              code: "email             city\na@x.com   (row1)  Leeds\na@x.com   (row2)  Leeds\nb@x.com           Leeds",
              explanation:
                "The key is email. a@x.com appears twice — that's a true duplicate (one person recorded twice). The two Leeds rows for different emails are NOT duplicates; different people can share a city.",
            },
            {
              code: "action = 'drop one a@x.com row; keep both distinct emails'",
              explanation:
                "Deduplicate on the key, not on a shared feature. Removing a 'Leeds' row because the city repeats would delete a real, different person.",
            },
          ],
          output: "One genuine duplicate (repeated key); the shared city is a legitimate repeat, not a duplicate.",
        },
        {
          difficulty: "Hard",
          title: "Cleaning inconsistent categories before counting",
          scenario:
            "A table of orders records the shipping country inconsistently, and you need the number of distinct countries.",
          steps: [
            {
              code: "countries = ['UK', 'U.K.', 'uk', 'United Kingdom', 'France']",
              explanation:
                "Four of these mean the United Kingdom, but the text differs, so a naive count of distinct values returns 5 countries.",
            },
            {
              code: "standardized = ['UK', 'UK', 'UK', 'UK', 'France']  # map all UK spellings to one",
              explanation:
                "Standardise every UK variant to a single canonical form. This is the core of fixing inconsistencies: pick one spelling and map the rest onto it.",
            },
            {
              code: "distinct_countries = len(set(standardized))  # 2",
              explanation:
                "After standardising, the true count is 2 (UK and France). Skipping this step would have reported 5 — a 150% error caused purely by formatting, not by the data itself.",
            },
          ],
          output: "True count is 2 countries; without standardising, you'd wrongly report 5.",
        },
        {
          difficulty: "Industry Example",
          title: "Auditing a ride-sharing export before a report",
          scenario:
            "A data analyst receives a CSV of yesterday's rides and must produce an 'average fare' figure for a manager. She runs the four-point audit first.",
          steps: [
            {
              code: "# 1 Missing: 12 rows have blank 'fare' (payment failed to record)",
              explanation:
                "She finds missing fares. Filling them with 0 would understate the average, so she excludes those 12 rides from the fare calculation and notes it — an honest, documented choice.",
            },
            {
              code: "# 2 Duplicates: 3 ride_ids appear twice (a re-upload)",
              explanation:
                "Three rides were exported twice. She deduplicates on ride_id (the key), because counting a ride twice would inflate both the ride count and the fare total.",
            },
            {
              code: "# 3 Inconsistent: city stored as 'NYC', 'New York', 'new york'",
              explanation:
                "The same city appears three ways. She standardises them so a per-city breakdown isn't split into phantom cities.",
            },
            {
              code: "# 4 Outliers: one fare of $9,999 (a stuck meter)\naverage_fare = median_of_clean_fares  # robust to the one bad fare",
              explanation:
                "A single $9,999 fare is almost certainly a meter error. Rather than let it explode the mean, she investigates, excludes the confirmed error, and reports the median as a robust summary. Only after all four checks does she hand over a number she can defend.",
            },
          ],
          output: "A trustworthy average fare — because missing, duplicate, inconsistent, and outlier values were all handled first.",
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
        filename: "quick_quality_audit.py",
        instructions:
          "You're given a list of ages where missing values were stored as None. Complete two checks: count the missing values, and compute the average using only the real ages (ignoring the missing ones). Run it to see a small, honest audit in action.",
        starterCode: `ages = [34, None, 41, 29, None, 38]

# TODO 1: Count how many values are missing (None).
missing_count = ___     # hint: count how many entries are None

# TODO 2: Keep only the real ages (drop the None values).
real_ages = ___         # hint: a list comprehension with 'if a is not None'

# TODO 3: Average the real ages only.
average = sum(real_ages) / len(real_ages)

print("Missing:", missing_count)
print("Average of real ages:", round(average, 1))`,
        solutionCode: `ages = [34, None, 41, 29, None, 38]

missing_count = sum(1 for a in ages if a is None)
real_ages = [a for a in ages if a is not None]
average = sum(real_ages) / len(real_ages)

print("Missing:", missing_count)
print("Average of real ages:", round(average, 1))`,
        expectedOutput: "Missing: 2\nAverage of real ages: 35.5",
        hints: [
          "To count missing values, count how many entries equal None.",
          "`sum(1 for a in ages if a is None)` counts the Nones.",
          "Build real_ages with `[a for a in ages if a is not None]`.",
          "Averaging only real_ages (34, 41, 29, 38) gives 142 / 4 = 35.5 — the missing values are excluded, not treated as zero.",
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
          id: "fnd07_mcq_01",
          difficulty: "Easy",
          question: "Which of these is a 'disguised' missing value?",
          options: [
            "An empty cell",
            "The text 'N/A'",
            "An age of 0 used to mean 'unknown'",
            "A NaN value",
          ],
          correctIndex: 2,
          explanation:
            "An age of 0 standing in for 'unknown' looks like a real number, so it slips past a blank-cell check and quietly corrupts averages. Empty cells, 'N/A', and NaN are all openly missing and easier to catch.",
        },
        {
          type: "mcq",
          id: "fnd07_mcq_02",
          difficulty: "Easy",
          question:
            "Two rows in a table share the same city but have different customer_ids (the key). Is this a duplicate?",
          options: [
            "Yes — any repeated value is a duplicate",
            "No — different keys mean different real things; sharing a city is a legitimate repeat",
            "Yes — cities should never repeat",
            "It's impossible to tell",
          ],
          correctIndex: 1,
          explanation:
            "A duplicate is the same real thing recorded twice, which shows up as a repeated key. Different customer_ids are different people, so sharing a city is a normal, legitimate repeat — not a duplicate.",
        },
        {
          type: "mcq",
          id: "fnd07_mcq_03",
          difficulty: "Medium",
          question:
            "A column of countries contains 'Spain', 'spain', and 'ESP'. What kind of data-quality problem is this?",
          options: [
            "Missing values",
            "Duplicates",
            "Inconsistency (same fact written different ways)",
            "Outliers",
          ],
          correctIndex: 2,
          explanation:
            "All three mean Spain but are written differently, so software treats them as separate categories — an inconsistency. The fix is to standardise them to one canonical form before counting or grouping.",
        },
        {
          type: "scenario",
          id: "fnd07_sc_01",
          difficulty: "Medium",
          scenario:
            "You're computing the average house price for a neighborhood and notice one listing priced at $1 (a placeholder someone forgot to update).",
          question: "What's the best response?",
          options: [
            "Include it — all data should be kept",
            "Investigate the $1 as a likely error, exclude it if confirmed, and consider reporting the median",
            "Delete every price below the average automatically",
            "Change the $1 to the average without checking",
          ],
          correctIndex: 1,
          explanation:
            "The $1 is an outlier that's almost certainly a placeholder error. The right move is to investigate, exclude confirmed errors, and use the median, which resists outliers. Blindly deleting all below-average prices or silently overwriting values would distort the data in other ways.",
        },
        {
          type: "scenario",
          id: "fnd07_sc_02",
          difficulty: "Hard",
          scenario:
            "A teammate says: 'I'll just fill every missing value with 0 so the code runs.' The dataset includes columns for age, income, and number_of_pets.",
          question: "Why is this risky?",
          options: [
            "It isn't risky; 0 is always a safe default",
            "0 is a real, meaningful value for these columns, so filling missing data with 0 invents false facts and distorts averages",
            "0 will cause the code to crash",
            "Only text columns can have missing values",
          ],
          correctIndex: 1,
          explanation:
            "For age, income, and pet counts, 0 is a plausible real value, so a filled-in 0 is indistinguishable from a true 0. That invents false data — babies with $0 income and no pets — and drags averages down. Missing values need a deliberate strategy (exclude, or estimate sensibly), not a blanket 0.",
        },
        {
          type: "coding",
          id: "fnd07_code_01",
          difficulty: "Medium",
          prompt:
            "Standardise inconsistent category text, then count distinct values. Given a list of country strings in mixed case, lowercase them all and print how many distinct countries remain. Hint: use .lower() and set().",
          starterCode:
            'countries = ["UK", "uk", "France", "FRANCE", "france"]\n# Lowercase each value, then print the number of distinct countries\n',
          solutionCode:
            'countries = ["UK", "uk", "France", "FRANCE", "france"]\ncleaned = [c.lower() for c in countries]\nprint(len(set(cleaned)))',
          expectedOutput: "2",
          tests: [
            {
              name: "Standardises case",
              description: "Lowercases every value so 'UK' and 'uk' match.",
            },
            {
              name: "Counts distinct",
              description: "Prints 2 (uk and france) instead of 5.",
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
            "How do you handle missing values in a dataset?",
          answer:
            "First I find them all — not just blanks and NaN, but disguised ones like a 0 or -999 standing in for 'unknown', by checking whether each column's values are actually plausible. Then I ask why they're missing, because that guides the fix. There are three honest options: exclude the incomplete records from that particular calculation, estimate a sensible fill (for example the column's median, or a value predicted from other features), or, if a column is mostly empty, drop the column. The one thing I never do is fill with 0 when 0 is a real possible value, because that invents false data and drags averages. Whatever I choose, I document it, since how missing data is handled can change the result.",
        },
        {
          question:
            "What's the difference between a duplicate and a legitimate repeated value, and how do you tell them apart?",
          answer:
            "A duplicate is the same real-world thing recorded more than once — it inflates counts and skews averages. A legitimate repeat is two different things that happen to share a feature value, like two different customers in the same city. I tell them apart using the key and granularity: if the key repeats, the same entity was recorded twice and it's a true duplicate to remove; if only some non-key features match but the keys differ, they're distinct records and I leave them alone. In practice I also watch for near-duplicates — the same entity entered slightly differently, like a name with and without a middle initial — which need fuzzy matching rather than an exact-key check.",
        },
        {
          question:
            "How do you decide whether to remove an outlier?",
          answer:
            "I never remove outliers automatically, because an outlier is just a value far from the rest — it can be an error or it can be the most important thing in the data. So I investigate each one and ask whether it's plausible. If it's impossible or clearly a data-entry mistake — a person weighing 5000 kg, an extra zero on a price — I treat it as an error and fix or exclude it, documenting what I did. If it's genuinely real, like a record-breaking sales day or a legitimately huge transaction, I keep it, because deleting it would erase a real signal. And when outliers are present, I lean on robust summaries like the median instead of the mean, since one extreme value can drag the mean a long way but barely moves the median. The judgment call is always driven by domain context, not by a blanket rule.",
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
        "1) Filling missing values with 0 when 0 is a real possible value — this invents false data. 2) Missing the disguised blanks (0, -1, -999, 'unknown') because they look like real numbers. 3) Deduplicating on a shared feature instead of the key, which deletes genuinely different records. 4) Counting categories without standardising first, so 'NY' and 'New York' become two places. 5) Deleting every outlier on sight — you may be erasing your most important finding.",
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
        "Try these prompts in the AI Tutor panel: • 'Give me a messy 6-row table and ask me to find all four quality flaws.' • 'ELI5: why does one outlier wreck the mean but not the median?' • 'Show me a column with disguised missing values and see if I spot them.' • 'Quiz me: duplicate or legitimate repeat?' • 'Explain three ways to handle missing data with a fresh example.'",
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
        "Data quality — how much a dataset can be trusted. Missing value — an absent entry (blank, NaN, 'N/A', or a disguised stand-in). NaN — 'not a number', the standard marker for missing numeric data. Duplicate — the same real-world thing recorded in more than one record. Inconsistency — the same fact written in different forms. Outlier — a value far outside the normal range. Mean — the average (sensitive to outliers). Median — the middle value when sorted (robust to outliers). Data cleaning — the process of fixing these flaws.",
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
        "• Concept: search 'garbage in, garbage out' to see why data quality decides everything downstream. • Reference: skim the pandas guide 'Working with missing data' to preview how isna() and dropna() automate today's checks. • Practice: open any spreadsheet you own and run the four-point audit by eye. • Reading: the article 'Tidy Data' by Hadley Wickham (introduced last module) also motivates clean, consistent columns. • Next in DSM: you can now find flaws inside a dataset — next you'll learn about a subtler flaw that lives in how the data was collected: bias.",
    },

    /* ---------------------------------------------------------------- */
    /*  12 — Recap                                                       */
    /* ---------------------------------------------------------------- */
    {
      id: "recap",
      type: "recap",
      tocLabel: "Recap",
      content:
        "✓ Data quality is how much you can trust a dataset — analysis inherits its flaws (garbage in, garbage out).\n✓ Missing values include blanks, NaN, and disguised stand-ins like 0 or -999; handle them deliberately, never with a blind 0.\n✓ Duplicates are the same real thing recorded twice — detect them with the key, not with shared feature values.\n✓ Inconsistencies are one fact written many ways ('NY' vs 'New York'); standardise before counting.\n✓ Outliers may be errors or real; investigate before removing, and prefer the median when they're present.\n✓ Run the four-point audit — missing, duplicates, inconsistencies, outliers — on every new dataset.\n\nNext up: Bias in Data. Even a perfectly clean dataset can lie if it was collected from the wrong people. Next you'll learn to spot selection, survivorship, and sampling bias — flaws no quality audit will ever reveal.",
    },
  ],
};
