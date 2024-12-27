"use client";
import { useDomain } from "@/context/DomainContext";
import Sidebar from "./Sidebar";

export default function DomainManager() {
  const {
    selectedDomain,
    selectedAccount,
    setSelectedAccount,
    addAccount,
    deleteAccount,
  } = useDomain();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  return (
    <div className="flex">
      <Sidebar />
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
