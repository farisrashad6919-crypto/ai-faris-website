"use client";

import { useState } from "react";
import { Check, Copy, Printer } from "lucide-react";

import { cn } from "@/lib/utils";

type CopyPracticeButtonProps = {
  text: string;
  className?: string;
};

export function CopyPracticeButton({ text, className }: CopyPracticeButtonProps) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      className={cn("button-secondary", className)}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1800);
        } catch {
          setCopied(false);
        }
      }}
      type="button"
    >
      {copied ? (
        <Check aria-hidden="true" className="size-4" />
      ) : (
        <Copy aria-hidden="true" className="size-4" />
      )}
      <span>{copied ? "Copied" : "Copy practice words"}</span>
    </button>
  );
}

export function PrintCourseButton({ className }: { className?: string }) {
  return (
    <button
      className={cn("button-secondary", className)}
      onClick={() => window.print()}
      type="button"
    >
      <Printer aria-hidden="true" className="size-4" />
      <span>Print this course</span>
    </button>
  );
}
