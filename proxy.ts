import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) return response;
  const db = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, { cookieOptions: { httpOnly: true, secure: process.env.NODE_ENV === "production" && process.env.APP_URL?.startsWith("https://"), sameSite: "lax", path: "/" }, cookies: {
    getAll: () => request.cookies.getAll(),
    setAll: values => { values.forEach(({ name, value }) => request.cookies.set(name, value)); response = NextResponse.next({ request }); values.forEach(({ name, value, options }) => response.cookies.set(name, value, options)); },
  } });
  try { await db.auth.getUser(); } catch { /* Protected routes re-verify identity and fail closed. */ }
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}
export const config = { matcher: ["/admin/:path*", "/api/admin/:path*", "/api/account/:path*", "/my-ecc/:path*", "/login", "/auth/:path*"] };
