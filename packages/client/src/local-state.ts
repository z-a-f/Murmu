import type { LocalAccount } from "./types.js";

export class MemoryLocalState {
  private accounts = new Map<string, LocalAccount>();

  saveAccount(account: LocalAccount): void {
    this.accounts.set(account.identity.did, structuredClone(account));
  }

  getAccount(did: string): LocalAccount | undefined {
    const account = this.accounts.get(did);
    return account ? structuredClone(account) : undefined;
  }

  listAccounts(): LocalAccount[] {
    return Array.from(this.accounts.values()).map((account) => structuredClone(account));
  }
}

