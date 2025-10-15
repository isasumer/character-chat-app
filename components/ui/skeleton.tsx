import * as React from "react";
import { cn } from "../../lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-[var(--muted)]",
        className
      )}
      {...props}
    />
  );
}

const SkeletonText = ({ lines = 3 }: { lines?: number }) => (
  <div className="space-y-2">
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        className="h-4"
        style={{ width: `${100 - (i === lines - 1 ? 30 : 0)}%` }}
      />
    ))}
  </div>
);

const SkeletonCard = () => (
  <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4 space-y-3">
    <div className="flex items-center gap-3">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
    <SkeletonText lines={2} />
  </div>
);

const SkeletonMessage = ({ isUser = false }: { isUser?: boolean }) => (
  <div className={cn("flex gap-3", isUser && "flex-row-reverse")}>
    <Skeleton className="h-8 w-8 rounded-full shrink-0" />
    <div className="space-y-2 max-w-[70%]">
      <Skeleton className="h-4 w-24" />
      <Skeleton className={cn("h-16 rounded-2xl", isUser ? "ml-auto" : "")} />
    </div>
  </div>
);

const SkeletonChatList = ({ count = 5 }: { count?: number }) => (
  <div className="space-y-3">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

export { 
  Skeleton, 
  SkeletonText, 
  SkeletonCard, 
  SkeletonMessage,
  SkeletonChatList 
};

