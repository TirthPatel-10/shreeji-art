"use client";

import { AlertTriangle, RefreshCw, WifiOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

interface ErrorStateProps {
  title?:       string;
  message?:     string;
  onRetry?:     () => void;
  retrying?:    boolean;
  type?:        "generic" | "network" | "notFound" | "forbidden";
  className?:   string;
  compact?:     boolean;
}

const typeDefaults = {
  generic:    { icon: AlertTriangle, title: "Something went wrong",       message: "An unexpected error occurred." },
  network:    { icon: WifiOff,       title: "Connection problem",          message: "Check your internet connection and try again." },
  notFound:   { icon: AlertTriangle, title: "Not found",                   message: "The resource you're looking for doesn't exist." },
  forbidden:  { icon: AlertTriangle, title: "Access denied",               message: "You don't have permission to view this." },
};

export function ErrorState({
  title,
  message,
  onRetry,
  retrying = false,
  type = "generic",
  className,
  compact = false,
}: ErrorStateProps) {
  const defaults = typeDefaults[type];
  const Icon     = defaults.icon;
  const heading  = title   ?? defaults.title;
  const body     = message ?? defaults.message;

  if (compact) {
    return (
      <div className={cn("flex items-center gap-2 text-sm text-red-600", className)}>
        <Icon className="h-4 w-4 shrink-0" />
        <span>{heading}</span>
        {onRetry && (
          <button
            onClick={onRetry}
            className="ml-1 text-red-500 hover:text-red-700 underline underline-offset-2"
            disabled={retrying}
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center py-12 px-8",
        className
      )}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-400 mb-4">
        <Icon className="h-7 w-7" />
      </div>
      <p className="text-base font-semibold text-gray-800">{heading}</p>
      <p className="mt-1.5 text-sm text-gray-500 max-w-xs leading-relaxed">{body}</p>
      {onRetry && (
        <Button
          size="sm"
          variant="secondary"
          className="mt-5"
          onClick={onRetry}
          loading={retrying}
          leftIcon={<RefreshCw className="h-3.5 w-3.5" />}
        >
          Try again
        </Button>
      )}
    </div>
  );
}
