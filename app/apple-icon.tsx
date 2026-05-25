import { ImageResponse } from "next/og";

export const contentType = "image/png";
export const size = { width: 180, height: 180 };

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #5b6cff 0%, #a855f7 100%)",
          borderRadius: "24px",
          fontSize: "80px",
          fontWeight: 700,
          color: "white",
        }}
      >
        F
      </div>
    ),
    { ...size },
  );
}
