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
    const body = await request.json();
    const { type } = body as { type?: string };
    const client = getServiceClient();

    if (type === "url") {
      const { url } = body as { url?: string };
      if (!url || typeof url !== "string") {
        return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
      }

      await client.from("suggestions").insert({
        type: "url",
        url: url.trim(),
        status: "pending",
      });

      return NextResponse.json({ ok: true });
    }

    const { name, organizer, description, fullDescription, openDate, closeDate, category, region, eligibility, applyLink, tags, benefits } = body as Record<string, unknown>;

    if (!name || !organizer || !description || !fullDescription || !openDate || !closeDate || !category || !region || !eligibility || !applyLink) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await client.from("suggestions").insert({
      type: "full",
      name: String(name).trim(),
      organizer: String(organizer).trim(),
      description: String(description).trim(),
      full_description: String(fullDescription).trim(),
      open_date: String(openDate),
      close_date: String(closeDate),
      category: String(category),
      region: String(region),
      eligibility: String(eligibility).trim(),
      apply_link: String(applyLink).trim(),
      tags: Array.isArray(tags) ? tags.map(String) : [],
      benefits: Array.isArray(benefits) ? benefits.map(String).filter(Boolean) : [],
      status: "pending",
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error in /api/submit:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
