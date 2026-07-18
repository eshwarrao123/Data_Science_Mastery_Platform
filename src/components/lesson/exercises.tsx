"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, HelpCircle, Lock } from "lucide-react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Exercise } from "@/lib/types";
import { runCode } from "@/lib/mock-runtime";
import { cn } from "@/lib/utils";

const MonacoEditor = dynamic(
  () => import("@monaco-editor/react").then((m) => m.default),
  { ssr: false, loading: () => <div className="h-40 bg-[#1e1e1e] rounded-lg" /> },
);

/* ------------------------------------------------------------------ */
/*  MCQ                                                                 */
/* ------------------------------------------------------------------ */
function McqExercise({
  exercise,
  onAnswer,
}: {
  exercise: Extract<Exercise, { type: "mcq" }>;
  onAnswer: (correct: boolean) => void;
}) {
  const [selected, setSelected] = React.useState<number | null>(null);
  const answered = selected !== null;
  const correct = selected === exercise.correctIndex;

  const handle = (i: number) => {
    if (answered) return;
    setSelected(i);
    onAnswer(i === exercise.correctIndex);
  };

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-[var(--text-primary)] font-medium leading-relaxed">
        {exercise.question}
      </p>
      <div className="flex flex-col gap-2">
        {exercise.options.map((opt, i) => {
          const isSelected = selected === i;
          const isCorrect = i === exercise.correctIndex;
          const showResult = answered;

          return (
            <motion.button
              key={i}
              onClick={() => handle(i)}
              whileTap={answered ? {} : { scale: 0.99 }}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg border text-left text-sm transition-colors focus-ring",
                !answered &&
                  "border-[var(--border-color)] hover:border-[var(--text-muted)] bg-[var(--bg-elevated)]",
                showResult && isCorrect &&
                  "border-emerald-500 bg-emerald-500/10 text-emerald-500",
                showResult && isSelected && !isCorrect &&
                  "border-rose-500 bg-rose-500/10 text-rose-500",
                showResult && !isSelected && !isCorrect &&
                  "border-[var(--border-color)] bg-[var(--bg-elevated)] opacity-50",
              )}
              disabled={answered}
              aria-pressed={isSelected}
            >
              <span
                className={cn(
                  "h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 text-[10px] font-bold",
                  !answered && "border-[var(--border-color)]",
                  showResult && isCorrect && "border-emerald-500",
                  showResult && isSelected && !isCorrect && "border-rose-500",
                )}
              >
                {String.fromCharCode(65 + i)}
              </span>
              <span className="flex-1">{opt}</span>
              {showResult && isCorrect && (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
              )}
              {showResult && isSelected && !isCorrect && (
                <XCircle className="h-4 w-4 shrink-0 text-rose-500" />
              )}
            </motion.button>
          );
        })}
      </div>
      <AnimatePresence>
        {answered && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "flex gap-3 p-4 rounded-lg text-sm",
              correct
                ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-500"
                : "bg-rose-500/10 border border-rose-500/20 text-rose-500",
            )}
          >
            {correct ? (
              <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
            ) : (
              <HelpCircle className="h-4 w-4 shrink-0 mt-0.5" />
            )}
            <div>
              <div className="font-semibold mb-0.5">{correct ? "Correct!" : "Not quite."}</div>
              <div className="text-[0.8rem] leading-relaxed opacity-90">{exercise.explanation}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Scenario MCQ                                                        */
/* ------------------------------------------------------------------ */
function ScenarioExercise({
  exercise,
  onAnswer,
}: {
  exercise: Extract<Exercise, { type: "scenario" }>;
  onAnswer: (correct: boolean) => void;
}) {
  const [selected, setSelected] = React.useState<number | null>(null);
  const answered = selected !== null;
  const correct = selected === exercise.correctIndex;

  const handle = (i: number) => {
    if (answered) return;
    setSelected(i);
    onAnswer(i === exercise.correctIndex);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="p-4 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-color)] text-sm text-[var(--text-secondary)] leading-relaxed">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)] block mb-1.5">
          Scenario
        </span>
        {exercise.scenario}
      </div>
      <p className="text-sm font-medium text-[var(--text-primary)]">{exercise.question}</p>
      <div className="flex flex-col gap-2">
        {exercise.options.map((opt, i) => {
          const isCorrect = i === exercise.correctIndex;
          const isSelected = selected === i;
          return (
            <button
              key={i}
              onClick={() => handle(i)}
              disabled={answered}
              className={cn(
                "flex items-start gap-3 px-4 py-3 rounded-lg border text-left text-sm transition-colors focus-ring",
                !answered && "border-[var(--border-color)] hover:border-[var(--text-muted)] bg-[var(--bg-elevated)]",
                answered && isCorrect && "border-emerald-500 bg-emerald-500/10 text-emerald-500",
                answered && isSelected && !isCorrect && "border-rose-500 bg-rose-500/10 text-rose-500",
                answered && !isSelected && !isCorrect && "border-[var(--border-color)] opacity-40",
              )}
            >
              <span className="font-bold shrink-0 text-xs mt-0.5">
                {String.fromCharCode(65 + i)}.
              </span>
              {opt}
            </button>
          );
        })}
      </div>
      {answered && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "p-4 rounded-lg text-sm",
            correct ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-600",
          )}
        >
          <div className="font-semibold mb-1">{correct ? "Excellent thinking." : "Good attempt."}</div>
          <div className="text-[0.8rem] leading-relaxed opacity-90">{exercise.explanation}</div>
        </motion.div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Coding Exercise                                                     */
/* ------------------------------------------------------------------ */
function CodingExercise({
  exercise,
  onAnswer,
}: {
  exercise: Extract<Exercise, { type: "coding" }>;
  onAnswer: (correct: boolean) => void;
}) {
  const [code, setCode] = React.useState(exercise.starterCode);
  const [running, setRunning] = React.useState(false);
  const [result, setResult] = React.useState<{ stdout: string; stderr: string; matchedExpected: boolean } | null>(null);

  const run = async () => {
    setRunning(true);
    await new Promise((r) => setTimeout(r, 500 + Math.random() * 400));
    const res = runCode(code, "python", exercise.solutionCode, exercise.expectedOutput);
    setResult(res);
    setRunning(false);
    if (res.matchedExpected) onAnswer(true);
  };

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-[var(--text-primary)] leading-relaxed">{exercise.prompt}</p>
      <div className="rounded-xl border border-[var(--border-color)] overflow-hidden">
        <MonacoEditor
          height="160px"
          language="python"
          value={code}
          onChange={(v) => setCode(v ?? "")}
          theme="vs-dark"
          options={{
            fontSize: 12,
            fontFamily: '"JetBrains Mono", monospace',
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            lineNumbers: "on",
            padding: { top: 12, bottom: 12 },
            wordWrap: "on",
            tabSize: 4,
          }}
        />
        <div className="flex items-center gap-2 px-3 py-2 bg-[#1e1e1e] border-t border-[#333]">
          <Button size="sm" variant="success" onClick={run} loading={running} className="gap-1.5">
            Run Code
          </Button>
          <Button size="sm" variant="ghost" onClick={() => { setCode(exercise.starterCode); setResult(null); }} className="text-[#858585]">
            Reset
          </Button>
        </div>
      </div>
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "p-3 rounded-lg border text-xs font-mono",
            result.stderr ? "border-rose-500/30 bg-rose-500/5 text-rose-600 dark:text-rose-400" :
            result.matchedExpected ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400" :
            "border-[var(--border-color)] bg-[#1e1e1e] text-[#d4d4d4]",
          )}
        >
          <pre className="whitespace-pre-wrap">{result.stderr || result.stdout}</pre>
          {result.matchedExpected && (
            <div className="flex items-center gap-1 mt-2 text-emerald-500 not-italic font-sans">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Tests passed
            </div>
          )}
        </motion.div>
      )}
      {/* Test cases */}
      <div className="flex flex-col gap-1.5">
        {exercise.tests.map((t, i) => (
          <div key={i} className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
            {result?.matchedExpected ? (
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
            ) : (
              <div className="h-3.5 w-3.5 rounded-full border border-[var(--border-color)] shrink-0" />
            )}
            <span className="font-medium text-[var(--text-secondary)]">{t.name}:</span>
            <span>{t.description}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Exercises Container                                                 */
/* ------------------------------------------------------------------ */
interface ExercisesProps {
  exercises: Exercise[];
  onMasteryChange: (pct: number) => void;
}

const difficultyOrder = ["Easy", "Medium", "Hard", "Challenge"];

export function Exercises({ exercises, onMasteryChange }: ExercisesProps) {
  const [answers, setAnswers] = React.useState<Record<string, boolean>>({});

  const grouped = React.useMemo(() => {
    const map: Record<string, Exercise[]> = {};
    for (const ex of exercises) {
      const key = ex.difficulty;
      (map[key] ??= []).push(ex);
    }
    return map;
  }, [exercises]);

  const orderedGroups = Object.entries(grouped).sort(
    ([a], [b]) =>
      (difficultyOrder.indexOf(a) === -1 ? 99 : difficultyOrder.indexOf(a)) -
      (difficultyOrder.indexOf(b) === -1 ? 99 : difficultyOrder.indexOf(b)),
  );

  const handleAnswer = (id: string, correct: boolean) => {
    setAnswers((prev) => {
      const next = { ...prev, [id]: prev[id] ? true : correct }; // keep correct if already correct
      const pct = (Object.values(next).filter(Boolean).length / exercises.length) * 100;
      onMasteryChange(pct);
      return next;
    });
  };

  const masteryPct = exercises.length
    ? (Object.values(answers).filter(Boolean).length / exercises.length) * 100
    : 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Mastery progress bar */}
      <div className="flex items-center gap-3 p-4 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)]">
        <div className="flex-1">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-[var(--text-muted)]">Mastery Gate</span>
            <span
              className={cn(
                "font-semibold",
                masteryPct >= 80 ? "text-emerald-500" : "text-[var(--text-secondary)]",
              )}
            >
              {Math.round(masteryPct)}% / 80% required
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-[var(--border-color)]">
            <motion.div
              className={cn(
                "h-1.5 rounded-full transition-colors",
                masteryPct >= 80 ? "bg-emerald-500" : "bg-amber-500",
              )}
              animate={{ width: `${Math.min(100, masteryPct)}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
        {masteryPct < 80 ? (
          <Lock className="h-4 w-4 text-[var(--text-muted)] shrink-0" aria-label="Mastery gate locked" />
        ) : (
          <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" aria-label="Mastery gate unlocked" />
        )}
      </div>

      {orderedGroups.map(([difficulty, exList]) => (
        <div key={difficulty}>
          <div className="flex items-center gap-2 mb-3">
            <Badge
              variant={
                difficulty === "Easy" ? "success" :
                difficulty === "Medium" ? "warning" :
                difficulty === "Hard" ? "error" : "default"
              }
            >
              {difficulty}
            </Badge>
            <span className="text-xs text-[var(--text-muted)]">
              {exList.filter((e) => answers[e.id]).length}/{exList.length} solved
            </span>
          </div>
          <div className="flex flex-col gap-6">
            {exList.map((ex) => (
              <div
                key={ex.id}
                className={cn(
                  "p-5 rounded-xl border transition-colors",
                  answers[ex.id]
                    ? "border-emerald-500/30 bg-emerald-500/5"
                    : "border-[var(--border-color)] bg-[var(--bg-elevated)]",
                )}
              >
                {ex.type === "mcq" && (
                  <McqExercise
                    exercise={ex}
                    onAnswer={(c) => handleAnswer(ex.id, c)}
                  />
                )}
                {ex.type === "scenario" && (
                  <ScenarioExercise
                    exercise={ex}
                    onAnswer={(c) => handleAnswer(ex.id, c)}
                  />
                )}
                {ex.type === "coding" && (
                  <CodingExercise
                    exercise={ex}
                    onAnswer={(c) => handleAnswer(ex.id, c)}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
