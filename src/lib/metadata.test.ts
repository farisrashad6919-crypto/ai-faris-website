import { describe, expect, it } from "vitest";

import { locales } from "@/i18n/routing";
import { getLanguageAlternates, getPageMetadata } from "@/lib/metadata";

describe("metadata helpers", () => {
  it("generates hreflang alternates for all locales", () => {
    const alternates = getLanguageAlternates("/programs");

    for (const locale of locales) {
      expect(alternates[locale]).toBe(
        `https://farisrashad.com/${locale}/programs`,
      );
    }

    expect(alternates["x-default"]).toBe(
      "https://farisrashad.com/en/programs",
    );
  });

  it("returns route-aware metadata for a static page", async () => {
    const metadata = await getPageMetadata("ar", "contact");

    expect(metadata.title).toContain("تواصل");
    expect(metadata.title).not.toContain("Contact");
    expect(metadata.alternates?.languages?.ar).toBe(
      "https://farisrashad.com/ar/contact",
    );
    expect(metadata.openGraph?.locale).toBe("ar");
  });

  it("uses per-track Open Graph images", async () => {
    const metadata = await getPageMetadata("en", "ielts");
    const images = metadata.openGraph?.images;

    expect(JSON.stringify(images)).toContain("og-ielts-test-prep.jpg");
  });
});
