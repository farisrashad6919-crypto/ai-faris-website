import type { Metadata } from "next";

import { setRequestLocale } from "next-intl/server";

import { ResultsPage } from "@/components/pages/results-page";
import { resolveLocale } from "@/lib/locale";
import { getPageMetadata } from "@/lib/metadata";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return getPageMetadata(locale, "results");
}

export default async function ResultsRoute({ params }: PageProps) {
  const locale = await resolveLocale(params);
  setRequestLocale(locale);

  return <ResultsPage locale={locale} />;
}
