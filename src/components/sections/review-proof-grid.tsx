import Image from "next/image";

import type { Locale } from "@/i18n/routing";
import type { ReviewItem } from "@/content/types";
import { copy } from "@/content/locale-copy";

type ReviewProofGridProps = {
  reviews: ReviewItem[];
  locale: Locale;
};

export function ReviewProofGrid({ reviews, locale }: ReviewProofGridProps) {
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      {reviews.map((review) => (
        <article className="paper-panel overflow-hidden rounded-lg" key={review.id}>
          <div className="relative aspect-[4/5] bg-surface-container-low">
            <Image
              alt={`${copy(locale, "Review from")} ${review.reviewer}`}
              className="object-contain"
              fill
              sizes="(max-width: 1024px) 100vw, 33vw"
              src={review.screenshot}
            />
          </div>
          <div className="space-y-4 p-5">
            <div>
              <p className="eyebrow">{copy(locale, review.highlight)}</p>
              <h3 className="mt-2 text-2xl">{review.reviewer}</h3>
              <p className="text-sm text-secondary">
                {[review.country ? copy(locale, review.country) : undefined, copy(locale, review.date)]
                  .filter(Boolean)
                  .join(" / ")}
              </p>
            </div>
            <p className="muted-copy text-sm leading-6">
              {copy(locale, review.localizedExcerpt)}
            </p>
          </div>
        </article>
      ))}
    </div>
  );
}
