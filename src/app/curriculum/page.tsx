"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Circle, Lock, ChevronDown, ChevronRight, ArrowRight } from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";
import { Badge } from "@/components/ui/badge";
import { curriculum } from "@/lib/data/curriculum";
import { useProgress } from "@/lib/store/progress";
import { cn } from "@/lib/utils";

const ROADMAP_SECTIONS = [
  { id: "prep", label: "Preparatory", color: "bg-sky-500", courses: ["Excel", "Power BI", "Tableau"] },
  { id: "prog", label: "Programming", color: "bg-violet-500", courses: ["Python", "R"] },
  { id: "math", label: "Math & Stats", color: "bg-amber-500", courses: ["Mathematics", "Statistics", "Probability"] },
  { id: "data", label: "Data Analysis", color: "bg-emerald-500", courses: ["EDA", "Pandas", "NumPy", "Matplotlib", "Seaborn", "Data Cleaning", "Feature Engineering"] },
  { id: "ml", label: "Machine Learning", color: "bg-orange-500", courses: ["Regression", "Classification", "Clustering", "Ensemble Learning", "Model Evaluation", "Time Series", "Recommendation Systems"] },
  { id: "db", label: "Databases", color: "bg-teal-500", courses: ["SQL", "MongoDB"] },
  { id: "bigdata", label: "Big Data", color: "bg-pink-500", courses: ["PySpark", "Web Scraping"] },
  { id: "ai", label: "AI & Deep Learning", color: "bg-rose-500", courses: ["CNN", "RNN", "LSTM", "Transformers", "NLP", "LLMs", "LangChain", "RAG", "Agents", "Fine Tuning"] },
  { id: "mlops", label: "MLOps & Deployment", color: "bg-indigo-500", courses: ["Docker", "FastAPI", "AWS", "Azure", "MLflow", "CI/CD"] },
  { id: "career", label: "Career", color: "bg-yellow-500", courses: ["Resume", "LinkedIn", "Portfolio", "Mock Interviews", "Salary Negotiation"] },
];

export default function CurriculumPage() {
  const lessonMap = useProgress((s) => s.lessons);
  const [expandedSections, setExpandedSections] = React.useState<string[]>(["prog", "data"]);

  const toggle = (id: string) =>
    setExpandedSections((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );

  // Map built courses to their sections
  const builtCourses = new Map(curriculum.map((c) => [c.slug, c]));

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 md:ml-64 px-4 md:px-8 py-8 max-w-4xl">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-2">
            Full Roadmap
          </p>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[var(--text-primary)] mb-3">
            Curriculum Roadmap
          </h1>
          <p className="text-[var(--text-secondary)] max-w-xl leading-relaxed">
            A single, end-to-end path from beginner to job-ready. Complete each
            section before advancing. Click a node to explore its lessons.
          </p>
        </motion.div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 mb-8 text-xs text-[var(--text-muted)]">
          {[
            { icon: <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />, label: "Completed" },
            { icon: <div className="h-3.5 w-3.5 rounded-full border-2 border-amber-500" />, label: "In Progress" },
            { icon: <Circle className="h-3.5 w-3.5" />, label: "Available" },
            { icon: <Lock className="h-3.5 w-3.5" />, label: "Locked (complete previous)" },
          ].map(({ icon, label }) => (
            <div key={label} className="flex items-center gap-1.5">{icon}{label}</div>
          ))}
        </div>

        {/* Roadmap vertical flow */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-5 top-6 bottom-0 w-px bg-[var(--border-color)]" aria-hidden />

          <div className="flex flex-col gap-4">
            {ROADMAP_SECTIONS.map((section, si) => {
              const isOpen = expandedSections.includes(section.id);
              // Find built courses for this section
              const builtInSection = curriculum.filter((c) =>
                section.courses.some(
                  (name) => c.title.toLowerCase().includes(name.toLowerCase()),
                ),
              );

              return (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: si * 0.05 }}
                  className="pl-12 relative"
                >
                  {/* Section dot */}
                  <div
                    className={cn(
                      "absolute left-3.5 top-3.5 h-3 w-3 rounded-full border-2 border-[var(--bg-base)]",
                      section.color,
                    )}
                    aria-hidden
                  />

                  {/* Section header */}
                  <button
                    onClick={() => toggle(section.id)}
                    aria-expanded={isOpen}
                    className="w-full flex items-center justify-between py-3 text-left focus-ring rounded-lg group"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded",
                          section.color,
                          "text-white",
                        )}
                      >
                        {section.label}
                      </span>
                      <span className="text-xs text-[var(--text-muted)]">
                        {section.courses.length} topics
                      </span>
                    </div>
                    <motion.span
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="h-4 w-4 text-[var(--text-muted)]" />
                    </motion.span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22 }}
                        className="overflow-hidden"
                      >
                        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2 pb-4">
                          {section.courses.map((courseName) => {
                            const builtCourse = builtInSection.find((c) =>
                              c.title.toLowerCase().includes(courseName.toLowerCase()),
                            );

                            const totalL = builtCourse
                              ? builtCourse.modules.flatMap((m) => m.lessons).length
                              : 0;
                            const doneL = builtCourse
                              ? builtCourse.modules
                                  .flatMap((m) => m.lessons)
                                  .filter((l) => lessonMap[l.slug]?.status === "completed")
                                  .length
                              : 0;
                            const isBuilt = !!builtCourse;

                            return isBuilt ? (
                              <Link
                                key={courseName}
                                href={`/course/${builtCourse!.slug}`}
                                className="flex items-center gap-2.5 p-3 rounded-lg border border-[var(--border-color)] bg-[var(--bg-elevated)] hover:bg-[var(--bg-subtle)] transition-colors group"
                              >
                                {doneL === totalL && totalL > 0 ? (
                                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                                ) : doneL > 0 ? (
                                  <div className="h-4 w-4 rounded-full border-2 border-amber-500 shrink-0" />
                                ) : (
                                  <Circle className="h-4 w-4 text-[var(--border-color)] shrink-0" />
                                )}
                                <span className="text-xs font-medium text-[var(--text-primary)] truncate flex-1">
                                  {courseName}
                                </span>
                                <ArrowRight className="h-3.5 w-3.5 text-[var(--text-muted)] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                              </Link>
                            ) : (
                              <div
                                key={courseName}
                                className="flex items-center gap-2.5 p-3 rounded-lg border border-[var(--border-color)] bg-[var(--bg-elevated)] opacity-50"
                              >
                                <Lock className="h-4 w-4 text-[var(--text-muted)] shrink-0" />
                                <span className="text-xs text-[var(--text-muted)] truncate">{courseName}</span>
                                <Badge variant="muted" className="ml-auto text-[9px] px-1.5 py-0.5 shrink-0">
                                  Soon
                                </Badge>
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
