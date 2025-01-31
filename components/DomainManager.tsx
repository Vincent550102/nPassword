import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useDomain } from "@/context/DomainContext";
import Sidebar from "./Sidebar";
import Modal from "./Modal";
import domainCommands from "@/config/commands.domain";
import localCommands from "@/config/commands.local";
import "react-toastify/dist/ReactToastify.css";
import { FaSearch, FaRegCopy } from "react-icons/fa";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

export default function DomainManager() {
  const {
    data,
    selectedDomain,
    selectedAccount,
    addDomain,
    loadDomainData,
    setSelectedDomain,
  } = useDomain();
  const [targetHost, setTargetHost] = useState("");
  const [, setIsModalOpen] = useState(false);
  const [newDomain, setNewDomain] = useState("");
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (data.domains.length === 0) {
      setIsModalOpen(true);
    }
  }, [data.domains]);

  const handleAddDomain = () => {
    if (newDomain.trim() === "") return;
    const domainExists = data.domains.some(
      (domain) => domain.name === newDomain,
    );
    if (domainExists) {
      setError("Domain already exists.");
      return;
    }
    const newDomainObject = { name: newDomain, accounts: [] };
    addDomain(newDomainObject);
    setNewDomain("");
    setSelectedDomain(newDomainObject);
    setIsModalOpen(false);
  };

  const unsecureCopyToClipboard = (text: string) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
  };

  const copyToClipboard = (text: string) => {
    if (navigator.clipboard || window.isSecureContext) {
      navigator.clipboard.writeText(text);
    } else {
      unsecureCopyToClipboard(text);
    }
    toast.success("Copied to clipboard!", {
      position: "bottom-center",
      autoClose: 2000,
    });
  };

  const handleLoadData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const newDomain = JSON.parse(text);
        loadDomainData(newDomain);
        event.target.value = "";
      };
      reader.readAsText(file);
    }
  };

  const renderCommands = () => {
    if (!selectedAccount || !selectedDomain) return null;

    const applicableCommands =
      selectedAccount.type === "local" ? localCommands : domainCommands;

    return applicableCommands
      .filter((command) => command.template.includes(searchTerm))
      .map((command, index) => {
        let commandText = command.template;
        if (command.authType === "password" && selectedAccount.password) {
          commandText = commandText
            .replace(
              "{username}",
              selectedAccount.username.replace(/'/g, "\\'"),
            )
            .replace(
              "{password}",
              selectedAccount.password.replace(/'/g, "\\'"),
            )
            .replace("{domain}", selectedDomain.name.replace(/'/g, "\\'"))
            .replace("{targetHost}", targetHost.replace(/'/g, "\\'"));
        } else if (
          command.authType === "ntlmHash" &&
          selectedAccount.ntlmHash
        ) {
          commandText = commandText
            .replace(
              "{username}",
              selectedAccount.username.replace(/'/g, "\\'"),
            )
            .replace(
              "{ntlmHash}",
              selectedAccount.ntlmHash.replace(/'/g, "\\'"),
            )
            .replace("{domain}", selectedDomain.name.replace(/'/g, "\\'"))
            .replace("{targetHost}", targetHost.replace(/'/g, "\\'"));
        } else {
          return null; // Skip this command if the required auth type is not available
        }
        return (
          <li key={`${index}`} className="mb-4 flex items-center">
            <div
              className="p-2 rounded border border-gray-300 hover:bg-gray-100 cursor-pointer mr-2"
              onClick={() => copyToClipboard(commandText)}
            >
              <FaRegCopy />
            </div>
            <SyntaxHighlighter
              language="bash"
              className="m-0 inline-block min-w-[200px] max-w-full overflow-x-auto"
            >
              {commandText}
            </SyntaxHighlighter>
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
      </div>
    );
  };

  if (!selectedDomain) {
    return (
      <Modal onClose={() => setIsModalOpen(false)}>
        <div className="p-4">
          <div className="mb-4">
            <h2 className="text-xl mb-4">Select Existing Domain</h2>
            <select
              onChange={(e) => {
                const selectedDomain = data.domains.find(
                  (domain) => domain.name === e.target.value,
                );
                if (selectedDomain) {
                  setSelectedDomain(selectedDomain);
                  setIsModalOpen(false);
                }
              }}
              className="border p-2 w-full text-black"
            >
              <option value="">Select Domain</option>
              {data.domains.map((domain) => (
                <option key={domain.name} value={domain.name}>
                  {domain.name}
                </option>
              ))}
            </select>
          </div>
          <h2 className="text-xl mb-4">Or Load Domain</h2>
          <label className="mb-4 bg-yellow-500 text-white p-2 rounded cursor-pointer">
            Load
            <input
              type="file"
              accept="application/json"
              onChange={handleLoadData}
              className="hidden"
            />
          </label>
          <h2 className="text-xl mb-4 mt-4">Or Add New Domain</h2>
          <input
            type="text"
            value={newDomain}
            onChange={(e) => setNewDomain(e.target.value)}
            placeholder="New domain"
            className="border p-2 mb-4 w-full text-black"
          />

          {error && <p className="text-red-500 mb-4">{error}</p>}
          <button
            onClick={handleAddDomain}
            className="bg-blue-500 text-white p-2 w-full"
          >
            Add Domain
          </button>
        </div>
      </Modal>
    );
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-72">
        {" "}
        {}
        {selectedAccount && (
          <>
            {renderAccountInfo()}
            <div className="mb-8 w-full max-w-lg">
              <h2 className="text-lg font-semibold mb-2 flex items-center">
                <FaSearch className="mr-2" />
                Search Commands
              </h2>
              <input
                type="text"
                id="searchCommands"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search commands"
                className="border p-2 w-full"
              />
            </div>
            <hr className="my-4" />
            <div className="mb-8 w-full max-w-lg">
              <h2 className="text-lg font-semibold mb-2">Target Host</h2>
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
