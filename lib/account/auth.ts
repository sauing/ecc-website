export type AccountIdentity = { id: string; email: string; name: string; verified: boolean };
export type AccountSession = { state: "ready"; account: AccountIdentity } | { state: "setup" | "signed-out" | "unavailable" };
export interface AccountAuth {
  currentAccount(): Promise<AccountSession>;
}
