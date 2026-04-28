"use server";

import { randomUUID } from "node:crypto";

import { deliverLead } from "@/lib/lead-delivery";

import { getNextAdaptiveStage, minimumMeaningfulQuestions } from "./adaptive";
import { getPlacementItem, toPublicPlacementItems } from "./item-bank";
import { placementAnswerSchema, placementSubmissionSchema } from "./schema";
import { scorePlacementAttempt } from "./scoring";
import type {
  PlacementAnswer,
  PlacementStageResponse,
  PlacementStartInput,
  PlacementSubmitState,
} from "./types";

type StageInput = {
  sessionId: string;
  answers: PlacementAnswer[];
  recentlySeenItemIds?: string[];
  retakeCount?: number;
};

type PlacementFieldErrors = Extract<
  PlacementSubmitState,
  { status: "validation_error" }
>["fieldErrors"];

function hasOnlyKnownItems(answers: PlacementAnswer[]) {
  return answers.every((answer) => getPlacementItem(answer.itemId));
}

function validationFieldErrors(error: ReturnType<typeof placementSubmissionSchema.safeParse>) {
  if (error.success) return {};

  const flattened = error.error.flatten();
  const fieldErrors: PlacementFieldErrors = {};

  if (flattened.fieldErrors.answers?.[0]) {
    fieldErrors.answers = "Please complete the test before submitting your details.";
  }

  for (const issue of error.error.issues) {
    const path = issue.path.join(".");
    if (path === "details.fullName") fieldErrors.fullName = "Please enter your full name.";
    if (path === "details.age") fieldErrors.age = "Please enter a valid age.";
    if (path === "details.nationality") {
      fieldErrors.nationality = "Please enter your nationality.";
    }
    if (path === "details.whatsapp") {
      fieldErrors.whatsapp = "Please add WhatsApp or Telegram.";
      fieldErrors.telegram = "Please add WhatsApp or Telegram.";
    }
    if (path === "details.email") fieldErrors.email = "Please enter a valid email.";
    if (path === "details.preferredLanguage") {
      fieldErrors.preferredLanguage = "Please choose a preferred language.";
    }
    if (path === "details.consent") {
      fieldErrors.consent = "Consent is required before viewing the result.";
    }
  }

  return fieldErrors;
}

export async function startPlacementTest(
  input: PlacementStartInput,
): Promise<PlacementStageResponse> {
  const sessionId = randomUUID();
  const stage = getNextAdaptiveStage([], {
    sessionId,
    recentlySeenItemIds: input.recentlySeenItemIds,
    retakeCount: input.retakeCount,
  });

  return {
    sessionId,
    stage: stage.stage,
    items: toPublicPlacementItems(stage.items),
    totalQuestionsTarget: stage.totalQuestionsTarget,
    completed: false,
  };
}

export async function getPlacementStage({
  sessionId,
  answers,
  recentlySeenItemIds,
  retakeCount,
}: StageInput): Promise<PlacementStageResponse> {
  if (!sessionId || !Array.isArray(answers)) {
    throw new Error("Invalid placement test stage request.");
  }

  const parsedAnswers = placementAnswerSchema.array().safeParse(answers);

  if (!parsedAnswers.success || !hasOnlyKnownItems(parsedAnswers.data)) {
    throw new Error("Invalid placement test answers.");
  }

  const stage = getNextAdaptiveStage(parsedAnswers.data, {
    sessionId,
    recentlySeenItemIds,
    retakeCount,
  });

  return {
    sessionId,
    stage: stage.stage,
    items: toPublicPlacementItems(stage.items),
    totalQuestionsTarget: stage.totalQuestionsTarget,
    completed: stage.completed,
  };
}

export async function submitPlacementResult(
  input: unknown,
): Promise<PlacementSubmitState> {
  const parsed = placementSubmissionSchema.safeParse(input);

  if (!parsed.success) {
    return {
      status: "validation_error",
      message: "Please complete the highlighted details before viewing your result.",
      fieldErrors: validationFieldErrors(parsed),
    };
  }

  if (!hasOnlyKnownItems(parsed.data.answers)) {
    return {
      status: "validation_error",
      message: "Please complete the test before submitting your details.",
      fieldErrors: {
        answers: "Some test answers could not be verified.",
      },
    };
  }

  const result = scorePlacementAttempt(parsed.data.answers, {
    interestedTrack: parsed.data.details.interestedTrack,
    learningGoal: parsed.data.details.learningGoal,
    retakeCount: parsed.data.retakeCount,
  });

  if (result.totalQuestionsAnswered < minimumMeaningfulQuestions) {
    return {
      status: "validation_error",
      message: "Please complete the test before submitting your details.",
      fieldErrors: {
        answers: "Please answer more questions before submitting.",
      },
    };
  }

  const payload = {
    submissionType: "placement-test",
    timestamp: new Date().toISOString(),
    testSessionId: parsed.data.sessionId,
    fullName: parsed.data.details.fullName,
    age: parsed.data.details.age,
    nationality: parsed.data.details.nationality,
    whatsapp: parsed.data.details.whatsapp,
    telegram: parsed.data.details.telegram,
    email: parsed.data.details.email,
    preferredLanguage: parsed.data.details.preferredLanguage,
    consent: "yes",
    locale: parsed.data.locale,
    sourcePage: parsed.data.sourcePage,
    referrer: parsed.data.tracking.referrer,
    utmSource: parsed.data.tracking.utmSource,
    utmMedium: parsed.data.tracking.utmMedium,
    utmCampaign: parsed.data.tracking.utmCampaign,
    interestedTrack: parsed.data.details.interestedTrack || result.recommendedTrack,
    offerType: "placement-test",
    goal: parsed.data.details.learningGoal,
    estimatedCefrLevel: result.estimatedCefrLevel,
    confidenceLabel: result.confidenceLabel,
    overallScore: result.overallScore,
    vocabularyScore: result.vocabularyScore,
    grammarScore: result.grammarScore,
    vocabularyLevelEstimate: result.vocabularyLevelEstimate,
    grammarLevelEstimate: result.grammarLevelEstimate,
    strongestArea: result.strongestArea,
    weakestArea: result.weakestArea,
    borderlineNote: result.borderlineNote,
    recommendedTrack: result.recommendedTrack,
    recommendedNextStep: result.recommendedNextStep,
    recommendationSummary: result.recommendationSummary,
    recommendedFirstLessonsJson: JSON.stringify(result.recommendedFirstLessons),
    topGrammarGapsJson: JSON.stringify(result.topGrammarGaps),
    topVocabularyGapsJson: JSON.stringify(result.topVocabularyGaps),
    completionTimeSeconds: parsed.data.completionTimeSeconds,
    completedAt: parsed.data.completedAt,
    retakeCount: parsed.data.retakeCount,
    totalQuestionsAnswered: result.totalQuestionsAnswered,
    correctAnswersCount: result.correctAnswersCount,
    questionIdsSeen: result.questionIdsSeen.join(","),
    answerSummaryJson: JSON.stringify(result.answerSummary),
    skillBreakdownJson: JSON.stringify(result.skillBreakdown),
    teacherDiagnosticJson: JSON.stringify(result.teacherDiagnostic),
    recommendationTags: result.recommendationTags.join(","),
  };

  try {
    const delivery = await deliverLead(payload);

    return {
      status: "success",
      result,
      leadId: delivery.leadId,
      message: "Your placement result was saved.",
    };
  } catch (error) {
    console.error("Placement test result storage failed", error);

    return {
      status: "storage_error",
      result,
      message:
        "Your result is ready, but saving it did not work. You can still view it and try again.",
    };
  }
}
