"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import useLocalStorage from "@/hooks/useLocalStorage";

interface Account {
  username: string;
  password: string;
}

interface Domain {
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
