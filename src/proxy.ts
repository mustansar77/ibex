import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET || "ibex-admin-super-secret-key-change-in-prod"
);

const COOKIE_NAME = "ibex_admin_token";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    try {
      await jwtVerify(token, secret);
    } catch {
      const response = NextResponse.redirect(new URL("/admin/login", request.url));
      response.cookies.delete(COOKIE_NAME);
      return response;
    }
  }

  if (pathname === "/admin/login") {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    if (token) {
      try {
        await jwtVerify(token, secret);
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      } catch {
        // token invalid, let them login
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
