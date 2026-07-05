"use client";

import { cn } from "@/lib/utils";
import { Button } from "./button";

interface EmptyStateProps {
  icon?:        React.ReactNode;
  title:        string;
  description?: string;
  action?:      {
    label:   string;
    onClick: () => void;
    loading?: boolean;
  };
  secondaryAction?: {
    label:   string;
    onClick: () => void;
  };
  className?: string;
  size?:      "sm" | "md" | "lg";
}

const sizeMap = {
  sm: { wrapper: "py-8 px-6", icon: "h-10 w-10", title: "text-sm font-semibold", desc: "text-xs" },
  md: { wrapper: "py-12 px-8", icon: "h-12 w-12", title: "text-base font-semibold", desc: "text-sm" },
  lg: { wrapper: "py-16 px-8", icon: "h-14 w-14", title: "text-lg font-semibold", desc: "text-sm" },
};

export function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
  className,
  size = "md",
}: EmptyStateProps) {
  const s = sizeMap[size];

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center",
        s.wrapper,
        className
      )}
    >
      {icon && (
        <div
          className={cn(
            "flex items-center justify-center rounded-2xl bg-gray-100 text-gray-400 mb-4",
            s.icon
          )}
        >
          {icon}
        </div>
      )}
      <p className={cn("text-gray-800", s.title)}>{title}</p>
      {description && (
        <p className={cn("mt-1.5 text-gray-500 max-w-xs leading-relaxed", s.desc)}>
          {description}
        </p>
      )}
      {(action || secondaryAction) && (
        <div className="mt-5 flex items-center gap-3">
          {action && (
            <Button
              size="sm"
              onClick={action.onClick}
              loading={action.loading}
            >
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button
              size="sm"
              variant="ghost"
              onClick={secondaryAction.onClick}
            >
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
