import { permanentRedirect } from "next/navigation";

import { resolveLocale } from "@/lib/locale";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function LegacyServicesRoute({ params }: PageProps) {
  const locale = await resolveLocale(params);
  permanentRedirect(`/${locale}/programs`);
}
