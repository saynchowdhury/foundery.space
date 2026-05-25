import { ImageResponse } from "next/og";

export const contentType = "image/png";
export const size = { width: 1200, height: 630 };
export const alt = "Foundery.Space — Discover Fellowships, Grants & Startup Opportunities";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 50%, #16213e 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-50%",
            right: "-20%",
            width: "800px",
            height: "800px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(91,108,255,0.15) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-30%",
            left: "-10%",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "16px",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, #5b6cff 0%, #a855f7 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
              fontWeight: 700,
              color: "white",
            }}
          >
            F
          </div>
          <span
            style={{
              fontSize: "48px",
              fontWeight: 700,
              color: "white",
              letterSpacing: "-1px",
            }}
          >
            Foundery.Space
          </span>
        </div>
        <span
          style={{
            fontSize: "28px",
            color: "#a0a0b8",
            textAlign: "center",
            maxWidth: "700px",
            lineHeight: 1.4,
          }}
        >
          Discover Fellowships, Grants & Startup Opportunities
        </span>
        <div
          style={{
            display: "flex",
            gap: "32px",
            marginTop: "32px",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <span style={{ fontSize: "32px", fontWeight: 700, color: "#5b6cff" }}>93+</span>
            <span style={{ fontSize: "16px", color: "#6b7280" }}>Programs</span>
          </div>
          <div style={{ width: "1px", height: "32px", background: "#374151" }} />
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <span style={{ fontSize: "32px", fontWeight: 700, color: "#5b6cff" }}>73</span>
            <span style={{ fontSize: "16px", color: "#6b7280" }}>Open Now</span>
          </div>
          <div style={{ width: "1px", height: "32px", background: "#374151" }} />
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <span style={{ fontSize: "32px", fontWeight: 700, color: "#5b6cff" }}>9</span>
            <span style={{ fontSize: "16px", color: "#6b7280" }}>Categories</span>
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "24px",
            fontSize: "14px",
            color: "#4b5563",
          }}
        >
          foundery.space
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
