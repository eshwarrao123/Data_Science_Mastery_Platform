"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { Flame, Zap, BookOpen, Bookmark, FileText, Settings, Trash2, Download } from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs } from "@/components/ui/tabs";
import { ProgressBar } from "@/components/ui/progress";
import { useProgress } from "@/lib/store/progress";
import { allLessons } from "@/lib/data/curriculum";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

function xpToLevel(xp: number) {
  const level = Math.floor(xp / 500) + 1;
  const progress = ((xp % 500) / 500) * 100;
  return { level, progress };
}

function BookmarksTab() {
  const bookmarks = useProgress((s) => s.bookmarks);
  const toggleBookmark = useProgress((s) => s.toggleBookmark);
  const lessons = allLessons();
  const bookmarkedLessons = lessons.filter((l) => bookmarks.includes(l.slug));

  if (bookmarkedLessons.length === 0) {
    return (
      <div className="py-12 text-center text-[var(--text-muted)] text-sm">
        No bookmarks yet. Bookmark lessons from the lesson AI Tutor sidebar.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {bookmarkedLessons.map((l) => (
        <div key={l.slug} className="flex items-center gap-3 p-3 rounded-lg border border-[var(--border-color)] bg-[var(--bg-elevated)]">
          <Bookmark className="h-4 w-4 text-amber-500 fill-current shrink-0" />
          <div className="flex-1 min-w-0">
            <Link href={`/course/${l.courseSlug}/${l.moduleSlug}/${l.slug}`} className="text-sm font-medium text-[var(--text-primary)] hover:underline truncate block">
              {l.title}
            </Link>
            <div className="text-xs text-[var(--text-muted)]">{l.estimatedTime} · {l.difficulty}</div>
          </div>
          <button onClick={() => toggleBookmark(l.slug)} className="text-[var(--text-muted)] hover:text-rose-500 transition-colors focus-ring rounded" aria-label="Remove bookmark">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}

function NotesTab() {
  const notes = useProgress((s) => s.notes);
  const setNote = useProgress((s) => s.setNote);
  const lessons = allLessons();
  const lessonNotes = Object.entries(notes).filter(([, v]) => v.trim());

  const exportNotes = () => {
    const content = lessonNotes
      .map(([slug, content]) => {
        const lesson = lessons.find((l) => l.slug === slug);
        return `## ${lesson?.title ?? slug}\n\n${content}\n\n---\n`;
      })
      .join("\n");
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "dsm-notes.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (lessonNotes.length === 0) {
    return (
      <div className="py-12 text-center text-[var(--text-muted)] text-sm">
        No notes yet. Write notes from the AI Tutor sidebar during lessons.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button size="sm" variant="secondary" onClick={exportNotes} className="gap-1.5">
          <Download className="h-3.5 w-3.5" />
          Export as Markdown
        </Button>
      </div>
      {lessonNotes.map(([slug, content]) => {
        const lesson = lessons.find((l) => l.slug === slug);
        return (
          <Card key={slug} className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Link href={`/course/${lesson?.courseSlug ?? ""}/${lesson?.moduleSlug ?? ""}/${slug}`} className="text-sm font-semibold text-[var(--text-primary)] hover:underline">
                {lesson?.title ?? slug}
              </Link>
              <button onClick={() => setNote(slug, "")} className="text-[var(--text-muted)] hover:text-rose-500 focus-ring rounded" aria-label="Delete note">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
            <p className="text-sm text-[var(--text-secondary)] whitespace-pre-wrap leading-relaxed">
              {content}
            </p>
          </Card>
        );
      })}
    </div>
  );
}

function SettingsTab() {
  const { theme, toggle } = useTheme();

  return (
    <div className="flex flex-col gap-6 max-w-lg">
      <Card className="p-5">
        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Appearance</h3>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-[var(--text-primary)]">Theme</div>
            <div className="text-xs text-[var(--text-muted)]">Current: {theme} mode</div>
          </div>
          <Button size="sm" variant="secondary" onClick={toggle}>
            Switch to {theme === "dark" ? "Light" : "Dark"}
          </Button>
        </div>
      </Card>

      <Card className="p-5">
        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Daily Goal</h3>
        <p className="text-sm text-[var(--text-muted)] mb-3">
          Current daily learning goal: <strong className="text-[var(--text-primary)]">20 minutes</strong>
        </p>
        <div className="flex gap-2">
          {[10, 20, 30, 60].map((min) => (
            <button
              key={min}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border",
                min === 20
                  ? "bg-[var(--text-primary)] text-[var(--bg-base)] border-[var(--text-primary)]"
                  : "border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-primary)]",
              )}
            >
              {min} min
            </button>
          ))}
        </div>
      </Card>

      <Card className="p-5 border-rose-500/20">
        <h3 className="text-sm font-semibold text-rose-500 mb-2">Danger Zone</h3>
        <p className="text-xs text-[var(--text-muted)] mb-3">Reset all progress. This cannot be undone.</p>
        <Button size="sm" variant="danger" onClick={() => { if (confirm("Reset all progress?")) localStorage.clear(); }}>
          Reset Progress
        </Button>
      </Card>
    </div>
  );
}

function ProfilePageInner() {
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get("tab") ?? "overview";

  const xp = useProgress((s) => s.xp);
  const streakDays = useProgress((s) => s.streakDays);
  const lessonMap = useProgress((s) => s.lessons);
  const activity = useProgress((s) => s.activity);
  const { level, progress } = xpToLevel(xp);

  const completedCount = Object.values(lessonMap).filter((l) => l.status === "completed").length;
  const totalMinutes = Object.values(activity).reduce((a, b) => a + b, 0);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 min-w-0 px-4 md:px-8 py-8 max-w-4xl">
        {/* Profile header */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-5 mb-6">
            <div className="h-16 w-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500/30 flex items-center justify-center">
              <span className="text-2xl font-bold text-emerald-500">L{level}</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
                Your Profile
              </h1>
              <p className="text-sm text-[var(--text-muted)]">
                Level {level} · {xp.toLocaleString()} XP total
              </p>
              <div className="mt-2 flex items-center gap-2 max-w-xs">
                <ProgressBar value={progress} size="sm" className="flex-1" />
                <span className="text-xs text-[var(--text-muted)] shrink-0">{Math.round(progress)}%</span>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: Zap, label: "Total XP", value: xp.toLocaleString(), color: "text-amber-500" },
              { icon: Flame, label: "Day Streak", value: streakDays.toString(), color: "text-orange-500" },
              { icon: BookOpen, label: "Lessons Done", value: completedCount.toString(), color: "text-emerald-500" },
              { icon: Settings, label: "Hours Learned", value: Math.round(totalMinutes / 60).toString(), color: "text-sky-400" },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-elevated)] flex items-center gap-3">
                  <Icon className={cn("h-5 w-5 shrink-0", stat.color)} />
                  <div>
                    <div className="text-lg font-bold text-[var(--text-primary)] tabular-nums">{stat.value}</div>
                    <div className="text-[10px] text-[var(--text-muted)]">{stat.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Tabs */}
        <Tabs
          defaultTab={["bookmarks", "notes", "settings"].includes(defaultTab) ? defaultTab : "bookmarks"}
          tabs={[
            {
              id: "bookmarks",
              label: (
                <span className="flex items-center gap-1.5">
                  <Bookmark className="h-3.5 w-3.5" /> Bookmarks
                </span>
              ),
              content: <BookmarksTab />,
            },
            {
              id: "notes",
              label: (
                <span className="flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5" /> Notes
                </span>
              ),
              content: <NotesTab />,
            },
            {
              id: "settings",
              label: (
                <span className="flex items-center gap-1.5">
                  <Settings className="h-3.5 w-3.5" /> Settings
                </span>
              ),
              content: <SettingsTab />,
            },
          ]}
        />
      </main>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <React.Suspense fallback={null}>
      <ProfilePageInner />
    </React.Suspense>
  );
}
