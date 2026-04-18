import type { Metadata } from "next";

import { setRequestLocale } from "next-intl/server";

import { AboutPage } from "@/components/pages/about-page";
import { resolveLocale } from "@/lib/locale";
import { getPageMetadata } from "@/lib/metadata";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return getPageMetadata(locale, "about");
}

export default async function AboutRoute({ params }: PageProps) {
  const locale = await resolveLocale(params);
  setRequestLocale(locale);

  return <AboutPage locale={locale} />;
}
