import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionHeadingAlign = "left" | "center";

export interface SectionHeadingProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  align?: SectionHeadingAlign;
  inverted?: boolean;
  titleClassName?: string;
  descriptionClassName?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  inverted = false,
  className,
  titleClassName,
  descriptionClassName,
  ...props
}: SectionHeadingProps) {
  const isCentered = align === "center";

  return (
    <div
      className={cn(
        "space-y-4",
        isCentered && "mx-auto max-w-sa-prose text-center",
        className
      )}
      {...props}
    >
      {eyebrow && (
        <p className={cn("sa-eyebrow", inverted && "text-brand-gold-light")}>
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          "sa-section-heading",
          inverted && "text-white",
          titleClassName
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "sa-lede",
            inverted && "text-white/72",
            descriptionClassName
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
