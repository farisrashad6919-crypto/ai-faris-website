import { describe, expect, it } from "vitest";

import {
  placementItemBank,
  toPublicPlacementItem,
  validatePlacementItemBank,
} from "./item-bank";
import { tenseDiagnosticAreas, tenseDifficultyBands } from "./types";

describe("tense diagnostic item bank", () => {
  it("contains and validates the 96-item tense mastery seed bank", () => {
    const validation = validatePlacementItemBank(placementItemBank);

    expect(placementItemBank).toHaveLength(96);
    expect(validation.valid).toBe(true);
    expect(validation.errors).toEqual([]);
    expect(
      tenseDifficultyBands.every(
        (band) => validation.distribution.difficulty[band] > 0,
      ),
    ).toBe(true);
    expect(
      tenseDiagnosticAreas.every(
        (area) => validation.distribution.diagnosticArea[area] >= 5,
      ),
    ).toBe(true);
  });

  it("keeps answer keys and teacher-only diagnostics out of public item payloads", () => {
    const publicItem = toPublicPlacementItem(placementItemBank[0], "test-seed");

    expect("correctAnswerId" in publicItem).toBe(false);
    expect("difficulty" in publicItem).toBe(false);
    expect("explanation" in publicItem).toBe(false);
    expect("feedbackIfWrong" in publicItem).toBe(false);
    expect("teachingImplication" in publicItem).toBe(false);
    expect("recommendationTags" in publicItem).toBe(false);
    expect(publicItem.options).toHaveLength(4);
  });

  it("gives every tense item rich metadata for diagnostics and teacher follow-up", () => {
    for (const item of placementItemBank) {
      expect(item.id).toMatch(/^q\d{3}$/);
      expect(item.targetTense).toBeTruthy();
      expect(tenseDifficultyBands).toContain(item.difficultyBand);
      expect(tenseDiagnosticAreas).toContain(item.diagnosticArea);
      expect(item.difficulty).toBeGreaterThanOrEqual(1);
      expect(item.difficulty).toBeLessThanOrEqual(6);
      expect(item.options).toHaveLength(4);
      expect(item.options.some((option) => option.id === item.correctAnswerId)).toBe(true);
      expect(item.explanation).toBeTruthy();
      expect(item.feedbackIfWrong).toBeTruthy();
      expect(item.teachingImplication).toBeTruthy();
      expect(item.recommendationTags.length).toBeGreaterThan(1);
      expect(item.estimatedTimeSeconds).toBeGreaterThan(0);
    }
  });
});
