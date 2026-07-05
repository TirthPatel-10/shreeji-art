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
          <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1.5">
            {label}
            {required && <span className="ml-0.5 text-brand-red">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          required={required}
          className={cn(
            "flex w-full min-h-[88px] resize-y rounded-lg border bg-white px-3.5 py-2.5",
            "text-sm text-gray-900 placeholder:text-gray-400",
            "transition-all duration-150",
            "focus:outline-none focus:ring-2 focus:ring-brand-gold/20 focus:border-brand-gold",
            "disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400",
            isError
              ? "border-red-300 bg-red-50/30 focus:ring-red-100 focus:border-red-500"
              : "border-gray-200 hover:border-gray-300",
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
