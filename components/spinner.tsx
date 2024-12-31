"use client";

import { cn } from "@/lib/utils";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  label?: string;
  className?: string;
}

export function Spinner({ size = "md", label, className }: SpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-6 w-6 border-2",
    lg: "h-8 w-8 border-4",
  };

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <div
        className={cn(
          "animate-spin rounded-full border-t-primary border-neutral",
          sizeClasses[size]
        )}
        role="status"
        aria-label={label || "Loading"}
      ></div>
      {label && <span className="text-sm text-muted-foreground">{label}</span>}
    </div>
  );
}
