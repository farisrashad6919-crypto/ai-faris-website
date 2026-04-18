"use client";

import type { ReactNode } from "react";

import { LazyMotion, domAnimation, m, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
  id?: string;
};

export function Reveal({
  children,
  delay = 0,
  className,
  id,
}: RevealProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return (
      <div className={className} id={id}>
        {children}
      </div>
    );
  }

  return (
    <LazyMotion features={domAnimation}>
      <m.div
        className={cn(className)}
        id={id}
        initial={{ opacity: 0, y: 22 }}
        transition={{ duration: 0.55, delay, ease: "easeOut" }}
        viewport={{ amount: 0.28, once: true }}
        whileInView={{ opacity: 1, y: 0 }}
      >
        {children}
      </m.div>
    </LazyMotion>
  );
}
