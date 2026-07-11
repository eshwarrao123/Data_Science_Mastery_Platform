"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  RotateCcw,
  Eye,
  EyeOff,
  Lightbulb,
  CheckCircle2,
  XCircle,
  Loader2,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { InlineCoding } from "@/lib/types";
import { runCode } from "@/lib/mock-runtime";
import { cn } from "@/lib/utils";

const MonacoEditor = dynamic(
  () => import("@monaco-editor/react").then((m) => m.default),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-48 bg-[#1e1e1e]">
        <Loader2 className="h-5 w-5 text-[#858585] animate-spin" />
      </div>
    ),
  },
);

interface InlineEditorProps {
  coding: InlineCoding;
  onSolve?: () => void;
}

export function InlineEditor({ coding, onSolve }: InlineEditorProps) {
  const [code, setCode] = React.useState(coding.starterCode);
  const [running, setRunning] = React.useState(false);
  const [result, setResult] = React.useState<{
    stdout: string;
    stderr: string;
    durationMs: number;
    matchedExpected: boolean;
  } | null>(null);
  const [showSolution, setShowSolution] = React.useState(false);
  const [activeHint, setActiveHint] = React.useState<number | null>(null);
  const [solved, setSolved] = React.useState(false);

  const handleRun = async () => {
    setRunning(true);
    setResult(null);
    // Simulate async execution
    await new Promise((r) => setTimeout(r, 600 + Math.random() * 400));
    const res = runCode(code, coding.language, coding.solutionCode, coding.expectedOutput);
    setResult(res);
    setRunning(false);
    if (res.matchedExpected && !solved) {
      setSolved(true);
      onSolve?.();
    }
  };

  const handleReset = () => {
    setCode(coding.starterCode);
    setResult(null);
    setShowSolution(false);
    setActiveHint(null);
  };

  const handleReveal = () => {
    setShowSolution((v) => !v);
    if (!showSolution) setCode(coding.solutionCode);
    else setCode(coding.starterCode);
  };

  const langBadge: Record<string, string> = {
    python: "Python",
    sql: "SQL",
    r: "R",
    javascript: "JavaScript",
  };

  return (
    <div className="rounded-xl border border-[var(--border-color)] overflow-hidden bg-[#1e1e1e]">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#1e1e1e] border-b border-[#333]">
        <div className="flex items-center gap-3">
          {/* macOS dots decoration */}
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <div className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <div className="h-3 w-3 rounded-full bg-[#28c840]" />
          </div>
          <span className="text-xs text-[#858585] font-mono">{coding.filename}</span>
          <Badge className="text-[10px] px-1.5 py-0.5 bg-[#2d2d2d] border-[#444] text-[#858585]">
            {langBadge[coding.language] ?? coding.language}
          </Badge>
        </div>
        <div className="flex items-center gap-1.5">
          {/* Hints */}
          <div className="relative">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setActiveHint((v) => (v !== null ? null : 0))}
              aria-label="Show hints"
              className="text-[#858585] hover:text-[#ccc] h-7 px-2"
            >
              <Lightbulb className="h-3.5 w-3.5" />
              <span className="text-xs ml-1">Hints</span>
            </Button>
            <AnimatePresence>
              {activeHint !== null && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  className="absolute right-0 top-8 z-20 w-72 rounded-lg border border-[#333] bg-[#252526] p-3 shadow-xl"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-[#ccc]">
                      Hint {activeHint + 1} / {coding.hints.length}
                    </span>
                  </div>
                  <p className="text-xs text-[#a0a0a0] leading-relaxed">
                    {coding.hints[activeHint]}
                  </p>
                  <div className="flex gap-2 mt-3">
                    <button
                      className="text-[10px] text-[#858585] hover:text-[#ccc]"
                      onClick={() =>
                        setActiveHint((v) =>
                          v !== null ? Math.max(0, v - 1) : 0,
                        )
                      }
                      disabled={activeHint === 0}
                    >
                      Prev
                    </button>
                    <button
                      className="text-[10px] text-[#858585] hover:text-[#ccc]"
                      onClick={() =>
                        setActiveHint((v) =>
                          v !== null
                            ? Math.min(coding.hints.length - 1, v + 1)
                            : 0,
                        )
                      }
                      disabled={activeHint === coding.hints.length - 1}
                    >
                      Next
                    </button>
                    <button
                      className="text-[10px] text-[#858585] hover:text-[#ccc] ml-auto"
                      onClick={() => setActiveHint(null)}
                    >
                      Close
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Button
            size="sm"
            variant="ghost"
            onClick={handleReveal}
            aria-label={showSolution ? "Hide solution" : "Reveal solution"}
            className="text-[#858585] hover:text-[#ccc] h-7 px-2"
          >
            {showSolution ? (
              <EyeOff className="h-3.5 w-3.5" />
            ) : (
              <Eye className="h-3.5 w-3.5" />
            )}
            <span className="text-xs ml-1">Solution</span>
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={handleReset}
            aria-label="Reset code"
            className="text-[#858585] hover:text-[#ccc] h-7 px-2"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="text-xs ml-1">Reset</span>
          </Button>

          <Button
            size="sm"
            variant="success"
            onClick={handleRun}
            loading={running}
            aria-label="Run code"
            className="h-7 px-3 gap-1.5"
          >
            {!running && <Play className="h-3.5 w-3.5" />}
            <span className="text-xs">Run</span>
          </Button>
        </div>
      </div>

      {/* Instructions */}
      <div className="px-4 py-2.5 bg-[#252526] border-b border-[#333]">
        <p className="text-xs text-[#a0a0a0] leading-relaxed">{coding.instructions}</p>
      </div>

      {/* Monaco Editor */}
      <MonacoEditor
        height="280px"
        language={coding.language === "r" ? "r" : coding.language}
        value={code}
        onChange={(v) => setCode(v ?? "")}
        theme="vs-dark"
        options={{
          fontSize: 13,
          fontFamily: '"JetBrains Mono", "Fira Code", monospace',
          fontLigatures: true,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          lineNumbers: "on",
          renderLineHighlight: "line",
          bracketPairColorization: { enabled: true },
          padding: { top: 16, bottom: 16 },
          overviewRulerLanes: 0,
          hideCursorInOverviewRuler: true,
          wordWrap: "on",
          tabSize: 4,
        }}
        aria-label={`Code editor for ${coding.filename}`}
      />

      {/* Console output */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <div className="border-t border-[#333]">
              {/* Output split */}
              <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#333]">
                {/* Actual output */}
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    {result.stderr ? (
                      <XCircle className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                    ) : result.matchedExpected ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    ) : (
                      <ChevronRight className="h-3.5 w-3.5 text-[#858585] shrink-0" />
                    )}
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#858585]">
                      Output · {result.durationMs}ms
                    </span>
                  </div>
                  <pre
                    className={cn(
                      "text-xs font-mono whitespace-pre-wrap leading-relaxed",
                      result.stderr
                        ? "text-rose-400"
                        : result.matchedExpected
                        ? "text-emerald-400"
                        : "text-[#d4d4d4]",
                    )}
                  >
                    {result.stderr || result.stdout || "(no output)"}
                  </pre>
                </div>

                {/* Expected output */}
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#858585]">
                      Expected Output
                    </span>
                  </div>
                  <pre className="text-xs font-mono whitespace-pre-wrap leading-relaxed text-[#858585]">
                    {coding.expectedOutput}
                  </pre>
                </div>
              </div>

              {/* Match banner */}
              {result.matchedExpected && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="px-4 py-3 bg-emerald-500/10 border-t border-emerald-500/20 flex items-center gap-2"
                >
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span className="text-sm font-medium text-emerald-500">
                    Output matches. Exercise complete!
                  </span>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Solved ribbon */}
      {solved && !result && (
        <div className="px-4 py-2 bg-emerald-500/10 border-t border-emerald-500/20 flex items-center gap-2">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
          <span className="text-xs text-emerald-500">Solved</span>
        </div>
      )}
    </div>
  );
}
