import { buildPlacementItems } from "../factory";
import { getBlueprints } from "../blueprints";

export const c1VocabularyItems = buildPlacementItems({
  level: "C1",
  skill: "vocabulary",
  count: 90,
  blueprints: getBlueprints("C1", "vocabulary"),
});
