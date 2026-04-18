import type { CSSProperties, ReactNode } from "react";

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
  return (
    <div
      className={cn("reveal-soft", className)}
      id={id}
      style={{ "--reveal-delay": `${delay}s` } as CSSProperties}
    >
      {children}
    </div>
  );
}
