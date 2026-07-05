"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?:       string;
  description?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, description, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex items-start gap-2.5">
        <input
          ref={ref}
          type="checkbox"
          id={inputId}
          className={cn(
            "mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300",
            "accent-brand-gold",
            "cursor-pointer",
            "focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-1",
            "disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          {...props}
        />
        {(label || description) && (
          <div className="min-w-0">
            {label && (
              <label
                htmlFor={inputId}
                className="block text-sm font-medium text-gray-700 cursor-pointer leading-none"
              >
                {label}
              </label>
            )}
            {description && (
              <p className="mt-0.5 text-xs text-gray-400 leading-relaxed">{description}</p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";
