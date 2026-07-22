"use client";

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Spinner } from "./spinner";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 font-medium whitespace-nowrap select-none",
    "transition-all duration-200 ease-smooth motion-reduce:transition-none motion-reduce:transform-none",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-40",
    "active:scale-[0.97]",
  ].join(" "),
  {
    variants: {
      variant: {
        primary:
          "bg-brand-gold text-white shadow-sa-sm hover:-translate-y-0.5 hover:bg-brand-gold-dark hover:shadow-sa-gold active:translate-y-0 active:shadow-none",
        secondary:
          "bg-white text-sa-text border border-sa-border shadow-sa-xs hover:-translate-y-0.5 hover:bg-sa-surface hover:border-sa-border-strong hover:shadow-sa-sm active:translate-y-0",
        ghost:
          "text-sa-muted hover:bg-sa-surface hover:text-sa-text",
        danger:
          "bg-red-500 text-white shadow-sa-sm hover:bg-red-600 active:shadow-none",
        outline:
          "border border-brand-gold/50 text-brand-gold bg-transparent hover:-translate-y-0.5 hover:border-brand-gold hover:bg-brand-gold/10 active:translate-y-0",
        navy:
          "bg-brand-navy text-white shadow-sa-sm hover:-translate-y-0.5 hover:bg-brand-navy-light hover:shadow-sa-md active:translate-y-0 active:shadow-none",
        subtle:
          "bg-brand-gold/10 text-brand-gold-dark hover:bg-brand-gold/15 hover:text-brand-gold-dark",
        premium:
          "bg-gradient-to-r from-brand-gold via-brand-gold-light to-brand-gold text-brand-navy shadow-sa-sm hover:-translate-y-0.5 hover:shadow-sa-gold active:translate-y-0 active:shadow-none",
        glass:
          "border border-white/20 bg-white/10 text-white shadow-sa-glass backdrop-blur-xl hover:-translate-y-0.5 hover:bg-white/15 active:translate-y-0",
        link:
          "text-brand-gold underline-offset-4 hover:underline p-0 h-auto shadow-none active:scale-100",
      },
      size: {
        xs:        "h-7  px-2.5 text-xs   rounded-md  gap-1",
        sm:        "h-8  px-3   text-sm   rounded-lg  gap-1.5",
        md:        "h-10 px-4   text-sm   rounded-lg  gap-2",
        lg:        "h-11 px-5   text-base rounded-xl  gap-2",
        xl:        "h-12 px-6   text-base rounded-xl  gap-2.5",
        icon:      "h-10 w-10  rounded-lg",
        "icon-sm": "h-8  w-8   rounded-md",
        "icon-xs": "h-7  w-7   rounded-md",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Button({
  className,
  variant,
  size,
  asChild = false,
  loading = false,
  leftIcon,
  rightIcon,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Spinner size="sm" className="text-current opacity-80" />
      ) : leftIcon ? (
        <span className="shrink-0 opacity-75">{leftIcon}</span>
      ) : null}
      {children}
      {!loading && rightIcon && (
        <span className="shrink-0 opacity-75">{rightIcon}</span>
      )}
    </Comp>
  );
}

export { buttonVariants };
