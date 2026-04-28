import { buildPlacementItems } from "../factory";
import { getBlueprints } from "../blueprints";

export const b2GrammarItems = buildPlacementItems({
  level: "B2",
  skill: "grammar",
  count: 105,
  blueprints: getBlueprints("B2", "grammar"),
});
