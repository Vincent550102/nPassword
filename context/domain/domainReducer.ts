"use client";
import { Domain, Account, DomainData } from "@/types";

// Action Types
export enum DomainActionType {
  ADD_DOMAIN = "ADD_DOMAIN",
  DELETE_DOMAIN = "DELETE_DOMAIN",
  SELECT_DOMAIN = "SELECT_DOMAIN",
  ADD_ACCOUNT = "ADD_ACCOUNT",
  DELETE_ACCOUNT = "DELETE_ACCOUNT",
  UPDATE_ACCOUNT = "UPDATE_ACCOUNT",
  ADD_TAG_TO_ACCOUNT = "ADD_TAG_TO_ACCOUNT",
  REMOVE_TAG_FROM_ACCOUNT = "REMOVE_TAG_FROM_ACCOUNT",
  LOAD_DOMAIN_DATA = "LOAD_DOMAIN_DATA",
  RESET = "RESET"
}

// Action Interfaces
export type DomainAction =
  | { type: DomainActionType.ADD_DOMAIN; payload: Domain }
  | { type: DomainActionType.DELETE_DOMAIN; payload: string } // domain name
  | { type: DomainActionType.SELECT_DOMAIN; payload: Domain | null }
  | { type: DomainActionType.ADD_ACCOUNT; payload: { account: Account } }
  | { type: DomainActionType.DELETE_ACCOUNT; payload: { username: string } }
  | {
      type: DomainActionType.UPDATE_ACCOUNT;
      payload: { username: string; updatedAccount: Account }
    }
  | {
      type: DomainActionType.ADD_TAG_TO_ACCOUNT;
      payload: { username: string; tag: string }
    }
  | {
      type: DomainActionType.REMOVE_TAG_FROM_ACCOUNT;
      payload: { username: string; tag: string }
    }
  | { type: DomainActionType.LOAD_DOMAIN_DATA; payload: Domain }
  | { type: DomainActionType.RESET; payload?: DomainData };

// State Interface
export interface DomainState {
  data: DomainData;
  selectedDomain: Domain | null;
}

// Initial State
export const initialDomainState: DomainState = {
  data: { domains: [] },
  selectedDomain: null
};

// Helper function to update an account in a domain
const updateAccountInDomain = (
  domain: Domain,
  username: string,
  updater: (account: Account) => Account
): Domain => {
  return {
    ...domain,
    accounts: domain.accounts.map((account) =>
      account.username === username ? updater(account) : account
    )
  };
};

// Domain Reducer
export const domainReducer = (
  state: DomainState = initialDomainState,
  action: DomainAction
): DomainState => {
  switch (action.type) {
    case DomainActionType.ADD_DOMAIN:
      return {
        ...state,
        data: {
          domains: [...state.data.domains, action.payload]
        }
      };

    case DomainActionType.DELETE_DOMAIN:
      return {
        ...state,
        data: {
          domains: state.data.domains.filter(
            (domain) => domain.name !== action.payload
          )
        },
        selectedDomain: state.selectedDomain?.name === action.payload
          ? null
          : state.selectedDomain
      };

    case DomainActionType.SELECT_DOMAIN:
      return {
        ...state,
        selectedDomain: action.payload
      };

    case DomainActionType.ADD_ACCOUNT:
      if (!state.selectedDomain) return state;

      const updatedDomainsWithNewAccount = state.data.domains.map((domain) =>
        domain.name === state.selectedDomain!.name
          ? {
              ...domain,
              accounts: [...domain.accounts, action.payload.account]
            }
          : domain
      );

      return {
        ...state,
        data: {
          domains: updatedDomainsWithNewAccount
        },
        selectedDomain: {
          ...state.selectedDomain,
          accounts: [...state.selectedDomain.accounts, action.payload.account]
        }
      };

    case DomainActionType.DELETE_ACCOUNT:
      if (!state.selectedDomain) return state;

      const updatedDomainsAfterDelete = state.data.domains.map((domain) =>
        domain.name === state.selectedDomain!.name
          ? {
              ...domain,
              accounts: domain.accounts.filter(
                (account) => account.username !== action.payload.username
              )
            }
          : domain
      );

      return {
        ...state,
        data: {
          domains: updatedDomainsAfterDelete
        },
        selectedDomain: {
          ...state.selectedDomain,
          accounts: state.selectedDomain.accounts.filter(
            (account) => account.username !== action.payload.username
          )
        }
      };

    case DomainActionType.UPDATE_ACCOUNT:
      if (!state.selectedDomain) return state;

      const { username, updatedAccount } = action.payload;

      const updatedDomainsAfterUpdate = state.data.domains.map((domain) =>
        domain.name === state.selectedDomain!.name
          ? updateAccountInDomain(domain, username, () => updatedAccount)
          : domain
      );

      return {
        ...state,
        data: {
          domains: updatedDomainsAfterUpdate
        },
        selectedDomain: updateAccountInDomain(
          state.selectedDomain,
          username,
          () => updatedAccount
        )
      };

    case DomainActionType.ADD_TAG_TO_ACCOUNT:
      if (!state.selectedDomain) return state;

      const { username: addTagUsername, tag: addTag } = action.payload;

      const updatedDomainsAfterAddTag = state.data.domains.map((domain) =>
        domain.name === state.selectedDomain!.name
          ? updateAccountInDomain(domain, addTagUsername, (account) => ({
              ...account,
              tags: account.tags ? [...account.tags, addTag] : [addTag]
            }))
          : domain
      );

      return {
        ...state,
        data: {
          domains: updatedDomainsAfterAddTag
        },
        selectedDomain: updateAccountInDomain(
          state.selectedDomain,
          addTagUsername,
          (account) => ({
            ...account,
            tags: account.tags ? [...account.tags, addTag] : [addTag]
          })
        )
      };

    case DomainActionType.REMOVE_TAG_FROM_ACCOUNT:
      if (!state.selectedDomain) return state;

      const { username: removeTagUsername, tag: removeTag } = action.payload;

      const updatedDomainsAfterRemoveTag = state.data.domains.map((domain) =>
        domain.name === state.selectedDomain!.name
          ? updateAccountInDomain(domain, removeTagUsername, (account) => ({
              ...account,
              tags: account.tags?.filter((t) => t !== removeTag)
            }))
          : domain
      );

      return {
        ...state,
        data: {
          domains: updatedDomainsAfterRemoveTag
        },
        selectedDomain: updateAccountInDomain(
          state.selectedDomain,
          removeTagUsername,
          (account) => ({
            ...account,
            tags: account.tags?.filter((t) => t !== removeTag)
          })
        )
      };

    case DomainActionType.LOAD_DOMAIN_DATA:
      // Check if domain already exists
      const domainExists = state.data.domains.some(
        (domain) => domain.name === action.payload.name
      );

      if (domainExists) {
        return state; // Don't modify state if domain already exists
      }

      return {
        ...state,
        data: {
          domains: [...state.data.domains, action.payload]
        },
        selectedDomain: action.payload
      };

    case DomainActionType.RESET:
      return {
        ...initialDomainState,
        data: action.payload || initialDomainState.data
      };

    default:
      return state;
  }
};
