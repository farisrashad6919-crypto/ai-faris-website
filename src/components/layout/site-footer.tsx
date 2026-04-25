import { getTranslations } from "next-intl/server";

import { siteConfig } from "@/config/site";
import { copy } from "@/content/locale-copy";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

import { ButtonLink } from "../ui/button-link";
import { LocaleSwitcher } from "./locale-switcher";

export async function SiteFooter({ locale }: { locale: Locale }) {
  const t = await getTranslations("Footer");
  const socialLinks = siteConfig.socialLinks;

  return (
    <footer className="section-space-sm pt-14">
      <div className="container-shell overflow-hidden rounded-lg bg-primary px-6 py-8 text-surface-container-lowest shadow-glow md:px-10">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="space-y-5">
            <p className="eyebrow text-tertiary-fixed">{t("eyebrow")}</p>
            <Link
              className="block max-w-2xl font-display text-4xl text-surface-container-lowest md:text-5xl"
              href="/"
              locale={locale}
            >
              {siteConfig.brandName}
            </Link>
            <p className="max-w-2xl text-sm leading-7 text-surface-container-lowest/78 md:text-base">
              {t("summary")}
            </p>
          </div>

          <div className="grid gap-5">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-tertiary-fixed">
                {copy(locale, "Languages")}
              </p>
              <div className="rounded-md bg-white/8 p-3">
                <LocaleSwitcher compact />
              </div>
            </div>
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-tertiary-fixed">
                {t("connect")}
              </p>
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((item) => (
                  <ButtonLink
                    className="border border-white/10 bg-white/5 text-surface-container-lowest hover:bg-white/10"
                    external
                    href={item.href}
                    key={item.id}
                    variant="secondary"
                  >
                    {item.label}
                  </ButtonLink>
                ))}
              </div>
            </div>
            <div className="space-y-2 text-sm text-surface-container-lowest/72">
              <p>{t("note")}</p>
              <p>
                {t("copyright", { year: new Date().getFullYear().toString() })}
              </p>
              <p>
                <a
                  className="underline decoration-white/30 underline-offset-4"
                  href={siteConfig.preplyUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  {t("source")}
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
