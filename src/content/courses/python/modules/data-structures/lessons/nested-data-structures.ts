import type { Lesson } from "@/lib/curriculum/types";

export const nestedDataStructures: Lesson = {
  meta: {
    id: "python.data-structures.nested-data-structures",
    slug: "nested-data-structures",
    title: "Nested Data Structures",
    description:
      "Lists of dicts, dicts of lists, and deeper — navigating and reshaping the composite structures real JSON and APIs actually deliver.",
    estimatedTime: "30 mins",
    difficulty: "Intermediate",
    xpReward: 60,
    prerequisites: ["python.data-structures.dictionaries"],
    masteryThreshold: 80,
  },

  blocks: [
    {
      id: "intro",
      type: "lesson-intro",
      tocLabel: "Introduction",
      intro: {
        hook: "No API on earth returns a flat list of numbers. It returns users, each with a profile, each with a list of orders, each with line items. Real data is STRUCTURES INSIDE STRUCTURES — and once you can read a nested shape at a glance and walk it without fear, every JSON payload in the world becomes yours.",
        what: "Nested data structures are containers holding containers: a list of dicts (records/table), a dict of lists (columns/groups), dicts of dicts (lookup of records), and arbitrary JSON-shaped mixtures. Access chains one step per level: data['users'][0]['email'].",
        why: "This is the shape of everything: API responses, config files, scraped data, MongoDB documents, and — crucially — a pandas DataFrame is conceptually a dict of columns. The navigation and reshaping skills here (extract, flatten, invert) are pre-pandas data wrangling itself.",
        whereUsed:
          "Consuming any API, reading JSON/YAML config, log processing, building report structures, and every 'transform this payload into that table' ticket.",
        objectives: [
          "Read a nested structure's shape from its brackets and braces",
          "Chain access safely, mixing [i], ['key'], and .get()",
          "Choose list-of-dicts vs dict-of-lists and convert between them",
          "Extract and flatten nested data with loops and comprehensions",
          "Guard against missing branches in real payloads",
        ],
        realWorldApps: [
          {
            company: "GitHub",
            headline: "The API you'll parse first",
            detail:
              "A repo's pull-request list is a list of dicts, each holding a 'user' dict, a 'labels' list of dicts, and nested 'head'/'base' branch objects — the canonical practice payload.",
          },
          {
            company: "MongoDB",
            headline: "Documents ARE nested dicts",
            detail:
              "Document databases store exactly what you're learning to navigate: dicts with nested dicts and arrays, queried by path — 'customer.address.city'.",
          },
          {
            company: "pandas",
            headline: "DataFrame = dict of columns",
            detail:
              "pd.DataFrame({'name': [...], 'score': [...]}) — the constructor you'll use in weeks takes a dict of lists. Records-vs-columns conversion is this lesson's core reshape.",
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
            "Reading a shape: [ starts a list (positions), { starts a dict (names). users = [{'name': ...}, {'name': ...}] reads as 'a LIST of user DICTS' — plural collection outside, named record inside. Access mirrors the nesting one level at a time: users[0] is the first dict; users[0]['name'] is its field. There's no new syntax in this lesson — only composition of what you know.",
        },
        {
          type: "code-note",
          code: "order = {\n    'id': 'A-101',\n    'customer': {'name': 'Ada', 'tier': 'pro'},\n    'items': [\n        {'sku': 'KB-201', 'qty': 2},\n        {'sku': 'MS-330', 'qty': 1},\n    ],\n}\nprint(order['customer']['name'])   # dict → dict → value\nprint(order['items'][1]['sku'])    # dict → list → dict → value",
          content:
            "Read chains left to right, asking 'what type am I holding now?' after each step: order is a dict, ['customer'] gives a dict, ['name'] gives a string. Mixing ['key'] and [index] is normal — the brackets adapt to whatever container you're currently in.",
        },
        {
          type: "analogy",
          title: "The filing cabinet",
          content:
            "Nested data is an office filing system: a CABINET (dict) whose labeled drawers hold FOLDERS (lists) of DOCUMENTS (dicts) with named fields. 'Get the second invoice's total from the Clients drawer, Acme folder' — cabinet['clients']['acme'][1]['total']. Nobody finds a document in one motion; you open one container at a time, and each container tells you how it opens: drawers by label, folder contents by position.",
        },
        {
          type: "keypoint",
          title: "The two table shapes: records vs columns",
          content:
            "A table nests two ways. ROW-oriented — a list of dicts: [{'name': 'Ada', 'score': 95}, ...] — one dict per record; natural for APIs, JSON lines, and iteration. COLUMN-oriented — a dict of lists: {'name': ['Ada', ...], 'score': [95, ...]} — one list per field; natural for computation (sum a column directly) and it's literally the DataFrame constructor's shape. Converting between them is a rite of passage — and two loops.",
        },
        {
          type: "code-note",
          code: "rows = [{'name': 'Ada', 'score': 95}, {'name': 'Kai', 'score': 88}]\n\n# rows → columns\ncols = {'name': [r['name'] for r in rows], 'score': [r['score'] for r in rows]}\nprint(cols)\nprint(sum(cols['score']))  # columns make math easy",
          content:
            "One comprehension per column: walk the records, pluck one field. The reverse (columns → rows) zips the lists back together. pandas does both with .to_dict('records') and pd.DataFrame(...) — you're learning what those buttons do.",
        },
        {
          type: "expandable",
          title: "Safe navigation: chaining .get()",
          content:
            "Deep chains crash at the first missing link: payload['user']['address']['city'] raises KeyError (or TypeError if a level is None). For optional branches, chain .get() with dict defaults: payload.get('user', {}).get('address', {}).get('city', 'unknown') — each level falls back to an empty dict so the next .get() has something to ask. Use it for genuinely optional branches; keep loud brackets for required ones. (The 'crash vs default' policy from the Dictionaries lesson, applied at depth.)",
        },
        {
          type: "warning",
          title: "Nested mutability and shared references",
          content:
            "Copying nested structures shallowly shares the innards: config2 = dict(config) makes a NEW outer dict whose values are the SAME inner objects — editing config2['limits']['max'] changes config too. This is the aliasing lesson from Lists vs NumPy, one level down, and it's the #1 'my data changed by itself' bug. When you truly need an independent copy of a nested structure, copy.deepcopy(config) exists — but first ask whether you should be building a new structure instead of copying and mutating.",
        },
      ],
    },

    {
      id: "diagram",
      type: "interactive-diagram",
      tocLabel: "Visual Learning",
      visual: {
        kind: "architecture",
        title: "One payload, layer by layer",
        caption:
          "resp['data']['orders'][0]['total'] — click each hop to see what type you're holding.",
        nodes: [
          {
            id: "root",
            label: "resp",
            sublabel: "dict",
            detail:
              "The whole payload — a dict with keys like 'status' and 'data'. First question at every level: list or dict? The opening bracket in a printout tells you.",
            x: 10,
            y: 40,
            accent: false,
          },
          {
            id: "data",
            label: "['data']",
            sublabel: "→ dict",
            detail:
              "Key access on a dict yields... another dict here, holding 'orders' and maybe 'paging'. Still not data you can use — keep walking.",
            x: 32,
            y: 40,
            accent: false,
          },
          {
            id: "orders",
            label: "['orders']",
            sublabel: "→ list",
            detail:
              "Now a LIST — the container switches, so the next bracket must be a position (or a loop). len() here tells you how many orders came back.",
            x: 54,
            y: 40,
            accent: true,
          },
          {
            id: "first",
            label: "[0]",
            sublabel: "→ dict",
            detail:
              "Index into the list: one order record, a dict again. In real code this bracket is usually a for loop instead — process every order, not just the first.",
            x: 74,
            y: 40,
            accent: false,
          },
          {
            id: "total",
            label: "['total']",
            sublabel: "→ 129.99",
            detail:
              "Finally a leaf value — a float you can add, compare, or format. Four hops: dict → dict → list → dict → value. Every JSON navigation is some sequence of exactly these two moves.",
            x: 92,
            y: 40,
            accent: false,
          },
        ],
        edges: [
          { from: "root", to: "data", label: "by key" },
          { from: "data", to: "orders", label: "by key" },
          { from: "orders", to: "first", label: "by index" },
          { from: "first", to: "total", label: "by key" },
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
          title: "Read the shape, chain the access",
          scenario: "Pull one fact out of a two-level structure.",
          steps: [
            {
              code: "team = {\n    'name': 'data-platform',\n    'members': ['ada', 'kai', 'mia'],\n}\nprint(team['members'][1])\nprint(len(team['members']))",
              explanation:
                "dict → list → element: ['members'] opens the drawer, [1] picks the folder. len() works at whatever level you point it at — here, the member list.",
            },
          ],
          output: "kai\n3",
        },
        {
          difficulty: "Easy",
          title: "Loop a list of dicts",
          scenario: "The row-oriented table shape: iterate records, use fields by name.",
          steps: [
            {
              code: "products = [\n    {'sku': 'KB-201', 'price': 49.99, 'stock': 12},\n    {'sku': 'MS-330', 'price': 24.50, 'stock': 0},\n    {'sku': 'HD-880', 'price': 89.00, 'stock': 4},\n]",
              explanation:
                "One dict per product — self-describing rows (each carries its field names), the shape APIs return.",
            },
            {
              code: "for p in products:\n    tag = 'OUT' if p['stock'] == 0 else 'ok'\n    print(f\"{p['sku']}: ${p['price']} [{tag}]\")",
              explanation:
                "The loop variable p is a dict, so fields come out by name — p['sku'], not p[0]. Compare tuples: no unpacking needed, and adding a field later breaks nothing.",
            },
          ],
          output: "KB-201: $49.99 [ok]\nMS-330: $24.5 [OUT]\nHD-880: $89.0 [ok]",
        },
        {
          difficulty: "Medium",
          title: "Reshape: records → columns → answers",
          scenario:
            "Turn a list of reading records into columns, then compute per-column stats — the DataFrame warm-up.",
          steps: [
            {
              code: "readings = [\n    {'city': 'oslo', 'temp': -3.5},\n    {'city': 'cairo', 'temp': 31.0},\n    {'city': 'lima', 'temp': 19.5},\n]",
              explanation: "Row shape in — as an API would send it.",
            },
            {
              code: "cols = {\n    'city': [r['city'] for r in readings],\n    'temp': [r['temp'] for r in readings],\n}\nprint(cols['city'])",
              explanation:
                "One comprehension per column plucks a single field across all records. This dict-of-lists IS the pd.DataFrame constructor argument.",
            },
            {
              code: "temps = cols['temp']\nprint(f'avg {sum(temps) / len(temps):.1f}, max {max(temps)}')",
              explanation:
                "Column shape makes math one-liners — no per-row extraction needed. Row shape is for iterating records; column shape is for computing. Knowing WHICH you hold is half of data wrangling.",
            },
          ],
          output: "['oslo', 'cairo', 'lima']\navg 15.7, max 31.0",
        },
        {
          difficulty: "Hard",
          title: "Flatten nested lists and aggregate by key",
          scenario:
            "Each store reports its daily sales as a nested list; finance wants one flat total per region — flatten, then group.",
          steps: [
            {
              code: "reports = [\n    {'region': 'north', 'daily': [1200.0, 980.0, 1430.0]},\n    {'region': 'south', 'daily': [800.0, 1100.0]},\n    {'region': 'north', 'daily': [500.0, 650.0]},\n]",
              explanation:
                "A list of dicts, each holding a LIST — two norths because two stores report separately. Real feeds duplicate keys like this constantly.",
            },
            {
              code: "totals = {}\nfor rep in reports:\n    totals[rep['region']] = totals.get(rep['region'], 0) + sum(rep['daily'])\nprint(totals)",
              explanation:
                "The counting pattern with sum(inner_list) as the increment — accumulating BY key merges the two north stores instead of overwriting (the dict-building trap from last lesson, dodged).",
            },
            {
              code: "all_days = [amt for rep in reports for amt in rep['daily']]\nprint(f'{len(all_days)} store-days, grand total ${sum(all_days):,.2f}')",
              explanation:
                "A double comprehension flattens: read it as the two nested for-loops it abbreviates — for rep in reports, then for amt in rep['daily']. Flat lists answer whole-dataset questions.",
            },
          ],
          output:
            "{'north': 4760.0, 'south': 1900.0}\n7 store-days, grand total $6,660.00",
        },
        {
          difficulty: "Industry Example",
          title: "From raw API payload to report rows",
          scenario:
            "The full ticket a junior data engineer gets weekly: consume a nested payload (with optional branches!), extract fields defensively, and emit clean flat records ready for a DataFrame or CSV.",
          steps: [
            {
              code: "payload = {\n    'status': 'ok',\n    'users': [\n        {'id': 'u1', 'name': 'Ada', 'address': {'city': 'oslo'},\n         'orders': [{'total': 120.0}, {'total': 40.5}]},\n        {'id': 'u2', 'name': 'Kai',\n         'orders': [{'total': 89.9}]},\n        {'id': 'u3', 'name': 'Mia', 'address': {'city': 'lima'},\n         'orders': []},\n    ],\n}",
              explanation:
                "Note the realism: u2 has NO address key at all, u3 has no orders. Payloads are ragged — the code must expect it.",
            },
            {
              code: "rows = []\nfor user in payload['users']:\n    city = user.get('address', {}).get('city', 'unknown')\n    order_totals = [o['total'] for o in user.get('orders', [])]\n    rows.append({\n        'id': user['id'],\n        'city': city,\n        'orders': len(order_totals),\n        'spent': sum(order_totals),\n    })",
              explanation:
                "Required fields (id) use loud brackets; optional branches chain .get() with {} and [] defaults so missing links degrade to 'unknown'/empty instead of crashing. Each user flattens to one clean, FLAT dict.",
            },
            {
              code: "for r in rows:\n    print(r)\nbig_spenders = [r['id'] for r in rows if r['spent'] > 100]\nprint(f'big spenders: {big_spenders}')",
              explanation:
                "The output is a list of flat dicts — pd.DataFrame(rows) away from a table. Nested-in, flat-out is the shape of 90% of ingestion code you'll ever write.",
            },
          ],
          output:
            "{'id': 'u1', 'city': 'oslo', 'orders': 2, 'spent': 160.5}\n{'id': 'u2', 'city': 'unknown', 'orders': 1, 'spent': 89.9}\n{'id': 'u3', 'city': 'lima', 'orders': 0, 'spent': 0}\nbig spenders: ['u1']",
        },
      ],
    },

    {
      id: "inline-practice",
      type: "inline-code",
      tocLabel: "Practice Coding",
      coding: {
        language: "python",
        filename: "playlist_stats.py",
        instructions:
          "A music service payload holds playlists, each with a list of track dicts. Produce: each playlist's name with its track count and total minutes, and the single longest track title anywhere (flatten + max with a key). Guard the possibly-missing 'tracks' key.",
        starterCode: `payload = {
    'playlists': [
        {'name': 'Focus', 'tracks': [
            {'title': 'Deep Flow', 'minutes': 6.5},
            {'title': 'Stillness', 'minutes': 4.0},
        ]},
        {'name': 'Empty Vibes'},
        {'name': 'Run', 'tracks': [
            {'title': 'Tempo Up', 'minutes': 3.5},
        ]},
    ],
}

# TODO 1: for each playlist print '<name>: <count> tracks, <total> min'
# Use .get('tracks', []) so 'Empty Vibes' doesn't crash
___

# TODO 2: all_tracks — flatten every track dict into one list
all_tracks = ___

# TODO 3: longest — the track dict with the largest minutes
longest = ___
print(f"longest: {longest['title']}")`,
        solutionCode: `payload = {
    'playlists': [
        {'name': 'Focus', 'tracks': [
            {'title': 'Deep Flow', 'minutes': 6.5},
            {'title': 'Stillness', 'minutes': 4.0},
        ]},
        {'name': 'Empty Vibes'},
        {'name': 'Run', 'tracks': [
            {'title': 'Tempo Up', 'minutes': 3.5},
        ]},
    ],
}

for pl in payload['playlists']:
    tracks = pl.get('tracks', [])
    total = sum([t['minutes'] for t in tracks])
    print(f"{pl['name']}: {len(tracks)} tracks, {total} min")

all_tracks = [t for pl in payload['playlists'] for t in pl.get('tracks', [])]

longest = max(all_tracks, key=lambda t: t['minutes'])
print(f"longest: {longest['title']}")`,
        expectedOutput:
          "Focus: 2 tracks, 10.5 min\nEmpty Vibes: 0 tracks, 0 min\nRun: 1 tracks, 3.5 min\nlongest: Deep Flow",
        hints: [
          "pl.get('tracks', []) returns an empty list for Empty Vibes — len and sum then just work",
          "Total minutes: sum a comprehension of t['minutes'] over the playlist's tracks",
          "Flatten with a double comprehension: [t for pl in payload['playlists'] for t in pl.get('tracks', [])]",
          "max(all_tracks, key=lambda t: t['minutes']) returns the whole track dict — read its ['title']",
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
          id: "py21_mcq_01",
          difficulty: "Easy",
          question:
            "data = {'items': [{'id': 7}, {'id': 9}]} — how do you read the second id?",
          options: [
            "data['items']['id'][1]",
            "data['items'][1]['id']",
            "data[1]['items']['id']",
            "data.items[1].id",
          ],
          correctIndex: 1,
          explanation:
            "Follow the nesting: ['items'] opens the list, [1] picks the second dict, ['id'] reads its field. Each bracket matches the container you're currently holding.",
        },
        {
          type: "mcq",
          id: "py21_mcq_02",
          difficulty: "Easy",
          question: "Which structure is 'row-oriented' table data?",
          options: [
            "{'name': ['Ada', 'Kai'], 'score': [95, 88]}",
            "[{'name': 'Ada', 'score': 95}, {'name': 'Kai', 'score': 88}]",
            "[('Ada', 95), ('Kai', 88)]",
            "{'Ada': 95, 'Kai': 88}",
          ],
          correctIndex: 1,
          explanation:
            "A list of dicts: one self-describing dict per record. A is column-oriented (dict of lists); C is rows without field names (tuples); D is a plain lookup.",
        },
        {
          type: "mcq",
          id: "py21_mcq_03",
          difficulty: "Medium",
          question:
            "user.get('address', {}).get('city', 'n/a') — why the {} in the first .get()?",
          options: [
            "It sets user['address'] to {} permanently",
            "If 'address' is missing, the {} fallback gives the second .get() a dict to query instead of crashing on None",
            "It's required syntax for chained .get()",
            "It makes the lookup faster",
          ],
          correctIndex: 1,
          explanation:
            ".get('address') alone would return None for missing addresses, and None.get('city') raises AttributeError. The empty-dict default keeps the chain alive so the final fallback 'n/a' can do its job. .get never mutates.",
        },
        {
          type: "scenario",
          id: "py21_sc_01",
          difficulty: "Medium",
          scenario:
            "You copy a settings template with new = dict(template), then set new['limits']['retries'] = 5 for one customer. Soon EVERY customer's retries is 5, and template itself shows 5 too.",
          question: "What happened?",
          options: [
            "dict() failed silently",
            "dict(template) copied the outer dict only — 'limits' still points at the ONE shared inner dict, so the edit went through every alias",
            "Integers are immutable so 5 propagated",
            "Python caches dict values globally",
          ],
          correctIndex: 1,
          explanation:
            "Shallow copy: new outer container, same inner objects. Mutating a shared inner dict is visible through every reference. Fix: copy.deepcopy(template), or build fresh dicts per customer instead of copy-and-mutate.",
        },
        {
          type: "coding",
          id: "py21_code_01",
          difficulty: "Medium",
          prompt:
            "Convert columns to rows: cols = {'city': ['oslo', 'lima'], 'temp': [-3.5, 19.5]} → print a list of dicts [{'city': 'oslo', 'temp': -3.5}, {'city': 'lima', 'temp': 19.5}]. (Hint: loop over range(len(...)).)",
          starterCode:
            "cols = {'city': ['oslo', 'lima'], 'temp': [-3.5, 19.5]}\n# Your code here\n",
          solutionCode:
            "cols = {'city': ['oslo', 'lima'], 'temp': [-3.5, 19.5]}\nrows = [{'city': cols['city'][i], 'temp': cols['temp'][i]} for i in range(len(cols['city']))]\nprint(rows)",
          expectedOutput:
            "[{'city': 'oslo', 'temp': -3.5}, {'city': 'lima', 'temp': 19.5}]",
          tests: [
            {
              name: "Row shape out",
              description: "A list of dicts, one per index position",
            },
            {
              name: "Parallel indexing",
              description: "Both columns are read at the same i per row",
            },
          ],
        },
        {
          type: "coding",
          id: "py21_code_02",
          difficulty: "Hard",
          prompt:
            "orgs = [{'team': 'data', 'members': ['ada', 'mia']}, {'team': 'infra', 'members': ['kai']}, {'team': 'data', 'members': ['zoe']}] — build headcount, a dict of team → TOTAL member count (merging duplicate teams), and print it. Expected: {'data': 3, 'infra': 1}",
          starterCode:
            "orgs = [{'team': 'data', 'members': ['ada', 'mia']}, {'team': 'infra', 'members': ['kai']}, {'team': 'data', 'members': ['zoe']}]\n# Your code here\n",
          solutionCode:
            "orgs = [{'team': 'data', 'members': ['ada', 'mia']}, {'team': 'infra', 'members': ['kai']}, {'team': 'data', 'members': ['zoe']}]\nheadcount = {}\nfor org in orgs:\n    headcount[org['team']] = headcount.get(org['team'], 0) + len(org['members'])\nprint(headcount)",
          expectedOutput: "{'data': 3, 'infra': 1}",
          tests: [
            {
              name: "Accumulates, not overwrites",
              description: "The two 'data' entries merge to 3 via .get(key, 0) +",
            },
            {
              name: "Counts nested lists",
              description: "len(org['members']) is the per-record increment",
            },
          ],
        },
        {
          type: "mcq",
          id: "py21_mcq_04",
          difficulty: "Hard",
          question:
            "flat = [x for row in grid for x in row] with grid = [[1, 2], [3], [4, 5]] — what is flat?",
          options: [
            "[[1, 2], [3], [4, 5]]",
            "[1, 2, 3, 4, 5]",
            "[(1, 2), (3,), (4, 5)]",
            "SyntaxError — two fors need two brackets",
          ],
          correctIndex: 1,
          explanation:
            "The double comprehension is nested loops read left to right: for row in grid (outer), for x in row (inner) — yielding each inner element in order. One level of nesting flattened in one line.",
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
            "Compare row-oriented (list of dicts) and column-oriented (dict of lists) table layouts. When is each better?",
          answer:
            "Row-oriented — [{'name': 'Ada', 'score': 95}, ...] — puts one self-describing dict per record. It's the natural shape for iteration (process each record), for streaming (records arrive one at a time), for ragged data (records can omit fields), and it's what JSON APIs return. Column-oriented — {'name': [...], 'score': [...]} — puts one list per field, which makes whole-column computation trivial (sum(cols['score']) with no extraction loop) and is memory-friendlier since field names are stored once, not per record. It's also literally pandas' constructor shape, because DataFrames are column stores internally — that's what makes vectorized column math fast. The practical skill is converting: records-to-columns is one comprehension per field; columns-to-records zips parallel lists by index. Knowing which shape you're holding — and which shape the next tool wants — is half of data wrangling.",
        },
        {
          question:
            "How do you safely extract a deeply nested optional field from a JSON payload?",
          answer:
            "First decide policy per branch, exactly as with flat dicts: required paths get loud bracket access so malformed payloads fail at the source; optional branches get defensive access. The core defensive idiom is chained .get() with type-preserving defaults — user.get('address', {}).get('city', 'unknown') — where the intermediate {} matters because a bare .get() returns None and None.get crashes with AttributeError; each level's default must be the container type the NEXT step expects ({} before a key access, [] before iteration). For lists, .get('orders', []) lets len/sum/loops work unchanged on absent branches. Beyond a couple of levels, extract a helper — def dig(d, *keys, default=None) looping .get — or lean on a schema validator (pydantic) at the boundary so the interior code can use honest brackets. The anti-pattern to name: wrapping everything in try/except KeyError, which silences genuinely malformed data along with expected gaps.",
        },
        {
          question:
            "What's the difference between a shallow and a deep copy of a nested structure, and when does it bite?",
          answer:
            "A shallow copy — dict(d), list(l), .copy(), slicing — creates a new OUTER container whose slots reference the SAME inner objects. A deep copy — copy.deepcopy — recursively copies every level, producing a fully independent structure. Shallow copying bites whenever you copy-then-mutate below the first level: copy a config template, edit copy['limits']['max'], and every other 'copy' plus the template change together, because 'limits' was one shared dict all along. The same mechanism produces the multiplied-row bug: [[0] * 3] * 2 is two references to ONE row list. Diagnosis tip: `a['x'] is b['x']` returning True reveals the sharing. Mitigations in preference order: build new structures instead of copy-and-mutate (comprehensions naturally produce fresh containers), deepcopy when you genuinely need an independent clone, and treat shared nested data as read-only by convention.",
        },
      ],
    },

    {
      id: "common-mistakes",
      type: "callout",
      variant: "warning",
      title: "Common Mistakes to Avoid",
      content:
        "1) Wrong bracket for the level — ['key'] on a list or [0] on a dict; ask 'what type am I holding?' at each hop. 2) .get() chains without container defaults — None.get crashes; use .get('k', {}) / .get('k', []). 3) Shallow-copying then mutating inner structures — shared innards change everywhere. 4) Overwriting when duplicate keys should accumulate — .get(k, 0) + value, not plain assignment. 5) Processing only [0] when the payload is a list — loop it. 6) Building three-level structures when flat records + a key field would do — flatten early, nest only for output.",
    },

    {
      id: "ai-tutor",
      type: "callout",
      variant: "tip",
      title: "Ask the AI Tutor",
      content:
        "Try these prompts in the AI Tutor panel: • 'Show me a gnarly JSON payload and quiz me on access paths.' • 'Drill me on records↔columns conversion both directions.' • 'Walk through the shallow-copy config bug with is-checks.' • 'Help me flatten this three-level structure step by step.' • 'Interview mode: ask me row vs column orientation and grade my answer.'",
    },

    {
      id: "glossary",
      type: "callout",
      variant: "info",
      title: "Glossary",
      content:
        "Nested structure — a container holding containers. Access chain — successive brackets, one per level (d['a'][0]['b']). Row-oriented — list of dicts; one record per dict. Column-oriented — dict of lists; one list per field. Flattening — converting nested collections to one flat list (double comprehension). Leaf — a non-container value at the bottom of a structure. Shallow copy — new outer container, shared inner objects. Deep copy — fully recursive copy (copy.deepcopy). Ragged data — records with differing/missing fields. Chained .get() — defensive navigation with container defaults.",
    },

    {
      id: "resources",
      type: "callout",
      variant: "info",
      title: "Recommended Resources",
      content:
        "• Docs: the json module page — loads/dumps turn this lesson's shapes into text and back. • Read: any public API's example response (GitHub's REST docs are ideal) and sketch its shape as nested brackets before touching code. • Practice: take the Industry Example payload, add a third nesting level (order → items), and extend the flattener to produce one row per ITEM. • Next in DSM: you now know all four structures and their compositions — Choosing the Right Structure is the capstone: a decision framework, performance intuition, and a mini-project wiring everything together.",
    },

    {
      id: "recap",
      type: "recap",
      tocLabel: "Recap",
      content:
        "✓ Read shapes by brackets: [ = list (positions), { = dict (names); chain access one level per hop.\n✓ Row shape (list of dicts) iterates; column shape (dict of lists) computes — convert deliberately.\n✓ Optional branches: chained .get() with {} / [] defaults; required ones: loud brackets.\n✓ Flatten nested lists with double comprehensions; aggregate duplicates with .get(k, 0) +.\n✓ Shallow copies share innards — deepcopy or build fresh when independence matters.\n✓ Nested-in, flat-out: most ingestion code reduces payloads to flat records.\n\nNext up: Choosing the Right Structure. Lists, tuples, dicts, sets, and their nestings are all in hand — the finale is judgment: picking the structure the PROBLEM wants, with performance intuition to back it.",
    },
  ],
};
