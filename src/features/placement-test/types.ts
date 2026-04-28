import type { TrackId } from "@/content/types";
import type { Locale } from "@/i18n/routing";

export const cefrLevels = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;
export type CefrLevel = (typeof cefrLevels)[number];

export type PlacementSkill = "vocabulary" | "grammar";
export type PlacementRoutingRole = "routing" | "core" | "confirmation";
export type PlacementDiscrimination = "low" | "medium" | "high";
export type PlacementItemType =
  | "contextual-lexical-choice"
  | "collocation-completion"
  | "phrase-chunk-recognition"
  | "word-family-choice"
  | "phrasal-verb-context"
  | "register-choice"
  | "meaning-in-context"
  | "near-synonym-distinction"
  | "multiple-meaning-choice"
  | "academic-professional-vocabulary"
  | "sentence-cloze"
  | "short-dialogue-grammar-choice"
  | "meaning-focused-grammar-contrast"
  | "error-identification"
  | "corrected-sentence-selection"
  | "best-rewrite"
  | "tense-aspect-control"
  | "modal-meaning-choice"
  | "clause-complexity-choice"
  | "discourse-cohesion-grammar";

export type PlacementOption = {
  id: string;
  text: string;
};

export type PlacementItem = {
  id: string;
  cefrLevel: CefrLevel;
  skill: PlacementSkill;
  subskill: string;
  construct: string;
  microSkill: string;
  difficulty: number;
  discrimination: PlacementDiscrimination;
  itemType: PlacementItemType;
  stem: string;
  context: string;
  options: PlacementOption[];
  correctAnswerId: string | string[];
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
  | "discrimination"
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

export type PlacementScoreProfile = {
  estimatedCefrLevel: CefrLevel;
  confidenceLabel: string;
  overallScore: number;
  vocabularyScore: number;
  grammarScore: number;
  vocabularyLevelEstimate: CefrLevel;
  grammarLevelEstimate: CefrLevel;
  strongestArea: PlacementSkill;
  weakestArea: PlacementSkill;
  borderlineNote: string;
  recommendedTrack: TrackId;
  recommendedNextStep: string;
  recommendationSummary: string;
  recommendedFirstLessons: string[];
  topGrammarGaps: string[];
  topVocabularyGaps: string[];
  recommendationTags: string[];
  strengths: string[];
  gaps: string[];
  recommendations: string[];
  skillBreakdown: Record<
    PlacementSkill,
    {
      score: number;
      levelEstimate: CefrLevel;
      correct: number;
      total: number;
    }
  >;
  totalQuestionsAnswered: number;
  correctAnswersCount: number;
  questionIdsSeen: string[];
  retakeCount: number;
  answerSummary: Array<{
    itemId: string;
    skill: PlacementSkill;
    cefrLevel: CefrLevel;
    construct: string;
    subskill: string;
    selectedOptionIds: string[];
    correct: boolean;
    stage: number;
  }>;
  teacherDiagnostic: {
    canDoSummary: string;
    cannotDoYetSummary: string;
    incorrectAnswerPatterns: string[];
    recommendedFirstLessons: string[];
    topGrammarGaps: string[];
    topVocabularyGaps: string[];
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
