"use client";

export function trackPlacementEvent(
  name: string,
  payload: Record<string, unknown> = {},
) {
  if (typeof window === "undefined") return;

  const target = window as typeof window & { dataLayer?: unknown[] };
  target.dataLayer?.push({ event: name, ...payload });
}
