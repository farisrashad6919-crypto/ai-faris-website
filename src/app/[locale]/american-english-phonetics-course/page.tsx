import type { Metadata } from "next";

import { setRequestLocale } from "next-intl/server";

import { PhoneticsCoursePage } from "@/components/pages/phonetics-course-page";
import { getPageMetadata } from "@/lib/metadata";
import { resolveLocale } from "@/lib/locale";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return getPageMetadata(locale, "phoneticsCourse");
}

export default async function AmericanEnglishPhoneticsCourseRoute({
  params,
}: PageProps) {
  const locale = await resolveLocale(params);
  setRequestLocale(locale);

  return <PhoneticsCoursePage locale={locale} />;
}
