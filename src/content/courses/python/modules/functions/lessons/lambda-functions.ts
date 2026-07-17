import type { Lesson } from "@/lib/curriculum/types";

export const lambdaFunctions: Lesson = {
  meta: {
    id: "python.functions.lambda-functions",
    slug: "lambda-functions",
    title: "Lambda Functions",
    description:
      "One-expression functions without a name — the tiny tool behind sorted(key=...) and every df.apply() you'll ever write.",
    estimatedTime: "20 mins",
    difficulty: "Intermediate",
    xpReward: 60,
    prerequisites: ["python.functions.defining-functions"],
    masteryThreshold: 80,
  },

  blocks: [
    {
      id: "intro",
      type: "lesson-intro",
      tocLabel: "Introduction",
      intro: {
        hook: "Sometimes a function's entire job is one expression — double this, grab that field, test one condition — and it will be used exactly once, right here. Writing a def, naming it, and jumping away to read it is ceremony the moment doesn't need. Python has a word for exactly this: lambda.",
        what: "A lambda is an anonymous function written as a single expression: lambda x: x * 2. It takes arguments before the colon, evaluates the expression after it, and returns the result — no def, no name, no return keyword.",
        why: "Lambdas exist to be passed to OTHER functions: sorted(key=...), max(key=...), and — the one that matters most for your future — pandas' df['col'].apply(...). Data code is dense with tiny throwaway transforms, and lambda is their natural syntax.",
        whereUsed:
          "Sort keys, min/max keys, one-off transforms in .apply() and .map(), and quick predicates handed to filtering utilities.",
        objectives: [
          "Write single-expression lambdas with one or more arguments",
          "Pass lambdas as sort/min/max keys",
          "Use conditional expressions inside lambdas",
          "Decide when a lambda hurts readability and a def is owed",
          "Preview the .apply() pattern that pandas runs on",
        ],
        realWorldApps: [
          {
            company: "pandas",
            headline: "df.apply everywhere",
            detail:
              "df['price_eur'] = df['price_usd'].apply(lambda p: p * 0.92) — the single most common lambda in data science, run millions of times a day across the industry.",
          },
          {
            company: "Spotify",
            headline: "Playlist sort keys",
            detail:
              "Ranking candidates get sorted by computed keys — sorted(tracks, key=lambda t: t[1], reverse=True) — before heavier scoring models run.",
          },
          {
            company: "AWS",
            headline: "The other Lambda",
            detail:
              "AWS named its serverless product after this concept: a small function invoked on demand. Knowing the Python keyword is table stakes when both appear in one job description.",
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
            "Syntax: lambda parameters: expression. The expression's value is the return value — automatically, with no return keyword (writing one is a SyntaxError). lambda x, y: x + y takes two arguments; lambda: 42 takes none. That's the entire feature: one expression, nothing else — no statements, no loops, no assignments.",
        },
        {
          type: "code-note",
          code: "double = lambda x: x * 2\nprint(double(5))  # 10\n\n# ...which is exactly equivalent to:\ndef double(x):\n    return x * 2",
          content:
            "Assigning a lambda to a name (top) proves it's a real function — but note the irony: if you're NAMING it, a def was clearer and gives better error messages. PEP 8 explicitly says prefer def for named functions. The legitimate home of a lambda is inline, unnamed, at the point of use.",
        },
        {
          type: "analogy",
          title: "The sticky note vs the recipe card",
          content:
            "A def is a recipe card: titled, filed, reusable — worth writing when the dish will be cooked again. A lambda is a sticky note on the counter: 'halve THIS lemon'. Nobody titles a sticky note or files it in the binder; its whole life is one moment of use. Put a recipe on a sticky note and it becomes unreadable — which is precisely what an overgrown lambda is.",
        },
        {
          type: "keypoint",
          title: "The key= pattern: functions as sorting instructions",
          content:
            "sorted(), min(), and max() accept a key argument: a FUNCTION applied to each element, whose result is compared instead of the element itself. sorted(words, key=len) sorts by length; sorted(rows, key=lambda r: r[1]) sorts rows by their second field. This works because functions are values (as you saw with the timed wrapper) — lambda just lets you write the value inline.",
        },
        {
          type: "code-note",
          code: "products = [('mouse', 25.0), ('laptop', 899.0), ('cable', 8.5)]\nby_price = sorted(products, key=lambda p: p[1])\nprint(by_price[0])   # cheapest first\ncheapest = min(products, key=lambda p: p[1])\nprint(cheapest)",
          content:
            "The lambda extracts the comparison value from each tuple. Without key=, Python would compare the tuples element-by-element, sorting alphabetically by name — legal, but not what the analysis wanted.",
        },
        {
          type: "expandable",
          title: "Conditionals inside lambdas",
          content:
            "The value-if-else conditional EXPRESSION (from List Comprehensions) is legal in a lambda because it's an expression: lambda x: 'high' if x > 100 else 'low'. This is the workhorse of pandas labeling — df['tier'] = df['spend'].apply(lambda s: 'vip' if s > 1000 else 'standard'). One condition reads fine; two nested ones is the readability cliff — name a def instead.",
        },
        {
          type: "warning",
          title: "Know the cliff",
          content:
            "Lambdas can't contain statements (no loops, no assignments, no try), can't have docstrings, and show up in tracebacks as anonymous '<lambda>' — three reasons complex logic doesn't belong in them. The smell test: if your lambda needs parentheses-gymnastics to fit on a line, or you had to read it twice, it's a def in disguise. Extracting it costs four lines and buys a name, a docstring, and a testable unit.",
        },
      ],
    },

    {
      id: "diagram",
      type: "interactive-diagram",
      tocLabel: "Visual Learning",
      visual: {
        kind: "comparison",
        title: "def vs lambda — same machine, different packaging",
        caption:
          "Both produce a function object. Click each side to see what you gain and give up.",
        nodes: [
          {
            id: "def",
            label: "def net(p):",
            sublabel: "named, multi-line",
            detail:
              "A def gets a name (better tracebacks), a docstring, statements, loops, guards — the full language. Cost: four lines and a jump for the reader. Choose when logic is reused, tested, or bigger than one expression.",
            x: 25,
            y: 35,
            accent: false,
          },
          {
            id: "lambda",
            label: "lambda p: p * 0.9",
            sublabel: "anonymous, one expression",
            detail:
              "A lambda is the expression and nothing else — defined at the exact point of use, no name, no jump. Cost: no statements, no docstring, '<lambda>' in errors. Choose for one-shot keys and transforms.",
            x: 75,
            y: 35,
            accent: true,
          },
          {
            id: "value",
            label: "a function object",
            sublabel: "both produce this",
            detail:
              "Either way you get a callable value that can be stored, passed to sorted(key=...), or applied over a column. The choice is packaging and readability, not capability of the resulting call.",
            x: 50,
            y: 75,
            accent: false,
          },
        ],
        edges: [
          { from: "def", to: "value", label: "binds a name" },
          { from: "lambda", to: "value", label: "stays anonymous" },
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
          title: "A lambda is just a tiny function",
          scenario: "Convert one temperature, two ways, to see the equivalence.",
          steps: [
            {
              code: "to_f = lambda c: c * 9 / 5 + 32\nprint(to_f(100))",
              explanation:
                "Parameters before the colon, expression after, result returned automatically. (Named here only to demonstrate — a def would be the better named version.)",
            },
          ],
          output: "212.0",
        },
        {
          difficulty: "Easy",
          title: "Sorting with a key",
          scenario: "Sort survey responses by their length to review the shortest first.",
          steps: [
            {
              code: "responses = ['great service', 'ok', 'too slow on weekends']",
              explanation: "Three free-text responses of different lengths.",
            },
            {
              code: "by_length = sorted(responses, key=len)\nprint(by_length)",
              explanation:
                "key=len passes the built-in len function itself — no lambda needed when a ready-made function already computes your key. Each element is measured, and the measurements determine the order.",
            },
            {
              code: "by_last_word = sorted(responses, key=lambda r: r.split()[-1])\nprint(by_last_word)",
              explanation:
                "No built-in extracts 'the last word', so NOW a lambda earns its place: split each response and compare final words ('service', 'ok', 'weekends' → alphabetical).",
            },
          ],
          output:
            "['ok', 'great service', 'too slow on weekends']\n['ok', 'great service', 'too slow on weekends']",
        },
        {
          difficulty: "Medium",
          title: "min/max with computed keys",
          scenario: "From (city, revenue, cost) rows, find the most and least PROFITABLE city.",
          steps: [
            {
              code: "cities = [('austin', 120000, 87000), ('denver', 98000, 61000), ('miami', 145000, 132000)]",
              explanation:
                "Profit isn't stored — it's revenue minus cost, computed per row.",
            },
            {
              code: "best = max(cities, key=lambda c: c[1] - c[2])\nworst = min(cities, key=lambda c: c[1] - c[2])",
              explanation:
                "The lambda computes profit for each row; max/min compare those computed values but return the ORIGINAL row. Austin: 33k, Denver: 37k, Miami: 13k.",
            },
            {
              code: "print(f'best: {best[0]}, worst: {worst[0]}')",
              explanation:
                "This is 'argmax by a derived metric' in one line — a shape you'll reuse weekly in analysis code.",
            },
          ],
          output: "best: denver, worst: miami",
        },
        {
          difficulty: "Hard",
          title: "The readability cliff — and stepping back from it",
          scenario:
            "Label transactions by risk. Watch a lambda grow past its limit, then refactor honestly.",
          steps: [
            {
              code: "txs = [(4200, 'foreign'), (90, 'domestic'), (15000, 'foreign'), (700, 'domestic')]",
              explanation: "(amount, origin) pairs to be labeled.",
            },
            {
              code: "labels = [(lambda t: 'high' if t[0] > 10000 else ('medium' if t[0] > 1000 and t[1] == 'foreign' else 'low'))(t) for t in txs]\nprint(labels)",
              explanation:
                "It WORKS — and it's unreadable: nested conditionals, tuple indexing, a lambda defined and immediately called. Code review should (rightly) reject this line.",
            },
            {
              code: "def risk(amount, origin):\n    \"\"\"Tiered risk label for a transaction.\"\"\"\n    if amount > 10000:\n        return 'high'\n    if amount > 1000 and origin == 'foreign':\n        return 'medium'\n    return 'low'\n\nlabels = [risk(a, o) for (a, o) in txs]\nprint(labels)",
              explanation:
                "The def version: named, guarded with early returns, unpacked parameters, testable in isolation. Same output, honest packaging. Knowing WHEN to abandon a lambda is the actual skill.",
            },
          ],
          output:
            "['medium', 'low', 'high', 'low']\n['medium', 'low', 'high', 'low']",
        },
        {
          difficulty: "Industry Example",
          title: "The .apply() preview: lambdas over a column",
          scenario:
            "A data analyst cleans a scraped discount column the pandas way — but with plain lists, so every piece is already familiar. When df['col'].apply(...) arrives in the Data Analysis course, it will be THIS pattern verbatim.",
          steps: [
            {
              code: "def apply_to(values, func):\n    \"\"\"Return func applied to each value — a mini Series.apply.\"\"\"\n    return [func(v) for v in values]",
              explanation:
                "A five-line stand-in for pandas' .apply: it takes a FUNCTION as data (the higher-order idea the timed wrapper introduced) and maps it over a column.",
            },
            {
              code: "raw_discounts = ['10%', '25%', '5%', '40%']\nas_fractions = apply_to(raw_discounts, lambda d: float(d.replace('%', '')) / 100)\nprint(as_fractions)",
              explanation:
                "The lambda is the per-cell recipe: strip the %, parse, scale. Exactly what you'd write as df['discount'].apply(lambda d: float(d.replace('%','')) / 100).",
            },
            {
              code: "tiers = apply_to(as_fractions, lambda f: 'deep' if f >= 0.25 else 'standard')\nprint(tiers)",
              explanation:
                "A second pass labels each value with a one-condition conditional — the lambda sweet spot. Two clean transforms, each one line, each stating its whole logic at the point of use.",
            },
          ],
          output:
            "[0.1, 0.25, 0.05, 0.4]\n['standard', 'deep', 'standard', 'deep']",
        },
      ],
    },

    {
      id: "inline-practice",
      type: "inline-code",
      tocLabel: "Practice Coding",
      coding: {
        language: "python",
        filename: "leaderboard.py",
        instructions:
          "A coding-contest leaderboard stores (name, score, minutes) tuples. Using lambdas as keys: (1) sort by score, highest first; (2) find the fastest contestant; (3) sort by score-per-minute efficiency, highest first. Print the results shown.",
        starterCode: `entries = [('ada', 940, 62), ('kai', 880, 45), ('mia', 990, 88)]

# TODO 1: by_score — sorted by score, highest first (reverse=True)
by_score = ___

# TODO 2: fastest — the entry with the smallest minutes
fastest = ___

# TODO 3: by_efficiency — sorted by score/minutes, highest first
by_efficiency = ___

print([e[0] for e in by_score])
print(fastest[0])
print([e[0] for e in by_efficiency])`,
        solutionCode: `entries = [('ada', 940, 62), ('kai', 880, 45), ('mia', 990, 88)]

by_score = sorted(entries, key=lambda e: e[1], reverse=True)

fastest = min(entries, key=lambda e: e[2])

by_efficiency = sorted(entries, key=lambda e: e[1] / e[2], reverse=True)

print([e[0] for e in by_score])
print(fastest[0])
print([e[0] for e in by_efficiency])`,
        expectedOutput: "['mia', 'ada', 'kai']\nkai\n['kai', 'ada', 'mia']",
        hints: [
          "Each entry is (name, score, minutes): e[0] name, e[1] score, e[2] minutes",
          "TODO 1: sorted(entries, key=lambda e: e[1], reverse=True)",
          "TODO 2: min with key=lambda e: e[2] — smallest minutes wins",
          "TODO 3: the key computes e[1] / e[2]; kai's 19.6 beats ada's 15.2 and mia's 11.25",
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
          id: "py15_mcq_01",
          difficulty: "Easy",
          question: "What does (lambda x, y: x * y)(3, 4) evaluate to?",
          options: ["12", "A function object", "34", "A SyntaxError"],
          correctIndex: 0,
          explanation:
            "The parentheses around the lambda create the function; (3, 4) immediately calls it. Defining-and-calling inline is legal (if rarely wise): 3 * 4 = 12.",
        },
        {
          type: "mcq",
          id: "py15_mcq_02",
          difficulty: "Easy",
          question: "Which is ILLEGAL inside a lambda's body?",
          options: [
            "A conditional expression: 'a' if x else 'b'",
            "An assignment statement: total = x + y",
            "A method call: x.strip()",
            "Arithmetic: x * 2 + 1",
          ],
          correctIndex: 1,
          explanation:
            "A lambda's body is ONE expression. Assignments, loops, try, and return are statements — none can appear. Conditional expressions, calls, and arithmetic are all expressions and fine.",
        },
        {
          type: "mcq",
          id: "py15_mcq_03",
          difficulty: "Medium",
          question:
            "words = ['banana', 'Fig', 'apple'] — which call sorts case-insensitively?",
          options: [
            "sorted(words)",
            "sorted(words, key=lambda w: w.lower())",
            "sorted(words, reverse=True)",
            "sorted(words.lower())",
          ],
          correctIndex: 1,
          explanation:
            "The key lowercases each word FOR COMPARISON ONLY — originals appear in the output. Plain sorted() puts 'Fig' first because uppercase sorts before lowercase; D fails because lists have no .lower().",
        },
        {
          type: "scenario",
          id: "py15_sc_01",
          difficulty: "Medium",
          scenario:
            "In review you find: parse = lambda row: row.split(',')[2].strip().upper() if len(row.split(',')) > 2 else 'MISSING' — assigned to a name and reused in four modules.",
          question: "What's the right feedback?",
          options: [
            "Approve — lambdas are idiomatic Python",
            "Convert to a def: it's named, reused, complex, splits the row twice, and deserves a docstring and tests",
            "Inline it at each call site instead of naming it",
            "Rewrite it as a comprehension",
          ],
          correctIndex: 1,
          explanation:
            "Every signal points to def: it has a NAME (PEP 8 says use def), it's REUSED (deserves tests), it's COMPLEX (two splits, a conditional), and it can't carry a docstring. Lambdas are for anonymous, one-shot, one-expression moments — this is none of those.",
        },
        {
          type: "coding",
          id: "py15_code_01",
          difficulty: "Medium",
          prompt:
            "orders = [('A-102', 84.0), ('A-101', 210.0), ('A-103', 42.5)]. Using sorted with a lambda key, print the order IDs from most to least expensive. Expected output: ['A-101', 'A-102', 'A-103']",
          starterCode:
            "orders = [('A-102', 84.0), ('A-101', 210.0), ('A-103', 42.5)]\n# Your code here\n",
          solutionCode:
            "orders = [('A-102', 84.0), ('A-101', 210.0), ('A-103', 42.5)]\nby_price = sorted(orders, key=lambda o: o[1], reverse=True)\nprint([o[0] for o in by_price])",
          expectedOutput: "['A-101', 'A-102', 'A-103']",
          tests: [
            {
              name: "Lambda key",
              description: "sorted uses key=lambda o: o[1] with reverse=True",
            },
            {
              name: "IDs only",
              description: "Output extracts the IDs via a comprehension",
            },
          ],
        },
        {
          type: "mcq",
          id: "py15_mcq_04",
          difficulty: "Hard",
          question:
            "Why does PEP 8 say `f = lambda x: x + 1` should be `def f(x): return x + 1`?",
          options: [
            "Lambdas are slower to call",
            "The def gives the function a real name for tracebacks and introspection — assigning a lambda to a name buys none of lambda's benefits and keeps its costs",
            "Lambdas leak memory",
            "Lambdas can't take arguments named x",
          ],
          correctIndex: 1,
          explanation:
            "A lambda's only advantage is anonymity at the point of use. Once you name it, you've given that up while keeping the downsides: '<lambda>' in error messages, no docstring, one-expression limit. Performance is identical — this is purely about tooling and readability.",
        },
        {
          type: "coding",
          id: "py15_code_02",
          difficulty: "Hard",
          prompt:
            "readings = [3.2, -1.5, 4.8, -0.2] — using max with a lambda key, find the reading with the largest ABSOLUTE deviation (use abs), and print it. Expected output: 4.8",
          starterCode: "readings = [3.2, -1.5, 4.8, -0.2]\n# Your code here\n",
          solutionCode:
            "readings = [3.2, -1.5, 4.8, -0.2]\nextreme = max(readings, key=lambda r: abs(r))\nprint(extreme)",
          expectedOutput: "4.8",
          tests: [
            {
              name: "Key transforms comparison",
              description: "max compares abs values but returns the original reading",
            },
            {
              name: "Handles negatives",
              description: "-1.5 competes as 1.5 but 4.8 still wins",
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
          question: "What is a lambda and how does it differ from a def?",
          answer:
            "A lambda is an anonymous function consisting of exactly one expression: lambda x: x * 2 takes arguments before the colon and returns the expression's value with no return keyword. Both lambda and def produce ordinary function objects — the differences are packaging. A def gets a name (which appears in tracebacks and profilers), a docstring, and the full statement language: loops, guards, assignments, try/except. A lambda gets brevity and locality — it's defined at the exact point of use — but is limited to one expression, shows as '<lambda>' in errors, and can't be documented. The intended division of labor: lambda for small throwaway functions passed inline to sorted, min, max, or apply; def for anything named, reused, tested, or multi-step.",
        },
        {
          question:
            "Explain how key= works in sorted(), and why it's more efficient than it looks.",
          answer:
            "key takes a function that's applied to each element once; sorting then compares those computed key values while returning the original elements in the resulting order. sorted(rows, key=lambda r: r[1]) sorts rows by their second field; key=len sorts by length; key=str.lower gives case-insensitive order. The efficiency point worth stating: Python computes each key exactly once and caches it — a 'decorate-sort-undecorate' under the hood — so an expensive key function costs N calls, not N·log N comparisons' worth. Two refinements interviewers like: returning a tuple from the key gives multi-level sorting (key=lambda r: (r[2], r[0]) sorts by third field then first), and when a ready-made function already computes your key — len, str.lower — pass it directly instead of wrapping it in a lambda.",
        },
        {
          question:
            "Where do you draw the line between a lambda and extracting a def in data code?",
          answer:
            "My working rules. Lambda: one expression, one condition at most, used once, inline at the call — the classic df['x'].apply(lambda v: v * 0.92) or a sort key extracting a field. Def the moment ANY of these appear: the logic needs a second conditional or any statement; the same lambda shows up twice (duplication means it deserves a name and a test); the transform embodies a business rule someone will ask about later (rules deserve docstrings); or debugging matters, since a named function turns '<lambda>' in a traceback into something greppable. There's also a middle path people forget: many lambdas wrapping a single call — lambda s: s.strip() — should just pass the underlying function itself, str.strip. The goal isn't avoiding lambdas; it's that each one should be readable at a glance, because at-a-glance is the only advantage it has.",
        },
      ],
    },

    {
      id: "common-mistakes",
      type: "callout",
      variant: "warning",
      title: "Common Mistakes to Avoid",
      content:
        "1) Writing return inside a lambda — SyntaxError; the expression IS the return. 2) Naming lambdas (f = lambda ...) — PEP 8 says def, and tracebacks agree. 3) Nesting conditionals two deep in a lambda — extract a def at the readability cliff. 4) lambda s: len(s) where plain len does the job — don't wrap what already exists. 5) Forgetting key= compares transformed values but returns ORIGINALS (don't re-transform the result). 6) Statements in the body (assignments, loops) — a lambda is one expression, full stop.",
    },

    {
      id: "ai-tutor",
      type: "callout",
      variant: "tip",
      title: "Ask the AI Tutor",
      content:
        "Try these prompts in the AI Tutor panel: • 'Quiz me on five sorted(key=...) calls — what order comes out?' • 'Show me a lambda that should be a def and refactor it with me.' • 'Explain multi-level sorting with tuple keys.' • 'Preview three pandas .apply() lambdas I'll write in the Data Analysis course.' • 'Interview mode: ask me lambda vs def trade-offs and grade my answer.'",
    },

    {
      id: "glossary",
      type: "callout",
      variant: "info",
      title: "Glossary",
      content:
        "lambda — keyword creating an anonymous single-expression function. Anonymous function — a function without a bound name. key= — parameter of sorted/min/max taking a function whose results are compared. reverse=True — sorts descending. Conditional expression — value-if-else, legal in lambdas. Predicate — a function returning True/False. .apply() — the pandas method mapping a function over a column (previewed here). Readability cliff — the point where a lambda's density defeats its brevity. sorted() — built-in returning a NEW sorted list, original untouched.",
    },

    {
      id: "resources",
      type: "callout",
      variant: "info",
      title: "Recommended Resources",
      content:
        "• Docs: 'Lambda Expressions' in the official Python tutorial, and the sorted() how-to guide — the tuple-key trick lives there. • Read: PEP 8's short paragraph on lambda assignment; it settles a real code-review argument in two sentences. • Practice: sort one list of tuples four ways — by each field, then by a computed combination — using only key lambdas. • Next in DSM: lambdas are functions passed as values; Higher-Order Functions makes that idea first-class — map, filter, and functions that build functions.",
    },

    {
      id: "recap",
      type: "recap",
      tocLabel: "Recap",
      content:
        "✓ lambda params: expression — one expression, auto-returned, no name.\n✓ Built to be passed inline: sorted/min/max key=, and pandas .apply() soon.\n✓ key= compares transformed values but returns the original elements.\n✓ One condition fits; at two, or any statement, extract a def.\n✓ Never name a lambda — a def gives tracebacks, docstrings, and tests.\n✓ Don't wrap existing functions — pass len, not lambda x: len(x).\n\nNext up: Higher-Order Functions. You've been passing functions as values all lesson — now we make that the headline: map, filter, and functions that take (or return) other functions.",
    },
  ],
};
