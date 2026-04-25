import { defineRouting } from "next-intl/routing";

export const locales = ["en", "ar", "tr", "es", "it", "de", "fr", "uk"] as const;
export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  locales,
  defaultLocale: "en",
  localePrefix: "always",
  alternateLinks: true,
  localeDetection: true,
});

export const rtlLocales: readonly Locale[] = ["ar"];

export function isValidLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function isRtlLocale(locale: Locale): boolean {
  return rtlLocales.includes(locale);
}
