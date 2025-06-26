"use client";
import React from "react";
import DomainInitializer from "@/components/domain/DomainInitializer";

/**
 * DomainManager component serves as the main entry point for the password manager application.
 * It renders the DomainInitializer which handles domain selection and content rendering.
 */
const DomainManager: React.FC = () => {
  return <DomainInitializer />;
};

export default DomainManager;
