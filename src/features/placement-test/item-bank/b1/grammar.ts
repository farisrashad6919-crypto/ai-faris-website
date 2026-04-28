import { buildPlacementItems } from "../factory";
import { getBlueprints } from "../blueprints";

export const b1GrammarItems = buildPlacementItems({
  level: "B1",
  skill: "grammar",
  count: 95,
  blueprints: getBlueprints("B1", "grammar"),
});
