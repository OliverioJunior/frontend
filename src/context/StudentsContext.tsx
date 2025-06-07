import { createContext } from "react";
import { type IStudent } from "../hooks/useStudents";

export interface StudentsContextValue {
  students: IStudent[];
  reFetch: () => void;
  loading: boolean;
  error: string | null;
}

export const DEFAULT_VALUE: StudentsContextValue = {
  students: [],
  reFetch: () => {},
  loading: false,
  error: null,
};

export const StudentsContext =
  createContext<StudentsContextValue>(DEFAULT_VALUE);
