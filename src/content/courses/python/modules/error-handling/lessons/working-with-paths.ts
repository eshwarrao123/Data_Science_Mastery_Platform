import type { Lesson } from "@/lib/curriculum/types";

export const workingWithPaths: Lesson = {
  meta: {
    id: "python.error-handling.working-with-paths",
    slug: "working-with-paths",
    title: "Working with Paths",
    description:
      "pathlib ends string-surgery on filenames: portable path objects, existence checks, directory listing, glob patterns, and safe output habits.",
    estimatedTime: "25 mins",
    difficulty: "Intermediate",
    xpReward: 60,
    prerequisites: ["python.error-handling.reading-and-writing-files"],
    masteryThreshold: 80,
  },

  blocks: [
    {
      id: "intro",
      type: "lesson-intro",
      tocLabel: "Introduction",
      intro: {
        hook: "data_dir + '\\\\' + fname + '.csv' works on your Windows laptop and dies on the Linux server. A hardcoded '/Users/ada/data/' dies on everyone else's machine. Path bugs are the most preventable failures in data work — and Python solved them in one import: pathlib.",
        what: "pathlib.Path represents filesystem paths as OBJECTS: join with /, inspect with .name/.stem/.suffix, test with .exists(), list directories with .iterdir(), find files with .glob('*.csv'), and create output folders with .mkdir(). One API, every operating system.",
        why: "Every dataset lives at a path, every output needs a home, and every batch job walks directories. Path-as-string code accumulates os.path.join calls, separator bugs, and extension surgery via slicing; Path objects make the same operations readable, portable, and composable — and glob turns 'process every CSV in this folder' into one line.",
        whereUsed:
          "Locating input data, building output paths, batch-processing folders of files, project-relative configs, and every 'works on my machine' path incident you'll now prevent.",
        objectives: [
          "Build paths with Path and the / operator — no separator strings",
          "Read path parts: .name, .stem, .suffix, .parent",
          "Check .exists() / .is_file() and handle absence deliberately",
          "Batch-process folders with .glob() patterns",
          "Create output directories safely with .mkdir(parents=True, exist_ok=True)",
        ],
        realWorldApps: [
          {
            company: "Kaggle",
            headline: "Every notebook starts with paths",
            detail:
              "Competition kernels begin with Path('/kaggle/input') and glob for the CSVs — the first cell of thousands of winning notebooks is literally this lesson.",
          },
          {
            company: "DVC",
            headline: "Data pipelines are path graphs",
            detail:
              "Data-version-control tools track datasets as content-addressed paths; pipeline stages declare input/output paths. Reproducible ML is disciplined path handling.",
          },
          {
            company: "Instagram",
            headline: "Media storage layout",
            detail:
              "Billions of uploads land in sharded directory trees (ab/cd/abcd1234.jpg) built by path composition — the mkdir(parents=True) pattern at planetary scale.",
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
            "from pathlib import Path. Path('data') / 'raw' / 'sales.csv' joins segments with the division operator — pathlib defines __truediv__ (the special-methods lesson, cashing its check!) — and renders the right separator per OS: data/raw/sales.csv on Linux/Mac, data\\\\raw\\\\sales.csv on Windows. Your code never spells a separator again.",
        },
        {
          type: "code-note",
          code: "from pathlib import Path\n\np = Path('data') / 'raw' / 'sales_2026.csv'\nprint(p.name)     # sales_2026.csv   (final component)\nprint(p.stem)     # sales_2026       (name minus extension)\nprint(p.suffix)   # .csv             (the extension)\nprint(p.parent)   # data/raw         (containing directory)",
          content:
            "The four accessors that replace all filename slicing: no more fname[:-4] to drop an extension or split('/')[-1] to get a name. p.with_suffix('.parquet') swaps extensions; p.parent / 'clean' / p.name relocates a file to a sibling folder — path algebra instead of string surgery.",
        },
        {
          type: "analogy",
          title: "Address card vs handwritten directions",
          content:
            "A string path is handwritten directions in local dialect: 'C:\\\\data\\\\raw' means something on Windows and gibberish on Linux. A Path object is a structured address card — country, city, street in labeled fields. The postal service (each OS) renders it in its own format, you query fields directly (.name is the addressee, .parent the street), and composing a new address is filling fields, not editing a sentence with scissors. Same information, but one is DATA and the other is prose you keep re-parsing.",
        },
        {
          type: "keypoint",
          title: "Ask the filesystem: exists, is_file, is_dir",
          content:
            "p.exists() (anything there?), p.is_file(), p.is_dir() — cheap questions that make absence a DECISION instead of a crash. Policy mirrors the exceptions lesson: for a REQUIRED input, skip the check and let open() raise FileNotFoundError loudly (or check and raise your own, richer error). For OPTIONAL files, check-and-default reads clearly. Remember the race caveat from EAFP: exists() then open() can still lose to a deleting process, so the open stays ready to fail.",
        },
        {
          type: "code-note",
          code: "from pathlib import Path\n\nraw = Path('data') / 'raw'\nfor p in sorted(raw.glob('*.csv')):\n    print(p.name)\n\n# subfolders too: raw.glob('**/*.csv') or raw.rglob('*.csv')",
          content:
            "glob is the batch-work engine: '*.csv' matches every CSV in the folder, '**/' recurses. It returns Path objects (not strings!) ready to open. One habit worth gold: sorted(...) — glob's order is OS-dependent, and unsorted iteration is the classic 'results differ between runs' mystery.",
        },
        {
          type: "keypoint",
          title: "Making room for outputs: mkdir",
          content:
            "out_dir.mkdir(parents=True, exist_ok=True) — the incantation to memorize: parents=True builds intermediate folders ('reports/2026/07' in one call), exist_ok=True makes reruns idempotent instead of raising FileExistsError. Every batch job's first act: compose the output dir, mkdir it, then write into it. Without this, jobs die on fresh machines where the folder tree doesn't exist yet.",
        },
        {
          type: "expandable",
          title: "Paths and open() — and Path's own I/O shortcuts",
          content:
            "open() accepts Path objects directly: with open(p, encoding='utf-8') — everything from last lesson works unchanged (as does pd.read_csv(p)). Path also carries shortcuts for small files: p.read_text(encoding='utf-8') and p.write_text(content, encoding='utf-8') — one-liners that open, act, and close internally. Use them for configs and small outputs; keep the with-statement streaming loop for anything big. And note Path.cwd() (where the script RUNS from — which varies!) vs building paths relative to a known anchor; project code usually defines BASE = Path(__file__).parent and composes from there.",
        },
        {
          type: "warning",
          title: "Path discipline for data work",
          content:
            "1) Never hardcode absolute personal paths ('/Users/ada/...') — compose from a base or accept a parameter. 2) Output dir ≠ input dir: write to a separate folder so a bug can't clobber sources (the mode-'w' lesson, at directory scale). 3) Filter what glob returns — '*.csv' can catch '.csv.bak' style strays if you glob loosely ('*'); check .suffix when it matters. 4) Case sensitivity differs (Linux: Sales.CSV ≠ sales.csv) — normalize names on write. 5) Paths in configs and logs: str(p) converts explicitly when a string is truly required.",
        },
      ],
    },

    {
      id: "diagram",
      type: "interactive-diagram",
      tocLabel: "Visual Learning",
      visual: {
        kind: "architecture",
        title: "Anatomy of a Path",
        caption:
          "Path('data')/'raw'/'sales_2026.csv' — every part has an accessor. Click each piece.",
        nodes: [
          {
            id: "whole",
            label: "data/raw/sales_2026.csv",
            sublabel: "the Path object",
            detail:
              "One object, OS-neutral. Renders with the native separator when used; compares and composes as structured data. open() and pandas accept it directly.",
            x: 50,
            y: 12,
            accent: true,
          },
          {
            id: "parent",
            label: ".parent",
            sublabel: "data/raw",
            detail:
              "The containing directory — itself a Path, so it chains: p.parent.parent is data, p.parent / 'clean' / p.name relocates the file. Where output folders get composed.",
            x: 18,
            y: 48,
            accent: false,
          },
          {
            id: "name",
            label: ".name",
            sublabel: "sales_2026.csv",
            detail:
              "The final component — what you'd call the filename. Replaces split('/')[-1] and its Windows-backslash failure mode.",
            x: 50,
            y: 48,
            accent: false,
          },
          {
            id: "stem",
            label: ".stem",
            sublabel: "sales_2026",
            detail:
              "Name minus the (last) suffix. The handle for building derived outputs: f'{p.stem}_clean{p.suffix}' or p.with_suffix('.parquet').",
            x: 82,
            y: 48,
            accent: false,
          },
          {
            id: "suffix",
            label: ".suffix",
            sublabel: ".csv",
            detail:
              "The extension, dot included. Filter files by type (p.suffix == '.csv'), or swap with .with_suffix() — no more fname[:-4] slicing bugs when an extension isn't 3 chars.",
            x: 82,
            y: 80,
            accent: false,
          },
          {
            id: "ops",
            label: "/ . glob . mkdir",
            sublabel: "the verbs",
            detail:
              "Compose with /, discover with .glob('*.csv'), prepare with .mkdir(parents=True, exist_ok=True), question with .exists()/.is_file(). Five verbs cover 95% of data-work path needs.",
            x: 18,
            y: 80,
            accent: false,
          },
        ],
        edges: [
          { from: "whole", to: "parent" },
          { from: "whole", to: "name" },
          { from: "name", to: "stem", label: "minus suffix" },
          { from: "name", to: "suffix" },
          { from: "parent", to: "ops", label: "acts via" },
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
          title: "Compose and inspect",
          scenario: "Build a path portably and read its parts.",
          steps: [
            {
              code: "from pathlib import Path\n\np = Path('projects') / 'dsm' / 'notes.txt'\nprint(p.name)\nprint(p.stem)\nprint(p.suffix)\nprint(p.parent)",
              explanation:
                "The / operator joins; the accessors dissect. No separator characters appear anywhere in the source — this exact code runs identically on Windows, Mac, and Linux.",
            },
          ],
          output: "notes.txt\nnotes\n.txt\nprojects/dsm",
        },
        {
          difficulty: "Easy",
          title: "Optional vs required files",
          scenario: "Two inputs, two absence policies — now with paths.",
          steps: [
            {
              code: "from pathlib import Path\n\nsettings = Path('settings.txt')\nif settings.exists():\n    mode = settings.read_text(encoding='utf-8').strip()\nelse:\n    mode = 'default'\nprint(f'mode: {mode}')",
              explanation:
                "Optional file: LBYL reads cleanly here — check, then either the one-line read_text shortcut or the fallback. No try needed when the check IS the policy.",
            },
            {
              code: "data = Path('data') / 'orders.csv'\nif not data.exists():\n    print(f'FATAL: required input missing: {data}')\nelse:\n    print('would process orders...')",
              explanation:
                "Required file: absence is fatal and the message includes the PATH — in real code this would `raise FileNotFoundError(f'required input: {data}')` so deployment mistakes surface with the exact location, not three functions later.",
            },
          ],
          output: "mode: default\nFATAL: required input missing: data/orders.csv",
        },
        {
          difficulty: "Medium",
          title: "Glob a folder, process every CSV",
          scenario:
            "A drop-folder receives daily exports; the job processes whatever arrived — the batch shape of half of all data engineering.",
          steps: [
            {
              code: "from pathlib import Path\n\nraw = Path('drop')\nraw.mkdir(exist_ok=True)\nfor name, content in [('sales_mon.csv', 'a,1\\nb,2\\n'), ('sales_tue.csv', 'c,3\\n'), ('readme.txt', 'ignore me')]:\n    (raw / name).write_text(content, encoding='utf-8')",
              explanation:
                "Fixture: two CSVs and a decoy .txt in a drop folder. write_text is the compose-and-write one-liner; the parenthesized (raw / name) builds each target.",
            },
            {
              code: "total_rows = 0\nfiles = sorted(raw.glob('*.csv'))\nfor p in files:\n    rows = len(p.read_text(encoding='utf-8').strip().split('\\n'))\n    total_rows += rows\n    print(f'{p.name}: {rows} rows')\nprint(f'{len(files)} files, {total_rows} rows total')",
              explanation:
                "glob('*.csv') selects exactly the CSVs — readme.txt never enters the loop. sorted() pins the order (glob's is OS-dependent). Each p is a ready-to-open Path; .name keeps the report readable.",
            },
          ],
          output:
            "sales_mon.csv: 2 rows\nsales_tue.csv: 1 rows\n2 files, 3 rows total",
        },
        {
          difficulty: "Hard",
          title: "Derived outputs: mirror inputs into a clean folder",
          scenario:
            "For each raw CSV, write a processed copy into out/ with a _clean suffix — the input→output naming pattern of every transform stage.",
          steps: [
            {
              code: "from pathlib import Path\n\nraw = Path('drop')\nout = Path('out')\nout.mkdir(parents=True, exist_ok=True)",
              explanation:
                "Outputs get their own directory, created idempotently up front. A rerun neither crashes (exist_ok) nor touches the inputs (separate tree).",
            },
            {
              code: "for src in sorted(raw.glob('*.csv')):\n    dst = out / f'{src.stem}_clean{src.suffix}'\n    lines = src.read_text(encoding='utf-8').strip().split('\\n')\n    kept = [ln for ln in lines if ln and not ln.startswith('#')]\n    dst.write_text('\\n'.join(kept) + '\\n', encoding='utf-8')\n    print(f'{src.name} -> {dst}')",
              explanation:
                "The naming algebra: src.stem + '_clean' + src.suffix derives sales_mon_clean.csv from sales_mon.csv — no slicing, no hardcoded extensions. The transform (drop blanks/comments) is incidental; the path pattern is the lesson.",
            },
            {
              code: "print([p.name for p in sorted(out.iterdir())])",
              explanation:
                ".iterdir() lists the output folder — verification that the job wrote what it claimed. Input tree untouched, output tree complete: a bug in the transform can be rerun forever without data loss.",
            },
          ],
          output:
            "sales_mon.csv -> out/sales_mon_clean.csv\nsales_tue.csv -> out/sales_tue_clean.csv\n['sales_mon_clean.csv', 'sales_tue_clean.csv']",
        },
        {
          difficulty: "Industry Example",
          title: "A dated pipeline layout, end to end",
          scenario:
            "Production jobs organize outputs by run date — reports/2026/07/16/summary.csv — so history accumulates and reruns are isolated. This example assembles the whole module: paths, mkdir, glob, files, and skip-and-count parsing.",
          steps: [
            {
              code: "from pathlib import Path\n\nbase = Path('warehouse')\nrun_dir = base / 'reports' / '2026' / '07' / '16'\nrun_dir.mkdir(parents=True, exist_ok=True)\nprint(f'run dir ready: {run_dir}')",
              explanation:
                "parents=True builds the whole year/month/day chain in one call — on a fresh machine or the thousandth run alike. (Real jobs compose the date from datetime — next module's dates lesson.)",
            },
            {
              code: "inbox = base / 'inbox'\ninbox.mkdir(parents=True, exist_ok=True)\n(inbox / 'east.csv').write_text('amount\\n120.5\\nbad\\n80.0\\n', encoding='utf-8')\n(inbox / 'west.csv').write_text('amount\\n200.0\\n', encoding='utf-8')\n\ngrand, skipped = 0.0, 0\nfor src in sorted(inbox.glob('*.csv')):\n    for line in src.read_text(encoding='utf-8').strip().split('\\n')[1:]:\n        try:\n            grand += float(line)\n        except ValueError:\n            skipped += 1",
              explanation:
                "Glob the inbox, stream each file's data rows, parse with the per-line try — the error-handling module composed into one loop. [1:] skips each header (the slice idiom; next(f) is its streaming twin).",
            },
            {
              code: "report = run_dir / 'summary.csv'\nreport.write_text(f'grand_total,skipped\\n{grand:.2f},{skipped}\\n', encoding='utf-8')\nprint(report.read_text(encoding='utf-8').strip())\nprint(f'wrote {report}')",
              explanation:
                "The summary lands in the dated folder — tomorrow's run writes to .../07/17/ and today's stays forever. Auditable history from three path habits: compose, mkdir, never overwrite inputs. That's production file discipline in miniature.",
            },
          ],
          output:
            "run dir ready: warehouse/reports/2026/07/16\ngrand_total,skipped\n400.50,1\nwrote warehouse/reports/2026/07/16/summary.csv",
        },
      ],
    },

    {
      id: "inline-practice",
      type: "inline-code",
      tocLabel: "Practice Coding",
      coding: {
        language: "python",
        filename: "photo_organizer.py",
        instructions:
          "Organize a mixed drop folder: create shoot/ with three files (two .jpg, one .txt) via write_text; glob the .jpg files (sorted); for each, compose a destination in organized/ named '<stem>_web<suffix>' and write the source's content there (simulating a copy); create organized/ safely first. Print each 'name -> dest' mapping and finish with the sorted names in organized/.",
        starterCode: `from pathlib import Path

shoot = Path('shoot')
shoot.mkdir(exist_ok=True)
(shoot / 'beach.jpg').write_text('beach-bytes', encoding='utf-8')
(shoot / 'sunset.jpg').write_text('sunset-bytes', encoding='utf-8')
(shoot / 'notes.txt').write_text('not a photo', encoding='utf-8')

# TODO 1: create organized/ (safe to rerun)
out = ___
___

# TODO 2: loop sorted .jpg files; dest = organized/<stem>_web<suffix>;
# write the source content to dest; print '<name> -> <dest>'
___

# TODO 3: print sorted list of names in organized/
___`,
        solutionCode: `from pathlib import Path

shoot = Path('shoot')
shoot.mkdir(exist_ok=True)
(shoot / 'beach.jpg').write_text('beach-bytes', encoding='utf-8')
(shoot / 'sunset.jpg').write_text('sunset-bytes', encoding='utf-8')
(shoot / 'notes.txt').write_text('not a photo', encoding='utf-8')

out = Path('organized')
out.mkdir(parents=True, exist_ok=True)

for src in sorted(shoot.glob('*.jpg')):
    dest = out / f"{src.stem}_web{src.suffix}"
    dest.write_text(src.read_text(encoding='utf-8'), encoding='utf-8')
    print(f"{src.name} -> {dest}")

print(sorted([p.name for p in out.iterdir()]))`,
        expectedOutput:
          "beach.jpg -> organized/beach_web.jpg\nsunset.jpg -> organized/sunset_web.jpg\n['beach_web.jpg', 'sunset_web.jpg']",
        hints: [
          "out = Path('organized'); out.mkdir(parents=True, exist_ok=True)",
          "glob('*.jpg') skips notes.txt automatically; wrap in sorted() for stable order",
          "dest composes with an f-string: f'{src.stem}_web{src.suffix}'",
          "The 'copy' is read_text piped into write_text; .iterdir() lists the results",
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
          id: "py31_mcq_01",
          difficulty: "Easy",
          question: "What is Path('data') / 'raw' / 'x.csv'?",
          options: [
            "A string with forward slashes",
            "A Path object joining the segments with the correct separator for whatever OS runs the code",
            "A syntax error — / doesn't work on paths",
            "A file handle",
          ],
          correctIndex: 1,
          explanation:
            "Path defines __truediv__ for joining — the object renders platform-correctly when used. No separator characters belong in your source code.",
        },
        {
          type: "mcq",
          id: "py31_mcq_02",
          difficulty: "Easy",
          question: "For p = Path('logs/app_2026.log'), what is p.stem?",
          options: ["'app_2026.log'", "'app_2026'", "'.log'", "'logs'"],
          correctIndex: 1,
          explanation:
            ".stem is the final component minus its suffix — the handle for derived names. .name keeps the extension, .suffix is '.log', .parent is logs.",
        },
        {
          type: "mcq",
          id: "py31_mcq_03",
          difficulty: "Medium",
          question:
            "Why call out_dir.mkdir(parents=True, exist_ok=True) before writing outputs?",
          options: [
            "It deletes old outputs",
            "parents=True creates missing intermediate directories and exist_ok=True makes reruns not raise FileExistsError — the job works on fresh machines and repeats safely",
            "It's required before any Path can be used",
            "It locks the directory",
          ],
          correctIndex: 1,
          explanation:
            "Writing into a nonexistent directory raises FileNotFoundError; a plain mkdir raises if the dir exists. The two flags make directory preparation idempotent — run one or run one thousand.",
        },
        {
          type: "scenario",
          id: "py31_sc_01",
          difficulty: "Medium",
          scenario:
            "A batch job does: for p in input_dir.glob('*'): result = transform(p); p.write_text(result). Three runs later the originals are gone and reruns produce different (double-transformed) numbers.",
          question: "What discipline was violated?",
          options: [
            "glob should have been rglob",
            "Outputs overwrote inputs — writing back to the source paths destroyed the originals and made the job non-idempotent; derived outputs belong at separate paths (out_dir / f'{p.stem}_clean{p.suffix}')",
            "transform should return Paths",
            "write_text needed encoding",
          ],
          correctIndex: 1,
          explanation:
            "In-place transformation is the directory-scale mode-'w' accident: one bug and sources are unrecoverable, and every rerun compounds. Input trees are read-only by policy; outputs get their own tree and derived names.",
        },
        {
          type: "coding",
          id: "py31_code_01",
          difficulty: "Medium",
          prompt:
            "Given paths = [Path('a/report.csv'), Path('b/data.parquet'), Path('c/notes.csv')], print the .name of each path whose .suffix is '.csv'. Expected:\nreport.csv\nnotes.csv",
          starterCode:
            "from pathlib import Path\npaths = [Path('a/report.csv'), Path('b/data.parquet'), Path('c/notes.csv')]\n# Your code here\n",
          solutionCode:
            "from pathlib import Path\npaths = [Path('a/report.csv'), Path('b/data.parquet'), Path('c/notes.csv')]\nfor p in paths:\n    if p.suffix == '.csv':\n        print(p.name)",
          expectedOutput: "report.csv\nnotes.csv",
          tests: [
            {
              name: "Suffix filtering",
              description: "Selection uses p.suffix == '.csv', not string endswith on a str-cast",
            },
            {
              name: "Name access",
              description: "Output uses .name, not full paths",
            },
          ],
        },
        {
          type: "mcq",
          id: "py31_mcq_04",
          difficulty: "Hard",
          question:
            "A nightly job processes sorted(inbox.glob('*.csv')). Why the sorted()?",
          options: [
            "glob raises without it",
            "glob's result order is OS/filesystem-dependent — sorting makes runs deterministic, so logs, outputs, and bugs reproduce identically everywhere",
            "It's faster",
            "It filters duplicates",
          ],
          correctIndex: 1,
          explanation:
            "Unordered iteration is the classic 'results differ between server and laptop' mystery — especially when processing order affects output (last-write-wins aggregations). Determinism is one function call; take it always.",
        },
        {
          type: "coding",
          id: "py31_code_02",
          difficulty: "Hard",
          prompt:
            "Create staging/ containing x.csv ('1\\n2\\n') and y.csv ('3\\n') via write_text. Glob it (sorted), sum all numbers across files (per-line int() with try/except counting skips), then write 'total=<n>' to results/summary.txt — creating results/ safely — and print that file's content. Expected: total=6",
          starterCode: "from pathlib import Path\n# Your code here\n",
          solutionCode:
            "from pathlib import Path\n\nstaging = Path('staging')\nstaging.mkdir(exist_ok=True)\n(staging / 'x.csv').write_text('1\\n2\\n', encoding='utf-8')\n(staging / 'y.csv').write_text('3\\n', encoding='utf-8')\n\ntotal, skipped = 0, 0\nfor p in sorted(staging.glob('*.csv')):\n    for line in p.read_text(encoding='utf-8').strip().split('\\n'):\n        try:\n            total += int(line)\n        except ValueError:\n            skipped += 1\n\nresults = Path('results')\nresults.mkdir(parents=True, exist_ok=True)\nout = results / 'summary.txt'\nout.write_text(f'total={total}', encoding='utf-8')\nprint(out.read_text(encoding='utf-8'))",
          expectedOutput: "total=6",
          tests: [
            {
              name: "Full pipeline shape",
              description: "mkdir → write fixtures → glob sorted → parse guarded → mkdir output → write → verify",
            },
            {
              name: "Separate output tree",
              description: "summary.txt lives under results/, not staging/",
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
            "Why prefer pathlib over string paths and os.path? What actually goes wrong with strings?",
          answer:
            "Strings make paths PROSE the program keeps re-parsing; pathlib makes them structured data. The concrete failures strings invite: hardcoded separators ('data\\\\raw' breaks on Linux, 'data/raw' half-works on Windows until some API disagrees); extension surgery via slicing (fname[:-4] silently corrupts '.jsonl' or 'archive.tar.gz'); filename extraction via split('/') that misses backslashes; and doubled or missing separators from naive concatenation. os.path fixes portability but yields awkward nested calls — os.path.join(os.path.dirname(p), name) — where pathlib's object algebra reads as intent: p.parent / name, p.with_suffix('.parquet'), p.stem. Beyond ergonomics, Path unifies the whole file workflow — the same object composes (/), inspects (.name/.suffix), questions the filesystem (.exists/.is_file), discovers (.glob), prepares (.mkdir), and opens (open(p) or p.read_text) — so path handling becomes one coherent API instead of string tricks plus three modules. It's also a nice dunder story: / working on paths is just __truediv__, the protocol lesson applied by the standard library.",
        },
        {
          question:
            "Design the file layout and path handling for a daily batch job. What habits prevent incidents?",
          answer:
            "Layout: a base root with separate trees per role — inbox/ (or raw/) for inputs, treated as strictly read-only; processed or reports organized by run date (reports/2026/07/16/) so history accumulates and any run can be audited or replayed; optionally an archive/ where consumed inputs MOVE (never in-place edits). Habits: compose every path from a configurable base (never hardcode personal absolute paths — accept a parameter or anchor on Path(__file__).parent); start each run with out_dir.mkdir(parents=True, exist_ok=True) so fresh machines and reruns behave identically; discover inputs with sorted(glob('*.csv')) — the sort buys determinism across filesystems; derive output names from input names via .stem/.suffix algebra rather than string slicing; and keep the input tree untouchable so the job is idempotent — a rerun after a mid-job crash must be safe, which it is exactly when inputs are read-only and outputs land in a dated, separate tree. Failure policy ties in: required inputs missing → raise with the full path in the message; optional ones → explicit defaults. Most 'the batch job destroyed the data' stories violate exactly one of these: outputs written into the input tree.",
        },
        {
          question:
            "When do exists() checks make sense versus letting open() fail — and what's the race condition caveat?",
          answer:
            "The split follows the EAFP/LBYL reasoning from exception handling. exists()/is_file() reads well when absence is a NORMAL, expected state with a defined alternative: optional config → default values; a marker file controlling behavior; choosing between candidate locations. Letting open() raise (or checking and raising your own richer error) is right when the file is REQUIRED: a missing mandatory input is a deployment or upstream failure that should stop the job immediately, ideally with the absolute path in the message so the fix is obvious. The caveat: check-then-open is a TOCTOU (time-of-check-to-time-of-use) race — the file can vanish, appear, or change between exists() and open(), because the filesystem is shared mutable state; so an exists() check never removes the need for open() to survive failure, it only makes the COMMON absence case read cleanly. For the drop-folder pattern specifically (another process still writing files as you glob), robust jobs handle partially-written files too — by convention (writers use temp names then rename atomically) rather than by checks, since no amount of pre-checking closes the race. The mental model to state: filesystem checks are optimizations for readability and expected cases, never guarantees.",
        },
      ],
    },

    {
      id: "common-mistakes",
      type: "callout",
      variant: "warning",
      title: "Common Mistakes to Avoid",
      content:
        "1) Separator characters in source ('data\\\\raw', 'a/b' concatenation) — compose with /. 2) Hardcoded absolute personal paths — anchor on a base or parameter. 3) Writing outputs into the input tree — one bug from unrecoverable; separate trees. 4) Unsorted glob — OS-dependent order, irreproducible runs. 5) mkdir without parents=True/exist_ok=True — dies on fresh machines or reruns. 6) Extension surgery by slicing — .stem/.suffix/.with_suffix exist. 7) read_text on huge files — the streaming with-loop still owns big data. 8) exists() as a guarantee — the open must still handle failure.",
    },

    {
      id: "ai-tutor",
      type: "callout",
      variant: "tip",
      title: "Ask the AI Tutor",
      content:
        "Try these prompts in the AI Tutor panel: • 'Quiz me: .name/.stem/.suffix/.parent for these eight paths.' • 'Refactor this os.path + string-slicing script to pathlib with me.' • 'Design a dated output layout for my scraper and critique my draft.' • 'Show the TOCTOU race between exists() and open().' • 'Interview mode: ask me the batch-job path-discipline question and grade my answer.'",
    },

    {
      id: "glossary",
      type: "callout",
      variant: "info",
      title: "Glossary",
      content:
        "pathlib.Path — the OS-neutral path object. / (on paths) — the join operator (__truediv__). .name/.stem/.suffix/.parent — final component / name-sans-extension / extension / directory. .with_suffix() — swap extensions safely. .exists()/.is_file()/.is_dir() — filesystem questions. .glob(pattern)/.rglob — discover matching files ('**/' recurses). .iterdir() — list a directory. .mkdir(parents=True, exist_ok=True) — idempotent directory creation. .read_text()/.write_text() — small-file one-liners. Path.cwd() — the (variable!) working directory. Idempotent — safe to rerun. TOCTOU — the check-then-use race window.",
    },

    {
      id: "resources",
      type: "callout",
      variant: "info",
      title: "Recommended Resources",
      content:
        "• Docs: the pathlib module page — skim the 'Basic use' section and the table mapping os.path functions to Path methods. • Read: any Kaggle kernel's first cell — real Path/glob usage in the wild. • Practice: point a glob loop at your own Downloads folder and report file counts by .suffix (read-only — no writes!). • Next in DSM: Errors & File I/O complete — the Python for Data Science module begins with Package Management: pip, virtual environments, and requirements.txt — how the ecosystem's tools reach your machine.",
    },

    {
      id: "recap",
      type: "recap",
      tocLabel: "Recap",
      content:
        "✓ Path objects compose with / and render per-OS — separators never appear in source.\n✓ .name/.stem/.suffix/.parent replace all filename string surgery.\n✓ Required files fail loudly with the path in the message; optional ones default explicitly.\n✓ sorted(dir.glob('*.csv')) = deterministic batch discovery; '**/' recurses.\n✓ out.mkdir(parents=True, exist_ok=True) before writing; outputs NEVER share the input tree.\n✓ read_text/write_text for small files; the streaming with-loop for everything big.\n\nNext up: Package Management. The Error Handling module is complete — now the bridge to the data stack: pip, virtual environments, requirements.txt, and how NumPy and pandas actually arrive on your machine.",
    },
  ],
};
