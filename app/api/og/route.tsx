/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";
import type { Opportunity } from "@/lib/data";

export const runtime = "nodejs";
export const maxDuration = 10;

export const fetchCache = "force-no-store";

export async function GET(req: NextRequest) {
  try {
    const { searchParams, origin } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return new ImageResponse(
        (
          <div
            style={{
              background: "linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)",
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "16px",
              fontFamily: "sans-serif",
            }}
          >
            <div style={{ color: "#a78bfa", fontSize: 72, fontWeight: 700, letterSpacing: "0.05em" }}>
              Foundery.Space
            </div>
            <div style={{ color: "#64748b", fontSize: 28 }}>
              Fellowships · Grants · Accelerators · Developer Programs
            </div>
          </div>
        ),
        { width: 1200, height: 630 }
      );
    }

    let opportunity: Opportunity | undefined;

    try {
      const response = await fetch(`${origin}/api/opportunities?id=${id}`, { cache: "no-store" });

      if (response.ok) {
        opportunity = (await response.json()) as Opportunity | undefined;
      }
    } catch (error) {
      console.error("Error fetching opportunity for OG", error);
    }

    if (!opportunity) {
      return new ImageResponse(
        (
          <div
            style={{
              background: "linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)",
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: 48,
            }}
          >
            Opportunity not found
          </div>
        ),
        { width: 1200, height: 630 }
      );
    }

    const deadlineText =
      opportunity.closeDate === "closed"
        ? "Closed"
        : !opportunity.closeDate
          ? "Rolling deadline"
          : (() => {
              const days = Math.ceil(
                (new Date(opportunity.closeDate).getTime() - Date.now()) / 86400000
              );
              if (days < 0) return "Closed";
              if (days === 0) return "Closes today";
              if (days === 1) return "1 day left";
              if (days < 30) return `${days} days left`;
              return `Closes ${new Date(opportunity.closeDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
            })();

    return new ImageResponse(
      (
        <div
          style={{
            background: "linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)",
            width: "100%",
            height: "100%",
            display: "flex",
            padding: "56px",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "space-between",
            fontFamily: "sans-serif",
          }}
        >
          {/* Top: logo + name */}
          <div style={{ display: "flex", alignItems: "center", gap: "28px" }}>
            {opportunity.logoUrl && (
              <img
                src={opportunity.logoUrl}
                alt=""
                width="96"
                height="96"
                style={{ borderRadius: "12px", objectFit: "cover" }}
              />
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <div style={{ color: "#a78bfa", fontSize: 18, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                {opportunity.category.replace(/_/g, " ")} · {opportunity.region}
              </div>
              <div style={{ color: "white", fontSize: 52, fontWeight: 700, lineHeight: 1.15, maxWidth: "900px" }}>
                {opportunity.name}
              </div>
            </div>
          </div>

          {/* Middle: description */}
          <div style={{ color: "#cbd5e1", fontSize: 26, lineHeight: 1.5, maxWidth: "1000px" }}>
            {opportunity.description.length > 160
              ? opportunity.description.slice(0, 157) + "..."
              : opportunity.description}
          </div>

          {/* Bottom: deadline + tags + branding */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <div style={{
                background: "rgba(167,139,250,0.15)",
                border: "1px solid rgba(167,139,250,0.4)",
                padding: "8px 20px",
                color: "#a78bfa",
                fontSize: 22,
                fontWeight: 600,
              }}>
                {deadlineText}
              </div>
              {opportunity.tags.slice(0, 3).map((tag) => (
                <div key={tag} style={{
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  padding: "8px 16px",
                  color: "#94a3b8",
                  fontSize: 18,
                }}>
                  {tag}
                </div>
              ))}
            </div>
            <div style={{ color: "#a78bfa", fontSize: 22, fontWeight: 700, letterSpacing: "0.05em" }}>
              Foundery.Space
            </div>
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    );
  } catch (e) {
    return new Response(`Failed to generate image`, {
      status: 500,
    });
  }
}
