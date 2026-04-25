import type { Metadata } from "next";

import { setRequestLocale } from "next-intl/server";

import { WebinarsPage } from "@/components/pages/webinars-page";
import { resolveLocale } from "@/lib/locale";
import { getPageMetadata } from "@/lib/metadata";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return getPageMetadata(locale, "webinars");
}

export default async function WebinarsRoute({ params }: PageProps) {
  const locale = await resolveLocale(params);
  setRequestLocale(locale);

  return <WebinarsPage locale={locale} />;
}
