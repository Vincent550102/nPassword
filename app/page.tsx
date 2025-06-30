"use client";
import { StoreProvider } from "@/context/StoreContext";
import DomainManager from "@/components/domain/DomainManager";

/**
 * Main application page
 * Wraps the entire application with the StoreProvider for state management
 */
export default function Home() {
  return (
    <StoreProvider>
      <DomainManager />
    </StoreProvider>
  );
}
