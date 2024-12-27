"use client";
import { useState } from "react";
import Modal from "./Modal";
import useLocalStorage from "@/hooks/useLocalStorage";

interface Domain {
  name: string;
  accounts: Account[];
}

interface Account {
  username: string;
  password: string;
}

interface Data {
  domains: Domain[];
}

const initialData: Data = { domains: [] };

export default function NavBar({
  onSelectDomain,
  selectedDomain,
}: {
  onSelectDomain: (domain: Domain | null) => void;
  selectedDomain: Domain | null;
}) {
  const [data, setData] = useLocalStorage<Data>(
    "passwordManagerData",
    initialData,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDomain, setNewDomain] = useState("");
  const [error, setError] = useState("");

  const addDomain = () => {
    if (newDomain.trim() === "") return;
    const domainExists = data.domains.some(
      (domain) => domain.name === newDomain,
    );
    if (domainExists) {
      setError("Domain already exists.");
      return;
    }
    const newDomainObject = { name: newDomain, accounts: [] };
    setData((prevData) => ({
      domains: [...prevData.domains, newDomainObject],
    }));
    setNewDomain("");
    setIsModalOpen(false);
    onSelectDomain(newDomainObject);
  };

  const deleteDomain = () => {
    if (
      selectedDomain &&
      confirm(
        `Are you sure you want to delete the domain "${selectedDomain.name}"?`,
      )
    ) {
      setData((prevData) => ({
        domains: prevData.domains.filter(
          (domain) => domain.name !== selectedDomain.name,
        ),
      }));
      onSelectDomain(null);
    }
  };

  return (
    <nav className="bg-gray-800 p-4 text-white flex justify-between items-center">
      <div className="relative">
        <select
          value={selectedDomain ? selectedDomain.name : ""}
          onChange={(e) => {
            const selectedDomain = data.domains.find(
              (domain) => domain.name === e.target.value,
            );
            if (selectedDomain) {
              onSelectDomain(selectedDomain);
            } else {
              onSelectDomain(null);
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
              onClick={addDomain}
              className="bg-blue-500 text-white p-2 w-full"
            >
              Add Domain
            </button>
          </div>
        </Modal>
      )}
      {selectedDomain && (
        <button onClick={deleteDomain} className="ml-4 bg-red-500 p-2 rounded">
          Delete Domain
        </button>
      )}
    </nav>
  );
}
