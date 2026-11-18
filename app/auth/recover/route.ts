import { normalizeEmail, validEmail } from "../../../lib/admin/login-policy";
import { isConfigured, sessionClient } from "../../../lib/supabase/admin-auth";

const reply = (body: unknown, status = 200) => Response.json(body, { status, headers: { "Cache-Control": "private, no-store" } });
const sentMessage = "If an ECC account exists for that email, a password reset link is on its way.";

export async function POST(request: Request) {
  const base = process.env.APP_URL;
  if (!isConfigured() || !base) return reply({ error: "Password recovery is not configured yet." }, 503);
  if (request.headers.get("origin") !== new URL(base).origin) return reply({ error: "Request origin not allowed." }, 403);
  if (!request.headers.get("content-type")?.startsWith("application/json")) return reply({ error: "Use JSON." }, 415);
  const raw = await request.text();
  if (raw.length > 4096) return reply({ error: "Request too large." }, 413);
  let body;
  try { body = JSON.parse(raw); } catch { return reply({ error: "Invalid request." }, 400); }
  const email = normalizeEmail(body?.email);
  if (!validEmail(email)) return reply({ error: "Enter a valid email address." }, 400);
  try {
    const db = await sessionClient();
    await db.auth.resetPasswordForEmail(email, { redirectTo: new URL("/auth/recovery", base).href });
    return reply({ message: sentMessage });
  } catch {
    return reply({ message: sentMessage });
  }
}
