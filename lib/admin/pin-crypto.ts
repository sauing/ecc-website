// Node-only primitives, independent of the database/provider. Never import into client components.
import { createHash, createHmac, randomBytes } from "node:crypto";
export const pinLifetimeSeconds = 30 * 24 * 60 * 60;
export function newDeviceSecret() { return randomBytes(32).toString("hex"); }
export function validDeviceSecret(value: unknown): value is string { return typeof value === "string" && /^[0-9a-f]{64}$/.test(value); }
export function deviceDigest(secret: string) { return createHash("sha256").update(secret).digest("hex"); }
export function pinDigest(secret: string, pin: string, pepper: string) {
  if (pepper.length < 43) throw new Error("PIN protection key is not configured.");
  return createHmac("sha256", pepper).update(`ecc-web-pin-v1:${secret}:${pin}`).digest("hex");
}
