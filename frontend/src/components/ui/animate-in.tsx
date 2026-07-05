"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const fromMap = {
  bottom: {
    hidden: "opacity-0 translate-y-8",
    visible: "opacity-100 translate-y-0",
  },
  top: {
    hidden: "opacity-0 -translate-y-8",
    visible: "opacity-100 translate-y-0",
  },
  left: {
    hidden: "opacity-0 -translate-x-8",
    visible: "opacity-100 translate-x-0",
  },
  right: {
    hidden: "opacity-0 translate-x-8",
    visible: "opacity-100 translate-x-0",
  },
  scale: {
    hidden: "opacity-0 scale-95",
    visible: "opacity-100 scale-100",
  },
  fade: {
    hidden: "opacity-0",
    visible: "opacity-100",
  },
};

interface AnimateInProps {
  children:    React.ReactNode;
  className?:  string;
  delay?:      number;
  duration?:   number;
  from?:       keyof typeof fromMap;
  threshold?:  number;
  once?:       boolean;
  as?:         React.ElementType;
}

export function AnimateIn({
  children,
  className,
  delay     = 0,
  duration  = 700,
  from      = "bottom",
  threshold = 0.12,
  once      = true,
  as: Tag   = "div",
}: AnimateInProps) {
  const ref     = useRef<HTMLElement>(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVis(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setVis(false);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, once]);

  const { hidden, visible } = fromMap[from];

  return (
    <Tag
      ref={ref as React.RefObject<HTMLElement>}
      className={cn(
        "transition-all ease-smooth",
        vis ? visible : hidden,
        className
      )}
      style={{ transitionDuration: `${duration}ms`, transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}
