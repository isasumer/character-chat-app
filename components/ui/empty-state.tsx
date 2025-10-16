'use client';

import * as React from "react";
import { Empty } from "antd";
import { LucideIcon } from "lucide-react";
import { cn } from "../../lib/utils";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ icon: Icon, title, description, action, className }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col items-center justify-center gap-4 p-8 text-center",
          className
        )}
      >
        <Empty
          image={
            Icon ? (
              <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-4 inline-flex">
                <Icon className="h-8 w-8 text-gray-400 dark:text-gray-500" />
              </div>
            ) : (
              Empty.PRESENTED_IMAGE_SIMPLE
            )
          }
          description={
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {title}
              </h3>
              {description && (
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md">
                  {description}
                </p>
              )}
            </div>
          }
        >
          {action}
        </Empty>
      </div>
    );
  }
);
EmptyState.displayName = "EmptyState";

export { EmptyState, Empty };

