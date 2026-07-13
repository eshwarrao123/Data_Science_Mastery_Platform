"use client";

import * as React from "react";
import type { LearningBlock, BlockType } from "@/lib/curriculum/blocks";
import type { Lesson } from "@/lib/curriculum/types";
import { TheoryBlocks } from "@/components/lesson/theory-blocks";
import { InteractiveDiagram } from "@/components/lesson/interactive-diagram";
import { WorkedExamples } from "@/components/lesson/worked-example";
import { InlineEditor } from "@/components/lesson/inline-editor";
import { Exercises } from "@/components/lesson/exercises";
import { emit } from "@/lib/events/learning-events";

/* ------------------------------------------------------------------ */
/*  onBlockEvent — retained for route-level mastery wiring             */
/* ------------------------------------------------------------------ */
export interface BlockEvent {
  lessonId: string;
  blockId: string;
  type: "solved" | "mastery" | "viewed";
  payload?: Record<string, unknown>;
}

/* ------------------------------------------------------------------ */
/*  Individual block renderers                                          */
/* ------------------------------------------------------------------ */

function LessonIntroRenderer({
  block,
}: {
  block: Extract<LearningBlock, { type: "lesson-intro" }>;
}) {
  const { intro } = block;
  return (
    <div className="space-y-6">
      <p className="text-base leading-relaxed text-[var(--text-secondary)] italic">
        {intro.hook}
      </p>
      <div className="grid sm:grid-cols-3 gap-4">
        {(
          [
            { label: "What", value: intro.what },
            { label: "Why", value: intro.why },
            { label: "Where used", value: intro.whereUsed },
          ] as const
        ).map(({ label, value }) => (
          <div
            key={label}
            className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-elevated)] p-4"
          >
            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-1">
              {label}
            </p>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              {value}
            </p>
          </div>
        ))}
      </div>
      {intro.objectives.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-[var(--text-primary)] mb-2">
            Learning objectives
          </p>
          <ul className="space-y-1.5">
            {intro.objectives.map((obj, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-[var(--text-secondary)]"
              >
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                {obj}
              </li>
            ))}
          </ul>
        </div>
      )}
      {intro.realWorldApps.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-[var(--text-primary)] mb-2">
            Real-world applications
          </p>
          <div className="grid sm:grid-cols-3 gap-3">
            {intro.realWorldApps.map((app) => (
              <div
                key={app.company}
                className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-elevated)] p-3"
              >
                <p className="text-xs font-semibold text-[var(--text-primary)]">
                  {app.company}
                </p>
                <p className="text-[11px] text-emerald-500 mb-1">
                  {app.headline}
                </p>
                <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                  {app.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function CalloutRenderer({
  block,
}: {
  block: Extract<LearningBlock, { type: "callout" }>;
}) {
  const palette: Record<
    typeof block.variant,
    { border: string; bg: string; label: string }
  > = {
    tip: {
      border: "border-emerald-500/30",
      bg: "bg-emerald-500/5",
      label: "Tip",
    },
    warning: {
      border: "border-amber-500/30",
      bg: "bg-amber-500/5",
      label: "Warning",
    },
    keypoint: {
      border: "border-violet-500/30",
      bg: "bg-violet-500/5",
      label: "Key Point",
    },
    info: {
      border: "border-sky-500/30",
      bg: "bg-sky-500/5",
      label: "Info",
    },
  };
  const p = palette[block.variant];
  return (
    <div className={`rounded-xl border ${p.border} ${p.bg} p-4`}>
      <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-1">
        {block.title ?? p.label}
      </p>
      <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
        {block.content}
      </p>
    </div>
  );
}

function RecapRenderer({
  block,
}: {
  block: Extract<LearningBlock, { type: "recap" }>;
}) {
  return (
    <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-elevated)] p-5">
      <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-2">
        Recap
      </p>
      <p className="text-sm text-[var(--text-secondary)] leading-relaxed whitespace-pre-line">
        {block.content}
      </p>
    </div>
  );
}

function InterviewQuestionsRenderer({
  block,
}: {
  block: Extract<LearningBlock, { type: "interview-questions" }>;
}) {
  const [open, setOpen] = React.useState<number | null>(null);
  return (
    <div className="space-y-2">
      {block.questions.map((q, i) => (
        <div
          key={i}
          className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-elevated)] overflow-hidden"
        >
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-start justify-between gap-3 p-4 text-left"
          >
            <span className="text-sm font-medium text-[var(--text-primary)]">
              {q.question}
            </span>
            <span className="text-[var(--text-muted)] shrink-0 mt-0.5 text-xs">
              {open === i ? "▲" : "▼"}
            </span>
          </button>
          {open === i && (
            <div className="px-4 pb-4 text-sm text-[var(--text-secondary)] leading-relaxed border-t border-[var(--border-color)] pt-3">
              {q.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/** Stub for block types not yet implemented. Visible only in development. */
function StubRenderer({ block }: { block: LearningBlock }) {
  if (process.env.NODE_ENV !== "development") return null;
  return (
    <div className="rounded-lg border border-dashed border-[var(--border-color)] p-4 text-xs text-[var(--text-muted)]">
      [{block.type}] — renderer not yet implemented
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Block renderer registry                                             */
/*                                                                     */
/*  To add a new block type:                                            */
/*    1. Define the block variant in src/lib/curriculum/blocks.ts      */
/*    2. Create its renderer function in this file (or import it)      */
/*    3. Add one entry to BLOCK_REGISTRY below                         */
/*  LessonRenderer requires no changes.                                */
/* ------------------------------------------------------------------ */

export interface BlockRenderContext {
  lessonId: string;
  onBlockEvent?: (e: BlockEvent) => void;
}

type BlockRendererFn<T extends LearningBlock = LearningBlock> = (
  block: T,
  ctx: BlockRenderContext,
) => React.ReactNode;

type BlockRegistry = {
  [K in BlockType]: BlockRendererFn<Extract<LearningBlock, { type: K }>>;
};

const BLOCK_REGISTRY: BlockRegistry = {
  "lesson-intro": (block) => <LessonIntroRenderer block={block} />,

  "theory-blocks": (block) => <TheoryBlocks blocks={block.blocks} />,

  "interactive-diagram": (block) => <InteractiveDiagram visual={block.visual} />,

  "worked-examples": (block) => <WorkedExamples examples={block.examples} />,

  "inline-code": (block, ctx) => (
    <InlineEditor
      coding={block.coding}
      onSolve={() => {
        emit({ type: "code_passed", lessonId: ctx.lessonId, blockId: block.id, language: block.coding.language });
        emit({ type: "block_completed", lessonId: ctx.lessonId, blockId: block.id, blockType: block.type });
        ctx.onBlockEvent?.({ lessonId: ctx.lessonId, blockId: block.id, type: "solved" });
      }}
    />
  ),

  "mastery-assessment": (block, ctx) => (
    <Exercises
      exercises={block.exercises}
      onMasteryChange={(pct) => {
        const threshold = block.masteryThreshold ?? 80;
        const passed = pct >= threshold;
        emit({ type: "quiz_completed", lessonId: ctx.lessonId, blockId: block.id, score: pct, passed, masteryThreshold: threshold });
        if (passed) emit({ type: "block_completed", lessonId: ctx.lessonId, blockId: block.id, blockType: block.type });
        ctx.onBlockEvent?.({ lessonId: ctx.lessonId, blockId: block.id, type: "mastery", payload: { pct } });
      }}
    />
  ),

  callout: (block) => <CalloutRenderer block={block} />,

  recap: (block) => <RecapRenderer block={block} />,

  "interview-questions": (block) => <InterviewQuestionsRenderer block={block} />,

  // Future stubs — dev-only placeholder until renderers are built
  "checkpoint-mcq": (block) => <StubRenderer block={block} />,
  prediction: (block) => <StubRenderer block={block} />,
  "coding-challenge": (block) => <StubRenderer block={block} />,
  flashcards: (block) => <StubRenderer block={block} />,
  "dataset-preview": (block) => <StubRenderer block={block} />,
  "algorithm-animation": (block) => <StubRenderer block={block} />,
};

function resolveBlock(block: LearningBlock, ctx: BlockRenderContext): React.ReactNode {
  // Cast is sound: registry key K guarantees Extract<LearningBlock,{type:K}>
  const render = BLOCK_REGISTRY[block.type] as BlockRendererFn;
  return render(block, ctx);
}

/* ------------------------------------------------------------------ */
/*  LessonRenderer                                                      */
/* ------------------------------------------------------------------ */

export interface LessonRendererProps {
  lesson: Lesson;
  onBlockEvent?: (e: BlockEvent) => void;
}

export function LessonRenderer({ lesson, onBlockEvent }: LessonRendererProps) {
  const viewedRef = React.useRef(new Set<string>());

  React.useEffect(() => {
    emit({ type: "lesson_started", lessonId: lesson.meta.id, lessonSlug: lesson.meta.slug });
    const seen = viewedRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !seen.has(entry.target.id)) {
            seen.add(entry.target.id);
            const block = lesson.blocks.find((b) => b.id === entry.target.id);
            if (block) emit({ type: "block_viewed", lessonId: lesson.meta.id, blockId: block.id, blockType: block.type });
          }
        });
      },
      { rootMargin: "-10% 0px -50% 0px" },
    );
    lesson.blocks.forEach((b) => {
      const el = document.getElementById(b.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [lesson]);

  return (
    <div className="flex flex-col gap-12">
      {lesson.blocks.map((block) => (
        <section
          key={block.id}
          id={block.id}
          aria-label={block.tocLabel ?? block.type}
        >
          {block.tocLabel && (
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-6">
              {block.tocLabel}
            </h2>
          )}
          {resolveBlock(block, { lessonId: lesson.meta.id, onBlockEvent })}
        </section>
      ))}
    </div>
  );
}
