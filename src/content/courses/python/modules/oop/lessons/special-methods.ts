import type { Lesson } from "@/lib/curriculum/types";

export const specialMethods: Lesson = {
  meta: {
    id: "python.oop.special-methods",
    slug: "special-methods",
    title: "Special (Dunder) Methods",
    description:
      "Make your objects feel native: __repr__ for honest printing, __eq__ for ==, __len__ for len() — the protocol behind every Python operator.",
    estimatedTime: "30 mins",
    difficulty: "Intermediate",
    xpReward: 70,
    prerequisites: ["python.oop.encapsulation-and-properties"],
    masteryThreshold: 80,
  },

  blocks: [
    {
      id: "intro",
      type: "lesson-intro",
      tocLabel: "Introduction",
      intro: {
        hook: "print(order) shows <__main__.Order object at 0x7f3a2c1d>. len(order) crashes. order1 == order2 says False for identical orders. Your class WORKS, but it doesn't speak Python. Meanwhile len(df), df1 == df2, and print(df) all behave beautifully — because pandas implemented the same hooks you're about to learn.",
        what: "Special methods (dunders — double underscores) are the hooks Python's syntax calls: print → __repr__/__str__, == → __eq__, len() → __len__, in → __contains__, [] → __getitem__, + → __add__. Implement them and your objects plug into the language itself.",
        why: "Dunders are why Python feels consistent: ONE len() works on strings, lists, dicts, DataFrames — and can work on your classes. Debugging without __repr__ is archaeology; testing without __eq__ means assert failures you can't read. And understanding the protocol demystifies every library: df['col'] is just __getitem__.",
        whereUsed:
          "Every domain class worth debugging (__repr__), every value-like class (__eq__), every collection-like class (__len__, __getitem__, __contains__), and reading ANY library source.",
        objectives: [
          "Write __repr__ so objects print honestly everywhere",
          "Implement __eq__ for value equality (and know the is/== split)",
          "Make objects sized, indexable, and iterable via container dunders",
          "Recognize operator syntax as dunder dispatch (df['x'], a + b)",
          "Know when NOT to define dunders — and when a dataclass does it for you",
        ],
        realWorldApps: [
          {
            company: "pandas",
            headline: "df['col'] IS a dunder",
            detail:
              "Bracket access on a DataFrame calls DataFrame.__getitem__; len(df) calls __len__; df == other builds a boolean frame via __eq__. The 'magic' API is protocol methods all the way down.",
          },
          {
            company: "pathlib",
            headline: "Paths that divide",
            detail:
              "Path('data') / 'sales.csv' works because Path defines __truediv__ — the stdlib redefining an operator to make file code readable.",
          },
          {
            company: "pytest",
            headline: "Readable assertion failures",
            detail:
              "assert result == expected produces useful diffs only because your objects define __eq__ and __repr__ — test quality is dunder quality.",
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
            "The core idea: Python's syntax is a thin layer over method calls. len(x) calls x.__len__(); a == b calls a.__eq__(b); item in box calls box.__contains__(item); obj[key] calls obj.__getitem__(key). Built-in types implement these; your classes can too. You never call dunders directly (len(x), not x.__len__()) — you implement them so the SYNTAX works.",
        },
        {
          type: "code-note",
          code: "class Point:\n    def __init__(self, x, y):\n        self.x = x\n        self.y = y\n\n    def __repr__(self):\n        return f'Point(x={self.x}, y={self.y})'\n\np = Point(3, 4)\nprint(p)          # Point(x=3, y=4)\nprint([p, p])     # [Point(x=3, y=4), Point(x=3, y=4)]",
          content:
            "__repr__ is dunder #1 — implement it in every class you'll ever debug. The convention: return what a developer could paste to recreate the object. It shows up in print, f-strings, lists, error messages, and debuggers; without it, every log line is hex addresses.",
        },
        {
          type: "analogy",
          title: "The universal wall socket",
          content:
            "Python's syntax — len(), ==, in, [] — is a wall of standard sockets. Built-in types come with plugs already attached. Your class arrives with bare wires: the appliance works internally, but nothing connects to the wall. Each dunder you implement is attaching one standard plug: wire up __len__ and the len() socket accepts you; wire __eq__ and == flows. The genius of the socket standard: code that only knows the SOCKET (a function calling len(x)) works with every appliance ever made — including yours, the moment you attach the plug.",
        },
        {
          type: "keypoint",
          title: "__eq__: value equality is yours to define",
          content:
            "By default, == on your objects means IDENTITY (same object — inherited from `object`, it's `is` in disguise). Two Point(3, 4)s compare unequal until you define __eq__ saying which FIELDS make two instances 'the same'. The disciplined shape: check the type first (return NotImplemented for foreign types — letting Python try the other side or fall back cleanly), then compare the fields as a tuple. Bonus fact with consequences: objects defining __eq__ lose hashability by default — deliberately, since equal things must hash equal (the dict-key rule from Data Structures).",
        },
        {
          type: "code-note",
          code: "class Point:\n    def __init__(self, x, y):\n        self.x = x\n        self.y = y\n\n    def __repr__(self):\n        return f'Point({self.x}, {self.y})'\n\n    def __eq__(self, other):\n        if not isinstance(other, Point):\n            return NotImplemented\n        return (self.x, self.y) == (other.x, other.y)\n\nprint(Point(3, 4) == Point(3, 4))   # True — value equality\nprint(Point(3, 4) == 'hello')       # False — NotImplemented fallback",
          content:
            "Tuple comparison does the multi-field work (the trick from Tuples). NotImplemented (a special value, not an exception!) tells Python 'I don't know this type' — it then asks other.__eq__ and ultimately falls back to identity, so mixed comparisons stay False instead of crashing.",
        },
        {
          type: "keypoint",
          title: "The container protocol: act like a collection",
          content:
            "Three dunders make a class feel like a list/dict: __len__ (len(box), and truthiness — empty means falsy!), __getitem__ (box[0] or box['key']), __contains__ (x in box). Implementing __getitem__ with integer indexes even makes your object ITERABLE — for loops just call [0], [1], [2]... until IndexError. This is duck typing's engine: sorted(), list(), sum(), and for care only that the right dunders exist, not what class you are.",
        },
        {
          type: "expandable",
          title: "__str__ vs __repr__, and operators too",
          content:
            "__repr__ targets developers (unambiguous, recreatable); __str__ targets end users (pretty). print and f-strings prefer __str__ but FALL BACK to __repr__ — so defining only __repr__ covers both, which is the right default. Arithmetic has dunders too: a + b is a.__add__(b), * is __mul__, < is __lt__ (defining __lt__ makes sorted() work on your objects with no key=). Define operators only when the domain genuinely has the operation — Money + Money yes, User + User no. pathlib's / for joining paths is the canonical 'tasteful operator' example.",
        },
        {
          type: "warning",
          title: "Don't hand-write what dataclasses generate",
          content:
            "For value-holding classes, @dataclass writes __init__, __repr__, and __eq__ FOR you from field declarations: @dataclass class Point: x: int; y: int — done, all three correct. Hand-write dunders when you need behavior dataclasses don't generate (containers, operators, custom equality). Also: keep dunders unsurprising. A __len__ that returns anything but 'how many items', or an __eq__ that mutates, breaks the universal expectation every reader carries — the whole value of the protocol is that nobody has to check.",
        },
      ],
    },

    {
      id: "diagram",
      type: "interactive-diagram",
      tocLabel: "Visual Learning",
      visual: {
        kind: "flow",
        title: "Syntax → dunder dispatch",
        caption:
          "Five everyday syntaxes and the hooks they secretly call. Click each pair.",
        nodes: [
          {
            id: "print",
            label: "print(order)",
            sublabel: "→ __repr__ / __str__",
            detail:
              "print asks for __str__, falls back to __repr__. Implement __repr__ first — it also covers lists of your objects, error messages, and debuggers.",
            x: 15,
            y: 15,
            accent: true,
          },
          {
            id: "eq",
            label: "a == b",
            sublabel: "→ a.__eq__(b)",
            detail:
              "Default is identity (is). Define __eq__ for value equality; return NotImplemented for foreign types so Python can try b's __eq__ or fall back.",
            x: 62,
            y: 15,
            accent: false,
          },
          {
            id: "len",
            label: "len(box)",
            sublabel: "→ box.__len__()",
            detail:
              "Also powers truthiness: no __bool__ defined → empty (__len__ == 0) is falsy. That's why `if my_list:` works — and why it'll work on your class too.",
            x: 15,
            y: 48,
            accent: false,
          },
          {
            id: "getitem",
            label: "box[key]",
            sublabel: "→ box.__getitem__(key)",
            detail:
              "One hook, two styles: integer keys make list-likes, string keys make dict-likes. df['col'] is exactly this. Integer __getitem__ + IndexError = free iteration.",
            x: 62,
            y: 48,
            accent: false,
          },
          {
            id: "contains",
            label: "x in box",
            sublabel: "→ box.__contains__(x)",
            detail:
              "Membership, defined by you — a Route can answer 'is this stop on me?', a DateRange 'is this day inside me?'. Without it, Python falls back to iterating __getitem__.",
            x: 15,
            y: 81,
            accent: false,
          },
          {
            id: "duck",
            label: "duck typing",
            sublabel: "the payoff",
            detail:
              "sorted(), sum(), list(), for, min/max — all written against dunders, not classes. Implement the protocol and forty years of generic code works on your type instantly.",
            x: 62,
            y: 81,
            accent: false,
          },
        ],
        edges: [
          { from: "print", to: "eq" },
          { from: "len", to: "getitem" },
          { from: "contains", to: "duck" },
          { from: "getitem", to: "duck", label: "enables" },
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
          title: "__repr__: from hex to honest",
          scenario: "The two-minute upgrade every class deserves.",
          steps: [
            {
              code: "class Sensor:\n    def __init__(self, sid, unit):\n        self.sid = sid\n        self.unit = unit\n\n    def __repr__(self):\n        return f\"Sensor(sid='{self.sid}', unit='{self.unit}')\"\n\ns = Sensor('T-101', 'celsius')\nprint(s)\nprint([s])",
              explanation:
                "The convention: look like the constructor call. Now logs, lists, and debuggers all show real information. Without this, print(s) is <__main__.Sensor object at 0x...> — useless at 3am.",
            },
          ],
          output:
            "Sensor(sid='T-101', unit='celsius')\n[Sensor(sid='T-101', unit='celsius')]",
        },
        {
          difficulty: "Easy",
          title: "__eq__: making tests testable",
          scenario: "Value objects must compare by value — or assertions lie.",
          steps: [
            {
              code: "class Money:\n    def __init__(self, cents, currency):\n        self.cents = cents\n        self.currency = currency\n\n    def __repr__(self):\n        return f'Money({self.cents}, {self.currency!r})'\n\n    def __eq__(self, other):\n        if not isinstance(other, Money):\n            return NotImplemented\n        return (self.cents, self.currency) == (other.cents, other.currency)",
              explanation:
                "Cents as integers (the money lesson's rule), equality over BOTH fields — 500 USD ≠ 500 EUR. The repr means a failed test shows Money(500, 'usd') != Money(500, 'eur'), not two hex addresses.",
            },
            {
              code: "price = Money(500, 'usd')\nprint(price == Money(500, 'usd'))\nprint(price == Money(500, 'eur'))\nprint(price == 500)",
              explanation:
                "Same fields → True; different currency → False; foreign type → NotImplemented path → False without crashing. compute_total() can now be tested with one assert.",
            },
          ],
          output: "True\nFalse\nFalse",
        },
        {
          difficulty: "Medium",
          title: "A container: __len__, __getitem__, __contains__",
          scenario:
            "The SensorBatch from last lesson graduates: len(batch), batch[0], and 21.5 in batch all work.",
          steps: [
            {
              code: "class SensorBatch:\n    def __init__(self, sensor_id, readings):\n        self.sensor_id = sensor_id\n        self._readings = list(readings)\n\n    def __repr__(self):\n        return f'SensorBatch({self.sensor_id!r}, n={len(self._readings)})'\n\n    def __len__(self):\n        return len(self._readings)\n\n    def __getitem__(self, i):\n        return self._readings[i]\n\n    def __contains__(self, value):\n        return value in self._readings",
              explanation:
                "Each dunder delegates to the internal list — the wrapper exposes collection BEHAVIOR without exposing the collection itself (encapsulation intact: _readings stays internal, but iteration is public).",
            },
            {
              code: "batch = SensorBatch('T-101', [21.5, 23.1, 22.4])\nprint(len(batch))\nprint(batch[0], batch[-1])\nprint(23.1 in batch)\nif batch:\n    print('has data')",
              explanation:
                "len, indexing (negative too — the list handles it), membership, and truthiness (via __len__) — four syntaxes, zero methods invented. Callers already know this API because it's PYTHON'S api.",
            },
            {
              code: "total = sum(batch) / len(batch)\nprint(f'mean {total:.2f}')\nprint(sorted(batch))",
              explanation:
                "The duck-typing payoff: sum(), sorted(), and for loops work via __getitem__ iteration — generic code written decades before your class, now serving it.",
            },
          ],
          output:
            "3\n21.5 22.4\nTrue\nhas data\nmean 22.33\n[21.5, 22.4, 23.1]",
        },
        {
          difficulty: "Hard",
          title: "Operators with meaning: __add__ and __lt__",
          scenario:
            "Money that adds safely (same currency only) and sorts naturally — tasteful operator overloading.",
          steps: [
            {
              code: "class Money:\n    def __init__(self, cents, currency):\n        self.cents = cents\n        self.currency = currency\n\n    def __repr__(self):\n        return f'Money({self.cents}, {self.currency!r})'\n\n    def __add__(self, other):\n        if not isinstance(other, Money) or other.currency != self.currency:\n            raise ValueError('can only add same-currency Money')\n        return Money(self.cents + other.cents, self.currency)",
              explanation:
                "__add__ RETURNS A NEW Money — operators should be pure (a + b mutating a would horrify every reader). The currency guard turns a silent unit bug (adding USD to EUR) into a loud error: the operator encodes the domain rule.",
            },
            {
              code: "    def __lt__(self, other):\n        return self.cents < other.cents\n\nprices = [Money(1250, 'usd'), Money(499, 'usd'), Money(890, 'usd')]\nprint(sorted(prices))",
              explanation:
                "__lt__ alone unlocks sorted(), min(), max() — no key= needed. (Real code adds functools.total_ordering to derive <=, >, >= from __lt__ + __eq__.)",
            },
            {
              code: "total = Money(1250, 'usd') + Money(499, 'usd')\nprint(total)\ntry:\n    Money(100, 'usd') + Money(100, 'eur')\nexcept ValueError as e:\n    print(e)",
              explanation:
                "Addition reads like arithmetic because it IS the domain's arithmetic; the cross-currency attempt fails at the operator, not in a report three systems later. Operators earn their keep when they make the domain MORE precise, not just shorter.",
            },
          ],
          output:
            "[Money(499, 'usd'), Money(890, 'usd'), Money(1250, 'usd')]\nMoney(1749, 'usd')\ncan only add same-currency Money",
        },
        {
          difficulty: "Industry Example",
          title: "What df['col'] really is — and a mini-DataFrame to prove it",
          scenario:
            "A 20-line column store implementing the exact dunders pandas does. After this, no pandas syntax is magic — it's protocol.",
          steps: [
            {
              code: "class MiniFrame:\n    def __init__(self, data):\n        self._cols = data            # dict of lists (Nested Data Structures!)\n\n    def __repr__(self):\n        names = ', '.join(self._cols)\n        return f'MiniFrame(cols=[{names}], rows={len(self)})'\n\n    def __len__(self):\n        first = next(iter(self._cols.values()), [])\n        return len(first)\n\n    def __getitem__(self, name):\n        return self._cols[name]\n\n    def __contains__(self, name):\n        return name in self._cols",
              explanation:
                "The column-oriented dict-of-lists from the Data Structures module, wrapped in protocol: __getitem__ takes a column NAME (dict-like, exactly pandas' choice), __len__ counts rows, __contains__ answers 'is there a column...'.",
            },
            {
              code: "df = MiniFrame({\n    'city': ['oslo', 'cairo', 'lima'],\n    'temp': [-3.5, 31.0, 19.5],\n})\nprint(df)\nprint(len(df))\nprint(df['temp'])\nprint('city' in df, 'humidity' in df)",
              explanation:
                "Four familiar syntaxes — print, len, brackets, in — each one dispatching to a method YOU can now read and write. This is genuinely how pandas is built, minus a hundred thousand lines of optimization.",
            },
            {
              code: "hot = [c for c, t in zip(df['city'], df['temp']) if t > 20]\nprint(f'hot cities: {hot}')",
              explanation:
                "And your existing skills compose on top: zip over two columns, comprehension filter. When the real pandas arrives in the Data Analysis course, df['col'] will already be transparent — __getitem__ on a column store, nothing more.",
            },
          ],
          output:
            "MiniFrame(cols=[city, temp], rows=3)\n3\n[-3.5, 31.0, 19.5]\nTrue False\nhot cities: ['cairo']",
        },
      ],
    },

    {
      id: "inline-practice",
      type: "inline-code",
      tocLabel: "Practice Coding",
      coding: {
        language: "python",
        filename: "playlist_native.py",
        instructions:
          "Upgrade the Playlist from Classes & Objects into a native-feeling object: __repr__ as Playlist('<name>', tracks=<n>); __len__ (track count); __getitem__ (i-th title); __contains__ (is a title in the playlist?); __eq__ (same name AND same track list, NotImplemented for foreign types). Demo lines are provided.",
        starterCode: `class Playlist:
    def __init__(self, name, tracks=None):
        self.name = name
        self._tracks = list(tracks) if tracks else []

    def add(self, title):
        self._tracks.append(title)

    # TODO 1: __repr__ -> Playlist('Focus', tracks=2)
    ___

    # TODO 2: __len__
    ___

    # TODO 3: __getitem__(i) -> i-th title
    ___

    # TODO 4: __contains__(title)
    ___

    # TODO 5: __eq__ — same name and tracks; NotImplemented otherwise
    ___

a = Playlist('Focus', ['Deep Flow', 'Stillness'])
b = Playlist('Focus', ['Deep Flow', 'Stillness'])
print(a)
print(len(a), a[0])
print('Stillness' in a, 'Tempo Up' in a)
print(a == b, a == 'Focus')`,
        solutionCode: `class Playlist:
    def __init__(self, name, tracks=None):
        self.name = name
        self._tracks = list(tracks) if tracks else []

    def add(self, title):
        self._tracks.append(title)

    def __repr__(self):
        return f"Playlist('{self.name}', tracks={len(self._tracks)})"

    def __len__(self):
        return len(self._tracks)

    def __getitem__(self, i):
        return self._tracks[i]

    def __contains__(self, title):
        return title in self._tracks

    def __eq__(self, other):
        if not isinstance(other, Playlist):
            return NotImplemented
        return (self.name, self._tracks) == (other.name, other._tracks)

a = Playlist('Focus', ['Deep Flow', 'Stillness'])
b = Playlist('Focus', ['Deep Flow', 'Stillness'])
print(a)
print(len(a), a[0])
print('Stillness' in a, 'Tempo Up' in a)
print(a == b, a == 'Focus')`,
        expectedOutput:
          "Playlist('Focus', tracks=2)\n2 Deep Flow\nTrue False\nTrue False",
        hints: [
          "__repr__ mirrors the constructor: f\"Playlist('{self.name}', tracks={len(self._tracks)})\"",
          "__len__ and __getitem__ delegate straight to the internal list",
          "__contains__ returns title in self._tracks",
          "__eq__: isinstance check → NotImplemented; else compare (name, tracks) tuples — two constructions with equal fields now compare True",
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
          id: "py27_mcq_01",
          difficulty: "Easy",
          question: "What does len(obj) actually do?",
          options: [
            "Reads obj's length attribute",
            "Calls obj.__len__() — len is a thin wrapper over the protocol method",
            "Counts obj's attributes",
            "Works only on built-in types",
          ],
          correctIndex: 1,
          explanation:
            "Python syntax dispatches to dunders: len → __len__, == → __eq__, [] → __getitem__. Implement the hook and the built-in syntax accepts your type — that's the whole protocol system.",
        },
        {
          type: "mcq",
          id: "py27_mcq_02",
          difficulty: "Easy",
          question: "Without defining __eq__, what does == compare on your class?",
          options: [
            "All attributes, recursively",
            "Identity — inherited default: True only for the very same object (like is)",
            "The __repr__ strings",
            "It raises TypeError",
          ],
          correctIndex: 1,
          explanation:
            "object.__eq__ falls back to identity, so two Point(3, 4)s are unequal until you define which fields constitute value equality. The classic symptom: tests failing on 'equal' objects.",
        },
        {
          type: "mcq",
          id: "py27_mcq_03",
          difficulty: "Medium",
          question: "In __eq__, why return NotImplemented (not False) for foreign types?",
          options: [
            "It's faster",
            "NotImplemented tells Python to try the OTHER object's __eq__ (it may know how to compare), then fall back to identity — False would unilaterally kill that negotiation",
            "False would raise an exception",
            "NotImplemented is required syntax",
          ],
          correctIndex: 1,
          explanation:
            "Comparison is a two-way negotiation: a.__eq__(b) returning NotImplemented lets Python ask b.__eq__(a) — vital when b is a subclass with a broader definition. The end result of double-NotImplemented is False anyway, but the protocol stays correct.",
        },
        {
          type: "scenario",
          id: "py27_sc_01",
          difficulty: "Medium",
          scenario:
            "A production incident log shows: 'ERROR processing <__main__.Order object at 0x7f2b431dfd60>' — repeated 400 times with different addresses. The on-call engineer can't tell which orders failed.",
          question: "What's the one-method fix, and what should it return?",
          options: [
            "__str__ returning 'Order'",
            "__repr__ returning constructor-style detail — e.g. Order(id='A-101', total=49.99) — so every log line identifies its object",
            "__eq__ comparing ids",
            "A custom log() method callers must remember to use",
          ],
          correctIndex: 1,
          explanation:
            "Error messages, f-strings, and container printing all route through __repr__. One honest repr retro-fixes every existing log line — the custom method (D) only helps code that remembers to call it.",
        },
        {
          type: "coding",
          id: "py27_code_01",
          difficulty: "Medium",
          prompt:
            "Class Tag: __init__(name); __repr__ as Tag('<name>'); __eq__ comparing lowercase names (Tag('SQL') == Tag('sql') is True), NotImplemented for non-Tags. Print Tag('SQL'), Tag('SQL') == Tag('sql'), and Tag('SQL') == 'sql'. Expected:\nTag('SQL')\nTrue\nFalse",
          starterCode: "# Your code here\n",
          solutionCode:
            "class Tag:\n    def __init__(self, name):\n        self.name = name\n\n    def __repr__(self):\n        return f\"Tag('{self.name}')\"\n\n    def __eq__(self, other):\n        if not isinstance(other, Tag):\n            return NotImplemented\n        return self.name.lower() == other.name.lower()\n\nprint(Tag('SQL'))\nprint(Tag('SQL') == Tag('sql'))\nprint(Tag('SQL') == 'sql')",
          expectedOutput: "Tag('SQL')\nTrue\nFalse",
          tests: [
            {
              name: "Normalized equality",
              description: "__eq__ compares .lower() names — case-insensitive by design",
            },
            {
              name: "Foreign types negotiate",
              description: "Tag vs string returns NotImplemented → False, no crash",
            },
          ],
        },
        {
          type: "mcq",
          id: "py27_mcq_04",
          difficulty: "Hard",
          question:
            "A class defines __len__ returning 0 when empty. What does `if my_obj:` do with no __bool__ defined?",
          options: [
            "Always True — objects are truthy",
            "Falls back to __len__: empty (0) → False, non-empty → True — exactly like lists and dicts",
            "Raises TypeError",
            "Calls __eq__(True)",
          ],
          correctIndex: 1,
          explanation:
            "Truthiness protocol: __bool__ first, else __len__ != 0, else True. Implementing __len__ buys `if batch:` for free — and matches every container idiom your readers already know.",
        },
        {
          type: "coding",
          id: "py27_code_02",
          difficulty: "Hard",
          prompt:
            "Class Basket: holds (name, price) via add(); __len__; __contains__ checking NAMES; __add__ merging two baskets into a NEW one (items concatenated); __repr__ as Basket(items=<n>). Demo: a has mug(14.0) and tee(22.5); b has cap(9.0); c = a + b. Print c, len(c), 'cap' in c, 'hat' in c. Expected:\nBasket(items=3)\n3\nTrue\nFalse",
          starterCode: "# Your code here\n",
          solutionCode:
            "class Basket:\n    def __init__(self, items=None):\n        self._items = list(items) if items else []\n\n    def add(self, name, price):\n        self._items.append((name, price))\n\n    def __len__(self):\n        return len(self._items)\n\n    def __contains__(self, name):\n        return name in [n for n, _ in self._items]\n\n    def __add__(self, other):\n        if not isinstance(other, Basket):\n            raise TypeError('can only add Basket to Basket')\n        return Basket(self._items + other._items)\n\n    def __repr__(self):\n        return f'Basket(items={len(self._items)})'\n\na = Basket()\na.add('mug', 14.0)\na.add('tee', 22.5)\nb = Basket()\nb.add('cap', 9.0)\nc = a + b\nprint(c)\nprint(len(c))\nprint('cap' in c)\nprint('hat' in c)",
          expectedOutput: "Basket(items=3)\n3\nTrue\nFalse",
          tests: [
            {
              name: "Pure __add__",
              description: "a + b returns a NEW Basket; a and b are unchanged",
            },
            {
              name: "Name-based membership",
              description: "__contains__ unpacks tuples and checks names only",
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
            "What are special methods, and why are they central to Python's design?",
          answer:
            "Special ('dunder') methods are the named hooks Python's syntax dispatches to: len(x) → x.__len__(), a == b → a.__eq__(b), obj[k] → __getitem__, x in c → __contains__, a + b → __add__, print → __str__/__repr__. Their centrality is uniformity: there's ONE len() spelled identically for strings, lists, dicts, DataFrames, and your classes — because it's protocol, not per-type methods (contrast .size(), .length, .count() proliferation in other languages). This is also duck typing's engine: generic code — for loops, sorted, sum, min — is written against dunders, so implementing the protocol plugs a brand-new type into decades of existing code with zero registration. The convention half matters as much as the mechanics: you IMPLEMENT dunders but never call them directly (len(x), not x.__len__()), and a dunder that betrays its universal meaning — a mutating __eq__, a __len__ that isn't a count — damages the very predictability the protocol exists to provide.",
        },
        {
          question:
            "Which dunders do you implement by default on a domain class, and what does each buy?",
          answer:
            "__repr__ always — constructor-style output (Order(id='A-101', total=49.99)) that shows up in print, f-strings, container displays, debuggers, and crucially in error messages and logs; the cost of skipping it is hex-address archaeology during incidents. __eq__ on any value-like class — field-based equality (tuple comparison, isinstance guard, NotImplemented for foreign types) — which is what makes assert result == expected work in tests; without it, == is identity and equal-looking objects compare False. Then by role: container-likes get __len__ (also truthiness), __getitem__ (also iteration via the index protocol), __contains__; sortable domain objects get __lt__ (unlocks sorted/min/max, with functools.total_ordering deriving the rest); arithmetic-bearing domains (Money, Vector) get pure __add__-style operators with domain guards. Two caveats I'd volunteer: defining __eq__ removes default hashability (equal objects must hash equal — so add __hash__ or accept unhashable), and for plain value holders @dataclass generates __init__/__repr__/__eq__ correctly from field declarations — hand-writing those three is usually wasted review surface.",
        },
        {
          question:
            "Explain how df['col'], len(df), and `if df_slice:` connect to the dunder protocol — and why that pandas truthiness check famously raises.",
          answer:
            "Each is dispatch: df['col'] calls DataFrame.__getitem__('col') on a column-oriented store (a dict-of-lists industrialized); len(df) calls __len__ returning the row count; printing calls __repr__ (that neat table IS a repr). Understanding this de-magics the API — bracket syntax on ANY library object is someone's __getitem__, so you can read the source rather than memorize behaviors. The truthiness case is the instructive one: `if df_slice:` would normally fall back to __len__ or __bool__, but pandas deliberately implements __bool__ to RAISE ('The truth value of a DataFrame is ambiguous') — because a data structure holding many boolean comparisons has no single honest truth value: did you mean .empty, .any(), or .all()? It's a protocol lesson in itself: when every default answer would mislead, the most user-respecting implementation of a dunder is a loud, specific error pointing to the precise alternatives. The same judgment applies to your own classes: implement the protocol where the semantics are unambiguous, and refuse it loudly where they aren't.",
        },
      ],
    },

    {
      id: "common-mistakes",
      type: "callout",
      variant: "warning",
      title: "Common Mistakes to Avoid",
      content:
        "1) Shipping classes without __repr__ — every log line becomes a hex address. 2) Forgetting __eq__ on value objects — tests compare identity and lie. 3) Returning False instead of NotImplemented for foreign types — kills the two-way negotiation. 4) Calling dunders directly (x.__len__()) — the built-ins (len(x)) are the API. 5) Operators that mutate — a + b must return NEW; surprise mutation in an operator is unforgivable. 6) Hand-writing __init__/__repr__/__eq__ on plain value holders — @dataclass generates all three. 7) Surprising semantics — __len__ that isn't a count breaks every reader's assumptions.",
    },

    {
      id: "ai-tutor",
      type: "callout",
      variant: "tip",
      title: "Ask the AI Tutor",
      content:
        "Try these prompts in the AI Tutor panel: • 'Quiz me: which dunder does each of these ten syntaxes call?' • 'Walk me through the NotImplemented negotiation between two classes.' • 'Show me the same class hand-written vs @dataclass.' • 'Design dunders for a DateRange class with me — which fit, which don't?' • 'Interview mode: ask me why pandas raises on `if df:` and grade my answer.'",
    },

    {
      id: "glossary",
      type: "callout",
      variant: "info",
      title: "Glossary",
      content:
        "Special/dunder method — double-underscore hook Python syntax dispatches to. __repr__ — developer-facing representation (constructor-style). __str__ — user-facing; print falls back to __repr__. __eq__ — defines ==; default is identity. NotImplemented — 'I can't compare this type; ask the other side' (a value, not an error). __len__ — powers len() and default truthiness. __getitem__ — powers obj[key] and index-based iteration. __contains__ — powers in. __add__/__lt__ — power + and < (sorted needs only __lt__). Protocol/duck typing — generic code written against dunders, not classes. @dataclass — generates __init__/__repr__/__eq__ from fields.",
    },

    {
      id: "resources",
      type: "callout",
      variant: "info",
      title: "Recommended Resources",
      content:
        "• Docs: the Data Model chapter of the Python reference — the complete dunder catalog (skim section 3.3). • Read: the dataclasses module docs — see exactly which dunders it writes for you. • Practice: add __repr__ and __eq__ to every class you built this module, then re-run your old code and watch prints and comparisons improve. • Next in DSM: OOP complete! Your setters raise ValueError — but what IS raising, who catches it, and how do robust programs recover? The Error Handling module begins with Understanding Errors & Exceptions.",
    },

    {
      id: "recap",
      type: "recap",
      tocLabel: "Recap",
      content:
        "✓ Python syntax is dunder dispatch: len → __len__, == → __eq__, [] → __getitem__, in → __contains__.\n✓ __repr__ on every class — constructor-style, for logs, tests, and debuggers.\n✓ __eq__ defines value equality: isinstance guard, tuple comparison, NotImplemented for strangers.\n✓ __len__ + __getitem__ + __contains__ = container feel, truthiness, and free iteration.\n✓ Operators stay pure and domain-honest: Money + Money returns new, guards currencies.\n✓ @dataclass generates the value-object trio; hand-write only what has real behavior.\n\nNext up: Understanding Errors & Exceptions. You've been RAISING ValueError from setters and reading tracebacks all course — the Error Handling module makes you fluent: what exceptions are, how they travel, and how programs survive them.",
    },
  ],
};
