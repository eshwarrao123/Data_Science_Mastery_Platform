import type { Lesson } from "@/lib/curriculum/types";

export const numpyOperations: Lesson = {
  meta: {
    id: "python.python-ds-tools.numpy-operations",
    slug: "numpy-operations",
    title: "NumPy Operations (Deep Dive)",
    description:
      "Beyond array basics: ufuncs, aggregation along axes, reshape, and the broadcasting rules that let arrays of different shapes compute together.",
    estimatedTime: "40 mins",
    difficulty: "Intermediate",
    xpReward: 80,
    prerequisites: ["python.foundations.lists-vs-numpy-arrays"],
    masteryThreshold: 80,
  },

  blocks: [
    {
      id: "intro",
      type: "lesson-intro",
      tocLabel: "Introduction",
      intro: {
        hook: "matrix - matrix.mean(axis=0) centers every column of a million-row dataset in one line — no loops, no indexing arithmetic. That line only reads as magic until you know two ideas: aggregation along an AXIS, and BROADCASTING. After this lesson, it reads as obvious.",
        what: "The operational core of NumPy: ufuncs (elementwise functions over whole arrays), aggregations (sum/mean/min/max — whole-array or along an axis), reshape (reinterpret the same data in a new shape), and broadcasting (the rules that stretch smaller arrays across bigger ones).",
        why: "Every downstream tool speaks this dialect. pandas columns ARE NumPy-backed arrays; scikit-learn wants (n_samples, n_features) matrices; deep-learning tensors generalize the same axis and broadcasting rules. Master these four ideas once and you've pre-learned the mental model of the entire stack.",
        whereUsed:
          "Feature scaling and centering, per-row/per-column statistics, image manipulation (arrays of pixels), portfolio math, and inside virtually every pandas and scikit-learn call you'll ever make.",
        objectives: [
          "Apply ufuncs elementwise and explain why they beat Python loops",
          "Aggregate along axis=0 (down columns) vs axis=1 (across rows) without guessing",
          "Reshape 1D data into matrices and flatten back — same data, new view",
          "Predict when broadcasting works and what shape results",
          "Combine all four into loop-free data transformations",
        ],
        realWorldApps: [
          {
            company: "OpenAI",
            headline: "Attention is axis math",
            detail:
              "Transformer attention is matrix multiplication plus softmax along a specific axis, with broadcasting handling batches — the exact axis/broadcast semantics NumPy defined, inherited by every tensor library.",
          },
          {
            company: "SpaceX",
            headline: "Telemetry as arrays",
            detail:
              "Vehicle telemetry — thousands of sensor channels sampled over time — is a (time, channel) matrix; per-channel health checks are axis-0 aggregations over exactly this kind of array.",
          },
          {
            company: "Spotify",
            headline: "Normalizing audio features at scale",
            detail:
              "Track features (tempo, energy, danceability) form (n_tracks, n_features) matrices; standardizing them for similarity models is the (X - X.mean(axis=0)) / X.std(axis=0) broadcast — this lesson's centerpiece.",
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
            "You already know arrays vectorize arithmetic: prices * 1.1 multiplies every element in C speed. The machinery behind that is the UFUNC (universal function): np.sqrt, np.exp, np.log, np.abs, np.round — each applies elementwise to a whole array and returns a new array of the same shape. Any mix of ufuncs composes into a formula that runs loop-free: np.sqrt((a - b) ** 2) is a whole-array computation, written like scalar math.",
        },
        {
          type: "code-note",
          code: "import numpy as np\n\nrevenue = np.array([120.0, 80.0, 200.0, 40.0])\nprint(np.log(revenue).round(2))   # [4.79 4.38 5.3  3.69]\nprint(revenue.sum())              # 440.0  (aggregation)\nprint(revenue.mean())             # 110.0\nprint(revenue.max(), revenue.argmax())  # 200.0 2",
          content:
            "Two families with different shapes of output: ufuncs (np.log) return an ARRAY — same shape in, same shape out. Aggregations (.sum, .mean, .max) COLLAPSE the array to fewer values. argmax returns the INDEX of the max — 'which product' rather than 'what value', constantly useful for reporting.",
        },
        {
          type: "keypoint",
          title: "axis: the direction you collapse",
          content:
            "For a 2D array of shape (3, 4) — 3 rows, 4 columns — m.sum() collapses everything to one number. m.sum(axis=0) collapses DOWN the rows, producing one value per column (shape (4,)). m.sum(axis=1) collapses ACROSS the columns, producing one value per row (shape (3,)). The rule that never lies: the axis you name is the axis that DISAPPEARS from the shape. Columns-wise stats → axis=0; row-wise stats → axis=1.",
        },
        {
          type: "code-note",
          code: "sales = np.array([\n    [10, 20, 30],    # store A\n    [40, 50, 60],    # store B\n])                    # shape (2, 3): 2 stores x 3 months\n\nprint(sales.sum(axis=0))   # [50 70 90]  per-month totals (rows collapsed)\nprint(sales.sum(axis=1))   # [60 150]    per-store totals (columns collapsed)\nprint(sales.mean(axis=0))  # [25. 35. 45.]",
          content:
            "Read shape (2, 3) as (rows, columns) = (axis 0, axis 1). axis=0 removes the 2 → result shape (3,): one number per month. axis=1 removes the 3 → shape (2,): one number per store. When unsure, don't guess — check the result's shape against 'which axis vanished'.",
        },
        {
          type: "analogy",
          title: "A spreadsheet with a crush bar",
          content:
            "Picture the 2D array as a spreadsheet and aggregation as a crush bar you roll across it. Roll the bar DOWNWARD (along axis 0) and each column gets crushed into its footer cell — that's axis=0, the per-column summary row. Roll it RIGHTWARD (along axis 1) and each row crushes into a margin cell — axis=1, the per-row totals column. The bar's rolling direction is the axis being consumed; what's left standing is the other axis.",
        },
        {
          type: "keypoint",
          title: "reshape: same data, new geometry",
          content:
            "np.arange(12).reshape(3, 4) reinterprets 12 values as a 3×4 matrix — no copying, just new shape metadata over the same buffer. The element count must match exactly (12 = 3×4; reshape(5, 3) raises ValueError). One dimension may be -1, meaning 'compute it': reshape(4, -1) infers 3. Flatten back with .ravel() or reshape(-1). This is how flat sensor streams and CSV columns become the (samples, features) matrices models expect.",
        },
        {
          type: "keypoint",
          title: "Broadcasting: the shape-stretching rules",
          content:
            "When shapes differ, NumPy aligns them from the RIGHT and compares dimension by dimension: two dimensions are compatible if they're equal, or one of them is 1 (that one gets stretched — virtually, no copying). Missing leading dimensions count as 1. So (3,4) op (4,) works: the (4,) row is applied to every row. (3,4) op (3,1) works: the column stretches rightward. (3,4) op (3,) FAILS: aligned from the right, 4 vs 3 clash — a per-row vector must be reshaped to (3,1) first. Scalars broadcast to everything; that's what prices * 1.1 was all along.",
        },
        {
          type: "code-note",
          code: "X = np.array([[1., 2.], [3., 4.], [5., 6.]])  # (3, 2)\ncol_means = X.mean(axis=0)                     # (2,) -> [3. 4.]\ncentered = X - col_means                        # (3,2) - (2,) broadcasts\nprint(centered.mean(axis=0))                    # [0. 0.]\n\nrow_totals = X.sum(axis=1).reshape(-1, 1)       # (3,) -> (3,1)\nshare = X / row_totals                          # per-row percentages\nprint(share.round(2))",
          content:
            "The two canonical broadcasts of data work: subtracting per-COLUMN stats needs no reshape ((2,) aligns with the trailing 2). Dividing by per-ROW stats needs .reshape(-1, 1) so the vector stands as a column. Getting these two cases into your fingers covers 90% of real broadcasting.",
        },
        {
          type: "warning",
          title: "Where axis and broadcasting bite",
          content:
            "1) axis=0 vs axis=1 swapped — verify by checking the RESULT SHAPE, not by rerunning until it looks right. 2) The (3,4) - (3,) trap: per-row vectors need reshape(-1,1); the error message ('operands could not be broadcast together') tells you both shapes — read it. 3) Broadcasting can succeed when you didn't want it: (4,) + (4,1) silently makes (4,4). If a result is mysteriously bigger than its inputs, an accidental broadcast happened. 4) Integer arrays truncate: np.array([1,2,3]) / 2 is fine (division promotes to float) but assigning floats INTO an int array silently drops decimals. 5) reshape needs exact element counts — the -1 trick computes one dimension only.",
        },
      ],
    },

    {
      id: "diagram",
      type: "interactive-diagram",
      tocLabel: "Visual Learning",
      visual: {
        kind: "architecture",
        title: "Axis 0 vs Axis 1 on a (2, 3) matrix",
        caption:
          "One matrix, two collapse directions, two different answers. Click each node.",
        nodes: [
          {
            id: "matrix",
            label: "[[10,20,30],[40,50,60]]",
            sublabel: "shape (2, 3)",
            detail:
              "2 rows (axis 0) × 3 columns (axis 1). Think (stores, months). Every aggregation question about this data is 'which axis do I crush?'",
            x: 50,
            y: 12,
            accent: true,
          },
          {
            id: "axis0",
            label: "sum(axis=0)",
            sublabel: "collapse rows ↓",
            detail:
              "Rolls down the rows: each COLUMN crushes to one number → [50, 70, 90], shape (3,). The 2 vanished — axis 0 was consumed. Reads as: per-month totals across stores.",
            x: 22,
            y: 45,
            accent: false,
          },
          {
            id: "axis1",
            label: "sum(axis=1)",
            sublabel: "collapse cols →",
            detail:
              "Rolls across the columns: each ROW crushes to one number → [60, 150], shape (2,). The 3 vanished — axis 1 was consumed. Reads as: per-store totals across months.",
            x: 78,
            y: 45,
            accent: false,
          },
          {
            id: "noaxis",
            label: "sum()",
            sublabel: "collapse all",
            detail:
              "No axis argument = collapse everything → 210, a scalar. Grand total. Equivalent to chaining: sum(axis=0).sum().",
            x: 50,
            y: 45,
            accent: false,
          },
          {
            id: "rule",
            label: "the shape rule",
            sublabel: "named axis disappears",
            detail:
              "(2,3) with axis=0 → (3,). (2,3) with axis=1 → (2,). Never memorize 'rows vs columns' by feel — derive it: the axis you name is deleted from the shape tuple. This rule scales unchanged to 3D+ tensors.",
            x: 28,
            y: 80,
            accent: false,
          },
          {
            id: "broadcast",
            label: "then broadcast back",
            sublabel: "(2,3) - axis-stats",
            detail:
              "Aggregate, then subtract/divide: matrix - mean(axis=0) needs no reshape; matrix / sum(axis=1).reshape(-1,1) stands the row-stats up as a column. Aggregation and broadcasting are two halves of one motion: summarize, then apply the summary back.",
            x: 72,
            y: 80,
            accent: false,
          },
        ],
        edges: [
          { from: "matrix", to: "axis0", label: "per column" },
          { from: "matrix", to: "axis1", label: "per row" },
          { from: "matrix", to: "noaxis", label: "grand total" },
          { from: "axis0", to: "rule" },
          { from: "axis1", to: "broadcast" },
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
          title: "Ufuncs compose like scalar math",
          scenario: "Turn a formula into a whole-array computation.",
          steps: [
            {
              code: "import numpy as np\n\ncelsius = np.array([0.0, 25.0, 100.0, -40.0])\nfahrenheit = celsius * 9 / 5 + 32\nprint(fahrenheit)",
              explanation:
                "The formula is written exactly as you would for one number; NumPy applies it to all four at once. Scalars (9, 5, 32) broadcast to every element — the simplest broadcast there is.",
            },
          ],
          output: "[ 32.   77.  212.  -40.]",
        },
        {
          difficulty: "Easy",
          title: "Aggregations and arg-functions",
          scenario: "Summarize daily revenue and locate the best day.",
          steps: [
            {
              code: "import numpy as np\n\nrevenue = np.array([310.0, 480.0, 275.0, 640.0, 390.0])\ndays = np.array(['Mon', 'Tue', 'Wed', 'Thu', 'Fri'])\n\nprint(f'total  {revenue.sum():.0f}')\nprint(f'mean   {revenue.mean():.0f}')\nprint(f'best   {days[revenue.argmax()]} ({revenue.max():.0f})')",
              explanation:
                "sum/mean/max collapse to scalars. argmax returns the winning INDEX (3), which then indexes the parallel days array — the value-to-label pattern that answers 'which one?' in every report.",
            },
          ],
          output: "total  2095\nmean   419\nbest   Thu (640)",
        },
        {
          difficulty: "Medium",
          title: "Axis aggregation on a store × month matrix",
          scenario:
            "Quarterly sales for two stores; leadership wants per-month totals AND per-store totals from the same array.",
          steps: [
            {
              code: "import numpy as np\n\nsales = np.array([\n    [120, 135, 160],   # North\n    [ 90, 110,  95],   # South\n])\nprint(sales.shape)",
              explanation:
                "Shape (2, 3): axis 0 runs over stores, axis 1 over months. Naming what each axis MEANS in a comment is a professional habit — every axis bug starts with forgetting this.",
            },
            {
              code: "per_month = sales.sum(axis=0)\nper_store = sales.sum(axis=1)\nprint(f'per month: {per_month}  shape {per_month.shape}')\nprint(f'per store: {per_store}  shape {per_store.shape}')",
              explanation:
                "axis=0 consumes the store dimension → (3,) monthly totals. axis=1 consumes the month dimension → (2,) store totals. The printed shapes CONFIRM which axis vanished — the self-check that replaces guessing.",
            },
          ],
          output:
            "(2, 3)\nper month: [210 245 255]  shape (3,)\nper store: [415 295]  shape (2,)",
        },
        {
          difficulty: "Hard",
          title: "Standardize features with one broadcast",
          scenario:
            "Three samples × two features on wildly different scales (income vs age). Models need each feature centered at 0 with unit spread — the z-score, computed for the whole matrix at once.",
          steps: [
            {
              code: "import numpy as np\n\nX = np.array([\n    [50000., 25.],\n    [80000., 40.],\n    [62000., 31.],\n])\nmu = X.mean(axis=0)\nsigma = X.std(axis=0)\nprint(mu.round(1), sigma.round(1))",
              explanation:
                "Per-FEATURE statistics live along axis=0 (collapse the samples). mu and sigma have shape (2,) — one value per column. Income's sigma is ~12329, age's ~6.2: the scale gap standardization exists to erase.",
            },
            {
              code: "Z = (X - mu) / sigma\nprint(Z.round(2))\nprint('col means:', Z.mean(axis=0).round(2))\nprint('col stds: ', Z.std(axis=0).round(2))",
              explanation:
                "(3,2) minus (2,) broadcasts the row of means down every sample; the division broadcasts the same way. Verification closes the loop: each column now has mean 0 and std 1. This exact line is what sklearn's StandardScaler does inside.",
            },
          ],
          output:
            "[64000.    32. ] [12328.8     6.2]\n[[-1.14 -1.13]\n [ 1.3   1.29]\n [-0.16 -0.16]]\ncol means: [ 0. -0.]\ncol stds:  [1. 1.]",
        },
        {
          difficulty: "Industry Example",
          title: "Sensor grid: reshape, per-row shares, anomaly flag",
          scenario:
            "A flat stream of 12 hourly readings from 3 machines arrives as one 1D array (machine-major order). Reshape it into (machines, hours), compute each machine's share of total load per hour, and flag machines whose peak reading exceeds 2× their own mean — a miniature monitoring pipeline.",
          steps: [
            {
              code: "import numpy as np\n\nstream = np.array([4., 5., 6., 5.,   3., 3., 2., 4.,   9., 2., 25., 8.])\ngrid = stream.reshape(3, -1)\nprint(grid)",
              explanation:
                "reshape(3, -1) infers 4 hours per machine (12 / 3). Same buffer, new geometry: row = machine, column = hour. The -1 keeps the code correct even if tomorrow's stream has 6 hours.",
            },
            {
              code: "hour_totals = grid.sum(axis=0)\nshare = (grid / hour_totals).round(2)\nprint(share[2])",
              explanation:
                "(3,4) / (4,) broadcasts the hourly totals across all machines — each column now sums to 1. Machine 2's share spikes to 0.76 in hour 2: it drew three quarters of the plant's load.",
            },
            {
              code: "peaks = grid.max(axis=1)\nmeans = grid.mean(axis=1)\nflags = peaks > 2 * means\nfor i, f in enumerate(flags):\n    status = 'ANOMALY' if f else 'ok'\n    print(f'machine {i}: peak {peaks[i]:.0f} mean {means[i]:.1f} -> {status}')",
              explanation:
                "Per-machine stats live along axis=1. The comparison builds a boolean array — the masks from the foundations capstone — and only machine 2 (peak 25 vs mean 11) trips the 2× rule. Reshape → axis stats → broadcast → mask: four ideas, one pipeline, zero loops over data.",
            },
          ],
          output:
            "[[ 4.  5.  6.  5.]\n [ 3.  3.  2.  4.]\n [ 9.  2. 25.  8.]]\n[0.56 0.2  0.76 0.47]\nmachine 0: peak 6 mean 5.0 -> ok\nmachine 1: peak 4 mean 3.0 -> ok\nmachine 2: peak 25 mean 11.0 -> ANOMALY",
        },
      ],
    },

    {
      id: "inline-practice",
      type: "inline-code",
      tocLabel: "Practice Coding",
      coding: {
        language: "python",
        filename: "class_grades.py",
        instructions:
          "A 1D array holds 12 exam scores from 4 students × 3 subjects (student-major). Reshape to (4, 3); print each student's mean (axis=1, rounded to 1 decimal); print each subject's max (axis=0); then center the matrix by subtracting the per-subject means (axis=0 broadcast) and print the centered matrix rounded to 1 decimal.",
        starterCode: `import numpy as np

scores = np.array([70., 80., 90., 60., 75., 85., 95., 65., 70., 80., 90., 100.])

# TODO 1: reshape to (4 students, 3 subjects)
grid = ___

# TODO 2: per-student means (which axis collapses?)
print(___)

# TODO 3: per-subject maxima
print(___)

# TODO 4: subtract per-subject means and print, rounded to 1 decimal
centered = ___
print(centered)`,
        solutionCode: `import numpy as np

scores = np.array([70., 80., 90., 60., 75., 85., 95., 65., 70., 80., 90., 100.])

grid = scores.reshape(4, 3)

print(grid.mean(axis=1).round(1))

print(grid.max(axis=0))

centered = (grid - grid.mean(axis=0)).round(1)
print(centered)`,
        expectedOutput:
          "[80.  73.3 76.7 90. ]\n[ 95.  90. 100.]\n[[-6.2  1.2  3.8]\n [-16.2  -3.8  -1.2]\n [ 18.8 -13.8 -16.2]\n [  3.8  16.2  13.8]]",
        hints: [
          "reshape(4, 3) or reshape(4, -1) — 12 elements must fit exactly",
          "Per-student = one number per row = collapse the subjects = axis=1",
          "Per-subject = one number per column = collapse the students = axis=0",
          "grid - grid.mean(axis=0) broadcasts (4,3) - (3,) with no reshape needed",
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
          id: "py33_mcq_01",
          difficulty: "Easy",
          question: "For m with shape (5, 3), what shape is m.sum(axis=0)?",
          options: ["(5,)", "(3,)", "(5, 3)", "a scalar"],
          correctIndex: 1,
          explanation:
            "The named axis disappears: axis 0 (the 5) is consumed, leaving (3,) — one sum per column. m.sum(axis=1) would give (5,).",
        },
        {
          type: "mcq",
          id: "py33_mcq_02",
          difficulty: "Easy",
          question: "What distinguishes a ufunc like np.sqrt from an aggregation like .mean()?",
          options: [
            "Ufuncs are faster",
            "Ufuncs work elementwise and return an array of the same shape; aggregations collapse the array to fewer values",
            "Aggregations only work on 1D arrays",
            "Nothing — they're synonyms",
          ],
          correctIndex: 1,
          explanation:
            "Same-shape-out vs collapsed-out is the fundamental split: np.sqrt(a) transforms every element; a.mean() summarizes them. Pipelines alternate between the two: transform, then summarize, then apply back.",
        },
        {
          type: "mcq",
          id: "py33_mcq_03",
          difficulty: "Medium",
          question: "Which operation FAILS to broadcast?",
          options: [
            "(3, 4) + scalar",
            "(3, 4) + (4,)",
            "(3, 4) + (3, 1)",
            "(3, 4) + (3,)",
          ],
          correctIndex: 3,
          explanation:
            "Align from the right: (3,4) vs (3,) compares 4 to 3 — unequal and neither is 1, so it fails. A per-row vector must stand up as a column first: reshape(-1, 1) makes it (3,1), which stretches across.",
        },
        {
          type: "scenario",
          id: "py33_sc_01",
          difficulty: "Medium",
          scenario:
            "A junior analyst computes per-student averages from a (students, subjects) matrix with grades.mean(axis=0) and reports values that look like subject difficulty, not student performance. The code runs without error.",
          question: "What went wrong, and what's the reliable self-check?",
          options: [
            "The data is corrupted",
            "Wrong axis: axis=0 collapses students, yielding per-SUBJECT means; per-student needs axis=1. The check: the result's shape should equal (n_students,) — verifying which dimension vanished catches this before the numbers ship",
            "mean() can't be used on 2D arrays",
            "They needed reshape first",
          ],
          correctIndex: 1,
          explanation:
            "Axis mistakes run cleanly and produce plausible-looking wrong numbers — the most dangerous bug class. Shape verification ('did the axis I meant to consume actually vanish?') is mechanical and catches it every time.",
        },
        {
          type: "coding",
          id: "py33_code_01",
          difficulty: "Medium",
          prompt:
            "Given m = np.array([[2., 4., 6.], [1., 3., 5.]]), print its per-column means (axis=0), its per-row maxima (axis=1), and its grand total. Expected:\n[1.5 3.5 5.5]\n[6. 5.]\n21.0",
          starterCode:
            "import numpy as np\nm = np.array([[2., 4., 6.], [1., 3., 5.]])\n# Your code here\n",
          solutionCode:
            "import numpy as np\nm = np.array([[2., 4., 6.], [1., 3., 5.]])\nprint(m.mean(axis=0))\nprint(m.max(axis=1))\nprint(m.sum())",
          expectedOutput: "[1.5 3.5 5.5]\n[6. 5.]\n21.0",
          tests: [
            {
              name: "Axis selection",
              description: "Uses axis=0 for column means and axis=1 for row maxima",
            },
            {
              name: "Grand total",
              description: "sum() with no axis collapses to a scalar",
            },
          ],
        },
        {
          type: "mcq",
          id: "py33_mcq_04",
          difficulty: "Hard",
          question:
            "row_sums = X.sum(axis=1) for X of shape (3, 4). Why does X / row_sums raise a broadcast error, and what's the fix?",
          options: [
            "sum(axis=1) is invalid; use axis=0",
            "row_sums has shape (3,); right-aligned against (3,4) it compares 3 to 4 and fails. Fix: X / row_sums.reshape(-1, 1) so the (3,1) column stretches across the 4 columns",
            "Division doesn't broadcast; use np.divide",
            "X must be flattened first",
          ],
          correctIndex: 1,
          explanation:
            "The single most common broadcasting error in practice. Per-COLUMN stats ((4,)) apply directly; per-ROW stats ((3,)) must be reshaped to (3,1). keepdims=True on the sum is the equivalent inline fix.",
        },
        {
          type: "coding",
          id: "py33_code_02",
          difficulty: "Hard",
          prompt:
            "flat = np.arange(1., 7.) holds 6 readings from 2 sensors × 3 hours. Reshape to (2, 3), convert each reading to its percentage of that SENSOR's total (per-row, rounded to 1 decimal), and print the result. Expected:\n[[16.7 33.3 50. ]\n [26.7 33.3 40. ]]",
          starterCode:
            "import numpy as np\nflat = np.arange(1., 7.)\n# Your code here\n",
          solutionCode:
            "import numpy as np\nflat = np.arange(1., 7.)\ngrid = flat.reshape(2, 3)\npct = (grid / grid.sum(axis=1).reshape(-1, 1) * 100).round(1)\nprint(pct)",
          expectedOutput: "[[16.7 33.3 50. ]\n [26.7 33.3 40. ]]",
          tests: [
            {
              name: "Reshape",
              description: "Reinterprets the flat array as (2, 3)",
            },
            {
              name: "Row-wise broadcast",
              description: "Divides by axis=1 sums reshaped to a (2,1) column",
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
          question:
            "Explain NumPy broadcasting: the rules, why it exists, and one place it silently produces wrong results.",
          answer:
            "Broadcasting lets arrays of different shapes combine without copying. The rules: align the shapes from the RIGHT, then compare dimension by dimension — compatible if equal or if either is 1; a missing leading dimension counts as 1; every 1 (or absent) dimension is virtually stretched to match. So (3,4)+(4,) applies a row vector to every row; (3,4)+(3,1) stretches a column rightward; (3,4)+(3,) fails because right-aligned it compares 4 with 3. It exists for expressiveness AND efficiency: X - X.mean(axis=0) states the intent in one line, and the stretch is virtual — no (3,4) copy of the means is materialized, the loop happens in C. The silent-failure case: broadcasting can SUCCEED when you wanted alignment. (4,)+(4,1) yields a (4,4) outer-product-shaped result instead of an elementwise (4,) — no error, plausible numbers, wrong computation. Defensive habits: assert or print result shapes at pipeline boundaries, and when a result is mysteriously higher-dimensional than its inputs, hunt for the accidental broadcast. The same rules govern pandas alignment and every tensor framework, so this answer transfers wholesale.",
        },
        {
          question:
            "You have a (n_samples, n_features) matrix. Standardize it without loops and explain every shape involved.",
          answer:
            "Z = (X - X.mean(axis=0)) / X.std(axis=0). Shapes: X is (n, f). mean(axis=0) collapses axis 0 — the samples — leaving (f,): one mean per feature; std(axis=0) likewise (f,). The subtraction broadcasts (n,f) - (f,): right-aligned, f matches f, and the missing leading dimension of the stats vector is treated as 1 and stretched over n samples — every row gets the same per-feature means subtracted. Division broadcasts identically. Result Z is (n,f) with each COLUMN mean 0 and std 1, verifiable with Z.mean(axis=0) and Z.std(axis=0). Two follow-ups worth volunteering: first, the axis choice is the whole ballgame — axis=1 would standardize each SAMPLE across its features, a different (usually wrong) operation that runs without error; second, in a real ML pipeline you compute mu and sigma on TRAINING data only and reuse them to transform test data — computing them on the full matrix leaks test information into preprocessing, which is exactly why sklearn separates fit from transform.",
        },
        {
          question:
            "When does reshape fail, what does -1 do, and how is reshaping (12,) → (3,4) different from transposing a (4,3)?",
          answer:
            "reshape requires the element count to be preserved: 12 values reshape to (3,4), (2,6), (12,1) — but reshape(5,3) raises ValueError because 15 ≠ 12. One dimension may be -1, meaning 'solve for this': reshape(3,-1) computes 4; only one -1 is allowed since two unknowns have no unique solution. The reshape-vs-transpose distinction is about ORDER: reshape refills the new geometry in the same flat reading order (row-major — left to right, top to bottom), so (12,)→(3,4) lays elements 0-3 in row 0. Transpose (.T) MOVES data relationships: rows become columns. Concretely, arange(6).reshape(2,3) is [[0,1,2],[3,4,5]] but arange(6).reshape(3,2).T is [[0,2,4],[1,3,5]] — same shape (2,3), different arrangement. Choosing wrong scrambles which value belongs to which sample or feature while producing a perfectly valid array — another runs-clean-but-wrong class. Also worth knowing: reshape returns a VIEW when possible (no copy — mutations show through), and the practical rule for data work is to reshape at ingestion into (samples, features) once, then let axis semantics do the rest.",
        },
      ],
    },

    {
      id: "common-mistakes",
      type: "callout",
      variant: "warning",
      title: "Common Mistakes to Avoid",
      content:
        "1) Guessing axis and rerunning until it 'looks right' — derive it: the named axis vanishes from the shape. 2) X / X.sum(axis=1) on a 2D array — per-row stats need reshape(-1,1) (or keepdims=True). 3) Accidental (n,1) vs (n,) mixes creating (n,n) results — check ndim when outputs balloon. 4) reshape counts that don't multiply out — use -1 for the computed dimension. 5) Confusing reshape with transpose — refill order vs axis swap. 6) Assigning floats into int arrays — silent truncation; create arrays with dtype=float when in doubt. 7) Treating runs-without-error as correct — axis bugs produce plausible wrong numbers; verify shapes and spot-check one value by hand.",
    },

    {
      id: "ai-tutor",
      type: "callout",
      variant: "tip",
      title: "Ask the AI Tutor",
      content:
        "Try these prompts in the AI Tutor panel: • 'Drill me: give shapes and an axis, I predict the result shape, until I'm 10 for 10.' • 'Show me the (3,4) vs (3,) broadcast failure and both fixes.' • 'Walk through what (X - X.mean(axis=0)) / X.std(axis=0) does shape by shape.' • 'Give me a flat array scenario and make me choose reshape vs transpose.' • 'Interview mode: ask me the broadcasting question and grade my answer.'",
    },

    {
      id: "glossary",
      type: "callout",
      variant: "info",
      title: "Glossary",
      content:
        "ufunc — a universal function applied elementwise (np.sqrt, np.exp); same shape out. aggregation — a collapsing summary (sum/mean/max/std). axis — the dimension an operation runs along; the named axis disappears from the result shape. axis=0 — down the rows (per-column results); axis=1 — across the columns (per-row results). argmax/argmin — index of the extreme, not its value. reshape — reinterpret the same data in a new shape (element count preserved; -1 = computed). ravel — flatten to 1D. broadcasting — the right-aligned shape-stretching rules (equal or 1 per dimension). keepdims — keep the collapsed axis as size 1 for clean broadcasting back. view — a reshaped/sliced array sharing the original's memory.",
    },

    {
      id: "resources",
      type: "callout",
      variant: "info",
      title: "Recommended Resources",
      content:
        "• Docs: the NumPy user guide's 'Broadcasting' page — its diagrams make the right-alignment rule visual. • Read: 'NumPy: the absolute basics for beginners' sections on reshaping and aggregation for a second pass in different words. • Practice: take any 2D dataset you have, and compute per-row and per-column versions of sum/mean/max — verifying every shape before printing values. • Next in DSM: numbers mastered, time enters the picture — Dates & Times with datetime covers parsing timestamps, date arithmetic, and the formatting mini-language every log file demands.",
    },

    {
      id: "recap",
      type: "recap",
      tocLabel: "Recap",
      content:
        "✓ Ufuncs (sqrt, log, round) transform elementwise — same shape out; aggregations (sum, mean, max) collapse.\n✓ The named axis DISAPPEARS: (2,3).sum(axis=0) → (3,); axis=1 → (2,). Verify shapes, never guess.\n✓ argmax gives the index — pair it with a labels array for 'which one?' answers.\n✓ reshape re-geometries the same data (counts must match; -1 computes one dim); transpose rearranges relationships.\n✓ Broadcasting aligns shapes from the right — equal or 1 stretches; per-column stats apply directly, per-row stats need reshape(-1,1).\n✓ Aggregate → broadcast back is the standardization motion: (X - X.mean(axis=0)) / X.std(axis=0).\n\nNext up: Dates & Times with datetime. Arrays handle the numbers; now the other axis of every dataset — time: parsing timestamps, timedeltas, formatting, and the timezone traps.",
    },
  ],
};
