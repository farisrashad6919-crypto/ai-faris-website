import type { ReactNode } from "react";

type ExecutiveQuoteProps = {
  eyebrow: string;
  quote: string;
  attribution: string;
  supporting?: ReactNode;
};

export function ExecutiveQuote({
  eyebrow,
  quote,
  attribution,
  supporting,
}: ExecutiveQuoteProps) {
  return (
    <section className="section-space-sm">
      <div className="container-shell">
        <div className="paper-panel relative overflow-hidden rounded-lg px-6 py-8 md:px-10 md:py-12">
          <div className="absolute inset-y-10 start-0 w-1 bg-on-tertiary-container" />
          <div className="space-y-5 ps-5 md:ps-8">
            <p className="eyebrow">{eyebrow}</p>
            <blockquote className="max-w-4xl font-display text-3xl leading-tight text-primary md:text-4xl">
              {quote}
            </blockquote>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-secondary">
              {attribution}
            </p>
            {supporting ? (
              <div className="muted-copy max-w-2xl text-base leading-7">
                {supporting}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
