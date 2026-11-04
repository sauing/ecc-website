import { adminAuth, isConfigured } from "../../../lib/admin/service";
export async function GET(request: Request) {
  const base = process.env.APP_URL;
  if (!isConfigured() || !base) return new Response("Sign-in is not configured.", { status: 503 });
  const code = new URL(request.url).searchParams.get("code");
  const success = code && await adminAuth.completeLogin(code);
  // Sign-in never grants a role. /admin independently verifies current database access.
  return Response.redirect(new URL(success ? "/login" : "/login?auth=failed", base), 303);
}
