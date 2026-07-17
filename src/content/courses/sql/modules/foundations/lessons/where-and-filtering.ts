import type { Lesson } from "@/lib/curriculum/types";

export const whereAndFiltering: Lesson = {
  meta: {
    id: "sql.foundations.where-and-filtering",
    slug: "where-and-filtering",
    title: "WHERE & Filtering",
    description:
      "Filter rows with predicates: comparison operators, AND/OR/NOT, IN, BETWEEN, LIKE, and the three-valued logic of NULL.",
    estimatedTime: "25 mins",
    difficulty: "Beginner",
    xpReward: 50,
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
        hook: "SELECT chose your columns. Now comes the question every stakeholder actually asks: 'which rows?' Orders over $100. Customers from Germany. Signups in March. Filtering is where SQL stops describing tables and starts answering questions.",
        what: "The WHERE clause keeps only the rows for which a condition — called a predicate — evaluates to true. Predicates combine comparison operators (=, <>, >, <) with logical operators (AND, OR, NOT) and convenience forms like IN, BETWEEN, and LIKE.",
        why: "Real tables hold millions of rows; almost no question is about all of them. Without WHERE you would drag entire tables into your notebook and filter in pandas — slow, expensive, and impossible once data outgrows memory. Filtering at the database is the single biggest lever for fast, cheap queries.",
        whereUsed:
          "Every dashboard filter, every cohort definition, every 'active users last 30 days' metric, every data-quality check compiles down to a WHERE clause.",
        objectives: [
          "Filter rows with comparison operators: =, <>, >, >=, <, <=",
          "Combine conditions with AND, OR, NOT and control precedence with parentheses",
          "Use IN, BETWEEN, and LIKE for set, range, and pattern matching",
          "Explain why NULL comparisons need IS NULL / IS NOT NULL",
          "Predict which rows survive a compound predicate before running it",
        ],
        realWorldApps: [
          {
            company: "Stripe",
            headline: "Fraud triage queries",
            detail:
              "Risk analysts filter payments with predicates like amount > 5000 AND country <> card_country AND status = 'pending' to surface transactions that need human review.",
          },
          {
            company: "Airbnb",
            headline: "Search result filtering",
            detail:
              "A listings search compiles guest filters into SQL-style predicates: price BETWEEN 80 AND 200 AND bedrooms >= 2 AND city IN ('Lisbon', 'Porto').",
          },
          {
            company: "Netflix",
            headline: "Data-quality monitors",
            detail:
              "Pipeline checks run queries like SELECT COUNT(*) FROM viewing_events WHERE duration_seconds IS NULL to catch broken instrumentation before it poisons recommendations.",
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
            "WHERE sits between FROM and the rest of the query. The database reads a row, evaluates your predicate — an expression that is true or false for that row — and keeps the row only when the predicate is true. The comparison operators are = (equal), <> or != (not equal), and the four inequalities >, >=, <, <=. Text values go in single quotes: status = 'shipped'.",
        },
        {
          type: "analogy",
          title: "The bouncer analogy",
          content:
            "Think of WHERE as a bouncer at a club door. Every row walks up, the bouncer checks it against the rule list ('amount over 100? country is Germany?'), and only rows that satisfy the rules get in. The bouncer never modifies anyone — rows are filtered, never changed. And crucially, the bouncer checks every guest one at a time: predicates are evaluated per row.",
        },
        {
          type: "keypoint",
          title: "Logical operators and precedence",
          content:
            "AND requires both sides true; OR requires at least one; NOT flips the result. AND binds tighter than OR: a OR b AND c means a OR (b AND c). When you mix AND with OR, always add parentheses — precedence bugs return the wrong rows silently, with no error message.",
        },
        {
          type: "code-note",
          code: "SELECT order_id, amount, country\nFROM orders\nWHERE (country = 'DE' OR country = 'FR')\n  AND amount > 100;",
          content:
            "Without the parentheses this would return every German order regardless of amount (country = 'DE' OR (country = 'FR' AND amount > 100)). The parentheses make the intent explicit: European orders over 100. Reading tip: indent continuation conditions under WHERE so the logic is scannable.",
        },
        {
          type: "text",
          content:
            "Three convenience predicates cover most everyday filters. IN tests membership in a list: country IN ('DE', 'FR', 'NL') is shorthand for three ORs. BETWEEN tests an inclusive range: amount BETWEEN 50 AND 100 includes both 50 and 100. LIKE matches text patterns using two wildcards — % matches any run of characters (including none) and _ matches exactly one: email LIKE '%@gmail.com' finds Gmail addresses.",
        },
        {
          type: "warning",
          title: "NULL breaks normal comparisons",
          content:
            "NULL means 'value unknown/missing' — and comparing anything to unknown yields unknown, not true or false. So discount = NULL never matches, and neither does discount <> NULL. Rows where the predicate is unknown are dropped by WHERE. To test for missing values you must use IS NULL or IS NOT NULL. This is SQL's three-valued logic (true / false / unknown), and it is the #1 source of silently wrong filters.",
        },
        {
          type: "expandable",
          title: "Why does NOT IN with a NULL return zero rows?",
          content:
            "country NOT IN ('DE', NULL) expands to country <> 'DE' AND country <> NULL. The second comparison is unknown for every row, and true AND unknown is unknown — so no row ever passes. If the subquery or list feeding NOT IN can contain NULLs, filter them out first (WHERE x IS NOT NULL) or use NOT EXISTS, which you'll meet in the Subqueries lesson. Interviewers love this trap.",
        },
        {
          type: "keypoint",
          title: "Filter early, filter in the database",
          content:
            "WHERE runs before data leaves the warehouse. A query that filters 10 million rows down to 3,000 ships 3,000 rows to your notebook; the pandas-first equivalent ships all 10 million and then filters. Pushing predicates into SQL is called predicate pushdown, and it is the default habit of every effective analyst.",
        },
        {
          type: "code-note",
          code: "-- Case-insensitive pattern match (PostgreSQL)\nSELECT customer_id, email\nFROM customers\nWHERE email ILIKE '%@GMAIL.com';",
          content:
            "LIKE is case-sensitive in PostgreSQL ('Anna%' won't match 'anna'). PostgreSQL adds ILIKE for case-insensitive matching; other dialects use LOWER(email) LIKE '%@gmail.com' — which works everywhere. Dialect note: MySQL's LIKE is case-insensitive by default for most collations.",
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
        title: "How WHERE Decides a Row's Fate",
        caption:
          "Each row flows through the predicate. Click a node to see what happens at each evaluation outcome — note that unknown is dropped, exactly like false.",
        nodes: [
          {
            id: "row",
            label: "Row arrives",
            sublabel: "from FROM",
            detail:
              "The database scans the table row by row (or via an index). Each row's column values are plugged into your predicate. Filtering happens before SELECT's expressions are computed for the output.",
            x: 10,
            y: 40,
            accent: false,
          },
          {
            id: "predicate",
            label: "Predicate",
            sublabel: "amount > 100 AND …",
            detail:
              "The full boolean expression: comparisons combined with AND/OR/NOT, plus IN / BETWEEN / LIKE forms. Evaluates to exactly one of three values: true, false, or unknown (when a NULL is involved).",
            x: 38,
            y: 40,
            accent: true,
          },
          {
            id: "true",
            label: "TRUE",
            sublabel: "row kept",
            detail:
              "The row passes into the result set (and onward to GROUP BY / ORDER BY if present). Only true keeps a row — this is stricter than 'not false'.",
            x: 68,
            y: 15,
            accent: false,
          },
          {
            id: "false",
            label: "FALSE",
            sublabel: "row dropped",
            detail:
              "The condition definitively failed — e.g. amount is 40 and the predicate demands > 100. The row is excluded from the result.",
            x: 68,
            y: 45,
            accent: false,
          },
          {
            id: "unknown",
            label: "UNKNOWN",
            sublabel: "row dropped too",
            detail:
              "A NULL was compared with = / <> / > etc., so the truth value is unknown. WHERE treats unknown like false and drops the row. This is why amount <> 100 does NOT return rows where amount IS NULL.",
            x: 68,
            y: 75,
            accent: true,
          },
          {
            id: "result",
            label: "Result set",
            sublabel: "surviving rows",
            detail:
              "Only rows whose predicate evaluated to true. If you suspect NULLs are being silently dropped, add OR column IS NULL to the predicate and compare the counts.",
            x: 92,
            y: 40,
            accent: false,
          },
        ],
        edges: [
          { from: "row", to: "predicate", label: "evaluate" },
          { from: "predicate", to: "true" },
          { from: "predicate", to: "false" },
          { from: "predicate", to: "unknown", label: "NULL involved" },
          { from: "true", to: "result", label: "kept" },
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
          title: "A single comparison",
          scenario:
            "The orders table has order_id, customer_id, amount, and status. Find all orders worth more than $150.",
          steps: [
            {
              code: "SELECT order_id, amount\nFROM orders\nWHERE amount > 150;",
              explanation:
                "The predicate amount > 150 is checked against every row. A row with amount 89.99 evaluates to false and is dropped; a row with 210.00 evaluates to true and is kept. Note the filter references the column name, never SELECT aliases — WHERE runs before the SELECT list is applied.",
            },
          ],
          output:
            " order_id | amount\n----------+--------\n 1004     | 210.00\n 1007     | 380.50\n(2 rows)",
        },
        {
          difficulty: "Easy",
          title: "Combining conditions with AND",
          scenario:
            "Operations wants shipped orders over $100 — both conditions must hold.",
          steps: [
            {
              code: "SELECT order_id, amount, status\nFROM orders\nWHERE status = 'shipped'",
              explanation:
                "Start with the text comparison. String literals use single quotes, and matching is exact (case-sensitive in PostgreSQL): 'Shipped' would not match 'shipped'.",
            },
            {
              code: "  AND amount > 100;",
              explanation:
                "AND narrows the result: a row must pass both checks. Each extra AND can only keep the row count the same or shrink it — a useful sanity check when your filtered count comes back larger than expected.",
            },
          ],
          output:
            " order_id | amount | status\n----------+--------+---------\n 1004     | 210.00 | shipped\n 1011     | 145.25 | shipped\n(2 rows)",
        },
        {
          difficulty: "Medium",
          title: "IN, BETWEEN, and LIKE together",
          scenario:
            "Marketing wants mid-value orders (between $50 and $200 inclusive) from the DACH region (Germany, Austria, Switzerland) placed by customers with a .de email address.",
          steps: [
            {
              code: "SELECT o.order_id, o.amount, c.country, c.email\nFROM orders AS o\nINNER JOIN customers AS c ON c.customer_id = o.customer_id\nWHERE c.country IN ('DE', 'AT', 'CH')",
              explanation:
                "IN replaces three ORs with one readable membership test. (The join brings in customer columns — treat it as given here; joins get their own module next.)",
            },
            {
              code: "  AND o.amount BETWEEN 50 AND 200",
              explanation:
                "BETWEEN is inclusive on both ends: exactly 50.00 and exactly 200.00 both pass. It is shorthand for amount >= 50 AND amount <= 200.",
            },
            {
              code: "  AND c.email LIKE '%.de';",
              explanation:
                "% matches any run of characters, so '%.de' means 'ends with .de'. A pattern like 'anna_@%' would use _ to match exactly one character. All three predicates are ANDed: a row must clear all of them.",
            },
          ],
          output:
            " order_id | amount | country | email\n----------+--------+---------+--------------------\n 1002     | 79.98  | DE      | anna@fischer.de\n 1013     | 150.00 | AT      | jonas@webshop.de\n(2 rows)",
        },
        {
          difficulty: "Hard",
          title: "The NULL trap",
          scenario:
            "The discount_pct column is NULL when no discount was applied. An analyst wants all orders that did NOT get a 10% discount — and writes discount_pct <> 0.10. The numbers look wrong. Diagnose it.",
          steps: [
            {
              code: "-- orders: 1000 rows total\n-- discount_pct = 0.10 on 120 rows, other values on 300, NULL on 580\nSELECT COUNT(*) FROM orders\nWHERE discount_pct <> 0.10;",
              explanation:
                "Expected 880 (everything except the 120). Actual: 300. The 580 NULL rows evaluate NULL <> 0.10 to unknown, and WHERE drops unknown rows exactly like false ones. The 'no discount' orders vanished silently.",
            },
            {
              code: "SELECT COUNT(*) FROM orders\nWHERE discount_pct <> 0.10\n   OR discount_pct IS NULL;",
              explanation:
                "The fix: handle the missing values explicitly with IS NULL. Now the count is 880 as intended. Alternative: COALESCE(discount_pct, 0) <> 0.10 replaces NULL with 0 before comparing — same result, one predicate.",
            },
            {
              code: "-- Sanity-check pattern for any filtered query\nSELECT\n  COUNT(*) AS total_rows,\n  COUNT(discount_pct) AS non_null,\n  COUNT(*) - COUNT(discount_pct) AS nulls\nFROM orders;",
              explanation:
                "Before trusting any filter on a column, profile its NULLs: COUNT(column) counts only non-NULL values, so the difference from COUNT(*) is the NULL count. 580 NULLs here would have flagged the trap before it bit.",
            },
          ],
          output: " count\n-------\n   880\n(1 row)",
        },
        {
          difficulty: "Industry Example",
          title: "Defining an 'active user' cohort",
          scenario:
            "A subscription company defines active users as: signed up more than 30 days ago, not cancelled, with a non-null payment method, excluding internal test accounts (emails ending in @company.com). This exact predicate feeds the weekly KPI dashboard.",
          steps: [
            {
              code: "SELECT user_id, email, signup_date, plan\nFROM users\nWHERE signup_date <= CURRENT_DATE - INTERVAL '30 days'",
              explanation:
                "CURRENT_DATE is today; subtracting a 30-day interval gives the cutoff. Date comparisons work like number comparisons: earlier dates are 'smaller'. Users who signed up within the last 30 days are excluded from the mature cohort.",
            },
            {
              code: "  AND status <> 'cancelled'\n  AND payment_method IS NOT NULL",
              explanation:
                "Two data-quality guards: status is a known enum so <> is safe, but payment_method can be missing — that requires IS NOT NULL, not <> ''. An empty string and NULL are different values in SQL.",
            },
            {
              code: "  AND email NOT LIKE '%@company.com';",
              explanation:
                "NOT LIKE excludes the internal test accounts. Order of conditions doesn't change the result (AND is commutative) — the optimizer decides evaluation order — so arrange them for human readability: business rules first, hygiene filters last.",
            },
          ],
          output:
            " user_id | email             | signup_date | plan\n---------+-------------------+-------------+------\n 20481   | mia@outlook.com   | 2026-04-02  | pro\n 20515   | leo@gmail.com     | 2026-05-19  | base\n(2 rows)",
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
          "You're auditing the orders table (order_id, customer_id, amount, status, country). Return order_id, amount, and country for orders that are: from Germany or France, worth between $50 and $500 inclusive, and NOT cancelled. Fill in the blanks.",
        starterCode:
          "-- orders(order_id, customer_id, amount, status, country)\n-- Rows: (1001, 1, 250.00, 'shipped', 'DE'), (1002, 2, 30.00, 'shipped', 'DE'),\n--       (1003, 3, 99.99, 'cancelled', 'FR'), (1004, 4, 480.00, 'pending', 'FR'),\n--       (1005, 5, 120.00, 'shipped', 'US')\n\nSELECT order_id, amount, country\nFROM orders\nWHERE country ___ ('DE', 'FR')\n  AND amount ___ 50 AND 500\n  AND status ___ 'cancelled';",
        solutionCode:
          "-- orders(order_id, customer_id, amount, status, country)\n-- Rows: (1001, 1, 250.00, 'shipped', 'DE'), (1002, 2, 30.00, 'shipped', 'DE'),\n--       (1003, 3, 99.99, 'cancelled', 'FR'), (1004, 4, 480.00, 'pending', 'FR'),\n--       (1005, 5, 120.00, 'shipped', 'US')\n\nSELECT order_id, amount, country\nFROM orders\nWHERE country IN ('DE', 'FR')\n  AND amount BETWEEN 50 AND 500\n  AND status <> 'cancelled';",
        expectedOutput:
          " order_id | amount | country\n----------+--------+---------\n 1001     | 250.00 | DE\n 1004     | 480.00 | FR\n(2 rows)",
        hints: [
          "Three blanks: a membership test against a list, an inclusive range test, and a not-equal comparison.",
          "Membership in a list of values uses IN — it replaces country = 'DE' OR country = 'FR'.",
          "An inclusive range from 50 to 500 is written amount BETWEEN 50 AND 500.",
          "Not-equal is <> (or !=): status <> 'cancelled'. Check each sample row: 1002 fails the range, 1003 is cancelled, 1005 is US.",
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
          id: "sql03_mcq_01",
          difficulty: "Easy",
          question: "Which clause removes rows that fail a condition?",
          options: ["SELECT", "FROM", "WHERE", "ORDER BY"],
          correctIndex: 2,
          explanation:
            "WHERE evaluates a predicate per row and keeps only rows where it is true. SELECT chooses columns (projection), FROM names the source table, and ORDER BY sorts rows that already survived the filter — it never removes any.",
        },
        {
          type: "mcq",
          id: "sql03_mcq_02",
          difficulty: "Easy",
          question: "Is BETWEEN 10 AND 20 inclusive or exclusive of its endpoints?",
          options: [
            "Inclusive of both 10 and 20",
            "Exclusive of both",
            "Inclusive of 10, exclusive of 20",
            "It depends on the column's data type",
          ],
          correctIndex: 0,
          explanation:
            "BETWEEN a AND b is defined as >= a AND <= b — both endpoints included, in every major dialect and for every comparable type. The half-open variants must be written out manually (x >= 10 AND x < 20), which is the common pattern for date ranges to avoid double-counting midnight.",
        },
        {
          type: "mcq",
          id: "sql03_mcq_03",
          difficulty: "Medium",
          question:
            "The bonus column is NULL for 40 of 100 employees. How many rows does WHERE bonus <> 500 return if exactly 10 employees have bonus = 500?",
          options: ["90", "50", "60", "100"],
          correctIndex: 1,
          explanation:
            "Only the 50 rows with a non-NULL bonus different from 500 pass. The 40 NULL rows evaluate NULL <> 500 to unknown and are dropped — WHERE keeps only true. 90 assumes NULLs count as 'not 500' (they don't without OR bonus IS NULL), 60 miscounts, and 100 would mean no filtering at all.",
        },
        {
          type: "mcq",
          id: "sql03_mcq_04",
          difficulty: "Medium",
          question: "Which pattern matches email addresses ending in '.org'?",
          options: [
            "email LIKE '.org%'",
            "email LIKE '%.org'",
            "email = '%.org'",
            "email LIKE '_.org'",
          ],
          correctIndex: 1,
          explanation:
            "% matches any run of characters, so '%.org' means 'anything, then .org at the end'. '.org%' would match strings that START with .org. The = operator compares literally — it would only match the six-character string '%.org' itself since = does no wildcard expansion. '_.org' matches exactly one character before .org, so only five-character values like 'a.org'.",
        },
        {
          type: "scenario",
          id: "sql03_sc_01",
          difficulty: "Hard",
          scenario:
            "An analyst writes: WHERE country = 'DE' OR country = 'FR' AND amount > 1000 — intending 'German or French orders over 1000'. The result contains German orders of $12.",
          question: "Why, and what is the fix?",
          options: [
            "OR is evaluated before AND; swap the operators",
            "AND binds tighter than OR, so the query means DE-any-amount OR (FR AND >1000); add parentheses around the countries",
            "String comparisons can't be combined with numeric ones; split into two queries",
            "The = should be IN; IN changes the precedence",
          ],
          correctIndex: 1,
          explanation:
            "AND has higher precedence than OR, so the predicate parsed as country='DE' OR (country='FR' AND amount>1000) — every German order qualified regardless of amount. The fix is (country = 'DE' OR country = 'FR') AND amount > 1000, or more cleanly country IN ('DE','FR') AND amount > 1000. Option A inverts the actual precedence rule. Mixing string and numeric predicates is perfectly legal. IN is equivalent to the parenthesized ORs — it improves readability but it isn't a precedence operator per se; writing it correctly is what fixes the bug.",
        },
        {
          type: "coding",
          id: "sql03_code_01",
          difficulty: "Hard",
          prompt:
            "The customers table (customer_id, name, email, marketing_opt_in) has NULLs in marketing_opt_in for customers who never answered. Write a query counting customers who have NOT opted in — treating 'never answered' (NULL) as not opted in. Return one column named not_opted_in.",
          starterCode:
            "-- customers(customer_id, name, email, marketing_opt_in BOOLEAN)\n-- 3 rows: (1,'Anna','a@x.de', true), (2,'Ben','b@x.de', false), (3,'Cara','c@x.de', NULL)\n\n",
          solutionCode:
            "SELECT COUNT(*) AS not_opted_in\nFROM customers\nWHERE marketing_opt_in = false\n   OR marketing_opt_in IS NULL;",
          expectedOutput: " not_opted_in\n--------------\n            2\n(1 row)",
          tests: [
            {
              name: "NULL handled",
              description: "The NULL row (Cara) is counted via IS NULL, not lost",
            },
            {
              name: "Correct count",
              description: "Returns 2 (Ben false + Cara NULL), not 1",
            },
            {
              name: "Alias applied",
              description: "The output column is named not_opted_in",
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
            "Explain SQL's three-valued logic. How does it affect WHERE clauses?",
          answer:
            "SQL predicates evaluate to true, false, or unknown — not just true/false. Unknown appears whenever a NULL is involved in a comparison, because NULL means 'value missing', and you can't say whether a missing value equals 5. WHERE keeps only rows whose predicate is true, so unknown rows are dropped exactly like false ones. The practical consequence: a filter like status <> 'cancelled' silently excludes rows where status is NULL, which is rarely what the business question intended. The defensive habits are to profile NULL counts before filtering (COUNT(*) vs COUNT(column)), to use IS NULL / IS NOT NULL explicitly, and to reach for COALESCE when a sensible default exists. I'd also mention the NOT IN trap: a single NULL in the list makes the whole predicate return zero rows.",
        },
        {
          question:
            "A query mixing AND and OR returns obviously wrong rows. Walk me through how you'd debug it.",
          answer:
            "First suspicion is operator precedence: AND binds tighter than OR, so a OR b AND c means a OR (b AND c), and unparenthesized mixes almost always express something different from the analyst's intent. I'd rewrite the predicate with explicit parentheses matching the business sentence, then re-run and compare counts. If it's still off, I decompose: run each atomic condition alone with COUNT(*), then add conditions back one at a time — each AND should monotonically shrink the count, and any surprising jump localizes the bug. Finally I'd check for NULLs in the filtered columns, since dropped-unknown rows are the other classic source of wrong counts. Five minutes of counting beats an hour of staring at the predicate.",
        },
        {
          question:
            "When would you use LIKE versus = for text filtering, and what are the performance implications?",
          answer:
            "= does exact matching and can use a plain B-tree index directly, so it's the right choice whenever you know the full value — statuses, country codes, IDs. LIKE is for partial or pattern matching with % and _ wildcards: suffix checks like '%@gmail.com', prefix checks like 'ORD-2026%'. Performance depends on where the wildcard sits: a leading-wildcard pattern ('%gmail.com') can't use a standard index because the beginning of the string is unconstrained, forcing a full scan, whereas 'ORD-2026%' is index-friendly since the prefix anchors the search. For heavy substring search at scale you'd move to trigram indexes (PostgreSQL pg_trgm) or full-text search rather than LIKE. I'd also flag case sensitivity: PostgreSQL LIKE is case-sensitive, MySQL's usually isn't, so portable code often normalizes with LOWER() on both sides.",
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
        "1) Writing column = NULL — it never matches; use IS NULL. 2) Mixing AND and OR without parentheses, silently changing the logic through precedence. 3) Using double quotes for text ('shipped' is a string; \"shipped\" is an identifier in PostgreSQL). 4) Filtering on a SELECT alias (WHERE total > 100 when total is defined in SELECT) — WHERE runs first and can't see aliases; repeat the expression or use a subquery. 5) Assuming BETWEEN excludes its endpoints — it's inclusive, which double-counts boundary timestamps in date ranges; prefer >= start AND < end for time windows.",
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
        "Try these prompts in the AI Tutor panel: • 'ELI5: why does NULL = NULL not return true in SQL?' • 'Quiz me with five predicates and rows — I'll predict kept or dropped.' • 'Show me a real bug caused by AND/OR precedence and how parentheses fix it.' • 'Explain the NOT IN with NULL trap with a tiny 3-row example.' • 'Interview mode: grill me on three-valued logic and grade my answer.'",
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
        "Predicate — a boolean expression evaluated per row by WHERE. Comparison operators — =, <> (!=), >, >=, <, <= for comparing values. Logical operators — AND, OR, NOT for combining predicates. Precedence — the binding order of operators; AND before OR. IN — membership test against a list of values. BETWEEN — inclusive range test (>= low AND <= high). LIKE — pattern match; % matches any run of characters, _ exactly one. Wildcard — a pattern character standing in for unknown text. NULL — a missing/unknown value; not zero and not empty string. Three-valued logic — predicates evaluate to true, false, or unknown; WHERE keeps only true. IS NULL / IS NOT NULL — the only correct tests for missing values. COALESCE — returns the first non-NULL argument; used to substitute defaults.",
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
        "• Docs: PostgreSQL manual — 'Comparison Functions and Operators' and 'Pattern Matching' chapters. • Read: 'NULLs in SQL' sections of Use The Index, Luke for how NULL interacts with indexes and predicates. • Practice: take any table you have, profile a nullable column with COUNT(*) vs COUNT(col), then write the same business filter twice — once naive, once NULL-safe — and diff the counts. • Next in DSM: your filters now return the right rows — ORDER BY & LIMIT teaches you to rank them and keep just the top N.",
    },

    /* ---------------------------------------------------------------- */
    /*  12 — Recap                                                       */
    /* ---------------------------------------------------------------- */
    {
      id: "recap",
      type: "recap",
      tocLabel: "Recap",
      content:
        "✓ WHERE evaluates a predicate per row and keeps only rows where it is true.\n✓ Comparison operators (=, <>, >, >=, <, <=) combine with AND, OR, NOT — and AND binds tighter than OR, so parenthesize mixed logic.\n✓ IN tests list membership, BETWEEN tests an inclusive range, LIKE matches patterns with % and _.\n✓ NULL comparisons yield unknown, and WHERE drops unknown rows — use IS NULL / IS NOT NULL.\n✓ NOT IN with a NULL in the list matches nothing; filter NULLs first or use NOT EXISTS.\n✓ Filter in the database, not in pandas — predicate pushdown is your biggest performance lever.\n\nNext up: ORDER BY & LIMIT. You can select the right rows — now you'll sort them, paginate them, and answer every 'top 10' question a stakeholder can throw at you.",
    },
  ],
};
