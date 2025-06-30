"use client";
import React, { useState, useEffect, useRef } from "react";
import { Account } from "@/types";
import {
  useAppState,
  useAccountActions,
  useDomainActions,
} from "@/context/StoreContext";
import Modal from "../common/Modal";
import AccountForm from "./AccountForm";
import {
  FaPlus,
  FaUser,
  FaDesktop,
  FaEdit,
  FaTrash,
  FaSearch,
} from "react-icons/fa";

interface AccountListProps {
  className?: string;
}

const AccountList: React.FC<AccountListProps> = ({ className = "" }) => {
  const { selectedDomain, selectedAccount } = useAppState();
  const { selectAccount } = useAccountActions();
  const { addAccount, deleteAccount, updateAccount } = useDomainActions();
  const listRef = useRef<HTMLDivElement>(null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState<string | null>(null);
  const [error, setError] = useState("");

  // Search functionality
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Create filteredAccounts here as a state variable so we can use it in useEffect safely
  const [filteredAccounts, setFilteredAccounts] = useState<Account[]>([]);

  // Update filteredAccounts when domain or search changes
  useEffect(() => {
    if (!selectedDomain) {
      setFilteredAccounts([]);
      return;
    }

    const filtered =
      searchTerm.trim() === ""
        ? selectedDomain.accounts
        : selectedDomain.accounts.filter(
            (account) =>
              account.username
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
              account.tags?.some((tag) =>
                tag.toLowerCase().includes(searchTerm.toLowerCase()),
              ),
          );

    setFilteredAccounts(filtered);
  }, [selectedDomain, searchTerm]);

  // Keyboard navigation functionality - now before the early return
  useEffect(() => {
    // Skip the entire effect if no domain is selected
    if (!selectedDomain) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if we're focused on an input, textarea, or button
      if (
        document.activeElement instanceof HTMLInputElement ||
        document.activeElement instanceof HTMLTextAreaElement ||
        document.activeElement instanceof HTMLButtonElement
      ) {
        return;
      }

      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        e.preventDefault();

        if (filteredAccounts.length === 0) return;

        const currentIndex = selectedAccount
          ? filteredAccounts.findIndex(
              (acc) => acc.username === selectedAccount.username,
            )
          : -1;

        let newIndex;
        if (e.key === "ArrowUp") {
          // Go to previous account or loop to the end
          newIndex =
            currentIndex <= 0 ? filteredAccounts.length - 1 : currentIndex - 1;
        } else {
          // Go to next account or loop to the beginning
          newIndex =
            currentIndex >= filteredAccounts.length - 1 ? 0 : currentIndex + 1;
        }

        selectAccount(filteredAccounts[newIndex]);

        // Scroll to the selected item if needed
        const accountElements = listRef.current?.querySelectorAll(
          "[data-account-item]",
        );
        if (accountElements && accountElements[newIndex]) {
          accountElements[newIndex].scrollIntoView({
            behavior: "smooth",
            block: "nearest",
          });
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [filteredAccounts, selectedAccount, selectAccount, selectedDomain]);

  // Early return if no domain is selected
  if (!selectedDomain) {
    return null;
  }

  const handleAddAccount = (account: Account) => {
    if (selectedDomain.accounts.some((a) => a.username === account.username)) {
      setError("Username already exists.");
      return;
    }

    addAccount(account);
    setIsModalOpen(false);
    setError("");
  };

  const handleUpdateAccount = (account: Account) => {
    if (selectedAccount) {
      updateAccount(selectedAccount.username, account);
      setIsEditModalOpen(false);
    }
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

  // Get empty account with all required fields
  const getEmptyAccount = (): {
    username: string;
    password: string;
    ntlmHash: string;
    tags: string[];
    type: "local" | "domain";
    host: string;
  } => ({
    username: "",
    password: "",
    ntlmHash: "",
    tags: [],
    type: "domain",
    host: "",
  });

  return (
    <div
      className={`bg-gray-50 h-full flex flex-col border-r border-gray-200 ${className}`}
      tabIndex={0} // Make the list focusable for keyboard navigation
    >
      {/* Header section */}
      <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between bg-white">
        <h2 className="font-semibold text-gray-800 text-lg">
          {selectedDomain.name}
        </h2>
        <button
          onClick={() => {
            setIsModalOpen(true);
            setError("");
          }}
          className="w-8 h-8 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-full flex items-center justify-center transition-colors duration-200"
          aria-label="Add new account"
          title="Add new account"
        >
          <FaPlus size={14} />
        </button>
      </div>

      {/* Search bar */}
      <div
        className={`px-3 py-2 bg-white border-b border-gray-200 transition-all duration-200 ${isSearchFocused ? "shadow-sm" : ""}`}
      >
        <div
          className={`flex items-center bg-gray-100 rounded-md px-3 py-1.5 ${isSearchFocused ? "ring-2 ring-blue-200 bg-white" : "hover:bg-gray-200"}`}
        >
          <FaSearch className="text-gray-400 mr-2" size={14} />
          <input
            type="text"
            placeholder="Search accounts..."
            className="bg-transparent border-none w-full text-sm outline-none placeholder-gray-400 text-gray-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
          />
        </div>
      </div>

      {/* Account list */}
      <div
        className="flex-1 overflow-y-auto overflow-x-hidden py-2 px-2"
        ref={listRef}
      >
        {filteredAccounts.length === 0 && (
          <div className="text-center py-10 px-4">
            {searchTerm ? (
              <div className="text-gray-500">
                <p className="mb-1 text-sm">No matching accounts found</p>
                <p className="text-xs">Try a different search term</p>
              </div>
            ) : (
              <div className="text-gray-500">
                <p className="mb-1 text-sm">No accounts yet</p>
                <p className="text-xs">
                  Click the + button to add your first account
                </p>
              </div>
            )}
          </div>
        )}

        {filteredAccounts.map((account) => {
          const isSelected = selectedAccount?.username === account.username;
          const isComputer = account.username.endsWith("$");

          return (
            <div
              key={account.username}
              data-account-item="true"
              onClick={() => selectAccount(account)}
              className={`
                mb-1.5 rounded-lg p-3
                cursor-pointer
                transition-all duration-150
                group
                hover:bg-gray-100
                ${isSelected ? "bg-blue-50 hover:bg-blue-50 shadow-sm" : "bg-white"}
              `}
            >
              <div className="flex items-start">
                {/* Account icon */}
                <div
                  className={`
                  flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center mr-3
                  ${isSelected ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-500"}
                `}
                >
                  {isComputer ? <FaDesktop size={16} /> : <FaUser size={16} />}
                </div>

                {/* Account details */}
                <div className="flex-1 min-w-0">
                  {/* Domain/host prefix */}
                  <div className="flex items-baseline mb-0.5">
                    <span className="text-xs text-gray-500 truncate max-w-[90%]">
                      {account.type === "local"
                        ? account.host
                          ? account.host + "\\"
                          : "local\\"
                        : selectedDomain.name + "\\"}
                    </span>
                  </div>

                  {/* Username */}
                  <div className="flex items-center justify-between">
                    <h3
                      className={`font-medium truncate max-w-[75%] ${isSelected ? "text-blue-700" : "text-gray-800"}`}
                    >
                      {account.username}
                    </h3>

                    {/* Action buttons */}
                    <div
                      className={`flex space-x-1 ${isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"} transition-opacity duration-150`}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          selectAccount(account);
                          setIsEditModalOpen(true);
                        }}
                        className="p-1 rounded hover:bg-gray-200 text-gray-500 hover:text-blue-600 transition-colors"
                        aria-label="Edit account"
                      >
                        <FaEdit size={14} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteAccount(account.username);
                        }}
                        className="p-1 rounded hover:bg-gray-200 text-gray-500 hover:text-red-600 transition-colors"
                        aria-label="Delete account"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Tags */}
                  {account.tags && account.tags.length > 0 && (
                    <div className="flex flex-wrap mt-1.5 gap-1.5">
                      {account.tags.map((tag) => (
                        <span
                          key={tag}
                          className={`text-xs px-2 py-0.5 rounded-full max-w-[120px] truncate ${
                            isSelected
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Domain info footer */}
      <div className="p-3 border-t border-gray-200 bg-white text-xs text-gray-500">
        <div className="flex justify-between items-center">
          <span>
            {filteredAccounts.length} account
            {filteredAccounts.length !== 1 ? "s" : ""}
          </span>
          {selectedDomain.accounts.length > 0 && searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="text-blue-600 hover:text-blue-800"
            >
              Clear search
            </button>
          )}
        </div>
      </div>

      {/* Add Account Modal */}
      {isModalOpen && (
        <Modal onCloseAction={() => setIsModalOpen(false)}>
          <div className="p-5">
            <h2 className="text-xl font-semibold mb-4">Add New Account</h2>
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

      {/* Edit Account Modal */}
      {isEditModalOpen && selectedAccount && (
        <Modal onCloseAction={() => setIsEditModalOpen(false)}>
          <div className="p-5">
            <h2 className="text-xl font-semibold mb-4">Edit Account</h2>
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

      {/* Delete Confirmation Modal */}
      {accountToDelete && (
        <Modal onCloseAction={() => setAccountToDelete(null)}>
          <div className="p-5">
            <h2 className="text-xl font-semibold mb-4">Confirm Delete</h2>
            <p className="mb-6">
              Are you sure you want to delete the account &quot;
              <span className="font-medium">{accountToDelete}</span>&quot;?
            </p>
            <div className="flex justify-end mt-4 space-x-3">
              <button
                onClick={() => setAccountToDelete(null)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteAccount}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AccountList;
