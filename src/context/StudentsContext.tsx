import { createContext } from "react";
import { type IStudent } from "../hooks/useStudents";

export interface StudentsContextValue {
  students: IStudent[];
  reFetch: () => void;
}

export const DEFAULT_VALUE: StudentsContextValue = {
  students: [],
  reFetch: () => {},
};

export const StudentsContext =
  createContext<StudentsContextValue>(DEFAULT_VALUE);
