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
    formData.set("name", "");
    formData.set("email", "not-an-email");
    formData.set("learnerType", "");
    formData.set("focusArea", "");
    formData.set("goals", "short");

    const result = await submitInquiry(initialInquiryState, formData);

    expect(result.status).toBe("error");
    expect(result.fieldErrors?.name).toBeDefined();
    expect(result.fieldErrors?.email).toBeDefined();
    expect(result.fieldErrors?.goals).toBeDefined();
  });

  it("returns a success state for valid data", async () => {
    vi.spyOn(console, "info").mockImplementation(() => {});

    const formData = new FormData();
    formData.set("locale", "tr");
    formData.set("name", "Aylin Kaya");
    formData.set("email", "aylin@example.com");
    formData.set("learnerType", "professional");
    formData.set("focusArea", "business-english");
    formData.set(
      "goals",
      "I want to speak more clearly in meetings and prepare for interviews.",
    );

    const result = await submitInquiry(initialInquiryState, formData);

    expect(result.status).toBe("success");
    expect(result.message).toContain("Başvurunuz");
  });
});
