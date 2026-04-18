"use server";

import { inquirySchema, type InquiryFormState } from "@/lib/contact";
import { getMessageValue, loadMessages } from "@/lib/messages";

type ContactFormMessages = {
  validation: {
    summary: string;
    name: string;
    email: string;
    learnerType: string;
    focusArea: string;
    goals: string;
  };
  successMessage: string;
};

async function deliverInquiry(values: Record<string, string>) {
  console.info("Inquiry received", values);
}

export async function submitInquiry(
  _previousState: InquiryFormState,
  formData: FormData,
): Promise<InquiryFormState> {
  const locale = String(formData.get("locale") ?? "en");
  const safeLocale = locale === "ar" || locale === "tr" ? locale : "en";
  const messages = await loadMessages(safeLocale);
  const formMessages = getMessageValue<ContactFormMessages>(
    messages,
    "Contact.form",
  );

  const parsed = inquirySchema.safeParse({
    locale: safeLocale,
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    learnerType: String(formData.get("learnerType") ?? ""),
    focusArea: String(formData.get("focusArea") ?? ""),
    goals: String(formData.get("goals") ?? ""),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: formMessages.validation.summary,
      fieldErrors: {
        name: parsed.error.flatten().fieldErrors.name?.[0]
          ? formMessages.validation.name
          : undefined,
        email: parsed.error.flatten().fieldErrors.email?.[0]
          ? formMessages.validation.email
          : undefined,
        learnerType: parsed.error.flatten().fieldErrors.learnerType?.[0]
          ? formMessages.validation.learnerType
          : undefined,
        focusArea: parsed.error.flatten().fieldErrors.focusArea?.[0]
          ? formMessages.validation.focusArea
          : undefined,
        goals: parsed.error.flatten().fieldErrors.goals?.[0]
          ? formMessages.validation.goals
          : undefined,
      },
    };
  }

  await deliverInquiry(parsed.data);

  return {
    status: "success",
    message: formMessages.successMessage,
  };
}
