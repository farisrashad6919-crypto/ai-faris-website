import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { placementItemBank } from "./item-bank";
import { submitPlacementResult } from "./actions";
import type { PlacementItem, PlacementResultSubmission } from "./types";

const selectedItems = [
  ...placementItemBank.filter((item) => item.skill === "vocabulary").slice(0, 14),
  ...placementItemBank.filter((item) => item.skill === "grammar").slice(0, 14),
];

function correctIds(item: PlacementItem) {
  return Array.isArray(item.correctAnswerId)
    ? item.correctAnswerId
    : [item.correctAnswerId];
}

function validSubmission(
  overrides: Partial<PlacementResultSubmission> = {},
): PlacementResultSubmission {
  return {
    sessionId: "test-session-123",
    locale: "en",
    sourcePage: "/placement-test",
    startedAt: "2026-04-27T10:00:00.000Z",
    completedAt: "2026-04-27T10:15:00.000Z",
    completionTimeSeconds: 900,
    answers: selectedItems.map((item, index) => ({
      itemId: item.id,
      selectedOptionIds: correctIds(item),
      stage: index < 8 ? 1 : index < 22 ? 2 : 3,
      answeredAt: "2026-04-27T10:02:00.000Z",
      elapsedSeconds: index * 25,
    })),
    details: {
      fullName: "Mona Hassan",
      age: "24",
      nationality: "Egyptian",
      whatsapp: "+201000000000",
      telegram: "",
      email: "mona@example.com",
      preferredLanguage: "en",
      consent: true,
      learningGoal: "I want better speaking confidence.",
      interestedTrack: "general",
    },
    tracking: {
      referrer: "https://example.com",
      utmSource: "newsletter",
      utmMedium: "email",
      utmCampaign: "placement",
    },
    retakeCount: 1,
    ...overrides,
  };
}

beforeEach(() => {
  vi.stubEnv(
    "GOOGLE_APPS_SCRIPT_LEADS_ENDPOINT",
    "https://script.google.com/macros/s/live-deployment/exec",
  );
  vi.stubEnv("LEAD_FORM_SHARED_SECRET", "test-secret");
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("submitPlacementResult", () => {
  it("validates WhatsApp-or-Telegram contact details", async () => {
    const result = await submitPlacementResult(
      validSubmission({
        details: {
          ...validSubmission().details,
          whatsapp: "",
          telegram: "",
        },
      }),
    );

    expect(result.status).toBe("validation_error");
    if (result.status === "validation_error") {
      expect(result.fieldErrors.whatsapp).toBeDefined();
      expect(result.fieldErrors.telegram).toBeDefined();
    }
  });

  it("requires consent before submission", async () => {
    const result = await submitPlacementResult(
      validSubmission({
        details: {
          ...validSubmission().details,
          consent: false,
        },
      }),
    );

    expect(result.status).toBe("validation_error");
    if (result.status === "validation_error") {
      expect(result.fieldErrors.consent).toBeDefined();
    }
  });

  it("posts a complete placement-test payload to Apps Script", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ ok: true, leadId: "lead-456" }), {
        headers: { "Content-Type": "application/json" },
        status: 200,
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const result = await submitPlacementResult(validSubmission());

    expect(result.status).toBe("success");
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    const body = JSON.parse(String(init.body)) as Record<string, unknown>;

    expect(body.secret).toBe("test-secret");
    expect(body.submissionType).toBe("placement-test");
    expect(body.fullName).toBe("Mona Hassan");
    expect(body.offerType).toBe("placement-test");
    expect(body.estimatedCefrLevel).toBeDefined();
    expect(body.confidenceLabel).toBeDefined();
    expect(body.vocabularyScore).toBeDefined();
    expect(body.grammarScore).toBeDefined();
    expect(body.readingScore).toBeUndefined();
    expect(body.recommendedFirstLessonsJson).toContain("lesson");
    expect(body.topGrammarGapsJson).toBeTypeOf("string");
    expect(body.topVocabularyGapsJson).toBeTypeOf("string");
    expect(body.retakeCount).toBe(1);
    expect(body.answerSummaryJson).toContain("itemId");
    expect(body.skillBreakdownJson).toContain("vocabulary");
    expect(body.teacherDiagnosticJson).toContain("recommendedFirstLessons");
    expect(body.recommendationTags).toBeTypeOf("string");
  });

  it("returns the result when Apps Script rejects storage", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ ok: false, error: "Invalid shared secret." }), {
        headers: { "Content-Type": "application/json" },
        status: 200,
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const result = await submitPlacementResult(validSubmission());

    expect(result.status).toBe("storage_error");
    if (result.status === "storage_error") {
      expect(result.result.estimatedCefrLevel).toBeDefined();
      expect(result.message).toContain("result is ready");
    }
  });
});
