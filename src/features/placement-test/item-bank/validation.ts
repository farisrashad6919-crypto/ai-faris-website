import { cefrLevels, type CefrLevel, type PlacementItem, type PlacementSkill } from "../types";

export const requiredDistribution: Record<
  CefrLevel,
  Record<PlacementSkill, number>
> = {
  A1: { vocabulary: 65, grammar: 65 },
  A2: { vocabulary: 80, grammar: 80 },
  B1: { vocabulary: 95, grammar: 95 },
  B2: { vocabulary: 105, grammar: 105 },
  C1: { vocabulary: 90, grammar: 90 },
  C2: { vocabulary: 65, grammar: 65 },
};

const skills: PlacementSkill[] = ["vocabulary", "grammar"];
const bannedOptionPattern = /\b(all|none)\s+of\s+the\s+above\b/i;
const oldCueStemPattern =
  /\b(present simple|past simple|present perfect|uncount nouns|relative clauses?|passive basics?|modals? of deduction|first conditional|second conditional|collocation used|strongest collocation|choose the corrected version used)\b/i;
const malformedOptionPattern =
  /\b(powerness|controlness|fanciness|style-touching|anti-working|realistical|ableful|workingable|choiceful|surpriseful|sameful|avoidless|correctioning|rubbishing|smallish|weakly conclusion|trying conclusion|particularized|substanceful)\b/i;
const genericTeachingPattern =
  /^(teach grammar|teach vocabulary|review grammar|review vocabulary|needs practice)\.?$/i;

export type ItemBankValidationResult = {
  valid: boolean;
  errors: string[];
  distribution: Record<CefrLevel, Record<PlacementSkill, number>>;
};

function emptyDistribution() {
  return Object.fromEntries(
    cefrLevels.map((level) => [
      level,
      Object.fromEntries(skills.map((skill) => [skill, 0])),
    ]),
  ) as Record<CefrLevel, Record<PlacementSkill, number>>;
}

function correctIds(item: PlacementItem) {
  return Array.isArray(item.correctAnswerId)
    ? item.correctAnswerId
    : [item.correctAnswerId];
}

export function validatePlacementItemBank(
  items: PlacementItem[],
): ItemBankValidationResult {
  const errors: string[] = [];
  const distribution = emptyDistribution();
  const ids = new Set<string>();
  const stems = new Set<string>();
  const correctPositionCounts = { a: 0, b: 0, c: 0, d: 0 };

  if (items.length !== 1000) {
    errors.push(`Expected exactly 1000 items, found ${items.length}.`);
  }

  for (const item of items) {
    if (ids.has(item.id)) errors.push(`Duplicate item id: ${item.id}.`);
    ids.add(item.id);

    const normalizedStem = item.stem.trim().toLowerCase();
    if (stems.has(normalizedStem)) errors.push(`Duplicate stem: ${item.stem}.`);
    stems.add(normalizedStem);

    if (!cefrLevels.includes(item.cefrLevel)) {
      errors.push(`${item.id}: invalid CEFR level.`);
    }
    if (!skills.includes(item.skill)) {
      errors.push(`${item.id}: invalid skill.`);
    } else {
      distribution[item.cefrLevel][item.skill] += 1;
    }
    if (!item.subskill.trim()) errors.push(`${item.id}: missing subskill.`);
    if (!item.construct.trim()) errors.push(`${item.id}: missing construct.`);
    if (!item.microSkill.trim()) errors.push(`${item.id}: missing microSkill.`);
    if (item.difficulty < 1 || item.difficulty > 6) {
      errors.push(`${item.id}: difficulty must be between 1 and 6.`);
    }
    if (!["low", "medium", "high"].includes(item.discrimination)) {
      errors.push(`${item.id}: invalid discrimination.`);
    }
    if (!item.stem.trim()) errors.push(`${item.id}: empty stem.`);
    if (oldCueStemPattern.test(item.stem)) {
      errors.push(`${item.id}: stem exposes a grammar/vocabulary cue.`);
    }
    if (!item.context.trim()) errors.push(`${item.id}: empty context.`);
    if (item.options.length !== 4) {
      errors.push(`${item.id}: single-select items must have exactly 4 options.`);
    }
    const optionIds = new Set(item.options.map((option) => option.id));
    const optionTexts = item.options.map((option) => option.text.trim().toLowerCase());
    if (optionTexts.length !== new Set(optionTexts).size) {
      errors.push(`${item.id}: duplicate option text.`);
    }
    for (const option of item.options) {
      if (!option.text.trim()) errors.push(`${item.id}: empty option.`);
      if (bannedOptionPattern.test(option.text)) {
        errors.push(`${item.id}: banned option phrase.`);
      }
      if (malformedOptionPattern.test(option.text)) {
        errors.push(`${item.id}: malformed or implausible option.`);
      }
    }
    const optionLengths = item.options.map((option) => option.text.trim().length);
    const shortestOption = Math.min(...optionLengths);
    const longestOption = Math.max(...optionLengths);
    if (
      shortestOption >= 4 &&
      longestOption / shortestOption > 4.2
    ) {
      errors.push(`${item.id}: option length imbalance is too high.`);
    }
    for (const id of correctIds(item)) {
      if (!optionIds.has(id)) {
        errors.push(`${item.id}: correctAnswerId ${id} missing from options.`);
      } else if (id in correctPositionCounts) {
        correctPositionCounts[id as keyof typeof correctPositionCounts] += 1;
      }
    }
    if (!item.explanation.trim()) errors.push(`${item.id}: empty explanation.`);
    if (!item.feedbackIfWrong.trim()) {
      errors.push(`${item.id}: empty feedbackIfWrong.`);
    }
    if (!item.teachingImplication.trim()) {
      errors.push(`${item.id}: empty teachingImplication.`);
    }
    if (genericTeachingPattern.test(item.teachingImplication.trim())) {
      errors.push(`${item.id}: teachingImplication is too generic.`);
    }
    if (item.recommendationTags.length === 0) {
      errors.push(`${item.id}: missing recommendation tags.`);
    }
    if (item.recommendationTags.length < 2) {
      errors.push(`${item.id}: recommendation tags are too thin.`);
    }
    if (item.relatedTrackTags.length === 0) {
      errors.push(`${item.id}: missing related track tags.`);
    }
    if (item.estimatedTimeSeconds <= 0) {
      errors.push(`${item.id}: invalid estimated time.`);
    }
  }

  for (const level of cefrLevels) {
    for (const skill of skills) {
      const expected = requiredDistribution[level][skill];
      const actual = distribution[level][skill];
      if (actual !== expected) {
        errors.push(`${level} ${skill}: expected ${expected}, found ${actual}.`);
      }
    }

    const levelItems = items.filter((item) => item.cefrLevel === level);
    if (!levelItems.some((item) => item.isRoutingItem)) {
      errors.push(`${level}: no routing items.`);
    }
    if (!levelItems.some((item) => item.isAnchorItem)) {
      errors.push(`${level}: no anchor items.`);
    }
    if (!levelItems.some((item) => item.isConfirmationItem)) {
      errors.push(`${level}: no confirmation items.`);
    }
    for (const skill of skills) {
      const levelSkillItems = levelItems.filter((item) => item.skill === skill);
      const itemTypes = new Set(levelSkillItems.map((item) => item.itemType));
      const constructs = new Set(levelSkillItems.map((item) => item.construct));
      const minimumItemTypes = level === "A1" ? 3 : 4;

      if (itemTypes.size < minimumItemTypes) {
        errors.push(
          `${level} ${skill}: not enough item-type variety (${itemTypes.size}).`,
        );
      }
      if (constructs.size < 5) {
        errors.push(
          `${level} ${skill}: not enough construct coverage (${constructs.size}).`,
        );
      }
      if (!levelSkillItems.some((item) => item.isRoutingItem)) {
        errors.push(`${level} ${skill}: no routing items.`);
      }
      if (!levelSkillItems.some((item) => item.isAnchorItem)) {
        errors.push(`${level} ${skill}: no anchor items.`);
      }
      if (!levelSkillItems.some((item) => item.isConfirmationItem)) {
        errors.push(`${level} ${skill}: no confirmation items.`);
      }
    }
  }

  const correctCounts = Object.values(correctPositionCounts);
  const averageCorrectPosition =
    correctCounts.reduce((sum, count) => sum + count, 0) / correctCounts.length;
  if (
    correctCounts.some((count) => Math.abs(count - averageCorrectPosition) > 90)
  ) {
    errors.push("Correct answer position distribution is too uneven.");
  }

  return {
    valid: errors.length === 0,
    errors,
    distribution,
  };
}
