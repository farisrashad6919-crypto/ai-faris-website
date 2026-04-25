import type { Metadata } from "next";

import { siteConfig } from "@/config/site";
import { copy } from "@/content/locale-copy";
import { getRouteByKey, localizeRoute } from "@/content/routes";
import { getTrackById } from "@/content/tracks";
import type { RouteKey, TrackId } from "@/content/types";
import { locales, type Locale } from "@/i18n/routing";

function isTrackKey(page: RouteKey): page is TrackId {
  return page === "ielts" || page === "business" || page === "general" || page === "teacher-training";
}

export function getLanguageAlternates(pathname: string): Record<Locale | "x-default", string> {
  return {
    ...Object.fromEntries(
      locales.map((locale) => [locale, localizeRoute(locale, pathname)]),
    ),
    "x-default": localizeRoute("en", pathname),
  } as Record<Locale | "x-default", string>;
}

export async function getPageMetadata(
  locale: Locale,
  page: RouteKey,
): Promise<Metadata> {
  const route = getRouteByKey(page);
  const track = isTrackKey(page) ? getTrackById(page) : undefined;
  const title = copy(locale, track?.seo.title ?? route.title);
  const description = copy(locale, track?.seo.description ?? route.description);
  const canonical = localizeRoute(locale, route.path);
  const image = route.ogImage ?? "/opengraph-image";

  return {
    metadataBase: new URL(siteConfig.siteUrl),
    title,
    description,
    keywords: route.keywords,
    alternates: {
      canonical,
      languages: getLanguageAlternates(route.path),
    },
    openGraph: {
      type: "website",
      siteName: siteConfig.brandName,
      title,
      description,
      locale,
      url: canonical,
      images: [
        {
          url: new URL(image, siteConfig.siteUrl).toString(),
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [new URL(image, siteConfig.siteUrl).toString()],
    },
  };
}
