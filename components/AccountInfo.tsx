import React from "react";
import { Account, Domain } from "@/types";
import Card from "@/components/ui/Card";

interface AccountInfoProps {
  selectedAccount: Account;
  selectedDomain: Domain;
}

const AccountInfo: React.FC<AccountInfoProps> = ({
  selectedAccount,
  selectedDomain,
}) => {
  return (
    <Card title="Account Information" className="mb-4">
      <p>
        <strong>Type:</strong> {selectedAccount.type} account
      </p>
      {selectedAccount.type === "domain" && (
        <p>
          <strong>Domain:</strong> {selectedDomain.name}
        </p>
      )}
      {selectedAccount.type === "local" && (
        <p>
          <strong>Host:</strong> {selectedAccount.host}
        </p>
      )}
      <p>
        <strong>Username:</strong> {selectedAccount.username}
      </p>
      {selectedAccount.password && (
        <p>
          <strong>Password:</strong> {selectedAccount.password}
        </p>
      )}
      {selectedAccount.ntlmHash && (
        <p>
          <strong>NTLM Hash:</strong> {selectedAccount.ntlmHash}
        </p>
      )}
    </Card>
  );
};

export default AccountInfo;
