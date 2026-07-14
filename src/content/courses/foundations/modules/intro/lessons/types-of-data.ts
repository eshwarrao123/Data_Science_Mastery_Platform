import type { Lesson } from "@/lib/curriculum/types";

/** Skill unlocked: can classify any value as structured/unstructured and
 *  numerical/categorical, the vocabulary all later data work depends on. */
export const typesOfData: Lesson = {
  meta: {
    id: "foundations.intro.types-of-data",
    slug: "types-of-data",
    title: "Types of Data",
    description:
      "Tell structured from unstructured data and numerical from categorical, and learn why the distinction decides how you store, clean, and analyse it.",
    estimatedTime: "20 mins",
    difficulty: "Beginner",
    xpReward: 40,
    prerequisites: ["foundations.intro.what-is-data-science"],
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
        hook: "Ask a data scientist the first question they ask about a new dataset and it's almost always the same: 'What kind of data is this?' The answer decides everything that follows — how you store it, how you clean it, and which charts and calculations even make sense. Get the type wrong and you'll try to average a phone number. By the end of this lesson you'll classify any value on sight.",
        what: "Data comes in kinds. The two most useful splits are: structured vs. unstructured (does it fit neatly in a table?) and, for structured columns, numerical vs. categorical (is it a measurable number or a label?).",
        why: "The type of a value determines what you're allowed to do with it. You can average a numerical column but not a categorical one; you can count categories but you can't take their mean. Knowing the type up front stops you from making meaningless calculations.",
        whereUsed:
          "Every spreadsheet, database, survey, and machine learning model. Choosing an average vs. a mode, a bar chart vs. a histogram, or a text model vs. a table model all start from the data type.",
        objectives: [
          "Explain the difference between structured and unstructured data",
          "Classify a value as numerical or categorical",
          "Split numerical data into discrete and continuous",
          "Split categorical data into nominal and ordinal",
          "Pick a valid summary (mean, count, mode) based on the data type",
        ],
        realWorldApps: [
          {
            company: "Spotify",
            headline: "One song, many data types",
            detail:
              "A track row mixes types: duration in seconds is continuous numerical, play count is discrete numerical, genre is nominal categorical, and the lyrics are unstructured text. Each is handled differently.",
          },
          {
            company: "Amazon",
            headline: "Structured orders, unstructured reviews",
            detail:
              "Your order history is structured — price, quantity, date, all in tidy columns. Your written product reviews are unstructured text that needs language processing before it becomes useful.",
          },
          {
            company: "Uber",
            headline: "Ratings are ordinal, not just numbers",
            detail:
              "A 1-to-5 driver rating looks numerical but is ordinal categorical — the order matters (5 beats 4) but the gaps aren't guaranteed equal, so Uber treats it carefully when averaging.",
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
            "Start with the biggest split: structured vs. unstructured. Structured data fits neatly into rows and columns — a spreadsheet, a database table. Unstructured data does not — free text, images, audio, video. Most beginner data work happens on structured data, so we'll focus there.",
        },
        {
          type: "analogy",
          title: "A filing cabinet vs. a shoebox of photos",
          content:
            "Structured data is a filing cabinet: every document has a labelled folder and a fixed place. You can instantly find 'March invoices.' Unstructured data is a shoebox of photos: rich and valuable, but you can't sort it by a column because there are no columns. To search it, you first have to add structure — tags, dates, faces.",
        },
        {
          type: "keypoint",
          title: "Numerical vs. categorical",
          content:
            "Within structured data, every column is either numerical (a measured quantity you can do arithmetic on — price, age, temperature) or categorical (a label that names a group — colour, city, yes/no). The single best test: does taking an average make sense? If yes, it's numerical. Averaging 'red' and 'blue' is nonsense — so colour is categorical.",
        },
        {
          type: "text",
          content:
            "Numerical data splits again. Discrete data counts things and only takes whole values — number of children, cars sold, login attempts. Continuous data measures things and can take any value in a range — height, weight, time, temperature.",
        },
        {
          type: "code-note",
          code: "children = 3          # discrete: you can't have 2.5 children\nheight_cm = 172.4     # continuous: any value in a range\ncity = 'Lagos'        # categorical (nominal): a label, no order\nrating = 4            # categorical (ordinal): a label WITH order",
          content:
            "Notice that `rating = 4` is stored as a number but behaves like a category — the order matters but the gaps may not be equal. How a value is stored doesn't always match what kind of data it truly is. Always ask what the value means, not just how it looks.",
        },
        {
          type: "text",
          content:
            "Categorical data also splits in two. Nominal categories have no natural order — country, colour, product name. Ordinal categories have a meaningful order but unclear gaps — 'small / medium / large', star ratings, education level. The order lets you rank them, but you can't safely say medium minus small equals a fixed amount.",
        },
        {
          type: "warning",
          title: "A number stored in a column isn't always numerical data",
          content:
            "Postal codes, phone numbers, and customer IDs are stored as digits but are really categorical labels — averaging them is meaningless. Before treating a column as numerical, ask: 'Would arithmetic on these values mean anything?' If not, it's categorical, whatever it looks like.",
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
        title: "The Data Type Family Tree",
        caption:
          "Click any node to see its definition, an example, and the summary you're allowed to compute for it.",
        nodes: [
          {
            id: "data",
            label: "Data",
            sublabel: "Start here",
            detail:
              "Any recorded value. The first question is always: does it fit neatly into rows and columns?",
            x: 50,
            y: 10,
            accent: true,
          },
          {
            id: "structured",
            label: "Structured",
            sublabel: "Fits a table",
            detail:
              "Organised into rows and columns — spreadsheets, database tables. Easy to filter, sort, and summarise. This is where most beginner data work lives.",
            x: 28,
            y: 32,
            accent: false,
          },
          {
            id: "unstructured",
            label: "Unstructured",
            sublabel: "No table",
            detail:
              "Free text, images, audio, video. Rich but hard to query until you add structure. Example: the text of a product review. Needs language or image processing first.",
            x: 74,
            y: 32,
            accent: false,
          },
          {
            id: "numerical",
            label: "Numerical",
            sublabel: "Measured quantity",
            detail:
              "Values you can do arithmetic on: price, age, temperature. Valid summary: mean, median, standard deviation. Test: does taking an average make sense?",
            x: 14,
            y: 58,
            accent: true,
          },
          {
            id: "categorical",
            label: "Categorical",
            sublabel: "A label",
            detail:
              "Values that name a group: colour, city, yes/no. Valid summary: count and mode (most frequent). You cannot take a meaningful average.",
            x: 42,
            y: 58,
            accent: true,
          },
          {
            id: "discrete",
            label: "Discrete",
            sublabel: "Counts (3)",
            detail:
              "Whole-number counts: number of children, cars sold, login attempts. You can't have 2.5 of them.",
            x: 6,
            y: 84,
            accent: false,
          },
          {
            id: "continuous",
            label: "Continuous",
            sublabel: "Measures (1.72m)",
            detail:
              "Any value in a range: height, weight, time. Between any two values there's always another possible value.",
            x: 24,
            y: 84,
            accent: false,
          },
          {
            id: "nominal",
            label: "Nominal",
            sublabel: "No order",
            detail:
              "Labels with no natural order: country, colour, product name. You can count them but not rank them.",
            x: 42,
            y: 84,
            accent: false,
          },
          {
            id: "ordinal",
            label: "Ordinal",
            sublabel: "Ordered labels",
            detail:
              "Labels with a meaningful order but unclear gaps: small/medium/large, star ratings, education level. You can rank them but not safely subtract them.",
            x: 60,
            y: 84,
            accent: false,
          },
        ],
        edges: [
          { from: "data", to: "structured" },
          { from: "data", to: "unstructured" },
          { from: "structured", to: "numerical" },
          { from: "structured", to: "categorical" },
          { from: "numerical", to: "discrete" },
          { from: "numerical", to: "continuous" },
          { from: "categorical", to: "nominal" },
          { from: "categorical", to: "ordinal" },
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
          title: "Numerical or categorical?",
          scenario:
            "You open a customer table with a column called age holding values like 27, 34, 41.",
          steps: [
            {
              code: "age = [27, 34, 41]  # does averaging make sense?",
              explanation:
                "Apply the average test: the mean age of these customers (34) is a meaningful, useful number. So age is numerical data.",
            },
          ],
          output: "age → numerical (the average is meaningful).",
        },
        {
          difficulty: "Easy",
          title: "The disguised category",
          scenario:
            "The same table has a zip_code column with values like 10001, 60614, 94103.",
          steps: [
            {
              code: "zip_code = [10001, 60614, 94103]",
              explanation:
                "These are stored as numbers, which tempts you to call them numerical.",
            },
            {
              code: "average_zip = (10001 + 60614 + 94103) / 3  # = 54906",
              explanation:
                "The 'average zip code' (54906) is meaningless — it doesn't point to a real place halfway between the three. Arithmetic is nonsense here, so zip_code is categorical (nominal), despite being digits.",
            },
          ],
          output: "zip_code → categorical / nominal (a label that happens to look like a number).",
        },
        {
          difficulty: "Medium",
          title: "Discrete vs. continuous",
          scenario:
            "A fitness app records two columns per workout: steps_taken and distance_km.",
          steps: [
            {
              code: "steps_taken = 8423",
              explanation:
                "Steps are counted in whole units — you can't take half a step in this count. That makes steps_taken discrete numerical.",
            },
            {
              code: "distance_km = 6.47",
              explanation:
                "Distance is measured and can take any value in a range — 6.47, 6.471, 6.4713. Between any two distances there's always another. That makes distance_km continuous numerical.",
            },
          ],
          output: "steps_taken → discrete; distance_km → continuous.",
        },
        {
          difficulty: "Hard",
          title: "Nominal vs. ordinal — and why it matters",
          scenario:
            "A clothing retailer has two categorical columns: color ('red', 'blue', 'green') and size ('S', 'M', 'L', 'XL').",
          steps: [
            {
              code: "color = ['red', 'blue', 'green']",
              explanation:
                "There's no natural order — red isn't 'more' than blue. This is nominal. You can count how many red items sold, but you can't rank the colours.",
            },
            {
              code: "size = ['S', 'M', 'L', 'XL']",
              explanation:
                "Here order matters: S < M < L < XL. This is ordinal. You can say a customer sized up, and you can sort by size.",
            },
            {
              code: "gap = 'is L minus M the same as XL minus L?'",
              explanation:
                "The catch: the gaps between ordinal categories aren't guaranteed equal, so treating them as plain numbers (S=1, M=2...) can mislead. Rank them, yes; do arithmetic on them, carefully.",
            },
          ],
          output: "color → nominal; size → ordinal (order is real, gaps are not).",
        },
        {
          difficulty: "Industry Example",
          title: "Typing a Netflix viewing record",
          scenario:
            "A data team at Netflix looks at one row from the viewing logs and labels every column's type before building anything.",
          steps: [
            {
              code: "user_id = 'U8841723'      # identifier",
              explanation:
                "Stored as text but purely a label — categorical (nominal). Never averaged; used to group and join.",
            },
            {
              code: "minutes_watched = 47.5    # measured\ntitles_finished = 2       # counted",
              explanation:
                "minutes_watched is continuous numerical (any value in a range). titles_finished is discrete numerical (whole counts). Both support averages and totals.",
            },
            {
              code: "rating = 4                # 1-5 thumbs scale\ndevice = 'Smart TV'       # from a fixed list",
              explanation:
                "rating is ordinal categorical — order matters but gaps aren't guaranteed equal. device is nominal categorical. Typing every column first tells the team which charts and models are valid before they write a line of analysis.",
            },
          ],
          output: "6 columns, 4 distinct types — the map that guides every later step.",
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
        filename: "type_the_columns.py",
        instructions:
          "You're handed one row from an e-commerce orders table. Label each column with the correct data type by filling in the blanks. Use exactly one of these strings for each: \"numerical\" or \"categorical\". Remember the average test — if taking a mean is meaningless, it's categorical, even if it looks like a number.",
        starterCode: `# One row from an orders table
order_id     = "ORD-58120"   # a unique code
price_usd    = 49.99          # amount paid
quantity     = 3              # units bought
country      = "Kenya"        # ship-to country

# TODO: label each column "numerical" or "categorical"
order_id_type  = ___
price_usd_type = ___
quantity_type  = ___
country_type   = ___

print(order_id_type, price_usd_type, quantity_type, country_type)`,
        solutionCode: `# One row from an orders table
order_id     = "ORD-58120"   # a unique code
price_usd    = 49.99          # amount paid
quantity     = 3              # units bought
country      = "Kenya"        # ship-to country

order_id_type  = "categorical"
price_usd_type = "numerical"
quantity_type  = "numerical"
country_type   = "categorical"

print(order_id_type, price_usd_type, quantity_type, country_type)`,
        expectedOutput: "categorical numerical numerical categorical",
        hints: [
          "For each column ask: would taking an average mean anything?",
          "order_id is a label — the 'average order ID' is meaningless.",
          "price_usd and quantity both support meaningful averages and totals.",
          "country names a group with no order — categorical (nominal).",
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
          id: "fnd02_mcq_01",
          difficulty: "Easy",
          question:
            "Which of these is unstructured data?",
          options: [
            "A spreadsheet of monthly sales",
            "The text of a customer's written product review",
            "A database table of user accounts",
            "A column of ages",
          ],
          correctIndex: 1,
          explanation:
            "Free-form review text has no rows and columns — it's unstructured. The other three are all organised into tables, which makes them structured.",
        },
        {
          type: "mcq",
          id: "fnd02_mcq_02",
          difficulty: "Easy",
          question:
            "What is the quickest test for whether a column is numerical rather than categorical?",
          options: [
            "Whether the values are stored as digits",
            "Whether taking an average of the values is meaningful",
            "Whether the column has more than 10 rows",
            "Whether the values are sorted",
          ],
          correctIndex: 1,
          explanation:
            "The average test is the reliable check: if a mean is meaningful, the data is numerical. Being stored as digits is misleading (zip codes are digits but categorical). Row count and sorting are irrelevant.",
        },
        {
          type: "mcq",
          id: "fnd02_mcq_03",
          difficulty: "Medium",
          question:
            "A column counts the number of items in each customer's cart: 1, 3, 0, 2. What type is it?",
          options: [
            "Continuous numerical",
            "Discrete numerical",
            "Nominal categorical",
            "Ordinal categorical",
          ],
          correctIndex: 1,
          explanation:
            "Cart counts are whole numbers you can average — numerical — and they only take whole values, which makes them discrete. It's not continuous (you can't have 1.5 items), and it's not categorical because arithmetic is meaningful.",
        },
        {
          type: "scenario",
          id: "fnd02_sc_01",
          difficulty: "Medium",
          scenario:
            "A survey stores satisfaction as 'Poor', 'Fair', 'Good', 'Excellent'. A teammate wants to convert them to 1, 2, 3, 4 and then take the average.",
          question: "What is the right way to think about this?",
          options: [
            "It's fine — the data is numerical once converted",
            "It's ordinal: the order is real so ranking is valid, but the equal-gap assumption behind averaging may not hold",
            "It's nominal, so you can't even rank it",
            "It's continuous data",
          ],
          correctIndex: 1,
          explanation:
            "Satisfaction levels are ordinal — they have a genuine order, so ranking and sorting are valid. But averaging assumes the gap from Poor→Fair equals Fair→Good, which isn't guaranteed, so the mean must be read with caution. It's not truly numerical, and it's not nominal because order clearly matters.",
        },
        {
          type: "coding",
          id: "fnd02_code_01",
          difficulty: "Medium",
          prompt:
            "You have a list of city names for delivery stops: cities = ['Lagos', 'Nairobi', 'Lagos', 'Accra', 'Lagos']. Because city is categorical, the right summary is the mode (most frequent value), not the mean. Print the most common city. Use only what you know: you may use the list's .count() method.",
          starterCode:
            "cities = ['Lagos', 'Nairobi', 'Lagos', 'Accra', 'Lagos']\n# Print the most frequently occurring city\n",
          solutionCode:
            "cities = ['Lagos', 'Nairobi', 'Lagos', 'Accra', 'Lagos']\nmost_common = max(set(cities), key=cities.count)\nprint(most_common)",
          expectedOutput: "Lagos",
          tests: [
            {
              name: "Correct summary type",
              description: "Uses the mode (most frequent), not an average.",
            },
            {
              name: "Output",
              description: "Prints Lagos, which appears three times.",
            },
          ],
        },
        {
          type: "scenario",
          id: "fnd02_sc_02",
          difficulty: "Hard",
          scenario:
            "A dataset has a phone_number column stored as large integers, and a marketing analyst suggests using its average as a feature in a model.",
          question: "How should you respond?",
          options: [
            "Agree — it's stored as a number, so its average is a valid feature",
            "Push back — phone numbers are categorical identifiers; their average is meaningless and should not be a feature",
            "Agree, but only if the numbers are sorted first",
            "Push back — phone numbers are continuous data",
          ],
          correctIndex: 1,
          explanation:
            "A phone number is a label that happens to be digits — categorical, not numerical. Its average points to nothing real, so it's a useless (and misleading) feature. Sorting doesn't change the type, and it is certainly not continuous measured data.",
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
            "What is the difference between structured and unstructured data? Give an example of each.",
          answer:
            "Structured data fits neatly into rows and columns, like a spreadsheet or a database table of orders — it's easy to filter, sort, and summarise. Unstructured data has no such fixed shape: free text, images, audio, and video. For example, a customer's order history is structured, while the text of their written review is unstructured and needs language processing before it becomes analysable. Most organisations have far more unstructured data, but structured data is where most analysis starts.",
        },
        {
          question:
            "What's the difference between nominal and ordinal categorical data, and why does it matter in practice?",
          answer:
            "Both are categories, but ordinal data has a meaningful order while nominal data doesn't. Colour and country are nominal — no colour is 'greater' than another. Size (S, M, L) or a satisfaction rating (Poor to Excellent) is ordinal — the order is real. It matters because the type dictates valid operations: for both you can count and take a mode, but only for ordinal can you rank or sort meaningfully. The subtle trap is that the gaps between ordinal levels aren't guaranteed equal, so converting them to 1, 2, 3 and averaging can mislead. In modelling, this also drives your encoding choice — one-hot encoding for nominal, ordinal encoding for ordinal.",
        },
        {
          question:
            "A column is stored as integers. What questions do you ask before treating it as numerical data in a model, and why?",
          answer:
            "The storage type tells you almost nothing — I'd ask what the values actually mean. My first question is whether arithmetic on them is meaningful: does the average or sum point to something real? If it's a zip code, phone number, or product ID, the answer is no — it's a categorical identifier wearing a numeric costume, and feeding its average into a model adds noise or spurious structure. My second question is whether it's really ordinal, like a 1-to-5 rating, where order matters but equal gaps don't, which changes how I encode it. I'd also check the cardinality: an integer column with only a handful of distinct values is often a category in disguise. Getting this wrong is one of the most common quiet bugs in a feature pipeline, because the code runs fine while the results are meaningless.",
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
        "1) Treating any digits as numerical — zip codes, phone numbers, and IDs are categorical labels. 2) Averaging ordinal ratings as if the gaps between levels were equal. 3) Confusing discrete (counts, whole numbers) with continuous (measures, any value in a range). 4) Forgetting that how a value is STORED (as text or a number) doesn't always match what KIND of data it truly is — always ask what the value means.",
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
        "Try these prompts in the AI Tutor panel: • 'Give me 10 random values and quiz me on their data type.' • 'ELI5: why can't I average a categorical column?' • 'Explain nominal vs. ordinal with a fresh example.' • 'Show me a column that looks numerical but is actually categorical.' • 'Summarise the data type family tree in five bullet points.'",
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
        "Structured data — data organised in rows and columns (tables). Unstructured data — data with no fixed table shape (text, images, audio). Numerical data — measured quantities you can do arithmetic on. Categorical data — labels naming a group. Discrete — numerical values that are whole counts. Continuous — numerical values that can take any value in a range. Nominal — categories with no order. Ordinal — categories with a meaningful order but unclear gaps. Mode — the most frequent value; the valid 'centre' for categorical data.",
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
        "• Reference: 'Levels of measurement' (nominal, ordinal, interval, ratio) on Wikipedia — the classic framework this lesson simplifies. • Article: 'Structured vs. Unstructured Data' explainers from IBM and Google Cloud. • Practice: open any spreadsheet you have and label every column's type before reading its contents. • Next in DSM: with data types in hand, you're ready to see the full journey a project takes — the data science workflow.",
    },

    /* ---------------------------------------------------------------- */
    /*  12 — Recap                                                       */
    /* ---------------------------------------------------------------- */
    {
      id: "recap",
      type: "recap",
      tocLabel: "Recap",
      content:
        "✓ Structured data fits in rows and columns; unstructured data (text, images, audio) does not.\n✓ Structured columns are either numerical (arithmetic makes sense) or categorical (labels).\n✓ Numerical splits into discrete (whole counts) and continuous (any value in a range).\n✓ Categorical splits into nominal (no order) and ordinal (ordered, but unequal gaps).\n✓ The average test settles most cases — and a value's storage format doesn't always match its true type.\n\nNext up: The Data Science Workflow. Now that you can read the raw material, you'll follow it through an entire project — from the first question to the final decision — and see why real data work loops instead of running in a straight line.",
    },
  ],
};
