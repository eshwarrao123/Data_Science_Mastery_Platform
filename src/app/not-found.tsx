import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center px-6 py-24 text-center">
      <p className="text-[11px] font-mono font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)] mb-3">
        404 — Not found
      </p>
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)] mb-3">
        This page doesn&apos;t exist.
      </h1>
      <p className="text-sm text-[var(--text-secondary)] max-w-md leading-relaxed mb-8">
        The lesson or page you&apos;re looking for may have moved. Head back to the
        curriculum to keep learning.
      </p>
      <div className="flex items-center gap-3">
        <Link
          href="/curriculum"
          className="inline-flex items-center justify-center rounded-lg font-medium h-10 px-5 text-sm bg-[var(--text-primary)] text-[var(--bg-base)] hover:opacity-90 transition-opacity focus-ring"
        >
          Browse Curriculum
        </Link>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-lg font-medium h-10 px-5 text-sm bg-[var(--bg-elevated)] border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors focus-ring"
        >
          Go Home
        </Link>
      </div>
    </main>
  );
}
