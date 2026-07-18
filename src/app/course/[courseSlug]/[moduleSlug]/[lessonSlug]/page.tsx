"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  Target,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Building2,
  ChevronRight,
  Sparkles,
  Zap,
  X,
  Lightbulb,
  Terminal,
  BookOpen,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { TheoryBlocks } from "@/components/lesson/theory-blocks";
import { InteractiveDiagram } from "@/components/lesson/interactive-diagram";
import { WorkedExamples } from "@/components/lesson/worked-example";
import { InlineEditor } from "@/components/lesson/inline-editor";
import { Exercises } from "@/components/lesson/exercises";
import { AiTutorSidebar } from "@/components/lesson/ai-tutor";
import {
  XpToast,
  CompletionModal,
  MasteryGateButton,
} from "@/components/lesson/gamification";
import { useProgress } from "@/lib/store/progress";
import { useUi } from "@/lib/store/ui";
import { emit } from "@/lib/events/learning-events";
import {
  getCourse,
  getModule,
  getLesson,
  nextLesson,
  prevLesson,
} from "@/lib/curriculum";
import type { Lesson as NormalizedLesson } from "@/lib/curriculum";
import type {
  TheoryBlock,
  LessonVisual,
  WorkedExample,
  Exercise,
  InlineCoding,
  RealWorldApp,
} from "@/lib/types";
import { cn } from "@/lib/utils";

/* ══════════════════════════════════════════════════════════════════
   SECTION MODEL
   Each scroll section has a stable id used both as a scroll-spy anchor
   and as the key into the IDE context strip. This is the ONE source of
   truth mapping a section → its eyebrow label, heading, dot color, and
   the contextual sentence shown above the editor.
   ══════════════════════════════════════════════════════════════════ */

type SectionId =
  | "section-intro"
  | "section-theory"
  | "section-visual"
  | "section-worked"
  | "section-coding"
  | "section-exercises"
  | "section-interview";

interface SectionMeta {
  label: string;
  headline: string;
  dot: string;
  ideCtx: string;
}

const SECTION_META: Record<SectionId, SectionMeta> = {
  "section-intro": {
    label: "Introduction",
    headline: "",
    dot: "bg-amber-500",
    ideCtx: "scratchpad — preview this lesson's challenge anytime",
  },
  "section-theory": {
    label: "Theory",
    headline: "The core ideas, in plain language.",
    dot: "bg-violet-500",
    ideCtx: "theory — try any concept live in the editor",
  },
  "section-visual": {
    label: "Visual Learning",
    headline: "See the concept, then explore it.",
    dot: "bg-violet-500",
    ideCtx: "visual — experiment with the values yourself",
  },
  "section-worked": {
    label: "Worked Examples",
    headline: "Watch it built up, one line at a time.",
    dot: "bg-sky-500",
    ideCtx: "worked examples — retype them here to make them stick",
  },
  "section-coding": {
    label: "Practice Coding",
    headline: "Your turn — write the code.",
    dot: "bg-emerald-500",
    ideCtx: "practice challenge — solve it in this editor",
  },
  "section-exercises": {
    label: "Exercises",
    headline: "Prove it. Reach 80% to complete the lesson.",
    dot: "bg-emerald-500",
    ideCtx: "exercises — the editor stays live for scratch work",
  },
  "section-interview": {
    label: "Interview Prep",
    headline: "How this shows up in real interviews.",
    dot: "bg-indigo-500",
    ideCtx: "interview prep — rehearse your answers in code",
  },
};

/* ══════════════════════════════════════════════════════════════════
   LEFT-PANEL BLOCK MODEL
   A discriminated union describing every renderable unit of the left
   learning column. Both the normalized (block-based) and legacy lesson
   shapes are converted into an ordered LeftPanelBlock[] — the page is a
   rendering engine over this array, never a hardcoded template.
   ══════════════════════════════════════════════════════════════════ */

type LeftPanelBlock =
  | {
      kind: "lesson-header";
      title: string;
      difficulty: string;
      xpReward: number;
      estimatedTime: string;
      hook: string;
    }
  | { kind: "objectives"; objectives: string[] }
  | {
      kind: "context-cards";
      what: string;
      why: string;
      whereUsed: string;
      prerequisites: { slug: string; title: string }[];
    }
  | { kind: "realworld"; apps: RealWorldApp[] }
  | { kind: "section-divider"; id: SectionId }
  | { kind: "theory"; blocks: TheoryBlock[] }
  | { kind: "diagram"; visual: LessonVisual }
  | { kind: "worked-examples"; examples: WorkedExample[] }
  | { kind: "challenge"; coding: InlineCoding }
  | { kind: "exercises"; exercises: Exercise[] }
  | {
      kind: "callout";
      variant: "tip" | "warning" | "keypoint" | "info";
      title: string;
      content: string;
    }
  | { kind: "recap"; content: string }
  | { kind: "interview"; questions: { question: string; answer: string }[] };

interface WorkspaceModel {
  meta: {
    title: string;
    difficulty: string;
    xpReward: number;
    estimatedTime: string;
  };
  blocks: LeftPanelBlock[];
  /** Feeds the permanent right-hand IDE. */
  coding: InlineCoding;
  /** For analytics wiring. */
  lessonId: string;
  codingBlockId: string;
  exercisesBlockId: string | null;
}

/* Fallback scratch challenge for lessons with no coding block. */
const SCRATCH_CODING: InlineCoding = {
  language: "python",
  filename: "scratch.py",
  instructions: "Experiment freely — this playground has no required output.",
  starterCode: "# Scratchpad — try anything you like.\nprint('Hello, DSM!')\n",
  solutionCode: "",
  expectedOutput: "",
  hints: [],
};

/* ── Converter: normalized (block-based) lesson → workspace model ──── */

function normalizedToWorkspace(lesson: NormalizedLesson): WorkspaceModel {
  const blocks: LeftPanelBlock[] = [];
  let coding: InlineCoding | null = null;
  let codingBlockId = "inline-code";
  let exercisesBlockId: string | null = null;

  for (const b of lesson.blocks) {
    switch (b.type) {
      case "lesson-intro": {
        blocks.push({
          kind: "lesson-header",
          title: lesson.meta.title,
          difficulty: lesson.meta.difficulty,
          xpReward: lesson.meta.xpReward,
          estimatedTime: lesson.meta.estimatedTime,
          hook: b.intro.hook,
        });
        if (b.intro.objectives.length)
          blocks.push({ kind: "objectives", objectives: b.intro.objectives });
        blocks.push({
          kind: "context-cards",
          what: b.intro.what,
          why: b.intro.why,
          whereUsed: b.intro.whereUsed,
          prerequisites: [],
        });
        if (b.intro.realWorldApps.length)
          blocks.push({ kind: "realworld", apps: b.intro.realWorldApps });
        break;
      }
      case "theory-blocks":
        blocks.push({ kind: "section-divider", id: "section-theory" });
        blocks.push({ kind: "theory", blocks: b.blocks });
        break;
      case "interactive-diagram":
        blocks.push({ kind: "section-divider", id: "section-visual" });
        blocks.push({ kind: "diagram", visual: b.visual });
        break;
      case "worked-examples":
        blocks.push({ kind: "section-divider", id: "section-worked" });
        blocks.push({ kind: "worked-examples", examples: b.examples });
        break;
      case "inline-code":
        coding = b.coding;
        codingBlockId = b.id;
        blocks.push({ kind: "section-divider", id: "section-coding" });
        blocks.push({ kind: "challenge", coding: b.coding });
        break;
      case "mastery-assessment":
        exercisesBlockId = b.id;
        blocks.push({ kind: "section-divider", id: "section-exercises" });
        blocks.push({ kind: "exercises", exercises: b.exercises });
        break;
      case "callout":
        blocks.push({
          kind: "callout",
          variant: b.variant,
          title: b.title,
          content: b.content,
        });
        break;
      case "recap":
        blocks.push({ kind: "recap", content: b.content });
        break;
      case "interview-questions":
        blocks.push({ kind: "section-divider", id: "section-interview" });
        blocks.push({ kind: "interview", questions: b.questions });
        break;
      default:
        break;
    }
  }

  return {
    meta: {
      title: lesson.meta.title,
      difficulty: lesson.meta.difficulty,
      xpReward: lesson.meta.xpReward,
      estimatedTime: lesson.meta.estimatedTime,
    },
    blocks,
    coding: coding ?? SCRATCH_CODING,
    lessonId: lesson.meta.id,
    codingBlockId,
    exercisesBlockId,
  };
}

/* ══════════════════════════════════════════════════════════════════
   RESIZE HOOK — draggable vertical divider (native listeners)
   ══════════════════════════════════════════════════════════════════ */

function useResizeX(initial: number, min: number, max: number) {
  const [width, setWidth] = React.useState(initial);
  const dragging = React.useRef(false);
  const startX = React.useRef(0);
  const startW = React.useRef(0);

  const onMouseDown = React.useCallback(
    (e: React.MouseEvent) => {
      dragging.current = true;
      startX.current = e.clientX;
      startW.current = width;
      e.preventDefault();
      const onMove = (mv: MouseEvent) => {
        if (!dragging.current) return;
        setWidth(
          Math.max(min, Math.min(max, startW.current + mv.clientX - startX.current)),
        );
      };
      const onUp = () => {
        dragging.current = false;
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", onUp);
        document.body.style.userSelect = "";
        document.body.style.cursor = "";
      };
      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
      document.body.style.userSelect = "none";
      document.body.style.cursor = "col-resize";
    },
    [width, min, max],
  );

  return [width, onMouseDown] as const;
}

/* ══════════════════════════════════════════════════════════════════
   LEFT-PANEL BLOCK RENDERER
   ══════════════════════════════════════════════════════════════════ */

function difficultyVariant(d: string) {
  return d === "Beginner"
    ? "success"
    : d === "Intermediate"
    ? "warning"
    : d === "Advanced"
    ? "error"
    : "muted";
}

interface LeftBlockProps {
  block: LeftPanelBlock;
  masteryPct: number;
  completing: boolean;
  onMasteryChange: (pct: number) => void;
  onComplete: () => void;
}

function LeftBlock({
  block,
  masteryPct,
  completing,
  onMasteryChange,
  onComplete,
}: LeftBlockProps) {
  switch (block.kind) {
    /* ── Lesson header (also the scroll-spy anchor for intro) ── */
    case "lesson-header":
      return (
        <div id="section-intro" className="scroll-mt-4">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <Badge variant="muted">
              <Clock className="h-3 w-3" />
              {block.estimatedTime}
            </Badge>
            <Badge variant={difficultyVariant(block.difficulty)}>
              {block.difficulty}
            </Badge>
            <Badge variant="muted">⚡ {block.xpReward} XP</Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)] mb-3">
            {block.title}
          </h1>
          <p className="text-base text-secondary leading-relaxed max-w-2xl">
            {block.hook}
          </p>
        </div>
      );

    /* ── Learning objectives ── */
    case "objectives":
      return (
        <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/5 p-5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-3 flex items-center gap-1.5">
            <Target className="h-3.5 w-3.5" />
            What you&apos;ll learn
          </p>
          <ul className="space-y-2.5">
            {block.objectives.map((obj, i) => (
              <li
                key={i}
                className="flex items-start gap-2.5 text-sm text-[var(--text-secondary)] leading-relaxed"
              >
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                {obj}
              </li>
            ))}
          </ul>
        </div>
      );

    /* ── What / Why / Where + prerequisites ── */
    case "context-cards":
      return (
        <div className="flex flex-col gap-2.5">
          {(
            [
              { label: "What", content: block.what },
              { label: "Why", content: block.why },
              { label: "Where it's used", content: block.whereUsed },
            ] as const
          ).map(({ label, content }) => (
            <div
              key={label}
              className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-subtle)] p-4"
            >
              <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-1.5">
                {label}
              </p>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                {content}
              </p>
            </div>
          ))}
          {block.prerequisites.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs text-[var(--text-muted)]">Needs:</span>
              {block.prerequisites.map((p) => (
                <span
                  key={p.slug}
                  className="text-xs px-2 py-0.5 rounded border border-[var(--border-color)] bg-[var(--bg-elevated)] text-[var(--text-muted)]"
                >
                  {p.title}
                </span>
              ))}
            </div>
          )}
        </div>
      );

    /* ── Real-world application cards ── */
    case "realworld":
      return (
        <div className="flex flex-col gap-2.5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] flex items-center gap-1.5">
            <Building2 className="h-3 w-3" />
            Where this runs in production
          </p>
          {block.apps.map((app) => (
            <div
              key={app.company}
              className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-elevated)] hover:bg-[var(--bg-subtle)] p-4 transition-colors"
            >
              <div className="flex items-baseline gap-2 mb-1 flex-wrap">
                <span className="text-sm font-bold text-[var(--text-primary)]">
                  {app.company}
                </span>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                  {app.headline}
                </span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                {app.detail}
              </p>
            </div>
          ))}
        </div>
      );

    /* ── Section divider (scroll-spy anchor) ── */
    case "section-divider": {
      const meta = SECTION_META[block.id];
      return (
        <div id={block.id} className="scroll-mt-4 pt-4">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] shrink-0">
              {meta.label}
            </span>
            <div className="flex-1 h-px bg-[var(--border-color)]" aria-hidden />
          </div>
          {meta.headline && (
            <h2 className="text-lg font-bold tracking-tight text-[var(--text-primary)]">
              {meta.headline}
            </h2>
          )}
        </div>
      );
    }

    /* ── Theory (rich sub-blocks) ── */
    case "theory":
      return (
        <div className="max-w-2xl">
          <TheoryBlocks blocks={block.blocks} />
        </div>
      );

    /* ── Interactive diagram ── */
    case "diagram":
      return <InteractiveDiagram visual={block.visual} />;

    /* ── Worked examples ── */
    case "worked-examples":
      return <WorkedExamples examples={block.examples} />;

    /* ── Challenge description (editing happens in the right IDE) ── */
    case "challenge": {
      const c = block.coding;
      return (
        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-violet-200 dark:border-violet-500/25 bg-violet-50 dark:bg-violet-500/8 p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-violet-700 dark:text-violet-400 mb-2">
              Your task
            </p>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              {c.instructions}
            </p>
          </div>

          {c.expectedOutput && (
            <div className="rounded-xl border border-[var(--border-color)] overflow-hidden">
              <div className="px-4 py-2 bg-[var(--bg-subtle)] border-b border-[var(--border-color)]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                  Expected output
                </span>
              </div>
              <div className="bg-[#0d1117] px-4 py-3">
                <pre className="text-xs font-mono text-emerald-400 whitespace-pre-wrap leading-relaxed">
                  {c.expectedOutput}
                </pre>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-violet-200 dark:border-violet-500/20 bg-violet-50 dark:bg-violet-500/5">
            <ChevronRight className="h-4 w-4 text-violet-600 dark:text-violet-400 shrink-0" />
            <p className="text-xs font-medium text-violet-700 dark:text-violet-300">
              Write your solution in the editor on the right, then hit{" "}
              <strong>Run</strong>.
            </p>
          </div>
        </div>
      );
    }

    /* ── Exercises + mastery gate ── */
    case "exercises":
      return (
        <div className="flex flex-col gap-6">
          <Exercises exercises={block.exercises} onMasteryChange={onMasteryChange} />
          <MasteryGateButton
            masteryPct={masteryPct}
            onComplete={onComplete}
            loading={completing}
          />
        </div>
      );

    /* ── Standalone callout ── */
    case "callout": {
      const palette = {
        tip: {
          border: "border-emerald-500/30",
          bg: "bg-emerald-500/5",
          text: "text-emerald-600 dark:text-emerald-400",
          fallback: "Tip",
        },
        warning: {
          border: "border-amber-500/30",
          bg: "bg-amber-500/5",
          text: "text-amber-600 dark:text-amber-400",
          fallback: "Warning",
        },
        keypoint: {
          border: "border-violet-500/30",
          bg: "bg-violet-500/5",
          text: "text-violet-600 dark:text-violet-400",
          fallback: "Key point",
        },
        info: {
          border: "border-sky-500/30",
          bg: "bg-sky-500/5",
          text: "text-sky-600 dark:text-sky-400",
          fallback: "Info",
        },
      }[block.variant];
      return (
        <div
          className={cn(
            "rounded-xl border p-4 max-w-2xl",
            palette.border,
            palette.bg,
          )}
        >
          <p
            className={cn(
              "text-[10px] font-bold uppercase tracking-widest mb-1.5",
              palette.text,
            )}
          >
            {block.title || palette.fallback}
          </p>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            {block.content}
          </p>
        </div>
      );
    }

    /* ── Recap ── */
    case "recap":
      return (
        <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-elevated)] p-5 max-w-2xl">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-2 flex items-center gap-1.5">
            <BookOpen className="h-3 w-3" />
            Recap
          </p>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed whitespace-pre-line">
            {block.content}
          </p>
        </div>
      );

    /* ── Interview questions ── */
    case "interview":
      return (
        <div className="flex flex-col gap-3">
          {block.questions.map((q, i) => (
            <Card key={i} className="p-4">
              <p className="text-sm font-medium text-[var(--text-primary)] mb-2">
                {q.question}
              </p>
              <details className="group">
                <summary className="text-xs text-emerald-600 dark:text-emerald-400 cursor-pointer hover:underline list-none flex items-center gap-1">
                  <ChevronRight className="h-3 w-3 group-open:rotate-90 transition-transform" />
                  Show model answer
                </summary>
                <p className="mt-3 text-sm text-[var(--text-secondary)] leading-relaxed border-t border-[var(--border-color)] pt-3">
                  {q.answer}
                </p>
              </details>
            </Card>
          ))}
        </div>
      );

    default:
      return null;
  }
}

/* ══════════════════════════════════════════════════════════════════
   AI TUTOR DRAWER (slide-out; overlays the IDE, never shrinks it)
   ══════════════════════════════════════════════════════════════════ */

function TutorDrawer({
  open,
  onClose,
  lessonTitle,
  lessonSlug,
}: {
  open: boolean;
  onClose: () => void;
  lessonTitle: string;
  lessonSlug: string;
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="tutor-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-40 bg-black/20 dark:bg-black/40"
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            key="tutor-drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="fixed right-0 top-16 bottom-14 z-50 w-[380px] max-w-full flex flex-col shadow-2xl"
            role="dialog"
            aria-label="DSM Tutor"
          >
            <div className="flex items-center justify-between px-4 py-3 border-y border-l border-[var(--border-color)] bg-[var(--bg-elevated)] shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="h-6 w-6 rounded-full bg-indigo-100 dark:bg-indigo-500/15 flex items-center justify-center">
                  <Sparkles className="h-3 w-3 text-indigo-600 dark:text-indigo-400" />
                </div>
                <span className="text-sm font-semibold text-[var(--text-primary)]">
                  DSM Tutor
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-500/20 bg-indigo-50 dark:bg-indigo-500/8 text-indigo-600 dark:text-indigo-400">
                  context-aware
                </span>
              </div>
              <button
                onClick={onClose}
                aria-label="Close tutor"
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)] focus-ring rounded p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 min-h-0 overflow-hidden">
              <AiTutorSidebar lessonTitle={lessonTitle} lessonSlug={lessonSlug} />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ══════════════════════════════════════════════════════════════════
   PAGE
   ══════════════════════════════════════════════════════════════════ */

export default function LessonPage() {
  const params = useParams() as {
    courseSlug: string;
    moduleSlug: string;
    lessonSlug: string;
  };

  const course = getCourse(params.courseSlug);
  const mod = getModule(params.courseSlug, params.moduleSlug);
  const lesson = getLesson(
    params.courseSlug,
    params.moduleSlug,
    params.lessonSlug,
  );

  if (!course || !lesson) notFound();

  /* — Build the workspace model once per lesson (stable → Monaco never
       remounts, editor state / cursor / undo / output all survive scroll) — */
  const model = React.useMemo<WorkspaceModel>(
    () => normalizedToWorkspace(lesson!),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [params.lessonSlug],
  );

  /* — Ordered scroll-spy anchor ids present in the model — */
  const sectionIds = React.useMemo(() => {
    const ids: SectionId[] = ["section-intro"];
    model.blocks.forEach((b) => {
      if (b.kind === "section-divider") ids.push(b.id);
    });
    return ids;
  }, [model]);

  /* — State — */
  const [activeSectionId, setActiveSectionId] =
    React.useState<SectionId>("section-intro");
  const [masteryPct, setMasteryPct] = React.useState(0);
  const [showCompletion, setShowCompletion] = React.useState(false);
  const [completing, setCompleting] = React.useState(false);
  const [tutorOpen, setTutorOpen] = React.useState(false);

  const leftPanelRef = React.useRef<HTMLDivElement>(null);

  /* — Resizable vertical divider — */
  /* Deterministic initial width — must match on server and client to
     avoid a hydration mismatch on the inline --lw style. */
  const [leftWidth, handleResizeDrag] = useResizeX(480, 300, 720);

  /* — Engines / stores (business logic untouched) — */
  const startLesson = useProgress((s) => s.startLesson);
  const completeLesson = useProgress((s) => s.completeLesson);
  const showXpToast = useUi((s) => s.showXpToast);

  React.useEffect(() => {
    startLesson(lesson!.meta.slug);
    emit({
      type: "lesson_started",
      lessonId: model.lessonId,
      lessonSlug: lesson!.meta.slug,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.lessonSlug]);

  /* — Scroll-spy: watches section anchors within the left panel only, so
       it can NEVER affect the mounted IDE on the right — */
  React.useEffect(() => {
    const root = leftPanelRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveSectionId(e.target.id as SectionId);
        });
      },
      { root, rootMargin: "-5% 0px -70% 0px", threshold: 0 },
    );

    sectionIds.forEach((id) => {
      const el = root.querySelector(`#${id}`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sectionIds]);

  /* — Navigation refs (derived from curriculum order in the registry) — */
  const prev = prevLesson(params.lessonSlug);
  const next = nextLesson(params.lessonSlug);

  const nextHref = next
    ? `/course/${next.courseSlug}/${next.moduleSlug}/${next.slug}`
    : null;
  const nextTitle = next?.title ?? null;
  const prevHref = prev
    ? `/course/${prev.courseSlug}/${prev.moduleSlug}/${prev.slug}`
    : null;

  /* — Interaction handlers (preserve analytics + XP wiring) — */
  const handleCodeSolved = React.useCallback(() => {
    emit({
      type: "code_passed",
      lessonId: model.lessonId,
      blockId: model.codingBlockId,
      language: model.coding.language,
    });
    emit({
      type: "block_completed",
      lessonId: model.lessonId,
      blockId: model.codingBlockId,
      blockType: "inline-code",
    });
    showXpToast(10);
  }, [model, showXpToast]);

  const handleMasteryChange = React.useCallback(
    (pct: number) => {
      setMasteryPct(pct);
      if (model.exercisesBlockId) {
        const passed = pct >= 80;
        emit({
          type: "quiz_completed",
          lessonId: model.lessonId,
          blockId: model.exercisesBlockId,
          score: Math.round(pct),
          passed,
          masteryThreshold: 80,
        });
        if (passed)
          emit({
            type: "block_completed",
            lessonId: model.lessonId,
            blockId: model.exercisesBlockId,
            blockType: "mastery-assessment",
          });
      }
    },
    [model],
  );

  const handleComplete = React.useCallback(async () => {
    if (masteryPct < 80) return;
    setCompleting(true);
    await new Promise((r) => setTimeout(r, 400));
    completeLesson(lesson!.meta.slug, Math.round(masteryPct), lesson!.meta.xpReward);
    emit({
      type: "lesson_completed",
      lessonId: model.lessonId,
      lessonSlug: lesson!.meta.slug,
      finalScore: Math.round(masteryPct),
    });
    showXpToast(lesson!.meta.xpReward);
    setCompleting(false);
    setShowCompletion(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [masteryPct, model, completeLesson, showXpToast]);

  /* — IDE context strip data — */
  const ctx = SECTION_META[activeSectionId];

  return (
    <>
      <XpToast />
      <CompletionModal
        isOpen={showCompletion}
        lessonTitle={model.meta.title}
        xpEarned={lesson!.meta.xpReward}
        nextLesson={nextHref && nextTitle ? { href: nextHref, title: nextTitle } : null}
        onClose={() => setShowCompletion(false)}
      />
      <TutorDrawer
        open={tutorOpen}
        onClose={() => setTutorOpen(false)}
        lessonTitle={model.meta.title}
        lessonSlug={lesson!.meta.slug}
      />

      {/* ── Full-viewport workspace shell ── */}
      <div className="flex flex-col min-h-[calc(100vh-4rem)] lg:h-[calc(100vh-4rem)] bg-[var(--bg-base)]">
        {/* ── Top bar ── */}
        <header className="shrink-0 flex items-center gap-3 px-4 h-11 border-b border-[var(--border-color)] bg-[var(--bg-elevated)]">
          <nav className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] min-w-0 flex-1 overflow-hidden">
            <Link
              href={`/course/${params.courseSlug}`}
              className="hover:text-[var(--text-secondary)] transition-colors shrink-0"
            >
              {course!.title}
            </Link>
            <ChevronRight className="h-3 w-3 shrink-0" />
            <span className="truncate font-medium text-[var(--text-secondary)]">
              {model.meta.title}
            </span>
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setTutorOpen((v) => !v)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors focus-ring",
                tutorOpen
                  ? "bg-indigo-100 dark:bg-indigo-500/15 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/25"
                  : "text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)]",
              )}
              aria-pressed={tutorOpen}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Tutor</span>
            </button>
            <div className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 font-medium">
              <Zap className="h-3.5 w-3.5" />
              {model.meta.xpReward} XP
            </div>
          </div>
        </header>

        {/* ── Split workspace ── */}
        <div className="flex-1 flex flex-col lg:flex-row lg:min-h-0 lg:overflow-hidden">
          {/* ── LEFT: scrollable learning column ── */}
          <div
            ref={leftPanelRef}
            style={{ ["--lw" as string]: `${leftWidth}px` }}
            className="w-full lg:w-[var(--lw)] lg:shrink-0 lg:overflow-y-auto bg-[var(--bg-elevated)] lg:border-r border-[var(--border-color)]"
          >
            <div className="px-6 sm:px-8 py-6 flex flex-col gap-4">
              {model.blocks.map((block, i) => (
                <LeftBlock
                  key={i}
                  block={block}
                  masteryPct={masteryPct}
                  completing={completing}
                  onMasteryChange={handleMasteryChange}
                  onComplete={handleComplete}
                />
              ))}
              <div className="h-4" aria-hidden />
            </div>
          </div>

          {/* ── Draggable divider (desktop only) ── */}
          <div
            className="hidden lg:block w-1 shrink-0 cursor-col-resize bg-[var(--border-color)] hover:bg-violet-500/50 transition-colors relative z-10"
            onMouseDown={handleResizeDrag}
            role="separator"
            aria-orientation="vertical"
            aria-label="Resize panels"
          >
            <div className="absolute inset-y-0 -inset-x-1.5" aria-hidden />
          </div>

          {/* ── RIGHT: permanent IDE (mounted once, never remounts) ── */}
          <div className="w-full h-[520px] lg:h-auto lg:flex-1 lg:min-w-0 flex flex-col overflow-hidden bg-[#0d1117] border-t lg:border-t-0 border-[var(--border-color)]">
            {/* Context strip — reflects the section currently in view */}
            <div className="shrink-0 h-7 flex items-center px-3 gap-2 border-b border-[#1a2030] bg-[#0d1117]">
              <span
                className={cn(
                  "h-1.5 w-1.5 rounded-full shrink-0 transition-colors",
                  ctx.dot,
                )}
              />
              <Terminal className="h-3 w-3 text-[#4a5568] shrink-0" />
              <span className="text-[10px] font-mono text-[#5a6475] truncate">
                {ctx.ideCtx}
              </span>
            </div>

            {/* The single InlineEditor instance for the whole lesson */}
            <div className="flex-1 min-h-0 overflow-hidden">
              <InlineEditor
                coding={model.coding}
                workspaceMode
                hideInstructions
                onSolve={handleCodeSolved}
              />
            </div>
          </div>
        </div>

        {/* ── Bottom navigation ── */}
        <nav
          className="shrink-0 h-14 border-t border-[var(--border-color)] bg-[var(--bg-elevated)] flex items-center px-4 sm:px-6 gap-4"
          aria-label="Lesson navigation"
        >
          {prevHref && prev ? (
            <Link
              href={prevHref}
              className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors shrink-0 min-w-0 group"
            >
              <ArrowLeft className="h-4 w-4 shrink-0 group-hover:-translate-x-0.5 transition-transform" />
              <span className="hidden sm:block max-w-[200px] truncate">
                {prev.title}
              </span>
            </Link>
          ) : (
            <div className="flex items-center gap-2 text-sm text-[var(--text-muted)] opacity-40 shrink-0">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:block">Start</span>
            </div>
          )}

          <div className="flex-1 min-w-0 text-center">
            <p className="text-xs font-semibold text-[var(--text-primary)] truncate">
              {model.meta.title}
            </p>
            {mod && (
              <p className="text-[10px] text-[var(--text-muted)] truncate">
                {mod.title}
              </p>
            )}
          </div>

          {nextHref ? (
            <Link
              href={nextHref}
              className="flex items-center gap-2 text-sm font-medium text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors shrink-0 min-w-0 group"
            >
              <span className="hidden sm:block max-w-[200px] truncate">
                {nextTitle}
              </span>
              <ArrowRight className="h-4 w-4 shrink-0 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          ) : (
            <div className="flex items-center gap-2 text-sm font-semibold text-amber-600 dark:text-amber-400 shrink-0">
              <span className="hidden sm:block">Course complete</span>
              <Zap className="h-4 w-4" />
            </div>
          )}
        </nav>
      </div>
    </>
  );
}
