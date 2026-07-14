import type { Lesson } from "@/lib/curriculum/types";

/** Skill unlocked: can tell a correlation from a causal claim and name
 *  confounders, the single most common reasoning error in data work. */
export const correlationVsCausation: Lesson = {
  meta: {
    id: "foundations.stats-intro.correlation-vs-causation",
    slug: "correlation-vs-causation",
    title: "Correlation Is Not Causation",
    description:
      "Understand why two variables moving together does not mean one causes the other, learn to spot confounders, and guard against the field's most common fallacy.",
    estimatedTime: "20 mins",
    difficulty: "Beginner",
    xpReward: 50,
    prerequisites: ["foundations.stats-intro.distributions-intuition"],
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
        hook: "Across a whole summer, ice-cream sales and drowning deaths rise and fall together, almost in lockstep. So does ice cream cause drowning? Of course not — hot weather drives both. Yet this exact mistake, dressed in fancier clothes, gets made in boardrooms and headlines every single day: two numbers move together, and someone declares that one causes the other. Learning to catch this is one of the highest-leverage skills in all of data science, and it costs nothing but a moment's discipline.",
        what: "Correlation means two variables tend to move together — when one goes up, the other tends to go up (or down). Causation means one variable actually makes the other change. Correlation is a pattern you can measure; causation is a claim about mechanism, and the two are not the same.",
        why: "Confusing them leads to expensive, embarrassing, sometimes dangerous decisions: launching features that don't work, cutting things that were actually helping, or believing a headline that has the story backwards. Spotting the gap between 'moves together' and 'causes' is what makes your analysis trustworthy.",
        whereUsed:
          "Every A/B test interpretation, every 'this metric drives that metric' claim, every health or economics headline. Product, marketing, medicine, and policy all live or die on getting this distinction right.",
        realWorldApps: [
          {
            company: "Netflix",
            headline: "Correlation isn't enough to ship",
            detail:
              "Heavy viewers also renew more — but that doesn't prove watching causes renewal; committed fans do both. Netflix runs controlled experiments precisely because correlation alone can't justify a product decision.",
          },
          {
            company: "Public health",
            headline: "A famous confounder",
            detail:
              "Countries with more televisions per person have higher life expectancy. TVs don't extend life — national wealth buys both TVs and better healthcare. Wealth is the confounder hiding behind the correlation.",
          },
          {
            company: "Booking.com",
            headline: "Experiments over correlations",
            detail:
              "Rather than trust that a change 'correlates' with more bookings, the company runs thousands of randomised experiments a year — the only reliable way to turn a correlation into a causal claim.",
          },
        ],
        objectives: [
          "Define correlation and causation and state how they differ",
          "Explain why correlation alone can't prove causation",
          "Identify a confounder — a hidden third cause behind two variables",
          "Name the main alternatives to 'A causes B' for a correlation",
          "Recognise that a controlled experiment is how causation is established",
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
            "Correlation is an observation: two variables tend to change together. It can be positive (both rise together, like height and shoe size) or negative (one rises as the other falls, like temperature and heating bills). Causation is a stronger, different claim: that changing one variable actually forces the other to change. You can measure correlation directly from data; causation you have to argue for.",
        },
        {
          type: "keypoint",
          title: "The core distinction",
          content:
            "Correlation = 'these two move together' — a measurable pattern. Causation = 'this one makes the other change' — a claim about mechanism. Every correlation has several possible explanations, and 'A causes B' is only one of them. Finding a correlation is the start of an investigation, never the end.",
        },
        {
          type: "text",
          content:
            "When you see A and B correlated, there are at least four explanations, and only the first is the tempting one: (1) A causes B. (2) B causes A — the arrow runs the other way. (3) A hidden third factor C causes both — a confounder. (4) It's coincidence — with enough variables, some will line up by pure chance.",
        },
        {
          type: "analogy",
          title: "The confounder is the puppeteer",
          content:
            "Watch two puppets on a stage bob up and down in perfect sync and you might think one is pushing the other. Look up and you see a single puppeteer working both strings — neither puppet moves the other; the hidden hand moves both. A confounder is that puppeteer. Ice cream and drowning are the puppets; summer heat is the hand pulling both strings. The whole skill is learning to look up for the puppeteer instead of blaming one puppet.",
        },
        {
          type: "code-note",
          code: "# Observed across a city, month by month:\nice_cream_sales   ↑↑   correlated with   drownings ↑↑\n\n# Tempting:   ice_cream  ->  drownings   (absurd)\n# Reality:    summer_heat -> ice_cream\n#             summer_heat -> swimming -> drownings\n# 'summer_heat' is the CONFOUNDER driving both.",
          content:
            "The correlation between ice cream and drowning is completely real and completely non-causal. A confounder (summer heat) independently drives both, manufacturing a pattern between two things that have no direct link at all.",
        },
        {
          type: "text",
          content:
            "'Reverse causation' — explanation (2) — is subtler and catches experts. A study finds that people who use fitness apps are fitter. Does the app make them fit, or do already-fit people choose to use fitness apps? The correlation is identical either way; the arrow's direction changes the entire conclusion, and the data alone can't tell you which way it points.",
        },
        {
          type: "warning",
          title: "'With enough data, coincidences are guaranteed'",
          content:
            "If you compare enough pairs of variables, some will correlate strongly by sheer chance — the number of films an actor appears in and the yearly cheese consumption of a country, and so on. These 'spurious correlations' look impressive and mean nothing. A strong correlation with no plausible mechanism is a red flag, not a discovery.",
        },
        {
          type: "expandable",
          title: "So how DO you establish causation?",
          content:
            "The gold standard is a randomised controlled experiment (an A/B test). You take one group and randomly split it: one half gets the change (the treatment), the other doesn't (the control). Because assignment is random, the two groups are alike in every other respect on average — including confounders you never even thought of. So if the treatment group ends up different, the change itself is the most credible cause. This is exactly why tech companies and medical trials run experiments instead of mining correlations: randomisation is what breaks the puppeteer's strings. When you can't run an experiment, causal claims stay tentative and lean on careful reasoning about confounders — which you'll go deeper on much later in DSM.",
        },
        {
          type: "text",
          content:
            "The practical habit is a single reflex. Whenever you meet a claim that 'X drives Y', pause and ask the four questions: Could Y drive X? Could a hidden C drive both? Could it be coincidence? Only after those survive scrutiny — ideally with an experiment — does 'X causes Y' earn the right to be stated. That pause is the entire lesson.",
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
        title: "You Found a Correlation — Now What?",
        caption:
          "Click each explanation to see how it works and how to test it. A correlation between A and B is consistent with all four — your job is to rule out the impostors before claiming cause.",
        nodes: [
          {
            id: "corr",
            label: "A and B correlate",
            sublabel: "they move together",
            detail:
              "You've measured that A and B rise and fall together. This is real and useful information — but on its own it supports four different explanations. Don't stop here.",
            x: 50,
            y: 12,
            accent: true,
          },
          {
            id: "a-causes-b",
            label: "A causes B",
            sublabel: "the tempting story",
            detail:
              "Changing A really does force B to change. It's often the explanation people jump to first — but it's only credible after you've ruled out the other three, ideally with a controlled experiment.",
            x: 20,
            y: 45,
            accent: true,
          },
          {
            id: "b-causes-a",
            label: "B causes A",
            sublabel: "reverse causation",
            detail:
              "The arrow runs the other way. 'Fitness-app users are fitter' might mean fit people choose the app, not that the app creates fitness. The correlation looks identical either direction.",
            x: 40,
            y: 45,
            accent: true,
          },
          {
            id: "confounder",
            label: "C causes both",
            sublabel: "confounder",
            detail:
              "A hidden third factor drives A and B independently, faking a link between them. Summer heat drives both ice-cream sales and drownings. This is the classic trap — always look for the puppeteer.",
            x: 60,
            y: 45,
            accent: true,
          },
          {
            id: "coincidence",
            label: "Pure chance",
            sublabel: "coincidence",
            detail:
              "Compare enough variable pairs and some correlate by luck alone, with no mechanism at all. A strong correlation with no plausible story is a red flag, not a finding.",
            x: 80,
            y: 45,
            accent: false,
          },
          {
            id: "experiment",
            label: "Run an experiment",
            sublabel: "the way to be sure",
            detail:
              "A randomised controlled test splits subjects at random, balancing all confounders on average. If the treated group differs, the treatment is the credible cause. This is how correlation is finally promoted to causation.",
            x: 50,
            y: 82,
            accent: true,
          },
        ],
        edges: [
          { from: "corr", to: "a-causes-b", label: "maybe" },
          { from: "corr", to: "b-causes-a", label: "maybe" },
          { from: "corr", to: "confounder", label: "maybe" },
          { from: "corr", to: "coincidence", label: "maybe" },
          { from: "a-causes-b", to: "experiment", label: "test it" },
          { from: "confounder", to: "experiment", label: "rule it out" },
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
          title: "Correlation or causation?",
          scenario:
            "Someone says: 'Umbrella sales and rainfall are correlated, so buying umbrellas causes rain.'",
          steps: [
            {
              code: "claim = 'umbrellas -> rain'",
              explanation:
                "Start by checking the direction. Does buying an umbrella make the sky rain? No mechanism could work that way — the arrow is backwards.",
            },
            {
              code: "reality = 'rain -> umbrella sales'",
              explanation:
                "Rain causes people to buy umbrellas, not the reverse. The correlation is real, but the causal story runs the opposite direction — a simple case of reverse causation.",
            },
          ],
          output: "Real correlation, wrong direction: rain drives umbrella sales, not the other way.",
        },
        {
          difficulty: "Easy",
          title: "Spot the confounder",
          scenario:
            "A report notes that neighbourhoods with more firefighters dispatched also have more fire damage, concluding 'firefighters cause damage.'",
          steps: [
            {
              code: "observed = 'more firefighters  ~  more damage'",
              explanation:
                "The correlation is genuine, but the conclusion is absurd. Look for a hidden third factor driving both numbers up together.",
            },
            {
              code: "confounder = 'size of the fire'\nbig_fire -> more firefighters\nbig_fire -> more damage",
              explanation:
                "Bigger fires independently cause both more firefighters to be sent and more damage to occur. Fire size is the puppeteer; firefighters don't cause the damage, they respond to the same cause.",
            },
          ],
          output: "Confounder = fire size. It drives both variables, faking a link between them.",
        },
        {
          difficulty: "Medium",
          title: "Which direction does the arrow point?",
          scenario:
            "Data shows employees who attend more optional training sessions get higher performance ratings. HR wants to make training mandatory to boost performance.",
          steps: [
            {
              code: "corr = 'more training  ~  higher ratings'",
              explanation:
                "Before spending money, question the arrow. HR assumes training → performance, but the opposite is plausible.",
            },
            {
              code: "alt_1 = 'motivated employees -> attend training AND perform well'\nalt_2 = 'high performers get picked for training'",
              explanation:
                "Motivation could be a confounder (driving both attendance and performance), or high performers might be the ones chosen for optional training — reverse causation. Either way, forcing training on everyone may not move performance at all.",
            },
            {
              code: "fix = 'randomly assign some staff to training, compare to a control group'",
              explanation:
                "The only way to know is an experiment: randomly assign training and compare. Randomisation balances motivation across groups, isolating training's real effect before HR commits budget.",
            },
          ],
          output: "The correlation can't justify the policy; an A/B test is needed before making training mandatory.",
        },
        {
          difficulty: "Hard",
          title: "A spurious correlation",
          scenario:
            "An analyst excitedly reports a near-perfect correlation between monthly searches for a video game and national margarine consumption, and wants to build a forecasting model on it.",
          steps: [
            {
              code: "corr = very strong (near-perfect!)",
              explanation:
                "A near-perfect correlation is striking, and it's tempting to treat strength as proof. But strength alone means nothing without a plausible mechanism connecting the two.",
            },
            {
              code: "mechanism = None   # no story links game searches to margarine",
              explanation:
                "There's no conceivable causal path — direct or via a confounder — between game searches and margarine. With thousands of possible variable pairs, some will line up almost perfectly by chance alone.",
            },
            {
              code: "verdict = 'spurious — do not model on it'",
              explanation:
                "This is a spurious correlation: real in the sample, meaningless in the world. Building a forecast on it would fail the moment the coincidence ends. Strength is not evidence; a plausible mechanism is.",
            },
          ],
          output: "A strong correlation with no mechanism is coincidence — never build on it.",
        },
        {
          difficulty: "Industry Example",
          title: "Interpreting a feature launch at a startup",
          scenario:
            "A product analyst sees that users who enabled a new 'dark mode' setting have 30% higher retention, and the team wants to announce that dark mode boosts retention.",
          steps: [
            {
              code: "observed = 'dark-mode users retain 30% better'",
              explanation:
                "This is a correlation from observational data — users chose to enable dark mode themselves. The analyst resists the headline and runs the four-question check.",
            },
            {
              code: "confounder? = 'power users explore settings AND retain well'\nreverse? = 'engaged users are the ones who find the toggle'",
              explanation:
                "Highly engaged power users are both more likely to dig into settings and more likely to retain — a textbook confounder. The 30% gap may reflect who turns on dark mode, not what dark mode does.",
            },
            {
              code: "test = 'A/B test: randomly default some new users to dark mode'\nresult = 'compare retention of randomised groups, not self-selected ones'",
              explanation:
                "The analyst proposes a randomised experiment: assign dark mode at random and compare. That balances engagement across groups and measures dark mode's true causal effect — turning a shaky correlation into a claim the team can actually stand behind.",
            },
          ],
          output: "The retention gap is likely confounded by engagement; only a randomised test can justify the causal claim.",
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
        filename: "confounder_check.py",
        instructions:
          "This is a reasoning drill in code form. For each observed correlation, decide the best explanation from a fixed list and fill it in. No math — you're practising the four-question reflex. Run it to check your labels.",
        starterCode: `# Label each correlation with the BEST explanation.
# Choose from: "reverse", "confounder", "coincidence"

# 1) Cities with more storks also have more human births (a classic).
#    Bigger cities have both more storks (more buildings) and more people.
label_1 = ___   # "reverse", "confounder", or "coincidence"

# 2) People who see a doctor more often are sicker on average.
#    Being sick is what sends people to the doctor.
label_2 = ___

# 3) A country's per-capita chocolate intake tracks its number of Nobel prizes,
#    with no believable mechanism connecting them.
label_3 = ___

print(label_1)
print(label_2)
print(label_3)`,
        solutionCode: `# Label each correlation with the BEST explanation.
# Choose from: "reverse", "confounder", "coincidence"

label_1 = "confounder"   # city size drives both storks and births
label_2 = "reverse"      # sickness causes doctor visits, not vice versa
label_3 = "coincidence"  # no plausible mechanism

print(label_1)
print(label_2)
print(label_3)`,
        expectedOutput: "confounder\nreverse\ncoincidence",
        hints: [
          "For #1, find the hidden third factor that independently drives both numbers.",
          "For #2, ask which way the arrow really points — does seeing a doctor make you sick, or the reverse?",
          "For #3, if there's no believable mechanism at all, it's likely just chance.",
          "Answers: city size is a confounder; sickness→doctor is reverse causation; chocolate↔Nobel is coincidence.",
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
          id: "fnd11_mcq_01",
          difficulty: "Easy",
          question: "What is the difference between correlation and causation?",
          options: [
            "They mean the same thing",
            "Correlation is a measurable pattern of two variables moving together; causation is a claim that one makes the other change",
            "Causation can be measured directly from data; correlation cannot",
            "Correlation only applies to numbers; causation only applies to categories",
          ],
          correctIndex: 1,
          explanation:
            "Correlation is an observed pattern you can measure; causation is a stronger claim about mechanism that must be argued for, usually with an experiment. Causation is precisely the thing you can't read straight off observational data.",
        },
        {
          type: "mcq",
          id: "fnd11_mcq_02",
          difficulty: "Easy",
          question: "What is a confounder?",
          options: [
            "A variable that is measured incorrectly",
            "A hidden third factor that independently influences both correlated variables",
            "The stronger of two correlated variables",
            "A correlation that equals exactly zero",
          ],
          correctIndex: 1,
          explanation:
            "A confounder is a lurking third cause that drives both variables, manufacturing a correlation between them (like summer heat behind ice cream and drowning). It isn't a measurement error, a ranking of variables, or a zero correlation.",
        },
        {
          type: "mcq",
          id: "fnd11_mcq_03",
          difficulty: "Medium",
          question:
            "A study finds people who eat breakfast weigh less. Which is the safest conclusion?",
          options: [
            "Eating breakfast definitely causes weight loss",
            "Skipping breakfast causes weight gain",
            "There's a correlation, but confounders (like overall healthy habits) or reverse causation could explain it — a randomised trial is needed",
            "The correlation must be a coincidence",
          ],
          correctIndex: 2,
          explanation:
            "The correlation is real but can't establish cause. People who eat breakfast may share other healthy habits (a confounder), or weight could influence eating patterns (reverse causation). Only a controlled experiment could justify a causal claim; declaring it definite — or definitely coincidence — overreaches.",
        },
        {
          type: "scenario",
          id: "fnd11_sc_01",
          difficulty: "Medium",
          scenario:
            "A marketing lead notices that customers who receive the company's email newsletter spend more, and wants to email everyone to increase spending.",
          question: "What's the flaw in this reasoning?",
          options: [
            "There's no flaw — the correlation proves emails cause spending",
            "Customers who opted into the newsletter may already be more engaged (a confounder); the correlation doesn't prove emails cause spending, so an A/B test is needed",
            "The flaw is that emails always reduce spending",
            "The correlation is too strong to be trusted",
          ],
          correctIndex: 1,
          explanation:
            "Newsletter subscribers self-selected — they're probably already more engaged, a confounder that drives both signing up and spending. The correlation can't justify emailing everyone. A randomised test (email a random subset) would reveal the true effect.",
        },
        {
          type: "scenario",
          id: "fnd11_sc_02",
          difficulty: "Hard",
          scenario:
            "An analyst wants to prove that a new onboarding tutorial causes higher user activation. They have observational data showing tutorial-completers activate more often.",
          question: "What's the most reliable way to establish causation here?",
          options: [
            "Report the observational correlation — it's sufficient",
            "Run a randomised experiment: randomly show the tutorial to some new users and compare activation against a control group",
            "Collect more observational data until the correlation is stronger",
            "Ask completers whether they felt the tutorial helped",
          ],
          correctIndex: 1,
          explanation:
            "Only randomisation balances confounders (like motivation) across groups, isolating the tutorial's real effect. More observational data just measures the same confounded correlation more precisely, and self-reported opinions aren't reliable causal evidence.",
        },
        {
          type: "coding",
          id: "fnd11_code_01",
          difficulty: "Medium",
          prompt:
            "Two lists move in the same direction. Print 'positive' if both increase together (each list sorted ascending), else 'not positive'. Given x and y already sorted ascending, this is a simple check: print 'positive'. (The point is recognising co-movement, not computing a coefficient.)",
          starterCode:
            "x = [1, 2, 3, 4]     # hours studied\ny = [50, 55, 62, 70] # test score\n# Both rise together -> print 'positive'\n",
          solutionCode:
            "x = [1, 2, 3, 4]     # hours studied\ny = [50, 55, 62, 70] # test score\nif x == sorted(x) and y == sorted(y):\n    print('positive')\nelse:\n    print('not positive')",
          expectedOutput: "positive",
          tests: [
            {
              name: "Detects co-movement",
              description: "Confirms both lists increase together.",
            },
            {
              name: "Output",
              description: "Prints 'positive' since both x and y rise together.",
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
            "Explain the difference between correlation and causation with an example.",
          answer:
            "Correlation means two variables tend to move together — it's a pattern I can measure directly from data. Causation means one variable actually makes the other change, which is a much stronger claim about mechanism. The classic example is that ice-cream sales and drowning deaths are strongly correlated across the year, but ice cream plainly doesn't cause drowning — hot summer weather independently drives both. That example captures why the distinction matters: a correlation can be completely real and completely non-causal. In practice I treat a correlation as the start of an investigation, not a conclusion. It tells me two things are worth looking at together, but before I claim one causes the other I have to rule out reverse causation, a confounding third variable, and plain coincidence.",
        },
        {
          question:
            "You find a strong correlation between using a product feature and higher retention. Why can't you conclude the feature causes retention, and what would you do?",
          answer:
            "I can't conclude causation because the users who adopted the feature chose to — this is observational, self-selected data. The most likely problem is confounding: highly engaged users are both more likely to discover and use the feature and more likely to retain anyway, so engagement drives both and inflates the apparent effect. There's also possible reverse causation, where users who were already going to stick around are the ones who explore features. The correlation looks the same under all of these. To actually establish causation I'd run a randomised experiment — an A/B test — where I randomly assign some users to get the feature (or have it defaulted on) and compare retention against a control group. Randomisation balances engagement and every other confounder across the two groups on average, so a retention difference can be credibly attributed to the feature itself. Until I have that, I'd report the relationship as a correlation and explicitly flag that it's not yet causal.",
        },
        {
          question:
            "What are the possible explanations for an observed correlation between two variables A and B, and how do you tell them apart?",
          answer:
            "There are four broad explanations. First, A genuinely causes B. Second, B causes A — reverse causation, where the arrow runs the opposite way to what I assumed. Third, a confounder C independently causes both A and B, creating a link between them with no direct connection at all. Fourth, it's coincidence — with enough variables compared, some correlate by pure chance. Telling them apart starts with reasoning: I ask whether each direction has a plausible mechanism, and I brainstorm candidate confounders — is there some third factor, like wealth, age, motivation, or seasonality, that could drive both? A strong correlation with no believable mechanism points toward coincidence or a spurious relationship. But reasoning only narrows it down; the decisive tool is a randomised controlled experiment, because randomisation balances all confounders — even ones I didn't think of — so that a remaining difference is attributable to the treatment. When an experiment isn't possible, I stay tentative and lean on careful confounder control, and I'm explicit that the causal claim is uncertain.",
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
        "1) Jumping from 'A and B move together' straight to 'A causes B' without ruling out the alternatives. 2) Ignoring reverse causation — assuming the arrow points the way you expected. 3) Forgetting to hunt for a confounder, the hidden third cause behind both variables. 4) Treating a strong correlation as proof; strength without a plausible mechanism is often coincidence. 5) Making costly decisions from observational data when a quick randomised test could settle the question.",
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
        "Try these prompts in the AI Tutor panel: • 'Give me a correlation and ask me to name a possible confounder.' • 'ELI5: reverse causation with a fresh example.' • 'Quiz me: for each headline, is it correlation or causation?' • 'Explain how a randomised experiment rules out confounders.' • 'Interview mode: I claim a feature boosts retention — challenge my reasoning.'",
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
        "Correlation — a measurable tendency of two variables to move together (positive or negative). Causation — one variable actually making another change. Confounder — a hidden third factor that drives both correlated variables. Reverse causation — the causal arrow running opposite to what's assumed (B causes A). Spurious correlation — a real-in-the-sample correlation with no genuine mechanism; coincidence. Randomised controlled experiment (A/B test) — randomly assigning a treatment to isolate a causal effect. Control group — the subjects who don't receive the treatment, used for comparison.",
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
        "• Site: Tyler Vigen's 'Spurious Correlations' — a gallery of absurd real correlations that makes the lesson stick. • Read: the opening of any explainer on randomised controlled trials to see how experiments break confounding. • Practice: find a 'X boosts Y' headline this week and name one confounder that could explain it instead. • Next in DSM: you now have the full Foundations toolkit — reading data, quality, bias, and statistics. Next you'll put it all together on a real dataset in your first guided project.",
    },

    /* ---------------------------------------------------------------- */
    /*  12 — Recap                                                       */
    /* ---------------------------------------------------------------- */
    {
      id: "recap",
      type: "recap",
      tocLabel: "Recap",
      content:
        "✓ Correlation is a measurable pattern of two variables moving together; causation is a claim that one makes the other change.\n✓ A correlation has four possible explanations: A→B, B→A (reverse), a confounder C→both, or coincidence.\n✓ A confounder is a hidden third cause that drives both variables — like summer heat behind ice cream and drowning.\n✓ A strong correlation with no plausible mechanism is likely spurious, not a discovery.\n✓ Causation is established with a randomised controlled experiment, which balances confounders across groups.\n\nNext up: your first Foundations Project. You've now built the whole Foundations toolkit — reading data, dataset anatomy, data quality, bias, and core statistics. Next you'll act like a junior data scientist: take a real dataset from first glance to a single honest, defensible insight.",
    },
  ],
};
