import type { Lesson } from "@/lib/curriculum/types";

export const typeConversion: Lesson = {
  meta: {
    id: "python.foundations.type-conversion",
    slug: "type-conversion",
    title: "Type Conversion",
    description:
      "Convert between ints, floats, strings, and bools with int(), float(), and str() — the casts that turn raw file input into usable data.",
    estimatedTime: "20 mins",
    difficulty: "Beginner",
    xpReward: 40,
    prerequisites: ["python.foundations.operators-and-expressions"],
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
        hook: "Here's a truth that trips up every beginner: data almost never arrives as the type you need. A quantity read from a file is the text '42', not the number 42. Before you can add, average, or compare it, you have to convert it. This short lesson is the bridge between raw input and real analysis.",
        what: "Type conversion (casting) turns a value of one type into another: int() to whole numbers, float() to decimals, str() to text, and bool() to True/False. Some conversions Python does for you (implicit); most you request explicitly.",
        why: "CSV files, web forms, APIs, and input() all hand you strings. If you try to sum a column that's secretly text, Python either concatenates it or raises a TypeError. Converting correctly — and safely — is the first real step of every cleaning pipeline.",
        whereUsed:
          "Parsing numbers out of CSV cells, reading form fields, casting API JSON values, preparing columns for arithmetic, and testing whether a value is 'present' with truthiness.",
        objectives: [
          "Distinguish implicit conversion (automatic) from explicit conversion (you call it)",
          "Convert values with int(), float(), str(), and bool()",
          "Turn numeric strings into numbers and know when it fails",
          "Predict which values are truthy and which are falsy",
          "Reason about safe conversion before trusting external data",
        ],
        realWorldApps: [
          {
            company: "Shopify",
            headline: "Reading quantities from a CSV upload",
            detail:
              "A merchant's product CSV stores stock counts as text. Each cell is passed through int() before totals or reorder alerts can be computed.",
          },
          {
            company: "OpenWeather",
            headline: "Parsing API temperature values",
            detail:
              "JSON responses often deliver numbers as strings. float() converts '17.4' into 17.4 so the app can compare it against a threshold.",
          },
          {
            company: "Typeform",
            headline: "Validating a survey number field",
            detail:
              "A respondent types their age into a text box. The backend attempts int() and treats a failure as invalid input rather than crashing.",
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
            "There are two kinds of conversion. Implicit conversion is when Python quietly promotes a type for you — mainly when mixing numbers. Explicit conversion is when you call a function like int() or str() to demand a specific type. You rely on the first occasionally and use the second constantly.",
        },
        {
          type: "keypoint",
          title: "Implicit: Python widens numbers automatically",
          content:
            "When you write 3 + 2.5, Python promotes the int 3 to a float and returns 5.5. It only does this for compatible numeric types, and only to avoid losing information (int → float, never the reverse). It will NEVER guess that '3' + 2 should be 5 — mixing str and int raises a TypeError.",
        },
        {
          type: "analogy",
          title: "Casting is changing currency, not inventing money",
          content:
            "Converting a value is like exchanging currency: str(42) turns 42 into the '42' banknote of a different denomination, but it's the same underlying amount. What you can't do is exchange something that isn't money — int('hello') fails because 'hello' was never a number to begin with.",
        },
        {
          type: "keypoint",
          title: "The four explicit converters",
          content:
            "int(x) → whole number (int('42') is 42; int(3.9) TRUNCATES to 3, it does not round). float(x) → decimal number (float('3.14') is 3.14). str(x) → text ('str(42)' is '42', needed for f-strings and joining). bool(x) → True/False based on truthiness.",
        },
        {
          type: "text",
          content:
            "Not every string can become a number. int('42') works, but int('42.0') and int('twelve') both raise a ValueError, because int() expects a clean whole-number string. float('42.0') works because float understands the decimal point. Knowing which conversions can fail is what lets you write safe code.",
        },
        {
          type: "keypoint",
          title: "Truthy and falsy: what bool() sees",
          content:
            "Falsy values (bool() → False): 0, 0.0, '' (empty string), [] (empty list), None, and False itself. Everything else is truthy → True. So bool(0) is False but bool(-5) is True; bool('') is False but bool('0') is True (a non-empty string!). This is why 'if value:' quietly means 'if value is present and non-empty'.",
        },
        {
          type: "analogy",
          title: "Truthiness is asking 'is there anything here?'",
          content:
            "Think of bool() as peering into a box. An empty box — 0, '', [], None — reads as False, 'nothing here'. A box with anything in it reads as True. Note the trap: the string '0' isn't an empty box; it contains the character '0', so it's truthy.",
        },
        {
          type: "warning",
          title: "int() truncates — it does not round",
          content:
            "int(3.99) is 3, not 4. Python chops off the decimal part rather than rounding to nearest. If you need proper rounding, use round(3.99) which gives 4. Confusing the two silently understates totals — a real bug in financial and reporting code.",
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
        title: "From Raw Input to Usable Number",
        caption:
          "Click each stage to follow a quantity that arrives as text and becomes a number ready for arithmetic — with the failure branch shown.",
        nodes: [
          {
            id: "raw",
            label: "Raw value",
            sublabel: "'42' (a str)",
            detail:
              "Data from a CSV cell, form field, or input() arrives as a string — even when it looks like a number. Arithmetic on it will misbehave or error.",
            x: 12,
            y: 30,
            accent: false,
          },
          {
            id: "check",
            label: "Is it convertible?",
            sublabel: "'42' vs 'N/A'",
            detail:
              "'42' is a clean whole-number string, so int() will succeed. 'N/A' or '42.0' would not — anticipating this is the heart of safe conversion.",
            x: 38,
            y: 30,
            accent: true,
          },
          {
            id: "convert",
            label: "Explicit cast",
            sublabel: "int('42') → 42",
            detail:
              "int() parses the string into a real integer. Now the value supports +, comparisons, and aggregation. float() would give 42.0 instead.",
            x: 64,
            y: 30,
            accent: false,
          },
          {
            id: "use",
            label: "Ready for maths",
            sublabel: "42 * price",
            detail:
              "Once it's a number, every operator from the previous lesson works as expected. This is the payoff of converting first.",
            x: 88,
            y: 30,
            accent: true,
          },
          {
            id: "fail",
            label: "Conversion fails",
            sublabel: "int('N/A') → ValueError",
            detail:
              "If the text isn't a clean number, int() raises a ValueError. Safe code plans for this branch — flagging the value as invalid rather than crashing the whole pipeline.",
            x: 38,
            y: 74,
            accent: false,
          },
        ],
        edges: [
          { from: "raw", to: "check", label: "inspect" },
          { from: "check", to: "convert", label: "clean number" },
          { from: "convert", to: "use", label: "now numeric" },
          { from: "check", to: "fail", label: "not a number" },
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
          title: "Turn a number into text for display",
          scenario: "You want to build the label 'Order #7' from an order number.",
          steps: [
            {
              code: "order_num = 7",
              explanation: "An integer.",
            },
            {
              code: "label = 'Order #' + str(order_num)",
              explanation:
                "You can't add a str and an int directly — that's a TypeError. str(order_num) converts 7 into '7', so the two strings concatenate cleanly.",
            },
            {
              code: "print(label)",
              explanation:
                "Prints Order #7. (An f-string would do this for you automatically, but str() shows the conversion explicitly.)",
            },
          ],
          output: "Order #7",
        },
        {
          difficulty: "Easy",
          title: "Parse a quantity from a CSV cell",
          scenario:
            "A stock feed gives you the quantity as the text '150'. You need to add 20 incoming units.",
          steps: [
            {
              code: "qty_text = '150'",
              explanation:
                "Straight from a file, the quantity is a string, not a number.",
            },
            {
              code: "print(qty_text + 20)  # TypeError!",
              explanation:
                "Trying to add a str and an int raises a TypeError. Python refuses to guess what you meant.",
            },
            {
              code: "qty = int(qty_text)",
              explanation:
                "int('150') converts the text into the integer 150. Now arithmetic is legal.",
            },
            {
              code: "print(qty + 20)",
              explanation:
                "150 + 20 = 170. Convert first, then compute — the golden rule for external data.",
            },
          ],
          output: "170",
        },
        {
          difficulty: "Medium",
          title: "Average a column of numeric strings",
          scenario:
            "Three temperature readings come in as strings: '19.5', '21.0', '18.5'. Compute their average.",
          steps: [
            {
              code: "readings = ['19.5', '21.0', '18.5']",
              explanation:
                "A list of strings — decimals, so int() would fail here; we need float().",
            },
            {
              code: "a = float(readings[0])\nb = float(readings[1])\nc = float(readings[2])",
              explanation:
                "float() understands the decimal point. Each string becomes a real number: 19.5, 21.0, 18.5.",
            },
            {
              code: "average = (a + b + c) / 3",
              explanation:
                "Parentheses first (from the operators lesson), then divide. (19.5 + 21.0 + 18.5) / 3 = 19.666…",
            },
            {
              code: "print(round(average, 2))",
              explanation:
                "round(x, 2) keeps two decimals for a clean report: 19.67.",
            },
          ],
          output: "19.67",
        },
        {
          difficulty: "Hard",
          title: "Truthiness to detect a missing field",
          scenario:
            "A signup form sends a customer's referral code. An empty string means 'no code entered'. Decide whether a referral bonus applies.",
          steps: [
            {
              code: "referral_code = ''",
              explanation:
                "The customer left the field blank, so it arrives as an empty string.",
            },
            {
              code: "has_code = bool(referral_code)",
              explanation:
                "bool('') is False because an empty string is falsy. has_code is False — no code was provided.",
            },
            {
              code: "other_code = '0'",
              explanation:
                "A different customer entered the code '0'. This is a NON-empty string.",
            },
            {
              code: "print(bool(other_code))",
              explanation:
                "bool('0') is True — the string contains a character, so it's truthy. This is the classic trap: '0' the text is not the same as 0 the number.",
            },
          ],
          output: "True",
        },
        {
          difficulty: "Industry Example",
          title: "Safe conversion of a dirty sales column",
          scenario:
            "A data analyst cleans a 'units_sold' column from a CSV. Most cells are clean numeric strings, but some are 'N/A' where the data was missing. The goal is a running total that ignores bad cells instead of crashing. Heads-up: this example previews a for loop and if/else — you only need to read them here; they're taught properly in the next module (Control Flow).",
          steps: [
            {
              code: "# The column as read from the file\ncells = ['12', '7', 'N/A', '20']",
              explanation:
                "Real exports are messy — one cell is the placeholder 'N/A', which int() cannot parse.",
            },
            {
              code: "total = 0\nskipped = 0",
              explanation:
                "We track a running total and a count of cells we couldn't convert.",
            },
            {
              code: "for cell in cells:\n    if cell.isdigit():\n        total += int(cell)\n    else:\n        skipped += 1",
              explanation:
                ".isdigit() checks whether a string is all digits BEFORE we convert — a safe, look-before-you-leap guard. Clean cells are added; 'N/A' is counted as skipped instead of crashing the loop.",
            },
            {
              code: "print(f'Total: {total}, skipped: {skipped}')",
              explanation:
                "12 + 7 + 20 = 39, with 1 cell skipped. This 'validate then convert' pattern is exactly how production pipelines handle imperfect data — the deeper try/except approach comes later.",
            },
          ],
          output: "Total: 39, skipped: 1",
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
        filename: "receipt.py",
        instructions:
          "A checkout system receives all values as strings from a web form. Convert each to the right type and produce the receipt. Use the converters — do not retype the numbers as literals.",
        starterCode: `# Everything from the form arrives as text
price_text = "4.50"     # price per item
qty_text = "3"          # how many
member_text = ""        # empty means "not a member"

# TODO 1: convert price to a float
price = ___

# TODO 2: convert quantity to an int
qty = ___

# TODO 3: total cost (price * qty)
total = ___

# TODO 4: is the shopper a member? (truthiness of the member field)
is_member = ___

print(f"Total: \${total:.2f}")
print(f"Member: {is_member}")`,
        solutionCode: `# Everything from the form arrives as text
price_text = "4.50"     # price per item
qty_text = "3"          # how many
member_text = ""        # empty means "not a member"

price = float(price_text)

qty = int(qty_text)

total = price * qty

is_member = bool(member_text)

print(f"Total: \${total:.2f}")
print(f"Member: {is_member}")`,
        expectedOutput: "Total: $13.50\nMember: False",
        hints: [
          "The price has a decimal point, so float() is the right converter — int('4.50') would raise a ValueError.",
          "The quantity is a whole number, so int(qty_text) turns '3' into 3.",
          "Once price and qty are numbers, total is just price * qty.",
          "member_text is an empty string. bool('') is False, so is_member becomes False automatically.",
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
          id: "py05_mcq_01",
          difficulty: "Easy",
          question: "What does int(7.8) return?",
          options: ["8", "7", "7.8", "A ValueError"],
          correctIndex: 1,
          explanation:
            "int() truncates toward zero — it drops the decimal part rather than rounding. So int(7.8) is 7. Use round(7.8) if you want 8.",
        },
        {
          type: "mcq",
          id: "py05_mcq_02",
          difficulty: "Easy",
          question: "Which of these values is truthy?",
          options: ["0", "''", "'0'", "None"],
          correctIndex: 2,
          explanation:
            "'0' is a non-empty string, so it's truthy. The other three — the number 0, the empty string, and None — are all falsy.",
        },
        {
          type: "mcq",
          id: "py05_mcq_03",
          difficulty: "Medium",
          question: "What happens when you run int('3.14')?",
          options: [
            "It returns 3",
            "It returns 3.14",
            "It raises a ValueError",
            "It returns 4",
          ],
          correctIndex: 2,
          explanation:
            "int() only parses clean whole-number strings. '3.14' contains a decimal point, so it raises a ValueError. You'd first do float('3.14'), then int() on the result if you want 3.",
        },
        {
          type: "scenario",
          id: "py05_sc_01",
          difficulty: "Medium",
          scenario:
            "You read a 'price' column from a CSV. Every value looks like '19.99'. You need to sum the column to get total revenue.",
          question: "What is the correct conversion for each value?",
          options: [
            "int(value) — prices are money, so use whole numbers",
            "float(value) — prices have decimals",
            "str(value) — leave it as text and add the strings",
            "bool(value) — check the price is present first",
          ],
          correctIndex: 1,
          explanation:
            "Prices carry cents, so float() is correct — int('19.99') would raise a ValueError. Adding strings would concatenate ('19.9919.99') rather than sum. bool() only tests presence, not value.",
        },
        {
          type: "coding",
          id: "py05_code_01",
          difficulty: "Medium",
          prompt:
            "A form sends age as the text '34'. Convert it to a number and print whether the person is an adult (age >= 18) as a boolean. Use age_text = '34'. Expected output: True",
          starterCode: "age_text = '34'\n# Your code here\n",
          solutionCode:
            "age_text = '34'\nage = int(age_text)\nprint(age >= 18)",
          expectedOutput: "True",
          tests: [
            {
              name: "Converts the string",
              description: "age_text must be turned into a number with int() before comparing.",
            },
            {
              name: "Prints a boolean",
              description: "Output must be True from the comparison age >= 18.",
            },
          ],
        },
        {
          type: "coding",
          id: "py05_code_02",
          difficulty: "Hard",
          prompt:
            "A temperature arrives as the string '98.6'. Convert it to a float, then print it truncated to a whole number using int(). Use reading = '98.6'. Expected output: 98",
          starterCode: "reading = '98.6'\n# Your code here\n",
          solutionCode:
            "reading = '98.6'\ntemp = float(reading)\nprint(int(temp))",
          expectedOutput: "98",
          tests: [
            {
              name: "Two-step conversion",
              description: "float() first (the string has a decimal), then int() to truncate.",
            },
            {
              name: "Truncates not rounds",
              description: "int(98.6) must give 98, not 99.",
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
            "What's the difference between implicit and explicit type conversion in Python?",
          answer:
            "Implicit conversion is done automatically by Python, mainly to avoid losing information when mixing numeric types — write 3 + 2.5 and Python promotes the int to a float, giving 5.5, without you asking. Explicit conversion is when you call a constructor like int(), float(), str(), or bool() to demand a specific type. Python deliberately keeps implicit conversion narrow: it will widen int to float, but it will never guess that the string '3' should become the number 3, because that could hide bugs. So anything crossing the str/number boundary — which is nearly all real-world input — you convert explicitly.",
        },
        {
          question:
            "Why does so much real-world data arrive as strings, and what problems does that cause?",
          answer:
            "Text is the universal transport format: CSV files are plain text, HTML form fields submit strings, input() returns a string, and even JSON from APIs frequently encodes numbers as quoted strings. So a quantity or price shows up as '42' or '19.99', not as a number. The problems are twofold. First, arithmetic misbehaves — '42' + 5 raises a TypeError, and '42' + '5' concatenates to '425' instead of adding. Second, comparisons are wrong — '9' > '10' is True because strings compare character by character. The fix is to convert every incoming value to its intended type at the boundary of your program, before any calculation or comparison touches it.",
        },
        {
          question:
            "Explain truthiness in Python. Which values are falsy, and why is bool('0') a common trap?",
          answer:
            "Every Python value is either truthy or falsy in a boolean context, which is what lets you write 'if value:' instead of an explicit comparison. The falsy values are a short list: 0, 0.0, '' (empty string), empty containers like [] and {}, None, and False itself. Everything else is truthy. The trap is bool('0'): the string '0' is not empty — it contains one character — so it's truthy, even though the number 0 is falsy. This bites people who read a '0' from a file and expect an 'if' check to treat it as false. The lesson is that truthiness tests presence and emptiness, not numeric value, so if you care about the actual number you must convert with int() or float() first and compare explicitly.",
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
        "1) Expecting int() to round — int(3.9) is 3, not 4; use round() when you need nearest. 2) Calling int() on a decimal string — int('3.14') raises a ValueError; use float() for anything with a decimal point. 3) Doing maths on unconverted input — '42' + 5 is a TypeError, and '42' + '5' concatenates to '425' instead of adding. 4) Comparing numeric strings — '9' > '10' is True because strings compare character by character; convert first. 5) Confusing the string '0' with the number 0 — bool('0') is True (non-empty), while bool(0) is False.",
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
        "Try these prompts in the AI Tutor panel: • 'ELI5: why does data from a CSV come in as strings?' • 'Quiz me on which of ten values are truthy or falsy.' • 'Show me the difference between int(3.9) and round(3.9) with output.' • 'Give me five messy string values and let me pick the right converter for each.' • 'Interview mode: ask me to explain implicit vs explicit conversion and grade my answer.'",
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
        "Type conversion (casting) — changing a value from one type to another. Implicit conversion — automatic promotion Python does when mixing numeric types (int → float). Explicit conversion — a conversion you request by calling int(), float(), str(), or bool(). int() — converts to a whole number, truncating any decimal. float() — converts to a decimal number. str() — converts any value to its text form. bool() — converts a value to True or False by its truthiness. Truthy — a value that counts as True (any non-empty, non-zero value). Falsy — a value that counts as False (0, 0.0, '', [], None, False). ValueError — the error raised when a string can't be parsed into the requested number.",
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
        "• Docs: the 'Built-in Functions' reference entries for int(), float(), str(), and bool() spell out exactly what each accepts. • Read: 'Truth Value Testing' in the standard-types docs lists every falsy value from the source. • Practice: take five messy strings ('42', '3.14', 'N/A', '', '0') and predict what int(), float(), and bool() do to each, then verify in a REPL. • Next in DSM: you can convert single values — next you'll hold and compute over many values at once in Python Lists vs. NumPy Arrays.",
    },

    /* ---------------------------------------------------------------- */
    /*  12 — Recap                                                       */
    /* ---------------------------------------------------------------- */
    {
      id: "recap",
      type: "recap",
      tocLabel: "Recap",
      content:
        "✓ Implicit conversion is automatic numeric widening; explicit conversion is a cast you call.\n✓ int(), float(), str(), and bool() are the four everyday converters.\n✓ int() truncates decimals — it does not round — and int('3.14') raises a ValueError.\n✓ Real data arrives as strings, so convert at the boundary before any maths or comparison.\n✓ Falsy values are 0, 0.0, '', [], None, and False; everything else is truthy — and '0' is truthy.\n✓ Safe conversion means anticipating which values can't be parsed.\n\nNext up: Python Lists vs. NumPy Arrays. You can clean and convert single values — next you'll scale up to whole collections and the arrays data science runs on.",
    },
  ],
};
