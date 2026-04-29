import { siteConfig } from "@/config/site";
import type { Locale } from "@/i18n/routing";

import { tracks } from "./tracks";
import type { RouteKey } from "./types";

export type SiteRoute = {
  key: RouteKey;
  path: string;
  nav?: boolean;
  footer?: boolean;
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
};

export const staticRoutes: SiteRoute[] = [
  {
    key: "home",
    path: "/",
    nav: true,
    footer: true,
    title: "Faris Rashad English Trainer | Premium English Training",
    description:
      "A multilingual personal-brand website for IELTS, Business English, General English, and ESL teacher training with Faris Rashad.",
    keywords: ["Faris Rashad", "English trainer", "IELTS", "Business English"],
  },
  {
    key: "about",
    path: "/about",
    nav: true,
    footer: true,
    title: "About Faris Rashad | English Trainer and Teacher Trainer",
    description:
      "Learn Faris Rashad's story, teaching mission, method, teacher trainer background, and international teaching dimension.",
    keywords: ["about Faris Rashad", "English teacher trainer", "English coach"],
  },
  {
    key: "programs",
    path: "/programs",
    nav: true,
    footer: true,
    title: "Programs | IELTS, Business English, General English, Teacher Training",
    description:
      "Choose the right English training path: IELTS, Business English, General English, or ESL teacher training.",
    keywords: ["English programs", "IELTS prep", "Business English", "General English"],
  },
  {
    key: "reviews",
    path: "/reviews",
    nav: true,
    footer: true,
    title: "Reviews and Results | Faris Rashad English Trainer",
    description:
      "Real learner feedback from IELTS, Business English, General English, and teacher training goals.",
    keywords: ["English tutor reviews", "IELTS reviews", "Business English reviews"],
  },
  {
    key: "resources",
    path: "/resources",
    nav: true,
    footer: true,
    title: "Free Resources | English Tests, Quizzes, Videos, Articles, Tools",
    description:
      "A focused library for placement tests, quizzes, videos, articles, learning tools, and webinar replays.",
    keywords: ["English resources", "IELTS quizzes", "placement tests", "English videos"],
  },
  {
    key: "placementTest",
    path: "/placement-test",
    footer: true,
    title: "English Tense Mastery Test | Faris Rashad",
    description:
      "Take a focused English tense diagnostic that checks how accurately you use English tenses in real situations.",
    keywords: [
      "English tense test",
      "English grammar tense test",
      "English tense diagnostic",
      "English tenses level check",
    ],
  },
  {
    key: "webinars",
    path: "/webinars",
    nav: true,
    footer: true,
    title: "Webinars and Free Training | Faris Rashad English Trainer",
    description:
      "Upcoming and future free webinars for IELTS, Business English, General English, and teacher development.",
    keywords: ["English webinar", "IELTS webinar", "teacher development webinar"],
  },
  {
    key: "faq",
    path: "/faq",
    footer: true,
    title: "FAQ | English Training with Faris Rashad",
    description:
      "Answers about booking on Preply, contact options, IELTS, Business English, General English, teacher training, and resources.",
    keywords: ["English training FAQ", "Preply booking", "Faris Rashad FAQ"],
  },
  {
    key: "contact",
    path: "/contact",
    nav: true,
    footer: true,
    title: "Contact and Book on Preply | Faris Rashad English Trainer",
    description:
      "Send a course, webinar, training, or placement-test inquiry, or book Faris Rashad directly on Preply.",
    keywords: ["contact Faris Rashad", "book English trial", "Preply English trainer"],
  },
  {
    key: "thankYou",
    path: "/thank-you",
    title: "Thank You | Faris Rashad English Trainer",
    description:
      "Your inquiry has been received. Book on Preply, explore resources, or watch for webinar next steps.",
    keywords: ["English inquiry thank you", "Preply booking"],
  },
];

export const trackRoutes: SiteRoute[] = tracks.map((track) => ({
  key: track.id,
  path: `/programs/${track.slug}`,
  footer: true,
  title: track.seo.title.en,
  description: track.seo.description.en,
  keywords: track.seo.keywords,
  ogImage: track.ogImage,
}));

export const siteRoutes = [...staticRoutes, ...trackRoutes] as const;

export function getRouteByKey(key: RouteKey) {
  const route = siteRoutes.find((item) => item.key === key);

  if (!route) {
    throw new Error(`Unknown route key: ${key}`);
  }

  return route;
}

export function getRouteByPath(path: string) {
  return siteRoutes.find((item) => item.path === path);
}

export function localizeRoute(locale: Locale, path: string) {
  return new URL(`/${locale}${path === "/" ? "" : path}`, siteConfig.siteUrl).toString();
}
