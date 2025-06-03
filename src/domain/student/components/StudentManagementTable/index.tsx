import { useMemo, useState } from "react";
import styles from "./StudentManagementTable.module.css";
import { Button } from "../../../../shared/components/Button";
import { Alert } from "../../../../shared/components/Alert";
import { useStudentsContext } from "../../../../hooks/useStudentsContext";
import { StudentFormModal } from "../StudentFormModal";
import { SchedulingFormModal } from "../../../scheduling/components/SchedulingFormModal";
import { useToastContext } from "../../../../hooks/useToastContext";

export const StudentManagementTable = () => {
  const { students, reFetch } = useStudentsContext();
  const toast = useToastContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [studentIdToDelete, setStudentIdToDelete] = useState<string | null>();
  const [studentIdToEdit, setStudentIdToEdit] = useState<string | null>();
  const [schedulingIdToCreate, setStudentIdToCreate] = useState<
    string | null
  >();
  const handleDeleteStudent = (id: string) => {
    fetch(`${import.meta.env.VITE_API_URL}/students/delete/${id}`, {
      method: "DELETE",
    })
      .then(async (data) => {
        const response = await data.json();
        if (response.status !== 200) {
          toast.error(
            `Message: ${response.message}`,
            "Erro ao excluir estudante"
          );
          setStudentIdToDelete(null);
          return;
        }
        toast.success(response.message, "Estudante excluído com sucesso");
        setStudentIdToDelete(null);
        reFetch();
      })
      .catch((error) => {
        console.error("Erro ao excluir estudante:", error);
        alert("Erro ao excluir estudante");
        setStudentIdToDelete(null);
      });
  };
  const filteredStudents = useMemo(() => {
    const lowerSearch = searchTerm.toLowerCase();
    return students.filter((student) => {
      return (
        student.firstName.toLowerCase().includes(lowerSearch) ||
        student.lastName.toLowerCase().includes(lowerSearch) ||
        student.phone.toLowerCase().includes(lowerSearch) ||
        student.whatsapp.toLowerCase().includes(lowerSearch)
      );
    });
  }, [students, searchTerm]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };
  return (
    <div className={styles.container}>
      <input
        type="search"
        aria-label="Pesquisar estudantes"
        onChange={handleSearch}
      />

      <table className={styles.studentTable}>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Whastsapp</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.map((student) => (
            <tr key={student.id}>
              <td>{`${student.firstName} ${student.lastName}`}</td>
              <td>
                <a
                  href={`https://wa.me/${student.whatsapp.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`"Conversar no WhatsApp com ${student.firstName}"`}
                >
                  {student.phone}
                </a>
              </td>
              <td className={styles.actions}>
                <Button
                  className={styles.pageButton}
                  onClick={() => setStudentIdToEdit(student.id)}
                >
                  Editar
                </Button>
                <Button
                  onClick={() => setStudentIdToDelete(student.id)}
                  className={styles.pageButton}
                >
                  Excluir
                </Button>
                <Button
                  className={styles.pageButton}
                  onClick={() => setStudentIdToCreate(student.id)}
                >
                  Agendar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {studentIdToDelete && (
        <Alert
          action={() => handleDeleteStudent(studentIdToDelete)}
          isOpen={!!studentIdToDelete}
          message={`Deseja realmente deletar ${
            students.find((s) => s.id === studentIdToDelete)?.firstName
          } do sistema?`}
          onClose={() => setStudentIdToDelete(null)}
          title="Excluir estudante"
        />
      )}
      {studentIdToEdit && (
        <StudentFormModal
          onClose={() => setStudentIdToEdit(null)}
          title="Editar estudante"
          isOpen={!!studentIdToEdit}
          type="edit"
          studentId={studentIdToEdit}
        />
      )}
      {schedulingIdToCreate && (
        <SchedulingFormModal
          onClose={() => setStudentIdToCreate(null)}
          title="Criar Agendamento"
          isOpen={!!schedulingIdToCreate}
          type="create"
        />
      )}
      {!filteredStudents.length && <div>Nenhum estudante encontrado</div>}
    </div>
  );
};
