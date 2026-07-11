import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  as?: React.ElementType;
  onClick?: () => void;
}

export function Card({
  children,
  className,
  hover = false,
  as: Tag = "div",
  onClick,
}: CardProps) {
  return (
    <Tag
      onClick={onClick}
      className={cn(
        "rounded-xl border border-[var(--border-color)] bg-[var(--bg-elevated)] p-6",
        hover &&
          "cursor-pointer transition-colors hover:bg-[var(--bg-subtle)] hover:border-[color-mix(in_srgb,var(--border-color)_150%,transparent)]",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

export function CardHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-start justify-between gap-4 mb-4", className)}>
      {children}
    </div>
  );
}

export function CardTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h3
      className={cn(
        "text-base font-semibold tracking-tight text-[var(--text-primary)]",
        className,
      )}
    >
      {children}
    </h3>
  );
}

export function CardDescription({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn("text-sm text-[var(--text-secondary)] leading-relaxed", className)}
    >
      {children}
    </p>
  );
}
