import type { Lesson } from "@/lib/curriculum/types";

export const classesAndObjects: Lesson = {
  meta: {
    id: "python.oop.classes-and-objects",
    slug: "classes-and-objects",
    title: "Classes & Objects",
    description:
      "Define your own types — bundle data with the functions that operate on it, and understand what df = pd.DataFrame(...) has been doing all along.",
    estimatedTime: "30 mins",
    difficulty: "Intermediate",
    xpReward: 60,
    prerequisites: ["python.data-structures.choosing-the-right-structure"],
    masteryThreshold: 80,
  },

  blocks: [
    {
      id: "intro",
      type: "lesson-intro",
      tocLabel: "Introduction",
      intro: {
        hook: "You've been using objects since day one: 'hello'.upper(), my_list.append(), and soon df.groupby(). Every one is DATA carrying its own BEHAVIOR. Today you stop just using such types and start defining them — because some state you've been threading through function after function deserves a home of its own.",
        what: "A class is a blueprint for a new type: what data its instances hold (attributes) and what they can do (methods). An object is one instance built from that blueprint. __init__ sets up each new instance; self is how methods reach the instance they belong to.",
        why: "When several functions all take the same bundle of state (account, balance, history...), the design is begging for a class. And every data science library is classes: DataFrame, LinearRegression, Figure — defining your own makes their APIs transparent instead of magical.",
        whereUsed:
          "Modeling domain entities (accounts, sensors, experiments), pipeline components, sklearn-style estimators, and reading ANY library's source code.",
        objectives: [
          "Define a class with __init__ and create instances",
          "Explain self and how method calls bind to instances",
          "Distinguish class (blueprint) from object (instance)",
          "Decide when a class beats dicts + functions",
          "Recognize the class machinery inside pandas/sklearn calls",
        ],
        realWorldApps: [
          {
            company: "scikit-learn",
            headline: "Every model is a class",
            detail:
              "LinearRegression() constructs an instance; .fit() mutates its state (learned coefficients); .predict() uses that state. The whole estimator API is this lesson.",
          },
          {
            company: "pandas",
            headline: "DataFrame is a class",
            detail:
              "pd.DataFrame(data) calls a constructor; df.shape reads an attribute; df.groupby() calls a method. Three syntaxes you'll now recognize as one mechanism.",
          },
          {
            company: "Airbnb",
            headline: "Domain objects in pipelines",
            detail:
              "Pricing pipelines model a Listing as a class — attributes for location and amenities, methods for fee calculation — so business rules live WITH the data they govern.",
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
            "Syntax: `class BankAccount:` opens the blueprint (CapWords naming — classes are the one place Python doesn't use snake_case). Inside, def __init__(self, owner, balance) is the initializer: it runs automatically whenever you create an instance with BankAccount('Ada', 100.0), and its job is to attach the instance's starting data via self.owner = owner.",
        },
        {
          type: "code-note",
          code: "class BankAccount:\n    def __init__(self, owner, balance):\n        self.owner = owner\n        self.balance = balance\n\nacct = BankAccount('Ada', 100.0)\nprint(acct.owner)    # Ada\nprint(acct.balance)  # 100.0",
          content:
            "Calling the CLASS like a function builds an instance: Python creates a blank object, passes it to __init__ as self, your assignments attach the data, and the finished object comes back. acct.owner reads an attribute with dot notation — like a dict field, but with a fixed, documented shape.",
        },
        {
          type: "analogy",
          title: "Blueprint and houses",
          content:
            "A class is an architect's blueprint; objects are the houses built from it. One blueprint, many houses — each with its own address, paint color, and furniture (attribute VALUES differ), all sharing the same layout (the same attributes and methods EXIST). Renovating one house doesn't touch the others — but changing the blueprint changes every house built after. And 'self' is just the builder's phrase for 'THIS house, the one we're standing in'.",
        },
        {
          type: "keypoint",
          title: "self: the instance, passed automatically",
          content:
            "Every method's first parameter is self — the instance the method was called ON. acct.deposit(50) is sugar for BankAccount.deposit(acct, 50): Python passes acct as self for you. That's the entire mystery. Inside the method, self.balance is 'THIS account's balance' — which is how two accounts keep separate balances while sharing one method definition.",
        },
        {
          type: "code-note",
          code: "class BankAccount:\n    def __init__(self, owner, balance):\n        self.owner = owner\n        self.balance = balance\n\n    def deposit(self, amount):\n        self.balance += amount\n\na = BankAccount('Ada', 100.0)\nb = BankAccount('Kai', 50.0)\na.deposit(25.0)\nprint(a.balance, b.balance)  # 125.0 50.0",
          content:
            "One deposit method, two independent balances — self routes each call to the right instance's data. This is the closure-counter from Scope & Closures with an explicit, inspectable home for its state.",
        },
        {
          type: "keypoint",
          title: "When a class earns its keep",
          content:
            "Reach for a class when: several functions all pass around the same bundle of state; the state must stay CONSISTENT under defined operations (a balance only changes via deposit/withdraw); or you're building many instances of one shape with behavior. Stick with dicts + functions when it's pure data passing through transformations — most ETL rows never need to be objects. The smell that demands a class: def deposit(account_dict, amount), def withdraw(account_dict, amount)... every function taking the same first argument.",
        },
        {
          type: "expandable",
          title: "type() has been telling you this all along",
          content:
            "type('hi') says str, type([1]) says list — every value you've touched is an instance of some class; 'hi'.upper() is a method call with 'hi' as self. Your classes join the same system: type(acct) is BankAccount, and isinstance(acct, BankAccount) is True. Defining a class doesn't add magic to Python — it lets you participate in the machinery that was always there.",
        },
        {
          type: "warning",
          title: "Three rookie mechanics",
          content:
            "1) Forgetting self in a method signature — 'takes 1 positional argument but 2 were given' means Python passed the instance and your def had no slot for it. 2) Writing balance instead of self.balance inside a method — that's a local variable that vanishes when the method returns (the Scope lesson, striking again). 3) BankAccount() vs BankAccount — with parentheses you get an INSTANCE; without, the class object itself (the function-reference distinction, one level up).",
        },
      ],
    },

    {
      id: "diagram",
      type: "interactive-diagram",
      tocLabel: "Visual Learning",
      visual: {
        kind: "flow",
        title: "What acct = BankAccount('Ada', 100.0) actually does",
        caption: "Construction, step by step. Click each stage.",
        nodes: [
          {
            id: "call",
            label: "BankAccount('Ada', 100.0)",
            sublabel: "call the class",
            detail:
              "Calling a class like a function starts construction. The arguments are destined for __init__ — the class name IS the constructor's public face.",
            x: 10,
            y: 40,
            accent: false,
          },
          {
            id: "blank",
            label: "blank instance",
            sublabel: "Python allocates",
            detail:
              "Python creates an empty BankAccount object — no attributes yet. This blank object is what gets passed to __init__ as self.",
            x: 34,
            y: 40,
            accent: false,
          },
          {
            id: "init",
            label: "__init__(self, 'Ada', 100.0)",
            sublabel: "your setup runs",
            detail:
              "self is the blank instance; your assignments (self.owner = owner) attach data to it. When __init__ ends, the instance is fully furnished. Note: __init__ returns nothing — it decorates the object it was given.",
            x: 60,
            y: 40,
            accent: true,
          },
          {
            id: "bound",
            label: "acct → instance",
            sublabel: "name binds",
            detail:
              "The finished instance is returned by the class call, and acct now points at it — the same name-on-a-whiteboard binding as every assignment since lesson one.",
            x: 86,
            y: 40,
            accent: false,
          },
          {
            id: "method",
            label: "acct.deposit(25)",
            sublabel: "later: a method call",
            detail:
              "Dot-lookup finds deposit on the class; Python calls it with acct as self. One method definition serves every instance — self is what makes each call personal.",
            x: 60,
            y: 78,
            accent: false,
          },
        ],
        edges: [
          { from: "call", to: "blank" },
          { from: "blank", to: "init", label: "as self" },
          { from: "init", to: "bound", label: "instance out" },
          { from: "bound", to: "method", label: "use it" },
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
          title: "A minimal class",
          scenario: "Model a temperature sensor with an ID and a unit.",
          steps: [
            {
              code: "class Sensor:\n    def __init__(self, sensor_id, unit):\n        self.sensor_id = sensor_id\n        self.unit = unit\n\ns = Sensor('T-101', 'celsius')\nprint(s.sensor_id, s.unit)",
              explanation:
                "The full lifecycle in six lines: blueprint, construction, attribute access. Note __init__'s parameters become the constructor's signature.",
            },
          ],
          output: "T-101 celsius",
        },
        {
          difficulty: "Easy",
          title: "Methods use self",
          scenario: "Give the sensor behavior: record a reading and report.",
          steps: [
            {
              code: "class Sensor:\n    def __init__(self, sensor_id):\n        self.sensor_id = sensor_id\n        self.readings = []\n\n    def record(self, value):\n        self.readings.append(value)\n\n    def average(self):\n        return sum(self.readings) / len(self.readings)",
              explanation:
                "__init__ gives every sensor its OWN empty readings list (this is why mutable defaults were dangerous for functions — here each instance builds a fresh list). record mutates self's state; average computes from it.",
            },
            {
              code: "s = Sensor('T-101')\ns.record(21.5)\ns.record(23.1)\nprint(f'{s.sensor_id}: {s.average():.1f}')",
              explanation:
                "Each call passes s as self automatically. The state (readings) and the behavior (record/average) travel together — no more threading a list through loose functions.",
            },
          ],
          output: "T-101: 22.3",
        },
        {
          difficulty: "Medium",
          title: "Many instances, independent state",
          scenario: "Track three delivery drivers' completed jobs in a dispatch system.",
          steps: [
            {
              code: "class Driver:\n    def __init__(self, name):\n        self.name = name\n        self.jobs = 0\n        self.km = 0.0\n\n    def complete(self, distance_km):\n        self.jobs += 1\n        self.km += distance_km",
              explanation:
                "The blueprint: two counters per driver, one operation that keeps them consistent (a job always updates both — that invariant is WHY this is a class, not two dicts).",
            },
            {
              code: "drivers = [Driver('ada'), Driver('kai'), Driver('mia')]\ndrivers[0].complete(12.5)\ndrivers[1].complete(8.0)\ndrivers[0].complete(4.5)",
              explanation:
                "Objects go in lists like any value. Each .complete() call updates only ITS instance — ada has 2 jobs, kai 1, mia 0.",
            },
            {
              code: "busiest = max(drivers, key=lambda d: d.jobs)\nprint(f'{busiest.name}: {busiest.jobs} jobs, {busiest.km} km')",
              explanation:
                "max with a key over objects — the lambda reads an ATTRIBUTE instead of an index. All your data-structure skills apply unchanged to objects.",
            },
          ],
          output: "ada: 2 jobs, 17.0 km",
        },
        {
          difficulty: "Hard",
          title: "Refactor: dict + loose functions → a class",
          scenario:
            "The before/after that motivates OOP: an experiment tracker that outgrew its dict.",
          steps: [
            {
              code: "# BEFORE: same dict threaded through every function\n# def add_result(exp, score): exp['scores'].append(score)\n# def best(exp): return max(exp['scores'])\n# def summary(exp): ...\n# Nothing stops exp['scores'] = 'oops' from anywhere.",
              explanation:
                "The smell: every function takes exp as its first argument, and the dict's shape is enforced by hope. (Shown as comments — the 'after' replaces it.)",
            },
            {
              code: "class Experiment:\n    def __init__(self, name):\n        self.name = name\n        self.scores = []\n\n    def add_result(self, score):\n        self.scores.append(score)\n\n    def best(self):\n        return max(self.scores) if self.scores else None\n\n    def summary(self):\n        n = len(self.scores)\n        return f'{self.name}: {n} runs, best={self.best()}'",
              explanation:
                "Same logic, but now the state and its operations are one unit: constructing an Experiment GUARANTEES scores starts as a list, best() guards emptiness once for every caller, and methods can build on each other (summary calls best).",
            },
            {
              code: "exp = Experiment('lr-tuning')\nexp.add_result(0.81)\nexp.add_result(0.87)\nexp.add_result(0.84)\nprint(exp.summary())",
              explanation:
                "Call sites read as sentences about the domain. This exact shape — construct, feed data via methods, query state — is sklearn's fit/predict pattern in miniature.",
            },
          ],
          output: "lr-tuning: 3 runs, best=0.87",
        },
        {
          difficulty: "Industry Example",
          title: "A pipeline stage as a class (the sklearn shape)",
          scenario:
            "A data engineer builds a reusable scaler: learn parameters from training data (fit), apply them to any data (transform) — the two-phase pattern every sklearn component follows.",
          steps: [
            {
              code: "class MinMaxScaler:\n    \"\"\"Scale values to [0, 1] using bounds learned from data.\"\"\"\n    def __init__(self):\n        self.min_val = None\n        self.max_val = None\n\n    def fit(self, values):\n        self.min_val = min(values)\n        self.max_val = max(values)\n        return self",
              explanation:
                "__init__ starts the instance 'unfitted' (None sentinels — the value-or-None contract). fit LEARNS state from data and stores it on self. Returning self enables chaining: scaler.fit(data).transform(data).",
            },
            {
              code: "    def transform(self, values):\n        span = self.max_val - self.min_val\n        return [(v - self.min_val) / span for v in values]",
              explanation:
                "transform USES the learned state — critically, it can scale NEW data with the TRAINING data's bounds, which is the whole point: test data must never teach the scaler its parameters (a preview of data leakage, a core ML discipline).",
            },
            {
              code: "train = [10.0, 50.0, 30.0]\ntest = [20.0, 40.0]\nscaler = MinMaxScaler().fit(train)\nprint(scaler.transform(train))\nprint(scaler.transform(test))",
              explanation:
                "Fit once on train, transform both. When you meet sklearn's real MinMaxScaler in the ML course, you will already know its anatomy: __init__ (config), fit (learn state), transform (apply state). Classes are how libraries package that lifecycle.",
            },
          ],
          output: "[0.0, 1.0, 0.5]\n[0.25, 0.75]",
        },
      ],
    },

    {
      id: "inline-practice",
      type: "inline-code",
      tocLabel: "Practice Coding",
      coding: {
        language: "python",
        filename: "playlist.py",
        instructions:
          "Build a Playlist class: __init__ takes a name and starts an empty track list; add(title, minutes) appends a (title, minutes) tuple; total_minutes() returns the summed duration; describe() returns '<name>: <n> tracks, <total> min'. Create one playlist, add three tracks, print describe().",
        starterCode: `# TODO: define the Playlist class with __init__, add, total_minutes, describe
___

pl = Playlist('Focus')
pl.add('Deep Flow', 6.5)
pl.add('Stillness', 4.0)
pl.add('Tempo Up', 3.5)
print(pl.describe())`,
        solutionCode: `class Playlist:
    def __init__(self, name):
        self.name = name
        self.tracks = []

    def add(self, title, minutes):
        self.tracks.append((title, minutes))

    def total_minutes(self):
        return sum([m for _, m in self.tracks])

    def describe(self):
        return f"{self.name}: {len(self.tracks)} tracks, {self.total_minutes()} min"

pl = Playlist('Focus')
pl.add('Deep Flow', 6.5)
pl.add('Stillness', 4.0)
pl.add('Tempo Up', 3.5)
print(pl.describe())`,
        expectedOutput: "Focus: 3 tracks, 14.0 min",
        hints: [
          "__init__(self, name) sets self.name = name and self.tracks = []",
          "add appends the tuple (title, minutes) to self.tracks",
          "total_minutes sums the second element of each tuple: sum([m for _, m in self.tracks])",
          "describe is an f-string calling self.total_minutes() — methods can use other methods",
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
          id: "py23_mcq_01",
          difficulty: "Easy",
          question: "What is the relationship between a class and an object?",
          options: [
            "They're synonyms",
            "A class is the blueprint; an object is one instance built from it",
            "Objects contain classes",
            "Classes are for data, objects are for functions",
          ],
          correctIndex: 1,
          explanation:
            "One class, many instances — each with its own attribute values, all sharing the class's method definitions. type(obj) names the blueprint an object came from.",
        },
        {
          type: "mcq",
          id: "py23_mcq_02",
          difficulty: "Easy",
          question: "In acct.deposit(50), what does the method receive as self?",
          options: [
            "The BankAccount class",
            "50",
            "The acct instance — Python passes it automatically",
            "Nothing; self must be passed explicitly",
          ],
          correctIndex: 2,
          explanation:
            "acct.deposit(50) is sugar for BankAccount.deposit(acct, 50). The instance before the dot becomes self — that's the entire mechanism.",
        },
        {
          type: "mcq",
          id: "py23_mcq_03",
          difficulty: "Medium",
          question:
            "Inside a method you write `count = count + 1` intending to update the instance's counter, and get UnboundLocalError. Why?",
          options: [
            "Methods can't do arithmetic",
            "count without self. is a plain local variable — the instance attribute is self.count",
            "The counter must be initialized in the method",
            "Python requires nonlocal in methods",
          ],
          correctIndex: 1,
          explanation:
            "Attributes live on the instance and are reached through self; bare names follow ordinary LEGB scoping. self.count += 1 updates the object; count += 1 tries to update a local that doesn't exist.",
        },
        {
          type: "scenario",
          id: "py23_sc_01",
          difficulty: "Medium",
          scenario:
            "A module has grown: def open_ticket(t, ...), def assign(t, agent), def escalate(t), def close(t) — every function takes the same ticket dict, and a recent bug came from a function setting t['status'] to a typo'd value.",
          question: "What does this design want to become?",
          options: [
            "A longer dict with more keys",
            "A Ticket class: the shared state becomes attributes, the functions become methods, and status changes go through methods that enforce valid values",
            "A tuple, for immutability",
            "Global variables for the shared state",
          ],
          correctIndex: 1,
          explanation:
            "Same-first-argument-everywhere is THE class smell. Methods give the state a fixed shape and a controlled surface — a set_status method can validate against allowed values, making the typo bug structurally impossible.",
        },
        {
          type: "coding",
          id: "py23_code_01",
          difficulty: "Medium",
          prompt:
            "Define a Counter class: __init__ starts count at 0; increment() adds 1; report() returns 'count: N'. Create one, increment three times, print report(). Expected output: count: 3",
          starterCode: "# Your code here\n",
          solutionCode:
            "class Counter:\n    def __init__(self):\n        self.count = 0\n\n    def increment(self):\n        self.count += 1\n\n    def report(self):\n        return f'count: {self.count}'\n\nc = Counter()\nc.increment()\nc.increment()\nc.increment()\nprint(c.report())",
          expectedOutput: "count: 3",
          tests: [
            {
              name: "State on self",
              description: "count lives as self.count, initialized in __init__",
            },
            {
              name: "Methods mutate and read",
              description: "increment updates state; report formats it",
            },
          ],
        },
        {
          type: "mcq",
          id: "py23_mcq_04",
          difficulty: "Hard",
          question:
            "a = Sensor('T1'); b = Sensor('T1') — is a is b True, and what about a separate c = a?",
          options: [
            "a is b is True because the arguments match",
            "a is b is False (two constructions = two objects); c = a makes c an alias, so c is a is True",
            "Both comparisons are False",
            "is doesn't work on custom classes",
          ],
          correctIndex: 1,
          explanation:
            "Every class call builds a NEW object — equal-looking arguments don't merge them. Assignment never copies: c = a binds a second name to the same instance (mutations via c show through a). The whiteboard model from Variables applies to objects exactly.",
        },
        {
          type: "coding",
          id: "py23_code_02",
          difficulty: "Hard",
          prompt:
            "Define Inventory: __init__ takes a name; add(item, qty) accumulates quantities in a dict (merging repeat items); missing(required) takes a set of item names and returns the sorted list of those not stocked. Create one, add ('bolt', 5), ('nut', 2), ('bolt', 3), then print the stock dict and missing({'bolt', 'washer', 'screw'}). Expected:\n{'bolt': 8, 'nut': 2}\n['screw', 'washer']",
          starterCode: "# Your code here\n",
          solutionCode:
            "class Inventory:\n    def __init__(self, name):\n        self.name = name\n        self.stock = {}\n\n    def add(self, item, qty):\n        self.stock[item] = self.stock.get(item, 0) + qty\n\n    def missing(self, required):\n        return sorted(required - set(self.stock))\n\ninv = Inventory('warehouse-1')\ninv.add('bolt', 5)\ninv.add('nut', 2)\ninv.add('bolt', 3)\nprint(inv.stock)\nprint(inv.missing({'bolt', 'washer', 'screw'}))",
          expectedOutput: "{'bolt': 8, 'nut': 2}\n['screw', 'washer']",
          tests: [
            {
              name: "Accumulating dict attribute",
              description: "add uses the .get(k, 0) + qty pattern on self.stock",
            },
            {
              name: "Set difference in a method",
              description: "missing converts stock keys to a set and differences",
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
          question: "What is self, mechanically? Why do Python methods need it?",
          answer:
            "self is the instance a method was invoked on, received as the method's first parameter. The dot syntax is sugar: acct.deposit(50) is exactly BankAccount.deposit(acct, 50) — Python looks deposit up on the class, then calls it with the instance prepended. This is why one method definition serves every instance: the shared code reaches per-instance data only through self, so a.deposit(25) and b.deposit(25) touch different balances. It also explains the two classic errors — omitting self in the def gives 'takes 1 positional argument but 2 were given' (the auto-passed instance had no slot), and writing balance instead of self.balance creates a throwaway local under ordinary scoping rules. Worth adding: 'self' is convention, not keyword — but breaking the convention is a review rejection everywhere.",
        },
        {
          question:
            "When do you model something as a class versus a dict plus functions?",
          answer:
            "Class triggers: multiple functions all take the same bundle of state (the same-first-argument smell); the state has INVARIANTS that operations must preserve — a balance that only moves via deposit/withdraw, counters that must update together; you're making many instances of one shape with behavior; or you're building to a lifecycle protocol like sklearn's init/fit/transform. Dict-plus-functions wins when data is transient and shape-flexible — rows flowing through an ETL pipeline rarely deserve classes, and JSON naturally stays dicts at the boundary. The middle ground matters too: a dataclass gives named, typed fields without ceremony when there's state but little behavior. The principle: classes are for state WITH rules; plain data structures are for data in transit. Wrapping everything in classes is as much a smell as wrapping nothing.",
        },
        {
          question:
            "Explain sklearn's fit/transform pattern in terms of plain Python classes.",
          answer:
            "An estimator is a class whose lifecycle maps to three plain mechanisms. __init__ stores CONFIGURATION (hyperparameters) as attributes — no data seen yet. fit(data) computes LEARNED STATE from training data and stores it on self — a scaler's min/max, a model's coefficients — conventionally returning self so calls chain. transform/predict APPLIES that stored state to any data — crucially including data it never learned from, which is what makes train/test separation possible: fit on train only, transform both, and the test set never leaks information into the parameters. Once you see it, the API reads itself: attributes ending in underscore (scaler.min_, model.coef_) are the learned state fit attached; 'NotFittedError' means the None-sentinel state was still unset when transform ran. Being able to hand-write a 15-line MinMaxScaler with exactly this shape is a common and fair interview exercise.",
        },
      ],
    },

    {
      id: "common-mistakes",
      type: "callout",
      variant: "warning",
      title: "Common Mistakes to Avoid",
      content:
        "1) Missing self in a method def — the auto-passed instance has nowhere to land. 2) Bare names where you meant attributes — self.count updates the object; count is a local. 3) Forgetting parentheses: Sensor is the class, Sensor() is a new instance. 4) Initializing shared mutable state on the CLASS body instead of in __init__ — every instance shares one list (next lesson dissects this). 5) Classes for everything — plain data in transit stays dicts/lists. 6) Expecting two constructions with equal args to be the same object — every call builds fresh; aliasing rules from Variables still apply.",
    },

    {
      id: "ai-tutor",
      type: "callout",
      variant: "tip",
      title: "Ask the AI Tutor",
      content:
        "Try these prompts in the AI Tutor panel: • 'Quiz me: trace self through these three method calls.' • 'Show me a dict+functions design and help me refactor it to a class.' • 'Explain why sklearn's fit returns self.' • 'Give me five designs and make me judge: class or dict?' • 'Interview mode: ask me to build a MinMaxScaler class and grade it.'",
    },

    {
      id: "glossary",
      type: "callout",
      variant: "info",
      title: "Glossary",
      content:
        "Class — a blueprint defining a new type's attributes and methods (CapWords names). Object / instance — one value built from a class. __init__ — the initializer run on each construction. self — the instance a method was called on; auto-passed first argument. Attribute — data attached to an instance (self.balance). Method — a function defined in a class, called through an instance. Constructor call — ClassName(args), which allocates and runs __init__. isinstance(x, C) — is x an instance of C? Invariant — a consistency rule operations must preserve. dataclass — stdlib shortcut for state-heavy, behavior-light classes.",
    },

    {
      id: "resources",
      type: "callout",
      variant: "info",
      title: "Recommended Resources",
      content:
        "• Docs: 'Classes' in the official Python tutorial — sections 9.1–9.4 cover today's ground. • Read: the sklearn 'Developing estimators' guide intro — see fit/transform stated as a contract. • Practice: rebuild the closure-based rate limiter from Scope & Closures as a class, and compare the two designs honestly. • Next in DSM: attributes have more machinery than you've seen — Attributes & Methods covers class-level attributes, the shared-mutable trap, and method design.",
    },

    {
      id: "recap",
      type: "recap",
      tocLabel: "Recap",
      content:
        "✓ class defines a blueprint; calling it builds instances; __init__ furnishes each one.\n✓ self IS the instance — acct.deposit(50) passes acct automatically.\n✓ Attributes (self.x) hold per-instance state; methods are the operations that keep it consistent.\n✓ Same-first-argument-everywhere is the signal to promote dicts+functions to a class.\n✓ Objects obey all existing rules: aliasing, scoping, use in lists/dicts/max(key=...).\n✓ sklearn/pandas APIs are this lesson: __init__ config, fit learns state, methods apply it.\n\nNext up: Attributes & Methods. The blueprint has depth: class attributes vs instance attributes, the shared-mutable trap, and how to design method surfaces that keep state honest.",
    },
  ],
};
