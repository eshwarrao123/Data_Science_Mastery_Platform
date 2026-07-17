"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Bookmark, FileText, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const PROFILE_TABS = [
  { href: "/profile/bookmarks", label: "Bookmarks", icon: Bookmark },
  { href: "/profile/notes", label: "Notes", icon: FileText },
  { href: "/profile/settings", label: "Settings", icon: Settings },
];

/**
 * Link-based tab navigation for the Profile section.
 * Mirrors the visual language of `Tabs` but drives real routes,
 * so each tab is its own page under /profile/*.
 */
export function ProfileNav() {
  const pathname = usePathname();

  return (
    <div
      role="navigation"
      aria-label="Profile sections"
      className="flex items-center gap-1 border-b border-[var(--border-color)] pb-0"
    >
      {PROFILE_TABS.map(({ href, label, icon: Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "relative px-4 py-2.5 text-sm font-medium transition-colors duration-150 focus-ring",
              active
                ? "text-[var(--text-primary)]"
                : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]",
            )}
          >
            <span className="flex items-center gap-1.5">
              <Icon className="h-3.5 w-3.5" /> {label}
            </span>
            {active && (
              <motion.div
                layoutId="profile-tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--text-primary)] rounded-full"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
          </Link>
        );
      })}
    </div>
  );
}
