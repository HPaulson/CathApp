import {
  createGetReState,
  createReState,
  createReStateDispatch,
  createReStateSelect,
} from "@raulpesilva/re-state";

export const dateInitialValue = new Date();

export const useDate = createReState<Date>("date", dateInitialValue);
export const useDateSelect = createReStateSelect<Date>("date");
export const dispatchDate = createReStateDispatch<Date>("date");
export const getDate = createGetReState<Date>("date");
export const resetUser = () => dispatchDate(dateInitialValue);
