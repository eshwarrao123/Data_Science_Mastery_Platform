import type { Lesson } from "@/lib/curriculum/types";

export const raisingExceptions: Lesson = {
  meta: {
    id: "python.error-handling.raising-exceptions",
    slug: "raising-exceptions",
    title: "Raising Exceptions",
    description:
      "Throw well: raise precise types with actionable messages, design custom exception classes, and re-raise with context preserved.",
    estimatedTime: "25 mins",
    difficulty: "Intermediate",
    xpReward: 60,
    prerequisites: ["python.error-handling.exceptions-and-try-except"],
    masteryThreshold: 80,
  },

  blocks: [
    {
      id: "intro",
      type: "lesson-intro",
      tocLabel: "Introduction",
      intro: {
        hook: "Your validating setter already does it: raise ValueError('radius must be positive'). That one line is API design — it decides what callers can catch, what the 3am traceback says, and whether the bug is found in a minute or a week. Catching well is defense; raising well is how you build things others can defend against.",
        what: "The raise statement signals failure deliberately: raise ValueError(f'...'). This lesson covers choosing the right built-in type, writing messages with the offending values, defining custom exception classes for your domain, re-raising with `raise` and `raise ... from`, and failing fast at boundaries.",
        why: "Every function you publish has an error contract, stated or not. Precise raises make failures debuggable (the message names the culprit), routable (callers catch by type), and early (bad state stops at the door instead of corrupting downstream). Libraries you admire — pandas, Stripe, requests — are admired partly for HOW they fail.",
        whereUsed:
          "Validation gates (setters, config loaders), guard clauses in functions, library/API design, and wrapping low-level errors in domain terms.",
        objectives: [
          "Raise built-in exceptions with type and message chosen deliberately",
          "Apply fail-fast: validate at boundaries, crash before corrupting",
          "Define custom exception classes (and small hierarchies)",
          "Re-raise correctly: bare raise, and raise X from e",
          "Write error messages that name the value, the rule, and the fix",
        ],
        realWorldApps: [
          {
            company: "Stripe",
            headline: "An exception hierarchy as public API",
            detail:
              "StripeError → CardError, RateLimitError, AuthenticationError... — documented types integrators catch selectively. The hierarchy IS the error contract, versioned like any API.",
          },
          {
            company: "pandas",
            headline: "Domain-specific failures",
            detail:
              "pandas defines MergeError, EmptyDataError, and friends — so `except pd.errors.EmptyDataError` reads as data logic, not generic plumbing.",
          },
          {
            company: "SpaceX",
            headline: "Fail fast at the boundary",
            detail:
              "Telemetry validators reject out-of-range readings at ingestion — a loud rejection at the gate beats a quiet wrong number in a burn calculation. Fail-fast is aerospace doctrine first.",
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
            "raise ExceptionType('message') constructs and throws in one line. From there the machinery is last lesson's: unwinding, matching, handling. Your choices are the TYPE (what callers will catch) and the MESSAGE (what the human at the traceback reads). Both are design decisions, not afterthoughts.",
        },
        {
          type: "code-note",
          code: "def set_threshold(value):\n    if not isinstance(value, (int, float)):\n        raise TypeError(f'threshold must be a number, got {type(value).__name__}')\n    if not 0 <= value <= 1:\n        raise ValueError(f'threshold must be in [0, 1], got {value}')\n    return value\n\nprint(set_threshold(0.85))\n# set_threshold(1.5)   -> ValueError: threshold must be in [0, 1], got 1.5\n# set_threshold('hi')  -> TypeError: threshold must be a number, got str",
          content:
            "The built-in split you'll use daily: TypeError for wrong KIND of thing, ValueError for right kind, unacceptable VALUE. And the message formula: the rule, plus the offending value. 'got 1.5' turns a mystery into a one-minute fix.",
        },
        {
          type: "analogy",
          title: "The bouncer at the door",
          content:
            "Fail-fast is a nightclub bouncer. Checking IDs at the DOOR is cheap: the underage guest is turned away with a clear reason, and everyone inside is known-valid. The alternative — letting everyone in and discovering problems at the bar, on the dance floor, at 2am — means the incident happens far from the cause, with no ID in hand. A function that validates its inputs up front and raises immediately IS that bouncer: every line after the guard clauses runs in a known-good world, and the traceback points at the door, not the dance floor.",
        },
        {
          type: "keypoint",
          title: "Choosing the type: match the caller's question",
          content:
            "Pick the type by what a CALLER would want to catch: ValueError (bad value), TypeError (bad type), KeyError/LookupError (missing thing), NotImplementedError (subclass must override — your template methods already raise it), RuntimeError (valid inputs, invalid state — 'transform before fit'). Never raise bare Exception: it forces callers into the blanket catch you learned to avoid. If no built-in matches the caller's question, that's the signal for a custom class.",
        },
        {
          type: "code-note",
          code: "class PipelineError(Exception):\n    \"\"\"Base for this pipeline's failures.\"\"\"\n\nclass SchemaError(PipelineError):\n    \"\"\"Input data doesn't match the expected schema.\"\"\"\n\nclass SourceUnavailableError(PipelineError):\n    \"\"\"An upstream source can't be reached.\"\"\"\n\n# callers choose their granularity:\n#   except SchemaError:            handle just schema problems\n#   except PipelineError:          handle anything ours\n# ...while a NameError bug still crashes loudly. That's the win.",
          content:
            "A custom hierarchy is three lines per class — inherit from Exception (your OOP module doing real work), write a docstring, done. The base class gives callers a catch-all for YOUR failures that still excludes genuine bugs — the precision blanket `except Exception` can never offer.",
        },
        {
          type: "keypoint",
          title: "Re-raising: bare raise, and raise ... from",
          content:
            "Inside an except block, bare `raise` re-throws the SAME exception — for when you want to log-and-propagate, not handle. `raise SchemaError('orders feed invalid') from e` throws a NEW, higher-level exception while CHAINING the original: the traceback shows both, joined by 'The above exception was the direct cause...'. Translation without evidence destruction — wrap low-level errors (KeyError) in domain terms (SchemaError) and the root cause stays in the log.",
        },
        {
          type: "expandable",
          title: "assert is not raise",
          content:
            "assert condition, 'msg' raises AssertionError when the condition fails — but asserts are DEVELOPMENT checks: they document programmer assumptions ('this list is sorted by now') and can be stripped entirely by python -O. Never use assert to validate user input, API arguments, or data — that validation must survive production, so it's a real raise. Rule of thumb: assert for 'this should be impossible', raise for 'this input is unacceptable'.",
        },
        {
          type: "warning",
          title: "Message quality is incident-response quality",
          content:
            "The message is read exactly once — at the worst possible time, by someone (possibly future-you) with no context. Include: what rule was violated, the offending VALUE (repr it: {value!r} makes '' and None visible), and identifiers that locate the culprit (row id, column name, filename). 'Invalid input' is a taunt; \"amount must be >= 0, got -3.2 (order_id='A-4471')\" is a fix. One caution: never put secrets (tokens, passwords) in messages — tracebacks end up in logs.",
        },
      ],
    },

    {
      id: "diagram",
      type: "interactive-diagram",
      tocLabel: "Visual Learning",
      visual: {
        kind: "decision-tree",
        title: "What should this function raise?",
        caption:
          "The decision path from 'something is wrong' to the right raise. Click each node.",
        nodes: [
          {
            id: "start",
            label: "something is wrong",
            sublabel: "choose deliberately",
            detail:
              "First question: is this the CALLER's mistake (bad argument), the ENVIRONMENT's (missing file, dead network), or YOUR state's (used before initialized)? The answer picks the family.",
            x: 50,
            y: 10,
            accent: true,
          },
          {
            id: "type",
            label: "wrong KIND of value",
            sublabel: "→ TypeError",
            detail:
              "A string where a number belongs, a list where a dict was needed. Message: expected kind, got type(value).__name__.",
            x: 15,
            y: 42,
            accent: false,
          },
          {
            id: "value",
            label: "right kind, bad VALUE",
            sublabel: "→ ValueError",
            detail:
              "Negative price, probability of 1.5, empty required string. The workhorse. Message: the rule + the offending value, repr'd.",
            x: 40,
            y: 42,
            accent: false,
          },
          {
            id: "state",
            label: "bad STATE, not input",
            sublabel: "→ RuntimeError",
            detail:
              "Arguments are fine; the object isn't ready — transform() before fit(), write after close. sklearn's NotFittedError subclasses exactly this idea.",
            x: 65,
            y: 42,
            accent: false,
          },
          {
            id: "domain",
            label: "callers need YOUR category",
            sublabel: "→ custom class",
            detail:
              "When callers must route on failures no built-in names — SchemaError vs SourceUnavailableError — define a small hierarchy under one base (PipelineError) so they can catch narrowly or catch-all-yours.",
            x: 88,
            y: 42,
            accent: false,
          },
          {
            id: "wrap",
            label: "translating a low-level error?",
            sublabel: "raise X from e",
            detail:
              "Caught a KeyError deep in parsing but callers should see SchemaError? Chain with `from e` — the new type carries the old traceback. Bare `raise` when you only logged and want the original to continue unchanged.",
            x: 50,
            y: 78,
            accent: false,
          },
        ],
        edges: [
          { from: "start", to: "type", label: "kind" },
          { from: "start", to: "value", label: "value" },
          { from: "start", to: "state", label: "state" },
          { from: "start", to: "domain", label: "category" },
          { from: "domain", to: "wrap", label: "wrapping?" },
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
          title: "First deliberate raise",
          scenario: "A withdrawal that refuses the impossible.",
          steps: [
            {
              code: "def withdraw(balance, amount):\n    if amount <= 0:\n        raise ValueError(f'amount must be positive, got {amount}')\n    if amount > balance:\n        raise ValueError(f'insufficient funds: balance {balance}, requested {amount}')\n    return balance - amount\n\nprint(withdraw(100.0, 30.0))\ntry:\n    withdraw(100.0, 250.0)\nexcept ValueError as e:\n    print(f'rejected: {e}')",
              explanation:
                "Guard clauses first (the early-return shape from Functions, now raising), happy path after — every line below the guards runs in a validated world. Both messages carry the numbers a debugger needs.",
            },
          ],
          output: "70.0\nrejected: insufficient funds: balance 100.0, requested 250.0",
        },
        {
          difficulty: "Easy",
          title: "TypeError vs ValueError, chosen correctly",
          scenario: "A percentile function with a real error contract.",
          steps: [
            {
              code: "def percentile_label(p):\n    if not isinstance(p, (int, float)):\n        raise TypeError(f'p must be a number, got {type(p).__name__}')\n    if not 0 <= p <= 100:\n        raise ValueError(f'p must be in [0, 100], got {p}')\n    return f'P{p:g}'",
              explanation:
                "Two guards, two types: the kind check raises TypeError, the range check ValueError. Callers can now route: a TypeError is a code bug to fix; a ValueError might be user input to re-prompt.",
            },
            {
              code: "print(percentile_label(99))\nfor bad in ['95', 140]:\n    try:\n        percentile_label(bad)\n    except (TypeError, ValueError) as e:\n        print(f'{type(e).__name__}: {e}')",
              explanation:
                "A tuple in except catches several types with one handler when the response is shared; type(e).__name__ shows which fired. Note '95' (a string!) correctly draws TypeError, not a sloppy attempt to parse it.",
            },
          ],
          output:
            "P99\nTypeError: p must be a number, got str\nValueError: p must be in [0, 100], got 140",
        },
        {
          difficulty: "Medium",
          title: "A custom hierarchy callers can route on",
          scenario:
            "A feed loader whose failures come in two species — retryable and not — a distinction built-ins can't express.",
          steps: [
            {
              code: "class FeedError(Exception):\n    \"\"\"Base for feed-loading failures.\"\"\"\n\nclass FeedFormatError(FeedError):\n    \"\"\"Feed content is malformed (do NOT retry).\"\"\"\n\nclass FeedTimeoutError(FeedError):\n    \"\"\"Feed source timed out (retry may help).\"\"\"",
              explanation:
                "The hierarchy encodes OPERATIONAL knowledge: format errors won't fix themselves; timeouts might. Six lines of class definitions carry that policy to every caller.",
            },
            {
              code: "def load_feed(name):\n    if name == 'slow':\n        raise FeedTimeoutError(f'{name}: no response in 30s')\n    if name == 'legacy':\n        raise FeedFormatError(f'{name}: expected JSON, got XML')\n    return f'{name}: 500 rows'",
              explanation:
                "The loader raises its OWN vocabulary. No caller ever needs to parse message strings to decide behavior — the type IS the decision.",
            },
            {
              code: "for feed in ['orders', 'slow', 'legacy']:\n    try:\n        print(load_feed(feed))\n    except FeedTimeoutError as e:\n        print(f'RETRY LATER: {e}')\n    except FeedError as e:\n        print(f'SKIP + ALERT: {e}')",
              explanation:
                "Routing by type: timeouts get the retry policy; the FeedError base sweeps every other feed failure (including future subclasses!) into skip-and-alert — while a genuine bug (NameError) would still crash loudly. Order matters: the specific except must precede the base.",
            },
          ],
          output:
            "orders: 500 rows\nRETRY LATER: slow: no response in 30s\nSKIP + ALERT: legacy: expected JSON, got XML",
        },
        {
          difficulty: "Hard",
          title: "raise ... from: translate without destroying evidence",
          scenario:
            "A config reader whose callers speak 'config', not 'KeyError three layers down'.",
          steps: [
            {
              code: "class ConfigError(Exception):\n    \"\"\"Configuration is missing or invalid.\"\"\"\n\nRAW = {'db': {'host': 'localhost'}}   # note: no 'port'\n\ndef get_setting(path):\n    node = RAW\n    try:\n        for key in path.split('.'):\n            node = node[key]\n    except KeyError as e:\n        raise ConfigError(f'missing setting {path!r}') from e\n    return node",
              explanation:
                "The low-level truth is a KeyError on 'port' — meaningless to a caller who asked for 'db.port'. `raise ... from e` throws the domain-level ConfigError while CHAINING the KeyError: both appear in the traceback, cause preserved.",
            },
            {
              code: "print(get_setting('db.host'))\ntry:\n    get_setting('db.port')\nexcept ConfigError as e:\n    print(f'error: {e}')\n    print(f'caused by: {type(e.__cause__).__name__}')",
              explanation:
                "Callers catch ConfigError and see the path they asked for; the original KeyError rides along as e.__cause__ for anyone debugging. An unhandled ConfigError would print BOTH tracebacks with 'The above exception was the direct cause of...' between them.",
            },
            {
              code: "# The anti-pattern this replaces:\n#   except KeyError:\n#       raise ConfigError('missing setting')   # no from, no value, no path\n# -> cause lost, message vague: debugging starts from zero.",
              explanation:
                "Same control flow, drastically different 3am experience. The three ingredients — domain type, offending identifier in the message, `from e` chaining — each preserve one kind of evidence.",
            },
          ],
          output: "localhost\nerror: missing setting 'db.port'\ncaused by: KeyError",
        },
        {
          difficulty: "Industry Example",
          title: "A validation gate with an error contract",
          scenario:
            "The front door of a payments pipeline: every incoming order is validated by one function whose raises ARE its documentation — fail-fast at the boundary, clean data or a routed rejection.",
          steps: [
            {
              code: "class OrderValidationError(Exception):\n    \"\"\"Order failed validation; message names field and value.\"\"\"\n\nVALID_CURRENCIES = {'usd', 'eur', 'gbp'}\n\ndef validate_order(order):\n    for field in ('id', 'amount', 'currency'):\n        if field not in order:\n            raise OrderValidationError(f\"missing field {field!r} (order={order.get('id', '?')!r})\")\n    if not isinstance(order['amount'], (int, float)):\n        raise OrderValidationError(f\"amount must be a number, got {type(order['amount']).__name__} (order={order['id']!r})\")\n    if order['amount'] <= 0:\n        raise OrderValidationError(f\"amount must be positive, got {order['amount']} (order={order['id']!r})\")\n    if order['currency'] not in VALID_CURRENCIES:\n        raise OrderValidationError(f\"unsupported currency {order['currency']!r} (order={order['id']!r})\")\n    return order",
              explanation:
                "One gate, ordered guards, every message carrying field + value + order id. Downstream code never re-checks — the bouncer pattern: past the door, the world is valid.",
            },
            {
              code: "feed = [\n    {'id': 'A1', 'amount': 49.99, 'currency': 'usd'},\n    {'id': 'A2', 'amount': -5, 'currency': 'usd'},\n    {'id': 'A3', 'amount': 12.0, 'currency': 'btc'},\n]\naccepted, rejected = [], []\nfor o in feed:\n    try:\n        accepted.append(validate_order(o))\n    except OrderValidationError as e:\n        rejected.append(str(e))",
              explanation:
                "The caller composes last lesson's skip-and-count with this lesson's typed gate: catch exactly OrderValidationError — a TypeError from a bug in validate_order itself would still crash, as it must.",
            },
            {
              code: "print(f'{len(accepted)} accepted, {len(rejected)} rejected')\nfor r in rejected:\n    print(f'  {r}')",
              explanation:
                "The run report reads like documentation because the messages were designed: field, rule, value, culprit id. Raising well upstream is what made handling clean downstream — the two lessons are one system.",
            },
          ],
          output:
            "1 accepted, 2 rejected\n  amount must be positive, got -5 (order='A2')\n  unsupported currency 'btc' (order='A3')",
        },
      ],
    },

    {
      id: "inline-practice",
      type: "inline-code",
      tocLabel: "Practice Coding",
      coding: {
        language: "python",
        filename: "username_gate.py",
        instructions:
          "Build a registration gate. Define InvalidUsernameError(Exception). register(name) raises it if the name is under 3 chars ('too short: <name!r>') or not alphanumeric via .isalnum() ('not alphanumeric: <name!r>'); otherwise returns '<name> registered'. Process the candidate list with try/except, printing successes and 'REJECTED - <message>' for failures.",
        starterCode: `# TODO 1: define InvalidUsernameError
___

def register(name):
    # TODO 2: raise for len < 3, then for not name.isalnum(); else return
    ___

candidates = ['ada99', 'x', 'kai_dev', 'mia']

# TODO 3: loop with try/except InvalidUsernameError
___`,
        solutionCode: `class InvalidUsernameError(Exception):
    """Username failed registration rules."""

def register(name):
    if len(name) < 3:
        raise InvalidUsernameError(f"too short: {name!r}")
    if not name.isalnum():
        raise InvalidUsernameError(f"not alphanumeric: {name!r}")
    return f"{name} registered"

candidates = ['ada99', 'x', 'kai_dev', 'mia']

for name in candidates:
    try:
        print(register(name))
    except InvalidUsernameError as e:
        print(f"REJECTED - {e}")`,
        expectedOutput:
          "ada99 registered\nREJECTED - too short: 'x'\nREJECTED - not alphanumeric: 'kai_dev'\nmia registered",
        hints: [
          "The custom class is just: class InvalidUsernameError(Exception): with a docstring",
          "Guards in order: length first, then .isalnum() — 'kai_dev' fails the second (underscore)",
          "Use {name!r} in messages so the quotes make odd values visible",
          "Catch InvalidUsernameError specifically — printing str(e) gives the message",
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
          id: "py29_mcq_01",
          difficulty: "Easy",
          question:
            "A function receives the right type but an unacceptable value (age = -5). What should it raise?",
          options: ["TypeError", "ValueError", "KeyError", "Exception"],
          correctIndex: 1,
          explanation:
            "ValueError is the contract for 'right kind, bad value'. TypeError is for wrong KIND (a string where a number belongs); bare Exception forces callers into blanket catches.",
        },
        {
          type: "mcq",
          id: "py29_mcq_02",
          difficulty: "Easy",
          question: "How do you define a custom exception?",
          options: [
            "exception SchemaError: ...",
            "class SchemaError(Exception): pass — inherit from Exception (or a domain base)",
            "SchemaError = Exception('schema')",
            "def SchemaError(): raise",
          ],
          correctIndex: 1,
          explanation:
            "Custom exceptions are ordinary classes inheriting from Exception — usually just a name and docstring. Inheritance is what makes them catchable by base type.",
        },
        {
          type: "mcq",
          id: "py29_mcq_03",
          difficulty: "Medium",
          question:
            "Inside an except block you've logged the error and want the SAME exception to continue propagating. What do you write?",
          options: [
            "raise e2 — a fresh copy",
            "bare `raise` — re-throws the current exception with its traceback intact",
            "return e",
            "raise Exception(str(e))",
          ],
          correctIndex: 1,
          explanation:
            "Bare raise re-raises the active exception unchanged — the log-and-propagate idiom. Wrapping in a new Exception (D) destroys the type AND the traceback: the two things callers and debuggers need.",
        },
        {
          type: "scenario",
          id: "py29_sc_01",
          difficulty: "Medium",
          scenario:
            "A library function catches an internal IndexError during parsing and does: raise ParseError('parse failed'). Users complain that when it fails, they can't tell WHERE in their 10MB file things went wrong — the traceback starts at the raise line.",
          question: "What two changes fix the debuggability?",
          options: [
            "Catch Exception instead of IndexError",
            "Chain the original with `raise ParseError(...) from e` and put position info (line/record number) in the message — evidence preserved, culprit located",
            "Return None instead of raising",
            "Log to a file and re-raise bare Exception",
          ],
          correctIndex: 1,
          explanation:
            "`from e` keeps the original traceback attached (e.__cause__); the enriched message (line 48,213, record id) locates the failure in USER terms. Translation is good — evidence destruction is the bug.",
        },
        {
          type: "coding",
          id: "py29_code_01",
          difficulty: "Medium",
          prompt:
            "Write celsius_to_fahrenheit(c) that raises ValueError(f'below absolute zero: {c}') when c < -273.15, else returns round(c * 9/5 + 32, 1). Call it with 25 (print result), then with -300 inside try/except printing 'error: <message>'. Expected:\n77.0\nerror: below absolute zero: -300",
          starterCode: "# Your code here\n",
          solutionCode:
            "def celsius_to_fahrenheit(c):\n    if c < -273.15:\n        raise ValueError(f'below absolute zero: {c}')\n    return round(c * 9 / 5 + 32, 1)\n\nprint(celsius_to_fahrenheit(25))\ntry:\n    celsius_to_fahrenheit(-300)\nexcept ValueError as e:\n    print(f'error: {e}')",
          expectedOutput: "77.0\nerror: below absolute zero: -300",
          tests: [
            {
              name: "Guard raises with value",
              description: "The message includes the offending input",
            },
            {
              name: "Happy path clean",
              description: "Valid input computes without touching except",
            },
          ],
        },
        {
          type: "mcq",
          id: "py29_mcq_04",
          difficulty: "Hard",
          question:
            "Why should data validation use raise rather than assert?",
          options: [
            "assert is slower",
            "assert statements can be stripped by python -O and signal programmer assumptions, not input contracts — production validation must be un-strippable raises",
            "assert can't include messages",
            "raise is newer syntax",
          ],
          correctIndex: 1,
          explanation:
            "Optimized mode removes asserts entirely — validation that vanishes under a flag isn't validation. assert documents 'this should be impossible' during development; raise enforces 'this input is unacceptable' forever.",
        },
        {
          type: "scenario",
          id: "py29_sc_02",
          difficulty: "Hard",
          scenario:
            "Your team's loader defines JobError(Exception) with subclasses RetryableError and FatalError. A new hire writes: except JobError: retry(). In the first week, a job retried a corrupt-schema failure 400 times.",
          question: "What's the fix, and the principle?",
          options: [
            "Increase the retry limit",
            "Catch RetryableError for the retry path and let FatalError route to skip/alert — subclass granularity exists precisely so handlers match policy; catching the base erases the distinction the hierarchy encodes",
            "Merge the two subclasses",
            "Retry FatalError more slowly",
          ],
          correctIndex: 1,
          explanation:
            "The hierarchy carried operational policy (retryable vs not) and the broad catch flattened it. Catch at the level your HANDLING differs: specific types for specific policies, the base only when the response truly is uniform.",
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
            "How do you choose what exception type to raise, and why never bare Exception?",
          answer:
            "Choose by the question the CALLER will ask when catching. Wrong kind of argument → TypeError; right kind, unacceptable value → ValueError; something absent → KeyError/LookupError family; object in the wrong state despite valid inputs → RuntimeError (sklearn's NotFittedError is a domain subclass of exactly this); subclass-must-override → NotImplementedError. When callers need to route on categories no built-in expresses — retryable vs fatal, schema vs connectivity — define custom classes under one domain base. Raising bare Exception breaks the routing entirely: the only way to catch it is `except Exception`, which also sweeps in every bug (NameError, TypeError from typos) — so raising vaguely FORCES callers to catch dangerously. The type is API: callers write except clauses against it, so it deserves the same design care as a return type — and the same stability across versions.",
        },
        {
          question:
            "What is exception chaining (`raise X from e`), and what problem does it solve?",
          answer:
            "It solves the translation-vs-evidence dilemma. Good layering means low-level exceptions (KeyError on 'port', IndexError at byte 40,000) get translated at boundaries into domain terms callers understand (ConfigError('missing db.port'), ParseError('record 48213 malformed')) — otherwise every caller must know your internals to interpret failures. But naive translation (catch KeyError, raise ConfigError) DESTROYS the original traceback — the actual failing line vanishes, and debugging starts from zero. `raise ConfigError(...) from e` does both: callers catch the clean domain type, while the original exception rides along as __cause__, and an unhandled chain prints both tracebacks joined by 'The above exception was the direct cause of the following exception'. The related forms: bare `raise` inside except re-throws the SAME exception untouched (log-and-propagate); and even without `from`, an exception raised inside a handler auto-chains as __context__ ('During handling... another exception occurred') — Python refuses to lose evidence quietly.",
        },
        {
          question:
            "Explain fail-fast. Why is raising early better than returning error codes or None?",
          answer:
            "Fail-fast means detecting bad input or state at the earliest boundary and stopping immediately — guard clauses that raise at the top of the function — so the failure surfaces AT its cause, not three modules downstream where a corrupted value finally explodes. The traceback then points at the actual contract violation with the offending value in the message, turning a multi-hour hunt into a one-minute read. Versus error returns (None, -1, status codes): exceptions can't be silently ignored — an unchecked error return propagates wrong data with no trace, while an uncaught exception stops the world and names itself; they carry structured information (type, message, chained cause) rather than a bare sentinel; and they separate the happy path from error plumbing instead of forcing if-error checks after every call. The place value-or-None remains right is when absence is a NORMAL outcome, not a failure — .get() on an optional key, a search with no match. The rule: expected absence → None by contract; violated contract → raise, immediately, with the evidence attached.",
        },
      ],
    },

    {
      id: "common-mistakes",
      type: "callout",
      variant: "warning",
      title: "Common Mistakes to Avoid",
      content:
        "1) raise Exception('...') — untypeable for callers; pick or define a real type. 2) Messages without the offending value — 'invalid input' helps no one; use {value!r}. 3) Catch-and-re-wrap WITHOUT `from e` — traceback evidence destroyed. 4) assert for input validation — stripped by -O; use raise. 5) Swallowing the original and raising at the wrong level — translate at boundaries, chain always. 6) Specific except AFTER the base class in the same try — unreachable; order narrow-to-broad. 7) Secrets in messages — tracebacks land in logs.",
    },

    {
      id: "ai-tutor",
      type: "callout",
      variant: "tip",
      title: "Ask the AI Tutor",
      content:
        "Try these prompts in the AI Tutor panel: • 'Quiz me: which type should each of these ten failures raise?' • 'Critique my error messages against the value/rule/culprit formula.' • 'Walk me through designing a hierarchy for a scraper: what's retryable?' • 'Show raise-from vs bare raise vs no chaining, with tracebacks.' • 'Interview mode: ask me exceptions vs error codes and grade my answer.'",
    },

    {
      id: "glossary",
      type: "callout",
      variant: "info",
      title: "Glossary",
      content:
        "raise — throw an exception deliberately. Guard clause — a validation-raise at the top of a function. Fail-fast — stop at the boundary where bad state enters. Custom exception — a class inheriting Exception, naming a domain failure. Exception hierarchy — a base class with subclasses encoding categories (retryable/fatal). Bare raise — re-throw the current exception unchanged. raise X from e — throw a translation, chaining the cause. __cause__ — the chained original on a from-raised exception. Error contract — the documented set of types a function may raise. assert — a strippable development check; never input validation. {value!r} — repr in f-strings; makes '' and None visible in messages.",
    },

    {
      id: "resources",
      type: "callout",
      variant: "info",
      title: "Recommended Resources",
      content:
        "• Docs: 'Raising Exceptions' and 'User-defined Exceptions' in the Errors tutorial chapter; skim the built-in exception hierarchy diagram. • Read: Stripe's API error documentation — a production exception taxonomy worth imitating. • Practice: add guard clauses with proper types and value-bearing messages to three functions from earlier modules, then write the try/except a caller would want. • Next in DSM: exceptions guard your logic — now aim them at the outside world: Reading & Writing Files brings open(), with, encodings, and the FileNotFoundError you can finally handle like a professional.",
    },

    {
      id: "recap",
      type: "recap",
      tocLabel: "Recap",
      content:
        "✓ raise Type(f'rule, got {value!r}') — type for routing, message for humans.\n✓ TypeError = wrong kind; ValueError = bad value; RuntimeError = bad state; never bare Exception.\n✓ Fail fast: guard clauses at boundaries; everything after runs validated.\n✓ Custom classes (one base + subclasses) let callers catch your failures precisely — bugs still crash.\n✓ Bare raise = propagate unchanged; raise X from e = translate with evidence attached.\n✓ assert documents the impossible in dev; raise enforces contracts in production.\n\nNext up: Reading & Writing Files. Your error toolkit meets its biggest customer: the filesystem — open(), the with statement, text vs binary, encodings, and failures you can now handle with precision.",
    },
  ],
};
