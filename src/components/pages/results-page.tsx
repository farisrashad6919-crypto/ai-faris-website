import { getMessages } from "next-intl/server";

import { ButtonLink } from "@/components/ui/button-link";
import { PageHero } from "@/components/sections/page-hero";
import { ExecutiveQuote } from "@/components/sections/executive-quote";
import { Reveal } from "@/components/ui/reveal";
import { SectionShell } from "@/components/sections/section-shell";
import { TestimonialCard } from "@/components/sections/testimonial-card";
import { getBookingHref } from "@/config/site";
import type { Locale } from "@/i18n/routing";
import { getMessageValue } from "@/lib/messages";

type ResultsContent = {
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    asideTitle: string;
    asideItems: string[];
  };
  reviews: {
    eyebrow: string;
    title: string;
    description: string;
    items: Array<{
      quote: string;
      name: string;
      date: string;
      highlight: string;
    }>;
  };
  themes: {
    eyebrow: string;
    title: string;
    description: string;
    items: Array<{ title: string; description: string }>;
  };
  philosophy: {
    eyebrow: string;
    quote: string;
    attribution: string;
    supporting: string;
  };
  cta: {
    eyebrow: string;
    title: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
  };
};

export async function ResultsPage({ locale }: { locale: Locale }) {
  const messages = await getMessages();
  const results = getMessageValue<ResultsContent>(messages, "Results");

  return (
    <>
      <PageHero
        actions={
          <>
            <ButtonLink href={getBookingHref(locale)}>
              {results.cta.primaryCta}
            </ButtonLink>
            <ButtonLink href="/contact" variant="secondary">
              {results.cta.secondaryCta}
            </ButtonLink>
          </>
        }
        aside={
          <div className="space-y-4">
            <h2 className="text-2xl">{results.hero.asideTitle}</h2>
            <ul className="grid gap-3 text-sm leading-6 text-secondary">
              {results.hero.asideItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        }
        description={results.hero.description}
        eyebrow={results.hero.eyebrow}
        title={results.hero.title}
      />

      <SectionShell
        className="bg-surface-container-low/65"
        description={results.reviews.description}
        eyebrow={results.reviews.eyebrow}
        title={results.reviews.title}
      >
        <div className="grid gap-5 lg:grid-cols-3">
          {results.reviews.items.map((item, index) => (
            <Reveal
              className={index % 2 === 1 ? "lg:translate-y-8" : ""}
              delay={index * 0.05}
              key={`${item.name}-${item.date}`}
            >
              <TestimonialCard {...item} />
            </Reveal>
          ))}
        </div>
      </SectionShell>

      <SectionShell
        description={results.themes.description}
        eyebrow={results.themes.eyebrow}
        title={results.themes.title}
      >
        <div className="grid gap-4 md:grid-cols-3">
          {results.themes.items.map((item, index) => (
            <Reveal className="paper-panel rounded-lg p-6" delay={index * 0.05} key={item.title}>
              <h3 className="text-2xl">{item.title}</h3>
              <p className="muted-copy mt-3 text-base leading-7">
                {item.description}
              </p>
            </Reveal>
          ))}
        </div>
      </SectionShell>

      <ExecutiveQuote
        attribution={results.philosophy.attribution}
        eyebrow={results.philosophy.eyebrow}
        quote={results.philosophy.quote}
        supporting={<p>{results.philosophy.supporting}</p>}
      />

      <section className="section-space pt-4">
        <div className="container-shell">
          <Reveal className="paper-panel rounded-[1.5rem] p-8 md:p-10">
            <p className="eyebrow">{results.cta.eyebrow}</p>
            <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
              <div>
                <h2 className="max-w-3xl text-4xl md:text-5xl">
                  {results.cta.title}
                </h2>
                <p className="muted-copy mt-4 max-w-2xl text-base leading-7">
                  {results.cta.description}
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <ButtonLink href={getBookingHref(locale)}>
                  {results.cta.primaryCta}
                </ButtonLink>
                <ButtonLink href="/contact" variant="secondary">
                  {results.cta.secondaryCta}
                </ButtonLink>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
