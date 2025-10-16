'use client';

import * as React from "react";
import { Skeleton as AntSkeleton } from "antd";
import { cn } from "../../lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-gray-200 dark:bg-gray-700",
        className
      )}
      {...props}
    />
  );
}

const SkeletonText = ({ lines = 3 }: { lines?: number }) => (
  <AntSkeleton
    active
    paragraph={{ rows: lines }}
    title={false}
  />
);

const SkeletonCard = () => (
  <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 flex flex-col gap-3">
    <div className="flex items-center gap-3">
      <AntSkeleton.Avatar active size={48} />
      <div className="flex-1">
        <AntSkeleton active paragraph={{ rows: 1 }} title={{ width: '33%' }} />
      </div>
    </div>
    <SkeletonText lines={2} />
  </div>
);

const SkeletonMessage = ({ isUser = false }: { isUser?: boolean }) => (
  <div className={cn("flex gap-3", isUser && "flex-row-reverse")}>
    <AntSkeleton.Avatar active size={32} />
    <div className="space-y-2 max-w-[70%] flex-1">
      <AntSkeleton active paragraph={{ rows: 2 }} title={false} />
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
  SkeletonChatList,
  AntSkeleton
};

