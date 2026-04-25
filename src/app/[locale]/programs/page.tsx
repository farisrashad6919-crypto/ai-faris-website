import type { Metadata } from "next";

import { setRequestLocale } from "next-intl/server";

import { ProgramsPage } from "@/components/pages/programs-page";
import { resolveLocale } from "@/lib/locale";
import { getPageMetadata } from "@/lib/metadata";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return getPageMetadata(locale, "programs");
}

export default async function ProgramsRoute({ params }: PageProps) {
  const locale = await resolveLocale(params);
  setRequestLocale(locale);

  return <ProgramsPage locale={locale} />;
}
