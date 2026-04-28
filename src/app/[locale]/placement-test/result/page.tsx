import type { Metadata } from "next";

import { setRequestLocale } from "next-intl/server";

import { PlacementTestResultPage } from "@/components/pages/placement-test-result-page";
import { siteConfig } from "@/config/site";
import { copy } from "@/content/locale-copy";
import { getLanguageAlternates } from "@/lib/metadata";
import { placementCopy } from "@/features/placement-test/copy";
import { resolveLocale } from "@/lib/locale";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const title = `${copy(locale, placementCopy.resultTitle)} | ${siteConfig.brandName}`;
  const description = copy(locale, placementCopy.resultHeroDescription);
  const resultPath = "/placement-test/result";
  const canonical = new URL(
    `/${locale}${resultPath}`,
    siteConfig.siteUrl,
  ).toString();

  return {
    metadataBase: new URL(siteConfig.siteUrl),
    title,
    description,
    robots: {
      index: false,
      follow: false,
    },
    alternates: {
      canonical,
      languages: getLanguageAlternates(resultPath),
    },
    openGraph: {
      type: "website",
      siteName: siteConfig.brandName,
      title,
      description,
      locale,
      url: canonical,
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default async function PlacementTestResultRoute({ params }: PageProps) {
  const locale = await resolveLocale(params);
  setRequestLocale(locale);

  return <PlacementTestResultPage locale={locale} />;
}
