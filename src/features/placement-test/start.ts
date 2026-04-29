import { randomUUID } from "node:crypto";

import { getNextAdaptiveStage } from "./adaptive";
import { toPublicPlacementItems } from "./item-bank";
import type { PlacementStageResponse, PlacementStartInput } from "./types";

type PlacementStartContext = Pick<
  PlacementStartInput,
  "recentlySeenItemIds" | "retakeCount"
>;

export function createPlacementStartResponse({
  recentlySeenItemIds,
  retakeCount,
}: PlacementStartContext = {}): PlacementStageResponse {
  const sessionId = randomUUID();
  const stage = getNextAdaptiveStage([], {
    sessionId,
    recentlySeenItemIds,
    retakeCount,
  });

  return {
    sessionId,
    stage: stage.stage,
    items: toPublicPlacementItems(stage.items, `${sessionId}:${stage.stage}`),
    totalQuestionsTarget: stage.totalQuestionsTarget,
    completed: false,
  };
}
