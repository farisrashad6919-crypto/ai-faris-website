import Image from "next/image";
import {
  ArrowRight,
  BadgeCheck,
  Globe2,
  NotebookPen,
  Sparkles,
} from "lucide-react";
import { getMessages } from "next-intl/server";

import { ButtonLink } from "@/components/ui/button-link";
import { Reveal } from "@/components/ui/reveal";
import { StructuredData } from "@/components/ui/structured-data";
import { ExecutiveQuote } from "@/components/sections/executive-quote";
import { FaqList } from "@/components/sections/faq-list";
import { PortraitMosaic } from "@/components/sections/portrait-mosaic";
import { SectionShell } from "@/components/sections/section-shell";
import { ServiceCard } from "@/components/sections/service-card";
import { TestimonialCard } from "@/components/sections/testimonial-card";
import { getBookingHref, siteConfig } from "@/config/site";
import type { Locale } from "@/i18n/routing";
import { getMessageValue } from "@/lib/messages";
import { getPersonSchema, getProfessionalServiceSchema } from "@/lib/schema";
import { cn } from "@/lib/utils";

type SimpleItem = {
  title: string;
  description: string;
};

type HeroContent = {
  eyebrow: string;
  title: string;
  description: string;
  primaryCta: string;
  secondaryCta: string;
  trustIndicators: Array<{ label: string; value: string }>;
  floatingCard: {
    eyebrow: string;
    title: string;
    description: string;
  };
};

type AuthorityLabels = {
  eyebrow: string;
  title: string;
  description: string;
  items: Array<{ id: string; label: string; note: string }>;
};

type HomeContent = {
  hero: HeroContent;
  about: {
    eyebrow: string;
    title: string;
    description: string;
    pillars: SimpleItem[];
  };
  services: {
    eyebrow: string;
    title: string;
    description: string;
    ctaLabel: string;
    items: Array<{
      title: string;
      description: string;
      audience: string;
      outcomes: string[];
    }>;
  };
  why: {
    eyebrow: string;
    title: string;
    description: string;
    items: SimpleItem[];
  };
  credentials: {
    eyebrow: string;
    title: string;
    description: string;
    items: SimpleItem[];
  };
  testimonials: {
    eyebrow: string;
    title: string;
    description: string;
    items: Array<{
      quote: string;
      name: string;
      date: string;
      highlight: string;
    }>;
    cta: string;
  };
  philosophy: {
    eyebrow: string;
    quote: string;
    attribution: string;
    supporting: string;
  };
  audiences: {
    eyebrow: string;
    title: string;
    description: string;
    items: SimpleItem[];
  };
  faq: {
    eyebrow: string;
    title: string;
    description: string;
    items: Array<{ question: string; answer: string }>;
  };
  finalCta: {
    eyebrow: string;
    title: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
  };
};

export async function HomePage({ locale }: { locale: Locale }) {
  const messages = await getMessages();
  const home = getMessageValue<HomeContent>(messages, "Home");
  const authority = getMessageValue<AuthorityLabels>(messages, "Home.authority");

  const authorityValues = {
    rating: siteConfig.profileSnapshot.reviewRating.toFixed(1),
    reviews: `${siteConfig.profileSnapshot.reviewCount}+`,
    lessons: `${siteConfig.profileSnapshot.lessonCount}+`,
    reach: `${siteConfig.profileSnapshot.countriesReached}+`,
  };

  const description = home.hero.description;

  return (
    <>
      <StructuredData
        data={[
          getPersonSchema(locale, description),
          getProfessionalServiceSchema(locale, description),
        ]}
      />

      <section className="section-space pt-8">
        <div className="container-shell grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(22rem,0.95fr)] lg:items-center">
          <Reveal className="space-y-7">
            <p className="eyebrow">{home.hero.eyebrow}</p>
            <h1 className="max-w-4xl text-5xl leading-[1.05] md:text-7xl">
              {home.hero.title}
            </h1>
            <p className="muted-copy max-w-2xl text-lg leading-8">
              {home.hero.description}
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <ButtonLink href={getBookingHref(locale)}>
                {home.hero.primaryCta}
              </ButtonLink>
              <ButtonLink href="/services" variant="secondary">
                {home.hero.secondaryCta}
                <ArrowRight className="size-4" />
              </ButtonLink>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {home.hero.trustIndicators.map((item) => (
                <div className="glass-panel rounded-md p-4" key={item.label}>
                  <p className="text-2xl font-semibold text-primary">{item.value}</p>
                  <p className="mt-2 text-sm leading-6 text-secondary">{item.label}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal className="relative" delay={0.08}>
            <div className="paper-panel relative overflow-hidden rounded-[1.75rem] p-4 md:p-5">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,221,182,0.42),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.38),transparent)]" />
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.35rem]">
                <Image
                  alt={siteConfig.brandName}
                  className="object-cover"
                  fill
                  preload
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  src={siteConfig.portraitPath}
                  style={{ objectPosition: "78% center" }}
                />
              </div>
            </div>
            <div className="glass-panel absolute -bottom-6 end-3 max-w-xs rounded-lg p-5 md:end-6">
              <p className="eyebrow">{home.hero.floatingCard.eyebrow}</p>
              <p className="mt-3 font-display text-2xl text-primary">
                {home.hero.floatingCard.title}
              </p>
              <p className="mt-2 text-sm leading-6 text-secondary">
                {home.hero.floatingCard.description}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <SectionShell
        className="section-space-sm"
        description={authority.description}
        eyebrow={authority.eyebrow}
        id="authority"
        title={authority.title}
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {authority.items.map((item) => (
            <Reveal className="paper-panel rounded-md p-5" key={item.id}>
              <p className="text-3xl font-semibold text-primary">
                {authorityValues[item.id as keyof typeof authorityValues]}
              </p>
              <p className="mt-3 text-sm font-semibold uppercase tracking-[0.14em] text-secondary">
                {item.label}
              </p>
              <p className="muted-copy mt-2 text-sm leading-6">{item.note}</p>
            </Reveal>
          ))}
        </div>
      </SectionShell>

      <SectionShell
        description={home.about.description}
        eyebrow={home.about.eyebrow}
        id="about-preview"
        title={home.about.title}
      >
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(20rem,0.95fr)] lg:items-center">
          <div className="grid gap-5">
            {home.about.pillars.map((pillar, index) => (
              <Reveal
                className={cn(
                  "paper-panel rounded-lg p-6",
                  index === 0 && "lg:translate-y-6",
                )}
                delay={index * 0.06}
                key={pillar.title}
              >
                <h3 className="text-2xl">{pillar.title}</h3>
                <p className="muted-copy mt-3 text-base leading-7">
                  {pillar.description}
                </p>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.08}>
            <PortraitMosaic />
          </Reveal>
        </div>
      </SectionShell>

      <SectionShell
        className="bg-surface-container-low/70"
        description={home.services.description}
        eyebrow={home.services.eyebrow}
        id="services-preview"
        title={home.services.title}
      >
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {home.services.items.map((service, index) => (
            <Reveal
              className={cn(index === 0 && "xl:col-span-2")}
              delay={index * 0.04}
              key={service.title}
            >
              <ServiceCard
                audience={service.audience}
                ctaLabel={home.services.ctaLabel}
                description={service.description}
                href="/services"
                outcomes={service.outcomes}
                title={service.title}
              />
            </Reveal>
          ))}
        </div>
      </SectionShell>

      <SectionShell
        description={home.why.description}
        eyebrow={home.why.eyebrow}
        id="why"
        title={home.why.title}
      >
        <div className="grid gap-4 md:grid-cols-2">
          {home.why.items.map((item, index) => (
            <Reveal
              className="paper-panel rounded-md p-6"
              delay={index * 0.05}
              key={item.title}
            >
              <div className="flex items-start gap-4">
                <div className="mt-1 rounded-sm bg-tertiary-fixed/55 p-2 text-tertiary">
                  {index % 3 === 0 ? (
                    <BadgeCheck className="size-5" />
                  ) : index % 3 === 1 ? (
                    <NotebookPen className="size-5" />
                  ) : (
                    <Sparkles className="size-5" />
                  )}
                </div>
                <div>
                  <h3 className="text-2xl">{item.title}</h3>
                  <p className="muted-copy mt-3 text-base leading-7">
                    {item.description}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </SectionShell>

      <SectionShell
        className="section-space-sm"
        description={home.credentials.description}
        eyebrow={home.credentials.eyebrow}
        id="credentials"
        title={home.credentials.title}
      >
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.9fr)]">
          {home.credentials.items.map((item, index) => (
            <Reveal
              className={cn(
                "paper-panel rounded-lg p-6",
                index === 2 && "bg-primary text-surface-container-lowest",
              )}
              delay={index * 0.05}
              key={item.title}
            >
              <h3
                className={cn(
                  "text-2xl",
                  index === 2 && "text-surface-container-lowest",
                )}
              >
                {item.title}
              </h3>
              <p
                className={cn(
                  "mt-3 text-base leading-7",
                  index === 2 ? "text-surface-container-lowest/78" : "muted-copy",
                )}
              >
                {item.description}
              </p>
            </Reveal>
          ))}
        </div>
      </SectionShell>

      <SectionShell
        description={home.testimonials.description}
        eyebrow={home.testimonials.eyebrow}
        id="results-preview"
        title={home.testimonials.title}
      >
        <div className="grid gap-5 lg:grid-cols-3">
          {home.testimonials.items.map((item, index) => (
            <Reveal
              className={cn(index === 1 && "lg:translate-y-8")}
              delay={index * 0.06}
              key={`${item.name}-${item.date}`}
            >
              <TestimonialCard {...item} />
            </Reveal>
          ))}
        </div>
        <div className="mt-8">
          <ButtonLink href="/results" variant="secondary">
            {home.testimonials.cta}
          </ButtonLink>
        </div>
      </SectionShell>

      <ExecutiveQuote
        attribution={home.philosophy.attribution}
        eyebrow={home.philosophy.eyebrow}
        quote={home.philosophy.quote}
        supporting={<p>{home.philosophy.supporting}</p>}
      />

      <SectionShell
        className="bg-surface-container-low/70"
        description={home.audiences.description}
        eyebrow={home.audiences.eyebrow}
        id="audience"
        title={home.audiences.title}
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {home.audiences.items.map((item, index) => (
            <Reveal
              className="paper-panel rounded-md p-6"
              delay={index * 0.04}
              key={item.title}
            >
              <div className="flex items-start gap-3">
                <Globe2 className="mt-1 size-5 text-on-tertiary-container" />
                <div>
                  <h3 className="text-2xl">{item.title}</h3>
                  <p className="muted-copy mt-3 text-base leading-7">
                    {item.description}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </SectionShell>

      <SectionShell
        description={home.faq.description}
        eyebrow={home.faq.eyebrow}
        id="faq"
        title={home.faq.title}
      >
        <FaqList items={home.faq.items} />
      </SectionShell>

      <section className="section-space pt-6">
        <div className="container-shell">
          <Reveal className="overflow-hidden rounded-[1.75rem] bg-primary px-6 py-10 text-surface-container-lowest shadow-glow md:px-10 md:py-14">
            <p className="eyebrow text-tertiary-fixed">{home.finalCta.eyebrow}</p>
            <div className="mt-4 grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
              <div>
                <h2 className="max-w-3xl font-display text-4xl text-surface-container-lowest md:text-5xl">
                  {home.finalCta.title}
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-7 text-surface-container-lowest/80">
                  {home.finalCta.description}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <ButtonLink href={getBookingHref(locale)}>
                  {home.finalCta.primaryCta}
                </ButtonLink>
                <ButtonLink
                  className="text-surface-container-lowest"
                  href="/contact"
                  variant="tertiary"
                >
                  {home.finalCta.secondaryCta}
                </ButtonLink>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
