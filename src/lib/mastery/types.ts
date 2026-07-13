/* ------------------------------------------------------------------ */
/*  DSM Mastery Engine — Types                                          */
/* ------------------------------------------------------------------ */

/** Declares how one block contributes to lesson mastery. */
export interface BlockMasteryRule {
  blockId: string;
  /** If true, this block must be completed for the lesson to be mastered. */
  required?: boolean;
  /** Contribution weight relative to other rules (default 1). */
  weight?: number;
}

/**
 * Per-lesson mastery configuration — attach to a lesson's content file
 * or pass dynamically; never hardcoded in renderers.
 */
export interface LessonMasteryConfig {
  rules: BlockMasteryRule[];
  /** Score threshold for `mastered: true` (0–100, default 80). */
  passingScore?: number;
  /**
   * How much the quiz `lastScore` blends into the final score (0–1).
   * 0 = completion-only; 1 = quiz score only; default 0.
   */
  quizWeight?: number;
}

export interface LessonMasteryResult {
  /** Blended completion + quiz score, 0–100. */
  score: number;
  mastered: boolean;
  /** False when at least one `required` block is incomplete. */
  requiredBlocksMet: boolean;
  completedBlocks: number;
  totalRuledBlocks: number;
}

export interface AggregateMasteryResult {
  /** Average lesson mastery score across the set, 0–100. */
  score: number;
  masteredCount: number;
  totalCount: number;
  allMastered: boolean;
}
