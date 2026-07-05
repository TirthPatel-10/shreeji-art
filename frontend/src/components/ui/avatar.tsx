"use client";

import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { useState } from "react";

const avatarVariants = cva(
  "inline-flex shrink-0 items-center justify-center rounded-full font-semibold uppercase select-none overflow-hidden",
  {
    variants: {
      size: {
        xs:  "h-6  w-6  text-[10px]",
        sm:  "h-8  w-8  text-xs",
        md:  "h-10 w-10 text-sm",
        lg:  "h-12 w-12 text-base",
        xl:  "h-16 w-16 text-lg",
        "2xl":"h-20 w-20 text-xl",
      },
      color: {
        gold:  "bg-brand-gold/15 text-brand-gold-dark ring-1 ring-brand-gold/20",
        navy:  "bg-brand-navy text-white",
        gray:  "bg-gray-100 text-gray-600",
        green: "bg-green-100 text-green-700",
        blue:  "bg-blue-100 text-blue-700",
      },
    },
    defaultVariants: {
      size:  "md",
      color: "gold",
    },
  }
);

export interface AvatarProps extends VariantProps<typeof avatarVariants> {
  name?:      string;
  src?:       string;
  alt?:       string;
  className?: string;
}

export function Avatar({ name, src, alt, size, color, className }: AvatarProps) {
  const [imgError, setImgError] = useState(false);
  const initials = name
    ? name
        .split(" ")
        .slice(0, 2)
        .map((w) => w[0])
        .join("")
    : "?";

  return (
    <span className={cn(avatarVariants({ size, color }), className)}>
      {src && !imgError ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt ?? name ?? "Avatar"}
          className="h-full w-full object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <span aria-label={name}>{initials}</span>
      )}
    </span>
  );
}
