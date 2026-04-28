import { buildPlacementItems } from "../factory";
import { getBlueprints } from "../blueprints";

export const b1VocabularyItems = buildPlacementItems({
  level: "B1",
  skill: "vocabulary",
  count: 95,
  blueprints: getBlueprints("B1", "vocabulary"),
});
