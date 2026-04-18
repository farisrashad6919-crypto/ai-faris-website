"use client";

import { startTransition, useEffect, useRef, useState } from "react";

import { Menu, X } from "lucide-react";
import { useLocale } from "next-intl";

import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { locales, type Locale } from "@/i18n/routing";
import { cn, isExternalHref } from "@/lib/utils";

import { LocaleSwitcher } from "./locale-switcher";

type MobileNavProps = {
  closeLabel: string;
  ctaHref: string;
  ctaLabel: string;
  items: Array<{ href: string; label: string }>;
  switcherLabel: string;
};

export function MobileNav({
  closeLabel,
  ctaHref,
  ctaLabel,
  items,
  switcherLabel,
}: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale() as Locale;
  const bookingIsExternal = isExternalHref(ctaHref);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  const closeMenu = () => {
    setOpen(false);
    requestAnimationFrame(() => triggerRef.current?.focus());
  };

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    requestAnimationFrame(() => firstLinkRef.current?.focus());

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <>
      <button
        aria-controls="mobile-navigation"
        aria-expanded={open}
        aria-label={open ? closeLabel : switcherLabel}
        className="glass-panel inline-flex size-11 items-center justify-center rounded-sm text-primary lg:hidden"
        onClick={() => setOpen((current) => !current)}
        ref={triggerRef}
        type="button"
      >
        {open ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>

      {open ? (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <button
            aria-hidden="true"
            className="absolute inset-0 bg-primary/20 backdrop-blur-sm"
            onClick={closeMenu}
            type="button"
          />
          <div
            aria-modal="true"
            className="paper-panel absolute inset-x-4 top-4 rounded-lg p-5"
            id="mobile-navigation"
            role="dialog"
          >
            <div className="mb-8 flex items-center justify-between gap-4">
              <div>
                <p className="eyebrow">Menu</p>
                <p className="mt-2 font-display text-2xl text-primary">
                  {locale === locales[1]
                    ? "اختَر وجهتك"
                    : locale === locales[2]
                      ? "Yolunu seç"
                      : "Choose your path"}
                </p>
              </div>
              <button
                aria-label={closeLabel}
                className="glass-panel inline-flex size-11 items-center justify-center rounded-sm text-primary"
                onClick={closeMenu}
                type="button"
              >
                <X className="size-5" />
              </button>
            </div>

            <nav aria-label="Mobile">
              <ul className="grid gap-3">
                {items.map((item, index) => (
                  <li key={item.href}>
                    <Link
                      className="block rounded-sm border border-transparent px-3 py-3 text-lg font-medium text-primary hover:bg-surface-container-low"
                      href={item.href}
                      onClick={() => setOpen(false)}
                      ref={index === 0 ? firstLinkRef : undefined}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="mt-8 flex flex-col gap-4 border-t ghost-divider pt-6">
              <LocaleSwitcher compact />
              {bookingIsExternal ? (
                <a
                  className="button-primary"
                  href={ctaHref}
                  onClick={() => setOpen(false)}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {ctaLabel}
                </a>
              ) : (
                <Link
                  className="button-primary"
                  href={ctaHref}
                  onClick={() => setOpen(false)}
                >
                  {ctaLabel}
                </Link>
              )}
              <div className="flex flex-wrap gap-2">
                {locales.map((option) => {
                  const isActive = option === locale;

                  return (
                    <button
                      className={cn(
                        "rounded-sm px-3 py-2 text-sm font-medium",
                        isActive
                          ? "bg-primary text-surface-container-lowest"
                          : "glass-panel text-primary",
                      )}
                      key={option}
                      onClick={() => {
                        if (isActive) return;

                        startTransition(() => {
                          router.replace(pathname, { locale: option });
                        });
                        setOpen(false);
                      }}
                      type="button"
                    >
                      {option.toUpperCase()}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
