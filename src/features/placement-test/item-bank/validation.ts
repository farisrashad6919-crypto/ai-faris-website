import {
  tenseDiagnosticAreas,
  tenseDifficultyBands,
  type PlacementItem,
  type TenseDiagnosticArea,
  type TenseDifficultyBand,
} from "../types";

export const requiredTenseItemCount = 96;

const bannedOptionPattern = /\b(all|none)\s+of\s+the\s+above\b/i;
const genericTeachingPattern =
  /^(teach grammar|review grammar|needs practice|teach tenses)\.?$/i;

export type ItemBankValidationResult = {
  valid: boolean;
  errors: string[];
  distribution: {
    difficulty: Record<TenseDifficultyBand, number>;
    diagnosticArea: Record<TenseDiagnosticArea, number>;
  };
};

function emptyDifficultyDistribution() {
  return Object.fromEntries(
    tenseDifficultyBands.map((band) => [band, 0]),
  ) as Record<TenseDifficultyBand, number>;
}

function emptyAreaDistribution() {
  return Object.fromEntries(
    tenseDiagnosticAreas.map((area) => [area, 0]),
  ) as Record<TenseDiagnosticArea, number>;
}

function optionTextBalanceIsTooHigh(item: PlacementItem) {
  const lengths = item.options.map((option) => option.text.trim().length);
  const shortest = Math.min(...lengths);
  const longest = Math.max(...lengths);
  return shortest >= 4 && longest / shortest > 5;
}

export function validatePlacementItemBank(
  items: PlacementItem[],
): ItemBankValidationResult {
  const errors: string[] = [];
  const ids = new Set<string>();
  const stems = new Set<string>();
  const difficulty = emptyDifficultyDistribution();
  const diagnosticArea = emptyAreaDistribution();

  if (items.length !== requiredTenseItemCount) {
    errors.push(
      `Expected exactly ${requiredTenseItemCount} tense diagnostic items, found ${items.length}.`,
    );
  }

  for (const item of items) {
    if (ids.has(item.id)) errors.push(`Duplicate item id: ${item.id}.`);
    ids.add(item.id);

    const normalizedStem = item.stem.trim().toLowerCase();
    if (stems.has(normalizedStem)) errors.push(`Duplicate stem: ${item.stem}.`);
    stems.add(normalizedStem);

    if (!tenseDifficultyBands.includes(item.difficultyBand)) {
      errors.push(`${item.id}: invalid difficulty band.`);
    } else {
      difficulty[item.difficultyBand] += 1;
    }

    if (item.difficulty < 1 || item.difficulty > 6) {
      errors.push(`${item.id}: difficulty must be between 1 and 6.`);
    }

    if (!tenseDiagnosticAreas.includes(item.diagnosticArea)) {
      errors.push(`${item.id}: invalid diagnostic area.`);
    } else {
      diagnosticArea[item.diagnosticArea] += 1;
    }

    if (!item.targetTense.trim()) errors.push(`${item.id}: missing target tense.`);
    if (!item.context.trim()) errors.push(`${item.id}: missing item context.`);
    if (!item.stem.trim()) errors.push(`${item.id}: empty prompt.`);

    if (item.options.length !== 4) {
      errors.push(`${item.id}: single-select tense items must have exactly 4 options.`);
    }

    const optionIds = new Set(item.options.map((option) => option.id));
    const optionTexts = item.options.map((option) => option.text.trim().toLowerCase());

    if (optionTexts.length !== new Set(optionTexts).size) {
      errors.push(`${item.id}: duplicate option text.`);
    }

    if (optionTextBalanceIsTooHigh(item)) {
      errors.push(`${item.id}: option length imbalance is too high.`);
    }

    for (const option of item.options) {
      if (!option.text.trim()) errors.push(`${item.id}: empty option.`);
      if (bannedOptionPattern.test(option.text)) {
        errors.push(`${item.id}: banned option phrase.`);
      }
    }

    if (!optionIds.has(item.correctAnswerId)) {
      errors.push(`${item.id}: correctAnswerId ${item.correctAnswerId} missing from options.`);
    }

    if (!item.explanation.trim()) errors.push(`${item.id}: empty explanation.`);
    if (!item.feedbackIfWrong.trim()) errors.push(`${item.id}: empty feedbackIfWrong.`);
    if (!item.teachingImplication.trim()) {
      errors.push(`${item.id}: empty teachingImplication.`);
    }
    if (genericTeachingPattern.test(item.teachingImplication.trim())) {
      errors.push(`${item.id}: teachingImplication is too generic.`);
    }
    if (item.recommendationTags.length < 2) {
      errors.push(`${item.id}: recommendation tags are too thin.`);
    }
    if (item.relatedTrackTags.length === 0) {
      errors.push(`${item.id}: missing related track tags.`);
    }
    if (item.estimatedTimeSeconds < 15 || item.estimatedTimeSeconds > 75) {
      errors.push(`${item.id}: invalid estimated time.`);
    }
  }

  for (const band of tenseDifficultyBands) {
    if (difficulty[band] === 0) {
      errors.push(`${band}: no tense diagnostic items.`);
    }
  }

  for (const area of tenseDiagnosticAreas) {
    if (diagnosticArea[area] < 5) {
      errors.push(`${area}: not enough diagnostic coverage.`);
    }
  }

  if (items.filter((item) => item.isRoutingItem).length < 8) {
    errors.push("Not enough routing items.");
  }
  if (items.filter((item) => item.isConfirmationItem).length < 24) {
    errors.push("Not enough confirmation items.");
  }
  if (items.filter((item) => item.isAnchorItem).length < 6) {
    errors.push("Not enough anchor items.");
  }

  return {
    valid: errors.length === 0,
    errors,
    distribution: {
      difficulty,
      diagnosticArea,
    },
  };
}
