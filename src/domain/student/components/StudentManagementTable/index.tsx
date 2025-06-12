import { Suspense, useMemo, useState, useCallback } from "react";
import styles from "./StudentManagementTable.module.css";
import { Button } from "../../../../shared/components/Button";
import { Alert } from "../../../../shared/components/Alert";
import { useStudentsContext } from "../../../../hooks/useStudentsContext";
import { StudentFormModal } from "../StudentFormModal";
import { SchedulingFormModal } from "../../../scheduling/components/SchedulingFormModal";
import { useToastContext } from "../../../../hooks/useToastContext";
import type { IStudent } from "../../../../hooks/useStudents";

interface ModalState {
  deleteId: string | null;
  editId: string | null;
  scheduleId: string | null;
}

// Hook customizado para gerenciar o estado dos modais
const useModalState = () => {
  const [modalState, setModalState] = useState<ModalState>({
    deleteId: null,
    editId: null,
    scheduleId: null,
  });

  const openDeleteModal = useCallback((id: string) => {
    setModalState((prev) => ({ ...prev, deleteId: id }));
  }, []);

  const openEditModal = useCallback((id: string) => {
    setModalState((prev) => ({ ...prev, editId: id }));
  }, []);

  const openScheduleModal = useCallback((id: string) => {
    setModalState((prev) => ({ ...prev, scheduleId: id }));
  }, []);

  const closeModals = useCallback(() => {
    setModalState({ deleteId: null, editId: null, scheduleId: null });
  }, []);

  return {
    modalState,
    openDeleteModal,
    openEditModal,
    openScheduleModal,
    closeModals,
  };
};

// Hook customizado para operações de estudante
const useStudentOperations = () => {
  const toast = useToastContext();
  const { reFetch } = useStudentsContext();

  const deleteStudent = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/students/delete/${id}`,
          { method: "DELETE" }
        );

        const data = await response.json();

        if (data.status !== 200) {
          toast.error(`Message: ${data.message}`, "Erro ao excluir estudante");
          return false;
        }

        toast.success(data.message, "Estudante excluído com sucesso");
        reFetch();
        return true;
      } catch (error) {
        console.error("Erro ao excluir estudante:", error);
        toast.error("Erro interno do servidor", "Erro ao excluir estudante");
        return false;
      }
    },
    [toast, reFetch]
  );

  return { deleteStudent };
};

// Componente para renderizar as ações da tabela
interface StudentActionsProps {
  student: IStudent;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onSchedule: (id: string) => void;
}

const StudentActions = ({
  student,
  onEdit,
  onDelete,
  onSchedule,
}: StudentActionsProps) => (
  <td className={styles.actions}>
    <Button
      className={styles.pageButton}
      onClick={() => onEdit(student.id)}
      aria-label={`Editar estudante ${student.firstName}`}
    >
      Editar
    </Button>
    <Button
      onClick={() => onDelete(student.id)}
      className={styles.pageButton}
      aria-label={`Excluir estudante ${student.firstName}`}
    >
      Excluir
    </Button>
    <Button
      className={styles.pageButton}
      onClick={() => onSchedule(student.id)}
      aria-label={`Agendar para estudante ${student.firstName}`}
    >
      Agendar
    </Button>
  </td>
);

// Componente para renderizar uma linha da tabela
interface StudentRowProps {
  student: IStudent;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onSchedule: (id: string) => void;
}

const StudentRow = ({
  student,
  onEdit,
  onDelete,
  onSchedule,
}: StudentRowProps) => {
  const whatsappUrl = `https://wa.me/${student.whatsapp.replace(/\D/g, "")}`;

  return (
    <tr key={student.id}>
      <td>{`${student.firstName} ${student.lastName}`}</td>
      <td>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Conversar no WhatsApp com ${student.firstName}`}
        >
          {student.phone}
        </a>
      </td>
      <StudentActions
        student={student}
        onEdit={onEdit}
        onDelete={onDelete}
        onSchedule={onSchedule}
      />
    </tr>
  );
};

// Componente para estados de loading/empty
interface TableStateProps {
  loading: boolean;
  error: string | null;
}

const TableState = ({ loading, error }: TableStateProps) => {
  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;

  return null;
};

export const StudentManagementTable = () => {
  const { students, loading, error } = useStudentsContext();
  const [searchTerm, setSearchTerm] = useState("");

  const {
    modalState,
    openDeleteModal,
    openEditModal,
    openScheduleModal,
    closeModals,
  } = useModalState();

  const { deleteStudent } = useStudentOperations();

  // Filtro otimizado dos estudantes
  const filteredStudents = useMemo(() => {
    if (!searchTerm.trim()) return students;

    const lowerSearch = searchTerm.toLowerCase().trim();
    return students.filter((student) => {
      const searchFields = [
        student.firstName,
        student.lastName,
        student.phone,
        student.whatsapp,
      ].map((field) => field.toLowerCase());

      return searchFields.some((field) => field.includes(lowerSearch));
    });
  }, [students, searchTerm]);

  const handleSearch = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(event.target.value);
    },
    []
  );

  const handleDeleteConfirm = useCallback(async () => {
    if (!modalState.deleteId) return;

    const success = await deleteStudent(modalState.deleteId);
    if (success) {
      closeModals();
    }
  }, [modalState.deleteId, deleteStudent, closeModals]);

  // Busca o estudante que será deletado
  const studentToDelete = modalState.deleteId
    ? students.find((s) => s.id === modalState.deleteId)
    : null;

  return (
    <div className={styles.container}>
      <div className={styles.searchContainer}>
        <input
          type="search"
          placeholder="Pesquisar estudantes..."
          value={searchTerm}
          onChange={handleSearch}
          aria-label="Pesquisar estudantes"
          className={styles.searchInput}
        />
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.studentTable}>
          <thead>
            <tr>
              <th>Nome</th>
              <th>WhatsApp</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <Suspense>
              {filteredStudents.map((student) => (
                <StudentRow
                  key={student.id}
                  student={student}
                  onEdit={openEditModal}
                  onDelete={openDeleteModal}
                  onSchedule={openScheduleModal}
                />
              ))}
            </Suspense>
          </tbody>
        </table>

        <TableState loading={loading} error={error} />
      </div>

      {/* Modais */}
      {modalState.deleteId && studentToDelete && (
        <Alert
          action={handleDeleteConfirm}
          isOpen={true}
          message={`Deseja realmente deletar ${studentToDelete.firstName} do sistema?`}
          onClose={closeModals}
          title="Excluir estudante"
        />
      )}

      {modalState.editId && (
        <StudentFormModal
          onClose={closeModals}
          title={`Editar o estudante ${
            students.find((s) => s.id === modalState.editId)?.firstName
          }`}
          isOpen={true}
          type="edit"
          studentId={modalState.editId}
        />
      )}

      {modalState.scheduleId && (
        <SchedulingFormModal
          onClose={closeModals}
          title="Criar Agendamento"
          isOpen={true}
          type="create"
          initialData={{
            studentId: modalState.scheduleId,
            content: "",
            dateTime: "",
            teacherId: "",
          }}
        />
      )}
    </div>
  );
};
