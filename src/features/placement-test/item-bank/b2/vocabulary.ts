import { buildPlacementItems } from "../factory";
import { getBlueprints } from "../blueprints";

export const b2VocabularyItems = buildPlacementItems({
  level: "B2",
  skill: "vocabulary",
  count: 105,
  blueprints: getBlueprints("B2", "vocabulary"),
});
