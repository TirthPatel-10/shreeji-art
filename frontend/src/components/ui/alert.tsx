"use client";

import { useState } from "react";
import { X, CheckCircle2, AlertTriangle, XCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const alertVariants = cva(
  "relative flex items-start gap-3 rounded-xl border px-4 py-3.5 text-sm transition-all",
  {
    variants: {
      variant: {
        info:    "bg-sa-info-bg border-sa-info-border text-blue-800",
        success: "bg-sa-success-bg border-sa-success-border text-green-800",
        warning: "bg-sa-warning-bg border-sa-warning-border text-amber-800",
        error:   "bg-sa-error-bg border-sa-error-border text-red-800",
        neutral: "bg-gray-50 border-gray-200 text-gray-700",
      },
    },
    defaultVariants: { variant: "neutral" },
  }
);

const iconMap = {
  info:    <Info    className="h-4 w-4 mt-0.5 text-blue-500 shrink-0" />,
  success: <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-500 shrink-0" />,
  warning: <AlertTriangle className="h-4 w-4 mt-0.5 text-amber-500 shrink-0" />,
  error:   <XCircle className="h-4 w-4 mt-0.5 text-red-500 shrink-0" />,
  neutral: <Info    className="h-4 w-4 mt-0.5 text-gray-400 shrink-0" />,
};

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  title?:       string;
  dismissible?: boolean;
  icon?:        React.ReactNode;
}

export function Alert({
  className,
  variant = "neutral",
  title,
  dismissible = false,
  icon,
  children,
  ...props
}: AlertProps) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      <span className="shrink-0 mt-0.5">
        {icon ?? iconMap[variant ?? "neutral"]}
      </span>
      <div className="flex-1 min-w-0">
        {title && (
          <p className="font-semibold leading-snug mb-0.5">{title}</p>
        )}
        {children && (
          <div className="leading-relaxed text-[13px] opacity-90">{children}</div>
        )}
      </div>
      {dismissible && (
        <button
          onClick={() => setVisible(false)}
          className="shrink-0 -mt-0.5 -mr-1 p-1 rounded-md opacity-50 hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-current"
          aria-label="Dismiss"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
