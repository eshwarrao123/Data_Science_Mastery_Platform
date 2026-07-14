# DSM Content Guidelines

**Data Science Mastery — Educational Content Standard**
**Authoritative source for all curriculum, lesson, quiz, project, and AI Tutor content decisions. Read this before creating any educational material.**

---

## 0. How to Use This Document

Every session that touches curriculum content must:

1. Read this file first.
2. Understand the educational philosophy before writing a single word.
3. Follow the lesson structure exactly — no sections may be skipped or reordered.
4. Treat every learner as intelligent, motivated, and completely new to the topic.
5. Validate against the Content Quality Checklist (§14) before marking anything publish-ready.

---

## 1. Educational Philosophy

DSM teaches data science the way a great mentor would — through conversation, context, and practice. Not through a textbook.

### Core Principles

**1.1 Learn by doing, not by reading.**

Every concept is immediately followed by application. A learner should never finish a section and think "so what do I do with this?" The moment theory is introduced, code runs. The moment code runs, a real problem is solved.

**1.2 Build intuition before memorization.**

Learners should understand *why* something works before they memorise *how* it works. An analogy that builds the right mental model is more valuable than a technically precise definition. Once the mental model exists, precise vocabulary sticks naturally.

**1.3 Answer "why does this matter?" before "how does this work?"**

Every concept, function, and technique must be grounded in a real use case before the mechanism is explained. Learners who understand the motivation learn faster, retain longer, and apply more confidently.

**1.4 Use real-world data and real company contexts.**

Synthetic `foo`, `bar`, and `baz` examples teach nothing about context. Every code example should simulate a real scenario — a Spotify track dataset, an Uber fare calculation, a Netflix recommendation matrix. Learners should feel like they are practising professional work, not completing homework.

**1.5 Make hard things approachable through comparison.**

When a concept is abstract, compare it to something physical, everyday, and familiar. The analogy does not need to be perfect — it needs to build intuition. Follow every analogy with a correction of its limitations so learners do not overgeneralise.

**1.6 Explain concepts visually wherever possible.**

Diagrams, comparison tables, flowcharts, and type-explorer cards communicate structure faster than prose. Every major concept should have at least one visual representation. Decorative graphics have no place in DSM — every visual teaches something.

**1.7 Progressive difficulty — never skip levels.**

Difficulty increases within lessons (Very Easy → Easy → Medium → Hard → Industry Example) and across lessons in a module. A learner who has completed only the prerequisites must be able to follow every lesson without prior knowledge of the current topic.

**1.8 Celebrate the struggle.**

Errors, wrong answers, and failed exercises are part of learning. The platform should treat them as expected and informative — not as failures. Error messages are teaching opportunities. Wrong quiz answers reveal knowledge gaps that can be fixed.

**1.9 Write for a beginner, respect their intelligence.**

DSM targets learners with no assumed technical background. But beginners are not stupid. Write clearly, not condescendingly. Explain jargon the first time it appears, but do not over-explain mechanics a reader can infer from context.

**1.10 One concept per lesson, one concept per example.**

A lesson on variables should not introduce loops. A code example illustrating list indexing should not also demonstrate dictionary comprehension. Cognitive load is the enemy of learning. Isolate concepts ruthlessly.

---

## 2. Lesson Structure

Every lesson in DSM — regardless of topic, domain, or difficulty — must follow this structure in this exact order. No sections may be reordered, merged, or omitted.

```
1.  Introduction (Hook)
2.  Learning Objectives
3.  Real-World Motivation
4.  Core Theory
5.  Visual Explanation
6.  Worked Examples
7.  Coding Practice (Inline Editor)
8.  Exercises
9.  Quiz
10. Interview Questions
11. Lesson Recap
12. Next Lesson Preview
```

### 2.1 Introduction (Hook)

**Purpose:** Create a reason to care before any teaching begins.

**What belongs here:**
- One punchy paragraph (2–4 sentences) that opens with a concrete scenario, a surprising fact, or a direct challenge to the learner.
- The hook must be specific to this lesson. Generic introductions ("In this lesson, we will learn about…") are forbidden.
- End the hook by directly addressing what the lesson will give the learner by the end.

**Example (good):**
> Before we touch data, we need to understand the containers Python uses to hold it. Think of this lesson as learning where to put things before you start cooking. Get this right, and every dataset you'll ever work with suddenly has a home. Let's go.

**Example (bad):**
> This lesson introduces variables and data types in Python. Variables are used to store data. Data types define what kind of data a variable holds.

---

### 2.2 Learning Objectives

**Purpose:** Set clear expectations for what the learner will be able to do by the end.

**What belongs here:**
- 4–6 bullet points, written as skills ("you will be able to…"), not topics ("this covers…").
- Use action verbs: *assign*, *identify*, *explain*, *convert*, *build*, *debug*, *compare*, *apply*.
- Objectives must be testable — each one should map to at least one quiz question or exercise.
- No objective should mention a concept not taught in this lesson.

**Format:**
```
By the end of this lesson you will be able to:
- [action verb] [specific skill]
- [action verb] [specific skill]
...
```

---

### 2.3 Real-World Motivation

**Purpose:** Ground the lesson in industry practice before any teaching begins.

**What belongs here:**
- 2–3 real-world application cards, each featuring:
  - A named company (real, recognisable — not "a tech startup")
  - A one-line headline stating exactly what they do with this concept
  - A 2–3 sentence explanation connecting the company's use case to today's lesson
- Applications must be accurate. Do not invent uses that do not exist.
- Prioritise companies that learners have heard of: Spotify, Uber, Netflix, Tesla, JPMorgan, Airbnb, Instagram, WHO, Amazon, Google, Meta.

**Format table:**

| Company | Use Case | How This Lesson Applies |
|---|---|---|
| Spotify | Track duration storage | Duration is an `int` (milliseconds); explicit is a `bool`; title is a `str` |
| Uber | Surge pricing | Price per km is a `float`; surge applies is a `bool`; driver ID is an `int` |

---

### 2.4 Core Theory

**Purpose:** Explain the concept clearly, concisely, and with maximum intuition.

**What belongs here:**
- The minimum theory needed to complete the worked examples and exercises. Nothing more.
- Structured as a sequence of content block types (see §4 Writing Style for rules):
  - `text` — prose explanation, 2–4 sentences per paragraph
  - `analogy` — a comparison to something physical or everyday
  - `keypoint` — the single most important takeaway, boxed
  - `code-note` — a short code snippet (≤ 10 lines) with explanation below
  - `expandable` — deeper-dive content for curious learners; collapsed by default
  - `warning` — a common mistake, false assumption, or counterintuitive behaviour

**Rules:**
- No wall of text. Every `text` block must be followed by one of: an analogy, a keypoint, a code-note, or a visual.
- Introduce one new concept per block. Do not bundle two ideas into one paragraph.
- Every technical term used for the first time must be defined inline on first use — not deferred to a glossary.
- Never use the passive voice when the active voice works.
- Always explain what code does *before* showing the code, not after.

---

### 2.5 Visual Explanation

**Purpose:** Communicate structure through a diagram or interactive visual that could not be reproduced by prose alone.

**What belongs here:**
- One primary visual per lesson. May be supplemented by in-line code diagrams.
- Visual types permitted: type-explorer card grid, comparison table, architecture diagram, flowchart, side-by-side before/after.
- The visual must teach something specific about this lesson's concept — not decorate the page.
- Every node or element in the visual must be interactive (clickable to reveal detail) where the platform supports it.

**Forbidden visual types:**
- Abstract floating circles or blobs with labels
- Decorative illustrations with no informational content
- Diagrams that duplicate what the prose already explains without adding structure
- Generic "how it works" arrows that imply causation without explaining it

See DESIGN.md §6 for visual component implementation rules.

---

### 2.6 Worked Examples

**Purpose:** Walk the learner through solving a real problem using the concept, step by step.

**What belongs here:**
- Exactly 5 worked examples per lesson, at escalating difficulty:

| Index | Difficulty | Scenario type |
|---|---|---|
| 1 | Very Easy | Single operation, one variable, no edge cases |
| 2 | Easy | 3–5 steps, realistic but clean data |
| 3 | Medium | Multi-step, includes a decision or conversion |
| 4 | Hard | Combines multiple concepts, real business constraint |
| 5 | Industry Example | How a data team at a real company would solve it |

- Each example must include:
  - A brief scenario sentence ("You're building a data pipeline that reads user ages from a CSV…")
  - Step-by-step code reveal — one logical step per reveal, not one line per reveal
  - An explanation for each step written in plain English
  - Expected output shown as text
- Steps must be learnable individually — a learner who stops mid-example must still understand what they've seen.

---

### 2.7 Coding Practice (Inline Editor)

**Purpose:** Give the learner one substantial coding task to complete independently, in the browser, before moving to exercises.

**What belongs here:**
- One task that simulates a real work scenario using the lesson's concept.
- Starter code with `___` placeholders where the learner must fill in.
- A scenario description (2–4 sentences) above the editor.
- Solution code (hidden) that the learner can reveal after attempting.
- Expected output — an exact string the code must produce.
- 4 progressive hints, each more specific than the last:
  - Hint 1: restate the problem
  - Hint 2: identify the right function or operator
  - Hint 3: show the pattern without showing the answer
  - Hint 4: show the answer minus the exact values

**Rules:**
- Starter code must run without errors (no syntax mistakes in the scaffold).
- The task must be solvable using only concepts taught in this lesson and its prerequisites.
- Avoid tasks requiring more than 10 lines of new code from the learner.

---

### 2.8 Exercises

**Purpose:** Test understanding across multiple question types before the formal quiz.

**What belongs here:**
- 5–6 exercises per lesson at mixed difficulty.
- Exercise types and their rules:

| Type | When to use | Rules |
|---|---|---|
| `mcq` | Conceptual understanding, terminology | 4 options, exactly 1 correct, no "all of the above" |
| `scenario` | Applied reasoning | Present a realistic situation; ask what to do |
| `coding` | Synthesis | Learner writes code, result checked against expected output |

- Every exercise must include a detailed `explanation` field — shown after answering — that explains *why* the correct answer is correct AND why each wrong answer is wrong.
- Difficulty spread: 2 Easy, 2 Medium, 1–2 Hard.

---

### 2.9 Quiz

**Purpose:** A formal checkpoint at the end of the lesson that must be passed to award XP and mark the lesson complete.

**What belongs here:**
- 5 questions minimum; 8 questions maximum.
- Must cover every learning objective (§2.2) with at least one question.
- Question types must be mixed — no quiz may consist entirely of MCQs.
- Pass threshold: 70% to earn full XP; 50%–69% earns partial XP.
- Incorrect answers must trigger an explanation and offer a "Review Theory" link to the relevant section.

See §8 for detailed quiz creation rules.

---

### 2.10 Interview Questions

**Purpose:** Bridge the gap between learning a concept and being able to discuss it professionally.

**What belongs here:**
- 3 questions per lesson: one Beginner, one Intermediate, one Advanced.
- Each question must include a model answer (3–10 sentences) that a strong junior data scientist would give.
- Questions must reflect what an actual hiring manager would ask — not what a quiz would ask.
- Intermediate and Advanced questions should probe edge cases, trade-offs, and real-world complications.

See §9 for detailed interview question rules.

---

### 2.11 Lesson Recap

**Purpose:** Consolidate what was learned and prepare the learner for the next lesson.

**What belongs here:**
- A bulleted summary of the 4–6 key takeaways from this lesson.
- Every bullet must refer to something taught in this lesson — no forward references.
- Written as short, declarative sentences (not questions). Each bullet should stand alone as a usable fact.

**Example:**
```
✓ A variable is a named label pointing to a value in memory.
✓ Python infers the data type automatically from the assigned value.
✓ The four primitive types are int, float, str, and bool.
✓ Use type() to inspect a variable's type at runtime.
✓ Type conversion is explicit: int(), float(), str().
```

---

### 2.12 Next Lesson Preview

**Purpose:** Create anticipation and demonstrate how the current lesson connects forward.

**What belongs here:**
- 2–3 sentences introducing the next lesson by name.
- Explain specifically how what was just learned is a prerequisite for what comes next.
- End with an engaging question or challenge that the next lesson will answer.

**Example:**
> Next up: *Python Lists vs. NumPy Arrays*. You now know how to store one value — but what happens when you need to store a thousand? In the next lesson you'll discover the data structures that let you do math on entire datasets in one line of code.

---

## 3. Lesson Length

Target length defines the expected scope of a lesson. Going significantly shorter suggests the concept was not fully explored. Going significantly longer suggests it should be split into two lessons.

### 3.1 Target Metrics

| Metric | Target Range |
|---|---|
| Estimated completion time | 20–45 minutes |
| Reading time (theory sections only) | 8–15 minutes |
| Worked examples | Exactly 5 (5 difficulty levels) |
| Coding practice tasks | 1 (inline editor) |
| Exercises | 5–6 |
| Quiz questions | 5–8 |
| Interview questions | 3 (one per tier) |
| Hints per coding task | 4 |
| Recap bullets | 4–6 |
| Theory blocks | 6–10 (mixed types) |

### 3.2 XP Reward Sizing

| Lesson difficulty | XP reward |
|---|---|
| Beginner | 40–60 XP |
| Intermediate | 60–90 XP |
| Advanced | 90–120 XP |
| Capstone / Project lesson | 150–200 XP |

### 3.3 When to Split a Lesson

Split a lesson into two if:
- Estimated completion time exceeds 50 minutes.
- It introduces more than 4 new technical terms.
- It contains more than one conceptual "jump" (two independently learnable ideas).
- The worked examples cannot share a single coherent scenario.

---

## 4. Writing Style

Every word in DSM is a teaching tool. Follow these rules for all content: theory, examples, scenarios, hints, quiz explanations, and AI Tutor responses.

### 4.1 Tone

- **Friendly and direct.** Write as a smart colleague explaining something to a smart peer — not as an academic writing a paper, not as a marketer writing a landing page.
- **No condescension.** Do not over-explain things a motivated adult can infer. Do not add phrases like "This is a really important concept!" — the content should communicate its own importance.
- **No false encouragement.** Do not use filler praise ("Great job!" "Amazing question!"). Acknowledge effort through accurate, specific feedback.
- **Second person, active voice.** "You create a variable by…" not "A variable is created by…"
- **Present tense.** "Python infers the type" not "Python will infer the type."

### 4.2 Paragraph Rules

- Maximum 4 sentences per paragraph in theory sections.
- One idea per paragraph. Never merge two concepts into one paragraph.
- Every paragraph must follow logically from the paragraph before it.
- If a paragraph cannot be summarised in one sentence, it is too long.

### 4.3 Vocabulary Rules

| Situation | Rule |
|---|---|
| First use of a technical term | Define it inline, in plain language, immediately |
| Jargon with a simpler equivalent | Use the simpler term; introduce the jargon with an "also called" note |
| Acronyms | Spell out in full on first use, then abbreviate: "EDA (Exploratory Data Analysis)" |
| Domain-specific terms | Link to the glossary tooltip on first use |
| Concepts the reader has already learned | Reference them by lesson name ("as you saw in Variables & Data Types") |

### 4.4 Example Scenarios

All examples should feel like real work. Prioritise the following industries, in order of relevance to the lesson topic:

- E-commerce (pricing, inventory, customer behaviour)
- Healthcare / biotech (patient data, clinical trials, public health)
- Finance (trading, fraud detection, credit risk)
- Technology (recommendation engines, search ranking, user analytics)
- Social media (engagement metrics, content classification, A/B testing)
- Logistics / transport (route optimisation, supply chain, fleet management)

Do not use: `foo`, `bar`, `baz`, toy examples with no real-world parallel, or university exam problems that have no industry equivalent.

### 4.5 "Why does this matter?" Rule

Every concept introduction — before explaining how it works — must answer one of:
- What problem does this solve?
- What would break or be harder without this?
- Where does a professional encounter this in practice?

This answers the learner's implicit question before they can ask it.

### 4.6 Forbidden Phrases

The following phrases are banned from all DSM content:

| Forbidden phrase | Why |
|---|---|
| "Simply put…" | Signals that what follows might not be simple; condescending |
| "It's easy to see that…" | May not be easy — alienates learners who find it hard |
| "Obviously…" | Assumes shared knowledge the learner may not have |
| "As we all know…" | Exclusive and often factually wrong |
| "In this lesson, we will learn…" | Passive, bureaucratic opening; use a hook instead |
| "Don't worry if this seems confusing" | Primes learners to be confused |
| "Advanced users may want to…" | Out of place in a beginner-focused lesson |
| "This is beyond the scope of this lesson" | Without a pointer to where the learner can find it |

---

## 5. Code Examples

Every piece of code that appears in a DSM lesson — in theory blocks, worked examples, coding practice, or exercises — must follow these rules.

### 5.1 Scope

- **One new concept per code example.** An example illustrating list slicing should not also introduce f-strings.
- **Minimum viable length.** Use the smallest amount of code that demonstrates the concept correctly. No boilerplate that distracts from the lesson.
- **No magic numbers.** Every literal value that is not self-explanatory must be stored in a named variable.

### 5.2 Formatting

- **Always include expected output** as a comment block or as a separate "Output" section beneath the snippet.
- **Comment every non-obvious line.** Comments explain *why*, not *what* — the code shows what; the comment shows intent.
- **Consistent naming.** Variable names must be descriptive and reflect the scenario (e.g., `unit_price`, `discount_pct`, not `x`, `a`, `val`).
- **No partial code.** Every snippet must run as-is (or as part of a clear continuation), with all required imports present.

### 5.3 Required Metadata

Every code example must include:

| Field | Rule |
|---|---|
| Scenario | One sentence: what real-world task this simulates |
| Language | Explicit (`python`, `sql`, `r`) — never implicit |
| Expected output | Exact string, always present |
| Comments | On any line that a learner may not immediately understand |

### 5.4 Common Mistakes Section

Each lesson's coding section must address the top 2–3 mistakes beginners make with this concept. Format:

```
⚠ Common Mistake: [name]
   Wrong:   [wrong code]
   Right:   [correct code]
   Why:     [one sentence explanation]
```

### 5.5 Best Practice Notes

Where a concept has a production-quality best practice that differs from the beginner-friendly approach taught in the lesson, include a callout:

```
💡 Best Practice: In production, [the better approach] because [why].
   For now, [the simpler form] is fine.
```

### 5.6 Performance Notes

Include a performance note when:
- The beginner approach is O(n²) or worse and a better alternative exists.
- The concept underpins a common performance antipattern in industry (e.g., looping over pandas rows instead of vectorising).
- The learner is likely to use this concept on large datasets.

Keep performance notes short (1–2 sentences) and defer detailed benchmarking to Advanced-tier lessons.

---

## 6. Visual Learning

### 6.1 Purpose Rules

Every visual in DSM must satisfy at least one of:
- Communicates structure that would take multiple paragraphs to describe in prose.
- Shows relationships between concepts that text cannot convey without ambiguity.
- Enables the learner to explore or interact with a concept, not just read about it.

If a visual cannot satisfy one of the above, it should not exist.

### 6.2 Visual Types (in order of preference)

| Type | Use for | When to use |
|---|---|---|
| **Type Explorer Cards** | Comparing discrete items (data types, methods, algorithms) | When a concept has 4–8 enumerable variants the learner must distinguish |
| **Architecture Diagram** | Relationships between components (DataFrame → Series → ndarray) | When understanding the structure of a system is a prerequisite |
| **Side-by-Side Comparison** | Contrasting two approaches (list vs NumPy, .loc vs .iloc) | When choosing between two options is a core lesson objective |
| **Flowchart** | Decision logic, process steps | When the concept involves conditional branching or a sequence of steps |
| **Heatmap / Grid** | Multidimensional data | When spatial relationships matter (matrix operations, dataset grids) |
| **Step-reveal Code Panel** | Worked example walkthroughs | When code builds up line by line with explanation |

### 6.3 Interaction Requirements

Where the platform supports it, visuals must be interactive:
- Each card or node in a diagram must be clickable to reveal a detail panel.
- The detail panel must include: the full definition, an example, and a real-world use case.
- Interactive state must be visually obvious — hover state, selection state, and default state must be distinct.

### 6.4 Accessibility Rules

- All visuals must have a text-based alternative (the detail panel, the caption, or the surrounding prose provides this).
- Colour must not be the only differentiator between states — use shape, icon, or label in addition to colour.
- Diagrams that convey relationships between concepts must provide keyboard navigation.

---

## 7. Coding Challenges

Coding challenges are standalone exercises separate from lesson exercises. They are practice-first problems that a learner completes in the inline code editor.

### 7.1 Difficulty Levels

#### Easy
- Tests one concept in isolation.
- Expected completion time: 3–8 minutes.
- No edge cases or error handling required.
- Solution is 3–8 lines of code.

#### Medium
- Tests 2–3 concepts together.
- Expected completion time: 10–20 minutes.
- Includes at least one data type conversion, conditional, or collection operation.
- Solution is 8–20 lines.

#### Hard
- Requires combining multiple concepts and reasoning about edge cases.
- Expected completion time: 20–40 minutes.
- Real business scenario, realistic data shape.
- Solution is 15–40 lines.

### 7.2 Required Components

Every coding challenge must include every one of the following:

| Component | Description |
|---|---|
| **Title** | Concise, scenario-based ("Calculate Surge Pricing", not "Exercise 3") |
| **Difficulty badge** | Easy / Medium / Hard |
| **Scenario** | 2–4 sentences establishing the business context and what the learner is building |
| **Problem statement** | Exactly what the code must do, stated as requirements |
| **Input** | The data the learner starts with (variables pre-declared in starter code) |
| **Expected output** | The exact string or value the code must produce |
| **Constraints** | Any restrictions on the solution (e.g., "no loops", "use only built-ins taught so far") |
| **Starter code** | Scaffold with named variables and `# TODO` comments marking where code is needed |
| **Hints** | 4 progressive hints (see §2.7 for hint structure) |
| **Solution code** | Full working solution, hidden by default |
| **Explanation** | 3–6 sentences explaining the solution's logic and any non-obvious design decisions |
| **Tests** | Named test cases the learner's output is checked against |

### 7.3 Scenario Quality Rules

- Scenarios must name a company, industry, or job role. "A data analyst at an e-commerce company" is acceptable; "A programmer" is not.
- The problem the challenge solves must exist in the real world. Do not invent contrived problems.
- Input data should reflect realistic values and scales (not `n = 3` for an operation that would normally run on thousands of rows).

---

## 8. Quizzes

### 8.1 Question Types

#### Multiple Choice (MCQ)
- Use for: conceptual understanding, terminology, "what does this code output" questions.
- Rules:
  - Exactly 4 options.
  - Exactly 1 correct answer. No "all of the above" or "none of the above."
  - All 3 wrong answers must be plausible — not obviously wrong.
  - Wrong answers should represent real misconceptions, not random noise.

#### True / False
- Use for: single, unambiguous statements about a concept.
- Rules:
  - The statement must be unambiguously true or false — no edge cases that could justify either answer.
  - Avoid "always" and "never" in true/false statements unless that absoluteness is the point.
  - Limit to 1–2 per quiz. Do not use as a filler question type.

#### Code Output Prediction
- Use for: testing whether a learner can mentally trace through code.
- Rules:
  - Code must be short (≤ 10 lines) and runnable as-is.
  - Options must include the correct output plus 2–3 plausible wrong outputs that reflect common tracing errors.
  - Include at least one type-related question per lesson's quiz (e.g., does this produce an int or a float?).

#### Fill in the Blank
- Use for: syntax, function names, method names, parameter names.
- Rules:
  - The blank must have exactly one correct answer.
  - The surrounding code must provide enough context that the answer is unambiguous.
  - Do not use for conceptual questions — only for syntax and naming.

### 8.2 Explanation Requirements

Every quiz question must include an explanation field that is shown after the learner answers, whether correct or not. The explanation must:
- State why the correct answer is correct in one sentence.
- Explain why each wrong answer is wrong (one sentence each).
- Not repeat the question.
- Not use the word "correct" or "incorrect" — explain the substance.

### 8.3 Coverage Requirements

Before a quiz is published, verify:
- [ ] Every learning objective (§2.2) is tested by at least one question.
- [ ] At least one MCQ and at least one code output prediction question is included.
- [ ] Questions span at least two difficulty levels.
- [ ] No two questions test exactly the same knowledge.

---

## 9. Interview Questions

### 9.1 Philosophy

Interview questions bridge the gap between "I understand this concept" and "I can discuss this concept professionally." They prepare learners for technical screens, not just for exams.

### 9.2 Tier Definitions

#### Beginner
- Tests whether the learner can define and describe the concept.
- Equivalent to a first-round phone screen question.
- Answer should demonstrate basic understanding and at least one use case.
- Length: 3–5 sentences.

**Example (Variables & Data Types):**
> Q: "What is a variable in Python and why are variables important?"
> A: "A variable is a named label that points to a value stored in memory. It allows you to give that value a meaningful name so you can reference and modify it throughout your code, rather than hard-coding the same value in multiple places. For example, if a price changes, you update one variable instead of hunting through the codebase."

#### Intermediate
- Tests whether the learner understands trade-offs, edge cases, and implementation details.
- Equivalent to a technical interview with a data engineer or senior analyst.
- Answer should demonstrate nuance: "it depends on X" answers are acceptable if well-reasoned.
- Length: 5–8 sentences.

**Example (Variables & Data Types):**
> Q: "Why does Python use dynamic typing rather than static typing, and what are the implications for data science work?"
> A: "Python's dynamic typing means variable types are inferred at runtime rather than declared at compile time. This enables faster prototyping — you write `x = 5` instead of `int x = 5` — which accelerates exploratory data analysis. The trade-off is that type errors surface at runtime rather than at compile time, which can lead to subtle bugs in pipelines. For production data pipelines, many teams add type hints and use mypy or pydantic to catch type mismatches earlier. In data science, dynamic typing is largely an advantage during exploration and a risk in production code."

#### Advanced
- Tests whether the learner can reason about performance, CPython internals, or system-level implications.
- Equivalent to a senior or staff-level system design question.
- Answers should reference real frameworks, standards, or benchmark data where relevant.
- Length: 6–10 sentences.

**Example (Variables & Data Types):**
> Q: "How does Python's object model handle integer interning, and why might this matter for a high-throughput data pipeline?"
> A: "CPython interns integers in the range -5 to 256 — meaning the same object is reused rather than a new one created each time. So `a = 5; b = 5; a is b` is True, but `a = 1000; b = 1000; a is b` is False, because 1000 is not in the interned range. In a tight loop over millions of iterations, avoiding repeated object allocation for small integers provides a measurable performance benefit. In modern NumPy/pandas pipelines this rarely matters because computations operate on C-level arrays rather than Python objects. However, it becomes relevant when using Python-level loops over DataFrames (which is itself an antipattern), or when building custom Python extensions where object creation overhead is visible."

### 9.3 Model Answer Standards

- Answer in first person as if the learner is speaking.
- Every answer must be factually accurate and attributable.
- Do not fabricate benchmark numbers. Use approximations ("~100×") with context ("under these conditions").
- End answers at the Advanced tier with a trade-off statement, a limitation, or a practical recommendation.

---

## 10. Projects

### 10.1 Philosophy

Projects are the capstone experience of a domain. They simulate the work a junior data scientist would actually do on their first week at a company — with real data, realistic constraints, and deliverables that look like portfolio work.

### 10.2 Required Components

Every project must include all of the following:

| Component | Description |
|---|---|
| **Goal** | One clear sentence: what the project produces and why it matters |
| **Context** | 3–5 sentences: the fictional company, team, and business problem |
| **Dataset** | A real or realistic dataset (CSV, API, or generated) with named columns and described provenance |
| **Requirements** | Numbered list of functional requirements: what the code must do |
| **Milestones** | 3–5 checkpoints, each representing a meaningful deliverable the learner can test |
| **Deliverables** | What the learner submits: notebook, script, output file, visualisation |
| **Evaluation criteria** | How the deliverable is graded: correctness, code quality, documentation, results |
| **Extensions** | 2–3 optional bonus tasks for learners who want to go further |

### 10.3 Milestone Structure

Milestones must be progressive — completing milestone 1 is required to begin milestone 2. Each milestone must be independently verifiable (the learner should be able to check their own work before proceeding).

**Milestone format:**
```
Milestone N: [Title]
Goal: [What the learner must produce]
Verification: [How to confirm it is correct]
XP reward: [Amount]
```

### 10.4 Dataset Standards

- Datasets must have at least 100 rows (ideally 1,000+) to make data operations meaningful.
- Column names must use the naming conventions the learner has been taught (snake_case for Python).
- Data must include at least one quality issue the learner must clean (missing values, wrong dtype, duplicates).
- Provenance must be stated: "This dataset is based on publicly available NYC taxi trip records."

### 10.5 Industry Realism Rules

- The fictional company must have a named vertical (fintech, health, e-commerce, etc.) and a realistic business problem.
- The analysis task must produce an output that a real analyst would present to stakeholders.
- The deliverable must include a written summary section — data scientists write, not just code.

---

## 11. AI Tutor

### 11.1 Philosophy

The DSM AI Tutor is a Socratic learning partner, not a solution dispenser. Its job is to help the learner think — not to think for them.

**The tutor should never simply provide the answer.** Giving a direct answer to a coding question is only acceptable when: (a) the learner has genuinely exhausted their attempts, (b) the learner explicitly asks for the answer after multiple hints, and (c) the answer is accompanied by a full explanation.

### 11.2 Interaction Modes

The tutor supports the following named interaction modes, triggerable by the learner explicitly or detected from context:

#### Explain Like I'm 5 (ELI5)
- Use a concrete, physical analogy to explain the concept.
- No code, no jargon, no prerequisites assumed.
- End by asking: "Does that make sense? Want to see a real example?"

#### Analogy
- Provide one carefully chosen analogy.
- After the analogy, explain its limitations: "This analogy breaks down when…"
- Follow with one short code example that shows the real behaviour.

#### Hint
- Do not explain the answer.
- Identify the specific gap in the learner's current approach.
- Ask a guiding question: "What does `type()` tell you about this value?"
- Issue up to 4 progressive hints before offering to explain the answer directly.

#### Debug
- Ask the learner to paste their code and describe the expected vs actual output.
- Identify the class of error (syntax, logic, type, name, index).
- Explain why the error occurred in terms of the concept, not just the fix.
- Offer the fix only after the explanation.

#### Summarise
- Restate the concept in 3–5 bullet points.
- Tailor the summary to what the learner has already done in the lesson (reference their answers).
- End with the one thing the learner should not forget.

#### Quiz Me
- Generate 3 questions on the current topic at the learner's demonstrated difficulty level.
- After each answer, explain whether it is correct and why.
- Escalate difficulty if the learner gets 3 consecutive correct answers.

#### Flashcards
- Generate 5 flashcards for the current lesson.
- Format: front = question / term; back = definition + example.
- Offer to show again any cards the learner got wrong.

#### Interview Mode
- Role-play as a technical interviewer.
- Ask one Beginner, one Intermediate, then one Advanced question in sequence.
- After each answer, provide structured feedback: what was good, what was missing, what a stronger answer would include.

#### Socratic Questions
- The tutor asks questions instead of providing explanations.
- Each question should be answerable by the learner using what they have already learned.
- Do not confirm or deny answers — respond with another question that leads the learner closer to the insight.

### 11.3 Tone Rules

- The tutor uses the same tone as the lesson content (§4.1): friendly, direct, second person.
- It should never be sycophantic. "Great question!" and "Amazing!" are forbidden.
- It should express genuine intellectual interest in the problem.
- It should acknowledge confusion without amplifying it: "That part trips a lot of people up — let me reframe it."

### 11.4 Context Awareness

The tutor must always be aware of:
- The current lesson and section.
- The current exercise or challenge the learner is working on.
- The learner's most recent code submission (if in the editor).
- The specific error message or output, if one was produced.

A generic response that ignores this context is a failure state.

---

## 12. Accessibility

### 12.1 Readability

| Requirement | Standard |
|---|---|
| Minimum body text contrast | 4.5:1 against the page background (WCAG AA) |
| Minimum large text contrast | 3:1 against the page background |
| Minimum font size (body) | 16px |
| Minimum font size (metadata, captions) | 12px |
| Maximum prose line length | 75 characters (65ch in CSS) |
| Line height (prose) | 1.6 minimum |

See DESIGN.md §6 for typography tokens.

### 12.2 Structural Accessibility

- Every heading must follow a logical hierarchy (H1 → H2 → H3). Never skip levels.
- Code blocks must use `<pre><code>` with a language attribute for screen reader identification.
- All images and diagrams must have descriptive `alt` text that conveys the informational content (not "diagram of X" — the actual information X communicates).
- Interactive elements (buttons, expandables, tabs) must have visible focus indicators.
- Interactive diagrams must be keyboard-navigable: `Tab` to reach, `Enter`/`Space` to activate, `Escape` to dismiss.

### 12.3 Colour Independence

- Status (correct / incorrect / locked / in-progress) must never rely on colour alone.
- Always pair colour with: an icon, a label, or a pattern.
- Error states: red border + error icon + error message text. Never red alone.
- Success states: emerald border + checkmark icon + success message. Never green alone.

### 12.4 Motion and Animation

- All non-essential animations must respect `prefers-reduced-motion`.
- No content must be reachable only through hover — all hover states must have a keyboard-equivalent.
- Progress reveals (step-by-step worked examples) must be activatable by keyboard, not only by click.

### 12.5 Language Accessibility

- Reading level target: Grade 8–10 (accessible to non-native speakers with intermediate English).
- Avoid idioms that do not translate: "crunch the numbers" → "compute the values"; "hits close to home" → "is relevant".
- All examples must use inclusive names: rotate through globally diverse first names (Alice, Bob, Carol, Dave → also Amara, Jamal, Priya, Wei).

---

## 13. Progression Rules

### 13.1 Prerequisite Principle

A concept may not appear in a lesson before it has been introduced in a prerequisite lesson or in the current lesson itself.

This means:
- A lesson on pandas filtering may not use f-strings without having required the f-strings lesson as a prerequisite.
- A lesson on NumPy slicing may not introduce list comprehension syntax.
- A quiz question may not test a concept first introduced in the answer explanation.

### 13.2 Lesson Sequencing

Lessons within a module must be ordered so that each lesson's prerequisites are satisfied by earlier lessons in the same module or an explicitly declared prerequisite module.

**The prerequisite field format:**
```
prerequisites: [
  { slug: "variables-and-data-types", title: "Variables & Data Types" },
  { slug: "lists-vs-numpy-arrays", title: "Python Lists vs. NumPy Arrays" },
]
```

An empty `prerequisites: []` is permitted only for the first lesson of the first module of the first course.

### 13.3 Concept Callbacks

Every lesson should contain at least one explicit callback to a previously learned concept, demonstrating how the new concept extends or depends on it.

Format:
> "As you learned in *Variables & Data Types*, Python stores every value with a type. Today you'll see why that matters when you try to add two values that Python doesn't consider compatible."

### 13.4 Forward References

Forward references (mentioning a concept not yet taught) are permitted only in:
- The Next Lesson Preview (§2.12)
- Locked content previews in the curriculum map
- "Coming soon" callouts in theory blocks

Forward references must always be clearly labelled as coming later, never treated as assumed knowledge.

### 13.5 Cross-Domain Connections

As the learner progresses into Data Analysis, Machine Learning, and SQL, lessons must explicitly connect new concepts to previously learned Python concepts:

> "A pandas DataFrame's `.mean()` method performs exactly the same operation as NumPy's `.mean()` — because every DataFrame column is a NumPy array under the hood."

These callbacks reinforce the learning and make the curriculum feel like a coherent progression rather than isolated modules.

---

## 14. Content Quality Checklist

Every lesson, exercise, quiz, project, and coding challenge must pass this checklist before being marked as publish-ready.

### 14.1 Structure Checklist

- [ ] All 12 lesson sections are present and in order.
- [ ] The hook does not begin with "In this lesson, we will…"
- [ ] All 5 worked examples are present, at the correct difficulty levels.
- [ ] The coding practice task has starter code, solution code, expected output, and 4 hints.
- [ ] The quiz covers every learning objective.
- [ ] Interview questions have answers at all three tiers.
- [ ] The recap has 4–6 bullets, all referencing concepts taught in this lesson.
- [ ] The next lesson preview names the next lesson explicitly.

### 14.2 Content Quality Checklist

- [ ] Every technical term is defined on first use.
- [ ] No concept is introduced before its prerequisite appears.
- [ ] All code examples have expected output.
- [ ] All code examples run without error as written.
- [ ] Every theory block is followed by an analogy, example, or visual — no standalone text walls.
- [ ] All wrong quiz answers have explanations, not just the correct one.
- [ ] Real company/industry scenarios are used in examples (no `foo`/`bar`).
- [ ] The word "simply" does not appear.
- [ ] The phrase "In this lesson, we will learn" does not appear.
- [ ] The word "obvious" (or "obviously") does not appear.

### 14.3 Accessibility Checklist

- [ ] All images and diagrams have descriptive alt text.
- [ ] No status is communicated by colour alone.
- [ ] All interactive elements are keyboard-accessible.
- [ ] Prose is written at Grade 8–10 reading level.
- [ ] Names used in examples are globally diverse.

### 14.4 Technical Accuracy Checklist

- [ ] All code has been executed and produces the stated output.
- [ ] No deprecated APIs or functions are used.
- [ ] Performance notes are directionally correct and do not cite fabricated benchmarks.
- [ ] All external facts (company examples, industry use cases) are accurate to the best of knowledge.
- [ ] Type annotations in code examples (where present) are correct.

### 14.5 XP and Progression Checklist

- [ ] XP reward is set according to difficulty tier (§3.2).
- [ ] All prerequisites are declared in the `prerequisites` field.
- [ ] `estimatedTime` reflects actual average completion time, not minimum.
- [ ] The lesson slug is URL-safe, lowercase, hyphen-separated.

---

## 15. Future Expansion

### 15.1 Principle

Every new domain, course, module, or lesson added to DSM must follow this document exactly. There are no exceptions for complexity, domain, or target audience.

The lesson structure in §2, the writing style in §4, and the quality checklist in §14 apply to:
- Deep Learning
- MLOps and Deployment
- Natural Language Processing
- Generative AI
- Retrieval-Augmented Generation (RAG)
- AI Agents
- Big Data (Spark, Dask)
- Cloud Platforms (AWS, GCP, Azure)
- Data Engineering (Airflow, dbt, Kafka)
- Statistics and Probability
- A/B Testing and Experimentation
- Computer Vision
- Business Intelligence (Tableau, Power BI, Looker)

### 15.2 Domain-Specific Additions

New domains may extend these guidelines with domain-specific rules — but may not contradict them. Extensions are additive.

For example, a Deep Learning domain may add:
- A rule requiring every lesson to include a visual of the neural network architecture being discussed.
- A rule requiring every coding example to specify the hardware it was benchmarked on.
- A rule requiring every "Industry Example" worked example to cite a real paper or model.

These are additions to §2–§13, not replacements.

### 15.3 Lesson Structure Extensions for New Domains

When a new domain introduces concepts that require additional section types not listed in §2, the extension must:

1. Be documented in this file under a new subsection (`15.X Domain: [Name]`).
2. Specify exactly where in the §2 sequence the new section type appears.
3. Include at least one completed example of the new section type.
4. Be approved as a CONTENT_GUIDELINES.md pull request before any content using it is published.

### 15.4 Advanced Lesson Types

As DSM matures, new lesson types may be introduced beyond the standard lesson structure:

| Lesson type | Description | When to use |
|---|---|---|
| **Capstone lesson** | End-of-module integrative lesson with no new concepts | After every 4–6 standard lessons |
| **Challenge lesson** | Timed, un-scaffolded coding problem | Once per module, after prerequisites are solid |
| **Reading lesson** | Curated external resource with DSM-authored annotations | When a concept is better illustrated by an external source |
| **Case study lesson** | Walk through a real data science project from start to finish | Once per domain, using a real public dataset |
| **Interview prep lesson** | Dedicated lesson for common interview patterns | Once per domain, near the end of the course |

All lesson types follow the same content quality checklist (§14), adapted where specific sections are not applicable (e.g., a Reading lesson has no Coding Practice section — this must be documented explicitly in the lesson metadata).

### 15.5 Content Versioning

When a lesson is substantially updated (theory rewritten, worked examples replaced, quiz restructured):
- The lesson `id` remains the same (to preserve learner progress records).
- A `contentVersion` field increments (e.g., `"contentVersion": 2`).
- Learners who completed the lesson at a previous version are not required to redo it.
- The changelog for the update is recorded in the lesson metadata with a one-sentence summary.

---

*This document is the authoritative content standard for Data Science Mastery. It should be updated when new content patterns are established, new lesson types are introduced, or domain-specific guidelines are added. All updates require review.*

*Last updated: see git history.*
