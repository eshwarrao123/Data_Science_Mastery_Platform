"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Circle,
  Lock,
  ArrowRight,
  Flame,
  MapPin,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Clock,
  Zap,
  Play,
} from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import { getAllCourses } from "@/lib/curriculum";
import { useProgress } from "@/lib/store/progress";
import { cn } from "@/lib/utils";
import type { ResolvedCourse, LessonRef } from "@/lib/curriculum";

/* Courses that have at least one authored lesson — metadata-only courses
   stay in the "coming soon" lane until content lands. */
const curriculum = getAllCourses().filter((c) =>
  c.modules.some((m) => m.lessons.length > 0),
);

/* ─────────────────────────────────────────────────────────────────────────────
   SECTION DEFINITIONS
   Colors carry domain meaning — not decoration.
   sky = BI tools · violet = programming · amber = math · emerald = analysis
   orange = ML · teal = databases · pink = big data · rose = deep learning
   indigo = MLOps · yellow = career
───────────────────────────────────────────────────────────────────────────── */

interface SectionColors {
  track: string;          // progress bar fill
  text: string;           // accent text
  nodeRing: string;       // stage node border
  nodeFill: string;       // stage node inner fill
  cardBg: string;         // section card background tint (active states)
  cardBorder: string;     // section card border (active states)
  badgeBg: string;        // status badge background
  badgeBorder: string;    // status badge border
  badgeText: string;      // status badge text
  tagBg: string;          // topic chip background
}

interface SectionDef {
  id: string;
  stage: string;
  label: string;
  description: string;
  topics: string[];
  colors: SectionColors;
}

const DOMAIN_COLORS: Record<string, SectionColors> = {
  sky: {
    track: "bg-sky-500",
    text: "text-sky-700 dark:text-sky-400",
    nodeRing: "border-sky-500",
    nodeFill: "bg-sky-400",
    cardBg: "bg-sky-50 dark:bg-sky-500/8",
    cardBorder: "border-sky-200 dark:border-sky-500/30",
    badgeBg: "bg-sky-50 dark:bg-sky-500/10",
    badgeBorder: "border-sky-200 dark:border-sky-500/30",
    badgeText: "text-sky-700 dark:text-sky-400",
    tagBg: "bg-sky-50 border-sky-200 text-sky-700 dark:bg-sky-500/10 dark:border-sky-500/20 dark:text-sky-300",
  },
  violet: {
    track: "bg-violet-500",
    text: "text-violet-700 dark:text-violet-400",
    nodeRing: "border-violet-500",
    nodeFill: "bg-violet-400",
    cardBg: "bg-violet-50 dark:bg-violet-500/8",
    cardBorder: "border-violet-200 dark:border-violet-500/30",
    badgeBg: "bg-violet-50 dark:bg-violet-500/10",
    badgeBorder: "border-violet-200 dark:border-violet-500/30",
    badgeText: "text-violet-700 dark:text-violet-400",
    tagBg: "bg-violet-50 border-violet-200 text-violet-700 dark:bg-violet-500/10 dark:border-violet-500/20 dark:text-violet-300",
  },
  amber: {
    track: "bg-amber-500",
    text: "text-amber-700 dark:text-amber-400",
    nodeRing: "border-amber-500",
    nodeFill: "bg-amber-400",
    cardBg: "bg-amber-50 dark:bg-amber-500/8",
    cardBorder: "border-amber-200 dark:border-amber-500/30",
    badgeBg: "bg-amber-50 dark:bg-amber-500/10",
    badgeBorder: "border-amber-200 dark:border-amber-500/30",
    badgeText: "text-amber-700 dark:text-amber-400",
    tagBg: "bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-500/10 dark:border-amber-500/20 dark:text-amber-300",
  },
  emerald: {
    track: "bg-emerald-500",
    text: "text-emerald-700 dark:text-emerald-400",
    nodeRing: "border-emerald-500",
    nodeFill: "bg-emerald-400",
    cardBg: "bg-emerald-50 dark:bg-emerald-500/8",
    cardBorder: "border-emerald-200 dark:border-emerald-500/30",
    badgeBg: "bg-emerald-50 dark:bg-emerald-500/10",
    badgeBorder: "border-emerald-200 dark:border-emerald-500/30",
    badgeText: "text-emerald-700 dark:text-emerald-400",
    tagBg: "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-300",
  },
  orange: {
    track: "bg-orange-500",
    text: "text-orange-700 dark:text-orange-400",
    nodeRing: "border-orange-500",
    nodeFill: "bg-orange-400",
    cardBg: "bg-orange-50 dark:bg-orange-500/8",
    cardBorder: "border-orange-200 dark:border-orange-500/30",
    badgeBg: "bg-orange-50 dark:bg-orange-500/10",
    badgeBorder: "border-orange-200 dark:border-orange-500/30",
    badgeText: "text-orange-700 dark:text-orange-400",
    tagBg: "bg-orange-50 border-orange-200 text-orange-700 dark:bg-orange-500/10 dark:border-orange-500/20 dark:text-orange-300",
  },
  teal: {
    track: "bg-teal-500",
    text: "text-teal-700 dark:text-teal-400",
    nodeRing: "border-teal-500",
    nodeFill: "bg-teal-400",
    cardBg: "bg-teal-50 dark:bg-teal-500/8",
    cardBorder: "border-teal-200 dark:border-teal-500/30",
    badgeBg: "bg-teal-50 dark:bg-teal-500/10",
    badgeBorder: "border-teal-200 dark:border-teal-500/30",
    badgeText: "text-teal-700 dark:text-teal-400",
    tagBg: "bg-teal-50 border-teal-200 text-teal-700 dark:bg-teal-500/10 dark:border-teal-500/20 dark:text-teal-300",
  },
  pink: {
    track: "bg-pink-500",
    text: "text-pink-700 dark:text-pink-400",
    nodeRing: "border-pink-500",
    nodeFill: "bg-pink-400",
    cardBg: "bg-pink-50 dark:bg-pink-500/8",
    cardBorder: "border-pink-200 dark:border-pink-500/30",
    badgeBg: "bg-pink-50 dark:bg-pink-500/10",
    badgeBorder: "border-pink-200 dark:border-pink-500/30",
    badgeText: "text-pink-700 dark:text-pink-400",
    tagBg: "bg-pink-50 border-pink-200 text-pink-700 dark:bg-pink-500/10 dark:border-pink-500/20 dark:text-pink-300",
  },
  rose: {
    track: "bg-rose-500",
    text: "text-rose-700 dark:text-rose-400",
    nodeRing: "border-rose-500",
    nodeFill: "bg-rose-400",
    cardBg: "bg-rose-50 dark:bg-rose-500/8",
    cardBorder: "border-rose-200 dark:border-rose-500/30",
    badgeBg: "bg-rose-50 dark:bg-rose-500/10",
    badgeBorder: "border-rose-200 dark:border-rose-500/30",
    badgeText: "text-rose-700 dark:text-rose-400",
    tagBg: "bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-500/10 dark:border-rose-500/20 dark:text-rose-300",
  },
  indigo: {
    track: "bg-indigo-500",
    text: "text-indigo-700 dark:text-indigo-400",
    nodeRing: "border-indigo-500",
    nodeFill: "bg-indigo-400",
    cardBg: "bg-indigo-50 dark:bg-indigo-500/8",
    cardBorder: "border-indigo-200 dark:border-indigo-500/30",
    badgeBg: "bg-indigo-50 dark:bg-indigo-500/10",
    badgeBorder: "border-indigo-200 dark:border-indigo-500/30",
    badgeText: "text-indigo-700 dark:text-indigo-400",
    tagBg: "bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-500/10 dark:border-indigo-500/20 dark:text-indigo-300",
  },
  yellow: {
    track: "bg-yellow-500",
    text: "text-yellow-700 dark:text-yellow-400",
    nodeRing: "border-yellow-500",
    nodeFill: "bg-yellow-400",
    cardBg: "bg-yellow-50 dark:bg-yellow-500/8",
    cardBorder: "border-yellow-200 dark:border-yellow-500/30",
    badgeBg: "bg-yellow-50 dark:bg-yellow-500/10",
    badgeBorder: "border-yellow-200 dark:border-yellow-500/30",
    badgeText: "text-yellow-700 dark:text-yellow-400",
    tagBg: "bg-yellow-50 border-yellow-200 text-yellow-700 dark:bg-yellow-500/10 dark:border-yellow-500/20 dark:text-yellow-300",
  },
};

const SECTIONS: SectionDef[] = [
  {
    id: "prep",    stage: "01", label: "Foundations",
    description: "The tools every data analyst uses before writing a line of code.",
    topics: ["Excel", "Power BI", "Tableau"],
    colors: DOMAIN_COLORS.sky,
  },
  {
    id: "prog",    stage: "02", label: "Programming",
    description: "Python and R — the languages that turn data into decisions.",
    topics: ["Python", "R"],
    colors: DOMAIN_COLORS.violet,
  },
  {
    id: "math",    stage: "03", label: "Math & Statistics",
    description: "The mathematical foundations every ML model relies on.",
    topics: ["Mathematics", "Statistics", "Probability"],
    colors: DOMAIN_COLORS.amber,
  },
  {
    id: "data",    stage: "04", label: "Data Analysis",
    description: "Transform raw data into actionable insights with Pandas and NumPy.",
    topics: ["EDA", "Pandas", "NumPy", "Matplotlib", "Seaborn", "Data Cleaning", "Feature Engineering"],
    colors: DOMAIN_COLORS.emerald,
  },
  {
    id: "ml",      stage: "05", label: "Machine Learning",
    description: "Train, tune, and evaluate classical ML models on real datasets.",
    topics: ["Regression", "Classification", "Clustering", "Ensemble Learning", "Model Evaluation", "Time Series"],
    colors: DOMAIN_COLORS.orange,
  },
  {
    id: "db",      stage: "06", label: "Databases",
    description: "Query and manage structured data at scale.",
    topics: ["SQL", "MongoDB"],
    colors: DOMAIN_COLORS.teal,
  },
  {
    id: "bigdata", stage: "07", label: "Big Data",
    description: "Handle datasets too large for a single machine.",
    topics: ["PySpark", "Web Scraping"],
    colors: DOMAIN_COLORS.pink,
  },
  {
    id: "ai",      stage: "08", label: "AI & Deep Learning",
    description: "Neural networks, LLMs, RAG pipelines, and autonomous agents.",
    topics: ["CNN", "RNN", "LSTM", "Transformers", "NLP", "LLMs", "LangChain", "RAG", "Agents", "Fine Tuning"],
    colors: DOMAIN_COLORS.rose,
  },
  {
    id: "mlops",   stage: "09", label: "MLOps & Deployment",
    description: "Ship models to production — Docker, FastAPI, cloud platforms.",
    topics: ["Docker", "FastAPI", "AWS", "Azure", "MLflow", "CI/CD"],
    colors: DOMAIN_COLORS.indigo,
  },
  {
    id: "career",  stage: "10", label: "Industry Readiness",
    description: "Build proof of your skills and land the data science role.",
    topics: ["Resume", "LinkedIn", "Portfolio", "Mock Interviews", "Salary Negotiation"],
    colors: DOMAIN_COLORS.yellow,
  },
];

/* ── Per-course stat helper ─────────────────────────────────────────── */

interface CourseStat {
  total: number;
  done: number;
  pct: number;
  isComplete: boolean;
  isStarted: boolean;
  nextLesson: LessonRef | null;
}

function getCourseStat(
  course: ResolvedCourse,
  lessonMap: Record<string, { status: "in_progress" | "completed"; exerciseResults: Record<string, { correct: boolean; attempts: number }>; quizScore?: number; completedAt?: string }>,
): CourseStat {
  const lessons = course.modules.flatMap((m) => m.lessons);
  const total = lessons.length;
  const done = lessons.filter((l) => lessonMap[l.slug]?.status === "completed").length;
  const isStarted = lessons.some((l) => lessonMap[l.slug] !== undefined);
  const nextLesson = lessons.find((l) => lessonMap[l.slug]?.status !== "completed") ?? null;
  return {
    total,
    done,
    pct: total > 0 ? Math.round((done / total) * 100) : 0,
    isComplete: total > 0 && done === total,
    isStarted,
    nextLesson,
  };
}

/* ── Continue Banner ────────────────────────────────────────────────── */

function ContinueBanner({
  course,
  lesson,
  stat,
  colors,
  isNew,
}: {
  course: ResolvedCourse;
  lesson: LessonRef;
  stat: CourseStat;
  colors: SectionDef["colors"];
  isNew: boolean;
}) {
  const href = `/course/${lesson.courseSlug}/${lesson.moduleSlug}/${lesson.slug}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "mb-8 rounded-2xl overflow-hidden border",
        colors.cardBorder,
        colors.cardBg,
      )}
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-5">
        {/* Domain icon */}
        <div
          className={cn(
            "h-11 w-11 rounded-xl flex items-center justify-center shrink-0",
            colors.badgeBg,
            colors.cardBorder,
            "border",
          )}
        >
          {isNew
            ? <Play className={cn("h-5 w-5", colors.text)} aria-hidden />
            : <MapPin className={cn("h-5 w-5", colors.text)} aria-hidden />
          }
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className={cn("text-[10px] font-bold uppercase tracking-[0.16em] mb-0.5", colors.text)}>
            {isNew ? "Start Here" : "Continue Learning"} · {course.title}
          </p>
          <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{lesson.title}</p>
          <div className="flex flex-wrap items-center gap-3 mt-1.5">
            <span className="text-xs text-[var(--text-secondary)]">
              {stat.done} of {stat.total} lessons complete
            </span>
            <span className="text-xs text-[var(--text-secondary)] flex items-center gap-1">
              <Clock className="h-3 w-3" aria-hidden />
              {lesson.estimatedTime}
            </span>
            <span className="text-xs text-amber-400 flex items-center gap-1">
              <Zap className="h-3 w-3" aria-hidden />
              {lesson.xpReward} XP
            </span>
          </div>
        </div>

        {/* CTA */}
        <Link href={href} className="shrink-0">
          <Button variant="primary" size="md" className="gap-2 whitespace-nowrap">
            {isNew ? "Start Lesson 1" : "Resume Lesson"}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* Progress bar — sits flush at the bottom of the banner */}
      {stat.total > 0 && (
        <div className="px-5 pb-4">
          <div
            className="h-1.5 w-full rounded-full bg-[var(--bg-subtle)]"
            role="progressbar"
            aria-valuenow={stat.pct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${course.title} progress`}
          >
            <motion.div
              className={cn("h-full rounded-full", colors.track)}
              initial={{ width: 0 }}
              animate={{ width: `${stat.pct}%` }}
              transition={{ duration: 0.9, ease: "easeOut", delay: 0.3 }}
            />
          </div>
          <p className={cn("text-[10px] font-semibold mt-1 tabular-nums", colors.text)}>
            {stat.pct}% complete
          </p>
        </div>
      )}
    </motion.div>
  );
}

/* ── Course card ────────────────────────────────────────────────────── */

function CourseCard({
  course,
  stat,
  colors,
  animIndex,
}: {
  course: ResolvedCourse;
  stat: CourseStat;
  colors: SectionDef["colors"];
  animIndex: number;
}) {
  const href = `/course/${course.slug}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ delay: animIndex * 0.07, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "rounded-xl overflow-hidden border-l-2 border border-[var(--border-color)] bg-[var(--bg-elevated)]",
        "hover:border-[var(--border-color-strong)] transition-colors",
        stat.isStarted && !stat.isComplete ? colors.cardBorder.replace("border-", "border-l-[") + "]" : "border-l-transparent",
      )}
      style={stat.isStarted && !stat.isComplete ? {} : {}}
    >
      {/* Domain left accent bar */}
      <div className="flex">
        <div
          className={cn(
            "w-1 shrink-0 rounded-l-xl",
            stat.isComplete ? "bg-emerald-500" : stat.isStarted ? colors.track : "bg-transparent",
          )}
        />
        <div className="flex-1 p-4">
          {/* Header */}
          <div className="flex items-start gap-2 mb-3">
            <div className="mt-0.5 shrink-0">
              {stat.isComplete ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-500" aria-label="Completed" />
              ) : stat.isStarted ? (
                <div
                  className={cn("h-4 w-4 rounded-full border-2 flex items-center justify-center", colors.nodeRing)}
                  aria-label="In progress"
                >
                  <span className={cn("h-1.5 w-1.5 rounded-full", colors.nodeFill)} />
                </div>
              ) : (
                <Circle className="h-4 w-4 text-[var(--text-muted)]" aria-label="Not started" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[var(--text-primary)] leading-snug">{course.title}</p>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">{course.difficulty} · {course.estimatedHours}h</p>
            </div>
            <span className={cn(
              "text-xs font-mono tabular-nums shrink-0 mt-0.5",
              stat.isStarted ? colors.text : "text-[var(--text-muted)]",
            )}>
              {stat.done}/{stat.total}
            </span>
          </div>

          {/* Progress bar */}
          <div
            className="h-1 w-full rounded-full bg-[var(--bg-subtle)] mb-3"
            role="progressbar"
            aria-valuenow={stat.pct}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <motion.div
              className={cn("h-full rounded-full", stat.isComplete ? "bg-emerald-500" : colors.track)}
              initial={{ width: 0 }}
              whileInView={{ width: `${stat.pct}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            />
          </div>

          {/* Module chips */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {course.modules.slice(0, 4).map((mod) => (
              <span
                key={mod.id}
                className={cn("text-[10px] px-2 py-0.5 rounded-md border", colors.tagBg)}
              >
                {mod.title}
              </span>
            ))}
            {course.modules.length > 4 && (
              <span className="text-[10px] px-2 py-0.5 rounded-md border border-[var(--border-color)] text-[var(--text-muted)]">
                +{course.modules.length - 4} more
              </span>
            )}
          </div>

          {/* CTA */}
          <Link href={href}>
            <Button
              variant={stat.isStarted && !stat.isComplete ? "primary" : "secondary"}
              size="sm"
              className="w-full gap-2 justify-center"
            >
              {stat.isComplete ? "Review Course" : stat.isStarted ? "Continue" : "Start Course"}
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Coming-soon topic chip ─────────────────────────────────────────── */

function TopicChip({ name, colors }: { name: string; colors: SectionDef["colors"] }) {
  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-lg border font-medium",
      colors.tagBg,
    )}>
      <Lock className="h-2.5 w-2.5 opacity-60" aria-hidden />
      {name}
    </span>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════════════════════════════ */

export default function CurriculumPage() {
  /* ── Store reads (no mutations) ── */
  const lessonMap = useProgress((s) => s.lessons);
  const xp        = useProgress((s) => s.xp);
  const streakDays = useProgress((s) => s.streakDays);

  /* ── Collapse state (completed sections collapse by default) ── */
  const [openSet, setOpenSet] = React.useState<Set<string>>(new Set());
  const toggle = (id: string) =>
    setOpenSet((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });

  /* ── Journey stats ── */
  const allBuiltLessons = curriculum.flatMap((c) => c.modules.flatMap((m) => m.lessons));
  const totalBuilt = allBuiltLessons.length;
  const doneBuilt  = allBuiltLessons.filter((l) => lessonMap[l.slug]?.status === "completed").length;
  const journeyPct = totalBuilt > 0 ? Math.round((doneBuilt / totalBuilt) * 100) : 0;

  /* ── Per-section data ── */
  const sections = React.useMemo(() => {
    return SECTIONS.map((sec) => {
      const builtCourses = curriculum.filter((c) =>
        sec.topics.some((t) => c.title.toLowerCase().includes(t.toLowerCase())),
      );
      const comingSoon = sec.topics.filter(
        (t) => !curriculum.some((c) => c.title.toLowerCase().includes(t.toLowerCase())),
      );
      const courseStats = builtCourses.map((c) => ({ course: c, stat: getCourseStat(c, lessonMap) }));
      const secTotal = courseStats.reduce((s, cs) => s + cs.stat.total, 0);
      const secDone  = courseStats.reduce((s, cs) => s + cs.stat.done, 0);
      const secPct   = secTotal > 0 ? Math.round((secDone / secTotal) * 100) : 0;
      const anyStarted = courseStats.some((cs) => cs.stat.isStarted);

      type Status = "completed" | "in_progress" | "available" | "coming_soon";
      let status: Status;
      if (builtCourses.length === 0) {
        status = "coming_soon";
      } else if (secDone === secTotal && secTotal > 0) {
        status = "completed";
      } else if (anyStarted) {
        status = "in_progress";
      } else {
        status = "available";
      }

      return { ...sec, builtCourses, comingSoon, courseStats, secTotal, secDone, secPct, status };
    });
  }, [lessonMap]);

  /* ── Continue / start ── */
  const { continueCourse, continueStat, continueLesson, continueSec, isNewLearner } =
    React.useMemo(() => {
      let course: ResolvedCourse | null = null;
      for (const c of curriculum) {
        const lessons = c.modules.flatMap((m) => m.lessons);
        const hasStarted = lessons.some((l) => lessonMap[l.slug] !== undefined);
        const allDone    = lessons.every((l) => lessonMap[l.slug]?.status === "completed");
        if (hasStarted && !allDone) { course = c; break; }
      }
      const isNewLearner = !course && doneBuilt === 0;
      if (!course && curriculum.length > 0) course = curriculum[0];
      if (!course) return { continueCourse: null, continueStat: null, continueLesson: null, continueSec: null, isNewLearner: true };

      const stat   = getCourseStat(course, lessonMap);
      const lesson = stat.nextLesson;
      const sec    = SECTIONS.find((s) =>
        s.topics.some((t) => course!.title.toLowerCase().includes(t.toLowerCase())),
      ) ?? SECTIONS[1];

      return { continueCourse: course, continueStat: stat, continueLesson: lesson, continueSec: sec, isNewLearner };
    }, [lessonMap, doneBuilt]);

  const completedSections = sections.filter((s) => s.status === "completed").length;

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 min-w-0 px-4 md:px-8 py-8 max-w-3xl">

        {/* ══════════════════════════════════════════════
            JOURNEY HEADER
        ══════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--text-muted)] mb-2">
            Your Journey
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--text-primary)] mb-1">
            Data Science Roadmap
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mb-6 max-w-lg leading-relaxed">
            One structured path from beginner to industry-ready. Every skill taught in the order it becomes useful.
          </p>

          {/* Progress overview card */}
          <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-elevated)] p-5">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <div className="flex items-baseline gap-2 mb-0.5">
                  <span className="text-4xl font-bold text-[var(--text-primary)] tabular-nums">{journeyPct}%</span>
                  <span className="text-sm text-[var(--text-secondary)]">of available curriculum complete</span>
                </div>
                <p className="text-xs text-[var(--text-muted)]">
                  {completedSections} of 10 stages · {doneBuilt} of {totalBuilt} lessons
                </p>
              </div>
              <div className="flex flex-col items-end gap-2 shrink-0">
                {streakDays > 0 && (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    <Flame className="h-3.5 w-3.5 text-amber-500" aria-hidden />
                    <span className="text-xs font-semibold text-amber-400">{streakDays} day streak</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <Zap className="h-3 w-3 text-emerald-500" aria-hidden />
                  <span className="text-xs font-semibold text-emerald-400">{xp.toLocaleString()} XP</span>
                </div>
              </div>
            </div>

            {/* Main bar */}
            <div
              className="h-2 w-full rounded-full bg-[var(--bg-subtle)] mb-4"
              role="progressbar"
              aria-valuenow={journeyPct}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Overall journey progress"
            >
              <motion.div
                className="h-full rounded-full bg-emerald-500"
                initial={{ width: 0 }}
                animate={{ width: `${journeyPct}%` }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
              />
            </div>

            {/* Domain stage dots strip */}
            <div className="flex items-center gap-1" aria-hidden>
              {sections.map((sec, i) => (
                <React.Fragment key={sec.id}>
                  <div
                    title={`${sec.stage} ${sec.label}`}
                    className={cn(
                      "h-2.5 w-2.5 rounded-full transition-colors",
                      sec.status === "completed"  ? "bg-emerald-500"
                      : sec.status === "in_progress" ? sec.colors.nodeFill
                      : "bg-[var(--bg-subtle)]",
                    )}
                  />
                  {i < sections.length - 1 && (
                    <div className="flex-1 h-px bg-[var(--border-color)]" />
                  )}
                </React.Fragment>
              ))}
            </div>
            <div className="flex justify-between mt-1.5">
              <span className="text-[10px] text-[var(--text-muted)]">Foundations</span>
              <span className="text-[10px] text-[var(--text-muted)]">Industry Ready</span>
            </div>
          </div>
        </motion.div>

        {/* ══════════════════════════════════════════════
            CONTINUE BANNER
        ══════════════════════════════════════════════ */}
        {continueCourse && continueLesson && continueStat && continueSec && (
          <ContinueBanner
            course={continueCourse}
            lesson={continueLesson}
            stat={continueStat}
            colors={continueSec.colors}
            isNew={isNewLearner}
          />
        )}

        {/* ══════════════════════════════════════════════
            JOURNEY TRACK
        ══════════════════════════════════════════════ */}
        <div className="relative" aria-label="Curriculum stages">
          {/* Gradient connector — represents progression through domains */}
          <div
            aria-hidden
            className="absolute left-[17px] top-5 bottom-5 w-0.5 rounded-full"
            style={{
              background: "linear-gradient(to bottom, #0ea5e9, #8b5cf6, #f59e0b, #10b981, #f97316, #14b8a6, #ec4899, #f43f5e, #6366f1, #eab308)",
              opacity: 0.3,
            }}
          />

          <div className="space-y-3">
            {sections.map((sec, si) => {
              const isComplete   = sec.status === "completed";
              const isInProgress = sec.status === "in_progress";
              const isAvailable  = sec.status === "available";
              const isComingSoon = sec.status === "coming_soon";

              /* Completed sections: collapsed unless user opened them */
              const isOpen = isComingSoon
                ? false   // coming-soon sections don't fully expand
                : isComplete
                  ? openSet.has(sec.id)   // collapsed by default, toggle opens
                  : true;                  // active/available sections always open

              /* Card border + bg based on state */
              const cardStyle = isComplete
                ? "border-emerald-500/20 bg-[var(--bg-elevated)]"
                : isInProgress
                  ? cn(sec.colors.cardBorder, sec.colors.cardBg)
                  : isAvailable
                    ? "border-[var(--border-color)] bg-[var(--bg-elevated)]"
                    : "border-[var(--border-color)] bg-[var(--bg-base)]";   // coming-soon

              return (
                <motion.div
                  key={sec.id}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: si * 0.03, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className={cn("relative pl-11", isComingSoon && "opacity-50")}
                >
                  {/* Stage node */}
                  <div
                    aria-hidden
                    className={cn(
                      "absolute left-1.5 top-[13px] h-7 w-7 rounded-full border-2 z-10",
                      "flex items-center justify-center",
                      "bg-[var(--bg-elevated)]",
                      isComplete    ? "border-emerald-500"
                      : isComingSoon ? "border-[var(--border-color)]"
                      : sec.colors.nodeRing,
                    )}
                  >
                    {isComplete ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    ) : isComingSoon ? (
                      <Lock className="h-2.5 w-2.5 text-[var(--text-muted)]" />
                    ) : (
                      <span className={cn(
                        "h-2.5 w-2.5 rounded-full",
                        isInProgress ? sec.colors.nodeFill : "bg-[var(--border-color-strong)]",
                      )} />
                    )}
                  </div>

                  {/* Section card */}
                  <div className={cn("rounded-2xl border transition-colors", cardStyle)}>

                    {/* Section header row — always visible */}
                    <button
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-3.5 text-left focus-ring rounded-2xl",
                        isComplete || isComingSoon ? "cursor-pointer" : "cursor-default",
                      )}
                      onClick={isComplete || isComingSoon
                        ? () => !isComingSoon && toggle(sec.id)
                        : undefined
                      }
                      aria-expanded={isOpen}
                    >
                      {/* Stage number */}
                      <span className={cn("text-xs font-mono w-5 shrink-0", sec.colors.text)}>
                        {sec.stage}
                      </span>

                      {/* Label + badge */}
                      <div className="flex-1 min-w-0 flex flex-wrap items-center gap-2">
                        <h2 className={cn(
                          "text-sm font-bold tracking-tight",
                          isComingSoon ? "text-[var(--text-muted)]" : "text-[var(--text-primary)]",
                        )}>
                          {sec.label}
                        </h2>

                        {isComplete && (
                          <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-emerald-500 bg-emerald-500/10 border border-emerald-500/25 rounded-full px-2 py-0.5">
                            Complete
                          </span>
                        )}
                        {isInProgress && (
                          <span className={cn(
                            "text-[10px] font-bold uppercase tracking-[0.1em] rounded-full px-2 py-0.5 border",
                            sec.colors.badgeText, sec.colors.badgeBg, sec.colors.badgeBorder,
                          )}>
                            In Progress · {sec.secPct}%
                          </span>
                        )}
                        {isAvailable && (
                          <span className="text-[10px] font-semibold text-[var(--text-secondary)] bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-full px-2 py-0.5">
                            Available
                          </span>
                        )}
                        {isComingSoon && (
                          <span className="text-[10px] font-semibold text-[var(--text-muted)] bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-full px-2 py-0.5">
                            Coming Soon
                          </span>
                        )}
                      </div>

                      {/* Section progress bar (visible in header) */}
                      {sec.secTotal > 0 && !isOpen && (
                        <div className="hidden sm:flex items-center gap-2 shrink-0">
                          <div className="h-1 w-16 rounded-full bg-[var(--bg-subtle)]">
                            <div
                              className={cn("h-full rounded-full", isComplete ? "bg-emerald-500" : sec.colors.track)}
                              style={{ width: `${sec.secPct}%` }}
                            />
                          </div>
                          <span className={cn("text-[10px] tabular-nums", isComplete ? "text-emerald-400" : sec.colors.text)}>
                            {sec.secPct}%
                          </span>
                        </div>
                      )}

                      {/* Collapse toggle (completed only) */}
                      {isComplete && (
                        <span className="text-[var(--text-muted)] shrink-0">
                          {isOpen ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                        </span>
                      )}
                    </button>

                    {/* ── EXPANDED CONTENT ── */}
                    {isOpen && !isComingSoon && (
                      <div className="px-4 pb-4 space-y-3">
                        {/* Description */}
                        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                          {sec.description}
                        </p>

                        {/* Section progress bar */}
                        {sec.secTotal > 0 && (
                          <div
                            className="h-1 w-full rounded-full bg-[var(--bg-subtle)]"
                            role="progressbar"
                            aria-valuenow={sec.secPct}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-label={`${sec.label} progress`}
                          >
                            <motion.div
                              className={cn("h-full rounded-full", isComplete ? "bg-emerald-500" : sec.colors.track)}
                              initial={{ width: 0 }}
                              whileInView={{ width: `${sec.secPct}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.6, ease: "easeOut" }}
                            />
                          </div>
                        )}

                        {/* Course cards */}
                        {sec.courseStats.length > 0 && (
                          <div className="grid sm:grid-cols-2 gap-3 pt-1">
                            {sec.courseStats.map(({ course, stat }, ci) => (
                              <CourseCard
                                key={course.id}
                                course={course}
                                stat={stat}
                                colors={sec.colors}
                                animIndex={ci}
                              />
                            ))}
                          </div>
                        )}

                        {/* Coming-soon topic chips (for built sections with unbuilt topics) */}
                        {sec.comingSoon.length > 0 && (
                          <div className="flex flex-wrap gap-2 pt-1">
                            {sec.comingSoon.map((name) => (
                              <TopicChip key={name} name={name} colors={sec.colors} />
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* ── COLLAPSED COMPLETED summary ── */}
                    {!isOpen && isComplete && (
                      <div className="px-4 pb-3 flex flex-wrap gap-2">
                        {sec.courseStats.map(({ course }) => (
                          <Link
                            key={course.id}
                            href={`/course/${course.slug}`}
                            className="text-[11px] font-medium px-2.5 py-1 rounded-lg border border-emerald-500/25 bg-emerald-500/8 text-emerald-400 hover:bg-emerald-500/15 transition-colors"
                          >
                            ✓ {course.title}
                          </Link>
                        ))}
                      </div>
                    )}

                    {/* ── COMING SOON: topic preview ── */}
                    {isComingSoon && (
                      <div className="px-4 pb-4 space-y-3">
                        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{sec.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {sec.topics.map((name) => (
                            <TopicChip key={name} name={name} colors={sec.colors} />
                          ))}
                        </div>
                        <p className="text-[11px] text-[var(--text-muted)] italic">
                          Unlocks as you advance through the roadmap.
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ══════════════════════════════════════════════
            READINESS FOOTER
        ══════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-10 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-elevated)] p-5 text-center"
        >
          <BookOpen className="h-5 w-5 text-[var(--text-muted)] mx-auto mb-2" aria-hidden />
          <p className="text-sm font-semibold text-[var(--text-primary)] mb-1">
            {completedSections === 10
              ? "You've completed the full roadmap. Industry-ready."
              : `${10 - completedSections} stage${10 - completedSections === 1 ? "" : "s"} remaining to become industry-ready.`
            }
          </p>
          <p className="text-xs text-[var(--text-secondary)]">
            200+ lessons · 20+ projects · 300+ interview questions · all free
          </p>
        </motion.div>

        <div className="h-12" />
      </main>
    </div>
  );
}
