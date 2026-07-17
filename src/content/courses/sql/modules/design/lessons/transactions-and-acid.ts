import type { Lesson } from "@/lib/curriculum/types";

export const transactionsAndAcid: Lesson = {
  meta: {
    id: "sql.design.transactions-and-acid",
    slug: "transactions-and-acid",
    title: "Transactions & ACID",
    description:
      "Learn BEGIN/COMMIT/ROLLBACK, the four ACID guarantees, and enough isolation-level intuition to explain why your bank balance never half-updates.",
    estimatedTime: "30 mins",
    difficulty: "Advanced",
    xpReward: 90,
    prerequisites: ["sql.design.normalization"],
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
        hook: "You send a friend $50. The app debits your account… and crashes before crediting theirs. Where did the money go? If the database is doing its job: nowhere — the debit never happened either. That all-or-nothing guarantee isn't luck; it's a transaction, and it's the reason databases run the world's money.",
        what: "A transaction groups multiple statements into one atomic unit: BEGIN starts it, COMMIT makes every change permanent together, ROLLBACK undoes all of it. ACID names the four guarantees — Atomicity (all or nothing), Consistency (constraints always hold), Isolation (concurrent transactions don't see each other's half-done work), Durability (committed means survived-the-crash). You'll also build intuition for isolation levels — the dial between correctness and concurrency.",
        why: "Every system you'll analyze data FROM relies on transactions to stay correct under concurrent writes — and data scientists touch this directly: safe backfills and batch UPDATEs (wrap in a transaction, check, then commit), understanding why a long-running analytics query sees a consistent snapshot, and explaining anomalies like two reports disagreeing mid-load. ACID is also a guaranteed interview topic, and the vocabulary for every 'SQL vs NoSQL' trade-off discussion.",
        whereUsed:
          "Payments and inventory systems, safe data-cleaning scripts (BEGIN … verify … COMMIT), ETL loads that must appear atomically to dashboards, debugging deadlocks and lock waits, and the 'eventual consistency' debates around distributed systems.",
        objectives: [
          "Wrap multi-statement changes in BEGIN / COMMIT / ROLLBACK correctly",
          "Explain each ACID property with a concrete failure it prevents",
          "Describe the classic read anomalies: dirty read, non-repeatable read, phantom",
          "Map the standard isolation levels to which anomalies they allow",
          "Use transactions defensively in data work (verified backfills, atomic loads)",
        ],
        realWorldApps: [
          {
            company: "Stripe",
            headline: "Moving money atomically",
            detail:
              "Every charge touches multiple ledger rows — debit, credit, fees — inside one transaction; a partial write would literally create or destroy money, so atomicity is the product.",
          },
          {
            company: "Ticketmaster",
            headline: "One seat, thousands of buyers",
            detail:
              "Seat holds during an on-sale are isolation in action: two transactions trying to book seat 14C must serialize, or the venue oversells — the textbook lost-update problem at stadium scale.",
          },
          {
            company: "Airbnb",
            headline: "Atomic ETL publishing",
            detail:
              "Warehouse loads swap fully-built tables into place transactionally, so dashboards see yesterday's data or today's — never a half-loaded mixture mid-refresh.",
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
          type: "code-note",
          code: "BEGIN;\nUPDATE accounts SET balance = balance - 50 WHERE account_id = 1;\nUPDATE accounts SET balance = balance + 50 WHERE account_id = 2;\nCOMMIT;\n-- or, if anything looked wrong before committing:\n-- ROLLBACK;",
          content:
            "The mechanics are three keywords. BEGIN opens the transaction; every statement after it is provisional. COMMIT makes them all permanent, together, as one instant. ROLLBACK discards them all as if nothing happened. Without explicit BEGIN, most databases run each statement in its own implicit transaction — auto-commit — which is why a lone typo'd UPDATE is instantly permanent.",
        },
        {
          type: "keypoint",
          title: "A is for Atomicity: all or nothing",
          content:
            "A transaction either fully happens or fully doesn't — there is no state where the debit landed but the credit didn't. If the server crashes mid-transaction, recovery rolls the incomplete work back. This is what makes multi-step changes SAFE to attempt: the intermediate states are never visible facts, only the before and the after.",
        },
        {
          type: "keypoint",
          title: "C is for Consistency: constraints always hold",
          content:
            "Consistency means every committed state satisfies the schema's rules — CHECK constraints, foreign keys, uniqueness. A transfer that would push balance below a CHECK (balance >= 0) constraint fails and rolls back entirely; the database never commits a rule-breaking state. Note the division of labor: the database enforces the rules you DECLARED — 'the two updates should sum to zero' is consistency only if you encoded it (constraints, triggers) or your application logic keeps it inside one atomic transaction.",
        },
        {
          type: "keypoint",
          title: "I is for Isolation: concurrent ≈ sequential",
          content:
            "Hundreds of transactions run at once, but each behaves as if alone: no transaction sees another's uncommitted, half-done work. The gold standard — serializability — means the outcome equals SOME one-at-a-time ordering. Full isolation costs concurrency, so databases offer LEVELS that relax it in exchange for speed; the anomalies each level permits are named and standardized, and they're the next block.",
        },
        {
          type: "text",
          content:
            "The three classic read anomalies, in escalating subtlety. DIRTY READ: you read a row another transaction has modified but not committed — if it rolls back, you acted on data that never existed. NON-REPEATABLE READ: you read a row, someone else commits a change, you re-read within the same transaction and get a different value. PHANTOM READ: your WHERE clause matches a set of rows; someone commits an INSERT; re-running the same query surfaces a new 'phantom' row. The pattern: each anomaly is a different way another transaction's timing leaks into yours.",
        },
        {
          type: "code-note",
          code: "-- The standard levels, weakest → strongest:\n-- READ UNCOMMITTED  dirty reads possible (PG treats as READ COMMITTED)\n-- READ COMMITTED    no dirty reads; non-repeatable + phantoms possible  ← PG default\n-- REPEATABLE READ   stable re-reads; (in PG, snapshot: phantoms gone too)\n-- SERIALIZABLE      full serializability — some transactions retry\n\nBEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ;\nSELECT SUM(balance) FROM accounts;   -- consistent snapshot\n-- ... long analysis, other sessions commit freely ...\nSELECT SUM(balance) FROM accounts;   -- same answer as above\nCOMMIT;",
          content:
            "Isolation levels are the dial. READ COMMITTED (PostgreSQL's default) sees only committed data, but each STATEMENT sees the latest commits — two reads can disagree. REPEATABLE READ freezes a snapshot at first read: your whole transaction sees one consistent instant, which is exactly what a multi-query report wants. SERIALIZABLE adds detection of subtler write interleavings, aborting one transaction with a serialization error you must retry. Stronger level = fewer anomalies = more retries/waiting.",
        },
        {
          type: "keypoint",
          title: "D is for Durability: committed survives the crash",
          content:
            "Once COMMIT returns, the change survives power loss. The trick is the write-ahead log (WAL): before acknowledging, the database appends the change to a sequential log and forces it to disk; the table pages update later at leisure. Crash recovery replays the log. Sequential log writes are fast — this is how databases are both durable AND quick, and WAL-shipping is also how replicas stay in sync.",
        },
        {
          type: "analogy",
          title: "The whiteboard-and-notary analogy",
          content:
            "A transaction is drafting on a personal whiteboard: scribble the debit, scribble the credit, check your math. Nobody else can see your board (isolation). ROLLBACK is an eraser sweep. COMMIT walks the board to the notary, who copies it into the permanent ledger in one stamped entry (atomicity) — refusing entries that break the ledger's rules (consistency) — into a book that survives fire (durability). The anomalies are notary-office failures: reading someone's whiteboard before it's stamped (dirty read), the ledger changing between your two glances (non-repeatable read), new pages appearing mid-audit (phantom).",
        },
        {
          type: "warning",
          title: "The lost update: isolation's favorite trap",
          content:
            "Two sessions both run: read balance (100), compute +50 in app code, write 150. Both commit; one deposit vanished — a LOST UPDATE, and READ COMMITTED happily allows it because each write was individually valid. Cures, in order of preference: make the modification atomic in SQL (UPDATE accounts SET balance = balance + 50 — read and write in one statement, row-locked); or SELECT ... FOR UPDATE to lock the row through the read-modify-write; or SERIALIZABLE and retry on abort. The general lesson: read-then-write-back in application code is a concurrency bug until proven otherwise.",
        },
        {
          type: "expandable",
          title: "MVCC: how readers and writers avoid fighting",
          content:
            "PostgreSQL implements isolation with Multi-Version Concurrency Control: an UPDATE doesn't overwrite the row — it writes a NEW version stamped with its transaction ID, and each transaction sees the newest version visible to its snapshot. Readers never block writers and writers never block readers, which is why your hour-long analytics query runs happily against a hot OLTP table AND sees a perfectly consistent instant. The costs: dead row versions accumulate (VACUUM reclaims them), and long-running transactions hold old snapshots alive, bloating tables — why DBAs frown at your forgotten open BEGIN.",
        },
        {
          type: "expandable",
          title: "Locks, deadlocks, and the two-transaction embrace",
          content:
            "Writes take row locks held until COMMIT; a second writer on the same row simply waits. A DEADLOCK is mutual waiting: T1 locked row A and wants B; T2 locked B and wants A. The database detects the cycle and kills one victim with a deadlock error — the application retries. Prevention is discipline: touch rows in a consistent order (e.g. always lower account_id first), keep transactions short, and never hold one open across user think-time or network calls. For batch jobs updating millions of rows, chunking (N rows per transaction) bounds both lock scope and rollback cost.",
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
        title: "Life of a $50 Transfer",
        caption:
          "One transaction's journey, with the two exits and the crash path. Click each stage to see which ACID letter is on duty.",
        nodes: [
          {
            id: "begin",
            label: "BEGIN",
            sublabel: "transaction opens",
            detail:
              "A private workspace opens: changes made here are provisional and invisible to other sessions (Isolation). In PostgreSQL this means a snapshot — the transaction sees the database as of one consistent instant, via MVCC row versions.",
            x: 8,
            y: 40,
            accent: true,
          },
          {
            id: "debit",
            label: "UPDATE debit",
            sublabel: "balance − 50",
            detail:
              "The row is modified as a new version and row-locked until the transaction ends. Other writers targeting this row now wait; readers keep seeing the old committed version — readers never block.",
            x: 28,
            y: 20,
            accent: false,
          },
          {
            id: "credit",
            label: "UPDATE credit",
            sublabel: "balance + 50",
            detail:
              "The dangerous moment: debit done, credit in progress. Under atomicity this half-state is not a fact — no other session can observe it, and no crash can preserve it. Constraints (CHECK balance >= 0) are watching each change (Consistency).",
            x: 48,
            y: 20,
            accent: false,
          },
          {
            id: "decide",
            label: "Decision point",
            sublabel: "commit or abort?",
            detail:
              "The application (or a failed constraint, or a deadlock victim selection) decides. Everything before this point is reversible by design — which is precisely what makes multi-step changes safe to ATTEMPT.",
            x: 66,
            y: 40,
            accent: true,
          },
          {
            id: "commit",
            label: "COMMIT",
            sublabel: "WAL flushed → durable",
            detail:
              "The changes are appended to the write-ahead log and forced to disk BEFORE commit returns (Durability). Both updates become visible to others in the same instant — no observer ever sees just one. From here, power loss changes nothing: recovery replays the log.",
            x: 84,
            y: 18,
            accent: false,
          },
          {
            id: "rollback",
            label: "ROLLBACK",
            sublabel: "as if nothing happened",
            detail:
              "Every provisional change is discarded, locks release, the snapshot closes. The same path serves an explicit ROLLBACK, a constraint violation, or crash recovery rolling back in-flight work (Atomicity's other half).",
            x: 84,
            y: 62,
            accent: false,
          },
        ],
        edges: [
          { from: "begin", to: "debit", label: "step 1" },
          { from: "debit", to: "credit", label: "step 2" },
          { from: "credit", to: "decide" },
          { from: "decide", to: "commit", label: "all good" },
          { from: "decide", to: "rollback", label: "error / crash" },
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
          title: "The transfer, both endings",
          scenario:
            "Move $50 between accounts — once successfully, once discovering a problem mid-flight.",
          steps: [
            {
              code: "BEGIN;\nUPDATE accounts SET balance = balance - 50 WHERE account_id = 1;\nUPDATE accounts SET balance = balance + 50 WHERE account_id = 2;\nSELECT account_id, balance FROM accounts WHERE account_id IN (1,2);\nCOMMIT;",
              explanation:
                "The SELECT between updates and COMMIT is the underrated habit: inside the transaction you see your own provisional changes, so you can VERIFY before making them permanent. Other sessions still see the old balances until COMMIT lands both changes at once.",
            },
            {
              code: "BEGIN;\nUPDATE accounts SET balance = balance - 50 WHERE account_id = 1;\n-- verification reveals account 2 is frozen — abort!\nROLLBACK;\n-- balance of account 1 is back to its original value",
              explanation:
                "ROLLBACK undoes the debit completely — not by writing a compensating +50, but by discarding the provisional version so the original was never replaced. There is no window where the money was gone. This is why 'try it and check' is a legitimate strategy inside a transaction and a career-limiting one outside.",
            },
          ],
          output:
            "-- Path 1: COMMIT → both balances changed, atomically visible\n-- Path 2: ROLLBACK → zero net effect, as if never attempted",
        },
        {
          difficulty: "Easy",
          title: "The safe backfill pattern",
          scenario:
            "A data scientist must fix 12,000 rows with a wrong category label. One typo'd WHERE clause without a transaction = résumé time. The professional pattern:",
          steps: [
            {
              code: "BEGIN;\nUPDATE products\nSET category = 'Accessories'\nWHERE category = 'Acessories';   -- fixing a typo'd label\n-- UPDATE 12043",
              explanation:
                "Auto-commit is OFF the moment you BEGIN — the update is provisional. The reported row count is checkpoint one: expected ~12,000, got 12,043. Plausible. If it said 2,400,000, you'd know the WHERE was wrong and nothing bad has actually happened yet.",
            },
            {
              code: "SELECT category, COUNT(*) FROM products\nWHERE category LIKE 'Ac%'\nGROUP BY category;\n--  category    | count\n--  Accessories | 48210\n-- (typo'd spelling: gone)\nCOMMIT;",
              explanation:
                "Checkpoint two: query the post-state from INSIDE the transaction — you see your own changes, the rest of the world doesn't yet. Only when the evidence agrees do you COMMIT. Any surprise → ROLLBACK, at zero cost. This BEGIN → change → verify → COMMIT ritual is the single most valuable defensive habit in hands-on data work.",
            },
          ],
          output:
            "-- 12,043 rows fixed; verified before commit; rollback was free until the last keystroke",
        },
        {
          difficulty: "Medium",
          title: "Watching READ COMMITTED shift underfoot",
          scenario:
            "Session A runs a two-query report; session B commits a deposit between the queries. Same transaction, two different answers — and the isolation level that fixes it.",
          steps: [
            {
              code: "-- Session A (READ COMMITTED, the default):\nBEGIN;\nSELECT SUM(balance) FROM accounts;   -- 10000\n\n-- Session B, meanwhile:\n--   BEGIN; UPDATE accounts SET balance = balance + 500\n--   WHERE account_id = 7; COMMIT;\n\nSELECT SUM(balance) FROM accounts;   -- 10500  ← changed!\nCOMMIT;",
              explanation:
                "No dirty read occurred — A only ever saw COMMITTED data. But READ COMMITTED takes a fresh snapshot per STATEMENT, so B's commit lands between A's two queries: a non-repeatable read. For a multi-query report whose numbers must reconcile, this is a real bug — totals computed in query 1 won't match breakdowns in query 2.",
            },
            {
              code: "-- Session A, take two:\nBEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ;\nSELECT SUM(balance) FROM accounts;   -- 10000\n-- (B commits +500 here, exactly as before)\nSELECT SUM(balance) FROM accounts;   -- 10000  ← stable\nCOMMIT;\n-- a NEW transaction now sees 10500",
              explanation:
                "REPEATABLE READ pins one snapshot for the whole transaction: every query sees the database as of the same instant, so the report is internally consistent no matter what commits around it. B's deposit isn't lost — it's visible to any transaction that starts later. Rule of thumb: multi-query consistency requirement → wrap in REPEATABLE READ.",
            },
          ],
          output:
            "-- READ COMMITTED:  10000 then 10500 (non-repeatable read)\n-- REPEATABLE READ:  10000 then 10000 (one consistent snapshot)",
        },
        {
          difficulty: "Hard",
          title: "The lost update, demonstrated and killed",
          scenario:
            "Two app servers process deposits for the same account concurrently, using read-then-write code. One deposit evaporates. Reproduce, then fix two ways.",
          steps: [
            {
              code: "-- Both sessions, interleaved (READ COMMITTED):\n-- T1: SELECT balance FROM accounts WHERE account_id=1;  → 100\n-- T2: SELECT balance FROM accounts WHERE account_id=1;  → 100\n-- T1: UPDATE accounts SET balance = 150 WHERE account_id=1; COMMIT;\n-- T2: UPDATE accounts SET balance = 130 WHERE account_id=1; COMMIT;\n-- Final balance: 130. T1's +50 deposit is GONE.",
              explanation:
                "Each transaction individually did nothing wrong — both read committed data and wrote a valid value. The bug lives in the GAP between read and write: T2's arithmetic used a balance that was stale by write time. No error, no warning; the money is silently gone. This is the lost update, and default isolation does not prevent it.",
            },
            {
              code: "-- Fix 1 (best): make the read-modify-write ONE statement\nUPDATE accounts SET balance = balance + 50 WHERE account_id = 1;\nUPDATE accounts SET balance = balance + 30 WHERE account_id = 1;\n-- Final: 180. The row lock serializes them; both land.\n\n-- Fix 2: when app logic must intervene, lock through the gap\nBEGIN;\nSELECT balance FROM accounts WHERE account_id = 1 FOR UPDATE;\n-- (fraud checks, limit logic, etc. — row stays locked)\nUPDATE accounts SET balance = 130 WHERE account_id = 1;\nCOMMIT;",
              explanation:
                "Fix 1 collapses the gap: balance = balance + 50 reads and writes atomically under the row lock — the second UPDATE simply waits, then computes on the fresh value. Always prefer this when the new value is derivable in SQL. Fix 2, SELECT ... FOR UPDATE, holds the row lock from read to commit, forcing the other session's read to wait until yours finishes — correct when business logic between read and write genuinely needs the app layer. (Fix 3, SERIALIZABLE + retry loop, is the heavyweight general answer.)",
            },
          ],
          output:
            "-- Broken: 100 → 130 (one deposit lost)\n-- Fix 1:  100 → 180 (atomic increments serialize)\n-- Fix 2:  FOR UPDATE blocks the second reader until commit",
        },
        {
          difficulty: "Industry Example",
          title: "Atomic warehouse publishing",
          scenario:
            "A data engineer's nightly job rebuilds a revenue mart that executives watch all morning. The load takes 20 minutes — but dashboards must never see a half-loaded table. Transactions turn the swap into an instant.",
          steps: [
            {
              code: "-- Build the new day's mart OFF-STAGE (slow, no one watching):\nCREATE TABLE mart.revenue_daily_new AS\nSELECT DATE_TRUNC('day', o.created_at) AS day,\n       p.category,\n       SUM(oi.quantity * oi.price_at_purchase) AS revenue\nFROM orders o\nJOIN order_items oi ON oi.order_id = o.order_id\nJOIN products p    ON p.product_id = oi.product_id\nGROUP BY 1, 2;\n-- 20 minutes pass; dashboards still read the OLD table happily",
              explanation:
                "The expensive work happens on a table nobody queries — the old mart serves traffic untouched throughout. This sidesteps the worst pattern (DELETE + slow re-INSERT in place), where a dashboard refresh mid-load would show a mostly-empty table and someone pages the on-call about 'revenue collapsing'.",
            },
            {
              code: "-- The publish: two renames inside ONE transaction\nBEGIN;\nALTER TABLE mart.revenue_daily     RENAME TO revenue_daily_old;\nALTER TABLE mart.revenue_daily_new RENAME TO revenue_daily;\nCOMMIT;\nDROP TABLE mart.revenue_daily_old;",
              explanation:
                "Both renames commit as one instant: every query sees the complete old table or the complete new one — no observable in-between (atomicity doing analytics work; PostgreSQL's transactional DDL makes even schema changes rollback-able). A dashboard query already running keeps its snapshot and finishes on the old data consistently (MVCC). This blue-green table swap is the standard publish pattern in dbt-style pipelines — ACID guarantees, deployed as a deployment strategy.",
            },
          ],
          output:
            "-- 00:00–00:20  build revenue_daily_new (old table serves all reads)\n-- 00:20:00.001  atomic swap committed\n-- Observers: complete old data OR complete new data — never a mixture",
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
          "Complete the safe backfill: inside one transaction, apply a 10% price cut to the 'Clearance' category, verify the result from inside the transaction, and make it permanent. Fill in the blanks with the three transaction-control keywords and the verification query's table.",
        starterCode:
          "-- products(product_id, name, category, unit_price)\n-- Clearance rows before: ('Cable Organizer', 20.00), ('Phone Stand', 10.00)\n\n___;\n\nUPDATE products\nSET unit_price = ROUND(unit_price * 0.90, 2)\nWHERE category = 'Clearance';\n\n-- verify BEFORE making it permanent (visible only to this transaction):\nSELECT name, unit_price\nFROM ___\nWHERE category = 'Clearance'\nORDER BY name;\n\n-- the numbers look right → make it permanent:\n___;",
        solutionCode:
          "-- products(product_id, name, category, unit_price)\n-- Clearance rows before: ('Cable Organizer', 20.00), ('Phone Stand', 10.00)\n\nBEGIN;\n\nUPDATE products\nSET unit_price = ROUND(unit_price * 0.90, 2)\nWHERE category = 'Clearance';\n\n-- verify BEFORE making it permanent (visible only to this transaction):\nSELECT name, unit_price\nFROM products\nWHERE category = 'Clearance'\nORDER BY name;\n\n-- the numbers look right → make it permanent:\nCOMMIT;",
        expectedOutput:
          " name            | unit_price\n-----------------+------------\n Cable Organizer |      18.00\n Phone Stand     |       9.00\n(2 rows)",
        hints: [
          "Three blanks: the keyword that opens a transaction, the table the verification reads, and the keyword that makes changes permanent.",
          "BEGIN switches off auto-commit — everything after it is provisional until you decide.",
          "The verification is an ordinary SELECT on products: inside your own transaction you see your own uncommitted changes (20.00→18.00, 10.00→9.00).",
          "If the SELECT had shown wrong numbers, ROLLBACK would erase the update for free — since it looks right, COMMIT seals it.",
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
          id: "sql20_mcq_01",
          difficulty: "Easy",
          question:
            "A transfer transaction crashes after the debit UPDATE but before the credit UPDATE. What does the database guarantee?",
          options: [
            "The debit persists; the credit must be applied manually",
            "Recovery rolls back the debit too — the transaction happened entirely or not at all (Atomicity)",
            "Both updates persist because the statements each succeeded",
            "The database averages the two balances to compensate",
          ],
          correctIndex: 1,
          explanation:
            "Atomicity means the half-done state is never a committed fact: crash recovery undoes in-flight work, leaving both balances untouched. A surviving lone debit is precisely the disaster transactions exist to prevent; individually-successful statements inside an uncommitted transaction are provisional by definition; and no database invents compensating arithmetic.",
        },
        {
          type: "mcq",
          id: "sql20_mcq_02",
          difficulty: "Easy",
          question: "What does Durability specifically promise?",
          options: [
            "The database never crashes",
            "Uncommitted changes are saved periodically",
            "Once COMMIT returns, the change survives power loss — typically via a write-ahead log flushed to disk before acknowledging",
            "Data is always replicated to a second server",
          ],
          correctIndex: 2,
          explanation:
            "Durability is a promise about the moment COMMIT returns: the change is on stable storage (the WAL) and recovery will replay it after any crash. It doesn't prevent crashes — it makes them non-events for committed data. Uncommitted changes get the opposite treatment (rolled back), and replication is a separate availability concern, not part of the ACID contract.",
        },
        {
          type: "mcq",
          id: "sql20_mcq_03",
          difficulty: "Medium",
          question:
            "Within one transaction you run the same SELECT twice and get different values because another session committed an UPDATE in between. Which anomaly is this, and which isolation level stops it?",
          options: [
            "Dirty read; READ COMMITTED",
            "Non-repeatable read; REPEATABLE READ",
            "Phantom read; READ UNCOMMITTED",
            "Lost update; any level stops it",
          ],
          correctIndex: 1,
          explanation:
            "A committed change altering a row you re-read is the non-repeatable read — cured by REPEATABLE READ's transaction-long snapshot. A dirty read would require seeing UNcommitted data (already impossible at READ COMMITTED, which is where this anomaly occurs). Phantoms are new rows appearing in a re-run range query, not changed values. And the lost update is a write-write problem that default levels do NOT all prevent — it needs atomic updates, FOR UPDATE, or SERIALIZABLE.",
        },
        {
          type: "mcq",
          id: "sql20_mcq_04",
          difficulty: "Medium",
          question:
            "Two sessions run read-balance-in-app-code-then-write-new-balance concurrently; one deposit vanishes with no error. Which single-statement rewrite fixes it?",
          options: [
            "SELECT balance twice to double-check before writing",
            "UPDATE accounts SET balance = balance + 50 WHERE account_id = 1 — read and write in one atomic, row-locked statement",
            "Add an index on account_id so updates are faster",
            "Run both sessions at READ UNCOMMITTED so they see each other",
          ],
          correctIndex: 1,
          explanation:
            "The lost update lives in the gap between reading the value and writing back a stale computation. balance = balance + 50 closes the gap: the read happens inside the write, under the row lock, so concurrent increments queue and both land. Reading twice narrows the window without closing it; indexes change speed, not interleaving; and WEAKENING isolation adds dirty reads on top of the existing bug.",
        },
        {
          type: "scenario",
          id: "sql20_sc_01",
          difficulty: "Hard",
          scenario:
            "An analyst's morning report runs 6 queries over 10 minutes against the live OLTP database: totals first, then per-category breakdowns. Finance complains the breakdowns don't sum to the totals — orders keep committing during the run. The analyst proposes locking the tables for 10 minutes.",
          question: "What's the right fix?",
          options: [
            "LOCK TABLE orders for the duration — correctness requires blocking writers",
            "Run the report inside BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ — all 6 queries share one MVCC snapshot, perfectly consistent, while writers proceed unblocked",
            "Run each query at SERIALIZABLE in its own transaction",
            "Add SUM checks and re-run until the numbers happen to match",
          ],
          correctIndex: 1,
          explanation:
            "The complaint is textbook non-repeatable/phantom behavior across statements. REPEATABLE READ pins one snapshot for the whole transaction: every query sees the same instant, so breakdowns reconcile with totals exactly — and thanks to MVCC, readers block nobody: OLTP writes continue at full speed. Table locks buy the same consistency by halting the business — the worst trade available. SERIALIZABLE per-query in SEPARATE transactions misses the point entirely (each gets its own snapshot — the original bug). Retry-until-lucky is not a consistency model. One caveat worth knowing: a 10-minute snapshot delays vacuum slightly — fine at this scale, worth watching for hour-long jobs.",
        },
        {
          type: "coding",
          id: "sql20_code_01",
          difficulty: "Hard",
          prompt:
            "Inventory oversell guard: write one transaction that (1) locks product 42's inventory row with SELECT ... FOR UPDATE, (2) decrements stock_count by 3 only if sufficient stock exists — expressed as UPDATE ... WHERE stock_count >= 3, (3) inserts the order line into order_items (order_id 9001, product_id 42, quantity 3, price_at_purchase 25.00), and (4) commits. Use inventory(product_id, stock_count).",
          starterCode:
            "-- inventory(product_id, stock_count)   -- product 42 has stock_count = 5\n-- order_items(order_id, product_id, quantity, price_at_purchase)\n\n",
          solutionCode:
            "BEGIN;\n\nSELECT stock_count\nFROM inventory\nWHERE product_id = 42\nFOR UPDATE;\n\nUPDATE inventory\nSET stock_count = stock_count - 3\nWHERE product_id = 42\n  AND stock_count >= 3;\n\nINSERT INTO order_items (order_id, product_id, quantity, price_at_purchase)\nVALUES (9001, 42, 3, 25.00);\n\nCOMMIT;",
          expectedOutput:
            "BEGIN\n stock_count\n-------------\n           5\n(1 row)\n\nUPDATE 1\nINSERT 0 1\nCOMMIT\n-- inventory for product 42 is now 2; concurrent checkouts waited at FOR UPDATE",
          tests: [
            {
              name: "Row locked through the decision",
              description:
                "SELECT ... FOR UPDATE holds product 42's row from read to COMMIT, so a concurrent checkout can't read the same stale stock",
            },
            {
              name: "Guarded decrement",
              description:
                "UPDATE's WHERE includes stock_count >= 3 — insufficient stock updates 0 rows instead of going negative",
            },
            {
              name: "Atomic pair",
              description:
                "Stock decrement and order-line insert commit together — no state where the sale exists without the stock reduction",
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
          question: "Explain ACID — with a concrete failure each letter prevents.",
          answer:
            "Atomicity: all statements in a transaction commit or none do. Prevents: a crash between debit and credit leaving money destroyed — recovery rolls the debit back. Consistency: every committed state satisfies declared constraints (CHECKs, foreign keys, uniqueness). Prevents: a transfer committing an account below its CHECK (balance >= 0) floor — the whole transaction aborts instead. Isolation: concurrent transactions can't observe each other's uncommitted work; at full strength the outcome equals some serial ordering. Prevents: a report reading a half-finished transfer and showing money that exists in two places. Durability: once COMMIT returns, the change survives power loss, via the write-ahead log flushed before acknowledgment. Prevents: a confirmed order vanishing because the server died a second later. I'd add the practical nuance: A, C, and D are essentially absolute, while I is a dial — isolation LEVELS trade anomaly-freedom against concurrency, which is where most real-world subtlety lives.",
        },
        {
          question:
            "Compare the isolation levels. What does each allow, and what would you actually use when?",
          answer:
            "READ UNCOMMITTED permits dirty reads — seeing uncommitted data that may roll back; PostgreSQL doesn't truly offer it (treats it as READ COMMITTED). READ COMMITTED — the common default — sees only committed data, but takes a fresh snapshot per statement, so non-repeatable reads and phantoms occur between queries; right for typical OLTP where each statement is self-contained, especially with atomic updates (SET x = x + 1). REPEATABLE READ pins one snapshot for the whole transaction: re-reads are stable and (in PostgreSQL's snapshot implementation) phantoms are gone too; it's my default for multi-query reports, backfills with verification steps, and anything where numbers from different queries must reconcile. SERIALIZABLE guarantees equivalence to some serial order, catching subtler write-interleaving bugs (like write skew) — at the price of serialization failures that the application must catch and retry; right for genuinely intertwined financial logic. Practical summary: default + atomic single-statement writes for OLTP, REPEATABLE READ for consistent reads, SERIALIZABLE + retry loop where correctness of concurrent WRITES is the product.",
        },
        {
          question:
            "As a data scientist, when do transactions actually matter to you day to day?",
          answer:
            "Four recurring places. Defensive data surgery: any hand-run UPDATE or DELETE goes inside BEGIN → check the affected row count → SELECT the new state → COMMIT or ROLLBACK; the transaction converts a potentially catastrophic typo into a free do-over. Consistent multi-query analysis: a report or feature-extraction job whose queries must agree runs under REPEATABLE READ, buying a frozen snapshot of a live database without blocking a single write — MVCC's gift to analysts. Atomic publishing: pipeline outputs swap into place transactionally (build new table, rename inside one transaction), so downstream dashboards never see half-loaded data — and understanding this pattern helps me debug when someone else's pipeline DIDN'T do it. Interpreting anomalies: when two systems disagree, knowing about snapshots, commit timing, and replication lag turns 'the data is wrong' into 'query A's snapshot predates load B' — a diagnosis instead of a mystery. The meta-point: analysts live downstream of concurrency; transactions are the physics of why the numbers are what they are.",
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
        "1) Running destructive UPDATEs/DELETEs in auto-commit — no BEGIN means no ROLLBACK; the safe ritual is BEGIN → change → verify counts and state → COMMIT. 2) Read-then-write-back in application code — the lost-update gap; prefer atomic SET x = x + delta, or FOR UPDATE when app logic must sit in the middle. 3) Confusing the anomalies — dirty = uncommitted data seen; non-repeatable = a row CHANGED between re-reads; phantom = new rows APPEARED in a re-run query. 4) Fixing read-consistency with table locks — REPEATABLE READ gives a consistent snapshot while writers proceed; locks halt the business. 5) Leaving transactions open (idle-in-transaction) — held locks block writers and pinned snapshots bloat tables; keep transactions short and never hold one across think-time.",
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
        "Try these prompts in the AI Tutor panel: • 'ELI5 ACID with the whiteboard-and-notary analogy, then quiz me letter by letter.' • 'Play two concurrent sessions and make me predict what each SELECT returns at READ COMMITTED vs REPEATABLE READ.' • 'Walk me into a lost update step by step, then make me fix it three different ways.' • 'Give me a messy backfill task and check whether my transaction ritual is safe.' • 'Interview mode: ask me to design an inventory checkout that can't oversell, and attack my answer with interleavings.'",
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
        "Transaction — a group of statements executing as one atomic unit (BEGIN … COMMIT/ROLLBACK). Auto-commit — each statement runs as its own instant transaction; the default outside BEGIN. Atomicity — all or nothing. Consistency — committed states satisfy all declared constraints. Isolation — concurrent transactions don't observe each other's in-flight work. Durability — committed changes survive crashes (via the WAL). Write-ahead log (WAL) — changes logged to disk before commit acknowledgment; replayed in recovery. Dirty read — reading uncommitted data. Non-repeatable read — a re-read row changed within one transaction. Phantom read — a re-run query matches new rows. Lost update — concurrent read-modify-write where one write silently overwrites another. Isolation levels — READ UNCOMMITTED → READ COMMITTED → REPEATABLE READ → SERIALIZABLE. Snapshot / MVCC — each transaction reads a consistent version of the data; readers and writers don't block each other. SELECT … FOR UPDATE — locks read rows until commit. Deadlock — transactions waiting on each other's locks; one is aborted and retried. Serialization failure — SERIALIZABLE aborting a transaction that must be retried.",
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
        "• Deep dive: 'Designing Data-Intensive Applications' (Kleppmann), Ch. 7 'Transactions' — the best treatment of isolation anomalies in print. • Docs: PostgreSQL manual 'Transaction Isolation' — short, precise, and the source of truth for MVCC behavior. • Interactive: open two psql/DB-client windows and REPRODUCE the lesson's demos — the non-repeatable read and the lost update; seeing the interleaving live cements it permanently. • Practice: adopt the BEGIN → verify → COMMIT ritual on your very next data fix. • Next in DSM: the Design module is complete — the Analysis module begins with SQL for EDA, turning everything you've built toward profiling real datasets.",
    },

    /* ---------------------------------------------------------------- */
    /*  12 — Recap                                                       */
    /* ---------------------------------------------------------------- */
    {
      id: "recap",
      type: "recap",
      tocLabel: "Recap",
      content:
        "✓ BEGIN makes changes provisional; COMMIT lands them all at one instant; ROLLBACK erases them for free — the safe-backfill ritual is BEGIN → change → verify → COMMIT.\n✓ ACID: Atomicity (all or nothing), Consistency (constraints always hold), Isolation (no seeing half-done work), Durability (committed survives crashes via the WAL).\n✓ Anomaly ladder: dirty read (uncommitted seen) → non-repeatable read (row changed between re-reads) → phantom (new rows appear); isolation levels trade these off against concurrency.\n✓ REPEATABLE READ = one consistent snapshot for multi-query reports, without blocking writers (MVCC).\n✓ The lost update hides in read-then-write-back code — close the gap with atomic SET x = x + delta, FOR UPDATE, or SERIALIZABLE + retry.\n✓ Keep transactions short; atomic table swaps publish pipeline output without half-loaded states.\n\nNext up: SQL for EDA. The Design module is done — you know how data is structured, sped up, and kept correct. Now the Analysis module puts it all to work: profiling unfamiliar datasets, hunting data quality issues, and building cohorts and funnels in pure SQL.",
    },
  ],
};
