import type { Lesson } from "@/lib/curriculum/types";

export const dictionaries: Lesson = {
  meta: {
    id: "python.data-structures.dictionaries",
    slug: "dictionaries",
    title: "Dictionaries",
    description:
      "Key→value lookup — the structure behind JSON, API responses, counters, and most of the Python you'll read for the rest of your career.",
    estimatedTime: "35 mins",
    difficulty: "Beginner",
    xpReward: 60,
    prerequisites: ["python.data-structures.tuples"],
    masteryThreshold: 80,
  },

  blocks: [
    {
      id: "intro",
      type: "lesson-intro",
      tocLabel: "Introduction",
      intro: {
        hook: "Finding one customer in a list of a million records means checking rows until you hit it. Finding them in a dictionary means asking by name — instantly, whether there are a hundred entries or a hundred million. That lookup-by-name superpower is why dicts are everywhere: configs, JSON, API responses, pandas' internals.",
        what: "A dictionary maps KEYS to VALUES: {'name': 'Ada', 'plan': 'pro'}. You store by key, retrieve by key, and update by key — no positions, no scanning. Keys must be immutable (strings, numbers, tuples); values can be anything.",
        why: "Data IS key→value at every scale: a user profile, a config file, a JSON API response, a row with named columns, a count per category. Fluency with dicts — including .get(), .items(), and the counting pattern — is the single highest-leverage Python skill for data work.",
        whereUsed:
          "JSON payloads, configuration, counting/grouping (the heart of analytics), lookup tables, function kwargs, and pandas' column-oriented core.",
        objectives: [
          "Create, read, update, and delete dict entries",
          "Handle missing keys safely with in, .get(), and defaults",
          "Iterate keys, values, and .items() pairs",
          "Build the counting and grouping patterns from scratch",
          "Recognize dicts as the Python face of JSON",
        ],
        realWorldApps: [
          {
            company: "Stripe",
            headline: "Every API response",
            detail:
              "A Stripe charge arrives as JSON — in Python, a dict: charge['amount'], charge['currency'], charge['metadata']['order_id']. Payment integrations are dict navigation.",
          },
          {
            company: "Netflix",
            headline: "Feature flags & config",
            detail:
              "Service configuration ships as nested dicts — flags, limits, rollout percentages — read by key at startup. A typo'd key raising KeyError loudly beats a silent wrong default.",
          },
          {
            company: "spaCy",
            headline: "Word counts at NLP scale",
            detail:
              "Vocabulary building is the counting pattern: one pass over tokens, counts[word] = counts.get(word, 0) + 1 — the exact loop you'll write today, industrialized.",
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
            "Create with braces and colons: user = {'name': 'Ada', 'logins': 42}. Read with square brackets by KEY: user['name']. Assign to add or overwrite: user['plan'] = 'pro' inserts a new pair; user['logins'] = 43 replaces. Delete with del user['plan']. len() counts pairs; `in` tests KEYS.",
        },
        {
          type: "code-note",
          code: "user = {'name': 'Ada', 'logins': 42}\nprint(user['name'])       # read by key\nuser['plan'] = 'pro'      # insert\nuser['logins'] += 1       # update in place\nprint(user)\nprint('plan' in user)     # membership tests KEYS",
          content:
            "The bracket syntax looks like list indexing, but the meaning is different: user['name'] is a lookup by NAME, not position. Dicts preserve insertion order (guaranteed since Python 3.7), but you should think in keys, not positions.",
        },
        {
          type: "analogy",
          title: "The coat check",
          content:
            "A dictionary is a coat check. You hand over a coat (value) and get a numbered ticket (key). Retrieval is instant: present ticket 47, receive that exact coat — the attendant doesn't rummage through every rack (that's the list-scan you're escaping). Two coats can be identical, but tickets are unique: hand in a second coat under ticket 47 and it REPLACES the first. And a made-up ticket gets you an apologetic shrug — KeyError.",
        },
        {
          type: "keypoint",
          title: "Missing keys: pick your policy",
          content:
            "user['age'] on an absent key raises KeyError — loud, immediate, often exactly right (a missing config key SHOULD crash at startup). When absence is normal, choose deliberately: `if 'age' in user:` to test first, or user.get('age') for None, or user.get('age', 0) for a fallback. The counting pattern is built on that third form. Rule of thumb: [] when the key MUST exist, .get() when it may not.",
        },
        {
          type: "code-note",
          code: "votes = ['py', 'sql', 'py', 'r', 'py', 'sql']\ncounts = {}\nfor lang in votes:\n    counts[lang] = counts.get(lang, 0) + 1\nprint(counts)",
          content:
            "THE canonical dict pattern: count occurrences in one pass. .get(lang, 0) reads the current tally or 0 for first-timers; the assignment writes it back plus one. Every groupby you'll ever run is this loop wearing a suit.",
        },
        {
          type: "text",
          content:
            "Iteration comes in three flavors: `for key in d:` walks keys; `for v in d.values():` walks values; `for k, v in d.items():` walks (key, value) TUPLES — unpacked in the header, exactly the skill from last lesson. .items() is the one you'll use most: nearly every dict loop wants both halves.",
        },
        {
          type: "expandable",
          title: "Why keys must be immutable",
          content:
            "Dicts find keys by HASHING — computing a number from the key's value that says where to look, which is how lookup stays instant at any size. If a key could mutate, its hash would change and the stored entry would be lost in the wrong bucket. So keys must be hashable: strings, numbers, and tuples-of-immutables qualify; lists and dicts don't. This is the payoff foreshadowed last lesson — ('sensor-7', '2026-07-14') works as a composite key precisely because tuples are immutable.",
        },
        {
          type: "warning",
          title: "JSON ≈ dicts, and two sharp edges",
          content:
            "Every JSON object you'll ever receive becomes a Python dict (json.loads) and back (json.dumps) — master dicts and you've mastered API data. Two edges to respect: (1) assigning to an existing key silently OVERWRITES — building a lookup from data with duplicate keys keeps only the last one, a classic silent data loss; (2) `for k in d: del d[k]` — mutating a dict while iterating it — raises RuntimeError; collect keys first or build a new dict.",
        },
      ],
    },

    {
      id: "diagram",
      type: "interactive-diagram",
      tocLabel: "Visual Learning",
      visual: {
        kind: "flow",
        title: "What happens on counts['py'] — hit vs miss",
        caption:
          "One lookup, two possible outcomes, three policies for the miss. Click each node.",
        nodes: [
          {
            id: "key",
            label: "counts['py']",
            sublabel: "lookup by key",
            detail:
              "Python hashes 'py' and jumps straight to its bucket — no scanning. This is why dict lookup speed doesn't degrade as the dict grows.",
            x: 10,
            y: 40,
            accent: false,
          },
          {
            id: "hit",
            label: "key exists",
            sublabel: "→ its value",
            detail: "The stored value comes back instantly: 3.",
            x: 38,
            y: 18,
            accent: false,
          },
          {
            id: "miss",
            label: "key absent",
            sublabel: "→ policy time",
            detail:
              "The bracket lookup raises KeyError. Whether that's a bug or a feature depends on your data — so Python gives you three policies.",
            x: 38,
            y: 62,
            accent: true,
          },
          {
            id: "brackets",
            label: "d[k] → KeyError",
            sublabel: "loud",
            detail:
              "Right when the key MUST exist (config, schema). Crashing at the source beats a silent wrong value downstream.",
            x: 68,
            y: 30,
            accent: false,
          },
          {
            id: "get",
            label: ".get(k) → None",
            sublabel: "quiet",
            detail:
              "Right when absence is normal and None is a workable answer — pair with `is not None` checks.",
            x: 68,
            y: 58,
            accent: false,
          },
          {
            id: "default",
            label: ".get(k, 0) → fallback",
            sublabel: "self-healing",
            detail:
              "Right for accumulation: first-timers start from the fallback. The counting pattern lives here.",
            x: 68,
            y: 86,
            accent: false,
          },
        ],
        edges: [
          { from: "key", to: "hit", label: "found" },
          { from: "key", to: "miss", label: "not found" },
          { from: "miss", to: "brackets" },
          { from: "miss", to: "get" },
          { from: "miss", to: "default" },
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
          title: "Create, read, update",
          scenario: "A product record with named fields.",
          steps: [
            {
              code: "product = {'sku': 'KB-201', 'price': 49.99, 'stock': 12}\nprint(product['price'])",
              explanation:
                "Read by key name — no remembering that price is 'position 1'. Names beat positions for anything with more than two fields.",
            },
            {
              code: "product['stock'] -= 1\nproduct['category'] = 'accessories'\nprint(product)",
              explanation:
                "-= updates an existing value in place; assigning a NEW key inserts it. Same syntax, two operations — existence decides which.",
            },
          ],
          output:
            "49.99\n{'sku': 'KB-201', 'price': 49.99, 'stock': 11, 'category': 'accessories'}",
        },
        {
          difficulty: "Easy",
          title: "Safe lookups with .get()",
          scenario: "Read optional fields from a user profile without crashing.",
          steps: [
            {
              code: "profile = {'name': 'Kai', 'email': 'kai@example.com'}\nprint(profile.get('phone'))\nprint(profile.get('phone', 'not provided'))",
              explanation:
                "No 'phone' key: .get() returns None, or your fallback. Compare profile['phone'] — an immediate KeyError.",
            },
            {
              code: "if 'email' in profile:\n    print(f\"contact: {profile['email']}\")",
              explanation:
                "`in` tests key existence — the third policy. After a positive test, bracket access is guaranteed safe.",
            },
          ],
          output: "None\nnot provided\ncontact: kai@example.com",
        },
        {
          difficulty: "Medium",
          title: "The counting pattern + a report loop",
          scenario: "Which error codes dominate today's log? Count, then report sorted by frequency.",
          steps: [
            {
              code: "codes = [500, 404, 500, 403, 404, 500, 500]\ntally = {}\nfor code in codes:\n    tally[code] = tally.get(code, 0) + 1",
              explanation:
                "One pass, one dict: keys are the distinct codes, values are their counts. Integer keys are as valid as strings — any immutable works.",
            },
            {
              code: "for code, n in sorted(tally.items(), key=lambda kv: -kv[1]):\n    print(f'{code}: {n}')",
              explanation:
                ".items() yields (key, value) tuples; the lambda sorts by count descending (negation trick). Count-then-sort-by-value is the shape of every 'top N' report.",
            },
          ],
          output: "500: 4\n404: 2\n403: 1",
        },
        {
          difficulty: "Hard",
          title: "Grouping: from flat rows to a dict of lists",
          scenario:
            "Group transactions by region — the manual version of df.groupby(), and the pattern behind it.",
          steps: [
            {
              code: "txs = [('north', 120.0), ('south', 80.0), ('north', 45.5), ('west', 210.0), ('south', 65.0)]",
              explanation: "Flat (region, amount) tuples, as a feed would deliver them.",
            },
            {
              code: "groups = {}\nfor region, amount in txs:\n    if region not in groups:\n        groups[region] = []\n    groups[region].append(amount)\nprint(groups)",
              explanation:
                "The grouping pattern: ensure the key has an empty list, then append. (dict.setdefault(region, []).append(amount) is the one-line version — same semantics.) Unlike counting, values here are LISTS that grow.",
            },
            {
              code: "for region, amounts in groups.items():\n    print(f'{region}: {len(amounts)} txs, avg ${sum(amounts) / len(amounts):.2f}')",
              explanation:
                "Aggregate per group after grouping. groupby('region')['amount'].mean() in pandas IS this — grouping into buckets, then reducing each bucket.",
            },
          ],
          output:
            "{'north': [120.0, 45.5], 'south': [80.0, 65.0], 'west': [210.0]}\nnorth: 2 txs, avg $82.75\nsouth: 2 txs, avg $72.50\nwest: 1 txs, avg $210.00",
        },
        {
          difficulty: "Industry Example",
          title: "Navigating a nested API response",
          scenario:
            "A data analyst consumes a payments API. The JSON arrives as nested dicts and lists; the job is to walk it safely and extract a summary — the daily bread of API integration.",
          steps: [
            {
              code: "response = {\n    'status': 'ok',\n    'customer': {'id': 'C-88', 'tier': 'pro'},\n    'charges': [\n        {'amount': 4999, 'currency': 'usd', 'paid': True},\n        {'amount': 1250, 'currency': 'usd', 'paid': False},\n        {'amount': 830,  'currency': 'usd', 'paid': True},\n    ],\n}",
              explanation:
                "The universal shape: dicts holding dicts holding lists of dicts. (Amounts in cents — the integer-money convention from the Foundations rounding lesson.)",
            },
            {
              code: "tier = response['customer']['tier']\nprint(f\"tier: {tier}\")",
              explanation:
                "Chained brackets walk one level at a time: response['customer'] is itself a dict, so another ['tier'] goes deeper. Read chains left to right.",
            },
            {
              code: "paid_total = 0\nfor charge in response['charges']:\n    if charge.get('paid', False):\n        paid_total += charge['amount']\nprint(f'paid: ${paid_total / 100:.2f}')",
              explanation:
                "The list of dicts is looped; .get('paid', False) treats a MISSING flag as unpaid — a deliberate policy choice, stated in code. Cents divide to dollars only at the display edge.",
            },
            {
              code: "summary = {'customer_id': response['customer']['id'], 'paid_usd': paid_total / 100}\nprint(summary)",
              explanation:
                "The output is... another dict, ready to be json.dumps'd onward. Dicts in, dicts out — that's API work.",
            },
          ],
          output:
            "tier: pro\npaid: $58.29\n{'customer_id': 'C-88', 'paid_usd': 58.29}",
        },
      ],
    },

    {
      id: "inline-practice",
      type: "inline-code",
      tocLabel: "Practice Coding",
      coding: {
        language: "python",
        filename: "inventory.py",
        instructions:
          "Run a small warehouse ledger. Starting from an empty dict, process a list of ('item', qty) movements (negative = shipped out). Build the stock levels with .get(), then print each item and its final level, plus a LOW STOCK warning list for anything below 5.",
        starterCode: `movements = [('bolt', 20), ('nut', 8), ('bolt', -6), ('washer', 3), ('nut', -5), ('bolt', -4)]

# TODO 1: build stock — accumulate each movement with .get(item, 0)
stock = {}
___

# TODO 2: print '<item>: <qty>' for each item (insertion order)
___

# TODO 3: low — list of item names with stock below 5
low = ___
print(f"LOW STOCK: {low}")`,
        solutionCode: `movements = [('bolt', 20), ('nut', 8), ('bolt', -6), ('washer', 3), ('nut', -5), ('bolt', -4)]

stock = {}
for item, qty in movements:
    stock[item] = stock.get(item, 0) + qty

for item, qty in stock.items():
    print(f"{item}: {qty}")

low = [item for item, qty in stock.items() if qty < 5]
print(f"LOW STOCK: {low}")`,
        expectedOutput: "bolt: 10\nnut: 3\nwasher: 3\nLOW STOCK: ['nut', 'washer']",
        hints: [
          "The accumulation is the counting pattern with qty instead of 1: stock[item] = stock.get(item, 0) + qty",
          "Unpack the movements in the loop header: for item, qty in movements:",
          "TODO 2 iterates stock.items() and unpacks each (item, qty) pair",
          "TODO 3 is a comprehension over .items() with a qty < 5 filter, keeping just the names",
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
          id: "py19_mcq_01",
          difficulty: "Easy",
          question: "d = {'a': 1}; print(d['b']) — what happens?",
          options: [
            "Prints None",
            "Prints 0",
            "Raises KeyError",
            "Adds 'b' with value None",
          ],
          correctIndex: 2,
          explanation:
            "Bracket access on a missing key is loud: KeyError. d.get('b') is the quiet variant returning None. Reading never inserts.",
        },
        {
          type: "mcq",
          id: "py19_mcq_02",
          difficulty: "Easy",
          question: "Which CANNOT be a dictionary key?",
          options: [
            "('lat', 'lon') — a tuple of strings",
            "42",
            "['a', 'b'] — a list",
            "'user_id'",
          ],
          correctIndex: 2,
          explanation:
            "Keys must be hashable, which requires immutability — lists can change, so their hash can't be trusted. Tuples of immutables, numbers, and strings all qualify.",
        },
        {
          type: "mcq",
          id: "py19_mcq_03",
          difficulty: "Medium",
          question:
            "counts = {}; then for each word: counts[word] = counts.get(word, 0) + 1. What does .get(word, 0) do for a word seen before?",
          options: [
            "Returns 0, resetting the count",
            "Returns the current count — the default 0 is ignored when the key exists",
            "Raises KeyError",
            "Inserts the key with value 0",
          ],
          correctIndex: 1,
          explanation:
            "The default only applies on a MISS. Existing keys return their stored value, so the pattern increments veterans and initializes rookies with one line. .get never inserts anything.",
        },
        {
          type: "scenario",
          id: "py19_sc_01",
          difficulty: "Medium",
          scenario:
            "You build a lookup from a CSV: for row in rows: emails[row_name] = row_email. The file has 1,048 rows but len(emails) is 973, and no error was raised.",
          question: "What most likely happened?",
          options: [
            "Python dropped rows randomly",
            "75 names appeared more than once — later assignments silently overwrote earlier ones",
            "The dict hit a size limit",
            "Some emails were None, which dicts reject",
          ],
          correctIndex: 1,
          explanation:
            "Assigning to an existing key replaces its value with zero fuss — duplicate names collapse to one entry each. When building lookups from real data, count both sides or group into lists to detect duplicates deliberately.",
        },
        {
          type: "coding",
          id: "py19_code_01",
          difficulty: "Medium",
          prompt:
            "grades = {'mia': 88, 'kai': 61, 'ada': 95}. Print each student as '<name>: <grade>' (insertion order), then print the name of the top scorer using max with a key. Expected:\nmia: 88\nkai: 61\nada: 95\ntop: ada",
          starterCode: "grades = {'mia': 88, 'kai': 61, 'ada': 95}\n# Your code here\n",
          solutionCode:
            "grades = {'mia': 88, 'kai': 61, 'ada': 95}\nfor name, grade in grades.items():\n    print(f'{name}: {grade}')\ntop = max(grades, key=grades.get)\nprint(f'top: {top}')",
          expectedOutput: "mia: 88\nkai: 61\nada: 95\ntop: ada",
          tests: [
            {
              name: "Iterates items()",
              description: "The loop unpacks (name, grade) pairs from .items()",
            },
            {
              name: "max over keys by value",
              description:
                "max(grades, key=grades.get) — iterating a dict yields keys; the key function looks up each one's value",
            },
          ],
        },
        {
          type: "mcq",
          id: "py19_mcq_04",
          difficulty: "Hard",
          question:
            "Why is looking up one key in a dict of 10 million entries about as fast as in a dict of 10?",
          options: [
            "Python secretly sorts dicts for binary search",
            "Hashing the key computes where the entry lives, so lookup jumps straight there instead of scanning",
            "Dicts cache the most recent lookups",
            "It isn't — lookups slow down linearly with size",
          ],
          correctIndex: 1,
          explanation:
            "The hash function maps each key to a bucket location — lookup is a computation, not a search. This constant-time behavior is why 'is X in this list?' should become a dict (or set — next lesson) the moment the list is large or the question repeats.",
        },
        {
          type: "coding",
          id: "py19_code_02",
          difficulty: "Hard",
          prompt:
            "orders = [('mia', 'espresso'), ('kai', 'latte'), ('mia', 'latte'), ('ada', 'espresso'), ('mia', 'mocha')]. Group into a dict of customer → list of drinks, then print each customer as '<name> ordered <n>: <drinks joined by, >'. Expected:\nmia ordered 3: espresso, latte, mocha\nkai ordered 1: latte\nada ordered 1: espresso",
          starterCode:
            "orders = [('mia', 'espresso'), ('kai', 'latte'), ('mia', 'latte'), ('ada', 'espresso'), ('mia', 'mocha')]\n# Your code here\n",
          solutionCode:
            "orders = [('mia', 'espresso'), ('kai', 'latte'), ('mia', 'latte'), ('ada', 'espresso'), ('mia', 'mocha')]\nby_customer = {}\nfor name, drink in orders:\n    if name not in by_customer:\n        by_customer[name] = []\n    by_customer[name].append(drink)\nfor name, drinks in by_customer.items():\n    print(f\"{name} ordered {len(drinks)}: {', '.join(drinks)}\")",
          expectedOutput:
            "mia ordered 3: espresso, latte, mocha\nkai ordered 1: latte\nada ordered 1: espresso",
          tests: [
            {
              name: "Grouping pattern",
              description: "Ensures an empty list per new key, then appends",
            },
            {
              name: "Joined output",
              description: "', '.join(drinks) renders each customer's list",
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
            "Why are dictionary lookups so fast, and what constraint on keys does that speed impose?",
          answer:
            "Dicts are hash tables: inserting a key hashes it — computes an integer from its value — which determines the bucket where the entry is stored. Lookup repeats the hash and jumps straight to that bucket, so the cost is essentially constant whether the dict holds ten entries or ten million, versus a list scan that grows linearly. The constraint follows directly: keys must be HASHABLE, meaning their hash can never change, which effectively means immutable — strings, numbers, tuples of immutables. A mutable key like a list would leave its entry stranded in a stale bucket the moment it changed, so Python rejects it up front with TypeError: unhashable. That's also the practical answer to 'why tuples as composite keys': ('store-12', '2026-07-14') is frozen, so it hashes reliably forever.",
        },
        {
          question:
            "Compare the three ways to handle a possibly-missing key. When is each right?",
          answer:
            "Bracket access — d[k] — raises KeyError on a miss: right when the key is REQUIRED, like a config value or schema field, because failing loudly at the source beats propagating a silent default into downstream computations. .get(k) returns None quietly: right when absence is a normal state and the caller will branch on it, tested with `is not None` when falsy values are legitimate. .get(k, default) returns a fallback: right for accumulation and display — counts.get(word, 0) + 1 is the canonical counting pattern, initializing first-timers and incrementing veterans in one expression. The interview-grade point: this is a POLICY decision about your data, made explicit in syntax — reaching for .get everywhere 'to be safe' actually hides real bugs that brackets would have caught on day one.",
        },
        {
          question:
            "Sketch how you'd group a list of records by a field using plain dicts, and relate it to groupby.",
          answer:
            "One pass with a dict of lists: create an empty dict; for each record, extract the group key; if the key isn't present, initialize it with an empty list (or use setdefault(key, []) to do both steps at once); append the record. Afterwards, iterate .items() and reduce each bucket — sum, mean, count — into your result. That two-phase shape, partition-then-aggregate, is exactly what df.groupby('region')['amount'].mean() performs: pandas partitions rows into per-key buckets and applies the reduction per bucket, just vectorized and optimized. Knowing the manual version matters for three reasons: it works when data isn't tabular (nested JSON, streaming events), it demystifies groupby's semantics — including why the group key becomes the index — and it's a standard interview warm-up where the counting variant (values as ints) and grouping variant (values as lists) show you understand that a dict's value can be any accumulator you choose.",
        },
      ],
    },

    {
      id: "common-mistakes",
      type: "callout",
      variant: "warning",
      title: "Common Mistakes to Avoid",
      content:
        "1) d[key] on optional data — KeyError; choose your missing-key policy deliberately. 2) Building lookups from data with duplicate keys — later rows silently overwrite earlier ones; count both sides. 3) Using a list as a key — unhashable TypeError; a tuple works. 4) Mutating a dict while iterating it — RuntimeError; iterate a copy of the keys or build a new dict. 5) Expecting `in` to test values — it tests KEYS; use `in d.values()` explicitly. 6) .get() everywhere 'for safety' — required keys deserve the loud failure of brackets.",
    },

    {
      id: "ai-tutor",
      type: "callout",
      variant: "tip",
      title: "Ask the AI Tutor",
      content:
        "Try these prompts in the AI Tutor panel: • 'Quiz me: bracket, .get(), or in — which policy fits each of these six situations?' • 'Walk me through the counting pattern on a fresh dataset.' • 'Show a nested JSON payload and drill me on extracting fields.' • 'Explain hashing with a diagram-in-words.' • 'Interview mode: ask me to group records by a field and grade my code.'",
    },

    {
      id: "glossary",
      type: "callout",
      variant: "info",
      title: "Glossary",
      content:
        "Dictionary (dict) — a mutable mapping of unique keys to values. Key — the immutable lookup handle; hashed for instant access. Value — the data stored under a key; any type. KeyError — raised by d[k] when k is absent. .get(k, default) — lookup with a fallback, never raises. .items()/.keys()/.values() — iteration views. Hashable — has a stable hash; required for keys. Counting pattern — d[k] = d.get(k, 0) + 1. Grouping pattern — dict of lists, append per key. setdefault(k, v) — get k's value, inserting v first if absent. JSON — the text format whose objects map to dicts.",
    },

    {
      id: "resources",
      type: "callout",
      variant: "info",
      title: "Recommended Resources",
      content:
        "• Docs: 'Dictionaries' in the official Python tutorial and the dict methods reference. • Read: collections.Counter docs — the standard library's professional counting pattern (Counter(votes).most_common(3)). • Practice: take any API's example JSON response and extract three nested fields, choosing bracket vs .get() deliberately for each. • Next in DSM: dicts give you unique KEYS — Sets take just that uniqueness and make it a structure of its own: membership, dedup, and set algebra.",
    },

    {
      id: "recap",
      type: "recap",
      tocLabel: "Recap",
      content:
        "✓ Dicts map immutable keys to any values; brackets read/insert/overwrite by key.\n✓ Lookup is hash-powered: constant-time at any size — think in keys, not positions.\n✓ Missing keys are a policy: [] loud, .get() quiet, .get(k, default) self-healing.\n✓ The counting pattern (get(k, 0) + 1) and grouping pattern (dict of lists) power all analytics.\n✓ .items() + unpacking is how dict loops are written.\n✓ JSON objects ARE dicts in Python — API work is dict navigation.\n\nNext up: Sets. Strip a dict down to just its unique keys and you get the set — instant membership tests, one-line deduplication, and the union/intersection algebra of comparing groups.",
    },
  ],
};
