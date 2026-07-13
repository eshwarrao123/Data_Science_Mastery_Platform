"use client";

import * as React from "react";
import { useParams, notFound } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  Target,
  ArrowRight,
  CheckCircle2,
  Building2,
  BookOpen,
  BarChart3,
  Code2,
  FileEdit,
  PanelLeft,
  PanelRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LessonToc } from "@/components/lesson/lesson-toc";
import { TheoryBlocks } from "@/components/lesson/theory-blocks";
import { InteractiveDiagram } from "@/components/lesson/interactive-diagram";
import { WorkedExamples } from "@/components/lesson/worked-example";
import { InlineEditor } from "@/components/lesson/inline-editor";
import { Exercises } from "@/components/lesson/exercises";
import { AiTutorSidebar } from "@/components/lesson/ai-tutor";
import { XpToast, CompletionModal, MasteryGateButton } from "@/components/lesson/gamification";
import { useProgress } from "@/lib/store/progress";
import { useUi } from "@/lib/store/ui";
import { getCourse, getLesson, nextLesson } from "@/lib/data/curriculum";
import {
  getLesson as getNormalizedLesson,
  nextLesson as nextNormalizedLesson,
} from "@/lib/curriculum";
import { LessonRenderer } from "@/components/lesson/lesson-renderer";
import type { BlockEvent } from "@/components/lesson/lesson-renderer";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: "intro", label: "Introduction", icon: BookOpen },
  { id: "theory", label: "Theory", icon: FileEdit },
  { id: "visual", label: "Visual Learning", icon: BarChart3 },
  { id: "worked", label: "Worked Examples", icon: Code2 },
  { id: "coding", label: "Practice Coding", icon: Code2 },
  { id: "exercises", label: "Exercises", icon: Target },
];

export default function LessonPage() {
  const params = useParams() as {
    courseSlug: string;
    moduleSlug: string;
    lessonSlug: string;
  };

  const course = getCourse(params.courseSlug);
  const lesson = getLesson(params.courseSlug, params.moduleSlug, params.lessonSlug);

  // Normalized lesson (block-based) — present when this lesson has been migrated
  const normalizedLesson = getNormalizedLesson(
    params.courseSlug,
    params.moduleSlug,
    params.lessonSlug,
  );

  if (!course || !lesson) notFound();

  const [currentStep, setCurrentStep] = React.useState(0);
  const [activeBlockId, setActiveBlockId] = React.useState<string>("");
  const [masteryPct, setMasteryPct] = React.useState(0);

  // Derive TOC entries from normalized lesson blocks (those with tocLabel)
  const blockTocEntries = React.useMemo(
    () =>
      normalizedLesson
        ? normalizedLesson.blocks
            .filter((b) => b.tocLabel)
            .map((b) => ({ id: b.id, label: b.tocLabel! }))
        : undefined,
    [normalizedLesson],
  );
  const [showCompletion, setShowCompletion] = React.useState(false);
  const [completing, setCompleting] = React.useState(false);
  const [leftOpen, setLeftOpen] = React.useState(true);
  const [rightOpen, setRightOpen] = React.useState(true);

  const startLesson = useProgress((s) => s.startLesson);
  const completeLesson = useProgress((s) => s.completeLesson);
  const showXpToast = useUi((s) => s.showXpToast);

  React.useEffect(() => {
    startLesson(lesson.slug);
  }, [lesson.slug, startLesson]);

  const next = nextLesson(params.courseSlug, params.moduleSlug, params.lessonSlug);
  const nextNorm = nextNormalizedLesson(params.lessonSlug);

  const handleComplete = async () => {
    if (masteryPct < 80) return;
    setCompleting(true);
    await new Promise((r) => setTimeout(r, 400));
    completeLesson(lesson.slug, Math.round(masteryPct), lesson.xpReward);
    showXpToast(lesson.xpReward);
    setCompleting(false);
    setShowCompletion(true);
  };

  const handleBlockEvent = (e: BlockEvent) => {
    if (e.type === "mastery" && typeof e.payload?.pct === "number") {
      setMasteryPct(e.payload.pct as number);
    }
    if (e.type === "solved") {
      showXpToast(10);
    }
  };

  const scrollToStep = (idx: number) => {
    setCurrentStep(idx);
    document.getElementById(`step-${idx}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Legacy scroll-spy (fixed steps)
  React.useEffect(() => {
    if (normalizedLesson) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            const idx = STEPS.findIndex((_, i) => `step-${i}` === id);
            if (idx !== -1) setCurrentStep(idx);
          }
        });
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );
    STEPS.forEach((_, i) => {
      const el = document.getElementById(`step-${i}`);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [normalizedLesson]);

  // Block-based scroll-spy (normalized lessons)
  React.useEffect(() => {
    if (!blockTocEntries?.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveBlockId(entry.target.id);
        });
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );
    blockTocEntries.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [blockTocEntries]);

  return (
    <>
      <XpToast />
      <CompletionModal
        isOpen={showCompletion}
        lessonTitle={lesson.title}
        xpEarned={lesson.xpReward}
        nextLesson={
          normalizedLesson && nextNorm
            ? { href: `/course/${nextNorm.courseSlug}/${nextNorm.moduleSlug}/${nextNorm.slug}`, title: nextNorm.title }
            : next
            ? { href: `/course/${next.courseSlug}/${next.moduleSlug}/${next.lessonSlug}`, title: next.title }
            : null
        }
        onClose={() => setShowCompletion(false)}
      />

      <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
        {/* ─── LEFT SIDEBAR — Table of Contents ─────────────────────── */}
        <AnimatePresence initial={false}>
          {leftOpen && (
            <motion.aside
              key="left"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 256, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 280, damping: 28 }}
              className="hidden lg:flex flex-col shrink-0 border-r border-[var(--border-color)] bg-[var(--bg-elevated)] overflow-hidden"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-color)]">
                <span className="text-xs font-semibold text-[var(--text-primary)]">Contents</span>
                <button
                  onClick={() => setLeftOpen(false)}
                  aria-label="Collapse table of contents"
                  className="text-[var(--text-muted)] hover:text-[var(--text-primary)] focus-ring rounded"
                >
                  <PanelLeft className="h-4 w-4" />
                </button>
              </div>
              <LessonToc
                course={course}
                activeModuleSlug={params.moduleSlug}
                activeLessonSlug={params.lessonSlug}
                currentStep={currentStep}
                onStepClick={scrollToStep}
                blockTocEntries={blockTocEntries}
                activeBlockId={activeBlockId}
                onBlockClick={(id) => {
                  setActiveBlockId(id);
                  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
              />
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Collapsed left toggle */}
        {!leftOpen && (
          <button
            onClick={() => setLeftOpen(true)}
            aria-label="Expand table of contents"
            className="hidden lg:flex h-full w-8 border-r border-[var(--border-color)] items-center justify-center hover:bg-[var(--bg-subtle)] text-[var(--text-muted)] transition-colors"
          >
            <PanelLeft className="h-4 w-4" />
          </button>
        )}

        {/* ─── MAIN CONTENT ─────────────────────────────────────────── */}
        <main className="flex-1 overflow-y-auto">
          {/* Step progress strip */}
          <div className="sticky top-0 z-20 bg-[color-mix(in_srgb,var(--bg-base)_85%,transparent)] backdrop-blur-sm border-b border-[var(--border-color)]">
            <div className="flex items-center gap-1 px-6 py-2 overflow-x-auto">
              {STEPS.map((step, i) => (
                <button
                  key={step.id}
                  onClick={() => scrollToStep(i)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-colors focus-ring shrink-0",
                    i === currentStep
                      ? "bg-[var(--bg-subtle)] text-[var(--text-primary)] font-medium"
                      : i < currentStep
                      ? "text-emerald-500"
                      : "text-[var(--text-muted)]",
                  )}
                >
                  {i < currentStep ? (
                    <CheckCircle2 className="h-3 w-3 shrink-0" />
                  ) : (
                    <span className="h-3 w-3 rounded-full border border-current flex items-center justify-center text-[8px] shrink-0">
                      {i + 1}
                    </span>
                  )}
                  {step.label}
                </button>
              ))}
            </div>
          </div>

          <div className="max-w-3xl mx-auto px-6 py-10 flex flex-col gap-16">
            {normalizedLesson ? (
              /* ── Normalized block-based path ──────────────────────── */
              <>
                {/* Lesson header (title + metadata) */}
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[var(--text-primary)] mb-4">
                    {normalizedLesson.meta.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <Badge variant="muted">
                      <Clock className="h-3 w-3" />
                      {normalizedLesson.meta.estimatedTime}
                    </Badge>
                    <Badge
                      variant={
                        normalizedLesson.meta.difficulty === "Beginner"
                          ? "success"
                          : normalizedLesson.meta.difficulty === "Intermediate"
                          ? "warning"
                          : "error"
                      }
                    >
                      {normalizedLesson.meta.difficulty}
                    </Badge>
                    <Badge variant="muted">⚡ {normalizedLesson.meta.xpReward} XP</Badge>
                  </div>
                </div>
                <LessonRenderer lesson={normalizedLesson} onBlockEvent={handleBlockEvent} />
                <MasteryGateButton
                  masteryPct={masteryPct}
                  onComplete={handleComplete}
                  loading={completing}
                />
              </>
            ) : (
            <>
            <section id="step-0" aria-labelledby="step0-title">
              <SectionLabel step={1} label="Introduction" />

              {/* Lesson hero */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <h1
                  id="step0-title"
                  className="text-3xl md:text-4xl font-bold tracking-tight text-[var(--text-primary)] mt-3 mb-4"
                >
                  {lesson.title}
                </h1>

                {/* Metadata bar */}
                <div className="flex flex-wrap items-center gap-2 mb-6">
                  <Badge variant="muted">
                    <Clock className="h-3 w-3" />
                    {lesson.estimatedTime}
                  </Badge>
                  <Badge
                    variant={
                      lesson.difficulty === "Beginner"
                        ? "success"
                        : lesson.difficulty === "Intermediate"
                        ? "warning"
                        : "error"
                    }
                  >
                    {lesson.difficulty}
                  </Badge>
                  <Badge variant="muted">
                    ⚡ {lesson.xpReward} XP
                  </Badge>
                  {lesson.prerequisites.map((p) => (
                    <a
                      key={p.slug}
                      href={`/course/${params.courseSlug}/${params.moduleSlug}/${p.slug}`}
                      className="text-xs px-2 py-0.5 rounded-md bg-[var(--bg-subtle)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                    >
                      Prereq: {p.title}
                    </a>
                  ))}
                </div>

                {/* Hook paragraph */}
                <p className="text-lg text-[var(--text-secondary)] leading-relaxed mb-6">
                  {lesson.step1Intro.hook}
                </p>

                {/* Objectives callout */}
                <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/8 p-5 mb-6">
                  <div className="text-xs font-semibold uppercase tracking-wider text-emerald-500 mb-3 flex items-center gap-1.5">
                    <Target className="h-3.5 w-3.5" />
                    What you&apos;ll learn
                  </div>
                  <ul className="flex flex-col gap-2">
                    {lesson.step1Intro.objectives.map((obj, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-[var(--text-secondary)]">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                        {obj}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* What / Why / Where */}
                <div className="grid sm:grid-cols-3 gap-4 mb-8">
                  {[
                    { label: "What is it?", content: lesson.step1Intro.what },
                    { label: "Why do we need it?", content: lesson.step1Intro.why },
                    { label: "Where is it used?", content: lesson.step1Intro.whereUsed },
                  ].map(({ label, content }) => (
                    <div key={label} className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-elevated)]">
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-2">{label}</div>
                      <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{content}</p>
                    </div>
                  ))}
                </div>

                {/* Real-world apps */}
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-3 flex items-center gap-1.5">
                    <Building2 className="h-3.5 w-3.5" />
                    Real-world applications
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {lesson.step1Intro.realWorldApps.map((app) => (
                      <div
                        key={app.company}
                        className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-elevated)] hover:bg-[var(--bg-subtle)] transition-colors"
                      >
                        <div className="text-xs font-bold text-[var(--text-primary)] mb-1">
                          {app.company}
                        </div>
                        <div className="text-[11px] font-semibold text-emerald-500 mb-1.5">
                          {app.headline}
                        </div>
                        <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                          {app.detail}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </section>

            <Divider />

            {/* ─── STEP 2: Theory ───────────────────────────────────── */}
            <section id="step-1" aria-labelledby="step1-title">
              <SectionLabel step={2} label="Theory" />
              <h2 id="step1-title" className="text-2xl font-bold tracking-tight text-[var(--text-primary)] mt-2 mb-6">
                The core concepts, explained simply.
              </h2>
              <TheoryBlocks blocks={lesson.step2Theory} />
            </section>

            <Divider />

            {/* ─── STEP 3: Visual Learning ──────────────────────────── */}
            <section id="step-2" aria-labelledby="step2-title">
              <SectionLabel step={3} label="Visual Learning" />
              <h2 id="step2-title" className="text-2xl font-bold tracking-tight text-[var(--text-primary)] mt-2 mb-6">
                See the concept as a diagram.
              </h2>
              <InteractiveDiagram visual={lesson.step3Visual} />
            </section>

            <Divider />

            {/* ─── STEP 4: Worked Examples ──────────────────────────── */}
            <section id="step-3" aria-labelledby="step3-title">
              <SectionLabel step={4} label="Worked Examples" />
              <h2 id="step3-title" className="text-2xl font-bold tracking-tight text-[var(--text-primary)] mt-2 mb-6">
                Walk through it step by step.
              </h2>
              <p className="text-sm text-[var(--text-muted)] mb-5">
                Each example reveals one step at a time. Press <strong>Next Step</strong> to advance. Start from Very Easy and work your way up.
              </p>
              <WorkedExamples examples={lesson.step4WorkedExamples} />
            </section>

            <Divider />

            {/* ─── STEP 5: Hands-on Coding ──────────────────────────── */}
            <section id="step-4" aria-labelledby="step4-title">
              <SectionLabel step={5} label="Hands-on Practice" />
              <h2 id="step4-title" className="text-2xl font-bold tracking-tight text-[var(--text-primary)] mt-2 mb-3">
                Your turn. Write real code.
              </h2>
              <p className="text-sm text-[var(--text-muted)] mb-6">
                The editor below is a real Python environment. Complete the TODOs, run your code, and compare with the expected output. Use hints if you&apos;re stuck.
              </p>
              <InlineEditor
                coding={lesson.step5InlineCoding}
                onSolve={() => showXpToast(10)}
              />
            </section>

            <Divider />

            {/* ─── STEP 6: Exercises ────────────────────────────────── */}
            <section id="step-5" aria-labelledby="step5-title">
              <SectionLabel step={6} label="Practice Exercises" />
              <h2 id="step5-title" className="text-2xl font-bold tracking-tight text-[var(--text-primary)] mt-2 mb-3">
                Prove your mastery.
              </h2>
              <p className="text-sm text-[var(--text-muted)] mb-6">
                Score 80% or higher to unlock lesson completion. There are MCQs, scenario questions, and coding challenges.
              </p>
              <Exercises
                exercises={lesson.step6Exercises}
                onMasteryChange={setMasteryPct}
              />

              {/* Interview questions accordion */}
              {lesson.interviewQuestions.length > 0 && (
                <div className="mt-10">
                  <div className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-3">
                    Real Interview Questions
                  </div>
                  <div className="flex flex-col gap-3">
                    {lesson.interviewQuestions.map((q, i) => (
                      <Card key={i} className="p-4">
                        <p className="text-sm font-medium text-[var(--text-primary)] mb-2">{q.question}</p>
                        <details className="group">
                          <summary className="text-xs text-emerald-500 cursor-pointer hover:underline list-none flex items-center gap-1">
                            <ArrowRight className="h-3 w-3 group-open:rotate-90 transition-transform" />
                            Show model answer
                          </summary>
                          <p className="mt-3 text-sm text-[var(--text-secondary)] leading-relaxed border-t border-[var(--border-color)] pt-3">
                            {q.answer}
                          </p>
                        </details>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Mastery gate */}
              <MasteryGateButton
                masteryPct={masteryPct}
                onComplete={handleComplete}
                loading={completing}
              />
            </section>
            </> /* end legacy path */
            )}
          </div>
        </main>

        {/* ─── RIGHT SIDEBAR — AI Tutor ─────────────────────────────── */}
        <AnimatePresence initial={false}>
          {rightOpen && (
            <motion.aside
              key="right"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 280, damping: 28 }}
              className="hidden xl:flex flex-col shrink-0 overflow-hidden"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-color)] bg-[var(--bg-elevated)]">
                <span className="text-xs font-semibold text-[var(--text-primary)]">AI Tutor</span>
                <button
                  onClick={() => setRightOpen(false)}
                  aria-label="Collapse AI tutor sidebar"
                  className="text-[var(--text-muted)] hover:text-[var(--text-primary)] focus-ring rounded"
                >
                  <PanelRight className="h-4 w-4" />
                </button>
              </div>
              <div className="flex-1 overflow-hidden">
                <AiTutorSidebar
                  lessonTitle={lesson.title}
                  lessonSlug={lesson.slug}
                />
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {!rightOpen && (
          <button
            onClick={() => setRightOpen(true)}
            aria-label="Expand AI tutor"
            className="hidden xl:flex h-full w-8 border-l border-[var(--border-color)] items-center justify-center hover:bg-[var(--bg-subtle)] text-[var(--text-muted)] transition-colors"
          >
            <PanelRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </>
  );
}

function SectionLabel({ step, label }: { step: number; label: string }) {
  return (
    <div className="flex items-center gap-3 mb-1">
      <span className="flex items-center justify-center h-7 w-7 rounded-full bg-[var(--bg-subtle)] border border-[var(--border-color)] text-xs font-bold text-[var(--text-primary)]">
        {step}
      </span>
      <span className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">
        {label}
      </span>
    </div>
  );
}

function Divider() {
  return <div className="h-px bg-[var(--border-color)]" aria-hidden />;
}
