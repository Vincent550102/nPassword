import { useCallback } from "react";
import { Account, Domain, Command } from "@/types";
import domainCommands from "@/config/commands.domain";
import localCommands from "@/config/commands.local";
import { toast } from "react-toastify";

interface UseCommandsProps {
  selectedAccount: Account | null;
  selectedDomain: Domain | null;
  targetHost: string;
  searchTerm: string;
}

interface CommandWithText {
  command: Command;
  commandText: string;
}

export const useCommands = ({
  selectedAccount,
  selectedDomain,
  targetHost,
  searchTerm,
}: UseCommandsProps) => {
  const copyToClipboard = useCallback((text: string) => {
    try {
      const unsecureCopyToClipboard = (text: string) => {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      };

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text);
      } else {
        unsecureCopyToClipboard(text);
      }

      toast.success("Copied to clipboard!", {
        position: "bottom-center",
        autoClose: 2000,
      });
    } catch (error) {
      console.error("Failed to copy: ", error);
      toast.error("Failed to copy to clipboard", {
        position: "bottom-center",
        autoClose: 2000,
      });
    }
  }, []);

  const sanitizeValue = useCallback((value: string): string => {
    return value.replace(/'/g, "\\'");
  }, []);

  const getFilteredCommands = useCallback((): CommandWithText[] => {
    if (!selectedAccount || !selectedDomain) return [];

    const applicableCommands: Command[] =
      selectedAccount.type === "local" ? localCommands : domainCommands;

    return applicableCommands
      .filter((command) =>
        command.template.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      .map((command) => {
        const hasPassword =
          command.authType === "password" && selectedAccount.password;
        const hasNtlmHash =
          command.authType === "ntlmHash" && selectedAccount.ntlmHash;

        if (!hasPassword && !hasNtlmHash) {
          return null;
        }

        let commandText = command.template;

        // Safely substitute values
        const username = sanitizeValue(selectedAccount.username);
        const domain = sanitizeValue(selectedDomain.name);
        const host = sanitizeValue(targetHost);

        commandText = commandText
          .replace(/\{username\}/g, username)
          .replace(/\{domain\}/g, domain)
          .replace(/\{targetHost\}/g, host);

        if (hasPassword && selectedAccount.password) {
          const password = sanitizeValue(selectedAccount.password);
          commandText = commandText.replace(/\{password\}/g, password);
        } else if (hasNtlmHash && selectedAccount.ntlmHash) {
          const ntlmHash = sanitizeValue(selectedAccount.ntlmHash);
          commandText = commandText.replace(/\{ntlmHash\}/g, ntlmHash);
        }

        return { command, commandText };
      })
      .filter((item): item is CommandWithText => item !== null);
  }, [selectedAccount, selectedDomain, targetHost, searchTerm, sanitizeValue]);

  return {
    getFilteredCommands,
    copyToClipboard,
  };
};
