import { isConfigured, sessionClient } from "../../../lib/supabase/admin-auth";

const reply = (body: unknown, status = 200) => Response.json(body, { status, headers: { "Cache-Control": "private, no-store" } });

export async function POST(request: Request) {
  const base = process.env.APP_URL;
  if (!isConfigured() || !base) return reply({ error: "Password recovery is not configured yet." }, 503);
  if (request.headers.get("origin") !== new URL(base).origin) return reply({ error: "Request origin not allowed." }, 403);
  if (!request.headers.get("content-type")?.startsWith("application/json")) return reply({ error: "Use JSON." }, 415);
  const raw = await request.text();
  if (raw.length > 4096) return reply({ error: "Request too large." }, 413);
  let body;
  try { body = JSON.parse(raw); } catch { return reply({ error: "Invalid request." }, 400); }
  const password = body?.password;
  if (typeof password !== "string" || password.length < 10 || password.length > 1024) return reply({ error: "Use a password of at least 10 characters." }, 400);
  try {
    const db = await sessionClient();
    const { data: { user }, error: sessionError } = await db.auth.getUser();
    if (sessionError || !user) return reply({ error: "This reset link is invalid or has expired. Request another link." }, 401);
    const { error } = await db.auth.updateUser({ password });
    if (error) return reply({ error: "The password could not be updated. Request a new reset link and try again." }, 400);
    await db.auth.signOut();
    return reply({ updated: true });
  } catch {
    return reply({ error: "Password recovery is temporarily unavailable. Please try again." }, 503);
  }
}
