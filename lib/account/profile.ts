export type ContactDetails = { address: string; phone: string };
export type MemberProfile = ContactDetails & { fullName: string; email: string };
export interface ProfileStore {
  readOwn(userId: string): Promise<MemberProfile | null>;
  saveOwn(userId: string, profile: MemberProfile): Promise<void>;
}
export function parseProfile(input: unknown): ContactDetails {
  if (!input || typeof input !== "object" || Array.isArray(input)) throw new Error("Enter your address and phone number.");
  const body = input as Record<string, unknown>;
  if (Object.keys(body).some(key => !["address", "phone"].includes(key))) throw new Error("Invalid profile details.");
  const address = typeof body.address === "string" ? body.address.trim() : "";
  const rawPhone = typeof body.phone === "string" ? body.phone.trim() : "";
  if (address.length < 8 || address.length > 500) throw new Error("Enter your full postal address, including street, postal code, city and country.");
  if (!/^[+0-9 ()-]+$/.test(rawPhone) || rawPhone.length > 40) throw new Error("Enter a phone number with its country code.");
  const phone = rawPhone.replace(/[ ()-]/g, "");
  if (!/^\+[1-9]\d{7,14}$/.test(phone)) throw new Error("Include your country code, for example +31 6 12345678.");
  return { address, phone };
}
