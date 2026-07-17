"use client";

import Link from "next/link";
import { Bookmark, Trash2 } from "lucide-react";
import { useProgress } from "@/lib/store/progress";
import { allLessons } from "@/lib/curriculum";

/** Bookmarked-lessons list, rendered at /profile/bookmarks. */
export function BookmarksSection() {
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
