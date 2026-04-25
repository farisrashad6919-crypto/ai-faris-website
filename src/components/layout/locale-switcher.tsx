"use client";

import { startTransition, useEffect, useRef, useState } from "react";

import { Check, ChevronDown, Globe2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { localeSelfNames, localeShortLabels } from "@/i18n/locale-labels";
import { usePathname, useRouter } from "@/i18n/navigation";
import { locales, type Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

type LocaleSwitcherProps = {
  align?: "start" | "end";
  className?: string;
  onLocaleChange?: () => void;
  triggerLabel?: "name" | "code";
  variant?: "popover" | "inline";
};

export function LocaleSwitcher({
  align = "end",
  className,
  onLocaleChange,
  triggerLabel = "name",
  variant = "inline",
}: LocaleSwitcherProps) {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("LocaleSwitcher");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const switchLocale = (option: Locale) => {
    const isActive = option === locale;

    setOpen(false);

    if (isActive) return;

    startTransition(() => {
      router.replace(pathname, { locale: option });
    });
    onLocaleChange?.();
  };

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const localeButtons = locales.map((option) => {
    const isActive = option === locale;

    return (
      <button
        aria-pressed={isActive}
        className={cn(
          "inline-flex items-center justify-between gap-3 rounded-sm px-3 py-2 text-sm font-semibold",
          variant === "popover" && "w-full",
          isActive
            ? "bg-primary text-surface-container-lowest"
            : "bg-surface-container-low/80 text-primary hover:bg-surface-container-low",
        )}
        key={option}
        onClick={() => switchLocale(option)}
        type="button"
      >
        <span>{localeSelfNames[option]}</span>
        {isActive ? <Check className="size-3.5 shrink-0" aria-hidden="true" /> : null}
      </button>
    );
  });

  if (variant === "popover") {
    const usesCodeLabel = triggerLabel === "code";

    return (
      <div className={cn("relative", className)} ref={containerRef}>
        <button
          aria-expanded={open}
          aria-haspopup="true"
          aria-label={`${t("label")}: ${localeSelfNames[locale]}`}
          className={cn(
            "glass-panel inline-flex items-center justify-center rounded-sm text-sm font-semibold text-primary",
            usesCodeLabel ? "h-10 min-w-12 gap-1 px-2" : "h-11 gap-2 px-3",
          )}
          onClick={() => setOpen((current) => !current)}
          type="button"
        >
          {usesCodeLabel ? null : <Globe2 className="size-4" aria-hidden="true" />}
          <span>
            {usesCodeLabel ? localeShortLabels[locale] : localeSelfNames[locale]}
          </span>
          <ChevronDown
            className={cn("size-3.5 transition-transform", open && "rotate-180")}
            aria-hidden="true"
          />
        </button>

        {open ? (
          <div
            aria-label={t("label")}
            className={cn(
              "paper-panel absolute top-[calc(100%+0.55rem)] z-[80] grid w-56 gap-1 rounded-md border border-white/60 p-2 shadow-float",
              align === "end" ? "end-0" : "start-0",
            )}
            role="group"
          >
            {localeButtons}
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div
      aria-label={t("label")}
      className={cn("flex flex-wrap items-center gap-2", className)}
      role="group"
    >
      {localeButtons}
    </div>
  );
}
