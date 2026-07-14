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
  ChevronDown,
  ChevronUp,
  Minus,
  Square,
  Terminal,
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
  /** Workspace mode: fills container height, resizable output panel, no internal instructions */
  workspaceMode?: boolean;
  /** When true, suppress the instructions block (left panel shows them instead) */
  hideInstructions?: boolean;
}

export function InlineEditor({
  coding,
  onSolve,
  workspaceMode = false,
  hideInstructions = false,
}: InlineEditorProps) {
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

  /* Workspace-mode output panel size */
  const [wsOutputH, setWsOutputH] = React.useState(160);
  const [wsOutputCollapsed, setWsOutputCollapsed] = React.useState(false);
  const outputDragging = React.useRef(false);
  const outputStartY = React.useRef(0);
  const outputStartH = React.useRef(0);

  const handleOutputDragStart = React.useCallback(
    (e: React.MouseEvent) => {
      outputDragging.current = true;
      outputStartY.current = e.clientY;
      outputStartH.current = wsOutputH;
      e.preventDefault();

      const onMove = (e: MouseEvent) => {
        if (!outputDragging.current) return;
        const delta = outputStartY.current - e.clientY;
        setWsOutputH(Math.max(56, Math.min(380, outputStartH.current + delta)));
        setWsOutputCollapsed(false);
      };
      const onUp = () => {
        outputDragging.current = false;
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", onUp);
      };
      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
    },
    [wsOutputH],
  );

  const handleRun = async () => {
    setRunning(true);
    setResult(null);
    setWsOutputCollapsed(false);
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

  /* Run status for display */
  type RunStatus = "idle" | "running" | "success" | "error" | "mismatch";
  const runStatus: RunStatus = running
    ? "running"
    : result
    ? result.stderr
      ? "error"
      : result.matchedExpected
      ? "success"
      : "mismatch"
    : "idle";

  const statusConfig = {
    idle:     { dot: "bg-[#858585]", label: "Ready",   labelCn: "text-[#858585]" },
    running:  { dot: "bg-amber-400 animate-pulse", label: "Running…", labelCn: "text-amber-400" },
    success:  { dot: "bg-emerald-500", label: "Checks passed", labelCn: "text-emerald-400" },
    error:    { dot: "bg-rose-500", label: "Error", labelCn: "text-rose-400" },
    mismatch: { dot: "bg-amber-500", label: "Output differs", labelCn: "text-amber-400" },
  };
  const sc = statusConfig[runStatus];

  /* Workspace layout uses flex-col to fill parent height */
  if (workspaceMode) {
    return (
      <div className="flex flex-col h-full bg-[#1e1e1e] overflow-hidden">
        {/* ── Toolbar ── */}
        <div className="flex items-center justify-between px-3 py-2 bg-[#1e1e1e] border-b border-[#333] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="flex gap-1.5">
              <div className="h-3 w-3 rounded-full bg-[#ff5f57]" />
              <div className="h-3 w-3 rounded-full bg-[#febc2e]" />
              <div className="h-3 w-3 rounded-full bg-[#28c840]" />
            </div>
            <span className="text-xs text-[#858585] font-mono">{coding.filename}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded border border-[#444] bg-[#2d2d2d] text-[#858585]">
              {langBadge[coding.language] ?? coding.language}
            </span>
          </div>

          {/* Status indicator */}
          <div className="flex items-center gap-1.5">
            <span className={cn("h-2 w-2 rounded-full shrink-0", sc.dot)} />
            <span className={cn("text-[10px] font-medium", sc.labelCn)}>{sc.label}</span>
          </div>

          <div className="flex items-center gap-1">
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
                <span className="text-xs ml-1">Hint</span>
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
                        onClick={() => setActiveHint((v) => (v !== null ? Math.max(0, v - 1) : 0))}
                        disabled={activeHint === 0}
                      >
                        ← Prev
                      </button>
                      <button
                        className="text-[10px] text-[#858585] hover:text-[#ccc]"
                        onClick={() =>
                          setActiveHint((v) =>
                            v !== null ? Math.min(coding.hints.length - 1, v + 1) : 0,
                          )
                        }
                        disabled={activeHint === coding.hints.length - 1}
                      >
                        Next →
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
              className="h-7 px-3 gap-1.5 ml-1"
            >
              {!running && <Play className="h-3.5 w-3.5" />}
              <span className="text-xs">Run</span>
            </Button>
          </div>
        </div>

        {/* ── Monaco Editor (flex-1, fills remaining space) ── */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <MonacoEditor
            height="100%"
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
        </div>

        {/* ── Output panel (resizable, collapsible) ── */}
        <div className="shrink-0 flex flex-col border-t border-[#333]" style={{ height: wsOutputCollapsed ? 32 : wsOutputH }}>
          {/* Output drag handle + header */}
          <div
            className={cn(
              "flex items-center justify-between px-3 h-8 bg-[#252526] border-b border-[#333] shrink-0",
              !wsOutputCollapsed && "cursor-ns-resize",
            )}
            onMouseDown={!wsOutputCollapsed ? handleOutputDragStart : undefined}
          >
            <div className="flex items-center gap-2">
              <Terminal className="h-3 w-3 text-[#858585]" />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#858585]">
                Output
              </span>
              {result && (
                <span className={cn("text-[10px] font-medium", sc.labelCn)}>
                  · {sc.label}
                  {result && ` · ${result.durationMs}ms`}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setWsOutputCollapsed((v) => !v)}
                className="text-[#858585] hover:text-[#ccc] p-0.5 focus-ring rounded"
                aria-label={wsOutputCollapsed ? "Expand output" : "Collapse output"}
              >
                {wsOutputCollapsed ? (
                  <ChevronUp className="h-3 w-3" />
                ) : (
                  <Minus className="h-3 w-3" />
                )}
              </button>
              <button
                onClick={() => {
                  setWsOutputH(260);
                  setWsOutputCollapsed(false);
                }}
                className="text-[#858585] hover:text-[#ccc] p-0.5 focus-ring rounded"
                aria-label="Expand output panel"
              >
                <Square className="h-2.5 w-2.5" />
              </button>
            </div>
          </div>

          {/* Output content */}
          {!wsOutputCollapsed && (
            <div className="flex-1 min-h-0 overflow-y-auto">
              {!result && !running && (
                <p className="px-4 py-3 text-xs text-[#858585] italic">
                  Run your code to see the output here.
                </p>
              )}
              {running && (
                <div className="flex items-center gap-2 px-4 py-3">
                  <Loader2 className="h-3.5 w-3.5 text-amber-400 animate-spin" />
                  <span className="text-xs text-amber-400">Executing…</span>
                </div>
              )}
              {result && (
                <div className="flex flex-col divide-y divide-[#333]">
                  {/* Actual output */}
                  <div className="px-4 py-3">
                    <div className="flex items-center gap-2 mb-1.5">
                      {result.stderr ? (
                        <XCircle className="h-3 w-3 text-rose-500 shrink-0" />
                      ) : result.matchedExpected ? (
                        <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
                      ) : (
                        <ChevronRight className="h-3 w-3 text-[#858585] shrink-0" />
                      )}
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-[#858585]">
                        Your output
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
                  <div className="px-4 py-3">
                    <div className="mb-1.5">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-[#858585]">
                        Expected
                      </span>
                    </div>
                    <pre className="text-xs font-mono whitespace-pre-wrap leading-relaxed text-[#6a9955]">
                      {coding.expectedOutput}
                    </pre>
                  </div>

                  {/* Match banner */}
                  {result.matchedExpected && (
                    <div className="px-4 py-2.5 bg-emerald-500/10 flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      <span className="text-xs font-semibold text-emerald-400">
                        Output matches — exercise complete!
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ── Compact / embedded mode (original behaviour) ── */
  return (
    <div className="rounded-xl border border-[var(--border-color)] overflow-hidden bg-[#1e1e1e]">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#1e1e1e] border-b border-[#333]">
        <div className="flex items-center gap-3">
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
                        setActiveHint((v) => (v !== null ? Math.max(0, v - 1) : 0))
                      }
                      disabled={activeHint === 0}
                    >
                      Prev
                    </button>
                    <button
                      className="text-[10px] text-[#858585] hover:text-[#ccc]"
                      onClick={() =>
                        setActiveHint((v) =>
                          v !== null ? Math.min(coding.hints.length - 1, v + 1) : 0,
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
            {showSolution ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
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
      {!hideInstructions && (
        <div className="px-4 py-2.5 bg-[#252526] border-b border-[#333]">
          <p className="text-xs text-[#a0a0a0] leading-relaxed">{coding.instructions}</p>
        </div>
      )}

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
              <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#333]">
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

      {solved && !result && (
        <div className="px-4 py-2 bg-emerald-500/10 border-t border-emerald-500/20 flex items-center gap-2">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
          <span className="text-xs text-emerald-500">Solved</span>
        </div>
      )}
    </div>
  );
}
