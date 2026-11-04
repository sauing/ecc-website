import type { AdminIdentity } from "./auth";
export interface QuickLogin {
  configured(): boolean;
  available(deviceSecret: string): Promise<boolean>;
  enroll(identity: AdminIdentity, deviceSecret: string, pin: string, previousDevice?: string): Promise<void>;
  signIn(deviceSecret: string, pin: string): Promise<boolean>;
  removeAll(identity: AdminIdentity): Promise<void>;
}
