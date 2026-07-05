"use client";

import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

export const SelectRoot     = SelectPrimitive.Root;
export const SelectGroup    = SelectPrimitive.Group;
export const SelectValue    = SelectPrimitive.Value;
export const SelectPortal   = SelectPrimitive.Portal;

export function SelectTrigger({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>) {
  return (
    <SelectPrimitive.Trigger
      className={cn(
        "flex h-10 w-full items-center justify-between gap-2",
        "rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900",
        "placeholder:text-gray-400 transition-all duration-150",
        "hover:border-gray-300",
        "focus:outline-none focus:ring-2 focus:ring-brand-gold/20 focus:border-brand-gold",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "[&>span]:line-clamp-1",
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDown className="h-4 w-4 text-gray-400 shrink-0" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

export function SelectContent({
  className,
  children,
  position = "popper",
  ...props
}: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        className={cn(
          "relative z-50 min-w-[8rem] overflow-hidden",
          "bg-white rounded-xl border border-gray-200 shadow-sa-lg",
          "data-[state=open]:animate-scale-in data-[state=closed]:animate-scale-out",
          "data-[side=bottom]:translate-y-1 data-[side=top]:-translate-y-1",
          position === "popper" &&
            "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
          className
        )}
        position={position}
        {...props}
      >
        <SelectPrimitive.ScrollUpButton className="flex h-6 items-center justify-center bg-white text-gray-400">
          <ChevronUp className="h-4 w-4" />
        </SelectPrimitive.ScrollUpButton>
        <SelectPrimitive.Viewport
          className={cn(
            "p-1",
            position === "popper" &&
              "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectPrimitive.ScrollDownButton className="flex h-6 items-center justify-center bg-white text-gray-400">
          <ChevronDown className="h-4 w-4" />
        </SelectPrimitive.ScrollDownButton>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

export function SelectLabel({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      className={cn("px-3 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider", className)}
      {...props}
    />
  );
}

export function SelectItem({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center rounded-lg px-3 py-2 text-sm",
        "text-gray-700 outline-none",
        "data-[highlighted]:bg-brand-gold/8 data-[highlighted]:text-gray-900",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      )}
      {...props}
    >
      <span className="absolute right-3 flex h-3.5 w-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <Check className="h-3.5 w-3.5 text-brand-gold" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}

export function SelectSeparator({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      className={cn("-mx-1 my-1 h-px bg-gray-100", className)}
      {...props}
    />
  );
}

// Convenience wrapper for simple use cases
interface SimpleSelectProps {
  value:        string;
  onValueChange:(val: string) => void;
  placeholder?: string;
  label?:       string;
  disabled?:    boolean;
  className?:   string;
  children:     React.ReactNode;
}

export function Select({
  value,
  onValueChange,
  placeholder,
  label,
  disabled,
  className,
  children,
}: SimpleSelectProps) {
  return (
    <div className={cn("w-full", className)}>
      {label && (
        <span className="block text-sm font-medium text-gray-700 mb-1.5">{label}</span>
      )}
      <SelectRoot value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder ?? "Select…"} />
        </SelectTrigger>
        <SelectContent>{children}</SelectContent>
      </SelectRoot>
    </div>
  );
}
