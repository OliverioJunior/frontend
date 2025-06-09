import { useState } from "react";
import styles from "./schedulingManagementTable.module.css";
import { Alert } from "../../../../shared/components/Alert";
import { SchedulingFormModal } from "../SchedulingFormModal";
import { useSchedulingContext } from "../../../../hooks/useScheduingContext";
import { StudentScheduleTable } from "../../../../shared/components/StudentScheduleTable";
import { useToastContext } from "../../../../hooks/useToastContext";

export const SchedulingManagementTable = () => {
  const toast = useToastContext();
  const { scheduling, reFetch, error, loading } = useSchedulingContext();
  const [schedulingIdToCancel, setSchedulingIdToCancel] = useState<
    string | null
  >();
  const [schedulingIdToEdit, setSchedulingIdToEdit] = useState<string | null>();
  const handleCancelScheduling = (id: string) => {
    fetch(`${import.meta.env.VITE_API_URL}/scheduling/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: "cancelado",
      }),
    })
      .then(async (data) => {
        const response = await data.json();
        if (response.status !== 200) {
          toast.error(response.message);
          return;
        }
        toast.success("Agendamento cancelado com sucesso");
        reFetch();
      })
      .catch(() => {
        toast.error("Erro ao cancelar agendamento");
      })
      .finally(() => setSchedulingIdToCancel(null));
  };

  return (
    <div className={styles.container}>
      {loading && !error && <p>Carregando...</p>}
      {error && !loading && <p>{error}</p>}
      {scheduling.length > 0 && !loading && (
        <StudentScheduleTable
          schedulings={scheduling}
          onEdit={(id) => setSchedulingIdToEdit(id)}
          onCancel={(id) => setSchedulingIdToCancel(id)}
        />
      )}
      {schedulingIdToCancel && (
        <Alert
          action={() => handleCancelScheduling(schedulingIdToCancel)}
          isOpen={!!schedulingIdToCancel}
          message={`Deseja realmente cancelar agendamento de ${
            scheduling.find((s) => s.id === schedulingIdToCancel)?.student
              .firstName
          } ${
            scheduling.find((s) => s.id === schedulingIdToCancel)?.student
              .lastName
          } do sistema?`}
          onClose={() => setSchedulingIdToCancel(null)}
          title="Excluir estudante"
        />
      )}
      {schedulingIdToEdit && (
        <SchedulingFormModal
          onClose={() => setSchedulingIdToEdit(null)}
          title="Editar Agendamento"
          isOpen={!!schedulingIdToEdit}
          type="edit"
          schedulingId={schedulingIdToEdit}
        />
      )}
    </div>
  );
};
