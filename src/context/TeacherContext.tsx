import { createContext } from "react";
import type { ITeacher } from "../hooks/useTeacher";

export interface TeacherContextValue {
  teachers: ITeacher[];
  reFetch: () => void;
  loading: boolean;
  error: string | null;
}

export const DEFAULT_VALUE: TeacherContextValue = {
  teachers: [],
  reFetch: () => {},
  loading: false,
  error: null,
};

export const TeacherContext = createContext<TeacherContextValue>(DEFAULT_VALUE);
