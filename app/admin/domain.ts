export type StaffRole = "admin" | "moderator";
export type Member = { id: string; name: string; email: string; phone: string; created_at: string };
export type Programme = { id: string; name: string; fee_cents: number; season: string; status: "draft" | "open" | "closed"; opens_on: string | null; closes_on: string | null };
export type Membership = { id: string; member_id: string; programme_id: string; season: string; fee_cents: number; status: "pending" | "active" | "rejected"; decision_note: string; created_at: string };
export type Payment = { id: string; membership_id: string; amount_cents: number; kind: "payment" | "refund"; method: "bank" | "cash"; reference: string; note: string; received_on: string; created_at: string };
export type Assignment = { id: string; member_id: string; team: string; season: string };
export type Staff = { user_id: string; email: string; role: StaffRole; active: boolean };
export type Invitation = { id: string; email: string; role: StaffRole; status: "pending" | "accepted" | "revoked"; expires_at: string };
export type Notice = { id: string; message: string; action_label: string; action_href: string; status: "draft" | "published"; expires_at: string | null; updated_at: string };
export type Message = { id: string; subject: string; body: string; audience: string; status: "draft"; created_at: string };
export type Audit = { id: number; actor_id: string | null; action: string; entity: string; created_at: string };
export type AdminData = { members: Member[]; programmes: Programme[]; memberships: Membership[]; payments: Payment[]; assignments: Assignment[]; staff: Staff[]; invitations: Invitation[]; notices: Notice[]; messages: Message[]; audit: Audit[] };
export const emptyData: AdminData = { members: [], programmes: [], memberships: [], payments: [], assignments: [], staff: [], invitations: [], notices: [], messages: [], audit: [] };
export const teams = ["ECC1", "ECC2", "ECC3", "ECC4", "Youth 1", "Youth 2"];
export const money = (cents: number) => new Intl.NumberFormat("en-NL", { style: "currency", currency: "EUR" }).format(cents / 100);
export function balance(membership: Membership, payments: Payment[]) {
  return membership.fee_cents - payments.filter(p => p.membership_id === membership.id).reduce((sum, p) => sum + (p.kind === "payment" ? p.amount_cents : -p.amount_cents), 0);
}
export function csvCell(value: unknown) {
  let text = String(value ?? "");
  if (/^[\s]*[=+\-@\t\r]/.test(text)) text = "'" + text;
  return '"' + text.replaceAll('"', '""') + '"';
}
export const actions = ["save_member", "save_programme", "add_membership", "decide_application", "record_payment", "assign_team", "remove_assignment", "invite_staff", "revoke_invitation", "update_staff", "save_notice", "save_message"] as const;
export type AdminAction = typeof actions[number];
export function canPerform(role: StaffRole, action: string) { return actions.includes(action as AdminAction) && (role === "admin" || ["save_notice", "save_message"].includes(action)); }
export function validateAction(action: unknown, input: unknown): { action: AdminAction; payload: Record<string, unknown> } {
  if (typeof action !== "string" || !actions.includes(action as AdminAction) || !input || typeof input !== "object" || Array.isArray(input)) throw new Error("Invalid request.");
  const p = input as Record<string, unknown>, result: Record<string, unknown> = {};
  const text = (key: string, max = 160, optional = false) => { const v = p[key]; if (optional && (v === undefined || v === "" || v === null)) return ""; if (typeof v !== "string" || !v.trim() || v.trim().length > max) throw new Error(`Check ${key.replaceAll("_", " ")}.`); return v.trim(); };
  const id = (key: string, optional = false) => { const value = text(key, 36, optional); if (value && !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)) throw new Error(`Invalid ${key}.`); return value || null; };
  const choice = (key: string, allowed: string[]) => { const value = text(key); if (!allowed.includes(value)) throw new Error(`Invalid ${key}.`); return value; };
  const amount = (key: string, positive = false) => { const v = p[key]; if (typeof v !== "number" || !Number.isSafeInteger(v) || v < (positive ? 1 : 0) || v > 100_000_000) throw new Error("Enter a valid amount."); return v; };
  const date = (key: string, optional = false) => { const v = text(key, 10, optional); if (!v && optional) return null; if (!/^\d{4}-\d{2}-\d{2}$/.test(v) || new Date(v).toISOString().slice(0, 10) !== v) throw new Error(`Invalid ${key}.`); return v; };
  const email = () => { const v = text("email", 254).toLowerCase(); if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) throw new Error("Enter a valid email address."); return v; };
  if (action === "save_member") Object.assign(result, { id: id("id", true), name: text("name"), email: email(), phone: text("phone", 40, true) });
  if (action === "save_programme") Object.assign(result, { id: id("id", true), name: text("name"), fee_cents: amount("fee_cents"), season: text("season", 20), status: choice("status", ["draft", "open", "closed"]), opens_on: date("opens_on", true), closes_on: date("closes_on", true) });
  if (action === "add_membership") Object.assign(result, { member_id: id("member_id"), programme_id: id("programme_id") });
  if (action === "decide_application") Object.assign(result, { id: id("id"), status: choice("status", ["active", "rejected"]), note: text("note", 1000) });
  if (action === "record_payment") Object.assign(result, { membership_id: id("membership_id"), amount_cents: amount("amount_cents", true), kind: choice("kind", ["payment", "refund"]), method: choice("method", ["bank", "cash"]), reference: text("reference", 160), note: text("note", 1000), received_on: date("received_on") });
  if (action === "assign_team") Object.assign(result, { member_id: id("member_id"), team: choice("team", teams), season: text("season", 20) });
  if (action === "invite_staff") Object.assign(result, { email: email(), role: choice("role", ["admin", "moderator"]) });
  if (action === "revoke_invitation" || action === "remove_assignment") result.id = id("id");
  if (action === "update_staff") { if (typeof p.active !== "boolean") throw new Error("Invalid access state."); Object.assign(result, { user_id: id("user_id"), role: choice("role", ["admin", "moderator"]), active: p.active }); }
  if (action === "save_notice") {
    const href = text("action_href", 500, true), label = text("action_label", 80, true);
    if (Boolean(href) !== Boolean(label) || (href && !/^\/(?!\/)|^https:\/\//i.test(href))) throw new Error("Use a site path or HTTPS link and provide a link label.");
    Object.assign(result, { id: id("id", true), message: text("message", 500), action_label: label, action_href: href, status: choice("status", ["draft", "published"]), expires_on: date("expires_on", true) });
  }
  if (action === "save_message") Object.assign(result, { subject: text("subject", 200), body: text("body", 10000), audience: choice("audience", ["All members", "Active members", ...teams]) });
  if (result.opens_on && result.closes_on && String(result.opens_on) > String(result.closes_on)) throw new Error("Closing date must follow opening date.");
  return { action: action as AdminAction, payload: result };
}
