"use client";

import { useActionState, useEffect, useRef, useState } from "react";

import { LoaderCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { useFormStatus } from "react-dom";

import { submitInquiry } from "@/features/contact/actions";
import { locales, type Locale } from "@/i18n/routing";
import {
  initialInquiryState,
  type InquiryFieldName,
  type InquiryFormState,
} from "@/lib/contact";
import { cn } from "@/lib/utils";
import { tracks } from "@/content/tracks";
import { copy } from "@/content/locale-copy";
import type { OfferType, TrackId } from "@/content/types";

type ContactFormProps = {
  locale: Locale;
  sourcePage: string;
  defaultTrack?: TrackId;
  defaultOfferType?: OfferType;
};

const offerOptions: Array<{ value: OfferType; label: string }> = [
  { value: "course", label: "Course" },
  { value: "webinar", label: "Webinar" },
  { value: "training", label: "Training" },
  { value: "placement-test", label: "Placement test" },
  { value: "updates", label: "Updates" },
];

const levelOptions = [
  "Beginner",
  "Elementary",
  "Pre-intermediate",
  "Intermediate",
  "Upper-intermediate",
  "Advanced",
  "Not sure",
];

function SubmitButton() {
  const { pending } = useFormStatus();
  const t = useTranslations("LeadForm");

  return (
    <button
      className="button-primary w-full justify-center md:w-auto"
      disabled={pending}
      type="submit"
    >
      {pending ? <LoaderCircle className="size-4 animate-spin" /> : null}
      <span>{pending ? t("submitting") : t("submit")}</span>
    </button>
  );
}

function FieldError({
  field,
  state,
}: {
  field: InquiryFieldName;
  state: InquiryFormState;
}) {
  if (!state.fieldErrors?.[field]) return null;

  return (
    <p className="mt-2 text-sm text-error" id={`${field}-error`}>
      {state.fieldErrors[field]}
    </p>
  );
}

export function ContactForm({
  locale,
  sourcePage,
  defaultTrack,
  defaultOfferType = "course",
}: ContactFormProps) {
  const t = useTranslations("LeadForm");
  const localeSwitcher = useTranslations("LocaleSwitcher");
  const [state, formAction] = useActionState(submitInquiry, initialInquiryState);
  const formRef = useRef<HTMLFormElement>(null);
  const [tracking] = useState(() => {
    if (typeof window === "undefined") {
      return {
        utmSource: "",
        utmMedium: "",
        utmCampaign: "",
        referrer: "",
      };
    }

    const params = new URLSearchParams(window.location.search);

    return {
      utmSource: params.get("utm_source") ?? "",
      utmMedium: params.get("utm_medium") ?? "",
      utmCampaign: params.get("utm_campaign") ?? "",
      referrer: document.referrer,
    };
  });

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state.status]);

  const requiredClass = "after:ms-1 after:text-error after:content-['*']";

  return (
    <form
      action={formAction}
      className="paper-panel rounded-lg p-6 md:p-8"
      ref={formRef}
    >
      <input name="locale" type="hidden" value={locale} />
      <input name="sourcePage" type="hidden" value={sourcePage} />
      <input name="utmSource" type="hidden" value={tracking.utmSource} />
      <input name="utmMedium" type="hidden" value={tracking.utmMedium} />
      <input name="utmCampaign" type="hidden" value={tracking.utmCampaign} />
      <input name="referrer" type="hidden" value={tracking.referrer} />
      <input
        autoComplete="off"
        className="hidden"
        name="website"
        tabIndex={-1}
        type="text"
      />

      <div className="mb-6 space-y-3">
        <p className="eyebrow">{t("title")}</p>
        <p className="muted-copy max-w-2xl text-sm leading-6">
          {t("description")}
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <label className="block">
          <span className={cn("mb-2 block text-sm font-semibold text-primary", requiredClass)}>
            {t("fields.fullName")}
          </span>
          <input
            aria-describedby={state.fieldErrors?.fullName ? "fullName-error" : undefined}
            className="premium-input"
            name="fullName"
            placeholder={t("placeholders.fullName")}
            type="text"
          />
          <FieldError field="fullName" state={state} />
        </label>

        <label className="block">
          <span className={cn("mb-2 block text-sm font-semibold text-primary", requiredClass)}>
            {t("fields.age")}
          </span>
          <input
            aria-describedby={state.fieldErrors?.age ? "age-error" : undefined}
            className="premium-input"
            min={7}
            name="age"
            placeholder={t("placeholders.age")}
            type="number"
          />
          <FieldError field="age" state={state} />
        </label>

        <label className="block">
          <span className={cn("mb-2 block text-sm font-semibold text-primary", requiredClass)}>
            {t("fields.nationality")}
          </span>
          <input
            aria-describedby={state.fieldErrors?.nationality ? "nationality-error" : undefined}
            className="premium-input"
            name="nationality"
            placeholder={t("placeholders.nationality")}
            type="text"
          />
          <FieldError field="nationality" state={state} />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-primary">
            {t("fields.email")}
          </span>
          <input
            aria-describedby={state.fieldErrors?.email ? "email-error" : undefined}
            className="premium-input"
            name="email"
            placeholder={t("placeholders.email")}
            type="email"
          />
          <FieldError field="email" state={state} />
          <p className="mt-2 text-xs leading-5 text-secondary">
            {t("helper.email")}
          </p>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-primary">
            {t("fields.whatsapp")}
          </span>
          <input
            aria-describedby={state.fieldErrors?.whatsapp ? "whatsapp-error" : undefined}
            className="premium-input"
            name="whatsapp"
            placeholder={t("placeholders.whatsapp")}
            type="tel"
          />
          <FieldError field="whatsapp" state={state} />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-primary">
            {t("fields.telegram")}
          </span>
          <input
            aria-describedby={state.fieldErrors?.telegram ? "telegram-error" : undefined}
            className="premium-input"
            name="telegram"
            placeholder={t("placeholders.telegram")}
            type="text"
          />
          <FieldError field="telegram" state={state} />
        </label>
      </div>

      <p className="mt-3 text-xs leading-5 text-secondary">{t("helper.contact")}</p>

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <label className="block">
          <span className={cn("mb-2 block text-sm font-semibold text-primary", requiredClass)}>
            {t("fields.track")}
          </span>
          <select className="premium-input" defaultValue={defaultTrack ?? ""} name="track">
            <option value="">{t("placeholders.select")}</option>
            {tracks.map((track) => (
              <option key={track.id} value={track.id}>
                {copy(locale, track.title)}
              </option>
            ))}
          </select>
          <FieldError field="track" state={state} />
        </label>

        <label className="block">
          <span className={cn("mb-2 block text-sm font-semibold text-primary", requiredClass)}>
            {t("fields.offerType")}
          </span>
          <select className="premium-input" defaultValue={defaultOfferType} name="offerType">
            {offerOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {copy(locale, option.label)}
              </option>
            ))}
          </select>
          <FieldError field="offerType" state={state} />
        </label>

        <label className="block">
          <span className={cn("mb-2 block text-sm font-semibold text-primary", requiredClass)}>
            {t("fields.preferredLanguage")}
          </span>
          <select className="premium-input" defaultValue={locale} name="preferredLanguage">
            {locales.map((option) => (
              <option key={option} value={option}>
                {localeSwitcher(`localeNames.${option}`)}
              </option>
            ))}
          </select>
          <FieldError field="preferredLanguage" state={state} />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-primary">
            {t("fields.currentLevel")}
          </span>
          <select className="premium-input" name="currentLevel">
            <option value="">{t("placeholders.select")}</option>
            {levelOptions.map((option) => (
              <option key={option} value={option}>
                {copy(locale, option)}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="mt-5 block">
        <span className="mb-2 block text-sm font-semibold text-primary">
          {t("fields.goal")}
        </span>
        <textarea
          className="premium-input min-h-36 resize-y"
          name="goal"
          placeholder={t("placeholders.goal")}
        />
      </label>

      <label className="mt-5 flex items-start gap-3 rounded-md bg-surface-container-low/80 p-4 text-sm leading-6">
        <input
          aria-describedby={state.fieldErrors?.consent ? "consent-error" : undefined}
          className="mt-1"
          name="consent"
          type="checkbox"
        />
        <span>
          {t("fields.consent")}
          <span className="ms-1 text-error">*</span>
        </span>
      </label>
      <FieldError field="consent" state={state} />

      <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="text-sm text-secondary">
          <p>{t("helper.privacy")}</p>
          {state.message ? (
            <p
              className={cn(
                "mt-2",
                state.status === "success" ? "text-secondary" : "text-error",
              )}
            >
              {state.message}
            </p>
          ) : null}
        </div>
        <SubmitButton />
      </div>
    </form>
  );
}
