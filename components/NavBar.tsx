"use client";
import { useState, useCallback, useEffect, useRef } from "react";
import Modal from "@/components/Modal";
import { useDomain, Domain } from "@/context/DomainContext";
import useLocalStorage from "@/hooks/useLocalStorage";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function NavBar() {
  const {
    data,
    selectedDomain,
    setSelectedDomain,
    addDomain,
    deleteDomain,
    exportDomainData,
    exportUsernames,
    loadDomainData,
  } = useDomain();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDomain, setNewDomain] = useState("");
  const [error, setError] = useState("");
  const [domainToDelete, setDomainToDelete] = useState<string | null>(null);
  const [, setStoredDomainName] = useLocalStorage<string | null>(
    "selectedDomain",
    null,
  );

  // For export dropdown menu
  const [showExportOptions, setShowExportOptions] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  // Close export dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        exportRef.current &&
        !exportRef.current.contains(event.target as Node)
      ) {
        setShowExportOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleAddDomain = useCallback(() => {
    if (newDomain.trim() === "") {
      setError("Domain name cannot be empty.");
      return;
    }

    const domainExists = data.domains.some(
      (domain) => domain.name === newDomain,
    );

    if (domainExists) {
      setError("Domain already exists.");
      return;
    }

    const newDomainObject: Domain = { name: newDomain, accounts: [] };
    addDomain(newDomainObject);
    setNewDomain("");
    setSelectedDomain(newDomainObject);
    setIsModalOpen(false);
  }, [newDomain, data.domains, addDomain, setSelectedDomain]);

  const handleDeleteDomain = useCallback(() => {
    if (selectedDomain) {
      setDomainToDelete(selectedDomain.name);
    }
  }, [selectedDomain]);

  const confirmDeleteDomain = useCallback(() => {
    if (domainToDelete) {
      deleteDomain(domainToDelete);
      setDomainToDelete(null);
    }
  }, [domainToDelete, deleteDomain]);

  const handleLoadData = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          const newDomain = JSON.parse(text);
          loadDomainData(newDomain);
          event.target.value = "";
        } catch (error) {
          console.error("Error loading domain data:", error);
        }
      };

      reader.onerror = () => {
        console.error("Error reading file");
      };

      reader.readAsText(file);
    },
    [loadDomainData],
  );

  const handleTitleClick = useCallback(() => {
    setSelectedDomain(null);
    setStoredDomainName(null);
  }, [setSelectedDomain, setStoredDomainName]);

  const handleDomainChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value;
      if (!value) {
        setSelectedDomain(null);
        setStoredDomainName(null);
        return;
      }

      const domain = data.domains.find((d) => d.name === value);
      if (domain) {
        setSelectedDomain(domain);
        setStoredDomainName(domain.name);
      }
    },
    [data.domains, setSelectedDomain, setStoredDomainName],
  );

  const handleExportJSON = useCallback(() => {
    if (selectedDomain) {
      exportDomainData(selectedDomain.name);
    }
    setShowExportOptions(false);
  }, [selectedDomain, exportDomainData]);

  const handleExportUsernames = useCallback(() => {
    if (selectedDomain) {
      exportUsernames(selectedDomain.name);
    }
    setShowExportOptions(false);
  }, [selectedDomain, exportUsernames]);

  return (
    <nav className="bg-gray-800 p-4 text-white fixed top-0 left-0 right-0 z-10">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div
            className="text-xl font-bold cursor-pointer"
            onClick={handleTitleClick}
          >
            nPassword
          </div>
          <div className="text-gray-400">.</div>
          <a
            href="https://github.com/vincent550102/npassword"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-gray-300 transition-colors"
          >
            source code
          </a>
        </div>

        {selectedDomain && (
          <div className="flex flex-col md:flex-row items-end space-y-2 md:space-y-0 md:space-x-2">
            <div className="flex items-center space-x-2">
              <select
                value={selectedDomain.name}
                onChange={handleDomainChange}
                className="bg-gray-700 p-2 rounded w-40 sm:w-48"
                aria-label="Select domain"
              >
                <option value="">Select Domain</option>
                {data.domains.map((domain) => (
                  <option key={domain.name} value={domain.name}>
                    {domain.name}
                  </option>
                ))}
              </select>
              <button
                onClick={() => {
                  setIsModalOpen(true);
                  setError("");
                }}
                className="bg-blue-500 p-2 rounded flex-shrink-0 w-10 hover:bg-blue-600 transition-colors"
                aria-label="Add domain"
              >
                +
              </button>
              <label className="bg-yellow-500 text-white p-2 rounded cursor-pointer flex-shrink-0 hover:bg-yellow-600 transition-colors">
                Load
                <input
                  type="file"
                  accept="application/json"
                  onChange={handleLoadData}
                  className="hidden"
                />
              </label>
            </div>

            <div className="hidden md:flex items-center space-x-2">
              <div className="relative" ref={exportRef}>
                <button
                  onClick={() => setShowExportOptions(!showExportOptions)}
                  className="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition-colors"
                >
                  Export
                </button>
                {showExportOptions && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                    <ul className="py-1">
                      <li>
                        <button
                          onClick={handleExportJSON}
                          className="block px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left"
                        >
                          Export Full JSON
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={handleExportUsernames}
                          className="block px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left"
                        >
                          Export users.txt
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
              <button
                onClick={handleDeleteDomain}
                className="bg-red-500 p-2 rounded hover:bg-red-600 transition-colors"
              >
                Delete Domain
              </button>
            </div>
          </div>
        )}
      </div>
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Add New Domain</h2>
            <Input
              label="Domain Name"
              value={newDomain}
              onChange={(e) => setNewDomain(e.target.value)}
              placeholder="Enter domain name"
              error={error}
              className="mb-6"
            />
            <Button onClick={handleAddDomain} variant="primary" fullWidth>
              Add Domain
            </Button>
          </div>
        </Modal>
      )}
      {domainToDelete && (
        <Modal onClose={() => setDomainToDelete(null)}>
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Confirm Delete</h2>
            <p>
              Are you sure you want to delete the domain &quot;{domainToDelete}
              &quot;?
            </p>
            <div className="flex justify-end mt-6 space-x-2">
              <Button
                onClick={() => setDomainToDelete(null)}
                variant="secondary"
              >
                Cancel
              </Button>
              <Button onClick={confirmDeleteDomain} variant="danger">
                Delete
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </nav>
  );
}
