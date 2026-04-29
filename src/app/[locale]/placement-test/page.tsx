import type { Metadata } from "next";

import { setRequestLocale } from "next-intl/server";

import { PlacementTestPage } from "@/components/pages/placement-test-page";
import { resolveLocale } from "@/lib/locale";
import { getPageMetadata } from "@/lib/metadata";

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return getPageMetadata(locale, "placementTest");
}

function hasStartParam(
  searchParams: { [key: string]: string | string[] | undefined } | undefined,
) {
  const start = searchParams?.start;
  return Array.isArray(start) ? start.includes("1") : start === "1";
}

export default async function PlacementTestRoute({
  params,
  searchParams,
}: PageProps) {
  const locale = await resolveLocale(params);
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  setRequestLocale(locale);

  return (
    <PlacementTestPage
      autoStart={hasStartParam(resolvedSearchParams)}
      locale={locale}
    />
  );
}
