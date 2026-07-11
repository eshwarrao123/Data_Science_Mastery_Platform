import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "success" | "warning" | "error" | "muted";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variants: Record<BadgeVariant, string> = {
  default: "bg-[var(--bg-subtle)] text-[var(--text-secondary)] border border-[var(--border-color)]",
  success: "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20",
  warning: "bg-amber-500/10 text-amber-500 border border-amber-500/20",
  error: "bg-rose-500/10 text-rose-500 border border-rose-500/20",
  muted: "bg-[var(--bg-subtle)] text-[var(--text-muted)] border border-[var(--border-color)]",
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
