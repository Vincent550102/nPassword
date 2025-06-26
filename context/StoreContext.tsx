"use client";
import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useRef,
} from "react";
import {
  domainReducer,
  initialDomainState,
  DomainState,
  DomainAction,
  DomainActionType,
} from "./domain/domainReducer";
import {
  accountReducer,
  initialAccountState,
  AccountState,
  AccountAction,
  AccountActionType,
} from "./account/accountReducer";
import { Account, Domain } from "@/types";

// Combined State
export interface StoreState {
  domain: DomainState;
  account: AccountState;
}

// Combined Action
export type StoreAction =
  | { type: "DOMAIN"; action: DomainAction }
  | { type: "ACCOUNT"; action: AccountAction };

// Initial combined state
const initialState: StoreState = {
  domain: initialDomainState,
  account: initialAccountState,
};

// Create Store Context
const StoreContext = createContext<
  | {
      state: StoreState;
      dispatch: React.Dispatch<StoreAction>;
    }
  | undefined
>(undefined);

// Type guard for SELECT_ACCOUNT action
function isSelectAccountAction(
  action: AccountAction,
): action is { type: AccountActionType.SELECT_ACCOUNT; payload: Account } {
  return action.type === AccountActionType.SELECT_ACCOUNT;
}

// Combined reducer
function storeReducer(state: StoreState, action: StoreAction): StoreState {
  // Handle domain actions
  if (action.type === "DOMAIN") {
    const newDomainState = domainReducer(state.domain, action.action);

    // If domain changed, clear account selection
    const domainChanged =
      newDomainState.selectedDomain?.name !== state.domain.selectedDomain?.name;

    return {
      domain: newDomainState,
      account: domainChanged ? initialAccountState : state.account,
    };
  }
  // Handle account actions
  else if (action.type === "ACCOUNT") {
    // For SELECT_ACCOUNT, verify account exists in current domain
    if (isSelectAccountAction(action.action)) {
      const username = action.action.payload.username;

      if (!state.domain.selectedDomain) {
        return state;
      }

      const accountExists = state.domain.selectedDomain.accounts.some(
        (account) => account.username === username,
      );

      if (!accountExists) {
        return state;
      }
    }

    return {
      ...state,
      account: accountReducer(state.account, action.action),
    };
  }

  return state;
}

// Provider Component
export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Track if we've initialized from localStorage
  const isInitialized = useRef(false);

  // Create reducer state
  const [state, dispatch] = useReducer(storeReducer, initialState);

  // Load data from localStorage on first render
  useEffect(() => {
    if (isInitialized.current) return;

    try {
      // Get stored data
      const storedData = localStorage.getItem("passwordManagerData");

      if (storedData) {
        const data = JSON.parse(storedData);

        // Initialize domains
        if (Array.isArray(data.domains) && data.domains.length > 0) {
          // Load domains into state
          dispatch({
            type: "DOMAIN",
            action: {
              type: DomainActionType.RESET,
              payload: { domains: data.domains },
            },
          });

          // Select domain if specified
          if (data.selectedDomain) {
            const domain = data.domains.find(
              (d: Domain) => d.name === data.selectedDomain,
            );
            if (domain) {
              dispatch({
                type: "DOMAIN",
                action: {
                  type: DomainActionType.SELECT_DOMAIN,
                  payload: domain,
                },
              });
            }
          }
        }
      }
    } catch (error) {
      console.error("Failed to load data from localStorage:", error);
    }

    isInitialized.current = true;
  }, []);

  // Save state to localStorage when it changes
  useEffect(() => {
    // Only save after initialization
    if (!isInitialized.current) return;

    try {
      const dataToStore = {
        domains: state.domain.data.domains,
        selectedDomain: state.domain.selectedDomain?.name,
      };

      localStorage.setItem("passwordManagerData", JSON.stringify(dataToStore));
    } catch (error) {
      console.error("Failed to save data to localStorage:", error);
    }
  }, [state.domain.data.domains, state.domain.selectedDomain]);

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
};

// Custom hook for accessing the store
export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
};

// Helper hooks for dispatching specific actions
export const useDomainActions = () => {
  const { dispatch } = useStore();

  return {
    addDomain: (domain: Domain) =>
      dispatch({
        type: "DOMAIN",
        action: { type: DomainActionType.ADD_DOMAIN, payload: domain },
      }),

    deleteDomain: (domainName: string) =>
      dispatch({
        type: "DOMAIN",
        action: { type: DomainActionType.DELETE_DOMAIN, payload: domainName },
      }),

    selectDomain: (domain: Domain | null) =>
      dispatch({
        type: "DOMAIN",
        action: { type: DomainActionType.SELECT_DOMAIN, payload: domain },
      }),

    addAccount: (account: Account) =>
      dispatch({
        type: "DOMAIN",
        action: { type: DomainActionType.ADD_ACCOUNT, payload: { account } },
      }),

    deleteAccount: (username: string) =>
      dispatch({
        type: "DOMAIN",
        action: {
          type: DomainActionType.DELETE_ACCOUNT,
          payload: { username },
        },
      }),

    updateAccount: (username: string, updatedAccount: Account) =>
      dispatch({
        type: "DOMAIN",
        action: {
          type: DomainActionType.UPDATE_ACCOUNT,
          payload: { username, updatedAccount },
        },
      }),

    addTagToAccount: (username: string, tag: string) =>
      dispatch({
        type: "DOMAIN",
        action: {
          type: DomainActionType.ADD_TAG_TO_ACCOUNT,
          payload: { username, tag },
        },
      }),

    removeTagFromAccount: (username: string, tag: string) =>
      dispatch({
        type: "DOMAIN",
        action: {
          type: DomainActionType.REMOVE_TAG_FROM_ACCOUNT,
          payload: { username, tag },
        },
      }),

    loadDomainData: (domain: Domain) =>
      dispatch({
        type: "DOMAIN",
        action: { type: DomainActionType.LOAD_DOMAIN_DATA, payload: domain },
      }),
  };
};

export const useAccountActions = () => {
  const { dispatch } = useStore();

  return {
    selectAccount: (account: Account) =>
      dispatch({
        type: "ACCOUNT",
        action: { type: AccountActionType.SELECT_ACCOUNT, payload: account },
      }),

    clearAccountSelection: () =>
      dispatch({
        type: "ACCOUNT",
        action: { type: AccountActionType.CLEAR_SELECTION },
      }),
  };
};

// Convenience hook that provides the current state
export const useAppState = () => {
  const { state } = useStore();
  return {
    domains: state.domain.data.domains,
    selectedDomain: state.domain.selectedDomain,
    selectedAccount: state.account.selectedAccount,
  };
};
