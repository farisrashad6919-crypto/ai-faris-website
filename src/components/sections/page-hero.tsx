import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  aside?: ReactNode;
  actions?: ReactNode;
  className?: string;
};

export function PageHero({
  eyebrow,
  title,
  description,
  aside,
  actions,
  className,
}: PageHeroProps) {
  return (
    <section className={cn("section-space pb-12", className)}>
      <div className="container-shell grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_22rem] lg:items-end">
        <div className="space-y-6">
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="max-w-4xl text-4xl leading-tight sm:text-5xl md:text-6xl">
            {title}
          </h1>
          <p className="muted-copy max-w-2xl text-lg leading-8">
            {description}
          </p>
          {actions ? (
            <div className="flex flex-wrap items-center gap-4">{actions}</div>
          ) : null}
        </div>
        {aside ? (
          <aside className="paper-panel rounded-lg p-6">{aside}</aside>
        ) : null}
      </div>
    </section>
  );
}
