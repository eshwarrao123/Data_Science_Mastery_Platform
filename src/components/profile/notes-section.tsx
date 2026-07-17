"use client";

import Link from "next/link";
import { Trash2, Download } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useProgress } from "@/lib/store/progress";
import { allLessons } from "@/lib/curriculum";

/** Lesson-notes list with markdown export, rendered at /profile/notes. */
export function NotesSection() {
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
