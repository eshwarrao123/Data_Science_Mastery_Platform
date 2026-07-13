import type { Lesson } from "@/lib/curriculum/types";

export const listsVsNumpyArrays: Lesson = {
  meta: {
    id: "python.foundations.lists-vs-numpy-arrays",
    slug: "lists-vs-numpy-arrays",
    title: "Python Lists vs. NumPy Arrays",
    description:
      "Master the difference between Python lists and NumPy arrays, and learn when vectorized operations replace slow Python loops.",
    estimatedTime: "35 mins",
    difficulty: "Beginner",
    xpReward: 60,
    prerequisites: ["python.foundations.variables-and-data-types"],
    masteryThreshold: 80,
  },

  blocks: [
    {
      id: "intro",
      type: "lesson-intro",
      tocLabel: "Introduction",
      intro: {
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
    },

    {
      id: "theory",
      type: "theory-blocks",
      tocLabel: "Theory",
      blocks: [
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
    },

    {
      id: "diagram",
      type: "interactive-diagram",
      tocLabel: "Visual Learning",
      visual: {
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
    },

    {
      id: "worked-examples",
      type: "worked-examples",
      tocLabel: "Worked Examples",
      examples: [
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
    },

    {
      id: "inline-practice",
      type: "inline-code",
      tocLabel: "Practice Coding",
      coding: {
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
    },

    {
      id: "exercises",
      type: "mastery-assessment",
      tocLabel: "Exercises",
      masteryThreshold: 80,
      exercises: [
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
    },

    {
      id: "interview-questions",
      type: "interview-questions",
      tocLabel: "Interview Prep",
      questions: [
        {
          question: "Explain broadcasting in NumPy. Give an example.",
          answer: "Broadcasting is NumPy's rule for performing arithmetic on arrays of different shapes without copying data. When shapes are compatible (trailing dimensions match or are 1), NumPy stretches the smaller array conceptually. Example: np.array([[1,2,3],[4,5,6]]) + np.array([10,20,30]) — the 1D array is broadcast across both rows, giving [[11,22,33],[14,25,36]].",
        },
      ],
    },
  ],
};
