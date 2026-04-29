import { placementItemBank } from "./item-bank";
import type {
  PlacementAnswer,
  PlacementItem,
  TenseDiagnosticArea,
  TenseDifficultyBand,
} from "./types";

export const minimumMeaningfulQuestions = 30;
export const defaultQuestionsTarget = 30;
export const maxQuestionsTarget = 30;
export const routingQuestionsTarget = 8;
export const coreQuestionsTarget = 12;
export const confirmationQuestionsTarget = 10;

type AdaptiveContext = {
  sessionId: string;
  recentlySeenItemIds?: string[];
  retakeCount?: number;
};

type AbilityBand = "weak" | "developing" | "strong";

const stageWeight: Record<number, number> = {
  1: 0.8,
  2: 1,
  3: 1.18,
};

const difficultyBandWeight: Record<TenseDifficultyBand, number> = {
  easy: 0.82,
  medium: 1,
  hard: 1.12,
  advanced: 1.24,
};

const routingAreaTargets: TenseDiagnosticArea[] = [
  "present-tense-control",
  "past-tense-control",
  "perfect-aspect-control",
  "future-tense-control",
  "tense-contrast-control",
  "narrative-sequencing",
  "stative-dynamic-control",
  "professional-academic-tense-use",
];

function hashString(value: string) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = Math.imul(31, hash) + value.charCodeAt(index);
  }
  return Math.abs(hash);
}

function seededScore(seed: string, item: PlacementItem) {
  return hashString(`${seed}:${item.id}:${item.targetTense}`) / 1000000000;
}

function uniqueAnswers(answers: PlacementAnswer[]) {
  return Array.from(
    answers
      .reduce((result, answer) => result.set(answer.itemId, answer), new Map<string, PlacementAnswer>())
      .values(),
  );
}

function answerIsCorrect(answer: PlacementAnswer, item: PlacementItem) {
  const selected = [...answer.selectedOptionIds].sort();
  return selected.length === 1 && selected[0] === item.correctAnswerId;
}

function answeredItems(answers: PlacementAnswer[]) {
  return uniqueAnswers(answers)
    .map((answer) => {
      const item = placementItemBank.find((candidate) => candidate.id === answer.itemId);
      if (!item) return null;
      return {
        answer,
        item,
        correct: answerIsCorrect(answer, item),
      };
    })
    .filter(Boolean) as Array<{
    answer: PlacementAnswer;
    item: PlacementItem;
    correct: boolean;
  }>;
}

function weightedAccuracy(answers: PlacementAnswer[]) {
  const entries = answeredItems(answers);
  const totals = entries.reduce(
    (result, entry) => {
      const weight =
        (stageWeight[entry.answer.stage] ?? 1) *
        difficultyBandWeight[entry.item.difficultyBand];
      return {
        possible: result.possible + weight,
        earned: result.earned + (entry.correct ? weight : 0),
      };
    },
    { earned: 0, possible: 0 },
  );

  return totals.possible ? totals.earned / totals.possible : 0.5;
}

function abilityBand(answers: PlacementAnswer[]): AbilityBand {
  const accuracy = weightedAccuracy(answers);
  if (accuracy < 0.48) return "weak";
  if (accuracy >= 0.74) return "strong";
  return "developing";
}

function weakAreas(answers: PlacementAnswer[]) {
  const counts = new Map<TenseDiagnosticArea, { wrong: number; total: number }>();

  for (const entry of answeredItems(answers)) {
    const current = counts.get(entry.item.diagnosticArea) ?? { wrong: 0, total: 0 };
    counts.set(entry.item.diagnosticArea, {
      wrong: current.wrong + (entry.correct ? 0 : 1),
      total: current.total + 1,
    });
  }

  return Array.from(counts.entries())
    .sort((a, b) => {
      const aRate = a[1].wrong / Math.max(1, a[1].total);
      const bRate = b[1].wrong / Math.max(1, b[1].total);
      return bRate - aRate || b[1].wrong - a[1].wrong;
    })
    .map(([area]) => area);
}

function candidateDifficultyScore(item: PlacementItem, band: AbilityBand) {
  const target: Record<AbilityBand, number> = {
    weak: 2.1,
    developing: 3.6,
    strong: 5.0,
  };

  return Math.abs(item.difficulty - target[band]);
}

function sortCandidates(
  items: PlacementItem[],
  {
    seed,
    recentlySeen,
    areaTargets,
    usedAreas,
    usedTenses,
    band,
  }: {
    seed: string;
    recentlySeen: Set<string>;
    areaTargets: TenseDiagnosticArea[];
    usedAreas: Map<TenseDiagnosticArea, number>;
    usedTenses: Map<string, number>;
    band: AbilityBand;
  },
) {
  return [...items].sort((a, b) => {
    const recentA = recentlySeen.has(a.id) && a.avoidIfSeenRecently ? 1 : 0;
    const recentB = recentlySeen.has(b.id) && b.avoidIfSeenRecently ? 1 : 0;
    if (recentA !== recentB) return recentA - recentB;

    const areaTargetA = areaTargets.includes(a.diagnosticArea) ? 0 : 0.3;
    const areaTargetB = areaTargets.includes(b.diagnosticArea) ? 0 : 0.3;
    if (areaTargetA !== areaTargetB) return areaTargetA - areaTargetB;

    const areaA = (usedAreas.get(a.diagnosticArea) ?? 0) * 0.5;
    const areaB = (usedAreas.get(b.diagnosticArea) ?? 0) * 0.5;
    if (areaA !== areaB) return areaA - areaB;

    const tenseA = (usedTenses.get(a.targetTense) ?? 0) * 0.42;
    const tenseB = (usedTenses.get(b.targetTense) ?? 0) * 0.42;
    if (tenseA !== tenseB) return tenseA - tenseB;

    const difficultyA = candidateDifficultyScore(a, band);
    const difficultyB = candidateDifficultyScore(b, band);
    if (difficultyA !== difficultyB) return difficultyA - difficultyB;

    return seededScore(seed, a) - seededScore(seed, b);
  });
}

function selectItems({
  count,
  seed,
  usedIds,
  usedStems,
  usedAreas,
  usedTenses,
  recentlySeen,
  candidates,
  band,
  areaTargets,
}: {
  count: number;
  seed: string;
  usedIds: Set<string>;
  usedStems: Set<string>;
  usedAreas: Map<TenseDiagnosticArea, number>;
  usedTenses: Map<string, number>;
  recentlySeen: Set<string>;
  candidates: PlacementItem[];
  band: AbilityBand;
  areaTargets: TenseDiagnosticArea[];
}) {
  const selected: PlacementItem[] = [];

  for (let index = 0; index < count; index += 1) {
    const match = sortCandidates(candidates, {
      seed: `${seed}:${index}`,
      recentlySeen,
      areaTargets,
      usedAreas,
      usedTenses,
      band,
    }).find((item) => {
      if (usedIds.has(item.id)) return false;
      if (usedStems.has(item.stem.trim().toLowerCase())) return false;
      return true;
    });

    if (!match) break;

    selected.push(match);
    usedIds.add(match.id);
    usedStems.add(match.stem.trim().toLowerCase());
    usedAreas.set(match.diagnosticArea, (usedAreas.get(match.diagnosticArea) ?? 0) + 1);
    usedTenses.set(match.targetTense, (usedTenses.get(match.targetTense) ?? 0) + 1);
  }

  return selected;
}

function selectionState(answers: PlacementAnswer[], context: AdaptiveContext) {
  const usedIds = new Set(answers.map((answer) => answer.itemId));
  const usedStems = new Set(
    answers
      .map((answer) => placementItemBank.find((item) => item.id === answer.itemId)?.stem)
      .filter(Boolean)
      .map((stem) => String(stem).trim().toLowerCase()),
  );
  return {
    usedIds,
    usedStems,
    usedAreas: new Map<TenseDiagnosticArea, number>(),
    usedTenses: new Map<string, number>(),
    recentlySeen: new Set(context.recentlySeenItemIds ?? []),
  };
}

function routingItems(context: AdaptiveContext) {
  const state = selectionState([], context);
  const selected: PlacementItem[] = [];

  for (const area of routingAreaTargets) {
    const preferred = placementItemBank.filter(
      (item) =>
        item.isRoutingItem &&
        item.diagnosticArea === area &&
        item.difficultyBand !== "advanced",
    );
    const fallback = placementItemBank.filter(
      (item) => item.diagnosticArea === area && item.difficultyBand !== "advanced",
    );
    selected.push(
      ...selectItems({
        count: 1,
        seed: `${context.sessionId}:routing:${area}:${context.retakeCount ?? 0}`,
        candidates: preferred.length ? preferred : fallback,
        band: "developing",
        areaTargets: [area],
        ...state,
      }),
    );
  }

  if (selected.length < routingQuestionsTarget) {
    selected.push(
      ...selectItems({
        count: routingQuestionsTarget - selected.length,
        seed: `${context.sessionId}:routing:fallback:${context.retakeCount ?? 0}`,
        candidates: placementItemBank.filter((item) => item.difficultyBand !== "advanced"),
        band: "developing",
        areaTargets: routingAreaTargets,
        ...state,
      }),
    );
  }

  return selected.slice(0, routingQuestionsTarget);
}

function coreItems({
  answers,
  context,
  band,
}: {
  answers: PlacementAnswer[];
  context: AdaptiveContext;
  band: AbilityBand;
}) {
  const state = selectionState(answers, context);
  const areas = weakAreas(answers);
  const areaTargets = areas.length ? areas : routingAreaTargets;
  const allowedBands: TenseDifficultyBand[] =
    band === "weak"
      ? ["easy", "medium", "hard"]
      : band === "strong"
        ? ["medium", "hard", "advanced"]
        : ["medium", "hard"];
  const candidates = placementItemBank.filter(
    (item) =>
      !item.isRoutingItem &&
      allowedBands.includes(item.difficultyBand) &&
      (band === "strong" || item.difficultyBand !== "advanced"),
  );

  return selectItems({
    count: coreQuestionsTarget,
    seed: `${context.sessionId}:core:${band}:${context.retakeCount ?? 0}`,
    candidates,
    band,
    areaTargets,
    ...state,
  });
}

function confirmationItems({
  answers,
  context,
  band,
  count,
}: {
  answers: PlacementAnswer[];
  context: AdaptiveContext;
  band: AbilityBand;
  count: number;
}) {
  const state = selectionState(answers, context);
  const areas = weakAreas(answers);
  const strongAreaTargets: TenseDiagnosticArea[] = [
    "advanced-tense-precision",
    "professional-academic-tense-use",
    ...areas,
    ...routingAreaTargets,
  ];
  const areaTargets: TenseDiagnosticArea[] =
    band === "strong"
      ? strongAreaTargets
      : areas.length
        ? areas.slice(0, 4)
        : routingAreaTargets;
  const candidates = placementItemBank.filter((item) => {
    if (!item.isConfirmationItem && !item.isAnchorItem) return false;
    if (band === "weak") return item.difficultyBand !== "advanced";
    if (band === "strong") return item.difficultyBand === "hard" || item.difficultyBand === "advanced";
    return item.difficultyBand === "medium" || item.difficultyBand === "hard" || item.difficultyBand === "advanced";
  });

  return selectItems({
    count,
    seed: `${context.sessionId}:confirmation:${band}:${context.retakeCount ?? 0}`,
    candidates,
    band,
    areaTargets,
    ...state,
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
  const answeredCount = unique.length;
  const band = abilityBand(unique);
  const totalQuestionsTarget = defaultQuestionsTarget;

  if (answeredCount < routingQuestionsTarget) {
    return {
      completed: false,
      stage: 1,
      items: getInitialRoutingItems(context),
      abilityBand: band,
      totalQuestionsTarget,
    };
  }

  if (answeredCount < routingQuestionsTarget + coreQuestionsTarget) {
    return {
      completed: false,
      stage: 2,
      items: coreItems({ answers: unique, context, band }),
      abilityBand: band,
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
        band,
        count: totalQuestionsTarget - answeredCount,
      }),
      abilityBand: band,
      totalQuestionsTarget,
    };
  }

  return {
    completed: true,
    stage: 4,
    items: [],
    abilityBand: band,
    totalQuestionsTarget,
  };
}
