import type { Lesson } from "@/lib/curriculum/types";

export const listComprehensions: Lesson = {
  meta: {
    id: "python.control-flow.list-comprehensions",
    slug: "list-comprehensions",
    title: "List Comprehensions",
    description:
      "Collapse the build-a-new-list loop into one readable expression — Python's signature syntax and the idiom data code is written in.",
    estimatedTime: "30 mins",
    difficulty: "Beginner",
    xpReward: 60,
    prerequisites: ["python.control-flow.for-loops"],
    masteryThreshold: 80,
  },

  blocks: [
    {
      id: "intro",
      type: "lesson-intro",
      tocLabel: "Introduction",
      intro: {
        hook: "By now you've written this loop a dozen times: make an empty list, loop over the data, maybe test each item, append a result. Python noticed how often everyone writes it — and gave it a dedicated one-line syntax. Once comprehensions click, you'll read and write half of real-world Python faster.",
        what: "A list comprehension builds a new list in a single expression: [expression for item in collection if condition]. It's the transform-and-filter loop, compressed — same behavior, same result, one line.",
        why: "This is the single most common idiom in professional Python. Data code is saturated with it: clean every value, extract one field per record, keep the rows that match. Reading other people's code — Stack Overflow answers, library sources, your teammates' pipelines — requires fluency in it.",
        whereUsed:
          "Cleaning columns of values, extracting fields from records, filtering rows, building test fixtures, and everywhere a for-append loop used to live.",
        objectives: [
          "Translate a for-append loop into a comprehension and back",
          "Add filtering with a trailing if clause",
          "Transform conditionally with the value-if-else expression up front",
          "Recognize when a comprehension is too dense and a loop reads better",
          "Connect comprehensions to the vectorized thinking NumPy and pandas use",
        ],
        realWorldApps: [
          {
            company: "Reddit",
            headline: "Feed assembly",
            detail:
              "Ranking code routinely reshapes candidate lists with comprehensions — extracting IDs, filtering removed posts, mapping scores — before the heavy ranking model sees them.",
          },
          {
            company: "Bloomberg",
            headline: "Tick data normalization",
            detail:
              "Ingest scripts convert raw price strings to floats and drop unparseable ticks in a single comprehension per field — terse enough to audit at a glance.",
          },
          {
            company: "Hugging Face",
            headline: "Dataset preprocessing",
            detail:
              "Tokenization pipelines are full of comprehensions: [len(t) for t in tokens], [t for t in examples if t['text']] — the shape of virtually all preprocessing code.",
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
            "Read a comprehension inside-out from the middle: `for item in collection` names each element, the expression on the LEFT says what each becomes, and an optional `if condition` on the RIGHT filters which ones make it in. The result is always a brand-new list — the original is untouched.",
        },
        {
          type: "code-note",
          code: "prices = [19.99, 5.49, 12.00]\n\n# The loop you know:\nwith_tax = []\nfor p in prices:\n    with_tax.append(round(p * 1.08, 2))\n\n# The comprehension — identical result:\nwith_tax = [round(p * 1.08, 2) for p in prices]\nprint(with_tax)",
          content:
            "Four lines become one, and nothing else changed: same iteration, same transform, same new list. Every comprehension can be mechanically expanded back into its loop — when one confuses you, expand it.",
        },
        {
          type: "analogy",
          title: "The order ticket",
          content:
            "A for-append loop is walking the kitchen line telling each cook individually what to do. A comprehension is the order ticket pinned above the pass: 'grilled [expression], for every table [iteration], skip the cancelled ones [filter]'. Same kitchen, same food — the ticket just states the whole job at once.",
        },
        {
          type: "keypoint",
          title: "The two positions of if",
          content:
            "A TRAILING if filters — it decides which items get in: [x for x in xs if x > 0]. A LEADING if-else transforms — every item gets in, but conditionally shaped: [x if x > 0 else 0 for x in xs]. Filter selects; conditional expression reshapes. Mixing up the two positions is the #1 comprehension syntax error.",
        },
        {
          type: "code-note",
          code: "temps = [21.5, -3.0, 18.2, -1.5]\n\nwarm_only = [t for t in temps if t > 0]        # filter: 2 items\nclamped   = [t if t > 0 else 0.0 for t in temps]  # transform: 4 items\nprint(warm_only)  # [21.5, 18.2]\nprint(clamped)    # [21.5, 0.0, 18.2, 0.0]",
          content:
            "Same data, both patterns. Filtering can change the length; transforming never does. Choosing between them is a data-design decision you'll make constantly in cleaning code (drop the bad rows, or impute them?).",
        },
        {
          type: "text",
          content:
            "Comprehensions and NumPy vectorization are the same THOUGHT at different scales: 'apply this to every element' instead of 'here's how to loop'. [t * 9/5 + 32 for t in temps] and temps_array * 9/5 + 32 express identical intent. Practicing comprehensions trains the exact mental muscle pandas expects.",
        },
        {
          type: "expandable",
          title: "Beyond lists: dict and set comprehensions exist too",
          content:
            "The same syntax with braces builds dictionaries and sets: {name: len(name) for name in names} maps each name to its length; {t.lower() for t in tags} builds a set of unique lowercase tags. You'll study dicts and sets properly in the Data Structures module — for now just recognize the family resemblance when you see braces.",
        },
        {
          type: "warning",
          title: "Know when to stop",
          content:
            "Comprehensions optimize for readability — until they don't. Two nested fors, multiple conditions, or side effects (calling print/save inside one) tip it into write-only code. House rule used by most teams: if it doesn't fit comfortably on one line, or you're doing anything other than building a list, write the loop. A comprehension you have to expand mentally to understand has already failed.",
        },
      ],
    },

    {
      id: "diagram",
      type: "interactive-diagram",
      tocLabel: "Visual Learning",
      visual: {
        kind: "flow",
        title: "Anatomy of [x * 2 for x in nums if x > 0]",
        caption:
          "Each element flows right-to-left through the clauses. Click each stage to see its job.",
        nodes: [
          {
            id: "source",
            label: "for x in nums",
            sublabel: "the iteration",
            detail:
              "The engine: identical to a for loop's header. Each element of nums is bound to x in turn. Read a comprehension starting HERE, not at the left edge.",
            x: 20,
            y: 60,
            accent: true,
          },
          {
            id: "filter",
            label: "if x > 0",
            sublabel: "the filter (optional)",
            detail:
              "Each element is tested. False → discarded, the expression never runs for it. True → passed along. This clause can change the output's length.",
            x: 48,
            y: 60,
            accent: false,
          },
          {
            id: "expr",
            label: "x * 2",
            sublabel: "the expression",
            detail:
              "What each surviving element BECOMES. It can be the element itself (x), a computation (x * 2), a method call (x.strip()), or a conditional expression (x if x > 0 else 0).",
            x: 74,
            y: 60,
            accent: false,
          },
          {
            id: "result",
            label: "[ ... ]",
            sublabel: "the new list",
            detail:
              "Results collect in order into a brand-new list. The source list is never modified — comprehensions build, they don't edit.",
            x: 88,
            y: 25,
            accent: false,
          },
        ],
        edges: [
          { from: "source", to: "filter", label: "each x" },
          { from: "filter", to: "expr", label: "if True" },
          { from: "expr", to: "result", label: "collect" },
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
          title: "Transform every element",
          scenario: "Convert a list of names to uppercase for a display board.",
          steps: [
            {
              code: "names = ['ada', 'grace', 'alan']\nshouting = [n.upper() for n in names]\nprint(shouting)",
              explanation:
                "Read from the middle: for each n in names, produce n.upper(), collect the results. Three in, three out — a pure transform has no filter clause.",
            },
          ],
          output: "['ADA', 'GRACE', 'ALAN']",
        },
        {
          difficulty: "Easy",
          title: "Filter with a trailing if",
          scenario: "From a week of daily revenues, keep only the days that beat $1,000.",
          steps: [
            {
              code: "revenues = [850.0, 1230.5, 990.0, 1500.0, 1105.0]",
              explanation: "Five days of revenue figures.",
            },
            {
              code: "good_days = [r for r in revenues if r > 1000]",
              explanation:
                "The expression is just r — we keep elements unchanged; the trailing if does the selecting. Three values survive. This is df[df['revenue'] > 1000] in miniature.",
            },
            {
              code: "print(good_days)\nprint(f'{len(good_days)} of {len(revenues)} days')",
              explanation: "The new list can be measured against the original since neither was modified.",
            },
          ],
          output: "[1230.5, 1500.0, 1105.0]\n3 of 5 days",
        },
        {
          difficulty: "Medium",
          title: "Transform AND filter together",
          scenario:
            "Clean a scraped price column: strip the '$', convert to float — but only for entries that aren't missing.",
          steps: [
            {
              code: "raw = ['$12.99', '$5.00', 'N/A', '$22.50', 'N/A']",
              explanation:
                "Scraped data with the missing-value marker you met in Type Conversion.",
            },
            {
              code: "prices = [float(p.replace('$', '')) for p in raw if p != 'N/A']",
              explanation:
                "Both clauses working: the if discards the two 'N/A' entries BEFORE the expression runs (so float() never sees them — the filter protects the transform), and the expression chains .replace() into float().",
            },
            {
              code: "print(prices)\nprint(f'avg: ${sum(prices) / len(prices):.2f}')",
              explanation:
                "sum() is the built-in that adds a whole list — the accumulator loop you wrote by hand in For Loops, provided by Python. Clean data in, one-line stats out.",
            },
          ],
          output: "[12.99, 5.0, 22.5]\navg: $13.50",
        },
        {
          difficulty: "Hard",
          title: "Conditional transform: the leading if-else",
          scenario:
            "Cap outliers instead of dropping them: any response time above 1000 ms becomes exactly 1000 (winsorizing — a real cleaning technique you'll meet again in statistics).",
          steps: [
            {
              code: "latencies = [230, 450, 3200, 180, 1100, 240]",
              explanation:
                "Response times with two outliers (3200, 1100) that would wreck an average.",
            },
            {
              code: "capped = [t if t <= 1000 else 1000 for t in latencies]",
              explanation:
                "The if-else lives BEFORE the for — it's part of the expression, so every element produces a value: itself when under the cap, 1000 otherwise. Six in, six out. Compare: a trailing if would DROP the outliers and change the length.",
            },
            {
              code: "print(capped)\nprint(f'raw avg:    {sum(latencies) / len(latencies):.0f} ms')\nprint(f'capped avg: {sum(capped) / len(capped):.0f} ms')",
              explanation:
                "The capped average (533 ms) describes typical experience far better than the raw one (900 ms), which two bad requests dragged up. Choosing cap-vs-drop is a modeling decision; comprehensions make either a one-liner.",
            },
          ],
          output:
            "[230, 450, 1000, 180, 1000, 240]\nraw avg:    900 ms\ncapped avg: 517 ms",
        },
        {
          difficulty: "Industry Example",
          title: "One record-extraction pass, three comprehensions",
          scenario:
            "A data analyst receives order records as a list of (id, amount, status) tuples from a database query and needs: the completed order amounts, their IDs for an email, and a quality count — the everyday shape of pre-pandas wrangling.",
          steps: [
            {
              code: "orders = [\n    (101, 250.0, 'completed'),\n    (102, 90.5,  'cancelled'),\n    (103, 430.0, 'completed'),\n    (104, 55.0,  'pending'),\n    (105, 120.0, 'completed'),\n]",
              explanation:
                "Rows as tuples — exactly what a database cursor hands you. Each has an id, an amount, and a status.",
            },
            {
              code: "completed_amounts = [amt for (oid, amt, status) in orders if status == 'completed']",
              explanation:
                "Tuple unpacking works inside comprehensions just like in for loops: each 3-tuple unpacks into named parts, the filter keeps completed rows, the expression extracts one field. This is SELECT amount WHERE status = 'completed' in Python clothing.",
            },
            {
              code: "completed_ids = [oid for (oid, amt, status) in orders if status == 'completed']\nnot_done = len([o for o in orders if o[2] != 'completed'])",
              explanation:
                "Two more single-purpose passes. Note o[2] — indexing the tuple works too, but unpacked names read better; teams usually prefer them. Three clear comprehensions beat one clever one that computes everything at once.",
            },
            {
              code: "revenue = sum(completed_amounts)\nprint(f'completed: {completed_ids}')\nprint(f'revenue: ${revenue:.2f}')\nprint(f'not completed: {not_done}')",
              explanation:
                "The pandas translation you'll write in a few modules: df[df.status == 'completed'].amount.sum() — the comprehension mindset carries straight over.",
            },
          ],
          output:
            "completed: [101, 103, 105]\nrevenue: $800.00\nnot completed: 2",
        },
      ],
    },

    {
      id: "inline-practice",
      type: "inline-code",
      tocLabel: "Practice Coding",
      coding: {
        language: "python",
        filename: "sensor_cleanup.py",
        instructions:
          "Clean a day of air-quality sensor readings using only comprehensions — no for-append loops. Build: (1) valid readings (drop the -999 error codes), (2) those same readings rounded to whole numbers, (3) an alert list where readings over 150 become 'HIGH' and the rest 'ok'.",
        starterCode: `readings = [42.7, -999, 155.2, 89.1, -999, 170.8, 33.4]

# TODO 1: valid = readings without the -999 error codes (filter)
valid = ___

# TODO 2: rounded = each valid reading as a whole number using round() (transform)
rounded = ___

# TODO 3: alerts = 'HIGH' if a valid reading is over 150 else 'ok' (conditional transform)
alerts = ___

print(f"Valid: {valid}")
print(f"Rounded: {rounded}")
print(f"Alerts: {alerts}")`,
        solutionCode: `readings = [42.7, -999, 155.2, 89.1, -999, 170.8, 33.4]

valid = [r for r in readings if r != -999]

rounded = [round(r) for r in valid]

alerts = ['HIGH' if r > 150 else 'ok' for r in valid]

print(f"Valid: {valid}")
print(f"Rounded: {rounded}")
print(f"Alerts: {alerts}")`,
        expectedOutput:
          "Valid: [42.7, 155.2, 89.1, 170.8, 33.4]\nRounded: [43, 155, 89, 171, 33]\nAlerts: ['ok', 'HIGH', 'ok', 'HIGH', 'ok']",
        hints: [
          "TODO 1 keeps elements unchanged, so the expression is just r — the work happens in the trailing if",
          "TODO 2 builds on valid (not readings) — chain your cleaned data forward",
          "TODO 3 puts if-else BEFORE the for: 'HIGH' if r > 150 else 'ok'",
          "Lengths tell you if you used the right pattern: valid has 5, and so do rounded and alerts",
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
          id: "py10_mcq_01",
          difficulty: "Easy",
          question: "What does [n * n for n in range(4)] produce?",
          options: [
            "[1, 4, 9, 16]",
            "[0, 1, 4, 9]",
            "[0, 1, 2, 3]",
            "[16]",
          ],
          correctIndex: 1,
          explanation:
            "range(4) yields 0–3 (stop excluded, as always), and each is squared: 0, 1, 4, 9. If you answered A, the range off-by-one got you, not the comprehension.",
        },
        {
          type: "mcq",
          id: "py10_mcq_02",
          difficulty: "Easy",
          question:
            "Which comprehension keeps only the even numbers from nums, unchanged?",
          options: [
            "[n if n % 2 == 0 for n in nums]",
            "[n for n in nums if n % 2 == 0]",
            "[n % 2 == 0 for n in nums]",
            "[if n % 2 == 0: n for n in nums]",
          ],
          correctIndex: 1,
          explanation:
            "Filtering uses a TRAILING if with no else. Option A is a SyntaxError (leading if requires else); C builds a list of True/False values; D is loop syntax jammed into an expression.",
        },
        {
          type: "mcq",
          id: "py10_mcq_03",
          difficulty: "Medium",
          question:
            "lengths = [len(w) for w in words if len(w) > 3] — with words = ['data', 'is', 'power']. What is lengths?",
          options: [
            "[4, 2, 5]",
            "[4, 5]",
            "['data', 'power']",
            "[2]",
          ],
          correctIndex: 1,
          explanation:
            "'is' fails the filter (len 2). The survivors 'data' and 'power' are transformed to their lengths: [4, 5]. Filter first conceptually, then transform — even though you read the expression first.",
        },
        {
          type: "scenario",
          id: "py10_sc_01",
          difficulty: "Medium",
          scenario:
            "A teammate submits: results = [process(r) for r in rows if validate(r)] — but process() also WRITES each record to the database, and the return value in results is never used.",
          question: "What's the code-review feedback?",
          options: [
            "Approve — it's concise and idiomatic",
            "Side effects belong in a plain for loop; comprehensions are for BUILDING lists you keep",
            "Add a second comprehension to capture the writes",
            "The validate() call should move into process()",
          ],
          correctIndex: 1,
          explanation:
            "A comprehension that exists for its side effects builds a throwaway list and disguises what the code does. `for r in rows: if validate(r): process(r)` says it honestly. Rule: comprehension when you keep the list, loop when you act.",
        },
        {
          type: "coding",
          id: "py10_code_01",
          difficulty: "Medium",
          prompt:
            "Given usernames = ['  Ada ', 'GRACE', ' alan'], build cleaned — each name stripped of whitespace and lowercased — using one comprehension. Print cleaned. Expected: ['ada', 'grace', 'alan']",
          starterCode: "usernames = ['  Ada ', 'GRACE', ' alan']\n# Your code here\n",
          solutionCode:
            "usernames = ['  Ada ', 'GRACE', ' alan']\ncleaned = [u.strip().lower() for u in usernames]\nprint(cleaned)",
          expectedOutput: "['ada', 'grace', 'alan']",
          tests: [
            {
              name: "Single comprehension",
              description: "One comprehension with chained .strip().lower() — no loop",
            },
            {
              name: "Order preserved",
              description: "Output order matches input order",
            },
          ],
        },
        {
          type: "coding",
          id: "py10_code_02",
          difficulty: "Hard",
          prompt:
            "Grades: scores = [88, 42, 95, 67, 55, 78]. In ONE comprehension build pass_fail where each score becomes 'pass' if 60 or above, else 'fail' — then print how many passed using .count(). Expected output:\n['pass', 'fail', 'pass', 'pass', 'fail', 'pass']\n4",
          starterCode: "scores = [88, 42, 95, 67, 55, 78]\n# Your code here\n",
          solutionCode:
            "scores = [88, 42, 95, 67, 55, 78]\npass_fail = ['pass' if s >= 60 else 'fail' for s in scores]\nprint(pass_fail)\nprint(pass_fail.count('pass'))",
          expectedOutput: "['pass', 'fail', 'pass', 'pass', 'fail', 'pass']\n4",
          tests: [
            {
              name: "Conditional expression position",
              description: "if-else must come before the for (transform, not filter)",
            },
            {
              name: "Same length as input",
              description: "All six scores produce a label",
            },
          ],
        },
        {
          type: "mcq",
          id: "py10_mcq_04",
          difficulty: "Hard",
          question:
            "Which is the best reason to REJECT a comprehension in review and ask for a plain loop?",
          options: [
            "The comprehension has a filter AND a transform",
            "It spans three lines with two nested fors and two ifs, and the reviewer had to expand it mentally to check it",
            "It calls a method inside the expression",
            "It uses tuple unpacking in the for clause",
          ],
          correctIndex: 1,
          explanation:
            "Filter+transform, method calls, and unpacking are all normal, healthy usage. Density that forces mental expansion defeats the entire point — comprehensions exist to be read at a glance, and when they can't be, the loop wins.",
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
            "What is a list comprehension, and what are its three clauses?",
          answer:
            "A list comprehension is an expression that builds a new list from an existing iterable in one statement: [expression for item in iterable if condition]. The for clause is the engine — identical to a loop header, binding each element to a name. The expression says what each element becomes in the output — unchanged, computed, or conditionally shaped with a value-if-else. The optional trailing if filters which elements participate at all. The mental model I'd give: it's exactly the initialize-loop-test-append pattern compressed, and any comprehension can be mechanically expanded back into that four-line loop, which is also the right debugging move when one gets confusing.",
        },
        {
          question:
            "Explain the difference between a trailing if and a leading if-else in a comprehension — including the effect on output length.",
          answer:
            "The trailing if — [x for x in xs if x > 0] — is a FILTER: it sits after the for, takes no else, and decides membership, so the output can be shorter than the input. The leading if-else — [x if x > 0 else 0 for x in xs] — is part of the EXPRESSION: it must have an else, every input element produces exactly one output element, and the length is always preserved. In data-cleaning terms, the trailing if drops bad rows while the leading if-else imputes or caps them — a genuine modeling decision disguised as syntax. The two also fail differently: writing a leading if without else is a SyntaxError, which is usually the first clue someone mixed up the positions.",
        },
        {
          question:
            "When would you deliberately choose a plain for loop over a comprehension?",
          answer:
            "Three cases. First, side effects: if the body writes to a database, prints, or calls an API, a loop states that honestly — a comprehension implies you want the list it builds, and building a throwaway list to smuggle side effects is misleading. Second, complexity: multiple nested fors, several conditions, or logic that no longer fits comfortably on a line — if the reviewer has to mentally expand it, the compression bought nothing. Third, complex accumulation: when iterations depend on previous state (running totals with resets, early exit with break — which comprehensions don't support), the loop's explicit state is clearer. The heuristic I actually use: comprehension when the sentence is 'build a list of X from Y', loop when the sentence contains 'and then' or 'unless'.",
        },
      ],
    },

    {
      id: "common-mistakes",
      type: "callout",
      variant: "warning",
      title: "Common Mistakes to Avoid",
      content:
        "1) Leading if without else — [x if x > 0 for x in xs] is a SyntaxError; filters go at the END. 2) Building a list you never use just to run side effects — use a loop. 3) Nesting comprehensions until they're write-only — expand to a loop when it stops fitting on a line. 4) Filtering when you meant to transform (silently changing the list's length and misaligning it with a paired list). 5) Shadowing an existing variable with the loop name — for n in ns leaks nothing in Python 3, but reusing a meaningful outer name still confuses readers. 6) Reaching for a comprehension over huge numeric data where NumPy vectorization is the real tool.",
    },

    {
      id: "ai-tutor",
      type: "callout",
      variant: "tip",
      title: "Ask the AI Tutor",
      content:
        "Try these prompts in the AI Tutor panel: • 'Give me five loops to convert into comprehensions, then check my answers.' • 'Show me a comprehension that's too clever and refactor it with me.' • 'Drill me on trailing-if vs leading-if-else with data cleaning examples.' • 'Preview how these comprehensions become pandas one-liners.' • 'Interview mode: ask me when NOT to use a comprehension and grade my answer.'",
    },

    {
      id: "glossary",
      type: "callout",
      variant: "info",
      title: "Glossary",
      content:
        "List comprehension — an expression building a new list: [expr for item in iterable if cond]. Expression (in a comprehension) — what each element becomes in the output. Filter clause — the trailing if that decides membership. Conditional expression — value-if-else used as the expression; always needs else. Transform — producing one output element per input element (length preserved). sum() — built-in that totals an iterable. .count(x) — list method counting occurrences of x. Winsorizing — capping outliers at a threshold instead of dropping them. Dict/set comprehension — the same syntax with braces, building dicts or sets. Side effect — an action beyond computing a value (writing, printing).",
    },

    {
      id: "resources",
      type: "callout",
      variant: "info",
      title: "Recommended Resources",
      content:
        "• Docs: 'List Comprehensions' in the official Python tutorial — every variation with examples. • Read: PEP 202, the two-page proposal that added comprehensions — a rare readable language-design document. • Practice: grep any Python codebase you have for 'for' and count how many loops are secretly comprehensions waiting to happen; convert three. • Next in DSM: with control flow complete, you'll stop writing scripts and start building tools — Defining & Calling Functions opens the Functions module, where logic gets a name, inputs, and a returned result.",
    },

    {
      id: "recap",
      type: "recap",
      tocLabel: "Recap",
      content:
        "✓ [expression for item in collection if condition] — transform on the left, iterate in the middle, filter on the right.\n✓ Read comprehensions from the for clause outward; expand to a loop when in doubt.\n✓ Trailing if filters (length may shrink); leading if-else transforms (length preserved).\n✓ Keep the list you build — side effects belong in loops.\n✓ Density is the enemy: one line, one idea, or write the loop.\n✓ Comprehensions train the apply-to-every-element thinking that NumPy and pandas run on.\n\nNext up: Defining & Calling Functions. Control Flow is complete — you can decide, repeat, steer, and build. Now you'll wrap that logic into named, reusable functions: the unit every pipeline, library, and test is made of.",
    },
  ],
};
