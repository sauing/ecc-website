import "server-only";
import type { ProfileStore } from "../account/profile";
import { sessionClient } from "./admin-auth";
export const supabaseProfiles: ProfileStore = {
  async readOwn(userId) {
    const db = await sessionClient();
    const { data, error } = await db.from("ecc_web_profiles").select("full_name,email,address,phone").eq("user_id",userId).maybeSingle();
    if (error) throw new Error("Profile could not be loaded.");
    return data ? { fullName:data.full_name, email:data.email, address:data.address, phone:data.phone } : null;
  },
  async saveOwn(userId, profile) {
    const db = await sessionClient();
    const { error } = await db.from("ecc_web_profiles").upsert({ user_id: userId, full_name:profile.fullName, email:profile.email, address: profile.address, phone: profile.phone }, { onConflict: "user_id" });
    if (error) throw new Error("Profile could not be saved.");
  },
};
