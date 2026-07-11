"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccordionItem {
  id: string;
  trigger: React.ReactNode;
  content: React.ReactNode;
  defaultOpen?: boolean;
}

interface AccordionProps {
  items: AccordionItem[];
  type?: "single" | "multiple";
  className?: string;
}

export function Accordion({ items, type = "single", className }: AccordionProps) {
  const defaults = items.filter((i) => i.defaultOpen).map((i) => i.id);
  const [open, setOpen] = React.useState<string[]>(defaults);

  const toggle = (id: string) => {
    if (type === "single") {
      setOpen((prev) => (prev.includes(id) ? [] : [id]));
    } else {
      setOpen((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
      );
    }
  };

  return (
    <div className={cn("divide-y divide-[var(--border-color)]", className)}>
      {items.map((item) => {
        const isOpen = open.includes(item.id);
        return (
          <div key={item.id}>
            <button
              onClick={() => toggle(item.id)}
              aria-expanded={isOpen}
              className={cn(
                "w-full flex items-center justify-between py-4 text-left",
                "text-sm font-medium text-[var(--text-primary)]",
                "hover:text-[var(--text-secondary)] transition-colors focus-ring",
              )}
            >
              <span>{item.trigger}</span>
              <motion.span
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="h-4 w-4 shrink-0 text-[var(--text-muted)]" />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="pb-4">{item.content}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
