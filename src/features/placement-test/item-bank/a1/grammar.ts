import { buildPlacementItems } from "../factory";
import { getBlueprints } from "../blueprints";

export const a1GrammarItems = buildPlacementItems({
  level: "A1",
  skill: "grammar",
  count: 65,
  blueprints: getBlueprints("A1", "grammar"),
});
