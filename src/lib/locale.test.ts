import { describe, expect, it } from "vitest";

import {
  getDirection,
  localizePathname,
  stripLocaleFromPathname,
  switchLocalePathname,
} from "@/lib/locale";

describe("locale helpers", () => {
  it("returns rtl for Arabic", () => {
    expect(getDirection("ar")).toBe("rtl");
    expect(getDirection("en")).toBe("ltr");
  });

  it("removes the locale prefix from a pathname", () => {
    expect(stripLocaleFromPathname("/ar/services")).toBe("/services");
    expect(stripLocaleFromPathname("/tr")).toBe("/");
  });

  it("rebuilds the pathname with a new locale while preserving the slug", () => {
    expect(switchLocalePathname("/en/results", "ar")).toBe("/ar/results");
    expect(localizePathname("tr", "/contact")).toBe("/tr/contact");
  });
});
