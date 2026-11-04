import { adminAuth, isConfigured } from "../../../lib/admin/service";
export async function POST(request: Request) {
  if (!isConfigured() || request.headers.get("origin") !== new URL(process.env.APP_URL!).origin) return new Response("Forbidden", { status: 403 });
  try { await adminAuth.signOut(); }
  catch { return new Response("Sign-out could not be completed. Please try again.", { status: 503 }); }
  return Response.redirect(new URL("/login", process.env.APP_URL!), 303);
}
