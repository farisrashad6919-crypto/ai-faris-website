import { buildPlacementItems } from "../factory";
import { getBlueprints } from "../blueprints";

export const c1GrammarItems = buildPlacementItems({
  level: "C1",
  skill: "grammar",
  count: 90,
  blueprints: getBlueprints("C1", "grammar"),
});
