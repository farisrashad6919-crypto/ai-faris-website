import { buildPlacementItems } from "../factory";
import { getBlueprints } from "../blueprints";

export const a2GrammarItems = buildPlacementItems({
  level: "A2",
  skill: "grammar",
  count: 80,
  blueprints: getBlueprints("A2", "grammar"),
});
