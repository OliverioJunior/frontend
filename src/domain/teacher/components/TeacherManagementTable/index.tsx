import { useMemo, useState } from "react";
import styles from "./TeacherManagementTable.module.css";
import { Button } from "../../../../shared/components/Button";
import { Alert } from "../../../../shared/components/Alert";

import { TeacherFormModal } from "../TeacherFormModal";
import { useTeacherContext } from "../../../../hooks/useTeacherContext";
import { StudentScheduleTable } from "../../../../shared/components/StudentScheduleTable";
import { type IScheduling } from "../../../../hooks/useScheduling";
import { Modal } from "../../../../shared/components/Modal";
import { useToastContext } from "../../../../hooks/useToastContext";
import { useSchedulingContext } from "../../../../hooks/useScheduingContext";

export const TeacherManagementTable = () => {
  const { teachers, error, loading } = useTeacherContext();
  const { reFetch: reFetchScheduling } = useSchedulingContext();
  const toast = useToastContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [teacherIdToDelete, setTeacherIdToDelete] = useState<string | null>();
  const [teacherIdToEdit, setTeacherIdToEdit] = useState<string | null>();
  const [teacherIdToSchedulings, setTeacherIdSchedulings] = useState<
    string | null
  >();
  const [schedulingsForTeacher, setSchedulingsForTeacher] = useState<
    IScheduling[] | []
  >([]);
  const handleDeleteTeacher = async (id: string) => {
    fetch(`${import.meta.env.VITE_API_URL}/teachers/delete/${id}`, {
      method: "DELETE",
    })
      .then(async (data) => {
        const response = await data.json();
        if (response.status !== 200) {
          toast.error(response.message);
          return;
        }
        handleSchedulingTeacher(id);
        toast.success(response.message);
      })
      .catch((error) => {
        console.log({ error });
        if (error instanceof Error) toast.error(error.message, "Error");
      })
      .finally(() => setTeacherIdToDelete(null));
  };
  const handleSchedulingTeacher = (id: string) => {
    if (typeof id === "undefined") id = teacherIdToSchedulings as string;
    fetch(`${import.meta.env.VITE_API_URL}/scheduling/teacher/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (data) => {
        const dataJson = await data.json();
        setSchedulingsForTeacher(dataJson.data);
        setTeacherIdToDelete(null);
      })
      .catch(() => {
        setTeacherIdToDelete(null);
      });
  };
  const handleCancelScheduling = (id: string) => {
    fetch(`${import.meta.env.VITE_API_URL}/scheduling/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: "cancelado",
      }),
    }).then(async (data) => {
      const response = await data.json();
      if (response.status !== 200) {
        toast.error(response.message);
        return;
      }
      handleSchedulingTeacher(teacherIdToSchedulings as string);
      toast.success(response.message);
      reFetchScheduling();
    });
  };
  const filteredTeacher = useMemo(() => {
    const lowerSearch = searchTerm.toLowerCase();
    return teachers.filter((teacher) => {
      return (
        teacher.firstName.toLowerCase().includes(lowerSearch) ||
        teacher.lastName.toLowerCase().includes(lowerSearch) ||
        teacher.expertise.toLowerCase().includes(lowerSearch) ||
        teacher.status.toLowerCase().includes(lowerSearch)
      );
    });
  }, [teachers, searchTerm]);

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
            <th>Especialidade</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {loading && !error && <div>Carregando...</div>}
          {!loading && error && <div>{error}</div>}
          {!loading &&
            filteredTeacher.length > 0 &&
            filteredTeacher.map((teacher) => (
              <tr key={teacher.id}>
                <td>{`${teacher.firstName} ${teacher.lastName}`}</td>
                <td>
                  <a>{teacher.expertise}</a>
                </td>
                <td>{teacher.status === "active" ? "Ativo" : "Inativo"}</td>
                <td className={styles.actions}>
                  <Button
                    className={styles.pageButton}
                    onClick={() => setTeacherIdToEdit(teacher.id)}
                  >
                    Editar
                  </Button>
                  <Button
                    onClick={() => setTeacherIdToDelete(teacher.id)}
                    className={styles.pageButton}
                  >
                    Excluir
                  </Button>
                  <Button
                    className={styles.pageButton}
                    onClick={() => {
                      setTeacherIdSchedulings(teacher.id);
                      handleSchedulingTeacher(teacher.id);
                    }}
                  >
                    Visualizar
                  </Button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      {teacherIdToDelete && (
        <Alert
          action={() => handleDeleteTeacher(teacherIdToDelete)}
          isOpen={!!teacherIdToDelete}
          message={`Deseja realmente deletar ${
            teachers.find((s) => s.id === teacherIdToDelete)?.firstName
          } do sistema?`}
          onClose={() => setTeacherIdToDelete(null)}
          title="Excluir professor"
        />
      )}
      {teacherIdToEdit && (
        <TeacherFormModal
          onClose={() => setTeacherIdToEdit(null)}
          title="Editar professor"
          isOpen={!!teacherIdToEdit}
          type="edit"
          teacherId={teacherIdToEdit}
        />
      )}
      {teacherIdToSchedulings && (
        <Modal
          isOpen={!!teacherIdToSchedulings}
          onClose={() => setTeacherIdSchedulings(null)}
          title="Agendamentos"
          content={
            <StudentScheduleTable
              schedulings={schedulingsForTeacher as IScheduling[] as []}
              onCancel={(id) => handleCancelScheduling(id)}
              onEdit={() => setTeacherIdSchedulings(null)}
            />
          }
        />
      )}
      {!filteredTeacher.length && <div>Nenhum professor encontrado</div>}
    </div>
  );
};
