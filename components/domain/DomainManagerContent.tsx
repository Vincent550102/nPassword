"use client";
import React, { useState } from "react";
import { useAppState } from "@/context/StoreContext";
import AccountList from "../account/AccountList";
import AccountInfo from "../account/AccountInfo";
import CommandList from "../command/CommandList";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import { ToastContainer } from "react-toastify";
import { FaSearch, FaServer, FaPlus, FaGithub } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";

interface DomainManagerContentProps {
  openDomainModal: () => void;
}

const DomainManagerContent: React.FC<DomainManagerContentProps> = ({
  openDomainModal,
}) => {
  const { selectedDomain, selectedAccount } = useAppState();

  const [targetHost, setTargetHost] = useState<string>("");
  const [commandSearchTerm, setCommandSearchTerm] = useState<string>("");

  // When no domain is selected, display a centered welcome message
  if (!selectedDomain) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="text-center p-6 max-w-lg">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 text-blue-600 p-4 rounded-full">
              <FaServer size={36} />
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-3 text-gray-800">
            Welcome to nPassword
          </h2>
          <p className="mb-5 text-gray-600 text-lg">
            A lightweight password manager for Windows Active Directory
          </p>
          <button
            onClick={openDomainModal}
            className="flex items-center justify-center mx-auto bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-5 rounded-lg transition-colors"
          >
            <FaPlus className="mr-2" />
            Select or Create Domain
          </button>
        </div>

        {/* Open source information */}
        <div className="absolute bottom-4 text-center">
          <a
            href="https://github.com/Vincent550102/nPassword"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-gray-500 hover:text-blue-600 transition-colors text-sm"
          >
            <FaGithub className="mr-1" size={16} />
            <span>Open Source on GitHub</span>
          </a>
        </div>
      </div>
    );
  }

  // When a domain is selected, show the main layout with sidebar
  return (
    <>
      <ToastContainer position="bottom-center" />

      <div className="flex h-full flex-col">
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar - fixed width, scrollable */}
          <aside className="w-72 flex-shrink-0 h-full overflow-hidden border-r border-gray-200 shadow-sm bg-white">
            <AccountList className="h-full" />
          </aside>

          {/* Main content area */}
          <main className="flex-1 overflow-auto p-0 bg-gray-50">
            {selectedAccount ? (
              <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-sm p-3 mb-3">
                  <AccountInfo
                    selectedAccount={selectedAccount}
                    selectedDomain={selectedDomain}
                  />
                </div>

                <Card title="Connection Options" className="mb-3 py-2">
                  <div className="mb-2">
                    <Input
                      label="Target Host"
                      type="text"
                      value={targetHost}
                      onChange={(e) => setTargetHost(e.target.value)}
                      placeholder="Enter target hostname or IP"
                    />
                  </div>
                </Card>

                {/* Command Search */}
                <div className="bg-white p-3 rounded-lg border border-gray-200 mb-3 shadow-sm">
                  <div className="flex items-center w-full">
                    <FaSearch className="text-gray-400 text-xl flex-shrink-0 mr-2" />
                    <div className="w-full">
                      <Input
                        value={commandSearchTerm}
                        onChange={(e) => setCommandSearchTerm(e.target.value)}
                        placeholder="Search commands (e.g., 'rdp', 'wmi', 'psexec'...)"
                        className="w-full border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <Card title="Available Commands" className="mb-4 py-2">
                  <CommandList
                    selectedAccount={selectedAccount}
                    selectedDomain={selectedDomain}
                    targetHost={targetHost}
                    searchTerm={commandSearchTerm}
                  />
                </Card>

                {/* Open source footer */}
                <div className="text-center mt-2 mb-4">
                  <a
                    href="https://github.com/Vincent550102/nPassword"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center text-gray-500 hover:text-blue-600 transition-colors text-xs"
                  >
                    <FaGithub className="mr-1" size={12} />
                    <span>Open Source on GitHub</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <div className="text-center p-6 max-w-md bg-white rounded-lg shadow-sm">
                  <div className="flex justify-center mb-3">
                    <div className="bg-blue-50 text-blue-500 p-3 rounded-full">
                      <FaSearch size={24} />
                    </div>
                  </div>
                  <h2 className="text-xl font-semibold mb-2">
                    Select an account from the sidebar
                  </h2>
                  <p className="text-gray-500">
                    Choose an account to view details and available commands.
                  </p>
                </div>

                {/* Open source information */}
                <div className="mt-4">
                  <a
                    href="https://github.com/Vincent550102/nPassword"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-gray-500 hover:text-blue-600 transition-colors text-sm"
                  >
                    <FaGithub className="mr-1" size={14} />
                    <span>Open Source on GitHub</span>
                  </a>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
};

export default DomainManagerContent;
