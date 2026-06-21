import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  bordered?: boolean;
}

export function Card({ className, hover = true, bordered = true, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-surface-secondary border border-border-light p-5 transition-all duration-300",
        hover && "hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 hover:-translate-y-0.5",
        bordered && "border-border-light",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
