"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Map,
  Briefcase,
  Code2,
  Bookmark,
  FileText,
  Settings,
  Flame,
  ChevronLeft,
  ChevronRight,
  PanelLeft,
} from "lucide-react";
import { useUi } from "@/lib/store/ui";
import { useProgress } from "@/lib/store/progress";
import { ProgressBar } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/curriculum", label: "Curriculum", icon: Map },
  { href: "/projects", label: "My Projects", icon: Briefcase },
  { href: "/interview-prep", label: "Interview Prep", icon: Code2 },
  { href: "/profile?tab=bookmarks", label: "Bookmarks", icon: Bookmark },
  { href: "/profile?tab=notes", label: "Notes", icon: FileText },
  { href: "/profile?tab=settings", label: "Settings", icon: Settings },
];

/* XP level thresholds */
function xpToLevel(xp: number) {
  const level = Math.floor(xp / 500) + 1;
  const levelXp = (level - 1) * 500;
  const nextXp = level * 500;
  const progress = ((xp - levelXp) / 500) * 100;
  return { level, progress, nextXp, levelXp };
}

export function Sidebar() {
  const collapsed = useUi((s) => s.sidebarCollapsed);
  const toggleSidebar = useUi((s) => s.toggleSidebar);
  const pathname = usePathname();
  const xp = useProgress((s) => s.xp);
  const streakDays = useProgress((s) => s.streakDays);
  const { level, progress } = xpToLevel(xp);

  const width = collapsed ? 64 : 256;

  return (
    <motion.aside
      animate={{ width }}
      transition={{ type: "spring", stiffness: 260, damping: 28 }}
      className="hidden md:flex flex-col fixed left-0 top-16 bottom-0 z-40 border-r border-[var(--border-color)] bg-[var(--bg-elevated)] overflow-hidden"
      aria-label="Main navigation"
    >
      {/* User card */}
      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.div
            key="user-card"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="p-4 border-b border-[var(--border-color)]"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="h-8 w-8 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-emerald-500">L{level}</span>
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-[var(--text-primary)] truncate">
                  Learner
                </div>
                <div className="text-xs text-[var(--text-muted)]">
                  {xp.toLocaleString()} XP
                </div>
              </div>
            </div>
            <ProgressBar value={progress} size="sm" animated={false} />
            <div className="flex justify-between mt-1">
              <span className="text-[10px] text-[var(--text-muted)]">Level {level}</span>
              <span className="text-[10px] text-[var(--text-muted)]">{Math.round(progress)}%</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nav links */}
      <nav className="flex-1 py-3 overflow-y-auto overflow-x-hidden">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href.split("?")[0]);
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className={cn(
                "flex items-center gap-3 mx-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors focus-ring",
                active
                  ? "bg-[var(--bg-subtle)] text-[var(--text-primary)]"
                  : "text-[var(--text-muted)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-secondary)]",
              )}
              aria-current={active ? "page" : undefined}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden />
              <AnimatePresence initial={false}>
                {!collapsed && (
                  <motion.span
                    key="label"
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.12 }}
                    className="overflow-hidden whitespace-nowrap"
                  >
                    {label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>

      {/* Streak counter */}
      <div className="border-t border-[var(--border-color)] p-4">
        <div
          className={cn(
            "flex items-center gap-2",
            collapsed && "justify-center",
          )}
        >
          <Flame className="h-4 w-4 text-amber-500 shrink-0" aria-hidden />
          <AnimatePresence initial={false}>
            {!collapsed && (
              <motion.span
                key="streak"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.12 }}
                className="text-sm font-semibold text-[var(--text-primary)]"
              >
                {streakDays} day streak
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={toggleSidebar}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        className={cn(
          "absolute top-3 -right-3 z-10",
          "h-6 w-6 rounded-full border border-[var(--border-color)] bg-[var(--bg-elevated)]",
          "flex items-center justify-center",
          "hover:bg-[var(--bg-subtle)] transition-colors focus-ring",
        )}
      >
        {collapsed ? (
          <ChevronRight className="h-3 w-3 text-[var(--text-muted)]" />
        ) : (
          <ChevronLeft className="h-3 w-3 text-[var(--text-muted)]" />
        )}
      </button>
    </motion.aside>
  );
}

/* Mobile sidebar trigger (bottom sheet) handled in lesson view inline */
export function SidebarToggleMobile() {
  const toggleSidebar = useUi((s) => s.toggleSidebar);
  return (
    <button
      onClick={toggleSidebar}
      aria-label="Toggle navigation"
      className="md:hidden p-2 rounded-lg hover:bg-[var(--bg-subtle)] text-[var(--text-muted)] focus-ring"
    >
      <PanelLeft className="h-5 w-5" />
    </button>
  );
}
