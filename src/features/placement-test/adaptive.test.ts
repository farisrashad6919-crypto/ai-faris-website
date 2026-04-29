import { describe, expect, it } from "vitest";

import {
  coreQuestionsTarget,
  defaultQuestionsTarget,
  getInitialRoutingItems,
  getNextAdaptiveStage,
  routingQuestionsTarget,
} from "./adaptive";
import { placementItemBank } from "./item-bank";
import type { PlacementAnswer, PlacementItem } from "./types";

const context = { sessionId: "adaptive-test-session", retakeCount: 0 };

function correctIds(item: PlacementItem) {
  return [item.correctAnswerId];
}

function answersForItems(items: PlacementItem[], correct = true): PlacementAnswer[] {
  return items.map((item, index) => ({
    itemId: item.id,
    selectedOptionIds: correct ? correctIds(item) : ["wrong"],
    stage:
      index < routingQuestionsTarget
        ? 1
        : index < routingQuestionsTarget + coreQuestionsTarget
          ? 2
          : 3,
    answeredAt: new Date(2026, 3, 27).toISOString(),
    elapsedSeconds: index * 22,
  }));
}

function answersFor(count: number, correct = true): PlacementAnswer[] {
  return answersForItems(placementItemBank.slice(0, count), correct);
}

describe("tense diagnostic adaptive routing", () => {
  it("starts with eight routing items across tense diagnostic areas", () => {
    const items = getInitialRoutingItems(context);

    expect(items).toHaveLength(8);
    expect(new Set(items.map((item) => item.diagnosticArea)).size).toBeGreaterThanOrEqual(6);
    expect(items.every((item) => item.difficultyBand !== "advanced")).toBe(true);
  });

  it("returns a core tense stage after routing answers", () => {
    const stage = getNextAdaptiveStage(answersFor(routingQuestionsTarget), context);

    expect(stage.completed).toBe(false);
    expect(stage.stage).toBe(2);
    expect(stage.items).toHaveLength(coreQuestionsTarget);
    expect(new Set(stage.items.map((item) => item.id)).size).toBe(coreQuestionsTarget);
  });

  it("avoids advanced overload when the learner is weak", () => {
    const stage = getNextAdaptiveStage(answersFor(routingQuestionsTarget, false), context);

    expect(stage.stage).toBe(2);
    expect(stage.items.every((item) => item.difficultyBand !== "advanced")).toBe(true);
  });

  it("includes advanced confirmation when the learner is strong", () => {
    const strongAnswers = answersFor(routingQuestionsTarget + coreQuestionsTarget, true);
    const stage = getNextAdaptiveStage(strongAnswers, context);

    expect(stage.completed).toBe(false);
    expect(stage.stage).toBe(3);
    expect(stage.items.length).toBe(defaultQuestionsTarget - strongAnswers.length);
    expect(stage.items.some((item) => item.difficultyBand === "advanced")).toBe(true);
  });

  it("marks the test completed at the 30-question target", () => {
    const stage = getNextAdaptiveStage(answersFor(defaultQuestionsTarget), context);

    expect(stage.completed).toBe(true);
    expect(stage.items).toHaveLength(0);
  });

  it("varies routing items for retakes when recent alternatives exist", () => {
    const first = getInitialRoutingItems(context);
    const retake = getInitialRoutingItems({
      sessionId: "adaptive-test-session-2",
      recentlySeenItemIds: first.map((item) => item.id),
      retakeCount: 1,
    });

    expect(retake.map((item) => item.id)).not.toEqual(first.map((item) => item.id));
  });
});
