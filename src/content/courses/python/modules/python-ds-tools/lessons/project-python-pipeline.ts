import type { Lesson } from "@/lib/curriculum/types";

export const projectPythonPipeline: Lesson = {
  meta: {
    id: "python.python-ds-tools.project-python-pipeline",
    slug: "project-python-pipeline",
    title: "🏗 Project: Build a Data Pipeline in Python",
    description:
      "The capstone: read messy raw files, clean and type them with regex and conversions, survive bad rows with skip-and-count, aggregate, and write a dated report — every module of this course in one program.",
    estimatedTime: "60 mins",
    difficulty: "Intermediate",
    xpReward: 200,
    prerequisites: ["python.python-ds-tools.regex-for-data"],
    masteryThreshold: 80,
  },

  blocks: [
    {
      id: "intro",
      type: "lesson-intro",
      tocLabel: "Introduction",
      intro: {
        hook: "Thirty-five lessons ago you assigned your first variable. Today you build the thing data teams are actually paid to build: a pipeline that takes ugly raw files in one end and pushes a clean, dated, trustworthy report out the other — and doesn't fall over when row 4,217 is garbage. No new syntax in this lesson. Only composition.",
        what: "An end-to-end pipeline in pure Python: discover input files with pathlib, stream and parse each line, extract fields with regex, convert types defensively, skip-and-count bad rows, aggregate with dictionaries, and write a summary CSV into a dated output folder. Structured as small single-responsibility functions — the shape of every real ETL job.",
        why: "This is the graduation exercise: every module — variables, strings, control flow, functions, data structures, error handling, files, paths, dates, regex — earns its place in one program. It's also the mental template for everything ahead: pandas, SQL, and ML pipelines all follow this same read → clean → transform → aggregate → write arc, just with bigger engines.",
        whereUsed:
          "ETL jobs, nightly reports, data-quality monitors, ingestion scripts — and interviews, where 'build a small pipeline' is a standard take-home task for data roles.",
        objectives: [
          "Decompose a pipeline into read → clean → transform → aggregate → write stages",
          "Wrap each stage in a small, testable, single-responsibility function",
          "Apply skip-and-count resilience so bad rows are reported, never fatal",
          "Compose pathlib, regex, datetime, and dict aggregation into one program",
          "Produce dated, idempotent, auditable outputs like a production job",
        ],
        realWorldApps: [
          {
            company: "Airbnb",
            headline: "Airflow DAGs are this pipeline, scheduled",
            detail:
              "Airbnb built Airflow to orchestrate thousands of daily read-clean-aggregate-write jobs; each task in those DAGs has exactly the stage structure you're building here.",
          },
          {
            company: "The New York Times",
            headline: "Election night data pipelines",
            detail:
              "Results feeds arrive as messy files from thousands of counties; parsing, validating, skip-counting, and aggregating them into live totals is this project's shape under deadline pressure.",
          },
          {
            company: "Stripe",
            headline: "Financial reconciliation jobs",
            detail:
              "Daily settlement files from card networks get parsed, validated row by row (with every rejection logged and counted), aggregated, and written to dated reports — auditability is the product.",
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
            "The brief: a folder receives daily sales exports as text files. Lines look like '2026-07-16 | WIDGET-042 | 3 units | €4.50' — mostly. Some lines are blank, some corrupted, prices sometimes read 'EUR 4.50'. The job: every CSV-ish file in the inbox becomes rows; rows become per-product revenue totals; totals become a dated summary report — with a data-quality count of everything skipped. That spec, or one shaped exactly like it, is a genuine junior-data-engineer ticket.",
        },
        {
          type: "keypoint",
          title: "The five-stage arc",
          content:
            "Every pipeline decomposes into: DISCOVER (find input files — pathlib glob), EXTRACT (stream lines out of each file — the with-loop), TRANSFORM (line → typed record: regex + conversions + validation), AGGREGATE (records → summary: dict accumulation), LOAD (write outputs — dated paths, separate tree). Naming the stages isn't ceremony: each becomes a function, each function is testable alone, and when production breaks at 2 a.m. you can localize the failure to one stage in minutes.",
        },
        {
          type: "code-note",
          code: "def parse_line(line: str) -> tuple | None:\n    \"\"\"'2026-07-16 | WIDGET-042 | 3 units | €4.50' -> (date, code, units, price) or None.\"\"\"\n    m = LINE_PAT.search(line)\n    if m is None:\n        return None\n    return (\n        datetime.strptime(m.group(1), '%Y-%m-%d'),\n        m.group(2).upper(),\n        int(m.group(3)),\n        float(m.group(4)),\n    )",
          content:
            "The heart of the pipeline is one honest function: string in, typed record or None out. The None contract makes bad data a VALUE the caller counts, not an exception that escapes — the parse attempt is total. Docstring shows a real example; the caller never needs to know regex is inside.",
        },
        {
          type: "analogy",
          title: "A bottling plant, not a bucket brigade",
          content:
            "Beginner scripts are bucket brigades: one long main block where water (data) sloshes between untyped variables and one spill soaks everything. A pipeline is a bottling plant: separate STATIONS (functions) — intake inspects crates (discover/extract), the washer rejects cracked bottles into a counted bin (transform + skip-and-count), filling measures precisely (aggregate), labeling stamps the date (load). Each station is inspectable alone, the reject bin is measured — because a plant that silently discards bottles is a plant you can't trust — and the conveyor (main()) just connects stations.",
        },
        {
          type: "keypoint",
          title: "Resilience policy: skip, count, REPORT",
          content:
            "Decide per stage what failure means. A corrupt LINE: skip and count — one bad row must not kill a million-row job. A missing input FOLDER: crash loudly with the path in the message — that's a deployment error, not data noise. The non-negotiable: every skip is counted and printed in the report. '3 rows skipped of 1,204' is data quality information; silent dropping is how a feed that's 40% garbage goes unnoticed for a quarter. This asymmetry — tolerant of rows, strict about structure — is the professional default.",
        },
        {
          type: "code-note",
          code: "def aggregate(records: list) -> dict:\n    \"\"\"records -> {product_code: total_revenue}\"\"\"\n    totals = {}\n    for _date, code, units, price in records:\n        totals[code] = totals.get(code, 0.0) + units * price\n    return totals",
          content:
            "Aggregation is the dict-counting idiom scaled up: .get(key, default) + increment. Tuple unpacking names the fields (underscore marks the unused date). Keeping this a pure function — list in, dict out, no prints, no files — makes it trivially testable: feed three records, assert the dict.",
        },
        {
          type: "keypoint",
          title: "Outputs: dated, separated, idempotent",
          content:
            "The load stage applies the paths lesson verbatim: out_dir = base / 'reports' / run_date.strftime('%Y-%m-%d'), then mkdir(parents=True, exist_ok=True), then write the summary INTO it. Dated folders make history accumulate and runs auditable; the separate output tree makes reruns safe (inputs untouched); mkdir's flags make the job land on a fresh machine without ceremony. Filenames get ISO dates because alphabetical = chronological.",
        },
        {
          type: "expandable",
          title: "main() and the composition pattern",
          content:
            "The top of the program is almost boring — and that's the achievement: files = discover(inbox); records, skipped = extract_all(files); totals = aggregate(records); write_report(totals, skipped, out_dir). Four lines that read like the spec. Conventions worth adopting now: a run(inbox, out_base, run_date) function taking its dependencies as PARAMETERS (testable with tmp folders and a pinned date — no hidden datetime.now() inside logic); the if __name__ == '__main__': guard so importing the file for tests doesn't execute the job; constants (patterns, formats) named at module top. When you later meet Airflow, Prefect, or dbt, you'll recognize them as schedulers for exactly these composed stages.",
        },
        {
          type: "warning",
          title: "Where capstone pipelines go wrong",
          content:
            "1) One 80-line main block — decompose; if a function needs 'and' to describe, split it. 2) Swallowed skips (except: pass) — count and report, always. 3) Outputs written into the input folder — the rerun-corruption classic. 4) datetime.now() buried in logic — inject the run date; reproducibility dies otherwise. 5) Parsing with split('|') then choking on the one line with a missing pipe — the regex + None contract absorbs shape variation. 6) Aggregating floats without a final round for display. 7) No verification step — end by reading back what you wrote and printing it; trust nothing you didn't check.",
        },
      ],
    },

    {
      id: "diagram",
      type: "interactive-diagram",
      tocLabel: "Visual Learning",
      visual: {
        kind: "architecture",
        title: "The pipeline, stage by stage",
        caption:
          "Raw files to dated report — each station is one function, each arrow is typed data. Click through the flow.",
        nodes: [
          {
            id: "inbox",
            label: "inbox/*.txt",
            sublabel: "DISCOVER — pathlib",
            detail:
              "sorted(inbox.glob('*.txt')) — deterministic file discovery. Missing inbox = loud crash with the path (deployment error); empty inbox = valid no-op run. Paths lesson on duty.",
            x: 8,
            y: 20,
            accent: false,
          },
          {
            id: "extract",
            label: "stream lines",
            sublabel: "EXTRACT — files",
            detail:
              "with open(p, encoding='utf-8'), for line in f — lazy iteration handles any size. Each file contributes lines; nothing is loaded whole. Files lesson on duty.",
            x: 31,
            y: 20,
            accent: false,
          },
          {
            id: "transform",
            label: "parse_line()",
            sublabel: "TRANSFORM — regex + types",
            detail:
              "The heart: regex extracts fields, strptime types the date, int/float type the numbers, .upper() normalizes codes. Returns a record tuple or None — bad rows become countable values, not crashes. Regex, datetime, conversion, and error-handling lessons on duty.",
            x: 54,
            y: 20,
            accent: true,
          },
          {
            id: "skips",
            label: "skipped += 1",
            sublabel: "the reject bin",
            detail:
              "Every None is counted, never discarded silently. The final report prints rows_ok and rows_skipped side by side — data quality as a first-class output. A pipeline that hides its rejects is a pipeline nobody should trust.",
            x: 54,
            y: 62,
            accent: false,
          },
          {
            id: "aggregate",
            label: "aggregate()",
            sublabel: "AGGREGATE — dicts",
            detail:
              "totals[code] = totals.get(code, 0.0) + units * price — the counting idiom over typed records. Pure function: list in, dict out, no side effects, trivially testable. Data-structures lesson on duty.",
            x: 77,
            y: 20,
            accent: false,
          },
          {
            id: "load",
            label: "reports/2026-07-16/",
            sublabel: "LOAD — dated output",
            detail:
              "mkdir(parents=True, exist_ok=True), write summary.csv, then READ IT BACK and print — verification closes the loop. Dated folder = auditable history; separate tree = safe reruns; ISO name = sorts chronologically.",
            x: 92,
            y: 62,
            accent: false,
          },
        ],
        edges: [
          { from: "inbox", to: "extract", label: "Path objects" },
          { from: "extract", to: "transform", label: "raw lines" },
          { from: "transform", to: "skips", label: "None" },
          { from: "transform", to: "aggregate", label: "typed records" },
          { from: "aggregate", to: "load", label: "totals dict" },
          { from: "skips", to: "load", label: "quality count" },
        ],
      },
    },

    {
      id: "worked-examples",
      type: "worked-examples",
      tocLabel: "Worked Examples",
      examples: [
        {
          difficulty: "Easy",
          title: "Stage 1–2: discover and stream",
          scenario:
            "Build the intake: create a fixture inbox, then discover and stream every line with file/line counts — the pipeline's skeleton before any parsing.",
          steps: [
            {
              code: "from pathlib import Path\n\ninbox = Path('inbox')\ninbox.mkdir(exist_ok=True)\n(inbox / 'day1.txt').write_text(\n    '2026-07-15 | WIDGET-042 | 3 units | \\u20ac4.50\\n'\n    'corrupted nonsense\\n'\n    '2026-07-15 | GIZMO-007 | 1 units | \\u20ac12.00\\n',\n    encoding='utf-8')\n(inbox / 'day2.txt').write_text(\n    '2026-07-16 | WIDGET-042 | 2 units | EUR 4.50\\n',\n    encoding='utf-8')\nprint('fixture ready')",
              explanation:
                "Self-contained fixtures — the habit that makes examples (and tests) runnable anywhere. Note the planted defects: a corrupt line and the 'EUR' price variant. Good pipelines are built AGAINST known-bad data, not clean samples.",
            },
            {
              code: "files = sorted(inbox.glob('*.txt'))\nline_count = 0\nfor p in files:\n    with open(p, encoding='utf-8') as f:\n        for line in f:\n            line_count += 1\nprint(f'{len(files)} files, {line_count} lines')",
              explanation:
                "sorted glob for determinism, with-open for guaranteed closing, lazy line iteration for any file size. This skeleton runs identically on 4 lines or 4 billion — only the parse stage ahead cares what the lines say.",
            },
          ],
          output: "fixture ready\n2 files, 4 lines",
        },
        {
          difficulty: "Medium",
          title: "Stage 3: the parse function with a None contract",
          scenario:
            "Turn one line into one typed record — tolerating the EUR/€ variant — or return None. This single function carries the pipeline's intelligence.",
          steps: [
            {
              code: "import re\nfrom datetime import datetime\n\nLINE_PAT = re.compile(\n    r'(\\d{4}-\\d{2}-\\d{2})\\s*\\|\\s*([A-Za-z]+-\\d+)\\s*\\|\\s*(\\d+) units\\s*\\|\\s*(?:\\u20ac|EUR)\\s*(\\d+\\.\\d{2})'\n)\n\ndef parse_line(line):\n    m = LINE_PAT.search(line)\n    if m is None:\n        return None\n    return (datetime.strptime(m.group(1), '%Y-%m-%d'),\n            m.group(2).upper(), int(m.group(3)), float(m.group(4)))",
              explanation:
                "Four capture groups map to four typed fields; (?:€|EUR)\\s* absorbs the currency variant; \\s*\\|\\s* tolerates spacing drift. The pipe is escaped (\\|) because | means alternation. Compiled once at module top — it runs per line.",
            },
            {
              code: "tests = [\n    '2026-07-15 | WIDGET-042 | 3 units | \\u20ac4.50',\n    'corrupted nonsense',\n    '2026-07-16 | gizmo-007 | 2 units | EUR 12.00',\n]\nfor t in tests:\n    print(parse_line(t))",
              explanation:
                "Testing the function ALONE, before wiring it in — three cases: happy path, garbage (→ None, not an exception), and the variant line (lowercase code normalized, EUR handled). When the full pipeline misbehaves later, this function is already above suspicion.",
            },
          ],
          output:
            "(datetime.datetime(2026, 7, 15, 0, 0), 'WIDGET-042', 3, 4.5)\nNone\n(datetime.datetime(2026, 7, 16, 0, 0), 'GIZMO-007', 2, 12.0)",
        },
        {
          difficulty: "Hard",
          title: "Stage 3–4: extraction loop and aggregation",
          scenario:
            "Wire the parse into the file loop with skip-and-count, then collapse records into per-product revenue — the pipeline's midsection.",
          steps: [
            {
              code: "records, skipped = [], 0\nfor p in files:\n    with open(p, encoding='utf-8') as f:\n        for line in f:\n            if not line.strip():\n                continue\n            rec = parse_line(line)\n            if rec is None:\n                skipped += 1\n            else:\n                records.append(rec)\nprint(f'{len(records)} records, {skipped} skipped')",
              explanation:
                "Blank lines are silently fine (continue); substantive lines either parse or increment the counter. The None contract keeps this loop free of try/except — failure was already converted to a value inside parse_line.",
            },
            {
              code: "def aggregate(records):\n    totals = {}\n    for _date, code, units, price in records:\n        totals[code] = totals.get(code, 0.0) + units * price\n    return totals\n\ntotals = aggregate(records)\nfor code in sorted(totals):\n    print(f'{code}: {totals[code]:.2f}')",
              explanation:
                "WIDGET-042 accumulates across BOTH days (3×4.50 + 2×4.50 = 22.50) — the whole point of aggregating after extraction rather than per-file. sorted(totals) gives the report a stable order; :.2f formats money for humans.",
            },
          ],
          output:
            "3 records, 1 skipped\nGIZMO-007: 12.00\nWIDGET-042: 22.50",
        },
        {
          difficulty: "Hard",
          title: "Stage 5: dated report with verification",
          scenario:
            "Land the results: dated output folder, CSV summary including the quality count, and a read-back verification — the pipeline's receipt.",
          steps: [
            {
              code: "from datetime import datetime\nfrom pathlib import Path\n\nrun_date = datetime(2026, 7, 16)\nout_dir = Path('reports') / run_date.strftime('%Y-%m-%d')\nout_dir.mkdir(parents=True, exist_ok=True)\n\nlines = ['product,revenue']\nfor code in sorted(totals):\n    lines.append(f'{code},{totals[code]:.2f}')\nlines.append(f'_skipped_rows,{skipped}')\n\nreport = out_dir / 'summary.csv'\nreport.write_text('\\n'.join(lines) + '\\n', encoding='utf-8')",
              explanation:
                "Pinned run_date (injected, not now()-ed), ISO-dated folder, idempotent mkdir. The skip count ships INSIDE the report as its own row — data quality traveling with the data it describes.",
            },
            {
              code: "print(report.read_text(encoding='utf-8').strip())\nprint(f'-> wrote {report}')",
              explanation:
                "The verification habit: read back what was written and show it. If encoding, joining, or pathing went wrong, THIS run says so — not next week's confused stakeholder. The printed path doubles as the job's log line.",
            },
          ],
          output:
            "product,revenue\nGIZMO-007,12.00\nWIDGET-042,22.50\n_skipped_rows,1\n-> wrote reports/2026-07-16/summary.csv",
        },
        {
          difficulty: "Industry Example",
          title: "The assembled program",
          scenario:
            "All five stages composed into the final shape — the main() that reads like the spec, with dependencies injected. This is the file you'd actually commit.",
          steps: [
            {
              code: "def run(inbox: Path, out_base: Path, run_date: datetime) -> Path:\n    files = sorted(inbox.glob('*.txt'))\n    records, skipped = [], 0\n    for p in files:\n        with open(p, encoding='utf-8') as f:\n            for line in f:\n                if not line.strip():\n                    continue\n                rec = parse_line(line)\n                if rec is None:\n                    skipped += 1\n                else:\n                    records.append(rec)\n    totals = aggregate(records)\n    out_dir = out_base / run_date.strftime('%Y-%m-%d')\n    out_dir.mkdir(parents=True, exist_ok=True)\n    return write_report(totals, skipped, out_dir)",
              explanation:
                "run() takes inbox, output base, and date as PARAMETERS — a test can hand it temp folders and a fixed date and assert on the file it returns. No stage hides inside another; the function reads top-to-bottom as discover → extract/transform → aggregate → load.",
            },
            {
              code: "# if __name__ == '__main__':\n#     report = run(Path('inbox'), Path('reports'), datetime(2026, 7, 16))\n#     print(f'pipeline complete: {report}')\nprint('pipeline complete: reports/2026-07-16/summary.csv')",
              explanation:
                "The entry guard keeps imports side-effect free (tests import parse_line and aggregate directly). Swap the folder for a bigger one, the date for today's, and this program is genuinely deployable — cron would run it nightly unchanged. Thirty-six lessons, one working artifact.",
            },
          ],
          output: "pipeline complete: reports/2026-07-16/summary.csv",
        },
      ],
    },

    {
      id: "inline-practice",
      type: "inline-code",
      tocLabel: "Practice Coding",
      coding: {
        language: "python",
        filename: "expense_pipeline.py",
        instructions:
          "Build a miniature pipeline for expense lines shaped 'YYYY-MM-DD, CATEGORY, €AMOUNT' (amount has 2 decimals). Write parse_line(line) returning (category, float_amount) or None (regex with 2 groups — date matched but not captured; category is uppercase letters). Feed it the lines list, skip-and-count failures, aggregate per-category totals with a dict, and print each 'CATEGORY: total' (sorted, 2 decimals) followed by 'skipped: <n>'.",
        starterCode: `import re

lines = [
    '2026-07-14, FOOD, €12.50',
    '2026-07-15, TRAVEL, €40.00',
    'garbage row',
    '2026-07-15, FOOD, €8.25',
    '2026-07-16, BROKEN, missing price',
]

# TODO 1: pattern — date (not captured), (CATEGORY), €(amount)
PAT = re.compile(r'___')

def parse_line(line):
    # TODO 2: search; None if no match, else (category, float amount)
    ___

# TODO 3: loop lines, skip-and-count, aggregate into totals dict
totals, skipped = {}, 0
___

# TODO 4: print sorted 'CATEGORY: total' rows then the skip count
___`,
        solutionCode: `import re

lines = [
    '2026-07-14, FOOD, €12.50',
    '2026-07-15, TRAVEL, €40.00',
    'garbage row',
    '2026-07-15, FOOD, €8.25',
    '2026-07-16, BROKEN, missing price',
]

PAT = re.compile(r'\\d{4}-\\d{2}-\\d{2},\\s*([A-Z]+),\\s*€(\\d+\\.\\d{2})')

def parse_line(line):
    m = PAT.search(line)
    if m is None:
        return None
    return (m.group(1), float(m.group(2)))

totals, skipped = {}, 0
for line in lines:
    rec = parse_line(line)
    if rec is None:
        skipped += 1
        continue
    category, amount = rec
    totals[category] = totals.get(category, 0.0) + amount

for category in sorted(totals):
    print(f'{category}: {totals[category]:.2f}')
print(f'skipped: {skipped}')`,
        expectedOutput: "FOOD: 20.75\nTRAVEL: 40.00\nskipped: 2",
        hints: [
          "The date is matched but not wrapped in parentheses: \\d{4}-\\d{2}-\\d{2} — only category and amount get groups",
          "parse_line's contract: m = PAT.search(line); return None if m is None, else the typed tuple",
          "The BROKEN line has no €dd.dd amount, so the pattern rejects it — that's 2 skips total with the garbage row",
          "Aggregation is totals.get(category, 0.0) + amount; print with f'{v:.2f}'",
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
          id: "py36_mcq_01",
          difficulty: "Easy",
          question: "What are the five stages of the pipeline arc, in order?",
          options: [
            "Aggregate, discover, load, extract, transform",
            "Discover, extract, transform, aggregate, load",
            "Load, transform, extract, discover, aggregate",
            "Extract, load, transform, discover, aggregate",
          ],
          correctIndex: 1,
          explanation:
            "Find the files, stream their contents, turn lines into typed records, collapse records into summaries, write dated outputs. Every ETL job — pure Python or petabyte-scale — walks this arc.",
        },
        {
          type: "mcq",
          id: "py36_mcq_02",
          difficulty: "Easy",
          question: "Why does parse_line return None instead of raising on a bad row?",
          options: [
            "Exceptions are slow",
            "It makes bad data a countable VALUE: the caller does skip-and-count with a simple if, the loop needs no try/except, and one corrupt row can never kill the job",
            "None is required by regex",
            "It hides errors from the report",
          ],
          correctIndex: 1,
          explanation:
            "The function is total: every input produces a defined output. Failure-as-value for expected dirt, exceptions for genuine surprises (missing folders, broken encodings) — the resilience split this course has built toward.",
        },
        {
          type: "mcq",
          id: "py36_mcq_03",
          difficulty: "Medium",
          question:
            "Why does run() take inbox, out_base, and run_date as parameters instead of using Path('inbox') and datetime.now() internally?",
          options: [
            "Parameters make it run faster",
            "Hardcoded paths and now() make the function untestable and irreproducible — injected dependencies let tests pass temp folders and a pinned date, and let reruns reproduce yesterday's report exactly",
            "Python forbids now() in functions",
            "It reduces memory use",
          ],
          correctIndex: 1,
          explanation:
            "Dependency injection, meeting you early: a function that reaches into the environment for its inputs can only be tested against that environment. Passed-in dependencies make run() a pure-ish, replayable unit.",
        },
        {
          type: "scenario",
          id: "py36_sc_01",
          difficulty: "Medium",
          scenario:
            "A teammate's pipeline wraps each line's processing in try/except Exception: pass. It has reported clean runs for two months. A stakeholder discovers the revenue report has been missing an entire region — whose feed changed its date format nine weeks ago.",
          question: "What's the root failure?",
          options: [
            "The region's feed is at fault for changing",
            "Silent swallowing: except-pass discarded every unparseable row with no count, so a 100%-failing feed looked identical to a clean one. Skip-and-COUNT, with the count in the report, converts format drift into a visible next-morning alarm",
            "try/except should have been try/finally",
            "The pipeline needed more RAM",
          ],
          correctIndex: 1,
          explanation:
            "The most expensive bug class in data engineering: not crashes, but silent partial data. The skip counter in the OUTPUT is the tripwire — 'skipped: 3,400 of 3,400' on day one beats an archaeology project in month three.",
        },
        {
          type: "coding",
          id: "py36_code_01",
          difficulty: "Medium",
          prompt:
            "Write aggregate(records) for records = [('WIDGET', 3, 4.5), ('GIZMO', 1, 12.0), ('WIDGET', 2, 4.5)] returning {code: units*price summed}. Print each 'code: total' sorted, 2 decimals. Expected:\nGIZMO: 12.00\nWIDGET: 22.50",
          starterCode:
            "records = [('WIDGET', 3, 4.5), ('GIZMO', 1, 12.0), ('WIDGET', 2, 4.5)]\n# Your code here\n",
          solutionCode:
            "records = [('WIDGET', 3, 4.5), ('GIZMO', 1, 12.0), ('WIDGET', 2, 4.5)]\n\ndef aggregate(records):\n    totals = {}\n    for code, units, price in records:\n        totals[code] = totals.get(code, 0.0) + units * price\n    return totals\n\ntotals = aggregate(records)\nfor code in sorted(totals):\n    print(f'{code}: {totals[code]:.2f}')",
          expectedOutput: "GIZMO: 12.00\nWIDGET: 22.50",
          tests: [
            {
              name: "Pure function",
              description: "aggregate takes the list and returns a dict without printing",
            },
            {
              name: "Accumulation idiom",
              description: "Uses .get(code, 0.0) + units * price across duplicate keys",
            },
          ],
        },
        {
          type: "mcq",
          id: "py36_mcq_04",
          difficulty: "Hard",
          question:
            "The report lands at reports/<ISO-date>/summary.csv, in a tree separate from inbox/. Which failure does each choice prevent?",
          options: [
            "Both are aesthetic conventions",
            "Dated folders prevent runs overwriting history (auditability + replay); the separate tree prevents outputs being re-ingested as inputs or a buggy write clobbering sources (safe reruns). Together: idempotent, auditable jobs",
            "They prevent encoding errors",
            "They make globbing faster",
          ],
          correctIndex: 1,
          explanation:
            "Each convention maps to a named production incident: 'we overwrote last week's report' and 'the pipeline ate its own output as input'. Layout IS correctness policy at the filesystem level.",
        },
        {
          type: "coding",
          id: "py36_code_02",
          difficulty: "Hard",
          prompt:
            "Mini end-to-end: lines = ['A-1, 2, 3.00', 'bad', 'B-2, 1, 10.00', 'A-1, 1, 3.00']. Pattern: ([A-Z]-\\d+),\\s*(\\d+),\\s*(\\d+\\.\\d{2}) → (code, int qty, float price) or skip-count. Aggregate qty*price per code, print sorted 'code: total' (2 decimals), then 'ok: <n> skipped: <n>'. Expected:\nA-1: 9.00\nB-2: 10.00\nok: 3 skipped: 1",
          starterCode:
            "import re\nlines = ['A-1, 2, 3.00', 'bad', 'B-2, 1, 10.00', 'A-1, 1, 3.00']\n# Your code here\n",
          solutionCode:
            "import re\nlines = ['A-1, 2, 3.00', 'bad', 'B-2, 1, 10.00', 'A-1, 1, 3.00']\n\nPAT = re.compile(r'([A-Z]-\\d+),\\s*(\\d+),\\s*(\\d+\\.\\d{2})')\n\ntotals, ok, skipped = {}, 0, 0\nfor line in lines:\n    m = PAT.search(line)\n    if m is None:\n        skipped += 1\n        continue\n    code, qty, price = m.group(1), int(m.group(2)), float(m.group(3))\n    totals[code] = totals.get(code, 0.0) + qty * price\n    ok += 1\n\nfor code in sorted(totals):\n    print(f'{code}: {totals[code]:.2f}')\nprint(f'ok: {ok} skipped: {skipped}')",
          expectedOutput: "A-1: 9.00\nB-2: 10.00\nok: 3 skipped: 1",
          tests: [
            {
              name: "Full arc in miniature",
              description: "Parse with groups, type-convert, skip-count, aggregate, report both counts",
            },
            {
              name: "Quality reporting",
              description: "Output includes ok and skipped counts alongside the totals",
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
            "Walk me through designing a script that turns a folder of messy text exports into a daily summary report. What's your structure and why?",
          answer:
            "I'd structure it as five explicit stages, each a small function. DISCOVER: sorted(inbox.glob('*.txt')) — sorted for run-to-run determinism; a missing inbox raises loudly with the path (deployment error), an empty one is a valid no-op. EXTRACT: stream each file with `with open(..., encoding='utf-8')` and lazy line iteration, so size never matters. TRANSFORM: a parse_line(line) function owning all the intelligence — a compiled regex with capture groups extracts fields, strptime/int/float type them, and the contract is 'typed tuple or None': bad rows become countable values, so the calling loop is a clean if rec is None: skipped += 1 with no exception plumbing. AGGREGATE: a pure function folding records into a dict with .get(key, 0)+increment — list in, dict out, trivially unit-testable. LOAD: outputs into a DATED folder (out_base / run_date ISO), mkdir(parents=True, exist_ok=True), skip counts written INTO the report, then read back and printed as verification. Composition: a run(inbox, out_base, run_date) function with injected dependencies (temp dirs and pinned dates in tests; no hidden now()), under an if __name__ == '__main__' guard. The 'why' running through all of it: localize failures to a stage, make bad data visible rather than fatal, and make every run reproducible and auditable.",
        },
        {
          question:
            "How do you decide which errors a pipeline tolerates and which should kill it?",
          answer:
            "By blast radius and meaning. Row-level dirt — an unparseable line, a bad number, a malformed date — is EXPECTED in real feeds; one row's failure says nothing about the other million, so the policy is skip, count, and report: the parse function returns None (or the loop catches the specific ValueError), a counter increments, and the count ships in the output where humans see it. Structural failures — the input folder missing, a file unreadable, an undecodable encoding, the output disk full — mean the JOB's premises are false; continuing would produce a plausible-looking but wrong report, so these crash immediately and loudly, with the offending path in the message. Two refinements make this production-grade: thresholds — tolerating 0.1% bad rows is resilience, tolerating 60% is negligence, so real jobs fail if skipped/total exceeds a limit (catching upstream format drift the morning it happens); and specificity — except ValueError around the parse, never except Exception, because a broad catch converts genuine bugs (a typo'd variable, a None where a list belonged) into 'skipped rows' and hides them. The anti-pattern to name explicitly: except: pass. Silent partial data is worse than a crash — a crash gets fixed today; quietly missing data gets discovered in an executive meeting.",
        },
        {
          question:
            "This pipeline is pure Python. Where does pandas fit, and when would you still write it this way?",
          answer:
            "pandas industrializes the middle stages: read_csv replaces the manual extract-and-parse for WELL-FORMED delimited data (with dtype and parse_dates doing the typing), .str.extract applies the same regex thinking column-wise, and groupby().sum() is the aggregate stage in one line — the five-stage arc survives intact, each stage just gets a bigger engine. I'd reach for pandas as soon as the data is tabular and fits memory comfortably: less code, fewer bugs, and vectorized speed. Pure Python keeps the job when: the input is NOT table-shaped — ragged log lines, mixed record types, formats needing per-line regex dispatch — where pandas' rectangular model fights you; the file is huge and the aggregation is streaming-friendly (the line loop holds one row in memory; read_csv holds everything, though chunksize is pandas' middle ground); dependencies must be zero (a cron box or minimal container where the standard library is guaranteed — the package-management lesson's concern); or row-level error POLICY is the point — per-line skip-and-count with custom rules is explicit in a loop and awkward mid-read_csv. The honest professional answer: prototype the parse in pure Python to UNDERSTAND the mess, then port to pandas once the data proves tabular — carrying over the same skip-counting and dated-output discipline, because the engineering values are engine-independent.",
        },
      ],
    },

    {
      id: "common-mistakes",
      type: "callout",
      variant: "warning",
      title: "Common Mistakes to Avoid",
      content:
        "1) One monolithic main block — five stages, five functions; testability is the payoff. 2) except: pass — the silent-partial-data machine; skip, COUNT, report. 3) Outputs in the input tree — reruns corrupt sources; separate, dated trees. 4) datetime.now() buried in logic — inject run_date; reproducibility requires it. 5) Broad except Exception around parsing — catches your bugs as 'bad rows'; catch ValueError specifically or use the None contract. 6) No skip threshold — 60% rejects should fail the job, not pad a counter. 7) Skipping verification — read back the report and print it; unverified writes are hope, not engineering. 8) Testing only on clean fixtures — plant corrupt lines in your test data on purpose.",
    },

    {
      id: "ai-tutor",
      type: "callout",
      variant: "tip",
      title: "Ask the AI Tutor",
      content:
        "Try these prompts in the AI Tutor panel: • 'Review my pipeline against the five-stage arc — where did I merge stages?' • 'Give me three progressively messier sample feeds and critique my parse function on each.' • 'Quiz me: for ten failure scenarios, do I skip-and-count or crash loudly?' • 'Help me add a skip-rate threshold that fails the run above 5%.' • 'Interview mode: ask me the pipeline-design question and grade my structure.'",
    },

    {
      id: "glossary",
      type: "callout",
      variant: "info",
      title: "Glossary",
      content:
        "pipeline / ETL — the read → clean → transform → aggregate → write arc (Extract, Transform, Load). stage — one arc step, implemented as one function. parse contract — 'typed record or None': failure as a countable value. skip-and-count — tolerate row dirt, report the tally in the output. skip threshold — the reject rate above which the job fails instead of continuing. dependency injection — passing paths/dates as parameters instead of reaching for globals or now(). idempotent — safe to rerun (separate output trees, exist_ok mkdir). dated outputs — ISO-named run folders that accumulate auditable history. verification — reading back what you wrote before claiming success. entry guard — if __name__ == '__main__': keeping imports side-effect free.",
    },

    {
      id: "resources",
      type: "callout",
      variant: "info",
      title: "Recommended Resources",
      content:
        "• Extend the build: add a skip-rate threshold, a second input format, and a per-date (not just per-product) breakdown — each is a one-function change if your stages are clean, which is the test of whether they are. • Read: the csv module docs (your split/regex parsing, industrial-strength) and a first look at pandas' read_csv page to see these stages with a bigger engine. • Compare: sketch this same pipeline as pandas one-liners and note which stages compress and which (error policy!) don't. • Next in DSM: the Python domain is COMPLETE — 36 lessons from first variable to working pipeline. The road continues into the data stack: pandas DataFrames, where these exact patterns meet columnar power.",
    },

    {
      id: "recap",
      type: "recap",
      tocLabel: "Recap",
      content:
        "✓ Five stages, five functions: discover (glob) → extract (stream) → transform (parse to typed records) → aggregate (dict fold) → load (dated report).\n✓ The parse contract — record or None — turns bad rows into countable values; the loop stays exception-free.\n✓ Tolerant of rows, strict about structure: skip-and-count dirt, crash loudly on missing folders — and report every count.\n✓ Inject dependencies (paths, run_date); guard the entry point; keep aggregate pure — that's what makes it testable.\n✓ Dated, separated, verified outputs: mkdir flags, ISO names, read-back before declaring victory.\n✓ The arc is universal — pandas, SQL, and every orchestrator you'll meet run this same shape at scale.\n\nNext up: you've completed the Python domain — all 36 lessons. The journey continues in the Data Analysis course with pandas DataFrames, where every idiom you built here gets a columnar engine underneath it.",
    },
  ],
};
