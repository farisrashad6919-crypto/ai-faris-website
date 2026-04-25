import { NextResponse, type NextRequest } from "next/server";

import { isValidLocale, routing, type Locale } from "@/i18n/routing";

function detectLocale(request: NextRequest): Locale {
  const header = request.headers.get("accept-language");

  if (!header) {
    return routing.defaultLocale;
  }

  const requestedLocales = header
    .split(",")
    .map((value) => value.trim().split(";")[0]?.toLowerCase())
    .filter(Boolean);

  for (const requested of requestedLocales) {
    const baseLocale = requested.split("-")[0];

    if (isValidLocale(baseLocale)) {
      return baseLocale;
    }
  }

  return routing.defaultLocale;
}

export default function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const localeMatch = routing.locales.find(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );

  if (localeMatch) {
    const withoutLocale = pathname.slice(localeMatch.length + 1) || "/";

    if (withoutLocale === "/services" || withoutLocale.startsWith("/services/")) {
      const redirectUrl = new URL(
        `/${localeMatch}/programs${withoutLocale.slice("/services".length)}${search}`,
        request.url,
      );
      return NextResponse.redirect(redirectUrl, 301);
    }

    if (withoutLocale === "/results" || withoutLocale.startsWith("/results/")) {
      const redirectUrl = new URL(
        `/${localeMatch}/reviews${withoutLocale.slice("/results".length)}${search}`,
        request.url,
      );
      return NextResponse.redirect(redirectUrl, 301);
    }
  }

  if (pathname === "/services" || pathname.startsWith("/services/")) {
    const locale = detectLocale(request);
    const redirectUrl = new URL(
      `/${locale}/programs${pathname.slice("/services".length)}${search}`,
      request.url,
    );
    return NextResponse.redirect(redirectUrl, 301);
  }

  if (pathname === "/results" || pathname.startsWith("/results/")) {
    const locale = detectLocale(request);
    const redirectUrl = new URL(
      `/${locale}/reviews${pathname.slice("/results".length)}${search}`,
      request.url,
    );
    return NextResponse.redirect(redirectUrl, 301);
  }

  const pathnameHasLocale = routing.locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  const locale = detectLocale(request);
  const normalizedPath = pathname === "/" ? "" : pathname;
  const redirectUrl = new URL(`/${locale}${normalizedPath}${search}`, request.url);

  return NextResponse.redirect(redirectUrl);
}

export const config = {
  matcher: ["/", "/((?!api|_next|_vercel|.*\\..*).*)"],
};
