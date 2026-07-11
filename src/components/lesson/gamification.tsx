"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ArrowRight, Trophy } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useUi } from "@/lib/store/ui";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  XP Float Toast (floating +XP text)                                 */
/* ------------------------------------------------------------------ */
export function XpToast() {
  const toast = useUi((s) => s.xpToast);
  const clear = useUi((s) => s.clearXpToast);

  React.useEffect(() => {
    if (!toast) return;
    const t = setTimeout(clear, 1600);
    return () => clearTimeout(t);
  }, [toast, clear]);

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          key={toast.key}
          initial={{ opacity: 0, y: 0, scale: 0.9 }}
          animate={{ opacity: 1, y: -28, scale: 1 }}
          exit={{ opacity: 0, y: -52, scale: 0.9 }}
          transition={{ duration: 1.4, ease: "easeOut" }}
          className="fixed bottom-24 right-8 z-50 pointer-events-none"
          aria-live="polite"
          aria-label={`+${toast.amount} XP earned`}
        >
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500 text-white text-sm font-bold shadow-lg">
            ⚡ +{toast.amount} XP
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ------------------------------------------------------------------ */
/*  Confetti burst (CSS-only, no external lib)                         */
/* ------------------------------------------------------------------ */
const CONFETTI_COLORS = ["#10B981", "#F59E0B", "#F43F5E", "#60A5FA", "#A78BFA", "#F97316"];

function Confetti() {
  const pieces = React.useMemo(
    () =>
      Array.from({ length: 40 }, (_, i) => ({
        id: i,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        x: Math.random() * 100,
        delay: Math.random() * 0.5,
        dur: 1.2 + Math.random() * 0.8,
        size: 6 + Math.random() * 6,
        rot: Math.random() * 360,
      })),
    [],
  );

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-sm"
          style={{
            left: `${p.x}%`,
            top: "-8px",
            width: p.size,
            height: p.size * 0.5,
            background: p.color,
            rotate: p.rot,
          }}
          animate={{
            y: ["0%", "120vh"],
            rotate: [p.rot, p.rot + 360 * (Math.random() > 0.5 ? 1 : -1)],
            opacity: [1, 1, 0],
          }}
          transition={{
            delay: p.delay,
            duration: p.dur,
            ease: "easeIn",
          }}
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Completion Modal                                                    */
/* ------------------------------------------------------------------ */
interface CompletionModalProps {
  isOpen: boolean;
  lessonTitle: string;
  xpEarned: number;
  nextLesson?: { href: string; title: string } | null;
  onClose: () => void;
}

export function CompletionModal({
  isOpen,
  lessonTitle,
  xpEarned,
  nextLesson,
  onClose,
}: CompletionModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70"
            onClick={onClose}
            aria-hidden
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.88, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ type: "spring", stiffness: 280, damping: 22 }}
            role="dialog"
            aria-modal
            aria-labelledby="completion-title"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="relative pointer-events-auto w-full max-w-sm rounded-2xl border border-[var(--border-color)] bg-[var(--bg-elevated)] p-8 text-center shadow-2xl overflow-hidden">
              <Confetti />

              {/* Badge drop animation */}
              <motion.div
                initial={{ y: -60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 220, damping: 14 }}
                className="flex items-center justify-center mb-5"
              >
                <div className="h-20 w-20 rounded-full bg-emerald-500/20 border-2 border-emerald-500/40 flex items-center justify-center">
                  <Trophy className="h-10 w-10 text-emerald-500" aria-hidden />
                </div>
              </motion.div>

              <motion.h2
                id="completion-title"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="text-xl font-bold tracking-tight text-[var(--text-primary)] mb-1"
              >
                Lesson Complete!
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.32 }}
                className="text-sm text-[var(--text-muted)] mb-4"
              >
                {lessonTitle}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, type: "spring" }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/15 border border-amber-500/25 text-amber-500 font-bold text-lg mb-6"
              >
                ⚡ +{xpEarned} XP
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col gap-2"
              >
                {nextLesson ? (
                  <Link href={nextLesson.href} onClick={onClose}>
                    <Button variant="primary" className="w-full gap-2">
                      Next: {nextLesson.title}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                ) : (
                  <div className="text-sm text-[var(--text-muted)]">
                    You&apos;ve reached the end of this module. 🎉
                  </div>
                )}
                <Button variant="ghost" onClick={onClose} className="w-full text-[var(--text-muted)]">
                  Stay on this lesson
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ------------------------------------------------------------------ */
/*  Mastery Lock Button                                                 */
/* ------------------------------------------------------------------ */
interface MasteryGateButtonProps {
  masteryPct: number;
  onComplete: () => void;
  loading?: boolean;
}

export function MasteryGateButton({
  masteryPct,
  onComplete,
  loading,
}: MasteryGateButtonProps) {
  const unlocked = masteryPct >= 80;

  return (
    <div className="flex flex-col items-center gap-3 py-8">
      <div className="h-px w-full bg-[var(--border-color)]" />
      <div
        className={cn(
          "text-xs text-center",
          unlocked ? "text-emerald-500" : "text-[var(--text-muted)]",
        )}
      >
        {unlocked
          ? "Mastery gate unlocked! You can now mark this lesson complete."
          : `Complete ${Math.max(0, Math.round(80 - masteryPct))}% more exercises to unlock.`}
      </div>
      <Button
        variant={unlocked ? "success" : "secondary"}
        size="lg"
        onClick={unlocked ? onComplete : undefined}
        loading={loading}
        disabled={!unlocked}
        className={cn("gap-2", !unlocked && "cursor-not-allowed")}
        aria-label={
          unlocked ? "Mark lesson as complete" : "Complete exercises to unlock"
        }
      >
        {unlocked ? (
          <CheckCircle2 className="h-4 w-4" />
        ) : (
          <svg
            className="h-4 w-4 text-[var(--text-muted)]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        )}
        Mark as Complete & Continue
      </Button>
    </div>
  );
}
