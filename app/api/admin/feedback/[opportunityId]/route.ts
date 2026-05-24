import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";

export const runtime = "nodejs";
export const maxDuration = 10;

type RouteParams = {
  params: Promise<{ opportunityId: string }>;
};

export async function GET(request: NextRequest, { params }: RouteParams) {
  const adminToken = process.env.ADMIN_TOKEN;
  if (!adminToken) {
    return NextResponse.json({ error: "Admin token not configured" }, { status: 500 });
  }
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");
  if (token !== adminToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { opportunityId } = await params;
    const client = getServiceClient();

    const { data, error } = await client
      .from("feedback")
      .select("*")
      .eq("opportunity_id", opportunityId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({
      feedback: (data || []).map((doc) => ({
        id: doc.id,
        message: doc.message,
        section: doc.section,
        opportunity_id: doc.opportunity_id,
        issues: doc.issues || null,
        suggestion: doc.suggestion || null,
        created_at: doc.created_at,
        user: {
          id: doc.user_id,
          name: null,
          email: null,
          image: null,
        },
      })),
    });
  } catch (error) {
    console.error("Error fetching feedback:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
