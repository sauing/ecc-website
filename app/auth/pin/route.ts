import { cookies } from "next/headers";
import { adminAuth, quickLogin } from "../../../lib/admin/service";
import { newDeviceSecret, pinLifetimeSeconds, validDeviceSecret } from "../../../lib/admin/pin-crypto";
import { validPassword, validPin } from "../../../lib/admin/login-policy";
const reply = (body: unknown, status = 200) => Response.json(body, { status, headers: { "Cache-Control": "private, no-store" } });
function cookieName() { return process.env.APP_URL?.startsWith("https://") ? "__Host-ecc-quick-login" : "ecc-quick-login"; }
export async function GET() {
  if (!quickLogin.configured()) return reply({ configured: false, available: false });
  const secret = (await cookies()).get(cookieName())?.value;
  if (!validDeviceSecret(secret)) return reply({ configured: true, available: false });
  try { return reply({ configured: true, available: await quickLogin.available(secret) }); }
  catch { return reply({ error: "Quick login is temporarily unavailable." }, 503); }
}
export async function POST(request: Request) {
  if (!process.env.APP_URL || request.headers.get("origin") !== new URL(process.env.APP_URL).origin) return reply({ error: "Request origin not allowed." }, 403);
  if (!request.headers.get("content-type")?.startsWith("application/json")) return reply({ error: "Use JSON." }, 415);
  if (!quickLogin.configured()) return reply({ error: "Quick login is not configured yet. Use your password." }, 503);
  const raw = await request.text();
  if (raw.length > 4096) return reply({ error: "Request too large." }, 413);
  let body;
  try { body = JSON.parse(raw); } catch { return reply({ error: "Invalid request." }, 400); }
  const jar = await cookies();
  const existing = jar.get(cookieName())?.value;
  try {
    if (body?.action === "login") {
      if (!validDeviceSecret(existing) || !validPin(body.pin) || !await quickLogin.signIn(existing, body.pin)) return reply({ error: "PIN not accepted, expired or disabled. Sign in with your password to set it up again." }, 401);
      return reply({ signedIn: true });
    }
    if (!["enroll", "remove"].includes(body?.action)) return reply({ error: "Invalid request." }, 400);
    const access = await adminAuth.currentAccess();
    if (access.state !== "ready" || access.identity.role !== "admin") return reply({ error: "Administrator access required." }, 403);
    if (!validPassword(body.password) || !await adminAuth.verifyPassword(access.identity, body.password)) return reply({ error: "Your current password could not be verified." }, 401);
    if (body.action === "remove") {
      await quickLogin.removeAll(access.identity);
      jar.set(cookieName(), "", { path: "/", httpOnly: true, sameSite: "strict", secure: process.env.APP_URL.startsWith("https://"), maxAge: 0 });
      return reply({ removed: true });
    }
    if (!validPin(body.pin) || body.pin !== body.confirmPin) return reply({ error: "Enter the same six-digit PIN in both fields." }, 400);
    const secret = newDeviceSecret();
    await quickLogin.enroll(access.identity, secret, body.pin, validDeviceSecret(existing) ? existing : undefined);
    jar.set(cookieName(), secret, { httpOnly: true, secure: process.env.APP_URL.startsWith("https://"), sameSite: "strict", path: "/", maxAge: pinLifetimeSeconds });
    return reply({ saved: true });
  } catch { return reply({ error: "Quick login is temporarily unavailable. Use your password." }, 503); }
}
