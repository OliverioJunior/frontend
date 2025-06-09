import { createContext } from "react";
import type { IScheduling } from "../hooks/useScheduling";

export interface ISchedulingContextValue {
  scheduling: IScheduling[];
  reFetch: () => void;
  loading: boolean;
  error: string | null;
}

export const DEFAULT_VALUE: ISchedulingContextValue = {
  scheduling: [],
  reFetch: () => {},
  loading: false,
  error: null,
};

export const SchedulingContext =
  createContext<ISchedulingContextValue>(DEFAULT_VALUE);
