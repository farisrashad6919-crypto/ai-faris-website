import { MessageCircle, Send, UserRound } from "lucide-react";

import { ContactForm } from "@/components/contact/contact-form";
import { PageHero } from "@/components/sections/page-hero";
import { SectionShell } from "@/components/sections/section-shell";
import { ButtonLink } from "@/components/ui/button-link";
import { Reveal } from "@/components/ui/reveal";
import { getBookingHref, siteConfig } from "@/config/site";
import { copy } from "@/content/locale-copy";
import type { Locale } from "@/i18n/routing";

export function ContactPage({ locale }: { locale: Locale }) {
  const t = (value: string) => copy(locale, value);

  return (
    <>
      <PageHero
        actions={
          <>
            <ButtonLink href={getBookingHref(locale)}>{t("Book on Preply")}</ButtonLink>
            <ButtonLink href="#inquiry-form" variant="secondary">
              {t("Send an inquiry")}
            </ButtonLink>
          </>
        }
        aside={
          <div className="space-y-4">
            <h2 className="text-2xl">{t("Lead form supports")}</h2>
            <ul className="grid gap-3 text-sm leading-6 text-secondary">
              <li>{t("Courses and private training")}</li>
              <li>{t("Free webinars and future events")}</li>
              <li>{t("Placement tests and updates")}</li>
              <li>{t("UTM, referrer, and source-page tracking")}</li>
            </ul>
          </div>
        }
        description={t("Book directly on Preply or register your interest for a course, webinar, training session, placement test, or future update.")}
        eyebrow={t("Contact and booking")}
        title={t("Start with the cleanest next step")}
      />

      <SectionShell
        description={t("Full name, age, nationality, track, offer type, preferred language, and consent are required. WhatsApp or Telegram is enough for contact.")}
        eyebrow={t("Inquiry form")}
        id="inquiry-form"
        title={t("Tell me what you want to improve")}
      >
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.05fr)_minmax(18rem,0.95fr)]">
          <ContactForm locale={locale} sourcePage="/contact" />
          <div className="grid gap-4">
            {[
              {
                icon: UserRound,
                title: "Book on Preply",
                description: "The main booking destination and fastest way to start.",
                href: getBookingHref(locale),
                external: true,
              },
              {
                icon: MessageCircle,
                title: "Use the form",
                description: "Best for webinars, placement tests, training interest, and future updates.",
                href: "#inquiry-form",
                external: false,
              },
              {
                icon: Send,
                title: "Follow the proof",
                description: "Explore real reviews and clean class media before deciding.",
                href: "/reviews",
                external: false,
              },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <Reveal className="paper-panel rounded-md p-6" delay={index * 0.05} key={item.title}>
                  <Icon className="size-6 text-on-tertiary-container" />
                  <h2 className="mt-4 text-2xl">{t(item.title)}</h2>
                  <p className="muted-copy mt-3 text-sm leading-6">
                    {t(item.description)}
                  </p>
                  <ButtonLink className="mt-4" external={item.external && item.href === siteConfig.preplyUrl} href={item.href} variant="tertiary">
                    {t("Open")}
                  </ButtonLink>
                </Reveal>
              );
            })}
          </div>
        </div>
      </SectionShell>
    </>
  );
}
