"use client";

import * as React from "react";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, BookOpen, CheckCircle2, Circle, Lock, ArrowRight, Play } from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress";
import { getCourse } from "@/lib/data/curriculum";
import { useProgress } from "@/lib/store/progress";
import { cn } from "@/lib/utils";

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.06, duration: 0.3 },
  }),
};

export default function CourseOverviewPage() {
  const params = useParams() as { courseSlug: string };
  const course = getCourse(params.courseSlug);
  if (!course) notFound();

  const lessonMap = useProgress((s) => s.lessons);

  const totalLessons = course.modules.flatMap((m) => m.lessons).length;
  const completedLessons = course.modules
    .flatMap((m) => m.lessons)
    .filter((l) => lessonMap[l.slug]?.status === "completed").length;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 md:ml-64 px-4 md:px-8 py-8 max-w-5xl">
        {/* Hero */}
        <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible" className="mb-8">
          <Badge variant={course.difficulty === "Beginner" ? "success" : course.difficulty === "Intermediate" ? "warning" : "error"} className="mb-3">
            {course.difficulty}
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[var(--text-primary)] mb-3">
            {course.title}
          </h1>
          <p className="text-[var(--text-secondary)] max-w-2xl leading-relaxed mb-5">
            {course.description}
          </p>
          <div className="flex flex-wrap items-center gap-4 mb-5">
            <span className="flex items-center gap-1.5 text-sm text-[var(--text-muted)]">
              <Clock className="h-4 w-4" /> {course.estimatedHours}h estimated
            </span>
            <span className="flex items-center gap-1.5 text-sm text-[var(--text-muted)]">
              <BookOpen className="h-4 w-4" /> {totalLessons} lessons
            </span>
          </div>
          <div className="flex items-center gap-3 mb-1">
            <ProgressBar value={(completedLessons / totalLessons) * 100} size="md" className="max-w-xs" />
            <span className="text-sm text-[var(--text-secondary)]">{completedLessons}/{totalLessons}</span>
          </div>
        </motion.div>

        {/* Modules */}
        {course.modules.map((mod, mi) => (
          <motion.div key={mod.id} custom={mi + 1} variants={fadeUp} initial="hidden" animate="visible" className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs font-bold text-[var(--text-muted)] tabular-nums">
                {String(mi + 1).padStart(2, "0")}
              </span>
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">{mod.title}</h2>
            </div>
            <p className="text-sm text-[var(--text-muted)] mb-4 ml-8">{mod.description}</p>
            <div className="flex flex-col gap-2 ml-8">
              {mod.lessons.map((lesson, li) => {
                const isCompleted = lessonMap[lesson.slug]?.status === "completed";
                const isInProgress = lessonMap[lesson.slug]?.status === "in_progress";
                const prevLesson = li > 0 ? mod.lessons[li - 1] : null;
                const isLocked = Boolean(li > 0 && prevLesson && !lessonMap[prevLesson.slug]);

                return (
                  <Link
                    key={lesson.id}
                    href={
                      isLocked
                        ? "#"
                        : `/course/${course.slug}/${mod.slug}/${lesson.slug}`
                    }
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-xl border transition-colors group",
                      isCompleted
                        ? "border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10"
                        : isLocked
                        ? "border-[var(--border-color)] opacity-50 cursor-not-allowed"
                        : "border-[var(--border-color)] bg-[var(--bg-elevated)] hover:bg-[var(--bg-subtle)]",
                    )}
                    aria-disabled={isLocked}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                    ) : isLocked ? (
                      <Lock className="h-5 w-5 text-[var(--text-muted)] shrink-0" />
                    ) : (
                      <Circle className="h-5 w-5 text-[var(--border-color)] shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-[var(--text-primary)] truncate">{lesson.title}</div>
                      <div className="text-xs text-[var(--text-muted)] flex items-center gap-2 mt-0.5">
                        <span>{lesson.estimatedTime}</span>
                        <span>·</span>
                        <span>+{lesson.xpReward} XP</span>
                      </div>
                    </div>
                    {isInProgress && (
                      <Badge variant="warning" className="shrink-0">In Progress</Badge>
                    )}
                    <ArrowRight className="h-4 w-4 text-[var(--text-muted)] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                  </Link>
                );
              })}
            </div>
          </motion.div>
        ))}

        {/* CTA */}
        <div className="mt-4">
          <Link href={`/course/${course.slug}/${course.modules[0]?.slug}/${course.modules[0]?.lessons[0]?.slug}`}>
            <Button size="lg" variant="primary" className="gap-2">
              <Play className="h-4 w-4" />
              {completedLessons === 0 ? "Start Course" : "Continue Learning"}
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
