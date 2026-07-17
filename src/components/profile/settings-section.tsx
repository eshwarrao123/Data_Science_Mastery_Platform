"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

/** Appearance, daily goal and danger-zone settings, rendered at /profile/settings. */
export function SettingsSection() {
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
