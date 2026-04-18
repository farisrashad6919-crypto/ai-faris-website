import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { getMessages } from "next-intl/server";

import { ButtonLink } from "@/components/ui/button-link";
import { PageHero } from "@/components/sections/page-hero";
import { Reveal } from "@/components/ui/reveal";
import { StructuredData } from "@/components/ui/structured-data";
import { SectionShell } from "@/components/sections/section-shell";
import { getBookingHref, siteConfig } from "@/config/site";
import type { Locale } from "@/i18n/routing";
import { getMessageValue } from "@/lib/messages";
import { getPersonSchema } from "@/lib/schema";

type AboutContent = {
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    asideTitle: string;
    asideItems: string[];
  };
  story: {
    eyebrow: string;
    title: string;
    paragraphs: string[];
  };
  philosophy: {
    eyebrow: string;
    title: string;
    description: string;
    items: Array<{ title: string; description: string }>;
  };
  standards: {
    eyebrow: string;
    title: string;
    description: string;
    items: Array<{ title: string; description: string }>;
  };
  whyItWorks: {
    eyebrow: string;
    title: string;
    description: string;
    points: string[];
  };
  cta: {
    eyebrow: string;
    title: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
  };
};

export async function AboutPage({ locale }: { locale: Locale }) {
  const messages = await getMessages();
  const about = getMessageValue<AboutContent>(messages, "About");

  return (
    <>
      <StructuredData
        data={getPersonSchema(locale, about.hero.description)}
      />

      <PageHero
        actions={
          <>
            <ButtonLink href={getBookingHref(locale)}>
              {about.cta.primaryCta}
            </ButtonLink>
            <ButtonLink href="/services" variant="secondary">
              {about.cta.secondaryCta}
            </ButtonLink>
          </>
        }
        aside={
          <div className="space-y-4">
            <h2 className="text-2xl">{about.hero.asideTitle}</h2>
            <ul className="grid gap-3 text-sm leading-6 text-secondary">
              {about.hero.asideItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        }
        description={about.hero.description}
        eyebrow={about.hero.eyebrow}
        title={about.hero.title}
      />

      <SectionShell
        eyebrow={about.story.eyebrow}
        innerClassName="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(18rem,0.95fr)] lg:items-start"
        title={about.story.title}
      >
        <div className="grid gap-5">
          {about.story.paragraphs.map((paragraph, index) => (
            <Reveal className="paper-panel rounded-lg p-6" key={index}>
              <p className="muted-copy text-base leading-8">{paragraph}</p>
            </Reveal>
          ))}
        </div>
        <Reveal className="paper-panel overflow-hidden rounded-[1.5rem] p-4">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[1.2rem]">
            <Image
              alt={siteConfig.brandName}
              className="object-cover"
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              src={siteConfig.portraitPath}
              style={{ objectPosition: "78% center" }}
            />
          </div>
        </Reveal>
      </SectionShell>

      <SectionShell
        className="bg-surface-container-low/65"
        description={about.philosophy.description}
        eyebrow={about.philosophy.eyebrow}
        title={about.philosophy.title}
      >
        <div className="grid gap-4 md:grid-cols-3">
          {about.philosophy.items.map((item, index) => (
            <Reveal className="paper-panel rounded-md p-6" delay={index * 0.05} key={item.title}>
              <h3 className="text-2xl">{item.title}</h3>
              <p className="muted-copy mt-3 text-base leading-7">
                {item.description}
              </p>
            </Reveal>
          ))}
        </div>
      </SectionShell>

      <SectionShell
        description={about.standards.description}
        eyebrow={about.standards.eyebrow}
        title={about.standards.title}
      >
        <div className="grid gap-4 md:grid-cols-2">
          {about.standards.items.map((item, index) => (
            <Reveal className="paper-panel rounded-lg p-6" delay={index * 0.05} key={item.title}>
              <h3 className="text-2xl">{item.title}</h3>
              <p className="muted-copy mt-3 text-base leading-7">
                {item.description}
              </p>
            </Reveal>
          ))}
        </div>
      </SectionShell>

      <SectionShell
        className="section-space-sm"
        description={about.whyItWorks.description}
        eyebrow={about.whyItWorks.eyebrow}
        title={about.whyItWorks.title}
      >
        <div className="paper-panel rounded-lg p-6 md:p-8">
          <ul className="grid gap-4">
            {about.whyItWorks.points.map((point) => (
              <li
                className="flex items-start gap-3 border-b ghost-divider pb-4 text-base leading-7 last:border-b-0 last:pb-0"
                key={point}
              >
                <ArrowRight className="mt-1 size-4 shrink-0 text-on-tertiary-container" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </SectionShell>

      <section className="section-space pt-4">
        <div className="container-shell">
          <Reveal className="paper-panel rounded-[1.5rem] p-8 md:p-10">
            <p className="eyebrow">{about.cta.eyebrow}</p>
            <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
              <div>
                <h2 className="max-w-3xl text-4xl md:text-5xl">
                  {about.cta.title}
                </h2>
                <p className="muted-copy mt-4 max-w-2xl text-base leading-7">
                  {about.cta.description}
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <ButtonLink href={getBookingHref(locale)}>
                  {about.cta.primaryCta}
                </ButtonLink>
                <ButtonLink href="/services" variant="secondary">
                  {about.cta.secondaryCta}
                </ButtonLink>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
