import { ImageResponse } from "next/og";

export const size = {
  width: 64,
  height: 64,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background:
            "linear-gradient(135deg, rgba(27,28,26,1) 0%, rgba(42,42,42,1) 100%)",
          color: "#ffddb6",
          display: "flex",
          fontFamily: "Georgia, serif",
          fontSize: 30,
          height: "100%",
          justifyContent: "center",
          width: "100%",
        }}
      >
        F
      </div>
    ),
    size,
  );
}
