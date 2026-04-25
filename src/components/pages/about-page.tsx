import Image from "next/image";
import { BadgeCheck, Globe2, GraduationCap, MessageSquareText } from "lucide-react";

import { PageHero } from "@/components/sections/page-hero";
import { SectionShell } from "@/components/sections/section-shell";
import { ButtonLink } from "@/components/ui/button-link";
import { Reveal } from "@/components/ui/reveal";
import { StructuredData } from "@/components/ui/structured-data";
import { getBookingHref, siteConfig } from "@/config/site";
import { copy } from "@/content/locale-copy";
import { portraitAssets } from "@/content/media";
import type { Locale } from "@/i18n/routing";
import { getPersonSchema } from "@/lib/schema";

export function AboutPage({ locale }: { locale: Locale }) {
  const t = (value: string) => copy(locale, value);

  return (
    <>
      <StructuredData
        data={getPersonSchema(
          locale,
          t("English trainer and teacher trainer focused on structure, feedback, confidence, and measurable progress."),
        )}
      />

      <PageHero
        actions={
          <>
            <ButtonLink href={getBookingHref(locale)}>{t("Book on Preply")}</ButtonLink>
            <ButtonLink href="/programs" variant="secondary">
              {t("Explore programs")}
            </ButtonLink>
          </>
        }
        aside={
          <div className="space-y-4">
            <h2 className="text-2xl">{t("What learners can expect")}</h2>
            <ul className="grid gap-3 text-sm leading-6 text-secondary">
              <li>{t("Clear goals and honest feedback")}</li>
              <li>{t("Practical speaking and writing support")}</li>
              <li>{t("A warm but structured training environment")}</li>
              <li>{t("Preply-first booking with future lead pathways")}</li>
            </ul>
          </div>
        }
        description={t("Faris Rashad is an English trainer and teacher trainer helping learners and teachers build structured, confident, measurable English progress.")}
        eyebrow={t("About Faris")}
        title={t("A practical, human approach to serious English improvement")}
      />

      <SectionShell
        innerClassName="grid gap-8 lg:grid-cols-[minmax(0,1.04fr)_minmax(20rem,0.96fr)] lg:items-center"
        eyebrow={t("Story and mission")}
        title={t("Teaching that connects structure with encouragement")}
      >
        <div className="grid gap-5">
          {[
            "Faris has been teaching since 2018, working with learners who need English for exams, professional communication, confidence, and real-life fluency.",
            "His background at English Taxo includes both teaching and teacher training, which shapes a method built around lesson structure, practical feedback, and learner confidence.",
            "The mission is simple: make English progress clearer. Learners should understand what is blocking them, how to practice, and what the next step is after each session.",
          ].map((paragraph, index) => (
            <Reveal className="paper-panel rounded-md p-6" delay={index * 0.05} key={paragraph}>
              <p className="muted-copy text-base leading-8">{t(paragraph)}</p>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.08}>
          <div className="paper-panel overflow-hidden rounded-lg p-4">
            <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-surface-container-low">
              <Image
                alt={siteConfig.brandName}
                className="object-cover"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                src={portraitAssets.deskPortrait}
              />
            </div>
          </div>
        </Reveal>
      </SectionShell>

      <SectionShell
        className="bg-surface-container-low/65"
        description={t("The brand is built around evidence, not vague promises: real reviews, real class context, and a system that can grow with more tools and resources.")}
        eyebrow={t("Method")}
        title={t("Structure plus support plus feedback")}
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            [BadgeCheck, "Structure", "A clear path replaces random lessons and scattered practice."],
            [MessageSquareText, "Feedback", "Mistakes are explained with practical examples and next steps."],
            [Globe2, "International", "Students from 60+ countries bring global goals and communication needs."],
            [GraduationCap, "Teacher training", "Methodology experience strengthens every learner-facing lesson."],
          ].map(([Icon, title, description], index) => {
            const ItemIcon = Icon as typeof BadgeCheck;
            return (
              <Reveal className="paper-panel rounded-md p-6" delay={index * 0.04} key={title as string}>
                <ItemIcon className="size-6 text-on-tertiary-container" />
                <h3 className="mt-4 text-2xl">{t(title as string)}</h3>
                <p className="muted-copy mt-3 text-sm leading-6">
                  {t(description as string)}
                </p>
              </Reveal>
            );
          })}
        </div>
      </SectionShell>

      <section className="section-space pt-4">
        <div className="container-shell">
          <Reveal className="rounded-lg bg-primary px-6 py-10 text-surface-container-lowest shadow-glow md:px-10">
            <p className="eyebrow text-tertiary-fixed">{t("Work with Faris")}</p>
            <h2 className="mt-4 max-w-3xl font-display text-4xl text-surface-container-lowest md:text-5xl">
              {t("Choose the track that fits your next English goal.")}
            </h2>
            <div className="mt-6 flex flex-wrap gap-4">
              <ButtonLink href="/programs">{t("Explore programs")}</ButtonLink>
              <ButtonLink className="text-surface-container-lowest" href={getBookingHref(locale)} variant="tertiary">
                {t("Book on Preply")}
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
