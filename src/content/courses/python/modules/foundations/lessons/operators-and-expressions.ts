import type { Lesson } from "@/lib/curriculum/types";

export const operatorsAndExpressions: Lesson = {
  meta: {
    id: "python.foundations.operators-and-expressions",
    slug: "operators-and-expressions",
    title: "Operators & Expressions",
    description:
      "Combine values with arithmetic, comparison, and logical operators — the expressions that drive every calculation and filter in data work.",
    estimatedTime: "25 mins",
    difficulty: "Beginner",
    xpReward: 50,
    prerequisites: ["python.foundations.variables-and-data-types"],
    masteryThreshold: 80,
  },

  blocks: [
    /* ---------------------------------------------------------------- */
    /*  1 — Introduction                                                 */
    /* ---------------------------------------------------------------- */
    {
      id: "intro",
      type: "lesson-intro",
      tocLabel: "Introduction",
      intro: {
        hook: "You can store a value and clean text. Now you'll make values interact: add them, compare them, and test conditions. Every calculation, every 'keep this row, drop that one' decision in data work starts here — with operators.",
        what: "An operator is a symbol that acts on values (+, >, and). An expression is any combination of values and operators that Python evaluates down to a single result — a number, or a True/False.",
        why: "Analysis is arithmetic plus logic. You compute revenue with arithmetic operators and you decide which customers are 'high value' with comparison and logical operators. Expressions are the sentences of that language.",
        whereUsed:
          "Totals, averages, and growth rates; the True/False tests that later become row filters; validation rules; and every condition your programs will branch on.",
        objectives: [
          "Use arithmetic operators, including // floor division, % modulo, and ** power",
          "Compare values with ==, !=, >, <, >=, <= to produce booleans",
          "Combine conditions with and, or, and not",
          "Predict results using operator precedence and clarify with parentheses",
          "Read chained comparisons like 0 <= score <= 100",
        ],
        realWorldApps: [
          {
            company: "Amazon",
            headline: "Free-shipping threshold",
            detail:
              "A cart qualifies when subtotal >= 35 and is_prime is False — a single logical expression decides whether the shipping fee is added.",
          },
          {
            company: "Duolingo",
            headline: "Streak-freeze eligibility",
            detail:
              "The app checks streak_days > 0 and gems >= 200 before offering a streak freeze — two comparisons joined with and.",
          },
          {
            company: "Robinhood",
            headline: "Price-alert triggers",
            detail:
              "An alert fires when price <= target_price, a comparison that evaluates to a bool checked against live market data.",
          },
        ],
      },
    },

    /* ---------------------------------------------------------------- */
    /*  2 — Theory                                                       */
    /* ---------------------------------------------------------------- */
    {
      id: "theory",
      type: "theory-blocks",
      tocLabel: "Theory",
      blocks: [
        {
          type: "text",
          content:
            "Operators come in families. Arithmetic operators produce numbers. Comparison operators produce a bool (True or False). Logical operators combine bools. Assignment operators store results back into variables. Knowing which family an operator belongs to tells you what kind of value the expression will produce.",
        },
        {
          type: "keypoint",
          title: "The arithmetic operators",
          content:
            "+ add, - subtract, * multiply, / true divide (always gives a float: 6 / 2 is 3.0), // floor divide (drops the remainder: 7 // 2 is 3), % modulo (the remainder: 7 % 2 is 1), ** power (2 ** 3 is 8). Floor division and modulo are the two beginners overlook — and the two you'll use constantly for grouping and 'every Nth' logic.",
        },
        {
          type: "analogy",
          title: "// and % are sharing pizza slices",
          content:
            "You have 7 slices and 2 friends. 7 // 2 = 3 is how many whole slices each friend gets. 7 % 2 = 1 is how many slices are left over on the table. Floor division is the fair share; modulo is the remainder.",
        },
        {
          type: "keypoint",
          title: "Comparison operators return booleans",
          content:
            "== equal, != not equal, > greater, < less, >= at least, <= at most. Every comparison evaluates to True or False. Note the double == for comparison — a single = assigns. This is the boolean 'seed' that later grows into row filters.",
        },
        {
          type: "text",
          content:
            "Logical operators join booleans. `and` is True only when BOTH sides are True. `or` is True when AT LEAST ONE side is True. `not` flips a bool. So (score >= 60) and (attendance >= 0.8) is True only when a student clears both bars.",
        },
        {
          type: "analogy",
          title: "and is a strict bouncer, or is a lenient one",
          content:
            "Picture a club door. The 'and' bouncer lets you in only if you satisfy every rule — ID and dress code and on the list. The 'or' bouncer is easygoing: satisfy any one rule and you're in. 'not' is the bouncer who does the opposite of whatever the sign says.",
        },
        {
          type: "code-note",
          code: "score = 82\nattendance = 0.9\npassed = score >= 60 and attendance >= 0.8\nprint(passed)          # True\nprint(60 <= score <= 100)  # True  (chained comparison)\nprint(not passed)      # False",
          content:
            "score >= 60 and attendance >= 0.8 reads left to right and returns one bool. Python also allows chained comparisons like 60 <= score <= 100, which mean exactly what they look like in maths — no need to write it as two separate conditions joined by and.",
        },
        {
          type: "expandable",
          title: "Operator precedence: what runs first?",
          content:
            "Python follows the maths order you already know, extended to logic. Highest first: ** (power), then * / // %, then + -, then comparisons (< > == etc.), then not, then and, then or. So 2 + 3 * 4 is 14, not 20. And a or b and c evaluates the 'and' first. When in doubt, add parentheses — they cost nothing and make intent unmistakable.",
        },
        {
          type: "warning",
          title: "Assignment operators are shortcuts, not comparisons",
          content:
            "total += 5 means total = total + 5. The family includes -=, *=, /=, //=, %=, **=. They modify a variable in place. Do not confuse += (update) with == (compare) — they are unrelated.",
        },
      ],
    },

    /* ---------------------------------------------------------------- */
    /*  3 — Visual Learning                                              */
    /* ---------------------------------------------------------------- */
    {
      id: "diagram",
      type: "interactive-diagram",
      tocLabel: "Visual Learning",
      visual: {
        kind: "flow",
        title: "How Python Evaluates an Expression",
        caption:
          "Click each stage to trace how 'price * qty > budget and in_stock' collapses to a single True or False.",
        nodes: [
          {
            id: "values",
            label: "Values",
            sublabel: "price, qty, budget, in_stock",
            detail:
              "Every expression starts from stored values — numbers and bools. Here: price=20, qty=6, budget=100, in_stock=True. Operators will combine them.",
            x: 12,
            y: 28,
            accent: false,
          },
          {
            id: "arithmetic",
            label: "Arithmetic first",
            sublabel: "price * qty → 120",
            detail:
              "Precedence puts * before comparison, so price * qty runs first, producing the number 120 before anything is compared.",
            x: 38,
            y: 28,
            accent: true,
          },
          {
            id: "compare",
            label: "Then comparison",
            sublabel: "120 > 100 → True",
            detail:
              "Comparison operators run next, turning numbers into a bool. 120 > budget becomes True. This is the value a filter would later act on.",
            x: 64,
            y: 28,
            accent: false,
          },
          {
            id: "logical",
            label: "Then logical",
            sublabel: "True and in_stock",
            detail:
              "Logical operators run last. True and True → True. 'and' needs both sides true, so one False here would sink the whole expression.",
            x: 88,
            y: 28,
            accent: true,
          },
          {
            id: "result",
            label: "Single result",
            sublabel: "True",
            detail:
              "The whole expression collapses to one bool. That's the essence of an expression: many values and operators in, exactly one value out.",
            x: 50,
            y: 74,
            accent: false,
          },
        ],
        edges: [
          { from: "values", to: "arithmetic", label: "**, *, /" },
          { from: "arithmetic", to: "compare", label: ">, <, ==" },
          { from: "compare", to: "logical", label: "and, or, not" },
          { from: "logical", to: "result", label: "collapses to" },
        ],
      },
    },

    /* ---------------------------------------------------------------- */
    /*  4 — Worked Examples                                              */
    /* ---------------------------------------------------------------- */
    {
      id: "worked-examples",
      type: "worked-examples",
      tocLabel: "Worked Examples",
      examples: [
        {
          difficulty: "Very Easy",
          title: "Total the items in a cart",
          scenario: "A customer buys 6 notebooks at $3 each. Compute the total.",
          steps: [
            {
              code: "price = 3\nquantity = 6",
              explanation:
                "Two integer variables — the unit price and how many were bought.",
            },
            {
              code: "total = price * quantity",
              explanation:
                "The * operator multiplies. 3 * 6 evaluates to 18, and we store that single result in total.",
            },
            {
              code: "print(total)",
              explanation:
                "Prints 18. This whole line is an expression that reduced two values to one.",
            },
          ],
          output: "18",
        },
        {
          difficulty: "Easy",
          title: "Split a bill with floor division and modulo",
          scenario:
            "A $47 bill is split among 4 friends. How much does each pay in whole dollars, and what's left over?",
          steps: [
            {
              code: "bill = 47\npeople = 4",
              explanation: "The total to split and the number of people.",
            },
            {
              code: "each = bill // people",
              explanation:
                "// is floor division: it divides and drops the remainder. 47 // 4 is 11 — each person covers $11 in whole dollars.",
            },
            {
              code: "leftover = bill % people",
              explanation:
                "% is modulo: the remainder after the even split. 47 % 4 is 3 — $3 is still unaccounted for.",
            },
            {
              code: "print(f'Each pays {each}, leftover {leftover}')",
              explanation:
                "11 * 4 + 3 = 47, confirming // and % together account for the whole bill.",
            },
          ],
          output: "Each pays 11, leftover 3",
        },
        {
          difficulty: "Medium",
          title: "Precedence and parentheses change the answer",
          scenario:
            "Compute the average of three test scores. Getting the parentheses wrong is the classic bug.",
          steps: [
            {
              code: "a = 80\nb = 90\nc = 70",
              explanation: "Three scores to average.",
            },
            {
              code: "wrong = a + b + c / 3",
              explanation:
                "Because / has higher precedence than +, only c is divided: 80 + 90 + (70/3) = 193.33. Not the average at all.",
            },
            {
              code: "right = (a + b + c) / 3",
              explanation:
                "Parentheses force the addition first, then the division. (80 + 90 + 70) / 3 = 80.0 — the true average.",
            },
            {
              code: "print(wrong, right)",
              explanation:
                "The two results differ hugely. Parentheses aren't optional decoration; they decide the answer.",
            },
          ],
          output: "193.33333333333334 80.0",
        },
        {
          difficulty: "Hard",
          title: "Combine conditions to flag a customer",
          scenario:
            "A loyalty program flags a customer as 'VIP' when they've spent at least $500 AND either have 10+ orders OR joined over a year ago.",
          steps: [
            {
              code: "total_spent = 640\norders = 4\nyears_member = 2",
              explanation:
                "This customer spent plenty and is long-standing, but has few orders — a good test of the logic.",
            },
            {
              code: "spent_enough = total_spent >= 500",
              explanation: "640 >= 500 is True.",
            },
            {
              code: "loyal = orders >= 10 or years_member >= 1",
              explanation:
                "orders >= 10 is False, but years_member >= 1 is True. 'or' needs only one True side, so loyal is True.",
            },
            {
              code: "is_vip = spent_enough and loyal",
              explanation:
                "'and' requires both. True and True → True. The customer is a VIP. Wrapping the 'or' in its own variable keeps the precedence unambiguous.",
            },
            {
              code: "print(is_vip)",
              explanation: "Prints True.",
            },
          ],
          output: "True",
        },
        {
          difficulty: "Industry Example",
          title: "Building the boolean test behind a data filter",
          scenario:
            "A data analyst at a retailer needs to identify 'at-risk inventory': products priced over $100 that have fewer than 5 units in stock. This single boolean is the seed of the row filter they'll later apply to the whole table.",
          steps: [
            {
              code: "# One product row, evaluated by hand first\nprice = 149.99\nstock = 3",
              explanation:
                "Before filtering thousands of rows, you nail the condition on one row. Here a pricey item is running low.",
            },
            {
              code: "is_expensive = price > 100",
              explanation: "149.99 > 100 is True.",
            },
            {
              code: "is_low_stock = stock < 5",
              explanation: "3 < 5 is True.",
            },
            {
              code: "at_risk = is_expensive and is_low_stock",
              explanation:
                "Both must hold, so 'and' is correct. True and True → True. This product is at risk.",
            },
            {
              code: "print(f'At risk: {at_risk}')",
              explanation:
                "This exact expression, price > 100 and stock < 5, is what a pandas row filter will evaluate for every row later — the operator skills transfer directly, no new logic required.",
            },
          ],
          output: "At risk: True",
        },
      ],
    },

    /* ---------------------------------------------------------------- */
    /*  5 — Hands-on Practice                                            */
    /* ---------------------------------------------------------------- */
    {
      id: "inline-practice",
      type: "inline-code",
      tocLabel: "Practice Coding",
      coding: {
        language: "python",
        filename: "order_check.py",
        instructions:
          "An online store evaluates one order. Complete the expressions below. Use the operator families you've learned — do not hard-code the True/False results.",
        starterCode: `# One order under review
subtotal = 84.00
item_count = 7
is_member = True
free_ship_threshold = 75.00

# TODO 1: total after a flat $5 shipping fee IF subtotal is below the threshold.
#         For now just compute shipping-inclusive total assuming fee applies:
total_with_fee = subtotal + ___   # add the $5 fee

# TODO 2: does the order qualify for free shipping? (subtotal at or above threshold)
qualifies_free = ___

# TODO 3: is this a "bulk member" order? member AND item_count above 5
bulk_member = is_member ___ item_count > 5

# TODO 4: average price per item, rounded to 2 decimals (use parentheses!)
avg_price = round(___ / item_count, 2)

print(f"Total with fee: {total_with_fee}")
print(f"Free shipping: {qualifies_free}")
print(f"Bulk member: {bulk_member}")
print(f"Avg price: {avg_price}")`,
        solutionCode: `# One order under review
subtotal = 84.00
item_count = 7
is_member = True
free_ship_threshold = 75.00

total_with_fee = subtotal + 5

qualifies_free = subtotal >= free_ship_threshold

bulk_member = is_member and item_count > 5

avg_price = round(subtotal / item_count, 2)

print(f"Total with fee: {total_with_fee}")
print(f"Free shipping: {qualifies_free}")
print(f"Bulk member: {bulk_member}")
print(f"Avg price: {avg_price}")`,
        expectedOutput:
          "Total with fee: 89.0\nFree shipping: True\nBulk member: True\nAvg price: 12.0",
        hints: [
          "For the fee, just add the literal 5 to subtotal — the + operator works on floats.",
          "Free shipping is a comparison: subtotal >= free_ship_threshold returns a bool directly.",
          "Bulk member joins two conditions that must BOTH hold, so the logical operator is 'and'.",
          "For the average, divide subtotal by item_count. The result 84.00 / 7 is exactly 12.0.",
        ],
      },
    },

    /* ---------------------------------------------------------------- */
    /*  6 — Exercises                                                    */
    /* ---------------------------------------------------------------- */
    {
      id: "exercises",
      type: "mastery-assessment",
      tocLabel: "Quiz & Exercises",
      masteryThreshold: 80,
      exercises: [
        {
          type: "mcq",
          id: "py04_mcq_01",
          difficulty: "Easy",
          question: "What does 17 % 5 evaluate to?",
          options: ["2", "3", "3.4", "12"],
          correctIndex: 0,
          explanation:
            "% is modulo — the remainder. 17 divided by 5 is 3 with 2 left over, so 17 % 5 is 2.",
        },
        {
          type: "mcq",
          id: "py04_mcq_02",
          difficulty: "Easy",
          question: "What is the type of the result of the expression 8 > 3?",
          options: ["int", "float", "bool", "str"],
          correctIndex: 2,
          explanation:
            "Every comparison operator returns a bool. 8 > 3 evaluates to True, whose type is bool.",
        },
        {
          type: "mcq",
          id: "py04_mcq_03",
          difficulty: "Medium",
          question: "What does 2 + 3 * 4 ** 2 evaluate to?",
          options: ["100", "400", "50", "80"],
          correctIndex: 2,
          explanation:
            "Precedence: ** first (4 ** 2 = 16), then * (3 * 16 = 48), then + (2 + 48 = 50). Power binds tighter than multiply, which binds tighter than add.",
        },
        {
          type: "scenario",
          id: "py04_sc_01",
          difficulty: "Medium",
          scenario:
            "You want to keep customers who are between 18 and 65 years old (inclusive). You have a variable age and need one boolean expression.",
          question: "Which expression is correct AND idiomatic Python?",
          options: [
            "18 < age < 65",
            "age >= 18 or age <= 65",
            "18 <= age <= 65",
            "age >= 18 and age > 65",
          ],
          correctIndex: 2,
          explanation:
            "Chained comparison 18 <= age <= 65 includes both endpoints and reads like maths. Option A excludes 18 and 65. Option B uses 'or', which is True for almost any age. Option D is contradictory.",
        },
        {
          type: "coding",
          id: "py04_code_01",
          difficulty: "Medium",
          prompt:
            "A store gives a discount only when an order is large AND the customer is a member. Given subtotal = 120, is_member = True, and a threshold of 100, print whether the discount applies (a single boolean). Expected output: True",
          starterCode:
            "subtotal = 120\nis_member = True\nthreshold = 100\n# Your code here\n",
          solutionCode:
            "subtotal = 120\nis_member = True\nthreshold = 100\ngets_discount = subtotal >= threshold and is_member\nprint(gets_discount)",
          expectedOutput: "True",
          tests: [
            {
              name: "Uses a logical AND",
              description: "Both the size condition and membership must hold.",
            },
            {
              name: "Prints a boolean",
              description: "Output must be True, not a number or string.",
            },
          ],
        },
        {
          type: "coding",
          id: "py04_code_02",
          difficulty: "Hard",
          prompt:
            "A total of 100 cookies is packed into boxes of 8. Print how many FULL boxes there are and how many cookies are left over, on one line as 'boxes leftover'. Use floor division and modulo. Expected output: 12 4",
          starterCode: "cookies = 100\nper_box = 8\n# Your code here\n",
          solutionCode:
            "cookies = 100\nper_box = 8\nboxes = cookies // per_box\nleftover = cookies % per_box\nprint(boxes, leftover)",
          expectedOutput: "12 4",
          tests: [
            {
              name: "Uses floor division",
              description: "100 // 8 must give 12 full boxes.",
            },
            {
              name: "Uses modulo",
              description: "100 % 8 must give 4 leftover cookies.",
            },
          ],
        },
      ],
    },

    /* ---------------------------------------------------------------- */
    /*  7 — Interview Questions                                          */
    /* ---------------------------------------------------------------- */
    {
      id: "interview-questions",
      type: "interview-questions",
      tocLabel: "Interview Prep",
      questions: [
        {
          question:
            "What's the difference between / and // in Python, and when would you use each?",
          answer:
            "/ is true division and always returns a float, even when the result is whole: 6 / 2 is 3.0, not 3. // is floor division, which divides and discards the fractional part, returning the largest whole number at or below the true result: 7 // 2 is 3. I use / for ordinary averages and rates where I want the decimals, and // whenever I need whole groupings — how many full boxes, pages, or batches — usually alongside % (modulo) to get the leftover. A subtle point is that // floors toward negative infinity, so -7 // 2 is -4, not -3.",
        },
        {
          question:
            "Explain how operator precedence works in a mixed expression, and why you'd still use parentheses.",
          answer:
            "Python evaluates in a fixed order: ** first, then * / // %, then + and -, then comparison operators, then not, then and, then or. So 2 + 3 * 4 is 14 because * binds tighter than +, and a or b and c evaluates b and c first. Precedence means the code is unambiguous to the interpreter — but not always to a human reader. I add parentheses even when they're technically redundant because they make intent obvious and prevent the classic bugs, like writing a + b + c / 3 when I meant (a + b + c) / 3. Parentheses cost nothing at runtime and save review time.",
        },
        {
          question:
            "How do and, or, and not evaluate, and what is short-circuiting?",
          answer:
            "'and' is True only if both operands are truthy; 'or' is True if at least one is; 'not' inverts. Crucially, Python short-circuits: for a and b, if a is falsy Python never even evaluates b, because the result is already determined; for a or b, if a is truthy it skips b. This matters for correctness and safety — you can write something like x != 0 and total / x > 1, and the division is only attempted when x isn't zero. Short-circuiting also means the operators return one of the actual operands, not always a strict bool, which is a common gotcha when the operands aren't booleans.",
        },
      ],
    },

    /* ---------------------------------------------------------------- */
    /*  8 — Common Mistakes                                              */
    /* ---------------------------------------------------------------- */
    {
      id: "common-mistakes",
      type: "callout",
      variant: "warning",
      title: "Common Mistakes to Avoid",
      content:
        "1) Writing = where you mean == inside a condition — = assigns, == compares, and mixing them is a classic bug. 2) Forgetting precedence: a + b + c / 3 divides only c; wrap the sum in parentheses. 3) Assuming / gives a whole number — 6 / 2 is 3.0 (a float); use // when you want an integer count. 4) Reaching for & and | (which are bitwise operators) instead of the logical and / or on plain booleans. 5) Over-using 'or' in range checks: age > 18 or age < 65 is True for almost everyone — you almost always want 'and', or better, the chained form 18 <= age <= 65.",
    },

    /* ---------------------------------------------------------------- */
    /*  9 — AI Tutor Prompts                                             */
    /* ---------------------------------------------------------------- */
    {
      id: "ai-tutor",
      type: "callout",
      variant: "tip",
      title: "Ask the AI Tutor",
      content:
        "Try these prompts in the AI Tutor panel: • 'ELI5: what's the difference between % and //?' • 'Quiz me on operator precedence with five tricky expressions.' • 'Show me a real bug caused by missing parentheses in an average.' • 'Give me three business rules and let me write the boolean expression for each.' • 'Interview mode: ask me to explain short-circuiting in and/or and grade my answer.'",
    },

    /* ---------------------------------------------------------------- */
    /*  10 — Glossary                                                    */
    /* ---------------------------------------------------------------- */
    {
      id: "glossary",
      type: "callout",
      variant: "info",
      title: "Glossary",
      content:
        "Operator — a symbol that acts on values (+, >, and). Expression — a combination of values and operators that evaluates to one result. Arithmetic operators — + - * / // % **. Floor division (//) — divide and drop the remainder. Modulo (%) — the remainder of a division. Comparison operators — == != > < >= <=, each returning a bool. Logical operators — and, or, not, combining booleans. Assignment operators — =, +=, -=, etc., that store a value into a variable. Operator precedence — the fixed order Python applies operators in. Chained comparison — a range test like 0 <= x <= 100. Short-circuiting — Python skipping the second operand of and/or when the result is already known.",
    },

    /* ---------------------------------------------------------------- */
    /*  11 — Recommended Resources                                       */
    /* ---------------------------------------------------------------- */
    {
      id: "resources",
      type: "callout",
      variant: "info",
      title: "Recommended Resources",
      content:
        "• Docs: the Python reference section 'Operator precedence' lists every operator from tightest to loosest binding. • Read: 'Boolean Operations — and, or, not' in the standard-types docs explains short-circuiting from the source. • Practice: predict the result of five mixed expressions on paper, then check each in a REPL until precedence feels automatic. • Next in DSM: your comparisons produce booleans and your data often arrives as text — next you'll convert between types cleanly in Type Conversion.",
    },

    /* ---------------------------------------------------------------- */
    /*  12 — Recap                                                       */
    /* ---------------------------------------------------------------- */
    {
      id: "recap",
      type: "recap",
      tocLabel: "Recap",
      content:
        "✓ Arithmetic operators produce numbers; // floors and % gives the remainder.\n✓ Comparison operators (== != > < >= <=) always produce a bool.\n✓ Logical operators and/or/not combine booleans; and needs both, or needs one.\n✓ Precedence runs ** then * / // % then + - then comparisons then not/and/or — parentheses override it.\n✓ Chained comparisons like 18 <= age <= 65 read like maths and include both ends.\n✓ These booleans are the exact seeds of the row filters you'll write later.\n\nNext up: Type Conversion. Your comparisons and maths assume the right types — next you'll turn strings from files and inputs into the numbers these operators need.",
    },
  ],
};
