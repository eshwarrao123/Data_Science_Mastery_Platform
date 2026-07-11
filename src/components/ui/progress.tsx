"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number; // 0–100
  className?: string;
  color?: "success" | "warning" | "default";
  size?: "sm" | "md";
  animated?: boolean;
}

const colorMap = {
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  default: "bg-[var(--text-primary)]",
};

const heightMap = {
  sm: "h-1",
  md: "h-1.5",
};

export function ProgressBar({
  value,
  className,
  color = "success",
  size = "sm",
  animated = true,
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn(
        "w-full rounded-full bg-[var(--bg-subtle)]",
        heightMap[size],
        className,
      )}
    >
      <motion.div
        className={cn("h-full rounded-full", colorMap[color])}
        initial={animated ? { width: 0 } : false}
        animate={{ width: `${clamped}%` }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />
    </div>
  );
}

/* Circular progress — used on dashboard daily goal */
interface CircularProgressProps {
  value: number; // 0–100
  size?: number; // px
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
}

export function CircularProgress({
  value,
  size = 96,
  strokeWidth = 7,
  label,
  sublabel,
}: CircularProgressProps) {
  const r = (size - strokeWidth * 2) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--bg-subtle)"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--success)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
      {(label || sublabel) && (
        <div className="absolute flex flex-col items-center">
          {label && (
            <span className="text-base font-bold text-[var(--text-primary)]">
              {label}
            </span>
          )}
          {sublabel && (
            <span className="text-[10px] text-[var(--text-muted)]">{sublabel}</span>
          )}
        </div>
      )}
    </div>
  );
}
