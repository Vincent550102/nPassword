"use client";
import { Account } from "@/types";

// Action Types
export enum AccountActionType {
  SELECT_ACCOUNT = "SELECT_ACCOUNT",
  CLEAR_SELECTION = "CLEAR_SELECTION",
}

// Action Interfaces
export type AccountAction =
  | { type: AccountActionType.SELECT_ACCOUNT; payload: Account }
  | { type: AccountActionType.CLEAR_SELECTION };

// State Interface
export interface AccountState {
  selectedAccount: Account | null;
}

// Initial State
export const initialAccountState: AccountState = {
  selectedAccount: null,
};

// Account Reducer
export const accountReducer = (
  state: AccountState = initialAccountState,
  action: AccountAction,
): AccountState => {
  switch (action.type) {
    case AccountActionType.SELECT_ACCOUNT:
      return {
        ...state,
        selectedAccount: action.payload,
      };

    case AccountActionType.CLEAR_SELECTION:
      return {
        ...state,
        selectedAccount: null,
      };

    default:
      return state;
  }
};
