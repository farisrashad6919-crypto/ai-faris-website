import type { Metadata } from "next";
import type { ReactNode } from "react";

import {
  Manrope,
  Noto_Naskh_Arabic,
  Noto_Sans_Arabic,
  Noto_Serif,
} from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { siteConfig } from "@/config/site";
import { copy } from "@/content/locale-copy";
import { locales } from "@/i18n/routing";
import { getDirection, resolveLocale } from "@/lib/locale";

import "../globals.css";

const displayLatin = Noto_Serif({
  subsets: ["latin"],
  variable: "--font-display-latin",
  display: "swap",
});

const bodyLatin = Manrope({
  subsets: ["latin"],
  variable: "--font-body-latin",
  display: "swap",
});

const displayArabic = Noto_Naskh_Arabic({
  subsets: ["arabic"],
  variable: "--font-display-arabic",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const bodyArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-body-arabic",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  applicationName: siteConfig.brandName,
  authors: [{ name: siteConfig.brandName }],
  creator: siteConfig.brandName,
  openGraph: {
    siteName: siteConfig.brandName,
  },
  twitter: {
    card: "summary_large_image",
  },
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const dynamicParams = false;

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const locale = await resolveLocale(params);
  const direction = getDirection(locale);
  const fontVariables =
    locale === "ar"
      ? `${displayArabic.variable} ${bodyArabic.variable}`
      : `${displayLatin.variable} ${bodyLatin.variable}`;

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html
      className={fontVariables}
      dir={direction}
      lang={locale}
      suppressHydrationWarning
    >
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <a className="skip-link" href="#content">
            {copy(locale, "Skip to content")}
          </a>
          <div className="relative isolate overflow-x-clip">
            <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[34rem] bg-[radial-gradient(circle_at_top,rgba(255,221,182,0.38),transparent_46%)]" />
            <SiteHeader locale={locale} />
            <main id="content">{children}</main>
            <SiteFooter locale={locale} />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
