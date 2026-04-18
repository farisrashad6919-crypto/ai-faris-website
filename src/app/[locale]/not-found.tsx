import { getTranslations } from "next-intl/server";

import { ButtonLink } from "@/components/ui/button-link";

export default async function LocaleNotFound() {
  const t = await getTranslations("NotFound");

  return (
    <section className="section-space">
      <div className="container-shell">
        <div className="paper-panel mx-auto max-w-2xl rounded-[1.5rem] p-8 text-center md:p-10">
          <p className="eyebrow">{t("eyebrow")}</p>
          <h1 className="mt-4 text-5xl md:text-6xl">{t("title")}</h1>
          <p className="muted-copy mt-4 text-base leading-7">{t("description")}</p>
          <div className="mt-8 flex justify-center">
            <ButtonLink href="/">{t("cta")}</ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
