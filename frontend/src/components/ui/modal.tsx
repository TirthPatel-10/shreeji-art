"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const sizeMap = {
  sm:   "max-w-sm",
  md:   "max-w-md",
  lg:   "max-w-lg",
  xl:   "max-w-xl",
  "2xl":"max-w-2xl",
  full: "max-w-3xl",
};

export interface ModalProps {
  open:           boolean;
  onOpenChange:   (open: boolean) => void;
  title?:         string;
  description?:   string;
  children:       React.ReactNode;
  className?:     string;
  size?:          keyof typeof sizeMap;
  hideClose?:     boolean;
  hideHeader?:    boolean;
}

export function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  className,
  size = "md",
  hideClose = false,
  hideHeader = false,
}: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          className={cn(
            "fixed inset-0 z-50 bg-black/40",
            "backdrop-blur-[2px]",
            "data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out"
          )}
        />
        <Dialog.Content
          className={cn(
            "fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)]",
            "-translate-x-1/2 -translate-y-1/2",
            "bg-white rounded-2xl shadow-sa-xl border border-gray-100",
            "data-[state=open]:animate-scale-in data-[state=closed]:animate-scale-out",
            "focus:outline-none",
            sizeMap[size],
            className
          )}
        >
          {!hideHeader && (title || !hideClose) && (
            <div className="flex items-start justify-between gap-4 px-6 pt-6 pb-4 border-b border-gray-100">
              <div className="min-w-0">
                {title && (
                  <Dialog.Title className="text-base font-semibold text-gray-900 leading-snug">
                    {title}
                  </Dialog.Title>
                )}
                {description && (
                  <Dialog.Description className="mt-1 text-sm text-gray-500 leading-relaxed">
                    {description}
                  </Dialog.Description>
                )}
              </div>
              {!hideClose && (
                <Dialog.Close className="shrink-0 -mt-0.5 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-gold">
                  <X size={15} strokeWidth={2} />
                </Dialog.Close>
              )}
            </div>
          )}
          <div className="p-6">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function ModalFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex items-center justify-end gap-3 pt-4 mt-2 border-t border-gray-100",
        className
      )}
      {...props}
    />
  );
}

export const ModalTrigger = Dialog.Trigger;
