import { buildPlacementItems } from "../factory";
import { getBlueprints } from "../blueprints";

export const c2GrammarItems = buildPlacementItems({
  level: "C2",
  skill: "grammar",
  count: 65,
  blueprints: getBlueprints("C2", "grammar"),
});
