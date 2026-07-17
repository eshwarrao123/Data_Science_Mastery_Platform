import type { Lesson } from "@/lib/curriculum/types";

export const choosingTheRightStructure: Lesson = {
  meta: {
    id: "python.data-structures.choosing-the-right-structure",
    slug: "choosing-the-right-structure",
    title: "Choosing the Right Structure",
    description:
      "The capstone judgment call: match lists, tuples, dicts, and sets to the question being asked — with the performance intuition to defend the choice.",
    estimatedTime: "30 mins",
    difficulty: "Intermediate",
    xpReward: 70,
    prerequisites: ["python.data-structures.nested-data-structures"],
    masteryThreshold: 80,
  },

  blocks: [
    {
      id: "intro",
      type: "lesson-intro",
      tocLabel: "Introduction",
      intro: {
        hook: "You now own four containers — and the most common code-review comment in data engineering is still 'why is this a list?' Every structure answers a QUESTION: by position? by name? is it present? in what order? Choose by the question and code writes itself; choose by habit and you fight your own data all day.",
        what: "A decision framework for lists, tuples, dicts, and sets: what each structure optimizes for, what each costs, how the choice changes at scale, and how the pieces compose into real designs.",
        why: "The wrong structure isn't just slow — it breeds bugs (duplicate keys silently overwritten, order relied on where none exists) and unreadable code (index gymnastics where names belonged). Structure choice is the first design decision of every script, and interviews probe it directly.",
        whereUsed:
          "Every function signature you design, every 'how should I hold this data?' moment, code review, and the system-design portion of data interviews.",
        objectives: [
          "Apply the four questions that select a structure",
          "Predict lookup/membership costs for lists vs dicts/sets",
          "Compose structures: dicts of lists, sets for indexes, tuples as keys",
          "Refactor code that fights its structure into code that fits it",
          "Defend structure choices in review and interviews",
        ],
        realWorldApps: [
          {
            company: "Instagram",
            headline: "Feed assembly under 100ms",
            detail:
              "Candidate posts arrive as lists, dedupe against seen-post SETS, hydrate via id→post DICTS, and ship ordered lists — all four structures in one request path, each doing its one job.",
          },
          {
            company: "Palantir",
            headline: "Entity resolution",
            detail:
              "Matching millions of records means composite tuple keys — (name_normalized, dob) — indexing candidate dicts, with sets tracking already-merged IDs. Structure choice IS the algorithm.",
          },
          {
            company: "DuckDB",
            headline: "Why columns win",
            detail:
              "Analytical databases store data column-oriented for the same reason your dict-of-lists made stats one-liners: the structure matches the question ('aggregate this field'), and performance follows.",
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
          type: "keypoint",
          title: "The four questions",
          content:
            "1) How do I LOOK UP an item — by position (list), by name/key (dict), or 'is it present?' (set)? 2) Does ORDER carry meaning — sequence matters (list/tuple) or not (dict for lookup, set for membership)? 3) Can it CHANGE — accumulating (list/dict/set) or a fixed-shape fact (tuple)? 4) Are DUPLICATES meaningful — yes (list) or must values be unique (set, dict keys)? Answer these four and the structure is chosen for you.",
        },
        {
          type: "text",
          content:
            "Performance in one paragraph: lists index instantly by position but SEARCH by scanning — `x in big_list` and .index() walk elements one by one. Dicts and sets hash: lookup, membership, insert, delete are constant-time at any size. Appending to a list is fast; inserting at the front shifts everything. These few facts predict almost every 'why is my script slow?' answer at this level.",
        },
        {
          type: "analogy",
          title: "The kitchen test",
          content:
            "A restaurant kitchen holds the same ingredients four ways. The ticket rail is a LIST — order matters, duplicates fine, work the sequence. The labeled spice rack is a DICT — grab 'cumin' by name, no searching. The allergen board is a SET — one question only: 'is peanut in this dish?' The plated dish spec is a TUPLE — (protein, side, sauce), fixed shape, sealed. Ask a kitchen to find cumin in an unlabeled pile (list-as-lookup) and service melts down — same ingredients, wrong container.",
        },
        {
          type: "code-note",
          code: "# Same data, three questions, three structures\nevents = [('ada', 'login'), ('kai', 'login'), ('ada', 'purchase')]\n\nsequence = [e for _, e in events]          # list: what happened, in order?\nby_user = {}                                # dict of lists: what did EACH user do?\nfor user, action in events:\n    by_user.setdefault(user, []).append(action)\nactive = {u for u, _ in events}             # set: WHO was active at all?\nprint(sequence, by_user, active, sep='\\n')",
          content:
            "One event stream, three legitimate structures — because there are three different QUESTIONS. Data doesn't have one true shape; questions do. (setdefault: the one-line grouping idiom from Dictionaries.)",
        },
        {
          type: "keypoint",
          title: "Composition is the real skill",
          content:
            "Real designs stack structures, each answering its layer's question: a dict of lists (group by key, keep order within), a dict keyed by tuples (composite lookup: ('store-12', '2026-07-14') → sales), a set alongside a list (order preserved, membership fast — the dedup-preserving-order idiom), a list of dicts (records in sequence). Name the question per layer and compose accordingly.",
        },
        {
          type: "expandable",
          title: "When the answer is 'none of these'",
          content:
            "The standard library extends the core four when a pattern recurs: collections.Counter (counting, with .most_common()), defaultdict (grouping without the setdefault dance), namedtuple (tuples with field names), deque (fast pops from BOTH ends — queues). And at scale, columns of numbers belong in NumPy arrays and DataFrames — which you now recognize as an industrialized dict-of-lists. Knowing the core four deeply is what makes these upgrades obvious rather than magical.",
        },
        {
          type: "warning",
          title: "The smells of a wrong structure",
          content:
            "You chose wrong if you see: .index() or `in` on a big list inside a loop (wants a dict/set); parallel lists kept in sync by index — names[i], ages[i] (wants a list of dicts or a dict); a dict whose keys are 0,1,2,... (wants a list); manually deduplicating with nested loops (wants a set); row[3] with a comment explaining what 3 means (wants a dict or namedtuple). None are syntax errors — all are design errors the structure was begging you to avoid.",
        },
      ],
    },

    {
      id: "diagram",
      type: "interactive-diagram",
      tocLabel: "Visual Learning",
      visual: {
        kind: "decision-tree",
        title: "The structure decision tree",
        caption:
          "Start at the top question; each answer narrows to a structure. Click nodes for the reasoning.",
        nodes: [
          {
            id: "start",
            label: "How is it accessed?",
            sublabel: "the first question",
            detail:
              "Lookup style dominates the choice: by position/order, by key name, or by presence. Everything else refines it.",
            x: 50,
            y: 10,
            accent: true,
          },
          {
            id: "seq",
            label: "by position / in order",
            sublabel: "sequence family",
            detail:
              "Order carries meaning or items are processed in sequence. Next question: does it change? Growing/shrinking → list. Fixed-shape record → tuple.",
            x: 18,
            y: 42,
            accent: false,
          },
          {
            id: "key",
            label: "by name / key",
            sublabel: "→ dict",
            detail:
              "Lookup by identifier: user by id, count by category, config by name. Hash-fast at any size. Keys unique and immutable; duplicates in source data need an accumulate-or-group decision.",
            x: 50,
            y: 42,
            accent: false,
          },
          {
            id: "presence",
            label: "'is it there?'",
            sublabel: "→ set",
            detail:
              "Membership, uniqueness, overlap. Order is unavailable and duplicates impossible — if either matters, compose with a list or use a counting dict.",
            x: 82,
            y: 42,
            accent: false,
          },
          {
            id: "list",
            label: "list",
            sublabel: "mutable sequence",
            detail:
              "Accumulate, filter, sort, iterate. The default for 'a bunch of like items in order'. Beware: searching it at scale is the classic slowdown.",
            x: 8,
            y: 75,
            accent: false,
          },
          {
            id: "tuple",
            label: "tuple",
            sublabel: "immutable record",
            detail:
              "Fixed positions with meanings: coordinates, rows, multi-returns. Bonus power: hashable → usable as dict keys and set members.",
            x: 30,
            y: 75,
            accent: false,
          },
        ],
        edges: [
          { from: "start", to: "seq", label: "position" },
          { from: "start", to: "key", label: "name" },
          { from: "start", to: "presence", label: "presence" },
          { from: "seq", to: "list", label: "changes" },
          { from: "seq", to: "tuple", label: "fixed shape" },
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
          title: "Four datasets, four verdicts",
          scenario: "Apply the four questions rapid-fire.",
          steps: [
            {
              code: "# 1. This week's closing prices, in date order   -> list\nprices = [101.2, 99.8, 103.5, 102.0, 104.1]\n# 2. One GPS fix                                  -> tuple\nfix = (59.9139, 10.7522)\n# 3. Product name by SKU                          -> dict\nnames = {'KB-201': 'Keyboard', 'MS-330': 'Mouse'}\n# 4. SKUs ever returned by a customer             -> set\nreturned = {'KB-201', 'HD-880'}\nprint(prices[-1], fix[0], names['MS-330'], 'KB-201' in returned)",
              explanation:
                "Ordered + duplicates fine → list. Fixed shape, sealed → tuple. Lookup by name → dict. Presence question → set. Each access line uses the structure's native strength.",
            },
          ],
          output: "104.1 59.9139 Mouse True",
        },
        {
          difficulty: "Easy",
          title: "Refactor: parallel lists → records",
          scenario: "The index-synchronization smell, cured.",
          steps: [
            {
              code: "# SMELL: three lists that must stay aligned by index\nnames = ['ada', 'kai']\nplans = ['pro', 'free']\nlogins = [42, 7]\nprint(f'{names[1]}: {plans[1]}, {logins[1]} logins')",
              explanation:
                "It works — until one list gets sorted or filtered and the others don't. The alignment is an invariant the code silently depends on and nothing enforces.",
            },
            {
              code: "users = [\n    {'name': 'ada', 'plan': 'pro', 'logins': 42},\n    {'name': 'kai', 'plan': 'free', 'logins': 7},\n]\nfor u in users:\n    print(f\"{u['name']}: {u['plan']}, {u['logins']} logins\")",
              explanation:
                "One record per user — the fields travel TOGETHER, so sorting/filtering can't tear them apart. Structure now enforces what discipline used to.",
            },
          ],
          output: "kai: free, 7 logins\nada: pro, 42 logins\nkai: free, 7 logins",
        },
        {
          difficulty: "Medium",
          title: "Refactor: list search → dict index",
          scenario:
            "An enrichment loop looks up customers by id for every order — the scale trap, then the fix.",
          steps: [
            {
              code: "customers = [\n    {'id': 'C1', 'name': 'Ada'},\n    {'id': 'C2', 'name': 'Kai'},\n    {'id': 'C3', 'name': 'Mia'},\n]\norders = [('O-9', 'C3'), ('O-10', 'C1'), ('O-11', 'C3')]",
              explanation:
                "Two datasets joined by customer id. The naive join scans `customers` per order — fine at 3×3, catastrophic at 100k×1M.",
            },
            {
              code: "by_id = {c['id']: c for c in customers}",
              explanation:
                "Build the INDEX once: a dict comprehension mapping id → record. One pass. This line is what databases call 'building a hash index' — and what pandas merge does internally.",
            },
            {
              code: "for order_id, cust_id in orders:\n    cust = by_id.get(cust_id)\n    name = cust['name'] if cust else 'UNKNOWN'\n    print(f'{order_id}: {name}')",
              explanation:
                "Each lookup is now constant-time, and the missing-customer policy is explicit (.get + fallback). Total cost: one pass over each dataset instead of their product.",
            },
          ],
          output: "O-9: Mia\nO-10: Ada\nO-11: Mia",
        },
        {
          difficulty: "Hard",
          title: "Composite keys: tuples unlock two-dimensional lookup",
          scenario:
            "Sales arrive per (store, date). Answering 'store 12 on the 14th?' with nested dicts is clumsy — a tuple-keyed dict is the native fit.",
          steps: [
            {
              code: "sales = {}\nfeed = [\n    ('s12', '07-14', 1250.0),\n    ('s07', '07-14', 980.0),\n    ('s12', '07-15', 1430.0),\n    ('s12', '07-14', 310.0),\n]\nfor store, date, amount in feed:\n    key = (store, date)\n    sales[key] = sales.get(key, 0) + amount",
              explanation:
                "The key is a TUPLE — hashable (last lesson's payoff), so (store, date) addresses a cell in a conceptual 2-D grid. Duplicates accumulate instead of overwriting.",
            },
            {
              code: "print(sales[('s12', '07-14')])",
              explanation: "Point lookup in one hop — no nested navigation, no scanning.",
            },
            {
              code: "s12_total = sum([v for (store, _), v in sales.items() if store == 's12'])\nprint(f's12 total: {s12_total}')",
              explanation:
                "Slicing one dimension = filtering keys by their first element (unpacking the tuple key right in the comprehension). When BOTH access patterns are hot paths, keep two indexes — that trade-off is database index design in miniature.",
            },
          ],
          output: "1560.0\ns12 total: 2990.0",
        },
        {
          difficulty: "Industry Example",
          title: "All four structures, one pipeline",
          scenario:
            "A support-ticket triage script — the kind of 40-line utility data teams write weekly. Watch each structure take exactly the job it's built for.",
          steps: [
            {
              code: "VALID_PRIORITIES = {'low', 'normal', 'urgent'}   # set: membership rulebook\ntickets = [                                       # list of dicts: records in arrival order\n    {'id': 'T1', 'team': 'billing', 'priority': 'urgent'},\n    {'id': 'T2', 'team': 'auth', 'priority': 'normal'},\n    {'id': 'T3', 'team': 'billing', 'priority': 'wat'},\n    {'id': 'T4', 'team': 'billing', 'priority': 'urgent'},\n]",
              explanation:
                "The allowlist is a set (pure membership); the feed is a list of dicts (ordered records, self-describing fields). Two structures, two reasons.",
            },
            {
              code: "by_team = {}\nrejected = []\nfor t in tickets:\n    if t['priority'] not in VALID_PRIORITIES:\n        rejected.append(t['id'])\n        continue\n    by_team.setdefault(t['team'], []).append((t['id'], t['priority']))",
              explanation:
                "Set membership guards (continue — loop control), a dict-of-lists groups by team, and each grouped entry is a TUPLE — a fixed (id, priority) fact. Four structures, each on its home turf.",
            },
            {
              code: "for team, items in by_team.items():\n    urgent = len([1 for _, p in items if p == 'urgent'])\n    print(f'{team}: {len(items)} tickets, {urgent} urgent')\nprint(f'rejected: {rejected}')",
              explanation:
                "Per-group aggregation over .items(), unpacking tuple entries, rejects reported not swallowed. Every lesson in this module is on this screen — that's why this shape is the module capstone.",
            },
          ],
          output:
            "billing: 2 tickets, 2 urgent\nauth: 1 tickets, 0 urgent\nrejected: ['T3']",
        },
      ],
    },

    {
      id: "inline-practice",
      type: "inline-code",
      tocLabel: "Practice Coding",
      coding: {
        language: "python",
        filename: "library_system.py",
        instructions:
          "Build a mini library checkout report. You get a member list (with duplicates from a messy export), a checkout feed of (member, title) tuples, and a reference-only set of titles that can't leave the building. Produce: the distinct member count, per-member checkout lists (skipping and counting reference-title attempts), and the busiest member.",
        starterCode: `members_raw = ['ada', 'kai', 'ada', 'mia', 'kai']
REFERENCE_ONLY = {'Atlas of Data', 'Rare Maps'}
feed = [('ada', 'Python Crash'), ('kai', 'Atlas of Data'), ('ada', 'Stats Done Wrong'), ('mia', 'Python Crash'), ('ada', 'Rare Maps')]

# TODO 1: distinct members (set) — print the count
___

# TODO 2: loop the feed — reference titles increment blocked and are
# skipped; others append to checkouts (dict of lists, setdefault)
checkouts = {}
blocked = 0
___

print(checkouts)
print(f"blocked: {blocked}")

# TODO 3: busiest — the member with the most checkouts (max + key)
busiest = ___
print(f"busiest: {busiest}")`,
        solutionCode: `members_raw = ['ada', 'kai', 'ada', 'mia', 'kai']
REFERENCE_ONLY = {'Atlas of Data', 'Rare Maps'}
feed = [('ada', 'Python Crash'), ('kai', 'Atlas of Data'), ('ada', 'Stats Done Wrong'), ('mia', 'Python Crash'), ('ada', 'Rare Maps')]

print(f"members: {len(set(members_raw))}")

checkouts = {}
blocked = 0
for member, title in feed:
    if title in REFERENCE_ONLY:
        blocked += 1
        continue
    checkouts.setdefault(member, []).append(title)

print(checkouts)
print(f"blocked: {blocked}")

busiest = max(checkouts, key=lambda m: len(checkouts[m]))
print(f"busiest: {busiest}")`,
        expectedOutput:
          "members: 3\n{'ada': ['Python Crash', 'Stats Done Wrong'], 'mia': ['Python Crash']}\nblocked: 2\nbusiest: ada",
        hints: [
          "Distinct members: len(set(members_raw)) — dedup then count",
          "Unpack the feed tuples in the loop header; test title in REFERENCE_ONLY first, then continue",
          "checkouts.setdefault(member, []).append(title) groups without a separate existence check",
          "busiest: max over the dict's keys with key=lambda m: len(checkouts[m])",
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
          id: "py22_mcq_01",
          difficulty: "Easy",
          question:
            "You need product details by SKU, millions of times per day. Which structure holds the catalog?",
          options: [
            "A list of product dicts, scanned per lookup",
            "A dict mapping SKU → product record",
            "A set of SKUs",
            "A tuple of products",
          ],
          correctIndex: 1,
          explanation:
            "Lookup by identifier is the dict's defining job — constant-time at any size. The list scan re-pays a search cost on every single lookup; the set knows SKUs exist but holds no details.",
        },
        {
          type: "mcq",
          id: "py22_mcq_02",
          difficulty: "Easy",
          question: "Which situation genuinely wants a tuple?",
          options: [
            "A queue of pending uploads",
            "The (min, max) bounds returned by a stats function",
            "Unique visitor IDs",
            "Word frequencies",
          ],
          correctIndex: 1,
          explanation:
            "Fixed shape, positions with meanings, returned as a sealed fact — the record test. The queue accumulates (list), IDs dedupe (set), frequencies count (dict).",
        },
        {
          type: "mcq",
          id: "py22_mcq_03",
          difficulty: "Medium",
          question:
            "`if user_id in seen_ids:` runs inside a loop over 1M events. seen_ids grows to 200k entries. Which type for seen_ids?",
          options: [
            "list — order of first appearance might matter later",
            "set — each membership test is constant-time instead of a 200k-element scan",
            "tuple — immutability prevents bugs",
            "dict of id → True",
          ],
          correctIndex: 1,
          explanation:
            "Repeated membership at scale is THE set trigger: 1M × 200k list comparisons versus 1M hash lookups. (D works — sets are essentially that — but the set says the intent directly. If first-seen order matters, keep a list alongside.)",
        },
        {
          type: "scenario",
          id: "py22_sc_01",
          difficulty: "Medium",
          scenario:
            "A script maintains temperatures = {0: 21.5, 1: 23.0, 2: 19.8} — a dict whose keys are consecutive integers starting at 0 — and iterates it with for i in range(len(temperatures)).",
          question: "What's the reviewer's structural note?",
          options: [
            "Convert the keys to strings for safety",
            "This is a list wearing a dict costume — positions ARE the keys, so a plain list restores indexing, slicing, ordering tools, and honesty",
            "Use a set for faster lookup",
            "Nothing wrong — dicts are always the safer choice",
          ],
          correctIndex: 1,
          explanation:
            "Consecutive-integer keys from 0 are a list's own indices. The dict version loses slicing and sort, and invites gaps (deleting key 1 breaks the range(len) loop). Structures should state intent: sequences are lists.",
        },
        {
          type: "coding",
          id: "py22_code_01",
          difficulty: "Medium",
          prompt:
            "visits = [('ada', '/home'), ('kai', '/pricing'), ('ada', '/docs'), ('mia', '/home'), ('ada', '/pricing')] — choose structures to print: unique visitor count, page-view counts per PAGE (sorted by page name), and ada's visit count. Expected:\nvisitors: 3\n/docs: 1\n/home: 2\n/pricing: 2\nada: 3",
          starterCode:
            "visits = [('ada', '/home'), ('kai', '/pricing'), ('ada', '/docs'), ('mia', '/home'), ('ada', '/pricing')]\n# Your code here\n",
          solutionCode:
            "visits = [('ada', '/home'), ('kai', '/pricing'), ('ada', '/docs'), ('mia', '/home'), ('ada', '/pricing')]\nprint(f'visitors: {len({u for u, _ in visits})}')\npage_counts = {}\nfor _, page in visits:\n    page_counts[page] = page_counts.get(page, 0) + 1\nfor page, n in sorted(page_counts.items()):\n    print(f'{page}: {n}')\nada_visits = len([1 for u, _ in visits if u == 'ada'])\nprint(f'ada: {ada_visits}')",
          expectedOutput:
            "visitors: 3\n/docs: 1\n/home: 2\n/pricing: 2\nada: 3",
          tests: [
            {
              name: "Set for uniqueness",
              description: "Distinct visitors via a set (comprehension or set())",
            },
            {
              name: "Dict for counting",
              description: "Page views use the .get(k, 0) + 1 pattern, sorted for output",
            },
          ],
        },
        {
          type: "mcq",
          id: "py22_mcq_04",
          difficulty: "Hard",
          question:
            "Sensor readings must be looked up by (station_id, hour) — both together. Which design is most direct?",
          options: [
            "A dict keyed by tuples: readings[('st-4', 14)]",
            "Nested dicts: readings['st-4'][14]",
            "A list of (station, hour, value) scanned per lookup",
            "Two separate dicts, one per dimension",
          ],
          correctIndex: 0,
          explanation:
            "A composite fact wants a composite key — tuples are hashable, so one hop answers the point query. Nested dicts (B) also work and shine when you often want ALL hours of one station; the list scan re-pays search each time; two separate dicts can't express the joint key at all.",
        },
        {
          type: "scenario",
          id: "py22_sc_02",
          difficulty: "Hard",
          scenario:
            "A pipeline stores 2M rows as a list of dicts and computes ONLY column stats: mean amount, max latency, count by status. Memory is tight and the loops feel slow. Nothing ever processes a whole row.",
          question: "What restructuring does the access pattern suggest?",
          options: [
            "Convert each row dict to a tuple",
            "Column orientation — a dict of lists (and, at this scale, NumPy arrays / a DataFrame): field names stored once, and every stat becomes one pass over one contiguous list",
            "A set of rows to remove duplicates first",
            "Sort the list of dicts by amount",
          ],
          correctIndex: 1,
          explanation:
            "The questions are all per-COLUMN, so the row shape pays for structure nobody reads (2M copies of the key names) and scatters each field across 2M dicts. Columns match the access pattern — and that reasoning IS why DataFrames and analytical databases are column stores.",
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
            "Walk me through how you choose among list, tuple, dict, and set for a new piece of data.",
          answer:
            "I ask four questions. Access: by position or sequence → list/tuple; by key → dict; by presence → set. Order: if it carries meaning, only the sequences preserve a meaningful one. Mutability: accumulating or evolving → list/dict/set; a fixed-shape fact — coordinates, a returned pair — → tuple, which also buys hashability. Duplicates: meaningful → list (or a counting dict if I need frequencies); must be unique → set, or dict keys. Then I sanity-check against scale: any repeated search or membership test inside a loop pushes lists toward dicts/sets, because scans are linear and hashes are constant-time. And I let composition resolve conflicts — order AND fast membership means a list plus a shadow set; grouped sequences mean a dict of lists. The meta-answer interviewers want: the structure is chosen by the QUESTION the code asks of the data, not by what the data looks like.",
        },
        {
          question:
            "A colleague's join enriches 500k orders by scanning a 200k-customer list per order. Explain the problem and the fix as you would in review.",
          answer:
            "The problem is complexity, not code style: for each of 500k orders, `next(c for c in customers if c['id'] == cid)` — or any scan — walks up to 200k records, so the worst case is on the order of 10^11 comparisons; the job's runtime is the PRODUCT of the two sizes. The fix is one line before the loop: build a hash index, by_id = {c['id']: c for c in customers} — one 200k pass — then each order does a constant-time by_id.get(cid). Total work drops to one pass over each dataset, roughly 700k operations. I'd also make the miss policy explicit: .get returns None, so decide loudly whether an unknown customer skips, defaults, or fails the batch. And I'd name the general principle for the codebase: any lookup repeated inside a loop deserves a dict/set index built once outside it — this is exactly what a database hash join or pandas merge does under the hood.",
        },
        {
          question:
            "When would you reach beyond the four built-ins — and what does each upgrade replace?",
          answer:
            "When a pattern I'm hand-rolling has a named tool. Counting with d[k] = d.get(k, 0) + 1 → collections.Counter, which adds .most_common(n) for top-N reports. Grouping with setdefault(k, []).append(v) → defaultdict(list), removing the per-key initialization noise. Tuples whose positions I keep documenting in comments → namedtuple or a dataclass, giving fields names without losing immutability. Queues where I .pop(0) from a list — which shifts every remaining element — → deque with its constant-time popleft. And the big one for data work: columns of numbers in lists with Python-loop math → NumPy arrays and DataFrames, which are the column-oriented dict-of-lists idea with contiguous memory and vectorized operations. The pattern in every case: the built-ins teach the semantics; the upgrade is the same semantics with the boilerplate and the performance cliff removed — so knowing the four cold is what makes the upgrades legible.",
        },
      ],
    },

    {
      id: "common-mistakes",
      type: "callout",
      variant: "warning",
      title: "Common Mistakes to Avoid",
      content:
        "1) Lists as lookup tables — repeated `in`/.index() scans; build a dict/set index once. 2) Parallel lists synced by index — one sort and they shear; use records. 3) Dicts with keys 0,1,2,... — that's a list. 4) Sets where duplicates carried meaning — counts vanish silently. 5) Nested dicts when a tuple key states the composite fact directly. 6) Defaulting to whatever structure the data ARRIVED in — reshape to match the questions you'll ask, not the feed you received.",
    },

    {
      id: "ai-tutor",
      type: "callout",
      variant: "tip",
      title: "Ask the AI Tutor",
      content:
        "Try these prompts in the AI Tutor panel: • 'Give me ten datasets and make me pick a structure for each, then grade me.' • 'Show a slow list-scan join and walk me through indexing it.' • 'Quiz me on which composition fits: dict of lists, tuple keys, or set+list?' • 'When do I graduate to Counter, defaultdict, or namedtuple?' • 'Interview mode: ask me to design structures for a ride-sharing app's data and critique my choices.'",
    },

    {
      id: "glossary",
      type: "callout",
      variant: "info",
      title: "Glossary",
      content:
        "Access pattern — how code will read the data (by position, key, or presence). Index (design sense) — a dict/set built to make lookups constant-time. Composite key — a tuple key encoding multiple dimensions. Linear scan — checking elements one by one; cost grows with size. Constant-time — cost independent of size (hash lookups). Composition — nesting structures so each layer answers its own question. Parallel lists — the aligned-by-index anti-pattern. Counter/defaultdict/namedtuple/deque — stdlib upgrades of the counting, grouping, record, and queue patterns. Column orientation — dict of lists; the DataFrame's conceptual shape.",
    },

    {
      id: "resources",
      type: "callout",
      variant: "info",
      title: "Recommended Resources",
      content:
        "• Docs: the collections module page — read Counter, defaultdict, namedtuple, deque with this lesson's patterns in mind. • Read: the 'Time Complexity' page on the Python wiki — the official costs behind this lesson's intuition. • Practice: pick any script you've written this course and audit every container against the four questions; refactor one mischoice. • Next in DSM: structures organize data — Classes & Objects (the OOP module) organize data WITH its behavior, starting with why a class is the natural home for state you've been threading through functions.",
    },

    {
      id: "recap",
      type: "recap",
      tocLabel: "Recap",
      content:
        "✓ Choose by question: position → list/tuple, name → dict, presence → set.\n✓ Then refine: order meaningful? mutable? duplicates meaningful? fixed shape?\n✓ Scans are linear, hashes are constant — repeated lookups demand an index.\n✓ Compose: dicts of lists, tuple keys, set-beside-list; one question per layer.\n✓ Know the smells: parallel lists, integer-keyed dicts, list-as-lookup, loop-dedup.\n✓ Counter, defaultdict, namedtuple, deque, and DataFrames are these patterns, upgraded.\n\nNext up: Classes & Objects. Data Structures is complete — you can shape any data. The OOP module begins by bundling data WITH the functions that operate on it: your own types.",
    },
  ],
};
