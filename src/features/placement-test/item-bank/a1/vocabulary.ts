import { buildPlacementItems } from "../factory";
import { getBlueprints } from "../blueprints";

export const a1VocabularyItems = buildPlacementItems({
  level: "A1",
  skill: "vocabulary",
  count: 65,
  blueprints: getBlueprints("A1", "vocabulary"),
});
