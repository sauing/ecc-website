import { adminAuth, isConfigured } from "../../../lib/admin/service";
export async function POST(request: Request) {
  if (!isConfigured()) return Response.json({ error: "Google sign-in has not been configured." }, { status: 503 });
  const base = new URL(process.env.APP_URL!);
  if (request.headers.get("origin") !== base.origin) return new Response("Forbidden", { status: 403 });
  if (process.env.AUTH_GOOGLE_ENABLED !== "true") return Response.redirect(new URL("/login?auth=failed", base), 303);
  try {
    const url = await adminAuth.startGoogleLogin();
    return Response.redirect(url ?? new URL("/login?auth=failed", base), 303);
  } catch { return Response.redirect(new URL("/login?auth=failed", base), 303); }
}
