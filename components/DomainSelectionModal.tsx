import React, { useState, useEffect } from "react";
import Modal from "@/components/Modal";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Domain } from "@/types";

interface DomainSelectionModalProps {
  domains: Domain[];
  onClose: () => void;
  onSelectDomain: (domain: Domain) => void;
  onAddDomain: (domain: Domain) => void;
  onLoadDomain: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const DomainSelectionModal: React.FC<DomainSelectionModalProps> = ({
  domains,
  onClose,
  onSelectDomain,
  onAddDomain,
  onLoadDomain,
}) => {
  const [newDomain, setNewDomain] = useState("");
  const [error, setError] = useState("");
  const [selectedDomainId, setSelectedDomainId] = useState("");

  // Clear errors when input changes
  useEffect(() => {
    if (error && newDomain) {
      setError("");
    }
  }, [newDomain, error]);

  const validateDomainName = (name: string): boolean => {
    if (name.trim() === "") {
      setError("Domain name cannot be empty.");
      return false;
    }

    if (domains.some((domain) => domain.name === name)) {
      setError("Domain with this name already exists.");
      return false;
    }

    return true;
  };

  const handleAddDomain = () => {
    if (!validateDomainName(newDomain)) {
      return;
    }

    const domainObject: Domain = { name: newDomain, accounts: [] };
    onAddDomain(domainObject);
    setNewDomain("");
  };

  const handleDomainSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (!value) return;

    setSelectedDomainId(value);
    const selectedDomain = domains.find((domain) => domain.name === value);
    if (selectedDomain) {
      onSelectDomain(selectedDomain);
    }
  };

  return (
    <Modal onClose={onClose}>
      <div className="p-6">
        {domains.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">
              Select Existing Domain
            </h2>
            <select
              value={selectedDomainId}
              onChange={handleDomainSelection}
              className="border p-2 w-full text-black rounded"
            >
              <option value="">Select Domain</option>
              {domains.map((domain) => (
                <option key={domain.name} value={domain.name}>
                  {domain.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Load Domain from File</h2>
          <label className="bg-yellow-500 text-white p-2 rounded cursor-pointer inline-block hover:bg-yellow-600 transition-colors">
            Load JSON File
            <input
              type="file"
              accept="application/json"
              onChange={onLoadDomain}
              className="hidden"
            />
          </label>
          <p className="text-sm text-gray-600 mt-2">
            Load a previously exported domain configuration
          </p>
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-4">Create New Domain</h2>
          <Input
            label="Domain Name"
            value={newDomain}
            onChange={(e) => setNewDomain(e.target.value)}
            placeholder="Enter domain name"
            error={error}
          />
        </div>

        <Button
          onClick={handleAddDomain}
          variant="primary"
          fullWidth
          disabled={!newDomain.trim()}
        >
          Create Domain
        </Button>
      </div>
    </Modal>
  );
};

export default DomainSelectionModal;
