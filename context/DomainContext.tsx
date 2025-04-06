"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import useLocalStorage from "@/hooks/useLocalStorage";

export interface Account {
  username: string;
  password?: string;
  ntlmHash?: string;
  tags?: string[];
  type: "local" | "domain";
  host?: string;
}

export interface Domain {
  name: string;
  accounts: Account[];
}

interface Data {
  domains: Domain[];
}

const initialData: Data = { domains: [] };

interface DomainContextType {
  data: Data;
  selectedDomain: Domain | null;
  selectedAccount: Account | null;
  setSelectedDomain: (domain: Domain | null) => void;
  setSelectedAccount: (account: Account | null) => void;
  addDomain: (domain: Domain) => void;
  deleteDomain: (domainName: string) => void;
  addAccount: (account: Account) => void;
  deleteAccount: (username: string) => void;
  updateAccount: (username: string, updatedAccount: Account) => void;
  addTagToAccount: (username: string, tag: string) => void;
  removeTagFromAccount: (username: string, tag: string) => void;
  exportDomainData: (domainName: string) => void;
  exportUsernames: (domainName: string) => void;
  loadDomainData: (newDomain: Domain) => void;
}

const DomainContext = createContext<DomainContextType | undefined>(undefined);

export const DomainProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [data, setData] = useLocalStorage<Data>(
    "passwordManagerData",
    initialData,
  );
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [isClient, setIsClient] = useState(false);

  // This effect runs once when the component mounts on the client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // This effect loads the selected domain from localStorage on the client
  useEffect(() => {
    // Only run on the client after initial render
    if (!isClient) return;

    try {
      const storedDomainName = localStorage.getItem("selectedDomain");
      if (storedDomainName) {
        const parsedName = JSON.parse(storedDomainName);
        const domain = data.domains.find((d) => d.name === parsedName);
        if (domain) {
          console.log("Setting initial domain from localStorage:", domain.name);
          setSelectedDomain(domain);
        }
      }
    } catch (e) {
      console.error("Error loading initial domain:", e);
    }
  }, [isClient, data.domains]);

  // Save selectedDomain to localStorage when it changes (client-side only)
  useEffect(() => {
    if (!isClient) return;

    if (selectedDomain) {
      localStorage.setItem(
        "selectedDomain",
        JSON.stringify(selectedDomain.name),
      );
    }
  }, [selectedDomain, isClient]);

  useEffect(() => {
    setSelectedAccount(null);
  }, [selectedDomain]);

  const addDomain = (newDomain: Domain) => {
    setData((prevData) => ({
      domains: [...prevData.domains, newDomain],
    }));
  };

  const deleteDomain = (domainName: string) => {
    setData((prevData) => ({
      domains: prevData.domains.filter((domain) => domain.name !== domainName),
    }));
    setSelectedDomain(null);

    // Only clear localStorage on the client
    if (isClient) {
      localStorage.removeItem("selectedDomain");
    }
  };

  const addAccount = (newAccount: Account) => {
    if (!selectedDomain) return;
    setData((prevData) => {
      const updatedDomains = prevData.domains.map((domain) =>
        domain.name === selectedDomain.name
          ? { ...domain, accounts: [...domain.accounts, newAccount] }
          : domain,
      );
      return { domains: updatedDomains };
    });
    setSelectedDomain((prevDomain) => {
      if (!prevDomain) return null;
      return {
        ...prevDomain,
        accounts: [...prevDomain.accounts, newAccount],
      };
    });
  };

  const deleteAccount = (username: string) => {
    if (!selectedDomain) return;
    setData((prevData) => ({
      domains: prevData.domains.map((domain) =>
        domain.name === selectedDomain.name
          ? {
              ...domain,
              accounts: domain.accounts.filter(
                (account) => account.username !== username,
              ),
            }
          : domain,
      ),
    }));
    setSelectedDomain((prevDomain) => {
      if (!prevDomain) return null;
      return {
        ...prevDomain,
        accounts: prevDomain.accounts.filter(
          (account) => account.username !== username,
        ),
      };
    });
    setSelectedAccount(null);
  };

  const updateAccount = (username: string, updatedAccount: Account) => {
    if (!selectedDomain) return;
    setData((prevData) => ({
      domains: prevData.domains.map((domain) =>
        domain.name === selectedDomain.name
          ? {
              ...domain,
              accounts: domain.accounts.map((account) =>
                account.username === username ? updatedAccount : account,
              ),
            }
          : domain,
      ),
    }));
    setSelectedDomain((prevDomain) => {
      if (!prevDomain) return null;
      return {
        ...prevDomain,
        accounts: prevDomain.accounts.map((account) =>
          account.username === username ? updatedAccount : account,
        ),
      };
    });
    setSelectedAccount(updatedAccount);
  };

  const addTagToAccount = (username: string, tag: string) => {
    if (!selectedDomain) return;
    setData((prevData) => ({
      domains: prevData.domains.map((domain) =>
        domain.name === selectedDomain.name
          ? {
              ...domain,
              accounts: domain.accounts.map((account) =>
                account.username === username
                  ? {
                      ...account,
                      tags: account.tags ? [...account.tags, tag] : [tag],
                    }
                  : account,
              ),
            }
          : domain,
      ),
    }));
  };

  const removeTagFromAccount = (username: string, tag: string) => {
    if (!selectedDomain) return;
    setData((prevData) => ({
      domains: prevData.domains.map((domain) =>
        domain.name === selectedDomain.name
          ? {
              ...domain,
              accounts: domain.accounts.map((account) =>
                account.username === username
                  ? {
                      ...account,
                      tags: account.tags?.filter((t) => t !== tag),
                    }
                  : account,
              ),
            }
          : domain,
      ),
    }));
  };

  const exportDomainData = (domainName: string) => {
    if (!isClient) return;

    const domain = data.domains.find((d) => d.name === domainName);
    if (domain) {
      const dataStr = JSON.stringify(domain, null, 2);
      const blob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${domainName}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const loadDomainData = (newDomain: Domain) => {
    const domainExists = data.domains.some(
      (domain) => domain.name === newDomain.name,
    );
    if (domainExists) {
      alert("Domain already exists.");
      return;
    }
    setData((prevData) => {
      const updatedData = {
        domains: [...prevData.domains, newDomain],
      };
      setSelectedDomain(newDomain);
      return updatedData;
    });
  };
  const exportUsernames = (domainName: string) => {
    if (!isClient) return;

    const domain = data.domains.find((d) => d.name === domainName);
    if (domain) {
      // Create a simple text file with one username per line
      const usernamesText = domain.accounts
        .map((account) => account.username)
        .join("\n");
      const blob = new Blob([usernamesText], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `users.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <DomainContext.Provider
      value={{
        data,
        selectedDomain,
        selectedAccount,
        setSelectedDomain,
        setSelectedAccount,
        addDomain,
        deleteDomain,
        addAccount,
        deleteAccount,
        updateAccount,
        exportDomainData,
        exportUsernames,
        loadDomainData,
        addTagToAccount,
        removeTagFromAccount,
      }}
    >
      {children}
    </DomainContext.Provider>
  );
};

export const useDomain = () => {
  const context = useContext(DomainContext);
  if (context === undefined) {
    throw new Error("useDomain must be used within a DomainProvider");
  }
  return context;
};
