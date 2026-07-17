import type { Lesson } from "@/lib/curriculum/types";

export const regexForData: Lesson = {
  meta: {
    id: "python.python-ds-tools.regex-for-data",
    slug: "regex-for-data",
    title: "Regex for Data",
    description:
      "Regular expressions as a data tool: patterns, character classes, quantifiers, groups for extraction, re.findall and re.sub — pulling structure out of messy text.",
    estimatedTime: "35 mins",
    difficulty: "Intermediate",
    xpReward: 80,
    prerequisites: ["python.foundations.strings-and-string-methods"],
    masteryThreshold: 80,
  },

  blocks: [
    {
      id: "intro",
      type: "lesson-intro",
      tocLabel: "Introduction",
      intro: {
        hook: "A column of product codes: 'SKU-4821 (warehouse B)', 'sku 302 - clearance', 'Item# 77'. Your .split() and .replace() skills — mighty as they are — hit their ceiling here: the structure varies. Regular expressions describe the PATTERN ('some digits after some letters') instead of exact characters, and suddenly all three rows yield their numbers to one line of code.",
        what: "Regex: a mini-language for describing text patterns. Python's re module applies them — re.search finds a match, re.findall extracts every match, re.sub rewrites them. Character classes (\\d digit, \\w word char, \\s space), quantifiers (+ one-or-more, * zero-or-more, ? optional), and capture groups (parentheses) that pull out exactly the pieces you want.",
        why: "Real text data is semi-structured: log lines, product descriptions, addresses, survey answers, scraped HTML. Extracting the phone numbers, prices, codes, and dates buried inside is a daily data task — and it's regex or a hundred lines of brittle string surgery. pandas exposes the same engine as .str.extract/.str.contains, so this skill transfers directly to DataFrames.",
        whereUsed:
          "Log parsing, data cleaning (normalizing phone numbers, stripping units), feature extraction from text, web scraping, validation (is this an email?), and the pandas .str accessor family.",
        objectives: [
          "Read and write patterns with \\d, \\w, \\s, character sets, and quantifiers",
          "Choose among re.search, re.findall, and re.sub by task",
          "Extract fields with capture groups — including several at once",
          "Anchor patterns (^, $) and escape literal special characters",
          "Know regex's limits: when string methods or a parser beat a pattern",
        ],
        realWorldApps: [
          {
            company: "Google",
            headline: "RE2 powers log analysis at scale",
            detail:
              "Google built the RE2 regex engine to safely run user-supplied patterns over planet-scale logs — pattern extraction is so central to observability that the engine itself became infrastructure.",
          },
          {
            company: "Elastic",
            headline: "Grok patterns are named regexes",
            detail:
              "Logstash's grok — the standard way logs become structured events — is a library of named regular expressions; every %{IPV4:client} you see expands to a regex capture group.",
          },
          {
            company: "OpenRefine",
            headline: "Data cleaning's power tool",
            detail:
              "The data-cleaning tool beloved by journalists and archivists leans on regex transforms to normalize the chaos of hand-entered data — dates, names, addresses — exactly this lesson's use case.",
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
            "import re. A pattern is a string describing text SHAPE: r'\\d+' means 'one or more digits'. The r prefix (raw string) stops Python from interpreting backslashes before regex sees them — write every pattern as r'...' without exception. Core vocabulary: \\d digit, \\w word character (letter/digit/underscore), \\s whitespace, . ANY character. Capitalized negates: \\D non-digit, \\S non-whitespace.",
        },
        {
          type: "code-note",
          code: "import re\n\ntext = 'Order 4821 shipped to Berlin, order 302 pending'\n\nprint(re.findall(r'\\d+', text))        # ['4821', '302']\nprint(re.search(r'\\d+', text).group())  # '4821' (first match only)\nprint(re.sub(r'\\d+', '#', text))        # digits replaced",
          content:
            "The three verbs: findall EXTRACTS every match into a list (the data-work workhorse), search finds the FIRST match (None if absent — check before .group()!), sub REWRITES matches. Note findall returns strings — int() them yourself, a type-conversion lesson callback.",
        },
        {
          type: "keypoint",
          title: "Quantifiers: how many of the thing",
          content:
            "+ one or more, * zero or more, ? zero or one (optional), {3} exactly three, {2,4} two to four. They attach to the item just before them: \\d+ is 'digits, at least one'; colou?r matches color AND colour; \\d{4} is exactly four digits (years!). Default matching is GREEDY — .* grabs the longest possible stretch; adding ? (.*?) makes it lazy, taking the shortest. The greedy-vs-lazy distinction matters the moment two delimiters appear on one line.",
        },
        {
          type: "code-note",
          code: "import re\n\nlog = '2026-07-16 ERROR db timeout; 2026-07-15 INFO ok'\n\ndates = re.findall(r'\\d{4}-\\d{2}-\\d{2}', log)\nprint(dates)                    # ['2026-07-16', '2026-07-15']\n\nlevels = re.findall(r'[A-Z]{4,5}', log)\nprint(levels)                   # ['ERRO', 'INFO'] -- oops!\nprint(re.findall(r'\\b(?:ERROR|INFO|WARN)\\b', log))  # ['ERROR', 'INFO']",
          content:
            "\\d{4}-\\d{2}-\\d{2} reads as the ISO date shape it matches. The second attempt shows a classic miss: {4,5} grabbed 4 letters of ERROR. Fixes: alternation (A|B|C) lists literal options; \\b is a word BOUNDARY pin; (?:...) groups without capturing. Regexes fail like this — quietly, plausibly — so always test on sample data and check the output.",
        },
        {
          type: "keypoint",
          title: "Character sets and anchors",
          content:
            "[abc] matches ONE character from the set; [a-z0-9] uses ranges; [^0-9] negates (any char EXCEPT digits). Anchors pin position: ^ start of string, $ end. r'^\\d{3}$' matches strings that are ENTIRELY three digits — the validation pattern. Without anchors a pattern matches anywhere inside: r'\\d{3}' happily finds '123' inside 'x12345'. Validation = anchored (re.fullmatch is the explicit tool); extraction = unanchored.",
        },
        {
          type: "keypoint",
          title: "Capture groups: extraction's precision tool",
          content:
            "Parentheses capture pieces: r'(\\w+)@(\\w+\\.\\w+)' against 'ada@example.com' captures 'ada' and 'example.com'. With ONE group, findall returns a list of that group's values; with SEVERAL, a list of TUPLES — rows, ready to become dicts or a DataFrame. m.group(1), m.group(2) read them from a search match (group(0) or group() is the whole match). Named groups (?P<user>\\w+) document intent, readable back as m.group('user').",
        },
        {
          type: "analogy",
          title: "A stencil for text",
          content:
            "String methods cut text at exact marks — split at this comma, replace this word — like scissors following a drawn line. A regex is a STENCIL: it describes a shape ('four digits, dash, two digits'), and wherever you press it against the text, matching shapes show through. Capture groups are windows cut INTO the stencil: press it once and the interesting pieces (the area code, the domain, the price) appear in their own labeled openings. You stop caring what surrounds the shape — the stencil finds it in any mess.",
        },
        {
          type: "expandable",
          title: "Escaping, compiling, and the pandas bridge",
          content:
            "Regex reserves . ^ $ * + ? ( ) [ ] { } | \\ — to match one literally, escape it: r'\\$\\d+' matches $25, r'3\\.14' matches the actual number (unescaped, r'3.14' also matches '3x14'!). Prices, IPs, and filenames are where forgotten escapes bite. For a pattern used many times, pat = re.compile(r'...') pre-parses it; pat.findall(line) in a loop is cleaner and faster. And the bridge that makes this lesson pay twice: pandas' .str.contains(pattern) filters rows by regex, .str.extract(r'(\\d+)') pulls capture groups into new COLUMNS, .str.replace(pat, repl, regex=True) cleans them — the same patterns, applied to a whole column at once.",
        },
        {
          type: "warning",
          title: "Knowing when NOT to regex",
          content:
            "1) Fixed, simple structure → string methods win: 'a,b,c'.split(',') beats a pattern for clarity (the csv module beats both for real CSV with quoted fields). 2) Nested structure (HTML, JSON, code) → use a real parser; regex fundamentally cannot balance nested tags, and trying is a rite of passage everyone should fail exactly once. 3) A regex that works on your three test lines is not done — messy data holds edge cases (empty fields, unicode, doubled delimiters); test on real samples and keep the skip-and-count habit. 4) Readability collapses fast: a 200-character pattern is write-only code — break it up, comment it, or use several simpler passes.",
        },
      ],
    },

    {
      id: "diagram",
      type: "interactive-diagram",
      tocLabel: "Visual Learning",
      visual: {
        kind: "architecture",
        title: "Anatomy of an extraction pattern",
        caption:
          "r'(\\w+)-(\\d{4})' pressed against 'SKU-4821' — each piece has a job. Click through.",
        nodes: [
          {
            id: "pattern",
            label: "r'(\\w+)-(\\d{4})'",
            sublabel: "the stencil",
            detail:
              "Raw string (r prefix — always), describing: word chars, a literal dash, exactly four digits. Two capture windows cut into it. Reads left to right like the text it matches.",
            x: 50,
            y: 12,
            accent: true,
          },
          {
            id: "class",
            label: "\\w  \\d",
            sublabel: "character classes",
            detail:
              "\\w = letter/digit/underscore, \\d = digit, \\s = whitespace, . = anything. Capitals negate (\\D non-digit). [aeiou] and [a-z0-9] build custom sets; [^...] negates a set.",
            x: 15,
            y: 45,
            accent: false,
          },
          {
            id: "quant",
            label: "+  {4}",
            sublabel: "quantifiers",
            detail:
              "Attach to the previous item: \\w+ = one or more word chars; \\d{4} = exactly four digits. Also * (zero+), ? (optional), {2,4} (range). Greedy by default — ? after makes them lazy.",
            x: 50,
            y: 45,
            accent: false,
          },
          {
            id: "groups",
            label: "( ) ( )",
            sublabel: "capture groups",
            detail:
              "The windows: findall returns their contents — one group → list of strings, several → list of tuples ('SKU', '4821'). (?P<code>...) names them; (?:...) groups WITHOUT capturing.",
            x: 85,
            y: 45,
            accent: false,
          },
          {
            id: "verbs",
            label: "search / findall / sub",
            sublabel: "the three verbs",
            detail:
              "search → first match or None (guard before .group()). findall → every match, extraction's workhorse. sub → rewrite matches (cleaning). fullmatch → anchored validation of a whole string.",
            x: 30,
            y: 80,
            accent: false,
          },
          {
            id: "result",
            label: "('SKU', '4821')",
            sublabel: "structured output",
            detail:
              "Text in, tuples out — rows for a dict, CSV, or DataFrame. Note: always STRINGS; int('4821') is your job. This is the moment unstructured text becomes data.",
            x: 70,
            y: 80,
            accent: false,
          },
        ],
        edges: [
          { from: "pattern", to: "class", label: "built from" },
          { from: "pattern", to: "quant" },
          { from: "pattern", to: "groups" },
          { from: "pattern", to: "verbs", label: "applied by" },
          { from: "verbs", to: "result", label: "yields" },
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
          title: "Find all the numbers",
          scenario: "Pull every number out of a sentence of mixed text.",
          steps: [
            {
              code: "import re\n\ntext = 'Ordered 3 units at 45 euros, 2 more at 30'\nnums = re.findall(r'\\d+', text)\nprint(nums)\nprint(sum(int(n) for n in nums))",
              explanation:
                "\\d+ = runs of digits. findall returns every match as STRINGS — the int() conversion is explicit, and sum() closes the loop. Two lines from prose to arithmetic.",
            },
          ],
          output: "['3', '45', '2', '30']\n80",
        },
        {
          difficulty: "Easy",
          title: "Clean a column of phone numbers",
          scenario:
            "Hand-entered phone numbers in every imaginable format need normalizing to bare digits.",
          steps: [
            {
              code: "import re\n\nphones = ['(030) 1234-567', '030 1234567', '030-12-34-567']\ncleaned = [re.sub(r'\\D', '', p) for p in phones]\nprint(cleaned)",
              explanation:
                "One elegant move: \\D matches every NON-digit, and sub deletes them all — parentheses, spaces, dashes, whatever tomorrow's format brings. Normalizing by removing what you DON'T want often beats describing every variant you do.",
            },
          ],
          output: "['0301234567', '0301234567', '0301234567']",
        },
        {
          difficulty: "Medium",
          title: "Extract fields from log lines",
          scenario:
            "Server logs mix timestamps, levels, and messages; the on-call report needs date + level pairs, structured.",
          steps: [
            {
              code: "import re\n\nlog = '''2026-07-16 09:12 ERROR db timeout\n2026-07-16 09:15 INFO retry ok\n2026-07-15 23:58 WARN disk 91%'''\n\npattern = r'(\\d{4}-\\d{2}-\\d{2}) \\d{2}:\\d{2} (ERROR|WARN|INFO)'\nrows = re.findall(pattern, log)\nprint(rows)",
              explanation:
                "Two capture groups (date, level); the time is matched but NOT captured — it locates the level without polluting the output. Alternation (ERROR|WARN|INFO) inside a group both matches and captures the literal level. findall with two groups → list of 2-tuples: instant rows.",
            },
            {
              code: "from collections import Counter  # or a .get() dict\nby_level = {}\nfor date, level in rows:\n    by_level[level] = by_level.get(level, 0) + 1\nprint(by_level)",
              explanation:
                "The tuples unpack straight into the dict-counting idiom from data-structures. Text file → structured tuples → aggregate: the full arc of log analysis in miniature.",
            },
          ],
          output:
            "[('2026-07-16', 'ERROR'), ('2026-07-16', 'INFO'), ('2026-07-15', 'WARN')]\n{'ERROR': 1, 'INFO': 1, 'WARN': 1}",
        },
        {
          difficulty: "Hard",
          title: "Prices in the wild: escapes and optional parts",
          scenario:
            "Product descriptions embed prices as '€45', '€ 45.50', 'EUR 12' — extract the numeric values, handling the optional decimal part and the two currency spellings.",
          steps: [
            {
              code: "import re\n\nitems = ['Lamp €45 great cond.', 'Desk € 45.50 pickup', 'Chair EUR 12', 'Free shelf!']\npattern = r'(?:€|EUR)\\s*(\\d+(?:\\.\\d{2})?)'\n\nfor item in items:\n    m = re.search(pattern, item)\n    if m:\n        print(float(m.group(1)))\n    else:\n        print('no price')",
              explanation:
                "Read it piecewise: (?:€|EUR) either currency marker, non-captured; \\s* optional whitespace; then the ONE capture: \\d+ digits with (?:\\.\\d{2})? an OPTIONAL non-captured decimal tail. search returns None for the shelf — the if m guard is mandatory, since None.group() raises AttributeError.",
            },
            {
              code: "text = 'Sale: $19.99 (was $25.00)'\nprint(re.findall(r'\\$(\\d+\\.\\d{2})', text))",
              explanation:
                "Dollar signs are regex ANCHORS ($ = end of string), so matching a literal one requires \\$. The forgotten escape is the classic price-extraction bug: r'$(\\d+)' silently matches nothing, and the pipeline reports zero revenue.",
            },
          ],
          output: "45.0\n45.5\n12.0\nno price\n['19.99', '25.00']",
        },
        {
          difficulty: "Industry Example",
          title: "Messy survey exports → clean rows",
          scenario:
            "A survey tool exports 'Name <email> - age' lines, hand-typed and inconsistent. Extract all three fields with named groups, skip-and-count the hopeless lines, and emit clean CSV rows — the full text-to-data pipeline.",
          steps: [
            {
              code: "import re\n\nlines = [\n    'Ada Lovelace <ada@math.org> - 36',\n    'grace hopper <grace@navy.mil>-45',\n    'no email here - 99',\n    'Alan Turing <alan@bletchley.uk> - 41',\n]\npat = re.compile(\n    r'(?P<name>[\\w ]+?)\\s*<(?P<email>[\\w.]+@[\\w.]+)>\\s*-\\s*(?P<age>\\d+)'\n)",
              explanation:
                "re.compile pre-parses the pattern once for the loop. Named groups self-document: name (lazy [\\w ]+? so it stops at the <), email (word chars and dots around @ — a pragmatic email shape, not a validator), age. \\s* tolerates the inconsistent spacing around < and -.",
            },
            {
              code: "rows, skipped = [], 0\nfor line in lines:\n    m = pat.search(line)\n    if m is None:\n        skipped += 1\n        continue\n    rows.append((m.group('name').strip().title(), m.group('email'), int(m.group('age'))))\n\nfor r in rows:\n    print(r)\nprint(f'skipped: {skipped}')",
              explanation:
                "The error-handling shape with regex: match-or-skip, counted. Post-processing finishes the job — .strip().title() normalizes 'grace hopper', int() types the age. Regex EXTRACTS; string methods and conversions CLEAN. They're a team, not rivals.",
            },
            {
              code: "print('name,email,age')\nfor name, email, age in rows:\n    print(f'{name},{email},{age}')",
              explanation:
                "Structured tuples render as CSV — ready for the files lesson's write patterns or pandas. In a DataFrame world this whole pipeline is df['col'].str.extract(pat) — same pattern, columnar application.",
            },
          ],
          output:
            "('Ada Lovelace', 'ada@math.org', 36)\n('Grace Hopper', 'grace@navy.mil', 45)\n('Alan Turing', 'alan@bletchley.uk', 41)\nskipped: 1\nname,email,age\nAda Lovelace,ada@math.org,36\nGrace Hopper,grace@navy.mil,45\nAlan Turing,alan@bletchley.uk,41",
        },
      ],
    },

    {
      id: "inline-practice",
      type: "inline-code",
      tocLabel: "Practice Coding",
      coding: {
        language: "python",
        filename: "inventory_parser.py",
        instructions:
          "Inventory lines look like 'WIDGET-042: 15 units @ €3.50' with inconsistent casing and spacing. Extract the product code (letters, dash, digits), the unit count, and the price into tuples using one pattern with three capture groups (case-insensitive for the code letters). Skip lines that don't match, counting them. Print each (CODE, units, price) with the code uppercased, units as int, price as float, then the skip count and total inventory value (units × price summed, 2 decimals).",
        starterCode: `import re

lines = [
    'WIDGET-042: 15 units @ €3.50',
    'gadget-007 : 3 units @ € 12.00',
    'corrupted line, no data',
    'SPROCKET-113: 40 units @ €0.75',
]

# TODO 1: pattern with 3 groups: code ([A-Za-z]+-\\d+), units (digits), price (digits.digits)
pat = re.compile(r'___')

rows, skipped = [], 0
for line in lines:
    # TODO 2: search; on None, count and skip; else append (CODE.upper(), int units, float price)
    ___

for r in rows:
    print(r)
# TODO 3: print skip count and total value
print(f'skipped: {___}')
print(f'total value: {___}')`,
        solutionCode: `import re

lines = [
    'WIDGET-042: 15 units @ €3.50',
    'gadget-007 : 3 units @ € 12.00',
    'corrupted line, no data',
    'SPROCKET-113: 40 units @ €0.75',
]

pat = re.compile(r'([A-Za-z]+-\\d+)\\s*:\\s*(\\d+) units @ €\\s*(\\d+\\.\\d{2})')

rows, skipped = [], 0
for line in lines:
    m = pat.search(line)
    if m is None:
        skipped += 1
        continue
    rows.append((m.group(1).upper(), int(m.group(2)), float(m.group(3))))

for r in rows:
    print(r)
print(f'skipped: {skipped}')
total = sum(units * price for _, units, price in rows)
print(f'total value: {total:.2f}')`,
        expectedOutput:
          "('WIDGET-042', 15, 3.5)\n('GADGET-007', 3, 12.0)\n('SPROCKET-113', 40, 0.75)\nskipped: 1\ntotal value: 118.50",
        hints: [
          "Code group: ([A-Za-z]+-\\d+) — letter run, literal dash, digit run",
          "\\s*:\\s* tolerates the stray spaces around the colon; €\\s* handles '€ 12.00'",
          "Guard with if m is None before touching .group()",
          "Total: sum(units * price for _, units, price in rows) — tuple unpacking in the genexp",
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
          id: "py35_mcq_01",
          difficulty: "Easy",
          question: "What does re.findall(r'\\d+', 'a12b345c') return?",
          options: [
            "['1', '2', '3', '4', '5']",
            "['12', '345']",
            "'12345'",
            "['a12', 'b345']",
          ],
          correctIndex: 1,
          explanation:
            "\\d+ is greedy per match: each RUN of consecutive digits is one match. Without the +, \\d alone would give the five single digits.",
        },
        {
          type: "mcq",
          id: "py35_mcq_02",
          difficulty: "Easy",
          question: "Why write patterns as raw strings — r'\\d+' not '\\d+'?",
          options: [
            "Raw strings run faster",
            "The r stops PYTHON from interpreting backslashes, so they reach the regex engine intact — '\\n' in a normal string is already a newline before regex ever sees it",
            "Regex requires it syntactically",
            "It enables unicode",
          ],
          correctIndex: 1,
          explanation:
            "Two escape layers exist: Python's and regex's. Raw strings switch Python's off. Some patterns survive without r by luck; r'...' always works, so it's the unconditional habit.",
        },
        {
          type: "mcq",
          id: "py35_mcq_03",
          difficulty: "Medium",
          question:
            "re.search(r'(\\w+)@(\\w+)', 'contact: ada@example') — what is .group(1) vs .group(0)?",
          options: [
            "group(1)='ada@example', group(0)='ada'",
            "group(1)='ada' (first capture), group(0)='ada@example' (the whole match)",
            "Both are 'ada'",
            "group(0) raises an error",
          ],
          correctIndex: 1,
          explanation:
            "group(0) is always the ENTIRE matched text; numbered groups count opening parentheses left to right: 1='ada', 2='example'.",
        },
        {
          type: "scenario",
          id: "py35_sc_01",
          difficulty: "Medium",
          scenario:
            "A pipeline extracts prices with re.findall(r'$(\\d+)', text). It runs clean on thousands of product rows and reports zero prices found. The rows visibly contain '$25' and '$100'.",
          question: "What's wrong?",
          options: [
            "findall can't return numbers",
            "$ is a regex anchor meaning end-of-string, so the pattern demands digits AFTER the string ends — impossible. Matching a literal dollar sign requires escaping: r'\\$(\\d+)'",
            "The text encoding is wrong",
            "(\\d+) should be \\d+",
          ],
          correctIndex: 1,
          explanation:
            "Unescaped metacharacters don't error — they MEAN something else, and the pattern silently matches nothing (or the wrong thing). Zero matches on data that visibly contains matches = suspect an unescaped special first.",
        },
        {
          type: "coding",
          id: "py35_code_01",
          difficulty: "Medium",
          prompt:
            "From text = 'IDs: A-101, B-22, C-3034 (legacy: 999)', extract every letter-dash-digits code with a pattern capturing letter and number separately, printing '<letter>: <number>' per match. Expected:\nA: 101\nB: 22\nC: 3034",
          starterCode:
            "import re\ntext = 'IDs: A-101, B-22, C-3034 (legacy: 999)'\n# Your code here\n",
          solutionCode:
            "import re\ntext = 'IDs: A-101, B-22, C-3034 (legacy: 999)'\nfor letter, number in re.findall(r'([A-Z])-(\\d+)', text):\n    print(f'{letter}: {number}')",
          expectedOutput: "A: 101\nB: 22\nC: 3034",
          tests: [
            {
              name: "Two capture groups",
              description: "Pattern captures the letter and digits separately; 999 (no letter-dash) is excluded",
            },
            {
              name: "Tuple iteration",
              description: "findall's tuples unpack directly in the for statement",
            },
          ],
        },
        {
          type: "mcq",
          id: "py35_mcq_04",
          difficulty: "Hard",
          question:
            "You need to pull the src values out of a page of nested HTML with mixed quoting and attributes in any order, robustly. Best tool?",
          options: [
            "One heroic regex covering all attribute orders",
            "str.split on every < character",
            "An HTML parser (html.parser, BeautifulSoup) — regex cannot reliably handle nested/irregular markup; patterns remain fine for simple, flat extractions FROM the parsed values",
            "Manual reading",
          ],
          correctIndex: 2,
          explanation:
            "Nested structure is formally beyond regular expressions, and real-world HTML's flexibility (quoting, order, whitespace, comments) breaks pattern after pattern. Parse the structure with a parser; regex the flat strings inside it.",
        },
        {
          type: "coding",
          id: "py35_code_02",
          difficulty: "Hard",
          prompt:
            "Normalize messy dates to ISO: dates = ['16/07/2026', '3/9/2026', '2026-01-05 already iso']. For DD/MM/YYYY or D/M/YYYY shapes, use re.sub with a pattern capturing day, month, year and a replacement reordering them zero-padded via a function (lambda m: f'{m.group(3)}-{int(m.group(2)):02d}-{int(m.group(1)):02d}'). Leave non-matching text unchanged. Expected:\n2026-07-16\n2026-09-03\n2026-01-05 already iso",
          starterCode:
            "import re\ndates = ['16/07/2026', '3/9/2026', '2026-01-05 already iso']\n# Your code here\n",
          solutionCode:
            "import re\ndates = ['16/07/2026', '3/9/2026', '2026-01-05 already iso']\npat = re.compile(r'(\\d{1,2})/(\\d{1,2})/(\\d{4})')\nfor d in dates:\n    fixed = pat.sub(lambda m: f'{m.group(3)}-{int(m.group(2)):02d}-{int(m.group(1)):02d}', d)\n    print(fixed)",
          expectedOutput: "2026-07-16\n2026-09-03\n2026-01-05 already iso",
          tests: [
            {
              name: "Function replacement",
              description: "sub uses a callable receiving the match to reorder and zero-pad groups",
            },
            {
              name: "Non-matches untouched",
              description: "The already-ISO line passes through unchanged",
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
            "When do you reach for regex versus string methods versus a parser? Give the decision rule and examples.",
          answer:
            "Three tiers by how much STRUCTURE varies. String methods when the structure is fixed and simple: splitting 'a,b,c' on commas, stripping whitespace, checking a literal prefix — split/strip/replace/startswith are clearer, faster, and can't misfire on metacharacters (though real CSV with quoted fields graduates to the csv module). Regex when the structure is a PATTERN with variation: 'some digits after SKU-', dates in two formats, prices with optional decimals, log lines with consistent shape but variable content — this is regex's home turf, extraction and cleaning of semi-structured text. A real parser when the structure NESTS or is a standard format: HTML/XML (BeautifulSoup — regex formally cannot balance nested tags), JSON (json module), CSV with quoting/escaping (csv module), code (ast). The rule of thumb I apply: start with string methods; graduate to regex when I catch myself chaining three splits and an if to express 'a pattern'; graduate to a parser when I catch my regex trying to understand nesting or re-implement a spec. And within regex use, keep patterns modest — two readable passes beat one 200-character write-only pattern, and every pattern gets tested against real messy samples, not just the happy path.",
        },
        {
          question:
            "Explain capture groups and how findall's return type changes with them — with the data-work implications.",
          answer:
            "Parentheses in a pattern do two jobs: they group (so a quantifier or alternation applies to several tokens) and they CAPTURE (the engine records what that region matched). Numbered by opening parenthesis left to right; m.group(1) reads the first from a match object, m.group(0) is the whole match; named versions (?P<price>\\d+) read as m.group('price') and document intent. findall's return type follows the group count — no groups: list of whole-match strings; exactly one group: list of THAT GROUP's strings (the whole match is discarded — surprising the first time, exactly what extraction wants after that); two or more: list of TUPLES, one element per group. The data-work implication: findall with several groups converts semi-structured text straight into rows — [('2026-07-16', 'ERROR'), ...] is ready to iterate with tuple unpacking, load into dicts, or feed pd.DataFrame. Two practical notes: when you need grouping WITHOUT capturing (alternation like (?:ERROR|WARN)), the ?: keeps the output tuples clean; and everything captured is a STRING — int()/float() conversion is a deliberate second step, per the type-conversion discipline.",
        },
        {
          question:
            "A teammate's regex works on their test cases but corrupts production data — matches that grab too much text. What's the likely cause and your review checklist?",
          answer:
            "The likely cause is GREEDY quantifiers meeting repeated delimiters: .* and .+ match the LONGEST possible stretch, so r'<(.*)>' against 'a <b> c <d>' captures 'b> c <d' — one giant match spanning from the first < to the LAST >, not two small ones. Test data with one delimiter pair per line hides this; production lines with two pairs expose it. Fixes in preference order: make the quantifier lazy (.*? takes the shortest match), or better, replace dot-star with a NEGATED CLASS stating what the content can't contain — r'<([^>]*)>' ('anything but >') is faster, clearer, and immune to the problem. My review checklist for any pattern heading to production: 1) every .* or .+ justified or replaced with a negated class; 2) literal specials escaped (\\$ \\. \\( — an unescaped dot 'works' until '3x14' matches the pi pattern); 3) anchored where validation is intended (fullmatch), unanchored where extraction is; 4) word boundaries (\\b) where substrings could false-positive ('cat' in 'concatenate'); 5) tested against adversarial real samples — empty fields, doubled delimiters, unicode; 6) matches that fail are counted and reported, not silently dropped. Greedy-match bugs are the regex equivalent of the axis bug in NumPy: no error, plausible output, wrong data.",
        },
      ],
    },

    {
      id: "common-mistakes",
      type: "callout",
      variant: "warning",
      title: "Common Mistakes to Avoid",
      content:
        "1) Forgetting the r prefix — some patterns break mysteriously without it; use it always. 2) Unescaped specials: $ . ( ) + ? match nothing or the wrong thing silently — escape literals. 3) .group() on a None search result — guard with if m first. 4) Greedy .* spanning multiple delimiters — use .*? or a negated class [^>]*. 5) Validation without anchors — 'abc123xyz' passes r'\\d+'; fullmatch or ^...$ for whole-string checks. 6) Expecting findall to return numbers — everything is strings until you convert. 7) Parsing nested HTML/JSON with regex — parsers exist; use them. 8) Shipping a pattern tested only on clean samples — messy data is the job.",
    },

    {
      id: "ai-tutor",
      type: "callout",
      variant: "tip",
      title: "Ask the AI Tutor",
      content:
        "Try these prompts in the AI Tutor panel: • 'Show me text and ask me to write the extraction pattern — escalate difficulty as I go.' • 'Explain greedy vs lazy with <tag> examples until I can predict both.' • 'Take my pattern and try to break it with adversarial inputs.' • 'When would .str.extract in pandas replace this loop? Show the translation.' • 'Interview mode: ask me the regex-vs-parser decision question and grade my answer.'",
    },

    {
      id: "glossary",
      type: "callout",
      variant: "info",
      title: "Glossary",
      content:
        "regex — a pattern language for text shapes. r'...' — raw string; backslashes pass through to the engine. \\d \\w \\s — digit / word char / whitespace classes (capitals negate). [abc] [a-z] [^x] — custom sets, ranges, negation. + * ? {n} {m,n} — quantifiers (one+, zero+, optional, counts). greedy/lazy — longest vs shortest match (? suffix = lazy). ^ $ \\b — start, end, word-boundary anchors. (…) — capture group; (?:…) non-capturing; (?P<name>…) named. re.search — first match or None. re.findall — all matches (tuples when 2+ groups). re.sub — replace matches (accepts a function). re.fullmatch — anchored whole-string validation. re.compile — pre-parse a reused pattern.",
    },

    {
      id: "resources",
      type: "callout",
      variant: "info",
      title: "Recommended Resources",
      content:
        "• Docs: the re module's HOWTO ('Regular Expression HOWTO') — the gentlest official on-ramp. • Tool: regex101.com — paste pattern + sample text, watch matches and groups live with explanations; the fastest way to debug any pattern. • Practice: extract every number, date, and capitalized name from a news article's text — three patterns, one afternoon. • Next in DSM: every tool is on the belt — the module capstone, Project: Build a Data Pipeline, chains files, parsing, error handling, dates, and regex into one end-to-end program.",
    },

    {
      id: "recap",
      type: "recap",
      tocLabel: "Recap",
      content:
        "✓ Patterns describe SHAPE: \\d \\w \\s classes, [sets], + * ? {n} quantifiers — always in r'raw strings'.\n✓ Three verbs: search (first match or None — guard it), findall (extract all), sub (rewrite; takes functions).\n✓ Capture groups turn matches into fields; 2+ groups make findall return row-ready tuples — all strings until you convert.\n✓ Escape literal specials (\\$ \\.) — unescaped ones fail silently; prefer negated classes over greedy .*.\n✓ Validation anchors (fullmatch, ^ $); extraction doesn't.\n✓ String methods for fixed structure, regex for patterns, real parsers for nesting — and test on messy samples.\n\nNext up: Project — Build a Data Pipeline in Python. The capstone: read raw files, clean with regex and conversions, handle errors with skip-and-count, date-stamp outputs with pathlib — every module, one program.",
    },
  ],
};
