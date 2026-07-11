"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Play, RotateCcw, Building2, Brain, Loader2 } from "lucide-react";
import dynamic from "next/dynamic";
import { Sidebar } from "@/components/layout/sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { interviewQuestions } from "@/lib/data/interview";
import { runCode } from "@/lib/mock-runtime";
import { cn } from "@/lib/utils";

const MonacoEditor = dynamic(
  () => import("@monaco-editor/react").then((m) => m.default),
  { ssr: false, loading: () => <div className="h-48 bg-[#1e1e1e] rounded" /> },
);

const COMPANIES = ["All", "Google", "Amazon", "Netflix", "Meta", "Uber"] as const;
const TOPICS = ["All", "SQL", "Pandas", "ML", "Statistics", "Python"] as const;
const DIFFS = ["All", "Easy", "Medium", "Hard"] as const;

type Co = (typeof COMPANIES)[number];
type To = (typeof TOPICS)[number];
type Di = (typeof DIFFS)[number];

const diffVariant: Record<string, "success" | "warning" | "error"> = {
  Easy: "success",
  Medium: "warning",
  Hard: "error",
};

function QuestionPanel({ question }: { question: (typeof interviewQuestions)[number] }) {
  const [code, setCode] = React.useState(question.starterCode);
  const [running, setRunning] = React.useState(false);
  const [result, setResult] = React.useState<{ stdout: string; stderr: string; matchedExpected: boolean } | null>(null);
  const [showSolution, setShowSolution] = React.useState(false);

  const run = async () => {
    setRunning(true);
    await new Promise((r) => setTimeout(r, 600 + Math.random() * 400));
    const res = runCode(code, question.language, question.solutionCode, question.expectedOutput);
    setResult(res);
    setRunning(false);
  };

  React.useEffect(() => {
    setCode(question.starterCode);
    setResult(null);
    setShowSolution(false);
  }, [question.id, question.starterCode]);

  return (
    <div className="flex flex-col gap-5">
      {/* Question */}
      <div className="p-5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-elevated)]">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Badge variant="default">
            <Building2 className="h-3 w-3" />
            {question.company}
          </Badge>
          <Badge variant="muted">{question.topic}</Badge>
          <Badge variant={diffVariant[question.difficulty]}>{question.difficulty}</Badge>
        </div>
        <h2 className="text-base font-semibold text-[var(--text-primary)] mb-2">{question.title}</h2>
        <p className="text-sm text-[var(--text-secondary)] whitespace-pre-line leading-relaxed">
          {question.question}
        </p>
      </div>

      {/* Editor */}
      <div className="rounded-xl border border-[var(--border-color)] overflow-hidden bg-[#1e1e1e]">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#333]">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="h-3 w-3 rounded-full bg-[#ff5f57]" />
              <div className="h-3 w-3 rounded-full bg-[#febc2e]" />
              <div className="h-3 w-3 rounded-full bg-[#28c840]" />
            </div>
            <Badge className="text-[10px] bg-[#2d2d2d] border-[#444] text-[#858585]">
              {question.language.toUpperCase()}
            </Badge>
          </div>
          <div className="flex items-center gap-1.5">
            <Button size="sm" variant="ghost" onClick={() => { setCode(question.starterCode); setResult(null); }} className="text-[#858585] h-7 px-2 text-xs">
              <RotateCcw className="h-3.5 w-3.5 mr-1" /> Reset
            </Button>
            <Button size="sm" variant="ghost" onClick={() => { setShowSolution((v) => !v); setCode(showSolution ? question.starterCode : question.solutionCode); }} className="text-[#858585] h-7 px-2 text-xs">
              {showSolution ? "Hide" : "Solution"}
            </Button>
            <Button size="sm" variant="success" onClick={run} loading={running} className="h-7 px-3 gap-1.5">
              {!running && <Play className="h-3.5 w-3.5" />}
              <span className="text-xs">Run</span>
            </Button>
          </div>
        </div>
        <MonacoEditor
          height="220px"
          language={question.language}
          value={code}
          onChange={(v) => setCode(v ?? "")}
          theme="vs-dark"
          options={{ fontSize: 12, fontFamily: '"JetBrains Mono", monospace', minimap: { enabled: false }, padding: { top: 12, bottom: 12 }, scrollBeyondLastLine: false, wordWrap: "on", tabSize: 4 }}
        />
        {result && (
          <div className="border-t border-[#333] grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#333]">
            <div className="p-3">
              <div className="text-[10px] text-[#858585] mb-1.5">Output</div>
              <pre className={cn("text-xs font-mono whitespace-pre-wrap", result.stderr ? "text-rose-400" : result.matchedExpected ? "text-emerald-400" : "text-[#d4d4d4]")}>
                {result.stderr || result.stdout}
              </pre>
            </div>
            <div className="p-3">
              <div className="text-[10px] text-[#858585] mb-1.5">Expected</div>
              <pre className="text-xs font-mono whitespace-pre-wrap text-[#858585]">{question.expectedOutput}</pre>
            </div>
          </div>
        )}
        {result?.matchedExpected && (
          <div className="px-4 py-2 bg-emerald-500/10 border-t border-emerald-500/20 flex items-center gap-2">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            <span className="text-xs text-emerald-500 font-medium">All test cases passed!</span>
          </div>
        )}
      </div>

      {/* Test cases */}
      <div className="flex flex-col gap-1.5">
        {question.testCases.map((tc, i) => (
          <div key={i} className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
            {result?.matchedExpected ? (
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
            ) : (
              <div className="h-3.5 w-3.5 rounded-full border border-[var(--border-color)] shrink-0" />
            )}
            <span className="font-medium text-[var(--text-secondary)]">{tc.name}:</span>
            {tc.description}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function InterviewPrepPage() {
  const [company, setCompany] = React.useState<Co>("All");
  const [topic, setTopic] = React.useState<To>("All");
  const [diff, setDiff] = React.useState<Di>("All");
  const [activeId, setActiveId] = React.useState(interviewQuestions[0].id);

  const filtered = interviewQuestions.filter(
    (q) =>
      (company === "All" || q.company === company) &&
      (topic === "All" || q.topic === topic) &&
      (diff === "All" || q.difficulty === diff),
  );

  const activeQuestion = filtered.find((q) => q.id === activeId) ?? filtered[0];

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 md:ml-64 px-4 md:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-2">
            Interview Prep
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--text-primary)] mb-3">
            Real Interview Questions
          </h1>
          <p className="text-[var(--text-secondary)] text-sm max-w-xl">
            SQL, Python, Pandas, ML, and Statistics questions from top tech companies. Solve them directly in the browser.
          </p>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          {([["Company", COMPANIES, company, setCompany], ["Topic", TOPICS, topic, setTopic], ["Difficulty", DIFFS, diff, setDiff]] as const).map(([label, opts, val, setter]) => (
            <div key={label as string}>
              <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-1">{label as string}</div>
              <div className="flex flex-wrap gap-1">
                {(opts as readonly string[]).map((opt) => (
                  <button
                    key={opt}
                    onClick={() => (setter as (v: string) => void)(opt)}
                    className={cn(
                      "px-2.5 py-1 rounded-lg text-xs transition-colors focus-ring",
                      val === opt
                        ? "bg-[var(--text-primary)] text-[var(--bg-base)] font-medium"
                        : "bg-[var(--bg-subtle)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-primary)]",
                    )}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-[300px_1fr] gap-6">
          {/* Question list */}
          <div className="flex flex-col gap-1.5">
            {filtered.length === 0 ? (
              <div className="py-8 text-center text-sm text-[var(--text-muted)]">No questions match.</div>
            ) : (
              filtered.map((q) => (
                <button
                  key={q.id}
                  onClick={() => setActiveId(q.id)}
                  className={cn(
                    "flex flex-col gap-1 p-3 rounded-lg border text-left transition-colors focus-ring",
                    activeId === q.id
                      ? "border-[var(--text-muted)] bg-[var(--bg-subtle)]"
                      : "border-[var(--border-color)] bg-[var(--bg-elevated)] hover:bg-[var(--bg-subtle)]",
                  )}
                >
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Badge variant="muted" className="text-[9px] px-1.5">{q.company}</Badge>
                    <Badge variant={diffVariant[q.difficulty]} className="text-[9px] px-1.5">{q.difficulty}</Badge>
                  </div>
                  <span className="text-xs font-medium text-[var(--text-primary)] line-clamp-2">{q.title}</span>
                </button>
              ))
            )}
          </div>

          {/* Active question */}
          <div>
            {activeQuestion ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeQuestion.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  <QuestionPanel question={activeQuestion} />
                </motion.div>
              </AnimatePresence>
            ) : (
              <div className="py-16 text-center text-[var(--text-muted)]">Select a question.</div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
