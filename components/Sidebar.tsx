"use client";
import { useState } from "react";
import Modal from "@/components/Modal";
import { useDomain } from "@/context/DomainContext";
import Image from "next/image";
import { FaPlus } from "react-icons/fa";
import AccountForm from "@/components/AccountForm";
import { Account } from "@/types";

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
  const [accountToDelete, setAccountToDelete] = useState<string | null>(null);
  const [error, setError] = useState("");

  const handleAddAccount = (account: Account) => {
    if (
      selectedDomain &&
      selectedDomain.accounts.some((a) => a.username === account.username)
    ) {
      setError("Username already exists.");
      return;
    }

    addAccount(account);
    setIsModalOpen(false);
    setError("");
  };

  const handleUpdateAccount = (account: Account) => {
    updateAccount(selectedAccount!.username, account);
    setIsEditModalOpen(false);
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

  const getEmptyAccount = () => ({
    username: "",
    password: "",
    ntlmHash: "",
    tags: [] as string[],
    type: "domain" as "local" | "domain",
    host: "",
  });

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
                    setIsEditModalOpen(true);
                    setSelectedAccount(account);
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
            <AccountForm
              initialData={getEmptyAccount()}
              onSubmit={handleAddAccount}
              onCancel={() => setIsModalOpen(false)}
              submitLabel="Add Account"
              error={error}
            />
          </div>
        </Modal>
      )}

      {isEditModalOpen && selectedAccount && (
        <Modal onClose={() => setIsEditModalOpen(false)}>
          <div className="p-4">
            <h2 className="text-xl mb-4">Edit Account</h2>
            <AccountForm
              initialData={{
                username: selectedAccount.username,
                password: selectedAccount.password || "",
                ntlmHash: selectedAccount.ntlmHash || "",
                tags: selectedAccount.tags || [],
                type: selectedAccount.type,
                host: selectedAccount.host || "",
              }}
              onSubmit={handleUpdateAccount}
              onCancel={() => setIsEditModalOpen(false)}
              submitLabel="Update Account"
            />
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
