import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";
import { locales } from "@/i18n/routing";

const routes = ["", "/about", "/services", "/results", "/contact"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.flatMap((route) =>
    locales.map((locale) => ({
      url: new URL(`/${locale}${route}`, siteConfig.siteUrl).toString(),
      alternates: {
        languages: Object.fromEntries(
          locales.map((item) => [
            item,
            new URL(`/${item}${route}`, siteConfig.siteUrl).toString(),
          ]),
        ),
      },
    })),
  );
}
