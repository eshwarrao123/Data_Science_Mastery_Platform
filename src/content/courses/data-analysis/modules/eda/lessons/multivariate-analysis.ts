import type { Lesson } from "@/lib/curriculum/types";

export const multivariateAnalysis: Lesson = {
  meta: {
    id: "data-analysis.eda.multivariate-analysis",
    slug: "multivariate-analysis",
    title: "Multivariate Analysis",
    description:
      "Add the third variable: segment your bivariate findings, hunt interaction effects, survive Simpson's paradox, and use grouped pivot tables to see how relationships change across contexts.",
    estimatedTime: "35 mins",
    difficulty: "Intermediate",
    xpReward: 80,
    prerequisites: ["data-analysis.eda.bivariate-analysis"],
    masteryThreshold: 80,
  },

  blocks: [
    {
      id: "intro",
      type: "lesson-intro",
      tocLabel: "Introduction",
      intro: {
        hook: "In 1973, UC Berkeley was sued for gender bias: 44% of male applicants were admitted versus 35% of female. Then someone split the data by department — and within most departments, women were admitted at HIGHER rates. Women had applied to the most competitive departments. The bias verdict flipped with one groupby. That's multivariate analysis: the level where two-variable 'truths' go to be tested.",
        what: "Multivariate analysis examines three or more variables together: segmenting a bivariate relationship by a third variable (does the pattern hold within each group?), detecting interaction effects (does the EFFECT of X on Y depend on Z?), and reading multi-key pivot tables. The star exhibit is Simpson's paradox — an aggregate trend that reverses inside every subgroup.",
        why: "Bivariate findings drive decisions, and third variables are how those findings lie: mix effects masquerade as trends, confounders masquerade as causes, and a treatment that helps everyone can look harmful in aggregate. One segmentation check is often the difference between insight and lawsuit-grade error.",
        whereUsed:
          "Any A/B readout sliced by segment, fairness audits (the Berkeley case), marketing mix analysis, cohort retention views, pre-modelling interaction hunting, and every 'why did the metric move?' investigation where composition shifted.",
        objectives: [
          "Segment a bivariate relationship with two-key groupbys and pivot tables",
          "Explain Simpson's paradox and detect it with a within-groups check",
          "Distinguish confounding (Z drives both) from interaction (Z changes X's effect)",
          "Read weighted vs unweighted aggregates and spot mix effects",
          "Know when segmentation stops (small cells) and modelling begins",
        ],
        realWorldApps: [
          {
            company: "UC Berkeley",
            headline: "The canonical admissions case",
            detail:
              "The 1973 admissions data is the textbook Simpson's paradox: aggregate rates suggested bias against women; department-level rates showed the opposite — applicant mix, not admissions behaviour, produced the aggregate gap.",
          },
          {
            company: "Optimizely",
            headline: "Segmented experiment readouts",
            detail:
              "A/B platforms report lift by segment because average effects hide heterogeneity: a checkout change can help mobile users and hurt desktop users, netting to 'no effect' overall.",
          },
          {
            company: "Moderna",
            headline: "Vaccine efficacy by age strata",
            detail:
              "Clinical results are reported within age strata precisely because aggregate rates across differently-sized, differently-risked groups produce Simpson-style distortions.",
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
            "The core move is conditioning: take a bivariate finding ('conversion differs by device') and re-compute it WITHIN each level of a third variable ('…within each traffic source?'). Mechanically it's the tools you own — a two-key groupby or a pivot_table with index and columns — read with a new question: does the pattern survive the split?",
        },
        {
          type: "code-note",
          code: `# The segmentation check, two ways
df.groupby(['source', 'device'])['converted'].mean().unstack()

df.pivot_table(index='source', columns='device',
               values='converted', aggfunc='mean')
# device    desktop  mobile
# source
# ads          0.10    0.08     <- pattern within ads
# organic      0.22    0.19     <- pattern within organic`,
          content:
            "One grid answers three questions at once: the X–Y pattern within each Z (read across rows), the Z–Y pattern within each X (read down columns), and whether any cell breaks the story. Carry cell COUNTS in a twin table — a rate over 12 rows is a rumour.",
        },
        {
          type: "keypoint",
          title: "Simpson's paradox: when the aggregate lies",
          content:
            "A trend can hold in aggregate yet reverse within every subgroup (or vice versa). Mechanism: the groups differ in SIZE and BASELINE, and the aggregate mixes them by weight. Berkeley: women applied more to departments with low admission rates for everyone — aggregate admission gap, department-level near-parity or advantage. The check is mechanical: compute the comparison within each level of plausible third variables; if the sign flips, the aggregate was a composition story, not a behaviour story.",
        },
        {
          type: "code-note",
          code: `# Aggregate says treatment B wins…
df.groupby('treatment')['success'].mean()
# …but within each severity level, A wins
df.groupby(['severity', 'treatment'])['success'].mean().unstack()
# Why: B was given mostly easy cases. Mix, not merit.`,
          content:
            "The kidney-treatment version of the paradox: B looks better overall because it was assigned the easy cases. The within-severity view is the honest one HERE — because severity influenced treatment assignment. Which view is 'true' depends on the causal structure, which is why the paradox can't be resolved by arithmetic alone.",
        },
        {
          type: "keypoint",
          title: "Confounding vs interaction — different beasts",
          content:
            "Confounding: Z drives both X and Y, creating a spurious X–Y link (or masking a real one); conditioning on Z removes the distortion — the Berkeley case. Interaction: X genuinely affects Y, but the SIZE (or sign) of the effect depends on Z — a discount lifts conversion 2% on desktop and 11% on mobile. Confounders are noise to remove; interactions are findings to report. Both are discovered by the same segmentation grid, distinguished by the question: did the effect DISAPPEAR (confounding) or VARY (interaction)?",
        },
        {
          type: "warning",
          title: "The curse of shrinking cells",
          content:
            "Every additional split divides your data: 1,000 rows → 2 sources × 3 devices × 4 regions = 24 cells averaging 42 rows, some near-empty. Rates from tiny cells swing wildly and 'insights' bloom by chance (multiple comparisons again). Rules: always display cell counts, set a floor (no rate quoted below ~30–50 rows without a caveat), split by variables you have REASONS to suspect, and accept that beyond 2–3 conditioning variables the honest tool is a model (regression — the ML domain), not a deeper pivot.",
        },
        {
          type: "analogy",
          title: "The average temperature of two rooms",
          content:
            "One room at 10°C with 9 people, another at 30°C with 1 person: 'the average person experiences 12°C'. True by arithmetic, experienced by nobody. Now move people between rooms and the 'average temperature' changes with nobody touching a thermostat — that's a mix effect: an aggregate moving purely from composition. Segment-level views are thermometers per room; multivariate analysis is refusing to discuss the building's 'temperature' before checking who's standing where.",
        },
        {
          type: "expandable",
          title: "Reading metric moves: rate change vs mix change",
          content:
            "'Average order value fell 8%' has two possible anatomies: rates fell within segments (customers really spend less — a behaviour change), or the mix shifted toward low-value segments (mobile share grew — a composition change), or both. The decomposition habit: compute the metric within each segment for both periods, plus each segment's weight in both periods. If within-segment values are flat while weights moved, it's pure mix — and the 'decline' may even be good news (growth in a new segment). Finance and growth teams formalise this as mix-shift decomposition; the EDA version is one pivot table per period and a weights comparison. Most 'the metric dropped!' fire drills end here.",
        },
      ],
    },

    {
      id: "diagram",
      type: "interactive-diagram",
      tocLabel: "Visual Learning",
      visual: {
        kind: "flow",
        title: "Interrogating a finding with a third variable",
        caption: "Click each stage — from bivariate claim to multivariate verdict.",
        nodes: [
          { id: "claim", label: "Bivariate finding", sublabel: "'B beats A'", detail: "A two-variable result that's about to drive a decision: a treatment comparison, a segment gap, a trend. Promising — and untested against composition.", x: 12, y: 25, accent: false },
          { id: "suspects", label: "List suspects", sublabel: "plausible third variables", detail: "Which Z could differ between the groups AND relate to the outcome? Severity, tenure, device, region, season. Domain knowledge writes this list, not the data.", x: 35, y: 12, accent: true },
          { id: "split", label: "Condition on Z", sublabel: "two-key pivot + counts", detail: "Recompute the comparison within each Z level: pivot_table(index=Z, columns=X, values=Y) with a twin table of cell counts.", x: 60, y: 20, accent: true },
          { id: "holds", label: "Pattern holds", sublabel: "same sign everywhere", detail: "The finding survives conditioning — stronger now. Check the NEXT suspect, mind cell sizes, then report with the checks disclosed.", x: 85, y: 42, accent: false },
          { id: "flips", label: "Pattern flips", sublabel: "Simpson's paradox", detail: "Within-group sign contradicts the aggregate: composition was driving it. Report the within-group view with the mix explanation — the aggregate alone is now known to mislead.", x: 60, y: 62, accent: true },
          { id: "varies", label: "Effect varies", sublabel: "interaction", detail: "X helps in some Z levels, does nothing or hurts in others. Not noise — a finding: report the heterogeneity, it usually IS the actionable insight.", x: 33, y: 70, accent: false },
          { id: "limit", label: "Cells too small?", sublabel: "stop splitting", detail: "When cells drop below ~30-50 rows, deeper pivots manufacture noise. Caveat the rates, or graduate to modelling (regression) which conditions on many variables without slicing.", x: 12, y: 55, accent: false },
        ],
        edges: [
          { from: "claim", to: "suspects" },
          { from: "suspects", to: "split" },
          { from: "split", to: "holds", label: "consistent" },
          { from: "split", to: "flips", label: "reverses" },
          { from: "split", to: "varies", label: "heterogeneous" },
          { from: "split", to: "limit", label: "data thins" },
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
          title: "A two-key pivot",
          scenario: "Conversion by device — now split by traffic source.",
          steps: [
            { code: "import pandas as pd\ndf = pd.DataFrame({\n    'source':    ['ads']*4 + ['organic']*4,\n    'device':    ['mob','mob','desk','desk']*2,\n    'converted': [0, 1, 1, 0, 1, 1, 1, 0],\n})", explanation: "Eight sessions across source × device. The bivariate view (by device alone) is about to gain a dimension." },
            { code: "grid = df.pivot_table(index='source', columns='device',\n                      values='converted', aggfunc='mean')", explanation: "index and columns hold the two conditioning variables; each cell is the conversion rate for that combination." },
            { code: "print(grid.to_string())", explanation: "Now readable in two directions: organic beats ads on BOTH devices (down the columns), and desktop ≥ mobile within ads but not organic (across the rows). Two bivariate stories, reconciled in one grid." },
          ],
          output: "device   desk  mob\nsource            \nads       0.5  0.5\norganic   0.5  1.0",
        },
        {
          difficulty: "Easy",
          title: "A mix effect in plain sight",
          scenario: "Average order value 'fell' — did behaviour change, or did the mix?",
          steps: [
            { code: "df = pd.DataFrame({\n    'month':   ['Jan']*4 + ['Feb']*4,\n    'segment': ['web','web','web','app', 'web','app','app','app'],\n    'aov':     [100, 102, 98, 60,  101, 62, 58, 60],\n})", explanation: "January was 3 web orders and 1 app order; February flipped to 1 web and 3 app." },
            { code: "print(df.groupby('month')['aov'].mean().round(1).to_dict())", explanation: "Aggregate AOV: Jan 90 → Feb 70.2. Panic: 'orders shrank 22%!'" },
            { code: "print(df.groupby(['month','segment'])['aov'].mean().round(1).unstack().to_string())", explanation: "Within segments: web ~100 both months, app ~60 both months. NOBODY spends less — the app segment (always smaller orders) grew its share. A composition story, arguably a growth success, hiding inside a 'decline'." },
          ],
          output: "{'Feb': 70.2, 'Jan': 90.0}\nsegment   app    web\nmonth               \nFeb      60.0  101.0\nJan      60.0  100.0",
        },
        {
          difficulty: "Medium",
          title: "Simpson's paradox, reproduced",
          scenario: "Treatment B beats A overall — and loses within every severity group.",
          steps: [
            { code: "df = pd.DataFrame({\n    'treatment': ['A']*8 + ['B']*8,\n    'severity':  ['severe']*6 + ['mild']*2 + ['severe']*2 + ['mild']*6,\n    'success':   [1,1,1,1,0,0, 1,1,  0,1,  1,1,1,1,1,0],\n})", explanation: "The classic setup: A was given mostly severe cases (6 of 8), B mostly mild ones (6 of 8). Assignment was not random." },
            { code: "print(df.groupby('treatment')['success'].mean().round(2).to_dict())", explanation: "Aggregate: A succeeds 75%, B 88% — 'switch everyone to B!'" },
            { code: "print(df.groupby(['severity','treatment'])['success'].mean().round(2).unstack().to_string())", explanation: "Within strata: severe cases — A 67% vs B 50%; mild cases — A 100% vs B 83%. A wins BOTH. B's aggregate lead was borrowed from treating easier patients. The sign flipped because case-mix, not treatment quality, drove the aggregate." },
          ],
          output: "{'A': 0.75, 'B': 0.88}\ntreatment     A     B\nseverity             \nmild       1.00  0.83\nsevere     0.67  0.50",
        },
        {
          difficulty: "Hard",
          title: "Interaction: the effect that depends on context",
          scenario: "Does free shipping lift conversion? Answer: it depends — and 'it depends' is the finding.",
          steps: [
            { code: "df = pd.DataFrame({\n    'free_ship': [0,0,0,0,1,1,1,1]*2,\n    'basket':    ['small']*8 + ['large']*8,\n    'converted': [0,0,1,0, 1,1,1,0,   1,0,1,1, 1,0,1,1],\n})", explanation: "16 sessions: shipping offer × basket size. The naive question is 'does the offer work?' — singular answer expected." },
            { code: "print(df.groupby('free_ship')['converted'].mean().to_dict())", explanation: "Overall: 50% → 75%. 'Free shipping lifts conversion 25 points.' True — and incomplete." },
            { code: "grid = df.groupby(['basket','free_ship'])['converted'].mean().unstack()\nprint(grid.to_string())", explanation: "Within small baskets: 25% → 75% (+50 points!). Within large baskets: 75% → 75% (nothing — they were converting anyway). The effect is real but lives entirely in small baskets: an INTERACTION. Actionable version: offer shipping to small baskets only, and save the margin on large ones." },
          ],
          output: "{0: 0.5, 1: 0.75}\nfree_ship     0     1\nbasket               \nlarge      0.75  0.75\nsmall      0.25  0.75",
        },
        {
          difficulty: "Industry Example",
          title: "A fairness audit done right",
          scenario: "An HR analyst checks whether a company's promotion rates differ by gender — and knows to condition before concluding.",
          steps: [
            { code: "import pandas as pd\ndf = pd.DataFrame({\n    'gender': ['W']*10 + ['M']*10,\n    'dept':   ['eng']*3 + ['sales']*7 + ['eng']*7 + ['sales']*3,\n    'promoted':[1,1,0, 1,0,0,1,0,0,1,  1,1,0,1,1,0,1, 1,0,0],\n})", explanation: "20 employees. Note the department mix: women are 3 eng / 7 sales; men are 7 eng / 3 sales." },
            { code: "print(df.groupby('gender')['promoted'].mean().round(2).to_dict())", explanation: "Aggregate: women promoted at 50%, men at 60% — a 10-point gap. Headline-ready. But the Berkeley lesson says: condition on department first." },
            { code: "print(df.groupby(['dept','gender'])['promoted'].mean().round(2).unstack().to_string())\nprint(df.groupby(['dept','gender']).size().unstack().to_string())", explanation: "Within eng: W 67% vs M 71%; within sales: W 43% vs M 33% — near parity one way, women ahead the other. The aggregate gap comes mostly from eng promoting more than sales, and the genders' different department mix. The honest report shows BOTH levels, the cell counts (3s and 7s — small!), and asks the next question: why the department mix differs. One groupby away from a very different, and truer, story." },
          ],
          output: "{'M': 0.6, 'W': 0.5}\ngender        M     W\ndept                 \neng        0.71  0.67\nsales      0.33  0.43\ngender      M  W\ndept            \neng         7  3\nsales       3  7",
        },
      ],
    },

    {
      id: "inline-practice",
      type: "inline-code",
      tocLabel: "Practice Coding",
      coding: {
        language: "python",
        filename: "multivariate_practice.py",
        instructions:
          "A support dataset claims 'chat resolves tickets better than email'. Run the aggregate, then condition on ticket difficulty and see whether the claim survives.",
        starterCode: `import pandas as pd

df = pd.DataFrame({
    'channel':    ['chat']*8 + ['email']*8,
    'difficulty': ['easy']*6 + ['hard']*2 + ['easy']*2 + ['hard']*6,
    'resolved':   [1,1,1,1,1,0, 0,1,   1,1,  1,0,1,0,1,0],
})

# TODO 1: Aggregate resolution rate per channel (Series)
overall = ___

# TODO 2: Resolution rate per (difficulty, channel) as an unstacked grid
grid = ___

# TODO 3: Cell counts for the same split (unstacked)
counts = ___

print(overall.round(2).to_dict())
print(grid.round(2).to_string())
print(counts.to_string())`,
        solutionCode: `import pandas as pd

df = pd.DataFrame({
    'channel':    ['chat']*8 + ['email']*8,
    'difficulty': ['easy']*6 + ['hard']*2 + ['easy']*2 + ['hard']*6,
    'resolved':   [1,1,1,1,1,0, 0,1,   1,1,  1,0,1,0,1,0],
})

overall = df.groupby('channel')['resolved'].mean()

grid = df.groupby(['difficulty','channel'])['resolved'].mean().unstack()

counts = df.groupby(['difficulty','channel']).size().unstack()

print(overall.round(2).to_dict())
print(grid.round(2).to_string())
print(counts.to_string())`,
        expectedOutput: "{'chat': 0.75, 'email': 0.62}\nchannel     chat  email\ndifficulty             \neasy        0.83    1.0\nhard        0.50    0.5\nchannel     chat  email\ndifficulty             \neasy           6      2\nhard           2      6",
        hints: [
          "Task 1: groupby('channel')['resolved'].mean() — chat 0.75 vs email 0.62 in aggregate.",
          "Task 2: two-key groupby then .unstack() lifts channel into columns.",
          "Task 3: same groupby with .size() instead of the mean — the twin counts table.",
          "The verdict: within easy tickets email actually resolves BETTER (1.0 vs 0.83), and hard tickets tie at 0.5 — chat's aggregate lead came from receiving the easy tickets. Simpson strikes again.",
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
          id: "pda21_mcq_01",
          difficulty: "Easy",
          question: "What is Simpson's paradox?",
          options: [
            "When two variables correlate by chance",
            "When a trend present in aggregate data reverses (or vanishes) within every subgroup, because group sizes and baselines differ",
            "When the mean exceeds the median",
            "When a pivot table has missing cells",
          ],
          correctIndex: 1,
          explanation:
            "The aggregate mixes subgroups by their weights, so composition differences can produce a headline trend that contradicts every subgroup's internal truth — Berkeley admissions being the canonical case.",
        },
        {
          type: "mcq",
          id: "pda21_mcq_02",
          difficulty: "Easy",
          question: "A discount lifts conversion +50 points for small baskets and 0 points for large ones. This is best described as:",
          options: [
            "A confounder",
            "An interaction effect — the effect of the discount depends on basket size",
            "Simpson's paradox",
            "A data quality artifact",
          ],
          correctIndex: 1,
          explanation:
            "The effect is real but its magnitude varies with a third variable — the definition of interaction. It's a reportable finding (target the discount!), unlike a confounder, which is a distortion to remove.",
        },
        {
          type: "mcq",
          id: "pda21_mcq_03",
          difficulty: "Medium",
          question: "Why must a segmentation grid always ship with a twin table of cell counts?",
          options: [
            "pandas requires it",
            "Rates from small cells swing wildly by chance; without counts, a 3-row cell's 100% reads as strongly as a 3,000-row cell's — and deeper splits shrink cells fast",
            "Counts make the table prettier",
            "unstack fails without counts",
          ],
          correctIndex: 1,
          explanation:
            "Every conditioning split divides the data. The counts table is what separates '67% (n=3)' — a rumour — from '67% (n=3,000)' — a finding, and it's the guard against multiple-comparisons noise blooming in sparse cells.",
        },
        {
          type: "scenario",
          id: "pda21_sc_01",
          difficulty: "Medium",
          scenario:
            "A dashboard shows average delivery time improved from 3.1 to 2.6 days after a new courier launched. Within every city, delivery times were actually flat month-over-month — but the new courier only operates in the two densest cities, which grew their share of orders.",
          question: "What explains the 'improvement'?",
          options: [
            "The new courier is faster everywhere",
            "A mix effect: no city got faster, but fast-city orders became a larger share of the total, pulling the aggregate down — composition, not behaviour",
            "Simpson's paradox cannot occur in delivery data",
            "The dashboard has a bug",
          ],
          correctIndex: 1,
          explanation:
            "Flat within-city times + shifted weights = a moving aggregate. Celebrating (or extrapolating) the 0.5-day 'gain' would misread composition as operational improvement — the exact failure the within-segment check exists to catch.",
        },
        {
          type: "coding",
          id: "pda21_code_01",
          difficulty: "Hard",
          prompt:
            "The aggregate says plan 'pro' retains better. Condition on company size: print the aggregate retention per plan, then the (size, plan) retention grid, and see the flip.\n\ndf = pd.DataFrame({'plan':['pro']*6+['basic']*6, 'size':['big']*4+['small']*2+['big']*1+['small']*5, 'retained':[1,1,1,0,1,0, 1, 1,1,0,1,0]})",
          starterCode:
            "import pandas as pd\n\ndf = pd.DataFrame({'plan':['pro']*6+['basic']*6, 'size':['big']*4+['small']*2+['big']*1+['small']*5, 'retained':[1,1,1,0,1,0, 1, 1,1,0,1,0]})\n\n# Your code here\n",
          solutionCode:
            "import pandas as pd\n\ndf = pd.DataFrame({'plan':['pro']*6+['basic']*6, 'size':['big']*4+['small']*2+['big']*1+['small']*5, 'retained':[1,1,1,0,1,0, 1, 1,1,0,1,0]})\n\nprint(df.groupby('plan')['retained'].mean().round(2).to_dict())\nprint(df.groupby(['size','plan'])['retained'].mean().round(2).unstack().to_string())",
          expectedOutput: "{'basic': 0.67, 'pro': 0.67}\nplan       basic   pro\nsize                  \nbig         1.00  0.75\nsmall       0.60  0.50",
          tests: [
            { name: "Aggregate", description: "Both plans retain 0.67 overall — no apparent difference" },
            { name: "Conditioned", description: "Within BOTH size strata, basic beats pro (1.0 vs 0.75 big; 0.6 vs 0.5 small) — pro's parity came from its big-company-heavy mix" },
          ],
        },
        {
          type: "mcq",
          id: "pda21_mcq_04",
          difficulty: "Hard",
          question: "When a comparison flips under conditioning, which view — aggregate or within-group — is the 'true' one?",
          options: [
            "Always the within-group view",
            "Always the aggregate view",
            "It depends on the causal structure: condition on variables that influenced assignment/composition (severity assigned to treatments), but NOT on variables caused by the exposure itself — arithmetic alone cannot decide",
            "Whichever has more rows",
          ],
          correctIndex: 2,
          explanation:
            "In the treatment case, severity drove assignment, so within-severity is honest. But conditioning on a DOWNSTREAM consequence of X (a mediator or collider) can create fresh distortions. The paradox is resolved by causal reasoning about the domain — a preview of why causal inference exists as a field.",
        },
      ],
    },

    {
      id: "interview-questions",
      type: "interview-questions",
      tocLabel: "Interview Prep",
      questions: [
        {
          question: "Explain Simpson's paradox with a concrete example and how you check for it.",
          answer:
            "Simpson's paradox is an aggregate trend that reverses within every subgroup, produced by composition rather than behaviour. The Berkeley admissions case is the canonical example: 44% of men admitted versus 35% of women in aggregate, yet within most departments women were admitted at equal or higher rates — women had disproportionately applied to the most selective departments, so the aggregate gap measured application mix, not admission bias. The mechanism is always the same: subgroups with different sizes and baselines, mixed by weight. My check is mechanical: for any decision-bearing comparison, I list third variables that plausibly differ between the groups AND relate to the outcome — case severity, department, device, tenure — and recompute the comparison within each level via a two-key pivot with a twin counts table. Same sign everywhere: the finding strengthens. Sign flips: I report the within-group view with the mix explanation, because the aggregate is now known to be a composition artifact. What arithmetic can't decide is which view is causally honest — that requires knowing whether the third variable influenced group membership, which is domain reasoning, not pandas.",
        },
        {
          question: "How do you tell confounding apart from an interaction effect, and why does the difference matter?",
          answer:
            "Both are discovered by the same segmentation grid, but they're different phenomena with opposite fates in the report. Confounding: the third variable drives both X and Y, manufacturing (or masking) an X–Y association — condition on it and the apparent effect shrinks or vanishes. Berkeley's department variable is a confounder of the gender-admission link. Confounders are distortions: the analysis is wrong until they're handled. Interaction: X genuinely affects Y, but the effect's size or direction depends on Z — free shipping lifting small-basket conversion by 50 points and large-basket by zero. Conditioning doesn't make it vanish; it makes it VARY. Interactions are findings, often the most actionable kind, because they say where to target. Diagnostically: after conditioning, ask 'did the effect disappear or diversify?' — disappearance points to confounding, heterogeneity to interaction. The stakes: treating a confounder as a finding ships a false insight; averaging over an interaction ships a true-but-useless one ('the feature adds 2% on average' when it adds 11% on mobile and nothing elsewhere).",
        },
        {
          question: "A metric moved and leadership wants to know why. Describe your investigation.",
          answer:
            "First I decompose the move into rate versus mix, because most metric fire-drills die there. I compute the metric within each major segment for both periods, alongside each segment's weight in both periods. Three outcomes: within-segment values moved (a behaviour change — investigate what changed in those segments); weights moved while within-segment values stayed flat (pure composition — the 'decline' might be a growing low-baseline segment, which can be good news); or both. Second, I check denominators and definitions: did the population entering the metric change — a tracking fix, a bot filter, a new market — because 'the metric' often measures a different set of things than last quarter. Third, timing: did the move coincide with a launch, a pricing change, a data pipeline deploy? Sharp discontinuities usually mean instrumentation, gradual drifts mean behaviour or mix. Throughout, cell counts guard against over-slicing, and the deliverable follows the EDA-workflow shape: the decomposition table, the finding in one sentence with numbers ('AOV fell because app share rose from 30% to 45%; within-platform AOV was flat'), the caveats, and the follow-up question — which is often about why the mix shifted, a healthier question than the one we started with.",
        },
      ],
    },

    {
      id: "common-mistakes",
      type: "callout",
      variant: "warning",
      title: "Common Mistakes to Avoid",
      content:
        "1) Shipping an aggregate comparison without one within-group check — Simpson's paradox is a groupby away. 2) Reading a mix effect as a behaviour change ('AOV fell!' when the segment weights moved). 3) Deleting an interaction by averaging over it — 'the average effect is 2%' hides the segment where it's 11%. 4) Quoting rates from cells of 5 rows — always ship the counts twin table. 5) Splitting by every available column and 'discovering' patterns in the noise — condition on suspects you have reasons for. 6) Conditioning on variables CAUSED by the exposure (mediators/colliders) and creating new distortions. 7) Believing arithmetic settles which level is 'true' — the causal structure decides, and that's domain knowledge.",
    },

    {
      id: "ai-tutor",
      type: "callout",
      variant: "tip",
      title: "Ask the AI Tutor",
      content:
        "Try these prompts in the AI Tutor panel: • 'ELI5: Simpson's paradox with the two-rooms temperature story.' • 'Build me a tiny dataset where the aggregate and subgroup trends disagree, and walk me through why.' • 'Quiz me: confounder, interaction, or mix effect for scenarios you invent.' • 'Decompose a metric move into rate vs mix on example data.' • 'Interview mode: I present an aggregate finding, you demand the conditioning checks.'",
    },

    {
      id: "glossary",
      type: "callout",
      variant: "info",
      title: "Glossary",
      content:
        "Multivariate — three or more variables analysed jointly. Conditioning / segmenting — recomputing a relationship within levels of a third variable. Simpson's paradox — aggregate trend reversing within every subgroup via composition. Mix effect — an aggregate moving because segment WEIGHTS shifted, not segment values. Confounder — Z driving both X and Y, distorting their association. Interaction — X's effect on Y changing size/sign across Z levels. Stratum/strata — the subgroup levels you condition on. Cell — one combination in a multi-key grid; small cells breed noise. Mediator — a variable on the causal path from X to Y (don't condition on it casually).",
    },

    {
      id: "resources",
      type: "callout",
      variant: "info",
      title: "Recommended Resources",
      content:
        "• Look up: the Bickel et al. (1975) Berkeley admissions paper and the kidney-stone treatment study — the two canonical Simpson cases. • Read: a gentle introduction to confounding vs mediation (any epidemiology or causal-inference primer's first chapter). • Practice: take last month's most confident bivariate finding at work (or from a Kaggle notebook) and subject it to three conditioning checks with counts tables — write down whether it held, flipped, or varied. • Next in DSM: everything converges — the capstone Project: EDA on a Real Dataset runs the full workflow end to end.",
    },

    {
      id: "recap",
      type: "recap",
      tocLabel: "Recap",
      content:
        "✓ The core move is conditioning: recompute any bivariate finding within levels of plausible third variables (two-key pivot + counts twin).\n✓ Simpson's paradox: aggregates can reverse inside every subgroup when sizes and baselines differ — composition masquerading as behaviour.\n✓ Confounding makes effects vanish under conditioning (a distortion); interaction makes them vary (a finding — often the actionable one).\n✓ Metric moves decompose into rate changes vs mix changes — check within-segment values against segment weights before declaring behaviour change.\n✓ Cells shrink fast: show counts, floor your rates, condition with reasons, and graduate to models beyond 2–3 variables.\n✓ Which level is 'true' is a causal question — arithmetic finds the flip; domain knowledge adjudicates it.\n\nNext up: 🏗 Project — EDA on a Real Dataset. The full workflow, one real dataset, one deliverable report: frame, profile, explore across all three levels, and communicate findings that survive interrogation.",
    },
  ],
};
