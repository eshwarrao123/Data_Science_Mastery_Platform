"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, RotateCcw, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { WorkedExample } from "@/lib/types";
import { cn } from "@/lib/utils";

interface WorkedExamplesProps {
  examples: WorkedExample[];
}

const difficultyVariant: Record<WorkedExample["difficulty"], "default" | "success" | "warning" | "error" | "muted"> = {
  "Very Easy": "success",
  Easy: "success",
  Medium: "warning",
  Hard: "error",
  "Industry Example": "default",
};

function SingleExample({ example }: { example: WorkedExample }) {
  const [step, setStep] = React.useState(0);
  const currentStep = example.steps[step];
  const isLast = step === example.steps.length - 1;

  const reset = () => setStep(0);

  // Build code reveal: show lines up to and including current step
  const codeLines = example.steps.flatMap((s) => s.code.split("\n"));
  const revealedLines: { line: string; stepIdx: number }[] = [];
  let lineCounter = 0;
  for (let si = 0; si <= step; si++) {
    const lines = example.steps[si].code.split("\n");
    for (const line of lines) {
      revealedLines.push({ line, stepIdx: si });
      lineCounter++;
    }
  }

  return (
    <div className="rounded-xl border border-[var(--border-color)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 bg-[var(--bg-subtle)] border-b border-[var(--border-color)]">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant={difficultyVariant[example.difficulty]}>
              {example.difficulty}
            </Badge>
            <span className="text-sm font-semibold text-[var(--text-primary)]">
              {example.title}
            </span>
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">{example.scenario}</p>
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={reset}
          aria-label="Restart example"
          className="gap-1.5 text-[var(--text-muted)]"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Restart
        </Button>
      </div>

      {/* Split body */}
      <div className="grid md:grid-cols-2 min-h-[220px]">
        {/* Left — explanation */}
        <div className="p-5 border-b md:border-b-0 md:border-r border-[var(--border-color)] flex flex-col justify-between gap-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                  Step {step + 1} of {example.steps.length}
                </span>
              </div>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                {currentStep.explanation}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center gap-2">
            {example.steps.map((_, i) => (
              <button
                key={i}
                onClick={() => setStep(i)}
                aria-label={`Go to step ${i + 1}`}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-200",
                  i === step
                    ? "w-6 bg-emerald-500"
                    : i < step
                    ? "w-2 bg-emerald-500/40"
                    : "w-2 bg-[var(--border-color)]",
                )}
              />
            ))}
          </div>

          <Button
            onClick={() => !isLast && setStep((s) => s + 1)}
            disabled={isLast}
            variant="primary"
            size="sm"
            className="gap-1.5 self-start"
          >
            {isLast ? "Complete ✓" : "Next Step"}
            {!isLast && <ChevronRight className="h-3.5 w-3.5" />}
          </Button>
        </div>

        {/* Right — code */}
        <div className="bg-[#1e1e1e] p-4 font-mono text-xs leading-6 overflow-x-auto">
          <div className="flex items-center gap-2 mb-3">
            <Terminal className="h-3.5 w-3.5 text-[#858585]" />
            <span className="text-[#858585] text-[10px] uppercase tracking-wider">Code</span>
          </div>
          <div className="relative">
            {revealedLines.map((entry, i) => (
              <motion.div
                key={`${entry.stepIdx}-${i}`}
                initial={entry.stepIdx === step && i >= revealedLines.length - currentStep.code.split("\n").length ? { opacity: 0, backgroundColor: "rgba(16,185,129,0.15)" } : false}
                animate={{ opacity: 1, backgroundColor: "rgba(16,185,129,0)" }}
                transition={{ duration: 0.4, delay: (i % currentStep.code.split("\n").length) * 0.04 }}
                className={cn(
                  "px-2 rounded-sm",
                  entry.stepIdx === step
                    ? "text-[#d4d4d4]"
                    : "text-[#6a6a6a]",
                )}
              >
                <span className="select-none mr-4 text-[#4a4a4a] tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {entry.line || " "}
              </motion.div>
            ))}
          </div>

          {/* Output (shown when on last step and output exists) */}
          {isLast && example.output && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ delay: 0.3 }}
              className="mt-3 pt-3 border-t border-[#333]"
            >
              <div className="text-[10px] text-[#858585] mb-1">Output</div>
              <pre className="text-emerald-400 whitespace-pre-wrap">{example.output}</pre>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

export function WorkedExamples({ examples }: WorkedExamplesProps) {
  const [activeIdx, setActiveIdx] = React.useState(0);

  return (
    <div className="flex flex-col gap-4">
      {/* Example selector tabs */}
      <div className="flex flex-wrap gap-2">
        {examples.map((ex, i) => (
          <button
            key={i}
            onClick={() => setActiveIdx(i)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors focus-ring",
              activeIdx === i
                ? "bg-[var(--text-primary)] text-[var(--bg-base)]"
                : "bg-[var(--bg-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-[var(--border-color)]",
            )}
          >
            {ex.difficulty}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeIdx}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <SingleExample example={examples[activeIdx]} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
