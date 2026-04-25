import Image from "next/image";
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  CalendarDays,
  Globe2,
  GraduationCap,
} from "lucide-react";

import { FutureExpansionGrid } from "@/components/sections/future-expansion-grid";
import { ProofMediaGrid } from "@/components/sections/proof-media-grid";
import { ReviewProofGrid } from "@/components/sections/review-proof-grid";
import { SectionShell } from "@/components/sections/section-shell";
import { ButtonLink } from "@/components/ui/button-link";
import { Reveal } from "@/components/ui/reveal";
import { StructuredData } from "@/components/ui/structured-data";
import { getBookingHref, siteConfig } from "@/config/site";
import { proofMedia, portraitAssets } from "@/content/media";
import { reviews } from "@/content/reviews";
import { resourceEntries } from "@/content/resources";
import { tracks } from "@/content/tracks";
import { copy } from "@/content/locale-copy";
import type { Locale } from "@/i18n/routing";
import { getPersonSchema, getProfessionalServiceSchema } from "@/lib/schema";

export function HomePage({ locale }: { locale: Locale }) {
  const t = (value: string) => copy(locale, value);
  const featuredReviews = [
    reviews.find((review) => review.id === "review-ielts-03"),
    reviews.find((review) => review.id === "review-business-03"),
    reviews.find((review) => review.id === "review-teacher-training-01"),
  ].filter(Boolean) as typeof reviews;

  const futureItems = resourceEntries.slice(0, 6).map((entry) => ({
    title: entry.title,
    description: entry.description,
    type: entry.type,
  }));
  const qualifications = [
    {
      title: "Cambridge CELTA",
      description: "Certified Cambridge English teaching qualification.",
      Icon: BadgeCheck,
    },
    {
      title: "Cambridge Train the Trainer",
      description: "Professional teacher-development and training background.",
      Icon: BookOpen,
    },
    {
      title: "Bachelor’s Degree in English Literature and Education",
      description: "Strong academic foundation in English and teaching.",
      Icon: GraduationCap,
    },
  ];

  return (
    <>
      <StructuredData
        data={[
          getPersonSchema(locale, "Faris Rashad English Trainer"),
          getProfessionalServiceSchema(
            locale,
            t("Premium English training for IELTS, Business English, General English, and ESL teacher development."),
          ),
        ]}
      />

      <section className="section-space pt-10">
        <div className="container-shell grid gap-10 lg:grid-cols-[minmax(0,1.02fr)_minmax(20rem,0.98fr)] lg:items-center">
          <Reveal className="space-y-7">
            <p className="eyebrow">Faris Rashad English Trainer</p>
            <h1 className="max-w-4xl text-5xl leading-[1.05] md:text-7xl">
              {t("Structured English training for serious progress.")}
            </h1>
            <p className="muted-copy max-w-2xl text-lg leading-8">
              {t("Choose a clear path for IELTS, Business English, General English, or ESL teacher development, with real feedback, authentic proof, and Preply as the fastest booking route.")}
            </p>
            <div className="flex flex-wrap gap-4">
              <ButtonLink href={getBookingHref(locale)}>
                {t("Book on Preply")}
              </ButtonLink>
              <ButtonLink href="/programs" variant="secondary">
                {t("Choose your path")}
                <ArrowRight className="size-4" />
              </ButtonLink>
            </div>
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
                  {t("Countries worldwide")}
                </p>
              </div>
              <div className="paper-panel rounded-md p-4">
                <p className="text-2xl font-semibold text-primary">4</p>
                  <p className="mt-2 text-sm leading-6 text-secondary">
                  {t("Focused training tracks")}
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal className="space-y-4" delay={0.08}>
            <div className="grid gap-3 sm:grid-cols-3">
              {qualifications.map(({ title, description, Icon }) => (
                <div
                  className="paper-panel rounded-md border border-primary/8 p-4 shadow-sm"
                  key={title}
                >
                  <Icon className="size-5 text-on-tertiary-container" />
                  <h2 className="mt-3 text-base leading-6">{t(title)}</h2>
                  <p className="mt-2 text-xs leading-5 text-secondary">
                    {t(description)}
                  </p>
                </div>
              ))}
            </div>
            <div className="paper-panel overflow-hidden rounded-lg p-4">
              <div className="relative aspect-[16/10] overflow-hidden rounded-md bg-surface-container-low">
                <Image
                  alt={siteConfig.brandName}
                  className="object-cover"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  src={portraitAssets.hero}
                  style={{ objectPosition: "76% center" }}
                />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <SectionShell
        className="section-space-sm bg-surface-container-low/65"
        description={t("Pick the page that matches your real goal. Each path has its own message, proof, lead form, FAQ, and future resource space.")}
        eyebrow={t("Choose your path")}
        title={t("Four focused ways to work together")}
      >
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {tracks.map((track, index) => (
            <Reveal className="paper-panel rounded-md p-6" delay={index * 0.04} key={track.id}>
              <p className="eyebrow">{copy(locale, track.eyebrow)}</p>
              <h2 className="mt-3 text-2xl">{copy(locale, track.shortTitle)}</h2>
              <p className="muted-copy mt-3 text-sm leading-6">
                {copy(locale, track.description)}
              </p>
              <ButtonLink className="mt-5" href={`/programs/${track.slug}`} variant="tertiary">
                {t("View track")}
                <ArrowRight className="size-4" />
              </ButtonLink>
            </Reveal>
          ))}
        </div>
      </SectionShell>

      <SectionShell
        description={t("The method is calm, structured, and practical: diagnose the blocker, practice the right task, correct clearly, and repeat until progress becomes visible.")}
        eyebrow={t("Teaching approach")}
        title={t("Structure, feedback, confidence, measurable progress")}
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            ["Clear path", "Lessons are tied to a goal, level, and next step."],
            ["Targeted correction", "Pronunciation, grammar, vocabulary, and structure are corrected with practical examples."],
            ["Real speaking", "Practice stays connected to the moments you actually need English for."],
            ["Follow-through", "You know what to work on after class instead of leaving with vague advice."],
          ].map(([title, description], index) => (
            <Reveal className="paper-panel rounded-md p-6" delay={index * 0.04} key={title}>
              <BadgeCheck className="size-6 text-on-tertiary-container" />
              <h3 className="mt-4 text-2xl">{t(title)}</h3>
              <p className="muted-copy mt-3 text-sm leading-6">{t(description)}</p>
            </Reveal>
          ))}
        </div>
      </SectionShell>

      <SectionShell
        className="bg-surface-container-low/65"
        description={t("A quick look at uploaded proof. More reviews are grouped by track on the reviews page.")}
        eyebrow={t("Review highlights")}
        title={t("Proof that stays visible")}
      >
        <ReviewProofGrid locale={locale} reviews={featuredReviews} />
        <div className="mt-8">
          <ButtonLink href="/reviews" variant="secondary">
            {t("See all reviews")}
          </ButtonLink>
        </div>
      </SectionShell>

      <SectionShell
        description={t("Students remain visible with consent, and the public versions are kept clean, professional, and credible.")}
        eyebrow={t("Class media")}
        title={t("Real class proof with students visible")}
      >
        <ProofMediaGrid items={proofMedia.slice(0, 4)} locale={locale} />
      </SectionShell>

      <SectionShell
        className="bg-surface-container-low/65"
        description={t("The site is ready for placement tests, quizzes, videos, articles, learning tools, downloadable resources, and webinar registrations.")}
        eyebrow={t("Resources and webinars")}
        title={t("A future-ready learning hub")}
      >
        <FutureExpansionGrid items={futureItems} locale={locale} />
        <div className="mt-8 flex flex-wrap gap-4">
          <ButtonLink href="/resources" variant="secondary">
            <BookOpen className="size-4" />
            {t("Browse resources")}
          </ButtonLink>
          <ButtonLink href="/webinars" variant="secondary">
            <CalendarDays className="size-4" />
            {t("View webinars")}
          </ButtonLink>
        </div>
      </SectionShell>

      <SectionShell
        eyebrow={t("FAQ preview")}
        title={t("Common first questions")}
      >
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["Where should I book?", "Preply is the main booking destination and the fastest way to start."],
            ["Can I register interest instead?", "Yes. Use the lead form for courses, webinars, training, placement tests, or updates."],
            ["Are students visible in class screenshots?", "Yes. Students can remain visible with consent; the images are presented cleanly for the website."],
          ].map(([question, answer]) => (
            <details className="paper-panel rounded-md p-5" key={question}>
              <summary className="font-semibold text-primary">{t(question)}</summary>
              <p className="muted-copy mt-3 text-sm leading-6">{t(answer)}</p>
            </details>
          ))}
        </div>
      </SectionShell>

      <section className="section-space pt-4">
        <div className="container-shell">
          <Reveal className="rounded-lg bg-primary px-6 py-10 text-surface-container-lowest shadow-glow md:px-10">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
              <div>
                <p className="eyebrow text-tertiary-fixed">{t("Final CTA")}</p>
                <h2 className="mt-4 max-w-3xl font-display text-4xl text-surface-container-lowest md:text-5xl">
                  {t("Start with the English path that actually fits.")}
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-7 text-surface-container-lowest/78">
                  {t("Book now on Preply or choose a track page and register your interest for future resources and training.")}
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <ButtonLink href={getBookingHref(locale)}>{t("Book on Preply")}</ButtonLink>
                <ButtonLink className="text-surface-container-lowest" href="/programs" variant="tertiary">
                  <Globe2 className="size-4" />
                  {t("Explore programs")}
                </ButtonLink>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
