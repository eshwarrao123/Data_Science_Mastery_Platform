"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Search,
  BookOpen,
  Code2,
  Lightbulb,
  LayoutDashboard,
  Map,
  Briefcase,
  X,
} from "lucide-react";
import { useUi } from "@/lib/store/ui";
import { allLessons } from "@/lib/curriculum";
import { cn } from "@/lib/utils";

interface ResultItem {
  id: string;
  label: string;
  sublabel?: string;
  icon: React.ElementType;
  href: string;
  category: string;
}

const QUICK_LINKS: ResultItem[] = [
  { id: "ql-dash", label: "Dashboard", sublabel: "Your learning overview", icon: LayoutDashboard, href: "/dashboard", category: "Quick Links" },
  { id: "ql-curr", label: "Curriculum Roadmap", sublabel: "Full learning path", icon: Map, href: "/curriculum", category: "Quick Links" },
  { id: "ql-proj", label: "Projects Hub", sublabel: "Industry capstone projects", icon: Briefcase, href: "/projects", category: "Quick Links" },
  { id: "ql-int", label: "Interview Prep", sublabel: "SQL, Pandas, ML questions", icon: Code2, href: "/interview-prep", category: "Quick Links" },
];

function buildLessonItems(): ResultItem[] {
  return allLessons().map((l) => ({
    id: l.id,
    label: l.title,
    sublabel: `${l.courseSlug} · ${l.estimatedTime} · ${l.difficulty}`,
    icon: BookOpen,
    href: `/course/${l.courseSlug}/${l.moduleSlug}/${l.slug}`,
    category: "Lessons",
  }));
}

function fuzzy(query: string, text: string): boolean {
  const q = query.toLowerCase();
  const t = text.toLowerCase();
  let qi = 0;
  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (t[ti] === q[qi]) qi++;
  }
  return qi === q.length;
}

export function CommandPalette() {
  const isOpen = useUi((s) => s.commandPaletteOpen);
  const setOpen = useUi((s) => s.setCommandPaletteOpen);
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  const allItems = React.useMemo(
    () => [...QUICK_LINKS, ...buildLessonItems()],
    [],
  );

  const results = React.useMemo(() => {
    if (!query.trim()) return QUICK_LINKS;
    return allItems.filter(
      (item) => fuzzy(query, item.label) || fuzzy(query, item.sublabel ?? ""),
    );
  }, [query, allItems]);

  const grouped = React.useMemo(() => {
    const map: Record<string, ResultItem[]> = {};
    for (const item of results) {
      (map[item.category] ??= []).push(item);
    }
    return map;
  }, [results]);

  React.useEffect(() => {
    if (isOpen) {
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const close = () => setOpen(false);

  const navigate = (href: string) => {
    router.push(href);
    close();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 bg-black/60"
            onClick={close}
            aria-hidden
          />

          {/* Panel */}
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            className="fixed top-[20vh] left-1/2 -translate-x-1/2 z-50 w-full max-w-xl"
          >
            <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-elevated)] shadow-2xl overflow-hidden">
              {/* Input */}
              <div className="flex items-center gap-3 px-4 border-b border-[var(--border-color)]">
                <Search className="h-4 w-4 shrink-0 text-[var(--text-muted)]" aria-hidden />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") close();
                  }}
                  placeholder="Search lessons, topics, projects…"
                  className="flex-1 h-14 bg-transparent text-[var(--text-primary)] placeholder-[var(--text-muted)] text-sm outline-none"
                />
                <button
                  onClick={close}
                  aria-label="Close command palette"
                  className="text-[var(--text-muted)] hover:text-[var(--text-primary)] focus-ring rounded"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Results */}
              <div className="max-h-[60vh] overflow-y-auto p-2">
                {Object.keys(grouped).length === 0 ? (
                  <div className="py-12 text-center text-sm text-[var(--text-muted)]">
                    No results for &ldquo;{query}&rdquo;
                  </div>
                ) : (
                  Object.entries(grouped).map(([category, items]) => (
                    <div key={category} className="mb-3">
                      <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)]">
                        {category}
                      </div>
                      {items.slice(0, 6).map((item) => {
                        const Icon = item.icon;
                        return (
                          <button
                            key={item.id}
                            onClick={() => navigate(item.href)}
                            className={cn(
                              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg",
                              "text-left hover:bg-[var(--bg-subtle)] transition-colors focus-ring",
                            )}
                          >
                            <Icon className="h-4 w-4 shrink-0 text-[var(--text-muted)]" aria-hidden />
                            <div className="min-w-0">
                              <div className="text-sm font-medium text-[var(--text-primary)] truncate">
                                {item.label}
                              </div>
                              {item.sublabel && (
                                <div className="text-xs text-[var(--text-muted)] truncate">
                                  {item.sublabel}
                                </div>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  ))
                )}
              </div>

              <div className="border-t border-[var(--border-color)] px-4 py-2 flex items-center gap-4">
                <span className="text-[10px] text-[var(--text-muted)]">
                  <kbd className="bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded px-1">↑↓</kbd> navigate
                </span>
                <span className="text-[10px] text-[var(--text-muted)]">
                  <kbd className="bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded px-1">↵</kbd> open
                </span>
                <span className="text-[10px] text-[var(--text-muted)]">
                  <kbd className="bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded px-1">Esc</kbd> close
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
