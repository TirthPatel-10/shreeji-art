"use client";

import * as LabelPrimitive from "@radix-ui/react-label";
import { cn } from "@/lib/utils";

interface LabelProps extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> {
  required?: boolean;
  optional?: boolean;
}

export function Label({ className, children, required, optional, ...props }: LabelProps) {
  return (
    <LabelPrimitive.Root
      className={cn(
        "block text-sm font-medium text-gray-700 leading-none select-none",
        "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
      {required && <span className="ml-0.5 text-brand-red">*</span>}
      {optional && (
        <span className="ml-1.5 text-xs font-normal text-gray-400">(optional)</span>
      )}
    </LabelPrimitive.Root>
  );
}
