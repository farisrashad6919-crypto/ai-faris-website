"use client";

import { useState } from "react";
import { CheckCircle2, HelpCircle } from "lucide-react";

type QuizRevealItem = {
  question: string;
  options?: readonly string[];
  answer: string;
  explanation?: string;
};

type QuizRevealProps = {
  items: readonly QuizRevealItem[];
  title?: string;
};

export function QuizReveal({ items, title = "Check your understanding" }: QuizRevealProps) {
  const [openAnswers, setOpenAnswers] = useState<Record<number, boolean>>({});

  return (
    <div className="rounded-md border border-accent-blue/14 bg-white/72 p-4">
      <h4 className="font-display text-xl text-primary">{title}</h4>
      <div className="mt-4 grid gap-3">
        {items.map((item, index) => {
          const isOpen = Boolean(openAnswers[index]);

          return (
            <div className="rounded-sm bg-surface-container-lowest/90 p-4" key={`${item.question}-${index}`}>
              <div className="flex gap-3">
                <HelpCircle aria-hidden="true" className="mt-1 size-5 shrink-0 text-on-tertiary-container" />
                <div className="min-w-0">
                  <p className="font-semibold text-primary">{item.question}</p>
                  {item.options?.length ? (
                    <ul className="mt-3 grid gap-2 text-sm text-secondary sm:grid-cols-2">
                      {item.options.map((option) => (
                        <li className="rounded-sm border border-outline-variant/40 bg-white/70 px-3 py-2" key={option}>
                          {option}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </div>
              <button
                className="mt-4 inline-flex items-center gap-2 rounded-sm border border-accent-blue/24 bg-white/82 px-3 py-2 text-sm font-semibold text-primary hover:border-accent-blue/46 hover:bg-accent-pale-blue/55"
                onClick={() =>
                  setOpenAnswers((current) => ({
                    ...current,
                    [index]: !isOpen,
                  }))
                }
                type="button"
              >
                <CheckCircle2 aria-hidden="true" className="size-4" />
                {isOpen ? "Hide answer" : "Show answer"}
              </button>
              {isOpen ? (
                <div className="mt-3 rounded-sm bg-accent-pale-blue/68 p-3 text-sm leading-6 text-primary">
                  <p>
                    <span className="font-semibold">Answer:</span> {item.answer}
                  </p>
                  {item.explanation ? (
                    <p className="mt-1 text-secondary">{item.explanation}</p>
                  ) : null}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
