import "server-only";
import { createClient } from "@supabase/supabase-js";
import { deviceDigest, pinDigest } from "../admin/pin-crypto";
import type { QuickLogin } from "../admin/quick-login";
import { sessionClient, supabaseAdminAuth } from "./admin-auth";

function privilegedClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SECRET_KEY!, { auth: { persistSession: false, autoRefreshToken: false } });
}
function digest(secret: string, pin: string) { return pinDigest(secret, pin, process.env.AUTH_PIN_SECRET!); }

export const supabaseQuickLogin: QuickLogin = {
  configured() {
    const base = process.env.APP_URL ? new URL(process.env.APP_URL) : null;
    const safeOrigin = base && (base.protocol === "https:" || ["127.0.0.1", "localhost", "[::1]"].includes(base.hostname));
    return Boolean(safeOrigin && process.env.AUTH_PIN_ENABLED === "true" && process.env.SUPABASE_SECRET_KEY && (process.env.AUTH_PIN_SECRET?.length ?? 0) >= 43);
  },
  async available(deviceSecret) {
    const { data, error } = await privilegedClient().rpc("ecc_web_pin_available", { device_digest: deviceDigest(deviceSecret) });
    if (error) throw new Error("Quick login is unavailable.");
    return data === true;
  },
  async enroll(identity, deviceSecret, pin, previousDevice) {
    const { error } = await privilegedClient().rpc("ecc_web_set_pin", { owner_id: identity.id, device_digest: deviceDigest(deviceSecret), pin_digest: digest(deviceSecret, pin), previous_device: previousDevice ? deviceDigest(previousDevice) : null });
    if (error) throw new Error("Quick login could not be saved.");
  },
  async signIn(deviceSecret, pin) {
    const privileged = privilegedClient();
    // Database row lock serializes attempts. Five wrong attempts disable this credential.
    const { data: userId, error } = await privileged.rpc("ecc_web_claim_pin", { device_digest: deviceDigest(deviceSecret), pin_digest: digest(deviceSecret, pin) });
    if (error) throw new Error("Quick login is unavailable.");
    if (!userId) return false;
    const { data: { user }, error: userError } = await privileged.auth.admin.getUserById(userId);
    if (userError || !user?.email || !user.email_confirmed_at) return false;
    // Do not bypass a configured second factor through a PIN-only session.
    if (user.factors?.some(factor => factor.status === "verified")) return false;
    // This server-only API generates a one-time credential; it does not send email.
    const { data, error: linkError } = await privileged.auth.admin.generateLink({ type: "magiclink", email: user.email });
    if (linkError || data.user?.id !== userId || !data.properties?.hashed_token) return false;
    const db = await sessionClient();
    const { error: verifyError } = await db.auth.verifyOtp({ token_hash: data.properties.hashed_token, type: "magiclink" });
    if (verifyError) return false;
    const access = await supabaseAdminAuth.currentAccess();
    if (access.state === "ready" && access.identity.id === userId && access.identity.role === "admin") return true;
    await db.auth.signOut({ scope: "local" });
    return false;
  },
  async removeAll(identity) {
    const { error } = await privilegedClient().rpc("ecc_web_remove_pins", { owner_id: identity.id });
    if (error) throw new Error("Quick logins could not be removed.");
  },
};
