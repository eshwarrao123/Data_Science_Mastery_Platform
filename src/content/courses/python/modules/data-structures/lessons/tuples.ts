import type { Lesson } from "@/lib/curriculum/types";

export const tuples: Lesson = {
  meta: {
    id: "python.data-structures.tuples",
    slug: "tuples",
    title: "Tuples",
    description:
      "The immutable sequence you've been using all along — fixed-shape records, safe returns, and why unchangeable is a feature.",
    estimatedTime: "20 mins",
    difficulty: "Beginner",
    xpReward: 50,
    prerequisites: ["python.functions.parameters-and-return-values"],
    masteryThreshold: 80,
  },

  blocks: [
    {
      id: "intro",
      type: "lesson-intro",
      tocLabel: "Introduction",
      intro: {
        hook: "You've already used tuples a dozen times without a formal introduction: every multi-value return, every enumerate() pair, every (city, revenue, cost) record in the exercises. Time to meet them properly — and learn why 'you can't change it' is the selling point, not the drawback.",
        what: "A tuple is an ordered, IMMUTABLE sequence: (lat, lon), ('mia', 990, 88). Indexing and slicing work exactly like lists — but once created, a tuple's contents can never change.",
        why: "Immutability is a guarantee. A function that returns a tuple promises nobody downstream can quietly edit it; a coordinate pair can't lose its longitude; a record's shape is stable. Data code is full of fixed-shape facts, and tuples are their honest container.",
        whereUsed:
          "Multiple return values, (row, col) coordinates, database rows, RGB colors, dictionary keys (coming next lesson!), and enumerate/zip pairs.",
        objectives: [
          "Create tuples — including the one-element trap",
          "Index, slice, and unpack tuples fluently",
          "Choose tuple vs list by mutability and meaning",
          "Explain why immutability makes tuples safe to share",
          "Use tuples as fixed-shape records in data code",
        ],
        realWorldApps: [
          {
            company: "Uber",
            headline: "Coordinates as tuples",
            detail:
              "A pickup point is (latitude, longitude) — two values whose ORDER is the meaning and which must never be partially edited. Location pipelines pass millions of such pairs hourly.",
          },
          {
            company: "PostgreSQL + psycopg",
            headline: "Database rows",
            detail:
              "Python's standard database drivers return each query row as a tuple — cursor.fetchall() hands you a list of tuples, the exact shape you've practiced unpacking.",
          },
          {
            company: "Matplotlib",
            headline: "figsize=(10, 6)",
            detail:
              "Chart dimensions, axis ranges, and RGB colors are all passed as tuples — small fixed-shape values where mutation would only ever be a bug.",
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
            "Create tuples with parentheses: point = (3, 4). Actually, the COMMA does the work — 3, 4 is already a tuple; the parentheses just make it readable (and are required in many contexts). Access is list-like: point[0], point[-1], point[1:]. len(), in, and iteration all work identically to lists.",
        },
        {
          type: "code-note",
          code: "reading = ('sensor-7', 21.5, 'ok')\nprint(reading[0])     # sensor-7\nprint(reading[-1])    # ok\nprint(len(reading))   # 3\n\n# reading[1] = 22.0   # TypeError: does not support item assignment",
          content:
            "Everything you know about indexing transfers. The one new fact is the last line: assignment into a tuple raises TypeError. There's no .append(), no .remove(), no way in.",
        },
        {
          type: "analogy",
          title: "The laminated card",
          content:
            "A list is a whiteboard: anyone with a marker can add, erase, reorder. A tuple is a laminated card: printed once, then sealed. You hand a whiteboard to a colleague nervously — what will it say when it comes back? You hand a laminated card to anyone, any number of times, without a second thought. That difference in TRUST is the entire point of immutability.",
        },
        {
          type: "keypoint",
          title: "Tuple = record, list = collection",
          content:
            "The deeper distinction is semantic. A tuple is a fixed-SHAPE record where each POSITION has its own meaning: (lat, lon), (name, score, minutes) — position 2 is always minutes, and length 3 is part of the meaning. A list is a variable-length collection of LIKE items: readings, names, prices — every element means the same kind of thing and the count varies. Ask 'do positions have distinct meanings?' and the choice makes itself.",
        },
        {
          type: "code-note",
          code: "# One-element tuple: the comma, not the parens\nsingle = (42,)\nnot_a_tuple = (42)      # just the int 42 in parentheses!\nprint(type(single).__name__, type(not_a_tuple).__name__)\n\nempty = ()\nprint(len(empty))",
          content:
            "(42) is arithmetic grouping; (42,) is a tuple. Forgetting the trailing comma is THE classic tuple typo — usually surfacing later as 'TypeError: object is not iterable'.",
        },
        {
          type: "text",
          content:
            "Unpacking — which you've done since enumerate() — assigns a tuple's elements to names in one line: name, score, mins = entry. Python also swaps variables with it (a, b = b, a: the right side builds a tuple, the left unpacks it) and offers a starred rest: first, *rest = values collects leftovers into a list.",
        },
        {
          type: "expandable",
          title: "Immutable ≠ frozen contents",
          content:
            "A tuple fixes WHICH objects it holds, not those objects' internals. row = ('alice', [88, 92]) can't be re-pointed — row[1] = [] fails — but row[1].append(75) succeeds, because the LIST inside is still a mutable list. The tuple's promise is about its slots, not about what mutable objects in those slots do. For truly-fixed data, keep tuple contents immutable too (strings, numbers, other tuples).",
        },
        {
          type: "warning",
          title: "Building a tuple item-by-item is fighting the tool",
          content:
            "There's no .append() — so code that 'grows' a tuple actually rebuilds it from scratch each time (t = t + (x,)), copying everything, every iteration. If you're accumulating, you want a list; convert at the end with tuple(items) if immutability matters. tuple(list_) and list(tuple_) convert freely in both directions.",
        },
      ],
    },

    {
      id: "diagram",
      type: "interactive-diagram",
      tocLabel: "Visual Learning",
      visual: {
        kind: "comparison",
        title: "Tuple vs list: the decision",
        caption:
          "Same syntax family, different contracts. Click each side, then the test in the middle.",
        nodes: [
          {
            id: "tuple",
            label: "tuple ( )",
            sublabel: "immutable record",
            detail:
              "Fixed length, positions with distinct meanings, sealed after creation. Safe to share, safe to return, usable as a dict key. (lat, lon), (name, score), a database row.",
            x: 20,
            y: 30,
            accent: true,
          },
          {
            id: "list",
            label: "list [ ]",
            sublabel: "mutable collection",
            detail:
              "Variable length, homogeneous items, grows and shrinks with .append()/.remove(). The accumulator of choice — and the wrong tool for fixed-shape facts.",
            x: 80,
            y: 30,
            accent: false,
          },
          {
            id: "test",
            label: "the two questions",
            sublabel: "shape? trust?",
            detail:
              "Q1: Do positions have individual meanings and a fixed count? → tuple. Q2: Must receivers be unable to modify it? → tuple. Everything else — accumulating, filtering, sorting in place — wants a list.",
            x: 50,
            y: 68,
            accent: false,
          },
        ],
        edges: [
          { from: "tuple", to: "test", label: "record" },
          { from: "list", to: "test", label: "collection" },
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
          title: "Create, index, fail to mutate",
          scenario: "An RGB color as a tuple — and proof it's sealed.",
          steps: [
            {
              code: "brand_blue = (52, 120, 246)\nprint(brand_blue[0])\nprint(brand_blue[1:])",
              explanation:
                "Indexing and slicing work exactly as on lists — a slice of a tuple is a new tuple.",
            },
            {
              code: "try:\n    brand_blue[0] = 99\nexcept TypeError as e:\n    print(f'blocked: {e}')",
              explanation:
                "Mutation raises TypeError — the brand color survives every function it's passed through. (try/except gets its own lesson in Error Handling; here it just catches the proof.)",
            },
          ],
          output:
            "52\n(120, 246)\nblocked: 'tuple' object does not support item assignment",
        },
        {
          difficulty: "Easy",
          title: "Unpacking and the one-line swap",
          scenario: "Work with a (city, temperature) record, then swap two rankings.",
          steps: [
            {
              code: "record = ('oslo', -3.5)\ncity, temp = record\nprint(f'{city}: {temp}°C')",
              explanation:
                "Unpacking names the positions — after this line the tuple's anonymous slots have readable names. Count must match, or ValueError.",
            },
            {
              code: "first, second = 'python', 'sql'\nfirst, second = second, first\nprint(first, second)",
              explanation:
                "The famous swap: the right side packs a tuple ('sql', 'python'), the left unpacks it. No temp variable — this IS tuple machinery.",
            },
          ],
          output: "oslo: -3.5°C\nsql python",
        },
        {
          difficulty: "Medium",
          title: "Tuples as rows: iterate and unpack together",
          scenario: "Compute revenue per region from (region, units, unit_price) rows.",
          steps: [
            {
              code: "rows = [\n    ('north', 120, 9.99),\n    ('south', 85, 12.50),\n    ('west', 210, 7.25),\n]",
              explanation:
                "A list OF tuples — the standard shape for tabular data before pandas: the collection varies in length (list), each record has fixed meaning (tuple).",
            },
            {
              code: "for region, units, price in rows:\n    print(f'{region}: ${units * price:,.2f}')",
              explanation:
                "Unpacking in the for header: each 3-tuple splits into three named parts per iteration. Compare row[1] * row[2] — legal, but the names carry the meaning.",
            },
            {
              code: "total = sum([units * price for (_, units, price) in rows])\nprint(f'total: ${total:,.2f}')",
              explanation:
                "The underscore is the convention for 'I must unpack this slot but won't use it'. The comprehension unpacks inside itself, exactly like the loop.",
            },
          ],
          output:
            "north: $1,198.80\nsouth: $1,062.50\nwest: $1,522.50\ntotal: $3,783.80",
        },
        {
          difficulty: "Hard",
          title: "Starred unpacking and sorting records",
          scenario:
            "A race result feed: leader, everyone else, and a multi-key sort by (laps DESC, time ASC).",
          steps: [
            {
              code: "results = [('kai', 12, 58.3), ('ada', 12, 57.1), ('mia', 11, 55.0)]",
              explanation: "(driver, laps, minutes) — more laps wins; ties break on time.",
            },
            {
              code: "ordered = sorted(results, key=lambda r: (-r[1], r[2]))\nprint(ordered)",
              explanation:
                "A TUPLE as the sort key gives multi-level ordering: compare -laps first (negation flips to descending), then minutes ascending. Tuples compare element-by-element — the property doing the work here.",
            },
            {
              code: "winner, *rest = ordered\nprint(f'winner: {winner[0]}')\nprint(f'rest: {[r[0] for r in rest]}')",
              explanation:
                "Starred unpacking: winner takes the first tuple; *rest collects the remainder into a LIST. First-vs-everyone-else splits are one line.",
            },
          ],
          output:
            "[('ada', 12, 57.1), ('kai', 12, 58.3), ('mia', 11, 55.0)]\nwinner: ada\nrest: ['kai', 'mia']",
        },
        {
          difficulty: "Industry Example",
          title: "Function contracts built on tuples",
          scenario:
            "A data engineer's validation stage returns (clean_rows, error_count, worst_row) — a stable three-part contract its callers can rely on, since no caller can mutate what another receives.",
          steps: [
            {
              code: "def validate_batch(rows):\n    \"\"\"Return (clean, error_count, worst) for a batch of amounts.\"\"\"\n    clean = [r for r in rows if r >= 0]\n    errors = len(rows) - len(clean)\n    worst = min(rows)\n    return clean, errors, worst",
              explanation:
                "The return line packs a tuple — the multi-value returns you learned in Functions were tuples all along. The shape (list, int, float) IS the API.",
            },
            {
              code: "batch = [120.0, -5.0, 88.5, -0.01, 42.0]\nclean, error_count, worst = validate_batch(batch)\nprint(f'{len(clean)} clean, {error_count} errors, worst={worst}')",
              explanation:
                "Callers unpack by position. Because the tuple is immutable, logging code, metrics code, and retry code can all receive the SAME result object with zero risk of cross-contamination.",
            },
            {
              code: "summary = ('batch-042', len(clean), error_count)\naudit_log = [summary]\nprint(audit_log)",
              explanation:
                "The summary tuple goes into an audit list, safe forever — next lesson, tuples level up again: their immutability is exactly what qualifies them to be dictionary KEYS.",
            },
          ],
          output:
            "3 clean, 2 errors, worst=-5.0\n[('batch-042', 3, 2)]",
        },
      ],
    },

    {
      id: "inline-practice",
      type: "inline-code",
      tocLabel: "Practice Coding",
      coding: {
        language: "python",
        filename: "weather_records.py",
        instructions:
          "A weather feed delivers (city, high, low) tuples. For each record print 'city: spread N°' where spread is high minus low, then find and print the city with the biggest spread using max with a tuple-aware key.",
        starterCode: `records = [('cairo', 35, 22), ('oslo', 4, -3), ('lima', 24, 18)]

# TODO 1: loop with unpacking — print '<city>: spread <high-low>°'
___

# TODO 2: biggest — the record with the largest high-low spread (max + key)
biggest = ___

print(f"widest range: {biggest[0]}")`,
        solutionCode: `records = [('cairo', 35, 22), ('oslo', 4, -3), ('lima', 24, 18)]

for city, high, low in records:
    print(f"{city}: spread {high - low}°")

biggest = max(records, key=lambda r: r[1] - r[2])

print(f"widest range: {biggest[0]}")`,
        expectedOutput:
          "cairo: spread 13°\noslo: spread 7°\nlima: spread 6°\nwidest range: cairo",
        hints: [
          "Unpack in the for header: for city, high, low in records:",
          "The spread is high - low — 35-22=13, 4-(-3)=7, 24-18=6",
          "max(records, key=lambda r: r[1] - r[2]) compares spreads but returns the whole record",
          "biggest is a tuple, so biggest[0] is its city name",
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
          id: "py18_mcq_01",
          difficulty: "Easy",
          question: "Which creates a one-element tuple?",
          options: ["t = (5)", "t = (5,)", "t = tuple(5)", "t = [5]"],
          correctIndex: 1,
          explanation:
            "The comma makes the tuple — (5) is just the number 5 in parentheses. tuple(5) fails (5 isn't iterable) and [5] is a list.",
        },
        {
          type: "mcq",
          id: "py18_mcq_02",
          difficulty: "Easy",
          question: "point = (3, 4); point[0] = 9 — what happens?",
          options: [
            "point becomes (9, 4)",
            "TypeError: tuples don't support item assignment",
            "A new tuple is silently created",
            "IndexError",
          ],
          correctIndex: 1,
          explanation:
            "Immutability is enforced, not advisory. To 'change' a tuple you build a new one: point = (9, point[1]).",
        },
        {
          type: "mcq",
          id: "py18_mcq_03",
          difficulty: "Medium",
          question: "Which data is the best fit for a tuple rather than a list?",
          options: [
            "The growing queue of files waiting to be processed",
            "A GPS coordinate (latitude, longitude)",
            "This month's daily temperatures, appended each morning",
            "Usernames matching a search, to be sorted and filtered",
          ],
          correctIndex: 1,
          explanation:
            "Fixed shape, positions with distinct meanings, never partially edited — the record test. The other three are variable-length collections of like items that grow or get rearranged: list territory.",
        },
        {
          type: "scenario",
          id: "py18_sc_01",
          difficulty: "Medium",
          scenario:
            "A function returns config = ('prod', ['api', 'db']) — an environment name and a list of services. A caller runs config[1].append('cache') and it... works. Your teammate is confused: 'tuples are immutable!'",
          question: "What's the correct explanation?",
          options: [
            "It's a bug in Python",
            "The tuple's SLOTS are fixed (config[1] can't be re-pointed), but the list object IN the slot is still a mutable list — immutability isn't recursive",
            "Tuples become mutable when they contain lists",
            "append copies the tuple first",
          ],
          correctIndex: 1,
          explanation:
            "A tuple freezes which objects it references, not those objects' contents. For a truly frozen record, the contents must be immutable too — ('prod', ('api', 'db')) with an inner tuple.",
        },
        {
          type: "coding",
          id: "py18_code_01",
          difficulty: "Medium",
          prompt:
            "stock = ('ACME', 41.25, 43.10) holds (ticker, open, close). Unpack it and print 'ACME: +4.5%' — the percent change from open to close, one decimal, with a leading + for gains. Expected output: ACME: +4.5%",
          starterCode: "stock = ('ACME', 41.25, 43.10)\n# Your code here\n",
          solutionCode:
            "stock = ('ACME', 41.25, 43.10)\nticker, open_price, close_price = stock\nchange = (close_price - open_price) / open_price * 100\nprint(f'{ticker}: {change:+.1f}%')",
          expectedOutput: "ACME: +4.5%",
          tests: [
            {
              name: "Unpacks the record",
              description: "Three names bound in one unpacking assignment",
            },
            {
              name: "Sign formatting",
              description: "The {:+.1f} format spec produces the leading +",
            },
          ],
        },
        {
          type: "mcq",
          id: "py18_mcq_04",
          difficulty: "Hard",
          question: "first, *rest = (10, 20, 30, 40) — what are first and rest?",
          options: [
            "first=10, rest=(20, 30, 40)",
            "first=10, rest=[20, 30, 40]",
            "first=(10,), rest=[20, 30, 40]",
            "ValueError: too many values",
          ],
          correctIndex: 1,
          explanation:
            "Starred unpacking always collects into a LIST — even from a tuple. A detail interviewers enjoy: the star absorbs however many remain, including zero.",
        },
        {
          type: "coding",
          id: "py18_code_02",
          difficulty: "Hard",
          prompt:
            "employees = [('mia', 'data', 95000), ('kai', 'infra', 88000), ('ada', 'data', 102000)]. Sort by (department ASC, salary DESC) using one tuple key, then print each as 'dept | name | $salary'. Expected:\ndata | ada | $102000\ndata | mia | $95000\ninfra | kai | $88000",
          starterCode:
            "employees = [('mia', 'data', 95000), ('kai', 'infra', 88000), ('ada', 'data', 102000)]\n# Your code here\n",
          solutionCode:
            "employees = [('mia', 'data', 95000), ('kai', 'infra', 88000), ('ada', 'data', 102000)]\nordered = sorted(employees, key=lambda e: (e[1], -e[2]))\nfor name, dept, salary in ordered:\n    print(f'{dept} | {name} | ${salary}')",
          expectedOutput:
            "data | ada | $102000\ndata | mia | $95000\ninfra | kai | $88000",
          tests: [
            {
              name: "Tuple sort key",
              description: "One key returning (dept, -salary) handles both levels",
            },
            {
              name: "Unpacked printing",
              description: "The loop unpacks each record rather than indexing",
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
          question: "Tuple vs list — when do you use each, beyond 'one is immutable'?",
          answer:
            "The mechanical difference is mutability, but the design difference is meaning. A tuple is a fixed-shape RECORD: each position has its own semantic — (lat, lon), (name, dept, salary) — the length is part of the meaning, and elements are typically heterogeneous. A list is a variable-length COLLECTION of like items — readings, filenames — where elements are homogeneous and the length is incidental. Practical consequences: tuples can be dict keys and set members (immutability makes them hashable), returning tuples gives callers a tamper-proof result, and accumulating belongs in lists since tuples have no append. My quick test: 'would inserting an element in the middle even make sense?' If no — positions have fixed meanings — it's a tuple.",
        },
        {
          question:
            "A tuple contains a list. Is it still immutable? Explain precisely.",
          answer:
            "The tuple itself remains immutable in the only sense Python defines: its slots can never be rebound — t[1] = something always raises TypeError, and the tuple will reference the same objects forever. But immutability is not recursive: if slot 1 holds a list, that list is still a fully mutable list, and t[1].append(x) succeeds because it mutates the list object, not the tuple. Consequences worth stating: such a tuple is no longer hashable (so it can't be a dict key — the hash would need the list's contents, which can change), and the 'safe to share' guarantee only covers the tuple's structure, not the nested data. For a truly frozen record, make the contents immutable too — strings, numbers, nested tuples.",
        },
        {
          question:
            "What is tuple unpacking and where does Python use it beyond simple assignment?",
          answer:
            "Unpacking destructures a sequence into names in one step: name, score = record, with a loud ValueError on count mismatch. It's woven through the language: for k, v in pairs unpacks per iteration (enumerate and zip exist to be unpacked); the classic swap a, b = b, a packs the right side into a tuple and unpacks it into the left; star syntax collects a variable middle or tail — first, *rest = values — always into a list; multi-value returns are just a returned tuple met by an unpacking assignment; and function calls star-unpack sequences into arguments (f(*point)). In data code the daily version is unpacking rows in loop headers — for region, units, price in rows — which replaces opaque row[2] indexing with named, reviewable meaning.",
        },
      ],
    },

    {
      id: "common-mistakes",
      type: "callout",
      variant: "warning",
      title: "Common Mistakes to Avoid",
      content:
        "1) (42) is not a tuple — the comma makes it: (42,). 2) Trying .append() on a tuple — accumulate in a list, convert with tuple() at the end. 3) Assuming immutability is recursive — a list inside a tuple is still mutable. 4) Unpacking with the wrong count — ValueError; use _ for slots you skip and *rest for variable tails. 5) 'Growing' tuples with t += (x,) in a loop — quadratic copying; that's a list's job. 6) Using indexes (row[2]) where unpacking would name the meaning — readable code unpacks.",
    },

    {
      id: "ai-tutor",
      type: "callout",
      variant: "tip",
      title: "Ask the AI Tutor",
      content:
        "Try these prompts in the AI Tutor panel: • 'Quiz me: tuple or list for each of these eight datasets?' • 'Show me the nested-list-in-tuple mutation gotcha step by step.' • 'Drill me on starred unpacking with five examples.' • 'Explain how tuple comparison makes multi-key sorting work.' • 'Interview mode: ask me why tuples can be dict keys and grade my answer.'",
    },

    {
      id: "glossary",
      type: "callout",
      variant: "info",
      title: "Glossary",
      content:
        "Tuple — an ordered, immutable sequence. Immutable — unchangeable after creation. Record — a fixed-shape value whose positions carry distinct meanings. Unpacking — destructuring a sequence into names (a, b = pair). Starred unpacking — first, *rest = seq; the star collects into a list. Packing — the comma building a tuple (return a, b). Hashable — usable as a dict key/set member; tuples of immutables qualify. Heterogeneous — elements of different types/meanings (typical of tuples). tuple()/list() — conversions between the two. _ — conventional name for an unpacked-but-unused slot.",
    },

    {
      id: "resources",
      type: "callout",
      variant: "info",
      title: "Recommended Resources",
      content:
        "• Docs: 'Tuples and Sequences' in the official Python tutorial. • Read: the collections.namedtuple docs for a preview of tuples with named fields — the bridge between tuples and classes. • Practice: take any list-of-tuples from earlier lessons and rewrite every row[i] access as unpacking; feel the readability shift. • Next in DSM: tuples' immutability earns them a superpower — being KEYS. Dictionaries, the most important data structure in Python, are next.",
    },

    {
      id: "recap",
      type: "recap",
      tocLabel: "Recap",
      content:
        "✓ Tuples are ordered, immutable sequences — the comma creates them, (x,) for one element.\n✓ Indexing, slicing, len, and iteration work exactly as with lists.\n✓ Tuple = fixed-shape record (positions mean things); list = variable collection of like items.\n✓ Immutability means safe sharing, honest function returns — and dict-key eligibility.\n✓ Immutability isn't recursive: mutable contents stay mutable.\n✓ Unpack everywhere: loop headers, swaps, returns, *rest tails.\n\nNext up: Dictionaries. Tuples gave you positional records — dictionaries give you NAMED lookup: the key→value structure underlying JSON, API responses, and half of pandas.",
    },
  ],
};
