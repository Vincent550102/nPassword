"use client";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useDomain } from "@/context/DomainContext";
import Sidebar from "./Sidebar";
import commands from "@/config/commands";
import "react-toastify/dist/ReactToastify.css";

export default function DomainManager() {
  const { selectedDomain, selectedAccount } = useDomain();
  const [targetHost, setTargetHost] = useState("");

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!", {
      position: "bottom-center",
      autoClose: 2000,
    });
  };

  const renderCommands = () => {
    if (!selectedAccount || !selectedDomain) return null;

    return commands.map((command, index) => {
      let commandText = command.template;
      if (command.authType === "password" && selectedAccount.password) {
        commandText = commandText
          .replace("{username}", selectedAccount.username)
          .replace("{password}", selectedAccount.password)
          .replace("{domain}", selectedDomain.name)
          .replace("{targetHost}", targetHost);
      } else if (command.authType === "ntlmHash" && selectedAccount.ntlmHash) {
        commandText = commandText
          .replace("{username}", selectedAccount.username)
          .replace("{ntlmHash}", selectedAccount.ntlmHash)
          .replace("{domain}", selectedDomain.name)
          .replace("{targetHost}", targetHost);
      } else {
        return null; // Skip this command if the required auth type is not available
      }

      return (
        <li key={`${command.name}-${index}`} className="mb-4">
          <h3 className="text-lg font-semibold mb-2">{command.name}</h3>
          <code className="bg-gray-200 p-2 rounded">{commandText}</code>
          <button
            onClick={() => copyToClipboard(commandText)}
            className="bg-blue-500 text-white p-2 ml-2 rounded hover:bg-blue-600 transition duration-300"
          >
            Copy
          </button>
        </li>
      );
    });
  };

  const renderAccountInfo = () => {
    if (!selectedAccount || !selectedDomain) return null;

    return (
      <div className="bg-white p-4 rounded shadow-md mb-8">
        <h3 className="text-lg font-semibold mb-2">Account Information</h3>
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
        <p>
          <strong>Domain:</strong> {selectedDomain.name}
        </p>
      </div>
    );
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-8">
        {selectedAccount && (
          <>
            {renderAccountInfo()}
            <div className="mb-8">
              <label
                htmlFor="targetHost"
                className="block text-lg font-semibold mb-2"
              >
                Target Host
              </label>
              <input
                type="text"
                id="targetHost"
                value={targetHost}
                onChange={(e) => setTargetHost(e.target.value)}
                placeholder="Enter target host"
                className="border p-2 w-full"
              />
            </div>
            <h2 className="text-xl mb-2">
              Commands for {selectedAccount.username}
            </h2>
            <ul>{renderCommands()}</ul>
          </>
        )}
      </div>
      <ToastContainer />
    </div>
  );
}
