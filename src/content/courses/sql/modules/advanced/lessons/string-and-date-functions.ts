import type { Lesson } from "@/lib/curriculum/types";

export const stringAndDateFunctions: Lesson = {
  meta: {
    id: "sql.advanced.string-and-date-functions",
    slug: "string-and-date-functions",
    title: "String & Date Functions",
    description:
      "Clean messy text with TRIM/LOWER/SPLIT, extract and truncate dates, and master the DATE_TRUNC bucketing behind every monthly trend report.",
    estimatedTime: "35 mins",
    difficulty: "Intermediate",
    xpReward: 70,
    prerequisites: ["sql.foundations.select-and-from"],
    masteryThreshold: 80,
  },

  blocks: [
    /* ---------------------------------------------------------------- */
    /*  1 — Introduction                                                 */
    /* ---------------------------------------------------------------- */
    {
      id: "intro",
      type: "lesson-intro",
      tocLabel: "Introduction",
      intro: {
        hook: "Two rows: ' Anna@GMAIL.com ' and 'anna@gmail.com'. Same customer? Your JOIN says no — trailing space, different case, zero matches. Half of real-world SQL isn't clever logic; it's scrubbing values until equal things are actually equal, and bucketing timestamps until 'March' means March.",
        what: "String functions transform text — case (LOWER/UPPER), whitespace (TRIM), slicing (SUBSTRING, SPLIT_PART), assembly (CONCAT, ||), and search (POSITION, REPLACE). Date functions do calendar math — CURRENT_DATE, intervals, AGE — and reshape granularity: EXTRACT pulls parts out, DATE_TRUNC rounds timestamps down to a period.",
        why: "Text keys join reports together and timestamps drive every trend line. Unnormalized text silently breaks joins, GROUP BYs, and dedup; naive date handling double-counts boundary days and shreds monthly rollups into per-second groups. These functions are how SQL analysts spend a large share of their week — fluency here is fluency, period.",
        whereUsed:
          "Email/ID normalization before joins, name parsing, URL and SKU dissection, cohort assignment by signup month, 'last 30 days' filters, and the GROUP BY DATE_TRUNC('month', …) at the heart of every revenue chart.",
        objectives: [
          "Normalize text with LOWER, TRIM, and REPLACE before comparing or joining",
          "Slice strings with SUBSTRING, LEFT/RIGHT, SPLIT_PART, and POSITION",
          "Assemble values with CONCAT / || and handle NULL's contagion in concatenation",
          "Do date arithmetic with intervals and compare dates half-open",
          "Bucket timestamps with DATE_TRUNC and extract parts with EXTRACT for reports",
        ],
        realWorldApps: [
          {
            company: "HubSpot",
            headline: "CRM contact deduplication",
            detail:
              "Contact matching normalizes emails (lowercase, trimmed, dots and plus-tags handled) before comparing — string functions are the first stage of every identity-resolution pipeline.",
          },
          {
            company: "Uber",
            headline: "Hourly demand curves",
            detail:
              "Trip timestamps are truncated to the hour and extracted by day-of-week to build the demand heatmaps that drive surge pricing and driver incentives.",
          },
          {
            company: "Shopify",
            headline: "UTM attribution parsing",
            detail:
              "Marketing dashboards split landing-page URLs on '?' and '&' with SPLIT_PART to recover utm_source and utm_campaign from raw traffic logs.",
          },
        ],
      },
    },

    /* ---------------------------------------------------------------- */
    /*  2 — Theory                                                       */
    /* ---------------------------------------------------------------- */
    {
      id: "theory",
      type: "theory-blocks",
      tocLabel: "Theory",
      blocks: [
        {
          type: "text",
          content:
            "Case and whitespace first, because they break equality: LOWER('Anna@GMAIL.com') → 'anna@gmail.com'; TRIM(' anna ') → 'anna' (LTRIM/RTRIM for one side). LENGTH counts characters — a quick data-quality probe: LENGTH(email) <> LENGTH(TRIM(email)) flags rows with sneaky padding. The normalization idiom before any text comparison or join: LOWER(TRIM(col)).",
        },
        {
          type: "analogy",
          title: "The laundry-before-sorting analogy",
          content:
            "Sorting socks works only after washing: dried mud makes identical socks look different. Text data arrives muddy — stray spaces, RaNdOm case, typo'd separators — and every comparison (JOIN, GROUP BY, DISTINCT, =) sorts by exact bytes. String functions are the wash cycle. Analysts who join first and wash later spend the afternoon wondering why half their customers 'disappeared'.",
        },
        {
          type: "code-note",
          code: "SELECT\n  SUBSTRING(sku FROM 1 FOR 3)      AS line_code,   -- 'ELC'\n  LEFT(sku, 3)                     AS line_code2,  -- same, shorter\n  SPLIT_PART(email, '@', 2)        AS domain,      -- 'gmail.com'\n  POSITION('@' IN email)           AS at_index      -- 5\nFROM customers;\n-- sku = 'ELC-4412-EU', email = 'anna@gmail.com'",
          content:
            "Slicing toolbox. SUBSTRING takes start/length (1-indexed!); LEFT/RIGHT grab edges; SPLIT_PART splits on a delimiter and returns the Nth piece — the workhorse for emails, URLs, and composite SKUs; POSITION finds where a substring sits (0 = absent). Dialect note: SPLIT_PART is PostgreSQL/Redshift/Snowflake; MySQL uses SUBSTRING_INDEX.",
        },
        {
          type: "keypoint",
          title: "Concatenation and NULL's contagion",
          content:
            "|| joins strings: first_name || ' ' || last_name. But NULL is contagious through ||: if middle_name is NULL the whole result is NULL — a report of vanished names. CONCAT(a, b, c) treats NULLs as empty strings instead, and COALESCE(col, '') inoculates any single piece. REPLACE(col, '-', '') strips characters (phone numbers, formatted IDs) — a normalization staple beside LOWER/TRIM.",
        },
        {
          type: "text",
          content:
            "Dates. CURRENT_DATE and NOW() anchor queries to today; arithmetic uses intervals: CURRENT_DATE - INTERVAL '30 days', or date subtraction yielding day counts (in PostgreSQL, date - date = integer days). AGE(a, b) gives calendar-aware differences ('2 years 3 mons'). Casting bridges types: '2026-07-01'::date, and ::date on a timestamp drops the time part — itself a truncation trick.",
        },
        {
          type: "keypoint",
          title: "DATE_TRUNC: the trend-report function",
          content:
            "DATE_TRUNC('month', created_at) rounds every timestamp down to its month's first instant — 2026-07-14 09:31:22 → 2026-07-01 00:00:00. Group by that and July's thousands of orders form ONE group. 'week', 'day', 'hour', 'quarter', 'year' work the same. This is the single most-used function in analytics SQL: every monthly revenue chart is GROUP BY DATE_TRUNC('month', …) wearing a suit. (MySQL lacks it: DATE_FORMAT(dt, '%Y-%m-01') is the idiom.)",
        },
        {
          type: "code-note",
          code: "SELECT\n  EXTRACT(YEAR  FROM created_at) AS yr,     -- 2026\n  EXTRACT(MONTH FROM created_at) AS mon,    -- 7\n  EXTRACT(DOW   FROM created_at) AS dow,    -- 0=Sunday (PG)\n  TO_CHAR(created_at, 'YYYY-MM') AS month_label,  -- '2026-07'\n  TO_CHAR(created_at, 'Day')     AS day_name      -- 'Tuesday'\nFROM orders;",
          content:
            "EXTRACT pulls one numeric field out — for cyclical questions ('which weekday sells most?') where all Julys across years should pool together. TO_CHAR formats for humans and labels. Choose deliberately: EXTRACT(MONTH …) merges 2025-07 with 2026-07; DATE_TRUNC('month', …) keeps them separate. One answers seasonality, the other answers trends.",
        },
        {
          type: "warning",
          title: "Half-open date ranges, always",
          content:
            "WHERE created_at BETWEEN '2026-07-01' AND '2026-07-31' silently loses almost all of July 31: the string coerces to midnight 00:00:00, so 31st 09:15 is out of range. The professional pattern is half-open: created_at >= '2026-07-01' AND created_at < '2026-08-01' — every July instant in, nothing double-counted at the boundary, and it works identically for days, months, and years. Reserve BETWEEN for pure DATE columns, and even then half-open habits never hurt.",
        },
        {
          type: "expandable",
          title: "Functions on columns can disable indexes",
          content:
            "WHERE LOWER(email) = 'anna@gmail.com' cannot use a plain index on email — the index stores raw values, not LOWER(value), so the engine scans everything. Same for WHERE DATE_TRUNC('month', created_at) = '2026-07-01'. Fixes: rewrite the date filter as a half-open RANGE on the raw column (created_at >= '2026-07-01' AND < '2026-08-01' — sargable, index-friendly), and for text either create an expression index ON customers (LOWER(email)) or normalize at write time into its own column. The full story arrives in Indexes & Optimization; for now, remember: filter raw columns with ranges when you can.",
        },
        {
          type: "expandable",
          title: "Timezones in one paragraph",
          content:
            "timestamp (without time zone) stores a wall-clock reading; timestamptz stores an absolute instant, converted to the session's timezone on display. Analytics bugs come from grouping global events by 'day' — whose day? A user event at 23:30 New York time is the NEXT day in UTC. Warehouses standardize on UTC storage and convert explicitly per report: DATE_TRUNC('day', created_at AT TIME ZONE 'America/New_York'). The rule: know which timezone your 'day' means, and write it down in the query.",
        },
      ],
    },

    /* ---------------------------------------------------------------- */
    /*  3 — Visual Learning                                              */
    /* ---------------------------------------------------------------- */
    {
      id: "diagram",
      type: "interactive-diagram",
      tocLabel: "Visual Learning",
      visual: {
        kind: "flow",
        title: "One Timestamp, Many Shapes",
        caption:
          "The same value — 2026-07-14 09:31:22 — transformed for different jobs. Click each node to see which question each shape answers.",
        nodes: [
          {
            id: "raw",
            label: "2026-07-14 09:31:22",
            sublabel: "raw timestamp",
            detail:
              "Maximum detail, minimum groupability — GROUP BY on raw timestamps makes nearly every row its own group. Filters on the RAW column with half-open ranges stay index-friendly; wrapping it in functions inside WHERE usually doesn't.",
            x: 10,
            y: 45,
            accent: true,
          },
          {
            id: "trunc",
            label: "DATE_TRUNC('month')",
            sublabel: "→ 2026-07-01 00:00:00",
            detail:
              "Rounds DOWN to the period start; type stays timestamp, so ordering and further math still work. GROUP BY this = monthly trend line. July 2025 and July 2026 remain distinct — this is the TREND shape.",
            x: 40,
            y: 12,
            accent: true,
          },
          {
            id: "extract",
            label: "EXTRACT(MONTH)",
            sublabel: "→ 7",
            detail:
              "Pulls one numeric part; all years' Julys pool together. GROUP BY this = seasonality profile ('do summers dip?'). Same function family answers day-of-week (DOW) and hour-of-day cycles. This is the SEASONALITY shape.",
            x: 40,
            y: 45,
            accent: false,
          },
          {
            id: "cast",
            label: "::date",
            sublabel: "→ 2026-07-14",
            detail:
              "Drops the time part — the quick way to daily granularity for display or joining against a calendar table. Equivalent to DATE_TRUNC('day', …) then casting; keeps the calendar date, loses the clock.",
            x: 40,
            y: 78,
            accent: false,
          },
          {
            id: "tochar",
            label: "TO_CHAR('YYYY-MM')",
            sublabel: "→ '2026-07'",
            detail:
              "Human-readable TEXT label. Great for report output, dangerous as a sort key in text form only when the format isn't zero-padded ISO — 'YYYY-MM' sorts correctly, 'Mon YYYY' doesn't. Format at the LAST step; compute on real date types before that.",
            x: 70,
            y: 12,
            accent: false,
          },
          {
            id: "usage",
            label: "GROUP BY / WHERE / labels",
            sublabel: "pick shape per job",
            detail:
              "Trend chart: GROUP BY the truncated value. Seasonality: GROUP BY the extracted part. Range filter: half-open comparison on the raw column. Display: TO_CHAR at the end. Mixing these up — e.g. filtering on TO_CHAR output — works but forfeits indexes and type safety.",
            x: 88,
            y: 55,
            accent: false,
          },
        ],
        edges: [
          { from: "raw", to: "trunc", label: "bucket" },
          { from: "raw", to: "extract", label: "take part" },
          { from: "raw", to: "cast", label: "drop time" },
          { from: "trunc", to: "tochar", label: "label" },
          { from: "trunc", to: "usage" },
          { from: "extract", to: "usage" },
        ],
      },
    },

    /* ---------------------------------------------------------------- */
    /*  4 — Worked Examples                                              */
    /* ---------------------------------------------------------------- */
    {
      id: "worked-examples",
      type: "worked-examples",
      tocLabel: "Worked Examples",
      examples: [
        {
          difficulty: "Very Easy",
          title: "Normalize before comparing",
          scenario:
            "Count how many customers use a Gmail address — in a table where emails arrive in every case and padding imaginable.",
          steps: [
            {
              code: "SELECT COUNT(*) AS gmail_users\nFROM customers\nWHERE LOWER(TRIM(email)) LIKE '%@gmail.com';",
              explanation:
                "TRIM strips the invisible spaces that defeat LIKE's end-anchor ('...com ' doesn't end with 'com'); LOWER folds 'Anna@GMAIL.com' to comparable form. The inside-out order — trim, then lower, then compare — is the standard wash cycle. Without it, this count silently undercounts.",
            },
          ],
          output: " gmail_users\n-------------\n         418\n(1 row)",
        },
        {
          difficulty: "Easy",
          title: "Splitting composite values",
          scenario:
            "SKUs encode line-code, item, and region: 'ELC-4412-EU'. Product wants them as separate columns.",
          steps: [
            {
              code: "SELECT\n  sku,\n  SPLIT_PART(sku, '-', 1) AS line_code,\n  SPLIT_PART(sku, '-', 2) AS item_number,\n  SPLIT_PART(sku, '-', 3) AS region\nFROM products;",
              explanation:
                "SPLIT_PART(value, delimiter, n) returns the nth piece — one call per field, readable and order-safe. If a SKU has no third segment, SPLIT_PART returns an empty string (not NULL, not an error) — worth knowing before you COUNT on the region column. For irregular formats, regex functions take over; for regular delimited data, SPLIT_PART is cleaner.",
            },
          ],
          output:
            " sku          | line_code | item_number | region\n--------------+-----------+-------------+--------\n ELC-4412-EU  | ELC       | 4412        | EU\n AUD-0917-US  | AUD       | 0917        | US\n(2 rows)",
        },
        {
          difficulty: "Medium",
          title: "The monthly revenue trend",
          scenario:
            "The chart every company runs: revenue per month for the current year, shipped orders only.",
          steps: [
            {
              code: "SELECT\n  DATE_TRUNC('month', created_at) AS month,\n  SUM(amount) AS revenue\nFROM orders\nWHERE status = 'shipped'\n  AND created_at >= '2026-01-01'\n  AND created_at <  '2027-01-01'",
              explanation:
                "The year filter is half-open on the RAW column — index-friendly and boundary-exact (every instant of Dec 31 included, nothing of Jan 1 next year). The truncation lives in SELECT/GROUP BY where it belongs, not in WHERE.",
            },
            {
              code: "GROUP BY DATE_TRUNC('month', created_at)\nORDER BY month;",
              explanation:
                "All of a month's timestamps collapse to the same value, forming one group per month. TO_CHAR(month, 'YYYY-MM') would prettify the label as a final touch. Change 'month' to 'week' and the same query powers the weekly view — this template IS the trend-chart backend.",
            },
          ],
          output:
            " month               | revenue\n---------------------+----------\n 2026-01-01 00:00:00 | 42100.00\n 2026-02-01 00:00:00 | 45320.00\n 2026-03-01 00:00:00 | 44150.00\n(3 rows)",
        },
        {
          difficulty: "Hard",
          title: "Trend vs seasonality: same table, two date shapes",
          scenario:
            "Ops asks two similar-sounding questions: 'is order volume growing month by month?' and 'which weekday is busiest?' Each needs a different date transformation — confusing them produces nonsense.",
          steps: [
            {
              code: "-- Question 1: TREND → DATE_TRUNC\nSELECT DATE_TRUNC('month', created_at) AS month,\n       COUNT(*) AS orders\nFROM orders\nGROUP BY 1\nORDER BY 1;",
              explanation:
                "Truncation keeps the year attached: July 2025 and July 2026 are separate points on the time axis, so growth is visible. (GROUP BY 1 — ordinal shorthand for the first SELECT column — is common in analytics teams; some style guides ban it, so follow local convention.)",
            },
            {
              code: "-- Question 2: SEASONALITY → EXTRACT\nSELECT\n  EXTRACT(DOW FROM created_at) AS dow,\n  TO_CHAR(created_at, 'Dy')    AS day_name,\n  COUNT(*) AS orders\nFROM orders\nGROUP BY 1, 2\nORDER BY 1;",
              explanation:
                "EXTRACT(DOW …) pools every Monday across all history into bucket 1 — exactly right for a cycle question, exactly wrong for a trend. Grouping by the numeric DOW while displaying the TO_CHAR name gives correct sort order (Sunday=0 first in PostgreSQL) with readable labels. Swap the shapes between the questions and you'd get a 'trend' with 7 points or a 'seasonality' fragmented by year.",
            },
          ],
          output:
            " dow | day_name | orders\n-----+----------+--------\n   0 | Sun      |    310\n   1 | Mon      |    684\n   2 | Tue      |    702\n(3 rows)",
        },
        {
          difficulty: "Industry Example",
          title: "Signup-month cohorts with clean keys",
          scenario:
            "A subscription analyst builds the classic cohort base: each customer labeled by signup month, joined to orders via emails that need washing first — both halves of this lesson in one production query.",
          steps: [
            {
              code: "WITH clean_customers AS (\n  SELECT\n    customer_id,\n    LOWER(TRIM(email)) AS email_key,\n    DATE_TRUNC('month', signup_date) AS cohort_month\n  FROM customers\n),",
              explanation:
                "Step 1 manufactures trustworthy keys: a normalized email for matching and a truncated cohort label per customer. Doing this ONCE in a CTE — rather than inline in every join — keeps the wash logic single-sourced, the CTE-pipeline lesson applied to data cleaning.",
            },
            {
              code: "clean_events AS (\n  SELECT LOWER(TRIM(user_email)) AS email_key,\n         amount, created_at\n  FROM imported_orders\n)\nSELECT\n  TO_CHAR(c.cohort_month, 'YYYY-MM') AS cohort,\n  COUNT(DISTINCT c.customer_id)      AS cohort_size,\n  SUM(e.amount)                      AS cohort_revenue\nFROM clean_customers c\nLEFT JOIN clean_events e ON e.email_key = c.email_key\nGROUP BY c.cohort_month\nORDER BY c.cohort_month;",
              explanation:
                "Both sides washed with the SAME recipe — normalization is only as good as its symmetry; washing one side of a join is washing neither. LEFT keeps zero-purchase cohnort members (their revenue sums as NULL → visible gap, COALESCE to 0 if preferred). TO_CHAR labels at the last step while grouping/sorting on the real date. This exact shape underlies every cohort retention chart you've ever seen.",
            },
          ],
          output:
            " cohort  | cohort_size | cohort_revenue\n---------+-------------+----------------\n 2026-01 |         214 |       48210.50\n 2026-02 |         188 |       39975.25\n 2026-03 |         201 |       41402.00\n(3 rows)",
        },
      ],
    },

    /* ---------------------------------------------------------------- */
    /*  5 — Hands-on Practice                                            */
    /* ---------------------------------------------------------------- */
    {
      id: "inline-practice",
      type: "inline-code",
      tocLabel: "Practice Coding",
      coding: {
        language: "sql",
        filename: "query.sql",
        instructions:
          "Build a June signup report from users(user_id, email, signup_at): return the email domain (domain, via SPLIT_PART on the normalized email) and signups per domain — counting only signups in June 2026 using a half-open range. Sort by signups descending, then domain. Fill in the blanks.",
        starterCode:
          "-- users(user_id, email, signup_at)\n-- Rows: (1,' Ana@Gmail.com ','2026-06-03 10:00'), (2,'ben@yahoo.com','2026-06-15 09:30'),\n--       (3,'CARA@gmail.com','2026-06-28 22:10'), (4,'dev@gmail.com','2026-07-01 00:10')\n\nSELECT\n  SPLIT_PART(___(TRIM(email)), '@', ___) AS domain,\n  COUNT(*) AS signups\nFROM users\nWHERE signup_at >= '2026-06-01'\n  AND signup_at ___ '2026-07-01'\nGROUP BY domain\nORDER BY signups ___, domain;",
        solutionCode:
          "-- users(user_id, email, signup_at)\n-- Rows: (1,' Ana@Gmail.com ','2026-06-03 10:00'), (2,'ben@yahoo.com','2026-06-15 09:30'),\n--       (3,'CARA@gmail.com','2026-06-28 22:10'), (4,'dev@gmail.com','2026-07-01 00:10')\n\nSELECT\n  SPLIT_PART(LOWER(TRIM(email)), '@', 2) AS domain,\n  COUNT(*) AS signups\nFROM users\nWHERE signup_at >= '2026-06-01'\n  AND signup_at < '2026-07-01'\nGROUP BY domain\nORDER BY signups DESC, domain;",
        expectedOutput:
          " domain    | signups\n-----------+---------\n gmail.com |       2\n yahoo.com |       1\n(2 rows)",
        hints: [
          "Four blanks: the case-folding function, which piece of the split to take, the half-open comparison, and a sort direction.",
          "Wash inside-out: TRIM first, then LOWER — and the domain is piece 2 of an email split on '@'.",
          "Half-open means < '2026-07-01' — which correctly EXCLUDES Dev's July 1st 00:10 signup.",
          "Ana (trimmed+lowered) and Cara both yield gmail.com → 2; Ben yields yahoo.com → 1. Most signups first is DESC.",
        ],
      },
    },

    /* ---------------------------------------------------------------- */
    /*  6 — Exercises                                                    */
    /* ---------------------------------------------------------------- */
    {
      id: "exercises",
      type: "mastery-assessment",
      tocLabel: "Quiz & Exercises",
      masteryThreshold: 80,
      exercises: [
        {
          type: "mcq",
          id: "sql16_mcq_01",
          difficulty: "Easy",
          question:
            "Which expression reliably normalizes an email for joining?",
          options: [
            "UPPER(email)",
            "LOWER(TRIM(email))",
            "TRIM(LENGTH(email))",
            "SUBSTRING(email FROM 1)",
          ],
          correctIndex: 1,
          explanation:
            "Both hazards must go: TRIM removes padding spaces, LOWER folds case — together they make ' Anna@GMAIL.com ' equal 'anna@gmail.com'. UPPER folds case but leaves the spaces that break equality. TRIM(LENGTH(…)) doesn't typecheck — LENGTH returns a number. SUBSTRING FROM 1 returns the string unchanged.",
        },
        {
          type: "mcq",
          id: "sql16_mcq_02",
          difficulty: "Easy",
          question:
            "What does DATE_TRUNC('month', TIMESTAMP '2026-07-14 09:31:22') return?",
          options: [
            "7",
            "'2026-07'",
            "2026-07-01 00:00:00",
            "2026-07-14 00:00:00",
          ],
          correctIndex: 2,
          explanation:
            "DATE_TRUNC rounds DOWN to the period's first instant, keeping the timestamp type — month means the 1st at midnight. 7 is EXTRACT(MONTH …); the text '2026-07' is TO_CHAR output; midnight on the 14th would be DATE_TRUNC('day', …). Each shape has its function — that's the point of the family.",
        },
        {
          type: "mcq",
          id: "sql16_mcq_03",
          difficulty: "Medium",
          question:
            "first_name || ' ' || middle_name || ' ' || last_name — what happens when middle_name is NULL?",
          options: [
            "The middle name is skipped, leaving one space",
            "The entire expression returns NULL",
            "NULL renders as the text 'NULL'",
            "The query raises an error",
          ],
          correctIndex: 1,
          explanation:
            "NULL is contagious through || — any NULL operand nullifies the whole concatenation, so the full name vanishes. That's the trap. Fixes: CONCAT(first, ' ', middle, ' ', last), which treats NULL as '', or COALESCE(middle_name, ''). No engine renders the string 'NULL', skips operands, or errors — the silent NULL is precisely what makes this a classic report bug.",
        },
        {
          type: "mcq",
          id: "sql16_mcq_04",
          difficulty: "Medium",
          question:
            "Why does WHERE created_at BETWEEN '2026-07-01' AND '2026-07-31' miscount July for a TIMESTAMP column?",
          options: [
            "BETWEEN is exclusive of both endpoints",
            "'2026-07-31' coerces to midnight, so all of July 31 after 00:00:00 falls outside the range",
            "Timestamps can't be compared to strings at all",
            "It includes August 1 by rounding up",
          ],
          correctIndex: 1,
          explanation:
            "The date string becomes 2026-07-31 00:00:00, and BETWEEN's inclusive upper bound stops there — a 09:15 order on the 31st is excluded, silently losing a day of revenue. BETWEEN is inclusive (not exclusive) on both ends, string-to-timestamp coercion is exactly what happens (no error), and nothing rounds up. The cure is the half-open pattern: >= '2026-07-01' AND < '2026-08-01'.",
        },
        {
          type: "scenario",
          id: "sql16_sc_01",
          difficulty: "Hard",
          scenario:
            "A dashboard's 'orders today' tile runs WHERE DATE_TRUNC('day', created_at) = CURRENT_DATE over a 200M-row table and takes minutes. An index exists on created_at. A teammate proposes rewriting the filter.",
          question: "What rewrite fixes the performance, and why?",
          options: [
            "WHERE TO_CHAR(created_at, 'YYYY-MM-DD') = TO_CHAR(CURRENT_DATE, 'YYYY-MM-DD') — text comparison is faster",
            "WHERE created_at >= CURRENT_DATE AND created_at < CURRENT_DATE + INTERVAL '1 day' — a sargable range on the raw column lets the index seek instead of scanning",
            "Add LIMIT 1000 to cap the work",
            "Change the index to DESC order",
          ],
          correctIndex: 1,
          explanation:
            "Wrapping the COLUMN in a function (DATE_TRUNC, TO_CHAR) hides raw values from the index — the engine must compute the function for every row: a full scan. Rewriting as a half-open range compares the raw indexed column directly, so the B-tree seeks straight to today's first row and reads only today's slice. The TO_CHAR variant doubles down on the same disease. LIMIT caps output, not the scan that finds it (and changes the answer). Index direction is irrelevant to range seeks. 'Sargable' — Search-ARGument-able — is the keyword worth dropping in interviews.",
        },
        {
          type: "coding",
          id: "sql16_code_01",
          difficulty: "Hard",
          prompt:
            "From support_tickets(ticket_id, customer_email, created_at, closed_at), produce a per-month report: month (as 'YYYY-MM' text), tickets opened (opened), and average resolution days for closed tickets (avg_days, one decimal, computed from closed_at - created_at). Group and order by month. Note: closed_at is NULL for open tickets — AVG must skip them (it does so naturally).",
          starterCode:
            "-- support_tickets(ticket_id, customer_email, created_at, closed_at)\n-- Rows: (1,'a@x.com','2026-06-02 10:00','2026-06-04 10:00'),\n--       (2,'b@y.com','2026-06-20 09:00', NULL),\n--       (3,'c@z.com','2026-07-01 12:00','2026-07-08 12:00')\n\n",
          solutionCode:
            "SELECT\n  TO_CHAR(DATE_TRUNC('month', created_at), 'YYYY-MM') AS month,\n  COUNT(*) AS opened,\n  ROUND(AVG(EXTRACT(EPOCH FROM (closed_at - created_at)) / 86400.0), 1)\n    AS avg_days\nFROM support_tickets\nGROUP BY DATE_TRUNC('month', created_at)\nORDER BY month;",
          expectedOutput:
            " month   | opened | avg_days\n---------+--------+----------\n 2026-06 |      2 |      2.0\n 2026-07 |      1 |      7.0\n(2 rows)",
          tests: [
            {
              name: "Monthly bucketing",
              description: "Groups by the truncated month; TO_CHAR only labels the output",
            },
            {
              name: "NULL-safe average",
              description: "June's open ticket (NULL closed_at) is counted in opened=2 but skipped by AVG → 2.0 days from ticket 1 alone",
            },
            {
              name: "Duration arithmetic",
              description: "Timestamp subtraction converted to days (EPOCH/86400 or equivalent), rounded to one decimal",
            },
          ],
        },
      ],
    },

    /* ---------------------------------------------------------------- */
    /*  7 — Interview Questions                                          */
    /* ---------------------------------------------------------------- */
    {
      id: "interview-questions",
      type: "interview-questions",
      tocLabel: "Interview Prep",
      questions: [
        {
          question:
            "Two tables must join on email, but the data is messy. Walk me through making that join trustworthy.",
          answer:
            "First I profile the mess: COUNT rows where email <> LOWER(TRIM(email)) on each side to size the case and whitespace problems, and eyeball a sample for structural issues (plus-tags, dots in Gmail locals, obvious typos). The core fix is symmetric normalization — LOWER(TRIM(email)) applied to BOTH sides, defined once in a CTE per side so the recipe can't drift between queries; washing only one side is washing neither. Depending on the business, I may go further: stripping +tags (SPLIT_PART on '+') or Gmail dot-collapsing — each an explicit, documented decision because they change match semantics. Then I verify with counts: matched rows before vs after normalization, and an anti-join sample of remaining non-matches to see what class of mismatch survives (typos need fuzzy matching, which is a different project). Finally, for a recurring join I'd push normalization to write time — a stored email_normalized column, possibly with an expression index — so every consumer inherits clean keys instead of re-washing.",
        },
        {
          question:
            "Explain the difference between DATE_TRUNC and EXTRACT, with a case where confusing them gives a wrong answer.",
          answer:
            "DATE_TRUNC rounds a timestamp down to a period boundary and KEEPS the full date type — July 14th 2026 becomes July 1st 2026 — so different years stay distinct; it's the trend shape. EXTRACT pulls out one numeric component — month 7 — discarding the year, so all Julys ever pool together; it's the seasonality/cycle shape. The classic confusion: asked for monthly revenue growth, an analyst groups by EXTRACT(MONTH FROM created_at) over two years of data. The 'July' bar now silently sums July 2025 AND July 2026; the chart shows twelve points where twenty-four months of history exist, growth is unmeasurable, and totals look inflated relative to any single year. Nothing errors — the numbers are just answering a different question. My habit: the words 'over time' in a request mean DATE_TRUNC; the words 'which month/day/hour typically' mean EXTRACT.",
        },
        {
          question:
            "What is a sargable predicate, and how does it interact with the date and string functions from this toolbox?",
          answer:
            "Sargable — from 'Search ARGument able' — describes a predicate written so the engine can use an index seek: the raw column stands alone on one side of the comparison, and the constant work happens on the other side. WHERE created_at >= '2026-07-01' AND created_at < '2026-08-01' is sargable; WHERE DATE_TRUNC('month', created_at) = '2026-07-01' is not, because the function must run on every row before comparing, forcing a scan. The transformation functions in this lesson are the main way analysts accidentally break sargability: LOWER(email) =, TO_CHAR(dt,…) =, SUBSTRING(sku,…) = all hide the column. The remedies, in order of preference: move the function to the constant side or rewrite as a range (dates truncate beautifully into half-open ranges); create an expression index matching the exact wrapped form (ON t (LOWER(email))); or materialize a normalized column at write time. In analytics warehouses without B-tree indexes the same idea survives as partition pruning — a filter on the raw partition column prunes files, a function-wrapped one doesn't.",
        },
      ],
    },

    /* ---------------------------------------------------------------- */
    /*  8 — Common Mistakes                                              */
    /* ---------------------------------------------------------------- */
    {
      id: "common-mistakes",
      type: "callout",
      variant: "warning",
      title: "Common Mistakes to Avoid",
      content:
        "1) Joining or grouping on unwashed text — case and padding differences quietly split one entity into many; normalize with LOWER(TRIM(…)) on BOTH sides. 2) BETWEEN on timestamp ranges — the upper date coerces to midnight and loses the last day; use half-open >= / <. 3) Concatenating with || across nullable columns — one NULL nullifies the whole string; use CONCAT or COALESCE. 4) EXTRACT(MONTH …) for a trend across years — Julys pool together; trends need DATE_TRUNC. 5) Wrapping the filtered column in functions inside WHERE — kills index use; keep predicates sargable with ranges on raw columns.",
    },

    /* ---------------------------------------------------------------- */
    /*  9 — AI Tutor Prompts                                             */
    /* ---------------------------------------------------------------- */
    {
      id: "ai-tutor",
      type: "callout",
      variant: "tip",
      title: "Ask the AI Tutor",
      content:
        "Try these prompts in the AI Tutor panel: • 'ELI5: why text normalization matters, with a laundry analogy of your own.' • 'Quiz me: messy strings, I write the wash expression; timestamps, I pick TRUNC vs EXTRACT.' • 'Show me the BETWEEN-loses-a-day bug with three timestamps and the half-open fix.' • 'Trace SPLIT_PART over a URL with utm parameters, piece by piece.' • 'Interview mode: make a slow function-wrapped date filter sargable and explain why it works.'",
    },

    /* ---------------------------------------------------------------- */
    /*  10 — Glossary                                                    */
    /* ---------------------------------------------------------------- */
    {
      id: "glossary",
      type: "callout",
      variant: "info",
      title: "Glossary",
      content:
        "LOWER / UPPER — case folding. TRIM / LTRIM / RTRIM — strip whitespace (or given characters) from ends. LENGTH — character count; padding detector. SUBSTRING / LEFT / RIGHT — positional slicing (1-indexed). SPLIT_PART — nth piece after splitting on a delimiter. POSITION — 1-based index of a substring, 0 if absent. REPLACE — substitute every occurrence of a substring. || vs CONCAT — concatenation; || propagates NULL, CONCAT treats it as ''. Interval — a duration value for date arithmetic. Half-open range — >= start AND < end; boundary-exact filtering. DATE_TRUNC — round a timestamp down to a period start (trend shape). EXTRACT — pull one numeric part (seasonality shape). TO_CHAR — format dates/numbers as text labels. AT TIME ZONE — explicit timezone conversion. Sargable — predicate form that permits index seeks; broken by wrapping the column in functions. Expression index — an index over a computed expression like LOWER(email).",
    },

    /* ---------------------------------------------------------------- */
    /*  11 — Recommended Resources                                       */
    /* ---------------------------------------------------------------- */
    {
      id: "resources",
      type: "callout",
      variant: "info",
      title: "Recommended Resources",
      content:
        "• Docs: PostgreSQL manual — 'String Functions and Operators' and 'Date/Time Functions and Operators' (bookmark both; nobody memorizes them all). • Read: 'Falsehoods Programmers Believe About Time' for healthy timezone paranoia. • Practice: take one messy CSV you own, load it, and build a clean_* CTE: washed keys, split composites, truncated months — then a trend query and a weekday-seasonality query on the same column. • Next in DSM: you can now clean and reshape any column — Database Design Concepts opens the Design module, showing how schemas are structured so there's less mess to clean in the first place.",
    },

    /* ---------------------------------------------------------------- */
    /*  12 — Recap                                                       */
    /* ---------------------------------------------------------------- */
    {
      id: "recap",
      type: "recap",
      tocLabel: "Recap",
      content:
        "✓ Normalize text before any comparison: LOWER(TRIM(col)) on both sides of a join, REPLACE for stray characters.\n✓ Slice with SUBSTRING/LEFT/RIGHT and SPLIT_PART; find with POSITION; assemble with CONCAT (NULL-safe) rather than || across nullables.\n✓ Date arithmetic runs on intervals; filter time ranges half-open (>= start, < end) — BETWEEN loses the last day on timestamps.\n✓ DATE_TRUNC buckets timestamps for trends (years stay distinct); EXTRACT pulls parts for seasonality (years pool); TO_CHAR labels at the end.\n✓ Keep predicates sargable — functions around the filtered column force full scans; ranges on raw columns let indexes work.\n✓ Timezones: know which zone your 'day' means and convert explicitly.\n\nNext up: Database Design Concepts. You've mastered querying data as it is — the Design module asks how it SHOULD be: entities, keys, relationships, and the modeling decisions that decide whether future analysts inherit clean tables or a cleaning shift.",
    },
  ],
};
