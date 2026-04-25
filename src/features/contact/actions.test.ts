import { afterEach, describe, expect, it, vi } from "vitest";

import { initialInquiryState } from "@/lib/contact";

import { submitInquiry } from "./actions";

afterEach(() => {
  vi.restoreAllMocks();
});

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

    const formData = new FormData();
    formData.set("locale", "tr");
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

    const result = await submitInquiry(initialInquiryState, formData);

    expect(result.status).toBe("success");
    expect(result.message).toContain("Talebiniz");
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
