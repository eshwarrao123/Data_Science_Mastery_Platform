"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, Lock, ChevronRight, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useProgress } from "@/lib/store/progress";
import type { Course } from "@/lib/types";
import { cn } from "@/lib/utils";

const STEPS = [
  "Introduction",
  "Theory",
  "Visual Learning",
  "Worked Examples",
  "Practice Coding",
  "Exercises",
];

interface LessonTocProps {
  course: Course;
  activeModuleSlug: string;
  activeLessonSlug: string;
  currentStep: number;
  onStepClick: (step: number) => void;
}

export function LessonToc({
  course,
  activeModuleSlug,
  activeLessonSlug,
  currentStep,
  onStepClick,
}: LessonTocProps) {
  const lessons = useProgress((s) => s.lessons);
  const [openModules, setOpenModules] = React.useState<string[]>([activeModuleSlug]);

  const toggleModule = (slug: string) => {
    setOpenModules((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
    );
  };

  return (
    <nav
      aria-label="Lesson navigation"
      className="flex flex-col h-full overflow-y-auto"
    >
      {/* Lesson steps */}
      <div className="p-4 border-b border-[var(--border-color)]">
        <div className="text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-3">
          This Lesson
        </div>
        <div className="flex flex-col gap-0.5">
          {STEPS.map((step, i) => {
            const done = i < currentStep;
            const active = i === currentStep;
            return (
              <button
                key={step}
                onClick={() => onStepClick(i)}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-xs transition-colors focus-ring w-full",
                  active
                    ? "bg-[var(--bg-subtle)] text-[var(--text-primary)] font-medium"
                    : done
                    ? "text-emerald-500 hover:bg-[var(--bg-subtle)]"
                    : "text-[var(--text-muted)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-secondary)]",
                )}
                aria-current={active ? "step" : undefined}
              >
                {done ? (
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                ) : active ? (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="h-3.5 w-3.5 rounded-full border-2 border-[var(--text-primary)] shrink-0"
                  />
                ) : (
                  <Circle className="h-3.5 w-3.5 shrink-0 text-[var(--border-color)]" />
                )}
                <span className="text-[11px]">
                  {i + 1}. {step}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Course modules tree */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-3">
          {course.title}
        </div>
        {course.modules.map((mod) => {
          const isOpenMod = openModules.includes(mod.slug);
          return (
            <div key={mod.slug} className="mb-1">
              <button
                onClick={() => toggleModule(mod.slug)}
                className={cn(
                  "flex items-center justify-between w-full px-2 py-2 rounded-lg text-xs font-medium transition-colors focus-ring",
                  mod.slug === activeModuleSlug
                    ? "text-[var(--text-primary)]"
                    : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]",
                )}
                aria-expanded={isOpenMod}
              >
                <span className="truncate">{mod.title}</span>
                {isOpenMod ? (
                  <ChevronDown className="h-3 w-3 shrink-0 ml-1" />
                ) : (
                  <ChevronRight className="h-3 w-3 shrink-0 ml-1" />
                )}
              </button>

              {isOpenMod && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden ml-2 mt-0.5"
                >
                  {mod.lessons.map((lesson, li) => {
                    const isActive = lesson.slug === activeLessonSlug;
                    const isCompleted = lessons[lesson.slug]?.status === "completed";
                    const prevLesson = li > 0 ? mod.lessons[li - 1] : null;
                    const isLocked =
                      li > 0 && prevLesson && !lessons[prevLesson.slug]?.status;

                    return (
                      <Link
                        key={lesson.id}
                        href={`/course/${course.slug}/${mod.slug}/${lesson.slug}`}
                        className={cn(
                          "flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] transition-colors focus-ring",
                          isActive
                            ? "bg-[var(--bg-subtle)] text-[var(--text-primary)] font-medium"
                            : isCompleted
                            ? "text-emerald-500 hover:bg-[var(--bg-subtle)]"
                            : isLocked
                            ? "text-[var(--text-muted)] opacity-50 pointer-events-none"
                            : "text-[var(--text-muted)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-secondary)]",
                        )}
                        aria-current={isActive ? "page" : undefined}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="h-3 w-3 shrink-0 text-emerald-500" />
                        ) : isLocked ? (
                          <Lock className="h-3 w-3 shrink-0" />
                        ) : (
                          <Circle className="h-3 w-3 shrink-0" />
                        )}
                        <span className="truncate">{lesson.title}</span>
                      </Link>
                    );
                  })}
                </motion.div>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
}
