import type { Metadata } from "next";

import { setRequestLocale } from "next-intl/server";

import { HomePage } from "@/components/pages/home-page";
import { getPageMetadata } from "@/lib/metadata";
import { resolveLocale } from "@/lib/locale";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return getPageMetadata(locale, "home");
}

export default async function LocaleHomePage({ params }: PageProps) {
  const locale = await resolveLocale(params);
  setRequestLocale(locale);

  return <HomePage locale={locale} />;
}
