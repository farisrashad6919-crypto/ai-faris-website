import Image from "next/image";
import {
  ArrowRight,
  BookOpenCheck,
  CheckCircle2,
  ClipboardCheck,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Target,
  XCircle,
} from "lucide-react";

import { ContactForm } from "@/components/contact/contact-form";
import { FutureExpansionGrid } from "@/components/sections/future-expansion-grid";
import { ProofMediaGrid } from "@/components/sections/proof-media-grid";
import { ReviewProofGrid } from "@/components/sections/review-proof-grid";
import { SectionShell } from "@/components/sections/section-shell";
import { ButtonLink } from "@/components/ui/button-link";
import { Reveal } from "@/components/ui/reveal";
import { StructuredData } from "@/components/ui/structured-data";
import { getBookingHref, siteConfig } from "@/config/site";
import { getMediaForTrack, portraitAssets } from "@/content/media";
import { getReviewsForTrack } from "@/content/reviews";
import type { TrackContent } from "@/content/types";
import { copy, uiCopy } from "@/content/locale-copy";
import type { Locale } from "@/i18n/routing";
import { getProfessionalServiceSchema } from "@/lib/schema";
import { cn } from "@/lib/utils";

type TrackLandingPageProps = {
  locale: Locale;
  track: TrackContent;
};

const sectionIcons = [Target, ClipboardCheck, MessageCircle, BookOpenCheck];

function BulletCard({
  children,
  index,
  danger = false,
}: {
  children: string;
  index: number;
  danger?: boolean;
}) {
  const Icon = danger ? XCircle : CheckCircle2;

  return (
    <Reveal
      className="paper-panel rounded-md p-5"
      delay={index * 0.035}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "mt-0.5 rounded-sm p-2",
            danger
              ? "bg-error/8 text-error"
              : "bg-tertiary-fixed/55 text-tertiary",
          )}
        >
          <Icon className="size-4" />
        </div>
        <p className="text-sm leading-6 text-primary">{children}</p>
      </div>
    </Reveal>
  );
}

export function TrackLandingPage({ locale, track }: TrackLandingPageProps) {
  const reviews = getReviewsForTrack(track.id);
  const media = getMediaForTrack(track.id);
  const sourcePage = `/programs/${track.slug}`;
  const t = (value: string) => copy(locale, value);

  return (
    <>
      <StructuredData
        data={getProfessionalServiceSchema(locale, copy(locale, track.description))}
      />

      <section className="section-space pb-12">
        <div className="container-shell grid gap-10 lg:grid-cols-[minmax(0,1.04fr)_minmax(20rem,0.96fr)] lg:items-center">
          <Reveal className="space-y-7">
            <p className="eyebrow">{copy(locale, track.eyebrow)}</p>
            <h1 className="max-w-4xl text-5xl leading-[1.06] md:text-6xl">
              {copy(locale, track.title)}
            </h1>
            <p className="muted-copy max-w-2xl text-lg leading-8">
              {copy(locale, track.description)}
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="paper-panel rounded-md p-4">
                <p className="text-2xl font-semibold text-primary">2018</p>
                  <p className="mt-2 text-sm leading-6 text-secondary">
                  {t("Teaching since")}
                </p>
              </div>
              <div className="paper-panel rounded-md p-4">
                <p className="text-2xl font-semibold text-primary">60+</p>
                  <p className="mt-2 text-sm leading-6 text-secondary">
                  {t("Countries reached")}
                </p>
              </div>
              <div className="paper-panel rounded-md p-4">
                <p className="text-2xl font-semibold text-primary">Preply</p>
                  <p className="mt-2 text-sm leading-6 text-secondary">
                  {t("Main booking path")}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              <ButtonLink href={getBookingHref(locale)}>
                {copy(locale, track.primaryCta)}
              </ButtonLink>
              <ButtonLink href="/webinars" variant="secondary">
                {copy(locale, track.secondaryCta)}
                <ArrowRight className="size-4" />
              </ButtonLink>
              <ButtonLink href="#lead-form" variant="tertiary">
                {copy(locale, track.tertiaryCta)}
              </ButtonLink>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="paper-panel overflow-hidden rounded-lg p-4">
              <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-surface-container-low">
                <Image
                  alt={`${siteConfig.brandName} ${copy(locale, track.shortTitle)}`}
                  className="object-cover"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  src={
                    track.id === "general"
                      ? portraitAssets.teachingHoodie
                      : track.id === "teacher-training"
                        ? portraitAssets.teacherTrainer
                        : portraitAssets.hero
                  }
                  style={{ objectPosition: track.id === "ielts" ? "76% center" : "center" }}
                />
              </div>
              <div className="grid gap-3 p-2 pt-5 sm:grid-cols-2">
                <div className="rounded-md bg-surface-container-low/80 p-4">
                  <p className="text-sm font-semibold text-primary">
                    {t("Structured feedback")}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-secondary">
                    {t("Clear correction, goals, and practice loops.")}
                  </p>
                </div>
                <div className="rounded-md bg-surface-container-low/80 p-4">
                  <p className="text-sm font-semibold text-primary">
                    {t("Real proof")}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-secondary">
                    {t("Uploaded reviews and clean class media.")}
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <SectionShell
        className="section-space-sm bg-surface-container-low/65"
        eyebrow={copy(locale, uiCopy.sectionLabels.for)}
        title={copy(locale, track.shortTitle)}
        description={copy(locale, track.description)}
      >
        <div className="grid gap-4 md:grid-cols-3">
          {track.audience.map((item, index) => (
            <BulletCard index={index} key={item}>
              {t(item)}
            </BulletCard>
          ))}
        </div>
      </SectionShell>

      <SectionShell
        eyebrow={copy(locale, uiCopy.sectionLabels.painPoints)}
        title={t("The problems this track is designed to fix")}
        description={t("The strongest lessons start by naming the real blockers clearly.")}
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {track.painPoints.map((item, index) => (
            <BulletCard index={index} key={item}>
              {t(item)}
            </BulletCard>
          ))}
        </div>
      </SectionShell>

      <SectionShell
        className="section-space-sm"
        eyebrow={copy(locale, uiCopy.sectionLabels.why)}
        title={t("A serious path needs structure, not guesswork")}
      >
        <div className="grid gap-5 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <Reveal className="paper-panel rounded-lg p-6 md:p-8">
            <ShieldCheck className="size-8 text-on-tertiary-container" />
            <p className="muted-copy mt-5 text-lg leading-8">
              {t(track.whyItMatters)}
            </p>
          </Reveal>
          <div className="grid gap-4">
            {track.howIHelp.map((item, index) => {
              const Icon = sectionIcons[index % sectionIcons.length];
              return (
                <Reveal
                  className="paper-panel rounded-md p-5"
                  delay={index * 0.05}
                  key={item}
                >
                  <div className="flex items-start gap-4">
                    <div className="rounded-sm bg-tertiary-fixed/55 p-2 text-tertiary">
                      <Icon className="size-5" />
                    </div>
                    <p className="text-base leading-7 text-primary">{t(item)}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </SectionShell>

      <SectionShell
        className="bg-surface-container-low/65"
        eyebrow={copy(locale, uiCopy.sectionLabels.curriculum)}
        title={t("Mini curriculum")}
        description={t("A focused menu of areas we can train depending on your level, deadline, and goal.")}
      >
        <div className="grid gap-4 md:grid-cols-2">
          {track.curriculum.map((item, index) => (
            <BulletCard index={index} key={item}>
              {t(item)}
            </BulletCard>
          ))}
        </div>
      </SectionShell>

      <SectionShell
        className="section-space-sm"
        eyebrow={copy(locale, uiCopy.sectionLabels.notFor)}
        title={t("A quick fit check")}
      >
        <div className="grid gap-4 md:grid-cols-3">
          {track.notFor.map((item, index) => (
            <BulletCard danger index={index} key={item}>
              {t(item)}
            </BulletCard>
          ))}
        </div>
      </SectionShell>

      <SectionShell
        className="bg-surface-container-low/65"
        eyebrow={copy(locale, uiCopy.sectionLabels.reviews)}
        title={t("Real words from real learners")}
        description={t("Each card keeps the original screenshot visible, with a clean transcription and localized summary for non-English visitors.")}
      >
        <ReviewProofGrid locale={locale} reviews={reviews} />
      </SectionShell>

      <SectionShell
        eyebrow={copy(locale, uiCopy.sectionLabels.media)}
        title={t("Class proof with students visible")}
        description={copy(locale, uiCopy.common.proofNote)}
      >
        <ProofMediaGrid items={media} locale={locale} />
      </SectionShell>

      <SectionShell
        className="bg-surface-container-low/65"
        description={t("Use this form for courses, webinars, free training, placement tests, or updates. WhatsApp or Telegram is enough; email is optional for course leads.")}
        eyebrow={t("Lead form")}
        id="lead-form"
        title={t("Tell me what you want to improve")}
      >
        <ContactForm
          defaultOfferType={track.id === "teacher-training" ? "training" : "course"}
          defaultTrack={track.id}
          locale={locale}
          sourcePage={sourcePage}
        />
      </SectionShell>

      <SectionShell
        className="section-space-sm"
        eyebrow={copy(locale, uiCopy.sectionLabels.next)}
        title={copy(locale, uiCopy.whatNext.title)}
      >
        <div className="grid gap-4 md:grid-cols-3">
          {uiCopy.whatNext.items.map((item, index) => (
            <Reveal className="paper-panel rounded-md p-6" delay={index * 0.05} key={item.en}>
              <p className="eyebrow">0{index + 1}</p>
              <p className="mt-4 text-base leading-7 text-primary">
                {copy(locale, item)}
              </p>
            </Reveal>
          ))}
        </div>
      </SectionShell>

      <SectionShell
        className="bg-surface-container-low/65"
        eyebrow={copy(locale, uiCopy.sectionLabels.faq)}
        title={t("Track FAQ")}
      >
        <div className="grid gap-4">
            {track.faq.map((item) => (
            <details className="paper-panel rounded-md p-5" key={item.question}>
              <summary className="flex items-center justify-between gap-4 text-lg font-semibold text-primary">
                {t(item.question)}
                <Sparkles className="size-4 shrink-0 text-on-tertiary-container" />
              </summary>
              <p className="muted-copy mt-4 max-w-3xl text-base leading-7">
                {t(item.answer)}
              </p>
            </details>
          ))}
        </div>
      </SectionShell>

      <SectionShell
        eyebrow={copy(locale, uiCopy.sectionLabels.future)}
        title={t("Built for future tools, quizzes, tests, videos, and webinars")}
        description={t("These blocks are already data-driven so new resources can be added later without changing the page design.")}
      >
        <FutureExpansionGrid items={track.future} locale={locale} />
      </SectionShell>

      <section className="section-space pt-4">
        <div className="container-shell">
          <Reveal className="overflow-hidden rounded-lg bg-primary px-6 py-10 text-surface-container-lowest shadow-glow md:px-10 md:py-12">
            <p className="eyebrow text-tertiary-fixed">{copy(locale, uiCopy.sectionLabels.final)}</p>
            <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
              <div>
                <h2 className="max-w-3xl font-display text-4xl text-surface-container-lowest md:text-5xl">
                  {t("Start with the right track, then build momentum.")}
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-7 text-surface-container-lowest/78">
                  {t("Book on Preply for the fastest first step, or use the form if you want a course, webinar, training, or placement-test path.")}
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <ButtonLink href={getBookingHref(locale)}>
                  {copy(locale, track.primaryCta)}
                </ButtonLink>
                <ButtonLink className="text-surface-container-lowest" href="#lead-form" variant="tertiary">
                  {t("Register interest")}
                </ButtonLink>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
