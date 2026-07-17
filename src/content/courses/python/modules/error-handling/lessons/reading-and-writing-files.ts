import type { Lesson } from "@/lib/curriculum/types";

export const readingAndWritingFiles: Lesson = {
  meta: {
    id: "python.error-handling.reading-and-writing-files",
    slug: "reading-and-writing-files",
    title: "Reading & Writing Files",
    description:
      "Move data in and out of files safely: open() modes, the with statement, line-by-line processing, CSV parsing by hand, and encoding pitfalls.",
    estimatedTime: "30 mins",
    difficulty: "Intermediate",
    xpReward: 60,
    prerequisites: ["python.error-handling.raising-exceptions"],
    masteryThreshold: 80,
  },

  blocks: [
    {
      id: "intro",
      type: "lesson-intro",
      tocLabel: "Introduction",
      intro: {
        hook: "Every dataset you'll ever analyze starts life in a file: a CSV export, a JSON log, a text dump from some legacy system. pd.read_csv() will eventually do the heavy lifting — but the day the file is malformed, half-encoded, or 40GB, the engineers who understand what's underneath are the ones who fix it. Today you touch the actual bytes.",
        what: "open() connects your program to a file; mode strings ('r', 'w', 'a') pick read/write/append; the with statement guarantees closing; files iterate line by line; and encoding='utf-8' names how bytes become text. Plus: parsing a CSV by hand, so the format loses its mystery.",
        why: "File I/O is where programs meet reality — and where resource leaks, silent truncation ('w' on the wrong path!), and encoding mojibake live. The with-statement discipline and encoding awareness you build here transfer directly to databases, sockets, and every pandas read_* call's parameters.",
        whereUsed:
          "Reading raw data files, writing reports and cleaned outputs, appending to logs, processing files too big for memory, and debugging every 'UnicodeDecodeError' a CSV ever throws at you.",
        objectives: [
          "Open files with the right mode — and fear 'w' appropriately",
          "Use with so files close on every exit path",
          "Stream large files line by line instead of loading them whole",
          "Parse and write simple CSV data by hand",
          "Name encodings explicitly and diagnose decode errors",
        ],
        realWorldApps: [
          {
            company: "Netflix",
            headline: "Log pipelines start as lines",
            detail:
              "Petabytes of playback logs are, at bottom, text lines appended to files — parsed by streaming readers that never load a whole file, exactly the iteration pattern you'll write today.",
          },
          {
            company: "UK Government (GDS)",
            headline: "CSV is the lingua franca",
            detail:
              "Public data portals publish tens of thousands of CSVs. Encoding declarations and header rows — the details in this lesson — are the difference between usable open data and mojibake.",
          },
          {
            company: "pandas",
            headline: "read_csv wraps this lesson",
            detail:
              "encoding=, sep=, header= — every pd.read_csv parameter you'll ever pass corresponds to a by-hand decision you make in this lesson. Knowing the manual version makes the tool debuggable.",
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
            "open(path, mode, encoding) returns a file object. The modes that matter: 'r' read (default; FileNotFoundError if absent), 'w' write (CREATES the file — or TRUNCATES an existing one to zero bytes instantly), 'a' append (creates or adds to the end — logs live here), plus 'b' suffix for binary (images, parquet). The rule to internalize: 'w' is a destructive operation wearing a friendly name.",
        },
        {
          type: "code-note",
          code: "with open('report.txt', 'w', encoding='utf-8') as f:\n    f.write('revenue: $1,234\\n')\n    f.write('orders: 87\\n')\n\nwith open('report.txt', 'r', encoding='utf-8') as f:\n    content = f.read()\nprint(content)",
          content:
            "The with statement is non-negotiable professional practice: the file CLOSES automatically when the block exits — normally, via return, or via exception (it's the try/finally from two lessons ago, packaged). Unclosed files mean leaked handles and, for writes, buffered data that never hits disk. Note write() does NOT add newlines — you supply \\n.",
        },
        {
          type: "analogy",
          title: "The library loan desk",
          content:
            "open() is checking a book out of the library: you get exclusive-ish access and the library records the loan. close() is returning it. Forget to return books and the library eventually refuses you new loans (OS file-handle limits are real). The with statement is a librarian who takes the book back the MOMENT you leave the building — even if you leave through the fire exit (an exception). And mode 'w' is asking for the book plus a shredder: if a book by that name exists, it's destroyed the instant your loan starts — before you've written a word.",
        },
        {
          type: "keypoint",
          title: "Files iterate — use it",
          content:
            "A file object is iterable, yielding one line per iteration: for line in f: — reading lazily, holding ONE line in memory at a time. That's how you process a 40GB log on an 8GB laptop. f.read() (whole file as one string) and f.readlines() (list of lines) are fine for small files, but the streaming loop is the default posture for data work. Each yielded line KEEPS its trailing \\n — line.strip() (or .rstrip('\\n')) is the reflexive first touch.",
        },
        {
          type: "code-note",
          code: "# sales.csv:  city,amount\\noslo,1250.5\\nlima,890.0\\ncairo,2100.75\nwith open('sales.csv', 'w', encoding='utf-8') as f:\n    f.write('city,amount\\noslo,1250.5\\nlima,890.0\\ncairo,2100.75\\n')\n\ntotal = 0.0\nwith open('sales.csv', 'r', encoding='utf-8') as f:\n    header = next(f)                    # consume the header line\n    for line in f:\n        city, amount = line.strip().split(',')\n        total += float(amount)\nprint(f'total: {total}')",
          content:
            "CSV by hand: next(f) advances past the header; each data line strips its newline and splits on the comma; the fields arrive as STRINGS (the Type Conversion lesson's eternal truth) needing float(). This 6-line loop is what read_csv industrializes — with quoting, types, and encodings handled for you.",
        },
        {
          type: "keypoint",
          title: "Encoding: how bytes become text",
          content:
            "Files store BYTES; text is an interpretation. encoding='utf-8' names the interpretation — always pass it explicitly, because the default varies by operating system (Windows often cp1252!), and a script that works on your Mac then garbles 'São Paulo' on the Windows server is a rite of passage you can skip. UnicodeDecodeError on read means the file isn't the encoding you claimed — common culprits: Excel exports (cp1252/latin-1) and old systems. Fix by naming the true encoding, not by ignoring errors.",
        },
        {
          type: "expandable",
          title: "The error-handling marriage",
          content:
            "File operations raise richly and this module prepared you: FileNotFoundError ('r' on a missing path — catch when the file is optional, let it crash when required), PermissionError, IsADirectoryError, UnicodeDecodeError. All but the last subclass OSError. The patterns compose: with inside try (except FileNotFoundError: use defaults), or the skip-and-count loop with per-LINE try for malformed rows inside a good file. Note the with statement doesn't SUPPRESS exceptions — it only guarantees closing while they propagate.",
        },
        {
          type: "warning",
          title: "Real-world file discipline",
          content:
            "1) Never 'w' a path you didn't verify — one wrong variable and the source data is a zero-byte file; write outputs to a DIFFERENT name than inputs. 2) Appending logs uses 'a' — 'w' would erase history on every run. 3) Don't build gigantic strings then write once; write incrementally. 4) CSV-by-hand splits break on quoted commas ('\"Portland, OR\"') — the csv module (or pandas) handles quoting; hand-splitting is for learning and truly-simple files. 5) Paths differ across OSes — next lesson (pathlib) fixes the '\\\\' vs '/' mess properly.",
        },
      ],
    },

    {
      id: "diagram",
      type: "interactive-diagram",
      tocLabel: "Visual Learning",
      visual: {
        kind: "flow",
        title: "The life of a with-block file",
        caption:
          "From open() to guaranteed close — on both the happy and the exploding path. Click each node.",
        nodes: [
          {
            id: "open",
            label: "open(path, 'r', encoding='utf-8')",
            sublabel: "acquire",
            detail:
              "The OS locates the file and hands your process a handle. This is the moment FileNotFoundError fires for missing paths — before any reading. Mode and encoding are locked in here.",
            x: 10,
            y: 40,
            accent: false,
          },
          {
            id: "body",
            label: "with block body",
            sublabel: "use",
            detail:
              "Read whole (f.read()), by lines (for line in f:), or write (f.write). The handle is live only inside this indentation — architecture by whitespace.",
            x: 38,
            y: 40,
            accent: true,
          },
          {
            id: "happy",
            label: "block ends normally",
            sublabel: "→ close",
            detail:
              "Last statement done → Python closes the handle: buffers flush to disk, the loan is returned. Your data is actually ON disk only after this point.",
            x: 66,
            y: 18,
            accent: false,
          },
          {
            id: "boom",
            label: "exception inside",
            sublabel: "→ close, THEN propagate",
            detail:
              "A ValueError mid-parse doesn't leak the handle: with closes the file FIRST, then lets the exception continue unwinding. It's try/finally, packaged — guaranteed cleanup, unsuppressed errors.",
            x: 66,
            y: 62,
            accent: false,
          },
          {
            id: "closed",
            label: "file closed",
            sublabel: "always",
            detail:
              "Either path lands here. Reading the handle now raises ValueError('I/O operation on closed file') — a common bug is returning the file object and reading it outside the with. Return the DATA, not the handle.",
            x: 90,
            y: 40,
            accent: false,
          },
        ],
        edges: [
          { from: "open", to: "body", label: "handle" },
          { from: "body", to: "happy", label: "success" },
          { from: "body", to: "boom", label: "raise" },
          { from: "happy", to: "closed" },
          { from: "boom", to: "closed", label: "then re-raise" },
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
          title: "Write, then read back",
          scenario: "The full round trip in eight lines.",
          steps: [
            {
              code: "with open('note.txt', 'w', encoding='utf-8') as f:\n    f.write('hello, files\\n')\n    f.write('line two\\n')",
              explanation:
                "'w' creates note.txt (or wipes an existing one). Two writes, each supplying its own \\n. Closing (automatic, at dedent) flushes them to disk.",
            },
            {
              code: "with open('note.txt', 'r', encoding='utf-8') as f:\n    print(f.read())",
              explanation:
                "A separate with for reading — open/close cycles are cheap; dangling handles are not. f.read() returns the entire content as one string, embedded newlines included.",
            },
          ],
          output: "hello, files\nline two\n",
        },
        {
          difficulty: "Easy",
          title: "Streaming lines with a running filter",
          scenario: "Count and display the ERROR lines from a service log.",
          steps: [
            {
              code: "with open('app.log', 'w', encoding='utf-8') as f:\n    f.write('INFO boot ok\\nERROR db timeout\\nINFO retry\\nERROR disk full\\nINFO shutdown\\n')",
              explanation: "Fixture first: a five-line log.",
            },
            {
              code: "errors = []\nwith open('app.log', 'r', encoding='utf-8') as f:\n    for line in f:\n        line = line.strip()\n        if line.startswith('ERROR'):\n            errors.append(line)\nprint(f'{len(errors)} errors')\nfor e in errors:\n    print(f'  {e}')",
              explanation:
                "The canonical shape: iterate (one line in memory), strip (kill the \\n), filter (startswith from the Strings lesson), collect. This exact loop scales unchanged from 5 lines to 5 billion.",
            },
          ],
          output: "2 errors\n  ERROR db timeout\n  ERROR disk full",
        },
        {
          difficulty: "Medium",
          title: "CSV in, computed report out",
          scenario:
            "Read a sales CSV, aggregate by city (your dict patterns), and WRITE a summary file — the in/out shape of every batch job.",
          steps: [
            {
              code: "with open('sales.csv', 'w', encoding='utf-8') as f:\n    f.write('city,amount\\noslo,1250.50\\nlima,890.00\\noslo,340.25\\ncairo,2100.75\\nlima,55.10\\n')",
              explanation: "Five data rows, cities repeating — aggregation material.",
            },
            {
              code: "totals = {}\nwith open('sales.csv', 'r', encoding='utf-8') as f:\n    next(f)                                  # skip header\n    for line in f:\n        city, amount = line.strip().split(',')\n        totals[city] = totals.get(city, 0) + float(amount)",
              explanation:
                "Parse (split + float) feeding the counting pattern with amounts. Every module converges here: files provide, strings parse, dicts aggregate.",
            },
            {
              code: "with open('summary.csv', 'w', encoding='utf-8') as f:\n    f.write('city,total\\n')\n    for city, total in sorted(totals.items()):\n        f.write(f'{city},{total:.2f}\\n')\n\nwith open('summary.csv', 'r', encoding='utf-8') as f:\n    print(f.read())",
              explanation:
                "Writing CSV is f-strings plus commas plus \\n — header first, then sorted rows (deterministic output diffs cleanly in version control). Note: OUTPUT file ≠ input file; the source survives any bug in this block.",
            },
          ],
          output: "city,total\ncairo,2100.75\nlima,945.10\noslo,1590.75\n",
        },
        {
          difficulty: "Hard",
          title: "Defensive reading: missing file, dirty rows",
          scenario:
            "A metrics job must survive an optional config being absent AND corrupt lines in its data — both error lessons, applied to I/O.",
          steps: [
            {
              code: "def load_threshold(path, default=100.0):\n    try:\n        with open(path, 'r', encoding='utf-8') as f:\n            return float(f.read().strip())\n    except FileNotFoundError:\n        return default\n\nprint(load_threshold('threshold.txt'))",
              explanation:
                "Optional file → EAFP with a narrow catch and a default. Note the try wraps the with: a missing file fails at open(). A REQUIRED file would use no try at all — crash loudly, fix the deployment.",
            },
            {
              code: "with open('readings.txt', 'w', encoding='utf-8') as f:\n    f.write('98.5\\n101.2\\nnot-a-number\\n\\n104.9\\n')\n\nvalues, skipped = [], 0\nwith open('readings.txt', 'r', encoding='utf-8') as f:\n    for line in f:\n        try:\n            values.append(float(line.strip()))\n        except ValueError:\n            skipped += 1",
              explanation:
                "Per-LINE try inside the loop: the corrupt marker and the blank line each cost one skip, not the batch. (float('') raises ValueError — the empty line is caught by the same net.)",
            },
            {
              code: "threshold = load_threshold('threshold.txt')\nalerts = [v for v in values if v > threshold]\nprint(f'{len(values)} readings, {skipped} skipped, {len(alerts)} over {threshold}')",
              explanation:
                "The job report: parsed count, skip count, and the actual analysis — resilient to a missing config and dirty data, silent about neither.",
            },
          ],
          output: "100.0\n3 readings, 2 skipped, 2 over 100.0",
        },
        {
          difficulty: "Industry Example",
          title: "An append-only audit log with rotation-style summary",
          scenario:
            "A payments service appends every transaction decision to a daily audit file — append mode so restarts never erase history — then a reporting pass streams it back for the morning summary. This is production logging in miniature.",
          steps: [
            {
              code: "def audit(event):\n    with open('audit.log', 'a', encoding='utf-8') as f:\n        f.write(event + '\\n')\n\n# simulate a day's decisions across several 'runs'\nfor e in ['ACCEPT A1 49.99', 'REJECT A2 bad-currency', 'ACCEPT A3 120.00']:\n    audit(e)\nfor e in ['ACCEPT A4 15.50', 'REJECT A5 negative-amount']:\n    audit(e)",
              explanation:
                "Mode 'a' is the whole design: each write lands at the end, restarts append rather than erase, and concurrent appends of whole lines are (for this scale) safe. An accidental 'w' here would be an incident — audit history gone.",
            },
            {
              code: "accepted, rejected = 0, 0\nrevenue = 0.0\nwith open('audit.log', 'r', encoding='utf-8') as f:\n    for line in f:\n        parts = line.strip().split(' ')\n        if parts[0] == 'ACCEPT':\n            accepted += 1\n            revenue += float(parts[2])\n        else:\n            rejected += 1",
              explanation:
                "The reader streams — an audit log grows unboundedly, so f.read() is a memory bug waiting for month three. split(' ') + positional fields is a hand-rolled record format; real systems graduate to JSON-lines, same loop.",
            },
            {
              code: "print(f'accepted={accepted} rejected={rejected} revenue=${revenue:.2f}')",
              explanation:
                "Write path and read path share one contract: the line format. That contract-between-writers-and-readers IS what file formats (CSV, JSONL, parquet) formalize — and why schema changes to log lines get reviewed like API changes.",
            },
          ],
          output: "accepted=3 rejected=2 revenue=$185.49",
        },
      ],
    },

    {
      id: "inline-practice",
      type: "inline-code",
      tocLabel: "Practice Coding",
      coding: {
        language: "python",
        filename: "inventory_report.py",
        instructions:
          "Write inventory.csv with the given content ('item,qty' header plus 4 rows, one corrupt). Then read it back: skip the header, parse rows with a per-line try/except (count skips), and write low_stock.txt listing every item with qty < 10, one per line as '<item>: <qty>'. Finally print low_stock.txt's content and the skip count.",
        starterCode: `rows = 'item,qty\\nbolt,25\\nnut,4\\nwasher,oops\\nscrew,7\\n'

# TODO 1: write rows to inventory.csv ('w', utf-8)
___

# TODO 2: read it back — skip header, split ',', int() the qty
# in a try/except ValueError counting skipped; collect (item, qty)
items = []
skipped = 0
___

# TODO 3: write '<item>: <qty>' lines for qty < 10 to low_stock.txt
___

# TODO 4: read low_stock.txt and print its content, then the skip count
___
print(f"skipped: {skipped}")`,
        solutionCode: `rows = 'item,qty\\nbolt,25\\nnut,4\\nwasher,oops\\nscrew,7\\n'

with open('inventory.csv', 'w', encoding='utf-8') as f:
    f.write(rows)

items = []
skipped = 0
with open('inventory.csv', 'r', encoding='utf-8') as f:
    next(f)
    for line in f:
        name, raw_qty = line.strip().split(',')
        try:
            items.append((name, int(raw_qty)))
        except ValueError:
            skipped += 1

with open('low_stock.txt', 'w', encoding='utf-8') as f:
    for name, qty in items:
        if qty < 10:
            f.write(f"{name}: {qty}\\n")

with open('low_stock.txt', 'r', encoding='utf-8') as f:
    print(f.read(), end='')
print(f"skipped: {skipped}")`,
        expectedOutput: "nut: 4\nscrew: 7\nskipped: 1",
        hints: [
          "Three separate with blocks: write CSV, read+parse, write report (plus one more to read it back)",
          "next(f) consumes the header; line.strip().split(',') yields [name, raw_qty]",
          "Wrap only int(raw_qty) in try — 'oops' costs one skip, the loop continues",
          "print(f.read(), end='') avoids doubling the file's final newline",
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
          id: "py30_mcq_01",
          difficulty: "Easy",
          question: "What does opening an EXISTING file with mode 'w' do?",
          options: [
            "Appends to it",
            "Raises FileExistsError",
            "Truncates it to zero bytes immediately — its old content is gone before you write anything",
            "Opens it read-write",
          ],
          correctIndex: 2,
          explanation:
            "'w' means 'give me a fresh file at this path' — existing content is destroyed at open() time. Appending is 'a'; this is why output paths get double-checked and never reuse input names.",
        },
        {
          type: "mcq",
          id: "py30_mcq_02",
          difficulty: "Easy",
          question: "Why use `with open(...) as f:` instead of f = open(...)?",
          options: [
            "It's faster",
            "The file is guaranteed to close when the block exits — success, return, or exception — flushing writes and freeing the handle",
            "It reads the whole file automatically",
            "It creates missing directories",
          ],
          correctIndex: 1,
          explanation:
            "with is packaged try/finally: cleanup on every exit path. Manual close() is skipped the day an exception fires between open and close — leaked handles and unflushed writes follow.",
        },
        {
          type: "mcq",
          id: "py30_mcq_03",
          difficulty: "Medium",
          question:
            "You must count ERROR lines in a 25GB log on a laptop with 8GB RAM. Which approach works?",
          options: [
            "content = f.read(), then count",
            "lines = f.readlines(), then loop",
            "for line in f: — the file iterates lazily, one line in memory at a time",
            "Impossible without more RAM",
          ],
          correctIndex: 2,
          explanation:
            "File iteration streams: each loop cycle holds one line, so file size is irrelevant to memory. read() and readlines() both materialize all 25GB — instant memory death.",
        },
        {
          type: "scenario",
          id: "py30_sc_01",
          difficulty: "Medium",
          scenario:
            "A script works on the dev Mac but on the Windows server prints 'SÃ£o Paulo' instead of 'São Paulo' when reading the same CSV.",
          question: "What's the likely cause and fix?",
          options: [
            "Windows can't display accents",
            "The file is UTF-8 but open() used each OS's default encoding (cp1252 on the server) — pass encoding='utf-8' explicitly everywhere",
            "The CSV is corrupt",
            "Python versions differ",
          ],
          correctIndex: 1,
          explanation:
            "Omitted encoding = platform-dependent behavior: the UTF-8 bytes for 'ã' decode as two cp1252 characters ('Ã£'). Mojibake with that à pattern is the classic signature. Explicit encoding makes scripts portable.",
        },
        {
          type: "coding",
          id: "py30_code_01",
          difficulty: "Medium",
          prompt:
            "Write 'alpha\\nbeta\\ngamma\\n' to words.txt, then read it line by line and print each word uppercased with its length, as '<WORD> (<len>)'. Expected:\nALPHA (5)\nBETA (4)\nGAMMA (5)",
          starterCode: "# Your code here\n",
          solutionCode:
            "with open('words.txt', 'w', encoding='utf-8') as f:\n    f.write('alpha\\nbeta\\ngamma\\n')\n\nwith open('words.txt', 'r', encoding='utf-8') as f:\n    for line in f:\n        word = line.strip()\n        print(f'{word.upper()} ({len(word)})')",
          expectedOutput: "ALPHA (5)\nBETA (4)\nGAMMA (5)",
          tests: [
            {
              name: "Strip before measuring",
              description: "len uses the stripped word — 'alpha\\n' is 6 unstripped",
            },
            {
              name: "Two with blocks",
              description: "Write and read are separate, each auto-closing",
            },
          ],
        },
        {
          type: "mcq",
          id: "py30_mcq_04",
          difficulty: "Hard",
          question:
            "def get_file(): with open('data.txt') as f: return f — a caller then does file.read(). What happens?",
          options: [
            "Works normally",
            "ValueError: I/O operation on closed file — the with closed the handle as return exited the block; return the DATA (f.read()), not the handle",
            "The file reopens automatically",
            "Deadlock",
          ],
          correctIndex: 1,
          explanation:
            "return exits the with block, and exit means close — that's the whole guarantee. The handle escapes but arrives dead. Correct designs return content, or accept a function to run inside the block.",
        },
        {
          type: "coding",
          id: "py30_code_02",
          difficulty: "Hard",
          prompt:
            "grades.csv contains 'name,score\\nada,95\\nkai,not-found\\nmia,88\\n' (write it first). Read it, skipping the header; parse scores with try/except (collect failures by name); append — mode 'a' — a line 'checked <n> rows' to the SAME file. Print the parsed pairs, the failures list, then re-read and print the file's last line. Expected:\n[('ada', 95), ('mia', 88)]\n['kai']\nchecked 3 rows",
          starterCode: "# Your code here\n",
          solutionCode:
            "with open('grades.csv', 'w', encoding='utf-8') as f:\n    f.write('name,score\\nada,95\\nkai,not-found\\nmia,88\\n')\n\nparsed, failures = [], []\nrows = 0\nwith open('grades.csv', 'r', encoding='utf-8') as f:\n    next(f)\n    for line in f:\n        rows += 1\n        name, raw = line.strip().split(',')\n        try:\n            parsed.append((name, int(raw)))\n        except ValueError:\n            failures.append(name)\n\nwith open('grades.csv', 'a', encoding='utf-8') as f:\n    f.write(f'checked {rows} rows\\n')\n\nprint(parsed)\nprint(failures)\nwith open('grades.csv', 'r', encoding='utf-8') as f:\n    print(f.read().strip().split('\\n')[-1])",
          expectedOutput: "[('ada', 95), ('mia', 88)]\n['kai']\nchecked 3 rows",
          tests: [
            {
              name: "Append preserves content",
              description: "Mode 'a' adds the footer without erasing the data rows",
            },
            {
              name: "Typed failure routing",
              description: "ValueError catches 'not-found'; the name lands in failures",
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
            "Why is the with statement the standard way to work with files? What exactly does it guarantee — and not?",
          answer:
            "with open(...) as f: enters a context manager: __enter__ yields the handle, and __exit__ — guaranteed to run on EVERY exit path (normal completion, return/break, or an exception unwinding through) — closes the file, flushing buffered writes to disk and releasing the OS handle. It's the try/finally cleanup pattern packaged into syntax, which matters because the manual version fails in exactly the case that matters: an exception between open() and close() leaks the handle and can lose buffered data. What it does NOT do: it doesn't suppress exceptions (they propagate after the close — you still need try/except for FileNotFoundError on optional files), and it doesn't keep the handle alive beyond the block — returning f from inside a with hands the caller a closed file (ValueError: I/O operation on closed file); you return the DATA instead. The dunder connection is worth naming in interviews: with works on anything implementing __enter__/__exit__ — files, locks, database transactions — the same protocol thinking as __len__ and __getitem__.",
        },
        {
          question:
            "How do you process a file far larger than memory, and which habits follow from that constraint?",
          answer:
            "Stream it: for line in f: iterates lazily, reading one line at a time — memory use is bounded by the longest line, not the file, so a 40GB log processes on a laptop. The habits that follow: aggregate incrementally (running totals, counting dicts) instead of collecting all rows and post-processing; write output incrementally too, rather than building a giant string; and design per-line error handling (try inside the loop, skip-and-count) since a single corrupt line mustn't kill hour six of a pass. The functions to treat with suspicion are read() and readlines() — both materialize the entire file, fine for configs and small data, fatal at scale; sum-of-generator patterns (sum(float(l) for l in f)) keep even the intermediate list from existing. This streaming posture transfers directly upward: pandas' chunksize parameter, database cursors, and generator pipelines are the same idea with different spelling — and 'how would you count errors in a 25GB log on an 8GB machine?' is a stock screening question aimed precisely at whether you reach for read().",
        },
        {
          question:
            "A CSV read is producing garbled characters (mojibake). Walk me through your diagnosis.",
          answer:
            "Mojibake means the bytes were decoded with the wrong encoding — the file stores one interpretation, the reader assumed another. First, look at the damage pattern: 'Ã©' where 'é' belongs is the signature of UTF-8 bytes decoded as cp1252/latin-1 (each multi-byte UTF-8 character splits into two wrong-but-printable characters); a UnicodeDecodeError with 'invalid continuation byte' is the reverse — cp1252 content read as UTF-8. Second, identify the true source encoding: Excel exports and legacy Windows systems typically produce cp1252; most modern systems produce UTF-8; a BOM (bytes EF BB BF) suggests utf-8-sig. Tools like chardet, or reading the first KB in binary and inspecting, settle it. Third, fix by declaring the truth — open(path, encoding='cp1252') or the equivalent pd.read_csv(encoding=...) — and normalize to UTF-8 on write so the problem dies at your boundary. The habit that prevents the whole class: always pass encoding explicitly, because the default follows the local platform and creates works-on-my-machine bugs. errors='replace' exists for salvage jobs but is data loss by policy — name it as a last resort, never a fix.",
        },
      ],
    },

    {
      id: "common-mistakes",
      type: "callout",
      variant: "warning",
      title: "Common Mistakes to Avoid",
      content:
        "1) Mode 'w' on a file you meant to append to (or worse, on your input path) — instant truncation. 2) Skipping with — leaked handles, unflushed writes. 3) f.read() on huge files — stream with for line in f. 4) Forgetting lines keep their \\n — strip before comparing or measuring. 5) Omitting encoding= — platform-dependent mojibake. 6) Returning the file handle from inside a with — it arrives closed; return the data. 7) write() without \\n — everything lands on one line. 8) Hand-splitting CSVs with quoted commas — that's the csv module's job.",
    },

    {
      id: "ai-tutor",
      type: "callout",
      variant: "tip",
      title: "Ask the AI Tutor",
      content:
        "Try these prompts in the AI Tutor panel: • 'Quiz me: which mode for each of these six file tasks?' • 'Walk me through what with guarantees when an exception fires mid-read.' • 'Show mojibake: the same bytes under utf-8 vs cp1252.' • 'Help me refactor this read()-based script to stream.' • 'Interview mode: ask me the 25GB-log question and grade my answer.'",
    },

    {
      id: "glossary",
      type: "callout",
      variant: "info",
      title: "Glossary",
      content:
        "open(path, mode, encoding) — connect to a file. Mode 'r'/'w'/'a' — read / write-truncate / append ('b' suffix = binary). with — context manager; guarantees close on every exit. File handle — the OS connection object; a finite resource. Streaming — for line in f: one line in memory at a time. Truncate — 'w' zeroing an existing file at open. Flush — buffered writes reaching disk (close does it). Encoding — the bytes↔text interpretation; always name utf-8 explicitly. Mojibake — text decoded with the wrong encoding ('Ã©'). UnicodeDecodeError — bytes don't fit the claimed encoding. next(f) — consume one line (headers). CSV — comma-separated text; hand-split only when unquoted.",
    },

    {
      id: "resources",
      type: "callout",
      variant: "info",
      title: "Recommended Resources",
      content:
        "• Docs: 'Reading and Writing Files' in the Python tutorial (7.2), and the csv module intro for when hand-splitting stops sufficing. • Read: the Unicode HOWTO's first half — the bytes-vs-text model that ends encoding confusion permanently. • Practice: export any spreadsheet as CSV and write a streaming reader that aggregates one column, with skip-and-count on the rows that surprise you (some will). • Next in DSM: your file code still says 'C:\\\\data' or '/home/data' by hand — Working with Paths brings pathlib: portable, composable, glob-able paths, and the module that ends string-surgery on filenames.",
    },

    {
      id: "recap",
      type: "recap",
      tocLabel: "Recap",
      content:
        "✓ open(path, mode, encoding='utf-8') — 'r' reads, 'w' TRUNCATES, 'a' appends.\n✓ with guarantees closing on every exit path — non-negotiable; return data, not handles.\n✓ Files iterate lazily: for line in f handles any size; strip the \\n first.\n✓ CSV by hand: next(f) past the header, split(','), convert types, per-line try.\n✓ Always name the encoding — defaults vary by OS; mojibake means the claim was wrong.\n✓ Outputs get their own paths; logs use 'a'; report skips, never swallow them.\n\nNext up: Working with Paths. Hard-coded path strings break across machines and OSes — pathlib gives you portable path objects, existence checks, directory listing, and glob patterns: the last piece of file fluency.",
    },
  ],
};
