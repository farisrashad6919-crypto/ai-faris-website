import { tenseItems } from "./tense-items";
import type { PlacementItem, PlacementOption, PublicPlacementItem } from "../types";

export const placementItemBank: PlacementItem[] = tenseItems;

const itemById = new Map(placementItemBank.map((item) => [item.id, item]));

function hashString(value: string) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = Math.imul(31, hash) + value.charCodeAt(index);
  }
  return Math.abs(hash);
}

function shuffleOptions(options: PlacementOption[], seed: string) {
  return [...options].sort((a, b) => {
    const scoreA = hashString(`${seed}:${a.id}:${a.text}`);
    const scoreB = hashString(`${seed}:${b.id}:${b.text}`);
    return scoreA - scoreB;
  });
}

export function getPlacementItem(id: string) {
  return itemById.get(id);
}

export function toPublicPlacementItem(
  item: PlacementItem,
  seed = "",
): PublicPlacementItem {
  return {
    id: item.id,
    itemType: item.itemType,
    difficultyBand: item.difficultyBand,
    targetTense: item.targetTense,
    diagnosticArea: item.diagnosticArea,
    stem: item.stem,
    context: item.context,
    options: shuffleOptions(item.options, `${seed}:${item.id}`),
    estimatedTimeSeconds: item.estimatedTimeSeconds,
    version: item.version,
  };
}

export function toPublicPlacementItems(items: PlacementItem[], seed = "") {
  return items.map((item) => toPublicPlacementItem(item, seed));
}
