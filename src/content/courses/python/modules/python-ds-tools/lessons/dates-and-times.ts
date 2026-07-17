import type { Lesson } from "@/lib/curriculum/types";

export const datesAndTimes: Lesson = {
  meta: {
    id: "python.python-ds-tools.dates-and-times",
    slug: "dates-and-times",
    title: "Dates & Times with datetime",
    description:
      "Parse timestamps out of strings, do arithmetic with timedelta, format dates back out, and sidestep the timezone traps that corrupt time-series work.",
    estimatedTime: "30 mins",
    difficulty: "Intermediate",
    xpReward: 70,
    prerequisites: ["python.functions.defining-functions"],
    masteryThreshold: 80,
  },

  blocks: [
    {
      id: "intro",
      type: "lesson-intro",
      tocLabel: "Introduction",
      intro: {
        hook: "'03/04/2026' — March 4th or April 3rd? Your answer depends on which country's export you're reading, and guessing wrong silently shifts every event in the dataset by weeks. Dates are the most treacherous data type in the profession — and datetime is how Python tames them.",
        what: "The datetime module: date and datetime objects that make time computable, strptime to PARSE strings into them (you declare the format), strftime to FORMAT them back out, and timedelta for arithmetic — differences, offsets, and comparisons.",
        why: "Almost every real dataset has a time column: order timestamps, log lines, sensor readings, sign-up dates. As strings they can only be compared alphabetically (and '9/1' > '10/1' alphabetically!); as datetime objects they subtract, sort, bucket by month, and answer 'how long between?' correctly. Time handling is also where silent corruption loves to hide — format guesses and timezone mixups don't crash, they just shift your data.",
        whereUsed:
          "Cohort analysis, session durations, SLA calculations, log forensics, churn windows, feature engineering (day-of-week, days-since), and every pandas to_datetime call — which wraps exactly these concepts.",
        objectives: [
          "Build datetime objects and read their parts (.year, .month, .weekday())",
          "Parse timestamp strings with strptime and an explicit format",
          "Format datetimes for humans and filenames with strftime",
          "Compute durations and offsets with timedelta",
          "Recognize the ISO 8601 standard and the naive-vs-aware timezone split",
        ],
        realWorldApps: [
          {
            company: "Uber",
            headline: "Trip duration is a subtraction",
            detail:
              "Every fare starts with dropoff_time - pickup_time — a timedelta. Surge pricing buckets those trips by hour-of-day and weekday, both single attribute reads once the timestamp is parsed.",
          },
          {
            company: "Cloudflare",
            headline: "Log forensics across timezones",
            detail:
              "Incident timelines splice logs from servers worldwide; that only works because everything is stored in UTC and converted for display — the aware-datetime discipline this lesson introduces.",
          },
          {
            company: "Shopify",
            headline: "Cohorts and retention windows",
            detail:
              "'Customers acquired in March who reordered within 30 days' is strptime on signup dates, a timedelta(days=30) window, and comparisons — this lesson's toolkit verbatim.",
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
            "from datetime import date, datetime, timedelta. A date is a calendar day (2026, 7, 16); a datetime adds a time of day. Both are real objects with named parts — .year, .month, .day, .hour — plus derived answers like .weekday() (Monday=0). They compare correctly (dt1 < dt2), sort correctly, and subtract into timedeltas. The moment a timestamp becomes a datetime object, the whole standard library of time reasoning opens up.",
        },
        {
          type: "code-note",
          code: "from datetime import datetime\n\nlaunch = datetime(2026, 7, 16, 14, 30)\nprint(launch.year, launch.month, launch.day)   # 2026 7 16\nprint(launch.hour, launch.minute)              # 14 30\nprint(launch.weekday())                        # 3  (Mon=0 ... Thu=3)\nprint(launch.date())                           # 2026-07-16",
          content:
            "Constructor order is big-to-small: year, month, day, hour, minute, second. .weekday() returns Monday=0 through Sunday=6 (its sibling .isoweekday() is Monday=1). .date() drops the time part — handy for grouping events by day. datetime.now() gives the current moment.",
        },
        {
          type: "keypoint",
          title: "strptime: string → datetime (you declare the format)",
          content:
            "datetime.strptime('2026-07-16 14:30', '%Y-%m-%d %H:%M') parses by matching the string against YOUR format declaration: %Y four-digit year, %m month, %d day, %H hour (24h), %M minute, %S second. Mnemonic: strPtime Parses. The format string is a feature, not a chore — it makes the '03/04/2026' ambiguity impossible because YOU state whether it's %m/%d/%Y or %d/%m/%Y. A mismatch raises ValueError — which the error-handling module taught you to catch per-row.",
        },
        {
          type: "code-note",
          code: "from datetime import datetime\n\nus = datetime.strptime('03/04/2026', '%m/%d/%Y')\neu = datetime.strptime('03/04/2026', '%d/%m/%Y')\nprint(us)   # 2026-03-04 00:00:00  (March 4)\nprint(eu)   # 2026-04-03 00:00:00  (April 3)\n\niso = datetime.strptime('2026-07-16T14:30:00', '%Y-%m-%dT%H:%M:%S')\nprint(iso)  # 2026-07-16 14:30:00",
          content:
            "The same string, two formats, two different days — the ambiguity made explicit and therefore safe. The third parse is ISO 8601 (year-month-day, T separator), the international standard: unambiguous, and it even sorts correctly AS A STRING. datetime.fromisoformat('2026-07-16T14:30:00') is the shortcut for exactly that shape.",
        },
        {
          type: "keypoint",
          title: "strftime: datetime → string (same codes, reversed direction)",
          content:
            "dt.strftime('%Y-%m-%d') renders a datetime using the identical format codes: strFtime Formats. Beyond the numeric codes: %A full weekday name, %a short, %B full month name, %b short. Two habits: human-facing output can be pretty ('%B %d, %Y' → July 16, 2026), but filenames and logs should be ISO-ish ('%Y-%m-%d') — because ISO strings sort chronologically even when sorted alphabetically, which is why data lakes are full of report_2026-07-16.csv and never report_16-7-26.csv.",
        },
        {
          type: "code-note",
          code: "from datetime import datetime, timedelta\n\nstart = datetime(2026, 7, 1, 9, 0)\nend = datetime(2026, 7, 16, 14, 30)\n\ngap = end - start                 # timedelta\nprint(gap)                        # 15 days, 5:30:00\nprint(gap.days)                   # 15\nprint(gap.total_seconds())        # 1315800.0\n\ndeadline = start + timedelta(days=30)\nprint(deadline)                   # 2026-07-31 09:00:00",
          content:
            "Subtracting datetimes yields a timedelta; adding a timedelta to a datetime yields a new datetime. Mind the two accessors: .days is just the day COMPONENT (truncated), while .total_seconds() is the full duration — for 'how many hours?' use total_seconds()/3600, not .days*24. timedelta accepts days, hours, minutes, seconds, weeks.",
        },
        {
          type: "analogy",
          title: "Timestamps are coordinates, strings are postcards",
          content:
            "A datetime object is a GPS coordinate for time — exact, computable, comparable; you can measure the distance between two of them (timedelta) or move from one by an offset. A date STRING is a postcard describing a place: lovely for humans, but written in a local dialect ('03/04' means different things in different countries) and useless for measurement until geocoded. strptime is the geocoder (declare the dialect, get coordinates); strftime writes a new postcard in whatever dialect the reader needs. Analytics happens in coordinates; presentation happens in postcards — never do math on the postcard.",
        },
        {
          type: "expandable",
          title: "Timezones: naive vs aware, and the UTC rule",
          content:
            "Everything above created NAIVE datetimes — no timezone attached; fine when all data shares one implicit zone. An AWARE datetime carries its offset: datetime(2026, 7, 16, 14, 30, tzinfo=timezone.utc), and datetime.now(timezone.utc) gives the current UTC moment. Python refuses to mix them — naive minus aware raises TypeError, a guardrail, not an annoyance. The zoneinfo module (Python 3.9+) supplies real zones: ZoneInfo('America/New_York'), and .astimezone() converts between them correctly, DST included. The professional rule is one sentence: STORE AND COMPUTE IN UTC, CONVERT AT THE EDGES for display. Every log-splicing horror story — duplicated hours at DST fallback, servers in mixed zones, 'why is this event before its cause?' — traces to violating it.",
        },
        {
          type: "warning",
          title: "Where time data silently corrupts",
          content:
            "1) Parsing with a guessed format: %d/%m vs %m/%d succeeds on ambiguous strings and shifts events — confirm the format from the data source, and test with a day > 12 which makes the wrong guess ERROR instead of lie. 2) Sorting date strings: '9/1/2026' > '10/1/2026' alphabetically — parse first, or use ISO strings. 3) gap.days on durations under a day is 0 — use total_seconds(). 4) Mixing naive and aware datetimes — pick one regime per pipeline (UTC-aware for anything multi-source). 5) Doing month arithmetic with timedelta(days=30) — months vary in length; that's an approximation you must own (or reach for dateutil/pandas offsets).",
        },
      ],
    },

    {
      id: "diagram",
      type: "interactive-diagram",
      tocLabel: "Visual Learning",
      visual: {
        kind: "architecture",
        title: "The time-data round trip",
        caption:
          "Strings become objects, objects compute, results become strings again. Click each stage.",
        nodes: [
          {
            id: "raw",
            label: "'16/07/2026 14:30'",
            sublabel: "raw string",
            detail:
              "As a string this can only be compared alphabetically — which for most formats is chronologically WRONG. Every dataset delivers time this way: CSV columns, log lines, API fields.",
            x: 15,
            y: 15,
            accent: false,
          },
          {
            id: "strptime",
            label: "strptime",
            sublabel: "'%d/%m/%Y %H:%M'",
            detail:
              "Parses by matching against YOUR declared format — strPtime Parses. The declaration kills ambiguity: this string is July 16th because you said %d/%m. Mismatches raise ValueError, so corrupt rows surface instead of shifting.",
            x: 50,
            y: 15,
            accent: true,
          },
          {
            id: "obj",
            label: "datetime object",
            sublabel: "computable time",
            detail:
              "Named parts (.year, .weekday()), correct comparisons and sorting, and arithmetic. This is the coordinate system where all time logic runs.",
            x: 85,
            y: 15,
            accent: false,
          },
          {
            id: "math",
            label: "timedelta math",
            sublabel: "- , + , compare",
            detail:
              "end - start → timedelta (use .total_seconds() for sub-day durations!). dt + timedelta(days=30) → deadline. dt1 < dt2 → chronology. The payoff for parsing.",
            x: 85,
            y: 62,
            accent: false,
          },
          {
            id: "strftime",
            label: "strftime",
            sublabel: "'%Y-%m-%d'",
            detail:
              "Formats back to text — strFtime Formats. Same codes, reverse direction. ISO for filenames and logs (sorts correctly as text); pretty forms (%B %d, %Y) for humans.",
            x: 50,
            y: 62,
            accent: false,
          },
          {
            id: "out",
            label: "'2026-07-16'",
            sublabel: "output string",
            detail:
              "Presentation, storage, filenames. The rule of the round trip: parse once at ingestion, compute as objects, format once at the exit. Math on strings is never allowed in between.",
            x: 15,
            y: 62,
            accent: false,
          },
        ],
        edges: [
          { from: "raw", to: "strptime", label: "declare format" },
          { from: "strptime", to: "obj" },
          { from: "obj", to: "math", label: "compute" },
          { from: "math", to: "strftime", label: "present" },
          { from: "strftime", to: "out" },
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
          title: "Build, inspect, compare",
          scenario: "Two order timestamps — which came first, and when?",
          steps: [
            {
              code: "from datetime import datetime\n\na = datetime(2026, 7, 16, 9, 15)\nb = datetime(2026, 7, 16, 14, 30)\nprint(a < b)\nprint(a.strftime('%A'), '-', a.hour, 'h')",
              explanation:
                "Objects compare chronologically — no string tricks. strftime('%A') names the weekday; .hour reads a part directly. July 16, 2026 is a Thursday.",
            },
          ],
          output: "True\nThursday - 9 h",
        },
        {
          difficulty: "Easy",
          title: "Parse two formats safely",
          scenario:
            "A US export and an EU export deliver the same date shaped differently — declare each format explicitly.",
          steps: [
            {
              code: "from datetime import datetime\n\nus_raw = '07/16/2026'\neu_raw = '16.07.2026'\n\nus = datetime.strptime(us_raw, '%m/%d/%Y')\neu = datetime.strptime(eu_raw, '%d.%m.%Y')\nprint(us.date(), eu.date())\nprint(us == eu)",
              explanation:
                "Each source gets ITS OWN format string — the declaration is per-source knowledge, not a guess. Both parse to the identical day, proving the objects (not the string shapes) are what matter downstream.",
            },
          ],
          output: "2026-07-16 2026-07-16\nTrue",
        },
        {
          difficulty: "Medium",
          title: "Session durations from log strings",
          scenario:
            "Login/logout pairs arrive as ISO strings; the product team wants each session's minutes and the average.",
          steps: [
            {
              code: "from datetime import datetime\n\nsessions = [\n    ('2026-07-16T09:00:00', '2026-07-16T09:47:30'),\n    ('2026-07-16T11:20:00', '2026-07-16T11:35:00'),\n    ('2026-07-16T13:05:00', '2026-07-16T14:20:00'),\n]\nfmt = '%Y-%m-%dT%H:%M:%S'",
              explanation:
                "ISO timestamps with the T separator — the shape APIs and logs actually emit. One fmt constant serves every row; datetime.fromisoformat would also work for this standard shape.",
            },
            {
              code: "minutes = []\nfor start_s, end_s in sessions:\n    start = datetime.strptime(start_s, fmt)\n    end = datetime.strptime(end_s, fmt)\n    minutes.append((end - start).total_seconds() / 60)\n\nfor m in minutes:\n    print(f'{m:.1f} min')\nprint(f'avg {sum(minutes) / len(minutes):.1f} min')",
              explanation:
                "Parse both ends, subtract into a timedelta, convert via total_seconds()/60. NOT .days (all zeros here) and not .seconds alone — total_seconds is the only accessor that means 'the whole duration'. Tuple unpacking in the for is the data-structures module paying rent.",
            },
          ],
          output: "47.5 min\n15.0 min\n75.0 min\navg 45.8 min",
        },
        {
          difficulty: "Hard",
          title: "Overdue invoices with a grace window",
          scenario:
            "Invoices carry issue dates; terms are 30 days plus a 5-day grace period. Flag what's overdue as of a fixed 'today' — the deadline pattern behind every SLA and churn window.",
          steps: [
            {
              code: "from datetime import datetime, timedelta\n\ntoday = datetime(2026, 7, 16)\nterms = timedelta(days=30)\ngrace = timedelta(days=5)\n\ninvoices = [\n    ('INV-01', '2026-05-28'),\n    ('INV-02', '2026-06-20'),\n    ('INV-03', '2026-07-10'),\n]",
              explanation:
                "'today' is pinned, not datetime.now() — reproducible runs and testable code (the same discipline as seeding randomness). The windows are named timedeltas: the business rule reads directly in the code.",
            },
            {
              code: "for inv_id, issued_s in invoices:\n    issued = datetime.strptime(issued_s, '%Y-%m-%d')\n    deadline = issued + terms + grace\n    if today > deadline:\n        days_over = (today - deadline).days\n        print(f'{inv_id}: OVERDUE by {days_over} days')\n    else:\n        left = (deadline - today).days\n        print(f'{inv_id}: ok, {left} days left')",
              explanation:
                "Parse → add offsets → compare → subtract for the report number. Timedeltas chain with + like the durations they are. INV-01 (issued May 28, deadline July 2) is 14 days over; the others still breathe. Whole-day granularity makes .days correct here.",
            },
          ],
          output:
            "INV-01: OVERDUE by 14 days\nINV-02: ok, 9 days left\nINV-03: ok, 29 days left",
        },
        {
          difficulty: "Industry Example",
          title: "Hourly traffic report from mixed-format logs",
          scenario:
            "Two upstream systems log the same events in different formats; the analytics job must parse both, skip corrupt lines (with a count), bucket events by hour, and write a dated report name — parsing, error handling, dict counting, and strftime in one pipeline.",
          steps: [
            {
              code: "from datetime import datetime\n\nlines = [\n    ('A', '2026-07-16 09:12:44'),\n    ('B', '16/07/2026 09:58:03'),\n    ('A', '2026-07-16 10:07:19'),\n    ('B', 'not-a-timestamp'),\n    ('A', '2026-07-16 10:44:52'),\n]\nformats = {'A': '%Y-%m-%d %H:%M:%S', 'B': '%d/%m/%Y %H:%M:%S'}",
              explanation:
                "Each SOURCE declares its format in a dict — the multi-format reality of merged logs, handled by lookup instead of guessing. Line 4 is the corruption every real feed contains.",
            },
            {
              code: "by_hour = {}\nskipped = 0\nfor source, raw in lines:\n    try:\n        dt = datetime.strptime(raw, formats[source])\n    except ValueError:\n        skipped += 1\n        continue\n    key = dt.strftime('%H:00')\n    by_hour[key] = by_hour.get(key, 0) + 1\n\nfor hour in sorted(by_hour):\n    print(f'{hour} -> {by_hour[hour]} events')\nprint(f'skipped: {skipped}')",
              explanation:
                "The per-row try/except is skip-and-count from the error-handling module — ValueError means THIS line is corrupt, not the job. strftime('%H:00') makes the hour bucket a clean label, and .get(key, 0) + 1 is the counting idiom from dictionaries.",
            },
            {
              code: "run_day = datetime(2026, 7, 16)\nreport_name = f\"traffic_{run_day.strftime('%Y-%m-%d')}.csv\"\nprint(f'would write: {report_name}')",
              explanation:
                "The output filename is ISO-formatted — alphabetical order IS chronological order, so the report folder self-organizes. This is the strftime habit that shows up in every data lake you'll ever browse.",
            },
          ],
          output:
            "09:00 -> 2 events\n10:00 -> 2 events\nskipped: 1\nwould write: traffic_2026-07-16.csv",
        },
      ],
    },

    {
      id: "inline-practice",
      type: "inline-code",
      tocLabel: "Practice Coding",
      coding: {
        language: "python",
        filename: "delivery_tracker.py",
        instructions:
          "Orders arrive as (order_id, 'DD/MM/YYYY') tuples with a 7-day delivery promise. Parse each date (%d/%m/%Y), compute the promised delivery date (+7 days), and against today = 2026-07-16 print '<id>: LATE by <n> days' or '<id>: on track (<n> days left)'. Finish with 'late orders: <count>'.",
        starterCode: `from datetime import datetime, timedelta

today = datetime(2026, 7, 16)
orders = [
    ('ORD-1', '05/07/2026'),
    ('ORD-2', '12/07/2026'),
    ('ORD-3', '14/07/2026'),
]

# TODO 1: promise window = timedelta of 7 days
promise = ___

late_count = 0
for order_id, raw in orders:
    # TODO 2: parse raw with the %d/%m/%Y format
    ordered = ___
    # TODO 3: promised date = ordered + promise
    due = ___
    # TODO 4: compare with today; print LATE by n / on track (n days left)
    ___

print(f'late orders: {late_count}')`,
        solutionCode: `from datetime import datetime, timedelta

today = datetime(2026, 7, 16)
orders = [
    ('ORD-1', '05/07/2026'),
    ('ORD-2', '12/07/2026'),
    ('ORD-3', '14/07/2026'),
]

promise = timedelta(days=7)

late_count = 0
for order_id, raw in orders:
    ordered = datetime.strptime(raw, '%d/%m/%Y')
    due = ordered + promise
    if today > due:
        days_late = (today - due).days
        print(f'{order_id}: LATE by {days_late} days')
        late_count += 1
    else:
        days_left = (due - today).days
        print(f'{order_id}: on track ({days_left} days left)')

print(f'late orders: {late_count}')`,
        expectedOutput:
          "ORD-1: LATE by 4 days\nORD-2: on track (3 days left)\nORD-3: on track (5 days left)\nlate orders: 1",
        hints: [
          "timedelta(days=7) is the promise window",
          "The format for '05/07/2026' is '%d/%m/%Y' — day first, EU style",
          "due = ordered + promise; datetimes and timedeltas add directly",
          "(today - due).days when late; (due - today).days when not — subtraction order matters",
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
          id: "py34_mcq_01",
          difficulty: "Easy",
          question: "Which direction does each function go?",
          options: [
            "strptime formats, strftime parses",
            "strptime Parses string → datetime; strftime Formats datetime → string",
            "Both parse",
            "Both format",
          ],
          correctIndex: 1,
          explanation:
            "The mnemonic is in the letter: strPtime Parses, strFtime Formats. Same format codes, opposite directions.",
        },
        {
          type: "mcq",
          id: "py34_mcq_02",
          difficulty: "Easy",
          question: "What does datetime(2026, 7, 16) - datetime(2026, 7, 1) return?",
          options: [
            "15 (an int)",
            "A timedelta of 15 days",
            "A new datetime",
            "TypeError",
          ],
          correctIndex: 1,
          explanation:
            "datetime minus datetime is a timedelta — a duration with .days and .total_seconds(). Adding a timedelta back to a datetime gives a new datetime.",
        },
        {
          type: "mcq",
          id: "py34_mcq_03",
          difficulty: "Medium",
          question:
            "A session lasted 2 hours 30 minutes. gap = end - start; gap.days is 0. Why, and what's the right accessor for hours?",
          options: [
            "The subtraction failed",
            ".days is only the whole-day component — under 24h it's 0; use gap.total_seconds() / 3600 for the true duration in hours",
            "Use gap.hours",
            ".days rounds down to weeks",
          ],
          correctIndex: 1,
          explanation:
            "timedelta has no .hours attribute at all — .days, .seconds, .microseconds are COMPONENTS, not conversions. total_seconds() is the whole duration; divide for the unit you need.",
        },
        {
          type: "scenario",
          id: "py34_sc_01",
          difficulty: "Medium",
          scenario:
            "An analyst sorts a report by its string date column ('M/D/YYYY' values like '9/1/2026', '10/1/2026', '11/1/2026') and presents 'the last event of the year'. October and November appear BEFORE September in their sorted output.",
          question: "What happened?",
          options: [
            "The data was corrupted on export",
            "Strings sort alphabetically: '10/...' and '11/...' order before '9/...' because '1' < '9' as characters. Dates must be parsed to datetime (or stored ISO) before sorting means chronology",
            "sort() is unstable for dates",
            "The year field confused the sort",
          ],
          correctIndex: 1,
          explanation:
            "Alphabetical vs chronological is THE classic date-string bug — no error, confidently wrong order. Parse first, or use ISO 8601 strings, whose alphabetical order matches chronological order by design.",
        },
        {
          type: "coding",
          id: "py34_code_01",
          difficulty: "Medium",
          prompt:
            "Parse stamps = ['2026-07-14', '2026-07-02', '2026-07-16'] (%Y-%m-%d), then print the earliest and latest as '<weekday name> YYYY-MM-DD'. Expected:\nearliest: Thursday 2026-07-02\nlatest: Thursday 2026-07-16",
          starterCode:
            "from datetime import datetime\nstamps = ['2026-07-14', '2026-07-02', '2026-07-16']\n# Your code here\n",
          solutionCode:
            "from datetime import datetime\nstamps = ['2026-07-14', '2026-07-02', '2026-07-16']\ndates = [datetime.strptime(s, '%Y-%m-%d') for s in stamps]\nearliest = min(dates)\nlatest = max(dates)\nprint(f\"earliest: {earliest.strftime('%A %Y-%m-%d')}\")\nprint(f\"latest: {latest.strftime('%A %Y-%m-%d')}\")",
          expectedOutput:
            "earliest: Thursday 2026-07-02\nlatest: Thursday 2026-07-16",
          tests: [
            {
              name: "Parse before compare",
              description: "Strings are parsed to datetimes; min/max run on objects",
            },
            {
              name: "strftime output",
              description: "Output combines %A with the ISO date",
            },
          ],
        },
        {
          type: "mcq",
          id: "py34_mcq_04",
          difficulty: "Hard",
          question:
            "A pipeline merges event logs from servers in three countries and computes event ordering from naive local timestamps. What's the professional fix?",
          options: [
            "Sort by server name first",
            "Add an hour to everything",
            "Store and compare aware UTC datetimes; convert to local zones only at display — naive local times from different zones are not comparable, and Python's TypeError on naive-vs-aware mixing is the guardrail saying so",
            "Use strings instead",
          ],
          correctIndex: 2,
          explanation:
            "09:00 in Tokyo precedes 09:00 in London by hours; naive timestamps erase that. UTC in storage and computation, local at the edges — the one-sentence rule that prevents the whole bug class.",
        },
        {
          type: "coding",
          id: "py34_code_02",
          difficulty: "Hard",
          prompt:
            "events = [('deploy', '16/07/2026 09:15'), ('alert', '16/07/2026 11:45'), ('bad', 'oops'), ('fix', '16/07/2026 12:30')]. Parse with '%d/%m/%Y %H:%M', skipping unparseable rows with a per-row try/except (count them). Print each good event as '<name> at <HH:MM>', then minutes between first and last good event, then the skip count. Expected:\ndeploy at 09:15\nalert at 11:45\nfix at 12:30\nspan: 195.0 minutes\nskipped: 1",
          starterCode:
            "from datetime import datetime\nevents = [('deploy', '16/07/2026 09:15'), ('alert', '16/07/2026 11:45'), ('bad', 'oops'), ('fix', '16/07/2026 12:30')]\n# Your code here\n",
          solutionCode:
            "from datetime import datetime\nevents = [('deploy', '16/07/2026 09:15'), ('alert', '16/07/2026 11:45'), ('bad', 'oops'), ('fix', '16/07/2026 12:30')]\n\nparsed = []\nskipped = 0\nfor name, raw in events:\n    try:\n        dt = datetime.strptime(raw, '%d/%m/%Y %H:%M')\n    except ValueError:\n        skipped += 1\n        continue\n    parsed.append((name, dt))\n    print(f\"{name} at {dt.strftime('%H:%M')}\")\n\nspan = (parsed[-1][1] - parsed[0][1]).total_seconds() / 60\nprint(f'span: {span} minutes')\nprint(f'skipped: {skipped}')",
          expectedOutput:
            "deploy at 09:15\nalert at 11:45\nfix at 12:30\nspan: 195.0 minutes\nskipped: 1",
          tests: [
            {
              name: "Guarded parsing",
              description: "try/except ValueError per row with a skip counter",
            },
            {
              name: "Duration math",
              description: "Span uses total_seconds()/60 on a datetime difference",
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
            "A CSV's date column contains values like '03/04/2026'. Walk through how you'd handle it safely.",
          answer:
            "First, establish the format from AUTHORITY, not inspection: the source system's docs, the exporting team, or the locale of the producing application — '03/04/2026' is March 4 in a US export and April 3 in a European one, and eyeballing samples can't settle it. Second, validate the claim against the data: scan for any value with the first segment > 12 (e.g. '25/04/2026') — its existence PROVES day-first; if the full column stays ≤ 12 in both positions, the data alone is genuinely ambiguous and the source must answer. Third, parse with the explicit format — datetime.strptime(value, '%m/%d/%Y') or '%d/%m/%Y' — never a permissive guesser, because a wrong guess doesn't error, it silently swaps months and days for a subset of rows, which is the worst possible failure mode: plausible, partial, and weeks-shifted. Fourth, wrap the parse in per-row try/except ValueError with skip-and-count so genuinely corrupt values surface as a reported number instead of killing the job. Finally, once parsed, write anything you re-emit as ISO 8601 (%Y-%m-%d) so the ambiguity dies at your stage instead of propagating. In pandas the same reasoning appears as pd.to_datetime(col, format='...') — always pass format for ambiguous data.",
        },
        {
          question:
            "Explain naive vs aware datetimes and the rule that keeps multi-source time data correct.",
          answer:
            "A naive datetime has no timezone attached — datetime(2026, 7, 16, 9, 0) is 'nine o'clock' with the zone implied by context. An aware datetime carries tzinfo — an explicit UTC offset (via timezone.utc or zoneinfo.ZoneInfo('America/New_York')) — making it an unambiguous instant. Python enforces the distinction: subtracting or comparing naive against aware raises TypeError, which is a feature — it's the language refusing to compute an answer that would be meaningless. Naive is acceptable when a dataset genuinely lives in one implicit zone (a single store's POS logs). The moment sources multiply — servers in different regions, mobile clients, third-party APIs — naive local times become incomparable: 09:00 Tokyo is hours before 09:00 London, but naive objects compare them equal-ish. The rule: STORE AND COMPUTE IN UTC, CONVERT AT THE EDGES — ingest by converting everything to aware UTC, do all arithmetic and ordering there, and call .astimezone(user_zone) only for display. DST is the sharpest reason: local wall-clock time repeats an hour every fall (01:30 happens twice) and skips one every spring, so durations computed in local time are wrong twice a year; UTC has no DST, so the math is always valid. zoneinfo handles the conversion rules, including DST, from the IANA database.",
        },
        {
          question:
            "How do you compute 'the same day next month', and why is timedelta the wrong tool?",
          answer:
            "timedelta measures FIXED durations — exact counts of days/seconds — and months aren't fixed: 28 to 31 days. date + timedelta(days=30) from January 31 gives March 2 (in a non-leap year), not 'end of February', and from July 15 gives August 14, not August 15. Calendar arithmetic needs calendar-aware logic. Options in order of preference: in pure Python, dateutil's relativedelta(months=1) handles it, clamping January 31 + 1 month to February 28/29; in pandas, pd.DateOffset(months=1) and period logic do the same; hand-rolled, you increment the month field yourself and clamp the day to that month's length (calendar.monthrange gives it) — doable but exactly the kind of edge-case code libraries exist to own. The interview-worthy insight is the distinction itself: durations (timedelta — physics time, always valid) versus calendar offsets (relativedelta/DateOffset — human time, needs rules). Billing cycles, 'monthly' cohorts, and anniversaries are calendar problems; SLAs measured in hours and session lengths are duration problems. Choosing the wrong category is why some subscriptions renew on the 2nd of March instead of the last day of February.",
        },
      ],
    },

    {
      id: "common-mistakes",
      type: "callout",
      variant: "warning",
      title: "Common Mistakes to Avoid",
      content:
        "1) Guessing %m/%d vs %d/%m — confirm from the source; a wrong guess shifts data silently. 2) Sorting or comparing date STRINGS — parse first (ISO strings are the lone exception). 3) gap.days for sub-day durations (it's 0) and gap.seconds for multi-day ones (it wraps) — total_seconds() is the duration. 4) timedelta(days=30) as 'one month' — months vary; use calendar-aware offsets. 5) Mixing naive and aware datetimes — one regime per pipeline, UTC-aware when sources vary. 6) datetime.now() inside analysis logic — pin 'today' for reproducibility, inject the clock. 7) Pretty formats in filenames — ISO %Y-%m-%d sorts; 'July 16' doesn't.",
    },

    {
      id: "ai-tutor",
      type: "callout",
      variant: "tip",
      title: "Ask the AI Tutor",
      content:
        "Try these prompts in the AI Tutor panel: • 'Flash-card me on format codes: show a timestamp, I write the strptime format.' • 'Give me five duration problems and check whether I reach for .days, .seconds, or total_seconds() correctly.' • 'Explain the DST fallback bug with a concrete log example.' • 'Design the date handling for a multi-region order pipeline with me.' • 'Interview mode: ask me the ambiguous-date-column question and grade my answer.'",
    },

    {
      id: "glossary",
      type: "callout",
      variant: "info",
      title: "Glossary",
      content:
        "datetime / date — computable timestamp / calendar day objects. strptime — Parse string → datetime against a declared format. strftime — Format datetime → string with the same codes. format codes — %Y year, %m month, %d day, %H hour (24h), %M minute, %S second, %A weekday name, %B month name. timedelta — a duration; supports + - and comparisons. total_seconds() — the full duration in seconds (vs the .days/.seconds COMPONENTS). ISO 8601 — YYYY-MM-DD(THH:MM:SS), the unambiguous standard that sorts as text. naive / aware — without / with timezone info. UTC — the zero-offset reference zone; store and compute here. zoneinfo — Python's IANA timezone database access. DST — daylight saving time, the reason local-time math fails twice a year.",
    },

    {
      id: "resources",
      type: "callout",
      variant: "info",
      title: "Recommended Resources",
      content:
        "• Docs: the datetime module page — bookmark the strftime/strptime format-code table; you'll consult it for years. • Read: the zoneinfo module intro for when timezones become real in your work. • Practice: parse the timestamps out of any log file on your machine and compute the gap between first and last line. • Next in DSM: dates conquered, the other messy string type awaits — Regex for Data: patterns, groups, findall, and extracting structure from free text.",
    },

    {
      id: "recap",
      type: "recap",
      tocLabel: "Recap",
      content:
        "✓ Parse once at ingestion (strptime + explicit format), compute as objects, format once at the exit (strftime).\n✓ strPtime Parses, strFtime Formats — same codes, opposite directions.\n✓ datetime - datetime = timedelta; use total_seconds() for durations, .days only for whole days.\n✓ Never guess %m/%d vs %d/%m — confirm from the source; never sort date strings (except ISO).\n✓ timedelta is fixed duration; months need calendar-aware offsets.\n✓ Multi-source time = aware UTC in storage and math, local zones only at display.\n\nNext up: Regex for Data. Timestamps were structured strings; now the unstructured ones — regular expressions for finding, extracting, and cleaning patterns buried in free text.",
    },
  ],
};
