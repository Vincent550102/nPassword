"use client";
import { useState } from "react";
import DomainManager from "@/components/DomainManager";
import NavBar from "@/components/NavBar";

export default function Home() {
  const [selectedDomain, setSelectedDomain] = useState(null);

  return (
    <div>
      <NavBar
        onSelectDomain={setSelectedDomain}
        selectedDomain={selectedDomain}
      />
      <div className="min-h-screen p-8 pb-20 sm:p-20">
        <DomainManager
          selectedDomain={selectedDomain}
          onUpdateDomain={setSelectedDomain}
        />
      </div>
    </div>
  );
}
