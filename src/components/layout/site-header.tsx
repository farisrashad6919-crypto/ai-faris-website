import { ArrowUpRight, Globe } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { siteConfig, getBookingHref } from "@/config/site";
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
    { href: "/services", label: t("services") },
    { href: "/results", label: t("results") },
    { href: "/contact", label: t("contact") },
  ];

  return (
    <header className="sticky top-0 z-50 px-4 pt-4">
      <div className="glass-panel container-shell rounded-lg px-4 py-3 md:px-6">
        <div className="flex items-center justify-between gap-4">
          <Link className="min-w-0 flex-1" href="/">
            <span className="block font-display text-xl text-primary md:text-2xl">
              {siteConfig.brandName}
            </span>
            <span className="mt-1 block text-xs uppercase tracking-[0.18em] text-secondary">
              English Trainer • Communication Mentor
            </span>
          </Link>

          <nav
            aria-label="Primary"
            className="hidden items-center gap-7 lg:flex"
          >
            {items.map((item) => (
              <Link
                className="text-sm font-medium text-primary/82 hover:text-primary"
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <LocaleSwitcher />
            <ButtonLink href={getBookingHref(locale)} variant="primary">
              <span>{t("bookSession")}</span>
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </ButtonLink>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <div className="hidden sm:block">
              <LocaleSwitcher compact />
            </div>
            <MobileNav
              closeLabel={t("closeMenu")}
              ctaHref={getBookingHref(locale)}
              ctaLabel={t("bookSession")}
              items={items}
              switcherLabel={t("openMenu")}
            />
          </div>
        </div>
        <div className="mt-3 hidden items-center gap-3 text-xs uppercase tracking-[0.16em] text-secondary md:flex lg:hidden">
          <Globe className="size-3.5" />
          <span>English • العربية • Türkçe</span>
        </div>
      </div>
    </header>
  );
}
