"use client";

import * as React from "react";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import {
  ArrowRight,
  Code2,
  Cpu,
  Layers,
  BookOpen,
  Zap,
  BarChart2,
  Brain,
  Trophy,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { curriculum } from "@/lib/data/curriculum";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: "easeOut" as const },
  }),
};

const FEATURES = [
  {
    icon: Code2,
    title: "Interactive Playgrounds",
    description:
      "Write and run real Python, SQL, and R directly inside every lesson — no setup, no tab-switching.",
  },
  {
    icon: Brain,
    title: "AI Tutor",
    description:
      "Ask questions, get explanations, debug code, and generate practice quizzes on demand.",
  },
  {
    icon: Layers,
    title: "Industry Projects",
    description:
      "Build 20+ portfolio-ready projects: fraud detection, NLP pipelines, recommendation engines.",
  },
  {
    icon: Zap,
    title: "Mastery-Based Learning",
    description:
      "Each lesson gates the next until you prove understanding. No passive reading allowed.",
  },
  {
    icon: BarChart2,
    title: "Progress Analytics",
    description:
      "Track XP, streaks, time invested, and skill gaps with a Linear-inspired dashboard.",
  },
  {
    icon: Trophy,
    title: "Interview Prep",
    description:
      "300+ real interview questions from Google, Amazon, Netflix — with a built-in code judge.",
  },
];

const STATS = [
  { value: "200+", label: "Lessons" },
  { value: "20+", label: "Projects" },
  { value: "300+", label: "Interview Qs" },
  { value: "10", label: "Career Tracks" },
];

const ROADMAP_STEPS = [
  { label: "Python", category: "Programming", color: "text-sky-400" },
  { label: "SQL", category: "Databases", color: "text-violet-400" },
  { label: "Pandas + NumPy", category: "Data Analysis", color: "text-emerald-400" },
  { label: "EDA & Visualization", category: "Data Analysis", color: "text-emerald-400" },
  { label: "Machine Learning", category: "ML", color: "text-amber-400" },
  { label: "Deep Learning", category: "AI", color: "text-rose-400" },
  { label: "LLMs & Agents", category: "AI", color: "text-rose-400" },
  { label: "MLOps & Deployment", category: "DevOps", color: "text-orange-400" },
];

export default function LandingPage() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* ─── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative flex flex-col items-center justify-center text-center pt-24 pb-20 px-4 overflow-hidden">
        {/* Subtle grid background */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(var(--border-color) 1px, transparent 1px), linear-gradient(90deg, var(--border-color) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
          aria-hidden
        />

        <motion.div
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          <Badge variant="success" className="mb-6 text-xs px-3 py-1">
            <Zap className="h-3 w-3" />
            Now featuring AI Tutor + Inline Python Compiler
          </Badge>
        </motion.div>

        <motion.h1
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-[var(--text-primary)] max-w-4xl mx-auto leading-[1.08]"
        >
          Learn Data Science
          <br />
          <span className="text-[var(--text-muted)]">from Absolute Beginner</span>
          <br />
          to Industry Ready.
        </motion.h1>

        <motion.p
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mt-6 text-lg text-[var(--text-secondary)] max-w-xl mx-auto leading-relaxed"
        >
          The only platform that combines interactive code playgrounds, an AI
          tutor, and a mastery-based curriculum — in one cohesive experience.
        </motion.p>

        <motion.div
          custom={3}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mt-10 flex flex-col sm:flex-row items-center gap-3"
        >
          <Link href="/dashboard">
            <Button size="lg" variant="primary" className="gap-2">
              Start Learning Free
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/curriculum">
            <Button size="lg" variant="secondary">
              View Curriculum
            </Button>
          </Link>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          custom={4}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mt-16 flex flex-wrap items-center justify-center gap-x-12 gap-y-4"
        >
          {STATS.map((s) => (
            <div key={s.label} className="flex flex-col items-center">
              <span className="text-2xl font-bold text-[var(--text-primary)]">{s.value}</span>
              <span className="text-xs text-[var(--text-muted)] mt-0.5">{s.label}</span>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ─── Features Grid ────────────────────────────────────────────── */}
      <section className="px-4 py-20 border-t border-[var(--border-color)]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-3">
              Platform Features
            </p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
              Built to get you hired, not just educated.
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-60px" }}
                  className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-elevated)] p-6 hover:bg-[var(--bg-subtle)] transition-colors"
                >
                  <div className="h-10 w-10 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-color)] flex items-center justify-center mb-4">
                    <Icon className="h-5 w-5 text-[var(--text-primary)]" aria-hidden />
                  </div>
                  <h3 className="text-base font-semibold text-[var(--text-primary)] mb-1.5">
                    {f.title}
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    {f.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Lesson Blueprint Preview ─────────────────────────────────── */}
      <section className="px-4 py-20 border-t border-[var(--border-color)]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-3">
              Lesson Structure
            </p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
              Every lesson is a 6-step mastery journey.
            </h2>
            <p className="mt-4 text-[var(--text-secondary)] max-w-2xl mx-auto">
              No concept is left unexplained. No step is skipped. You&apos;re guided
              from intuition to execution — at your own pace.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { step: "01", title: "Introduction", desc: "Real-world context, learning objectives, industry applications." },
              { step: "02", title: "Theory", desc: "Simple English explanations, analogies, expandable deep-dives, glossary tooltips." },
              { step: "03", title: "Visual Learning", desc: "Interactive SVG diagrams, flowcharts, and animated concept maps." },
              { step: "04", title: "Worked Examples", desc: "Step-by-step reveals from Very Easy → Industry Example, at your pace." },
              { step: "05", title: "Hands-on Coding", desc: "Monaco editor embedded inline. Write, run, debug — all in the lesson." },
              { step: "06", title: "Practice Exercises", desc: "MCQs, coding challenges, scenario questions. 80% mastery to advance." },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                className="flex gap-4 p-5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-elevated)]"
              >
                <span className="text-2xl font-bold text-[var(--text-muted)] tabular-nums shrink-0">
                  {item.step}
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Curriculum Preview ───────────────────────────────────────── */}
      <section className="px-4 py-20 border-t border-[var(--border-color)]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-3">
              Curriculum Roadmap
            </p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
              A single, unbroken path. Zero gaps.
            </h2>
          </div>

          {/* Horizontal scrollable timeline */}
          <div className="overflow-x-auto pb-4">
            <div className="flex items-center gap-0 min-w-max mx-auto">
              {ROADMAP_STEPS.map((step, i) => (
                <React.Fragment key={step.label}>
                  <motion.div
                    custom={i}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="flex flex-col items-center gap-2 w-36"
                  >
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                      {step.category}
                    </span>
                    <div className="h-9 w-9 rounded-full border-2 border-[var(--border-color)] bg-[var(--bg-elevated)] flex items-center justify-center">
                      <CheckCircle2 className={cn("h-4 w-4", step.color)} />
                    </div>
                    <span className="text-xs font-medium text-[var(--text-secondary)] text-center leading-tight">
                      {step.label}
                    </span>
                  </motion.div>
                  {i < ROADMAP_STEPS.length - 1 && (
                    <div className="h-px w-8 bg-[var(--border-color)] shrink-0 mt-4" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="mt-10 text-center">
            <Link href="/curriculum">
              <Button variant="secondary" size="lg" className="gap-2">
                Explore Full Roadmap
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────────────────────────── */}
      <section className="px-4 py-24 border-t border-[var(--border-color)]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[var(--text-primary)] mb-4">
            Ready to start?
          </h2>
          <p className="text-[var(--text-secondary)] mb-8 leading-relaxed">
            Jump into your first lesson. No credit card. No account required to
            preview. Begin the Python module right now.
          </p>
          <Link href="/course/python/foundations/variables-and-data-types">
            <Button size="lg" variant="primary" className="gap-2">
              Open First Lesson
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border-color)] py-8 px-4 text-center">
        <p className="text-xs text-[var(--text-muted)]">
          © {new Date().getFullYear()} Data Science Mastery. Built for learners who mean business.
        </p>
      </footer>
    </main>
  );
}
