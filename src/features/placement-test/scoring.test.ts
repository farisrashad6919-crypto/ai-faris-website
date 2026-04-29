import { describe, expect, it } from "vitest";

import { placementItemBank } from "./item-bank";
import { scorePlacementAttempt } from "./scoring";
import type { PlacementAnswer, PlacementItem } from "./types";

const balancedItems = [
  ...placementItemBank.filter((item) => item.difficultyBand !== "advanced").slice(0, 22),
  ...placementItemBank.filter((item) => item.difficultyBand === "advanced").slice(0, 8),
];

function correctIds(item: PlacementItem) {
  return [item.correctAnswerId];
}

function answerItems(items = balancedItems, correct = true): PlacementAnswer[] {
  return items.map((item, index) => ({
    itemId: item.id,
    selectedOptionIds: correct ? correctIds(item) : ["not-correct"],
    stage: index < 8 ? 1 : index < 20 ? 2 : 3,
    answeredAt: new Date(2026, 3, 27).toISOString(),
    elapsedSeconds: index * 20,
  }));
}

describe("tense diagnostic scoring", () => {
  it("returns a mastery label, tense-area breakdown, and teacher diagnostic", () => {
    const result = scorePlacementAttempt(answerItems());

    expect(result.masteryLabel).toMatch(/tense control$/);
    expect(result.totalQuestionsAnswered).toBe(30);
    expect(result.correctAnswersCount).toBe(30);
    expect(result.answerSummary).toHaveLength(30);
    expect(result.presentScore).toBeGreaterThanOrEqual(0);
    expect(result.pastScore).toBeGreaterThanOrEqual(0);
    expect(result.perfectScore).toBeGreaterThanOrEqual(0);
    expect(result.futureScore).toBeGreaterThanOrEqual(0);
    expect(result.areaBreakdown["tense-contrast-control"]).toBeDefined();
    expect(result.teacherDiagnostic.recommendedFirstLessons).toHaveLength(3);
  });

  it("uses goal context in recommendation mapping", () => {
    const result = scorePlacementAttempt(answerItems(), {
      learningGoal: "I need clearer English for meetings and interviews.",
    });

    expect(result.recommendedTrack).toBe("business");
    expect(result.recommendedNextStep).toContain("Business English");
  });

  it("surfaces weak tense patterns in recommendations", () => {
    const weakPresentAnswers = balancedItems.map((item, index) => ({
      itemId: item.id,
      selectedOptionIds:
        item.diagnosticArea === "present-tense-control"
          ? ["wrong"]
          : correctIds(item),
      stage: index < 8 ? 1 : index < 20 ? 2 : 3,
      answeredAt: new Date(2026, 3, 27).toISOString(),
      elapsedSeconds: index * 20,
    }));
    const result = scorePlacementAttempt(weakPresentAnswers);

    expect(result.weakTenseAreas.join(" ")).toContain("Present");
    expect(result.topTenseWeaknesses.length).toBeGreaterThan(0);
    expect(result.recommendedFirstLessons.join(" ")).toContain("Present");
  });
});
