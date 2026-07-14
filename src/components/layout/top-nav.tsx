"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Moon, Sun, Search, User, Menu, X } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { useUi } from "@/lib/store/ui";
import { useProgress } from "@/lib/store/progress";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Curriculum", href: "/curriculum" },
  { label: "Projects",   href: "/projects"   },
] as const;

export function TopNav() {
  const { theme, toggle } = useTheme();
  const openPalette = useUi((s) => s.setCommandPaletteOpen);
  const xp = useProgress((s) => s.xp);
  const pathname = usePathname();
  const isHome = pathname === "/";

  const [mobileOpen, setMobileOpen] = React.useState(false);

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

  /* Close mobile menu on route change */
  React.useEffect(() => { setMobileOpen(false); }, [pathname]);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 h-16 border-b border-[var(--border-color)]",
        "bg-[color-mix(in_srgb,var(--bg-base)_80%,transparent)] backdrop-blur-md",
      )}
    >
      <div className="mx-auto w-full max-w-screen-2xl px-4 sm:px-6 h-full flex items-center gap-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 focus-ring rounded-md shrink-0"
          aria-label="Data Science Mastery home"
        >
          <span className="font-bold tracking-tighter text-[var(--text-primary)]">
            DSM
          </span>
          <span className="hidden sm:block h-4 w-px bg-[var(--border-color)]" />
          <span className="hidden sm:block text-xs text-[var(--text-muted)] tracking-wide">
            Data Science Mastery
          </span>
        </Link>

        {/* Homepage navigation links */}
        {isHome && (
          <nav className="hidden md:flex items-center gap-1 ml-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-1.5 text-sm rounded-md transition-colors",
                  "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]",
                  "focus-ring",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}

        <div className="flex-1" />

        {/* CMD+K search trigger (desktop) */}
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
          <kbd className="ml-6 text-[10px] bg-[var(--bg-elevated)] border border-[var(--border-color)] rounded px-1.5 py-0.5 font-mono">
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
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>

        {/* Profile */}
        <Link href="/profile" aria-label="Profile">
          <Button variant="ghost" size="icon">
            <User className="h-4 w-4" />
          </Button>
        </Link>

        {/* Homepage CTA (desktop) */}
        {isHome && (
          <Link href="/dashboard" className="hidden md:block">
            <Button variant="primary" size="sm">
              Start Learning Free
            </Button>
          </Link>
        )}

        {/* Mobile hamburger — only show on homepage */}
        {isHome && (
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        )}
      </div>

      {/* Mobile nav drawer (homepage only) */}
      {isHome && mobileOpen && (
        <div className="md:hidden border-t border-[var(--border-color)] bg-[var(--bg-base)] px-4 py-4 flex flex-col gap-2">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-2 text-sm rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Link href="/dashboard" className="mt-2">
            <Button variant="primary" size="md" className="w-full">
              Start Learning Free
            </Button>
          </Link>
        </div>
      )}
    </header>
  );
}
