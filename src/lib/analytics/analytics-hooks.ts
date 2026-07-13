/* ------------------------------------------------------------------ */
/*  DSM Analytics Hooks                                                 */
/*                                                                     */
/*  Subscribes to the Learning Event System and re-emits normalized    */
/*  AnalyticsRecord objects to registered consumers (dashboard, tutor, */
/*  backend sync, recommendations) without coupling them to the raw    */
/*  event bus or to each other.                                         */
/*                                                                     */
/*  No persistence, no charts, no UI.                                  */
/* ------------------------------------------------------------------ */

import { onAny, type LearningEvent } from "@/lib/events/learning-events";

/* ------------------------------------------------------------------ */
/*  Normalized analytics record                                         */
/* ------------------------------------------------------------------ */

export type AnalyticsEventType =
  | "lesson_started"
  | "lesson_completed"
  | "block_viewed"
  | "block_completed"
  | "quiz_completed"
  | "code_passed"
  | "mastery_updated"
  | "lesson_unlocked";

export interface AnalyticsRecord {
  event: AnalyticsEventType;
  lessonId?: string;
  blockId?: string;
  /** ISO timestamp set at emit time. */
  ts: string;
  /** Arbitrary metadata — keeps the record type stable as fields expand. */
  meta: Record<string, unknown>;
}

type AnalyticsHandler = (record: AnalyticsRecord) => void;

/* ------------------------------------------------------------------ */
/*  Internal subscriber registry                                        */
/* ------------------------------------------------------------------ */

const _subscribers = new Set<AnalyticsHandler>();

/* ------------------------------------------------------------------ */
/*  Public API                                                           */
/* ------------------------------------------------------------------ */

/**
 * Register a consumer that receives every normalized AnalyticsRecord.
 * Returns an unsubscribe function — call it when the consumer unmounts.
 */
export function subscribeAnalytics(handler: AnalyticsHandler): () => void {
  _subscribers.add(handler);
  return () => { _subscribers.delete(handler); };
}

/**
 * Emit a record directly — use for events not sourced from the Learning
 * Event System (e.g. mastery_updated, lesson_unlocked from engine hooks).
 */
export function emitAnalytics(record: AnalyticsRecord): void {
  _subscribers.forEach((h) => h(record));
}

/** Remove all subscribers (useful in tests). */
export function resetAnalytics(): void {
  _subscribers.clear();
}

/* ------------------------------------------------------------------ */
/*  Mapping: LearningEvent → AnalyticsRecord                           */
/* ------------------------------------------------------------------ */

function ts(): string {
  return new Date().toISOString();
}

function toRecord(e: LearningEvent): AnalyticsRecord | null {
  switch (e.type) {
    case "lesson_started":
      return { event: "lesson_started", lessonId: e.lessonId, ts: ts(), meta: { lessonSlug: e.lessonSlug } };

    case "lesson_completed":
      return { event: "lesson_completed", lessonId: e.lessonId, ts: ts(), meta: { lessonSlug: e.lessonSlug, finalScore: e.finalScore } };

    case "block_viewed":
      return { event: "block_viewed", lessonId: e.lessonId, blockId: e.blockId, ts: ts(), meta: { blockType: e.blockType } };

    case "block_completed":
      return { event: "block_completed", lessonId: e.lessonId, blockId: e.blockId, ts: ts(), meta: { blockType: e.blockType } };

    case "quiz_completed":
      return { event: "quiz_completed", lessonId: e.lessonId, blockId: e.blockId, ts: ts(), meta: { score: e.score, passed: e.passed, masteryThreshold: e.masteryThreshold } };

    case "code_passed":
      return { event: "code_passed", lessonId: e.lessonId, blockId: e.blockId, ts: ts(), meta: { language: e.language } };

    default:
      return null;
  }
}

/* ------------------------------------------------------------------ */
/*  Wire once at module load                                             */
/* ------------------------------------------------------------------ */

function wire() {
  onAny((e) => {
    const record = toRecord(e);
    if (record) emitAnalytics(record);
  });
}

if (typeof window !== "undefined" && !(window as unknown as Record<string, unknown>).__dsmAnalyticsWired) {
  (window as unknown as Record<string, unknown>).__dsmAnalyticsWired = true;
  wire();
}
