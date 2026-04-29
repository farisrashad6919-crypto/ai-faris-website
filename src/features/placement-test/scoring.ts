import type { TrackId } from "@/content/types";

import { placementItemBank } from "./item-bank";
import {
  tenseDiagnosticAreas,
  type PlacementAnswer,
  type PlacementItem,
  type PlacementScoreProfile,
  type TenseDiagnosticArea,
  type TenseMasteryLabel,
} from "./types";

const stageWeights: Record<number, number> = {
  1: 0.82,
  2: 1,
  3: 1.18,
};

const difficultyWeights = {
  easy: 0.86,
  medium: 1,
  hard: 1.16,
  advanced: 1.32,
} as const;

const areaLabels: Record<TenseDiagnosticArea, string> = {
  "present-tense-control": "Present tense control",
  "past-tense-control": "Past tense control",
  "perfect-aspect-control": "Perfect aspect control",
  "future-tense-control": "Future tense control",
  "tense-contrast-control": "Tense contrast control",
  "narrative-sequencing": "Narrative sequencing",
  "stative-dynamic-control": "Stative and dynamic verb control",
  "professional-academic-tense-use": "Professional and academic tense use",
  "advanced-tense-precision": "Advanced tense precision",
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
};

function formatScore(value: number) {
  return Math.round(Math.max(0, Math.min(100, value)));
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

function getAnsweredItems(answers: PlacementAnswer[]): AnsweredEntry[] {
  return uniqueAnswers(answers)
    .map((answer) => {
      const item = placementItemBank.find((candidate) => candidate.id === answer.itemId);
      if (!item) return null;
      const roleWeight =
        (item.isConfirmationItem ? 1.1 : 1) * (item.isAnchorItem ? 1.04 : 1);
      const weight =
        (stageWeights[answer.stage] ?? 1) *
        difficultyWeights[item.difficultyBand] *
        roleWeight;

      return {
        answer,
        item,
        correct: answerIsCorrect(answer, item),
        weight,
      };
    })
    .filter(Boolean) as AnsweredEntry[];
}

function scoreGroup(entries: AnsweredEntry[]) {
  if (entries.length === 0) {
    return {
      score: 0,
      correct: 0,
      total: 0,
      possible: 0,
      earned: 0,
    };
  }

  const possible = entries.reduce((total, entry) => total + entry.weight, 0);
  const earned = entries.reduce(
    (total, entry) => total + (entry.correct ? entry.weight : 0),
    0,
  );
  const correct = entries.filter((entry) => entry.correct).length;

  return {
    score: possible > 0 ? formatScore((earned / possible) * 100) : 0,
    correct,
    total: entries.length,
    possible,
    earned,
  };
}

function masteryLabel(score: number): TenseMasteryLabel {
  if (score < 45) return "Basic tense control";
  if (score < 60) return "Developing tense control";
  if (score < 75) return "Independent tense control";
  if (score < 88) return "Strong tense control";
  return "Advanced tense control";
}

function confidenceLabel({
  score,
  total,
  areaSpread,
  advancedCorrect,
  advancedTotal,
}: {
  score: number;
  total: number;
  areaSpread: number;
  advancedCorrect: number;
  advancedTotal: number;
}) {
  const nearBoundary =
    Math.min(
      Math.abs(score - 45),
      Math.abs(score - 60),
      Math.abs(score - 75),
      Math.abs(score - 88),
    ) <= 3;

  if (nearBoundary) return "Borderline tense-control profile";
  if (total >= 30 && score >= 88 && advancedTotal >= 5 && advancedCorrect / advancedTotal >= 0.75) {
    return "Advanced evidence across tense forms";
  }
  if (total >= 30 && score >= 75 && areaSpread <= 22) {
    return "Strong evidence from a balanced tense profile";
  }
  if (areaSpread >= 35) return "Mixed profile with uneven tense control";
  return "Useful diagnostic estimate";
}

function areaScore(entries: AnsweredEntry[], area: TenseDiagnosticArea) {
  const group = scoreGroup(entries.filter((entry) => entry.item.diagnosticArea === area));
  return {
    score: group.score,
    correct: group.correct,
    total: group.total,
    label: areaLabels[area],
  };
}

function countWeakTags(entries: AnsweredEntry[]) {
  const counts = new Map<string, number>();

  for (const entry of entries) {
    if (entry.correct) continue;
    counts.set(entry.item.targetTense, (counts.get(entry.item.targetTense) ?? 0) + 1);
    counts.set(entry.item.diagnosticArea, (counts.get(entry.item.diagnosticArea) ?? 0) + 1);
    for (const tag of entry.item.recommendationTags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([tag]) => tag);
}

function tenseContrastSuggestions(tags: string[]) {
  const suggestions = new Set<string>();
  const joined = tags.join(" ");

  if (/present-simple|present-continuous|stative/.test(joined)) {
    suggestions.add("Present Simple vs Present Continuous, including stative verbs");
  }
  if (/present-perfect|past-simple|unfinished-time|finished-time|since/.test(joined)) {
    suggestions.add("Present Perfect vs Past Simple with time markers");
  }
  if (/past-continuous|interruption|timeline/.test(joined)) {
    suggestions.add("Past Simple vs Past Continuous in stories");
  }
  if (/past-perfect|earlier-past|sequence|before|after/.test(joined)) {
    suggestions.add("Past Perfect for earlier past events and causes");
  }
  if (/will|going-to|future-arrangement|future-continuous|future-perfect/.test(joined)) {
    suggestions.add("Future forms for plans, offers, arrangements, and deadlines");
  }
  if (/business|professional|academic|formal-register|report/.test(joined)) {
    suggestions.add("Tense precision in professional and academic communication");
  }

  return Array.from(suggestions).slice(0, 5);
}

function lessonAimsFromWeaknesses({
  tags,
  areaBreakdown,
  overallScore,
}: {
  tags: string[];
  areaBreakdown: PlacementScoreProfile["areaBreakdown"];
  overallScore: number;
}) {
  const lessons: string[] = [];
  const joined = tags.join(" ");

  if (
    areaBreakdown["present-tense-control"].score < 70 ||
    areaBreakdown["stative-dynamic-control"].score < 70 ||
    /present-simple|present-continuous|stative/.test(joined)
  ) {
    lessons.push("Review Present Simple vs Present Continuous, including stative and dynamic meanings.");
  }

  if (/present-perfect|past-simple|since|unfinished-time|finished-time/.test(joined)) {
    lessons.push("Practise Present Perfect vs Past Simple with finished and unfinished time markers.");
  }

  if (
    areaBreakdown["narrative-sequencing"].score < 70 ||
    /past-continuous|past-perfect|sequence|interruption/.test(joined)
  ) {
    lessons.push("Build accuracy with past storytelling tenses and event sequencing.");
  }

  if (
    areaBreakdown["future-tense-control"].score < 70 ||
    /future|will|going-to|arrangement/.test(joined)
  ) {
    lessons.push("Practise future forms for plans, predictions, arrangements, and deadlines.");
  }

  if (
    areaBreakdown["professional-academic-tense-use"].score < 72 ||
    areaBreakdown["advanced-tense-precision"].score < 72 ||
    /professional|academic|report|advanced/.test(joined)
  ) {
    lessons.push("Develop advanced tense control for professional, IELTS-style, and academic communication.");
  }

  if (overallScore < 50) {
    lessons.unshift("Stabilise core tense form and meaning before moving into longer speaking answers.");
  }

  const fallback = [
    "Use guided speaking correction to turn tense knowledge into accurate communication.",
    "Create a small tense error log and practise corrected examples with spaced review.",
    "Connect tense practice to personal stories, workplace updates, and future plans.",
  ];

  return [...lessons, ...fallback].filter((item, index, array) => array.indexOf(item) === index).slice(0, 3);
}

function inferTrack({
  context,
  tags,
  professionalScore,
  overallScore,
}: {
  context?: ScoreContext;
  tags: string[];
  professionalScore: number;
  overallScore: number;
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
  if (professionalScore >= 78 && overallScore >= 75) return "business";
  if (tags.some((tag) => tag.includes("ielts"))) return "ielts";
  if (overallScore >= 84 && tags.some((tag) => tag.includes("advanced"))) {
    return "teacher-training";
  }
  return "general";
}

function trackNextStep(track: TrackId) {
  switch (track) {
    case "ielts":
      return "Book an IELTS-focused grammar lesson to practise tense control in speaking and writing answers.";
    case "business":
      return "Book a Business English lesson to use accurate tenses in meetings, updates, interviews, and email.";
    case "teacher-training":
      return "Book an advanced grammar and teacher-language lesson to refine tense explanation, register, and precision.";
    case "general":
    default:
      return "Book a focused grammar and speaking lesson to turn tense knowledge into accurate communication.";
  }
}

function recommendationsFor({
  weakestArea,
  score,
  track,
}: {
  weakestArea: TenseDiagnosticArea;
  score: number;
  track: TrackId;
}) {
  const recommendations = [
    "Use retrieval practice: answer short tense questions from memory, then check and correct.",
    "Keep a tense error log with one corrected example for each repeated mistake.",
    "Practise tense contrasts in speaking, not only in isolated sentences.",
  ];

  if (weakestArea === "narrative-sequencing") {
    recommendations.push("Tell short past stories using background action, interruption, and earlier-past events.");
  }
  if (weakestArea === "future-tense-control") {
    recommendations.push("Compare will, going to, present continuous, future continuous, and future perfect in real plans.");
  }
  if (weakestArea === "professional-academic-tense-use") {
    recommendations.push("Practise workplace updates and report-style sentences with accurate time reference.");
  }
  if (score >= 75) {
    recommendations.push("Move from sentence accuracy into longer answers where tense consistency is harder to maintain.");
  }
  if (track === "ielts") {
    recommendations.push("Apply each tense contrast to IELTS Speaking Part 1, Part 2 stories, and Writing examples.");
  }
  if (track === "business") {
    recommendations.push("Use meeting updates, project timelines, and email follow-ups as tense practice contexts.");
  }

  return recommendations.slice(0, 6);
}

function weaknessLabel(value: string) {
  return value
    .replace(/-/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function scorePlacementAttempt(
  answers: PlacementAnswer[],
  context?: ScoreContext,
): PlacementScoreProfile {
  const entries = getAnsweredItems(answers);
  const overall = scoreGroup(entries);
  const areaBreakdown = Object.fromEntries(
    tenseDiagnosticAreas.map((area) => [area, areaScore(entries, area)]),
  ) as PlacementScoreProfile["areaBreakdown"];
  const scoredAreas = tenseDiagnosticAreas.filter(
    (area) => areaBreakdown[area].total > 0,
  );
  const strongestArea = [...scoredAreas].sort(
    (a, b) => areaBreakdown[b].score - areaBreakdown[a].score,
  )[0] ?? "present-tense-control";
  const weakestArea = [...scoredAreas].sort(
    (a, b) => areaBreakdown[a].score - areaBreakdown[b].score,
  )[0] ?? "present-tense-control";
  const scores = scoredAreas.map((area) => areaBreakdown[area].score);
  const areaSpread = scores.length
    ? Math.max(...scores) - Math.min(...scores)
    : 0;
  const advancedEntries = entries.filter(
    (entry) => entry.item.difficultyBand === "advanced",
  );
  const weakTags = countWeakTags(entries);
  const topTenseWeaknesses = weakTags.slice(0, 5).map(weaknessLabel);
  const tenseContrastsToStudy = tenseContrastSuggestions(weakTags);
  const weakTenseAreas = scoredAreas
    .filter((area) => areaBreakdown[area].score < 68)
    .sort((a, b) => areaBreakdown[a].score - areaBreakdown[b].score)
    .map((area) => areaLabels[area])
    .slice(0, 5);
  const recommendedTrack = inferTrack({
    context,
    tags: weakTags,
    professionalScore: areaBreakdown["professional-academic-tense-use"].score,
    overallScore: overall.score,
  });
  const recommendedFirstLessons = lessonAimsFromWeaknesses({
    tags: weakTags,
    areaBreakdown,
    overallScore: overall.score,
  });
  const recommendedNextStep = trackNextStep(recommendedTrack);
  const label = masteryLabel(overall.score);
  const confidence = confidenceLabel({
    score: overall.score,
    total: entries.length,
    areaSpread,
    advancedCorrect: advancedEntries.filter((entry) => entry.correct).length,
    advancedTotal: advancedEntries.length,
  });
  const recommendationSummary = `${label}. Your strongest tested area is ${areaLabels[strongestArea].toLowerCase()}, while ${areaLabels[weakestArea].toLowerCase()} needs the most careful follow-up.`;
  const strengths = [
    `${areaLabels[strongestArea]} is currently your strongest tense area.`,
    overall.score >= 75
      ? "You can control several tense choices in realistic sentence and dialogue contexts."
      : "The test found clear, teachable tense priorities rather than only a raw score.",
  ];
  const gaps = [
    `${areaLabels[weakestArea]} is the first area to stabilise.`,
    tenseContrastsToStudy[0]
      ? `Start with ${tenseContrastsToStudy[0].toLowerCase()}.`
      : "Longer speaking and writing may reveal additional tense-control gaps.",
  ];
  const incorrectAnswerPatterns = entries
    .filter((entry) => !entry.correct)
    .map(
      (entry) =>
        `${areaLabels[entry.item.diagnosticArea]}: ${entry.item.targetTense}`,
    )
    .slice(0, 12);

  return {
    masteryLabel: label,
    confidenceLabel: confidence,
    overallScore: overall.score,
    presentScore: areaBreakdown["present-tense-control"].score,
    pastScore: areaBreakdown["past-tense-control"].score,
    perfectScore: areaBreakdown["perfect-aspect-control"].score,
    futureScore: areaBreakdown["future-tense-control"].score,
    tenseContrastScore: areaBreakdown["tense-contrast-control"].score,
    narrativeSequencingScore: areaBreakdown["narrative-sequencing"].score,
    stativeDynamicScore: areaBreakdown["stative-dynamic-control"].score,
    professionalAcademicScore:
      areaBreakdown["professional-academic-tense-use"].score,
    advancedPrecisionScore: areaBreakdown["advanced-tense-precision"].score,
    strongestArea,
    weakestArea,
    weakTenseAreas,
    tenseContrastsToStudy,
    recommendedTrack,
    recommendedNextStep,
    recommendationSummary,
    recommendedFirstLessons,
    topTenseWeaknesses,
    recommendationTags: weakTags.slice(0, 10),
    strengths,
    gaps,
    recommendations: recommendationsFor({
      weakestArea,
      score: overall.score,
      track: recommendedTrack,
    }),
    areaBreakdown,
    totalQuestionsAnswered: entries.length,
    correctAnswersCount: entries.filter((entry) => entry.correct).length,
    questionIdsSeen: entries.map((entry) => entry.item.id),
    retakeCount: context?.retakeCount ?? 0,
    answerSummary: entries.map((entry) => ({
      itemId: entry.item.id,
      targetTense: entry.item.targetTense,
      diagnosticArea: entry.item.diagnosticArea,
      difficultyBand: entry.item.difficultyBand,
      selectedOptionIds: entry.answer.selectedOptionIds,
      correct: entry.correct,
      stage: entry.answer.stage,
    })),
    teacherDiagnostic: {
      canDoSummary: `${label}: ${areaLabels[strongestArea].toLowerCase()} looks more stable than ${areaLabels[weakestArea].toLowerCase()}.`,
      cannotDoYetSummary: `First lessons should target ${topTenseWeaknesses.slice(0, 3).join(", ") || areaLabels[weakestArea]}.`,
      incorrectAnswerPatterns,
      recommendedFirstLessons,
      topTenseWeaknesses,
    },
  };
}
