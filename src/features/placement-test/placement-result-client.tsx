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

function skillName(locale: Locale, skill: keyof PlacementScoreProfile["skillBreakdown"]) {
  return copy(locale, placementCopy.skills[skill]);
}

function formatConfidenceLabel(locale: Locale, label: string) {
  const borderline = label.match(/^([ABC][12])\/([ABC][12]) borderline$/);

  if (borderline) {
    return `${borderline[1]}/${borderline[2]} ${copy(locale, placementCopy.resultPhrases.borderline)}`;
  }

  if (label.startsWith("Strong ")) {
    return `${copy(locale, placementCopy.resultPhrases.strong)} ${label.replace("Strong ", "")}`;
  }

  if (label.startsWith("Likely ")) {
    return `${copy(locale, placementCopy.resultPhrases.likely)} ${label.replace("Likely ", "")}`;
  }

  if (label === "Upper-B2 / approaching C1") {
    return copy(locale, placementCopy.resultPhrases.upperB2);
  }

  return label;
}

function localizedTrackNextStep(locale: Locale, result: PlacementScoreProfile) {
  return copy(locale, placementCopy.trackNextSteps[result.recommendedTrack]);
}

function localizedRecommendations(locale: Locale, result: PlacementScoreProfile) {
  const recommendations = [
    copy(locale, placementCopy.recommendationItems.spacedReview),
    copy(locale, placementCopy.recommendationItems.errorLog),
  ];

  if (
    result.weakestArea === "vocabulary" ||
    result.recommendationTags.includes("collocations")
  ) {
    recommendations.push(copy(locale, placementCopy.recommendationItems.chunks));
  }

  if (
    result.weakestArea === "grammar" ||
    result.recommendationTags.includes("grammar-accuracy")
  ) {
    recommendations.push(copy(locale, placementCopy.recommendationItems.grammar));
  }

  if (result.recommendedTrack === "ielts") {
    recommendations.push(copy(locale, placementCopy.recommendationItems.ielts));
  }

  if (result.recommendedTrack === "business") {
    recommendations.push(copy(locale, placementCopy.recommendationItems.business));
  }

  return recommendations;
}

function localizedNarrative(locale: Locale, result: PlacementScoreProfile) {
  const strongest = skillName(locale, result.strongestArea);
  const weakest = skillName(locale, result.weakestArea);
  const confidence = formatConfidenceLabel(locale, result.confidenceLabel);

  return {
    confidence,
    interpretation: `${copy(locale, placementCopy.resultPhrases.currentEnglishLooks)} ${confidence}, ${copy(locale, placementCopy.resultPhrases.with)} ${strongest.toLowerCase()} ${copy(locale, placementCopy.resultPhrases.strongerThan)} ${weakest.toLowerCase()}.`,
    summary: `${copy(locale, placementCopy.resultPhrases.currentEnglishLooks)} ${result.estimatedCefrLevel}. ${strongest} ${copy(locale, placementCopy.resultPhrases.strongestSentence)} ${weakest} ${copy(locale, placementCopy.resultPhrases.weakestSentence)} ${copy(locale, placementCopy.resultPhrases.summaryBalanced)}`,
    strengths: [
      `${strongest} ${copy(locale, placementCopy.resultPhrases.strongestSentence)}`,
      result.overallScore >= 70
        ? copy(locale, placementCopy.resultPhrases.solidEvidence)
        : copy(locale, placementCopy.resultPhrases.enoughEvidence),
    ],
    gaps: [
      `${weakest} ${copy(locale, placementCopy.resultPhrases.weakestSentence)}`,
      result.borderlineNote
        ? copy(locale, placementCopy.resultPhrases.boundaryLive)
        : copy(locale, placementCopy.resultPhrases.liveSkills),
    ],
    recommendations: localizedRecommendations(locale, result),
    nextStep: localizedTrackNextStep(locale, result),
  };
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
          estimatedCefrLevel: nextState.result.estimatedCefrLevel,
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
      estimatedCefrLevel: result.estimatedCefrLevel,
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

  const narrative = result ? localizedNarrative(locale, result) : null;
  const skillRows = Object.entries(result.skillBreakdown) as Array<
    [keyof PlacementScoreProfile["skillBreakdown"], (typeof result.skillBreakdown)["grammar"]]
  >;

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
            <h1 className="text-5xl md:text-6xl">
              {narrative?.confidence}
            </h1>
            <p className="muted-copy mt-4 max-w-3xl text-lg leading-8">
              {narrative?.interpretation}
            </p>
          </div>
          <div className="rounded-md bg-primary p-5 text-surface-container-lowest">
            <p className="text-sm text-surface-container-lowest/70">
              {t(placementCopy.overallLevel)}
            </p>
            <p className="mt-3 text-5xl font-semibold">
              {result.estimatedCefrLevel}
            </p>
            <p className="mt-2 text-sm text-surface-container-lowest/72">
              {t(placementCopy.confidence)}: {narrative?.confidence}
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {skillRows.map(([skill, data]) => (
          <article className="paper-panel rounded-md p-5" key={skill}>
            <p className="eyebrow">{skillName(locale, skill)}</p>
            <p className="mt-4 text-4xl font-semibold text-primary">
              {data.levelEstimate}
            </p>
            <p className="mt-2 text-sm text-secondary">
              {data.score}/100 / {data.correct}/{data.total}
            </p>
          </article>
        ))}
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <div className="paper-panel rounded-md p-6">
          <h2 className="text-3xl">{t(placementCopy.strengths)}</h2>
          <ul className="mt-5 grid gap-3 text-sm leading-6 text-secondary">
            {narrative?.strengths.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="paper-panel rounded-md p-6">
          <h2 className="text-3xl">{t(placementCopy.gaps)}</h2>
          <ul className="mt-5 grid gap-3 text-sm leading-6 text-secondary">
            {narrative?.gaps.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="paper-panel rounded-md p-6">
        <h2 className="text-3xl">{t(placementCopy.recommendations)}</h2>
        <p className="muted-copy mt-3 max-w-3xl text-base leading-7">
          {narrative?.summary}
        </p>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {narrative?.recommendations.map((item) => (
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
            {[...result.topGrammarGaps, ...result.topVocabularyGaps]
              .slice(0, 5)
              .map((gap) => (
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
              {narrative?.nextStep}
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
