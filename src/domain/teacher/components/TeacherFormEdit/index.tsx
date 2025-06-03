import { Input } from "../../../../shared/components/Input";
import styles from "./teacher-form.module.css";

import { Button } from "../../../../shared/components/Button";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  editTeacherSchema,
  type TeacherEditFormData,
} from "../TeacherForm/teacherSchemas";
import { useTeacherContext } from "../../../../hooks/useTeacherContext";
import { Select } from "../../../../shared/components/Select";
import { useToastContext } from "../../../../hooks/useToastContext";

interface ITeacherForm {
  onClose: () => void;
  teacherId: string;
}

export const TeacherFormEdit: React.FC<ITeacherForm> = ({
  onClose,
  teacherId,
}) => {
  const { reFetch } = useTeacherContext();
  const toast = useToastContext();
  const {
    control,
    handleSubmit,

    formState: { errors },
  } = useForm<TeacherEditFormData>({
    resolver: zodResolver(editTeacherSchema),
  });

  const onSubmit = async (data: TeacherEditFormData) => {
    console.log({ data });
    data.lastName = data.lastName?.trimEnd();

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/teachers/update/${teacherId}`,
        {
          method: "PATCH",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      const json = await response.json();
      if (json.status !== 200) {
        toast.error(json.message, "Erro ao atualizar professor");
        return;
      }
      toast.success(json.message, "Professor atualizado com sucesso");

      reFetch();
      onClose();
    } catch (error) {
      console.error("Error:", error);
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.container}>
      <Controller
        name="firstName"
        control={control}
        render={({ field }) => (
          <Input
            placeholder="Nome"
            value={field.value || ""}
            onChange={(e) => {
              const valor = e.target.value.trim();
              field.onChange(valor);
            }}
            variant={errors.firstName ? "error" : "primary"}
          />
        )}
      />
      {errors.firstName && (
        <span className={styles.error}>{errors.firstName.message}</span>
      )}
      <Controller
        name="lastName"
        control={control}
        render={({ field }) => (
          <Input
            placeholder="Sobrenome"
            value={field.value || ""}
            onChange={(e) => {
              const valor = e.target.value;
              field.onChange(valor);
            }}
            variant={errors.lastName ? "error" : "primary"}
          />
        )}
      />
      {errors.lastName && (
        <span className={styles.error}>{errors.lastName.message}</span>
      )}
      <Controller
        name="expertise"
        control={control}
        render={({ field }) => (
          <Input
            placeholder="Especialidade"
            value={field.value || ""}
            onChange={(e) => {
              const valor = e.target.value;
              field.onChange(valor);
            }}
            variant={errors.expertise ? "error" : "primary"}
          />
        )}
      />
      {errors.expertise && (
        <span className={styles.error}>{errors.expertise.message}</span>
      )}
      <Controller
        name="status"
        control={control}
        render={({ field }) => (
          <Select
            placeholder="Status"
            value={field.value || ""}
            options={[
              { id: "active", firstName: "Ativo", lastName: "" },
              { id: "inactive", firstName: "Inativo", lastName: "" },
            ]}
            onChange={(e) => {
              const valor = e.id;
              console.log({ valor });
              field.onChange(valor);
            }}
          />
        )}
      />
      {errors.status && (
        <span className={styles.error}>{errors.status.message}</span>
      )}

      <Button type="submit" variant="primary">
        Salvard
      </Button>
    </form>
  );
};
