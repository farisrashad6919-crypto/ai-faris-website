import type { Locale } from "@/i18n/routing";

const PREPLY_URL = "https://preply.com/en/tutor/1740346";

export const siteConfig = {
  brandName: "Faris Rashad English Trainer",
  siteUrl: "https://example.com",
  defaultLocale: "en" as Locale,
  portraitPath: "/images/faris-portrait.jpg",
  preplyUrl: PREPLY_URL,
  linkedinUrl: "https://www.linkedin.com/in/faris-rashad-4792b1201/",
  bookingUrl: PREPLY_URL,
  whatsappUrl: null as string | null,
  email: null as string | null,
  instagramUrl: null as string | null,
  youtubeUrl: null as string | null,
  socialLinks: [
    {
      id: "preply",
      label: "Preply",
      href: PREPLY_URL,
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/faris-rashad-4792b1201/",
    },
  ],
  profileSnapshot: {
    sourceDate: "2026-04-18",
    reviewRating: 4.9,
    reviewCount: 62,
    lessonCount: 2704,
    experienceYears: 6,
    countriesReached: 50,
    ieltsBand: 8.5,
    originCountry: "Egypt",
  },
  verifiedFacts: {
    degree: "Bachelor's degree in Education, English Department",
    degreeInstitution: "Al-Azhar University",
    tesolProvider: "Arizona State University",
    cambridgeCredential: "CELTA certified by Cambridge",
    englishLevel: "C2 proficiency in English",
    taughtAgeGroups: ["Adults", "Teens", "Children"],
    specialties: [
      "Spoken English",
      "Business English",
      "IELTS preparation",
      "Interview preparation",
      "Pronunciation coaching",
      "Communication and presentation skills",
    ],
  },
} as const;

export function getBookingHref(locale: Locale) {
  return siteConfig.bookingUrl ?? siteConfig.preplyUrl ?? `/${locale}/contact#inquiry-form`;
}

export function getPrimaryEmail() {
  return siteConfig.email;
}
