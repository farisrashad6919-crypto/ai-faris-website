import { buildPlacementItems } from "../factory";
import { getBlueprints } from "../blueprints";

export const a2VocabularyItems = buildPlacementItems({
  level: "A2",
  skill: "vocabulary",
  count: 80,
  blueprints: getBlueprints("A2", "vocabulary"),
});
