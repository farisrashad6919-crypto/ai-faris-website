"use client";

import { FormEvent, useEffect, useMemo, useRef, useState, useTransition } from "react";

import { ArrowRight, CheckCircle2, LoaderCircle } from "lucide-react";

import { getBookingHref } from "@/config/site";
import { copy } from "@/content/locale-copy";
import { tracks } from "@/content/tracks";
import type { TrackId } from "@/content/types";
import { localeSelfNames } from "@/i18n/locale-labels";
import { useRouter } from "@/i18n/navigation";
import { locales, type Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

import {
  getPlacementStage,
  startPlacementTest,
  submitPlacementResult,
} from "./actions";
import { trackPlacementEvent } from "./analytics";
import { placementCopy } from "./copy";
import type {
  PlacementAnswer,
  PlacementStageResponse,
  PlacementSubmitState,
  PublicPlacementItem,
} from "./types";

export const placementResultStorageKey = "faris-placement-test-result";
const placementExposureStorageKey = "faris-placement-test-exposure";

type PlacementTestClientProps = {
  locale: Locale;
};

type DetailValues = {
  fullName: string;
  age: string;
  nationality: string;
  whatsapp: string;
  telegram: string;
  email: string;
  preferredLanguage: Locale;
  learningGoal: string;
  interestedTrack: TrackId | "";
  consent: boolean;
};

type PlacementExposure = {
  recentlySeenItemIds: string[];
  retakeCount: number;
};

const emptyDetails = (locale: Locale): DetailValues => ({
  fullName: "",
  age: "",
  nationality: "",
  whatsapp: "",
  telegram: "",
  email: "",
  preferredLanguage: locale,
  learningGoal: "",
  interestedTrack: "",
  consent: false,
});

function readPlacementExposure(): PlacementExposure {
  if (typeof window === "undefined") {
    return { recentlySeenItemIds: [], retakeCount: 0 };
  }

  try {
    const parsed = JSON.parse(
      localStorage.getItem(placementExposureStorageKey) ?? "{}",
    ) as Partial<PlacementExposure>;

    return {
      recentlySeenItemIds: Array.isArray(parsed.recentlySeenItemIds)
        ? parsed.recentlySeenItemIds.filter((item) => typeof item === "string")
        : [],
      retakeCount:
        typeof parsed.retakeCount === "number" && Number.isFinite(parsed.retakeCount)
          ? parsed.retakeCount
          : 0,
    };
  } catch {
    return { recentlySeenItemIds: [], retakeCount: 0 };
  }
}

function savePlacementExposure(questionIdsSeen: string[], retakeCount: number) {
  if (typeof window === "undefined") return;
  const current = readPlacementExposure();
  const recentlySeenItemIds = Array.from(
    new Set([...questionIdsSeen, ...current.recentlySeenItemIds]),
  ).slice(0, 220);

  localStorage.setItem(
    placementExposureStorageKey,
    JSON.stringify({
      recentlySeenItemIds,
      retakeCount: Math.max(current.retakeCount, retakeCount + 1),
    }),
  );
}

function nowIso() {
  return new Date().toISOString();
}

function secondsSince(startedAt: string) {
  return Math.max(0, Math.round((Date.now() - Date.parse(startedAt)) / 1000));
}

function skillLabel(locale: Locale, skill: PublicPlacementItem["skill"]) {
  return copy(locale, placementCopy.skills[skill]);
}

function TrackingValues() {
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
}

export function PlacementTestClient({ locale }: PlacementTestClientProps) {
  const router = useRouter();
  const [step, setStep] = useState<"intro" | "test" | "details">("intro");
  const [introGoal, setIntroGoal] = useState("");
  const [selfEstimatedLevel, setSelfEstimatedLevel] = useState("");
  const [introTrack, setIntroTrack] = useState<TrackId | "">("");
  const [startedAt, setStartedAt] = useState("");
  const [stageResponse, setStageResponse] = useState<PlacementStageResponse | null>(null);
  const [answers, setAnswers] = useState<PlacementAnswer[]>([]);
  const [recentlySeenItemIds, setRecentlySeenItemIds] = useState<string[]>([]);
  const [retakeCount, setRetakeCount] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [details, setDetails] = useState<DetailValues>(() => emptyDetails(locale));
  const [fieldErrors, setFieldErrors] = useState<
    Extract<PlacementSubmitState, { status: "validation_error" }>["fieldErrors"]
  >({});
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const containerRef = useRef<HTMLElement | null>(null);
  const tracking = useMemo(() => TrackingValues(), []);
  const t = (value: Parameters<typeof copy>[1]) => copy(locale, value);
  const sourcePage = "/placement-test";
  const answeredCount = new Set(answers.map((answer) => answer.itemId)).size;
  const currentItem = stageResponse?.items[currentIndex] ?? null;
  const selectedOptionIds = currentItem
    ? (answers.find((answer) => answer.itemId === currentItem.id)?.selectedOptionIds ?? [])
    : [];
  const hasSelectedOption = selectedOptionIds.length > 0;

  useEffect(() => {
    if (step === "intro") return;

    window.requestAnimationFrame(() => {
      containerRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }, [currentIndex, stageResponse?.stage, step]);

  const setContainerRef = (node: HTMLElement | null) => {
    containerRef.current = node;
  };

  const startTest = () => {
    startTransition(async () => {
      const started = nowIso();
      const exposure = readPlacementExposure();
      const response = await startPlacementTest({
        locale,
        sourcePage,
        interestedTrack: introTrack,
        learningGoal: introGoal,
        selfEstimatedLevel,
        recentlySeenItemIds: exposure.recentlySeenItemIds,
        retakeCount: exposure.retakeCount,
      });
      trackPlacementEvent("placement_test_started", {
        locale,
        sourcePage,
        interestedTrack: introTrack,
        selfEstimatedLevel,
        retakeCount: exposure.retakeCount,
      });
      setStartedAt(started);
      setRecentlySeenItemIds(exposure.recentlySeenItemIds);
      setRetakeCount(exposure.retakeCount);
      setStageResponse(response);
      setStep("test");
    });
  };

  const selectAnswer = (optionId: string) => {
    if (!currentItem || !stageResponse) return;
    const effectiveStartedAt = startedAt || nowIso();

    if (!startedAt) {
      setStartedAt(effectiveStartedAt);
    }

    const answer: PlacementAnswer = {
      itemId: currentItem.id,
      selectedOptionIds: [optionId],
      stage: Math.min(stageResponse.stage, 3),
      answeredAt: nowIso(),
      elapsedSeconds: secondsSince(effectiveStartedAt),
    };

    const nextAnsweredCount =
      answeredCount + (answers.some((item) => item.itemId === currentItem.id) ? 0 : 1);

    trackPlacementEvent("placement_question_answered", {
      itemId: currentItem.id,
      skill: currentItem.skill,
      cefrLevel: currentItem.cefrLevel,
      stage: stageResponse.stage,
      answeredCount: nextAnsweredCount,
    });

    setAnswers((current) => [
      ...current.filter((item) => item.itemId !== currentItem.id),
      answer,
    ]);
  };

  const continueTest = () => {
    if (!stageResponse || !hasSelectedOption) return;

    if (currentIndex < stageResponse.items.length - 1) {
      setCurrentIndex((current) => current + 1);
      return;
    }

    startTransition(async () => {
      const nextAnswers = answers;
      const response = await getPlacementStage({
        sessionId: stageResponse.sessionId,
        answers: nextAnswers,
        recentlySeenItemIds,
        retakeCount,
      });

      trackPlacementEvent("placement_stage_completed", {
        stage: stageResponse.stage,
        answeredCount: nextAnswers.length,
      });

      if (response.completed) {
        setStep("details");
        setDetails((current) => ({
          ...current,
          learningGoal: current.learningGoal || introGoal,
          interestedTrack: current.interestedTrack || introTrack,
        }));
        return;
      }

      setStageResponse(response);
      setCurrentIndex(0);
    });
  };

  const submitDetails = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!stageResponse) return;

    setMessage("");
    setFieldErrors({});

    const completedAt = nowIso();
    const effectiveStartedAt = startedAt || completedAt;
    const submission = {
      sessionId: stageResponse.sessionId,
      locale,
      sourcePage,
      startedAt: effectiveStartedAt,
      completedAt,
      completionTimeSeconds: secondsSince(effectiveStartedAt),
      answers,
      details,
      tracking,
      retakeCount,
    };

    startTransition(async () => {
      const state = await submitPlacementResult(submission);

      if (state.status === "validation_error") {
        setFieldErrors(state.fieldErrors);
        setMessage(state.message);
        return;
      }

      trackPlacementEvent("placement_test_completed", {
        locale,
        estimatedCefrLevel: state.result.estimatedCefrLevel,
        confidenceLabel: state.result.confidenceLabel,
        recommendedTrack: state.result.recommendedTrack,
        storageStatus: state.status,
        leadId: state.status === "success" ? state.leadId : undefined,
      });
      trackPlacementEvent(
        state.status === "success"
          ? "placement_result_storage_succeeded"
          : "placement_result_storage_failed",
        {
          locale,
          sessionId: submission.sessionId,
          estimatedCefrLevel: state.result.estimatedCefrLevel,
          recommendedTrack: state.result.recommendedTrack,
          leadId: state.status === "success" ? state.leadId : undefined,
        },
      );
      savePlacementExposure(state.result.questionIdsSeen, retakeCount);

      sessionStorage.setItem(
        placementResultStorageKey,
        JSON.stringify({
          state,
          submission,
          savedAt: nowIso(),
        }),
      );
      router.push("/placement-test/result");
    });
  };

  if (step === "intro") {
    return (
      <div className="paper-panel rounded-lg p-5 md:p-8" ref={setContainerRef}>
        <button
          className="button-primary fixed inset-x-4 bottom-4 z-40 justify-center shadow-glow md:hidden"
          disabled={isPending}
          onClick={startTest}
          type="button"
        >
          {isPending ? <LoaderCircle className="size-4 animate-spin" /> : null}
          {t(placementCopy.beginNow)}
          <ArrowRight className="size-4" />
        </button>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(18rem,0.85fr)]">
          <div className="space-y-5">
            <p className="eyebrow">{t(placementCopy.estimatedTime)}</p>
            <h2 className="text-3xl md:text-4xl">
              {t(placementCopy.introTitle)}
            </h2>
            <p className="muted-copy text-base leading-7">
              {t(placementCopy.introDescriptionCurrent)}
            </p>
            <button
              className="button-primary w-full justify-center sm:w-auto"
              disabled={isPending}
              onClick={startTest}
              type="button"
            >
              {isPending ? <LoaderCircle className="size-4 animate-spin" /> : null}
              {t(placementCopy.beginDiagnostic)}
              <ArrowRight className="size-4" />
            </button>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                [placementCopy.skills.vocabulary, placementCopy.introCards.vocabulary],
                [placementCopy.skills.grammar, placementCopy.introCards.grammar],
              ].map(([title, description]) => (
                <div className="rounded-md bg-surface-container-low/80 p-4" key={title.en}>
                  <p className="font-semibold text-primary">{t(title)}</p>
                  <p className="mt-2 text-sm leading-6 text-secondary">
                    {t(description)}
                  </p>
                </div>
              ))}
            </div>
            <p className="rounded-md bg-tertiary-fixed/45 p-4 text-sm leading-6 text-tertiary">
              {t(placementCopy.scopeNoteCurrent)}
            </p>
          </div>

          <div className="rounded-lg bg-surface-container-low/70 p-5">
            <div className="grid gap-4">
              <label>
                <span className="mb-2 block text-sm font-semibold text-primary">
                  {t(placementCopy.currentGoal)}
                </span>
                <textarea
                  className="premium-input min-h-28"
                  onChange={(event) => setIntroGoal(event.target.value)}
                  placeholder={t(placementCopy.goalPlaceholder)}
                  value={introGoal}
                />
              </label>
              <label>
                <span className="mb-2 block text-sm font-semibold text-primary">
                  {t(placementCopy.interestedTrack)}
                </span>
                <select
                  className="premium-input"
                  onChange={(event) => setIntroTrack(event.target.value as TrackId | "")}
                  value={introTrack}
                >
                  <option value="">{t(placementCopy.selectOption)}</option>
                  {tracks.map((track) => (
                    <option key={track.id} value={track.id}>
                      {copy(locale, track.title)}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span className="mb-2 block text-sm font-semibold text-primary">
                  {t(placementCopy.selfEstimate)}
                </span>
                <select
                  className="premium-input"
                  onChange={(event) => setSelfEstimatedLevel(event.target.value)}
                  value={selfEstimatedLevel}
                >
                  <option value="">{t(placementCopy.selectOption)}</option>
                  {["A1", "A2", "B1", "B2", "C1", "C2", "Not sure"].map((level) => (
                    <option key={level} value={level}>
                      {t(level)}
                    </option>
                  ))}
                </select>
              </label>
              <button
                className="button-primary justify-center"
                disabled={isPending}
                onClick={startTest}
                type="button"
              >
                {isPending ? <LoaderCircle className="size-4 animate-spin" /> : null}
                {t(placementCopy.start)}
                <ArrowRight className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === "details") {
    return (
      <form
        className="paper-panel scroll-mt-28 rounded-lg p-5 md:p-8"
        onSubmit={submitDetails}
        ref={setContainerRef}
      >
        <div className="mb-6 max-w-3xl space-y-3">
          <p className="eyebrow">{t(placementCopy.detailsReady)}</p>
          <h2 className="text-3xl md:text-4xl">{t(placementCopy.detailsTitle)}</h2>
          <p className="muted-copy text-base leading-7">
            {t(placementCopy.detailsDescription)}
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <label>
            <span className="mb-2 block text-sm font-semibold text-primary">
              {t(placementCopy.fields.fullName)} *
            </span>
            <input
              className="premium-input"
              onChange={(event) =>
                setDetails((current) => ({ ...current, fullName: event.target.value }))
              }
              value={details.fullName}
            />
            {fieldErrors.fullName ? (
              <p className="mt-2 text-sm text-error">{fieldErrors.fullName}</p>
            ) : null}
          </label>
          <label>
            <span className="mb-2 block text-sm font-semibold text-primary">
              {t(placementCopy.fields.age)} *
            </span>
            <input
              className="premium-input"
              min={7}
              onChange={(event) =>
                setDetails((current) => ({ ...current, age: event.target.value }))
              }
              type="number"
              value={details.age}
            />
            {fieldErrors.age ? (
              <p className="mt-2 text-sm text-error">{fieldErrors.age}</p>
            ) : null}
          </label>
          <label>
            <span className="mb-2 block text-sm font-semibold text-primary">
              {t(placementCopy.fields.nationality)} *
            </span>
            <input
              className="premium-input"
              onChange={(event) =>
                setDetails((current) => ({ ...current, nationality: event.target.value }))
              }
              value={details.nationality}
            />
            {fieldErrors.nationality ? (
              <p className="mt-2 text-sm text-error">{fieldErrors.nationality}</p>
            ) : null}
          </label>
          <label>
            <span className="mb-2 block text-sm font-semibold text-primary">
              {t(placementCopy.fields.email)}
            </span>
            <input
              className="premium-input"
              onChange={(event) =>
                setDetails((current) => ({ ...current, email: event.target.value }))
              }
              type="email"
              value={details.email}
            />
            {fieldErrors.email ? (
              <p className="mt-2 text-sm text-error">{fieldErrors.email}</p>
            ) : null}
          </label>
          <label>
            <span className="mb-2 block text-sm font-semibold text-primary">
              {t(placementCopy.fields.whatsapp)}
            </span>
            <input
              className="premium-input"
              onChange={(event) =>
                setDetails((current) => ({ ...current, whatsapp: event.target.value }))
              }
              value={details.whatsapp}
            />
            {fieldErrors.whatsapp ? (
              <p className="mt-2 text-sm text-error">{fieldErrors.whatsapp}</p>
            ) : null}
          </label>
          <label>
            <span className="mb-2 block text-sm font-semibold text-primary">
              {t(placementCopy.fields.telegram)}
            </span>
            <input
              className="premium-input"
              onChange={(event) =>
                setDetails((current) => ({ ...current, telegram: event.target.value }))
              }
              value={details.telegram}
            />
            {fieldErrors.telegram ? (
              <p className="mt-2 text-sm text-error">{fieldErrors.telegram}</p>
            ) : null}
          </label>
          <label>
            <span className="mb-2 block text-sm font-semibold text-primary">
              {t(placementCopy.fields.preferredLanguage)} *
            </span>
            <select
              className="premium-input"
              onChange={(event) =>
                setDetails((current) => ({
                  ...current,
                  preferredLanguage: event.target.value as Locale,
                }))
              }
              value={details.preferredLanguage}
            >
              {locales.map((option) => (
                <option key={option} value={option}>
                  {localeSelfNames[option]}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="mb-2 block text-sm font-semibold text-primary">
              {t(placementCopy.interestedTrack)}
            </span>
            <select
              className="premium-input"
              onChange={(event) =>
                setDetails((current) => ({
                  ...current,
                  interestedTrack: event.target.value as TrackId | "",
                }))
              }
              value={details.interestedTrack}
            >
              <option value="">{t(placementCopy.selectOption)}</option>
              {tracks.map((track) => (
                <option key={track.id} value={track.id}>
                  {copy(locale, track.title)}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="mt-5 block">
          <span className="mb-2 block text-sm font-semibold text-primary">
            {t(placementCopy.fields.learningGoal)}
          </span>
          <textarea
            className="premium-input min-h-28"
            onChange={(event) =>
              setDetails((current) => ({ ...current, learningGoal: event.target.value }))
            }
            value={details.learningGoal}
          />
        </label>

        <label className="mt-5 flex items-start gap-3 rounded-md bg-surface-container-low/80 p-4 text-sm leading-6">
          <input
            checked={details.consent}
            className="mt-1"
            onChange={(event) =>
              setDetails((current) => ({ ...current, consent: event.target.checked }))
            }
            type="checkbox"
          />
          <span>
            {t(placementCopy.fields.consent)} <span className="text-error">*</span>
          </span>
        </label>
        {fieldErrors.consent ? (
          <p className="mt-2 text-sm text-error">{fieldErrors.consent}</p>
        ) : null}

        <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className={cn("text-sm", message ? "text-error" : "text-secondary")}>
            {message || t(placementCopy.noPaywallMessage)}
          </p>
          <button className="button-primary justify-center" disabled={isPending} type="submit">
            {isPending ? <LoaderCircle className="size-4 animate-spin" /> : null}
            {isPending ? t(placementCopy.saving) : t(placementCopy.submitDetails)}
          </button>
        </div>
      </form>
    );
  }

  return (
    <div
      className="paper-panel fixed inset-x-3 bottom-3 top-24 z-30 overflow-y-auto rounded-lg p-5 md:static md:inset-auto md:z-auto md:overflow-visible md:p-8"
      ref={setContainerRef}
    >
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="eyebrow">
            {t(placementCopy.progress)} {answeredCount}/{stageResponse?.totalQuestionsTarget}
          </p>
          <h2 className="mt-3 text-3xl">
            {currentItem ? skillLabel(locale, currentItem.skill) : ""}
          </h2>
        </div>
        <div className="rounded-sm bg-tertiary-fixed/55 px-3 py-2 text-sm font-semibold text-tertiary">
          {currentItem?.cefrLevel}
        </div>
      </div>

      <div className="mb-7 h-2 overflow-hidden rounded-full bg-surface-container-low">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{
            width: `${Math.min(
              100,
              (answeredCount / (stageResponse?.totalQuestionsTarget ?? 1)) * 100,
            )}%`,
          }}
        />
      </div>

      <fieldset>
        <legend className="text-2xl font-semibold text-primary">
          {currentItem?.stem}
        </legend>
        <div className="mt-5 grid gap-3">
          {currentItem?.options.map((option) => {
            const selected = selectedOptionIds.includes(option.id);
            return (
              <button
                aria-pressed={selected}
                className={cn(
                  "flex items-center justify-between gap-4 rounded-md border p-4 text-start text-base leading-7",
                  selected
                    ? "border-primary bg-primary text-surface-container-lowest"
                    : "border-outline-variant/45 bg-surface-container-lowest/80 text-primary hover:border-primary/35",
                )}
                key={option.id}
                onClick={() => selectAnswer(option.id)}
                type="button"
              >
                <span>{option.text}</span>
                {selected ? <CheckCircle2 className="size-5 shrink-0" /> : null}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="sticky bottom-4 z-10 mt-6 flex justify-end rounded-md border border-outline-variant/35 bg-surface-container-lowest/92 p-2 shadow-soft backdrop-blur md:static md:mt-7 md:border-0 md:bg-transparent md:p-0 md:shadow-none">
        <button
          className="button-primary"
          disabled={!hasSelectedOption || isPending}
          onClick={continueTest}
          type="button"
        >
          {isPending ? <LoaderCircle className="size-4 animate-spin" /> : null}
          {currentIndex === (stageResponse?.items.length ?? 0) - 1
            ? t(placementCopy.finishStage)
            : t(placementCopy.next)}
          <ArrowRight className="size-4" />
        </button>
      </div>

      <div className="mt-6 text-sm leading-6 text-secondary">
        {t(placementCopy.questionLanguageNote)}
      </div>

      <a className="sr-only" href={getBookingHref(locale)}>
        {t(placementCopy.bookDiagnostic)}
      </a>
    </div>
  );
}
