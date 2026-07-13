/* ------------------------------------------------------------------ */
/*  DSM Learning Event System                                           */
/*                                                                     */
/*  A lightweight publish/subscribe bus for learner interactions.      */
/*  UI components emit events; future systems (mastery, XP, analytics, */
/*  tutor) subscribe without coupling to the emitters.                 */
/*                                                                     */
/*  Design principles:                                                 */
/*  - Pure TypeScript, no React dependency                             */
/*  - Discriminated union on `type` — each event carries only the      */
/*    fields it needs                                                  */
/*  - Synchronous dispatch; consumers may schedule async work          */
/*  - No persistence here — stores/analytics subscribe and own state   */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/*  Event types                                                         */
/* ------------------------------------------------------------------ */

export interface BlockViewedEvent {
  type: "block_viewed";
  lessonId: string;
  blockId: string;
  blockType: string;
}

export interface BlockCompletedEvent {
  type: "block_completed";
  lessonId: string;
  blockId: string;
  blockType: string;
}

export interface CodeRunEvent {
  type: "code_run";
  lessonId: string;
  blockId: string;
  language: string;
  passed: boolean;
}

export interface CodePassedEvent {
  type: "code_passed";
  lessonId: string;
  blockId: string;
  language: string;
}

export interface QuizStartedEvent {
  type: "quiz_started";
  lessonId: string;
  blockId: string;
  totalQuestions: number;
}

export interface QuizCompletedEvent {
  type: "quiz_completed";
  lessonId: string;
  blockId: string;
  score: number;        // 0–100
  passed: boolean;
  masteryThreshold: number;
}

export interface LessonStartedEvent {
  type: "lesson_started";
  lessonId: string;
  lessonSlug: string;
}

export interface LessonCompletedEvent {
  type: "lesson_completed";
  lessonId: string;
  lessonSlug: string;
  finalScore: number;
}

export type LearningEvent =
  | BlockViewedEvent
  | BlockCompletedEvent
  | CodeRunEvent
  | CodePassedEvent
  | QuizStartedEvent
  | QuizCompletedEvent
  | LessonStartedEvent
  | LessonCompletedEvent;

export type LearningEventType = LearningEvent["type"];

/* ------------------------------------------------------------------ */
/*  Subscriber registry                                                 */
/* ------------------------------------------------------------------ */

type Handler<T extends LearningEvent = LearningEvent> = (event: T) => void;

type HandlerMap = {
  [K in LearningEventType]?: Set<Handler<Extract<LearningEvent, { type: K }>>>;
};

const _handlers: HandlerMap = {};
let _wildcardHandlers = new Set<Handler<LearningEvent>>();

/* ------------------------------------------------------------------ */
/*  Public API                                                           */
/* ------------------------------------------------------------------ */

/**
 * Subscribe to a specific event type.
 * Returns an unsubscribe function — call it in useEffect cleanup.
 */
export function on<K extends LearningEventType>(
  eventType: K,
  handler: Handler<Extract<LearningEvent, { type: K }>>,
): () => void {
  if (!_handlers[eventType]) {
    (_handlers as Record<string, Set<Handler>>)[eventType] = new Set();
  }
  (_handlers[eventType] as Set<Handler<Extract<LearningEvent, { type: K }>>>).add(handler);
  return () => off(eventType, handler);
}

/**
 * Subscribe to ALL events. Useful for analytics and debug logging.
 * Returns an unsubscribe function.
 */
export function onAny(handler: Handler<LearningEvent>): () => void {
  _wildcardHandlers.add(handler);
  return () => { _wildcardHandlers.delete(handler); };
}

/**
 * Unsubscribe a specific handler.
 */
export function off<K extends LearningEventType>(
  eventType: K,
  handler: Handler<Extract<LearningEvent, { type: K }>>,
): void {
  (_handlers[eventType] as Set<Handler<Extract<LearningEvent, { type: K }>>> | undefined)
    ?.delete(handler);
}

/**
 * Emit a learning event. Dispatches synchronously to all matching
 * subscribers, then to wildcard subscribers.
 */
export function emit(event: LearningEvent): void {
  const typed = _handlers[event.type] as Set<Handler<typeof event>> | undefined;
  typed?.forEach((h) => h(event));
  _wildcardHandlers.forEach((h) => h(event));
}

/** Remove all subscribers (useful in tests). */
export function reset(): void {
  (Object.keys(_handlers) as LearningEventType[]).forEach((k) => {
    delete _handlers[k];
  });
  _wildcardHandlers = new Set();
}
