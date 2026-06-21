import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "accent" | "warning" | "danger";
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline text-[11px] font-medium",
        variant === "default" && "text-text-muted",
        variant === "accent" && "text-accent",
        variant === "warning" && "text-warning",
        variant === "danger" && "text-danger",
        className
      )}
    >
      {children}
    </span>
  );
}
