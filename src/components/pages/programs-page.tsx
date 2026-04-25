import { ArrowRight, Target } from "lucide-react";

import { PageHero } from "@/components/sections/page-hero";
import { SectionShell } from "@/components/sections/section-shell";
import { ButtonLink } from "@/components/ui/button-link";
import { Reveal } from "@/components/ui/reveal";
import { getBookingHref } from "@/config/site";
import { copy } from "@/content/locale-copy";
import { tracks } from "@/content/tracks";
import type { Locale } from "@/i18n/routing";

export function ProgramsPage({ locale }: { locale: Locale }) {
  const t = (value: string) => copy(locale, value);

  return (
    <>
      <PageHero
        actions={
          <>
            <ButtonLink href={getBookingHref(locale)}>{t("Book on Preply")}</ButtonLink>
            <ButtonLink href="/contact" variant="secondary">
              {t("Register interest")}
            </ButtonLink>
          </>
        }
        aside={
          <div className="space-y-4">
            <h2 className="text-2xl">{t("Choose by outcome")}</h2>
            <p className="muted-copy text-sm leading-6">
              {t("Each program gives you a focused path with goals, fit, learner feedback, class moments, and a clear next step.")}
            </p>
          </div>
        }
        description={t("A central gateway to IELTS, Business English, General English, and ESL teacher training with Faris Rashad.")}
        eyebrow={t("Programs and services")}
        title={t("Four premium English training tracks")}
      />

      <SectionShell
        className="bg-surface-container-low/65"
        description={t("Compare the programs by goal, learner fit, and the kind of progress you want to build next.")}
        eyebrow={t("Program catalog")}
        title={t("Choose the path that matches your goal")}
      >
        <div className="grid gap-5 md:grid-cols-2">
          {tracks.map((track, index) => (
            <Reveal className="paper-panel rounded-lg p-6" delay={index * 0.05} key={track.id}>
              <div className="flex items-start gap-4">
                <div className="rounded-sm bg-tertiary-fixed/55 p-2 text-tertiary">
                  <Target className="size-5" />
                </div>
                <div>
                  <p className="eyebrow">{copy(locale, track.eyebrow)}</p>
                  <h2 className="mt-3 text-3xl">{copy(locale, track.title)}</h2>
                  <p className="muted-copy mt-3 text-base leading-7">
                    {copy(locale, track.description)}
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-3 md:grid-cols-3">
                <div className="rounded-md bg-surface-container-low/80 p-4">
                  <p className="text-xs font-semibold uppercase text-secondary">
                    {t("For")}
                  </p>
                  <p className="mt-2 text-sm leading-6">{t(track.audience[0])}</p>
                </div>
                <div className="rounded-md bg-surface-container-low/80 p-4">
                  <p className="text-xs font-semibold uppercase text-secondary">
                    {t("Pain point")}
                  </p>
                  <p className="mt-2 text-sm leading-6">{t(track.painPoints[0])}</p>
                </div>
                <div className="rounded-md bg-surface-container-low/80 p-4">
                  <p className="text-xs font-semibold uppercase text-secondary">
                    {t("Outcome")}
                  </p>
                  <p className="mt-2 text-sm leading-6">
                    {t("Structure, feedback, confidence, and practical progress.")}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-4">
                <ButtonLink href={`/programs/${track.slug}`}>
                  {t("View dedicated page")}
                  <ArrowRight className="size-4" />
                </ButtonLink>
                <ButtonLink href={getBookingHref(locale)} variant="secondary">
                  {copy(locale, track.primaryCta)}
                </ButtonLink>
              </div>
            </Reveal>
          ))}
        </div>
      </SectionShell>
    </>
  );
}
