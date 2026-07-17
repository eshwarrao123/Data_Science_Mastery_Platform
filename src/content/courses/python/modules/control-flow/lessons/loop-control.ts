import type { Lesson } from "@/lib/curriculum/types";

export const loopControl: Lesson = {
  meta: {
    id: "python.control-flow.loop-control",
    slug: "loop-control",
    title: "Loop Control (break, continue, pass)",
    description:
      "Steer a loop from inside its body — exit early with break, skip a record with continue, and hold a place with pass.",
    estimatedTime: "20 mins",
    difficulty: "Beginner",
    xpReward: 40,
    prerequisites: ["python.control-flow.while-loops"],
    masteryThreshold: 80,
  },

  blocks: [
    {
      id: "intro",
      type: "lesson-intro",
      tocLabel: "Introduction",
      intro: {
        hook: "You're scanning ten million log lines for the first fatal error. Your for loop found it on line 2,041 — so why is it still reading the other 9,997,959? Because nobody told it to stop. Today you get the steering controls: stop now, skip this one, and do nothing (on purpose).",
        what: "break exits the current loop immediately. continue abandons the current iteration and jumps to the next one. pass does nothing at all — a placeholder where Python's syntax demands a statement but you have nothing to say yet.",
        why: "Without break, searches read everything even after finding the answer. Without continue, loops nest filter logic two and three levels deep. These two keywords are the difference between loops that state their intent and loops readers must decode.",
        whereUsed:
          "Early exit from searches, skipping malformed records in data cleaning, stopping paginated API reads at the last page, and stubbing out unwritten branches during development.",
        objectives: [
          "Exit a loop the moment the answer is found with break",
          "Skip bad records cleanly with continue",
          "Use pass as an intentional placeholder",
          "Combine break with while True for read-then-decide loops",
          "Choose between break/continue and restructured conditions",
        ],
        realWorldApps: [
          {
            company: "Datadog",
            headline: "Log scanning with early exit",
            detail:
              "Alert evaluators scan recent logs and break on the first line matching a critical pattern — evaluating millions of further lines would add latency to paging an engineer.",
          },
          {
            company: "Airbnb",
            headline: "Listing ingestion skips",
            detail:
              "Photo pipelines iterate uploaded images and continue past corrupt or duplicate files, processing the rest of the batch instead of failing it.",
          },
          {
            company: "GitHub",
            headline: "Paginated API reads",
            detail:
              "Clients fetch results page by page in a while True loop and break when a page comes back empty — the natural shape when the total count is unknown.",
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
            "break and continue are statements you place INSIDE a loop body, almost always guarded by an if. break says 'we're done with this entire loop — jump past it'. continue says 'we're done with this particular item — bring me the next one'. Both apply to the NEAREST enclosing loop only.",
        },
        {
          type: "code-note",
          code: "readings = [98.1, 97.4, 103.8, 98.9]\nfor r in readings:\n    if r > 103.0:\n        print(f'ALERT: {r}')\n        break\n    print(f'ok: {r}')",
          content:
            "The loop prints 'ok' for the first two readings, hits 103.8, prints the alert, and break ends the loop — 98.9 is never examined. Search-and-stop: the signature use of break.",
        },
        {
          type: "analogy",
          title: "The assembly-line inspector",
          content:
            "An inspector checks parts on a conveyor. continue is tossing a defective part into the reject bin and reaching for the next one — the line keeps moving. break is hitting the big red STOP button — the whole line halts, no further parts arrive. pass is standing at your station during a drill, hands visible, deliberately doing nothing.",
        },
        {
          type: "keypoint",
          title: "continue: the guard-clause of loops",
          content:
            "The idiom `if <bad>: continue` at the TOP of a loop body works exactly like the guard clauses you met in Conditionals: dismiss the cases you can't process, then write the happy path underneath at a single level of indentation. Three guards beat three nested ifs every time.",
        },
        {
          type: "code-note",
          code: "values = ['12', '', 'N/A', '30']\ntotal = 0\nfor v in values:\n    if not v.isdigit():\n        continue\n    total += int(v)\nprint(total)  # 42",
          content:
            "The guard filters '' and 'N/A' out of the flow; only clean values reach the conversion. Note what continue skips: everything BELOW it in the body, for this iteration only.",
        },
        {
          type: "expandable",
          title: "while True + break: the read-then-decide loop",
          content:
            "Some loops must do work BEFORE they can know whether to stop — fetch a page, then see if it's empty. Squeezing that into a while condition is awkward, so Python code uses `while True:` with a `break` at the decision point in the middle. It looks alarming (an intentionally infinite condition!) but is a mainstream, readable idiom — as long as the break is easy to find and guaranteed reachable.",
        },
        {
          type: "text",
          content:
            "pass exists because Python's grammar forbids an empty block — `if x > 5:` followed by nothing is a SyntaxError. pass fills the hole: a function you'll write tomorrow, an exception branch you're deliberately ignoring, a class body that's pure declaration. It executes as pure nothing.",
        },
        {
          type: "warning",
          title: "break only escapes ONE level",
          content:
            "In nested loops, break exits the innermost loop only — the outer loop continues. If you need to escape both, set a flag the outer loop checks, or better, move the nested loops into a function and return (functions arrive next module). Also beware the silent-skip trap: a continue that swallows bad records WITHOUT counting them hides data quality problems — keep a skipped counter.",
        },
      ],
    },

    {
      id: "diagram",
      type: "interactive-diagram",
      tocLabel: "Visual Learning",
      visual: {
        kind: "comparison",
        title: "break vs continue vs pass",
        caption:
          "Three keywords, three completely different jumps. Click each to see where execution lands.",
        nodes: [
          {
            id: "body",
            label: "loop body",
            sublabel: "iteration running",
            detail:
              "An iteration is in progress. The three control statements decide what happens to the REST of this iteration and the REST of the loop.",
            x: 15,
            y: 45,
            accent: true,
          },
          {
            id: "break",
            label: "break",
            sublabel: "exit the loop",
            detail:
              "Execution jumps to the first statement AFTER the entire loop. No more iterations, and the remainder of the current body is skipped too. Use for: found-it searches, fatal conditions, last-page detection.",
            x: 45,
            y: 15,
            accent: false,
          },
          {
            id: "continue",
            label: "continue",
            sublabel: "next iteration",
            detail:
              "Execution jumps back to the loop's top: the next element (for) or the condition re-check (while). Only the rest of THIS body is skipped. Use for: filtering out records you can't process.",
            x: 45,
            y: 45,
            accent: false,
          },
          {
            id: "pass",
            label: "pass",
            sublabel: "no jump at all",
            detail:
              "Nothing happens — the next line runs as normal. It's not loop control at all; it's a syntactic placeholder for a required-but-empty block. Use for: stubs and deliberately-ignored branches.",
            x: 45,
            y: 75,
            accent: false,
          },
          {
            id: "after",
            label: "code after loop",
            sublabel: "break lands here",
            detail:
              "The first unindented statement after the loop. break arrives here immediately; normal completion arrives here after the last iteration.",
            x: 80,
            y: 15,
            accent: false,
          },
          {
            id: "top",
            label: "loop top",
            sublabel: "continue lands here",
            detail:
              "The next-element fetch (for) or condition check (while). continue arrives here, abandoning the rest of the current body.",
            x: 80,
            y: 45,
            accent: false,
          },
        ],
        edges: [
          { from: "body", to: "break" },
          { from: "body", to: "continue" },
          { from: "body", to: "pass" },
          { from: "break", to: "after", label: "jump out" },
          { from: "continue", to: "top", label: "jump back" },
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
          title: "break on first match",
          scenario: "Find whether 'admin' appears in a user list — and stop looking once it does.",
          steps: [
            {
              code: "users = ['sam', 'admin', 'lee', 'kim']\nfor user in users:\n    print(f'checking {user}')\n    if user == 'admin':\n        print('found!')\n        break",
              explanation:
                "The loop checks 'sam', then 'admin' — match! break fires and 'lee' and 'kim' are never checked. Without break, the search would pointlessly continue.",
            },
          ],
          output: "checking sam\nchecking admin\nfound!",
        },
        {
          difficulty: "Easy",
          title: "continue to skip invalid entries",
          scenario: "Compute the total of a donations list that contains some refunds (negative values) to be excluded.",
          steps: [
            {
              code: "donations = [50, -20, 100, 75, -5]",
              explanation: "Positive values are donations; negatives are refunds we skip.",
            },
            {
              code: "total = 0\nfor d in donations:\n    if d < 0:\n        continue\n    total += d",
              explanation:
                "When d is negative, continue jumps straight to the next element — the += line never runs for refunds. 50 + 100 + 75 accumulate.",
            },
            {
              code: "print(f'Total donations: ${total}')",
              explanation:
                "The guard-then-accumulate shape keeps the happy path unindented and obvious.",
            },
          ],
          output: "Total donations: $225",
        },
        {
          difficulty: "Medium",
          title: "while True + break for pagination",
          scenario:
            "Read simulated API pages until an empty page signals the end — the iteration count is unknowable up front.",
          steps: [
            {
              code: "pages = [['a1', 'a2'], ['a3', 'a4'], ['a5'], []]\npage_num = 0\nitems = []",
              explanation:
                "Four scripted responses stand in for the network; the empty list plays the 'no more results' page.",
            },
            {
              code: "while True:\n    page = pages[page_num]\n    if len(page) == 0:\n        break\n    items.extend(page)\n    page_num += 1",
              explanation:
                "We must FETCH the page before we can know it's the last — which is why the exit test sits mid-body, not in the while condition. .extend() appends all elements of one list to another (append would nest the page as a single element).",
            },
            {
              code: "print(f'{len(items)} items over {page_num} pages')",
              explanation:
                "The break landed us here with everything collected. This exact shape reads paginated APIs in production clients everywhere.",
            },
          ],
          output: "5 items over 3 pages",
        },
        {
          difficulty: "Hard",
          title: "break, continue, and a skip counter together",
          scenario:
            "Process a transaction feed: skip malformed amounts, but abort the whole batch if a poison-pill marker appears — and account for everything.",
          steps: [
            {
              code: "feed = ['120.50', 'oops', '89.99', 'HALT', '44.00']\nprocessed = 0\nskipped = 0\naborted = False\ntotal = 0.0",
              explanation:
                "Four counters/flags tell the full story afterwards. 'HALT' simulates a poison-pill record that must stop the batch (a corrupted checkpoint, a schema change marker).",
            },
            {
              code: "for tx in feed:\n    if tx == 'HALT':\n        aborted = True\n        break\n    cleaned = tx.replace('.', '', 1)\n    if not cleaned.isdigit():\n        skipped += 1\n        continue\n    total += float(tx)\n    processed += 1",
              explanation:
                "Priority order matters: the abort check runs FIRST (a poison pill must never be counted as merely 'skipped'), the malformed-guard second, the happy path last. '44.00' after HALT is never seen.",
            },
            {
              code: "status = 'ABORTED' if aborted else 'complete'\nprint(f'{status}: {processed} ok, {skipped} skipped, ${total:.2f}')",
              explanation:
                "A conditional expression (value-if-else in one line) picks the label. Every record is accounted for: 2 processed, 1 skipped, 1 poison pill, 1 unreached.",
            },
          ],
          output: "ABORTED: 2 ok, 1 skipped, $210.49",
        },
        {
          difficulty: "Industry Example",
          title: "Scanning logs for the first fatal error",
          scenario:
            "An SRE tool scans a service's log lines after a deploy: count warnings, ignore debug noise, and stop at the first FATAL — reporting the line number for the incident ticket.",
          steps: [
            {
              code: "logs = [\n    'DEBUG cache warm',\n    'WARN slow query 830ms',\n    'DEBUG gc pause',\n    'WARN slow query 1204ms',\n    'FATAL db connection pool exhausted',\n    'WARN slow query 990ms',\n]",
              explanation:
                "A realistic post-deploy log slice: noise, warnings trending worse, then the failure. The trailing WARN should never be read.",
            },
            {
              code: "warnings = 0\nfatal_line = None\nfor line_no, line in enumerate(logs, start=1):\n    if line.startswith('DEBUG'):\n        continue\n    if line.startswith('FATAL'):\n        fatal_line = line_no\n        break\n    if line.startswith('WARN'):\n        warnings += 1",
              explanation:
                "Three controls in one body, each earning its place: continue drops noise instantly, break stops the scan the moment the answer exists, and the WARN counter accumulates in between. .startswith() is the string method doing the classification.",
            },
            {
              code: "if fatal_line:\n    print(f'FATAL at line {fatal_line} after {warnings} warnings')\nelse:\n    print(f'clean deploy, {warnings} warnings')",
              explanation:
                "fatal_line doubles as data and flag: None means 'no fatal found' (falsy), a line number means failure (truthy). One scan, complete incident summary.",
            },
          ],
          output: "FATAL at line 5 after 2 warnings",
        },
      ],
    },

    {
      id: "inline-practice",
      type: "inline-code",
      tocLabel: "Practice Coding",
      coding: {
        language: "python",
        filename: "inventory_scan.py",
        instructions:
          "Scan a warehouse inventory feed. Skip entries with quantity 0 (out of stock — nothing to count), stop entirely at the 'END' marker, and total the units seen. Use continue, break, and the counters provided.",
        starterCode: `feed = [('widget', 12), ('gadget', 0), ('doohickey', 7), ('END', 0), ('gizmo', 99)]

total_units = 0
skipped = 0

for name, qty in feed:
    # TODO 1: if name is 'END', stop the scan entirely
    ___
    # TODO 2: if qty is 0, count it as skipped and move to the next entry
    ___
    # TODO 3: otherwise add qty to total_units
    ___

print(f"Units counted: {total_units}")
print(f"Skipped: {skipped}")`,
        solutionCode: `feed = [('widget', 12), ('gadget', 0), ('doohickey', 7), ('END', 0), ('gizmo', 99)]

total_units = 0
skipped = 0

for name, qty in feed:
    if name == 'END':
        break
    if qty == 0:
        skipped += 1
        continue
    total_units += qty

print(f"Units counted: {total_units}")
print(f"Skipped: {skipped}")`,
        expectedOutput: "Units counted: 19\nSkipped: 1",
        hints: [
          "The loop unpacks each tuple into name and qty — you can use both directly",
          "TODO 1 is an if with break; it must come BEFORE the skip logic so END is never counted as skipped",
          "TODO 2 needs two lines under the if: skipped += 1, then continue",
          "gizmo (99) sits after END, so it's never reached: 12 + 7 = 19 units, 1 skipped",
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
          id: "py09_mcq_01",
          difficulty: "Easy",
          question: "What does this print?\n\nfor n in [1, 2, 3, 4]:\n    if n == 3:\n        break\n    print(n)",
          options: ["1 2", "1 2 3", "1 2 4", "1 2 3 4"],
          correctIndex: 0,
          explanation:
            "When n is 3, break fires BEFORE the print (the print sits after the if), ending the loop. Only 1 and 2 were printed on earlier iterations.",
        },
        {
          type: "mcq",
          id: "py09_mcq_02",
          difficulty: "Easy",
          question: "What does this print?\n\nfor n in [1, 2, 3, 4]:\n    if n % 2 == 0:\n        continue\n    print(n)",
          options: ["2 4", "1 3", "1 2 3 4", "Nothing"],
          correctIndex: 1,
          explanation:
            "continue skips the print for even numbers (2 and 4), so only the odds appear. continue filters; break terminates.",
        },
        {
          type: "mcq",
          id: "py09_mcq_03",
          difficulty: "Medium",
          question: "Why does `while True:` with a mid-body break exist as an idiom instead of putting the test in the condition?",
          options: [
            "It runs faster than a real condition",
            "Some loops must do work (like fetching a page) BEFORE the exit test is even possible",
            "while conditions can't contain function calls",
            "It's legacy style that modern Python forbids",
          ],
          correctIndex: 1,
          explanation:
            "When the exit decision depends on data produced INSIDE the iteration (fetch, then check), the test naturally belongs mid-body. Forcing it into the while condition requires duplicating the fetch before the loop — uglier than the idiom.",
        },
        {
          type: "scenario",
          id: "py09_sc_01",
          difficulty: "Medium",
          scenario:
            "A pipeline uses `if not valid(row): continue` to skip bad rows. Months later, an upstream schema change makes 40% of rows invalid — and the pipeline reports success every night while silently dropping nearly half the data.",
          question: "What was the design flaw?",
          options: [
            "continue should have been break",
            "Skipped rows were never counted or alerted on — silent skips hide data-quality regressions",
            "The valid() check should run after processing",
            "Using continue at all; bad rows should raise exceptions",
          ],
          correctIndex: 1,
          explanation:
            "Skipping bad records is fine — losing track of HOW MANY is the flaw. A skipped counter plus a threshold alert ('>5% skipped → page someone') turns the silent failure into a loud one. break would wrongly kill the batch; exceptions per-row are a valid but different trade-off.",
        },
        {
          type: "coding",
          id: "py09_code_01",
          difficulty: "Medium",
          prompt:
            "Find the first number in nums = [7, 11, 4, 9, 12, 3] that is divisible by 4, print it, and stop scanning immediately. Expected output: 4",
          starterCode: "nums = [7, 11, 4, 9, 12, 3]\n# Your code here\n",
          solutionCode:
            "nums = [7, 11, 4, 9, 12, 3]\nfor n in nums:\n    if n % 4 == 0:\n        print(n)\n        break",
          expectedOutput: "4",
          tests: [
            {
              name: "Early exit",
              description: "The loop must break after finding 4 — 12 must never be printed",
            },
            {
              name: "Divisibility test",
              description: "Uses % 4 == 0 to test divisibility",
            },
          ],
        },
        {
          type: "mcq",
          id: "py09_mcq_04",
          difficulty: "Hard",
          question:
            "Inside the INNER loop of two nested for loops, break executes. What happens?",
          options: [
            "Both loops end immediately",
            "Only the inner loop ends; the outer loop moves to its next iteration",
            "A SyntaxError — break isn't allowed in nested loops",
            "The inner loop restarts from its first element",
          ],
          correctIndex: 1,
          explanation:
            "break (and continue) act on the nearest enclosing loop only. Escaping both levels needs a flag checked by the outer loop — or moving the loops into a function and using return, which you'll meet next module.",
        },
        {
          type: "scenario",
          id: "py09_sc_02",
          difficulty: "Hard",
          scenario:
            "During a refactor you must keep this branch compiling but do nothing yet:\n\nif record.type == 'legacy':\n    # TODO: migrate legacy records next sprint\nelse:\n    process(record)\n\nAs written, it's a SyntaxError.",
          question: "What's the correct minimal fix?",
          options: [
            "Add `pass` under the comment — comments alone don't count as a block",
            "Add `continue` under the comment",
            "Delete the if branch entirely",
            "Add `break` under the comment",
          ],
          correctIndex: 0,
          explanation:
            "Python requires at least one STATEMENT in a block, and comments aren't statements — pass is the designed placeholder. continue/break would be wrong even if inside a loop: they'd change control flow, not hold a place.",
        },
      ],
    },

    {
      id: "interview-questions",
      type: "interview-questions",
      tocLabel: "Interview Prep",
      questions: [
        {
          question: "Explain break, continue, and pass, and give a production use for each.",
          answer:
            "break exits the nearest enclosing loop immediately — production use: scanning logs for the first fatal error, or reading API pages until an empty one. continue abandons the current iteration and jumps to the next — production use: skipping malformed records in a cleaning loop while the rest of the batch proceeds. pass is not loop control at all: it's a do-nothing statement that fills a syntactically-required block — production use: stubbing an unimplemented branch during a refactor or deliberately ignoring a specific exception. The one-line distinction I'd give: break ends the loop, continue ends the iteration, pass ends nothing.",
        },
        {
          question:
            "A reviewer flags your `if bad: continue` data-cleaning loop as a silent-failure risk. What are they worried about, and how do you address it?",
          answer:
            "The skip itself is fine — the risk is that skips are invisible. If an upstream schema change suddenly makes half the records invalid, a bare continue drops them without a trace and the pipeline still reports success; the data downstream is quietly wrong, which is the worst failure mode in data engineering. The fix is cheap: increment a skipped counter (ideally per skip-reason), log a sample of rejected records, and alert when the skip RATE crosses a threshold. The principle behind it: every record entering a pipeline should be accounted for in the output — processed, skipped-with-reason, or failed — so totals reconcile.",
        },
        {
          question:
            "How do you exit two levels of nested loops in Python, given that break only escapes one?",
          answer:
            "Three honest options. One: set a flag — found = True plus break inside, and make the outer loop's first statement `if found: break`; it works everywhere but adds bookkeeping. Two — usually best: extract the nested loops into a function and use return, which exits all levels at once and gives the search a name and a testable interface. Three: restructure so there's only one loop, for instance iterating over combinations directly. Python deliberately has no labeled break like Java; the language's answer is 'use a function'. In an interview I'd lead with the function approach and mention the flag as the quick local fix.",
        },
      ],
    },

    {
      id: "common-mistakes",
      type: "callout",
      variant: "warning",
      title: "Common Mistakes to Avoid",
      content:
        "1) Expecting break to exit ALL nested loops — it exits only the innermost. 2) Silent continue skips with no counter — data-quality regressions vanish. 3) Ordering guards wrong: the abort/break check belongs before the skip/continue check, or poison records get miscounted as skips. 4) A while True whose break is buried or conditional on something that may never happen — that's just an infinite loop with extra steps. 5) Using pass where you meant continue (pass falls through and RUNS the rest of the body). 6) Code after continue in the same block — it's unreachable for that iteration.",
    },

    {
      id: "ai-tutor",
      type: "callout",
      variant: "tip",
      title: "Ask the AI Tutor",
      content:
        "Try these prompts in the AI Tutor panel: • 'Give me five loops using break/continue and quiz me on their output.' • 'Show a bug where pass was used instead of continue.' • 'Refactor this nested-if loop body into guard clauses with continue.' • 'When is while True considered clean code?' • 'Interview mode: ask me how to escape nested loops and grade my answer.'",
    },

    {
      id: "glossary",
      type: "callout",
      variant: "info",
      title: "Glossary",
      content:
        "break — statement that exits the nearest enclosing loop immediately. continue — statement that skips the rest of the current iteration and returns to the loop's top. pass — a statement that does nothing; fills a syntactically-required empty block. Early exit — leaving a loop as soon as the answer is known. Guard (in a loop) — an `if bad: continue` line at the top of the body that filters out unprocessable items. Poison pill — a special record whose appearance must halt processing. while True — an intentionally endless condition paired with a mid-body break. .extend() — list method appending all elements of another list. .startswith() — string method testing a prefix.",
    },

    {
      id: "resources",
      type: "callout",
      variant: "info",
      title: "Recommended Resources",
      content:
        "• Docs: 'break and continue Statements' in the official Python tutorial. • Read: PEP 8 on when explicit is better than clever — guard clauses with continue are the loop-shaped example. • Practice: take the log-scanning Industry Example and add a third rule (count ERROR lines separately) without adding any nesting. • Next in DSM: you now steer loops line by line — List Comprehensions collapse the whole filter-and-transform loop into a single readable expression, the most Pythonic syntax you'll learn this module.",
    },

    {
      id: "recap",
      type: "recap",
      tocLabel: "Recap",
      content:
        "✓ break ends the loop; continue ends the iteration; pass ends nothing (placeholder).\n✓ Both break and continue affect only the NEAREST enclosing loop.\n✓ `if bad: continue` at the top of a body is the loop version of a guard clause.\n✓ while True + break is the honest shape for fetch-then-decide loops like pagination.\n✓ Count your skips — silent continue is how data-quality bugs hide.\n✓ Escaping nested loops cleanly usually means extracting a function and returning.\n\nNext up: List Comprehensions. The filter-and-transform loops you've been writing in four lines collapse into one expressive line — Python's signature move for building new lists.",
    },
  ],
};
