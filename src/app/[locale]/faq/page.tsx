import type { Metadata } from "next";

import { setRequestLocale } from "next-intl/server";

import { FaqPage } from "@/components/pages/faq-page";
import { resolveLocale } from "@/lib/locale";
import { getPageMetadata } from "@/lib/metadata";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return getPageMetadata(locale, "faq");
}

export default async function FaqRoute({ params }: PageProps) {
  const locale = await resolveLocale(params);
  setRequestLocale(locale);

  return <FaqPage locale={locale} />;
}
