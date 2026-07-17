import type { Lesson } from "@/lib/curriculum/types";

export const attributesAndMethods: Lesson = {
  meta: {
    id: "python.oop.attributes-and-methods",
    slug: "attributes-and-methods",
    title: "Attributes & Methods in Depth",
    description:
      "Class attributes vs instance attributes, the shared-mutable trap, and designing method surfaces that keep object state honest.",
    estimatedTime: "25 mins",
    difficulty: "Intermediate",
    xpReward: 60,
    prerequisites: ["python.oop.classes-and-objects"],
    masteryThreshold: 80,
  },

  blocks: [
    {
      id: "intro",
      type: "lesson-intro",
      tocLabel: "Introduction",
      intro: {
        hook: "Two sensors share one readings list and nobody knows why. A 'constant' changed on one instance and stayed the same on the class. A method mutates state AND returns a value, and callers keep double-applying it. All three bugs come from the same gap: attributes have RULES you haven't been told yet.",
        what: "The two attribute layers — class attributes (shared, on the blueprint) and instance attributes (per-object, set via self) — plus how lookup falls back from instance to class, and the method-design habits (commands vs queries) that keep objects predictable.",
        why: "The class-vs-instance distinction causes real production bugs (the shared mutable default is a classic), and method design is API design: every library you'll use made these choices, and every class you write makes them for your teammates.",
        whereUsed:
          "Defaults and constants on classes, per-object state in __init__, counters shared across instances, and every 'should this method return or mutate?' decision.",
        objectives: [
          "Distinguish class attributes from instance attributes",
          "Trace the instance → class attribute lookup",
          "Avoid (and diagnose) the shared-mutable class attribute trap",
          "Design methods as commands (mutate) or queries (return) — not both",
          "Use class attributes deliberately: constants, defaults, counters",
        ],
        realWorldApps: [
          {
            company: "Django",
            headline: "Models declare with class attributes",
            detail:
              "A Django model lists its fields as class attributes — the framework reads the blueprint to build database tables, while each row instance carries its own values.",
          },
          {
            company: "sklearn",
            headline: "Config vs learned state",
            detail:
              "Estimator hyperparameters arrive in __init__ (instance attributes); the trailing-underscore convention (coef_) marks state that fit() attached later — an attribute-layer discipline you can read.",
          },
          {
            company: "Stripe",
            headline: "Command-query separation in SDKs",
            detail:
              "Well-designed client libraries keep mutations (charge.capture()) separate from queries (charge.status) — the discipline this lesson names, at API scale.",
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
            "Attributes assigned in the CLASS BODY belong to the class itself — one copy, shared by every instance. Attributes assigned through SELF (usually in __init__) belong to each instance — one copy per object. Both are read with the same dot syntax, which is exactly why the distinction hides.",
        },
        {
          type: "code-note",
          code: "class Sensor:\n    unit = 'celsius'          # class attribute: shared\n\n    def __init__(self, sid):\n        self.sid = sid        # instance attribute: per-object\n\na = Sensor('T1')\nb = Sensor('T2')\nprint(a.unit, b.unit)        # both read the ONE class copy\nprint(a.sid, b.sid)          # each reads its own",
          content:
            "a.unit finds nothing on the instance, so lookup FALLS BACK to the class — that fallback is the mechanism behind everything in this lesson. Methods themselves are class attributes too; that's why one definition serves all instances.",
        },
        {
          type: "analogy",
          title: "The gym's rulebook and the members' lockers",
          content:
            "A gym has ONE rulebook on the wall (class attributes) and a locker per member (instance attributes). Ask any member 'what are the opening hours?' and they check the wall — one source, everyone agrees. Ask 'where are your shoes?' and they open THEIR locker. The trap: if the wall holds a shared whiteboard ('equipment wishlist') and every member scribbles on it thinking it's their private list, chaos — that's the mutable class attribute bug. And if one member tapes their own hours over the wall poster, THEY see their version while everyone else still sees the wall — that's instance shadowing.",
        },
        {
          type: "keypoint",
          title: "Assignment through self SHADOWS, never updates, the class",
          content:
            "Reading falls back instance → class, but WRITING through self always writes to the instance. a.unit = 'kelvin' doesn't change the class's unit — it creates an instance attribute that shadows it for `a` only. Same word as the scope lesson, same behavior: the outer name is hidden, not modified. To change the shared value for everyone: Sensor.unit = 'kelvin' — write where the attribute lives.",
        },
        {
          type: "warning",
          title: "THE trap: mutable class attributes",
          content:
            "class Sensor: readings = [] puts ONE list on the class. Every instance's self.readings.append(...) finds that shared list via fallback — because append MUTATES (no assignment, no shadowing!) — and all sensors' data silently merges. It's the mutable-default-argument bug wearing a class costume, and the fix is identical: mutable per-instance state is created in __init__ (self.readings = []), where each construction builds a fresh object. Rule: class attributes are for IMMUTABLE constants and defaults; anything mutable goes through __init__.",
        },
        {
          type: "keypoint",
          title: "Commands and queries: pick one per method",
          content:
            "A COMMAND mutates state and returns None (or self for chaining): account.deposit(50), list.append(x) — note append returning None is deliberate design, and why x = lst.append(3) is a classic bug. A QUERY computes and returns without mutating: account.balance_in('EUR'), df.describe(). Methods that do both — mutate AND return the value — invite double-application bugs and untestable call sites. Name commands with verbs, queries with nouns or get_/is_ prefixes, and readers can predict behavior from signatures.",
        },
        {
          type: "expandable",
          title: "Legitimate class-attribute patterns",
          content:
            "Three good uses: (1) constants — class Circle: PI = 3.14159, documented and namespaced; (2) immutable defaults every instance starts from — retries = 3, overridable per instance via deliberate shadowing; (3) cross-instance counters — a Sensor.count incremented in __init__ via type(self).count += 1 or Sensor.count += 1, tracking how many instances exist. Each is deliberate SHARING — which is the test: if sharing is the point, class attribute; if isolation is the point, instance attribute.",
        },
        {
          type: "text",
          content:
            "Inspection tools when attribute layers confuse you: vars(obj) shows ONLY the instance's own attributes (its __dict__); vars(ClassName) shows the class's. If a.unit prints a value that vars(a) doesn't contain, you're watching the fallback in action. These two calls turn every attribute mystery into a two-line diagnosis.",
        },
      ],
    },

    {
      id: "diagram",
      type: "interactive-diagram",
      tocLabel: "Visual Learning",
      visual: {
        kind: "flow",
        title: "Attribute lookup: instance first, class as fallback",
        caption:
          "What happens on a.unit — and why writes behave differently. Click each node.",
        nodes: [
          {
            id: "read",
            label: "read a.unit",
            sublabel: "the lookup",
            detail:
              "Python checks the instance's own storage (vars(a)) first. Found → done. Not found → fall back to the class (then parent classes — next lesson).",
            x: 10,
            y: 35,
            accent: false,
          },
          {
            id: "inst",
            label: "instance dict",
            sublabel: "a's own attributes",
            detail:
              "Per-object storage, populated by assignments through self (or a.x = ...). If 'unit' is here, it shadows the class's copy — for this instance only.",
            x: 38,
            y: 15,
            accent: false,
          },
          {
            id: "cls",
            label: "class dict",
            sublabel: "Sensor's attributes",
            detail:
              "The shared blueprint storage: class attributes AND the methods themselves live here. One copy serves every instance that doesn't shadow it.",
            x: 38,
            y: 58,
            accent: true,
          },
          {
            id: "write",
            label: "write a.unit = 'K'",
            sublabel: "always the instance",
            detail:
              "Assignment through the instance NEVER climbs: it creates/overwrites the instance attribute, shadowing the class copy for `a` alone. Sensor.unit = 'K' is how you change the shared value.",
            x: 72,
            y: 15,
            accent: false,
          },
          {
            id: "mutate",
            label: "a.readings.append(x)",
            sublabel: "the trap path",
            detail:
              "No assignment happens — the lookup READS `readings` (falling back to a class-level list if that's where it lives) and mutates whatever it finds. This is how instances silently share state: fallback + mutation, no shadowing to save you.",
            x: 72,
            y: 58,
            accent: false,
          },
        ],
        edges: [
          { from: "read", to: "inst", label: "1st" },
          { from: "read", to: "cls", label: "2nd (fallback)" },
          { from: "inst", to: "write", label: "writes land here" },
          { from: "cls", to: "mutate", label: "mutation reaches here" },
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
          title: "Shared constant, per-instance data",
          scenario: "All invoices share a tax rate; each has its own amount.",
          steps: [
            {
              code: "class Invoice:\n    TAX_RATE = 0.08          # shared constant\n\n    def __init__(self, amount):\n        self.amount = amount  # per-instance\n\n    def total(self):\n        return round(self.amount * (1 + self.TAX_RATE), 2)\n\nprint(Invoice(100.0).total())\nprint(Invoice(59.99).total())",
              explanation:
                "TAX_RATE lives once, on the class (CAPS names the constant, as at module level); each invoice's amount is its own. self.TAX_RATE reads via fallback — instance has none, class provides.",
            },
          ],
          output: "108.0\n64.79",
        },
        {
          difficulty: "Easy",
          title: "Shadowing: instance writes don't touch the class",
          scenario: "Override a default for ONE object and watch the layers.",
          steps: [
            {
              code: "class Job:\n    retries = 3\n\na = Job()\nb = Job()\na.retries = 5      # instance attribute created — shadows\nprint(a.retries, b.retries, Job.retries)",
              explanation:
                "a now carries its own retries; b still falls back to the class's 3. The class value never moved.",
            },
            {
              code: "Job.retries = 4    # change the CLASS value\nprint(a.retries, b.retries)",
              explanation:
                "b (no shadow) sees the new class value instantly; a keeps its instance copy. Whether that split is a feature (per-object override) or a bug (you meant to update everyone) depends only on intent — which is why deliberate code writes to the layer it means.",
            },
          ],
          output: "5 3 3\n5 4",
        },
        {
          difficulty: "Medium",
          title: "The shared-mutable trap, live",
          scenario: "The bug every Python developer meets once — then never forgets.",
          steps: [
            {
              code: "class SensorBad:\n    readings = []              # ONE list, on the class\n\n    def __init__(self, sid):\n        self.sid = sid\n\n    def record(self, v):\n        self.readings.append(v) # falls back to the shared list!",
              explanation:
                "readings looks innocent — but it's a class attribute, and append mutates without assigning, so no shadowing ever happens. Every instance's record() feeds the same list.",
            },
            {
              code: "a = SensorBad('T1')\nb = SensorBad('T2')\na.record(21.5)\nb.record(99.9)\nprint(a.readings)   # T1 'has' T2's reading",
              explanation:
                "Cross-contamination: a.readings and b.readings are the same object (a.readings is b.readings → True — the aliasing test from Variables). In production this surfaces as 'sensor T1 reporting impossible values'.",
            },
            {
              code: "class Sensor:\n    def __init__(self, sid):\n        self.sid = sid\n        self.readings = []      # fresh list PER instance\n\na = Sensor('T1')\nb = Sensor('T2')\na.record if False else a.readings.append(21.5)\nb.readings.append(99.9)\nprint(a.readings, b.readings)",
              explanation:
                "The fix: mutable state is born in __init__, where every construction runs the assignment fresh. Class body for immutable constants; __init__ for everything mutable. (Same medicine as the mutable default argument — same disease.)",
            },
          ],
          output:
            "[21.5, 99.9]\n[21.5] [99.9]",
        },
        {
          difficulty: "Hard",
          title: "Command-query separation in a cart API",
          scenario:
            "Design a shopping cart whose methods are predictable from their names — then see why the mixed method fails review.",
          steps: [
            {
              code: "class Cart:\n    def __init__(self):\n        self.items = []          # (name, price) tuples\n\n    # COMMANDS: mutate, return None\n    def add(self, name, price):\n        self.items.append((name, price))\n\n    def clear(self):\n        self.items = []",
              explanation:
                "Commands change state and hand nothing back — calling one twice does the thing twice, obviously. No caller is tempted to use a return value that isn't there.",
            },
            {
              code: "    # QUERIES: compute, mutate nothing\n    def subtotal(self):\n        return sum([p for _, p in self.items])\n\n    def count(self):\n        return len(self.items)",
              explanation:
                "Queries are safe to call any number of times, in any order, in logging, in tests, in f-strings — because they change nothing. Idempotent reads are what make debugging sane.",
            },
            {
              code: "cart = Cart()\ncart.add('mug', 14.0)\ncart.add('tee', 22.5)\nprint(f'{cart.count()} items, ${cart.subtotal():.2f}')\n\n# The REJECTED design: def add_and_total(self, ...) -> mutates AND returns.\n# Callers can't read state without changing it — every query costs a mutation.",
              explanation:
                "The call site reads cleanly because each method has one job. The mixed method (shown as a comment) breaks the contract: printing the total would add an item. Separation isn't pedantry — it's what keeps 'just checking a value' side-effect-free.",
            },
          ],
          output: "2 items, $36.50",
        },
        {
          difficulty: "Industry Example",
          title: "Instance counting and configured defaults",
          scenario:
            "A connection-pool class from real infra code: a class-level counter tracks instances ever built, a class-level default is overridable per pool, and vars() diagnoses the layers.",
          steps: [
            {
              code: "class Pool:\n    DEFAULT_SIZE = 10      # immutable default: safe on the class\n    created = 0            # deliberate shared counter\n\n    def __init__(self, name, size=None):\n        self.name = name\n        self.size = size if size is not None else Pool.DEFAULT_SIZE\n        Pool.created += 1  # write to the CLASS, by name",
              explanation:
                "Two intentional class attributes: an immutable default (int — no mutation possible) and a counter the class owns. Note the counter update writes through Pool, not self — self.created += 1 would read 0 via fallback, then create a shadowing instance attribute at 1, breaking the shared count.",
            },
            {
              code: "main = Pool('main-db')\nreplica = Pool('replica', size=4)\nprint(main.size, replica.size)\nprint(f'pools created: {Pool.created}')",
              explanation:
                "main falls back to the default; replica got an explicit size. The counter reads 2 through the class — the sharing is the feature here, which is exactly why it's allowed to live there.",
            },
            {
              code: "print(vars(main))\nprint('size' in vars(Pool), 'DEFAULT_SIZE' in vars(Pool))",
              explanation:
                "vars(main) shows only instance data (name, size) — created and DEFAULT_SIZE live in vars(Pool). Two prints, complete map of which layer holds what: the debugging move for every attribute mystery.",
            },
          ],
          output:
            "10 4\npools created: 2\n{'name': 'main-db', 'size': 10}\nFalse True",
        },
      ],
    },

    {
      id: "inline-practice",
      type: "inline-code",
      tocLabel: "Practice Coding",
      coding: {
        language: "python",
        filename: "api_client.py",
        instructions:
          "Build an ApiClient class: a class attribute BASE_URL = 'https://api.acme.io' shared by all clients; per-instance token and a request LOG list (created safely in __init__); a command get(path) that appends f'GET {BASE_URL}{path}' to the log; and queries request_count() and last_request(). Prove two clients keep separate logs.",
        starterCode: `class ApiClient:
    # TODO 1: class attribute BASE_URL (shared constant)
    ___

    def __init__(self, token):
        # TODO 2: instance attributes — token and an EMPTY log list
        ___

    def get(self, path):
        # TODO 3: command — append 'GET <BASE_URL><path>' to the log
        ___

    def request_count(self):
        # TODO 4: query
        ___

    def last_request(self):
        return self.log[-1] if self.log else None

a = ApiClient('tok-a')
b = ApiClient('tok-b')
a.get('/users')
a.get('/orders')
b.get('/health')
print(a.request_count(), b.request_count())
print(a.last_request())
print(b.last_request())`,
        solutionCode: `class ApiClient:
    BASE_URL = 'https://api.acme.io'

    def __init__(self, token):
        self.token = token
        self.log = []

    def get(self, path):
        self.log.append(f"GET {self.BASE_URL}{path}")

    def request_count(self):
        return len(self.log)

    def last_request(self):
        return self.log[-1] if self.log else None

a = ApiClient('tok-a')
b = ApiClient('tok-b')
a.get('/users')
a.get('/orders')
b.get('/health')
print(a.request_count(), b.request_count())
print(a.last_request())
print(b.last_request())`,
        expectedOutput:
          "2 1\nGET https://api.acme.io/orders\nGET https://api.acme.io/health",
        hints: [
          "BASE_URL sits directly in the class body — it's an immutable string, so sharing is safe",
          "self.log = [] belongs in __init__ — a class-level log = [] would merge both clients' requests",
          "get is a command: append and return nothing; self.BASE_URL reads the constant via fallback",
          "request_count is a query: return len(self.log), mutate nothing",
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
          id: "py24_mcq_01",
          difficulty: "Easy",
          question: "Where should a per-instance mutable list be created?",
          options: [
            "In the class body: class C: items = []",
            "In __init__: self.items = []",
            "Either — they're equivalent",
            "As a global next to the class",
          ],
          correctIndex: 1,
          explanation:
            "__init__ runs per construction, so each instance gets a fresh list. The class-body version creates ONE shared list that every instance mutates — the classic trap.",
        },
        {
          type: "mcq",
          id: "py24_mcq_02",
          difficulty: "Easy",
          question:
            "class Config: mode = 'fast'\na = Config(); a.mode = 'safe'\nWhat is Config.mode now?",
          options: ["'safe'", "'fast'", "None", "AttributeError"],
          correctIndex: 1,
          explanation:
            "Assignment through an instance creates a shadowing instance attribute; the class copy is untouched. Only Config.mode = ... writes to the class.",
        },
        {
          type: "mcq",
          id: "py24_mcq_03",
          difficulty: "Medium",
          question:
            "Why does the shared-mutable bug involve .append() but NOT plain assignment (self.x = ...)?",
          options: [
            "append is implemented in C",
            "Mutation modifies whatever object lookup finds (falling back to the class); assignment always creates an instance attribute, which shadows instead of sharing",
            "Assignment is slower",
            "It does happen with assignment too",
          ],
          correctIndex: 1,
          explanation:
            "The trap needs both ingredients: fallback (the read finds the class's list) and mutation (append changes it in place, no new binding). Assignment short-circuits the trap by writing to the instance layer — accidentally 'fixing' it via shadowing.",
        },
        {
          type: "scenario",
          id: "py24_sc_01",
          difficulty: "Medium",
          scenario:
            "A teammate's method: def apply_discount(self, pct): self.price *= (1 - pct/100); return self.price. Callers write total += cart.apply_discount(10) in three places — and a bug report says some carts get discounted twice.",
          question: "What design change prevents this class of bug?",
          options: [
            "Rename the method to apply_discount_and_get",
            "Command-query separation: apply_discount mutates and returns None; a separate price query reads — so reading a price can never re-discount it",
            "Make pct a keyword-only argument",
            "Cache the return value",
          ],
          correctIndex: 1,
          explanation:
            "The mixed method makes 'reading' and 'doing' the same call, so every place that needs the number repeats the mutation. Splitting them makes double-application impossible to write by accident — the exact reason list.append returns None.",
        },
        {
          type: "coding",
          id: "py24_code_01",
          difficulty: "Medium",
          prompt:
            "Define Robot with a class attribute fleet = 'R2' and per-instance name. Create r1 and r2; set r2.fleet = 'X9'; print r1.fleet, r2.fleet, Robot.fleet. Expected output: R2 X9 R2",
          starterCode: "# Your code here\n",
          solutionCode:
            "class Robot:\n    fleet = 'R2'\n\n    def __init__(self, name):\n        self.name = name\n\nr1 = Robot('alpha')\nr2 = Robot('beta')\nr2.fleet = 'X9'\nprint(r1.fleet, r2.fleet, Robot.fleet)",
          expectedOutput: "R2 X9 R2",
          tests: [
            {
              name: "Shadowing demonstrated",
              description: "r2 carries its own fleet; r1 and the class keep 'R2'",
            },
            {
              name: "Layers correct",
              description: "fleet in class body; name via self in __init__",
            },
          ],
        },
        {
          type: "mcq",
          id: "py24_mcq_04",
          difficulty: "Hard",
          question:
            "A counter: class C: n = 0, and __init__ does self.n += 1 intending to count instances. After C(); C(); C(), what is C.n?",
          options: [
            "3",
            "0 — self.n += 1 reads the class's 0 via fallback, then writes an INSTANCE attribute n=1; the class value never changes",
            "1",
            "AttributeError",
          ],
          correctIndex: 1,
          explanation:
            "Augmented assignment through self is read-then-assign: the read falls back, the write shadows. Each instance ends with its own n=1 while C.n sits at 0. Shared counters must write through the class: C.n += 1.",
        },
        {
          type: "coding",
          id: "py24_code_02",
          difficulty: "Hard",
          prompt:
            "Build TicketSystem: class attribute issued = 0 counting ALL tickets ever created across instances; __init__(self, desk) sets the desk name; command issue() increments the class counter AND a per-instance count (created in __init__); query stats() returns '<desk>: <mine> of <total>'. Create desks a and b; issue 2 on a, 1 on b; print both stats. Expected:\nnorth: 2 of 3\nsouth: 1 of 3",
          starterCode: "# Your code here\n",
          solutionCode:
            "class TicketSystem:\n    issued = 0\n\n    def __init__(self, desk):\n        self.desk = desk\n        self.mine = 0\n\n    def issue(self):\n        TicketSystem.issued += 1\n        self.mine += 1\n\n    def stats(self):\n        return f'{self.desk}: {self.mine} of {TicketSystem.issued}'\n\na = TicketSystem('north')\nb = TicketSystem('south')\na.issue()\na.issue()\nb.issue()\nprint(a.stats())\nprint(b.stats())",
          expectedOutput: "north: 2 of 3\nsouth: 1 of 3",
          tests: [
            {
              name: "Class counter via class name",
              description: "issue writes TicketSystem.issued += 1, not self.issued",
            },
            {
              name: "Two layers coexist",
              description: "Per-desk mine and shared issued track independently",
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
            "Explain class attributes vs instance attributes, including the lookup and write rules.",
          answer:
            "Class attributes are assigned in the class body and stored once on the class object; instance attributes are assigned through self (typically in __init__) and stored per object. READS use fallback: Python checks the instance's own __dict__ first, then the class (then base classes) — so instances 'see' class attributes they never defined, and methods themselves are just class attributes found by this same lookup. WRITES never climb: obj.x = v always lands on the instance, creating a shadow that hides the class copy for that object alone; changing the shared value requires writing through the class (C.x = v). The asymmetry — reads fall back, writes don't — explains both deliberate patterns (per-instance overrides of class defaults) and the famous trap: augmented assignment self.n += 1 reads the class value then writes an instance shadow, silently breaking shared counters.",
        },
        {
          question:
            "Describe the shared-mutable class attribute bug and its relationship to the mutable default argument.",
          answer:
            "Declaring class Sensor: readings = [] creates ONE list on the class. Instance code doing self.readings.append(v) reads 'readings' — fallback finds the class's list — and mutates it in place. No assignment occurs, so no shadowing rescues you: every instance appends to the same list, and objects that should be independent share state. The symptom is cross-contamination ('sensor A has sensor B's data'); the diagnosis is a.readings is b.readings returning True. It's the same disease as the mutable default argument (def f(x, acc=[])): in both, a mutable object is created ONCE at definition time and then shared across uses that each believe it's theirs. Same cure, too: create mutable state at USE time — in __init__ for classes, inside the body for functions. The safe class-body residents are immutable: numbers, strings, tuples, None.",
        },
        {
          question:
            "What is command-query separation and why does list.append returning None embody it?",
          answer:
            "CQS is the design rule that a method should either be a COMMAND — mutate state, return nothing meaningful — or a QUERY — return information, mutate nothing — never both. Queries become safe to call anywhere (logs, tests, f-strings, repeated reads) because they can't change behavior; commands become obviously effectful, and calling one twice visibly does the thing twice. Mixed methods breed real bugs: apply_discount() that mutates AND returns the price gets called wherever the price is needed, discounting repeatedly. list.append returning None is the canon example: Python could return the list, but then x = lst.append(3) would look reasonable while hiding a mutation, and chained appends would obscure state changes — instead the None forces you to notice it's a command. In my own classes I signal the split by naming: verbs for commands (add, clear, issue), nouns/get_/is_ for queries (subtotal, count, is_empty) — the signature then documents the side-effect contract for free.",
        },
      ],
    },

    {
      id: "common-mistakes",
      type: "callout",
      variant: "warning",
      title: "Common Mistakes to Avoid",
      content:
        "1) Mutable class attributes (lists/dicts in the class body) — one shared object; create them in __init__. 2) self.counter += 1 for a shared counter — reads class, writes instance shadow; use ClassName.counter += 1. 3) Expecting obj.x = v to update the class value — writes never climb. 4) Methods that mutate AND return the mutated value — double-application bait. 5) Constants scattered as magic numbers in methods instead of named class attributes. 6) Debugging attribute mysteries by guesswork — vars(obj) and vars(Class) show exactly which layer holds what.",
    },

    {
      id: "ai-tutor",
      type: "callout",
      variant: "tip",
      title: "Ask the AI Tutor",
      content:
        "Try these prompts in the AI Tutor panel: • 'Quiz me: for each of these six attribute accesses, which layer answers?' • 'Walk me through the shared-mutable trap with is-checks.' • 'Show the self.n += 1 counter bug step by step.' • 'Audit this class: which methods violate command-query separation?' • 'Interview mode: ask me the read/write asymmetry and grade my answer.'",
    },

    {
      id: "glossary",
      type: "callout",
      variant: "info",
      title: "Glossary",
      content:
        "Class attribute — assigned in the class body; one shared copy. Instance attribute — assigned through self; per-object. Fallback lookup — reads check instance first, then class. Shadowing — an instance attribute hiding a same-named class attribute. Shared-mutable trap — a mutable class attribute silently shared by all instances. Command — a method that mutates and returns None/self. Query — a method that returns without mutating. CQS — command-query separation. vars(x) — x's own attribute dict (instance or class). Augmented assignment — read-then-assign (+=), which shadows through self.",
    },

    {
      id: "resources",
      type: "callout",
      variant: "info",
      title: "Recommended Resources",
      content:
        "• Docs: 'Class and Instance Variables' in the official tutorial's classes chapter — the tutorial's own dog-tricks example IS the shared-mutable trap. • Read: Martin Fowler's short 'CommandQuerySeparation' note — two minutes, permanent vocabulary. • Practice: write a class with a deliberate class-level counter and a per-instance list, then prove each layer with vars() before trusting it. • Next in DSM: classes can BUILD ON other classes — Inheritance lets a specialized type reuse and override a general one, and it's how every sklearn estimator plugs into the same API.",
    },

    {
      id: "recap",
      type: "recap",
      tocLabel: "Recap",
      content:
        "✓ Class body → shared attribute; __init__ via self → per-instance attribute.\n✓ Reads fall back instance → class; writes always land on the instance (shadowing).\n✓ Mutable state belongs in __init__ — the class-body list is the shared-mutable trap.\n✓ Shared counters write through the class name; self.n += 1 silently forks.\n✓ Commands mutate and return None; queries return and mutate nothing — never both.\n✓ vars(obj) / vars(Class) turn attribute mysteries into two-line diagnoses.\n\nNext up: Inheritance. One class can extend another — reusing its attributes and methods, overriding what differs — the mechanism behind every plugin system and sklearn's uniform estimator API.",
    },
  ],
};
