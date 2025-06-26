"use client";
import { useEffect, useState, useRef } from "react";
import { useAppState, useDomainActions } from "@/context/StoreContext";
import DomainSelectionModal from "../domain/DomainSelectionModal";
import DomainManagerContent from "../domain/DomainManagerContent";
import PageContainer from "../layout/PageContainer";
import { Domain } from "@/types";
import { parseDomainFile } from "@/utils/exportUtils";

/**
 * DomainInitializer component handles the initialization of domains
 * and manages the domain selection modal visibility
 */
const DomainInitializer: React.FC = () => {
  // Get domain state and actions from context
  const { domains, selectedDomain } = useAppState();
  const { selectDomain, addDomain, loadDomainData } = useDomainActions();

  // State for showing domain selection modal
  const [showDomainModal, setShowDomainModal] = useState(false);

  // Track if we've done the initial check
  const hasInitializedRef = useRef(false);

  // Handle initial domain selection modal visibility
  useEffect(() => {
    // Only run this check once
    if (hasInitializedRef.current) return;

    // Mark as initialized
    hasInitializedRef.current = true;

    // Show domain selection modal if domains exist but none is selected
    if (!selectedDomain && domains.length > 0) {
      setShowDomainModal(true);
    }
  }, [domains, selectedDomain]);

  // Handle domain selection
  const handleDomainSelection = (domain: Domain) => {
    selectDomain(domain);
    setShowDomainModal(false);
  };

  // Open domain modal manually
  const openDomainModal = () => {
    setShowDomainModal(true);
  };

  // Handle domain file import
  const handleLoadDomain = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const domain = await parseDomainFile(file);
      loadDomainData(domain);
      setShowDomainModal(false);
    } catch (error) {
      console.error("Error loading domain:", error);
      alert("Failed to load domain. The file format may be invalid.");
    }
  };

  return (
    <PageContainer openDomainModal={openDomainModal}>
      {showDomainModal && (
        <DomainSelectionModal
          domains={domains}
          onCloseAction={() => {
            // Only allow closing if a domain is selected or no domains exist
            if (selectedDomain || domains.length === 0) {
              setShowDomainModal(false);
            }
          }}
          onSelectDomain={handleDomainSelection}
          onAddDomain={(domain) => {
            addDomain(domain);
            handleDomainSelection(domain);
          }}
          onLoadDomain={handleLoadDomain}
        />
      )}

      <DomainManagerContent openDomainModal={openDomainModal} />
    </PageContainer>
  );
};

export default DomainInitializer;
