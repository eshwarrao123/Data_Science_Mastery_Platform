import type { Lesson } from "@/lib/curriculum/types";

export const projectEdaRealDataset: Lesson = {
  meta: {
    id: "data-analysis.eda.project-eda-real-dataset",
    slug: "project-eda-real-dataset",
    title: "🏗 Project: EDA on a Real Dataset",
    description:
      "The capstone: run the complete EDA workflow on a realistic e-commerce dataset — frame questions, audit and clean, explore univariate to multivariate, and deliver a findings report that survives interrogation.",
    estimatedTime: "90 mins",
    difficulty: "Intermediate",
    xpReward: 300,
    prerequisites: ["data-analysis.eda.multivariate-analysis"],
    masteryThreshold: 80,
  },

  blocks: [
    {
      id: "intro",
      type: "lesson-intro",
      tocLabel: "Introduction",
      intro: {
        hook: "Everything in this course was training for this: a raw dataset, a stakeholder question, and 90 minutes to produce findings someone will act on. No lesson scaffolding, no pre-cleaned columns — the full loop, the way it happens on the job. By the end you'll have run a complete professional EDA and written the report that proves it.",
        what: "A guided project: you receive a realistic multi-table e-commerce dataset (orders, customers) with authentic quality problems, a stakeholder brief ('what should we know about our business?'), and you execute the four-phase workflow end to end — frame, profile/clean, explore (univariate → bivariate → multivariate), communicate.",
        why: "Skills consolidate only under integration pressure. Separately you can groupby, merge, and spot skew; the job is doing them in the right order, catching the trap the data set for you, and producing findings with numbers and caveats. This project is the difference between knowing pandas and doing analysis.",
        whereUsed:
          "This IS the job: the first-week analysis at a new company, the due-diligence pass on a new data source, the take-home assignment in most data-analyst and data-scientist interviews.",
        objectives: [
          "Execute the full EDA workflow on multi-table data without scaffolding",
          "Clean with an audit trail: every fix counted and disclosed",
          "Join tables with row-count verification, then explore across all three levels",
          "Catch at least one planted artifact before it becomes a 'finding'",
          "Write a findings report: numbers, caveats, and next questions",
        ],
        realWorldApps: [
          {
            company: "Instacart",
            headline: "The take-home that mirrors this",
            detail:
              "Analyst interviews at marketplaces hand candidates order data and ask 'what do you see?' — evaluating exactly this project's loop: audit first, honest statistics, findings with caveats.",
          },
          {
            company: "Shopify",
            headline: "Merchant health analyses",
            detail:
              "Internal analysts run this workflow on merchant data weekly: join orders to accounts, clean, segment, and report — with mix effects and small-cell discipline deciding what ships to leadership.",
          },
          {
            company: "Flipkart",
            headline: "Category reviews",
            detail:
              "Quarterly category deep-dives are this project at scale: revenue concentration, segment behaviour, quality caveats on returns data — the same phases, bigger tables.",
          },
        ],
      },
    },

    {
      id: "theory",
      type: "theory-blocks",
      tocLabel: "Project Brief",
      blocks: [
        {
          type: "text",
          content:
            "THE BRIEF. You're the new analyst at a mid-size e-commerce company. Leadership asks: 'We have order data and customer data. Tell us what we should know.' Vague on purpose — framing is YOUR job. The deliverable: a short findings report (5–8 findings, each with a number and caveat) plus the quality issues you fixed along the way.",
        },
        {
          type: "code-note",
          code: `import pandas as pd
import numpy as np

orders = pd.DataFrame({
    'order_id':  [1001,1002,1003,1004,1005,1006,1007,1008,1008,1010,1011,1012],
    'cust_id':   ['C1','C2','C1','C3','C2','C9','C4','C3','C3','C1','C4','C2'],
    'amount':    ['1,200','450','2,100','800','-50','950','1,500','700','700','9000','650','1,100'],
    'channel':   ['web','app','web','APP','app','web',' web','app','app','web','app','Web'],
    'order_date':['2026-05-02','2026-05-03','2026-05-10','2026-05-11','2026-05-12',
                  '2026-05-15','2026-05-18','2026-05-20','2026-05-20','2026-05-21',
                  '2026-06-01','2026-06-02'],
})

customers = pd.DataFrame({
    'cust_id': ['C1','C2','C3','C4','C5'],
    'segment': ['premium','regular','regular','premium','regular'],
    'signup':  ['2025-01-10','2025-06-05','2026-04-28','2025-11-11','2026-05-30'],
})`,
          content:
            "Your data. Twelve orders, five customers — small enough to verify by hand, seeded with the course's real traps: amounts as strings with separators and a negative, channel labels with casing/whitespace variants, a duplicated order row, an orphan customer key, an extreme amount, and one customer with no orders.",
        },
        {
          type: "keypoint",
          title: "Phase 1 — Frame (do this before scrolling further)",
          content:
            "Turn the vague brief into 4–6 answerable questions. A solid set: Q1 How much revenue, and how concentrated across customers? Q2 Does order value differ by channel? Q3 Does behaviour differ by segment? Q4 Any trend across the period? Q5 What data quality risks limit the answers? Write hypotheses too — 'premium customers order larger' is now testable.",
        },
        {
          type: "keypoint",
          title: "Phase 2 — Profile & clean, in cleaning-module order",
          content:
            "Run the audit: shape, dtypes, isna, duplicated, value_counts on channel, describe on amount (after coercion). Then fix in order: types first (amount is strings with commas — clean-then-coerce), strings next (channel needs strip+lower), duplicates (order 1008 appears twice — exact copy, safe drop), then judge the invalid (-50: a refund miscoded? exclude with disclosure) and the extreme (9000: possible bulk order — investigate, don't delete). COUNT every fix for the report.",
        },
        {
          type: "keypoint",
          title: "Phase 3 — Explore, level by level",
          content:
            "Univariate: amount's shape (mean vs median — that 9000 will split them), channel and segment balance, date coverage. Bivariate: amount by channel (medians!), amount by segment (requires the merge — validate it: many_to_one, count rows before and after, count the orphan C9), orders over time. Multivariate: does the channel difference hold WITHIN each segment, or is it a mix effect? That's the conditioning check that separates this course's graduates from groupby operators.",
        },
        {
          type: "warning",
          title: "The planted traps — your checklist",
          content:
            "This dataset will punish shortcuts: 1) Sum amount without coercion → string concatenation. 2) groupby channel without string cleaning → 'web', ' web', 'Web', 'APP' as separate groups. 3) Skip dedup → order 1008 double-counts 700. 4) Keep -50 silently → revenue understated with no disclosure. 5) Report mean order value with the 9000 in → inflated by ~60%. 6) Inner-join to customers → C9's order silently vanishes. 7) Compare channels without the segment split → possible mix story. Each trap is a lesson from this course; finding all seven is the real mastery test.",
        },
        {
          type: "keypoint",
          title: "Phase 4 — Communicate",
          content:
            "The report format: one line per finding — claim, number, caveat. Example: 'Revenue is highly concentrated: the top customer (C1) drives 58% of clean revenue [caveat: 11-order sample, one 9000 bulk order pending verification].' Plus a quality appendix: what you fixed, what you excluded, what you couldn't verify. End with next questions ('why does C9 exist in orders but not customers?').",
        },
        {
          type: "analogy",
          title: "The flight check, not the flight school",
          content:
            "Every previous lesson taught one manoeuvre in isolation — takeoffs, stalls, crosswind landings. A check-ride strings them together over unfamiliar terrain while the examiner watches whether you run your checklists under pressure. This dataset is your terrain; the seven traps are the examiner's engine-failure card. Pass here and the license means something.",
        },
        {
          type: "expandable",
          title: "After this project: making it yours",
          content:
            "The synthetic dataset proves the loop; a real one builds the portfolio. Repeat this project this week on a public dataset — Kaggle's e-commerce or Olist datasets, NYC taxi trips, any city's open data portal. Same phases, same discipline: written questions first, audit with counted fixes, three exploration levels, findings with caveats. Two additions at real scale: sample intelligently while exploring (df.sample(100_000)) and let value_counts guide which segments deserve depth. Publish the notebook with the REPORT at the top, not buried at the bottom — recruiters read the first screen. Three such projects are a stronger portfolio than any certificate.",
        },
      ],
    },

    {
      id: "diagram",
      type: "interactive-diagram",
      tocLabel: "Visual Learning",
      visual: {
        kind: "flow",
        title: "The project, phase by phase",
        caption: "Click each phase — the full course compressed into one working session.",
        nodes: [
          { id: "frame", label: "Frame", sublabel: "brief → 4-6 questions", detail: "Convert 'tell us what we should know' into answerable questions with hypotheses. 15 minutes, zero pandas.", x: 10, y: 15, accent: true },
          { id: "audit", label: "Audit", sublabel: "the 5-command ritual", detail: "shape, info, isna, duplicated, describe + value_counts. Output: the trap list — string amounts, dirty channels, a dupe, a negative, an outlier, an orphan key.", x: 32, y: 8, accent: true },
          { id: "clean", label: "Clean", sublabel: "types → strings → dupes → invalid", detail: "The cleaning-module order, every fix counted: coerce amounts, normalise channels, drop the exact-dupe, exclude -50 with disclosure, flag 9000 for verification.", x: 54, y: 15, accent: false },
          { id: "join", label: "Join", sublabel: "merge + validate", detail: "Left-join orders to customers, validate='many_to_one', count rows before/after, quantify the C9 orphan. The merge lesson's discipline, live.", x: 74, y: 30, accent: false },
          { id: "explore", label: "Explore", sublabel: "uni → bi → multi", detail: "Shape of amount (median vs mean), channel and segment comparisons with honest statistics, then the conditioning check: does the channel story hold within segments?", x: 60, y: 60, accent: true },
          { id: "report", label: "Report", sublabel: "findings + caveats + next", detail: "5–8 one-line findings with numbers and caveats, a quality appendix, and next questions. The deliverable is this, not the notebook.", x: 30, y: 72, accent: true },
        ],
        edges: [
          { from: "frame", to: "audit" },
          { from: "audit", to: "clean" },
          { from: "clean", to: "join" },
          { from: "join", to: "explore" },
          { from: "explore", to: "report" },
          { from: "report", to: "frame", label: "next questions" },
        ],
      },
    },

    {
      id: "worked-examples",
      type: "worked-examples",
      tocLabel: "Guided Walkthrough",
      examples: [
        {
          difficulty: "Easy",
          title: "Step 1 — The audit finds the traps",
          scenario: "Before any analysis: run the ritual and list what's wrong.",
          steps: [
            { code: "print(orders['amount'].dtype)\nprint(orders.duplicated().sum())", explanation: "amount is object — strings with commas and (peek at the values) a negative. And one fully duplicated row lurks (order 1008)." },
            { code: "print(orders['channel'].nunique(), sorted(orders['channel'].unique()))", explanation: "Six 'channels' for what should be two: ' web', 'APP', 'Web', 'app', 'web' — casing and whitespace variants, exactly the string-cleaning lesson's target." },
            { code: "orphans = ~orders['cust_id'].isin(customers['cust_id'])\nprint(orders.loc[orphans, 'cust_id'].unique())", explanation: "C9 places orders but doesn't exist in the customer table — an orphan key that an inner join would silently swallow. The audit is complete: six issues logged before a single statistic was computed." },
          ],
          output: "object\n1\n6 [' web', 'APP', 'Web', 'app', 'web']\n['C9']",
        },
        {
          difficulty: "Medium",
          title: "Step 2 — Clean with a counted audit trail",
          scenario: "Fix in the canonical order; count everything for the report.",
          steps: [
            { code: "orders['amount'] = pd.to_numeric(\n    orders['amount'].str.replace(',', '', regex=False), errors='coerce')\norders['channel'] = orders['channel'].str.strip().str.lower()\norders['order_date'] = pd.to_datetime(orders['order_date'])", explanation: "Types first: strip separators then coerce (zero coercion failures — verify!), normalise channel (6 variants → 2), parse dates. The type-coercion and string-cleaning lessons in three lines." },
            { code: "before = len(orders)\norders = orders.drop_duplicates()\ndupes_dropped = before - len(orders)", explanation: "Dedup after cleaning (so normalised strings compare correctly). Exactly one exact-copy row goes — order 1008's double-count of 700 is prevented, and the count is recorded." },
            { code: "refunds = (orders['amount'] < 0).sum()\nclean = orders[orders['amount'] > 0].copy()\nprint(dupes_dropped, refunds, len(clean), clean['channel'].nunique())", explanation: "The -50 is set aside as a suspected miscoded refund — excluded WITH disclosure, not silently. Final state: 10 analysable orders, 2 clean channels, and an audit trail: 1 dupe dropped, 1 refund excluded, 9000 flagged for verification." },
          ],
          output: "1 1 10 2",
        },
        {
          difficulty: "Medium",
          title: "Step 3 — Join with the merge discipline",
          scenario: "Enrich orders with segments — without losing C9 or fanning out.",
          steps: [
            { code: "df = pd.merge(clean, customers, on='cust_id', how='left',\n              validate='many_to_one', indicator=True)\nassert len(df) == len(clean)", explanation: "Left join (keep every order), validate against lookup duplicates, assert the row count held. The merging lesson's three defences in two lines." },
            { code: "print(df['_merge'].value_counts().to_dict())", explanation: "The match report: 9 matched, 1 left_only — C9's order survives with NaN segment instead of vanishing. An inner join would have silently deleted 950 of revenue." },
            { code: "df['segment'] = df['segment'].fillna('unknown')\nprint(df.groupby('segment')['amount'].sum().to_dict())", explanation: "The orphan becomes an explicit 'unknown' segment — visible in every downstream cut, and finding #7 for the report: 'orders exist for customers missing from the customer table'." },
          ],
          output: "{'both': 9, 'left_only': 1}\n{'premium': 14450.0, 'regular': 3050.0, 'unknown': 950.0}",
        },
        {
          difficulty: "Hard",
          title: "Step 4 — Explore: the outlier splits mean from median",
          scenario: "Univariate discipline decides which statistics the report may quote.",
          steps: [
            { code: "print(round(df['amount'].mean()), df['amount'].median())", explanation: "Mean 1845 vs median 1025 — the 9000 order drags the mean 80% above typical. The report speaks in medians; the mean appears only WITH the outlier caveat." },
            { code: "print(df.groupby('channel')['amount'].agg(['median','count']).to_string())", explanation: "Channel comparison, honestly: web's median order (1350) is roughly double app's (675) — and the counts (5 apiece) ship with it, because 5-row groups are small." },
            { code: "top_share = df.groupby('cust_id')['amount'].sum().max() / df['amount'].sum()\nprint(f'{top_share:.0%}')", explanation: "Concentration: the top customer (C1, boosted by the 9000 order) is 67% of clean revenue. Finding, number, and its caveat all in one: 'pending bulk-order verification'." },
          ],
          output: "1845 1025.0\n         median  count\nchannel               \napp         675      5\nweb        1350      5\n67%",
        },
        {
          difficulty: "Industry Example",
          title: "Step 5 — The conditioning check and the report",
          scenario: "Before shipping 'web orders are bigger', run the multivariate lesson's check — then write the deliverable.",
          steps: [
            { code: "grid = df.pivot_table(index='segment', columns='channel',\n                      values='amount', aggfunc='median')\nprint(grid.to_string())", explanation: "Condition the channel finding on segment. Within premium, web >> app; within regular the gap narrows — and premium customers skew web. Part of the aggregate channel gap is segment mix: the finding survives, weakened and better understood." },
            { code: "report = [\n 'Revenue concentrated: top customer = 67% of clean revenue [9000 bulk order unverified]',\n 'Web median order ~2x app (1350 vs 675) [n=5/channel; partly premium-mix driven]',\n 'Premium segment = 78% of identified revenue',\n 'QUALITY: 1 duplicate dropped, 1 negative amount excluded, 1 orphan customer (C9)',\n]\nprint(len(report), 'lines')", explanation: "The deliverable: findings with numbers AND caveats, quality disclosed as first-class content. Short enough to read, honest enough to survive a sharp VP's questions." },
            { code: "next_questions = ['Verify order 1010 (9000): bulk or typo?',\n                  'Why is C9 missing from the customer table?',\n                  'Was the -50 a refund? How are refunds logged?']\nprint(len(next_questions), 'follow-ups')", explanation: "The loop closes: three next questions, each born from a trap the workflow caught. An EDA that ends with sharper questions has done its job — and so have you. Course complete." },
          ],
          output: "channel     app     web\nsegment                \npremium   675.0  2100.0\nregular   700.0  1025.0\nunknown     NaN   950.0\n4 lines\n3 follow-ups",
        },
      ],
    },

    {
      id: "inline-practice",
      type: "inline-code",
      tocLabel: "Practice Coding",
      coding: {
        language: "python",
        filename: "project_capstone.py",
        instructions:
          "Run the core of the project pipeline yourself: clean the amounts and channels, drop duplicates, exclude negatives, and produce the median order value per (cleaned) channel.",
        starterCode: `import pandas as pd

orders = pd.DataFrame({
    'order_id': [1, 2, 3, 3, 5, 6],
    'amount':   ['1,200', '450', '700', '700', '-50', '2,000'],
    'channel':  ['web', 'APP', ' web', ' web', 'app', 'Web'],
})

# TODO 1: amount -> numeric (strip commas, coerce)
orders['amount'] = ___

# TODO 2: channel -> stripped + lowercase
orders['channel'] = ___

# TODO 3: drop exact duplicate rows, then keep only amount > 0
clean = ___

# TODO 4: median amount per channel (a Series)
result = ___

print(len(clean))
print(result.to_dict())`,
        solutionCode: `import pandas as pd

orders = pd.DataFrame({
    'order_id': [1, 2, 3, 3, 5, 6],
    'amount':   ['1,200', '450', '700', '700', '-50', '2,000'],
    'channel':  ['web', 'APP', ' web', ' web', 'app', 'Web'],
})

orders['amount'] = pd.to_numeric(
    orders['amount'].str.replace(',', '', regex=False), errors='coerce')

orders['channel'] = orders['channel'].str.strip().str.lower()

clean = orders.drop_duplicates()
clean = clean[clean['amount'] > 0]

result = clean.groupby('channel')['amount'].median()

print(len(clean))
print(result.to_dict())`,
        expectedOutput: "4\n{'app': 450.0, 'web': 1200.0}",
        hints: [
          "Task 1: .str.replace(',', '', regex=False) then pd.to_numeric(..., errors='coerce') — the clean-then-coerce idiom.",
          "Task 2: .str.strip().str.lower() — do this BEFORE dedup so ' web' and 'web' rows compare equal.",
          "Task 3: drop_duplicates() first (the two order-3 rows are now exact copies), then the mask clean['amount'] > 0 removes the -50.",
          "Six rows → one dupe dropped → one negative excluded → 4 rows. Web's amounts are 1200, 700, 2000 (median 1200); app's is 450.",
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
          id: "pda22_mcq_01",
          difficulty: "Easy",
          question: "In the project pipeline, why must channel strings be cleaned BEFORE dropping duplicates?",
          options: [
            "drop_duplicates raises on dirty strings",
            "Rows differing only by ' web' vs 'web' aren't exact copies until normalised — dedup would miss them (or keep phantom variants apart)",
            "String cleaning is faster on duplicated data",
            "Order doesn't matter",
          ],
          correctIndex: 1,
          explanation:
            "duplicated() compares exact values. Cleaning first makes true copies textually identical, so the dedup catches them — the cleaning-module ordering (structure → types → strings → dupes) exists precisely for these dependencies.",
        },
        {
          type: "mcq",
          id: "pda22_mcq_02",
          difficulty: "Easy",
          question: "The -50 amount was excluded 'with disclosure'. What does disclosure add over just filtering it out?",
          options: [
            "Nothing — the number is gone either way",
            "The report states what was excluded, why, and its size — so readers know revenue figures omit a suspected refund and can challenge the judgement",
            "It restores the row later automatically",
            "It's a legal requirement",
          ],
          correctIndex: 1,
          explanation:
            "Silent exclusions make analyses unauditable: two analysts get different totals and nobody knows why. Counted, disclosed exclusions ('1 negative amount excluded, -50, suspected miscoded refund') keep the numbers reproducible and the judgement reviewable.",
        },
        {
          type: "mcq",
          id: "pda22_mcq_03",
          difficulty: "Medium",
          question: "Why did the project use a LEFT join (not inner) from orders to customers?",
          options: [
            "Left joins are faster",
            "C9's order would silently vanish under an inner join, understating revenue; the left join keeps it, and fillna('unknown') makes the gap a visible segment",
            "Inner joins can't handle string keys",
            "The customer table was too small for inner",
          ],
          correctIndex: 1,
          explanation:
            "Orders are the facts being counted — losing one to an incomplete lookup corrupts every total. The left join + explicit 'unknown' segment keeps totals honest AND turns the data gap itself into a reportable finding.",
        },
        {
          type: "scenario",
          id: "pda22_sc_01",
          difficulty: "Medium",
          scenario:
            "A fellow analyst runs the same project but skips the univariate step, reporting 'average order value: 1,845'. Your median-based report says typical orders are 1,025. Leadership asks why the numbers disagree.",
          question: "What's the correct explanation?",
          options: [
            "One of the two computed incorrectly",
            "Both are computed correctly: one 9,000 outlier inflates the mean ~80% above the typical order; the median resists it — and the choice between them should have been made by looking at the distribution's shape first",
            "Means and medians always differ this much",
            "The datasets must have been different",
          ],
          correctIndex: 1,
          explanation:
            "This is the univariate lesson operating at report level: skew + outlier make the mean describe no actual order. The disagreement isn't arithmetic — it's that one analyst checked the shape before choosing a statistic and one didn't.",
        },
        {
          type: "coding",
          id: "pda22_code_01",
          difficulty: "Hard",
          prompt:
            "Complete the merge step with full discipline: left-join orders to customers on cust_id with validate and indicator, then print the number of unmatched orders and total revenue including them.\n\norders = pd.DataFrame({'cust_id':['C1','C2','C9'], 'amount':[100.0, 200.0, 300.0]})\ncustomers = pd.DataFrame({'cust_id':['C1','C2'], 'segment':['premium','regular']})",
          starterCode:
            "import pandas as pd\n\norders = pd.DataFrame({'cust_id':['C1','C2','C9'], 'amount':[100.0, 200.0, 300.0]})\ncustomers = pd.DataFrame({'cust_id':['C1','C2'], 'segment':['premium','regular']})\n\n# Your code here\n",
          solutionCode:
            "import pandas as pd\n\norders = pd.DataFrame({'cust_id':['C1','C2','C9'], 'amount':[100.0, 200.0, 300.0]})\ncustomers = pd.DataFrame({'cust_id':['C1','C2'], 'segment':['premium','regular']})\n\ndf = pd.merge(orders, customers, on='cust_id', how='left',\n              validate='many_to_one', indicator=True)\nprint((df['_merge'] == 'left_only').sum())\nprint(df['amount'].sum())",
          expectedOutput: "1\n600.0",
          tests: [
            { name: "Join discipline", description: "how='left' with validate='many_to_one' and indicator=True — the three defences from the merge lesson" },
            { name: "Nothing lost", description: "C9's 300 stays in the total (600.0); the unmatched count (1) is measured, not discovered later" },
          ],
        },
        {
          type: "mcq",
          id: "pda22_mcq_04",
          difficulty: "Challenge",
          question: "The pivot showed web's channel advantage shrinks within the regular segment. What is the honest way to report the channel finding?",
          options: [
            "Drop the finding — it failed the check",
            "Report only the aggregate: 'web orders are 2× app'",
            "Report the finding WITH the conditioning result: web's median lead is real but partly reflects premium customers preferring web — the within-segment gap is smaller [n=5/channel]",
            "Report only the premium segment's numbers",
          ],
          correctIndex: 2,
          explanation:
            "The finding neither vanished (pure confounding) nor held unchanged — conditioning revealed a mix component. Honest reporting carries both levels and the sample-size caveat; that nuance is exactly what distinguishes an analysis from a groupby printout.",
        },
      ],
    },

    {
      id: "interview-questions",
      type: "interview-questions",
      tocLabel: "Interview Prep",
      questions: [
        {
          question: "You're handed a take-home: order data, 'tell us something interesting', 48 hours. How do you structure your work and your submission?",
          answer:
            "I run the four-phase loop with the clock in mind. Hour one: framing — 4–6 questions the business would pay to answer (revenue concentration, segment behaviour, trend, quality risks), written in the notebook's first cell, because reviewers grade structure before statistics. Then the audit and cleaning with a counted trail: dtype fixes, string normalisation, dedup, invalid-value judgements — each fix one line in a quality log, since take-homes routinely plant traps and finding them IS the test. Exploration goes univariate (shapes decide mean-vs-median), bivariate (the segment and channel cuts with counts), then at least one conditioning check on my headline finding, because a finding that survives Simpson-checking is the differentiator. The submission leads with the report: 5–8 findings, each one sentence with a number and caveat, the quality appendix, and next questions — code after, not instead. What I deliberately don't do: forty charts, causal verbs, or means on distributions I never looked at. Reviewers can't distinguish those from not knowing better.",
        },
        {
          question: "Across this whole course, what's the single discipline that most improves analysis quality, and why?",
          answer:
            "Auditing before analysing — in the broad sense: never computing on data whose shape, types, and quirks I haven't checked. It compounds across every module. The five-command audit catches the string-typed amounts before they concatenate, the channel variants before they split groups, the duplicate before it double-counts, the orphan key before a join swallows it. Univariate shape-checking is the same discipline pointed at distributions — it catches the outlier before the mean ships. The conditioning check is the discipline pointed at findings — it catches the mix effect before the headline. In each case the pattern is identical: a cheap, systematic look BEFORE the expensive conclusion, converting silent errors into visible, countable ones. Its absence is also the common thread in every analysis disaster I've described in interviews: nobody looked before computing. The habit costs minutes; skipping it costs credibility — usually in a meeting, three weeks later, when someone asks why revenue doesn't reconcile.",
        },
        {
          question: "How would you extend this project's analysis if you had the company's full data and a month?",
          answer:
            "Three directions, in order of value. First, depth on the raised questions: verify the bulk order and refund handling with finance, resolve the orphan-customer pipeline gap with engineering, and rebuild the numbers on the corrected base — quality work is analysis work at real companies. Second, time: with more than one month of orders I'd add the window-function layer — rolling revenue trends, cohort retention by signup month, week-over-week growth with shift(7) seasonality discipline — because trends answer 'is this getting better?', which snapshots can't. Third, graduation from slicing to modelling: my segment cuts condition on one or two variables before cells thin out; with the full customer base I'd fit simple models (regression for order value, a churn classifier) that condition on many variables simultaneously, using the EDA findings as feature candidates — and the leakage discipline from window functions when any feature involves time. Throughout, the deliverable cadence stays the same: findings with numbers and caveats shipped weekly, not a month-end reveal — because analysis compounds when stakeholders can steer it.",
        },
      ],
    },

    {
      id: "common-mistakes",
      type: "callout",
      variant: "warning",
      title: "Common Mistakes to Avoid",
      content:
        "1) Diving into groupbys before the audit — this dataset punishes it seven ways. 2) Cleaning without counting: 'I fixed some stuff' is not an audit trail. 3) Dropping the -50 and the 9000 with the same reflex — one is invalid (exclude, disclose), the other is possible (verify, keep pending). 4) Inner-joining away the orphan order and never noticing revenue shrank. 5) Reporting means on a distribution with an 80% mean-median gap. 6) Shipping the channel finding without the segment conditioning check. 7) Submitting the notebook as the deliverable — the report leads, code follows. 8) Ending without next questions: an EDA that raises none has looked at too little.",
    },

    {
      id: "ai-tutor",
      type: "callout",
      variant: "tip",
      title: "Ask the AI Tutor",
      content:
        "Try these prompts in the AI Tutor panel: • 'Grade my project report draft against the findings+caveats format.' • 'I found 5 of the 7 planted traps — quiz me toward the rest.' • 'Generate a fresh messy dataset with different traps and let me run the loop again.' • 'Roleplay the VP: interrogate my findings and caveats.' • 'Help me plan the Kaggle version of this project for my portfolio.'",
    },

    {
      id: "glossary",
      type: "callout",
      variant: "info",
      title: "Glossary",
      content:
        "Capstone — an integrative project exercising a course's full skill set. Stakeholder brief — the (often vague) request an analysis must convert into questions. Audit trail — the counted record of every fix and exclusion. Orphan key — a foreign key with no match in the lookup table. Quality appendix — the report section disclosing fixes, exclusions, and unverifiable items. Findings report — claim + number + caveat, 5–8 lines, decision-ready. Take-home — the interview format this project mirrors. Conditioning check — re-testing a finding within third-variable levels before shipping it.",
    },

    {
      id: "resources",
      type: "callout",
      variant: "info",
      title: "Recommended Resources",
      content:
        "• Datasets for round two: Kaggle's Olist e-commerce set, NYC TLC taxi trips, or any open-data portal — pick one with obvious business questions. • Read: a well-regarded public EDA notebook (Kaggle grandmaster kernels) and study its STRUCTURE, not its charts — framing, audit, levels, report. • Practice: re-run this project's loop on your chosen dataset this week; publish with the findings report as the first screen. • Next in DSM: the Data Analysis domain is complete — the SQL domain teaches the same querying instincts where most company data actually lives.",
    },

    {
      id: "recap",
      type: "recap",
      tocLabel: "Recap",
      content:
        "✓ The full loop ran end to end: vague brief → framed questions → counted cleaning → validated join → three-level exploration → findings with caveats.\n✓ Seven traps, seven course lessons: string amounts (coercion), channel variants (string cleaning), the dupe (dedup), the -50 (invalid values), the 9000 (outlier judgement), the orphan (join discipline), the mix effect (conditioning).\n✓ Every fix counted, every exclusion disclosed, every headline statistic chosen by the distribution's shape.\n✓ The deliverable is the report — findings, numbers, caveats, quality appendix, next questions — not the notebook.\n✓ Repeat on a real public dataset this week; three such projects are a portfolio.\n\n🎓 Data Analysis domain complete. You can load, clean, transform, and interrogate tabular data like a professional. Next up: the SQL domain — the same analytical instincts, applied where most of the world's data actually lives.",
    },
  ],
};
