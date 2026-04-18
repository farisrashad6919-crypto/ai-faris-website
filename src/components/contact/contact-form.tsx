"use client";

import { useActionState, useEffect, useRef } from "react";

import { LoaderCircle } from "lucide-react";
import { useFormStatus } from "react-dom";
import { useTranslations } from "next-intl";

import {
  initialInquiryState,
  type InquiryFieldName,
  type InquiryFormState,
} from "@/lib/contact";
import type { Locale } from "@/i18n/routing";

import { submitInquiry } from "@/features/contact/actions";

type SelectOption = {
  value: string;
  label: string;
};

type ContactFormProps = {
  focusAreaOptions: SelectOption[];
  learnerTypeOptions: SelectOption[];
  locale: Locale;
};

function SubmitButton() {
  const { pending } = useFormStatus();
  const t = useTranslations("Contact.form");

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
  focusAreaOptions,
  learnerTypeOptions,
  locale,
}: ContactFormProps) {
  const t = useTranslations("Contact.form");
  const [state, formAction] = useActionState(submitInquiry, initialInquiryState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state.status]);

  return (
    <form
      action={formAction}
      className="paper-panel rounded-lg p-6 md:p-8"
      ref={formRef}
    >
      <input name="locale" type="hidden" value={locale} />
      <div className="grid gap-5 md:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-primary">
            {t("fields.name")}
          </span>
          <input
            aria-describedby={state.fieldErrors?.name ? "name-error" : undefined}
            className="premium-input"
            name="name"
            placeholder={t("placeholders.name")}
            type="text"
          />
          <FieldError field="name" state={state} />
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
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-primary">
            {t("fields.learnerType")}
          </span>
          <select className="premium-input" name="learnerType">
            <option value="">{t("placeholders.select")}</option>
            {learnerTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <FieldError field="learnerType" state={state} />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-primary">
            {t("fields.focusArea")}
          </span>
          <select className="premium-input" name="focusArea">
            <option value="">{t("placeholders.select")}</option>
            {focusAreaOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <FieldError field="focusArea" state={state} />
        </label>
      </div>

      <label className="mt-5 block">
        <span className="mb-2 block text-sm font-semibold text-primary">
          {t("fields.goals")}
        </span>
        <textarea
          aria-describedby={state.fieldErrors?.goals ? "goals-error" : undefined}
          className="premium-input min-h-40 resize-y"
          name="goals"
          placeholder={t("placeholders.goals")}
        />
        <FieldError field="goals" state={state} />
      </label>

      <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="text-sm text-secondary">
          <p>{t("privacy")}</p>
          {state.message ? (
            <p
              className={
                state.status === "success" ? "mt-2 text-secondary" : "mt-2 text-error"
              }
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
