"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const inputVariants = cva(
  [
    "flex w-full bg-white text-sa-text placeholder:text-sa-faint shadow-sa-xs",
    "border rounded-xl transition-all duration-200 ease-smooth motion-reduce:transition-none",
    "focus:outline-none focus:ring-2 focus:ring-brand-gold/20 focus:border-brand-gold",
    "disabled:cursor-not-allowed disabled:bg-sa-surface disabled:text-sa-muted disabled:border-sa-border",
    "read-only:bg-sa-surface read-only:cursor-default",
  ].join(" "),
  {
    variants: {
      state: {
        default: "border-sa-border hover:border-sa-border-strong",
        error:   "border-red-300 bg-red-50/30 hover:border-red-400 focus:ring-red-100 focus:border-red-500",
        success: "border-green-300 hover:border-green-400 focus:ring-green-100 focus:border-green-500",
      },
      inputSize: {
        sm: "h-8  px-3   py-1.5 text-xs rounded-lg",
        md: "h-10 px-3.5 py-2.5 text-sm",
        lg: "h-11 px-4   py-3   text-base",
      },
    },
    defaultVariants: {
      state:     "default",
      inputSize: "md",
    },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "prefix">,
    VariantProps<typeof inputVariants> {
  label?:           string;
  helperText?:      string;
  errorText?:       string;
  successText?:     string;
  prefix?:          React.ReactNode;
  suffix?:          React.ReactNode;
  wrapperClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      state,
      inputSize,
      label,
      helperText,
      errorText,
      successText,
      prefix,
      suffix,
      wrapperClassName,
      id,
      required,
      ...props
    },
    ref
  ) => {
    const inputId      = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    const resolvedState = errorText ? "error" : successText ? "success" : state;
    const hintText     = errorText ?? successText ?? helperText;
    const hintColor    = errorText
      ? "text-red-500"
      : successText
      ? "text-green-600"
      : "text-gray-400";

    return (
      <div className={cn("w-full", wrapperClassName)}>
        {label && (
          <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-sa-text">
            {label}
            {required && <span className="ml-0.5 text-brand-red">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          {prefix && (
            <div className="pointer-events-none absolute left-3 flex items-center text-gray-400">
              {prefix}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            required={required}
            className={cn(
              inputVariants({ state: resolvedState, inputSize }),
              prefix && "pl-9",
              suffix && "pr-9",
              className
            )}
            {...props}
          />
          {suffix && (
            <div className="pointer-events-none absolute right-3 flex items-center text-gray-400">
              {suffix}
            </div>
          )}
        </div>
        {hintText && (
          <p className={cn("mt-1.5 text-xs", hintColor)}>{hintText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
