/** Provider-independent contract. Pages never receive a database client or auth tokens. */
export type AdminIdentity = { id: string; email: string; role: "admin" | "moderator" };
export type PasswordSignInResult = "signed-in" | "invalid" | "limited" | "unavailable";
export type AdminAccess =
  | { state: "ready"; identity: AdminIdentity }
  | { state: "setup" | "signed-out" | "forbidden" | "unavailable" };

export interface AdminAuth {
  currentAccess(): Promise<AdminAccess>;
  signInWithPassword(email: string, password: string): Promise<PasswordSignInResult>;
  verifyPassword(identity: AdminIdentity, password: string): Promise<boolean>;
  startGoogleLogin(): Promise<string | null>;
  completeLogin(code: string): Promise<boolean>;
  signOut(): Promise<void>;
}
