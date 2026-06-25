"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Search } from "lucide-react";

import type { SoundLesson, SoundGroup } from "@/content/phonetics-course";
import { cn } from "@/lib/utils";

import { AudioButton } from "./audio-button";

type SoundChartProps = {
  sounds: SoundLesson[];
};

const filters: Array<{ label: string; value: "all" | SoundGroup }> = [
  { label: "All", value: "all" },
  { label: "Consonants", value: "consonants" },
  { label: "Vowels", value: "vowels" },
];

function getChartSpeechText(sound: SoundLesson) {
  return `Listen and repeat. ${sound.example.text}. ${sound.example.text}. Study this sound in the full lesson.`;
}

export function SoundChart({ sounds }: SoundChartProps) {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | SoundGroup>("all");

  const filteredSounds = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return sounds.filter((sound) => {
      const matchesGroup = activeFilter === "all" || sound.group === activeFilter;
      if (!normalizedQuery) {
        return matchesGroup;
      }

      const searchable = [
        sound.ipa,
        sound.title,
        sound.example.text,
        sound.example.ipa,
        sound.hint,
        ...sound.spellings,
      ]
        .join(" ")
        .toLowerCase();

      return matchesGroup && searchable.includes(normalizedQuery);
    });
  }, [activeFilter, query, sounds]);

  return (
    <div className="space-y-5">
      <div className="paper-panel rounded-md p-4">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <label className="relative block">
            <span className="sr-only">Search IPA symbols, sounds, or examples</span>
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-secondary"
            />
            <input
              className="premium-input min-h-12 pl-10"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search IPA, examples, or spellings"
              type="search"
              value={query}
            />
          </label>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter sound chart">
            {filters.map((filter) => (
              <button
                className={cn(
                  "rounded-sm border px-3 py-2 text-sm font-semibold",
                  activeFilter === filter.value
                    ? "border-primary bg-primary text-surface-container-lowest"
                    : "border-outline-variant/70 bg-white/75 text-primary hover:border-accent-blue/45",
                )}
                key={filter.value}
                onClick={() => setActiveFilter(filter.value)}
                type="button"
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filteredSounds.map((sound) => (
          <article className="paper-panel motion-card rounded-md p-5" key={sound.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-3xl font-semibold text-primary">{sound.ipa}</p>
                <h3 className="mt-2 text-xl">{sound.example.text}</h3>
                <p className="mt-1 text-sm font-semibold text-secondary">
                  {sound.example.ipa}
                </p>
              </div>
              <span
                className={cn(
                  "rounded-sm px-2.5 py-1 text-xs font-bold uppercase",
                  sound.group === "consonants"
                    ? "bg-accent-pale-blue text-accent-navy"
                    : "bg-accent-pale-red text-tertiary",
                )}
              >
                {sound.group === "consonants" ? "Consonant" : "Vowel"}
              </span>
            </div>
            <p className="muted-copy mt-4 text-sm leading-6">{sound.hint}</p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <AudioButton
                compact
                label={sound.example.text}
                speechText={getChartSpeechText(sound)}
                text={sound.audioText}
              />
              <a
                className="button-tertiary text-sm"
                href={`#sound-${sound.id}`}
              >
                Study lesson
                <ArrowRight aria-hidden="true" className="size-4" />
              </a>
            </div>
          </article>
        ))}
      </div>

      {filteredSounds.length === 0 ? (
        <p className="rounded-md border border-outline-variant/60 bg-white/70 p-4 text-sm text-secondary">
          No sounds match that search yet.
        </p>
      ) : null}
    </div>
  );
}
