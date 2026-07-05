"use client";

import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const cardVariants = cva("rounded-xl transition-all duration-200", {
  variants: {
    variant: {
      default:     "bg-white border border-gray-100 shadow-sa-sm",
      elevated:    "bg-white shadow-sa-md border border-gray-50",
      bordered:    "bg-white border border-gray-200",
      ghost:       "bg-gray-50/80",
      glass:       "glass border border-white/20 shadow-sa-md",
      navy:        "bg-brand-navy border border-white/10 text-white",
      gold:        "bg-gradient-to-br from-brand-gold to-brand-gold-dark text-white shadow-sa-md",
    },
    interactive: {
      true:  "cursor-pointer hover:shadow-sa-md hover:-translate-y-0.5 active:translate-y-0 active:shadow-sa-sm",
      false: "",
    },
    padding: {
      none: "",
      xs:   "p-3",
      sm:   "p-4",
      md:   "p-5",
      lg:   "p-6",
      xl:   "p-8",
    },
  },
  defaultVariants: {
    variant:     "default",
    interactive: false,
    padding:     "md",
  },
});

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

export function Card({ className, variant, interactive, padding, ...props }: CardProps) {
  return (
    <div
      className={cn(cardVariants({ variant, interactive, padding }), className)}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex items-start justify-between gap-3 mb-4", className)}
      {...props}
    />
  );
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("font-semibold text-gray-900 leading-snug", className)}
      {...props}
    />
  );
}

export function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-sm text-gray-500 leading-relaxed mt-0.5", className)}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("", className)} {...props} />;
}

export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 pt-4 mt-4 border-t border-gray-100",
        className
      )}
      {...props}
    />
  );
}
