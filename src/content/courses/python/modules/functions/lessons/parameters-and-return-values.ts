import type { Lesson } from "@/lib/curriculum/types";

export const parametersAndReturnValues: Lesson = {
  meta: {
    id: "python.functions.parameters-and-return-values",
    slug: "parameters-and-return-values",
    title: "Parameters, Arguments & Return Values",
    description:
      "Master what flows into and out of a function — positional arguments, multiple returns, None, and early exits.",
    estimatedTime: "30 mins",
    difficulty: "Beginner",
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
        hook: "A function is a contract: give me THESE inputs, get back THIS output. Fuzzy contracts cause the bugs that eat afternoons — wrong argument order, forgotten returns, a None where a number should be. This lesson makes you precise about both sides of the arrow.",
        what: "Parameters are the names a function declares; arguments are the values a caller supplies, matched by position. return ends the call and delivers a value — or several, or None if you don't return at all.",
        why: "Data pipelines are functions wired output-to-input. One function quietly returning None, or arguments passed in the wrong order, breaks the chain in ways that surface far from the cause. Understanding the contract is understanding where pipelines break.",
        whereUsed:
          "Every function you write or call: sklearn's fit(X, y) argument order, functions returning (train, test) pairs, validators returning a value or None.",
        objectives: [
          "Match positional arguments to parameters correctly",
          "Return multiple values with tuples and unpack them",
          "Handle functions that return None — deliberately or accidentally",
          "Use early returns to simplify branching logic",
          "Trace what a call expression evaluates to",
        ],
        realWorldApps: [
          {
            company: "scikit-learn",
            headline: "train_test_split's multiple returns",
            detail:
              "The most-called line in ML — X_train, X_test, y_train, y_test = train_test_split(X, y) — is a function returning four values as a tuple, unpacked in one assignment.",
          },
          {
            company: "Slack",
            headline: "Validators returning value-or-None",
            detail:
              "Message-parsing functions return the parsed object or None; callers write `if parsed:` — the value-or-None contract keeps malformed input from crashing channels.",
          },
          {
            company: "Toyota",
            headline: "Sensor calibration chains",
            detail:
              "Factory calibration software chains conversion functions, each output feeding the next input — one function's misordered arguments would mis-calibrate a production line.",
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
            "By default, arguments match parameters by POSITION: the first argument lands in the first parameter, second in second. def net_price(gross, discount) called as net_price(100, 0.2) binds gross=100, discount=0.2. Swap the arguments and Python won't complain — you just get a silently wrong answer. Position is meaning.",
        },
        {
          type: "analogy",
          title: "The airport check-in form",
          content:
            "A paper form has labeled boxes in fixed positions: surname first, then given name. Fill them in the wrong order and the airline happily prints a boarding pass for 'Ada Lovelace' reversed — the SYSTEM accepted it; the MEANING broke. Positional arguments are those boxes: the function trusts you filled them in declaration order.",
        },
        {
          type: "code-note",
          code: "def describe(value, decimals):\n    return f'{round(value, decimals)}'\n\nprint(describe(3.14159, 2))  # 3.14  — correct order\nprint(describe(2, 3.14159))  # 2     — legal, meaningless",
          content:
            "Both calls run. Only one is right. When a function grows past two or three parameters, this fragility is why keyword arguments exist — next lesson's topic.",
        },
        {
          type: "keypoint",
          title: "return ends the call — immediately",
          content:
            "return does two jobs at once: it delivers a value AND terminates the function on the spot. Any code after an executed return never runs. That's not a limitation — it's the tool: 'early returns' handle edge cases at the top (return the answer for the easy case now) so the main logic below stays flat. You met this shape as guard clauses; return is what powers them.",
        },
        {
          type: "code-note",
          code: "def safe_average(values):\n    if len(values) == 0:\n        return 0.0\n    return sum(values) / len(values)\n\nprint(safe_average([10, 20, 30]))  # 20.0\nprint(safe_average([]))            # 0.0 — no crash",
          content:
            "Two returns, one function: the guard exits early for the empty case (preventing a division by zero), and the main return handles real data. Multiple return statements are normal, healthy Python.",
        },
        {
          type: "text",
          content:
            "To return several values, return them separated by commas — Python packs them into a tuple — and unpack at the call site with matching names: `low, high = min_max(data)`. This is the idiom behind train_test_split's four-way return, and you've already used its cousin in for day, temp in enumerate(temps).",
        },
        {
          type: "expandable",
          title: "None: the value of no return",
          content:
            "A function that finishes without hitting a return statement returns None automatically — as does a bare `return` with no value. Sometimes None is a deliberate contract: 'I return the parsed value, or None if I couldn't'. Callers then test `if result is not None:` (or just `if result:` when falsy values can't be legitimate). But an ACCIDENTAL None — you computed the answer and forgot the return line — is one of Python's most common beginner bugs, surfacing later as 'TypeError: unsupported operand ... NoneType'.",
        },
        {
          type: "warning",
          title: "Arity errors and silent swaps",
          content:
            "Passing the wrong NUMBER of arguments fails loudly: 'missing 1 required positional argument' or 'takes 2 but 3 were given' — read these carefully, they name the function and count. Passing the wrong ORDER with compatible types fails silently — no error, wrong result. Loud failures cost minutes; silent ones cost afternoons. Defend with clear parameter names, few parameters, and (next lesson) keyword arguments.",
        },
      ],
    },

    {
      id: "diagram",
      type: "interactive-diagram",
      tocLabel: "Visual Learning",
      visual: {
        kind: "flow",
        title: "The call contract: in by position, out by return",
        caption:
          "split_bill(96.0, 3) from both sides of the arrow. Click each stage.",
        nodes: [
          {
            id: "args",
            label: "(96.0, 3)",
            sublabel: "arguments",
            detail:
              "The caller supplies values in order. Python evaluates each expression first — split_bill(total * 1.2, guests) passes the RESULTS, not the expressions.",
            x: 10,
            y: 40,
            accent: false,
          },
          {
            id: "bind",
            label: "amount=96.0, people=3",
            sublabel: "binding by position",
            detail:
              "First argument → first parameter, second → second. The function body sees only the parameter names; it neither knows nor cares what the caller called them.",
            x: 36,
            y: 40,
            accent: true,
          },
          {
            id: "body",
            label: "share = amount / people",
            sublabel: "body computes",
            detail: "The body works with its parameters like any variables: 96.0 / 3 = 32.0.",
            x: 62,
            y: 40,
            accent: false,
          },
          {
            id: "ret",
            label: "return round(share, 2)",
            sublabel: "value out",
            detail:
              "return terminates the call and delivers 32.0. If this line were missing, the caller would receive None instead — the classic forgotten-return bug.",
            x: 84,
            y: 40,
            accent: false,
          },
          {
            id: "caller",
            label: "each = split_bill(96.0, 3)",
            sublabel: "call becomes value",
            detail:
              "At the call site, the whole expression now stands for 32.0 and is assigned to each. Returned values compose; printed values don't.",
            x: 50,
            y: 75,
            accent: false,
          },
        ],
        edges: [
          { from: "args", to: "bind", label: "by position" },
          { from: "bind", to: "body" },
          { from: "body", to: "ret" },
          { from: "ret", to: "caller", label: "32.0" },
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
          title: "Two parameters, one return",
          scenario: "Compute the price per unit for a bulk purchase.",
          steps: [
            {
              code: "def unit_price(total_cost, units):\n    return total_cost / units",
              explanation:
                "Two positional parameters. The function's whole job fits in the return line.",
            },
            {
              code: "print(unit_price(24.0, 8))",
              explanation:
                "24.0 binds to total_cost, 8 to units — by position. The call evaluates to 3.0.",
            },
          ],
          output: "3.0",
        },
        {
          difficulty: "Easy",
          title: "The forgotten return",
          scenario: "Diagnose the most common function bug in existence.",
          steps: [
            {
              code: "def double_broken(n):\n    result = n * 2\n\nprint(double_broken(5))",
              explanation:
                "The body computes 10... and drops it. No return means the function returns None, so the print shows None — not an error, just a missing value that will crash something LATER.",
            },
            {
              code: "def double(n):\n    return n * 2\n\nprint(double(5))",
              explanation:
                "One keyword fixes it. When a function 'mysteriously returns None', check for a computed value that never made it to a return.",
            },
          ],
          output: "None\n10",
        },
        {
          difficulty: "Medium",
          title: "Multiple returns via tuple + unpacking",
          scenario: "Summarize a dataset's range in one call: min, max, and span.",
          steps: [
            {
              code: "def value_range(values):\n    \"\"\"Return (lowest, highest, span) for a list of numbers.\"\"\"\n    lowest = min(values)\n    highest = max(values)\n    return lowest, highest, highest - lowest",
              explanation:
                "Three comma-separated values pack into one tuple. min() and max() are built-ins doing the accumulator loops from For Loops for you.",
            },
            {
              code: "temps = [18.5, 24.1, 21.3, 15.9, 26.7]\nlow, high, span = value_range(temps)",
              explanation:
                "Unpacking mirrors the pack: three names on the left for three values in the tuple. Count mismatch raises a ValueError immediately — a LOUD failure, thankfully.",
            },
            {
              code: "print(f'low {low}, high {high}, span {span:.1f}')",
              explanation:
                "Same shape as sklearn's X_train, X_test, y_train, y_test = train_test_split(...) — you now read that line fluently.",
            },
          ],
          output: "low 15.9, high 26.7, span 10.8",
        },
        {
          difficulty: "Hard",
          title: "Early returns replace nested branching",
          scenario:
            "Classify a credit application with tiered rules — written flat with early returns instead of a pyramid of elifs.",
          steps: [
            {
              code: "def assess(income, debt, missed_payments):\n    \"\"\"Return an application decision string.\"\"\"\n    if missed_payments > 2:\n        return 'declined: payment history'",
              explanation:
                "The knockout rule exits first. Everything below can safely assume missed_payments <= 2 — each early return strengthens what the remaining code knows.",
            },
            {
              code: "    if income <= 0:\n        return 'declined: no verifiable income'\n    debt_ratio = debt / income",
              explanation:
                "Second guard both enforces a rule AND makes the division below it mathematically safe. Guards often do double duty like this.",
            },
            {
              code: "    if debt_ratio > 0.4:\n        return 'referred: high debt ratio'\n    return 'approved'",
              explanation:
                "The remaining path is a straight line — no else needed anywhere, because every return already left. Four outcomes, zero nesting.",
            },
            {
              code: "print(assess(52000, 31000, 0))\nprint(assess(52000, 12000, 0))\nprint(assess(52000, 12000, 3))",
              explanation:
                "31000/52000 ≈ 0.596 → referred; 12000/52000 ≈ 0.23 → approved; 3 missed payments → knocked out before income is even read.",
            },
          ],
          output:
            "referred: high debt ratio\napproved\ndeclined: payment history",
        },
        {
          difficulty: "Industry Example",
          title: "A parse-or-None contract in an ingestion pipeline",
          scenario:
            "A data engineer writes the standard 'try to parse, return None on failure' function for a currency column, and the caller aggregates what survives — the value-or-None pattern running in every ETL job.",
          steps: [
            {
              code: "def parse_price(cell):\n    \"\"\"Return the price as a float, or None if unparseable.\"\"\"\n    cleaned = cell.strip().replace('$', '').replace(',', '')\n    if cleaned.replace('.', '', 1).isdigit():\n        return float(cleaned)\n    return None",
              explanation:
                "The contract is in the docstring: float or None, never a crash. Validate-then-convert from Type Conversion, wrapped in a reusable, testable unit.",
            },
            {
              code: "raw = [' $1,299.00', '$45.50', 'call us', '$0.99', '']\nparsed = [parse_price(c) for c in raw]\nprint(parsed)",
              explanation:
                "The comprehension maps the parser over the column. Failures become None IN PLACE — the list still aligns with the original rows, which matters for reporting which rows failed.",
            },
            {
              code: "prices = [p for p in parsed if p is not None]\nfailed = len(parsed) - len(prices)\nprint(f'parsed {len(prices)}, failed {failed}, total ${sum(prices):.2f}')",
              explanation:
                "`is not None` — not truthiness — because a legitimate $0.00 price would be falsy and wrongly dropped. The failure count is reported, not swallowed (the loop-control lesson's discipline).",
            },
          ],
          output:
            "[1299.0, 45.5, None, 0.99, None]\nparsed 3, failed 2, total $1345.49",
        },
      ],
    },

    {
      id: "inline-practice",
      type: "inline-code",
      tocLabel: "Practice Coding",
      coding: {
        language: "python",
        filename: "grades.py",
        instructions:
          "Write grade_stats(scores) that returns THREE values: the average (rounded to 1 decimal), the highest score, and how many scores passed (60+). Guard the empty-list case by returning (0.0, 0, 0). Unpack and print the results for the class list provided.",
        starterCode: `scores = [72, 45, 91, 88, 59, 63]

# TODO 1: define grade_stats(scores) returning (average, highest, passed)
# Guard: an empty list returns (0.0, 0, 0)
___

# TODO 2: call it and unpack into avg, top, passed
___

print(f"Average: {avg}")
print(f"Top: {top}")
print(f"Passed: {passed}")`,
        solutionCode: `scores = [72, 45, 91, 88, 59, 63]

def grade_stats(scores):
    """Return (average, highest, passed_count) for a score list."""
    if len(scores) == 0:
        return 0.0, 0, 0
    average = round(sum(scores) / len(scores), 1)
    highest = max(scores)
    passed = len([s for s in scores if s >= 60])
    return average, highest, passed

avg, top, passed = grade_stats(scores)

print(f"Average: {avg}")
print(f"Top: {top}")
print(f"Passed: {passed}")`,
        expectedOutput: "Average: 69.7\nTop: 91\nPassed: 4",
        hints: [
          "Start with the guard: if len(scores) == 0: return 0.0, 0, 0",
          "Return three comma-separated values — Python packs them into a tuple",
          "Count passes with a filtered comprehension inside len()",
          "Unpack with three names: avg, top, passed = grade_stats(scores)",
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
          id: "py12_mcq_01",
          difficulty: "Easy",
          question:
            "def area(width, height): return width * height — what does area(3, 4) bind?",
          options: [
            "width=4, height=3",
            "width=3, height=4",
            "Both to 3",
            "It depends on the names at the call site",
          ],
          correctIndex: 1,
          explanation:
            "Positional matching: first argument to first parameter. The caller's variable names are irrelevant — only order counts.",
        },
        {
          type: "mcq",
          id: "py12_mcq_02",
          difficulty: "Easy",
          question:
            "What does a function return if execution reaches the end of its body without any return statement?",
          options: ["0", "False", "None", "An empty string"],
          correctIndex: 2,
          explanation:
            "No return (or a bare `return`) yields None. The bug signature: your variable is None and a later operation raises TypeError about NoneType.",
        },
        {
          type: "mcq",
          id: "py12_mcq_03",
          difficulty: "Medium",
          question:
            "def stats(xs): return min(xs), max(xs) — what TYPE does stats([3, 1, 4]) evaluate to?",
          options: [
            "Two separate values",
            "A list [1, 4]",
            "A tuple (1, 4)",
            "A dict {min: 1, max: 4}",
          ],
          correctIndex: 2,
          explanation:
            "Comma-separated returns pack into ONE tuple. Unpacking at the call site (lo, hi = ...) is what makes it feel like two values.",
        },
        {
          type: "scenario",
          id: "py12_sc_01",
          difficulty: "Medium",
          scenario:
            "A lookup function returns a discount percentage, or None for customers with no discount. A teammate writes: `if get_discount(cust):` to test whether a discount exists — and customers with a legitimate 0% promotional discount are treated as having none.",
          question: "What's the correct test?",
          options: [
            "if get_discount(cust) is not None:",
            "if get_discount(cust) == True:",
            "if get_discount(cust) > 0:",
            "The original code is correct",
          ],
          correctIndex: 0,
          explanation:
            "0 is falsy, so truthiness can't distinguish 'no discount' (None) from '0% discount' (0). When None is the sentinel, test identity with `is not None`. This exact bug ships to production constantly.",
        },
        {
          type: "coding",
          id: "py12_code_01",
          difficulty: "Medium",
          prompt:
            "Write bmi(weight_kg, height_m) returning the BMI rounded to 1 decimal (weight / height²). Print bmi(70.0, 1.75). Expected output: 22.9",
          starterCode: "# Your code here\n",
          solutionCode:
            "def bmi(weight_kg, height_m):\n    \"\"\"Return body-mass index rounded to 1 decimal.\"\"\"\n    return round(weight_kg / height_m ** 2, 1)\n\nprint(bmi(70.0, 1.75))",
          expectedOutput: "22.9",
          tests: [
            {
              name: "Parameter order",
              description: "weight first, height second — matching the call",
            },
            {
              name: "Returns the value",
              description: "The function returns; printing happens at the call site",
            },
          ],
        },
        {
          type: "mcq",
          id: "py12_mcq_04",
          difficulty: "Hard",
          question:
            "def check(n):\n    if n > 10:\n        return 'big'\n    print('small')\n\nWhat does `result = check(3)` leave in result?",
          options: ["'small'", "'big'", "None", "3"],
          correctIndex: 2,
          explanation:
            "n is 3, so the if is skipped and print runs — but print RETURNS nothing, and the function ends with no return. result is None; 'small' went to the screen, not to the caller. Print is not return.",
        },
        {
          type: "coding",
          id: "py12_code_02",
          difficulty: "Hard",
          prompt:
            "Write classify_temp(celsius) using early returns: return 'invalid' if celsius is None, 'freezing' below 0, 'cold' below 15, 'warm' below 28, else 'hot'. Print the results for None, -4, 22, 31 (one per line). Expected:\ninvalid\nfreezing\nwarm\nhot",
          starterCode: "# Your code here\n",
          solutionCode:
            "def classify_temp(celsius):\n    \"\"\"Return a temperature label using early returns.\"\"\"\n    if celsius is None:\n        return 'invalid'\n    if celsius < 0:\n        return 'freezing'\n    if celsius < 15:\n        return 'cold'\n    if celsius < 28:\n        return 'warm'\n    return 'hot'\n\nfor t in [None, -4, 22, 31]:\n    print(classify_temp(t))",
          expectedOutput: "invalid\nfreezing\nwarm\nhot",
          tests: [
            {
              name: "Guard first",
              description: "The None check must come before any numeric comparison",
            },
            {
              name: "No elif/else needed",
              description: "Each return exits, so plain ifs suffice — flat, not nested",
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
          question: "What's the difference between a parameter and an argument?",
          answer:
            "A parameter is the name declared in the function definition — the labeled empty box. An argument is the actual value a caller supplies — what goes into the box, matched by position by default. The distinction sounds pedantic but pays off when reading error messages: 'missing 1 required positional argument: height' names the PARAMETER that no ARGUMENT filled, telling you exactly which box is empty. It also frames the deeper point that the function body only ever sees its parameter names — callers and callees are decoupled, communicating purely through the ordered handoff of values.",
        },
        {
          question:
            "How does Python return multiple values, and what's actually happening under the hood?",
          answer:
            "return a, b, c packs the values into a single tuple — the function still returns exactly one object. The multi-value feel comes from unpacking at the call site: lo, hi, span = value_range(data) assigns the tuple's elements to three names, and raises a loud ValueError if the counts mismatch. This is the idiom behind sklearn's train_test_split returning four arrays. Two design cautions worth volunteering: keep the element order meaningful and documented (callers must remember it), and past three or four values, return something with named fields instead — a dict or a small class — because positional unpacking of six anonymous values is a bug factory.",
        },
        {
          question:
            "Describe the 'return value or None' contract — its uses and its hazards.",
          answer:
            "The contract: a function returns the meaningful result when it can, and None when it can't — parse_price returns a float or None, a lookup returns the record or None. It keeps expected failures (malformed input, missing keys) from becoming exceptions, letting callers handle them with a simple test. Two hazards. First, the truthiness trap: `if result:` wrongly treats legitimate falsy results — 0, empty string, empty list — as failures; the correct test is `is not None`. Second, None is contagious: if a caller forgets to check, the None flows onward and detonates later as a confusing TypeError far from its source. Teams mitigate with docstrings that state the contract, `is not None` discipline, and — in typed codebases — Optional annotations so the checker forces the question.",
        },
      ],
    },

    {
      id: "common-mistakes",
      type: "callout",
      variant: "warning",
      title: "Common Mistakes to Avoid",
      content:
        "1) Computing a result and forgetting the return line — caller gets None. 2) Swapping compatible-typed arguments: no error, wrong answer; keep parameter lists short and meaningful. 3) Testing a value-or-None result with truthiness when 0 or '' are legitimate — use `is not None`. 4) Code placed after a return in the same branch — unreachable. 5) Unpacking the wrong number of values — count both sides. 6) Believing print inside the function 'returned' something; the caller still received None.",
    },

    {
      id: "ai-tutor",
      type: "callout",
      variant: "tip",
      title: "Ask the AI Tutor",
      content:
        "Try these prompts in the AI Tutor panel: • 'Quiz me: what does each of these five calls evaluate to?' • 'Show a silent argument-swap bug in a real-looking function.' • 'Refactor this nested if/else into early returns with me.' • 'Explain the value-or-None contract with a new example.' • 'Interview mode: ask me about multiple return values and grade my answer.'",
    },

    {
      id: "glossary",
      type: "callout",
      variant: "info",
      title: "Glossary",
      content:
        "Parameter — the name declared in a def's parentheses. Argument — the value supplied at the call. Positional matching — first argument to first parameter, by order. return — statement that ends the call and delivers a value. Early return — exiting at the top for edge cases (guard clauses). Tuple packing — return a, b bundles values into one tuple. Unpacking — lo, hi = f() splits a returned tuple into names. None — the value of a function that returns nothing. Arity — the number of arguments a function expects. Value-or-None contract — return the result, or None for expected failure.",
    },

    {
      id: "resources",
      type: "callout",
      variant: "info",
      title: "Recommended Resources",
      content:
        "• Docs: 'More on Defining Functions' in the official Python tutorial. • Read: the train_test_split docs — spot the four-way tuple return and the parameter order you now understand. • Practice: write min_max_mean(values) returning three values with an empty-list guard, and unpack it three different ways. • Next in DSM: positional order is fragile past two parameters — Default & Keyword Arguments lets callers name what they pass and lets functions ship sensible defaults.",
    },

    {
      id: "recap",
      type: "recap",
      tocLabel: "Recap",
      content:
        "✓ Arguments fill parameters by position; order is meaning, and silent swaps are the danger.\n✓ return delivers a value AND exits immediately — early returns keep logic flat.\n✓ return a, b, c packs a tuple; unpack with matching names at the call site.\n✓ No return means None — sometimes a contract, often a bug.\n✓ Test value-or-None results with `is not None`, never bare truthiness, when falsy values are legitimate.\n✓ Loud arity errors beat silent order errors — design parameter lists to fail loud.\n\nNext up: Default & Keyword Arguments. Callers shouldn't have to pass everything every time — defaults give parameters fallback values, and keywords let calls name their intent.",
    },
  ],
};
