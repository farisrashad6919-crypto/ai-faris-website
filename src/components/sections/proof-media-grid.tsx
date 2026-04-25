import Image from "next/image";

import type { Locale } from "@/i18n/routing";
import type { ProofMediaItem } from "@/content/types";
import { copy, uiCopy } from "@/content/locale-copy";

export function ProofMediaGrid({
  items,
  locale,
}: {
  items: ProofMediaItem[];
  locale: Locale;
}) {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {items.map((item) => (
        <figure className="paper-panel overflow-hidden rounded-lg" key={item.id}>
          <div className="relative aspect-[16/9] bg-surface-container-low">
            <Image
              alt={copy(locale, item.alt)}
              className="object-cover"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              src={item.src}
            />
          </div>
          <figcaption className="space-y-2 p-5">
            <p className="font-display text-xl text-primary">{copy(locale, item.caption)}</p>
            <p className="text-sm leading-6 text-secondary">
              {copy(locale, item.privacyNote ?? uiCopy.common.proofNote)}
            </p>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
