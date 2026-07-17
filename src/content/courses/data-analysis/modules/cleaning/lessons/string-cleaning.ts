import type { Lesson } from "@/lib/curriculum/types";

export const stringCleaning: Lesson = {
  meta: {
    id: "data-analysis.cleaning.string-cleaning",
    slug: "string-cleaning",
    title: "String Cleaning",
    description:
      "Master the .str accessor: normalise casing and whitespace, replace and map inconsistent labels, extract structure from messy text with contains and regex — turning three spellings of the same city back into one.",
    estimatedTime: "30 mins",
    difficulty: "Intermediate",
    xpReward: 70,
    prerequisites: ["data-analysis.cleaning.type-coercion"],
    masteryThreshold: 80,
  },

  blocks: [
    {
      id: "intro",
      type: "lesson-intro",
      tocLabel: "Introduction",
      intro: {
        hook: "Your groupby says the company operates in 47 cities. It operates in 30. The other 17 are ' Mumbai', 'mumbai', 'MUMBAI', 'Bengaluru '… — invisible whitespace and casing splitting real categories into phantom ones. Every count, join, and chart built on that column is wrong, and no amount of statistics downstream can fix what a .str.strip() would have.",
        what: "String cleaning is normalising text columns with pandas' .str accessor — vectorised versions of Python's string methods (strip, lower, title, replace) plus pattern tools (contains, extract, split) and value mapping. It turns free-form text into consistent, groupable, joinable categories.",
        why: "Text is where inconsistency hides. Numbers are either equal or not; strings have casing, whitespace, abbreviations, and typos that make equal things unequal. Since groupby, merge, and value_counts compare strings exactly, unnormalised text corrupts every one of them silently.",
        whereUsed:
          "Standardising categories before any groupby or join, cleaning survey free-text, parsing product codes and addresses, preparing text features for models, and matching entities across systems that spell them differently.",
        objectives: [
          "Apply vectorised string methods through the .str accessor",
          "Normalise casing and strip whitespace as the default first pass",
          "Standardise known label variants with replace and map",
          "Filter rows by pattern with str.contains",
          "Extract structured parts from text with str.split and str.extract",
        ],
        realWorldApps: [
          {
            company: "Google Maps",
            headline: "Address normalisation",
            detail:
              "'123 Main St.', '123 main street', and '123 MAIN ST' must resolve to one place. Geocoding pipelines lowercase, strip, and expand abbreviations before matching addresses to locations.",
          },
          {
            company: "Amazon",
            headline: "Product title hygiene",
            detail:
              "Marketplace sellers type product data by hand; catalogue pipelines normalise casing, strip promotional noise, and extract attributes like size and colour from titles so search and dedup work.",
          },
          {
            company: "LinkedIn",
            headline: "Job title standardisation",
            detail:
              "'Sr. SWE', 'Senior Software Engineer', and 'senior software eng' are one role. Mapping raw titles onto a canonical taxonomy powers salary insights and recruiter search.",
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
            "Python strings have methods like .lower() and .strip(); pandas exposes vectorised versions of nearly all of them through the .str accessor. df['city'].str.lower() lowercases every value at once, returns a new Series, and passes NaN through untouched instead of crashing on it.",
        },
        {
          type: "code-note",
          code: `s = pd.Series([' Mumbai', 'mumbai ', 'MUMBAI', None])
print(s.str.strip().str.lower().tolist())
# ['mumbai', 'mumbai', 'mumbai', None]`,
          content:
            "Chaining .str methods is the idiom: strip whitespace, then normalise case. Three phantom cities collapse into one, and the None survives as None — .str methods are null-safe.",
        },
        {
          type: "keypoint",
          title: "The default first pass: strip + casefold",
          content:
            "Nearly every text column benefits from .str.strip() (remove leading/trailing whitespace) followed by a casing rule — .str.lower() for matching keys, .str.title() for display labels. Do this BEFORE deduplication, groupbys, or joins: it's the single highest-value line of cleaning in most pipelines.",
        },
        {
          type: "code-note",
          code: `# Fix known variants after normalising
df['city'] = df['city'].str.strip().str.lower()
df['city'] = df['city'].replace({'bombay': 'mumbai', 'bengaluru': 'bangalore'})

# Whole-value mapping with a dict (unmapped -> NaN, so it doubles as validation)
df['tier'] = df['plan'].map({'free': 0, 'pro': 1, 'enterprise': 2})`,
          content:
            "Two different tools: Series.replace substitutes listed values and leaves everything else alone — right for fixing known aliases. Series.map sends every value through the dict and turns unmapped ones into NaN — right for controlled vocabularies, where a new NaN means an unexpected label snuck in.",
        },
        {
          type: "text",
          content:
            "For filtering and feature-building, str.contains tests each value against a substring or regex and returns a boolean mask. Two sharp edges: it returns NaN for missing values (breaking boolean indexing) unless you pass na=False, and it treats the pattern as regex by default — literal searches for characters like '+' or '(' need regex=False.",
        },
        {
          type: "code-note",
          code: `mask = df['comment'].str.contains('refund', case=False, na=False)
refund_rows = df[mask]

# Splitting structured text into columns
parts = df['sku'].str.split('-', expand=True)   # 'TV-55-BLK' -> 3 columns

# Regex extraction with named groups
size = df['product'].str.extract(r'(?P<size>\\d+)\\s?(inch|in)')['size']`,
          content:
            "contains filters, split(expand=True) explodes delimited text into a DataFrame, and extract pulls regex groups into columns. Together they recover the structure hiding inside 'one big text field' data.",
        },
        {
          type: "analogy",
          title: "Barcode stickers over handwriting",
          content:
            "A warehouse where every worker handwrites labels gets 'Blu Shirt L', 'blue shirt (large)', and 'SHIRT-BLUE-L' for the same product — and the inventory count is fiction. String cleaning is pasting a printed barcode over each handwritten label: same information, one canonical form, and suddenly scanners (groupby, merge) agree with reality.",
        },
        {
          type: "warning",
          title: "Normalisation can merge things that are genuinely different",
          content:
            "Lowercasing collapses 'US' (country) into 'us' (pronoun); stripping punctuation merges 'C++' into 'C'. Aggressive normalisation is lossy — apply it to a copy or a matching key column, keep the original for display, and always compare nunique() before and after to see exactly how many categories each step merged. If a step merges more than you can explain, it merged too much.",
        },
        {
          type: "expandable",
          title: "When exact cleaning isn't enough: fuzzy matching",
          content:
            "strip/lower/replace fix systematic variation, but genuine typos — 'Mumabi' — survive every rule you didn't anticipate. The next tier is similarity: Levenshtein edit distance or token-based scores (via libraries like thefuzz or recordlinkage) match strings that are close rather than equal. It's powerful and dangerous — 'Iran' and 'Iraq' are one edit apart — so production entity resolution pairs fuzzy scores with confirmation rules (shared postcode, same phone) or human review above a threshold. Know the technique exists; reach for it only after exact normalisation has done the cheap 95%.",
        },
      ],
    },

    {
      id: "diagram",
      type: "interactive-diagram",
      tocLabel: "Visual Learning",
      visual: {
        kind: "flow",
        title: "The text normalisation pipeline",
        caption: "Click each stage — order matters, and each step is measurable with nunique().",
        nodes: [
          { id: "audit", label: "Audit", sublabel: "nunique / value_counts", detail: "Count distinct values and eyeball the long tail. 47 'cities' for 30 real ones tells you how much phantom variation exists before you start.", x: 10, y: 20, accent: false },
          { id: "strip", label: "Strip", sublabel: ".str.strip()", detail: "Remove leading/trailing whitespace — the invisible variant-maker. Internal runs of spaces may also need .str.replace(r'\\s+', ' ', regex=True).", x: 32, y: 10, accent: true },
          { id: "case", label: "Case", sublabel: ".str.lower()", detail: "One casing rule for the whole column: lower for matching keys, title for display. 'DELHI'/'delhi'/'Delhi' become one.", x: 54, y: 18, accent: true },
          { id: "alias", label: "Aliases", sublabel: "replace / map", detail: "Fix known variants: replace({'bombay':'mumbai'}) for spot fixes; map with a full vocabulary when unmapped values SHOULD become NaN for review.", x: 76, y: 32, accent: true },
          { id: "extract", label: "Extract", sublabel: "split / extract", detail: "Pull structure out of composite text: split SKUs on delimiters, regex-extract sizes and codes into their own typed columns.", x: 62, y: 62, accent: false },
          { id: "verify", label: "Verify", sublabel: "nunique again", detail: "Recount distinct values after each step and reconcile: every drop in nunique should be explainable. Then dedup and groupby can be trusted.", x: 32, y: 75, accent: true },
        ],
        edges: [
          { from: "audit", to: "strip" },
          { from: "strip", to: "case" },
          { from: "case", to: "alias" },
          { from: "alias", to: "extract" },
          { from: "extract", to: "verify" },
          { from: "alias", to: "verify" },
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
          title: "Collapse casing and whitespace variants",
          scenario: "One city, four spellings — make them one string.",
          steps: [
            { code: "import pandas as pd\ns = pd.Series(['Delhi', ' delhi', 'DELHI ', 'delhi'])", explanation: "Four values pandas sees as distinct: hidden spaces plus three casings." },
            { code: "print(s.nunique())", explanation: "nunique() confirms the damage: 4 'different' cities." },
            { code: "clean = s.str.strip().str.lower()\nprint(clean.nunique(), clean.unique().tolist())", explanation: "Strip-then-lower collapses all variants; nunique drops to 1. This two-method chain is the default first pass on any text column." },
          ],
          output: "4\n1 ['delhi']",
        },
        {
          difficulty: "Easy",
          title: "Fix known aliases with replace",
          scenario: "After normalising, some cities still have historical alternate names.",
          steps: [
            { code: "s = pd.Series(['mumbai', 'bombay', 'delhi', 'bombay'])", explanation: "Casing is already clean, but 'bombay' and 'mumbai' are the same city under two names — no casing rule can know that." },
            { code: "s = s.replace({'bombay': 'mumbai'})", explanation: "replace substitutes only the listed values and leaves everything else untouched — the right tool for a known alias list." },
            { code: "print(s.value_counts().to_dict())", explanation: "Three mumbais and one delhi: counts now reflect real cities, not spellings." },
          ],
          output: "{'mumbai': 3, 'delhi': 1}",
        },
        {
          difficulty: "Medium",
          title: "Filter feedback with str.contains",
          scenario: "Pull every customer comment that mentions refunds, without crashing on missing comments.",
          steps: [
            { code: "df = pd.DataFrame({'comment': ['Want a REFUND now', 'great product', None, 'refund pls']})", explanation: "Mixed casing and a None — both classic contains() traps." },
            { code: "mask = df['comment'].str.contains('refund', case=False, na=False)", explanation: "case=False matches any casing; na=False turns the None row into False instead of NaN, keeping the mask usable for indexing." },
            { code: "print(mask.tolist())\nprint(len(df[mask]))", explanation: "Rows 0 and 3 match. Without na=False, the NaN in the mask would raise on boolean indexing." },
          ],
          output: "[True, False, False, True]\n2",
        },
        {
          difficulty: "Hard",
          title: "Split SKUs into structured columns",
          scenario: "Product codes pack category, size, and colour into one string — unpack them.",
          steps: [
            { code: "df = pd.DataFrame({'sku': ['TV-55-BLK', 'TV-42-WHT', 'FRIDGE-300-SIL']})", explanation: "Three data points per value, jammed together with '-' delimiters." },
            { code: "parts = df['sku'].str.split('-', expand=True)\nparts.columns = ['category', 'size', 'colour']", explanation: "expand=True turns the split lists into a 3-column DataFrame; naming the columns makes it usable." },
            { code: "df = df.join(parts)\ndf['size'] = pd.to_numeric(df['size'])\nprint(df[['category','size','colour']].to_string(index=False))", explanation: "Join the parts back and coerce size to numeric — extraction plus last lesson's type coercion turns one text column into three typed features." },
          ],
          output: "category  size colour\n      TV    55    BLK\n      TV    42    WHT\n  FRIDGE   300    SIL",
        },
        {
          difficulty: "Industry Example",
          title: "Standardising a job-title column for analytics",
          scenario: "An HR analyst must report headcount by role, but titles were typed free-form by hundreds of managers.",
          steps: [
            { code: "import pandas as pd\ndf = pd.DataFrame({'title': [\n    '  Senior Software Engineer', 'senior software engineer',\n    'Sr. Software Engineer', 'Data Analyst ', 'data analyst',\n]})", explanation: "Five entries, two real roles. Whitespace, casing, and the 'Sr.' abbreviation each create phantom roles." },
            { code: "t = df['title'].str.strip().str.lower()\nt = t.str.replace('sr.', 'senior', regex=False)\ndf['role'] = t", explanation: "The pipeline in miniature: strip, lowercase, then expand the known abbreviation with a literal replace (regex=False because '.' is a regex metacharacter)." },
            { code: "print(df['role'].value_counts().to_dict())", explanation: "Headcount is now 3 senior software engineers and 2 data analysts — numbers a compensation review can actually use. The raw title column stays untouched for display." },
          ],
          output: "{'senior software engineer': 3, 'data analyst': 2}",
        },
      ],
    },

    {
      id: "inline-practice",
      type: "inline-code",
      tocLabel: "Practice Coding",
      coding: {
        language: "python",
        filename: "strings_practice.py",
        instructions:
          "A product feed has messy category labels. Normalise them, fix a known alias, then count how many products mention 'wireless' in their name (any casing, nulls present).",
        starterCode: `import pandas as pd

df = pd.DataFrame({
    'category': [' Electronics', 'electronics ', 'ELECTRONICS', 'Gadgets', 'gadgets'],
    'name':     ['Wireless Mouse', 'USB cable', None, 'wireless earbuds', 'Charger'],
})

# TODO 1: Normalise category: strip whitespace, lowercase
df['category'] = ___

# TODO 2: 'gadgets' is an old alias for 'electronics' — fix it with replace
df['category'] = ___

# TODO 3: Boolean mask: name contains 'wireless', case-insensitive, null-safe
wireless = ___

print(df['category'].nunique())
print(df['category'].unique().tolist())
print(wireless.sum())`,
        solutionCode: `import pandas as pd

df = pd.DataFrame({
    'category': [' Electronics', 'electronics ', 'ELECTRONICS', 'Gadgets', 'gadgets'],
    'name':     ['Wireless Mouse', 'USB cable', None, 'wireless earbuds', 'Charger'],
})

df['category'] = df['category'].str.strip().str.lower()

df['category'] = df['category'].replace({'gadgets': 'electronics'})

wireless = df['name'].str.contains('wireless', case=False, na=False)

print(df['category'].nunique())
print(df['category'].unique().tolist())
print(wireless.sum())`,
        expectedOutput: "1\n['electronics']\n2",
        hints: [
          "Task 1: chain .str.strip().str.lower() — whitespace first, then casing.",
          "Task 2: .replace({'gadgets': 'electronics'}) swaps only that value and leaves the rest alone.",
          "Task 3: str.contains('wireless', case=False, na=False) — na=False turns the None row into False so the mask stays boolean.",
          "After both fixes all five rows are 'electronics' (nunique 1); 'Wireless Mouse' and 'wireless earbuds' match the pattern (sum 2).",
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
          id: "pda11_mcq_01",
          difficulty: "Easy",
          question: "What does df['city'].str.lower() do with NaN values in the column?",
          options: [
            "Raises an AttributeError",
            "Converts them to the string 'nan'",
            "Passes them through as NaN untouched",
            "Drops those rows",
          ],
          correctIndex: 2,
          explanation:
            ".str methods are null-safe: missing values flow through as NaN. (A plain Python loop calling .lower() on each value would crash on the float NaN — the accessor is what handles it.)",
        },
        {
          type: "mcq",
          id: "pda11_mcq_02",
          difficulty: "Easy",
          question: "A category column should contain exactly {'basic','pro'}, and you want any other value exposed as NaN for review. Which tool does this directly?",
          options: [
            "str.replace",
            "Series.map with a dict covering the full vocabulary",
            "str.contains",
            "str.strip",
          ],
          correctIndex: 1,
          explanation:
            "map sends every value through the dict and yields NaN for anything unmapped — validation for free. replace only touches listed values and leaves surprises in place; contains and strip solve different problems.",
        },
        {
          type: "mcq",
          id: "pda11_mcq_03",
          difficulty: "Medium",
          question: "df[df['note'].str.contains('urgent')] raises 'cannot mask with non-boolean array'. The likely cause?",
          options: [
            "'urgent' must be a regex",
            "The column has NaN values, so contains returned NaN entries — pass na=False",
            "str.contains needs case=True",
            "The DataFrame is too large",
          ],
          correctIndex: 1,
          explanation:
            "For missing values contains returns NaN, making the result object-typed rather than boolean, and indexing fails. na=False maps those rows to False and restores a clean boolean mask.",
        },
        {
          type: "scenario",
          id: "pda11_sc_01",
          difficulty: "Medium",
          scenario:
            "An analyst merges a sales table to a region lookup on 'city' and loses 20% of rows to failed matches. Spot checks show the sales file has values like ' Mumbai' and 'mumbai' while the lookup has 'Mumbai'.",
          question: "What's the right fix?",
          options: [
            "Use a fuzzy-matching library immediately",
            "Switch the merge to an outer join",
            "Normalise the key on BOTH tables (strip + consistent casing) before merging",
            "Drop the rows that failed to match",
          ],
          correctIndex: 2,
          explanation:
            "Merges compare strings exactly, so the join key must be normalised identically on both sides — strip and lower each table's city column first. Outer joins keep the mismatches but don't fix them; fuzzy matching is overkill for systematic whitespace/casing; dropping loses a fifth of the data.",
        },
        {
          type: "coding",
          id: "pda11_code_01",
          difficulty: "Hard",
          prompt:
            "Extract the numeric size from each product name into an integer column and print its values as a list.\n\ndf = pd.DataFrame({'product': ['Monitor 27 inch', 'TV 55 inch', 'Monitor 24 inch']})",
          starterCode:
            "import pandas as pd\n\ndf = pd.DataFrame({'product': ['Monitor 27 inch', 'TV 55 inch', 'Monitor 24 inch']})\n\n# Your code here\n",
          solutionCode:
            "import pandas as pd\n\ndf = pd.DataFrame({'product': ['Monitor 27 inch', 'TV 55 inch', 'Monitor 24 inch']})\n\ndf['size'] = df['product'].str.extract(r'(\\d+)').astype(int)\nprint(df['size'].tolist())",
          expectedOutput: "[27, 55, 24]",
          tests: [
            { name: "Extraction", description: "str.extract with the capture group (\\d+) pulls the digit run from each name" },
            { name: "Typing", description: "The extracted strings are cast to int so the column is numeric, not object" },
          ],
        },
        {
          type: "mcq",
          id: "pda11_mcq_04",
          difficulty: "Hard",
          question: "Why is it good practice to keep the original text column and put normalised values in a new column (or a copy)?",
          options: [
            "pandas forbids overwriting string columns",
            "Normalisation is lossy — lowercasing and symbol-stripping can merge genuinely different values ('US' vs 'us', 'C++' vs 'C'), and the original is your audit trail",
            "It makes the DataFrame use less memory",
            "str methods only work on new columns",
          ],
          correctIndex: 1,
          explanation:
            "Aggressive normalisation can destroy real distinctions, and once overwritten the original is gone. Keeping raw-for-display and normalised-for-matching preserves both uses and lets you audit what each cleaning step merged. The other options are false (and copies use more memory, not less).",
        },
      ],
    },

    {
      id: "interview-questions",
      type: "interview-questions",
      tocLabel: "Interview Prep",
      questions: [
        {
          question: "A categorical column has far more distinct values than it should. Walk me through cleaning it.",
          answer:
            "I start by measuring: nunique() against the expected count, and value_counts() to see the long tail — that tail is where the variants live. Then the standard pipeline, verifying nunique after each step. First .str.strip() for whitespace, including internal runs via a regex replace if needed. Then one casing rule, usually .str.lower(). Those two steps typically collapse most phantom categories. Next, known aliases and abbreviations with replace({'bombay':'mumbai'}) — domain knowledge encoded as a dict. If the column has a closed vocabulary, I finish with map over the full vocabulary so anything unexpected becomes NaN and surfaces for review rather than hiding. Throughout, I clean into a matching column and keep the raw one, because normalisation is lossy. What survives after all that is genuine typos, which are a fuzzy-matching problem — a deliberate escalation, not the default.",
        },
        {
          question: "What are the sharp edges of str.contains that bite people in production?",
          answer:
            "Three big ones. First, missing values: contains returns NaN for them, so the 'boolean' mask isn't boolean and df[mask] raises — na=False (or na=True, chosen deliberately) is effectively mandatory on real data. Second, the pattern is regex by default: searching for 'C++' or a phone number with '+' explodes or matches wrongly unless you pass regex=False or escape the pattern — a literal search should say regex=False explicitly. Third, casing: contains is case-sensitive by default, and real text isn't consistent, so case=False is usually what the question actually means. There's also a subtler design point — contains does substring matching, so 'art' matches 'smart'; when I need whole-word or full-value matching I use fullmatch or word-boundary regex instead. My habit is to write contains(pattern, case=False, na=False, regex=...) with every argument explicit.",
        },
        {
          question: "You need to merge two customer tables from different systems on names, and exact matching loses a third of the rows. What's your strategy?",
          answer:
            "First I exhaust cheap, exact normalisation on BOTH keys, because most 'fuzzy' problems are actually systematic: strip whitespace, lowercase, collapse internal spaces, remove punctuation, expand known abbreviations, and standardise ordering if names appear as 'Last, First'. I re-measure the match rate after each step — typically that recovers most of the gap. For what remains, I escalate to fuzzy matching with edit-distance or token-based similarity, but never on its own: 'Iran'/'Iraq' are one edit apart, so I pair the similarity score with confirming evidence like a shared postcode, phone, or birth date, and route mid-confidence pairs to human review rather than auto-merging. And I treat this as record linkage with an audit trail — every merged pair is logged with its evidence — because a wrong merge on customer data (billing the wrong person) is worse than a missed match.",
        },
      ],
    },

    {
      id: "common-mistakes",
      type: "callout",
      variant: "warning",
      title: "Common Mistakes to Avoid",
      content:
        "1) Forgetting the .str prefix — df['col'].lower() raises; the accessor is what vectorises. 2) Skipping strip() and hunting exotic bugs when the culprit is a trailing space. 3) str.contains without na=False on columns with nulls — the mask stops being boolean. 4) Forgetting contains treats patterns as regex — '+' and '(' need regex=False or escaping. 5) Normalising only ONE side of a merge key. 6) Overwriting the raw column before verifying what each step merged — keep an original for audit. 7) Jumping to fuzzy matching before exhausting exact normalisation, or trusting fuzzy scores without confirming evidence.",
    },

    {
      id: "ai-tutor",
      type: "callout",
      variant: "tip",
      title: "Ask the AI Tutor",
      content:
        "Try these prompts in the AI Tutor panel: • 'ELI5: why do \" Mumbai\" and \"mumbai\" break my groupby?' • 'Show me replace vs map on the same messy column and when each wins.' • 'Quiz me on str.contains gotchas: nulls, regex, casing.' • 'Walk me through extracting sizes from product names with a regex, group by group.' • 'Interview mode: challenge my plan for matching customer names across two systems.'",
    },

    {
      id: "glossary",
      type: "callout",
      variant: "info",
      title: "Glossary",
      content:
        ".str accessor — gateway to vectorised, null-safe string methods on a Series. strip()/lower()/title() — whitespace and casing normalisers. replace (Series) — substitute listed values, leave the rest. map — send every value through a dict/function; unmapped become NaN. str.contains — boolean mask for substring/regex match (na=, case=, regex= flags). str.split(expand=True) — split delimited text into columns. str.extract — pull regex capture groups into columns. Normalisation — reducing variants to one canonical form. Fuzzy matching — matching by similarity (edit distance) instead of equality.",
    },

    {
      id: "resources",
      type: "callout",
      variant: "info",
      title: "Recommended Resources",
      content:
        "• Docs: pandas user guide 'Working with text data' — the full .str method catalogue. • Read: a regex refresher (regex101.com lets you test patterns interactively against sample values). • Practice: grab any survey export with a free-text column, run the strip→lower→replace pipeline, and chart nunique() after each step. • Next in DSM: text is consistent, types are right, rows are unique — the last cleaning question is what to do with extreme VALUES: Outlier Detection.",
    },

    {
      id: "recap",
      type: "recap",
      tocLabel: "Recap",
      content:
        "✓ The .str accessor vectorises string methods across a Series and passes NaN through safely.\n✓ Default first pass on any text column: .str.strip() then a single casing rule — measure with nunique() before and after.\n✓ replace fixes known aliases and leaves the rest; map enforces a closed vocabulary, exposing surprises as NaN.\n✓ str.contains needs deliberate na=, case=, and regex= arguments on real-world data.\n✓ split(expand=True) and extract recover structured columns from composite text.\n✓ Normalisation is lossy — keep the raw column, clean into a key column, and escalate to fuzzy matching only with confirming evidence.\n\nNext up: Outlier Detection. Your strings are canonical and your types are true — the final cleaning question is which extreme values are errors, and which are the most important data you have.",
    },
  ],
};
