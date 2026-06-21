"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, icon, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-medium transition-all duration-300 select-none",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "active:scale-[0.97]",
          size === "sm" && "h-8 px-3 rounded-lg text-xs",
          size === "md" && "h-9 px-4 rounded-xl text-sm",
          size === "lg" && "h-11 px-5 rounded-xl text-sm",
          variant === "primary" && "bg-accent text-surface hover:bg-accent/90 shadow-[0_4px_16px_rgba(0,0,0,0.2)]",
          variant === "secondary" && "bg-surface-elevated text-text-primary hover:bg-surface-elevated/80 border border-border",
          variant === "ghost" && "text-text-secondary hover:text-text-primary hover:bg-surface-elevated",
          variant === "danger" && "bg-danger/10 text-danger hover:bg-danger/20 border border-danger/20",
          loading && "cursor-wait",
          className
        )}
        {...props}
      >
        {loading ? (
          <svg className="animate-spin size-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : icon ? (
          icon
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
