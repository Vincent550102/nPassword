export type AccountType = "local" | "domain";
export type AuthType = "password" | "ntlmHash";

export interface Account {
  username: string;
  password?: string;
  ntlmHash?: string;
  tags?: string[];
  type: AccountType;
  host?: string;
}

export interface Domain {
  name: string;
  accounts: Account[];
}

export interface Command {
  template: string;
  authType: AuthType;
}

export interface CommandWithText {
  command: Command;
  commandText: string;
}

export interface DomainData {
  domains: Domain[];
}
