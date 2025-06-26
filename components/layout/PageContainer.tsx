"use client";
import React from "react";
import NavBar from "@/components/layout/NavBar";

interface PageContainerProps {
  children: React.ReactNode;
  openDomainModal: () => void;
}

/**
 * PageContainer component provides the main layout structure for the application
 * It includes the NavBar and wraps content in a consistent container with proper footer positioning
 */
const PageContainer: React.FC<PageContainerProps> = ({
  children,
  openDomainModal,
}) => {
  // Removed the unused selectedDomain variable

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Fixed header */}
      <header className="sticky top-0 z-50">
        <NavBar openDomainModal={openDomainModal} />
      </header>

      {/* Main content that grows to fill available space */}
      <main className="flex-grow flex flex-col relative">
        <div className="container mx-auto px-4 py-6 flex-grow flex flex-col">
          {children}
        </div>
      </main>

      {/* Footer that stays at the bottom */}
      <footer className="bg-gray-800 text-white text-center py-4 text-sm mt-auto">
        <div className="container mx-auto">
          <p>
            nPassword - A lightweight password manager for Windows Active
            Directory
          </p>
          <p className="text-gray-400 text-xs mt-1">
            For research and educational purposes only
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PageContainer;
