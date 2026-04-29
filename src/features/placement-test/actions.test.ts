import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { placementItemBank } from "./item-bank";
import { scorePlacementResult, submitPlacementResult } from "./actions";
import type { PlacementItem, PlacementResultSubmission } from "./types";

const selectedItems = [
  ...placementItemBank.filter((item) => item.difficultyBand !== "advanced").slice(0, 22),
  ...placementItemBank.filter((item) => item.difficultyBand === "advanced").slice(0, 8),
];

function correctIds(item: PlacementItem) {
  return [item.correctAnswerId];
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
      stage: index < 8 ? 1 : index < 20 ? 2 : 3,
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
  it("scores a completed test without collecting personal details", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const result = await scorePlacementResult({
      sessionId: "test-session-123",
      locale: "en",
      sourcePage: "/placement-test",
      startedAt: "2026-04-27T10:00:00.000Z",
      completedAt: "2026-04-27T10:15:00.000Z",
      completionTimeSeconds: 900,
      answers: validSubmission().answers,
      interestedTrack: "general",
      learningGoal: "I want better grammar accuracy.",
      retakeCount: 1,
    });

    expect(result.status).toBe("success");
    if (result.status === "success") {
      expect(result.result.masteryLabel).toBeDefined();
      expect(result.result.recommendedFirstLessons).toHaveLength(3);
      expect(result.leadId).toBeUndefined();
    }
    expect(fetchMock).not.toHaveBeenCalled();
  });

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
    expect(body.submissionType).toBe("tense-test");
    expect(body.fullName).toBe("Mona Hassan");
    expect(body.offerType).toBe("tense-test");
    expect(body.masteryLabel).toBeDefined();
    expect(body.confidenceLabel).toBeDefined();
    expect(body.overallTenseScore).toBeDefined();
    expect(body.presentScore).toBeDefined();
    expect(body.futureScore).toBeDefined();
    expect(JSON.parse(String(body.recommendedFirstLessonsJson))).toHaveLength(3);
    expect(body.topTenseWeaknessesJson).toBeTypeOf("string");
    expect(body.retakeCount).toBe(1);
    expect(body.answerSummaryJson).toContain("itemId");
    expect(body.areaBreakdownJson).toContain("present-tense-control");
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
      expect(result.result.masteryLabel).toBeDefined();
      expect(result.message).toContain("result is ready");
    }
  });
});
