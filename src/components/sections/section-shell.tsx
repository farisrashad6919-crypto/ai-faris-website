import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type SectionShellProps = {
  id?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  align?: "start" | "center";
};

export function SectionShell({
  id,
  eyebrow,
  title,
  description,
  children,
  className,
  innerClassName,
  align = "start",
}: SectionShellProps) {
  return (
    <section className={cn("section-space", className)} id={id}>
      <div className="container-shell">
        {(eyebrow || title || description) && (
          <div
            className={cn(
              "mb-12 flex max-w-3xl flex-col gap-4",
              align === "center" && "mx-auto items-center text-center",
            )}
          >
            {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
            {title ? <h2 className="section-title">{title}</h2> : null}
            {description ? (
              <p className="muted-copy max-w-2xl text-base leading-7 md:text-lg">
                {description}
              </p>
            ) : null}
          </div>
        )}
        <div className={innerClassName}>{children}</div>
      </div>
    </section>
  );
}
