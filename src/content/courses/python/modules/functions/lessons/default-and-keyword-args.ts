import type { Lesson } from "@/lib/curriculum/types";

export const defaultAndKeywordArgs: Lesson = {
  meta: {
    id: "python.functions.default-and-keyword-args",
    slug: "default-and-keyword-args",
    title: "Default & Keyword Arguments",
    description:
      "Give parameters fallback values and let callers name what they pass — the API style every data library is built on.",
    estimatedTime: "25 mins",
    difficulty: "Beginner",
    xpReward: 50,
    prerequisites: ["python.functions.parameters-and-return-values"],
    masteryThreshold: 80,
  },

  blocks: [
    {
      id: "intro",
      type: "lesson-intro",
      tocLabel: "Introduction",
      intro: {
        hook: "You've already read this line in the wild: pd.read_csv('data.csv', sep=';', header=0). One required argument, two NAMED ones, and a dozen more silently using sensible defaults. That calling style is not pandas magic — it's two plain Python features you're about to own.",
        what: "A default argument gives a parameter a fallback value in the def, making it optional at the call. A keyword argument is passed as name=value, matching by NAME instead of position.",
        why: "Real functions accumulate options. Without defaults, every caller passes everything, every time. Without keywords, calls become unreadable positional soup — round(3.14159, 2) is fine, but plot(data, True, False, 0.8, 'red') is a quiz. Defaults + keywords are how Python APIs stay humane at scale.",
        whereUsed:
          "Every data library call you'll ever write: read_csv's 50 optional parameters, train_test_split(test_size=0.2), plt.plot(alpha=0.5), sorted(key=..., reverse=True).",
        objectives: [
          "Define parameters with default values",
          "Call functions with keyword arguments in any order",
          "Order parameters correctly: required first, defaults after",
          "Avoid the mutable default argument trap",
          "Read library signatures like read_csv fluently",
        ],
        realWorldApps: [
          {
            company: "pandas",
            headline: "read_csv's 50 defaults",
            detail:
              "read_csv has one required parameter and roughly fifty optional ones — sep=',', header='infer', encoding=None. Millions of users pass only what they need; defaults do the rest.",
          },
          {
            company: "Anthropic",
            headline: "API client parameters",
            detail:
              "SDK calls like client.messages.create(model=..., max_tokens=1024, temperature=0.7) rely on keyword arguments so code reads as configuration, not a puzzle of positions.",
          },
          {
            company: "Matplotlib",
            headline: "Chart styling",
            detail:
              "plt.plot(x, y, color='steelblue', linewidth=2, alpha=0.8) — positional data, keyword styling. The split you'll use in the visualization course daily.",
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
            "A default is declared in the def: `def connect(host, timeout=30):`. Callers may omit timeout (getting 30) or supply their own. One rule of order: parameters WITH defaults must come after parameters without — Python enforces it with a SyntaxError, because otherwise it couldn't tell which positional argument belongs where.",
        },
        {
          type: "code-note",
          code: "def format_price(amount, currency='USD', decimals=2):\n    return f'{amount:.{decimals}f} {currency}'\n\nprint(format_price(49.5))                 # both defaults\nprint(format_price(49.5, 'EUR'))          # positional override\nprint(format_price(49.5, decimals=0))     # keyword skips currency",
          content:
            "Three call styles against one definition. The last line is the point: keywords let you override the SECOND default without touching the first — impossible with positions alone.",
        },
        {
          type: "analogy",
          title: "The coffee order",
          content:
            "A café order form has defaults: medium size, whole milk, no extra shot. Regulars just say 'a latte' — defaults apply. Custom orders name only what changes: 'a latte, oat milk'. Nobody recites every option in a fixed order, and the barista never guesses which unlabeled word meant the milk. Keyword arguments are ordering coffee like a human.",
        },
        {
          type: "keypoint",
          title: "Keywords match by name — order stops mattering",
          content:
            "split_data(df, test_size=0.2, shuffle=True) and split_data(df, shuffle=True, test_size=0.2) are identical calls. Naming eliminates the silent-swap bug from last lesson AND documents the call site: six months later, test_size=0.2 still explains itself where a bare 0.2 wouldn't. Convention: positional for the obvious core data, keywords for options.",
        },
        {
          type: "text",
          content:
            "Mixing rules: positional arguments must come before keyword arguments in a call — f(1, x=2) is legal, f(x=2, 1) is a SyntaxError. And each parameter gets exactly one value: f(1, amount=1) where amount is the first parameter raises 'got multiple values for argument'.",
        },
        {
          type: "expandable",
          title: "How defaults make APIs evolvable",
          content:
            "When pandas adds a new option to read_csv, it ships with a default matching the old behavior — every existing call keeps working, and only users who want the feature name it. That's why mature libraries grow keyword-only options instead of new function variants. You'll apply the same trick to your own utilities: adding verbose=False to a shared function breaks none of its forty call sites.",
        },
        {
          type: "warning",
          title: "The mutable default trap",
          content:
            "Default values are evaluated ONCE, at definition time — not per call. Harmless for numbers and strings, but `def add_row(row, table=[]):` creates ONE shared list reused by every call that omits table: rows from different calls pile into the same list. The standard fix: default to None and create fresh inside — `def add_row(row, table=None): if table is None: table = []`. This is a favorite interview question because it looks like magic until you know the one-evaluation rule.",
        },
      ],
    },

    {
      id: "diagram",
      type: "interactive-diagram",
      tocLabel: "Visual Learning",
      visual: {
        kind: "comparison",
        title: "How arguments find their parameters",
        caption:
          "One call — report(sales, 'Q3', top_n=5) — resolved step by step. Click each node.",
        nodes: [
          {
            id: "sig",
            label: "def report(data, period, top_n=10, verbose=False)",
            sublabel: "the signature",
            detail:
              "Two required parameters, two with defaults. The signature is the contract callers read — required first, options after, exactly as Python demands.",
            x: 50,
            y: 12,
            accent: true,
          },
          {
            id: "pos",
            label: "sales → data, 'Q3' → period",
            sublabel: "positional first",
            detail:
              "Unnamed arguments fill parameters left to right. The core inputs — the data itself — are conventionally positional because their meaning is obvious.",
            x: 20,
            y: 50,
            accent: false,
          },
          {
            id: "kw",
            label: "top_n=5",
            sublabel: "keyword by name",
            detail:
              "Named arguments jump straight to their parameter regardless of position. top_n gets 5, overriding its default of 10.",
            x: 50,
            y: 50,
            accent: false,
          },
          {
            id: "def",
            label: "verbose → False",
            sublabel: "default fills the gap",
            detail:
              "Nothing was passed for verbose, so its default applies. Callers only mention what deviates from normal — that's the whole ergonomic.",
            x: 80,
            y: 50,
            accent: false,
          },
        ],
        edges: [
          { from: "sig", to: "pos", label: "1. by position" },
          { from: "sig", to: "kw", label: "2. by name" },
          { from: "sig", to: "def", label: "3. defaults" },
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
          title: "One default parameter",
          scenario: "A greeting utility where the greeting word is optional.",
          steps: [
            {
              code: "def greet(name, greeting='Hello'):\n    return f'{greeting}, {name}!'",
              explanation:
                "name is required; greeting falls back to 'Hello'. Required-then-default order is mandatory.",
            },
            {
              code: "print(greet('Ada'))\nprint(greet('Ada', 'Welcome back'))",
              explanation:
                "First call uses the default; second overrides it positionally. Same function, two levels of ceremony.",
            },
          ],
          output: "Hello, Ada!\nWelcome back, Ada!",
        },
        {
          difficulty: "Easy",
          title: "Keywords make the call self-documenting",
          scenario: "A rounding helper for a finance report, called two ways.",
          steps: [
            {
              code: "def to_currency(value, symbol='$', decimals=2):\n    return f'{symbol}{value:.{decimals}f}'",
              explanation: "Two options with sensible defaults after the required value.",
            },
            {
              code: "print(to_currency(1234.567))\nprint(to_currency(1234.567, symbol='€'))\nprint(to_currency(1234.567, decimals=0))",
              explanation:
                "The keyword calls skip straight to the option they change. Try writing the third call positionally — you can't without also passing symbol. That's the power.",
            },
          ],
          output: "$1234.57\n€1234.57\n$1235",
        },
        {
          difficulty: "Medium",
          title: "Designing a signature: required core, optional knobs",
          scenario:
            "A text-cleaning function for an ingestion pipeline where different sources need different strictness.",
          steps: [
            {
              code: "def clean_text(text, lowercase=True, strip_punct=False):\n    \"\"\"Normalize a text value with configurable steps.\"\"\"\n    result = text.strip()\n    if lowercase:\n        result = result.lower()\n    if strip_punct:\n        result = result.replace(',', '').replace('.', '').replace('!', '')\n    return result",
              explanation:
                "The data (text) is required and positional; the behavior knobs are boolean defaults reflecting the most common need. Each flag guards one optional step.",
            },
            {
              code: "print(clean_text('  Hello, World!  '))\nprint(clean_text('  Hello, World!  ', strip_punct=True))\nprint(clean_text('  ACME Corp.  ', lowercase=False))",
              explanation:
                "Three sources, three configurations, zero copies of the function. Note every call names its flags — clean_text('x', True, False) would compile but force readers to memorize flag order.",
            },
          ],
          output: "hello, world!\nhello world\nACME Corp.",
        },
        {
          difficulty: "Hard",
          title: "The mutable default trap, live",
          scenario: "Watch the shared-list bug happen, then fix it properly.",
          steps: [
            {
              code: "def tag_broken(item, tags=[]):\n    tags.append(item)\n    return tags\n\nprint(tag_broken('urgent'))\nprint(tag_broken('review'))",
              explanation:
                "Two INDEPENDENT calls... yet the second prints both items. The [] was created once at definition time; both calls appended to that same list. State is leaking between calls that should know nothing about each other.",
            },
            {
              code: "def tag(item, tags=None):\n    if tags is None:\n        tags = []\n    tags.append(item)\n    return tags\n\nprint(tag('urgent'))\nprint(tag('review'))",
              explanation:
                "The None-sentinel fix: the default is the immutable None, and a FRESH list is built inside the body on each call that needs one. Now the calls are independent, as callers expect.",
            },
            {
              code: "shared = ['existing']\nprint(tag('extra', shared))",
              explanation:
                "Passing an explicit list still works — the sentinel only fills the omitted case. Same signature, correct semantics in both uses.",
            },
          ],
          output:
            "['urgent']\n['urgent', 'review']\n['urgent']\n['review']\n['existing', 'extra']",
        },
        {
          difficulty: "Industry Example",
          title: "Reading a real library signature",
          scenario:
            "A data analyst writes a mini version of train/test splitting with the exact signature conventions scikit-learn uses — then reads the real thing without blinking.",
          steps: [
            {
              code: "def split_rows(rows, test_size=0.25, shuffle=False):\n    \"\"\"Split rows into (train, test) by fraction.\"\"\"\n    data = list(rows)\n    if shuffle:\n        data = data[::-1]  # stand-in for real shuffling\n    cut = int(len(data) * (1 - test_size))\n    return data[:cut], data[cut:]",
              explanation:
                "Same shape as the real API: data positional, options as named defaults, tuple return. (Real shuffling uses the random module — the reversal is a deterministic stand-in so outputs are checkable.)",
            },
            {
              code: "rows = [1, 2, 3, 4, 5, 6, 7, 8]\ntrain, test = split_rows(rows, test_size=0.25)\nprint(f'train={train} test={test}')",
              explanation:
                "The call reads as a sentence: split rows, a quarter for test. 6 training rows, 2 test rows, unpacked from the returned tuple — last lesson's skill.",
            },
            {
              code: "train, test = split_rows(rows, shuffle=True)\nprint(f'train={train} test={test}')",
              explanation:
                "Overriding only shuffle: test_size keeps its 0.25 default. Now read the real thing — train_test_split(X, y, test_size=0.2, shuffle=True, random_state=42) — and notice you understand every token: positional data, keyword options, defaults for the rest.",
            },
          ],
          output:
            "train=[1, 2, 3, 4, 5, 6] test=[7, 8]\ntrain=[8, 7, 6, 5, 4, 3] test=[2, 1]",
        },
      ],
    },

    {
      id: "inline-practice",
      type: "inline-code",
      tocLabel: "Practice Coding",
      coding: {
        language: "python",
        filename: "notify.py",
        instructions:
          "Build a notification formatter for an alerting system. Define format_alert(message, level='INFO', repeat=1) that uppercases the level, prefixes it in brackets, and repeats the line `repeat` times separated by newlines. Produce the three outputs shown using defaults and keywords appropriately.",
        starterCode: `# TODO 1: define format_alert(message, level='INFO', repeat=1)
# It returns '[LEVEL] message' repeated 'repeat' times, newline-separated
___

# TODO 2: default call
print(format_alert('backup finished'))

# TODO 3: override ONLY the level using a keyword
print(format_alert('disk almost full', ___))

# TODO 4: override ONLY repeat using a keyword
print(format_alert('service down', ___))`,
        solutionCode: `def format_alert(message, level='INFO', repeat=1):
    """Return '[LEVEL] message', repeated on separate lines."""
    line = f"[{level.upper()}] {message}"
    return "\\n".join([line] * repeat)

print(format_alert('backup finished'))

print(format_alert('disk almost full', level='warn'))

print(format_alert('service down', repeat=2))`,
        expectedOutput:
          "[INFO] backup finished\n[WARN] disk almost full\n[INFO] service down\n[INFO] service down",
        hints: [
          "Build one line first: f'[{level.upper()}] {message}'",
          "Repeat lines with a list: [line] * repeat, then '\\n'.join(...)",
          "TODO 3 passes level='warn' — repeat keeps its default",
          "TODO 4 passes repeat=2 — level keeps its default, so both lines say [INFO]",
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
          id: "py13_mcq_01",
          difficulty: "Easy",
          question: "Which definition is a SyntaxError?",
          options: [
            "def f(a, b=2):",
            "def f(a=1, b):",
            "def f(a, b=2, c=3):",
            "def f(a=1, b=2):",
          ],
          correctIndex: 1,
          explanation:
            "Parameters with defaults must come AFTER those without. A required parameter following a default one would make positional calls ambiguous, so Python rejects the def itself.",
        },
        {
          type: "mcq",
          id: "py13_mcq_02",
          difficulty: "Easy",
          question:
            "def resize(img, width=100, height=100): ... — which call sets ONLY height to 50?",
          options: [
            "resize(img, 50)",
            "resize(img, height=50)",
            "resize(img, , 50)",
            "resize(height=50)",
          ],
          correctIndex: 1,
          explanation:
            "A keyword jumps straight to its parameter. Option A sets width (position 2); C is a SyntaxError; D omits the required img.",
        },
        {
          type: "mcq",
          id: "py13_mcq_03",
          difficulty: "Medium",
          question:
            "What does this print?\n\ndef append_log(entry, log=[]):\n    log.append(entry)\n    return log\n\nappend_log('a')\nprint(append_log('b'))",
          options: ["['b']", "['a', 'b']", "['a']", "A TypeError"],
          correctIndex: 1,
          explanation:
            "The [] default was created once at definition time and is shared across calls — 'a' is still in it when 'b' arrives. The None-sentinel pattern (log=None, create inside) fixes it.",
        },
        {
          type: "scenario",
          id: "py13_sc_01",
          difficulty: "Medium",
          scenario:
            "Your team's plotting helper is called as make_chart(df, True, False, 0.5, 'tab10') all over the codebase. A new hire just spent an hour discovering that the third positional argument means 'log scale'.",
          question: "What convention prevents this?",
          options: [
            "Rename the function to describe all its flags",
            "Pass option flags as keyword arguments — make_chart(df, grid=True, legend=False, alpha=0.5, palette='tab10')",
            "Add a comment above every call",
            "Split it into 16 functions, one per flag combination",
          ],
          correctIndex: 1,
          explanation:
            "Data positional, options by name. The call becomes self-documenting at every site, and argument order can no longer silently swap two booleans. (Libraries increasingly ENFORCE this with keyword-only parameters.)",
        },
        {
          type: "coding",
          id: "py13_code_01",
          difficulty: "Medium",
          prompt:
            "Define paginate(items, page_size=3) that returns the FIRST page (a list of at most page_size items). Print paginate([1,2,3,4,5,6,7]) and paginate([1,2,3,4,5,6,7], page_size=5). Expected:\n[1, 2, 3]\n[1, 2, 3, 4, 5]",
          starterCode: "# Your code here\n",
          solutionCode:
            "def paginate(items, page_size=3):\n    \"\"\"Return the first page of items.\"\"\"\n    return items[:page_size]\n\nprint(paginate([1, 2, 3, 4, 5, 6, 7]))\nprint(paginate([1, 2, 3, 4, 5, 6, 7], page_size=5))",
          expectedOutput: "[1, 2, 3]\n[1, 2, 3, 4, 5]",
          tests: [
            {
              name: "Default applies",
              description: "The first call must use page_size 3 without passing it",
            },
            {
              name: "Keyword override",
              description: "The second call overrides page_size by name",
            },
          ],
        },
        {
          type: "mcq",
          id: "py13_mcq_04",
          difficulty: "Hard",
          question:
            "def f(a, b=2): ... — what does f(1, a=3) raise?",
          options: [
            "Nothing; a becomes 3",
            "TypeError: got multiple values for argument 'a'",
            "SyntaxError",
            "NameError",
          ],
          correctIndex: 1,
          explanation:
            "The positional 1 already filled a; the keyword a=3 tries to fill it again. Each parameter accepts exactly one value — Python raises a loud, precise TypeError.",
        },
        {
          type: "scenario",
          id: "py13_sc_02",
          difficulty: "Hard",
          scenario:
            "You maintain fetch_data(url) used in 80 places. You need optional caching. A colleague proposes fetch_data_cached(url) as a second function; you propose adding a parameter.",
          question: "Which change keeps all 80 call sites working AND why?",
          options: [
            "The second function — old calls never see it",
            "fetch_data(url, use_cache=False) — a default preserves old behavior at every existing call, and new callers opt in by keyword",
            "fetch_data(use_cache, url) — cache flag first for visibility",
            "Both are equally safe",
          ],
          correctIndex: 1,
          explanation:
            "A defaulted parameter whose default reproduces the old behavior is invisible to existing callers — this is how read_csv grew 50 options without breaking anyone. A parallel function forks logic into two places (A 'works' but doubles maintenance); C breaks every existing call.",
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
            "Explain the mutable default argument problem and the standard fix.",
          answer:
            "Default values are evaluated exactly once, when the def statement executes — not on each call. For immutable defaults (numbers, strings, None) that's invisible. But a mutable default like [] or {} becomes a single object SHARED by every call that omits the argument: append to it in one call and the next call sees the leftovers, so state leaks between supposedly independent calls. The standard fix is the None sentinel: declare param=None, and inside the body write `if param is None: param = []` to build a fresh object per call. The follow-up worth volunteering: the same one-evaluation rule means a default like timestamp=now() freezes the time at import — dynamic defaults always belong inside the body.",
        },
        {
          question:
            "When do you pass arguments positionally versus by keyword? What convention do major libraries follow?",
          answer:
            "The working convention: positional for the essential data whose meaning is unmistakable — the DataFrame, the file path, the (x, y) pair — and keywords for everything optional or configuration-like. Keywords buy three things: the call documents itself (test_size=0.2 needs no comment), argument order can't silently swap same-typed values, and you can override the fifth option without restating the four before it. Libraries like pandas and scikit-learn follow exactly this — read_csv(path, sep=';') — and increasingly enforce it by making options keyword-only, so plot(data, True, False) simply won't run. My personal rule: any boolean or any second same-typed argument gets a name.",
        },
        {
          question:
            "You need to add an option to a function with dozens of existing call sites. Walk me through doing it safely.",
          answer:
            "Add a new parameter with a default that exactly reproduces the current behavior — fetch_data(url, use_cache=False) where all existing behavior corresponds to False. Every current call continues to compile and behave identically because the default fills the gap; only new call sites name the option to opt in. That's backwards-compatible API evolution, and it's how read_csv accumulated fifty options over a decade without a breaking release. Things I'd check in review: the default really is behavior-preserving (not just plausible), the new parameter goes after existing ones so positional callers are unaffected, and documentation states the default. The anti-patterns to name: creating fetch_data_v2 (forks maintenance) and changing the parameter order (breaks every positional call silently).",
        },
      ],
    },

    {
      id: "common-mistakes",
      type: "callout",
      variant: "warning",
      title: "Common Mistakes to Avoid",
      content:
        "1) Mutable defaults (=[] or ={}) — shared across calls; use the None sentinel. 2) Required parameter after a defaulted one — SyntaxError at definition. 3) Positional arguments after keyword ones in a call — SyntaxError. 4) Passing a value both positionally and by keyword — 'multiple values' TypeError. 5) Boolean flags passed positionally (f(df, True, False)) — legal, unreadable; name them. 6) Dynamic defaults evaluated at def time (timestamp=now()) — compute inside the body instead.",
    },

    {
      id: "ai-tutor",
      type: "callout",
      variant: "tip",
      title: "Ask the AI Tutor",
      content:
        "Try these prompts in the AI Tutor panel: • 'Quiz me on which of these six calls are legal and what they bind.' • 'Walk me through the mutable default trap with a fresh example.' • 'Show me read_csv's signature and explain five of its defaults.' • 'Help me redesign this positional-soup function signature.' • 'Interview mode: ask me how to evolve an API without breaking callers.'",
    },

    {
      id: "glossary",
      type: "callout",
      variant: "info",
      title: "Glossary",
      content:
        "Default argument — a fallback value declared in the def, making the parameter optional. Keyword argument — an argument passed as name=value, matched by name. Positional argument — matched by order. Signature — a function's name plus its parameter list; the contract callers read. None sentinel — defaulting to None and creating the real (mutable) value inside the body. Keyword-only parameter — one that callers MUST name (enforced with * in the signature — you'll meet it next lesson). Backwards compatibility — new versions keeping old calls working. API surface — everything callers can see and depend on.",
    },

    {
      id: "resources",
      type: "callout",
      variant: "info",
      title: "Recommended Resources",
      content:
        "• Docs: 'Default Argument Values' and 'Keyword Arguments' in the official Python tutorial. • Read: the pandas read_csv API page — count how many defaults you now understand at a glance. • Practice: take a three-flag function you've written and convert every call site to keywords; feel the readability change. • Next in DSM: what if a function should accept ANY number of arguments? *args and **kwargs — the packing/unpacking machinery behind flexible signatures.",
    },

    {
      id: "recap",
      type: "recap",
      tocLabel: "Recap",
      content:
        "✓ Defaults in the def make parameters optional; required parameters always come first.\n✓ Keywords match by name — order-proof, self-documenting, and able to skip earlier defaults.\n✓ Positional for core data, keywords for options: the convention every major library follows.\n✓ Mutable defaults are evaluated once and shared — use the None sentinel.\n✓ Adding a behavior-preserving default is how APIs evolve without breaking callers.\n✓ One value per parameter; positionals before keywords in every call.\n\nNext up: *args and **kwargs. Some functions must accept any number of arguments — packing and unpacking give you variable-length signatures and the ** trick you'll meet in every framework.",
    },
  ],
};
