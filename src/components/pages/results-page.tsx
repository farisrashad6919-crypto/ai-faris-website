import type { Locale } from "@/i18n/routing";

import { ReviewsPage } from "./reviews-page";

export function ResultsPage({ locale }: { locale: Locale }) {
  return <ReviewsPage locale={locale} />;
}
