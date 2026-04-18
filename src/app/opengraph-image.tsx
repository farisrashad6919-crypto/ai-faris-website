import { ImageResponse } from "next/og";

import { siteConfig } from "@/config/site";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background:
            "radial-gradient(circle at top left, rgba(255,221,182,0.65), transparent 28%), linear-gradient(180deg, #fbf9f5, #f5f3ef)",
          color: "#151515",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "space-between",
          padding: "72px",
          width: "100%",
        }}
      >
        <div
          style={{
            color: "#a98c69",
            fontFamily: "sans-serif",
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: 5,
            textTransform: "uppercase",
          }}
        >
          Premium English & Communication Training
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 18,
            maxWidth: 860,
          }}
        >
          <div
            style={{
              fontFamily: "Georgia, serif",
              fontSize: 72,
              lineHeight: 1.08,
            }}
          >
            {siteConfig.brandName}
          </div>
          <div
            style={{
              color: "#4f6073",
              display: "flex",
              fontFamily: "sans-serif",
              fontSize: 28,
              lineHeight: 1.5,
            }}
          >
            Elegant multilingual coaching for speaking confidence, business
            communication, IELTS preparation, and articulate English presence.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
