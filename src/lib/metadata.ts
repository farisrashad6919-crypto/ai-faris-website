import type { Metadata } from "next";

import { siteConfig } from "@/config/site";
import type { Locale } from "@/i18n/routing";

import { getMessageValue, loadMessages, type AppMessages } from "./messages";

const routeMap = {
  home: "/",
  about: "/about",
  services: "/services",
  results: "/results",
  contact: "/contact",
} as const;

type MetadataPage = keyof typeof routeMap;

type PageMetaContent = {
  title: string;
  description: string;
  keywords: string[];
};

export function getLanguageAlternates(pathname: string) {
  return {
    en: new URL(`/en${pathname}`, siteConfig.siteUrl).toString(),
    ar: new URL(`/ar${pathname}`, siteConfig.siteUrl).toString(),
    tr: new URL(`/tr${pathname}`, siteConfig.siteUrl).toString(),
    "x-default": new URL(`/en${pathname}`, siteConfig.siteUrl).toString(),
  };
}

export async function getPageMetadata(
  locale: Locale,
  page: MetadataPage,
): Promise<Metadata> {
  const messages = await loadMessages(locale);
  const meta = getMessageValue<PageMetaContent>(messages, `Metadata.${page}`);
  const pathname = routeMap[page];
  const canonical = new URL(`/${locale}${pathname}`, siteConfig.siteUrl);

  return {
    metadataBase: new URL(siteConfig.siteUrl),
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    alternates: {
      canonical: canonical.toString(),
      languages: getLanguageAlternates(pathname),
    },
    openGraph: {
      type: "website",
      siteName: siteConfig.brandName,
      title: meta.title,
      description: meta.description,
      locale,
      url: canonical.toString(),
      images: [
        {
          url: new URL("/opengraph-image", siteConfig.siteUrl).toString(),
          width: 1200,
          height: 630,
          alt: siteConfig.brandName,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: [new URL("/twitter-image", siteConfig.siteUrl).toString()],
    },
  };
}

export function getMetadataContent(
  messages: AppMessages,
  page: MetadataPage,
): PageMetaContent {
  return getMessageValue<PageMetaContent>(messages, `Metadata.${page}`);
}
