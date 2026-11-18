import { isConfigured, sessionClient } from "../../../lib/supabase/admin-auth";

export async function GET(request: Request) {
  const base = process.env.APP_URL;
  if (!isConfigured() || !base) return new Response("Password recovery is not configured.", { status: 503 });
  const code = new URL(request.url).searchParams.get("code");
  if (!code) return Response.redirect(new URL("/reset-password?recovery=invalid", base), 303);
  try {
    const db = await sessionClient();
    const { error } = await db.auth.exchangeCodeForSession(code);
    return Response.redirect(new URL(error ? "/reset-password?recovery=invalid" : "/reset-password", base), 303);
  } catch {
    return Response.redirect(new URL("/reset-password?recovery=invalid", base), 303);
  }
}
