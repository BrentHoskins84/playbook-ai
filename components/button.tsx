import { cn } from "@/utils/cn";
import { Button } from "./ui/button";

export function CustonButton({
  children,
  variant = "solid",
  size = "md",
  isLoading = false,
  className,
  ...props
}: {
  children: React.ReactNode;
  variant?: "solid" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <Button
      className={cn(
        // Base styles based on variant
        variant === "solid" && "btn-solid",
        variant === "outline" && "btn-outline",
        variant === "ghost" && "btn-ghost",
        // Size styles
        size === "sm" && "btn-sm",
        size === "md" && "btn-md",
        size === "lg" && "btn-lg",
        // Loading state
        isLoading && "btn-loading",
        className
      )}
      disabled={isLoading || props.disabled}
      {...props}
    >
      Get Started Free
    </Button>
  );
}
