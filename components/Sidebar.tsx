"use client";
import { useState, useEffect } from "react";
import Modal from "./Modal";
import Image from "next/image";

interface Account {
  username: string;
  password: string;
}

interface Domain {
  name: string;
  accounts: Account[];
}

export default function Sidebar({
  selectedDomain,
  onAddAccount,
  onSelectAccount,
  onDeleteAccount,
  selectedAccount,
}: {
  selectedDomain: Domain | null;
  onAddAccount: (account: Account) => void;
  onSelectAccount: (account: Account) => void;
  onDeleteAccount: (username: string) => void;
  selectedAccount: Account | null;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAccount, setNewAccount] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    if (selectedDomain) {
      const accountExists = selectedDomain.accounts.some(
        (account) => account.username === newAccount.username,
      );
      if (accountExists) {
        setError("Username already exists.");
      } else {
        setError("");
      }
    }
  }, [newAccount.username, selectedDomain]);

  const handleAddAccount = () => {
    if (newAccount.username.trim() === "" || newAccount.password.trim() === "")
      return;
    if (error) return;
    onAddAccount(newAccount);
    setNewAccount({ username: "", password: "" });
    setIsModalOpen(false);
  };

  return (
    <div className="w-64 bg-gray-100 p-4">
      <h2 className="text-xl mb-4">Accounts</h2>
      <ul>
        {selectedDomain?.accounts.map((account) => (
          <li
            key={account.username}
            className={`mb-2 flex items-center ${selectedAccount?.username === account.username ? "bg-gray-300" : ""}`}
          >
            <Image
              src={
                account.username.endsWith("$") ? "/computer.svg" : "/user.svg"
              }
              alt="Account icon"
              width={16}
              height={16}
              className="mr-2"
            />
            <button
              onClick={() => onSelectAccount(account)}
              className="text-blue-500 underline"
            >
              {account.username}
            </button>
            <button
              onClick={() => onDeleteAccount(account.username)}
              className="text-red-500 ml-2"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      <button
        onClick={() => {
          setIsModalOpen(true);
          setError("");
        }}
        className="mt-4 bg-blue-500 text-white p-2 w-full"
      >
        Add Account
      </button>
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <div className="p-4">
            <h2 className="text-xl mb-4">Add New Account</h2>
            <input
              type="text"
              value={newAccount.username}
              onChange={(e) =>
                setNewAccount({ ...newAccount, username: e.target.value })
              }
              placeholder="Username"
              className="border p-2 mb-4 w-full text-black"
            />
            <input
              type="password"
              value={newAccount.password}
              onChange={(e) =>
                setNewAccount({ ...newAccount, password: e.target.value })
              }
              placeholder="Password"
              className="border p-2 mb-4 w-full text-black"
            />
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <button
              onClick={handleAddAccount}
              className="bg-blue-500 text-white p-2 w-full"
            >
              Add Account
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
