import { useTeachers } from "../hooks/useTeacher";
import { TeacherContext } from "./TeacherContext";

interface ITeacherProvider {
  children: React.ReactNode;
}

export const TeacherProvider: React.FC<ITeacherProvider> = ({ children }) => {
  const { teachers, reFetch } = useTeachers();

  const contextValues = {
    teachers,
    reFetch,
  };
  return (
    <TeacherContext.Provider value={contextValues}>
      {children}
    </TeacherContext.Provider>
  );
};
