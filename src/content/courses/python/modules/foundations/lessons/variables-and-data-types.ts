import type { Lesson } from "@/lib/curriculum/types";

export const variablesAndDataTypes: Lesson = {
  meta: {
    id: "python.foundations.variables-and-data-types",
    slug: "variables-and-data-types",
    title: "Variables & Data Types",
    description:
      "Learn how Python stores values with variables and how data types control what operations are allowed.",
    estimatedTime: "25 mins",
    difficulty: "Beginner",
    xpReward: 50,
    prerequisites: [],
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
        hook: "Welcome! Before we touch data, we need to understand the containers Python uses to hold it. Think of this lesson as learning where to put things before you start cooking. Let's go.",
        what: "A variable is a named label that points to a value stored in your computer's memory. A data type tells Python what kind of value it's dealing with — and therefore what you're allowed to do with it.",
        why: "Without variables you'd have to hard-code every number directly in your code, making it impossible to change. Without data types, Python couldn't know whether `2 + 2` means arithmetic or string concatenation.",
        whereUsed:
          "Every single Python program ever written uses variables and data types. They are the atoms of programming.",
        objectives: [
          "Assign values to variables using the = operator",
          "Identify the four primitive data types: int, float, str, bool",
          "Use type() to inspect a variable's type at runtime",
          "Understand why data types matter for arithmetic and comparisons",
          "Convert between types using int(), float(), and str()",
        ],
        realWorldApps: [
          {
            company: "Uber",
            headline: "Surge pricing calculation",
            detail:
              "Every fare uses float variables for distance and multiplier, int for minutes, and bool flags to check whether surge rules apply.",
          },
          {
            company: "Spotify",
            headline: "Track metadata storage",
            detail:
              "A song's duration is an int (milliseconds), its title a str, its popularity a float, and whether it's explicit a bool.",
          },
          {
            company: "Instagram",
            headline: "Like counter",
            detail:
              "Post like counts are integers. The display label ('1.2M') is a string derived from that int at render time.",
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
            "In Python, you create a variable by writing a name, an equals sign, and a value. That's it — no declaration keyword, no type annotation required. Python figures out the type from the value you assign.",
        },
        {
          type: "analogy",
          title: "The sticky-note analogy",
          content:
            "Imagine your computer's memory as a giant whiteboard. A variable is a sticky note you stick on a value written on that whiteboard. The note has a name ('price') and it points to the value (9.99). You can peel the note off and stick it on a different value at any time.",
        },
        {
          type: "keypoint",
          title: "The four primitive types",
          content:
            "int — whole numbers (42, -7, 0). float — numbers with a decimal (3.14, -0.5). str — text in quotes ('hello'). bool — True or False (capital T and F, not lowercase).",
        },
        {
          type: "text",
          content:
            "Python is dynamically typed. That means you never declare a type. But Python still tracks it internally — and will raise a TypeError if you try to do something nonsensical, like adding a number to a string without converting first.",
        },
        {
          type: "analogy",
          title: "Types are like units in physics",
          content:
            "You can add 5 metres + 3 metres = 8 metres. But 5 metres + 3 kilograms makes no sense. Python's type system enforces exactly this idea: it lets you add int + float (both numbers), but blocks str + int (different 'units') unless you explicitly convert.",
        },
        {
          type: "expandable",
          title: "Why does 0.1 + 0.2 not equal 0.3 in Python?",
          content:
            "Floats are stored in binary (base-2). Most decimal fractions — including 0.1 — can't be represented exactly in binary, so Python stores the nearest possible approximation. When you add two approximations, the tiny errors accumulate. This is an IEEE 754 floating-point standard issue, not a Python bug. For financial calculations, use Python's built-in decimal module instead.",
        },
        {
          type: "code-note",
          code: 'name = "Ada"\nage  = 35\nheight = 1.68\nis_active = True\nprint(type(name))    # <class \'str\'>\nprint(type(age))     # <class \'int\'>\nprint(type(height))  # <class \'float\'>\nprint(type(is_active))# <class \'bool\'>',
          content:
            "Notice how Python infers the type from the value. The type() function is your best friend for debugging — whenever you're unsure what something is, wrap it in type() and print it.",
        },
        {
          type: "warning",
          title: "Common beginner mistake: = vs ==",
          content:
            "A single = assigns a value. A double == compares two values. Writing `if x = 5:` is a SyntaxError. Always use == inside conditions.",
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
        kind: "comparison",
        title: "Python's Four Primitive Types",
        caption:
          "Click any type to see what operations it supports and where it's used in real data pipelines.",
        nodes: [
          {
            id: "int",
            label: "int",
            sublabel: "42",
            detail:
              "Whole numbers with no decimal point. Supports +, -, *, //, %, **. Perfect for counts, indices, and loop ranges. In pandas, integer columns are dtype int64.",
            x: 15,
            y: 35,
            accent: false,
          },
          {
            id: "float",
            label: "float",
            sublabel: "3.14",
            detail:
              "Numbers with a decimal point. Supports all arithmetic operators. Used for prices, percentages, model weights, and probabilities. Default dtype for numeric pandas columns with any decimals.",
            x: 45,
            y: 35,
            accent: true,
          },
          {
            id: "str",
            label: "str",
            sublabel: '"hello"',
            detail:
              "Sequences of characters enclosed in quotes. Supports concatenation (+), repetition (*), slicing, and a rich set of methods like .lower(), .split(), .strip(). The object dtype in pandas.",
            x: 75,
            y: 35,
            accent: false,
          },
          {
            id: "bool",
            label: "bool",
            sublabel: "True / False",
            detail:
              "A subclass of int — True == 1, False == 0. Returned by comparisons (>, <, ==, !=) and logical operators (and, or, not). Used as mask arrays in pandas and NumPy filtering.",
            x: 30,
            y: 70,
            accent: false,
          },
          {
            id: "none",
            label: "NoneType",
            sublabel: "None",
            detail:
              "Python's null value. Represents the absence of a value — similar to NULL in SQL or NaN in pandas. bool(None) is False.",
            x: 62,
            y: 70,
            accent: false,
          },
        ],
        edges: [
          { from: "int", to: "float", label: "implicit widening" },
          { from: "bool", to: "int", label: "is a subclass of" },
          { from: "int", to: "str", label: "str()" },
          { from: "float", to: "str", label: "str()" },
          { from: "str", to: "int", label: "int()" },
          { from: "none", to: "bool", label: "bool(None) → False" },
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
          title: "Assign and print a variable",
          scenario: "You're building a script that greets a new user by name.",
          steps: [
            {
              code: "username = 'Alice'",
              explanation:
                "We create a variable called username and assign it the string 'Alice'. Python stores 'Alice' in memory and sticks the label 'username' on it.",
            },
            {
              code: "print(username)",
              explanation:
                "print() takes whatever is inside the parentheses and displays it. Because username points to 'Alice', Python prints Alice (without quotes — quotes are just Python's notation for string literals).",
            },
          ],
          output: "Alice",
        },
        {
          difficulty: "Easy",
          title: "Arithmetic with int and float",
          scenario:
            "Calculate the total cost of 3 items at $4.99 each plus 8% tax.",
          steps: [
            {
              code: "price_per_item = 4.99",
              explanation:
                "4.99 has a decimal point, so Python makes this a float. We store it in price_per_item.",
            },
            {
              code: "quantity = 3",
              explanation:
                "3 is a whole number, so Python makes this an int. Notice: no decimal point, no quotes.",
            },
            {
              code: "subtotal = price_per_item * quantity",
              explanation:
                "Python multiplies float * int. When you mix int and float in an arithmetic operation, Python automatically promotes the result to float. subtotal is now 14.97.",
            },
            {
              code: "tax_rate = 0.08\ntotal = subtotal * (1 + tax_rate)",
              explanation:
                "We add 1 to the tax_rate (giving us 1.08 — the full amount including tax) and multiply. This is the standard formula: total = subtotal × (1 + tax_rate).",
            },
            {
              code: "print(f'Total: ${total:.2f}')",
              explanation:
                "An f-string (formatted string literal) lets us embed variables inside a string using {}. :.2f means 'format as a float with exactly 2 decimal places'. So 16.1676 becomes $16.17.",
            },
          ],
          output: "Total: $16.17",
        },
        {
          difficulty: "Medium",
          title: "Type conversion and user input",
          scenario:
            "Read a birth year from user input and calculate the user's age.",
          steps: [
            {
              code: "birth_year_str = '1995'",
              explanation:
                "Simulating user input. Everything that comes from input() is a string, even if the user types a number. So '1995' is a str, not an int.",
            },
            {
              code: "birth_year = int(birth_year_str)",
              explanation:
                "int() converts the string '1995' to the integer 1995. If the string contains anything non-numeric — like '199x' — this raises a ValueError. Validate input before converting in production code.",
            },
            {
              code: "current_year = 2025",
              explanation:
                "We hard-code the current year for this example. In a real script you'd use datetime.date.today().year.",
            },
            {
              code: "age = current_year - birth_year\nprint(f'You are {age} years old.')",
              explanation:
                "Now that both are integers, subtraction works. We embed age in an f-string. Python automatically converts the integer to a string representation for display.",
            },
          ],
          output: "You are 30 years old.",
        },
        {
          difficulty: "Hard",
          title: "Boolean expressions as data filters",
          scenario:
            "Given a product's price and stock count, determine whether to show a 'Buy Now' button.",
          steps: [
            {
              code: "price = 299.99\nstock = 0\nmin_stock = 1\nmax_price_for_impulse = 50.0",
              explanation:
                "We define our business-rule variables. stock = 0 means the item is sold out.",
            },
            {
              code: "is_in_stock = stock >= min_stock",
              explanation:
                "The >= operator returns a bool. stock (0) >= min_stock (1) is False. is_in_stock is False.",
            },
            {
              code: "is_impulse_buy = price <= max_price_for_impulse",
              explanation: "299.99 <= 50.0 is False. is_impulse_buy is False.",
            },
            {
              code: "show_buy_button = is_in_stock\nshow_wish_list = not is_in_stock",
              explanation:
                "show_buy_button inherits is_in_stock (False). We use 'not' to flip it — show_wish_list is True, which means we show a 'Notify me' button instead.",
            },
            {
              code: 'print(f"Show Buy button: {show_buy_button}")\nprint(f"Show Wish List: {show_wish_list}")',
              explanation:
                "f-strings convert booleans to their string representations 'True' and 'False' automatically.",
            },
          ],
          output: "Show Buy button: False\nShow Wish List: True",
        },
        {
          difficulty: "Industry Example",
          title: "Feature engineering: deriving a revenue column",
          scenario:
            "A data analyst at an e-commerce company receives a sales CSV. Each row has unit_price (float), quantity (int), and discount_pct (float). The task is to add a net_revenue column.",
          steps: [
            {
              code: "# Simulating one row from the CSV\nunit_price   = 49.95\nquantity     = 12\ndiscount_pct = 0.15   # 15% discount",
              explanation:
                "In a real pandas workflow, these would be Series (columns). Here we calculate one row manually to understand the formula before vectorizing it.",
            },
            {
              code: "gross_revenue = unit_price * quantity",
              explanation:
                "49.95 × 12 = 599.40. float × int → float. This is gross before the discount.",
            },
            {
              code: "discount_amount = gross_revenue * discount_pct",
              explanation:
                "599.40 × 0.15 = 89.91. The monetary value of the discount.",
            },
            {
              code: "net_revenue = gross_revenue - discount_amount",
              explanation:
                "599.40 − 89.91 = 509.49. In pandas, the entire column would be computed in one vectorized line: df['net_revenue'] = df['unit_price'] * df['quantity'] * (1 - df['discount_pct'])",
            },
            {
              code: 'print(f"Gross: ${gross_revenue:.2f}")\nprint(f"Discount: -${discount_amount:.2f}")\nprint(f"Net:   ${net_revenue:.2f}")',
              explanation:
                "Formatted to 2 decimal places — standard for currency. This matches the output you'd see in a Jupyter notebook during EDA.",
            },
          ],
          output: "Gross: $599.40\nDiscount: -$89.91\nNet:   $509.49",
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
        filename: "variables.py",
        instructions:
          "A café tracks its daily metrics. Complete the script below so it prints the correct summary. Use the variables provided — do not hard-code the numbers directly into the print statement.",
        starterCode: `# Daily Café Metrics
cups_sold = 142
price_per_cup = 3.50
barista_hours = 8
hourly_wage = 14.00

# TODO 1: Calculate total_revenue (cups_sold * price_per_cup)
total_revenue = ___

# TODO 2: Calculate total_wages (barista_hours * hourly_wage)
total_wages = ___

# TODO 3: Calculate profit (total_revenue - total_wages)
profit = ___

# TODO 4: Determine if profitable (profit > 0) — store as a bool
is_profitable = ___

print(f"Revenue:  \${total_revenue:.2f}")
print(f"Wages:    \${total_wages:.2f}")
print(f"Profit:   \${profit:.2f}")
print(f"Profitable: {is_profitable}")`,
        solutionCode: `# Daily Café Metrics
cups_sold = 142
price_per_cup = 3.50
barista_hours = 8
hourly_wage = 14.00

total_revenue = cups_sold * price_per_cup
total_wages = barista_hours * hourly_wage
profit = total_revenue - total_wages
is_profitable = profit > 0

print(f"Revenue:  \${total_revenue:.2f}")
print(f"Wages:    \${total_wages:.2f}")
print(f"Profit:   \${profit:.2f}")
print(f"Profitable: {is_profitable}")`,
        expectedOutput:
          "Revenue:  $497.00\nWages:    $112.00\nProfit:   $385.00\nProfitable: True",
        hints: [
          "total_revenue is cups_sold multiplied by price_per_cup",
          "total_wages is barista_hours multiplied by hourly_wage",
          "profit is total_revenue minus total_wages",
          "is_profitable should be a comparison: profit > 0 returns True or False",
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
          id: "py01_mcq_01",
          difficulty: "Easy",
          question: "What type does Python assign to the value `7.0`?",
          options: ["int", "float", "str", "bool"],
          correctIndex: 1,
          explanation:
            "The decimal point forces Python to create a float, even though the number happens to be a whole number.",
        },
        {
          type: "mcq",
          id: "py01_mcq_02",
          difficulty: "Easy",
          question: "What is the output of `print(type(True))`?",
          options: [
            "<class 'int'>",
            "<class 'bool'>",
            "<class 'str'>",
            "True",
          ],
          correctIndex: 1,
          explanation:
            "True is a bool. Even though bool is a subclass of int, type() returns the most specific class — bool.",
        },
        {
          type: "mcq",
          id: "py01_mcq_03",
          difficulty: "Medium",
          question: 'What does `int("3.14")` return?',
          options: ["3", "3.14", "A ValueError", "A TypeError"],
          correctIndex: 2,
          explanation:
            "int() can't parse a string that contains a decimal point. You'd need float('3.14') first, then int() on the result.",
        },
        {
          type: "scenario",
          id: "py01_sc_01",
          difficulty: "Medium",
          scenario:
            "You're building a data pipeline that reads user ages from a CSV file. The column comes in as strings ('28', '34', '19'). You need to compute the average age.",
          question: "What is the correct first step?",
          options: [
            "Use the strings directly — Python will handle the conversion",
            "Convert each string to int using int() before doing arithmetic",
            "Convert each string to float using float() before doing arithmetic",
            "Cast to bool first, then to int",
          ],
          correctIndex: 1,
          explanation:
            "Age is a whole number, so int() is the appropriate conversion. You could also use float() — but int is semantically correct and saves memory. Python will not auto-convert strings for arithmetic; it raises a TypeError.",
        },
        {
          type: "coding",
          id: "py01_code_01",
          difficulty: "Medium",
          prompt:
            "Write a script that takes a price in US dollars (stored as a float variable) and prints it converted to euros, formatted to 2 decimal places. Formula: EUR = USD × 0.92. Use usd = 149.50.",
          starterCode: "usd = 149.50\n# Your code here\n",
          solutionCode:
            "usd = 149.50\neur = usd * 0.92\nprint(f'{eur:.2f}')",
          expectedOutput: "137.54",
          tests: [
            {
              name: "Output format",
              description: "Output should be a single line: 137.54",
            },
            {
              name: "Formula correctness",
              description: "$149.50 must convert to exactly 137.54 EUR at the 0.92 rate",
            },
          ],
        },
        {
          type: "mcq",
          id: "py01_mcq_04",
          difficulty: "Hard",
          question:
            "Which expression correctly checks whether a variable `x` is between 10 and 20 (inclusive)?",
          options: [
            "10 <= x <= 20",
            "x >= 10 and x <= 20",
            "Both A and B are correct",
            "10 < x < 20",
          ],
          correctIndex: 2,
          explanation:
            "Python supports chained comparisons (A), which reads like math notation. B is the expanded form using 'and'. Both are correct and produce identical results. C is the right answer. D excludes the endpoints.",
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
            "What is a variable in Python, and why does every program need them?",
          answer:
            "A variable is a named label that points to a value stored in memory. It lets you give a value a meaningful name — like price or user_age — so you can reference and change it throughout your code instead of hard-coding the same literal everywhere. If a tax rate changes, you update one variable rather than hunting through the whole file. Variables are what make a program flexible: the same code runs on today's data and tomorrow's just by pointing the labels at new values.",
        },
        {
          question:
            "Python is dynamically typed. What does that mean, and what are the trade-offs for data science work?",
          answer:
            "Dynamic typing means you never declare a type — Python infers it from the value you assign, and a variable can even point to a different type later. You write x = 5 instead of int x = 5, which speeds up exploratory analysis in notebooks where you're constantly reshaping data. The trade-off is that type errors surface at runtime rather than being caught up front, so a column you assumed was numeric but is actually strings won't complain until the calculation fails. That's why many teams add type hints and use tools like mypy on production pipelines. In short, dynamic typing is a gift during exploration and a risk in production code that you manage with discipline.",
        },
        {
          question:
            "Why does 0.1 + 0.2 not equal exactly 0.3 in Python, and how would you handle money in a data pipeline because of it?",
          answer:
            "Floats are stored in binary using the IEEE 754 standard, and most decimal fractions — including 0.1 — have no exact binary representation, so Python stores the nearest approximation. When you add two approximations the tiny errors accumulate, giving results like 0.30000000000000004. This is a property of the hardware format, not a Python bug, and every language with IEEE 754 floats behaves the same way. For money I never rely on float equality: I either work in integer cents, or use Python's decimal.Decimal type which stores base-10 values exactly. When comparing floats generally, I compare within a small tolerance using something like math.isclose rather than ==. The practical rule is that floats are for measurement, not for exact accounting.",
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
        "1) Using = (assignment) where you meant == (comparison) inside an if — Python treats `if x = 5:` as a SyntaxError. 2) Assuming input() gives you a number — it always returns a str, so '25' + 5 raises a TypeError until you convert with int(). 3) Testing floats for exact equality: 0.1 + 0.2 == 0.3 is False; compare with a tolerance or use Decimal. 4) Writing True/False in lowercase — Python's booleans are capitalised, and true is just an undefined name. 5) Reusing a built-in name like list, str, or type as a variable, which quietly breaks that function for the rest of your program.",
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
        "Try these prompts in the AI Tutor panel: • 'ELI5: what is the difference between an int and a float?' • 'Quiz me on what type() returns for five different values.' • 'Show me a real bug caused by forgetting to convert a string to a number.' • 'Explain why 0.1 + 0.2 isn't 0.3 with a fresh analogy.' • 'Interview mode: ask me about dynamic typing and grade my answer.'",
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
        "Variable — a named label pointing to a value in memory. Value — the actual data a variable points to. Data type — the kind of value (int, float, str, bool) that decides which operations are allowed. int — a whole number. float — a number with a decimal point. str — text inside quotes. bool — True or False. Dynamic typing — Python infers a variable's type from its value at runtime rather than requiring a declaration. Type conversion (casting) — changing a value from one type to another with int(), float(), or str(). f-string — a formatted string literal (prefixed with f) that embeds variables inside {}.",
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
        "• Docs: the official Python tutorial section 'An Informal Introduction to Python' — numbers and strings from the source. • Read: 'Floating-Point Arithmetic: Issues and Limitations' in the Python docs for the full 0.1 + 0.2 story. • Practice: open a Python REPL and run type() on ten different values until the four primitive types feel automatic. • Next in DSM: you can store single values — next you'll work with text in depth in Strings & String Methods, the raw material of almost every messy dataset.",
    },

    /* ---------------------------------------------------------------- */
    /*  12 — Recap                                                       */
    /* ---------------------------------------------------------------- */
    {
      id: "recap",
      type: "recap",
      tocLabel: "Recap",
      content:
        "✓ A variable is a named label that points to a value in memory.\n✓ Python infers the data type automatically from the value you assign (dynamic typing).\n✓ The four primitive types are int, float, str, and bool.\n✓ Use type() to inspect any value's type at runtime.\n✓ Type conversion is explicit: int(), float(), and str() move values between types.\n✓ Floats are approximations, so never test them for exact equality.\n\nNext up: Strings & String Methods. You can now store text in a str — next you'll slice it, reshape it, and clean it with the methods you'll reach for every time a dataset arrives messy.",
    },
  ],
};
