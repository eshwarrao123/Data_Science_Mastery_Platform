# Foundations Quality Audit

## Verdict
PASS WITH FIXES

## Critical Issues
None. No structural, factual, or blocking defects. All 12 lessons compile (`tsc` clean from prior run), all exercise IDs unique (fnd01–fnd12, `uniq -d` empty), all 12-block structures intact, prerequisite chain is linear and correct.

## High Priority Improvements
1. **Forbidden phrase "obviously" (§4.6/§14.2 hard ban) in new lesson** — `correlation-vs-causation.ts`: hook (~L28) "Obviously not" and interview answer (~L506) "ice cream obviously doesn't cause". Must be reworded.
2. **Forbidden phrase "simply" (§4.6/§14.2 hard ban) in new lesson** — `project-first-dataset.ts` ×2 (~L281 "simply aren't in the data", ~L512 "simply absent from the data"). Must be reworded.
3. **Generic company labels violate §2.3** — `project-first-dataset.ts` realWorldApps use "Any startup" and "Data teams everywhere" instead of named, recognisable companies. Replace ≥2 with real names (e.g. Lime is fine; swap the other two for Citi Bike / Bird / Voi etc.).
4. **Unearned concept (correlation coefficient scale)** — `correlation-vs-causation.ts` Hard example + interview use "0.95 correlation" numerically; no lesson teaches the −1…1 coefficient. Keep qualitative ("very strong") or add a one-line inline definition.
5. **Mild forward-lean on "skew"** — `mean-median-mode.ts` relies on skew intuition that `distributions-intuition.ts` formally teaches next. It IS defined inline so it's compliant, but consider a one-line "you'll see this fully next lesson" pointer to be clean.
6. **`isinstance` in project coding exercise** — `fnd12_code_01` uses `isinstance()`, the most advanced construct in a domain billed as "no coding required." Acceptable (consistent with M1/M2 inline blocks) but the highest-friction item for a true beginner; consider a simpler check.

## Repetition Findings
- **Company reuse across domain (minor, acceptable):** Netflix (M1 what-is-data-science + new correlation), Spotify (M1 ×2). New stats lessons otherwise introduce all-fresh companies (Zillow, Glassdoor, Zara, Cloudflare, Duolingo, Strava, Booking.com) — good diversity.
- **No duplicated explanations, examples, quiz items, or interview questions** detected across the 4 new lessons or against M1/M2.
- **Structural sameness is by design** (frozen 12-block template); not flagged as repetition.

## Progression Findings
- Concept order is sound: central tendency → distributions (spread/shape) → correlation/causation → capstone. Each new lesson's prerequisite is the previous lesson; chain terminates the domain correctly.
- Worked-example ladders (Very Easy → Industry) present and correctly ordered in all 4 lessons.
- One soft dependency inversion (skew — item 5) and one unearned metric (coefficient — item 4); neither blocks a learner who did the prerequisites.

## Assessment Findings
- Exercise IDs unique domain-wide; no collisions.
- Difficulty spread per lesson ≈ 2 Easy / 3 Medium / 1 Hard — within §2.8 tolerance.
- Answers/explanations spot-checked (mean-vs-median, confounder, bias generalisation, outlier handling) — logically correct, and explanations address wrong options per §8.2.
- Mastery threshold 80% (stricter than §2.9's 70%) — consistent with M1/M2, fine.
- Quizzes map to stated objectives in each lesson.

## Project Findings
- **Uses only prior knowledge:** reading/unit-of-observation (M2), data types (M1), quality audit (M2), bias (M2), mean/median (stats) — all taught before it. No hidden statistical prerequisite.
- **Realism:** Strong. GreenWheels pilot framing, messy 12-row log with 4 seeded issues (NULLs, duplicate, 210-min outlier, "Member" in age), stakeholder standup deliverable — reads as a genuine junior task, not an exam.
- **Actionability:** Six-step workflow is explicit; guided investigation walks each step; inline activity is concrete and runnable. Sufficiently actionable.
- **Only gaps:** the two "simply" bans (item 2), generic company cards (item 3), and `isinstance` friction (item 6).

## Recommended Fix Order
1. Reword "obviously" ×2 in `correlation-vs-causation.ts` (hard ban).
2. Reword "simply" ×2 in `project-first-dataset.ts` (hard ban).
3. Replace generic company labels in `project-first-dataset.ts` realWorldApps.
4. Soften/anchor the "0.95 correlation" references in `correlation-vs-causation.ts`.
5. (Optional polish) Add forward-pointer for "skew" in `mean-median-mode.ts`.
6. (Optional) Simplify `fnd12_code_01` to avoid `isinstance`.
7. Re-run `npx tsc --noEmit`.

## Lessons Requiring Changes
| Lesson | Severity | Reason |
| --- | --- | --- |
| correlation-vs-causation.ts | High | "obviously" ×2 (forbidden §4.6); unearned "0.95" coefficient |
| project-first-dataset.ts | High | "simply" ×2 (forbidden §4.6); generic company labels (§2.3); `isinstance` friction |
| mean-median-mode.ts | Low | Relies on skew intuition formalised in next lesson (defined inline, optional pointer) |
| distributions-intuition.ts | None | No changes required |
