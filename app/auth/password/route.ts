import { adminAuth, isConfigured } from "../../../lib/admin/service";
import { normalizeEmail, validEmail, validPassword } from "../../../lib/admin/login-policy";
const reply = (body: unknown, status = 200) => Response.json(body, { status, headers: { "Cache-Control": "private, no-store" } });
export async function POST(request: Request) {
  if (!isConfigured()) return reply({ error: "Sign-in is not configured yet." }, 503);
  if (request.headers.get("origin") !== new URL(process.env.APP_URL!).origin) return reply({ error: "Request origin not allowed." }, 403);
  if (!request.headers.get("content-type")?.startsWith("application/json")) return reply({ error: "Use JSON." }, 415);
  const raw = await request.text();
  if (raw.length > 4096) return reply({ error: "Request too large." }, 413);
  let body;
  try { body = JSON.parse(raw); } catch { return reply({ error: "Invalid request." }, 400); }
  const email = normalizeEmail(body?.email);
  if (!validEmail(email) || !validPassword(body?.password)) return reply({ error: "Enter your email and password." }, 400);
  try {
    const outcome = await adminAuth.signInWithPassword(email, body.password);
    if (outcome === "unavailable") return reply({ error: "The sign-in service cannot be reached right now. Please try again later or contact the website maintainer." }, 503);
    if (outcome === "limited") return reply({ error: "Too many sign-in attempts. Please wait before trying again." }, 429);
    if (outcome !== "signed-in") return reply({ error: "Email or password is incorrect, or this account is not ready. Contact the website maintainer if you need help." }, 401);
    return reply({ signedIn: true }); // /admin independently checks the current DB role.
  } catch { return reply({ error: "Sign-in is temporarily unavailable. Please try again." }, 503); }
}
