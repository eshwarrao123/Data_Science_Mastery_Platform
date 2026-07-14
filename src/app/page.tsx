"use client";

import * as React from "react";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import {
  ArrowRight,
  Code2,
  Brain,
  Zap,
  Trophy,
  CheckCircle2,
  Play,
  Lock,
  Terminal,
  Sparkles,
  ChevronRight,
  MessageSquare,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/* ── Animation ─────────────────────────────────────────────────────── */

const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 18 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.45, ease: [0.16, 1, 0.3, 1] },
  }),
};

/* ── Design tokens for homepage-specific visuals ────────────────────── */

const DOMAINS = [
  { label: "Foundations",      bg: "bg-sky-100 dark:bg-sky-500/15",     text: "text-sky-700 dark:text-sky-300",    border: "border-sky-200 dark:border-sky-500/25"    },
  { label: "Python & R",       bg: "bg-violet-100 dark:bg-violet-500/15", text: "text-violet-700 dark:text-violet-300", border: "border-violet-200 dark:border-violet-500/25" },
  { label: "Math & Stats",     bg: "bg-amber-100 dark:bg-amber-500/15",  text: "text-amber-700 dark:text-amber-300",  border: "border-amber-200 dark:border-amber-500/25"  },
  { label: "Data Analysis",    bg: "bg-emerald-100 dark:bg-emerald-500/15", text: "text-emerald-700 dark:text-emerald-300", border: "border-emerald-200 dark:border-emerald-500/25" },
  { label: "Machine Learning", bg: "bg-orange-100 dark:bg-orange-500/15", text: "text-orange-700 dark:text-orange-300", border: "border-orange-200 dark:border-orange-500/25" },
  { label: "SQL & Databases",  bg: "bg-teal-100 dark:bg-teal-500/15",    text: "text-teal-700 dark:text-teal-300",   border: "border-teal-200 dark:border-teal-500/25"   },
  { label: "Big Data",         bg: "bg-pink-100 dark:bg-pink-500/15",    text: "text-pink-700 dark:text-pink-300",   border: "border-pink-200 dark:border-pink-500/25"   },
  { label: "AI & Deep Learning", bg: "bg-rose-100 dark:bg-rose-500/15", text: "text-rose-700 dark:text-rose-300",   border: "border-rose-200 dark:border-rose-500/25"   },
  { label: "MLOps",            bg: "bg-indigo-100 dark:bg-indigo-500/15", text: "text-indigo-700 dark:text-indigo-300", border: "border-indigo-200 dark:border-indigo-500/25" },
  { label: "Career Ready",     bg: "bg-yellow-100 dark:bg-yellow-500/15", text: "text-yellow-700 dark:text-yellow-300", border: "border-yellow-200 dark:border-yellow-500/25" },
] as const;

const STATS = [
  { value: "200+", label: "Lessons"     },
  { value: "20+",  label: "Projects"    },
  { value: "300+", label: "Interview Qs"},
  { value: "100%", label: "Free Forever"},
] as const;

const METHOD_STEPS = [
  { num: "01", title: "Understand",  tag: "Theory",   color: "text-sky-700 dark:text-sky-400",     desc: "Real-world context, plain-English explanations, glossary tooltips on every term." },
  { num: "02", title: "Visualize",   tag: "Visual",   color: "text-violet-700 dark:text-violet-400", desc: "Animated diagrams and interactive concept maps make abstract ideas concrete." },
  { num: "03", title: "Predict",     tag: "Engage",   color: "text-amber-700 dark:text-amber-400",   desc: "Predict-then-reveal exercises that sharpen intuition before syntax." },
  { num: "04", title: "Code",        tag: "Practice", color: "text-emerald-700 dark:text-emerald-400", desc: "Monaco editor embedded in the lesson — write, run, and debug without leaving DSM." },
  { num: "05", title: "Verify",      tag: "Assess",   color: "text-orange-700 dark:text-orange-400", desc: "MCQs, coding challenges, and scenario questions. 80% mastery gates the next step." },
  { num: "06", title: "Master",      tag: "Advance",  color: "text-rose-700 dark:text-rose-400",    desc: "Pass mastery thresholds, earn XP, and unlock the next concept on the roadmap." },
] as const;

/* Connected curriculum map — two-row snake layout */
const MAP_ROW1 = [
  { num: "01", label: "Foundations",    cardCn: "bg-sky-50 border-sky-200 dark:bg-sky-500/8 dark:border-sky-500/25",     textCn: "text-sky-700 dark:text-sky-300" },
  { num: "02", label: "Python & R",     cardCn: "bg-violet-50 border-violet-200 dark:bg-violet-500/8 dark:border-violet-500/25", textCn: "text-violet-700 dark:text-violet-300" },
  { num: "03", label: "Math & Stats",   cardCn: "bg-amber-50 border-amber-200 dark:bg-amber-500/8 dark:border-amber-500/25",  textCn: "text-amber-700 dark:text-amber-300" },
  { num: "04", label: "Data Analysis",  cardCn: "bg-emerald-50 border-emerald-200 dark:bg-emerald-500/8 dark:border-emerald-500/25", textCn: "text-emerald-700 dark:text-emerald-300" },
  { num: "05", label: "Machine Learning", cardCn: "bg-orange-50 border-orange-200 dark:bg-orange-500/8 dark:border-orange-500/25", textCn: "text-orange-700 dark:text-orange-300" },
] as const;

/* Row 2: Career Ready on left, SQL/DB on right. Arrows (←) show path continues from SQL rightward to Career */
const MAP_ROW2 = [
  { num: "10", label: "Career Ready",     cardCn: "bg-yellow-50 border-yellow-200 dark:bg-yellow-500/8 dark:border-yellow-500/25", textCn: "text-yellow-700 dark:text-yellow-300" },
  { num: "09", label: "MLOps",            cardCn: "bg-indigo-50 border-indigo-200 dark:bg-indigo-500/8 dark:border-indigo-500/25", textCn: "text-indigo-700 dark:text-indigo-300" },
  { num: "08", label: "AI & Deep Learning", cardCn: "bg-rose-50 border-rose-200 dark:bg-rose-500/8 dark:border-rose-500/25",   textCn: "text-rose-700 dark:text-rose-300" },
  { num: "07", label: "Big Data",         cardCn: "bg-pink-50 border-pink-200 dark:bg-pink-500/8 dark:border-pink-500/25",     textCn: "text-pink-700 dark:text-pink-300" },
  { num: "06", label: "SQL & Databases",  cardCn: "bg-teal-50 border-teal-200 dark:bg-teal-500/8 dark:border-teal-500/25",    textCn: "text-teal-700 dark:text-teal-300" },
] as const;

const FREE_ITEMS = [
  "Every lesson & concept",
  "Every coding exercise",
  "Every portfolio project",
  "DSM AI Tutor",
  "Interview prep library",
  "Career guidance",
  "Certificate of completion",
  "Full curriculum roadmap",
] as const;

const PROJECTS = [
  { title: "Student Data Analyzer",    track: "Data Analysis",  trackColor: "text-emerald-600 dark:text-emerald-400", status: "available" as const },
  { title: "Customer Churn Predictor", track: "ML",             trackColor: "text-orange-600 dark:text-orange-400",  status: "locked"    as const },
  { title: "Sales Insights Dashboard", track: "Data Analysis",  trackColor: "text-emerald-600 dark:text-emerald-400", status: "locked"    as const },
  { title: "Recommendation Engine",    track: "ML",             trackColor: "text-orange-600 dark:text-orange-400",  status: "locked"    as const },
  { title: "RAG Knowledge Assistant",  track: "Gen AI",         trackColor: "text-pink-600 dark:text-pink-400",    status: "locked"    as const },
  { title: "NLP Sentiment Pipeline",   track: "Deep Learning",  trackColor: "text-rose-600 dark:text-rose-400",    status: "locked"    as const },
] as const;

/* ── Layout helpers ─────────────────────────────────────────────────── */

function Section({
  children,
  className,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={cn("px-4 sm:px-6", className)}>
      <div className="max-w-6xl mx-auto">{children}</div>
    </section>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)] mb-3">
      {children}
    </p>
  );
}

/* ── Page ───────────────────────────────────────────────────────────── */

export default function HomePage() {
  return (
    <main className="flex flex-col min-h-screen">

      {/* ══════════════════════════════════════════════════════════
          HERO — Strong message + domain identity strip
      ══════════════════════════════════════════════════════════ */}
      <section className="relative flex flex-col items-center text-center pt-28 pb-12 px-4 sm:px-6 overflow-hidden">

        {/* Dot grid */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(100,116,139,0.06) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        {/* Radial atmosphere */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(99,102,241,0.07) 0%, transparent 70%)",
          }}
        />

        {/* Eyebrow */}
        <motion.div
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/8 text-emerald-700 dark:text-emerald-400 text-xs font-semibold"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
          100% Free · No paywall · No credit card
        </motion.div>

        {/* Headline */}
        <motion.h1
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[var(--text-primary)] max-w-4xl mx-auto leading-[1.06]"
        >
          Master Data Science.
          <br />
          <span className="text-[var(--text-muted)]">From Zero.</span>{" "}
          <span
            style={{
              backgroundImage: "linear-gradient(135deg, #a78bfa, #34d399)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Industry Ready.
          </span>
        </motion.h1>

        <motion.p
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mt-6 text-lg sm:text-xl text-[var(--text-secondary)] max-w-xl mx-auto leading-relaxed"
        >
          One structured path — from spreadsheets to production ML models.
          Interactive lessons, built-in code editor, AI tutor, real projects.
        </motion.p>

        {/* CTAs */}
        <motion.div
          custom={3}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mt-9 flex flex-col sm:flex-row items-center gap-3"
        >
          <Link href="/dashboard">
            <Button size="lg" variant="primary" className="gap-2 h-12 px-7 text-base">
              Start Learning Free
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/curriculum">
            <Button size="lg" variant="secondary" className="h-12 px-7 text-base">
              Explore Curriculum
            </Button>
          </Link>
        </motion.div>

        {/* Stats row */}
        <motion.div
          custom={4}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mt-10 flex flex-wrap justify-center gap-8"
        >
          {STATS.map((s) => (
            <div key={s.label} className="flex flex-col items-center">
              <span className="text-2xl font-bold text-[var(--text-primary)] tabular-nums">{s.value}</span>
              <span className="text-xs text-[var(--text-muted)] mt-0.5 tracking-wide">{s.label}</span>
            </div>
          ))}
        </motion.div>

        {/* ── CURRICULUM STAGE STRIP ── */}
        <motion.div
          custom={5}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mt-14 w-full max-w-3xl"
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)] mb-4 text-center">
            Your complete learning path
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {DOMAINS.map((d, i) => (
              <motion.span
                key={d.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + i * 0.04, duration: 0.3 }}
                className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border",
                  d.bg, d.text, d.border,
                )}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-current opacity-60" aria-hidden />
                {d.label}
              </motion.span>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-center gap-2 text-[var(--text-muted)]">
            <div className="h-px flex-1 max-w-20 bg-gradient-to-r from-transparent to-[var(--border-color)]" />
            <span className="text-[10px] tracking-wide">beginner → industry ready</span>
            <div className="h-px flex-1 max-w-20 bg-gradient-to-l from-transparent to-[var(--border-color)]" />
          </div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          PRODUCT PIPELINE — RAW DATA → PYTHON → VISUALIZE → PREDICT
          Shows how data science works inside DSM
      ══════════════════════════════════════════════════════════ */}
      <section className="px-4 sm:px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)] text-center mb-6"
          >
            How data science flows in DSM
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="overflow-x-auto"
          >
            <div className="min-w-[700px] flex rounded-2xl overflow-hidden border border-[var(--border-color)]">

              {/* Panel 1: Raw Data */}
              <div className="flex-1 p-5 bg-[var(--bg-elevated)] border-r border-[var(--border-color)]">
                <p className="text-[10px] font-mono uppercase tracking-wider text-sky-700 dark:text-sky-400 mb-3 font-semibold">Raw Data</p>
                <div className="font-mono text-xs space-y-1.5">
                  <div className="grid grid-cols-4 gap-2 text-[var(--text-muted)] text-[10px] pb-1 border-b border-[var(--border-color)]">
                    <span>id</span><span>age</span><span>spend</span><span>churn</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-[var(--text-secondary)]">
                    <span>1</span><span>25</span><span>430</span><span className="text-emerald-600 dark:text-emerald-400">0</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-[var(--text-secondary)]">
                    <span>2</span><span>42</span><span>190</span><span className="text-rose-600 dark:text-rose-400">1</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-[var(--text-secondary)]">
                    <span>3</span><span>31</span><span>820</span><span className="text-emerald-600 dark:text-emerald-400">0</span>
                  </div>
                </div>
              </div>

              {/* Arrow */}
              <div className="flex items-center justify-center px-3 bg-[var(--bg-subtle)] text-[var(--text-muted)] text-sm shrink-0">→</div>

              {/* Panel 2: Python */}
              <div className="flex-1 p-5 bg-[#0d1117] border-r border-[var(--border-color)]">
                <p className="text-[10px] font-mono uppercase tracking-wider text-violet-400 mb-3 font-semibold">Python</p>
                <div className="font-mono text-xs leading-6">
                  <p><span className="text-violet-400">import</span> <span className="text-sky-300">pandas</span> <span className="text-violet-400">as</span> <span className="text-sky-300">pd</span></p>
                  <p><span className="text-sky-300">df</span> <span className="text-[#c0c8d8]">=</span> pd.read_csv(<span className="text-emerald-300">&quot;data.csv&quot;</span>)</p>
                  <p><span className="text-sky-300">X</span> <span className="text-[#c0c8d8]">=</span> df.drop(<span className="text-emerald-300">&quot;churn&quot;</span>)</p>
                  <p><span className="text-sky-300">model</span>.fit(<span className="text-sky-300">X</span>, <span className="text-sky-300">y</span>)</p>
                </div>
              </div>

              {/* Arrow */}
              <div className="flex items-center justify-center px-3 bg-[var(--bg-subtle)] text-[var(--text-muted)] text-sm shrink-0">→</div>

              {/* Panel 3: Visualize */}
              <div className="flex-1 p-5 bg-[var(--bg-elevated)] border-r border-[var(--border-color)]">
                <p className="text-[10px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-3 font-semibold">Visualize</p>
                <div className="flex items-end gap-1 h-12 mt-1">
                  {[55, 80, 40, 95, 65, 50, 75].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t-sm transition-all"
                      style={{
                        height: `${h}%`,
                        background: `hsla(${145 + i * 15}, 60%, 45%, 0.75)`,
                      }}
                    />
                  ))}
                </div>
                <p className="text-[10px] text-[var(--text-muted)] mt-2 font-mono">feature importance</p>
              </div>

              {/* Arrow */}
              <div className="flex items-center justify-center px-3 bg-[var(--bg-subtle)] text-[var(--text-muted)] text-sm shrink-0">→</div>

              {/* Panel 4: Predict */}
              <div className="flex-1 p-5 bg-[var(--bg-elevated)]">
                <p className="text-[10px] font-mono uppercase tracking-wider text-orange-600 dark:text-orange-400 mb-3 font-semibold">Predict</p>
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-[var(--text-muted)] font-mono">churn risk</span>
                    <span className="text-sm font-bold text-rose-600 dark:text-rose-400 font-mono">87%</span>
                  </div>
                  <div className="h-2 rounded-full bg-[var(--bg-subtle)] overflow-hidden">
                    <div className="h-full w-[87%] rounded-full bg-rose-500" />
                  </div>
                  <p className="text-[10px] text-rose-600 dark:text-rose-400 font-bold uppercase tracking-widest">HIGH RISK</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          THE DSM METHOD — 6-step mosaic
      ══════════════════════════════════════════════════════════ */}
      <Section id="method" className="py-24">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-12"
        >
          <SectionLabel>The DSM Method</SectionLabel>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
            You don&apos;t just read. You master.
          </h2>
          <p className="mt-4 text-[var(--text-secondary)] max-w-lg leading-relaxed">
            Every lesson follows a 6-step blueprint. Theory, diagrams, code, exercises,
            mastery gate — in that order, every time.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-px bg-[var(--border-color)] rounded-2xl overflow-hidden border border-[var(--border-color)]">
          {METHOD_STEPS.map((step, i) => (
            <motion.div
              key={step.num}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-30px" }}
              className="flex gap-5 p-6 bg-[var(--bg-elevated)] hover:bg-[var(--bg-subtle)] transition-colors"
            >
              <div className="shrink-0 w-12">
                <span className={cn("text-4xl font-bold tabular-nums leading-none", step.color)}>
                  {step.num}
                </span>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <h3 className="text-base font-semibold text-[var(--text-primary)]">{step.title}</h3>
                  <span className={cn(
                    "text-[9px] font-bold uppercase tracking-[0.14em] px-2 py-0.5 rounded-full border",
                    "bg-[var(--bg-subtle)] border-[var(--border-color)] text-[var(--text-muted)]",
                  )}>
                    {step.tag}
                  </span>
                </div>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ══════════════════════════════════════════════════════════
          PRODUCT SHOWCASE — Code workspace + AI Tutor conversation
      ══════════════════════════════════════════════════════════ */}
      <Section id="platform" className="py-24">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-12"
        >
          <SectionLabel>Built-in playground</SectionLabel>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
            Code without leaving the lesson.
          </h2>
          <p className="mt-4 text-[var(--text-secondary)] max-w-lg leading-relaxed">
            No Colab. No Replit. No setup. Write, run, and debug Python directly in DSM
            — with a tutor that knows exactly what you&apos;re learning.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-4">

          {/* Code editor (Python / violet domain) */}
          <motion.div
            variants={fadeUp}
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="rounded-2xl border border-violet-500/30 dark:border-violet-500/30 border-violet-200 overflow-hidden"
          >
            {/* Breadcrumb */}
            <div className="px-4 py-2.5 bg-[var(--bg-subtle)] border-b border-[var(--border-color)]">
              <p className="text-[10px] text-[var(--text-muted)] font-mono">
                Python Foundations → Lesson 2 · <span className="text-violet-600 dark:text-violet-400 font-semibold">Variables &amp; Data Types</span>
              </p>
            </div>

            {/* Editor chrome */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-violet-500/20 bg-[#0d1117]">
              <div className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-500/60" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500/60" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/60" />
              </div>
              <span className="ml-2 text-[11px] text-violet-300/70 font-mono">main.py</span>
              <span className="ml-auto text-[10px] px-2 py-0.5 rounded border border-violet-500/20 bg-violet-500/10 text-violet-400 font-medium">
                Python 3
              </span>
            </div>

            {/* Code */}
            <div className="p-5 font-mono text-sm leading-7 bg-[#0d1117]">
              <p className="text-[#6b7a99]"># Lesson 2 — Variables &amp; Data Types</p>
              <p className="mt-1">
                <span className="text-sky-300">name</span>
                <span className="text-[#c0c8d8]"> = </span>
                <span className="text-emerald-300">&quot;Alice&quot;</span>
              </p>
              <p>
                <span className="text-sky-300">age</span>
                <span className="text-[#c0c8d8]"> = </span>
                <span className="text-amber-300">21</span>
              </p>
              <p>
                <span className="text-violet-400">print</span>
                <span className="text-[#c0c8d8]">(</span>
                <span className="text-emerald-300">f&quot;Hello &#123;name&#125;, you are &#123;age&#125;!&quot;</span>
                <span className="text-[#c0c8d8]">)</span>
              </p>
            </div>

            {/* Output */}
            <div className="px-5 pb-4 bg-[#0d1117]">
              <div className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-elevated)] px-4 py-3">
                <p className="text-[10px] text-[var(--text-muted)] font-mono mb-1.5 uppercase tracking-widest">Output</p>
                <p className="text-sm font-mono text-[var(--text-secondary)]">Hello Alice, you are 21!</p>
                <div className="flex items-center gap-2 mt-3">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">All checks passed</span>
                  <span className="ml-auto text-xs font-mono text-amber-600 dark:text-amber-400">+10 XP</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="px-5 pb-5 flex gap-2 bg-[#0d1117]">
              <Button variant="primary" size="sm" className="gap-1.5">
                <Play className="h-3 w-3" />
                Run Code
              </Button>
              <Button variant="secondary" size="sm">Reset</Button>
              <Button variant="secondary" size="sm" className="gap-1.5">
                <Sparkles className="h-3 w-3 text-indigo-400" />
                AI Hint
              </Button>
            </div>
          </motion.div>

          {/* AI Tutor — real conversation demo (indigo domain) */}
          <motion.div
            variants={fadeUp}
            custom={1}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="rounded-2xl border border-indigo-200 dark:border-indigo-500/30 bg-indigo-50 dark:bg-indigo-500/5 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center gap-2.5 px-4 py-3 border-b border-indigo-200 dark:border-indigo-500/20 bg-indigo-100/60 dark:bg-indigo-500/8">
              <div className="h-6 w-6 rounded-full bg-indigo-200 dark:bg-indigo-500/20 flex items-center justify-center shrink-0">
                <Sparkles className="h-3 w-3 text-indigo-600 dark:text-indigo-400" />
              </div>
              <span className="text-sm font-semibold text-[var(--text-primary)]">DSM Tutor</span>
              <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-500/20 bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                context-aware
              </span>
            </div>

            {/* Context */}
            <div className="px-4 pt-4 pb-2">
              <div className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-elevated)] px-3.5 py-2.5">
                <p className="text-[10px] uppercase tracking-[0.12em] text-[var(--text-muted)] font-semibold mb-0.5">You&apos;re learning</p>
                <p className="text-sm font-semibold text-[var(--text-primary)]">Variables &amp; Data Types</p>
                <p className="text-xs text-[var(--text-secondary)]">Python · Foundations Module · Lesson 2</p>
              </div>
            </div>

            {/* Conversation */}
            <div className="px-4 pb-4 space-y-2.5">
              {/* Learner question */}
              <div className="flex justify-end">
                <div className="rounded-xl rounded-tr-sm bg-[var(--bg-elevated)] border border-[var(--border-color)] px-3 py-2.5 max-w-[85%]">
                  <p className="text-xs text-[var(--text-secondary)]">Why use <code className="text-indigo-600 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-500/10 px-1 rounded">f-strings</code> instead of just adding strings together?</p>
                </div>
              </div>

              {/* Tutor answer */}
              <div className="flex gap-2">
                <div className="h-5 w-5 rounded-full bg-indigo-200 dark:bg-indigo-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="h-2.5 w-2.5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="rounded-xl rounded-tl-sm bg-indigo-100 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 px-3 py-2.5 max-w-[85%]">
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    f-strings are faster to read and less error-prone. Compare:
                  </p>
                  <div className="mt-1.5 font-mono text-[11px] bg-[var(--bg-elevated)] rounded px-2.5 py-2 border border-[var(--border-color)]">
                    <p className="text-[#6b7a99]"># fragile: three pieces, easy to misplace</p>
                    <p className="text-[var(--text-secondary)]">&quot;Hi &quot; + name + &quot;!&quot;</p>
                    <p className="mt-1 text-[#6b7a99]"># clear: template with a slot</p>
                    <p><span className="text-emerald-600 dark:text-emerald-300">f&quot;Hi &#123;name&#125;!&quot;</span></p>
                  </div>
                </div>
              </div>

              {/* Follow-up suggestion */}
              <button
                className={cn(
                  "flex items-center gap-2 w-full text-left text-xs px-3 py-2 rounded-lg",
                  "border border-indigo-200 dark:border-indigo-500/20 bg-[var(--bg-elevated)]",
                  "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-indigo-300 dark:hover:border-indigo-500/40 transition-colors",
                )}
              >
                <MessageSquare className="h-3.5 w-3.5 text-indigo-500 dark:text-indigo-400 shrink-0" />
                What happens if the variable doesn&apos;t exist?
              </button>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* ══════════════════════════════════════════════════════════
          ONE PATH. ZERO GAPS. — Connected curriculum map + Projects
      ══════════════════════════════════════════════════════════ */}
      <Section id="curriculum" className="py-24">
        <div className="grid lg:grid-cols-2 gap-16">

          {/* ── Connected curriculum map ── */}
          <div>
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="mb-8"
            >
              <SectionLabel>Curriculum</SectionLabel>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[var(--text-primary)]">
                One path. Zero gaps.
              </h2>
              <p className="mt-3 text-sm text-[var(--text-secondary)] leading-relaxed max-w-sm">
                Every skill taught in the order it becomes useful — from spreadsheets to production ML.
                No guesswork, no random YouTube rabbit holes.
              </p>
            </motion.div>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <div className="overflow-x-auto pb-2">
                <div className="min-w-[440px] space-y-2">

                  {/* Row 1: Foundations → Machine Learning (left to right) */}
                  <div className="flex items-stretch gap-0">
                    {MAP_ROW1.map((s, i) => (
                      <React.Fragment key={s.num}>
                        <div className={cn("flex-1 rounded-xl border px-3 py-2.5 flex flex-col gap-0.5", s.cardCn)}>
                          <span className="text-[9px] font-mono text-[var(--text-muted)]">{s.num}</span>
                          <span className={cn("text-[11px] font-bold leading-tight", s.textCn)}>{s.label}</span>
                        </div>
                        {i < MAP_ROW1.length - 1 && (
                          <div className="flex items-center px-1 text-[var(--text-muted)] text-xs shrink-0">→</div>
                        )}
                      </React.Fragment>
                    ))}
                    {/* Turn arrow down on the right */}
                    <div className="flex items-end justify-center w-5 shrink-0 pb-2.5 text-[var(--text-muted)] text-xs">↓</div>
                  </div>

                  {/* Row 2: Career Ready ← SQL/DB (path continues from SQL on right to Career on left) */}
                  <div className="flex items-stretch gap-0">
                    {MAP_ROW2.map((s, i) => (
                      <React.Fragment key={s.num}>
                        <div className={cn("flex-1 rounded-xl border px-3 py-2.5 flex flex-col gap-0.5", s.cardCn)}>
                          <span className="text-[9px] font-mono text-[var(--text-muted)]">{s.num}</span>
                          <span className={cn("text-[11px] font-bold leading-tight", s.textCn)}>{s.label}</span>
                        </div>
                        {i < MAP_ROW2.length - 1 && (
                          <div className="flex items-center px-1 text-[var(--text-muted)] text-xs shrink-0">←</div>
                        )}
                      </React.Fragment>
                    ))}
                    {/* Align spacer with the turn arrow above */}
                    <div className="w-5 shrink-0" />
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="mt-8"
            >
              <Link href="/curriculum">
                <Button variant="secondary" size="md" className="gap-2">
                  Explore Full Roadmap
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* ── Projects ── */}
          <div>
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="mb-8"
            >
              <SectionLabel>Projects</SectionLabel>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[var(--text-primary)]">
                Build real things. Get hired.
              </h2>
              <p className="mt-3 text-sm text-[var(--text-secondary)] leading-relaxed max-w-sm">
                20+ portfolio-ready projects unlock as you complete each section.
                Not toy datasets — real industry scenarios.
              </p>
            </motion.div>

            <div className="space-y-2.5">
              {PROJECTS.map((project, i) => (
                <motion.div
                  key={project.title}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-20px" }}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-colors",
                    project.status === "available"
                      ? "border-emerald-200 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/8 hover:border-emerald-300 dark:hover:border-emerald-500/50"
                      : "border-[var(--border-color)] bg-[var(--bg-elevated)] opacity-60",
                  )}
                >
                  {project.status === "available" ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-500 shrink-0" />
                  ) : (
                    <Lock className="h-4 w-4 text-[var(--text-muted)] shrink-0" />
                  )}
                  <span className="flex-1 text-sm font-medium text-[var(--text-primary)]">
                    {project.title}
                  </span>
                  <span className={cn("text-[11px] font-medium shrink-0", project.trackColor)}>
                    {project.track}
                  </span>
                </motion.div>
              ))}
            </div>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="mt-7"
            >
              <Link href="/projects">
                <Button variant="secondary" size="md" className="gap-2">
                  View All Projects
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </Section>

      {/* ══════════════════════════════════════════════════════════
          FREE LEARNING — Editorial section
      ══════════════════════════════════════════════════════════ */}
      <section className="py-24 px-4 sm:px-6 bg-[var(--bg-elevated)]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-3xl"
          >
            <SectionLabel>Our belief</SectionLabel>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-[var(--text-primary)] leading-[1.05] mb-8">
              Data science education<br />
              should not be locked<br />
              behind a paywall.
            </h2>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-3 mb-10"
          >
            {FREE_ITEMS.map((item) => (
              <div key={item} className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span className="text-sm text-[var(--text-secondary)]">{item}</span>
              </div>
            ))}
          </motion.div>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-sm text-[var(--text-muted)]"
          >
            No Pro plan. No locked tiers. No credit card required. Just data science.
          </motion.p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          FINAL CTA — First lesson preview
      ══════════════════════════════════════════════════════════ */}
      <section className="relative py-28 px-4 sm:px-6 overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 60% 70% at 50% 100%, rgba(16,185,129,0.06) 0%, transparent 70%)",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(100,116,139,0.04) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center relative"
        >
          {/* Lesson preview card */}
          <div className="inline-flex flex-col items-center gap-3 p-5 mb-8 rounded-2xl border border-violet-200 dark:border-violet-500/30 bg-violet-50 dark:bg-violet-500/8">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-500 animate-pulse" />
              <span className="text-xs font-semibold text-violet-700 dark:text-violet-300">Lesson 1 is ready</span>
            </div>
            <p className="text-base font-bold text-[var(--text-primary)]">Variables &amp; Data Types</p>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[10px] text-[var(--text-muted)]">
              <span className="flex items-center gap-1"><Code2 className="h-3 w-3" /> Python Foundations</span>
              <span>25 min</span>
              <span>Beginner</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">+50 XP</span>
              <span className="flex items-center gap-1"><Terminal className="h-3 w-3" /> Built-in playground</span>
            </div>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[var(--text-primary)] mb-5">
            Your first lesson is ready.
          </h2>
          <p className="text-lg text-[var(--text-secondary)] mb-10 leading-relaxed">
            No setup. No account required. No paywall.
            Every lesson, every exercise, every project — free.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/course/python/foundations/variables-and-data-types">
              <Button size="lg" variant="primary" className="gap-2 h-12 px-7 text-base">
                Start Variables &amp; Data Types
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/curriculum">
              <Button size="lg" variant="secondary" className="h-12 px-7 text-base">
                Explore Curriculum
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-[var(--border-color)] py-10 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold tracking-tighter text-[var(--text-primary)]">DSM</span>
            <span className="text-xs text-[var(--text-muted)]">Data Science Mastery</span>
          </div>
          <nav className="flex items-center gap-6">
            {[
              { label: "Curriculum",    href: "/curriculum"    },
              { label: "Projects",      href: "/projects"      },
              { label: "Interview Prep",href: "/interview-prep"},
              { label: "Dashboard",     href: "/dashboard"     },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <p className="text-xs text-[var(--text-muted)]">Built for learners who mean business.</p>
        </div>
      </footer>
    </main>
  );
}
