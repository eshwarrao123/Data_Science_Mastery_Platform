"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Lightbulb, AlertTriangle, Quote } from "lucide-react";
import type { TheoryBlock } from "@/lib/types";
import { glossary } from "@/lib/data/glossary";
import { GlossaryTerm } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

/* Inject glossary tooltips into a string of text */
function annotateGlossary(text: string): React.ReactNode {
  const terms = Object.keys(glossary).sort((a, b) => b.length - a.length);
  // Simple single-pass — find first match, recurse on remainder
  for (const term of terms) {
    const idx = text.toLowerCase().indexOf(term.toLowerCase());
    if (idx === -1) continue;
    const before = text.slice(0, idx);
    const matched = text.slice(idx, idx + term.length);
    const after = text.slice(idx + term.length);
    return (
      <>
        {before}
        <GlossaryTerm term={term} definition={glossary[term]}>
          {matched}
        </GlossaryTerm>
        {annotateGlossary(after)}
      </>
    );
  }
  return text;
}

function CodeNote({ code, content }: { code: string; content: string }) {
  return (
    <div className="rounded-xl border border-[var(--border-color)] overflow-hidden my-4">
      <pre className="bg-[#1e1e1e] text-[#d4d4d4] text-xs font-mono p-5 overflow-x-auto leading-6 whitespace-pre">
        {code}
      </pre>
      {content && (
        <div className="px-5 py-3 bg-[var(--bg-subtle)] border-t border-[var(--border-color)]">
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            {annotateGlossary(content)}
          </p>
        </div>
      )}
    </div>
  );
}

function ExpandableBlock({ title, content }: { title: string; content: string }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-elevated)] my-4 overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex items-center justify-between px-5 py-3.5 text-left focus-ring hover:bg-[var(--bg-subtle)] transition-colors"
      >
        <span className="text-sm font-semibold text-[var(--text-primary)]">
          {title}
        </span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="h-4 w-4 text-[var(--text-muted)]" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 text-sm text-[var(--text-secondary)] leading-relaxed border-t border-[var(--border-color)] pt-4">
              {annotateGlossary(content)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AnalogyBlock({ title, content }: { title: string; content: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
      className="flex gap-4 my-5 p-5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)]"
    >
      <Quote className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" aria-hidden />
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-emerald-500 mb-1.5">
          Analogy: {title}
        </div>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
          {annotateGlossary(content)}
        </p>
      </div>
    </motion.div>
  );
}

function KeyPointBlock({ title, content }: { title: string; content: string }) {
  return (
    <div className="my-5 p-5 rounded-xl border-l-4 border-emerald-500 bg-emerald-500/5">
      <div className="flex items-center gap-2 mb-1.5">
        <Lightbulb className="h-4 w-4 text-emerald-500" aria-hidden />
        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-500">
          Key Concept
        </span>
      </div>
      <div className="text-sm font-semibold text-[var(--text-primary)] mb-1">{title}</div>
      <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
        {annotateGlossary(content)}
      </p>
    </div>
  );
}

function WarningBlock({ title, content }: { title: string; content: string }) {
  return (
    <div className="my-5 p-5 rounded-xl border-l-4 border-amber-500 bg-amber-500/5">
      <div className="flex items-center gap-2 mb-1.5">
        <AlertTriangle className="h-4 w-4 text-amber-500" aria-hidden />
        <span className="text-xs font-semibold uppercase tracking-wider text-amber-500">
          Watch out
        </span>
      </div>
      <div className="text-sm font-semibold text-[var(--text-primary)] mb-1">{title}</div>
      <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
        {annotateGlossary(content)}
      </p>
    </div>
  );
}

export function TheoryBlocks({ blocks }: { blocks: TheoryBlock[] }) {
  return (
    <div className="lesson-prose flex flex-col gap-4">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "text":
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className="text-[var(--text-secondary)] leading-relaxed text-[1.0125rem]"
              >
                {annotateGlossary(block.content)}
              </motion.div>
            );
          case "analogy":
            return <AnalogyBlock key={i} title={block.title} content={block.content} />;
          case "keypoint":
            return <KeyPointBlock key={i} title={block.title} content={block.content} />;
          case "expandable":
            return <ExpandableBlock key={i} title={block.title} content={block.content} />;
          case "code-note":
            return <CodeNote key={i} code={block.code} content={block.content} />;
          case "warning":
            return <WarningBlock key={i} title={block.title} content={block.content} />;
          default:
            return null;
        }
      })}
    </div>
  );
}
