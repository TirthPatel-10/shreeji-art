"use client";

import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "rect" | "circle" | "text" | "avatar";
  lines?:   number;
}

export function Skeleton({ className, variant = "rect", lines, ...props }: SkeletonProps) {
  if (variant === "text" && lines && lines > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-4 rounded-md animate-shimmer",
              i === lines - 1 ? "w-3/4" : "w-full",
              className
            )}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "animate-shimmer",
        variant === "circle" && "rounded-full",
        variant === "text"   && "h-4 rounded-md",
        (variant === "rect" || variant === "avatar") && "rounded-xl",
        variant === "avatar" && "rounded-full",
        className
      )}
      {...props}
    />
  );
}

// Pre-built skeleton patterns
export function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sa-xs p-5 space-y-3">
      <div className="flex items-center gap-3">
        <Skeleton variant="circle" className="h-10 w-10 shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" className="w-2/3" />
          <Skeleton variant="text" className="w-1/2 h-3" />
        </div>
      </div>
      <Skeleton className="h-20" />
      <div className="flex gap-2">
        <Skeleton className="h-8 w-20 rounded-lg" />
        <Skeleton className="h-8 w-20 rounded-lg" />
      </div>
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 px-4 py-3">
      <Skeleton variant="circle" className="h-8 w-8 shrink-0" />
      <div className="flex-1 space-y-1.5">
        <Skeleton variant="text" className="w-1/3" />
        <Skeleton variant="text" className="w-1/4 h-3" />
      </div>
      <Skeleton className="h-6 w-16 rounded-full" />
      <Skeleton className="h-7 w-12 rounded-lg" />
    </div>
  );
}
