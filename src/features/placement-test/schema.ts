import { z } from "zod";

import { trackOptions } from "@/lib/contact";
import { locales } from "@/i18n/routing";

export const placementAnswerSchema = z.object({
  itemId: z.string().trim().min(1),
  selectedOptionIds: z.array(z.string().trim().min(1)).min(1).max(4),
  stage: z.coerce.number().int().min(1).max(3),
  answeredAt: z.string().trim().min(1),
  elapsedSeconds: z.coerce.number().min(0).max(3600),
});

const optionalEmail = z
  .string()
  .trim()
  .max(120)
  .optional()
  .transform((value) => value ?? "")
  .refine((value) => value === "" || z.email().safeParse(value).success, {
    message: "Invalid email",
  });

export const placementSubmissionSchema = z
  .object({
    sessionId: z.string().trim().min(8).max(80),
    locale: z.enum(locales),
    sourcePage: z.string().trim().min(1).max(220),
    startedAt: z.string().trim().min(1),
    completedAt: z.string().trim().min(1),
    completionTimeSeconds: z.coerce.number().min(1).max(3600),
    answers: z.array(placementAnswerSchema).min(30).max(30),
    details: z.object({
      fullName: z.string().trim().min(2).max(100),
      age: z.coerce.number().int().min(7).max(100),
      nationality: z.string().trim().min(2).max(80),
      whatsapp: z.string().trim().max(60).optional().default(""),
      telegram: z.string().trim().max(80).optional().default(""),
      email: optionalEmail,
      preferredLanguage: z.enum(locales),
      consent: z.literal(true),
      learningGoal: z.string().trim().max(1000).optional().default(""),
      interestedTrack: z.union([z.enum(trackOptions), z.literal("")]),
    }),
    tracking: z.object({
      referrer: z.string().trim().max(500).optional().default(""),
      utmSource: z.string().trim().max(120).optional().default(""),
      utmMedium: z.string().trim().max(120).optional().default(""),
      utmCampaign: z.string().trim().max(120).optional().default(""),
    }),
    retakeCount: z.coerce.number().int().min(0).max(50).optional().default(0),
  })
  .refine(
    (values) =>
      values.details.whatsapp.trim().length > 0 ||
      values.details.telegram.trim().length > 0,
    {
      path: ["details", "whatsapp"],
      message: "WhatsApp or Telegram is required.",
    },
  );

export type PlacementSubmissionValues = z.infer<typeof placementSubmissionSchema>;

export const placementAnonymousScoreSchema = z.object({
  sessionId: z.string().trim().min(8).max(80),
  locale: z.enum(locales),
  sourcePage: z.string().trim().min(1).max(220),
  startedAt: z.string().trim().min(1),
  completedAt: z.string().trim().min(1),
  completionTimeSeconds: z.coerce.number().min(1).max(3600),
  answers: z.array(placementAnswerSchema).min(30).max(30),
  interestedTrack: z.union([z.enum(trackOptions), z.literal("")]).optional().default(""),
  learningGoal: z.string().trim().max(1000).optional().default(""),
  retakeCount: z.coerce.number().int().min(0).max(50).optional().default(0),
});

export type PlacementAnonymousScoreValues = z.infer<
  typeof placementAnonymousScoreSchema
>;
