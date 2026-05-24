import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 30;

const INDEXNOW_KEY = process.env.INDEXNOW_KEY || "";
const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://foundery.space";

/**
 * IndexNow — notify search engines (Bing, Yandex, Seznam, Naver) of URL changes.
 * POST /api/indexnow
 * Body: { urls: string[], token: string }
 *
 * Requires INDEXNOW_KEY env var (generate at https://www.bing.com/indexnow)
 * and ADMIN_TOKEN for auth.
 */
export async function POST(request: NextRequest) {
  const adminToken = process.env.ADMIN_TOKEN;
  if (!adminToken) {
    return NextResponse.json({ error: "Admin token not configured" }, { status: 500 });
  }

  const { searchParams } = new URL(request.url);
  if (searchParams.get("token") !== adminToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!INDEXNOW_KEY) {
    return NextResponse.json(
      { error: "INDEXNOW_KEY not configured" },
      { status: 500 }
    );
  }

  let urls: string[] = [];
  try {
    const body = await request.json();
    urls = Array.isArray(body.urls) ? body.urls : [];
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (urls.length === 0) {
    return NextResponse.json({ error: "No URLs provided" }, { status: 400 });
  }

  if (urls.length > 10000) {
    return NextResponse.json({ error: "Too many URLs (max 10000)" }, { status: 400 });
  }

  const payload = {
    host: new URL(SITE_URL).hostname,
    key: INDEXNOW_KEY,
    keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
    urlList: urls,
  };

  try {
    const response = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(payload),
    });

    return NextResponse.json({
      ok: response.ok,
      status: response.status,
      submitted: urls.length,
    });
  } catch (error) {
    console.error("[indexnow] submission failed:", error);
    return NextResponse.json({ error: "IndexNow submission failed" }, { status: 500 });
  }
}

/**
 * GET /api/indexnow — health check, returns key location
 */
export async function GET() {
  return NextResponse.json({
    configured: !!INDEXNOW_KEY,
    keyLocation: INDEXNOW_KEY ? `${SITE_URL}/${INDEXNOW_KEY}.txt` : null,
    docs: "POST with { urls: string[] } and ?token=ADMIN_TOKEN to submit URLs",
  });
}
