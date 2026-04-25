import { FilterableContentGrid } from "@/components/sections/filterable-content-grid";
import { PageHero } from "@/components/sections/page-hero";
import { SectionShell } from "@/components/sections/section-shell";
import { ButtonLink } from "@/components/ui/button-link";
import { getBookingHref } from "@/config/site";
import { copy } from "@/content/locale-copy";
import { resourceEntries } from "@/content/resources";
import type { Locale } from "@/i18n/routing";

export function ResourcesPage({ locale }: { locale: Locale }) {
  const t = (value: string) => copy(locale, value);

  return (
    <>
      <PageHero
        actions={
          <>
            <ButtonLink href="/programs">{t("Choose a track")}</ButtonLink>
            <ButtonLink href={getBookingHref(locale)} variant="secondary">
              {t("Book on Preply")}
            </ButtonLink>
          </>
        }
        aside={
          <div className="space-y-4">
            <h2 className="text-2xl">{t("Learning formats")}</h2>
            <p className="muted-copy text-sm leading-6">
              {t("Articles, videos, quizzes, placement tests, tools, webinars, and downloadable guides for focused English growth.")}
            </p>
          </div>
        }
        description={t("A focused place for placement tests, quizzes, videos, articles, learning tools, downloads, webinar replays, and study resources by track.")}
        eyebrow={t("Free resources")}
        title={t("A learning library for your next step")}
      />

      <SectionShell
        className="bg-surface-container-low/65"
        description={t("Filter by track and content type to find the support that matches your current goal.")}
        eyebrow={t("Resource filters")}
        title={t("Find the resource path that matches your goal")}
      >
        <FilterableContentGrid entries={resourceEntries} locale={locale} mode="resources" />
      </SectionShell>
    </>
  );
}
