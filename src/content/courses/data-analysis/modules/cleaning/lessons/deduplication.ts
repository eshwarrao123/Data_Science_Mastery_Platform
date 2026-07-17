import type { Lesson } from "@/lib/curriculum/types";

export const deduplication: Lesson = {
  meta: {
    id: "data-analysis.cleaning.deduplication",
    slug: "deduplication",
    title: "Deduplication",
    description:
      "Find and remove duplicate rows with duplicated() and drop_duplicates() — and, more importantly, learn to choose the right key columns and the right survivor so you delete copies, not real data.",
    estimatedTime: "25 mins",
    difficulty: "Intermediate",
    xpReward: 60,
    prerequisites: ["data-analysis.cleaning.detecting-handling-nulls"],
    masteryThreshold: 80,
  },

  blocks: [
    {
      id: "intro",
      type: "lesson-intro",
      tocLabel: "Introduction",
      intro: {
        hook: "A retry in the payment system, a double-clicked submit button, two exports concatenated by mistake — and suddenly revenue is up 8% without a single new sale. Duplicates are the quietest way to be confidently wrong: every number still looks plausible, it's just counted twice.",
        what: "Deduplication is detecting rows that represent the same real-world fact more than once and keeping exactly one. In pandas that's duplicated() to flag and drop_duplicates() to remove, controlled by two decisions: the subset (which columns define 'the same') and keep (which copy survives).",
        why: "Aggregations are defenceless against duplicates — sum, count, and mean all happily include every copy. A dataset with duplicated orders overstates revenue, inflates user counts, and biases any model trained on it. Dedup is cheap; the errors it prevents are not.",
        whereUsed:
          "Every ETL pipeline dedupes after joins and appends. CRM systems dedupe customer records, payment processors dedupe transactions from retries, and analysts dedupe before any count or sum they intend to present.",
        objectives: [
          "Flag repeated rows with duplicated() and understand its keep parameter",
          "Remove duplicates with drop_duplicates() safely",
          "Choose the subset of columns that defines identity for your data",
          "Distinguish exact duplicates from key conflicts (same key, different values)",
          "Pick the surviving row deliberately — first, last, or best-by-rule",
        ],
        realWorldApps: [
          {
            company: "Stripe",
            headline: "Idempotent payments",
            detail:
              "Network retries can submit the same charge twice, so payment records carry idempotency keys and pipelines dedupe on them — otherwise merchants would see doubled revenue and customers doubled charges.",
          },
          {
            company: "Salesforce",
            headline: "CRM contact merging",
            detail:
              "The same customer signs up as 'Jon Smith' and 'Jonathan Smith' with one shared email. Dedup runs on chosen key fields (email, phone) rather than full rows, then merges the survivors' details.",
          },
          {
            company: "Spotify",
            headline: "Play-event dedup",
            detail:
              "Mobile clients resend play events on flaky connections. Analytics pipelines dedupe on (user, track, timestamp) before counting streams, since royalty payouts depend on the counts being right.",
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
            "duplicated() scans the DataFrame and returns a boolean Series: False the first time a row is seen, True for every later repeat. Its mirror, drop_duplicates(), keeps the rows duplicated() would mark False. Both take the same two parameters, and both leave the original DataFrame untouched unless you assign the result.",
        },
        {
          type: "code-note",
          code: `df.duplicated()                 # True for 2nd+ occurrence of a full-row repeat
df.duplicated().sum()           # how many repeats
df.drop_duplicates()            # remove them, keep first occurrence
df.duplicated(keep=False)       # True for EVERY member of a duplicate group
df[df.duplicated(keep=False)]   # inspect all copies side by side`,
          content:
            "keep='first' (default) marks later copies; keep='last' marks earlier ones; keep=False marks all copies — the inspection mode, because you should look at duplicates before deleting them.",
        },
        {
          type: "keypoint",
          title: "subset defines what 'duplicate' means",
          content:
            "By default every column must match. With subset=['order_id'] only the key must match. This is the central modelling decision: full-row duplicates are almost always safe to drop (they carry zero extra information), but subset-duplicates can hide conflicts — same order_id, different amounts — where dropping blindly destroys data.",
        },
        {
          type: "code-note",
          code: `# Exact copies vs key conflicts — count them separately
exact = df.duplicated().sum()
key_dupes = df.duplicated(subset=['order_id']).sum()
conflicts = key_dupes - exact   # same key but differing values
print(exact, key_dupes, conflicts)`,
          content:
            "If key_dupes exceeds exact, some repeated keys carry different values. Those aren't duplicates — they're contradictions, and they need investigation or a rule (e.g. keep the latest), not a silent drop.",
        },
        {
          type: "text",
          content:
            "When you do drop on a subset, 'keep' decides the survivor. keep='first' preserves the earliest occurrence in row order, keep='last' the latest. If the data has a timestamp, sort by it first so 'last' means 'most recent' by design rather than by accident of file order.",
        },
        {
          type: "code-note",
          code: `latest = (
    df.sort_values('updated_at')
      .drop_duplicates(subset=['customer_id'], keep='last')
)`,
          content:
            "The sort-then-drop idiom: order the group so the row you want is last, then keep='last'. This turns 'which copy survives' from luck into a stated rule.",
        },
        {
          type: "analogy",
          title: "Guest list, not headcount",
          content:
            "If the same guest RSVPs three times, the caterer who counts RSVPs cooks for three phantom guests. The host instead keeps a guest LIST — each name once — and cooks per name. Deduplication is switching from counting submissions to counting identities; subset is you deciding what counts as 'the same name'.",
        },
        {
          type: "warning",
          title: "Dropping is not always the answer",
          content:
            "duplicated() finds textual sameness, not real-world sameness. Two identical rows can be two genuine events (a customer really did buy the same coffee twice at the same price) if the table has no unique event id. And near-duplicates — 'Jon Smith' vs 'Jon  Smith' — pass undetected until strings are normalised. Dedup after type and string cleaning, and ask whether the table SHOULD allow repeats before deleting any.",
        },
        {
          type: "expandable",
          title: "Where duplicates come from",
          content:
            "Knowing the source tells you the fix. 1) Retries: clients resend on timeout — dedupe on an idempotency key. 2) Appends: the same export concatenated twice — full-row dedup after concat. 3) Joins: a merge against a table with repeated keys multiplies rows — fix the right-hand table, not the output. 4) Human entry: the same entity typed twice with variations — needs string normalisation plus fuzzy matching, not exact dedup. 5) Slowly changing records: multiple versions of a customer over time — those are history, and 'dedup' means keep-latest, deliberately.",
        },
      ],
    },

    {
      id: "diagram",
      type: "interactive-diagram",
      tocLabel: "Visual Learning",
      visual: {
        kind: "flow",
        title: "A safe deduplication workflow",
        caption: "Click each stage — deletion is the last step, not the first.",
        nodes: [
          { id: "count", label: "Count", sublabel: "duplicated().sum()", detail: "Measure the scale first: exact duplicates and key-level duplicates separately. The gap between them is your conflict count.", x: 12, y: 15, accent: false },
          { id: "inspect", label: "Inspect", sublabel: "keep=False", detail: "Pull every member of each duplicate group with df[df.duplicated(keep=False)].sort_values(key) and look at them side by side.", x: 38, y: 8, accent: true },
          { id: "classify", label: "Classify", sublabel: "copy or conflict?", detail: "Exact copies carry no information — safe to drop. Same key with different values is a contradiction needing a survivor rule or investigation.", x: 64, y: 15, accent: true },
          { id: "rule", label: "Survivor rule", sublabel: "sort + keep", detail: "Decide which copy wins: first seen, most recent by timestamp (sort_values then keep='last'), or most complete. State the rule; don't inherit file order.", x: 85, y: 40, accent: true },
          { id: "drop", label: "Drop", sublabel: "drop_duplicates(subset, keep)", detail: "Apply the rule with subset for identity columns and keep for the survivor. Assign the result — pandas doesn't modify in place by default.", x: 60, y: 70, accent: false },
          { id: "verify", label: "Verify", sublabel: "recount + reconcile", detail: "Re-run the duplicate counts (now zero) and sanity-check an aggregate: did revenue drop by exactly the duplicated amount you expected?", x: 30, y: 82, accent: true },
        ],
        edges: [
          { from: "count", to: "inspect" },
          { from: "inspect", to: "classify" },
          { from: "classify", to: "rule", label: "conflicts" },
          { from: "classify", to: "drop", label: "exact copies" },
          { from: "rule", to: "drop" },
          { from: "drop", to: "verify" },
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
          title: "Flag and drop exact duplicates",
          scenario: "An export was accidentally concatenated with itself; remove the copies.",
          steps: [
            { code: "import pandas as pd\ndf = pd.DataFrame({'id':[1,2,1], 'amount':[50,30,50]})", explanation: "Row (1, 50) appears twice — an exact full-row duplicate." },
            { code: "print(df.duplicated().tolist())", explanation: "The first (1,50) is False (first sighting); the second is True (repeat)." },
            { code: "clean = df.drop_duplicates()\nprint(len(clean))", explanation: "drop_duplicates keeps the False rows: 2 rows remain. Note we assigned to a new variable — df itself is unchanged." },
          ],
          output: "[False, False, True]\n2",
        },
        {
          difficulty: "Easy",
          title: "See every copy with keep=False",
          scenario: "Before deleting, look at all members of each duplicate group.",
          steps: [
            { code: "df = pd.DataFrame({'sku':['A','B','A','C','A'], 'price':[10,20,10,30,10]})", explanation: "SKU A appears three times with identical prices." },
            { code: "mask = df.duplicated(keep=False)\nprint(mask.tolist())", explanation: "keep=False marks ALL three A-rows True, not just the repeats — this is the inspection view." },
            { code: "print(df[mask].to_string(index=False))", explanation: "Filtering with the mask lays every copy side by side so you can confirm they're true copies before dropping." },
          ],
          output: "[True, False, True, False, True]\nsku  price\n  A     10\n  A     10\n  A     10",
        },
        {
          difficulty: "Medium",
          title: "Key duplicates vs exact duplicates",
          scenario: "Order IDs should be unique. Separate harmless copies from real conflicts.",
          steps: [
            { code: "df = pd.DataFrame({\n    'order_id':[101,102,102,103,103],\n    'amount':  [50, 30, 30, 20, 25],\n})", explanation: "102 repeats with the same amount (a copy). 103 repeats with DIFFERENT amounts (a conflict)." },
            { code: "exact = df.duplicated().sum()\nkey_dupes = df.duplicated(subset=['order_id']).sum()", explanation: "Exact counts full-row repeats: 1 (the second 102). Key-level counts repeated ids: 2 (second 102 and second 103)." },
            { code: "print(exact, key_dupes, key_dupes - exact)", explanation: "The difference, 1, is the conflict count: one order_id carries contradictory amounts and must be investigated, not silently dropped." },
          ],
          output: "1 2 1",
        },
        {
          difficulty: "Hard",
          title: "Keep the most recent record per customer",
          scenario: "A customer table holds multiple versions per customer; keep each customer's latest row.",
          steps: [
            { code: "df = pd.DataFrame({\n    'customer':['A','B','A','B'],\n    'plan':    ['free','free','pro','plus'],\n    'updated': ['2026-01-05','2026-01-10','2026-03-01','2026-02-20'],\n})", explanation: "Both customers upgraded over time. Row order is NOT time order, so keep='last' alone would be luck." },
            { code: "latest = (\n    df.sort_values('updated')\n      .drop_duplicates(subset=['customer'], keep='last')\n)", explanation: "Sort by the timestamp first so 'last' within each customer genuinely means most recent, then keep it." },
            { code: "print(latest.sort_values('customer')[['customer','plan']].to_string(index=False))", explanation: "A's survivor is the March 'pro' row and B's is the February 'plus' row — the current state of each customer, by rule." },
          ],
          output: "customer plan\n       A  pro\n       B plus",
        },
        {
          difficulty: "Industry Example",
          title: "Reconciling revenue after dedup",
          scenario: "A payments analyst suspects retry duplicates inflated yesterday's revenue and must quantify the correction, not just apply it.",
          steps: [
            { code: "import pandas as pd\ndf = pd.DataFrame({\n    'txn_id': ['t1','t2','t2','t3','t4','t4'],\n    'amount': [100, 250, 250, 80, 40, 40],\n})", explanation: "Six recorded transactions; t2 and t4 each appear twice from client retries." },
            { code: "before = df['amount'].sum()\nclean = df.drop_duplicates(subset=['txn_id'], keep='first')\nafter = clean['amount'].sum()", explanation: "Measure the aggregate before and after deduping on the transaction key — the difference is the exact inflation caused by retries." },
            { code: "print(before, after, before - after)", explanation: "Reported revenue was 760, true revenue is 470, and the analyst can state precisely that retries added 290. Quantifying the correction is what makes the cleanup auditable." },
          ],
          output: "760 470 290",
        },
      ],
    },

    {
      id: "inline-practice",
      type: "inline-code",
      tocLabel: "Practice Coding",
      coding: {
        language: "python",
        filename: "dedup_practice.py",
        instructions:
          "A signup table has duplicate emails from double-submitted forms. Count the duplicates, keep each email's most recent signup, and report the final row count.",
        starterCode: `import pandas as pd

df = pd.DataFrame({
    'email':     ['a@x.com','b@x.com','a@x.com','c@x.com','b@x.com'],
    'plan':      ['free','free','pro','free','plus'],
    'signed_up': ['2026-01-01','2026-01-02','2026-01-05','2026-01-03','2026-01-08'],
})

# TODO 1: Number of rows whose email repeats an earlier row's email
dupe_count = ___

# TODO 2: Keep each email's MOST RECENT row (sort by signed_up first)
latest = ___

# TODO 3: Plans in the final table, ordered by email
plans = latest.sort_values('email')['plan'].tolist()

print(dupe_count)
print(len(latest))
print(plans)`,
        solutionCode: `import pandas as pd

df = pd.DataFrame({
    'email':     ['a@x.com','b@x.com','a@x.com','c@x.com','b@x.com'],
    'plan':      ['free','free','pro','free','plus'],
    'signed_up': ['2026-01-01','2026-01-02','2026-01-05','2026-01-03','2026-01-08'],
})

dupe_count = df.duplicated(subset=['email']).sum()

latest = (
    df.sort_values('signed_up')
      .drop_duplicates(subset=['email'], keep='last')
)

plans = latest.sort_values('email')['plan'].tolist()

print(dupe_count)
print(len(latest))
print(plans)`,
        expectedOutput: "2\n3\n['pro', 'plus', 'free']",
        hints: [
          "Task 1: duplicated with subset=['email'] flags the 2nd+ occurrence of each email; .sum() counts them.",
          "Task 2: chain sort_values('signed_up') before drop_duplicates so keep='last' means most recent.",
          "keep='last' keeps a@x.com's Jan-05 'pro' row and b@x.com's Jan-08 'plus' row.",
          "latest = df.sort_values('signed_up').drop_duplicates(subset=['email'], keep='last')",
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
          id: "pda09_mcq_01",
          difficulty: "Easy",
          question: "With default parameters, df.duplicated() marks which rows True?",
          options: [
            "Every row that has any duplicate, including the first occurrence",
            "The second and later occurrences of each fully repeated row",
            "Only the first occurrence of each repeated row",
            "Rows with missing values",
          ],
          correctIndex: 1,
          explanation:
            "The default keep='first' treats the first sighting as the original (False) and flags later repeats (True). keep=False would flag every member of the group; missing values are unrelated.",
        },
        {
          type: "mcq",
          id: "pda09_mcq_02",
          difficulty: "Easy",
          question: "What does the subset parameter of drop_duplicates control?",
          options: [
            "How many rows to drop at most",
            "Which columns must match for two rows to count as duplicates",
            "Which columns to delete from the result",
            "The sort order of the output",
          ],
          correctIndex: 1,
          explanation:
            "subset restricts the identity check to the listed columns — e.g. subset=['order_id'] treats rows with the same id as duplicates even if other columns differ. It never deletes columns or limits row counts.",
        },
        {
          type: "mcq",
          id: "pda09_mcq_03",
          difficulty: "Medium",
          question: "df.duplicated().sum() is 0 but df.duplicated(subset=['user_id']).sum() is 12. What does this tell you?",
          options: [
            "The data has 12 exact duplicate rows",
            "12 rows repeat a user_id while differing in other columns — conflicts or versions, not pure copies",
            "user_id has 12 missing values",
            "The DataFrame has 12 columns",
          ],
          correctIndex: 1,
          explanation:
            "No full row repeats, yet 12 rows share a user_id with an earlier row — so those rows differ somewhere else. They're contradictions or record versions requiring a survivor rule, not safe silent drops.",
        },
        {
          type: "scenario",
          id: "pda09_sc_01",
          difficulty: "Medium",
          scenario:
            "A customer table has several rows per customer_id from profile updates over time, with an updated_at timestamp. The team needs one current row per customer.",
          question: "What is the correct approach?",
          options: [
            "df.drop_duplicates() with no arguments",
            "df.drop_duplicates(subset=['customer_id']) relying on the file's row order",
            "Sort by updated_at, then drop_duplicates(subset=['customer_id'], keep='last')",
            "Delete all rows whose customer_id appears more than once",
          ],
          correctIndex: 2,
          explanation:
            "Sorting by the timestamp makes 'last' mean 'most recent' by rule, then keep='last' retains the current version per customer. No-arg dedup keeps all versions (they differ), relying on file order is luck, and deleting whole groups loses those customers entirely.",
        },
        {
          type: "coding",
          id: "pda09_code_01",
          difficulty: "Hard",
          prompt:
            "Count how many product ids are involved in CONFLICTS — i.e. the id repeats but with differing rows. Print that count.\n\ndf = pd.DataFrame({'pid':['P1','P1','P2','P2','P3'], 'price':[10, 10, 20, 25, 30]})",
          starterCode:
            "import pandas as pd\n\ndf = pd.DataFrame({'pid':['P1','P1','P2','P2','P3'], 'price':[10, 10, 20, 25, 30]})\n\n# Your code here\n",
          solutionCode:
            "import pandas as pd\n\ndf = pd.DataFrame({'pid':['P1','P1','P2','P2','P3'], 'price':[10, 10, 20, 25, 30]})\n\nconflicts = df.drop_duplicates().groupby('pid').size()\nprint((conflicts > 1).sum())",
          expectedOutput: "1",
          tests: [
            { name: "P1 excluded", description: "P1's rows are exact copies, so after full-row dedup it appears once — not a conflict" },
            { name: "P2 counted", description: "P2 keeps two distinct rows (price 20 and 25) after dedup, so it is the one conflicted id" },
          ],
        },
        {
          type: "mcq",
          id: "pda09_mcq_04",
          difficulty: "Hard",
          question: "A transactions table has no unique transaction id, and two identical rows appear: same customer, item, price, and date. Why is dropping one of them risky?",
          options: [
            "drop_duplicates cannot handle identical rows",
            "Without an event key, textual sameness can't distinguish a retry from two genuine identical purchases",
            "It will corrupt the DataFrame index",
            "Duplicates never occur without an id column",
          ],
          correctIndex: 1,
          explanation:
            "duplicated() detects textual sameness only. A customer really can buy the same item at the same price on the same date twice; without an idempotency/event key you can't tell a double-count from a real repeat, so dropping may delete a genuine sale. The other options are false.",
        },
      ],
    },

    {
      id: "interview-questions",
      type: "interview-questions",
      tocLabel: "Interview Prep",
      questions: [
        {
          question: "Walk me through how you'd deduplicate a messy customer table.",
          answer:
            "First I measure and inspect before touching anything: duplicated().sum() for exact copies, duplicated(subset=[key]).sum() for key-level repeats, and df[df.duplicated(keep=False)].sort_values(key) to eyeball whole groups. The gap between key-level and exact counts is my conflict count — same key, different values. Exact copies I drop freely; they carry no information. For conflicts I need a survivor rule: usually most-recent, implemented as sort_values by the update timestamp then drop_duplicates(subset=[key], keep='last'), or sometimes most-complete, keeping the row with fewest nulls. I also dedupe AFTER string normalisation and type fixes, since ' jon@x.com ' and 'jon@x.com' won't match before cleaning. Finally I verify: recount duplicates (should be zero) and reconcile an aggregate like revenue so I can state exactly what the dedup changed.",
        },
        {
          question: "What's the difference between keep='first', keep='last', and keep=False, and when do you use each?",
          answer:
            "They control which members of a duplicate group get flagged by duplicated() or retained by drop_duplicates(). keep='first' treats the earliest occurrence as the original — the default, fine for exact copies where all rows are interchangeable. keep='last' keeps the latest occurrence, which becomes meaningful when I've sorted by a timestamp first — sort then keep='last' is the standard keep-most-recent idiom for versioned records. keep=False flags every member of the group including the first; it never makes sense for dropping (you'd lose the whole group) but it's exactly right for inspection, because df[df.duplicated(keep=False)] shows all copies side by side so I can classify them as copies versus conflicts before deciding anything.",
        },
        {
          question: "Where do duplicates typically come from in production data, and why does the source matter?",
          answer:
            "The main sources: retries, where a client resends on timeout — fixed by deduping on an idempotency key; double-appends, where the same file is loaded twice — full-row dedup after the concat; join fan-out, where merging against a table with repeated keys multiplies rows — the fix belongs in the right-hand table, not the merged output; human entry, where the same entity is typed with variations — that needs string normalisation and often fuzzy matching, since exact dedup can't see it; and versioned records, where multiple rows per entity are history, and 'deduplication' really means a deliberate keep-latest policy. The source matters because it decides both the key and the fix — and because dedup that only treats the symptom will face the same duplicates again on the next load. Ideally the pipeline prevents them upstream rather than sweeping them downstream.",
        },
      ],
    },

    {
      id: "common-mistakes",
      type: "callout",
      variant: "warning",
      title: "Common Mistakes to Avoid",
      content:
        "1) Dropping before inspecting — always look at df[df.duplicated(keep=False)] first. 2) Forgetting drop_duplicates returns a new DataFrame — assign it, or the 'cleanup' silently does nothing. 3) Deduping on a key without checking for conflicts — same key with different values is a contradiction, not a copy. 4) Using keep='last' without sorting first — 'last' then means file order, which is luck. 5) Deduping before string/type cleaning — ' A' and 'A' won't match. 6) Assuming identical rows are always errors — without an event key, some repeats are genuine events. 7) Never reconciling — quantify what the dedup changed (rows removed, revenue delta) so the fix is auditable.",
    },

    {
      id: "ai-tutor",
      type: "callout",
      variant: "tip",
      title: "Ask the AI Tutor",
      content:
        "Try these prompts in the AI Tutor panel: • 'ELI5: subset and keep in drop_duplicates using a guest-list story.' • 'Show me the sort-then-keep-last idiom on a versioned records example.' • 'Quiz me: copies vs conflicts — I'll classify your scenarios.' • 'How would join fan-out create duplicates and where should the fix go?' • 'Interview mode: challenge my plan to dedupe a transactions table with no id column.'",
    },

    {
      id: "glossary",
      type: "callout",
      variant: "info",
      title: "Glossary",
      content:
        "duplicated() — boolean flag for repeated rows (default: 2nd+ occurrence). drop_duplicates() — remove flagged repeats, keeping one survivor per group. subset — the columns that define row identity for the check. keep — which occurrence survives: 'first', 'last', or False (flag all). Key conflict — same key columns, different values elsewhere. Survivor rule — the stated policy for which copy is kept (first, most recent, most complete). Idempotency key — a unique id that makes retries detectable. Join fan-out — row multiplication caused by merging on non-unique keys.",
    },

    {
      id: "resources",
      type: "callout",
      variant: "info",
      title: "Recommended Resources",
      content:
        "• Docs: pandas API reference for DataFrame.duplicated and DataFrame.drop_duplicates — the subset/keep semantics repay a careful read. • Read: a primer on idempotency keys (Stripe's API docs have a good one) to see how systems prevent duplicates at the source. • Practice: concatenate any CSV with itself, add a few conflicting edits, and practise separating exact copies from conflicts before cleaning. • Next in DSM: with rows unique, the next lesson fixes columns whose types are wrong — Data Type Coercion.",
    },

    {
      id: "recap",
      type: "recap",
      tocLabel: "Recap",
      content:
        "✓ duplicated() flags repeats (2nd+ by default); drop_duplicates() removes them — assign the result.\n✓ keep=False is the inspection mode: view every member of each duplicate group before deleting.\n✓ subset defines identity; the gap between key-level and exact duplicate counts is your conflict count.\n✓ Conflicts (same key, different values) need a survivor rule — sort by timestamp, then keep='last'.\n✓ Dedup after string/type cleaning, and remember textual sameness isn't proof of real-world sameness.\n✓ Verify afterwards: recount duplicates and reconcile an aggregate so the correction is auditable.\n\nNext up: Data Type Coercion. Duplicates dealt with — but numbers stored as text still can't be summed. Next you'll force every column into the type it should have been all along.",
    },
  ],
};
