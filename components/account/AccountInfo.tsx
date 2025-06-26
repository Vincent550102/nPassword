"use client";
import React from "react";
import { Account, Domain } from "@/types";
import {
  FaUser,
  FaDesktop,
  FaKey,
  FaFingerprint,
  FaCopy,
} from "react-icons/fa";
import { toast } from "react-toastify";

interface AccountInfoProps {
  selectedAccount: Account;
  selectedDomain: Domain;
}

const AccountInfo: React.FC<AccountInfoProps> = ({
  selectedAccount,
  selectedDomain,
}) => {
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        toast.success(`${label} copied to clipboard`);
      },
      () => {
        toast.error(`Failed to copy ${label}`);
      },
    );
  };

  const isComputer = selectedAccount.username.endsWith("$");
  const fullUsername =
    selectedAccount.type === "domain"
      ? `${selectedDomain.name}\\${selectedAccount.username}`
      : `${selectedAccount.host || "local"}\\${selectedAccount.username}`;

  // Format strings for quick copy
  const usernamePasswordFormat = `'${selectedDomain.name}'/'${selectedAccount.username}':'${selectedAccount.password || ""}'`;

  const hashFormat = selectedAccount.ntlmHash
    ? `'${selectedDomain.name}'/'${selectedAccount.username}' -hashes ':${selectedAccount.ntlmHash}'`
    : `'${selectedDomain.name}'/'${selectedAccount.username}' -hashes ':00000000000000000000000000000000'`;

  return (
    <div className="p-2 bg-gray-50">
      {/* Enhanced header with account details */}
      <div className="bg-white p-2 rounded border border-gray-200 mb-2">
        <div className="flex mb-1">
          {/* Icon and username */}
          <div
            className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-2 ${
              isComputer
                ? "bg-blue-100 text-blue-600"
                : "bg-green-100 text-green-600"
            }`}
          >
            {isComputer ? <FaDesktop size={20} /> : <FaUser size={20} />}
          </div>

          {/* Account details combined with username */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center">
              <h2 className="text-lg font-bold text-gray-800">
                {selectedAccount.username}
              </h2>
              {isComputer && (
                <span className="ml-2 bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs">
                  Computer
                </span>
              )}

              {/* Tags moved to the right of username */}
              {selectedAccount.tags && selectedAccount.tags.length > 0 && (
                <div className="ml-3 flex flex-wrap gap-1">
                  {selectedAccount.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Full username with copy button */}
            <div className="flex items-center mt-1">
              <code className="bg-gray-50 px-2 py-0.5 rounded text-sm font-mono truncate text-gray-700 flex-grow">
                {fullUsername}
              </code>
              <button
                onClick={() => copyToClipboard(fullUsername, "Username")}
                className="ml-1 p-1 rounded hover:bg-gray-100 text-gray-600"
                title="Copy username"
              >
                <FaCopy size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Account details in compact table format */}
        <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 mt-1 text-sm border-t border-gray-100 pt-1">
          <div className="flex">
            <span className="text-gray-600 font-medium w-16">Type:</span>
            <span>{isComputer ? "Computer Account" : "User Account"}</span>
          </div>
          <div className="flex">
            <span className="text-gray-600 font-medium w-16">Domain:</span>
            <span>
              {selectedAccount.type === "domain"
                ? selectedDomain.name
                : selectedAccount.host || "Local"}
            </span>
          </div>
          {selectedAccount.host && (
            <div className="flex">
              <span className="text-gray-600 font-medium w-16">Host:</span>
              <span>{selectedAccount.host}</span>
            </div>
          )}
        </div>
      </div>

      {/* Main content - two column layout */}
      <div className="grid grid-cols-2 gap-2">
        {/* Left column */}
        <div>
          {/* Password */}
          {selectedAccount.password && (
            <div className="bg-white p-2 rounded border border-gray-200">
              <div className="flex items-center mb-0.5">
                <FaKey className="mr-1 text-blue-500" size={14} />
                <span className="font-medium text-sm text-gray-700">
                  Password
                </span>
              </div>
              <div className="flex items-center">
                <code className="flex-1 bg-gray-50 p-1 rounded text-sm font-mono truncate">
                  {selectedAccount.password}
                </code>
                <button
                  onClick={() =>
                    copyToClipboard(selectedAccount.password || "", "Password")
                  }
                  className="ml-1 p-1 rounded hover:bg-gray-100 text-gray-600"
                  title="Copy password"
                >
                  <FaCopy size={14} />
                </button>
              </div>
            </div>
          )}

          {/* No password case */}
          {!selectedAccount.password && (
            <div className="bg-white p-2 rounded border border-gray-200">
              <div className="flex items-center mb-0.5">
                <FaKey className="mr-1 text-gray-400" size={14} />
                <span className="font-medium text-sm text-gray-400">
                  Password
                </span>
              </div>
              <div className="text-gray-500 text-sm italic p-1">
                No password stored
              </div>
            </div>
          )}
        </div>

        {/* Right column */}
        <div>
          {/* NTLM Hash */}
          {selectedAccount.ntlmHash && (
            <div className="bg-white p-2 rounded border border-gray-200">
              <div className="flex items-center mb-0.5">
                <FaFingerprint className="mr-1 text-blue-500" size={14} />
                <span className="font-medium text-sm text-gray-700">
                  NTLM Hash
                </span>
              </div>
              <div className="flex items-center">
                <code
                  className="flex-1 bg-gray-50 p-1 rounded text-sm font-mono overflow-x-auto whitespace-nowrap"
                  style={{ maxWidth: "calc(100% - 30px)" }}
                >
                  {selectedAccount.ntlmHash}
                </code>
                <button
                  onClick={() =>
                    copyToClipboard(selectedAccount.ntlmHash || "", "NTLM Hash")
                  }
                  className="ml-1 p-1 rounded hover:bg-gray-100 text-gray-600 flex-shrink-0"
                  title="Copy NTLM hash"
                >
                  <FaCopy size={14} />
                </button>
              </div>
            </div>
          )}

          {/* No NTLM Hash case */}
          {!selectedAccount.ntlmHash && (
            <div className="bg-white p-2 rounded border border-gray-200">
              <div className="flex items-center mb-0.5">
                <FaFingerprint className="mr-1 text-gray-400" size={14} />
                <span className="font-medium text-sm text-gray-400">
                  NTLM Hash
                </span>
              </div>
              <div className="text-gray-500 text-sm italic p-1">
                No NTLM hash stored
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Command hints - full width footer with updated formats */}
      <div className="mt-2 bg-blue-50 p-2 rounded border border-blue-100">
        <div className="font-medium mb-0.5 text-xs text-blue-700">
          Quick Copy Format:
        </div>
        <div className="grid grid-cols-2 gap-2">
          {/* Updated username:password format */}
          <div className="bg-white rounded border border-blue-100 p-1">
            <code className="text-xs font-mono block truncate">
              {usernamePasswordFormat}
            </code>
            <button
              onClick={() =>
                copyToClipboard(
                  usernamePasswordFormat,
                  "Username:Password format",
                )
              }
              className="mt-1 w-full flex items-center justify-center py-0.5 text-xs bg-blue-50 hover:bg-blue-100 rounded text-blue-700"
            >
              <FaCopy size={10} className="mr-1" /> Copy User:Pass Format
            </button>
          </div>

          {/* Updated hash format */}
          <div className="bg-white rounded border border-blue-100 p-1">
            <code className="text-xs font-mono block truncate">
              {hashFormat}
            </code>
            <button
              onClick={() => copyToClipboard(hashFormat, "Hash command format")}
              className="mt-1 w-full flex items-center justify-center py-0.5 text-xs bg-blue-50 hover:bg-blue-100 rounded text-blue-700"
              disabled={!selectedAccount.ntlmHash}
            >
              <FaCopy size={10} className="mr-1" /> Copy Hash Format
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountInfo;
