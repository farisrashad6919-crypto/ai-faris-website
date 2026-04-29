"use server";

import { deliverLead } from "@/lib/lead-delivery";

import { getNextAdaptiveStage, minimumMeaningfulQuestions } from "./adaptive";
import { getPlacementItem, toPublicPlacementItems } from "./item-bank";
import {
  placementAnswerSchema,
  placementAnonymousScoreSchema,
  placementSubmissionSchema,
} from "./schema";
import { scorePlacementAttempt } from "./scoring";
import { createPlacementStartResponse } from "./start";
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
  return createPlacementStartResponse({
    recentlySeenItemIds: input.recentlySeenItemIds,
    retakeCount: input.retakeCount,
  });
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
    items: toPublicPlacementItems(stage.items, `${sessionId}:${stage.stage}`),
    totalQuestionsTarget: stage.totalQuestionsTarget,
    completed: stage.completed,
  };
}

export async function scorePlacementResult(
  input: unknown,
): Promise<PlacementSubmitState> {
  const parsed = placementAnonymousScoreSchema.safeParse(input);

  if (!parsed.success) {
    return {
      status: "validation_error",
      message: "Please complete the test before viewing your result.",
      fieldErrors: {
        answers: "Please answer all test questions before viewing your result.",
      },
    };
  }

  if (!hasOnlyKnownItems(parsed.data.answers)) {
    return {
      status: "validation_error",
      message: "Please complete the test before viewing your result.",
      fieldErrors: {
        answers: "Some test answers could not be verified.",
      },
    };
  }

  const result = scorePlacementAttempt(parsed.data.answers, {
    interestedTrack: parsed.data.interestedTrack,
    learningGoal: parsed.data.learningGoal,
    retakeCount: parsed.data.retakeCount,
  });

  if (result.totalQuestionsAnswered < minimumMeaningfulQuestions) {
    return {
      status: "validation_error",
      message: "Please complete the test before viewing your result.",
      fieldErrors: {
        answers: "Please answer more questions before viewing your result.",
      },
    };
  }

  return {
    status: "success",
    result,
    message: "Your tense mastery result is ready.",
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
    submissionType: "tense-test",
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
    offerType: "tense-test",
    goal: parsed.data.details.learningGoal,
    masteryLabel: result.masteryLabel,
    confidenceLabel: result.confidenceLabel,
    overallTenseScore: result.overallScore,
    presentScore: result.presentScore,
    pastScore: result.pastScore,
    perfectScore: result.perfectScore,
    futureScore: result.futureScore,
    tenseContrastScore: result.tenseContrastScore,
    narrativeSequencingScore: result.narrativeSequencingScore,
    stativeDynamicScore: result.stativeDynamicScore,
    professionalAcademicScore: result.professionalAcademicScore,
    advancedPrecisionScore: result.advancedPrecisionScore,
    strongestArea: result.strongestArea,
    weakestArea: result.weakestArea,
    weakTenseAreasJson: JSON.stringify(result.weakTenseAreas),
    tenseContrastsToStudyJson: JSON.stringify(result.tenseContrastsToStudy),
    recommendedTrack: result.recommendedTrack,
    recommendedNextStep: result.recommendedNextStep,
    recommendationSummary: result.recommendationSummary,
    recommendedFirstLessonsJson: JSON.stringify(result.recommendedFirstLessons),
    topTenseWeaknessesJson: JSON.stringify(result.topTenseWeaknesses),
    completionTimeSeconds: parsed.data.completionTimeSeconds,
    completedAt: parsed.data.completedAt,
    retakeCount: parsed.data.retakeCount,
    totalQuestionsAnswered: result.totalQuestionsAnswered,
    correctAnswersCount: result.correctAnswersCount,
    questionIdsSeen: result.questionIdsSeen.join(","),
    answerSummaryJson: JSON.stringify(result.answerSummary),
    areaBreakdownJson: JSON.stringify(result.areaBreakdown),
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
