"use client";

import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const spinnerVariants = cva(
  "animate-spin rounded-full border-solid border-current border-t-transparent shrink-0",
  {
    variants: {
      size: {
        xs: "h-3 w-3 border",
        sm: "h-4 w-4 border-2",
        md: "h-5 w-5 border-2",
        lg: "h-7 w-7 border-[3px]",
        xl: "h-9 w-9 border-4",
      },
    },
    defaultVariants: { size: "md" },
  }
);

interface SpinnerProps extends VariantProps<typeof spinnerVariants> {
  className?: string;
}

export function Spinner({ size, className }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn(spinnerVariants({ size }), className)}
    />
  );
}
