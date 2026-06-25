"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Square, Volume2 } from "lucide-react";

import { cn } from "@/lib/utils";

type AudioButtonProps = {
  text: string;
  label: string;
  speechText?: string;
  audioSrc?: string;
  ipa?: string;
  lang?: string;
  pitch?: number;
  rate?: number;
  type?: "sound" | "word" | "minimal-pair" | "sentence" | "paragraph" | "rule";
  className?: string;
  compact?: boolean;
};

let activeAudio: HTMLAudioElement | null = null;

function stopCurrentAudio() {
  if (activeAudio) {
    activeAudio.pause();
    activeAudio.currentTime = 0;
    activeAudio = null;
  }

  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

function getAmericanVoice() {
  if (!("speechSynthesis" in window)) {
    return null;
  }

  const voices = window.speechSynthesis.getVoices();
  return (
    voices.find((voice) => voice.lang === "en-US" && /Natural|Jenny|Aria|Samantha|Google|Microsoft|Online/i.test(voice.name)) ??
    voices.find((voice) => voice.lang === "en-US") ??
    voices.find((voice) => voice.lang.startsWith("en")) ??
    null
  );
}

function normalizeSpeechText(value: string) {
  return value
    .replace(/\/[^/\n]+\//g, " ")
    .replace(/\[[^\]\n]+\]/g, " ")
    .replace(/[ˈˌ]/g, "")
    .replace(/->/g, " to ")
    .replace(/[–—]/g, ", ")
    .replace(/\s+-\s+/g, ", ")
    .replace(/[()]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getFallbackSpeechText(value: string) {
  const cleanText = normalizeSpeechText(value);

  if (!cleanText) {
    return "";
  }

  if (/^(listen|first|now|sentence|repeat)\b/i.test(cleanText)) {
    return cleanText;
  }

  return `Listen and repeat. ${cleanText}. ${cleanText}.`;
}

export function AudioButton({
  text,
  label,
  speechText,
  audioSrc,
  lang = "en-US",
  pitch = 0.96,
  rate = 0.76,
  className,
  compact = false,
}: AudioButtonProps) {
  const id = useId();
  const [isPlaying, setIsPlaying] = useState(false);
  const [message, setMessage] = useState("");
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    const resetIfAnotherStarted = (event: Event) => {
      const detail = (event as CustomEvent<{ id: string }>).detail;

      if (detail?.id !== id) {
        setIsPlaying(false);
      }
    };

    window.addEventListener("phonetics-audio-start", resetIfAnotherStarted);

    return () => {
      window.removeEventListener("phonetics-audio-start", resetIfAnotherStarted);
      if (utteranceRef.current) {
        utteranceRef.current.onend = null;
        utteranceRef.current.onerror = null;
      }
    };
  }, [id]);

  const speakFallback = () => {
    if (!("speechSynthesis" in window)) {
      setMessage("Audio is not available in this browser.");
      setIsPlaying(false);
      return;
    }

    const preparedText = getFallbackSpeechText(speechText ?? text);

    if (!preparedText) {
      setMessage("No readable audio text is available for this item.");
      setIsPlaying(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(preparedText);
    utterance.lang = lang;
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.voice = getAmericanVoice();
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => {
      setMessage("Audio could not play.");
      setIsPlaying(false);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const playAudio = async () => {
    if (typeof window === "undefined") {
      return;
    }

    if (isPlaying) {
      stopCurrentAudio();
      setIsPlaying(false);
      return;
    }

    window.dispatchEvent(new CustomEvent("phonetics-audio-start", { detail: { id } }));
    stopCurrentAudio();
    setMessage("");
    setIsPlaying(true);

    if (audioSrc) {
      // Add MP3 paths later in /public/audio/phonetics; this button will use them before browser TTS.
      const audio = new Audio(audioSrc);
      activeAudio = audio;
      audio.onended = () => setIsPlaying(false);
      audio.onerror = () => speakFallback();

      try {
        await audio.play();
      } catch {
        speakFallback();
      }
      return;
    }

    speakFallback();
  };

  return (
    <span className="inline-flex items-center gap-2">
      <button
        aria-label={isPlaying ? `Stop pronunciation for ${label}` : `Play pronunciation for ${label}`}
        className={cn(
          "inline-flex min-h-10 items-center justify-center gap-2 rounded-sm border border-accent-blue/24 bg-white/80 px-3 py-2 text-sm font-semibold text-primary shadow-sm hover:-translate-y-0.5 hover:border-accent-blue/42 hover:bg-accent-pale-blue/55",
          compact && "min-h-9 px-2.5 py-1.5 text-xs",
          className,
        )}
        onClick={playAudio}
        type="button"
      >
        {isPlaying ? (
          <Square aria-hidden="true" className="size-4" />
        ) : (
          <Volume2 aria-hidden="true" className="size-4" />
        )}
        <span>{isPlaying ? "Stop" : "Play"}</span>
      </button>
      <span aria-live="polite" className="sr-only">
        {message}
      </span>
    </span>
  );
}
