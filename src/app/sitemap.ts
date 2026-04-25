import type { MetadataRoute } from "next";

import { siteRoutes } from "@/content/routes";
import { siteConfig } from "@/config/site";
import { locales } from "@/i18n/routing";

export default function sitemap(): MetadataRoute.Sitemap {
  return siteRoutes.flatMap((route) =>
    locales.map((locale) => ({
      url: new URL(
        `/${locale}${route.path === "/" ? "" : route.path}`,
        siteConfig.siteUrl,
      ).toString(),
      alternates: {
        languages: Object.fromEntries(
          locales.map((item) => [
            item,
            new URL(
              `/${item}${route.path === "/" ? "" : route.path}`,
              siteConfig.siteUrl,
            ).toString(),
          ]),
        ),
      },
    })),
  );
}
