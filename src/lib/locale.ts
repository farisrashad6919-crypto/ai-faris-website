import { notFound } from "next/navigation";

import { isRtlLocale, isValidLocale, type Locale } from "@/i18n/routing";

export function getDirection(locale: Locale) {
  return isRtlLocale(locale) ? "rtl" : "ltr";
}

export async function resolveLocale(
  params: Promise<{ locale: string }>,
): Promise<Locale> {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  return locale;
}

export function stripLocaleFromPathname(pathname: string) {
  const [, maybeLocale, ...rest] = pathname.split("/");

  if (maybeLocale && isValidLocale(maybeLocale)) {
    return rest.length ? `/${rest.join("/")}` : "/";
  }

  return pathname || "/";
}

export function localizePathname(locale: Locale, pathname = "/") {
  const normalized = pathname === "/" ? "" : pathname;
  return `/${locale}${normalized}`;
}

export function switchLocalePathname(pathname: string, locale: Locale) {
  return localizePathname(locale, stripLocaleFromPathname(pathname));
}
