import type { Lesson } from "@/lib/curriculum/types";

export const inheritance: Lesson = {
  meta: {
    id: "python.oop.inheritance",
    slug: "inheritance",
    title: "Inheritance",
    description:
      "Build specialized classes on general ones — reuse, override, extend with super(), and see why every sklearn estimator fits one API.",
    estimatedTime: "30 mins",
    difficulty: "Intermediate",
    xpReward: 60,
    prerequisites: ["python.oop.attributes-and-methods"],
    masteryThreshold: 80,
  },

  blocks: [
    {
      id: "intro",
      type: "lesson-intro",
      tocLabel: "Introduction",
      intro: {
        hook: "Every sklearn model — LinearRegression, RandomForest, KMeans — answers .fit() and .predict(), and your pipeline code never cares which one it got. That interchangeability isn't a coincidence; it's inheritance: each model IS-A BaseEstimator, sharing one contract while overriding the parts that differ.",
        what: "Inheritance lets a class (the child/subclass) build on another (the parent/base class): it inherits every attribute and method, OVERRIDES the ones that must differ, and EXTENDS parent behavior with super(). isinstance() respects the family tree.",
        why: "Inheritance is how frameworks hand you 95% of a solution and let you customize the rest: custom Django models, PyTorch modules, Airflow operators, pytest fixtures — all 'subclass and override one method'. Reading library code without understanding inheritance is impossible; using it well (and knowing when NOT to) is a design skill interviews test directly.",
        whereUsed:
          "sklearn estimators, PyTorch nn.Module, Django models, exception hierarchies (next module!), and any 'plugin' architecture where variants share a contract.",
        objectives: [
          "Define a subclass and inherit attributes and methods",
          "Override methods and extend them with super()",
          "Chain __init__ through super().__init__()",
          "Use isinstance() with hierarchies; explain IS-A vs HAS-A",
          "Judge when inheritance fits and when composition is honest",
        ],
        realWorldApps: [
          {
            company: "PyTorch",
            headline: "Every neural net subclasses nn.Module",
            detail:
              "You define class MyNet(nn.Module), call super().__init__(), and override forward() — the framework's training loop runs YOUR forward through ITS machinery. Deep learning code is inheritance.",
          },
          {
            company: "Apache Airflow",
            headline: "Custom operators",
            detail:
              "A data team's custom SlackAlertOperator subclasses BaseOperator and overrides execute() — scheduling, retries, and logging come free from the parent.",
          },
          {
            company: "scikit-learn",
            headline: "One API, 200+ models",
            detail:
              "Estimators inherit from BaseEstimator and mixins — which is why GridSearchCV can tune ANY model: it only speaks the inherited contract.",
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
            "Syntax: class CsvSource(DataSource): — the parentheses name the parent. The child starts as a complete copy of the parent's behavior: every method and class attribute is reachable on child instances via the attribute lookup you already know, extended one more hop — instance → its class → parent class(es). Define nothing, and the child IS the parent under a new name.",
        },
        {
          type: "code-note",
          code: "class DataSource:\n    def __init__(self, name):\n        self.name = name\n\n    def describe(self):\n        return f'source: {self.name}'\n\nclass CsvSource(DataSource):\n    pass                      # inherits EVERYTHING\n\nsrc = CsvSource('sales.csv')\nprint(src.describe())         # parent method, child instance\nprint(isinstance(src, CsvSource), isinstance(src, DataSource))",
          content:
            "describe isn't defined on CsvSource, so lookup climbs: instance → CsvSource → DataSource. And isinstance says a CsvSource IS-A DataSource too — subclass instances pass both checks, which is what lets code written for the parent accept any child.",
        },
        {
          type: "analogy",
          title: "The franchise manual",
          content:
            "A parent class is the franchise operations manual: how to open, how to close, how to greet. Each location (subclass) follows the manual by default — but the airport branch overrides the opening-hours chapter, and the flagship store ADDS a chapter (new method) about events. When a chapter is overridden, staff read the LOCAL version first; for everything else, the corporate manual answers. super() is the local manager saying 'do what corporate says, THEN my extra steps'.",
        },
        {
          type: "keypoint",
          title: "Override: same name, child wins",
          content:
            "Define a method with the parent's name and child instances use YOURS — lookup finds it before climbing. The design rule that keeps this safe (the Liskov principle, informally): an override should honor the parent's contract — same kind of inputs, same kind of outputs, no new surprises — so any code that works with the parent still works with the child. Override to change HOW, never to change WHAT.",
        },
        {
          type: "code-note",
          code: "class Report:\n    def __init__(self, title, rows):\n        self.title = title\n        self.rows = rows\n\n    def render(self):\n        return f'{self.title}: {len(self.rows)} rows'\n\nclass AuditedReport(Report):\n    def __init__(self, title, rows, auditor):\n        super().__init__(title, rows)   # parent sets up ITS state\n        self.auditor = auditor          # child adds its own\n\n    def render(self):\n        return super().render() + f' [audited by {self.auditor}]'\n\nr = AuditedReport('Q3 Sales', [1, 2, 3], 'kai')\nprint(r.render())",
          content:
            "The two super() patterns in one class. In __init__: let the parent initialize its attributes, then add yours — skip that call and self.title never exists (the #1 inheritance bug). In render: EXTEND rather than replace — run the parent's version, decorate its result.",
        },
        {
          type: "keypoint",
          title: "IS-A vs HAS-A: the design test",
          content:
            "Inherit only when the child IS a kind of the parent — a CsvSource IS-A DataSource; an AuditedReport IS-A Report. When one thing USES another, that's HAS-A: a Pipeline HAS sources (store them as attributes — composition), it isn't a kind of source. The classic mistake: inheriting to grab convenient methods (class Report(list) for free append) — now your report has sort(), pop(), and 30 other methods that make no sense for reports, and every one is a bug invitation. Composition: reports HAVE a list of rows.",
        },
        {
          type: "expandable",
          title: "Polymorphism: the payoff",
          content:
            "Code written against the parent runs every child without knowing which it got: for src in sources: src.load() calls CsvSource.load or ApiSource.load per element — the same 'one call, many behaviors' you saw with len() working on strings, lists, and dicts. This is why sklearn's GridSearchCV can tune any estimator and why your pipeline can gain a ParquetSource next sprint with zero changes to the loop. New variants extend the system by ADDING a subclass, not by editing every if-chain that switches on type — replacing `if kind == 'csv': ... elif kind == 'api': ...` with objects that know their own behavior.",
        },
        {
          type: "warning",
          title: "Keep hierarchies shallow",
          content:
            "One, occasionally two levels. Deep towers (A→B→C→D→E) make every behavior a scavenger hunt across five files, and Python's multiple inheritance (class C(A, B)) adds ordering rules (the MRO — method resolution order, left-to-right) that are easy to get wrong; treat it as read-only knowledge for understanding library mixins, not a tool to reach for. If you're inheriting just to share a utility function, a plain module-level function or composition is the honest design. Modern codebases inherit sparingly and compose liberally.",
        },
      ],
    },

    {
      id: "diagram",
      type: "interactive-diagram",
      tocLabel: "Visual Learning",
      visual: {
        kind: "architecture",
        title: "Lookup climbs the hierarchy",
        caption:
          "src.load() on a CsvSource: where Python searches, in order. Click each level.",
        nodes: [
          {
            id: "instance",
            label: "src",
            sublabel: "the instance",
            detail:
              "Instance attributes first — src's own __dict__ (name, path...). Methods almost never live here; data does.",
            x: 50,
            y: 12,
            accent: false,
          },
          {
            id: "child",
            label: "CsvSource",
            sublabel: "the subclass",
            detail:
              "The child class next. If load() is overridden here, the search STOPS — child wins. Its methods can still reach the parent explicitly via super().",
            x: 50,
            y: 40,
            accent: true,
          },
          {
            id: "parent",
            label: "DataSource",
            sublabel: "the base class",
            detail:
              "Anything the child didn't define resolves here: shared methods, shared class attributes, the common contract. One implementation serves every subclass.",
            x: 50,
            y: 68,
            accent: false,
          },
          {
            id: "object",
            label: "object",
            sublabel: "root of everything",
            detail:
              "Every Python class ultimately inherits from object — the source of defaults like __init__ and __repr__ (which the next lessons override). If lookup fails even here: AttributeError.",
            x: 50,
            y: 92,
            accent: false,
          },
        ],
        edges: [
          { from: "instance", to: "child", label: "not found ↓" },
          { from: "child", to: "parent", label: "not found ↓" },
          { from: "parent", to: "object", label: "not found ↓" },
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
          title: "Inherit everything, add one thing",
          scenario: "A premium user is a user with one extra ability.",
          steps: [
            {
              code: "class User:\n    def __init__(self, name):\n        self.name = name\n\n    def greet(self):\n        return f'hi, {self.name}'\n\nclass PremiumUser(User):\n    def export_data(self):\n        return f'{self.name}.zip ready'\n\np = PremiumUser('ada')\nprint(p.greet())          # inherited\nprint(p.export_data())    # added",
              explanation:
                "PremiumUser defines no __init__, so the parent's runs on construction. greet() resolves one level up; export_data() exists only on the child. Inheritance at its simplest: everything plus one.",
            },
          ],
          output: "hi, ada\nada.zip ready",
        },
        {
          difficulty: "Easy",
          title: "Override with a contract",
          scenario: "All notifiers send; each channel formats differently.",
          steps: [
            {
              code: "class Notifier:\n    def send(self, msg):\n        return f'[log] {msg}'\n\nclass SlackNotifier(Notifier):\n    def send(self, msg):\n        return f'[#alerts] :warning: {msg}'\n\nclass EmailNotifier(Notifier):\n    def send(self, msg):\n        return f'[email] Subject: ALERT — {msg}'",
              explanation:
                "Same signature, same kind of return — HOW differs, WHAT doesn't. Any code holding 'a notifier' can call .send() blind.",
            },
            {
              code: "notifiers = [SlackNotifier(), EmailNotifier(), Notifier()]\nfor n in notifiers:\n    print(n.send('disk 91% full'))",
              explanation:
                "Polymorphism: one loop, three behaviors, zero if-chains. Adding a PagerDutyNotifier tomorrow means adding a class — this loop never changes.",
            },
          ],
          output:
            "[#alerts] :warning: disk 91% full\n[email] Subject: ALERT — disk 91% full\n[log] disk 91% full",
        },
        {
          difficulty: "Medium",
          title: "super().__init__: chaining construction",
          scenario:
            "A rate-limited API client extends a base client with request budgeting.",
          steps: [
            {
              code: "class ApiClient:\n    def __init__(self, base_url):\n        self.base_url = base_url\n        self.log = []\n\n    def get(self, path):\n        self.log.append(path)\n        return f'GET {self.base_url}{path}'",
              explanation:
                "The parent owns base_url and the request log — state its methods depend on.",
            },
            {
              code: "class LimitedClient(ApiClient):\n    def __init__(self, base_url, max_calls):\n        super().__init__(base_url)   # parent state FIRST\n        self.max_calls = max_calls   # then child state\n\n    def get(self, path):\n        if len(self.log) >= self.max_calls:\n            return 'BLOCKED: limit reached'\n        return super().get(path)",
              explanation:
                "Child __init__ MUST call super().__init__ — otherwise self.log never exists and the first get() crashes with AttributeError. The get() override is guard-then-delegate: add the check, let the parent do the real work. (The closure rate-limiter from Scope & Closures, reborn as a subclass.)",
            },
            {
              code: "c = LimitedClient('https://api.acme.io', 2)\nprint(c.get('/a'))\nprint(c.get('/b'))\nprint(c.get('/c'))",
              explanation:
                "Two calls pass through to the parent; the third hits the child's guard. Both layers' state (log, max_calls) cooperates in one object.",
            },
          ],
          output:
            "GET https://api.acme.io/a\nGET https://api.acme.io/b\nBLOCKED: limit reached",
        },
        {
          difficulty: "Hard",
          title: "A template method: parent runs the skeleton, children fill a step",
          scenario:
            "Every pipeline stage validates → processes → reports identically, but each PROCESSES differently — the framework pattern you'll meet in PyTorch and Airflow.",
          steps: [
            {
              code: "class Stage:\n    def run(self, rows):\n        clean = [r for r in rows if r is not None]\n        result = self.process(clean)          # the child's step\n        return f'{type(self).__name__}: {len(clean)} in -> {result}'\n\n    def process(self, rows):\n        raise NotImplementedError('subclass must define process()')",
              explanation:
                "run() is the TEMPLATE: fixed skeleton, one pluggable step. The parent calls self.process — which resolves to the CHILD's version at runtime (lookup starts at the instance's real class). The NotImplementedError base makes 'you forgot to override' a loud, named failure.",
            },
            {
              code: "class SumStage(Stage):\n    def process(self, rows):\n        return f'sum={sum(rows)}'\n\nclass MaxStage(Stage):\n    def process(self, rows):\n        return f'max={max(rows)}'",
              explanation:
                "Children override ONLY the varying step — no validation or reporting code repeated. type(self).__name__ in the parent even reports the child's name automatically.",
            },
            {
              code: "data = [4, None, 9, 2]\nfor stage in [SumStage(), MaxStage()]:\n    print(stage.run(data))",
              explanation:
                "The parent's run drives the child's process — inversion of control: 'don't call the framework; the framework calls YOU.' This is precisely how PyTorch calls your forward() and Airflow calls your execute().",
            },
          ],
          output: "SumStage: 3 in -> sum=15\nMaxStage: 3 in -> max=9",
        },
        {
          difficulty: "Industry Example",
          title: "A source hierarchy for a real ingestion pipeline",
          scenario:
            "A data platform ingests from CSV files and HTTP APIs today — and must absorb new source types monthly without touching the pipeline loop. The team's actual design: a small hierarchy plus composition where it belongs.",
          steps: [
            {
              code: "class DataSource:\n    def __init__(self, name):\n        self.name = name\n\n    def load(self):\n        raise NotImplementedError\n\n    def summary(self, rows):\n        return f'{self.name}: {len(rows)} rows'\n\nclass CsvSource(DataSource):\n    def __init__(self, name, path):\n        super().__init__(name)\n        self.path = path\n\n    def load(self):\n        return [f'{self.path}:row{i}' for i in range(3)]  # stand-in for file I/O\n\nclass ApiSource(DataSource):\n    def __init__(self, name, url):\n        super().__init__(name)\n        self.url = url\n\n    def load(self):\n        return [f'{self.url}/item{i}' for i in range(2)]",
              explanation:
                "The base defines the contract (load) and shared behavior (summary). Each child adds ITS config via super().__init__ chaining and implements ITS load. IS-A holds: both genuinely are data sources.",
            },
            {
              code: "class Pipeline:\n    def __init__(self, sources):\n        self.sources = sources     # HAS-A: composition, not inheritance\n\n    def run(self):\n        for src in self.sources:\n            rows = src.load()\n            print(src.summary(rows))",
              explanation:
                "The pipeline HAS sources — it isn't one, so it doesn't inherit. Its loop speaks only the base contract; it cannot know or care which subclasses exist.",
            },
            {
              code: "pipe = Pipeline([\n    CsvSource('sales', '/data/sales.csv'),\n    ApiSource('crm', 'https://crm.acme.io'),\n])\npipe.run()",
              explanation:
                "Next month's ParquetSource is a new subclass and one new list entry — the Pipeline class ships untouched. Inheritance for the variant family, composition for the assembly: the pairing that scales.",
            },
          ],
          output: "sales: 3 rows\ncrm: 2 rows",
        },
      ],
    },

    {
      id: "inline-practice",
      type: "inline-code",
      tocLabel: "Practice Coding",
      coding: {
        language: "python",
        filename: "shapes.py",
        instructions:
          "Build a small hierarchy: Shape has __init__(self, label) and describe() returning '<label>: area=<area()>'. Its area() raises NotImplementedError. Rectangle(label, w, h) and Circle(label, r) chain super().__init__ and override area() (circle: 3.14159 * r * r, rounded to 2). Loop a list of shapes and print each describe() — the parent method driving child area().",
        starterCode: `# TODO 1: Shape — __init__(label), describe() using self.area(), area() raising NotImplementedError
___

# TODO 2: Rectangle(Shape) — super().__init__, own w/h, area() = w * h
___

# TODO 3: Circle(Shape) — super().__init__, own r, area() = round(3.14159 * r * r, 2)
___

shapes = [Rectangle('desk', 1.2, 0.6), Circle('table', 0.5)]
for s in shapes:
    print(s.describe())`,
        solutionCode: `class Shape:
    def __init__(self, label):
        self.label = label

    def area(self):
        raise NotImplementedError('subclass must define area()')

    def describe(self):
        return f"{self.label}: area={self.area()}"

class Rectangle(Shape):
    def __init__(self, label, w, h):
        super().__init__(label)
        self.w = w
        self.h = h

    def area(self):
        return self.w * self.h

class Circle(Shape):
    def __init__(self, label, r):
        super().__init__(label)
        self.r = r

    def area(self):
        return round(3.14159 * self.r * self.r, 2)

shapes = [Rectangle('desk', 1.2, 0.6), Circle('table', 0.5)]
for s in shapes:
    print(s.describe())`,
        expectedOutput: "desk: area=0.72\ntable: area=0.79",
        hints: [
          "Shape.describe calls self.area() — at runtime that resolves to the CHILD's override",
          "Both children: super().__init__(label) first, then their own attributes",
          "Rectangle.area returns self.w * self.h (1.2 * 0.6 = 0.72)",
          "Circle.area: round(3.14159 * self.r * self.r, 2) → 0.79 for r=0.5",
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
          id: "py25_mcq_01",
          difficulty: "Easy",
          question: "class B(A): pass — what can instances of B do?",
          options: [
            "Nothing until B defines methods",
            "Everything A's instances can — B inherits all of A's methods and class attributes",
            "Only call A's __init__",
            "Only static things",
          ],
          correctIndex: 1,
          explanation:
            "The child starts as the parent under a new name: lookup climbs instance → B → A, so every A method serves B instances. Subclassing subtracts nothing.",
        },
        {
          type: "mcq",
          id: "py25_mcq_02",
          difficulty: "Easy",
          question:
            "A subclass defines __init__ with extra parameters. What must it usually do first?",
          options: [
            "Nothing special",
            "Call super().__init__(...) so the parent's attributes get set up before adding its own",
            "Copy the parent's __init__ body",
            "Delete the parent's __init__",
          ],
          correctIndex: 1,
          explanation:
            "Defining __init__ REPLACES the parent's — without the super() call, parent attributes (self.name, self.log...) never exist, and inherited methods crash with AttributeError on first use.",
        },
        {
          type: "mcq",
          id: "py25_mcq_03",
          difficulty: "Medium",
          question:
            "csv = CsvSource('sales') where CsvSource(DataSource). Which is True?",
          options: [
            "isinstance(csv, CsvSource) only",
            "isinstance(csv, DataSource) only",
            "Both — a subclass instance IS-A parent instance too",
            "Neither — isinstance ignores inheritance",
          ],
          correctIndex: 2,
          explanation:
            "isinstance walks the hierarchy: csv is a CsvSource AND a DataSource (and an object). That's what lets parent-typed code accept any child — the polymorphism guarantee in one function.",
        },
        {
          type: "scenario",
          id: "py25_sc_01",
          difficulty: "Medium",
          scenario:
            "A teammate writes class OrderReport(list) 'so we get append() for free'. Reviewing, you notice callers can now report.sort(), report.pop(), and report.reverse() — and one already does, scrambling the audit order.",
          question: "What's the design critique?",
          options: [
            "list is too slow to inherit from",
            "IS-A fails: a report isn't a kind of list, so inheriting exposes 30 list operations that violate the report's rules — compose instead: the report HAS a list of rows behind its own methods",
            "The class needs super().__init__()",
            "Reports should inherit from dict",
          ],
          correctIndex: 1,
          explanation:
            "Inheriting for convenience imports the parent's ENTIRE contract, sensible or not. Composition keeps the surface intentional: add_row() appends internally, and no caller can reverse an audit trail. Inherit for identity, compose for capability.",
        },
        {
          type: "coding",
          id: "py25_code_01",
          difficulty: "Medium",
          prompt:
            "Base class Employee: __init__(name, salary); payslip() returns '<name>: $<salary>'. Subclass Manager adds a bonus parameter (chain super().__init__) and overrides payslip() to return the parent's result plus ' +$<bonus> bonus' using super(). Print payslips for Employee('ada', 90000) and Manager('kai', 110000, 15000). Expected:\nada: $90000\nkai: $110000 +$15000 bonus",
          starterCode: "# Your code here\n",
          solutionCode:
            "class Employee:\n    def __init__(self, name, salary):\n        self.name = name\n        self.salary = salary\n\n    def payslip(self):\n        return f'{self.name}: ${self.salary}'\n\nclass Manager(Employee):\n    def __init__(self, name, salary, bonus):\n        super().__init__(name, salary)\n        self.bonus = bonus\n\n    def payslip(self):\n        return super().payslip() + f' +${self.bonus} bonus'\n\nprint(Employee('ada', 90000).payslip())\nprint(Manager('kai', 110000, 15000).payslip())",
          expectedOutput: "ada: $90000\nkai: $110000 +$15000 bonus",
          tests: [
            {
              name: "Chained __init__",
              description: "Manager calls super().__init__(name, salary) before adding bonus",
            },
            {
              name: "Extended override",
              description: "Manager.payslip builds on super().payslip(), not a rewrite",
            },
          ],
        },
        {
          type: "mcq",
          id: "py25_mcq_04",
          difficulty: "Hard",
          question:
            "Parent method run() calls self.process(). A child overrides process() only. What happens on child.run()?",
          options: [
            "The parent's process() runs — run() is parent code",
            "The CHILD's process() runs: self is the child instance, so lookup starts at the child class even from inside parent-defined methods",
            "AttributeError",
            "Both versions run",
          ],
          correctIndex: 1,
          explanation:
            "Attribute lookup always starts at the instance's actual class, regardless of where the calling code was defined. This late binding is what makes template methods (and PyTorch's forward, Airflow's execute) work: parent skeleton, child steps.",
        },
        {
          type: "scenario",
          id: "py25_sc_02",
          difficulty: "Hard",
          scenario:
            "A LimitedClient(ApiClient) subclass defines __init__(self, url, max_calls) that sets self.max_calls = max_calls — and nothing else. Calls to the inherited get() crash: AttributeError: 'LimitedClient' object has no attribute 'log'.",
          question: "Why, and what's the fix?",
          options: [
            "get() must be overridden too",
            "Defining __init__ replaced the parent's, so parent state (self.log) was never created — add super().__init__(url) as the first line",
            "log must become a class attribute",
            "max_calls shadowed log",
          ],
          correctIndex: 1,
          explanation:
            "Only ONE __init__ runs on construction — the child's, which never set up the parent's attributes. super().__init__(url) chains the setup so both layers' state exists. (A class-level log = [] would 'fix' the crash by installing the shared-mutable trap — strictly worse.)",
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
            "What does super() do, and why is super().__init__() so important in subclass constructors?",
          answer:
            "super() returns a proxy that delegates attribute lookup to the next class up the hierarchy (technically, the next in method resolution order), letting a child invoke the parent's version of a method it has overridden. Its two idioms: in an overridden method, extend rather than replace — return super().render() + suffix; and in __init__, chain construction. The chaining matters because defining __init__ in a child REPLACES the parent's — Python runs exactly one __init__ per construction — so parent attributes are simply never created unless the child explicitly calls super().__init__(...). The failure mode is deceptive: construction succeeds, and the crash arrives later as AttributeError inside some inherited method that reaches for self.log or self.name. Convention: call super().__init__ FIRST, so parent state exists before child code that might depend on it runs.",
        },
        {
          question:
            "Inheritance vs composition — how do you choose, and what goes wrong when teams over-inherit?",
          answer:
            "The test is the relationship: IS-A → inheritance (a CsvSource is a DataSource; an AuditedReport is a Report), HAS-A/USES-A → composition (a Pipeline has sources; a Report has rows). Inheritance buys polymorphism — parent-typed code runs every child — but the price is total coupling: the child imports the parent's ENTIRE contract, and every parent change ripples down. Over-inheritance failure modes: inheriting for convenience (class Report(list) exposes sort/pop/reverse that violate the domain's rules), deep towers where finding any behavior means spelunking five files, and base classes that accrete flags to serve incompatible children. Composition keeps surfaces intentional — the wrapper exposes exactly the methods that make sense — at the cost of writing small delegating methods. My defaults: inherit for a family of interchangeable VARIANTS behind one contract (the sklearn shape), compose for everything else, keep hierarchies to one or two levels, and treat 'I just want its methods' as a composition signal, never an inheritance one.",
        },
        {
          question:
            "Explain polymorphism and the template method pattern with a concrete example.",
          answer:
            "Polymorphism: code that speaks a base-class contract runs correctly for any subclass, dispatching each call to the instance's actual override — for n in notifiers: n.send(msg) formats per channel with no if-chains, and adding a channel means adding a class, not editing every dispatch site. The template method builds on one detail of Python's lookup: attribute resolution starts at the instance's REAL class even inside parent-defined code. So a parent defines the invariant skeleton — def run(self): validate; result = self.process(clean); report — and self.process resolves to whatever the child defined. The base's process raises NotImplementedError, making a forgotten override a loud, named failure instead of silent wrong behavior. This 'inversion of control' — the framework calls YOU — is the architecture of PyTorch (nn.Module.__call__ drives your forward), Airflow (BaseOperator drives your execute), and unittest (the runner drives your test methods): you write one method; inheritance wires it into machinery you never touch.",
        },
      ],
    },

    {
      id: "common-mistakes",
      type: "callout",
      variant: "warning",
      title: "Common Mistakes to Avoid",
      content:
        "1) Child __init__ without super().__init__ — parent attributes never exist; crash arrives later, elsewhere. 2) Inheriting for convenience (Report(list)) — IS-A fails, foreign methods leak; compose. 3) Overrides that change the contract — different parameter meanings or return types break every parent-typed caller. 4) Deep hierarchies — one or two levels; beyond that, refactor to composition. 5) Forgetting that parent code calling self.method() dispatches to the CHILD — both a superpower (templates) and a surprise (your override runs where you didn't expect). 6) type(x) == Parent checks — use isinstance, which honors subclasses.",
    },

    {
      id: "ai-tutor",
      type: "callout",
      variant: "tip",
      title: "Ask the AI Tutor",
      content:
        "Try these prompts in the AI Tutor panel: • 'Quiz me: IS-A or HAS-A for these eight designs?' • 'Trace this method call up the hierarchy step by step.' • 'Show me the missing-super().__init__ bug and its delayed crash.' • 'Refactor this if-elif type-switch into polymorphic classes with me.' • 'Interview mode: ask me inheritance vs composition and grade my answer.'",
    },

    {
      id: "glossary",
      type: "callout",
      variant: "info",
      title: "Glossary",
      content:
        "Inheritance — a class building on another, reusing its behavior. Parent/base class — the class inherited from. Child/subclass — the inheriting class (class B(A):). Override — redefining a parent method; child wins lookup. super() — proxy to the next class up; super().__init__ chains construction. IS-A / HAS-A — the inherit-vs-compose test. Composition — holding other objects as attributes instead of inheriting. Polymorphism — one call, per-subclass behavior. Template method — parent skeleton calling child-overridden steps. NotImplementedError — the base's 'you must override this' signal. MRO — method resolution order for multiple inheritance. Liskov principle — overrides must honor the parent's contract.",
    },

    {
      id: "resources",
      type: "callout",
      variant: "info",
      title: "Recommended Resources",
      content:
        "• Docs: 'Inheritance' in the official tutorial's classes chapter (9.5–9.6). • Read: sklearn's 'Developing scikit-learn estimators' — watch BaseEstimator + mixins hand you fit/predict machinery. • Practice: take the Notifier example and add a PagerDutyNotifier WITHOUT touching the loop — feel the open-for-extension payoff. • Next in DSM: children can override anything — so how do objects protect their internals? Encapsulation & Properties covers naming conventions, @property, and validated attributes.",
    },

    {
      id: "recap",
      type: "recap",
      tocLabel: "Recap",
      content:
        "✓ class Child(Parent) inherits everything; lookup climbs instance → child → parent → object.\n✓ Override to change HOW (honor the contract); extend with super().method().\n✓ Child __init__ must chain super().__init__ — or parent state never exists.\n✓ isinstance honors the tree: a child IS-A parent everywhere parent-typed code runs.\n✓ Parent code calling self.step() dispatches to child overrides — the template pattern behind PyTorch/Airflow.\n✓ Inherit for variant families (IS-A); compose for assemblies (HAS-A); stay shallow.\n\nNext up: Encapsulation & Properties. Inheritance shares internals freely — now learn to protect them: private-by-convention naming, @property for computed attributes, and setters that validate.",
    },
  ],
};
