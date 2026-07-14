# DSM Visual Design Specification

**Data Science Mastery — Premium Learning OS**
**Authoritative source for all visual and UX decisions. Read this before any UI work.**

---

## 0. How to Use This Document

Every session that touches UI must:
1. Read this file first.
2. Inspect only the relevant page and its shared components.
3. Preserve all functionality and business logic — routing, stores, engines, data.
4. Treat existing styling as fully replaceable. Visual fidelity to this spec outweighs CSS minimalism.
5. When reference images are supplied, match their hierarchy, density, layout philosophy, and section rhythm — not just their surface colors.
6. Validate: `npx tsc --noEmit` then `npm run build` before closing.

---

## 1. Product Visual Identity

**DSM is a Premium Data Science Learning OS.**

It is a structured, interactive, beginner-to-industry-ready education product. Its audience is students and career-changers with no assumed technical background who aspire to become data scientists.

### Must feel like
- A high-quality interactive learning product (think Duolingo meets a premium coding school)
- Educational, welcoming, structured, motivating
- Spacious but purposeful — every surface teaches something
- Premium without being cold
- Friendly without being childish

### Must NOT feel like
- Vercel — minimal dark dashboard, thin borders, monochrome grays, engineering tool
- Linear — productivity SaaS, issue tracker aesthetics, dense sidebar navigation
- GitHub — code repository, documentation, mono-weight text walls
- An AI SaaS dashboard — purple gradients, glow blobs, "powered by AI" UI
- An admin panel — data tables, filter bars, status dropdowns as primary UI
- A terminal — command-line aesthetics, monospace everywhere, neon on black
- Developer documentation — long vertical text pages with anchor-nav sidebars

---

## 2. Core Visual Philosophy

**Dark does not mean monochromatic.**

DSM uses a deep charcoal/slate canvas as its foundation, but layers it with meaningful surface hierarchy, tinted learning surfaces, domain accents, and visual grouping. A page should never be composed almost entirely of `#000` backgrounds, gray borders, identical dark cards, and white headings.

### Canvas Foundation

| Token | Value | Role |
|---|---|---|
| `--bg-base` | `#0f1117` | Page background — deep charcoal, not pure black |
| `--bg-elevated` | `#171c26` | Primary surface (cards, panels) |
| `--bg-subtle` | `#1e2433` | Secondary surface (inset areas, hover, code blocks) |
| `--bg-overlay` | `rgba(255,255,255,0.04)` | Overlay tints |

### Surface Layering Rules
- Use at least two distinct background levels on every page. Base → Elevated → Subtle.
- Tinted surfaces: for active learning areas, apply a faint domain-color tint (`/5` opacity) behind the card. Example: a Python lesson card may use `bg-violet-500/5` as its background with `border-violet-500/20`.
- Soft glows: a single `box-shadow` or radial gradient bleed is permitted on hero sections and active lesson cards. Use it once per major section, not everywhere.
- Avoid pages where every element sits on the same background value.

---

## 3. Semantic Domain Color System

Colors communicate learning domain. They are contextual accents, not decorative gradients.

| Domain | Color Family | Hex Anchor | Usage |
|---|---|---|---|
| Foundations (Excel, BI, Tableau) | Sky blue | `#0ea5e9` | `text-sky-400`, `bg-sky-500`, borders `sky-500/30` |
| Programming (Python, R) | Violet | `#8b5cf6` | `text-violet-400`, `bg-violet-500`, borders `violet-500/30` |
| Math & Statistics | Amber | `#f59e0b` | `text-amber-400`, `bg-amber-500`, borders `amber-500/30` |
| Data Analysis (Pandas, EDA) | Emerald | `#10b981` | `text-emerald-400`, `bg-emerald-500`, borders `emerald-500/30` |
| Machine Learning | Orange | `#f97316` | `text-orange-400`, `bg-orange-500`, borders `orange-500/30` |
| SQL / Databases | Teal | `#14b8a6` | `text-teal-400`, `bg-teal-500`, borders `teal-500/30` |
| Big Data | Pink | `#ec4899` | `text-pink-400`, `bg-pink-500`, borders `pink-500/30` |
| Deep Learning / AI | Rose | `#f43f5e` | `text-rose-400`, `bg-rose-500`, borders `rose-500/30` |
| MLOps / Deployment | Indigo | `#6366f1` | `text-indigo-400`, `bg-indigo-500`, borders `indigo-500/30` |
| Industry Readiness | Yellow | `#eab308` | `text-yellow-400`, `bg-yellow-500`, borders `yellow-500/30` |

### Domain Color Rules
- Apply domain color to: section node/dot, progress bar fill, status badge, course card accent edge, continue-banner border, skill tag background.
- A domain color must NOT span an entire section background. Use it at `/5`–`/10` opacity for fills, full opacity for icons and progress fills only.
- Do not mix domain colors decoratively. If a card belongs to Python, it uses violet — not a rainbow.
- Gray/neutral elements have no domain accent. Domain accents are earned by context.

### System Status Colors (non-domain)

| State | Color | Usage |
|---|---|---|
| Completed | `emerald-500` | Checkmarks, completed badges, filled progress |
| In Progress | Domain color | Active course/section indicators |
| Locked / Coming Soon | `--text-muted` gray | Dimmed content, lock icons |
| XP / Reward | `amber-500` | Streak flame, XP badges |
| Error | `red-500` | Exercise wrong answer, build errors |
| Warning | `amber-400` | Prerequisites, cautions |

---

## 4. Card Design Rules

**Forbid: pages composed of endless identical thin-bordered rectangles.**

Cards must earn their presence. Use hierarchy: not every card is equal. Differentiate by size, surface level, border treatment, accent, and visual weight.

### Card Taxonomy

**Primary Learning Card** — lesson card, featured course card, hero course entry
- Larger surface area
- Domain-tinted background (`bg-domain/5`)
- Domain-colored left edge (`border-l-2 border-domain`) or accent glow
- Large icon or illustration area (at minimum 48×48px icon zone)
- Visible progress bar if applicable
- Clear single CTA — "Start", "Continue", "Resume"
- Hover: `border-domain/40` + subtle `shadow-lg`

**Secondary Card** — module card, supporting resource, topic chip
- `bg-elevated` surface, `border-[var(--border-color)]`
- Smaller footprint
- No accent edge unless actively selected
- Hover: `bg-subtle` transition

**Interactive Card** — exercise card, coding challenge card, quiz prompt
- Distinct surface: `bg-subtle` with `border-2`
- Active state: domain color border + `shadow-md`
- Always contains an action or input — not passive content
- Clear affordance (button, input area, clickable zone)

**Progress Card** — journey summary, XP card, streak card, stage overview
- Uses large number typography as the primary visual element
- Progress bar or ring visualization inline
- Domain or status color on the metric value
- Compact but dense — multiple stats in a small footprint

**Course Card** — curriculum listing, dashboard course row
- Three-section structure: header (title + domain badge), body (description + module count + difficulty), footer (progress bar + CTA)
- Domain badge top-right or inline with title
- Progress bar always present for started courses
- CTA: "Continue" (primary) or "Start" (secondary)

**Challenge / Exercise Card** — interview prep, exercise list item
- Difficulty badge (Easy / Medium / Hard / Challenge) using status color
- Language tag (Python, SQL, R)
- No background tint — clean surface with left border domain accent
- On hover: slide in subtle background tint

**Code Workspace Surface** — inline playground, standalone editor
- `bg-[#0d1117]` (near-black code background — intentionally darker than base)
- Font: monospace (JetBrains Mono or equivalent, or system `font-mono`)
- Syntax: green strings, blue keywords, orange numbers, gray comments
- Rounded top corners, inset within a card — visually distinct from prose
- Header bar: filename chip, language badge, Run button (primary action)
- Output zone: separated by a subtle divider, `bg-subtle`, scrollable

**DSM Tutor Surface** — contextual AI chat panel
- Warm, slightly off-white surface tint when active to distinguish from code: `bg-[#1a1f2e]` with `border-indigo-500/30`
- Subtle gradient border or glow on the left edge
- Tutor avatar/icon in accent color (indigo or branded)
- Messages: compact, readable, no wall-of-text — tutor speaks in bullets and short paragraphs
- Input bar: prominent, always visible at panel bottom

---

## 5. Page Composition

**Pages must not look like vertical documentation.**

Every major page should have varied section rhythm — sections differ in background level, layout pattern, content density, and purpose.

### Composition Patterns (use, mix, and vary)

**Learning Journey Track** — curriculum, roadmap
- Vertical path with milestone nodes
- Domain-colored dots/connectors
- Progressive state: completed → active → locked
- Stages expand/collapse with rich preview — not just text lists

**Feature Showcase Split** — homepage platform section
- 60/40 or 50/50 horizontal split: visual/demo left, explanation right (or vice versa)
- Left side: real UI preview, code preview, diagram, or illustration
- Right side: headline + bullet values + CTA
- Alternate left/right for multiple sections

**Mastery Blueprint** — numbered steps or a process flow
- Only use step numbers (01, 02, 03) when the content is genuinely sequential
- Large step numbers as display elements — `text-6xl font-bold text-domain/20` (ghosted behind content)
- Icon + label + short description — not icon + label + wall of body text

**Hero Section**
- Full-width with layered background (dot-grid, subtle pattern, or tinted canvas)
- Display heading: 3xl–5xl, high contrast, no thin fonts
- Sub-heading: 1–2 sentences max — learner-focused value, not feature list
- Primary CTA: large, domain-accented, obvious
- Secondary CTA: text or ghost
- Stats or social proof: small tile row below CTA — 3–4 stats max

**Asymmetric Grid** — features, skills, outcomes
- Mix card widths: 1 full-width + 2 half-width, or 1 two-thirds + 1 one-third
- Avoid 3×2 identical card grids for feature lists

**Progress Visualization Section** — curriculum overview, dashboard
- Use visual elements: progress bars, circular progress rings, stage dots, heat maps
- Numbers as heroes: `48px+` for primary metrics
- Text supports the number — not the reverse

### Section Rhythm Rules
- No two consecutive sections should share the same background value
- Alternate: `bg-base` → `bg-elevated` → `bg-base` or use tinted sections
- Each section has one primary job. Define it before building.
- Section spacing: `py-16` minimum for major sections, `py-24` for hero/CTA
- No sections that exist purely as visual filler

---

## 6. Typography

DSM targets beginner learners. Readability is non-negotiable.

### Type Scale

| Role | Size | Weight | Color | Notes |
|---|---|---|---|---|
| Display Heading | `text-4xl`–`text-5xl` | `font-bold` (700) | `--text-primary` | Hero H1 only |
| Page Title | `text-3xl` | `font-bold` | `--text-primary` | One per page |
| Section Title | `text-2xl` | `font-semibold` | `--text-primary` | Major sections |
| Lesson Title | `text-xl` | `font-semibold` | `--text-primary` | Lesson headers |
| Card Title | `text-base`–`text-lg` | `font-semibold` | `--text-primary` | |
| Body / Explanation | `text-base` | `font-normal` | `--text-secondary` | **Never dimmer than `#9ca3af`** |
| Supporting body | `text-sm` | `font-normal` | `--text-secondary` | Descriptions, module text |
| Metadata | `text-xs`–`text-sm` | `font-medium` | `--text-muted` | Timestamps, lesson count, duration |
| Label / Eyebrow | `text-[10px]`–`text-xs` | `font-semibold` uppercase | `--text-muted` | Section labels, category tags |
| Code | `text-sm` | `font-mono` | Syntax-colored | JetBrains Mono or system mono |

### Typography Rules
- Body explanations and lesson prose must use `--text-secondary` at minimum — never `--text-muted` for paragraphs.
- Beginners read everything. Do not dim educational text to pass a visual cleanliness test.
- Line height for prose: `leading-relaxed` (1.625) or `leading-loose` for longer explanations.
- Max readable width for prose/lesson content: `max-w-2xl` (65ch equivalent). Do not stretch explanation text to full container width.
- Heading stacks: never stack two headings of the same size. Create clear hierarchy with at least one size step between H1 and H2.
- No all-caps for anything longer than 4 words.

---

## 7. Spacing and Density

DSM should feel spacious but not empty. Content should fill its visual space appropriately.

### Spacing Principles
- Section padding: `py-16` for content sections, `py-24` for hero and final CTA
- Card internal padding: `p-4`–`p-6` for standard cards, `p-8` for featured/primary cards
- Grid gaps: `gap-4`–`gap-6` for card grids
- Prose content column: `max-w-2xl` for lesson explanation text, `max-w-3xl` for lesson page overall, `max-w-6xl` for page containers

### Density Rules
- **Avoid**: a single large heading and two lines of text floating in a `min-h-screen` section
- **Avoid**: text content narrower than 480px inside a 1280px container
- **Avoid**: `py-32`+ gaps between related content
- **Do**: fill major sections with real content — stats, cards, previews, visuals
- **Do**: use visual elements (progress bars, illustrations, diagrams) to give sections weight without padding abuse
- **Do**: when a section is intentionally minimal, make that minimalism expressive (large typography, strong contrast, deliberate whitespace) — not just empty

---

## 8. Learner-First UX

Every major learning page must answer at a glance:

| Question | Surface |
|---|---|
| Where am I? | Breadcrumb, page header, stage/section indicator |
| What am I learning? | Course/module/lesson title, domain badge, description |
| Why does this matter? | Learning objectives, real-world application callout |
| What should I do next? | Primary CTA, continue banner, next lesson link |
| How much have I completed? | Progress bar, lesson counter, XP earned |

### Navigation Rules
- Primary CTA on every major page: one large, obvious action. "Continue Learning", "Start Lesson", "Run Code". Never hidden below the fold on load.
- Continue/Resume banner: when a learner has in-progress content, surface it immediately — at the top of the relevant page, above the fold, before any other content.
- Locked content: show what's behind the lock (title, topic tags, lesson count) — do not hide it. Communicate the path to unlock it. Never just `opacity-50` without explanation.

---

## 9. Active Learning Surfaces

These are first-class product surfaces — not secondary tools hidden in sidebars.

**Priority order on lesson pages:**
1. Lesson explanation (prose + diagrams)
2. Code playground / inline editor
3. Exercises / quiz
4. DSM Tutor (contextual help)
5. Navigation (previous / next lesson)

### Rules
- Code editors are visually prominent — not buried in an accordion or below a long scroll
- Exercise feedback (correct/incorrect, explanation) appears immediately, inline, with clear color (emerald for correct, red for incorrect) — not a toast popup
- The DSM Tutor panel must be reachable within 1 action from any lesson step — not hidden behind multiple menus
- Progress through lesson steps must be visually tracked — a step indicator bar or checkpoint list that updates as the learner advances

---

## 10. Homepage Rules

The homepage must demonstrate the product, not describe it.

**Required communications:**
- Zero to industry-ready — structured path from beginner to employed
- Built-in coding — show the actual code editor
- DSM Tutor — surface the AI tutor in context
- Projects — show real portfolio-level project examples
- Mastery progression — show the curriculum roadmap visually
- 100% free — explicit, prominent

**Homepage must NOT:**
- Describe six features using six identical icon + title + one-line-description cards
- Use a generic "How it works" section with identical numbered circles
- Show a wall of text explaining the curriculum without visual structure
- Fake demo screenshots as static images without showing real product UI

**Homepage should:**
- Open with a thesis — the most characteristic thing about DSM (the learning path + built-in playground)
- Show the actual product — a real code editor preview, a real curriculum stage, a real project card
- Demonstrate the journey — a visual roadmap section, not a bullet list
- Use at least one large split-layout section showing the coding/tutor experience
- End with a direct CTA to Lesson 1, not a generic "Sign up"

---

## 11. Curriculum Page Rules

The curriculum must feel like entering a guided learning journey, not reading a documentation menu.

**Must have:**
- Journey header with overall progress, XP, streak, and stages-complete count
- A continue/resume banner surfaced above the journey track
- Visual stage nodes with domain colors — not plain accordion headers
- Progressive state visualization (completed / in-progress / available / coming-soon) with clear visual differentiation
- Per-section progress bars in domain color
- Motivating locked content: topic chips, descriptions, "unlocks as you advance" copy

**Must NOT look like:**
- An accordion list of text items
- A GitHub issue list
- A settings panel with toggles
- A documentation site's left nav

---

## 12. Course Page Rules

A course page is an entry point into a learning domain. It should feel like stepping into a dedicated subject area.

**Must include:**
- Domain color identity (header, nav, progress elements all use domain color)
- Course overview: title, difficulty, estimated hours, skills learned
- Module list: clearly sequenced, with lesson counts and completion status per module
- Current lesson highlight: the next lesson to take, with direct link
- Skills & prerequisites: visible context for what this course teaches and requires
- Overall course progress visualization

---

## 13. Lesson Page Rules

Lessons are the most important surface in DSM. Optimize for comprehension.

**Layout:**
- Lesson content constrained to `max-w-2xl` (prose reading width)
- Full page: `max-w-3xl` with breathing room
- Step navigation always visible (step 1 of 6 style indicator)

**Content hierarchy (per lesson step):**
1. Step label + title (where am I in this lesson)
2. Explanation prose — `text-base`, `leading-relaxed`, `--text-secondary` minimum
3. Contextual diagram or illustration (not optional for theory-heavy steps)
4. Worked example or code sample
5. Interactive component (playground, exercise, quiz)
6. DSM Tutor prompt / hint access

**Rules:**
- No step may be a wall of text without a diagram, code example, or interactive element
- Diagrams are part of the curriculum, not decorations — they must be purpose-built for the concept
- Progress through steps must be linear and visible — never show all steps simultaneously as a scroll page
- DSM Tutor is always reachable with one click from any step
- Lesson completion is a visually celebrated moment (animation, XP reward flash, next lesson prompt)

---

## 14. Coding Workspace Rules

The coding workspace is where learning becomes doing. It should feel purpose-built.

**Layout:**
- 50/50 or 40/60 split: left = problem context + instructions, right = editor + output
- Problem context: title, difficulty, scenario, expected output — scannable, not a wall of text
- Editor: dark code surface, full height, syntax highlighted, line numbers
- Output panel: below or alongside editor, clearly labeled, scrollable
- Actions: Run (primary), Reset, Hints (secondary), Ask DSM Tutor

**Feel:**
- Focused, not cluttered
- No sidebar navigation visible (hide it on workspace pages)
- Test results: inline, color-coded (green pass / red fail), with specific feedback per test
- Hints: revealed progressively — one at a time, not all at once
- DSM Tutor in workspace: context-aware — it knows the problem, the current code, and the error

---

## 15. Animation and Interaction

Motion explains state. It does not decorate.

**Use animation for:**
- Progress bar fill (on mount or when value changes)
- Lesson step transitions (slide or fade between steps)
- XP earned — number tick up animation
- Exercise result reveal (correct/incorrect state change)
- Stage/milestone completion — a brief celebratory moment
- Card hover elevation (subtle `y: -2` lift + shadow increase)
- Continue banner slide-in on load
- Roadmap node state changes

**Do NOT animate:**
- Background gradient drifts
- Floating blob shapes
- Every text element on scroll
- Borders that pulse perpetually
- Multiple competing animations in the same viewport

**Motion budget per page:** 3–5 distinct animated elements maximum. If everything moves, nothing matters.

**Respect `prefers-reduced-motion`:** Wrap all non-essential animations in motion checks.

---

## 16. Visual Fidelity Rule

When reference images are supplied for a redesign task:

- Match their **hierarchy** — the visual weight and prominence of each element
- Match their **density** — how much content per unit area
- Match their **layout philosophy** — split layouts, journey tracks, feature showcases
- Match their **card composition** — what's inside each card and in what order
- Match their **section rhythm** — alternating compositions, not identical vertical stacks

**Do NOT:**
- Preserve old styling merely because it exists
- Minimize CSS changes as a goal
- Produce a "close enough" approximation
- Argue that existing code is "already similar"

Functionality is always preserved. Presentation may be substantially replaced.

---

## 17. Anti-Pattern List

These are forbidden patterns. If you find yourself producing any of these, stop and rethink.

| Anti-Pattern | Why It Fails DSM |
|---|---|
| Vercel clone aesthetic | Dark gray + thin borders + monospace = engineering tool, not learning product |
| Linear clone aesthetic | Issue-tracker density and nav patterns alienate beginners |
| Excessive monochrome | Pages of gray-on-charcoal teach nothing about the domain |
| Endless identical bordered rectangles | No visual hierarchy = no learning hierarchy |
| Six identical icon feature cards | Does not demonstrate the product — describes it |
| Documentation-style page flow | Long vertical text with anchor navigation reads as a manual |
| Low-contrast educational text | Explanation text dimmer than `#6b7280` on dark background is inaccessible |
| Huge empty black areas | `min-h-screen` sections with a heading and two lines of text |
| Random purple AI gradients | Domain colors are earned — purple does not mean "AI-powered" |
| Neon cyberpunk styling | DSM is educational, not a hacking game or crypto dashboard |
| Glassmorphism everywhere | `backdrop-blur` card walls feel like a 2021 design template |
| Gradients on every section | A gradient is a statement — use it at most once per page, in the hero |
| Tiny metadata | `text-xs text-muted` for the only description of a locked lesson is demotivating |
| Visual decoration without learning purpose | Illustration, pattern, or animation that does not clarify or motivate |
| All-caps long labels | Caps for a full phrase is decoration, not emphasis |
| Collapsed state as default for active content | Never hide in-progress course cards by default |

---

## 18. Implementation Principles

For every visual task:

1. **Read this file first.** Before any code.
2. **Read the Next.js guide** at `node_modules/next/dist/docs/` for API-level questions.
3. **Inspect only the relevant page and its direct shared components** — don't audit the entire repo.
4. **Preserve all functionality** — routing, stores, data, business logic are not in scope.
5. **Treat existing styling as replaceable.** The presence of old CSS is not a reason to keep it.
6. **Follow reference images when supplied.** Hierarchy and layout take precedence over minimal diffs.
7. **Validate responsive behavior** — mobile (`375px`) and desktop (`1280px`) are both targets.
8. **Run `npx tsc --noEmit` then `npm run build`** before reporting completion.
9. **Keep implementation summaries concise** — list what changed and why, not every line touched.
10. **Use domain colors consistently** — a Python page is violet, a SQL page is teal, throughout.
