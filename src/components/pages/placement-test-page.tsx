import { PageHero } from "@/components/sections/page-hero";
import { SectionShell } from "@/components/sections/section-shell";
import { ButtonLink } from "@/components/ui/button-link";
import { getBookingHref } from "@/config/site";
import { copy } from "@/content/locale-copy";
import { placementCopy } from "@/features/placement-test/copy";
import { PlacementTestClient } from "@/features/placement-test/placement-test-client";
import type { Locale } from "@/i18n/routing";

export function PlacementTestPage({ locale }: { locale: Locale }) {
  const t = (value: Parameters<typeof copy>[1]) => copy(locale, value);

  return (
    <>
      <PageHero
        actions={
          <>
            <ButtonLink href="#placement-test">{t(placementCopy.start)}</ButtonLink>
            <ButtonLink href={getBookingHref(locale)} variant="secondary">
              {t(placementCopy.bookDiagnostic)}
            </ButtonLink>
          </>
        }
        aside={
          <div className="space-y-4">
            <h2 className="text-2xl">{t(placementCopy.measurements.title)}</h2>
            <ul className="grid gap-3 text-sm leading-6 text-secondary">
              <li>{t(placementCopy.measurements.vocabulary)}</li>
              <li>{t(placementCopy.measurements.grammar)}</li>
            </ul>
          </div>
        }
        description={t(placementCopy.descriptionCurrent)}
        eyebrow={t(placementCopy.eyebrow)}
        title={t(placementCopy.title)}
      />

      <SectionShell
        className="section-space-sm bg-surface-container-low/65"
        description={t(placementCopy.diagnosticSection.description)}
        eyebrow={t(placementCopy.diagnosticSection.eyebrow)}
        id="placement-test"
        title={t(placementCopy.diagnosticSection.title)}
      >
        <PlacementTestClient locale={locale} />
      </SectionShell>
    </>
  );
}
