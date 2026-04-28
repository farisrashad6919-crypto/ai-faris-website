import { describe, expect, it } from "vitest";

import {
  placementItemBank,
  toPublicPlacementItem,
  validatePlacementItemBank,
} from "./item-bank";

describe("placement item bank", () => {
  it("contains and validates the 1000-item A1-C2 grammar/vocabulary bank", () => {
    const validation = validatePlacementItemBank(placementItemBank);

    expect(placementItemBank).toHaveLength(1000);
    expect(validation.valid).toBe(true);
    expect(validation.errors).toEqual([]);
    expect(validation.distribution).toEqual({
      A1: { vocabulary: 65, grammar: 65 },
      A2: { vocabulary: 80, grammar: 80 },
      B1: { vocabulary: 95, grammar: 95 },
      B2: { vocabulary: 105, grammar: 105 },
      C1: { vocabulary: 90, grammar: 90 },
      C2: { vocabulary: 65, grammar: 65 },
    });
  });

  it("keeps answer keys and internal scoring data out of public item payloads", () => {
    const publicItem = toPublicPlacementItem(placementItemBank[0]);

    expect("correctAnswerId" in publicItem).toBe(false);
    expect("difficulty" in publicItem).toBe(false);
    expect("discrimination" in publicItem).toBe(false);
    expect("explanation" in publicItem).toBe(false);
    expect("feedbackIfWrong" in publicItem).toBe(false);
    expect("teachingImplication" in publicItem).toBe(false);
    expect("recommendationTags" in publicItem).toBe(false);
  });

  it("gives every item rich metadata for diagnostics and teacher follow-up", () => {
    for (const item of placementItemBank) {
      expect(item.id).toBeTruthy();
      expect(item.cefrLevel).toMatch(/^(A1|A2|B1|B2|C1|C2)$/);
      expect(item.skill).toMatch(/^(vocabulary|grammar)$/);
      expect(item.construct).toBeTruthy();
      expect(item.microSkill).toBeTruthy();
      expect(item.difficulty).toBeGreaterThanOrEqual(1);
      expect(item.difficulty).toBeLessThanOrEqual(6);
      expect(item.options).toHaveLength(4);
      const correctIds = Array.isArray(item.correctAnswerId)
        ? item.correctAnswerId
        : [item.correctAnswerId];
      expect(
        correctIds.every((id) => item.options.some((option) => option.id === id)),
      ).toBe(true);
      expect(item.explanation).toBeTruthy();
      expect(item.feedbackIfWrong).toBeTruthy();
      expect(item.teachingImplication).toBeTruthy();
      expect(item.recommendationTags.length).toBeGreaterThan(0);
      expect(item.estimatedTimeSeconds).toBeGreaterThan(0);
    }
  });
});
