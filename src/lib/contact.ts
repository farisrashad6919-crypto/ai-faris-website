import { z } from "zod";

import { locales } from "@/i18n/routing";

export const trackOptions = [
  "ielts",
  "business",
  "general",
  "teacher-training",
] as const;

export const offerTypeOptions = [
  "course",
  "webinar",
  "training",
  "placement-test",
  "updates",
] as const;

const optionalEmail = z
  .string()
  .trim()
  .max(120)
  .optional()
  .transform((value) => value ?? "")
  .refine((value) => value === "" || z.email().safeParse(value).success, {
    message: "Invalid email",
  });

export const leadSchema = z
  .object({
    locale: z.enum(locales),
    sourcePage: z.string().trim().min(1).max(220),
    fullName: z.string().trim().min(2).max(100),
    age: z.coerce.number().int().min(7).max(100),
    nationality: z.string().trim().min(2).max(80),
    whatsapp: z.string().trim().max(60).optional().default(""),
    telegram: z.string().trim().max(80).optional().default(""),
    email: optionalEmail,
    track: z.enum(trackOptions),
    offerType: z.enum(offerTypeOptions),
    preferredLanguage: z.enum(locales),
    currentLevel: z.string().trim().max(80).optional().default(""),
    goal: z.string().trim().max(1000).optional().default(""),
    consent: z.literal("on"),
    utmSource: z.string().trim().max(120).optional().default(""),
    utmMedium: z.string().trim().max(120).optional().default(""),
    utmCampaign: z.string().trim().max(120).optional().default(""),
    referrer: z.string().trim().max(500).optional().default(""),
    website: z.string().trim().max(0).optional().default(""),
  })
  .refine((values) => values.whatsapp.length > 0 || values.telegram.length > 0, {
    path: ["whatsapp"],
  });

export type LeadFormValues = z.infer<typeof leadSchema>;

export type InquiryFieldName =
  | "fullName"
  | "age"
  | "nationality"
  | "whatsapp"
  | "telegram"
  | "email"
  | "track"
  | "offerType"
  | "preferredLanguage"
  | "consent";

export type InquiryFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<InquiryFieldName, string>>;
};

export const initialInquiryState: InquiryFormState = {
  status: "idle",
};
