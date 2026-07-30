import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  PARENT_SESSION_COOKIE,
  isValidSessionToken,
} from "@/lib/session";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // --- /admin/* : unchanged from before, admin-only, signed token ---
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") {
      return NextResponse.next();
    }

    const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
    const isAdmin = await isValidSessionToken(token);

    if (!isAdmin) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("redirectTo", pathname);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  // --- /home : any signed-in role (parent or admin) ---
  if (pathname === "/home") {
    const adminToken = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
    const hasParentSession = request.cookies.get(PARENT_SESSION_COOKIE)?.value === "ok";
    const isAdmin = await isValidSessionToken(adminToken);

    if (!isAdmin && !hasParentSession) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/home"],
};
