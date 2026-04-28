import { describe, expect, it } from "vitest";

import { locales } from "@/i18n/routing";

import { placementCopy } from "./copy";

describe("placement localized copy", () => {
  it("provides required UI/result keys for every supported locale", () => {
    const keys = [
      placementCopy.title,
      placementCopy.descriptionCurrent,
      placementCopy.estimatedTime,
      placementCopy.scopeNoteCurrent,
      placementCopy.introDescriptionCurrent,
      placementCopy.detailsDescription,
      placementCopy.resultTitle,
      placementCopy.recommendations,
      placementCopy.firstLessons,
      placementCopy.teachingPriorities,
      placementCopy.bookDiagnostic,
      placementCopy.contactCta,
    ];

    for (const key of keys) {
      for (const locale of locales) {
        expect(key[locale]).toBeTruthy();
      }
    }
  });
});
