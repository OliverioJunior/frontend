import { useContext } from "react";
import { TeacherContext } from "../context/TeacherContext";

export const useTeacherContext = () => useContext(TeacherContext);
