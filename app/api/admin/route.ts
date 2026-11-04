import { adminAuth } from "../../../lib/admin/service";
const reply = (body: unknown, status = 200) => Response.json(body, { status, headers: { "Cache-Control": "private, no-store" } });
export async function GET() {
  const access = await adminAuth.currentAccess();
  if (access.state !== "ready") return reply({ error: "Administrator access is unavailable." }, access.state === "setup" || access.state === "unavailable" ? 503 : access.state === "signed-out" ? 401 : 403);
  return reply({ account: access.identity });
}
export async function POST(request: Request) {
  if (!process.env.APP_URL || request.headers.get("origin") !== new URL(process.env.APP_URL).origin) return reply({ error: "Request origin not allowed." }, 403);
  const access = await adminAuth.currentAccess();
  if (access.state !== "ready") return reply({ error: "Administrator access is unavailable." }, access.state === "setup" || access.state === "unavailable" ? 503 : access.state === "signed-out" ? 401 : 403);
  return reply({ error: "Only admin sign-in is enabled. Record management will be added workflow by workflow." }, 409);
}
