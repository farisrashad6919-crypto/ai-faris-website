import type { Metadata } from "next";

import { setRequestLocale } from "next-intl/server";

import { ServicesPage } from "@/components/pages/services-page";
import { resolveLocale } from "@/lib/locale";
import { getPageMetadata } from "@/lib/metadata";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return getPageMetadata(locale, "services");
}

export default async function ServicesRoute({ params }: PageProps) {
  const locale = await resolveLocale(params);
  setRequestLocale(locale);

  return <ServicesPage locale={locale} />;
}
