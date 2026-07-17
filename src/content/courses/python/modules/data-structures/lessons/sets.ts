import type { Lesson } from "@/lib/curriculum/types";

export const sets: Lesson = {
  meta: {
    id: "python.data-structures.sets",
    slug: "sets",
    title: "Sets",
    description:
      "Unordered collections of unique values — instant membership tests, one-line deduplication, and the union/intersection algebra of comparing groups.",
    estimatedTime: "25 mins",
    difficulty: "Beginner",
    xpReward: 50,
    prerequisites: ["python.data-structures.dictionaries"],
    masteryThreshold: 80,
  },

  blocks: [
    {
      id: "intro",
      type: "lesson-intro",
      tocLabel: "Introduction",
      intro: {
        hook: "How many UNIQUE customers ordered this month? Which users appear in both the trial list and the churned list? Which required columns are missing from this CSV? Three questions, one structure: the set — a bag of values where duplicates simply cannot exist.",
        what: "A set is an unordered, mutable collection of unique, immutable elements: {3, 1, 4}. Adding an existing value does nothing; membership tests are hash-fast; and sets support union, intersection, and difference — the Venn-diagram operations.",
        why: "Data questions are constantly about uniqueness and overlap: distinct values, deduplication, who's-in-both, what's-missing. Sets answer all of them in one line each, at hash speed — where the list equivalents are slow loops you'd have to write and debug.",
        whereUsed:
          "Deduplication, distinct counts, membership testing against allowlists/blocklists, comparing expected vs actual columns, and cohort overlap analysis.",
        objectives: [
          "Create sets and understand the empty-set gotcha",
          "Deduplicate collections with set() and count distincts",
          "Test membership at hash speed with in",
          "Use union, intersection, and difference on real questions",
          "Choose set vs list vs dict by the question being asked",
        ],
        realWorldApps: [
          {
            company: "Spotify",
            headline: "Cohort overlap",
            detail:
              "Which listeners are in BOTH the 'podcast fans' and 'daily active' segments? Segment membership is set intersection — run across hundreds of millions of IDs.",
          },
          {
            company: "Cloudflare",
            headline: "Blocklist membership",
            detail:
              "Every request checks its IP against threat sets. `ip in blocked` must be instant at any size — hash-based membership, the set's core power.",
          },
          {
            company: "dbt",
            headline: "Schema validation",
            detail:
              "Expected columns minus actual columns = what's missing; actual minus expected = what's unexpected. Data pipeline tests are set differences.",
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
            "Create with braces: tags = {'sql', 'python', 'sql'} — the duplicate collapses instantly; len(tags) is 2. Convert any iterable: set(emails) deduplicates a list in one call. One gotcha: {} creates an empty DICT (dicts got there first) — the empty set is set().",
        },
        {
          type: "code-note",
          code: "votes = ['py', 'sql', 'py', 'r', 'py']\ndistinct = set(votes)\nprint(distinct)          # {'py', 'sql', 'r'} — order not guaranteed\nprint(len(distinct))     # 3 distinct values\nprint('sql' in distinct) # True — hash-fast",
          content:
            "set() is the one-line dedup. Note the output order may differ run to run — sets are UNORDERED; if you need order, sort: sorted(distinct). And `in` is the same constant-time lookup dicts have — sets ARE essentially dicts with only keys.",
        },
        {
          type: "analogy",
          title: "The guest list",
          content:
            "A set is a party guest list. Names, not seat numbers — nobody 'comes first' (unordered). Writing a name twice doesn't invite them twice (unique). And the bouncer's question — 'are you on the list?' — is answered by looking up the name directly, not reading the list top to bottom (hash membership). Comparing two parties' lists — who's invited to both, who only to yours — is the set algebra.",
        },
        {
          type: "keypoint",
          title: "The algebra: |, &, -, ^",
          content:
            "Union a | b: everything in either. Intersection a & b: only what's in both. Difference a - b: in a but not b (order matters!). Symmetric difference a ^ b: in exactly one. These four answer every overlap question — 'who churned AND was on trial' (&), 'required columns we don't have' (required - actual), 'total unique users across both apps' (|). Named methods exist too (.union(), .intersection(), ...) and accept any iterable.",
        },
        {
          type: "code-note",
          code: "trial = {'ada', 'kai', 'mia', 'zoe'}\npaid = {'kai', 'zoe', 'raj'}\n\nprint(trial & paid)   # converted: in both\nprint(trial - paid)   # trialed but never paid\nprint(paid - trial)   # paid without a trial\nprint(trial | paid)   # everyone we've seen",
          content:
            "Four business questions, four operators, zero loops. Note a - b ≠ b - a: difference is directional — 'mine minus yours' and 'yours minus mine' are different questions.",
        },
        {
          type: "text",
          content:
            "Sets mutate: .add(x) inserts (silently ignored if present), .discard(x) removes (silently fine if absent; .remove(x) raises KeyError instead — the loud/quiet split you know from dicts). Elements must be IMMUTABLE — same hashing rule as dict keys: strings, numbers, tuples yes; lists no.",
        },
        {
          type: "expandable",
          title: "When a set beats a list — measurably",
          content:
            "Checking `x in a_list` scans elements one by one; on a 100,000-item list inside a loop over another 100,000 items, that's ten billion comparisons. Convert the lookup side to a set once and each check becomes constant-time — the whole job drops from minutes to milliseconds. The rule: any repeated membership test against a collection deserves a set. (You saw this seed in the Strings lesson: len(set(tags)) counted unique tags.)",
        },
        {
          type: "warning",
          title: "Unordered means unordered",
          content:
            "Sets have no indexing (s[0] is a TypeError), no slicing, and no stable display order — code that depends on the order of set iteration is a latent bug that surfaces on another machine or Python version. Need uniqueness AND order? Sort the set when you present it, or dedup with dict.fromkeys(items) which preserves first-seen order. And set comprehension exists: {t.lower() for t in tags} — braces, no colon.",
        },
      ],
    },

    {
      id: "diagram",
      type: "interactive-diagram",
      tocLabel: "Visual Learning",
      visual: {
        kind: "comparison",
        title: "The four set operations on trial vs paid",
        caption:
          "trial = {ada, kai, mia, zoe} · paid = {kai, zoe, raj}. Click each operation for the business question it answers.",
        nodes: [
          {
            id: "union",
            label: "trial | paid",
            sublabel: "{ada, kai, mia, zoe, raj}",
            detail:
              "UNION — everything in either set. Business question: how many unique users have we ever seen? Deduplicated combination of any number of sources.",
            x: 22,
            y: 22,
            accent: false,
          },
          {
            id: "inter",
            label: "trial & paid",
            sublabel: "{kai, zoe}",
            detail:
              "INTERSECTION — only elements in BOTH. Business question: which trial users converted? The overlap of any two cohorts.",
            x: 72,
            y: 22,
            accent: true,
          },
          {
            id: "diff",
            label: "trial - paid",
            sublabel: "{ada, mia}",
            detail:
              "DIFFERENCE — in trial but not paid: who never converted. DIRECTIONAL: paid - trial = {raj}, customers who paid without a trial. Order matters.",
            x: 22,
            y: 66,
            accent: false,
          },
          {
            id: "sym",
            label: "trial ^ paid",
            sublabel: "{ada, mia, raj}",
            detail:
              "SYMMETRIC DIFFERENCE — in exactly one set, not both: everyone whose journey is 'incomplete' in some direction. Equivalent to (a | b) - (a & b).",
            x: 72,
            y: 66,
            accent: false,
          },
        ],
        edges: [
          { from: "union", to: "inter" },
          { from: "diff", to: "sym" },
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
          title: "Dedup and count distinct",
          scenario: "How many different products were sold today?",
          steps: [
            {
              code: "sold = ['mug', 'tee', 'mug', 'cap', 'tee', 'mug']\nunique = set(sold)\nprint(len(unique))\nprint(sorted(unique))",
              explanation:
                "set() collapses duplicates; len() counts distincts; sorted() imposes order for display (returning a list). Three built-ins, complete answer.",
            },
          ],
          output: "3\n['cap', 'mug', 'tee']",
        },
        {
          difficulty: "Easy",
          title: "Fast membership against an allowlist",
          scenario: "Filter events down to the ones from approved services.",
          steps: [
            {
              code: "APPROVED = {'auth', 'billing', 'search'}\nevents = [('auth', 'login'), ('ads', 'click'), ('billing', 'invoice'), ('legacy', 'ping')]",
              explanation:
                "The allowlist is a set BECAUSE it will be tested repeatedly — each `in` is constant-time. CAPS names the constant.",
            },
            {
              code: "kept = [(svc, evt) for svc, evt in events if svc in APPROVED]\nskipped = len(events) - len(kept)\nprint(kept)\nprint(f'{skipped} skipped')",
              explanation:
                "A comprehension with a set-membership filter — and the skip count reported, as always. This exact shape guards real ingestion pipelines.",
            },
          ],
          output:
            "[('auth', 'login'), ('billing', 'invoice')]\n2 skipped",
        },
        {
          difficulty: "Medium",
          title: "Schema check with set difference",
          scenario:
            "Validate an incoming CSV's columns against the expected schema — both directions.",
          steps: [
            {
              code: "expected = {'id', 'email', 'signup_date', 'plan'}\nactual = {'id', 'email', 'plan', 'referrer'}",
              explanation:
                "Two sets of column names. The validation is two directional differences.",
            },
            {
              code: "missing = expected - actual\nunexpected = actual - expected\nprint(f'missing: {sorted(missing)}')\nprint(f'unexpected: {sorted(unexpected)}')",
              explanation:
                "expected - actual: required things we don't have (fail the load). actual - expected: surprises (warn, maybe ignore). Two lines replace a nested loop-and-flag mess.",
            },
            {
              code: "if missing:\n    print('REJECT: schema incomplete')",
              explanation:
                "Truthiness on a set: empty is falsy, so `if missing:` reads 'if anything is missing'. This is dbt/Great Expectations-style validation, hand-rolled.",
            },
          ],
          output:
            "missing: ['signup_date']\nunexpected: ['referrer']\nREJECT: schema incomplete",
        },
        {
          difficulty: "Hard",
          title: "Cohort analysis with three sets",
          scenario:
            "Marketing wants: who engaged in BOTH months (retained), who was lost, who is new — from two months of active-user logs with duplicates.",
          steps: [
            {
              code: "june_log = ['ada', 'kai', 'mia', 'ada', 'zoe', 'kai']\njuly_log = ['kai', 'raj', 'mia', 'raj', 'noor']",
              explanation:
                "Raw activity logs — one entry per session, so users repeat. Sets don't care; conversion dedups.",
            },
            {
              code: "june = set(june_log)\njuly = set(july_log)\nretained = june & july\nlost = june - july\nnew = july - june",
              explanation:
                "Three cohort questions as three operations. Retained: in both. Lost: June-only. New: July-only. Each is a real KPI teams report weekly.",
            },
            {
              code: "rate = len(retained) / len(june) * 100\nprint(f'retained: {sorted(retained)} ({rate:.0f}%)')\nprint(f'lost: {sorted(lost)}')\nprint(f'new: {sorted(new)}')",
              explanation:
                "Retention rate = |retained| / |June cohort|. len() on sets counts unique members — the log's duplicates never distort the math, which is exactly why sets were the right container.",
            },
          ],
          output:
            "retained: ['kai', 'mia'] (50%)\nlost: ['ada', 'zoe']\nnew: ['noor', 'raj']",
        },
        {
          difficulty: "Industry Example",
          title: "The set-vs-list speedup, in the shape you'll meet it",
          scenario:
            "A data engineer must flag which of today's 6 transactions involve any of the known-fraud cards. With real volumes (millions of each) the list version melts; the set version doesn't. The code shape is identical either way — only the lookup container changes.",
          steps: [
            {
              code: "fraud_cards_list = ['4532...88', '4716...02', '4024...77', '5555...31']\nfraud_cards = set(fraud_cards_list)",
              explanation:
                "ONE conversion, up front. Cost: one pass. Benefit: every later `in` is constant-time instead of a scan. (With 5 million cards, that's the whole ballgame.)",
            },
            {
              code: "txs = [('t1', '4111...11'), ('t2', '4716...02'), ('t3', '4532...88'), ('t4', '6011...45'), ('t5', '4716...02'), ('t6', '3782...90')]",
              explanation: "(tx_id, card) pairs — today's stream.",
            },
            {
              code: "flagged = [tx_id for tx_id, card in txs if card in fraud_cards]\nprint(f'flagged: {flagged}')\nprint(f'{len(flagged)}/{len(txs)} transactions held for review')",
              explanation:
                "`card in fraud_cards` hits the hash table — six checks here, six million in production, same per-check cost. The one-line takeaway that survives contact with scale: REPEATED membership tests want a set.",
            },
          ],
          output:
            "flagged: ['t2', 't3', 't5']\n3/6 transactions held for review",
        },
      ],
    },

    {
      id: "inline-practice",
      type: "inline-code",
      tocLabel: "Practice Coding",
      coding: {
        language: "python",
        filename: "skills_gap.py",
        instructions:
          "A job posting requires certain skills; a candidate lists theirs (with duplicates). Compute: the candidate's distinct skill count, the required skills they're missing, the extra skills they bring, and whether they fully qualify (no missing skills).",
        starterCode: `required = {'python', 'sql', 'statistics', 'git'}
candidate_raw = ['python', 'excel', 'sql', 'python', 'tableau', 'sql']

# TODO 1: candidate — dedup the raw list into a set
candidate = ___

print(f"distinct skills: {len(candidate)}")

# TODO 2: missing — required skills the candidate lacks
missing = ___

# TODO 3: extra — candidate skills beyond the requirements
extra = ___

print(f"missing: {sorted(missing)}")
print(f"extra: {sorted(extra)}")

# TODO 4: qualified — True when nothing is missing
qualified = ___
print(f"qualified: {qualified}")`,
        solutionCode: `required = {'python', 'sql', 'statistics', 'git'}
candidate_raw = ['python', 'excel', 'sql', 'python', 'tableau', 'sql']

candidate = set(candidate_raw)

print(f"distinct skills: {len(candidate)}")

missing = required - candidate

extra = candidate - required

print(f"missing: {sorted(missing)}")
print(f"extra: {sorted(extra)}")

qualified = len(missing) == 0
print(f"qualified: {qualified}")`,
        expectedOutput:
          "distinct skills: 4\nmissing: ['git', 'statistics']\nextra: ['excel', 'tableau']\nqualified: False",
        hints: [
          "set(candidate_raw) collapses the duplicates — 6 entries become 4 skills",
          "missing is directional: required - candidate (what they need and lack)",
          "extra is the other direction: candidate - required",
          "qualified: len(missing) == 0 (or `not missing` — an empty set is falsy)",
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
          id: "py20_mcq_01",
          difficulty: "Easy",
          question: "What does len({1, 2, 2, 3, 3, 3}) return?",
          options: ["6", "3", "1", "TypeError"],
          correctIndex: 1,
          explanation:
            "Duplicates collapse at creation — the set holds {1, 2, 3}. Uniqueness isn't a cleanup step; it's the structure's definition.",
        },
        {
          type: "mcq",
          id: "py20_mcq_02",
          difficulty: "Easy",
          question: "How do you create an EMPTY set?",
          options: ["{}", "set()", "[]", "empty()"],
          correctIndex: 1,
          explanation:
            "{} is an empty DICT — dicts claimed the braces first. set() is the only way to spell an empty set. ({1, 2} braces work fine once there's content.)",
        },
        {
          type: "mcq",
          id: "py20_mcq_03",
          difficulty: "Medium",
          question:
            "a = {1, 2, 3, 4}; b = {3, 4, 5} — what is a - b?",
          options: ["{1, 2}", "{5}", "{1, 2, 5}", "{3, 4}"],
          correctIndex: 0,
          explanation:
            "Difference is directional: elements of a not in b → {1, 2}. b - a would be {5}; the in-exactly-one answer {1, 2, 5} is a ^ b; the in-both answer {3, 4} is a & b.",
        },
        {
          type: "scenario",
          id: "py20_sc_01",
          difficulty: "Medium",
          scenario:
            "A pipeline checks each of 2 million events against a revoked-tokens list: `if token in revoked_list:` where revoked_list is a Python list of 500,000 strings. The job that took minutes now takes hours as the list grew.",
          question: "What's the fix, and why does it work?",
          options: [
            "Sort the list first",
            "Convert once — revoked = set(revoked_list) — so each membership test hashes instead of scanning",
            "Use a tuple instead of a list",
            "Check tokens in batches of 1000",
          ],
          correctIndex: 1,
          explanation:
            "List membership scans up to 500k elements PER EVENT; a set hashes straight to the answer. One conversion pass turns 10^12 comparisons into 2×10^6 hash lookups. Sorting helps only with binary search you'd have to write; tuples scan like lists.",
        },
        {
          type: "coding",
          id: "py20_code_01",
          difficulty: "Medium",
          prompt:
            "emails = ['a@x.io', 'b@x.io', 'a@x.io', 'c@x.io', 'b@x.io'] — print the number of duplicate entries (total minus distinct), then the distinct emails sorted. Expected:\n2\n['a@x.io', 'b@x.io', 'c@x.io']",
          starterCode:
            "emails = ['a@x.io', 'b@x.io', 'a@x.io', 'c@x.io', 'b@x.io']\n# Your code here\n",
          solutionCode:
            "emails = ['a@x.io', 'b@x.io', 'a@x.io', 'c@x.io', 'b@x.io']\ndistinct = set(emails)\nprint(len(emails) - len(distinct))\nprint(sorted(distinct))",
          expectedOutput: "2\n['a@x.io', 'b@x.io', 'c@x.io']",
          tests: [
            {
              name: "Duplicate count",
              description: "total length minus distinct count = 5 - 3 = 2",
            },
            {
              name: "Sorted output",
              description: "The unordered set is sorted for display",
            },
          ],
        },
        {
          type: "mcq",
          id: "py20_mcq_04",
          difficulty: "Hard",
          question: "Which element can NOT go in a set?",
          options: [
            "('lat', 'lon')",
            "3.14",
            "['a', 'b']",
            "'frozen'",
          ],
          correctIndex: 2,
          explanation:
            "Set elements must be hashable — the same rule as dict keys, for the same hashing reason. Lists are mutable → unhashable → TypeError. Tuples of immutables, numbers, and strings all work.",
        },
        {
          type: "coding",
          id: "py20_code_02",
          difficulty: "Hard",
          prompt:
            "Site A visitors: ['ada', 'kai', 'mia', 'kai']; site B: ['mia', 'raj', 'ada', 'raj']. Print: how many unique people visited EITHER site, the sorted list of who visited BOTH, and the sorted list of who visited exactly ONE site. Expected:\n4\n['ada', 'mia']\n['kai', 'raj']",
          starterCode:
            "site_a = ['ada', 'kai', 'mia', 'kai']\nsite_b = ['mia', 'raj', 'ada', 'raj']\n# Your code here\n",
          solutionCode:
            "site_a = ['ada', 'kai', 'mia', 'kai']\nsite_b = ['mia', 'raj', 'ada', 'raj']\na = set(site_a)\nb = set(site_b)\nprint(len(a | b))\nprint(sorted(a & b))\nprint(sorted(a ^ b))",
          expectedOutput: "4\n['ada', 'mia']\n['kai', 'raj']",
          tests: [
            {
              name: "All three operations",
              description: "Union for the count, intersection and symmetric difference sorted",
            },
            {
              name: "Dedup first",
              description: "Both logs are converted to sets before any algebra",
            },
          ],
        },
      ],
    },

    {
      id: "interview-questions",
      type: "interview-questions",
      tocLabel: "Interview Prep",
      questions: [
        {
          question:
            "When do you reach for a set over a list, and what does it cost you?",
          answer:
            "Three triggers: uniqueness (deduplication and distinct counts — set(items) is the idiom), repeated membership testing (each `x in s` is constant-time hash lookup versus a list's linear scan — decisive inside loops or against large collections), and overlap questions (union, intersection, difference replace hand-written double loops). The costs: sets are unordered — no indexing, no slicing, no stable iteration order, so presentation needs sorted(); elements must be hashable, so no lists-of-lists; and duplicates are destroyed, so if multiplicity matters — counting how MANY times each value appears — you want the dict counting pattern or collections.Counter instead. My one-line heuristic: 'is this value present?' → set; 'how many / in what order?' → dict or list.",
        },
        {
          question:
            "Explain the four set operations with a concrete analytics example of each.",
          answer:
            "Take june and july as sets of active user IDs. Union (june | july) is everyone active in either month — the deduplicated reach number across sources. Intersection (june & july) is users active in both — retention's numerator, and the general 'in both cohorts' question. Difference is directional: june - july is churned users (active then, gone now), while july - june is new users — reversing the operands reverses the business question, which is worth saying out loud because it's a real bug source. Symmetric difference (june ^ july) is users active in exactly one month — the churned plus the new, the 'unstable' cohort. Every one runs in roughly linear time over the sets, replacing nested loops that would be quadratic — and each accepts any iterable via the method forms (.union(list_of_ids)).",
        },
        {
          question:
            "Your colleague deduplicates with `unique = []; for x in items: if x not in unique: unique.append(x)`. Critique it.",
          answer:
            "It's correct and even preserves first-seen order — but it's quadratic: each `x not in unique` scans the growing list, so 100k items means on the order of 5 billion comparisons. The fixes depend on whether order matters. If not: unique = set(items) — one pass, done. If order matters: either keep the loop shape but test against a parallel SET (seen = set(); if x not in seen: seen.add(x); result.append(x)) which keeps order at hash speed, or use the standard idiom list(dict.fromkeys(items)) — dicts preserve insertion order and keys are unique, so it dedups order-preservingly in one line. The deeper interview point: the pattern 'membership test inside a loop against a growing/large collection' should ALWAYS trigger the set reflex, whatever the surrounding code looks like.",
        },
      ],
    },

    {
      id: "common-mistakes",
      type: "callout",
      variant: "warning",
      title: "Common Mistakes to Avoid",
      content:
        "1) {} for an empty set — that's an empty dict; use set(). 2) Relying on set order — unordered by contract; sorted() for display. 3) Indexing a set (s[0]) — TypeError; convert or iterate. 4) Putting lists in sets — unhashable; use tuples. 5) Getting difference backwards — a - b is 'in a, not b'; state the question before writing the operands. 6) Using a set when duplicates carry meaning — counts need the dict pattern, not dedup. 7) Repeated `in some_list` checks at scale — the set conversion pays for itself immediately.",
    },

    {
      id: "ai-tutor",
      type: "callout",
      variant: "tip",
      title: "Ask the AI Tutor",
      content:
        "Try these prompts in the AI Tutor panel: • 'Quiz me: which operation answers each of these eight cohort questions?' • 'Show the quadratic-dedup fix step by step with timings explained.' • 'Drill me on a-b vs b-a with business phrasing.' • 'When do I need Counter instead of a set?' • 'Interview mode: ask me set vs list vs dict trade-offs and grade my answer.'",
    },

    {
      id: "glossary",
      type: "callout",
      variant: "info",
      title: "Glossary",
      content:
        "Set — unordered, mutable collection of unique, hashable elements. set() — the empty set (and the dedup conversion). Membership — `x in s`, hash-fast. Union (|) — in either set. Intersection (&) — in both. Difference (-) — in the left, not the right; directional. Symmetric difference (^) — in exactly one. .add()/.discard()/.remove() — insert; remove-quietly; remove-loudly. Hashable — stable hash required of elements (same rule as dict keys). Set comprehension — {expr for x in items}. dict.fromkeys(items) — order-preserving dedup idiom. frozenset — an immutable set, usable inside other sets.",
    },

    {
      id: "resources",
      type: "callout",
      variant: "info",
      title: "Recommended Resources",
      content:
        "• Docs: 'Sets' in the official Python tutorial and the set-types reference (all operators and methods). • Read: collections.Counter — when uniqueness isn't enough and multiplicity matters. • Practice: take two months of any repeated-entries data you can invent and produce retained/lost/new plus a retention rate — the cohort example, from scratch. • Next in DSM: you now hold lists, tuples, dicts, and sets — Nested Data Structures combines them into the real-world shapes (lists of dicts, dicts of lists) that JSON and APIs actually deliver.",
    },

    {
      id: "recap",
      type: "recap",
      tocLabel: "Recap",
      content:
        "✓ Sets hold unique, hashable elements — duplicates collapse on entry; set() for empty.\n✓ set(items) is one-line dedup; len(set(items)) is the distinct count.\n✓ Membership (`in`) is hash-fast — repeated lookups against big collections demand a set.\n✓ The algebra: | either, & both, - directional difference, ^ exactly-one.\n✓ Unordered by contract: sort for display, never depend on iteration order.\n✓ Duplicates meaningful? That's a counting dict, not a set.\n\nNext up: Nested Data Structures. Lists, tuples, dicts, and sets are your bricks — now build with them: lists of dicts, dicts of lists, and the navigation skills real JSON demands.",
    },
  ],
};
