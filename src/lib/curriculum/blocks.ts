/* ------------------------------------------------------------------ */
/*  DSM LearningBlock — Discriminated Union                             */
/*                                                                     */
/*  Every block has:                                                   */
/*    id       — stable, unique within a lesson (used as DOM id)       */
/*    type     — discriminant                                          */
/*    tocLabel — optional; when present, block appears in TOC          */
/*                                                                     */
/*  Payload types are imported from (or mirror) the legacy             */
/*  src/lib/types.ts to preserve all existing lesson capabilities.     */
/* ------------------------------------------------------------------ */

import type {
  LessonIntro,
  TheoryBlock,
  LessonVisual,
  WorkedExample,
  InlineCoding,
  Exercise,
} from "@/lib/types";

/* ---------- Shared base ---------- */

interface BlockBase {
  /** Stable unique identifier within a lesson — rendered as DOM `id`. */
  id: string;
  /** When present, block appears in the derived TOC. */
  tocLabel?: string;
}

/* ------------------------------------------------------------------ */
/*  Core blocks (map 1-to-1 with the six legacy steps)                 */
/* ------------------------------------------------------------------ */

/** Step 1 — Lesson hook, objectives, real-world context. */
export interface LessonIntroBlock extends BlockBase {
  type: "lesson-intro";
  intro: LessonIntro;
}

/** Step 2 — Ordered sequence of theory sub-blocks (text, analogy, code-note, …). */
export interface TheoryBlocksBlock extends BlockBase {
  type: "theory-blocks";
  blocks: TheoryBlock[];
}

/** Step 3 — Interactive diagram (flow, comparison, decision-tree, architecture). */
export interface InteractiveDiagramBlock extends BlockBase {
  type: "interactive-diagram";
  visual: LessonVisual;
}

/** Step 4 — Stepped worked examples with reveal animation. */
export interface WorkedExamplesBlock extends BlockBase {
  type: "worked-examples";
  examples: WorkedExample[];
}

/** Step 5 — Single hands-on inline coding challenge. */
export interface InlineCodeBlock extends BlockBase {
  type: "inline-code";
  coding: InlineCoding;
}

/** Step 6 — Graded exercise set (MCQ, coding, scenario). */
export interface MasteryAssessmentBlock extends BlockBase {
  type: "mastery-assessment";
  exercises: Exercise[];
  /** Minimum percentage correct to mark lesson complete (default 80). */
  masteryThreshold?: number;
}

/* ------------------------------------------------------------------ */
/*  Active-learning primitives (planned; stubs until Phase A3/A4)      */
/* ------------------------------------------------------------------ */

/** Standalone callout card — tip, warning, or key insight. */
export interface CalloutBlock extends BlockBase {
  type: "callout";
  variant: "tip" | "warning" | "keypoint" | "info";
  title: string;
  content: string;
}

/** End-of-section recap / summary. */
export interface RecapBlock extends BlockBase {
  type: "recap";
  /** Markdown-compatible summary text. */
  content: string;
}

/** Interview Q&A pairs shown at the end of a lesson. */
export interface InterviewQuestionsBlock extends BlockBase {
  type: "interview-questions";
  questions: { question: string; answer: string }[];
}

/* ---- Future stubs (reserved type strings; no payload yet) ---- */

export interface CheckpointMcqBlock extends BlockBase {
  type: "checkpoint-mcq";
  // payload to be defined in Phase A3
}

export interface PredictionBlock extends BlockBase {
  type: "prediction";
  // payload to be defined in Phase A3
}

export interface CodingChallengeBlock extends BlockBase {
  type: "coding-challenge";
  // payload to be defined in Phase A3
}

export interface FlashcardsBlock extends BlockBase {
  type: "flashcards";
  // payload to be defined in Phase A3
}

export interface DatasetPreviewBlock extends BlockBase {
  type: "dataset-preview";
  // payload to be defined in Phase A3
}

export interface AlgorithmAnimationBlock extends BlockBase {
  type: "algorithm-animation";
  // payload to be defined in Phase A3
}

/* ------------------------------------------------------------------ */
/*  Master union                                                        */
/* ------------------------------------------------------------------ */

export type LearningBlock =
  // Core (six legacy steps)
  | LessonIntroBlock
  | TheoryBlocksBlock
  | InteractiveDiagramBlock
  | WorkedExamplesBlock
  | InlineCodeBlock
  | MasteryAssessmentBlock
  // Active-learning
  | CalloutBlock
  | RecapBlock
  | InterviewQuestionsBlock
  // Future stubs
  | CheckpointMcqBlock
  | PredictionBlock
  | CodingChallengeBlock
  | FlashcardsBlock
  | DatasetPreviewBlock
  | AlgorithmAnimationBlock;

/** All discriminant strings — useful for narrowing in the block registry. */
export type BlockType = LearningBlock["type"];
