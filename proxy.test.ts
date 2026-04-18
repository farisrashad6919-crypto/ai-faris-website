import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";

import proxy from "./proxy";

describe("proxy locale negotiation", () => {
  it("redirects unsupported languages to the English default", () => {
    const request = new NextRequest("https://example.com/", {
      headers: {
        "accept-language": "fr-FR,fr;q=0.9",
      },
    });

    const response = proxy(request);

    expect(response?.headers.get("location")).toBe("https://example.com/en");
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
});
