import { z } from "zod";

export const inquirySchema = z.object({
  locale: z.enum(["en", "ar", "tr"]),
  name: z.string().trim().min(2).max(80),
  email: z.email().trim().max(120),
  learnerType: z.string().trim().min(2).max(80),
  focusArea: z.string().trim().min(2).max(120),
  goals: z.string().trim().min(10).max(1000),
});

export type InquiryFormValues = z.infer<typeof inquirySchema>;

export type InquiryFieldName = keyof InquiryFormValues;

export type InquiryFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<InquiryFieldName, string>>;
};

export const initialInquiryState: InquiryFormState = {
  status: "idle",
};
