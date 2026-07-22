"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?:           string;
  helperText?:      string;
  errorText?:       string;
  wrapperClassName?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, helperText, errorText, wrapperClassName, id, required, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    const isError = Boolean(errorText);

    return (
      <div className={cn("w-full", wrapperClassName)}>
        {label && (
          <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-sa-text">
            {label}
            {required && <span className="ml-0.5 text-brand-red">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          required={required}
          className={cn(
            "flex w-full min-h-[88px] resize-y rounded-xl border bg-white px-3.5 py-2.5 shadow-sa-xs",
            "text-sm text-sa-text placeholder:text-sa-faint",
            "transition-all duration-200 ease-smooth motion-reduce:transition-none",
            "focus:outline-none focus:ring-2 focus:ring-brand-gold/20 focus:border-brand-gold",
            "disabled:cursor-not-allowed disabled:bg-sa-surface disabled:text-sa-muted",
            isError
              ? "border-red-300 bg-red-50/30 focus:ring-red-100 focus:border-red-500"
              : "border-sa-border hover:border-sa-border-strong",
            className
          )}
          {...props}
        />
        {(errorText || helperText) && (
          <p className={cn("mt-1.5 text-xs", isError ? "text-red-500" : "text-gray-400")}>
            {errorText ?? helperText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
