import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";

export const runtime = "nodejs";
export const maxDuration = 30;

function checkAuth(request: NextRequest): NextResponse | null {
  const adminToken = process.env.ADMIN_TOKEN;
  if (!adminToken) {
    return NextResponse.json({ error: "Admin token not configured" }, { status: 500 });
  }
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");
  if (token !== adminToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export async function GET(request: NextRequest) {
  const authErr = checkAuth(request);
  if (authErr) return authErr;

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "pending";
    const client = getServiceClient();

    const { data, error } = await client
      .from("suggestions")
      .select("*")
      .eq("status", status)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({
      suggestions: (data || []).map((doc: Record<string, unknown>) => ({
        id: doc.id,
        type: doc.type,
        url: doc.url || null,
        name: doc.name || null,
        organizer: doc.organizer || null,
        description: doc.description || null,
        full_description: doc.full_description || null,
        open_date: doc.open_date || null,
        close_date: doc.close_date || null,
        category: doc.category || null,
        region: doc.region || null,
        eligibility: doc.eligibility || null,
        apply_link: doc.apply_link || null,
        tags: doc.tags || [],
        benefits: doc.benefits || [],
        status: doc.status,
        created_at: doc.created_at,
        updated_at: doc.updated_at,
      })),
    });
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const authErr = checkAuth(request);
  if (authErr) return authErr;

  try {
    const { id, status } = await request.json();

    if (!id || !status) {
      return NextResponse.json({ error: "Missing id or status" }, { status: 400 });
    }

    if (!["accepted", "rejected"].includes(status)) {
      return NextResponse.json({ error: "Invalid status. Must be 'accepted' or 'rejected'" }, { status: 400 });
    }

    const client = getServiceClient();
    const { error } = await client
      .from("suggestions")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating suggestion:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const authErr = checkAuth(request);
  if (authErr) return authErr;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const client = getServiceClient();
    const { error } = await client
      .from("suggestions")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting suggestion:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
