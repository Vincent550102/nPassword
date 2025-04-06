import React, { useState, useEffect } from "react";
import AccountTypeToggle from "@/components/AccountTypeToggle";
import { Account } from "@/types";
import Input from "@/components/ui/Input";
import { calculateNTHash } from "@/utils/hashUtils";

interface AccountFormProps {
  initialData: {
    username: string;
    password: string;
    ntlmHash: string;
    tags: string[];
    type: "local" | "domain";
    host: string;
  };
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
  const [formData, setFormData] = useState(initialData);
  const [newTag, setNewTag] = useState("");
  const [isTagInputVisible, setIsTagInputVisible] = useState(false);
  const [autoNTHash, setAutoNTHash] = useState(initialData.ntlmHash === "");

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

  const handleChange = (field: string, value: string) => {
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
      handleAddTag();
    }
  };

  const handleSubmit = () => {
    if (
      formData.username.trim() === "" ||
      (formData.password.trim() === "" && formData.ntlmHash.trim() === "")
    )
      return;

    onSubmit(formData as Account);
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
    <div className="space-y-4">
      <AccountTypeToggle
        onChange={(type) => handleChange("type", type)}
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

      <div className="flex justify-end space-x-2">
        <button onClick={onCancel} className="bg-gray-500 text-white p-2 mr-2">
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white p-2 w-32"
        >
          {submitLabel}
        </button>
      </div>
    </div>
  );
};

export default AccountForm;
