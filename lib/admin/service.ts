import "server-only";
// Composition boundary: replace this adapter when moving to another auth/database provider.
import { supabaseAdminAuth } from "../supabase/admin-auth";
import type { AdminAuth } from "./auth";
import { supabaseQuickLogin } from "../supabase/quick-login";
import type { QuickLogin } from "./quick-login";
export const adminAuth: AdminAuth = supabaseAdminAuth;
export const quickLogin: QuickLogin = supabaseQuickLogin;
export { isConfigured } from "../supabase/admin-auth";
