import "server-only";
import type { AccountAuth } from "../account/auth";
import { isConfigured, sessionClient } from "./admin-auth";

export const supabaseAccountAuth: AccountAuth = {
  async currentAccount() {
    if (!isConfigured()) return { state: "setup" };
    try {
      const db = await sessionClient();
      const { data: { user }, error } = await db.auth.getUser();
      if (error) return { state: error.status === 400 || error.status === 401 || error.status === 403 ? "signed-out" : "unavailable" };
      if (!user?.email) return { state: "signed-out" };
      const name = typeof user.user_metadata?.full_name === "string" ? user.user_metadata.full_name.slice(0,160) : "ECC account";
      return { state: "ready", account: { id: user.id, email: user.email, name, verified: Boolean(user.email_confirmed_at) } };
    } catch { return { state: "unavailable" }; }
  },
};
