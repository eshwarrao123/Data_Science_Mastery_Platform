import type { Lesson } from "@/lib/curriculum/types";

export const higherOrderFunctions: Lesson = {
  meta: {
    id: "python.functions.higher-order-functions",
    slug: "higher-order-functions",
    title: "Higher-Order Functions",
    description:
      "Functions that take or return other functions — map, filter, and the function-factory pattern behind pipelines and decorators.",
    estimatedTime: "30 mins",
    difficulty: "Intermediate",
    xpReward: 70,
    prerequisites: ["python.functions.lambda-functions"],
    masteryThreshold: 80,
  },

  blocks: [
    {
      id: "intro",
      type: "lesson-intro",
      tocLabel: "Introduction",
      intro: {
        hook: "You've been sneaking up on a big idea for three lessons: sorted(key=len) passed a function, the timed() wrapper received one, .apply() will take one per column. Time to say it plainly — in Python, functions are values. Store them, pass them, return them. Code that operates on code.",
        what: "A higher-order function either takes a function as an argument (map, filter, sorted), returns a function as its result (a 'factory'), or both. Everything else is ordinary Python — functions are objects like any other value.",
        why: "Higher-order thinking is how data tooling is built: pandas' .apply and .agg take your functions; sklearn pipelines chain them; decorators wrap them. Understand functions-as-values and these stop being magic APIs and become plain patterns you could write yourself.",
        whereUsed:
          "map/filter over records, .apply()/.agg() in pandas, validator registries, function factories for configurable transforms, and (later) decorators.",
        objectives: [
          "Pass functions as arguments — by name, without calling them",
          "Use map() and filter(), and know when a comprehension is clearer",
          "Write functions that RETURN configured functions (factories)",
          "Store functions in data structures and dispatch on them",
          "Recognize the higher-order shapes inside pandas and sklearn APIs",
        ],
        realWorldApps: [
          {
            company: "pandas",
            headline: ".agg takes your functions",
            detail:
              "df.groupby('region').agg(total=('sales', sum), top=('sales', max)) — aggregation IS higher-order: you hand pandas the functions to run per group.",
          },
          {
            company: "Django",
            headline: "URL routing tables",
            detail:
              "A Django site maps URL patterns to view FUNCTIONS stored in a list — dispatch is 'look up the function, call it', the registry pattern at web scale.",
          },
          {
            company: "Ray",
            headline: "Distributed map",
            detail:
              "Ray parallelizes work by shipping your function to worker processes over a cluster — map() semantics stretched across machines, same mental model.",
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
            "The foundation: a def creates a function OBJECT and binds a name to it — exactly like x = 5 binds a name to an int. The name without parentheses IS the object (pass it, store it, alias it); parentheses are the separate act of calling. Everything in this lesson follows from that one distinction.",
        },
        {
          type: "code-note",
          code: "def shout(text):\n    return text.upper() + '!'\n\nannounce = shout          # alias — no call\nprint(announce('deploy')) # DEPLOY!\nprint(shout is announce)  # True — same object, two names",
          content:
            "announce isn't a copy; it's a second sticky note on the same function (the Variables lesson's whiteboard, paying off). This is what you did with key=len — handed sorted the len object itself.",
        },
        {
          type: "analogy",
          title: "The contractor and the specialist",
          content:
            "A general contractor doesn't lay tile — they're hired WITH a specialist in hand: 'renovate this kitchen, use THIS tiler'. map() is such a contractor: it handles walking the rooms (iteration) while the function you hand it does the craft (transformation). Factories go one step further: a workshop that doesn't tile either — it TRAINS specialist tilers to order ('make me a tiler who only does 10cm blue tiles') and sends them out to work.",
        },
        {
          type: "keypoint",
          title: "map and filter — and their comprehension twins",
          content:
            "map(func, items) applies func to every item; filter(func, items) keeps items where func returns True. Both return lazy iterators — wrap in list() to see results. Honest Python style: comprehensions usually read better when you'd write a fresh lambda ([x*2 for x in xs] beats map(lambda x: x*2, xs)), while map/filter shine when the function ALREADY EXISTS: map(str.strip, lines), filter(is_valid, rows).",
        },
        {
          type: "code-note",
          code: "lines = ['  alpha ', 'beta  ', '  gamma']\nclean = list(map(str.strip, lines))\nprint(clean)\n\nscores = [72, 45, 91, 58]\npassing = list(filter(lambda s: s >= 60, scores))\nprint(passing)",
          content:
            "map with an existing function: no lambda, pure signal. filter with a fresh predicate: fine, though [s for s in scores if s >= 60] is equally good — know both, choose the readable one.",
        },
        {
          type: "keypoint",
          title: "Function factories: functions that return functions",
          content:
            "A factory is a def containing another def, returning the inner one. The inner function REMEMBERS the factory's arguments (the mechanics of that memory — closures — is next lesson's whole topic; today we use it). make_multiplier(3) returns a function that triples; make_validator(0, 120) returns an age-checker. One factory, a family of configured tools.",
        },
        {
          type: "text",
          content:
            "Functions also live happily inside data structures. A list of cleaning steps run in order; a registry mapping a record type to its handler. This turns 'which function should run?' from an if/elif chain into a data lookup — add a handler by adding an entry, touching no logic.",
        },
        {
          type: "warning",
          title: "The two classic slips",
          content:
            "One: calling too early — map(clean(), rows) passes clean's RESULT (probably a crash or a string); map(clean, rows) passes clean itself. If you see 'TypeError: 'str' object is not callable', you called too early somewhere. Two: forgetting map/filter are lazy — print(map(...)) shows '<map object ...>', not data; list() it, or loop it, to realize the work.",
        },
      ],
    },

    {
      id: "diagram",
      type: "interactive-diagram",
      tocLabel: "Visual Learning",
      visual: {
        kind: "architecture",
        title: "Three higher-order shapes",
        caption:
          "Take a function, return a function, store functions — click each to see the pattern and where you'll meet it.",
        nodes: [
          {
            id: "value",
            label: "function = value",
            sublabel: "the foundation",
            detail:
              "A def binds a name to a function object. Name alone = the object; name() = a call. Everything below is just this rule applied.",
            x: 50,
            y: 12,
            accent: true,
          },
          {
            id: "take",
            label: "takes a function",
            sublabel: "map, filter, sorted, .apply",
            detail:
              "The host owns the iteration; your function owns the per-item logic. map(str.strip, lines), sorted(rows, key=...), df.apply(...) — the shape you'll use daily.",
            x: 18,
            y: 55,
            accent: false,
          },
          {
            id: "return",
            label: "returns a function",
            sublabel: "factories",
            detail:
              "A def inside a def, returned configured: make_scaler(0.92) hands back a currency converter. The seed of decorators and of sklearn's fitted transformers.",
            x: 50,
            y: 55,
            accent: false,
          },
          {
            id: "store",
            label: "stored in data",
            sublabel: "registries & pipelines",
            detail:
              "A list of steps applied in order = a pipeline. A mapping of type → handler = a dispatch table. Adding behavior becomes adding data, not editing if/elif chains.",
            x: 82,
            y: 55,
            accent: false,
          },
        ],
        edges: [
          { from: "value", to: "take" },
          { from: "value", to: "return" },
          { from: "value", to: "store" },
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
          title: "Pass a function by name",
          scenario: "Apply an existing transform to a whole list with map.",
          steps: [
            {
              code: "def to_kilometers(miles):\n    return round(miles * 1.60934, 1)\n\ndistances = [3.0, 26.2, 0.5]\nprint(list(map(to_kilometers, distances)))",
              explanation:
                "to_kilometers — no parentheses — hands map the function itself. map calls it once per element; list() collects the lazy results.",
            },
          ],
          output: "[4.8, 42.2, 0.8]",
        },
        {
          difficulty: "Easy",
          title: "filter with a named predicate",
          scenario: "Keep the sensor readings inside the valid range, and count the rejects.",
          steps: [
            {
              code: "def is_valid(reading):\n    return -40.0 <= reading <= 60.0",
              explanation:
                "A predicate: a function returning True/False. Naming it documents the RULE, and two call sites can share it.",
            },
            {
              code: "readings = [21.5, -999.0, 33.8, 72.5, 18.2]\nvalid = list(filter(is_valid, readings))\nprint(valid)\nprint(f'{len(readings) - len(valid)} rejected')",
              explanation:
                "filter keeps elements where the predicate is True. The reject count is reported, not swallowed — Loop Control's discipline carried forward.",
            },
          ],
          output: "[21.5, 33.8, 18.2]\n2 rejected",
        },
        {
          difficulty: "Medium",
          title: "A function factory",
          scenario:
            "Ingestion needs range-validators for several columns — same logic, different bounds. Build one factory instead of three near-identical defs.",
          steps: [
            {
              code: "def make_range_check(low, high):\n    \"\"\"Return a validator for the range [low, high].\"\"\"\n    def check(value):\n        return low <= value <= high\n    return check",
              explanation:
                "The inner def is created fresh on each factory call, and it USES low and high from the factory's arguments. Returning check (no parentheses) hands back the configured function.",
            },
            {
              code: "valid_age = make_range_check(0, 120)\nvalid_pct = make_range_check(0.0, 100.0)",
              explanation:
                "Two calls, two independent validators — each remembers its own bounds. (HOW it remembers after make_range_check returns is closures — next lesson dissects it.)",
            },
            {
              code: "print(valid_age(34), valid_age(150))\nprint(valid_pct(99.5), valid_pct(-3.0))",
              explanation:
                "Each validator is a normal function now: pass it to filter(), store it in a registry, hand it to a pipeline. Configuration became a value.",
            },
          ],
          output: "True False\nTrue False",
        },
        {
          difficulty: "Hard",
          title: "A pipeline as a list of functions",
          scenario:
            "Text cleaning with composable steps: run a list of transforms in order, so reordering or extending the pipeline means editing DATA, not logic.",
          steps: [
            {
              code: "def strip_spaces(s):\n    return s.strip()\n\ndef collapse_dashes(s):\n    return s.replace('--', '-')\n\ndef lower(s):\n    return s.lower()",
              explanation:
                "Three tiny named transforms, each testable alone. Small single-purpose functions (the Defining Functions rule) are what make composition possible.",
            },
            {
              code: "def run_pipeline(value, steps):\n    \"\"\"Apply each step function to value, in order.\"\"\"\n    for step in steps:\n        value = step(value)\n    return value",
              explanation:
                "The engine is four lines: loop the functions, feed each one the previous output. `step` is a variable whose value happens to be callable.",
            },
            {
              code: "CLEANING = [strip_spaces, collapse_dashes, lower]\nraw = '  Data--Science  '\nprint(run_pipeline(raw, CLEANING))\nprint(run_pipeline(raw, [strip_spaces, lower]))",
              explanation:
                "The pipeline IS the list. The second call runs a variant by passing different data — no new function written. sklearn's Pipeline([...]) is this idea, industrialized.",
            },
          ],
          output: "data-science\ndata--science",
        },
        {
          difficulty: "Industry Example",
          title: "A dispatch registry for mixed record types",
          scenario:
            "An ETL job receives mixed events — orders, refunds, signups — each needing different handling. Instead of a growing if/elif chain, a data engineer maps type names to handler functions.",
          steps: [
            {
              code: "def handle_order(data):\n    return f'order: ${data:.2f} recorded'\n\ndef handle_refund(data):\n    return f'refund: ${data:.2f} queued for approval'\n\ndef handle_signup(data):\n    return f'signup: welcome email to {data}'",
              explanation:
                "One handler per event type, uniform shape (take the payload, return a result line). Uniform signatures are what make dispatch clean.",
            },
            {
              code: "HANDLERS = {\n    'order': handle_order,\n    'refund': handle_refund,\n    'signup': handle_signup,\n}",
              explanation:
                "The registry: event names mapped to function OBJECTS. (Dictionaries get their full lesson next module — here, it's a lookup table: HANDLERS['order'] retrieves handle_order.)",
            },
            {
              code: "events = [('order', 129.99), ('signup', 'mia@example.com'), ('refund', 129.99), ('cancel', None)]\nfor kind, payload in events:\n    handler = HANDLERS.get(kind)\n    if handler is None:\n        print(f'UNKNOWN event type: {kind}')\n        continue\n    print(handler(payload))",
              explanation:
                ".get() returns None for unknown keys — handled loudly, not crashed on. Adding a 'cancel' handler tomorrow = one def + one registry line; the loop never changes. That's the open-for-extension property if/elif chains lack.",
            },
          ],
          output:
            "order: $129.99 recorded\nsignup: welcome email to mia@example.com\nrefund: $129.99 queued for approval\nUNKNOWN event type: cancel",
        },
      ],
    },

    {
      id: "inline-practice",
      type: "inline-code",
      tocLabel: "Practice Coding",
      coding: {
        language: "python",
        filename: "discount_factory.py",
        instructions:
          "An online store needs tiered discount functions. Write a factory make_discount(pct) returning a function that applies that percentage to a price (rounded to 2 decimals). Create student (10%) and vip (25%) discounters, then use map to apply the vip discount to a whole cart.",
        starterCode: `# TODO 1: factory — make_discount(pct) returns a function
# that takes price and returns price reduced by pct percent
___

# TODO 2: build two configured discounters
student = ___
vip = ___

print(student(200.0))
print(vip(200.0))

# TODO 3: apply vip to every price in the cart using map
cart = [49.99, 120.00, 15.50]
print(___)`,
        solutionCode: `def make_discount(pct):
    """Return a function applying a pct% discount."""
    def apply(price):
        return round(price * (1 - pct / 100), 2)
    return apply

student = make_discount(10)
vip = make_discount(25)

print(student(200.0))
print(vip(200.0))

cart = [49.99, 120.00, 15.50]
print(list(map(vip, cart)))`,
        expectedOutput: "180.0\n150.0\n[37.49, 90.0, 11.62]",
        hints: [
          "The factory defines an inner function apply(price) and returns it WITHOUT parentheses",
          "Inside apply, pct is available from the factory's argument — use price * (1 - pct / 100)",
          "student = make_discount(10) and vip = make_discount(25) — each call builds a fresh function",
          "TODO 3: list(map(vip, cart)) — vip is passed by name, map calls it per price",
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
          id: "py16_mcq_01",
          difficulty: "Easy",
          question: "What makes a function 'higher-order'?",
          options: [
            "It has more than three parameters",
            "It takes a function as an argument, returns one, or both",
            "It's defined inside a class",
            "It uses *args",
          ],
          correctIndex: 1,
          explanation:
            "Higher-order = operates on functions as values. map (takes one), a factory (returns one), and a decorator (both) all qualify; arity and *args are unrelated.",
        },
        {
          type: "mcq",
          id: "py16_mcq_02",
          difficulty: "Easy",
          question: "What does print(map(str.upper, ['a', 'b'])) show?",
          options: [
            "['A', 'B']",
            "Something like <map object at 0x...>",
            "'A B'",
            "A TypeError",
          ],
          correctIndex: 1,
          explanation:
            "map is lazy — it returns an iterator that hasn't done any work yet. list(map(...)) realizes the results. Forgetting this is the classic first map bug.",
        },
        {
          type: "mcq",
          id: "py16_mcq_03",
          difficulty: "Medium",
          question:
            "Which call is broken?\n\ndef clean(s): return s.strip()\nrows = [' a ', ' b ']",
          options: [
            "list(map(clean, rows))",
            "list(map(clean(), rows))",
            "[clean(r) for r in rows]",
            "sorted(rows, key=clean)",
          ],
          correctIndex: 1,
          explanation:
            "clean() CALLS the function with no arguments — TypeError before map even starts. Passing means naming without parentheses. A and C are equivalent correct forms; D legally sorts by cleaned value.",
        },
        {
          type: "scenario",
          id: "py16_sc_01",
          difficulty: "Medium",
          scenario:
            "A parsing module has grown an if/elif chain: if fmt == 'csv': parse_csv(f) elif fmt == 'json': parse_json(f) elif fmt == 'xml': ... — now a fourth format is coming, and the chain is duplicated in two places.",
          question: "What's the higher-order refactor?",
          options: [
            "Add the fourth elif to both chains carefully",
            "A registry: PARSERS = {'csv': parse_csv, 'json': parse_json, ...}, then PARSERS[fmt](f) — new formats become one dict entry",
            "Merge all parsers into one function with nested ifs",
            "Rename the functions so the chain reads better",
          ],
          correctIndex: 1,
          explanation:
            "Functions stored in a dict turn dispatch into data lookup: both call sites share the registry, and extension = adding an entry, not editing logic in two places. Use .get(fmt) to handle unknown formats loudly.",
        },
        {
          type: "coding",
          id: "py16_code_01",
          difficulty: "Medium",
          prompt:
            "Using filter and a named predicate is_round(n) (True when n is divisible by 10), keep the round numbers from [95, 100, 42, 30, 7, 60] and print them. Expected output: [100, 30, 60]",
          starterCode: "nums = [95, 100, 42, 30, 7, 60]\n# Your code here\n",
          solutionCode:
            "nums = [95, 100, 42, 30, 7, 60]\n\ndef is_round(n):\n    \"\"\"True when n is a multiple of 10.\"\"\"\n    return n % 10 == 0\n\nprint(list(filter(is_round, nums)))",
          expectedOutput: "[100, 30, 60]",
          tests: [
            {
              name: "Named predicate",
              description: "is_round is defined with def and passed by name",
            },
            {
              name: "Realized output",
              description: "The filter iterator is wrapped in list() before printing",
            },
          ],
        },
        {
          type: "coding",
          id: "py16_code_02",
          difficulty: "Hard",
          prompt:
            "Write a factory make_suffixer(suffix) returning a function that appends suffix to a string. Build add_csv = make_suffixer('.csv'), then use map to convert ['sales', 'users'] into filenames. Print the list. Expected output: ['sales.csv', 'users.csv']",
          starterCode: "# Your code here\n",
          solutionCode:
            "def make_suffixer(suffix):\n    \"\"\"Return a function that appends suffix to a string.\"\"\"\n    def add(name):\n        return name + suffix\n    return add\n\nadd_csv = make_suffixer('.csv')\nprint(list(map(add_csv, ['sales', 'users'])))",
          expectedOutput: "['sales.csv', 'users.csv']",
          tests: [
            {
              name: "Factory returns a function",
              description: "make_suffixer returns the inner def, not a string",
            },
            {
              name: "Composed with map",
              description: "The configured function is passed to map by name",
            },
          ],
        },
        {
          type: "mcq",
          id: "py16_mcq_04",
          difficulty: "Hard",
          question:
            "def make_adder(n):\n    def add(x):\n        return x + n\n    return add\n\nadd5 = make_adder(5)\nadd9 = make_adder(9)\nprint(add5(1), add9(1))\n\nWhat prints?",
          options: [
            "6 10",
            "10 10 — both use the latest n",
            "6 6 — both use the first n",
            "A NameError: n is gone after make_adder returns",
          ],
          correctIndex: 0,
          explanation:
            "Each factory call creates a FRESH inner function remembering its own n — add5 keeps 5, add9 keeps 9, independently. The 'how does n survive?' question is exactly what the next lesson (closures) answers.",
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
            "What does 'functions are first-class values' mean in Python, and why does it matter for data work?",
          answer:
            "It means a function is an ordinary object: created by def, bound to a name, and usable anywhere a value is — assigned to other names, stored in lists and dicts, passed as arguments, returned from other functions. The name alone references the object; parentheses perform the separate act of calling. It matters for data work because the entire tooling surface assumes it: sorted(key=...), df['col'].apply(func), groupby().agg(func), sklearn pipelines of transformers, and decorators all receive YOUR function as a value and control when to call it. Once you see the APIs as 'they take my function', you can also invert it — write your own map-like utilities, registries, and pipelines instead of if/elif sprawl.",
        },
        {
          question:
            "map/filter versus list comprehensions — how do you choose?",
          answer:
            "They're expressively equivalent for the common cases, so the choice is readability. My rule: when the function already exists, map/filter is cleaner — map(str.strip, lines) and filter(is_valid, rows) name the operation with zero ceremony. When I'd have to write a fresh lambda, the comprehension usually wins — [x * 2 for x in xs] over map(lambda x: x * 2, xs), and comprehensions handle transform-plus-filter in one expression where map-inside-filter nests awkwardly. Two technical notes worth adding: map and filter are lazy iterators — nothing runs until consumed, which is a feature for large streams and a gotcha when you print one expecting data — and at pandas scale the real answer becomes vectorized column operations, with .apply as the fallback.",
        },
        {
          question:
            "Describe the function-factory pattern and a real situation where you'd use it.",
          answer:
            "A factory is a function that builds and returns another function, configured by the factory's arguments: def make_range_check(low, high) defines an inner check(value) using low and high, and returns it. Each factory call produces an independent function remembering its own configuration — the remembering is a closure over the factory's variables. Real uses: generating per-column validators from a config file (loop the config, build one checker per column, store them in a dict keyed by column name); building parameterized transforms for a cleaning pipeline; and rate-limiters or retry policies configured per external service. The pattern's payoff is that configuration becomes a VALUE you can pass around, test, and store — and it's the exact mechanism decorators are built from, which makes it a favorite interview stepping-stone question.",
        },
      ],
    },

    {
      id: "common-mistakes",
      type: "callout",
      variant: "warning",
      title: "Common Mistakes to Avoid",
      content:
        "1) Calling instead of passing: map(clean(), rows) runs clean immediately — drop the parentheses. 2) Printing a map/filter object and thinking it's broken — they're lazy; list() them. 3) Wrapping existing functions in lambdas (lambda s: s.strip() → just str.strip). 4) Factories that return inner() instead of inner — returning the CALL's result, not the function. 5) Registries without a missing-key plan — HANDLERS[kind] crashes on unknowns; .get() + explicit handling reports them. 6) Consuming a lazy iterator twice — the second pass is empty; realize to a list if you need it twice.",
    },

    {
      id: "ai-tutor",
      type: "callout",
      variant: "tip",
      title: "Ask the AI Tutor",
      content:
        "Try these prompts in the AI Tutor panel: • 'Quiz me: which of these six expressions pass a function and which call it?' • 'Help me refactor this if/elif chain into a dispatch dict.' • 'Show me a factory that builds validators from a config list.' • 'Trace what map actually does, step by step, on three elements.' • 'Interview mode: ask me about first-class functions and grade my answer.'",
    },

    {
      id: "glossary",
      type: "callout",
      variant: "info",
      title: "Glossary",
      content:
        "Higher-order function — takes and/or returns functions. First-class value — anything assignable, passable, and returnable; Python functions qualify. map(func, iterable) — lazily applies func to every element. filter(pred, iterable) — lazily keeps elements where pred is True. Predicate — a function returning True/False. Factory — a function that returns a newly built, configured function. Registry / dispatch table — a dict mapping keys to handler functions. Lazy iterator — computes values on demand; consumed once. Alias — a second name bound to the same function object. Pipeline — an ordered collection of functions applied in sequence.",
    },

    {
      id: "resources",
      type: "callout",
      variant: "info",
      title: "Recommended Resources",
      content:
        "• Docs: the built-ins reference for map() and filter(), plus 'Functional Programming HOWTO' for the wider toolkit. • Read: sklearn's Pipeline documentation intro — recognize the list-of-steps pattern you just built by hand. • Practice: refactor any if/elif chain from your earlier code into a dispatch dict with a .get() fallback. • Next in DSM: factories work because inner functions REMEMBER outer variables — Scope & Closures explains exactly where Python looks names up, and what that memory really is.",
    },

    {
      id: "recap",
      type: "recap",
      tocLabel: "Recap",
      content:
        "✓ Functions are values: the name references, the parentheses call — everything follows from that.\n✓ map/filter apply your function across data lazily; comprehensions are their (often clearer) twins.\n✓ Prefer map/filter when the function exists; comprehensions when you'd write a lambda.\n✓ Factories return configured functions — configuration as a value.\n✓ Functions in dicts/lists give dispatch tables and pipelines — extension by data, not by elif.\n✓ Two slips to watch: calling too early, and trusting a lazy iterator you never realized.\n\nNext up: Scope & Closures. Factories left one mystery — how does the inner function remember the factory's variables after it returns? The LEGB rule and closures are the answer.",
    },
  ],
};
