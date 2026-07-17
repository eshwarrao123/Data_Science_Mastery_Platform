import type { Lesson } from "@/lib/curriculum/types";

export const exceptionsAndTryExcept: Lesson = {
  meta: {
    id: "python.error-handling.exceptions-and-try-except",
    slug: "exceptions-and-try-except",
    title: "Exceptions & try/except",
    description:
      "What exceptions are, how they travel up the call stack, and how try/except turns crashes into handled outcomes — narrowly and honestly.",
    estimatedTime: "30 mins",
    difficulty: "Intermediate",
    xpReward: 60,
    prerequisites: ["python.oop.special-methods"],
    masteryThreshold: 80,
  },

  blocks: [
    {
      id: "intro",
      type: "lesson-intro",
      tocLabel: "Introduction",
      intro: {
        hook: "Your pipeline processed 40,000 rows overnight — and died at row 40,001 on one malformed date, taking six hours of work with it. One bad record shouldn't kill a batch, and one missing file shouldn't crash an app. Exceptions are Python's failure-signaling system; try/except is how you decide which failures are survivable.",
        what: "An exception is an object raised when an operation can't proceed — int('abc') raises ValueError, {}['k'] raises KeyError. Unhandled, it travels up the call stack, printing a traceback and killing the program. try/except intercepts named exception types and runs recovery code instead.",
        why: "Real data WILL be malformed, files WILL be missing, and APIs WILL time out. The difference between a script and production software is what happens next. Data engineers live this daily: skip-and-count bad rows, retry flaky calls, fail loudly on genuine corruption — all built on try/except used with discipline.",
        whereUsed:
          "Row-level parsing in ETL, file and network operations, user input validation, and every library call whose documentation says 'Raises: ...'.",
        objectives: [
          "Read a traceback bottom-up and name the exception type",
          "Explain how exceptions propagate up the call stack",
          "Catch NARROW exception types with try/except",
          "Use else and finally for the full statement shape",
          "Apply the skip-and-count pattern to dirty data",
        ],
        realWorldApps: [
          {
            company: "Airbnb",
            headline: "Row-level resilience in ETL",
            detail:
              "Ingestion jobs wrap per-record parsing in try/except: bad records route to a dead-letter store with counts reported, and 10 million good rows survive 200 bad ones.",
          },
          {
            company: "Stripe",
            headline: "Typed API errors",
            detail:
              "The Stripe SDK raises CardError, RateLimitError, APIConnectionError — distinct types so integrations can retry timeouts but never retry declined cards. Exception TYPE is the routing signal.",
          },
          {
            company: "NASA JPL",
            headline: "Fail loudly on the impossible",
            detail:
              "Flight software separates expected anomalies (handled, logged) from invariant violations (fail fast, alert humans) — the catch-narrowly discipline at its highest stakes.",
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
            "You've met exceptions all course: ValueError from int('abc'), KeyError from a missing dict key, TypeError from 'a' + 1, IndexError, ZeroDivisionError, AttributeError, FileNotFoundError. Each is an OBJECT (an instance of an exception class — the inheritance module in action) carrying a message and a traceback. Raising is how Python — and your own setters — say 'I cannot do this'.",
        },
        {
          type: "code-note",
          code: "def parse_age(text):\n    return int(text)\n\ndef build_profile(row):\n    return {'age': parse_age(row['age'])}\n\n# build_profile({'age': 'abc'}) would print:\n# Traceback (most recent call last):\n#   File \"app.py\", line 7, in <module>     <- outermost call\n#   File \"app.py\", line 5, in build_profile\n#   File \"app.py\", line 2, in parse_age    <- where it happened\n# ValueError: invalid literal for int() with base 10: 'abc'",
          content:
            "Read tracebacks BOTTOM-UP: the last line names the type and message (the what), the line above it shows where it was raised (the where), and the frames above trace the call path (the how-we-got-here). Bottom line first, then climb only as needed — the single highest-value debugging habit.",
        },
        {
          type: "analogy",
          title: "The fire alarm in an office tower",
          content:
            "An exception is a fire alarm pulled on floor 3 (the raising line). It doesn't stay there: the alarm travels UP floor by floor (the call stack), and on each floor someone either handles it (an except clause: 'small bin fire, extinguished, carry on') or lets it pass upward. If it reaches the roof unhandled, the whole building evacuates — program terminated, traceback printed. try/except is a floor saying 'alarms of THIS type, I know how to deal with.' Crucially, a floor that handles a kitchen-smoke alarm shouldn't also silence a gas-leak alarm — that's catching too broadly.",
        },
        {
          type: "keypoint",
          title: "The try/except mechanics",
          content:
            "try: guards a block. If no exception occurs, except blocks are skipped entirely. If one occurs, execution STOPS at the failing line and jumps to the first except whose type MATCHES (isinstance — parent types catch child exceptions, so `except Exception` catches nearly everything). `except ValueError as e:` binds the exception object — always log or use e; recovery without recording is how data silently vanishes. Unmatched exceptions keep propagating as if the try weren't there.",
        },
        {
          type: "keypoint",
          title: "Catch narrowly, catch what you can HANDLE",
          content:
            "The golden rule: name the specific exceptions you expect and have a plan for — except ValueError for parse failures, except FileNotFoundError for optional configs. A bare `except:` or blanket `except Exception:` also swallows typos (NameError), wrong types (TypeError), and Ctrl+C — converting loud bugs into silent wrong answers, the worst failure mode in data work. If you can't do something useful about it, don't catch it: an honest crash with a traceback beats a quiet corruption every time.",
        },
        {
          type: "code-note",
          code: "raw = ['21', '35', 'unknown', '42', '']\nages = []\nskipped = 0\nfor value in raw:\n    try:\n        ages.append(int(value))\n    except ValueError:\n        skipped += 1\nprint(f'{len(ages)} parsed, {skipped} skipped')\nprint(ages)",
          content:
            "THE data-work pattern: try the risky operation per item, catch the SPECIFIC failure, count what you skip, report both numbers. One bad value no longer kills the batch — and the report keeps the data loss visible. (You've written the if-guard version of this; try/except handles failures you can't cheaply pre-check.)",
        },
        {
          type: "expandable",
          title: "else and finally complete the statement",
          content:
            "Full shape: try (the risky part — keep it MINIMAL) / except (recovery) / else (runs only if NO exception — success-path code that shouldn't be inside try, so its own failures aren't accidentally caught) / finally (runs ALWAYS — exception or not, even through a return — for cleanup like closing connections). In practice you'll write try/except daily, else occasionally for clarity, and finally rarely once you learn `with` for files (next lessons) — but you'll READ all four in every codebase.",
        },
        {
          type: "warning",
          title: "EAFP vs LBYL — and when each wins",
          content:
            "Python culture favors EAFP ('easier to ask forgiveness than permission'): try the operation, handle the exception — versus LBYL ('look before you leap'): pre-check with if. EAFP wins when the check duplicates the operation (parsing: the only way to know if int() works is to try) or when state can change between check and use (files, network). LBYL wins for cheap, honest checks you already know: `if key in d`, `if items:`. Never stack both — checking AND catching the same failure is noise. And exceptions are for the EXCEPTIONAL: using try/except as routine control flow where an if is natural obscures intent.",
        },
      ],
    },

    {
      id: "diagram",
      type: "interactive-diagram",
      tocLabel: "Visual Learning",
      visual: {
        kind: "flow",
        title: "An exception's journey up the stack",
        caption:
          "int('abc') fails three calls deep. Click each stage to follow the alarm.",
        nodes: [
          {
            id: "raise",
            label: "int('abc')",
            sublabel: "ValueError raised",
            detail:
              "The operation cannot proceed, so Python constructs a ValueError object (message: \"invalid literal...\") and raises it. Execution at this line stops instantly — no return value exists.",
            x: 10,
            y: 70,
            accent: true,
          },
          {
            id: "frame1",
            label: "parse_age()",
            sublabel: "no handler → propagate",
            detail:
              "The raising line was inside parse_age, which has no try/except. The function ABORTS mid-body — remaining lines never run — and the exception moves up to whoever called it.",
            x: 32,
            y: 48,
            accent: false,
          },
          {
            id: "frame2",
            label: "build_profile()",
            sublabel: "try/except here?",
            detail:
              "This caller wraps the call in try/except ValueError — the type matches, so the journey ENDS here: the except block runs (log, skip, default), and the program continues normally after it.",
            x: 54,
            y: 28,
            accent: false,
          },
          {
            id: "handled",
            label: "except ValueError",
            sublabel: "handled: program lives",
            detail:
              "Recovery code decides the outcome: substitute a default, count a skip, re-raise with context. Everything below this frame already unwound; everything above never knows anything happened.",
            x: 80,
            y: 12,
            accent: false,
          },
          {
            id: "crash",
            label: "(if unhandled)",
            sublabel: "traceback + exit",
            detail:
              "Had NO frame matched, the exception exits main: Python prints the full traceback — every frame it passed through, newest last — and the process dies. In a pipeline, that's the 6-hour batch gone at row 40,001.",
            x: 80,
            y: 60,
            accent: false,
          },
        ],
        edges: [
          { from: "raise", to: "frame1", label: "unwind" },
          { from: "frame1", to: "frame2", label: "unwind" },
          { from: "frame2", to: "handled", label: "type matches" },
          { from: "frame2", to: "crash", label: "no match anywhere" },
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
          title: "First catch",
          scenario: "Survive a parse failure with a default.",
          steps: [
            {
              code: "def safe_int(text, default=0):\n    try:\n        return int(text)\n    except ValueError:\n        return default\n\nprint(safe_int('42'))\nprint(safe_int('n/a'))\nprint(safe_int('n/a', default=-1))",
              explanation:
                "The happy path returns from inside try; the failure path returns the default. Narrow catch: only ValueError — a TypeError (passing a list) would still crash loudly, as it should: that's a caller bug, not dirty data.",
            },
          ],
          output: "42\n0\n-1",
        },
        {
          difficulty: "Easy",
          title: "Two except clauses, two policies",
          scenario:
            "A lookup can fail two ways — missing key vs unparseable value — and each deserves its own response.",
          steps: [
            {
              code: "def reading_for(config, sensor):\n    try:\n        return float(config[sensor])\n    except KeyError:\n        return None                    # sensor not configured: normal\n    except ValueError:\n        print(f'WARN: bad value for {sensor}')\n        return None",
              explanation:
                "Multiple excepts route by TYPE — the dict miss is expected (quiet None), the corrupt value is suspicious (warn, then None). One try, two failure policies, both explicit.",
            },
            {
              code: "config = {'t1': '21.5', 't2': 'BROKEN'}\nprint(reading_for(config, 't1'))\nprint(reading_for(config, 't3'))\nprint(reading_for(config, 't2'))",
              explanation:
                "Success, silent miss, warned corruption — three outcomes, no crash. Compare a blanket except Exception: both failures would look identical and the WARN distinction (the valuable signal!) would be impossible.",
            },
          ],
          output: "21.5\nNone\nWARN: bad value for t2\nNone",
        },
        {
          difficulty: "Medium",
          title: "Skip-and-count over a dirty batch",
          scenario:
            "Parse (city, temp) records where the temp column is untrustworthy — the nightly-ETL shape.",
          steps: [
            {
              code: "rows = [('oslo', '-3.5'), ('cairo', '31.0'), ('lima', 'err'), ('kyiv', ''), ('doha', '41.2')]",
              explanation:
                "Real feed realism: one corrupt marker, one empty string — both will fail float(), neither should kill the batch.",
            },
            {
              code: "parsed = []\nerrors = []\nfor city, raw_temp in rows:\n    try:\n        parsed.append((city, float(raw_temp)))\n    except ValueError as e:\n        errors.append(f'{city}: {e}')",
              explanation:
                "Per-ROW try so one failure skips one row, not the loop. Binding `as e` captures WHY each row failed — an error log, not just a count. The try block holds exactly one risky call: minimal blast radius.",
            },
            {
              code: "print(f'{len(parsed)} ok, {len(errors)} failed')\nfor err in errors:\n    print(f'  {err}')\nhottest = max(parsed, key=lambda r: r[1])\nprint(f'hottest: {hottest[0]}')",
              explanation:
                "Both numbers reported, failures itemized for the fix-the-source conversation, and analysis proceeds on clean data. Report, don't swallow — now with the machinery it deserved.",
            },
          ],
          output:
            "3 ok, 2 failed\n  lima: could not convert string to float: 'err'\n  kyiv: could not convert string to float: ''\nhottest: doha",
        },
        {
          difficulty: "Hard",
          title: "else and finally: the full statement",
          scenario:
            "A job that acquires a (simulated) connection must ALWAYS release it — success, failure, or early return.",
          steps: [
            {
              code: "def run_job(records):\n    print('conn: OPEN')\n    processed = 0\n    try:\n        for r in records:\n            processed += 100 // r        # ZeroDivisionError on r == 0\n    except ZeroDivisionError:\n        print('ERROR: zero record — aborting job')\n        return 'failed'\n    else:\n        print('all records clean')\n        return f'ok: {processed}'\n    finally:\n        print('conn: CLOSED')            # runs on BOTH paths, even through return",
              explanation:
                "else runs only on the no-exception path (and its own bugs wouldn't be caught by the except above — that's its point). finally runs unconditionally — note it fires even as `return` is in flight, which is exactly what cleanup needs.",
            },
            {
              code: "print(run_job([10, 5, 2]))\nprint('---')\nprint(run_job([10, 0, 2]))",
              explanation:
                "Success path: else → finally → return value. Failure path: except → finally → return value. The connection closes in BOTH stories — leaked connections are how servers die at 4am. (Files get nicer syntax for this — `with` — next lesson.)",
            },
          ],
          output:
            "conn: OPEN\nall records clean\nconn: CLOSED\nok: 80\n---\nconn: OPEN\nERROR: zero record — aborting job\nconn: CLOSED\nfailed",
        },
        {
          difficulty: "Industry Example",
          title: "A resilient ingestion pass, assembled",
          scenario:
            "The pattern a data platform actually ships: per-record narrow catches, typed routing, dead-letter collection, and a summary that keeps failures visible — this is the lesson's whole toolkit in its production shape.",
          steps: [
            {
              code: "orders = [\n    {'id': 'A1', 'amount': '49.99'},\n    {'id': 'A2'},                       # missing amount\n    {'id': 'A3', 'amount': 'FREE'},     # unparseable\n    {'id': 'A4', 'amount': '120.00'},\n]",
              explanation:
                "Two distinct failure species in one feed: absent field (KeyError) and corrupt value (ValueError). Distinct types → distinct handling — this is why exception TYPES matter.",
            },
            {
              code: "clean, dead_letter = [], []\nfor o in orders:\n    try:\n        clean.append((o['id'], float(o['amount'])))\n    except KeyError:\n        dead_letter.append((o.get('id', '?'), 'missing amount'))\n    except ValueError:\n        dead_letter.append((o['id'], f\"bad amount: {o['amount']}\"))",
              explanation:
                "The dead-letter queue: failed records are ROUTED with a reason, not dropped — someone can replay them after the upstream fix. Note .get in the KeyError handler: recovery code must not itself crash on the same missing data.",
            },
            {
              code: "total = sum([amt for _, amt in clean])\nprint(f'processed {len(clean)}/{len(orders)}, revenue ${total:.2f}')\nprint(f'dead-letter: {dead_letter}')",
              explanation:
                "The run summary a human reads at 9am: how many survived, how much revenue, exactly what failed and why. One malformed order cost the batch nothing — and nothing failed silently. That balance is the entire craft.",
            },
          ],
          output:
            "processed 2/4, revenue $169.99\ndead-letter: [('A2', 'missing amount'), ('A3', 'bad amount: FREE')]",
        },
      ],
    },

    {
      id: "inline-practice",
      type: "inline-code",
      tocLabel: "Practice Coding",
      coding: {
        language: "python",
        filename: "grade_parser.py",
        instructions:
          "Parse a messy gradebook: each record is (name, raw_score). Convert scores with float(); on ValueError append the name to a failures list. Print each successful student as '<name>: <score>', then the class average to 1 decimal, then 'failed to parse: <names>'.",
        starterCode: `records = [('ada', '95'), ('kai', 'absent'), ('mia', '88.5'), ('zoe', ''), ('raj', '73')]

scores = []
failures = []

# TODO 1: loop records — try float(raw); append (name, score) to scores,
# ValueError -> append name to failures
___

# TODO 2: print each parsed student as '<name>: <score>'
___

# TODO 3: average of parsed scores, 1 decimal
avg = ___
print(f"average: {avg:.1f}")
print(f"failed to parse: {failures}")`,
        solutionCode: `records = [('ada', '95'), ('kai', 'absent'), ('mia', '88.5'), ('zoe', ''), ('raj', '73')]

scores = []
failures = []

for name, raw in records:
    try:
        scores.append((name, float(raw)))
    except ValueError:
        failures.append(name)

for name, score in scores:
    print(f"{name}: {score}")

avg = sum([s for _, s in scores]) / len(scores)
print(f"average: {avg:.1f}")
print(f"failed to parse: {failures}")`,
        expectedOutput:
          "ada: 95.0\nmia: 88.5\nraj: 73.0\naverage: 85.5\nfailed to parse: ['kai', 'zoe']",
        hints: [
          "Put ONLY the float() call (inside the append) in the try block",
          "except ValueError: failures.append(name) — catch the specific type",
          "'absent' and '' both raise ValueError from float() — same handler covers both",
          "Average uses len(scores) (parsed count = 3), not len(records)",
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
          id: "py28_mcq_01",
          difficulty: "Easy",
          question: "What happens to an exception no try/except ever matches?",
          options: [
            "Python ignores it after logging",
            "It propagates up the entire call stack, prints a traceback, and terminates the program",
            "It becomes a warning",
            "It retries the failing line once",
          ],
          correctIndex: 1,
          explanation:
            "Unhandled exceptions unwind every frame and kill the process — the traceback is Python's account of the journey. Handling is opt-in, per type, per level.",
        },
        {
          type: "mcq",
          id: "py28_mcq_02",
          difficulty: "Easy",
          question: "Which line of a traceback do you read FIRST?",
          options: [
            "The top — it's chronological",
            "The bottom — it names the exception type, the message, and (just above) the exact raising line",
            "The middle frame",
            "Any line — they're equivalent",
          ],
          correctIndex: 1,
          explanation:
            "Bottom-up: last line = what went wrong, line above = where, frames above = the call path that led there. Most bugs are solved from the bottom two lines alone.",
        },
        {
          type: "mcq",
          id: "py28_mcq_03",
          difficulty: "Medium",
          question:
            "try: total += float(row['amt']) — which failures does `except ValueError:` handle?",
          options: [
            "A missing 'amt' key",
            "An unparseable string like 'FREE' — but NOT the missing key (KeyError) or row being None (TypeError), which keep propagating",
            "All three failures",
            "None — float raises TypeError only",
          ],
          correctIndex: 1,
          explanation:
            "except matches by type: ValueError covers parse failures only. The KeyError and TypeError pass through — correctly, unless you add handlers with real plans for them. Narrow catches keep distinct failures distinct.",
        },
        {
          type: "scenario",
          id: "py28_sc_01",
          difficulty: "Medium",
          scenario:
            "A teammate's nightly job wraps its entire 300-line main() in try: ... except Exception: pass — 'so it never crashes'. It has reported success for three weeks. Today you discover it stopped writing output 19 days ago after a renamed column caused a KeyError on line 12.",
          question: "What's the core lesson?",
          options: [
            "The except should log before passing",
            "Silencing everything converts loud failures into silent wrong results — catch narrow, expected exceptions where you have a recovery plan, and let genuine bugs crash visibly",
            "main() was too long",
            "KeyError should be impossible in production",
          ],
          correctIndex: 1,
          explanation:
            "The crash WAS the correct behavior — it would have paged someone on day one. Broad-catch-and-continue is the worst failure mode in data systems: everything looks fine while nothing works. Logging (A) helps but doesn't fix the design: this failure had no recovery plan, so it shouldn't be caught.",
        },
        {
          type: "coding",
          id: "py28_code_01",
          difficulty: "Medium",
          prompt:
            "Write safe_divide(a, b) returning a/b, but None on ZeroDivisionError. Print safe_divide(10, 4), safe_divide(5, 0), and safe_divide(9, 3). Expected:\n2.5\nNone\n3.0",
          starterCode: "# Your code here\n",
          solutionCode:
            "def safe_divide(a, b):\n    try:\n        return a / b\n    except ZeroDivisionError:\n        return None\n\nprint(safe_divide(10, 4))\nprint(safe_divide(5, 0))\nprint(safe_divide(9, 3))",
          expectedOutput: "2.5\nNone\n3.0",
          tests: [
            {
              name: "Narrow catch",
              description: "Only ZeroDivisionError is handled; TypeError would still propagate",
            },
            {
              name: "Value-or-None contract",
              description: "The failure path returns None explicitly",
            },
          ],
        },
        {
          type: "mcq",
          id: "py28_mcq_04",
          difficulty: "Hard",
          question: "When does a `finally` block run?",
          options: [
            "Only after an unhandled exception",
            "Only when no exception occurred",
            "Always — after try succeeds, after except handles, and even while a return or unhandled exception is leaving the block",
            "Only if else didn't run",
          ],
          correctIndex: 2,
          explanation:
            "finally is unconditional — its purpose is cleanup that must survive every exit path (close the connection, release the lock). Even `return` inside try pauses to let finally run first.",
        },
        {
          type: "scenario",
          id: "py28_sc_02",
          difficulty: "Hard",
          scenario:
            "Code review: for f in files: try: data = load(f); results.append(transform(data)); except FileNotFoundError: continue — and the author asks whether to ALSO wrap transform's occasional TypeError 'to be safe'.",
          question: "What's the right guidance?",
          options: [
            "Yes — more catching is more robust",
            "No: a missing file is expected input (skip it, ideally with a count), but transform raising TypeError is a BUG in transform or its inputs — catching it would hide a defect that needs fixing, not surviving",
            "Catch both but re-raise on weekends",
            "Replace both with a bare except",
          ],
          correctIndex: 1,
          explanation:
            "The dividing line: expected-environment failures (missing files, dirty rows, timeouts) get handled; programming errors get FIXED. 'To be safe' catching inverts this — it makes the codebase feel safe while making its bugs invisible. (And the silent `continue` deserves a skipped-counter regardless.)",
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
            "Walk me through what happens from the moment an exception is raised to the moment it's handled (or isn't).",
          answer:
            "At the raising line, normal execution stops immediately — no return value, no further statements in that block. Python creates the exception object and begins UNWINDING: the current function aborts, and control moves to its caller, checking each enclosing try for an except clause whose type matches (matching is isinstance-based, so parent classes catch subclass instances — `except Exception` catches nearly everything, which is exactly why it's dangerous). The first match wins: its handler runs, optionally binding the object with `as e`, and the program continues after the try statement — frames below have already unwound; frames above never know. Any `finally` blocks encountered during unwinding run on the way through, guaranteeing cleanup. If NO frame matches all the way out of main, the interpreter prints the traceback — every frame traversed, newest at the bottom — and exits nonzero. That bottom-up traceback order is why you read the last line first: it names the type, message, and raising location.",
        },
        {
          question:
            "Why is `except Exception: pass` considered one of the worst patterns in data engineering specifically?",
          answer:
            "Because it converts the failure mode from loud-and-cheap to silent-and-compounding. In data systems, a crash is actually a GOOD outcome: it's immediate, it names the line, it stops wrong data at the source, and it pages someone. Blanket-catch-and-continue produces the opposite: the job reports success while producing empty or corrupt output, downstream tables and models consume it, and by discovery time you're rebuilding weeks of derived data and re-earning stakeholder trust. The pattern also flattens the crucial distinction between EXPECTED failures (dirty rows, missing optional files — handle, count, route to dead-letter) and BUGS (KeyError from a renamed column, TypeError from a bad refactor — must crash so they get fixed); catching Exception treats a schema change exactly like a malformed row. The discipline: catch the narrowest type you have an actual recovery plan for, keep failure counts visible in run summaries, and let everything else propagate. If the honest answer to 'what would I do with this exception?' is 'nothing useful' — don't catch it.",
        },
        {
          question:
            "Explain EAFP vs LBYL and when you'd choose each in Python.",
          answer:
            "LBYL — look before you leap — pre-checks conditions with if: `if key in d: use(d[key])`. EAFP — easier to ask forgiveness than permission — attempts the operation and handles the exception: `try: use(d[key]) except KeyError:`. Python idiom leans EAFP for two solid reasons. First, some checks essentially duplicate the operation: the only reliable way to know whether int(s) will succeed is to run it — a validation regex would re-implement the parser, worse. Second, check-then-use has a race window when state can change between the two steps: os.path.exists() then open() can still raise FileNotFoundError if the file vanished in between, so the open() needs the try anyway and the pre-check adds nothing. LBYL stays right when the check is cheap, honest, and readable — `if items:` before indexing, `if x is not None`, dict `.get()` with a default (which is LBYL packaged as a method). Two anti-patterns to name: doing BOTH (redundant), and using exceptions as routine control flow where a plain if expresses intent better — exceptions are for the exceptional path, not the expected branch.",
        },
      ],
    },

    {
      id: "common-mistakes",
      type: "callout",
      variant: "warning",
      title: "Common Mistakes to Avoid",
      content:
        "1) Bare `except:` or blanket `except Exception:` — swallows bugs, Ctrl+C, everything; name your types. 2) Catch-and-pass with no logging or counting — data loss with no witness. 3) Giant try blocks — wrap the ONE risky line, so you know what you're guarding. 4) Catching exceptions you have no recovery plan for — an honest crash beats quiet corruption. 5) Whole-batch try around a loop — one bad row kills everything; put the try INSIDE the loop. 6) Pre-checking AND catching the same failure — pick EAFP or LBYL, not both. 7) Recovery code that can itself raise (using row['id'] in a KeyError handler) — handlers must be safe.",
    },

    {
      id: "ai-tutor",
      type: "callout",
      variant: "tip",
      title: "Ask the AI Tutor",
      content:
        "Try these prompts in the AI Tutor panel: • 'Show me five tracebacks and quiz me on reading each bottom-up.' • 'Which exception type does each of these eight operations raise?' • 'Critique my try/except: is my catch too broad?' • 'Drill me on EAFP vs LBYL with real scenarios.' • 'Interview mode: ask me why except Exception: pass is dangerous and grade my answer.'",
    },

    {
      id: "glossary",
      type: "callout",
      variant: "info",
      title: "Glossary",
      content:
        "Exception — an object raised when an operation can't proceed. Raise — signal a failure (used by Python and your own code). Traceback — the printed record of an unhandled exception's path; read bottom-up. Call stack — the chain of active function calls an exception unwinds through. try/except — guard a block; route matching exception types to handlers. as e — bind the exception object in a handler. else — runs only if try raised nothing. finally — runs on every exit path; cleanup's home. Narrow catch — handling specific expected types only. Dead-letter — routing failed records aside with reasons for replay. EAFP/LBYL — try-and-handle vs check-first styles.",
    },

    {
      id: "resources",
      type: "callout",
      variant: "info",
      title: "Recommended Resources",
      content:
        "• Docs: the 'Errors and Exceptions' tutorial chapter — the full statement forms in one page. • Read: the Built-in Exceptions reference intro — skim the hierarchy so 'except OSError' vs 'except FileNotFoundError' makes sense (FileNotFoundError IS-An OSError — your inheritance lesson, live). • Practice: take any loop you've written this course and make it survive one deliberately corrupted input, with counts reported. • Next in DSM: catching is half the story — Raising Exceptions teaches the other half: raise, custom exception classes, and designing the error contracts your own APIs expose.",
    },

    {
      id: "recap",
      type: "recap",
      tocLabel: "Recap",
      content:
        "✓ Exceptions are objects that unwind the call stack until a matching except (or the program dies).\n✓ Read tracebacks bottom-up: type and message first, raising line second, path third.\n✓ Catch NARROW types you can actually handle; let bugs crash loudly.\n✓ Skip-and-count per row: try inside the loop, specific except, both numbers reported.\n✓ else = success-only code; finally = every-exit cleanup.\n✓ EAFP when checking duplicates the op or races it; LBYL when the check is cheap and honest.\n\nNext up: Raising Exceptions. You've caught what Python throws — now learn to throw well yourself: raise with precise types and messages, custom exception classes, and re-raising with context.",
    },
  ],
};
