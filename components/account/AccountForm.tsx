"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Account } from "@/types";
import Input from "@/components/ui/Input";
import { calculateNTHash } from "@/utils/hashUtils";

// AccountTypeToggle component
interface AccountTypeToggleProps {
  onChange: (accountType: "local" | "domain") => void;
  initialType: "local" | "domain";
}

const AccountTypeToggle: React.FC<AccountTypeToggleProps> = ({
  onChange,
  initialType = "domain",
}) => {
  const [selected, setSelected] = useState<"local" | "domain">(initialType);

  const handleToggle = (accountType: "local" | "domain") => {
    setSelected(accountType);
    onChange(accountType);
  };

  useEffect(() => {
    if (initialType !== selected) {
      onChange(initialType);
    }
  }, [initialType, onChange, selected]);

  return (
    <div className="flex justify-center my-4">
      <button
        className={`px-4 py-2 rounded-r ${
          selected === "domain" ? "bg-blue-500 text-white" : "bg-gray-200"
        }`}
        onClick={() => handleToggle("domain")}
      >
        Domain Account
      </button>
      <button
        className={`px-4 py-2 rounded-l ${
          selected === "local" ? "bg-blue-500 text-white" : "bg-gray-200"
        }`}
        onClick={() => handleToggle("local")}
      >
        Local Account
      </button>
    </div>
  );
};

// Form data interface that matches the required form fields
interface AccountFormData {
  username: string;
  password: string;
  ntlmHash: string;
  tags: string[];
  type: "local" | "domain";
  host: string;
}

interface AccountFormProps {
  initialData: AccountFormData;
  onSubmit: (account: Account) => void;
  onCancel: () => void;
  submitLabel: string;
  error?: string;
}

const AccountForm: React.FC<AccountFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  submitLabel,
  error,
}) => {
  const [formData, setFormData] = useState<AccountFormData>(initialData);
  const [newTag, setNewTag] = useState("");
  const [isTagInputVisible, setIsTagInputVisible] = useState(false);
  const [autoNTHash, setAutoNTHash] = useState(initialData.ntlmHash === "");
  const formRef = useRef<HTMLDivElement>(null);
  const tagInputRef = useRef<HTMLInputElement>(null);

  // Auto-generate NT hash when password changes
  useEffect(() => {
    if (autoNTHash && formData.password) {
      const ntHash = calculateNTHash(formData.password);
      setFormData((prev) => ({
        ...prev,
        ntlmHash: ntHash,
      }));
    }
  }, [formData.password, autoNTHash]);

  // Define handleSubmit using useCallback to avoid unnecessary re-renders
  const handleSubmit = useCallback(() => {
    if (
      formData.username.trim() === "" ||
      (formData.password.trim() === "" && formData.ntlmHash.trim() === "")
    )
      return;

    // Convert from form data to Account
    const account: Account = {
      username: formData.username,
      type: formData.type,
      // Only include non-empty values
      ...(formData.password ? { password: formData.password } : {}),
      ...(formData.ntlmHash ? { ntlmHash: formData.ntlmHash } : {}),
      ...(formData.tags.length > 0 ? { tags: formData.tags } : {}),
      ...(formData.host ? { host: formData.host } : {}),
    };

    onSubmit(account);
  }, [formData, onSubmit]);

  // Add Enter key handler for form submission
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle Enter key
      if (e.key !== "Enter") return;

      // Skip if Enter is pressed in the tag input (which has its own Enter handler)
      if (isTagInputVisible && document.activeElement === tagInputRef.current) {
        return;
      }

      // Skip if Enter is pressed in a textarea or button
      if (
        document.activeElement instanceof HTMLTextAreaElement ||
        document.activeElement instanceof HTMLButtonElement
      ) {
        return;
      }

      // If we're in any form field, submit the form
      if (formRef.current?.contains(document.activeElement)) {
        e.preventDefault();
        handleSubmit();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isTagInputVisible, handleSubmit]); // Added handleSubmit to the dependency array

  const handleChange = (field: keyof AccountFormData, value: string) => {
    // If manually editing the NT hash, disable auto-generation
    if (field === "ntlmHash" && autoNTHash) {
      setAutoNTHash(false);
    }

    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleAddTag = () => {
    if (newTag.trim() === "") return;
    setFormData({
      ...formData,
      tags: [...formData.tags, newTag],
    });
    setNewTag("");
    setIsTagInputVisible(false);
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission
      handleAddTag();
    }
  };

  const toggleAutoNTHash = () => {
    setAutoNTHash(!autoNTHash);

    // If turning auto-hash on, immediately calculate hash from current password
    if (!autoNTHash && formData.password) {
      const ntHash = calculateNTHash(formData.password);
      setFormData((prev) => ({
        ...prev,
        ntlmHash: ntHash,
      }));
    }
  };

  return (
    <div className="space-y-4" ref={formRef}>
      <AccountTypeToggle
        onChange={(type: "local" | "domain") => handleChange("type", type)}
        initialType={formData.type}
      />

      {formData.type === "local" && (
        <Input
          type="text"
          value={formData.host}
          onChange={(e) => handleChange("host", e.target.value)}
          placeholder="Host"
          className="border p-2 mb-4 w-full text-black"
        />
      )}

      <Input
        type="text"
        value={formData.username}
        onChange={(e) => handleChange("username", e.target.value)}
        placeholder="Username"
        className="border p-2 mb-4 w-full text-black"
      />

      <Input
        type="text"
        value={formData.password}
        onChange={(e) => handleChange("password", e.target.value)}
        placeholder="Password"
        className="border p-2 mb-4 w-full text-black"
      />

      <div className="relative">
        <Input
          type="text"
          value={formData.ntlmHash}
          onChange={(e) => handleChange("ntlmHash", e.target.value)}
          placeholder="NTLM Hash"
          className={`border p-2 mb-4 w-full text-black ${autoNTHash ? "bg-gray-100" : ""}`}
          disabled={autoNTHash}
        />
        <div className="flex items-center mt-1 mb-4">
          <input
            type="checkbox"
            id="autoNTHash"
            checked={autoNTHash}
            onChange={toggleAutoNTHash}
            className="mr-2"
          />
          <label htmlFor="autoNTHash" className="text-sm text-gray-600">
            Auto-generate NT hash from password
          </label>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-lg mb-2">Tags</h3>
        <div className="flex flex-wrap mb-2">
          {formData.tags.map((tag) => (
            <span
              key={tag}
              className="bg-blue-200 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded cursor-pointer"
              onClick={() => handleRemoveTag(tag)}
            >
              {tag} &times;
            </span>
          ))}
          {isTagInputVisible ? (
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={handleTagInputKeyDown}
              placeholder="New tag"
              className="bg-blue-200 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded"
              autoFocus
              ref={tagInputRef}
            />
          ) : (
            <button
              onClick={() => setIsTagInputVisible(true)}
              className="bg-gray-200 text-gray-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded"
              type="button"
            >
              + Add Tag
            </button>
          )}
        </div>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="flex justify-end space-x-2">
        <button
          onClick={onCancel}
          className="bg-gray-500 text-white p-2 mr-2"
          type="button"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white p-2 w-32"
          type="button"
        >
          {submitLabel}
        </button>
      </div>
    </div>
  );
};

export default AccountForm;
