import type { PasswordSignInResult } from "./auth";
/** Keep provider/network failures separate from credentials, without leaking raw errors. */
export function passwordFailure(error: { code?: string; status?: number }): PasswordSignInResult {
  if (error.status === 429 || error.code === "over_request_rate_limit") return "limited";
  if (["invalid_credentials", "email_not_confirmed", "user_banned"].includes(error.code ?? "")) return "invalid";
  return "unavailable";
}
