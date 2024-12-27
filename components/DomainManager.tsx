"use client";
import { useDomain } from "@/context/DomainContext";
import Sidebar from "./Sidebar";
import commands from "@/config/commands";

export default function DomainManager() {
  const { selectedDomain, selectedAccount } = useDomain();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  const renderCommands = () => {
    if (!selectedAccount || !selectedDomain) return null;

    return commands.map((command) => {
      const commandText = command.template
        .replace("{username}", selectedAccount.username)
        .replace("{password}", selectedAccount.password)
        .replace("{domain}", selectedDomain.name);

      return (
        <li key={command.name} className="mb-2">
          <code className="bg-gray-200 p-2 rounded">{commandText}</code>
          <button
            onClick={() => copyToClipboard(commandText)}
            className="bg-blue-500 text-white p-2 ml-2"
          >
            Copy
          </button>
        </li>
      );
    });
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-8">
        {selectedAccount && (
          <>
            <h2 className="text-xl mb-2">
              Commands for {selectedAccount.username}
            </h2>
            <ul>{renderCommands()}</ul>
          </>
        )}
      </div>
    </div>
  );
}
