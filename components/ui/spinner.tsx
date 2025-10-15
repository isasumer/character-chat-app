import * as React from "react";
import { cn } from "../../lib/utils";

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "h-4 w-4 border-2",
  md: "h-8 w-8 border-2",
  lg: "h-12 w-12 border-3",
};

const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, size = "md", ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="status"
        aria-label="Loading"
        className={cn("flex items-center justify-center", className)}
        {...props}
      >
        <div
          className={cn(
            "animate-spin rounded-full border-[var(--border)] border-t-[var(--primary)]",
            sizeClasses[size]
          )}
        />
        <span className="sr-only">Loading...</span>
      </div>
    );
  }
);
Spinner.displayName = "Spinner";

// Full page loading spinner
const LoadingScreen = ({ message }: { message?: string }) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-[var(--background)]">
      <Spinner size="lg" />
      {message && (
        <p className="text-sm text-[var(--muted-foreground)]">{message}</p>
      )}
    </div>
  );
};

export { Spinner, LoadingScreen };

