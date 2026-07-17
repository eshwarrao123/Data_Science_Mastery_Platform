import type { Lesson } from "@/lib/curriculum/types";

export const conditionals: Lesson = {
  meta: {
    id: "python.control-flow.conditionals",
    slug: "conditionals",
    title: "Conditionals",
    description:
      "Teach your programs to make decisions with if, elif, and else — the branching logic behind every data validation rule.",
    estimatedTime: "25 mins",
    difficulty: "Beginner",
    xpReward: 50,
    prerequisites: ["python.foundations.operators-and-expressions"],
    masteryThreshold: 80,
  },

  blocks: [
    {
      id: "intro",
      type: "lesson-intro",
      tocLabel: "Introduction",
      intro: {
        hook: "So far your programs run every line, top to bottom, no exceptions. Real programs choose. Should this transaction be flagged? Is this value an outlier? Does this row pass validation? Today your code learns to ask questions and act on the answers.",
        what: "A conditional runs a block of code only when a boolean condition is True. Python gives you if for the first test, elif for follow-up tests, and else for everything that falls through.",
        why: "Every data pipeline is full of decisions: skip bad rows, cap outliers, route records, pick a default when a value is missing. Without conditionals, code can't respond to the data it sees.",
        whereUsed:
          "Data validation rules, feature engineering (bucketing ages into groups), alert thresholds, handling missing values, and every filter you'll ever write.",
        objectives: [
          "Write if, elif, and else blocks with correct indentation",
          "Combine comparisons with and, or, and not inside conditions",
          "Order elif branches so the most specific test runs first",
          "Use truthiness to test for empty strings and zero values",
          "Replace nested conditionals with guard clauses for readability",
        ],
        realWorldApps: [
          {
            company: "Stripe",
            headline: "Payment risk rules",
            detail:
              "Before ML models score a transaction, hard rules run first: if the card country and IP country differ AND the amount exceeds a threshold, route to review. Pure if/elif logic.",
          },
          {
            company: "Duolingo",
            headline: "Streak notifications",
            detail:
              "If a learner hasn't practised today and their streak is at risk and it's evening in their timezone, send the reminder — three conditions joined with and.",
          },
          {
            company: "Zillow",
            headline: "Listing quality gates",
            detail:
              "A new listing is auto-published only if it has photos, a valid price, and a complete address; otherwise it's queued for manual review via an else branch.",
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
            "An if statement has three parts: the keyword if, a condition that evaluates to True or False, and a colon. The indented lines below it form the block that runs when the condition holds. Indentation is not decoration in Python — it IS the syntax that defines where a block starts and ends.",
        },
        {
          type: "code-note",
          code: "temperature = 39.2\nif temperature > 38.0:\n    print('Fever detected')\n    print('Flag for review')\nprint('Check complete')",
          content:
            "The two indented lines run only when temperature > 38.0. The final print is not indented, so it runs every time. Standard indentation is 4 spaces — pick it and never mix tabs and spaces.",
        },
        {
          type: "analogy",
          title: "The airport security lane",
          content:
            "Think of if/elif/else as an airport security officer routing passengers: 'Priority ticket? Lane 1. No? Crew badge? Lane 2. No? Everyone else, lane 3.' Each passenger is checked against the rules top to bottom and takes the FIRST lane that matches — nobody is checked against later rules once they've been routed.",
        },
        {
          type: "keypoint",
          title: "elif chains: first match wins",
          content:
            "Python evaluates if/elif conditions top to bottom and runs ONLY the first block whose condition is True — then skips the rest of the chain entirely. Order matters: put the most specific condition first, or a broader condition above it will swallow every case.",
        },
        {
          type: "code-note",
          code: "score = 91\nif score >= 90:\n    grade = 'A'\nelif score >= 80:\n    grade = 'B'\nelif score >= 70:\n    grade = 'C'\nelse:\n    grade = 'F'\nprint(grade)  # A",
          content:
            "score is 91, so the first condition matches and grade is 'A'. Even though 91 >= 80 is also True, that branch never runs. If you reversed the order (>= 70 first), every passing score would be 'C' — a classic ordering bug.",
        },
        {
          type: "text",
          content:
            "Conditions are just boolean expressions — everything from the Operators lesson applies. Combine tests with and (both must hold), or (at least one must hold), and not (flips the result). Parentheses make grouped logic explicit and readable.",
        },
        {
          type: "expandable",
          title: "Truthiness in conditions: if value:",
          content:
            "You'll often see `if name:` instead of `if name != '':`. Python treats empty values (0, 0.0, '', [], None, False) as falsy and everything else as truthy, so `if name:` reads 'if name is present and non-empty'. This is idiomatic Python — but be careful with numbers: `if count:` skips the block when count is 0, which may be a perfectly valid value in your data.",
        },
        {
          type: "warning",
          title: "The assignment-in-condition trap",
          content:
            "Writing `if x = 5:` is a SyntaxError — a single = assigns, a double == compares. Also watch for `if x == 5 or 6:` which does NOT mean 'x is 5 or 6'; it means '(x == 5) or (6)', and 6 is always truthy, so the condition is always True. Write `if x == 5 or x == 6:` or `if x in (5, 6):`.",
        },
      ],
    },

    {
      id: "diagram",
      type: "interactive-diagram",
      tocLabel: "Visual Learning",
      visual: {
        kind: "flow",
        title: "How an if/elif/else chain routes a value",
        caption:
          "Follow a transaction amount through the chain. Click each node to see what happens there.",
        nodes: [
          {
            id: "input",
            label: "amount = 4200",
            sublabel: "value arrives",
            detail:
              "A transaction amount enters the chain. It will be tested against each condition top to bottom until one matches.",
            x: 10,
            y: 45,
            accent: false,
          },
          {
            id: "test1",
            label: "if > 10000?",
            sublabel: "False",
            detail:
              "First test: amount > 10000. 4200 fails this test, so its block ('manual review') is skipped and the value moves to the next test.",
            x: 32,
            y: 20,
            accent: false,
          },
          {
            id: "test2",
            label: "elif > 1000?",
            sublabel: "True → runs",
            detail:
              "Second test: amount > 1000. 4200 passes, so this branch runs ('extra verification') and the REST OF THE CHAIN IS SKIPPED — the else never executes.",
            x: 55,
            y: 20,
            accent: true,
          },
          {
            id: "else",
            label: "else",
            sublabel: "skipped",
            detail:
              "The else branch ('auto-approve') only runs when every condition above it failed. Here it's skipped because the elif matched first.",
            x: 78,
            y: 20,
            accent: false,
          },
          {
            id: "output",
            label: "verify()",
            sublabel: "one branch ran",
            detail:
              "Exactly one branch of an if/elif/else chain executes — never zero (if you have an else), never more than one.",
            x: 90,
            y: 70,
            accent: false,
          },
        ],
        edges: [
          { from: "input", to: "test1" },
          { from: "test1", to: "test2", label: "False → next test" },
          { from: "test2", to: "else", label: "True → skip rest" },
          { from: "test2", to: "output", label: "run branch" },
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
          title: "A single if",
          scenario: "Warn when a website's response time is slow.",
          steps: [
            {
              code: "response_ms = 850",
              explanation:
                "The measured response time in milliseconds. An int, as you'd get from a monitoring tool.",
            },
            {
              code: "if response_ms > 500:\n    print('Slow response')",
              explanation:
                "response_ms > 500 evaluates to True (850 > 500), so the indented print runs. If the value had been 200, nothing would print at all — an if with no else can do nothing.",
            },
          ],
          output: "Slow response",
        },
        {
          difficulty: "Easy",
          title: "if/else: two-way split",
          scenario: "Classify a bank transaction as high-value or normal.",
          steps: [
            {
              code: "amount = 250.0\nTHRESHOLD = 1000.0",
              explanation:
                "The transaction amount and the business threshold. Naming the threshold in CAPS signals it's a constant — a convention, not a rule Python enforces.",
            },
            {
              code: "if amount >= THRESHOLD:\n    label = 'high-value'\nelse:\n    label = 'normal'",
              explanation:
                "250.0 >= 1000.0 is False, so the else branch runs and label becomes 'normal'. With if/else exactly one of the two branches always executes.",
            },
            {
              code: "print(f'{amount}: {label}')",
              explanation: "An f-string embeds both values for a readable log line.",
            },
          ],
          output: "250.0: normal",
        },
        {
          difficulty: "Medium",
          title: "elif chain: bucketing a numeric value",
          scenario:
            "Feature engineering: turn a customer's age into an age_group category — a step you'll later vectorize in pandas.",
          steps: [
            {
              code: "age = 34",
              explanation: "One customer's age. In a real dataset this runs per row.",
            },
            {
              code: "if age < 18:\n    age_group = 'minor'\nelif age < 35:\n    age_group = 'young-adult'\nelif age < 60:\n    age_group = 'middle-aged'\nelse:\n    age_group = 'senior'",
              explanation:
                "The tests run in order: 34 < 18 is False; 34 < 35 is True, so age_group is 'young-adult' and the chain stops. Notice each elif doesn't need to re-test the lower bound — reaching it already means age >= 18. That's the elegance of ordered chains.",
            },
            {
              code: "print(age_group)",
              explanation:
                "In pandas this exact logic becomes pd.cut(df['age'], bins=[0, 18, 35, 60, 120], labels=[...]) — same buckets, vectorized.",
            },
          ],
          output: "young-adult",
        },
        {
          difficulty: "Hard",
          title: "Compound conditions and nesting",
          scenario:
            "A fraud rule: flag a transaction if it's foreign AND large, or if the account is already frozen — and log which rule fired.",
          steps: [
            {
              code: "is_foreign = True\namount = 5200.0\naccount_frozen = False",
              explanation: "Three facts about one transaction, as booleans and a float.",
            },
            {
              code: "large_foreign = is_foreign and amount > 3000",
              explanation:
                "Storing a compound condition in a named boolean makes the rule self-documenting. True and (5200.0 > 3000) → True.",
            },
            {
              code: "if account_frozen:\n    reason = 'account frozen'\nelif large_foreign:\n    reason = 'large foreign transaction'\nelse:\n    reason = None",
              explanation:
                "The most severe condition is tested first. account_frozen is False, so we fall to the elif, which is True. reason is set to the rule name; None means 'no rule fired'.",
            },
            {
              code: "if reason:\n    print(f'FLAGGED: {reason}')\nelse:\n    print('clean')",
              explanation:
                "`if reason:` uses truthiness — None is falsy, any non-empty string is truthy. This two-step pattern (decide, then act) keeps decision logic separate from side effects.",
            },
          ],
          output: "FLAGGED: large foreign transaction",
        },
        {
          difficulty: "Industry Example",
          title: "Guard clauses in a data validation function",
          scenario:
            "A data engineer validates incoming sensor readings. Instead of nesting ifs three levels deep, they use guard clauses — early exits for bad cases. (This example previews `def` and `return`, taught fully in the Functions module — read along, no need to write functions yet.)",
          steps: [
            {
              code: "def validate(reading):\n    if reading is None:\n        return 'rejected: missing'",
              explanation:
                "Guard clause #1: handle the missing-value case immediately and exit. `is None` is the standard way to test for None.",
            },
            {
              code: "    if not -50.0 <= reading <= 60.0:\n        return 'rejected: out of range'",
              explanation:
                "Guard clause #2: a chained comparison checks the physical range for a temperature sensor; `not` flips it to catch violations. No elif needed — the previous guard already returned.",
            },
            {
              code: "    return 'accepted'",
              explanation:
                "If execution reaches this line, every guard passed. The happy path sits at the bottom, unindented and easy to read — compare that with three nested if blocks.",
            },
            {
              code: "print(validate(21.5))\nprint(validate(None))\nprint(validate(999.0))",
              explanation:
                "Three test readings exercise all three paths: valid, missing, out-of-range.",
            },
          ],
          output: "accepted\nrejected: missing\nrejected: out of range",
        },
      ],
    },

    {
      id: "inline-practice",
      type: "inline-code",
      tocLabel: "Practice Coding",
      coding: {
        language: "python",
        filename: "shipping.py",
        instructions:
          "An online store calculates shipping. Complete the rules: orders of $100 or more ship free; orders of $50–99.99 ship for $5; everything below $50 ships for $10. Then print the result. Work only with the variables provided.",
        starterCode: `order_total = 64.90

# TODO 1: if order_total is 100 or more, set shipping to 0.0
# TODO 2: elif order_total is 50 or more, set shipping to 5.0
# TODO 3: else set shipping to 10.0
shipping = ___

print(f"Order: \${order_total:.2f}")
print(f"Shipping: \${shipping:.2f}")
print(f"Total: \${order_total + shipping:.2f}")`,
        solutionCode: `order_total = 64.90

if order_total >= 100:
    shipping = 0.0
elif order_total >= 50:
    shipping = 5.0
else:
    shipping = 10.0

print(f"Order: \${order_total:.2f}")
print(f"Shipping: \${shipping:.2f}")
print(f"Total: \${order_total + shipping:.2f}")`,
        expectedOutput: "Order: $64.90\nShipping: $5.00\nTotal: $69.90",
        hints: [
          "Replace the placeholder with a full if/elif/else chain that assigns shipping in each branch",
          "The first test is order_total >= 100 — the free-shipping case",
          "The elif only needs order_total >= 50; reaching it already means the total is below 100",
          "64.90 falls in the middle bucket, so shipping should be 5.0 and the grand total 69.90",
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
          id: "py06_mcq_01",
          difficulty: "Easy",
          question:
            "In an if/elif/elif/else chain, how many branches can execute for a single run?",
          options: [
            "All branches whose conditions are True",
            "Exactly one",
            "At most one — zero if no else is present... but this chain has an else, so exactly one",
            "Two: the if and the else",
          ],
          correctIndex: 2,
          explanation:
            "Python runs only the FIRST branch whose condition is True, then skips the rest. With an else present, some branch always runs — so exactly one. Without an else, zero branches can run.",
        },
        {
          type: "mcq",
          id: "py06_mcq_02",
          difficulty: "Easy",
          question: "What does this print?\n\nx = 0\nif x:\n    print('yes')\nelse:\n    print('no')",
          options: ["yes", "no", "0", "A TypeError"],
          correctIndex: 1,
          explanation:
            "`if x:` tests truthiness. 0 is falsy, so the else branch runs. This is why `if count:` can silently skip valid zero values in data code.",
        },
        {
          type: "mcq",
          id: "py06_mcq_03",
          difficulty: "Medium",
          question:
            "A grading chain tests `if score >= 70:` first, then `elif score >= 90:`. What grade does score = 95 get?",
          options: [
            "The >= 90 grade, because it's the best match",
            "The >= 70 grade, because the first matching branch wins",
            "Both branches run",
            "A SyntaxError — conditions must be ordered high to low",
          ],
          correctIndex: 1,
          explanation:
            "95 >= 70 is True, so the first branch runs and the chain stops — the >= 90 branch is unreachable for every score. Order elif chains from most specific (highest threshold) to least.",
        },
        {
          type: "scenario",
          id: "py06_sc_01",
          difficulty: "Medium",
          scenario:
            "You're cleaning survey data. A response is valid when the age field is not None AND is between 13 and 120. You write: if age >= 13 and age <= 120 and age is not None: — and the code crashes on rows where age is None.",
          question: "Why does it crash, and what's the fix?",
          options: [
            "None can't be compared with >=; move `age is not None` to the FRONT so short-circuiting skips the comparisons",
            "The chain needs parentheses around each condition",
            "You must convert None to 0 before comparing",
            "Use `or` instead of `and` so at least one test passes",
          ],
          correctIndex: 0,
          explanation:
            "`None >= 13` raises a TypeError. `and` short-circuits left to right, so testing `age is not None` FIRST guarantees the comparisons only run for real numbers. Ordering conditions to exploit short-circuiting is a core defensive pattern.",
        },
        {
          type: "coding",
          id: "py06_code_01",
          difficulty: "Medium",
          prompt:
            "A weather station reports wind_speed_kmh = 78. Print the storm category: 'calm' below 20, 'breezy' from 20 to below 60, 'gale' from 60 to below 90, 'storm' at 90 or above.",
          starterCode: "wind_speed_kmh = 78\n# Your code here\n",
          solutionCode:
            "wind_speed_kmh = 78\nif wind_speed_kmh < 20:\n    category = 'calm'\nelif wind_speed_kmh < 60:\n    category = 'breezy'\nelif wind_speed_kmh < 90:\n    category = 'gale'\nelse:\n    category = 'storm'\nprint(category)",
          expectedOutput: "gale",
          tests: [
            {
              name: "Correct bucket",
              description: "78 falls in the 60–89 range, so the output must be gale",
            },
            {
              name: "Chain order",
              description:
                "Conditions must be ordered so each elif implies the previous test failed",
            },
          ],
        },
        {
          type: "mcq",
          id: "py06_mcq_04",
          difficulty: "Hard",
          question:
            "Which condition correctly checks that status is either 'active' or 'trial'?",
          options: [
            "if status == 'active' or 'trial':",
            "if status == 'active' or status == 'trial':",
            "if status == ('active' or 'trial'):",
            "if status in 'active trial':",
          ],
          correctIndex: 1,
          explanation:
            "Option A is always True because the non-empty string 'trial' is truthy on its own. Option C evaluates ('active' or 'trial') to just 'active'. Option D tests substring membership in one string — 'act' would pass. Only B (or `status in ('active', 'trial')`) is correct.",
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
            "Why does the order of elif branches matter? Give an example of a bug caused by wrong ordering.",
          answer:
            "Python evaluates an if/elif chain top to bottom and executes only the first branch whose condition is True — every later branch is skipped, even if its condition would also hold. So broader conditions placed early swallow cases meant for more specific branches below. Classic bug: a grading chain that tests score >= 70 before score >= 90 gives every A-student a C, because 95 satisfies the first test and the >= 90 branch becomes unreachable. The rule of thumb is to order branches from most specific to most general, and to design ranges so each elif implicitly relies on the previous tests having failed.",
        },
        {
          question:
            "What is a guard clause, and why do many data teams prefer guard clauses to nested if statements?",
          answer:
            "A guard clause is an early exit at the top of a function that handles an invalid or edge case immediately — 'if the input is None, return an error now' — instead of wrapping the main logic in ever-deeper nested ifs. The benefits are readability and safety: each precondition is checked and dismissed in one line, the happy path ends up at the lowest indentation level where it's easiest to read, and you can't accidentally fall through a forgotten else. In data code, where inputs are routinely missing, malformed, or out of range, functions often start with two or three guards before a single line of real logic runs.",
        },
        {
          question:
            "Explain how short-circuit evaluation interacts with conditionals, and how you'd exploit it when a value might be None.",
          answer:
            "With `a and b`, Python evaluates b only if a is True; with `a or b`, only if a is False. That's short-circuiting, and it means the ORDER of conditions is a correctness tool, not just style. If age might be None, `age is not None and age >= 18` is safe because when the first test fails Python never attempts the comparison that would raise a TypeError; reversed, it crashes on the first None. The same trick guards division (`total > 0 and passed / total > 0.5`) and dictionary access. In interviews, mentioning that you deliberately order conditions to make later ones safe signals real production experience.",
        },
      ],
    },

    {
      id: "common-mistakes",
      type: "callout",
      variant: "warning",
      title: "Common Mistakes to Avoid",
      content:
        "1) Using = instead of == inside a condition — SyntaxError. 2) Writing `if x == 5 or 6:` — always True because 6 is truthy; spell out both comparisons or use `x in (5, 6)`. 3) Ordering elif branches broad-to-specific so specific branches never run. 4) Forgetting the colon after if/elif/else, or mis-indenting the block underneath. 5) Testing floats for exact equality in conditions — compare with a tolerance. 6) Using `if count:` when 0 is a legitimate value — write `if count is not None:` when you mean 'present', not 'non-zero'.",
    },

    {
      id: "ai-tutor",
      type: "callout",
      variant: "tip",
      title: "Ask the AI Tutor",
      content:
        "Try these prompts in the AI Tutor panel: • 'Quiz me with five if/elif chains and make me predict the output.' • 'Show me a real data-cleaning bug caused by a wrongly ordered elif.' • 'Explain guard clauses with a fresh analogy.' • 'Give me three conditions where truthiness gives a surprising result.' • 'Interview mode: ask me about short-circuit evaluation and grade my answer.'",
    },

    {
      id: "glossary",
      type: "callout",
      variant: "info",
      title: "Glossary",
      content:
        "Conditional — a statement that runs code only when a condition is True. Condition — a boolean expression tested by if/elif/while. Block — the indented lines governed by a statement. elif — 'else if': the next test in a chain, checked only if everything above failed. else — the fallback branch when no condition matched. Guard clause — an early exit that handles an edge case before the main logic. Truthiness — Python's rules for treating non-boolean values as True/False in conditions. Short-circuit evaluation — and/or stop evaluating as soon as the result is decided. Nesting — placing a conditional inside another conditional's block.",
    },

    {
      id: "resources",
      type: "callout",
      variant: "info",
      title: "Recommended Resources",
      content:
        "• Docs: 'More Control Flow Tools' in the official Python tutorial — if statements from the source. • Read: PEP 8's indentation rules to see why 4 spaces is the universal standard. • Practice: take any three business rules from an app you use (shipping, discounts, notifications) and write them as if/elif chains in a REPL. • Next in DSM: decisions are one half of control flow — repetition is the other. For Loops teaches your code to process a whole dataset one row at a time.",
    },

    {
      id: "recap",
      type: "recap",
      tocLabel: "Recap",
      content:
        "✓ if runs a block only when its condition is True; indentation defines the block.\n✓ elif chains test top to bottom — the first match wins and the rest are skipped.\n✓ else is the fallback when nothing matched; with it, exactly one branch always runs.\n✓ Order conditions from most specific to most general.\n✓ and/or/not build compound conditions; short-circuiting makes condition order a safety tool.\n✓ Guard clauses beat deep nesting: handle bad cases early, keep the happy path flat.\n\nNext up: For Loops. You can make one decision — next you'll repeat work across an entire collection, the pattern behind every row-by-row data operation.",
    },
  ],
};
