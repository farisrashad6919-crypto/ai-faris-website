import { getMessages } from "next-intl/server";

import { ButtonLink } from "@/components/ui/button-link";
import { PageHero } from "@/components/sections/page-hero";
import { Reveal } from "@/components/ui/reveal";
import { StructuredData } from "@/components/ui/structured-data";
import { SectionShell } from "@/components/sections/section-shell";
import { ServiceCard } from "@/components/sections/service-card";
import { getBookingHref } from "@/config/site";
import type { Locale } from "@/i18n/routing";
import { getMessageValue } from "@/lib/messages";
import { getProfessionalServiceSchema } from "@/lib/schema";

type ServicesContent = {
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    asideTitle: string;
    asideItems: string[];
  };
  catalog: {
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
  process: {
    eyebrow: string;
    title: string;
    description: string;
    steps: Array<{ title: string; description: string }>;
  };
  fit: {
    eyebrow: string;
    title: string;
    description: string;
    groups: Array<{ title: string; description: string }>;
  };
  cta: {
    eyebrow: string;
    title: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
  };
};

export async function ServicesPage({ locale }: { locale: Locale }) {
  const messages = await getMessages();
  const services = getMessageValue<ServicesContent>(messages, "Services");

  return (
    <>
      <StructuredData
        data={getProfessionalServiceSchema(locale, services.hero.description)}
      />

      <PageHero
        actions={
          <>
            <ButtonLink href={getBookingHref(locale)}>
              {services.cta.primaryCta}
            </ButtonLink>
            <ButtonLink href="/contact" variant="secondary">
              {services.cta.secondaryCta}
            </ButtonLink>
          </>
        }
        aside={
          <div className="space-y-4">
            <h2 className="text-2xl">{services.hero.asideTitle}</h2>
            <ul className="grid gap-3 text-sm leading-6 text-secondary">
              {services.hero.asideItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        }
        description={services.hero.description}
        eyebrow={services.hero.eyebrow}
        title={services.hero.title}
      />

      <SectionShell
        className="bg-surface-container-low/65"
        description={services.catalog.description}
        eyebrow={services.catalog.eyebrow}
        title={services.catalog.title}
      >
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {services.catalog.items.map((item, index) => (
            <Reveal className={index === 0 ? "xl:col-span-2" : ""} delay={index * 0.04} key={item.title}>
              <ServiceCard
                audience={item.audience}
                ctaLabel={services.catalog.ctaLabel}
                description={item.description}
                href="/contact"
                outcomes={item.outcomes}
                title={item.title}
              />
            </Reveal>
          ))}
        </div>
      </SectionShell>

      <SectionShell
        description={services.process.description}
        eyebrow={services.process.eyebrow}
        title={services.process.title}
      >
        <div className="grid gap-4 md:grid-cols-3">
          {services.process.steps.map((step, index) => (
            <Reveal className="paper-panel rounded-lg p-6" delay={index * 0.06} key={step.title}>
              <p className="eyebrow">0{index + 1}</p>
              <h3 className="mt-3 text-2xl">{step.title}</h3>
              <p className="muted-copy mt-3 text-base leading-7">
                {step.description}
              </p>
            </Reveal>
          ))}
        </div>
      </SectionShell>

      <SectionShell
        className="section-space-sm"
        description={services.fit.description}
        eyebrow={services.fit.eyebrow}
        title={services.fit.title}
      >
        <div className="grid gap-4 md:grid-cols-2">
          {services.fit.groups.map((group, index) => (
            <Reveal className="paper-panel rounded-md p-6" delay={index * 0.05} key={group.title}>
              <h3 className="text-2xl">{group.title}</h3>
              <p className="muted-copy mt-3 text-base leading-7">
                {group.description}
              </p>
            </Reveal>
          ))}
        </div>
      </SectionShell>

      <section className="section-space pt-4">
        <div className="container-shell">
          <Reveal className="overflow-hidden rounded-[1.5rem] bg-primary px-8 py-10 text-surface-container-lowest shadow-glow md:px-10">
            <p className="eyebrow text-tertiary-fixed">{services.cta.eyebrow}</p>
            <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
              <div>
                <h2 className="max-w-3xl font-display text-4xl text-surface-container-lowest md:text-5xl">
                  {services.cta.title}
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-7 text-surface-container-lowest/80">
                  {services.cta.description}
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <ButtonLink href={getBookingHref(locale)}>
                  {services.cta.primaryCta}
                </ButtonLink>
                <ButtonLink
                  className="text-surface-container-lowest"
                  href="/contact"
                  variant="tertiary"
                >
                  {services.cta.secondaryCta}
                </ButtonLink>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
