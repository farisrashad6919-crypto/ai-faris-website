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
  return Array.isArray(item.correctAnswerId)
    ? item.correctAnswerId
    : [item.correctAnswerId];
}

function answersFor(count: number): PlacementAnswer[] {
  return placementItemBank.slice(0, count).map((item, index) => ({
    itemId: item.id,
    selectedOptionIds: correctIds(item),
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

describe("placement adaptive routing", () => {
  it("starts with eight routing items across A2-C1 and both tested skills", () => {
    const items = getInitialRoutingItems(context);

    expect(items).toHaveLength(8);
    expect(new Set(items.map((item) => item.skill))).toEqual(
      new Set(["vocabulary", "grammar"]),
    );
    expect(new Set(items.map((item) => item.cefrLevel))).toEqual(
      new Set(["A2", "B1", "B2", "C1"]),
    );
  });

  it("returns a level-targeted core stage after routing answers", () => {
    const stage = getNextAdaptiveStage(answersFor(routingQuestionsTarget), context);

    expect(stage.completed).toBe(false);
    expect(stage.stage).toBe(2);
    expect(stage.items).toHaveLength(coreQuestionsTarget);
    expect(new Set(stage.items.map((item) => item.id)).size).toBe(coreQuestionsTarget);
  });

  it("returns confirmation items before completion", () => {
    const stage = getNextAdaptiveStage(
      answersFor(routingQuestionsTarget + coreQuestionsTarget),
      context,
    );

    expect(stage.completed).toBe(false);
    expect(stage.stage).toBe(3);
    expect(stage.items.length).toBeGreaterThanOrEqual(4);
    expect(stage.items.length).toBeLessThanOrEqual(8);
  });

  it("marks the test completed at the target question count", () => {
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
