import { siteConfig } from "@/config/site";
import type { Locale } from "@/i18n/routing";

export function getPersonSchema(locale: Locale, description: string) {
  const sameAs = siteConfig.socialLinks.map((item) => item.href);

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${siteConfig.siteUrl}/#faris-rashad`,
    name: siteConfig.brandName,
    jobTitle: "English Trainer and Communication Mentor",
    description,
    image: new URL(siteConfig.portraitPath, siteConfig.siteUrl).toString(),
    url: new URL(`/${locale}`, siteConfig.siteUrl).toString(),
    knowsLanguage: ["English", "Arabic", "Turkish"],
    nationality: siteConfig.profileSnapshot.originCountry,
    alumniOf: siteConfig.verifiedFacts.degreeInstitution,
    sameAs,
  };
}

export function getProfessionalServiceSchema(
  locale: Locale,
  description: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${siteConfig.siteUrl}/#professional-service`,
    name: siteConfig.brandName,
    description,
    provider: {
      "@type": "Person",
      name: siteConfig.brandName,
    },
    areaServed: "Worldwide",
    availableLanguage: ["English", "Arabic", "Turkish"],
    serviceType: [
      "Spoken English training",
      "Business English",
      "IELTS preparation",
      "Interview preparation",
      "Pronunciation coaching",
      "Communication mentoring",
    ],
    url: new URL(`/${locale}/services`, siteConfig.siteUrl).toString(),
  };
}
