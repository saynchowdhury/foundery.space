import { NextResponse, type NextRequest } from "next/server";
import { checkBotId } from "botid/server";
import { getServiceClient } from "@/lib/supabase";

export const runtime = "nodejs";
export const maxDuration = 10;

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const verification = await checkBotId();

  if (verification.isBot) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  try {
    const { id } = await params;
    const body = (await request.json().catch(() => ({}))) as {
      voterId?: string;
      action?: "up" | "down";
    };

    const voterId = String(body.voterId || "").trim();
    if (!voterId || voterId.length > 128) {
      return NextResponse.json({ error: "Invalid voter id" }, { status: 400 });
    }

    const action = body.action === "down" ? "down" : "up";
    const client = getServiceClient();

    const { data: current } = await client
      .from("opportunities")
      .select("voters")
      .eq("id", id)
      .single();

    if (!current) {
      return NextResponse.json({ error: "Opportunity not found" }, { status: 404 });
    }

    const voters: string[] = Array.isArray(current.voters) ? current.voters : [];
    const updatedVoters =
      action === "up"
        ? Array.from(new Set([...voters, voterId]))
        : voters.filter((v: string) => v !== voterId);

    const { data: updated, error } = await client
      .from("opportunities")
      .update({ voters: updatedVoters })
      .eq("id", id)
      .select("voters")
      .single();

    if (error || !updated) {
      return NextResponse.json({ error: "Vote failed" }, { status: 500 });
    }

    const finalVoters: string[] = Array.isArray(updated.voters) ? updated.voters : [];

    return NextResponse.json({
      votes: finalVoters.length,
      voted: finalVoters.includes(voterId),
    });
  } catch (error) {
    console.error("Vote error:", error);
    return NextResponse.json({ error: "Vote failed" }, { status: 500 });
  }
}
