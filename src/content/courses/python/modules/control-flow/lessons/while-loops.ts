import type { Lesson } from "@/lib/curriculum/types";

export const whileLoops: Lesson = {
  meta: {
    id: "python.control-flow.while-loops",
    slug: "while-loops",
    title: "While Loops",
    description:
      "Loop until a condition changes — retries, polling, and convergence, plus the discipline that keeps loops from running forever.",
    estimatedTime: "25 mins",
    difficulty: "Beginner",
    xpReward: 50,
    prerequisites: ["python.control-flow.for-loops"],
    masteryThreshold: 80,
  },

  blocks: [
    {
      id: "intro",
      type: "lesson-intro",
      tocLabel: "Introduction",
      intro: {
        hook: "A for loop knows exactly how many laps it will run before it starts. But some jobs can't know: keep asking the API until it answers, keep halving the error until it's small enough, keep reading input until the user quits. That's while territory — looping on a condition instead of a collection.",
        what: "A while loop repeats its block as long as a condition stays True. The condition is checked BEFORE each iteration; the moment it's False, the loop ends. Something inside the loop must eventually change the condition — or the loop never stops.",
        why: "Data work is full of 'until' problems: retry a flaky download until it succeeds (or you run out of attempts), poll a job until it finishes, iterate a model until it converges. None of these have a known iteration count up front — the defining trait of a while problem.",
        whereUsed:
          "API retry logic, waiting for a training job to finish, reading paginated results until the last page, numeric methods that run until the answer stabilizes, and interactive menus.",
        objectives: [
          "Write while loops with conditions that genuinely change",
          "Choose between for (known count) and while (unknown count)",
          "Build the counter, sentinel, and convergence loop shapes",
          "Cap risky loops with a max-attempts guard",
          "Diagnose and prevent infinite loops",
        ],
        realWorldApps: [
          {
            company: "Netflix",
            headline: "Encoding job polling",
            detail:
              "After submitting a video for encoding, an orchestrator polls the job status in a while loop — sleep, check, repeat — until the state is 'complete' or 'failed'.",
          },
          {
            company: "Visa",
            headline: "Transaction retry with backoff",
            detail:
              "A failed authorization is retried while attempts remain and the error is retryable, doubling the wait each time — a while loop with two exit conditions.",
          },
          {
            company: "DeepMind",
            headline: "Training until convergence",
            detail:
              "Optimization loops run while the loss keeps improving by more than a tolerance; when improvement stalls, the condition flips and training stops.",
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
            "Syntax: `while condition:` followed by an indented block. Python checks the condition; if True, it runs the block, then checks again — and again — until the check comes back False. If the condition is False on the very first check, the body never runs at all.",
        },
        {
          type: "code-note",
          code: "countdown = 3\nwhile countdown > 0:\n    print(countdown)\n    countdown -= 1\nprint('Done')",
          content:
            "Three ingredients of every healthy while loop: a variable initialized BEFORE (countdown = 3), a condition that TESTS it (countdown > 0), and an update INSIDE that moves it toward False (countdown -= 1). Remove the update and this prints 3 forever.",
        },
        {
          type: "analogy",
          title: "Stirring until dissolved",
          content:
            "A recipe says 'stir until the sugar dissolves' — not 'stir 40 times'. You check (dissolved yet?), stir, check again. The recipe trusts that stirring changes the situation. A while loop is the same contract: the body must push the world toward the exit condition, or you'll be stirring forever.",
        },
        {
          type: "keypoint",
          title: "for vs while: do you know the count?",
          content:
            "If the number of iterations is knowable when the loop starts — every element of a list, exactly N times — use for. If it depends on something that happens DURING the loop — a response arriving, an error shrinking, a user typing 'quit' — use while. When either works, prefer for: it can't forget to advance.",
        },
        {
          type: "text",
          content:
            "Three classic while shapes: the COUNTER loop (a number walks toward a limit), the SENTINEL loop (run until a special value appears — a 'quit' command, an empty line, a None), and the CONVERGENCE loop (repeat until the change between rounds is smaller than a tolerance — the heartbeat of numerical computing and ML training).",
        },
        {
          type: "expandable",
          title: "The max-attempts guard",
          content:
            "Any while loop whose exit depends on the OUTSIDE WORLD (a network, a file, another system) can be betrayed by it. Production code adds a second exit: `while not done and attempts < MAX_ATTEMPTS:`. Now even a permanently broken API can't hang your pipeline — the loop exits and reports failure. One extra condition, one entire class of outage prevented.",
        },
        {
          type: "warning",
          title: "Infinite loops",
          content:
            "If nothing inside the loop can make the condition False, the loop runs forever — your program hangs at 100% CPU. Common causes: forgetting the update line, updating the wrong variable, or a condition that was never True to begin with (which silently skips the loop — the opposite bug). Before running any while loop, point at the line inside it that moves the condition toward False. If you can't, don't run it. (In a terminal, Ctrl+C interrupts a runaway loop.)",
        },
      ],
    },

    {
      id: "diagram",
      type: "interactive-diagram",
      tocLabel: "Visual Learning",
      visual: {
        kind: "flow",
        title: "The while loop contract",
        caption:
          "Check → run → change → check again. Click each node — the 'change' step is the one beginners forget.",
        nodes: [
          {
            id: "init",
            label: "attempts = 0",
            sublabel: "initialize",
            detail:
              "State is set up before the loop: the counter at 0, done = False. The condition will test these variables.",
            x: 8,
            y: 40,
            accent: false,
          },
          {
            id: "check",
            label: "condition?",
            sublabel: "not done and attempts < 5",
            detail:
              "Checked BEFORE every iteration — including the first. True → run the body. False → exit immediately. A condition that starts False means the body never runs even once.",
            x: 34,
            y: 40,
            accent: true,
          },
          {
            id: "body",
            label: "try the work",
            sublabel: "body runs",
            detail: "The request is attempted. It may succeed (done = True) or fail.",
            x: 62,
            y: 18,
            accent: false,
          },
          {
            id: "update",
            label: "attempts += 1",
            sublabel: "move toward exit",
            detail:
              "THE critical line: every iteration must change something the condition reads. Here both exits advance — success flips done, failure burns an attempt.",
            x: 86,
            y: 40,
            accent: true,
          },
          {
            id: "exit",
            label: "after the loop",
            sublabel: "report outcome",
            detail:
              "Execution lands here when the condition fails: either the work succeeded or attempts ran out. Code here inspects which exit happened.",
            x: 50,
            y: 75,
            accent: false,
          },
        ],
        edges: [
          { from: "init", to: "check" },
          { from: "check", to: "body", label: "True" },
          { from: "body", to: "update" },
          { from: "update", to: "check", label: "re-check" },
          { from: "check", to: "exit", label: "False" },
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
          title: "A counting while loop",
          scenario: "Print lap numbers 1 to 3 for a race timer.",
          steps: [
            {
              code: "lap = 1",
              explanation: "Initialize the loop variable before the condition ever runs.",
            },
            {
              code: "while lap <= 3:\n    print(f'Lap {lap}')\n    lap += 1",
              explanation:
                "Check (1 <= 3 True) → print → lap becomes 2 → check → … → lap becomes 4 → check (4 <= 3 False) → exit. The update line makes each check different from the last.",
            },
          ],
          output: "Lap 1\nLap 2\nLap 3",
        },
        {
          difficulty: "Easy",
          title: "Doubling until a threshold",
          scenario:
            "An investment of $1,000 grows 7% a year. How many years until it doubles?",
          steps: [
            {
              code: "balance = 1000.0\nyears = 0",
              explanation:
                "Two state variables: the growing balance and a counter for the answer. We don't know the iteration count up front — that's why this is a while problem.",
            },
            {
              code: "while balance < 2000.0:\n    balance = balance * 1.07\n    years += 1",
              explanation:
                "Each pass applies a year of growth and counts it. The condition reads balance, and balance changes every pass — the loop must terminate.",
            },
            {
              code: "print(f'{years} years (${balance:.2f})')",
              explanation:
                "After the loop, years holds the first year the balance is at least double: 11 years, landing at $2104.85.",
            },
          ],
          output: "11 years ($2104.85)",
        },
        {
          difficulty: "Medium",
          title: "Sentinel loop: process until a stop marker",
          scenario:
            "A sensor stream ends with the marker value -1. Sum all readings before the marker.",
          steps: [
            {
              code: "stream = [12, 7, 30, 9, -1, 99]\ntotal = 0\ni = 0",
              explanation:
                "The 99 after the sentinel must NOT be counted — so a plain for loop over the whole list is wrong here. We track our position manually with an index.",
            },
            {
              code: "while stream[i] != -1:\n    total += stream[i]\n    i += 1",
              explanation:
                "The condition looks at the CURRENT element. As long as it isn't the sentinel, accumulate it and advance. When stream[4] == -1, the check fails and the loop exits — 99 is never touched.",
            },
            {
              code: "print(f'Sum before sentinel: {total}')",
              explanation:
                "12 + 7 + 30 + 9 = 58. Sentinel loops appear whenever data carries its own end marker — user input ('quit'), file terminators, protocol frames.",
            },
          ],
          output: "Sum before sentinel: 58",
        },
        {
          difficulty: "Hard",
          title: "Convergence: halving toward an answer",
          scenario:
            "Estimate the square root of 2 by bisection: repeatedly narrow an interval until it's tighter than a tolerance. This is the loop shape inside real numerical libraries.",
          steps: [
            {
              code: "low = 1.0\nhigh = 2.0\nTOL = 0.001",
              explanation:
                "The answer lies between low and high (1² = 1 < 2 and 2² = 4 > 2). TOL is how precise we demand the interval to be.",
            },
            {
              code: "steps = 0\nwhile high - low > TOL:\n    mid = (low + high) / 2\n    if mid * mid < 2:\n        low = mid\n    else:\n        high = mid\n    steps += 1",
              explanation:
                "Each pass tests the midpoint and keeps the half that still contains the answer. The interval halves every iteration, so high - low is GUARANTEED to shrink below TOL — a provably terminating while loop.",
            },
            {
              code: "print(f'sqrt(2) ≈ {(low + high) / 2:.4f} in {steps} steps')",
              explanation:
                "Ten halvings shrink the interval by 2^10 ≈ 1000×, from width 1.0 to under 0.001. 'Loop while the error exceeds tolerance' is exactly how ML training decides when to stop.",
            },
          ],
          output: "sqrt(2) ≈ 1.4146 in 10 steps",
        },
        {
          difficulty: "Industry Example",
          title: "Retry with a max-attempts guard",
          scenario:
            "A data pipeline downloads a nightly export from a flaky partner API. The engineer wraps the call in a bounded retry loop — the pattern running in every production ingestion system tonight.",
          steps: [
            {
              code: "# Simulated responses for attempts 1, 2, 3...\nresponses = ['timeout', 'timeout', 'ok']\nMAX_ATTEMPTS = 5",
              explanation:
                "We simulate the network with a scripted list: two timeouts, then success. The cap is a named constant — ops can tune it without reading the loop.",
            },
            {
              code: "attempts = 0\nsuccess = False\nwhile not success and attempts < MAX_ATTEMPTS:\n    result = responses[attempts]\n    attempts += 1\n    if result == 'ok':\n        success = True\n    else:\n        print(f'Attempt {attempts}: {result}, retrying')",
              explanation:
                "TWO exit conditions joined with and: success flips the first, the counter exhausts the second. Whichever happens first ends the loop — a hung API can no longer hang the pipeline. (Real code would also sleep between tries, doubling the wait: exponential backoff.)",
            },
            {
              code: "if success:\n    print(f'Downloaded on attempt {attempts}')\nelse:\n    print(f'FAILED after {MAX_ATTEMPTS} attempts — alerting on-call')",
              explanation:
                "After the loop, the flags tell us WHICH exit fired, and the else path escalates instead of silently shrugging. Loop, guard, report: the full production shape.",
            },
          ],
          output:
            "Attempt 1: timeout, retrying\nAttempt 2: timeout, retrying\nDownloaded on attempt 3",
        },
      ],
    },

    {
      id: "inline-practice",
      type: "inline-code",
      tocLabel: "Practice Coding",
      coding: {
        language: "python",
        filename: "cooldown.py",
        instructions:
          "A server sheds load by processing requests from a queue until either the queue is empty or a processing budget of 50 ms is spent. Complete the while loop with BOTH exit conditions, then report what happened.",
        starterCode: `queue = [12, 8, 15, 9, 11, 20]   # cost of each request in ms
BUDGET_MS = 50

spent = 0
processed = 0

# TODO: loop while there are requests left AND spending the next
# request's cost would not exceed BUDGET_MS.
# In the body: add the cost to spent, count it, and remove it
# from the queue with queue.pop(0)
while ___:
    ___

print(f"Processed: {processed}")
print(f"Spent: {spent} ms")
print(f"Remaining in queue: {len(queue)}")`,
        solutionCode: `queue = [12, 8, 15, 9, 11, 20]   # cost of each request in ms
BUDGET_MS = 50

spent = 0
processed = 0

while len(queue) > 0 and spent + queue[0] <= BUDGET_MS:
    cost = queue.pop(0)
    spent += cost
    processed += 1

print(f"Processed: {processed}")
print(f"Spent: {spent} ms")
print(f"Remaining in queue: {len(queue)}")`,
        expectedOutput: "Processed: 4\nSpent: 44 ms\nRemaining in queue: 2",
        hints: [
          "The condition needs two tests joined with and: the queue isn't empty, and the NEXT cost still fits the budget",
          "queue[0] peeks at the next request's cost without removing it; spent + queue[0] <= BUDGET_MS tests the fit",
          "Inside the loop, queue.pop(0) removes AND returns the first element — store it, add to spent, bump processed",
          "12 + 8 + 15 + 9 = 44 fits; adding 11 would hit 55 > 50, so 4 processed, 2 left",
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
          id: "py08_mcq_01",
          difficulty: "Easy",
          question:
            "What happens when a while loop's condition is False on the very first check?",
          options: [
            "The body runs once, then the loop exits",
            "The body never runs",
            "Python raises a ValueError",
            "The loop waits for the condition to become True",
          ],
          correctIndex: 1,
          explanation:
            "The condition is tested BEFORE each iteration, including the first — a False start means zero iterations. This 'silent skip' is itself a common bug when the condition was mistyped.",
        },
        {
          type: "mcq",
          id: "py08_mcq_02",
          difficulty: "Easy",
          question:
            "Which line is missing?\n\nn = 10\nwhile n > 0:\n    print(n)",
          options: [
            "A break statement",
            "An update like n -= 1 inside the loop",
            "An else clause",
            "Nothing — the loop is fine",
          ],
          correctIndex: 1,
          explanation:
            "Nothing in the body changes n, so n > 0 stays True forever — an infinite loop printing 10. Every while body needs a line that moves the condition toward False.",
        },
        {
          type: "mcq",
          id: "py08_mcq_03",
          difficulty: "Medium",
          question: "Which task is a genuine while problem rather than a for problem?",
          options: [
            "Printing each of 12 month names",
            "Summing a list of 500 invoice totals",
            "Re-requesting a report until its status is 'ready'",
            "Converting every string in a list to lowercase",
          ],
          correctIndex: 2,
          explanation:
            "The retry has no knowable iteration count — it depends on when the external system finishes. The other three iterate over collections of known size: classic for territory.",
        },
        {
          type: "scenario",
          id: "py08_sc_01",
          difficulty: "Medium",
          scenario:
            "A junior engineer's polling loop is: `while job_status != 'done': job_status = check_status()`. In staging it worked; in production the job FAILED, its status became 'error' forever, and the loop spun all weekend.",
          question: "What's the robust fix?",
          options: [
            "Poll less frequently by adding a sleep",
            "Exit on ANY terminal state and cap the wait: while job_status not in ('done', 'error') and waited < MAX_WAIT",
            "Change != to ==",
            "Wrap the loop in try/except",
          ],
          correctIndex: 1,
          explanation:
            "The loop only recognized one terminal state. Robust polling exits on every terminal state ('done' AND 'error') and adds a time/attempt cap for states nobody anticipated. A sleep reduces CPU burn but the loop still never ends.",
        },
        {
          type: "coding",
          id: "py08_code_01",
          difficulty: "Medium",
          prompt:
            "A bacteria culture starts at 100 cells and grows 25% per hour. Using a while loop, print how many whole hours until the population exceeds 500. Expected output: 8",
          starterCode: "population = 100.0\nhours = 0\n# Your code here\n",
          solutionCode:
            "population = 100.0\nhours = 0\nwhile population <= 500:\n    population = population * 1.25\n    hours += 1\nprint(hours)",
          expectedOutput: "8",
          tests: [
            {
              name: "Terminates correctly",
              description:
                "The loop must stop the first hour the population exceeds 500 (100 → 500.0 is not yet over at hour 7... 1.25^7 ≈ 476.8, 1.25^8 ≈ 596.0)",
            },
            {
              name: "Counts iterations",
              description: "hours must increment once per loop pass and print 8",
            },
          ],
        },
        {
          type: "mcq",
          id: "py08_mcq_04",
          difficulty: "Hard",
          question:
            "A convergence loop is `while abs(new - old) > 0.001:`. Under what data condition can this STILL loop forever, even with correct updates?",
          options: [
            "When the values oscillate between two points instead of converging",
            "When new and old are both negative",
            "When the tolerance is a float",
            "It can't — the condition guarantees termination",
          ],
          correctIndex: 0,
          explanation:
            "If the sequence bounces (old=1.0, new=2.0, then old=2.0, new=1.0, …), the gap never shrinks below tolerance. Convergence loops assume the process converges; production versions add a max-iterations guard precisely because that assumption can fail.",
        },
        {
          type: "coding",
          id: "py08_code_02",
          difficulty: "Hard",
          prompt:
            "Collatz: start at n = 27. While n is not 1, replace n with n // 2 if even, else 3*n + 1, counting steps. Print the step count. Expected output: 111",
          starterCode: "n = 27\nsteps = 0\n# Your code here\n",
          solutionCode:
            "n = 27\nsteps = 0\nwhile n != 1:\n    if n % 2 == 0:\n        n = n // 2\n    else:\n        n = 3 * n + 1\n    steps += 1\nprint(steps)",
          expectedOutput: "111",
          tests: [
            {
              name: "Even/odd branching",
              description: "Uses % 2 to pick the halving or 3n+1 rule each pass",
            },
            {
              name: "Correct count",
              description: "27 reaches 1 in exactly 111 steps",
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
          question: "When do you reach for a while loop instead of a for loop?",
          answer:
            "The deciding question is whether the iteration count is knowable when the loop starts. Iterating a collection or repeating exactly N times — for loop, because the count is fixed by the data. Repeating until something happens during the loop — a response arrives, an error drops below tolerance, a user quits — while loop, because only the exit condition is known, not the count. When either would work I default to for, since it advances automatically and can't forget its own update line. In data engineering, for dominates batch processing while while owns the boundary with the outside world: retries, polling, and pagination.",
        },
        {
          question:
            "Your service is stuck at 100% CPU and logs show the same two lines repeating. Walk me through diagnosing an infinite loop.",
          answer:
            "The repeating log lines locate the loop; then I ask the three-ingredient question. One: what does the condition read? Two: does anything in the body WRITE to what it reads? Three: can that write actually reach the exit value? Classic failures are a missing update, updating a different variable than the condition tests (shadowing or a typo), a terminal state the condition doesn't recognize — like a job status of 'error' when the loop only exits on 'done' — or oscillation in a convergence loop where the gap never shrinks. The fix is usually twofold: repair the update, and add a belt-and-braces guard (max attempts or max wall-clock time) so the loop is bounded even when the world misbehaves. Prevention is code review that refuses any unbounded while touching an external system.",
        },
        {
          question:
            "Design the loop structure for calling a rate-limited API that can also fail transiently. What conditions and safeguards do you include?",
          answer:
            "I'd use a while loop with a compound condition: not succeeded, attempts below a cap, and total elapsed time below a deadline. Inside, I attempt the call; on success I set the flag; on a retryable failure (timeout, 429, 5xx) I sleep with exponential backoff — doubling the wait each attempt, often with jitter so parallel workers don't retry in lockstep — and on a permanent failure (auth error, 404) I break out immediately rather than burn attempts on something retries can't fix. After the loop, I check WHICH exit fired: success proceeds, exhaustion raises or alerts with the attempt history. The pattern to name in an interview: bounded retries, exponential backoff, distinguish retryable from permanent errors, and never let the loop's fate depend solely on the remote system behaving.",
        },
      ],
    },

    {
      id: "common-mistakes",
      type: "callout",
      variant: "warning",
      title: "Common Mistakes to Avoid",
      content:
        "1) No update line — the condition can never change, so the loop never ends. 2) Updating a different variable than the one the condition tests. 3) Recognizing only one terminal state ('done') when the world has several ('error', 'cancelled'). 4) Unbounded loops on external systems — always add a max-attempts or deadline guard. 5) Off-by-one between < and <= in counter conditions — trace the final iteration by hand. 6) A condition that's False from the start, silently skipping the body (the invisible twin of the infinite loop).",
    },

    {
      id: "ai-tutor",
      type: "callout",
      variant: "tip",
      title: "Ask the AI Tutor",
      content:
        "Try these prompts in the AI Tutor panel: • 'Show me three broken while loops and let me find the exit bug in each.' • 'Explain sentinel vs convergence loops with new examples.' • 'Help me design the retry loop for a flaky database connection.' • 'Trace this countdown loop iteration by iteration.' • 'Interview mode: quiz me on for vs while decisions and grade my reasoning.'",
    },

    {
      id: "glossary",
      type: "callout",
      variant: "info",
      title: "Glossary",
      content:
        "while loop — repeats its block as long as a condition is True, checked before each pass. Infinite loop — a loop whose condition can never become False. Update line — the statement inside the body that moves the condition toward False. Sentinel — a special value marking 'stop here' in a data stream. Convergence loop — repeats until the change between rounds drops below a tolerance. Max-attempts guard — a second exit condition capping iterations. Polling — repeatedly checking an external status until it changes. Exponential backoff — doubling the wait between retries. .pop(0) — list method removing and returning the first element.",
    },

    {
      id: "resources",
      type: "callout",
      variant: "info",
      title: "Recommended Resources",
      content:
        "• Docs: 'First Steps Towards Programming' in the official Python tutorial — the Fibonacci while loop, from the source. • Read: the tenacity library's README to see production retry policy expressed declaratively — every concept from this lesson appears. • Practice: write a guessing-game loop that halves an interval until it pins a number — you'll rebuild bisection without noticing. • Next in DSM: sometimes the cleanest exit is mid-body — Loop Control gives you break, continue, and pass for surgical control inside any loop.",
    },

    {
      id: "recap",
      type: "recap",
      tocLabel: "Recap",
      content:
        "✓ while repeats as long as its condition holds; the check happens before every pass.\n✓ Every healthy while has three parts: initialize before, test in the condition, update inside.\n✓ for = known count; while = loop until something happens.\n✓ The three shapes: counter, sentinel, and convergence.\n✓ Loops touching the outside world get a max-attempts or deadline guard — always.\n✓ To diagnose a hang: find what the condition reads, and prove something writes it toward the exit.\n\nNext up: Loop Control. Conditions decide when loops end — break, continue, and pass let you steer from INSIDE the body: exit early, skip a bad record, or hold a place.",
    },
  ],
};
