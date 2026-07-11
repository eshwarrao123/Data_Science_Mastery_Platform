"use client";

import * as React from "react";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import {
  Flame,
  BookOpen,
  Star,
  Clock,
  Trophy,
  ArrowRight,
  Play,
  Zap,
  Target,
} from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProgressBar, CircularProgress } from "@/components/ui/progress";
import { useProgress, completedCount } from "@/lib/store/progress";
import { curriculum, allLessons } from "@/lib/data/curriculum";
import { cn } from "@/lib/utils";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.35, ease: "easeOut" as const },
  }),
};

/* ------------------------------------------------------------------ */
/*  GitHub-style Activity Heatmap                                       */
/* ------------------------------------------------------------------ */
function ActivityHeatmap({ activity }: { activity: Record<string, number> }) {
  const days: { date: string; minutes: number }[] = [];
  const today = new Date();
  for (let i = 51 * 7; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    days.push({ date: key, minutes: activity[key] ?? 0 });
  }

  const maxMin = Math.max(...days.map((d) => d.minutes), 1);
  const cols: { date: string; minutes: number }[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    cols.push(days.slice(i, i + 7));
  }

  function intensity(minutes: number) {
    if (minutes === 0) return "bg-[var(--bg-subtle)]";
    const r = minutes / maxMin;
    if (r < 0.25) return "bg-emerald-500/20";
    if (r < 0.5) return "bg-emerald-500/40";
    if (r < 0.75) return "bg-emerald-500/70";
    return "bg-emerald-500";
  }

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-1 min-w-max">
        {cols.map((col, ci) => (
          <div key={ci} className="flex flex-col gap-1">
            {col.map((d) => (
              <div
                key={d.date}
                title={`${d.date}: ${d.minutes} mins`}
                className={cn("h-3 w-3 rounded-[2px] transition-colors", intensity(d.minutes))}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-1.5 mt-2">
        <span className="text-[10px] text-[var(--text-muted)]">Less</span>
        {["bg-[var(--bg-subtle)]", "bg-emerald-500/20", "bg-emerald-500/40", "bg-emerald-500/70", "bg-emerald-500"].map((c) => (
          <div key={c} className={cn("h-3 w-3 rounded-[2px]", c)} />
        ))}
        <span className="text-[10px] text-[var(--text-muted)]">More</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Achievement Badge                                                   */
/* ------------------------------------------------------------------ */
const ALL_ACHIEVEMENTS = [
  { slug: "first_lesson", title: "First Step", icon: "🎯", desc: "Completed your first lesson" },
  { slug: "week_streak", title: "On Fire", icon: "🔥", desc: "7-day learning streak" },
  { slug: "first_project", title: "Builder", icon: "🏗️", desc: "Submitted first project" },
  { slug: "python_done", title: "Pythonista", icon: "🐍", desc: "Completed Python course" },
  { slug: "sql_done", title: "Query Master", icon: "📊", desc: "Completed SQL module" },
  { slug: "100xp", title: "XP Hunter", icon: "⚡", desc: "Earned 100 XP" },
];

/* ------------------------------------------------------------------ */
/*  Page                                                                */
/* ------------------------------------------------------------------ */
export default function DashboardPage() {
  const lessons = useProgress((s) => s.lessons);
  const xp = useProgress((s) => s.xp);
  const streakDays = useProgress((s) => s.streakDays);
  const lastViewedLesson = useProgress((s) => s.lastViewedLesson);
  const activity = useProgress((s) => s.activity);
  const unlockedAchievements = useProgress((s) => s.unlockedAchievements);

  const completed = completedCount(lessons);
  const allLessonsList = allLessons();
  const totalLessons = allLessonsList.length;

  /* Daily goal: 20 mins */
  const todayKey = new Date().toISOString().slice(0, 10);
  const todayMins = activity[todayKey] ?? 0;
  const dailyGoal = 20;
  const dailyProgress = Math.min(100, (todayMins / dailyGoal) * 100);

  /* Last viewed lesson link */
  const lastLesson = lastViewedLesson
    ? allLessonsList.find((l) => l.slug === lastViewedLesson)
    : allLessonsList[0];

  /* Up next 3 */
  const upNext = allLessonsList
    .filter((l) => lessons[l.slug]?.status !== "completed")
    .slice(0, 3);

  const hoursLearned = Math.round(
    Object.values(activity).reduce((a, b) => a + b, 0) / 60,
  );

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      {/* Main */}
      <main className="flex-1 md:ml-64 px-4 md:px-8 py-8 max-w-7xl">
        {/* Header */}
        <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible" className="mb-8">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-[var(--text-primary)]">
                Welcome back, Learner 👋
              </h1>
              <p className="text-[var(--text-secondary)] mt-1">
                {streakDays > 0
                  ? `You're on a ${streakDays}-day streak. Keep it up.`
                  : "Start a lesson today to begin your streak."}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <CircularProgress
                value={dailyProgress}
                size={80}
                label={`${Math.round(dailyProgress)}%`}
                sublabel="daily goal"
              />
              <div className="flex items-center gap-2 text-amber-500">
                <Flame className="h-5 w-5" />
                <span className="text-2xl font-bold">{streakDays}</span>
                <span className="text-sm text-[var(--text-muted)]">days</span>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left column (2/3 width) */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Continue learning */}
            {lastLesson && (
              <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible">
                <Card className="p-0 overflow-hidden">
                  <div className="p-6 border-b border-[var(--border-color)]">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs text-[var(--text-muted)] font-medium uppercase tracking-wider mb-2">
                          Continue where you left off
                        </p>
                        <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                          {lastLesson.title}
                        </h2>
                        <div className="flex items-center gap-3 mt-2 flex-wrap">
                          <Badge variant="muted">
                            <Clock className="h-3 w-3" />
                            {lastLesson.estimatedTime}
                          </Badge>
                          <Badge
                            variant={
                              lastLesson.difficulty === "Beginner"
                                ? "success"
                                : lastLesson.difficulty === "Intermediate"
                                ? "warning"
                                : "error"
                            }
                          >
                            {lastLesson.difficulty}
                          </Badge>
                          <Badge variant="default">
                            <Zap className="h-3 w-3 text-amber-500" />
                            +{lastLesson.xpReward} XP
                          </Badge>
                        </div>
                      </div>
                      <Link
                        href={`/course/${lastLesson.courseSlug}/${lastLesson.moduleSlug}/${lastLesson.slug}`}
                      >
                        <Button variant="primary" size="md" className="gap-2 shrink-0">
                          <Play className="h-4 w-4" />
                          Resume
                        </Button>
                      </Link>
                    </div>
                  </div>
                  <div className="px-6 py-3 bg-[var(--bg-subtle)]">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs text-[var(--text-muted)]">
                        {completed} / {totalLessons} lessons complete
                      </span>
                      <span className="text-xs font-medium text-[var(--text-primary)]">
                        {Math.round((completed / totalLessons) * 100)}%
                      </span>
                    </div>
                    <ProgressBar value={(completed / totalLessons) * 100} />
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Activity heatmap */}
            <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible">
              <Card>
                <CardHeader>
                  <CardTitle>Learning Activity</CardTitle>
                  <span className="text-xs text-[var(--text-muted)]">minutes / day · last 52 weeks</span>
                </CardHeader>
                <ActivityHeatmap activity={activity} />
              </Card>
            </motion.div>

            {/* Up next */}
            <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible">
              <Card>
                <CardHeader>
                  <CardTitle>Up Next</CardTitle>
                  <Link href="/curriculum" className="text-xs text-emerald-500 hover:underline">
                    View all
                  </Link>
                </CardHeader>
                <div className="flex flex-col gap-2">
                  {upNext.map((lesson, i) => (
                    <Link
                      key={lesson.id}
                      href={`/course/${lesson.courseSlug}/${lesson.moduleSlug}/${lesson.slug}`}
                      className={cn(
                        "flex items-center gap-4 p-3 rounded-lg -mx-1 px-4",
                        "hover:bg-[var(--bg-subtle)] transition-colors group",
                      )}
                    >
                      <div className="h-7 w-7 rounded-full border border-[var(--border-color)] flex items-center justify-center text-xs font-semibold text-[var(--text-muted)] shrink-0">
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-[var(--text-primary)] truncate">
                          {lesson.title}
                        </div>
                        <div className="text-xs text-[var(--text-muted)]">
                          {lesson.estimatedTime} · {lesson.difficulty}
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-[var(--text-muted)] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Right column (1/3 width) */}
          <div className="flex flex-col gap-6">
            {/* Stats */}
            <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible">
              <Card className="p-4">
                <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Your Statistics</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: Zap, label: "Total XP", value: xp.toLocaleString(), color: "text-amber-500" },
                    { icon: Clock, label: "Hours Learned", value: hoursLearned.toString(), color: "text-sky-400" },
                    { icon: BookOpen, label: "Lessons Done", value: completed.toString(), color: "text-emerald-500" },
                    { icon: Target, label: "Daily Goal", value: `${Math.round(dailyProgress)}%`, color: "text-rose-400" },
                  ].map((stat) => {
                    const Icon = stat.icon;
                    return (
                      <div
                        key={stat.label}
                        className="flex flex-col gap-1 p-3 rounded-lg bg-[var(--bg-subtle)]"
                      >
                        <Icon className={cn("h-4 w-4", stat.color)} />
                        <span className="text-xl font-bold text-[var(--text-primary)] tabular-nums">
                          {stat.value}
                        </span>
                        <span className="text-[10px] text-[var(--text-muted)]">{stat.label}</span>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </motion.div>

            {/* Achievements */}
            <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible">
              <Card className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-[var(--text-primary)]">Achievements</h3>
                  <Trophy className="h-4 w-4 text-amber-500" />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {ALL_ACHIEVEMENTS.map((ach) => {
                    const unlocked = unlockedAchievements.includes(ach.slug);
                    return (
                      <div
                        key={ach.slug}
                        title={`${ach.title}: ${ach.desc}`}
                        className={cn(
                          "flex flex-col items-center gap-1 p-2 rounded-lg border border-[var(--border-color)]",
                          "transition-colors",
                          unlocked
                            ? "bg-amber-500/10 border-amber-500/20"
                            : "bg-[var(--bg-subtle)] opacity-40 grayscale",
                        )}
                      >
                        <span className="text-xl">{ach.icon}</span>
                        <span className="text-[9px] text-center text-[var(--text-muted)] leading-tight">
                          {ach.title}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </motion.div>

            {/* Quick access */}
            <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible">
              <Card className="p-4">
                <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Quick Access</h3>
                <div className="flex flex-col gap-2">
                  {[
                    { href: "/curriculum", label: "Full Roadmap", icon: Star },
                    { href: "/projects", label: "Projects Hub", icon: BookOpen },
                    { href: "/interview-prep", label: "Interview Prep", icon: Zap },
                  ].map(({ href, label, icon: Icon }) => (
                    <Link
                      key={href}
                      href={href}
                      className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-[var(--bg-subtle)] transition-colors text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {label}
                    </Link>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
