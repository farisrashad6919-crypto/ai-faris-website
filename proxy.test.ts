import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";

import proxy from "./src/proxy";

describe("proxy locale negotiation", () => {
  it("redirects supported requested languages to their locale route", () => {
    const request = new NextRequest("https://example.com/", {
      headers: {
        "accept-language": "fr-FR,fr;q=0.9",
      },
    });

    const response = proxy(request);

    expect(response?.headers.get("location")).toBe("https://example.com/fr");
  });

  it("redirects to Arabic when the request prefers Arabic", () => {
    const request = new NextRequest("https://example.com/", {
      headers: {
        "accept-language": "ar-EG,ar;q=0.9,en;q=0.7",
      },
    });

    const response = proxy(request);

    expect(response?.headers.get("location")).toBe("https://example.com/ar");
  });

  it("permanently redirects legacy services and results routes", () => {
    const services = proxy(new NextRequest("https://example.com/en/services"));
    const results = proxy(new NextRequest("https://example.com/en/results"));

    expect(services?.headers.get("location")).toBe(
      "https://example.com/en/programs",
    );
    expect(services?.status).toBe(301);
    expect(results?.headers.get("location")).toBe(
      "https://example.com/en/reviews",
    );
    expect(results?.status).toBe(301);
  });
});
