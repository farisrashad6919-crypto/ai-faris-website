import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { initialInquiryState } from "@/lib/contact";

import { submitInquiry } from "./actions";

beforeEach(() => {
  vi.stubEnv("GOOGLE_APPS_SCRIPT_LEADS_ENDPOINT", "");
  vi.stubEnv("LEAD_FORM_SHARED_SECRET", "");
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

function validFormData() {
  const formData = new FormData();
  formData.set("locale", "en");
  formData.set("sourcePage", "/programs/business-english");
  formData.set("fullName", "Aylin Kaya");
  formData.set("age", "29");
  formData.set("nationality", "Turkish");
  formData.set("telegram", "@aylin");
  formData.set("email", "aylin@example.com");
  formData.set("track", "business");
  formData.set("offerType", "course");
  formData.set("preferredLanguage", "tr");
  formData.set("currentLevel", "Intermediate");
  formData.set(
    "goal",
    "I want to speak more clearly in meetings and prepare for interviews.",
  );
  formData.set("consent", "on");
  formData.set("utmSource", "newsletter");
  formData.set("utmMedium", "email");
  formData.set("utmCampaign", "spring");
  formData.set("referrer", "https://example.com/start");
  formData.set("website", "");

  return formData;
}

describe("submitInquiry", () => {
  it("returns field errors for incomplete data", async () => {
    const formData = new FormData();
    formData.set("locale", "en");
    formData.set("sourcePage", "/contact");
    formData.set("fullName", "");
    formData.set("age", "");
    formData.set("nationality", "");
    formData.set("whatsapp", "");
    formData.set("telegram", "");
    formData.set("email", "not-an-email");
    formData.set("track", "");
    formData.set("offerType", "");
    formData.set("preferredLanguage", "");

    const result = await submitInquiry(initialInquiryState, formData);

    expect(result.status).toBe("error");
    expect(result.fieldErrors?.fullName).toBeDefined();
    expect(result.fieldErrors?.age).toBeDefined();
    expect(result.fieldErrors?.nationality).toBeDefined();
    expect(result.fieldErrors?.whatsapp).toBeDefined();
    expect(result.fieldErrors?.telegram).toBeDefined();
    expect(result.fieldErrors?.email).toBeDefined();
    expect(result.fieldErrors?.track).toBeDefined();
    expect(result.fieldErrors?.offerType).toBeDefined();
    expect(result.fieldErrors?.preferredLanguage).toBeDefined();
    expect(result.fieldErrors?.consent).toBeDefined();
  });

  it("returns a success state for valid data", async () => {
    vi.spyOn(console, "info").mockImplementation(() => {});

    const result = await submitInquiry(initialInquiryState, validFormData());

    expect(result.status).toBe("success");
    expect(result.message).toContain("Your inquiry");
  });

  it("posts valid leads to the configured Apps Script endpoint with the shared secret", async () => {
    vi.stubEnv(
      "GOOGLE_APPS_SCRIPT_LEADS_ENDPOINT",
      "https://script.google.com/macros/s/live-deployment/exec",
    );
    vi.stubEnv("LEAD_FORM_SHARED_SECRET", "test-secret");

    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ ok: true, leadId: "lead-123" }), {
        headers: { "Content-Type": "application/json" },
        status: 200,
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const result = await submitInquiry(initialInquiryState, validFormData());

    expect(result.status).toBe("success");
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    const body = JSON.parse(String(init.body)) as Record<string, unknown>;

    expect(url).toBe("https://script.google.com/macros/s/live-deployment/exec");
    expect(init.method).toBe("POST");
    expect(init.headers).toMatchObject({
      Accept: "application/json",
      "Content-Type": "application/json",
    });
    expect(body.secret).toBe("test-secret");
    expect(body.sourcePage).toBe("/programs/business-english");
    expect(body.locale).toBe("en");
    expect(body.track).toBe("business");
    expect(body.offerType).toBe("course");
    expect(body.whatsapp).toBe("");
    expect(body.telegram).toBe("@aylin");
    expect(body.email).toBe("aylin@example.com");
    expect(body.utmSource).toBe("newsletter");
    expect(body.utmMedium).toBe("email");
    expect(body.utmCampaign).toBe("spring");
    expect(body.referrer).toBe("https://example.com/start");
    expect(body.website).toBe("");
  });

  it("returns an error when Apps Script rejects the lead", async () => {
    vi.stubEnv(
      "GOOGLE_APPS_SCRIPT_LEADS_ENDPOINT",
      "https://script.google.com/macros/s/live-deployment/exec",
    );
    vi.stubEnv("LEAD_FORM_SHARED_SECRET", "wrong-secret");
    vi.spyOn(console, "error").mockImplementation(() => {});

    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ ok: false, error: "Invalid shared secret." }), {
        headers: { "Content-Type": "application/json" },
        status: 200,
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const result = await submitInquiry(initialInquiryState, validFormData());

    expect(result.status).toBe("error");
  });

  it("allows course leads without email when WhatsApp is provided", async () => {
    vi.spyOn(console, "info").mockImplementation(() => {});

    const formData = new FormData();
    formData.set("locale", "en");
    formData.set("sourcePage", "/programs/general-english");
    formData.set("fullName", "Mona Hassan");
    formData.set("age", "24");
    formData.set("nationality", "Egyptian");
    formData.set("whatsapp", "+201000000000");
    formData.set("track", "general");
    formData.set("offerType", "course");
    formData.set("preferredLanguage", "en");
    formData.set("consent", "on");

    const result = await submitInquiry(initialInquiryState, formData);

    expect(result.status).toBe("success");
  });
});
