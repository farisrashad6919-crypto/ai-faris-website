import { describe, expect, it } from "vitest";

import { placementItemBank } from "./item-bank";
import { scorePlacementAttempt } from "./scoring";
import type { PlacementAnswer, PlacementItem } from "./types";

const balancedItems = [
  ...placementItemBank.filter((item) => item.skill === "vocabulary").slice(0, 14),
  ...placementItemBank.filter((item) => item.skill === "grammar").slice(0, 14),
];

function correctIds(item: PlacementItem) {
  return Array.isArray(item.correctAnswerId)
    ? item.correctAnswerId
    : [item.correctAnswerId];
}

function answerItems(items = balancedItems, correct = true): PlacementAnswer[] {
  return items.map((item, index) => ({
    itemId: item.id,
    selectedOptionIds: correct ? correctIds(item) : ["not-correct"],
    stage: index < 8 ? 1 : index < 22 ? 2 : 3,
    answeredAt: new Date(2026, 3, 27).toISOString(),
    elapsedSeconds: index * 20,
  }));
}

describe("placement scoring", () => {
  it("returns a CEFR estimate, grammar/vocabulary breakdown, and teacher diagnostic", () => {
    const result = scorePlacementAttempt(answerItems());

    expect(result.estimatedCefrLevel).toMatch(/^(A1|A2|B1|B2|C1|C2)$/);
    expect(result.totalQuestionsAnswered).toBe(28);
    expect(result.correctAnswersCount).toBe(28);
    expect(result.answerSummary).toHaveLength(28);
    expect(result.skillBreakdown.vocabulary.total).toBeGreaterThan(0);
    expect(result.skillBreakdown.grammar.total).toBeGreaterThan(0);
    expect(result.teacherDiagnostic.recommendedFirstLessons).toHaveLength(3);
  });

  it("uses goal context in recommendation mapping", () => {
    const advancedItems = placementItemBank
      .filter((item) => item.difficulty >= 4.8)
      .slice(0, 28);
    const result = scorePlacementAttempt(answerItems(advancedItems), {
      learningGoal: "I need clearer English for meetings and interviews.",
    });

    expect(result.recommendedTrack).toBe("business");
    expect(result.recommendedNextStep).toContain("Business English");
  });

  it("surfaces weak grammar patterns in recommendations", () => {
    const grammarWeakAnswers = balancedItems.map((item, index) => ({
      itemId: item.id,
      selectedOptionIds: item.skill === "grammar" ? ["wrong"] : correctIds(item),
      stage: index < 8 ? 1 : index < 22 ? 2 : 3,
      answeredAt: new Date(2026, 3, 27).toISOString(),
      elapsedSeconds: index * 20,
    }));
    const result = scorePlacementAttempt(grammarWeakAnswers);

    expect(result.weakestArea).toBe("grammar");
    expect(result.topGrammarGaps.length).toBeGreaterThan(0);
    expect(result.recommendations.join(" ")).toContain("grammar");
  });
});
