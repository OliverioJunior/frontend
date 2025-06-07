import { StudentsContext } from "./StudentsContext";
import { useStudents } from "../hooks/useStudents";

interface IStudentsProvider {
  children: React.ReactNode;
}

export const StudentsProvider: React.FC<IStudentsProvider> = ({ children }) => {
  const { students, reFetch, loading, error } = useStudents();

  const contextValues = {
    students,
    reFetch,
    loading,
    error,
  };
  return (
    <StudentsContext.Provider value={contextValues}>
      {children}
    </StudentsContext.Provider>
  );
};
