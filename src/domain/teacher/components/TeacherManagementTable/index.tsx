import { useCallback, useMemo, useState } from "react";
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
import { Table } from "../../../../shared/components/Table";
import type { ITeacher } from "../../../../hooks/useTeacher";

export const TeacherManagementTable = () => {
  const { teachers, error, loading, reFetch } = useTeacherContext();
  const { reFetch: reFetchScheduling } = useSchedulingContext();
  const toast = useToastContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [teacherIdToDelete, setTeacherIdToDelete] = useState<string | null>();
  const [teacherIdToEdit, setTeacherIdToEdit] = useState<ITeacher | null>();
  const [teacherIdToSchedulings, setTeacherIdSchedulings] = useState<
    string | null
  >();
  const [schedulingsForTeacher, setSchedulingsForTeacher] = useState<{
    schedulings: IScheduling[] | [];
    loading: boolean;
    error: string | null;
  }>({
    schedulings: [],
    loading: false,
    error: null,
  });

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
        reFetch();
        handleSchedulingTeacher(id);
        toast.success(response.message);
      })
      .catch((error) => {
        if (error instanceof Error) toast.error(error.message, "Error");
      })
      .finally(() => setTeacherIdToDelete(null));
  };
  const handleSchedulingTeacher = (id: string) => {
    setSchedulingsForTeacher({
      ...schedulingsForTeacher,
      loading: true,
    });
    if (typeof id === "undefined") id = teacherIdToSchedulings as string;
    fetch(`${import.meta.env.VITE_API_URL}/scheduling/teacher/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (data) => {
        const dataJson = await data.json();
        setSchedulingsForTeacher({
          ...schedulingsForTeacher,
          schedulings: dataJson.data,
          loading: false,
        });
        setTeacherIdToDelete(null);
      })
      .catch(() => {
        setTeacherIdToDelete(null);
        setSchedulingsForTeacher({
          ...schedulingsForTeacher,
          loading: false,
          error: "Erro ao buscar agendamentos",
        });
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
    if (!searchTerm.trim()) return teachers;
    const lowerSearch = searchTerm.toLowerCase();
    return teachers.filter((teacher) => {
      const searchFields = [teacher.firstName, teacher.lastName].map((field) =>
        field.toLowerCase()
      );
      return searchFields.some((field) => field.includes(lowerSearch));
    });
  }, [teachers, searchTerm]);

  const handleSearch = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(event.target.value);
    },
    []
  );
  return (
    <div className={styles.container}>
      <input
        type="search"
        aria-label="Pesquisar professores"
        onChange={handleSearch}
        value={searchTerm}
        placeholder="Pesquisar professores..."
        className={styles.searchInput}
      />
      <Table
        loading={loading}
        error={error}
        emptyMessage="Nenhum professor encontrado"
        TableHeader={
          <>
            <th>Nome</th>
            <th>Especialidade</th>
            <th>Status</th>
            <th>Ações</th>
          </>
        }
        TableBody={filteredTeacher.map((teacher) => (
          <tr key={teacher.id}>
            <td>{`${teacher.firstName} ${teacher.lastName}`}</td>
            <td>
              <a>{teacher.expertise}</a>
            </td>
            <td>{teacher.status === "active" ? "Ativo" : "Inativo"}</td>
            <td className={styles.actions}>
              <Button
                className={styles.pageButton}
                onClick={() => setTeacherIdToEdit(teacher)}
              >
                Editar
              </Button>
              <Button
                onClick={() => setTeacherIdToDelete(teacher.id)}
                className={styles.pageButton}
                disabled={teacher.status === "inactive"}
              >
                Desativar
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
      />

      {teacherIdToDelete && (
        <Alert
          action={() => handleDeleteTeacher(teacherIdToDelete)}
          isOpen={!!teacherIdToDelete}
          message={`Deseja realmente desativar ${
            teachers.find((s) => s.id === teacherIdToDelete)?.firstName
          } do sistema?`}
          onClose={() => setTeacherIdToDelete(null)}
          title="Excluir professor"
        />
      )}
      {teacherIdToEdit && (
        <TeacherFormModal
          onClose={() => setTeacherIdToEdit(null)}
          title={`Editar o professor ${
            teachers.find((s) => s.id === teacherIdToEdit.id)?.firstName
          }`}
          isOpen={!!teacherIdToEdit}
          type="edit"
          teacherData={teacherIdToEdit}
        />
      )}
      {teacherIdToSchedulings && (
        <Modal
          isOpen={!!teacherIdToSchedulings}
          onClose={() => setTeacherIdSchedulings(null)}
          title="Agendamentos"
          content={
            <StudentScheduleTable
              schedulings={
                schedulingsForTeacher.schedulings as IScheduling[] as []
              }
              onCancel={(id) => handleCancelScheduling(id)}
              onEdit={() => setTeacherIdSchedulings(null)}
              loading={schedulingsForTeacher.loading}
              error={schedulingsForTeacher.error}
              message="Nenhum agendamento encontrado"
              teacherView={true}
            />
          }
        />
      )}
    </div>
  );
};
