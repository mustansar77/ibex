import { SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET || "ibex-admin-super-secret-key-change-in-prod"
);

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@ibex.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "ibex@admin2024";

export const COOKIE_NAME = "ibex_admin_token";

export function validateAdminCredentials(email: string, password: string): boolean {
  return email === ADMIN_EMAIL && password === ADMIN_PASSWORD;
}

export async function createAdminToken(email: string): Promise<string> {
  return new SignJWT({ email, role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("24h")
    .setIssuedAt()
    .sign(secret);
}

export async function verifyAdminToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
}
