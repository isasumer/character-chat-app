'use client';

import * as React from "react";
import { Spin } from "antd";
import type { SpinProps } from "antd";
import { cn } from "../../lib/utils";

interface SpinnerProps extends SpinProps {
  size?: "small" | "default" | "large";
}

const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, size = "default", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex items-center justify-center", className)}
      >
        <Spin size={size} {...props} />
      </div>
    );
  }
);
Spinner.displayName = "Spinner";

// Full page loading spinner
const LoadingScreen = ({ message }: { message?: string }) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-white dark:bg-gray-900">
      <Spin size="large" />
      {message && (
        <p className="text-sm text-gray-500 dark:text-gray-400">{message}</p>
      )}
    </div>
  );
};

export { Spinner, LoadingScreen, Spin };

