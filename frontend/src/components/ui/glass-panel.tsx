import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type GlassPanelVariant = "light" | "dark";
type GlassPanelPadding = "none" | "sm" | "md" | "lg";

const paddingClasses: Record<GlassPanelPadding, string> = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export interface GlassPanelProps extends HTMLAttributes<HTMLDivElement> {
  variant?: GlassPanelVariant;
  padding?: GlassPanelPadding;
  interactive?: boolean;
}

export function GlassPanel({
  variant = "light",
  padding = "md",
  interactive = false,
  className,
  ...props
}: GlassPanelProps) {
  return (
    <div
      className={cn(
        variant === "dark" ? "sa-glass-panel" : "sa-glass-panel-light",
        paddingClasses[padding],
        interactive && "sa-hover-lift",
        className
      )}
      {...props}
    />
  );
}
