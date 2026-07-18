"use client";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex-1 flex flex-col items-center justify-center px-6 py-24 text-center">
      <p className="text-[11px] font-mono font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)] mb-3">
        Something went wrong
      </p>
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)] mb-3">
        An unexpected error occurred.
      </h1>
      <p className="text-sm text-[var(--text-secondary)] max-w-md leading-relaxed mb-8">
        Your progress is saved locally and is safe. Try again, or return to the
        dashboard.
        {error.digest && (
          <span className="block mt-2 font-mono text-xs text-[var(--text-muted)]">
            Ref: {error.digest}
          </span>
        )}
      </p>
      <div className="flex items-center gap-3">
        <button
          onClick={reset}
          className="inline-flex items-center justify-center rounded-lg font-medium h-10 px-5 text-sm bg-[var(--text-primary)] text-[var(--bg-base)] hover:opacity-90 transition-opacity focus-ring cursor-pointer"
        >
          Try Again
        </button>
        <a
          href="/dashboard"
          className="inline-flex items-center justify-center rounded-lg font-medium h-10 px-5 text-sm bg-[var(--bg-elevated)] border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors focus-ring"
        >
          Go to Dashboard
        </a>
      </div>
    </main>
  );
}
