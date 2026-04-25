import { CheckCircle2 } from "lucide-react";

import { PageHero } from "@/components/sections/page-hero";
import { SectionShell } from "@/components/sections/section-shell";
import { ButtonLink } from "@/components/ui/button-link";
import { Reveal } from "@/components/ui/reveal";
import { getBookingHref } from "@/config/site";
import { copy } from "@/content/locale-copy";
import type { Locale } from "@/i18n/routing";

export function ThankYouPage({ locale }: { locale: Locale }) {
  const t = (value: string) => copy(locale, value);

  return (
    <>
      <PageHero
        actions={
          <>
            <ButtonLink href={getBookingHref(locale)}>{t("Book on Preply")}</ButtonLink>
            <ButtonLink href="/resources" variant="secondary">
              {t("Explore free resources")}
            </ButtonLink>
          </>
        }
        aside={
          <div className="space-y-4">
            <CheckCircle2 className="size-8 text-on-tertiary-container" />
            <h2 className="text-2xl">{t("Inquiry received")}</h2>
            <p className="muted-copy text-sm leading-6">
              {t("If you are ready to start faster, Preply is still the best direct booking path.")}
            </p>
          </div>
        }
        description={t("Thank you for registering your interest. Your selected track, offer type, and goal help shape the right next step.")}
        eyebrow={t("Thank you")}
        title={t("Your next step is clearer now")}
      />

      <SectionShell
        className="bg-surface-container-low/65"
        eyebrow={t("What happens next")}
        title={t("A simple follow-up flow")}
      >
        <div className="grid gap-4 md:grid-cols-3">
          {[
            "Your inquiry is reviewed with your selected track, offer type, goal, and contact details.",
            "You can be guided toward a Preply trial, free webinar, placement test, training session, or updates.",
            "You can keep exploring programs, reviews, and resources while the next training opportunities are prepared.",
          ].map((item, index) => (
            <Reveal className="paper-panel rounded-md p-6" delay={index * 0.05} key={item}>
              <p className="eyebrow">0{index + 1}</p>
              <p className="mt-4 text-base leading-7 text-primary">{t(item)}</p>
            </Reveal>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-4">
          <ButtonLink href="/programs">{t("Choose another track")}</ButtonLink>
          <ButtonLink href="/webinars" variant="secondary">
            {t("Webinar next steps")}
          </ButtonLink>
        </div>
      </SectionShell>
    </>
  );
}
