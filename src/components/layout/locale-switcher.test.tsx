import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import type { Locale } from "@/i18n/routing";

let currentLocale: Locale = "en";
const replace = vi.fn();

vi.mock("next-intl", () => ({
  useLocale: () => currentLocale,
  useTranslations: () => (key: string) =>
    key === "label" ? "Language selector" : key,
}));

vi.mock("@/i18n/navigation", () => ({
  usePathname: () => "/reviews",
  useRouter: () => ({
    replace,
  }),
}));

afterEach(() => {
  currentLocale = "en";
  replace.mockReset();
});

describe("LocaleSwitcher", () => {
  it("renders fixed self-name labels and highlights the current locale", () => {
    currentLocale = "ar";

    render(<LocaleSwitcher variant="inline" />);

    expect(screen.getByRole("button", { name: /English/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /العربية/ })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: /Türkçe/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Українська/ })).toBeInTheDocument();
  });

  it("switches locale using the fixed labels", () => {
    render(<LocaleSwitcher variant="inline" />);

    fireEvent.click(screen.getByRole("button", { name: /Deutsch/ }));

    expect(replace).toHaveBeenCalledWith("/reviews", { locale: "de" });
  });

  it("opens and closes the popover from a compact trigger", async () => {
    render(<LocaleSwitcher triggerLabel="code" variant="popover" />);

    const trigger = screen.getByRole("button", {
      name: "Language selector: English",
    });

    expect(trigger).toHaveTextContent("EN");
    fireEvent.click(trigger);

    expect(screen.getByRole("button", { name: /Français/ })).toBeInTheDocument();

    fireEvent.keyDown(document, { key: "Escape" });

    await waitFor(() =>
      expect(screen.queryByRole("button", { name: /Français/ })).not.toBeInTheDocument(),
    );
  });
});
