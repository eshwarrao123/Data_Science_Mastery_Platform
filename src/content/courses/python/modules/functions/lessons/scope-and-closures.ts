import type { Lesson } from "@/lib/curriculum/types";

export const scopeAndClosures: Lesson = {
  meta: {
    id: "python.functions.scope-and-closures",
    slug: "scope-and-closures",
    title: "Scope & Closures",
    description:
      "Where Python looks names up — the LEGB rule, why functions don't leak variables, and the closure memory that powers factories.",
    estimatedTime: "30 mins",
    difficulty: "Intermediate",
    xpReward: 70,
    prerequisites: ["python.functions.higher-order-functions"],
    masteryThreshold: 80,
  },

  blocks: [
    {
      id: "intro",
      type: "lesson-intro",
      tocLabel: "Introduction",
      intro: {
        hook: "Last lesson left a mystery: make_adder(5) returned a function, make_adder finished and its variables should be gone — yet add5(1) still knows n is 5. Where does that 5 LIVE? The answer explains half the 'why does my variable...' questions you'll ever have.",
        what: "Scope is the region of code where a name is visible. Python resolves every name through four layers — Local, Enclosing, Global, Built-in (LEGB) — and a closure is an inner function that keeps its enclosing layer alive after the outer function returns.",
        why: "Scope bugs are quiet: a function reads a global you meant to shadow, a loop variable leaks into your closure, an UnboundLocalError appears 'randomly'. Understanding the lookup order turns these from mysteries into thirty-second fixes — and makes factories and (later) decorators fully transparent.",
        whereUsed:
          "Every function you write, module-level configuration constants, counter/accumulator closures, factory-built validators, and the decorators used across every Python framework.",
        objectives: [
          "Trace name lookups through the LEGB layers",
          "Explain why assignment inside a function creates a LOCAL name",
          "Diagnose UnboundLocalError and shadowing bugs",
          "Explain what a closure captures and when",
          "Use module-level constants safely; avoid the global statement",
        ],
        realWorldApps: [
          {
            company: "Flask",
            headline: "App factories and closures",
            detail:
              "Flask's application-factory pattern returns route functions that close over app configuration — a closure keeping settings alive per app instance.",
          },
          {
            company: "TensorFlow",
            headline: "Training-step closures",
            detail:
              "Custom training loops define step functions that close over the model and optimizer — the closure is what lets tf.function trace and compile them.",
          },
          {
            company: "Datadog",
            headline: "Metric-tagging wrappers",
            detail:
              "Instrumentation helpers build recording functions that close over service and environment tags, so every call site logs consistently without repeating config.",
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
            "When Python meets a name, it searches four layers in order and stops at the first hit: Local (the current function), Enclosing (any outer function wrapping this one), Global (the module file), Built-in (print, len, sum...). That's LEGB. Names defined in a deeper layer SHADOW same-named ones above — invisible, not overwritten.",
        },
        {
          type: "code-note",
          code: "rate = 0.08          # global\n\ndef quote(price):\n    rate = 0.20      # local — shadows the global\n    return price * (1 + rate)\n\nprint(quote(100))    # 120.0 — used the local\nprint(rate)          # 0.08 — global untouched",
          content:
            "Two independent names that happen to be spelled the same. The function's assignment created a LOCAL rate; the global never changed. Shadowing is usually harmless — until you THINK you updated the global.",
        },
        {
          type: "analogy",
          title: "The office building directory",
          content:
            "Looking up 'Sam' in an office: first your own team room (Local), then the department floor (Enclosing), then the building directory (Global), finally the city phone book (Built-in). You stop at the first Sam you find — and a Sam on your team makes the department's Sam unreachable by that name. Hiring a teammate named 'print' is legal... and now the city's print is shadowed. That's why naming a variable list or sum breaks things.",
        },
        {
          type: "keypoint",
          title: "Assignment decides locality — for the WHOLE function",
          content:
            "Python decides at compile time: if a name is ASSIGNED anywhere in a function, that name is local EVERYWHERE in the function. Reading it before the assignment line doesn't fall back to the global — it raises UnboundLocalError. This is the rule behind the most confusing beginner error: adding `count = count + 1` at the bottom of a function suddenly breaks a read of count at the top.",
        },
        {
          type: "code-note",
          code: "total = 100\n\ndef report():\n    print(total)      # UnboundLocalError!\n    total = 0         # this line makes 'total' local everywhere\n\n# report()  # would crash — comment kept for safety",
          content:
            "Remove the assignment and the print happily reads the global. The fix is never sprinkling `global` — it's usually passing total as a PARAMETER and returning the new value. Explicit inputs and outputs beat invisible side doors.",
        },
        {
          type: "keypoint",
          title: "Closures: the enclosing layer survives",
          content:
            "When an inner function references a name from its enclosing function, Python attaches that variable to the inner function itself. Return the inner function and the captured variables travel with it — alive after the outer function ended. That attachment is the closure. It's not a copy of the VALUE at definition time; it's a live link to the VARIABLE (which is why each factory call gives a fresh, independent set).",
        },
        {
          type: "expandable",
          title: "Reading vs rebinding in a closure",
          content:
            "A closure can READ its captured variables freely. REBINDING them (count = count + 1 inside the inner function) hits the assignment-makes-local rule and breaks the link — Python offers `nonlocal count` to say 'that assignment targets the enclosing variable'. Counter closures use it. If you find yourself needing nonlocal often, a class (next module... the OOP module) usually states the design more honestly: explicit state deserves an explicit home.",
        },
        {
          type: "warning",
          title: "Globals: read constants, don't write state",
          content:
            "Reading module-level CONSTANTS (TAX_RATE = 0.08) inside functions is normal, idiomatic Python. WRITING globals from inside functions via the `global` statement is the code smell: it creates invisible coupling — callers can't see from the signature that state changes. The professional default: functions take what they need as parameters and return what they produce. `global` appears in real codebases roughly never; treat wanting it as a design alarm.",
        },
      ],
    },

    {
      id: "diagram",
      type: "interactive-diagram",
      tocLabel: "Visual Learning",
      visual: {
        kind: "architecture",
        title: "The LEGB lookup ladder",
        caption:
          "Resolving `rate` inside an inner function — Python climbs until the first match. Click each layer.",
        nodes: [
          {
            id: "local",
            label: "Local",
            sublabel: "current function",
            detail:
              "Checked first: names assigned in THIS function (including its parameters). If `rate` is assigned anywhere here, the search ends here — even if the assignment hasn't executed yet (UnboundLocalError territory).",
            x: 50,
            y: 12,
            accent: true,
          },
          {
            id: "enclosing",
            label: "Enclosing",
            sublabel: "outer function(s)",
            detail:
              "The wrapping function's variables — the factory's arguments live here. Inner functions referencing this layer create CLOSURES: the layer survives the outer function's return.",
            x: 50,
            y: 36,
            accent: false,
          },
          {
            id: "global",
            label: "Global",
            sublabel: "the module file",
            detail:
              "Top-level names in the .py file: constants, imports, module functions. Readable from anywhere in the file; writable from functions only via the discouraged `global` statement.",
            x: 50,
            y: 60,
            accent: false,
          },
          {
            id: "builtin",
            label: "Built-in",
            sublabel: "print, len, sum...",
            detail:
              "Python's standard names — the last resort. Shadowing these (naming a variable `list` or `sum`) is legal and silently breaks later calls in the same scope.",
            x: 50,
            y: 84,
            accent: false,
          },
        ],
        edges: [
          { from: "local", to: "enclosing", label: "not found ↓" },
          { from: "enclosing", to: "global", label: "not found ↓" },
          { from: "global", to: "builtin", label: "not found ↓" },
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
          title: "Local names don't leak",
          scenario: "Prove a function's variables vanish when it returns.",
          steps: [
            {
              code: "def compute():\n    subtotal = 40 + 2\n    return subtotal\n\nprint(compute())",
              explanation:
                "subtotal exists only while compute runs. After the return, the local layer is discarded.",
            },
            {
              code: "# print(subtotal)  # NameError: not defined out here",
              explanation:
                "Outside, the name never existed. This isolation is a FEATURE: ten functions can each use `i`, `total`, `result` without a single collision.",
            },
          ],
          output: "42",
        },
        {
          difficulty: "Easy",
          title: "Reading a global constant",
          scenario: "Share one tax rate across several pricing functions — the good kind of global.",
          steps: [
            {
              code: "TAX_RATE = 0.08  # module-level constant, CAPS by convention\n\ndef with_tax(price):\n    return round(price * (1 + TAX_RATE), 2)\n\ndef tax_amount(price):\n    return round(price * TAX_RATE, 2)",
              explanation:
                "Neither function assigns TAX_RATE, so lookups climb Local → (no Enclosing) → Global and find the constant. One definition, every function consistent.",
            },
            {
              code: "print(with_tax(50.0))\nprint(tax_amount(50.0))",
              explanation:
                "Change the constant once at the top of the file and every function follows. Reading shared constants: idiomatic. Writing them from inside functions: the anti-pattern.",
            },
          ],
          output: "54.0\n4.0",
        },
        {
          difficulty: "Medium",
          title: "Diagnosing UnboundLocalError",
          scenario: "A refactor adds one line to a working function and it starts crashing — the classic incident.",
          steps: [
            {
              code: "discount = 5\n\ndef price_after(price):\n    final = price - discount\n    return final\n\nprint(price_after(100))",
              explanation:
                "Works: discount isn't assigned in the function, so it reads the global. 100 - 5 = 95.",
            },
            {
              code: "def price_after_v2(price):\n    final = price - discount   # boom on this line\n    if price > 500:\n        discount = 10           # assignment → discount is local EVERYWHERE\n    return final",
              explanation:
                "The new assignment (even inside an if that may never run!) makes discount local for the whole function — so line one now reads an unassigned local: UnboundLocalError. Compile-time decision, runtime explosion.",
            },
            {
              code: "def price_after_v3(price, discount=5):\n    if price > 500:\n        discount = 10\n    return price - discount\n\nprint(price_after_v3(100))\nprint(price_after_v3(900))",
              explanation:
                "The honest fix: make discount a PARAMETER with a default. Now the tiered logic is explicit in the signature, the global is untouched, and both paths test cleanly.",
            },
          ],
          output: "95\n95\n890",
        },
        {
          difficulty: "Hard",
          title: "A closure with state: the running counter",
          scenario:
            "Track how many records each data source has processed — one independent counter per source, no classes, no globals.",
          steps: [
            {
              code: "def make_counter(label):\n    count = 0\n    def bump():\n        nonlocal count\n        count += 1\n        return f'{label}: {count}'\n    return bump",
              explanation:
                "bump closes over BOTH label and count. Because bump REBINDS count (+=), it needs `nonlocal count` — 'that assignment targets the enclosing variable, not a new local'.",
            },
            {
              code: "api_counter = make_counter('api')\ncsv_counter = make_counter('csv')",
              explanation:
                "Two factory calls, two separate enclosing layers — the counters cannot interfere with each other. This independence is what a shared global counter could never give you.",
            },
            {
              code: "print(api_counter())\nprint(api_counter())\nprint(csv_counter())\nprint(api_counter())",
              explanation:
                "api advances 1, 2, 3 while csv sits at 1 — each closure carries its own live count. When state grows past one variable, promote the design to a class; until then, a closure is the lightest tool that works.",
            },
          ],
          output: "api: 1\napi: 2\ncsv: 1\napi: 3",
        },
        {
          difficulty: "Industry Example",
          title: "Configured logging without repeating yourself",
          scenario:
            "A data platform team gives every pipeline a pre-tagged logger: service name and environment captured once, stamped on every message — the closure pattern running in real observability code.",
          steps: [
            {
              code: "def make_logger(service, env):\n    \"\"\"Return a log function pre-tagged with service and env.\"\"\"\n    prefix = f'[{service}|{env}]'\n    def log(level, message):\n        return f'{prefix} {level.upper()}: {message}'\n    return log",
              explanation:
                "prefix is computed ONCE per factory call and captured by the closure. Every log call reuses it — no per-call recomputation, no global config lookup.",
            },
            {
              code: "orders_log = make_logger('orders-etl', 'prod')\ndev_log = make_logger('orders-etl', 'dev')\n\nprint(orders_log('info', 'batch started'))\nprint(orders_log('warn', '3 rows skipped'))\nprint(dev_log('info', 'batch started'))",
              explanation:
                "Prod and dev loggers coexist, each remembering its own tags. Call sites stay one clean line — the configuration lives in the closure, not at every call.",
            },
            {
              code: "print(orders_log.__name__, dev_log.__name__)",
              explanation:
                "Both are 'log' — the same inner def, instantiated twice with different captured environments. Decorators, which you'll meet later, are exactly this wrapper machinery pointed at functions.",
            },
          ],
          output:
            "[orders-etl|prod] INFO: batch started\n[orders-etl|prod] WARN: 3 rows skipped\n[orders-etl|dev] INFO: batch started\nlog log",
        },
      ],
    },

    {
      id: "inline-practice",
      type: "inline-code",
      tocLabel: "Practice Coding",
      coding: {
        language: "python",
        filename: "rate_limiter.py",
        instructions:
          "Build make_limiter(max_calls) — a factory returning a function that allows up to max_calls invocations. Each call returns 'ok (n/max)' while allowed, then 'BLOCKED' forever after. Use a closure with nonlocal for the call count, and prove two limiters are independent.",
        starterCode: `# TODO 1: define make_limiter(max_calls)
# The returned function tracks its own call count (nonlocal!) and
# returns 'ok (n/max)' or 'BLOCKED'
___

api = make_limiter(2)
backup = make_limiter(1)

print(api())     # ok (1/2)
print(api())     # ok (2/2)
print(api())     # BLOCKED
print(backup())  # ok (1/1)  <- independent counter`,
        solutionCode: `def make_limiter(max_calls):
    """Return a function allowing at most max_calls invocations."""
    calls = 0
    def attempt():
        nonlocal calls
        if calls >= max_calls:
            return 'BLOCKED'
        calls += 1
        return f'ok ({calls}/{max_calls})'
    return attempt

api = make_limiter(2)
backup = make_limiter(1)

print(api())     # ok (1/2)
print(api())     # ok (2/2)
print(api())     # BLOCKED
print(backup())  # ok (1/1)  <- independent counter`,
        expectedOutput: "ok (1/2)\nok (2/2)\nBLOCKED\nok (1/1)",
        hints: [
          "Initialize calls = 0 in the factory, before the inner def",
          "The inner function rebinds calls (+=), so it needs `nonlocal calls` as its first line",
          "Guard first: if calls >= max_calls, return 'BLOCKED' before incrementing",
          "api and backup come from separate factory calls, so each closure has its own calls variable",
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
          id: "py17_mcq_01",
          difficulty: "Easy",
          question: "In what order does Python search scopes for a name?",
          options: [
            "Global, Local, Built-in, Enclosing",
            "Local, Enclosing, Global, Built-in",
            "Built-in, Global, Enclosing, Local",
            "Alphabetical order",
          ],
          correctIndex: 1,
          explanation:
            "LEGB: innermost first, stopping at the first match. Deeper definitions shadow outer ones — including built-ins, which is why naming a variable `sum` breaks sum().",
        },
        {
          type: "mcq",
          id: "py17_mcq_02",
          difficulty: "Easy",
          question:
            "x = 10\ndef f():\n    x = 99\nf()\nprint(x)\n\nWhat prints?",
          options: ["99", "10", "UnboundLocalError", "None"],
          correctIndex: 1,
          explanation:
            "The assignment inside f creates a LOCAL x that shadows — never modifies — the global. The global 10 survives untouched.",
        },
        {
          type: "mcq",
          id: "py17_mcq_03",
          difficulty: "Medium",
          question:
            "n = 5\ndef bump():\n    n = n + 1\n    return n\nbump()\n\nWhat happens?",
          options: [
            "Returns 6",
            "Returns 5",
            "UnboundLocalError: the assignment makes n local, so `n + 1` reads an unassigned local",
            "NameError: n is not defined",
          ],
          correctIndex: 2,
          explanation:
            "Because n is assigned in the function, n is local EVERYWHERE in it — including the right-hand side that runs first. The read finds an unbound local. Fix: take n as a parameter and return n + 1.",
        },
        {
          type: "scenario",
          id: "py17_sc_01",
          difficulty: "Medium",
          scenario:
            "A teammate 'fixes' the bug above with:\n\ndef bump():\n    global n\n    n = n + 1\n\nIt works, but the reviewer objects.",
          question: "What's the reviewer's strongest argument?",
          options: [
            "global is slower than a parameter",
            "The function now mutates hidden state: its signature shows no inputs or outputs, callers can't see the effect, and tests must reset a module variable",
            "global only works in Python 2",
            "n should be renamed to something longer",
          ],
          correctIndex: 1,
          explanation:
            "`global` writes make functions dishonest — bump() looks pure but silently edits the module. def bump(n): return n + 1 states the contract in the signature, tests trivially, and can't collide with other users of n.",
        },
        {
          type: "coding",
          id: "py17_code_01",
          difficulty: "Medium",
          prompt:
            "Write make_tagger(tag) returning a function that wraps text as '[tag] text'. Create urgent = make_tagger('URGENT') and info = make_tagger('INFO'); print urgent('disk full') then info('backup done'). Expected:\n[URGENT] disk full\n[INFO] backup done",
          starterCode: "# Your code here\n",
          solutionCode:
            "def make_tagger(tag):\n    \"\"\"Return a function that prefixes text with [tag].\"\"\"\n    def wrap(text):\n        return f'[{tag}] {text}'\n    return wrap\n\nurgent = make_tagger('URGENT')\ninfo = make_tagger('INFO')\nprint(urgent('disk full'))\nprint(info('backup done'))",
          expectedOutput: "[URGENT] disk full\n[INFO] backup done",
          tests: [
            {
              name: "Closure captures tag",
              description: "The inner function reads tag from the enclosing scope",
            },
            {
              name: "Independent instances",
              description: "urgent and info keep separate captured tags",
            },
          ],
        },
        {
          type: "mcq",
          id: "py17_mcq_04",
          difficulty: "Hard",
          question: "When does a closure need the nonlocal statement?",
          options: [
            "Whenever it reads an enclosing variable",
            "Only when it REBINDS an enclosing variable (count += 1) — reading needs nothing",
            "Always — closures don't work without it",
            "Only inside lambdas",
          ],
          correctIndex: 1,
          explanation:
            "Reading climbs the LEGB ladder automatically. Rebinding triggers the assignment-makes-local rule, so nonlocal is needed to aim the assignment at the enclosing variable instead. Lambdas can't contain statements at all — nonlocal included.",
        },
        {
          type: "scenario",
          id: "py17_sc_02",
          difficulty: "Hard",
          scenario:
            "After a refactor, a script starts failing at line 80 with TypeError: 'list' object is not callable. Line 80 is `names = list(raw_names)`. Line 12, added in the refactor, is `list = [1, 2, 3]`.",
          question: "What happened?",
          options: [
            "Python removed list() in this version",
            "Line 12 bound the name `list` in the global scope, shadowing the built-in — line 80's lookup finds the data list and tries to call it",
            "raw_names has the wrong type",
            "Line 80 needs the global statement",
          ],
          correctIndex: 1,
          explanation:
            "LEGB: Global is searched before Built-in, so the module-level `list = [...]` hijacks every later use of the name in the file. Rename the variable (values, items) — and note this is why editors gray-out or warn on shadowed built-ins.",
        },
      ],
    },

    {
      id: "interview-questions",
      type: "interview-questions",
      tocLabel: "Interview Prep",
      questions: [
        {
          question: "Explain the LEGB rule and how shadowing follows from it.",
          answer:
            "LEGB is Python's name-resolution order: Local (the current function's names, including parameters), Enclosing (any wrapping function's names), Global (module-level names), Built-in (print, len, and friends) — searched in that order, stopping at the first match. Shadowing is the direct consequence: a name defined in an inner layer makes any same-named outer name unreachable by that spelling — not modified, just hidden. Practical corollaries worth naming: a function assigning `rate` never touches a global `rate`; a module variable named `list` silently breaks list() for the whole file because Global is checked before Built-in; and two functions can both use `i` and `total` without collision, which is exactly why local isolation is a feature rather than a limitation.",
        },
        {
          question:
            "What causes UnboundLocalError, and what are the idiomatic fixes?",
          answer:
            "Python decides locality at compile time: if a name is assigned ANYWHERE in a function body — even inside a branch that never executes — that name is local for the entire function. UnboundLocalError fires when a line READS the name before any assignment has run: the lookup doesn't fall back to the global, because the name is already classified local. The classic trigger is adding `x = x + 1` or a conditional assignment to a function that previously just read a global x. Idiomatic fixes, in order of preference: pass the value as a parameter and return the new value (explicit dataflow); for closures that must rebind an enclosing variable, use nonlocal; and `global` as a last resort that usually signals the state deserves a better home — a parameter, a return value, or a class attribute.",
        },
        {
          question:
            "What exactly does a closure capture — values or variables — and why does the distinction matter?",
          answer:
            "Variables, not values. The inner function keeps a live link to the enclosing VARIABLE, so it sees that variable's state at CALL time, not a snapshot from definition time. Two consequences matter. First, factories work correctly: each call to make_adder(n) creates a fresh enclosing scope, so add5 and add9 hold links to different variables and stay independent. Second, the famous loop gotcha: defining several lambdas in a loop that all reference the loop variable gives functions that all see its FINAL value, because they share one variable — the standard fix is a default argument (lambda x, i=i: ...) which really does snapshot the value at definition. Mentioning that closures underlie decorators — the wrapper closes over the wrapped function — is the natural interview capstone.",
        },
      ],
    },

    {
      id: "common-mistakes",
      type: "callout",
      variant: "warning",
      title: "Common Mistakes to Avoid",
      content:
        "1) Expecting a function's assignment to update a global — it creates a shadowing local. 2) Reading a name before its (anywhere-in-function) assignment — UnboundLocalError, not a global fallback. 3) Shadowing built-ins: list, sum, max, type as variable names break later calls. 4) Reaching for `global` when a parameter + return states the dataflow honestly. 5) Forgetting nonlocal when a closure rebinds its captured counter. 6) Loop-created closures all sharing the final loop value — snapshot with a default argument when you mean per-iteration capture.",
    },

    {
      id: "ai-tutor",
      type: "callout",
      variant: "tip",
      title: "Ask the AI Tutor",
      content:
        "Try these prompts in the AI Tutor panel: • 'Quiz me: for each of these six snippets, which scope does each name resolve to?' • 'Walk me through an UnboundLocalError and its three possible fixes.' • 'Show the loop-variable closure gotcha and the default-argument fix.' • 'When should closure state graduate to a class?' • 'Interview mode: ask me what closures capture and grade my answer.'",
    },

    {
      id: "glossary",
      type: "callout",
      variant: "info",
      title: "Glossary",
      content:
        "Scope — the region of code where a name is visible. LEGB — the lookup order: Local, Enclosing, Global, Built-in. Shadowing — an inner name hiding an outer one of the same spelling. UnboundLocalError — reading a name classified local before it's assigned. Closure — an inner function carrying live links to enclosing variables after the outer function returns. nonlocal — statement aiming an assignment at an enclosing variable. global — statement aiming an assignment at a module variable (avoid). Module-level constant — a CAPS-named global meant to be read, not written. Capture — the closure's link to an enclosing variable (variable, not value).",
    },

    {
      id: "resources",
      type: "callout",
      variant: "info",
      title: "Recommended Resources",
      content:
        "• Docs: 'Scopes and Namespaces' in the official Python tutorial — includes the exact LEGB example this lesson builds on. • Read: the Programming FAQ entry 'Why am I getting an UnboundLocalError?' — Python's own answer to its most-asked scope question. • Practice: write make_accumulator(start) returning a function that adds each argument to a running total (you'll need nonlocal), then explain to yourself where the total lives. • Next in DSM: Functions complete! The Data Structures module opens with Tuples — the immutable sequences you've already been returning from functions, made first-class.",
    },

    {
      id: "recap",
      type: "recap",
      tocLabel: "Recap",
      content:
        "✓ Name lookups climb Local → Enclosing → Global → Built-in and stop at the first hit.\n✓ Assignment anywhere in a function makes that name local everywhere in it — the root of UnboundLocalError.\n✓ Shadowing hides outer names (including built-ins) — it never modifies them.\n✓ Closures capture VARIABLES (live links), which is why factories produce independent functions.\n✓ nonlocal rebinding for closure counters; `global` writes are a design alarm.\n✓ Read module constants freely; pass state as parameters and return results.\n\nNext up: Tuples — the Functions module is complete. Data Structures begins with the immutable sequence you've quietly used in every multi-value return, unpacking, and enumerate() this course.",
    },
  ],
};
