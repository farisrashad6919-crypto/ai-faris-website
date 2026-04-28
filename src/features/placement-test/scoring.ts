import type { TrackId } from "@/content/types";

import { placementItemBank } from "./item-bank";
import { cefrValues, formatScore, levelFromValue, valueForLevel } from "./levels";
import type {
  CefrLevel,
  PlacementAnswer,
  PlacementItem,
  PlacementScoreProfile,
  PlacementSkill,
} from "./types";

const skills: PlacementSkill[] = ["vocabulary", "grammar"];

const stageWeights: Record<number, number> = {
  1: 0.8,
  2: 1,
  3: 1.22,
};

const discriminationWeights = {
  low: 0.85,
  medium: 1,
  high: 1.18,
};

type ScoreContext = {
  interestedTrack?: TrackId | "";
  learningGoal?: string;
  retakeCount?: number;
};

type AnsweredEntry = {
  answer: PlacementAnswer;
  item: PlacementItem;
  correct: boolean;
  weight: number;
  evidenceValue: number;
};

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

function evidenceValue(item: PlacementItem, correct: boolean) {
  if (correct) {
    return Math.min(6.15, item.difficulty + 0.34);
  }

  const penalty = item.difficulty <= 2 ? 1.05 : item.difficulty <= 4 ? 0.82 : 0.58;
  return Math.max(1, item.difficulty - penalty);
}

function getAnsweredItems(answers: PlacementAnswer[]): AnsweredEntry[] {
  return uniqueAnswers(answers)
    .map((answer) => {
      const item = placementItemBank.find((candidate) => candidate.id === answer.itemId);
      if (!item) return null;
      const correct = answerIsCorrect(answer, item);
      const roleWeight =
        (item.isConfirmationItem ? 1.1 : 1) * (item.isAnchorItem ? 1.04 : 1);
      const weight =
        discriminationWeights[item.discrimination] *
        (stageWeights[answer.stage] ?? 1) *
        roleWeight;
      return {
        answer,
        item,
        correct,
        weight,
        evidenceValue: evidenceValue(item, correct),
      };
    })
    .filter(Boolean) as AnsweredEntry[];
}

function scoreGroup(group: AnsweredEntry[]) {
  if (group.length === 0) {
    return {
      score: 0,
      level: "A1" as CefrLevel,
      ability: 1,
      correct: 0,
      total: 0,
    };
  }

  const possible = group.reduce((total, entry) => total + entry.weight, 0);
  const earned = group.reduce(
    (total, entry) => total + (entry.correct ? entry.weight : 0),
    0,
  );
  const evidence = group.reduce(
    (result, entry) => ({
      total: result.total + entry.evidenceValue * entry.weight,
      weight: result.weight + entry.weight,
    }),
    { total: 0, weight: 0 },
  );
  const ability = Math.max(1, Math.min(6.1, evidence.total / evidence.weight));

  return {
    score: possible > 0 ? formatScore((earned / possible) * 100) : 0,
    level: levelFromValue(ability),
    ability,
    correct: group.filter((entry) => entry.correct).length,
    total: group.length,
  };
}

function findBorderline(ability: number) {
  const thresholds = [
    { value: 1.55, label: "A1/A2 borderline" },
    { value: 2.45, label: "A2/B1 borderline" },
    { value: 3.45, label: "B1/B2 borderline" },
    { value: 4.45, label: "B2/C1 borderline" },
    { value: 5.45, label: "C1/C2 borderline" },
  ];
  const nearest = thresholds
    .map((threshold) => ({
      ...threshold,
      distance: Math.abs(ability - threshold.value),
    }))
    .sort((a, b) => a.distance - b.distance)[0];

  return nearest.distance <= 0.2 ? nearest.label : "";
}

function confidenceLabel({
  level,
  ability,
  subskillSpread,
  total,
  grammarLevel,
  vocabularyLevel,
}: {
  level: CefrLevel;
  ability: number;
  subskillSpread: number;
  total: number;
  grammarLevel: CefrLevel;
  vocabularyLevel: CefrLevel;
}) {
  const borderline = findBorderline(ability);

  if (borderline) return borderline;

  if (
    cefrValues[vocabularyLevel] >= cefrValues.C2 &&
    cefrValues[grammarLevel] <= cefrValues.C1
  ) {
    return "C2-level vocabulary control, but grammar evidence suggests C1";
  }

  if (level === "B2" && ability >= 4.22) return "B2 moving toward C1";
  if (level === "C1" && ability >= 5.18) return "Upper-C1 / approaching C2";
  if (total >= 24 && subskillSpread <= 0.85) return `Strong ${level}`;

  return `Likely ${level}`;
}

function countGapTags(entries: AnsweredEntry[], skill?: PlacementSkill) {
  const counts = new Map<string, number>();

  for (const entry of entries) {
    if (entry.correct) continue;
    if (skill && entry.item.skill !== skill) continue;
    for (const tag of entry.item.recommendationTags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
    counts.set(entry.item.construct, (counts.get(entry.item.construct) ?? 0) + 1);
    counts.set(entry.item.subskill, (counts.get(entry.item.subskill) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([tag]) => tag)
    .slice(0, 5);
}

function inferTrack({
  context,
  level,
  tags,
}: {
  context?: ScoreContext;
  level: CefrLevel;
  tags: string[];
}): TrackId {
  const goal = `${context?.learningGoal ?? ""} ${context?.interestedTrack ?? ""}`.toLowerCase();

  if (goal.includes("ielts") || goal.includes("exam") || goal.includes("band")) {
    return "ielts";
  }
  if (
    goal.includes("business") ||
    goal.includes("work") ||
    goal.includes("meeting") ||
    goal.includes("interview") ||
    goal.includes("professional")
  ) {
    return "business";
  }
  if (goal.includes("teacher") || goal.includes("training") || goal.includes("methodology")) {
    return "teacher-training";
  }
  if (context?.interestedTrack) return context.interestedTrack;
  if (level === "C1" || level === "C2" || tags.includes("discourse-control")) {
    return "teacher-training";
  }

  return "general";
}

function trackNextStep(track: TrackId) {
  switch (track) {
    case "ielts":
      return "Book an IELTS diagnostic lesson to connect this level estimate to your target band and exam timeline.";
    case "business":
      return "Book a Business English diagnostic lesson to turn these gaps into meetings, interviews, presentations, and email practice.";
    case "teacher-training":
      return "Book an advanced diagnostic lesson to check precision, teacher-language goals, or professional English needs.";
    case "general":
    default:
      return "Book a General English diagnostic lesson to confirm live communication skills and build a focused study plan.";
  }
}

function recommendedFirstLessons({
  level,
  weakest,
  grammarGaps,
  vocabularyGaps,
  track,
}: {
  level: CefrLevel;
  weakest: PlacementSkill;
  grammarGaps: string[];
  vocabularyGaps: string[];
  track: TrackId;
}) {
  const lessons = [
    weakest === "grammar"
      ? "Grammar-for-communication lesson: stabilise repeated sentence patterns through guided speaking."
      : "Vocabulary depth lesson: build chunks, collocations, and retrieval practice around the learner's real goals.",
    level === "B1" || level === "B2"
      ? "Fluency expansion lesson: connect ideas with tense control, linking, and more precise topic vocabulary."
      : "Accuracy baseline lesson: confirm what is automatic, what breaks under pressure, and what needs review.",
    track === "ielts"
      ? "IELTS bridge lesson: map grammar and vocabulary gaps to speaking/writing band needs."
      : track === "business"
        ? "Live professional scenario lesson: practise the most useful workplace situations with correction."
        : track === "teacher-training"
          ? "Advanced precision lesson: refine explanation language, register, and professional accuracy."
          : "Personal study-plan lesson: set weekly grammar, vocabulary, and speaking priorities.",
  ];

  if (grammarGaps[0] && vocabularyGaps[0]) {
    lessons[1] = `Integrated accuracy lesson: practise ${grammarGaps[0]} with ${vocabularyGaps[0]} in realistic answers.`;
  }

  return lessons;
}

function recommendationsFor({
  weakest,
  grammarGaps,
  vocabularyGaps,
  track,
  level,
}: {
  weakest: PlacementSkill;
  grammarGaps: string[];
  vocabularyGaps: string[];
  track: TrackId;
  level: CefrLevel;
}) {
  const recommendations = [
    "Use spaced review and retrieval practice instead of rereading notes passively.",
    "Keep an error log with corrected example sentences and revisit it weekly.",
  ];

  if (weakest === "grammar" || grammarGaps.length > vocabularyGaps.length) {
    recommendations.push("Practise grammar through short communicative answers, then correct the repeated patterns.");
  }

  if (weakest === "vocabulary" || vocabularyGaps.length >= grammarGaps.length) {
    recommendations.push("Learn vocabulary in chunks, collocations, word families, and short useful sentences.");
  }

  if (level === "B1" || level === "B2") {
    recommendations.push("Build longer answers with linking, tense consistency, and topic vocabulary.");
  }

  if (level === "C1" || level === "C2") {
    recommendations.push("Focus on register, nuance, discourse control, hedging, and precise collocation.");
  }

  if (track === "ielts") {
    recommendations.push("Connect these gaps to IELTS-style speaking and writing tasks with guided correction.");
  }

  if (track === "business") {
    recommendations.push("Apply the language in meetings, presentations, email, and interview scenarios.");
  }

  return recommendations;
}

function buildRecommendationSummary({
  level,
  strongest,
  weakest,
  track,
  grammarLevel,
  vocabularyLevel,
}: {
  level: CefrLevel;
  strongest: PlacementSkill;
  weakest: PlacementSkill;
  track: TrackId;
  grammarLevel: CefrLevel;
  vocabularyLevel: CefrLevel;
}) {
  return `Your English evidence is around ${level}. Vocabulary evidence suggests ${vocabularyLevel}; grammar evidence suggests ${grammarLevel}. Your stronger tested area is ${strongest}, and the priority area to stabilise is ${weakest}. Recommended track: ${track}.`;
}

export function scorePlacementAttempt(
  answers: PlacementAnswer[],
  context?: ScoreContext,
): PlacementScoreProfile {
  const answeredItems = getAnsweredItems(answers);
  const overall = scoreGroup(answeredItems);
  const skillScores = Object.fromEntries(
    skills.map((skill) => [
      skill,
      scoreGroup(answeredItems.filter((entry) => entry.item.skill === skill)),
    ]),
  ) as Record<PlacementSkill, ReturnType<typeof scoreGroup>>;
  const sortedSkills = [...skills].sort((a, b) => {
    const levelDelta =
      cefrValues[skillScores[b].level] - cefrValues[skillScores[a].level];
    if (levelDelta !== 0) return levelDelta;
    return skillScores[b].score - skillScores[a].score;
  });
  const strongestArea = sortedSkills[0];
  const weakestArea = sortedSkills[sortedSkills.length - 1];
  const subskillAbilities = skills.map((skill) => skillScores[skill].ability);
  const subskillSpread =
    Math.max(...subskillAbilities) - Math.min(...subskillAbilities);
  const borderlineNote = findBorderline(overall.ability);
  const topGrammarGaps = countGapTags(answeredItems, "grammar");
  const topVocabularyGaps = countGapTags(answeredItems, "vocabulary");
  const recommendationTags = Array.from(
    new Set([...topGrammarGaps, ...topVocabularyGaps, ...countGapTags(answeredItems)]),
  ).slice(0, 8);
  const recommendedTrack = inferTrack({
    context,
    level: overall.level,
    tags: recommendationTags,
  });
  const recommendedNextStep = trackNextStep(recommendedTrack);
  const firstLessons = recommendedFirstLessons({
    level: overall.level,
    weakest: weakestArea,
    grammarGaps: topGrammarGaps,
    vocabularyGaps: topVocabularyGaps,
    track: recommendedTrack,
  });
  const recommendationSummary = buildRecommendationSummary({
    level: overall.level,
    strongest: strongestArea,
    weakest: weakestArea,
    track: recommendedTrack,
    grammarLevel: skillScores.grammar.level,
    vocabularyLevel: skillScores.vocabulary.level,
  });
  const strengths = [
    `${strongestArea} is the stronger tested area in this adaptive diagnostic.`,
    overall.score >= 70
      ? "You handled a good share of level-targeted evidence successfully."
      : "The test found a practical starting band and several teachable priorities.",
  ];
  const gaps = [
    `${weakestArea} needs the most careful follow-up.`,
    borderlineNote
      ? "Your result sits near a CEFR boundary, so live confirmation will be especially useful."
      : "Speaking, listening, writing, and real-time communication may show a different level and should be checked live.",
  ];
  const incorrectPatterns = answeredItems
    .filter((entry) => !entry.correct)
    .map((entry) => `${entry.item.skill}: ${entry.item.construct}`)
    .slice(0, 10);

  return {
    estimatedCefrLevel: overall.level,
    confidenceLabel: confidenceLabel({
      level: overall.level,
      ability: overall.ability,
      subskillSpread,
      total: answeredItems.length,
      grammarLevel: skillScores.grammar.level,
      vocabularyLevel: skillScores.vocabulary.level,
    }),
    overallScore: overall.score,
    vocabularyScore: skillScores.vocabulary.score,
    grammarScore: skillScores.grammar.score,
    vocabularyLevelEstimate: skillScores.vocabulary.level,
    grammarLevelEstimate: skillScores.grammar.level,
    strongestArea,
    weakestArea,
    borderlineNote,
    recommendedTrack,
    recommendedNextStep,
    recommendationSummary,
    recommendedFirstLessons: firstLessons,
    topGrammarGaps,
    topVocabularyGaps,
    recommendationTags,
    strengths,
    gaps,
    recommendations: recommendationsFor({
      weakest: weakestArea,
      grammarGaps: topGrammarGaps,
      vocabularyGaps: topVocabularyGaps,
      track: recommendedTrack,
      level: overall.level,
    }),
    skillBreakdown: {
      vocabulary: {
        score: skillScores.vocabulary.score,
        levelEstimate: skillScores.vocabulary.level,
        correct: skillScores.vocabulary.correct,
        total: skillScores.vocabulary.total,
      },
      grammar: {
        score: skillScores.grammar.score,
        levelEstimate: skillScores.grammar.level,
        correct: skillScores.grammar.correct,
        total: skillScores.grammar.total,
      },
    },
    totalQuestionsAnswered: answeredItems.length,
    correctAnswersCount: answeredItems.filter((entry) => entry.correct).length,
    questionIdsSeen: answeredItems.map((entry) => entry.item.id),
    retakeCount: context?.retakeCount ?? 0,
    answerSummary: answeredItems.map((entry) => ({
      itemId: entry.item.id,
      skill: entry.item.skill,
      cefrLevel: entry.item.cefrLevel,
      construct: entry.item.construct,
      subskill: entry.item.subskill,
      selectedOptionIds: entry.answer.selectedOptionIds,
      correct: entry.correct,
      stage: entry.answer.stage,
    })),
    teacherDiagnostic: {
      canDoSummary: `Likely ${overall.level} overall evidence, with ${strongestArea} more stable than ${weakestArea}.`,
      cannotDoYetSummary: `First lessons should check ${weakestArea}, especially ${[...topGrammarGaps, ...topVocabularyGaps].slice(0, 3).join(", ") || "accuracy under pressure"}.`,
      incorrectAnswerPatterns: incorrectPatterns,
      recommendedFirstLessons: firstLessons,
      topGrammarGaps,
      topVocabularyGaps,
    },
  };
}

export function resultIsNearLevel(result: PlacementScoreProfile, level: CefrLevel) {
  return Math.abs(
    valueForLevel(result.estimatedCefrLevel) - valueForLevel(level),
  ) <= 1;
}
