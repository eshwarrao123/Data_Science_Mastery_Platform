import type { Lesson } from "@/lib/curriculum/types";

export const mergingAndJoining: Lesson = {
  meta: {
    id: "data-analysis.transformation.merging-and-joining",
    slug: "merging-and-joining",
    title: "Merging & Joining DataFrames",
    description:
      "Combine tables with pd.merge: inner, left, right, and outer joins, key hygiene that prevents silent row loss, and the fan-out trap where a merge quietly multiplies your data.",
    estimatedTime: "35 mins",
    difficulty: "Intermediate",
    xpReward: 80,
    prerequisites: ["data-analysis.pandas-core.data-selection"],
    masteryThreshold: 80,
  },

  blocks: [
    {
      id: "intro",
      type: "lesson-intro",
      tocLabel: "Introduction",
      intro: {
        hook: "Orders live in one table, customers in another, products in a third — because that's how databases stay sane. But your analysis needs all three at once: 'revenue by customer segment by product category' touches every table. merge is how separate tables become one answer — and it's also where careless analyses silently lose 20% of their rows or double-count half their revenue.",
        what: "pd.merge combines two DataFrames by matching rows on key columns, like SQL joins: inner keeps only matched rows, left keeps everything from the left table, right mirrors that, and outer keeps everything from both. The how, on/left_on/right_on, validate, and indicator parameters control and audit the match.",
        why: "Real data is relational — facts about the same entities scattered across tables. Almost every real analysis starts by joining them. Joins are also the top source of silent data corruption in analytics: lost rows from mismatched keys and duplicated rows from fan-out don't error, they just produce wrong numbers.",
        whereUsed:
          "Enriching transactions with customer attributes, attaching product metadata to sales, combining API results with internal records, building model feature tables from many sources — every star-schema analysis ever.",
        objectives: [
          "Merge two DataFrames on a shared key with pd.merge",
          "Choose between inner, left, right, and outer joins deliberately",
          "Audit a merge with the indicator parameter and row-count checks",
          "Prevent fan-out with the validate parameter and key-uniqueness checks",
          "Handle differing key names (left_on/right_on) and overlapping columns (suffixes)",
        ],
        realWorldApps: [
          {
            company: "Walmart",
            headline: "Star-schema retail analytics",
            detail:
              "Sales facts join to product, store, and date dimension tables for every report — the same left-joins analysts write in pandas, run at hundreds-of-millions-of-rows scale.",
          },
          {
            company: "Epic Systems",
            headline: "Patient record linkage",
            detail:
              "Labs, prescriptions, and visits live in separate systems keyed by patient ID; clinical analytics join them — with strict validation, because a fan-out that duplicates a dosage row is a safety issue.",
          },
          {
            company: "HubSpot",
            headline: "Marketing attribution",
            detail:
              "Ad clicks, email opens, and deals close in different tools; attribution joins them on contact ID, and the unmatched remainder — clicks with no contact — is itself a tracked metric.",
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
          type: "code-note",
          code: `orders = pd.DataFrame({'order_id':[1,2,3], 'cust':['A','B','X'], 'amt':[100,200,50]})
custs  = pd.DataFrame({'cust':['A','B','C'], 'city':['Pune','Delhi','Goa']})

pd.merge(orders, custs, on='cust', how='inner')  # 2 rows: A, B
pd.merge(orders, custs, on='cust', how='left')   # 3 rows: X gets NaN city
pd.merge(orders, custs, on='cust', how='outer')  # 4 rows: X and C both kept`,
          content:
            "One pair of tables, three different results. Order X has no customer record; customer C has no orders. Which rows survive is entirely the how= parameter — and therefore a business decision, not a technicality.",
        },
        {
          type: "keypoint",
          title: "The four joins",
          content:
            "inner: only keys present in BOTH tables — silently drops non-matches on either side. left: every left row survives; missing right-side values become NaN — the default for enrichment ('keep all my orders, attach customer info where known'). right: the mirror. outer: union of keys, NaN where either side is absent — the audit join, because nothing disappears.",
        },
        {
          type: "text",
          content:
            "The mental model for row counts: for each key value, the output contains (rows in left with that key) × (rows in right with that key) rows. When the right table has one row per key — a proper lookup — the multiplication is ×1 and row counts behave. When it doesn't, you get fan-out.",
        },
        {
          type: "warning",
          title: "Fan-out: the silent row multiplier",
          content:
            "If the 'lookup' table has 2 rows for customer A, every A-order appears TWICE after the merge — and revenue double-counts. No error, no warning. Defences: check key uniqueness before merging (custs['cust'].is_unique), pass validate='many_to_one' so pandas RAISES if the right side has duplicate keys, and compare row counts before vs after — a left join should never grow the left table's row count unless you expected many-to-many.",
        },
        {
          type: "code-note",
          code: `merged = pd.merge(orders, custs, on='cust', how='left',
                  validate='many_to_one',   # raise if custs has dup keys
                  indicator=True)           # adds _merge column
print(merged['_merge'].value_counts().to_dict())
# {'both': 2, 'left_only': 1, 'right_only': 0}`,
          content:
            "The two audit tools. validate encodes your assumption about key multiplicity and turns violations into loud errors. indicator adds a _merge column telling each row's provenance — value_counts on it is the one-line merge health report.",
        },
        {
          type: "code-note",
          code: `# Different key names on each side
pd.merge(sales, users, left_on='customer_id', right_on='id')

# Same-named non-key columns get suffixes
pd.merge(a, b, on='key', suffixes=('_2025', '_2026'))

# df.join: index-based convenience wrapper
totals.join(counts)   # matches on index`,
          content:
            "left_on/right_on when the key has different names (drop the redundant duplicate column afterwards). suffixes disambiguates same-named columns — set them meaningfully instead of accepting _x/_y. df.join is merge's index-matching convenience sibling.",
        },
        {
          type: "analogy",
          title: "Two filing cabinets",
          content:
            "One cabinet holds order slips, another holds customer cards, both filed by customer number. An inner join keeps only slips with a matching card — orphan slips go in the bin. A left join keeps every slip, stapling on the card when found and a blank card when not. And if someone mis-filed two cards under the same number, every matching slip gets photocopied — one copy per card. That photocopier is fan-out, and it runs silently.",
        },
        {
          type: "expandable",
          title: "Key hygiene: why joins lose rows that 'should' match",
          content:
            "Everything from the cleaning module converges here. Keys fail to match because of: dtype mismatches — customer_id as int64 in one table and string in the other matches NOTHING (compare df.dtypes on both sides first); whitespace and casing — ' A123' ≠ 'A123' (normalise both sides identically); NaN keys — NaN never equals NaN, so null-keyed rows can't match anything; and lookup staleness — genuinely new IDs absent from an old dimension table. The professional habit: after any important left join, compute the match rate from indicator (share of 'both'), and investigate before accepting — a 97% match rate is a question ('which 3%? are they random or systematic?'), not a nuisance.",
        },
      ],
    },

    {
      id: "diagram",
      type: "interactive-diagram",
      tocLabel: "Visual Learning",
      visual: {
        kind: "comparison",
        title: "The four joins, one pair of tables",
        caption: "Orders {A, B, X} × Customers {A, B, C} — click each join to see who survives.",
        nodes: [
          { id: "left-t", label: "Orders (left)", sublabel: "keys A, B, X", detail: "The fact table: order X references customer X, who is missing from the customer table — an orphan key.", x: 15, y: 12, accent: false },
          { id: "right-t", label: "Customers (right)", sublabel: "keys A, B, C", detail: "The dimension/lookup table: customer C exists but placed no orders. Ideally one row per key — verify with .is_unique.", x: 85, y: 12, accent: false },
          { id: "inner", label: "inner", sublabel: "A, B", detail: "Intersection only: X's order and C's record both vanish — silently. Use when unmatched rows are truly irrelevant, and say so explicitly.", x: 20, y: 48, accent: true },
          { id: "left-j", label: "left", sublabel: "A, B, X(+NaN)", detail: "Every order survives; X gets NaN customer fields. The enrichment default: never lose facts because a lookup is incomplete.", x: 47, y: 48, accent: true },
          { id: "outer", label: "outer", sublabel: "A, B, X, C", detail: "Union: everything from both sides, NaN where absent. The audit join — with indicator=True it shows exactly what matched and what didn't.", x: 74, y: 48, accent: true },
          { id: "audit", label: "Audit", sublabel: "indicator + validate", detail: "indicator adds _merge (both/left_only/right_only); validate='many_to_one' raises on duplicate lookup keys before fan-out can corrupt counts.", x: 47, y: 82, accent: true },
        ],
        edges: [
          { from: "left-t", to: "inner" },
          { from: "right-t", to: "inner" },
          { from: "inner", to: "left-j", label: "keep all left" },
          { from: "left-j", to: "outer", label: "keep all both" },
          { from: "outer", to: "audit" },
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
          title: "A basic enrichment join",
          scenario: "Attach each order's customer city from a lookup table.",
          steps: [
            { code: "import pandas as pd\norders = pd.DataFrame({'order':[1,2,3], 'cust':['A','B','A'], 'amt':[100,200,150]})\ncities = pd.DataFrame({'cust':['A','B'], 'city':['Pune','Delhi']})", explanation: "A fact table (orders) and a clean lookup (one row per customer)." },
            { code: "merged = pd.merge(orders, cities, on='cust', how='left')", explanation: "Left join on the shared key: every order keeps its row and gains a city column." },
            { code: "print(merged.to_string(index=False))", explanation: "Three orders in, three rows out — customer A's city appears on both of A's orders. Enrichment without loss." },
          ],
          output: "order cust  amt  city\n    1    A  100  Pune\n    2    B  200 Delhi\n    3    A  150  Pune",
        },
        {
          difficulty: "Easy",
          title: "inner vs left when keys don't all match",
          scenario: "One order references a customer missing from the lookup — watch each join handle it.",
          steps: [
            { code: "orders = pd.DataFrame({'order':[1,2,3], 'cust':['A','B','X']})\ncities = pd.DataFrame({'cust':['A','B','C'], 'city':['Pune','Delhi','Goa']})", explanation: "Order 3 references customer X (not in lookup); customer C has no orders." },
            { code: "print(len(pd.merge(orders, cities, on='cust', how='inner')))", explanation: "Inner keeps the intersection {A, B}: 2 rows. Order 3 is GONE — with no error." },
            { code: "left = pd.merge(orders, cities, on='cust', how='left')\nprint(len(left), left['city'].isna().sum())", explanation: "Left keeps all 3 orders; X's city is NaN. The NaN count after a left join is your unmatched-rows counter." },
          ],
          output: "2\n3 1",
        },
        {
          difficulty: "Medium",
          title: "Audit a merge with indicator",
          scenario: "Before trusting a join, get the match report.",
          steps: [
            { code: "orders = pd.DataFrame({'order':[1,2,3], 'cust':['A','B','X']})\ncities = pd.DataFrame({'cust':['A','B','C'], 'city':['Pune','Delhi','Goa']})", explanation: "Same tables — now we quantify the mismatch instead of discovering it later." },
            { code: "audit = pd.merge(orders, cities, on='cust', how='outer', indicator=True)", explanation: "Outer join so nothing disappears, indicator=True to label each row's provenance." },
            { code: "print(audit['_merge'].value_counts().to_dict())", explanation: "The health report: 2 matched, 1 order without customer (left_only — data quality issue to chase), 1 customer without orders (right_only — fine). Now choose the join deliberately." },
          ],
          output: "{'both': 2, 'left_only': 1, 'right_only': 1}",
        },
        {
          difficulty: "Hard",
          title: "Fan-out: catch it with validate",
          scenario: "The customer lookup accidentally has a duplicate — see the damage, then the defence.",
          steps: [
            { code: "orders = pd.DataFrame({'order':[1,2], 'cust':['A','B'], 'amt':[100,200]})\ndirty = pd.DataFrame({'cust':['A','A','B'], 'city':['Pune','Mumbai','Delhi']})", explanation: "Customer A has TWO lookup rows (a conflict from the dedup lesson). The lookup is no longer one-row-per-key." },
            { code: "bad = pd.merge(orders, dirty, on='cust', how='left')\nprint(len(bad), bad['amt'].sum())", explanation: "2 orders became 3 rows — A's order duplicated, once per lookup row — and revenue inflated from 300 to 400. Silently." },
            { code: "try:\n    pd.merge(orders, dirty, on='cust', how='left', validate='many_to_one')\nexcept Exception as e:\n    print(type(e).__name__)", explanation: "validate='many_to_one' asserts the right side is unique per key — and raises MergeError instead of corrupting the data. Encode the assumption; let violations be loud." },
          ],
          output: "3 400\nMergeError",
        },
        {
          difficulty: "Industry Example",
          title: "Three-table revenue report",
          scenario: "A retail analyst joins orders → customers → products to answer 'revenue by segment and category', checking row counts at each step.",
          steps: [
            { code: "import pandas as pd\norders = pd.DataFrame({'oid':[1,2,3,4], 'cust':['A','B','A','C'], 'sku':['P1','P2','P1','P2'], 'amt':[100,200,150,120]})\ncusts = pd.DataFrame({'cust':['A','B','C'], 'segment':['retail','corp','retail']})\nprods = pd.DataFrame({'sku':['P1','P2'], 'category':['electronics','apparel']})", explanation: "A classic mini star schema: one fact table, two dimensions, both dimensions one-row-per-key." },
            { code: "step1 = pd.merge(orders, custs, on='cust', how='left', validate='many_to_one')\nstep2 = pd.merge(step1, prods, on='sku', how='left', validate='many_to_one')\nassert len(step2) == len(orders)", explanation: "Chain left joins with validate on each hop, and assert the fact-table row count never changed — the three-line discipline that makes multi-join pipelines trustworthy." },
            { code: "report = step2.groupby(['segment','category'])['amt'].sum().unstack(fill_value=0)\nprint(report.to_string())", explanation: "Joined table feeds straight into last lesson's groupby-unstack idiom: revenue by segment and category, built from three tables with zero silent losses." },
          ],
          output: "category  apparel  electronics\nsegment                       \ncorp          200            0\nretail        120          250",
        },
      ],
    },

    {
      id: "inline-practice",
      type: "inline-code",
      tocLabel: "Practice Coding",
      coding: {
        language: "python",
        filename: "merge_practice.py",
        instructions:
          "Enrich a rides table with driver info, quantify the unmatched rides, and compute revenue per driver rating — auditing as you go.",
        starterCode: `import pandas as pd

rides = pd.DataFrame({
    'ride':   [1, 2, 3, 4],
    'driver': ['d1', 'd2', 'd9', 'd1'],
    'fare':   [120, 250, 90, 180],
})
drivers = pd.DataFrame({
    'driver': ['d1', 'd2', 'd3'],
    'rating': [4.8, 4.5, 4.9],
})

# TODO 1: Left-join rides to drivers on 'driver'
merged = ___

# TODO 2: How many rides have no driver record? (count NaN ratings)
unmatched = ___

# TODO 3: Total fare per rating for the MATCHED rides only
per_rating = ___

print(len(merged))
print(unmatched)
print(per_rating.to_dict())`,
        solutionCode: `import pandas as pd

rides = pd.DataFrame({
    'ride':   [1, 2, 3, 4],
    'driver': ['d1', 'd2', 'd9', 'd1'],
    'fare':   [120, 250, 90, 180],
})
drivers = pd.DataFrame({
    'driver': ['d1', 'd2', 'd3'],
    'rating': [4.8, 4.5, 4.9],
})

merged = pd.merge(rides, drivers, on='driver', how='left')

unmatched = merged['rating'].isna().sum()

per_rating = merged.dropna(subset=['rating']).groupby('rating')['fare'].sum()

print(len(merged))
print(unmatched)
print(per_rating.to_dict())`,
        expectedOutput: "4\n1\n{4.5: 250, 4.8: 300}",
        hints: [
          "Task 1: pd.merge(rides, drivers, on='driver', how='left') — left keeps all 4 rides.",
          "Task 2: after a left join, missing right-side values are NaN — merged['rating'].isna().sum() counts the unmatched (ride 3, driver d9).",
          "Task 3: drop the unmatched rows first with dropna(subset=['rating']), then groupby('rating')['fare'].sum().",
          "d1 drove rides 1 and 4 (120+180=300 at rating 4.8); d2 drove ride 2 (250 at 4.5); d3 had no rides so no group.",
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
          id: "pda15_mcq_01",
          difficulty: "Easy",
          question: "In a LEFT join of orders (left) to customers (right), an order whose customer isn't in the customer table:",
          options: [
            "Is dropped from the result",
            "Survives, with NaN in the customer columns",
            "Raises a KeyError",
            "Gets matched to the nearest customer",
          ],
          correctIndex: 1,
          explanation:
            "Left joins keep every left-table row; unmatched ones get NaN for the right side's columns. Dropping non-matches is inner-join behaviour, and nothing about merge does nearest-matching.",
        },
        {
          type: "mcq",
          id: "pda15_mcq_02",
          difficulty: "Easy",
          question: "What does indicator=True add to a merge result?",
          options: [
            "A boolean column marking duplicate rows",
            "A _merge column labelling each row 'both', 'left_only', or 'right_only'",
            "A count of matched keys",
            "Nothing unless how='outer'",
          ],
          correctIndex: 1,
          explanation:
            "The _merge column records each row's provenance; value_counts on it is the standard one-line match report. It works with any how= value.",
        },
        {
          type: "mcq",
          id: "pda15_mcq_03",
          difficulty: "Medium",
          question: "A left join of a 10,000-row fact table to a 'lookup' produced 11,400 rows. What happened?",
          options: [
            "The lookup was missing 1,400 keys",
            "Fan-out: some lookup keys have multiple rows, multiplying matching fact rows",
            "pandas added 1,400 NaN rows",
            "That's normal for left joins",
          ],
          correctIndex: 1,
          explanation:
            "A left join to a one-row-per-key lookup can never grow the left table. Growth means duplicate keys on the right — each duplicate photocopies its matching left rows. validate='many_to_one' would have raised instead.",
        },
        {
          type: "scenario",
          id: "pda15_sc_01",
          difficulty: "Medium",
          scenario:
            "An analyst inner-joins sessions to a marketing-source lookup, then reports 'sessions by source'. Total sessions in the report: 84,000. The raw sessions table: 100,000 rows. The report ships without comment.",
          question: "What's wrong with this picture?",
          options: [
            "Nothing — inner joins are always correct",
            "16% of sessions silently vanished (unmatched sources); the report undercounts and the missing share should have been investigated or shown as 'unknown'",
            "The join should have been a right join",
            "sessions should have been the right table",
          ],
          correctIndex: 1,
          explanation:
            "Inner joins drop non-matches without a trace — here, 16,000 sessions with no source record. A left join with the NaN group labelled 'unknown' keeps the total honest; at minimum the gap needs investigating and disclosing. Join choice is a reporting decision.",
        },
        {
          type: "coding",
          id: "pda15_code_01",
          difficulty: "Hard",
          prompt:
            "Merge the two tables on their differently-named keys, then print the number of employees whose department has no budget record.\n\nemps = pd.DataFrame({'name':['ana','raj','kim','lee'], 'dept_id':[10, 20, 30, 10]})\nbudgets = pd.DataFrame({'department':[10, 20], 'budget':[500, 300]})",
          starterCode:
            "import pandas as pd\n\nemps = pd.DataFrame({'name':['ana','raj','kim','lee'], 'dept_id':[10, 20, 30, 10]})\nbudgets = pd.DataFrame({'department':[10, 20], 'budget':[500, 300]})\n\n# Your code here\n",
          solutionCode:
            "import pandas as pd\n\nemps = pd.DataFrame({'name':['ana','raj','kim','lee'], 'dept_id':[10, 20, 30, 10]})\nbudgets = pd.DataFrame({'department':[10, 20], 'budget':[500, 300]})\n\nmerged = pd.merge(emps, budgets, left_on='dept_id', right_on='department', how='left')\nprint(merged['budget'].isna().sum())",
          expectedOutput: "1",
          tests: [
            { name: "Key mapping", description: "left_on='dept_id', right_on='department' matches the differently-named keys" },
            { name: "Unmatched count", description: "Only kim's dept 30 lacks a budget row, so exactly 1 NaN budget after the left join" },
          ],
        },
        {
          type: "mcq",
          id: "pda15_mcq_04",
          difficulty: "Hard",
          question: "Two tables both have an int-looking customer key, but the merge matches zero rows. The most likely culprit?",
          options: [
            "merge requires sorted keys",
            "A dtype mismatch — the key is int64 in one table and object (string) in the other, and 1 never equals '1'",
            "Both tables are too large",
            "how='left' disables matching",
          ],
          correctIndex: 1,
          explanation:
            "Keys match by value AND type: int 1 ≠ string '1'. This classic arises when one file loaded the ids as strings (a stray character, or leading zeros). Compare dtypes on both key columns first; align them with astype before merging.",
        },
      ],
    },

    {
      id: "interview-questions",
      type: "interview-questions",
      tocLabel: "Interview Prep",
      questions: [
        {
          question: "Explain the four join types and how you choose among them.",
          answer:
            "All four match rows by key; they differ in who survives a non-match. Inner keeps only keys present in both tables — clean but lossy, and the loss is silent. Left keeps every left row, attaching NaN where the right side is absent; right mirrors it. Outer keeps the union with NaN on both sides' gaps. My choice follows the question's grammar: if the left table holds the facts I'm counting — orders, sessions, patients — I default to LEFT, because losing facts to an incomplete lookup corrupts totals. Inner is for when unmatched rows are genuinely out of scope, and I say so explicitly in the analysis. Outer plus indicator is my audit tool for understanding two tables' overlap before committing. The habit that matters more than the choice: after any join, account for the row count — I should be able to explain exactly why the output has the rows it has.",
        },
        {
          question: "What is join fan-out, when does it happen, and how do you defend against it?",
          answer:
            "For each key value, a merge outputs the cross product: left rows with that key times right rows with that key. When the right table is a proper lookup — one row per key — that's ×1 and invisible. When a key repeats on the right, every matching left row is duplicated once per repeat, and downstream sums and counts inflate with no error raised. It bites when 'lookups' aren't as unique as assumed: duplicate customer records, a product table with one row per variant instead of per product, or a slowly-changing dimension holding history. Three defences, in order: check assumptions before joining (right_df[key].is_unique, or duplicated().sum()); encode the assumption in the merge itself with validate='many_to_one' so violations raise MergeError instead of corrupting silently; and reconcile after — a left join must not change the left table's row count, so assert len(merged) == len(left). In pipelines I keep all three: the assert catches what future data breaks.",
        },
        {
          question: "A left join is losing matches you know should hit. How do you debug it?",
          answer:
            "Mismatches are almost always key hygiene, so I work through the usual suspects in order of frequency. First dtypes: print both key columns' dtypes — int64 versus object is the classic, where 1 never equals '1'; align with astype. Second, string cleanliness: whitespace and casing — ' A123' versus 'A123' — fixed by normalising BOTH sides with the same strip/lower treatment. Third, NaN keys: NaN matches nothing, so null-keyed rows are guaranteed misses; count them separately. Fourth, encoding-level gremlins if the data crossed systems: non-breaking spaces, zero-width characters — visible via repr() of sample values, not via print. To localise, I take a handful of keys that should match, pull them from both tables, and compare their repr side by side; the difference is usually visible immediately. Then I quantify with an outer join + indicator to see whether the misses are a random sprinkle (data entry noise) or a systematic block (one source file, one date range) — because the fix differs: cleaning rules for the former, an upstream conversation for the latter.",
        },
      ],
    },

    {
      id: "common-mistakes",
      type: "callout",
      variant: "warning",
      title: "Common Mistakes to Avoid",
      content:
        "1) Defaulting to inner join and silently losing unmatched facts — enrichment wants LEFT. 2) Never checking row counts before vs after — a left join that grew has fan-out; one that shrank wasn't a left join. 3) Skipping validate= on joins to 'lookups' you didn't verify are unique. 4) Merging on keys with mismatched dtypes (int vs string) and getting zero matches. 5) Accepting _x/_y suffixes instead of naming them meaningfully. 6) Forgetting NaN keys can never match — count them before blaming the merge. 7) Chaining several joins with no per-hop assertions, then debugging the final number instead of the hop that broke it.",
    },

    {
      id: "ai-tutor",
      type: "callout",
      variant: "tip",
      title: "Ask the AI Tutor",
      content:
        "Try these prompts in the AI Tutor panel: • 'ELI5: the four joins with the filing-cabinets story.' • 'Show me fan-out corrupting a revenue sum, then validate catching it.' • 'Quiz me: pick the right how= for scenarios you invent.' • 'My join matches zero rows — walk me through the debugging checklist.' • 'Interview mode: make me defend a left-vs-inner choice in a sessions report.'",
    },

    {
      id: "glossary",
      type: "callout",
      variant: "info",
      title: "Glossary",
      content:
        "pd.merge — combine two DataFrames by matching key values. how — join type: inner (intersection), left/right (keep one side), outer (union). on / left_on / right_on — key column(s), same-named or per-side. Fan-out — row multiplication from duplicate keys on the joined side. validate — assert key multiplicity ('one_to_one', 'many_to_one'…); raises MergeError on violation. indicator — adds _merge provenance column (both/left_only/right_only). suffixes — disambiguate same-named non-key columns. df.join — index-based merge convenience. Fact/dimension table — the many-rows events table and the one-row-per-entity lookups it joins to.",
    },

    {
      id: "resources",
      type: "callout",
      variant: "info",
      title: "Recommended Resources",
      content:
        "• Docs: pandas user guide 'Merge, join, concatenate and compare' — merge semantics, validate, and indicator in depth. • Read: any star-schema primer (fact vs dimension tables) — it's the data model your joins will meet in every warehouse. • Practice: build two small tables with deliberate orphans and a duplicate key; run all four joins, predict each row count BEFORE running, and verify with indicator. • Next in DSM: joins combine tables at matching rows — Window Functions compute over neighbouring rows within one table: rolling averages, cumulative sums, and shifts.",
    },

    {
      id: "recap",
      type: "recap",
      tocLabel: "Recap",
      content:
        "✓ merge matches rows by key; how= decides who survives a non-match — a business decision, not a technicality.\n✓ Default to left joins for enrichment: keep every fact, take NaN where the lookup is silent.\n✓ Output rows per key = left count × right count — duplicate lookup keys mean fan-out and inflated sums.\n✓ validate='many_to_one' turns your uniqueness assumption into a loud MergeError; indicator gives the match report.\n✓ Zero matches? Check key dtypes, whitespace/casing, and NaN keys before anything else.\n✓ Chain joins with per-hop row-count assertions, not end-of-pipeline debugging.\n\nNext up: Window Functions (rolling, expanding). Joins looked ACROSS tables — next you'll look along ordered rows within one table: moving averages, cumulative totals, and comparing each row to the one before it.",
    },
  ],
};
