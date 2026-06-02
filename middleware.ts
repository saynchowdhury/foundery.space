import { NextRequest, NextResponse } from "next/server";
import {
  appendVaryAccept,
  preferredType,
  PRODUCES,
} from "@/lib/accept";

function handleAdmin(request: NextRequest): NextResponse | null {
  const adminToken = process.env.ADMIN_TOKEN;
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
  const isAdminApiRoute = request.nextUrl.pathname.startsWith("/api/admin");

  if (!isAdminRoute && !isAdminApiRoute) return null;

  if (!adminToken) {
    if (isAdminApiRoute) {
      return NextResponse.json(
        { error: "Admin token not configured" },
        { status: 500 }
      );
    }
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Support both URL query param and cookie-based auth
  const token =
    request.nextUrl.searchParams.get("token") ||
    request.cookies.get("admin_token")?.value;
  if (token === adminToken) {
    // If authenticated via query param, set a cookie for subsequent requests
    if (request.nextUrl.searchParams.get("token")) {
      const response = NextResponse.next();
      response.cookies.set("admin_token", adminToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 8, // 8 hours
        path: "/",
      });
      return response;
    }
    return NextResponse.next();
  }

  if (isAdminApiRoute) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.redirect(new URL("/", request.url));
}

function handleMarkdownNegotiation(
  request: NextRequest
): NextResponse | Response {
  const pathname = request.nextUrl.pathname;

  if (
    pathname === "/llms.txt" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    (/\.[a-z0-9]+$/i.test(pathname) && !pathname.endsWith(".md"))
  ) {
    const res = NextResponse.next();
    appendVaryAccept(res.headers);
    return res;
  }

  if (pathname.endsWith(".md")) {
    const url = request.nextUrl.clone();
    url.pathname = `/api/markdown${pathname.slice(0, -3)}`;
    const rewritten = NextResponse.rewrite(url);
    appendVaryAccept(rewritten.headers);
    return rewritten;
  }

  const acceptHeader = request.headers.get("accept");
  const chosen = preferredType(acceptHeader);

  if (chosen === "text/markdown") {
    const url = request.nextUrl.clone();
    const markdownPath =
      pathname === "/" ? "/index" : pathname;
    url.pathname = `/api/markdown${markdownPath}`;
    const rewritten = NextResponse.rewrite(url);
    appendVaryAccept(rewritten.headers);
    return rewritten;
  }

  if (chosen === null && acceptHeader) {
    return new Response(
      `Not Acceptable\n\nAvailable: ${PRODUCES.join(", ")}\n`,
      {
        status: 406,
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          Vary: "Accept",
        },
      }
    );
  }

  const res = NextResponse.next();
  appendVaryAccept(res.headers);
  return res;
}

export async function middleware(request: NextRequest) {
  const adminResponse = handleAdmin(request);
  if (adminResponse) return adminResponse;

  return handleMarkdownNegotiation(request);
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/((?!api/|_next/|_vercel/|admin/).*)",
  ],
};
