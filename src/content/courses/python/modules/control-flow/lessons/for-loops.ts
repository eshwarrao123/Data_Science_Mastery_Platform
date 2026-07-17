import type { Lesson } from "@/lib/curriculum/types";

export const forLoops: Lesson = {
  meta: {
    id: "python.control-flow.for-loops",
    slug: "for-loops",
    title: "For Loops",
    description:
      "Repeat work across a whole collection — the row-by-row processing pattern behind every data script you'll ever read.",
    estimatedTime: "30 mins",
    difficulty: "Beginner",
    xpReward: 50,
    prerequisites: ["python.control-flow.conditionals"],
    masteryThreshold: 80,
  },

  blocks: [
    {
      id: "intro",
      type: "lesson-intro",
      tocLabel: "Introduction",
      intro: {
        hook: "A dataset with a million rows doesn't care how clever your single if statement is — you need to visit every row. The for loop is how Python walks a collection, doing the same work to each item. Master it and you can process anything of any size with four lines of code.",
        what: "A for loop takes each item from a collection (a list, a string, a range of numbers) one at a time, assigns it to a variable, and runs a block of code for it. When the items run out, the loop ends.",
        why: "Almost everything in data work is a collection: rows, columns, files, API pages. Loops turn 'do this once' into 'do this for every record' — and the accumulation patterns you learn here (sum, count, find-max) are the mental model behind every aggregation you'll run in pandas and SQL.",
        whereUsed:
          "Reading files line by line, cleaning each value in a column, computing totals and averages, batch API calls, and generating reports per customer.",
        objectives: [
          "Write for loops over lists, strings, and range()",
          "Build the three core accumulation patterns: sum, count, and find-extreme",
          "Use enumerate() when you need the index alongside the value",
          "Combine loops with conditionals to filter while iterating",
          "Recognize when a loop should become a vectorized operation later",
        ],
        realWorldApps: [
          {
            company: "Shopify",
            headline: "Nightly payout batches",
            detail:
              "A scheduled job loops over every merchant with a positive balance and creates one payout record each — a for loop with an if guard at its heart.",
          },
          {
            company: "NASA",
            headline: "Telemetry frame processing",
            detail:
              "Ground software iterates over incoming telemetry frames, validating and decoding each one; malformed frames are counted and skipped inside the loop.",
          },
          {
            company: "Mailchimp",
            headline: "Campaign sends",
            detail:
              "Sending a campaign is a loop over the subscriber list: personalize the template for each contact, send, and accumulate delivery stats.",
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
            "The syntax mirrors English: `for item in collection:`. Python takes the first element, names it item, runs the indented block, then repeats with the next element until the collection is exhausted. You choose the variable name — pick one that describes a SINGLE element (price, row, name), not the plural.",
        },
        {
          type: "code-note",
          code: "daily_sales = [1250.0, 980.5, 1430.0]\nfor sale in daily_sales:\n    print(f'Sales: ${sale:.2f}')",
          content:
            "The loop body runs three times — once per element — with sale bound to 1250.0, then 980.5, then 1430.0. Singular name for the loop variable, plural for the collection: that one convention makes loops read like sentences.",
        },
        {
          type: "analogy",
          title: "The conveyor belt",
          content:
            "A for loop is a conveyor belt through your workstation. Items arrive one at a time; you perform the same inspection on each; the belt stops when the last item has passed. You never grab two items at once, never skip ahead — and you don't control the belt, it feeds you.",
        },
        {
          type: "keypoint",
          title: "The accumulator pattern",
          content:
            "Most useful loops build an answer as they go: initialize a variable BEFORE the loop (total = 0, count = 0, best = None), update it INSIDE the loop, use it AFTER. Sum, count, average, max, min — every aggregation in existence is this one pattern with a different update line.",
        },
        {
          type: "code-note",
          code: "temps = [21.5, 23.1, 19.8, 25.2]\ntotal = 0.0\nfor t in temps:\n    total += t\naverage = total / len(temps)\nprint(round(average, 2))  # 22.4",
          content:
            "total starts at 0.0, grows by each temperature, and the average is computed after the loop finishes. The += operator (from the Operators lesson) is the workhorse of accumulation.",
        },
        {
          type: "text",
          content:
            "range() generates numbers to loop over: range(5) yields 0,1,2,3,4 (five numbers, starting at 0, stopping BEFORE 5 — same exclusive-stop rule as string slicing). range(1, 6) yields 1–5, and range(0, 20, 5) yields 0,5,10,15. Use range when you need to repeat something N times or generate index numbers.",
        },
        {
          type: "expandable",
          title: "enumerate(): when you need the position too",
          content:
            "Sometimes you need each item AND its position — say, to report 'row 3 is invalid'. Instead of managing a counter yourself, enumerate(collection) yields (index, item) pairs: `for i, name in enumerate(names):`. It starts at 0 by default; enumerate(names, start=1) starts at 1, which is friendlier for human-facing row numbers.",
        },
        {
          type: "warning",
          title: "Don't modify a list while looping over it",
          content:
            "Removing items from a list you're currently iterating skips elements — the belt shifts under your feet. Build a NEW list of the items you want to keep instead (you'll meet the elegant one-line version in List Comprehensions). Also: loops in Python are the right tool for logic, but for pure math over large numeric arrays, remember Lists vs. NumPy Arrays — vectorized operations replace the loop entirely.",
        },
      ],
    },

    {
      id: "diagram",
      type: "interactive-diagram",
      tocLabel: "Visual Learning",
      visual: {
        kind: "flow",
        title: "Anatomy of an accumulating loop",
        caption:
          "One pass of `for price in prices: total += price`. Click each stage to see the state change.",
        nodes: [
          {
            id: "init",
            label: "total = 0",
            sublabel: "before the loop",
            detail:
              "The accumulator is created BEFORE the loop with a neutral starting value: 0 for sums and counts, None or the first element for max/min.",
            x: 8,
            y: 40,
            accent: false,
          },
          {
            id: "next",
            label: "next item?",
            sublabel: "prices → price",
            detail:
              "Python asks the collection for the next element and binds it to the loop variable. If there are no more elements, the loop ends and execution jumps past the block.",
            x: 32,
            y: 40,
            accent: true,
          },
          {
            id: "body",
            label: "total += price",
            sublabel: "loop body runs",
            detail:
              "The indented block runs with the current element. The accumulator absorbs it: 0 → 12.5 → 20.4 → 35.9 as each price arrives.",
            x: 58,
            y: 20,
            accent: false,
          },
          {
            id: "done",
            label: "after the loop",
            sublabel: "use total",
            detail:
              "When the collection is exhausted, code after the loop runs exactly once — this is where you print the total or divide by the count for an average.",
            x: 84,
            y: 40,
            accent: false,
          },
        ],
        edges: [
          { from: "init", to: "next" },
          { from: "next", to: "body", label: "yes → run block" },
          { from: "body", to: "next", label: "repeat" },
          { from: "next", to: "done", label: "no more items" },
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
          title: "Loop over a list",
          scenario: "Greet each member of a project team.",
          steps: [
            {
              code: "team = ['Amara', 'Jonas', 'Yuki']",
              explanation: "A list of three names — the collection we'll iterate.",
            },
            {
              code: "for member in team:\n    print(f'Hello, {member}!')",
              explanation:
                "The body runs three times. First pass: member is 'Amara'. Second: 'Jonas'. Third: 'Yuki'. Then the list is exhausted and the loop ends.",
            },
          ],
          output: "Hello, Amara!\nHello, Jonas!\nHello, Yuki!",
        },
        {
          difficulty: "Easy",
          title: "range() and repetition",
          scenario: "Print a 3-step countdown for a rocket launch simulator.",
          steps: [
            {
              code: "for n in range(3, 0, -1):\n    print(f'{n}...')",
              explanation:
                "range(3, 0, -1) counts DOWN: start at 3, stop before 0, step -1 → 3, 2, 1. The same three-argument pattern as slicing.",
            },
            {
              code: "print('Liftoff!')",
              explanation:
                "Unindented, so it runs once, after the loop completes — not three times.",
            },
          ],
          output: "3...\n2...\n1...\nLiftoff!",
        },
        {
          difficulty: "Medium",
          title: "Count and sum with a filter",
          scenario:
            "From a list of order values, compute how many orders were large (over $100) and their combined revenue.",
          steps: [
            {
              code: "orders = [45.0, 230.0, 89.9, 310.5, 120.0]",
              explanation: "Five order totals from today's transactions.",
            },
            {
              code: "large_count = 0\nlarge_revenue = 0.0",
              explanation:
                "TWO accumulators, both initialized before the loop — one counts, one sums. Loops routinely maintain several.",
            },
            {
              code: "for order in orders:\n    if order > 100:\n        large_count += 1\n        large_revenue += order",
              explanation:
                "A conditional inside the loop filters as we go. Only 230.0, 310.5, and 120.0 pass the test, so both accumulators update three times.",
            },
            {
              code: "print(f'{large_count} large orders, ${large_revenue:.2f} total')",
              explanation:
                "After the loop: 3 orders, 230.0 + 310.5 + 120.0 = 660.5. This loop+if shape is exactly what df[df['order'] > 100] does in pandas, vectorized.",
            },
          ],
          output: "3 large orders, $660.50 total",
        },
        {
          difficulty: "Hard",
          title: "Find the extreme with enumerate",
          scenario:
            "Find the single hottest day in a week of temperature readings — and report WHICH day it was, not just the value.",
          steps: [
            {
              code: "temps = [21.5, 26.8, 24.1, 29.3, 27.7, 22.0, 25.5]",
              explanation: "Seven readings, Monday (index 0) through Sunday (index 6).",
            },
            {
              code: "hottest = temps[0]\nhottest_day = 0",
              explanation:
                "For find-the-max, initialize with the FIRST element, not 0 — if all readings were negative, starting at 0 would silently win and be wrong.",
            },
            {
              code: "for day, temp in enumerate(temps):\n    if temp > hottest:\n        hottest = temp\n        hottest_day = day",
              explanation:
                "enumerate yields (0, 21.5), (1, 26.8), … and tuple unpacking names them day and temp. Whenever a reading beats the current champion, both accumulators update. 29.3 at index 3 ends up winning.",
            },
            {
              code: "days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']\nprint(f'Hottest: {hottest}°C on {days[hottest_day]}')",
              explanation:
                "The stored index looks up the day name. Tracking the index of the best element — argmax — is the manual version of NumPy's .argmax().",
            },
          ],
          output: "Hottest: 29.3°C on Thu",
        },
        {
          difficulty: "Industry Example",
          title: "Validating a batch of records",
          scenario:
            "A data engineer at a logistics company processes a day's shipment records. Each record is checked; valid ones are collected, invalid ones counted — the standard shape of every batch-processing script.",
          steps: [
            {
              code: "weights_kg = ['12.5', '8.0', 'N/A', '22.1', '', '15.75']",
              explanation:
                "Raw values from a CSV — strings, with the two dirty entries ('N/A' and empty) that real exports always contain.",
            },
            {
              code: "clean = []\nskipped = 0",
              explanation:
                "An empty list to collect the survivors and a counter for the rejects. Collecting into a new list (instead of editing the original mid-loop) is the safe pattern.",
            },
            {
              code: "for w in weights_kg:\n    cleaned = w.strip().replace('.', '', 1)\n    if cleaned.isdigit():\n        clean.append(float(w))\n    else:\n        skipped += 1",
              explanation:
                "Each value is tested with the validate-then-convert pattern from Type Conversion (.replace with count 1 tolerates one decimal point). Valid strings become floats via .append() — the list method that adds one element to the end.",
            },
            {
              code: "total = 0.0\nfor w in clean:\n    total += w\nprint(f'{len(clean)} valid, {skipped} skipped, {total:.2f} kg total')",
              explanation:
                "A second loop aggregates the cleaned data. Separate loops for separate jobs (validate, then aggregate) keeps each one trivially readable.",
            },
          ],
          output: "4 valid, 2 skipped, 58.35 kg total",
        },
      ],
    },

    {
      id: "inline-practice",
      type: "inline-code",
      tocLabel: "Practice Coding",
      coding: {
        language: "python",
        filename: "reviews.py",
        instructions:
          "You have a list of product review scores (1–5 stars). Compute the number of reviews, the average score, and how many are 'positive' (4 stars or more). Use loops and the variables provided — no built-in sum().",
        starterCode: `scores = [5, 3, 4, 2, 5, 4, 1, 5]

# TODO 1: loop over scores, accumulating total
total = 0
___

# TODO 2: compute the average (total divided by the number of scores)
average = ___

# TODO 3: loop again, counting scores of 4 or more
positive = 0
___

print(f"Reviews: {len(scores)}")
print(f"Average: {average:.2f}")
print(f"Positive: {positive}")`,
        solutionCode: `scores = [5, 3, 4, 2, 5, 4, 1, 5]

total = 0
for score in scores:
    total += score

average = total / len(scores)

positive = 0
for score in scores:
    if score >= 4:
        positive += 1

print(f"Reviews: {len(scores)}")
print(f"Average: {average:.2f}")
print(f"Positive: {positive}")`,
        expectedOutput: "Reviews: 8\nAverage: 3.62\nPositive: 5",
        hints: [
          "TODO 1 is the sum pattern: for score in scores: total += score",
          "The average divides the finished total by len(scores) — after the loop",
          "TODO 3 needs an if inside the loop: only count when score >= 4",
          "Expected numbers: total 29, average 3.62, positive 5",
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
          id: "py07_mcq_01",
          difficulty: "Easy",
          question: "How many times does the body of `for i in range(4):` run?",
          options: ["3", "4", "5", "It depends on i"],
          correctIndex: 1,
          explanation:
            "range(4) yields 0, 1, 2, 3 — four numbers, so four iterations. The stop value is excluded but counting starts at 0.",
        },
        {
          type: "mcq",
          id: "py07_mcq_02",
          difficulty: "Easy",
          question:
            "What does this print?\n\ntotal = 0\nfor n in [2, 3, 4]:\n    total += n\nprint(total)",
          options: ["9", "234", "4", "0"],
          correctIndex: 0,
          explanation:
            "The accumulator pattern: 0 + 2 + 3 + 4 = 9. If total had been a string, += would have concatenated instead — types still rule.",
        },
        {
          type: "mcq",
          id: "py07_mcq_03",
          difficulty: "Medium",
          question:
            "You need to print each item in a list alongside its 1-based position ('1. apples'). Which is the idiomatic tool?",
          options: [
            "A manual counter variable updated inside the loop",
            "enumerate(items, start=1)",
            "range(len(items) + 1)",
            "items.index(item) inside the loop",
          ],
          correctIndex: 1,
          explanation:
            "enumerate(items, start=1) yields (1, first), (2, second)… with no bookkeeping. A manual counter works but is noisier; items.index() is slow and breaks with duplicate values; range(len(items) + 1) overruns the list.",
        },
        {
          type: "scenario",
          id: "py07_sc_01",
          difficulty: "Medium",
          scenario:
            "A teammate computes an average inside the loop: `for t in temps: avg = total / len(temps)` — updating avg on every single iteration. The result is correct but the reviewer asks for a change.",
          question: "What's the reviewer's point?",
          options: [
            "The division belongs AFTER the loop — computing it every iteration is wasted work and hides the loop's real job",
            "len() can't be called inside a loop",
            "avg must be initialized to 0 first",
            "The loop variable t is unused, which is a syntax error",
          ],
          correctIndex: 0,
          explanation:
            "Aggregate INSIDE the loop, derive AFTER it. The repeated division does nothing until the final iteration anyway; moving it out makes the loop's purpose (summing) obvious. An unused loop variable is legal (conventionally named _), and len() is fine anywhere.",
        },
        {
          type: "coding",
          id: "py07_code_01",
          difficulty: "Medium",
          prompt:
            "Given prices = [12.99, 4.50, 89.00, 23.75], print each price on its own line formatted as 'Item 1: $12.99' (1-based numbering, 2 decimal places).",
          starterCode: "prices = [12.99, 4.50, 89.00, 23.75]\n# Your code here\n",
          solutionCode:
            "prices = [12.99, 4.50, 89.00, 23.75]\nfor i, price in enumerate(prices, start=1):\n    print(f'Item {i}: ${price:.2f}')",
          expectedOutput:
            "Item 1: $12.99\nItem 2: $4.50\nItem 3: $89.00\nItem 4: $23.75",
          tests: [
            {
              name: "1-based numbering",
              description: "The first line must say Item 1, not Item 0",
            },
            {
              name: "Currency formatting",
              description: "Every price shows exactly 2 decimal places with a $ sign",
            },
          ],
        },
        {
          type: "mcq",
          id: "py07_mcq_04",
          difficulty: "Hard",
          question:
            "To find the minimum of a list of temperatures that may all be negative, which initialization is correct?",
          options: [
            "lowest = 0",
            "lowest = temps[0]",
            "lowest = -999",
            "lowest = None, with no further changes to the loop",
          ],
          correctIndex: 1,
          explanation:
            "Starting at 0 fails when every value is above zero... and for a MINIMUM it fails when all values are positive — 0 wins incorrectly. A magic number like -999 fails for data below it. Initializing with the first element is always safe. (None works too, but only with an extra `is None` check inside the loop.)",
        },
        {
          type: "coding",
          id: "py07_code_02",
          difficulty: "Hard",
          prompt:
            "A store logs daily revenue: revenues = [1200.0, 950.0, 1480.0, 1105.0, 890.0]. Using one loop, find the best day's revenue AND its 1-based day number, then print 'Best: $1480.00 (day 3)'.",
          starterCode:
            "revenues = [1200.0, 950.0, 1480.0, 1105.0, 890.0]\n# Your code here\n",
          solutionCode:
            "revenues = [1200.0, 950.0, 1480.0, 1105.0, 890.0]\nbest = revenues[0]\nbest_day = 1\nfor day, rev in enumerate(revenues, start=1):\n    if rev > best:\n        best = rev\n        best_day = day\nprint(f'Best: ${best:.2f} (day {best_day})')",
          expectedOutput: "Best: $1480.00 (day 3)",
          tests: [
            {
              name: "Tracks value and position",
              description: "Both the max revenue and its day number must update together",
            },
            {
              name: "Safe initialization",
              description: "The champion starts as the first element, not 0",
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
          question: "Walk me through the accumulator pattern and name three aggregations built on it.",
          answer:
            "The accumulator pattern has three phases: initialize a result variable before the loop with a neutral value, update it inside the loop as each element passes, and read it after the loop ends. Sum initializes to 0 and adds each element; count initializes to 0 and adds 1 for matching elements; max/min initializes to the first element and replaces it whenever a better one appears. Average is sum divided by count after the loop. What makes the pattern important beyond loops is that it's the mental model for every aggregation you'll ever run — pandas' .sum(), SQL's COUNT(*), and Spark reducers are all industrial-strength accumulators.",
        },
        {
          question:
            "Why is initializing max-finding with 0 a bug, and what's the correct approach?",
          answer:
            "Initializing the champion to 0 assumes at least one element exceeds 0. For data that can be entirely negative — temperatures, account balance changes, profit margins — no element beats 0, so the loop finishes with the answer 0, a value that isn't even in the data. The safe initialization is the first element of the collection (or None with an explicit `is None` check on the first iteration). The same reasoning applies to min-finding with any magic number. In an interview, spotting the sentinel-value bug and stating 'initialize from the data, not from an assumption' is exactly the defensive instinct being tested.",
        },
        {
          question:
            "When would you replace a Python for loop with a vectorized NumPy/pandas operation, and when is the loop the right choice?",
          answer:
            "For elementwise math over large numeric collections — scaling a column, computing a derived field, filtering by a condition — vectorized operations are both faster (compiled C inner loop, no per-element interpreter overhead) and clearer (df['net'] = df['gross'] * 0.9 reads as intent). I reach for an explicit Python loop when the work per item is genuinely sequential or side-effectful: calling an API per record, writing files, complex branching logic that doesn't map to array operations, or when the collection is small enough that clarity beats microseconds. The honest rule: loops for orchestration and I/O, vectorization for math. Writing the loop first to understand the logic, then vectorizing it, is a normal and respectable workflow.",
        },
      ],
    },

    {
      id: "common-mistakes",
      type: "callout",
      variant: "warning",
      title: "Common Mistakes to Avoid",
      content:
        "1) Off-by-one with range(): range(5) is 0–4, and range(1, 5) is 1–4 — the stop is always excluded. 2) Initializing a max-accumulator to 0 when data can be negative. 3) Putting after-the-loop work (like computing an average) inside the loop body. 4) Modifying the list you're iterating — collect into a new list instead. 5) Shadowing the collection with the loop variable (for temps in temps:). 6) Using a loop for elementwise math on big arrays where NumPy vectorization is the tool.",
    },

    {
      id: "ai-tutor",
      type: "callout",
      variant: "tip",
      title: "Ask the AI Tutor",
      content:
        "Try these prompts in the AI Tutor panel: • 'Give me five range() calls and quiz me on what they produce.' • 'Show me an accumulator bug where the initialization is wrong.' • 'When exactly should I use enumerate vs range(len(...))?' • 'Walk me through how this loop becomes a pandas one-liner.' • 'Interview mode: ask me to trace a loop's variables iteration by iteration.'",
    },

    {
      id: "glossary",
      type: "callout",
      variant: "info",
      title: "Glossary",
      content:
        "Iteration — one pass through the loop body. Loop variable — the name bound to the current element (for PRICE in prices). Iterable — anything a for loop can walk: lists, strings, ranges, and more. range(start, stop, step) — generates a sequence of ints, stop excluded. Accumulator — a variable initialized before a loop and updated inside it to build a result. enumerate() — wraps an iterable to yield (index, item) pairs. .append() — list method that adds one element to the end. Tuple unpacking — assigning paired values to multiple names at once (for i, x in ...). argmax — the INDEX of the maximum element, not the maximum itself.",
    },

    {
      id: "resources",
      type: "callout",
      variant: "info",
      title: "Recommended Resources",
      content:
        "• Docs: 'for Statements' and 'The range() Function' in the official Python tutorial. • Read: 'Looping Techniques' in the same tutorial for enumerate, zip, and friends — a preview of tricks you'll keep using. • Practice: compute the total, count, average, max, AND min of one list in a single loop with five accumulators. • Next in DSM: for loops end when the collection does — While Loops run until a CONDITION says stop, the shape behind retries, polling, and convergence.",
    },

    {
      id: "recap",
      type: "recap",
      tocLabel: "Recap",
      content:
        "✓ for item in collection: visits every element once, in order.\n✓ range(start, stop, step) generates number sequences; the stop is always excluded.\n✓ The accumulator pattern (init before, update inside, use after) powers sum, count, average, and extremes.\n✓ Initialize max/min hunts from the data (first element), never from 0.\n✓ enumerate() delivers the index and the item together, with tuple unpacking.\n✓ Filter inside a loop with if; collect survivors into a NEW list with .append().\n\nNext up: While Loops. A for loop runs once per element — next you'll write loops that run until a condition changes, and learn to guarantee they actually stop.",
    },
  ],
};
