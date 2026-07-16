import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";

export const contentType = "image/png";
export const size = { width: 1200, height: 630 };
export const alt = "Foundery.Space — Discover Fellowships, Grants & Startup Opportunities";

export default function OpenGraphImage() {
  let logoDataUri = "";
  try {
    const logoPath = join(process.cwd(), "public/logo.png");
    const logoData = readFileSync(logoPath).toString("base64");
    logoDataUri = `data:image/png;base64,${logoData}`;
  } catch (error) {
    console.error("Error reading logo.png for OG image:", error);
  }

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
          background: "linear-gradient(135deg, #050505 0%, #140d0a 50%, #0a0503 100%)",
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
            background: "radial-gradient(circle, rgba(240,90,36,0.15) 0%, transparent 70%)",
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
            background: "radial-gradient(circle, rgba(240,90,36,0.08) 0%, transparent 70%)",
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
          {logoDataUri ? (
            <img
              src={logoDataUri}
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "12px",
              }}
            />
          ) : (
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "12px",
                background: "#F05A24",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "28px",
                fontWeight: 700,
                color: "black",
              }}
            >
              F
            </div>
          )}
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
            <span style={{ fontSize: "32px", fontWeight: 700, color: "#F05A24" }}>100+</span>
            <span style={{ fontSize: "16px", color: "#6b7280" }}>Programs</span>
          </div>
          <div style={{ width: "1px", height: "32px", background: "#374151" }} />
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <span style={{ fontSize: "32px", fontWeight: 700, color: "#F05A24" }}>Active</span>
            <span style={{ fontSize: "16px", color: "#6b7280" }}>Funding</span>
          </div>
          <div style={{ width: "1px", height: "32px", background: "#374151" }} />
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <span style={{ fontSize: "32px", fontWeight: 700, color: "#F05A24" }}>10</span>
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

