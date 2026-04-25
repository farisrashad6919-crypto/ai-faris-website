import { PageHero } from "@/components/sections/page-hero";
import { ReviewProofGrid } from "@/components/sections/review-proof-grid";
import { SectionShell } from "@/components/sections/section-shell";
import { ButtonLink } from "@/components/ui/button-link";
import { getBookingHref } from "@/config/site";
import { copy } from "@/content/locale-copy";
import { reviews } from "@/content/reviews";
import { tracks } from "@/content/tracks";
import type { Locale } from "@/i18n/routing";

export function ReviewsPage({ locale }: { locale: Locale }) {
  const t = (value: string) => copy(locale, value);

  return (
    <>
      <PageHero
        actions={
          <>
            <ButtonLink href={getBookingHref(locale)}>{t("Book on Preply")}</ButtonLink>
            <ButtonLink href="/programs" variant="secondary">
              {t("Choose a program")}
            </ButtonLink>
          </>
        }
        aside={
          <div className="space-y-4">
            <h2 className="text-2xl">{t("Authenticity rules")}</h2>
            <p className="muted-copy text-sm leading-6">
              {t("Review screenshots remain visible. Clean transcriptions and localized summaries support reading without changing meaning.")}
            </p>
          </div>
        }
        description={t("A track-based proof library using the uploaded review screenshots, with clean transcription and localized excerpt support.")}
        eyebrow={t("Reviews and results")}
        title={t("Real review screenshots, grouped by goal")}
      />

      {tracks.map((track) => {
        const trackReviews = reviews.filter((review) =>
          review.trackIds.includes(track.id),
        );

        if (trackReviews.length === 0) return null;

        return (
          <SectionShell
            className="border-t ghost-divider"
            description={copy(locale, track.description)}
            eyebrow={copy(locale, track.eyebrow)}
            key={track.id}
            title={copy(locale, track.title)}
          >
            <ReviewProofGrid locale={locale} reviews={trackReviews} />
          </SectionShell>
        );
      })}
    </>
  );
}
