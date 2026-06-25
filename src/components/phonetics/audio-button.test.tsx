import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { AudioButton } from "./audio-button";

class MockSpeechSynthesisUtterance {
  lang = "";
  onend: null | (() => void) = null;
  onerror: null | (() => void) = null;
  pitch = 1;
  rate = 1;
  text: string;
  voice: unknown = null;

  constructor(text: string) {
    this.text = text;
  }
}

const speak = vi.fn();
const cancel = vi.fn();
const getVoices = vi.fn(() => [{ lang: "en-US", name: "Jenny" }]);

function installSpeechSynthesis() {
  Object.defineProperty(window, "SpeechSynthesisUtterance", {
    configurable: true,
    value: MockSpeechSynthesisUtterance,
  });
  Object.defineProperty(globalThis, "SpeechSynthesisUtterance", {
    configurable: true,
    value: MockSpeechSynthesisUtterance,
  });
  Object.defineProperty(window, "speechSynthesis", {
    configurable: true,
    value: {
      cancel,
      getVoices,
      speak,
    },
  });
}

function uninstallSpeechSynthesis() {
  Reflect.deleteProperty(window, "SpeechSynthesisUtterance");
  Reflect.deleteProperty(globalThis, "SpeechSynthesisUtterance");
  Reflect.deleteProperty(window, "speechSynthesis");
}

afterEach(() => {
  speak.mockReset();
  cancel.mockReset();
  getVoices.mockClear();
  uninstallSpeechSynthesis();
});

describe("AudioButton", () => {
  it("uses an American English speech synthesis voice and exposes a stop state", async () => {
    installSpeechSynthesis();
    render(<AudioButton label="think" text="think" />);

    fireEvent.click(screen.getByRole("button", { name: "Play pronunciation for think" }));

    expect(speak).toHaveBeenCalledTimes(1);
    expect(speak.mock.calls[0][0]).toMatchObject({
      lang: "en-US",
      pitch: 0.96,
      rate: 0.76,
      text: "Listen and repeat. think. think.",
      voice: { lang: "en-US", name: "Jenny" },
    });
    expect(
      screen.getByRole("button", { name: "Stop pronunciation for think" }),
    ).toBeInTheDocument();

    speak.mock.calls[0][0].onend();

    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: "Play pronunciation for think" }),
      ).toBeInTheDocument(),
    );
  });

  it("announces when browser audio is unavailable", () => {
    uninstallSpeechSynthesis();
    render(<AudioButton label="think" text="think" />);

    fireEvent.click(screen.getByRole("button", { name: "Play pronunciation for think" }));

    expect(screen.getByText("Audio is not available in this browser.")).toBeInTheDocument();
  });

  it("does not send IPA slashes or transcription symbols to speech synthesis", () => {
    installSpeechSynthesis();
    render(<AudioButton label="think" text="think /θɪŋk/ - tongue between teeth" />);

    fireEvent.click(screen.getByRole("button", { name: "Play pronunciation for think" }));

    expect(speak.mock.calls[0][0].text).toBe(
      "Listen and repeat. think, tongue between teeth. think, tongue between teeth.",
    );
  });
});
