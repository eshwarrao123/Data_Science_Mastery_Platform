import type { Lesson } from "@/lib/curriculum/types";

export const argsAndKwargs: Lesson = {
  meta: {
    id: "python.functions.args-and-kwargs",
    slug: "args-and-kwargs",
    title: "*args and **kwargs",
    description:
      "Accept any number of arguments — the packing and unpacking machinery behind flexible signatures, wrappers, and every framework you'll use.",
    estimatedTime: "25 mins",
    difficulty: "Intermediate",
    xpReward: 60,
    prerequisites: ["python.functions.default-and-keyword-args"],
    masteryThreshold: 80,
  },

  blocks: [
    {
      id: "intro",
      type: "lesson-intro",
      tocLabel: "Introduction",
      intro: {
        hook: "print('a') works. So does print('a', 'b', 'c', 'd') — same function, any number of arguments. How? print's signature doesn't list forty parameters; it collects whatever arrives. Today you learn the two stars that make that possible, and read framework code without flinching.",
        what: "*args collects any extra positional arguments into a tuple; **kwargs collects any extra keyword arguments into a dictionary. The same stars, used at a CALL site, do the reverse: unpack a sequence or dict into individual arguments.",
        why: "Variable-length signatures power the tools you already use — print, max, str.format — and the wrapper pattern (accept anything, pass it along) is how decorators, logging layers, and framework callbacks work. You'll read *args/**kwargs in every serious codebase this year.",
        whereUsed:
          "Utility functions taking any number of inputs, wrapper/passthrough functions, plotting calls forwarding style options, and unpacking config dicts into API calls.",
        objectives: [
          "Write functions accepting any number of positional args with *args",
          "Collect arbitrary keyword options with **kwargs",
          "Unpack sequences and dicts INTO calls with * and **",
          "Order signature parts correctly: required, *args, defaults, **kwargs",
          "Read and write the pass-through wrapper pattern",
        ],
        realWorldApps: [
          {
            company: "Python core",
            headline: "print() itself",
            detail:
              "print(*objects, sep=' ', end='\\n') — the signature you've called a thousand times is *args plus keyword defaults. max() and min() work the same way.",
          },
          {
            company: "Weights & Biases",
            headline: "Experiment logging wrappers",
            detail:
              "wandb-style loggers wrap training functions with def wrapper(*args, **kwargs) so any model's fit call can be intercepted, timed, and forwarded unchanged.",
          },
          {
            company: "Plotly",
            headline: "Style forwarding",
            detail:
              "Chart helpers accept **kwargs and forward them to the underlying trace constructor — one wrapper supports every styling option without redeclaring fifty parameters.",
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
            "In a signature, *args means 'collect all remaining positional arguments into a tuple named args'. The name is convention — *values works identically — but args is what every codebase uses. Inside the body, args is a plain tuple: loop it, len() it, index it.",
        },
        {
          type: "code-note",
          code: "def average(*values):\n    if len(values) == 0:\n        return 0.0\n    return sum(values) / len(values)\n\nprint(average(4, 8))          # 6.0\nprint(average(1, 2, 3, 4, 5)) # 3.0\nprint(average())              # 0.0",
          content:
            "One signature, any arity. Callers pass naked values — no list-building ceremony. The empty-call guard is the same discipline as every accumulator: decide what zero inputs means.",
        },
        {
          type: "analogy",
          title: "The mail tray and the labeled pigeonholes",
          content:
            "A office mailroom has named pigeonholes for known recipients (regular parameters), one open tray for any unaddressed mail (*args — it all piles in, in arrival order), and a box of labeled envelopes for anything addressed to names without pigeonholes (**kwargs — kept WITH their labels). Nothing is refused; everything lands somewhere predictable.",
        },
        {
          type: "keypoint",
          title: "**kwargs: keywords become a dict",
          content:
            "**kwargs collects extra keyword arguments into a dictionary: call f(color='red', width=2) and inside, kwargs is {'color': 'red', 'width': 2}. You'll study dictionaries deeply next module — for now: kwargs['color'] reads a value, 'color' in kwargs tests presence, and .get('color', 'black') reads with a fallback. That's enough to use the pattern.",
        },
        {
          type: "text",
          content:
            "Signature order is fixed and Python enforces it: regular parameters, then *args, then keyword-default parameters, then **kwargs. def report(title, *rows, sep=' | ', **options) accepts one required value, any number of extra positionals, an optional named separator, and any other named options.",
        },
        {
          type: "expandable",
          title: "The stars at CALL sites: unpacking",
          content:
            "The same syntax inverts at a call. If point = (3, 4), then distance(*point) spreads the tuple into distance(3, 4). If config = {'sep': ';', 'end': '!'}, then print('hi', **config) becomes print('hi', sep=';', end='!'). This is everywhere in data code: building an options dict conditionally, then **-ing it into a library call — read_csv(path, **csv_options).",
        },
        {
          type: "keypoint",
          title: "The pass-through wrapper",
          content:
            "def wrapper(*args, **kwargs): ...do something extra...; return real_function(*args, **kwargs) — collect EVERYTHING, forward EVERYTHING. The wrapper works for any function with any signature, which is why timing, logging, retry, and caching layers are all written this shape. When you meet decorators later, this is the entire trick.",
        },
        {
          type: "warning",
          title: "Flexibility is a cost, not a free lunch",
          content:
            "A signature of (*args, **kwargs) tells readers NOTHING about what the function actually needs — no editor autocomplete, no loud arity errors, typos in option names silently vanish into kwargs. Use explicit parameters when you know the inputs; reach for stars only when genuine variability (any count, forwarding) is the point. A concrete tell: if the first line of your body is args[0], you wanted a named parameter.",
        },
      ],
    },

    {
      id: "diagram",
      type: "interactive-diagram",
      tocLabel: "Visual Learning",
      visual: {
        kind: "flow",
        title: "Where each argument lands",
        caption:
          "log('save', 'ok', 200, user='ada', retry=True) hits def log(event, *details, **context). Click each node.",
        nodes: [
          {
            id: "call",
            label: "the call",
            sublabel: "5 arguments",
            detail:
              "One named parameter exists (event); everything else is 'extra' — two positionals and two keywords looking for a home.",
            x: 8,
            y: 40,
            accent: false,
          },
          {
            id: "named",
            label: "event = 'save'",
            sublabel: "regular parameter",
            detail:
              "Named parameters fill first, by position, exactly as you learned. Only what's left over flows to the stars.",
            x: 32,
            y: 40,
            accent: false,
          },
          {
            id: "args",
            label: "details = ('ok', 200)",
            sublabel: "*args tuple",
            detail:
              "The remaining positionals pack into a tuple, preserving order. Zero extras would make an empty tuple — never an error.",
            x: 58,
            y: 18,
            accent: true,
          },
          {
            id: "kwargs",
            label: "context = {'user': 'ada', 'retry': True}",
            sublabel: "**kwargs dict",
            detail:
              "The remaining keywords pack into a dict, names preserved as keys. This is why option typos disappear silently — 'usre' would just become a key nobody reads.",
            x: 58,
            y: 62,
            accent: true,
          },
          {
            id: "body",
            label: "body sees all three",
            sublabel: "tuple + dict, plain data",
            detail:
              "Inside, details and context are ordinary data structures to loop, test, and forward — e.g. real_log(event, *details, **context).",
            x: 86,
            y: 40,
            accent: false,
          },
        ],
        edges: [
          { from: "call", to: "named", label: "position 1" },
          { from: "named", to: "args", label: "extra positionals" },
          { from: "named", to: "kwargs", label: "extra keywords" },
          { from: "args", to: "body" },
          { from: "kwargs", to: "body" },
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
          title: "*args collects positionals",
          scenario: "A checkout that totals any number of item prices.",
          steps: [
            {
              code: "def basket_total(*prices):\n    return round(sum(prices), 2)",
              explanation:
                "prices is a tuple of whatever arrives. sum() doesn't care whether it gets 2 values or 20.",
            },
            {
              code: "print(basket_total(4.99, 12.50))\nprint(basket_total(4.99, 12.50, 0.99, 30.00))",
              explanation:
                "Two calls, different arities, one definition — no list brackets needed at the call.",
            },
          ],
          output: "17.49\n48.48",
        },
        {
          difficulty: "Easy",
          title: "**kwargs collects options",
          scenario: "Render an HTML-style tag with arbitrary attributes.",
          steps: [
            {
              code: "def tag(name, **attrs):\n    parts = [f'{k}=\"{v}\"' for k, v in attrs.items()]\n    return f'<{name} ' + ' '.join(parts) + '>'",
              explanation:
                ".items() yields each (key, value) pair from the collected dict — dict iteration gets full treatment next module; here it powers a comprehension you already read fluently.",
            },
            {
              code: "print(tag('img', src='chart.png', width=400))",
              explanation:
                "src and width aren't in the signature — they land in attrs as {'src': 'chart.png', 'width': 400} and come back out formatted.",
            },
          ],
          output: '<img src="chart.png" width="400">',
        },
        {
          difficulty: "Medium",
          title: "Full signature: required, *args, default, **kwargs",
          scenario:
            "A report-line builder for a metrics dashboard: one required metric name, any number of values, an optional format, arbitrary metadata.",
          steps: [
            {
              code: "def metric_line(name, *values, unit='', **meta):\n    \"\"\"Format a metric with its values and optional metadata.\"\"\"\n    avg = sum(values) / len(values) if values else 0\n    line = f'{name}: avg {avg:.1f}{unit}'\n    if meta:\n        extras = ', '.join([f'{k}={v}' for k, v in meta.items()])\n        line += f' ({extras})'\n    return line",
              explanation:
                "All four signature zones in canonical order. The conditional expression guards empty values; `if meta:` uses truthiness — an empty dict is falsy.",
            },
            {
              code: "print(metric_line('latency', 120, 95, 143, unit='ms'))",
              explanation:
                "Three positionals pack into values; unit is matched by NAME so it doesn't get swallowed into the tuple — that's why it must be passed as a keyword.",
            },
            {
              code: "print(metric_line('errors', 2, 0, 1, source='api', window='5m'))",
              explanation:
                "Unknown keywords (source, window) flow into meta and render as extras. One function, arbitrarily rich call sites.",
            },
          ],
          output:
            "latency: avg 119.3ms\nerrors: avg 1.0 (source=api, window=5m)",
        },
        {
          difficulty: "Hard",
          title: "Unpacking at the call site",
          scenario:
            "Config lives in data (a tuple and a dict); the stars spread it into a call you don't control.",
          steps: [
            {
              code: "def connect(host, port, timeout=10, retries=3):\n    return f'{host}:{port} (timeout={timeout}s, retries={retries})'",
              explanation:
                "A normal, fixed signature — imagine it's from a library you can't edit.",
            },
            {
              code: "server = ('db.internal', 5432)\nprint(connect(*server))",
              explanation:
                "*server unpacks the tuple positionally: host='db.internal', port=5432. One star at a CALL means spread-this-sequence.",
            },
            {
              code: "opts = {'timeout': 30, 'retries': 5}\nprint(connect(*server, **opts))",
              explanation:
                "**opts unpacks the dict as keywords. Building config as data and star-spreading it into calls is the bridge between config files and function calls in real pipelines.",
            },
          ],
          output:
            "db.internal:5432 (timeout=10s, retries=3)\ndb.internal:5432 (timeout=30s, retries=5)",
        },
        {
          difficulty: "Industry Example",
          title: "A timing wrapper that fits any function",
          scenario:
            "A data engineer needs to time several pipeline functions with different signatures — without editing any of them. The pass-through wrapper is the production answer (and the seed of decorators, coming in a later course).",
          steps: [
            {
              code: "def clean_rows(rows, drop_empty=True):\n    result = [r.strip() for r in rows]\n    if drop_empty:\n        result = [r for r in result if r]\n    return result\n\ndef total_chars(*words):\n    return sum([len(w) for w in words])",
              explanation:
                "Two existing functions with completely different signatures — one takes a list and a flag, the other is *args-variadic.",
            },
            {
              code: "def timed(func, *args, **kwargs):\n    \"\"\"Call func with the given arguments and report it.\"\"\"\n    result = func(*args, **kwargs)\n    print(f'[timed] {func.__name__} -> {result!r}')\n    return result",
              explanation:
                "func is a function passed as a value (remember: a name without parentheses is a reference). The stars collect whatever the caller sends and forward it UNCHANGED — timed needs zero knowledge of either signature. (Real versions also measure a clock around the call; the shape is identical.)",
            },
            {
              code: "cleaned = timed(clean_rows, ['  a ', '', ' b'], drop_empty=True)\ncount = timed(total_chars, 'data', 'science')",
              explanation:
                "The same wrapper times both: positional list + keyword flag for one, two naked strings for the other. Collect-and-forward is why *args/**kwargs exists.",
            },
          ],
          output:
            "[timed] clean_rows -> ['a', 'b']\n[timed] total_chars -> 11",
        },
      ],
    },

    {
      id: "inline-practice",
      type: "inline-code",
      tocLabel: "Practice Coding",
      coding: {
        language: "python",
        filename: "scoreboard.py",
        instructions:
          "Build a scoreboard formatter. Define record_game(winner, *scores, **details) that returns a summary line: the winner's name, the number of rounds (len of scores), the total score, plus any extra details appended as key=value pairs. Produce the two outputs shown.",
        starterCode: `# TODO 1: define record_game(winner, *scores, **details)
# Returns: '<winner> won <n> rounds, <total> points' and, if details
# exist, ' | ' followed by 'key=value' pairs joined with ', '
___

# TODO 2: a plain call — Mia, three round scores
print(record_game('Mia', 10, 8, 12))

# TODO 3: a call with two extra details: venue='online', season=3
print(record_game('Kai', 15, 9, ___))`,
        solutionCode: `def record_game(winner, *scores, **details):
    """Summarize a game result with optional metadata."""
    line = f"{winner} won {len(scores)} rounds, {sum(scores)} points"
    if details:
        extras = ', '.join([f"{k}={v}" for k, v in details.items()])
        line += f" | {extras}"
    return line

print(record_game('Mia', 10, 8, 12))

print(record_game('Kai', 15, 9, venue='online', season=3))`,
        expectedOutput:
          "Mia won 3 rounds, 30 points\nKai won 2 rounds, 24 points | venue=online, season=3",
        hints: [
          "winner fills first by position; remaining numbers pack into the scores tuple",
          "len(scores) counts rounds; sum(scores) totals points",
          "if details: — an empty dict is falsy, so plain calls skip the extras",
          "Build the extras with a comprehension over details.items(), joined with ', '",
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
          id: "py14_mcq_01",
          difficulty: "Easy",
          question: "Inside def f(*args):, what TYPE is args?",
          options: ["A list", "A tuple", "A dict", "Depends on the call"],
          correctIndex: 1,
          explanation:
            "Extra positionals always pack into a tuple — even zero of them (empty tuple). **kwargs is the one that packs into a dict.",
        },
        {
          type: "mcq",
          id: "py14_mcq_02",
          difficulty: "Easy",
          question:
            "def f(a, *rest): ... called as f(1, 2, 3, 4) — what is rest?",
          options: ["(1, 2, 3, 4)", "(2, 3, 4)", "[2, 3, 4]", "4"],
          correctIndex: 1,
          explanation:
            "Named parameters fill first: a=1. The leftovers (2, 3, 4) pack into the tuple. Option C has the right values but the wrong type.",
        },
        {
          type: "mcq",
          id: "py14_mcq_03",
          difficulty: "Medium",
          question:
            "point = [3, 4] and def dist(x, y): ... — which call spreads the list into x and y?",
          options: ["dist(point)", "dist(*point)", "dist(**point)", "dist(point[])"],
          correctIndex: 1,
          explanation:
            "One star at a call site unpacks a sequence positionally. dist(point) passes the whole list as x (then fails on missing y); ** requires a dict with keys matching parameter names.",
        },
        {
          type: "scenario",
          id: "py14_sc_01",
          difficulty: "Medium",
          scenario:
            "A teammate calls a **kwargs-based charting helper with colour='red' (British spelling). No error is raised — the chart just silently renders in the default black. The same typo against an explicit `color='black'` parameter would have raised TypeError immediately.",
          question: "What does this illustrate about **kwargs?",
          options: [
            "**kwargs functions run slower",
            "**kwargs swallows unknown names silently — flexibility trades away typo detection",
            "British spellings need special handling",
            "The helper should have used *args instead",
          ],
          correctIndex: 1,
          explanation:
            "Any name is a 'valid' kwargs key, so misspelled options become unread dict entries instead of loud errors. Mature libraries mitigate by validating kwargs keys against an allowlist — or by declaring real parameters where the option set is known.",
        },
        {
          type: "coding",
          id: "py14_code_01",
          difficulty: "Medium",
          prompt:
            "Define longest(*words) returning the longest string passed (first wins ties). Print longest('pandas', 'numpy', 'sklearn') and longest('a', 'bc'). Expected:\nsklearn\nbc",
          starterCode: "# Your code here\n",
          solutionCode:
            "def longest(*words):\n    \"\"\"Return the longest word (first on ties).\"\"\"\n    best = words[0]\n    for w in words:\n        if len(w) > len(best):\n            best = w\n    return best\n\nprint(longest('pandas', 'numpy', 'sklearn'))\nprint(longest('a', 'bc'))",
          expectedOutput: "sklearn\nbc",
          tests: [
            {
              name: "Variadic signature",
              description: "Uses *words — callers pass naked strings, not a list",
            },
            {
              name: "Find-extreme pattern",
              description: "Initializes from the data and updates on strictly-greater",
            },
          ],
        },
        {
          type: "mcq",
          id: "py14_mcq_04",
          difficulty: "Hard",
          question: "Which signature is INVALID?",
          options: [
            "def f(a, *args, sep=',', **kwargs):",
            "def f(*args, **kwargs):",
            "def f(**kwargs, *args):",
            "def f(a, b=1, **kwargs):",
          ],
          correctIndex: 2,
          explanation:
            "The order is fixed: regular params, *args, keyword defaults, **kwargs LAST. Putting **kwargs before *args is a SyntaxError.",
        },
        {
          type: "coding",
          id: "py14_code_02",
          difficulty: "Hard",
          prompt:
            "You're given def send(to, subject, priority='normal'): return f'{to} <- {subject} [{priority}]'. Build msg = {'to': 'ops@acme.io', 'subject': 'disk alert', 'priority': 'high'} and call send using ** unpacking. Print the result. Expected: ops@acme.io <- disk alert [high]",
          starterCode:
            "def send(to, subject, priority='normal'):\n    return f'{to} <- {subject} [{priority}]'\n\n# Your code here\n",
          solutionCode:
            "def send(to, subject, priority='normal'):\n    return f'{to} <- {subject} [{priority}]'\n\nmsg = {'to': 'ops@acme.io', 'subject': 'disk alert', 'priority': 'high'}\nprint(send(**msg))",
          expectedOutput: "ops@acme.io <- disk alert [high]",
          tests: [
            {
              name: "Dict unpacking",
              description: "The call must use **msg, not manual key access",
            },
            {
              name: "Keys match parameters",
              description: "Each dict key lands in its same-named parameter",
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
          question: "What are *args and **kwargs, and what do the stars do at call sites?",
          answer:
            "In a signature, *args collects surplus positional arguments into a tuple and **kwargs collects surplus keyword arguments into a dict — the names are pure convention; the stars are the syntax. At a call site the stars invert: *sequence spreads its elements as positional arguments and **dict spreads its items as keyword arguments, with keys matching parameter names. So the same two symbols are 'pack' in a def and 'unpack' in a call. The canonical demonstration is the pass-through wrapper — def wrapper(*args, **kwargs): return f(*args, **kwargs) — which collects anything and forwards it unchanged, and is the mechanical basis of decorators, logging shims, and retry layers.",
        },
        {
          question:
            "When is (*args, **kwargs) the RIGHT signature, and when is it a design smell?",
          answer:
            "Right: when variability is the point. Genuine any-count functions (sum-like utilities, print), forwarding wrappers that must fit every wrapped signature, and adapters passing options through to an underlying library (a chart helper forwarding **style to matplotlib). Smell: when the function actually requires specific inputs but hides them — a body starting with args[0], args[1] wanted named parameters; readers get no autocomplete, no arity errors, and misspelled options silently vanish into kwargs instead of raising TypeError. My review heuristic: stars for forwarding and true variadics, explicit names for everything the function itself consumes — and when both occur, consume by name and forward the rest.",
        },
        {
          question:
            "Explain the full parameter ordering rule and why Python enforces it.",
          answer:
            "The canonical order is: regular positional parameters, then *args, then keyword-default parameters, then **kwargs — e.g. def report(title, *rows, sep=', ', **options). The order exists because binding must be unambiguous: positionals fill named slots left to right, *args must mark where 'the rest of the positionals' begins, anything after *args can only arrive by name (which is why parameters there are effectively keyword-only), and **kwargs sweeps up remaining names so it must be last. A worthwhile aside: a bare * in a signature — def f(data, *, strict=False) — is the same mechanism used purely to FORCE keyword-only options, which is how modern libraries prevent unreadable positional flag calls.",
        },
      ],
    },

    {
      id: "common-mistakes",
      type: "callout",
      variant: "warning",
      title: "Common Mistakes to Avoid",
      content:
        "1) Wrong zone order in a signature — **kwargs before *args is a SyntaxError. 2) Indexing args[0]/args[1] for required inputs — declare real parameters instead. 3) Forgetting the stars when forwarding: f(args, kwargs) passes a tuple and a dict as TWO arguments; f(*args, **kwargs) forwards the originals. 4) Expecting typo protection from **kwargs — unknown names are swallowed silently. 5) Passing a list where naked values are expected: average([1,2,3]) puts one list in the tuple; average(1,2,3) or average(*nums) is what you meant. 6) Mutating the kwargs dict then forwarding it, surprising the inner function.",
    },

    {
      id: "ai-tutor",
      type: "callout",
      variant: "tip",
      title: "Ask the AI Tutor",
      content:
        "Try these prompts in the AI Tutor panel: • 'Quiz me: for each of these six calls, what lands in args and kwargs?' • 'Show me a wrapper that logs, then forwards, any function call.' • 'When should I use explicit parameters instead of stars? Critique this signature.' • 'Demonstrate * and ** unpacking with a config-dict example.' • 'Interview mode: ask me the parameter ordering rules and grade my answer.'",
    },

    {
      id: "glossary",
      type: "callout",
      variant: "info",
      title: "Glossary",
      content:
        "*args — collects surplus positional arguments into a tuple (name conventional). **kwargs — collects surplus keyword arguments into a dict. Packing — the collecting behavior in a signature. Unpacking — the spreading behavior at a call site (*sequence, **dict). Variadic function — one accepting a variable number of arguments. Pass-through wrapper — a function that collects everything and forwards it to another. Keyword-only parameter — declared after *args (or a bare *), passable only by name. .items() — dict method yielding (key, value) pairs. func.__name__ — a function object's own name string.",
    },

    {
      id: "resources",
      type: "callout",
      variant: "info",
      title: "Recommended Resources",
      content:
        "• Docs: 'Arbitrary Argument Lists' and 'Unpacking Argument Lists' in the official Python tutorial. • Read: the signature of print() in the built-ins docs — *objects, sep, end, and you now know why it reads that way. • Practice: write describe(*nums, **options) returning min/max/mean with an optional decimals= option, then call it by unpacking a list and a dict. • Next in DSM: some functions are so small they don't deserve a name — Lambda Functions covers Python's one-expression anonymous functions and where they genuinely belong.",
    },

    {
      id: "recap",
      type: "recap",
      tocLabel: "Recap",
      content:
        "✓ *args packs surplus positionals into a tuple; **kwargs packs surplus keywords into a dict.\n✓ Signature zones in fixed order: regular, *args, keyword defaults, **kwargs.\n✓ At call sites the stars invert: *sequence and **dict spread data into arguments.\n✓ The pass-through wrapper — collect everything, forward everything — powers logging, timing, and (later) decorators.\n✓ Stars trade safety for flexibility: no arity errors, silent option typos — use real parameters when inputs are known.\n✓ Parameters after *args are keyword-only, a feature libraries use deliberately.\n\nNext up: Lambda Functions. You've built full functions with def — next, the one-line anonymous kind you'll pass to sorted(), and the judgment call of when NOT to use them.",
    },
  ],
};
