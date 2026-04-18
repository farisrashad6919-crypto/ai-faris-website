import { Minus, Plus } from "lucide-react";

type FaqItem = {
  question: string;
  answer: string;
};

type FaqListProps = {
  items: FaqItem[];
};

export function FaqList({ items }: FaqListProps) {
  return (
    <div className="grid gap-4">
      {items.map((item) => (
        <details
          className="paper-panel group rounded-md px-5 py-4"
          key={item.question}
        >
          <summary className="flex items-start justify-between gap-4 text-start">
            <span className="font-display text-xl text-primary">
              {item.question}
            </span>
            <span className="relative mt-1 size-5 shrink-0 text-secondary">
              <Plus
                aria-hidden="true"
                className="absolute inset-0 group-open:rotate-45 group-open:opacity-0"
              />
              <Minus
                aria-hidden="true"
                className="absolute inset-0 opacity-0 group-open:opacity-100"
              />
            </span>
          </summary>
          <p className="muted-copy mt-4 max-w-3xl text-base leading-7">
            {item.answer}
          </p>
        </details>
      ))}
    </div>
  );
}
