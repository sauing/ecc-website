import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import type { AdminAuth } from "../admin/auth";
import { passwordFailure } from "../admin/auth-errors";

export function isConfigured() {
  return Boolean(process.env.APP_URL && process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
}

export async function sessionClient() {
  const jar = await cookies();
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, {
    cookieOptions: { httpOnly: true, secure: process.env.NODE_ENV === "production" && process.env.APP_URL?.startsWith("https://"), sameSite: "lax", path: "/" },
    cookies: {
      getAll: () => jar.getAll(),
      setAll: values => { try { values.forEach(({ name, value, options }) => jar.set(name, value, options)); } catch { /* Proxy refreshes cookies for server components. */ } },
    },
  });
}

export const supabaseAdminAuth: AdminAuth = {
  async currentAccess() {
    if (!isConfigured()) return { state: "setup" };
    try {
      const db = await sessionClient();
      const { data: { user }, error } = await db.auth.getUser();
      if (error || !user) return { state: "signed-out" };
      if (!user.email_confirmed_at || !user.identities?.some(identity => ["google", "email"].includes(identity.provider))) return { state: "forbidden" };
      // Read the current role on every request; do not trust editable metadata or cached JWT roles.
      const { data: staff, error: accessError } = await db.from("ecc_web_staff").select("role,active").eq("user_id", user.id).maybeSingle();
      if (accessError) return { state: "unavailable" };
      if (!staff?.active || (staff.role !== "admin" && staff.role !== "moderator")) return { state: "forbidden" };
      return { state: "ready", identity: { id: user.id, email: user.email ?? "", role: staff.role } };
    } catch { return { state: "unavailable" }; }
  },
  async signInWithPassword(email, password) {
    const db = await sessionClient();
    const { data, error } = await db.auth.signInWithPassword({ email, password });
    if (error) return passwordFailure(error);
    return data.user?.email_confirmed_at ? "signed-in" : "invalid";
  },
  async verifyPassword(identity, password) {
    // A separate transient session reauthenticates without replacing browser cookies.
    const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data, error } = await db.auth.signInWithPassword({ email: identity.email, password });
    if (error || !data.user) return false;
    const valid = data.user.id === identity.id && Boolean(data.user.email_confirmed_at);
    await db.auth.signOut({ scope: "local" });
    return valid;
  },
  async startGoogleLogin() {
    const db = await sessionClient();
    const { data, error } = await db.auth.signInWithOAuth({ provider: "google", options: { redirectTo: new URL("/auth/callback", process.env.APP_URL!).href } });
    return error ? null : data.url;
  },
  async completeLogin(code) {
    try {
      const db = await sessionClient();
      const { error } = await db.auth.exchangeCodeForSession(code);
      if (error) return false;
      const { data: { user } } = await db.auth.getUser();
      return Boolean(user?.email_confirmed_at && user.identities?.some(identity => identity.provider === "google"));
    } catch { return false; }
  },
  async signOut() {
    const db = await sessionClient();
    const { error } = await db.auth.signOut();
    if (error) throw new Error("Sign-out failed.");
  },
};
