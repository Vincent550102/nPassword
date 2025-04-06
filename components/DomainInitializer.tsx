"use client";
import { useEffect, useState } from "react";
import { useDomain } from "@/context/DomainContext";
import DomainSelectionModal from "@/components/DomainSelectionModal";
import DomainManagerContent from "@/components/DomainManagerContent";
import { Domain } from "@/types";

const DomainInitializer: React.FC = () => {
  const { data, selectedDomain, setSelectedDomain, addDomain, loadDomainData } =
    useDomain();

  const [showDomainModal, setShowDomainModal] = useState(false);

  useEffect(() => {
    if (!selectedDomain && data.domains.length > 0) {
      setShowDomainModal(true);
    } else {
      setShowDomainModal(false);
    }
  }, [selectedDomain, data.domains]);

  const handleDomainSelection = (domain: Domain) => {
    setSelectedDomain(domain);
    setShowDomainModal(false);
  };

  const handleLoadDomain = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const domain = JSON.parse(text);
        loadDomainData(domain);
        setShowDomainModal(false);
      } catch (error) {
        console.error("Error loading domain:", error);
      }
    };
    reader.readAsText(file);
  };

  return (
    <>
      {showDomainModal && (
        <DomainSelectionModal
          domains={data.domains}
          onClose={() => {
            if (selectedDomain || data.domains.length === 0) {
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

      <DomainManagerContent openDomainModal={() => setShowDomainModal(true)} />
    </>
  );
};

export default DomainInitializer;
