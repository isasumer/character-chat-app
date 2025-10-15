"use client";

import * as React from "react";
import { Result } from "antd";
import { RefreshCw } from "lucide-react";
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
          "flex flex-col items-center justify-center p-8",
          className
        )}
      >
        <Result
          status="error"
          title={title}
          subTitle={message}
          extra={
            retry && (
              <Button onClick={retry} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            )
          }
        />
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

export { ErrorDisplay, ErrorBoundary, Result };

