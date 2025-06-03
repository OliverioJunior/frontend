import { useContext } from "react";
import { StudentsContext } from "../context/StudentsContext";

export const useStudentsContext = () => useContext(StudentsContext);
