import type { Locale } from "@/i18n/routing";

export type TrackId =
  | "ielts"
  | "business"
  | "general"
  | "teacher-training";

export type TrackSlug =
  | "ielts-test-prep"
  | "business-english"
  | "general-english"
  | "esl-teacher-training";

export type OfferType =
  | "course"
  | "webinar"
  | "training"
  | "placement-test"
  | "updates";

export type ResourceType =
  | "article"
  | "video"
  | "quiz"
  | "placement-test"
  | "tool"
  | "webinar";

export type LocalizedText = Record<Locale, string>;

export type ReviewItem = {
  id: string;
  trackIds: TrackId[];
  screenshot: string;
  reviewer: string;
  country?: string;
  date: string;
  transcription: string;
  localizedExcerpt: LocalizedText;
  highlight: string;
};

export type ProofMediaItem = {
  id: string;
  trackIds: TrackId[];
  src: string;
  alt: string;
  caption: string;
};

export type FutureItem = {
  title: string;
  description: string;
  type: ResourceType;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type TrackContent = {
  id: TrackId;
  slug: TrackSlug;
  title: LocalizedText;
  shortTitle: LocalizedText;
  eyebrow: LocalizedText;
  description: LocalizedText;
  audience: string[];
  painPoints: string[];
  whyItMatters: string;
  howIHelp: string[];
  curriculum: string[];
  notFor: string[];
  primaryCta: LocalizedText;
  secondaryCta: LocalizedText;
  tertiaryCta: LocalizedText;
  future: FutureItem[];
  faq: FaqItem[];
  ogImage: string;
  seo: {
    title: LocalizedText;
    description: LocalizedText;
    keywords: string[];
  };
};

export type RouteKey =
  | "home"
  | "about"
  | "programs"
  | "reviews"
  | "resources"
  | "webinars"
  | "faq"
  | "contact"
  | "thankYou"
  | TrackId;
