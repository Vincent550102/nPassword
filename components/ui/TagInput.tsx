import React, { useState } from "react";

interface TagInputProps {
  tags: string[];
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
}

const TagInput: React.FC<TagInputProps> = ({ tags, onAddTag, onRemoveTag }) => {
  const [newTag, setNewTag] = useState("");
  const [isInputVisible, setIsInputVisible] = useState(false);

  const handleAddTag = () => {
    if (newTag.trim() === "") return;
    onAddTag(newTag);
    setNewTag("");
    setIsInputVisible(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleAddTag();
    }
  };

  return (
    <div className="">
      <h3 className="text-lg mb-2">Tags</h3>
      <div className="flex flex-wrap">
        {tags.map((tag) => (
          <span
            key={tag}
            className="bg-blue-200 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded cursor-pointer "
            onClick={() => onRemoveTag(tag)}
          >
            {tag} &times;
          </span>
        ))}
        {isInputVisible ? (
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleAddTag}
            placeholder="New tag"
            className="bg-blue-200 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded"
            autoFocus
          />
        ) : (
          <button
            onClick={() => setIsInputVisible(true)}
            className="bg-gray-200 text-gray-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded "
          >
            + Add Tag
          </button>
        )}
      </div>
    </div>
  );
};

export default TagInput;
