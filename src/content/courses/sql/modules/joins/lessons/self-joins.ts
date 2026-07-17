import type { Lesson } from "@/lib/curriculum/types";

export const selfJoins: Lesson = {
  meta: {
    id: "sql.joins.self-joins",
    slug: "self-joins",
    title: "Self Joins",
    description:
      "Join a table to itself with aliases to walk hierarchies, compare rows within the same table, and analyze sequences and pairs.",
    estimatedTime: "25 mins",
    difficulty: "Intermediate",
    xpReward: 70,
    prerequisites: ["sql.joins.inner-join"],
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
        hook: "Who is each employee's manager? The answer lives in the SAME employees table — the manager_id column points at another row of it. To ask that question, the table has to meet itself at the join keyboard. That trick, the self join, unlocks hierarchies, row-to-row comparisons, and sequence analysis.",
        what: "A self join joins a table to itself. You list the same table twice under different aliases — say e for the employee role and m for the manager role — and write an ON condition connecting a row to a DIFFERENT row of the same table. The engine treats the two aliases as two independent tables that happen to share data.",
        why: "Plenty of real-world structure is row-to-row within one table: org charts (employee→manager), referrals (user→referrer), product substitutions, consecutive events by the same customer. Without self joins you'd export the table twice and merge it in pandas; with them, one query answers 'compare this row to that row' natively.",
        whereUsed:
          "Org-chart reporting, referral attribution, month-over-month comparisons before window functions, duplicate detection, and 'customers who bought X also bought Y' pair analysis.",
        objectives: [
          "Alias one table twice and explain why aliases are mandatory in a self join",
          "Resolve a parent-child hierarchy (employee → manager) with a self INNER and LEFT join",
          "Compare rows of the same table to each other (same customer, different orders)",
          "Generate unique pairs with an inequality condition and avoid self-pairing",
          "Recognize when a self join is the right tool versus a window function",
        ],
        realWorldApps: [
          {
            company: "Salesforce",
            headline: "Role hierarchies",
            detail:
              "Accounts, territories, and user roles reference parent rows in their own tables; reporting rollups resolve manager and parent-territory names via self joins.",
          },
          {
            company: "Dropbox",
            headline: "Referral program analytics",
            detail:
              "Each user row stores referred_by_user_id; joining users to itself attributes signups to referrers and measures viral loops.",
          },
          {
            company: "Amazon",
            headline: "Frequently bought together",
            detail:
              "Pair analysis joins the order_items table to itself on order_id with product_a < product_b to count co-purchased product pairs at scale.",
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
            "Syntactically a self join is nothing new: FROM employees e JOIN employees m ON m.employee_id = e.manager_id. The only novelty is that both sides name the same table — so aliases stop being a convenience and become mandatory. Without them, every column reference (employee_id? whose?) is ambiguous and the query won't parse.",
        },
        {
          type: "analogy",
          title: "Two photocopies of one phone book",
          content:
            "Imagine photocopying the company directory and laying both copies on your desk — the left copy for looking people up as employees, the right copy for looking the SAME people up as managers. When you read 'Priya, manager_id 17', you keep a finger on Priya in the left copy and flip the right copy to id 17 to find her manager's name. The aliases e and m are your two copies; the data is identical, the roles differ.",
        },
        {
          type: "keypoint",
          title: "Aliases define roles, not data",
          content:
            "e and m scan the same rows; what differs is the role each alias plays in the ON condition. Name aliases after roles (e/m, child/parent, first_order/second_order) — never t1/t2. In a self join, readable aliases are the difference between obvious and unreviewable SQL.",
        },
        {
          type: "code-note",
          code: "SELECT e.name AS employee,\n       m.name AS manager\nFROM employees e\nINNER JOIN employees m\n  ON m.employee_id = e.manager_id;",
          content:
            "The hierarchy pattern: each employee row carries a foreign key (manager_id) pointing at another row of the same table — a self-referencing foreign key. The ON clause connects child to parent. Note both output columns come from the same physical column (name) via different aliases — aliasing the outputs is essential too.",
        },
        {
          type: "warning",
          title: "INNER self join drops the root",
          content:
            "The CEO has manager_id NULL — no row matches, so an INNER self join silently removes the CEO from the org report. If the hierarchy's root(s) must appear, use LEFT JOIN employees m … and the CEO comes back with a NULL manager name. This is the LEFT-vs-INNER decision from the previous lessons wearing an org chart.",
        },
        {
          type: "text",
          content:
            "The second big use is row-to-row comparison: join a table to itself on a shared attribute and relate DIFFERENT rows. Example: find order pairs by the same customer — ON o2.customer_id = o1.customer_id AND o2.order_id <> o1.order_id. The inequality matters: without it, every row happily matches itself, and your 'pairs' are contaminated by self-pairs.",
        },
        {
          type: "keypoint",
          title: "< beats <> for pair generation",
          content:
            "With o2.order_id <> o1.order_id, each pair appears twice — (A,B) and (B,A). Using < instead (o1.order_id < o2.order_id) keeps each unordered pair exactly once AND excludes self-pairs in one stroke. For 'find duplicates' and 'co-purchase pairs' queries, < is the professional idiom; <> doubles your counts.",
        },
        {
          type: "expandable",
          title: "Self join vs window function",
          content:
            "Before window functions (coming in the Advanced module), 'compare each row to the previous one' was done with self joins on sequence numbers: ON b.seq = a.seq + 1. Window functions (LAG/LEAD) now express that more clearly and usually faster, without the join. Rule of thumb: sequences and running comparisons → window functions; hierarchies, arbitrary row pairing, and pair generation → self joins. Multi-LEVEL hierarchy walks (manager's manager's manager…) need either chained self joins per level or a recursive CTE — also previewed in the Advanced module.",
        },
        {
          type: "expandable",
          title: "How many rows can a self join produce?",
          content:
            "Fan-out applies with a vengeance because both sides are the same size. A pair self join on customer_id where one customer has n orders produces n×(n−1) rows with <>, or n×(n−1)/2 with <. A power user with 1,000 orders contributes ~500k pairs with < — one hot key can dominate the whole result. Always estimate the largest group size (GROUP BY key ORDER BY COUNT(*) DESC LIMIT 5) before running pair analysis on a big table.",
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
        kind: "architecture",
        title: "One Table, Two Roles",
        caption:
          "The employees table participates twice under different aliases. Click each node to see how a single physical table plays both sides of the join.",
        nodes: [
          {
            id: "table",
            label: "employees",
            sublabel: "physical table",
            detail:
              "One table on disk: employee_id, name, manager_id, salary. The manager_id column is a self-referencing foreign key — it stores the employee_id of another row in this same table (NULL for the CEO).",
            x: 50,
            y: 12,
            accent: true,
          },
          {
            id: "aliasE",
            label: "alias e",
            sublabel: "role: employee",
            detail:
              "A full scan of employees in the 'child' role. Every employee row enters the join from this side. Its manager_id is the value we need to resolve into a human-readable name.",
            x: 22,
            y: 45,
            accent: false,
          },
          {
            id: "aliasM",
            label: "alias m",
            sublabel: "role: manager",
            detail:
              "The same rows again, in the 'parent' role. Only rows whose employee_id appears in someone's manager_id actually pair up — individual contributors on this side simply match nothing.",
            x: 78,
            y: 45,
            accent: false,
          },
          {
            id: "on",
            label: "ON m.employee_id = e.manager_id",
            sublabel: "child → parent link",
            detail:
              "The join condition follows the self-referencing foreign key: e's pointer must equal m's identity. Reversing it (m.manager_id = e.employee_id) would ask the opposite question — 'who reports to e?'",
            x: 50,
            y: 62,
            accent: true,
          },
          {
            id: "inner",
            label: "INNER result",
            sublabel: "CEO missing",
            detail:
              "Employee-manager pairs only. The CEO (manager_id NULL) matches no m row and vanishes — fine for 'who reports to whom' lists, wrong for a complete org roster.",
            x: 28,
            y: 88,
            accent: false,
          },
          {
            id: "left",
            label: "LEFT result",
            sublabel: "CEO kept, manager NULL",
            detail:
              "LEFT JOIN preserves every e row; the CEO appears with a NULL manager column, typically rendered via COALESCE(m.name, '—'). Choose based on whether roots belong in the report.",
            x: 72,
            y: 88,
            accent: false,
          },
        ],
        edges: [
          { from: "table", to: "aliasE", label: "scanned as" },
          { from: "table", to: "aliasM", label: "scanned as" },
          { from: "aliasE", to: "on" },
          { from: "aliasM", to: "on" },
          { from: "on", to: "inner", label: "INNER" },
          { from: "on", to: "left", label: "LEFT" },
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
          title: "Employee and manager names",
          scenario:
            "employees(employee_id, name, manager_id): (1,'Sofia',NULL), (2,'Priya',1), (3,'Marco',1), (4,'Lena',2). Show each employee with their manager's name.",
          steps: [
            {
              code: "SELECT e.name AS employee,\n       m.name AS manager\nFROM employees e\nINNER JOIN employees m\n  ON m.employee_id = e.manager_id;",
              explanation:
                "Priya's manager_id 1 finds Sofia's row on the m side; same for Marco. Lena's manager_id 2 finds Priya. Sofia (manager_id NULL) matches nothing and is absent — the INNER-drops-the-root effect. Three rows out of four employees.",
            },
          ],
          output:
            " employee | manager\n----------+---------\n Priya    | Sofia\n Marco    | Sofia\n Lena     | Priya\n(3 rows)",
        },
        {
          difficulty: "Easy",
          title: "Keeping the CEO",
          scenario: "Same table — but HR wants ALL four employees listed.",
          steps: [
            {
              code: "SELECT e.name AS employee,\n       COALESCE(m.name, '(top level)') AS manager\nFROM employees e\nLEFT JOIN employees m\n  ON m.employee_id = e.manager_id\nORDER BY e.employee_id;",
              explanation:
                "LEFT JOIN preserves every e row; Sofia comes through with m.* NULL-filled, and COALESCE renders the gap as a label instead of a blank. The only change from the previous query is the join keyword — the ON clause is untouched.",
            },
          ],
          output:
            " employee | manager\n----------+-------------\n Sofia    | (top level)\n Priya    | Sofia\n Marco    | Sofia\n Lena     | Priya\n(4 rows)",
        },
        {
          difficulty: "Medium",
          title: "Direction matters: who reports to whom",
          scenario:
            "Flip the question: for each manager, list their direct reports — and notice how the ON clause changes.",
          steps: [
            {
              code: "SELECT m.name AS manager,\n       e.name AS direct_report\nFROM employees m\nINNER JOIN employees e\n  ON e.manager_id = m.employee_id\nORDER BY m.name, e.name;",
              explanation:
                "Same tables, same key columns — but now the m side is the anchor and we follow the foreign key backwards: e rows whose manager_id equals this m row's id. A manager with three reports produces three rows (fan-out is the point here). Individual contributors appear only on the e side, never as m matches.",
            },
            {
              code: "-- Aggregation on top: span of control\nSELECT m.name AS manager, COUNT(*) AS reports\nFROM employees m\nINNER JOIN employees e\n  ON e.manager_id = m.employee_id\nGROUP BY m.name\nORDER BY reports DESC;",
              explanation:
                "GROUP BY collapses the fan-out into a per-manager count — the org-health metric 'span of control'. Self joins compose with everything from the Foundations module exactly like ordinary joins.",
            },
          ],
          output:
            " manager | reports\n---------+---------\n Sofia   |       2\n Priya   |       1\n(2 rows)",
        },
        {
          difficulty: "Hard",
          title: "Unique co-purchase pairs",
          scenario:
            "From order_items(order_id, product_id), count how often each product PAIR appears in the same order — each unordered pair once, no self-pairs.",
          steps: [
            {
              code: "SELECT\n  a.product_id AS product_a,\n  b.product_id AS product_b\nFROM order_items a\nINNER JOIN order_items b\n  ON b.order_id = a.order_id\n AND b.product_id > a.product_id",
              explanation:
                "Joining on the same order_id relates items that shared a basket. The inequality b.product_id > a.product_id does double duty: it removes self-pairs (a product with itself) AND keeps each pair in only one orientation — (3,7) but never (7,3). With <> instead, every pair would count twice.",
            },
            {
              code: "SELECT\n  a.product_id AS product_a,\n  b.product_id AS product_b,\n  COUNT(*) AS times_together\nFROM order_items a\nINNER JOIN order_items b\n  ON b.order_id = a.order_id\n AND b.product_id > a.product_id\nGROUP BY a.product_id, b.product_id\nORDER BY times_together DESC\nLIMIT 3;",
              explanation:
                "Grouping the pair columns and counting gives the co-occurrence table — the raw material of 'frequently bought together'. Cost warning from the theory: an order with n items contributes n(n−1)/2 pairs, so a single 200-item wholesale order adds ~20k rows; profile max basket size first.",
            },
          ],
          output:
            " product_a | product_b | times_together\n-----------+-----------+----------------\n         3 |         7 |            214\n         3 |        12 |            180\n         7 |        12 |            166\n(3 rows)",
        },
        {
          difficulty: "Industry Example",
          title: "Referral attribution at a subscription company",
          scenario:
            "users(user_id, name, signup_date, referred_by_user_id, plan) — referred_by_user_id is a self-referencing key, NULL for organic signups. Growth wants each referrer's paid-conversion count among their referrals.",
          steps: [
            {
              code: "SELECT\n  ref.name AS referrer,\n  u.name   AS referred_user,\n  u.plan\nFROM users u\nINNER JOIN users ref\n  ON ref.user_id = u.referred_by_user_id",
              explanation:
                "u is the referred cohort, ref the referrer role. INNER is correct for once: organic users (NULL referrer) are genuinely out of scope for a referral report, so dropping them is the requirement, not a bug — the LEFT-vs-INNER decision made consciously.",
            },
            {
              code: "WHERE u.plan <> 'free'",
              explanation:
                "Filter the referred side to paid conversions. This condition is on the u alias, which the INNER join fully preserves-or-drops as a unit, so WHERE placement is safe here.",
            },
            {
              code: "GROUP BY ref.name\nORDER BY COUNT(*) DESC;\n-- final SELECT: ref.name, COUNT(*) AS paid_referrals",
              explanation:
                "One row per referrer with their paid-referral count — the leaderboard that pays out referral bonuses. The full pattern: self join for the relationship, WHERE for the business filter, GROUP BY for the metric. At Dropbox-scale this exact query shape measured one of the most famous growth loops in tech.",
            },
          ],
          output:
            " referrer | paid_referrals\n----------+----------------\n Priya    |             14\n Marco    |              9\n Lena     |              4\n(3 rows)",
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
          "HR needs a salary sanity report: every employee who earns MORE than their direct manager. From employees(employee_id, name, manager_id, salary), return the employee's name (employee), their salary (emp_salary), the manager's name (manager), and the manager's salary (mgr_salary). Fill in the blanks.",
        starterCode:
          "-- employees(employee_id, name, manager_id, salary)\n-- Rows: (1,'Sofia',NULL,120000), (2,'Priya',1,95000),\n--       (3,'Marco',1,98000), (4,'Lena',2,99000)\n\nSELECT\n  e.name   AS employee,\n  e.salary AS emp_salary,\n  ___.name   AS manager,\n  m.salary AS mgr_salary\nFROM employees e\nINNER JOIN employees ___\n  ON m.employee_id = e.___\nWHERE e.salary ___ m.salary;",
        solutionCode:
          "-- employees(employee_id, name, manager_id, salary)\n-- Rows: (1,'Sofia',NULL,120000), (2,'Priya',1,95000),\n--       (3,'Marco',1,98000), (4,'Lena',2,99000)\n\nSELECT\n  e.name   AS employee,\n  e.salary AS emp_salary,\n  m.name   AS manager,\n  m.salary AS mgr_salary\nFROM employees e\nINNER JOIN employees m\n  ON m.employee_id = e.manager_id\nWHERE e.salary > m.salary;",
        expectedOutput:
          " employee | emp_salary | manager | mgr_salary\n----------+------------+---------+------------\n Lena     |      99000 | Priya   |      95000\n(1 row)",
        hints: [
          "Four blanks: the manager alias twice, the self-referencing key column, and a comparison operator.",
          "The second employees scan needs the alias m — it plays the manager role, and both SELECT and ON already reference it.",
          "The child-to-parent link is ON m.employee_id = e.manager_id — the employee's pointer equals the manager's identity.",
          "'Earns more than their manager' is e.salary > m.salary. Only Lena (99k) beats her manager Priya (95k); Marco's 98k loses to Sofia's 120k.",
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
          id: "sql10_mcq_01",
          difficulty: "Easy",
          question: "Why are table aliases mandatory in a self join?",
          options: [
            "They make the query run faster",
            "The same table appears twice, so unaliased column references would be ambiguous",
            "SQL requires aliases in every join",
            "Aliases create a temporary copy of the table",
          ],
          correctIndex: 1,
          explanation:
            "With employees on both sides, a bare reference like employee_id could mean either scan — the parser refuses the ambiguity, so each occurrence needs its own alias. Aliases are readability sugar elsewhere but a hard requirement here. They have no performance effect and copy no data — both aliases scan the same physical table.",
        },
        {
          type: "mcq",
          id: "sql10_mcq_02",
          difficulty: "Easy",
          question:
            "In FROM employees e JOIN employees m ON m.employee_id = e.manager_id, what does a result row represent?",
          options: [
            "Two unrelated employees",
            "An employee (e) paired with their manager (m)",
            "A manager (e) paired with one direct report (m)",
            "An employee paired with themselves",
          ],
          correctIndex: 1,
          explanation:
            "The ON clause follows e's manager_id pointer to the m row whose employee_id it names — so e is the child, m the parent. Option C describes the reversed condition (e.employee_id = m.manager_id). Unrelated employees never satisfy the ON predicate, and self-pairing would require an employee to be their own manager (manager_id = employee_id), which the data model shouldn't contain.",
        },
        {
          type: "mcq",
          id: "sql10_mcq_03",
          difficulty: "Medium",
          question:
            "A pair-generation self join uses ON b.id <> a.id instead of ON b.id > a.id. What is the consequence?",
          options: [
            "Self-pairs contaminate the result",
            "Each unordered pair appears twice — (A,B) and (B,A) — doubling counts",
            "The join returns no rows",
            "No difference; the conditions are equivalent",
          ],
          correctIndex: 1,
          explanation:
            "<> excludes self-pairs but keeps both orientations of every pair, so downstream COUNT(*)s are exactly 2× the true pair frequency. The > form keeps one canonical orientation AND kills self-pairs in one condition. Self-pairs are excluded by both forms (a row never satisfies id <> its own id... more precisely, it fails both <> and >). The conditions differ, and both return plenty of rows on real data.",
        },
        {
          type: "mcq",
          id: "sql10_mcq_04",
          difficulty: "Medium",
          question:
            "An org-chart query uses INNER JOIN employees m ON m.employee_id = e.manager_id. Which employees are missing from the output?",
          options: [
            "Employees with no direct reports",
            "Employees whose manager_id is NULL (the hierarchy roots)",
            "Managers of more than one person",
            "Nobody — INNER JOIN keeps all employees",
          ],
          correctIndex: 1,
          explanation:
            "A NULL manager_id matches no m row (NULL never equals anything), and INNER JOIN drops non-matching e rows — so the CEO and any other root vanishes. Employees WITHOUT reports are unaffected on the e side; they just never appear as m matches. Multi-report managers appear multiple times (fan-out), not zero. Switching to LEFT JOIN restores the roots with NULL manager columns.",
        },
        {
          type: "scenario",
          id: "sql10_sc_01",
          difficulty: "Hard",
          scenario:
            "An analyst runs a co-purchase pair query (self join of order_items on order_id with product_a < product_b) on a marketplace table. It has run for 40 minutes; the same query finished in seconds on last year's data. Investigation shows a new B2B customer whose single orders contain up to 5,000 items.",
          question: "Why is the query exploding, and what is the pragmatic fix?",
          options: [
            "The < condition is wrong; switching to <> will halve the work",
            "Pair count grows quadratically with basket size — one 5,000-item order alone generates ~12.5M pairs; cap or exclude oversized baskets (or pre-aggregate) before pairing",
            "Self joins can't use indexes; add an index on product_id",
            "The table needs VACUUM; pair queries are otherwise linear",
          ],
          correctIndex: 1,
          explanation:
            "Pairs per order are n(n−1)/2 — quadratic. A 5,000-item basket contributes ~12.5 million rows on its own, dwarfing a year of normal 3-item baskets. The standard mitigations: filter baskets above a size threshold (HAVING COUNT(*) <= 50 in a pre-aggregation step), or sample the big ones, since pathological baskets rarely reflect the consumer behavior the analysis targets. <> would DOUBLE the work, not halve it. Indexes and VACUUM don't change the output cardinality, which is the actual cost driver.",
        },
        {
          type: "coding",
          id: "sql10_code_01",
          difficulty: "Hard",
          prompt:
            "Detect duplicate customer records: from customers(customer_id, email, name), return pairs of DIFFERENT customer_ids sharing the same email — each pair once, lower id first. Columns: id_a, id_b, email.",
          starterCode:
            "-- customers(customer_id, email, name)\n-- Rows: (1,'ana@x.com','Ana'), (2,'ben@y.com','Ben'),\n--       (3,'ana@x.com','Ana M.'), (4,'cara@z.com','Cara'), (5,'ben@y.com','Benjamin')\n\n",
          solutionCode:
            "SELECT\n  a.customer_id AS id_a,\n  b.customer_id AS id_b,\n  a.email\nFROM customers a\nINNER JOIN customers b\n  ON b.email = a.email\n AND b.customer_id > a.customer_id\nORDER BY id_a;",
          expectedOutput:
            " id_a | id_b | email\n------+------+-----------\n    1 |    3 | ana@x.com\n    2 |    5 | ben@y.com\n(2 rows)",
          tests: [
            {
              name: "Self join on the duplicate attribute",
              description: "Joins customers to itself on email equality",
            },
            {
              name: "Canonical pairs",
              description: "b.customer_id > a.customer_id yields each pair once with the lower id first, and no self-pairs",
            },
            {
              name: "Correct duplicates",
              description: "Finds (1,3) and (2,5) only — Cara has no duplicate",
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
            "What is a self join, and what kinds of questions require one?",
          answer:
            "A self join joins a table to itself under two aliases, treating the same data as two logical tables playing different roles. It's required whenever the relationship you're querying is row-to-row within one table. The archetypes: hierarchies stored as self-referencing foreign keys (employee→manager, category→parent-category), where the join resolves a pointer into readable parent attributes; row comparison within a grouping (two orders by the same customer, duplicate emails); and pair generation (products co-occurring in a basket). Mechanically nothing changes versus a normal join — same ON semantics, same fan-out rules, same INNER/LEFT decision — but aliases become mandatory for disambiguation, and I name them for roles (e/m, child/parent) rather than t1/t2 so the query reads as the business question it answers.",
        },
        {
          question:
            "You write an employee-manager report and the CEO is missing. What happened, and what does the fix look like?",
          answer:
            "The report used an INNER self join — FROM employees e JOIN employees m ON m.employee_id = e.manager_id — and the CEO's manager_id is NULL. NULL matches nothing in an equality predicate, and INNER drops non-matching left rows, so the root of the hierarchy disappeared. The fix is a LEFT JOIN from the employee side, which preserves every employee and NULL-fills the manager columns for roots; presentation-wise I'd wrap the manager name in COALESCE(m.name, '—') or a '(top level)' label. The deeper lesson is that this is the standard LEFT-vs-INNER decision applied to hierarchies: any tree stored with a nullable parent key has roots, and every hierarchy query must consciously decide whether roots belong in the result. I'd also flag the symmetric issue for multi-level rollups: walking two levels (manager's manager) means chaining another LEFT self join per level, or moving to a recursive CTE when depth is unknown.",
        },
        {
          question:
            "How would you find duplicate records in a table using a self join, and why use < rather than <> in the condition?",
          answer:
            "Join the table to itself on the attribute that defines duplication — say email — and require different primary keys: FROM customers a JOIN customers b ON b.email = a.email AND b.customer_id > a.customer_id. Each duplicate cluster then emits every pair exactly once. The > (or <) inequality does two jobs that <> only half-does: it excludes self-matches AND canonicalizes pair orientation, so (1,3) appears but (3,1) doesn't; with <>, every pair shows up twice and any downstream counts are doubled. For clusters larger than two, the pair output grows quadratically — n duplicates yield n(n−1)/2 pairs — so at scale I'd usually switch to GROUP BY email HAVING COUNT(*) > 1 to find the clusters first, then self-join or window-function only within the flagged emails. That two-step keeps the query cheap and gives dedup tooling a cluster id to work with.",
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
        "1) Forgetting aliases — the query won't even parse with the same table named twice. 2) Reversing the hierarchy ON clause (e.employee_id = m.manager_id asks 'who reports to e', not 'who manages e') — always read the foreign key direction aloud. 3) Using INNER when hierarchy roots (NULL parent keys) must appear — the CEO silently vanishes; use LEFT. 4) Pair generation with <> instead of <, doubling every co-occurrence count. 5) Running pair self joins without profiling group sizes — one 5,000-item basket contributes ~12.5M pairs and turns a seconds query into an hours query.",
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
        "Try these prompts in the AI Tutor panel: • 'ELI5: a self join using a phone-book photocopy analogy of your own.' • 'Quiz me: 5-row employees table, I predict the exact output of INNER vs LEFT self joins.' • 'Show me the two directions of the org-chart ON clause and how to tell them apart.' • 'When should I use a window function instead of a self join? Give me three cases each.' • 'Interview mode: have me write a duplicate-detection query and critique my inequality choice.'",
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
        "Self join — a join of a table to itself via two aliases. Alias role — the logical part (employee vs manager) an alias plays; same data, different function. Self-referencing foreign key — a column pointing at the primary key of the same table (manager_id → employee_id). Hierarchy root — a row with a NULL parent key (the CEO); dropped by INNER self joins. Parent/child — the two ends of a hierarchy edge. Pair generation — self-joining on a shared attribute to enumerate row pairs. Canonical pair — an unordered pair kept in exactly one orientation via a < condition. Self-pair — a row matched with itself; excluded by any strict inequality. Span of control — direct-report count per manager; a grouped self join. Quadratic blow-up — pair output growing as n(n−1)/2 with group size n. Recursive CTE — the tool for unknown-depth hierarchy walks (Advanced module).",
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
        "• Docs: PostgreSQL tutorial — 'Joins Between Tables' includes the canonical self-join weather example. • Read: 'Hierarchical Data in SQL' (adjacency lists vs other models) to see where self joins fit among tree designs. • Practice: model your own team as an employees table with manager_id, then write: everyone+manager (LEFT), spans of control, and anyone earning above their manager. • Next in DSM: you can join a table to itself and one table to another — Multiple Joins chains three or more tables and teaches you to control fan-out across the chain.",
    },

    /* ---------------------------------------------------------------- */
    /*  12 — Recap                                                       */
    /* ---------------------------------------------------------------- */
    {
      id: "recap",
      type: "recap",
      tocLabel: "Recap",
      content:
        "✓ A self join lists one table twice under mandatory, role-named aliases — same data, two logical tables.\n✓ Hierarchies ride self-referencing foreign keys; ON m.employee_id = e.manager_id resolves child → parent, and reversing it flips the question.\n✓ INNER self joins drop hierarchy roots (NULL parent keys); LEFT keeps them with NULL-filled parent columns.\n✓ Row-to-row comparisons join on a shared attribute plus an inequality; < generates each unordered pair once and bans self-pairs.\n✓ Pair output grows quadratically with group size — profile the biggest groups before running pair analysis.\n✓ Sequences and previous-row comparisons are usually better served by window functions; hierarchies and pairing stay self-join territory.\n\nNext up: Multiple Joins. Two tables at a time is training wheels — real questions span customers, orders, order items, AND products. Next you'll chain joins across three or more tables and keep the row counts honest at every step.",
    },
  ],
};
