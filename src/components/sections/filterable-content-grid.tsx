"use client";

import { useMemo, useState } from "react";

import { useTranslations } from "next-intl";

import { contentTypes, type ResourceEntry } from "@/content/resources";
import { tracks } from "@/content/tracks";
import type { ResourceType, TrackId } from "@/content/types";
import { copy } from "@/content/locale-copy";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

type FilterableContentGridProps = {
  locale: Locale;
  entries: ResourceEntry[];
  mode: "resources" | "webinars";
};

type TrackFilter = TrackId | "all";
type TypeFilter = ResourceType | "all";

function labelType(type: ResourceType) {
  const label = type.replace("-", " ");
  return label[0].toUpperCase() + label.slice(1);
}

export function FilterableContentGrid({
  locale,
  entries,
  mode,
}: FilterableContentGridProps) {
  const localeSwitcher = useTranslations("LocaleSwitcher");
  const [track, setTrack] = useState<TrackFilter>("all");
  const [type, setType] = useState<TypeFilter>(
    mode === "webinars" ? "webinar" : "all",
  );

  const filtered = useMemo(
    () =>
      entries.filter((entry) => {
        const trackMatches = track === "all" || entry.trackIds.includes(track);
        const typeMatches = type === "all" || entry.type === type;
        return trackMatches && typeMatches;
      }),
    [entries, track, type],
  );

  return (
    <div className="space-y-8">
      <div className="paper-panel rounded-lg p-4">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase text-secondary">
              {copy(locale, "Track")}
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                aria-pressed={track === "all"}
                className={cn(
                  "rounded-sm px-3 py-2 text-sm font-semibold",
                  track === "all"
                    ? "bg-primary text-surface-container-lowest"
                    : "bg-surface-container-low text-primary",
                )}
                onClick={() => setTrack("all")}
                type="button"
              >
                {copy(locale, "All tracks")}
              </button>
              {tracks.map((item) => (
                <button
                  aria-pressed={track === item.id}
                  className={cn(
                    "rounded-sm px-3 py-2 text-sm font-semibold",
                    track === item.id
                      ? "bg-primary text-surface-container-lowest"
                      : "bg-surface-container-low text-primary",
                  )}
                  key={item.id}
                  onClick={() => setTrack(item.id)}
                  type="button"
                >
                  {copy(locale, item.shortTitle)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 text-xs font-semibold uppercase text-secondary">
              {copy(locale, "Content type")}
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                aria-pressed={type === "all"}
                className={cn(
                  "rounded-sm px-3 py-2 text-sm font-semibold",
                  type === "all"
                    ? "bg-primary text-surface-container-lowest"
                    : "bg-surface-container-low text-primary",
                )}
                onClick={() => setType("all")}
                type="button"
              >
                {copy(locale, "All types")}
              </button>
              {contentTypes.map((item) => (
                <button
                  aria-pressed={type === item}
                  className={cn(
                    "rounded-sm px-3 py-2 text-sm font-semibold",
                    type === item
                      ? "bg-primary text-surface-container-lowest"
                      : "bg-surface-container-low text-primary",
                  )}
                  key={item}
                  onClick={() => setType(item)}
                  type="button"
                >
                  {copy(locale, labelType(item))}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((entry) => (
          <article className="paper-panel rounded-md p-6" key={entry.id}>
            <p className="text-xs font-semibold uppercase text-secondary">
              {copy(locale, labelType(entry.type))} / {copy(locale, entry.status)}
            </p>
            <h3 className="mt-3 text-2xl">{copy(locale, entry.title)}</h3>
            <p className="muted-copy mt-3 text-sm leading-6">
              {copy(locale, entry.description)}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {entry.trackIds.map((trackId) => {
                const item = tracks.find((trackItem) => trackItem.id === trackId);
                return item ? (
                  <span
                    className="rounded-sm bg-tertiary-fixed/55 px-2.5 py-1 text-xs font-semibold text-tertiary"
                    key={trackId}
                  >
                    {copy(locale, item.shortTitle)}
                  </span>
                ) : null;
              })}
            </div>
          </article>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="paper-panel rounded-md p-6 text-sm text-secondary">
          {copy(locale, "No matching items yet for {language}. More entries can be added from the content registry.").replace(
            "{language}",
            localeSwitcher(`localeNames.${locale}`),
          )}
        </div>
      ) : null}
    </div>
  );
}
