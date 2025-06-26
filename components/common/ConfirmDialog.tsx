"use client";
import React, { useEffect, useCallback } from "react";
import Modal from "./Modal";

interface ConfirmDialogProps {
  title: string;
  message: React.ReactNode;
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  confirmButtonClass?: string;
  cancelButtonClass?: string;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  title,
  message,
  isOpen,
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmButtonClass = "bg-red-500 hover:bg-red-600",
  cancelButtonClass = "bg-gray-500 hover:bg-gray-600",
}) => {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (isOpen) {
        if (event.key === "Enter") {
          onConfirm();
        }
      }
    },
    [isOpen, onConfirm],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  if (!isOpen) return null;

  return (
    <Modal onCloseAction={onCancel}>
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <div className="mb-6">
          {typeof message === "string" ? <p>{message}</p> : message}
        </div>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className={`text-white px-4 py-2 rounded transition-colors ${cancelButtonClass}`}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`text-white px-4 py-2 rounded transition-colors ${confirmButtonClass}`}
            autoFocus
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
