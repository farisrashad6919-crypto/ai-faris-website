import { placementItemBank } from "./item-bank";
import { adjacentLevels, levelFromValue, valueForLevel } from "./levels";
import type {
  CefrLevel,
  PlacementAnswer,
  PlacementItem,
  PlacementSkill,
} from "./types";

export const minimumMeaningfulQuestions = 20;
export const defaultQuestionsTarget = 28;
export const maxQuestionsTarget = 30;
export const routingQuestionsTarget = 8;
export const coreQuestionsTarget = 14;

const skills: PlacementSkill[] = ["grammar", "vocabulary"];
const routingLevels: CefrLevel[] = ["A2", "B1", "B2", "C1"];
const stageWeight: Record<number, number> = {
  1: 0.8,
  2: 1,
  3: 1.2,
};
const discriminationWeight = {
  low: 0.85,
  medium: 1,
  high: 1.18,
};

type AdaptiveContext = {
  sessionId: string;
  recentlySeenItemIds?: string[];
  retakeCount?: number;
};

function hashString(value: string) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = Math.imul(31, hash) + value.charCodeAt(index);
  }
  return Math.abs(hash);
}

function seededScore(seed: string, item: PlacementItem) {
  return hashString(`${seed}:${item.id}:${item.construct}`) / 1000000000;
}

function uniqueAnswers(answers: PlacementAnswer[]) {
  return Array.from(
    answers
      .reduce((result, answer) => result.set(answer.itemId, answer), new Map<string, PlacementAnswer>())
      .values(),
  );
}

function answerIsCorrect(answer: PlacementAnswer, item: PlacementItem) {
  const expected = Array.isArray(item.correctAnswerId)
    ? item.correctAnswerId
    : [item.correctAnswerId];
  const selected = [...answer.selectedOptionIds].sort();

  return (
    expected.length === selected.length &&
    [...expected].sort().every((id, index) => id === selected[index])
  );
}

function scoreAnswersForRouting(answers: PlacementAnswer[]) {
  const evidence = uniqueAnswers(answers).reduce(
    (result, answer) => {
      const item = placementItemBank.find((candidate) => candidate.id === answer.itemId);
      if (!item) return result;

      const correct = answerIsCorrect(answer, item);
      const weight =
        discriminationWeight[item.discrimination] * (stageWeight[answer.stage] ?? 1);
      const correction = correct ? 0.42 : -0.78;

      return {
        total: result.total + (item.difficulty + correction) * weight,
        weight: result.weight + weight,
      };
    },
    { total: 0, weight: 0 },
  );

  if (evidence.weight === 0) return "B1" satisfies CefrLevel;

  return levelFromValue(evidence.total / evidence.weight);
}

function targetQuestionCount(answers: PlacementAnswer[]) {
  if (answers.length < routingQuestionsTarget + coreQuestionsTarget) {
    return defaultQuestionsTarget;
  }

  const durationSeconds = Math.max(...answers.map((answer) => answer.elapsedSeconds));
  const averageSeconds = durationSeconds / Math.max(1, answers.length);

  if (averageSeconds > 45) return 26;
  if (averageSeconds < 18) return maxQuestionsTarget;

  return defaultQuestionsTarget;
}

function sortCandidates(
  items: PlacementItem[],
  {
    seed,
    recentlySeen,
    targetLevel,
    preferredSkill,
    usedConstructs,
  }: {
    seed: string;
    recentlySeen: Set<string>;
    targetLevel: CefrLevel;
    preferredSkill?: PlacementSkill;
    usedConstructs: Map<string, number>;
  },
) {
  const targetValue = valueForLevel(targetLevel);

  return [...items].sort((a, b) => {
    const recentA = recentlySeen.has(a.id) && a.avoidIfSeenRecently ? 1 : 0;
    const recentB = recentlySeen.has(b.id) && b.avoidIfSeenRecently ? 1 : 0;
    if (recentA !== recentB) return recentA - recentB;

    const skillA = preferredSkill && a.skill !== preferredSkill ? 0.45 : 0;
    const skillB = preferredSkill && b.skill !== preferredSkill ? 0.45 : 0;
    if (skillA !== skillB) return skillA - skillB;

    const constructA = (usedConstructs.get(a.construct) ?? 0) * 0.55;
    const constructB = (usedConstructs.get(b.construct) ?? 0) * 0.55;
    if (constructA !== constructB) return constructA - constructB;

    const distanceA = Math.abs(a.difficulty - targetValue);
    const distanceB = Math.abs(b.difficulty - targetValue);
    if (distanceA !== distanceB) return distanceA - distanceB;

    return seededScore(seed, a) - seededScore(seed, b);
  });
}

function selectItems({
  count,
  seed,
  usedIds,
  usedStems,
  usedConstructs,
  recentlySeen,
  candidates,
  targetLevel,
  skillPattern,
}: {
  count: number;
  seed: string;
  usedIds: Set<string>;
  usedStems: Set<string>;
  usedConstructs: Map<string, number>;
  recentlySeen: Set<string>;
  candidates: PlacementItem[];
  targetLevel: CefrLevel;
  skillPattern: PlacementSkill[];
}) {
  const selected: PlacementItem[] = [];

  for (let index = 0; index < count; index += 1) {
    const preferredSkill = skillPattern[index % skillPattern.length];
    const match = sortCandidates(candidates, {
      seed: `${seed}:${index}`,
      recentlySeen,
      targetLevel,
      preferredSkill,
      usedConstructs,
    }).find(
      (item) =>
        !usedIds.has(item.id) &&
        !usedStems.has(item.stem.trim().toLowerCase()),
    );

    if (!match) break;

    selected.push(match);
    usedIds.add(match.id);
    usedStems.add(match.stem.trim().toLowerCase());
    usedConstructs.set(match.construct, (usedConstructs.get(match.construct) ?? 0) + 1);
  }

  return selected;
}

function routingItems(context: AdaptiveContext) {
  const usedIds = new Set<string>();
  const usedStems = new Set<string>();
  const usedConstructs = new Map<string, number>();
  const recentlySeen = new Set(context.recentlySeenItemIds ?? []);
  const selected: PlacementItem[] = [];

  for (const level of routingLevels) {
    for (const skill of skills) {
      const candidates = placementItemBank.filter(
        (item) =>
          item.cefrLevel === level &&
          item.skill === skill &&
          item.isRoutingItem,
      );
      selected.push(
        ...selectItems({
          count: 1,
          seed: `${context.sessionId}:routing:${level}:${skill}:${context.retakeCount ?? 0}`,
          usedIds,
          usedStems,
          usedConstructs,
          recentlySeen,
          candidates,
          targetLevel: level,
          skillPattern: [skill],
        }),
      );
    }
  }

  return selected;
}

function coreItems({
  answers,
  context,
  targetLevel,
}: {
  answers: PlacementAnswer[];
  context: AdaptiveContext;
  targetLevel: CefrLevel;
}) {
  const usedIds = new Set(answers.map((answer) => answer.itemId));
  const usedStems = new Set(
    answers
      .map((answer) => placementItemBank.find((item) => item.id === answer.itemId)?.stem)
      .filter(Boolean)
      .map((stem) => String(stem).trim().toLowerCase()),
  );
  const usedConstructs = new Map<string, number>();
  const recentlySeen = new Set(context.recentlySeenItemIds ?? []);
  const levels = adjacentLevels(targetLevel);
  const candidates = placementItemBank.filter(
    (item) =>
      levels.includes(item.cefrLevel) &&
      !item.isRoutingItem &&
      !item.isConfirmationItem,
  );

  return selectItems({
    count: coreQuestionsTarget,
    seed: `${context.sessionId}:core:${targetLevel}:${context.retakeCount ?? 0}`,
    usedIds,
    usedStems,
    usedConstructs,
    recentlySeen,
    candidates,
    targetLevel,
    skillPattern: ["grammar", "vocabulary"],
  });
}

function confirmationItems({
  answers,
  context,
  targetLevel,
  count,
}: {
  answers: PlacementAnswer[];
  context: AdaptiveContext;
  targetLevel: CefrLevel;
  count: number;
}) {
  const usedIds = new Set(answers.map((answer) => answer.itemId));
  const usedStems = new Set(
    answers
      .map((answer) => placementItemBank.find((item) => item.id === answer.itemId)?.stem)
      .filter(Boolean)
      .map((stem) => String(stem).trim().toLowerCase()),
  );
  const usedConstructs = new Map<string, number>();
  const recentlySeen = new Set(context.recentlySeenItemIds ?? []);
  const levels = adjacentLevels(targetLevel);
  const candidates = placementItemBank.filter(
    (item) =>
      levels.includes(item.cefrLevel) &&
      (item.isConfirmationItem || item.isAnchorItem),
  );

  return selectItems({
    count,
    seed: `${context.sessionId}:confirmation:${targetLevel}:${context.retakeCount ?? 0}`,
    usedIds,
    usedStems,
    usedConstructs,
    recentlySeen,
    candidates,
    targetLevel,
    skillPattern: ["vocabulary", "grammar"],
  });
}

export function getInitialRoutingItems(context: AdaptiveContext) {
  return routingItems(context);
}

export function getNextAdaptiveStage(
  answers: PlacementAnswer[],
  context: AdaptiveContext,
) {
  const unique = uniqueAnswers(answers);
  const targetLevel = scoreAnswersForRouting(unique);
  const answeredCount = unique.length;
  const totalQuestionsTarget = targetQuestionCount(unique);

  if (answeredCount < routingQuestionsTarget) {
    return {
      completed: false,
      stage: 1,
      items: getInitialRoutingItems(context),
      targetLevel,
      totalQuestionsTarget,
    };
  }

  if (answeredCount < routingQuestionsTarget + coreQuestionsTarget) {
    return {
      completed: false,
      stage: 2,
      items: coreItems({ answers: unique, context, targetLevel }),
      targetLevel,
      totalQuestionsTarget,
    };
  }

  if (answeredCount < totalQuestionsTarget) {
    return {
      completed: false,
      stage: 3,
      items: confirmationItems({
        answers: unique,
        context,
        targetLevel,
        count: totalQuestionsTarget - answeredCount,
      }),
      targetLevel,
      totalQuestionsTarget,
    };
  }

  return {
    completed: true,
    stage: 4,
    items: [],
    targetLevel,
    totalQuestionsTarget,
  };
}
