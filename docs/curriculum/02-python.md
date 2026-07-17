# Domain 2 — Python for Data Science

| Field | Value |
|---|---|
| Course slug | `python` |
| Order | 2 |
| Category | Programming |
| Difficulty | Beginner |
| Estimated hours | 28 |
| Prerequisites | Domain 1 (Foundations) recommended, not enforced |

Zero to clean, idiomatic Python with the data-stack bridges (NumPy, datetime,
regex) a data role actually uses.

> **Ordering correction.** CURRICULUM_ARCHITECTURE.md §4 lists
> `lists-vs-numpy-arrays` at position 2.2. PYTHON_FOUNDATIONS_AUDIT.md
> established the correct journey: Lists vs. NumPy Arrays is the foundations
> **capstone** (position 2.5). This manifest and the registry use the corrected
> order; prerequisites below reflect it.

## Learning outcomes

- Store, convert, and compute over all primitive types confidently
- Control program flow with conditionals, loops, and comprehensions
- Package logic into functions with clean parameter design
- Choose the right container (list, tuple, dict, set, array) per task
- Model data with classes and understand the OOP behind pandas/sklearn APIs
- Handle failures and files defensively; parse dates and messy text
- Build a small end-to-end data pipeline in pure Python

## Modules

| Order | Slug | Title |
|---|---|---|
| 1 | `foundations` | Python Foundations |
| 2 | `control-flow` | Control Flow |
| 3 | `functions` | Functions |
| 4 | `data-structures` | Data Structures |
| 5 | `oop` | Object-Oriented Python |
| 6 | `error-handling` | Errors & File I/O |
| 7 | `python-ds-tools` | Python for Data Science |

## Lessons — module `foundations` (corrected order)

| # | Title | Slug | Difficulty | Time | XP | Prerequisite | Key concepts | Status |
|---|---|---|---|---|---|---|---|---|
| 2.1 | Variables & Data Types | `variables-and-data-types` | Beginner | 25 min | 50 | — | variables, int/float/str/bool, type(), dynamic typing | implemented |
| 2.2 | Strings & String Methods | `strings-and-string-methods` | Beginner | 30 min | 50 | `python.foundations.variables-and-data-types` | indexing, slicing, immutability, strip/split/join/replace | implemented |
| 2.3 | Operators & Expressions | `operators-and-expressions` | Beginner | 25 min | 50 | `python.foundations.variables-and-data-types` | arithmetic, comparison, logical, precedence, short-circuit | implemented |
| 2.4 | Type Conversion | `type-conversion` | Beginner | 20 min | 40 | `python.foundations.operators-and-expressions` | implicit vs explicit casts, truthiness, safe parsing | implemented |
| 2.5 | Python Lists vs NumPy Arrays | `lists-vs-numpy-arrays` | Beginner | 35 min | 60 | `python.foundations.variables-and-data-types` | lists, arrays, vectorization, boolean masks, 2D slicing | implemented |

## Lessons — module `control-flow`

| # | Title | Slug | Difficulty | Time | XP | Prerequisite | Key concepts | Status |
|---|---|---|---|---|---|---|---|---|
| 2.6 | Conditionals | `conditionals` | Beginner | 25 min | 50 | `python.foundations.operators-and-expressions` | if/elif/else, nesting, guard clauses, truthiness in conditions | implemented |
| 2.7 | For Loops | `for-loops` | Beginner | 30 min | 50 | `python.control-flow.conditionals` | iteration, range, enumerate, accumulation patterns | implemented |
| 2.8 | While Loops | `while-loops` | Beginner | 25 min | 50 | `python.control-flow.for-loops` | condition-driven loops, sentinels, infinite-loop safety | implemented |
| 2.9 | Loop Control (break, continue, pass) | `loop-control` | Beginner | 20 min | 40 | `python.control-flow.while-loops` | break, continue, pass, loop-else | implemented |
| 2.10 | List Comprehensions | `list-comprehensions` | Beginner | 30 min | 60 | `python.control-flow.for-loops` | map/filter comprehension forms, readability limits | implemented |

## Lessons — module `functions`

| # | Title | Slug | Difficulty | Time | XP | Prerequisite | Key concepts | Status |
|---|---|---|---|---|---|---|---|---|
| 2.11 | Defining & Calling Functions | `defining-functions` | Beginner | 30 min | 60 | `python.control-flow.conditionals` | def, calling, docstrings, single-responsibility | implemented |
| 2.12 | Parameters, Arguments & Return Values | `parameters-and-return-values` | Beginner | 30 min | 60 | `python.functions.defining-functions` | positional args, return, None, multiple returns | implemented |
| 2.13 | Default & Keyword Arguments | `default-and-keyword-args` | Beginner | 25 min | 50 | `python.functions.parameters-and-return-values` | defaults, keyword calls, mutable-default trap | implemented |
| 2.14 | *args and **kwargs | `args-and-kwargs` | Intermediate | 25 min | 60 | `python.functions.default-and-keyword-args` | packing, unpacking, flexible signatures | implemented |
| 2.15 | Lambda Functions | `lambda-functions` | Intermediate | 20 min | 60 | `python.functions.defining-functions` | anonymous functions, sorted key=, when not to use | implemented |
| 2.16 | Higher-Order Functions | `higher-order-functions` | Intermediate | 30 min | 70 | `python.functions.lambda-functions` | functions as values, map/filter, callbacks | implemented |
| 2.17 | Scope & Closures | `scope-and-closures` | Intermediate | 30 min | 70 | `python.functions.higher-order-functions` | LEGB, global/nonlocal, closures | implemented |

## Lessons — module `data-structures`

| # | Title | Slug | Difficulty | Time | XP | Prerequisite | Key concepts | Status |
|---|---|---|---|---|---|---|---|---|
| 2.18 | Tuples | `tuples` | Beginner | 20 min | 40 | `python.foundations.variables-and-data-types` | immutability, unpacking, records, tuple vs list | implemented |
| 2.19 | Dictionaries | `dictionaries` | Beginner | 30 min | 60 | `python.foundations.variables-and-data-types` | key/value, lookup, .get, iteration, dict as row | implemented |
| 2.20 | Sets | `sets` | Beginner | 20 min | 40 | `python.data-structures.dictionaries` | uniqueness, membership, union/intersection/difference | implemented |
| 2.21 | Nested Data Structures | `nested-data-structures` | Intermediate | 30 min | 70 | `python.data-structures.dictionaries` | lists of dicts, JSON shape, safe navigation | implemented |
| 2.22 | Choosing the Right Data Structure | `choosing-the-right-structure` | Intermediate | 25 min | 60 | `python.data-structures.nested-data-structures` | container trade-offs, lookup cost, mutability needs | implemented |

## Lessons — module `oop`

| # | Title | Slug | Difficulty | Time | XP | Prerequisite | Key concepts | Status |
|---|---|---|---|---|---|---|---|---|
| 2.23 | Classes & Objects | `classes-and-objects` | Intermediate | 35 min | 70 | `python.functions.defining-functions` | class, instance, __init__, self | implemented |
| 2.24 | Attributes & Methods | `attributes-and-methods` | Intermediate | 30 min | 70 | `python.oop.classes-and-objects` | instance vs class attributes, methods, state | implemented |
| 2.25 | Inheritance | `inheritance` | Intermediate | 35 min | 80 | `python.oop.attributes-and-methods` | subclassing, super(), overriding, is-a | implemented |
| 2.26 | Encapsulation & Properties | `encapsulation-and-properties` | Intermediate | 30 min | 70 | `python.oop.inheritance` | naming conventions, @property, validation | implemented |
| 2.27 | Special Methods (Dunder) | `special-methods` | Intermediate | 30 min | 70 | `python.oop.encapsulation-and-properties` | __repr__, __len__, __eq__, operator protocols | implemented |

## Lessons — module `error-handling`

| # | Title | Slug | Difficulty | Time | XP | Prerequisite | Key concepts | Status |
|---|---|---|---|---|---|---|---|---|
| 2.28 | Exceptions & try/except | `exceptions-and-try-except` | Intermediate | 30 min | 70 | `python.functions.defining-functions` | exception types, try/except/else/finally | implemented |
| 2.29 | Raising Custom Exceptions | `raising-exceptions` | Intermediate | 25 min | 60 | `python.error-handling.exceptions-and-try-except` | raise, custom exception classes, fail fast | implemented |
| 2.30 | Reading & Writing Files | `reading-and-writing-files` | Intermediate | 30 min | 70 | `python.error-handling.exceptions-and-try-except` | open modes, with-blocks, CSV text handling | implemented |
| 2.31 | Working with Paths | `working-with-paths` | Intermediate | 20 min | 60 | `python.error-handling.reading-and-writing-files` | pathlib, joining, existence checks, portability | implemented |

## Lessons — module `python-ds-tools`

| # | Title | Slug | Difficulty | Time | XP | Prerequisite | Key concepts | Status |
|---|---|---|---|---|---|---|---|---|
| 2.32 | Package Management (pip, venv, conda) | `package-management` | Beginner | 20 min | 40 | `python.foundations.variables-and-data-types` | pip, virtual environments, requirements.txt | implemented |
| 2.33 | NumPy Operations (Deep Dive) | `numpy-operations` | Intermediate | 40 min | 80 | `python.foundations.lists-vs-numpy-arrays` | ufuncs, aggregation, axis, reshape, broadcasting rules | implemented |
| 2.34 | Dates & Times with datetime | `dates-and-times` | Intermediate | 30 min | 70 | `python.functions.defining-functions` | datetime, timedelta, parsing/formatting, timezones intro | implemented |
| 2.35 | Regex for Data | `regex-for-data` | Intermediate | 35 min | 80 | `python.foundations.strings-and-string-methods` | patterns, groups, re.findall/sub, extraction | implemented |
| 2.36 | 🏗 Project: Build a Data Pipeline in Python | `project-python-pipeline` | Intermediate | 60 min | 200 | `python.python-ds-tools.regex-for-data` | read → clean → transform → summarize pipeline | implemented |

Domain status: COMPLETE — all 36 lessons implemented and registered (7 modules).
Exercise ID prefix: `py01`–`py36` by course-wide lesson position.
