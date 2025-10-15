"use client";

import * as React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "./button";
import { cn } from "../../lib/utils";

interface ErrorDisplayProps {
  title?: string;
  message: string;
  retry?: () => void;
  className?: string;
}

const ErrorDisplay = React.forwardRef<HTMLDivElement, ErrorDisplayProps>(
  ({ title = "Something went wrong", message, retry, className }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col items-center justify-center gap-4 p-8 text-center",
          className
        )}
      >
        <div className="rounded-full bg-[var(--destructive)]/10 p-3">
          <AlertCircle className="h-8 w-8 text-[var(--destructive)]" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-[var(--muted-foreground)] max-w-md">
            {message}
          </p>
        </div>
        {retry && (
          <Button onClick={retry} variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
        )}
      </div>
    );
  }
);
ErrorDisplay.displayName = "ErrorDisplay";

// Error Boundary Component
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorDisplay
          title="Oops! Something went wrong"
          message={
            this.state.error?.message ||
            "An unexpected error occurred. Please try refreshing the page."
          }
          retry={() => {
            this.setState({ hasError: false, error: undefined });
            window.location.reload();
          }}
        />
      );
    }

    return this.props.children;
  }
}

export { ErrorDisplay, ErrorBoundary };

