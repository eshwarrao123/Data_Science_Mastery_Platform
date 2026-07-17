import type { Lesson } from "@/lib/curriculum/types";

export const encapsulationAndProperties: Lesson = {
  meta: {
    id: "python.oop.encapsulation-and-properties",
    slug: "encapsulation-and-properties",
    title: "Encapsulation & Properties",
    description:
      "Protect object internals: private-by-convention naming, @property for computed attributes, and setters that make invalid state impossible.",
    estimatedTime: "25 mins",
    difficulty: "Intermediate",
    xpReward: 60,
    prerequisites: ["python.oop.inheritance"],
    masteryThreshold: 80,
  },

  blocks: [
    {
      id: "intro",
      type: "lesson-intro",
      tocLabel: "Introduction",
      intro: {
        hook: "account.balance = -5000. Nothing stopped that line — and now every method that trusted the balance is quietly wrong. Attributes are honest about being public... which means anyone can break your object's rules with one assignment. Time to give objects a way to say 'not like that'.",
        what: "Encapsulation: separating an object's public API from its internals. Python's tools are conventions (_single underscore = internal), name mangling (__double), and @property — which lets attribute syntax run code, so reads can compute and writes can validate.",
        why: "Objects exist to maintain invariants — a balance that matches its history, a temperature above absolute zero, an email that contains @. Encapsulation makes those rules enforceable at the boundary, and @property lets you add enforcement LATER without breaking a single caller — Python's answer to why it has no getter/setter boilerplate.",
        whereUsed:
          "Validated domain models, computed attributes (df.shape is one!), caching, deprecating fields gracefully, and every library whose attributes 'just know' derived values.",
        objectives: [
          "Mark internals with _underscore and respect others' marks",
          "Explain __name mangling and its actual purpose",
          "Write @property getters for computed/derived attributes",
          "Add setters that validate and reject bad state",
          "Evolve public attribute → property without breaking callers",
        ],
        realWorldApps: [
          {
            company: "pandas",
            headline: "df.shape is a property",
            detail:
              "It looks like stored data but computes from the internals on every read — and df.shape = (2, 2) raises, because there's no setter. You've been using @property since your first DataFrame.",
          },
          {
            company: "Pydantic",
            headline: "Validation at assignment",
            detail:
              "FastAPI request models reject bad data the instant a field is set — industrial-strength setter validation, the exact pattern this lesson hand-builds.",
          },
          {
            company: "Requests",
            headline: "Internals marked, API stable",
            detail:
              "The requests library's Session keeps _-prefixed internals it can refactor freely — a decade of internal changes, near-zero breakage, because the underscore contract held.",
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
            "Python has no `private` keyword — encapsulation runs on convention. A leading underscore (self._connection) declares 'internal: use at your own risk'; linters warn on outside access, but nothing is enforced. This is deliberate: 'we're all consenting adults' — the language trusts you to respect the marker, and in exchange debugging and testing can always reach inside.",
        },
        {
          type: "code-note",
          code: "class Account:\n    def __init__(self, owner, balance):\n        self.owner = owner          # public API\n        self._balance = balance     # internal: touch via methods\n        self._history = []          # internal\n\n    def deposit(self, amount):\n        self._balance += amount\n        self._history.append(amount)\n\n    def balance_report(self):\n        return f'{self.owner}: ${self._balance}'",
          content:
            "The underscore splits the class into two zones: owner and the methods are the public contract; _balance and _history are implementation the class may restructure at will. Callers who type the underscore are announcing they accept the breakage risk.",
        },
        {
          type: "analogy",
          title: "The restaurant kitchen door",
          content:
            "A restaurant has a dining room (public API) and a kitchen (_internals). The 'Staff Only' sign on the kitchen door isn't a lock — you CAN barge in — but everyone understands: rearrange the kitchen and your dinner is your problem. @property is the waiter: you ask for 'the bill' as if it were a thing sitting on a shelf, but the waiter computes it fresh from the kitchen's records. And a property SETTER is the waiter checking your credit card before accepting it — same simple gesture from your side, validation on theirs.",
        },
        {
          type: "keypoint",
          title: "@property: attribute syntax, method power",
          content:
            "Decorate a no-argument method with @property and it's READ as an attribute: obj.total, no parentheses — but your code runs. Perfect for derived values (total from items, area from radius, shape from data) because they can never go stale: computed on every read, always consistent with the source state. To callers it's indistinguishable from plain data — that's the point.",
        },
        {
          type: "code-note",
          code: "class Order:\n    def __init__(self):\n        self._items = []   # (name, price)\n\n    def add(self, name, price):\n        self._items.append((name, price))\n\n    @property\n    def total(self):\n        return round(sum([p for _, p in self._items]), 2)\n\no = Order()\no.add('mug', 14.0)\no.add('tee', 22.5)\nprint(o.total)      # attribute syntax — the method runs\n# o.total = 99      # AttributeError: no setter — read-only!",
          content:
            "total is always right because it's never stored — no 'forgot to update the cached total' bug can exist. And with no setter defined, assignment raises: read-only attributes for free.",
        },
        {
          type: "keypoint",
          title: "Setters: validation at the boundary",
          content:
            "@total.setter (named after the property) intercepts ASSIGNMENT: obj.celsius = -300 runs your checks and raises before bad state lands. The idiom pairs a property `celsius` with storage `_celsius`: the setter validates then writes the underscore name. Note __init__ should assign self.celsius = value (through the setter!) so construction is validated by the same gate. Result: invalid state is impossible to reach through the public name.",
        },
        {
          type: "expandable",
          title: "The migration superpower",
          content:
            "Day 1: self.email is a plain attribute; callers write user.email everywhere. Day 400: you need validation. In Java you'd have shipped getEmail()/setEmail() from day one just in case. In Python you convert email to a property with the same name — every existing caller keeps working, but now runs through your gate. This is why PEP 8 says: start with plain attributes; add properties when (if!) you need behavior. No speculative boilerplate, no breaking migration.",
        },
        {
          type: "expandable",
          title: "Double underscore: mangling, not privacy",
          content:
            "self.__token (two leading underscores, no trailing) triggers NAME MANGLING: Python rewrites it to self._ClassName__token. The purpose isn't secrecy — vars(obj) shows the mangled name plainly — it's preventing accidental clashes when a SUBCLASS happens to reuse the same attribute name (each class's __x mangles to a different name). Use _single for 'internal'; reserve __double for base classes designed for inheritance by strangers. Reaching for __ as 'more private' is a Python smell.",
        },
        {
          type: "warning",
          title: "Keep properties cheap and honest",
          content:
            "Attribute syntax promises attribute COST — callers will read obj.total in loops and f-strings without a second thought. A property that hits a database, sleeps, or mutates state betrays that promise (and a property that changes state on READ is a command-query violation in disguise). Rule: properties compute quickly from in-memory state; anything slower or effectful stays an explicit method — fetch_total() warns the caller with its parentheses.",
        },
      ],
    },

    {
      id: "diagram",
      type: "interactive-diagram",
      tocLabel: "Visual Learning",
      visual: {
        kind: "flow",
        title: "One name, two gated paths: reading and writing temp.celsius",
        caption:
          "With @property + setter, attribute syntax routes through your code both ways. Click each node.",
        nodes: [
          {
            id: "read",
            label: "print(temp.celsius)",
            sublabel: "read access",
            detail:
              "Looks like reading stored data. Actually calls the @property getter — which can return _celsius as-is, or compute (fahrenheit would derive from it).",
            x: 12,
            y: 20,
            accent: false,
          },
          {
            id: "getter",
            label: "@property getter",
            sublabel: "def celsius(self)",
            detail:
              "Runs on every read. Returns self._celsius — or any derived value. No parentheses at the call site; total transparency for callers.",
            x: 45,
            y: 20,
            accent: false,
          },
          {
            id: "write",
            label: "temp.celsius = -300",
            sublabel: "write access",
            detail:
              "Looks like plain assignment. Actually calls the setter with -300 — your validation runs BEFORE any state changes.",
            x: 12,
            y: 65,
            accent: false,
          },
          {
            id: "setter",
            label: "@celsius.setter",
            sublabel: "validate, then store",
            detail:
              "if value < -273.15: raise ValueError(...). Only valid values reach the storage. The object's invariant — physically possible temperatures — is enforced at the boundary, once, for every caller.",
            x: 45,
            y: 65,
            accent: true,
          },
          {
            id: "storage",
            label: "self._celsius",
            sublabel: "the real storage",
            detail:
              "The underscore attribute holds the actual number. Public name = gated property; underscore name = raw storage the methods use internally. Two names, one value, one gate.",
            x: 80,
            y: 42,
            accent: false,
          },
        ],
        edges: [
          { from: "read", to: "getter", label: "triggers" },
          { from: "getter", to: "storage", label: "reads" },
          { from: "write", to: "setter", label: "triggers" },
          { from: "setter", to: "storage", label: "valid → write" },
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
          title: "Public face, private kitchen",
          scenario: "Mark which parts of a class are contract vs implementation.",
          steps: [
            {
              code: "class Timer:\n    def __init__(self):\n        self._ticks = 0      # internal counter\n\n    def tick(self):\n        self._ticks += 1\n\n    def elapsed_label(self):\n        return f'{self._ticks} ticks'\n\nt = Timer()\nt.tick()\nt.tick()\nprint(t.elapsed_label())",
              explanation:
                "Callers use tick() and elapsed_label(); _ticks is the class's own business. Tomorrow it could store timestamps instead — no caller notices, because none (politely) touched the underscore.",
            },
          ],
          output: "2 ticks",
        },
        {
          difficulty: "Easy",
          title: "A computed, read-only property",
          scenario: "A rectangle's area shouldn't be stored — it should always be TRUE.",
          steps: [
            {
              code: "class Rect:\n    def __init__(self, w, h):\n        self.w = w\n        self.h = h\n\n    @property\n    def area(self):\n        return self.w * self.h\n\nr = Rect(3, 4)\nprint(r.area)\nr.w = 10\nprint(r.area)",
              explanation:
                "area recomputes on every read — change w and area follows instantly. A stored self.area would have gone stale the moment w changed: derived values want properties, not storage.",
            },
            {
              code: "try:\n    r.area = 99\nexcept AttributeError:\n    print('read-only!')",
              explanation:
                "No setter defined → assignment raises. The object's geometry can't be lied to. (df.shape behaves exactly like this.)",
            },
          ],
          output: "12\n40\nread-only!",
        },
        {
          difficulty: "Medium",
          title: "A validating setter",
          scenario: "Temperatures below absolute zero must be unrepresentable.",
          steps: [
            {
              code: "class Temperature:\n    def __init__(self, celsius):\n        self.celsius = celsius     # runs the SETTER — construction is validated too\n\n    @property\n    def celsius(self):\n        return self._celsius\n\n    @celsius.setter\n    def celsius(self, value):\n        if value < -273.15:\n            raise ValueError(f'{value}°C is below absolute zero')\n        self._celsius = value\n\n    @property\n    def fahrenheit(self):\n        return round(self._celsius * 9 / 5 + 32, 1)",
              explanation:
                "The trio: public name `celsius` (gated), storage `_celsius` (raw), and a bonus derived property. __init__ assigning through self.celsius means even Temperature(-500) is caught — one gate, every path.",
            },
            {
              code: "t = Temperature(21.5)\nprint(t.fahrenheit)\nt.celsius = 25.0\nprint(t.celsius)\ntry:\n    t.celsius = -300\nexcept ValueError as e:\n    print(f'rejected: {e}')\nprint(t.celsius)   # state unchanged after the rejection",
              explanation:
                "Valid writes flow through; the invalid one raises BEFORE storage changes, so the object stays in its last good state. Invariant enforced at the boundary — no method ever needs to re-check.",
            },
          ],
          output: "70.7\n25.0\nrejected: -300°C is below absolute zero\n25.0",
        },
        {
          difficulty: "Hard",
          title: "Migration: plain attribute → property, zero caller changes",
          scenario:
            "v1 shipped user.email as a plain attribute. Support tickets arrive: emails without @ are corrupting the mailing list. Fix it without breaking the 200 call sites.",
          steps: [
            {
              code: "# v1 — shipped everywhere:\n# class User:\n#     def __init__(self, email):\n#         self.email = email     # no validation; 'not-an-email' accepted",
              explanation:
                "The v1 contract is attribute access: user.email reads, user.email = x writes. Any fix must keep BOTH spellings working.",
            },
            {
              code: "class User:\n    def __init__(self, email):\n        self.email = email          # same line as v1 — now hits the setter\n\n    @property\n    def email(self):\n        return self._email\n\n    @email.setter\n    def email(self, value):\n        if '@' not in value:\n            raise ValueError(f'invalid email: {value!r}')\n        self._email = value.strip().lower()",
              explanation:
                "v2: same public name, now a property. The setter validates AND normalizes (strip + lower — the cleaning pipeline from Strings). Every v1 call site compiles and runs unchanged; bad data now bounces at the door.",
            },
            {
              code: "u = User('  Ada@Example.COM ')\nprint(u.email)\ntry:\n    u.email = 'not-an-email'\nexcept ValueError as e:\n    print(e)",
              explanation:
                "Existing code gained validation and normalization for free. This no-migration upgrade is THE argument for Python's 'plain attributes first' style — you never pay for getters you don't need yet.",
            },
          ],
          output: "ada@example.com\ninvalid email: 'not-an-email'",
        },
        {
          difficulty: "Industry Example",
          title: "A dataset wrapper with invariants (the pandas shape)",
          scenario:
            "A data platform team wraps validated sensor batches. Rules: readings are append-only through one gate, stats are always-fresh properties, and the raw list is internal — exactly how professional wrappers around DataFrames are built.",
          steps: [
            {
              code: "class SensorBatch:\n    MAX_VALID = 200.0        # class constant: sensor's physical ceiling\n\n    def __init__(self, sensor_id):\n        self.sensor_id = sensor_id\n        self._readings = []\n        self._rejected = 0\n\n    def record(self, value):\n        if 0 <= value <= self.MAX_VALID:\n            self._readings.append(value)\n        else:\n            self._rejected += 1",
              explanation:
                "One command gate: record() enforces the physical-range invariant and counts rejects (report, don't swallow). The storage is underscore-marked — appending around the gate would be a visible convention breach in review.",
            },
            {
              code: "    @property\n    def count(self):\n        return len(self._readings)\n\n    @property\n    def mean(self):\n        return round(sum(self._readings) / len(self._readings), 2) if self._readings else None\n\n    @property\n    def quality(self):\n        total = self.count + self._rejected\n        return round(self.count / total * 100, 1) if total else 100.0",
              explanation:
                "Three derived views, all properties: computed fresh, impossible to desync from the data, read-only by omission (no setters). mean returns the value-or-None contract for the empty case. quality composes other properties — they stack like attributes because they ARE attributes to callers.",
            },
            {
              code: "batch = SensorBatch('T-101')\nfor v in [21.5, 23.1, 999.0, 22.4]:\n    batch.record(v)\nprint(f'{batch.sensor_id}: n={batch.count}, mean={batch.mean}, quality={batch.quality}%')",
              explanation:
                "The 999 spike bounced at the gate; the stats never saw it. Callers read four 'attributes' — one stored, three computed — and cannot tell which is which. That indistinguishability is encapsulation done well.",
            },
          ],
          output: "T-101: n=3, mean=22.33, quality=75.0%",
        },
      ],
    },

    {
      id: "inline-practice",
      type: "inline-code",
      tocLabel: "Practice Coding",
      coding: {
        language: "python",
        filename: "product.py",
        instructions:
          "Build a Product with a validated price: __init__(name, price) assigns through the property; the price setter rejects negatives with ValueError('price cannot be negative'); storage lives in _price; add a read-only property display returning '<name>: $<price formatted to 2dp>'. Demo: create one, reprice it, attempt a negative price (catch and print the error), print display.",
        starterCode: `class Product:
    def __init__(self, name, price):
        self.name = name
        # TODO 1: assign through the property so construction is validated
        ___

    # TODO 2: price getter returning the underscore storage
    ___

    # TODO 3: price setter — reject negatives, else store
    ___

    # TODO 4: read-only property 'display' -> '<name>: $<price:.2f>'
    ___

p = Product('mug', 14.0)
p.price = 12.5
try:
    p.price = -3
except ValueError as e:
    print(e)
print(p.display)`,
        solutionCode: `class Product:
    def __init__(self, name, price):
        self.name = name
        self.price = price

    @property
    def price(self):
        return self._price

    @price.setter
    def price(self, value):
        if value < 0:
            raise ValueError('price cannot be negative')
        self._price = value

    @property
    def display(self):
        return f"{self.name}: \${self.price:.2f}"

p = Product('mug', 14.0)
p.price = 12.5
try:
    p.price = -3
except ValueError as e:
    print(e)
print(p.display)`,
        expectedOutput: "price cannot be negative\nmug: $12.50",
        hints: [
          "__init__ writes self.price = price (the public name) — the setter validates construction too",
          "The getter is @property def price(self): return self._price",
          "The setter is @price.setter def price(self, value): raise on value < 0, else self._price = value",
          "display is a second @property with no setter — read-only by omission; note the failed -3 left price at 12.5",
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
          id: "py26_mcq_01",
          difficulty: "Easy",
          question: "What does a single leading underscore (self._cache) mean in Python?",
          options: [
            "The attribute is compiler-enforced private",
            "A convention: 'internal — outside code shouldn't touch this', with no enforcement",
            "The attribute is read-only",
            "The attribute is deprecated",
          ],
          correctIndex: 1,
          explanation:
            "Python encapsulation is contractual, not enforced: the underscore marks the internal zone, linters warn, and respectful code stays out. Access still WORKS — deliberately, for debugging and tests.",
        },
        {
          type: "mcq",
          id: "py26_mcq_02",
          difficulty: "Easy",
          question: "What does @property change about a method?",
          options: [
            "It becomes a class method",
            "It's read with attribute syntax — obj.total, no parentheses — running the method on each access",
            "It runs once and caches forever",
            "It becomes private",
          ],
          correctIndex: 1,
          explanation:
            "The decorator turns method calls into attribute reads: callers see data, your code runs. Fresh on every read (no caching unless you add it) — which is why derived values can never go stale.",
        },
        {
          type: "mcq",
          id: "py26_mcq_03",
          difficulty: "Medium",
          question:
            "A property `total` has a getter but NO setter. What does obj.total = 100 do?",
          options: [
            "Silently ignored",
            "Creates a new instance attribute shadowing the property",
            "Raises AttributeError — properties without setters are read-only",
            "Calls the getter with 100",
          ],
          correctIndex: 2,
          explanation:
            "Unlike plain attributes (where assignment always lands — the shadowing rule), a property intercepts the write and, with no setter, refuses it. That's how df.shape stays untouchable.",
        },
        {
          type: "scenario",
          id: "py26_sc_01",
          difficulty: "Medium",
          scenario:
            "A teammate stores self.total in __init__ and updates it inside add_item(). QA finds carts where total ≠ sum of items — a code path mutated _items without updating total.",
          question: "What's the structural fix?",
          options: [
            "Add total updates to every mutation site",
            "Make total a @property computing from _items — derived state that's computed can't desync from its source",
            "Recompute total in a nightly job",
            "Make _items a tuple",
          ],
          correctIndex: 1,
          explanation:
            "Stored derived state creates an invariant every future edit must remember; computed derived state makes the invariant structural. Option A treats the symptom and re-breaks on the next new code path.",
        },
        {
          type: "coding",
          id: "py26_code_01",
          difficulty: "Medium",
          prompt:
            "Class Circle: __init__(r) assigns through a validated property (radius must be > 0, else ValueError('radius must be positive')); read-only property area = round(3.14159 * r * r, 2). Create Circle(2), print area; try Circle(-1) and print the caught error. Expected:\n12.57\nradius must be positive",
          starterCode: "# Your code here\n",
          solutionCode:
            "class Circle:\n    def __init__(self, radius):\n        self.radius = radius\n\n    @property\n    def radius(self):\n        return self._radius\n\n    @radius.setter\n    def radius(self, value):\n        if value <= 0:\n            raise ValueError('radius must be positive')\n        self._radius = value\n\n    @property\n    def area(self):\n        return round(3.14159 * self._radius ** 2, 2)\n\nc = Circle(2)\nprint(c.area)\ntry:\n    Circle(-1)\nexcept ValueError as e:\n    print(e)",
          expectedOutput: "12.57\nradius must be positive",
          tests: [
            {
              name: "Validated construction",
              description: "__init__ assigns via the property; Circle(-1) raises",
            },
            {
              name: "Computed area",
              description: "area is a read-only property derived from _radius",
            },
          ],
        },
        {
          type: "mcq",
          id: "py26_mcq_04",
          difficulty: "Hard",
          question: "What does self.__token (double underscore) actually do?",
          options: [
            "Makes the attribute truly inaccessible",
            "Name mangling: rewrites to _ClassName__token, preventing accidental clashes with subclass attributes — not secrecy",
            "Encrypts the value",
            "Same as one underscore",
          ],
          correctIndex: 1,
          explanation:
            "Mangling is per-class renaming so a subclass's __token can't collide with the base's. The value remains reachable as obj._ClassName__token — it was never about privacy. Default to _single; reserve __double for inheritance-facing base classes.",
        },
        {
          type: "scenario",
          id: "py26_sc_02",
          difficulty: "Hard",
          scenario:
            "A review comment: 'user.recommendations is a @property that runs a 2-second ML inference call. Three templates read it in loops; page loads now take 30s.'",
          question: "What design rule was broken?",
          options: [
            "Properties can't call ML models",
            "Attribute syntax promises attribute cost — expensive work must be an explicit method (get_recommendations()), whose parentheses warn the caller",
            "The property needed a setter",
            "The templates should cache manually",
          ],
          correctIndex: 1,
          explanation:
            "Callers treat attributes as free and read them casually — that's the contract properties inherit. Hiding a 2-second call behind data syntax invites exactly this loop disaster. Cheap derivations: property. Slow/effectful work: a method, visibly a call.",
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
            "Python has no private keyword. How does encapsulation actually work, and why is it designed that way?",
          answer:
            "Through convention plus one mechanical assist. A single leading underscore marks an attribute or method as internal — nothing enforces it, but linters flag outside access, `from module import *` skips such names, and reviewers treat violations as contract breaches. Double leading underscores add name mangling (rewritten to _ClassName__attr), whose real purpose is preventing accidental name collisions between a base class and its subclasses, not secrecy — the mangled name is plainly visible in vars(). The philosophy ('consenting adults'): hard privacy mostly obstructs debugging, testing, and emergency patches, while a clear marker achieves the actual goal — communicating what's stable API versus refactorable implementation. The enforcement that matters is at the WRITE boundary anyway, and @property provides that: computed reads and validating setters give Python real invariant protection exactly where invariants live.",
        },
        {
          question:
            "Why does Python code avoid Java-style getX()/setX() methods, and what replaces them?",
          answer:
            "Because @property makes the boilerplate unnecessary WITHOUT giving up the option of behavior later. Java bakes getters/setters in from day one defensively — changing a public field to a method breaks every caller, so you pay the ceremony up front just in case. Python's property decorator decouples syntax from mechanism: obj.email is attribute syntax whether it's a plain attribute or a property running validation code, so you ship the plain attribute first and convert to a property — same name, zero caller changes — only when a real need arrives (validation, normalization, derivation, deprecation warnings). That migration path is the whole argument: uniform access means you never pay for flexibility you don't use. The caveat that comes with it: properties must stay cheap and side-effect-free, because attribute syntax tells callers 'this is data' — an expensive or mutating property betrays the syntax and belongs behind an explicit method call.",
        },
        {
          question:
            "How do you design a class so invalid states are unrepresentable? Walk through the tools.",
          answer:
            "Layer the defenses at the boundary. First, funnel all mutation through a narrow surface: storage is underscore-internal, and state changes go through commands (record(), deposit()) or property setters — never raw attribute pokes. Second, validate in the setter and route construction through it: __init__ assigns self.celsius = value (the public name), so the same gate checks initial values and later updates — no separate constructor validation to drift out of sync. Third, make derived values computed properties rather than stored fields (total from _items, mean from _readings): computed state cannot desync from its source, eliminating the entire 'forgot to update the cache' bug family. Fourth, make read-only things read-only by omitting setters — df.shape-style. Finally, raise early with specific exceptions (ValueError with the offending value in the message) so bad data fails at the boundary, not three functions downstream — which is the bridge to the next module: error handling is how these gates communicate.",
        },
      ],
    },

    {
      id: "common-mistakes",
      type: "callout",
      variant: "warning",
      title: "Common Mistakes to Avoid",
      content:
        "1) Bypassing your own gates — writing self._price = x from other methods when the setter has the validation; go through the public name. 2) Storing derived values (self.total) that mutation paths must remember to update — compute them as properties. 3) Infinite recursion: the getter returning self.price instead of self._price calls itself forever. 4) Expensive/side-effecting properties — attribute syntax promises attribute cost. 5) __double underscores as 'stronger private' — it's clash protection for inheritance, not security. 6) Forgetting __init__ should assign through the property so construction validates too.",
    },

    {
      id: "ai-tutor",
      type: "callout",
      variant: "tip",
      title: "Ask the AI Tutor",
      content:
        "Try these prompts in the AI Tutor panel: • 'Quiz me: plain attribute, property, or method — for these eight fields?' • 'Walk me through the getter-recursion bug and why _name breaks the loop.' • 'Show the attribute→property migration on a class I paste.' • 'Explain name mangling with a subclass collision example.' • 'Interview mode: ask me why Python skips getters/setters and grade my answer.'",
    },

    {
      id: "glossary",
      type: "callout",
      variant: "info",
      title: "Glossary",
      content:
        "Encapsulation — separating public API from internals. _single underscore — 'internal' by convention; unenforced. __double underscore — name mangling to _ClassName__attr; clash protection. @property — decorator making a method readable as an attribute. Getter/setter — the property's read and (optional) write functions. @x.setter — decorator registering the validating write path. Read-only property — getter without setter; assignment raises. Derived value — computed from other state; wants a property, not storage. Invariant — a rule the object's state must always satisfy. Uniform access — same syntax for stored and computed attributes.",
    },

    {
      id: "resources",
      type: "callout",
      variant: "info",
      title: "Recommended Resources",
      content:
        "• Docs: the built-in property() reference — the decorator trio (getter/setter/deleter) in one page. • Read: PEP 8's 'Designing for Inheritance' section — the official word on underscores and when to use properties. • Practice: take your Inventory class from Classes & Objects and make stock read-only from outside, with a computed total_items property. • Next in DSM: your setters raise ValueError — but what happens to a raised error, and how do callers catch it? Special Methods completes the OOP module first: __repr__, __eq__, __len__ — making your objects feel native.",
    },

    {
      id: "recap",
      type: "recap",
      tocLabel: "Recap",
      content:
        "✓ _underscore marks internals — a contract, not a lock; respect it both ways.\n✓ @property runs code behind attribute syntax — derived values computed fresh, never stale.\n✓ No setter = read-only; a setter = validation at the boundary, construction included.\n✓ Public name gates, underscore name stores — and getters must read the underscore or recurse.\n✓ Properties stay cheap and pure; slow or effectful work is a visible method call.\n✓ Plain attributes first; upgrade to properties later with zero caller changes.\n\nNext up: Special Methods. Your classes work — now make them feel NATIVE: __repr__ for honest printing, __eq__ for ==, __len__ for len(), and the dunder protocol behind every Python operator.",
    },
  ],
};
