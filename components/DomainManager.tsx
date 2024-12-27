"use client";
import { useState, useEffect } from "react";
import useLocalStorage from "@/hooks/useLocalStorage";
import Sidebar from "./Sidebar";

interface Account {
  username: string;
  password: string;
}

interface Domain {
  name: string;
  accounts: Account[];
}

interface Data {
  domains: Domain[];
}

const initialData: Data = { domains: [] };

export default function DomainManager({
  selectedDomain,
  onUpdateDomain,
}: {
  selectedDomain: Domain | null;
  onUpdateDomain: (domain: Domain | null) => void;
}) {
  const [data, setData] = useLocalStorage<Data>(
    "passwordManagerData",
    initialData,
  );
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

  useEffect(() => {
    setSelectedAccount(null);
  }, [selectedDomain]);

  useEffect(() => {
    if (selectedDomain) {
      const updatedDomain = data.domains.find(
        (domain) => domain.name === selectedDomain.name,
      );
      if (updatedDomain) {
        setSelectedAccount(
          updatedDomain.accounts[updatedDomain.accounts.length - 1],
        );
        onUpdateDomain(updatedDomain);
      }
    }
  }, [data, selectedDomain, onUpdateDomain]);

  const addAccount = (newAccount: Account) => {
    if (!selectedDomain) return;
    setData((prevData) => {
      const updatedDomains = prevData.domains.map((domain) =>
        domain.name === selectedDomain.name
          ? { ...domain, accounts: [...domain.accounts, newAccount] }
          : domain,
      );
      return { domains: updatedDomains };
    });
  };

  const deleteAccount = (username: string) => {
    if (!selectedDomain) return;
    setData((prevData) => ({
      domains: prevData.domains.map((domain) =>
        domain.name === selectedDomain.name
          ? {
              ...domain,
              accounts: domain.accounts.filter(
                (account) => account.username !== username,
              ),
            }
          : domain,
      ),
    }));
    setSelectedAccount(null);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  return (
    <div className="flex">
      <Sidebar
        selectedDomain={selectedDomain}
        onAddAccount={addAccount}
        onSelectAccount={setSelectedAccount}
        onDeleteAccount={deleteAccount}
        selectedAccount={selectedAccount}
      />
      <div className="flex-1 p-4">
        {selectedAccount && (
          <>
            <h2 className="text-xl mb-2">
              Commands for {selectedAccount.username}
            </h2>
            <ul>
              <li className="mb-2">
                <code className="bg-gray-200 p-2 rounded">
                  impacket-wmiexec {selectedAccount.username}:
                  {selectedAccount.password}@{selectedDomain?.name}
                </code>
                <button
                  onClick={() =>
                    copyToClipboard(
                      `impacket-wmiexec ${selectedAccount.username}:${selectedAccount.password}@${selectedDomain?.name}`,
                    )
                  }
                  className="bg-blue-500 text-white p-2 ml-2"
                >
                  Copy
                </button>
              </li>
              <li className="mb-2">
                <code className="bg-gray-200 p-2 rounded">
                  impacket-psexec {selectedAccount.username}:
                  {selectedAccount.password}@{selectedDomain?.name}
                </code>
                <button
                  onClick={() =>
                    copyToClipboard(
                      `impacket-psexec ${selectedAccount.username}:${selectedAccount.password}@${selectedDomain?.name}`,
                    )
                  }
                  className="bg-blue-500 text-white p-2 ml-2"
                >
                  Copy
                </button>
              </li>
              {/* Add more commands as needed */}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
