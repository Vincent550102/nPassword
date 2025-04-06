"use client";
import React, { useState } from "react";
import { useDomain } from "@/context/DomainContext";
import Sidebar from "@/components/Sidebar";
import AccountInfo from "@/components/AccountInfo";
import CommandList from "@/components/CommandList";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaSearch } from "react-icons/fa";

interface DomainManagerContentProps {
  openDomainModal: () => void;
}

const DomainManagerContent: React.FC<DomainManagerContentProps> = ({
  openDomainModal,
}) => {
  const {
    selectedDomain,
    selectedAccount,
    addTagToAccount,
    removeTagFromAccount,
  } = useDomain();

  const [targetHost, setTargetHost] = useState<string>("");
  const [commandSearchTerm, setCommandSearchTerm] = useState<string>("");

  return (
    <>
      <ToastContainer position="bottom-center" />

      <div className="flex flex-col md:flex-row">
        <Sidebar />

        <div className="flex-1 md:ml-64 p-4">
          {!selectedDomain ? (
            <div className="text-center p-8">
              <h2 className="text-2xl font-bold mb-4">Welcome to nPassword</h2>
              <p className="mb-4">
                Please select a domain or create a new one to get started.
              </p>
              <button
                onClick={openDomainModal}
                className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              >
                Select Domain
              </button>
            </div>
          ) : selectedAccount ? (
            <div>
              <AccountInfo
                selectedAccount={selectedAccount}
                selectedDomain={selectedDomain}
                addTagToAccount={addTagToAccount}
                removeTagFromAccount={removeTagFromAccount}
              />

              <Card title="Connection Options" className="mb-4">
                <div className="mb-4">
                  <Input
                    label="Target Host"
                    type="text"
                    value={targetHost}
                    onChange={(e) => setTargetHost(e.target.value)}
                    placeholder="Enter target hostname or IP"
                  />
                </div>
              </Card>

              {/* Simplified Search Commands with just icon and input */}
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 mb-4 shadow-sm">
                <div className="flex items-baseline w-full">
                  <FaSearch className="text-blue-500 text-xl flex-shrink-0 mr-3 transform translate-y-1" />
                  <div className="w-full">
                    <Input
                      value={commandSearchTerm}
                      onChange={(e) => setCommandSearchTerm(e.target.value)}
                      placeholder="Search commands (e.g., 'rdp', 'wmi', 'psexec'...)"
                      className="w-full border-blue-300 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
              <Card title="Available Commands">
                <CommandList
                  selectedAccount={selectedAccount}
                  selectedDomain={selectedDomain}
                  targetHost={targetHost}
                  searchTerm={commandSearchTerm}
                />
              </Card>
            </div>
          ) : (
            <div className="text-center p-8">
              <h2 className="text-xl font-semibold mb-4">
                Select an account from the sidebar
              </h2>
              <p className="text-gray-500">
                No account selected. Please select an account from the sidebar
                to view details and commands.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DomainManagerContent;
