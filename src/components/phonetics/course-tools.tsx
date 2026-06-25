"use client";

import { useState } from "react";
import { Check, Copy, Download, Printer } from "lucide-react";

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

export function DownloadPracticeRoutineButton({
  className,
  text,
}: {
  className?: string;
  text: string;
}) {
  return (
    <button
      className={cn("button-secondary", className)}
      onClick={() => {
        const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
        const href = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = href;
        link.download = "american-english-phonetics-practice-routine.txt";
        document.body.append(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(href);
      }}
      type="button"
    >
      <Download aria-hidden="true" className="size-4" />
      <span>Download practice routine</span>
    </button>
  );
}
