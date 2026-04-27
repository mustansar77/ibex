import { NextRequest, NextResponse } from "next/server";
import { validateAdminCredentials, createAdminToken, COOKIE_NAME } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  if (!validateAdminCredentials(email, password)) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }
  const token = await createAdminToken(email);
  const res = NextResponse.json({ success: true });
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24,
    path: "/",
  });
  return res;
}
