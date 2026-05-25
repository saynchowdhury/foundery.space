import { NextResponse } from "next/server";

export function cacheHeaders(ttl = 60, swr = 300): HeadersInit {
  return {
    "Cache-Control": `public, s-maxage=${ttl}, stale-while-revalidate=${swr}`,
    "CDN-Cache-Control": `public, s-maxage=${ttl}`,
    "Vercel-CDN-Cache-Control": `public, s-maxage=${ttl}`,
  };
}

export function errorResponse(message: string, status = 500) {
  return NextResponse.json({ error: message }, { status });
}

export function successResponse<T>(data: T, options?: { status?: number; headers?: HeadersInit }) {
  return NextResponse.json(data, {
    status: options?.status ?? 200,
    headers: options?.headers,
  });
}
