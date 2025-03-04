"use client";
import { useState, useEffect, useCallback } from "react";
import Modal from "@/components/Modal";
import AccountTypeToggle from "@/components/AccountTypeToggle";
import { useDomain } from "@/context/DomainContext";
import Image from "next/image";
import { FaPlus } from "react-icons/fa";

interface Account {
  username: string;
  password?: string;
  ntlmHash?: string;
  tags?: string[];
  type: "local" | "domain";
  host?: string;
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
    tags: [] as string[],
    type: "domain" as "local" | "domain",
    host: "",
  });
  const [editAccount, setEditAccount] = useState({
    username: "",
    password: "",
    ntlmHash: "",
    tags: [] as string[],
    type: "domain" as "local" | "domain",
    host: "",
  });
  const [newTag, setNewTag] = useState("");
  const [editTag, setEditTag] = useState("");
  const [error, setError] = useState("");
  const [accountToDelete, setAccountToDelete] = useState<string | null>(null);
  const [isTagInputVisible, setIsTagInputVisible] = useState(false);
  const [isEditTagInputVisible, setIsEditTagInputVisible] = useState(false);

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
    setNewAccount({
      username: "",
      password: "",
      ntlmHash: "",
      tags: [],
      type: "domain",
      host: "",
    });
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
      tags: account.tags || [],
      type: account.type,
      host: account.host || "",
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

  const handleAddNewTag = () => {
    if (newTag.trim() === "") return;
    setNewAccount((prev) => ({
      ...prev,
      tags: [...prev.tags, newTag],
    }));
    setNewTag("");
    setIsTagInputVisible(false);
  };

  const handleRemoveNewTag = (tag: string) => {
    setNewAccount((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const handleAddEditTag = () => {
    if (editTag.trim() === "") return;
    setEditAccount((prev) => ({
      ...prev,
      tags: [...prev.tags, editTag],
    }));
    setEditTag("");
    setIsEditTagInputVisible(false);
  };

  const handleRemoveEditTag = (tag: string) => {
    setEditAccount((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const handleTagInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    type: "new" | "edit",
  ) => {
    if (e.key === "Enter") {
      if (type === "new") {
        handleAddNewTag();
      } else {
        handleAddEditTag();
      }
    }
  };

  const handleAccountTypeChange = useCallback((type: "local" | "domain") => {
    setNewAccount((prev) => ({
      ...prev,
      type,
    }));
  }, []);

  const handleEditAccountTypeChange = useCallback(
    (type: "local" | "domain") => {
      setEditAccount((prev) => ({
        ...prev,
        type,
      }));
    },
    [],
  );

  return (
    <div className="w-[calc(100%+2rem)] md:w-64 bg-gray-100 p-4 md:h-screen md:fixed md:overflow-y-auto overflow-x-auto -mx-4 md:mx-0 px-4">
      <div className="flex items-center mb-4">
        <button
          onClick={() => {
            setIsModalOpen(true);
            setError("");
          }}
          className="text-blue-500 mr-2 p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition duration-300"
        >
          <FaPlus />
        </button>
        <h2 className="text-xl">Accounts</h2>
      </div>

      <div className="flex md:block space-x-2 md:space-x-0">
        {selectedDomain?.accounts.map((account) => (
          <div
            key={account.username}
            onClick={() => setSelectedAccount(account)}
            className={`
              shrink-0 md:shrink
              md:mb-2
              p-2 rounded
              cursor-pointer
              transition-shadow
              transform
              hover:shadow-md
              active:scale-95
              ${selectedAccount?.username === account.username ? "bg-gray-300" : "bg-white"}
            `}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Image
                  src={
                    account.username.endsWith("$")
                      ? "/computer.svg"
                      : "/user.svg"
                  }
                  alt="Account icon"
                  className="mr-4"
                  width={32}
                  height={32}
                />
                <div className="flex flex-col">
                  <span className="text-gray-500 whitespace-nowrap">
                    {account.type === "local"
                      ? account.host + "$"
                      : selectedDomain.name + "/"}
                  </span>
                  <span className="text-black text-lg ml-2 whitespace-nowrap">
                    {account.username}
                  </span>
                </div>
              </div>
              <div className="flex items-center ml-4">
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
            </div>
            {account.tags && (
              <div className="flex flex-wrap mt-1">
                {account.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-blue-200 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded whitespace-nowrap"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <div className="p-4">
            <h2 className="text-xl mb-4">Add New Account</h2>
            <AccountTypeToggle
              onChange={handleAccountTypeChange}
              initialType="domain"
            />
            {newAccount.type === "local" && (
              <input
                type="text"
                value={newAccount.host}
                onChange={(e) =>
                  setNewAccount({ ...newAccount, host: e.target.value })
                }
                placeholder="Host"
                className="border p-2 mb-4 w-full text-black"
              />
            )}
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
              type="text"
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
            <div className="mb-4">
              <h3 className="text-lg mb-2">Tags</h3>
              <div className="flex flex-wrap mb-2">
                {newAccount.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-blue-200 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded cursor-pointer"
                    onClick={() => handleRemoveNewTag(tag)}
                  >
                    {tag} &times;
                  </span>
                ))}
                {isTagInputVisible ? (
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => handleTagInputKeyDown(e, "new")}
                    placeholder="New tag"
                    className="bg-blue-200 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded"
                    autoFocus
                  />
                ) : (
                  <button
                    onClick={() => setIsTagInputVisible(true)}
                    className="bg-gray-200 text-gray-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded"
                  >
                    + Add Tag
                  </button>
                )}
              </div>
            </div>
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
            <AccountTypeToggle
              onChange={handleEditAccountTypeChange}
              initialType={editAccount.type}
            />
            {editAccount.type === "local" && (
              <input
                type="text"
                value={editAccount.host}
                onChange={(e) =>
                  setEditAccount({ ...editAccount, host: e.target.value })
                }
                placeholder="Host"
                className="border p-2 mb-4 w-full text-black"
              />
            )}
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
              type="text"
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
            <div className="mb-4">
              <h3 className="text-lg mb-2">Tags</h3>
              <div className="flex flex-wrap mb-2">
                {editAccount.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-blue-200 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded cursor-pointer"
                    onClick={() => handleRemoveEditTag(tag)}
                  >
                    {tag} &times;
                  </span>
                ))}
                {isEditTagInputVisible ? (
                  <input
                    type="text"
                    value={editTag}
                    onChange={(e) => setEditTag(e.target.value)}
                    onKeyDown={(e) => handleTagInputKeyDown(e, "edit")}
                    placeholder="New tag"
                    className="bg-blue-200 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded"
                    autoFocus
                  />
                ) : (
                  <button
                    onClick={() => setIsEditTagInputVisible(true)}
                    className="bg-gray-200 text-gray-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded"
                  >
                    + Add Tag
                  </button>
                )}
              </div>
            </div>
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
