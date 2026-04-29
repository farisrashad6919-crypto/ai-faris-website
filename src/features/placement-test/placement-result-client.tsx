"use client";

import { useMemo, useState, useSyncExternalStore, useTransition } from "react";

import { LoaderCircle, RotateCw } from "lucide-react";

import { ButtonLink } from "@/components/ui/button-link";
import { getBookingHref } from "@/config/site";
import { copy } from "@/content/locale-copy";
import { tracks } from "@/content/tracks";
import type { Locale } from "@/i18n/routing";

import { submitPlacementResult } from "./actions";
import { trackPlacementEvent } from "./analytics";
import { placementCopy } from "./copy";
import { placementResultStorageKey } from "./placement-test-client";
import type { PlacementScoreProfile, PlacementSubmitState } from "./types";

type StoredPlacementResult = {
  state: Exclude<PlacementSubmitState, { status: "validation_error" }>;
  submission: unknown;
  savedAt: string;
};

function parseStoredResult(value: string | null): StoredPlacementResult | null {
  if (!value) return null;

  try {
    const parsed = JSON.parse(value) as StoredPlacementResult;
    if (!parsed.state || !("result" in parsed.state)) return null;
    return parsed;
  } catch {
    return null;
  }
}

function subscribeToStorage(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getStoredResultSnapshot() {
  return sessionStorage.getItem(placementResultStorageKey) ?? "";
}

function localizedTrackNextStep(locale: Locale, result: PlacementScoreProfile) {
  return copy(locale, placementCopy.trackNextSteps[result.recommendedTrack]);
}

function displayAreaRows(result: PlacementScoreProfile) {
  return [
    result.areaBreakdown["present-tense-control"],
    result.areaBreakdown["past-tense-control"],
    result.areaBreakdown["perfect-aspect-control"],
    result.areaBreakdown["future-tense-control"],
    result.areaBreakdown["tense-contrast-control"],
    result.areaBreakdown["narrative-sequencing"],
    result.areaBreakdown["stative-dynamic-control"],
    result.areaBreakdown["professional-academic-tense-use"],
    result.areaBreakdown["advanced-tense-precision"],
  ];
}

export function PlacementResultClient({ locale }: { locale: Locale }) {
  const storedSnapshot = useSyncExternalStore(
    subscribeToStorage,
    getStoredResultSnapshot,
    () => "",
  );
  const [retryStored, setRetryStored] = useState<StoredPlacementResult | null>(null);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const t = (value: Parameters<typeof copy>[1]) => copy(locale, value);

  const stored = retryStored ?? parseStoredResult(storedSnapshot);
  const result = stored?.state.result;
  const recommendedTrack = useMemo(
    () =>
      result
        ? tracks.find((track) => track.id === result.recommendedTrack)
        : undefined,
    [result],
  );

  const retrySave = () => {
    if (!stored) return;

    startTransition(async () => {
      const nextState = await submitPlacementResult(stored.submission);

      if (nextState.status === "validation_error") {
        setMessage(nextState.message);
        trackPlacementEvent("placement_result_retry_failed", {
          locale,
          reason: "validation_error",
        });
        return;
      }

      const nextStored = {
        ...stored,
        state: nextState,
        savedAt: new Date().toISOString(),
      };
      sessionStorage.setItem(placementResultStorageKey, JSON.stringify(nextStored));
      setRetryStored(nextStored);
      setMessage(
        nextState.status === "success"
          ? t(placementCopy.savedSuccess)
          : nextState.message,
      );
      trackPlacementEvent(
        nextState.status === "success"
          ? "placement_result_retry_succeeded"
          : "placement_result_retry_failed",
        {
          locale,
          masteryLabel: nextState.result.masteryLabel,
          overallScore: nextState.result.overallScore,
          recommendedTrack: nextState.result.recommendedTrack,
          leadId: nextState.status === "success" ? nextState.leadId : undefined,
        },
      );
    });
  };

  const trackCtaClick = (ctaType: string) => {
    if (!result) return;

    trackPlacementEvent("placement_cta_clicked", {
      locale,
      ctaType,
      masteryLabel: result.masteryLabel,
      overallScore: result.overallScore,
      confidenceLabel: result.confidenceLabel,
      recommendedTrack: result.recommendedTrack,
      storageStatus: stored?.state.status,
      leadId: stored?.state.status === "success" ? stored.state.leadId : undefined,
    });
  };

  if (!result) {
    return (
      <div className="paper-panel rounded-lg p-6 md:p-8">
        <p className="eyebrow">{t(placementCopy.resultTitle)}</p>
        <h1 className="mt-4 text-4xl">{t(placementCopy.resultMissing)}</h1>
        <div className="mt-6">
          <ButtonLink href="/placement-test">{t(placementCopy.start)}</ButtonLink>
        </div>
      </div>
    );
  }

  const areaRows = displayAreaRows(result);

  return (
    <div className="space-y-8">
      {stored?.state.status === "storage_error" ? (
        <div className="paper-panel rounded-md border border-error/25 p-5">
          <p className="text-sm font-semibold text-error">
            {t(placementCopy.storageWarning)}
          </p>
          <button
            className="button-secondary mt-4"
            disabled={isPending}
            onClick={retrySave}
            type="button"
          >
            {isPending ? (
              <LoaderCircle className="size-4 animate-spin" />
            ) : (
              <RotateCw className="size-4" />
            )}
            {t(placementCopy.retrySave)}
          </button>
          {message ? <p className="mt-3 text-sm text-secondary">{message}</p> : null}
        </div>
      ) : message ? (
        <div className="paper-panel rounded-md p-5 text-sm text-secondary">
          {message}
        </div>
      ) : null}

      <section className="paper-panel rounded-lg p-6 md:p-8">
        <p className="eyebrow">{t(placementCopy.resultTitle)}</p>
        <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-end">
          <div>
            <h1 className="text-5xl md:text-6xl">{result.masteryLabel}</h1>
            <p className="muted-copy mt-4 max-w-3xl text-lg leading-8">
              {result.recommendationSummary}
            </p>
          </div>
          <div className="rounded-md bg-primary p-5 text-surface-container-lowest">
            <p className="text-sm text-surface-container-lowest/70">
              {t(placementCopy.overallLevel)}
            </p>
            <p className="mt-3 text-5xl font-semibold">
              {result.overallScore}%
            </p>
            <p className="mt-2 text-sm text-surface-container-lowest/72">
              {t(placementCopy.confidence)}: {result.confidenceLabel}
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {areaRows.map((area) => (
          <article className="paper-panel rounded-md p-5" key={area.label}>
            <p className="eyebrow">{area.label}</p>
            <p className="mt-4 text-4xl font-semibold text-primary">
              {area.score}%
            </p>
            <p className="mt-2 text-sm text-secondary">
              {area.correct}/{area.total} correct
            </p>
          </article>
        ))}
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <div className="paper-panel rounded-md p-6">
          <h2 className="text-3xl">{t(placementCopy.strengths)}</h2>
          <ul className="mt-5 grid gap-3 text-sm leading-6 text-secondary">
            {result.strengths.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="paper-panel rounded-md p-6">
          <h2 className="text-3xl">{t(placementCopy.gaps)}</h2>
          <ul className="mt-5 grid gap-3 text-sm leading-6 text-secondary">
            {result.gaps.map((item) => (
              <li key={item}>{item}</li>
            ))}
            {result.weakTenseAreas.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="paper-panel rounded-md p-6">
        <h2 className="text-3xl">{t(placementCopy.contrasts)}</h2>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {(result.tenseContrastsToStudy.length
            ? result.tenseContrastsToStudy
            : ["Keep practising tense consistency in longer speaking answers."]
          ).map((item) => (
            <div
              className="rounded-md bg-surface-container-low/80 p-4 text-sm leading-6 text-primary"
              key={item}
            >
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <div className="paper-panel rounded-md p-6">
          <h2 className="text-3xl">{t(placementCopy.teachingPriorities)}</h2>
          <div className="mt-5 grid gap-3 text-sm leading-6 text-secondary">
            {result.topTenseWeaknesses.map((gap) => (
              <p className="rounded-md bg-surface-container-low/80 p-3" key={gap}>
                {gap}
              </p>
            ))}
          </div>
        </div>
        <div className="paper-panel rounded-md p-6">
          <h2 className="text-3xl">{t(placementCopy.firstLessons)}</h2>
          <ol className="mt-5 grid list-decimal gap-3 ps-5 text-sm leading-6 text-secondary">
            {result.recommendedFirstLessons.map((lesson) => (
              <li key={lesson}>{lesson}</li>
            ))}
          </ol>
        </div>
      </section>

      <section className="paper-panel rounded-md p-6">
        <h2 className="text-3xl">{t(placementCopy.recommendations)}</h2>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {result.recommendations.map((item) => (
            <div
              className="rounded-md bg-surface-container-low/80 p-4 text-sm leading-6 text-primary"
              key={item}
            >
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="overflow-hidden rounded-lg bg-primary px-6 py-8 text-surface-container-lowest shadow-glow md:px-8">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div>
            <p className="eyebrow text-tertiary-fixed">
              {t(placementCopy.recommendedProgram)}
            </p>
            <h2 className="mt-4 font-display text-4xl text-surface-container-lowest">
              {recommendedTrack
                ? copy(locale, recommendedTrack.title)
                : t(placementCopy.resultPhrases.personalTraining)}
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-surface-container-lowest/78 md:text-base">
              {localizedTrackNextStep(locale, result)}
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <ButtonLink
              href={getBookingHref(locale)}
              onClick={() => trackCtaClick("preply_booking")}
            >
              {t(placementCopy.bookDiagnostic)}
            </ButtonLink>
            {recommendedTrack ? (
              <ButtonLink
                className="text-surface-container-lowest"
                href={`/programs/${recommendedTrack.slug}`}
                onClick={() => trackCtaClick("recommended_program")}
                variant="tertiary"
              >
                {copy(locale, recommendedTrack.shortTitle)}
              </ButtonLink>
            ) : null}
            <ButtonLink
              className="text-surface-container-lowest"
              href="/contact"
              onClick={() => trackCtaClick("register_interest")}
              variant="tertiary"
            >
              {t(placementCopy.contactCta)}
            </ButtonLink>
          </div>
        </div>
      </section>

      <p className="rounded-md bg-tertiary-fixed/45 p-4 text-sm leading-6 text-tertiary">
        {t(placementCopy.scopeNoteCurrent)}
      </p>
    </div>
  );
}
