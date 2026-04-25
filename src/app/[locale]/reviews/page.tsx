import type { Metadata } from "next";

import { setRequestLocale } from "next-intl/server";

import { ReviewsPage } from "@/components/pages/reviews-page";
import { resolveLocale } from "@/lib/locale";
import { getPageMetadata } from "@/lib/metadata";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return getPageMetadata(locale, "reviews");
}

export default async function ReviewsRoute({ params }: PageProps) {
  const locale = await resolveLocale(params);
  setRequestLocale(locale);

  return <ReviewsPage locale={locale} />;
}
