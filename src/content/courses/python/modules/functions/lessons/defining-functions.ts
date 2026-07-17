import type { Lesson } from "@/lib/curriculum/types";

export const definingFunctions: Lesson = {
  meta: {
    id: "python.functions.defining-functions",
    slug: "defining-functions",
    title: "Defining & Calling Functions",
    description:
      "Wrap logic in a name you can call — the unit of reuse behind every pipeline, library, and test you'll ever touch.",
    estimatedTime: "30 mins",
    difficulty: "Beginner",
    xpReward: 60,
    prerequisites: ["python.control-flow.conditionals"],
    masteryThreshold: 80,
  },

  blocks: [
    {
      id: "intro",
      type: "lesson-intro",
      tocLabel: "Introduction",
      intro: {
        hook: "You've already USED dozens of functions — print(), len(), type(), round() — without writing one. Each is a named machine: data goes in, work happens, a result comes out. Today you build your own machines, and your code stops being a script and starts being a toolbox.",
        what: "A function is a named, reusable block of code defined with def. You call it by name with parentheses, optionally passing inputs, and it hands control back when it finishes — usually with a result via return (which the next lesson covers in depth).",
        why: "Copy-pasted logic drifts: fix a bug in one copy and the other three keep it. Functions give logic ONE home — one place to fix, test, and name. Every serious codebase, from pandas to your future pipelines, is functions calling functions.",
        whereUsed:
          "Every data pipeline stage (load, clean, transform, report), every test, every library API you'll call — read_csv, fit, predict are all just functions someone defined.",
        objectives: [
          "Define functions with def and call them by name",
          "Explain what happens when a call runs (jump in, execute, jump back)",
          "Write docstrings that state what a function does",
          "Break a script into small single-purpose functions",
          "Recognize definition time vs call time",
        ],
        realWorldApps: [
          {
            company: "Spotify",
            headline: "Feature pipelines as functions",
            detail:
              "Audio-feature extraction is a chain of named functions — normalize_loudness, compute_tempo — each testable alone, composed into the pipeline that scores every uploaded track.",
          },
          {
            company: "Two Sigma",
            headline: "Research code review",
            detail:
              "Quant researchers must ship strategies as small pure functions — pricing, signal, risk — because reviewers reject thousand-line scripts nobody can audit.",
          },
          {
            company: "Instacart",
            headline: "Shared cleaning utilities",
            detail:
              "One clean_product_name() function is imported by dozens of internal jobs — a single fix to its logic corrected months of subtle catalog duplicates everywhere at once.",
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
            "A definition starts with def, then the function's name, parentheses (holding parameter names, if any), and a colon. The indented block is the body. Defining a function runs NONE of its code — it just teaches Python the name. The body runs only when you CALL the function with name().",
        },
        {
          type: "code-note",
          code: "def greet(name):\n    print(f'Hello, {name}!')\n\ngreet('Ada')\ngreet('Grace')",
          content:
            "One definition, two calls. Each call jumps into the body with name bound to the argument, runs it, and jumps back. The parentheses in a call are not optional — greet alone is the function itself (a value!), greet('Ada') runs it.",
        },
        {
          type: "analogy",
          title: "The recipe card",
          content:
            "Writing a recipe card doesn't cook anything — it records the steps once. Cooking happens when someone follows the card, and the same card can be followed a hundred times with different ingredients. def writes the card; the call cooks. And like a good recipe card, the name on top ('Weeknight Curry') should say what you get.",
        },
        {
          type: "keypoint",
          title: "One function, one job",
          content:
            "The most reliable design rule in programming: a function should do ONE thing, stated by its name. load_csv() loads. remove_duplicates() removes. If the honest name would be load_and_clean_and_plot(), that's three functions being held hostage. Small single-purpose functions are testable, reusable, and — crucially — readable as a table of contents for your logic.",
        },
        {
          type: "code-note",
          code: "def celsius_to_fahrenheit(c):\n    \"\"\"Convert a Celsius temperature to Fahrenheit.\"\"\"\n    return c * 9 / 5 + 32\n\nprint(celsius_to_fahrenheit(100))  # 212.0",
          content:
            "The triple-quoted string right under the def is a docstring — the function's built-in documentation, shown by help() and your editor's hover. One clear sentence is enough. return sends the result back to the caller; the full story of parameters and return is next lesson.",
        },
        {
          type: "text",
          content:
            "Naming: functions are actions, so name them verb-first in snake_case — calculate_tax, validate_email, fetch_orders. The name is the function's contract with every future reader; a good one makes the docstring almost redundant, a bad one (process, do_stuff, helper2) makes every call site a mystery.",
        },
        {
          type: "expandable",
          title: "Definition time vs call time",
          content:
            "Python reads your file top to bottom. A def statement executes at 'definition time' — creating the function object and binding the name — but the body waits for 'call time'. Consequence #1: you must define a function ABOVE where you first call it in a script. Consequence #2: a bug inside the body won't surface until the first call — a syntactically valid def with a doomed body defines just fine. Tests exist because definition time proves nothing.",
        },
        {
          type: "warning",
          title: "Calling vs referencing",
          content:
            "greet('Ada') calls the function. greet without parentheses is a REFERENCE to it — a value you can store or pass around (that's how higher-order functions will work later this module). The classic bug: writing result = get_total instead of result = get_total(), then wondering why result is '<function get_total at 0x...>' instead of a number.",
        },
      ],
    },

    {
      id: "diagram",
      type: "interactive-diagram",
      tocLabel: "Visual Learning",
      visual: {
        kind: "flow",
        title: "What happens during a function call",
        caption:
          "Execution jumps into the body and back. Click each stage to follow the control flow.",
        nodes: [
          {
            id: "define",
            label: "def clean(text):",
            sublabel: "definition time",
            detail:
              "Python creates the function object and binds the name 'clean'. The body is recorded, not run. This happens once, when the file loads.",
            x: 10,
            y: 25,
            accent: false,
          },
          {
            id: "call",
            label: "clean(' Data ')",
            sublabel: "the call",
            detail:
              "Call time: Python evaluates the argument, jumps into the body, and binds the parameter text to ' Data '.",
            x: 38,
            y: 25,
            accent: true,
          },
          {
            id: "body",
            label: "body runs",
            sublabel: "text.strip().lower()",
            detail:
              "The body executes with text bound to the argument. Variables created here live only inside this call (scope — a later lesson makes this precise).",
            x: 66,
            y: 25,
            accent: false,
          },
          {
            id: "return",
            label: "return result",
            sublabel: "jump back",
            detail:
              "return hands the result to whoever called. Execution resumes at the call site, with the call expression now standing for the returned value.",
            x: 88,
            y: 50,
            accent: false,
          },
          {
            id: "resume",
            label: "cleaned = ...",
            sublabel: "caller continues",
            detail:
              "The caller stores or uses the value, and can call clean() again with different input — a fresh, independent execution each time.",
            x: 55,
            y: 75,
            accent: false,
          },
        ],
        edges: [
          { from: "define", to: "call", label: "later..." },
          { from: "call", to: "body", label: "jump in" },
          { from: "body", to: "return" },
          { from: "return", to: "resume", label: "jump back" },
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
          title: "Define, then call",
          scenario: "A reusable banner printer for a report script.",
          steps: [
            {
              code: "def print_banner():\n    print('=' * 30)\n    print('  DAILY SALES REPORT')\n    print('=' * 30)",
              explanation:
                "A function with no parameters — the parentheses are empty but still required. Defining it prints nothing.",
            },
            {
              code: "print_banner()",
              explanation:
                "The call runs all three lines. Need the banner again later in the script? Call it again — zero copy-paste.",
            },
          ],
          output: "==============================\n  DAILY SALES REPORT\n==============================",
        },
        {
          difficulty: "Easy",
          title: "A parameter makes it reusable",
          scenario: "Greet customers by name in a support-ticket auto-reply.",
          steps: [
            {
              code: "def auto_reply(customer):\n    \"\"\"Print the standard first-response message.\"\"\"\n    print(f'Hi {customer}, thanks for reaching out!')\n    print('An agent will respond within 2 hours.')",
              explanation:
                "customer is a parameter — a placeholder name that receives a value at call time. The docstring states the job in one line.",
            },
            {
              code: "auto_reply('Priya')\nauto_reply('Marcus')",
              explanation:
                "Two calls, two customers, one definition. Each call binds customer to a different string and runs the body fresh.",
            },
          ],
          output:
            "Hi Priya, thanks for reaching out!\nAn agent will respond within 2 hours.\nHi Marcus, thanks for reaching out!\nAn agent will respond within 2 hours.",
        },
        {
          difficulty: "Medium",
          title: "Return a computed value",
          scenario: "Compute an order total the caller can keep working with.",
          steps: [
            {
              code: "def order_total(subtotal, tax_rate):\n    \"\"\"Return the total including tax, rounded to cents.\"\"\"\n    return round(subtotal * (1 + tax_rate), 2)",
              explanation:
                "Two parameters, one returned result. return (unlike print) hands the value BACK — the caller decides whether to print it, store it, or feed it onward.",
            },
            {
              code: "total = order_total(59.99, 0.08)\nprint(f'Total: ${total}')",
              explanation:
                "The call expression order_total(59.99, 0.08) evaluates to 64.79, which is assigned to total. A printed value dies on the screen; a returned value lives on in the program.",
            },
            {
              code: "big_order = order_total(59.99, 0.08) > 50\nprint(big_order)",
              explanation:
                "Because the function RETURNS, its result can sit inside a larger expression — compared, summed, passed to another function. That composability is the whole point.",
            },
          ],
          output: "Total: $64.79\nTrue",
        },
        {
          difficulty: "Hard",
          title: "Functions calling functions",
          scenario:
            "Build a mini text-cleaning toolkit where a higher-level function delegates to two lower-level ones.",
          steps: [
            {
              code: "def normalize(text):\n    \"\"\"Lowercase and strip outer whitespace.\"\"\"\n    return text.strip().lower()",
              explanation: "First tool: one job, honestly named.",
            },
            {
              code: "def is_valid_email(text):\n    \"\"\"Crude email check: one @ and at least one dot after it.\"\"\"\n    if '@' not in text:\n        return False\n    domain = text.split('@')[1]\n    return '.' in domain",
              explanation:
                "Second tool: combines the conditionals and string methods you know. Note TWO return statements — a guard-clause exit for the no-@ case, then the main answer.",
            },
            {
              code: "def clean_email(raw):\n    \"\"\"Normalize an email and return it, or None if invalid.\"\"\"\n    email = normalize(raw)\n    if is_valid_email(email):\n        return email\n    return None",
              explanation:
                "The composer: it calls both tools by name. Read it aloud — 'normalize, validate, return or None' — the function bodies you'd otherwise inline are now one-line sentences.",
            },
            {
              code: "print(clean_email('  Ada@Example.COM '))\nprint(clean_email('not-an-email'))",
              explanation:
                "The whole toolkit exercised: a messy-but-valid address is cleaned; garbage becomes None (which the caller can test with `if result:`).",
            },
          ],
          output: "ada@example.com\nNone",
        },
        {
          difficulty: "Industry Example",
          title: "Refactoring a script into a pipeline of functions",
          scenario:
            "A data analyst inherits a 40-line sales script that loads, filters, and summarizes inline. They refactor it into named stages — the before/after every new team member lives through.",
          steps: [
            {
              code: "sales = [('north', 1200.0), ('south', 800.0), ('north', 450.0), ('west', 2100.0)]",
              explanation:
                "The raw data: (region, amount) tuples, standing in for a CSV load.",
            },
            {
              code: "def filter_region(rows, region):\n    \"\"\"Keep only rows for the given region.\"\"\"\n    return [amt for (r, amt) in rows if r == region]",
              explanation:
                "Stage 1 wraps a comprehension you could write in your sleep — but NOW it has a name, a docstring, and can be tested with three lines of fake data.",
            },
            {
              code: "def summarize(amounts):\n    \"\"\"Return (count, total, average) for a list of amounts.\"\"\"\n    total = sum(amounts)\n    return len(amounts), total, total / len(amounts)",
              explanation:
                "Stage 2 returns a tuple of three values — callers unpack what they need. (Guarding against an empty list is exactly the kind of edge the next lessons arm you for.)",
            },
            {
              code: "north_sales = filter_region(sales, 'north')\ncount, total, avg = summarize(north_sales)\nprint(f'north: {count} sales, ${total:.2f} total, ${avg:.2f} avg')",
              explanation:
                "The main script is now three readable lines — a table of contents. Each stage can be swapped, tested, or reused (filter_region works for 'west' tomorrow) without touching the others.",
            },
          ],
          output: "north: 2 sales, $1650.00 total, $825.00 avg",
        },
      ],
    },

    {
      id: "inline-practice",
      type: "inline-code",
      tocLabel: "Practice Coding",
      coding: {
        language: "python",
        filename: "toolkit.py",
        instructions:
          "Build a tiny discount toolkit. Define apply_discount(price, pct) returning the discounted price rounded to 2 decimals, and format_price(amount) returning a '$xx.xx' string. Then use both to print the final price of a $80.00 item at 15% off.",
        starterCode: `# TODO 1: define apply_discount(price, pct)
# It returns price reduced by pct percent, rounded to 2 decimals
# e.g. apply_discount(100.0, 20) -> 80.0
___

# TODO 2: define format_price(amount)
# It returns a string like '$68.00' (2 decimal places)
___

# TODO 3: combine them for an $80.00 item at 15% off
final = ___
print(format_price(final))`,
        solutionCode: `def apply_discount(price, pct):
    """Return price reduced by pct percent, rounded to cents."""
    return round(price * (1 - pct / 100), 2)

def format_price(amount):
    """Return the amount as a $xx.xx string."""
    return f"\${amount:.2f}"

final = apply_discount(80.0, 15)
print(format_price(final))`,
        expectedOutput: "$68.00",
        hints: [
          "A 15% discount multiplies the price by (1 - 15/100) = 0.85",
          "apply_discount must RETURN the value — no print inside",
          "format_price returns an f-string: f'${amount:.2f}'",
          "TODO 3 calls apply_discount(80.0, 15), then passes the result to format_price",
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
          id: "py11_mcq_01",
          difficulty: "Easy",
          question: "What does defining a function with def actually execute?",
          options: [
            "The whole body, once",
            "Nothing from the body — it only creates the function and binds its name",
            "The first line of the body",
            "The docstring",
          ],
          correctIndex: 1,
          explanation:
            "Definition time records the body and binds the name; the body runs only at call time. That's why a def with a doomed body 'works' until someone calls it.",
        },
        {
          type: "mcq",
          id: "py11_mcq_02",
          difficulty: "Easy",
          question:
            "After `def get_rate(): return 0.08`, what does `x = get_rate` (no parentheses) make x?",
          options: [
            "0.08",
            "A reference to the function itself",
            "None",
            "A SyntaxError",
          ],
          correctIndex: 1,
          explanation:
            "Without parentheses you get the function object — a value like any other. x() would then return 0.08. Forgetting the parentheses is the classic 'why is my variable a <function ...>' bug.",
        },
        {
          type: "mcq",
          id: "py11_mcq_03",
          difficulty: "Medium",
          question: "Which function name best follows the one-job rule and naming conventions?",
          options: [
            "def Process():",
            "def load_and_clean_and_export():",
            "def remove_duplicate_rows():",
            "def helper2():",
          ],
          correctIndex: 2,
          explanation:
            "Verb-first snake_case, one honest job. 'Process' is vague and capitalized like a class; the and-and name confesses to three jobs; helper2 tells the reader nothing at all.",
        },
        {
          type: "scenario",
          id: "py11_sc_01",
          difficulty: "Medium",
          scenario:
            "A teammate's function prints its result: `def tax(amount): print(amount * 0.2)`. Your pipeline needs to ADD that tax to a subtotal, but total = subtotal + tax(80) crashes with a TypeError about NoneType.",
          question: "Why, and what's the fix?",
          options: [
            "print returns None, so tax() returns None; change print to return",
            "The function needs a docstring to return values",
            "80 must be passed as a float",
            "tax must be defined after it's called",
          ],
          correctIndex: 0,
          explanation:
            "A function with no return statement returns None. Printing displays the number but hands nothing back — so subtotal + None explodes. `return amount * 0.2` fixes it; the CALLER can print. Return for values, print for humans.",
        },
        {
          type: "coding",
          id: "py11_code_01",
          difficulty: "Medium",
          prompt:
            "Define count_longer_than(words, n) that returns how many strings in words have more than n characters. Then print count_longer_than(['data', 'ai', 'python', 'ml'], 3). Expected output: 2",
          starterCode: "# Your code here\n",
          solutionCode:
            "def count_longer_than(words, n):\n    \"\"\"Return the number of words longer than n characters.\"\"\"\n    return len([w for w in words if len(w) > n])\n\nprint(count_longer_than(['data', 'ai', 'python', 'ml'], 3))",
          expectedOutput: "2",
          tests: [
            {
              name: "Returns, not prints",
              description: "The function must return the count; only the caller prints",
            },
            {
              name: "Correct count",
              description: "'data' (4) and 'python' (6) exceed 3 → 2",
            },
          ],
        },
        {
          type: "mcq",
          id: "py11_mcq_04",
          difficulty: "Hard",
          question:
            "A script calls report() on line 5, and defines `def report(): ...` on line 20. What happens when the script runs?",
          options: [
            "It works — Python scans the whole file for defs first",
            "NameError on line 5: the name isn't defined yet",
            "The definition runs first automatically",
            "SyntaxError at line 20",
          ],
          correctIndex: 1,
          explanation:
            "A script executes top to bottom; at line 5 the def hasn't run, so 'report' is an undefined name. Define above first use (or put calls under a main section at the bottom — the convention you'll see in real scripts).",
        },
        {
          type: "coding",
          id: "py11_code_02",
          difficulty: "Hard",
          prompt:
            "Build a two-function pipeline: to_floats(strings) converts a list of numeric strings to floats; total(values) returns their sum. Compose them to print the total of ['12.5', '7.25', '30.0']. Expected output: 49.75",
          starterCode: "raw = ['12.5', '7.25', '30.0']\n# Your code here\n",
          solutionCode:
            "raw = ['12.5', '7.25', '30.0']\n\ndef to_floats(strings):\n    \"\"\"Convert a list of numeric strings to floats.\"\"\"\n    return [float(s) for s in strings]\n\ndef total(values):\n    \"\"\"Return the sum of a list of numbers.\"\"\"\n    return sum(values)\n\nprint(total(to_floats(raw)))",
          expectedOutput: "49.75",
          tests: [
            {
              name: "Two single-purpose functions",
              description: "Conversion and summation live in separate named functions",
            },
            {
              name: "Composition",
              description: "One function's return value feeds the other: total(to_floats(raw))",
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
          question: "Why do functions matter for code quality? Name the concrete benefits.",
          answer:
            "Four concrete wins. Reuse: logic written once is called everywhere, so a fix lands everywhere at once instead of drifting across copies. Testability: a small function with inputs and a return value can be verified in isolation with three lines of test data — a 400-line script cannot. Readability: well-named functions turn a script into a table of contents; readers grasp the flow without reading every body. Abstraction: callers depend on the NAME and contract, not the implementation, so you can rewrite the inside (faster algorithm, different library) without touching call sites. The underlying principle is single responsibility — one function, one job — because everything above follows from it.",
        },
        {
          question:
            "What's the difference between definition time and call time, and what bug class does the distinction explain?",
          answer:
            "def executes when Python reads it: it builds the function object and binds the name — but never runs the body. The body runs at call time, freshly, for every call. This explains two bug classes. First, NameErrors from calling above the definition in a script — at that line, the name doesn't exist yet. Second, and more important: broken bodies that hide. A function whose body would crash — a typo'd variable, a bad conversion — defines without complaint and detonates only on first call, possibly weeks later in production on the one input path nobody exercised. That's precisely why untested code paths are treated as unshipped code on mature teams.",
        },
        {
          question:
            "print() versus return — explain the difference and when each is appropriate.",
          answer:
            "return hands a value back to the caller, making the call expression stand for that value — it can be stored, compared, summed, or passed onward; that's what makes functions composable. print() writes text to the screen for a human and returns None; the 'result' is unrecoverable by code. So: computation functions should return, and the caller — usually at the program's edge — decides what to print. A function that prints instead of returning poisons composition: subtotal + tax(80) becomes number + None and crashes. The habit to state in interviews: return for programs, print for people, and keep printing at the outermost layer.",
        },
      ],
    },

    {
      id: "common-mistakes",
      type: "callout",
      variant: "warning",
      title: "Common Mistakes to Avoid",
      content:
        "1) Printing inside a function when the caller needs the value — return it instead. 2) Forgetting parentheses: get_total is the function, get_total() is its result. 3) Calling a function above its def in a script — NameError. 4) One mega-function doing five jobs — if the name needs 'and', split it. 5) Vague names (process, handle, do_it) that force readers into the body. 6) Assuming a clean definition means working code — bodies only fail at call time, so call it (test it) before trusting it.",
    },

    {
      id: "ai-tutor",
      type: "callout",
      variant: "tip",
      title: "Ask the AI Tutor",
      content:
        "Try these prompts in the AI Tutor panel: • 'Show me a 20-line script and help me split it into functions.' • 'Quiz me: which of these five defs runs code at definition time?' • 'Critique these function names and suggest better ones.' • 'Show the print-instead-of-return bug and its stack trace.' • 'Interview mode: ask me why small functions beat big ones and grade my answer.'",
    },

    {
      id: "glossary",
      type: "callout",
      variant: "info",
      title: "Glossary",
      content:
        "Function — a named, reusable block of code run by calling it. def — the keyword that defines a function. Call — executing a function with name(arguments). Parameter — the placeholder name in the definition. Argument — the actual value passed in a call. Body — the indented block that runs at call time. Docstring — the triple-quoted description right under the def. return — statement sending a value back to the caller. Definition time — when def executes (binds the name). Call time — when the body actually runs. Composition — feeding one function's return value into another.",
    },

    {
      id: "resources",
      type: "callout",
      variant: "info",
      title: "Recommended Resources",
      content:
        "• Docs: 'Defining Functions' in the official Python tutorial. • Read: PEP 257 (docstring conventions) — two minutes, lifelong habit. • Practice: take your longest script from earlier lessons and refactor it into three named functions with a three-line main section. • Next in DSM: parameters deserve their own lesson — Parameters, Arguments & Return Values covers multiple inputs, multiple returns, None, and the contracts that make functions trustworthy.",
    },

    {
      id: "recap",
      type: "recap",
      tocLabel: "Recap",
      content:
        "✓ def names a block; calling name() runs it — definition time records, call time executes.\n✓ Parameters receive arguments; each call is a fresh, independent run.\n✓ return hands values back for further computation; print is only for humans.\n✓ One function, one job, verb-first snake_case name, one-line docstring.\n✓ Functions calling functions turn scripts into readable, testable pipelines.\n✓ A function reference without () is a value — useful later, a classic bug today.\n\nNext up: Parameters, Arguments & Return Values. You can define and call — now master what flows in and out: multiple parameters, multiple returns, None, and early returns.",
    },
  ],
};
