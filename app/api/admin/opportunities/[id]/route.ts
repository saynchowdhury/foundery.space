import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { normalizeOpportunityPayload, fetchById } from "@/lib/opportunity-admin";
import { getServiceClient } from "@/lib/supabase";

export const runtime = "nodejs";
export const maxDuration = 60;

type RouteParams = {
  params: Promise<{ id: string }>;
};

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

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const authErr = checkAuth(request);
  if (authErr) return authErr;

  const { id: paramId } = await params;
  console.info("[admin:PUT] updating", paramId);

  try {
    const formData = await request.formData();
    const payload = formData.get("payload");

    if (!payload || typeof payload !== "string") {
      return NextResponse.json({ error: "Missing payload in request" }, { status: 400 });
    }

    let parsedPayload: Record<string, unknown>;
    try {
      parsedPayload = JSON.parse(payload) as Record<string, unknown>;
    } catch {
      return NextResponse.json({ error: "Invalid payload format" }, { status: 400 });
    }

    let normalizedPayload: ReturnType<typeof normalizeOpportunityPayload>;
    try {
      normalizedPayload = normalizeOpportunityPayload(parsedPayload);
    } catch {
      return NextResponse.json({ error: "Invalid opportunity data" }, { status: 400 });
    }

    const client = getServiceClient();

    const existing = await fetchById(paramId);
    if (!existing) {
      console.error("[admin:PUT] not found", paramId);
      return NextResponse.json({ error: "Opportunity not found" }, { status: 404 });
    }

    const id =
      typeof parsedPayload.id === "string" && parsedPayload.id.trim().length > 0
        ? parsedPayload.id.trim()
        : existing.id;

    const updates: Record<string, unknown> = {
      name: normalizedPayload.name,
      description: normalizedPayload.description,
      full_description: normalizedPayload.fullDescription,
      open_date: normalizedPayload.openDate,
      close_date: normalizedPayload.closeDate,
      tags: normalizedPayload.tags,
      category: normalizedPayload.category,
      region: normalizedPayload.region,
      country: normalizedPayload.country,
      eligibility: normalizedPayload.eligibility,
      apply_link: normalizedPayload.applyLink,
      benefits: normalizedPayload.benefits,
      organizer: normalizedPayload.organizer,
      duration: normalizedPayload.duration || null,
      funding: normalizedPayload.funding || null,
      application_video: normalizedPayload.applicationVideo || null,
    };

    const { data, error } = await client
      .from("opportunities")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error || !data) {
      console.error("[admin:PUT] update failed", error);
      return NextResponse.json({ error: "Failed to update opportunity" }, { status: 500 });
    }

    try {
      revalidatePath(`/opportunity/${id}`);
    } catch (revalidateError) {
      console.warn("Failed to revalidate path:", revalidateError);
    }

    const result = {
      ...data,
      mongoId: undefined,
      logoUrl: data.logo_url,
      shareImageUrl: data.share_image_url,
      fullDescription: data.full_description,
      openDate: data.open_date,
      closeDate: data.close_date,
      applyLink: data.apply_link,
      applicationVideo: data.application_video,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error updating opportunity:", error);
    return NextResponse.json({ error: "Failed to update opportunity" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const authErr = checkAuth(request);
  if (authErr) return authErr;

  const { id } = await params;

  try {
    const client = getServiceClient();
    const { error, count } = await client
      .from("opportunities")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error("Error deleting opportunity:", error);
    return NextResponse.json({ error: "Failed to delete opportunity" }, { status: 500 });
  }
}
