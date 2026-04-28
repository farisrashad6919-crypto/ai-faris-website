import { buildPlacementItems } from "../factory";
import { getBlueprints } from "../blueprints";

export const c2VocabularyItems = buildPlacementItems({
  level: "C2",
  skill: "vocabulary",
  count: 65,
  blueprints: getBlueprints("C2", "vocabulary"),
});
