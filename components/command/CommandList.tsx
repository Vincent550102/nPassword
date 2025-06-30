"use client";
import React, { useMemo } from "react";
import { FaRegCopy } from "react-icons/fa";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { useCommands } from "@/hooks/useCommands";
import { Account, Domain } from "@/types";

interface CommandListProps {
  selectedAccount: Account | null;
  selectedDomain: Domain | null;
  targetHost: string;
  searchTerm: string;
}

const CommandList: React.FC<CommandListProps> = ({
  selectedAccount,
  selectedDomain,
  targetHost,
  searchTerm,
}) => {
  const { getFilteredCommands, copyToClipboard } = useCommands({
    selectedAccount,
    selectedDomain,
    targetHost,
    searchTerm,
  });

  const filteredCommands = useMemo(() => {
    return getFilteredCommands();
  }, [getFilteredCommands]);

  // No commands available
  if (!filteredCommands.length) {
    return (
      <div className="bg-gray-100 p-4 rounded-md text-gray-500 italic">
        No commands available.{" "}
        {!selectedAccount?.password && !selectedAccount?.ntlmHash
          ? "Add a password or NTLM hash to see available commands."
          : searchTerm
            ? "Try adjusting your search term."
            : ""}
      </div>
    );
  }

  return (
    <ul className="space-y-4">
      {filteredCommands.map((item, index) => (
        <li key={`cmd-${index}`} className="flex items-start group">
          <div
            className="p-2 rounded border border-gray-300 hover:bg-gray-100 cursor-pointer mr-2 transition-colors duration-200"
            onClick={() => copyToClipboard(item.commandText)}
            title="Copy to clipboard"
          >
            <FaRegCopy className="text-gray-600 group-hover:text-blue-500 transition-colors duration-200" />
          </div>
          <div className="flex-1 overflow-hidden">
            <SyntaxHighlighter
              language="bash"
              className="!m-0 rounded-md overflow-x-auto"
              customStyle={{ backgroundColor: "#f5f5f5" }}
            >
              {item.commandText}
            </SyntaxHighlighter>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default CommandList;
