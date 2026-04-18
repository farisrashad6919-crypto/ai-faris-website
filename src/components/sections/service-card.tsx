import { Check } from "lucide-react";

import { ButtonLink } from "@/components/ui/button-link";

type ServiceCardProps = {
  title: string;
  description: string;
  audience: string;
  outcomes: string[];
  href: string;
  ctaLabel: string;
};

export function ServiceCard({
  title,
  description,
  audience,
  outcomes,
  href,
  ctaLabel,
}: ServiceCardProps) {
  return (
    <article className="paper-panel flex h-full flex-col justify-between rounded-lg p-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <p className="eyebrow">{audience}</p>
          <h3 className="text-2xl">{title}</h3>
        </div>
        <p className="muted-copy text-base leading-7">{description}</p>
        <ul className="grid gap-3">
          {outcomes.map((outcome) => (
            <li className="flex items-start gap-3 text-sm leading-6" key={outcome}>
              <Check className="mt-1 size-4 shrink-0 text-on-tertiary-container" />
              <span>{outcome}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-6">
        <ButtonLink href={href} variant="tertiary">
          {ctaLabel}
        </ButtonLink>
      </div>
    </article>
  );
}
