import React from "react";

export interface GlobalState {
  filters: {
    keywords: string;
  };
}

export interface GlobalStateDispatchAction<T = Record<string, any>> {
  type: string;
  payload: T;
}

export const initialGlobalState: GlobalState = {
  filters: {
    keywords: "",
  },
};

export function globalStateReducer(
  state: GlobalState,
  action: GlobalStateDispatchAction
) {
  switch (action.type) {
    case "search":
      state.filters.keywords = action.payload.keywords;
      return { ...state, filters: { ...state.filters } };

    case "reset-filters":
      return { ...state, filters: { ...initialGlobalState.filters } };

    default:
      return state;
  }
}

export const GlobalContext = React.createContext<{
  state: GlobalState;
  dispatch: Function;
}>({
  state: initialGlobalState,
  dispatch: () => {},
});
