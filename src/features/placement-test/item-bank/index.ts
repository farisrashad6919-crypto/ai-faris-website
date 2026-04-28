import { a1GrammarItems } from "./a1/grammar";
import { a1VocabularyItems } from "./a1/vocabulary";
import { a2GrammarItems } from "./a2/grammar";
import { a2VocabularyItems } from "./a2/vocabulary";
import { b1GrammarItems } from "./b1/grammar";
import { b1VocabularyItems } from "./b1/vocabulary";
import { b2GrammarItems } from "./b2/grammar";
import { b2VocabularyItems } from "./b2/vocabulary";
import { c1GrammarItems } from "./c1/grammar";
import { c1VocabularyItems } from "./c1/vocabulary";
import { c2GrammarItems } from "./c2/grammar";
import { c2VocabularyItems } from "./c2/vocabulary";
import type { PlacementItem, PublicPlacementItem } from "../types";

export const placementItemBank: PlacementItem[] = [
  ...a1VocabularyItems,
  ...a1GrammarItems,
  ...a2VocabularyItems,
  ...a2GrammarItems,
  ...b1VocabularyItems,
  ...b1GrammarItems,
  ...b2VocabularyItems,
  ...b2GrammarItems,
  ...c1VocabularyItems,
  ...c1GrammarItems,
  ...c2VocabularyItems,
  ...c2GrammarItems,
];

const itemById = new Map(placementItemBank.map((item) => [item.id, item]));

export function getPlacementItem(id: string) {
  return itemById.get(id);
}

export function toPublicPlacementItem(item: PlacementItem): PublicPlacementItem {
  const publicItem: Partial<PlacementItem> = { ...item };

  delete publicItem.correctAnswerId;
  delete publicItem.difficulty;
  delete publicItem.discrimination;
  delete publicItem.explanation;
  delete publicItem.feedbackIfWrong;
  delete publicItem.teachingImplication;
  delete publicItem.recommendationTags;
  delete publicItem.relatedTrackTags;
  delete publicItem.isAnchorItem;
  delete publicItem.isRoutingItem;
  delete publicItem.isConfirmationItem;
  delete publicItem.avoidIfSeenRecently;

  return publicItem as PublicPlacementItem;
}

export function toPublicPlacementItems(items: PlacementItem[]) {
  return items.map(toPublicPlacementItem);
}
