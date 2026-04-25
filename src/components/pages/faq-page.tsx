import { PageHero } from "@/components/sections/page-hero";
import { SectionShell } from "@/components/sections/section-shell";
import { ButtonLink } from "@/components/ui/button-link";
import { getBookingHref } from "@/config/site";
import { copy } from "@/content/locale-copy";
import { tracks } from "@/content/tracks";
import type { Locale } from "@/i18n/routing";

export function FaqPage({ locale }: { locale: Locale }) {
  const t = (value: string) => copy(locale, value);
  const generalFaq = [
    {
      question: "Where should I book a lesson?",
      answer:
        "Preply remains the main booking destination and the fastest way to book a focused first session.",
    },
    {
      question: "What can I use the lead form for?",
      answer:
        "Use it for courses, webinars, training sessions, placement tests, and updates about a specific track.",
    },
    {
      question: "Is email required?",
      answer:
        "Email is optional for course leads and recommended for webinars. WhatsApp or Telegram is required so there is at least one contact path.",
    },
    {
      question: "Are class screenshots public-safe?",
      answer:
        "Yes. Students can remain visible with consent, and the meeting visuals are kept clean and professional for public use.",
    },
  ];

  return (
    <>
      <PageHero
        actions={
          <>
            <ButtonLink href={getBookingHref(locale)}>{t("Book on Preply")}</ButtonLink>
            <ButtonLink href="/contact" variant="secondary">
              {t("Send an inquiry")}
            </ButtonLink>
          </>
        }
        description={t("Answers about booking, lead capture, privacy-safe proof media, and the four English training tracks.")}
        eyebrow={t("FAQ")}
        title={t("Questions before you choose a track")}
      />

      <SectionShell
        className="bg-surface-container-low/65"
        eyebrow={t("General")}
        title={t("Booking, contact, and privacy")}
      >
        <div className="grid gap-4">
          {generalFaq.map((item) => (
            <details className="paper-panel rounded-md p-5" key={item.question}>
              <summary className="font-semibold text-primary">{t(item.question)}</summary>
              <p className="muted-copy mt-3 text-base leading-7">{t(item.answer)}</p>
            </details>
          ))}
        </div>
      </SectionShell>

      {tracks.map((track) => (
        <SectionShell
          className="border-t ghost-divider"
          description={copy(locale, track.description)}
          eyebrow={copy(locale, track.eyebrow)}
          key={track.id}
          title={copy(locale, track.title)}
        >
          <div className="grid gap-4">
            {track.faq.map((item) => (
              <details className="paper-panel rounded-md p-5" key={item.question}>
                <summary className="font-semibold text-primary">{t(item.question)}</summary>
                <p className="muted-copy mt-3 text-base leading-7">{t(item.answer)}</p>
              </details>
            ))}
          </div>
        </SectionShell>
      ))}
    </>
  );
}
