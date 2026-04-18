import { Mail, MessageCircle, Send, UserRound } from "lucide-react";
import { getMessages } from "next-intl/server";

import { ContactForm } from "@/components/contact/contact-form";
import { ButtonLink } from "@/components/ui/button-link";
import { PageHero } from "@/components/sections/page-hero";
import { Reveal } from "@/components/ui/reveal";
import { SectionShell } from "@/components/sections/section-shell";
import { getBookingHref, siteConfig } from "@/config/site";
import type { Locale } from "@/i18n/routing";
import { getMessageValue } from "@/lib/messages";

type ContactContent = {
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
    asideTitle: string;
    asideItems: string[];
  };
  channels: {
    eyebrow: string;
    title: string;
    description: string;
    openCta: string;
    items: Array<{ title: string; description: string }>;
  };
  expectations: {
    eyebrow: string;
    title: string;
    description: string;
    items: Array<{ title: string; description: string }>;
  };
  form: {
    learnerTypeOptions: Array<{ value: string; label: string }>;
    focusAreaOptions: Array<{ value: string; label: string }>;
  };
};

export async function ContactPage({ locale }: { locale: Locale }) {
  const messages = await getMessages();
  const contact = getMessageValue<ContactContent>(messages, "Contact");

  const directLinks = [
    {
      id: "booking",
      icon: UserRound,
      label: contact.channels.items[0]?.title,
      description: contact.channels.items[0]?.description,
      href: getBookingHref(locale),
      external: Boolean(siteConfig.bookingUrl),
    },
    siteConfig.whatsappUrl
      ? {
          id: "whatsapp",
          icon: MessageCircle,
          label: contact.channels.items[1]?.title,
          description: contact.channels.items[1]?.description,
          href: siteConfig.whatsappUrl,
          external: true,
        }
      : null,
    siteConfig.email
      ? {
          id: "email",
          icon: Mail,
          label: contact.channels.items[2]?.title,
          description: contact.channels.items[2]?.description,
          href: `mailto:${siteConfig.email}`,
          external: true,
        }
      : null,
    {
      id: "preply",
      icon: Send,
      label: "Preply",
      description: siteConfig.preplyUrl,
      href: siteConfig.preplyUrl,
      external: true,
    },
  ].filter(Boolean) as Array<{
    id: string;
    icon: typeof UserRound;
    label: string;
    description: string;
    href: string;
    external: boolean;
  }>;

  return (
    <>
      <PageHero
        actions={
          <>
            <ButtonLink href={getBookingHref(locale)}>
              {contact.hero.primaryCta}
            </ButtonLink>
            <ButtonLink href="/services" variant="secondary">
              {contact.hero.secondaryCta}
            </ButtonLink>
          </>
        }
        aside={
          <div className="space-y-4">
            <h2 className="text-2xl">{contact.hero.asideTitle}</h2>
            <ul className="grid gap-3 text-sm leading-6 text-secondary">
              {contact.hero.asideItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        }
        description={contact.hero.description}
        eyebrow={contact.hero.eyebrow}
        title={contact.hero.title}
      />

      <SectionShell
        description={contact.channels.description}
        eyebrow={contact.channels.eyebrow}
        id="inquiry-form"
        title={contact.channels.title}
      >
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.05fr)_minmax(18rem,0.95fr)]">
          <ContactForm
            focusAreaOptions={contact.form.focusAreaOptions}
            learnerTypeOptions={contact.form.learnerTypeOptions}
            locale={locale}
          />
          <div className="grid gap-4">
            {directLinks.map((item, index) => {
              const Icon = item.icon;

              return (
                <Reveal className="paper-panel rounded-md p-6" delay={index * 0.05} key={item.id}>
                  <div className="flex items-start gap-4">
                    <div className="rounded-sm bg-tertiary-fixed/55 p-2 text-tertiary">
                      <Icon className="size-5" />
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-2xl">{item.label}</h3>
                      <p className="muted-copy text-sm leading-6">
                        {item.description}
                      </p>
                      <ButtonLink
                        external={item.external}
                        href={item.href}
                        variant="tertiary"
                      >
                        {contact.channels.openCta}
                      </ButtonLink>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </SectionShell>

      <SectionShell
        className="section-space-sm bg-surface-container-low/65"
        description={contact.expectations.description}
        eyebrow={contact.expectations.eyebrow}
        title={contact.expectations.title}
      >
        <div className="grid gap-4 md:grid-cols-3">
          {contact.expectations.items.map((item, index) => (
            <Reveal className="paper-panel rounded-md p-6" delay={index * 0.05} key={item.title}>
              <h3 className="text-2xl">{item.title}</h3>
              <p className="muted-copy mt-3 text-base leading-7">
                {item.description}
              </p>
            </Reveal>
          ))}
        </div>
      </SectionShell>
    </>
  );
}
