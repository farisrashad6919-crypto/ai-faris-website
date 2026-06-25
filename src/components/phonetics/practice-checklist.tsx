"use client";

import { useEffect, useMemo, useState } from "react";
import { RotateCcw } from "lucide-react";

import { cn } from "@/lib/utils";

type PracticeChecklistProps = {
  storageId: string;
  items: readonly string[];
  title?: string;
  className?: string;
};

export function PracticeChecklist({
  storageId,
  items,
  title = "Self-study checklist",
  className,
}: PracticeChecklistProps) {
  const storageKey = `phonetics-checklist:${storageId}`;
  const [checked, setChecked] = useState<boolean[]>(() => items.map(() => false));
  const [hasLoaded, setHasLoaded] = useState(false);
  const completed = useMemo(
    () => checked.filter(Boolean).length,
    [checked],
  );

  useEffect(() => {
    let cancelled = false;
    const timer = window.setTimeout(() => {
      try {
        const saved = window.localStorage.getItem(storageKey);
        if (saved && !cancelled) {
          const parsed = JSON.parse(saved) as boolean[];
          setChecked(items.map((_, index) => Boolean(parsed[index])));
        }
      } catch {
        if (!cancelled) {
          setChecked(items.map(() => false));
        }
      } finally {
        if (!cancelled) {
          setHasLoaded(true);
        }
      }
    }, 0);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [items, storageKey]);

  useEffect(() => {
    if (!hasLoaded) {
      return;
    }

    try {
      window.localStorage.setItem(storageKey, JSON.stringify(checked));
    } catch {
      return;
    }
  }, [checked, hasLoaded, storageKey]);

  return (
    <div className={cn("rounded-md border border-accent-blue/14 bg-white/72 p-4", className)}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h4 className="font-display text-lg text-primary">{title}</h4>
          <p className="mt-1 text-xs font-semibold uppercase text-secondary">
            {completed} of {items.length} complete on this device
          </p>
        </div>
        <button
          aria-label={`Reset checklist for ${title}`}
          className="inline-flex size-9 items-center justify-center rounded-sm border border-outline-variant/60 bg-white/75 text-secondary hover:border-accent-blue/40 hover:text-primary"
          onClick={() => setChecked(items.map(() => false))}
          type="button"
        >
          <RotateCcw aria-hidden="true" className="size-4" />
        </button>
      </div>
      <div className="mt-4 grid gap-2">
        {items.map((item, index) => (
          <label
            className="flex items-start gap-3 rounded-sm bg-surface-container-lowest/80 px-3 py-2 text-sm leading-6 text-on-surface"
            key={item}
          >
            <input
              checked={checked[index] ?? false}
              className="mt-1 size-4 rounded border-outline-variant text-accent-blue"
              onChange={(event) => {
                const next = [...checked];
                next[index] = event.target.checked;
                setChecked(next);
              }}
              type="checkbox"
            />
            <span>{item}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
