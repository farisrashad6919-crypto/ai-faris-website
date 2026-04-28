import type { Metadata } from "next";

import { setRequestLocale } from "next-intl/server";

import { PlacementTestPage } from "@/components/pages/placement-test-page";
import { resolveLocale } from "@/lib/locale";
import { getPageMetadata } from "@/lib/metadata";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return getPageMetadata(locale, "placementTest");
}

export default async function PlacementTestRoute({ params }: PageProps) {
  const locale = await resolveLocale(params);
  setRequestLocale(locale);

  return <PlacementTestPage locale={locale} />;
}
