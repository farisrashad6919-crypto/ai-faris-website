import { describe, expect, it } from "vitest";

import { getLanguageAlternates, getPageMetadata } from "@/lib/metadata";

describe("metadata helpers", () => {
  it("generates hreflang alternates for all locales", () => {
    expect(getLanguageAlternates("/services")).toEqual({
      en: "https://farisrashad.com/en/services",
      ar: "https://farisrashad.com/ar/services",
      tr: "https://farisrashad.com/tr/services",
      "x-default": "https://farisrashad.com/en/services",
    });
  });

  it("returns localized metadata for a page", async () => {
    const metadata = await getPageMetadata("ar", "contact");

    expect(metadata.title).toBe(
      "تواصل | احجز جلسة مع فارس رشاد",
    );
    expect(metadata.alternates?.languages?.ar).toBe(
      "https://farisrashad.com/ar/contact",
    );
    expect(metadata.openGraph?.locale).toBe("ar");
  });
});
