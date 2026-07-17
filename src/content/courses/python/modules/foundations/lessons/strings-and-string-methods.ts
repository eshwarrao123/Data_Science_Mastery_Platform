import type { Lesson } from "@/lib/curriculum/types";

export const stringsAndStringMethods: Lesson = {
  meta: {
    id: "python.foundations.strings-and-string-methods",
    slug: "strings-and-string-methods",
    title: "Strings & String Methods",
    description:
      "Work with text in Python — slicing, formatting, and the string methods you'll reach for every time you clean a messy dataset.",
    estimatedTime: "30 mins",
    difficulty: "Beginner",
    xpReward: 50,
    prerequisites: ["python.foundations.variables-and-data-types"],
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
        hook: "Real data is messy. Names arrive as '  aMArA  ', phone numbers as '(555) 123-4567', prices as '$1,299.00'. Before you can analyse any of it, you have to clean it — and cleaning text is what string methods are for. This is the most-used skill in a data analyst's day.",
        what: "A string (str) is an ordered sequence of characters wrapped in quotes. String methods are built-in functions attached to every string that let you search, reshape, split, join, and reformat that text.",
        why: "Roughly 80% of real data-cleaning work is text wrangling. A model can't average the column 'Sales' if half the rows read '1,200' and the other half read '$1200 '. You standardise text first, then analyse.",
        whereUsed:
          "Loading CSVs, parsing log files, cleaning survey responses, normalising customer names, extracting dates from filenames — every data pipeline touches strings before it touches numbers.",
        objectives: [
          "Create strings and access individual characters by index",
          "Slice substrings using the [start:stop:step] notation",
          "Clean text with .strip(), .lower(), .upper(), and .title()",
          "Search and replace with .find(), .replace(), and the in operator",
          "Split and join text with .split() and .join()",
          "Build readable output with f-strings",
        ],
        realWorldApps: [
          {
            company: "Netflix",
            headline: "Title normalisation for search",
            detail:
              "Search queries are lowercased and stripped so that '  STRANGER things ' matches the catalogue entry 'Stranger Things' regardless of how a user types it.",
          },
          {
            company: "Airbnb",
            headline: "Cleaning host-entered city names",
            detail:
              "Hosts type cities inconsistently ('new york', 'New York ', 'NEW YORK'). A .strip().title() pipeline collapses them to one canonical 'New York' before grouping listings.",
          },
          {
            company: "Stripe",
            headline: "Parsing payment descriptors",
            detail:
              "Bank descriptors arrive as raw strings. .split() and .replace() extract the merchant name and reference code so each charge can be matched to an order.",
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
            "A string is created by wrapping text in single quotes ('hi') or double quotes (\"hi\") — Python treats them the same. For text that spans multiple lines, use triple quotes ('''...'''). Under the hood, a string is a sequence: an ordered line of characters, each with a position number called an index.",
        },
        {
          type: "analogy",
          title: "A string is a row of numbered lockers",
          content:
            "Picture the word 'SCORE' as five lockers in a row. The first locker is number 0, not 1 — Python counts from zero. So 'SCORE'[0] is 'S' and 'SCORE'[4] is 'E'. You can also count backwards: 'SCORE'[-1] is the last locker, 'E'.",
        },
        {
          type: "keypoint",
          title: "Slicing: [start:stop:step]",
          content:
            "text[start:stop] returns the characters from index start up to — but not including — stop. Leaving a side blank means 'all the way': text[:3] is the first three characters, text[3:] is everything from index 3 onward. A third number is the step: text[::2] takes every second character, text[::-1] reverses the whole string.",
        },
        {
          type: "text",
          content:
            "Strings are immutable — once created, they can never be changed in place. Methods like .upper() or .replace() do not edit the original; they build and return a brand-new string. You must capture that result in a variable, or it is lost.",
        },
        {
          type: "analogy",
          title: "Methods are a photocopier, not an eraser",
          content:
            "Calling name.upper() is like feeding a document into a photocopier set to 'ALL CAPS'. The original stays exactly as it was; you get a new copy back. If you don't keep the copy (clean = name.upper()), you've done the work for nothing.",
        },
        {
          type: "expandable",
          title: "Why is the stop index excluded from a slice?",
          content:
            "It makes lengths obvious and slices joinable. text[0:3] returns exactly 3 characters (3 minus 0), and text[:3] followed by text[3:] reconstructs the whole string with no gap or overlap. This 'half-open interval' convention is the same one range() and list slicing use, so learning it once pays off everywhere in Python.",
        },
        {
          type: "code-note",
          code: "raw = '  Amara Okafor  '\nclean = raw.strip()          # removes leading/trailing spaces\nprint(repr(clean))           # 'Amara Okafor'\nprint(clean.upper())         # 'AMARA OKAFOR'\nprint(clean.split())         # ['Amara', 'Okafor']\nprint(raw)                   # '  Amara Okafor  '  (unchanged!)",
          content:
            "Notice raw is untouched at the end — every method returned a new string. .strip() trims whitespace, .upper() recases, .split() breaks on spaces into a list. These three cover most day-one cleaning tasks.",
        },
        {
          type: "warning",
          title: "Methods return, they do not mutate",
          content:
            "name.strip() on its own line does nothing useful — the trimmed copy is thrown away. You must write name = name.strip() to keep it. This is the single most common string bug for beginners.",
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
        title: "A Text-Cleaning Pipeline",
        caption:
          "Click each stage to see how one messy customer name flows through common string methods into clean, analysis-ready data.",
        nodes: [
          {
            id: "raw",
            label: "Raw input",
            sublabel: "'  jAMAL  '",
            detail:
              "Text as it arrives from a form or CSV: stray spaces, inconsistent casing. Untrustworthy until cleaned. This is the state 80% of real-world text starts in.",
            x: 12,
            y: 30,
            accent: false,
          },
          {
            id: "strip",
            label: ".strip()",
            sublabel: "'jAMAL'",
            detail:
              "Removes leading and trailing whitespace. Always the first step — invisible spaces silently break grouping and matching. Returns a new string.",
            x: 38,
            y: 30,
            accent: true,
          },
          {
            id: "title",
            label: ".title()",
            sublabel: "'Jamal'",
            detail:
              "Capitalises the first letter of each word and lowercases the rest. Turns 'jAMAL', 'JAMAL', and 'jamal' all into the single canonical 'Jamal'.",
            x: 64,
            y: 30,
            accent: false,
          },
          {
            id: "clean",
            label: "Clean value",
            sublabel: "'Jamal'",
            detail:
              "Standardised and ready to group, count, or join to other tables. Every raw variant now collapses to one consistent key.",
            x: 88,
            y: 30,
            accent: false,
          },
          {
            id: "check",
            label: "in / .startswith()",
            sublabel: "'J' in name",
            detail:
              "Validation lives alongside cleaning: the in operator tests membership, .startswith()/.endswith() test prefixes and suffixes — both return a bool for filtering.",
            x: 50,
            y: 72,
            accent: false,
          },
        ],
        edges: [
          { from: "raw", to: "strip", label: "trim spaces" },
          { from: "strip", to: "title", label: "fix casing" },
          { from: "title", to: "clean", label: "canonical" },
          { from: "clean", to: "check", label: "then validate" },
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
          title: "Index and slice a name",
          scenario: "You want the first initial of a customer's name for a badge.",
          steps: [
            {
              code: "name = 'Priya'",
              explanation:
                "We store the string 'Priya'. Its characters sit at indexes 0 through 4: P(0) r(1) i(2) y(3) a(4).",
            },
            {
              code: "initial = name[0]",
              explanation:
                "Indexing with [0] grabs the single character at position 0 — the letter 'P'. Remember Python counts from zero, so [0] is the first character, not [1].",
            },
            {
              code: "print(initial)",
              explanation:
                "This prints P. A single-character access always returns a one-character string, which is itself still a str.",
            },
          ],
          output: "P",
        },
        {
          difficulty: "Easy",
          title: "Clean a messy product name",
          scenario:
            "A product feed sends names with inconsistent spacing and casing. Standardise one entry.",
          steps: [
            {
              code: "raw = '  wireless MOUSE  '",
              explanation:
                "The raw value has leading/trailing spaces and mixed casing — typical of scraped or user-entered data.",
            },
            {
              code: "trimmed = raw.strip()",
              explanation:
                ".strip() returns a new string with outer whitespace removed: 'wireless MOUSE'. The inner space between words is left alone.",
            },
            {
              code: "clean = trimmed.title()",
              explanation:
                ".title() capitalises the first letter of each word and lowercases the rest, giving 'Wireless Mouse'. Now every casing variant collapses to one form.",
            },
            {
              code: "print(clean)",
              explanation:
                "Prints Wireless Mouse — a consistent value you could safely group or deduplicate on.",
            },
          ],
          output: "Wireless Mouse",
        },
        {
          difficulty: "Medium",
          title: "Split a full name into parts",
          scenario:
            "A CSV stores names in one 'full_name' column. You need separate first and last names.",
          steps: [
            {
              code: "full_name = 'Wei Zhang'",
              explanation:
                "One string holding two words separated by a space.",
            },
            {
              code: "parts = full_name.split()",
              explanation:
                ".split() with no argument breaks the string on any whitespace and returns a list: ['Wei', 'Zhang']. This is the workhorse for pulling structured fields out of text.",
            },
            {
              code: "first = parts[0]\nlast = parts[1]",
              explanation:
                "We index into the list to pull each piece. parts[0] is 'Wei', parts[1] is 'Zhang'. (In production you'd guard against names with more or fewer than two parts.)",
            },
            {
              code: "print(f'First: {first}, Last: {last}')",
              explanation:
                "An f-string embeds both variables in one readable line of output.",
            },
          ],
          output: "First: Wei, Last: Zhang",
        },
        {
          difficulty: "Hard",
          title: "Turn a price string into a number",
          scenario:
            "A sales export stores prices as strings like '$1,299.00'. You need a float to do arithmetic.",
          steps: [
            {
              code: "price_str = '$1,299.00'",
              explanation:
                "The dollar sign and thousands comma make this text, not a number. float('$1,299.00') would raise a ValueError as-is.",
            },
            {
              code: "no_dollar = price_str.replace('$', '')",
              explanation:
                ".replace(old, new) swaps every occurrence of a substring. Replacing '$' with an empty string '' deletes it, leaving '1,299.00'.",
            },
            {
              code: "no_comma = no_dollar.replace(',', '')",
              explanation:
                "We chain a second .replace() to strip the comma, giving the clean numeric string '1299.00'. Each call returns a new string we feed into the next.",
            },
            {
              code: "price = float(no_comma)",
              explanation:
                "Now that only digits and a decimal point remain, float() succeeds and returns 1299.0 — a real number you can sum or average.",
            },
            {
              code: "print(price * 2)",
              explanation:
                "Proof it's numeric: multiplying by 2 gives 2598.0. Had price still been a string, * 2 would have duplicated the text instead.",
            },
          ],
          output: "2598.0",
        },
        {
          difficulty: "Industry Example",
          title: "Standardising a column of email domains",
          scenario:
            "A data analyst at a SaaS company needs to group signups by email domain. Raw emails come in mixed case with stray spaces, and the domain is the part after the @.",
          steps: [
            {
              code: "# Simulating one value from the 'email' column\nraw_email = '  Dave.Miller@ACME.com '",
              explanation:
                "In pandas this would be one cell of a Series. We clean a single value first to nail the logic before vectorising it.",
            },
            {
              code: "email = raw_email.strip().lower()",
              explanation:
                "Method chaining: .strip() removes the outer spaces, then .lower() runs on that result to make everything lowercase — 'dave.miller@acme.com'. Casing must be normalised so 'ACME.com' and 'acme.com' count as the same domain.",
            },
            {
              code: "at_index = email.find('@')",
              explanation:
                ".find() returns the index of the first '@' (here 11), or -1 if it's absent. Storing the position lets us slice precisely. In real code you'd check it isn't -1 before slicing.",
            },
            {
              code: "domain = email[at_index + 1:]",
              explanation:
                "Slicing from at_index + 1 to the end grabs everything after the @: 'acme.com'. We add 1 so the @ itself is excluded.",
            },
            {
              code: "print(domain)",
              explanation:
                "Prints acme.com. In pandas the whole column becomes: df['domain'] = df['email'].str.strip().str.lower().str.split('@').str[1] — the same steps, applied to every row at once.",
            },
          ],
          output: "acme.com",
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
        language: "python",
        filename: "clean_customer.py",
        instructions:
          "A support system stores customer records as one raw string per line: 'lastname,firstname,city'. Clean and reformat the record below. Use the string methods provided — do not hard-code the final text.",
        starterCode: `# Raw customer record: last,first,city (messy casing + spaces)
record = "  OKAFOR,amara,  LAGOS  "

# TODO 1: strip outer spaces, then split on the comma into a list of 3 parts
parts = ___

# TODO 2: pull last, first, city out of parts and clean each one
#         last  -> Title case   (Okafor)
#         first -> Title case   (Amara)
#         city  -> strip spaces, Title case (Lagos)
last = ___
first = ___
city = ___

# TODO 3: build a greeting like: "Amara Okafor from Lagos"
greeting = ___

print(greeting)`,
        solutionCode: `# Raw customer record: last,first,city (messy casing + spaces)
record = "  OKAFOR,amara,  LAGOS  "

parts = record.strip().split(",")

last = parts[0].title()
first = parts[1].title()
city = parts[2].strip().title()

greeting = f"{first} {last} from {city}"

print(greeting)`,
        expectedOutput: "Amara Okafor from Lagos",
        hints: [
          "Chain the calls: record.strip() removes the outer spaces, then .split(',') breaks it into a list on each comma.",
          "parts[0] is the last name, parts[1] the first name, parts[2] the city. Each is still a string you can call .title() on.",
          "The city part still has inner spaces ('  LAGOS  '), so strip it before applying .title().",
          "Build the final line with an f-string: f\"{first} {last} from {city}\".",
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
          id: "py03_mcq_01",
          difficulty: "Easy",
          question: "What does 'Sales'[1] return?",
          options: ["'S'", "'a'", "'Sa'", "A IndexError"],
          correctIndex: 1,
          explanation:
            "Python indexes from 0, so [0] is 'S' and [1] is the second character, 'a'.",
        },
        {
          type: "mcq",
          id: "py03_mcq_02",
          difficulty: "Easy",
          question:
            "After running name = '  Bob  ' and then name.strip(), what is the value of name?",
          options: ["'Bob'", "'  Bob  '", "'Bob  '", "An error"],
          correctIndex: 1,
          explanation:
            "Strings are immutable and .strip() returns a NEW string. Because the result was never assigned back, name still holds the original '  Bob  '. You'd need name = name.strip().",
        },
        {
          type: "mcq",
          id: "py03_mcq_03",
          difficulty: "Medium",
          question: "What does 'temperature'[:4] return?",
          options: ["'temp'", "'temper'", "'tempe'", "'erat'"],
          correctIndex: 0,
          explanation:
            "[:4] is a slice from the start up to (but not including) index 4, giving the first four characters: t, e, m, p — 'temp'.",
        },
        {
          type: "scenario",
          id: "py03_sc_01",
          difficulty: "Medium",
          scenario:
            "You're loading a 'country' column where values arrive as 'usa', 'USA ', ' Usa'. You need all three to group together as one country.",
          question:
            "Which single expression standardises a value so all three variants match?",
          options: [
            "value.upper() only",
            "value.strip() only",
            "value.strip().upper()",
            "value.replace(' ', '').title()",
          ],
          correctIndex: 2,
          explanation:
            "The variants differ in both surrounding spaces and casing, so you must fix both: .strip() removes the spaces and .upper() (or .lower()) unifies the casing. .strip() alone leaves 'usa' vs 'USA' different; .upper() alone leaves the trailing space on 'USA '.",
        },
        {
          type: "coding",
          id: "py03_code_01",
          difficulty: "Medium",
          prompt:
            "A sensor logs a reading as the string '  Temp: 21.5C  '. Extract just the numeric part and print it as a float. Steps: strip the spaces, remove 'Temp: ' and the trailing 'C', then convert. Use reading = '  Temp: 21.5C  '. Expected output: 21.5",
          starterCode: "reading = '  Temp: 21.5C  '\n# Your code here\n",
          solutionCode:
            "reading = '  Temp: 21.5C  '\nvalue = reading.strip().replace('Temp: ', '').replace('C', '')\nprint(float(value))",
          expectedOutput: "21.5",
          tests: [
            {
              name: "Returns a float",
              description: "The printed value must be numeric 21.5, not the string '21.5C'.",
            },
            {
              name: "Handles surrounding whitespace",
              description: "Leading and trailing spaces must be removed before conversion.",
            },
          ],
        },
        {
          type: "coding",
          id: "py03_code_02",
          difficulty: "Hard",
          prompt:
            "Given a comma-separated tags string 'python, Data , SQL, data', print the number of UNIQUE tags after cleaning (lowercase everything and remove the stray spaces). One new helper: set() takes a list and throws away duplicates, so len(set(some_list)) counts unique items. Clean the whole string first with the methods you know, then split. Use tags = 'python, Data , SQL, data'. Expected output: 3",
          starterCode:
            "tags = 'python, Data , SQL, data'\n# Hint: .lower() and .replace(' ', '') clean the whole string at once\n# Then .split(',') and count unique items with len(set(...))\n",
          solutionCode:
            "tags = 'python, Data , SQL, data'\ncleaned = tags.lower().replace(' ', '')\ntag_list = cleaned.split(',')\nprint(len(set(tag_list)))",
          expectedOutput: "3",
          tests: [
            {
              name: "Cleans before splitting",
              description:
                "The whole string is lowercased and spaces removed with chained methods, so 'Data' and ' data' become identical.",
            },
            {
              name: "Counts unique tags",
              description:
                "After .split(','), len(set(...)) must report 3 unique tags: python, data, sql.",
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
            "What does it mean that Python strings are immutable, and how do string methods work given that?",
          answer:
            "Immutable means a string's contents can never change after it's created — there's no way to overwrite a single character in place, and name[0] = 'X' raises a TypeError. String methods like .upper(), .strip(), and .replace() therefore don't modify the original; they construct and return a brand-new string, leaving the source untouched. In practice that means you must capture the result: name = name.strip(), not just name.strip(). Immutability is also why strings can be dictionary keys and why they're safe to share across your program without one part accidentally mutating another's copy.",
        },
        {
          question:
            "Walk me through how you'd standardise a messy column of customer names for grouping.",
          answer:
            "I'd build a small chain that attacks each source of inconsistency. First .strip() to remove leading and trailing whitespace, which silently breaks grouping because 'Amara' and 'Amara ' look identical but aren't. Then a casing normaliser — .lower() or .title() depending on whether I want a canonical display form — so 'AMARA', 'amara', and 'Amara' collapse into one. If the field mixes several pieces, like 'last,first', I'd .split(',') and reassemble in a consistent order. In pandas the same logic vectorises with the .str accessor: df['name'].str.strip().str.title(). The principle is: normalise every axis of variation — whitespace, casing, ordering — before you group or join, or your counts will be silently wrong.",
        },
        {
          question:
            "How does slicing work in Python, and why is the stop index exclusive?",
          answer:
            "Slicing uses text[start:stop:step]: it returns characters from index start up to but not including stop, optionally skipping by step. Omitting a bound means 'to the edge' — text[:3] is the first three characters, text[3:] is the rest, and negative indices count from the end so text[-1] is the last character and text[::-1] reverses the string. The stop being exclusive is deliberate: text[0:3] yields exactly 3 - 0 = 3 characters, so the length is trivial to reason about, and text[:n] + text[n:] always reconstructs the original with no overlap or gap. That half-open convention is consistent with range() and list slicing, so once you internalise it, it applies everywhere in Python.",
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
        "1) Expecting a method to change the string in place — name.strip() does nothing unless you write name = name.strip(), because strings are immutable. 2) Off-by-one indexing: the first character is [0], and a slice's stop index is excluded, so 'Sales'[0:2] is 'Sa', not 'Sal'. 3) Forgetting that .split() with no argument splits on any whitespace, while .split(',') splits only on commas — mixing them up mangles your fields. 4) Calling numeric conversion on dirty text: float('$1,299') raises a ValueError; strip the '$' and ',' first. 5) Comparing strings that differ only in case or spacing ('USA' vs 'usa ') and wondering why they don't match — normalise with .strip().lower() before comparing.",
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
        "Try these prompts in the AI Tutor panel: • 'ELI5: what does the slice [::-1] do and why?' • 'Quiz me on what .split() vs .join() return for a few examples.' • 'Show me a real data-cleaning bug caused by forgetting to reassign after .strip().' • 'Give me five messy price strings and let me practise converting each to a float.' • 'Interview mode: ask me why Python strings are immutable and grade my answer.'",
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
        "String (str) — an ordered, immutable sequence of characters in quotes. Index — the position number of a character, starting at 0; negatives count from the end. Slice — a substring pulled with [start:stop:step], where stop is excluded. Immutable — cannot be changed after creation; methods return a new string. Method — a function attached to an object, called with a dot: name.upper(). .strip() — removes surrounding whitespace. .lower()/.upper()/.title() — change casing. .replace(old, new) — swaps every occurrence of a substring. .split(sep) — breaks a string into a list. .join(list) — glues a list of strings into one. in — membership operator returning a bool. f-string — a formatted literal (prefixed f) embedding variables inside {}.",
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
        "• Docs: the Python 'Text Sequence Type — str' reference lists every string method with examples. • Read: 'An Informal Introduction to Python → Strings' in the official tutorial for indexing and slicing from the source. • Practice: take five messy values from any spreadsheet you have and clean each one to a canonical form in a REPL. • Next in DSM: you can store and clean values — next you'll compute with them and build the boolean conditions behind every data filter in Operators & Expressions.",
    },

    /* ---------------------------------------------------------------- */
    /*  12 — Recap                                                       */
    /* ---------------------------------------------------------------- */
    {
      id: "recap",
      type: "recap",
      tocLabel: "Recap",
      content:
        "✓ A string is an ordered, immutable sequence of characters indexed from 0.\n✓ Slice with [start:stop:step]; the stop index is excluded and negatives count from the end.\n✓ Methods return a new string — always reassign (name = name.strip()).\n✓ .strip(), .lower(), .upper(), and .title() are your core text-cleaning tools.\n✓ .split() breaks text into a list; .join() glues a list back into text.\n✓ Clean dirty numeric text with .replace() before calling float() or int().\n\nNext up: Operators & Expressions. You can store and clean values — next you'll calculate with them, compare them, and combine comparisons into the boolean logic that powers every data filter.",
    },
  ],
};
