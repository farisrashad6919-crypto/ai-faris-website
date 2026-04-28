import type {
  CefrLevel,
  PlacementDiscrimination,
  PlacementItem,
  PlacementItemType,
  PlacementSkill,
} from "../types";

type TargetLanguage = {
  context: string;
  stem: string;
  correct: string;
  distractors: [string, string, string];
  explanation?: string;
  feedbackIfWrong?: string;
  teachingImplication?: string;
  recommendationTags?: string[];
  itemType?: PlacementItemType;
};

export type ItemBlueprint = {
  construct: string;
  subskill: string;
  microSkill: string;
  itemType: PlacementItemType;
  targets: TargetLanguage[];
  explanation: string;
  feedbackIfWrong: string;
  teachingImplication: string;
  recommendationTags: string[];
  relatedTrackTags: PlacementItem["relatedTrackTags"];
};

type BuildItemsInput = {
  level: CefrLevel;
  skill: PlacementSkill;
  count: number;
  blueprints: ItemBlueprint[];
};

const levelDifficulty: Record<CefrLevel, number> = {
  A1: 1,
  A2: 2,
  B1: 3,
  B2: 4,
  C1: 5,
  C2: 6,
};

const levelTime: Record<CefrLevel, number> = {
  A1: 28,
  A2: 32,
  B1: 38,
  B2: 44,
  C1: 50,
  C2: 55,
};

const optionIds = ["a", "b", "c", "d"] as const;

function hashString(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash);
}

function shuffleOptionTexts(
  values: [string, string, string, string],
  seed: string,
) {
  const result = [...values];
  let hash = hashString(seed);

  for (let index = result.length - 1; index > 0; index -= 1) {
    hash = Math.imul(hash ^ index, 1103515245) + 12345;
    const swapIndex = Math.abs(hash) % (index + 1);
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }

  return result;
}

function discriminationFor(index: number): PlacementDiscrimination {
  if (index % 5 === 0) return "high";
  if (index % 7 === 0) return "low";
  return "medium";
}

function idPart(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 32);
}

function flattenTargets(blueprints: ItemBlueprint[]) {
  const maxTargetCount = Math.max(
    ...blueprints.map((blueprint) => blueprint.targets.length),
  );
  const targets: Array<{
    blueprint: ItemBlueprint;
    target: ItemBlueprint["targets"][number];
  }> = [];

  for (let index = 0; index < maxTargetCount; index += 1) {
    for (const blueprint of blueprints) {
      const target = blueprint.targets[index];
      if (target) targets.push({ blueprint, target });
    }
  }

  return targets;
}

export function buildPlacementItems({
  level,
  skill,
  count,
  blueprints,
}: BuildItemsInput): PlacementItem[] {
  const candidates = flattenTargets(blueprints);
  const baseDifficulty = levelDifficulty[level];

  if (candidates.length < count) {
    throw new Error(
      `${level} ${skill} item bank needs ${count} targets, found ${candidates.length}.`,
    );
  }

  return candidates.slice(0, count).map(({ blueprint, target }, index) => {
    const id = `${skill[0]}-${level.toLowerCase()}-${String(index + 1).padStart(
      3,
      "0",
    )}-${idPart(blueprint.construct)}`;
    const optionTexts = shuffleOptionTexts(
      [target.correct, ...target.distractors],
      id,
    );
    const options = optionTexts.map((text, optionIndex) => ({
      id: optionIds[optionIndex],
      text,
    }));
    const correctAnswerId =
      options.find((option) => option.text === target.correct)?.id ?? "a";
    const difficultyOffset = ((index % 13) - 6) * 0.028;

    return {
      id,
      cefrLevel: level,
      skill,
      subskill: blueprint.subskill,
      construct: blueprint.construct,
      microSkill: blueprint.microSkill,
      difficulty: Number(
        Math.max(1, Math.min(6, baseDifficulty + difficultyOffset)).toFixed(2),
      ),
      discrimination: discriminationFor(index),
      itemType: target.itemType ?? blueprint.itemType,
      stem: target.stem,
      context: target.context,
      options,
      correctAnswerId,
      explanation: target.explanation ?? blueprint.explanation,
      feedbackIfWrong: target.feedbackIfWrong ?? blueprint.feedbackIfWrong,
      teachingImplication:
        target.teachingImplication ?? blueprint.teachingImplication,
      recommendationTags:
        target.recommendationTags ?? blueprint.recommendationTags,
      relatedTrackTags: blueprint.relatedTrackTags,
      estimatedTimeSeconds: levelTime[level],
      isAnchorItem: index % 17 === 0,
      isRoutingItem: index % 11 === 0,
      isConfirmationItem: index % 7 === 0,
      avoidIfSeenRecently: index % 3 !== 0,
      version: 2,
    };
  });
}
