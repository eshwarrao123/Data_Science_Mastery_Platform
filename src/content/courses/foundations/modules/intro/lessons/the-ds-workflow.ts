import type { Lesson } from "@/lib/curriculum/types";

/** Skill unlocked: can map any data problem onto the standard lifecycle stages,
 *  giving structure to every project that follows. */
export const theDsWorkflow: Lesson = {
  meta: {
    id: "foundations.intro.the-ds-workflow",
    slug: "the-ds-workflow",
    title: "The Data Science Workflow",
    description:
      "Walk the end-to-end lifecycle — ask, collect, clean, explore, model, communicate — and see why real projects loop rather than run in a straight line.",
    estimatedTime: "20 mins",
    difficulty: "Beginner",
    xpReward: 40,
    prerequisites: ["foundations.intro.types-of-data"],
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
        hook: "Beginners think a data science project is 'build a model.' In reality, experienced practitioners spend most of their time long before and long after the model — framing the right question and cleaning messy data. There's a repeatable path through every project, and knowing it means you never stare at a dataset wondering 'what now?' By the end of this lesson you'll have that map.",
        what: "The data science workflow is the sequence of stages nearly every project moves through: ask a question, collect data, clean it, explore it, model it, and communicate the result. It's a loop, not a straight line — you often go back a step.",
        why: "Without a workflow you jump straight to charts or models and get lost. The workflow gives every project a shared structure, so you always know what stage you're in and what comes next. It's also how teams divide and hand off work.",
        whereUsed:
          "Every data science project at every company follows some version of this lifecycle. It underpins famous frameworks like CRISP-DM and the way data teams plan sprints and deliverables.",
        objectives: [
          "List the six stages of the data science workflow in order",
          "Describe the goal of each stage in one sentence",
          "Explain why the workflow is a loop, not a straight line",
          "Identify which stage typically consumes the most time",
          "Map a real business problem onto the workflow stages",
        ],
        realWorldApps: [
          {
            company: "Uber",
            headline: "From question to surge model",
            detail:
              "A pricing project starts with a question ('where will demand spike?'), collects trip and weather data, cleans it, explores patterns by time and place, models the forecast, then ships it to the driver app — the full loop.",
          },
          {
            company: "Airbnb",
            headline: "Cleaning eats the calendar",
            detail:
              "Airbnb's data scientists report that collecting and cleaning listing and booking data takes far more time than the modelling itself — a pattern true across the whole industry.",
          },
          {
            company: "Spotify",
            headline: "Communicate or it didn't happen",
            detail:
              "A great churn model is worthless until its findings reach the product team as a clear recommendation. The final 'communicate' stage is what turns analysis into action.",
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
            "Every project starts by framing a question. 'Make the app better' is not a data science question. 'Which users are most likely to cancel in the next 30 days?' is — it's specific, measurable, and points at a decision. Getting this stage right saves you from answering the wrong thing perfectly.",
        },
        {
          type: "keypoint",
          title: "The six stages",
          content:
            "1) Ask — frame a specific, answerable question. 2) Collect — gather the data that could answer it. 3) Clean — fix errors, gaps, and wrong types. 4) Explore — summarise and visualise to find patterns (called EDA). 5) Model — build something that predicts or explains. 6) Communicate — turn the result into a decision others can act on.",
        },
        {
          type: "text",
          content:
            "Once you have a question, you collect the data that could answer it — from databases, files, surveys, or live systems. Then you clean it, because raw data is always messy: missing values, duplicates, typos, and columns stored as the wrong type (exactly the traps you learned to spot in Types of Data).",
        },
        {
          type: "analogy",
          title: "Cooking a meal",
          content:
            "Asking the question is deciding what dish to make. Collecting is buying ingredients. Cleaning is washing and chopping — unglamorous but most of the work. Exploring is tasting as you go. Modelling is the actual cooking. Communicating is plating it so someone wants to eat. Skip the washing and the whole meal suffers, no matter how good the recipe.",
        },
        {
          type: "text",
          content:
            "Exploring — often called EDA, Exploratory Data Analysis — is where you summarise and visualise the data to understand its shape before modelling. Only then do you model: build the thing that predicts or explains. Finally you communicate, translating numbers into a recommendation a manager can act on.",
        },
        {
          type: "warning",
          title: "The 80% rule",
          content:
            "Surveys of working data scientists consistently find that collecting and cleaning data takes the majority of project time — often cited as around 80% — while modelling takes a small slice. If you expected the job to be mostly building models, this is the biggest surprise of the field.",
        },
        {
          type: "expandable",
          title: "Why is the workflow a loop, not a line?",
          content:
            "Real projects rarely run start-to-finish once. While exploring, you often discover the data can't answer your original question, so you return to 'Ask' and refine it. Modelling may reveal you need more data, sending you back to 'Collect.' Cleaning may surface a pattern worth exploring immediately. Professionals expect this back-and-forth; the six stages describe the typical order, not a one-way street. Frameworks like CRISP-DM draw explicit arrows looping backward for exactly this reason.",
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
        kind: "flow",
        title: "The Data Science Lifecycle",
        caption:
          "Click each stage to see its goal and a real example. Note the arrow from Communicate back to Ask — the loop closes.",
        nodes: [
          {
            id: "ask",
            label: "1. Ask",
            sublabel: "Frame the question",
            detail:
              "Turn a vague goal into a specific, measurable, answerable question tied to a decision. Example: 'Which subscribers are likely to cancel next month?' This stage steers everything after it.",
            x: 12,
            y: 25,
            accent: true,
          },
          {
            id: "collect",
            label: "2. Collect",
            sublabel: "Gather the data",
            detail:
              "Pull the data that could answer the question — from databases, files, APIs, or surveys. Example: export the last 12 months of subscription and usage records.",
            x: 38,
            y: 25,
            accent: false,
          },
          {
            id: "clean",
            label: "3. Clean",
            sublabel: "Fix the mess",
            detail:
              "Handle missing values, duplicates, typos, and wrong data types. Usually the most time-consuming stage. Example: fix cancellation dates stored as text.",
            x: 64,
            y: 25,
            accent: true,
          },
          {
            id: "explore",
            label: "4. Explore (EDA)",
            sublabel: "Find patterns",
            detail:
              "Summarise and visualise the data to understand its shape and spot patterns before modelling. Example: notice that churn spikes right after a price increase.",
            x: 12,
            y: 70,
            accent: false,
          },
          {
            id: "model",
            label: "5. Model",
            sublabel: "Predict or explain",
            detail:
              "Build something that predicts or explains — a statistical summary or a machine learning model. Example: a model that scores each subscriber's cancellation risk.",
            x: 38,
            y: 70,
            accent: false,
          },
          {
            id: "communicate",
            label: "6. Communicate",
            sublabel: "Drive a decision",
            detail:
              "Translate the result into a clear recommendation stakeholders can act on. Example: 'Offer at-risk users a discount in week 3.' Without this stage, the work is wasted.",
            x: 64,
            y: 70,
            accent: true,
          },
        ],
        edges: [
          { from: "ask", to: "collect" },
          { from: "collect", to: "clean" },
          { from: "clean", to: "explore" },
          { from: "explore", to: "model" },
          { from: "model", to: "communicate" },
          { from: "communicate", to: "ask", label: "loop back / refine" },
          { from: "explore", to: "ask", label: "question doesn't fit" },
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
          title: "Naming the stage",
          scenario:
            "A data scientist is removing duplicate rows and filling in missing prices in a sales file.",
          steps: [
            {
              code: "activity = 'removing duplicates and filling missing values'",
              explanation:
                "Fixing errors, gaps, and duplicates in raw data is the definition of the Clean stage — stage 3.",
            },
          ],
          output: "Stage: Clean (3).",
        },
        {
          difficulty: "Easy",
          title: "Turning a goal into a question",
          scenario:
            "A manager says, 'I want our email campaigns to do better.' You need a workflow-ready question.",
          steps: [
            {
              code: "vague_goal = 'make email campaigns better'",
              explanation:
                "This isn't answerable — 'better' has no definition and points at no decision. It can't drive a project as written.",
            },
            {
              code: "good_question = 'Which subject-line style gets the highest open rate?'",
              explanation:
                "Now it's specific and measurable (open rate) and points at a decision (which style to use). This is a proper Ask-stage question.",
            },
          ],
          output: "A vague goal becomes a specific, measurable Ask-stage question.",
        },
        {
          difficulty: "Medium",
          title: "Ordering a whole project",
          scenario:
            "A ride-hailing team wants to predict driver demand. The tasks below are shuffled — put them in workflow order.",
          steps: [
            {
              code: "tasks = ['build the forecast model', 'define \"predict demand per hour\"',\n         'pull trip logs', 'chart trips by hour', 'fix bad timestamps',\n         'present to ops team']",
              explanation:
                "Six tasks, one per stage, deliberately out of order. Map each to a stage first.",
            },
            {
              code: "ordered = ['define \"predict demand per hour\"',  # Ask\n           'pull trip logs',                    # Collect\n           'fix bad timestamps',                # Clean\n           'chart trips by hour',               # Explore\n           'build the forecast model',          # Model\n           'present to ops team']               # Communicate",
              explanation:
                "Reordered into Ask → Collect → Clean → Explore → Model → Communicate. Notice charting (Explore) comes before modelling — you look before you build.",
            },
          ],
          output: "Ask → Collect → Clean → Explore → Model → Communicate.",
        },
        {
          difficulty: "Hard",
          title: "When the loop kicks in",
          scenario:
            "Mid-project, while exploring churn data, you realise the dataset has no records for customers who left more than a year ago — so it can't answer your original long-term question.",
          steps: [
            {
              code: "current_stage = 'Explore'",
              explanation:
                "You're in EDA, charting the data, when the gap becomes visible.",
            },
            {
              code: "discovery = 'data only covers the last 12 months'",
              explanation:
                "The data can't support a question about multi-year churn. Pushing forward to modelling would produce a confident but wrong answer.",
            },
            {
              code: "next_move = 'loop back to Ask (narrow to 12-month churn) or Collect (get older data)'",
              explanation:
                "This is the loop in action. A beginner forces ahead; a professional steps back to Ask or Collect. Going backward here is a sign of good judgement, not failure.",
            },
          ],
          output: "Loop back — refine the question or collect more data before modelling.",
        },
        {
          difficulty: "Industry Example",
          title: "A churn project end-to-end at a streaming service",
          scenario:
            "A data scientist at a streaming company is asked to reduce subscriber cancellations. Follow the whole loop.",
          steps: [
            {
              code: "# Ask\nquestion = 'Which subscribers are likely to cancel in the next 30 days?'",
              explanation:
                "Specific, measurable, tied to a retention decision. The Ask stage sets the target.",
            },
            {
              code: "# Collect + Clean\ndata = 'viewing history, billing, support tickets'\ncleaned = 'fixed missing watch-times, deduped accounts, corrected date types'",
              explanation:
                "Collect gathers the relevant sources; Clean fixes the inevitable mess — including wrong data types, the skill from the last lesson. Together these take most of the time.",
            },
            {
              code: "# Explore -> Model -> Communicate\ninsight = 'churn spikes after 3 weeks of no logins'\nmodel = 'risk score per subscriber'\nrecommendation = 'email a personalised pick to users inactive for 2 weeks'",
              explanation:
                "EDA surfaces the inactivity pattern, the model turns it into per-user risk scores, and the recommendation hands the product team a concrete action. Only the communicate step creates real business value.",
            },
          ],
          output: "One loop: a vague goal becomes a shipped retention action.",
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
        filename: "order_the_workflow.py",
        instructions:
          "Below are the six stages of the workflow, shuffled. Rebuild the correct order by filling the blanks so the list reads from the first stage to the last. Use these exact strings: \"Ask\", \"Collect\", \"Clean\", \"Explore\", \"Model\", \"Communicate\". Then run it.",
        starterCode: `# The six stages, out of order — put them in workflow order.
stage_1 = ___   # frame a specific question
stage_2 = ___   # gather the data
stage_3 = ___   # fix errors and missing values
stage_4 = ___   # summarise and visualise (EDA)
stage_5 = ___   # build something that predicts or explains
stage_6 = ___   # turn the result into a decision

workflow = [stage_1, stage_2, stage_3, stage_4, stage_5, stage_6]
print(" -> ".join(workflow))`,
        solutionCode: `# The six stages, out of order — put them in workflow order.
stage_1 = "Ask"          # frame a specific question
stage_2 = "Collect"      # gather the data
stage_3 = "Clean"        # fix errors and missing values
stage_4 = "Explore"      # summarise and visualise (EDA)
stage_5 = "Model"        # build something that predicts or explains
stage_6 = "Communicate"  # turn the result into a decision

workflow = [stage_1, stage_2, stage_3, stage_4, stage_5, stage_6]
print(" -> ".join(workflow))`,
        expectedOutput: "Ask -> Collect -> Clean -> Explore -> Model -> Communicate",
        hints: [
          "Every project begins with a question before any data is touched.",
          "You must gather data before you can clean it, and clean it before you explore.",
          "Exploring (EDA) always comes before modelling — you look before you build.",
          "The very last stage turns the result into a decision others can act on.",
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
          id: "fnd03_mcq_01",
          difficulty: "Easy",
          question:
            "What is the correct order of the six workflow stages?",
          options: [
            "Collect → Ask → Model → Clean → Explore → Communicate",
            "Ask → Collect → Clean → Explore → Model → Communicate",
            "Ask → Model → Collect → Clean → Explore → Communicate",
            "Clean → Collect → Ask → Explore → Model → Communicate",
          ],
          correctIndex: 1,
          explanation:
            "You frame a question, gather data, clean it, explore it, model it, then communicate. The other orders break the dependencies — for example, you can't clean or model data you haven't collected, and you can't answer a question you haven't framed.",
        },
        {
          type: "mcq",
          id: "fnd03_mcq_02",
          difficulty: "Easy",
          question:
            "Which stage typically takes the most time on a real project?",
          options: [
            "Modelling",
            "Communicating",
            "Collecting and cleaning the data",
            "Framing the question",
          ],
          correctIndex: 2,
          explanation:
            "Getting data and cleaning it is repeatedly reported as the majority of project time (often cited near 80%). Modelling is usually a smaller slice, and communicating and framing, while vital, take less time than wrangling messy data.",
        },
        {
          type: "mcq",
          id: "fnd03_mcq_03",
          difficulty: "Medium",
          question: "What does the 'Explore' (EDA) stage involve?",
          options: [
            "Deploying the model to production",
            "Summarising and visualising the data to find patterns before modelling",
            "Writing the final report for stakeholders",
            "Collecting data from external APIs",
          ],
          correctIndex: 1,
          explanation:
            "Exploratory Data Analysis means summarising and visualising the cleaned data to understand its shape before building a model. Deployment and reporting come later; collecting is an earlier stage.",
        },
        {
          type: "scenario",
          id: "fnd03_sc_01",
          difficulty: "Medium",
          scenario:
            "While exploring the data, a data scientist realises the dataset simply doesn't contain the information needed to answer the original question.",
          question: "What does the workflow suggest they do?",
          options: [
            "Push on to modelling anyway to avoid wasting work",
            "Loop back to an earlier stage — refine the question or collect more data",
            "Skip straight to communicating the problem and stop",
            "Delete the dataset and start a completely unrelated project",
          ],
          correctIndex: 1,
          explanation:
            "The workflow is a loop. Discovering a data gap during exploration should send you back to Ask (refine the question) or Collect (get the missing data). Pushing ahead produces a confident but wrong answer, and abandoning everything discards useful progress.",
        },
        {
          type: "scenario",
          id: "fnd03_sc_02",
          difficulty: "Hard",
          scenario:
            "A team builds an excellent, accurate churn model, but three months later leadership has taken no action based on it and cancellations are unchanged.",
          question: "Which stage most likely failed?",
          options: [
            "Cleaning — the data must have been dirty",
            "Communicating — the results never became a clear, actionable recommendation for decision-makers",
            "Collecting — there wasn't enough data",
            "Modelling — the model was accurate, so this can't be the issue",
          ],
          correctIndex: 1,
          explanation:
            "An accurate model that changes nothing signals a communication failure — the findings weren't turned into a decision stakeholders acted on. The model itself worked, and dirty data or too little data would have shown up as poor accuracy, which wasn't the case here.",
        },
        {
          type: "coding",
          id: "fnd03_code_01",
          difficulty: "Medium",
          prompt:
            "Match each activity to its stage. You're given two parallel lists: activities and their correct stages. Print each pair as 'activity -> stage', one per line, using a loop with zip().",
          starterCode:
            'activities = ["fix missing values", "frame the question", "chart trips by hour"]\nstages     = ["Clean", "Ask", "Explore"]\n# Print "activity -> stage" for each pair\n',
          solutionCode:
            'activities = ["fix missing values", "frame the question", "chart trips by hour"]\nstages     = ["Clean", "Ask", "Explore"]\nfor activity, stage in zip(activities, stages):\n    print(f"{activity} -> {stage}")',
          expectedOutput:
            "fix missing values -> Clean\nframe the question -> Ask\nchart trips by hour -> Explore",
          tests: [
            {
              name: "Pairing",
              description: "Each activity is printed with its matching stage.",
            },
            {
              name: "Format",
              description: "Uses the 'activity -> stage' format, one line each.",
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
            "Walk me through the stages of a typical data science project.",
          answer:
            "I think of it as six stages. First, Ask — frame a specific, measurable question tied to a decision. Second, Collect — gather the data that could answer it. Third, Clean — fix missing values, duplicates, and wrong data types, which usually takes the most time. Fourth, Explore, or EDA — summarise and visualise the data to understand its shape and spot patterns. Fifth, Model — build something that predicts or explains. Sixth, Communicate — turn the result into a clear recommendation people can act on. The key nuance is that it's a loop: findings at any stage often send you back to refine an earlier one.",
        },
        {
          question:
            "Why do experienced data scientists say most of their time goes to data collection and cleaning rather than modelling?",
          answer:
            "Real-world data is almost never analysis-ready. It arrives with missing values, duplicates, inconsistent formats, typos, and columns stored as the wrong type. Before any model can run, all of that has to be found and fixed, and the fixing decisions — how to handle missing data, whether to drop or impute — materially affect the results. Modelling libraries, by contrast, are mature and fast to apply once the data is clean. So the effort concentrates upstream. The figure often quoted is around 80% of time on data preparation. Practically, this is why I treat cleaning as first-class work rather than a chore to rush, because a great model on badly prepared data is worse than useless: it's confidently wrong.",
        },
        {
          question:
            "The workflow is often drawn as a linear pipeline. In practice, how linear is it, and why does that matter?",
          answer:
            "In practice it's much more of a cycle than a straight line, and treating it as strictly linear is a common cause of failed projects. You constantly loop backward: exploration reveals the data can't answer the original question, so you return to Ask; modelling shows you need an extra signal, so you go back to Collect; cleaning surfaces a pattern worth exploring right away. Frameworks like CRISP-DM explicitly draw these backward arrows. Why it matters: if you plan a project as a one-way sequence with fixed deadlines per stage, the inevitable loops feel like failures and get suppressed, which pushes flawed assumptions downstream into the model. Planning for iteration — shorter cycles, early exploration, room to revise the question — produces more reliable results and sets honest expectations with stakeholders.",
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
        "1) Jumping straight to modelling without framing a clear question or exploring the data first. 2) Underestimating cleaning — budgeting a day for what routinely takes most of the project. 3) Treating the workflow as one-way and refusing to loop back when the data says the question was wrong. 4) Skipping the communicate stage, leaving an accurate model that no one ever acts on.",
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
        "Try these prompts in the AI Tutor panel: • 'Give me a business goal and quiz me on turning it into an Ask-stage question.' • 'Walk me through the workflow for a fraud-detection project.' • 'ELI5: why is the workflow a loop?' • 'List three ways the Clean stage can send you back to Collect.' • 'Interview mode: ask me to walk through a data science project end to end.'",
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
        "Workflow / lifecycle — the repeatable sequence of stages a project moves through. Ask — framing a specific, measurable question. Collect — gathering the relevant data. Clean — fixing errors, gaps, duplicates, and wrong types. EDA (Exploratory Data Analysis) — summarising and visualising data to find patterns before modelling. Model — building something that predicts or explains. Communicate — turning results into an actionable decision. CRISP-DM — a well-known industry framework that formalises this loop.",
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
        "• Framework: read a short overview of CRISP-DM (Cross-Industry Standard Process for Data Mining) — the classic six-phase loop this lesson mirrors. • Book chapter: the 'data science process' chapters of 'Doing Data Science' by Schutt & O'Neil. • Reflection: pick any decision your favourite app makes and sketch the six stages behind it. • Next in DSM: you know the map — next you'll meet the tools that carry you through each stage.",
    },

    /* ---------------------------------------------------------------- */
    /*  12 — Recap                                                       */
    /* ---------------------------------------------------------------- */
    {
      id: "recap",
      type: "recap",
      tocLabel: "Recap",
      content:
        "✓ The workflow has six stages: Ask, Collect, Clean, Explore, Model, Communicate.\n✓ Ask frames a specific, measurable question; Communicate turns the result into a decision.\n✓ Collecting and cleaning data usually take the most time — often cited near 80%.\n✓ Exploring (EDA) always comes before modelling — you look before you build.\n✓ The workflow is a loop: findings often send you back to refine an earlier stage.\n\nNext up: Tools of the Trade. You now know the stages of a project — in the final lesson of this module you'll meet the tools that power each one, from spreadsheets and Python to SQL and version control.",
    },
  ],
};
