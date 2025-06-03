import { createContext } from "react";
import type { IScheduling } from "../hooks/useScheduling";

export interface ISchedulingContextValue {
  scheduling: IScheduling[];
  reFetch: () => void;
}

export const DEFAULT_VALUE: ISchedulingContextValue = {
  scheduling: [],
  reFetch: () => {},
};

export const SchedulingContext =
  createContext<ISchedulingContextValue>(DEFAULT_VALUE);
