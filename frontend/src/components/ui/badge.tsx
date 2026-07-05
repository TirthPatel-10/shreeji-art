"use client";

import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const badgeVariants = cva(
  "inline-flex items-center gap-1 font-medium rounded-full transition-colors",
  {
    variants: {
      variant: {
        gold:    "bg-brand-gold/10 text-brand-gold-dark border border-brand-gold/20",
        navy:    "bg-brand-navy/10 text-brand-navy border border-brand-navy/20",
        red:     "bg-brand-red/10 text-brand-red border border-brand-red/20",
        success: "bg-sa-success-bg text-green-700 border border-sa-success-border",
        warning: "bg-sa-warning-bg text-amber-700 border border-sa-warning-border",
        error:   "bg-sa-error-bg text-red-600 border border-sa-error-border",
        info:    "bg-sa-info-bg text-blue-600 border border-sa-info-border",
        gray:    "bg-gray-100 text-gray-600 border border-gray-200",
        outline: "border border-gray-300 text-gray-600 bg-transparent",
      },
      size: {
        sm: "text-xs px-2 py-0.5",
        md: "text-xs px-2.5 py-1",
        lg: "text-sm px-3 py-1",
      },
      dot: {
        true:  "",
        false: "",
      },
    },
    defaultVariants: {
      variant: "gray",
      size:    "md",
      dot:     false,
    },
  }
);

const dotColors: Record<string, string> = {
  gold:    "bg-brand-gold",
  navy:    "bg-brand-navy",
  red:     "bg-brand-red",
  success: "bg-green-500",
  warning: "bg-amber-500",
  error:   "bg-red-500",
  info:    "bg-blue-500",
  gray:    "bg-gray-400",
  outline: "bg-gray-400",
};

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant = "gray", size, dot, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, size, dot }), className)} {...props}>
      {dot && (
        <span
          className={cn("h-1.5 w-1.5 rounded-full shrink-0", dotColors[variant ?? "gray"])}
        />
      )}
      {children}
    </span>
  );
}

export { badgeVariants };
