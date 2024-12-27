"use client";
import { useState, useEffect } from "react";
import Modal from "@/components/Modal";
import { useDomain } from "@/context/DomainContext";
import Image from "next/image";

interface Account {
  username: string;
  password?: string;
  ntlmHash?: string;
}

export default function Sidebar() {
  const {
    selectedDomain,
    selectedAccount,
    setSelectedAccount,
    addAccount,
    deleteAccount,
    updateAccount,
  } = useDomain();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newAccount, setNewAccount] = useState({
    username: "",
    password: "",
    ntlmHash: "",
  });
  const [editAccount, setEditAccount] = useState({
    username: "",
    password: "",
    ntlmHash: "",
  });
  const [error, setError] = useState("");
  const [accountToDelete, setAccountToDelete] = useState<string | null>(null);

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
    if (
      newAccount.username.trim() === "" ||
      (newAccount.password.trim() === "" && newAccount.ntlmHash.trim() === "")
    )
      return;
    if (error) return;
    addAccount(newAccount);
    setNewAccount({ username: "", password: "", ntlmHash: "" });
    setIsModalOpen(false);
  };

  const handleDeleteAccount = (username: string) => {
    setAccountToDelete(username);
  };

  const confirmDeleteAccount = () => {
    if (accountToDelete) {
      deleteAccount(accountToDelete);
      setAccountToDelete(null);
    }
  };

  const handleEditAccount = (account: Account) => {
    setEditAccount({
      username: account.username || "",
      password: account.password || "",
      ntlmHash: account.ntlmHash || "",
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateAccount = () => {
    if (
      editAccount.username.trim() === "" ||
      (editAccount.password.trim() === "" && editAccount.ntlmHash.trim() === "")
    )
      return;
    updateAccount(editAccount.username, editAccount);
    setIsEditModalOpen(false);
  };

  return (
    <div className="min-w-64 w-auto bg-gray-100 p-4">
      <h2 className="text-xl mb-4">Accounts</h2>
      <ul>
        {selectedDomain?.accounts.map((account) => (
          <li
            key={account.username}
            onClick={() => setSelectedAccount(account)}
            className={`mb-2 flex items-center justify-between p-2 rounded cursor-pointer transition-shadow ${
              selectedAccount?.username === account.username
                ? "bg-gray-300"
                : "bg-white"
            } hover:shadow-md`}
          >
            <div className="flex items-center">
              <Image
                src={
                  account.username.endsWith("$") ? "/computer.svg" : "/user.svg"
                }
                alt="Account icon"
                className="mr-4"
                width={32}
                height={32}
              />
              <div className="flex flex-col">
                <span className="text-gray-500">{selectedDomain.name}/</span>
                <span className="text-black text-lg ml-2 truncate max-w-xs">
                  {account.username}
                </span>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditAccount(account);
                }}
                className="text-blue-500 ml-2"
              >
                &#9998;
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteAccount(account.username);
                }}
                className="text-red-500 ml-2"
              >
                &times;
              </button>
            </div>
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
            <input
              type="text"
              value={newAccount.ntlmHash}
              onChange={(e) =>
                setNewAccount({ ...newAccount, ntlmHash: e.target.value })
              }
              placeholder="NTLM Hash"
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
      {isEditModalOpen && (
        <Modal onClose={() => setIsEditModalOpen(false)}>
          <div className="p-4">
            <h2 className="text-xl mb-4">Edit Account</h2>
            <input
              type="text"
              value={editAccount.username}
              onChange={(e) =>
                setEditAccount({ ...editAccount, username: e.target.value })
              }
              placeholder="Username"
              className="border p-2 mb-4 w-full text-black"
            />
            <input
              type="password"
              value={editAccount.password}
              onChange={(e) =>
                setEditAccount({ ...editAccount, password: e.target.value })
              }
              placeholder="Password"
              className="border p-2 mb-4 w-full text-black"
            />
            <input
              type="text"
              value={editAccount.ntlmHash}
              onChange={(e) =>
                setEditAccount({ ...editAccount, ntlmHash: e.target.value })
              }
              placeholder="NTLM Hash"
              className="border p-2 mb-4 w-full text-black"
            />
            <button
              onClick={handleUpdateAccount}
              className="bg-blue-500 text-white p-2 w-full"
            >
              Update Account
            </button>
          </div>
        </Modal>
      )}
      {accountToDelete && (
        <Modal onClose={() => setAccountToDelete(null)}>
          <div className="p-4">
            <h2 className="text-xl mb-4">Confirm Delete</h2>
            <p>
              Are you sure you want to delete the account &quot;
              {accountToDelete}&quot;?
            </p>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setAccountToDelete(null)}
                className="bg-gray-500 text-white p-2 mr-2"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteAccount}
                className="bg-red-500 text-white p-2"
              >
                Delete
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
