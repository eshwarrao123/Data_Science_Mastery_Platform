import type { Course } from "../types";

/* ------------------------------------------------------------------ */
/*  Mock Curriculum Data — Python & Data Analysis modules              */
/*  Every lesson follows the strict 6-step pedagogical structure.      */
/* ------------------------------------------------------------------ */

export const curriculum: Course[] = [
  /* ================================================================ */
  /*  COURSE 1 — PYTHON FOR DATA SCIENCE                              */
  /* ================================================================ */
  {
    id: "course_python",
    slug: "python",
    title: "Python for Data Science",
    description:
      "Start from absolute zero. By the end you'll write clean, idiomatic Python that any data team would be proud of.",
    difficulty: "Beginner",
    estimatedHours: 18,
    category: "Programming",
    orderIndex: 1,
    modules: [
      /* -------------------------------------------------------------- */
      /*  MODULE 1 — Python Foundations                                  */
      /* -------------------------------------------------------------- */
      {
        id: "mod_py_foundations",
        slug: "foundations",
        courseSlug: "python",
        title: "Python Foundations",
        description:
          "Variables, data types, and the building blocks that every Python program needs.",
        orderIndex: 1,
        lessons: [
          /* ---------------------------------------------------------- */
          /*  LESSON 1 — Variables & Data Types                          */
          /* ---------------------------------------------------------- */
          {
            id: "py_01",
            slug: "variables-and-data-types",
            title: "Variables & Data Types",
            moduleSlug: "foundations",
            courseSlug: "python",
            estimatedTime: "25 mins",
            difficulty: "Beginner",
            prerequisites: [],
            xpReward: 50,

            step1Intro: {
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

            step2Theory: [
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

            step3Visual: {
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

            step4WorkedExamples: [
              {
                difficulty: "Very Easy",
                title: "Assign and print a variable",
                scenario:
                  "You're building a script that greets a new user by name.",
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
                    explanation:
                      "299.99 <= 50.0 is False. is_impulse_buy is False.",
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

            step5InlineCoding: {
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

            step6Exercises: [
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
                question:
                  'What is the output of `print(type(True))`?',
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
                question:
                  'What does `int("3.14")` return?',
                options: [
                  "3",
                  "3.14",
                  "A ValueError",
                  "A TypeError",
                ],
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
                  "Write a script that takes a temperature in Celsius (stored as a float variable) and prints it converted to Fahrenheit, formatted to 1 decimal place. Formula: F = C × 9/5 + 32. Use celsius = 37.0.",
                starterCode:
                  "celsius = 37.0\n# Your code here\n",
                solutionCode:
                  "celsius = 37.0\nfahrenheit = celsius * 9/5 + 32\nprint(f'{fahrenheit:.1f}')",
                expectedOutput: "98.6",
                tests: [
                  {
                    name: "Output format",
                    description: "Output should be a single line: 98.6",
                  },
                  {
                    name: "Formula correctness",
                    description: "37°C must convert to exactly 98.6°F",
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

            interviewQuestions: [
              {
                question:
                  "What is the difference between a mutable and an immutable type in Python? Give an example of each.",
                answer:
                  "Immutable types (int, float, str, tuple, frozenset) cannot be changed after creation — reassigning a variable creates a new object. Mutable types (list, dict, set) can be modified in-place. Example: strings are immutable, so s = 'hi'; s[0] = 'H' raises a TypeError. Lists are mutable, so lst = [1, 2]; lst[0] = 99 works fine.",
              },
            ],
          },

          /* ---------------------------------------------------------- */
          /*  LESSON 2 — Python Lists vs NumPy Arrays                    */
          /* ---------------------------------------------------------- */
          {
            id: "py_02",
            slug: "lists-vs-numpy-arrays",
            title: "Python Lists vs. NumPy Arrays",
            moduleSlug: "foundations",
            courseSlug: "python",
            estimatedTime: "35 mins",
            difficulty: "Beginner",
            prerequisites: [
              { slug: "variables-and-data-types", title: "Variables & Data Types" },
            ],
            xpReward: 60,

            step1Intro: {
              hook: "You know how to store a single value. Now you need to store thousands of them — and do math on all of them at once. This lesson introduces Python lists and NumPy arrays, and by the end you'll know exactly when to use which one.",
              what: "A Python list is a flexible, ordered collection that can hold any mix of types. A NumPy array is a fixed-type, grid-like container optimized for numerical computation.",
              why: "Most data in the real world is not a single number — it's rows and columns. NumPy arrays are 10–100× faster than lists for numerical operations because they skip Python's overhead and call compiled C code directly.",
              whereUsed:
                "NumPy arrays underpin pandas, scikit-learn, TensorFlow, and virtually every data library in the Python ecosystem.",
              objectives: [
                "Create and index Python lists and NumPy arrays",
                "Explain why NumPy arrays are faster for numerical work",
                "Perform element-wise arithmetic on arrays without loops",
                "Use array slicing to extract rows and columns",
                "Choose the right structure for a given task",
              ],
              realWorldApps: [
                {
                  company: "Tesla",
                  headline: "Sensor data processing",
                  detail:
                    "Autopilot processes millions of lidar/camera readings per second using NumPy arrays — a Python list would be 50× too slow.",
                },
                {
                  company: "Moderna",
                  headline: "Clinical trial analysis",
                  detail:
                    "Vaccine efficacy was computed across thousands of patient records stored as NumPy arrays, enabling matrix operations in milliseconds.",
                },
                {
                  company: "Netflix",
                  headline: "Recommendation matrices",
                  detail:
                    "The user–item rating matrix is a 2D NumPy array. Dot products across it power every 'Top Picks for You' row.",
                },
              ],
            },

            step2Theory: [
              {
                type: "text",
                content:
                  "A Python list is the most flexible container in the language. You can throw any combination of types in it, resize it at any time, and loop through it with a for loop. It's the Swiss Army knife of Python collections.",
              },
              {
                type: "analogy",
                title: "List = a shopping bag",
                content:
                  "A Python list is like a shopping bag. You can put in apples (int), a book (str), and keys (bool) — anything goes, in any order. You can add more items, take items out, and the bag stretches to fit.",
              },
              {
                type: "code-note",
                code: 'my_list = [10, 3.14, "hello", True]\nprint(my_list[0])   # 10\nprint(my_list[-1])  # True  (negative = from end)\nmy_list.append(42)\nprint(len(my_list)) # 5',
                content:
                  "Lists are zero-indexed — the first item is at index 0. Negative indices count from the end. .append() adds to the end without creating a new list.",
              },
              {
                type: "text",
                content:
                  "But here's the problem: if you need to multiply every number in a list by 2, you have to write a loop. With 10 million numbers, that loop visits each element one by one in slow Python bytecode.",
              },
              {
                type: "analogy",
                title: "NumPy array = a spreadsheet column",
                content:
                  "A NumPy array is like a single column in Excel where every cell must be the same type. You give up flexibility — no mixing strings and numbers — but you gain the ability to say 'multiply everything by 2' and have it happen instantly, because NumPy sends the whole array to a compiled C function that runs at native CPU speed.",
              },
              {
                type: "keypoint",
                title: "Vectorization: the key concept",
                content:
                  "When you write `arr * 2` on a NumPy array, there is no Python loop. NumPy calls a C function that operates on the entire array in one shot — this is called vectorization. It is the foundation of fast numerical computing in Python.",
              },
              {
                type: "code-note",
                code: "import numpy as np\n\narr = np.array([1, 2, 3, 4, 5])\nprint(arr * 2)       # [2 4 6 8 10]\nprint(arr.dtype)     # int64\nprint(arr.shape)     # (5,)\nprint(arr.mean())    # 3.0",
                content:
                  "Notice: no brackets in the output (NumPy shows arrays without them), .dtype tells you the stored type, .shape is a tuple of dimensions, and .mean() is a built-in method — no import needed.",
              },
              {
                type: "warning",
                title: "Beware of mixed types in NumPy",
                content:
                  "If you create np.array([1, 2, 'three']), NumPy upcasts all elements to the broadest type — in this case str (dtype '<U21'). All numbers become strings. Always pass homogeneous data to NumPy.",
              },
            ],

            step3Visual: {
              kind: "comparison",
              title: "List vs NumPy Array: Side-by-Side",
              caption:
                "Click a node to see the full detail. The green nodes are NumPy advantages; the neutral nodes are list advantages.",
              nodes: [
                { id: "list_root", label: "Python List", sublabel: "[]", detail: "Built-in. No imports. Ordered, resizable, heterogeneous. O(1) append. Best for general-purpose collections of mixed types.", x: 20, y: 20, accent: false },
                { id: "numpy_root", label: "NumPy Array", sublabel: "np.array()", detail: "Requires `import numpy as np`. Fixed dtype, fixed(ish) size. Best for numerical data where you need speed.", x: 75, y: 20, accent: true },
                { id: "list_flex", label: "Mixed types", sublabel: "[1, 'a', True]", detail: "Lists can hold any Python object. Useful for heterogeneous records before you reach the pandas/DataFrame stage.", x: 10, y: 48, accent: false },
                { id: "list_slow", label: "Slow math", sublabel: "for loop required", detail: "To double every element, you must loop: [x*2 for x in lst]. Each iteration is a Python function call — slow for large datasets.", x: 28, y: 48, accent: false },
                { id: "numpy_fast", label: "Vectorized math", sublabel: "arr * 2", detail: "arr * 2 calls a compiled C function. On 1 million elements, this is ~100× faster than a Python list comprehension.", x: 62, y: 48, accent: true },
                { id: "numpy_dtype", label: "Single dtype", sublabel: ".dtype = int64", detail: "Every element is stored as the same C type. This memory contiguity is what allows BLAS/LAPACK to operate at CPU-native speed.", x: 82, y: 48, accent: true },
                { id: "numpy_2d", label: "2D & N-D", sublabel: "shape (rows, cols)", detail: "NumPy arrays can be multi-dimensional. A 2D array (matrix) has shape (rows, cols) and supports matrix multiplication, slicing rows/columns, and broadcasting.", x: 72, y: 74, accent: true },
                { id: "pandas", label: "pandas builds on NumPy", sublabel: "DataFrame columns = arrays", detail: "Every pandas Series is backed by a NumPy array. Every numerical DataFrame column is an ndarray under the hood. Understanding NumPy is mandatory for understanding pandas.", x: 47, y: 88, accent: true },
              ],
              edges: [
                { from: "list_root", to: "list_flex" },
                { from: "list_root", to: "list_slow" },
                { from: "numpy_root", to: "numpy_fast" },
                { from: "numpy_root", to: "numpy_dtype" },
                { from: "numpy_root", to: "numpy_2d" },
                { from: "numpy_fast", to: "pandas" },
                { from: "numpy_2d", to: "pandas" },
              ],
            },

            step4WorkedExamples: [
              {
                difficulty: "Very Easy",
                title: "Create and print a NumPy array",
                scenario: "Store five temperature readings and print them.",
                steps: [
                  { code: "import numpy as np", explanation: "We import NumPy and give it the conventional alias 'np'. This is universal — every data science codebase does this." },
                  { code: "temps = np.array([22.1, 19.8, 24.5, 18.3, 21.0])", explanation: "np.array() takes a Python list and converts it into a NumPy array. All values are floats, so dtype will be float64." },
                  { code: "print(temps)", explanation: "NumPy prints arrays without commas between elements, on a single line for 1D arrays." },
                ],
                output: "[22.1 19.8 24.5 18.3 21. ]",
              },
              {
                difficulty: "Easy",
                title: "Element-wise math — no loops",
                scenario: "Convert all temperatures from Celsius to Fahrenheit.",
                steps: [
                  { code: "import numpy as np\ntemps_c = np.array([22.1, 19.8, 24.5, 18.3, 21.0])", explanation: "Our original array in Celsius." },
                  { code: "temps_f = temps_c * 9/5 + 32", explanation: "This applies the conversion formula to EVERY element at once. No loop. NumPy broadcasts the scalar values 9, 5, and 32 across the whole array." },
                  { code: "print(temps_f.round(1))", explanation: ".round(1) rounds every element to 1 decimal place. Again, no loop needed." },
                ],
                output: "[71.8 67.6 76.1 64.9 69.8]",
              },
              {
                difficulty: "Medium",
                title: "Slicing a 2D array",
                scenario: "A 3×4 matrix of sales data. Extract the second row and the third column.",
                steps: [
                  { code: "import numpy as np\nsales = np.array([\n    [100, 200, 150, 300],\n    [120, 180, 160, 280],\n    [ 90, 210, 140, 320]\n])", explanation: "We pass a list of lists to np.array(). NumPy converts it to a 2D array with shape (3, 4) — 3 rows, 4 columns." },
                  { code: "print(sales.shape)  # (3, 4)", explanation: ".shape returns a tuple. (3, 4) means 3 rows, 4 columns." },
                  { code: "row1 = sales[1, :]", explanation: "sales[1, :] means 'row index 1, all columns'. The colon : is Python's slice-everything notation. row1 is [120, 180, 160, 280]." },
                  { code: "col2 = sales[:, 2]", explanation: "sales[:, 2] means 'all rows, column index 2'. col2 is [150, 160, 140] — the third column." },
                  { code: "print('Row 1:', row1)\nprint('Col 2:', col2)", explanation: "Printing both extracted slices." },
                ],
                output: "Row 1: [120 180 160 280]\nCol 2: [150 160 140]",
              },
              {
                difficulty: "Hard",
                title: "Boolean masking — filter rows by condition",
                scenario: "From an array of exam scores, extract only the passing scores (>= 60).",
                steps: [
                  { code: "import numpy as np\nscores = np.array([45, 72, 58, 91, 60, 33, 88])", explanation: "Seven exam scores." },
                  { code: "mask = scores >= 60", explanation: "This creates a boolean array: [False True False True True False True]. Each position is True where the condition holds." },
                  { code: "passing = scores[mask]", explanation: "Passing a boolean array as an index is called 'boolean masking'. NumPy returns only the elements where the mask is True." },
                  { code: "print(passing)", explanation: "Only the scores >= 60 are returned." },
                ],
                output: "[72 91 60 88]",
              },
              {
                difficulty: "Industry Example",
                title: "Normalizing a feature column (Min-Max Scaling)",
                scenario: "A data scientist at a fintech startup prepares a 'credit_score' column for a machine learning model. ML models require features scaled to 0–1.",
                steps: [
                  { code: "import numpy as np\ncredit_scores = np.array([580, 720, 650, 490, 800, 610, 755])", explanation: "Raw FICO-style credit scores from 7 customers." },
                  { code: "min_val = credit_scores.min()\nmax_val = credit_scores.max()", explanation: "NumPy's .min() and .max() methods scan the entire array in C speed. min=490, max=800." },
                  { code: "normalized = (credit_scores - min_val) / (max_val - min_val)", explanation: "Min-Max formula: (x - min) / (max - min). This maps every value to [0, 1]. NumPy applies this vectorized — no loop." },
                  { code: "print(normalized.round(3))", explanation: "The customer with score 490 maps to 0.0, the one with 800 maps to 1.0. All others land between." },
                ],
                output: "[0.290 0.742 0.516 0.    1.    0.387 0.858]",
              },
            ],

            step5InlineCoding: {
              language: "python",
              filename: "numpy_practice.py",
              instructions:
                "A weather station recorded daily high temperatures (°C) for a week. Complete the tasks below using NumPy — no Python loops allowed.",
              starterCode: `import numpy as np

temps = np.array([28.5, 31.2, 25.8, 33.1, 29.7, 27.4, 30.6])

# TODO 1: Calculate and print the average temperature (use .mean())
avg = ___
print(f"Average: {avg:.1f}°C")

# TODO 2: Find the hottest day (use .max())
hottest = ___
print(f"Hottest: {hottest}°C")

# TODO 3: Create a boolean mask for days above 30°C, then extract them
hot_days = ___
print(f"Hot days: {hot_days}")

# TODO 4: Convert all temps to Fahrenheit (F = C * 9/5 + 32) — no loop!
temps_f = ___
print(f"In Fahrenheit: {temps_f.round(1)}")`,
              solutionCode: `import numpy as np

temps = np.array([28.5, 31.2, 25.8, 33.1, 29.7, 27.4, 30.6])

avg = temps.mean()
print(f"Average: {avg:.1f}°C")

hottest = temps.max()
print(f"Hottest: {hottest}°C")

hot_days = temps[temps > 30]
print(f"Hot days: {hot_days}")

temps_f = temps * 9/5 + 32
print(f"In Fahrenheit: {temps_f.round(1)}")`,
              expectedOutput:
                "Average: 29.5°C\nHottest: 33.1°C\nHot days: [31.2 33.1 30.6]\nIn Fahrenheit: [83.3 88.2 78.4 91.6 85.5 81.3 87.1]",
              hints: [
                "For the average, NumPy arrays have a built-in .mean() method — no manual calculation needed.",
                "For the hottest day, use .max() just like .mean().",
                "For hot days, first create a boolean mask: mask = temps > 30, then use it to index: temps[mask]. Or combine in one line: temps[temps > 30].",
                "For Fahrenheit conversion, just write the formula directly on the array — NumPy applies it to every element: temps * 9/5 + 32.",
              ],
            },

            step6Exercises: [
              {
                type: "mcq",
                id: "py02_mcq_01",
                difficulty: "Easy",
                question: "What does `np.array([1, 2, 3]).dtype` return?",
                options: ["int", "int64", "float64", "object"],
                correctIndex: 1,
                explanation: "NumPy infers the most specific type. Three integers → int64 on most 64-bit systems.",
              },
              {
                type: "mcq",
                id: "py02_mcq_02",
                difficulty: "Easy",
                question: "Which of these creates a 2D NumPy array with shape (2, 3)?",
                options: [
                  "np.array([1, 2, 3, 4, 5, 6])",
                  "np.array([[1, 2, 3], [4, 5, 6]])",
                  "np.array([[1, 2], [3, 4], [5, 6]])",
                  "np.zeros(2, 3)",
                ],
                correctIndex: 1,
                explanation: "A list of two lists, each with 3 elements, creates shape (2, 3). Option C gives (3, 2). Option D has wrong syntax.",
              },
              {
                type: "mcq",
                id: "py02_mcq_03",
                difficulty: "Medium",
                question: "You have `arr = np.array([10, 20, 30, 40, 50])`. What does `arr[1:4]` return?",
                options: ["[10, 20, 30]", "[20, 30, 40]", "[20, 30, 40, 50]", "[10, 20, 30, 40]"],
                correctIndex: 1,
                explanation: "Python slicing is start-inclusive, end-exclusive. arr[1:4] returns indices 1, 2, 3 — values 20, 30, 40.",
              },
              {
                type: "scenario",
                id: "py02_sc_01",
                difficulty: "Medium",
                scenario: "A colleague sends you code that does: `result = [x**2 for x in big_list]` on a list of 5 million numbers. It takes 4 seconds. Your task is to speed it up.",
                question: "What is the fastest fix?",
                options: [
                  "Rewrite the loop using a while loop instead of a list comprehension",
                  "Convert big_list to a NumPy array and use `arr**2`",
                  "Use multiprocessing.Pool to parallelize the loop",
                  "Use a generator expression instead of a list comprehension",
                ],
                correctIndex: 1,
                explanation: "NumPy vectorization sends the operation to compiled C code. arr**2 on 5M elements runs in ~30ms vs 4 seconds. Generators and while loops are still Python bytecode. Multiprocessing adds overhead for simple arithmetic.",
              },
              {
                type: "coding",
                id: "py02_code_01",
                difficulty: "Hard",
                prompt: "Create a NumPy array of integers from 1 to 10. Compute the sum of squares of all even numbers in the array. (Hint: use boolean masking to extract evens, then square and sum.)",
                starterCode: "import numpy as np\n\narr = np.arange(1, 11)\n# Your code here\n",
                solutionCode: "import numpy as np\n\narr = np.arange(1, 11)\nevens = arr[arr % 2 == 0]\nresult = (evens ** 2).sum()\nprint(result)",
                expectedOutput: "220",
                tests: [
                  { name: "Correct sum", description: "4+16+36+64+100 = 220" },
                  { name: "No explicit loop", description: "Solution must use NumPy boolean masking and vectorized operations" },
                ],
              },
            ],

            interviewQuestions: [
              {
                question: "Explain broadcasting in NumPy. Give an example.",
                answer: "Broadcasting is NumPy's rule for performing arithmetic on arrays of different shapes without copying data. When shapes are compatible (trailing dimensions match or are 1), NumPy stretches the smaller array conceptually. Example: np.array([[1,2,3],[4,5,6]]) + np.array([10,20,30]) — the 1D array is broadcast across both rows, giving [[11,22,33],[14,25,36]].",
              },
            ],
          },
        ],
      },
    ],
  },

  /* ================================================================ */
  /*  COURSE 2 — DATA ANALYSIS WITH PANDAS                            */
  /* ================================================================ */
  {
    id: "course_pandas",
    slug: "data-analysis",
    title: "Data Analysis with Pandas",
    description:
      "The most important skill for a data scientist. Master DataFrames, data cleaning, EDA, and visualization.",
    difficulty: "Beginner",
    estimatedHours: 22,
    category: "Data Analysis",
    orderIndex: 2,
    modules: [
      {
        id: "mod_pandas_core",
        slug: "pandas-core",
        courseSlug: "data-analysis",
        title: "Pandas Core",
        description:
          "DataFrames, Series, indexing, filtering, and the core pandas workflow.",
        orderIndex: 1,
        lessons: [
          /* ---------------------------------------------------------- */
          /*  LESSON — Pandas DataFrames: Your Data's Home              */
          /* ---------------------------------------------------------- */
          {
            id: "da_01",
            slug: "pandas-dataframes",
            title: "Pandas DataFrames: Your Data's Home",
            moduleSlug: "pandas-core",
            courseSlug: "data-analysis",
            estimatedTime: "40 mins",
            difficulty: "Beginner",
            prerequisites: [
              { slug: "lists-vs-numpy-arrays", title: "Lists vs. NumPy Arrays" },
            ],
            xpReward: 75,

            step1Intro: {
              hook: "If NumPy arrays are the engine, DataFrames are the car. Every data scientist lives in DataFrames. This is the single most important data structure you'll learn — let's make it completely intuitive.",
              what: "A pandas DataFrame is a 2-dimensional, labeled data structure — like a spreadsheet or SQL table, but programmable. It has rows (observations) and columns (features), and every column can have its own data type.",
              why: "Raw data arrives as CSVs, databases, or APIs. DataFrames give you a unified interface to load, inspect, clean, filter, aggregate, and analyze it — all in Python.",
              whereUsed:
                "DataFrames are used at every step of a data science project: loading raw data, EDA, feature engineering, model input preparation, and result presentation.",
              objectives: [
                "Create DataFrames from dictionaries and CSV files",
                "Inspect DataFrames with .head(), .info(), .describe()",
                "Select columns with [] and rows with .loc[] / .iloc[]",
                "Filter rows using boolean conditions",
                "Understand the relationship between DataFrame and Series",
              ],
              realWorldApps: [
                {
                  company: "Airbnb",
                  headline: "Price optimization analysis",
                  detail: "Data scientists load millions of listing rows into DataFrames, filter by city and property type, and compute median prices per neighbourhood to train their dynamic pricing model.",
                },
                {
                  company: "JPMorgan",
                  headline: "Fraud detection pipeline",
                  detail: "Transaction DataFrames are filtered for anomalies (unusual amount, new merchant, foreign IP) using boolean masks — all in pandas before the ML model sees the data.",
                },
                {
                  company: "WHO",
                  headline: "Epidemiological reporting",
                  detail: "COVID-19 country-level data was cleaned and aggregated using pandas DataFrames by researchers worldwide to produce the charts you saw in the news.",
                },
              ],
            },

            step2Theory: [
              {
                type: "text",
                content: "Think of a DataFrame as an extremely powerful Excel spreadsheet. It has rows and columns. Columns have names. Rows have an index (by default 0, 1, 2…). Every column is a pandas Series.",
              },
              {
                type: "analogy",
                title: "DataFrame = a spreadsheet that can code",
                content: "Excel is powerful for interactive analysis but breaks for large datasets (row limits, no reproducibility, no version control). A DataFrame is the same idea — rows and columns of data — but it lives in code, handles millions of rows instantly, and every transformation you do is a reusable, auditable script.",
              },
              {
                type: "code-note",
                code: `import pandas as pd

# Create from a dictionary — keys become column names
data = {
    'name':   ['Alice', 'Bob', 'Carol', 'Dave'],
    'age':    [28, 34, 29, 42],
    'salary': [72000, 88000, 65000, 105000],
    'remote': [True, False, True, True]
}
df = pd.DataFrame(data)
print(df)`,
                content: "The dictionary keys become column headers. The lists become the column values. pandas automatically creates a default integer index (0, 1, 2, 3) as the row labels.",
              },
              {
                type: "keypoint",
                title: "Three inspection methods you'll use every day",
                content: "df.head(n) — show first n rows (default 5). df.info() — column names, non-null counts, dtypes, memory usage. df.describe() — count, mean, std, min, percentiles, max for every numeric column.",
              },
              {
                type: "text",
                content: "Selecting data is the core skill. Column selection uses square brackets with the column name as a string. Row selection uses .loc[] (label-based) or .iloc[] (integer position-based).",
              },
              {
                type: "code-note",
                code: `# Column selection
ages = df['age']          # Returns a Series
subset = df[['name', 'salary']]  # Returns a DataFrame (list of cols)

# Row selection by label
row0 = df.loc[0]          # Row with index label 0
alice = df.loc[0, 'name'] # Single cell: row 0, col 'name'

# Row selection by position
first_row = df.iloc[0]    # First row (position 0)
cell = df.iloc[0, 2]      # Row 0, column 2 (salary)`,
                content: "Single brackets + one string → Series. Double brackets + list → DataFrame. This distinction trips up beginners — remember: [[ ]] keeps the column structure intact.",
              },
              {
                type: "expandable",
                title: "What is a pandas Series?",
                content: "A Series is a 1D labeled array — essentially one column of a DataFrame. It has values (a NumPy array underneath) and an index (the row labels). When you do df['salary'], you get a Series. Most DataFrame operations work identically on Series. You can think of a DataFrame as a dictionary of Series sharing the same index.",
              },
              {
                type: "warning",
                title: "SettingWithCopyWarning — the #1 pandas gotcha",
                content: "If you do df2 = df[df['age'] > 30] and then df2['salary'] = 99, you'll get a warning. pandas can't tell if df2 is a copy or a view. Always use .copy() when you want an independent DataFrame: df2 = df[df['age'] > 30].copy()",
              },
            ],

            step3Visual: {
              kind: "architecture",
              title: "Anatomy of a pandas DataFrame",
              caption: "Click any component to understand its role in the DataFrame structure.",
              nodes: [
                { id: "df", label: "DataFrame", sublabel: "df", detail: "The top-level container. Holds columns as Series, shares a single Index across all of them. Created with pd.DataFrame() or pd.read_csv().", x: 45, y: 8, accent: true },
                { id: "index", label: "Index", sublabel: "Row labels", detail: "By default 0, 1, 2… But can be dates, strings, or any hashable. Used by .loc[] to look up rows by label. Set with df.set_index('column_name').", x: 10, y: 35, accent: false },
                { id: "col_name", label: "Column names", sublabel: "df.columns", detail: "A pandas Index of column labels. Access with df.columns. Rename with df.rename(columns={'old': 'new'}).", x: 45, y: 35, accent: false },
                { id: "series", label: "Series (column)", sublabel: "df['col']", detail: "Each column is a pandas Series — a 1D labeled array backed by a NumPy array. Has its own .dtype, .mean(), .value_counts() etc.", x: 78, y: 35, accent: true },
                { id: "ndarray", label: "NumPy ndarray", sublabel: "series.values", detail: "The actual storage: a typed C array. Access with series.values or series.to_numpy(). This is where the speed comes from.", x: 78, y: 65, accent: false },
                { id: "dtypes", label: "dtypes", sublabel: "int64, float64, object", detail: "int64 — integers. float64 — floats. object — strings or mixed. bool — boolean. datetime64 — dates. category — memory-efficient labels.", x: 30, y: 65, accent: false },
                { id: "read_csv", label: "pd.read_csv()", sublabel: "CSV → DataFrame", detail: "The most common DataFrame entry point. Handles delimiters, encodings, date parsing, chunking, and dtype inference automatically.", x: 10, y: 88, accent: false },
                { id: "ops", label: "Operations", sublabel: "filter, group, merge", detail: "The power layer: boolean masking, .groupby(), .merge(), .pivot_table(), .apply(), .sort_values() — all return new DataFrames.", x: 68, y: 88, accent: true },
              ],
              edges: [
                { from: "df", to: "index" },
                { from: "df", to: "col_name" },
                { from: "df", to: "series" },
                { from: "series", to: "ndarray" },
                { from: "series", to: "dtypes" },
                { from: "read_csv", to: "df" },
                { from: "df", to: "ops" },
              ],
            },

            step4WorkedExamples: [
              {
                difficulty: "Very Easy",
                title: "Load a CSV and inspect it",
                scenario: "You've just received a sales dataset. Before doing anything, inspect it.",
                steps: [
                  { code: "import pandas as pd", explanation: "Import pandas with its universal alias 'pd'. This is the first line of virtually every data script." },
                  { code: "df = pd.read_csv('sales.csv')", explanation: "pd.read_csv() reads the file and creates a DataFrame. pandas infers column names from the first row and dtypes from the values." },
                  { code: "print(df.shape)", explanation: ".shape returns (rows, columns). If you see (50000, 12) you immediately know the scale of your dataset." },
                  { code: "print(df.head())", explanation: ".head() shows the first 5 rows. This is always your first look at the data — is it what you expected?" },
                  { code: "print(df.info())", explanation: ".info() is a one-shot audit: column names, non-null counts (missing values if count < total), and dtypes. Look for 'object' dtype on numeric columns — that signals the column loaded as strings and needs fixing." },
                ],
                output: "(1000, 5)\n   order_id   product  quantity  price  date\n0      1001   Widget A         3  29.99  2024-01-05\n1      1002   Widget B         1  49.99  2024-01-06\n...",
              },
              {
                difficulty: "Easy",
                title: "Select and filter rows",
                scenario: "From a customer DataFrame, get the names of all customers over 30.",
                steps: [
                  { code: "import pandas as pd\ndata = {'name': ['Alice','Bob','Carol','Dave'], 'age': [28,34,29,42]}\ndf = pd.DataFrame(data)", explanation: "Quick DataFrame from a dictionary. Two columns: name (str) and age (int)." },
                  { code: "mask = df['age'] > 30", explanation: "df['age'] returns a Series. Applying > 30 to it produces a boolean Series: [False, True, False, True]. This is the mask." },
                  { code: "seniors = df[mask]", explanation: "Passing a boolean Series as an index filters rows. seniors now has 2 rows: Bob (34) and Dave (42)." },
                  { code: "print(seniors['name'].tolist())", explanation: ".tolist() converts the Series to a plain Python list. Useful when you want to pass the names to another function." },
                ],
                output: "['Bob', 'Dave']",
              },
              {
                difficulty: "Medium",
                title: "GroupBy aggregation",
                scenario: "Calculate average salary by department.",
                steps: [
                  { code: "import pandas as pd\ndf = pd.DataFrame({'dept': ['Eng','Eng','HR','HR','Eng'], 'salary': [90,95,60,65,85]})", explanation: "5 employees across two departments." },
                  { code: "result = df.groupby('dept')['salary'].mean()", explanation: "groupby('dept') splits the DataFrame by unique department values. ['salary'] selects just that column. .mean() collapses each group to a single average. This is the split-apply-combine pattern." },
                  { code: "print(result.round(1))", explanation: "result is a Series with 'dept' as the index and average salaries as values." },
                ],
                output: "dept\nEng    90.0\nHR     62.5\nName: salary, dtype: float64",
              },
              {
                difficulty: "Hard",
                title: "Multi-column filter with .loc[]",
                scenario: "Find all premium remote employees: salary > $80k AND remote == True.",
                steps: [
                  { code: "import pandas as pd\ndata = {'name':['Alice','Bob','Carol','Dave','Eve'], 'salary':[72,88,65,105,92], 'remote':[True,False,True,True,True]}\ndf = pd.DataFrame(data)", explanation: "5 employees, salaries in thousands." },
                  { code: "mask = (df['salary'] > 80) & (df['remote'] == True)", explanation: "Two boolean conditions combined with & (bitwise AND — not Python's 'and' keyword). IMPORTANT: each condition must be in parentheses, otherwise operator precedence causes a bug." },
                  { code: "result = df.loc[mask, ['name', 'salary']]", explanation: ".loc[row_mask, column_list] is the most precise way to select: rows matching the mask, only the specified columns." },
                  { code: "print(result.reset_index(drop=True))", explanation: ".reset_index(drop=True) gives clean 0-based index in the output (instead of the original 3, 4)." },
                ],
                output: "    name  salary\n0   Dave     105\n1    Eve      92",
              },
              {
                difficulty: "Industry Example",
                title: "Data analyst's first-look EDA script",
                scenario: "You've just joined a retail company. The analytics lead drops you a CSV of last year's transactions and says: 'Give me a quick summary by category before standup in 20 minutes.'",
                steps: [
                  { code: "import pandas as pd\n\ndf = pd.read_csv('transactions_2024.csv', parse_dates=['date'])", explanation: "parse_dates=['date'] tells pandas to parse the date column as datetime64 instead of strings — enabling date arithmetic and .dt accessor later." },
                  { code: "print(f'Shape: {df.shape}')\nprint(f'Date range: {df.date.min()} to {df.date.max()}')\nprint(f'Missing values:\\n{df.isnull().sum()}')", explanation: "Three lines of code give you shape, date coverage, and a per-column missing value count. This is the standard first 20 seconds of any new dataset." },
                  { code: "summary = (df\n    .groupby('category')['revenue']\n    .agg(['sum','mean','count'])\n    .round(2)\n    .sort_values('sum', ascending=False)\n)", explanation: "Method chaining: group by category, aggregate revenue with three functions at once, round, sort by total revenue descending. This is production-grade pandas style." },
                  { code: "summary.columns = ['Total Revenue', 'Avg Order', 'Transactions']\nprint(summary.head(10))", explanation: "Rename columns for readability before presenting to stakeholders. .head(10) shows top 10 categories." },
                ],
                output: "Shape: (48293, 8)\nDate range: 2024-01-01 to 2024-12-31\nMissing values:\n  category      0\n  revenue      12\n  ...\n\n               Total Revenue  Avg Order  Transactions\ncategory\nElectronics      2450123.45    142.33          17215\nClothing         1832456.78     48.91          37476\n...",
              },
            ],

            step5InlineCoding: {
              language: "python",
              filename: "pandas_practice.py",
              instructions:
                "You've been given a DataFrame of student exam results. Complete the four analysis tasks below.",
              starterCode: `import pandas as pd

data = {
    'student': ['Alice', 'Bob', 'Carol', 'Dave', 'Eve', 'Frank'],
    'math':    [92, 78, 85, 60, 95, 72],
    'science': [88, 82, 79, 55, 91, 68],
    'english': [75, 90, 88, 70, 82, 65],
}
df = pd.DataFrame(data)

# TODO 1: Add a column 'average' = mean of math, science, english per student
df['average'] = ___

# TODO 2: Filter rows where average >= 80, store in high_achievers
high_achievers = ___

# TODO 3: Print the names of high_achievers as a list
print("High achievers:", ___)

# TODO 4: Print the subject with the highest class average
subject_avgs = df[['math', 'science', 'english']].mean()
best_subject = ___
print(f"Best subject: {best_subject}")`,
              solutionCode: `import pandas as pd

data = {
    'student': ['Alice', 'Bob', 'Carol', 'Dave', 'Eve', 'Frank'],
    'math':    [92, 78, 85, 60, 95, 72],
    'science': [88, 82, 79, 55, 91, 68],
    'english': [75, 90, 88, 70, 82, 65],
}
df = pd.DataFrame(data)

df['average'] = df[['math', 'science', 'english']].mean(axis=1)
high_achievers = df[df['average'] >= 80]
print("High achievers:", high_achievers['student'].tolist())
subject_avgs = df[['math', 'science', 'english']].mean()
best_subject = subject_avgs.idxmax()
print(f"Best subject: {best_subject}")`,
              expectedOutput:
                "High achievers: ['Alice', 'Carol', 'Eve']\nBest subject: math",
              hints: [
                "For the average column, select the three subject columns as a DataFrame and call .mean(axis=1). axis=1 means 'average across columns per row'.",
                "For high_achievers, use boolean filtering: df[df['average'] >= 80].",
                "To get names as a list: high_achievers['student'].tolist()",
                "subject_avgs.idxmax() returns the label (column name) of the maximum value in the Series.",
              ],
            },

            step6Exercises: [
              {
                type: "mcq",
                id: "da01_mcq_01",
                difficulty: "Easy",
                question: "What does `df[['name']]` (double brackets) return compared to `df['name']` (single bracket)?",
                options: [
                  "Both return a Series",
                  "Both return a DataFrame",
                  "Double brackets return a DataFrame; single bracket returns a Series",
                  "Single bracket returns a DataFrame; double brackets return a Series",
                ],
                correctIndex: 2,
                explanation: "Single bracket returns a Series (1D). Double brackets pass a list of column names, which always returns a DataFrame, even with just one column.",
              },
              {
                type: "mcq",
                id: "da01_mcq_02",
                difficulty: "Easy",
                question: "Which method gives you the count of missing values per column?",
                options: ["df.count()", "df.isnull().sum()", "df.info()", "df.describe()"],
                correctIndex: 1,
                explanation: "df.isnull() creates a boolean DataFrame (True where NaN). .sum() sums each column — True counts as 1, so you get missing counts per column.",
              },
              {
                type: "mcq",
                id: "da01_mcq_03",
                difficulty: "Medium",
                question: "What is the difference between `.loc[]` and `.iloc[]`?",
                options: [
                  ".loc uses label-based indexing; .iloc uses integer position-based indexing",
                  ".loc uses integer positions; .iloc uses column names",
                  "They are identical",
                  ".loc is faster than .iloc",
                ],
                correctIndex: 0,
                explanation: ".loc['Alice'] looks up by index label. .iloc[0] looks up by integer position. They differ when the index is not the default 0,1,2... range.",
              },
              {
                type: "scenario",
                id: "da01_sc_01",
                difficulty: "Medium",
                scenario: "You have a DataFrame with 500,000 rows. A colleague writes: `result = []` then loops `for i in range(len(df)): result.append(df.iloc[i]['price'] * 1.1)`. It takes 45 seconds.",
                question: "What is the pandas-idiomatic fix?",
                options: [
                  "Use df.iterrows() instead of range(len(df))",
                  "Use df['price'] * 1.1 — a single vectorized operation",
                  "Convert to a NumPy array first, then loop",
                  "Use df.apply(lambda row: row['price'] * 1.1, axis=1)",
                ],
                correctIndex: 1,
                explanation: "df['price'] * 1.1 is vectorized and runs in milliseconds. .iterrows() is still Python-level iteration — barely faster. .apply() is also slow. Always prefer vectorized column operations.",
              },
              {
                type: "coding",
                id: "da01_code_01",
                difficulty: "Hard",
                prompt: "Given the DataFrame below, find the department with the highest total bonus payout. Print just the department name.\n\ndf = pd.DataFrame({'dept':['Eng','HR','Eng','Sales','HR','Sales','Eng'], 'salary':[90,60,95,70,65,80,85], 'bonus_pct':[0.10,0.05,0.12,0.08,0.05,0.09,0.11]})\n\nHint: Calculate bonus = salary * bonus_pct, then groupby dept and sum.",
                starterCode: "import pandas as pd\n\ndf = pd.DataFrame({'dept':['Eng','HR','Eng','Sales','HR','Sales','Eng'], 'salary':[90,60,95,70,65,80,85], 'bonus_pct':[0.10,0.05,0.12,0.08,0.05,0.09,0.11]})\n\n# Your code here\n",
                solutionCode: "import pandas as pd\n\ndf = pd.DataFrame({'dept':['Eng','HR','Eng','Sales','HR','Sales','Eng'], 'salary':[90,60,95,70,65,80,85], 'bonus_pct':[0.10,0.05,0.12,0.08,0.05,0.09,0.11]})\n\ndf['bonus'] = df['salary'] * df['bonus_pct']\ntop_dept = df.groupby('dept')['bonus'].sum().idxmax()\nprint(top_dept)",
                expectedOutput: "Eng",
                tests: [
                  { name: "Correct department", description: "Eng has total bonus: 9+11.4+9.35=29.75, highest of the three" },
                ],
              },
            ],

            interviewQuestions: [
              {
                question: "What is the difference between merge() and join() in pandas?",
                answer: "Both combine DataFrames, but pd.merge() is more powerful and explicit — you specify the key columns and join type (inner, left, right, outer). df.join() is a convenience method that joins on the index by default and is less flexible. For most production code, prefer pd.merge() for clarity.",
              },
            ],
          },
        ],
      },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Flat lookup helpers — used by routing, search, and sidebar ToC     */
/* ------------------------------------------------------------------ */

export function getCourse(slug: string) {
  return curriculum.find((c) => c.slug === slug) ?? null;
}

export function getModule(courseSlug: string, moduleSlug: string) {
  return getCourse(courseSlug)?.modules.find((m) => m.slug === moduleSlug) ?? null;
}

export function getLesson(
  courseSlug: string,
  moduleSlug: string,
  lessonSlug: string,
) {
  return getModule(courseSlug, moduleSlug)?.lessons.find((l) => l.slug === lessonSlug) ?? null;
}

export function allLessons() {
  return curriculum.flatMap((c) => c.modules.flatMap((m) => m.lessons));
}

export function nextLesson(courseSlug: string, moduleSlug: string, lessonSlug: string) {
  const course = getCourse(courseSlug);
  if (!course) return null;
  let found = false;
  for (const mod of course.modules) {
    for (const lesson of mod.lessons) {
      if (found) return { courseSlug, moduleSlug: mod.slug, lessonSlug: lesson.slug, title: lesson.title };
      if (mod.slug === moduleSlug && lesson.slug === lessonSlug) found = true;
    }
  }
  return null;
}
