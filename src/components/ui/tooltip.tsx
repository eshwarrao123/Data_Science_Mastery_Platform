"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  side?: "top" | "bottom";
  className?: string;
}

export function Tooltip({
  content,
  children,
  side = "top",
  className,
}: TooltipProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <span
      className={cn("relative inline-block", className)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {children}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: side === "top" ? 4 : -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: side === "top" ? 4 : -4, scale: 0.97 }}
            transition={{ duration: 0.12 }}
            role="tooltip"
            className={cn(
              "absolute z-50 max-w-xs px-3 py-2 rounded-lg",
              "bg-[var(--text-primary)] text-[var(--bg-base)]",
              "text-xs leading-relaxed shadow-xl pointer-events-none",
              "left-1/2 -translate-x-1/2",
              side === "top" ? "bottom-full mb-2" : "top-full mt-2",
            )}
          >
            {content}
            <span
              className={cn(
                "absolute left-1/2 -translate-x-1/2",
                "border-4 border-transparent",
                side === "top"
                  ? "top-full border-t-[var(--text-primary)]"
                  : "bottom-full border-b-[var(--text-primary)]",
              )}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}

/* Glossary term with dotted underline + tooltip */
export function GlossaryTerm({
  term,
  definition,
  children,
}: {
  term: string;
  definition: string;
  children?: React.ReactNode;
}) {
  return (
    <Tooltip content={definition}>
      <span className="term" tabIndex={0} aria-label={`${term}: ${definition}`}>
        {children ?? term}
      </span>
    </Tooltip>
  );
}
