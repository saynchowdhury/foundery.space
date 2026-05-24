import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { generateId, normalizeOpportunityPayload, fetchById } from "@/lib/opportunity-admin";
import { getServiceClient } from "@/lib/supabase";

export const runtime = "nodejs";
export const maxDuration = 20;

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

function mapRow(row: Record<string, unknown>) {
  return {
    ...row,
    mongoId: undefined,
    logoUrl: row.logo_url,
    shareImageUrl: row.share_image_url,
    fullDescription: row.full_description,
    openDate: row.open_date,
    closeDate: row.close_date,
    applyLink: row.apply_link,
    applicationVideo: row.application_video,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function GET(request: NextRequest) {
  const authErr = checkAuth(request);
  if (authErr) return authErr;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const client = getServiceClient();

    if (id) {
      const opp = await fetchById(id);
      if (!opp) {
        return NextResponse.json({ error: "Opportunity not found" }, { status: 404 });
      }
      return NextResponse.json(opp, { status: 200 });
    }

    const { data, error } = await client
      .from("opportunities")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    const result = (data || []).map((row: Record<string, unknown>) => ({
      ...row,
      mongoId: undefined,
      logoUrl: row.logo_url,
      shareImageUrl: row.share_image_url,
      fullDescription: row.full_description,
      openDate: row.open_date,
      closeDate: row.close_date,
      applyLink: row.apply_link,
      applicationVideo: row.application_video,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error listing opportunities:", error);
    return NextResponse.json({ error: "Failed to list opportunities" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authErr = checkAuth(request);
  if (authErr) return authErr;

  try {
    const formData = await request.formData();
    const payload = formData.get("payload");
    const logoFile = formData.get("logo");

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

    const id =
      typeof parsedPayload.id === "string" && parsedPayload.id.trim().length > 0
        ? parsedPayload.id.trim()
        : generateId(normalizedPayload.name);

    const client = getServiceClient();

    const { data: existing } = await client
      .from("opportunities")
      .select("id")
      .eq("id", id)
      .single();

    if (existing) {
      return NextResponse.json({ error: "An opportunity with this id already exists" }, { status: 409 });
    }

    const logoUrl = logoFile instanceof File && logoFile.size > 0
      ? `/logos/${id}.avif`
      : `/logos/${id}.avif`;

    const { data, error } = await client
      .from("opportunities")
      .insert({
        id,
        name: normalizedPayload.name,
        logo_url: logoUrl,
        share_image_url: `/images/${id}.avif`,
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
        voters: [],
      })
      .select()
      .single();

    if (error) throw error;

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

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Error creating opportunity:", error);
    return NextResponse.json({ error: "Failed to create opportunity" }, { status: 500 });
  }
}
