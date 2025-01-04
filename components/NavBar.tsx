"use client";
import { useState } from "react";
import Modal from "@/components/Modal";
import { useDomain } from "@/context/DomainContext";

export default function NavBar() {
  const {
    data,
    selectedDomain,
    setSelectedDomain,
    addDomain,
    deleteDomain,
    exportDomainData,
    loadDomainData,
  } = useDomain();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDomain, setNewDomain] = useState("");
  const [error, setError] = useState("");
  const [domainToDelete, setDomainToDelete] = useState<string | null>(null);

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

  const handleDeleteDomain = () => {
    if (selectedDomain) {
      setDomainToDelete(selectedDomain.name);
    }
  };

  const confirmDeleteDomain = () => {
    if (domainToDelete) {
      deleteDomain(domainToDelete);
      setDomainToDelete(null);
    }
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

  return (
    <nav className="bg-gray-800 p-4 text-white flex justify-between items-center fixed top-0 left-0 right-0 z-10">
      <div className="flex items-center space-x-2">
        <div className="text-xl font-bold">nPassword</div>
        <div className="text-gray-400">.</div>
        <a
          href="https://github.com/vincent550102/npassword"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-gray-300 transition-colors"
        >
          GitHub
        </a>
      </div>
      {selectedDomain && (
        <div className="flex items-center space-x-2">
          <select
            value={selectedDomain ? selectedDomain.name : ""}
            onChange={(e) => {
              const selectedDomain = data.domains.find(
                (domain) => domain.name === e.target.value,
              );
              if (selectedDomain) {
                setSelectedDomain(selectedDomain);
              } else {
                setSelectedDomain(null);
              }
            }}
            className="bg-gray-700 p-2 rounded"
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
            className="ml-2 bg-blue-500 p-2 rounded"
          >
            +
          </button>
          <label className="ml-2 bg-yellow-500 text-white p-2 rounded cursor-pointer">
            Load
            <input
              type="file"
              accept="application/json"
              onChange={handleLoadData}
              className="hidden"
            />
          </label>
        </div>
      )}
      <div className="flex items-center space-x-2">
        {selectedDomain && (
          <>
            <button
              onClick={() => exportDomainData(selectedDomain.name)}
              className="bg-green-500 text-white p-2 rounded"
            >
              Export
            </button>
            <button
              onClick={handleDeleteDomain}
              className="bg-red-500 p-2 rounded"
            >
              Delete Domain
            </button>
          </>
        )}
      </div>
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <div className="p-4">
            <h2 className="text-xl mb-4">Add New Domain</h2>
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
      )}
      {domainToDelete && (
        <Modal onClose={() => setDomainToDelete(null)}>
          <div className="p-4">
            <h2 className="text-xl mb-4">Confirm Delete</h2>
            <p>
              Are you sure you want to delete the domain &quot;{domainToDelete}
              &quot;?
            </p>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setDomainToDelete(null)}
                className="bg-gray-500 text-white p-2 mr-2"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteDomain}
                className="bg-red-500 text-white p-2"
              >
                Delete
              </button>
            </div>
          </div>
        </Modal>
      )}
    </nav>
  );
}
