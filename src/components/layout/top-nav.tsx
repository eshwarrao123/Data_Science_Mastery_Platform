"use client";

import * as React from "react";
import Link from "next/link";
import { Moon, Sun, Search, User } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { useUi } from "@/lib/store/ui";
import { useProgress } from "@/lib/store/progress";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function TopNav() {
  const { theme, toggle } = useTheme();
  const openPalette = useUi((s) => s.setCommandPaletteOpen);
  const xp = useProgress((s) => s.xp);

  React.useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        openPalette(true);
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [openPalette]);

  return (
    <header className="fixed top-0 inset-x-0 z-50 h-16 flex items-center border-b border-[var(--border-color)] bg-[color-mix(in_srgb,var(--bg-base)_80%,transparent)] backdrop-blur-md">
      <div className="mx-auto w-full max-w-screen-2xl px-4 flex items-center gap-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 focus-ring rounded-md"
          aria-label="Data Science Mastery home"
        >
          <span className="text-lg font-bold tracking-tighter text-[var(--text-primary)]">
            DSM
          </span>
          <span className="hidden sm:block h-4 w-px bg-[var(--border-color)]" />
          <span className="hidden sm:block text-xs text-[var(--text-muted)] tracking-wide">
            Data Science Mastery
          </span>
        </Link>

        {/* Spacer */}
        <div className="flex-1" />

        {/* CMD+K search trigger */}
        <button
          onClick={() => openPalette(true)}
          aria-label="Open command palette (Ctrl+K)"
          className={cn(
            "hidden md:flex items-center gap-2 h-9 px-3 rounded-lg",
            "border border-[var(--border-color)] bg-[var(--bg-subtle)]",
            "text-[var(--text-muted)] text-sm transition-colors hover:bg-[var(--bg-elevated)]",
            "focus-ring",
          )}
        >
          <Search className="h-3.5 w-3.5" />
          <span>Search lessons, topics…</span>
          <kbd className="ml-6 text-[10px] bg-[var(--bg-elevated)] border border-[var(--border-color)] rounded px-1.5 py-0.5">
            ⌘K
          </kbd>
        </button>

        {/* Mobile search */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => openPalette(true)}
          aria-label="Search"
        >
          <Search className="h-4 w-4" />
        </Button>

        {/* XP chip */}
        <div
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20"
          aria-label={`${xp} XP earned`}
        >
          <span className="text-xs font-semibold text-emerald-500">{xp.toLocaleString()} XP</span>
        </div>

        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggle}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {theme === "dark" ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>

        {/* Profile */}
        <Link href="/profile" aria-label="Profile">
          <Button variant="ghost" size="icon">
            <User className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </header>
  );
}
