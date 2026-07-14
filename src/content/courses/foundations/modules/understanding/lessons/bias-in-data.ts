import type { Lesson } from "@/lib/curriculum/types";

/** Skill unlocked: can spot selection, survivorship, and sampling bias in a
 *  dataset and reason about how they distort conclusions. */
export const biasInData: Lesson = {
  meta: {
    id: "foundations.understanding.bias-in-data",
    slug: "bias-in-data",
    title: "Bias in Data",
    description:
      "See how selection, survivorship, and sampling bias creep into data, why they lead confident analysts to wrong conclusions, and how to interrogate a dataset for them.",
    estimatedTime: "25 mins",
    difficulty: "Beginner",
    xpReward: 50,
    prerequisites: ["foundations.understanding.data-quality-basics"],
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
        hook: "In 1943, engineers examined bombers returning from missions and mapped where they were riddled with bullet holes — the wings, the tail. The obvious move: add armor where the holes are. A statistician named Abraham Wald stopped them. The holes, he said, show where a plane can be hit and still come home. Armor the places with no holes — the engines — because planes hit there never returned to be studied. The data was clean. The data was complete. And it pointed exactly the wrong way, because of who wasn't in it. That's bias, and no quality audit will ever catch it.",
        what: "Bias is a systematic distortion in how data was collected, so the data doesn't represent the reality you think it does. This lesson covers three of the most common and dangerous forms: selection bias, survivorship bias, and sampling bias.",
        why: "Last lesson's flaws live inside the data — you can find a blank cell or a duplicate by looking. Bias lives in what's absent: the people who didn't respond, the companies that failed, the planes that didn't return. It can't be cleaned away, only reasoned about — and a biased dataset produces confident, precise, completely wrong conclusions.",
        whereUsed:
          "Every survey, every A/B test, every model trained on historical data. Product analytics, medical trials, hiring algorithms, and market research all live or die by whether their data represents the population they claim to describe.",
        objectives: [
          "Define bias as a distortion in how data was collected",
          "Recognise selection bias — a non-representative group being studied",
          "Recognise survivorship bias — only 'survivors' making it into the data",
          "Recognise sampling bias — a sample that doesn't match the population",
          "Ask the right questions to interrogate any dataset for bias",
        ],
        realWorldApps: [
          {
            company: "Amazon (hiring AI)",
            headline: "A model learned to prefer men",
            detail:
              "An experimental résumé-screening model was trained on a decade of past hires — mostly men. It learned that pattern and penalised résumés mentioning 'women's', a textbook case of bias inherited from non-representative historical data.",
          },
          {
            company: "Political polling",
            headline: "Famous wrong predictions",
            detail:
              "Polls have called elections wrongly when their samples over-represented people who were easy to reach — landline owners, or those willing to answer. The math was fine; the sample didn't match the electorate.",
          },
          {
            company: "App store reviews",
            headline: "Ratings skew to extremes",
            detail:
              "People who leave reviews are disproportionately delighted or furious. The quiet, satisfied majority rarely rates, so an app's average score reflects who chose to speak, not the typical user.",
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
            "Bias is not a typo or a blank cell. It's a systematic distortion baked into how the data was gathered, so the dataset quietly describes a different group than the one you care about. Because every value can be individually correct, bias survives every quality check from the last lesson. You defeat it by asking where the data came from and who is missing — not by cleaning.",
        },
        {
          type: "keypoint",
          title: "Three biases to know by name",
          content:
            "Selection bias — the group in your data was chosen in a way that makes it unrepresentative (e.g. studying only your current customers to learn about all shoppers). Survivorship bias — only the 'survivors' reach your data; the failures dropped out and are invisible (e.g. analysing only funded startups). Sampling bias — your sample doesn't match the population's makeup (e.g. an online poll about a product used mostly offline).",
        },
        {
          type: "text",
          content:
            "Selection bias comes from how participants enter the dataset. If a fitness app surveys its own users about how much people exercise, it will wildly overestimate the population — it selected active people by definition. The result is precise and wrong: the data honestly describes app users, but not 'people'.",
        },
        {
          type: "analogy",
          title: "Survivorship bias is counting only the winners",
          content:
            "Picture studying 'habits of successful founders' by interviewing billionaire CEOs. You'll find they dropped out of college, took huge risks, worked 100-hour weeks — and conclude that's the recipe. But thousands of people did exactly the same things and failed; they're just not on your interview list. You only see the survivors, so any trait shared by survivors looks like a cause of success when it might be a cause of failure too. The failures are the missing armor on Wald's bombers.",
        },
        {
          type: "text",
          content:
            "Sampling bias is when the sample's composition doesn't match the population's. If a country is 50% rural but your survey respondents are 90% urban (because that's who's online), your 'national' average is really an urban average wearing a national label. The fix isn't more data — a bigger biased sample is just confidently wrong at scale — it's a representative sample.",
        },
        {
          type: "warning",
          title: "More data does not fix bias",
          content:
            "It's tempting to think a huge dataset must be trustworthy. But if the collection method is biased, size only makes the wrong answer more precise. A poll of 2,000,000 landline owners predicts landline owners' opinions extremely accurately — and the electorate's poorly. Always question how the data was collected before you trust its size.",
        },
        {
          type: "code-note",
          code: "# Survey: 'How many hours a week do you exercise?'\n# Distributed only inside a running-club app.\navg = 7.4  # hours/week\n# Looks authoritative. But the sample is runners.\n# The national average is a fraction of this.",
          content:
            "Every response here can be honest and every calculation correct, yet the headline number is meaningless as a national figure. The distortion is in who was asked — selection and sampling bias — not in any individual value.",
        },
        {
          type: "expandable",
          title: "Non-response bias: a sneaky cousin",
          content:
            "Even a perfectly chosen sample can go wrong if the people who decline to answer differ systematically from those who do. Send a satisfaction survey to a fair cross-section of customers, and the furious and the delighted are the most likely to reply while the indifferent middle ignores it. Your results then over-represent strong opinions. This is non-response bias, and it's why serious surveys track their response rate and worry when it's low — the missing responses aren't random, they're a hidden pattern.",
        },
        {
          type: "text",
          content:
            "The unifying question behind all three is simple: who or what is missing from this data, and would including them change the answer? Wald asked it of the bombers. You should ask it of every dataset before you trust a single conclusion drawn from it.",
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
        title: "Who Made It Into the Data?",
        caption:
          "Click each node. Bias is the gap between the population you care about and the sample you actually captured — and who fell through it.",
        nodes: [
          {
            id: "population",
            label: "The real population",
            sublabel: "who you want to describe",
            detail:
              "The full group your conclusion is meant to cover — all shoppers, all startups, all voters. This is the truth you're trying to measure. Bias is any systematic gap between this and your data.",
            x: 25,
            y: 20,
            accent: true,
          },
          {
            id: "sample",
            label: "The captured sample",
            sublabel: "who actually got measured",
            detail:
              "The subset that made it into your dataset. If it was chosen in a way that skews its makeup, it describes itself faithfully but misrepresents the population — precise and wrong.",
            x: 75,
            y: 20,
            accent: true,
          },
          {
            id: "selection",
            label: "Selection bias",
            sublabel: "wrong group chosen",
            detail:
              "The way people enter the data skews who's in it — surveying only current customers to learn about all shoppers. Fix: choose participants that reflect the whole population.",
            x: 20,
            y: 62,
            accent: true,
          },
          {
            id: "survivorship",
            label: "Survivorship bias",
            sublabel: "failures are invisible",
            detail:
              "Only survivors reach the data; the failures dropped out and can't be seen — studying funded startups, or bombers that returned. Fix: deliberately seek out the missing failures.",
            x: 50,
            y: 62,
            accent: true,
          },
          {
            id: "sampling",
            label: "Sampling bias",
            sublabel: "makeup doesn't match",
            detail:
              "The sample's composition differs from the population's — 90% urban respondents for a 50% rural country. Fix: draw a representative sample; more data alone won't help.",
            x: 80,
            y: 62,
            accent: true,
          },
          {
            id: "question",
            label: "Who is missing?",
            sublabel: "the one question to ask",
            detail:
              "The single habit that catches all three: ask who or what didn't make it into the data, and whether including them would change your answer. This is Wald's question.",
            x: 50,
            y: 90,
            accent: false,
          },
        ],
        edges: [
          { from: "population", to: "sample", label: "the gap = bias" },
          { from: "selection", to: "question" },
          { from: "survivorship", to: "question" },
          { from: "sampling", to: "question" },
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
          title: "Name the bias",
          scenario:
            "A gym surveys people inside the gym to ask 'How often do you work out?' and reports the national average.",
          steps: [
            {
              code: "who_was_asked = 'people already at the gym'",
              explanation:
                "By asking only people at the gym, the survey selected the most active group. Everyone who never exercises had no chance to be included.",
            },
          ],
          output: "Selection bias — the group studied is not representative of the whole population.",
        },
        {
          difficulty: "Easy",
          title: "The missing failures",
          scenario:
            "An article studies 20 wildly successful companies and lists the traits they share, concluding these traits cause success.",
          steps: [
            {
              code: "sample = 'only companies that succeeded'",
              explanation:
                "The study looks only at survivors. The many companies with the same traits that failed are absent, so no trait can be shown to cause success.",
            },
            {
              code: "missing = 'failed companies with the same traits'",
              explanation:
                "Without the failures, a shared trait might just as easily be a coin flip — or even a cause of failure. This is survivorship bias, the bomber problem in business form.",
            },
          ],
          output: "Survivorship bias — conclusions drawn only from survivors, ignoring the invisible failures.",
        },
        {
          difficulty: "Medium",
          title: "A sample that doesn't match",
          scenario:
            "A national TV network runs an online poll about a policy. 80% of respondents are under 30, but the country's adults are evenly spread across ages.",
          steps: [
            {
              code: "population_age = 'evenly spread'\nsample_age = '80% under 30'",
              explanation:
                "The sample's age makeup is nothing like the population's. Younger people were far more likely to see and answer an online poll.",
            },
            {
              code: "result = 'reflects under-30 opinion, labelled national'",
              explanation:
                "Because the composition is skewed, the poll measures young adults' views, not the nation's. This is sampling bias — a mismatch between sample and population makeup.",
            },
          ],
          output: "Sampling bias — the sample's composition doesn't match the population it claims to represent.",
        },
        {
          difficulty: "Hard",
          title: "Two biases at once, and why more data won't help",
          scenario:
            "A company measures 'customer satisfaction' by averaging its app-store reviews, and plans to collect 10× more reviews to be 'more accurate'.",
          steps: [
            {
              code: "who_reviews = 'the delighted and the furious, rarely the middle'",
              explanation:
                "Reviewers self-select toward strong opinions (non-response bias), and only people who kept using the app long enough to review it appear at all (a survivorship flavour). The quiet, mildly-satisfied majority is missing.",
            },
            {
              code: "plan = 'collect 10x more reviews'",
              explanation:
                "Ten times more reviews means ten times more of the same skewed crowd. The average won't move toward the truth — it'll just become a more precise measure of extreme opinion.",
            },
            {
              code: "fix = 'survey a random sample of ALL users, not self-selected reviewers'",
              explanation:
                "The only real fix is to change how data is collected — reach a representative slice of every user, including the silent majority. Size can't rescue a biased method; representativeness can.",
            },
          ],
          output: "Self-selection/survivorship bias; the fix is a representative sample, not a bigger biased one.",
        },
        {
          difficulty: "Industry Example",
          title: "A medical model that fails in the real world",
          scenario:
            "A data-science team builds a skin-condition classifier that scores 96% in testing, then finds it performs poorly on many patients in deployment.",
          steps: [
            {
              code: "# Training images came mostly from one clinic's patient population",
              explanation:
                "The training data over-represented certain skin tones and under-represented others — selection and sampling bias in the data collection, invisible to any accuracy metric on that same skewed data.",
            },
            {
              code: "test_accuracy = 0.96  # but on the SAME biased distribution",
              explanation:
                "The 96% is measured on data drawn from the same narrow population, so it flatters the model. High accuracy on biased data hides the gap — a clean-looking number built on an unrepresentative sample.",
            },
            {
              code: "real_world = 'poor results on under-represented groups'",
              explanation:
                "In deployment the model meets the full population it never learned, and fails those who were missing from training. The team's fix is to collect a representative dataset across skin tones and re-evaluate on it — bias must be addressed in the data, not patched in the model.",
            },
          ],
          output: "Biased training data produced a confident model that fails the groups it never saw — solved by representative data.",
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
        filename: "spot_the_missing_group.py",
        instructions:
          "A survey about weekly reading habits was distributed only through a book-club newsletter. Below are the responses. Compute the average, then set `is_representative` to False and write one line naming who is missing. Run it to see how a correct calculation can still mislead.",
        starterCode: `# Hours read per week, collected from a book-club newsletter.
hours = [8, 12, 6, 10, 9, 11]

average = sum(hours) / len(hours)

# TODO 1: Is this a representative sample of ALL adults? (True/False)
is_representative = ___

# TODO 2: In one short string, name the group that is missing.
missing_group = ___   # e.g. "people who don't read / aren't in book clubs"

print("Average hours:", round(average, 1))
print("Representative of all adults:", is_representative)
print("Missing from the data:", missing_group)`,
        solutionCode: `# Hours read per week, collected from a book-club newsletter.
hours = [8, 12, 6, 10, 9, 11]

average = sum(hours) / len(hours)

is_representative = False
missing_group = "people who don't read / aren't in book clubs"

print("Average hours:", round(average, 1))
print("Representative of all adults:", is_representative)
print("Missing from the data:", missing_group)`,
        expectedOutput:
          "Average hours: 9.3\nRepresentative of all adults: False\nMissing from the data: people who don't read / aren't in book clubs",
        hints: [
          "The math is fine — the question is who was asked, not how it was calculated.",
          "A book-club newsletter reaches people who already love reading.",
          "So the sample can't represent all adults: is_representative = False.",
          "The missing group is everyone who reads little or isn't in a book club — exactly the people who'd pull the average down.",
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
          id: "fnd08_mcq_01",
          difficulty: "Easy",
          question: "What is bias in data?",
          options: [
            "A blank cell or missing value",
            "A systematic distortion in how the data was collected, so it misrepresents reality",
            "A value far outside the normal range",
            "The same record entered twice",
          ],
          correctIndex: 1,
          explanation:
            "Bias is a systematic distortion in how data was gathered, making the dataset misrepresent the population. Blank cells, outliers, and duplicates are data-quality flaws you can clean; bias is about who or what is missing and can't be cleaned away.",
        },
        {
          type: "mcq",
          id: "fnd08_mcq_02",
          difficulty: "Easy",
          question:
            "Studying only successful startups to learn 'what makes companies succeed' is an example of which bias?",
          options: [
            "Sampling bias",
            "Survivorship bias",
            "Selection bias from non-response",
            "No bias — successful companies are the right ones to study",
          ],
          correctIndex: 1,
          explanation:
            "This is survivorship bias: only the survivors (successful startups) are visible, while the failures with the same traits dropped out. Any trait shared by survivors looks like a cause of success even if failures shared it too.",
        },
        {
          type: "mcq",
          id: "fnd08_mcq_03",
          difficulty: "Medium",
          question:
            "A poll's sample is 90% urban, but the country is 50% rural. Collecting 10× more responses the same way will:",
          options: [
            "Fix the bias, because more data is more accurate",
            "Not fix the bias — it makes the urban-skewed answer more precise, not more representative",
            "Introduce survivorship bias",
            "Turn sampling bias into selection bias",
          ],
          correctIndex: 1,
          explanation:
            "More data collected the same biased way just gives a more precise wrong answer. Sampling bias is fixed by making the sample's composition match the population's (representativeness), not by increasing size.",
        },
        {
          type: "scenario",
          id: "fnd08_sc_01",
          difficulty: "Medium",
          scenario:
            "Your team measures average customer happiness using app-store reviews. A colleague says the score is trustworthy because there are 50,000 reviews.",
          question: "What's the strongest objection?",
          options: [
            "50,000 is too few reviews to trust",
            "Reviewers self-select toward extreme opinions, so a large count of a skewed group is still unrepresentative",
            "The reviews probably contain duplicates",
            "There's no objection — a large sample is always representative",
          ],
          correctIndex: 1,
          explanation:
            "People who leave reviews tend to be unusually delighted or furious, so the silent, moderately-satisfied majority is missing. A big count of a self-selected group is still biased. The fix is a representative survey of all users, not more reviews.",
        },
        {
          type: "scenario",
          id: "fnd08_sc_02",
          difficulty: "Hard",
          scenario:
            "A hiring model is trained on 10 years of a company's past hires to predict 'good candidates'. Historically the company hired mostly one demographic.",
          question: "Why might this model be biased, and how would you frame the fix?",
          options: [
            "It won't be biased; historical data is objective",
            "It learns the historical hiring pattern, so it can perpetuate past under-representation — the fix is more representative, carefully audited training data, not just a bigger dataset",
            "The only issue is missing values in old records",
            "It just needs more training epochs to remove bias",
          ],
          correctIndex: 1,
          explanation:
            "The model treats a biased history as ground truth and reproduces it, penalising groups the company rarely hired before. Bias lives in the collected data, so the remedy is representative, audited data and careful target design — not more epochs or simply more of the same skewed records.",
        },
        {
          type: "coding",
          id: "fnd08_code_01",
          difficulty: "Medium",
          prompt:
            "Compare a sample's makeup to the population to flag sampling bias. Given the sample's urban fraction and the population's urban fraction, print 'biased' if they differ by more than 0.15, else 'ok'. Use abs() for the difference.",
          starterCode:
            "sample_urban = 0.90\npopulation_urban = 0.50\n# Print 'biased' if the gap exceeds 0.15, else 'ok'\n",
          solutionCode:
            "sample_urban = 0.90\npopulation_urban = 0.50\nif abs(sample_urban - population_urban) > 0.15:\n    print(\"biased\")\nelse:\n    print(\"ok\")",
          expectedOutput: "biased",
          tests: [
            {
              name: "Computes the gap",
              description: "Uses abs() to compare sample vs. population makeup.",
            },
            {
              name: "Flags the mismatch",
              description: "Prints 'biased' because 0.40 exceeds the 0.15 threshold.",
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
            "What is survivorship bias? Give an example.",
          answer:
            "Survivorship bias happens when only the 'survivors' of some process make it into your data, while the failures drop out and become invisible — so any pattern you see among survivors can be badly misleading. The classic example is Abraham Wald and the WWII bombers: engineers wanted to armor the planes where returning bombers had the most bullet holes, but Wald realised those were the survivable hits. The planes shot in the engines never came back to be counted, so the armor belonged exactly where there were no holes. A modern version is studying only successful companies to find the 'secret to success' — thousands of failed companies did the same things and aren't in the dataset, so the shared traits might explain nothing. The tell is always asking who or what didn't survive to be measured.",
        },
        {
          question:
            "What's the difference between selection bias and sampling bias?",
          answer:
            "They're closely related and often overlap, but I distinguish them by where the distortion enters. Selection bias is about how units get into the study at all — if the mechanism for entering the dataset is tied to the thing you're measuring, the group is skewed, like surveying only current customers to learn about all shoppers. Sampling bias is specifically about the sample's composition not matching the population's — for instance a sample that's 90% urban when the population is half rural. In practice a biased selection method usually produces a non-representative sample, so they travel together, and the underlying question for both is the same: does the group I actually measured represent the population I want to describe? The fix for both is a representative sampling design, and crucially not just collecting more data.",
        },
        {
          question:
            "How would you check a new dataset for bias before trusting conclusions from it?",
          answer:
            "Since bias is about collection, not the values themselves, I start by asking how the data was generated: who or what could enter the dataset, and by what mechanism. Then I ask the core question — who or what is missing, and would including them change the answer — which surfaces survivorship problems like absent failures and non-response problems like the silent majority in reviews. Next I compare the sample's composition to what I know about the target population on key attributes like age, geography, or device, to catch sampling bias. I also look at whether entry into the data correlates with the outcome I'm studying, which flags selection bias. Importantly, I treat a large dataset as no reassurance — size makes a biased method more precise, not more correct. If I find bias I can't collect around, I at least document the limitation clearly so conclusions are scoped to the group the data actually represents.",
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
        "1) Trusting a dataset because it's large — size makes a biased answer more precise, not more correct. 2) Studying only survivors (successful companies, returning planes) and ignoring the invisible failures. 3) Confusing a clean dataset with an unbiased one — bias passes every quality check. 4) Generalising a self-selected group (reviewers, volunteers) to everyone. 5) Trying to 'clean' bias out of the values instead of fixing how the data is collected.",
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
        "Try these prompts in the AI Tutor panel: • 'Give me five short scenarios and quiz me on which bias each one is.' • 'ELI5 the WWII bomber survivorship-bias story.' • 'Show me a survey design and ask who's missing from it.' • 'Explain why more data doesn't fix sampling bias, with a fresh example.' • 'Interview mode: ask me to distinguish selection from sampling bias.'",
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
        "Bias — a systematic distortion in how data was collected, so it misrepresents reality. Population — the full group a conclusion is meant to describe. Sample — the subset actually measured. Selection bias — units enter the data in a way that skews the group. Survivorship bias — only survivors reach the data; failures are invisible. Sampling bias — the sample's composition doesn't match the population's. Non-response bias — those who don't respond differ systematically from those who do. Representative sample — one whose makeup mirrors the population.",
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
        "• Story: read about Abraham Wald and the WWII bomber 'missing bullet holes' — the definitive survivorship-bias example. • Concept: search 'why polls get elections wrong' for real sampling-bias case studies. • Reading: the idea of a 'representative sample' in any intro-statistics resource. • Reflection: pick one dataset you've seen this week and ask 'who is missing from this?' • Next in DSM: you've finished Understanding Data — you can now read, describe, quality-check, and interrogate a dataset for bias. Next you move from judging data to working with it directly in Python and pandas.",
    },

    /* ---------------------------------------------------------------- */
    /*  12 — Recap                                                       */
    /* ---------------------------------------------------------------- */
    {
      id: "recap",
      type: "recap",
      tocLabel: "Recap",
      content:
        "✓ Bias is a systematic distortion in how data was collected — it misrepresents reality and survives every quality check.\n✓ Selection bias: the group studied enters the data in a way that makes it unrepresentative.\n✓ Survivorship bias: only survivors reach the data; the failures are invisible (Wald's bombers, successful-company studies).\n✓ Sampling bias: the sample's composition doesn't match the population's.\n✓ More data never fixes bias — it only makes a wrong answer more precise; representativeness does.\n✓ The one habit that catches all three: ask 'who or what is missing, and would including them change the answer?'\n\nModule complete: Understanding Data. You can now read a table, describe its anatomy, audit its quality, and interrogate it for bias — everything needed to judge whether data is worth trusting. Next you'll stop judging data from the outside and start working with it directly in Python and pandas.",
    },
  ],
};
