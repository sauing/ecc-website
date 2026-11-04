// Initial provisioning addresses approved by the club. Signing in never grants a role.
export const initialAdminEmails = ["info@eindhovencc.com", "secretary@eindhovencc.com"];
export function normalizeEmail(value: unknown): string {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}
export function validEmail(email: string): boolean { return email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }
export function validPassword(value: unknown): value is string { return typeof value === "string" && value.length > 0 && value.length <= 1024; }
export function validPin(value: unknown): value is string { return typeof value === "string" && /^\d{6}$/.test(value); }
