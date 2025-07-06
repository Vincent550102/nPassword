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
    return value.replace(/'/g, `'"'"'`);
  }, []);

  // Helper: replace all placeholders (e.g. {username}) in one pass using a callback.
  const replacePlaceholders = (
    template: string,
    map: Record<string, string>,
  ): string => {
    return template.replace(/\{(\w+)\}/g, (_match, key) => {
      return key in map ? map[key] : _match; 
    });
  };

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

        const replacements: Record<string, string> = {
          username: sanitizeValue(selectedAccount.username),
          domain: sanitizeValue(selectedDomain.name),
        };

        if (targetHost) {
          replacements["targetHost"] = sanitizeValue(targetHost);
        }

        if (hasPassword && selectedAccount.password) {
          replacements["password"] = sanitizeValue(selectedAccount.password);
        } else if (hasNtlmHash && selectedAccount.ntlmHash) {
          replacements["ntlmHash"] = sanitizeValue(selectedAccount.ntlmHash);
        }

        const commandText = replacePlaceholders(command.template, replacements);

        return { command, commandText };
      })
      .filter((item): item is CommandWithText => item !== null);
  }, [selectedAccount, selectedDomain, targetHost, searchTerm, sanitizeValue]);

  return {
    getFilteredCommands,
    copyToClipboard,
  };
};
