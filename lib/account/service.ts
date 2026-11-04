import "server-only";
import type { AccountAuth } from "./auth";
import { supabaseAccountAuth } from "../supabase/account-auth";
import { supabaseProfiles } from "../supabase/profiles";
import type { ProfileStore } from "./profile";
export const accountAuth: AccountAuth = supabaseAccountAuth;
export const profiles: ProfileStore = supabaseProfiles;
