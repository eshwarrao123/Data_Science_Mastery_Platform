"use client";

import * as React from "react";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import {
  Clock,
  BookOpen,
  CheckCircle2,
  Circle,
  Lock,
  ArrowRight,
  Play,
  Zap,
  ChevronRight,
  Code2,
  Sparkles,
} from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress";
import { getCourse } from "@/lib/data/curriculum";
import { useProgress } from "@/lib/store/progress";
import { cn } from "@/lib/utils";

/* ── animation ──────────────────────────────────────────────────────── */

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.32, ease: [0.16, 1, 0.3, 1] },
  }),
};

/* ── skills derived from real course content ──────────────────────────
   These map to the actual lessons in the curriculum data.
   "lessons" lists the lesson slugs that teach this skill.           */
const PYTHON_SKILLS = [
  { label: "Variables",      lessons: ["variables-and-data-types"] },
  { label: "Data Types",     lessons: ["variables-and-data-types"] },
  { label: "Type Conversion",lessons: ["variables-and-data-types"] },
  { label: "Python Lists",   lessons: ["lists-vs-numpy-arrays"]    },
  { label: "NumPy Arrays",   lessons: ["lists-vs-numpy-arrays"]    },
  { label: "Vectorization",  lessons: ["lists-vs-numpy-arrays"]    },
] as const;

/* ── helper: derive module state ───────────────────────────────────── */
type ModuleState = "completed" | "active" | "available" | "locked";

function moduleState(
  lessonSlugs: string[],
  lessonMap: Record<string, { status: "in_progress" | "completed" }>,
  prevModuleCompleted: boolean,
): ModuleState {
  const completed = lessonSlugs.filter((s) => lessonMap[s]?.status === "completed");
  const inProgress = lessonSlugs.some((s) => lessonMap[s]?.status === "in_progress");
  if (completed.length === lessonSlugs.length) return "completed";
  if (inProgress || completed.length > 0) return "active";
  if (prevModuleCompleted) return "available";
  return "locked";
}

/* ── lesson state icon ─────────────────────────────────────────────── */
function LessonIcon({
  state,
}: {
  state: "completed" | "active" | "next" | "locked";
}) {
  if (state === "completed")
    return <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />;
  if (state === "active")
    return (
      <div className="h-4 w-4 rounded-full border-2 border-violet-500 dark:border-violet-400 bg-violet-500/20 dark:bg-violet-400/20 shrink-0" />
    );
  if (state === "next")
    return <Circle className="h-4 w-4 text-[var(--border-color-strong)] shrink-0" />;
  return <Lock className="h-4 w-4 text-[var(--text-muted)] shrink-0" />;
}

/* ── page component ─────────────────────────────────────────────────── */

export default function CourseOverviewPage() {
  const params = useParams() as { courseSlug: string };
  const course = getCourse(params.courseSlug);
  if (!course) notFound();

  const lessonMap = useProgress((s) => s.lessons);

  /* ── derived progress ── */
  const allLessons = course.modules.flatMap((m) => m.lessons);
  const totalLessons = allLessons.length;
  const completedSlugs = React.useMemo(
    () =>
      new Set(
        Object.entries(lessonMap)
          .filter(([, v]) => v.status === "completed")
          .map(([k]) => k),
      ),
    [lessonMap],
  );
  const inProgressSlug = React.useMemo(
    () =>
      Object.entries(lessonMap).find(([, v]) => v.status === "in_progress")?.[0],
    [lessonMap],
  );
  const completedCount = allLessons.filter((l) => completedSlugs.has(l.slug)).length;
  const progressPct = totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0;

  const totalXP = allLessons.reduce((s, l) => s + l.xpReward, 0);
  const earnedXP = allLessons
    .filter((l) => completedSlugs.has(l.slug))
    .reduce((s, l) => s + l.xpReward, 0);

  /* ── CTA routing: first uncompleted lesson ── */
  const activeLessonSlug = inProgressSlug ?? allLessons.find((l) => !completedSlugs.has(l.slug))?.slug ?? allLessons[0]?.slug;
  const ctaLesson = allLessons.find((l) => l.slug === activeLessonSlug) ?? allLessons[0];
  const ctaHref = ctaLesson
    ? `/course/${course.slug}/${ctaLesson.moduleSlug}/${ctaLesson.slug}`
    : "#";
  const ctaLabel = completedCount === 0 ? "Start Course" : completedCount === totalLessons ? "Review Course" : "Continue Learning";

  /* ── skills: unlocked when all lessons for that skill are completed ── */
  const skillStates = PYTHON_SKILLS.map((skill) => ({
    ...skill,
    unlocked: skill.lessons.every((s) => completedSlugs.has(s)),
    inProgress: skill.lessons.some(
      (s) => completedSlugs.has(s) || lessonMap[s]?.status === "in_progress",
    ),
  }));

  /* ── isPython domain ── */
  const isPython = course.category === "Programming";
  const domainColor = isPython ? "violet" : "sky";

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 min-w-0 overflow-x-hidden">

        {/* ══════════════════════════════════════════════════════
            COURSE HERO — full-width identity band
        ══════════════════════════════════════════════════════ */}
        <div className="relative border-b border-[var(--border-color)] bg-[var(--bg-elevated)] overflow-hidden">

          {/* Violet atmosphere */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 70% 120% at 0% 0%, rgba(139,92,246,0.07) 0%, transparent 65%)",
            }}
          />
          {/* Dot grid */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(139,92,246,0.06) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />

          <div className="relative max-w-5xl mx-auto px-6 py-10">
            {/* Breadcrumb */}
            <motion.nav
              custom={0}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] mb-5"
              aria-label="breadcrumb"
            >
              <Link href="/curriculum" className="hover:text-[var(--text-secondary)] transition-colors">
                Curriculum
              </Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-[var(--text-secondary)]">{course.title}</span>
            </motion.nav>

            <div className="grid lg:grid-cols-[1fr_auto] gap-8 items-start">
              {/* Left: title + meta */}
              <div>
                {/* Domain badge */}
                <motion.div
                  custom={1}
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  className="flex items-center gap-2 mb-3"
                >
                  <span
                    className={cn(
                      "text-[10px] font-bold uppercase tracking-[0.16em] px-2.5 py-1 rounded-full border",
                      "bg-violet-100 border-violet-200 text-violet-700",
                      "dark:bg-violet-500/10 dark:border-violet-500/25 dark:text-violet-400",
                    )}
                  >
                    {course.category}
                  </span>
                  <Badge
                    variant={
                      course.difficulty === "Beginner"
                        ? "success"
                        : course.difficulty === "Intermediate"
                        ? "warning"
                        : "error"
                    }
                  >
                    {course.difficulty}
                  </Badge>
                </motion.div>

                <motion.h1
                  custom={2}
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  className="text-3xl md:text-4xl font-bold tracking-tight text-[var(--text-primary)] mb-3"
                >
                  {course.title}
                </motion.h1>

                <motion.p
                  custom={3}
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  className="text-[var(--text-secondary)] leading-relaxed max-w-xl mb-6"
                >
                  {course.description}
                </motion.p>

                {/* Metadata chips */}
                <motion.div
                  custom={4}
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  className="flex flex-wrap items-center gap-4 mb-7"
                >
                  {[
                    { Icon: Clock,     label: `${course.estimatedHours}h estimated` },
                    { Icon: BookOpen,  label: `${totalLessons} lessons`             },
                    { Icon: Zap,       label: `${totalXP} XP total`                },
                  ].map(({ Icon, label }) => (
                    <span key={label} className="flex items-center gap-1.5 text-sm text-[var(--text-muted)]">
                      <Icon className="h-3.5 w-3.5" />
                      {label}
                    </span>
                  ))}
                </motion.div>

                {/* Progress + CTA */}
                <motion.div
                  custom={5}
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  className="flex flex-col sm:flex-row sm:items-center gap-4"
                >
                  <div className="flex-1 max-w-xs">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs text-[var(--text-muted)]">
                        {completedCount} / {totalLessons} lessons
                      </span>
                      <span className="text-xs font-semibold text-violet-700 dark:text-violet-400">
                        {Math.round(progressPct)}%
                      </span>
                    </div>
                    {/* Violet progress bar */}
                    <div className="h-2 rounded-full bg-[var(--bg-subtle)] overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPct}%` }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                        className="h-full rounded-full bg-violet-500"
                      />
                    </div>
                  </div>

                  <Link href={ctaHref}>
                    <Button
                      size="md"
                      variant="primary"
                      className="gap-2 shrink-0"
                    >
                      <Play className="h-3.5 w-3.5" />
                      {ctaLabel}
                    </Button>
                  </Link>
                </motion.div>
              </div>

              {/* Right: compact XP earned card */}
              <motion.div
                custom={6}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className={cn(
                  "hidden lg:flex flex-col gap-4 p-5 rounded-2xl border min-w-[200px]",
                  "bg-violet-50 border-violet-200 dark:bg-violet-500/8 dark:border-violet-500/25",
                )}
              >
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-violet-100 dark:bg-violet-500/20 flex items-center justify-center">
                    <Zap className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-violet-700 dark:text-violet-300 tabular-nums">
                      {earnedXP}
                    </div>
                    <div className="text-[10px] text-violet-600/70 dark:text-violet-400/70 uppercase tracking-wide">
                      XP earned
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-[var(--text-secondary)]">
                  <div className="flex items-center justify-between">
                    <span>Lessons done</span>
                    <span className="font-semibold text-[var(--text-primary)] tabular-nums">
                      {completedCount}/{totalLessons}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>XP remaining</span>
                    <span className="font-semibold text-[var(--text-primary)] tabular-nums">
                      {totalXP - earnedXP}
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════
            MAIN CONTENT — 2-column grid
        ══════════════════════════════════════════════════════ */}
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="grid lg:grid-cols-[1fr_320px] gap-8">

            {/* ── LEFT: Learning Journey ── */}
            <div>
              <motion.p
                custom={0}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)] mb-5"
              >
                Learning journey
              </motion.p>

              <div className="relative">
                {course.modules.map((mod, mi) => {
                  const lessonSlugs = mod.lessons.map((l) => l.slug);
                  const prevCompleted =
                    mi === 0 ||
                    course.modules[mi - 1].lessons.every((l) =>
                      completedSlugs.has(l.slug),
                    );
                  const state = moduleState(lessonSlugs, lessonMap, prevCompleted);

                  const modCompletedCount = lessonSlugs.filter((s) =>
                    completedSlugs.has(s),
                  ).length;
                  const modPct =
                    lessonSlugs.length > 0
                      ? (modCompletedCount / lessonSlugs.length) * 100
                      : 0;

                  return (
                    <motion.div
                      key={mod.id}
                      custom={mi}
                      variants={fadeUp}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, margin: "-20px" }}
                      className="relative flex gap-4 pb-6"
                    >
                      {/* Connector line */}
                      {mi < course.modules.length - 1 && (
                        <div
                          aria-hidden
                          className="absolute left-[17px] top-10 bottom-0 w-0.5 bg-[var(--border-color)]"
                        />
                      )}

                      {/* Module dot */}
                      <div className="shrink-0 flex flex-col items-center gap-1 pt-0.5">
                        <div
                          className={cn(
                            "h-9 w-9 rounded-full border-2 flex items-center justify-center text-[10px] font-bold tabular-nums transition-colors",
                            state === "completed"
                              ? "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                              : state === "active"
                              ? "border-violet-500 bg-violet-100 dark:bg-violet-500/15 text-violet-700 dark:text-violet-400"
                              : state === "available"
                              ? "border-[var(--border-color-strong)] bg-[var(--bg-subtle)] text-[var(--text-muted)]"
                              : "border-[var(--border-color)] bg-[var(--bg-elevated)] text-[var(--text-muted)] opacity-50",
                          )}
                        >
                          {state === "completed" ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                          ) : (
                            String(mi + 1).padStart(2, "0")
                          )}
                        </div>
                      </div>

                      {/* Module body */}
                      <div className="flex-1 min-w-0">
                        {/* Module header */}
                        <div
                          className={cn(
                            "rounded-xl border p-4 mb-2 transition-colors",
                            state === "completed"
                              ? "border-emerald-200 dark:border-emerald-500/25 bg-emerald-50 dark:bg-emerald-500/5"
                              : state === "active"
                              ? "border-violet-200 dark:border-violet-500/25 bg-violet-50 dark:bg-violet-500/8"
                              : "border-[var(--border-color)] bg-[var(--bg-elevated)] opacity-60",
                          )}
                        >
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div>
                              <p
                                className={cn(
                                  "text-[9px] font-bold uppercase tracking-[0.14em] mb-0.5",
                                  state === "completed"
                                    ? "text-emerald-600 dark:text-emerald-400"
                                    : state === "active"
                                    ? "text-violet-600 dark:text-violet-400"
                                    : "text-[var(--text-muted)]",
                                )}
                              >
                                Section {String(mi + 1).padStart(2, "0")}
                              </p>
                              <h3 className="text-base font-semibold text-[var(--text-primary)]">
                                {mod.title}
                              </h3>
                              <p className="text-xs text-[var(--text-secondary)] mt-0.5 leading-relaxed">
                                {mod.description}
                              </p>
                            </div>
                            <span
                              className={cn(
                                "shrink-0 text-sm font-bold tabular-nums",
                                state === "completed"
                                  ? "text-emerald-600 dark:text-emerald-400"
                                  : state === "active"
                                  ? "text-violet-600 dark:text-violet-400"
                                  : "text-[var(--text-muted)]",
                              )}
                            >
                              {Math.round(modPct)}%
                            </span>
                          </div>

                          {/* Module progress bar */}
                          <div className="h-1.5 rounded-full bg-[var(--bg-subtle)] overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${modPct}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.15 * mi }}
                              className={cn(
                                "h-full rounded-full",
                                state === "completed" ? "bg-emerald-500" : "bg-violet-500",
                              )}
                            />
                          </div>
                        </div>

                        {/* Lesson list — always visible for active/completed, collapsed for locked */}
                        {state !== "locked" && (
                          <div className="flex flex-col gap-1.5 ml-1">
                            {mod.lessons.map((lesson, li) => {
                              const isDone = completedSlugs.has(lesson.slug);
                              const isInProg = lessonMap[lesson.slug]?.status === "in_progress";
                              const prevDone =
                                li === 0 ||
                                completedSlugs.has(mod.lessons[li - 1].slug);
                              const isNext =
                                !isDone &&
                                !isInProg &&
                                prevDone &&
                                lesson.slug === activeLessonSlug;
                              const isLocked = !isDone && !isInProg && !prevDone;

                              const lessonState: "completed" | "active" | "next" | "locked" = isDone
                                ? "completed"
                                : isInProg
                                ? "active"
                                : isNext
                                ? "next"
                                : "locked";

                              const href = isLocked
                                ? "#"
                                : `/course/${course.slug}/${lesson.moduleSlug}/${lesson.slug}`;

                              return (
                                <Link
                                  key={lesson.id}
                                  href={href}
                                  aria-disabled={isLocked}
                                  className={cn(
                                    "flex items-center gap-3 px-3 py-3 rounded-xl border transition-all group",
                                    isLocked && "pointer-events-none",
                                    isInProg
                                      ? "border-violet-300 dark:border-violet-500/40 bg-violet-50 dark:bg-violet-500/10"
                                      : isNext
                                      ? "border-[var(--border-color-strong)] bg-[var(--bg-elevated)] hover:border-violet-300 dark:hover:border-violet-500/40 hover:bg-violet-50 dark:hover:bg-violet-500/5"
                                      : isDone
                                      ? "border-emerald-200 dark:border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-500/5 hover:bg-emerald-50 dark:hover:bg-emerald-500/8"
                                      : "border-[var(--border-color)] bg-[var(--bg-elevated)] opacity-50",
                                  )}
                                >
                                  <LessonIcon state={lessonState} />

                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                      <span
                                        className={cn(
                                          "text-sm font-medium truncate",
                                          isDone
                                            ? "text-[var(--text-secondary)]"
                                            : "text-[var(--text-primary)]",
                                        )}
                                      >
                                        {lesson.title}
                                      </span>
                                      {isInProg && (
                                        <span className="shrink-0 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-violet-200 dark:bg-violet-500/20 text-violet-700 dark:text-violet-400">
                                          In progress
                                        </span>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-3 mt-0.5 text-xs text-[var(--text-muted)]">
                                      <span className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {lesson.estimatedTime}
                                      </span>
                                      <span className="flex items-center gap-1">
                                        <Zap className="h-3 w-3" />
                                        +{lesson.xpReward} XP
                                      </span>
                                    </div>
                                  </div>

                                  {/* Action */}
                                  {isNext && (
                                    <span className="shrink-0 flex items-center gap-1 text-xs font-semibold text-violet-700 dark:text-violet-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                      Start <ArrowRight className="h-3 w-3" />
                                    </span>
                                  )}
                                  {isInProg && (
                                    <span className="shrink-0 flex items-center gap-1 text-xs font-semibold text-violet-700 dark:text-violet-400">
                                      Resume <ArrowRight className="h-3 w-3" />
                                    </span>
                                  )}
                                </Link>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}

                {/* Journey continues hint */}
                <motion.div
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="flex gap-4"
                >
                  <div className="shrink-0 flex flex-col items-center pt-0.5">
                    <div className="h-9 w-9 rounded-full border-2 border-dashed border-[var(--border-color)] bg-[var(--bg-subtle)] flex items-center justify-center">
                      <Sparkles className="h-3.5 w-3.5 text-[var(--text-muted)]" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0 pb-2 pt-1">
                    <p className="text-sm font-medium text-[var(--text-muted)]">
                      More coming soon
                    </p>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">
                      Control Flow, Functions, Data Structures — this track is actively expanding.
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* ── RIGHT: Skills + Where Python takes you ── */}
            <div className="flex flex-col gap-6">

              {/* Skills you're building */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-elevated)] overflow-hidden"
              >
                <div className="px-5 py-4 border-b border-[var(--border-color)] flex items-center gap-2">
                  <Code2 className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                  <h2 className="text-sm font-semibold text-[var(--text-primary)]">Skills you&apos;re building</h2>
                </div>

                <div className="p-5 space-y-3">
                  {skillStates.map((skill) => (
                    <div key={skill.label} className="flex items-center gap-3">
                      {skill.unlocked ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      ) : skill.inProgress ? (
                        <div className="h-3.5 w-3.5 rounded-full border-2 border-violet-500 dark:border-violet-400 shrink-0" />
                      ) : (
                        <div className="h-3.5 w-3.5 rounded-full border-2 border-[var(--border-color)] shrink-0" />
                      )}
                      <span
                        className={cn(
                          "flex-1 text-sm",
                          skill.unlocked
                            ? "text-[var(--text-secondary)] line-through decoration-emerald-500/50"
                            : skill.inProgress
                            ? "text-[var(--text-primary)] font-medium"
                            : "text-[var(--text-muted)]",
                        )}
                      >
                        {skill.label}
                      </span>
                      <span
                        className={cn(
                          "text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0",
                          skill.unlocked
                            ? "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : skill.inProgress
                            ? "bg-violet-100 dark:bg-violet-500/10 text-violet-700 dark:text-violet-400"
                            : "bg-[var(--bg-subtle)] text-[var(--text-muted)]",
                        )}
                      >
                        {skill.unlocked ? "Learned" : skill.inProgress ? "In progress" : "Ahead"}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* What you'll use Python for */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className={cn(
                  "rounded-2xl border p-5",
                  "border-violet-200 bg-violet-50 dark:border-violet-500/20 dark:bg-violet-500/5",
                )}
              >
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-violet-600 dark:text-violet-400 mb-3">
                  What Python unlocks
                </p>
                <div className="space-y-2">
                  {[
                    { icon: "📊", label: "Pandas — data analysis" },
                    { icon: "🔢", label: "NumPy — numerical computing" },
                    { icon: "🤖", label: "Scikit-learn — machine learning" },
                    { icon: "🧠", label: "TensorFlow / PyTorch — deep learning" },
                  ].map(({ icon, label }) => (
                    <div key={label} className="flex items-center gap-2.5 text-sm text-[var(--text-secondary)]">
                      <span className="text-base leading-none shrink-0">{icon}</span>
                      <span>{label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Where Python takes you next */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-elevated)] overflow-hidden"
              >
                <div className="px-5 py-4 border-b border-[var(--border-color)]">
                  <h2 className="text-sm font-semibold text-[var(--text-primary)]">Where this leads</h2>
                </div>
                <div className="p-5">
                  {/* Arrow chain */}
                  <div className="space-y-2">
                    <div
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-xl border text-sm font-semibold",
                        "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-500/25 dark:bg-violet-500/8 dark:text-violet-400",
                      )}
                    >
                      <div className="h-2 w-2 rounded-full bg-violet-500 shrink-0" />
                      Python for Data Science
                      <span className="ml-auto text-[10px] text-violet-600/70 dark:text-violet-400/60 font-medium">Now</span>
                    </div>

                    <div className="flex justify-center text-[var(--text-muted)]">↓</div>

                    <Link href="/course/data-analysis">
                      <div
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-xl border text-sm font-medium cursor-pointer transition-colors",
                          "border-emerald-200 bg-emerald-50 text-emerald-700 hover:border-emerald-300 hover:bg-emerald-100",
                          "dark:border-emerald-500/20 dark:bg-emerald-500/5 dark:text-emerald-400 dark:hover:bg-emerald-500/10",
                        )}
                      >
                        <div className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                        Data Analysis with Pandas
                        <ArrowRight className="ml-auto h-3.5 w-3.5" />
                      </div>
                    </Link>

                    <div className="flex justify-center text-[var(--text-muted)]">↓</div>

                    <div
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-xl border text-sm text-[var(--text-muted)] opacity-60",
                        "border-[var(--border-color)] bg-[var(--bg-subtle)]",
                      )}
                    >
                      <Lock className="h-3 w-3 shrink-0" />
                      Machine Learning
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Quick start CTA */}
              {completedCount === 0 && (
                <motion.div
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-elevated)] p-5 text-center"
                >
                  <p className="text-xs text-[var(--text-muted)] mb-3">
                    First lesson · {allLessons[0]?.estimatedTime} · +{allLessons[0]?.xpReward} XP
                  </p>
                  <p className="text-sm font-semibold text-[var(--text-primary)] mb-4">
                    {allLessons[0]?.title}
                  </p>
                  <Link href={ctaHref}>
                    <Button variant="primary" size="sm" className="gap-1.5 w-full">
                      <Play className="h-3.5 w-3.5" />
                      Start Lesson 1
                    </Button>
                  </Link>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
