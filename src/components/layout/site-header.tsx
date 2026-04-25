import { getTranslations } from "next-intl/server";

import { siteConfig, getBookingHref } from "@/config/site";
import { copy } from "@/content/locale-copy";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

import { ButtonLink } from "../ui/button-link";
import { LocaleSwitcher } from "./locale-switcher";
import { MobileNav } from "./mobile-nav";

export async function SiteHeader({ locale }: { locale: Locale }) {
  const t = await getTranslations("Navigation");
  const items = [
    { href: "/", label: t("home") },
    { href: "/about", label: t("about") },
    { href: "/programs", label: t("programs") },
    { href: "/reviews", label: t("reviews") },
    { href: "/resources", label: t("resources") },
    { href: "/webinars", label: t("webinars") },
    { href: "/contact", label: t("contact") },
  ];

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 md:px-4 md:pt-4">
      <div className="glass-panel mx-auto w-full max-w-[76rem] rounded-lg px-3 py-2.5 md:px-5">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 md:gap-4 xl:flex xl:justify-between">
          <Link
            className="min-w-0 max-w-[13.5rem] sm:max-w-none xl:w-[20rem] xl:flex-none"
            href="/"
          >
            <span className="block truncate font-display text-base leading-tight text-primary md:text-xl">
              {siteConfig.brandName}
            </span>
            <span className="mt-0.5 block truncate text-[0.62rem] uppercase tracking-[0.12em] text-secondary/82 md:text-[0.68rem] md:tracking-[0.14em]">
              {copy(locale, "English Trainer / Communication Mentor")}
            </span>
          </Link>

          <nav
            aria-label="Primary"
            className="hidden flex-1 items-center justify-center gap-4 xl:flex"
          >
            {items.map((item) => (
              <Link
                className="whitespace-nowrap text-sm font-medium text-primary/82 hover:text-primary"
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden shrink-0 items-center gap-2 xl:flex">
            <LocaleSwitcher align="end" variant="popover" />
            <ButtonLink href={getBookingHref(locale)} variant="primary">
              <span>{t("bookSession")}</span>
            </ButtonLink>
          </div>

          <div className="flex shrink-0 items-center gap-2 xl:hidden">
            <LocaleSwitcher
              align="end"
              triggerLabel="code"
              variant="popover"
            />
            <MobileNav
              closeLabel={t("closeMenu")}
              ctaHref={getBookingHref(locale)}
              ctaLabel={t("bookSession")}
              items={items}
              switcherLabel={t("openMenu")}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
