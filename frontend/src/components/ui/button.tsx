"use client";

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Spinner } from "./spinner";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 font-medium whitespace-nowrap select-none",
    "transition-all duration-150 ease-quick",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-40",
    "active:scale-[0.97]",
  ].join(" "),
  {
    variants: {
      variant: {
        primary:
          "bg-brand-gold text-white shadow-sa-sm hover:bg-brand-gold-dark active:shadow-none",
        secondary:
          "bg-white text-gray-800 border border-gray-200 shadow-sa-xs hover:bg-gray-50 hover:border-gray-300",
        ghost:
          "text-gray-500 hover:bg-gray-100 hover:text-gray-800",
        danger:
          "bg-red-500 text-white shadow-sa-sm hover:bg-red-600 active:shadow-none",
        outline:
          "border border-brand-gold text-brand-gold bg-transparent hover:bg-brand-gold/5",
        navy:
          "bg-brand-navy text-white shadow-sa-sm hover:bg-brand-navy-light active:shadow-none",
        subtle:
          "bg-brand-gold/10 text-brand-gold-dark hover:bg-brand-gold/15",
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
