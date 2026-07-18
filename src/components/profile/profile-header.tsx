"use client";

import { motion } from "framer-motion";
import { Flame, Zap, BookOpen, Settings } from "lucide-react";
import { ProgressBar } from "@/components/ui/progress";
import { useProgress } from "@/lib/store/progress";
import { cn } from "@/lib/utils";

/* XP level thresholds */
function xpToLevel(xp: number) {
  const level = Math.floor(xp / 500) + 1;
  const progress = ((xp % 500) / 500) * 100;
  return { level, progress };
}

/**
 * Profile header: avatar, level, XP progress and the stats row.
 * Shared across every /profile/* page via the profile layout.
 */
export function ProfileHeader() {
  const xp = useProgress((s) => s.xp);
  const streakDays = useProgress((s) => s.streakDays);
  const lessonMap = useProgress((s) => s.lessons);
  const activity = useProgress((s) => s.activity);
  const { level, progress } = xpToLevel(xp);

  const completedCount = Object.values(lessonMap).filter((l) => l.status === "completed").length;
  const totalMinutes = Object.values(activity).reduce((a, b) => a + b, 0);

  return (
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
          { icon: Settings, label: "Hours Learned", value: Math.round(totalMinutes / 60).toString(), color: "text-sky-500" },
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
  );
}
