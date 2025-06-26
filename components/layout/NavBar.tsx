"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  FaServer,
  FaDownload,
  FaExchangeAlt,
  FaGithub,
  FaTrash,
} from "react-icons/fa";
import { useAppState, useDomainActions } from "@/context/StoreContext";
import { exportDomainToJson, exportUsernames } from "@/utils/exportUtils";
import { toast } from "react-toastify";
import Modal from "../common/Modal";

interface NavBarProps {
  openDomainModal: () => void;
}

const NavBar: React.FC<NavBarProps> = ({ openDomainModal }) => {
  const { selectedDomain } = useAppState();
  const { selectDomain, deleteDomain } = useDomainActions();
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const exportMenuRef = useRef<HTMLDivElement>(null);

  // Close export menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        exportMenuRef.current &&
        !exportMenuRef.current.contains(event.target as Node)
      ) {
        setShowExportMenu(false);
      }
    };

    if (showExportMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showExportMenu]);

  const handleExportDomain = () => {
    if (!selectedDomain) return;

    try {
      exportDomainToJson(selectedDomain);
      toast.success("Domain exported successfully!");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export domain");
    }

    setShowExportMenu(false);
  };

  const handleExportUsernames = () => {
    if (!selectedDomain) return;

    try {
      exportUsernames(selectedDomain);
      toast.success("Usernames exported successfully!");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export usernames");
    }

    setShowExportMenu(false);
  };

  const handleDeleteDomain = () => {
    if (!selectedDomain) return;

    // Close the modal
    setShowDeleteModal(false);

    // Delete the domain
    deleteDomain(selectedDomain.name);

    // Set selected domain to null
    selectDomain(null);

    // Show success message
    toast.success(`Domain "${selectedDomain.name}" deleted successfully!`);
  };

  return (
    <nav className="bg-gray-800 text-white py-3 px-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo/App Name and GitHub Link */}
        <div className="flex items-center">
          <h1 className="text-xl font-bold tracking-tight mr-4">nPassword</h1>
          <a
            href="https://github.com/Vincent550102/nPassword"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-gray-300 hover:text-white transition-colors"
            title="Open Source on GitHub"
          >
            <FaGithub size={18} className="mr-1" />
            <span className="text-sm hidden sm:inline">Open Source</span>
          </a>
        </div>

        {/* Domain Info and Actions */}
        {selectedDomain ? (
          <div className="flex items-center">
            {/* Current Domain Display */}
            <div className="flex items-center mr-6 bg-gray-700 px-3 py-1.5 rounded">
              <FaServer className="mr-2 text-gray-300" />
              <span className="font-medium">{selectedDomain.name}</span>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-3">
              {/* Export Menu */}
              <div className="relative" ref={exportMenuRef}>
                <button
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  className="flex items-center bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded transition-colors"
                  aria-expanded={showExportMenu}
                  aria-haspopup="true"
                >
                  <FaDownload className="mr-2" />
                  <span className="hidden sm:inline">Export</span>
                </button>

                {showExportMenu && (
                  <div
                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10"
                    role="menu"
                    aria-orientation="vertical"
                  >
                    <button
                      onClick={handleExportDomain}
                      className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                      role="menuitem"
                    >
                      Export Domain Data
                    </button>
                    <button
                      onClick={handleExportUsernames}
                      className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                      role="menuitem"
                    >
                      Export Usernames Only
                    </button>
                    <div className="border-t border-gray-200 my-1"></div>
                    <button
                      onClick={() => {
                        setShowExportMenu(false);
                        setShowDeleteModal(true);
                      }}
                      className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                      role="menuitem"
                    >
                      Delete Domain
                    </button>
                  </div>
                )}
              </div>

              {/* Switch Domain Button */}
              <button
                onClick={openDomainModal}
                className="flex items-center bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded transition-colors"
                title="Switch Domain"
              >
                <FaExchangeAlt className="mr-2" />
                <span className="hidden sm:inline">Switch</span>
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={openDomainModal}
            className="flex items-center bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded transition-colors"
          >
            <FaServer className="mr-2" />
            <span>Select Domain</span>
          </button>
        )}
      </div>

      {/* Delete Domain Confirmation Modal */}
      {showDeleteModal && selectedDomain && (
        <Modal onCloseAction={() => setShowDeleteModal(false)}>
          <div className="p-5">
            <div className="flex items-center text-red-600 mb-4">
              <FaTrash size={22} className="mr-3" />
              <h2 className="text-xl font-semibold">Delete Domain</h2>
            </div>

            <p className="mb-4">
              Are you sure you want to delete the domain{" "}
              <strong>{selectedDomain.name}</strong>?
            </p>

            <p className="mb-6 text-gray-600 text-sm bg-yellow-50 p-3 rounded border border-yellow-200">
              This action cannot be undone. All accounts and credentials in this
              domain will be permanently removed.
            </p>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteDomain}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white"
              >
                Delete Domain
              </button>
            </div>
          </div>
        </Modal>
      )}
    </nav>
  );
};

export default NavBar;
