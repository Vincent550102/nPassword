"use client";
import { Domain, Account } from "@/types";

/**
 * Exports a domain's data as a JSON file for download
 * @param domain The domain object to export
 */
export const exportDomainToJson = (domain: Domain): void => {
  if (!domain) return;

  try {
    const dataStr = JSON.stringify(domain, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${domain.name}.json`;
    a.click();
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error exporting domain data:", error);
    throw new Error("Failed to export domain data");
  }
};

/**
 * Exports just the usernames from a domain as a text file
 * @param domain The domain containing accounts to export usernames from
 */
export const exportUsernames = (domain: Domain): void => {
  if (!domain) return;

  try {
    // Create a simple text file with one username per line
    const usernamesText = domain.accounts
      .map((account) => account.username)
      .join("\n");

    const blob = new Blob([usernamesText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${domain.name}_users.txt`;
    a.click();
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error exporting usernames:", error);
    throw new Error("Failed to export usernames");
  }
};

/**
 * Parses domain data from a JSON file
 * @param file The File object to parse
 * @returns A Promise that resolves to the parsed Domain object
 */
export const parseDomainFile = (file: File): Promise<Domain> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const parsedData = JSON.parse(text);

        if (isValidDomain(parsedData)) {
          resolve(parsedData);
        } else {
          throw new Error("Invalid domain data format");
        }
      } catch (error) {
        console.error("Error parsing domain file:", error);
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };

    reader.readAsText(file);
  });
};

/**
 * Type guard to validate domain data format
 * @param data The data to validate
 * @returns boolean indicating if the data is a valid Domain
 */
export const isValidDomain = (data: unknown): data is Domain => {
  if (!data || typeof data !== "object") return false;

  // Use type assertion after basic check
  const domainData = data as Partial<Domain>;

  // Check for required properties
  if (typeof domainData.name !== "string") return false;
  if (!Array.isArray(domainData.accounts)) return false;

  // Validate each account
  return domainData.accounts.every((account): account is Account => {
    if (!account || typeof account !== "object") return false;

    // Use type assertion after basic check
    const acc = account as Partial<Account>;

    return (
      typeof acc.username === "string" &&
      (acc.type === "domain" || acc.type === "local")
    );
  });
};
