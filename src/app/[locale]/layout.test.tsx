import type { ReactNode } from "react";

import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("next/font/google", () => ({
  Manrope: () => ({ variable: "font-body" }),
  Noto_Naskh_Arabic: () => ({ variable: "font-display-ar" }),
  Noto_Sans_Arabic: () => ({ variable: "font-body-ar" }),
  Noto_Serif: () => ({ variable: "font-display" }),
}));

vi.mock("next-intl", () => ({
  NextIntlClientProvider: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

vi.mock("next-intl/server", () => ({
  getMessages: vi.fn(async () => ({})),
  setRequestLocale: vi.fn(),
}));

vi.mock("@/components/layout/site-header", () => ({
  SiteHeader: () => <div>header</div>,
}));

vi.mock("@/components/layout/site-footer", () => ({
  SiteFooter: () => <div>footer</div>,
}));

afterEach(() => {
  vi.restoreAllMocks();
});

describe("LocaleLayout", () => {
  it("renders Arabic pages with rtl direction", async () => {
    const { default: LocaleLayout } = await import("./layout");
    const view = await LocaleLayout({
      children: <div>content</div>,
      params: Promise.resolve({ locale: "ar" }),
    });

    expect(view.props.lang).toBe("ar");
    expect(view.props.dir).toBe("rtl");
  });
});
