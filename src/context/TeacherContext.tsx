import { createContext } from "react";
import type { ITeacher } from "../hooks/useTeacher";

export interface TeacherContextValue {
  teachers: ITeacher[];
  reFetch: () => void;
}

export const DEFAULT_VALUE: TeacherContextValue = {
  teachers: [],
  reFetch: () => {},
};

export const TeacherContext = createContext<TeacherContextValue>(DEFAULT_VALUE);
