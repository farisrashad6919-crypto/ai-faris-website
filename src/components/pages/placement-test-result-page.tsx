import { PageHero } from "@/components/sections/page-hero";
import { SectionShell } from "@/components/sections/section-shell";
import { ButtonLink } from "@/components/ui/button-link";
import { getBookingHref } from "@/config/site";
import { copy } from "@/content/locale-copy";
import { placementCopy } from "@/features/placement-test/copy";
import { PlacementResultClient } from "@/features/placement-test/placement-result-client";
import type { Locale } from "@/i18n/routing";

export function PlacementTestResultPage({ locale }: { locale: Locale }) {
  const t = (value: Parameters<typeof copy>[1]) => copy(locale, value);

  return (
    <>
      <PageHero
        actions={
          <>
            <ButtonLink href={getBookingHref(locale)}>
              {t(placementCopy.bookDiagnostic)}
            </ButtonLink>
            <ButtonLink href="/placement-test" variant="secondary">
              {t(placementCopy.retakeTest)}
            </ButtonLink>
          </>
        }
        description={t(placementCopy.resultHeroDescription)}
        eyebrow={t(placementCopy.eyebrow)}
        title={t(placementCopy.resultTitle)}
      />

      <SectionShell className="section-space-sm bg-surface-container-low/65">
        <PlacementResultClient locale={locale} />
      </SectionShell>
    </>
  );
}
