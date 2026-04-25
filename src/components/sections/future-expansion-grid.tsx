import {
  FileText,
  GraduationCap,
  HelpCircle,
  PlayCircle,
  Presentation,
  Wrench,
} from "lucide-react";

import { copy } from "@/content/locale-copy";
import type { FutureItem, ResourceType } from "@/content/types";
import type { Locale } from "@/i18n/routing";

const icons: Record<ResourceType, typeof FileText> = {
  article: FileText,
  video: PlayCircle,
  quiz: HelpCircle,
  "placement-test": GraduationCap,
  tool: Wrench,
  webinar: Presentation,
};

export function FutureExpansionGrid({
  items,
  locale,
}: {
  items: FutureItem[];
  locale: Locale;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => {
        const Icon = icons[item.type];
        const label = item.type.replace("-", " ");
        const typeLabel = label[0].toUpperCase() + label.slice(1);

        return (
          <article className="paper-panel rounded-md p-5" key={item.title}>
            <div className="flex items-start gap-4">
              <div className="rounded-sm bg-tertiary-fixed/55 p-2 text-tertiary">
                <Icon className="size-5" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-secondary">
                  {copy(locale, typeLabel)}
                </p>
                <h3 className="mt-2 text-2xl">{copy(locale, item.title)}</h3>
                <p className="muted-copy mt-2 text-sm leading-6">
                  {copy(locale, item.description)}
                </p>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
