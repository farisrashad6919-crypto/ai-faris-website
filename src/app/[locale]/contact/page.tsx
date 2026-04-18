import type { Metadata } from "next";

import { setRequestLocale } from "next-intl/server";

import { ContactPage } from "@/components/pages/contact-page";
import { resolveLocale } from "@/lib/locale";
import { getPageMetadata } from "@/lib/metadata";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return getPageMetadata(locale, "contact");
}

export default async function ContactRoute({ params }: PageProps) {
  const locale = await resolveLocale(params);
  setRequestLocale(locale);

  return <ContactPage locale={locale} />;
}
