import { ContactForm } from "@/components/contact/contact-form";
import { FilterableContentGrid } from "@/components/sections/filterable-content-grid";
import { PageHero } from "@/components/sections/page-hero";
import { SectionShell } from "@/components/sections/section-shell";
import { ButtonLink } from "@/components/ui/button-link";
import { getBookingHref } from "@/config/site";
import { copy } from "@/content/locale-copy";
import { resourceEntries } from "@/content/resources";
import type { Locale } from "@/i18n/routing";

export function WebinarsPage({ locale }: { locale: Locale }) {
  const t = (value: string) => copy(locale, value);
  const webinarEntries = resourceEntries.filter(
    (entry) => entry.type === "webinar",
  );

  return (
    <>
      <PageHero
        actions={
          <>
            <ButtonLink href="#webinar-interest">{t("Register interest")}</ButtonLink>
            <ButtonLink href={getBookingHref(locale)} variant="secondary">
              {t("Book on Preply")}
            </ButtonLink>
          </>
        }
        aside={
          <div className="space-y-4">
            <h2 className="text-2xl">{t("Webinar categories")}</h2>
            <p className="muted-copy text-sm leading-6">
              {t("IELTS, Business English, General English, and teacher development sessions are ready to be managed from data.")}
            </p>
          </div>
        }
        description={t("A home for upcoming free webinars, recorded sessions, lead capture, and track-based training categories.")}
        eyebrow={t("Webinars and free training")}
        title={t("Register interest in future live training")}
      />

      <SectionShell
        className="bg-surface-container-low/65"
        description={t("Filterable by track and future content type, with webinar entries surfaced first.")}
        eyebrow={t("Upcoming and planned")}
        title={t("Track-based webinar pathways")}
      >
        <FilterableContentGrid entries={webinarEntries} locale={locale} mode="webinars" />
      </SectionShell>

      <SectionShell
        description={t("Email is recommended for webinar registrations, but the form still accepts WhatsApp or Telegram as the required contact channel.")}
        eyebrow={t("Webinar lead capture")}
        id="webinar-interest"
        title={t("Tell me which free training you want")}
      >
        <ContactForm
          defaultOfferType="webinar"
          locale={locale}
          sourcePage="/webinars"
        />
      </SectionShell>
    </>
  );
}
