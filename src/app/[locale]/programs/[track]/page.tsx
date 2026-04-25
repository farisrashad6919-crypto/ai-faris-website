import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { setRequestLocale } from "next-intl/server";

import { TrackLandingPage } from "@/components/pages/track-landing-page";
import { getTrackBySlug, tracks } from "@/content/tracks";
import { resolveLocale } from "@/lib/locale";
import { getPageMetadata } from "@/lib/metadata";

type PageProps = {
  params: Promise<{ locale: string; track: string }>;
};

export function generateStaticParams() {
  return tracks.map((track) => ({ track: track.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { track: trackSlug } = await params;
  const locale = await resolveLocale(params);
  const track = getTrackBySlug(trackSlug);

  if (!track) {
    return {};
  }

  return getPageMetadata(locale, track.id);
}

export default async function TrackRoute({ params }: PageProps) {
  const { track: trackSlug } = await params;
  const locale = await resolveLocale(params);
  const track = getTrackBySlug(trackSlug);

  if (!track) {
    notFound();
  }

  setRequestLocale(locale);

  return <TrackLandingPage locale={locale} track={track} />;
}
