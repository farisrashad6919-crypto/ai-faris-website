"use server";

import { leadSchema, type InquiryFormState } from "@/lib/contact";
import { deliverLead } from "@/lib/lead-delivery";
import { getMessageValue, loadMessages } from "@/lib/messages";
import { isValidLocale, type Locale } from "@/i18n/routing";

type LeadFormMessages = {
  success: string;
  error: string;
  validation: {
    fullName: string;
    age: string;
    nationality: string;
    contact: string;
    track: string;
    offerType: string;
    preferredLanguage: string;
    consent: string;
  };
};

function stringValue(formData: FormData, key: string) {
  return String(formData.get(key) ?? "");
}

export async function submitInquiry(
  _previousState: InquiryFormState,
  formData: FormData,
): Promise<InquiryFormState> {
  const localeCandidate = stringValue(formData, "locale");
  const locale: Locale = isValidLocale(localeCandidate) ? localeCandidate : "en";
  const messages = await loadMessages(locale);
  const formMessages = getMessageValue<LeadFormMessages>(messages, "LeadForm");

  const parsed = leadSchema.safeParse({
    locale,
    sourcePage: stringValue(formData, "sourcePage"),
    fullName: stringValue(formData, "fullName"),
    age: stringValue(formData, "age"),
    nationality: stringValue(formData, "nationality"),
    whatsapp: stringValue(formData, "whatsapp"),
    telegram: stringValue(formData, "telegram"),
    email: stringValue(formData, "email"),
    track: stringValue(formData, "track"),
    offerType: stringValue(formData, "offerType"),
    preferredLanguage: stringValue(formData, "preferredLanguage"),
    currentLevel: stringValue(formData, "currentLevel"),
    goal: stringValue(formData, "goal"),
    consent: stringValue(formData, "consent"),
    utmSource: stringValue(formData, "utmSource"),
    utmMedium: stringValue(formData, "utmMedium"),
    utmCampaign: stringValue(formData, "utmCampaign"),
    referrer: stringValue(formData, "referrer"),
    website: stringValue(formData, "website"),
  });

  if (!parsed.success) {
    const flattened = parsed.error.flatten().fieldErrors;
    const missingContact =
      stringValue(formData, "whatsapp").trim().length === 0 &&
      stringValue(formData, "telegram").trim().length === 0;

    return {
      status: "error",
      message: formMessages.error,
      fieldErrors: {
        fullName: flattened.fullName?.[0] ? formMessages.validation.fullName : undefined,
        age: flattened.age?.[0] ? formMessages.validation.age : undefined,
        nationality: flattened.nationality?.[0] ? formMessages.validation.nationality : undefined,
        whatsapp:
          missingContact || flattened.whatsapp?.[0] || flattened.telegram?.[0]
            ? formMessages.validation.contact
            : undefined,
        telegram:
          missingContact || flattened.whatsapp?.[0] || flattened.telegram?.[0]
            ? formMessages.validation.contact
            : undefined,
        email: flattened.email?.[0] ? "Please enter a valid email address." : undefined,
        track: flattened.track?.[0] ? formMessages.validation.track : undefined,
        offerType: flattened.offerType?.[0]
          ? formMessages.validation.offerType
          : undefined,
        preferredLanguage: flattened.preferredLanguage?.[0]
          ? formMessages.validation.preferredLanguage
          : undefined,
        consent: flattened.consent?.[0] ? formMessages.validation.consent : undefined,
      },
    };
  }

  try {
    await deliverLead({
      timestamp: new Date().toISOString(),
      ...parsed.data,
    });
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      message: formMessages.error,
    };
  }

  return {
    status: "success",
    message: formMessages.success,
  };
}
