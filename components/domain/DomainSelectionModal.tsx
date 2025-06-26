"use client";
import React, { useState } from "react";
import Modal from "../common/Modal";
import { Domain } from "@/types";
import Input from "@/components/ui/Input";
import { FaPlus, FaUpload, FaTrash } from "react-icons/fa";
import { useDomainActions } from "@/context/StoreContext";
import { toast } from "react-toastify";

interface DomainSelectionModalProps {
  domains: Domain[];
  onCloseAction: () => void;
  onSelectDomain: (domain: Domain) => void;
  onAddDomain: (domain: Domain) => void;
  onLoadDomain: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const DomainSelectionModal: React.FC<DomainSelectionModalProps> = ({
  domains,
  onCloseAction,
  onSelectDomain,
  onAddDomain,
  onLoadDomain,
}) => {
  const [newDomainName, setNewDomainName] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [error, setError] = useState("");
  const [domainToDelete, setDomainToDelete] = useState<string | null>(null);

  // Get domain actions from context
  const { deleteDomain } = useDomainActions();

  const handleCreateDomain = () => {
    if (!newDomainName.trim()) {
      setError("Domain name cannot be empty");
      return;
    }

    // Check for duplicate domain names
    if (
      domains.some(
        (domain) =>
          domain.name.toLowerCase() === newDomainName.trim().toLowerCase(),
      )
    ) {
      setError("Domain with this name already exists");
      return;
    }

    const domain: Domain = {
      name: newDomainName.trim(),
      accounts: [],
    };

    onAddDomain(domain);
    setNewDomainName("");
    setShowCreateForm(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCreateDomain();
    }
  };

  const confirmDeleteDomain = (domainName: string) => {
    deleteDomain(domainName);
    setDomainToDelete(null);
    toast.success(`Domain "${domainName}" deleted successfully!`);
  };

  return (
    <Modal onCloseAction={onCloseAction}>
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-6">Select Domain</h2>

        {domains.length > 0 ? (
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3">Existing Domains</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {domains.map((domain) => (
                <div
                  key={domain.name}
                  className="p-3 bg-gray-100 hover:bg-gray-200 transition-colors rounded-md cursor-pointer flex justify-between items-center group"
                >
                  <div
                    className="flex-1"
                    onClick={() => onSelectDomain(domain)}
                  >
                    <span className="font-medium">{domain.name}</span>
                    <span className="text-sm text-gray-500 ml-2">
                      {domain.accounts.length}{" "}
                      {domain.accounts.length === 1 ? "account" : "accounts"}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDomainToDelete(domain.name);
                    }}
                    className="p-1.5 rounded-full text-gray-500 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete domain"
                  >
                    <FaTrash size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-blue-800">
              No domains found. Create a new domain or import one to get
              started.
            </p>
          </div>
        )}

        {showCreateForm ? (
          <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-md">
            <h3 className="text-lg font-medium mb-3">Create New Domain</h3>
            <Input
              type="text"
              value={newDomainName}
              onChange={(e) => {
                setNewDomainName(e.target.value);
                setError("");
              }}
              onKeyDown={handleKeyDown}
              placeholder="Domain name (e.g., example.com)"
              className="mb-3 w-full"
              autoFocus
            />
            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
            <div className="flex space-x-3">
              <button
                onClick={handleCreateDomain}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
                disabled={!newDomainName.trim()}
              >
                Create Domain
              </button>
              <button
                onClick={() => {
                  setShowCreateForm(false);
                  setError("");
                }}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md mb-6 w-full transition-colors"
          >
            <FaPlus className="mr-2" />
            Create New Domain
          </button>
        )}

        <div className="border-t pt-6">
          <h3 className="text-lg font-medium mb-3">Import Domain</h3>
          <div className="flex items-center">
            <label className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md cursor-pointer transition-colors">
              <FaUpload className="mr-2" />
              Import from JSON
              <input
                type="file"
                accept=".json"
                onChange={onLoadDomain}
                className="hidden"
              />
            </label>
            <span className="text-sm text-gray-500 ml-4">
              Select a previously exported domain file
            </span>
          </div>
        </div>
      </div>

      {/* Delete Domain Confirmation Modal */}
      {domainToDelete && (
        <Modal onCloseAction={() => setDomainToDelete(null)}>
          <div className="p-5">
            <div className="flex items-center text-red-600 mb-4">
              <FaTrash size={22} className="mr-3" />
              <h2 className="text-xl font-semibold">Delete Domain</h2>
            </div>

            <p className="mb-4">
              Are you sure you want to delete the domain{" "}
              <strong>{domainToDelete}</strong>?
            </p>

            <p className="mb-6 text-gray-600 text-sm bg-yellow-50 p-3 rounded border border-yellow-200">
              This action cannot be undone. All accounts and credentials in this
              domain will be permanently removed.
            </p>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDomainToDelete(null)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() => confirmDeleteDomain(domainToDelete)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white"
              >
                Delete Domain
              </button>
            </div>
          </div>
        </Modal>
      )}
    </Modal>
  );
};

export default DomainSelectionModal;
