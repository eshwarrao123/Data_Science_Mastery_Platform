"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import type { LessonVisual, DiagramNode } from "@/lib/types";
import { cn } from "@/lib/utils";

/* ── Per-type visual identity ───────────────────────────────────────── */

interface TypePalette {
  bg: string;
  border: string;
  labelCn: string;
  valueCn: string;
  selectedBorder: string;
  tagline: string;
  codeExample: string;
}

const TYPE_PALETTE: Record<string, TypePalette> = {
  int: {
    bg: "bg-violet-50 dark:bg-violet-500/8",
    border: "border-violet-200 dark:border-violet-500/25",
    labelCn: "text-violet-700 dark:text-violet-400",
    valueCn: "text-violet-600 dark:text-violet-300",
    selectedBorder: "border-violet-400 dark:border-violet-400",
    tagline: "Whole numbers",
    codeExample: "age = 35",
  },
  float: {
    bg: "bg-emerald-50 dark:bg-emerald-500/8",
    border: "border-emerald-200 dark:border-emerald-500/25",
    labelCn: "text-emerald-700 dark:text-emerald-400",
    valueCn: "text-emerald-600 dark:text-emerald-300",
    selectedBorder: "border-emerald-400 dark:border-emerald-400",
    tagline: "Decimal values",
    codeExample: "price = 3.99",
  },
  str: {
    bg: "bg-amber-50 dark:bg-amber-500/8",
    border: "border-amber-200 dark:border-amber-500/25",
    labelCn: "text-amber-700 dark:text-amber-400",
    valueCn: "text-amber-600 dark:text-amber-300",
    selectedBorder: "border-amber-400 dark:border-amber-400",
    tagline: "Text values",
    codeExample: 'name = "Alice"',
  },
  bool: {
    bg: "bg-sky-50 dark:bg-sky-500/8",
    border: "border-sky-200 dark:border-sky-500/25",
    labelCn: "text-sky-700 dark:text-sky-400",
    valueCn: "text-sky-600 dark:text-sky-300",
    selectedBorder: "border-sky-400 dark:border-sky-400",
    tagline: "Logical state",
    codeExample: "active = True",
  },
  none: {
    bg: "bg-[var(--bg-subtle)]",
    border: "border-[var(--border-color)]",
    labelCn: "text-[var(--text-muted)]",
    valueCn: "text-[var(--text-muted)]",
    selectedBorder: "border-[var(--border-color-strong)]",
    tagline: "Absence of value",
    codeExample: "result = None",
  },
};

/* Fallback palette for nodes with unrecognized ids */
const FALLBACK_PALETTES: TypePalette[] = [
  {
    bg: "bg-violet-50 dark:bg-violet-500/8",
    border: "border-violet-200 dark:border-violet-500/25",
    labelCn: "text-violet-700 dark:text-violet-400",
    valueCn: "text-violet-600 dark:text-violet-300",
    selectedBorder: "border-violet-400 dark:border-violet-400",
    tagline: "",
    codeExample: "",
  },
  {
    bg: "bg-emerald-50 dark:bg-emerald-500/8",
    border: "border-emerald-200 dark:border-emerald-500/25",
    labelCn: "text-emerald-700 dark:text-emerald-400",
    valueCn: "text-emerald-600 dark:text-emerald-300",
    selectedBorder: "border-emerald-400 dark:border-emerald-400",
    tagline: "",
    codeExample: "",
  },
  {
    bg: "bg-amber-50 dark:bg-amber-500/8",
    border: "border-amber-200 dark:border-amber-500/25",
    labelCn: "text-amber-700 dark:text-amber-400",
    valueCn: "text-amber-600 dark:text-amber-300",
    selectedBorder: "border-amber-400 dark:border-amber-400",
    tagline: "",
    codeExample: "",
  },
  {
    bg: "bg-sky-50 dark:bg-sky-500/8",
    border: "border-sky-200 dark:border-sky-500/25",
    labelCn: "text-sky-700 dark:text-sky-400",
    valueCn: "text-sky-600 dark:text-sky-300",
    selectedBorder: "border-sky-400 dark:border-sky-400",
    tagline: "",
    codeExample: "",
  },
];

function getPalette(id: string, idx: number): TypePalette {
  return TYPE_PALETTE[id] ?? FALLBACK_PALETTES[idx % FALLBACK_PALETTES.length];
}

/* ── TypeExplorer — card grid for "comparison" kind visuals ─────────── */

function TypeExplorer({ visual }: { visual: LessonVisual }) {
  const [selected, setSelected] = React.useState<string | null>(null);
  const selectedNode = visual.nodes.find((n) => n.id === selected);

  return (
    <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-elevated)] overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3 border-b border-[var(--border-color)] bg-[var(--bg-subtle)]">
        <h4 className="text-sm font-semibold text-[var(--text-primary)]">{visual.title}</h4>
        <p className="text-xs text-[var(--text-muted)] mt-0.5">
          {selected ? "Click elsewhere to deselect." : visual.caption}
        </p>
      </div>

      {/* Type grid */}
      <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
        {visual.nodes.map((node, idx) => {
          const palette = getPalette(node.id, idx);
          const isSelected = selected === node.id;

          return (
            <motion.button
              key={node.id}
              onClick={() => setSelected((s) => (s === node.id ? null : node.id))}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06, duration: 0.3 }}
              className={cn(
                "flex flex-col items-start gap-2 p-4 rounded-xl border-2 text-left transition-all focus-ring",
                palette.bg,
                isSelected ? palette.selectedBorder : palette.border,
                isSelected ? "shadow-md" : "hover:shadow-sm",
              )}
              aria-pressed={isSelected}
              aria-label={`${node.label}: ${palette.tagline || node.detail.split(".")[0]}`}
            >
              {/* Type badge */}
              <span
                className={cn(
                  "text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border",
                  palette.bg,
                  palette.border,
                  palette.labelCn,
                )}
              >
                {node.label}
              </span>

              {/* Example value */}
              <span
                className={cn(
                  "text-2xl font-black font-mono leading-none",
                  palette.valueCn,
                )}
              >
                {node.sublabel}
              </span>

              {/* Tagline */}
              <span className="text-[11px] text-[var(--text-secondary)] leading-snug">
                {palette.tagline || node.detail.split(".")[0]}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Detail panel */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            key={selectedNode.id}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            {(() => {
              const palette = getPalette(selectedNode.id, 0);
              return (
                <div
                  className={cn(
                    "border-t px-5 py-4 flex flex-col gap-4",
                    palette.bg,
                    palette.border.replace("border-", "border-t-"),
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      {/* Type + value headline */}
                      <div className="flex items-center gap-2 mb-2">
                        <span className={cn("font-bold text-base", palette.labelCn)}>
                          {selectedNode.label}
                        </span>
                        <span className={cn("font-mono text-sm font-semibold", palette.valueCn)}>
                          = {selectedNode.sublabel}
                        </span>
                      </div>

                      {/* Full detail */}
                      <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                        {selectedNode.detail}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelected(null)}
                      aria-label="Close detail"
                      className="text-[var(--text-muted)] hover:text-[var(--text-primary)] shrink-0 focus-ring rounded p-0.5 mt-0.5"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Code example */}
                  {palette.codeExample && (
                    <div className="rounded-lg bg-[#0d1117] px-4 py-3 font-mono text-sm">
                      <span className="text-[#6b7a99]"># Python</span>
                      <br />
                      <span className="text-sky-300">
                        {palette.codeExample.split("=")[0]}
                      </span>
                      <span className="text-[#c0c8d8]">=</span>
                      <span className={cn("", palette.valueCn)}>
                        {palette.codeExample.split("=")[1]}
                      </span>
                    </div>
                  )}
                </div>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hint */}
      {!selected && (
        <p className="px-5 pb-4 text-[11px] text-[var(--text-muted)]">
          Select a type to see its full definition, operations, and data science usage.
        </p>
      )}
    </div>
  );
}

/* ── Public export — routes to TypeExplorer or SVG fallback ─────────── */

interface InteractiveDiagramProps {
  visual: LessonVisual;
}

export function InteractiveDiagram({ visual }: InteractiveDiagramProps) {
  /* "comparison" kind → type explorer (clearer than SVG for discrete types) */
  if (visual.kind === "comparison") {
    return <TypeExplorer visual={visual} />;
  }

  /* Other kinds — simplified node list (SVG diagram removed as per brief) */
  return <NodeListDiagram visual={visual} />;
}

function NodeListDiagram({ visual }: InteractiveDiagramProps) {
  const [selected, setSelected] = React.useState<DiagramNode | null>(null);
  return (
    <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-elevated)] overflow-hidden">
      <div className="px-5 py-3 border-b border-[var(--border-color)] bg-[var(--bg-subtle)]">
        <h4 className="text-sm font-semibold text-[var(--text-primary)]">{visual.title}</h4>
        <p className="text-xs text-[var(--text-muted)] mt-0.5">{visual.caption}</p>
      </div>
      <div className="p-4 grid sm:grid-cols-2 gap-2">
        {visual.nodes.map((node, idx) => {
          const palette = getPalette(node.id, idx);
          const isSelected = selected?.id === node.id;
          return (
            <button
              key={node.id}
              onClick={() => setSelected((p) => (p?.id === node.id ? null : node))}
              className={cn(
                "flex flex-col gap-1.5 p-3 rounded-xl border-2 text-left transition-colors focus-ring",
                palette.bg,
                isSelected ? palette.selectedBorder : palette.border,
              )}
            >
              <span className={cn("text-xs font-bold", palette.labelCn)}>{node.label}</span>
              {node.sublabel && (
                <span className={cn("text-lg font-mono font-bold", palette.valueCn)}>
                  {node.sublabel}
                </span>
              )}
            </button>
          );
        })}
      </div>
      <AnimatePresence>
        {selected && (
          <motion.div
            key={selected.id}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="border-t border-[var(--border-color)] px-5 py-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-[var(--text-primary)] mb-1">{selected.label}</p>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{selected.detail}</p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)] focus-ring rounded shrink-0"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
