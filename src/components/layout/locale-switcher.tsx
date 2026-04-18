"use client";

import { startTransition } from "react";

import { Check } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { locales, type Locale } from "@/i18n/routing";
import { usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type LocaleSwitcherProps = {
  compact?: boolean;
};

export function LocaleSwitcher({ compact = false }: LocaleSwitcherProps) {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("LocaleSwitcher");

  return (
    <div
      aria-label={t("label")}
      className={cn(
        "flex flex-wrap items-center gap-2",
        compact && "w-full justify-start",
      )}
      role="group"
    >
      {locales.map((option) => {
        const isActive = option === locale;

        return (
          <button
            aria-pressed={isActive}
            className={cn(
              "inline-flex items-center gap-2 rounded-sm px-3 py-2 text-sm font-medium",
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
            }}
            type="button"
          >
            {isActive ? <Check className="size-3.5" aria-hidden="true" /> : null}
            <span>{t(`localeNames.${option}`)}</span>
          </button>
        );
      })}
    </div>
  );
}
