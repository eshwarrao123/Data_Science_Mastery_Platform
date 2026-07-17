import type { Lesson } from "@/lib/curriculum/types";

export const sortingAndRanking: Lesson = {
  meta: {
    id: "data-analysis.pandas-core.sorting-and-ranking",
    slug: "sorting-and-ranking",
    title: "Sorting & Ranking",
    description:
      "Order rows with sort_values, assign competition ranks with rank, and pull top and bottom performers with nlargest — the fast path to leaderboards and priorities.",
    estimatedTime: "25 mins",
    difficulty: "Beginner",
    xpReward: 50,
    prerequisites: ["data-analysis.pandas-core.handling-missing-data"],
    masteryThreshold: 80,
  },

  blocks: [
    {
      id: "intro",
      type: "lesson-intro",
      tocLabel: "Introduction",
      intro: {
        hook: "Which product sells most? Who are your top ten customers? What's the slowest step in the pipeline? Every one of these is a sorting question — and pandas answers them in a single line. Once you can order and rank data on demand, 'what's the best/worst?' stops being a chore and becomes a reflex.",
        what: "Sorting reorders rows by the values in one or more columns. Ranking assigns each row a position number within a column. Together they turn an unordered table into a leaderboard, a priority list, or a top-N shortlist.",
        why: "Decisions are made at the extremes — the best customers, the worst-performing regions, the highest-risk transactions. Sorting surfaces those extremes instantly, and ranking lets you compare positions even when the raw values are hard to interpret.",
        whereUsed:
          "Building leaderboards, ranking search results, prioritising a backlog, finding outliers at the top and bottom of a distribution, and preparing ordered data for time-series or window operations.",
        objectives: [
          "Sort rows by one column with sort_values, ascending or descending",
          "Sort by multiple columns with tie-breaking priority",
          "Assign ranks with rank() and choose a tie-handling method",
          "Pull top and bottom rows efficiently with nlargest and nsmallest",
          "Sort by the index with sort_index and reset order with reset_index",
        ],
        realWorldApps: [
          {
            company: "YouTube",
            headline: "Trending video ranking",
            detail:
              "Videos are ranked by a score combining views, watch-time, and recency; sort_values on that score, descending, produces the trending shelf you see on the homepage.",
          },
          {
            company: "Zalando",
            headline: "Best-seller shortlists",
            detail:
              "Merchandising teams call nlargest(20, 'units_sold') to pull the top twenty products per category in milliseconds, far faster than sorting the entire multi-million-row catalogue.",
          },
          {
            company: "Formula 1 teams",
            headline: "Lap-time leaderboards",
            detail:
              "Engineers rank drivers by lap time with rank(method='min') so tied laps share a position, matching how race classifications actually work.",
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
            "sort_values(by='col') reorders the rows so that column runs from smallest to largest. Pass ascending=False for largest-first. The row index travels with the data, so labels stay attached to their rows.",
        },
        {
          type: "code-note",
          code: `import pandas as pd
df = pd.DataFrame({'name':['Amara','Jamal','Priya'], 'sales':[120, 300, 200]})

top = df.sort_values(by='sales', ascending=False)
print(top['name'].tolist())   # highest sales first`,
          content:
            "ascending=False puts the biggest sales at the top. The result is a new DataFrame; the original df is untouched unless you reassign or pass inplace=True.",
        },
        {
          type: "text",
          content:
            "To sort by more than one column, pass a list. pandas sorts by the first column, breaking ties with the second, and so on. You can give each column its own direction with a list of booleans.",
        },
        {
          type: "code-note",
          code: `df.sort_values(by=['region', 'sales'],
               ascending=[True, False])`,
          content:
            "This orders regions alphabetically (ascending), and within each region puts the highest sales first (descending). The ascending list lines up position-by-position with the by list.",
        },
        {
          type: "keypoint",
          title: "nlargest beats sort-then-head",
          content:
            "To get the top 10, df.nlargest(10, 'sales') is both clearer and faster than df.sort_values('sales', ascending=False).head(10) — it finds the top 10 without fully sorting every row. nsmallest does the same for the bottom.",
        },
        {
          type: "text",
          content:
            "Ranking assigns each value a position within its column. rank() returns a number for every row; the method argument decides how ties are handled — 'average' (default), 'min', 'max', 'dense', or 'first'.",
        },
        {
          type: "analogy",
          title: "Ranking ties: race vs textbook",
          content:
            "Two runners cross the line together in second place. In a real race (method='min') they both get rank 2 and the next runner is 4 — positions are skipped. In dense ranking (method='dense') they get 2 and the next is 3 — no gaps, like ranking distinct tiers. The default 'average' gives both 2.5, the mean of the positions they occupy. Pick the one that matches how your domain counts ties.",
        },
        {
          type: "warning",
          title: "Sorting doesn't reset the index — and NaNs sink",
          content:
            "After sort_values, the index is shuffled to match the new order; call reset_index(drop=True) if you need clean 0-based positions. Also, by default missing values are placed last regardless of sort direction (na_position='last'); pass na_position='first' to change that. Don't assume the first row is the smallest if NaNs are present.",
        },
        {
          type: "expandable",
          title: "Ascending vs descending ranks",
          content:
            "By default rank() ranks smallest-as-1. For a leaderboard where the largest value should be rank 1 (top seller, fastest lap only if lower is better), pass ascending=False so the biggest value gets rank 1. Combining rank(method='min', ascending=False) is the standard 'competition leaderboard' recipe: highest value is rank 1, ties share the rank, and the next distinct value skips the tied positions.",
        },
      ],
    },

    {
      id: "diagram",
      type: "interactive-diagram",
      tocLabel: "Visual Learning",
      visual: {
        kind: "comparison",
        title: "Ordering tools and how they treat ties",
        caption:
          "Click each tool to see what it returns and when to choose it.",
        nodes: [
          { id: "sortval", label: "sort_values", sublabel: "reorder rows", detail: "Reorders the whole DataFrame by one or more columns. by=[...] with ascending=[...] gives per-column direction. Index travels with rows.", x: 20, y: 25, accent: true },
          { id: "sortidx", label: "sort_index", sublabel: "reorder by labels", detail: "Sorts by the index rather than a column. Useful after grouping or to restore chronological order on a date index.", x: 50, y: 12, accent: false },
          { id: "nlargest", label: "nlargest / nsmallest", sublabel: "top / bottom N", detail: "Returns the N biggest or smallest rows by a column without a full sort — faster and clearer than sort().head(N).", x: 80, y: 25, accent: true },
          { id: "rank", label: "rank()", sublabel: "position per row", detail: "Assigns each row a rank within its column. The method argument controls tie handling; ascending flips which end is rank 1.", x: 35, y: 60, accent: true },
          { id: "min", label: "method='min'", sublabel: "competition rank", detail: "Tied values share the lowest position; the next value skips the gap. Matches sports and leaderboards.", x: 65, y: 60, accent: false },
          { id: "dense", label: "method='dense'", sublabel: "no gaps", detail: "Tied values share a rank and the next value increments by one — ranks distinct tiers with no skipped numbers.", x: 50, y: 88, accent: false },
        ],
        edges: [
          { from: "sortval", to: "nlargest", label: "top-N shortcut" },
          { from: "sortval", to: "sortidx", label: "vs by index" },
          { from: "rank", to: "min", label: "tie method" },
          { from: "rank", to: "dense", label: "tie method" },
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
          title: "Sort rows by a column",
          scenario: "Order salespeople from highest to lowest sales.",
          steps: [
            { code: "import pandas as pd\ndf = pd.DataFrame({'name':['Amara','Jamal','Priya'], 'sales':[120, 300, 200]})", explanation: "Three salespeople with unordered sales figures." },
            { code: "ranked = df.sort_values('sales', ascending=False)", explanation: "ascending=False sorts largest first: Jamal 300, Priya 200, Amara 120." },
            { code: "print(ranked['name'].tolist())", explanation: "Reading the name column in the new order gives the leaderboard." },
          ],
          output: "['Jamal', 'Priya', 'Amara']",
        },
        {
          difficulty: "Easy",
          title: "Top-N with nlargest",
          scenario: "Grab the two best-selling products from a catalogue.",
          steps: [
            { code: "df = pd.DataFrame({'product':['A','B','C','D'], 'units':[50, 300, 120, 300]})", explanation: "Four products; B and D are tied at 300 units." },
            { code: "top2 = df.nlargest(2, 'units')", explanation: "nlargest(2, 'units') returns the two rows with the most units without sorting the whole frame. B and D both have 300 — nlargest keeps them in their original relative order." },
            { code: "print(top2['product'].tolist())", explanation: "The top two by units are B and D." },
          ],
          output: "['B', 'D']",
        },
        {
          difficulty: "Medium",
          title: "Multi-column sort with tie-breaking",
          scenario: "Order employees by department alphabetically, then by salary highest-first within each department.",
          steps: [
            { code: "df = pd.DataFrame({\n    'dept':['Eng','HR','Eng','HR'],\n    'name':['Wei','Bob','Ada','Cara'],\n    'salary':[95, 60, 110, 65]\n})", explanation: "Two departments, two people each." },
            { code: "out = df.sort_values(by=['dept','salary'], ascending=[True, False])", explanation: "First key dept ascending groups Eng before HR; second key salary descending puts the higher earner first inside each department." },
            { code: "print(out['name'].tolist())", explanation: "Eng: Ada (110) then Wei (95); HR: Cara (65) then Bob (60)." },
          ],
          output: "['Ada', 'Wei', 'Cara', 'Bob']",
        },
        {
          difficulty: "Hard",
          title: "Competition ranking with ties",
          scenario: "Assign leaderboard positions to scores where two players tie, using competition rules (tied players share a position, the next position is skipped).",
          steps: [
            { code: "df = pd.DataFrame({'player':['P1','P2','P3','P4'], 'score':[90, 75, 90, 60]})", explanation: "P1 and P3 both scored 90 — the top score." },
            { code: "df['rank'] = df['score'].rank(method='min', ascending=False)", explanation: "ascending=False makes the highest score rank 1. method='min' gives both 90s rank 1, and the next score (75) becomes rank 3 — position 2 is skipped, exactly like a race." },
            { code: "print(df[['player','rank']].values.tolist())", explanation: "P1 and P3 share rank 1; P2 is 3; P4 is 4." },
          ],
          output: "[['P1', 1.0], ['P2', 3.0], ['P3', 1.0], ['P4', 4.0]]",
        },
        {
          difficulty: "Industry Example",
          title: "Prioritising a support queue",
          scenario: "A data analyst at a SaaS helpdesk must order open tickets for the team: highest-severity first, and within the same severity, oldest ticket first so nothing languishes.",
          steps: [
            { code: "import pandas as pd\ndf = pd.DataFrame({\n    'ticket':  ['T1','T2','T3','T4'],\n    'severity':[2, 3, 3, 1],\n    'age_hrs': [5, 2, 30, 48],\n})", explanation: "Severity 3 is most urgent here. T2 and T3 share severity 3 but differ in age." },
            { code: "queue = df.sort_values(by=['severity','age_hrs'], ascending=[False, False])", explanation: "Primary key severity descending puts the 3s at the top; secondary key age descending puts the older of the two tied tickets first, so T3 (30h) precedes T2 (2h)." },
            { code: "queue = queue.reset_index(drop=True)\nprint(queue['ticket'].tolist())", explanation: "reset_index(drop=True) renumbers the queue 0,1,2,3 for a clean work order. The team works T3, then T2, then T1, then T4." },
          ],
          output: "['T3', 'T2', 'T1', 'T4']",
        },
      ],
    },

    {
      id: "inline-practice",
      type: "inline-code",
      tocLabel: "Practice Coding",
      coding: {
        language: "python",
        filename: "sorting_practice.py",
        instructions:
          "A streaming service wants a quick leaderboard from its shows table. Complete the sorting and ranking tasks.",
        starterCode: `import pandas as pd

df = pd.DataFrame({
    'show':   ['Alpha','Bravo','Cosmo','Delta','Echo'],
    'hours':  [1200, 3400, 3400, 900, 2100],
    'genre':  ['drama','comedy','drama','comedy','drama'],
})

# TODO 1: The 3 shows with the most watch hours (a DataFrame)
top3 = ___

# TODO 2: A 'rank' column: highest hours = rank 1, ties share the rank,
#         next distinct value skips positions (competition ranking)
df['rank'] = ___

# TODO 3: Sort by genre (A-Z), then hours (high to low)
by_genre = ___

print(top3['show'].tolist())
print(df['rank'].tolist())
print(by_genre['show'].tolist())`,
        solutionCode: `import pandas as pd

df = pd.DataFrame({
    'show':   ['Alpha','Bravo','Cosmo','Delta','Echo'],
    'hours':  [1200, 3400, 3400, 900, 2100],
    'genre':  ['drama','comedy','drama','comedy','drama'],
})

top3 = df.nlargest(3, 'hours')
df['rank'] = df['hours'].rank(method='min', ascending=False)
by_genre = df.sort_values(by=['genre','hours'], ascending=[True, False])

print(top3['show'].tolist())
print(df['rank'].tolist())
print(by_genre['show'].tolist())`,
        expectedOutput:
          "['Bravo', 'Cosmo', 'Echo']\n[4.0, 1.0, 1.0, 5.0, 3.0]\n['Bravo', 'Delta', 'Cosmo', 'Echo', 'Alpha']",
        hints: [
          "Task 1: df.nlargest(3, 'hours') returns the top three rows by hours. Bravo and Cosmo tie at 3400, then Echo at 2100.",
          "Task 2: rank the hours column with method='min' and ascending=False so the biggest is rank 1 and ties share it.",
          "Task 3: sort_values(by=['genre','hours'], ascending=[True, False]) — comedy before drama, high hours first within each.",
          "top3 = df.nlargest(3, 'hours'); df['rank'] = df['hours'].rank(method='min', ascending=False); by_genre = df.sort_values(by=['genre','hours'], ascending=[True, False])",
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
          id: "pda06_mcq_01",
          difficulty: "Easy",
          question: "Which call sorts a DataFrame so the largest 'score' is first?",
          options: [
            "df.sort_values('score')",
            "df.sort_values('score', ascending=False)",
            "df.sort_index()",
            "df.rank('score')",
          ],
          correctIndex: 1,
          explanation:
            "sort_values defaults to ascending (smallest first); ascending=False reverses it so the largest is on top. sort_index orders by labels, and rank assigns positions rather than reordering.",
        },
        {
          type: "mcq",
          id: "pda06_mcq_02",
          difficulty: "Easy",
          question: "What's the advantage of df.nlargest(10, 'x') over df.sort_values('x', ascending=False).head(10)?",
          options: [
            "It returns different rows",
            "It finds the top 10 without fully sorting all rows — clearer and faster",
            "It sorts ascending",
            "There is no difference at all",
          ],
          correctIndex: 1,
          explanation:
            "nlargest is a targeted top-N selection that avoids sorting the entire frame, so it's both more readable and more efficient. It returns the same top 10 rows, just more directly.",
        },
        {
          type: "mcq",
          id: "pda06_mcq_03",
          difficulty: "Medium",
          question: "Using rank(method='min') on scores [90, 90, 75], what ranks do the two 90s and the 75 receive (ascending, default direction)?",
          options: [
            "90->1, 90->1, 75->3 ... wait, ascending means smallest is 1",
            "75->1, both 90s->2, and there is no rank 3",
            "75->1, both 90s->2",
            "All three get rank 2",
          ],
          correctIndex: 2,
          explanation:
            "With the default ascending order, the smallest value 75 is rank 1. The two tied 90s share the next position, rank 2, under method='min'. Because they occupy positions 2 and 3, the next distinct value (if any) would be rank 4 — but here there's none, so 75->1, 90->2, 90->2.",
        },
        {
          type: "scenario",
          id: "pda06_sc_01",
          difficulty: "Medium",
          scenario:
            "You sort a DataFrame with df.sort_values('date') and then access row .loc[0], expecting the earliest date. Instead you get a row from the middle of the timeline.",
          question: "Why, and what's the fix?",
          options: [
            "sort_values is broken; use sort_index",
            "sort_values keeps the original index labels, so label 0 is still the original first row — call reset_index(drop=True) after sorting, or use .iloc[0]",
            "You must pass ascending=True explicitly",
            "Dates can't be sorted",
          ],
          correctIndex: 1,
          explanation:
            "Sorting reorders rows but keeps their original index labels, so .loc[0] still points at whatever row was labelled 0 before sorting. Use .iloc[0] for the first row by position, or reset_index(drop=True) to renumber after sorting. ascending is already True by default.",
        },
        {
          type: "coding",
          id: "pda06_code_01",
          difficulty: "Hard",
          prompt:
            "Given the DataFrame below, print the name of the region with the second-highest total sales.\n\ndf = pd.DataFrame({'region':['N','S','E','W'], 'sales':[400, 900, 900, 250]})\n\nNote: N and... actually S and E tie at 900. Use nlargest, which keeps ties in original order, so the second row of the top 2 is E.",
          starterCode:
            "import pandas as pd\n\ndf = pd.DataFrame({'region':['N','S','E','W'], 'sales':[400, 900, 900, 250]})\n\n# Your code here\n",
          solutionCode:
            "import pandas as pd\n\ndf = pd.DataFrame({'region':['N','S','E','W'], 'sales':[400, 900, 900, 250]})\n\nsecond = df.nlargest(2, 'sales').iloc[1]['region']\nprint(second)",
          expectedOutput: "E",
          tests: [
            { name: "Top 2", description: "nlargest(2,'sales') returns S and E (both 900, original order)" },
            { name: "Second row", description: ".iloc[1] of the top 2 is E" },
          ],
        },
        {
          type: "mcq",
          id: "pda06_mcq_04",
          difficulty: "Hard",
          question: "By default, where does sort_values place NaN values?",
          options: [
            "First, before all other values",
            "Last, regardless of ascending or descending",
            "It raises an error if NaN is present",
            "Randomly",
          ],
          correctIndex: 1,
          explanation:
            "sort_values uses na_position='last' by default, so NaNs go to the end whether you sort ascending or descending. You can move them with na_position='first'. It doesn't error or randomise.",
        },
      ],
    },

    {
      id: "interview-questions",
      type: "interview-questions",
      tocLabel: "Interview Prep",
      questions: [
        {
          question: "How do you sort a DataFrame by multiple columns with different directions?",
          answer:
            "I pass a list of columns to sort_values via by, and a matching list of booleans to ascending. pandas sorts by the first column, uses the second to break ties, and so on down the list, with each column taking its own direction from the ascending list position-for-position. For example, sort_values(by=['region', 'sales'], ascending=[True, False]) orders regions alphabetically and, within each region, puts the highest sales first. If I need clean positional labels afterward I chain reset_index(drop=True), because sorting keeps the original index.",
        },
        {
          question: "What's the difference between the tie-handling methods in rank(), and when would you use each?",
          answer:
            "rank() offers several methods that differ only in how tied values are treated. 'min' gives every tied value the lowest position in the group and skips the next positions — that's competition ranking, what sports use, where two firsts mean no second. 'max' gives them the highest position in the group instead. 'dense' also shares the rank for ties but doesn't skip, so ranks are consecutive integers — good when I'm ranking distinct tiers and don't want gaps. 'first' breaks ties by order of appearance, giving strictly unique ranks. The default 'average' assigns the mean of the positions the ties span, which is the right choice for statistical work like computing rank correlations. I pick based on the domain: leaderboards use 'min', tiering uses 'dense', and Spearman-style statistics use 'average'.",
        },
        {
          question: "How would you efficiently get the top-K rows from a very large DataFrame, and why not just sort?",
          answer:
            "For top-K I use nlargest(k, col) rather than sorting the whole frame. A full sort is O(n log n) over every row, but I only need the K largest, and nlargest uses a selection algorithm that effectively maintains a bounded heap of the current top K in roughly O(n log k) — a big win when n is millions and k is small, and it reads more clearly as intent. It also handles the tie and NaN semantics sensibly out of the box. If the data is truly huge and lives out of memory, I'd push the ordering down to the source — a SQL ORDER BY ... LIMIT, or a partitioned top-K in a distributed engine — so I never materialise the full sorted set. Sorting first is fine for small frames or when I genuinely need the entire ordering, but for 'just the top 20' nlargest is the right tool.",
        },
      ],
    },

    {
      id: "common-mistakes",
      type: "callout",
      variant: "warning",
      title: "Common Mistakes to Avoid",
      content:
        "1) Expecting .loc[0] to be the first row after sorting — sort_values keeps original labels; use .iloc[0] or reset_index(drop=True). 2) Forgetting ascending=False for leaderboards — the default is smallest-first. 3) Assuming NaNs sort to the top — they go last by default (na_position='last'). 4) Using the wrong rank tie method — 'min' for competitions, 'dense' for tiers, 'average' for statistics; the default 'average' produces fractional ranks that surprise people. 5) Sorting the whole frame just to take the top 10 — nlargest is faster and clearer. 6) Mismatching the lengths of the by and ascending lists in a multi-column sort.",
    },

    {
      id: "ai-tutor",
      type: "callout",
      variant: "tip",
      title: "Ask the AI Tutor",
      content:
        "Try these prompts in the AI Tutor panel: • 'ELI5: what's the difference between sorting and ranking?' • 'Show me every rank() tie method on the same tied data.' • 'Quiz me on where NaNs land when I sort.' • 'Explain why nlargest can beat sort().head().' • 'Interview mode: ask me to build a competition leaderboard with ties.'",
    },

    {
      id: "glossary",
      type: "callout",
      variant: "info",
      title: "Glossary",
      content:
        "sort_values(by, ascending) — reorder rows by one or more columns. sort_index() — reorder rows by their index labels. nlargest / nsmallest(n, col) — return the top/bottom N rows by a column without a full sort. rank(method, ascending) — assign each row a position within a column. method='min' — competition ranking (ties share the lowest position, gaps after). method='dense' — consecutive ranks with no gaps. method='average' — the default; ties get the mean position. na_position — where NaNs are placed when sorting ('last' by default). reset_index(drop=True) — renumber rows 0,1,2 after reordering.",
    },

    {
      id: "resources",
      type: "callout",
      variant: "info",
      title: "Recommended Resources",
      content:
        "• Docs: the pandas 'Sorting' section of the basics guide, plus the rank() API reference for every tie method. • Read: the nlargest/nsmallest reference to see how ties (keep='first'/'last'/'all') are handled. • Practice: take a scores table with deliberate ties and produce three leaderboards using rank methods 'min', 'dense', and 'average' — compare how the tied rows differ. • Next in DSM: you've mastered the pandas core — Data Cleaning starts next. First up is Common Data Quality Issues, a field guide to the messes real datasets arrive in and a workflow to audit them.",
    },

    {
      id: "recap",
      type: "recap",
      tocLabel: "Recap",
      content:
        "✓ sort_values(by, ascending) reorders rows; pass lists to sort by several columns with per-column directions.\n✓ Sorting keeps the original index — reset_index(drop=True) for clean 0-based positions.\n✓ nlargest / nsmallest pull the top/bottom N faster and clearer than sort-then-head.\n✓ rank() assigns positions; the method argument sets tie handling — 'min', 'dense', 'average', 'max', 'first'.\n✓ ascending=False on sort or rank makes the largest value first / rank 1.\n✓ By default NaNs sort last, regardless of direction.\n\nNext up: Common Data Quality Issues. You can order and rank clean data — but first you have to make it clean. The Data Cleaning module opens with a field guide to the problems real datasets arrive with, and a workflow to catch them.",
    },
  ],
};
