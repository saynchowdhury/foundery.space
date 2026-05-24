import { NextRequest, NextResponse } from "next/server";
import { checkBotId } from "botid/server";
import { getServiceClient } from "@/lib/supabase";

export const runtime = "nodejs";
export const maxDuration = 10;

export async function POST(request: NextRequest) {
  const verification = await checkBotId();

  if (verification.isBot) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  try {
    const { message, section, opportunity_id, issues, suggestion } = await request.json();

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    if (message.trim().length > 2000) {
      return NextResponse.json({ error: "Message too long (max 2000 characters)" }, { status: 400 });
    }

    const finalSection = opportunity_id ? "opportunity" : (section || "general");
    const client = getServiceClient();

    const { data, error } = await client
      .from("feedback")
      .insert({
        user_id: null,
        message: message.trim(),
        section: finalSection,
        opportunity_id: opportunity_id || null,
        issues: Array.isArray(issues) ? issues : null,
        suggestion: suggestion && typeof suggestion === "string" ? suggestion.trim() : null,
      })
      .select("id, created_at")
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      feedback: {
        id: data.id,
        created_at: data.created_at,
      },
    });
  } catch (error) {
    console.error("Error submitting feedback:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
