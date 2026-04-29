import type { TrackId } from "@/content/types";
import type { Locale } from "@/i18n/routing";

export const tenseDifficultyBands = [
  "easy",
  "medium",
  "hard",
  "advanced",
] as const;
export type TenseDifficultyBand = (typeof tenseDifficultyBands)[number];

export const tenseDiagnosticAreas = [
  "present-tense-control",
  "past-tense-control",
  "perfect-aspect-control",
  "future-tense-control",
  "tense-contrast-control",
  "narrative-sequencing",
  "stative-dynamic-control",
  "professional-academic-tense-use",
  "advanced-tense-precision",
] as const;
export type TenseDiagnosticArea = (typeof tenseDiagnosticAreas)[number];

export type TenseMasteryLabel =
  | "Basic tense control"
  | "Developing tense control"
  | "Independent tense control"
  | "Strong tense control"
  | "Advanced tense control";

export type PlacementItemType =
  | "contextual-choice"
  | "dialogue-completion"
  | "timeline-reasoning"
  | "error-correction"
  | "error-identification"
  | "best-rewrite"
  | "mini-story-cloze"
  | "professional-context"
  | "ielts-speaking-response"
  | "meaning-contrast"
  | "stative-verb"
  | "dynamic-meaning"
  | "advanced-context";

export type PlacementOption = {
  id: string;
  text: string;
};

export type PlacementItem = {
  id: string;
  itemType: PlacementItemType;
  difficulty: number;
  difficultyBand: TenseDifficultyBand;
  targetTense: string;
  diagnosticArea: TenseDiagnosticArea;
  stem: string;
  context: string;
  options: PlacementOption[];
  correctAnswerId: string;
  explanation: string;
  feedbackIfWrong: string;
  teachingImplication: string;
  recommendationTags: string[];
  relatedTrackTags: TrackId[];
  estimatedTimeSeconds: number;
  isAnchorItem: boolean;
  isRoutingItem: boolean;
  isConfirmationItem: boolean;
  avoidIfSeenRecently: boolean;
  version: number;
};

export type PublicPlacementItem = Omit<
  PlacementItem,
  | "correctAnswerId"
  | "difficulty"
  | "explanation"
  | "feedbackIfWrong"
  | "teachingImplication"
  | "recommendationTags"
  | "relatedTrackTags"
  | "isAnchorItem"
  | "isRoutingItem"
  | "isConfirmationItem"
  | "avoidIfSeenRecently"
>;

export type PlacementAnswer = {
  itemId: string;
  selectedOptionIds: string[];
  stage: number;
  answeredAt: string;
  elapsedSeconds: number;
};

export type PlacementStartInput = {
  locale: Locale;
  sourcePage: string;
  interestedTrack?: TrackId | "";
  learningGoal?: string;
  selfEstimatedLevel?: string;
  recentlySeenItemIds?: string[];
  retakeCount?: number;
};

export type PlacementStageResponse = {
  sessionId: string;
  stage: number;
  items: PublicPlacementItem[];
  totalQuestionsTarget: number;
  completed: boolean;
};

export type TenseAreaBreakdown = {
  score: number;
  correct: number;
  total: number;
  label: string;
};

export type PlacementScoreProfile = {
  masteryLabel: TenseMasteryLabel;
  confidenceLabel: string;
  overallScore: number;
  presentScore: number;
  pastScore: number;
  perfectScore: number;
  futureScore: number;
  tenseContrastScore: number;
  narrativeSequencingScore: number;
  stativeDynamicScore: number;
  professionalAcademicScore: number;
  advancedPrecisionScore: number;
  strongestArea: TenseDiagnosticArea;
  weakestArea: TenseDiagnosticArea;
  weakTenseAreas: string[];
  tenseContrastsToStudy: string[];
  recommendedTrack: TrackId;
  recommendedNextStep: string;
  recommendationSummary: string;
  recommendedFirstLessons: string[];
  topTenseWeaknesses: string[];
  recommendationTags: string[];
  strengths: string[];
  gaps: string[];
  recommendations: string[];
  areaBreakdown: Record<TenseDiagnosticArea, TenseAreaBreakdown>;
  totalQuestionsAnswered: number;
  correctAnswersCount: number;
  questionIdsSeen: string[];
  retakeCount: number;
  answerSummary: Array<{
    itemId: string;
    targetTense: string;
    diagnosticArea: TenseDiagnosticArea;
    difficultyBand: TenseDifficultyBand;
    selectedOptionIds: string[];
    correct: boolean;
    stage: number;
  }>;
  teacherDiagnostic: {
    canDoSummary: string;
    cannotDoYetSummary: string;
    incorrectAnswerPatterns: string[];
    recommendedFirstLessons: string[];
    topTenseWeaknesses: string[];
  };
};

export type PlacementResultSubmission = {
  sessionId: string;
  locale: Locale;
  sourcePage: string;
  startedAt: string;
  completedAt: string;
  completionTimeSeconds: number;
  answers: PlacementAnswer[];
  details: {
    fullName: string;
    age: string;
    nationality: string;
    whatsapp: string;
    telegram: string;
    email: string;
    preferredLanguage: Locale;
    consent: boolean;
    learningGoal: string;
    interestedTrack: TrackId | "";
  };
  tracking: {
    referrer: string;
    utmSource: string;
    utmMedium: string;
    utmCampaign: string;
  };
  retakeCount?: number;
};

export type PlacementSubmitState =
  | {
      status: "success";
      result: PlacementScoreProfile;
      leadId?: string;
      message?: string;
    }
  | {
      status: "storage_error";
      result: PlacementScoreProfile;
      message: string;
    }
  | {
      status: "validation_error";
      message: string;
      fieldErrors: Partial<
        Record<
          | "fullName"
          | "age"
          | "nationality"
          | "whatsapp"
          | "telegram"
          | "email"
          | "preferredLanguage"
          | "consent"
          | "answers",
          string
        >
      >;
    };
