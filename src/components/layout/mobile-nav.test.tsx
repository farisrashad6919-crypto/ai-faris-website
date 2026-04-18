import type { AnchorHTMLAttributes, ReactNode } from "react";
import { forwardRef } from "react";

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { MobileNav } from "@/components/layout/mobile-nav";

const replace = vi.fn();

vi.mock("next-intl", () => ({
  useLocale: () => "en",
}));

vi.mock("@/i18n/navigation", () => ({
  Link: forwardRef<
    HTMLAnchorElement,
    AnchorHTMLAttributes<HTMLAnchorElement> & {
      children?: ReactNode;
      href: string;
    }
  >(function MockLink(
    { children, href, onClick, ...props },
    ref,
  ) {
    return (
      <a href={href} onClick={onClick} ref={ref} {...props}>
        {children}
      </a>
    );
  }),
  usePathname: () => "/en/services",
  useRouter: () => ({
    replace,
  }),
}));

vi.mock("@/components/layout/locale-switcher", () => ({
  LocaleSwitcher: () => <div data-testid="locale-switcher">switcher</div>,
}));

afterEach(() => {
  replace.mockReset();
});

describe("MobileNav", () => {
  it("opens, focuses the first link, and closes on Escape", async () => {
    render(
      <MobileNav
        closeLabel="Close"
        ctaHref="/en/contact#inquiry-form"
        ctaLabel="Book"
        items={[
          { href: "/", label: "Home" },
          { href: "/services", label: "Services" }
        ]}
        switcherLabel="Open"
      />,
    );

    const trigger = screen.getByRole("button", { name: "Open" });
    fireEvent.click(trigger);

    const firstLink = await screen.findByRole("link", { name: "Home" });
    expect(firstLink).toHaveFocus();

    fireEvent.keyDown(document, { key: "Escape" });

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    await waitFor(() => expect(trigger).toHaveFocus());
  });
});
