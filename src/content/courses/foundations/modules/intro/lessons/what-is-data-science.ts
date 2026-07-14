import type { Lesson } from "@/lib/curriculum/types";

/** Skill unlocked: can explain what data science is and distinguish it from
 *  analytics, statistics, and software engineering. */
export const whatIsDataScience: Lesson = {
  meta: {
    id: "foundations.intro.what-is-data-science",
    slug: "what-is-data-science",
    title: "What Is Data Science?",
    description:
      "Define data science, see how it blends statistics, programming, and domain knowledge, and understand the kinds of problems it solves.",
    estimatedTime: "15 mins",
    difficulty: "Beginner",
    xpReward: 40,
    prerequisites: [],
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
        hook: "Netflix knows what you'll want to watch on Friday night before you do. That's not magic — it's data science: the practice of turning raw records of what people do into decisions a business can act on. By the end of this lesson you'll be able to say clearly what data science is, and just as importantly, what it is not.",
        what: "Data science is the discipline of extracting useful knowledge from data. It combines three things: statistics (to reason about uncertainty), programming (to work with data at scale), and domain knowledge (to ask the right questions).",
        why: "Every organisation now records data — clicks, purchases, sensor readings, support tickets. That data is worthless until someone turns it into a decision. Data science is the bridge between 'we have data' and 'we know what to do.'",
        whereUsed:
          "Product recommendations, fraud detection, medical diagnosis, weather forecasting, credit scoring, self-driving cars, and the ranking of every search result you've ever seen.",
        objectives: [
          "Define data science in one plain sentence",
          "Name the three fields data science combines",
          "Distinguish data science from analytics, statistics, and software engineering",
          "Identify the kinds of questions data science can answer",
          "Recognise real data science work at companies you already know",
        ],
        realWorldApps: [
          {
            company: "Netflix",
            headline: "Recommending your next show",
            detail:
              "Netflix studies what millions of people watch, pause, and abandon, then predicts which title will keep you subscribed. Most of what people watch on the service comes from these recommendations — a direct data science product.",
          },
          {
            company: "JPMorgan",
            headline: "Catching fraud in real time",
            detail:
              "Every card swipe is scored against your past behaviour in milliseconds. A purchase that doesn't fit your pattern gets flagged. That scoring model is built and tuned by data scientists.",
          },
          {
            company: "WHO",
            headline: "Tracking disease outbreaks",
            detail:
              "Public-health teams combine case counts, travel data, and demographics to predict where an outbreak will spread next, so resources arrive before hospitals are overwhelmed.",
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
            "Here is the shortest honest definition: data science is using data to answer questions and make decisions. The questions can be about the past ('why did sales drop in March?'), the present ('is this transaction fraud?'), or the future ('how many drivers will we need on Friday?').",
        },
        {
          type: "analogy",
          title: "Data science is like being a detective",
          content:
            "A detective starts with a question ('who did it?'), gathers evidence (data), looks for patterns, rules out false leads, and builds a case that holds up. A data scientist does the same — except the evidence is spreadsheets and logs, and the case is a recommendation a business will act on. The analogy breaks down in one place: a detective needs one certain answer, while a data scientist often reports a probability ('85% likely to cancel'), not a certainty.",
        },
        {
          type: "keypoint",
          title: "The three ingredients",
          content:
            "Data science sits at the overlap of three skills. Statistics tells you whether a pattern is real or just noise. Programming lets you handle data too big for a spreadsheet. Domain knowledge tells you which questions are worth asking in the first place. Remove any one and the work falls apart.",
        },
        {
          type: "text",
          content:
            "People confuse data science with related jobs. The difference is mostly about which question you're answering and how far into the future you're looking. A data analyst explains what already happened. A data scientist builds systems that predict what will happen next and often act on it automatically.",
        },
        {
          type: "code-note",
          code: 'question = "How many umbrellas will we sell tomorrow?"\ninputs = ["past sales", "weather forecast", "day of week"]\noutput = "a predicted number: 320 units"\nprint(f"Data science turns {len(inputs)} inputs into one decision.")\n# Output: Data science turns 3 inputs into one decision.',
          content:
            "This is the shape of every data science task: take several inputs, combine them, and produce one decision or prediction. You don't need to understand the Python yet — just notice the pattern of inputs going in and a decision coming out.",
        },
        {
          type: "expandable",
          title: "Data science vs. machine learning vs. AI",
          content:
            "These terms overlap and get used loosely. Artificial intelligence (AI) is the broad goal of making machines act intelligently. Machine learning (ML) is one way to reach it — programs that improve from data instead of being explicitly coded. Data science is the wider practice of working with data to answer questions; it uses ML as one of many tools, alongside plain statistics and visualisation. In short: not all data science is ML, and not all AI is data science.",
        },
        {
          type: "warning",
          title: "Data science is not just 'big data' or coding",
          content:
            "Beginners often think data science means writing lots of code or handling huge datasets. Neither is the core. A sharp insight from a 200-row spreadsheet is data science; a 10-million-row pipeline that answers the wrong question is not. The thinking matters more than the tooling.",
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
        title: "The Three Fields That Make Data Science",
        caption:
          "Click each field to see what it contributes — and what breaks when it's missing.",
        nodes: [
          {
            id: "stats",
            label: "Statistics",
            sublabel: "Is the pattern real?",
            detail:
              "Statistics is the mathematics of uncertainty. It tells you whether a difference in the data is meaningful or just random chance. Without it, you mistake noise for signal and act on patterns that aren't there.",
            x: 22,
            y: 30,
            accent: true,
          },
          {
            id: "programming",
            label: "Programming",
            sublabel: "Can we do it at scale?",
            detail:
              "Programming (usually Python) lets you clean, combine, and analyse data far larger than any spreadsheet. Without it, you're limited to what you can do by hand — fine for 100 rows, impossible for 10 million.",
            x: 78,
            y: 30,
            accent: false,
          },
          {
            id: "domain",
            label: "Domain Knowledge",
            sublabel: "What should we ask?",
            detail:
              "Domain knowledge is understanding the business or field you work in. It tells you which questions matter and whether an answer makes sense. Without it, you produce technically correct answers to useless questions.",
            x: 50,
            y: 74,
            accent: false,
          },
          {
            id: "ds",
            label: "Data Science",
            sublabel: "The overlap",
            detail:
              "Data science lives where all three meet. A great data scientist is rarely the best statistician, coder, or domain expert in the room — but is the only person who is competent at all three at once.",
            x: 50,
            y: 46,
            accent: true,
          },
        ],
        edges: [
          { from: "stats", to: "ds", label: "rigour" },
          { from: "programming", to: "ds", label: "scale" },
          { from: "domain", to: "ds", label: "relevance" },
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
          title: "Spotting a data science question",
          scenario:
            "You work at a music streaming service. Someone asks: 'Which songs should we suggest to a user who just finished a workout playlist?'",
          steps: [
            {
              code: 'question = "What should we recommend next?"',
              explanation:
                "This asks about the future ('what next?') and needs to combine data (what this user played, what similar users played). That combination of prediction plus data makes it a data science question.",
            },
          ],
          output: "Yes — this is a data science question (it predicts and personalises).",
        },
        {
          difficulty: "Easy",
          title: "Analyst question vs. data scientist question",
          scenario: "An e-commerce manager has two questions about last quarter.",
          steps: [
            {
              code: 'q1 = "How many jackets did we sell in December?"',
              explanation:
                "This describes the past with a simple count. It's an analytics question — answerable by looking up a number. Valuable, but backward-looking.",
            },
            {
              code: 'q2 = "Which customers are likely to buy a jacket next month?"',
              explanation:
                "This predicts future behaviour for individuals. It needs a model trained on past patterns. That's a data science question.",
            },
          ],
          output: "q1 = analytics (describe the past); q2 = data science (predict the future).",
        },
        {
          difficulty: "Medium",
          title: "Choosing the right ingredient",
          scenario:
            "A hospital wants to know if a new medication genuinely reduces recovery time, or if the improvement they saw was luck.",
          steps: [
            {
              code: "step = 'Get the data'",
              explanation:
                "Programming collects and cleans recovery times for patients who did and didn't take the medication. This is the scale ingredient.",
            },
            {
              code: "step = 'Test the difference'",
              explanation:
                "Statistics checks whether the difference in recovery time is larger than you'd expect from random variation. This is the rigour ingredient — it stops you claiming a result that isn't real.",
            },
            {
              code: "step = 'Interpret for clinicians'",
              explanation:
                "Domain knowledge decides whether a two-day improvement actually matters medically, and whether the two patient groups were truly comparable. This is the relevance ingredient.",
            },
          ],
          output: "All three ingredients are needed — remove statistics and you'd trust a fluke.",
        },
        {
          difficulty: "Hard",
          title: "When it looks like data science but isn't",
          scenario:
            "A team builds a huge dashboard that pulls 50 million rows and shows yesterday's total sales in one big number.",
          steps: [
            {
              code: "has_lots_of_data = True",
              explanation:
                "Big data alone is not data science. Volume is a property of the dataset, not of the work.",
            },
            {
              code: "predicts_or_decides = False",
              explanation:
                "The dashboard only reports a past total. There's no prediction, no model, no decision being learned from the data.",
            },
            {
              code: "verdict = 'analytics / reporting, not data science'",
              explanation:
                "This is valuable business intelligence, but calling it data science stretches the term. The line is whether you're learning a pattern to act on, not how many rows you touched.",
            },
          ],
          output: "verdict = 'analytics / reporting, not data science'",
        },
        {
          difficulty: "Industry Example",
          title: "How Airbnb prices a listing",
          scenario:
            "Airbnb suggests a nightly price to hosts. Walk through why this is a textbook data science system.",
          steps: [
            {
              code: "inputs = ['location', 'season', 'reviews', 'nearby prices', 'day of week']",
              explanation:
                "Programming gathers dozens of signals for every listing — far beyond what a host could weigh by hand. That's the scale ingredient at work.",
            },
            {
              code: "model = 'learns from millions of past bookings'",
              explanation:
                "Statistics and machine learning find which combinations of signals led to bookings. The model learns the pattern instead of a human hard-coding rules.",
            },
            {
              code: "output = 'suggested price: $142/night'",
              explanation:
                "Domain knowledge frames the output usefully: a suggestion the host can accept or override, not a mandate. The system predicts, personalises, and informs a real decision — the hallmarks of data science.",
            },
          ],
          output: "output = 'suggested price: $142/night' — prediction + data + a real decision.",
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
        filename: "classify_questions.py",
        instructions:
          "This is your first hands-on activity — no prior coding needed. Below are two business questions stored as text. Your job is to label each one as either 'analytics' (describes the past) or 'data science' (predicts the future) by filling in the blanks with the correct label in quotes. Then run the code.",
        starterCode: `# A retail team has two questions.
question_1 = "How much revenue did we make last week?"
question_2 = "Which customers will cancel their subscription next month?"

# TODO: Fill each blank with either "analytics" or "data science"
label_1 = ___
label_2 = ___

print(f"Q1 is {label_1}")
print(f"Q2 is {label_2}")`,
        solutionCode: `# A retail team has two questions.
question_1 = "How much revenue did we make last week?"
question_2 = "Which customers will cancel their subscription next month?"

label_1 = "analytics"
label_2 = "data science"

print(f"Q1 is {label_1}")
print(f"Q2 is {label_2}")`,
        expectedOutput: "Q1 is analytics\nQ2 is data science",
        hints: [
          "Ask of each question: is it about the past, or about the future?",
          "A question you answer by looking up a number is analytics.",
          "A question that needs a prediction about what will happen is data science.",
          "Q1 describes last week (analytics). Q2 predicts next month (data science).",
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
          id: "fnd01_mcq_01",
          difficulty: "Easy",
          question: "Which sentence best defines data science?",
          options: [
            "Writing as much code as possible to process data",
            "Using data to answer questions and make decisions",
            "Storing very large datasets on powerful servers",
            "Building websites that display charts",
          ],
          correctIndex: 1,
          explanation:
            "Data science is fundamentally about turning data into decisions. Writing code and storing data are tools that support this, not the goal itself. Displaying charts is one possible output, not the definition.",
        },
        {
          type: "mcq",
          id: "fnd01_mcq_02",
          difficulty: "Easy",
          question: "Which three fields does data science combine?",
          options: [
            "Design, marketing, and finance",
            "Statistics, programming, and domain knowledge",
            "Databases, networking, and security",
            "Mathematics, physics, and chemistry",
          ],
          correctIndex: 1,
          explanation:
            "Data science lives at the overlap of statistics (rigour), programming (scale), and domain knowledge (relevance). The other groups describe different jobs entirely.",
        },
        {
          type: "scenario",
          id: "fnd01_sc_01",
          difficulty: "Medium",
          scenario:
            "A bank asks two questions. Question A: 'What was our total number of new accounts last month?' Question B: 'Which loan applicants are likely to default?'",
          question: "How should you classify these two questions?",
          options: [
            "Both are data science questions",
            "A is analytics (describes the past); B is data science (predicts the future)",
            "A is data science; B is analytics",
            "Neither involves data",
          ],
          correctIndex: 1,
          explanation:
            "A is a lookup of a past count — analytics. B requires predicting future behaviour for individuals using a model — data science. B is not analytics because it looks forward; A is not data science because it only describes what already happened.",
        },
        {
          type: "mcq",
          id: "fnd01_mcq_03",
          difficulty: "Medium",
          question:
            "Why does data science need domain knowledge, not just statistics and programming?",
          options: [
            "To make the code run faster",
            "To decide which questions are worth asking and whether an answer makes sense",
            "To store data more efficiently",
            "Because statistics and programming are optional",
          ],
          correctIndex: 1,
          explanation:
            "Domain knowledge supplies relevance — it points you at the questions that matter and sanity-checks results. It doesn't affect code speed or storage, and it complements rather than replaces the other two ingredients.",
        },
        {
          type: "scenario",
          id: "fnd01_sc_02",
          difficulty: "Medium",
          scenario:
            "A colleague says: 'We process 40 million rows a night, so our reporting dashboard is a data science project.'",
          question: "What is the best response?",
          options: [
            "Agree — big data always means data science",
            "Disagree — volume alone doesn't make it data science; there's no prediction or learned pattern",
            "Agree — any dashboard counts as data science",
            "Disagree — 40 million rows is too few to count",
          ],
          correctIndex: 1,
          explanation:
            "Data volume is a property of the dataset, not the work. Reporting a past total is analytics. It becomes data science when a pattern is learned to predict or decide something. The row count, high or low, is irrelevant to the label.",
        },
        {
          type: "mcq",
          id: "fnd01_mcq_04",
          difficulty: "Hard",
          question:
            "Which statement about the relationship between AI, machine learning, and data science is correct?",
          options: [
            "They are three names for exactly the same thing",
            "Machine learning is one tool data science can use; not all data science is machine learning",
            "Data science is a subset of machine learning",
            "AI has nothing to do with data",
          ],
          correctIndex: 1,
          explanation:
            "Machine learning is one technique among many that data science uses, alongside plain statistics and visualisation. The terms overlap but aren't identical, data science isn't a subset of ML, and AI is deeply tied to data.",
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
          question: "In your own words, what is data science?",
          answer:
            "Data science is the practice of using data to answer questions and drive decisions. It combines statistics to reason about uncertainty, programming to work with data at scale, and domain knowledge to ask the right questions. A simple example: predicting which customers are likely to cancel a subscription so the business can act before they leave.",
        },
        {
          question:
            "How would you explain the difference between a data analyst and a data scientist to a non-technical manager?",
          answer:
            "The clearest line is time direction and automation. A data analyst mostly explains what already happened — building reports and dashboards that answer questions like 'how did sales do last quarter?' A data scientist tends to look forward, building models that predict what will happen next and often act automatically, like a system that flags fraud in real time. The roles overlap heavily, and titles vary between companies, but that past-versus-future framing captures the core difference. In practice a data scientist usually needs stronger programming and statistics, while an analyst often has deeper business-reporting skills.",
        },
        {
          question:
            "Some people argue 'data science' is just a rebranding of statistics. How would you respond?",
          answer:
            "There's a grain of truth — statistics is the intellectual core, and much of what we do is applied statistical reasoning. But data science is genuinely broader in a few ways. First, scale: modern datasets require serious programming and engineering that classical statistics never assumed. Second, the product focus: data scientists frequently ship models into production systems that make live decisions, which is closer to software engineering than to academic statistics. Third, the emphasis on messy, observational, real-world data rather than clean experimental data. So I'd frame it as statistics being the foundation, with data science adding computing at scale, engineering, and a product mindset on top. The risk to avoid is treating data science as 'statistics you can skip' — the rigour still matters, or you end up trusting flukes.",
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
        "1) Equating data science with 'more code' or 'big data' — the thinking matters more than the tooling. 2) Confusing describing the past (analytics) with predicting the future (data science). 3) Skipping domain knowledge and producing correct answers to useless questions. 4) Trusting a pattern without checking, with statistics, whether it's real or just random noise.",
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
        "Stuck or curious? Try these prompts in the AI Tutor panel: • 'ELI5: what is data science?' • 'Give me three more examples of analytics questions vs. data science questions.' • 'Quiz me on the three ingredients of data science.' • 'What's the difference between machine learning and data science?' • 'Interview mode: ask me to define data science and critique my answer.'",
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
        "Data science — using data to answer questions and make decisions. Analytics — describing and explaining what already happened. Statistics — the mathematics of uncertainty; deciding if a pattern is real. Domain knowledge — understanding the field you work in well enough to ask the right questions. Machine learning (ML) — programs that improve from data instead of being explicitly coded. Model — a rule learned from data that turns inputs into a prediction. Signal vs. noise — a real, repeatable pattern versus random variation.",
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
        "• Book: 'Data Science for Business' by Provost & Fawcett — the clearest non-technical explanation of what data science is for. • Article: Drew Conway's 'The Data Science Venn Diagram' — the classic three-circles picture you saw in this lesson. • Video: search 'What is Data Science?' talks on YouTube from practitioners at Google and Netflix. • Next in DSM: the following lessons make these ideas concrete, starting with the raw material itself — data.",
    },

    /* ---------------------------------------------------------------- */
    /*  12 — Recap                                                       */
    /* ---------------------------------------------------------------- */
    {
      id: "recap",
      type: "recap",
      tocLabel: "Recap",
      content:
        "✓ Data science is using data to answer questions and make decisions.\n✓ It combines three fields: statistics (rigour), programming (scale), and domain knowledge (relevance).\n✓ Analytics describes the past; data science predicts the future and often acts on it.\n✓ Big data and lots of code are tools, not the definition — a small dataset can still fuel real data science.\n✓ Machine learning is one tool data science uses; the two are not the same thing.\n\nNext up: Types of Data. You now know what data science does — but it all runs on one raw material: data. In the next lesson you'll learn the different kinds of data you'll meet, and why telling them apart is the first practical skill every data scientist needs.",
    },
  ],
};
