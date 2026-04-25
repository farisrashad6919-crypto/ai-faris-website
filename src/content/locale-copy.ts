import { locales, type Locale } from "@/i18n/routing";

import type { LocalizedText } from "./types";
import { translationMemory } from "./translation-memory";

function isReadable(value: string) {
  return !/[ØÙÂÃ]/.test(value);
}

export function copy(locale: Locale, value: string | LocalizedText) {
  const source = typeof value === "string" ? value : value[locale];
  const canonical = typeof value === "string" ? source : value.en;
  const translated = translationMemory[canonical]?.[locale] ?? translationMemory[source]?.[locale];

  return translated && isReadable(translated) ? translated : source;
}

export function text(
  en: string,
  overrides: Partial<Record<Locale, string>> = {},
): LocalizedText {
  return Object.fromEntries(
    locales.map((locale) => {
      const value = overrides[locale] ?? translationMemory[en]?.[locale];
      return [locale, value && isReadable(value) ? value : en];
    }),
  ) as LocalizedText;
}

export const uiCopy = {
  sectionLabels: {
    for: text("This page is for", { ar: "هذه الصفحة مناسبة لـ" }),
    painPoints: text("Main struggles", { ar: "أهم التحديات" }),
    why: text("Why this track matters", { ar: "لماذا يهم هذا المسار" }),
    help: text("How I help", { ar: "كيف أساعدك" }),
    curriculum: text("What we can work on", { ar: "ما يمكننا العمل عليه" }),
    reviews: text("Real reviews", { ar: "مراجعات حقيقية" }),
    media: text("Class proof", { ar: "دليل من الحصص" }),
    notFor: text("Who this is not for", { ar: "لمن لا يناسب هذا المسار" }),
    future: text("Future resources", { ar: "موارد قادمة" }),
    next: text("What happens next", { ar: "ماذا يحدث بعد ذلك" }),
    faq: text("Questions", { ar: "أسئلة" }),
    final: text("Next step", { ar: "الخطوة التالية" }),
  },
  common: {
    bookPreply: text("Book on Preply", { ar: "احجز على Preply" }),
    explorePrograms: text("Explore programs", { ar: "استكشف البرامج" }),
    registerInterest: text("Register interest", { ar: "سجل اهتمامك" }),
    filterAll: text("All", { ar: "الكل" }),
  },
  whatNext: {
    title: text("What happens next", { ar: "ماذا يحدث بعد ذلك" }),
    items: [
      text("Your inquiry is reviewed with the track and goal you selected.", {
        ar: "تتم مراجعة طلبك حسب المسار والهدف الذي اخترته.",
      }),
      text(
        "You receive the most suitable next step: Preply trial, webinar, placement test, or training invitation.",
        {
          ar: "ستحصل على أنسب خطوة تالية: تجربة على Preply أو ندوة أو اختبار تحديد مستوى أو دعوة تدريب.",
        },
      ),
      text(
        "If you are ready now, Preply remains the fastest way to book a focused first session.",
        {
          ar: "إذا كنت مستعدا الآن، يبقى Preply أسرع طريقة لحجز أول حصة مركزة.",
        },
      ),
    ],
  },
} as const;
