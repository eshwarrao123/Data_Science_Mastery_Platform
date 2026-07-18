"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Flame,
  Zap,
  Target,
  BookOpen,
  Code2,
  Lock,
  CheckCircle2,
  ArrowRight,
  Clock,
  Trophy,
  Star,
  Award,
  TrendingUp,
  GraduationCap,
  Calendar,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CircularProgress } from "@/components/ui/progress";
import { Sidebar } from "@/components/layout/sidebar";
import { useProgress, completedCount } from "@/lib/store/progress";
import { allLessons } from "@/lib/curriculum";
import { cn } from "@/lib/utils";

/* ══════════════════════════════════════════════════════════════════
   UTILITIES
   ══════════════════════════════════════════════════════════════════ */

function isoOffset(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split("T")[0];
}

function relativeDay(isoDate: string): string {
  const today = isoOffset(0);
  const yesterday = isoOffset(1);
  if (isoDate === today) return "Today";
  if (isoDate === yesterday) return "Yesterday";
  const diff = Math.round(
    (new Date(today).getTime() - new Date(isoDate).getTime()) / 86400000,
  );
  return `${diff} days ago`;
}

/* ══════════════════════════════════════════════════════════════════
   DOMAIN-COLOUR THIN PROGRESS BAR
   ══════════════════════════════════════════════════════════════════ */

function ThinBar({
  value,
  colorClass = "bg-violet-500",
  className,
}: {
  value: number;
  colorClass?: string;
  className?: string;
}) {
  return (
    <div className={cn("h-1 w-full rounded-full bg-[var(--bg-subtle)]", className)}>
      <div
        className={cn("h-full rounded-full transition-[width] duration-700", colorClass)}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   ACTIVITY HEATMAP  13 weeks × 7 days, violet intensity
   ══════════════════════════════════════════════════════════════════ */

const INTENSITY = [
  "bg-[var(--bg-subtle)]",
  "bg-violet-500/20",
  "bg-violet-500/40",
  "bg-violet-500/65",
  "bg-violet-500",
];

function intensityCls(mins: number): string {
  if (mins === 0) return INTENSITY[0];
  if (mins < 16) return INTENSITY[1];
  if (mins < 31) return INTENSITY[2];
  if (mins < 61) return INTENSITY[3];
  return INTENSITY[4];
}

function ActivityHeatmap({ activity }: { activity: Record<string, number> }) {
  const WEEKS = 13;
  const columns: Array<Array<{ date: string; mins: number }>> = [];

  for (let w = WEEKS - 1; w >= 0; w--) {
    const col: Array<{ date: string; mins: number }> = [];
    for (let d = 6; d >= 0; d--) {
      const date = isoOffset(w * 7 + d);
      col.unshift({ date, mins: activity[date] ?? 0 });
    }
    columns.unshift(col);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-[3px] overflow-x-auto pb-1">
        {columns.map((col, wi) => (
          <div key={wi} className="flex flex-col gap-[3px]">
            {col.map((cell, di) => (
              <div
                key={di}
                title={`${cell.date}: ${cell.mins} min`}
                className={cn(
                  "h-2.5 w-2.5 md:h-3 md:w-3 rounded-sm shrink-0",
                  intensityCls(cell.mins),
                )}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-1.5 text-[10px] text-[var(--text-muted)]">
        <span>Less</span>
        {INTENSITY.map((cls, i) => (
          <div key={i} className={cn("h-2.5 w-2.5 rounded-sm", cls)} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   SECTION WRAPPER — whileInView entrance (animation slot 1)
   ══════════════════════════════════════════════════════════════════ */

function Section({
  children,
  className,
  idx = 0,
}: {
  children: React.ReactNode;
  className?: string;
  idx?: number;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: idx * 0.04 }}
      className={cn("px-6 md:px-8 lg:px-12 py-12 md:py-16", className)}
    >
      {children}
    </motion.section>
  );
}

function SectionHead({
  title,
  action,
}: {
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between mb-8">
      <h2 className="text-2xl font-semibold text-[var(--text-primary)]">{title}</h2>
      {action}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   STATIC DATA
   ══════════════════════════════════════════════════════════════════ */

type Domain = {
  label: string;
  sublabel: string;
  dot: string;
  active: boolean;
  locked: boolean;
};

const ROADMAP: Domain[] = [
  { label: "Data Foundations", sublabel: "Excel · BI · Tableau", dot: "bg-sky-500", active: false, locked: true },
  { label: "Python Programming", sublabel: "Currently studying", dot: "bg-violet-500", active: true, locked: false },
  { label: "Data Analysis", sublabel: "Pandas & EDA", dot: "bg-emerald-500", active: false, locked: true },
  { label: "Machine Learning", sublabel: "scikit-learn", dot: "bg-orange-500", active: false, locked: true },
  { label: "SQL & Databases", sublabel: "PostgreSQL", dot: "bg-teal-500", active: false, locked: true },
];

type AchievementDef = {
  id: string;
  Icon: React.ComponentType<{ className?: string }>;
  name: string;
  description: string;
  colorCls: string;
  bgCls: string;
};

const ACHIEVEMENT_DEFS: AchievementDef[] = [
  { id: "first-steps",     Icon: GraduationCap, name: "First Steps",      description: "Complete your first lesson",      colorCls: "text-emerald-600 dark:text-emerald-400", bgCls: "bg-emerald-500/10" },
  { id: "on-fire",         Icon: Flame,         name: "On Fire",           description: "Maintain a 3-day streak",         colorCls: "text-amber-600 dark:text-amber-400",   bgCls: "bg-amber-500/10"   },
  { id: "code-breaker",    Icon: Code2,         name: "Code Breaker",      description: "Earn 20+ XP",                     colorCls: "text-violet-600 dark:text-violet-400",  bgCls: "bg-violet-500/10"  },
  { id: "theory-master",   Icon: BookOpen,      name: "Theory Master",     description: "Study across 3+ days",            colorCls: "text-sky-600 dark:text-sky-400",     bgCls: "bg-sky-500/10"     },
  { id: "week-warrior",    Icon: Trophy,        name: "Week Warrior",      description: "Maintain a 7-day streak",         colorCls: "text-amber-600 dark:text-amber-400",   bgCls: "bg-amber-500/10"   },
  { id: "python-padawan",  Icon: Star,          name: "Python Padawan",    description: "Complete 2+ lessons",             colorCls: "text-violet-600 dark:text-violet-400",  bgCls: "bg-violet-500/10"  },
  { id: "data-apprentice", Icon: Award,         name: "Data Apprentice",   description: "Complete Variables & Data Types", colorCls: "text-emerald-600 dark:text-emerald-400", bgCls: "bg-emerald-500/10" },
];

type QuickAction = {
  Icon: React.ComponentType<{ className?: string }>;
  label: string;
  sublabel: string;
  iconCls: string;
  bgCls: string;
  href: string;
};

/* ══════════════════════════════════════════════════════════════════
   MAIN PAGE
   ══════════════════════════════════════════════════════════════════ */

export default function DashboardPage() {
  /* ── Store (one selector per field) ── */
  const lessonMap  = useProgress((s) => s.lessons);
  const xp         = useProgress((s) => s.xp);
  const streakDays = useProgress((s) => s.streakDays);
  const activity   = useProgress((s) => s.activity);
  const lastViewed = useProgress((s) => s.lastViewedLesson);

  /* ── Derived ── */
  const lessons        = allLessons();
  const completed      = completedCount(lessonMap);
  const resumeLesson   = lessons.find((l) => l.slug === lastViewed) ?? lessons[0];
  const resumeHref     = `/course/${resumeLesson.courseSlug}/${resumeLesson.moduleSlug}/${resumeLesson.slug}`;
  const nextUncompleted = lessons.find(
    (l) => !lessonMap[l.slug] || lessonMap[l.slug].status !== "completed",
  );
  const level        = Math.floor(xp / 500) + 1;
  const levelPct     = ((xp % 500) / 500) * 100;
  const xpToNext     = 500 - (xp % 500);
  const courseProgress = lessons.length > 0 ? (completed / lessons.length) * 100 : 0;

  /* today */
  const todayKey  = isoOffset(0);
  const todayMins = activity[todayKey] ?? 0;
  const DAILY_GOAL = 20;
  const todayPct  = Math.min(100, (todayMins / DAILY_GOAL) * 100);

  /* this week */
  const weekDates       = Array.from({ length: 7 }, (_, i) => isoOffset(6 - i));
  const weekStart       = weekDates[0];
  const thisWeekMins    = weekDates.reduce((s, d) => s + (activity[d] ?? 0), 0);
  const thisWeekHrs     = Math.round((thisWeekMins / 60) * 10) / 10;
  const thisWeekLessons = Object.values(lessonMap).filter(
    (r) => r.completedAt && r.completedAt.slice(0, 10) >= weekStart,
  ).length;

  /* totals */
  const hoursTotal   = Math.round((Object.values(activity).reduce((a, b) => a + b, 0) / 60) * 10) / 10;
  const activityDays = Object.keys(activity).filter((k) => (activity[k] ?? 0) > 0).length;

  const varsCompleted = lessonMap["variables-and-data-types"]?.status === "completed";

  /* ── Hydration-safe greeting ── */
  const [greeting, setGreeting] = React.useState("Welcome back");
  React.useEffect(() => {
    const h = new Date().getHours();
    setGreeting(h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening");
  }, []);

  /* ── XP count-up (animation slot 2) ── */
  const [displayXp, setDisplayXp] = React.useState(0);
  React.useEffect(() => {
    if (xp === 0) { setDisplayXp(0); return; }
    const STEPS = 40;
    const inc = xp / STEPS;
    let cur = 0;
    const id = setInterval(() => {
      cur += inc;
      if (cur >= xp) { setDisplayXp(xp); clearInterval(id); }
      else setDisplayXp(Math.round(cur));
    }, 800 / STEPS);
    return () => clearInterval(id);
  }, [xp]);

  /* ── Achievements unlock set ── */
  const unlockedIds = React.useMemo(
    () =>
      new Set<string>(
        (
          [
            completed >= 1   ? "first-steps"     : null,
            streakDays >= 3  ? "on-fire"          : null,
            xp >= 20         ? "code-breaker"     : null,
            activityDays >= 3 ? "theory-master"   : null,
            streakDays >= 7  ? "week-warrior"     : null,
            completed >= 2   ? "python-padawan"   : null,
            varsCompleted    ? "data-apprentice"  : null,
          ] as (string | null)[]
        ).filter((x): x is string => x !== null),
      ),
    [completed, streakDays, xp, activityDays, varsCompleted],
  );

  /* ── Recent activity (7 most-recent days with activity) ── */
  const recentActivity = Object.entries(activity)
    .filter(([, mins]) => mins > 0)
    .sort(([a], [b]) => (a > b ? -1 : 1))
    .slice(0, 7);

  /* ── Dynamic copy ── */
  const headline =
    streakDays > 0
      ? `Day ${streakDays} — keep the fire alive.`
      : completed > 0
      ? "Great progress. Keep the momentum."
      : "Your data science journey starts now.";

  const subCopy = nextUncompleted
    ? `Next up: ${nextUncompleted.title} · ${nextUncompleted.estimatedTime}`
    : "You've completed the current track. New modules coming soon.";

  /* ── Quick actions (computed inside render for dynamic hrefs) ── */
  const QUICK_ACTIONS: QuickAction[] = [
    {
      Icon: Zap,
      label: "Continue Lesson",
      sublabel: resumeLesson.title,
      iconCls: "text-violet-600 dark:text-violet-400",
      bgCls: "bg-violet-500/10 group-hover:bg-violet-500/20",
      href: resumeHref,
    },
    {
      Icon: Target,
      label: "Daily Challenge",
      sublabel: nextUncompleted ? nextUncompleted.title : "All caught up!",
      iconCls: "text-amber-600 dark:text-amber-400",
      bgCls: "bg-amber-500/10 group-hover:bg-amber-500/20",
      href: nextUncompleted
        ? `/course/${nextUncompleted.courseSlug}/${nextUncompleted.moduleSlug}/${nextUncompleted.slug}`
        : resumeHref,
    },
    {
      Icon: BookOpen,
      label: "Review Theory",
      sublabel: "Reinforce key concepts",
      iconCls: "text-sky-600 dark:text-sky-400",
      bgCls: "bg-sky-500/10 group-hover:bg-sky-500/20",
      href: resumeHref,
    },
    {
      Icon: Code2,
      label: "Build a Project",
      sublabel: "Apply your skills",
      iconCls: "text-emerald-600 dark:text-emerald-400",
      bgCls: "bg-emerald-500/10 group-hover:bg-emerald-500/20",
      href: "/",
    },
  ];

  /* ── Milestones ── */
  const MILESTONES = [
    {
      Icon: Trophy,
      iconCls: "text-violet-600 dark:text-violet-400",
      label: `Reach Level ${level + 1}`,
      sublabel: `${xpToNext} XP to go`,
      value: levelPct,
      colorClass: "bg-violet-500",
    },
    {
      Icon: Flame,
      iconCls: "text-amber-600 dark:text-amber-400",
      label: "7-Day Streak",
      sublabel: streakDays >= 7 ? "Achieved!" : `${7 - streakDays} more ${7 - streakDays === 1 ? "day" : "days"} to go`,
      value: Math.min(100, (streakDays / 7) * 100),
      colorClass: "bg-amber-500",
    },
    {
      Icon: CheckCircle2,
      iconCls: "text-emerald-600 dark:text-emerald-400",
      label: "Complete Python Foundations",
      sublabel: `${completed} of ${lessons.length} lessons done`,
      value: courseProgress,
      colorClass: "bg-emerald-500",
    },
    {
      Icon: TrendingUp,
      iconCls: "text-sky-600 dark:text-sky-400",
      label: "30-Day Streak",
      sublabel: streakDays >= 30 ? "Achieved!" : `${30 - Math.min(30, streakDays)} more days to go`,
      value: Math.min(100, (streakDays / 30) * 100),
      colorClass: "bg-sky-500",
    },
  ];

  /* ── Stat tiles ── */
  const STAT_TILES: Array<{
    label: string;
    value: string;
    sublabel: string;
    color: string;
    Icon: React.ComponentType<{ className?: string }>;
  }> = [
    { label: "Lessons Done",    value: `${completed}/${lessons.length}`, sublabel: "of total lessons",     color: "text-emerald-600 dark:text-emerald-400", Icon: CheckCircle2 },
    { label: "Day Streak",      value: String(streakDays),               sublabel: "consecutive days",      color: "text-amber-600 dark:text-amber-400",   Icon: Flame        },
    { label: "Coding Problems", value: "0",                              sublabel: "coming soon",            color: "text-violet-600 dark:text-violet-400",  Icon: Code2        },
    { label: "Hours Studied",   value: `${hoursTotal}h`,                 sublabel: "total learning time",   color: "text-sky-600 dark:text-sky-400",     Icon: Clock        },
  ];

  return (
    <div className="flex min-h-screen bg-[var(--bg-base)]">
      <Sidebar />
      <main className="flex-1 min-w-0 overflow-auto">

        {/* ════════════════════════════════════════════════════════
            S1 — PERSONALIZED HERO  (bg-elevated + violet glow)
            ════════════════════════════════════════════════════════ */}
        <section
          className="px-6 md:px-8 lg:px-12 py-12 md:py-16"
          style={{
            background:
              "radial-gradient(ellipse 50% 80% at 0% 0%, rgba(139,92,246,0.10) 0%, transparent 70%), var(--bg-elevated)",
          }}
        >
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-10">
            {/* Left: greeting + headline + CTA */}
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-widest text-violet-600 dark:text-violet-400 mb-3">
                {greeting}, Learner
              </p>
              {/* animation slot 1 — hero entrance */}
              <motion.h1
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] leading-tight"
              >
                {headline}
              </motion.h1>
              <p className="text-base text-[var(--text-secondary)] leading-relaxed mt-3 max-w-xl">
                {subCopy}
              </p>
              <div className="flex flex-wrap items-center gap-3 mt-6">
                <Link
                  href={resumeHref}
                  className="inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors duration-150 cursor-pointer select-none bg-violet-500 text-white hover:bg-violet-600 active:bg-violet-700 h-11 px-6 text-base"
                >
                  Continue Learning
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <div className="flex items-center gap-1.5 text-sm text-amber-700 dark:text-amber-400 font-semibold">
                  <Zap className="h-4 w-4" />
                  {xp} XP earned
                </div>
              </div>
            </div>

            {/* Right: streak + level + daily goal */}
            <div className="shrink-0 grid grid-cols-2 gap-3 w-full lg:w-80">
              {/* Streak */}
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/8 p-4 flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 text-[10px] font-bold uppercase tracking-widest">
                  <Flame className="h-3.5 w-3.5" />
                  Streak
                </div>
                <div className="text-4xl font-bold text-amber-600 dark:text-amber-400 leading-none mt-1 tabular-nums">
                  {streakDays}
                </div>
                <div className="text-xs text-[var(--text-muted)]">
                  {streakDays === 1 ? "day" : "days"} in a row
                </div>
              </div>

              {/* Level */}
              <div className="rounded-xl border border-violet-500/20 bg-violet-500/8 p-4 flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-violet-600 dark:text-violet-400 text-[10px] font-bold uppercase tracking-widest">
                  <Trophy className="h-3.5 w-3.5" />
                  Level
                </div>
                <div className="text-4xl font-bold text-violet-600 dark:text-violet-400 leading-none mt-1 tabular-nums">
                  {level}
                </div>
                <div className="text-xs text-[var(--text-muted)]">{xpToNext} XP to next</div>
                <ThinBar value={levelPct} colorClass="bg-violet-500" className="mt-2" />
              </div>

              {/* Daily goal — col-span-2 */}
              <div className="col-span-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-subtle)] p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-secondary)]">
                    <Calendar className="h-3.5 w-3.5" />
                    Today&apos;s Goal
                  </div>
                  <span className="text-xs text-[var(--text-muted)] tabular-nums">
                    {todayMins} / {DAILY_GOAL} min
                  </span>
                </div>
                <ThinBar
                  value={todayPct}
                  colorClass={todayPct >= 100 ? "bg-emerald-500" : "bg-violet-500"}
                />
                {todayPct >= 100 && (
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-1.5 font-medium">
                    Goal reached today ✓
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════
            S2 — WEEKLY LEARNING ACTIVITY  (bg-base)
            ════════════════════════════════════════════════════════ */}
        <Section idx={1} className="bg-[var(--bg-base)]">
          <SectionHead title="Learning Activity" />
          <ActivityHeatmap activity={activity} />
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Hours This Week", value: `${thisWeekHrs}h`,         color: "text-violet-600 dark:text-violet-400" },
              { label: "Lessons This Week", value: String(thisWeekLessons), color: "text-emerald-600 dark:text-emerald-400" },
              { label: "Total Hours",       value: `${hoursTotal}h`,        color: "text-sky-600 dark:text-sky-400"   },
              { label: "Active Days",       value: String(activityDays),    color: "text-amber-600 dark:text-amber-400"  },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-elevated)] px-5 py-4"
              >
                <div className={cn("text-2xl font-bold tabular-nums", stat.color)}>{stat.value}</div>
                <div className="text-xs text-[var(--text-muted)] mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </Section>

        {/* ════════════════════════════════════════════════════════
            S3 — CONTINUE LEARNING CARD  (bg-elevated)
            ════════════════════════════════════════════════════════ */}
        <Section idx={2} className="bg-[var(--bg-elevated)]">
          <SectionHead title="Continue Learning" />
          {/* Primary Learning Card — DESIGN.md §4 */}
          <div className="rounded-xl border border-violet-500/30 border-l-4 border-l-violet-500 bg-violet-500/5 p-6 md:p-8">
            <p className="text-[10px] font-bold uppercase tracking-widest text-violet-600 dark:text-violet-400 mb-2">
              Python for Data Science · Foundations
            </p>
            <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
              {resumeLesson.title}
            </h3>
            <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--text-muted)] mb-6">
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {resumeLesson.estimatedTime}
              </span>
              <span>·</span>
              <span>{resumeLesson.difficulty}</span>
              <span>·</span>
              <span>{resumeLesson.xpReward} XP reward</span>
            </div>

            <div className="mb-5">
              <div className="flex items-center justify-between mb-1.5 text-xs text-[var(--text-muted)]">
                <span>Course progress</span>
                <span>{completed} of {lessons.length} lessons</span>
              </div>
              <ThinBar value={courseProgress} colorClass="bg-violet-500" />
            </div>

            {nextUncompleted && nextUncompleted.slug !== resumeLesson.slug && (
              <p className="text-sm text-[var(--text-secondary)] mb-6">
                Next milestone:{" "}
                <span className="text-violet-600 dark:text-violet-400 font-medium">{nextUncompleted.title}</span>
              </p>
            )}

            <Link
              href={resumeHref}
              className="inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors duration-150 cursor-pointer select-none bg-violet-500 text-white hover:bg-violet-600 active:bg-violet-700 h-11 px-6 text-base"
            >
              Resume Lesson
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Section>

        {/* ════════════════════════════════════════════════════════
            S4 — LEARNING ROADMAP OVERVIEW  (bg-base)
            ════════════════════════════════════════════════════════ */}
        <Section idx={3} className="bg-[var(--bg-base)]">
          <SectionHead
            title="Your Learning Path"
            action={
              <Link
                href="/curriculum"
                className="text-sm text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300 flex items-center gap-1 transition-colors"
              >
                Full roadmap
                <ChevronRight className="h-4 w-4" />
              </Link>
            }
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {ROADMAP.map((domain, i) => (
              <div
                key={i}
                className={cn(
                  "rounded-xl border p-4 flex flex-col gap-3 transition-colors",
                  domain.active
                    ? "border-violet-500/40 bg-violet-500/8"
                    : "border-[var(--border-color)] bg-[var(--bg-elevated)]",
                  domain.locked && !domain.active && "opacity-55",
                )}
              >
                <div className="flex items-center justify-between">
                  <div className={cn("h-2.5 w-2.5 rounded-full", domain.dot)} />
                  {domain.locked ? (
                    <Lock className="h-3.5 w-3.5 text-[var(--text-muted)]" />
                  ) : domain.active ? (
                    <Badge variant="default">Active</Badge>
                  ) : (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  )}
                </div>
                <div>
                  <div className="text-sm font-semibold text-[var(--text-primary)] leading-snug">
                    {domain.label}
                  </div>
                  <div className="text-xs text-[var(--text-muted)] mt-0.5">{domain.sublabel}</div>
                </div>
                {domain.active && (
                  <ThinBar value={courseProgress} colorClass="bg-violet-500" />
                )}
              </div>
            ))}
          </div>
        </Section>

        {/* ════════════════════════════════════════════════════════
            S5 — STATS CARDS  (bg-elevated)
            ════════════════════════════════════════════════════════ */}
        <Section idx={4} className="bg-[var(--bg-elevated)]">
          <SectionHead title="Your Progress" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {/* XP hero tile — amber, featured */}
            <div className="col-span-2 md:col-span-1 rounded-xl border border-amber-500/20 bg-amber-500/8 p-6 flex flex-col gap-2">
              <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 text-[10px] font-bold uppercase tracking-widest">
                <Zap className="h-4 w-4" />
                Total XP
              </div>
              {/* animation slot 3: XP count-up */}
              <div className="text-5xl font-bold text-amber-600 dark:text-amber-400 leading-none mt-2 tabular-nums">
                {displayXp}
              </div>
              <ThinBar value={levelPct} colorClass="bg-amber-500" className="mt-2" />
              <div className="text-xs text-[var(--text-muted)]">
                Level {level} · {xpToNext} XP to next
              </div>
            </div>

            {STAT_TILES.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-subtle)] p-5 flex flex-col gap-1"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[var(--text-muted)] font-medium">{stat.label}</span>
                  <stat.Icon className={cn("h-4 w-4", stat.color)} />
                </div>
                <div className={cn("text-3xl font-bold mt-2 tabular-nums leading-none", stat.color)}>
                  {stat.value}
                </div>
                <div className="text-xs text-[var(--text-muted)] mt-1">{stat.sublabel}</div>
              </div>
            ))}
          </div>
        </Section>

        {/* ════════════════════════════════════════════════════════
            S6 — ACHIEVEMENTS  (bg-base)
            ════════════════════════════════════════════════════════ */}
        <Section idx={5} className="bg-[var(--bg-base)]">
          <SectionHead
            title="Achievements"
            action={
              <span className="text-sm text-[var(--text-muted)]">
                {unlockedIds.size} / {ACHIEVEMENT_DEFS.length} earned
              </span>
            }
          />
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-3">
            {ACHIEVEMENT_DEFS.map((def) => {
              const unlocked = unlockedIds.has(def.id);
              return (
                <div
                  key={def.id}
                  title={def.description}
                  className={cn(
                    "flex flex-col items-center gap-2 p-3 rounded-xl border text-center transition-opacity",
                    "border-[var(--border-color)] bg-[var(--bg-elevated)]",
                    !unlocked && "opacity-40",
                  )}
                >
                  <div
                    className={cn(
                      "h-10 w-10 rounded-full flex items-center justify-center",
                      unlocked ? def.bgCls : "bg-[var(--bg-subtle)]",
                    )}
                  >
                    {unlocked ? (
                      <def.Icon className={cn("h-5 w-5", def.colorCls)} />
                    ) : (
                      <Lock className="h-4 w-4 text-[var(--text-muted)]" />
                    )}
                  </div>
                  <div className="text-[11px] font-medium text-[var(--text-secondary)] leading-tight">
                    {def.name}
                  </div>
                </div>
              );
            })}
          </div>
          {unlockedIds.size === 0 && (
            <p className="text-sm text-[var(--text-muted)] mt-6 text-center">
              Complete lessons and build streaks to unlock achievements.
            </p>
          )}
        </Section>

        {/* ════════════════════════════════════════════════════════
            S7 — RECOMMENDED NEXT ACTIONS  (bg-elevated)
            ════════════════════════════════════════════════════════ */}
        <Section idx={6} className="bg-[var(--bg-elevated)]">
          <SectionHead title="Recommended Next Steps" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {QUICK_ACTIONS.map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className="group rounded-xl border border-[var(--border-color)] bg-[var(--bg-subtle)] p-5 hover:border-violet-500/30 transition-all duration-200 flex flex-col gap-3"
              >
                <div
                  className={cn(
                    "h-10 w-10 rounded-lg flex items-center justify-center transition-colors",
                    action.bgCls,
                  )}
                >
                  <action.Icon className={cn("h-5 w-5", action.iconCls)} />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-[var(--text-primary)]">
                    {action.label}
                  </div>
                  <div className="text-xs text-[var(--text-muted)] mt-0.5 line-clamp-1">
                    {action.sublabel}
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-[var(--text-muted)] group-hover:text-violet-600 dark:group-hover:text-violet-400 group-hover:translate-x-0.5 transition-all" />
              </Link>
            ))}
          </div>
        </Section>

        {/* ════════════════════════════════════════════════════════
            S8 — RECENT ACTIVITY TIMELINE  (bg-base)
            ════════════════════════════════════════════════════════ */}
        <Section idx={7} className="bg-[var(--bg-base)]">
          <SectionHead title="Recent Activity" />
          {recentActivity.length === 0 ? (
            <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-elevated)] px-6 py-12 text-center">
              <Calendar className="h-8 w-8 text-[var(--text-muted)] mx-auto mb-3" />
              <p className="text-sm font-medium text-[var(--text-secondary)]">No activity yet.</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Start your first lesson to track your learning sessions.
              </p>
            </div>
          ) : (
            <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-elevated)] divide-y divide-[var(--border-color)]">
              {recentActivity.map(([date, mins]) => (
                <div key={date} className="flex items-center gap-4 px-5 py-4">
                  <div className="h-2 w-2 rounded-full bg-violet-500 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-[var(--text-primary)]">
                      {relativeDay(date)}
                    </div>
                    <div className="text-xs text-[var(--text-muted)]">{date}</div>
                  </div>
                  <div className="shrink-0 flex items-center gap-3">
                    <ThinBar
                      value={Math.min(100, (mins / 60) * 100)}
                      colorClass="bg-violet-500"
                      className="w-24 hidden sm:block"
                    />
                    <span className="text-sm font-semibold text-[var(--text-secondary)] tabular-nums w-16 text-right">
                      {mins} min
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Section>

        {/* ════════════════════════════════════════════════════════
            S9 — UPCOMING MILESTONES  (bg-elevated)
            ════════════════════════════════════════════════════════ */}
        <Section idx={8} className="bg-[var(--bg-elevated)]">
          <SectionHead title="Upcoming Milestones" />
          <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-subtle)] divide-y divide-[var(--border-color)]">
            {MILESTONES.map((m, i) => (
              <div key={i} className="flex items-center gap-4 px-6 py-5">
                <div className="h-9 w-9 rounded-lg bg-[var(--bg-elevated)] flex items-center justify-center shrink-0">
                  <m.Icon className={cn("h-5 w-5", m.iconCls)} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-[var(--text-primary)]">{m.label}</div>
                  <div className="text-xs text-[var(--text-muted)] mt-0.5">{m.sublabel}</div>
                  <ThinBar value={m.value} colorClass={m.colorClass} className="mt-2" />
                </div>
                <div className="text-sm font-semibold text-[var(--text-muted)] tabular-nums shrink-0 w-10 text-right">
                  {Math.round(m.value)}%
                </div>
              </div>
            ))}
          </div>
        </Section>

        <div className="h-8 bg-[var(--bg-base)]" />
      </main>
    </div>
  );
}
